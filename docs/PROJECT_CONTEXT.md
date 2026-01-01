# Project Context — DockSight AI

## Overview

DockSight AI is an autonomous docking analysis and scientific reporting agent that converts raw AutoDock Vina outputs into decision-ready insights while preserving scientific rigor. Built for the NeuraViva hackathon, it demonstrates how AI agents can accelerate computational drug discovery workflows.

## Background

Structure-based drug discovery relies heavily on molecular docking to predict how small molecules interact with target proteins. Docking tools such as AutoDock Vina generate quantitative binding scores and predicted binding poses, but the downstream interpretation of these results remains a significant bottleneck.

Researchers must manually analyze docking scores, compare multiple ligands, inspect binding poses, generate figures, and translate findings into scientific narratives suitable for publications, grant proposals, and stakeholder presentations. This process is time-consuming, error-prone, and requires specialized expertise.

As docking campaigns scale to hundreds or thousands of ligands, the lack of automated, reliable interpretation tools slows decision-making and reduces reproducibility.

## Problem Statement

Current docking workflows suffer from the following challenges:

1. **Manual Interpretation Overhead**  
   Docking outputs are numerical and structural but lack contextual explanation. Researchers must manually interpret what binding energies and poses imply for efficacy.

2. **Poor Reproducibility**  
   Docking analyses are often difficult to reproduce due to missing metadata, undocumented parameters, and lack of immutable records.

3. **Visualization Gap**  
   Generating consistent, publication-quality molecular visualizations requires expert tooling and manual effort.

4. **Communication Barrier**  
   Translating docking results into clear, scientifically responsible narratives for non-specialist stakeholders (funders, collaborators) is difficult.

5. **Lack of Autonomous Decision Support**  
   Existing tools provide data, not decisions or ranked recommendations.

6. **Analysis History Management**  
   No centralized way to track, compare, and organize multiple docking campaigns over time.

## Solution: DockSight AI

DockSight AI is an autonomous docking analysis and scientific reporting agent that addresses these challenges through:

### Automated Analysis Pipeline

- Parses AutoDock Vina outputs (.pdbqt, .log files)
- Ranks ligands by binding affinity
- Generates publication-quality visualizations
- Creates structured scientific reports via LLM
- Stores complete analysis history

### Blockchain Attestation

- Records cryptographic hashes on Solana Devnet
- Enables immutable provenance tracking
- Supports verifiable research claims
- Maintains data privacy (only hashes on-chain)

### Professional Research Tools

- Analysis history with search and filtering
- Project organization and tagging
- Batch comparison of multiple analyses
- Export options for reports and data
- 3D molecular visualization

## Core Objectives

- ✅ Automate interpretation of molecular docking results
- ✅ Rank and compare ligands based on binding affinity
- ✅ Generate publication- and grant-ready scientific reports
- ✅ Produce high-quality molecular interaction visualizations
- ✅ Ensure reproducibility through blockchain anchoring
- ✅ Maintain conservative, scientifically responsible reasoning
- ✅ Enable analysis history tracking and comparison

## Agentic Architecture

DockSight AI is explicitly designed as an **agentic system** with controlled autonomy:

### Agent Characteristics

- Executes a predefined sequence of analytical steps
- Makes decisions based on input data (e.g., selecting best poses)
- Uses specialized tools for parsing, ranking, and visualization
- Invokes an LLM only for explanation and scientific writing
- Maintains internal state across analysis stages
- Generates unique IDs for each analysis
- Stores results persistently for future access

### Tool Orchestration

The orchestrator agent coordinates five specialized tools:

1. **DockingParser** - Extracts data from files
2. **LigandRanker** - Sorts by binding affinity
3. **VisualizationGenerator** - Creates charts and images
4. **ReportWriter** - Generates scientific narratives
5. **SolanaAttestationTool** - Records blockchain proofs

This design ensures transparency, auditability, and extensibility.

## Scientific Responsibility

