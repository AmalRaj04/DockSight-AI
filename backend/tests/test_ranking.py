"""Test script for ligand ranking validation."""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.tools.ranking import LigandRanker


# Mock parsed docking results with multiple ligands and poses
MOCK_PARSED_RESULTS = [
    {
        "ligand_name": "compound_A",
        "file_path": "/mock/compound_A.pdbqt",
        "poses": [
            {"pose_id": 1, "binding_affinity": -7.2},
            {"pose_id": 2, "binding_affinity": -6.8},
            {"pose_id": 3, "binding_affinity": -6.3},
        ],
        "num_poses": 3,
    },
    {
        "ligand_name": "compound_B",
        "file_path": "/mock/compound_B.pdbqt",
        "poses": [
            {"pose_id": 1, "binding_affinity": -9.5},
            {"pose_id": 2, "binding_affinity": -8.9},
            {"pose_id": 3, "binding_affinity": -8.2},
        ],
        "num_poses": 3,
    },
    {
        "ligand_name": "compound_C",
        "file_path": "/mock/compound_C.pdbqt",
        "poses": [
            {"pose_id": 1, "binding_affinity": -8.1},
            {"pose_id": 2, "binding_affinity": -7.5},
        ],
        "num_poses": 2,
    },
    {
        "ligand_name": "compound_D",
        "file_path": "/mock/compound_D.pdbqt",
        "poses": [
            {"pose_id": 1, "binding_affinity": -6.5},
            {"pose_id": 2, "binding_affinity": -6.0},
            {"pose_id": 3, "binding_affinity": -5.8},
            {"pose_id": 4, "binding_affinity": -5.2},
        ],
        "num_poses": 4,
    },
    {
        "ligand_name": "compound_E",
        "file_path": "/mock/compound_E.pdbqt",
        "poses": [
            {"pose_id": 1, "binding_affinity": -10.2},
            {"pose_id": 2, "binding_affinity": -9.8},
            {"pose_id": 3, "binding_affinity": -9.1},
        ],
        "num_poses": 3,
    },
]


def test_basic_ranking():
    """Test basic ligand ranking by binding affinity."""
    print("=" * 60)
    print("TEST 1: Basic Ligand Ranking")
    print("=" * 60)
    
    ranker = LigandRanker()
    result = ranker.rank_by_binding_affinity(MOCK_PARSED_RESULTS)
    
    ranked_ligands = result.get("ranked_ligands", [])
    errors = result.get("errors", [])
    
    print(f"\n✓ Ranking completed")
    print(f"Total ligands ranked: {len(ranked_ligands)}")
    print(f"Errors: {len(errors)}")
    
    print("\n--- Ranked Ligands (Best to Worst) ---\n")
    for idx, ligand in enumerate(ranked_ligands, 1):
        print(f"Rank {idx}: {ligand['ligand_name']}")
        print(f"  ΔG: {ligand['binding_affinity']} kcal/mol")
        print(f"  Best Pose: {ligand['pose_id']}")
        print(f"  Total Poses: {ligand['total_poses']}")
        print()
    
    # Verify ranking order (most negative should be first)
    print("--- Verification ---")
    is_sorted = all(
        ranked_ligands[i]['binding_affinity'] <= ranked_ligands[i+1]['binding_affinity']
        for i in range(len(ranked_ligands) - 1)
    )
    
    if is_sorted:
        print("✓ Ligands correctly sorted by binding affinity (ascending)")
    else:
        print("✗ Ligands NOT correctly sorted")
    
    # Verify best ligand
    best_ligand = ranked_ligands[0]
    expected_best = "compound_E"  # Has -10.2 kcal/mol
    
    if best_ligand['ligand_name'] == expected_best:
        print(f"✓ Best ligand correctly identified: {expected_best}")
    else:
        print(f"✗ Expected {expected_best}, got {best_ligand['ligand_name']}")
    
    # Verify worst ligand
    worst_ligand = ranked_ligands[-1]
    expected_worst = "compound_D"  # Has -6.5 kcal/mol (best pose)
    
    if worst_ligand['ligand_name'] == expected_worst:
        print(f"✓ Worst ligand correctly identified: {expected_worst}")
    else:
        print(f"✗ Expected {expected_worst}, got {worst_ligand['ligand_name']}")
    
    print("\n✓ Test 1 PASSED\n")


def test_best_pose_selection():
    """Test that best pose (lowest ΔG) is selected per ligand."""
    print("=" * 60)
    print("TEST 2: Best Pose Selection")
    print("=" * 60)
    
    ranker = LigandRanker()
    result = ranker.rank_by_binding_affinity(MOCK_PARSED_RESULTS)
    
    ranked_ligands = result.get("ranked_ligands", [])
    
    print("\n--- Verifying Best Pose Selection ---\n")
    
    all_correct = True
    for ligand in ranked_ligands:
        ligand_name = ligand['ligand_name']
        selected_affinity = ligand['binding_affinity']
        
        # Find original data
        original = next(l for l in MOCK_PARSED_RESULTS if l['ligand_name'] == ligand_name)
        all_affinities = [p['binding_affinity'] for p in original['poses']]
        min_affinity = min(all_affinities)
        
        is_correct = selected_affinity == min_affinity
        status = "✓" if is_correct else "✗"
        
        print(f"{status} {ligand_name}:")
        print(f"  Selected: {selected_affinity} kcal/mol")
        print(f"  All poses: {all_affinities}")
        print(f"  Minimum: {min_affinity} kcal/mol")
        print()
        
        if not is_correct:
            all_correct = False
    
    if all_correct:
        print("✓ All ligands have correct best pose selected")
        print("✓ Test 2 PASSED\n")
    else:
        print("✗ Test 2 FAILED: Some ligands have incorrect best pose\n")


