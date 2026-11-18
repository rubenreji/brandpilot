import re
from typing import List, Dict, Any, Optional
from app.models.schemas import (
    ComplianceFinding, FindingSeverity, IssueCategory, SuggestionStatus,
    TerminologyRule, GuidelineChunk, ApprovedFact, ToneProfile, ContentSubmission
)
from app.services.linter import DeterministicLinter
from app.services.rag_engine import RAGEngine

class AIAuditEngine:
    """
    Hybrid Brand Checking Engine:
    Combines deterministic rules, semantic RAG grounding, and contextual review.
    """

    @classmethod
    def audit_submission(
        cls,
        submission: ContentSubmission,
        terminology_rules: List[TerminologyRule],
        guideline_chunks: List[GuidelineChunk],
        approved_facts: List[ApprovedFact],
        tone_profile: Optional[ToneProfile] = None
    ) -> List[ComplianceFinding]:
        text = submission.current_text or submission.original_text
        all_findings: List[ComplianceFinding] = []

        # 1. Deterministic Rule Linting (Prohibited, Preferred, Disclaimers)
        deterministic_findings = DeterministicLinter.lint_text(
            text=text,
            terminology_rules=terminology_rules,
            submission_id=submission.id
        )
        all_findings.extend(deterministic_findings)

        # 2. Contextual Fact & Claim Checking via RAG & Approved Fact Registry
        relevant_facts = RAGEngine.retrieve_relevant_facts(text, approved_facts, top_k=5)
        
        # Check candidate copy against approved corporate facts
        for fact, score in relevant_facts:
            fact_statement = fact.approved_statement.lower()

            # A. Uptime & High Availability Contradictions
            if "uptime" in fact_statement or "sla" in fact_statement:
                for m in re.finditer(r'\b(?:100%\s+uptime|zero\s+downtime|uninterrupted\s+uptime|never\s+goes\s+down)\b', text, flags=re.IGNORECASE):
                    start, end = m.span()
                    matched_str = text[start:end]
                    if not any(f.start_index == start and f.end_index == end for f in all_findings):
                        all_findings.append(ComplianceFinding(
                            submission_id=submission.id,
                            category=IssueCategory.OUTDATED_FACT,
                            severity=FindingSeverity.CRITICAL,
                            original_text=matched_str,
                            start_index=start,
                            end_index=end,
                            explanation=f"Contradicts verified corporate SLA. Approved corporate standard: '{fact.approved_statement}'",
                            relevant_brand_rule=f"Corporate Fact: {fact.title}",
                            source_document="AuraCloud Enterprise Agreement Schedule B",
                            page_reference="Schedule B (SLA Commitments)",
                            exact_supporting_passage=fact.supporting_evidence or fact.approved_statement,
                            suggested_correction="99.95% monthly uptime SLA",
                            confidence=0.98,
                            status=SuggestionStatus.PENDING
                        ))

            # B. Pricing Contradictions
            if "pricing" in fact.category.lower() or "$49" in fact_statement:
                for m in re.finditer(r'\b(?:cheapest(?:\s+cloud)?|\$(?:19|29)\b|free\s+forever|lowest\s+price)\b', text, flags=re.IGNORECASE):
                    start, end = m.span()
                    matched_str = text[start:end]
                    if not any(f.start_index == start and f.end_index == end for f in all_findings):
                        all_findings.append(ComplianceFinding(
                            submission_id=submission.id,
                            category=IssueCategory.OUTDATED_FACT,
                            severity=FindingSeverity.HIGH,
                            original_text=matched_str,
                            start_index=start,
                            end_index=end,
                            explanation=f"Contradicts current enterprise price book. Approved statement: '{fact.approved_statement}'",
                            relevant_brand_rule=f"Corporate Fact: {fact.title}",
                            source_document="Approved Enterprise Price Book",
                            page_reference="Pricing Schedule Q4",
                            exact_supporting_passage=fact.supporting_evidence or fact.approved_statement,
                            suggested_correction="cost-effective starting at $49/node",
                            confidence=0.95,
                            status=SuggestionStatus.PENDING
                        ))

            # C. Failover & RPO/RTO Limits
            if "failover" in fact.title.lower() or "rpo" in fact_statement:
                for m in re.finditer(r'\b(?:zero\s+data\s+loss|instantaneous\s+failover|zero-second\s+rpo)\b', text, flags=re.IGNORECASE):
                    start, end = m.span()
                    matched_str = text[start:end]
                    if not any(f.start_index == start and f.end_index == end for f in all_findings):
                        all_findings.append(ComplianceFinding(
                            submission_id=submission.id,
                            category=IssueCategory.UNSUPPORTED_CLAIM,
                            severity=FindingSeverity.HIGH,
                            original_text=matched_str,
                            start_index=start,
                            end_index=end,
                            explanation=f"Exaggerated disaster recovery claim. Approved specification: '{fact.approved_statement}'",
                            relevant_brand_rule=f"Corporate Fact: {fact.title}",
                            source_document="Disaster Recovery Protocol v3.2",
                            page_reference="Section 3.2: Chaos Mesh Audit",
                            exact_supporting_passage=fact.supporting_evidence or fact.approved_statement,
                            suggested_correction="RPO under 15 seconds and RTO under 60 seconds",
                            confidence=0.95,
                            status=SuggestionStatus.PENDING
                        ))

        # 3. Tone of Voice Analysis
        if tone_profile:
            # Check for words to avoid defined in tone profile
            for bad_word in tone_profile.words_to_avoid:
                pattern = r'\b' + re.escape(bad_word) + r'\b'
                for match in re.finditer(pattern, text, flags=re.IGNORECASE):
                    start, end = match.span()
                    matched_str = text[start:end]
                    if not any(f.start_index == start and f.end_index == end for f in all_findings):
                        finding = ComplianceFinding(
                            submission_id=submission.id,
                            category=IssueCategory.TONE_MISMATCH,
                            severity=FindingSeverity.MEDIUM,
                            original_text=matched_str,
                            start_index=start,
                            end_index=end,
                            explanation=f"'{matched_str}' conflicts with our brand tone profile. Our preferred sentence style is: {tone_profile.preferred_sentence_style}",
                            relevant_brand_rule=f"Brand Voice Standard (Target Formality: {tone_profile.formality_level}/10)",
                            source_document="Corporate Brand Manual v2.4",
                            page_reference="Section 2.1: Tone of Voice & Personality",
                            exact_supporting_passage=f"Tone Guidelines: Maintain an authoritative, clear, and confident demeanor. Words to avoid: {', '.join(tone_profile.words_to_avoid)}.",
                            suggested_correction="[Approved professional equivalent]",
                            confidence=0.92,
                            status=SuggestionStatus.PENDING
                        )
                        all_findings.append(finding)

        # Deduplicate findings on identical span
        unique_findings = []
        seen_spans = set()
        for f in all_findings:
            key = (f.start_index, f.end_index, f.category)
            if key not in seen_spans:
                seen_spans.add(key)
                unique_findings.append(f)

        return unique_findings

    @staticmethod
    def calculate_compliance_score(findings: List[ComplianceFinding]) -> int:
        """
        Calculates brand compliance score between 0 and 100 based on all findings and their resolution state.
        - Accepted findings have been resolved (0 deduction).
        - Pending findings are unresolved violations (full deduction).
        - Rejected findings mean the author preserved non-compliant copy (full deduction).
        """
        score = 100
        for f in findings:
            # If finding was accepted, the violation was remediated in copy
            if getattr(f, 'status', None) == SuggestionStatus.ACCEPTED or getattr(f, 'status', None) == 'accepted':
                continue

            if f.severity == FindingSeverity.CRITICAL or getattr(f.severity, 'value', '') == 'critical':
                score -= 25
            elif f.severity == FindingSeverity.HIGH or getattr(f.severity, 'value', '') == 'high':
                score -= 15
            elif f.severity == FindingSeverity.MEDIUM or getattr(f.severity, 'value', '') == 'medium':
                score -= 8
            elif f.severity == FindingSeverity.LOW or getattr(f.severity, 'value', '') == 'low':
                score -= 3
        return max(0, min(100, score))
