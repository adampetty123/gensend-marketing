# gensend-marketing

Standalone Next.js marketing site for [gensend.ai](https://www.gensend.ai). Owned solely by this repo — independent of the product surface (which lives in the edwin-frontend repo and is served from app.gensend.ai).

## Why separate

- Marketing deploys don't queue behind app builds, and vice versa
- Lighter bundle = faster Core Web Vitals = better SEO
- Marketing tooling (SEO, schema, analytics, content) doesn't pollute the app codebase
- Fully isolated rollback story

## Run locally

```bash
npm install
npm run dev
```

## Routes

- `/` - landing page
- `/sitemap.xml` - generated from `src/app/sitemap.ts`
- `/robots.txt` - static

When new marketing pages ship (`/pricing`, `/about`, `/blog/*`), add them to the sitemap.
