import { NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  ALL_WORKSPACES,
  INITIAL_GUIDELINES,
  INITIAL_FACTS,
  INITIAL_TERMINOLOGY,
  INITIAL_TONE,
  INITIAL_ASSETS,
  INITIAL_SUBMISSIONS,
  INITIAL_FINDINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVISIONS,
  INITIAL_APPROVAL_RECORDS
} from '@/lib/demo_data';

// In-memory serverless state fallback for persistent live testing on Vercel
let submissionsState: any[] = [...INITIAL_SUBMISSIONS];
let findingsState: Record<string, any[]> = { ...INITIAL_FINDINGS };
let factsState: any[] = [...INITIAL_FACTS];
let terminologyState: any[] = [...INITIAL_TERMINOLOGY];
let notificationsState: any[] = [...INITIAL_NOTIFICATIONS];

// Optional remote proxy helper if dedicated backend URL is configured
async function proxyToBackend(request: Request, pathStr: string): Promise<Response | null> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) return null;

  try {
    const url = new URL(request.url);
    const targetUrl = `${backendUrl.replace(/\/$/, '')}/api/${pathStr}${url.search}`;
    const headers = new Headers(request.headers);
    headers.delete('host');

    const init: RequestInit = {
      method: request.method,
      headers
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = await request.arrayBuffer();
    }

    const res = await fetch(targetUrl, init);
    const data = await res.arrayBuffer();
    return new Response(data, {
      status: res.status,
      headers: res.headers
    });
  } catch {
    return null;
  }
}

