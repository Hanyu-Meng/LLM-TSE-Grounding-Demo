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
