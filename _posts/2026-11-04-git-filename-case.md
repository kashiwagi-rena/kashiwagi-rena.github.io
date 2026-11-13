---
title: git管理のファイル名の大文字・小文字変更問題
tags: [技術系]
original_url: "https://a-nnmgmg8989.hatenablog.com/entry/2025/12/05/002229"
---

## ファイル名の大文字・小文字を間違えた時に見ること！

たまに間違えて、gitが認識してくれなくて困っちゃうので、メモしておく<br>
今日も困って、沼ったので、未来の私はかっこよく解決してくれよな！(<s>ファイル名間違えは凡ミスでは？</s>)<br>

## 解決方法

```bash
$ git mv <変更したいファイル名> <変更後のファイル名>

```

**`git mv`コマンド**：大文字・小文字だけをローカル(VSCode)で変更すると、Mac・Windowsではgitが変更に気づいてくれない（`git status`に何も出ない）。名前ごと変えた場合も、`git add`するまでは「元のファイルの削除＋新しいファイル」に見えてしまう。`git mv`なら、gitに「名前を変えた」と伝えられるので、ちゃんと記録される！

参考：[Git でファイル名の大文字小文字の変更が検出されない](https://qiita.com/lx-sasabo/items/2236926f37be67c777fa)<br>
[【Git】ファイル名の大文字小文字を変更する](https://zenn.dev/aki_artisan/articles/f7a6ff22215d4c)<br>
[開発中にファイル名を変更した際にはgit mvコマンドを使う](https://qiita.com/shuhei_m/items/cbcab614d5f3ee3397f3)<br>
<br>

## Mac・Windowsのgitは「大文字・小文字」の変更に気づいてくれないらしい

```bash
$ git config -l --local | grep core.ignorecase
core.ignorecase=true
```

Mac・Windowsでこのコマンドを叩いたら、多分`true`になっていることでしょう！<br>
(ignorecase = 大文字小文字を区別しないって意味)<br>
gitが勝手に区別しないわけじゃなくて、`git init`や`git clone`のときに、PCのファイルシステムに合わせて自動で決めているらしい（Mac・Windowsは`true`、Linuxは`false`）。

```bash
$ git config core.ignorecase false
```

このコマンドで`false`にすると区別してくれる……けど、**Mac・Windowsではやらないほうがいい！**<br>
OSのほうは区別しないままなので、`Readme.md`と`README.md`が別ファイルとして両方commitされる事故が起きることがあるらしい。<br>
なので、ファイル名の変更は素直に`git mv`を使う！

参考：[Gitでファイル名の大文字・小文字の変更を検知するようにする](https://qiita.com/sawadashota/items/aa312a3b7e2403448efe)<br>
[git-config の core.ignoreCase（Git 公式ドキュメント）](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreignoreCase)
