"""Quick test to verify API setup."""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.main import create_app
from backend.config import config

def test_app_creation():
    """Test that FastAPI app can be created."""
    print("Testing FastAPI app creation...")
    app = create_app()
    print(f"✓ App created: {app.title}")
    print(f"✓ Version: {app.version}")
    return app

def test_config():
    """Test configuration loading."""
    print("\nTesting configuration...")
    print(f"✓ Groq API Key configured: {bool(config.groq_api_key)}")
    print(f"✓ Solana Public Key configured: {bool(config.solana_public_key)}")
    print(f"✓ Solana Network: {config.solana_network}")

def main():
    print("=" * 60)
    print("DockSight AI Backend API Test")
    print("=" * 60 + "\n")
    
    try:
        app = test_app_creation()
        test_config()
        
        print("\n" + "=" * 60)
        print("API Setup Complete")
        print("=" * 60)
        print("\nTo start the server, run:")
        print("  python3 -m uvicorn backend.main:app --reload --port 8000")
        print("\nAPI will be available at:")
        print("  http://localhost:8000")
        print("  http://localhost:8000/docs (Swagger UI)")
        print("  http://localhost:8000/api/analyze (POST endpoint)")
        
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
