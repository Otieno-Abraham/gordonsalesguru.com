# Gordon Sales Guru

A production-ready personal lead-generation website for **Gordon Odhiambo**, Sales
Executive specialising in premium custom kitchen cabinets, wardrobes, bathrooms and
full interior fitouts across East Africa.

- **Live (temporary):** `gordon.github.io/gordonsalesguru`
- **Final domain:** `gordonsalesguru.com`
- **Stack:** Next.js 14 (static export) · TypeScript · Tailwind CSS · MDX · next-sitemap
- **Hosting:** GitHub Pages (auto-deploy via GitHub Actions, with a daily rebuild)

The formula: **personal trust + direct WhatsApp contact + deep SEO = leads every day.**

---

## Table of contents

1. [Local setup](#1-local-setup)
2. [Add Gordon's photo](#2-add-gordons-photo)
3. [Add product / project photos](#3-add-product--project-photos)
4. [Add brochures (auto-extracted)](#4-add-brochures-auto-extracted)
5. [Add videos (auto-upscaled)](#5-add-videos-auto-upscaled)
6. [Check extraction results](#6-check-extraction-results)
7. [Update the WhatsApp number](#7-update-the-whatsapp-number)
8. [Update the Formspree ID](#8-update-the-formspree-id)
9. [Add a testimonial](#9-add-a-testimonial)
10. [Publish a blog post](#10-publish-a-blog-post)
11. [Submit to Google Search Console](#11-submit-to-google-search-console)
12. [Set up Google Analytics](#12-set-up-google-analytics)
13. [Point gordonsalesguru.com to GitHub Pages](#13-point-gordonsalesgurucom-to-github-pages)
14. [Set up the consult@ email](#14-set-up-the-consultgordonsalesgurucom-email)

Plus: [How the project is organised](#how-the-project-is-organised) ·
[How auto-wiring works](#how-the-media-auto-wiring-works) ·
[How the blog auto-publishes](#how-the-blog-auto-publishes) ·
[Environment variables](#environment-variables).

---

## 1. Local setup

**Prerequisites:** Node.js 20+, and (only if you want to process brochures/videos
locally) Python 3.11+ with `pip install pymupdf pillow`, plus FFmpeg on your PATH.

```bash
npm install
npm run dev
```

Open <http://localhost:3000> (the preview config uses port 4123). Editing any file
hot-reloads the site.

To produce the deployable static site locally:

```bash
npm run build      # runs the asset scripts, exports to /out, then builds the sitemap
```

The finished site is written to `/out`. You normally never need to deploy by hand —
see [section 13](#13-point-gordonsalesgurucom-to-github-pages); pushing to `main`
deploys automatically.

> **Tip:** `npm run build` first runs `npm run preprocess`, which re-extracts
> brochure images and re-encodes videos. If you just want to rebuild the site
> without reprocessing assets, run `npx next build && npx next-sitemap`.

---

## 2. Add Gordon's photo

1. Name the file **`Gordon`** with any image extension (e.g. `Gordon.jpg`,
   `Gordon.jpeg`, `Gordon.png`).
2. Drop it into **`/assets/images/`**.
3. Run `npm run build` (or `npm run preprocess`). It is converted to
   `public/media/images/gordon/gordon.webp` and used on the homepage and About page.

If no photo is present, a tasteful placeholder is shown instead — the layout never
breaks.

---

## 3. Add product / project photos

Drop any image into **`/assets/images/`**. The filename decides where it appears —
**no code changes needed**. On the next build it is converted to WebP and wired in:

| If the filename contains…                       | It appears in…              |
| ----------------------------------------------- | --------------------------- |
| `kitchen`, `cabinet`, `cook`                    | Products → Kitchen Cabinets |
| `wardrobe`, `closet`, `bedroom`                 | Products → Wardrobes        |
| `bathroom`, `vanity`, `bath`                    | Products → Bathrooms        |
| `fitout`, `interior`, `living`, `office`        | Products → Interior Fitouts |
| `project`, `completed`, `install`, `before`, `after` | Projects               |
| anything else                                   | Products → Interior Fitouts |

Example: `modern-white-kitchen-island.jpg` → Kitchen Cabinets.
`completed-westlands-wardrobe.jpg` → Projects.

> Use descriptive, brand-free names. Never include a manufacturer or supplier name.

---

## 4. Add brochures (auto-extracted)

1. Drop any PDF brochure into **`/assets/brochures/`**.
2. Run `npm run build` (or `npm run preprocess`).

The script `scripts/extract-brochures.py` extracts every product photo at high
resolution, removes small/decorative images, strips any source/brand references,
converts everything to WebP, and sorts the images into
`public/media/images/products/<category>/` based on the brochure's subject.

If the folder is empty, the build skips this step cleanly.

---

## 5. Add videos (auto-upscaled)

1. Drop raw video files into **`/assets/videos/`**.
2. Run `npm run build` (or `npm run preprocess`).

`scripts/process-videos.sh` re-encodes each clip to web-ready 1080p H.264
(upscaling with the lanczos filter if needed), strips audio (the hero loop autoplays
muted), and generates a `*-poster.webp` for each. Output lands in
`public/media/videos/`. The first clip (`interior-tour-01.mp4`) becomes the hero
background on `/products` — rename any clip to `interior-tour-01.mp4` to promote it.

Requires FFmpeg. If the folder is empty or FFmpeg is missing, the build skips this
step cleanly and the hero falls back to a poster/placeholder.

---

## 6. Check extraction results

After a build, open **`/assets/extraction-log.txt`**. It lists, per brochure, how
many images were scanned and kept, where each was saved, and anything flagged for
manual review. (No brand names are ever written to this log.)

---

## 7. Update the WhatsApp number

Edit **`NEXT_PUBLIC_WHATSAPP_NUMBER`** in `.env.local` (local) and add the same
value as a **repository secret** for the live site (see
[Environment variables](#environment-variables)).

Use international format with no `+`, spaces or dashes — e.g. a Kenyan number
`0712 345 678` becomes `254712345678`.

This single value powers the floating button, the auto-popup widget, every
"WhatsApp Gordon" link, and the lead-form alert that notifies Gordon of new enquiries.

---

## 8. Update the Formspree ID

1. Create a free form at <https://formspree.io>, copy its form ID (the part after
   `/f/`, e.g. `xyzabcd`).
2. Set **`NEXT_PUBLIC_FORMSPREE_ID`** in `.env.local` and as a repository secret.

Lead-form submissions POST to Formspree (delivered to Gordon's email) **and** open a
pre-filled WhatsApp alert so Gordon is notified on his phone. Until an ID is set, the
form falls back to the WhatsApp alert alone, so it always works.

---

## 9. Add a testimonial

Edit the `testimonials` array in **`src/lib/data.ts`**. Each entry has `name`,
`location`, `productType` and `quote`. Add, edit or remove entries freely — the
homepage updates automatically.

---

## 10. Publish a blog post

Blog posts are MDX files in **`src/content/blog/`**. To add one:

1. Copy an existing `.mdx` file as a starting point.
2. Set the frontmatter:

   ```mdx
   ---
   title: ""
   description: ""          # 150–160 chars for SEO
   publishDate: "2025-08-01" # the post goes live on this date
   slug: "your-post-slug"
   keywords: ["primary keyword", "secondary keyword"]
   coverImage: "/media/images/products/kitchens/custom-kitchen-design-01.webp"
   author: "Gordon Odhiambo"
   category: "Kitchen Design"  # see categories below
   readTime: "4 min read"
   featured: false
   ---
   ```

3. Write the body. Drop `<GordonInlineCTA />` anywhere for a mid-post WhatsApp CTA.

**Date-gating:** a post is hidden until its `publishDate` arrives. Because GitHub
Actions rebuilds the site **every day at 06:00 EAT**, future-dated posts publish
themselves automatically — schedule a month of content in advance and forget it.

**Categories:** `Kitchen Design`, `Wardrobe Ideas`, `Bathroom Trends`,
`Nairobi Homes`, `East Africa Interiors`, `Tips & Guides`.

---

## 11. Submit to Google Search Console

1. Go to <https://search.google.com/search-console> and add a property for
   `https://gordonsalesguru.com` (Domain or URL-prefix).
2. **Easiest method — HTML tag:** copy the `content` value Google gives you and add a
   `verification` block to `metadata` in `src/app/layout.tsx`:

   ```ts
   verification: { google: "PASTE_THE_CONTENT_VALUE" },
   ```

   Commit and push, then click **Verify**.
   *(Alternatively, drop Google's `googleXXXX.html` file into `/public` — a
   placeholder lives at `/public/google-site-verification.html`.)*
3. Once verified, submit the sitemap: enter `sitemap.xml` and click **Submit**.

The sitemap and `robots.txt` are generated automatically on every build.

---

## 12. Set up Google Analytics

1. Create a GA4 property at <https://analytics.google.com> and copy the Measurement
   ID (format `G-XXXXXXXXXX`).
2. Set **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** in `.env.local` and as a repository secret.

Analytics loads only once a valid `G-` ID is present. A Facebook Pixel is also wired
and ready — set **`NEXT_PUBLIC_FACEBOOK_PIXEL_ID`** whenever you start running ads.

---

## 13. Point gordonsalesguru.com to GitHub Pages

**First, enable Pages + deploys:**

1. Push this repo to GitHub (branch `main`).
2. In **Settings → Secrets and variables → Actions**, add the secrets listed in
   [Environment variables](#environment-variables).
3. On the first push, the workflow builds and pushes the site to a `gh-pages` branch.
   In **Settings → Pages**, set **Source = Deploy from a branch**, branch
   **`gh-pages`** / root.

**Then connect the custom domain:**

4. The repo already contains `public/CNAME` (`gordonsalesguru.com`), so GitHub Pages
   picks up the custom domain automatically.
5. At your domain registrar, create DNS records:
   - Four `A` records for the apex `@` → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - One `CNAME` record for `www` → `gordon.github.io`
6. Back in **Settings → Pages**, confirm the custom domain and tick **Enforce HTTPS**
   (allow a little time for the certificate to issue).

> Using the apex custom domain means **no base path** is needed. If you ever host on
> the project URL `gordon.github.io/gordonsalesguru` instead, set
> `NEXT_PUBLIC_BASE_PATH=/gordonsalesguru` and remove `public/CNAME`.

---

## 14. Set up the consult@gordonsalesguru.com email

You need email on the domain to receive Formspree leads and replies.

**Option A — Google Workspace (recommended, paid):**

1. Sign up at <https://workspace.google.com> with `gordonsalesguru.com`.
2. Verify domain ownership and add the `MX` records Google provides at your registrar.
3. Create the mailbox `consult@gordonsalesguru.com`.

**Option B — Zoho Mail (has a free tier):**

1. Sign up at <https://www.zoho.com/mail> and add `gordonsalesguru.com`.
2. Verify the domain and add Zoho's `MX` records at your registrar.
3. Create `consult@gordonsalesguru.com`.

Then point Formspree to that address, and update **`NEXT_PUBLIC_EMAIL`** if you ever
change it.

---

## How the project is organised

```
gordonsalesguru/
├── assets/              # CLIENT UPLOADS (git-ignored binaries) — drop files here
│   ├── brochures/       #   PDFs  → auto-extracted on build
│   ├── images/          #   Gordon.* + product/project photos → auto-wired
│   └── videos/          #   raw videos → auto-upscaled on build
├── scripts/
│   ├── extract-brochures.py   # PDF → brand-free WebP, sorted by category
│   └── process-videos.sh      # FFmpeg upscale + poster generation
├── public/
│   ├── media/           # GENERATED & committed: images + videos served at /media/*
│   ├── CNAME, favicon.ico, og-image.jpg, google-site-verification.html, .nojekyll
├── src/
│   ├── app/             # pages: /, /products, /projects, /about, /blog, /blog/[slug], /contact, 404
│   ├── components/      # Nav, Footer, LeadForm, WhatsApp*, Product/Project/Blog cards, etc.
│   ├── content/blog/    # 30 MDX posts (date-gated)
│   └── lib/             # media auto-wiring, posts, SEO/schema, config, data
├── .github/workflows/deploy.yml   # push + daily cron deploy
├── next.config.js  ·  tailwind.config.ts  ·  next-sitemap.config.js
└── .env.local            # your local environment values
```

## How the media auto-wiring works

`src/lib/media.ts` runs at **build time**. It scans `public/media/images/**` (the
brand-free output of the asset scripts) plus any photos you added to
`/assets/images/`, classifies each by filename keyword (see
[section 3](#3-add-product--project-photos)), generates SEO-friendly alt text, and
hands ready-made lists to the Products and Projects pages. Drop in a new image,
rebuild, and it appears — zero code changes.

## How the blog auto-publishes

`src/lib/posts.ts` reads every MDX file and only returns posts whose `publishDate`
is on or before today. `generateStaticParams` builds pages only for published posts,
so a future-dated post genuinely doesn't exist (returns the branded 404) until its
day arrives. The daily GitHub Actions cron rebuild unlocks each day's post and
refreshes the sitemap automatically.

## Environment variables

Set these in `.env.local` for local development, and as **GitHub repository secrets**
(Settings → Secrets and variables → Actions) for the live site.

| Variable                          | Example                                  | Purpose                         |
| --------------------------------- | ---------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`     | `254712345678`                           | All WhatsApp links + alerts     |
| `NEXT_PUBLIC_FORMSPREE_ID`        | `xyzabcd`                                | Lead-form delivery              |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`   | `G-XXXXXXXXXX`                           | Google Analytics 4              |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`   | `1234567890`                             | Facebook Pixel (for ads)        |
| `NEXT_PUBLIC_CALENDLY_URL`        | `https://calendly.com/gordonsalesguru`   | "Book a showroom visit"         |
| `NEXT_PUBLIC_SITE_URL`            | `https://gordonsalesguru.com`            | Canonical URLs + sitemap        |
| `NEXT_PUBLIC_EMAIL`               | `consult@gordonsalesguru.com`            | Contact email shown on site     |
| `NEXT_PUBLIC_BASE_PATH`           | *(empty)*                                | Only for project-page hosting   |

Every variable has a safe default, so the site builds and runs even before they're set.

---

## Notes on content & assets

- **No pricing** appears anywhere on the site, by design.
- **No manufacturer or supplier names** appear anywhere in the code, content, image
  filenames, alt text or the extraction log.
- Raw uploads in `/assets/` are git-ignored (they're large and may be copyrighted);
  the processed, brand-free `/public/media` output is committed so the live site
  always has content.
- Testimonials in `src/lib/data.ts` are placeholders — replace them with real client
  quotes as they come in.

🤖 Built with care for Gordon Odhiambo — *Your Interior Solutions Expert.*
