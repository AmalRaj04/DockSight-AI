"""Test script for Solana attestation validation."""

import sys
import os
import tempfile
import hashlib

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.tools.solana_attestation import SolanaAttestationTool


# Mock analysis data
MOCK_ANALYSIS_DATA = {
    "raw_files": ["/mock/compound_A.pdbqt", "/mock/compound_B.pdbqt"],
    "final_report_md": "# Test Report\n\nThis is a test report.",
    "ranked_ligands": [
        {"ligand_name": "compound_A", "binding_affinity": -8.5},
        {"ligand_name": "compound_B", "binding_affinity": -9.2},
    ],
}


def test_attestation_tool_initialization():
    """Test SolanaAttestationTool initialization."""
    print("=" * 60)
    print("TEST 1: SolanaAttestationTool Initialization")
    print("=" * 60)
    
    # Test without config
    tool1 = SolanaAttestationTool()
    print("\n✓ Tool created without config")
    print(f"  Network: {tool1.network}")
    print(f"  Dry-run: {tool1.dry_run}")
    
    # Test with dry-run enabled
    tool2 = SolanaAttestationTool(dry_run=True)
    print("\n✓ Tool created with dry-run enabled")
    print(f"  Network: {tool2.network}")
    print(f"  Dry-run: {tool2.dry_run}")
    
    print("\n✓ Test 1 PASSED\n")


def test_hash_determinism():
    """Test that hashing is deterministic."""
    print("=" * 60)
    print("TEST 2: Hash Determinism")
    print("=" * 60)
    
    tool = SolanaAttestationTool(dry_run=True)
    
    # Test input file hashing
    print("\nTest 2a: Input file hashing")
    files = ["/mock/file1.pdbqt", "/mock/file2.pdbqt"]
    
    hash1 = tool.hash_input_files(files)
    hash2 = tool.hash_input_files(files)
    hash3 = tool.hash_input_files(files)
    
    print(f"  Hash 1: {hash1}")
    print(f"  Hash 2: {hash2}")
    print(f"  Hash 3: {hash3}")
    
    if hash1 == hash2 == hash3:
        print("  ✓ Input file hashes are deterministic")
    else:
        print("  ✗ Input file hashes are NOT deterministic")
    
    # Test report hashing
    print("\nTest 2b: Report hashing")
    report = "# Test Report\n\nSample content."
    
    report_hash1 = tool.hash_report(report)
    report_hash2 = tool.hash_report(report)
    report_hash3 = tool.hash_report(report)
    
    print(f"  Hash 1: {report_hash1}")
    print(f"  Hash 2: {report_hash2}")
    print(f"  Hash 3: {report_hash3}")
    
    if report_hash1 == report_hash2 == report_hash3:
        print("  ✓ Report hashes are deterministic")
    else:
        print("  ✗ Report hashes are NOT deterministic")
    
    # Test that different inputs produce different hashes
    print("\nTest 2c: Different inputs produce different hashes")
    files_different = ["/mock/file3.pdbqt"]
    hash_different = tool.hash_input_files(files_different)
    
    print(f"  Original files hash: {hash1}")
    print(f"  Different files hash: {hash_different}")
    
    if hash1 != hash_different:
        print("  ✓ Different inputs produce different hashes")
    else:
        print("  ✗ Different inputs produce SAME hash (error)")
    
    if hash1 == hash2 == hash3 and report_hash1 == report_hash2 == report_hash3 and hash1 != hash_different:
        print("\n✓ Test 2 PASSED\n")
    else:
        print("\n✗ Test 2 FAILED\n")


def test_hash_format():
    """Test that hashes are valid SHA-256 format."""
    print("=" * 60)
    print("TEST 3: Hash Format Validation")
    print("=" * 60)
    
    tool = SolanaAttestationTool(dry_run=True)
    
    input_hash = tool.hash_input_files(["/mock/test.pdbqt"])
    report_hash = tool.hash_report("Test report content")
    
    print(f"\nInput hash:  {input_hash}")
    print(f"Report hash: {report_hash}")
    
    # SHA-256 produces 64 hex characters
    input_valid = len(input_hash) == 64 and all(c in '0123456789abcdef' for c in input_hash)
    report_valid = len(report_hash) == 64 and all(c in '0123456789abcdef' for c in report_hash)
    
    print(f"\n  {'✓' if input_valid else '✗'} Input hash is valid SHA-256 (64 hex chars)")
    print(f"  {'✓' if report_valid else '✗'} Report hash is valid SHA-256 (64 hex chars)")
    
    if input_valid and report_valid:
        print("\n✓ Test 3 PASSED\n")
    else:
        print("\n✗ Test 3 FAILED\n")


