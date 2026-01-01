# 📁 Upload These Files for Best Results

## 🎯 Recommended: 10 PDBQT Files

For the most comprehensive demonstration of DockSight AI capabilities, upload these 10 files:

```
📄 sample_data/sildenafil.pdbqt      (-11.2 kcal/mol) 🟢 Strong
📄 sample_data/atorvastatin.pdbqt    (-10.8 kcal/mol) 🟢 Strong
📄 sample_data/penicillin.pdbqt      (-10.5 kcal/mol) 🟢 Strong
📄 sample_data/warfarin.pdbqt        (-9.7 kcal/mol)  🟢 Strong
📄 sample_data/lisinopril.pdbqt      (-9.3 kcal/mol)  🟢 Strong
📄 sample_data/ibuprofen.pdbqt       (-8.9 kcal/mol)  🟡 Moderate
📄 sample_data/amoxicillin.pdbqt     (-8.6 kcal/mol)  🟡 Moderate
📄 sample_data/omeprazole.pdbqt      (-7.8 kcal/mol)  🟡 Moderate
📄 sample_data/aspirin.pdbqt         (-7.2 kcal/mol)  🟡 Moderate
📄 sample_data/caffeine.pdbqt        (-6.3 kcal/mol)  🔴 Weak
```

## 🚀 How to Upload

### Via Web UI (Recommended)

1. Open http://localhost:3001
2. Click **"Choose Files"** button
3. Navigate to `sample_data/` folder
4. Select all 10 files above (hold Cmd/Ctrl for multiple selection)
5. Click **"Analyze Docking Results"**
6. Wait ~10-15 seconds
7. Explore the results!

### Via Drag & Drop

1. Open http://localhost:3001
2. Open Finder/Explorer to `sample_data/` folder
3. Select all 10 PDBQT files
4. Drag them onto the upload area
5. Click **"Analyze Docking Results"**

## ✨ What You'll Get

### 📊 Executive Summary

- Top Candidate: **sildenafil** (-11.2 kcal/mol) 🥇
- Average ΔG: **-8.83 kcal/mol**
- Total Ligands: **10**
- Blockchain: ✅ Verified on Solana

### 📈 Interactive Chart

- 10 color-coded bars
- Hover for exact values
- Green/Yellow/Red by strength

### 📋 Enhanced Table

- 🥇🥈🥉 Medals for top 3
- Color-coded badges
- "View 3D" buttons for all
- Recommendations

### 🧬 3D Molecular Viewer

- Works for all 10 compounds
- Interactive rotation
- Ball-and-stick representation
- Auto-rotation

### 📄 Professional Report

- Results Summary Table
- Key Findings (bullets)
- Methods section
- Discussion points
- Citation format
- Copy buttons for each section
- Print/PDF export

### 🔗 Blockchain Attestation

- Real Solana Devnet transaction
- Explorer link
- Cryptographic verification

## 🎯 Alternative Test Scenarios

### Quick Test (4 files)

For basic functionality testing:

```
📄 compound_A.log
📄 compound_B.log
📄 compound_C.pdbqt
📄 compound_D.pdbqt
```

### Top Candidates Only (4 files)

For strong binders only:

```
📄 sildenafil.pdbqt
📄 atorvastatin.pdbqt
📄 penicillin.pdbqt
📄 warfarin.pdbqt
```

### Maximum Dataset (15 files)

For absolute maximum data:

```
All 13 PDBQT files + 2 LOG files
```

## 💡 Pro Tips

1. **Use PDBQT files** - They support 3D visualization
2. **Upload 10 files** - Best balance of diversity and performance
3. **Check 3D viewer** - Click "View 3D" on any compound
4. **Copy report sections** - Use 📋 buttons for papers/grants
5. **Verify blockchain** - Click Explorer link to see on-chain proof

## ⏱️ Expected Timing

- **Upload**: < 1 second
- **Analysis**: 10-15 seconds
  - Parsing: ~1 second
  - Ranking: < 1 second
  - Visualization: ~2 seconds
  - Report generation (Groq LLM): ~5-8 seconds
  - Solana attestation: ~2-3 seconds
- **Page load**: < 2 seconds
- **Total**: ~15-20 seconds

## 🎨 Visual Preview

After upload, you'll see:

```
┌─────────────────────────────────────────────────┐
│  🔬 Analysis Results                            │
│  Comprehensive molecular docking analysis       │
├─────────────────────────────────────────────────┤
│  📊 Executive Summary                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Top: 🥇   │ │Avg: -8.8 │ │Total: 10 │       │
│  │sildenafil│ │kcal/mol  │ │ligands   │       │
│  └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────┤
│  📈 Binding Affinity Chart                      │
│  ████████████ sildenafil (-11.2) 🟢            │
│  ███████████ atorvastatin (-10.8) 🟢           │
│  ██████████ penicillin (-10.5) 🟢              │
│  ...                                            │
├─────────────────────────────────────────────────┤
│  📋 Ranked Ligands                              │
│  🥇 sildenafil    -11.2  Strong  View 3D →     │
│  🥈 atorvastatin  -10.8  Strong  View 3D →     │
│  🥉 penicillin    -10.5  Strong  View 3D →     │
│  ...                                            │
├─────────────────────────────────────────────────┤
│  📄 Scientific Report                           │
│  [Copy Full Report] [Print/PDF]                │
│  • Results Summary Table                        │
│  • Key Findings                                 │
│  • Methods                                      │
│  • Discussion                                   │
│  • Citation Format                              │
└─────────────────────────────────────────────────┘
```

## ✅ Success Checklist

After upload, verify:

- [ ] All 10 compounds appear in table
- [ ] sildenafil ranks #1
- [ ] Chart shows 10 bars
- [ ] Executive summary shows correct metrics
- [ ] "View 3D" buttons work
- [ ] Report sections are copy-pasteable
- [ ] Blockchain attestation succeeded
- [ ] No console errors
- [ ] Smooth, responsive UI

## 🐛 Troubleshooting

### Files won't upload

- Check file extensions (.pdbqt or .log)
- Verify backend is running (http://localhost:8000)
- Check browser console for errors

### Analysis takes too long

- Normal: 10-15 seconds for 10 files
- Check backend logs for issues
- Verify Groq API key is set

### 3D viewer doesn't work

- Only works with PDBQT files
- Check browser console for errors
- Try refreshing the page

---

**Ready?** Upload the 10 PDBQT files and see DockSight AI in action! 🚀
