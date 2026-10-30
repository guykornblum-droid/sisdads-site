#!/usr/bin/env python3
"""Build a photo album page (e.g. golf-2027.html) from resized photos.

Inputs: SRC/web/*.jpg (2000px long edge) and SRC/thumb/*.jpg (640px) with
matching filenames. Keep SRC outside the repo; never commit originals.

Dedupes by md5, renames to <event>-<year>-NNN.jpg in sorted order of the
original filenames, copies into assets/<event>-<year>/full|thumbs, writes
SRC/album_map.json, and generates <event>-<year>.html from index.html's
<head>, <header>, <footer> and lightbox.

Re-running overwrites the album page and its asset folders. Diff before
committing so hand edits made since the last run are not lost.

Example:
  python3 tools/build_album.py --src ~/scratch/golf2027 --year 2027 \\
    --date "Monday, September 20, 2027" --venue "Blackhawk CC, Lakeside Course" \\
    --raised "\\$120,000" --credit "Photos by Tanya House." --og 37
"""
import argparse, hashlib, html, json, os, re, shutil
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
p.add_argument('--src', required=True, help='folder holding web/ and thumb/')
p.add_argument('--year', required=True)
p.add_argument('--event', default='golf', help='slug used in file names (default: golf)')
p.add_argument('--name', default='SIS Golf Classic', help='display name (default: SIS Golf Classic)')
p.add_argument('--date', required=True, help='eyebrow date, e.g. "Monday, September 20, 2027"')
p.add_argument('--venue', default='Blackhawk CC, Lakeside Course')
p.add_argument('--place', default='Blackhawk Country Club', help='venue name used in meta text and alt text')
p.add_argument('--raised', default='', help='amount raised, e.g. "$120,000" (omit to leave out)')
p.add_argument('--sponsor', default='BNY Wealth', help='presenting sponsor (empty to leave out)')
p.add_argument('--credit', default='', help='photographer credit sentence; confirm wording with Guy')
p.add_argument('--og', type=int, default=1, help='photo number for og:image')
a = p.parse_args()

slug = f'{a.event}-{a.year}'
title = f'{a.year} {a.name} Photos'
desc = f'Photos from the {a.year} {a.name} at {a.place}' + (f', presented by {a.sponsor}.' if a.sponsor else '.')
out_full = f'{REPO}/assets/{slug}/full'; out_th = f'{REPO}/assets/{slug}/thumbs'
for d in (out_full, out_th):
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)

names = sorted(n for n in os.listdir(f'{a.src}/web') if n.lower().endswith(('.jpg', '.jpeg')))
seen = {}; items = []; dupes = []
for n in names:
    h = hashlib.md5(open(f'{a.src}/web/{n}', 'rb').read()).hexdigest()
    if h in seen: dupes.append((n, seen[h])); continue
    seen[h] = n
    clean = f'{slug}-{len(items)+1:03d}.jpg'
    shutil.copy(f'{a.src}/web/{n}', f'{out_full}/{clean}'); shutil.copy(f'{a.src}/thumb/{n}', f'{out_th}/{clean}')
    w, hh = Image.open(f'{out_th}/{clean}').size
    items.append(dict(src=n, file=clean, w=w, h=hh))
json.dump(dict(items=items, dupes=dupes), open(f'{a.src}/album_map.json', 'w'), indent=1)

idx = open(f'{REPO}/index.html').read()
head = idx[:idx.index('<header')]
head = re.sub(r'<title>[^<]*</title>', f'<title>{html.escape(title)} | SIS Bulldog Dads</title>', head)
head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(desc)}">', head)
head = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{html.escape(title)}">', head)
head = re.sub(r'<meta property="og:image" content="[^"]*">\n?', '', head)
head = re.sub(r'<meta property="og:description" content="[^"]*">',
              f'<meta property="og:description" content="{html.escape(desc)}">\n'
              f'<meta property="og:image" content="https://sisdads.com/assets/{slug}/full/{slug}-{a.og:03d}.jpg">', head)
header = idx[idx.index('<header'):idx.index('</header>')+9]
footer = idx[idx.index('<footer'):idx.index('</footer>')+9]
lb = idx[idx.index('<div class="lightbox"'):idx.index('<script src="./app.js"')]
fix = lambda s: re.sub(r'href="#(home|golf-classic|events|photos|about|contact)"', r'href="./#\1"', s).replace(' class="active"', '')

grid = '\n'.join(f'      <div class="gallery__item"><img src="./assets/{slug}/thumbs/{it["file"]}" data-full="./assets/{slug}/full/{it["file"]}" alt="{a.year} {a.name} at {a.place}, photo {k+1}" loading="lazy" width="{it["w"]}" height="{it["h"]}"></div>' for k, it in enumerate(items))
blurb = f'{len(items)} photos from the {a.year} {a.name}'
blurb += f', where we raised {a.raised} for St. Isidore.' if a.raised else '.'
if a.sponsor: blurb += f' Presented by {a.sponsor}.'
blurb += ' Tap any photo to see it full size.'
if a.credit: blurb += ' ' + a.credit
subject = f'{a.name.replace("SIS ", "")} {a.year} photo request'.replace(' ', '%20')

body = f'''<body>

{fix(header)}

<main>
<section class="section album-hero">
  <div class="container">
    <a href="./#golf-classic" class="album-back">&larr; Back to the Golf Classic</a>
    <div class="section__header">
      <div class="section__eyebrow">{a.date} &bull; {a.venue}</div>
      <h1 class="section__title">{html.escape(title)}</h1>
      <p class="section__desc">{html.escape(blurb)}</p>
    </div>
    <div class="gallery gallery--album">
{grid}
    </div>
    <p class="album-note">Want a full-resolution copy of a photo you're in? Email <a href="mailto:info@sisdads.com?subject={subject}">info@sisdads.com</a> with the photo number.</p>
  </div>
</section>
</main>

{fix(footer)}

{lb}<script src="./app.js" defer></script>
</body>
</html>
'''
open(f'{REPO}/{slug}.html', 'w').write(head + body)
print(f'{slug}.html: {len(items)} photos, {len(dupes)} dupes dropped', dupes[:5])
