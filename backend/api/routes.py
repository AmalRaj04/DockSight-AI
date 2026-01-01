"""API routes for the DockSight AI backend."""

import os
import tempfile
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Optional

from backend.agent.orchestrator import DockingAnalysisOrchestrator
from backend.config import config
from backend.storage.analysis_store import get_store


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
        
        # Save analysis to storage
        analysis_id = result.get("analysis_id", "unknown")
        store = get_store()
        
        # Prepare data for storage
        storage_data = {
            **response,
            "analysis_id": analysis_id,
            "metadata": {
                "uploaded_files": [f.filename for f in files],
                "file_count": len(files)
            }
        }
        
        try:
            store.save_analysis(analysis_id, storage_data)
            response["analysis_id"] = analysis_id
        except Exception as e:
            # Don't fail the request if storage fails
            print(f"Warning: Failed to save analysis to storage: {e}")
        
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


@router.get("/analyses/stats/summary")
async def get_statistics():
    """
    Get overall statistics across all analyses.
    
    Returns:
        Statistics summary
    """
    store = get_store()
    stats = store.get_statistics()
    
    return stats


@router.get("/analyses/tags")
async def get_all_tags():
    """Get all unique tags across all analyses."""
    store = get_store()
    return {"tags": store.get_all_tags()}


@router.get("/analyses/projects")
async def get_all_projects():
    """Get all unique project names."""
    store = get_store()
    return {"projects": store.get_all_projects()}


@router.get("/analyses")
async def list_analyses(
    limit: Optional[int] = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    project: Optional[str] = Query(None)
):
    """
    List all stored analyses (metadata only) with optional filtering.
    
    Args:
        limit: Maximum number of results (1-100, default 50)
        offset: Number of results to skip (default 0)
        search: Search term for ligand names or analysis ID
        tags: Comma-separated list of tags to filter by
        project: Project name to filter by
    
    Returns:
        List of analysis metadata entries
    """
    store = get_store()
    
    # Parse tags if provided
    tag_list = tags.split(',') if tags else None
    
    analyses = store.list_analyses(
        limit=limit,
        offset=offset,
        search=search,
        tags=tag_list,
        project=project
    )
    
    return {
        "analyses": analyses,
        "count": len(analyses),
        "limit": limit,
        "offset": offset
    }


@router.get("/analyses/{analysis_id}")
async def get_analysis(analysis_id: str):
    """
    Retrieve a specific analysis by ID.
    
    Args:
        analysis_id: The analysis identifier
    
    Returns:
        Complete analysis data
    """
    store = get_store()
    analysis = store.get_analysis(analysis_id)
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis


@router.delete("/analyses/{analysis_id}")
async def delete_analysis(analysis_id: str):
    """
    Delete a specific analysis.
    
    Args:
        analysis_id: The analysis identifier
    
    Returns:
        Success confirmation
    """
    store = get_store()
    success = store.delete_analysis(analysis_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return {"success": True, "message": f"Analysis {analysis_id} deleted"}


@router.patch("/analyses/{analysis_id}/metadata")
async def update_analysis_metadata(analysis_id: str, updates: dict):
    """
    Update analysis metadata (tags, project, notes).
    
    Args:
        analysis_id: The analysis identifier
        updates: Dictionary with 'tags', 'project', and/or 'notes'
    
    Returns:
        Success confirmation
    """
    store = get_store()
    success = store.update_metadata(analysis_id, updates)
    
    if not success:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return {"success": True, "message": "Metadata updated"}
