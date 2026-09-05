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
    "Pool D → adaptive CSG": "Pool D → CSG (λ=.5, w=1; nominal adaptive)",
    "Pool D → adaptive CSG → GNR-LLM": "Pool D → CSG (λ=.5, w=1) → GNR (K20/R2)",
  };

  body.replaceChildren(
    ...frozen.table.rows.map((row) => {
      const tr = document.createElement("tr");
      const visibleValues = row.length >= 8
        ? [row[0], row[2], row[3], row[4], row[5], row[6], row[7]]
        : row.slice(0, 7);
      visibleValues.forEach((value, index) => {
        const td = document.createElement("td");
        if (index === 0) td.textContent = displayLabels[value] || value;
        else if (index === 5 && typeof value === "string") td.textContent = value.replace(/\s+OVRL$/, "");
        else td.textContent = value;
        tr.appendChild(td);
      });
      if (row[8] === "best") tr.classList.add("key-row");
      return tr;
    }),
  );

  note.textContent = frozen.table.intro || `Frozen Noisy TEST results · ${frozen.generatedAt || "validated final report"}.`;

  const status = document.querySelector(".status");
  if (status) {
    status.innerHTML = '<span aria-hidden="true"></span><strong>Study status:</strong> Frozen Noisy TEST is complete; reported Clean TEST rows are frozen, with Clean GNR pending.';
    status.classList.add("complete");
  }
}

const pipelineTabs = Array.from(document.querySelectorAll("#pipeline-explainer [role='tab']"));
const pipelinePanels = Array.from(document.querySelectorAll("#pipeline-explainer [role='tabpanel']"));
const pipelineCount = document.querySelector("#pipeline-stage-count");

function activatePipelineStage(tab, moveFocus = false) {
  const panelId = tab.getAttribute("aria-controls");
  const activeIndex = pipelineTabs.indexOf(tab);

  pipelineTabs.forEach((item) => {
    const isActive = item === tab;
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  pipelinePanels.forEach((panel) => {
    panel.hidden = panel.id !== panelId;
  });

  if (pipelineCount) pipelineCount.textContent = `Stage ${activeIndex + 1} of ${pipelineTabs.length}`;
  if (moveFocus) tab.focus();
}

pipelineTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activatePipelineStage(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % pipelineTabs.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + pipelineTabs.length) % pipelineTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = pipelineTabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    activatePipelineStage(pipelineTabs[nextIndex], true);
  });
});
