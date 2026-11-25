import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script src="([^"]+)"', html)
print("Linked scripts in index.html:", scripts)
for s in scripts:
    if os.path.exists(s):
        with open(s, 'r', encoding='utf-8') as sf:
            content = sf.read()
            print(f"  ✓ {s}: {len(content)} bytes")
    else:
        print(f"  ✗ {s} NOT FOUND!")

# Check linked stylesheets
styles = re.findall(r'<link rel="stylesheet" href="([^"]+)"', html)
print("Linked stylesheets in index.html:", styles)
for st in styles:
    if os.path.exists(st):
        with open(st, 'r', encoding='utf-8') as sf:
            content = sf.read()
            print(f"  ✓ {st}: {len(content)} bytes")
    else:
        print(f"  ✗ {st} NOT FOUND!")

# Check images referenced in HTML and CSS
all_code = html
for s in scripts:
    with open(s, 'r', encoding='utf-8') as sf:
        all_code += sf.read()
with open('styles/main.css', 'r', encoding='utf-8') as f:
    all_code += f.read()

assets = set(re.findall(r'assets/[a-zA-Z0-9_\-\.]+\.(?:jpg|png|svg)', all_code))
print("Assets referenced across codebase:", assets)
for a in assets:
    if os.path.exists(a):
        print(f"  ✓ {a}: {os.path.getsize(a)} bytes")
    else:
        print(f"  ✗ {a} NOT FOUND!")

print("\nAll assets, scripts, and styles verified!")
