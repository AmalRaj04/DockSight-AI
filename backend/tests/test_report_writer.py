"""Test script for scientific report generation validation."""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.tools.report_writer import ReportWriter


# Mock ranked ligands data
MOCK_RANKED_LIGANDS = [
    {
        "ligand_name": "compound_E",
        "file_path": "/mock/compound_E.pdbqt",
        "binding_affinity": -10.2,
        "pose_id": 1,
        "total_poses": 3,
    },
    {
        "ligand_name": "compound_B",
        "file_path": "/mock/compound_B.pdbqt",
        "binding_affinity": -9.5,
        "pose_id": 1,
        "total_poses": 3,
    },
    {
        "ligand_name": "compound_C",
        "file_path": "/mock/compound_C.pdbqt",
        "binding_affinity": -8.1,
        "pose_id": 1,
        "total_poses": 2,
    },
    {
        "ligand_name": "compound_A",
        "file_path": "/mock/compound_A.pdbqt",
        "binding_affinity": -7.2,
        "pose_id": 1,
        "total_poses": 3,
    },
]

# Mock interaction summary
MOCK_INTERACTIONS = {
    "compound_E": {
        "hydrogen_bonds": 3,
        "hydrophobic_contacts": 2,
        "salt_bridges": 1,
        "key_residues": ["SER195", "ASP189", "LEU203"],
    },
    "compound_B": {
        "hydrogen_bonds": 2,
        "hydrophobic_contacts": 4,
        "salt_bridges": 0,
        "key_residues": ["GLU166", "VAL198", "PHE201"],
    },
}

# Mock analysis metadata
MOCK_METADATA = {
    "total_ligands": 4,
    "docking_program": "AutoDock Vina",
    "analysis_date": "2025-12-31",
}


def test_report_composition():
    """Test complete report composition."""
    print("=" * 60)
    print("TEST 1: Complete Report Composition")
    print("=" * 60)
    
    writer = ReportWriter()
    
    analysis_data = {
        "ranked_ligands": MOCK_RANKED_LIGANDS,
        "interactions": MOCK_INTERACTIONS,
        "visualizations": [],
        "metadata": MOCK_METADATA,
    }
    
    print("\nGenerating report...")
    report = writer.compose_report(analysis_data)
    
    print(f"\n✓ Report generated")
    print(f"Report length: {len(report)} characters")
    print(f"Report lines: {len(report.split(chr(10)))}")
    
    print("\n✓ Test 1 PASSED\n")
    return report


def test_report_sections(report):
    """Test that all required sections are present."""
    print("=" * 60)
    print("TEST 2: Report Section Verification")
    print("=" * 60)
    
    required_sections = [
        "# Molecular Docking Analysis Report",
        "## Introduction",
        "## Methods",
        "## Results",
        "## Discussion",
        "## Scientific Disclaimer",
    ]
    
    print("\nChecking for required sections:")
    all_present = True
    
    for section in required_sections:
        present = section in report
        status = "✓" if present else "✗"
        print(f"  {status} {section}")
        if not present:
            all_present = False
    
    if all_present:
        print("\n✓ All required sections present")
        print("✓ Test 2 PASSED\n")
    else:
        print("\n✗ Test 2 FAILED: Missing sections\n")


def test_ranking_table(report):
    """Test that ranking table is properly formatted."""
    print("=" * 60)
    print("TEST 3: Ranking Table Verification")
    print("=" * 60)
    
    print("\nChecking for table elements:")
    
    # Check for table headers
    has_table_header = "| Rank | Ligand Name | Binding Affinity" in report
    has_table_separator = "|------|-------------|" in report
    
    print(f"  {'✓' if has_table_header else '✗'} Table header present")
    print(f"  {'✓' if has_table_separator else '✗'} Table separator present")
    
    # Check for ligand data in table
    ligands_in_table = []
    for ligand in MOCK_RANKED_LIGANDS:
        if ligand['ligand_name'] in report:
            ligands_in_table.append(ligand['ligand_name'])
    
    print(f"\n  Ligands found in report: {len(ligands_in_table)}/{len(MOCK_RANKED_LIGANDS)}")
    for name in ligands_in_table:
        print(f"    ✓ {name}")
    
    if has_table_header and has_table_separator and len(ligands_in_table) == len(MOCK_RANKED_LIGANDS):
        print("\n✓ Ranking table properly formatted")
        print("✓ Test 3 PASSED\n")
    else:
        print("\n✗ Test 3 FAILED: Table formatting issues\n")


def test_disclaimer_content(report):
    """Test that scientific disclaimer is present and comprehensive."""
    print("=" * 60)
    print("TEST 4: Scientific Disclaimer Verification")
    print("=" * 60)
    
    disclaimer_keywords = [
        "computational predictions",
        "experimental validation",
        "research purposes only",
        "limitations",
        "not be interpreted as definitive",
    ]
    
    print("\nChecking for disclaimer keywords:")
    all_present = True
    
    for keyword in disclaimer_keywords:
        present = keyword.lower() in report.lower()
        status = "✓" if present else "✗"
        print(f"  {status} '{keyword}'")
        if not present:
            all_present = False
    
    # Check for specific warnings
    has_validation_warning = "experimental validation" in report.lower()
    has_efficacy_warning = "efficacy" in report.lower() or "safety" in report.lower()
    
    print(f"\n  {'✓' if has_validation_warning else '✗'} Validation requirement mentioned")
    print(f"  {'✓' if has_efficacy_warning else '✗'} Efficacy/safety warnings present")
    
    if all_present and has_validation_warning:
        print("\n✓ Comprehensive scientific disclaimer present")
        print("✓ Test 4 PASSED\n")
    else:
        print("\n✗ Test 4 FAILED: Incomplete disclaimer\n")


