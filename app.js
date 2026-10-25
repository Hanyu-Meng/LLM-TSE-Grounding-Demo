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

const audioCases = Array.from(document.querySelectorAll("[data-audio-case]"));
const previousCase = document.querySelector("#case-previous");
const nextCase = document.querySelector("#case-next");
const caseCount = document.querySelector("#case-count");
const audioConditionButtons = document.querySelectorAll('[data-audio-condition]');
let activeCondition = 'clean';
let activeCase = 0;

function showAudioCase(index) {
  const groupCases = audioCases.filter((audioCase) => audioCase.dataset.condition === activeCondition);
  if (!groupCases.length) return;
  activeCase = (index + groupCases.length) % groupCases.length;
  document.querySelectorAll("audio").forEach((player) => player.pause());
  audioCases.forEach((audioCase) => {
    audioCase.hidden = audioCase !== groupCases[activeCase];
  });
  if (caseCount) caseCount.textContent = `${activeCondition === 'clean' ? 'Clean' : 'Noisy'} · ${activeCase + 1} of ${groupCases.length}`;
  if (previousCase) previousCase.disabled = groupCases.length < 2;
  if (nextCase) nextCase.disabled = groupCases.length < 2;
  audioConditionButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.audioCondition === activeCondition));
  });
}

if (audioCases.length && previousCase && nextCase) {
  previousCase.addEventListener("click", () => showAudioCase(activeCase - 1));
  nextCase.addEventListener("click", () => showAudioCase(activeCase + 1));
}

audioConditionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeCondition = button.dataset.audioCondition;
    showAudioCase(0);
  });
});

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

// Keep both paper tables in the HTML; switch only their visibility.
document.querySelectorAll('[data-result-button]').forEach((button) => {
  button.addEventListener('click', () => {
    const condition = button.dataset.resultButton;
    document.querySelectorAll('[data-result-button]').forEach((other) => {
      other.setAttribute('aria-pressed', String(other === button));
    });
    document.querySelectorAll('[data-result-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.resultPanel !== condition;
    });
  });
});
