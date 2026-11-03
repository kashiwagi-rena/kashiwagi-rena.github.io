// 静的サイトの HTML はビルドした時点で固まるので、「今日」に合わせた表示はブラウザ側で作る
(() => {
  const body = document.querySelector("[data-calendar-body]");
  const title = document.getElementById("calendar-title");
  if (!body || !title) return;

  const ACTIVITIES = {
    pilates: { label: "ピラティス", unit: "回" },
    run: { label: "ランニング", unit: "回" },
    walk: { label: "ウォーキング", unit: "日" },
  };
  const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

  // ---------- 記録の保存（localStorage） ----------
  // 運動の記録は個人の健康に関わる情報なので、公開リポジトリやサーバーには置かず、ブラウザの中だけに保存する
  const STORAGE_KEY = "exercise-log:v1";

  // 🔐 localStorage の中身は拡張機能や手作業で書き換えられることもあるので、形を確かめてから使う
  const loadLog = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
      const log = {};
      for (const [date, list] of Object.entries(data)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(list)) continue;
        const valid = list.filter((id) => Object.hasOwn(ACTIVITIES, id));
        if (valid.length > 0) log[date] = [...new Set(valid)];
      }
      return log;
    } catch {
      // プライベートブラウズなどで localStorage が使えない・壊れているときは空として扱う
      return {};
    }
  };

  const saveLog = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
      return true;
    } catch {
      return false;
    }
  };

  let log = loadLog();

  // ---------- 日付 ----------
  const toKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const today = new Date();
  const todayKey = toKey(today);
  let current = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // ---------- カレンダー ----------
  const renderCalendar = () => {
    const year = current.getFullYear();
    const month = current.getMonth(); // 0 = 1月
    title.textContent = `${year}年 ${month + 1}月`;

    // 表の左上（日曜日）から始めるため、1日の曜日ぶん前に戻った日を起点にする
    const start = new Date(year, month, 1 - current.getDay());
    // 月によって 4〜6 週になるので、最終日を含む週まで作る
    const lastDay = new Date(year, month + 1, 0);
    const weeks = Math.ceil((current.getDay() + lastDay.getDate()) / 7);
    const selectedKey = toKey(selected);

    // 🔐 innerHTML に文字列を組み立てて入れるのではなく、要素を作って textContent で入れる
    //    （将来、記事タイトルなど外から来る文字を表示するときに XSS を防げる）
    const rows = [];
    for (let w = 0; w < weeks; w++) {
      const tr = document.createElement("tr");
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
        const key = toKey(date);
        const done = log[key] ?? [];

        const td = document.createElement("td");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "calendar__day";
        button.dataset.date = key;
        button.setAttribute("aria-pressed", String(key === selectedKey));
        // 色の点は目で見ないとわからないので、読み上げ用に記録の内容を文章でも持たせる
        const doneLabel = Object.keys(ACTIVITIES)
          .filter((id) => done.includes(id))
          .map((id) => ACTIVITIES[id].label)
          .join("・");
        button.setAttribute(
          "aria-label",
          `${date.getMonth() + 1}月${date.getDate()}日${doneLabel ? `、${doneLabel}` : ""}`
        );

        const time = document.createElement("time");
        time.dateTime = key;
        time.textContent = String(date.getDate());
        button.append(time);

        if (done.length > 0) {
          const marks = document.createElement("span");
          marks.className = "calendar__marks";
          marks.setAttribute("aria-hidden", "true");
          for (const id of Object.keys(ACTIVITIES)) {
            if (!done.includes(id)) continue;
            const mark = document.createElement("span");
            mark.className = `calendar__mark calendar__mark--${id}`;
            marks.append(mark);
          }
          button.append(marks);
        }
        td.append(button);

        if (date.getMonth() !== month) td.classList.add("is-outside");
        if (d === 0) td.classList.add("is-sun");
        if (d === 6) td.classList.add("is-sat");
        if (key === todayKey) {
          td.classList.add("is-today");
          button.setAttribute("aria-current", "date");
        }
        if (key === selectedKey) td.classList.add("is-selected");
        tr.append(td);
      }
      rows.push(tr);
    }
    body.replaceChildren(...rows);
  };

  // ---------- 運動の記録 ----------
  const panel = document.querySelector("[data-exercise]");
  const panelTitle = document.getElementById("exercise-title");
  const hint = document.querySelector("[data-exercise-hint]");
  const summaryTitle = document.querySelector("[data-summary-title]");
  const activityButtons = document.querySelectorAll("[data-activity]");

  const renderPanel = () => {
    if (!panel) return;
    const key = toKey(selected);
    const done = log[key] ?? [];
    // 未来の日は、まだやっていないので記録できないようにする
    const isFuture = key > todayKey;

    panelTitle.textContent = `${selected.getMonth() + 1}月${selected.getDate()}日（${WEEKDAYS[selected.getDay()]}）の記録`;
    activityButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(done.includes(button.dataset.activity)));
      button.disabled = isFuture;
    });
    hint.textContent = isFuture
      ? "未来の日付は記録できません。"
      : "やった運動を押すと記録されます。もう一度押すと取り消せます。";

    // 集計は「表示中の月」で数える
    const prefix = toKey(current).slice(0, 7);
    summaryTitle.textContent = `${current.getMonth() + 1}月の合計`;
    for (const id of Object.keys(ACTIVITIES)) {
      const count = Object.entries(log).filter(
        ([date, list]) => date.startsWith(prefix) && list.includes(id)
      ).length;
      document.querySelector(`[data-count="${id}"]`).textContent = String(count);
    }
  };

  const render = () => {
    renderCalendar();
    renderPanel();
  };

  activityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = toKey(selected);
      const id = button.dataset.activity;
      const done = new Set(log[key] ?? []);
      done.has(id) ? done.delete(id) : done.add(id);
      if (done.size > 0) log[key] = [...done];
      else delete log[key];

      const saved = saveLog();
      render();
      if (!saved) {
        hint.textContent =
          "このブラウザでは記録を保存できませんでした（プライベートブラウズでは保存できないことがあります）。";
      }
    });
  });

  // 日付を押すと、その日を記録の対象にする（前後の月の日付なら、その月に移動する）
  body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-date]");
    if (!button) return;
    const [y, m, d] = button.dataset.date.split("-").map(Number);
    selected = new Date(y, m - 1, d);
    if (selected.getMonth() !== current.getMonth()) {
      current = new Date(y, m - 1, 1);
    }
    render();
    body.querySelector(`[data-date="${button.dataset.date}"]`)?.focus();
  });

  // 別のタブで記録したときも、表示を最新にする
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    log = loadLog();
    render();
  });

  // ---------- CSV のバックアップ ----------
  // ブラウザはセキュリティのため端末のファイルに直接書き込めないので、ダウンロードと読み込みで受け渡す
  const CSV_HEADER = ["日付", ...Object.values(ACTIVITIES).map((a) => a.label)];
  const MAX_CSV_BYTES = 1024 * 1024;
  const csvMessage = document.querySelector("[data-csv-message]");

  document.querySelector("[data-csv-export]")?.addEventListener("click", () => {
    const lines = [CSV_HEADER.join(",")];
    for (const date of Object.keys(log).sort()) {
      lines.push([date, ...Object.keys(ACTIVITIES).map((id) => (log[date].includes(id) ? 1 : 0))].join(","));
    }
    // BOM を付けないと、Excel で開いたときに日本語の見出しが文字化けする
    const blob = new Blob(["﻿" + lines.join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `exercise-log-${todayKey}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    csvMessage.textContent = `${lines.length - 1}日分の記録を書き出しました。`;
  });

  // 🔐 読み込むファイルは中身を信用せず、1行ずつ形を確かめてから取り込む
  const parseCsv = (text) => {
    const rows = text.replace(/^﻿/, "").split(/\r?\n/).filter((line) => line.trim() !== "");
    const header = rows.shift()?.split(",").map((cell) => cell.trim());
    if (header?.join(",") !== CSV_HEADER.join(",")) {
      throw new Error(`1行目が「${CSV_HEADER.join(",")}」になっていません。このページで書き出したCSVを選んでください。`);
    }
    const imported = {};
    let skipped = 0;
    for (const row of rows) {
      const [date, ...flags] = row.split(",").map((cell) => cell.trim());
      const valid =
        /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        date <= todayKey &&
        flags.length === Object.keys(ACTIVITIES).length &&
        flags.every((flag) => flag === "0" || flag === "1");
      if (!valid) {
        skipped++;
        continue;
      }
      const done = Object.keys(ACTIVITIES).filter((_, i) => flags[i] === "1");
      if (done.length > 0) imported[date] = done;
    }
    return { imported, skipped };
  };

  document.querySelector("[data-csv-import]")?.addEventListener("change", async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // 同じファイルをもう一度選んでも change が起きるように、選択をリセットしておく
    input.value = "";
    if (!file) return;

    if (file.size > MAX_CSV_BYTES) {
      csvMessage.textContent = "ファイルが大きすぎます（1MBまで）。";
      return;
    }
    try {
      const { imported, skipped } = parseCsv(await file.text());
      // 今の記録を消さないよう、上書きではなく合わせる（同じ日は両方の運動を残す）
      for (const [date, done] of Object.entries(imported)) {
        log[date] = [...new Set([...(log[date] ?? []), ...done])];
      }
      const saved = saveLog();
      render();
      csvMessage.textContent = saved
        ? `${Object.keys(imported).length}日分の記録を読み込みました。${skipped > 0 ? `読み込めない${skipped}行（形式の誤り・未来の日付）は読み飛ばしました。` : ""}`
        : "読み込んだ記録を保存できませんでした。";
    } catch (error) {
      csvMessage.textContent = error instanceof Error ? error.message : "読み込みに失敗しました。";
    }
  });

  document.querySelectorAll("[data-calendar-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.calendarMove);
      current = new Date(current.getFullYear(), current.getMonth() + step, 1);
      render();
    });
  });

  document.querySelector("[data-calendar-today]")?.addEventListener("click", () => {
    current = new Date(today.getFullYear(), today.getMonth(), 1);
    selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    render();
  });

  if (panel) panel.hidden = false;
  render();
})();
