"""Tool for ranking and comparing ligands."""


class LigandRanker:
    """Ranks ligands based on binding affinity and other criteria."""

    def __init__(self):
        pass

    def rank_by_binding_affinity(self, parsed_docking_results):
        """Rank ligands by binding affinity scores."""
        if not parsed_docking_results:
            return {"ranked_ligands": [], "errors": ["No docking results to rank"]}

        best_poses = self._select_best_poses(parsed_docking_results)
        
        if not best_poses:
            return {"ranked_ligands": [], "errors": ["No valid poses found for ranking"]}

        # Sort by binding affinity (ascending, most negative = best)
        ranked = sorted(best_poses, key=lambda x: x["binding_affinity"])

        return {
            "ranked_ligands": ranked,
            "errors": [],
        }

    def _select_best_poses(self, parsed_docking_results):
        """Select the best pose per ligand (lowest ΔG)."""
        best_poses = []
        errors = []

        for result in parsed_docking_results:
            ligand_name = result.get("ligand_name")
            poses = result.get("poses", [])

            if not poses:
                errors.append(f"No poses found for ligand: {ligand_name}")
                continue

            # Find pose with lowest binding affinity
            best_pose = min(poses, key=lambda p: p["binding_affinity"])

            best_poses.append({
                "ligand_name": ligand_name,
                "file_path": result.get("file_path"),
                "binding_affinity": best_pose["binding_affinity"],
                "pose_id": best_pose["pose_id"],
                "total_poses": len(poses),
            })

        return best_poses

    def compare_ligands(self, ligand_a, ligand_b):
        """Compare two ligands based on multiple criteria."""
        # Not implemented in this scope
        pass

    def filter_by_threshold(self, ligands, threshold):
        """Filter ligands below binding affinity threshold."""
        # Not implemented in this scope
        pass

    def generate_ranking_summary(self, ranked_ligands):
        """Generate summary of ranking results."""
        if not ranked_ligands:
            return {"total_ligands": 0, "best_ligand": None}

        return {
            "total_ligands": len(ranked_ligands),
            "best_ligand": ranked_ligands[0]["ligand_name"],
            "best_affinity": ranked_ligands[0]["binding_affinity"],
        }
