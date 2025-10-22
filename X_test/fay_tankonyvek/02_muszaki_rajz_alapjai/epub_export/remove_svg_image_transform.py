import os
import re
from glob import glob

OEBPS_PATH = os.path.join(os.path.dirname(__file__), 'OEBPS')
xhtml_files = glob(os.path.join(OEBPS_PATH, '*.xhtml'))

# Regex az <image ... transform="..."> attribútum eltávolításához
image_transform_re = re.compile(r'(<image[^>]*?)\s+transform="[^"]*"')

def remove_transform_attr(match):
    return match.group(1)

for file_path in xhtml_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Minden <image ... transform="..."> attribútumot eltávolít
    new_content = image_transform_re.sub(remove_transform_attr, content)
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Transform eltávolítva: {os.path.basename(file_path)}')
print('SVG <image> transform attribútumok eltávolítva!')
