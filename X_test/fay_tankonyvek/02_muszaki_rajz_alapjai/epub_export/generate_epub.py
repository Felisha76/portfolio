import os
import re
from bs4 import BeautifulSoup

# Input and output paths
HTML_PATH = r'd:\____ORSI\____TANULÁS\GITHUB\portfolio\X_test\fay_tankonyvek\02_muszaki_rajz_alapjai\02_Muszaki-rajz-alapjai.67025187.html'
OEBPS_PATH = os.path.join(os.path.dirname(__file__), 'OEBPS')
NAV_FILE = '000_nav.xhtml'
OPF_FILE = 'content.opf'

def split_pages(html):
	soup = BeautifulSoup(html, 'html.parser')
	pages = soup.find_all('div', class_='page')
	return pages

def write_xhtml(page_content, idx):
	filename = f'{idx:03}.xhtml'
	filepath = os.path.join(OEBPS_PATH, filename)
	# Basic XHTML wrapper
	xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Page {idx:03}</title></head>
<body>
{page_content}
</body>
</html>'''
	with open(filepath, 'w', encoding='utf-8') as f:
		f.write(xhtml)
	return filename

def generate_nav(page_files):
	nav_items = '\n'.join([
		f'<li><a href="{fname}">{fname}</a></li>' for fname in page_files
	])
	nav_xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Tartalomjegyzék</title></head>
<body>
<nav epub:type="toc" id="toc">
<h1>Tartalomjegyzék</h1>
<ol>
{nav_items}
</ol>
</nav>
</body>
</html>'''
	with open(os.path.join(OEBPS_PATH, NAV_FILE), 'w', encoding='utf-8') as f:
		f.write(nav_xhtml)

def update_opf(page_files):
	opf_path = os.path.join(OEBPS_PATH, OPF_FILE)
	with open(opf_path, 'r', encoding='utf-8') as f:
		opf = f.read()
	# Insert manifest items
	manifest_items = '\n'.join([
		f'    <item id="page{idx:03}" href="{fname}" media-type="application/xhtml+xml"/>'
		for idx, fname in enumerate(page_files, 1)
	])
	# Insert spine items
	spine_items = '\n'.join([
		f'    <itemref idref="page{idx:03}"/>'
		for idx in range(1, len(page_files)+1)
	])
	# Replace placeholders in opf
	opf = re.sub(r'(<!-- Oldal fájlok itt lesznek felsorolva -->)', manifest_items, opf, count=1)
	opf = re.sub(r'(<!-- Oldal fájlok itt lesznek felsorolva -->)', spine_items, opf, count=1)
	with open(opf_path, 'w', encoding='utf-8') as f:
		f.write(opf)

def main():
	# Read HTML
	with open(HTML_PATH, 'r', encoding='utf-8') as f:
		html = f.read()
	# Split pages
	pages = split_pages(html)
	page_files = []
	for idx, page in enumerate(pages, 1):
		page_files.append(write_xhtml(str(page), idx))
	# Generate nav
	generate_nav(page_files)
	# Update OPF
	update_opf(page_files)
	print(f'Generated {len(page_files)} pages and nav file.')

if __name__ == '__main__':
	main()
