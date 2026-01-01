# Sample Docking Data for DockSight AI

This folder contains sample AutoDock Vina output files for testing the DockSight AI system.

## 📊 Complete Dataset (15 Compounds)

All files include realistic binding affinities for comprehensive testing.

| Compound         | Format | Binding Affinity | Strength    | Drug Class            |
| ---------------- | ------ | ---------------- | ----------- | --------------------- |
| **sildenafil**   | .pdbqt | -11.2 kcal/mol   | 🟢 Strong   | PDE5 inhibitor        |
| **atorvastatin** | .pdbqt | -10.8 kcal/mol   | 🟢 Strong   | Statin                |
| **penicillin**   | .pdbqt | -10.5 kcal/mol   | 🟢 Strong   | Antibiotic            |
| **compound_D**   | .pdbqt | -10.2 kcal/mol   | 🟢 Strong   | Test compound         |
| **warfarin**     | .pdbqt | -9.7 kcal/mol    | 🟢 Strong   | Anticoagulant         |
| **compound_B**   | .log   | -9.5 kcal/mol    | 🟢 Strong   | Test compound         |
| **lisinopril**   | .pdbqt | -9.3 kcal/mol    | 🟢 Strong   | ACE inhibitor         |
| **ibuprofen**    | .pdbqt | -8.9 kcal/mol    | 🟡 Moderate | NSAID                 |
| **amoxicillin**  | .pdbqt | -8.6 kcal/mol    | 🟡 Moderate | Antibiotic            |
| **compound_A**   | .log   | -8.5 kcal/mol    | 🟡 Moderate | Test compound         |
| **compound_C**   | .pdbqt | -8.1 kcal/mol    | 🟡 Moderate | Test compound         |
| **omeprazole**   | .pdbqt | -7.8 kcal/mol    | 🟡 Moderate | Proton pump inhibitor |
| **aspirin**      | .pdbqt | -7.2 kcal/mol    | 🟡 Moderate | NSAID                 |
| **caffeine**     | .pdbqt | -6.3 kcal/mol    | 🔴 Weak     | Stimulant             |
| **metformin**    | .pdbqt | -5.8 kcal/mol    | 🔴 Weak     | Antidiabetic          |

## 🎯 Usage Scenarios

### Quick Test (4 files)

Test basic functionality with original sample files:

```bash
# Via Web UI: Upload these files at http://localhost:3001
compound_A.log, compound_B.log, compound_C.pdbqt, compound_D.pdbqt
```

### Comprehensive Test (10 PDBQT files)

**RECOMMENDED** - Test full dashboard capabilities with diverse binding affinities:

```bash
# Via Web UI: Upload all 10 PDBQT files
sildenafil.pdbqt
atorvastatin.pdbqt
penicillin.pdbqt
warfarin.pdbqt
lisinopril.pdbqt
ibuprofen.pdbqt
amoxicillin.pdbqt
omeprazole.pdbqt
aspirin.pdbqt
caffeine.pdbqt
```

### Top Candidates Only (Strong Binders)

Test with only high-affinity compounds:

```bash
# Via Web UI: Upload these 4 files
sildenafil.pdbqt
atorvastatin.pdbqt
penicillin.pdbqt
warfarin.pdbqt
```

## 🚀 What to Expect

### Executive Summary Dashboard

- **Top Candidate**: sildenafil (-11.2 kcal/mol) with 🥇 medal
- **Average ΔG**: ~-8.5 kcal/mol (varies by selection)
- **Total Ligands**: 10-15 (depending on selection)
- **Distribution**: 7 strong, 6 moderate, 2 weak binders

### Interactive Visualizations

- ✅ **Bar Chart**: Color-coded by binding strength (green/yellow/red)
- ✅ **3D Molecular Viewer**: Interactive structures for all PDBQT files
- ✅ **Binding Pose Cards**: Visual comparison of top candidates
- ✅ **Comparison Charts**: Side-by-side affinity analysis

### Professional Scientific Report

- ✅ **Results Table**: Ranked compounds with recommendations
- ✅ **Key Findings**: Bullet-point highlights
- ✅ **Methods**: Docking methodology description
- ✅ **Discussion**: Scientific interpretation
- ✅ **Citation Format**: Ready-to-use reference
- ✅ **Copy Buttons**: Each section can be copied for papers/grants

### Blockchain Attestation

- ✅ **Network**: Solana Devnet
- ✅ **Transaction**: Cryptographic hash of results
- ✅ **Explorer Link**: View on Solana Explorer
- ✅ **Verification Badge**: Displayed in executive summary

## 📁 File Format Details

