# Quick Test Guide - Phase 1 Enhancements

## 🚀 Start Everything

### Terminal 1: Backend

```bash
python3 -m uvicorn backend.main:app --reload --port 8000
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

**URLs**:

- Frontend: http://localhost:3001
- Backend: http://localhost:8000

---

## 🧪 Test Scenario

### Step 1: Upload Files

1. Go to http://localhost:3001
2. Click "Choose Files" or drag & drop
3. Select these files:
   - `sample_data/compound_A.log`
   - `sample_data/compound_B.log`
   - `sample_data/compound_C.pdbqt`
   - `sample_data/compound_D.pdbqt`
4. Click "Analyze Docking Results"

### Step 2: Observe New Features

#### ✅ Executive Summary (Top)

- [ ] See 3 metric cards (Top Candidate, Average ΔG, Total Ligands)
- [ ] Top ligand shows medal 🥇
- [ ] Binding strength indicator (🟢/🟡/🔴)
- [ ] Recommendation text appears
- [ ] Blockchain verification badge visible

#### ✅ Binding Affinity Chart

- [ ] Bar chart displays all ligands
- [ ] Bars are color-coded (green/yellow/red)
- [ ] Hover shows exact values
- [ ] Chart is responsive

#### ✅ Enhanced Table

- [ ] Top 3 rows have medals (🥇🥈🥉)
- [ ] Binding affinity has colored badges
- [ ] Strength column shows Strong/Moderate/Weak
- [ ] "View 3D →" buttons present
- [ ] Top 3 rows highlighted

#### ✅ Collapsible Sections

- [ ] "Molecular Interactions" is collapsible
- [ ] "Visualizations" is collapsible
- [ ] "Scientific Report" is collapsible
- [ ] Smooth expand/collapse animation

#### ✅ Metadata Section

- [ ] Status shows "complete"
- [ ] Network shows "devnet"
- [ ] Attestation TX is displayed
- [ ] "View on Explorer" link works

---

## 🎯 Expected Results

### Sample Data Rankings:

1. 🥇 **compound_D**: -10.2 kcal/mol (Strong, Green)
2. 🥈 **compound_B**: -9.5 kcal/mol (Strong, Green)
3. 🥉 **compound_A**: -8.5 kcal/mol (Moderate, Yellow)
4. **compound_C**: -8.1 kcal/mol (Moderate, Yellow)

### Executive Summary Should Show:

- **Top Candidate**: compound_D
- **Average ΔG**: ~-9.1 kcal/mol
- **Total Ligands**: 4
- **Recommendation**: compound_D for further testing

### Chart Should Show:

- 4 bars (A, B, C, D)
- compound_D tallest (most negative)
- Green bars for D and B
- Yellow bars for A and C

---

## 🐛 Troubleshooting

### Frontend not loading?

```bash
cd frontend
npm install
npm run dev
```

### Backend errors?

```bash
pip3 install --break-system-packages uvicorn fastapi python-multipart groq
python3 -m uvicorn backend.main:app --reload --port 8000
```

### Chart not showing?

```bash
cd frontend
npm install chart.js react-chartjs-2
```

### Port already in use?

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

---

## 📊 API Test (Optional)

Test backend directly:

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@sample_data/compound_A.log" \
  -F "files=@sample_data/compound_B.log" \
  | python3 -m json.tool
```

Expected response:

```json
{
  "status": "complete",
  "ranked_ligands": [...],
  "report": "...",
  "attestation": {
    "success": true,
    "transaction_signature": "...",
    "network": "devnet",
    "explorer_url": "https://explorer.solana.com/tx/..."
  }
}
```

---

## ✅ Checklist

### Visual Features:

- [ ] Executive summary with 3 cards
- [ ] Bar chart with color coding
- [ ] Table with medals and badges
- [ ] Collapsible sections work
- [ ] Blockchain badge visible
- [ ] Gradient background
- [ ] Responsive on mobile

### Functionality:

- [ ] File upload works
- [ ] Analysis completes
- [ ] Rankings are correct
- [ ] Chart displays data
- [ ] Solana attestation succeeds
- [ ] Explorer link opens
- [ ] No console errors

### Performance:

- [ ] Page loads in < 2 seconds
- [ ] Chart renders smoothly
- [ ] No lag when expanding sections
- [ ] Mobile responsive

---

## 🎨 Visual Comparison

### Before (Old Dashboard):

- Plain white background
- Basic table, no colors
- Long text report
- No charts
- Attestation TX in small text

### After (New Dashboard):

- ✅ Gradient background
- ✅ Executive summary cards
- ✅ Interactive bar chart
- ✅ Color-coded table with medals
- ✅ Collapsible sections
- ✅ Blockchain verification badge
- ✅ Professional, stakeholder-ready

---

## 📸 Take Screenshots

For documentation/bounty:

1. Full page view
2. Executive summary close-up
3. Bar chart
4. Enhanced table
5. Blockchain badge
6. Mobile view

---

## 🚀 Next Steps

After testing Phase 1:

1. Gather feedback
2. Implement 3D viewer (Phase 2)
3. Add interaction diagrams
4. Export functionality
5. ADMET predictions

---

**Status**: ✅ Ready to test
**Time to test**: ~5 minutes
**Expected outcome**: Professional, visual dashboard
