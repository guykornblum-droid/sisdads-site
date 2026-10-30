# sisdads.com Handoff for Claude Code

Prepared Oct 30, 2026 by Perplexity Computer, which built and ran the site until now.
Scope: sisdads.com (SIS Bulldog Dads) only. Anything shared with the owner's other website is marked **SHARED** and the other site is not described.
No secret values are included. Credentials are listed by name and location only.

Verified live on Oct 30, 2026: GitHub Pages config (via `gh api`), DNS (via Google Public DNS), repo HEAD `a2f0182`.

---

## 1. OVERVIEW

| Item | Value |
|---|---|
| Site name | SIS Bulldog Dads (full name: St. Isidore Bulldog Dads Club) |
| Live domains | `https://sisdads.com` (apex, matches the `CNAME` file) and `https://www.sisdads.com` (CNAME to GitHub Pages; the TLS cert covers both). Emails and Mailchimp use `www.sisdads.com` as the public URL. |
| Purpose | Website for the fathers' club at St. Isidore Catholic School, Danville, CA. Covers events (upcoming and past), the annual SIS Golf Classic fundraiser (sponsor tiers, presenting sponsor, recap, photo album), the event photo gallery, the committee, the contact form, the Mailchimp signup and links to the Square store and ticket pages. |
| Owner | Guy Kornblum, club founder and president |
| GitHub repo | `guykornblum-droid/sisdads-site` (public), created 2026-03-26 |
| GitHub account | `guykornblum-droid`. **SHARED**: this account also hosts the owner's other website repo. Only touch `sisdads-site`. |
| Default branch | `master` |
| Other branches | None |
| Framework | None. Hand-written static site. |
| Language | HTML5, CSS3, vanilla JavaScript (one IIFE in `app.js`) |
| Database | None |
| ORM | None |
| Styling | Plain CSS. `base.css` (reset, `prefers-reduced-motion`) and `style.css` (design tokens + all components, ~2,350+ lines; newer sections were appended at the bottom). Google Fonts: Cormorant Garamond (display) + Work Sans (body). |
| Build tool | None. No `package.json`, no bundler, no CI build. Files are served as-is. |

### Repo layout (root)

```
CNAME                      # "sisdads.com". Do not delete or GitHub Pages drops the custom domain.
_config.yml                # Keeps CLAUDE.md off the live site (exclude list). Keep it. Add any other private docs here.
CLAUDE.md                  # This handoff. In the repo only, not served at sisdads.com.
index.html                 # The whole main site, one page with anchors
golf-2026.html             # 2026 Golf Classic photo album page (generated, then hand-edited)
app.js                     # All JS: theme toggle, nav, scroll reveal, popup, gallery filters, lightbox, contact form
style.css                  # Design tokens + components
base.css                   # Reset + reduced-motion
privacy-policy.html        # Privacy policy (email only; SMS language removed Oct 30, 2026)
terms-and-conditions.html  # Mailing list terms (email only; SMS language removed Oct 30, 2026)
tools/build_album.py       # Album page builder (see runbook 6.5)
email-preview.html         # Old reference email template ("Corrected Link, TLEg 2 Tickets"). Not linked from the site.
assets/                    # All images (see section 5)
```

### index.html anchors (in page order)

`#header` (nav) → `#mobile-nav` → `#home` (hero + presenting sponsor card) → navy stats bar (no id) → `#events-preview` ("Recent Events", 3 cards) → `#golf-classic` (presenting banner, golf hero recap, sponsorship tiers, More Ways to Partner, 2025 Sponsor Recognition wall, Tournament Growth, 2026 Tournament Highlights) → `#events` (Upcoming placeholder + Past Events grid) → `#photos` (filterable Event Photos gallery, `#events-gallery`) → `#about` (About + Our Committee) → `#contact` (contact info + `#contact-form`) → footer → `#subscribe-popup` → lightbox.

### Commit history (newest first, 17 commits)

```
a2f0182 2025 Golf Classic total corrected to $109K; total $350K+
f89ce8f Stat label wording
75b4587 2026 Golf Classic raised $114K: stats bar, golf hero, growth, recap cards, album
8aad8ce FormSubmit activation handling
eb5dc0b Working contact form; Kickoff moved to past; footer album link
4c21610 Single-event layout
bbc82cd Golf album and highlights
ad0339f Transparent golf logo for email
cf4b6e1 Square link fix
d5b81a0 Back to School Kickoff and Upcoming/Past reorg
a14b09b Mobile nav fix
138c7c6 / f204ca9 / e07f53d  Ken Kearns credits
ff0dcaa BNY Wealth logo
8ad9652 BNY presenting sponsor; Silver sold out
582f8da Platinum/Gold/VIP sold out
```
(Messages above are paraphrased from `git log --oneline`. Run it for the exact text.)

---

## 2. HOSTING AND DEPLOYMENT

| Item | Value |
|---|---|
| Host | GitHub Pages |
| Project/service | Repo `guykornblum-droid/sisdads-site`, Pages site `https://sisdads.com/` |
| Pages build type | `legacy` (branch deploy, no custom Actions workflow). The only workflow is GitHub's built-in `pages-build-deployment`. |
| Source | Branch `master`, path `/` |
| Custom domain | `sisdads.com` (from `CNAME`) |
| HTTPS | Enforced. Cert approved for `sisdads.com` + `www.sisdads.com`, expires 2026-12-22 (GitHub auto-renews). |
| Custom 404 | None |
| Environments | One: production. No staging, no preview deploys. |
| Railway / Vercel / Netlify | Not used |
| Postgres / any DB | Not used |
| Webhooks | None |

