# Leo — Portfolio

## Files

```
index.html                              your portfolio (open this one)
projects.html                           "See all projects" dashboard
certificates/sample-certificate.pdf     demo file — replace with the real one
certificates/sample-certificate.png     demo file — replace with the real one
```

Keep the folder structure as-is. The links between pages are relative.

## To publish on GitHub Pages

1. Create a repo, upload all of the above (keeping the `certificates` folder).
2. Repo Settings → Pages → deploy from your main branch.
3. `index.html` is picked up automatically.

## What to edit

**`index.html`** — near the top of the first `<script>` block:

```js
var SITE = {
  linkedin: "",     // your LinkedIn URL
  cv:       "./Leo_Naing_CV.pdf",
  cert1:    "./certificates/sample-certificate.pdf",   // swap for real
  cert2:    "./certificates/sample-certificate.png",   // swap for real
  certsAll: ""      // optional folder/Drive link
};
```

Anything left as `""` hides that button instead of showing a dead link.

**`projects.html`** — the `PROJECTS` array at the bottom. Add an entry and every
chart, filter, stat and card on the page updates itself.

## Still to fill in

Search for `edit-me` in both files. Those amber markers are:

- your McDonald's start date
- one outcome line per project (what you found, not what you used)

Also add `profile.jpg` and `Leo_Naing_CV.pdf` next to `index.html`.
