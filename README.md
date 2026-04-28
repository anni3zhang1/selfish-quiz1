# Selfish Quiz (MVP)

A web app where users take a topic quiz, get an "intellectual constellation" mapping them to 8 thinkers, and explore the results. First quiz: AI Governance.

## Stack

- Next.js (App Router) + TypeScript + Tailwind v4
- Supabase (Postgres) for session storage
- Anthropic Claude **Opus 4.7** (`claude-opus-4-7`) with adaptive thinking + structured outputs

## Setup

1. **Install deps** (already done if you cloned post-scaffold):
   ```
   npm install
   ```

2. **Env vars** — copy `.env.local.example` → `.env.local` and fill in:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_KEY=eyJ...   # the SERVICE ROLE key, not anon
   ```

3. **Supabase schema** — run `supabase/schema.sql` in the Supabase SQL editor for your project.

4. **Run dev**:
   ```
   npm run dev
   ```

## Routes

- `/` — Landing with topic cards (only AI Governance is active)
- `/quiz/ai_governance` — Quiz UI (one question at a time, conditional follow-ups)
- `/results/[session_id]` — Constellation reveal (face-down → flip cards)
- `POST /api/constellation` — Generates the constellation via Claude Opus 4.7
- `GET /api/results/[session_id]` — Fetch a session's results

## Notes

- The constellation API runs Opus 4.7 with adaptive thinking and `output_config.format` (JSON schema), so the response is always valid JSON.
- `maxDuration` on the constellation route is set to 300s — adaptive thinking on Opus 4.7 with `effort: "high"` can take 30–60+ seconds for complex quizzes.
- No auth — the `session_id` in the URL is the user's access token. Treat it as semi-private.
- Admin view, share images, and additional topics are not yet implemented (per the build order in the spec).
