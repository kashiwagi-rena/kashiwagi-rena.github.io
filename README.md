# Resume Template

履歴書・職務経歴書の土台となる静的サイトのテンプレートです。
HTML / CSS のみで作っており、ビルド不要・無料で GitHub Pages に公開できます。

**Jekyll** で HTML を組み立て、**GitHub Actions** でチェック・ビルド・公開しています。

## ページ構成

| ファイル | 内容 |
| --- | --- |
| `_config.yml` | サイト全体の設定 |
| `_layouts/default.html` | 全ページ共通の枠（`<head>`・ヘッダー・フッター） |
| `_layouts/post.html` | ブログ記事の枠 |
| `_includes/header.html` | ヘッダー（ナビゲーション） |
| `index.html` | トップページ |
| `rirekisho.html` | 履歴書 |
| `shokumu.html` | 職務経歴書 |
| `blog/index.html` | ブログの記事一覧 |
| `_posts/` | ブログ記事（Markdown） |
| `assets/images/` | ブログ用の画像 |
| `css/style.css` | 画面用スタイル（色は `:root` の変数で変更できます） |
| `css/blog.css` | ブログ用スタイル |
| `css/print.css` | 印刷用スタイル（A4） |
| `js/main.js` | 「PDFで保存」ボタンの処理 |

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
- ファイル名の日付が未来だと公開されません
- 本文に `{{` や `{%` を書くとテンプレートの命令として解釈されます。Vue や Liquid のコードを載せるときは、`{% raw %}` 〜 `{% endraw %}` で囲んでください
- `/feed.xml` に RSS が自動で生成されます

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

Jekyll を使っているので、HTML をブラウザで直接開いてもレイアウトが反映されません。
Ruby をインストールしたうえで、次を実行します。

```bash
bundle install
bundle exec jekyll serve
# → http://localhost:4000 で確認できる
```



## CI/CD（GitHub Actions）

`.github/workflows/ci-cd.yml` で次を自動実行します。

| タイミング | 実行内容 |
| --- | --- |
| main への Pull Request | Markdown チェック ＋ ビルド ＋ リンク切れチェック |
| main への push（マージ） | 上記がすべて通ったら GitHub Pages に公開 |

チェックが失敗すると公開されません。手元で同じチェックを実行するには次のコマンドを使います。

```bash
npx markdownlint-cli2 "_posts/**/*.md"
bundle exec jekyll build && bundle exec htmlproofer ./_site --disable-external --no-enforce-https
```

`.github/dependabot.yml` により、Action と gem の更新 PR が月1回自動で作られます。
