#!/usr/bin/env python3
"""
ビルドスクリプト:
  gacha-para/ の index.html / styles.css / data.js / app.js と assets の画像を
  すべて 1 つの HTML にまとめ、リポジトリのルートに index.html と
  standalone.html として書き出します（GitHub Pages の公開対象＝ルート）。
  CI（.github/workflows/deploy-pages.yml）がこのスクリプトを実行して公開します。

使い方:
  python3 gacha-para/build.py
出力:
  <repo>/index.html, <repo>/standalone.html
"""
import base64, glob, os

SRC  = os.path.dirname(os.path.abspath(__file__))   # gacha-para/
REPO = os.path.dirname(SRC)                          # リポジトリのルート


def read(name):
    with open(os.path.join(SRC, name), encoding='utf-8') as f:
        return f.read()


# index.html を土台に css/js をインライン化
html = read('index.html')
html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>\n{read("styles.css")}\n</style>')
html = html.replace('<script src="data.js"></script>', f'<script>\n{read("data.js")}\n</script>')
html = html.replace('<script src="app.js"></script>',  f'<script>\n{read("app.js")}\n</script>')

# 画像を data URI として埋め込む（HTML から参照されているものだけ）
for path in glob.glob(os.path.join(SRC, 'assets', 'characters', '*.png')):
    rel = os.path.relpath(path, SRC).replace(os.sep, '/')
    if rel not in html:
        continue
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    html = html.replace(rel, f'data:image/png;base64,{b64}')

# 同じ内容をルートの 2 ファイルに書き出す（公開用 index.html と共有用 standalone.html）
for name in ('index.html', 'standalone.html'):
    with open(os.path.join(REPO, name), 'w', encoding='utf-8') as f:
        f.write(html)

print('生成: index.html / standalone.html (%d bytes)' % len(html.encode('utf-8')))
