"""Test Solana integration."""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from backend.tools.solana_attestation import SolanaAttestationTool
from backend.config import config

print("=" * 60)
print("SOLANA INTEGRATION TEST")
print("=" * 60)
print()

# Check configuration
print("Configuration:")
print(f"  Keypair path: {os.getenv('SOLANA_KEYPAIR_PATH', 'NOT SET')}")
print(f"  Network: {config.solana_network}")
print()

# Test with dry-run first
print("Test 1: Dry-run mode")
print("-" * 60)
tool_dry = SolanaAttestationTool(config=config, dry_run=True)

test_data = {
    "raw_files": ["test1.pdbqt", "test2.log"],
    "final_report_md": "# Test Report\n\nThis is a test.",
    "ranked_ligands": [
        {"ligand_name": "test_compound", "binding_affinity": -8.5}
    ]
}

result_dry = tool_dry.attest_analysis(test_data)
print(f"Success: {result_dry.get('success')}")
print(f"TX: {result_dry.get('transaction_signature')}")
print(f"Analysis ID: {result_dry.get('analysis_id')}")
print(f"Input hash: {result_dry.get('input_hash')}")
print(f"Report hash: {result_dry.get('report_hash')}")
print()

# Test with real Solana (if configured)
print("Test 2: Real Solana (if configured)")
print("-" * 60)
tool_real = SolanaAttestationTool(config=config, dry_run=False)

if tool_real.client and tool_real.keypair:
    print("✓ Solana client initialized")
    print(f"  Wallet: {tool_real.keypair.pubkey()}")
    print(f"  Network: {tool_real.network}")
    print()
    
    # Check balance
    try:
        from solana.rpc.api import Client
        balance = tool_real.client.get_balance(tool_real.keypair.pubkey())
        print(f"  Balance: {balance.value / 1e9} SOL")
        
        if balance.value < 1000000:  # Less than 0.001 SOL
            print("  ⚠️  Low balance! Get devnet SOL: solana airdrop 2")
    except Exception as e:
        print(f"  Could not check balance: {e}")
    
    print()
    print("Submitting real attestation...")
    result_real = tool_real.attest_analysis(test_data)
    
    if result_real.get('success'):
        print("✓ Attestation successful!")
        print(f"  TX: {result_real.get('transaction_signature')}")
        print(f"  Explorer: {result_real.get('explorer_url')}")
    else:
        print(f"✗ Attestation failed: {result_real.get('error')}")
else:
    print("⚠️  Solana not configured")
    print("  To enable:")
    print("  1. Set SOLANA_KEYPAIR_PATH in .env")
    print("  2. Deploy program to devnet")
    print("  3. Update program ID in solana_attestation.py")

print()
print("=" * 60)
print("TEST COMPLETE")
print("=" * 60)
