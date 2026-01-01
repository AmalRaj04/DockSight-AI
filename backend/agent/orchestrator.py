"""Agent orchestrator that controls the full docking analysis workflow."""

from backend.agent.state_machine import StateMachine
from backend.tools.docking_parser import DockingParser
from backend.tools.ranking import LigandRanker
from backend.tools.report_writer import ReportWriter
from backend.tools.visualization import VisualizationGenerator
from backend.tools.solana_attestation import SolanaAttestationTool


class DockingAnalysisOrchestrator:
    """Main orchestrator for the docking analysis agent."""

    def __init__(self, config=None, groq_api_key=None, enable_solana=False):
        self.state_machine = StateMachine()
        self.parser = DockingParser()
        self.ranker = LigandRanker()
        self.report_writer = ReportWriter(groq_api_key=groq_api_key)
        self.visualizer = VisualizationGenerator()
        # Enable real Solana if requested and configured
        dry_run = not enable_solana
        self.solana_attestor = SolanaAttestationTool(config, dry_run=dry_run)

    def run_analysis(self, docking_input, enable_attestation=True):
        """Execute the complete docking analysis pipeline."""
        # Step 1: Validate and parse
        if not self.validate_input(docking_input):
            return {"status": "failed", "errors": self.state_machine.state.validation_errors}

        self.parse_docking_results(docking_input)

        if self.state_machine.state.has_errors():
            return {"status": "failed", "errors": self.state_machine.state.validation_errors}

        # Step 2: Rank ligands
        ranking_result = self.rank_ligands(self.state_machine.state.parsed_docking_results)

        if ranking_result.get("errors"):
            for error in ranking_result["errors"]:
                self.state_machine.state.add_validation_error(error)
            return {"status": "failed", "errors": self.state_machine.state.validation_errors}

        # Step 3: Generate visualizations
        self.generate_visualizations(
            self.state_machine.state.ranked_ligands,
            self.state_machine.state.interactions
        )

        # Step 4: Generate report
        report = self.generate_report(
            self.state_machine.state.ranked_ligands,
            self.state_machine.state.interactions,
            self.state_machine.state.visualization_paths
        )

        # Step 5: Attest to Solana (optional)
        attestation_result = None
        if enable_attestation:
            attestation_result = self.attest_to_solana({
                "report": report,
                "ranked_ligands": self.state_machine.state.ranked_ligands,
            })

        return {
            "status": "complete",
            "ranked_ligands": self.state_machine.state.ranked_ligands,
            "interactions": self.state_machine.state.interactions,
            "visualizations": self.state_machine.state.visualization_paths,
            "report": report,
            "attestation": attestation_result,
        }

    def validate_input(self, docking_input):
        """Validate docking input data before processing."""
        if not docking_input:
            self.state_machine.state.add_validation_error("No docking input provided")
            return False

        if not isinstance(docking_input, list):
            docking_input = [docking_input]

        for file_path in docking_input:
            if not isinstance(file_path, str):
                self.state_machine.state.add_validation_error(f"Invalid file path type: {type(file_path)}")
                continue

            if not self.parser.validate_format(file_path):
                self.state_machine.state.add_validation_error(f"Unsupported file format: {file_path}")
                continue

            self.state_machine.state.add_raw_file(file_path)

        return len(self.state_machine.state.raw_files) > 0

    def parse_docking_results(self, docking_input):
        """Parse raw docking output files."""
        if not self.state_machine.transition_to("parsing"):
            self.state_machine.state.add_validation_error("Invalid state transition to parsing")
            return

        for file_path in self.state_machine.state.raw_files:
            parsed_result = self.parser.parse_vina_output(file_path)

            if "error" in parsed_result:
                self.state_machine.state.add_validation_error(parsed_result["error"])
            else:
                self.state_machine.state.add_parsed_result(parsed_result)

        if self.state_machine.state.has_errors():
            self.state_machine.transition_to("failed")
        else:
            self.state_machine.transition_to("parsed")

    def rank_ligands(self, parsed_data):
        """Rank ligands based on binding affinity."""
        if not self.state_machine.transition_to("ranking"):
            self.state_machine.state.add_validation_error("Invalid state transition to ranking")
            return {"ranked_ligands": [], "errors": ["State transition failed"]}

        ranking_result = self.ranker.rank_by_binding_affinity(parsed_data)

        if ranking_result["errors"]:
            for error in ranking_result["errors"]:
                self.state_machine.state.add_validation_error(error)
            self.state_machine.transition_to("failed")
        else:
            self.state_machine.state.set_ranked_ligands(ranking_result["ranked_ligands"])
            # Don't transition to complete yet - allow visualization and reporting
            # self.state_machine.transition_to("complete")

        return ranking_result

    def extract_interactions(self, parsed_data):
        """Extract molecular interactions from docking poses."""
        # Not implemented in this scope
        pass

    def generate_visualizations(self, parsed_data, interactions):
        """Generate molecular visualization outputs."""
        if not self.state_machine.transition_to("visualizing"):
            self.state_machine.state.add_validation_error("Invalid state transition to visualizing")
            return

        # Generate visualizations for best poses only
        best_poses = self.state_machine.state.best_poses

        if not best_poses:
            self.state_machine.state.add_validation_error("No best poses available for visualization")
            return

        visualization_paths = []

        # Generate binding pose images for top ligands
        for pose in best_poses[:5]:  # Limit to top 5 ligands
            viz_result = self.visualizer.generate_binding_pose_image(pose)
            
            if "error" in viz_result:
                # Log error but continue with other visualizations
                self.state_machine.state.add_validation_error(viz_result["error"])
            else:
                visualization_paths.append(viz_result)

        # Generate comparison chart
        comparison_result = self.visualizer.generate_comparison_chart(best_poses)
        if "error" not in comparison_result:
            visualization_paths.append(comparison_result)

        self.state_machine.state.set_visualization_paths(visualization_paths)
        self.state_machine.transition_to("visualized")

    def generate_report(self, ranked_data, interactions, visualizations):
        """Generate scientific report from analysis results."""
        if not self.state_machine.transition_to("reporting"):
            self.state_machine.state.add_validation_error("Invalid state transition to reporting")
            return None

        analysis_data = {
            "ranked_ligands": ranked_data,
            "interactions": interactions,
            "visualizations": visualizations,
            "metadata": {
                "total_ligands": len(ranked_data) if ranked_data else 0,
            }
        }

        report_md = self.report_writer.compose_report(analysis_data)
        self.state_machine.state.set_final_report(report_md)
        # Don't transition to complete yet - allow attestation
        # self.state_machine.transition_to("complete")

        return report_md

    def attest_to_solana(self, report_metadata):
        """Attest analysis metadata to Solana blockchain."""
        if not self.state_machine.transition_to("attesting"):
            # Attestation is optional - log but don't fail
            self.state_machine.state.add_validation_error("Skipping attestation: invalid state transition")
            return None

        try:
            attestation_data = {
                "raw_files": self.state_machine.state.raw_files,
                "final_report_md": self.state_machine.state.final_report_md,
                "ranked_ligands": self.state_machine.state.ranked_ligands,
            }

            attestation_result = self.solana_attestor.attest_analysis(attestation_data)

            if attestation_result.get("success"):
                self.state_machine.state.set_attestation(
                    attestation_result["analysis_id"],
                    attestation_result["input_hash"],
                    attestation_result["report_hash"],
                    attestation_result["transaction_signature"]
                )
                self.state_machine.transition_to("attested")
                return attestation_result
            else:
                # Attestation failure is non-critical
                error_msg = attestation_result.get("error", "Unknown attestation error")
                self.state_machine.state.add_validation_error(f"Attestation failed: {error_msg}")
                return None

        except Exception as e:
            # Graceful failure - analysis can complete without attestation
            self.state_machine.state.add_validation_error(f"Attestation exception: {str(e)}")
            return None

    def handle_failure(self, error):
        """Handle failures during analysis execution."""
        self.state_machine.state.add_validation_error(str(error))
