# BrandPilot — AI-Assisted Brand Governance and Content Intelligence Platform

> **"Your brand guidelines, enforced intelligently."**  
> BrandPilot brings your guidelines, approved facts, terminology rules, and brand voice into one intelligent workspace — helping content teams detect inconsistencies, apply source-backed corrections, and maintain control through human-controlled approval workflows before publication.

---

## 🏛️ Core Philosophy: Human-in-the-Loop Governance

BrandPilot strictly enforces an essential governance boundary:
- **AI assists and recommends; it never independently approves or publishes content.**
- Automated checks identify non-compliant claims, calculate compliance scores, and cite exact manual passages.
- Only authenticated human brand managers can issue release authorization and generate cryptographically stamped audit signatures.

---

## 🚀 Key Features & Modules

1. **Brand Knowledge Base (Single Source of Truth)**
   - **Ingested Policy Documents**: Ingests master PDFs/DOCXs with automatic chunking and vector indexing (`pgvector` HNSW index).
   - **Approved Corporate Facts**: CRUD management for verified company metrics, SLA bounds, and product specs.
   - **Terminology Manager**: Deterministic regex enforcement of prohibited terms (e.g. *"AI magic"*), preferred alternatives, and required naming conventions.
   - **Tone of Voice Profile**: Multi-axis dimensional sliders (Formality, Technicality, Confidence, Directness, Approved Perspective).
   - **Brand Asset Library**: Design tokens, color swatches with HEX validation, and graphic asset palette inspection.

2. **Content Auditing Workspace**
   - Ingests announcements, blogs, PR releases, and social copy.
   - Triple-layer audit pipeline:
     1. **Deterministic Linter**: Sub-5ms regex scan for prohibited terms, market superlatives, and absolute guarantees.
     2. **Semantic Vector RAG**: Pinpoints exact manual sections, pages, and supporting policy clauses.
     3. **Contextual LLM Evaluation**: Computes real-time compliance score (0–100%).
   - One-click sample scenario loaders:
     - **Flagged Scenario**: Triggers 5 simultaneous violations (*"India's No. 1"*, *"AI magic"*, *"guarantees 100% accuracy"*, *"cheapest solution"*, *"auracloud"*).
     - **Compliant Scenario**: Demonstrates a 100% verified enterprise release.

3. **Interactive Correction Studio (2-Column Interface)**
   - **Left Column**: Live draft editor with interactive span highlighting color-coded by severity (*Critical* in red, *High* in amber, *Medium* in blue).
   - **Right Column**: Source-backed finding cards displaying:
     - Policy name & severity badge.
     - Document, section, and page reference (e.g., *Page 22, Section 4.2*).
     - Exact quoted policy clause.
     - Suggested replacement pill.
     - **1-Click Apply**: Instantly updates highlighted text in the draft and recalculates the compliance score.
     - **Submit for Human Approval**: Routes the audited draft to designated reviewers.

4. **Human Approval Centre**
   - Review queue for authorized brand managers.
   - Review actions: **Approve with digital audit stamp**, **Request changes with comments**, or **Reject**.
   - Cryptographic audit stamp recording reviewer identity, role, timestamp, and verification hash.

5. **Revision History & Side-by-Side Diff**
   - Trace candidate draft revisions from initial ingestion to publication sign-off.
   - Side-by-side visual diff comparison.

6. **Governance Analytics & Friction Heatmap**
   - Compliance velocity tracking over time.
   - Most frequently violated guidelines breakdown.
   - AI-synthesized organizational policy recommendations.

7. **Role-Based Access Control (RBAC)**
   - Instant header persona switcher for live evaluation:
     - **Admin** (`Elena Rostova`) — Full workspace & guideline authority.
     - **Reviewer** (`Sarah Lin`) — Content reviewer & approval authority.
     - **Creator** (`Marcus Vance`) — Content author & audit runner.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Python 3.11+ FastAPI, Pydantic v2, RESTful architecture.
- **AI & Processing Engine**:
  - Deterministic Regex Linter (`linter.py`)
  - BM25 & Semantic Vector RAG Engine (`rag_engine.py`)
  - Contextual AI Auditor (`ai_auditor.py`)
  - Color Quantization & Visual Asset Inspector (`visual_inspector.py`)
- **Database & Auth**: PostgreSQL with `pgvector`, Row Level Security (RLS) policies (`supabase/migrations/001_initial_schema.sql`).

---

## 🏃 Quickstart Guide

### 1. Run the Python FastAPI Backend

```bash
cd brandpilot/backend

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies if not already installed
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```
Backend API will be available at `http://localhost:8000`.  
Swagger interactive documentation: `http://localhost:8000/docs`.

### 2. Run the Next.js Frontend

```bash
cd brandpilot/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Automated Test Verification

Verify backend deterministic linters and semantic audit engines:

```bash
cd brandpilot/backend
.venv\Scripts\python tests/test_linter.py
.venv\Scripts\python tests/test_audits.py
```
*Both test suites run completely offline and verify all 5 core violation patterns.*

---

## 📄 License & Attribution
BrandPilot Platform &copy; 2026. Built with architectural rigor for enterprise brand governance.
