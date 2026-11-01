// 静的サイトの HTML はビルドした時点で固まるので、「今日」に合わせた表示はブラウザ側で作る
(() => {
  const body = document.querySelector("[data-calendar-body]");
  const title = document.getElementById("calendar-title");
  if (!body || !title) return;

  const today = new Date();
  let current = new Date(today.getFullYear(), today.getMonth(), 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const render = () => {
    const year = current.getFullYear();
    const month = current.getMonth(); // 0 = 1月
    title.textContent = `${year}年 ${month + 1}月`;

    // 表の左上（日曜日）から始めるため、1日の曜日ぶん前に戻った日を起点にする
    const start = new Date(year, month, 1 - current.getDay());
    // 月によって 4〜6 週になるので、最終日を含む週まで作る
    const lastDay = new Date(year, month + 1, 0);
    const weeks = Math.ceil((current.getDay() + lastDay.getDate()) / 7);

    // 🔐 innerHTML に文字列を組み立てて入れるのではなく、要素を作って textContent で入れる
    //    （将来、記事タイトルなど外から来る文字を表示するときに XSS を防げる）
    const rows = [];
    for (let w = 0; w < weeks; w++) {
      const tr = document.createElement("tr");
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
        const td = document.createElement("td");
        const time = document.createElement("time");
        time.dateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        time.textContent = String(date.getDate());
        td.append(time);

        if (date.getMonth() !== month) td.classList.add("is-outside");
        if (d === 0) td.classList.add("is-sun");
        if (d === 6) td.classList.add("is-sat");
        if (isSameDay(date, today)) {
          td.classList.add("is-today");
          td.setAttribute("aria-current", "date");
        }
        tr.append(td);
      }
      rows.push(tr);
    }
    body.replaceChildren(...rows);
  };

  document.querySelectorAll("[data-calendar-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.calendarMove);
      current = new Date(current.getFullYear(), current.getMonth() + step, 1);
      render();
    });
  });

  document.querySelector("[data-calendar-today]")?.addEventListener("click", () => {
    current = new Date(today.getFullYear(), today.getMonth(), 1);
    render();
  });

  render();
})();
