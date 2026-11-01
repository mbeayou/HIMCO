# HIMCO release check — 11 October 2026

Result: local release checks passed. The upload archive is `dist/himco-publish.zip` (3.41 MB, 32 public files). It has not been deployed to a public host.

## Corrections in this release

- Added a bilingual keyboard skip link, translated navigation labels and accurate logo/image dimensions.
- Increased menu, language and gallery-close buttons to 44px and improved control-border and small map-label contrast.
- Added separate homepage/About descriptions and social-sharing title/description metadata that follow the selected language.
- Replaced fixed 24/7 and 25-year claims with backup-power and long-term-value wording; company profile documents do not verify those fixed figures.
- Added a bilingual 404 page, robots.txt, optional static-host response headers and a public-file-only ZIP packager.
- Added mobile navigation and direct project-photo fallbacks for visitors without JavaScript.

## Verification performed

| Check | Result |
| --- | --- |
| JavaScript syntax and static site checker | Passed |
| Local file links, SVG references, cross-page anchors, unique IDs and image alt attributes | Passed |
| Bilingual project data | 6 projects, 22 photo references, 3 map regions |
| Arabic layout on both pages | Passed at 320, 375, 768, 1280 and 1920px; no horizontal/header overflow |
| English layout on both pages | Passed at 375, 768, 1280 and 1920px; no horizontal/header overflow |
| Mobile menu and navigation to About Us/projects | Passed; menu closes after navigation |
| Language selection and persistence between pages | Passed |
| Map selection and project detail updates | Passed |
| Galleries | All 22 photographs loaded; counters and navigation boundaries passed |
| Gallery keyboard and focus | Escape closes; focus returns to opener |
| Keyboard skip link | Moves focus to main content |
| Energy flow | Stage selection, pause and resume passed |
| Motion preferences | CSS/JS inspected: reduced motion disables animation; offscreen/background pauses remain in place |
| Phone, email and WhatsApp destinations | Correct published contact destinations; no messages sent |
| Public HTTP resources | 31 pages/resources returned HTTP 200 locally |
| Brochure | PDF parsed successfully, 2 pages |
| 404 recovery links | Passed in browser |
| Console | No warnings or errors captured during checks |
| Unfinished content | No placeholders or development URLs found in public source files |
| ZIP | Integrity passed; only allowlisted public files and project photographs included |
| Domain metadata packager | Canonical links, social image URLs, sitemap and deployment subdirectory tested; temporary test domain excluded from final archive |
| Git whitespace check | Passed |

Main contrast checks: muted body text on the paper surface 5.03:1; brand-blue text on pale blue 6.55:1; white text on red buttons 5.04:1. This was a targeted local accessibility review, not a formal certification or a Lighthouse score.

## Deployment-specific work

Select the final HTTPS domain and hosting destination. Rebuild with `--site-url` to add canonical URLs, absolute social image URLs and sitemap.xml. Upload the ZIP contents, configure the custom 404 response, and verify DNS, HTTPS and the published links on the live site. See `PUBLISHING.md` for the procedure.

No capacity, completion date or project location has been invented where the supplied materials do not confirm it. Project map markers identify approximate areas.
