# ガチャパラ（GACHA PARA）— モック

ぷにともつーしんのキャラクターを使ったガチャアプリのプロトタイプです。
HTML / CSS / バニラ JS のみで動作し、ビルド不要でブラウザだけで動きます。
効果音は Web Audio API で合成しているため、音声ファイルは含みません。

## 主な機能

- ガチャ抽選（1回 / 10連 / チケット）と溜め演出つきの開封
- レアリティ別の演出（通常＝青 / レア＝金 / あたり＝レインボー全画面）
- コレクション（所持数・コンプ率）
- 提供割合の表示
- ショップ（テスト用のコイン／チケット補充）・設定（サウンド、リセット）

## ディレクトリ構成

```
（リポジトリのルート）
├── index.html              ← build.py が生成（公開用・gitignore）
├── standalone.html         ← build.py が生成（共有用・gitignore）
├── .github/workflows/
│   └── deploy-pages.yml     push で build.py を実行し GitHub Pages へ公開
└── gacha-para/             ソース（ここを編集する）
    ├── index.html              画面構造
    ├── styles.css              デザイン
    ├── data.js                 キャラ・確率・コストなどの設定（ここを編集）
    ├── app.js                  ロジック・サウンド・演出
    ├── build.py                ルートの index.html / standalone.html を生成
    └── assets/
        └── characters/         キャラ画像（01.png 〜 42.png）
```

> ルートの `index.html` / `standalone.html` は `build.py` の生成物です。手で編集・コミットせず、`gacha-para/` のソースを編集してください。

## 動かし方（ローカル）

画像を相対パスで読み込むため、ファイルを直接開くのではなくローカルサーバ経由で開いてください。

```bash
# このフォルダで
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## GitHub での公開（自動）

`main` へ push すると、GitHub Actions（`.github/workflows/deploy-pages.yml`）が
`build.py` を実行してルートの `index.html` を生成し、GitHub Pages へ自動デプロイします。
Pages が未設定でも初回実行時に自動で有効化されます（ソース＝GitHub Actions）。

公開のために手元で行うことは「`gacha-para/` のソースを編集して push する」だけです。
ルートの生成物を手でコミットする必要はありません。

## 設定の変え方（`data.js`）

- **確率**: `RARITY` の `tier`（あたり5 / レア25 / 通常70）を編集
- **キャラの出やすさ**: 各キャラの `w`（重み。小さいほど出にくい）を編集
- **コスト / 初期値**: `COST`、`START` を編集
- **PICK UP 表示**: `FEATURED` を変更
- **キャラ画像の差し替え**: 各キャラの `img` を公式素材のパスに変更
  （`assets/characters/` に画像を置く運用を想定）

## 1ファイル版を作る（共有用）

```bash
python3 gacha-para/build.py    # ルートに index.html / standalone.html を生成
```

`standalone.html` は CSS・JS・画像をすべて埋め込んだ単一ファイルで、
ローカルサーバなしでもそのまま開けます（チャットやメールでの共有に便利）。
`index.html` は GitHub Pages の公開用で、内容は同一です。

## メモ

- 所持データはメモリ上のみで、再読み込みするとリセットされます（保存は今後追加可能）。
- キャラクターの画像・名称などの権利は各権利者に帰属します。利用にあたっては
  必要な許諾の範囲をご確認ください。