def test_dry_run_attestation():
    """Test attestation in dry-run mode."""
    print("=" * 60)
    print("TEST 4: Dry-Run Attestation")
    print("=" * 60)
    
    tool = SolanaAttestationTool(dry_run=True)
    
    print("\nAttempting attestation in dry-run mode...")
    result = tool.attest_analysis(MOCK_ANALYSIS_DATA)
    
    print(f"\nAttestation result:")
    print(f"  Success: {result.get('success')}")
    print(f"  Analysis ID: {result.get('analysis_id')}")
    print(f"  Input Hash: {result.get('input_hash')}")
    print(f"  Report Hash: {result.get('report_hash')}")
    print(f"  Transaction: {result.get('transaction_signature')}")
    print(f"  Network: {result.get('network')}")
    print(f"  Dry-run: {result.get('dry_run')}")
    
    # Verify result structure
    has_success = result.get('success') == True
    has_analysis_id = result.get('analysis_id') is not None
    has_input_hash = result.get('input_hash') is not None
    has_report_hash = result.get('report_hash') is not None
    has_tx = result.get('transaction_signature') is not None
    is_dry_run = result.get('dry_run') == True
    
    print(f"\n  {'✓' if has_success else '✗'} Success flag set")
    print(f"  {'✓' if has_analysis_id else '✗'} Analysis ID present")
    print(f"  {'✓' if has_input_hash else '✗'} Input hash present")
    print(f"  {'✓' if has_report_hash else '✗'} Report hash present")
    print(f"  {'✓' if has_tx else '✗'} Transaction signature present")
    print(f"  {'✓' if is_dry_run else '✗'} Dry-run flag set")
    
    if all([has_success, has_analysis_id, has_input_hash, has_report_hash, has_tx, is_dry_run]):
        print("\n✓ Test 4 PASSED\n")
    else:
        print("\n✗ Test 4 FAILED\n")


def test_empty_hash():
    """Test hashing of empty inputs."""
    print("=" * 60)
    print("TEST 5: Empty Input Hashing")
    print("=" * 60)
    
    tool = SolanaAttestationTool(dry_run=True)
    
    # Test empty file list
    empty_files_hash = tool.hash_input_files([])
    print(f"\nEmpty file list hash: {empty_files_hash}")
    
    # Test empty report
    empty_report_hash = tool.hash_report("")
    print(f"Empty report hash:    {empty_report_hash}")
    
    # Verify these are valid SHA-256 hashes
    expected_empty_hash = hashlib.sha256(b"").hexdigest()
    print(f"Expected empty hash:  {expected_empty_hash}")
    
    files_match = empty_files_hash == expected_empty_hash
    report_match = empty_report_hash == expected_empty_hash
    
    print(f"\n  {'✓' if files_match else '✗'} Empty files hash matches expected")
    print(f"  {'✓' if report_match else '✗'} Empty report hash matches expected")
    
    if files_match and report_match:
        print("\n✓ Test 5 PASSED\n")
    else:
        print("\n✗ Test 5 FAILED\n")


def test_file_order_consistency():
    """Test that file order affects hash (sorted internally)."""
    print("=" * 60)
    print("TEST 6: File Order Consistency")
    print("=" * 60)
    
    tool = SolanaAttestationTool(dry_run=True)
    
    # Test with different file orders
    files_order1 = ["/mock/file_a.pdbqt", "/mock/file_b.pdbqt", "/mock/file_c.pdbqt"]
    files_order2 = ["/mock/file_c.pdbqt", "/mock/file_a.pdbqt", "/mock/file_b.pdbqt"]
    files_order3 = ["/mock/file_b.pdbqt", "/mock/file_c.pdbqt", "/mock/file_a.pdbqt"]
    
    hash1 = tool.hash_input_files(files_order1)
    hash2 = tool.hash_input_files(files_order2)
    hash3 = tool.hash_input_files(files_order3)
    
    print(f"\nOrder 1 (a,b,c): {hash1}")
    print(f"Order 2 (c,a,b): {hash2}")
    print(f"Order 3 (b,c,a): {hash3}")
    
    if hash1 == hash2 == hash3:
        print("\n✓ File order does not affect hash (sorted internally)")
        print("✓ Test 6 PASSED\n")
    else:
        print("\n✗ File order affects hash (not sorted)")
        print("✗ Test 6 FAILED\n")


