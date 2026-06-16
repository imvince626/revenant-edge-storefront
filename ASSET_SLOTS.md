# Revenant Edge Homepage Asset Manifest

Document all image/video slots needed for the homepage rebuild. Each slot specifies the filename to place in `public/home/`, usage context, recommended dimensions, and current asset status.

---

## HERO Section (Full-Bleed)

### Video Asset
- **filename:** `hero-loop.mp4` (or .webm/.mov)
- **section:** Hero banner
- **use:** Background loop, no audio. Should showcase brand essence: dark, anime-inspired, streetwear intensity.
- **dimensions:** 1920x1080 (16:9 landscape, optimized for mobile fallback to 1080x1920 portrait)
- **orientation:** Landscape (primary), portrait fallback
- **current_status:** Already exists (referenced in component)
- **notes:** Mute, loop-ready, 5-15 sec loop recommended

---

## Editorial Banners

### Banner 1: Set Your Heart Ablaze
- **filename:** `banner-demon-slayer.jpg`
- **section:** Editorial banner (section 3)
- **use:** Full-width hero for Demon Slayer collection promo
- **dimensions:** 1920x1080 (16:9 landscape) or 2560x1440 (16:9 wide)
- **aspect_ratio:** 16:9 landscape
- **orientation:** Landscape
- **current_status:** REAL ASSET EXISTS
- **source_url:** `https://cdn.shopify.com/s/files/1/0868/5787/5739/collections/RE_Tee_BLACK_KyojuroRengoku_BACK.jpg?v=1774927544`
- **notes:** Kyojuro Rengoku tee product shot. High contrast, anime aesthetic.

### Banner 2: Children of the Sea
- **filename:** `banner-children-of-the-sea.jpg`
- **section:** Editorial banner (section 5)
- **use:** Full-width hero for Children of the Sea collection promo
- **dimensions:** 1920x1080 (16:9 landscape) or 2560x1440 (16:9 wide)
- **aspect_ratio:** 16:9 landscape
- **orientation:** Landscape
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Should evoke ocean/water aesthetic. Product-focused or lifestyle shot acceptable.

### Banner 3: Cursed Collection
- **filename:** `banner-cursed-collection.jpg`
- **section:** Editorial banner (section 8)
- **use:** Full-width hero for Cursed Collection promo
- **dimensions:** 1920x1080 (16:9 landscape) or 2560x1440 (16:9 wide)
- **aspect_ratio:** 16:9 landscape
- **orientation:** Landscape
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Dark, intense aesthetic. Align with brand's anime-inspired tone.

---

## Category Grid Tiles (2x2)

### Tile 1: Tees
- **filename:** `grid-tees.jpg`
- **section:** Category grid (section 7, position 1)
- **use:** Clickable tile linking to tees collection
- **dimensions:** 600x750 (4:5 portrait)
- **aspect_ratio:** 4:5 portrait
- **orientation:** Portrait
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Hero tee product shot, front-facing preferred. High contrast graphic.

### Tile 2: Hoodies
- **filename:** `grid-hoodies.jpg`
- **section:** Category grid (section 7, position 2)
- **use:** Clickable tile linking to hoodies collection
- **dimensions:** 600x750 (4:5 portrait)
- **aspect_ratio:** 4:5 portrait
- **orientation:** Portrait
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Premium hoodie product shot, styled or lifestyle context OK.

### Tile 3: Children of the Sea
- **filename:** `grid-children-of-the-sea.jpg`
- **section:** Category grid (section 7, position 3)
- **use:** Clickable tile linking to collection
- **dimensions:** 600x750 (4:5 portrait)
- **aspect_ratio:** 4:5 portrait
- **orientation:** Portrait
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Signature piece from the collection. Product-focused.

### Tile 4: Exploring the Borderline
- **filename:** `grid-borderline.jpg`
- **section:** Category grid (section 7, position 4)
- **use:** Clickable tile linking to borderline collection
- **dimensions:** 600x750 (4:5 portrait)
- **aspect_ratio:** 4:5 portrait
- **orientation:** Portrait
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Rare/exclusive aesthetic. Product shot or flat-lay artistic.

---

## Split Banner (2 Tiles)

### Split Tile 1: Hoodies
- **filename:** `split-hoodies.jpg`
- **section:** Split banner (section 10, left)
- **use:** Half-width promo tile for hoodies
- **dimensions:** 960x1080 (4:5 portrait) or 1080x960 (adaptive)
- **aspect_ratio:** 4:5 portrait
- **orientation:** Portrait
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Can reuse or adapt grid-hoodies.jpg if photography is identical.

### Split Tile 2: Tees
- **filename:** `split-tees.jpg`
- **section:** Split banner (section 10, right)
- **use:** Half-width promo tile for tees
- **dimensions:** 960x1080 (4:5 portrait) or 1080x960 (adaptive)
- **aspect_ratio:** 4:5 portrait
- **orientation:** Portrait
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Can reuse or adapt grid-tees.jpg if photography is identical.

---

## Collections Menu Background

### Menu Background
- **filename:** `bg-collections-menu.jpg`
- **section:** Collections menu (section 11)
- **use:** Subtle background behind stacked collection links
- **dimensions:** 1200x800 (3:2 landscape) or full-bleed adaptive
- **aspect_ratio:** 16:9 or 3:2 landscape, or full-bleed 21:9
- **orientation:** Landscape
- **current_status:** PLACEHOLDER (needs real asset)
- **source_url:** None
- **notes:** Atmosphere shot. Dark, moody. Text will overlay, so ensure sufficient contrast for legibility. Can be a lifestyle shot or abstract brand asset.

---

## Summary

**Total Slots:** 12
- **Real Assets Ready:** 1 (Set Your Heart Ablaze banner)
- **Placeholders (Need Assets):** 11
  - 2 Editorial banners (Children of the Sea, Cursed Collection)
  - 4 Category grid tiles
  - 2 Split banner tiles
  - 1 Collections menu background
  - (Hero video already exists)

**Recommended Shoot Checklist:**
- [ ] Children of the Sea collection hero banner (16:9 landscape)
- [ ] Cursed Collection hero banner (16:9 landscape)
- [ ] Tees category tile (4:5 portrait)
- [ ] Hoodies category tile (4:5 portrait)
- [ ] Children of the Sea category tile (4:5 portrait)
- [ ] Borderline collection category tile (4:5 portrait)
- [ ] Collections menu background (3:2 or 16:9 landscape, dark/moody)
- (Reuse tees/hoodies tiles for split banner if dimensions match)

**File Placement:** All images placed in `public/home/` will be served at `/home/<filename>` in the Astro app.
