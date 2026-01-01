# 🚀 Advanced Features Guide

## Overview

Four powerful new features have been implemented to make DockSight AI truly professional for scientific research:

1. **Project Tags & Labels** - Organize analyses
2. **Search & Filter** - Find analyses quickly
3. **Export Options** - CSV, Excel, PDF
4. **Batch Comparison** - Side-by-side analysis

---

## Feature 1: Project Tags & Labels

### What It Does

Organize your analyses with custom tags and project names for better management.

### How to Use

#### Adding Tags & Project

1. Go to History page
2. Find an analysis
3. Click **"Edit"** button
4. Enter project name (e.g., "EGFR Inhibitors")
5. Add tags (e.g., "promising", "needs-validation", "published")
6. Add notes for context
7. Click **"Save"**

#### Tag Examples

- `promising` - Candidates worth pursuing
- `published` - Included in publications
- `needs-validation` - Requires experimental confirmation
- `high-affinity` - Strong binders (< -9.0 kcal/mol)
- `lead-optimization` - Optimization candidates
- `natural-products` - Natural compound sources

#### Project Examples

- "EGFR Inhibitors Phase 1"
- "COVID-19 Targets"
- "Kinase Screening"
- "Natural Products Library"

### Benefits

- **Organization**: Group related analyses
- **Quick Identification**: Visual tags at a glance
- **Filtering**: Find specific analyses instantly
- **Collaboration**: Share context with team members

---

## Feature 2: Search & Filter

### What It Does

Powerful search and filtering to find exactly what you need from hundreds of analyses.

### Search Capabilities

#### Search Bar

Searches across:

- Ligand names (e.g., "sildenafil")
- Analysis IDs
- Project names

**Example**: Type "sildenafil" to find all analyses containing that compound

#### Project Filter

- Dropdown showing all your projects
- Select to see only analyses from that project
- "All Projects" to clear filter

#### Tag Filter

- Click tags to filter
- Multiple tags = OR logic (any match)
- Blue = selected, Gray = unselected
- Click again to deselect

### Filter Combinations

**Example 1**: Find promising EGFR candidates

- Project: "EGFR Inhibitors"
- Tags: "promising"

**Example 2**: Find all high-affinity compounds

- Tags: "high-affinity"
- Search: (leave empty)

**Example 3**: Find specific compound across projects

- Search: "atorvastatin"
- Project: "All Projects"

### Clear Filters

Click **"Clear all filters"** to reset and see everything

---

## Feature 3: Export Options

### What It Does

Export your data in multiple formats for papers, presentations, and further analysis.

### Export Formats

#### 1. CSV Export

**Button**: 📊 Export CSV

**What You Get**:

- Comma-separated values file
- Opens in Excel, Google Sheets, R, Python
- Columns: Rank, Compound, ΔG, Strength, Recommendation

**Use Cases**:

- Statistical analysis in R/Python
- Import into other tools
- Data archiving

**Example**:

```csv
Rank,Compound,Binding Affinity (kcal/mol),Binding Strength,Recommendation
1,"sildenafil",-11.2,Strong,Primary candidate
2,"atorvastatin",-10.8,Strong,Alternative
```

#### 2. Excel Export

**Button**: 📈 Export Excel

**What You Get**:

- Tab-separated values (opens in Excel)
- Same data as CSV
- Excel-friendly format

**Use Cases**:

- Share with non-technical stakeholders
- Create pivot tables
- Excel-based analysis

#### 3. PDF Export

**Button**: 🖨️ Print/PDF

**What You Get**:

- Complete formatted report
- All sections included
- Professional layout

**How to Use**:

1. Click "Print/PDF" button
2. Browser print dialog opens
3. Select "Save as PDF"
4. Choose location and save

**Use Cases**:

- Include in grant proposals
- Attach to papers
- Share with collaborators
- Archive for records

#### 4. Copy to Clipboard

**Button**: 📋 Copy Full Report

**What You Get**:

- Entire report as text
- Paste into Word, Google Docs, etc.
- Preserves formatting

**Use Cases**:

- Quick paste into documents
- Email to collaborators
- Lab notebook entries

### Section-Specific Copy

Each section has its own copy button:

- Results Table
- Key Findings
- Methods
- Discussion
- Citation

**Use Case**: Copy just the Methods section for your paper

---

## Feature 4: Batch Comparison

### What It Does

Compare 2-3 analyses side-by-side to track progress and identify trends.

### How to Use

#### Step 1: Select Analyses

1. Go to History page
2. Check the checkbox next to each analysis you want to compare
3. Select 2-3 analyses (maximum 3)
4. Blue bar appears showing selection count

#### Step 2: Start Comparison

1. Click **"Compare Selected"** button
2. Comparison page loads

#### Step 3: Review Comparison

**Summary Cards**:

- Overview of each analysis
- Date, ligand count, top candidate
- Best ΔG for each

**Overlapping Ligands**:

- Shows compounds present in ALL analyses
- Useful for tracking specific compounds over time

**Comparison Chart**:

- Bar chart showing affinities across analyses
- Color-coded by analysis
- Easy visual comparison

**Detailed Table**:

- Row per overlapping ligand
- Column per analysis
- "Change" column shows improvement/decline

**All Ligands**:

- Complete list for each analysis
- Top 10 shown per analysis

### Use Cases

#### Use Case 1: Track Optimization

**Scenario**: You've run 3 rounds of lead optimization

1. Select all 3 analyses
2. Compare
3. Look for improvements in binding affinity
4. Identify which modifications worked

**What to Look For**:

- Negative change = improvement (more negative ΔG)
- Consistent improvements across compounds
- Which scaffolds improved most

#### Use Case 2: Validate Reproducibility

**Scenario**: Repeat experiment to confirm results

