/* ==========================================================================
   Acoustica audio/sound-system physics: filters & EQ, crossovers, arrays,
   electrical (Ohm, amps, cables, 70/100 V), feedback, networking.
   Browser: window.AP. Node: module.exports.
   ========================================================================== */
(function (root) {
  'use strict';
  const AP = {};
  const PI = Math.PI, log10 = Math.log10, sqrt = Math.sqrt;
  const C = 343;

  /* ---------------- complex helpers ---------------- */
  const cx = (re, im = 0) => ({ re, im });
  const mul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const div = (a, b) => { const d = b.re * b.re + b.im * b.im; return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const add = (a, b) => cx(a.re + b.re, a.im + b.im);
  const abs = (a) => Math.hypot(a.re, a.im);
  const expj = (ph) => cx(Math.cos(ph), Math.sin(ph));
  AP.cx = { cx, mul, div, add, abs, expj };
  AP.db = (h) => 20 * log10(abs(h) + 1e-12);
  AP.phaseDeg = (h) => (Math.atan2(h.im, h.re) * 180) / PI;

  /* ---------------- digital biquads (RBJ cookbook) ---------------- */
  AP.biquad = function (type, f0, gainDb = 0, Q = 0.707, fs = 48000) {
    const A = Math.pow(10, gainDb / 40), w0 = (2 * PI * f0) / fs, cs = Math.cos(w0), sn = Math.sin(w0);
    const alpha = sn / (2 * Q);
    let b0, b1, b2, a0, a1, a2;
    if (type === 'peak') { b0 = 1 + alpha * A; b1 = -2 * cs; b2 = 1 - alpha * A; a0 = 1 + alpha / A; a1 = -2 * cs; a2 = 1 - alpha / A; }
    else if (type === 'lowshelf' || type === 'highshelf') {
      const al = (sn / 2) * sqrt(2); // shelf slope S = 1
      const sA = 2 * sqrt(A) * al;
      if (type === 'lowshelf') { b0 = A * (A + 1 - (A - 1) * cs + sA); b1 = 2 * A * (A - 1 - (A + 1) * cs); b2 = A * (A + 1 - (A - 1) * cs - sA); a0 = A + 1 + (A - 1) * cs + sA; a1 = -2 * (A - 1 + (A + 1) * cs); a2 = A + 1 + (A - 1) * cs - sA; }
      else { b0 = A * (A + 1 + (A - 1) * cs + sA); b1 = -2 * A * (A - 1 + (A + 1) * cs); b2 = A * (A + 1 + (A - 1) * cs - sA); a0 = A + 1 - (A - 1) * cs + sA; a1 = 2 * (A - 1 - (A + 1) * cs); a2 = A + 1 - (A - 1) * cs - sA; }
    } else if (type === 'lowpass') { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = (1 - cs) / 2; a0 = 1 + alpha; a1 = -2 * cs; a2 = 1 - alpha; }
    else if (type === 'highpass') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = (1 + cs) / 2; a0 = 1 + alpha; a1 = -2 * cs; a2 = 1 - alpha; }
    else if (type === 'notch') { b0 = 1; b1 = -2 * cs; b2 = 1; a0 = 1 + alpha; a1 = -2 * cs; a2 = 1 - alpha; }
    else if (type === 'allpass') { b0 = 1 - alpha; b1 = -2 * cs; b2 = 1 + alpha; a0 = 1 + alpha; a1 = -2 * cs; a2 = 1 - alpha; }
    else { b0 = 1; b1 = 0; b2 = 0; a0 = 1; a1 = 0; a2 = 0; }
    return { b: [b0 / a0, b1 / a0, b2 / a0], a: [1, a1 / a0, a2 / a0], fs };
  };
  AP.biquadH = function (c, f) {
    const w = (2 * PI * f) / c.fs;
    const z1 = expj(-w), z2 = expj(-2 * w);
    const num = add(add(cx(c.b[0]), mul(cx(c.b[1]), z1)), mul(cx(c.b[2]), z2));
    const den = add(add(cx(c.a[0]), mul(cx(c.a[1]), z1)), mul(cx(c.a[2]), z2));
    return div(num, den);
  };
  /** product of several biquads */
  AP.chainH = (list, f) => list.reduce((h, c) => mul(h, AP.biquadH(c, f)), cx(1));

  /* ---------------- analog crossover prototypes ---------------- */
  // sections: arrays of {order:1} or {order:2, Q}
  const ALIGN = {
    BW1: [{ o: 1 }], BW2: [{ o: 2, Q: 0.7071 }], BW3: [{ o: 1 }, { o: 2, Q: 1 }], BW4: [{ o: 2, Q: 0.5412 }, { o: 2, Q: 1.3066 }],
    LR2: [{ o: 1 }, { o: 1 }], LR4: [{ o: 2, Q: 0.7071 }, { o: 2, Q: 0.7071 }], LR8: [{ o: 2, Q: 0.5412 }, { o: 2, Q: 1.3066 }, { o: 2, Q: 0.5412 }, { o: 2, Q: 1.3066 }],
  };
  AP.ALIGNMENTS = Object.keys(ALIGN);
  /** analog filter response: kind 'lp' | 'hp', type key, fc */
  AP.analogFilter = function (kind, type, fc, f) {
    const s = cx(0, f / fc); // normalised jω
    let h = cx(1);
    for (const sec of ALIGN[type] || []) {
      if (sec.o === 1) h = mul(h, kind === 'lp' ? div(cx(1), add(s, cx(1))) : div(s, add(s, cx(1))));
      else {
        const s2 = mul(s, s);
        const den = add(add(s2, cx(s.re / sec.Q, s.im / sec.Q)), cx(1));
        h = mul(h, kind === 'lp' ? div(cx(1), den) : div(s2, den));
      }
    }
    return h;
  };
  AP.delayH = (f, ms) => expj((-2 * PI * f * ms) / 1000);
  AP.filterOrder = (type) => (ALIGN[type] || []).reduce((n, s) => n + s.o, 0);

  /* ---------------- loudspeaker arrays & coverage ---------------- */
  /** two-source (or n-source) array far-field response at angle θ (rad, 0 = front) */
  AP.arrayResponse = function (sources, f, th) {
    // sources: [{x (m, +forward), y (m), delayMs, pol (±1), gain}]
    const k = (2 * PI * f) / C;
    let h = cx(0);
    for (const s of sources) {
      const path = -(s.x * Math.cos(th) + (s.y || 0) * Math.sin(th)); // extra path to far field
      const ph = -k * path - (2 * PI * f * (s.delayMs || 0)) / 1000;
      const e = expj(ph);
      h = add(h, cx(e.re * (s.pol || 1) * (s.gain == null ? 1 : s.gain), e.im * (s.pol || 1) * (s.gain == null ? 1 : s.gain)));
    }
    return h;
  };
  /** simple directivity: dB off-axis for a box with nominal coverage (−6 dB points) */
  AP.offAxisDb = (angleDeg, coverageDeg) => {
    const h = Math.max(coverageDeg / 2, 1);
    return Math.max(-30, -6 * Math.pow(Math.abs(angleDeg) / h, 2));
  };
  /** line source near-field limit (Fresnel-type transition), H = array height */
  AP.lineNearField = (H, f) => (H * H * f) / (2 * C);
  AP.lineSourceLevel = function (L1, r, H, f) {
    const dn = Math.max(1, AP.lineNearField(H, f));
    if (r <= dn) return L1 - 10 * log10(r);
    return L1 - 10 * log10(dn) - 20 * log10(r / dn);
  };
  AP.directivityIndex = (hDeg, vDeg) => 10 * log10(41253 / (hDeg * vDeg) * 0.6 + 1e-9); // approx DI from coverage (empirical 0.6 factor)

  /* ---------------- electrical ---------------- */
  AP.series = (zs) => zs.reduce((a, b) => a + b, 0);
  AP.parallel = (zs) => 1 / zs.reduce((a, b) => a + 1 / b, 0);
  AP.powerFromV = (V, R) => (V * V) / R;
  AP.voltageFromP = (P, R) => sqrt(P * R);
  AP.dBu = (V) => 20 * log10(V / 0.7746);
  AP.dBV = (V) => 20 * log10(V);
  AP.vFromDbu = (d) => 0.7746 * Math.pow(10, d / 20);
  AP.vFromDbv = (d) => Math.pow(10, d / 20);
  AP.dBFStoDbu = (dbfs, refDbuAt0dBFS = 24) => dbfs + refDbuAt0dBFS;
  /** copper cable resistance (ohms) for round-trip length L (m), area mm² */
  AP.cableR = (Lm, mm2) => (0.0172 * 2 * Lm) / mm2;
  AP.cableLossDb = (Lm, mm2, Zload) => { const r = AP.cableR(Lm, mm2); return 20 * log10(Zload / (Zload + r)); };
  AP.dampingFactor = (Lm, mm2, Zload, ampZout = 0.01) => Zload / (AP.cableR(Lm, mm2) + ampZout);
  const AWG_MM2 = { 18: 0.82, 16: 1.31, 14: 2.08, 12: 3.31, 10: 5.26 };
  AP.AWG = AWG_MM2;
  /** constant-voltage line: tap impedance, max taps, amp loading */
  AP.cvTapZ = (V, W) => (V * V) / W;
  AP.cvLoad = (taps, ampW) => ({ total: taps.reduce((a, b) => a + b, 0), ok: taps.reduce((a, b) => a + b, 0) <= ampW * 0.8 });
  /** amp power needed for target SPL at distance with headroom */
  AP.ampPower = (targetSpl, r, sens, headroomDb = 10, nBoxes = 1) => Math.pow(10, (targetSpl + headroomDb - sens + 20 * log10(r) - 10 * log10(nBoxes)) / 10);
  /** ceiling speaker spacing for given coverage and coverage plane height */
  AP.ceilingSpacing = (ceilH, earH, covDeg, mode = 'edge') => {
    const r = (ceilH - earH) * Math.tan((covDeg / 2) * (PI / 180));
    return mode === 'edge' ? 2 * r : mode === 'minimum' ? sqrt(2) * r : r; // edge-to-edge, minimum overlap, centre-to-centre
  };

  /* ---------------- feedback ---------------- */
  /** Potential/needed acoustic gain (Davis): PAG = 20log(D0·D1/(Ds·D2)) − 10log(NOM) − FSM */
  AP.pag = (D0, D1, Ds, D2, NOM = 1, FSM = 6) => 20 * log10((D0 * D1) / (Ds * D2)) - 10 * log10(NOM) - FSM;
  AP.nag = (D0, EAD) => 20 * log10(D0 / EAD);

  /* ---------------- digital audio & networking ---------------- */
  AP.channelMbps = (fs, bits, ch) => (fs * bits * ch) / 1e6;
  /** approximate network bandwidth for an AES67/Dante-style multicast/unicast flow incl. overhead */
  AP.flowMbps = (fs, bits, ch, packetMs = 1) => {
    const samplesPerPkt = Math.max(1, Math.round((fs * packetMs) / 1000));
    const payloadBytes = samplesPerPkt * ch * Math.ceil(bits / 8);
    const overhead = 14 + 4 + 20 + 8 + 12 + 24; // Ethernet+FCS+IP+UDP+RTP+preamble/IFG
    const pps = 1000 / packetMs;
    return ((payloadBytes + overhead) * 8 * pps) / 1e6;
  };
  AP.samplesToMs = (n, fs) => (n / fs) * 1000;
  AP.distanceFromMs = (ms) => (ms / 1000) * C;
  AP.msFromDistance = (m) => (m / C) * 1000;
  AP.PROTOCOLS = [
    { name: 'Analog (balanced)', medium: 'Copper pair per channel (XLR/TRS, multicore)', ch: '1 per pair', latency: '≈ 0', distance: '~100 m+ (line level)', notes: 'Simple, universal, no clock. Heavy multicores; noise and loss over distance.' },
    { name: 'AES3 (AES/EBU)', medium: '110 Ω twisted pair (XLR) / 75 Ω coax', ch: '2', latency: '≈ 1 sample', distance: '~100 m (twisted pair)', notes: 'Point-to-point digital stereo; embedded clock.' },
    { name: 'ADAT Lightpipe', medium: 'TOSLINK optical', ch: '8 @48k (4 @96k S/MUX)', latency: 'very low', distance: '~10 m', notes: 'Cheap expansion for interfaces.' },
    { name: 'MADI (AES10)', medium: '75 Ω coax or fibre', ch: '64 @48k', latency: 'very low', distance: '100 m coax / 2 km fibre', notes: 'Point-to-point, deterministic, broadcast & large live rigs.' },
    { name: 'AES50 / SuperMAC', medium: 'Cat5e/6 point-to-point', ch: '48 bidirectional @48k', latency: '< 0.1 ms per link', distance: '~100 m', notes: 'Stagebox-to-console links on several console families.' },
    { name: 'Dante', medium: 'Standard IP/Ethernet (1 Gb recommended)', ch: 'up to 512×512 per device (model dependent)', latency: '0.25–5 ms selectable', distance: 'network topology', notes: 'Most widely deployed AoIP; PTP clocking; primary/secondary redundancy; AES67 mode.' },
    { name: 'AVB / Milan', medium: 'AVB-capable Ethernet switches', ch: 'flows of up to 8 ch (Milan)', latency: '2 ms default, deterministic', distance: '7 hops nominal', notes: 'IEEE 802.1 standards with guaranteed bandwidth reservation; Milan adds interoperability profile.' },
    { name: 'AES67', medium: 'IP/Ethernet', ch: 'per stream', latency: '≈ 1–4 ms typical', distance: 'network', notes: 'Interoperability standard bridging Dante, Ravenna, Livewire+, Q-LAN and others.' },
    { name: 'Ravenna / ST 2110-30', medium: 'IP/Ethernet', ch: 'per stream', latency: 'sub-ms to ms', distance: 'network', notes: 'Broadcast-grade AoIP; ST 2110-30 is the audio part of SMPTE’s media-over-IP suite.' },
  ];

  if (typeof module !== 'undefined' && module.exports) module.exports = AP;
  else root.AP = AP;
})(typeof window !== 'undefined' ? window : globalThis);
