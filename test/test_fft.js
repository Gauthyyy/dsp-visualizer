import { fftReal } from '../src/fft.js';

function generateSineWave(frequency, amplitude, sampleRate, duration) {
  const sampleCount = Math.floor(sampleRate * duration);
  const angularIncrement = (2 * Math.PI * frequency) / sampleRate;
  const signal = new Float64Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    signal[i] = amplitude * Math.sin(i * angularIncrement);
  }
  return signal;
}

function findPeakFrequency(result) {
  const { frequencies, magnitudes } = result;
  let maxIdx = 1; // skip DC
  for (let i = 1; i < magnitudes.length; i++) {
    if (magnitudes[i] > magnitudes[maxIdx]) maxIdx = i;
  }
  return { index: maxIdx, frequency: frequencies[maxIdx], magnitude: magnitudes[maxIdx] };
}

const sampleRate = 1024;
const toneFreq = 50; // Hz
const duration = 1; // second
const amplitude = 1;

const signal = generateSineWave(toneFreq, amplitude, sampleRate, duration);
const spectrum = fftReal(signal, sampleRate);
const peak = findPeakFrequency(spectrum);

console.log('Expected frequency:', toneFreq, 'Hz');
console.log('Detected peak:', peak.frequency.toFixed(6), 'Hz (index', peak.index + ') magnitude', peak.magnitude.toExponential(3));

const resolution = sampleRate / (Math.pow(2, Math.ceil(Math.log2(signal.length))));
const tol = Math.max(resolution, 1e-6);

if (Math.abs(peak.frequency - toneFreq) <= tol) {
  console.log('FFT peak detection: PASS (within', tol, 'Hz)');
  process.exit(0);
} else {
  console.error('FFT peak detection: FAIL (tolerance', tol, 'Hz)');
  process.exit(2);
}
