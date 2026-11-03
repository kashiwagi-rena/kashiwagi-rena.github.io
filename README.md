# Resume Template

履歴書・職務経歴書の土台となる静的サイトのテンプレートです。
**Eleventy（11ty / Node.js）** で HTML を組み立て、**GitHub Actions** でチェック・ビルドして GitHub Pages に無料で公開しています。

## ページ構成

| ファイル | 内容 |
| --- | --- |
| `eleventy.config.js` | Eleventy の設定（プラグイン・フィルターなど） |
| `_data/site.js` | サイト名・URLなど全体の情報 |
| `package.json` | 使っている npm パッケージと、`npm run` で使うコマンド |
| `_layouts/default.html` | 全ページ共通の枠（`<head>`・ヘッダー・フッター） |
| `_layouts/post.html` | ブログ記事の枠 |
| `_includes/header.html` | ヘッダー（ナビゲーション） |
| `_includes/tag-nav.html` | ブログのタグのタブ |
| `_includes/post-card.html` | 記事一覧のカード |
| `index.html` | トップページ |
| `rirekisho.html` | 履歴書 |
| `shokumu.html` | 職務経歴書 |
| `blog/index.html` | ブログの記事一覧 |
| `calendar/index.html` | カレンダー（月単位の表）と運動の記録 |
| `js/calendar.js` | カレンダーの表示と、運動の記録の保存・集計 |
| `css/calendar.css` | カレンダー用スタイル |
| `blog/tags.html` | タグごとの記事一覧（タグの数だけページを自動生成） |
| `_posts/` | ブログ記事（Markdown） |
| `_posts/_posts.json` | 記事全体に共通の設定（レイアウト・URLの形） |
| `assets/images/` | ブログ用の画像 |
| `css/style.css` | 画面用スタイル（色は `:root` の変数で変更できます） |
| `css/blog.css` | ブログ用スタイル |
| `css/print.css` | 印刷用スタイル（A4） |
| `js/main.js` | 「PDFで保存」ボタン・スマホのハンバーガーメニューの処理 |

## 運動の記録（カレンダー）

カレンダーの日付を選び、ピラティス・ランニング・ウォーキングのボタンを押すと記録されます。

- 記録は **ブラウザの localStorage にだけ** 保存します（キー：`exercise-log:v1`）。サーバーや GitHub には送りません
- そのため、**別の端末・別のブラウザとは共有されません**。ブラウザのデータを消すと記録も消えます
- 未来の日付は記録できません
- **「CSVに書き出す」でバックアップ**、**「CSVから読み込む」で復元・別の端末への移行**ができます
  - 形式：`日付,ピラティス,ランニング,ウォーキング`（やった日は `1`、やっていない日は `0`）。Excel で開けるよう BOM 付き UTF-8
  - 読み込みは今の記録に**追加**します（上書きしません）。形式が違う行・未来の日付の行は読み飛ばします
  - CSV には健康に関わる記録が入るので、`.gitignore` で Git に入らないようにしています

## CSS・JS のキャッシュ対策

レイアウトで読み込む CSS・JS には、ファイルの中身から作ったハッシュ値が自動で付きます（例：`/css/blog.css?v=957616bb`）。
中身を変えると URL も変わるので、ブラウザに古いファイルが残っていても新しいほうが読み込まれます。
CSS・JS を新しく追加したときは、`_layouts/default.html` で `| withHash` を付けて読み込んでください。

## ブログ記事の書き方

`_posts/YYYY-MM-DD-英数字のタイトル.md` を作って push するだけです。

```md
---
title: 記事のタイトル
tags: [JavaScript, 学習メモ]
---

本文（最初の段落が一覧の抜粋になります）
```

- 公開URLは `/blog/YYYY/MM/英数字のタイトル/` になります
- 本文に `{{` や `{%` を書くとテンプレートの命令として解釈されます。Vue や Liquid のコードを載せるときは、`{% raw %}` 〜 `{% endraw %}` で囲んでください
- `/feed.xml` に RSS（Atom）が自動で生成されます
- `tags` に書いたタグごとに、`/blog/tags/タグ名/` の一覧ページが自動で作られます（英字は小文字、スペースは `-`、記号は削除）
- 違うタグが同じURLになる場合（例：`C#` と `C`）はビルドがエラーで止まります。タグ名を変えてください

### はてなブログから移行する場合

1. はてなブログの「設定 → 詳細設定 → エクスポート」で記事をダウンロードする（Movable Type 形式）
2. 記事ごとに Markdown へ変換して `_posts/` に置く
3. Front Matter に `original_url: 元記事のURL` を書くと、記事の最後に転載元のリンクが表示されます
4. 画像ははてなフォトライフにあります。直リンクのままにせず、`assets/images/` に保存し直すと安全です

## ⚠️ 個人情報の扱い（重要）

このリポジトリは **public（誰でも閲覧可能）** です。
住所・電話番号・生年月日・メールアドレス・顔写真などは **絶対に commit しないでください。**
一度 push すると、ファイルを消しても Git の履歴に残ります。

### 実データで書類を作る手順

```bash
# 1. 実データ用のフォルダを作る（.gitignore で Git の管理対象外になっている）
mkdir private
cp -r css js private/
cp rirekisho.html shokumu.html private/

# 2. private/ 内の HTML を自分の情報に書き換える

# 3. ブラウザで private/rirekisho.html を開き「PDFで保存」→ 印刷ダイアログで「PDFに保存」
```

commit 前に `git status` を実行し、`private/` が表示されないことを確認する習慣をつけましょう。

## PDF 化のコツ

- 印刷ダイアログで **「背景のグラフィック」をオン** にすると色が反映されます
- 「ヘッダーとフッター」はオフにすると URL や日付が印字されません
- 用紙サイズは A4

## ローカルで確認する

Node.js 22 以降が必要です（`.nvmrc` にバージョンを書いてあります）。

```bash
npm ci        # package-lock.json どおりにパッケージをインストール
npm start     # → http://localhost:8080 で確認できる（保存すると自動で再読み込み）
npm test      # CI と同じチェック（Markdown → ビルド → リンク切れ）
```

## CI/CD（GitHub Actions）

`.github/workflows/ci-cd.yml` で次を自動実行します。

| タイミング | 実行内容 |
| --- | --- |
| main への Pull Request | Markdown チェック ＋ ビルド ＋ リンク切れチェック |
| main への push（マージ） | 上記がすべて通ったら GitHub Pages に公開 |

チェックが失敗すると公開されません。

`.github/dependabot.yml` により、Action と npm パッケージの更新 PR が月1回自動で作られます。

### セキュリティチェック

`.github/workflows/security.yml` で、PR・main への push・毎週月曜に次を実行します。

| チェック | 失敗する条件 |
| --- | --- |
| `npm audit signatures` | パッケージの署名が検証できない（改ざんの疑い） |
| `npm audit --audit-level=critical` | critical の脆弱性がある |

high 以下の脆弱性は失敗にせず、Actions の実行結果の Summary にレポートを表示します。