// =========================================================================
// GET HANDLER
// =========================================================================
export async function GET(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path } = await props.params;
  const pathStr = path.join('/');

  // Attempt backend proxy first if BACKEND_URL environment variable is set
  const proxied = await proxyToBackend(request, pathStr);
  if (proxied) return proxied;

  // 1. Workspaces
  if (pathStr === 'workspaces') {
    return NextResponse.json(ALL_WORKSPACES);
  }

  if (path[0] === 'workspaces' && path.length === 2) {
    const ws = ALL_WORKSPACES.find(w => w.id === path[1]) || ALL_WORKSPACES[0];
    return NextResponse.json(ws);
  }

  if (path[0] === 'workspaces' && path[2] === 'overview') {
    return NextResponse.json({
      workspace_id: path[1],
      brand_name: 'AuraCloud',
      active_guidelines_count: INITIAL_GUIDELINES.length,
      approved_facts_count: factsState.length,
      terminology_rules_count: terminologyState.length,
      total_submissions_count: submissionsState.length,
      average_compliance_score: 94,
      pending_reviews_count: submissionsState.filter(s => s.status === 'pending_review' || s.status === 'in_review').length
    });
  }

  if (path[0] === 'workspaces' && path[2] === 'guidelines') {
    return NextResponse.json(INITIAL_GUIDELINES);
  }

  if (path[0] === 'workspaces' && path[2] === 'facts') {
    return NextResponse.json(factsState);
  }

  if (path[0] === 'workspaces' && path[2] === 'terminology') {
    return NextResponse.json(terminologyState);
  }

  if (path[0] === 'workspaces' && path[2] === 'tone') {
    return NextResponse.json(INITIAL_TONE);
  }

  if (path[0] === 'workspaces' && path[2] === 'assets') {
    return NextResponse.json(INITIAL_ASSETS);
  }

  // 2. Content & Audits
  if (pathStr === 'content') {
    return NextResponse.json(submissionsState);
  }

  if (path[0] === 'content' && path.length === 2) {
    const sub = submissionsState.find(s => s.id === path[1]);
    if (!sub) return NextResponse.json({ detail: 'Submission not found' }, { status: 404 });
    return NextResponse.json(sub);
  }

  if (path[0] === 'audits' && path[2] === 'findings') {
    const findings = findingsState[path[1]] || [];
    return NextResponse.json(findings);
  }

  if (path[0] === 'revisions' && path.length === 2) {
    const revs = INITIAL_REVISIONS[path[1]] || [];
    return NextResponse.json(revs);
  }

  if (path[0] === 'history' && path.length === 2) {
    const hist = INITIAL_APPROVAL_RECORDS.filter(r => r.submission_id === path[1]);
    return NextResponse.json(hist);
  }

  // 3. Notifications
  if (pathStr === 'notifications') {
    return NextResponse.json(notificationsState);
  }

  // 4. Public Verification
  if (path[0] === 'verify' && path.length === 2) {
    const subId = path[1];
    const sub = submissionsState.find(s => s.id === subId) || submissionsState[0];
    const digest = crypto.createHash('sha256').update(sub?.original_text || subId).digest('hex');
    return NextResponse.json({
      is_verified: true,
      status: 'VERIFIED_ACTIVE',
      submission_id: subId,
      title: sub?.title || 'Enterprise Communication Document',
      content_text: sub?.current_text || sub?.original_text || '',
      compliance_score: sub?.compliance_score || 100,
      reviewer_name: 'Elena Rostova',
      reviewer_role: 'Lead Brand Director',
      approval_timestamp: new Date().toISOString(),
      cryptographic_stamp: `SHA256:${digest.slice(0, 32)}`,
      sha256_document_digest: `SHA256:${digest}`,
      active_guideline_version: 'v3.2.0-enterprise',
      tamper_proof_seal: `SEAL:${digest.slice(0, 16)}`,
      organization_name: 'AuraCloud Technologies Inc.'
    });
  }

  // 5. System Status
  if (pathStr === 'system/enterprise-status') {
    return NextResponse.json({
      status: 'operational',
      environment: 'production-vercel-serverless',
      version: '2.4.0-enterprise',
      region: process.env.VERCEL_REGION || 'iad1 (US East)',
      zero_data_retention: true,
      telemetry: {
        latency_p50_ms: 8.2,
        latency_p99_ms: 14.6,
        uptime_30d: '99.99%',
        active_gatekeepers: 14
      },
      certifications: ['SOC2-Type-II', 'ISO-27001', 'GDPR', 'HIPAA-Ready'],
      tamper_proof_ledger: 'active'
    });
  }

  // 6. Developer APIs
  if (pathStr === 'developer/api-keys') {
    return NextResponse.json([
      {
        id: 'key-1',
        name: 'Production CI/CD Automation',
        prefix: 'bp_live_8f3a',
        full_key: 'bp_live_8f3a9e1b2c4d5e6f7a8b9c0d1e2f3a4b',
        scopes: ['audit:read', 'audit:write', 'insitu:lint'],
        created_at: '2026-10-15T08:30:00Z',
        last_used_at: '2026-11-22T12:45:00Z',
        is_active: true
      },
      {
        id: 'key-2',
        name: 'Figma Brand Extension',
        prefix: 'bp_live_12c9',
        full_key: 'bp_live_12c9b4e7a8f1023d9c8e7a6b5c4d3e2f',
        scopes: ['insitu:lint', 'visual:inspect'],
        created_at: '2026-11-01T14:15:00Z',
        last_used_at: '2026-11-22T13:20:00Z',
        is_active: true
      }
    ]);
  }

  if (pathStr === 'billing/subscription-usage') {
    return NextResponse.json({
      plan_tier: 'Enterprise Dedicated',
      billing_cycle: 'monthly',
      seats_quota: 25,
      seats_used: 12,
      usage_meters: {
        monthly_audits: { used: 342, quota: 1000, percentage: 34.2 },
        insitu_api_calls: { used: 48920, quota: 100000, percentage: 48.9 },
        brand_guidelines: { used: 6, quota: 'Unlimited' },
        custom_domains: { used: 2, quota: 5 }
      },
      payment_method: {
        brand: 'Visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2028
      },
      billing_contact: {
        name: 'Elena Rostova',
        email: 'finance@auracloud.io',
        tax_id: 'US-EIN-94819201'
      },
      invoices: [
        {
          id: 'inv-2026-11',
          date: 'Nov 1, 2026',
          amount: '$1,450.00',
          status: 'paid',
          pdf_url: '#'
        },
        {
          id: 'inv-2026-10',
          date: 'Oct 1, 2026',
          amount: '$1,450.00',
          status: 'paid',
          pdf_url: '#'
        }
      ]
    });
  }

  // 6b. Brand Sentinel Public Crawler API
  if (pathStr === 'sentinel/targets') {
    return NextResponse.json({
      status: 'active',
      targets_count: 4,
      total_active_drift: 3,
      health_score: 88,
      last_scheduled_crawl: new Date().toISOString()
    });
  }

  // 6c. Enterprise DAM & Cloud Connectors API
  if (pathStr === 'integrations/dam/status') {
    return NextResponse.json({
      status: 'connected',
      repositories_synced: 5,
      total_assets_indexed: 109,
      last_sync_timestamp: new Date().toISOString()
    });
  }

  // 6d. Legal Risk & Statutory Exposure API
  if (pathStr === 'risk/summary') {
    return NextResponse.json({
      projected_max_exposure: 410464,
      baseline_statutory_floor: 51744,
      active_violations_count: 4,
      frameworks: ['FTC Act Section 5', 'EU Green Claims COM/2023/166', 'SEC Reg FD', 'GDPR Art. 28'],
      safe_harbor_remediation_rate: 100
    });
  }

  // 6e. Executive PDF & Boardroom Ledger API
  if (pathStr === 'reports/executive') {
    return NextResponse.json({
      overall_compliance_score: 94,
      industry_peer_percentile: 'Top 3%',
      tamper_proof_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      certified_date: new Date().toISOString()
    });
  }

  // 6f. Living Styleguide Tokens API
  if (pathStr === 'styleguide/tokens') {
    return NextResponse.json({
      brand: 'AuraCloud',
      primary_color: '#00FF87',
      secondary_color: '#10B981',
      canvas_background: '#050806',
      surface_card: '#0A110D',
      typography: {
        font_family: 'Inter, -apple-system, sans-serif',
        scale: ['Display 48px', 'H1 32px', 'H2 24px', 'Body 15px', 'Mono 13px']
      }
    });
  }

  // 6g. Video Ad & Commercial Frame Inspection API
  if (pathStr === 'video/inspection') {
    return NextResponse.json({
      total_frames_analyzed: 30,
      disclaimer_dwell_compliance: 'flagged_short_dwell',
      audio_visual_alignment: 'discrepancy_detected',
      clearance_score: 82
    });
  }

  // 6h. Multi-Territory Regulatory Matrix API
  if (pathStr === 'jurisdiction/matrix') {
    return NextResponse.json({
      cleared_territories: ['United States', 'United Kingdom', 'Australia', 'Japan'],
      action_required_territories: ['European Union'],
      active_frameworks_count: 5
    });
  }

  // 6i. 3D Physical Packaging & Spatial Inspection API
  if (pathStr === 'packaging/inspection') {
    return NextResponse.json({
      active_preset: 'Enterprise Cloud Appliance',
      dimensions: '280 x 210 x 65 mm',
      surface_material: 'matte',
      pantone_accuracy: '99.4%',
      barcode_gs1_compliance: 'quiet_zone_warning',
      overall_dfm_score: 88
    });
  }

  // 6j. Autonomous PR Crisis & Cease-and-Desist API
  if (pathStr === 'crisis/incidents') {
    return NextResponse.json({
      active_crises_count: 2,
      critical_viral_breaches: 1,
      containment_status: 'escalated',
      automated_cease_and_desist_ready: true,
      last_dispatch_timestamp: new Date().toISOString()
    });
  }

  // 6k. Competitor Counter-Strike & Ad Spy Intelligence API
  if (pathStr === 'counterstrike/targets') {
    return NextResponse.json({
      monitored_competitors: ['Legacy Cloud Corp', 'HyperScale X', 'DataVantage Systems'],
      unsubstantiated_claims_detected: 3,
      highest_vulnerability_score: 92,
      counter_campaigns_generated: 3
    });
  }

  // 7. Visual Presets
  if (pathStr === 'visual/presets') {
    return NextResponse.json([
      {
        id: 'preset-aura-compliant',
        title: 'AuraCloud Q4 Platform Launch Banner',
        description: 'Enterprise cloud marketing banner adhering strictly to approved colors, pristine logo clear-space, verified claims, and WCAG AAA contrast.',
        type: 'banner',
        expected_score: 98,
        status: 'compliant'
      },
      {
        id: 'preset-ad-superlatives-red',
        title: 'Social Ad with Off-Brand Red & Prohibited Claims',
        description: "Promotional creative containing unapproved red (#DC2626), superlatives ('cheapest cloud', 'guaranteed 100% uptime', 'AI magic'), and low-contrast copy.",
        type: 'social_ad',
        expected_score: 46,
        status: 'non_compliant'
      },
      {
        id: 'preset-logo-distortion-encroachment',
        title: 'Event Display with Distorted Logo & Margin Encroachment',
        description: 'Event collateral with non-uniformly stretched logo (28% aspect distortion), text encroaching inside the 0.5H exclusion zone, and failing footer contrast.',
        type: 'display_ad',
        expected_score: 54,
        status: 'non_compliant'
      }
    ]);
  }

  return NextResponse.json({ status: 'ok', path: pathStr, serverless: true });
}

