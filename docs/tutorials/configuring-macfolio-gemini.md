# Configuring Macfolio Gemini Enhancement

## Local development

1. Copy `backend/.env.example` to `backend/.env`.
2. Add `GEMINI_API_KEY` to `backend/.env`.
3. Optionally set `GEMINI_MODEL`; the default is `gemini-3.5-flash`.
4. Run the backend from `backend/` with `npm run dev`.
5. Run the Vite frontend from the repository root with `npm run dev`.

The frontend calls `VITE_API_BASE_URL`, which defaults to `http://localhost:4000`. The key must never use a `VITE_` prefix because Vite-prefixed values are exposed to browser code.

## Behavior without a key

Local and Auto modes remain functional. AI Enhanced mode attempts the endpoint, receives a safe unavailable response, and displays the complete local answer with a subtle fallback status.

## Deployment

Deploy the existing Express backend or adapt the same validation logic to the deployment platform's serverless runtime. Configure `GEMINI_API_KEY`, `GEMINI_MODEL`, and `FRONTEND_ORIGINS` on the server. Configure `VITE_API_BASE_URL` for the frontend deployment.

## Safety checklist

- Never commit `backend/.env`.
- Never prefix the Gemini key with `VITE_`.
- Keep portfolio context public and bounded.
- Keep cards and actions local.
- Keep the server-side per-client rate limit enabled.
- Test missing-key and rate-limit fallback before deployment.
