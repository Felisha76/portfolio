import os
import re
from glob import glob

# EPUB OEBPS mappa
OEBPS_PATH = os.path.join(os.path.dirname(__file__), 'OEBPS')

# Minden .xhtml fájl
xhtml_files = glob(os.path.join(OEBPS_PATH, '*.xhtml'))

# Regex a matrix transformhoz
matrix_re = re.compile(r'transform\s*=\s*"matrix\(([^)]+)\)"')

def fix_transform_attr(match):
    values = match.group(1).split(',')
    if len(values) == 6:
        scaleX = float(values[0])
        scaleY = float(values[3])
        avg_scale = (scaleX + scaleY) / 2
        # Az átlagot mindkét tengelyen alkalmazzuk
        new_matrix = f'matrix({avg_scale},{values[1]},{values[2]},{avg_scale},{values[4]},{values[5]})'
        return f'transform="{new_matrix}"'
    return match.group(0)

for file_path in xhtml_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Csak az <image ...> tageken belül cseréljük
    new_content = re.sub(r'(<image[^>]*?)\s+transform\s*=\s*"matrix\([^)]+\)"',
                        lambda m: matrix_re.sub(fix_transform_attr, m.group(0)),
                        content)
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Javítva: {os.path.basename(file_path)}')
print('SVG image transform javítás kész!')
