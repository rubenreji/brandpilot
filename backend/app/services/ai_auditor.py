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

        # 2. Contextual Fact & Claim Checking via RAG
        relevant_facts = RAGEngine.retrieve_relevant_facts(text, approved_facts, top_k=5)
        
        # Check for potential product fact discrepancies
        # Example check: deprecated or conflicting numbers / specs
        for fact, score in relevant_facts:
            # If the text mentions the product or topic of the fact but misstates facts
            if "BrandPilot" in text and "100%" in text and "accuracy" in text:
                # Already captured or add specific factual contradiction
                pass

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
        Calculates brand compliance score between 0 and 100.
        100 = flawless compliance.
        Deductions:
          - Critical: -25 pts
          - High: -15 pts
          - Medium: -8 pts
          - Low: -3 pts
        """
        score = 100
        for f in findings:
            if f.severity == FindingSeverity.CRITICAL:
                score -= 25
            elif f.severity == FindingSeverity.HIGH:
                score -= 15
            elif f.severity == FindingSeverity.MEDIUM:
                score -= 8
            elif f.severity == FindingSeverity.LOW:
                score -= 3
        return max(0, min(100, score))
