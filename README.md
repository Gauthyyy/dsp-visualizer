# DSP Visualizer

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions)

A lightweight, interactive web utility for exploring time- and frequency-domain behavior of simple signals.

Features
- Interactive sine wave generator with amplitude, frequency, sample-rate, and duration controls
- Time-domain waveform canvas (HiDPI-aware)
- Frequency-domain spectrum using a built-in radix-2 FFT with Hann windowing
- Small, dependency-free FFT implementation suitable for education and demos

Quick start

Development (recommended):

```bash
cd dsp-visualizer
npm install
npm run dev
# open the URL printed by Vite (usually http://localhost:5173)
```

Run as a simple static site:

```bash
cd dsp-visualizer
python -m http.server 8000
# open http://localhost:8000/public/index.html
```

Usage
- Open the app and use the left-hand controls to set `Frequency`, `Amplitude`, `Sample Rate`, and `Duration`.
- Click **Draw Sine Wave** to render the waveform.
- Click **Run FFT** to compute and display the spectrum.

Testing

There is a small automated test that generates a known tone and verifies the FFT peak:

```bash
npm test
```

Build

```bash
npm run build
```

Contributing

Contributions are welcome. Create issues or PRs for bug fixes, improvements, or feature requests. For larger changes, open an issue first to discuss the design.

Badge

Replace `OWNER/REPO` in the CI badge URL at the top of this file with your GitHub repository path (for example `gauja/dsp-visualizer`) so the badge shows your workflow status.

License

MIT — change or add a different license file if needed.
