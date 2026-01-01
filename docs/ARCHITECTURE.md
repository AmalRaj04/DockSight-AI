# System Architecture

## High-Level Flow

```
User uploads docking results (.pdbqt/.log files)
           ↓
    FastAPI Backend
           ↓
  Orchestrator Agent
           ↓
┌──────────────────────────┐
│  1. Parse & Validate     │ → DockingParser
│  2. Rank Ligands         │ → LigandRanker
│  3. Generate Visuals     │ → VisualizationGenerator
│  4. Generate Report      │ → ReportWriter (Groq LLM)
│  5. Attest to Solana     │ → SolanaAttestationTool
└──────────────────────────┘
           ↓
    Analysis Storage
           ↓
    React Frontend
           ↓
User views results, history, comparisons
```

## Technology Stack

### Backend

- **Framework**: FastAPI (Python)
- **LLM**: Groq API (llama-3.3-70b-versatile)
- **Blockchain**: Solana Devnet (Anchor framework)
- **Storage**: JSON-based file storage
- **Visualization**: Matplotlib

### Frontend

- **Framework**: React + Vite
- **Styling**: TailwindCSS
- **Charts**: Chart.js
- **3D Viewer**: 3Dmol.js
- **Routing**: React Router

### Blockchain

- **Network**: Solana Devnet
- **Framework**: Anchor
- **Program ID**: `2oiFFybUqLb2KhUwXNVJgZF242oE8nmrtwYeCixackN3`

## Core Components

### 1. Orchestrator Agent (`backend/agent/orchestrator.py`)

- Coordinates the complete analysis pipeline
- Generates unique analysis IDs (timestamp + UUID)
- Manages state transitions via StateMachine
- Handles graceful failures
- Returns structured results

### 2. Analysis Tools

#### DockingParser (`backend/tools/docking_parser.py`)

- Parses AutoDock Vina .pdbqt and .log files
- Extracts ligand names, binding affinities, poses
- Validates file formats
- Returns structured data with file paths

#### LigandRanker (`backend/tools/ranking.py`)

- Ranks ligands by binding affinity (ascending ΔG)
- Selects best pose per ligand (lowest energy)
- Preserves file paths for downstream processing

#### VisualizationGenerator (`backend/tools/visualization.py`)

- Generates binding pose cards with color-coded affinities
- Creates comparison bar charts
- Saves PNG images to `outputs/visualizations/`
- Uses matplotlib for rendering

#### ReportWriter (`backend/tools/report_writer.py`)

- Integrates with Groq LLM for scientific narration
- Generates structured markdown reports
- Includes Methods, Results, Discussion sections
- Conservative scientific language with disclaimers

#### SolanaAttestationTool (`backend/tools/solana_attestation.py`)

- Computes SHA-256 hashes of inputs and reports
- Submits transactions to Solana Devnet
- Stores only cryptographic hashes on-chain
- Graceful fallback if blockchain unavailable

### 3. Storage Layer (`backend/storage/analysis_store.py`)

- JSON-based persistent storage
- Stores complete analysis results in `outputs/analyses/`
- Maintains searchable index
- Supports tags, projects, notes metadata
- CRUD operations for analysis management

### 4. API Layer (`backend/api/routes.py`)

- RESTful endpoints for analysis operations
- File upload handling
- Search and filter support
- Metadata management
- Statistics aggregation

### 5. Frontend Components

#### Pages

- **Landing**: File upload interface
- **Analyze**: Results display with all visualizations
- **History**: Browse all past analyses with filters
- **Compare**: Side-by-side comparison of 2-3 analyses

#### Components

- **ExecutiveSummary**: Metric cards with key statistics
- **BindingAffinityChart**: Interactive Chart.js visualization
- **EnhancedLigandsTable**: Sortable table with medals
- **MolecularViewer3D**: 3Dmol.js integration for structure viewing
- **ScientificReport**: Structured report with copy/export features
- **CollapsibleSection**: Reusable UI component

## Data Flow

### Analysis Pipeline

1. User uploads files via React frontend
2. FastAPI receives files, saves to temp directory
3. Orchestrator generates unique analysis ID
4. Parser extracts docking data from files
5. Ranker sorts ligands by binding affinity
6. Visualizer creates charts and images
7. ReportWriter generates scientific narrative via LLM
8. SolanaAttestationTool records hashes on blockchain
9. Complete results saved to storage with unique ID
10. Frontend displays results and stores in history

### Storage Structure

```
outputs/
├── analyses/
│   ├── index.json                          # Searchable index
│   ├── analysis_20260101_170945_ef1fb776.json
│   ├── analysis_20260101_171031_d07c3696.json
│   └── ...
└── visualizations/
    ├── binding_pose_ligand1.png
    ├── comparison_chart.png
    └── ...
```

## State Management

### Backend State Machine

- **States**: idle → parsing → parsed → ranking → visualizing → visualized → reporting → attesting → attested → complete
- **Error Handling**: Any failure transitions to "failed" state
- **Validation**: Errors accumulated in state object

### Frontend State

- React hooks for local state
- SessionStorage for analysis results
- URL parameters for comparison IDs

## Security & Best Practices

### Backend

- Environment variables for sensitive keys
- Temporary file cleanup after processing
- Graceful error handling
- No raw data on blockchain (only hashes)

### Frontend

- CORS configured for localhost development
- Input validation on file types
- Error boundaries for component failures

## Scalability Considerations

### Current Implementation

- Single-server deployment
- File-based storage
- Synchronous processing

### Future Enhancements

- Database migration (PostgreSQL)
- Async task queue (Celery/Redis)
- Cloud storage for visualizations
- Multi-user authentication
- Mainnet deployment for production attestations