### How deploy is triggered
`git push origin master`. GitHub Pages rebuilds automatically. Usually live in 60–90 seconds. Check status:
```bash
gh api "repos/guykornblum-droid/sisdads-site/pages/builds?per_page=3" --jq '.[]|.status+" "+.created_at'
```

### Build and start commands
None. Nothing to install, build or start. To preview locally:
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

### Verification after every push
```bash
# 1. Cache-busted check that the new text is live
curl -s "https://sisdads.com/?v=$RANDOM" | grep -n "TEXT YOU CHANGED"
# 2. Visual check, desktop 1280x900 and mobile 390x844 (Playwright, chromium headless)
```
Check the hero, the stats bar, the changed section, the mobile nav drawer and the footer on both sizes.

### Known deploy problems and fixes
1. **Mobile nav drawer only 64px tall** (fixed in `a14b09b`). The `.mobile-nav` drawer inherited the header height. The fix is in `style.css` around line 329. If you restyle the header, re-check the drawer at 390px.
2. **Square links broke checkout** (fixed in `cf4b6e1`). Links copied from Square's editor carried preview query params. Always use the clean public URL, e.g. `https://sis-bulldog-dads-club.square.site/product/<slug>/<ITEMID>` with no query string.
3. **Browser/CDN caching.** GitHub Pages caches for about 10 minutes. Use `?v=$RANDOM` when verifying. Users may need a hard refresh.
4. **Contact form "activation" response** (handled in `8aad8ce`). The first FormSubmit POST to a new address returns an activation message instead of success. `app.js` treats it as a soft success. Activation is done (see section 8).
5. **Repo weight.** `assets/` is ~103 MB and `.git` is ~102 MB, mostly the golf album (153 JPEGs, ~83 MB). Pushes are slow but fine. GitHub's soft repo limit is 1 GB. Do not add full-res originals.

---

## 3. DOMAINS, DNS, EMAIL

### Registrar and DNS
- **Registrar:** most likely Hover (nameservers are Hover, and so is the mailbox). Confirm in the Hover account. Login lives with Guy.
- **DNS provider:** Hover (`ns1.hover.com`, `ns2.hover.com`)
- **Current public records (verified Oct 30, 2026):**

| Name | Type | Value |
|---|---|---|
| `sisdads.com` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages) |
| `www.sisdads.com` | CNAME | `guykornblum-droid.github.io.` |
| `sisdads.com` | MX | `10 mx.hover.com.cust.b.hostedemail.com.` |
| `sisdads.com` | TXT | **None.** No SPF, no DMARC, and no domain verification TXT. |

- **Records changed by Perplexity Computer:** none. DNS has always been managed by Guy directly in Hover.

### Redirects and short links
- None. No redirect files, no `_redirects`, no meta-refresh pages, no short-link service.
- `www` → apex handling is done by GitHub Pages automatically.

### Email sending and capture
1. **Mailbox `info@sisdads.com`**: Hover-hosted email. It is not in Guy's Gmail. Whether it forwards anywhere is unknown (see Gaps). All mailto links and the contact form go here.
2. **Contact form** (`#contact-form` in `index.html`, ~line 1032). Uses FormSubmit.
   - HTML fallback: `action="https://formsubmit.co/info@sisdads.com" method="POST"`.
   - JS path (`app.js`, ~line 400): `fetch('https://formsubmit.co/ajax/info@sisdads.com', …)` with a JSON body.
   - Fields: `name`, `email`, `topic` (input `id="subject"`), `message`. Hidden: `_subject`, `_template=table`, `_captcha=false`, honeypot `_honey`.
   - Status messages render in `#contact-status`. On a network failure it shows a mailto fallback.
   - Activated Oct 23, 2026 by Guy clicking FormSubmit's activation email. No FormSubmit account or API key.
3. **Mailchimp signup popup** (`#subscribe-popup`, end of `index.html`).
   - Form action: `https://sisdads.us18.list-manage.com/subscribe/post?u=a8eb6c9b540accc6eb2f17fc1&id=6f0f396694` (public embed IDs, not secrets).
   - Audience: "St Isidore Bulldog Dads" (list `6f0f396694`, datacenter `us18`, ~203+ members). Default from-name "Guy", from guy.kornblum@gmail.com.
   - Shows automatically after 8 seconds (`setTimeout(showPopup, 8000)` in `app.js`). Dismissal is stored in localStorage key `sisdads_popup_dismissed`, suppressed for `POPUP_DISMISS_DAYS = 7`.
   - Any element with `data-open-subscribe` opens it (e.g., the "Join the Mailing List" button in `#events`).
4. **Outbound campaigns** are sent from Mailchimp, not from the site. `assets/email/sis-golf-classic-logo.png` (transparent) is hosted on the site for use in emails.

---

## 4. ENVIRONMENT VARIABLES AND CREDENTIALS

### Environment variables
**None.** No `.env`, no Railway/host variables, no GitHub Actions secrets, and no API keys in the repo. Everything in the HTML is public by design (Mailchimp embed IDs, FormSubmit address, Square URLs).

### Third-party accounts the site depends on

