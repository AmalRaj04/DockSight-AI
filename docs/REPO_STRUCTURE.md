# Repository Structure

/
├── backend/
│ ├── agent/
│ │ ├── orchestrator.py
│ │ ├── state_machine.py
│ │ └── rules.py
│ ├── tools/
│ │ ├── docking_parser.py
│ │ ├── ranking.py
│ │ ├── interactions.py
│ │ ├── visualization.py
│ │ └── report_writer.py
│ ├── api/
│ │ └── routes.py
│ └── main.py
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ └── viewers/
│ └── index.html
│
├── solana/
│ ├── programs/
│ └── metadata_contract.rs
│
├── prompts/
│ ├── scientific_reasoning.md
│ ├── report_generation.md
│
├── docs/
│ ├── PROJECT_CONTEXT.md
│ ├── ARCHITECTURE.md
│ ├── FEATURES.md
│ └── AGENT_RULES.md
│
└── README.md
