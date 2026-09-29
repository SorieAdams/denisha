
# Denisha — A Living Memory Book (v2 — Personalized)

Built for Denisha Salamatou Voegli. October 6, 2026.

## Getting started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Create an admin user in **Authentication → Users** in the Supabase dashboard

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase URL, anon key, and service role key.

### 4. Add background audio

Place your track at: `public/audio/background.mp3`

**Audio direction:** Gospel-leaning instrumental — understated, not overtly worship. Think soft piano
or acoustic guitar with a gentle, reverent atmosphere. Something like a quiet arrangement of a
hymn or a gospel-influenced lo-fi instrumental. It should feel like atmosphere, not foreground.

Search terms to find something fitting:
- "gospel instrumental piano peaceful"
- "soft hymn piano background"
- "worship ambient instrumental lo-fi"

### 5. Personalize the closing message

Open `components/experience/ClosingSequence.tsx` and replace the **two middle `<motion.p>` blocks**
with your own words to Denisha. The first and last blocks (about her quiet strength and
"the people in this experience") are ready-to-use but you can adjust them. The `[Write your
personal message...]` placeholder is clearly marked.

### 6. Choose your rhythm line

In `components/experience/OpeningSequence.tsx`, the `RHYTHM_LINE` constant holds three options.
Pick the one that feels most like Denisha to you:

- **A (default):** "Passionate. Focused. Unstoppable when she sets her mind to something."
- **B:** "Faithful. Determined. Someone who turns conviction into action."
- **C:** "Rooted. Relentless. Someone the people around her quietly count on."

Update `RHYTHM_LINE` to your chosen variant, then delete the comment lines.

### 7. Run locally

```bash
npm run dev
```

## Routes

| Route | Audience | Notes |
|-------|----------|-------|
| `/contribute` | Contributors | Share this link before Oct 6 |
| `/admin` | Admin only | Login page |
| `/admin/submissions` | Admin only | Review and curate |
| `/admin/submissions/[id]` | Admin only | Edit individual submission |
| `/` | Denisha | Only share on October 6 |

## Design

- **Background:** Deep black (#050505) with subtle floating gold sparkle particles
- **Accent:** Warm crimson/burgundy (#9b2335) — dividers, labels, active states
- **Typography:** Georgia serif (cream #f5f0e8) body, Inter sans for labels
- **Sunflower motif:** Line-art sunflower SVG in crimson appears in the Milestone interlude, closing sequence, and keepsake PDF
- **Scripture:** Isaiah 60:22 displayed as a standalone epigraph before the Faith chapter
- **Milestone interlude:** A single-screen honoring her PreMeds passage and entry into medicine, between Faith and Campus chapters

## Pre-launch checklist

- [ ] Rhythm line chosen and updated
- [ ] Closing personal message written
- [ ] All submissions reviewed (approved/rejected)
- [ ] Animation styles and display orders set
- [ ] “Preview as Denisha” verified on mobile
- [ ] Background audio in place (`public/audio/background.mp3`)
- [ ] Deployed to Vercel with env vars set
- [ ] `/contribute` link shared with family and friends
- [ ] `/` URL held — shared only with Denisha on October 6

## Deploy

```bash
npx vercel
```

Add your three Supabase env vars in the Vercel project settings.
