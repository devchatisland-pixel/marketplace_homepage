# NeonArch — Cyberpunk Luxury Media Catalog & Studio Marketplace

An ultra-modern, cinematic photo catalog and media marketplace inspired by Netflix's fluid browsing experience, tailored for fine-art and lifestyle feet photography. Featuring glowing glassmorphic decor, dynamic ambient lighting, horizontal studio and category carousels, expandable hover preview cards, and synthesized audio micro-interactions.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification and govern the product's aesthetic and interaction architecture:
> - **Visual Atmosphere**: Cyberpunk neon luxury with glowing glass, deep obsidian surfaces, and dynamic ambient lighting responding to media focus.
> - **Browsing Model**: Netflix-style cinematic hero billboard accompanied by horizontal carousels for studios, trending series, and specialized aesthetic categories.
> - **Interactive Decor & Effects**: Netflix-style expanding hover cards with neon borders, smooth scale transforms, synthesized Web Audio whooshes/chimes, and an interactive full-screen media inspection theater.

- **Confirmed Decision 1**: Implemented as a high-fidelity client-side catalog with local state persistence (cart, wishlist, creator tips, unlocks) and synthesized Web Audio effects (toggleable sound master switch).
- **Confirmed Decision 2**: Zero external fragile image dependencies; high-aesthetic curated media and generated photography assets with resilient styled SVG/CSS fallbacks.

---

## 1. Overview & Core Concept

**NeonArch** is an avant-garde digital catalog and creator marketplace celebrating sculptural and aesthetic feet photography. Designed for art collectors, digital creators, footwear designers, and connoisseurs of visual ergonomics, the application fuses high-fashion gallery curation with Netflix's frictionless browsing mechanics.

- **Featured Studios & Independents**: Curated creator storefronts (e.g. *Atelier Sole*, *Studio Velveteen*, *NeonArch Visuals*, *Lumière Pedis*, *BareFootage Lab*) alongside verified independent photographers (*Elena Voss*, *Aria Noir*, *Kyoto Soles*, *Camille Laurent*).
- **Rich Thematic Taxonomy**: Categorized into high-concept collections: *High Heels & Architectural Arches*, *Silk & Lace Boudoir*, *Sunlit Beach & Water Droplets*, *Streetwear & Sneaker Peeks*, *Sculptural Monochrome*, and *Tattooed & Golden Adornments*.
- **Sensory Interaction & Decor**: Cursor-tracked spotlight illumination, ambient chromatic backdrops that morph with selected media, floating glassmorphic panels, and optional sound-reactive haptics.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Cinematic Hero Entry**:
   - The user arrives at an immersive full-bleed billboard showcasing the headline release of the day (e.g. *"Obsidian Stiletto & Concrete: Nocturne Vol. 1"* by Atelier Sole).
   - Instant controls: **Explore Set**, **Preview Reel**, **Add to Wishlist**, and **Mute/Unmute Ambient Audio**.
2. **Horizontal Studio & Category Carousels**:
   - Smooth horizontal pagination with touch swipe, wheel scroll, and arrow controllers.
   - Distinct carousel rows: *Trending Now*, *Featured Studios*, *Architectural Arches*, *Independent Creators Spotlight*, and *4K HDR Master Sets*.
3. **Netflix-Style Expandable Hover Cards**:
   - Lingering on a card smoothly scales it up ($1.25\times$), elevating it above adjacent items with an ambient neon glow.
   - Displays animated photo sequence preview, set resolution (`4K UHD`), photo count (`18 Photos`), studio verified seal, and quick-action icons (Play preview, Save, Quick Buy).
4. **Cinematic Media Inspection Modal (Theater Mode)**:
   - Clicking any set opens an immersive glass modal with full-screen zoom inspection, EXIF camera details, multi-angle gallery reel, creator biography, license tier selection (*Personal*, *Commercial*, *Exclusive Raw*), and direct cart addition.
5. **Interactive Marketplace & Studio Storefronts**:
   - Ability to filter by specific Studio, view creator stats (sales, rating, subscriber count), leave creator tips, and preview studio reels.
6. **Cart, Collection & Audio Bar**:
   - Slide-over luxury checkout drawer with instant purchase simulation, digital download delivery, and persistent collection library.

### Visual Identity & Theme

