// Simple radix-2 Cooley–Tukey FFT with Hann window and real-input helper.

const fftCache = {};
const hannCache = {};

function nextPow2(v) {
  if (v <= 1) return 1;
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  return v + 1;
}

function getHannWindow(L) {
  if (hannCache[L]) return hannCache[L];
  const w = new Float64Array(L);
  const denom = L - 1 || 1;
  for (let n = 0; n < L; n++) {
    w[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / denom));
  }
  hannCache[L] = w;
  return w;
}

function getFftCache(n) {
  if (fftCache[n]) return fftCache[n];

  // Precompute swappers
  const swappers = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    if (i < j) {
      swappers.push(i, j);
    }
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
  }

  // Precompute twiddle factors
  const half = n / 2;
  const cosTable = new Float64Array(half);
  const sinTable = new Float64Array(half);
  for (let i = 0; i < half; i++) {
    const ang = -2 * Math.PI * i / n;
    cosTable[i] = Math.cos(ang);
    sinTable[i] = Math.sin(ang);
  }

  fftCache[n] = {
    swappers: new Int32Array(swappers),
    cosTable,
    sinTable
  };

  return fftCache[n];
}

function fftComplex(real, imag) {
  const n = real.length;
  if ((n & (n - 1)) !== 0) throw new Error('fftComplex: length must be power of two');

  const cache = getFftCache(n);
  const swappers = cache.swappers;
  const cosTable = cache.cosTable;
  const sinTable = cache.sinTable;

  // Bit-reverse permutation using precomputed swappers
  const swapLen = swappers.length;
  for (let idx = 0; idx < swapLen; idx += 2) {
    const i = swappers[idx];
    const j = swappers[idx + 1];
    const tr = real[i]; real[i] = real[j]; real[j] = tr;
    const ti = imag[i]; imag[i] = imag[j]; imag[j] = ti;
  }

  // Cooley–Tukey FFT
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const step = n / len;
    for (let i = 0; i < n; i += len) {
      let idx = 0;
      for (let k = 0; k < halfLen; k++) {
        const wr = cosTable[idx];
        const wi = sinTable[idx];
        idx += step;

        const i_k = i + k;
        const i_k_half = i_k + halfLen;

        const uReal = real[i_k];
        const uImag = imag[i_k];
        const vReal = real[i_k_half] * wr - imag[i_k_half] * wi;
        const vImag = real[i_k_half] * wi + imag[i_k_half] * wr;

        real[i_k] = uReal + vReal;
        imag[i_k] = uImag + vImag;
        real[i_k_half] = uReal - vReal;
        imag[i_k_half] = uImag - vImag;
      }
    }
  }
}

function fftReal(signal, sampleRate) {
  const L = signal.length;
  if (L === 0) {
    return {
      frequencies: new Float64Array(0),
      magnitudes: new Float64Array(0)
    };
  }
  const N = nextPow2(L);

  // Apply Hann window to the original signal length and zero-pad to N
  const real = new Float64Array(N);
  const w = getHannWindow(L);
  for (let i = 0; i < L; i++) {
    real[i] = signal[i] * w[i];
  }
  const imag = new Float64Array(N);

  fftComplex(real, imag);

  const half = N / 2;
  const magnitudes = new Float64Array(half);
  const freqs = new Float64Array(half);
  const normFactor = 1 / N;

  for (let k = 0; k < half; k++) {
    const re = real[k];
    const im = imag[k];
    // scale: magnitude/N gives amplitude per bin; multiply by 2 for single-sided (except DC)
    let mag = Math.sqrt(re * re + im * im) * normFactor;
    if (k > 0) mag *= 2;
    magnitudes[k] = mag;
    freqs[k] = (k * sampleRate) * normFactor;
  }

  return {
    frequencies: freqs,
    magnitudes: magnitudes,
  };
}

export { fftReal };
export default fftReal;