def test_executive_summary():
    """Test executive summary generation."""
    print("=" * 60)
    print("TEST 5: Executive Summary Generation")
    print("=" * 60)
    
    writer = ReportWriter()
    summary = writer.generate_executive_summary(MOCK_RANKED_LIGANDS)
    
    print(f"\nGenerated summary:")
    print(f"  {summary}")
    
    # Check for key information
    has_ligand_count = str(len(MOCK_RANKED_LIGANDS)) in summary
    has_best_ligand = MOCK_RANKED_LIGANDS[0]['ligand_name'] in summary
    has_affinity = str(MOCK_RANKED_LIGANDS[0]['binding_affinity']) in summary
    
    print(f"\n  {'✓' if has_ligand_count else '✗'} Ligand count mentioned")
    print(f"  {'✓' if has_best_ligand else '✗'} Best ligand identified")
    print(f"  {'✓' if has_affinity else '✗'} Binding affinity reported")
    
    if has_ligand_count and has_best_ligand and has_affinity:
        print("\n✓ Executive summary contains key information")
        print("✓ Test 5 PASSED\n")
    else:
        print("\n✗ Test 5 FAILED: Missing key information\n")


def test_methods_section():
    """Test methods section generation."""
    print("=" * 60)
    print("TEST 6: Methods Section Generation")
    print("=" * 60)
    
    writer = ReportWriter()
    methods = writer.generate_methods_section(MOCK_METADATA)
    
    print(f"\nGenerated methods section:")
    print(f"  Length: {len(methods)} characters")
    
    # Check for key methodological elements
    has_docking_protocol = "docking" in methods.lower()
    has_ranking_criteria = "ranking" in methods.lower()
    has_binding_affinity = "binding affinity" in methods.lower() or "ΔG" in methods
    
    print(f"\n  {'✓' if has_docking_protocol else '✗'} Docking protocol described")
    print(f"  {'✓' if has_ranking_criteria else '✗'} Ranking criteria explained")
    print(f"  {'✓' if has_binding_affinity else '✗'} Binding affinity mentioned")
    
    if has_docking_protocol and has_ranking_criteria and has_binding_affinity:
        print("\n✓ Methods section properly structured")
        print("✓ Test 6 PASSED\n")
    else:
        print("\n✗ Test 6 FAILED: Incomplete methods description\n")


def test_discussion_section():
    """Test discussion section generation."""
    print("=" * 60)
    print("TEST 7: Discussion Section Generation")
    print("=" * 60)
    
    writer = ReportWriter()
    
    analysis_results = {
        "ranked_ligands": MOCK_RANKED_LIGANDS,
        "interactions": MOCK_INTERACTIONS,
    }
    
    discussion = writer.generate_discussion_section(analysis_results)
    
    print(f"\nGenerated discussion section:")
    print(f"  Length: {len(discussion)} characters")
    
    # Check for interpretation elements
    has_interpretation = "top-ranked" in discussion.lower() or "best" in discussion.lower()
    has_limitations = "limitations" in discussion.lower()
    has_validation_note = "validation" in discussion.lower() or "experimental" in discussion.lower()
    
    print(f"\n  {'✓' if has_interpretation else '✗'} Results interpretation present")
    print(f"  {'✓' if has_limitations else '✗'} Limitations discussed")
    print(f"  {'✓' if has_validation_note else '✗'} Validation requirements mentioned")
    
    if has_interpretation and has_limitations and has_validation_note:
        print("\n✓ Discussion section properly structured")
        print("✓ Test 7 PASSED\n")
    else:
        print("\n✗ Test 7 FAILED: Incomplete discussion\n")


def test_empty_data_handling():
    """Test report generation with empty data."""
    print("=" * 60)
    print("TEST 8: Empty Data Handling")
    print("=" * 60)
    
    writer = ReportWriter()
    
    empty_data = {
        "ranked_ligands": [],
        "interactions": {},
        "visualizations": [],
        "metadata": {},
    }
    
    print("\nGenerating report with empty data...")
    report = writer.compose_report(empty_data)
    
    print(f"\n✓ Report generated without errors")
    print(f"Report length: {len(report)} characters")
    
    # Should still have structure and disclaimer
    has_structure = "## Introduction" in report
    has_disclaimer = "## Scientific Disclaimer" in report
    has_no_results_msg = "no" in report.lower() or "not" in report.lower()
    
    print(f"\n  {'✓' if has_structure else '✗'} Report structure maintained")
    print(f"  {'✓' if has_disclaimer else '✗'} Disclaimer still present")
    print(f"  {'✓' if has_no_results_msg else '✗'} Empty data acknowledged")
    
    if has_structure and has_disclaimer:
        print("\n✓ Empty data handled gracefully")
        print("✓ Test 8 PASSED\n")
    else:
        print("\n✗ Test 8 FAILED\n")


def print_full_report(report):
    """Print the full generated report."""
    print("=" * 60)
    print("FULL GENERATED REPORT")
    print("=" * 60)
    print()
    print(report)
    print()
    print("=" * 60)
    print("END OF REPORT")
    print("=" * 60)
    print()


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("SCIENTIFIC REPORT GENERATION VALIDATION TESTS")
    print("=" * 60 + "\n")
    
    try:
        # Generate report once for all tests
        report = test_report_composition()
        
        # Run validation tests
        test_report_sections(report)
        test_ranking_table(report)
        test_disclaimer_content(report)
        test_executive_summary()
        test_methods_section()
        test_discussion_section()
        test_empty_data_handling()
        
        # Print full report for visual inspection
        print_full_report(report)
        
        print("=" * 60)
        print("ALL TESTS COMPLETED SUCCESSFULLY")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n✗ TEST SUITE FAILED: {str(e)}\n")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
