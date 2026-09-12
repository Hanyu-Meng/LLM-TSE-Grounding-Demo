# Audio attribution and terms

This repository is a non-commercial research demonstration. The website code
and the audio assets do not share a single blanket license. No additional
license is granted for the dataset-derived audio or transcripts beyond the
terms of their upstream sources.

## Upstream material

- Speech is adapted from the [LibriSpeech ASR corpus](https://www.openslr.org/12/)
  (Panayotov et al., 2015), distributed under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Mixtures were generated with [LibriMix](https://github.com/JorisCos/LibriMix)
  (Cosentino et al., 2020). The LibriMix software is distributed under the MIT
  License; that software license does not replace the licenses of the source audio.
- Natural-noise examples include material from
  [WHAM!](https://wham.whisper.ai/) (Wichern et al., 2019), distributed under
  [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). The noisy
  mixtures and derived system outputs in this demo should therefore be treated
  as non-commercial research material.

## Transformations

Depending on the player, audio was mixed, resampled, normalized, separated by
frozen target-speaker extraction systems, selected by CDCS-5, tokenized, and/or
neurally resynthesized by Qwen-TSE. Transcripts and WER shown in the listening
cases use the completed, config-consistent Whisper large-v3 audit; aggregate
frozen metrics retain their separately documented evaluation protocol. The
examples were selected for research explanation; no endorsement by the source
authors or speakers is implied.

The frozen Natural Noisy TEST listening-audit manifest records hashed public
case IDs, selection rules, player roles, Whisper large-v3 outputs, metrics, durations,
and per-asset SHA-256 hashes at
[`public/results/noisy-llm-case-study.json`](public/results/noisy-llm-case-study.json).
It contains no enrolment audio. The post-hoc large-v3 measurements audit
unchanged waveforms and do not replace the frozen TEST metrics. Other
listening-case records are available under [`public/results`](public/results/).

## References

- V. Panayotov, G. Chen, D. Povey, and S. Khudanpur, “LibriSpeech: An ASR corpus
  based on public domain audio books,” ICASSP, 2015.
- J. Cosentino et al., “LibriMix: An open-source dataset for generalizable
  speech separation,” arXiv:2005.11262, 2020.
- G. Wichern et al., “WHAM!: Extending speech separation to noisy environments,”
  Interspeech, 2019.
