// 「PDFで保存」ボタン：ブラウザの印刷ダイアログを開く
// （HTMLに onclick="..." を直接書かず、JSファイル側で登録するのが安全で保守しやすい書き方です）
document.querySelectorAll("[data-print]").forEach((button) => {
  button.addEventListener("click", () => window.print());
});

// ---------- ハンバーガーメニュー（スマホのみ表示） ----------
const header = document.querySelector(".site-header");
const menuButton = document.querySelector("[data-menu-toggle]");

if (header && menuButton) {
  const setOpen = (open) => {
    header.classList.toggle("is-menu-open", open);
    // aria-expanded：スクリーンリーダーに「開いている／閉じている」を伝える
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  };

  menuButton.addEventListener("click", () => {
    setOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  // Esc キーで閉じて、ボタンにフォーカスを戻す
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-menu-open")) {
      setOpen(false);
      menuButton.focus();
    }
  });

  // メニューの外を押したら閉じる
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });

  // 画面を広げて PC 表示になったら、開いた状態をリセットする
  window.matchMedia("(min-width: 641px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}
