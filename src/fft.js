// Simple radix-2 Cooley–Tukey FFT with Hann window and real-input helper.
// Exposes: window.fftReal(signalArray, sampleRate) -> { frequencies: [], magnitudes: [] }

function nextPow2(v) {
  return 1 << Math.ceil(Math.log2(v));
}

function hannWindow(buf) {
  const N = buf.length;
  const out = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    const w = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)));
    out[n] = buf[n] * w;
  }
  return out;
}

function fftComplex(real, imag) {
  const n = real.length;
  if ((n & (n - 1)) !== 0) throw new Error('fftComplex: length must be power of two');

  // Bit-reverse permutation
  let j = 0;
  for (let i = 1; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = real[i]; real[i] = real[j]; real[j] = tr;
      const ti = imag[i]; imag[i] = imag[j]; imag[j] = ti;
    }
  }

  // Cooley–Tukey
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len;
    const wlenReal = Math.cos(ang);
    const wlenImag = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wr = 1, wi = 0;
      for (let k = 0; k < (len >> 1); k++) {
        const uReal = real[i + k];
        const uImag = imag[i + k];
        const vReal = real[i + k + (len >> 1)] * wr - imag[i + k + (len >> 1)] * wi;
        const vImag = real[i + k + (len >> 1)] * wi + imag[i + k + (len >> 1)] * wr;
        real[i + k] = uReal + vReal;
        imag[i + k] = uImag + vImag;
        real[i + k + (len >> 1)] = uReal - vReal;
        imag[i + k + (len >> 1)] = uImag - vImag;
        const tmpWr = wr * wlenReal - wi * wlenImag;
        wi = wr * wlenImag + wi * wlenReal;
        wr = tmpWr;
      }
    }
  }
  return { real, imag };
}

function fftReal(signal, sampleRate) {
  const L = signal.length;
  const N = nextPow2(L);
  // Apply Hann window to the original signal length and zero-pad to N
  const windowed = hannWindow(new Float64Array(signal));
  const real = new Float64Array(N);
  real.set(windowed);
  const imag = new Float64Array(N); // zeros

  fftComplex(real, imag);

  const half = N / 2;
  const magnitudes = new Float64Array(half);
  const freqs = new Float64Array(half);
  for (let k = 0; k < half; k++) {
    const re = real[k];
    const im = imag[k];
    // scale: magnitude/N gives amplitude per bin; multiply by 2 for single-sided (except DC)
    let mag = Math.sqrt(re * re + im * im) / N;
    if (k > 0) mag *= 2;
    magnitudes[k] = mag;
    freqs[k] = k * sampleRate / N;
  }

  return {
    frequencies: Array.from(freqs),
    magnitudes: Array.from(magnitudes),
  };
}

export { fftReal };

// Default export for convenience
export default fftReal;
