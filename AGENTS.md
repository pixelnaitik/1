# SecureVoyage — Agent System Directives

> **CRITICAL MANDATORY DIRECTIVE FOR AI ASSISTANTS:**
> Before proposing any architecture, generating code, making edits, or answering technical questions, you MUST first read and inspect all core documentation files in `docs/` and `database/`.

## Mandatory Onboarding Sequence for AI

When initialized or given a task on this repository, execute the following steps in order:

1. **Read Architecture & System Boundaries**:
   - Inspect [docs/ARCHITECTURE.md](file:///c:/Users/naiti/Desktop/SIH/docs/ARCHITECTURE.md) to understand service layers (Web PWA, API, AI-Service).
   
2. **Read API Schema Contracts**:
   - Inspect [docs/API_SCHEMA.md](file:///c:/Users/naiti/Desktop/SIH/docs/API_SCHEMA.md) before writing any API endpoint, controller, or request/response logic.

3. **Read DB & Domain Blueprint**:
   - Inspect [database/blueprint.md](file:///c:/Users/naiti/Desktop/SIH/database/blueprint.md) and [database/schema.sql](file:///c:/Users/naiti/Desktop/SIH/database/schema.sql) before modifying database models or migrations.

4. **Read AI Safety & Assistant Rules**:
   - Inspect [docs/AI_PROMPT.md](file:///c:/Users/naiti/Desktop/SIH/docs/AI_PROMPT.md) before making changes to the risk engine or LLM prompt templates.


## Code Standards & Strict Rules

- **Safety First**: Emergency actions (112 dial, SOS) must never depend directly on LLM responses.
- **Privacy by Design**: Routine GPS data must remain in-memory; explicit location sharing must be time-boxed.
- **Monorepo Workspaces**: Use `@securevoyage/web` and `@securevoyage/api` npm workspace packages.
