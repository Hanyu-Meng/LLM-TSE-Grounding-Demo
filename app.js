document.querySelectorAll("audio").forEach((player) => {
  player.addEventListener("play", () => {
    document.querySelectorAll("audio").forEach((other) => {
      if (other !== player) other.pause();
    });
  });
});

document.querySelectorAll("details").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    const image = details.querySelector("img[data-src]");
    if (!image) return;
    image.src = image.dataset.src;
    image.loading = "lazy";
    image.decoding = "async";
    image.removeAttribute("data-src");
  }, { once: true });
});

const frozen = window.FROZEN_NOISY_TEST;

if (frozen?.table?.rows && Array.isArray(frozen.table.rows)) {
  const body = document.querySelector("#noisy-test-body");
  const note = document.querySelector("#noisy-test-note");
  const displayLabels = {
    "Pool D direct": "CDCS-5 direct",
    "Pool D → Q-Full UD": "Qwen-TSE UD",
    "Pool D → fixed CSG": "Qwen-TSE fixed CSG",
    "Pool D → adaptive CSG": "Qwen-TSE adaptive CSG",
    "Pool D → adaptive CSG → GNR-LLM": "Qwen-TSE adaptive CSG+GNR",
  };
  const groundingEvidence = {
    "Primary WeSep": "—",
    "Pool D direct": "—",
    "Pool D → Q-Full UD": "CDCS-5",
    "Pool D → fixed CSG": "CDCS-5",
    "Pool D → adaptive CSG": "CDCS-5",
    "Pool D → adaptive CSG → GNR-LLM": "CDCS-5",
  };
  const emphasizedColumns = {
    "Pool D direct": [0, 2, 3],
    "Pool D → Q-Full UD": [7],
    "Pool D → fixed CSG": [0, 2, 3, 4, 5],
    "Pool D → adaptive CSG → GNR-LLM": [6],
  };

  body.replaceChildren(
    ...frozen.table.rows.map((row) => {
      const tr = document.createElement("tr");
      const visibleValues = row.length >= 8
        ? [displayLabels[row[0]] || row[0], groundingEvidence[row[0]] || "—", row[2], row[3], row[4], row[5], row[6], row[7]]
        : row.slice(0, 8);
      visibleValues.forEach((value, index) => {
        const td = document.createElement("td");
        let displayValue = value;
        if (index === 6 && typeof value === "string") displayValue = value.replace(/\s+OVRL$/, "");
        if (emphasizedColumns[row[0]]?.includes(index)) {
          const strong = document.createElement("strong");
          strong.textContent = displayValue;
          td.appendChild(strong);
        } else {
          td.textContent = displayValue;
        }
        tr.appendChild(td);
      });
      if (row[8] === "best") tr.classList.add("key-row");
      if (row[0] === "Pool D → Q-Full UD") tr.classList.add("branch-start");
      return tr;
    }),
  );

  note.textContent = frozen.table.intro || `Frozen Noisy TEST results · ${frozen.generatedAt || "validated final report"}.`;

  const status = document.querySelector(".status");
  if (status) {
    status.innerHTML = '<span aria-hidden="true"></span><strong>Status:</strong> Frozen Noisy TEST and all reported Clean TEST rows are complete.';
    status.classList.add("complete");
  }
}

const audioCases = Array.from(document.querySelectorAll("[data-audio-case]"));
const previousCase = document.querySelector("#case-previous");
const nextCase = document.querySelector("#case-next");
const caseCount = document.querySelector("#case-count");
let activeCase = 0;

function showAudioCase(index) {
  activeCase = (index + audioCases.length) % audioCases.length;
  document.querySelectorAll("audio").forEach((player) => player.pause());
  audioCases.forEach((audioCase, caseIndex) => {
    audioCase.hidden = caseIndex !== activeCase;
  });
  if (caseCount) caseCount.textContent = `Example ${activeCase + 1} of ${audioCases.length}`;
}

if (audioCases.length && previousCase && nextCase) {
  previousCase.addEventListener("click", () => showAudioCase(activeCase - 1));
  nextCase.addEventListener("click", () => showAudioCase(activeCase + 1));
}

function renderMath(root = document) {
  if (!window.katex) return;

  root.querySelectorAll("[data-tex]:not([data-math-rendered])").forEach((node) => {
    const staging = document.createElement("span");

    try {
      window.katex.render(node.dataset.tex, staging, {
        displayMode: node.classList.contains("math-display"),
        output: "htmlAndMathml",
        trust: false,
        throwOnError: true,
        strict: "warn",
      });
      node.replaceChildren(staging.firstElementChild);
      node.dataset.mathRendered = "true";
    } catch (error) {
      console.warn("KaTeX fallback retained:", node.dataset.tex, error);
    }
  });
}

renderMath();
