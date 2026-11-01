# Publishing HIMCO

This is a static website. It needs no database, API keys, Node server or form backend. Quotes open WhatsApp; phone and email links open the visitor’s own apps. Arabic is the initial language; the language switch remembers a visitor’s choice.

## Ready-to-upload package

`dist/himco-publish.zip` contains only the public pages, CSS/JavaScript, transparent logo, brochure, project photographs, robots.txt and optional hosting headers. It excludes Git, source notes, scripts, stock photography and private company-profile PDFs.

Extract the ZIP and upload **its contents** to your hosting web root (usually `public_html`). `index.html` must sit at that root. Keep all project folder names and filenames unchanged, including Arabic names and letter case. Use HTTPS. No build command is required by the hosting server.

Configure the host to serve `404.html` with HTTP status 404 for missing pages. `_headers` works on static hosts that support that format; on cPanel/Apache/IIS, apply equivalent headers in the hosting configuration if desired. Do not rewrite every path to index.html: About Us is a separate page.

## Rebuilding

With Python 3 and Node.js installed:

```powershell
node scripts/check-site.mjs
python scripts/package-site.py
```

Once the final HTTPS domain is selected, run the packager again with `--site-url` set to that URL. It adds absolute canonical URLs, social preview image URLs and a two-page sitemap to the archive, and links the sitemap in robots.txt. The live URL is intentionally not guessed. The argument may include a deployment subdirectory.

Google Fonts is the only external resource used to render the pages. System fonts remain usable when that service is unavailable. Interactive galleries, map and language selection require JavaScript; core company content and contact links remain available without it.

## After upload

Open the HTTPS homepage and About Us on desktop and phone. Check language switching, the three map regions, all six project galleries, the PDF download and contact links. Check an unknown URL returns the custom page with status 404. If built with a final domain, open sitemap.xml and verify its URLs match the deployment.

See `FINAL_CHECK.md` for the local release verification. Hosting, DNS and live HTTPS checks can only be completed after the deployment destination is selected.
