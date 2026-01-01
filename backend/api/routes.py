"""API routes for the DockSight AI backend."""

import os
import tempfile
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

from backend.agent.orchestrator import DockingAnalysisOrchestrator
from backend.config import config


router = APIRouter()


@router.post("/analyze")
async def analyze_docking_results(files: List[UploadFile] = File(...)):
    """
    Analyze docking results from uploaded files.
    
    Accepts multiple .pdbqt or .log files and runs the complete
    docking analysis pipeline.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    # Validate file extensions
    allowed_extensions = {".pdbqt", ".log"}
    for file in files:
        ext = Path(file.filename).suffix.lower()
        if ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file.filename}. Only .pdbqt and .log files are allowed."
            )
    
    # Create temporary directory for uploaded files
    temp_dir = tempfile.mkdtemp(prefix="docksight_")
    temp_files = []
    
    try:
        # Save uploaded files to temporary directory
        for file in files:
            temp_path = os.path.join(temp_dir, file.filename)
            with open(temp_path, "wb") as f:
                content = await file.read()
                f.write(content)
            temp_files.append(temp_path)
        
        # Check for Groq API key
        groq_api_key = config.groq_api_key
        if not groq_api_key:
            return {
                "status": "failed",
                "errors": ["GROQ_API_KEY not configured. LLM-based report generation unavailable."],
                "ranked_ligands": [],
                "interactions": {},
                "visualizations": [],
                "report": "",
                "attestation": None,
            }
        
        # Initialize orchestrator with Groq API key
        enable_solana = os.getenv("ENABLE_SOLANA_ATTESTATION", "false").lower() == "true"
        orchestrator = DockingAnalysisOrchestrator(
            config=config,
            groq_api_key=groq_api_key,
            enable_solana=enable_solana
        )
        
        # Run analysis
        result = orchestrator.run_analysis(
            docking_input=temp_files,
            enable_attestation=True
        )
        
        # Format response according to API contract
        response = {
            "status": result.get("status", "complete"),
            "ranked_ligands": result.get("ranked_ligands", []),
            "interactions": result.get("interactions", {}),
            "visualizations": result.get("visualizations", []),
            "report": result.get("report", ""),
            "attestation": result.get("attestation"),
            "pdbqt_files": result.get("pdbqt_files", {}),
        }
        
        # Include errors if present
        if "errors" in result:
            response["errors"] = result["errors"]
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    finally:
        # Cleanup temporary files
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "groq_configured": bool(config.groq_api_key),
        "solana_configured": bool(config.solana_public_key),
    }