| Account | Used for | Where the login lives | Notes |
|---|---|---|---|
| GitHub `guykornblum-droid` | Repo + Pages hosting | Guy | **SHARED** with the other website. Claude Code needs push access to `sisdads-site`. |
| Hover | Domain registration (probable), DNS, `info@sisdads.com` mailbox | Guy (Hover dashboard) | Only DNS host. Mailbox password is in Hover. |
| Mailchimp (us18) | Email list + signup popup + campaigns | Guy (Mailchimp dashboard) | Audience `6f0f396694` |
| FormSubmit | Contact form delivery | No account. Tied to the `info@sisdads.com` activation. | Optional: switch to a FormSubmit random alias so the address isn't in the HTML. |
| Square Online | Store + event tickets: `https://sis-bulldog-dads-club.square.site/s/shop` | Guy (Square dashboard) | Product IDs are in the URLs |
| Google Fonts | Fonts | No account | |
| Google Drive (guy.kornblum@gmail.com) | Source photo originals, e.g. folder "SIS Golf 2026", id `13C-uFpu6U_UgtNM_yZnqAXgY0E3MJmmj` | Guy | **SHARED** personal Google account. Read-only use. |
| iCloud | Photographer's original shared album "SIS Golf 2026" | Guy | Not linked from the site |
| Google Analytics | Not installed | n/a | A connection exists on the Perplexity side but was never wired to the site |

---

## 5. CONTENT AND ASSETS

### Where content lives
- All copy is hard-coded in `index.html` and `golf-2026.html`. No CMS, no JSON data files, no markdown content.
- Compliance copy: `privacy-policy.html`, `terms-and-conditions.html`.
- The brand reference lives outside the repo in the Perplexity project files: `brand/brand-package.md` (voice, colors, type, components, tier states). Its stats line is out of date (it still says `$250K+` and `$125K 2026 Goal`). Trust the live site over that file.

### Where images and downloads are stored and linked
All files live under `assets/` and are linked with relative paths (`./assets/...`). There are no PDFs or downloads on the site.

```
assets/
  bulldog-dads-logo.png, bulldog-dads-logo-sm.png   # club logo (never recolor)
  back-to-school-kickoff.jpg                         # Kickoff past-event card
  camping-event.jpg, dinner-event.jpg                # event cards
  golf-detail.jpg                                    # golf section imagery
  golf-hero.jpg                                      # HOME PAGE HERO background (index.html ~line 72). In use, do not delete.
  golf-classic-brochure-1.jpg, -2.jpg                # sponsor brochure pages
  tleg-dinner-menu.jpg                               # legacy TLEg menu art (unused)
  email/sis-golf-classic-logo.png                    # transparent logo for Mailchimp emails
  sponsors/bny-logo.png                              # BNY Wealth horizontal lockup (official file from BNY)
  sponsors/presenting-sponsor-tile-stacked.png       # Presenting tile with "Ken Kearns / Senior Director, BNY Wealth"
  gallery/*.jpg                                      # older golf gallery (course-view, foursome-*, social-group)
  events-gallery/event-01.jpg … event-50.jpg         # #photos gallery images
  golf-2026/full/golf-2026-001.jpg … -153.jpg        # album full size: 2000px long edge, JPEG q78, ~450 KB
  golf-2026/thumbs/golf-2026-001.jpg … -153.jpg      # album thumbs: 640px, JPEG q72
```

### Naming and numbering conventions
- **Event gallery:** `assets/events-gallery/event-NN.jpg`, two digits, sequential. The next is `event-51.jpg`. Each `<div class="gallery__item" data-category="...">` must use one of the filter values `golf`, `social`, `bowling`, `camping`, `tleg` (current counts: 17, 10, 3, 7, 19). New categories need a matching `data-filter` button in `#gallery-filters`.
- **Album photos:** `assets/<event>-<year>/full|thumbs/<event>-<year>-NNN.jpg`, three digits, numbered in sorted order of the original filenames after removing md5-exact duplicates. The same number in `full/` and `thumbs/` is the same photo. Guests request originals by photo number.
- **Lightbox:** works on `.gallery .gallery__item:not(.hidden) img`. It loads `img.dataset.full || img.currentSrc || img.src`, so put the thumb in `src` and the full image in `data-full`. Has a counter (`#lightbox-counter`), arrow keys, Esc and swipe.
- **2026 highlights** (in `#golf-classic`, "2026 Tournament Highlights"): golf-2026-037, 053, 149, 127, 124, 100, 071, 043, 132, 140, 150, 153. The golf hero background is golf-2026-146. The album og:image is 037.
- **Hosting rule:** web versions only. Never commit full-resolution originals. Originals stay in Google Drive and iCloud.
- **Sponsor names:** always "BNY Wealth" (never "BNY Mellon" or "Bank of New York"), with the same logo file everywhere. Logo alt text is the plain sponsor name, e.g. `alt="BNY Wealth"`.
- **Brand assets outside the repo** (Perplexity project files): `brand/social/presenting-sponsor-tile-stacked.png`, `brand/social/presenting-sponsor-tile-inline.png`, `brand/social/reel-bny-wealth-presenting-1080x1920.png`, `brand/logos/bny/`, `brand/events/back-to-school-kickoff-badge.jpeg`, plus `campaigns/` and `flyers/`.

---

## 6. RECURRING WORKFLOWS

