/* ==========================================================================
   Fundamentals, resonance & harmonics widgets.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2;
  const NOTE = (f) => { const n = Math.round(12 * Math.log2(f / 440)) + 57; const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']; return names[((n % 12) + 12) % 12] + Math.floor(n / 12); };
  V.NOTE = NOTE;
  const INTERVAL = ['fundamental', 'octave', 'octave + 5th', '2 octaves', '2 oct + maj 3rd', '2 oct + 5th', '2 oct + ♭7th', '3 octaves', '3 oct + 2nd', '3 oct + 3rd', '', '3 oct + 5th', '', '', '', '4 octaves'];

  V.HARM_PRESETS = {
    sine: { name: 'Pure sine (no harmonics)', a: [1] },
    square: { name: 'Square wave (odd harmonics, 1/n)', a: Array.from({ length: 16 }, (_, i) => ((i + 1) % 2 ? 1 / (i + 1) : 0)) },
    saw: { name: 'Sawtooth (all harmonics, 1/n)', a: Array.from({ length: 16 }, (_, i) => 1 / (i + 1)) },
    triangle: { name: 'Triangle (odd, 1/n²)', a: Array.from({ length: 16 }, (_, i) => ((i + 1) % 2 ? 1 / Math.pow(i + 1, 2) : 0)) },
    clarinet: { name: 'Clarinet-like (strong odd harmonics)', a: [1, 0.08, 0.7, 0.05, 0.45, 0.04, 0.3, 0.03, 0.18, 0.02, 0.1, 0.02] },
    bass: { name: 'Bass guitar (strong low partials)', a: [1, 0.8, 0.55, 0.4, 0.28, 0.18, 0.12, 0.08, 0.05, 0.03] },
    voice: { name: 'Voice “ah” (formant-shaped)', a: [0.6, 0.8, 1, 0.9, 0.7, 0.5, 0.55, 0.6, 0.4, 0.25, 0.2, 0.15, 0.1, 0.08] },
    kick: { name: 'Kick drum body (decaying partials)', a: [1, 0.5, 0.25, 0.15, 0.1, 0.08, 0.06, 0.06, 0.05, 0.05, 0.04, 0.04] },
    hum: { name: 'Mains hum + buzz (50 Hz family)', a: [0.4, 1, 0.5, 0.6, 0.3, 0.35, 0.2, 0.2] },
  };

  /** play a set of harmonic amplitudes at f0; returns {osc, gain} */
  function playHarm(f0, amps, dur = 0) {
    const ctx = A.audio.get(); if (!ctx) return null;
    const n = Math.max(2, amps.length + 1);
    const real = new Float32Array(n), imag = new Float32Array(n);
    amps.forEach((a, i) => (imag[i + 1] = a));
    const wave = ctx.createPeriodicWave(real, imag, { disableNormalization: false });
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.setPeriodicWave(wave); o.frequency.value = f0;
    const t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.28, t + 0.05);
    if (dur) { g.gain.setValueAtTime(0.28, t + dur - 0.1); g.gain.linearRampToValueAtTime(0, t + dur); o.stop(t + dur + 0.05); }
    o.connect(g).connect(ctx.destination); o.start(); A.audio.track(o);
    return { o, g, ctx };
  }
  V.playHarm = playHarm;

  /* ----------------------------------------------------------------------
     Harmonic builder: drag spectrum bars, see the waveform, hear it
     ---------------------------------------------------------------------- */
  V.harmonics = function (host) {
    let amps = V.HARM_PRESETS.saw.a.slice(0, 12);
    const st = A.controls(host, [
      { key: 'preset', label: 'Start from', type: 'select', value: 'saw', options: Object.entries(V.HARM_PRESETS).map(([k, v]) => [k, v.name]) },
      { key: 'f0', label: 'Fundamental f₀', type: 'range', min: Math.log10(30), max: Math.log10(880), step: 0.005, value: Math.log10(110), fmt: (v) => `${fmtHz(Math.pow(10, v))} (${NOTE(Math.pow(10, v))})` },
      { key: 'miss', label: 'Remove the fundamental (missing-fundamental test)', type: 'check', value: false },
    ], (v) => { if (v.preset !== cur) { cur = v.preset; amps = V.HARM_PRESETS[v.preset].a.slice(0, 12); while (amps.length < 12) amps.push(0); } sync(); });
    let cur = 'saw';
    while (amps.length < 12) amps.push(0);
    const row = el('div', { class: 'row' });
    const play = el('button', { class: 'primary', html: A.icon('play') + ' Play' });
    const stop = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(play, stop, el('span', { class: 'small' }, 'Drag the bars to change each harmonic.'));
    host.appendChild(row);
    let voice = null;
    const eff = () => amps.map((a, i) => (i === 0 && st.miss ? 0 : a));
    function sync() {
      if (voice) { const f0 = Math.pow(10, st.f0); voice.o.frequency.setTargetAtTime(f0, voice.ctx.currentTime, 0.02); const n = 13, re = new Float32Array(n), im = new Float32Array(n); eff().forEach((a, i) => (im[i + 1] = a)); voice.o.setPeriodicWave(voice.ctx.createPeriodicWave(re, im)); }
      cv.redraw();
    }
    play.onclick = () => { A.audio.stopAll(); voice = playHarm(Math.pow(10, st.f0), eff()); };
    stop.onclick = () => { A.audio.stopAll(); voice = null; };
    let drag = false;
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Left: the waveform you hear — the shape is the sum of sine waves at f₀, 2f₀, 3f₀… Right: the spectrum. Pitch comes from the spacing of the harmonics (f₀); <b>timbre</b> comes from their relative levels. Remove the fundamental and your brain still hears the same pitch, just thinner — the “missing fundamental”. That is why bass is audible on phone speakers that can’t play 41 Hz.',
      onPointer(p, api) {
        const g = api.geom; if (!g) return;
        if (p.type === 'pointerdown') drag = true;
        if (p.type === 'pointerup' || p.type === 'pointerleave') drag = false;
        if ((drag || p.type === 'pointerdown') && p.x > g.x0) {
          const i = Math.round((p.x - g.x0) / g.bw - 0.5); if (i < 0 || i > 11) return;
          amps[i] = A.clamp((g.y0 - p.y) / (g.y0 - g.y1), 0, 1); sync();
        }
      },
      draw(ctx, w, h, t, dt, api) {
        const f0 = Math.pow(10, st.f0), a = eff();
        const wl = w * 0.5;
        const y0 = h / 2;
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(10, y0); ctx.lineTo(wl - 10, y0); ctx.stroke();
        const sum = (ph) => a.reduce((s, x, i) => s + x * Math.sin((i + 1) * ph), 0);
        let mx = 0.001; for (let k = 0; k < 200; k++) mx = Math.max(mx, Math.abs(sum((k / 200) * TAU)));
        // individual harmonics faint
        a.slice(0, 4).forEach((x, i) => { if (!x) return; ctx.strokeStyle = A.alpha(A.series(i + 1), 0.35); ctx.beginPath(); for (let px = 10; px < wl - 10; px += 2) { const ph = ((px - 10) / (wl - 20)) * 2 * TAU + t * 2; const y = y0 - (x * Math.sin((i + 1) * ph) / mx) * h * 0.36; px === 10 ? ctx.moveTo(px, y) : ctx.lineTo(px, y); } ctx.stroke(); });
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.6; ctx.beginPath();
        for (let px = 10; px < wl - 10; px += 1.5) { const ph = ((px - 10) / (wl - 20)) * 2 * TAU + t * 2; const y = y0 - (sum(ph) / mx) * h * 0.36; px === 10 ? ctx.moveTo(px, y) : ctx.lineTo(px, y); }
        ctx.stroke(); ctx.lineWidth = 1;
        A.text(ctx, `2 cycles of ${fmtHz(f0)} · period ${fmt(1000 / f0, 2)} ms`, 14, 18, { size: 11, color: A.css('muted') });
        // spectrum bars
        const x0 = wl + 30, x1 = w - 12, y1 = 30, yb = h - 44, bw = (x1 - x0) / 12;
        api.geom = { x0, bw, y0: yb, y1 };
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
        amps.forEach((x, i) => {
          const removed = i === 0 && st.miss;
          const bx = x0 + i * bw + bw * 0.15, bh = x * (yb - y1);
          ctx.fillStyle = removed ? A.alpha(A.css('muted'), 0.3) : i === 0 ? A.css('accent2') : A.css('accent');
          ctx.fillRect(bx, yb - bh, bw * 0.7, bh);
          A.text(ctx, (i + 1) + 'f₀', bx + bw * 0.35, yb + 14, { align: 'center', size: 10, color: A.css('muted') });
          A.text(ctx, fmtHz(f0 * (i + 1)).replace(' Hz', ''), bx + bw * 0.35, yb + 28, { align: 'center', size: 9, color: A.css('muted') });
        });
        A.text(ctx, 'Hz →', x1, yb + 28, { align: 'right', size: 9, color: A.css('muted') });
        A.text(ctx, st.miss ? 'Fundamental removed — pitch is still heard at ' + NOTE(f0) : 'Perceived pitch: ' + NOTE(f0), x0, 18, { size: 12, weight: 700 });
      },
    });
  };

  /* ----------------------------------------------------------------------
     Resonance: driven oscillator, Q, bandwidth
     ---------------------------------------------------------------------- */
  V.resonance = function (host) {
    const st = A.controls(host, [
      { key: 'fn', label: 'Resonant (natural) frequency', type: 'range', min: 30, max: 300, step: 1, value: 80, unit: 'Hz' },
      { key: 'Q', label: 'Q (sharpness)', type: 'range', min: 0.7, max: 30, step: 0.1, value: 8 },
      { key: 'fd', label: 'Driving frequency', type: 'range', min: 20, max: 400, step: 0.5, value: 60, unit: 'Hz' },
      { key: 'sweep', label: 'Auto-sweep the driving frequency', type: 'check', value: true },
    ], () => cv.redraw());
    const resp = (f) => { const r = f / st.fn; return 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(r / st.Q, 2)); };
    let fd = st.fd;
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Every object that can store energy in two forms (mass ↔ spring, air in a neck ↔ air in a cavity, pressure ↔ velocity in a room) has resonant frequencies. Drive it there and small inputs build large responses. <b>Q</b> describes how sharp the peak is: bandwidth = f₀ / Q. High Q = narrow, loud, long ringing; low Q = broad, gentle, quick decay. Absorbers <i>lower</i> the Q of room modes.',
      draw(ctx, w, h, t, dt) {
        if (st.sweep) fd = 20 * Math.pow(20, (Math.sin(t * 0.35) * 0.5 + 0.5)); else fd = st.fd;
        const A0 = resp(fd), maxA = resp(st.fn);
        const cx = 80, base = h - 40;
        const amp = Math.min(60, 8 * A0 / Math.max(1, maxA / 7));
        const disp = Math.sin(t * 6) * amp;
        ctx.fillStyle = A.css('muted'); ctx.fillRect(cx - 40, base + Math.sin(t * 6) * 3, 80, 10);
        ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2; ctx.beginPath();
        const topY = 90 + disp;
        for (let i = 0; i <= 10; i++) { const y = topY + 30 + ((base - topY - 30) * i) / 10; ctx.lineTo(cx + (i % 2 ? 12 : -12) * (i && i < 10 ? 1 : 0), y); }
        ctx.stroke(); ctx.lineWidth = 1;
        ctx.fillStyle = A.css('accent'); ctx.fillRect(cx - 32, topY, 64, 30);
        A.text(ctx, `drive ${fmtHz(fd)}`, cx, base + 30, { align: 'center', size: 11 });
        const ax = A.axes(ctx, w, h, { pad: { l: 190 }, x: { min: 20, max: 400, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 50, 80, 100, 150, 200, 300, 400] }, y: { min: -20, max: Math.max(12, 20 * Math.log10(maxA) + 4), label: 'Response (dB)' } });
        const pts = []; for (let f = 20; f <= 400; f *= 1.01) pts.push([f, 20 * Math.log10(resp(f))]);
        A.plotFill(ctx, ax, pts, A.alpha(A.css('accent'), 0.12), -20);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.4);
        const bwLo = st.fn * (Math.sqrt(1 + 1 / (4 * st.Q * st.Q)) - 1 / (2 * st.Q)), bwHi = bwLo + st.fn / st.Q;
        ctx.fillStyle = A.alpha(A.css('accent2'), 0.15); ctx.fillRect(ax.X(bwLo), ax.y1, ax.X(bwHi) - ax.X(bwLo), ax.y0 - ax.y1);
        ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.arc(ax.X(fd), ax.Y(20 * Math.log10(A0)), 6, 0, TAU); ctx.fill();
        A.text(ctx, `bandwidth ${fmt(st.fn / st.Q, 1)} Hz · rings for ≈ ${fmt((2.2 * st.Q / st.fn) * 1000, 0)} ms (T60 ≈ 2.2·Q/f₀)`, ax.x0 + 8, ax.y1 + 16, { size: 12, weight: 700 });
      },
    });
  };

  /* ----------------------------------------------------------------------
     Standing waves on a string ↔ axial room modes
     ---------------------------------------------------------------------- */
  V.stringModes = function (host) {
    const st = A.controls(host, [
      { key: 'kind', label: 'Show', type: 'select', value: 'string', options: [['string', 'A plucked string (fixed ends: displacement nodes)'], ['room', 'An axial room mode (walls: pressure antinodes)']] },
      { key: 'n', label: 'Harmonic / mode number n', type: 'range', min: 1, max: 6, step: 1, value: 1 },
      { key: 'Lm', label: 'Length', type: 'range', min: 0.3, max: 10, step: 0.05, value: 5, unit: 'm' },
      { key: 'all', label: 'Show the first 4 together (pluck)', type: 'check', value: false },
    ], () => {});
    const play = el('button', { class: 'primary small', html: A.icon('play') + ' Hear this frequency' });
    host.appendChild(play);
    const freq = () => (st.kind === 'room' ? (st.n * P.C) / (2 * st.Lm) : (st.n * 110));
    play.onclick = () => A.audio.tone(freq(), 2, -14);
    A.canvas(host, {
      height: 230, animate: true,
      caption: 'The same physics in two places. A string fixed at both ends vibrates at f, 2f, 3f… (a harmonic series). A room between two parallel walls resonates at c/2L, 2·c/2L, 3·c/2L… — <b>axial room modes are a harmonic series too</b>. That’s why one tuned trap at the 1st mode doesn’t fix the 2nd and 3rd: they are different frequencies with nodes in different places.',
      draw(ctx, w, h, t) {
        const x0 = 40, x1 = w - 40, y0 = h / 2, A0 = h * 0.32;
        const room = st.kind === 'room';
        if (room) { ctx.fillStyle = A.css('muted'); ctx.fillRect(x0 - 12, 20, 12, h - 40); ctx.fillRect(x1, 20, 12, h - 40); }
        else { ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.arc(x0, y0, 5, 0, TAU); ctx.arc(x1, y0, 5, 0, TAU); ctx.fill(); }
        const modes = st.all ? [1, 2, 3, 4] : [st.n];
        const shape = (n, u) => (room ? Math.cos(n * Math.PI * u) : Math.sin(n * Math.PI * u));
        if (st.all) modes.forEach((n, k) => { ctx.strokeStyle = A.alpha(A.series(k + 1), 0.45); ctx.beginPath(); for (let x = x0; x <= x1; x += 2) { const u = (x - x0) / (x1 - x0); const y = y0 - (A0 / n) * shape(n, u) * Math.cos(t * 3 * n); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); });
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 3; ctx.beginPath();
        for (let x = x0; x <= x1; x += 2) { const u = (x - x0) / (x1 - x0); const y = y0 - modes.reduce((s, n) => s + (A0 / (st.all ? n : 1)) * shape(n, u) * Math.cos(t * 3 * n), 0) / (st.all ? 1.6 : 1); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); ctx.lineWidth = 1;
        if (!st.all) for (let k = 0; k <= st.n * 2; k++) { const u = room ? (k + 0.5) / st.n : k / st.n; if (u > 1.0001 || (room && k >= st.n)) continue; const x = x0 + u * (x1 - x0); ctx.fillStyle = A.css('accent2'); ctx.beginPath(); ctx.arc(x, y0, 4, 0, TAU); ctx.fill(); }
        A.text(ctx, room ? `Mode ${st.n} = ${fmtHz(freq())} (${st.n} × ${fmtHz(P.C / (2 * st.Lm))}) · blue dots = pressure nodes` : `Harmonic ${st.n} = ${st.n}f · blue dots = nodes (no motion)`, x0, 16, { size: 12, weight: 700 });
      },
    });
  };

  /* ----------------------------------------------------------------------
     Does targeting a low frequency affect the higher ones?
     ---------------------------------------------------------------------- */
  V.SOURCES_H = {
    bass: { name: 'Bass guitar, low E (E1)', f0: 41.2, a: [1, 0.8, 0.55, 0.4, 0.28, 0.18, 0.12, 0.08, 0.05, 0.03, 0.02, 0.015] },
    kick: { name: 'Kick drum body (~55 Hz)', f0: 55, a: [1, 0.5, 0.25, 0.15, 0.1, 0.08, 0.06, 0.06, 0.05, 0.05, 0.04, 0.04] },
    male: { name: 'Male voice, A2', f0: 110, a: [0.6, 0.8, 1, 0.9, 0.7, 0.5, 0.55, 0.6, 0.4, 0.25, 0.2, 0.15] },
    piano: { name: 'Piano, A3', f0: 220, a: [1, 0.6, 0.35, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05, 0.04, 0.03, 0.02] },
    hum: { name: 'Transformer hum (50 Hz mains)', f0: 50, a: [0.4, 1, 0.5, 0.6, 0.3, 0.35, 0.2, 0.2, 0.1, 0.1, 0.05, 0.05] },
  };
  V.lowTarget = function (host) {
    const st = A.controls(host, [
      { key: 'src', label: 'Sound', type: 'select', value: 'bass', options: Object.entries(V.SOURCES_H).map(([k, v]) => [k, v.name]) },
      { key: 'tool', label: 'What you aim at the low end', type: 'select', value: 'tuned', options: [['tuned', 'Tuned resonant trap (membrane/Helmholtz)'], ['notch', 'Narrow EQ cut / notch'], ['hpf', 'High-pass filter'], ['porous', 'Broadband porous absorber (100 mm)'], ['wall', 'A wall between you and the source'], ['bigtrap', 'Deep corner bass trap (300 mm)']] },
      { key: 'fc', label: 'Target / cut-off frequency', type: 'range', min: 20, max: 400, step: 1, value: 41, unit: 'Hz' },
      { key: 'depth', label: 'Depth of effect', type: 'range', min: 3, max: 24, step: 1, value: 10, unit: 'dB' },
    ], () => upd());
    const row = el('div', { class: 'row' });
    const pB = el('button', { class: 'primary', html: A.icon('play') + ' Before' }), pA = el('button', { class: 'primary', html: A.icon('play') + ' After' }), sp = el('button', { html: A.icon('stop') });
    row.append(pB, pA, sp); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const verdict = el('div'); host.appendChild(verdict);
    /** effect of the chosen tool at frequency f, in dB (≤ 0) */
    function eff(f) {
      const fc = st.fc, d = st.depth;
      switch (st.tool) {
        case 'tuned': { const Q = 2.2, x = f / fc - fc / f; return -d / (1 + Q * Q * x * x); }
        case 'notch': { const Q = 8, x = f / fc - fc / f; return -d / (1 + Q * Q * x * x); }
        case 'hpf': return AP.db(AP.analogFilter('hp', 'BW4', fc, f));
        case 'porous': { const a0 = 0.05, a1 = P.porousAlpha(f, 12000, 0.1, 0.05); return -10 * Math.log10((a0 + a1 * 0.3) / a0) * (d / 10) * 0.5; }
        case 'bigtrap': { const a0 = 0.05, a1 = P.porousAlpha(f, 7000, 0.3, 0); return -10 * Math.log10((a0 + a1 * 0.25) / a0) * (d / 10) * 0.5; }
        case 'wall': { const L = P.leafProps([{ mat: 'gypsumX', t: 0.0159 }]); return -P.doubleLeafTL({ leaf1: L, leaf2: L, d: 0.09, filled: true, conn: 'wood' }, f).tl; }
        default: return 0;
      }
    }
    const src = () => V.SOURCES_H[st.src];
    const after = () => src().a.map((a, i) => a * Math.pow(10, eff(src().f0 * (i + 1)) / 20));
    pB.onclick = () => { A.audio.stopAll(); playHarm(src().f0, src().a, 3); };
    pA.onclick = () => { A.audio.stopAll(); const a = after(); const m = Math.max(...a); playHarm(src().f0, a.map((x) => x / (st.tool === 'wall' ? m : 1)), 3); };
    sp.onclick = () => A.audio.stopAll();
    const cv = A.canvas(host, {
      height: 320,
      caption: 'Grey bars: the sound’s harmonics before. Coloured bars: after. The curve is what your tool does at each frequency. A narrow tool only touches the harmonics inside its bandwidth; a high-pass or a broadband absorber affects everything on one side; a wall removes the highs far more than the fundamental.',
      draw(ctx, w, h) {
        const s = src(), a = after();
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 5000, log: true, label: 'Frequency (Hz)' }, y: { min: -60, max: 6, label: 'Level (dB re fundamental)' } });
        const curve = []; for (let f = 20; f <= 5000; f *= 1.02) curve.push([f, Math.max(-60, eff(f))]);
        A.plotFill(ctx, ax, curve, A.alpha(A.css('accent2'), 0.1), 0);
        A.plotLine(ctx, ax, curve, A.css('accent2'), 2);
        const ref = st.tool === 'wall' ? 0 : 0;
        s.a.forEach((x, i) => {
          const f = s.f0 * (i + 1); if (f > 5000) return;
          const X = ax.X(f), b = 20 * Math.log10(x + 1e-6) - ref, af = 20 * Math.log10(a[i] + 1e-9) - ref;
          ctx.strokeStyle = A.alpha(A.css('muted'), 0.6); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(X, ax.y0); ctx.lineTo(X, ax.Y(Math.max(-60, b))); ctx.stroke();
          ctx.strokeStyle = i === 0 ? A.css('accent') : A.css('c3'); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X, ax.y0); ctx.lineTo(X, ax.Y(Math.max(-60, af))); ctx.stroke();
          if (i < 6) A.text(ctx, (i + 1) + 'f', X, ax.Y(Math.max(-60, b)) - 6, { align: 'center', size: 10, color: A.css('muted') });
        });
        ctx.lineWidth = 1;
      },
    });
    function upd() {
      const s = src(), a = after();
      const d = s.a.map((x, i) => 20 * Math.log10((a[i] + 1e-9) / (x + 1e-9)));
      const fund = d[0], harm = d.slice(1, 8);
      const maxH = Math.min(...harm), minH = Math.max(...harm);
      out.innerHTML = A.statBox('Fundamental', fmt(fund, 1) + ' dB', fmtHz(s.f0) + ' ' + NOTE(s.f0)) + A.statBox('Harmonics 2–8', `${fmt(minH, 1)} … ${fmt(maxH, 1)} dB`, 'least … most affected') + A.statBox('Pitch you hear', NOTE(s.f0), fund < -12 ? 'still heard via harmonics' : 'unchanged') + A.statBox('Tool bandwidth', st.tool === 'tuned' ? '≈ ' + fmtHz(st.fc / 2.2) : st.tool === 'notch' ? '≈ ' + fmtHz(st.fc / 8) : 'one-sided');
      const msg = {
        tuned: 'A tuned trap works on roughly one octave around its frequency. It lowers the fundamental (and the room mode at that frequency) but leaves the upper harmonics — and the clarity they carry — almost untouched. Harmonics only change if they fall inside its band.',
        notch: 'A narrow notch removes a single frequency: perfect for one resonance or a hum line, invisible to everything else. Note that the 2nd, 3rd… harmonics of a hum need their own notches.',
        hpf: 'A high-pass filter affects everything below its cut-off — here the fundamental. The pitch is still heard (missing fundamental) but the weight is gone. Use HPFs to clean rumble below an instrument’s lowest note, not inside its range.',
        porous: 'A 100 mm porous panel barely touches the fundamental of a bass note but strongly absorbs its upper harmonics. Rooms treated only with thin panels sound dull yet boomy — the classic mistake.',
        bigtrap: 'A deep corner trap works from the low end upward: it reduces the fundamental and everything above it. That is why broadband traps are the default for room modes — they handle the modal harmonic series (1st, 2nd, 3rd mode) at once.',
        wall: 'Walls block high frequencies much more than low ones. Your neighbour hears the fundamental (the thump) while the harmonics that carry the character are gone — design isolation for the fundamental.',
      }[st.tool];
      verdict.innerHTML = `<div class="callout mentor">${msg}</div>`;
      cv.redraw();
    }
    upd();
  };
})();
