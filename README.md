# DSP Visualizer

A lightweight, interactive web utility designed to visualize digital signals and explore core signal processing principles. This application provides a real-time environment for generating waveforms and performing spectral analysis, serving as a practical tool for educational research and signal data simulation.

## Project Overview

This project is a web-based signal visualizer designed to demonstrate the relationship between time-domain waveforms and frequency-domain analysis.

It includes:
- Interactive sine wave generation
- A waveform plotting canvas
- A placeholder FFT module to illustrate where spectral analysis is implemented
- A modern, clean presentation style

## Tech Stack

- HTML for structure
- CSS for a clean, glassmorphic design
- JavaScript for signal generation and visualization logic
- Canvas API for waveform and spectrum rendering

## Getting Started

### Option 1: Open locally

1. Open `public/index.html` in your browser.
2. Use the controls to change frequency, amplitude, sample rate, and duration.
3. Click **Draw Sine Wave** to update the waveform.
4. Click **Run FFT** to preview the spectrum placeholder.

### Option 2: Run with a local web server

A local server is recommended for the best development experience.

Using Python 3:

```bash
cd dsp-visualizer
python -m http.server 8000
```

Then open `http://localhost:8000/public/index.html` in your browser.

## Future Enhancements

- Replace the placeholder FFT with a full FFT algorithm or library
- Add signal types like square, triangle, and sawtooth
- Add frequency slider animation and real-time updates
- Add export options for waveform and spectrum images

## Project Overview

This utility provides a robust framework for digital signal visualization, bridging the gap between theoretical signal processing and interactive front-end implementation. It is engineered to deliver high-performance waveform rendering and provides an extensible architecture for implementing advanced spectral analysis algorithms.
