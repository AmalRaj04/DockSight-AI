# DockSight AI 🧬

**Autonomous AI Agent for Molecular Docking Analysis & Report Generation**

[![Built for Dora Hacks](https://img.shields.io/badge/Built%20for-Dora%20Hacks-blue)](https://dorahacks.io)
[![Solana Integration](https://img.shields.io/badge/Blockchain-Solana-green)](https://solana.com)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple)](https://github.com)

## 🎯 Overview

DockSight AI is an autonomous analysis agent that transforms molecular docking results into publication-ready insights. Built specifically for the NeuraViva bounty, it generates comprehensive reports, advanced visualizations, and research-grade documentation to accelerate drug discovery research.

## 🚀 Key Features

### 📊 Automatic Report Generation

- **Comprehensive Analysis**: Detailed reports on docking scores, binding efficiencies, and drug efficacy predictions
- **Scientific Accuracy**: AI-powered analysis with validated molecular interaction insights
- **Publication Ready**: Formatted outputs suitable for research papers and grant proposals

### 🎨 Advanced Visualizations

- **3D Molecular Interactions**: Interactive visualization of binding positions and molecular structures
- **Binding Efficiency Charts**: Comparative analysis graphs and heatmaps
- **Protein-Ligand Networks**: Network diagrams showing interaction pathways

### 🔗 Blockchain Integration

- **Solana-Powered**: Leverages Solana blockchain for scalability and security
- **Verified Results**: Blockchain verification ensures data integrity and reproducibility
- **Decentralized Storage**: Secure, immutable storage of research data and results

### 🤖 AI Agent Capabilities

- **Autonomous Analysis**: Fully automated processing of .pdbqt and .log files
- **Intelligent Ranking**: AI-driven ligand ranking based on multiple scoring metrics
- **Research Integration**: Direct integration capabilities for research workflows

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  Backend API    │    │ Solana Network  │
│                 │    │                 │    │                 │
│ • File Upload   │◄──►│ • AI Analysis   │◄──►│ • Verification  │
│ • Visualizations│    │ • Report Gen    │    │ • Data Storage  │
│ • Results View  │    │ • Blockchain    │    │ • Smart Contracts│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

- **Frontend**: React + Vite, Tailwind CSS, Framer Motion
- **Backend**: Python FastAPI, Scientific Computing Libraries
- **AI/ML**: Custom analysis algorithms, molecular interaction models
- **Blockchain**: Solana Web3.js, Anchor Framework
- **Visualization**: Three.js, D3.js, Custom molecular renderers

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Solana CLI tools
- Modern web browser with WebGL support

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/docksight-ai.git
cd docksight-ai
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access Application

Open `http://localhost:3000` in your browser

## 📁 Project Structure

```
docksight-ai/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   └── utils/          # Utility functions
├── backend/                 # Python FastAPI backend
│   ├── agent/              # AI analysis agent
│   ├── api/                # REST API endpoints
│   ├── tools/              # Analysis tools
│   └── storage/            # Data storage utilities
├── solana/                 # Solana blockchain integration
│   ├── programs/           # Smart contracts
│   └── client/             # Web3 client code
├── sample_data/            # Example docking files
└── docs/                   # Documentation
```

## 🎮 Usage

### 1. Upload Docking Files

- Drag and drop `.pdbqt` or `.log` files
- Supports multiple file formats from AutoDock Vina
- Real-time validation and progress tracking

### 2. AI Analysis

- Autonomous processing of molecular data
- Binding affinity calculations
- Drug efficacy predictions
- Interaction pathway analysis

### 3. Report Generation

- Comprehensive scientific reports
- Publication-ready formatting
- Customizable templates for different use cases

### 4. Blockchain Verification

- Results stored on Solana blockchain
- Immutable research data
- Verifiable analysis integrity

## 🔬 Scientific Capabilities

### Molecular Analysis

- **Binding Affinity Scoring**: Advanced algorithms for accurate binding predictions
- **ADMET Properties**: Absorption, Distribution, Metabolism, Excretion, Toxicity analysis
- **Drug-likeness Assessment**: Lipinski's Rule of Five and extended parameters

### Visualization Features

- **3D Protein Structures**: Interactive molecular viewers
- **Binding Site Analysis**: Detailed pocket characterization
- **Comparative Studies**: Side-by-side ligand comparisons

### Research Integration

- **Export Formats**: PDF, CSV, JSON, and research paper templates
- **Citation Ready**: Properly formatted references and methodology
- **Grant Proposal Support**: Tailored outputs for funding applications

## 🌐 Solana Integration

### Smart Contracts

- **Data Verification**: Cryptographic proof of analysis integrity
- **Result Storage**: Decentralized storage of research outcomes
- **Access Control**: Secure sharing and collaboration features

### Benefits

- **Scalability**: Handle large-scale molecular datasets
- **Security**: Tamper-proof research data
- **Efficiency**: Fast transaction processing and low fees

## 📊 Demo Data

Sample molecular docking files are provided in `/sample_data/`:

- `aspirin.pdbqt` - Common pain reliever analysis
- `caffeine.pdbqt` - Stimulant compound study
- `penicillin.pdbqt` - Antibiotic effectiveness analysis
- Various `.log` files with docking results

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Dora Hacks Submission

This project addresses the NeuraViva bounty requirements:

✅ **AI Agent**: Autonomous analysis and report generation  
✅ **Comprehensive Reports**: Detailed docking scores and binding efficiencies  
✅ **Advanced Visualizations**: Molecular interactions and binding positions  
✅ **Research Integration**: Direct integration into papers and proposals  
✅ **Solana Integration**: Blockchain-powered scalability and security

## 📞 Contact & Support

- **Project Lead**: [Your Name]
- **Email**: [your.email@domain.com]
- **Discord**: [Your Discord Handle]
- **Twitter**: [@YourTwitter]

## 🙏 Acknowledgments

- NeuraViva for the inspiring bounty challenge
- Dora Hacks for the platform and opportunity
- Solana Foundation for blockchain infrastructure
- Open source molecular visualization libraries

---

**Built with ❤️ for the future of drug discovery**