The system enforces strict rules to avoid misleading conclusions:

- ✅ No hallucinated docking scores or interactions
- ✅ All numerical outputs derive directly from input data
- ✅ Explicit uncertainty statements are included
- ✅ Experimental validation is always recommended
- ✅ Drug efficacy claims are conservative and qualified
- ✅ Scientific disclaimers in all reports

DockSight AI prioritizes trust and reproducibility over speculative insights.

## Technology Stack

### Backend

- **Python** with FastAPI for REST API
- **Groq API** (llama-3.3-70b-versatile) for LLM reasoning
- **Matplotlib** for visualization generation
- **JSON storage** for analysis persistence

### Frontend

- **React** with Vite for fast development
- **TailwindCSS** for responsive design
- **Chart.js** for interactive charts
- **3Dmol.js** for molecular structure viewing

### Blockchain

- **Solana Devnet** for attestation
- **Anchor framework** for smart contract development
- **Rust** for on-chain program

## Solana Integration Rationale

DockSight AI integrates with the Solana blockchain to address reproducibility and integrity challenges in computational research.

The blockchain layer is used to:

- Anchor cryptographic hashes of docking inputs and reports
- Record analysis metadata (timestamps, unique IDs)
- Enable immutable provenance tracking
- Support verifiable research claims without exposing sensitive data
- Provide transaction signatures for verification

**Key Design Decision**: Only cryptographic hashes are stored on-chain. Raw molecular data, docking scores, and scientific reports remain off-chain for privacy and efficiency.

## Target Users

- Computational biologists analyzing docking results
- Medicinal chemists evaluating drug candidates
- Drug discovery startups running screening campaigns
- Academic research labs with limited resources
- Grant applicants needing clear result summaries
- Scientific stakeholders requiring reproducible claims

## Expected Impact

By automating docking result interpretation and reporting, DockSight AI:

- ✅ Reduces time spent on manual analysis (hours → minutes)
- ✅ Improves consistency across docking campaigns
- ✅ Enhances reproducibility and trust via blockchain
- ✅ Enables faster go/no-go decisions
- ✅ Improves quality of scientific communication
- ✅ Provides centralized analysis history management
- ✅ Supports batch comparison for decision-making

## Scope Limitations

DockSight AI is **not** intended to:

- ❌ Replace molecular dynamics simulations
- ❌ Perform de novo drug design
- ❌ Make definitive efficacy or safety claims
- ❌ Replace experimental validation
- ❌ Predict ADMET properties
- ❌ Perform quantum mechanical calculations

**Its role is decision support, not final authority.**

## Current Implementation Status

### Completed Features

- ✅ Complete analysis pipeline (parse → rank → visualize → report → attest)
- ✅ Groq LLM integration for scientific writing
- ✅ Solana Devnet deployment and attestation
- ✅ React frontend with professional UI
- ✅ Analysis history with persistent storage
- ✅ Search, filter, and tagging system
- ✅ Batch comparison (2-3 analyses)
- ✅ 3D molecular viewer
- ✅ Export options (CSV, Excel, PDF)
- ✅ Unique analysis ID generation
- ✅ Metadata management (tags, projects, notes)

### Known Limitations

- Single-user deployment (no authentication)
- File-based storage (not database)
- Synchronous processing (no task queue)
- Devnet only (not mainnet)
- Limited to AutoDock Vina format

## Vision

DockSight AI represents a step toward autonomous, reproducible, and transparent computational research agents that augment scientific workflows while respecting domain constraints.

The long-term vision is a modular ecosystem of scientific agents that collaborate, validate, and attest to research outputs in a decentralized and trust-minimized manner.

### Future Enhancements

- Multi-user authentication and workspaces
- Database migration (PostgreSQL)
- Async task processing (Celery/Redis)
- Additional docking format support
- Mainnet deployment for production use
- API integrations with other research tools
- Advanced interaction analysis
- Machine learning-based scoring
