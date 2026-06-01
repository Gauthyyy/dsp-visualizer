import { fftReal } from './fft.js';

const frequencyInput = document.getElementById('frequency');
const amplitudeInput = document.getElementById('amplitude');
const sampleRateInput = document.getElementById('sampleRate');
const durationInput = document.getElementById('duration');
const drawWaveBtn = document.getElementById('drawWaveBtn');
const fftBtn = document.getElementById('fftBtn');
const waveCanvas = document.getElementById('waveCanvas');
const spectrumCanvas = document.getElementById('spectrumCanvas');

const waveContext = waveCanvas.getContext('2d');
const spectrumContext = spectrumCanvas.getContext('2d');

function setupCanvasesForDPR() {
  const dpr = window.devicePixelRatio || 1;

  [waveCanvas, spectrumCanvas].forEach((canvas) => {
    const w = 800;
    const h = 240;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  });
  
  console.log('Canvas DPR setup complete. DPR:', dpr);
}

function generateSineWave({ frequency = 5, amplitude = 1, sampleRate = 256, duration = 1 }) {
  const sampleCount = Math.floor(sampleRate * duration);
  const angularIncrement = (2 * Math.PI * frequency) / sampleRate;
  const signal = new Array(sampleCount);

  for (let i = 0; i < sampleCount; i += 1) {
    signal[i] = amplitude * Math.sin(i * angularIncrement);
  }

  return signal;
}

function computeSpectrum(signal, sampleRate) {
  return fftReal(signal, sampleRate);
}

function drawWaveform(signal) {
  const displayWidth = 800;
  const displayHeight = 240;
  console.log('Drawing waveform, signal length:', signal.length);
  waveContext.clearRect(0, 0, displayWidth, displayHeight);
  waveContext.strokeStyle = '#6bd9ff';
  waveContext.lineWidth = 2;
  waveContext.beginPath();

  const padding = 20; // 20px padding on top/bottom to prevent line clipping
  const drawHeight = displayHeight - 2 * padding;

  signal.forEach((value, index) => {
    const x = (index / Math.max(signal.length - 1, 1)) * displayWidth;
    const y = padding + drawHeight / 2 - value * (drawHeight / 2);
    if (index === 0) {
      waveContext.moveTo(x, y);
    } else {
      waveContext.lineTo(x, y);
    }
  });

  waveContext.stroke();
  console.log('Waveform drawn.');
}

function drawSpectrum({ frequencies, magnitudes }) {
  const displayWidth = 800;
  const displayHeight = 240;
  spectrumContext.clearRect(0, 0, displayWidth, displayHeight);
  spectrumContext.fillStyle = 'rgba(85, 192, 255, 0.14)';
  const barWidth = displayWidth / frequencies.length;

  const maxMag = Math.max(...magnitudes) || 1;

  for (let index = 0; index < magnitudes.length; index++) {
    const magnitude = magnitudes[index];
    // dB scaling for better visibility (small epsilon to avoid log(0))
    const val = 20 * Math.log10(magnitude / maxMag + 1e-12);
    const norm = Math.max(0, (val + 60) / 60); // map -60..0 dB -> 0..1
    const x = index * barWidth;
    const barHeight = norm * (displayHeight * 0.9);
    spectrumContext.fillRect(x, displayHeight - barHeight, barWidth * 0.85, barHeight);
  }
}

function refreshVisualization() {
  const config = {
    frequency: Number(frequencyInput.value),
    amplitude: Number(amplitudeInput.value),
    sampleRate: Number(sampleRateInput.value),
    duration: Number(durationInput.value),
  };

  console.log('Refreshing visualization with config:', config);
  const signal = generateSineWave(config);
  drawWaveform(signal);
}

function handleFFT() {
  const config = {
    frequency: Number(frequencyInput.value),
    amplitude: Number(amplitudeInput.value),
    sampleRate: Number(sampleRateInput.value),
    duration: Number(durationInput.value),
  };

  const signal = generateSineWave(config);
  const spectrum = computeSpectrum(signal, config.sampleRate);
  drawSpectrum(spectrum);
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  setupCanvasesForDPR();
  refreshVisualization();
  drawWaveBtn.addEventListener('click', refreshVisualization);
  fftBtn.addEventListener('click', handleFFT);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupCanvasesForDPR();
      refreshVisualization();
    }, 150);
  });
});
