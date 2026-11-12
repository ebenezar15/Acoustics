/* ==========================================================================
   Acoustica — formats, restoration, synthesis and creative-effects widgets.
   tapeLab, vinylEQ, codecLab, archivePlanner, denoiseLab, humNotch,
   declickDemo, expanderGate, miniSynth, adsrShape, fmLab, drumSynth,
   modFxLab, pitchTimeLab, vocoderDemo, saturationShapes.
   Simplified teaching models; every sound is synthesised in the browser.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, SR = 44100;
  const dB = (x) => 20 * Math.log10(Math.max(x, 1e-9));
  const lin = (d) => Math.pow(10, d / 20);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const C = (n) => A.css(n);
  const tipBox = (host) => { const d = el('div'); host.appendChild(d); return (items, cls = 'mentor') => { d.innerHTML = `<div class="callout ${cls}"><ul style="margin:0;padding-left:18px">${items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`; }; };
  const statRow = (host) => { const d = el('div', { class: 'stats' }); host.appendChild(d); return (h) => { d.innerHTML = h; }; };
  const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const sub = (ctx, x, y, fn) => { ctx.save(); ctx.translate(x, y); fn(); ctx.restore(); };
  const rms = (x, a = 0, b = x.length) => { let s = 0; for (let i = a; i < b; i++) s += x[i] * x[i]; return Math.sqrt(s / Math.max(1, b - a)); };
  const peakOf = (x) => { let p = 0; for (let i = 0; i < x.length; i++) { const v = Math.abs(x[i]); if (v > p) p = v; } return p; };
  const scaled = (x, g) => { const y = new Float32Array(x.length); for (let i = 0; i < x.length; i++) y[i] = x[i] * g; return y; };
  const trk = (n) => { A.audio.track(n); n.onended = () => { const l = A.audio.active || []; const i = l.indexOf(n); if (i >= 0) l.splice(i, 1); }; return n; };

  /* ---------------- small DSP kit (offline, plain arrays) ---------------- */
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -TAU / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const a = i + k, b = a + len / 2;
          const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
  }
  function ifft(re, im) { for (let i = 0; i < re.length; i++) im[i] = -im[i]; fft(re, im); const n = re.length; for (let i = 0; i < n; i++) { re[i] /= n; im[i] = -im[i] / n; } }
  /** RBJ biquad coefficients */
  function bq(type, f0, Q = 0.707, g = 0) {
    const w = TAU * clamp(f0, 5, SR * 0.49) / SR, cs = Math.cos(w), sn = Math.sin(w), al = sn / (2 * Q), Aq = Math.pow(10, g / 40);
    let b0, b1, b2, a0, a1, a2;
    if (type === 'lowpass') { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; }
    else if (type === 'highpass') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; }
    else if (type === 'bandpass') { b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; }
    else if (type === 'notch') { b0 = 1; b1 = -2 * cs; b2 = 1; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; }
    else if (type === 'allpass') { b0 = 1 - al; b1 = -2 * cs; b2 = 1 + al; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; }
    else { b0 = 1 + al * Aq; b1 = -2 * cs; b2 = 1 - al * Aq; a0 = 1 + al / Aq; a1 = -2 * cs; a2 = 1 - al / Aq; }
    return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
  }
  function bqRun(c, x) { const y = new Float32Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < x.length; i++) { const v = c.b0 * x[i] + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2; x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v; } return y; }
  /** complex response [re, im] of a biquad at f */
  function bqH(c, f) {
    const w = TAU * f / SR, c1 = Math.cos(w), s1 = -Math.sin(w), c2 = Math.cos(2 * w), s2 = -Math.sin(2 * w);
    const nr = c.b0 + c.b1 * c1 + c.b2 * c2, ni = c.b1 * s1 + c.b2 * s2, dr = 1 + c.a1 * c1 + c.a2 * c2, di = c.a1 * s1 + c.a2 * s2, d = dr * dr + di * di;
    return [(nr * dr + ni * di) / d, (ni * dr - nr * di) / d];
  }
  const bqMag = (c, f) => { const h = bqH(c, f); return Math.hypot(h[0], h[1]); };
  /** short-time transform with overlap-add; fn(re, im, frame) edits the spectrum in place */
  function stft(x, N, fn) {
    const hop = N / 4, y = new Float32Array(x.length), win = new Float32Array(N), re = new Float32Array(N), im = new Float32Array(N);
    for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(TAU * i / N);
    for (let p = -N + hop, fr = 0; p < x.length; p += hop, fr++) {
      for (let i = 0; i < N; i++) { const k = p + i; re[i] = k >= 0 && k < x.length ? x[k] * win[i] : 0; im[i] = 0; }
      fft(re, im); fn(re, im, fr); ifft(re, im);
      for (let i = 0; i < N; i++) { const k = p + i; if (k >= 0 && k < x.length) y[k] += re[i] * win[i] / 1.5; }
    }
    return y;
  }
  /** average spectrum in 1/6-octave bands: [[f, dB], …] */
  function bandSpec(x, a = 0, b = x.length) {
    const N = 2048, re = new Float32Array(N), im = new Float32Array(N), pw = new Float64Array(N / 2); let frames = 0;
    for (let p = a; p + N <= b; p += N) { for (let i = 0; i < N; i++) { re[i] = x[p + i] * (0.5 - 0.5 * Math.cos(TAU * i / N)); im[i] = 0; } fft(re, im); for (let k = 0; k < N / 2; k++) pw[k] += re[k] * re[k] + im[k] * im[k]; frames++; }
    const out = [];
    for (let f = 31.5; f < 17000; f *= Math.pow(2, 1 / 6)) {
      const k0 = Math.max(1, Math.floor(f / Math.pow(2, 1 / 12) * N / SR)), k1 = Math.max(k0 + 1, Math.ceil(f * Math.pow(2, 1 / 12) * N / SR)); let s = 0;
      for (let k = k0; k < k1 && k < N / 2; k++) s += pw[k];
      out.push([f, 10 * Math.log10(s / Math.max(1, frames) / (N * N / 16) + 1e-12)]);
    }
    return out;
  }
  let _music = null;
  /** four seconds of plucked, music-like material with a silent gap at the end */
  function music() {
    if (_music) return _music;
    const n = SR * 4, x = new Float32Array(n);
    const seq = [[0, 220], [0.25, 277.2], [0.5, 329.6], [0.75, 440], [1, 196], [1.25, 246.9], [1.5, 293.7], [1.75, 392], [2, 174.6], [2.25, 220], [2.5, 261.6], [2.75, 349.2], [3, 164.8], [3.25, 207.7]];
    for (const [t0, f] of seq) { const i0 = Math.round(t0 * SR), i1 = Math.min(n, i0 + Math.round(1.1 * SR)); for (let i = i0; i < i1; i++) { const tt = (i - i0) / SR; let s = 0; for (let k = 1; k <= 10; k++) s += Math.sin(TAU * f * k * tt) / k * Math.exp(-tt * (2.5 + 1.1 * k)); x[i] += s * Math.min(1, tt / 0.004) * 0.5; } }
    for (const [t0, f] of [[0, 110], [1, 98], [2, 87.3], [3, 82.4]]) { const i0 = Math.round(t0 * SR), i1 = Math.min(n, i0 + Math.round(0.95 * SR)); for (let i = i0; i < i1; i++) { const tt = (i - i0) / SR; x[i] += (Math.sin(TAU * f * tt) + 0.3 * Math.sin(TAU * 2 * f * tt)) * Math.exp(-tt * 2.2) * Math.min(1, tt / 0.006) * 0.6; } }
    for (let i = Math.round(3.5 * SR); i < n; i++) x[i] *= Math.max(0, 1 - (i / SR - 3.5) / 0.12);
    const p = peakOf(x); for (let i = 0; i < n; i++) x[i] *= 0.5 / p;
    return (_music = x);
  }
  let _white = null;
  const whiteArr = () => { if (!_white) { const r = rng(7); _white = new Float32Array(SR * 4); for (let i = 0; i < _white.length; i++) _white[i] = r() * 2 - 1; } return _white; };
  /** click detector / interpolator shared by two widgets */
  function declick(x, thr, w) {
    const n = x.length, flag = new Uint8Array(n), y = Float32Array.from(x), regions = [];
    for (let i = 2; i < n; i++) if (Math.abs(x[i] - 2 * x[i - 1] + x[i - 2]) > thr) { for (let k = Math.max(0, i - 1 - w); k <= Math.min(n - 1, i - 1 + w); k++) flag[k] = 1; }
    for (let i = 1; i < n - 1; i++) if (flag[i]) { let j = i; while (j < n - 1 && flag[j]) j++; const a = x[i - 1], b = x[j]; for (let k = i; k < j; k++) y[k] = a + (b - a) * (k - i + 1) / (j - i + 1); regions.push([i, j]); i = j; }
    return { y, regions };
  }
  /** downward expander / gate; returns processed signal and gain trace (dB) */
  function expand(x, p) {
    const n = x.length, y = new Float32Array(n), g = new Float32Array(n), lv = new Float32Array(n);
    const dAtt = Math.exp(-1 / (0.001 * SR)), dRel = Math.exp(-1 / (0.03 * SR)), ca = Math.exp(-1 / (Math.max(0.05, p.att) / 1000 * SR)), cr = Math.exp(-1 / (Math.max(1, p.rel) / 1000 * SR));
    let env = 0, gd = p.range;
    for (let i = 0; i < n; i++) {
      const a = Math.abs(x[i]); env = a > env ? a + (env - a) * dAtt : a + (env - a) * dRel;
      const L = dB(env); lv[i] = L;
      const target = L >= p.thr ? 0 : Math.max(p.range, (L - p.thr) * (p.ratio - 1));
      gd = target + (gd - target) * (target > gd ? ca : cr);
      g[i] = gd; y[i] = x[i] * lin(gd);
    }
    return { y, g, lv };
  }
  /** row of play buttons for offline-rendered loops */
  function player(host, items, getBuf) {
    const row = el('div', { class: 'row', style: { flexWrap: 'wrap', margin: '8px 0' } }); host.appendChild(row);
    let src = null, cur = null, deb = 0; const btn = {};
    const label = (id) => items.find((x) => x[0] === id)[1];
    function stop() { clearTimeout(deb); if (src) { try { src.stop(); } catch (e) { /* */ } try { src.disconnect(); } catch (e) { /* */ } src = null; } if (cur) { btn[cur].classList.remove('primary'); btn[cur].innerHTML = A.icon('play') + ' ' + label(cur); } cur = null; }
    function start(id) {
      const ctx = A.audio.get(); if (!ctx) return;
      const data = getBuf(id); if (!data) return;
      const prev = cur; if (src) { try { src.stop(); } catch (e) { /* */ } try { src.disconnect(); } catch (e) { /* */ } }
      if (prev && prev !== id) { btn[prev].classList.remove('primary'); btn[prev].innerHTML = A.icon('play') + ' ' + label(prev); }
      const buf = ctx.createBuffer(1, data.length, SR), d = buf.getChannelData(0), fade = 400;
      for (let i = 0; i < data.length; i++) { const e = Math.min(1, i / fade, (data.length - 1 - i) / fade); d[i] = clamp(data[i], -0.5, 0.5) * e; }
      src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(ctx.destination); src.start(); trk(src);
      cur = id; btn[id].classList.add('primary'); btn[id].innerHTML = A.icon('stop') + ' Stop';
    }
    items.forEach(([id, l]) => { const b = el('button', { html: A.icon('play') + ' ' + l }); b.addEventListener('click', () => (cur === id ? stop() : start(id))); btn[id] = b; row.appendChild(b); });
    A.onLeave(stop);
    return { stop, refresh() { if (!cur) return; clearTimeout(deb); const id = cur; deb = setTimeout(() => { if (cur === id) start(id); }, 180); }, get playing() { return cur; } };
  }
  /** harmonic levels (linear) of a waveshaper driven by a sine of amplitude a */
  function harmonicsOf(fn, a, count = 8) {
    const N = 1024, re = new Float32Array(N), im = new Float32Array(N);
    for (let i = 0; i < N; i++) re[i] = fn(a * Math.sin(TAU * 8 * i / N));
    fft(re, im); const h = [];
    for (let k = 1; k <= count; k++) h.push(2 * Math.hypot(re[8 * k], im[8 * k]) / N);
    return h;
  }
  const thdOf = (h) => Math.sqrt(h.slice(1).reduce((s, v) => s + v * v, 0)) / Math.max(h[0], 1e-9);

  /* ======================================================================
     1. Tape lab — level, speed, width and bias
     ====================================================================== */
  V.tapeLab = function (host) {
    const A0 = 0.3;
    const st = A.controls(host, [
      { key: 'level', label: 'Record level (re. nominal)', type: 'range', min: -20, max: 15, step: 1, value: 0, unit: 'dB' },
      { key: 'speed', label: 'Tape speed', type: 'select', numeric: true, value: 38, options: [[9.5, '9.5 cm/s (slow)'], [19, '19 cm/s'], [38, '38 cm/s'], [76, '76 cm/s (fast)']] },
      { key: 'width', label: 'Track width', type: 'select', value: 'std', options: [['narrow', 'Narrow (many tracks)'], ['std', 'Standard'], ['wide', 'Wide (stereo master)']] },
      { key: 'bias', label: 'Bias setting', type: 'select', value: 'ok', options: [['under', 'Under-biased'], ['ok', 'Correct'], ['over', 'Over-biased']] },
    ], update);
    const sat = (x) => (st.bias === 'under' ? Math.tanh(x) - 0.045 * Math.tanh(x / 0.045) : st.bias === 'over' ? Math.tanh(1.15 * x) / 1.15 : Math.tanh(x));
    let M = {};
    function model() {
      const amp = A0 * lin(st.level), h = harmonicsOf(sat, amp, 7);
      const noise = -58 - 3 * Math.log2(st.speed / 19) - { narrow: -4, std: 0, wide: 4 }[st.width];
      const hf = { 9.5: 10000, 19: 16000, 38: 22000, 76: 28000 }[st.speed] * (st.bias === 'over' ? 0.7 : st.bias === 'under' ? 1.08 : 1);
      let mol = 15; for (let L = -6; L <= 15; L += 0.5) if (thdOf(harmonicsOf(sat, A0 * lin(L), 7)) > 0.03) { mol = L; break; }
      M = { amp, h, thd: thdOf(h) * 100, noise, hf, bump: 1.8 * st.speed, comp: dB(h[0] / amp), mol };
    }
    const play = player(host, [['clean', 'Clean source'], ['tape', 'Through the tape model']], (id) => {
      const n = SR * 2, x = new Float32Array(n);
      for (let b = 0; b < 4; b++) { const i0 = Math.round(b * 0.5 * SR); for (let i = 0; i < 0.3 * SR; i++) { const tt = i / SR, f = 50 + 90 * Math.exp(-tt * 30); x[i0 + i] += Math.sin(TAU * (50 * tt + 3 * (1 - Math.exp(-tt * 30)))) * Math.exp(-tt * 11); void f; } const j0 = i0 + Math.round(0.25 * SR); for (let i = 0; i < 0.22 * SR; i++) { const tt = i / SR; x[j0 + i] += (Math.sin(TAU * 330 * tt) + 0.5 * Math.sin(TAU * 495 * tt) + 0.3 * Math.sin(TAU * 1320 * tt)) * Math.exp(-tt * 14) * 0.35; } }
      const p = peakOf(x); for (let i = 0; i < n; i++) x[i] *= A0 / p;
      if (id === 'clean') return scaled(x, 0.22 / A0);
      const g = lin(st.level), w = whiteArr(), nz = A0 * lin(M.noise) * 1.7; let y = new Float32Array(n);
      for (let i = 0; i < n; i++) y[i] = sat(x[i] * g);
      y = bqRun(bq('lowpass', M.hf, 0.7), y); y = bqRun(bq('peak', M.bump, 1.2, 2.5), y);
      for (let i = 0; i < n; i++) y[i] = (y[i] + w[i] * nz) / g * (0.22 / A0);
      return y;
    });
    const stats = statRow(host);
    A.canvas(host, {
      height: 330, animate: true,
      caption: 'Left: the tape transfer curve with the signal riding on it. Right: the harmonics that curve adds. Bottom: where your level sits between the hiss floor and saturation.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t);
        const lw = Math.min(w * 0.44, 250), ph = 190, pad = 26;
        // transfer curve
        const cx = lw / 2 + 8, cy = 12 + ph / 2, sc = (Math.min(lw, ph) - pad) / 2 / 1.7;
        ctx.strokeStyle = C('line'); ctx.lineWidth = 1; ctx.strokeRect(8.5, 12.5, lw, ph);
        ctx.beginPath(); ctx.moveTo(8, cy); ctx.lineTo(8 + lw, cy); ctx.moveTo(cx, 12); ctx.lineTo(cx, 12 + ph); ctx.stroke();
        ctx.setLineDash([4, 4]); ctx.strokeStyle = C('muted'); ctx.beginPath(); ctx.moveTo(cx - sc * 1.2, cy + sc * 1.2); ctx.lineTo(cx + sc * 1.2, cy - sc * 1.2); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = C('accent'); ctx.lineWidth = 2.5; ctx.beginPath();
        for (let i = 0; i <= 80; i++) { const x = -1.7 + 3.4 * i / 80, y = sat(x); const px = cx + x * sc, py = cy - y * sc; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
        const xi = clamp(M.amp, 0, 1.7) * Math.sin(t * 3), yi = sat(xi);
        ctx.fillStyle = A.alpha(C('accent2'), 0.25); ctx.fillRect(cx - clamp(M.amp, 0, 1.7) * sc, 12, 2 * clamp(M.amp, 0, 1.7) * sc, ph);
        ctx.fillStyle = C('accent2'); ctx.beginPath(); ctx.arc(cx + xi * sc, cy - yi * sc, 5, 0, TAU); ctx.fill();
        A.text(ctx, 'in →', 12, 12 + ph - 6, { size: 10, color: C('muted') }); A.text(ctx, 'out ↑', cx + 4, 24, { size: 10, color: C('muted') });
        // harmonics
        const hx = lw + 30, hw = w - hx - 10, bw = hw / 7;
        ctx.strokeStyle = C('line'); ctx.strokeRect(hx + 0.5, 12.5, hw, ph);
        M.h.forEach((v, k) => { const d = clamp(dB(v / Math.max(M.h[0], 1e-9)), -70, 0), bh = (d + 70) / 70 * (ph - 30); ctx.fillStyle = k === 0 ? C('muted') : k % 2 === 0 ? C('warn') : C('c3'); ctx.fillRect(hx + k * bw + bw * 0.2, 12 + ph - 16 - bh, bw * 0.6, bh); A.text(ctx, k === 0 ? 'f' : (k + 1) + 'f', hx + k * bw + bw / 2, 12 + ph - 4, { size: 10, align: 'center', color: C('muted') }); if (k && d > -68) A.text(ctx, Math.round(d) + '', hx + k * bw + bw / 2, 12 + ph - 20 - bh, { size: 9, align: 'center', color: C('muted') }); });
        A.text(ctx, 'harmonics, dB re. fundamental', hx + hw - 6, 26, { size: 10, align: 'right', color: C('muted') });
        // dynamic-range bar
        const by = ph + 44, bx0 = 12, bx1 = w - 12, X = (d) => bx0 + (clamp(d, -75, 18) + 75) / 93 * (bx1 - bx0);
        ctx.fillStyle = C('panel2'); ctx.fillRect(bx0, by, bx1 - bx0, 28);
        ctx.fillStyle = A.alpha(C('muted'), 0.45); ctx.fillRect(bx0, by, X(M.noise) - bx0, 28);
        ctx.fillStyle = A.alpha(C('bad'), 0.4); ctx.fillRect(X(M.mol), by, bx1 - X(M.mol), 28);
        ctx.fillStyle = A.alpha(C('good'), 0.25); ctx.fillRect(X(M.noise), by, X(M.mol) - X(M.noise), 28);
        ctx.fillStyle = C('text'); ctx.fillRect(X(st.level) - 1.5, by - 6, 3, 40);
        A.text(ctx, 'hiss', bx0 + 4, by + 18, { size: 10 }); A.text(ctx, 'saturation', bx1 - 4, by + 18, { size: 10, align: 'right' });
        A.text(ctx, 'your level', clamp(X(st.level), bx0 + 30, bx1 - 30), by - 10, { size: 10, align: 'center' });
        [-60, -40, -20, 0, 10].forEach((d) => A.text(ctx, (d > 0 ? '+' : '') + d, X(d), by + 44, { size: 10, align: 'center', color: C('muted') }));
        A.text(ctx, 'dB re. nominal level', w / 2, by + 60, { size: 10, align: 'center', color: C('muted') });
      },
    });
    const tip = tipBox(host);
    function update() {
      model();
      stats(A.statBox('Distortion (THD)', fmt(M.thd, M.thd < 1 ? 2 : 1) + ' %', M.thd < 1 ? 'clean' : M.thd < 3 ? 'warm' : 'audibly saturated', M.thd < 3 ? 'good' : 'warn')
        + A.statBox('Signal-to-noise', fmt(st.level - M.noise, 0) + ' dB', 'hiss floor ' + fmt(M.noise, 0) + ' dB')
        + A.statBox('Level squeezed by', fmt(-M.comp, 1) + ' dB', '“tape compression”')
        + A.statBox('Top end to about', fmtHz(M.hf), 'head bump near ' + fmt(M.bump, 0) + ' Hz'));
      const tips = [];
      if (st.level - M.noise < 50) tips.push('Recording this low leaves the music close to the hiss. Turning it up later turns the hiss up too.');
      if (M.thd >= 3) tips.push('Past about 3 % distortion the peaks are being rounded off. On drums this can sound pleasantly thick; on piano or voice it turns to mush.');
      else if (M.thd >= 1) tips.push('This is the “sweet spot” many engineers aim for: peaks are gently rounded and the third harmonic adds weight without obvious grit.');
      if (st.bias === 'under') tips.push('Too little bias leaves a kink at the centre of the curve: quiet sounds distort the most, and the result is gritty and bright.');
      if (st.bias === 'over') tips.push('Too much bias smooths distortion but erases the top octave and lowers the maximum level.');
      if (st.speed <= 9.5) tips.push('Slow speed saves tape but loses treble and adds noise. Fast speed extends the top but moves the bass bump upward.');
      if (st.width === 'narrow') tips.push('Each halving of track width costs roughly 3 dB of signal-to-noise — the price of more tracks on the same tape.');
      if (!tips.length) tips.push('A healthy setting: plenty of room above the hiss and only the loudest peaks touch the curved part of the transfer line.');
      tip(tips); play.refresh();
    }
    update();
  };

  /* ======================================================================
     2. Vinyl record/replay equalisation and the groove budget
     ====================================================================== */
  V.vinylEQ = function (host) {
    const F1 = 50.05, F2 = 500.5, F3 = 2122;
    const rep0 = (f) => 10 * Math.log10(1 + (f / F2) ** 2) - 10 * Math.log10(1 + (f / F1) ** 2) - 10 * Math.log10(1 + (f / F3) ** 2);
    const replay = (f) => rep0(f) - rep0(1000);
    const st = A.controls(host, [
      { key: 'mins', label: 'Side length', type: 'range', min: 8, max: 30, step: 1, value: 18, unit: 'min' },
      { key: 'level', label: 'Cutting level', type: 'range', min: -8, max: 4, step: 0.5, value: 0, unit: 'dB' },
      { key: 'bass', label: 'Extra low-end in the mix', type: 'range', min: 0, max: 12, step: 1, value: 3, unit: 'dB' },
      { key: 'wide', label: 'Bass panned wide / out of phase', type: 'check', value: false },
    ], update);
    const stats = statRow(host);
    const freqs = []; for (let f = 20; f <= 20000; f *= 1.06) freqs.push(f);
    host.appendChild(A.legend([[C('accent'), 'Cutting (record) curve'], [C('accent2'), 'Replay curve'], [C('good'), 'Sum: flat'], [C('c3'), 'Groove swing with the curve'], [C('muted'), 'Groove swing without it', true]]));
    A.canvas(host, {
      height: 440,
      caption: 'Top: the cutting curve thins the bass and lifts the treble; the replay curve is its mirror image, so the two add up flat. Bottom: how far the stylus must swing sideways for the same electrical level.',
      draw(ctx, w) {
        sub(ctx, 0, 0, () => {
          const ax = A.axes(ctx, w, 215, { x: { min: 20, max: 20000, log: true }, y: { min: -25, max: 25, label: 'dB' } });
          A.plotLine(ctx, ax, freqs.map((f) => [f, -replay(f)]), C('accent'), 2.5);
          A.plotLine(ctx, ax, freqs.map((f) => [f, replay(f)]), C('accent2'), 2.5);
          A.plotLine(ctx, ax, freqs.map((f) => [f, 0]), C('good'), 2);
          [F1, F2, F3].forEach((f) => { ctx.strokeStyle = C('muted'); ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(ax.X(f), ax.y1); ctx.lineTo(ax.X(f), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, A.shortHz(Math.round(f / 10) * 10) + ' Hz', ax.X(f) + 3, ax.y1 + 12, { size: 10, color: C('muted') }); });
        });
        sub(ctx, 0, 222, () => {
          const ax = A.axes(ctx, w, 215, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: -40, max: 40, label: 'swing, dB' } });
          A.plotLine(ctx, ax, freqs.map((f) => [f, -20 * Math.log10(f / 1000)]), C('muted'), 2, [5, 4]);
          A.plotLine(ctx, ax, freqs.map((f) => [f, -20 * Math.log10(f / 1000) - replay(f) + st.bass / (1 + Math.pow(f / 110, 4))]), C('c3'), 2.5);
        });
      },
    });
    const gv = A.canvas(host, {
      height: 120, animate: true,
      caption: 'A slice of the disc surface: neighbouring turns of the groove. Longer sides squeeze the turns together; louder, bassier cuts make each one swing wider.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t);
        const sp = 300 / st.mins, amp = 5.2 * lin(st.level + st.bass * 0.6), hit = amp * 2 > sp * 0.92;
        ctx.fillStyle = C('panel2'); ctx.fillRect(0, 0, w, h);
        for (let k = -1, y0 = 8; y0 < h + sp; k++, y0 += sp) {
          ctx.strokeStyle = hit ? C('bad') : C('text'); ctx.lineWidth = 1.6; ctx.beginPath();
          for (let x = 0; x <= w; x += 3) { const ph = x * 0.035 + t * 2 + k * 1.9; const y = y0 + amp * (Math.sin(ph) * 0.8 + 0.2 * Math.sin(ph * 5.3)); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke();
          if (st.wide) { ctx.strokeStyle = A.alpha(C('warn'), 0.7); ctx.lineWidth = 1 + 2.5 * Math.abs(Math.sin(t * 2 + k)); ctx.stroke(); }
        }
        if (hit) A.text(ctx, 'grooves collide', w / 2, 16, { size: 12, weight: 700, align: 'center', color: C('bad'), bg: C('panel') });
      },
    });
    const tip = tipBox(host);
    function update() {
      const sp = 300 / st.mins, allowed = dB(sp * 0.92 / 2 / 5.2) - st.bass * 0.6, ok = st.level <= allowed;
      stats(A.statBox('Replay bass lift at 20 Hz', '+' + fmt(replay(20), 1) + ' dB', 'undoes the cut made on the lathe')
        + A.statBox('Replay treble cut at 20 kHz', fmt(replay(20000), 1) + ' dB', 'and takes surface hiss down with it')
        + A.statBox('Loudest clean cut for this side', (allowed >= 0 ? '+' : '') + fmt(allowed, 1) + ' dB', 'illustrative model', ok ? 'good' : 'bad')
        + A.statBox('Verdict', ok ? 'Fits' : 'Will not fit', ok ? 'room between the turns' : 'lower level, less bass or a shorter side', ok ? 'good' : 'bad'));
      const tips = [];
      if (!ok) tips.push('The turns of the groove are touching. The cutting engineer must lower the level, filter the deepest bass, or you must shorten the side.');
      if (st.mins > 22) tips.push('Beyond roughly 20–22 minutes a side, level and bass have to drop noticeably and surface noise becomes more audible.');
      if (st.wide) tips.push('Out-of-phase bass becomes up-and-down groove movement. Too much and the stylus is thrown out, or the cutter lifts off the lacquer — keep everything below about 150 Hz in the centre.');
      if (st.bass >= 8) tips.push('Heavy sub-bass eats space fast. A gentle high-pass around 30–40 Hz often buys a louder, cleaner cut with no audible loss.');
      tips.push('Without the replay curve a record sounds thin and screechy — that is why a turntable needs its own dedicated equalised input.');
      tip(tips); gv.redraw();
    }
    update();
  };

  /* ======================================================================
     3. Perceptual coder lab
     ====================================================================== */
  V.codecLab = function (host) {
    const NEED = { tonal: 80, dense: 128, transient: 176, speech: 56 };
    const st = A.controls(host, [
      { key: 'rate', label: 'Bit rate (stereo)', type: 'range', min: 32, max: 320, step: 8, value: 128, unit: 'kbit/s' },
      { key: 'content', label: 'Programme material', type: 'select', value: 'dense', options: [['tonal', 'Solo instrument (tonal)'], ['dense', 'Dense full mix'], ['transient', 'Castanets / applause (transients)'], ['speech', 'Speech']] },
    ], update);
    const bark = (f) => 13 * Math.atan(0.00076 * f) + 3.5 * Math.atan((f / 7500) ** 2);
    const quiet = (f) => { const k = f / 1000; return 3.64 * Math.pow(k, -0.8) - 6.5 * Math.exp(-0.6 * (k - 3.3) ** 2) + 0.001 * Math.pow(k, 4); };
    function comps(kind) {
      const r = rng({ tonal: 3, dense: 11, transient: 5, speech: 9 }[kind]), out = [];
      if (kind === 'tonal') for (let k = 1; k <= 40; k++) out.push({ f: 220 * k, L: 78 - 9 * Math.log2(k) - r() * 10 });
      else if (kind === 'speech') { for (let k = 1; k <= 30; k++) { const f = 150 * k; out.push({ f, L: 50 + 22 * Math.exp(-(((f - 600) / 350) ** 2)) + 16 * Math.exp(-(((f - 1700) / 500) ** 2)) + 10 * Math.exp(-(((f - 2700) / 500) ** 2)) - r() * 6 }); } for (let i = 0; i < 12; i++) out.push({ f: 5000 + i * 900, L: 30 + r() * 12 }); }
      else { const n = kind === 'dense' ? 64 : 80; for (let i = 0; i < n; i++) { const f = 40 * Math.pow(480, (i + r() * 0.8) / n); out.push({ f, L: kind === 'dense' ? 74 - 5 * Math.log2(Math.max(1, f / 200)) - r() * 26 : 62 - r() * 8 }); } }
      return out.filter((c) => c.f < 20000);
    }
    const BW = [[32, 5500], [48, 8000], [64, 11000], [96, 15000], [128, 16000], [160, 17500], [192, 19000], [256, 20000], [320, 20000]];
    const bwOf = (r) => { for (let i = 1; i < BW.length; i++) if (r <= BW[i][0]) { const [a, b] = [BW[i - 1], BW[i]]; return a[1] + (b[1] - a[1]) * (r - a[0]) / (b[0] - a[0]); } return 20000; };
    const maskAt = (list, f, skip) => { let p = Math.pow(10, quiet(f) / 10); const z = bark(f); for (const m of list) { if (m === skip) continue; const dz = z - m.z; const L = m.L - 12 - (dz < 0 ? 25 * -dz : 9 * dz); if (L > -20) p += Math.pow(10, L / 10); } return 10 * Math.log10(p); };
    let M = {};
    const play = player(host, [['orig', 'Original'], ['coded', 'Coded (rough approximation)']], (id) => {
      const x = music().subarray(0, SR * 2);
      if (id === 'orig') return scaled(x, 0.5);
      const K = Math.round(st.rate / 320 * 120) + 5, kmax = Math.floor(M.bw / SR * 1024), mag = new Float32Array(513), idx = new Uint16Array(513);
      const y = stft(x, 1024, (re, im) => {
        for (let k = 0; k <= 512; k++) { mag[k] = k <= kmax ? re[k] * re[k] + im[k] * im[k] : 0; idx[k] = k; }
        const order = Array.from(idx).sort((a, b) => mag[b] - mag[a]), keep = new Uint8Array(513);
        for (let i = 0; i < K; i++) keep[order[i]] = 1;
        for (let k = 0; k <= 512; k++) if (!keep[k]) { re[k] = 0; im[k] = 0; if (k > 0 && k < 512) { re[1024 - k] = 0; im[1024 - k] = 0; } }
      });
      return scaled(y, 0.5);
    });
    const stats = statRow(host);
    host.appendChild(A.legend([[C('accent'), 'Components kept'], [C('muted'), 'Masked — thrown away'], [C('bad'), 'Above the cut-off — removed'], [C('accent2'), 'Masking threshold'], [C('warn'), 'Coding noise', true]]));
    A.canvas(host, {
      height: 300,
      caption: 'Each stem is one frequency component of the sound at this instant. Anything under the masking threshold cannot be heard, so the coder spends no bits on it.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 40, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: -10, max: 90, label: 'Level (dB)' } });
        ctx.fillStyle = A.alpha(C('bad'), 0.1); ctx.fillRect(ax.X(M.bw), ax.y1, ax.x1 - ax.X(M.bw), ax.y0 - ax.y1);
        for (const c of M.list) { const x = ax.X(c.f); ctx.strokeStyle = c.state === 'keep' ? C('accent') : c.state === 'cut' ? C('bad') : C('muted'); ctx.lineWidth = c.state === 'keep' ? 2.2 : 1.2; ctx.setLineDash(c.state === 'keep' ? [] : [3, 3]); ctx.beginPath(); ctx.moveTo(x, ax.y0); ctx.lineTo(x, ax.Y(clamp(c.L, -10, 90))); ctx.stroke(); ctx.setLineDash([]); if (c.state === 'keep') { ctx.fillStyle = C('accent'); ctx.beginPath(); ctx.arc(x, ax.Y(c.L), 2.5, 0, TAU); ctx.fill(); } }
        A.plotLine(ctx, ax, M.curve, C('accent2'), 2.5);
        A.plotLine(ctx, ax, M.curve.map(([f, v]) => [f, f > M.bw ? NaN : v - 4 + M.off]), C('warn'), 2, [5, 4]);
        A.text(ctx, 'cut-off ' + fmtHz(M.bw), Math.min(ax.X(M.bw) + 4, ax.x1 - 86), ax.y1 + 14, { size: 10, color: C('bad') });
      },
    });
    const tip = tipBox(host);
    function update() {
      const list = comps(st.content); list.forEach((c) => (c.z = bark(c.f)));
      const bw = bwOf(st.rate), off = Math.max(0, 14 * Math.log2(NEED[st.content] / st.rate));
      list.forEach((c) => { c.state = c.f > bw ? 'cut' : c.L < maskAt(list, c.f, c) + off * 0.4 ? 'mask' : 'keep'; });
      const curve = []; for (let f = 40; f <= 20000; f *= 1.07) curve.push([f, Math.min(95, maskAt(list, f, null))]);
      const kept = list.filter((c) => c.state === 'keep').length;
      M = { list, bw, off, curve };
      const risk = off < 2 ? 0 : off < 8 ? 1 : 2;
      stats(A.statBox('Data kept', fmt(st.rate / 1411 * 100, 1) + ' %', 'about ' + fmt(1411 / st.rate, 1) + ' : 1 smaller than CD-quality PCM')
        + A.statBox('Components coded', kept + ' of ' + list.length, 'the rest are inaudible or dropped')
        + A.statBox('Audio bandwidth', fmtHz(bw), bw < 15000 ? 'dull top end' : 'full or nearly full')
        + A.statBox('Coding noise', ['Hidden', 'Marginal', 'Audible'][risk], off > 0 ? fmt(off, 0) + ' dB short of transparent' : 'under the masking threshold', ['good', 'warn', 'bad'][risk]));
      const art = { tonal: 'warbling “birdie” tones around sustained notes', dense: 'a watery, swirling top end and a narrower stereo image', transient: 'pre-echo — a smear of noise just <i>before</i> each sharp hit', speech: 'a metallic, underwater edge on consonants' }[st.content];
      const tips = [];
      if (risk === 2) tips.push('At this rate the coder runs out of bits. Expect ' + art + '.');
      else if (risk === 1) tips.push('Borderline: trained ears on good monitors may notice ' + art + '.');
      else tips.push('Enough bits for this material: the coding noise sits below what the music itself masks.');
      if (bw < 15000) tips.push('The coder has also lowered its cut-off to save bits — cymbals and “air” go first.');
      if (st.content === 'transient') tips.push('Sharp transients are the hardest case: there is nothing loud <i>before</i> the hit to hide the noise behind.');
      tips.push('Every further lossy generation throws away a different set of components. Always encode from the original uncompressed master, never from another lossy file.');
      tip(tips, risk === 2 ? 'warn' : 'mentor'); play.refresh();
    }
    update();
  };

  /* ======================================================================
     4. Archive planner
     ====================================================================== */
  V.archivePlanner = function (host) {
    const st = A.controls(host, [
      { key: 'hours', label: 'Recorded material', type: 'range', min: 0.5, max: 100, step: 0.5, value: 6, unit: 'h' },
      { key: 'ch', label: 'Tracks (channels)', type: 'range', min: 1, max: 64, step: 1, value: 24 },
      { key: 'sr', label: 'Sample rate', type: 'select', numeric: true, value: 48, options: [[44.1, '44.1 kHz'], [48, '48 kHz'], [88.2, '88.2 kHz'], [96, '96 kHz'], [192, '192 kHz']] },
      { key: 'bits', label: 'Word length', type: 'select', numeric: true, value: 24, options: [[16, '16-bit'], [24, '24-bit'], [32, '32-bit float']] },
      { key: 'pack', label: 'Lossless packing ratio', type: 'range', min: 0.4, max: 0.8, step: 0.05, value: 0.6, fmt: (v) => Math.round(v * 100) + ' %' },
    ], update);
    const stats = statRow(host);
    let M = {};
    const gb = (v) => (v >= 1000 ? fmt(v / 1000, 2) + ' TB' : v >= 10 ? fmt(v, 0) + ' GB' : fmt(v, 2) + ' GB');
    A.canvas(host, {
      height: 250, animate: true,
      caption: 'Bars compare the storage each choice needs. Below: the three-copies plan — two different kinds of storage on site, one copy somewhere else, each checked on a schedule.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t);
        const rows = [['Uncompressed PCM', M.raw, C('accent')], ['Lossless-packed', M.packed, C('accent2')], ['Three verified copies', M.packed * 3, C('c3')], ['Stereo listening copy (lossy)', M.lossy, C('muted')]];
        const mx = Math.max(...rows.map((r) => r[1])), x0 = 10, bwMax = w - 20;
        rows.forEach(([l, v, c], i) => { const y = 8 + i * 34; ctx.fillStyle = C('panel2'); ctx.fillRect(x0, y + 14, bwMax, 14); ctx.fillStyle = c; ctx.fillRect(x0, y + 14, Math.max(2, bwMax * v / mx), 14); A.text(ctx, l, x0, y + 10, { size: 11 }); A.text(ctx, gb(v), x0 + bwMax, y + 10, { size: 11, align: 'right', weight: 700 }); });
        const by = 160, bw = Math.min(110, (w - 40) / 3), gap = (w - 3 * bw) / 4, names = ['Working drive', 'Second medium', 'Off-site copy'], scan = Math.floor(t / 1.6) % 3;
        names.forEach((nm, i) => { const x = gap + i * (bw + gap); ctx.fillStyle = C('panel2'); ctx.strokeStyle = i === scan ? C('good') : C('line'); ctx.lineWidth = i === scan ? 2.5 : 1; ctx.beginPath(); ctx.rect(x, by, bw, 54); ctx.fill(); ctx.stroke(); A.text(ctx, nm, x + bw / 2, by + 20, { size: 11, align: 'center' }); A.text(ctx, i === scan ? 'checksum ✓' : gb(M.packed), x + bw / 2, by + 40, { size: 11, align: 'center', color: i === scan ? C('good') : C('muted'), weight: 700 }); if (i === scan) { const sx = x + ((t / 1.6) % 1) * bw; ctx.fillStyle = A.alpha(C('good'), 0.35); ctx.fillRect(sx - 3, by, 6, 54); } });
        A.text(ctx, '3 copies · 2 kinds of storage · 1 off site', w / 2, by + 76, { size: 11, align: 'center', color: C('muted') });
      },
    });
    const tip = tipBox(host);
    function update() {
      const rate = st.sr * 1000 * st.bits * st.ch, perHour = rate * 3600 / 8 / 1e9, raw = perHour * st.hours, packed = raw * st.pack;
      M = { raw, packed, lossy: 256000 * 3600 / 8 / 1e9 * st.hours };
      stats(A.statBox('Data rate', fmt(rate / 1e6, 1) + ' Mbit/s', st.ch + ' × ' + st.bits + '-bit × ' + st.sr + ' kHz')
        + A.statBox('Per hour', gb(perHour), 'uncompressed')
        + A.statBox('Project total', gb(raw), 'packed: ' + gb(packed))
        + A.statBox('To buy for 3 copies', gb(packed * 3 * 1.25), 'includes 25 % spare room'));
      const tips = ['Store a checksum file beside every folder and re-check it at least once a year — a drive can corrupt a file silently and still report “healthy”.'];
      if (st.sr >= 176) tips.push('192 kHz quadruples storage for content nobody can hear. Keep it for transfers of fragile originals; 48 or 96 kHz is ample for most work.');
      if (st.bits === 16) tips.push('16-bit is fine for a finished release, but record and archive at 24-bit so quiet takes and later processing keep their headroom.');
      if (st.bits === 32) tips.push('32-bit float sessions are convenient but a third larger than 24-bit. For the archive, consolidated 24-bit files are normally enough.');
      tips.push('Lossless packing gives back every bit exactly; it is safe for archives. Lossy files are listening copies only — never the master.');
      tips.push('Plan a migration: copy the whole archive to fresh media every five years or so, and keep a plain-text note of what each file is.');
      tip(tips);
    }
    update();
  };

  /* ======================================================================
     5. De-noise lab
     ====================================================================== */
  V.denoiseLab = function (host) {
    const st = A.controls(host, [
      { type: 'heading', label: 'Problems in the recording' },
      { key: 'hum', label: 'Mains hum', type: 'check', value: true },
      { key: 'hiss', label: 'Broadband hiss', type: 'check', value: true },
      { key: 'clicks', label: 'Clicks', type: 'check', value: true },
      { type: 'heading', label: 'Repair tools (applied in this order)' },
      { key: 'declick', label: '1 · De-click', type: 'check', value: false },
      { key: 'hp', label: '2 · High-pass at 70 Hz', type: 'check', value: false },
      { key: 'notch', label: '3 · Hum notch comb', type: 'check', value: false },
      { key: 'exp', label: '4 · Downward expander', type: 'check', value: false },
      { key: 'spec', label: '5 · Spectral noise reduction', type: 'range', min: 0, max: 100, step: 5, value: 0, unit: '%' },
    ], () => { clearTimeout(deb); deb = setTimeout(update, 90); });
    let deb = 0, R = null, humArr = null, clickArr = null, print = null, cleanSpec = null;
    function parts() {
      if (humArr) return;
      const n = SR * 4; humArr = new Float32Array(n); clickArr = new Float32Array(n);
      const hl = [[1, 0.03], [2, 0.014], [3, 0.012], [5, 0.007], [7, 0.004]];
      for (let i = 0; i < n; i++) { let s = 0; for (const [k, a] of hl) s += a * Math.sin(TAU * 50 * k * i / SR + k); humArr[i] = s; }
      const r = rng(21); for (let c = 0; c < 14; c++) { const p = Math.floor((0.1 + r() * 3.8) * SR), a = (0.25 + r() * 0.3) * (r() < 0.5 ? -1 : 1); clickArr[p] = a; clickArr[p + 1] = -a * 0.6; }
      const w = whiteArr(), N = 1024, re = new Float32Array(N), im = new Float32Array(N); print = new Float32Array(N / 2 + 1); let fr = 0;
      for (let p = 0; p + N < SR; p += N, fr++) { for (let i = 0; i < N; i++) { re[i] = w[p + i] * 0.006 * (0.5 - 0.5 * Math.cos(TAU * i / N)); im[i] = 0; } fft(re, im); for (let k = 0; k <= N / 2; k++) print[k] += Math.hypot(re[k], im[k]); }
      for (let k = 0; k <= N / 2; k++) print[k] /= fr;
      cleanSpec = bandSpec(music(), 0, Math.round(3.5 * SR));
    }
    function chain(x) {
      let y = x;
      if (st.declick) y = declick(y, 0.12, 3).y;
      if (st.hp) { const c = bq('highpass', 70, 0.707); y = bqRun(c, bqRun(c, y)); }
      if (st.notch) for (let k = 1; k <= 8; k++) y = bqRun(bq('notch', 50 * k, 30), y);
      if (st.exp) y = expand(y, { thr: -36, ratio: 2, att: 2, rel: 160, range: -16 }).y;
      if (st.spec > 0) { const a = st.spec / 100, over = 1 + a * 3.5, floor = 1 - a * 0.92; y = stft(y, 1024, (re, im) => { for (let k = 0; k <= 512; k++) { const m = Math.hypot(re[k], im[k]) + 1e-12, g = Math.max(floor, 1 - over * print[k] / m); re[k] *= g; im[k] *= g; if (k > 0 && k < 512) { re[1024 - k] *= g; im[1024 - k] *= g; } } }); }
      return y;
    }
    const play = player(host, [['noisy', 'Before'], ['fixed', 'After repair'], ['clean', 'The clean original']], (id) => { if (!R) update(); return scaled(id === 'noisy' ? R.noisy : id === 'fixed' ? R.out : music(), 0.5); });
    const stats = statRow(host);
    host.appendChild(A.legend([[C('muted'), 'Before'], [C('accent'), 'After repair'], [C('good'), 'Clean original', true]]));
    A.canvas(host, {
      height: 280,
      caption: 'Average spectrum of the recording. The closer the “after” line sits to the clean original — without dropping below it — the better the repair.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 31.5, max: 16000, log: true, label: 'Frequency (Hz)' }, y: { min: -100, max: -10, label: 'Level (dB)' } });
        if (!R) return;
        A.plotFill(ctx, ax, R.sNoisy, A.alpha(C('muted'), 0.25)); A.plotLine(ctx, ax, R.sNoisy, C('muted'), 1.5);
        A.plotLine(ctx, ax, R.sOut, C('accent'), 2.5); A.plotLine(ctx, ax, cleanSpec, C('good'), 1.8, [5, 4]);
      },
    });
    const tip = tipBox(host);
    function update() {
      parts();
      const m = music(), n = m.length, w = whiteArr(), noisy = new Float32Array(n);
      for (let i = 0; i < n; i++) noisy[i] = m[i] + (st.hum ? humArr[i] : 0) + (st.hiss ? w[i] * 0.006 : 0) + (st.clicks ? clickArr[i] : 0);
      const out = chain(noisy), dmg = chain(m), g0 = Math.round(3.68 * SR), g1 = Math.round(3.98 * SR), e = Math.round(3.5 * SR);
      const sD = bandSpec(dmg, 0, e); let ch = 0, cn = 0; cleanSpec.forEach(([f, v], i) => { if (f > 90 && f < 12000) { ch += Math.abs(sD[i][1] - v); cn++; } }); ch /= cn;
      const nb = dB(rms(noisy, g0, g1)), na = dB(rms(out, g0, g1));
      R = { noisy, out, sNoisy: bandSpec(noisy, 0, e), sOut: bandSpec(out, 0, e) };
      const lvl = ch < 1.2 ? 0 : ch < 3 ? 1 : 2;
      stats(A.statBox('Noise in the pauses', fmt(nb, 0) + ' dB', 'before repair')
        + A.statBox('After repair', fmt(na, 0) + ' dB', fmt(Math.max(0, nb - na), 0) + ' dB quieter', nb - na > 6 ? 'good' : '')
        + A.statBox('Change to the music', fmt(ch, 1) + ' dB', 'average shift across the spectrum', ['good', 'warn', 'bad'][lvl])
        + A.statBox('Artefact risk', ['Low', 'Noticeable', 'Over-processed'][lvl], lvl === 2 ? 'back off' : lvl === 1 ? 'listen closely' : 'transparent', ['good', 'warn', 'bad'][lvl]));
      const tips = [];
      if (st.notch && !st.hum) tips.push('The notch comb is cutting into the music but there is no hum to remove. Never leave a repair tool on “just in case”.');
      if (st.hum && !st.notch) tips.push('Hum sits at 50 Hz and its multiples. A 70 Hz high-pass only dents the fundamental — the comb of narrow notches is the right tool.');
      if (st.clicks && !st.declick && (st.spec > 0 || st.exp)) tips.push('Remove clicks first. Left in, they confuse every later stage and smear into little bursts.');
      if (st.spec > 60) tips.push('Heavy spectral reduction eats the quiet tails of notes and leaves chirpy “musical noise”. Aim for 6–12 dB of reduction, not silence.');
      if (st.exp && !st.hiss && !st.hum) tips.push('The expander is turning down note tails that had nothing wrong with them.');
      if (st.hiss && st.spec === 0 && !st.exp) tips.push('Hiss is spread across all frequencies, so filters cannot remove it without dulling the sound. Use gentle spectral reduction or an expander.');
      if (!tips.length) tips.push(lvl === 0 ? 'A clean repair: the right tool for each fault, in the right order, and no more than needed.' : 'Compare with the clean original — if the instruments sound duller or shorter, ease off.');
      tip(tips, lvl === 2 ? 'warn' : 'mentor'); play.refresh();
    }
    update();
  };

  /* ======================================================================
     6. Hum notch comb
     ====================================================================== */
  V.humNotch = function (host) {
    const st = A.controls(host, [
      { key: 'mains', label: 'Mains frequency', type: 'select', numeric: true, value: 50, options: [[50, '50 Hz'], [60, '60 Hz']] },
      { key: 'kind', label: 'What you hear', type: 'select', value: 'buzz', options: [['hum', 'Smooth hum (few harmonics)'], ['buzz', 'Edgy buzz (many harmonics)']] },
      { key: 'harm', label: 'Notches (harmonics covered)', type: 'range', min: 1, max: 12, step: 1, value: 3 },
      { key: 'q', label: 'Notch sharpness (Q)', type: 'range', min: 3, max: 100, step: 1, value: 30 },
    ], update);
    const humL = (k) => (st.kind === 'hum' ? [-22, -30, -34][k - 1] ?? -34 - 7 * (k - 3) : k % 2 ? -24 - 1.6 * k : -38 - 1.2 * k);
    let M = {}, spec = null;
    const hum = (n) => { const x = new Float32Array(n); for (let k = 1; k <= 12; k++) { const a = lin(humL(k)) * 0.9; for (let i = 0; i < n; i++) x[i] += a * Math.sin(TAU * st.mains * k * i / SR + k * 0.7); } return x; };
    const play = player(host, [['hum', 'Music with hum'], ['fix', 'After the notch comb']], (id) => {
      const m = music(), n = m.length, hm = hum(n); let y = new Float32Array(n);
      for (let i = 0; i < n; i++) y[i] = m[i] + hm[i] * 0.5;
      if (id === 'fix') for (let k = 1; k <= st.harm; k++) y = bqRun(bq('notch', st.mains * k, st.q), y);
      return scaled(y, 0.5);
    });
    const stats = statRow(host);
    host.appendChild(A.legend([[A.alpha(C('accent2'), 0.5), 'Music'], [C('bad'), 'Hum component left'], [C('muted'), 'Hum component removed', true], [C('accent'), 'Filter response']]));
    A.canvas(host, {
      height: 280,
      caption: 'Each spike is one multiple of the mains frequency. A notch placed on it removes the spike — and a slice of whatever music shares that frequency.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 30, max: 2000, log: true, label: 'Frequency (Hz)' }, y: { min: -80, max: 6, label: 'dB' } });
        A.plotFill(ctx, ax, spec.map(([f, v]) => [f, v + 22]).filter((p) => p[0] <= 2000), A.alpha(C('accent2'), 0.35));
        for (let k = 1; k <= 12; k++) { const f = st.mains * k; if (f > 2000) break; const on = k <= st.harm, x = ax.X(f); ctx.strokeStyle = C('muted'); ctx.setLineDash([3, 3]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, ax.y0); ctx.lineTo(x, ax.Y(humL(k))); ctx.stroke(); ctx.setLineDash([]); if (!on) { ctx.strokeStyle = C('bad'); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, ax.y0); ctx.lineTo(x, ax.Y(humL(k))); ctx.stroke(); } }
        A.plotLine(ctx, ax, M.resp, C('accent'), 2);
      },
    });
    const tip = tipBox(host);
    function update() {
      if (!spec) spec = bandSpec(music(), 0, Math.round(3.5 * SR));
      const cs = []; for (let k = 1; k <= st.harm; k++) cs.push(bq('notch', st.mains * k, st.q));
      const H = (f) => cs.reduce((p, c) => p * bqMag(c, f), 1);
      const resp = []; for (let f = 30; f <= 2000; f *= 1.004) resp.push([f, clamp(dB(H(f)), -80, 6)]);
      let before = 0, after = 0; for (let k = 1; k <= 12; k++) { const p = Math.pow(10, humL(k) / 10); before += p; after += k <= st.harm ? 0 : p; }
      let notes = 0; for (let m = 21; m <= 96; m++) { const f = 440 * Math.pow(2, (m - 69) / 12); if (H(f) < 0.707) notes++; }
      let tot = 0, lost = 0; for (const [f, v] of spec) { const p = Math.pow(10, v / 10); for (let j = 0; j < 60; j++) { const ff = f * Math.pow(2, (j - 29.5) / 360); tot += p; lost += p * (1 - H(ff) ** 2); } }
      M = { resp };
      const red = after > 0 ? 10 * Math.log10(before / after) : 60;
      stats(A.statBox('Hum reduced by', (after > 0 ? fmt(red, 0) : '>40') + ' dB', after > 0 ? 'upper harmonics remain' : 'every listed harmonic covered', red > 15 ? 'good' : 'warn')
        + A.statBox('Width of each notch', fmt(st.mains / st.q, 1) + ' Hz', 'at ' + st.mains + ' Hz; wider higher up')
        + A.statBox('Musical notes dented', String(notes), 'semitones cut by 3 dB or more', notes > 6 ? 'bad' : notes > 2 ? 'warn' : 'good')
        + A.statBox('Music energy lost', fmt(lost / tot * 100, 1) + ' %', 'in this example passage'));
      const tips = [];
      if (st.kind === 'buzz' && st.harm < 7) tips.push('A buzz is rich in upper harmonics. With only ' + st.harm + ' notch' + (st.harm > 1 ? 'es' : '') + ' the dull hum goes but the edgy rasp stays.');
      if (st.q < 12) tips.push('Wide notches take out neighbouring notes — the bass line will have holes in it. Raise the sharpness.');
      if (st.q > 70) tips.push('Very sharp notches barely touch the music, but mains frequency drifts slightly. If the hum wanders off-centre it slips past; a tracking filter follows it.');
      if (st.mains === 60) tips.push('60 Hz lies between B♭ and B; its harmonics land close to many notes of common keys, so keep the notches narrow.');
      tips.push('Use only as many notches as there are audible harmonics, and fix the grounding fault at source next time — see the hum course.');
      tip(tips); play.refresh();
    }
    update();
  };

  /* ======================================================================
     7. De-click demo
     ====================================================================== */
  V.declickDemo = function (host) {
    const N = 1600;
    const st = A.controls(host, [
      { key: 'thr', label: 'Detection threshold', type: 'range', min: 0.02, max: 1, step: 0.01, value: 0.3 },
      { key: 'size', label: 'Click size', type: 'range', min: 0.1, max: 1, step: 0.05, value: 0.6 },
      { key: 'count', label: 'How many clicks', type: 'select', numeric: true, value: 8, options: [[4, 'A few'], [8, 'Several'], [16, 'Crackle']] },
      { key: 'win', label: 'Repair width', type: 'range', min: 1, max: 10, step: 1, value: 3, unit: 'samples' },
    ], update);
    const stats = statRow(host);
    let M = null;
    const clean = new Float32Array(N); for (let i = 0; i < N; i++) { const u = i / N; clean[i] = 0.42 * Math.sin(TAU * 3.1 * u) + 0.2 * Math.sin(TAU * 7.3 * u + 1) + 0.1 * Math.sin(TAU * 19 * u); if (i >= 1000) { const k = i - 1000; clean[i] += 0.36 * Math.exp(-k / 30) * Math.sin(0.5 * k + 0.5); } }
    A.canvas(host, {
      height: 400,
      caption: 'Top: the damaged waveform; shaded strips are what the detector flagged. Middle: the flagged samples redrawn from their neighbours. Bottom: what was taken out. The burst two-thirds along is a real drum hit, not a fault.',
      draw(ctx, w, h) {
        if (!M) return;
        const rows = [['Damaged', M.x], ['Repaired', M.y], ['Removed', M.res]], rh = (h - 12) / 3, X = (i) => 8 + i / (N - 1) * (w - 16);
        rows.forEach(([name, arr], r) => {
          const y0 = 6 + r * rh, cy = y0 + rh / 2, sc = rh * 0.42;
          ctx.fillStyle = C('panel2'); ctx.fillRect(8, y0 + 2, w - 16, rh - 4);
          if (r === 0) { for (const [a, b] of M.regions) { ctx.fillStyle = A.alpha(M.hitRegion.has(a) ? C('good') : C('bad'), 0.3); ctx.fillRect(X(a) - 1.5, y0 + 2, Math.max(3, X(b) - X(a) + 3), rh - 4); } for (const c of M.clicks) { ctx.fillStyle = c.found ? C('good') : C('bad'); ctx.beginPath(); ctx.moveTo(X(c.p), y0 + 4); ctx.lineTo(X(c.p) - 4, y0 + 12); ctx.lineTo(X(c.p) + 4, y0 + 12); ctx.fill(); } }
          if (r === 1) { ctx.strokeStyle = A.alpha(C('muted'), 0.9); ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); for (let i = 0; i < N; i++) { const px = X(i), py = cy - clean[i] * sc; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.setLineDash([]); }
          ctx.strokeStyle = r === 0 ? C('text') : r === 1 ? C('accent') : C('warn'); ctx.lineWidth = 1.4; ctx.beginPath();
          for (let i = 0; i < N; i++) { const px = X(i), py = cy - clamp(arr[i], -1.15, 1.15) * sc; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
          A.text(ctx, name, 14, y0 + rh - 8, { size: 11, weight: 700, bg: C('panel') });
        });
        A.text(ctx, 'drum hit', X(1040), 6 + rh - 8, { size: 10, color: C('muted'), bg: C('panel') });
      },
    });
    const tip = tipBox(host);
    function update() {
      const r = rng(5 + st.count), x = Float32Array.from(clean), clicks = [];
      for (let c = 0; c < st.count; c++) { let p; do { p = 30 + Math.floor(r() * (N - 60)); } while ((p > 980 && p < 1130) || clicks.some((q) => Math.abs(q.p - p) < 25)); const a = st.size * (0.4 + 0.6 * r()) * (r() < 0.5 ? -1 : 1); x[p] += a; if (r() < 0.5) x[p + 1] -= a * 0.5; clicks.push({ p, a }); }
      const { y, regions } = declick(x, st.thr, st.win), hitRegion = new Set();
      clicks.forEach((c) => { const rg = regions.find(([a, b]) => c.p >= a - 1 && c.p <= b + 1); c.found = !!rg; if (rg) hitRegion.add(rg[0]); });
      const res = new Float32Array(N); for (let i = 0; i < N; i++) res[i] = x[i] - y[i];
      const found = clicks.filter((c) => c.found).length, falseR = regions.filter(([a]) => !hitRegion.has(a)).length;
      let err = 0; for (let i = 0; i < N; i++) err += (y[i] - clean[i]) ** 2; const errDb = dB(Math.sqrt(err / N) / rms(clean));
      M = { x, y, res, regions, clicks, hitRegion };
      stats(A.statBox('Clicks found', found + ' of ' + clicks.length, found === clicks.length ? 'all caught' : (clicks.length - found) + ' missed', found === clicks.length ? 'good' : 'warn')
        + A.statBox('False alarms', String(falseR), falseR ? 'real music was “repaired”' : 'none', falseR ? 'bad' : 'good')
        + A.statBox('Remaining error', fmt(errDb, 0) + ' dB', 'repaired vs. the clean original', errDb < -30 ? 'good' : errDb < -20 ? 'warn' : 'bad'));
      const tips = [];
      if (falseR) tips.push('The threshold is so low that the drum hit looks like a click. “Repairing” it rounds off the attack — the classic dull, lifeless over-de-clicked sound.');
      if (found < clicks.length) tips.push('Small clicks are slipping under the threshold. Lower it a little — but watch the drum hit.');
      if (st.size < 0.3 && (falseR || found < clicks.length)) tips.push('Tiny clicks and real transients look alike to a simple detector. This is where manual, click-by-click repair earns its keep.');
      if (st.win >= 7) tips.push('A wide repair window replaces more samples than the click damaged, so the guess gets less accurate. Use the narrowest width that covers the click.');
      if (!falseR && found === clicks.length) tips.push('Every click caught, nothing else touched. Listen to the “removed” signal on its own: if you can hear music in it, you are taking too much.');
      tip(tips, falseR ? 'warn' : 'mentor');
    }
    update();
  };

  /* ======================================================================
     8. Expander / gate
     ====================================================================== */
  V.expanderGate = function (host) {
    const st = A.controls(host, [
      { key: 'thr', label: 'Threshold', type: 'range', min: -60, max: -10, step: 1, value: -40, unit: 'dB' },
      { key: 'ratio', label: 'Ratio', type: 'range', min: 1.5, max: 20, step: 0.5, value: 3, fmt: (v) => (v >= 10 ? 'gate (' + v + ':1)' : '1:' + v) },
      { key: 'att', label: 'Attack', type: 'range', min: 0.1, max: 50, step: 0.1, value: 2, unit: 'ms' },
      { key: 'rel', label: 'Release', type: 'range', min: 10, max: 1000, step: 10, value: 200, unit: 'ms' },
      { key: 'range', label: 'Range (maximum cut)', type: 'range', min: -80, max: -6, step: 2, value: -40, unit: 'dB' },
      { key: 'noise', label: 'Noise floor of the recording', type: 'range', min: -60, max: -30, step: 1, value: -46, unit: 'dB' },
    ], update);
    const SYL = [[0.15, 0.28, -12], [0.5, 0.22, -16], [0.8, 0.34, -10], [1.5, 0.25, -14], [1.82, 0.55, -17], [2.55, 0.2, -31]];
    let M = null, tone = null;
    function phrase() {
      const n = SR * 3;
      if (!tone) { tone = new Float32Array(n); for (const [t0, d, L] of SYL) { const i0 = Math.round(t0 * SR), a = lin(L); for (let i = 0; i < (d + 0.25) * SR && i0 + i < n; i++) { const tt = i / SR, e = Math.min(1, tt / 0.012) * (tt < d ? 1 : Math.exp(-(tt - d) / (d > 0.5 ? 0.09 : 0.03))); let s = 0; for (let k = 1; k <= 8; k++) s += Math.sin(TAU * 140 * k * tt) * (k === 4 || k === 5 ? 0.9 : 0.4) / Math.sqrt(k); tone[i0 + i] += s * e * a * 0.42; } } }
      const w = whiteArr(), x = new Float32Array(n), nz = lin(st.noise);
      for (let i = 0; i < n; i++) x[i] = tone[i] + w[i] * nz * (1 + 0.45 * Math.sin(i / SR * 9) * Math.sin(i / SR * 2.3));
      return x;
    }
    const play = player(host, [['in', 'Before'], ['out', 'After the expander']], (id) => (M ? scaled(id === 'in' ? M.x : M.y, 0.8) : null));
    const stats = statRow(host);
    host.appendChild(A.legend([[A.alpha(C('muted'), 0.6), 'Input level'], [C('accent'), 'Output level'], [C('warn'), 'Threshold', true], [C('c3'), 'Gain reduction']]));
    A.canvas(host, {
      height: 340,
      caption: 'A spoken phrase over steady noise. Above the threshold the signal passes untouched; below it the expander turns the level down by the amount shown in the lower strip.',
      draw(ctx, w) {
        if (!M) return;
        sub(ctx, 0, 0, () => {
          const ax = A.axes(ctx, w, 220, { x: { min: 0, max: 3, fmt: (v) => v + ' s' }, y: { min: -80, max: 0, label: 'Level (dB)' } });
          A.plotFill(ctx, ax, M.env, A.alpha(C('muted'), 0.4), -80); A.plotLine(ctx, ax, M.envOut, C('accent'), 2);
          A.plotLine(ctx, ax, [[0, st.thr], [3, st.thr]], C('warn'), 1.8, [6, 4]);
        });
        sub(ctx, 0, 222, () => {
          const ax = A.axes(ctx, w, 116, { x: { min: 0, max: 3, label: 'Time', fmt: (v) => v + ' s' }, y: { min: -80, max: 0, ticks: [-80, -40, 0], label: 'Gain (dB)' } });
          A.plotLine(ctx, ax, M.gain, C('c3'), 2);
        });
      },
    });
    const tip = tipBox(host);
    function update() {
      const x = phrase(), r = expand(x, st), env = [], envOut = [], gain = [], step = 256;
      for (let i = 0; i < x.length; i += step) { const tt = i / SR; env.push([tt, Math.max(-80, r.lv[i])]); envOut.push([tt, Math.max(-80, r.lv[i] + r.g[i])]); gain.push([tt, r.g[i]]); }
      let opens = 0, open = false; for (let i = 0; i < x.length; i += 16) { const o = open ? r.lv[i] > st.thr - 3 : r.lv[i] >= st.thr; if (o && !open) opens++; open = o; }
      let clipped = 0; for (const [t0] of SYL.slice(0, 5)) { const i0 = Math.round(t0 * SR); let s = 0; const a0 = Math.round(0.006 * SR), n0 = Math.round(0.016 * SR); for (let i = 0; i < n0; i++) s += r.g[i0 + a0 + i]; if (s / n0 < -6) clipped++; }
      const lastOpen = r.g[Math.round((2.55 + 0.1) * SR)] > -6, tailCut = r.g[Math.round((1.82 + 0.55 + 0.1) * SR)] < -12;
      const g0 = Math.round(1.32 * SR), g1 = Math.round(1.48 * SR), nRed = dB(rms(x, g0, g1)) - dB(rms(r.y, g0, g1));
      M = { x, y: r.y, env, envOut, gain };
      const chatter = opens > 10;
      stats(A.statBox('Noise in the pauses', '−' + fmt(Math.max(0, nRed), 0) + ' dB', nRed > 10 ? 'clearly quieter' : 'little change', nRed > 10 ? 'good' : 'warn')
        + A.statBox('Times it opened', String(opens), chatter ? 'chattering' : 'the phrase has 6 words', chatter ? 'bad' : 'good')
        + A.statBox('Word starts clipped', clipped + ' of 5', clipped ? 'attack too slow' : 'onsets intact', clipped ? 'bad' : 'good')
        + A.statBox('Quiet last word', lastOpen ? 'Kept' : 'Lost', lastOpen ? '' : 'it is below the threshold', lastOpen ? 'good' : 'warn'));
      const tips = [];
      if (chatter) tips.push('The threshold sits inside the noise, so the gate flickers open and shut. Raise the threshold a few dB above the noise or lengthen the release.');
      if (clipped) tips.push(st.att > 3 ? 'A slow attack shaves the first consonant off each word. Use 1 ms or less for speech and drums.' : 'The threshold is so high that the soft start of each word sits below it and is turned down. Lower the threshold.');
      if (!lastOpen) tips.push('The quiet final word never crosses the threshold. A gentler ratio and smaller range would turn it down a little instead of removing it.');
      if (tailCut && st.rel < 80) tips.push('A short release chops the natural decay of the long word. Let the release follow the way the sound dies away.');
      if (st.ratio >= 10 && st.range < -50) tips.push('A hard gate to silence makes the noise pump in and out with every word, which draws attention to it. 10–15 dB of range usually sounds more natural.');
      if (nRed < 4 && !chatter) tips.push('The threshold is below the noise floor, so nothing is being turned down.');
      if (!tips.length) tips.push('A good setting: the noise drops between words, every word start is intact and the tails die away naturally.');
      tip(tips, chatter || clipped ? 'warn' : 'mentor'); play.refresh();
    }
    update();
  };

  /* ---------------- real-time audio session helper ---------------- */
  function session() {
    let nodes = [], timers = [], on = false;
    const s = {
      get on() { return on; },
      begin() { s.stop(); on = true; return A.audio.get(); },
      add(n) { nodes.push(n); if (typeof n.stop === 'function') trk(n); return n; },
      timer(id) { timers.push(id); return id; },
      stop() { on = false; timers.forEach((id) => { clearInterval(id); clearTimeout(id); }); timers = []; nodes.forEach((n) => { try { n.stop && n.stop(); } catch (e) { /* */ } try { n.disconnect(); } catch (e) { /* */ } }); nodes = []; },
    };
    A.onLeave(() => s.stop());
    return s;
  }
  /** master output: gain → limiter → destination */
  function masterOut(ctx, S, level) {
    const g = S.add(ctx.createGain()), c = S.add(ctx.createDynamicsCompressor());
    g.gain.value = level; c.threshold.value = -14; c.ratio.value = 12; c.attack.value = 0.003; c.release.value = 0.15;
    g.connect(c); c.connect(ctx.destination);
    return g;
  }
  const toggleBtn = (labelOn, start, stop) => { const b = el('button', { class: 'primary', html: A.icon('play') + ' ' + labelOn }); let on = false; const setOn = (v) => { on = v; b.innerHTML = on ? A.icon('stop') + ' Stop' : A.icon('play') + ' ' + labelOn; }; b.addEventListener('click', () => { if (on) { stop(); setOn(false); } else if (start() !== false) setOn(true); }); b.reset = () => setOn(false); return b; };
  const wavePt = (type, ph) => { const p = ((ph % 1) + 1) % 1; return type === 'sine' ? Math.sin(TAU * p) : type === 'square' ? (p < 0.5 ? 1 : -1) : type === 'triangle' ? 1 - 4 * Math.abs(p - 0.5) : 2 * p - 1; };

  /* ======================================================================
     9. Mini synth — playable subtractive synthesiser
     ====================================================================== */
  V.miniSynth = function (host) {
    const PRE = {
      Bass: { wave: 'sawtooth', uni: 1, detune: 0, cutoff: 500, res: 6, a: 5, d: 180, s: 0.5, r: 120, lfoRate: 5, lfoDepth: 0, lfoTo: 'off', oct: -1 },
      Pad: { wave: 'sawtooth', uni: 3, detune: 18, cutoff: 1400, res: 1, a: 600, d: 800, s: 0.8, r: 1200, lfoRate: 0.4, lfoDepth: 0.35, lfoTo: 'cutoff', oct: 0 },
      Lead: { wave: 'square', uni: 2, detune: 8, cutoff: 3200, res: 3, a: 10, d: 200, s: 0.7, r: 200, lfoRate: 5.5, lfoDepth: 0.15, lfoTo: 'pitch', oct: 0 },
      Pluck: { wave: 'sawtooth', uni: 1, detune: 0, cutoff: 2400, res: 2, a: 2, d: 220, s: 0, r: 220, lfoRate: 5, lfoDepth: 0, lfoTo: 'off', oct: 0 },
      'Brass-like': { wave: 'sawtooth', uni: 2, detune: 6, cutoff: 1800, res: 1.5, a: 70, d: 250, s: 0.75, r: 180, lfoRate: 5, lfoDepth: 0.08, lfoTo: 'pitch', oct: 0 },
    };
    const pre = el('div', { class: 'row', style: { flexWrap: 'wrap', marginBottom: '8px' } }); host.appendChild(pre);
    const st = A.controls(host, [
      { type: 'heading', label: 'Oscillator' },
      { key: 'wave', label: 'Waveform', type: 'select', value: 'sawtooth', options: [['sine', 'Sine'], ['triangle', 'Triangle'], ['sawtooth', 'Sawtooth'], ['square', 'Square']] },
      { key: 'uni', label: 'Unison voices', type: 'range', min: 1, max: 3, step: 1, value: 1 },
      { key: 'detune', label: 'Detune', type: 'range', min: 0, max: 40, step: 1, value: 0, unit: 'cents' },
      { key: 'oct', label: 'Octave', type: 'range', min: -2, max: 2, step: 1, value: 0 },
      { type: 'heading', label: 'Filter (low-pass)' },
      { key: 'cutoff', label: 'Cut-off', type: 'range', min: 100, max: 8000, step: 10, value: 2400, unit: 'Hz' },
      { key: 'res', label: 'Resonance', type: 'range', min: 0.5, max: 14, step: 0.5, value: 2 },
      { type: 'heading', label: 'Envelope' },
      { key: 'a', label: 'Attack', type: 'range', min: 1, max: 1500, step: 1, value: 2, unit: 'ms' },
      { key: 'd', label: 'Decay', type: 'range', min: 10, max: 1500, step: 10, value: 220, unit: 'ms' },
      { key: 's', label: 'Sustain', type: 'range', min: 0, max: 1, step: 0.05, value: 0.6 },
      { key: 'r', label: 'Release', type: 'range', min: 10, max: 2500, step: 10, value: 220, unit: 'ms' },
      { type: 'heading', label: 'Slow modulation (LFO)' },
      { key: 'lfoTo', label: 'Sends to', type: 'select', value: 'off', options: [['off', 'Off'], ['pitch', 'Pitch (vibrato)'], ['cutoff', 'Filter cut-off (wobble)']] },
      { key: 'lfoRate', label: 'Rate', type: 'range', min: 0.1, max: 12, step: 0.1, value: 5, unit: 'Hz' },
      { key: 'lfoDepth', label: 'Depth', type: 'range', min: 0, max: 1, step: 0.01, value: 0 },
    ], update);
    Object.keys(PRE).forEach((nm) => { const b = el('button', {}, nm); b.addEventListener('click', () => { Object.entries(PRE[nm]).forEach(([k, v]) => st.set(k, v, true)); update(); }); pre.appendChild(b); });
    const S = session(); let master = null, an = null, lfo = null, lfoG = null, ctx = null; const voices = {}; let order = [];
    function ensure() {
      ctx = A.audio.get(); if (!ctx) return false;
      if (S.on && master) return true;
      S.begin(); master = masterOut(ctx, S, 0.22); an = S.add(ctx.createAnalyser()); an.fftSize = 2048; master.connect(an);
      lfo = S.add(ctx.createOscillator()); lfoG = S.add(ctx.createGain()); lfo.connect(lfoG); lfo.start(); setLfo(); return true;
    }
    function setLfo() { if (!lfo) return; lfo.frequency.value = st.lfoRate; lfoG.gain.value = st.lfoTo === 'pitch' ? st.lfoDepth * 100 : st.lfoTo === 'cutoff' ? st.lfoDepth * 2400 : 0; }
    function kill(v, now) { v.oscs.forEach((o) => { try { o.stop(now); } catch (e) { /* */ } }); setTimeout(() => { try { v.vg.disconnect(); v.flt.disconnect(); } catch (e) { /* */ } }, 80); }
    function noteOn(m) {
      if (!ensure()) return; if (voices[m]) { kill(voices[m]); delete voices[m]; }
      if (order.length >= 8) noteOff(order[0]);
      const t = ctx.currentTime, f = 440 * Math.pow(2, (m - 69) / 12 + st.oct), vg = ctx.createGain(), flt = ctx.createBiquadFilter(), oscs = [], pk = 0.4 / Math.sqrt(st.uni);
      flt.type = 'lowpass'; flt.frequency.value = st.cutoff; flt.Q.value = st.res; vg.gain.value = 0;
      for (let i = 0; i < st.uni; i++) { const o = ctx.createOscillator(); o.type = st.wave; o.frequency.value = f; o.detune.value = st.uni === 1 ? 0 : (i - (st.uni - 1) / 2) * st.detune; o.connect(flt); if (st.lfoTo === 'pitch') lfoG.connect(o.detune); o.start(t); trk(o); oscs.push(o); }
      if (st.lfoTo === 'cutoff') lfoG.connect(flt.detune);
      flt.connect(vg); vg.connect(master);
      vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(pk, t + st.a / 1000); vg.gain.setTargetAtTime(pk * st.s, t + st.a / 1000, Math.max(0.005, st.d / 3000));
      voices[m] = { oscs, flt, vg }; order.push(m); paintKeys();
    }
    function noteOff(m) {
      const v = voices[m]; if (!v) return; delete voices[m]; order = order.filter((x) => x !== m);
      const t = ctx.currentTime, rel = st.r / 1000;
      try { v.vg.gain.cancelScheduledValues(t); v.vg.gain.setValueAtTime(Math.max(0.0001, v.vg.gain.value), t); v.vg.gain.setTargetAtTime(0, t, Math.max(0.005, rel / 4)); } catch (e) { /* */ }
      v.oscs.forEach((o) => { try { o.stop(t + rel * 1.5 + 0.1); } catch (e) { /* */ } });
      setTimeout(() => { try { v.vg.disconnect(); v.flt.disconnect(); } catch (e) { /* */ } }, (rel * 1.5 + 0.3) * 1000);
      paintKeys();
    }
    const allOff = () => { Object.keys(voices).forEach((m) => noteOff(+m)); };
    // keyboard
    const BASE = 48, KEYS = 'awsedftgyhujkolp;', keyEl = {};
    const kb = el('div', { style: { position: 'relative', height: '110px', margin: '10px 0', userSelect: 'none', touchAction: 'none', display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)' } }); host.appendChild(kb);
    const whites = []; for (let m = BASE; m <= BASE + 17; m++) if (![1, 3, 6, 8, 10].includes(m % 12)) whites.push(m);
    function bind(k, m) { const dn = (e) => { e.preventDefault(); noteOn(m); }, up = () => noteOff(m); k.addEventListener('pointerdown', dn); k.addEventListener('pointerup', up); k.addEventListener('pointerleave', up); k.addEventListener('pointercancel', up); keyEl[m] = k; }
    whites.forEach((m) => { const k = el('div', { 'data-note': m, style: { flex: '1', background: '#f4f1ea', borderRight: '1px solid #9a968c', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', color: '#55524a', fontSize: '10px', paddingBottom: '4px', cursor: 'pointer' } }, (KEYS[m - BASE] || '').toUpperCase()); bind(k, m); kb.appendChild(k); });
    for (let m = BASE; m <= BASE + 17; m++) if ([1, 3, 6, 8, 10].includes(m % 12)) { const wi = whites.filter((x) => x < m).length; const k = el('div', { 'data-note': m, style: { position: 'absolute', top: '0', left: `calc(${(wi / whites.length) * 100}% - ${100 / whites.length * 0.3}%)`, width: `${100 / whites.length * 0.6}%`, height: '62%', background: '#22201c', borderRadius: '0 0 4px 4px', cursor: 'pointer', zIndex: '2' } }); bind(k, m); kb.appendChild(k); }
    function paintKeys() { for (const m in keyEl) { const on = !!voices[m], black = [1, 3, 6, 8, 10].includes(m % 12); keyEl[m].style.background = on ? 'var(--accent)' : black ? '#22201c' : '#f4f1ea'; } }
    const held = new Set();
    const kd = (e) => { if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || /INPUT|SELECT|TEXTAREA/.test((e.target && e.target.tagName) || '')) return; const i = KEYS.indexOf(e.key.toLowerCase()); if (i < 0 || !document.contains(kb)) return; held.add(i); noteOn(BASE + i); };
    const ku = (e) => { const i = KEYS.indexOf(e.key.toLowerCase()); if (i < 0 || !held.has(i)) return; held.delete(i); noteOff(BASE + i); };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    A.onLeave(() => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); allOff(); });
    const bar = el('div', { class: 'row', style: { flexWrap: 'wrap' } }); host.appendChild(bar);
    const demo = el('button', { class: 'primary', html: A.icon('play') + ' Play a short phrase' });
    demo.addEventListener('click', () => { if (!ensure()) return; [0, 4, 7, 12, 7, 4, 0, -5].forEach((n, i) => { S.timer(setTimeout(() => noteOn(BASE + 5 + n), i * 260)); S.timer(setTimeout(() => noteOff(BASE + 5 + n), i * 260 + 200)); }); });
    const panic = el('button', {}, 'All notes off'); panic.addEventListener('click', allOff);
    bar.append(demo, panic, el('span', { class: 'small muted' }, 'Click or touch the keys, or use the letter keys shown on them.'));
    const tbuf = new Float32Array(2048), fbuf = new Uint8Array(1024);
    A.canvas(host, {
      height: 230, animate: true,
      caption: 'Top: the waveform leaving the synth. Bottom: its spectrum — watch the harmonics vanish as you lower the filter cut-off.',
      draw(ctx2, w, h, t) {
        t = Math.max(0, t);
        const live = an && Object.keys(voices).length > 0 || (an && (an.getFloatTimeDomainData(tbuf), peakOf(tbuf) > 0.002));
        const mid = 58;
        ctx2.strokeStyle = C('line'); ctx2.beginPath(); ctx2.moveTo(0, mid); ctx2.lineTo(w, mid); ctx2.stroke();
        ctx2.strokeStyle = C('accent'); ctx2.lineWidth = 2; ctx2.beginPath();
        if (live) { an.getFloatTimeDomainData(tbuf); let s0 = 0; for (let i = 1; i < 1024; i++) if (tbuf[i - 1] < 0 && tbuf[i] >= 0) { s0 = i; break; } for (let i = 0; i < 900; i++) { const x = i / 900 * w, y = mid - clamp(tbuf[s0 + i] * 3, -1, 1) * 48; i ? ctx2.lineTo(x, y) : ctx2.moveTo(x, y); } }
        else for (let i = 0; i <= 300; i++) { const x = i / 300 * w, y = mid - wavePt(st.wave, i / 300 * 3) * 36; i ? ctx2.lineTo(x, y) : ctx2.moveTo(x, y); }
        ctx2.stroke();
        if (!live) A.text(ctx2, 'raw oscillator shape — play a key to hear and see the result', w / 2, 14, { size: 11, align: 'center', color: C('muted') });
        const y0 = h - 22, y1 = 124, X = (f) => 8 + Math.log10(f / 40) / Math.log10(12000 / 40) * (w - 16);
        ctx2.fillStyle = C('panel2'); ctx2.fillRect(8, y1, w - 16, y0 - y1);
        if (live) { an.getByteFrequencyData(fbuf); const sr = an.context.sampleRate; ctx2.fillStyle = A.alpha(C('accent2'), 0.8); for (let k = 2; k < 1024; k++) { const f = k * sr / 2048; if (f > 12000) break; const bh = fbuf[k] / 255 * (y0 - y1); ctx2.fillRect(X(f), y0 - bh, Math.max(1.5, X(f * 1.02) - X(f)), bh); } }
        else { const f0 = 130.8 * Math.pow(2, st.oct); for (let k = 1; k * f0 < 12000; k++) { const a = st.wave === 'sine' ? (k === 1 ? 1 : 0) : st.wave === 'sawtooth' ? 1 / k : k % 2 ? (st.wave === 'square' ? 1 / k : 1 / (k * k)) : 0; if (!a) continue; const flt = 1 / Math.sqrt(1 + Math.pow(k * f0 / st.cutoff, 4)), bh = clamp((dB(a * flt) + 60) / 60, 0, 1) * (y0 - y1); ctx2.fillStyle = A.alpha(C('accent2'), 0.8); ctx2.fillRect(X(k * f0) - 1.5, y0 - bh, 3, bh); } }
        const xc = X(clamp(st.cutoff, 40, 12000)); ctx2.strokeStyle = C('warn'); ctx2.setLineDash([4, 3]); ctx2.beginPath(); ctx2.moveTo(xc, y1); ctx2.lineTo(xc, y0); ctx2.stroke(); ctx2.setLineDash([]);
        A.text(ctx2, 'cut-off', clamp(xc + 4, 10, w - 50), y1 + 12, { size: 10, color: C('warn') });
        [100, 1000, 10000].forEach((f) => A.text(ctx2, A.shortHz(f), X(f), h - 6, { size: 10, align: 'center', color: C('muted') }));
      },
    });
    const tip = tipBox(host);
    function update() {
      setLfo();
      for (const m in voices) { const v = voices[m]; v.flt.frequency.setTargetAtTime(st.cutoff, ctx.currentTime, 0.02); v.flt.Q.setTargetAtTime(st.res, ctx.currentTime, 0.02); }
      const tips = [];
      tips.push({ sine: 'A sine has no harmonics, so the filter has nothing to remove — it only gets quieter.', triangle: 'A triangle has weak odd harmonics: soft and flute-like.', sawtooth: 'A sawtooth holds every harmonic — the richest raw material for a filter to carve.', square: 'A square holds only odd harmonics: hollow, like a clarinet.' }[st.wave]);
      if (st.res > 8) tips.push('High resonance makes the filter ring at its cut-off frequency — a whistle that follows the cut-off as you move it.');
      if (st.uni > 1 && st.detune > 0) tips.push('Slightly detuned unison voices beat against each other, giving width and movement. Too much sounds out of tune.');
      if (st.s === 0) tips.push('With sustain at zero the note dies away even while the key is held: a pluck or percussive sound.');
      if (st.a > 300) tips.push('A slow attack removes the “edge” of the note, which is how pads and string-like sounds are made.');
      if (st.lfoTo !== 'off' && st.lfoDepth > 0) tips.push(st.lfoTo === 'pitch' ? 'The LFO is wobbling the pitch: vibrato at about 5–6 Hz sounds natural, faster sounds nervous.' : 'The LFO is sweeping the filter: the classic rhythmic wobble.');
      tip(tips);
    }
    update();
  };

  /* ======================================================================
     10. ADSR envelope shape
     ====================================================================== */
  V.adsrShape = function (host) {
    const PRE = { pluck: [3, 250, 0, 250, 400], pad: [700, 600, 0.8, 1200, 1800], organ: [5, 10, 1, 40, 900], perc: [1, 90, 0, 90, 150], brass: [70, 200, 0.7, 180, 900] };
    host.appendChild(A.seg([['brass', 'Brass-like'], ['pluck', 'Pluck'], ['pad', 'Pad'], ['organ', 'Organ'], ['perc', 'Percussive']], 'brass', (v) => { const p = PRE[v]; ['a', 'd', 's', 'r', 'hold'].forEach((k, i) => st.set(k, p[i], true)); update(); }));
    const st = A.controls(host, [
      { key: 'a', label: 'Attack', type: 'range', min: 1, max: 1500, step: 1, value: 70, unit: 'ms' },
      { key: 'd', label: 'Decay', type: 'range', min: 10, max: 1500, step: 10, value: 200, unit: 'ms' },
      { key: 's', label: 'Sustain level', type: 'range', min: 0, max: 1, step: 0.05, value: 0.7, fmt: (v) => Math.round(v * 100) + ' %' },
      { key: 'r', label: 'Release', type: 'range', min: 10, max: 2500, step: 10, value: 180, unit: 'ms' },
      { key: 'hold', label: 'Key held for', type: 'range', min: 50, max: 3000, step: 50, value: 900, unit: 'ms' },
    ], update);
    const levelAt = (ms) => { const { a, d, s, r, hold } = st; const pre = (t) => (t < a ? t / a : t < a + d ? 1 - (1 - s) * (t - a) / d : s); return ms <= hold ? pre(ms) : Math.max(0, pre(hold) * (1 - (ms - hold) / r)); };
    const S = session(); const bar = el('div', { class: 'row' }); host.appendChild(bar);
    const hear = el('button', { class: 'primary', html: A.icon('play') + ' Hear this envelope' });
    hear.addEventListener('click', () => {
      const ctx = S.begin(); if (!ctx) return; const out = masterOut(ctx, S, 0.25), t = ctx.currentTime + 0.03, g = S.add(ctx.createGain()), f = S.add(ctx.createBiquadFilter()); f.type = 'lowpass'; f.frequency.value = 2200; g.gain.value = 0;
      [220, 220.8].forEach((fr) => { const o = S.add(ctx.createOscillator()); o.type = 'sawtooth'; o.frequency.value = fr; o.connect(f); o.start(t); o.stop(t + (st.hold + st.r) / 1000 + 0.1); });
      f.connect(g); g.connect(out); g.gain.setValueAtTime(0, t);
      const total = st.hold + st.r; for (let i = 1; i <= 60; i++) g.gain.linearRampToValueAtTime(levelAt(total * i / 60) * 0.5, t + total * i / 60000);
    });
    bar.append(hear);
    const stats = statRow(host);
    A.canvas(host, {
      height: 260, animate: true,
      caption: 'The envelope is the volume shape of one note: how fast it starts, where it settles while the key is held, and how it dies after the key is let go.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t);
        const total = st.hold + st.r, ax = A.axes(ctx, w, h, { x: { min: 0, max: total * 1.05, label: 'Time (ms)', fmt: (v) => String(Math.round(v)) }, y: { min: 0, max: 1.1, label: 'Level', ticks: [0, 0.5, 1] } });
        const seg = [[0, Math.min(st.a, st.hold), C('accent'), 'A'], [st.a, Math.min(st.a + st.d, st.hold), C('accent2'), 'D'], [st.a + st.d, st.hold, C('c3'), 'S'], [st.hold, total, C('warn'), 'R']];
        for (const [a, b, c, l] of seg) { if (b <= a) continue; const pts = []; for (let i = 0; i <= 40; i++) { const ms = a + (b - a) * i / 40; pts.push([ms, levelAt(ms)]); } A.plotFill(ctx, ax, pts, A.alpha(c, 0.25)); A.plotLine(ctx, ax, pts, c, 3); A.text(ctx, l, ax.X((a + b) / 2), ax.y1 + 14, { size: 12, weight: 800, align: 'center', color: c }); }
        const xo = ax.X(st.hold); ctx.strokeStyle = C('text'); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(xo, ax.y1); ctx.lineTo(xo, ax.y0); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'key down', ax.x0 + 4, ax.y0 - 6, { size: 10, color: C('muted') }); A.text(ctx, 'key up', xo + 4, ax.y0 - 6, { size: 10, color: C('muted') });
        const ms = (t * 1000 * Math.max(0.35, total / 2500)) % (total * 1.25); if (ms <= total) { ctx.fillStyle = C('text'); ctx.beginPath(); ctx.arc(ax.X(ms), ax.Y(levelAt(ms)), 5, 0, TAU); ctx.fill(); }
      },
    });
    const tip = tipBox(host);
    function update() {
      const reach = st.hold >= st.a, kind = st.a > 250 ? 'slow swell — pad or strings-like' : st.s < 0.15 ? (st.d < 150 ? 'percussive hit' : 'pluck') : st.s > 0.9 ? 'on/off — organ-like' : 'attack with a held body — brass or lead';
      stats(A.statBox('Time to full level', fmt(st.a, 0) + ' ms', st.a < 15 ? 'instant, clicky' : st.a < 100 ? 'quick' : 'gradual')
        + A.statBox('Level while held', Math.round(st.s * 100) + ' %', st.s === 0 ? 'note dies by itself' : 'holds as long as the key')
        + A.statBox('Whole note lasts', fmt(st.hold + st.r, 0) + ' ms', 'key time + release')
        + A.statBox('Character', kind, ''));
      const tips = [];
      if (!reach) tips.push('The key is released before the attack finishes, so the note never reaches full level. Short notes need a short attack.');
      if (st.a < 3) tips.push('A near-zero attack on a low note can click, because the wave starts mid-cycle. 2–5 ms removes the click without softening the note.');
      if (st.r > 800) tips.push('A long release makes notes overlap and blur — lovely for pads, muddy for fast bass lines.');
      if (st.s > 0 && st.d < 60) tips.push('A very short decay to a lower sustain creates a little “blip” at the start of each note that helps it cut through a mix.');
      tips.push('The same four stages can drive a filter instead of the volume: then the note gets duller or brighter over time rather than quieter or louder.');
      tip(tips);
    }
    update();
  };

  /* ======================================================================
     11. FM lab
     ====================================================================== */
  V.fmLab = function (host) {
    const st = A.controls(host, [
      { key: 'fc', label: 'Carrier frequency', type: 'range', min: 55, max: 880, step: 1, value: 220, unit: 'Hz' },
      { key: 'ratio', label: 'Modulator ÷ carrier ratio', type: 'range', min: 0.25, max: 8, step: 0.05, value: 2 },
      { key: 'index', label: 'Modulation index (depth)', type: 'range', min: 0, max: 12, step: 0.1, value: 2 },
      { key: 'decay', label: 'Let the depth die away (struck sound)', type: 'check', value: false },
    ], update);
    const bessel = (n, x) => { let s = 0; const Mn = 96; for (let k = 0; k < Mn; k++) { const tau = Math.PI * (k + 0.5) / Mn; s += Math.cos(n * tau - x * Math.sin(tau)); } return s / Mn; };
    let M = { comps: [] };
    const S = session(); let nodes = null;
    function apply() { if (!S.on || !nodes) return; const t = nodes.ctx.currentTime, fm = st.fc * st.ratio; nodes.car.frequency.setTargetAtTime(st.fc, t, 0.02); nodes.mod.frequency.setTargetAtTime(fm, t, 0.02); if (!st.decay) { nodes.mg.gain.setTargetAtTime(st.index * fm, t, 0.02); nodes.amp.gain.setTargetAtTime(0.5, t, 0.03); } }
    function strike() { if (!S.on || !nodes || !st.decay) return; const t = nodes.ctx.currentTime, fm = st.fc * st.ratio; nodes.mg.gain.cancelScheduledValues(t); nodes.mg.gain.setValueAtTime(st.index * fm, t); nodes.mg.gain.setTargetAtTime(st.index * fm * 0.05, t, 0.25); nodes.amp.gain.cancelScheduledValues(t); nodes.amp.gain.setValueAtTime(0.0001, t); nodes.amp.gain.linearRampToValueAtTime(0.6, t + 0.004); nodes.amp.gain.setTargetAtTime(0.0001, t + 0.004, 0.35); }
    const btn = toggleBtn('Play', () => {
      const ctx = S.begin(); if (!ctx) return false; const out = masterOut(ctx, S, 0.2), car = S.add(ctx.createOscillator()), mod = S.add(ctx.createOscillator()), mg = S.add(ctx.createGain()), amp = S.add(ctx.createGain());
      amp.gain.value = 0; mg.gain.value = 0; mod.connect(mg); mg.connect(car.frequency); car.connect(amp); amp.connect(out); car.start(); mod.start(); nodes = { ctx, car, mod, mg, amp };
      apply(); strike(); S.timer(setInterval(strike, 1300));
    }, () => { S.stop(); nodes = null; });
    const bar = el('div', { class: 'row' }); bar.appendChild(btn); host.appendChild(bar);
    const stats = statRow(host);
    A.canvas(host, {
      height: 330,
      caption: 'Top: the waveform — one sine wave whose frequency is being wobbled very fast by another. Bottom: the spectrum that results. Spacing between the lines equals the modulator frequency.',
      draw(ctx, w) {
        const fm = st.fc * st.ratio, T = Math.max(3 / st.fc, 1.5 / fm);
        sub(ctx, 0, 0, () => { const ax = A.axes(ctx, w, 130, { x: { min: 0, max: T * 1000, fmt: (v) => fmt(v, 1) + ' ms' }, y: { min: -1.2, max: 1.2, ticks: [-1, 0, 1] } }); const pts = []; for (let i = 0; i <= 500; i++) { const tt = T * i / 500; pts.push([tt * 1000, Math.sin(TAU * st.fc * tt + st.index * Math.sin(TAU * fm * tt))]); } A.plotLine(ctx, ax, pts, C('accent'), 2); });
        sub(ctx, 0, 134, () => {
          const fmax = Math.max(1000, Math.min(16000, st.fc + (st.index + 3) * fm)), ax = A.axes(ctx, w, 196, { x: { min: 0, max: fmax, label: 'Frequency (Hz)', fmt: (v) => A.shortHz(v) }, y: { min: 0, max: 1, label: 'Strength', ticks: [0, 0.5, 1] } });
          for (const c of M.comps) { if (c.f > fmax) continue; const x = ax.X(c.f); ctx.strokeStyle = Math.abs(c.f - st.fc) < 1 ? C('accent') : c.neg ? C('warn') : C('accent2'); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, ax.y0); ctx.lineTo(x, ax.Y(Math.min(1, Math.abs(c.a)))); ctx.stroke(); }
          A.text(ctx, 'carrier', clamp(ax.X(st.fc), ax.x0 + 20, ax.x1 - 20), ax.y1 + 12, { size: 10, align: 'center', color: C('accent') });
        });
      },
    });
    const tip = tipBox(host);
    function update() {
      const fm = st.fc * st.ratio, map = new Map(), N = Math.ceil(st.index + 7);
      for (let n = -N; n <= N; n++) { let f = st.fc + n * fm, a = bessel(Math.abs(n), st.index) * (n < 0 && n % 2 ? -1 : 1), neg = false; if (f < 0) { f = -f; a = -a; neg = true; } const k = Math.round(f * 2) / 2; const e = map.get(k) || { f: k, a: 0, neg: false }; e.a += a; e.neg = e.neg || neg; map.set(k, e); }
      M.comps = [...map.values()].filter((c) => Math.abs(c.a) > 0.01 && c.f > 0);
      const whole = (k) => Math.abs(st.ratio * k - Math.round(st.ratio * k)) < 1e-6, harmonic = whole(1), semi = !harmonic && (whole(2) || whole(3) || whole(4));
      stats(A.statBox('Modulator', fmtHz(fm), 'spacing of the sidebands')
        + A.statBox('Audible components', String(M.comps.length), st.index < 0.3 ? 'almost a pure sine' : st.index < 3 ? 'mellow' : 'bright and dense')
        + A.statBox('Rough bandwidth', fmtHz(2 * fm * (st.index + 1)), '2 × modulator × (index + 1)')
        + A.statBox('Tuning', harmonic ? 'Harmonic' : semi ? 'Hollow, still pitched' : 'Inharmonic', harmonic ? 'clear pitch' : semi ? 'partials fit a lower note' : 'bell- or metal-like', harmonic ? 'good' : 'warn'));
      const tips = [];
      tips.push(harmonic ? 'A simple whole-number ratio puts every sideband on a harmonic, so the ear hears one pitched note with a changing tone colour.' : semi ? 'A simple fraction such as 1.5 or 2.5 puts the sidebands on the harmonics of a lower note, with many of them missing: pitched, but hollow and reedy.' : 'A non-whole ratio scatters the sidebands between the harmonics. That clangour is how bells, chimes and metallic percussion are made.');
      if (st.index > 6) tips.push('High index = many strong sidebands = bright and buzzy. Above about 10 on high notes the top sidebands can fold back as aliasing.');
      if (st.decay) tips.push('Letting the index fall during the note makes it start bright and end mellow — exactly what a struck or plucked instrument does.');
      else tips.push('Tick the box to let the depth die away: a static index sounds like an organ stop; a falling one sounds struck.');
      if (M.comps.some((c) => c.neg)) tips.push('Marked lines are sidebands that went “below zero” and reflected back up — they change the tone and can cancel others.');
      tip(tips); apply();
    }
    update();
  };

  /* ======================================================================
     12. Drum synth with a 16-step grid
     ====================================================================== */
  V.drumSynth = function (host) {
    const PAT = {
      rock: { kick: [0, 8, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
      four: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14] },
      brk: { kick: [0, 3, 10], snare: [4, 12, 15], hat: [0, 2, 4, 6, 7, 8, 10, 12, 14] },
      clear: { kick: [], snare: [], hat: [] },
    };
    const ROWS = [['kick', 'Kick'], ['snare', 'Snare'], ['hat', 'Hi-hat']];
    const grid = {}; ROWS.forEach(([k]) => (grid[k] = new Array(16).fill(false)));
    const S = session(); let ctx = null, out = null, step = 0, nextT = 0, queue = [], nbuf = null;
    const btn = toggleBtn('Play the pattern', () => {
      ctx = S.begin(); if (!ctx) return false; out = masterOut(ctx, S, 0.3); step = 0; nextT = ctx.currentTime + 0.06; queue = [];
      if (!nbuf || nbuf.sampleRate !== ctx.sampleRate) { nbuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = nbuf.getChannelData(0), r = rng(33); for (let i = 0; i < d.length; i++) d[i] = r() * 2 - 1; }
      S.timer(setInterval(() => { while (nextT < ctx.currentTime + 0.12) { ROWS.forEach(([k]) => { if (grid[k][step]) hit(k, nextT); }); queue.push([step, nextT]); if (queue.length > 40) queue.shift(); nextT += 60 / st.tempo / 4; step = (step + 1) % 16; } }, 25));
    }, () => { S.stop(); cells.forEach((c) => (c.style.outline = '')); });
    const top = el('div', { class: 'row', style: { flexWrap: 'wrap', marginBottom: '8px' } }); top.appendChild(btn);
    [['rock', 'Basic beat'], ['four', 'Four on the floor'], ['brk', 'Broken beat'], ['clear', 'Clear']].forEach(([k, l]) => { const b = el('button', {}, l); b.addEventListener('click', () => loadPat(k)); top.appendChild(b); });
    host.appendChild(top);
    const cells = []; const gwrap = el('div', { style: { margin: '6px 0 10px' } }); host.appendChild(gwrap);
    ROWS.forEach(([k, name]) => {
      gwrap.appendChild(el('div', { class: 'small', style: { margin: '6px 0 2px', fontWeight: '700' } }, name));
      const row = el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(16, minmax(0, 1fr))', gap: '2px' } });
      for (let i = 0; i < 16; i++) { const c = el('button', { 'data-row': k, 'data-step': i, 'aria-label': name + ' step ' + (i + 1), style: { padding: '0', minWidth: '0', height: '28px', borderRadius: '4px', borderColor: i % 4 === 0 ? 'var(--accent)' : 'var(--line)' } }); c.addEventListener('click', () => { grid[k][i] = !grid[k][i]; paint(); }); row.appendChild(c); cells.push(c); }
      gwrap.appendChild(row);
    });
    function paint() { cells.forEach((c) => { const on = grid[c.dataset.row][+c.dataset.step]; c.style.background = on ? `var(--${{ kick: 'c3', snare: 'warn', hat: 'accent2' }[c.dataset.row]})` : 'var(--panel2)'; }); }
    function loadPat(k) { ROWS.forEach(([r]) => { grid[r].fill(false); PAT[k][r].forEach((i) => (grid[r][i] = true)); }); paint(); }
    const st = A.controls(host, [
      { key: 'tempo', label: 'Tempo', type: 'range', min: 60, max: 180, step: 1, value: 110, unit: 'bpm' },
      { key: 'kTune', label: 'Kick: final pitch', type: 'range', min: 35, max: 90, step: 1, value: 50, unit: 'Hz' },
      { key: 'kDecay', label: 'Kick: length', type: 'range', min: 0.08, max: 0.7, step: 0.01, value: 0.3, unit: 's' },
      { key: 'sNoise', label: 'Snare: body ↔ wires', type: 'range', min: 0, max: 1, step: 0.05, value: 0.6 },
      { key: 'sDecay', label: 'Snare: length', type: 'range', min: 0.05, max: 0.4, step: 0.01, value: 0.16, unit: 's' },
      { key: 'hBright', label: 'Hat: brightness', type: 'range', min: 3000, max: 11000, step: 100, value: 7000, unit: 'Hz' },
      { key: 'hDecay', label: 'Hat: length (closed ↔ open)', type: 'range', min: 0.02, max: 0.4, step: 0.01, value: 0.05, unit: 's' },
    ], () => { cv.redraw(); tips(); });
    function noise(t, dur) { const s = ctx.createBufferSource(); s.buffer = nbuf; s.start(t, Math.random() * 0.5, dur + 0.05); S.add(s); return s; }
    function env(t, peak, dur) { const g = ctx.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); g.connect(out); return g; }
    function hit(k, t) {
      if (k === 'kick') { const o = ctx.createOscillator(); o.frequency.setValueAtTime(st.kTune * 4, t); o.frequency.exponentialRampToValueAtTime(st.kTune, t + 0.07); o.connect(env(t, 0.95, st.kDecay)); o.start(t); o.stop(t + st.kDecay + 0.05); S.add(o); const c = noise(t, 0.01), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500; c.connect(hp); hp.connect(env(t, 0.25, 0.012)); }
      else if (k === 'snare') { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(180, t + 0.05); o.connect(env(t, 0.6 * (1 - st.sNoise) + 0.05, 0.11)); o.start(t); o.stop(t + 0.2); S.add(o); const n = noise(t, st.sDecay), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1400; n.connect(hp); hp.connect(env(t, 0.55 * st.sNoise + 0.03, st.sDecay)); }
      else { const n = noise(t, st.hDecay), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = st.hBright; n.connect(hp); hp.connect(env(t, 0.3, st.hDecay)); }
    }
    const cv = A.canvas(host, {
      height: 150, animate: true,
      caption: 'The three recipes: a sine wave that drops in pitch (kick), a short tone plus filtered noise (snare), and nothing but bright filtered noise (hi-hat).',
      draw(c2, w, h) {
        if (S.on && ctx) { let cur = -1; for (const [s, tt] of queue) if (tt <= ctx.currentTime) cur = s; cells.forEach((c) => (c.style.outline = +c.dataset.step === cur ? '2px solid var(--text)' : '')); }
        const r = rng(4), pw = w / 3;
        ROWS.forEach(([k, name], j) => {
          const x0 = j * pw + 6, ww = pw - 12, cy = h / 2 + 6, col = C({ kick: 'c3', snare: 'warn', hat: 'accent2' }[k]), dur = k === 'kick' ? 0.7 : 0.4;
          c2.fillStyle = C('panel2'); c2.fillRect(x0, 22, ww, h - 30); c2.strokeStyle = col; c2.lineWidth = 1.4; c2.beginPath();
          const n = Math.max(60, Math.floor(ww * 1.5));
          for (let i = 0; i <= n; i++) { const tt = dur * i / n; let v; if (k === 'kick') v = Math.sin(TAU * (st.kTune * tt + 3 * st.kTune * 0.07 / 3 * (1 - Math.exp(-tt / 0.023)))) * Math.exp(-tt * 6.9 / st.kDecay); else if (k === 'snare') v = (1 - st.sNoise) * Math.sin(TAU * 200 * tt) * Math.exp(-tt * 60) + st.sNoise * (r() * 2 - 1) * Math.exp(-tt * 6.9 / st.sDecay); else v = (r() * 2 - 1) * Math.exp(-tt * 6.9 / st.hDecay) * 0.8; const px = x0 + ww * i / n, py = cy - v * (h - 44) / 2; i ? c2.lineTo(px, py) : c2.moveTo(px, py); }
          c2.stroke(); A.text(c2, name, x0 + 2, 14, { size: 11, weight: 700 });
        });
      },
    });
    const tip = tipBox(host);
    function tips() {
      const t = [];
      if (st.kDecay > 0.45) t.push('A long kick is really a bass note. It sounds huge alone but fights the bass line — tune it to the key of the song or shorten it.');
      else if (st.kDecay < 0.15) t.push('A very short kick is all click and punch with little weight: good for fast, busy music.');
      if (st.sNoise < 0.25) t.push('With little noise the snare becomes a tom-like “bonk”. The noise part is the rattle of the snare wires.');
      if (st.hDecay > 0.2) t.push('A long hi-hat is an open hat. Real players close it with the pedal, so an open hit should stop when the next closed one plays.');
      if (st.hBright < 4500) t.push('A dark hat sits behind the vocal; a bright one above 8 kHz adds sparkle but can get harsh.');
      t.push('Click the squares to write your own beat. Marked squares are the four main beats of the bar.');
      tip(t);
    }
    loadPat('rock'); tips();
  };

  /* ======================================================================
     13. Modulation effects lab
     ====================================================================== */
  V.modFxLab = function (host) {
    const FX = {
      chorus: { name: 'Chorus', base: 0.02, span: 0.006, fb: false, about: 'A 15–30 ms delay, gently wobbled and mixed with the dry sound: it imitates several players who are never perfectly together.' },
      flanger: { name: 'Flanger', base: 0.003, span: 0.0026, fb: true, about: 'A very short delay (under 10 ms) swept slowly: the comb of notches slides up and down — the “jet plane” whoosh. Feedback makes it sharper.' },
      vibrato: { name: 'Vibrato', base: 0.006, span: 0.003, fb: false, about: 'Only the wobbling delay, no dry signal: a changing delay shifts the pitch up and down, like a tiny Doppler effect.' },
      phaser: { name: 'Phaser', fb: true, about: 'A chain of all-pass filters that shifts phase, mixed with the dry sound. It makes just a few notches that are not evenly spaced — softer and more “liquid” than a flanger.' },
      tremolo: { name: 'Tremolo', fb: false, about: 'The volume itself is turned up and down by the slow oscillator. Nothing is delayed and the pitch never moves.' },
      ring: { name: 'Ring modulator', fb: false, about: 'The signal is multiplied by an audio-rate tone. Every partial is replaced by its sum and difference with that tone — robotic and bell-like.' },
    };
    const st = A.controls(host, [
      { key: 'fx', label: 'Effect', type: 'select', value: 'flanger', options: Object.entries(FX).map(([k, v]) => [k, v.name]) },
      { key: 'source', label: 'Source', type: 'select', value: 'chord', options: [['chord', 'Sustained chord'], ['noise', 'Noise (shows the comb best)']] },
      { key: 'rate', label: 'Rate', type: 'range', min: 0.05, max: 8, step: 0.05, value: 0.4, unit: 'Hz' },
      { key: 'depth', label: 'Depth', type: 'range', min: 0, max: 1, step: 0.01, value: 0.8 },
      { key: 'fb', label: 'Feedback', type: 'range', min: 0, max: 0.9, step: 0.01, value: 0.5 },
      { key: 'mix', label: 'Mix (dry ↔ effect)', type: 'range', min: 0, max: 1, step: 0.01, value: 0.5 },
    ], update);
    const ringF = () => 30 + st.rate * 100;
    const gains = () => (st.fx === 'vibrato' ? [0, 1] : st.fx === 'tremolo' ? [0, 1] : [Math.cos(st.mix * Math.PI / 2), Math.sin(st.mix * Math.PI / 2)]);
    const S = session(); let N = null, last = '';
    function build() {
      const ctx = S.begin(); if (!ctx) return false;
      const out = masterOut(ctx, S, 0.3), inp = S.add(ctx.createGain()), dry = S.add(ctx.createGain()), wet = S.add(ctx.createGain()), lfo = S.add(ctx.createOscillator()), lg = S.add(ctx.createGain()), fbG = S.add(ctx.createGain());
      if (st.source === 'chord') { const lp = S.add(ctx.createBiquadFilter()); lp.type = 'lowpass'; lp.frequency.value = 3500; [110, 164.8, 220, 277.2].forEach((f, i) => { const o = S.add(ctx.createOscillator()), g = S.add(ctx.createGain()); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = (i - 1.5) * 4; g.gain.value = 0.13; o.connect(g); g.connect(lp); o.start(); }); lp.connect(inp); }
      else { const s = S.add(ctx.createBufferSource()); s.buffer = A.audio.noiseBuffer('pink', 3); s.loop = true; const g = S.add(ctx.createGain()); g.gain.value = 0.7; s.connect(g); g.connect(inp); s.start(); }
      inp.connect(dry); dry.connect(out); wet.connect(out); lfo.connect(lg); lfo.start(); fbG.gain.value = 0;
      N = { ctx, dry, wet, lfo, lg, fbG, fx: st.fx };
      if (st.fx === 'phaser') { const aps = []; for (let i = 0; i < 4; i++) { const a = S.add(ctx.createBiquadFilter()); a.type = 'allpass'; a.Q.value = 0.7; a.frequency.value = 900; lg.connect(a.frequency); (i ? aps[i - 1] : inp).connect(a); aps.push(a); } aps[3].connect(wet); aps[3].connect(fbG); fbG.connect(aps[0]); N.aps = aps; }
      else if (st.fx === 'tremolo') { const tg = S.add(ctx.createGain()); inp.connect(tg); tg.connect(wet); lg.connect(tg.gain); N.tg = tg; }
      else if (st.fx === 'ring') { const rg = S.add(ctx.createGain()); rg.gain.value = 0; inp.connect(rg); rg.connect(wet); lg.connect(rg.gain); N.rg = rg; }
      else { const d = S.add(ctx.createDelay(0.1)); inp.connect(d); d.connect(wet); d.connect(fbG); fbG.connect(d); lg.connect(d.delayTime); N.d = d; }
      last = st.fx + st.source; apply(true); return true;
    }
    function apply(now) {
      if (!S.on || !N) return; const t = N.ctx.currentTime, tc = now ? 0.001 : 0.03, f = FX[st.fx], [dg, wg] = gains();
      N.dry.gain.setTargetAtTime(dg, t, tc); N.wet.gain.setTargetAtTime(wg, t, tc);
      N.lfo.frequency.setTargetAtTime(st.fx === 'ring' ? ringF() : st.rate, t, tc);
      N.fbG.gain.setTargetAtTime(f.fb ? Math.min(0.85, st.fb) : 0, t, tc);
      if (N.d) { N.d.delayTime.setTargetAtTime(f.base, t, tc); N.lg.gain.setTargetAtTime(f.span * st.depth, t, tc); }
      if (N.aps) N.lg.gain.setTargetAtTime(650 * st.depth, t, tc);
      if (N.tg) { N.tg.gain.setTargetAtTime(1 - st.depth / 2, t, tc); N.lg.gain.setTargetAtTime(st.depth / 2, t, tc); }
      if (N.rg) N.lg.gain.setTargetAtTime(1, t, tc);
    }
    const btn = toggleBtn('Play', build, () => { S.stop(); N = null; });
    const bar = el('div', { class: 'row' }); bar.appendChild(btn); host.appendChild(bar);
    const stats = statRow(host);
    const apc = (fc) => bq('allpass', fc, 0.7);
    function respAt(f, t) {
      const [dg, wg] = gains(), ph = Math.sin(TAU * st.rate * t), fx = st.fx, F = FX[fx];
      if (fx === 'tremolo') return 1 - st.depth / 2 + st.depth / 2 * ph;
      let ar, ai;
      if (fx === 'phaser') { const c = apc(clamp(900 + 650 * st.depth * ph, 120, 6000)); let h = bqH(c, f); ar = 1; ai = 0; for (let i = 0; i < 4; i++) { const r = ar * h[0] - ai * h[1]; ai = ar * h[1] + ai * h[0]; ar = r; } }
      else { const tau = F.base + F.span * st.depth * ph; ar = Math.cos(TAU * f * tau); ai = -Math.sin(TAU * f * tau); }
      const fb = F.fb ? Math.min(0.85, st.fb) : 0, dr = 1 - fb * ar, di = -fb * ai, dd = dr * dr + di * di, wr = (ar * dr + ai * di) / dd, wi = (ai * dr - ar * di) / dd;
      return Math.hypot(dg + wg * wr, wg * wi);
    }
    A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top: what the slow oscillator is moving right now. Bottom: the frequency response that results at this instant — watch the notches travel.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t); const fx = st.fx, F = FX[fx], win = clamp(3 / st.rate, 1, 8);
        sub(ctx, 0, 0, () => {
          let yr, fn, lab;
          if (fx === 'tremolo') { yr = [0, 1.1]; lab = 'gain'; fn = (tt) => 1 - st.depth / 2 + st.depth / 2 * Math.sin(TAU * st.rate * tt); }
          else if (fx === 'phaser') { yr = [0, 1800]; lab = 'centre, Hz'; fn = (tt) => 900 + 650 * st.depth * Math.sin(TAU * st.rate * tt); }
          else if (fx === 'ring') { yr = [-1.2, 1.2]; lab = 'carrier'; fn = (tt) => Math.sin(TAU * ringF() * tt / 60); }
          else { yr = [0, (F.base + F.span) * 1100]; lab = 'delay, ms'; fn = (tt) => (F.base + F.span * st.depth * Math.sin(TAU * st.rate * tt)) * 1000; }
          const ax = A.axes(ctx, w, 120, { x: { min: -win, max: 0, fmt: (v) => (v === 0 ? 'now' : fmt(v, 1) + ' s') }, y: { min: yr[0], max: yr[1], label: lab }, pad: { b: 22 } });
          const pts = []; for (let i = 0; i <= 200; i++) { const d = -win + win * i / 200; pts.push([d, fn(t + d)]); } A.plotLine(ctx, ax, pts, C('accent2'), 2);
          ctx.fillStyle = C('accent2'); ctx.beginPath(); ctx.arc(ax.X(0), ax.Y(clamp(fn(t), yr[0], yr[1])), 5, 0, TAU); ctx.fill();
        });
        sub(ctx, 0, 124, () => {
          if (fx === 'ring') {
            const ax = A.axes(ctx, w, 204, { x: { min: 0, max: 2000, label: 'Frequency (Hz)', fmt: (v) => A.shortHz(v) }, y: { min: 0, max: 1, ticks: [0, 0.5, 1], label: 'Strength' } }), fc = ringF();
            [110, 220, 330, 440, 550, 660].forEach((f, i) => { const a = 1 / (i + 1); ctx.lineWidth = 2; ctx.strokeStyle = A.alpha(C('muted'), 0.9); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(f), ax.y0); ctx.lineTo(ax.X(f), ax.Y(a * (1 - st.mix * 0.8))); ctx.stroke(); ctx.setLineDash([]); [f + fc, Math.abs(f - fc)].forEach((g) => { if (g > 2000) return; ctx.strokeStyle = C('accent'); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax.X(g), ax.y0); ctx.lineTo(ax.X(g), ax.Y(a * 0.5 * (0.2 + st.mix * 0.8))); ctx.stroke(); }); });
            A.text(ctx, 'dashed: original harmonics · solid: sums and differences', (ax.x0 + ax.x1) / 2, ax.y1 + 12, { size: 10, align: 'center', color: C('muted') });
          } else if (fx === 'vibrato') {
            const ax = A.axes(ctx, w, 204, { x: { min: -win, max: 0, label: 'Time', fmt: (v) => (v === 0 ? 'now' : fmt(v, 1) + ' s') }, y: { min: -120, max: 120, label: 'Pitch shift (cents)' } });
            const cents = (tt) => 1200 * Math.log2(Math.max(0.5, 1 - F.span * st.depth * TAU * st.rate * Math.cos(TAU * st.rate * tt)));
            const pts = []; for (let i = 0; i <= 200; i++) { const d = -win + win * i / 200; pts.push([d, cents(t + d)]); } A.plotLine(ctx, ax, pts, C('accent'), 2.5);
          } else {
            const ax = A.axes(ctx, w, 204, { x: { min: 50, max: 12000, log: true, label: 'Frequency (Hz)' }, y: { min: -36, max: 18, label: 'dB' } });
            const pts = []; for (let f = 50; f <= 12000; f *= 1.012) pts.push([f, clamp(dB(respAt(f, t)), -36, 18)]); A.plotLine(ctx, ax, pts, C('accent'), 2.2);
          }
        });
      },
    });
    const tip = tipBox(host);
    function update() {
      if (S.on && last !== st.fx + st.source) build(); else apply();
      const F = FX[st.fx], fx = st.fx;
      const s = [];
      if (F.base) s.push(A.statBox('Delay sweeps', fmt((F.base - F.span * st.depth) * 1000, 1) + '–' + fmt((F.base + F.span * st.depth) * 1000, 1) + ' ms', 'around ' + fmt(F.base * 1000, 0) + ' ms'), A.statBox(fx === 'vibrato' ? 'Pitch swing' : 'First notch near', fx === 'vibrato' ? '±' + fmt(1200 * Math.log2(1 + F.span * st.depth * TAU * st.rate), 0) + ' cents' : fmtHz(1 / (2 * F.base)), fx === 'vibrato' ? 'grows with rate × depth' : 'then every ' + fmtHz(1 / F.base)));
      if (fx === 'phaser') s.push(A.statBox('Notches', '2', 'four all-pass stages give two'), A.statBox('Sweep', fmtHz(900 - 650 * st.depth) + '–' + fmtHz(900 + 650 * st.depth), ''));
      if (fx === 'tremolo') s.push(A.statBox('Level swing', fmt(-dB(1 - st.depth + 1e-3), 1) + ' dB', 'from full to the dip'));
      if (fx === 'ring') s.push(A.statBox('Carrier tone', fmtHz(ringF()), 'set by the Rate slider'), A.statBox('110 Hz becomes', fmtHz(Math.abs(110 - ringF())) + ' + ' + fmtHz(110 + ringF()), 'the original is gone'));
      s.push(A.statBox('Cycle time', fx === 'ring' ? '—' : fmt(1 / st.rate, 1) + ' s', fx === 'ring' ? '' : fmt(st.rate * 60, 0) + ' sweeps a minute'));
      stats(s.join(''));
      const tips = [F.about];
      if (!F.fb && st.fb > 0 && fx !== 'ring' && fx !== 'tremolo' && fx !== 'vibrato') tips.push('Feedback is not used by this effect.');
      if (fx === 'flanger' && st.fb > 0.7) tips.push('Strong feedback turns the notches into ringing peaks — a metallic, pitched resonance that follows the sweep.');
      if ((fx === 'chorus' || fx === 'flanger') && st.rate > 3 && st.depth > 0.5) tips.push('Fast and deep together makes the pitch wobble obvious and seasick. Slow the rate or reduce the depth.');
      if ((fx === 'chorus' || fx === 'flanger' || fx === 'phaser') && (st.mix < 0.15 || st.mix > 0.85)) tips.push('The notches need both dry and delayed sound. They are deepest at an equal mix and vanish at either end.');
      if (fx === 'tremolo' && st.rate > 6) tips.push('Above about 15–20 Hz the ear stops hearing separate pulses and starts hearing extra tones — tremolo turns into ring modulation.');
      tip(tips);
    }
    update();
  };

  /* ======================================================================
     14. Pitch and time lab
     ====================================================================== */
  V.pitchTimeLab = function (host) {
    const st = A.controls(host, [
      { key: 'mode', label: 'Method', type: 'select', value: 'gran', options: [['gran', 'Independent: grains, overlap-add'], ['vari', 'Varispeed (tape-style, linked)']] },
      { key: 'stretch', label: 'Length', type: 'range', min: 0.5, max: 2, step: 0.05, value: 1.5, fmt: (v) => Math.round(v * 100) + ' %' },
      { key: 'semis', label: 'Pitch shift', type: 'range', min: -12, max: 12, step: 1, value: 0, unit: 'semitones' },
      { key: 'grain', label: 'Grain size', type: 'range', min: 10, max: 150, step: 5, value: 60, unit: 'ms' },
    ], update);
    const ratio = () => Math.pow(2, st.semis / 12);
    const outLen = () => (st.mode === 'vari' ? 1 / ratio() : st.stretch);
    const F = () => (st.mode === 'vari' ? 1 : st.stretch * ratio());
    const resample = (x, r) => { const n = Math.floor(x.length / r), y = new Float32Array(n); for (let i = 0; i < n; i++) { const p = i * r, k = Math.floor(p), fr = p - k; y[i] = x[k] + ((x[k + 1] || 0) - x[k]) * fr; } return y; };
    function ola(x, f, gms) { const G = Math.round(gms / 1000 * SR / 2) * 2, Hs = G / 2, Ha = Hs / f, n = Math.floor(x.length * f), y = new Float32Array(n + G); for (let k = 0; k * Hs < n; k++) { const a = Math.round(k * Ha), o = k * Hs; for (let i = 0; i < G; i++) { const v = x[a + i]; if (v === undefined) break; y[o + i] += v * (0.5 - 0.5 * Math.cos(TAU * i / G)); } } return y.subarray(0, n); }
    const play = player(host, [['orig', 'Original'], ['proc', 'Processed']], (id) => {
      const x = music().subarray(0, SR * 2);
      if (id === 'orig') return scaled(x, 0.5);
      return scaled(st.mode === 'vari' ? resample(x, ratio()) : resample(ola(x, F(), st.grain), ratio()), 0.5);
    });
    const stats = statRow(host);
    const src = (u) => { const hits = [0.04, 0.37, 0.7]; let v = 0; for (const h0 of hits) if (u >= h0) { const d = u - h0; v += Math.exp(-d * 9) * Math.sin(TAU * (26 + h0 * 30) * d) + (d < 0.012 ? 0.9 * Math.sin(d * 2600) : 0); } return v; };
    A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top: the original, chopped into overlapping grains. Bottom: the same grains laid down again with different spacing. Lines show where each output grain was read from.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t);
        const x0 = 10, ww = w - 20, f = F(), Lout = outLen(), scale = ww / Math.max(1, Lout), g = st.grain / 1000 / 2 * 0.5, vari = st.mode === 'vari';
        const band = (y, len, fn, col) => { ctx.fillStyle = C('panel2'); ctx.fillRect(x0, y - 44, ww, 88); ctx.fillStyle = A.alpha(col, 0.12); ctx.fillRect(x0, y - 44, len * scale, 88); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath(); const n = Math.floor(len * scale); for (let i = 0; i <= n; i++) { const v = fn(i / n); const py = y - clamp(v, -1.1, 1.1) * 36; i ? ctx.lineTo(x0 + i, py) : ctx.moveTo(x0 + i, py); } ctx.stroke(); };
        const pr = vari ? ratio() : ratio();
        band(64, 1, src, C('text'));
        // processed waveform: time-mapped, with pitch ratio applied to the fine detail
        band(250, Lout, (u) => { const hits = [0.04, 0.37, 0.7]; let v = 0; const tu = u; for (const h0 of hits) if (tu >= h0) { const d = (tu - h0) * Lout; v += Math.exp(-d * 9) * Math.sin(TAU * (26 + h0 * 30) * d * pr) + (d < 0.012 * (vari ? 1 / pr : 1) ? 0.9 * Math.sin(d * 2600) : 0); if (!vari && f > 1.25 && st.grain > 70 && d > 0.03 * f && d < 0.03 * f + 0.012) v += 0.5 * Math.sin(d * 2600); } return v; }, C('accent'));
        A.text(ctx, 'original', x0 + 4, 32, { size: 10, color: C('muted') }); A.text(ctx, 'processed · ' + Math.round(Lout * 100) + ' % length', x0 + 4, 218, { size: 10, color: C('muted') });
        if (!vari) {
          const count = Math.min(60, Math.ceil(Lout / g)), hi = Math.floor((t * 4) % count);
          for (let k = 0; k < count; k++) { const xs = x0 + k * g * scale, xa = x0 + (k * g / f * (1 / ratio()) * ratio()) * scale * (1 / 1), aPos = k * g / st.stretch; const xaa = x0 + aPos * scale; if (aPos > 1) break; const on = k === hi; ctx.strokeStyle = on ? C('accent2') : A.alpha(C('accent2'), 0.28); ctx.lineWidth = on ? 2.2 : 1; ctx.beginPath(); ctx.moveTo(xaa, 108); ctx.lineTo(xs, 206); ctx.stroke(); if (on) { ctx.fillStyle = A.alpha(C('accent2'), 0.3); ctx.fillRect(xaa - g * scale, 20, 2 * g * scale, 88); ctx.fillRect(xs - g * scale, 206, 2 * g * scale, 88); } void xa; }
        } else { for (let i = 0; i <= 10; i++) { ctx.strokeStyle = A.alpha(C('accent2'), 0.4); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 + i / 10 * scale, 108); ctx.lineTo(x0 + i / 10 * Lout * scale, 206); ctx.stroke(); } }
      },
    });
    const tip = tipBox(host);
    function update() {
      const vari = st.mode === 'vari', f = F(), r = ratio();
      const risk = vari ? 0 : Math.abs(Math.log2(f)) * (0.8 + st.grain / 90) + (st.grain < 25 ? 0.5 : 0) + (st.grain > 110 ? 0.3 : 0);
      const lv = risk < 0.25 ? 0 : risk < 0.9 ? 1 : 2;
      stats(A.statBox('New length', Math.round(outLen() * 100) + ' %', vari ? 'follows the pitch' : 'set independently')
        + A.statBox('New pitch', (st.semis > 0 ? '+' : '') + st.semis + ' semitones', 'frequency × ' + fmt(r, 2))
        + A.statBox(vari ? 'Playback speed' : 'Material re-used', vari ? '× ' + fmt(r, 2) : f >= 1 ? 'each moment read ' + fmt(f, 2) + '×' : Math.round((1 - f) * 100) + ' % skipped', vari ? 'one control changes both' : 'by overlapping grains')
        + A.statBox('Artefact risk', ['Low', 'Moderate', 'High'][lv], vari ? 'no grains, no smear' : '', ['good', 'warn', 'bad'][lv]));
      const tips = [];
      if (vari) { tips.push('Varispeed simply plays the recording faster or slower, so pitch and length always move together — and the tone colour (formants) shifts too: up makes “chipmunk”, down makes “giant”.'); if (st.semis === 0) tips.push('Move the pitch slider: the length changes with it. The length slider is ignored in this mode.'); }
      else {
        if (f > 1.3 && st.grain > 70) tips.push('Long grains repeated to fill extra time make each drum hit stutter or “double”. Shorter grains, or a transient-aware method, fix this.');
        if (st.grain < 25) tips.push('Grains shorter than a cycle or two of the lowest note chop the bass into a rough buzz. Low material needs longer grains.');
        if (Math.abs(st.semis) > 5) tips.push('Large pitch shifts move the formants with the notes, so voices sound unnatural. Formant-preserving shifters correct the tone colour separately.');
        if (lv === 0) tips.push('Small changes of a few per cent are usually invisible — this is how timing is tightened and tempo matched every day.');
        tips.push('More advanced stretchers work on the spectrum instead of raw grains. They keep pitch steady but can smear transients and sound “phasey”.');
      }
      tip(tips, lv === 2 ? 'warn' : 'mentor'); play.refresh();
    }
    update();
  };

  /* ======================================================================
     15. Vocoder demo
     ====================================================================== */
  V.vocoderDemo = function (host) {
    const VOW = [['a', 730, 1090, 2440], ['e', 530, 1840, 2480], ['i', 270, 2290, 3010], ['o', 570, 840, 2410], ['u', 300, 870, 2240]];
    const st = A.controls(host, [
      { key: 'bands', label: 'Number of bands', type: 'range', min: 3, max: 24, step: 1, value: 12 },
      { key: 'carrier', label: 'Carrier sound', type: 'select', value: 'chord', options: [['chord', 'Bright synth chord'], ['note', 'Single buzzing note'], ['noise', 'Noise (whisper)']] },
    ], update);
    const centres = () => { const c = []; for (let i = 0; i < st.bands; i++) c.push(120 * Math.pow(6000 / 120, (i + 0.5) / st.bands)); return c; };
    const envAt = (f, tt) => { const seg = tt / 0.5, i = Math.floor(seg) % 5, fr = seg - Math.floor(seg), a = VOW[i], b = VOW[(i + 1) % 5], m = fr < 0.7 ? 0 : (fr - 0.7) / 0.3; let v = 0; for (let k = 1; k <= 3; k++) { const fk = a[k] + (b[k] - a[k]) * m, bw = 90 + fk * 0.06; v += (k === 1 ? 1 : k === 2 ? 0.7 : 0.4) / (1 + ((f - fk) / bw) ** 2); } return v; };
    const cache = {}; let modBuf = null;
    function mod() {
      if (modBuf) return modBuf; const n = SR * 3, out = new Float32Array(n);
      VOW.forEach(([, f1, f2, f3], vi) => { const seg = new Float32Array(SR / 2); let ph = 0; for (let i = 0; i < seg.length; i++) { const f0 = 118 + 10 * Math.sin(i / SR * 9) + vi * 3; ph += f0 / SR; if (ph >= 1) { ph -= 1; seg[i] = 1; } } let v = new Float32Array(seg.length); [[f1, 1], [f2, 0.6], [f3, 0.35]].forEach(([f, g]) => { const y = bqRun(bq('bandpass', f, 9), seg); for (let i = 0; i < y.length; i++) v[i] += y[i] * g; }); for (let i = 0; i < v.length; i++) { const tt = i / SR; out[vi * SR / 2 + i] = v[i] * Math.min(1, tt / 0.03) * Math.min(1, (0.5 - tt) / 0.1); } });
      const p = peakOf(out); for (let i = 0; i < n; i++) out[i] *= 0.5 / p; return (modBuf = out);
    }
    function carrier() { const n = SR * 3, c = new Float32Array(n); if (st.carrier === 'noise') { const w = whiteArr(); for (let i = 0; i < n; i++) c[i] = w[i] * 0.5; return c; } const fs = st.carrier === 'chord' ? [110, 138.6, 164.8, 220] : [110]; for (const f of fs) { let ph = Math.random(); const inc = f / SR; for (let i = 0; i < n; i++) { ph += inc; if (ph >= 1) ph -= 1; c[i] += (2 * ph - 1) / fs.length; } } return bqRun(bq('lowpass', 9000, 0.7), c); }
    function vocode() {
      const key = st.bands + st.carrier; if (cache[key]) return cache[key];
      const m = mod(), c = carrier(), n = m.length, y = new Float32Array(n), cs = centres(), r = Math.pow(6000 / 120, 1 / st.bands), Q = clamp(Math.sqrt(r) / (r - 1), 0.7, 14), k = Math.exp(-1 / (0.012 * SR));
      for (const f of cs) { const cf = bq('bandpass', f, Q), mb = bqRun(cf, m), cb = bqRun(cf, c); let e = 0; for (let i = 0; i < n; i++) { const a = Math.abs(mb[i]); e = a + (e - a) * k; y[i] += cb[i] * e; } }
      const p = peakOf(y) || 1; for (let i = 0; i < n; i++) y[i] *= 0.25 / p; return (cache[key] = y);
    }
    const play = player(host, [['mod', 'The voice (modulator)'], ['car', 'The carrier alone'], ['voc', 'Vocoded result']], (id) => (id === 'mod' ? scaled(mod(), 0.5) : id === 'car' ? scaled(carrier(), 0.22) : vocode()));
    const stats = statRow(host);
    A.canvas(host, {
      height: 360, animate: true,
      caption: 'Top: the voice spectrum, with its moving formant peaks. Middle: the level measured in each band. Bottom: the carrier, turned up and down band by band so it wears the shape of the voice.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t);
        const x0 = 40, x1 = w - 10, X = (f) => x0 + Math.log(f / 120) / Math.log(6000 / 120) * (x1 - x0), cs = centres(), r = Math.pow(6000 / 120, 1 / st.bands), vi = Math.floor(t / 0.5) % 5;
        const rowY = [18, 138, 248], rh = 96;
        ['voice', 'bands', 'output'].forEach((l, i) => { ctx.fillStyle = C('panel2'); ctx.fillRect(x0, rowY[i], x1 - x0, rh); ctx.save(); ctx.translate(14, rowY[i] + rh / 2); ctx.rotate(-Math.PI / 2); A.text(ctx, l, 0, 0, { size: 11, align: 'center', color: C('muted') }); ctx.restore(); });
        ctx.strokeStyle = C('accent2'); ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 200; i++) { const f = 120 * Math.pow(50, i / 200), y = rowY[0] + rh - 6 - clamp(envAt(f, t), 0, 1.1) * (rh - 14); i ? ctx.lineTo(X(f), y) : ctx.moveTo(X(f), y); } ctx.stroke();
        A.text(ctx, 'vowel “' + VOW[vi][0] + '”', x1 - 6, rowY[0] + 14, { size: 12, weight: 700, align: 'right' });
        const lv = cs.map((f) => { let s = 0; for (let j = 0; j < 5; j++) s += envAt(f * Math.pow(r, (j - 2) / 5), t); return clamp(s / 5, 0, 1.1); });
        cs.forEach((f, i) => { const a = X(f / Math.sqrt(r)), b = X(f * Math.sqrt(r)), bh = lv[i] * (rh - 12); ctx.fillStyle = A.alpha(C('accent'), 0.75); ctx.fillRect(a + 1, rowY[1] + rh - 4 - bh, Math.max(1, b - a - 2), bh); });
        const f0 = 110; ctx.lineWidth = Math.max(1, Math.min(2.5, (x1 - x0) / 220));
        if (st.carrier === 'noise') { ctx.fillStyle = A.alpha(C('c3'), 0.7); cs.forEach((f, i) => { const a = X(f / Math.sqrt(r)), b = X(f * Math.sqrt(r)), bh = lv[i] * (rh - 12); ctx.fillRect(a, rowY[2] + rh - 4 - bh, b - a, bh); }); }
        else for (let k = 2; k * f0 < 6000; k += st.carrier === 'chord' ? 0.5 : 1) { const f = k * f0; if (f < 120) continue; const bi = clamp(Math.floor(Math.log(f / 120) / Math.log(r)), 0, st.bands - 1), bh = lv[bi] * (rh - 12); ctx.strokeStyle = C('c3'); ctx.beginPath(); ctx.moveTo(X(f), rowY[2] + rh - 4); ctx.lineTo(X(f), rowY[2] + rh - 4 - bh); ctx.stroke(); }
        [200, 500, 1000, 2000, 5000].forEach((f) => A.text(ctx, A.shortHz(f), X(f), h - 4, { size: 10, align: 'center', color: C('muted') }));
      },
    });
    const tip = tipBox(host);
    function update() {
      const r = Math.pow(6000 / 120, 1 / st.bands), lv = st.bands < 6 ? 0 : st.bands < 11 ? 1 : 2;
      stats(A.statBox('Width of each band', fmt(Math.log2(r) * 12, 1) + ' semitones', fmt(Math.log2(r), 2) + ' octave')
        + A.statBox('Can you tell the vowels apart?', ['Barely', 'Mostly', 'Clearly'][lv], st.bands + ' bands across 120 Hz – 6 kHz', ['bad', 'warn', 'good'][lv])
        + A.statBox('Pitch comes from', 'the carrier', 'the voice gives only the “shape”'));
      const tips = [];
      if (st.bands < 6) tips.push('With so few bands, two formants often fall in the same band. The words blur into a vague “wah-wah”.');
      else if (st.bands >= 16) tips.push('Many narrow bands follow the voice closely: speech becomes clear, at the cost of a slightly more natural, less “robotic” character.');
      tips.push({ chord: 'A bright, harmonically rich chord is the classic choice: there is energy in every band for the voice to shape.', note: 'A single note gives the monotone “robot voice”. Play a melody on the carrier and the robot sings.', noise: 'Noise has no pitch at all, so the result is an intelligible whisper — proof that the words live in the spectral shape, not the pitch.' }[st.carrier]);
      tips.push('A dull carrier (a sine or a filtered pad) gives the voice nothing to shape in the upper bands, so consonants vanish. Add brightness or mix in a little noise.');
      tip(tips); play.refresh();
    }
    update();
  };

  /* ======================================================================
     16. Saturation shapes
     ====================================================================== */
  V.saturationShapes = function (host) {
    const st = A.controls(host, [
      { key: 'shape', label: 'Curve', type: 'select', value: 'tape', options: [['tape', 'Soft, symmetrical (tape-like)'], ['tube', 'Soft, lopsided (valve-like)'], ['hard', 'Hard clip'], ['fold', 'Fold-back'], ['crush', 'Bit-crush']] },
      { key: 'drive', label: 'Drive', type: 'range', min: 0, max: 36, step: 1, value: 12, unit: 'dB' },
      { key: 'mix', label: 'Mix (dry ↔ processed)', type: 'range', min: 0, max: 1, step: 0.05, value: 1 },
    ], update);
    const bitsOf = () => clamp(Math.round(8 - st.drive / 6), 2, 8);
    const shape = (x) => { switch (st.shape) { case 'tube': return (Math.tanh(x + 0.35) - Math.tanh(0.35)) * 1.12; case 'hard': return clamp(x, -1, 1); case 'fold': { const p = ((x + 1) % 4 + 4) % 4; return p < 2 ? p - 1 : 3 - p; } case 'crush': { const L = Math.pow(2, bitsOf() - 1); return Math.round(clamp(x, -1, 1) * L) / L; } default: return Math.tanh(x); } };
    const gIn = () => (st.shape === 'crush' ? 0.9 : 0.35 * lin(st.drive));
    let M = { h: [] };
    const play = player(host, [['clean', 'Clean'], ['proc', 'Processed']], (id) => {
      const x = scaled(music().subarray(0, SR * 2), 0.7); if (id === 'clean') return scaled(x, 0.5 / 0.7);
      const y = new Float32Array(x.length), hold = st.shape === 'crush' ? 1 + Math.floor(st.drive / 6) : 1; let hv = 0;
      for (let i = 0; i < x.length; i++) { if (i % hold === 0) hv = x[i]; const s = st.shape === 'crush' ? hv / 0.35 * 0.9 : x[i] / 0.35 * gIn(); y[i] = st.mix * shape(s) * 0.35 + (1 - st.mix) * x[i]; }
      const g = rms(x) / Math.max(rms(y), 1e-6); return scaled(y, Math.min(g, 3) * 0.5 / 0.7);
    });
    const stats = statRow(host);
    A.canvas(host, {
      height: 350, animate: true,
      caption: 'Left: the curve that maps input to output, with the signal riding along it. Right: a sine wave before (dashed) and after. Bottom: the harmonics the curve creates.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t);
        const lw = Math.min(w * 0.42, 200), ph = 170, cx = 8 + lw / 2, cy = 10 + ph / 2, g = gIn(), rangeX = Math.max(1.5, Math.min(g * 1.1, 6)), sx = (lw - 14) / 2 / rangeX, sy = (ph - 20) / 2 / 1.2;
        ctx.strokeStyle = C('line'); ctx.lineWidth = 1; ctx.strokeRect(8.5, 10.5, lw, ph); ctx.beginPath(); ctx.moveTo(8, cy); ctx.lineTo(8 + lw, cy); ctx.moveTo(cx, 10); ctx.lineTo(cx, 10 + ph); ctx.stroke();
        ctx.strokeStyle = C('accent'); ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 160; i++) { const x = -rangeX + 2 * rangeX * i / 160, y = shape(x); const px = cx + x * sx, py = cy - y * sy; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
        const xi = Math.min(g, rangeX) * Math.sin(t * 2.5); ctx.fillStyle = A.alpha(C('accent2'), 0.2); ctx.fillRect(cx - Math.min(g, rangeX) * sx, 10, 2 * Math.min(g, rangeX) * sx, ph); ctx.fillStyle = C('accent2'); ctx.beginPath(); ctx.arc(cx + xi * sx, cy - shape(xi) * sy, 5, 0, TAU); ctx.fill();
        const wx = lw + 22, ww = w - wx - 8; ctx.strokeStyle = C('line'); ctx.lineWidth = 1; ctx.strokeRect(wx + 0.5, 10.5, ww, ph);
        ctx.strokeStyle = C('muted'); ctx.setLineDash([4, 4]); ctx.beginPath(); for (let i = 0; i <= 200; i++) { const px = wx + ww * i / 200, py = cy - Math.sin(TAU * 2 * i / 200) * sy * 0.9; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = C('accent'); ctx.lineWidth = 2.2; ctx.beginPath(); const hold = st.shape === 'crush' ? 1 + Math.floor(st.drive / 6) * 2 : 1; let hv = 0; for (let i = 0; i <= 200; i++) { if (i % hold === 0) hv = Math.sin(TAU * 2 * i / 200); const s = st.shape === 'crush' ? hv * 0.9 : Math.sin(TAU * 2 * i / 200) * g; const v = st.mix * shape(s) + (1 - st.mix) * Math.sin(TAU * 2 * i / 200) * 0.9; const px = wx + ww * i / 200, py = cy - clamp(v, -1.25, 1.25) * sy * 0.9; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
        const y1 = ph + 34, y0 = h - 22, bw = (w - 16) / 10; ctx.fillStyle = C('panel2'); ctx.fillRect(8, y1, w - 16, y0 - y1);
        M.h.forEach((v, k) => { const d = clamp(dB(v / Math.max(M.h[0], 1e-9)), -70, 0), bh = (d + 70) / 70 * (y0 - y1 - 14); ctx.fillStyle = k === 0 ? C('muted') : k % 2 ? C('warn') : C('c3'); ctx.fillRect(8 + k * bw + bw * 0.22, y0 - bh, bw * 0.56, bh); A.text(ctx, k === 0 ? 'f' : (k + 1) + 'f', 8 + k * bw + bw / 2, h - 8, { size: 10, align: 'center', color: C('muted') }); if (k && d > -66) A.text(ctx, String(Math.round(d)), 8 + k * bw + bw / 2, y0 - bh - 3, { size: 9, align: 'center', color: C('muted') }); });
        A.text(ctx, 'harmonics, dB re. fundamental — even ones and odd ones are shaded differently', 12, y1 - 6, { size: 10, color: C('muted') });
      },
    });
    const tip = tipBox(host);
    function update() {
      const g = gIn(), f = (x) => st.mix * shape(x) + (1 - st.mix) * x / Math.max(g, 1e-6) * 0.9; M.h = harmonicsOf(f, g, 10);
      const thd = thdOf(M.h) * 100; let ev = 0, od = 0; M.h.forEach((v, k) => { if (k) (k % 2 ? (ev += v * v) : (od += v * v)); });
      const bal = ev + od < 1e-8 ? 'none yet' : ev > od * 0.5 ? (od > ev * 0.5 ? 'even and odd' : 'mostly even') : 'odd only';
      stats(A.statBox('Distortion (THD)', fmt(thd, thd < 10 ? 1 : 0) + ' %', thd < 1 ? 'inaudible' : thd < 5 ? 'warmth' : thd < 25 ? 'obvious colour' : 'heavy')
        + A.statBox('Harmonics added', bal, bal === 'odd only' ? 'hollow, edgy' : bal === 'mostly even' ? 'octave-like, sweet' : '')
        + A.statBox(st.shape === 'crush' ? 'Word length' : 'Peak level squeezed', st.shape === 'crush' ? bitsOf() + ' bits' : fmt(Math.max(0, dB(g) - dB(Math.abs(shape(g)) + 1e-6)), 1) + ' dB', st.shape === 'crush' ? 'and a lower sample rate' : 'saturation also compresses'));
      const tips = [];
      tips.push({ tape: 'A smooth S-curve that treats positive and negative halves alike: only odd harmonics, arriving gradually. The gentlest way to add density.', tube: 'A lopsided curve bends one half of the wave more than the other, which adds even harmonics — the 2nd is an octave above, so it blends in sweetly.', hard: 'Nothing happens until the wave hits the ceiling, then it is sliced flat: a spray of strong high odd harmonics. Harsh and buzzy.', fold: 'Instead of flattening, the peak is folded back down. More drive adds more folds and wildly changing, synth-like harmonics.', crush: 'The curve becomes a staircase and the samples are held: gritty quantising noise plus non-musical alias tones — the sound of early digital gear.' }[st.shape]);
      if (st.shape !== 'crush' && st.drive > 24) tips.push('At this drive almost any curve ends up as a square wave. Chords turn to mud because every pair of notes creates sum and difference tones.');
      if (st.mix < 1 && st.mix > 0) tips.push('Blending the dry signal back in keeps the transients and clarity while the processed part adds thickness — parallel saturation.');
      tips.push('Distortion makes things louder. Always level-match before judging, or “more” will simply win.');
      tip(tips);  play.refresh();
    }
    update();
  };
})();
