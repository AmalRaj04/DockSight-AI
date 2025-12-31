"""Tool for attesting analysis results to Solana blockchain."""

import hashlib
import json
from datetime import datetime


class SolanaAttestationTool:
    """Handles attestation of docking analysis to Solana."""

    def __init__(self, config=None):
        self.config = config
        self.network = "devnet" if not config else config.solana_network

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

            # Submit to Solana (placeholder for actual transaction)
            tx_signature = self._submit_to_solana(attestation_payload)

            if tx_signature:
                return {
                    "success": True,
                    "transaction_signature": tx_signature,
                    "analysis_id": analysis_id,
                    "input_hash": input_hash,
                    "report_hash": report_hash,
                    "network": self.network,
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
        try:
            # Placeholder for actual on-chain verification
            attestation_data = self._fetch_from_solana(analysis_id)
            
            if attestation_data:
                return {
                    "verified": True,
                    "attestation": attestation_data,
                }
            else:
                return {"verified": False, "error": "Attestation not found"}

        except Exception as e:
            return {"verified": False, "error": f"Verification failed: {str(e)}"}

    def _generate_analysis_id(self, analysis_data):
        """Generate unique analysis identifier."""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        num_ligands = len(analysis_data.get("ranked_ligands", []))
        return f"analysis_{timestamp}_{num_ligands}ligands"

    def _empty_hash(self):
        """Return hash of empty input."""
        return hashlib.sha256(b"").hexdigest()

    def _submit_to_solana(self, attestation_payload):
        """Submit attestation transaction to Solana network."""
        # Placeholder for actual Solana transaction submission
        # In production, this would:
        # 1. Load keypair from environment
        # 2. Connect to Solana RPC (devnet/mainnet)
        # 3. Build transaction with program instruction
        # 4. Sign and send transaction
        # 5. Return transaction signature
        
        # For now, return a mock signature to maintain pipeline flow
        mock_signature = f"mock_tx_{attestation_payload['analysis_id']}"
        return mock_signature

    def _fetch_from_solana(self, analysis_id):
        """Fetch attestation data from Solana network."""
        # Placeholder for actual on-chain data retrieval
        # In production, this would:
        # 1. Derive PDA from analysis_id
        # 2. Fetch account data from Solana
        # 3. Deserialize attestation struct
        # 4. Return attestation data
        
        return None