- **Aesthetic Direction**: Cyberpunk Neon Luxury. Precision obsidian glass (`#0A0A0F`), deep indigo shadows (`#050508`), holographic hairline borders, and radiant accents in electric cyan (`#06B6D4`), magenta violet (`#D946EF`), and warm gold (`#F59E0B`).
- **Color Palette & Mood**:
  - Canvas: Deep obsidian space (`#07070B` / `#0C0C14`)
  - Glass Surfaces: `rgba(18, 18, 28, 0.75)` with `backdrop-blur-xl` and `border border-white/10`
  - Neon Accents: Cyan laser (`#00F0FF`), Neon Rose (`#FF007F`), Amber Gold (`#FFB800`)
- **Typography & Scale**:
  - Headings: `Plus Jakarta Sans` / `Outfit` (tight geometric, tracking `-0.02em`, `text-wrap: balance`)
  - Body & Metadata: Clean sans paired with `tabular-nums` for prices and photo counts
  - Zero-Pill Rule: Metadata presented as clean unboxed text separated by typographic middots (`·`).
- **Decor & Ambient Effects**:
  - Ambient color halo dynamically shifting based on the active hero or hovered photo palette.
  - Interactive cursor spotlight following the user's mouse across the catalog grid.
  - Perspective floor grid decor with subtle parallax depth.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Trade-Offs |
| :--- | :--- | :--- |
| **Hover Expansion Model** | Absolute portal/scaled transform with debounce | Prevents layout thrashing; cards expand seamlessly beyond carousel bounds without pushing surrounding elements. |
| **Sound Synthesis Engine** | Web Audio API oscillator synthesizer | Zero external audio asset network latency; provides bespoke high-tech clicks, whooshes, and subtle chord chimes with an explicit global mute button. |
| **Media Asset Strategy** | Curated high-aesthetic studio collections with high-resolution imagery and CSS-art fallbacks | Guarantees instant rendering, zero broken links, and fast load times even in hermetic environments. |
| **Commerce & Unlocks** | Client-side reactive store with localStorage persistence | Allows instant cart additions, wishlist bookmarking, tip-jar microtransactions, and realistic digital license order confirmations. |

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Top Bar (Brand / Nav / Cart)                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │        Ambient Decor Engine (Cursor Spotlight, Ambient Glow)      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │      Cinematic Hero Billboard (Headline Media, Video/Reel UI)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │    Filter Bar (Studios, Categories, Independent Creators, Price) │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Netflix Carousel Rows                        │  │
│  │   - Trending Today                                               │  │
│  │   - Studios Showcase (Atelier Sole, Velveteen, etc.)             │  │
│  │   - High Heels & Architectural Arches                            │  │
│  │   - Silk & Boudoir Sessions                                      │  │
│  │   - Independent Creator Spotlights                               │  │
│  │   - Fine Art Monochrome & Sculptural                             │  │
│  │   ┌──────────────────────────────────────────────────────────┐   │  │
│  │   │  Hover Card (Expandable, Neon Glow, Audio Chime, Preview)│   │  │
│  │   └──────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │     Interactive Modals: Media Theater / Studio Detail / Cart     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Entities & State Mapping

- **`PhotoSet`**: id, title, subtitle, studioId, creatorName, studioName, coverUrl, galleryUrls, category, tags, price, resolution, photoCount, rating, reviewCount, description, exifDetails.
- **`Studio`**: id, name, avatarUrl, bannerUrl, bio, verified, followerCount, setIds, aestheticTag.
- **`CartState`**: itemized photo sets, selected license tier (*Personal*, *Commercial*, *Exclusive*), subtotal.
- **`WishlistState`**: saved set IDs with instant toggle.
- **`AudioEngine`**: synthesized browser audio triggering subtle hover blips, expansion whooshes, modal open chimes, and toggleable ambient beat.

---

## 5. Verification & Execution Steps

1. **Phase 1: Project Metadata & Styling Foundation**:
   - Update `metadata.json` and `index.html` with distinctive brand title (`NeonArch // Luxury Media Catalog & Studio Showcase`).
   - Configure Tailwind and glassmorphic glowing styles.
2. **Phase 2: Comprehensive Mock & Media Data Repository**:
   - Build rich studio and photo sets data structures with curated high-resolution photography themes, creator bios, and category taxonomies.
3. **Phase 3: Interactive Components**:
   - Implement `HeroBillboard`, `CarouselRow`, `ExpandableCard`, `MediaTheaterModal`, `StudioStorefrontModal`, `CartDrawer`, and `SoundEngine`.
4. **Phase 4: Ambient Decor & Interactive Polish**:
   - Cursor spotlight tracking, dynamic backdrop color morphing, audio feedback, keyboard navigation (`ESC` to close modals, arrow carousel paging).
5. **Phase 5: Verification**:
   - Run compilation checks (`compile_applet`) and verify responsive layout across all viewport breakpoints.
