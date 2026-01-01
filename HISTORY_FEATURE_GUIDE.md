# 📚 Analysis History Feature Guide

## Overview

The Analysis History feature provides persistent storage and management of all docking analyses, enabling:

- Historical analysis review
- Cross-analysis comparison
- Persistent report library
- Better stakeholder presentations
- Comprehensive research documentation

## Features Implemented

### ✅ Backend Storage Layer

- **JSON-based persistence** in `outputs/analyses/`
- **Index file** for fast metadata queries
- **Full analysis data** stored per analysis
- **Automatic cleanup** and management

### ✅ API Endpoints

#### 1. List Analyses

```bash
GET /api/analyses?limit=50&offset=0
```

Returns metadata for all stored analyses (paginated)

#### 2. Get Specific Analysis

```bash
GET /api/analyses/{analysis_id}
```

Returns complete analysis data including results, report, visualizations

#### 3. Delete Analysis

```bash
DELETE /api/analyses/{analysis_id}
```

Removes analysis from storage

#### 4. Get Statistics

```bash
GET /api/analyses/stats/summary
```

Returns overall statistics:

- Total analyses
- Total ligands tested
- Verified analyses (blockchain)
- Best overall candidate

### ✅ Frontend Components

#### History Page (`/history`)

- **Statistics Dashboard**: 4 metric cards showing totals
- **Analysis List**: All previous analyses with metadata
- **Quick Actions**: View Report, Delete
- **Blockchain Verification**: Shows verified analyses
- **Empty State**: Guides users to upload first analysis

#### Navigation

- **Landing Page**: "Analysis History" button in top-right
- **Analyze Page**: "View History" button in header
- **History Page**: "Back to Upload" button

## How It Works

### 1. Analysis Upload Flow

```
User uploads files
    ↓
Backend processes analysis
    ↓
Results generated (ranking, report, visualizations)
    ↓
Blockchain attestation (if enabled)
    ↓
Analysis saved to storage automatically
    ↓
User sees results
```

### 2. Storage Structure

```
outputs/analyses/
├── index.json                    # Fast metadata index
├── a251231174810_1L.json        # Full analysis #1
├── a251231180945_2M.json        # Full analysis #2
└── a251231185623_3N.json        # Full analysis #3
```

### 3. Data Stored Per Analysis

```json
{
  "analysis_id": "a251231174810_1L",
  "timestamp": "2026-01-01T17:30:00Z",
  "status": "complete",
  "ranked_ligands": [...],
  "interactions": {...},
  "visualizations": [...],
  "report": "...",
  "attestation": {
    "success": true,
    "transaction_signature": "...",
    "network": "devnet"
  },
  "pdbqt_files": {...},
  "metadata": {
    "uploaded_files": ["sildenafil.pdbqt", ...],
    "file_count": 10
  }
}
```

## Usage Guide

### Viewing Analysis History

1. **From Landing Page**:
   - Click "Analysis History" button (top-right)
2. **From Analyze Page**:

   - Click "View History" button (header)

3. **Direct URL**:
   - Navigate to http://localhost:3001/history

### Reviewing Past Analysis

1. Go to History page
2. Find the analysis you want to review
3. Click "View Report" button
4. Full analysis loads in Analyze page
5. All features available (3D viewer, charts, report)

### Deleting Analysis

1. Go to History page
2. Find the analysis to delete
3. Click "Delete" button
4. Confirm deletion
5. Analysis removed from storage

### Viewing Statistics

Statistics are automatically displayed at the top of History page:

- **Total Analyses**: Count of all stored analyses
- **Ligands Tested**: Sum across all analyses
- **Verified**: Count of blockchain-verified analyses
- **Best Candidate**: Top compound across all analyses

## Testing the Feature

### Test 1: Create Multiple Analyses

```bash
# Analysis 1: Upload 4 files
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/compound_A.log" \
  -F "files=@sample_data/compound_B.log" \
  -F "files=@sample_data/compound_C.pdbqt" \
  -F "files=@sample_data/compound_D.pdbqt"

# Analysis 2: Upload 10 files
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/sildenafil.pdbqt" \
  -F "files=@sample_data/atorvastatin.pdbqt" \
  -F "files=@sample_data/penicillin.pdbqt" \
  -F "files=@sample_data/warfarin.pdbqt" \
  -F "files=@sample_data/lisinopril.pdbqt" \
  -F "files=@sample_data/ibuprofen.pdbqt" \
  -F "files=@sample_data/amoxicillin.pdbqt" \
  -F "files=@sample_data/omeprazole.pdbqt" \
  -F "files=@sample_data/aspirin.pdbqt" \
  -F "files=@sample_data/caffeine.pdbqt"

# Analysis 3: Upload top candidates only
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/sildenafil.pdbqt" \
  -F "files=@sample_data/atorvastatin.pdbqt" \
  -F "files=@sample_data/penicillin.pdbqt"
```

