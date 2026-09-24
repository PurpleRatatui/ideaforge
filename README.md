# Idea Forge

A single-page startup-idea landing page with a KillMyIdea evaluation form and a Roast → Rebuild → GTM journey.

## Run

Use Node.js 22.13 or later.

```sh
npm install
npm run dev
```

Open the local URL printed by the server. `npm run build` emits a Cloudflare Worker in `dist/server/` and browser assets in `dist/client/`.

## Live evaluation

1. Create a Vercel AI Gateway key, or use an existing TypeSafe API key.
2. Copy `.env.example` to `.env` and set `AI_GATEWAY_API_KEY` for Vercel, or `TYPESAFE_API_KEY` for direct TypeSafe access. Add `HIVEMIND_API_KEY` to enable project creation, rebuilds, and GTM plans. For publishing, configure the same names as server secrets. If both Jev keys are set, direct TypeSafe takes precedence.
3. Restart the development server after changing the key.

`POST /api/evaluate` validates the idea, calls Jev with the upstream questions, and returns the upstream weighted score, verdict, clarity gate, and eight dimensions. Vercel uses its [TypeSafe-compatible endpoint](https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe) and `typesafe-ai/jev`; direct access uses `jev-latest`. Provider selection happens before the request, with no cross-provider retries or key forwarding. The key remains server-side. No submitted ideas are saved by this app. The upstream analytics archive and tracking code are not included.

The site explicitly reports missing credentials; it never silently returns fake evaluations. The example walkthrough uses a labeled fixture and does not call any service.

## Hivemind

Set `HIVEMIND_API_KEY` as a server-only secret. After a live roast, `POST /api/hivemind` creates a fresh Hivemind project from the submitted idea and KillMyIdea scores, waits briefly for project enrichment, then asks Hivemind for two outputs:

- `genius-strategist`: a sharper idea, customer, MVP, pricing hypothesis, and validation assumptions.
- `gtm-architect`: a practical go-to-market plan grounded in the same Hivemind project.

The browser never receives the Hivemind key. If Hivemind is missing, rate-limited, or blocked by plan access, the page keeps a copyable fallback brief.

## Publishing

### Vercel

Vercel is the recommended public host for this version because it supports the server-side API routes that keep the Jev and Hivemind keys private. Configure these environment variables in the Vercel project:

- `AI_GATEWAY_API_KEY`
- `HIVEMIND_API_KEY`
- `HIVEMIND_API_BASE_URL=https://hivemind.myosin.xyz`

The repository includes `vercel.json`, which tells Vercel to run `npm run build:vercel`. That script uses Next's Webpack build path so the project avoids a local Turbopack CSS issue and deploys `/api/evaluate` and `/api/hivemind` as server functions.

### Sites

The registered private Site ID is retained in `.openai/hosting.json`. Reuse it if you publish with Sites; do not create another Site.

## Verification

- TypeScript typecheck and production build passed.
- Local page returned HTTP 200 and rendered in the browser.
- Browser checks covered the example roast, rebuild, GTM plan, and mobile layout.
- WebMCP `roast_startup_idea` registered successfully; invalid input and a valid-input/missing-key error were checked against visible page state.
- Live Jev through Vercel AI Gateway has been verified locally.
- Live Hivemind project creation, enrichment, Rebuild output, and GTM output have been verified locally.

See `UPSTREAM.md` for the exact KillMyIdea source revision.
