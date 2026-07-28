# StakDock — Cloudflare Pages and Worker Deployment

StakDock is deployed through Cloudflare Pages and GitHub Actions only. No VPS is required.

## Cloudflare Pages

The existing Pages project identifier is `stackwisefinds`; its public canonical domain must remain `https://stakdock.com`.

1. In Cloudflare, connect the GitHub repository to the existing Pages project.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Attach `stakdock.com` as the primary custom domain.
4. Keep `stackwisefinds.com` and `www.stackwisefinds.com` as permanent redirects to `https://stakdock.com/:splat`.

## GitHub Actions secrets

Configure these repository secrets before enabling the scheduled workflows:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `INDEXNOW_KEY`

The IndexNow key must match the public verification text file already hosted at `https://stakdock.com/{key}.txt`.

## Cloudflare Worker secrets

The scheduled IndexNow Worker requires two encrypted Cloudflare Worker secrets:

```bash
npx wrangler secret put INDEXNOW_KEY
npx wrangler secret put MANUAL_TRIGGER_TOKEN
npx wrangler deploy
```

`MANUAL_TRIGGER_TOKEN` protects the optional manual Worker trigger. The cron schedule continues to run without an HTTP request.

## Candidate discovery

The six-hour GitHub Actions workflow only collects candidates into `data/ingestion-candidates.json`. It does not add tools or publish Reddit pages automatically. A candidate must pass website, duplicate, content-quality, and source-terms checks before becoming a public listing.