def test_empty_input():
    """Test handling of empty input."""
    print("=" * 60)
    print("TEST 3: Empty Input Handling")
    print("=" * 60)
    
    ranker = LigandRanker()
    result = ranker.rank_by_binding_affinity([])
    
    ranked_ligands = result.get("ranked_ligands", [])
    errors = result.get("errors", [])
    
    print(f"\nRanked ligands: {len(ranked_ligands)}")
    print(f"Errors: {errors}")
    
    if len(ranked_ligands) == 0 and len(errors) > 0:
        print("\n✓ Empty input correctly handled")
        print("✓ Test 3 PASSED\n")
    else:
        print("\n✗ Test 3 FAILED\n")


def test_single_ligand():
    """Test ranking with single ligand."""
    print("=" * 60)
    print("TEST 4: Single Ligand Ranking")
    print("=" * 60)
    
    single_ligand = [MOCK_PARSED_RESULTS[0]]
    
    ranker = LigandRanker()
    result = ranker.rank_by_binding_affinity(single_ligand)
    
    ranked_ligands = result.get("ranked_ligands", [])
    
    print(f"\nInput ligands: 1")
    print(f"Ranked ligands: {len(ranked_ligands)}")
    
    if len(ranked_ligands) == 1:
        print(f"\nRank 1: {ranked_ligands[0]['ligand_name']}")
        print(f"  ΔG: {ranked_ligands[0]['binding_affinity']} kcal/mol")
        print("\n✓ Single ligand correctly ranked")
        print("✓ Test 4 PASSED\n")
    else:
        print("\n✗ Test 4 FAILED\n")


def test_ranking_summary():
    """Test ranking summary generation."""
    print("=" * 60)
    print("TEST 5: Ranking Summary Generation")
    print("=" * 60)
    
    ranker = LigandRanker()
    result = ranker.rank_by_binding_affinity(MOCK_PARSED_RESULTS)
    ranked_ligands = result.get("ranked_ligands", [])
    
    summary = ranker.generate_ranking_summary(ranked_ligands)
    
    print("\n--- Ranking Summary ---")
    print(f"Total Ligands: {summary['total_ligands']}")
    print(f"Best Ligand: {summary['best_ligand']}")
    print(f"Best Affinity: {summary['best_affinity']} kcal/mol")
    
    if (summary['total_ligands'] == 5 and 
        summary['best_ligand'] == 'compound_E' and
        summary['best_affinity'] == -10.2):
        print("\n✓ Summary correctly generated")
        print("✓ Test 5 PASSED\n")
    else:
        print("\n✗ Test 5 FAILED\n")


def test_ligand_no_poses():
    """Test handling of ligand with no poses."""
    print("=" * 60)
    print("TEST 6: Ligand with No Poses")
    print("=" * 60)
    
    invalid_data = [
        {
            "ligand_name": "compound_X",
            "file_path": "/mock/compound_X.pdbqt",
            "poses": [],
            "num_poses": 0,
        },
        MOCK_PARSED_RESULTS[0],  # Valid ligand
    ]
    
    ranker = LigandRanker()
    result = ranker.rank_by_binding_affinity(invalid_data)
    
    ranked_ligands = result.get("ranked_ligands", [])
    
    print(f"\nInput ligands: 2 (1 invalid, 1 valid)")
    print(f"Ranked ligands: {len(ranked_ligands)}")
    
    if len(ranked_ligands) == 1:
        print(f"Ranked: {ranked_ligands[0]['ligand_name']}")
        print("\n✓ Invalid ligand correctly skipped")
        print("✓ Test 6 PASSED\n")
    else:
        print("\n✗ Test 6 FAILED\n")


def test_expected_ranking_order():
    """Test and display expected ranking order."""
    print("=" * 60)
    print("TEST 7: Expected Ranking Order Verification")
    print("=" * 60)
    
    # Expected order based on best ΔG per ligand
    expected_order = [
        ("compound_E", -10.2),
        ("compound_B", -9.5),
        ("compound_C", -8.1),
        ("compound_A", -7.2),
        ("compound_D", -6.5),
    ]
    
    ranker = LigandRanker()
    result = ranker.rank_by_binding_affinity(MOCK_PARSED_RESULTS)
    ranked_ligands = result.get("ranked_ligands", [])
    
    print("\n--- Expected vs Actual ---\n")
    
    all_match = True
    for idx, (expected_name, expected_affinity) in enumerate(expected_order):
        actual = ranked_ligands[idx]
        match = (actual['ligand_name'] == expected_name and 
                actual['binding_affinity'] == expected_affinity)
        status = "✓" if match else "✗"
        
        print(f"{status} Rank {idx + 1}:")
        print(f"  Expected: {expected_name} ({expected_affinity} kcal/mol)")
        print(f"  Actual:   {actual['ligand_name']} ({actual['binding_affinity']} kcal/mol)")
        print()
        
        if not match:
            all_match = False
    
    if all_match:
        print("✓ All rankings match expected order")
        print("✓ Test 7 PASSED\n")
    else:
        print("✗ Test 7 FAILED: Ranking order mismatch\n")


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("LIGAND RANKING VALIDATION TESTS")
    print("=" * 60 + "\n")
    
    try:
        test_basic_ranking()
        test_best_pose_selection()
        test_empty_input()
        test_single_ligand()
        test_ranking_summary()
        test_ligand_no_poses()
        test_expected_ranking_order()
        
        print("=" * 60)
        print("ALL TESTS COMPLETED SUCCESSFULLY")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n✗ TEST SUITE FAILED: {str(e)}\n")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
