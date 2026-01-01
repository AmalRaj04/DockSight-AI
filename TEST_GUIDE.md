# DockSight AI - Testing Guide

## Quick Status Check

### 1. Check Running Services

```bash
# Check backend
curl http://localhost:8000/api/health

# Check frontend
curl http://localhost:3000
```

### 2. Run All Backend Tests

```bash
# Test docking parser
python3 backend/tests/test_docking_parser.py

# Test ranking
python3 backend/tests/test_ranking.py

# Test interactions (structure validation)
python3 backend/tests/test_interactions.py

# Test report writer
python3 backend/tests/test_report_writer.py

# Test visualization
python3 backend/tests/test_visualization.py

# Test Solana attestation (dry-run)
python3 backend/tests/test_solana_attestation.py
```

---

## Component Testing

### Backend Components

#### 1. Docking Parser

```bash
python3 backend/tests/test_docking_parser.py
```

**What it tests**:

- Parsing AutoDock Vina log format
- Parsing PDBQT format
- Extracting binding affinities (ΔG)
- Extracting multiple poses
- Error handling

#### 2. Ligand Ranking

```bash
python3 backend/tests/test_ranking.py
```

**What it tests**:

- Ranking ligands by binding affinity
- Best pose selection (lowest ΔG)
- Deterministic sorting
- Empty data handling

#### 3. Interaction Analysis

```bash
python3 backend/tests/test_interactions.py
```

**What it tests**:

- Structure validation (functions not yet implemented)
- Expected output formats
- Distance calculation concepts

#### 4. Report Generation

```bash
python3 backend/tests/test_report_writer.py
```

**What it tests**:

- Report structure (sections)
- Markdown table generation
- Scientific disclaimer presence
- Executive summary

#### 5. Visualization

```bash
python3 backend/tests/test_visualization.py
```

**What it tests**:

- Filename generation (deterministic)
- Output directory creation
- Error handling
- Metadata structure

#### 6. Solana Attestation

```bash
python3 backend/tests/test_solana_attestation.py
```

**What it tests**:

- Hash determinism (SHA-256)
- Dry-run mode
- Analysis ID generation
- No real blockchain transactions

---

## API Testing

### 1. Health Check

```bash
curl http://localhost:8000/api/health
```

**Expected response**:

```json
{
  "status": "healthy",
  "groq_configured": true,
  "solana_configured": true
}
```

### 2. API Documentation

Open in browser: http://localhost:8000/docs

This shows the interactive Swagger UI where you can:

- See all endpoints
- Test the API directly
- View request/response schemas

### 3. Root Endpoint

```bash
curl http://localhost:8000/
```

**Expected response**:

```json
{
  "name": "DockSight AI",
  "version": "0.1.0",
  "status": "running"
}
```

---

## End-to-End Testing

### Option 1: Using Frontend (Recommended)

1. **Open frontend**: http://localhost:3000

2. **Create test files**:

```bash
# Create a mock Vina log file
cat > test_compound.log << 'EOF'
Scoring function : vina
Rigid receptor: receptor.pdbqt
Ligand: test_compound.pdbqt

mode |   affinity | dist from best mode
     | (kcal/mol) | rmsd l.b.| rmsd u.b.
-----+------------+----------+----------
   1        -8.5      0.000      0.000
   2        -7.9      1.234      2.456
   3        -7.2      2.345      3.567
EOF
```

3. **Upload the file** through the web interface

4. **View results** on the analyze page

### Option 2: Using cURL

```bash
# Upload test file
curl -X POST http://localhost:8000/api/analyze \
  -F "files=@test_compound.log" \
  | python3 -m json.tool
```

**Expected response structure**:

```json
{
  "status": "complete",
  "ranked_ligands": [...],
  "interactions": {},
  "visualizations": [],
  "report": "# Molecular Docking Analysis Report...",
  "attestation": {
    "transaction_signature": "dry_run_...",
    "analysis_id": "analysis_...",
    "input_hash": "...",
    "report_hash": "..."
  }
}
```

