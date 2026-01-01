# Sample Docking Data for DockSight AI

This folder contains sample AutoDock Vina output files for testing the DockSight AI system.

## Files Included

### 1. compound_A.log

- **Format**: AutoDock Vina log file
- **Best ΔG**: -8.5 kcal/mol
- **Poses**: 5 poses
- **Description**: Medium binding affinity compound

### 2. compound_B.log

- **Format**: AutoDock Vina log file
- **Best ΔG**: -9.5 kcal/mol
- **Poses**: 4 poses
- **Description**: Good binding affinity compound

### 3. compound_C.pdbqt

- **Format**: PDBQT with VINA RESULT remarks
- **Best ΔG**: -8.1 kcal/mol
- **Poses**: 3 poses (MODEL 1, 2, 3)
- **Description**: Medium binding affinity compound with coordinates

### 4. compound_D.pdbqt

- **Format**: PDBQT with VINA RESULT remarks
- **Best ΔG**: -10.2 kcal/mol
- **Poses**: 3 poses (MODEL 1, 2, 3)
- **Description**: **Best binding affinity** - should rank #1

## Expected Results

When you upload these files through the DockSight AI interface, you should see:

### Ranked Ligands (Best to Worst):

1. **compound_D**: -10.2 kcal/mol ⭐ (Best)
2. **compound_B**: -9.5 kcal/mol
3. **compound_A**: -8.5 kcal/mol
4. **compound_C**: -8.1 kcal/mol

### Analysis Output:

- ✅ 4 ligands successfully parsed
- ✅ Ranked by binding affinity (most negative = best)
- ✅ Best pose selected per ligand
- ✅ Scientific report generated with Groq LLM
- ✅ Solana attestation hash created (dry-run)

## How to Test

### Option 1: Web Interface (Recommended)

1. Open http://localhost:3000
2. Click "Click to select files"
3. Select all 4 files (or any combination)
4. Click "Analyze Docking Results"
5. View results on the analysis page

### Option 2: Command Line

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/compound_A.log" \
  -F "files=@sample_data/compound_B.log" \
  -F "files=@sample_data/compound_C.pdbqt" \
  -F "files=@sample_data/compound_D.pdbqt" \
  | python3 -m json.tool
```

### Option 3: Test Individual Files

Upload just one file to see how the system handles single ligand analysis:

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/compound_D.pdbqt" \
  | python3 -m json.tool
```

## File Format Details

### Vina Log Format (.log)

```
mode |   affinity | dist from best mode
     | (kcal/mol) | rmsd l.b.| rmsd u.b.
-----+------------+----------+----------
   1        -8.5      0.000      0.000
   2        -7.9      1.234      2.456
```

### PDBQT Format (.pdbqt)

```
MODEL 1
REMARK VINA RESULT:    -10.2      0.000      0.000
ATOM      1  C   LIG     1      15.234  20.567  25.123  ...
ENDMDL
```

## What Gets Tested

✅ **Parsing**: Both .log and .pdbqt formats
✅ **Ranking**: Correct sorting by ΔG
✅ **Best Pose Selection**: Lowest ΔG per ligand
✅ **Report Generation**: Groq LLM creates discussion
✅ **Attestation**: SHA-256 hashes generated
✅ **API**: Complete end-to-end pipeline

## Troubleshooting

### Upload fails

- Check file extensions (.log or .pdbqt only)
- Verify backend is running (http://localhost:8000/api/health)
- Check browser console for errors

### No results shown

- Check backend logs for parsing errors
- Verify files contain valid Vina output format
- Ensure GROQ_API_KEY is set in .env

### Ranking seems wrong

- Verify: Most negative ΔG should rank highest
- compound_D (-10.2) should always be #1
- Check that best pose per ligand is selected

## Notes

- These are **mock data** for testing purposes
- Binding affinities are realistic but not from actual experiments
- Atom coordinates are simplified
- No actual protein structure is included
- Interaction analysis is placeholder (not yet implemented)
- Visualizations are placeholder (not yet rendered)

## Real Data

To use your own docking results:

1. Run AutoDock Vina on your system
2. Upload the generated .pdbqt or .log files
3. System will parse and analyze them the same way
