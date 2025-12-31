# System Architecture

## High-Level Flow

User uploads docking results
↓
Docking Analysis Agent
↓
Data Parsing & Validation
↓
Scoring & Ranking Engine
↓
Interaction Extraction
↓
Visualization Generation
↓
Scientific Reasoning (LLM)
↓
Report Composition
↓
Solana Attestation (optional)
↓
Final Outputs (PDF, visuals, summaries)

## Core Components

### Docking Analysis Agent

- Orchestrates the full workflow
- Controls execution order
- Handles failures and validation

### Tools

- Docking Parser Tool
- Ranking Tool
- Interaction Analyzer
- Visualization Generator
- Report Composer

### LLM Role

- Explains results
- Writes scientific narratives
- Never performs raw chemistry calculations

### Solana Layer

- Stores analysis hash
- Stores docking metadata
- Enables reproducibility proof
