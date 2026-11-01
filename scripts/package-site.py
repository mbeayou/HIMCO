"""Create an allowlisted static-site ZIP; optionally add final-domain SEO metadata."""
import argparse
import html
from pathlib import Path
import subprocess
import sys
from urllib.parse import urlsplit
from xml.sax.saxutils import escape
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_FILES = ('index.html', 'about.html', '404.html', 'styles.css', 'script.js',
                'projects.js', 'logo--.png', 'BROCHURE.pdf', 'robots.txt', '_headers')

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site-url', help='Final HTTPS website URL, including any subdirectory')
    args = parser.parse_args()
    site_url = args.site_url.rstrip('/') + '/' if args.site_url else None
    if site_url:
        url = urlsplit(site_url)
        if url.scheme != 'https' or not url.netloc or url.query or url.fragment or url.username or url.password:
            parser.error('--site-url must be an HTTPS website URL without credentials, query or fragment')
    subprocess.run(['node', '--check', str(ROOT / 'script.js')], check=True)
    subprocess.run(['node', '--check', str(ROOT / 'projects.js')], check=True)
    subprocess.run(['node', str(ROOT / 'scripts/check-site.mjs')], check=True)
    files = {name: (ROOT / name).read_bytes() for name in PUBLIC_FILES}
    for photo in sorted((ROOT / 'assets/Projects').rglob('*')):
        if photo.is_file() and photo.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'}:
            files[photo.relative_to(ROOT).as_posix()] = photo.read_bytes()
    if site_url:
        for name in ('index.html', 'about.html'):
            canonical = site_url if name == 'index.html' else site_url + name
            additions = (f'<link rel="canonical" href="{html.escape(canonical, quote=True)}" />\n'
                         f'<meta property="og:url" content="{html.escape(canonical, quote=True)}" />\n'
                         f'<meta property="og:image" content="{html.escape(site_url, quote=True)}logo--.png" />\n'
                         '<meta property="og:image:alt" content="HIMCO" />\n'
                         f'<meta name="twitter:image" content="{html.escape(site_url, quote=True)}logo--.png" />\n')
            source = files[name].decode('utf-8').replace('</head>', additions + '  </head>')
            files[name] = source.encode('utf-8')
        not_found = files['404.html'].decode('utf-8').replace('href="/', f'href="{html.escape(site_url, quote=True)}').replace('src="/', f'src="{html.escape(site_url, quote=True)}')
        files['404.html'] = not_found.encode('utf-8')
        files['sitemap.xml'] = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f'  <url><loc>{escape(site_url)}</loc></url>\n'
            f'  <url><loc>{escape(site_url + "about.html")}</loc></url>\n'
            '</urlset>\n').encode('utf-8')
        files['robots.txt'] += f'\nSitemap: {site_url}sitemap.xml\n'.encode('utf-8')
    output = ROOT / 'dist/himco-publish.zip'
    output.parent.mkdir(exist_ok=True)
    with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
        for name, content in files.items():
            archive.writestr(name, content)
    with ZipFile(output) as archive:
        if archive.testzip() is not None:
            raise RuntimeError('ZIP integrity check failed')
    print(f'Created {output} ({output.stat().st_size / 1048576:.2f} MB, {len(files)} files)')
    if not site_url:
        print('Domain-independent package. Rebuild with --site-url once the final domain is selected to include canonical URLs, social images and sitemap.')

if __name__ == '__main__':
    main()
