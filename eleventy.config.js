// =========================================================
// Eleventy（11ty）の設定ファイル
//   ローカル確認：npm start → http://localhost:8080
//   ビルド　　　：npm run build → _site/ に HTML が出力される
// =========================================================
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import site from "./_data/site.js";

export default function (eleventyConfig) {
  // ---------- プラグイン ----------
  // コードブロックの色付け（Prism）
  eleventyConfig.addPlugin(syntaxHighlight);

  // RSS（/feed.xml）を自動生成
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "ja",
      title: site.title,
      subtitle: site.description,
      base: site.url,
      author: { name: site.author },
    },
  });

  // ---------- そのままコピーするファイル ----------
  // 履歴書・職務経歴書は「テンプレートとして処理しない」単体HTML。
  // private/ にコピーして手元で開けるようにするため、あえてレイアウトを使っていない
  eleventyConfig.addPassthroughCopy("rirekisho.html");
  eleventyConfig.addPassthroughCopy("shokumu.html");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");

  // ---------- サイトとして処理しないファイル ----------
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("private/**");
  // 単体HTMLはテンプレートとして処理せず、上の addPassthroughCopy でそのままコピーする
  eleventyConfig.ignores.add("rirekisho.html");
  eleventyConfig.ignores.add("shokumu.html");

  // ---------- フィルター（テンプレートの中で使う関数） ----------
  // 日付を ISO 8601 形式に（<time datetime="..."> 用）
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString());

  // 日付を 2026.10.30 の形式に
  // ファイル名の日付は UTC の 0 時として読み込まれるので、UTC で表示する
  eleventyConfig.addFilter("displayDate", (date) => {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`;
  });

  // 記事のURL用に 2026/10 の形式に
  eleventyConfig.addFilter("yearMonthPath", (date) => {
    const d = new Date(date);
    return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  });

  // 記事の最初の段落を抜粋として取り出す
  eleventyConfig.addFilter("excerpt", (html = "") => {
    const firstParagraph = html.match(/<p>([\s\S]*?)<\/p>/);
    return firstParagraph ? firstParagraph[1].replace(/<[^>]+>/g, "").trim() : "";
  });

  // タグの一覧から、内部用の "posts" タグを取り除く
  eleventyConfig.addFilter("displayTags", (tags = []) =>
    tags.filter((tag) => tag !== "posts")
  );

  // ---------- タグ ----------
  // タグ名 → URL に使える文字列（例：「学習 メモ」→「学習-メモ」）
  // 🔐 「../」や「/」が入ったタグで、意図しない場所にページが作られないように記号を取り除く
  const tagSlug = (tag) =>
    String(tag)
      .trim()
      .toLowerCase()
      .replace(/[\s　]+/g, "-")
      .replace(/[\/\\?#%&:*"<>|.]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  eleventyConfig.addFilter("tagSlug", tagSlug);

  // 全記事のタグを集めて「タグ名・件数・URL用の文字列」の一覧を作る（件数の多い順）
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const counts = new Map();
    for (const post of collectionApi.getFilteredByTag("posts")) {
      for (const tag of post.data.tags || []) {
        if (tag === "posts") continue;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    const list = [...counts].map(([name, count]) => ({ name, count, slug: tagSlug(name) }));
    // 記号だけのタグなど、URL にできないものは除外し、同じ URL になるタグがあればビルドを止める
    const seen = new Map();
    for (const tag of list) {
      if (!tag.slug) throw new Error(`タグ「${tag.name}」は URL にできる文字を含んでいません`);
      if (seen.has(tag.slug)) {
        throw new Error(`タグ「${seen.get(tag.slug)}」と「${tag.name}」が同じ URL になります`);
      }
      seen.set(tag.slug, tag.name);
    }
    return list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site",
    },
    // Markdown・HTML の中では Liquid が使える（Jekyll と同じ書き方）
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
}
