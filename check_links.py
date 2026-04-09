import os, re, pathlib

pages = ['index.html','makeup-hair.html','kosmetika.html','kurz-liceni.html',
         'portfolio.html','produkty.html','o-mne.html','kontakt.html','oboci.html',
         'chemicky-peeling.html','404.html']

existing = set()
for p in pathlib.Path('.').rglob('*'):
    if p.is_file():
        existing.add(p.as_posix().lstrip('./'))

broken = []
for page in pages:
    if not os.path.exists(page):
        continue
    content = open(page, encoding='utf-8').read()
    # Hledej href="..." a src="..."
    links = re.findall(r'(?:href|src)="([^"]+)"', content)
    for link in links:
        # Přeskoč external, tel, mailto, data, anchor
        if link.startswith(('http', 'tel:', 'mailto:', 'data:', '//', '#')):
            continue
        # Přeskoč anchor v URL
        link = link.split('#')[0]
        if not link:
            continue
        # Zkontroluj existence
        if link in existing:
            continue
        # Zkontroluj s .html (pro čisté URL interní linky)
        if link + '.html' in existing:
            continue
        broken.append((page, link))

if broken:
    for p, l in broken:
        print(f"  {p}  ->  {l}")
else:
    print("OK — žádné broken links")