### Test 2: View History via API

```bash
# List all analyses
curl http://localhost:8000/api/analyses

# Get specific analysis
curl http://localhost:8000/api/analyses/a251231174810_1L

# Get statistics
curl http://localhost:8000/api/analyses/stats/summary
```

### Test 3: View History via UI

1. Open http://localhost:3001
2. Upload files (creates Analysis #1)
3. Click "Analysis History" button
4. Verify analysis appears in list
5. Upload more files (creates Analysis #2)
6. Refresh History page
7. Verify both analyses appear
8. Click "View Report" on Analysis #1
9. Verify full analysis loads
10. Navigate back to History
11. Click "Delete" on Analysis #1
12. Verify analysis removed

## Benefits for Hackathon

### ✅ Comprehensive Reports

- All historical reports stored and accessible
- No data loss between sessions
- Complete audit trail

### ✅ Decision-Making

- Compare multiple docking runs
- Track progress over time
- Identify best candidates across experiments

### ✅ Stakeholder Presentations

- Show systematic approach
- Demonstrate progression (50 → 20 → 10 → 3 candidates)
- Highlight blockchain verification for each step

### ✅ Research Papers

- Access all data for comprehensive analysis sections
- Include multiple experiments
- Show reproducibility with blockchain proofs

### ✅ Grant Proposals

- Demonstrate extensive research
- Show total ligands tested
- Highlight success rate
- Include blockchain verification for credibility

## API Reference

### List Analyses

```http
GET /api/analyses?limit=50&offset=0

Response:
{
  "analyses": [
    {
      "analysis_id": "...",
      "timestamp": "...",
      "ligand_count": 10,
      "top_candidate": {
        "name": "sildenafil",
        "affinity": "-11.2"
      },
      "attestation": {
        "verified": true,
        "transaction_signature": "...",
        "network": "devnet"
      },
      "metadata": {
        "uploaded_files": [...],
        "status": "complete"
      }
    }
  ],
  "count": 1,
  "limit": 50,
  "offset": 0
}
```

### Get Analysis

```http
GET /api/analyses/{analysis_id}

Response:
{
  "analysis_id": "...",
  "timestamp": "...",
  "status": "complete",
  "ranked_ligands": [...],
  "report": "...",
  "visualizations": [...],
  "attestation": {...},
  "pdbqt_files": {...},
  "metadata": {...}
}
```

### Delete Analysis

```http
DELETE /api/analyses/{analysis_id}

Response:
{
  "success": true,
  "message": "Analysis ... deleted"
}
```

### Get Statistics

```http
GET /api/analyses/stats/summary

Response:
{
  "total_analyses": 3,
  "total_ligands_tested": 24,
  "verified_analyses": 3,
  "best_overall_candidate": {
    "name": "sildenafil",
    "affinity": "-11.2",
    "analysis_id": "...",
    "timestamp": "..."
  }
}
```

## File Structure

```
backend/
├── storage/
│   ├── __init__.py
│   └── analysis_store.py       # Storage layer
├── api/
│   └── routes.py               # API endpoints (updated)

frontend/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx         # Added History button
│   │   ├── Analyze.jsx         # Added History button
│   │   └── History.jsx         # NEW: History page
│   └── main.jsx                # Added /history route

outputs/
└── analyses/                   # Storage directory
    ├── index.json              # Metadata index
    └── *.json                  # Individual analyses
```

## Future Enhancements

### Phase 2 (Not Yet Implemented)

- **Comparison Mode**: Side-by-side analysis comparison
- **Search & Filter**: By ligand name, date, affinity
- **Export Options**: Combined PDF, CSV export
- **Batch Operations**: Delete multiple, export multiple
- **Tags & Labels**: Organize analyses by project
- **Notes**: Add comments to analyses
- **Sharing**: Generate shareable links

## Troubleshooting

### History page shows "No Analyses Yet"

- Upload files to create first analysis
- Check `outputs/analyses/index.json` exists
- Verify backend is running

### Analysis not appearing in history

- Check backend logs for storage errors
- Verify `outputs/analyses/` directory exists
- Check file permissions

### "View Report" doesn't load

- Check browser console for errors
- Verify analysis_id exists in storage
- Check API endpoint returns data

### Statistics show incorrect numbers

- Refresh the page
- Check `outputs/analyses/index.json` for corruption
- Restart backend if needed

---

**Status**: ✅ Fully Implemented and Ready to Test
**Time to Test**: ~5 minutes
**Expected Outcome**: Persistent analysis history with full review capabilities
