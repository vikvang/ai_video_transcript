// Semantic search functionality for transcript viewer

// This is a simple semantic search implementation that analyzes transcript content
// to match natural language queries without requiring exact keyword matches

class SemanticSearcher {
  constructor() {
    // Store the transcript data for searching
    this.transcriptData = [];
    // Cache for recent search results to avoid repeated processing
    this.searchCache = new Map();
  }

  // Initialize with transcript data
  initialize(transcriptData) {
    this.transcriptData = transcriptData;
    this.searchCache.clear();
    console.log(
      "Semantic search initialized with",
      transcriptData.length,
      "transcript segments"
    );
    return this;
  }

  // Basic semantic similarity function using simple NLP techniques
  // This is a simplified version - a real implementation would use embeddings or an API
  calculateSimilarity(query, text) {
    if (!query || !text) return 0;

    // Convert to lowercase
    query = query.toLowerCase();
    text = text.toLowerCase();

    // Create word sets (basic tokenization)
    const queryWords = new Set(
      query.split(/\s+/).filter((word) => word.length > 2)
    );
    const textWords = new Set(
      text.split(/\s+/).filter((word) => word.length > 2)
    );

    // Simple word overlap calculation
    let matches = 0;
    queryWords.forEach((word) => {
      if (textWords.has(word)) matches++;

      // Check for partial matches (simple stemming/fuzzy matching)
      textWords.forEach((textWord) => {
        if (textWord.includes(word) || word.includes(textWord)) {
          matches += 0.5;
        }
      });
    });

    const querySize = queryWords.size || 1; // Avoid division by zero
    return matches / querySize;
  }

  // Handle named entity recognition (very simplified version)
  identifyEntities(query) {
    // Look for patterns like "where X talks about Y"
    const speakerMatch = query.match(/where\s+(\w+)\s+talks\s+about/i);
    const topicMatch = query.match(
      /talks\s+about\s+(.+?)(?:\s+in|\s+at|\s+during|\s*$)/i
    );

    return {
      speaker: speakerMatch ? speakerMatch[1].toLowerCase() : null,
      topic: topicMatch ? topicMatch[1].toLowerCase() : null,
    };
  }

  // Search transcript with the given query
  search(query) {
    // Check cache first
    const cacheKey = query.trim().toLowerCase();
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey);
    }

    console.log("Performing semantic search for:", query);

    // If no transcript data, return empty results
    if (!this.transcriptData || this.transcriptData.length === 0) {
      return [];
    }

    // Identify entities in the query
    const entities = this.identifyEntities(query);

    // Score each transcript segment
    const scoredResults = this.transcriptData.map((segment) => {
      let score = this.calculateSimilarity(query, segment.text);

      // Boost score if specific speaker or topic was mentioned and found
      if (
        entities.speaker &&
        segment.text.toLowerCase().includes(entities.speaker)
      ) {
        score += 0.3;
      }

      if (
        entities.topic &&
        segment.text.toLowerCase().includes(entities.topic)
      ) {
        score += 0.4;
      }

      return {
        segment,
        score,
      };
    });

    // Sort by score and filter out low-relevance results
    const results = scoredResults
      .filter((item) => item.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.segment);

    // Store in cache
    this.searchCache.set(cacheKey, results);

    return results;
  }
}

// Export the searcher
window.SemanticSearcher = new SemanticSearcher();
