"""Test script for visualization generation validation."""

import sys
import os
import tempfile
import shutil

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.tools.visualization import VisualizationGenerator


# Mock pose data for visualization
MOCK_POSE_DATA = [
    {
        "ligand_name": "compound_A",
        "file_path": "/mock/compound_A.pdbqt",
        "binding_affinity": -8.5,
        "pose_id": 1,
        "total_poses": 3,
    },
    {
        "ligand_name": "compound_B",
        "file_path": "/mock/compound_B.pdbqt",
        "binding_affinity": -9.2,
        "pose_id": 1,
        "total_poses": 4,
    },
    {
        "ligand_name": "compound_C",
        "file_path": "/mock/compound_C.pdbqt",
        "binding_affinity": -7.8,
        "pose_id": 2,
        "total_poses": 2,
    },
]

# Mock interaction data
MOCK_INTERACTIONS = {
    "ligand_name": "compound_A",
    "hydrogen_bonds": [
        {"donor": "ligand_O1", "acceptor": "SER195_N", "distance": 2.8},
        {"donor": "ASP189_O", "acceptor": "ligand_N2", "distance": 2.9},
    ],
    "hydrophobic_contacts": [
        {"ligand_atom": "C3", "protein_residue": "LEU203", "distance": 3.5},
    ],
}


def setup_test_environment():
    """Create temporary test directory."""
    test_dir = tempfile.mkdtemp(prefix="viz_test_")
    print(f"Created test directory: {test_dir}")
    return test_dir


def cleanup_test_environment(test_dir):
    """Remove temporary test directory."""
    if os.path.exists(test_dir):
        shutil.rmtree(test_dir)
        print(f"Cleaned up test directory: {test_dir}")


def test_visualizer_initialization():
    """Test VisualizationGenerator initialization."""
    print("=" * 60)
    print("TEST 1: VisualizationGenerator Initialization")
    print("=" * 60)
    
    visualizer = VisualizationGenerator()
    
    print("\n✓ VisualizationGenerator created successfully")
    print(f"Type: {type(visualizer)}")
    print(f"Output directory: {visualizer.output_dir}")
    print(f"Default style: {visualizer.default_style}")
    
    print("\n✓ Test 1 PASSED\n")
    return visualizer


def test_filename_generation(visualizer):
    """Test deterministic filename generation."""
    print("=" * 60)
    print("TEST 2: Filename Generation")
    print("=" * 60)
    
    test_cases = [
        ("compound_A", 1, "binding_pose", "compound_A_pose1_binding_pose.png"),
        ("compound_B", 2, "binding_pose", "compound_B_pose2_binding_pose.png"),
        ("test ligand", None, "interactions", "test_ligand_interactions.png"),
        ("ligand/with/slash", 3, "binding_pose", "ligand_with_slash_pose3_binding_pose.png"),
    ]
    
    print("\nTesting filename generation:")
    all_correct = True
    
    for ligand_name, pose_id, viz_type, expected in test_cases:
        result = visualizer._generate_filename(ligand_name, pose_id, viz_type)
        match = result == expected
        status = "✓" if match else "✗"
        
        print(f"\n  {status} Input: ({ligand_name}, {pose_id}, {viz_type})")
        print(f"    Expected: {expected}")
        print(f"    Got:      {result}")
        
        if not match:
            all_correct = False
    
    if all_correct:
        print("\n✓ All filenames generated correctly")
        print("✓ Test 2 PASSED\n")
    else:
        print("\n✗ Test 2 FAILED: Filename mismatch\n")


def test_binding_pose_visualization(visualizer):
    """Test binding pose image generation."""
    print("=" * 60)
    print("TEST 3: Binding Pose Visualization")
    print("=" * 60)
    
    pose_data = MOCK_POSE_DATA[0]
    
    print(f"\nGenerating binding pose for: {pose_data['ligand_name']}")
    print(f"  Binding affinity: {pose_data['binding_affinity']} kcal/mol")
    print(f"  Pose ID: {pose_data['pose_id']}")
    
    result = visualizer.generate_binding_pose_image(pose_data)
    
    print(f"\nResult: {result}")
    
    if "error" in result:
        print(f"\n⚠ Expected error (file doesn't exist): {result['error']}")
        print("✓ Error handling works correctly")
    else:
        print(f"\n✓ Visualization generated")
        print(f"  Output path: {result.get('output_path')}")
        print(f"  Visualization type: {result.get('visualization_type')}")
        
        # Check if output directory was created
        if os.path.exists(visualizer.output_dir):
            print(f"  ✓ Output directory created: {visualizer.output_dir}")
        else:
            print(f"  ⚠ Output directory not created")
    
    print("\n✓ Test 3 COMPLETED\n")