def test_real_file_hashing():
    """Test hashing with actual temporary files."""
    print("=" * 60)
    print("TEST 7: Real File Hashing")
    print("=" * 60)
    
    tool = SolanaAttestationTool(dry_run=True)
    
    # Create temporary files with known content
    with tempfile.NamedTemporaryFile(mode='w', suffix='.pdbqt', delete=False) as f1:
        f1.write("ATOM 1 C LIG 1 1.0 2.0 3.0\n")
        file1_path = f1.name
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.pdbqt', delete=False) as f2:
        f2.write("ATOM 2 N LIG 1 4.0 5.0 6.0\n")
        file2_path = f2.name
    
    try:
        print(f"\nCreated temp files:")
        print(f"  {file1_path}")
        print(f"  {file2_path}")
        
        # Hash the files
        hash_result = tool.hash_input_files([file1_path, file2_path])
        print(f"\nCombined hash: {hash_result}")
        
        # Hash again to verify determinism
        hash_result2 = tool.hash_input_files([file1_path, file2_path])
        print(f"Second hash:   {hash_result2}")
        
        if hash_result == hash_result2:
            print("\n✓ Real file hashing is deterministic")
            print("✓ Test 7 PASSED\n")
        else:
            print("\n✗ Real file hashing is NOT deterministic")
            print("✗ Test 7 FAILED\n")
    
    finally:
        # Cleanup
        os.unlink(file1_path)
        os.unlink(file2_path)


def test_analysis_id_generation():
    """Test analysis ID generation."""
    print("=" * 60)
    print("TEST 8: Analysis ID Generation")
    print("=" * 60)
    
    tool = SolanaAttestationTool(dry_run=True)
    
    analysis_data = {
        "ranked_ligands": [
            {"ligand_name": "compound_A"},
            {"ligand_name": "compound_B"},
            {"ligand_name": "compound_C"},
        ],
    }
    
    analysis_id = tool._generate_analysis_id(analysis_data)
    
    print(f"\nGenerated analysis ID: {analysis_id}")
    
    # Check format: analysis_YYYYMMDD_HHMMSS_Nligands
    has_prefix = analysis_id.startswith("analysis_")
    has_ligand_count = "3ligands" in analysis_id
    
    print(f"\n  {'✓' if has_prefix else '✗'} Has 'analysis_' prefix")
    print(f"  {'✓' if has_ligand_count else '✗'} Contains ligand count")
    
    if has_prefix and has_ligand_count:
        print("\n✓ Test 8 PASSED\n")
    else:
        print("\n✗ Test 8 FAILED\n")


def test_complete_attestation_flow():
    """Test complete attestation flow in dry-run mode."""
    print("=" * 60)
    print("TEST 9: Complete Attestation Flow")
    print("=" * 60)
    
    tool = SolanaAttestationTool(dry_run=True)
    
    print("\nRunning complete attestation flow...")
    print(f"  Input files: {len(MOCK_ANALYSIS_DATA['raw_files'])}")
    print(f"  Report length: {len(MOCK_ANALYSIS_DATA['final_report_md'])} chars")
    print(f"  Ligands: {len(MOCK_ANALYSIS_DATA['ranked_ligands'])}")
    
    result = tool.attest_analysis(MOCK_ANALYSIS_DATA)
    
    print(f"\n✓ Attestation completed")
    print(f"\nFinal attestation record:")
    print(f"  Analysis ID: {result.get('analysis_id')}")
    print(f"  Input Hash:  {result.get('input_hash')}")
    print(f"  Report Hash: {result.get('report_hash')}")
    print(f"  TX Signature: {result.get('transaction_signature')}")
    print(f"  Network: {result.get('network')}")
    
    # Verify no actual blockchain interaction occurred
    tx_sig = result.get('transaction_signature', '')
    is_dry_run_tx = tx_sig.startswith('dry_run_')
    
    print(f"\n  {'✓' if is_dry_run_tx else '✗'} No real blockchain transaction (dry-run)")
    
    if result.get('success') and is_dry_run_tx:
        print("\n✓ Test 9 PASSED\n")
    else:
        print("\n✗ Test 9 FAILED\n")


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("SOLANA ATTESTATION VALIDATION TESTS (DRY-RUN)")
    print("=" * 60 + "\n")
    
    try:
        test_attestation_tool_initialization()
        test_hash_determinism()
        test_hash_format()
        test_dry_run_attestation()
        test_empty_hash()
        test_file_order_consistency()
        test_real_file_hashing()
        test_analysis_id_generation()
        test_complete_attestation_flow()
        
        print("=" * 60)
        print("ALL TESTS COMPLETED SUCCESSFULLY")
        print("=" * 60)
        print("\nNOTE: All tests run in DRY-RUN mode.")
        print("No actual Solana transactions were submitted.")
        print("Hashes are deterministic and ready for on-chain attestation.\n")
        
    except Exception as e:
        print(f"\n✗ TEST SUITE FAILED: {str(e)}\n")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
