"""Main entry point for the DockSight AI backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.api.routes import router


def create_app():
    """Create and configure FastAPI application."""
    app = FastAPI(
        title="DockSight AI API",
        description="Autonomous docking analysis and scientific reporting agent",
        version="0.1.0",
    )
    
    # Enable CORS for frontend (development)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Register API routes
    app.include_router(router, prefix="/api")
    
    # Serve static files (visualizations)
    if os.path.exists("outputs/visualizations"):
        app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")
    
    return app


app = create_app()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "DockSight AI",
        "version": "0.1.0",
        "status": "running",
    }


def main():
    """Main execution function."""
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
