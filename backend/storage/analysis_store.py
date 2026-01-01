"""
Analysis storage using JSON files for persistence.
Stores all analysis results for historical access.
"""
import json
import os
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path


class AnalysisStore:
    """Manages persistent storage of analysis results."""
    
    def __init__(self, storage_dir: str = "outputs/analyses"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.index_file = self.storage_dir / "index.json"
        self._ensure_index()
    
    def _ensure_index(self):
        """Ensure index file exists."""
        if not self.index_file.exists():
            self._save_index([])
    
    def _load_index(self) -> List[Dict]:
        """Load the analysis index."""
        try:
            with open(self.index_file, 'r') as f:
                return json.load(f)
        except Exception:
            return []
    
    def _save_index(self, index: List[Dict]):
        """Save the analysis index."""
        with open(self.index_file, 'w') as f:
            json.dump(index, f, indent=2)
    
    def save_analysis(self, analysis_id: str, data: Dict) -> Dict:
        """
        Save a complete analysis result.
        
        Args:
            analysis_id: Unique identifier for the analysis
            data: Complete analysis data including results, report, etc.
        
        Returns:
            Metadata about the saved analysis
        """
        # Add timestamp if not present
        if 'timestamp' not in data:
            data['timestamp'] = datetime.utcnow().isoformat()
        
        # Initialize tags and notes if not present
        if 'tags' not in data:
            data['tags'] = []
        if 'notes' not in data:
            data['notes'] = ''
        if 'project' not in data:
            data['project'] = ''
        
        # Save full analysis data
        analysis_file = self.storage_dir / f"{analysis_id}.json"
        with open(analysis_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        # Create index entry
        ranked_ligands = data.get('ranked_ligands', [])
        top_candidate = ranked_ligands[0] if ranked_ligands else None
        
        index_entry = {
            'analysis_id': analysis_id,
            'timestamp': data['timestamp'],
            'ligand_count': len(ranked_ligands),
            'top_candidate': {
                'name': top_candidate['ligand_name'] if top_candidate else None,
                'affinity': top_candidate['binding_affinity'] if top_candidate else None
            } if top_candidate else None,
            'attestation': {
                'verified': data.get('attestation', {}).get('success', False),
                'transaction_signature': data.get('attestation', {}).get('transaction_signature'),
                'network': data.get('attestation', {}).get('network', 'devnet')
            },
            'metadata': {
                'uploaded_files': data.get('metadata', {}).get('uploaded_files', []),
                'status': data.get('status', 'complete')
            },
            'tags': data.get('tags', []),
            'project': data.get('project', ''),
            'notes': data.get('notes', '')
        }
        
        # Update index
        index = self._load_index()
        # Remove existing entry if present
        index = [e for e in index if e['analysis_id'] != analysis_id]
        # Add new entry at the beginning (most recent first)
        index.insert(0, index_entry)
        self._save_index(index)
        
        return index_entry
    
    def get_analysis(self, analysis_id: str) -> Optional[Dict]:
        """
        Retrieve a specific analysis by ID.
        
        Args:
            analysis_id: The analysis identifier
        
        Returns:
            Complete analysis data or None if not found
        """
        analysis_file = self.storage_dir / f"{analysis_id}.json"
        if not analysis_file.exists():
            return None
        
        try:
            with open(analysis_file, 'r') as f:
                return json.load(f)
        except Exception:
            return None
    
    def list_analyses(
        self, 
        limit: Optional[int] = None, 
        offset: int = 0,
        search: Optional[str] = None,
        tags: Optional[List[str]] = None,
        project: Optional[str] = None
    ) -> List[Dict]:
        """
        List all analyses (metadata only) with optional filtering.
        
        Args:
            limit: Maximum number of results to return
            offset: Number of results to skip
            search: Search term for ligand names or analysis ID
            tags: Filter by tags (any match)
            project: Filter by project name
        
        Returns:
            List of analysis metadata entries
        """
        index = self._load_index()
        
        # Apply filters
        filtered = index
        
        if search:
            search_lower = search.lower()
            filtered = [
                e for e in filtered
                if (search_lower in e['analysis_id'].lower() or
                    (e.get('top_candidate') and 
                     e['top_candidate'].get('name') and
                     search_lower in e['top_candidate']['name'].lower()) or
                    (e.get('project') and search_lower in e['project'].lower()))
            ]
        
        if tags:
            filtered = [
                e for e in filtered
                if any(tag in e.get('tags', []) for tag in tags)
            ]
        
        if project:
            filtered = [
                e for e in filtered
                if e.get('project', '').lower() == project.lower()
            ]
        
        # Apply pagination
        start = offset
        end = offset + limit if limit else None
        
        return filtered[start:end]
    
    def delete_analysis(self, analysis_id: str) -> bool:
        """
        Delete an analysis.
        
        Args:
            analysis_id: The analysis identifier
        
        Returns:
            True if deleted, False if not found
        """
        analysis_file = self.storage_dir / f"{analysis_id}.json"
        
        if not analysis_file.exists():
            return False
        
        # Remove file
        analysis_file.unlink()
        
        # Update index
        index = self._load_index()
        index = [e for e in index if e['analysis_id'] != analysis_id]
        self._save_index(index)
        
        return True
    
    def update_metadata(self, analysis_id: str, updates: Dict) -> bool:
        """
        Update analysis metadata (tags, project, notes).
        
        Args:
            analysis_id: The analysis identifier
            updates: Dictionary with 'tags', 'project', and/or 'notes'
        
        Returns:
            True if updated, False if not found
        """
        # Load full analysis
        analysis = self.get_analysis(analysis_id)
        if not analysis:
            return False
        
        # Update fields
        if 'tags' in updates:
            analysis['tags'] = updates['tags']
        if 'project' in updates:
            analysis['project'] = updates['project']
        if 'notes' in updates:
            analysis['notes'] = updates['notes']
        
        # Save back
        analysis_file = self.storage_dir / f"{analysis_id}.json"
        with open(analysis_file, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        # Update index
        index = self._load_index()
        for entry in index:
            if entry['analysis_id'] == analysis_id:
                if 'tags' in updates:
                    entry['tags'] = updates['tags']
                if 'project' in updates:
                    entry['project'] = updates['project']
                if 'notes' in updates:
                    entry['notes'] = updates['notes']
                break
        
        self._save_index(index)
        return True
    
    def get_all_tags(self) -> List[str]:
        """Get all unique tags across all analyses."""
        index = self._load_index()
        all_tags = set()
        for entry in index:
            all_tags.update(entry.get('tags', []))
        return sorted(list(all_tags))
    
    def get_all_projects(self) -> List[str]:
        """Get all unique project names."""
        index = self._load_index()
        projects = set()
        for entry in index:
            if entry.get('project'):
                projects.add(entry['project'])
        return sorted(list(projects))
    
    def get_statistics(self) -> Dict:
        """
        Get overall statistics across all analyses.
        
        Returns:
            Statistics dictionary
        """
        index = self._load_index()
        
        if not index:
            return {
                'total_analyses': 0,
                'total_ligands_tested': 0,
                'verified_analyses': 0,
                'best_overall_candidate': None,
                'total_projects': 0,
                'total_tags': 0
            }
        
        total_ligands = sum(e['ligand_count'] for e in index)
        verified = sum(1 for e in index if e['attestation']['verified'])
        
        # Find best candidate across all analyses
        best_candidate = None
        best_affinity = 0
        
        for entry in index:
            if entry['top_candidate'] and entry['top_candidate']['affinity']:
                affinity = float(entry['top_candidate']['affinity'])
                if best_candidate is None or affinity < best_affinity:
                    best_affinity = affinity
                    best_candidate = {
                        'name': entry['top_candidate']['name'],
                        'affinity': entry['top_candidate']['affinity'],
                        'analysis_id': entry['analysis_id'],
                        'timestamp': entry['timestamp']
                    }
        
        return {
            'total_analyses': len(index),
            'total_ligands_tested': total_ligands,
            'verified_analyses': verified,
            'best_overall_candidate': best_candidate,
            'total_projects': len(self.get_all_projects()),
            'total_tags': len(self.get_all_tags())
        }


# Global instance
_store = None

def get_store() -> AnalysisStore:
    """Get the global analysis store instance."""
    global _store
    if _store is None:
        _store = AnalysisStore()
    return _store
