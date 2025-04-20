const app = document.getElementById("app");

const questions = [
  {
    text: "これは学校から借りた資材？",
    options: [
      { text: "はい", next: "貸出品" },
      { text: "いいえ", next: "分類1" }
    ]
  },
  {
    id: "分類1",
    text: "公金で購入した物品？",
    options: [
      { text: "はい", next: "公金購入品" },
      { text: "いいえ", next: "分類2" }
    ]
  },
  {
    id: "分類2",
    text: "どれに当てはまる？",
    options: [
      { text: "段ボール", next: "資源（段ボール）" },
      { text: "木材", next: "燃えるゴミ" },
      { text: "ペンキ缶", next: "危険物" },
      { text: "クランプ", next: "金属ゴミ" },
      { text: "広告ボード", next: "不燃ゴミ" },
    ]
  }
];

const results = {
  "貸出品": { text: "→ 学校に返却してください。" },
  "公金購入品": { text: "→ 指導教員または責任者に確認してください。" },
  "資源（段ボール）": { text: "→ 資源ごみ（段ボール）へ。" },
  "燃えるゴミ": { text: "→ 可燃ごみへ。" },
  "危険物": { text: "→ 危険物回収へ。指導者へ確認を。" },
  "金属ゴミ": { text: "→ 金属回収場所へ。" },
  "不燃ゴミ": { text: "→ 不燃ごみへ。" }
};

let history = [];

function renderQuestion(idOrIndex) {
  const q = typeof idOrIndex === "number" ? questions[idOrIndex] : questions.find(q => q.id === idOrIndex);
  if (!q) return;

  const section = document.createElement("section");
  section.className = "question";
  section.innerHTML = `<h2>${q.text}</h2>`;

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.onclick = () => {
      history.push(() => renderQuestion(idOrIndex));
      clearApp();
      if (results[opt.next]) {
        renderResult(opt.next);
      } else {
        renderQuestion(opt.next);
      }
    };
    section.appendChild(btn);
  });

  if (history.length) {
    const backBtn = document.createElement("button");
    backBtn.textContent = "← もどる";
    backBtn.onclick = () => {
      clearApp();
      const last = history.pop();
      if (last) last();
    };
    section.appendChild(backBtn);
  }

  app.appendChild(section);
}

function renderResult(id) {
  const section = document.createElement("section");
  section.className = "result";
  section.innerHTML = `<h2>分類結果</h2><p>${results[id].text}</p>`;
  app.appendChild(section);

  const notice = document.createElement("section");
  notice.className = "notice";
  notice.innerHTML = `
    <h2>注意事項</h2>
    <ul>
      <li>必ず分別場所に従ってください。</li>
      <li>不明な場合は責任者に確認しましょう。</li>
    </ul>
    <img src="../片付け地図.png" alt="地図" class="map" />
  `;
  app.appendChild(notice);

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "はじめから";
  restartBtn.onclick = () => {
    history = [];
    clearApp();
    renderQuestion(0);
  };
  app.appendChild(restartBtn);
}

function clearApp() {
  app.innerHTML = "";
}

renderQuestion(0);