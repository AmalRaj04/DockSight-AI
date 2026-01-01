"""Tool for attesting analysis results to Solana blockchain."""

import hashlib
import json
import os
from datetime import datetime
from pathlib import Path


class SolanaAttestationTool:
    """Handles attestation of docking analysis to Solana."""

    def __init__(self, config=None, dry_run=False):
        self.config = config
        self.network = "devnet" if not config else config.solana_network
        self.dry_run = dry_run
        self.client = None
        self.keypair = None
        self.program_id = None
        
        # Try to initialize real Solana client if not in dry-run mode
        if not dry_run:
            self._initialize_solana_client()

    def _initialize_solana_client(self):
        """Initialize Solana client and load keypair."""
        try:
            from solders.keypair import Keypair
            from solders.pubkey import Pubkey
            from solana.rpc.api import Client
            
            # Get keypair path from environment
            keypair_path = os.getenv("SOLANA_KEYPAIR_PATH")
            if not keypair_path:
                print("Warning: SOLANA_KEYPAIR_PATH not set. Attestation will be skipped.")
                return
            
            # Load keypair from file
            keypair_file = Path(keypair_path).expanduser()
            if not keypair_file.exists():
                print(f"Warning: Keypair file not found: {keypair_path}")
                return
            
            with open(keypair_file, 'r') as f:
                keypair_data = json.load(f)
                self.keypair = Keypair.from_bytes(bytes(keypair_data))
            
            # Initialize RPC client
            rpc_url = "https://api.devnet.solana.com" if self.network == "devnet" else "https://api.mainnet-beta.solana.com"
            self.client = Client(rpc_url)
            
            # Program ID (deployed to Devnet)
            self.program_id = Pubkey.from_string("2oiFFybUqLb2KhUwXNVJgZF242oE8nmrtwYeCixackN3")
            
            print(f"✓ Solana client initialized: {self.network}")
            print(f"✓ Wallet: {self.keypair.pubkey()}")
            
        except ImportError:
            print("Warning: solana-py not installed. Install with: pip install solana solders")
        except Exception as e:
            print(f"Warning: Failed to initialize Solana client: {e}")

    def attest_analysis(self, analysis_data):
        """Submit analysis attestation to Solana."""
        try:
            # Generate hashes
            input_hash = self.hash_input_files(analysis_data.get("raw_files", []))
            report_hash = self.hash_report(analysis_data.get("final_report_md", ""))
            analysis_id = self._generate_analysis_id(analysis_data)

            # Prepare attestation payload
            attestation_payload = {
                "analysis_id": analysis_id,
                "input_hash": input_hash,
                "report_hash": report_hash,
                "timestamp": datetime.utcnow().isoformat(),
            }

            if self.dry_run or not self.client or not self.keypair:
                # Dry-run mode or Solana not configured
                print("\n[DRY-RUN MODE] Solana Attestation")
                print(f"  Analysis ID: {analysis_id}")
                print(f"  Input Hash:  {input_hash}")
                print(f"  Report Hash: {report_hash}")
                print(f"  Network:     {self.network}")
                print(f"  Timestamp:   {attestation_payload['timestamp']}")
                
                return {
                    "success": True,
                    "transaction_signature": f"dry_run_{analysis_id}",
                    "analysis_id": analysis_id,
                    "input_hash": input_hash,
                    "report_hash": report_hash,
                    "network": self.network,
                    "dry_run": True,
                    "explorer_url": f"https://explorer.solana.com/tx/dry_run_{analysis_id}?cluster={self.network}",
                }

            # Submit to Solana (real transaction)
            tx_signature = self._submit_to_solana(attestation_payload)

            if tx_signature:
                explorer_url = f"https://explorer.solana.com/tx/{tx_signature}?cluster={self.network}"
                
                return {
                    "success": True,
                    "transaction_signature": tx_signature,
                    "analysis_id": analysis_id,
                    "input_hash": input_hash,
                    "report_hash": report_hash,
                    "network": self.network,
                    "explorer_url": explorer_url,
                }
            else:
                return {"success": False, "error": "Failed to submit attestation"}

        except Exception as e:
            return {"success": False, "error": f"Attestation failed: {str(e)}"}

    def hash_input_files(self, file_paths):
        """Generate SHA-256 hash of docking input files."""
        if not file_paths:
            return self._empty_hash()

        hasher = hashlib.sha256()

        # Sort files for deterministic hashing
        sorted_files = sorted(file_paths)

        for file_path in sorted_files:
            try:
                with open(file_path, "rb") as f:
                    # Hash file content
                    while chunk := f.read(8192):
                        hasher.update(chunk)
            except FileNotFoundError:
                # If file not found, hash the filename instead
                hasher.update(file_path.encode())

        return hasher.hexdigest()

    def hash_report(self, report_markdown):
        """Generate SHA-256 hash of final report."""
        if not report_markdown:
            return self._empty_hash()

        hasher = hashlib.sha256()
        hasher.update(report_markdown.encode("utf-8"))
        return hasher.hexdigest()

    def verify_attestation(self, analysis_id):
        """Verify an attestation exists on-chain."""
        if self.dry_run or not self.client:
            return {"verified": False, "error": "Dry-run mode or Solana not configured"}
        
        try:
            # Derive PDA for attestation account
            from solders.pubkey import Pubkey
            
            seeds = [b"attestation", analysis_id.encode()]
            pda, bump = Pubkey.find_program_address(seeds, self.program_id)
            
            # Fetch account data
            response = self.client.get_account_info(pda)
            
            if response.value:
                return {
                    "verified": True,
                    "account": str(pda),
                    "data_length": len(response.value.data),
                }
            else:
                return {"verified": False, "error": "Attestation not found"}

        except Exception as e:
            return {"verified": False, "error": f"Verification failed: {str(e)}"}

    def _generate_analysis_id(self, analysis_data):
        """Generate unique analysis identifier (max 20 chars for PDA compatibility)."""
        timestamp = datetime.utcnow().strftime("%y%m%d%H%M%S")  # Shorter timestamp
        num_ligands = len(analysis_data.get("ranked_ligands", []))
        return f"a{timestamp}_{num_ligands}L"  # e.g., "a251231174413_1L"

    def _empty_hash(self):
        """Return hash of empty input."""
        return hashlib.sha256(b"").hexdigest()

    def _submit_to_solana(self, attestation_payload):
        """Submit attestation transaction to Solana network."""
        try:
            from solders.pubkey import Pubkey
            from solders.instruction import Instruction, AccountMeta
            from solders.transaction import Transaction
            from solders.system_program import ID as SYSTEM_PROGRAM_ID
            import borsh_construct as borsh
            
            # Derive PDA for attestation account
            analysis_id = attestation_payload["analysis_id"]
            seeds = [b"attestation", analysis_id.encode()]
            attestation_pda, bump = Pubkey.find_program_address(seeds, self.program_id)
            
            # Build instruction data (simplified - would use Anchor IDL in production)
            # Format: [instruction_discriminator(8), analysis_id, analysis_hash, report_hash]
            instruction_data = bytearray()
            
            # Instruction discriminator for attest_analysis (first 8 bytes of sha256("global:attest_analysis"))
            discriminator = hashlib.sha256(b"global:attest_analysis").digest()[:8]
            instruction_data.extend(discriminator)
            
            # Serialize parameters (simplified borsh encoding)
            analysis_id_bytes = analysis_id.encode()
            instruction_data.extend(len(analysis_id_bytes).to_bytes(4, 'little'))
            instruction_data.extend(analysis_id_bytes)
            
            analysis_hash_bytes = attestation_payload["input_hash"].encode()
            instruction_data.extend(len(analysis_hash_bytes).to_bytes(4, 'little'))
            instruction_data.extend(analysis_hash_bytes)
            
            report_hash_bytes = attestation_payload["report_hash"].encode()
            instruction_data.extend(len(report_hash_bytes).to_bytes(4, 'little'))
            instruction_data.extend(report_hash_bytes)
            
            # Build instruction
            instruction = Instruction(
                program_id=self.program_id,
                accounts=[
                    AccountMeta(pubkey=attestation_pda, is_signer=False, is_writable=True),
                    AccountMeta(pubkey=self.keypair.pubkey(), is_signer=True, is_writable=True),
                    AccountMeta(pubkey=SYSTEM_PROGRAM_ID, is_signer=False, is_writable=False),
                ],
                data=bytes(instruction_data),
            )
            
            # Get recent blockhash
            recent_blockhash = self.client.get_latest_blockhash().value.blockhash
            
            # Build and sign transaction
            transaction = Transaction.new_with_payer(
                instructions=[instruction],
                payer=self.keypair.pubkey(),
            )
            transaction.sign([self.keypair], recent_blockhash)
            
            # Send transaction
            response = self.client.send_transaction(transaction)
            
            if response.value:
                tx_signature = str(response.value)
                print(f"✓ Attestation submitted: {tx_signature}")
                return tx_signature
            else:
                print(f"✗ Transaction failed")
                return None
                
        except Exception as e:
            print(f"✗ Solana transaction error: {e}")
            return None

    def _fetch_from_solana(self, analysis_id):
        """Fetch attestation data from Solana network."""
        if self.dry_run or not self.client:
            return None
        
        try:
            from solders.pubkey import Pubkey
            
            seeds = [b"attestation", analysis_id.encode()]
            pda, bump = Pubkey.find_program_address(seeds, self.program_id)
            
            response = self.client.get_account_info(pda)
            
            if response.value:
                # Would deserialize account data here
                return {
                    "account": str(pda),
                    "data": response.value.data,
                }
            
            return None
            
        except Exception as e:
            print(f"Error fetching attestation: {e}")
            return None
