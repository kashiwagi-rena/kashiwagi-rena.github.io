---
title: ブログをはじめました
tags: [お知らせ, Jekyll]
# はてなブログから転載する記事は、元のURLを書くと記事の最後にリンクが出ます
# original_url: https://example.hatenablog.com/entry/2026/10/30/000000
---

GitHub Pages と Jekyll でブログを作りました。この記事は**書き方のサンプル**です。
最初の段落は、記事一覧に「抜粋」として表示されます。

## 記事の追加のしかた

`_posts` フォルダに、次の名前で Markdown ファイルを作って push するだけです。

```
_posts/YYYY-MM-DD-英数字のタイトル.md
```

ファイルの先頭には、`---` で囲んだ **Front Matter**（記事の設定）を書きます。

```yaml
---
title: 記事のタイトル
tags: [JavaScript, 学習メモ]
---
```

## コードブロック

````md
```js
// 言語名を書くと色が付きます
```
````

```js
const greet = (name) => {
  // テンプレートリテラルで文字列を組み立てる
  return `こんにちは、${name}さん`;
};
console.log(greet("Jekyll"));
```

## 画像

画像は `assets/images/` に置いて、次のように書きます。

```md
![画像の説明](/assets/images/sample.png)
```

> ⚠️ スマホで撮った写真には位置情報（EXIF）が含まれていることがあります。
> 公開する前に削除しておきましょう。

## 表

| 書き方 | 意味 |
| --- | --- |
| `**太字**` | **太字** |
| `` `code` `` | `code` |
