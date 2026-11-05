// 今月（日本時間）のテンプレートが kpt-templates/ にあれば、投稿フォームに差し替える
// 変更があったときだけ "changed=true" を GITHUB_OUTPUT に書き、ワークフロー側で commit する
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const FORM_PATH = ".github/ISSUE_TEMPLATE/kpt.yml";

// GitHub Actions のサーバーは UTC で動いているので、日本時間に直してから「今月」を決める
const month = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit" })
  .format(new Date())
  .slice(0, 7);
const templatePath = `kpt-templates/${month}.yml`;

let changed = false;
if (!existsSync(templatePath)) {
  console.log(`${templatePath} がないので、今のテンプレートを使い続けます`);
} else {
  const template = readFileSync(templatePath, "utf8");
  const current = existsSync(FORM_PATH) ? readFileSync(FORM_PATH, "utf8") : "";
  if (template === current) {
    console.log(`${templatePath} はすでに反映済みです`);
  } else {
    writeFileSync(FORM_PATH, template);
    changed = true;
    console.log(`${templatePath} を投稿フォームに反映しました`);
  }
}

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\nmonth=${month}\n`);
}
