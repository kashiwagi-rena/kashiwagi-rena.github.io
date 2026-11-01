import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import site from "./_data/site.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

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

  // 履歴書・職務経歴書は「テンプレートとして処理しない」単体HTML。
  // private/ にコピーして手元で開けるようにするため、あえてレイアウトを使っていない
  eleventyConfig.addPassthroughCopy("rirekisho.html");
  eleventyConfig.addPassthroughCopy("shokumu.html");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("private/**");
  // 単体HTMLはテンプレートとして処理せず、上の addPassthroughCopy でそのままコピーする
  eleventyConfig.ignores.add("rirekisho.html");
  eleventyConfig.ignores.add("shokumu.html");

  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString());

  // ファイル名の日付は UTC の 0 時として読み込まれるので、UTC で表示する
  eleventyConfig.addFilter("displayDate", (date) => {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`;
  });

  eleventyConfig.addFilter("yearMonthPath", (date) => {
    const d = new Date(date);
    return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  });

  eleventyConfig.addFilter("excerpt", (html = "") => {
    const firstParagraph = html.match(/<p>([\s\S]*?)<\/p>/);
    return firstParagraph ? firstParagraph[1].replace(/<[^>]+>/g, "").trim() : "";
  });

  // "posts" は記事一覧を作るための内部用タグなので表示しない
  eleventyConfig.addFilter("displayTags", (tags = []) =>
    tags.filter((tag) => tag !== "posts")
  );

  // 中身が変わると URL も変わるようにして、ブラウザに古いキャッシュを使わせない
  const hashCache = new Map();
  eleventyConfig.on("eleventy.before", () => hashCache.clear()); // npm start 中の再ビルドに対応
  eleventyConfig.addFilter("withHash", (urlPath) => {
    if (!hashCache.has(urlPath)) {
      const content = readFileSync(`.${urlPath}`);
      hashCache.set(urlPath, createHash("sha256").update(content).digest("hex").slice(0, 8));
    }
    return `${urlPath}?v=${hashCache.get(urlPath)}`;
  });

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

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const counts = new Map();
    for (const post of collectionApi.getFilteredByTag("posts")) {
      for (const tag of post.data.tags || []) {
        if (tag === "posts") continue;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    const list = [...counts].map(([name, count]) => ({ name, count, slug: tagSlug(name) }));
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
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
}
