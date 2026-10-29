# Resume Template

履歴書・職務経歴書の土台となる静的サイトのテンプレートです。
HTML / CSS のみで作っており、ビルド不要・無料で GitHub Pages に公開できます。

## ページ構成

| ファイル | 内容 |
| --- | --- |
| `index.html` | トップページ |
| `rirekisho.html` | 履歴書 |
| `shokumu.html` | 職務経歴書 |
| `css/style.css` | 画面用スタイル（色は `:root` の変数で変更できます） |
| `css/print.css` | 印刷用スタイル（A4） |
| `js/main.js` | 「PDFで保存」ボタンの処理 |

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

`index.html` をブラウザで直接開くだけで確認できます。
