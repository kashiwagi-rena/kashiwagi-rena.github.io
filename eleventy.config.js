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
