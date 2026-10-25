# Speaker-Consistent Grounding — Demo

Minimal academic project page and audio demo for **Speaker-Consistent Grounding for Confusion-Resilient LLM-Based Target Speech Extraction**.

**Live demo:** <https://hanyu-meng.github.io/LLM-TSE-Grounding-Demo/>

The page presents one focused claim: reliable target-conditioned evidence must be recovered before an LLM-based speech generator can be grounded successfully. It separates two contributions:

1. **Candidate repair** recovers target-consistent acoustic evidence when the primary TSE follows the interferer.
2. **Constrained grounding** reduces speaker and content drift inside the generative branch.

## What is included

- Paper-aligned public system names throughout: BSRNN-TSE, BSRNN-TSE-CDCS-5, Qwen-TSE-UD, Qwen-TSE-fixed-CSG, and Qwen-TSE-adaptive-CSG. GNR is retained only as a supplementary audit label where applicable.
- Exact definitions and decision rules for the study-defined content-switch (C-sw.) and acoustic-switch (A-sw.) diagnostics.
- A restrained black-and-white problem formulation and paper-accurate method diagram using amplitude-normalized traces generated from the released audio examples.
- Self-hosted KaTeX rendering for method, grounding, WER, and speaker-confusion equations, with readable text fallbacks.
- Five paged listening cases: one deterministic frozen Clean TEST opener followed by four cases from the frozen 6,000-trial natural-noise TEST set, with config-consistent Whisper large-v3 transcripts and compact, lazy-loaded 2,000-pixel spectrograms that link to their full-resolution originals.
- Three representative cases from the six-case frozen Natural Noisy TEST audit: grounding repair, target-like voice with incorrect words, and grounding regression. Each compares direct extraction, UD, fixed CSG, and adaptive CSG. Full six-case records and supplementary GNR results remain available in `public/results/noisy-llm-case-study.json`. Waveforms are complete; large-v3 transcripts and listening interpretations are not human-adjudicated.
- A clean wrong-speaker BSRNN-TSE case that isolates speaker confusion without noise, followed by noisy evidence repair, speaker-collapse prevention, lexical-drift repair, and fidelity–naturalness examples selected by explicit deterministic rules rather than informal listening alone.
- Machine-readable case records at `public/results/clean-demo-case.json`, `public/results/noisy-demo-cases.json`, and `public/results/noisy-llm-case-study.json`, with selection rules, Whisper large-v3 transcripts, per-system metrics, and per-asset SHA-256 hashes. The public audit uses descriptive case labels rather than corpus trial identifiers.

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
- DNSMOS is reported as P.808 for both clean and noisy conditions; per-case listening examples do not claim unavailable P.808 values.
- The listening-case large-v3/RP=1.10 audit re-scores unchanged TEST waveforms. Current manuscript aggregates are separately recorded in `public/results/paper-results.json`; older metric fields in case manifests remain historical provenance and are not pooled into the displayed paper tables.
- References shown in listening examples are for evaluation and explanation only; the deployed selector does not use them.

## Repository layout

```text
.
├── index.html             # research story and demo interface
├── styles.css             # responsive visual design
├── app.js                 # explainer and audio interaction
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


## Current manuscript figures and results (25 October 2026)

The page now reproduces the author-provided manuscript's two figures and Tables 1–2. `public/results/paper-results.json` records the displayed table values, source PDF SHA-256 and protocol. The source manuscript was read without editing it.

- Clean TEST: 6,000 trials. Noisy TEST: 6,000 natural-noise + 2,400 controlled-SNR trials. Figure 2 uses 480 trials at each of five SNRs.
- Paper WER: uncapped utterance-macro agreement with Whisper-large-v3 clean-target transcripts, not human-reference WER. DNSMOS is P.808 in both conditions.
- Table 2's wrong-speaker errors use SI-SDR margin; Table 1's acoustic switches use CAMPPlus. They are distinct diagnostics.
- Figure 1 was extracted losslessly from the manuscript (3,764 × 976); Figure 2 was cropped directly from its rendered PDF (2,415 × 978). No curves were redrawn or digitized.
- The additional Whisper audit reuses the existing `largev3-runaway` waveform and manifest. Its 7.68-second UD output yields 17 substitutions, 0 deletions and 419 insertions against 23 reference words (WER 1,895.65%). Audio and full automatic transcripts are provided together. No human adjudication or second-ASR validation is claimed.
- The three previously selected grounding examples remain visible; full historical six-case records remain in the audit JSON. These selected natural-noise cases do not estimate prevalence or replace the pooled paper results.