Ground rules for every runbook:
- Run `git pull` first. Edit on `master`. One logical change per commit.
- **Commit message format:** a plain sentence in the imperative or descriptive voice, optionally prefixed `Area: `. No conventional-commit prefixes. Examples from history: `Working contact form; Kickoff moved to past; footer album link`, `2025 Golf Classic total corrected to $109K; total $350K+`.
- After pushing, verify as described in section 2 (curl with cache-bust, then desktop + mobile screenshots).
- Write copy in Guy's voice (section 10). No em dashes in new copy.
- Ask Guy before big creative changes. He reviews highlight picks, captions and new sections.
- This site has no products, card launches, reel URLs or affiliate items. Those workflows don't apply here (they belong to the other site). The closest equivalents are Square event tickets and sponsor tiers, covered below.

### 6.1 Add an upcoming event
Trigger: Guy announces a new event (date, venue, price, Square link).
1. Square: Guy creates the product. Get the clean URL `https://sis-bulldog-dads-club.square.site/product/<slug>/<ITEMID>` (no query params).
2. `assets/`: add the event image, e.g. `assets/<event-slug>.jpg` (~1200px, JPEG q80).
3. `index.html` → `#events`: replace the `.events-next` placeholder block (~line 584) with an upcoming event card. Use the single-event layout from `4c21610` as the template (`git show 4c21610 -- index.html`). Include the date eyebrow, title, venue, short body and a `.btn.btn--primary` ticket CTA (`target="_blank" rel="noopener noreferrer"`).
4. `index.html` → `#events-preview`: retitle the section to upcoming ("What's Happening") and swap one of the three `.event-card` blocks (~lines 145–185) for the new event with the same CTA. Update `.section__desc`.
5. Optional: add a footer link under "Connect" in both `index.html` and `golf-2026.html`.
6. Commit: `Add <Event Name> (<Mon D>) to upcoming events`. Push and verify that the ticket link opens Square checkout.

### 6.2 Move an event to Past
Trigger: the event date has passed. Standing rule: "Any event that's already occurred should be moved to past events."
1. `index.html` → `#events`: delete the upcoming card. Add an `.event-past-card` at the top of `.events-past` (newest first) with the image, date, venue and a one-line recap. Remove the ticket CTA.
2. If nothing is upcoming, restore the `.events-next` placeholder:
   ```html
   <div class="events-next reveal">
     <p class="events-next__text">Next event is in the works. Get on the list and you'll hear about it first.</p>
     <button type="button" class="btn btn--primary" data-open-subscribe>Join the Mailing List</button>
   </div>
   ```
3. `#events-preview`: change the card to a recap (remove the buy button) and update the heading and description.
4. Remove footer ticket links in **both** `index.html` and `golf-2026.html`.
5. Keep the past grid tidy: it is laid out 2×2. If it grows past 4, ask Guy whether to drop the oldest.
6. Commit: `Move <Event> to past events`.

### 6.3 Mark a sponsor tier Sold Out
1. `index.html` → Sponsorship Tiers (~lines 265–350): add `<span class="sold-out">Sold Out</span>` after the price inside `.tier-card__price`.
2. Swap the CTA for a waitlist button:
   `<a href="mailto:info@sisdads.com?subject=<Tier>%20Sponsorship%20Waitlist" class="btn btn--outline-dark btn--sm" style="width:100%;justify-content:center;">Join Waitlist</a>`
   (Exception: the $500 Bulldog tier had its button removed entirely per Guy.)
3. To reopen tiers for a new year, remove the spans and restore `Inquire Now` buttons (`.btn--outline-dark`, mailto subject `<Tier> Sponsorship Inquiry`).
4. Commit: `<Tier> tier sold out`.

### 6.4 Update fundraising stats
Trigger: Guy gives a new total. Current numbers: 2023 $56,684 · 2024 $75,000 · 2025 $109,000 · 2026 $114,000 · total $354,684 (shown as `$350K+`).
Change all of these together:
1. Stats bar `.stat__number` (~lines 115–127): `$350K+` "Raised Since 2023", `150+` golfers, `4` years of bank partnership, `$114K` "2026 Golf Classic".
2. Golf hero recap (`#golf-classic`, `golf-detail-item` blocks ~lines 200–240): the "$114,000 Raised" figure.
3. Tournament Growth `.growth-stat__amount` (~lines 489–502). Add a new `.growth-stat` block for a new year.
4. Recap card copy in `#events-preview` and the 2026 Golf Classic past card.
5. `golf-2026.html` `.section__desc` (~line 97): "$114,000".
6. Round totals down ("$350K+", not "$355K").
7. Commit: `<Year> Golf Classic raised $<N>K: stats bar, golf hero, growth, recap cards, album`.

