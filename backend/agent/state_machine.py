"""State machine for tracking agent execution stages."""


class AnalysisState:
    """Represents the current state of the analysis workflow."""

    def __init__(self):
        self.raw_files = []
        self.parsed_docking_results = []
        self.ranked_ligands = []
        self.best_poses = []
        self.interactions = {}
        self.visualization_paths = []
        self.final_report_md = None
        self.analysis_hash = None
        self.report_hash = None
        self.attestation_tx = None
        self.validation_errors = []
        self.current_stage = "initialized"

    def add_raw_file(self, file_path):
        """Add a raw docking file to state."""
        self.raw_files.append(file_path)

    def add_parsed_result(self, parsed_data):
        """Add parsed docking result to state."""
        self.parsed_docking_results.append(parsed_data)

    def set_ranked_ligands(self, ranked_ligands):
        """Store ranked ligands in state."""
        self.ranked_ligands = ranked_ligands
        self.best_poses = ranked_ligands  # Best poses are the ranked ligands

    def set_visualization_paths(self, visualization_paths):
        """Store visualization output paths in state."""
        self.visualization_paths = visualization_paths

    def set_final_report(self, report_md):
        """Store final report in state."""
        self.final_report_md = report_md

    def set_attestation(self, analysis_id, input_hash, report_hash, tx_signature):
        """Store attestation data in state."""
        self.analysis_hash = input_hash
        self.report_hash = report_hash
        self.attestation_tx = tx_signature

    def add_validation_error(self, error):
        """Record a validation error."""
        self.validation_errors.append(error)

    def has_errors(self):
        """Check if any validation errors exist."""
        return len(self.validation_errors) > 0


class StateMachine:
    """Manages transitions between analysis stages."""

    def __init__(self):
        self.state = AnalysisState()
        self.allowed_transitions = {
            "initialized": ["parsing"],
            "parsing": ["parsed", "failed"],
            "parsed": ["ranking"],
            "ranking": ["visualizing", "reporting", "complete", "failed"],
            "visualizing": ["visualized", "failed"],
            "visualized": ["reporting"],
            "reporting": ["attesting", "complete", "failed"],
            "attesting": ["attested", "complete", "failed"],
            "attested": ["complete"],
        }

    def transition_to(self, next_stage):
        """Transition to the next analysis stage."""
        current = self.state.current_stage
        if next_stage in self.allowed_transitions.get(current, []):
            self.state.current_stage = next_stage
            return True
        return False

    def get_current_state(self):
        """Get the current state of the analysis."""
        return self.state

    def is_complete(self):
        """Check if the analysis workflow is complete."""
        return self.state.current_stage == "complete"

    def can_transition(self, target_stage):
        """Validate if transition to target stage is allowed."""
        current = self.state.current_stage
        return target_stage in self.allowed_transitions.get(current, [])
