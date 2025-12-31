"""Configuration management for DockSight AI."""

import os
from pathlib import Path


class Config:
    """Application configuration loaded from environment variables."""

    def __init__(self):
        self._load_env_file()

    def _load_env_file(self):
        """Load environment variables from .env file if it exists."""
        env_path = Path(__file__).parent.parent / ".env"
        if env_path.exists():
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, value = line.split("=", 1)
                        os.environ[key.strip()] = value.strip()

    @property
    def groq_api_key(self):
        """Get Groq API key from environment."""
        return os.getenv("GROQ_API_KEY")

    @property
    def solana_public_key(self):
        """Get Solana public key from environment."""
        return os.getenv("SOLANA_PUBLIC_KEY")

    @property
    def solana_private_key(self):
        """Get Solana private key from environment."""
        return os.getenv("SOLANA_PRIVATE_KEY")

    @property
    def solana_network(self):
        """Get Solana network (mainnet/devnet/testnet)."""
        return os.getenv("SOLANA_NETWORK", "devnet")

    def validate(self):
        """Validate that required configuration is present."""
        errors = []

        if not self.groq_api_key:
            errors.append("GROQ_API_KEY is not set")

        if not self.solana_public_key:
            errors.append("SOLANA_PUBLIC_KEY is not set")

        if not self.solana_private_key:
            errors.append("SOLANA_PRIVATE_KEY is not set")

        return errors


# Global config instance
config = Config()
