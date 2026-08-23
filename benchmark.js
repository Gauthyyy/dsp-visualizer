import { fftReal } from './src/fft.js';
import { performance } from 'perf_hooks';

// Generate a random signal
const sampleRate = 44100;
const signalLength = 32768;
const signal = new Float64Array(signalLength);
for (let i = 0; i < signalLength; i++) {
  signal[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) + Math.random() * 0.1;
}

// Warmup
for (let i = 0; i < 100; i++) {
  fftReal(signal, sampleRate);
}

const numIterations = 1000;
const start = performance.now();
for (let i = 0; i < numIterations; i++) {
  fftReal(signal, sampleRate);
}
const end = performance.now();
console.log(`Average time per FFT: ${(end - start) / numIterations} ms`);