// =========================================================================
// POST HANDLER
// =========================================================================
export async function POST(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path } = await props.params;
  const pathStr = path.join('/');

  // Attempt backend proxy first if BACKEND_URL environment variable is set
  const proxied = await proxyToBackend(request, pathStr);
  if (proxied) return proxied;

  let body: any = {};
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      body = await request.json();
    } catch {}
  }

  // 1. Content Submission & Real-Time Audit
  if (pathStr === 'content') {
    const text = body.draft_text || body.original_text || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const subId = `sub-${Date.now()}`;

    // Deterministic rules check
    const findings: any[] = [];
    if (/India'?s\s+No\.?\s*1/i.test(text)) {
      findings.push({
        id: `f-${Date.now()}-1`,
        submission_id: subId,
        category: 'unsupported_claim',
        severity: 'high',
        original_text: "India's No. 1",
        explanation: 'Unsupported market ranking claim without third-party audit citations.',
        relevant_brand_rule: 'Factual Claims Policy 4.2',
        suggested_correction: 'a leading enterprise cloud platform',
        confidence: 0.98,
        status: 'pending'
      });
    }
    if (/AI\s*magic/i.test(text)) {
      findings.push({
        id: `f-${Date.now()}-2`,
        submission_id: subId,
        category: 'terminology',
        severity: 'high',
        original_text: 'AI magic',
        explanation: "Prohibited colloquial terminology. Violates corporate nomenclature rules.",
        relevant_brand_rule: 'Terminology Standard 3.4',
        suggested_correction: 'intelligent automated orchestration',
        confidence: 0.99,
        status: 'pending'
      });
    }
    if (/100%\s+uptime/i.test(text)) {
      findings.push({
        id: `f-${Date.now()}-3`,
        submission_id: subId,
        category: 'outdated_fact',
        severity: 'critical',
        original_text: '100% uptime',
        explanation: "Contradicts approved SLA bound. Verified corporate commitment is 99.95% uptime.",
        relevant_brand_rule: 'SLA Standard Sec 2.1',
        suggested_correction: '99.95% monthly uptime SLA',
        confidence: 0.99,
        status: 'pending'
      });
    }
    if (/cheapest/i.test(text)) {
      findings.push({
        id: `f-${Date.now()}-4`,
        submission_id: subId,
        category: 'unsupported_claim',
        severity: 'critical',
        original_text: 'cheapest',
        explanation: "Unsubstantiated comparative pricing superlative.",
        relevant_brand_rule: 'Comparative Claims Rule 4.2',
        suggested_correction: 'cost-effective enterprise solution',
        confidence: 0.97,
        status: 'pending'
      });
    }

    const criticals = findings.filter(f => f.severity === 'critical').length;
    const highs = findings.filter(f => f.severity === 'high').length;
    const score = Math.max(0, 100 - (criticals * 25 + highs * 15));

    const newSub = {
      id: subId,
      organization_id: body.org_id || 'org-auracloud-001',
      title: body.title || 'Untitled Draft',
      content_type: body.content_type || 'press_release',
      target_platform: body.target_platform || 'web',
      associated_product: body.associated_product || 'AuraCloud',
      campaign_name: body.campaign_name || 'Enterprise Communications',
      original_text: text,
      current_text: text,
      status: 'audited',
      word_count: words,
      character_count: text.length,
      compliance_score: score,
      findings_count: findings.length,
      critical_count: criticals,
      creator_id: 'user-creator-1',
      creator_name: 'Marcus Vance',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    submissionsState.unshift(newSub);
    findingsState[subId] = findings;
    return NextResponse.json(newSub);
  }

  // 2. Apply Suggestion
  if (path[0] === 'suggestions' && path[2] === 'apply') {
    const findingId = path[1];
    let updatedFinding: any = null;
    let targetSubId = '';

    for (const [subId, findings] of Object.entries(findingsState)) {
      const idx = findings.findIndex(f => f.id === findingId);
      if (idx !== -1) {
        findings[idx].status = 'accepted';
        updatedFinding = findings[idx];
        targetSubId = subId;
        break;
      }
    }

    const sub = submissionsState.find(s => s.id === targetSubId);
    if (sub) {
      sub.compliance_score = Math.min(100, (sub.compliance_score || 70) + 15);
    }

    return NextResponse.json({
      status: 'applied',
      finding: updatedFinding,
      submission: sub,
      claim_verification_summary: {
        total_claims_analyzed: 4,
        supported_count: 4,
        contradicted_count: 0,
        unverified_count: 0,
        integrity_score: 100,
        claims: []
      }
    });
  }

  // 3. Review / Approvals
  if (path[0] === 'approvals' && path[2] === 'review') {
    const subId = path[1];
    const sub = submissionsState.find(s => s.id === subId) || submissionsState[0];
    const action = body.action || 'approve';
    const digest = crypto.createHash('sha256').update(sub?.current_text || subId).digest('hex');

    if (action === 'approve') {
      sub.status = 'approved';
      const record = {
        id: `appr-${Date.now()}`,
        submission_id: subId,
        reviewer_name: body.reviewer_name || 'Elena Rostova',
        action: 'approve',
        timestamp: new Date().toISOString(),
        cryptographic_stamp: `SHA256:${digest.slice(0, 32)}`
      };
      return NextResponse.json({
        status: 'approved',
        cryptographic_stamp: record.cryptographic_stamp,
        approval_record: record
      });
    }

    sub.status = action === 'reject' ? 'rejected' : 'changes_requested';
    return NextResponse.json({ status: sub.status });
  }

  // 4. In-Situ Linter API (sub-10ms)
  if (pathStr === 'insitu/lint') {
    const text = body.text || '';
    const violations: any[] = [];
    if (/AI\s*magic/i.test(text)) {
      violations.push({
        term: 'AI magic',
        type: 'prohibited',
        replacement: 'intelligent automated orchestration',
        explanation: 'Colloquial terminology prohibited under Nomenclature Policy 3.4.'
      });
    }
    if (/100%\s+uptime/i.test(text)) {
      violations.push({
        term: '100% uptime',
        type: 'unsupported_claim',
        replacement: '99.95% monthly uptime SLA',
        explanation: 'Contradicts verified corporate SLA bound.'
      });
    }

    return NextResponse.json({
      status: 'analyzed',
      execution_latency_ms: 2.4,
      is_compliant: violations.length === 0,
      violations_count: violations.length,
      violations,
      wcag_check: {
        normal_text_contrast: '14.2:1',
        wcag_aa_pass: true,
        wcag_aaa_pass: true
      }
    });
  }

  // 5. Autonomous Knowledge Extraction
  if (pathStr === 'knowledge/auto-extract') {
    const sourceTitle = body.source_title || 'AuraCloud Enterprise Brand Guide v3.0';
    return NextResponse.json({
      status: 'extracted_and_indexed',
      source_title: sourceTitle,
      extracted_rules_count: 4,
      extracted_facts_count: 3,
      rules: [
        { term: 'AI magic', rule_type: 'prohibited', suggested_replacement: 'intelligent automated orchestration', explanation: 'Vague marketing jargon.' },
        { term: 'cheapest', rule_type: 'prohibited', suggested_replacement: 'cost-effective enterprise solution', explanation: 'Price superlatives prohibited.' },
        { term: 'auracloud', rule_type: 'preferred', suggested_replacement: 'AuraCloud', explanation: 'Brand name must appear in camel-case.' },
        { term: 'No. 1', rule_type: 'prohibited', suggested_replacement: 'industry-recognized', explanation: 'Unsubstantiated market leadership claim.' }
      ],
      facts: [
        { title: 'Enterprise Uptime SLA Bound', category: 'reliability', claim_text: 'AuraCloud guarantees 99.95% monthly uptime backed by financial SLA credit commitments.', source: 'MSA Section 4.1' },
        { title: 'Zero Data Retention Cloud Architecture', category: 'security', claim_text: 'Zero Customer Data is retained across stateless automated audit workers.', source: 'Security Architecture Spec v2.1' },
        { title: 'Cryptographic Document Digests', category: 'compliance', claim_text: 'All approved assets receive SHA-256 cryptographic verification stamps.', source: 'Governance Charter 1.0' }
      ]
    });
  }

  // 6. CMS Publishing Gateway
  if (pathStr === 'gateway/publish') {
    const platform = body.destination_platform || 'webflow';
    const stamp = body.clearance_stamp || 'SHA256:6ca4f7b1155648e187be194fbe24d079';
    const hmac = crypto.createHmac('sha256', 'cms_sec_live_9f8a').update(`${platform}:${stamp}`).digest('hex');
    return NextResponse.json({
      status: 'published',
      destination_platform: platform,
      clearance_stamp: stamp,
      cms_transaction_id: `cms_tx_${Date.now()}`,
      dispatch_timestamp: new Date().toISOString(),
      hmac_signature: `HMAC-SHA256:${hmac.slice(0, 32)}`
    });
  }

  // 7. Multimodal Speech Auditing
  if (pathStr === 'multimodal/speech-audit') {
    return NextResponse.json({
      status: 'analyzed',
      media_title: body.title || 'Executive Keynote Video',
      audited_duration: '04:12 mins',
      total_spoken_claims: 8,
      violations_detected: 2,
      compliance_health: 'Passed with Advisory Edits',
      findings: [
        {
          timestamp: '00:45',
          spoken_claim: 'We are the cheapest multi-cloud orchestration engine on earth.',
          statutory_risk: 'FTC Unfair Competition & False Advertising Doctrine (15 U.S.C. § 45)',
          teleprompter_auto_patch: 'We deliver superior cost-efficiency for multi-cloud enterprise infrastructure.'
        },
        {
          timestamp: '02:18',
          spoken_claim: 'Our proprietary neural core guarantees 100% continuous uptime.',
          statutory_risk: 'UK ASA Misleading Advertising Regulation & EU AI Act Transparency',
          teleprompter_auto_patch: 'Our architecture provides industry-leading 99.95% monthly uptime backed by SLA credits.'
        }
      ]
    });
  }

  // 8. Slack & Teams Webhook Alerts
  if (pathStr === 'webhooks/slack-alert') {
    return NextResponse.json({
      status: 'dispatched',
      channel: body.channel || '#brand-governance-alerts',
      delivery_latency_ms: 12.4,
      payload_format: 'Slack Block Kit v2',
      alert_id: `slack_alert_${Date.now()}`
    });
  }

  // 9. Competitor Vulnerability Intelligence
  if (pathStr === 'intelligence/competitor-scan') {
    return NextResponse.json({
      status: 'completed',
      competitor_name: body.competitor_name || 'Rival Cloud Platform',
      target_jurisdiction: body.target_jurisdiction || 'us_ftc',
      vulnerabilities_count: 2,
      vulnerabilities: [
        {
          id: 'vuln-1',
          claim_text: 'Unbounded multi-cloud throughput with zero packet latency',
          vulnerability_category: 'False Latency Assertion',
          regulatory_exposure: 'US FTC Act § 5 Unsubstantiated Tech Claims',
          recommended_counter_rebuttal: 'AuraCloud publishes transparent, audited P99 latency percentiles (1.8ms median) verified by independent benchmarks.'
        },
        {
          id: 'vuln-2',
          claim_text: 'Complete 100% guarantee against enterprise data breaches',
          vulnerability_category: 'Absolute Defense Guarantee',
          regulatory_exposure: 'SEC Material Cybersecurity Disclosures & FTC False Security Claims',
          recommended_counter_rebuttal: 'AuraCloud relies on defense-in-depth zero-trust boundary isolation rather than unrealistic single-point guarantees.'
        }
      ]
    });
  }

  // 10. Developer Webhooks Test Ping
  if (pathStr === 'developer/webhooks/test-ping') {
    const url = body.target_url || 'https://hooks.auracloud.io/brandpilot/events';
    const secret = body.secret_key || 'whsec_live_9b42e718c30f4a9b';
    const payload = JSON.stringify({ event: body.event_type || 'audit.flagged', timestamp: Date.now() });
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return NextResponse.json({
      status: 'delivered',
      target_url: url,
      http_status_code: 200,
      delivery_latency_ms: 12.5,
      signature: `HMAC-SHA256:${sig}`
    });
  }

  // 11. Developer API Key Generate
  if (pathStr === 'developer/api-keys/generate') {
    const prefix = `bp_live_${crypto.randomBytes(4).toString('hex')}`;
    const fullKey = `${prefix}_${crypto.randomBytes(16).toString('hex')}`;
    return NextResponse.json({
      status: 'created',
      key: {
        id: `key-${Date.now()}`,
        name: body.key_name || 'Production CI/CD Automation',
        prefix,
        full_key: fullKey,
        scopes: body.scopes || ['audit:read', 'audit:write', 'insitu:lint'],
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      }
    });
  }

  // 12. Visual Presets Inspection
  if (pathStr === 'visual/presets/inspect') {
    const presetId = body.preset_id || 'preset-aura-compliant';

    if (presetId === 'preset-aura-compliant') {
      return NextResponse.json({
        status: 'success',
        asset_dimensions: '1200x630 px (Landscape Banner)',
        score: {
          color_palette_score: 100,
          logo_integrity_score: 100,
          embedded_copy_score: 100,
          wcag_contrast_score: 100,
          composite_score: 98,
          compliance_grade: 'Compliant (Approved for Publishing)'
        },
        findings: [],
        dominant_colors: [
          { hex: '#050806', percentage: 52.0, is_compliant: true, nearest_token: '#050806', distance: 0, role: 'Approved Brand Token (Obsidian Pitch)', bounding_box: { x: 0, y: 0, width: 1200, height: 630, x_pct: 0, y_pct: 0, w_pct: 100, h_pct: 100 } },
          { hex: '#10B981', percentage: 28.0, is_compliant: true, nearest_token: '#10B981', distance: 0, role: 'Approved Brand Token (Electric Emerald)', bounding_box: { x: 60, y: 280, width: 420, height: 60, x_pct: 5, y_pct: 44.4, w_pct: 35, h_pct: 9.5 } },
          { hex: '#0A120E', percentage: 14.0, is_compliant: true, nearest_token: '#0A120E', distance: 0, role: 'Approved Brand Token (Elevated Surface)', bounding_box: { x: 60, y: 60, width: 1080, height: 510, x_pct: 5, y_pct: 9.5, w_pct: 90, h_pct: 81 } },
          { hex: '#00FF87', percentage: 6.0, is_compliant: true, nearest_token: '#00FF87', distance: 0, role: 'Approved Brand Token (Neon Green)', bounding_box: { x: 60, y: 480, width: 200, height: 45, x_pct: 5, y_pct: 76.2, w_pct: 16.7, h_pct: 7.1 } }
        ],
        logo_inspection: {
          detected: true,
          confidence: 0.99,
          aspect_ratio: 1.0,
          expected_aspect_ratio: 1.0,
          aspect_distortion_pct: 0.0,
          is_distorted: false,
          clear_space_passed: true,
          clear_space_margin_ratio: 0.68,
          required_margin_ratio: 0.50,
          bounding_box: { x: 60, y: 60, width: 96, height: 96, x_pct: 5.0, y_pct: 9.5, w_pct: 8.0, h_pct: 15.2 },
          exclusion_zone_box: { x: 12, y: 12, width: 192, height: 192, x_pct: 1.0, y_pct: 1.9, w_pct: 16.0, h_pct: 30.5 }
        },
        wcag_contrast_checks: [
          { zone_name: 'Headline Display Typography', foreground_hex: '#FFFFFF', background_hex: '#050806', contrast_ratio: 18.2, wcag_aa_pass: true, wcag_aaa_pass: true, is_large_text: true, bounding_box: { x: 60, y: 200, width: 900, height: 120, x_pct: 5.0, y_pct: 31.7, w_pct: 75.0, h_pct: 19.0 } },
          { zone_name: 'Primary CTA Button', foreground_hex: '#050806', background_hex: '#10B981', contrast_ratio: 8.4, wcag_aa_pass: true, wcag_aaa_pass: true, is_large_text: false, bounding_box: { x: 60, y: 380, width: 240, height: 55, x_pct: 5.0, y_pct: 60.3, w_pct: 20.0, h_pct: 8.7 } }
        ],
        ocr_extracted_copy: [
          { extracted_text: 'AuraCloud Enterprise Governance | Continuous compliance and verifiable multi-cloud orchestration', line_number: 1, bounding_box: { x: 60, y: 200, width: 900, height: 120, x_pct: 5.0, y_pct: 31.7, w_pct: 75.0, h_pct: 19.0 }, violations_count: 0, findings: [] }
        ],
        limitations_note: 'Visual design fully satisfies AuraCloud corporate brand guidelines.'
      });
    }

    if (presetId === 'preset-ad-superlatives-red') {
      return NextResponse.json({
        status: 'success',
        asset_dimensions: '1080x1080 px (Square Social Ad)',
        score: {
          color_palette_score: 40,
          logo_integrity_score: 100,
          embedded_copy_score: 10,
          wcag_contrast_score: 50,
          composite_score: 46,
          compliance_grade: 'Non-Compliant (Publishing Blocked)'
        },
        findings: [
          { id: 'vf-1', category: 'color_divergence', severity: 'high', title: 'Off-Palette Color Detected: #DC2626 (24% canvas coverage)', description: 'Off-brand red #DC2626 diverges by Delta-E 142.8 from corporate tokens.', detected_value: '#DC2626', recommended_value: '#10B981', bounding_box: { x: 0, y: 720, width: 1080, height: 360, x_pct: 0.0, y_pct: 66.7, w_pct: 100.0, h_pct: 33.3 }, remediation_action: 'Replace #DC2626 with approved primary accent Electric Emerald (#10B981).' },
          { id: 'vf-2', category: 'embedded_text_violation', severity: 'critical', title: "Prohibited Embedded Text: 'cheapest'", description: "Superlative 'cheapest' cheapens enterprise market positioning.", detected_value: 'cheapest', recommended_value: 'cost-effective enterprise solution', bounding_box: { x: 90, y: 380, width: 880, height: 90, x_pct: 8.3, y_pct: 35.2, w_pct: 81.5, h_pct: 8.3 }, remediation_action: "Change typography from 'cheapest cloud' to 'cost-effective enterprise solution'." },
          { id: 'vf-3', category: 'embedded_text_violation', severity: 'critical', title: "Prohibited Superlative Claim: 'guaranteed 100% uptime'", description: 'Unhedged 100% absolute uptime claim violates enterprise SLA compliance policy.', detected_value: 'guaranteed 100% uptime', recommended_value: 'industry-leading 99.99% SLA', bounding_box: { x: 90, y: 500, width: 880, height: 85, x_pct: 8.3, y_pct: 46.3, w_pct: 81.5, h_pct: 7.9 }, remediation_action: "Replace with verified legal SLA copy: 'industry-leading 99.99% SLA'." },
          { id: 'vf-4', category: 'embedded_text_violation', severity: 'high', title: "Prohibited Hype Terminology: 'AI magic'", description: "Rule violation: 'AI magic' trivializes machine intelligence infrastructure.", detected_value: 'AI magic', recommended_value: 'intelligent automated orchestration', bounding_box: { x: 90, y: 610, width: 550, height: 70, x_pct: 8.3, y_pct: 56.5, w_pct: 50.9, h_pct: 6.5 }, remediation_action: "Update raster copy to 'intelligent automated orchestration'." },
          { id: 'vf-5', category: 'contrast_accessibility', severity: 'high', title: 'WCAG 2.1 AA Contrast Failure (2.35:1 in Footer Banner)', description: 'Gray text (#9CA3AF) on red background (#DC2626) has contrast ratio 2.35:1 (minimum 4.5:1 required).', detected_value: '2.35:1', recommended_value: '>= 4.5:1 (AA Pass)', wcag_level: 'AA Fail', bounding_box: { x: 90, y: 800, width: 900, height: 140, x_pct: 8.3, y_pct: 74.1, w_pct: 83.3, h_pct: 13.0 }, remediation_action: 'Change footer text to high-contrast white (#FFFFFF).' }
        ],
        dominant_colors: [
          { hex: '#050806', percentage: 38.0, is_compliant: true, nearest_token: '#050806', distance: 0, role: 'Approved Brand Token (Obsidian Pitch)' },
          { hex: '#10B981', percentage: 26.0, is_compliant: true, nearest_token: '#10B981', distance: 0, role: 'Approved Brand Token (Electric Emerald)' },
          { hex: '#DC2626', percentage: 24.0, is_compliant: false, nearest_token: '#10B981', distance: 142.8, role: 'Off-Brand Color Token (Red Fill)', bounding_box: { x: 0, y: 720, width: 1080, height: 360, x_pct: 0.0, y_pct: 66.7, w_pct: 100.0, h_pct: 33.3 } },
          { hex: '#F59E0B', percentage: 12.0, is_compliant: true, nearest_token: '#F59E0B', distance: 0, role: 'Approved Brand Token (Warning Amber)' }
        ],
        logo_inspection: {
          detected: true,
          confidence: 0.97,
          aspect_ratio: 1.0,
          expected_aspect_ratio: 1.0,
          aspect_distortion_pct: 0.0,
          is_distorted: false,
          clear_space_passed: true,
          clear_space_margin_ratio: 0.62,
          required_margin_ratio: 0.50,
          bounding_box: { x: 90, y: 90, width: 110, height: 110, x_pct: 8.3, y_pct: 8.3, w_pct: 10.2, h_pct: 10.2 },
          exclusion_zone_box: { x: 35, y: 35, width: 220, height: 220, x_pct: 3.2, y_pct: 3.2, w_pct: 20.4, h_pct: 20.4 }
        },
        wcag_contrast_checks: [
          { zone_name: 'Headline Text Layer', foreground_hex: '#FFFFFF', background_hex: '#050806', contrast_ratio: 18.2, wcag_aa_pass: true, wcag_aaa_pass: true, is_large_text: true, bounding_box: { x: 90, y: 280, width: 880, height: 80, x_pct: 8.3, y_pct: 25.9, w_pct: 81.5, h_pct: 7.4 } },
          { zone_name: 'Promotional Footer Banner', foreground_hex: '#9CA3AF', background_hex: '#DC2626', contrast_ratio: 2.35, wcag_aa_pass: false, wcag_aaa_pass: false, is_large_text: false, bounding_box: { x: 90, y: 800, width: 900, height: 140, x_pct: 8.3, y_pct: 74.1, w_pct: 83.3, h_pct: 13.0 } }
        ],
        ocr_extracted_copy: [
          { extracted_text: 'The cheapest cloud management with guaranteed 100% uptime and AI magic!', line_number: 1, bounding_box: { x: 90, y: 380, width: 880, height: 310, x_pct: 8.3, y_pct: 35.2, w_pct: 81.5, h_pct: 28.7 }, violations_count: 3, findings: [] }
        ],
        limitations_note: 'Significant brand governance violations detected across color palette, prohibited terminology, and accessibility contrast.'
      });
    }

    // Default: preset-logo-distortion-encroachment
    return NextResponse.json({
      status: 'success',
      asset_dimensions: '1920x1080 px (Display Backdrop)',
      score: {
        color_palette_score: 100,
        logo_integrity_score: 40,
        embedded_copy_score: 100,
        wcag_contrast_score: 65,
        composite_score: 54,
        compliance_grade: 'Non-Compliant (Publishing Blocked)'
      },
      findings: [
        { id: 'vf-10', category: 'logo_distortion', severity: 'critical', title: 'Logo Aspect Ratio Distortion Detected (28.0% horizontal stretch)', description: 'Brand emblem has been non-uniformly scaled to 1.28:1 instead of required 1.00:1 ratio.', detected_value: '1.28:1', recommended_value: '1.00:1 (Uniform scale)', bounding_box: { x: 120, y: 80, width: 256, height: 200, x_pct: 6.2, y_pct: 7.4, w_pct: 13.3, h_pct: 18.5 }, remediation_action: 'Re-lock emblem proportions in design software and export with 1:1 scale.' },
        { id: 'vf-11', category: 'logo_clearance', severity: 'high', title: 'Clear-Space Exclusion Zone Encroachment (0.18H vs 0.5H required)', description: 'Tagline copy encroaches into the 0.5H clear margin surrounding the logo.', detected_value: '0.18H clear space', recommended_value: '>= 0.50H exclusion margin', bounding_box: { x: 120, y: 300, width: 450, height: 60, x_pct: 6.2, y_pct: 27.8, w_pct: 23.4, h_pct: 5.6 }, remediation_action: 'Increase top padding between logo and tagline to provide at least 100px clear margin.' },
        { id: 'vf-12', category: 'contrast_accessibility', severity: 'medium', title: 'WCAG 2.1 AA Contrast Warning (3.42:1 in Event Disclaimer)', description: 'Fine print contrast ratio 3.42:1 fails WCAG 2.1 AA requirement of 4.5:1.', detected_value: '3.42:1', recommended_value: '>= 4.5:1 (AA)', wcag_level: 'AA Fail', bounding_box: { x: 120, y: 920, width: 1200, height: 80, x_pct: 6.2, y_pct: 85.2, w_pct: 62.5, h_pct: 7.4 }, remediation_action: 'Brighten text color from #6B7280 to #D1D5DB.' }
      ],
      dominant_colors: [
        { hex: '#050806', percentage: 65.0, is_compliant: true, nearest_token: '#050806', distance: 0, role: 'Approved Brand Token (Obsidian Pitch)' },
        { hex: '#0A120E', percentage: 20.0, is_compliant: true, nearest_token: '#0A120E', distance: 0, role: 'Approved Brand Token (Elevated Surface)' },
        { hex: '#10B981', percentage: 15.0, is_compliant: true, nearest_token: '#10B981', distance: 0, role: 'Approved Brand Token (Electric Emerald)' }
      ],
      logo_inspection: {
        detected: true,
        confidence: 0.98,
        aspect_ratio: 1.28,
        expected_aspect_ratio: 1.00,
        aspect_distortion_pct: 28.0,
        is_distorted: true,
        clear_space_passed: false,
        clear_space_margin_ratio: 0.18,
        required_margin_ratio: 0.50,
        bounding_box: { x: 120, y: 80, width: 256, height: 200, x_pct: 6.2, y_pct: 7.4, w_pct: 13.3, h_pct: 18.5 },
        exclusion_zone_box: { x: 20, y: 0, width: 456, height: 400, x_pct: 1.0, y_pct: 0.0, w_pct: 23.8, h_pct: 37.0 }
      },
      wcag_contrast_checks: [
        { zone_name: 'Main Display Title', foreground_hex: '#FFFFFF', background_hex: '#050806', contrast_ratio: 18.2, wcag_aa_pass: true, wcag_aaa_pass: true, is_large_text: true, bounding_box: { x: 120, y: 300, width: 1100, height: 180, x_pct: 6.2, y_pct: 27.8, w_pct: 57.3, h_pct: 16.7 } },
        { zone_name: 'Event Disclaimer & Legal Footer', foreground_hex: '#6B7280', background_hex: '#050806', contrast_ratio: 3.42, wcag_aa_pass: false, wcag_aaa_pass: false, is_large_text: false, bounding_box: { x: 120, y: 920, width: 1200, height: 80, x_pct: 6.2, y_pct: 85.2, w_pct: 62.5, h_pct: 7.4 } }
      ],
      ocr_extracted_copy: [
        { extracted_text: 'AuraCloud Global Summit | The Unstoppable Multi-Cloud Architecture', line_number: 1, bounding_box: { x: 120, y: 300, width: 1100, height: 180, x_pct: 6.2, y_pct: 27.8, w_pct: 57.3, h_pct: 16.7 }, violations_count: 0, findings: [] }
      ],
      limitations_note: 'Critical geometry failure: Logo aspect ratio distortion and clearance zone encroachment detected.'
    });
  }

  // 13. Visual Image Inspection (multipart upload)
  if (pathStr === 'visual/inspect') {
    return NextResponse.json({
      status: 'success',
      asset_dimensions: 'Uploaded Graphic Asset',
      score: {
        color_palette_score: 95,
        logo_integrity_score: 100,
        embedded_copy_score: 100,
        wcag_contrast_score: 90,
        composite_score: 96,
        compliance_grade: 'Compliant (Approved for Publishing)'
      },
      findings: [],
      dominant_colors: [
        { hex: '#050806', percentage: 55, is_compliant: true, nearest_token: '#050806', distance: 0, role: 'Approved Brand Token (Obsidian Pitch)' },
        { hex: '#10B981', percentage: 30, is_compliant: true, nearest_token: '#10B981', distance: 0, role: 'Approved Brand Token (Electric Emerald)' },
        { hex: '#0A120E', percentage: 15, is_compliant: true, nearest_token: '#0A120E', distance: 0, role: 'Approved Brand Token (Elevated Surface)' }
      ],
      logo_inspection: {
        detected: true,
        confidence: 0.98,
        aspect_ratio: 1.0,
        expected_aspect_ratio: 1.0,
        aspect_distortion_pct: 0.0,
        is_distorted: false,
        clear_space_passed: true,
        clear_space_margin_ratio: 0.65,
        required_margin_ratio: 0.50
      },
      wcag_contrast_checks: [
        { zone_name: 'Main Content Layer', foreground_hex: '#FFFFFF', background_hex: '#050806', contrast_ratio: 18.2, wcag_aa_pass: true, wcag_aaa_pass: true, is_large_text: true }
      ],
      ocr_extracted_copy: [
        { extracted_text: 'AuraCloud Enterprise Infrastructure Orchestration', line_number: 1, violations_count: 0, findings: [] }
      ],
      limitations_note: 'Visual asset evaluated against corporate brand guidelines.'
    });
  }

  // Default POST response
  return NextResponse.json({ status: 'success', path: pathStr, body });
}

// =========================================================================
// PUT HANDLER
// =========================================================================
export async function PUT(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path } = await props.params;
  const pathStr = path.join('/');

  const proxied = await proxyToBackend(request, pathStr);
  if (proxied) return proxied;

  let body: any = {};
  try {
    body = await request.json();
  } catch {}

  return NextResponse.json({ status: 'updated', path: pathStr, data: body });
}

// =========================================================================
// DELETE HANDLER
// =========================================================================
export async function DELETE(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path } = await props.params;
  const pathStr = path.join('/');

  const proxied = await proxyToBackend(request, pathStr);
  if (proxied) return proxied;

  return NextResponse.json({ status: 'deleted', path: pathStr });
}
