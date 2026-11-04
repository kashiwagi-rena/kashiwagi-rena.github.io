// 記事の中に {% linkcard "https://..." %} と書くと、リンク先のタイトル・説明・画像をカードで表示する
// 情報はビルド時に1回だけ取得してキャッシュする（閲覧のたびに相手のサイトへアクセスしないため）
import Fetch from "@11ty/eleventy-fetch";

const TIMEOUT_MS = 10_000;

// 🔐 外から取ってきた文字列は、HTML として解釈されないように必ずエスケープしてから埋め込む
const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// 取得した HTML の中の文字参照（&amp; など）を元の文字に戻す。戻した後で escapeHtml を通す
const decodeEntities = (value = "") =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&");

const findMeta = (html, keys) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (!name || !keys.includes(name)) continue;
    const content = tag.match(/\bcontent\s*=\s*(["'])([\s\S]*?)\1/i)?.[2];
    if (content) return decodeEntities(content).trim();
  }
  return "";
};

// 🔐 http(s) 以外（javascript: など）は href や src に入れない
const toSafeUrl = (value, base) => {
  // 空文字を base 付きで URL にすると base 自身になってしまうので、先に弾く
  if (!value) return null;
  try {
    const url = new URL(value, base);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
};

const truncate = (text, max) => (text.length > max ? `${text.slice(0, max)}…` : text);

export default function linkcard(eleventyConfig) {
  eleventyConfig.addAsyncShortcode("linkcard", async (href) => {
    const url = toSafeUrl(href);
    if (!url) throw new Error(`linkcard：「${href}」は http(s) の URL ではありません`);

    let title = "";
    let description = "";
    let image = null;
    try {
      const html = await Fetch(url.href, {
        duration: "1w",
        type: "text",
        fetchOptions: {
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: { "user-agent": "Mozilla/5.0 (compatible; linkcard-bot)" },
        },
      });
      title = findMeta(html, ["og:title", "twitter:title"]) ||
        decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
      description = findMeta(html, ["og:description", "twitter:description", "description"]);
      image = toSafeUrl(findMeta(html, ["og:image", "twitter:image"]), url);
    } catch (error) {
      // 相手のサイトが落ちていても記事のビルドは止めず、URL だけのカードにする
      console.warn(`[linkcard] ${url.href} の情報を取得できませんでした：${error.message}`);
    }

    const imageHtml = image
      ? `<img class="linkcard__image" src="${escapeHtml(image.href)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`
      : "";
    // Markdown の中に置くので、空行を含めず1行の HTML として返す
    return [
      `<a class="linkcard" href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">`,
      `<span class="linkcard__body">`,
      `<span class="linkcard__title">${escapeHtml(truncate(title || url.href, 100))}</span>`,
      description ? `<span class="linkcard__description">${escapeHtml(truncate(description, 120))}</span>` : "",
      `<span class="linkcard__domain">${escapeHtml(url.hostname)}</span>`,
      `</span>`,
      imageHtml,
      `</a>`,
    ].join("");
  });
}
