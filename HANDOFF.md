# Handoff: yoga.oliwiakonieczna.info (Oliwia Yoga)

Read this first. It is written for whoever picks this project up next, human or AI,
on any account.

## What this is

Oliwia's yoga teaching site. It is the most atmospheric of the family: the owner
explicitly asked for a strong spiritual layer after an earlier version "just looked
like a random yoga page".

- **Live:** https://yoga.oliwiakonieczna.info
- **Repo:** `TinyAnts/oliwia-yoga`, production branch `main`
- **Hosting:** Cloudflare Pages, auto-deploys on push to `main`

## Stack

Vite + React + TypeScript + Tailwind v4, shadcn/ui, Framer Motion.

```
src/pages/Home.tsx   the page, plus the spiritual components
src/i18n.ts          all copy, in four languages
```

```bash
npm install && npm run dev
npm run build     # outputs to dist/
```

Cloudflare build settings: preset **React (Vite)**, command `npm run build`,
output `dist`.

## Four languages

All user-facing copy lives in `src/i18n.ts`, keyed by language. **Any copy change
must be made in all four language objects**, or the site falls back inconsistently
and looks broken to non-English visitors. The keys include the wisdom quotes,
breathing prompts, FAQ, and testimonials.

## The spiritual layer

These custom components carry the site's character. Keep them when refactoring:

- `Mandala` - rotating geometric mandala, used as a section backdrop
- `LotusDivider` - lotus motif that separates sections
- `WisdomBand` - rotating yoga and mindfulness quotes
- `BreathBand` - a circle that expands and contracts as a breathing guide

Animation is deliberately slow and calm here. Fast or bouncy easing is wrong for
this site. Respect `prefers-reduced-motion`.

## Testimonials are placeholders and must stay hidden

```ts
const SHOW_TESTIMONIALS = false;
```

The testimonial text is **invented placeholder content**, kept for layout only. It
must never be shown publicly as if real people said it. To preview it while
developing, append `?demo-testimonials` to the URL, which is the escape hatch built
into the condition. Only flip the constant to `true` once the owner supplies real,
attributed quotes from real students.

The same pattern is used on the `career-copilot-360` site.

## SEO

The repo carries the standard pack used across the family: canonical link,
absolute `og:url` and `og:image`, `og:site_name`, `theme-color`, apple touch icon,
JSON-LD graph, `robots.txt`, `sitemap.xml`, and a branded `404.html`. Cloudflare
Pages serves `404.html` for unknown routes automatically.

## House rules (apply to every site in this family)

These are the owner's standing preferences. Breaking them means redoing work.

1. **Never use em-dashes or en-dashes (the long dash characters) in site copy.**
   The owner considers them a tell that text was written by AI. Use commas,
   colons, semicolons, or the middot separator instead. Check with a search for
   the long dash characters before shipping.
2. **No invented testimonials, reviews, or endorsements presented as real.**
   Placeholder social proof stays behind a flag that is off in production.
3. **Free tiers only.** No paid subscriptions, no Stripe, no payment processors,
   nothing that would require registering a business.
4. **Write like a person.** Short punchy fragments stacked together read as
   machine-written. Prefer plain sentences in the first person.
5. **Preview before shipping.** Build, screenshot, and show the owner a preview.
   The owner reviews visually and gives precise feedback.
6. **Forms and interactive elements must stay accessible** (labels, focus states,
   reduced-motion fallbacks for animations).

## How deployment works

Every site follows the same path:

```
git push  ->  GitHub (TinyAnts/<repo>)  ->  Cloudflare Pages auto-build  ->  live domain
```

Cloudflare Pages watches the production branch of the GitHub repo and rebuilds on
every push. Nothing is uploaded by hand. Cloudflare account id:
`3869409b5f0d6bec2fa88ebf6106b5f1`.

If a push lands on GitHub but the site does not change, the Pages project has lost
its Git connection. Fix it at Cloudflare dashboard -> Workers & Pages -> the project
-> Settings -> Build -> Git repository -> Connect. If the repo is missing from the
dropdown, grant the Cloudflare Pages GitHub App access to it at
github.com/settings/installations. This has happened before on this account.

Custom domains are managed in the Pages project under Custom domains. DNS is
already on Cloudflare nameservers, so adding a subdomain there creates the DNS
record automatically. Give it a few minutes and expect browser/ISP DNS caching to
lag; testing in incognito does not bypass an OS-level DNS cache.

## The other sites in this family

| Repo | Live at | Stack |
|---|---|---|
| `TinyAnts/oliwia-portfolio` | oliwiakonieczna.info | static HTML, no build |
| `TinyAnts/oliwia-from-poland` | poland.oliwiakonieczna.info | Vite + React + TS |
| `TinyAnts/oliwia-yoga` | yoga.oliwiakonieczna.info | Vite + React + TS |
| `TinyAnts/career-copilot-360` | aivet.work | Vite + React + TS |
| `TinyAnts/raj-portfolio` | raj.aivet.work | Vite + React + TS |
