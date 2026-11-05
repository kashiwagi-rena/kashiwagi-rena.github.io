# KPT のテンプレート置き場

`YYYY-MM.yml`（例：`2026-12.yml`）という名前で置いておくと、その月になったときに
自動で投稿フォーム（`.github/ISSUE_TEMPLATE/kpt.yml`）に差し替わります。

- 毎日 0:17（日本時間）にチェックし、今月のファイルがあってフォームと違えば差し替えます
- 今月のファイルがなければ、前のテンプレートをそのまま使い続けます
- 先の月の分を、前もって登録しておいて大丈夫です

## 書き方

形式は GitHub の Issue フォームと同じです（[構文](https://docs.github.com/ja/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)）。

- `labels: ["kpt"]` は消さないでください（このラベルが付いた Issue だけが KPT として公開されます）
- 項目（`label`）は自由に増やしたり変えたりできます。記事では、項目の名前がそのまま見出しになります
- `label: 日付` の項目は、記事の日付として使われます（空欄なら投稿した日）
- 過去の KPT は、書いたときの項目のまま残ります