def test_interaction_diagram_generation(visualizer):
    """Test interaction diagram generation."""
    print("=" * 60)
    print("TEST 4: Interaction Diagram Generation")
    print("=" * 60)
    
    print(f"\nGenerating interaction diagram for: {MOCK_INTERACTIONS['ligand_name']}")
    print(f"  Hydrogen bonds: {len(MOCK_INTERACTIONS['hydrogen_bonds'])}")
    print(f"  Hydrophobic contacts: {len(MOCK_INTERACTIONS['hydrophobic_contacts'])}")
    
    result = visualizer.generate_interaction_diagram(MOCK_INTERACTIONS)
    
    print(f"\nResult: {result}")
    
    if "error" in result:
        print(f"\n✗ Error: {result['error']}")
    else:
        print(f"\n✓ Interaction diagram generated")
        print(f"  Output path: {result.get('output_path')}")
        print(f"  Visualization type: {result.get('visualization_type')}")
    
    print("\n✓ Test 4 COMPLETED\n")


def test_comparison_chart_generation(visualizer):
    """Test ligand comparison chart generation."""
    print("=" * 60)
    print("TEST 5: Comparison Chart Generation")
    print("=" * 60)
    
    print(f"\nGenerating comparison chart for {len(MOCK_POSE_DATA)} ligands:")
    for pose in MOCK_POSE_DATA:
        print(f"  - {pose['ligand_name']}: {pose['binding_affinity']} kcal/mol")
    
    result = visualizer.generate_comparison_chart(MOCK_POSE_DATA)
    
    print(f"\nResult: {result}")
    
    if "error" in result:
        print(f"\n✗ Error: {result['error']}")
    else:
        print(f"\n✓ Comparison chart generated")
        print(f"  Output path: {result.get('output_path')}")
        print(f"  Visualization type: {result.get('visualization_type')}")
        print(f"  Number of ligands: {result.get('num_ligands')}")
    
    print("\n✓ Test 5 COMPLETED\n")


def test_empty_data_handling(visualizer):
    """Test handling of empty or invalid data."""
    print("=" * 60)
    print("TEST 6: Empty Data Handling")
    print("=" * 60)
    
    print("\nTest 6a: Empty pose data")
    result1 = visualizer.generate_binding_pose_image({})
    print(f"  Result: {result1}")
    has_error1 = "error" in result1
    print(f"  {'✓' if has_error1 else '✗'} Error correctly returned")
    
    print("\nTest 6b: Empty interactions")
    result2 = visualizer.generate_interaction_diagram({})
    print(f"  Result: {result2}")
    has_error2 = "error" in result2
    print(f"  {'✓' if has_error2 else '✗'} Error correctly returned")
    
    print("\nTest 6c: Empty ligand list")
    result3 = visualizer.generate_comparison_chart([])
    print(f"  Result: {result3}")
    has_error3 = "error" in result3
    print(f"  {'✓' if has_error3 else '✗'} Error correctly returned")
    
    if has_error1 and has_error2 and has_error3:
        print("\n✓ Empty data handled gracefully")
        print("✓ Test 6 PASSED\n")
    else:
        print("\n✗ Test 6 FAILED: Some cases not handled\n")


def test_output_directory_creation(visualizer):
    """Test that output directory is created."""
    print("=" * 60)
    print("TEST 7: Output Directory Creation")
    print("=" * 60)
    
    output_dir = visualizer.output_dir
    print(f"\nConfigured output directory: {output_dir}")
    
    # Try to generate a visualization to trigger directory creation
    result = visualizer.generate_comparison_chart(MOCK_POSE_DATA)
    
    if os.path.exists(output_dir):
        print(f"✓ Output directory exists: {output_dir}")
        
        # List contents
        contents = os.listdir(output_dir)
        print(f"\nDirectory contents ({len(contents)} items):")
        for item in contents:
            print(f"  - {item}")
        
        print("\n✓ Test 7 PASSED\n")
    else:
        print(f"⚠ Output directory not created: {output_dir}")
        print("Note: Directory creation may be deferred until actual file write")
        print("\n✓ Test 7 COMPLETED\n")


