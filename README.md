# DSP Visualizer

[![CI](https://github.com/Gauthyyy/dsp-visualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/Gauthyyy/dsp-visualizer/actions)

A lightweight interactive web app for visualizing digital signals in the time and frequency domains.

## Features

- Interactive sine wave generator with frequency, amplitude, sample rate, and duration controls
- Time-domain waveform rendering using HTML5 Canvas
- Frequency-domain spectrum analysis using a built-in radix-2 FFT implementation
- HiDPI-aware canvas scaling for crisp rendering on high-resolution screens
- Local development support with Vite and automated FFT tests

## Quick Start

### Development

```bash
cd dsp-visualizer
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

### Static Preview

```bash
cd dsp-visualizer
python -m http.server 8000
```

Open `http://localhost:8000/public/index.html` in your browser.

## Usage

1. Open the app in your browser.
2. Set `Frequency`, `Amplitude`, `Sample Rate`, and `Duration`.
3. Click **Draw Sine Wave** to render the waveform.
4. Click **Run FFT** to compute and display the frequency spectrum as bars.

## Testing

Run the automated FFT test:

```bash
npm test
```

This test generates a known sine tone and verifies the FFT peak location.

## Build

Create a production build with:

```bash
npm run build
```

## Contributing

Contributions are welcome. Please open issues or PRs for bug fixes, improvements, or feature ideas.