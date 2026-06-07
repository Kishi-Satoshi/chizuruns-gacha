#!/usr/bin/env python3
"""
ビルドスクリプト:
  index.html / styles.css / data.js / app.js と assets の画像を
  すべて 1 つの standalone.html にまとめます（共有・プレビュー用）。

使い方:
  python3 build.py
出力:
  standalone.html
"""
import base64, glob, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))

def read(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()

html = read('index.html')
css  = read('styles.css')
data = read('data.js')
app  = read('app.js')

# inline css / js
html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>\n{css}\n</style>')
html = html.replace('<script src="data.js"></script>', f'<script>\n{data}\n</script>')
html = html.replace('<script src="app.js"></script>',  f'<script>\n{app}\n</script>')

# inline images as data URIs
for path in glob.glob(os.path.join(ROOT, 'assets', 'characters', '*.png')):
    rel = os.path.relpath(path, ROOT).replace(os.sep, '/')
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    html = html.replace(rel, f'data:image/png;base64,{b64}')

with open(os.path.join(ROOT, 'standalone.html'), 'w', encoding='utf-8') as f:
    f.write(html)

print('standalone.html を生成しました (%d bytes)' % len(html.encode('utf-8')))
