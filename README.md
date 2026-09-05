# Repair Before Grounding — Demo

Minimal academic project page and audio demo for **Repair Before Grounding: Conditioning-Diverse Candidate Selection for Confusion-Resilient Target Speaker Extraction**.

**Live demo:** <https://hanyu-meng.github.io/LLM-TSE-Grounding-Demo/>

The page presents one focused claim: reliable target-conditioned evidence must be recovered before an LLM-based speech generator can be grounded successfully. It separates two contributions:

1. **Candidate repair** recovers target-consistent acoustic evidence when the primary TSE follows the interferer.
2. **Constrained grounding** reduces speaker and content drift inside the generative branch.

## What is included

- Directly visible Clean DEV, Clean TEST, natural-noise DEV, and frozen natural-noise TEST tables with split-specific denominators.
- Complete Clean TEST UTMOS for every displayed row, evaluated post hoc on the unchanged frozen outputs with the audited SpeechMOS v1.2.0 model.
- Separate controlled-SNR DEV and TEST tables (480 trials per SNR and system), never pooled into the headline natural-noise table.
- A compact repair-before-grounding story figure plus a token-level grounding diagram.
- Three paged listening cases with frozen clean-reference ASR transcripts and compact, lazy-loaded 2,000-pixel spectrograms that link to their full-resolution originals.
- Per-SNR robustness and deployment-cost summaries.

No remote-machine configuration, internal agent instructions, unpublished credentials, or mutable experiment workspace files are included.

## View locally

The demo is a dependency-free static site. Serve the repository root with any local HTTP server, then open `index.html`. Opening the file directly also works in modern browsers.

To publish it with GitHub Pages, select `main` and `/ (root)` under **Settings → Pages → Deploy from a branch**.

## Result discipline

- DEV selects configurations; frozen TEST supports final claims.
- Partial Noisy TEST outputs are never displayed as final results.
- The published Noisy TEST block was imported only after the frozen ledger reported `COMPLETE`, `execution_count = 1`, and `post_test_tuning = false`.
- The Clean GNR row was added only after its K=20/R=2 protocol and summary both reported `COMPLETE`, with 6,000/6,000 decoded and zero failures.
- Clean UTMOS is explicitly labelled post hoc: all displayed systems have 6,000/6,000 scores and zero failures, and no decoding, system choice, or threshold was changed.
- References shown in listening examples are for evaluation and explanation only; the deployed selector does not use them.

## Repository layout

```text
.
├── index.html             # research story and demo interface
├── styles.css             # responsive visual design
├── app.js                 # explainer, frozen-result, and audio interaction
├── frozen-noisy-test.js   # validated frozen Noisy TEST payload
├── public/results/         # compact result/provenance manifests
├── scripts/                # reproducible compact-spectrogram renderer
└── public/assets/
    ├── audio/clean/       # selected listening examples
    └── figures/           # spectrogram and supporting figures
```

Dataset-derived audio remains subject to the terms of its source datasets. No additional license is granted by this repository.
