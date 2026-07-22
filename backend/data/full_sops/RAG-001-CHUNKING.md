## RAG-001-CHUNKING - RAG Chunking Strategy for Single-Document Embeddings

**Tags:** chunking, embeddings, retrieval, vector database, Vertex AI Vector Search

For MERS-AI, one long document can work if it is structured for retrieval. Avoid dumping unstructured PDFs into embeddings. Instead, keep one master SOP document with predictable headings, unique SOP IDs, metadata tags and repeated operational fields. The chunker should split by SOP ID and keep each protocol intact where possible.

Recommended chunk size: 600-1,200 tokens for incident protocols; 300-700 tokens for universal rules. Use overlap only within a protocol, not across unrelated incidents. Each chunk should begin with the SOP ID and tags so that even a small vector chunk contains incident type and action type.

Metadata fields to store with each chunk:
- sop_id
- title
- category
- priority
- agencies
- caller_instruction_available: true/false
- responder_guidance_available: true/false
- source_basis
- language_support
- escalation_required
- safety_critical: true/false

Retrieval should favour exact incident keywords, symptoms and operational stage. Example user utterance: "My father collapsed and not breathing" should retrieve MED-001-CARDIAC-ARREST, not a generic article about heart disease. Example utterance: "My husband is outside with a knife" should retrieve POL-001 or POL-002 and prioritize safe communication.
