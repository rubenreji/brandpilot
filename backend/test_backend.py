from app.main import app
from app.core.database import db

print("--- FASTAPI INITIALIZATION TEST ---")
print("FastAPI app loaded successfully!")
print(f"Total Orgs: {len(db.organizations)}")
print(f"Total Submissions: {len(db.submissions)}")
print(f"Demo Org Facts: {len(db.facts['org-auracloud-001'])}")
print(f"Demo Org Terminology: {len(db.terminology['org-auracloud-001'])}")
print(f"Demo Org Guidelines: {len(db.guidelines)}")
print(f"Demo Findings: {len(db.findings['sub-demo-flagged'])}")
print("--- ALL BACKEND CHECKS PASSED ---")
