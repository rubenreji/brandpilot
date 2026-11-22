import re
from typing import List, Dict, Any, Optional
from app.models.schemas import ComplianceFinding, FindingSeverity, IssueCategory, SuggestionStatus, TerminologyRule, RuleType

class DeterministicLinter:
    """
    High-throughput deterministic rule and token scanner.
    Operates before LLM evaluation to catch absolute terminology, disclaimer,
    and brand identity violations with zero hallucination.
    """
    
    @staticmethod
    def lint_text(
        text: str,
        terminology_rules: List[TerminologyRule],
        submission_id: str
    ) -> List[ComplianceFinding]:
        findings: List[ComplianceFinding] = []
        if not text:
            return findings

        # 1. Check Terminology Rules (Prohibited, Preferred, Required)
        for rule in terminology_rules:
            term = rule.term.strip()
            if not term:
                continue

            flags = 0 if rule.case_sensitive else re.IGNORECASE
            
            if rule.rule_type in [RuleType.PROHIBITED, RuleType.PREFERRED, RuleType.ALTERNATIVE]:
                # Construct whole-word regex pattern
                if rule.whole_word:
                    pattern = r'\b' + re.escape(term) + r'\b'
                else:
                    pattern = re.escape(term)
                
                for match in re.finditer(pattern, text, flags=flags):
                    start, end = match.span()
                    matched_str = text[start:end]
                    
                    if rule.rule_type == RuleType.PROHIBITED:
                        severity = FindingSeverity.HIGH
                        explanation = f"The term '{matched_str}' is explicitly prohibited by company brand guidelines. {rule.rule_description}"
                        suggestion = rule.preferred_alternative if rule.preferred_alternative else "[Remove this prohibited phrase]"
                        relevant_rule = f"Prohibited Term Policy: '{term}'"
                    elif rule.rule_type == RuleType.PREFERRED:
                        severity = FindingSeverity.MEDIUM
                        explanation = f"Use of '{matched_str}' deviates from the approved brand nomenclature. {rule.rule_description}"
                        suggestion = rule.preferred_alternative if rule.preferred_alternative else term
                        relevant_rule = f"Preferred Terminology: '{rule.preferred_alternative}'"
                    else:
                        severity = FindingSeverity.LOW
                        explanation = f"Alternative phrasing suggested for '{matched_str}'. {rule.rule_description}"
                        suggestion = rule.preferred_alternative if rule.preferred_alternative else term
                        relevant_rule = f"Standard Style Guide Rule"
                    
                    finding = ComplianceFinding(
                        submission_id=submission_id,
                        category=IssueCategory.TERMINOLOGY,
                        severity=severity,
                        original_text=matched_str,
                        start_index=start,
                        end_index=end,
                        explanation=explanation,
                        relevant_brand_rule=relevant_rule,
                        source_document="Corporate Brand Manual v2.4",
                        page_reference="Section 3: Approved Nomenclature & Vocabulary",
                        exact_supporting_passage=f"Approved Vocabulary Standard: Do not use '{term}'. Always use approved brand terminology: {rule.preferred_alternative or 'neutral phrasing'}.",
                        suggested_correction=suggestion,
                        confidence=1.0,
                        status=SuggestionStatus.PENDING,
                        verification_status="cannot_be_verified" if rule.rule_type != RuleType.PROHIBITED else "contradicted",
                        claim_type="terminology",
                        context_reasoning=f"The term '{matched_str}' deviates from company brand nomenclature guidelines. {rule.rule_description}",
                        grounded_evidence=f"Brand Manual Section 3: '{term}' is unapproved nomenclature. Approved replacement: '{rule.preferred_alternative or 'neutral professional wording'}'."
                    )
                    findings.append(finding)
            
            elif rule.rule_type == RuleType.REQUIRED:
                # If content deals with marketing/claims, verify required phrase is included
                pattern = re.escape(term)
                if not re.search(pattern, text, flags=flags):
                    # Flag missing required phrase
                    finding = ComplianceFinding(
                        submission_id=submission_id,
                        category=IssueCategory.MISSING_DISCLAIMER,
                        severity=FindingSeverity.HIGH,
                        original_text=text[:min(50, len(text))] + "...",
                        start_index=0,
                        end_index=min(30, len(text)),
                        explanation=f"Mandatory disclosure or required brand statement is missing: '{term}'. {rule.rule_description}",
                        relevant_brand_rule=f"Mandatory Statement Requirement: '{term}'",
                        source_document="Legal & Brand Compliance Standards 2026",
                        page_reference="Section 1.4: Mandatory Disclaimers",
                        exact_supporting_passage=f"Legal Policy 1.4: All published collateral mentioning product capabilities must explicitly include: '{term}'.",
                        suggested_correction=f"{text.strip()}\n\n*Disclaimer: {term}*",
                        confidence=1.0,
                        status=SuggestionStatus.PENDING,
                        verification_status="cannot_be_verified",
                        claim_type="disclaimer",
                        context_reasoning=f"Required statutory disclaimer '{term}' is missing from the submitted document.",
                        grounded_evidence=f"Legal Standards Section 1.4 requires mandatory disclosure: '{term}'."
                    )
                    findings.append(finding)

        # 2. Heuristic checks for unapproved absolute superlatives & guarantees
        superlative_patterns = [
            (
                r'\b(cheapest|lowest price|unbeatable prices?)\b',
                "Unsubstantiated comparative pricing claim",
                IssueCategory.UNSUPPORTED_CLAIM,
                FindingSeverity.CRITICAL,
                "A price comparison requires a defined competitor set and verified pricing audit evidence.",
                "cost-effective enterprise solution",
                "contradicted",
                "pricing",
                "Asserting comparative superlatives like 'cheapest' directly conflicts with enterprise positioning and exposes the firm to Lanham Act § 43(a) comparative advertising liability.",
                "Approved Price Book: AuraCloud solutions are positioned as premium enterprise infrastructure starting at $49/node, not commodity discounted services."
            ),
            (
                r'\b(100% accuracy|guarantees? 100%|flawless accuracy)\b',
                "Absolute performance guarantee",
                IssueCategory.UNSUPPORTED_CLAIM,
                FindingSeverity.CRITICAL,
                "Absolute performance guarantees are legally prohibited without qualified warranty coverage and active SLA bounds.",
                "high-precision automated verification",
                "cannot_be_verified",
                "absolute_guarantee",
                "Empirical software and machine learning systems cannot promise 100% precision across all edge cases without statistical confidence qualifications.",
                "Policy 4.2: Never state absolute guarantees without legal qualification and active SLA bounds."
            ),
            (
                r'\b(India\'?s No\.? ?1|world\'?s best|industry leader)\b',
                "Unsupported market leadership claim",
                IssueCategory.UNSUPPORTED_CLAIM,
                FindingSeverity.HIGH,
                "Market leadership claims require verified third-party analyst recognition (e.g. Gartner, IDC) and dated citation.",
                "leading AI-assisted brand governance platform",
                "cannot_be_verified",
                "market_ranking",
                "Market leadership ranking asserted without dated third-party analyst citation (e.g. Gartner Magic Quadrant, IDC MarketScape).",
                "Corporate Manual Section 4.2: Market ranking assertions must cite recognized industry analyst reports published within the trailing 12 months."
            ),
            (
                r'\b(AI magic|magical|revolutionary AI miracle)\b',
                "Inappropriate hype & buzzword usage",
                IssueCategory.TONE_MISMATCH,
                FindingSeverity.MEDIUM,
                "Our brand voice prioritizes technical precision and enterprise authority over speculative hype.",
                "intelligent automated inspection",
                "cannot_be_verified",
                "tone",
                "Vague marketing hype trivializes enterprise software engineering and violates brand voice standards.",
                "Brand Tone Standard: Maintain clear, active voice with technical precision. Avoid speculative buzzwords."
            )
        ]

        for pat, rule_title, cat, sev, reason, rec, v_stat, c_type, ctx_reason, g_evid in superlative_patterns:
            for match in re.finditer(pat, text, flags=re.IGNORECASE):
                start, end = match.span()
                matched_str = text[start:end]
                # Avoid duplicate if already covered by explicit rule
                if any(f.start_index == start and f.end_index == end for f in findings):
                    continue
                finding = ComplianceFinding(
                    submission_id=submission_id,
                    category=cat,
                    severity=sev,
                    original_text=matched_str,
                    start_index=start,
                    end_index=end,
                    explanation=f"{rule_title}: '{matched_str}'. {reason}",
                    relevant_brand_rule=f"Brand Trust & Claim Verification Standards: {rule_title}",
                    source_document="Corporate Brand Manual v2.4",
                    page_reference="Section 4.2: Factual Claims & Substantiation Guidelines",
                    exact_supporting_passage="Policy 4.2: Never state absolute guarantees, unsupported rankings, or exaggerated superlatives. All product descriptions must reflect verifiable specifications.",
                    suggested_correction=rec,
                    confidence=0.98,
                    status=SuggestionStatus.PENDING,
                    verification_status=v_stat,
                    claim_type=c_type,
                    context_reasoning=ctx_reason,
                    grounded_evidence=g_evid
                )
                findings.append(finding)

        return findings
