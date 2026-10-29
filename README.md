# Ye Lin Naing — Portfolio

Live at [yelinn.com](https://yelinn.com).

A static site: plain HTML, one stylesheet and one small script. No build step
and no dependencies. Links use root paths (`/projects/`), so preview it through
a local server rather than opening the files directly:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Files

```
index.html                               homepage: hero, featured projects, about, skills,
                                         experience, education, certifications, contact
projects/index.html                      all projects
projects/world-life-expectancy/index.html  case study
projects/uk-crime/index.html             case study
404.html                                 not-found page (GitHub Pages serves it automatically)
projects.html                            redirect from the old URL to /projects/
css/style.css                            all styling; colours and spacing are tokens at the top
js/main.js                               mobile menu, scroll reveals, skill tooltips, footer year
favicon.svg                              site icon
assets/icons/                            tool logos for the Skills grid (one SVG per tool)
img/projects/                            project charts (uk-crime-1…4 come from the analysis notebook)
certificates/                            certificate PDFs linked from Certifications
profile.png                              hero photo
YeLinNaing-DataAnalyst-CV.pdf            CV linked from the hero and contact section
CNAME                                    custom domain for GitHub Pages
```

## Editing

**Header and footer** are repeated on every page. If you change one, change all
five HTML files.

**Adding a project:** copy a `project-card` article in `index.html` and
`projects/index.html`, and copy one of the case-study folders for its own page.
Each case study follows the same headings: overview, questions, dataset, tools,
method, findings, limitations and links.

**Replacing the CV:** overwrite `YeLinNaing-DataAnalyst-CV.pdf` with the new
file, keeping the same name, and every link stays correct.

**Cache-busting:** after changing `css/style.css` or `js/main.js`, bump the
`?v=` number where each page links to them, so returning visitors get the new
file.

## Publishing

The repo deploys to GitHub Pages from `main`. Push and it goes live; `CNAME`
keeps the custom domain pointed at it.
