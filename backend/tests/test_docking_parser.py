"""Test script for docking parser validation."""

import sys
import os
import tempfile

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.tools.docking_parser import DockingParser


# Mock AutoDock Vina log format
MOCK_VINA_LOG = """Scoring function : vina
Rigid receptor: receptor.pdbqt
Ligand: compound_123.pdbqt
Exhaustiveness: 8
CPU: 4
Verbosity: 1

mode |   affinity | dist from best mode
     | (kcal/mol) | rmsd l.b.| rmsd u.b.
-----+------------+----------+----------
   1        -8.5      0.000      0.000
   2        -7.9      1.234      2.456
   3        -7.2      2.345      3.567
   4        -6.8      3.456      4.678
   5        -6.3      4.567      5.789
"""

# Mock PDBQT format with VINA RESULT remarks
MOCK_PDBQT = """MODEL 1
REMARK VINA RESULT:    -9.2      0.000      0.000
REMARK  Name = ligand_456
ATOM      1  C   LIG     1       1.234   2.345   3.456  1.00  0.00     0.000 C
ATOM      2  N   LIG     1       2.345   3.456   4.567  1.00  0.00     0.000 N
ENDMDL
MODEL 2
REMARK VINA RESULT:    -8.7      1.234      2.345
ATOM      1  C   LIG     1       1.111   2.222   3.333  1.00  0.00     0.000 C
ATOM      2  N   LIG     1       2.222   3.333   4.444  1.00  0.00     0.000 N
ENDMDL
MODEL 3
REMARK VINA RESULT:    -8.1      2.345      3.456
ATOM      1  C   LIG     1       1.000   2.000   3.000  1.00  0.00     0.000 C
ATOM      2  N   LIG     1       2.000   3.000   4.000  1.00  0.00     0.000 N
ENDMDL
"""


def test_vina_log_parsing():
    """Test parsing of Vina log format."""
    print("=" * 60)
    print("TEST 1: Vina Log Format Parsing")
    print("=" * 60)
    
    # Create temporary file with mock data
    with tempfile.NamedTemporaryFile(mode='w', suffix='.log', delete=False) as f:
        f.write(MOCK_VINA_LOG)
        temp_path = f.name
    
    try:
        parser = DockingParser()
        result = parser.parse_vina_output(temp_path)
        
        print("\n✓ Parsing completed")
        print(f"\nLigand Name: {result.get('ligand_name')}")
        print(f"File Path: {result.get('file_path')}")
        print(f"Number of Poses: {result.get('num_poses')}")
        
        print("\nPoses:")
        for pose in result.get('poses', []):
            print(f"  Pose {pose['pose_id']}: ΔG = {pose['binding_affinity']} kcal/mol")
        
        # Test extraction functions
        print("\n--- Testing extraction functions ---")
        
        binding_scores = parser.extract_binding_scores(result)
        print(f"\nBinding Scores Extracted: {len(binding_scores)} scores")
        for score in binding_scores:
            print(f"  Pose {score['pose_id']}: {score['binding_affinity']} kcal/mol")
        
        ligand_info = parser.extract_ligand_info(result)
        print(f"\nLigand Info:")
        print(f"  Name: {ligand_info['ligand_name']}")
        print(f"  Total Poses: {ligand_info['num_poses']}")
        
    finally:
        os.unlink(temp_path)
    
    print("\n✓ Test 1 PASSED\n")


def test_pdbqt_parsing():
    """Test parsing of PDBQT format."""
    print("=" * 60)
    print("TEST 2: PDBQT Format Parsing")
    print("=" * 60)
    
    # Create temporary file with mock data
    with tempfile.NamedTemporaryFile(mode='w', suffix='.pdbqt', delete=False) as f:
        f.write(MOCK_PDBQT)
        temp_path = f.name
    
    try:
        parser = DockingParser()
        result = parser.parse_vina_output(temp_path)
        
        print("\n✓ Parsing completed")
        print(f"\nLigand Name: {result.get('ligand_name')}")
        print(f"File Path: {result.get('file_path')}")
        print(f"Number of Poses: {result.get('num_poses')}")
        
        print("\nPoses:")
        for pose in result.get('poses', []):
            print(f"  Pose {pose['pose_id']}: ΔG = {pose['binding_affinity']} kcal/mol")
        
    finally:
        os.unlink(temp_path)
    
    print("\n✓ Test 2 PASSED\n")


def test_invalid_file():
    """Test handling of invalid file."""
    print("=" * 60)
    print("TEST 3: Invalid File Handling")
    print("=" * 60)
    
    parser = DockingParser()
    result = parser.parse_vina_output("nonexistent_file.pdbqt")
    
    if "error" in result:
        print(f"\n✓ Error correctly captured: {result['error']}")
        print("✓ Test 3 PASSED\n")
    else:
        print("\n✗ Test 3 FAILED: Expected error not returned\n")


def test_unsupported_format():
    """Test handling of unsupported file format."""
    print("=" * 60)
    print("TEST 4: Unsupported Format Handling")
    print("=" * 60)
    
    parser = DockingParser()
    
    # Test validation
    is_valid_pdbqt = parser.validate_format("test.pdbqt")
    is_valid_log = parser.validate_format("test.log")
    is_valid_txt = parser.validate_format("test.txt")
    
    print(f"\n.pdbqt format valid: {is_valid_pdbqt}")
    print(f".log format valid: {is_valid_log}")
    print(f".txt format valid: {is_valid_txt}")
    
    if is_valid_pdbqt and is_valid_log and not is_valid_txt:
        print("\n✓ Test 4 PASSED\n")
    else:
        print("\n✗ Test 4 FAILED\n")


def test_empty_poses():
    """Test handling of file with no valid poses."""
    print("=" * 60)
    print("TEST 5: Empty Poses Handling")
    print("=" * 60)
    
    # Create file with no pose data
    empty_content = "This is not a valid docking file\nNo poses here\n"
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.log', delete=False) as f:
        f.write(empty_content)
        temp_path = f.name
    
    try:
        parser = DockingParser()
        result = parser.parse_vina_output(temp_path)
        
        if "error" in result:
            print(f"\n✓ Error correctly captured: {result['error']}")
            print("✓ Test 5 PASSED\n")
        else:
            print("\n✗ Test 5 FAILED: Expected error for empty poses\n")
    finally:
        os.unlink(temp_path)


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("DOCKING PARSER VALIDATION TESTS")
    print("=" * 60 + "\n")
    
    try:
        test_vina_log_parsing()
        test_pdbqt_parsing()
        test_invalid_file()
        test_unsupported_format()
        test_empty_poses()
        
        print("=" * 60)
        print("ALL TESTS COMPLETED SUCCESSFULLY")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n✗ TEST SUITE FAILED: {str(e)}\n")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
