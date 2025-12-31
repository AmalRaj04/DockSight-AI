"""Tool for parsing docking output files."""

import os
import re


class DockingParser:
    """Parses docking results from various formats."""

    def __init__(self):
        self.supported_extensions = [".pdbqt", ".log"]

    def parse_vina_output(self, file_path):
        """Parse AutoDock Vina output file."""
        if not self.validate_format(file_path):
            return {"error": f"Unsupported file format: {file_path}"}

        try:
            with open(file_path, "r") as f:
                content = f.read()

            ligand_name = self._extract_ligand_name(file_path, content)
            poses = self._extract_poses_from_content(content)

            if not poses:
                return {"error": f"No valid poses found in {file_path}"}

            return {
                "ligand_name": ligand_name,
                "file_path": file_path,
                "poses": poses,
                "num_poses": len(poses),
            }

        except FileNotFoundError:
            return {"error": f"File not found: {file_path}"}
        except Exception as e:
            return {"error": f"Failed to parse {file_path}: {str(e)}"}

    def extract_binding_scores(self, parsed_data):
        """Extract binding affinity scores from parsed data."""
        if "error" in parsed_data:
            return []

        scores = []
        for pose in parsed_data.get("poses", []):
            scores.append({
                "pose_id": pose["pose_id"],
                "binding_affinity": pose["binding_affinity"],
            })
        return scores

    def extract_poses(self, parsed_data):
        """Extract molecular poses from parsed data."""
        if "error" in parsed_data:
            return []
        return parsed_data.get("poses", [])

    def extract_ligand_info(self, parsed_data):
        """Extract ligand metadata from parsed data."""
        if "error" in parsed_data:
            return {}

        return {
            "ligand_name": parsed_data.get("ligand_name"),
            "file_path": parsed_data.get("file_path"),
            "num_poses": parsed_data.get("num_poses"),
        }

    def validate_format(self, file_path):
        """Validate docking file format is supported."""
        ext = os.path.splitext(file_path)[1].lower()
        return ext in self.supported_extensions

    def _extract_ligand_name(self, file_path, content):
        """Extract ligand name from file path or content."""
        # Use filename without extension as ligand name
        base_name = os.path.basename(file_path)
        ligand_name = os.path.splitext(base_name)[0]
        return ligand_name

    def _extract_poses_from_content(self, content):
        """Extract poses and binding affinities from file content."""
        poses = []

        # Parse Vina log format: "   1        -8.5      0.000      0.000"
        # Pattern matches pose number and binding affinity
        pattern = r"^\s+(\d+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"

        for line in content.split("\n"):
            match = re.match(pattern, line)
            if match:
                pose_id = int(match.group(1))
                binding_affinity = float(match.group(2))

                poses.append({
                    "pose_id": pose_id,
                    "binding_affinity": binding_affinity,
                })

        # If no log format found, try PDBQT format
        if not poses:
            poses = self._extract_poses_from_pdbqt(content)

        return poses

    def _extract_poses_from_pdbqt(self, content):
        """Extract poses from PDBQT format."""
        poses = []
        pose_id = 0

        # Look for REMARK lines with VINA RESULT
        pattern = r"REMARK VINA RESULT:\s+([-\d.]+)"

        for line in content.split("\n"):
            match = re.search(pattern, line)
            if match:
                pose_id += 1
                binding_affinity = float(match.group(1))
                poses.append({
                    "pose_id": pose_id,
                    "binding_affinity": binding_affinity,
                })

        return poses
