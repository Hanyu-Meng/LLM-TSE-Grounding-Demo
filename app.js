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

  body.replaceChildren(
    ...frozen.table.rows.map((row) => {
      const tr = document.createElement("tr");
      const visibleValues = row.length >= 8
        ? [row[0], row[2], row[3], row[4], row[5], row[6], row[7]]
        : row.slice(0, 7);
      visibleValues.forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });
      return tr;
    }),
  );

  note.textContent = frozen.table.intro || `Frozen Noisy TEST results · ${frozen.generatedAt || "validated final report"}.`;

  const status = document.querySelector(".status");
  if (status) {
    status.innerHTML = '<span aria-hidden="true"></span><strong>Study status:</strong> Clean and Noisy TEST results are frozen.';
    status.classList.add("complete");
  }
}
