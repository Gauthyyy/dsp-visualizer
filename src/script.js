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

function generateSineWave({ frequency = 5, amplitude = 1, sampleRate = 256, duration = 1 }) {
  const sampleCount = Math.floor(sampleRate * duration);
  const angularIncrement = (2 * Math.PI * frequency) / sampleRate;
  const signal = new Array(sampleCount);

  for (let i = 0; i < sampleCount; i += 1) {
    signal[i] = amplitude * Math.sin(i * angularIncrement);
  }

  return signal;
}

function placeholderFFT(signal) {
  const length = signal.length;
  const spectrum = new Array(Math.floor(length / 2)).fill(0);

  // Placeholder logic: use sine wave frequency and magnitude as an approximation
  // Replace this with a proper FFT implementation for a complete visualizer.
  const estimatedPeak = Math.round(signal.length / 10);
  if (spectrum[estimatedPeak] !== undefined) {
    spectrum[estimatedPeak] = Math.max(...signal.map(Math.abs));
  }

  return {
    frequencies: spectrum.map((_, index) => index),
    magnitudes: spectrum,
  };
}

function drawWaveform(signal) {
  const { width, height } = waveCanvas;
  waveContext.clearRect(0, 0, width, height);
  waveContext.strokeStyle = '#6bd9ff';
  waveContext.lineWidth = 2;
  waveContext.beginPath();

  signal.forEach((value, index) => {
    const x = (index / (signal.length - 1)) * width;
    const y = height / 2 - value * (height / 2 * 0.85);
    if (index === 0) {
      waveContext.moveTo(x, y);
    } else {
      waveContext.lineTo(x, y);
    }
  });

  waveContext.stroke();
}

function drawSpectrum({ frequencies, magnitudes }) {
  const { width, height } = spectrumCanvas;
  spectrumContext.clearRect(0, 0, width, height);
  spectrumContext.fillStyle = 'rgba(85, 192, 255, 0.14)';
  const barWidth = width / frequencies.length;

  magnitudes.forEach((magnitude, index) => {
    const x = index * barWidth;
    const barHeight = (magnitude / Math.max(...magnitudes, 1)) * (height * 0.9);
    spectrumContext.fillRect(x, height - barHeight, barWidth * 0.85, barHeight);
  });
}

function refreshVisualization() {
  const config = {
    frequency: Number(frequencyInput.value),
    amplitude: Number(amplitudeInput.value),
    sampleRate: Number(sampleRateInput.value),
    duration: Number(durationInput.value),
  };

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
  const spectrum = placeholderFFT(signal);
  drawSpectrum(spectrum);
}

window.addEventListener('DOMContentLoaded', () => {
  refreshVisualization();
  drawWaveBtn.addEventListener('click', refreshVisualization);
  fftBtn.addEventListener('click', handleFFT);
});
