"""Read-only source extraction: text inventory and individual PDF image objects.

Derived review assets go to artifacts, never back into the original PDF/Keynote.
Skips the repeated source background. No whole-page image is served by a deck.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from pypdf import PdfReader

source = Path(sys.argv[1]).resolve(strict=True)
root = Path(__file__).resolve().parents[1]
destination = root / 'artifacts/source/caching-dark-arts'
destination.mkdir(parents=True, exist_ok=True)
text = subprocess.check_output(['pdftotext', '-layout', str(source), '-']).decode()
pages = text.split('\f')
reader = PdfReader(source)
inventory = {'source': source.name, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'pages': []}
for number, page in enumerate(reader.pages, 1):
    entry = {'number': number, 'text': pages[number - 1].strip(), 'images': []}
    resources = page['/Resources'].get_object()
    for name, reference in resources.get('/XObject', {}).items():
        obj = reference.get_object()
        if obj.get('/Subtype') != '/Image' or reference.idnum == 5:
            continue
        image = page.images[name]
        filename = f'page-{number:03d}-object-{reference.idnum}{Path(image.name).suffix}'
        target = destination / filename
        if not target.exists():
            target.write_bytes(image.data)
        entry['images'].append({'object': reference.idnum, 'file': filename,
            'width': obj['/Width'], 'height': obj['/Height'],
            'sha256': hashlib.sha256(image.data).hexdigest()})
    inventory['pages'].append(entry)
(destination / 'source.json').write_text(json.dumps(inventory, indent=2, ensure_ascii=False) + '\n')
print(f'Extracted {len(reader.pages)} source pages; {sum(len(p["images"]) for p in inventory["pages"])} image instances into {destination}')