### 6.5 Add a photo album (e.g., 2027 Golf Classic)
Trigger: Guy uploads originals to a Google Drive folder.
1. Pull originals from Drive (Guy's personal account, read-only) into a scratch folder outside the repo. The old pull script downloaded in batches of ~30 because tokens expired mid-run.
2. Resize with Pillow: `web/` 2000px long edge, JPEG q78, `exif_transpose` applied, metadata stripped. `thumb/` 640px, q72.
3. Run `tools/build_album.py` (run with `-h` for options; Appendix A is the original 2026 version). It dedupes by md5, renames to `golf-YYYY-NNN.jpg`, and generates `golf-YYYY.html` from `index.html`'s `<head>`, `<header>`, `<footer>` and lightbox. It rewrites in-page anchors to `./#section` and sets title, description and og:image. **Commit the builder into `tools/` this time.**
4. Send Guy 10–12 highlight candidates as a contact sheet. He picks or approves ("You pick, I'll review").
5. Link the album from: the golf hero "See All Photos" button, the past event card, `#events-preview` and the footer link in both pages.
6. Confirm the photographer credit with Guy before publishing.
7. Commit: `<Year> Golf Classic album and highlights`.

### 6.6 Add photos to the Event Photos gallery (`#photos`)
1. Resize to ~1200px, JPEG q80. Save as `assets/events-gallery/event-51.jpg` and up.
2. Add `<div class="gallery__item" data-category="<golf|social|bowling|camping|tleg>"><img src="./assets/events-gallery/event-51.jpg" alt="<specific description>" loading="lazy" width=".." height=".."></div>` inside `#events-gallery`, grouped under an HTML comment naming the event, e.g. `<!-- TLEg 2 Dinner Photos (April 30, 2026, Sasa, Walnut Creek) -->`.
3. Commit: `Add <Event> photos to gallery`.

### 6.7 Swap the presenting sponsor logo or tile
1. Replace `assets/sponsors/bny-logo.png` and/or `assets/sponsors/presenting-sponsor-tile-stacked.png` in place (same filenames), using official sponsor artwork only.
2. Used in `.hero__presenting` (hero), `.golf-hero__presenting--logo` (golf hero pill), `.presenting-banner__tile` (~line 253) and `.sponsor-tier__tile` (recognition, ~line 402). Logo heights are tuned per slot in `style.css`. Re-check all four at both widths.
3. Ken Kearns credit: "Ken Kearns / Senior Director, BNY Wealth". Keep it tasteful and present wherever the presenting sponsor is credited.
4. The tile source PNGs and builder are in Perplexity project files `brand/social/` (builder script in Appendix B notes).

### 6.8 New sponsor year (2026 recognition, archive 2025)
Open item, see section 11. Plan:
1. Duplicate the Sponsor Recognition wall (`index.html` ~line 389) and title it `2026 Sponsor Recognition`. Guy supplies the sponsor list by tier.
2. Move 2025 into a collapsed `<details>` or a smaller archive block below it.
3. Commit: `2026 sponsor recognition; archive 2025`.

### 6.9 Update copy
1. Write in Guy's voice (section 10). Short lines, casual, no em dashes, no "thrilled to announce".
2. Use "St. Isidore" (with the period) and "Bulldog Dads", never "St. Isidore Dads".
3. Show Guy the draft first for anything public-facing beyond a factual fix.

### 6.10 Add a new page
1. Copy `golf-2026.html` as a template. It already has the shared head, header (with `./#` anchors), footer, lightbox and `app.js`.
2. Update `<title>`, `meta description`, `og:title`, `og:description` and `og:image` (absolute URL `https://sisdads.com/...`).
3. Link it from the nav or footer of **both** existing pages (headers and footers are duplicated, not included).
4. If a sitemap exists by then (see section 7), add the page to it.
5. Commit: `Add <page> page`.

### 6.11 SEO routine
See section 7.

---

## 7. SEO

| Item | Status |
|---|---|
| `sitemap.xml` | Missing |
| `robots.txt` | Missing (everything is crawlable by default) |
| `<title>` | `index.html`: "SIS Bulldog Dads — St. Isidore School Fathers' Organization". `golf-2026.html`: "2026 SIS Golf Classic Photos \| SIS Bulldog Dads" |
| Meta description | Present on both pages |
| Open Graph | `og:title`, `og:description`, `og:type` on both. `og:image` **only on** `golf-2026.html` (`https://sisdads.com/assets/golf-2026/full/golf-2026-037.jpg`). `index.html` has no og:image. Its og:description ("Join the SIS Bulldog Dads for the 2026 Golf Classic and more.") is stale. |
| Twitter cards | None |
| Canonical tag | None (www vs apex both serve; GitHub redirects www) |
| Favicon | None found |
| Structured data (JSON-LD) | None |
| Attribution meta | Removed Oct 30, 2026 per Guy (meta tags, ASCII comment and the visible footer link). Do not re-add. |
| Google Search Console | Not set up as far as known |
| Analytics | None installed |

### Suggested SEO routine (after each content change)
1. Keep `<title>` and the meta description accurate for the current season.
2. Add `og:image` to `index.html` (e.g., the golf hero photo at absolute URL) and refresh og:description.
3. One-time: add `robots.txt` (`User-agent: *` / `Allow: /` / `Sitemap: https://sisdads.com/sitemap.xml`) and a `sitemap.xml` listing `/`, `/golf-2026.html`, `/privacy-policy.html` and `/terms-and-conditions.html`. Add `Organization` JSON-LD (name, url, logo, email, parent organization St. Isidore School, Danville CA).
4. One-time: verify the site in Search Console (a DNS TXT record in Hover is needed, which only Guy can do) and submit the sitemap.
5. Image alt text on every new image, specific to the scene.

---

## 8. CHANGES MADE OUTSIDE GIT

Everything below exists outside the repo and would not show up in `git log`.

1. **FormSubmit activation** (Oct 23, 2026): Guy clicked the activation link sent to `info@sisdads.com`. The form now delivers there. If `info@` ever changes, the form must be re-activated.
2. **Mailchimp audience `6f0f396694`**: pre-existing. In Aug 2026 the public `SMSPHONE` merge field ("SMS Phone Number") was **deleted** from the audience because it caused a broken SMS control on signup forms. SMS was never used. `privacy-policy.html` and `terms-and-conditions.html` still reference SMS messaging (see Open Items).
3. **Mailchimp campaigns** (TLEg 2 reminders, VIP foursome, Golf Classic sends, etc.) were built and sent from Mailchimp. Templates live there and in Perplexity session files, not in the repo. `email-preview.html` in the repo is one old reference copy.
4. **Square products** created by Guy: Back to School Kickoff (`AS6N2O2M2UXYMYHYTNQN7LEF`), TLEg 2 at Sasa (`7VZ7UD2N3IKCKQSHDJ47EKCR`), plus the store at `/s/shop`. Both events are over. Their pages may still be live in Square.
5. **Google Drive** folder "SIS Golf 2026" (id `13C-uFpu6U_UgtNM_yZnqAXgY0E3MJmmj`, Guy's personal Drive): 160 originals, ~5 GB, the source for the album. Guy also has the photographer's iCloud album "SIS Golf 2026" (Tanya House).
6. **Sandbox-only tools** (not in the repo, will be lost with the Perplexity sandbox):
   - `/home/user/workspace/sisdads/tools/build_album.py` (reproduced in Appendix A)
   - `/home/user/workspace/golf2026/pull.py` (Drive downloader, batches of ~30)
   - `/home/user/workspace/golf2026/album_map.json` (original filename → `golf-2026-NNN` map, plus the 7 dropped duplicates, the `_2` copies)
   - `/home/user/workspace/golf2026/shoot2.py`, `shoot4.py` (Playwright screenshot helpers)
   - `/home/user/workspace/sisdads/reels/build_reel_card.py`, `build_presenting_tile.py` (social asset generators)
7. **Brand files in Perplexity project files** (not the repo): `brand/brand-package.md`, `brand/logos/bny/`, `brand/social/*.png` (presenting tiles, BNY reveal Reel card 1080×1920), `brand/events/back-to-school-kickoff-badge.jpeg`, `campaigns/`, `flyers/`. Download what you want to keep.
8. **Social posts:** the Instagram caption for the BNY reveal was delivered in chat and posted by Guy manually. There is no social integration on the site.
9. **DNS:** no changes made by Perplexity Computer. All records were set up by Guy in Hover.
10. **GitHub Pages settings** (HTTPS enforced, custom domain, `master` + `/`): set in repo Settings → Pages. Not stored in a file except `CNAME`.
11. **Guy's Mac:** a temporary photo transfer folder `/tmp/sisg` was cleared. Nothing left behind.

---

## 9. SCHEDULED OR AUTOMATED TASKS

- **None for this site.** No cron jobs, no GitHub Actions beyond GitHub's built-in Pages deploy, no Perplexity automations that edit the repo, and no Mailchimp automations configured by Perplexity Computer.
- The GitHub Pages TLS cert renews automatically (current expiry 2026-12-22).
- Recurring work is calendar-driven and manual: moving events to Past after they happen, the annual Golf Classic cycle (tiers → sold out → recap → album → stats → next-year sponsors).

---

## 10. YOUR STANDING INSTRUCTIONS

Copied as given by Guy. Quotes are word for word. Items marked (paraphrase) are faithful summaries where the original wording wasn't preserved.

### Project (Space) instructions, verbatim
> You are my brand manager and expert marketing guru for the st isidore bulldog dads club. I am the founder of the club. It's a dads club for st Isidore school in danville. A Catholic school. You have designed my website and are in charge of marketing communications and promotional items for the club. You help me schedule and promote events.

### Working rules Guy gave in this project, verbatim
- "Ask me questions before you start this" (before major creative work)
- "Always 'BNY Wealth'"
- "Same logo everywhere."
- "we need to add Ken Kearns, Senior Director to it tastefully. i need him to get the name recognition - hes a parent at the school... Ken is our connection to BNY." (This replaced an earlier instruction, "No need to mention Ken Kearns on the website.")
- "Use option 2 but delete the ai tells. Use humanizer or anti ai writing style. Use my writing style."
- "Any event that's already occurred should be moved to past events."
- Photos: "Web versions only"
- Highlight photos: "You pick, I'll review."
- "Publish as is change the $500 bulldog tier to sold out 2025 sponsor recognition can stay but we're really gonna need 2026 sponsor recognition at some point."

### Voice and style rules (paraphrase of repeated feedback + memory)
- No em dashes. Short lines. Casual, direct, neighbor-to-neighbor.
- No AI tells: no "thrilled to announce", no "unlock", no "elevate", no rule-of-three padding, no inflated phrases, no exclamation-point stacks, no emojis.
- Human-sounding over polished. Candid recommendations and pushback are welcome. Concise.
- The account and site are personal and volunteer only. Never mix in Guy's real estate or private-equity work.

### Brand rules (from `brand/brand-package.md`, verbatim excerpts)
- "Warm, direct, community-minded. We're neighbors talking to neighbors."
- "Confident, not corporate. Short sentences. Plain language. No jargon, no hype."
- "Faith-adjacent, not preachy."
- "Family-first. Kids and moms are welcome context, not afterthoughts."
- Say: "Join us." "All dads welcome." "Proudly supporting St. Isidore School." Avoid: "Synergize." "Unlock." "World-class." "Revolutionary."
- "Always St. Isidore (with the period), not 'St Isidore' or 'Saint Isidore.'"
- "Rebrand as generic 'St. Isidore Dads' — the 'Bulldog' is the identity." (listed under Don't)
- "Use navy + gold as the anchor pair." "Don't mix in a third typeface, extra brand colors, or gradient-heavy designs." "Don't recolor the Bulldog Dads logo or sponsor logos."
- "Route every CTA back to sisdads.com, the store, or a mailto with a useful subject line." "Credit St. Isidore School as the beneficiary."
- Accessibility: visible 2px gold focus rings, alt text on every image, respect `prefers-reduced-motion`, nothing smaller than `--text-sm` for readable text.
- Captions end with `#SISBulldogDads` and, when appropriate, `#StIsidoreSchool #DanvilleCA`.

---

## 11. OPEN ITEMS AND KNOWN ISSUES

1. ~~Photographer credit~~ Confirmed by Guy Oct 30, 2026: keep "Photos by Tanya House."
2. **2026 Sponsor Recognition missing.** The site still shows "2025 Sponsor Recognition" (`index.html` ~line 394). Guy wants a 2026 section and 2025 archived. Needs the sponsor list from Guy (runbook 6.8).
3. ~~Done Oct 30, 2026.~~ **Stale TLEg 2 link in the album footer.** `golf-2026.html` ~line 285 still links "TLEg 2 Tickets" to the Square product. `index.html` was fixed in `eb5dc0b`, but the album page was generated earlier. Replace it with "2026 Golf Classic Photos" or remove it.
4. ~~Done Oct 30, 2026.~~ **Stale "2026" sponsorship mailto.** `index.html` ~line 564 uses subject `Sponsorship Inquiry - Golf Classic 2026`. Change it to 2027. (The golf hero "Sponsor 2027" button at ~line 243 is already correct.)
5. **No SPF/DMARC TXT records** for `sisdads.com`. Mailchimp and Hover mail from `@sisdads.com` may land in spam. Guy would add these in Hover.
6. **No analytics, sitemap, robots.txt, favicon, canonical or JSON-LD.** `index.html` has no og:image and its og:description is stale (section 7).
7. **Old copy has em dashes**, e.g. the `<title>`/og:title, the merchandise line (~375), the contact intro (~984) and the "© 2026 SIS Bulldog Dads — St. Isidore" footer. Clean them up when touching those areas.
8. ~~Done Oct 30, 2026.~~ SMS removed from both compliance pages; terms page is now plain mailing-list terms and no longer lists a phone number. Still open: the privacy policy says Google Analytics is used, but none is installed. Fix that line if analytics is not added. The committee card for Bret Scheiding still says "SMS Marketing" (his title, ask Guy).
9. **Contact form:** delivery to `info@sisdads.com` should be confirmed with a test submission that Guy checks in the Hover mailbox. Optional: switch to a FormSubmit random alias to hide the address. The fallback state shows a mailto link.
10. **Repo size**: ~83 MB album in git. Fine for now. Future albums add similar weight. Consider Git LFS or external hosting if it grows past ~500 MB.
11. **Unused legacy assets**: `assets/tleg-dinner-menu.jpg`, `email-preview.html`. (Not `golf-hero.jpg`, which is the home hero.) Safe to remove after confirming nothing references them (`rg -n "golf-hero.jpg|tleg-dinner-menu|email-preview"`).
12. **Brand package out of date**: `brand/brand-package.md` (project files) still lists `$250K+` and `$125K 2026 Goal` and says Sold Out tiers always get Join Waitlist (Bulldog doesn't). Update it, or retire it in favor of `CLAUDE.md`.
13. **Footer copyright year** is hard-coded "© 2026" in both pages. Update in January.
14. **Headers and footers are duplicated** in `index.html` and `golf-2026.html`. Any nav or footer change must be made in both.
15. **Upcoming events**: the placeholder is showing. When the next event is set, use runbook 6.1 with a fresh Square link.

---

## 12. GAPS

Things I could not verify or never had access to. Confirm with Guy.

1. Hover: whether Hover is also the registrar, the renewal date, auto-renew status and whether there are DNS records beyond those listed (only A, CNAME www, MX and NS resolve publicly).
2. Whether `info@sisdads.com` forwards anywhere, and who reads it.
3. Mailchimp: audience settings, double opt-in, any automations/journeys Guy set up himself, and the exact current audience name (records show both "St Isidore Bulldog Dads" and "Guy St Isidore Bulldog Dads").
4. Square: admin access, which products are still live, and whether old event products should be archived.
5. Whether any analytics, Search Console property or tag manager exists outside the site code (none is in the HTML).
6. Who besides Guy has GitHub access to `sisdads-site`, and any branch protection (none was observed; pushes to `master` worked directly).
7. ~~Photographer credit~~ Confirmed.
8. The 2026 sponsor list by tier.
9. ~~Perplexity attribution~~ Removed per Guy.
10. Whether Guy has any Perplexity-side scheduled monitors related to the club (none touch this repo).

---

## Appendix A: Album builder (was `/home/user/workspace/sisdads/tools/build_album.py`)

Superseded by `tools/build_album.py` in the repo, which takes the year, date, amount raised and credit as arguments. The original is kept here for reference.

Paths are from the Perplexity sandbox. Adjust `SRC` and `REPO`, and generalize the `2026` strings, before reuse. Inputs: `SRC/web/*.jpg` (2000px) and `SRC/thumb/*.jpg` (640px) with matching filenames.

```python
import os, shutil, hashlib, re, json
from PIL import Image
SRC='/home/user/workspace/golf2026'; REPO='/home/user/workspace/sisdads/sisdads-site'
out_full=f'{REPO}/assets/golf-2026/full'; out_th=f'{REPO}/assets/golf-2026/thumbs'
for d in (out_full,out_th):
    shutil.rmtree(d,ignore_errors=True); os.makedirs(d)
names=sorted(os.listdir(f'{SRC}/web'))
seen={}; items=[]; dupes=[]
for n in names:
    h=hashlib.md5(open(f'{SRC}/web/{n}','rb').read()).hexdigest()
    if h in seen: dupes.append((n,seen[h])); continue
    seen[h]=n
    i=len(items)+1; clean=f'golf-2026-{i:03d}.jpg'
    shutil.copy(f'{SRC}/web/{n}',f'{out_full}/{clean}'); shutil.copy(f'{SRC}/thumb/{n}',f'{out_th}/{clean}')
    w,hh=Image.open(f'{out_th}/{clean}').size
    items.append(dict(src=n,file=clean,w=w,h=hh))
json.dump(dict(items=items,dupes=dupes),open(f'{SRC}/album_map.json','w'),indent=1)
idx=open(f'{REPO}/index.html').read()
head=idx[:idx.index('<header')]
head=head.replace("<title>SIS Bulldog Dads — St. Isidore School Fathers' Organization</title>","<title>2026 SIS Golf Classic Photos | SIS Bulldog Dads</title>")
head=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="Photos from the 2026 SIS Golf Classic at Blackhawk Country Club, presented by BNY Wealth.">',head)
head=re.sub(r'<meta property="og:title" content="[^"]*">','<meta property="og:title" content="2026 SIS Golf Classic Photos">',head)
head=re.sub(r'<meta property="og:description" content="[^"]*">','<meta property="og:description" content="Photos from the 2026 SIS Golf Classic at Blackhawk Country Club, presented by BNY Wealth.">\n<meta property="og:image" content="https://sisdads.com/assets/golf-2026/full/golf-2026-037.jpg">',head)
header=idx[idx.index('<header'):idx.index('</header>')+9]
footer=idx[idx.index('<footer'):idx.index('</footer>')+9]
lb=idx[idx.index('<div class="lightbox"'):idx.index('<script src="./app.js"')]
fix=lambda s: re.sub(r'href="#(home|golf-classic|events|photos|about|contact)"',r'href="./#\1"',s).replace('class="active"','')
grid='\n'.join(f'      <div class="gallery__item"><img src="./assets/golf-2026/thumbs/{it["file"]}" data-full="./assets/golf-2026/full/{it["file"]}" alt="2026 SIS Golf Classic at Blackhawk Country Club, photo {k+1}" loading="lazy" width="{it["w"]}" height="{it["h"]}"></div>' for k,it in enumerate(items))
body=f'''<body>

{fix(header)}

<main>
<section class="section album-hero">
  <div class="container">
    <a href="./#golf-classic" class="album-back">&larr; Back to the Golf Classic</a>
    <div class="section__header">
      <div class="section__eyebrow">Monday, September 21, 2026 &bull; Blackhawk CC, Lakeside Course</div>
      <h1 class="section__title">2026 SIS Golf Classic Photos</h1>
      <p class="section__desc">{len(items)} photos from a great day at Blackhawk, where we raised $114,000 for St. Isidore. Presented by BNY Wealth. Tap any photo to see it full size. Photos by Tanya House.</p>
    </div>
    <div class="gallery gallery--album">
{grid}
    </div>
    <p class="album-note">Want a full-resolution copy of a photo you're in? Email <a href="mailto:info@sisdads.com?subject=Golf%20Classic%202026%20photo%20request">info@sisdads.com</a> with the photo number.</p>
  </div>
</section>
</main>

{fix(footer)}

{lb}<script src="./app.js" defer></script>
</body>
</html>
'''
open(f'{REPO}/golf-2026.html','w').write(head+body)
print(len(items),'items',len(dupes),'dupes',dupes[:5])
```

Note: running this again overwrites `golf-2026.html` and drops any hand edits made since (e.g., the $114K text update). Diff before committing.

## Appendix B: Social asset generators

`build_reel_card.py` (1080×1920 Reel cover) and `build_presenting_tile.py` (stacked/inline presenting-sponsor tiles with the Ken Kearns credit) were Pillow scripts in the Perplexity sandbox at `/home/user/workspace/sisdads/reels/`. Their outputs are saved in project files `brand/social/`. If you need to regenerate, rebuild from those PNGs plus `assets/sponsors/bny-logo.png` and `assets/bulldog-dads-logo.png`: navy/gold, Cormorant Garamond + Work Sans.

## Suggested first commit for Claude Code
Save this document as `CLAUDE.md` in the repo root (or `docs/HANDOFF.md`) and commit `tools/build_album.py` from Appendix A, so the knowledge lives with the code.
