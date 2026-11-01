// onclick 属性ではなく JS 側で登録する（CSP で inline script を禁止できるようにするため）
document.querySelectorAll("[data-print]").forEach((button) => {
  button.addEventListener("click", () => window.print());
});

const header = document.querySelector(".site-header");
const menuButton = document.querySelector("[data-menu-toggle]");

if (header && menuButton) {
  const setOpen = (open) => {
    header.classList.toggle("is-menu-open", open);
    // アイコンの形はスクリーンリーダーに伝わらないので、開閉の状態は属性で伝える
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  };

  menuButton.addEventListener("click", () => {
    setOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-menu-open")) {
      setOpen(false);
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });

  window.matchMedia("(min-width: 641px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}
