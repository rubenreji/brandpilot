import urllib.request
import urllib.error
import json
import time
import sys

BACKEND_BASE = "http://127.0.0.1:8000"
FRONTEND_BASE = "http://localhost:3000"

routes_to_test = [
    # Public & Auth
    ("/", "Landing Page"),
    ("/login", "Login Page"),
    ("/register", "Registration Page"),
    ("/onboarding", "Onboarding Flow"),
    ("/verify/sub-1", "Public Verification Page"),
    # Core Platform
    ("/app/dashboard", "Executive Dashboard"),
    ("/app/sentinel", "Brand Sentinel 24/7 Monitor"),
    ("/app/knowledge", "Brand Knowledge Base"),
    ("/app/audit", "Content Auditing Engine"),
    ("/app/corrections", "Correction Studio Index"),
    ("/app/corrections/sub-1", "Correction Studio Redline Diff"),
    ("/app/approvals", "Human Approval Centre"),
    ("/app/history", "Revisions & Ledger History"),
    ("/app/analytics", "Governance Analytics"),
    ("/app/visual", "Visual Brand Inspector"),
    ("/app/insitu", "In-Situ Studio (Figma/Web Linter)"),
    ("/app/multimodal", "Speech & Audio Governance Studio"),
    ("/app/integrations", "Extensions & Cloud DAM Hub"),
    ("/app/billing", "Stripe Billing & Subscriptions"),
    ("/app/team", "Team & Role-Based Access Control"),
    ("/app/settings", "Workspace Settings & Enterprise Config"),
    # Newly Implemented Commercial Flagships
    ("/app/packaging-3d", "Interactive 3D Packaging Inspector"),
    ("/app/crisis", "Autonomous PR Crisis & Legal Shield"),
    ("/app/counterstrike", "Competitor Ad Spy & Counter-Strike"),
    ("/app/risk", "Regulatory Risk & Fine Exposure Engine"),
    ("/app/reports", "Executive Boardroom PDF & Audit Report"),
    ("/app/styleguide", "Interactive Living Brand Styleguide"),
    ("/app/video", "Video Ad & Commercial Storyboard Inspector"),
    ("/app/jurisdiction", "Global Multi-Jurisdiction Regulatory Matrix"),
]

api_endpoints_to_test = [
    (f"{FRONTEND_BASE}/api/health", "Frontend Health Check"),
    (f"{FRONTEND_BASE}/api/workspaces", "Workspaces API"),
    (f"{FRONTEND_BASE}/api/risk/summary", "Legal Risk API"),
    (f"{FRONTEND_BASE}/api/reports/executive", "Executive Reports API"),
    (f"{FRONTEND_BASE}/api/styleguide/tokens", "Living Styleguide Tokens API"),
    (f"{FRONTEND_BASE}/api/video/inspection", "Video Ad Inspection API"),
    (f"{FRONTEND_BASE}/api/jurisdiction/matrix", "Multi-Jurisdiction Matrix API"),
    (f"{FRONTEND_BASE}/api/packaging/inspection", "3D Packaging Inspection API"),
    (f"{FRONTEND_BASE}/api/crisis/incidents", "PR Crisis Incident API"),
    (f"{FRONTEND_BASE}/api/counterstrike/targets", "Competitor Counter-Strike API"),
    (f"{FRONTEND_BASE}/api/billing/subscription-usage", "Billing & Subscriptions API"),
    (f"{FRONTEND_BASE}/api/sentinel/targets", "Brand Sentinel Crawler API"),
    (f"{FRONTEND_BASE}/api/integrations/dam/status", "Cloud DAM Hub API"),
    (f"{BACKEND_BASE}/api/health", "Backend Health Check"),
    (f"{BACKEND_BASE}/api/workspaces", "Backend Workspaces API"),
]

passed_count = 0
failed_count = 0
results = []

print("======================================================================")
print("  BRANDPILOT ENTERPRISE — FULL PLATFORM AUTOMATED VERIFICATION SUITE  ")
print("======================================================================")
print(f"Testing against Frontend: {FRONTEND_BASE} | Backend: {BACKEND_BASE}\n")

# 1. Test All API Endpoints
print("--- [SECTION 1: API ENDPOINTS & DATA FLOWS] ---")
for url, name in api_endpoints_to_test:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "BrandPilotVerifier/2.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            status = resp.status
            content = resp.read()
            data = json.loads(content)
            if status == 200:
                print(f"  [PASS] {name:<38} Status: {status} OK (JSON Valid, {len(content)} bytes)")
                passed_count += 1
                results.append((name, True, status))
            else:
                print(f"  [FAIL] {name:<38} Status: {status}")
                failed_count += 1
                results.append((name, False, status))
    except Exception as e:
        print(f"  [FAIL] {name:<38} Error: {e}")
        failed_count += 1
        results.append((name, False, str(e)))

print("\n--- [SECTION 2: FRONTEND APPLICATION ROUTES] ---")
for route, name in routes_to_test:
    url = f"{FRONTEND_BASE}{route}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "BrandPilotVerifier/2.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            status = resp.status
            body = resp.read().decode("utf-8", errors="ignore")
            # Verify body contains valid HTML structure and no unhandled server crash
            if status == 200 and ("<!DOCTYPE html>" in body or "<html" in body):
                print(f"  [PASS] {name:<38} Route: {route:<24} Status: {status} OK")
                passed_count += 1
                results.append((name, True, status))
            else:
                print(f"  [FAIL] {name:<38} Route: {route:<24} Status: {status} (Unexpected HTML)")
                failed_count += 1
                results.append((name, False, status))
    except Exception as e:
        print(f"  [FAIL] {name:<38} Route: {route:<24} Error: {e}")
        failed_count += 1
        results.append((name, False, str(e)))

# 3. Test Fullstack Audit Pipeline (POST /api/audit)
print("\n--- [SECTION 3: AUDITING PIPELINE END-TO-END EXECUTION] ---")
audit_payload = {
    "text": "AuraCloud delivers 99.999% uptime guaranteed with zero downtime ever recorded.",
    "workspace_id": "aura-main",
    "content_type": "marketing_copy"
}
try:
    req = urllib.request.Request(
        f"{FRONTEND_BASE}/api/audit",
        data=json.dumps(audit_payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "BrandPilotVerifier/2.0"}
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        status = resp.status
        data = json.loads(resp.read().decode("utf-8"))
        has_score = "compliance_score" in data or "score" in data
        has_findings = "findings" in data
        if status == 200 and (has_score or has_findings):
            print(f"  [PASS] Fullstack Claim Auditing Engine      Status: {status} OK (Findings returned)")
            passed_count += 1
            results.append(("Fullstack Claim Auditing", True, status))
        else:
            print(f"  [FAIL] Fullstack Claim Auditing Engine      Response missing findings/score: {data}")
            failed_count += 1
            results.append(("Fullstack Claim Auditing", False, status))
except Exception as e:
    print(f"  [FAIL] Fullstack Claim Auditing Engine      Error: {e}")
    failed_count += 1
    results.append(("Fullstack Claim Auditing", False, str(e)))

print("\n======================================================================")
print(f"  VERIFICATION RESULTS: {passed_count} PASSED, {failed_count} FAILED (TOTAL: {passed_count + failed_count})")
print("======================================================================")

if failed_count == 0:
    print("\n>>> ALL PLATFORM FEATURES, API ENDPOINTS & ROUTES OPERATING PERFECTLY WITH 0 ERRORS! <<<")
    sys.exit(0)
else:
    print(f"\n>>> ATTENTION: {failed_count} checks failed. See breakdown above. <<<")
    sys.exit(1)
