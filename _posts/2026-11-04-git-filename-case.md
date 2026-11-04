---
title: git管理のファイル名の大文字・小文字変更問題
tags: [技術系]
---

## ファイル名の大文字・小文字を間違えた時に見ること！

たまに間違えて、gitが認識してくれなくて困っちゃうので、メモしておく<br>
今日も困って、沼ったので、未来の私はかっこよく解決してくれよな！(<s>ファイル名間違えは凡ミスでは？</s>)<br>

## 解決方法

```bash
$ git mv <変更したいファイル名> <変更後のファイル名>

```

**`git mv`コマンド**：git管理しているファイル名をローカル(VSCode)だけで変更してしまうと、元のファイルが追跡できない浮いた状態になってしまう。これを避けるため、gitのコマンドにてファイル名を変更して追跡できるようにしている。

参考：[Git でファイル名の大文字小文字の変更が検出されない](https://qiita.com/lx-sasabo/items/2236926f37be67c777fa)<br>
[【Git】ファイル名の大文字小文字を変更する](https://zenn.dev/aki_artisan/articles/f7a6ff22215d4c)<br>
[開発中にファイル名を変更した際にはgit mvコマンドを使う](https://qiita.com/shuhei_m/items/cbcab614d5f3ee3397f3)<br>
<br>

## gitは、デフォルトでは「大文字・小文字」を認識してくれないらしい

```bash
$ git config -l --local | grep core.ignorecase
core.ignorecase=true
```

多分、このコマンドを叩いたら、`true`になっていることでしょう！<br>
(ignorecase = 大文字小文字を区別しないって意味)

```bash
$ git config core.ignorecase false
```

このコマンドで、`false`にすると区別してくれる！<br>

参考：[Gitでファイル名の大文字・小文字の変更を検知するようにする](https://qiita.com/sawadashota/items/aa312a3b7e2403448efe)
