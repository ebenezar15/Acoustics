/* ==========================================================================
   Acoustica physics library — pure functions, no DOM.
   Works in the browser (window.P) and in Node (module.exports) for tests.
   Units: SI unless stated (m, kg, s, Hz, Pa). Levels in dB.
   ========================================================================== */
(function (root) {
  'use strict';
  const P = {};
  const log10 = Math.log10, sqrt = Math.sqrt, PI = Math.PI;

  P.RHO = 1.21;          // air density kg/m³ (20 °C)
  P.C = 343;             // speed of sound m/s (20 °C)
  P.NU = 1.5e-5;         // kinematic viscosity of air m²/s
  P.P0 = 20e-6;          // reference pressure Pa
  P.OCT = [63, 125, 250, 500, 1000, 2000, 4000, 8000];
  P.BANDS6 = [125, 250, 500, 1000, 2000, 4000];
  P.THIRDS = [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000];
  P.STC_BANDS = [125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000];
  P.RW_BANDS = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];
  P.exactThird = (nominal) => 1000 * Math.pow(2, Math.round(3 * Math.log2(nominal / 1000)) / 3);

  /* ---------------- basics ---------------- */
  P.speedOfSound = (tC = 20) => 331.3 * sqrt(1 + tC / 273.15);
  P.wavelength = (f, c = P.C) => c / f;
  P.period = (f) => 1 / f;
  P.splFromPa = (p) => 20 * log10(p / P.P0);
  P.paFromSpl = (L) => P.P0 * Math.pow(10, L / 20);
  P.dbSum = (arr) => 10 * log10(arr.reduce((s, L) => s + Math.pow(10, L / 10), 0));
  P.dbAvg = (arr) => P.dbSum(arr) - 10 * log10(arr.length);
  /** subtract background: total minus background */
  P.dbSubtract = (total, bg) => (total > bg ? 10 * log10(Math.pow(10, total / 10) - Math.pow(10, bg / 10)) : -Infinity);
  P.distanceLoss = (r1, r2, type = 'point') => (type === 'line' ? 10 : 20) * log10(r2 / r1);
  P.loudnessRatio = (dL) => Math.pow(2, dL / 10);           // sones rule of thumb
  P.powerRatio = (dL) => Math.pow(10, dL / 10);
  P.pressureRatio = (dL) => Math.pow(10, dL / 20);
  P.speakerSpl = (sens, watts, r, nSpeakers = 1) => sens + 10 * log10(watts) - 20 * log10(Math.max(r, 0.1)) + 10 * log10(nSpeakers);
  P.delayFromDistance = (d, c = P.C) => d / c;                 // s
  P.phaseShift = (f, dt) => ((360 * f * dt) % 360 + 360) % 360;
  P.A_WEIGHT = { 31.5: -39.4, 63: -26.2, 125: -16.1, 250: -8.6, 500: -3.2, 1000: 0, 2000: 1.2, 4000: 1.0, 8000: -1.1 };
  P.C_WEIGHT = { 31.5: -3.0, 63: -0.8, 125: -0.2, 250: 0, 500: 0, 1000: 0, 2000: -0.2, 4000: -0.8, 8000: -3.0 };
  /** continuous A-weighting (IEC 61672) */
  P.aWeight = function (f) {
    const f2 = f * f;
    const ra = (Math.pow(12194, 2) * f2 * f2) / ((f2 + 20.6 * 20.6) * sqrt((f2 + 107.7 * 107.7) * (f2 + 737.9 * 737.9)) * (f2 + 12194 * 12194));
    return 20 * log10(ra) + 2.0;
  };
  P.dBA = (octLevels, bands = P.OCT) => P.dbSum(bands.map((f, i) => octLevels[i] + (P.A_WEIGHT[f] || 0)));

  /** hearing-exposure time allowed (hours) */
  P.niosh = (LA) => 8 / Math.pow(2, (LA - 85) / 3);
  P.osha = (LA) => 8 / Math.pow(2, (LA - 90) / 5);

  /* ---------------- complex arithmetic ---------------- */
  const Cx = (re, im = 0) => ({ re, im });
  const cadd = (a, b) => Cx(a.re + b.re, a.im + b.im);
  const csub = (a, b) => Cx(a.re - b.re, a.im - b.im);
  const cmul = (a, b) => Cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return Cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const cabs = (a) => Math.hypot(a.re, a.im);
  const cexp = (a) => { const e = Math.exp(a.re); return Cx(e * Math.cos(a.im), e * Math.sin(a.im)); };
  const cscale = (a, s) => Cx(a.re * s, a.im * s);
  // tan / cot of complex argument
  function ctan(z) {
    // tan(x+iy) = (sin2x + i sinh2y)/(cos2x + cosh2y)
    const x2 = 2 * z.re, y2 = 2 * z.im;
    if (Math.abs(y2) > 40) return Cx(0, Math.sign(y2));
    const d = Math.cos(x2) + Math.cosh(y2);
    return Cx(Math.sin(x2) / d, Math.sinh(y2) / d);
  }
  const ccot = (z) => cdiv(Cx(1), ctan(z));
  P.complex = { Cx, cadd, csub, cmul, cdiv, cabs, cexp, ctan, ccot, cscale };

  /* ---------------- room modes ---------------- */
  P.roomModes = function (L, W, H, fmax = 300, c = P.C) {
    const out = [];
    const nx = Math.ceil((2 * L * fmax) / c), ny = Math.ceil((2 * W * fmax) / c), nz = Math.ceil((2 * H * fmax) / c);
    for (let i = 0; i <= nx; i++)
      for (let j = 0; j <= ny; j++)
        for (let k = 0; k <= nz; k++) {
          if (!i && !j && !k) continue;
          const f = (c / 2) * sqrt((i / L) ** 2 + (j / W) ** 2 + (k / H) ** 2);
          if (f > fmax) continue;
          const zeros = (i === 0) + (j === 0) + (k === 0);
          const type = zeros === 2 ? 'axial' : zeros === 1 ? 'tangential' : 'oblique';
          out.push({ f, n: [i, j, k], type });
        }
    return out.sort((a, b) => a.f - b.f);
  };
  P.schroeder = (T60, V) => 2000 * sqrt(T60 / V);
  P.modeDensity = (f, V, c = P.C) => (4 * PI * V * f * f) / (c * c * c); // modes per Hz
  /** Bolt-area test (EBU/IEC rule of thumb on ratios normalised to height) */
  P.boltOK = function (L, W, H) {
    const dims = [L, W, H].sort((a, b) => a - b);
    const h = dims[0], w = dims[1], l = dims[2];
    const lw = l / h, ww = w / h;
    return lw >= 1.1 * ww && lw <= 4.5 * ww - 4 && lw < 3 && ww < 3;
  };
  P.thirdBandOf = function (f) {
    return P.THIRDS.findIndex((fc) => f >= fc / Math.pow(2, 1 / 6) && f < fc * Math.pow(2, 1 / 6));
  };
  /** Bonello criterion: modes per 1/3 octave should not decrease; coincident modes need ≥5 in band */
  P.bonello = function (modes) {
    const counts = P.THIRDS.map(() => 0);
    const lists = P.THIRDS.map(() => []);
    modes.forEach((m) => { const b = P.thirdBandOf(m.f); if (b >= 0) { counts[b]++; lists[b].push(m.f); } });
    const issues = [];
    for (let i = 1; i < counts.length; i++) {
      if (P.THIRDS[i] > 200) break;
      if (counts[i] < counts[i - 1]) issues.push({ band: P.THIRDS[i], type: 'decrease', msg: `Mode count drops at ${P.THIRDS[i]} Hz (${counts[i - 1]} → ${counts[i]})` });
    }
    lists.forEach((l, i) => {
      if (P.THIRDS[i] > 200) return;
      if (l.length < 5) for (let a = 0; a < l.length; a++) for (let b = a + 1; b < l.length; b++)
        if (Math.abs(l[a] - l[b]) < 0.5) issues.push({ band: P.THIRDS[i], type: 'coincident', msg: `Coincident modes near ${l[a].toFixed(1)} Hz` });
    });
    return { counts, issues };
  };
  /** spacing gaps between axial+tangential modes below fmax */
  P.modeGaps = function (modes, fmax = 200, minGap = 20) {
    const fs = modes.filter((m) => m.type !== 'oblique' && m.f <= fmax).map((m) => m.f);
    const gaps = [];
    for (let i = 1; i < fs.length; i++) if (fs[i] - fs[i - 1] > minGap) gaps.push([fs[i - 1], fs[i]]);
    return gaps;
  };
  /**
   * Predicted low-frequency pressure response at receiver from a point source,
   * by modal summation (rigid rectangular room, uniform damping from T60).
   * src, rcv: [x,y,z] in metres. Returns array of {f, db}.
   */
  P.modalResponse = function (L, W, H, src, rcv, T60 = 0.4, fmin = 15, fmax = 300, nPts = 300, c = P.C) {
    const modes = P.roomModes(L, W, H, fmax * 1.6, c);
    modes.unshift({ f: 0, n: [0, 0, 0], type: 'zero' });
    const delta = 6.91 / Math.max(T60, 0.05);
    const terms = modes.map((m) => {
      const [i, j, k] = m.n;
      const eps = (i ? 2 : 1) * (j ? 2 : 1) * (k ? 2 : 1);
      const psi = (r) => Math.cos((i * PI * r[0]) / L) * Math.cos((j * PI * r[1]) / W) * Math.cos((k * PI * r[2]) / H);
      const srcs = Array.isArray(src[0]) ? src : [src];
      return { w: 2 * PI * m.f, a: eps * srcs.reduce((s, q) => s + psi(q), 0) * psi(rcv) };
    });
    const out = [];
    for (let s = 0; s < nPts; s++) {
      const f = fmin * Math.pow(fmax / fmin, s / (nPts - 1));
      const w = 2 * PI * f;
      let re = 0, im = 0;
      for (const t of terms) {
        const dr = t.w * t.w - w * w, di = 2 * delta * w;
        const d = dr * dr + di * di;
        re += (t.a * dr) / d; im += (-t.a * di) / d;
      }
      // constant volume-acceleration source (a loudspeaker with flat anechoic response): p ∝ Σ
      const mag = Math.hypot(re, im);
      out.push({ f, db: 20 * log10(mag + 1e-30) });
    }
    // normalise so the median above 120 Hz sits at 0 dB
    const ref = out.filter((p) => p.f > Math.min(120, fmax * 0.6)).map((p) => p.db).sort((a, b) => a - b);
    const med = ref.length ? ref[Math.floor(ref.length / 2)] : 0;
    out.forEach((p) => (p.db -= med));
    return out;
  };
  /** standing-wave pressure for one mode at a point (−1…1) */
  P.modeShape = (n, dims, r) => n.reduce((acc, ni, i) => acc * Math.cos((ni * PI * r[i]) / dims[i]), 1);

  /* ---------------- reverberation ---------------- */
  // air attenuation m (1/m, energy) at 20 °C, ~50 % RH
  P.AIR_M = { 63: 0.00005, 125: 0.0001, 250: 0.0003, 500: 0.0006, 1000: 0.001, 2000: 0.0024, 4000: 0.0072, 8000: 0.021 };
  P.sabine = (V, A) => (0.161 * V) / Math.max(A, 1e-9);
  P.eyring = function (V, S, alphaBar, m = 0) {
    const a = Math.min(alphaBar, 0.999);
    return (0.161 * V) / (-S * Math.log(1 - a) + 4 * m * V);
  };
  P.sabineWithAir = (V, A, m = 0) => (0.161 * V) / (A + 4 * m * V);
  P.absorptionNeeded = (V, Ttarget) => (0.161 * V) / Ttarget;   // total Sabins (m²)
  P.criticalDistance = (V, T60, Q = 2) => 0.057 * sqrt((Q * V) / T60);
  P.roomConstant = (S, alphaBar) => (S * alphaBar) / (1 - alphaBar);
  /** level vs distance in a room (direct + reverberant), relative to Lw */
  P.roomLevel = (Lw, r, Q, R) => Lw + 10 * log10(Q / (4 * PI * r * r) + 4 / R);
  /** Stephens & Bate optimum mid-frequency RT; r = 4 speech, 5 orchestra, 6 organ/choir */
  P.stephensBate = (V, r = 5) => r * (0.012 * Math.cbrt(V) + 0.107);
  /** EBU Tech 3276 nominal control-room RT */
  P.ebuTm = (V) => 0.25 * Math.cbrt(V / 100);
  P.meanFreePath = (V, S) => (4 * V) / S;

  /* ---------------- porous absorption (Miki model) ---------------- */
  /** characteristic impedance & wavenumber of a porous material with flow resistivity sigma (Pa·s/m²) */
  P.miki = function (f, sigma) {
    const X = f / sigma;
    const w = 2 * PI * f;
    const Zc = Cx(P.RHO * P.C * (1 + 0.07 * Math.pow(X, -0.632)), -P.RHO * P.C * 0.107 * Math.pow(X, -0.632));
    const k = Cx((w / P.C) * (1 + 0.109 * Math.pow(X, -0.618)), -(w / P.C) * 0.16 * Math.pow(X, -0.618));
    return { Zc, k };
  };
  /** impedance looking into a layer (Zc,k,thickness) terminated by load impedance ZL (null = rigid) */
  function layerImpedance(Zc, k, d, ZL) {
    const kd = cscale(k, d);
    if (!ZL) return cmul(Cx(0, -1), cmul(Zc, ccot(kd)));
    const t = ctan(kd);
    const j = Cx(0, 1);
    return cmul(Zc, cdiv(cadd(ZL, cmul(j, cmul(Zc, t))), cadd(Zc, cmul(j, cmul(ZL, t)))));
  }
  const airGap = (f, D) => {
    if (!(D > 0)) return null;
    const k = Cx((2 * PI * f) / P.C, 0);
    return layerImpedance(Cx(P.RHO * P.C), k, D, null);
  };
  /** absorption coefficient from surface impedance; random = Paris statistical average */
  P.alphaFromZ = function (Zs, random = true) {
    const z0 = P.RHO * P.C;
    const a = (cos) => {
      const zc = cscale(Zs, cos);
      const R = cdiv(csub(zc, Cx(z0)), cadd(zc, Cx(z0)));
      const r = cabs(R);
      return 1 - r * r;
    };
    if (!random) return a(1);
    let s = 0;
    const N = 45;
    for (let i = 0; i < N; i++) {
      const th = ((i + 0.5) / N) * (PI / 2);
      s += a(Math.cos(th)) * Math.sin(2 * th);
    }
    return s * (PI / 2 / N);
  };
  /** porous absorber of thickness d (m) over air gap D (m) on rigid wall */
  P.porousAlpha = function (f, sigma, d, D = 0, random = true) {
    const { Zc, k } = P.miki(f, sigma);
    const Zs = layerImpedance(Zc, k, d, airGap(f, D));
    return P.alphaFromZ(Zs, random);
  };
  /** cavity impedance: air, or porous-filled (fully) */
  function cavityZ(f, D, fillSigma) {
    if (fillSigma) { const { Zc, k } = P.miki(f, fillSigma); return layerImpedance(Zc, k, D, null); }
    return airGap(f, D);
  }
  /** perforated / slotted panel (Helmholtz) absorber */
  P.perforatedAlpha = function (f, o) {
    // o: {t, holeD, open (fraction), D, fillSigma, slot:boolean, slotW, fabricR}
    const w = 2 * PI * f;
    const eps = Math.max(o.open, 1e-4);
    const a = (o.slot ? o.slotW : o.holeD) / 2;
    let delta;
    if (o.slot) delta = (2 * o.slotW / PI) * Math.log(1 / Math.sin((PI * eps) / 2)); // Smits & Kosten (both ends)
    else delta = 2 * 0.85 * a * (1 - 1.47 * sqrt(eps) + 0.47 * Math.pow(eps, 1.5)); // Fok-corrected, both ends
    const tEff = o.t + delta;
    const Rv = (P.RHO / eps) * sqrt(8 * P.NU * w) * (1 + o.t / (2 * a));
    const Rf = (o.fabricR || 0) / eps;
    const Zp = Cx(Rv + Rf, (w * P.RHO * tEff) / eps);
    const Zs = cadd(Zp, cavityZ(f, o.D, o.fillSigma));
    return P.alphaFromZ(Zs, true);
  };
  P.perforatedF0 = function (o) {
    const eps = Math.max(o.open, 1e-4);
    const a = (o.slot ? o.slotW : o.holeD) / 2;
    const delta = o.slot ? (2 * o.slotW / PI) * Math.log(1 / Math.sin((PI * eps) / 2)) : 2 * 0.85 * a * (1 - 1.47 * sqrt(eps) + 0.47 * Math.pow(eps, 1.5));
    return (P.C / (2 * PI)) * sqrt(eps / ((o.t + delta) * o.D));
  };
  P.holeOpenArea = (d, spacing, pattern = 'square') => (pattern === 'triangular' ? (PI * d * d) / (2 * sqrt(3) * spacing * spacing) : (PI * d * d) / (4 * spacing * spacing));
  P.slotOpenArea = (slotW, boardW) => slotW / (slotW + boardW);
  /** membrane (panel) absorber */
  P.membraneF0 = (m, D, filled = true) => (filled ? 50 : 60) / sqrt(m * D);
  P.membraneAlpha = function (f, o) {
    // o: {m (kg/m²), D, fillSigma, r (panel loss, in units of rho c)}
    const w = 2 * PI * f;
    const Zp = Cx((o.r || 0.15) * P.RHO * P.C, w * o.m);
    const Zs = cadd(Zp, cavityZ(f, o.D, o.fillSigma));
    return P.alphaFromZ(Zs, true);
  };
  /** single Helmholtz resonator (bottle) */
  P.helmholtzF0 = (neckArea, neckLen, volume, neckRadius) => (P.C / (2 * PI)) * sqrt(neckArea / (volume * (neckLen + 1.7 * neckRadius)));
  /** Quarter-wave guidance: thickness at which porous layer reaches λ/4 */
  P.quarterWaveF = (depth) => P.C / (4 * depth);

  /* ---------------- diffusers ---------------- */
  P.isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  P.primitiveRoots = function (p) {
    const out = [];
    for (let g = 2; g < p; g++) {
      const seen = new Set(); let x = 1;
      for (let i = 1; i < p; i++) { x = (x * g) % p; seen.add(x); }
      if (seen.size === p - 1) out.push(g);
    }
    return out;
  };
  P.qrdSequence = (N) => Array.from({ length: N }, (_, n) => (n * n) % N);
  P.prdSequence = (N, g) => Array.from({ length: N - 1 }, (_, i) => { let x = 1; for (let k = 0; k <= i; k++) x = (x * g) % N; return x; });
  P.skylineGrid = (N) => Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => (i * i + j * j) % N));
  /** depth of each well for design frequency f0 */
  P.wellDepths = (seq, N, f0, c = P.C) => seq.map((s) => (s * c) / (2 * N * f0));
  P.diffuserFmax = (wellW, c = P.C) => c / (2 * wellW);
  /** far-field polar response (normal incidence) for a well sequence (depths m, width m, periods) */
  P.diffuserPolar = function (depths, wellW, f, periods = 3, c = P.C, nAng = 181) {
    const k = (2 * PI * f) / c;
    const N = depths.length * periods;
    const out = [];
    for (let a = 0; a < nAng; a++) {
      const th = -PI / 2 + (a / (nAng - 1)) * PI;
      let re = 0, im = 0;
      for (let n = 0; n < N; n++) {
        const d = depths[n % depths.length];
        const x = (n - N / 2) * wellW;
        const ph = -2 * k * d + k * x * Math.sin(th);
        re += Math.cos(ph); im += Math.sin(ph);
      }
      // element directivity of one well (sinc) × obliquity
      const u = (k * wellW * Math.sin(th)) / 2;
      const el = Math.abs(u) < 1e-6 ? 1 : Math.sin(u) / u;
      out.push({ th, mag: Math.hypot(re, im) * Math.abs(el) * (0.5 + 0.5 * Math.cos(th)) });
    }
    const mx = Math.max(...out.map((o) => o.mag)) || 1;
    out.forEach((o) => (o.db = 20 * log10(o.mag / mx + 1e-6)));
    return out;
  };
  /** diffusion coefficient (AES-4id style auto-correlation of polar levels) */
  P.diffusionCoeff = function (polar) {
    const L = polar.map((p) => Math.pow(10, p.db / 10));
    const s1 = L.reduce((a, b) => a + b, 0), s2 = L.reduce((a, b) => a + b * b, 0), n = L.length;
    return (s1 * s1 - s2) / ((n - 1) * s2);
  };

  /* ---------------- sound insulation ---------------- */
  // panel materials: density kg/m³, Young's modulus Pa, loss factor, Poisson
  P.PANELS = {
    gypsum: { name: 'Gypsum board (drywall)', rho: 750, E: 2.5e9, eta: 0.02, nu: 0.3 },
    gypsumX: { name: 'Gypsum board Type X / dense', rho: 850, E: 2.8e9, eta: 0.02, nu: 0.3 },
    fibreGyp: { name: 'Gypsum-fibre board', rho: 1150, E: 3.8e9, eta: 0.02, nu: 0.3 },
    plywood: { name: 'Plywood', rho: 600, E: 7e9, eta: 0.03, nu: 0.3 },
    osb: { name: 'OSB', rho: 650, E: 4.5e9, eta: 0.03, nu: 0.3 },
    mdf: { name: 'MDF', rho: 750, E: 3.5e9, eta: 0.03, nu: 0.3 },
    cementBoard: { name: 'Cement board', rho: 1150, E: 7e9, eta: 0.015, nu: 0.25 },
    glass: { name: 'Float glass (glazed in frame)', rho: 2500, E: 70e9, eta: 0.02, nu: 0.22, dip: 10 },
    lamGlass: { name: 'Laminated (acoustic) glass', rho: 2500, E: 70e9, eta: 0.12, nu: 0.22, dip: 6 },
    concrete: { name: 'Concrete (dense)', rho: 2300, E: 30e9, eta: 0.008, nu: 0.2, dip: 10 },
    cmu: { name: 'Concrete block (hollow, grouted ~50%)', rho: 1400, E: 12e9, eta: 0.01, nu: 0.2, dip: 10 },
    brick: { name: 'Brick masonry', rho: 1800, E: 15e9, eta: 0.012, nu: 0.2, dip: 10 },
    steel: { name: 'Steel plate', rho: 7850, E: 200e9, eta: 0.001, nu: 0.3 },
    mlv: { name: 'Mass-loaded vinyl (limp)', rho: 1900, E: 5e7, eta: 0.15, nu: 0.4 },
    timber: { name: 'Solid timber', rho: 500, E: 10e9, eta: 0.02, nu: 0.3 },
  };
  P.criticalFreq = function (mat, t, c = P.C) {
    const B = (mat.E * t * t * t) / (12 * (1 - mat.nu * mat.nu));
    const m = mat.rho * t;
    return ((c * c) / (2 * PI)) * sqrt(m / B);
  };
  P.massLaw = (m, f) => 20 * log10(m * f) - 47;          // field-incidence
  P.massLawNormal = (m, f) => 20 * log10(m * f) - 42;
  /**
   * Single leaf TL (Sharp). layers: [{mat, t}] — laminated layers add mass; stiffness taken
   * from the stiffest layer (conservative for screwed layers, which do not act compositely).
   */
  P.leafProps = function (layers, dampingCompound = false) {
    let m = 0, fc = Infinity, eta = 0, dip = 0;
    layers.forEach((L) => {
      const mat = P.PANELS[L.mat]; m += mat.rho * L.t;
      const f = P.criticalFreq(mat, L.t);
      if (f < fc) { fc = f; dip = mat.dip || 18; }
      eta = Math.max(eta, mat.eta);
    });
    if (dampingCompound && layers.length > 1) dip = Math.min(dip, 8);
    if (layers.length > 1) eta = Math.max(eta, 0.03);
    if (dampingCompound && layers.length > 1) eta = Math.max(eta, 0.15);
    return { m, fc, eta, dip };
  };
  P.singleLeafTL = function (leaf, f) {
    const { m, fc } = leaf;
    // total loss factor: internal + edge/coupling losses (EN 12354-1 approximation)
    const eta = leaf.eta + m / (485 * sqrt(f));
    const ml = P.massLaw(m, f);
    if (f < fc / 2) return Math.max(0, ml);
    // Sharp above-coincidence law, with the dip limited to ~10 dB below mass law (observed in practice)
    const above = (ff) => Math.max(20 * log10(m * ff) + 10 * log10((2 * eta * ff) / (PI * fc)) - 47, P.massLaw(m, ff) - (leaf.dip || 18));
    if (f >= fc) return Math.max(0, above(f));
    const a = P.massLaw(m, fc / 2), b = above(fc);
    const t = (log10(f) - log10(fc / 2)) / (log10(fc) - log10(fc / 2));
    return Math.max(0, a + (b - a) * t);
  };
  // bridging allowance: TL of the structural path relative to mass law of the total mass
  P.CONNECTIONS = {
    none: { name: 'Fully independent (separate frames / room-in-room)', bridge: Infinity },
    clips: { name: 'Isolation clips + hat channel', bridge: 20 },
    resilient: { name: 'Resilient channel (correctly installed)', bridge: 17 },
    staggered: { name: 'Staggered studs, shared plate', bridge: 15 },
    steel: { name: 'Light-gauge steel studs', bridge: 12 },
    wood: { name: 'Single timber studs (rigid)', bridge: 4 },
    solid: { name: 'Solid / rigid tie (e.g. masonry ties)', bridge: 2 },
  };
  /**
   * Double leaf TL (Sharp model + empirical bridging path).
   * o: {leaf1, leaf2 (from leafProps), d (cavity m), filled (bool), conn (key)}
   */
  P.doubleLeafTL = function (o, f) {
    const { leaf1, leaf2, d } = o;
    const m1 = leaf1.m, m2 = leaf2.m;
    const f0 = (o.filled ? 50 : 60) * sqrt((m1 + m2) / (m1 * m2 * d));
    const fl = P.C / (2 * PI * d);
    const tl1 = P.singleLeafTL(leaf1, f), tl2 = P.singleLeafTL(leaf2, f);
    const combined = { m: m1 + m2, fc: Math.min(leaf1.fc, leaf2.fc), eta: Math.max(leaf1.eta, leaf2.eta), dip: Math.min(leaf1.dip || 18, leaf2.dip || 18) };
    let tl;
    if (f < f0) tl = P.singleLeafTL(combined, f);
    else if (f < fl) tl = tl1 + tl2 + 20 * log10(f * d) - 29;
    else tl = tl1 + tl2 + 6;
    if (!o.filled && f >= f0) tl -= Math.min(8, 3 + 5 * log10(f / f0 + 1)); // empty cavity: resonances & less damping
    // resonance dip around f0
    const r = f / f0;
    if (r > 0.7 && r < 1.4) tl -= (o.filled ? 3 : 6) * (1 - Math.abs(log10(r)) / log10(1.4));
    const bridge = (P.CONNECTIONS[o.conn] || P.CONNECTIONS.none).bridge + (o.damping ? 4 : 0);
    if (isFinite(bridge) && f > f0) {
      const tlB = P.singleLeafTL(combined, f) + bridge * Math.min(1, log10(f / f0) / log10(4) + 0.3);
      tl = -10 * log10(Math.pow(10, -tl / 10) + Math.pow(10, -tlB / 10));
      if (!o.filled) tl -= 3;
    }
    // practical ceiling: even laboratory constructions are limited by flanking/edge paths
    const cap = o.cap == null ? 78 : o.cap;
    tl = -10 * log10(Math.pow(10, -tl / 10) + Math.pow(10, -cap / 10));
    return { tl: Math.max(0, tl), f0, fl };
  };
  /** STC per ASTM E413 from 16 third-octave TL values (125–4000) */
  P.STC_CONTOUR = [-16, -13, -10, -7, -4, -1, 0, 1, 2, 3, 4, 4, 4, 4, 4, 4];
  P.stc = function (tl16) {
    let best = 0;
    for (let s = 0; s <= 120; s++) {
      let sum = 0, mx = 0;
      for (let i = 0; i < 16; i++) { const def = Math.max(0, s + P.STC_CONTOUR[i] - tl16[i]); sum += def; mx = Math.max(mx, def); }
      if (sum <= 32 && mx <= 8) best = s; else break;
    }
    return best;
  };
  /** Rw (ISO 717-1) with C and Ctr from 16 third-octave values (100–3150) */
  P.RW_REF = [33, 36, 39, 42, 45, 48, 51, 52, 53, 54, 55, 56, 56, 56, 56, 56];
  P.C_SPEC = [-29, -26, -23, -21, -19, -17, -15, -13, -12, -11, -10, -9, -9, -9, -9, -9];
  P.CTR_SPEC = [-20, -20, -18, -16, -15, -14, -13, -12, -11, -9, -8, -9, -10, -11, -13, -15];
  P.rw = function (tl16) {
    let best = 0;
    for (let shift = -60; shift <= 60; shift++) {
      let sum = 0;
      for (let i = 0; i < 16; i++) sum += Math.max(0, P.RW_REF[i] + shift - tl16[i]);
      if (sum <= 32) best = 52 + shift; else break;
    }
    const Xa = (spec) => -10 * log10(spec.reduce((s, L, i) => s + Math.pow(10, (L - tl16[i]) / 10), 0));
    return { Rw: best, C: Math.round(Xa(P.C_SPEC) - best), Ctr: Math.round(Xa(P.CTR_SPEC) - best) };
  };
  /** composite TL of elements [{area, tl}] */
  P.compositeTL = function (elements) {
    const S = elements.reduce((s, e) => s + e.area, 0);
    const tau = elements.reduce((s, e) => s + e.area * Math.pow(10, -e.tl / 10), 0);
    return -10 * log10(tau / S);
  };
  /** level in receiving room: L2 = L1 − TL + 10 log(S/A2) */
  P.receivingLevel = (L1, TL, S, A2) => L1 - TL + 10 * log10(S / Math.max(A2, 0.1));
  /** Maekawa barrier insertion loss (point source), path difference δ */
  P.maekawa = function (delta, f) {
    const N = (2 * delta * f) / P.C;
    if (N <= -0.2) return 0;
    if (N < 0) return 5 + 20 * log10(sqrt(2 * PI * Math.abs(N)) / Math.tan(sqrt(2 * PI * Math.abs(N))) || 1);
    return Math.min(24, 10 * log10(3 + 20 * N));
  };
  P.STC_SUBJECTIVE = [
    [25, 'Normal speech easily understood through the wall'],
    [30, 'Normal speech audible; loud speech understood'],
    [35, 'Loud speech audible but not intelligible'],
    [40, 'Loud speech audible as a murmur'],
    [45, 'Loud speech barely audible; must strain to hear'],
    [50, 'Loud speech inaudible; loud music & bass clearly heard'],
    [55, 'Loud music faint; bass and drums still audible'],
    [60, 'Most domestic noise inaudible; amplified bass faint'],
    [65, 'Excellent — good for home studios with neighbours'],
    [70, 'Professional studio territory; drums barely audible'],
    [80, 'Room-within-room on floated slab; world-class isolation'],
  ];
  P.stcDescribe = (stc) => { let d = P.STC_SUBJECTIVE[0][1]; for (const [s, t] of P.STC_SUBJECTIVE) if (stc >= s) d = t; return d; };

  /* ---------------- vibration isolation ---------------- */
  P.G = 9.81;
  P.staticDeflectionFn = (deflMM) => 15.76 / sqrt(Math.max(deflMM, 1e-6));     // Hz
  P.fnFromK = (k, m) => (1 / (2 * PI)) * sqrt(k / m);                           // k N/m, m kg
  P.transmissibility = function (r, zeta = 0.05) {
    const a = 1 + (2 * zeta * r) ** 2;
    const b = (1 - r * r) ** 2 + (2 * zeta * r) ** 2;
    return sqrt(a / b);
  };
  P.isolationEfficiency = (r, zeta) => Math.max(0, 1 - P.transmissibility(r, zeta)) * 100;
  P.insertionLossDB = (r, zeta) => -20 * log10(P.transmissibility(r, zeta));
  /** floating floor on continuous resilient layer: s' MN/m³, m' kg/m² */
  P.floatingF0 = (sPrime, mPrime) => 160 * sqrt(sPrime / mPrime);
  /** air-layer dynamic stiffness MN/m³ (d in m); isothermal if absorber-filled */
  P.airStiffness = (d, filled = true) => (filled ? 0.1 : 0.14) / d;
  /** impact improvement of floating screed (EN 12354-2 approximation) */
  P.impactImprovement = (f, f0) => (f > f0 ? 30 * log10(f / f0) : 0);
  P.CONCRETE_RHO = 2400;
  /** required static deflection for a target isolation efficiency at forcing freq */
  P.requiredDeflection = function (fForce, efficiency) {
    const T = 1 - efficiency / 100;
    const r = sqrt(1 + 1 / T);
    const fn = fForce / r;
    return { fn, deflMM: Math.pow(15.76 / fn, 2) };
  };

  /* ---------------- noise criteria ---------------- */
  P.NC_CURVES = {
    15: [47, 36, 29, 22, 17, 14, 12, 11],
    20: [51, 40, 33, 26, 22, 19, 17, 16],
    25: [54, 44, 37, 31, 27, 24, 22, 21],
    30: [57, 48, 41, 35, 31, 29, 28, 27],
    35: [60, 52, 45, 40, 36, 34, 33, 32],
    40: [64, 56, 50, 45, 41, 39, 38, 37],
    45: [67, 60, 54, 49, 46, 44, 43, 42],
    50: [71, 64, 58, 54, 51, 49, 48, 47],
    55: [74, 67, 62, 58, 56, 54, 53, 52],
    60: [77, 71, 67, 63, 61, 59, 58, 57],
    65: [80, 75, 71, 68, 66, 64, 63, 62],
    70: [83, 79, 75, 72, 71, 70, 69, 68],
  };
  /** NC rating of octave spectrum (63–8k), interpolated per band */
  P.ncRating = function (oct) {
    const keys = Object.keys(P.NC_CURVES).map(Number);
    let worst = 0;
    oct.forEach((L, i) => {
      let nc = keys[0] - 5;
      for (let k = 0; k < keys.length - 1; k++) {
        const a = P.NC_CURVES[keys[k]][i], b = P.NC_CURVES[keys[k + 1]][i];
        if (L <= a) { nc = k === 0 ? keys[0] - (a - L) * 5 / (b - a) : keys[k]; break; }
        if (L <= b) { nc = keys[k] + ((L - a) / (b - a)) * 5; break; }
        nc = keys[keys.length - 1] + (L - P.NC_CURVES[70][i]);
      }
      worst = Math.max(worst, nc);
    });
    return Math.round(worst);
  };
  P.NR_AB = { 63: [35.5, 0.79], 125: [22, 0.87], 250: [12, 0.93], 500: [4.8, 0.974], 1000: [0, 1], 2000: [-3.5, 1.015], 4000: [-6.1, 1.025], 8000: [-8, 1.03] };
  P.nrCurve = (NR) => P.OCT.map((f) => P.NR_AB[f][0] + P.NR_AB[f][1] * NR);
  P.nrRating = (oct) => Math.ceil(Math.max(...oct.map((L, i) => (L - P.NR_AB[P.OCT[i]][0]) / P.NR_AB[P.OCT[i]][1])));

  /* ---------------- equal loudness (ISO 226:2003) ---------------- */
  P.ISO226 = {
    f: [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500],
    af: [0.532, 0.506, 0.48, 0.455, 0.432, 0.409, 0.387, 0.367, 0.349, 0.33, 0.315, 0.301, 0.288, 0.276, 0.267, 0.259, 0.253, 0.25, 0.246, 0.244, 0.243, 0.243, 0.243, 0.242, 0.242, 0.245, 0.254, 0.271, 0.301],
    Lu: [-31.6, -27.2, -23, -19.1, -15.9, -13, -10.3, -8.1, -6.2, -4.5, -3.1, -2, -1.1, -0.4, 0, 0.3, 0.5, 0, -2.7, -4.1, -1, 1.7, 2.5, 1.2, -2.1, -7.1, -11.2, -10.7, -3.1],
    Tf: [78.5, 68.7, 59.5, 51.1, 44, 37.5, 31.5, 26.5, 22.1, 17.9, 14.4, 11.4, 8.6, 6.2, 4.4, 3, 2.2, 2.4, 3.5, 1.7, -1.3, -4.2, -6, -5.4, -1.5, 6, 12.6, 13.9, 12.3],
  };
  P.equalLoudness = function (phon) {
    const T = P.ISO226;
    return T.f.map((f, i) => {
      const Af = 4.47e-3 * (Math.pow(10, 0.025 * phon) - 1.15) + Math.pow(0.4 * Math.pow(10, (T.Tf[i] + T.Lu[i]) / 10 - 9), T.af[i]);
      return [f, (10 / T.af[i]) * log10(Af) - T.Lu[i] + 94];
    });
  };

  /* ---------------- reflections / geometry ---------------- */
  /** first-reflection point on a wall (mirror image method, 2D plan) — wall is line x = wx */
  P.reflectionPointX = function (src, rcv, wx) {
    const img = [2 * wx - src[0], src[1]];
    const t = (wx - rcv[0]) / (img[0] - rcv[0]);
    return [wx, rcv[1] + t * (img[1] - rcv[1])];
  };
  P.combNulls = function (pathDiff, count = 6, c = P.C) {
    const dt = pathDiff / c; const out = [];
    for (let n = 0; n < count; n++) out.push((2 * n + 1) / (2 * dt));
    return out;
  };
  /** SBIR first null for a speaker distance d to a boundary */
  P.sbirNull = (d, c = P.C) => c / (4 * d);
  P.combResponse = (f, pathDiff, refl = 0.8, c = P.C) => {
    const ph = (2 * PI * f * pathDiff) / c;
    return 20 * log10(Math.hypot(1 + refl * Math.cos(ph), refl * Math.sin(ph)));
  };

  /* ---------------- signal processing helpers (measurement) ---------------- */
  /** RBJ biquad band-pass coefficients (constant 0 dB peak) */
  P.bandpassCoeffs = function (fc, Q, fs) {
    const w0 = (2 * PI * fc) / fs, alpha = Math.sin(w0) / (2 * Q), cs = Math.cos(w0);
    const a0 = 1 + alpha;
    return { b0: alpha / a0, b1: 0, b2: -alpha / a0, a1: (-2 * cs) / a0, a2: (1 - alpha) / a0 };
  };
  P.biquad = function (x, c) {
    const y = new Float32Array(x.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) {
      const v = c.b0 * x[i] + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
      x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
    }
    return y;
  };
  /** Schroeder backward integration → decay curve in dB (normalised) */
  P.schroederCurve = function (x) {
    const n = x.length; const e = new Float64Array(n);
    let acc = 0;
    for (let i = n - 1; i >= 0; i--) { acc += x[i] * x[i]; e[i] = acc; }
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) out[i] = 10 * log10(e[i] / e[0] + 1e-20);
    return out;
  };
  /** linear regression of decay between two dB points; returns T60 estimate */
  P.decayFit = function (curve, fs, hi = -5, lo = -25) {
    let i0 = -1, i1 = -1;
    for (let i = 0; i < curve.length; i++) { if (i0 < 0 && curve[i] <= hi) i0 = i; if (curve[i] <= lo) { i1 = i; break; } }
    if (i0 < 0 || i1 < 0 || i1 - i0 < 10) return null;
    let sx = 0, sy = 0, sxx = 0, sxy = 0, n = 0;
    const step = Math.max(1, Math.floor((i1 - i0) / 400));
    for (let i = i0; i <= i1; i += step) { const t = i / fs; sx += t; sy += curve[i]; sxx += t * t; sxy += t * curve[i]; n++; }
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    return slope < 0 ? -60 / slope : null;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = P;
  else root.P = P;
})(typeof window !== 'undefined' ? window : globalThis);
