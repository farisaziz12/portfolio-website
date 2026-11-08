"""One-off, lossless PPTX inventory/media extraction. Never writes slides.md.

Usage: python3 scripts/extract-payments-source.py /absolute/source.pptx
Only selected source media are served by the deck. MP4s remain in the source
PPTX because this migration intentionally uses static demo placeholders.
"""
import hashlib
import json
from pathlib import Path
import posixpath
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DECK = ROOT / 'decks/orchestrating-payments'
NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
ASSETS = {
    'image4.png': 'speaker-montage.png', 'image5.png': 'smallpdf-logo.png',
    'image6.png': 'raycast-logo.png', 'image7.png': 'zurichjs-logo.png',
    'image8.png': 'stripe-community-logo.png',
    'image9.png': 'braintree-errors.png', 'image10.png': 'subscriptions-metric.png',
    'image11.png': 'alipay.png', 'image12.png': 'uptime-calculator.png',
    'image13.png': 'stripe-incidents.png', 'image14.png': 'paypal-incidents.png',
    'image1.tif': 'air-traffic-control.png',
    'image15.png': 'stripe.png', 'image16.png': 'revolut.png', 'image17.png': 'adyen.png',
    'image32.png': 'checkout-demo-poster.png', 'image33.png': 'failover-demo-poster.png',
    'image2.tif': 'chaos-demo.png', 'image34.png': 'contact-qr.png',
}

def paragraphs(element):
    return [''.join(t.text or '' for t in p.findall('.//a:t', NS))
            for p in element.findall('.//a:p', NS)]

def main():
    source = Path(sys.argv[1]).resolve(strict=True)
    output = DECK / 'migration/source.json'
    if output.exists():
        raise SystemExit('Source inventory already exists; refusing to overwrite.')
    media = DECK / 'public/media'
    media.mkdir(parents=True, exist_ok=True)
    output.parent.mkdir(parents=True, exist_ok=True)
    inventory = {'source': source.name, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                 'slides': [], 'assets': []}
    with zipfile.ZipFile(source) as archive:
        rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(archive.read('ppt/_rels/presentation.xml.rels'))}
        ids = ET.fromstring(archive.read('ppt/presentation.xml')).findall('p:sldIdLst/p:sldId', NS)
        for number, slide_id in enumerate(ids, 1):
            name = posixpath.normpath('ppt/' + rels[slide_id.get('{'+NS['r']+'}id')])
            xml = ET.fromstring(archive.read(name))
            directory, filename = posixpath.split(name)
            relationships = ET.fromstring(archive.read(f'{directory}/_rels/{filename}.rels'))
            notes = []
            assets = []
            for rel in relationships:
                target = posixpath.normpath(directory + '/' + rel.get('Target'))
                if 'notesSlide' in rel.get('Type'):
                    nx = ET.fromstring(archive.read(target))
                    for shape in nx.findall('.//p:sp', NS):
                        ph = shape.find('.//p:ph', NS)
                        if ph is not None and ph.get('type') == 'body':
                            notes.extend(paragraphs(shape))
                elif target.startswith('ppt/media/'):
                    assets.append(target)
            inventory['slides'].append({'number': number, 'part': name,
                'text': paragraphs(xml), 'notes': '\n'.join(notes), 'media': sorted(set(assets))})
        for original, filename in ASSETS.items():
            data = archive.read('ppt/media/' + original)
            destination = media / filename
            if destination.exists():
                raise SystemExit(f'Refusing to overwrite {destination}')
            if original.endswith('.tif'):
                with tempfile.TemporaryDirectory(prefix='payments-tiff-') as tmp:
                    original_file = Path(tmp) / original
                    original_file.write_bytes(data)
                    subprocess.run(['sips', '-s', 'format', 'png', str(original_file), '--out', str(destination)], check=True)
            else:
                destination.write_bytes(data)
            inventory['assets'].append({'source': 'ppt/media/' + original, 'output': 'public/media/' + filename,
                'sourceSha256': hashlib.sha256(data).hexdigest(),
                'outputSha256': hashlib.sha256(destination.read_bytes()).hexdigest(),
                'conversion': 'TIFF to PNG, no resize or crop' if original.endswith('.tif') else 'byte-for-byte'})
    output.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n')
    print(f'Inventoried {len(inventory["slides"])} slides; extracted {len(ASSETS)} images; no video extraction.')

if __name__ == '__main__':
    main()
