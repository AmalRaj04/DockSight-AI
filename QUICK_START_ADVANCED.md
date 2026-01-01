# 🚀 Quick Start - Advanced Features

## New Features Available

1. **Tags & Projects** - Organize your analyses
2. **Search & Filter** - Find analyses instantly
3. **Export** - CSV, Excel, PDF
4. **Compare** - Side-by-side analysis

---

## 1. Tags & Projects (30 seconds)

### Add Tags

1. Go to http://localhost:3001/history
2. Click **"Edit"** on any analysis
3. Type tag name (e.g., "promising")
4. Click **"Add"**
5. Click **"Save"**

### Add Project

1. Click **"Edit"**
2. Enter project name (e.g., "EGFR Inhibitors")
3. Click **"Save"**

---

## 2. Search & Filter (10 seconds)

### Search

- Type in search box
- Searches ligand names, IDs, projects
- Real-time results

### Filter by Tags

- Click tag buttons to filter
- Blue = selected
- Click again to deselect

### Filter by Project

- Select from dropdown
- "All Projects" to clear

### Clear All

- Click **"Clear all filters"**

---

## 3. Export (5 seconds)

### From Results Page

1. Go to any analysis
2. Scroll to Scientific Report
3. Click export button:
   - **📊 Export CSV** - For Excel/R/Python
   - **📈 Export Excel** - For Excel
   - **🖨️ Print/PDF** - For PDF
   - **📋 Copy** - For clipboard

### What You Get

- **CSV**: Data in comma-separated format
- **Excel**: Tab-separated (opens in Excel)
- **PDF**: Complete formatted report
- **Copy**: Text for pasting

---

## 4. Compare (1 minute)

### Steps

1. Go to http://localhost:3001/history
2. Check 2-3 analyses (checkboxes)
3. Click **"Compare Selected"**
4. View comparison page

### What You See

- Summary cards for each analysis
- Overlapping ligands
- Comparison chart
- Detailed table with changes
- All ligands lists

---

## Quick Test (2 minutes)

### Step 1: Upload Files

1. Go to http://localhost:3001
2. Upload 10 PDBQT files from `sample_data/`
3. Wait for analysis

### Step 2: Add Tags

1. Go to History
2. Edit the analysis
3. Add tags: "test", "high-affinity"
4. Project: "Test Project"
5. Save

### Step 3: Export

1. Click "View Report"
2. Scroll to Scientific Report
3. Click "Export CSV"
4. Verify file downloads

### Step 4: Upload More

1. Go back to home
2. Upload 4 different files
3. Wait for analysis

### Step 5: Compare

1. Go to History
2. Check both analyses
3. Click "Compare Selected"
4. Review comparison

---

## Tips

### Tagging

- Use consistent tags: "promising", "validated", "published"
- Add project names for grouping
- Use notes for context

### Searching

- Start broad, then filter
- Use partial terms: "silde" finds "sildenafil"
- Combine search + tags + project

### Exporting

- CSV for analysis (R, Python)
- Excel for stakeholders
- PDF for sharing
- Copy for quick paste

### Comparing

- Compare similar experiments
- Track optimization progress
- Limit to 2-3 analyses
- Focus on overlapping ligands

---

## Keyboard Shortcuts

- **Ctrl/Cmd + F**: Search (browser)
- **Enter**: Submit search
- **Esc**: Clear/close
- **Ctrl/Cmd + P**: Print/PDF

---

## URLs

- **Home**: http://localhost:3001
- **History**: http://localhost:3001/history
- **Compare**: http://localhost:3001/compare?ids=ID1,ID2

---

## API Quick Reference

```bash
# List with filters
curl "http://localhost:8000/api/analyses?search=term&tags=tag1&project=name"

# Get tags
curl "http://localhost:8000/api/analyses/tags"

# Get projects
curl "http://localhost:8000/api/analyses/projects"

# Update metadata
curl -X PATCH "http://localhost:8000/api/analyses/ID/metadata" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["test"], "project": "Project", "notes": "Notes"}'
```

---

**Ready?** Go to http://localhost:3001 and start using the advanced features!
