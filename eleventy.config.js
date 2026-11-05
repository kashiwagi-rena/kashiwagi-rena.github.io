import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import linkcard from "./_config/linkcard.js";
import labels from "./_data/labels.js";
import site from "./_data/site.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(linkcard);

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
  eleventyConfig.ignores.add("kpt-templates/**");
  eleventyConfig.ignores.add("scripts/**");
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

  // KPT は箇条書きで書くことが多いので、段落に限らず見出し以外の本文の先頭を抜粋にする
  eleventyConfig.addFilter("kptExcerpt", (html = "") =>
    html
      .replace(/<h2[^>]*>[\s\S]*?<\/h2>/g, " ")
      .replace(/<\/(?:li|p|ul|ol|blockquote|pre)>/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );

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
    const counts = new Map(labels.map((label) => [label, 0]));
    for (const post of collectionApi.getFilteredByTag("posts")) {
      const postLabels = (post.data.tags || []).filter((tag) => tag !== "posts");
      // ラベルは記事の「種類」なので、1記事に1つだけにする（タブの件数の合計が記事数と一致する）
      if (postLabels.length !== 1) {
        throw new Error(
          `${post.inputPath}：ラベルは1つだけ付けてください（今は ${postLabels.length} 個：${postLabels.join("・") || "なし"}）`
        );
      }
      const [label] = postLabels;
      if (!counts.has(label)) {
        throw new Error(
          `${post.inputPath}：ラベル「${label}」は使えません。使えるのは ${labels.join("・")} です（_data/labels.js）`
        );
      }
      counts.set(label, counts.get(label) + 1);
    }
    // 件数が0のラベルもタブに出すため、並び順は labels.js の順に固定する
    return labels.map((name) => ({ name, count: counts.get(name), slug: tagSlug(name) }));
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