### PDBQT Format (.pdbqt)

- Contains 3D molecular structure with coordinates
- Multiple binding poses (MODEL 1, MODEL 2, etc.)
- VINA RESULT line with binding affinity
- **Supports 3D visualization** in the dashboard
- Example:

```
MODEL 1
REMARK VINA RESULT:    -10.2      0.000      0.000
ATOM      1  C   LIG     1      15.234  20.567  25.123  ...
ENDMDL
```

### LOG Format (.log)

- Text-based docking results
- Binding affinity scores in table format
- Multiple poses per ligand
- **No 3D visualization** (structure data not included)
- Example:

```
mode |   affinity | dist from best mode
     | (kcal/mol) | rmsd l.b.| rmsd u.b.
-----+------------+----------+----------
   1        -8.5      0.000      0.000
```

## 💡 Tips for Testing

1. **Start Small**: Test with 4 original files first to verify setup
2. **Go Comprehensive**: Upload all 10 PDBQT files to see full capabilities
3. **Test 3D Viewer**: Click "View 3D →" on any PDBQT compound
4. **Copy Report Sections**: Use 📋 buttons to copy for documents
5. **Check Blockchain**: Click "View on Explorer" link in metadata
6. **Print/Export**: Use 🖨️ button to generate PDF report

## 📊 Expected Rankings (All Files)

1. 🥇 **sildenafil**: -11.2 kcal/mol → Primary candidate
2. 🥈 **atorvastatin**: -10.8 kcal/mol → Alternative
3. 🥉 **penicillin**: -10.5 kcal/mol → Further study
4. compound_D: -10.2 kcal/mol
5. warfarin: -9.7 kcal/mol
6. compound_B: -9.5 kcal/mol
7. lisinopril: -9.3 kcal/mol
8. ibuprofen: -8.9 kcal/mol
9. amoxicillin: -8.6 kcal/mol
10. compound_A: -8.5 kcal/mol
11. compound_C: -8.1 kcal/mol
12. omeprazole: -7.8 kcal/mol
13. aspirin: -7.2 kcal/mol
14. caffeine: -6.3 kcal/mol
15. metformin: -5.8 kcal/mol

## 🧪 Testing via Command Line (Optional)

### Test All PDBQT Files

```bash
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
  -F "files=@sample_data/caffeine.pdbqt" \
  | python3 -m json.tool
```

### Test Original 4 Files

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/compound_A.log" \
  -F "files=@sample_data/compound_B.log" \
  -F "files=@sample_data/compound_C.pdbqt" \
  -F "files=@sample_data/compound_D.pdbqt" \
  | python3 -m json.tool
```

## 🔍 What Gets Tested

✅ **Parsing**: Both .log and .pdbqt formats
✅ **Ranking**: Correct sorting by ΔG (most negative = best)
✅ **Best Pose Selection**: Lowest ΔG per ligand
✅ **Report Generation**: Groq LLM creates scientific discussion
✅ **Attestation**: Real Solana Devnet transactions
✅ **3D Visualization**: Interactive molecular viewer
✅ **Charts**: Color-coded binding affinity visualization
✅ **Professional Report**: Copy-pasteable sections for papers
✅ **API**: Complete end-to-end pipeline

## 🐛 Troubleshooting

### Upload fails

- Check file extensions (.log or .pdbqt only)
- Verify backend is running: http://localhost:8000/api/health
- Check browser console for errors

### No 3D visualization

- Only PDBQT files support 3D viewer
- LOG files don't contain structure data
- Check that jQuery and 3Dmol.js loaded successfully

### Ranking seems wrong

- Most negative ΔG should rank highest
- sildenafil (-11.2) should always be #1
- Check that best pose per ligand is selected

### Solana attestation fails

- Check `.env` has `ENABLE_SOLANA_ATTESTATION=true`
- Verify keypair exists at `~/.config/solana/id.json`
- Check Solana Devnet is accessible
- Analysis will still complete even if attestation fails

## 📝 Notes

- These are **realistic mock data** for testing purposes
- Binding affinities are based on typical drug-protein interactions
- Atom coordinates are simplified but valid PDBQT format
- All compounds are real drugs (except compound_A/B/C/D)
- System works identically with real AutoDock Vina output

## 🔬 Using Your Own Data

To analyze your own docking results:

1. Run AutoDock Vina on your protein-ligand system
2. Upload the generated .pdbqt or .log files
3. System will parse and analyze them automatically
4. Results are attested on Solana blockchain for reproducibility

---

**Ready to test?** Start with the **Comprehensive Test** (10 PDBQT files) to see all dashboard features!
