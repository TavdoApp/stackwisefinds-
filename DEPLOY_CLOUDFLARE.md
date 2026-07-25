# Stackwise — Cloudflare Pages Deployment & Custom Domain Guide

This document explains how to deploy **Stackwise** to **Cloudflare Pages** for 100% free, unlimited bandwidth hosting with automatic SSL.

---

## Method 1: Instant Deployment via Cloudflare Dashboard (Recommended)

1. **Push your repository to GitHub** (or connect your git account).
2. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
3. Navigate to **Workers & Pages** → **Create Application** → **Pages** tab → **Connect to Git**.
4. Select your **`stackwise`** repository.
5. Set the Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
6. Click **Save and Deploy**.
   - Cloudflare will build and publish your website globally in under 45 seconds!

---

## Method 2: Direct CLI Deployment (No Git Required)

If you want to deploy straight from your computer using the command line:

```bash
# 1. Build the production files
cmd /c npm run build

# 2. Deploy dist folder to Cloudflare Pages
npx wrangler pages deploy dist --project-name=stackwise
```

---

## Connecting Your Custom Domain (e.g. GetStackWise.com)

1. In your Cloudflare Dashboard, go to **Workers & Pages** → **stackwise** → **Custom Domains**.
2. Click **Set up a Custom Domain**.
3. Enter your domain name (e.g. `getstackwise.com` or `stackwise.co`).
4. Cloudflare will automatically configure the CNAME and DNS records and issue a free SSL/HTTPS certificate within 60 seconds!
