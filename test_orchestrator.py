"""Test orchestrator directly."""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from backend.agent.orchestrator import DockingAnalysisOrchestrator
from backend.config import config

print("Testing Orchestrator...")
print(f"Groq API Key: {bool(config.groq_api_key)}")
print()

orchestrator = DockingAnalysisOrchestrator(config=config, groq_api_key=config.groq_api_key)

# Test with sample file
files = ["sample_data/compound_D.pdbqt"]

print(f"Running analysis on: {files}")
result = orchestrator.run_analysis(files, enable_attestation=True)

print(f"\nStatus: {result['status']}")
print(f"Ligands: {len(result['ranked_ligands'])}")
print(f"Report: {len(result.get('report', '') or '')} chars")
print(f"Attestation: {result.get('attestation') is not None}")

if result.get('report'):
    print("\nFirst 300 chars of report:")
    print(result['report'][:300])
else:
    print("\n✗ Report is None or empty")
    print(f"Errors: {result.get('errors', [])}")
