# Ye Lin Naing (Leo) — Portfolio

Live at [yelinn.com](https://yelinn.com).

A static site — no build step, no dependencies. Open `index.html` in a browser,
or serve the folder with `python -m http.server` if you want the relative paths
to behave exactly as they do in production.

## Files

```
index.html              the portfolio itself
projects.html           "See all projects" dashboard, with filters and charts
css/style.css           all styling for index.html (projects.html is self-contained)
js/main.js              nav, scroll reveals, role matcher, image viewer
js/mascot3d.js          optional 3D mascot; the inline SVG lion is the fallback
img/projects/           project screenshots and charts
certificates/           certificate PDFs
profile.jpg             hero photo
YeLinNaing(Leo).pdf     CV
CNAME                   custom domain for GitHub Pages
```

## What to edit

**Links and certificates** — the `SITE` block at the top of `js/main.js`:

```js
var SITE = {
  cv:       "./YeLinNaing(Leo).pdf",
  cert1:    "./certificates/YeLinNaingGoogleDataAnalytics.pdf",
  cert2:    "./certificates/Ye Lin Naing - MySQL for Data Analytics Certificate.pdf",
  certsAll: ""   // optional folder or Drive link
};
```

Anything left as `""` hides that button rather than showing a dead link.

**The role matcher** — the `data` object further down `js/main.js`. Each entry is
a requirement a recruiter might tick, with `has: true/false` and an honest note.
Adding a key here also needs a matching `<button class="chip" data-key="...">`
in the `#match` section of `index.html`.

**Projects on the front page** — the three `<article class="proj">` blocks in
`index.html`. Each one is a figure (a screenshot, or the SQL query card) plus a
`Problem → Work → Result` list. Keep the result line concrete: numbers, not
adjectives.

**Projects on `projects.html`** — the `PROJECTS` array near the bottom of the
file. Add an entry and every chart, filter, stat and card updates itself. If you
add a new tool tag, add it to `TOOL_TAGS` too so it counts as a tool rather than
a skill.

## Adding a project screenshot

Drop the image in `img/projects/`, then point a figure at it:

```html
<button class="figbtn" type="button"
        data-viewer="./img/projects/your-chart.png"
        data-viewer-title="What this chart shows">
  <img src="./img/projects/your-chart.png" alt="Describe the chart" loading="lazy">
</button>
```

`data-viewer` makes it open full size in the lightbox.

## Publishing

The repo deploys to GitHub Pages from `main`. Push and it goes live; `CNAME`
keeps the custom domain pointed at it.
