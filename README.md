# Speaker-Consistent Grounding — Demo

Minimal academic project page and audio demo for **Speaker-Consistent Grounding for Confusion-Resilient LLM-Based Target Speech Extraction**.

**Live demo:** <https://hanyu-meng.github.io/LLM-TSE-Grounding-Demo/>

The page presents one focused claim: reliable target-conditioned evidence must be recovered before an LLM-based speech generator can be grounded successfully. It separates two contributions:

1. **Candidate repair** recovers target-consistent acoustic evidence when the primary TSE follows the interferer.
2. **Constrained grounding** reduces speaker and content drift inside the generative branch.

## What is included

- Directly visible Clean DEV, Clean TEST, natural-noise DEV, and frozen natural-noise TEST tables with split-specific denominators.
- Paper-aligned public system names throughout: CDCS-2/CDCS-5 and the Qwen-TSE UD, CSG, and GNR variants.
- Exact definitions and decision rules for the study-defined content-switch (C-sw.) and acoustic-switch (A-sw.) diagnostics.
- Complete Clean TEST UTMOS for every displayed row, evaluated post hoc on the unchanged frozen outputs with the audited SpeechMOS v1.2.0 model.
- Separate controlled-SNR DEV and TEST tables (480 trials per SNR and system), never pooled into the headline natural-noise table.
- A restrained black-and-white problem formulation and paper-accurate method diagram using amplitude-normalized traces generated from the released audio examples.
- Self-hosted KaTeX rendering for method, grounding, WER, and speaker-confusion equations, with readable text fallbacks.
- Five paged listening cases: one deterministic frozen Clean TEST opener followed by four cases from the frozen 6,000-trial natural-noise TEST set, with frozen ASR-consistency transcripts and compact, lazy-loaded 2,000-pixel spectrograms that link to their full-resolution originals.
- A six-case frozen Natural Noisy TEST listening audit that separates cross-ASR sensitivity, UD collapse, target-voice/interferer-content drift, fixed-CSG repair, and a fixed-CSG regression. Every player uses the complete waveform; the listening labels remain provisional rather than human-adjudicated.
- A clean wrong-speaker WeSep case that isolates speaker confusion without noise, followed by noisy evidence repair, speaker-collapse prevention, lexical-drift repair, and fidelity–naturalness examples selected by explicit deterministic rules rather than informal listening alone.
- Machine-readable case records at `public/results/clean-demo-case.json`, `public/results/noisy-demo-cases.json`, and `public/results/noisy-llm-case-study.json`, with selection rules, paired small.en/large-v3 transcripts, per-system metrics, and per-asset SHA-256 hashes. The public audit uses descriptive case labels rather than corpus trial identifiers.
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
- The large-v3/RP=1.10 comparison in the LLM-WER case study is a post-hoc ASR audit of unchanged TEST waveforms; it does not replace the preregistered frozen TEST metrics.
- References shown in listening examples are for evaluation and explanation only; the deployed selector does not use them.

## Repository layout

```text
.
├── index.html             # research story and demo interface
├── styles.css             # responsive visual design
├── app.js                 # explainer, frozen-result, and audio interaction
├── frozen-noisy-test.js   # validated frozen Noisy TEST payload
├── public/results/         # compact result/provenance manifests
├── public/vendor/katex/    # pinned local mathematical typesetter
├── scripts/                # reproducible spectrogram and waveform renderers
└── public/assets/
    ├── audio/noisy/       # selected frozen natural-noise TEST examples
    ├── audio/noisy-llm-case-study/ # Frozen Natural Noisy TEST listening audit
    ├── audio/clean/       # deterministic frozen Clean TEST examples
    ├── figures/           # spectrogram and supporting figures
    └── waveforms/         # real amplitude envelopes used in the diagrams
```

Listening audio is derived from [LibriMix](https://github.com/JorisCos/LibriMix); the noisy examples combine LibriSpeech speech with [WHAM!](https://wham.whisper.ai/) noise. Dataset-derived audio and transcripts remain subject to their upstream terms. See [Audio attribution and terms](AUDIO_ATTRIBUTION.md) for licenses, transformations, and references.
