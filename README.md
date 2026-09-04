# Repair Before Grounding — Demo

Interactive research demo for **Repair Before Grounding: Conditioning-Diverse Candidate Selection for Confusion-Resilient Target Speaker Extraction**.

**Live demo:** <https://hanyu-meng.github.io/LLM-TSE-Grounding-Demo/>

The page presents one focused claim: reliable target-conditioned evidence must be recovered before an LLM-based speech generator can be grounded successfully. It separates two contributions:

1. **Candidate repair** recovers target-consistent acoustic evidence when the primary TSE follows the interferer.
2. **Constrained grounding** reduces speaker and content drift inside the generative branch.

## What is included

- Frozen Clean TEST results over 6,000 trials.
- Clearly labelled provisional Noisy DEV results over 8,400 trials.
- A locked Noisy TEST table that is populated only after the one-shot evaluation completes.
- Three ordered listening cases covering enrollment-view recovery, complementary TF-map/context evidence, and constrained grounding.
- Per-SNR robustness and deployment-cost summaries.

No remote-machine configuration, internal agent instructions, unpublished credentials, or mutable experiment workspace files are included.

## View locally

The demo is a dependency-free static site. Serve the repository root with any local HTTP server, then open `index.html`. Opening the file directly also works in modern browsers.

To publish it with GitHub Pages, select `main` and `/ (root)` under **Settings → Pages → Deploy from a branch**.

## Result discipline

- DEV selects configurations; frozen TEST supports final claims.
- Partial Noisy TEST outputs are never displayed as final results.
- The Noisy TEST block is updated only when the frozen ledger reports `COMPLETE`, `execution_count = 1`, and `post_test_tuning = false`.
- References shown in listening examples are for evaluation and explanation only; the deployed selector does not use them.

## Repository layout

```text
.
├── index.html             # research story and demo interface
├── styles.css             # responsive visual design
├── app.js                 # tables, chart, and audio interaction
├── frozen-noisy-test.js   # validated Noisy TEST payload; null while pending
└── public/assets/
    ├── audio/clean/       # selected listening examples
    └── figures/           # spectrogram and supporting figures
```

Dataset-derived audio remains subject to the terms of its source datasets. No additional license is granted by this repository.
