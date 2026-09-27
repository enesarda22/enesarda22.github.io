# Enes Arda’s website

A static academic homepage and paper blog, published through GitHub Pages. There is no build step.

## Preview

From this directory, run `python3 -m http.server 8765` and open `http://localhost:8765/`.

## Design

- `assets/css/style.css` defines the shared palette, fonts, radius, links, and homepage components.
- `assets/css/paper.css` defines the reading layout and article components. Section headings, the central question, and theorem titles have distinct classes rather than overriding one another.
- Inter is used for navigation and the homepage; STIX Two Text is used for publications and article text. MathJax uses the matching STIX math font.
- The About card is the site’s signature animation. Article content stays static.
- Figures use a common `--figure-width` setting. The decomposition figure floats beside the explanation on desktop and stacks above it on mobile.

## Paper pages

Each paper has its own directory under `papers/`, containing the page, its public PDF and poster, figures, and downloadable citation. To add a post, follow the existing page’s structure and update:

- the title, authors, venue, canonical URL, and scholarly metadata;
- the resource links and content;
- both the visible BibTeX and `citation.bib`;
- the homepage’s blog list, the publication entry, and `sitemap.xml`.

The small scripts each serve one purpose:

- `math-config.js`: consistent math rendering and screen-reader MathML, without interactive math controls;
- `math-copy.js`: readable TeX when copying equations along with prose;
- `citation-copy.js`: the citation copy button and its feedback.

The theorem’s TeX helper gives underbraces and their labels matching vertical dimensions. Its invisible spacers are clipped in CSS so they cannot create horizontal scrolling.

## Maintenance

When changing a stylesheet or a versioned script, update its `?v=` reference in the pages that load it. Before publishing, check local links, desktop and mobile layouts, math rendering, and citation copying.

Keep `.nojekyll` for static GitHub Pages hosting, `google5c760f351b83ea04.html` for Search Console verification, and `sitemap.xml` for page discovery. PDFs are marked binary in `.gitattributes`.
