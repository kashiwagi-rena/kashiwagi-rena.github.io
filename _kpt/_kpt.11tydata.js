// KPT 全体の設定
export default {
  layout: "kpt.html",
  nav: "kpt",
  tags: ["kpt"],
  // 🔐 本文は Issue から来るので、{{ }} や {% %} をテンプレートの命令として実行しない
  templateEngineOverride: "md",
  eleventyComputed: {
    permalink: (data) => {
      const d = new Date(data.page.date);
      const ymd = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      return `/kpt/${ymd}/`;
    },
  },
};
