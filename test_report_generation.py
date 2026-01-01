"""Test report generation with Groq."""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from backend.tools.report_writer import ReportWriter
from backend.config import config

# Mock analysis data
analysis_data = {
    "ranked_ligands": [
        {
            "ligand_name": "compound_D",
            "binding_affinity": -10.2,
            "pose_id": 1,
            "total_poses": 3
        },
        {
            "ligand_name": "compound_B",
            "binding_affinity": -9.5,
            "pose_id": 1,
            "total_poses": 4
        }
    ],
    "interactions": {},
    "visualizations": [],
    "metadata": {"total_ligands": 2}
}

print("Testing Report Generation...")
print(f"Groq API Key configured: {bool(config.groq_api_key)}")
print()

writer = ReportWriter(groq_api_key=config.groq_api_key)
print(f"Groq client initialized: {writer.groq_client is not None}")
print()

try:
    report = writer.compose_report(analysis_data)
    
    if report:
        print("✓ Report generated successfully!")
        print(f"Report length: {len(report)} characters")
        print()
        print("First 500 characters:")
        print(report[:500])
    else:
        print("✗ Report is None or empty")
        
except Exception as e:
    print(f"✗ Error generating report: {e}")
    import traceback
    traceback.print_exc()
