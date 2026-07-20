## SOP-006-RAG-RETRIEVAL - How the SOP RAG Agent Should Retrieve and Answer

**Tags:** RAG, retrieval, embeddings, grounding, guardrails, hallucination prevention

The SOP RAG Agent should retrieve by incident subtype, life threat, agency, language and action type. It should not retrieve a general medical article when the call requires a dispatcher script. Each chunk should therefore include metadata such as: incident_type, subtype, priority, agency, caller_instruction, responder_guidance, tone, contraindications, escalation and source_basis.

Recommended retrieval process:
1. Query expansion from call state. Example: "adult collapsed not breathing CPR dispatcher pre-arrival instruction".
2. Retrieve top SOP chunks using hybrid search: vector similarity plus keywords such as "not breathing", "cardiac arrest", "CPR", "P1", "caller instruction".
3. Rerank chunks by operational relevance, not semantic similarity alone.
4. Select one primary SOP chunk and one fallback safety chunk.
5. Generate answer using only retrieved instructions.
6. Include a confidence flag. If confidence is low, ask human dispatcher to confirm.
7. Log retrieved SOP IDs in the incident record.

Guardrails:
- If location is missing, prioritize location retrieval before clinical detail unless caller is actively performing life-saving action.
- If suspected cardiac arrest, retrieve T-CPR immediately.
- If fire/weapon/hazmat scene is unsafe, prioritize caller safety and responder staging.
- If caller is a child, simplify language and verify prank versus true emergency without dismissing the call.
- If the caller cannot speak, switch to silent-call workflow and use available location/callback metadata.

The agent should produce concise operational output, not a long explanation. Example output: "P1 suspected cardiac arrest. Ask: Is he breathing normally? If no, start compression-only CPR. Dispatch ALS ambulance. Keep caller on line."
