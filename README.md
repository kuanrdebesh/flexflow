# FlexFlow — Smart Stretch Planner

A muscle-first stretch planner. Select what you trained, generate your pre and post workout routine.

## Structure

```
flexflow/
├── index.html          ← App shell (HTML + CSS)
├── app.js              ← All application logic
├── data/
│   └── stretches.json  ← Stretch database (edit this to add/remove stretches)
├── images/
│   ├── icon-192.png    ← PWA icon (add your own)
│   ├── icon-512.png    ← PWA icon large (add your own)
│   └── [stretch photos]← Optional reference photos (see IMAGE_STRETCHES in app.js)
├── manifest.json       ← PWA configuration
├── sw.js               ← Service worker (offline support)
└── README.md
```

## Adding a Stretch

Edit `data/stretches.json` and add an entry:

```json
{
  "id": "post-new-stretch",
  "phase": "post",
  "priority": 1,
  "fig": "hamstringStand",
  "name": "New Stretch Name",
  "targets": "Target muscles description",
  "muscles": ["hamstrings", "glutes"],
  "reps": "45 sec / side",
  "sets": "2 holds",
  "timer": 45,
  "steps": [
    "Step 1 instruction.",
    "Step 2 instruction.",
    "Step 3 instruction.",
    "Step 4 instruction.",
    "Step 5 instruction."
  ],
  "why": "Biomechanical rationale for why this stretch matters.",
  "tip": "Pro tip for getting the most out of this stretch."
}
```

**priority:** `1` = appears in Quick + Detailed mode. `2` = Detailed only.

**fig:** Key from the FIGS map in app.js. Pick the closest match to the body position.

**phase:** `"pre"` (dynamic) or `"post"` (static).

## Adding Reference Photos

1. Add photo to `images/` folder (e.g. `post-my-stretch.jpg`)
2. Add entry to `IMAGE_STRETCHES` object in `app.js`:
   ```js
   'post-my-stretch': 'images/post-my-stretch.jpg',
   ```
3. The card will automatically show a flip button.

## Deploying

Push to GitHub, connect to Cloudflare Pages. Set build command to none, output directory to `/`.

Auto-deploys on every push to main.

## PWA Icons

Replace `images/icon-192.png` and `images/icon-512.png` with your own icons.
Generate them at: https://maskable.app/editor
