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
gacha-para/
├── index.html              画面構造
├── styles.css              デザイン
├── data.js                 キャラ・確率・コストなどの設定（ここを編集）
├── app.js                  ロジック・サウンド・演出
├── build.py                1ファイル版(standalone.html)を作る補助スクリプト
└── assets/
    └── characters/         キャラ画像（01.png 〜 41.png）
```

## 動かし方（ローカル）

画像を相対パスで読み込むため、ファイルを直接開くのではなくローカルサーバ経由で開いてください。

```bash
# このフォルダで
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## GitHub での管理・公開

```bash
git init
git add .
git commit -m "init: gacha-para mock"
git branch -M main
git remote add origin <あなたのリポジトリURL>
git push -u origin main
```

GitHub Pages で公開する場合は、リポジトリの Settings → Pages で
ブランチ `main` / フォルダ `/ (root)` を指定すれば、`index.html` がそのまま公開されます。

## 設定の変え方（`data.js`）

- **確率**: `RARITY` の `tier`（あたり5 / レア25 / 通常70）を編集
- **キャラの出やすさ**: 各キャラの `w`（重み。小さいほど出にくい）を編集
- **コスト / 初期値**: `COST`、`START` を編集
- **PICK UP 表示**: `FEATURED` を変更
- **キャラ画像の差し替え**: 各キャラの `img` を公式素材のパスに変更
  （`assets/characters/` に画像を置く運用を想定）

## 1ファイル版を作る（共有用）

```bash
python3 build.py    # standalone.html を生成
```

`standalone.html` は CSS・JS・画像をすべて埋め込んだ単一ファイルで、
ローカルサーバなしでもそのまま開けます（チャットやメールでの共有に便利）。

## メモ

- 所持データはメモリ上のみで、再読み込みするとリセットされます（保存は今後追加可能）。
- キャラクターの画像・名称などの権利は各権利者に帰属します。利用にあたっては
  必要な許諾の範囲をご確認ください。
