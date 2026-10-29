// 「PDFで保存」ボタン：ブラウザの印刷ダイアログを開く
// （HTMLに onclick="..." を直接書かず、JSファイル側で登録するのが安全で保守しやすい書き方です）
document.querySelectorAll("[data-print]").forEach((button) => {
  button.addEventListener("click", () => window.print());
});
