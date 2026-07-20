## MGM Junior Tour — Frontend Build Plan

Full frontend build using the selected **Athletic Heritage** direction (navy #002147 + gold #c5a880, Inter body / Outfit display). No backend wiring — all data lives in mock files ready for later Supabase hookup.

### Design system (src/styles.css)
- Add tokens: `--navy: #002147`, `--navy-light: #003366`, `--gold: #c5a880`, `--slate-50` background, semantic mappings for primary/accent.
- Register Outfit + Inter via `<link>` in `__root.tsx` head; expose as `--font-display` / `--font-sans` in `@theme`.
- Update `__root.tsx` head with real MGM meta (title/description/og/twitter).

### Shared layout
- `src/components/site/Header.tsx` — sticky navy nav, gold circular MGM mark, uppercase links, gold "Join Tour" pill.
- `src/components/site/Footer.tsx` — 4-column footer matching prototype.
- `src/components/site/MinimalLayout.tsx` — trimmed chrome wrapper used only by `/join`.
- Standard pages get Header + Outlet + Footer via a pathless `_site` layout route.

### Routes (all under `src/routes/`)
```text
__root.tsx                (updated head + shell)
_site.tsx                 (Header + <Outlet/> + Footer)
_site.index.tsx           (Home)
_site.about.tsx
_site.packages.tsx
_site.schedule.tsx
_site.photos.tsx
_site.archive.tsx
_site.contact.tsx
tournament.$slug.tsx      (uses _site layout too — actually _site.tournament.$slug.tsx)
join.tsx                  (minimal chrome, mobile-first)
admin.archive.tsx         (minimal chrome, admin form)
```

### Mock data (`src/data/`)
- `mockPackages.ts` — 4 packages (Deluxe/Standard/Starter/Jr. Tour Club) with price, image, callout, features, slug.
- `mockSchedule.ts` — month-grouped rows (July–Oct+): `{ id, slug, dates, city, time, course, month, year }`. Some TBD, some real (Eagle Trace, Glen Erin, Hayward, Big Fish, etc.).
- `mockTournaments.ts` — keyed by slug, 3 fully filled entries (Coral Springs/Eagle Trace, Janesville/Glen Erin, Hayward/Big Fish). Shape:
  ```ts
  { slug, name, city, course, address, heroImage, description,
    dates, teeTime, earlyDeadline,
    eligibility: { boys, girls, notes },
    pricing: [{ period, memberPrice, nonMemberPrice }],
    contactPhone, contactEmail }
  ```
  Rows missing full data fall back to a generic "details coming soon" template.
- `mockArchive.ts` — 6–8 past tournaments: `{ id, tournament_name, date, location, year, month, images: [url] }`.
- `mockAbout.ts` — pillar cards + recent locations image row.
- `mockGallery.ts` — photo URLs + YouTube embed IDs.

### Pages

**Home (`/`)** — full-bleed navy hero ("Empowering Young Minds"), intro block, "Beyond the Green" 3-card teaser, CTA row (View Schedule / Join Tour), package preview strip.

**About (`/about`)** — intro section, program feature bullets, 3-pillar cards (Total Game Growth / A Place To Belong / Skills For Life), tournament-locations image row.

**Packages (`/packages`)** — 4 pricing cards from `mockPackages`. Standard card lifted (`-translate-y-4`) as in prototype. Each "Learn More" links to `/packages/[slug]` placeholder (route stub or `#` for now — will use `#` and note TODO).

**Schedule (`/schedule`)** — `<ScheduleTable data={mockSchedule}/>` component: month-grouped tables (navy header block, gold "Sign Up Here" links) linking to `/tournament/$slug`.

**Tournament detail (`/tournament/$slug`)** — hero banner image with overlay title + "[City] at [Course]" subtitle, intro paragraph, blocks for Dates & Tee Times, Eligibility, Early Deadline, Location, Pricing table (Period / Members / Non-Members), footer contact note. Uses `notFoundComponent` for unknown slugs.

**Photos & Videos (`/photos`)** — photo carousel (embla-carousel already available via shadcn) + video embed grid.

**Results Archive (`/archive`)** — filter controls (year select, month select), grid of tournament cards with thumbnail strip. Clicking a thumbnail opens a shadcn Dialog with full-size image. Filters operate on local mock array.

**Admin Archive (`/admin/archive`)** — form: tournament name, date, location, multi-file input (drag/drop style from prototype). Submissions append to local `useState` list shown below the form. No auth for now.

**Contact (`/contact`)** — info cards (phone/email/address), "Get In Touch" form (name/phone/subject/message), sonner success toast on submit.

**Join (`/join`)** — mobile-first minimal-chrome page: small MGM wordmark header, single-column form (Full Name, Email, State dropdown with all 50 states, Junior Golfer Ages text field), submit swaps form for centered thank-you message via local state.

### Form handlers (`src/lib/handlers/`)
Isolated stub functions returning Promises for easy swap later:
- `handleJoinSubmit(data)`
- `handleContactSubmit(data)`
- `handleArchiveUpload(data)`

Each logs to console + resolves; components await and show toast/thank-you.

### Verification
After build, run through routes with a Playwright script + screenshots to confirm hero, packages, schedule table, one tournament page, archive filters, and /join all render correctly at desktop and mobile viewports.

### Explicitly out of scope
- Supabase / real auth / real uploads / real API calls
- `/packages/[slug]` detail pages (buttons link to `#` placeholder)
- Real content copy edits beyond what's in the current site
