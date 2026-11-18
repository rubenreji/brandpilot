import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title = 'Draft Content',
      content_type = 'press_release',
      original_text = '',
      campaign_name = 'Enterprise Campaign',
      target_audience = 'Enterprise Customers',
      check_categories = ['terminology', 'unsupported_claim', 'outdated_fact', 'tone_of_voice']
    } = body;

    const submissionId = `sub-${Date.now()}`;
    const wordCount = original_text.trim() ? original_text.trim().split(/\s+/).length : 0;
    const detectedFindings: any[] = [];

    // Comprehensive Rule registry
    const rules = [
      {
        pattern: /India'?s\s+No\.?\s*1/i,
        category: 'unsupported_claim',
        severity: 'high',
        rule: 'Factual Claims Policy 4.2: Prohibited Market Superlatives',
        page: 'Page 22, Section 4.2',
        passage: "Section 4.2: Factual Claims Policy: Unsubstantiated market leadership claims ('No. 1', 'cheapest') expose the company to regulatory censure and are prohibited.",
        expl: "Unsupported market leadership ranking. Market position claims must cite dated third-party analyst recognition (e.g. Gartner, IDC).",
        repl: 'a leading enterprise cloud platform'
      },
      {
        pattern: /\bNo\.?\s*1\b/i,
        category: 'unsupported_claim',
        severity: 'high',
        rule: 'Factual Claims Policy 4.2: Prohibited Market Superlatives',
        page: 'Page 22, Section 4.2',
        passage: 'Section 4.2: Unsubstantiated rankings without third-party citations expose the company to liability.',
        expl: 'Unsubstantiated market ranking.',
        repl: 'industry-recognized'
      },
      {
        pattern: /AI\s*magic/i,
        category: 'terminology',
        severity: 'high',
        rule: "Terminology Policy: Prohibited Term 'AI magic'",
        page: 'Page 15, Section 3.4',
        passage: "Section 3.4: Nomenclature Rules: Never refer to our capabilities as 'AI magic'. Use 'automated cloud orchestration' or 'predictive optimization'.",
        expl: "The phrase 'AI magic' is explicitly prohibited. It trivializes enterprise software engineering and violates brand voice standards.",
        repl: 'intelligent automated orchestration'
      },
      {
        pattern: /guarantees?\s+100%\s+accuracy/i,
        category: 'unsupported_claim',
        severity: 'critical',
        rule: 'Legal Compliance Standard: Prohibited Absolute Guarantees',
        page: 'Page 22, Section 4.2',
        passage: 'Section 4.2: Never state absolute guarantees, unsupported rankings, or exaggerated superlatives. All product descriptions must reflect verifiable specifications.',
        expl: 'Absolute performance guarantee. Legally prohibited under our compliance guidelines without qualified warranty limits and SLA bounds.',
        repl: 'delivers high-reliability automated verification'
      },
      {
        pattern: /cheapest\s+solution(?:\s+available)?/i,
        category: 'unsupported_claim',
        severity: 'critical',
        rule: 'Factual Claims Policy 4.2: Comparative Pricing',
        page: 'Page 22, Section 4.2',
        passage: "Section 4.2: Comparative pricing claims ('cheapest') without published competitive benchmarking invite regulatory scrutiny.",
        expl: 'Unsubstantiated comparative pricing claim. Price superlatives require a defined competitor benchmark and active pricing audit.',
        repl: 'cost-effective enterprise solution'
      },
      {
        pattern: /\bauracloud\b/,
        category: 'terminology',
        severity: 'medium',
        rule: 'Brand Nomenclature Policy 3.4: Capitalization Standard',
        page: 'Page 15, Section 3.4',
        passage: "Section 3.4: Nomenclature Rules: AuraCloud must always appear in camel-case. Derivatives such as 'auracloud' are prohibited.",
        expl: "Incorrect brand capitalization. AuraCloud must always be capitalized with capital 'A' and capital 'C'.",
        repl: 'AuraCloud'
      },
      {
        pattern: /100%\s+uptime/i,
        category: 'outdated_fact',
        severity: 'critical',
        rule: 'Corporate SLA Standard 2026: Approved Uptime Bound',
        page: 'Page 8, Section 2.1',
        passage: 'AuraCloud standard enterprise SLA guarantees 99.95% monthly uptime. Claims of 100% uptime are non-compliant.',
        expl: "Contradicts approved corporate facts. AuraCloud's verified SLA is 99.95% monthly uptime.",
        repl: '99.95% monthly uptime SLA'
      },
      {
        pattern: /cloud\s+supremacy/i,
        category: 'tone_mismatch',
        severity: 'medium',
        rule: 'Tone of Voice Guide: Professionalism & Humility',
        page: 'Page 18, Section 4.0',
        passage: 'Maintain an authoritative, evidence-based tone. Avoid combative or hyper-aggressive expressions such as supremacy.',
        expl: 'Violates enterprise tone guidelines. Replace hyper-aggressive phrasing with collaborative value proposition.',
        repl: 'cloud governance excellence'
      },
      {
        pattern: /click\s+here\b/i,
        category: 'accessibility',
        severity: 'medium',
        rule: 'Digital Accessibility Standard WCAG 2.1: Meaningful Link Text',
        page: 'Page 28, Section 5.3',
        passage: 'Non-descriptive hyperlinks such as "click here" fail accessibility benchmarks. Use meaningful descriptive labels describing the destination.',
        expl: 'Accessibility finding: Non-descriptive anchor text degrades screen reader navigation.',
        repl: 'explore our cloud architecture documentation'
      },
      {
        pattern: /\b(?:unhackable|100%\s+secure|impervious\s+to\s+attacks?)\b/i,
        category: 'unsupported_claim',
        severity: 'critical',
        rule: 'Security Communications Standard: Qualified Defense Claims',
        page: 'Page 30, Section 6.1',
        passage: 'Section 6.1: Absolute security assertions are mathematically false and expose the firm to critical breach liability.',
        expl: 'Absolute security claims are legally prohibited. Use defense-in-depth qualifications.',
        repl: 'zero-trust architecture with defense-in-depth isolation'
      },
      {
        pattern: /\b(?:military-grade(?:\s+encryption)?|bulletproof(?:\s+security)?)\b/i,
        category: 'unsupported_claim',
        severity: 'high',
        rule: 'Security Policy 4.2: Prohibited Exaggerated Security Metaphors',
        page: 'Section 4.2',
        passage: 'Section 4.2: Marketing clichés such as military-grade or bulletproof lack technical definition. Specify actual ciphers (FIPS 140-3 validated AES-256-GCM).',
        expl: 'Exaggerated security claim. Replace informal buzzwords with verified cryptographic standards.',
        repl: 'FIPS 140-3 validated AES-256-GCM encryption with HSM keys'
      },
      {
        pattern: /\b(?:zero\s+latency|instantaneous(?:\s+routing)?)\b/i,
        category: 'unsupported_claim',
        severity: 'high',
        rule: 'Performance SLA Standard 3.1: Latency Specifications',
        page: 'Section 3.1',
        passage: 'Section 3.1: Network propagation cannot achieve zero latency. Always quote verified empirical percentiles (median 1.8ms, p99 < 4.2ms).',
        expl: 'Physical propagation limits prevent zero latency. Always quote verified p99 latency benchmarks.',
        repl: 'deterministic sub-5 millisecond median latency'
      },
      {
        pattern: /\b(?:infinite\s+scal(?:e|ability)|unlimited\s+scale)\b/i,
        category: 'unsupported_claim',
        severity: 'high',
        rule: 'Architecture Scale Standard 3.1: Horizontal Autoscaling Bounds',
        page: 'Section 3.1',
        passage: 'Section 3.1: Unbounded scalability claims lack engineering veracity. Cite verified load-test thresholds (2.4M RPS per cluster).',
        expl: 'Unbounded scaling claims are unverified. Cite empirical load-test throughput.',
        repl: 'elastic horizontal autoscaling supporting 1M+ concurrent RPS'
      }
    ];

    // Enumerate ALL matches per rule across the complete text
    rules.forEach((item, ruleIdx) => {
      const flags = item.pattern.flags.includes('g') ? item.pattern.flags : item.pattern.flags + 'g';
      const globalRegex = new RegExp(item.pattern.source, flags);

      let match: RegExpExecArray | null;
      let matchCount = 0;
      while ((match = globalRegex.exec(original_text)) !== null) {
        matchCount++;
        detectedFindings.push({
          id: `find-edge-${Date.now()}-${ruleIdx}-${matchCount}-${match.index}`,
          submission_id: submissionId,
          category: item.category,
          severity: item.severity,
          original_text: match[0],
          start_index: match.index,
          end_index: match.index + match[0].length,
          explanation: item.expl,
          relevant_brand_rule: item.rule,
          source_document: 'AuraCloud Global Brand & Communication Manual v2.4',
          page_reference: item.page,
          exact_supporting_passage: item.passage,
          suggested_correction: item.repl,
          confidence: 0.98,
          status: 'pending'
        });

        // Avoid infinite loop if regex matches empty string
        if (match[0].length === 0) {
          globalRegex.lastIndex++;
        }
      }
    });

    // Deduplicate findings if a broader regex captures the same span as a more specific one
    const uniqueFindings: any[] = [];
    const seenSpans = new Set<string>();
    
    // Sort findings by document appearance order
    detectedFindings.sort((a, b) => a.start_index - b.start_index);

    for (const f of detectedFindings) {
      const spanKey = `${f.start_index}-${f.end_index}`;
      if (!seenSpans.has(spanKey)) {
        seenSpans.add(spanKey);
        uniqueFindings.push(f);
      }
    }

    const criticalDeduction = uniqueFindings.filter(f => f.severity === 'critical').length * 20;
    const highDeduction = uniqueFindings.filter(f => f.severity === 'high').length * 10;
    const mediumDeduction = uniqueFindings.filter(f => f.severity === 'medium').length * 5;
    const score = Math.max(12, 100 - (criticalDeduction + highDeduction + mediumDeduction));

    const submission = {
      id: submissionId,
      organization_id: 'org-auracloud-001',
      title,
      content_type,
      campaign_name,
      original_text,
      current_text: original_text,
      status: 'audited',
      word_count: wordCount,
      character_count: original_text.length,
      compliance_score: score,
      creator_id: 'user-creator-1',
      creator_name: 'Marcus Vance',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      findings_count: uniqueFindings.length,
      critical_count: uniqueFindings.filter(f => f.severity === 'critical').length
    };

    return NextResponse.json({
      submission,
      findings: uniqueFindings,
      compliance_score: score
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Audit failed' }, { status: 500 });
  }
}
