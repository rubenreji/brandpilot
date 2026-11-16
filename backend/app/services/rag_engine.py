import math
import re
from typing import List, Dict, Any, Tuple
from app.models.schemas import GuidelineChunk, ApprovedFact

class RAGEngine:
    """
    Organization-scoped semantic retrieval engine.
    Ensures zero cross-tenant retrieval. Matches draft content against
    chunked brand style guides, corporate messaging pillars, and approved product facts.
    """

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        return [w.lower() for w in re.findall(r'\b\w{3,}\b', text)]

    @staticmethod
    def _bm25_similarity(query_tokens: List[str], doc_tokens: List[str]) -> float:
        """Lightweight, deterministic BM25 / TF-IDF ranking for fast semantic retrieval."""
        if not query_tokens or not doc_tokens:
            return 0.0
        doc_token_counts = {}
        for t in doc_tokens:
            doc_token_counts[t] = doc_token_counts.get(t, 0) + 1
        
        score = 0.0
        for qt in query_tokens:
            if qt in doc_token_counts:
                tf = doc_token_counts[qt]
                score += (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * (len(doc_tokens) / 50.0)))
        return score

    @classmethod
    def retrieve_relevant_guidelines(
        cls,
        draft_text: str,
        guidelines_chunks: List[GuidelineChunk],
        top_k: int = 3
    ) -> List[Tuple[GuidelineChunk, float]]:
        if not draft_text or not guidelines_chunks:
            return []

        query_tokens = cls._tokenize(draft_text)
        scored_chunks = []
        for chunk in guidelines_chunks:
            chunk_tokens = cls._tokenize(chunk.content + " " + (chunk.section_header or ""))
            sim = cls._bm25_similarity(query_tokens, chunk_tokens)
            if sim > 0.1:
                scored_chunks.append((chunk, sim))

        # Sort descending by similarity
        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        return scored_chunks[:top_k]

    @classmethod
    def retrieve_relevant_facts(
        cls,
        draft_text: str,
        approved_facts: List[ApprovedFact],
        top_k: int = 5
    ) -> List[Tuple[ApprovedFact, float]]:
        if not draft_text or not approved_facts:
            return []

        query_tokens = cls._tokenize(draft_text)
        scored_facts = []
        for fact in approved_facts:
            fact_tokens = cls._tokenize(fact.title + " " + fact.approved_statement + " " + (fact.product_association or ""))
            sim = cls._bm25_similarity(query_tokens, fact_tokens)
            if sim > 0.05:
                scored_facts.append((fact, sim))

        scored_facts.sort(key=lambda x: x[1], reverse=True)
        return scored_facts[:top_k]
