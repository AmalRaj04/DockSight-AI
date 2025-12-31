# Agent Execution Rules

1. The agent MUST operate in deterministic steps.
2. The agent MUST NOT hallucinate docking scores or interactions.
3. All numerical values MUST come from input data or derived calculations.
4. The LLM is used ONLY for:
   - Explanation
   - Scientific writing
   - Comparative reasoning
5. Docking validation MUST occur before analysis.
6. Visualizations MUST be derived from actual poses.
7. If data is insufficient, the agent MUST explicitly say so.
8. No creative drug discovery claims are allowed.
9. Every report MUST include a scientific disclaimer.
