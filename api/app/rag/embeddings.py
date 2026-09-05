from typing import List, Tuple

try:
    import numpy as np
except ImportError:
    np = None

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    TfidfVectorizer = None
    cosine_similarity = None

from app.schemas.rag import RAGChunk


class EmbeddingService:
    _vectorizer: TfidfVectorizer = None
    _chunk_matrix = None
    _indexed_chunks: List[RAGChunk] = []

    @classmethod
    def index_chunks(cls, chunks: List[RAGChunk]):
        """Fits TF-IDF vectorizer over the statutory chunk corpus."""
        cls._indexed_chunks = chunks
        if TfidfVectorizer is not None:
            try:
                corpus = [c.text for c in chunks]
                cls._vectorizer = TfidfVectorizer(
                    ngram_range=(1, 2),
                    stop_words="english",
                    max_features=2500,
                )
                cls._chunk_matrix = cls._vectorizer.fit_transform(corpus)
            except Exception:
                cls._vectorizer = None
                cls._chunk_matrix = None

    @classmethod
    def compute_similarity(cls, query: str, top_k: int = 5) -> List[Tuple[RAGChunk, float]]:
        """Computes dense cosine similarity between query and indexed chunks."""
        if cls._vectorizer is not None and cls._chunk_matrix is not None and cosine_similarity is not None and np is not None:
            try:
                query_vec = cls._vectorizer.transform([query])
                sims = cosine_similarity(query_vec, cls._chunk_matrix)[0]

                top_indices = np.argsort(sims)[::-1][:top_k]
                results = []
                for idx in top_indices:
                    score = float(sims[idx])
                    if score > 0.05:  # Relevance cutoff
                        results.append((cls._indexed_chunks[idx], round(score, 4)))
                return results
            except Exception:
                pass

        # Fallback simple keyword relevance
        query_words = set(query.lower().split())
        scored = []
        for c in cls._indexed_chunks:
            match_count = sum(1 for w in query_words if w in c.text.lower())
            if match_count > 0:
                scored.append((c, round(min(0.95, match_count * 0.15), 2)))
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]
