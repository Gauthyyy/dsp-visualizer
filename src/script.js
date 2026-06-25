import { fftReal } from './fft.js';

const frequencyInput = document.getElementById('frequency');
const amplitudeInput = document.getElementById('amplitude');
const sampleRateInput = document.getElementById('sampleRate');
const durationInput = document.getElementById('duration');
const drawWaveBtn = document.getElementById('drawWaveBtn');
const fftBtn = document.getElementById('fftBtn');
const waveCanvas = document.getElementById('waveCanvas');
const spectrumCanvas = document.getElementById('spectrumCanvas');
const errorDisplay = document.getElementById('errorDisplay');

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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  });
  
  console.log('Canvas DPR setup complete. DPR:', dpr);
}

function generateSineWave({ frequency = 5, amplitude = 1, sampleRate = 256, duration = 1 }) {
  const sampleCount = Math.floor(sampleRate * duration);
  const angularIncrement = (2 * Math.PI * frequency) / sampleRate;
  const signal = new Float64Array(sampleCount);

  for (let i = 0; i < sampleCount; i += 1) {
    signal[i] = amplitude * Math.sin(i * angularIncrement);
  }

  return signal;
}

function computeSpectrum(signal, sampleRate) {
  return fftReal(signal, sampleRate);
}

function drawWaveform(signal) {
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = waveCanvas.width / dpr;
  const displayHeight = waveCanvas.height / dpr;
  console.log('Drawing waveform, signal length:', signal.length);
  waveContext.clearRect(0, 0, displayWidth, displayHeight);
  
  // Draw center guide line
  waveContext.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  waveContext.lineWidth = 1;
  waveContext.beginPath();
  waveContext.moveTo(0, displayHeight / 2);
  waveContext.lineTo(displayWidth, displayHeight / 2);
  waveContext.stroke();

  // Draw waveform
  waveContext.strokeStyle = '#6bd9ff';
  waveContext.lineWidth = 2;
  waveContext.beginPath();

  const padding = 20; // 20px padding on top/bottom to prevent line clipping
  const drawHeight = displayHeight - 2 * padding;
  const halfDrawHeight = drawHeight / 2;
  const centerY = padding + halfDrawHeight;
  const len = signal.length;
  const maxIdx = Math.max(len - 1, 1);

  for (let i = 0; i < len; i++) {
    const x = (i / maxIdx) * displayWidth;
    const y = centerY - signal[i] * halfDrawHeight;
    if (i === 0) {
      waveContext.moveTo(x, y);
    } else {
      waveContext.lineTo(x, y);
    }
  }

  waveContext.stroke();
  console.log('Waveform drawn.');
}

function drawSpectrum({ frequencies, magnitudes }) {
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = spectrumCanvas.width / dpr;
  const displayHeight = spectrumCanvas.height / dpr;
  spectrumContext.clearRect(0, 0, displayWidth, displayHeight);
  spectrumContext.fillStyle = 'rgba(85, 192, 255, 0.85)';
  
  const len = magnitudes.length;
  if (len === 0) return;
  const barWidth = displayWidth / frequencies.length;

  // Compute max magnitude efficiently without array spread operator
  let maxMag = 0;
  for (let i = 0; i < len; i++) {
    if (magnitudes[i] > maxMag) {
      maxMag = magnitudes[i];
    }
  }
  if (maxMag === 0) maxMag = 1;

  const displayHeightFactor = displayHeight * 0.9;
  const dbNormDivisor = 60;

  for (let index = 0; index < len; index++) {
    const magnitude = magnitudes[index];
    // dB scaling for better visibility (small epsilon to avoid log(0))
    const val = 20 * Math.log10(magnitude / maxMag + 1e-12);
    const norm = Math.max(0, (val + 60) / dbNormDivisor); // map -60..0 dB -> 0..1
    const x = index * barWidth;
    const barHeight = norm * displayHeightFactor;
    spectrumContext.fillRect(x, displayHeight - barHeight, barWidth * 0.85, barHeight);
  }
}

function getConfig() {
  return {
    frequency: Number(frequencyInput.value),
    amplitude: Number(amplitudeInput.value),
    sampleRate: Number(sampleRateInput.value),
    duration: Number(durationInput.value),
  };
}

function validateInputs() {
  const frequency = Number(frequencyInput.value);
  const amplitude = Number(amplitudeInput.value);
  const sampleRate = Number(sampleRateInput.value);
  const duration = Number(durationInput.value);

  const errors = [];

  // Frequency validation
  if (frequencyInput.value === '' || isNaN(frequency)) {
    errors.push('Frequency must be a valid number.');
  } else if (frequency < 1 || frequency > 100) {
    errors.push('Frequency must be between 1 and 100 Hz.');
  }

  // Amplitude validation
  if (amplitudeInput.value === '' || isNaN(amplitude)) {
    errors.push('Amplitude must be a valid number.');
  } else if (amplitude < 0.1 || amplitude > 5) {
    errors.push('Amplitude must be between 0.1 and 5.0.');
  }

  // Sample rate validation
  if (sampleRateInput.value === '' || isNaN(sampleRate)) {
    errors.push('Sample Rate must be a valid number.');
  } else if (sampleRate < 50 || sampleRate > 8192) {
    errors.push('Sample Rate must be between 50 and 8192 Hz.');
  } else if (!Number.isInteger(sampleRate)) {
    errors.push('Sample Rate must be a whole number (integer).');
  }

  // Duration validation
  if (durationInput.value === '' || isNaN(duration)) {
    errors.push('Duration must be a valid number.');
  } else if (duration < 0.1 || duration > 10) {
    errors.push('Duration must be between 0.1 and 10.0 seconds.');
  }

  if (errors.length > 0) {
    errorDisplay.innerHTML = errors.map(err => `<div>• ${err}</div>`).join('');
    errorDisplay.style.display = 'block';
    drawWaveBtn.disabled = true;
    fftBtn.disabled = true;
    return false;
  } else {
    errorDisplay.style.display = 'none';
    errorDisplay.innerHTML = '';
    drawWaveBtn.disabled = false;
    fftBtn.disabled = false;
    return true;
  }
}

function refreshVisualization() {
  if (!validateInputs()) return;
  const config = getConfig();
  console.log('Refreshing visualization with config:', config);
  const signal = generateSineWave(config);
  drawWaveform(signal);
}

function handleFFT() {
  if (!validateInputs()) return;
  const config = getConfig();
  const signal = generateSineWave(config);
  drawSpectrum(computeSpectrum(signal, config.sampleRate));
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  setupCanvasesForDPR();
  
  // Bind live input validation
  [frequencyInput, amplitudeInput, sampleRateInput, durationInput].forEach(input => {
    input.addEventListener('input', validateInputs);
  });
  
  validateInputs();
  refreshVisualization();
  handleFFT();
  
  drawWaveBtn.addEventListener('click', refreshVisualization);
  fftBtn.addEventListener('click', handleFFT);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupCanvasesForDPR();
      refreshVisualization();
      handleFFT();
    }, 150);
  });
});
