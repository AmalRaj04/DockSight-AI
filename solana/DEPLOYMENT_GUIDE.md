# Solana Devnet Deployment Guide

## Prerequisites

### 1. Install Solana CLI

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

Verify installation:

```bash
solana --version
```

### 2. Install Anchor

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

Verify installation:

```bash
anchor --version
```

### 3. Install Rust (if not already installed)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Setup Solana Wallet

### 1. Generate a New Keypair (Devnet)

```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

**IMPORTANT**: Save your seed phrase securely!

### 2. Configure Solana CLI for Devnet

```bash
solana config set --url devnet
```

Verify configuration:

```bash
solana config get
```

Should show:

```
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/YOUR_USER/.config/solana/id.json
Commitment: confirmed
```

### 3. Get Your Public Key

```bash
solana address
```

### 4. Airdrop Devnet SOL

```bash
solana airdrop 2
```

Check balance:

```bash
solana balance
```

You need at least 2 SOL for deployment.

## Deploy the Program

### 1. Navigate to Solana Directory

```bash
cd solana
```

### 2. Build the Program

```bash
anchor build
```

This will:

- Compile the Rust program
- Generate the IDL (Interface Definition Language)
- Create the program binary

### 3. Get the Program ID

```bash
anchor keys list
```

This shows your program's public key. Copy it!

### 4. Update Program ID in Code

Edit `programs/docksight-attestation/src/lib.rs`:

```rust
declare_id!("YOUR_PROGRAM_ID_HERE");
```

Edit `Anchor.toml`:

```toml
[programs.devnet]
docksight_attestation = "YOUR_PROGRAM_ID_HERE"
```

### 5. Rebuild with Correct Program ID

```bash
anchor build
```

### 6. Deploy to Devnet

```bash
anchor deploy
```

This will:

- Upload the program to Solana Devnet
- Initialize the program
- Return the program ID and transaction signature

**Save the Program ID!** You'll need it for the backend.

### 7. Verify Deployment

```bash
solana program show YOUR_PROGRAM_ID
```

Or visit Solana Explorer:

```
https://explorer.solana.com/address/YOUR_PROGRAM_ID?cluster=devnet
```

## Configure Backend

### 1. Update Environment Variables

Edit `.env`:

```bash
# Solana Configuration
SOLANA_KEYPAIR_PATH=~/.config/solana/id.json
SOLANA_NETWORK=devnet
```

### 2. Update Program ID in Backend

Edit `backend/tools/solana_attestation.py`:

```python
# Line ~40
self.program_id = Pubkey.from_string("YOUR_DEPLOYED_PROGRAM_ID")
```

### 3. Install Solana Python Dependencies

```bash
pip3 install -r backend/requirements.txt
```

This installs:

- `solana` - Solana Python SDK
- `solders` - Solana data structures
- `anchorpy` - Anchor framework for Python

## Test the Integration

### 1. Test Attestation

```bash
python3 test_solana_integration.py
```

### 2. Test via API

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/compound_A.log" \
  | python3 -m json.tool
```

Check the response for:

```json
{
  "attestation": {
    "success": true,
    "transaction_signature": "ACTUAL_TX_SIGNATURE",
    "explorer_url": "https://explorer.solana.com/tx/..."
  }
}
```

### 3. Verify on Explorer

Open the `explorer_url` from the response to see your attestation on-chain!

## Troubleshooting

### "Insufficient funds"

```bash
solana airdrop 2
```

### "Program account does not exist"

- Make sure you deployed with `anchor deploy`
- Verify program ID matches in all files

### "Invalid keypair"

- Check `SOLANA_KEYPAIR_PATH` points to correct file
- Verify keypair file format (JSON array of numbers)

### "Transaction simulation failed"

- Check you have enough SOL for transaction fees
- Verify program is deployed correctly
- Check program ID matches

### Python Import Errors

```bash
pip3 install solana solders anchorpy
```

## Cost Estimate

Devnet deployment costs (FREE - using airdropped SOL):

- Program deployment: ~1-2 SOL
- Each attestation transaction: ~0.000005 SOL

Mainnet costs (if you deploy there later):

- Program deployment: ~1-2 SOL (~$20-40 USD)
- Each attestation: ~0.000005 SOL (~$0.0001 USD)

## Security Notes

### ✅ Safe (What We Do)

- Store cryptographic hashes only
- Store analysis metadata
- Public attestation records
- No private data on-chain

### ❌ Never Do

- Store private keys in code
- Commit `.env` file
- Store raw scientific data on-chain
- Store molecular structures on-chain
- Handle user funds

## Program Upgrade

To upgrade the program later:

```bash
anchor build
anchor upgrade target/deploy/docksight_attestation.so --program-id YOUR_PROGRAM_ID
```

## Mainnet Deployment (Future)

When ready for production:

1. Switch to mainnet:

```bash
solana config set --url mainnet-beta
```

2. Fund your wallet with real SOL

3. Deploy:

```bash
anchor deploy --provider.cluster mainnet
```

4. Update backend:

```bash
SOLANA_NETWORK=mainnet-beta
```

## What's Stored On-Chain

✅ **Stored**:

- Analysis ID (string, max 64 chars)
- Analysis hash (SHA-256, 64 hex chars)
- Report hash (SHA-256, 64 hex chars)
- Timestamp (Unix timestamp)
- Authority (wallet public key)

❌ **NOT Stored**:

- Docking files
- Molecular structures
- Binding scores
- Visualizations
- Full reports
- Private keys
- User data

## Support

If you encounter issues:

1. Check Solana status: https://status.solana.com/
2. Solana Discord: https://discord.gg/solana
3. Anchor Discord: https://discord.gg/anchorlang
