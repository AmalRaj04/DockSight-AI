"""Tool for generating molecular visualizations."""

import os
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import numpy as np


class VisualizationGenerator:
    """Generates molecular interaction visualizations."""

    def __init__(self):
        self.output_dir = "outputs/visualizations"
        self.default_style = {
            "protein_color": "lightgray",
            "ligand_color": "green",
            "pocket_color": "cyan",
            "image_size": (800, 600),
        }

    def generate_binding_pose_image(self, pose_data):
        """Generate 2D/3D image of binding pose."""
        ligand_name = pose_data.get("ligand_name")
        pose_id = pose_data.get("pose_id")
        binding_affinity = pose_data.get("binding_affinity")

        try:
            # Generate deterministic filename
            output_filename = self._generate_filename(ligand_name, pose_id, "binding_pose")
            output_path = os.path.join(self.output_dir, output_filename)

            # Ensure output directory exists
            os.makedirs(self.output_dir, exist_ok=True)

            # Generate a simple visualization
            self._create_binding_pose_viz(ligand_name, binding_affinity, output_path)

            return {
                "ligand_name": ligand_name,
                "pose_id": pose_id,
                "output_path": output_path,
                "visualization_type": "binding_pose",
            }

        except Exception as e:
            return {"error": f"Visualization generation failed: {str(e)}"}

    def generate_comparison_chart(self, ranked_ligands):
        """Generate comparison chart for multiple ligands."""
        if not ranked_ligands:
            return {"error": "No ranked ligands provided"}

        try:
            output_filename = "ligand_comparison_chart.png"
            output_path = os.path.join(self.output_dir, output_filename)

            os.makedirs(self.output_dir, exist_ok=True)

            # Generate actual chart
            self._create_comparison_chart(ranked_ligands, output_path)

            return {
                "output_path": output_path,
                "visualization_type": "comparison_chart",
                "num_ligands": len(ranked_ligands),
            }

        except Exception as e:
            return {"error": f"Comparison chart generation failed: {str(e)}"}

    def _create_binding_pose_viz(self, ligand_name, binding_affinity, output_path):
        """Create a simple binding pose visualization."""
        fig, ax = plt.subplots(figsize=(8, 6), facecolor='white')
        
        # Create a simple representation
        affinity_val = float(binding_affinity)
        
        # Color based on binding strength
        if affinity_val <= -9.0:
            color = '#22c55e'  # Green
            strength = "Strong"
        elif affinity_val <= -7.0:
            color = '#eab308'  # Yellow
            strength = "Moderate"
        else:
            color = '#ef4444'  # Red
            strength = "Weak"
        
        # Draw a simple molecular representation
        circle = plt.Circle((0.5, 0.5), 0.3, color=color, alpha=0.3)
        ax.add_patch(circle)
        
        # Add ligand name
        ax.text(0.5, 0.7, ligand_name, ha='center', va='center', 
                fontsize=20, fontweight='bold')
        
        # Add binding affinity
        ax.text(0.5, 0.5, f'{binding_affinity} kcal/mol', ha='center', va='center',
                fontsize=16, fontweight='bold', color=color)
        
        # Add strength indicator
        ax.text(0.5, 0.3, f'{strength} Binding', ha='center', va='center',
                fontsize=14, style='italic', color='gray')
        
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis('off')
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
        plt.close()

    def _create_comparison_chart(self, ranked_ligands, output_path):
        """Create a comparison bar chart."""
        ligand_names = [l['ligand_name'] for l in ranked_ligands]
        affinities = [float(l['binding_affinity']) for l in ranked_ligands]
        
        # Color code by strength
        colors = []
        for aff in affinities:
            if aff <= -9.0:
                colors.append('#22c55e')  # Green
            elif aff <= -7.0:
                colors.append('#eab308')  # Yellow
            else:
                colors.append('#ef4444')  # Red
        
        fig, ax = plt.subplots(figsize=(10, 6), facecolor='white')
        
        bars = ax.barh(ligand_names, affinities, color=colors, alpha=0.8, edgecolor='black')
        
        # Add value labels
        for i, (bar, aff) in enumerate(zip(bars, affinities)):
            ax.text(aff - 0.3, i, f'{aff:.1f}', va='center', ha='right',
                   fontweight='bold', color='white', fontsize=10)
        
        ax.set_xlabel('Binding Affinity (kcal/mol)', fontsize=12, fontweight='bold')
        ax.set_title('Ligand Binding Affinity Comparison', fontsize=14, fontweight='bold', pad=20)
        ax.grid(axis='x', alpha=0.3, linestyle='--')
        ax.axvline(x=-9.0, color='green', linestyle='--', alpha=0.5, linewidth=1)
        ax.axvline(x=-7.0, color='orange', linestyle='--', alpha=0.5, linewidth=1)
        
        # Add legend
        from matplotlib.patches import Patch
        legend_elements = [
            Patch(facecolor='#22c55e', label='Strong (≤ -9.0)'),
            Patch(facecolor='#eab308', label='Moderate (-9.0 to -7.0)'),
            Patch(facecolor='#ef4444', label='Weak (> -7.0)')
        ]
        ax.legend(handles=legend_elements, loc='lower right', fontsize=9)
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
        plt.close()

    def _generate_filename(self, ligand_name, pose_id, viz_type):
        """Generate deterministic filename for visualization."""
        safe_name = ligand_name.replace(" ", "_").replace("/", "_")
        
        if pose_id is not None:
            return f"{safe_name}_pose{pose_id}_{viz_type}.png"
        else:
            return f"{safe_name}_{viz_type}.png"
