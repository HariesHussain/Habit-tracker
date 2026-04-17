# Production Webmaster Setup

Last updated: April 17, 2026

## 1. Domain placeholders to replace

Update these values before production release:

- `VITE_SITE_URL` in `.env`
- `SITE_HOST` in `.env`
- `INDEXNOW_KEY_LOCATION` in `.env`
- `https://your-domain.example` occurrences in:
  - `index.html`
  - `public/robots.txt`
  - `public/sitemap.xml`

## 2. Google Search Console

Use either approach:

- HTML file method:
  - Replace `public/google-site-verification.html` with your token file content.
- Meta tag method:
  - Replace `content` of `google-site-verification` in `index.html`.

## 3. Bing Webmaster Tools

Use either approach:

- XML file method:
  - Replace token in `public/BingSiteAuth.xml`.
- Meta tag method:
  - Replace `content` of `msvalidate.01` in `index.html`.

## 4. IndexNow

The endpoint `/api/v1/indexnow` is ready.

Required env vars:

- `INDEXNOW_KEY`
- `SITE_HOST`
- `INDEXNOW_KEY_LOCATION`

Recommended:

- Place the key in `public/indexnow-key.txt` (or a key-named file per your provider guidance).
- Submit changed URLs from your CI/CD pipeline after deploy.

## 5. Versioned API

All new server endpoints use `/api/v1/*`:

- `/api/v1/ai-coach`
- `/api/v1/indexnow`
