// GitHub の Issue（KPTフォーム）を _kpt/YYYY-MM-DD.md の記事に変換する
// 🔐 Issue の内容はワークフローの ${{ }} に埋め込まず、イベントの JSON ファイルから読む
//    （埋め込むと、本文に書かれた文字列がシェルのコマンドとして実行されてしまう＝スクリプトインジェクション）
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const owner = event.repository.owner.login;
const issue = event.issue;

const output = (key, value) => {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
};

// ワークフローの if でも確かめているが、条件の書き間違いに備えてここでも確かめる（多重の防御）
if (issue.user.login !== owner || event.sender.login !== owner) {
  console.log(
    `投稿者（${issue.user.login}）か操作した人（${event.sender.login}）がリポジトリの持ち主ではないので、記事にしません`
  );
  output("published", "false");
  process.exit(0);
}
if (!issue.labels.some((label) => label.name === "kpt")) {
  console.log("kpt ラベルがないので、記事にしません");
  output("published", "false");
  process.exit(0);
}

// Issue フォームの本文は「### 項目名」＋空行＋内容 の繰り返しになっている
const sections = [];
for (const block of (issue.body ?? "").split(/^### /m).slice(1)) {
  const [label, ...rest] = block.split("\n");
  const value = rest.join("\n").trim();
  if (value && value !== "_No response_") sections.push({ label: label.trim(), value });
}

const toJstDate = (iso) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date(iso));

const dateSection = sections.find((s) => s.label === "日付");
let date = toJstDate(issue.created_at);
if (dateSection) {
  const valid =
    /^\d{4}-\d{2}-\d{2}$/.test(dateSection.value) &&
    !Number.isNaN(new Date(`${dateSection.value}T00:00:00+09:00`).getTime());
  if (!valid) throw new Error(`日付「${dateSection.value}」は YYYY-MM-DD の形ではありません`);
  date = dateSection.value;
}

// 🔐 本文は HTML として解釈されないよう、< > & を文字参照にする（Markdown の書式はそのまま使える）
const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
// YAML の値として安全に書くため、JSON 文字列（YAML でもそのまま読める）にする
const yamlString = (text) => JSON.stringify(text);

const body = sections
  .filter((s) => s !== dateSection)
  .map((s) => `## ${escapeHtml(s.label)}\n\n${escapeHtml(s.value)}`)
  .join("\n\n");

const content = `---
title: ${yamlString(`${date} のKPT`)}
date: ${date}
issue: ${Number(issue.number)}
---

${body}
`;

mkdirSync("_kpt", { recursive: true });
const path = `_kpt/${date}.md`;
writeFileSync(path, content);
console.log(`${path} を書き出しました`);
output("published", "true");
output("path", path);
output("date", date);
