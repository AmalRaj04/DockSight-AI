# Solana Integration - Quick Reference

## Current Status

**Mode**: Dry-run (default)
**Network**: Devnet (when enabled)
**Status**: ✅ Ready to deploy

## Quick Commands

### Deploy to Devnet

```bash
# 1. Setup
solana-keygen new
solana config set --url devnet
solana airdrop 2

# 2. Deploy
cd solana
anchor build
anchor deploy

# 3. Get Program ID
anchor keys list

# 4. Update code with your program ID
# Edit: solana/programs/docksight-attestation/src/lib.rs
# Edit: solana/Anchor.toml
# Edit: backend/tools/solana_attestation.py (line ~40)

# 5. Rebuild and redeploy
anchor build
anchor deploy
```

### Enable in Backend

```bash
# Add to .env
SOLANA_KEYPAIR_PATH=~/.config/solana/id.json
ENABLE_SOLANA_ATTESTATION=true

# Install dependencies
pip3 install solana solders anchorpy
```

### Test

```bash
# Test integration
python3 test_solana_integration.py

# Test via API
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/compound_A.log"
```

## Files Modified

### New Files

- `solana/programs/docksight-attestation/src/lib.rs` - Anchor program
- `solana/programs/docksight-attestation/Cargo.toml` - Rust config
- `solana/DEPLOYMENT_GUIDE.md` - Deployment instructions
- `SOLANA_INTEGRATION.md` - Integration documentation
- `test_solana_integration.py` - Test script
- `.env.example` - Environment template

### Updated Files

- `backend/tools/solana_attestation.py` - Real Solana client
- `backend/agent/orchestrator.py` - Enable/disable Solana
- `backend/api/routes.py` - Pass enable_solana flag
- `backend/requirements.txt` - Added Solana dependencies

## Environment Variables

```bash
# Required
GROQ_API_KEY=your_groq_key

# Optional (for Solana)
SOLANA_KEYPAIR_PATH=~/.config/solana/id.json
SOLANA_NETWORK=devnet
ENABLE_SOLANA_ATTESTATION=true
```

## Program Structure

```rust
pub struct Attestation {
    pub authority: Pubkey,      // 32 bytes
    pub analysis_id: String,    // 4 + 64 bytes
    pub analysis_hash: String,  // 4 + 64 bytes
    pub report_hash: String,    // 4 + 64 bytes
    pub timestamp: i64,         // 8 bytes
    pub bump: u8,               // 1 byte
}
// Total: ~240 bytes per attestation
```

## API Response

```json
{
  "status": "complete",
  "ranked_ligands": [...],
  "report": "...",
  "attestation": {
    "success": true,
    "transaction_signature": "5Kq7...",
    "analysis_id": "analysis_20231231_123456_4ligands",
    "analysis_hash": "abc123...",
    "report_hash": "def456...",
    "network": "devnet",
    "explorer_url": "https://explorer.solana.com/tx/..."
  }
}
```

## Troubleshooting

### "solana-py not installed"

```bash
pip3 install solana solders anchorpy
```

### "Keypair file not found"

```bash
# Check path
echo $SOLANA_KEYPAIR_PATH

# Generate new keypair
solana-keygen new --outfile ~/.config/solana/id.json
```

### "Insufficient funds"

```bash
solana airdrop 2
solana balance
```

### "Program account does not exist"

```bash
# Verify deployment
solana program show YOUR_PROGRAM_ID

# Redeploy if needed
cd solana
anchor deploy
```

### Attestation fails but analysis succeeds

This is expected! Attestation is optional and won't break the pipeline.

## Security Checklist

- [x] Private keys loaded from file only
- [x] Private keys never logged
- [x] Private keys never sent to frontend
- [x] No raw scientific data on-chain
- [x] No molecular structures on-chain
- [x] Only cryptographic hashes stored
- [x] Graceful fallback if Solana unavailable

## Cost Estimate

**Devnet** (Testing):

- Deployment: FREE
- Per attestation: FREE
- Storage: FREE

**Mainnet** (Production):

- Deployment: ~1-2 SOL (~$20-40 USD, one-time)
- Per attestation: ~0.000005 SOL (~$0.0001 USD)
- 10,000 analyses/year: ~$1 USD

## Support

- **Deployment Guide**: `solana/DEPLOYMENT_GUIDE.md`
- **Full Documentation**: `SOLANA_INTEGRATION.md`
- **Test Script**: `python3 test_solana_integration.py`
- **Solana Docs**: https://docs.solana.com
- **Anchor Docs**: https://www.anchor-lang.com

## Next Steps

1. ✅ Code is ready
2. ⏳ Deploy program to Devnet (your action)
3. ⏳ Update program ID in code (your action)
4. ⏳ Enable in .env (your action)
5. ⏳ Test integration (your action)

---

**Status**: Ready for deployment
**Documentation**: Complete
**Testing**: Dry-run verified