1. Select original and repeat analyses
2. Compare
3. Check if affinities are similar

**What to Look For**:

- Small differences (< 0.5 kcal/mol) = good reproducibility
- Large differences = investigate experimental conditions

#### Use Case 3: Compare Protocols

**Scenario**: Test different docking parameters

1. Select analyses with different protocols
2. Compare
3. See which protocol gives better results

**What to Look For**:

- Which protocol finds stronger binders
- Consistency across compounds
- Computational cost vs. accuracy

---

## Workflow Examples

### Workflow 1: Systematic Drug Discovery

**Week 1**: Initial Screening

1. Upload 50 compounds
2. Tag: "initial-screen"
3. Project: "Kinase Inhibitors"

**Week 2**: Top 20 Candidates

1. Upload top 20 from Week 1
2. Tag: "round-2"
3. Project: "Kinase Inhibitors"
4. Compare with Week 1

**Week 3**: Lead Optimization

1. Upload optimized versions of top 5
2. Tag: "lead-optimization"
3. Project: "Kinase Inhibitors"
4. Compare all 3 rounds

**Week 4**: Final Selection

1. Search: "Kinase Inhibitors"
2. Filter tags: "lead-optimization"
3. Export to Excel
4. Present to team

### Workflow 2: Publication Preparation

**Step 1**: Gather Data

1. Search for all analyses in project
2. Filter by "published" tag
3. Review all relevant analyses

**Step 2**: Generate Figures

1. Select key analyses for comparison
2. Take screenshots of comparison charts
3. Export data to CSV for custom plots

**Step 3**: Write Methods

1. Open any analysis
2. Go to Scientific Report
3. Copy Methods section
4. Paste into manuscript

**Step 4**: Create Supplementary

1. Export all data to Excel
2. Compile into supplementary tables
3. Include blockchain verification

### Workflow 3: Grant Proposal

**Step 1**: Show Preliminary Data

1. Filter by project name
2. View statistics (total ligands tested)
3. Screenshot executive summary

**Step 2**: Demonstrate Progress

1. Select first and latest analyses
2. Compare to show improvement
3. Highlight optimization success

**Step 3**: Export Evidence

1. Export comparison to PDF
2. Include in proposal
3. Cite blockchain verification

---

## API Reference

### New Endpoints

#### List Analyses with Filters

```http
GET /api/analyses?search=sildenafil&tags=promising&project=EGFR

Response:
{
  "analyses": [...],
  "count": 5,
  "limit": 50,
  "offset": 0
}
```

#### Get All Tags

```http
GET /api/analyses/tags

Response:
{
  "tags": ["promising", "published", "high-affinity"]
}
```

#### Get All Projects

```http
GET /api/analyses/projects

Response:
{
  "projects": ["EGFR Inhibitors", "COVID-19 Targets"]
}
```

#### Update Metadata

```http
PATCH /api/analyses/{analysis_id}/metadata

Body:
{
  "tags": ["promising", "high-affinity"],
  "project": "EGFR Inhibitors Phase 2",
  "notes": "Top candidate from initial screen"
}

Response:
{
  "success": true,
  "message": "Metadata updated"
}
```

---

## Tips & Best Practices

### Tagging Strategy

1. **Be Consistent**: Use same tags across analyses
2. **Be Specific**: "high-affinity" better than "good"
3. **Use Hierarchy**: "phase-1", "phase-2", "phase-3"
4. **Document**: Keep a tag glossary for your team

### Project Naming

1. **Include Phase**: "EGFR Inhibitors Phase 1"
2. **Include Date**: "COVID-19 Targets Q1 2026"
3. **Be Descriptive**: "Natural Products Kinase Screen"

### Search Tips

1. **Start Broad**: Search project name first
2. **Then Narrow**: Add tags to filter
3. **Use Partial**: "silde" finds "sildenafil"

### Comparison Tips

1. **Compare Similar**: Same target, different ligands
2. **Track Time**: Compare chronologically
3. **Limit to 3**: More than 3 gets cluttered
4. **Focus on Overlap**: Most insights from shared ligands

### Export Tips

1. **CSV for Analysis**: Use in R, Python, Excel
2. **PDF for Sharing**: Send to collaborators
3. **Copy for Writing**: Quick paste into documents
4. **Excel for Stakeholders**: Non-technical audiences

---

## Keyboard Shortcuts

- **Ctrl/Cmd + F**: Focus search bar (browser default)
- **Enter**: Submit search
- **Esc**: Clear search/close modals
- **Ctrl/Cmd + P**: Print/PDF (browser default)

---

## Troubleshooting

### Tags Not Saving

- Check internet connection
- Refresh page and try again
- Check browser console for errors

### Search Not Working

- Clear filters and try again
- Check spelling
- Try partial search terms

### Comparison Not Loading

- Ensure analyses still exist
- Check that you selected 2-3 analyses
- Refresh and try again

### Export Not Downloading

- Check browser download settings
- Allow pop-ups for the site
- Try different browser

---

## Future Enhancements (Not Yet Implemented)

- **Batch Export**: Export multiple analyses at once
- **Advanced Filters**: Date ranges, affinity ranges
- **Saved Searches**: Save filter combinations
- **Shared Tags**: Team-wide tag library
- **Comparison Reports**: Auto-generate comparison PDFs
- **Trend Analysis**: Plot metrics over time

---

## Success Metrics

After implementing these features, you can:

✅ Find any analysis in < 5 seconds
✅ Compare experiments systematically
✅ Export data in any format needed
✅ Organize hundreds of analyses
✅ Track optimization progress
✅ Prepare publications faster
✅ Present to stakeholders professionally

---

**Ready to use?** Go to http://localhost:3001/history and start organizing your analyses!
