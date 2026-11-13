// 【移行用の一時スクリプト】Qiita の画像を assets/images/qiita/ にダウンロードする
// 画像が取り込めたら、ワークフローと一緒に削除する
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const MANIFEST = "scripts/qiita-images.json";
const OUT_DIR = "assets/images/qiita";
const ALLOWED_HOST = "qiita-image-store.s3.ap-northeast-1.amazonaws.com";
const ALLOWED_PATH = /^\/0\/3190323\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpeg|png)$/;
const MAX_BYTES = 15 * 1024 * 1024;

// 🔐 拡張子ではなく、ファイルの先頭のバイト（マジックバイト）で本当に画像かを確かめる
const MAGIC = {
  jpeg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
};

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
mkdirSync(OUT_DIR, { recursive: true });

let failed = 0;
for (const [href, name] of Object.entries(manifest)) {
  try {
    const url = new URL(href);
    // 🔐 マニフェストが書き換えられても、決めた場所の画像以外は取りに行かない
    const ext = url.pathname.match(ALLOWED_PATH)?.[1];
    if (url.protocol !== "https:" || url.hostname !== ALLOWED_HOST || !ext) throw new Error("許可していない URL");
    if (name !== url.pathname.split("/").pop()) throw new Error("ファイル名が URL と一致しない");

    const res = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = Buffer.from(await res.arrayBuffer());
    if (body.length > MAX_BYTES) throw new Error(`大きすぎる（${body.length} バイト）`);
    if (!MAGIC[ext](body)) throw new Error("中身が画像ではない");

    writeFileSync(`${OUT_DIR}/${name}`, body);
    console.log(`OK   ${name} (${body.length} bytes)`);
  } catch (error) {
    failed++;
    console.error(`FAIL ${href}: ${error.message}`);
  }
}
console.log(`${Object.keys(manifest).length - failed} / ${Object.keys(manifest).length} 枚を取り込みました`);
if (failed > 0) process.exit(1);