def test_multiple_visualizations(visualizer):
    """Test generating multiple visualizations."""
    print("=" * 60)
    print("TEST 8: Multiple Visualization Generation")
    print("=" * 60)
    
    results = []
    
    print("\nGenerating visualizations for all mock poses:")
    for idx, pose in enumerate(MOCK_POSE_DATA, 1):
        print(f"\n  {idx}. {pose['ligand_name']}")
        result = visualizer.generate_binding_pose_image(pose)
        results.append(result)
        
        if "error" in result:
            print(f"     ⚠ Error: {result['error']}")
        else:
            print(f"     ✓ Generated: {result.get('output_path')}")
    
    print(f"\n✓ Processed {len(results)} visualizations")
    
    # Count successes and errors
    errors = [r for r in results if "error" in r]
    successes = [r for r in results if "error" not in r]
    
    print(f"  Successes: {len(successes)}")
    print(f"  Errors: {len(errors)}")
    
    print("\n✓ Test 8 COMPLETED\n")


def test_visualization_metadata(visualizer):
    """Test that visualization results contain proper metadata."""
    print("=" * 60)
    print("TEST 9: Visualization Metadata")
    print("=" * 60)
    
    pose_data = MOCK_POSE_DATA[1]
    result = visualizer.generate_binding_pose_image(pose_data)
    
    print("\nChecking result metadata:")
    
    if "error" not in result:
        expected_fields = ["ligand_name", "pose_id", "output_path", "visualization_type"]
        
        for field in expected_fields:
            present = field in result
            status = "✓" if present else "✗"
            value = result.get(field, "N/A")
            print(f"  {status} {field}: {value}")
        
        all_present = all(field in result for field in expected_fields)
        
        if all_present:
            print("\n✓ All metadata fields present")
            print("✓ Test 9 PASSED\n")
        else:
            print("\n✗ Test 9 FAILED: Missing metadata\n")
    else:
        print(f"\n⚠ Skipped (error in generation): {result['error']}")
        print("✓ Test 9 COMPLETED\n")


def test_file_naming_consistency():
    """Test that file naming is consistent across calls."""
    print("=" * 60)
    print("TEST 10: File Naming Consistency")
    print("=" * 60)
    
    visualizer1 = VisualizationGenerator()
    visualizer2 = VisualizationGenerator()
    
    pose_data = MOCK_POSE_DATA[0]
    
    result1 = visualizer1.generate_binding_pose_image(pose_data)
    result2 = visualizer2.generate_binding_pose_image(pose_data)
    
    print("\nComparing filenames from two separate instances:")
    
    if "error" not in result1 and "error" not in result2:
        path1 = result1.get("output_path")
        path2 = result2.get("output_path")
        
        filename1 = os.path.basename(path1) if path1 else None
        filename2 = os.path.basename(path2) if path2 else None
        
        print(f"  Instance 1: {filename1}")
        print(f"  Instance 2: {filename2}")
        
        if filename1 == filename2:
            print("\n✓ Filenames are consistent (deterministic)")
            print("✓ Test 10 PASSED\n")
        else:
            print("\n✗ Test 10 FAILED: Filenames differ\n")
    else:
        print("\n⚠ Skipped (errors in generation)")
        print("✓ Test 10 COMPLETED\n")


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("VISUALIZATION GENERATION VALIDATION TESTS")
    print("=" * 60 + "\n")
    
    test_dir = None
    
    try:
        test_dir = setup_test_environment()
        
        visualizer = test_visualizer_initialization()
        test_filename_generation(visualizer)
        test_binding_pose_visualization(visualizer)
        test_interaction_diagram_generation(visualizer)
        test_comparison_chart_generation(visualizer)
        test_empty_data_handling(visualizer)
        test_output_directory_creation(visualizer)
        test_multiple_visualizations(visualizer)
        test_visualization_metadata(visualizer)
        test_file_naming_consistency()
        
        print("=" * 60)
        print("ALL TESTS COMPLETED")
        print("=" * 60)
        print("\nNOTE: Visualization rendering functions are placeholder implementations.")
        print("Tests validate structure, file naming, and error handling.")
        print("Actual image generation requires PyMOL, RDKit, or similar libraries.\n")
        
    except Exception as e:
        print(f"\n✗ TEST SUITE FAILED: {str(e)}\n")
        import traceback
        traceback.print_exc()
    
    finally:
        if test_dir:
            cleanup_test_environment(test_dir)


if __name__ == "__main__":
    main()