### Option 3: Using Python Script

Create `test_e2e.py`:

```python
import requests

# Upload file
with open('test_compound.log', 'rb') as f:
    files = {'files': f}
    response = requests.post('http://localhost:8000/api/analyze', files=files)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

Run:

```bash
pip3 install requests
python3 test_e2e.py
```

---

## What Each Component Does

### ✅ Working Components

1. **Docking Parser** - Extracts binding scores from files
2. **Ligand Ranker** - Sorts ligands by affinity
3. **Report Writer** - Generates Markdown reports (with Groq LLM)
4. **Solana Attestation** - Creates cryptographic hashes (dry-run)
5. **API Routes** - Handles file uploads and orchestration
6. **Frontend** - Upload interface and results display

### ⚠️ Placeholder Components (Structure Ready)

1. **Interaction Analyzer** - Needs molecular coordinate parsing
2. **Visualization Generator** - Needs PyMOL/RDKit integration

These components have:

- ✅ Correct function signatures
- ✅ Error handling
- ✅ Test coverage
- ⚠️ Placeholder implementations (return mock success)

---

## Troubleshooting

### Backend won't start

```bash
# Check if port 8000 is in use
lsof -i :8000

# Check Python version
python3 --version  # Should be 3.11+

# Reinstall dependencies
pip3 install -r backend/requirements.txt
```

### Frontend won't start

```bash
# Check if port 3000 is in use
lsof -i :3000

# Reinstall dependencies
cd frontend
npm install
npm run dev
```

### Groq API errors

```bash
# Check API key is set
echo $GROQ_API_KEY

# Or check .env file
cat .env | grep GROQ_API_KEY

# Test Groq directly
python3 -c "from groq import Groq; client = Groq(api_key='YOUR_KEY'); print('OK')"
```

### File upload fails

- Check file extensions (.pdbqt or .log only)
- Check file size (should be reasonable)
- Check backend logs for errors
- Verify CORS is enabled

---

## Expected Test Results

### All Tests Should Pass:

- ✅ Docking Parser: 5/5 tests
- ✅ Ranking: 7/7 tests
- ✅ Interactions: 7/7 tests (structure validation)
- ✅ Report Writer: 8/8 tests
- ✅ Visualization: 10/10 tests
- ✅ Solana Attestation: 9/9 tests

### Total: 46/46 tests passing

---

## Performance Benchmarks

Typical analysis times (with mock data):

- File parsing: < 100ms
- Ranking: < 10ms
- Report generation (with Groq): 2-5 seconds
- Visualization (placeholder): < 100ms
- Attestation (dry-run): < 50ms

**Total end-to-end**: ~3-6 seconds

---

## Next Steps After Testing

1. **If all tests pass**: System is ready for demo
2. **If Groq fails**: Check API key, system will use fallback
3. **If parsing fails**: Check file format matches AutoDock Vina
4. **If frontend fails**: Check CORS and API connectivity

---

## Quick Test Script

Save as `quick_test.sh`:

```bash
#!/bin/bash

echo "=== DockSight AI Quick Test ==="
echo ""

echo "1. Testing Backend Health..."
curl -s http://localhost:8000/api/health | python3 -m json.tool
echo ""

echo "2. Running Backend Tests..."
python3 backend/tests/test_docking_parser.py | grep "PASSED"
python3 backend/tests/test_ranking.py | grep "PASSED"
python3 backend/tests/test_report_writer.py | grep "PASSED"
echo ""

echo "3. Testing Frontend..."
curl -s http://localhost:3000 > /dev/null && echo "✓ Frontend accessible" || echo "✗ Frontend not accessible"
echo ""

echo "=== Test Complete ==="
```

Run:

```bash
chmod +x quick_test.sh
./quick_test.sh
```
