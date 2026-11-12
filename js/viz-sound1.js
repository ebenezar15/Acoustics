/* ==========================================================================
   Acoustica — vibration and instruments, hearing in depth, moving and
   extreme sound. Widgets: oscillatorLab, membraneModes, vowelSynth,
   instrumentRadiation, hearingLossSim, loudnessSone, doseCalc, earplugTypes,
   dopplerLab, machCone, steepening, seaChannel. Simplified teaching models.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C = 343;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fill(); };
  const btnRow = (host, defs) => {
    const row = el('div', { class: 'row' });
    const bs = defs.map(([label, icon, primary, fn]) => { const b = el('button', { class: primary ? 'primary' : '', html: A.icon(icon) + ' ' + label }); b.addEventListener('click', fn); row.appendChild(b); return b; });
    host.appendChild(row); return bs;
  };
  const volNote = (host) => host.appendChild(html('<p style="font-size:12px;color:var(--muted);margin:6px 0 10px">Start with your volume low. These are synthesised demonstrations, not calibrated test signals.</p>'));
  /* Bessel function of the first kind, integer order (power series) */
  const Jn = (n, x) => { if (x === 0) return n === 0 ? 1 : 0; let term = Math.pow(x / 2, n); for (let i = 2; i <= n; i++) term /= i; let s = 0; for (let k = 0; k < 60; k++) { s += term; term *= -(x * x / 4) / ((k + 1) * (k + 1 + n)); } return s; };
  const BANDS = [125, 250, 500, 1000, 2000, 4000, 8000];
  /* a chain of octave filters that imposes a set of gains (dB) on whatever passes */
  function shapeChain(ctx, gains) {
    const fs = BANDS.map((f, i) => { const b = ctx.createBiquadFilter(); b.type = i === 0 ? 'lowshelf' : i === BANDS.length - 1 ? 'highshelf' : 'peaking'; b.frequency.value = i === 0 ? 180 : i === BANDS.length - 1 ? 6000 : f; b.Q.value = 1.3; b.gain.value = clamp(gains[i] * 0.75, -40, 12); return b; });
    for (let i = 0; i < fs.length - 1; i++) fs[i].connect(fs[i + 1]);
    return { input: fs[0], output: fs[fs.length - 1], update(g) { fs.forEach((b, i) => b.gain.setTargetAtTime(clamp(g[i] * 0.75, -40, 12), ctx.currentTime, 0.05)); } };
  }
  const VOW = { ee: ['“ee” as in see', [270, 2290, 3010]], eh: ['“eh” as in bed', [530, 1840, 2480]], ah: ['“ah” as in father', [730, 1090, 2440]], aw: ['“aw” as in saw', [570, 840, 2410]], oo: ['“oo” as in boot', [300, 870, 2240]], er: ['“er” as in bird', [490, 1350, 1690]] };
  const BW = [80, 100, 140, 200, 260];
  const formantDb = (f, F) => { let d = 0; for (let i = 0; i < F.length; i++) { const r = f / F[i], q = F[i] / BW[i]; d += -10 * Math.log10(Math.pow(1 - r * r, 2) + Math.pow(r / q, 2)); } return d - 6 * Math.log2(Math.max(f, 50) / 100); };
  /* four-second loopable test signals, synthesised once per kind */
  const sigCache = {};
  function makeSig(ctx, kind) {
    const key = kind + ctx.sampleRate; if (sigCache[key]) return sigCache[key];
    const sr = ctx.sampleRate, n = Math.floor(sr * 4), buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    const burst = (t0, dur, amp, bright) => { let prev = 0; const a = Math.floor(t0 * sr), m = Math.floor(dur * sr); for (let i = 0; i < m && a + i < n; i++) { const wn = Math.random() * 2 - 1, e = Math.sin((Math.PI * i) / m); d[a + i] += amp * e * (bright ? wn - prev : (wn + prev) / 2); prev = wn; } };
    if (kind === 'speech') {
      const syl = [['ah', 118, 0.05, 0.24, 's'], ['ee', 132, 0.42, 0.2, 't'], ['oo', 110, 0.74, 0.24, 'f'], ['eh', 125, 1.1, 0.22, 's'], ['aw', 104, 1.5, 0.3, 'k'], ['ee', 138, 2.05, 0.2, 's'], ['er', 120, 2.36, 0.22, 't'], ['ah', 112, 2.72, 0.26, 'f'], ['eh', 128, 3.1, 0.2, 's'], ['oo', 100, 3.42, 0.34, 't']];
      for (const [v, f0, t0, dur, cons] of syl) {
        burst(t0, cons === 's' ? 0.09 : 0.04, cons === 's' ? 0.22 : cons === 'f' ? 0.1 : 0.3, true);
        const F = VOW[v][1], a = Math.floor((t0 + 0.07) * sr), m = Math.floor(dur * sr), hs = [];
        for (let k = 1; k * f0 < 4200; k++) hs.push([k * f0, Math.pow(10, formantDb(k * f0, F) / 20)]);
        const peak = Math.max(...hs.map((x) => x[1]));
        for (let i = 0; i < m && a + i < n; i++) { const tt = i / sr, e = Math.min(1, tt / 0.02) * Math.min(1, (dur - tt) / 0.05), gl = 1 - 0.06 * (tt / dur); let s = 0; for (const [f, g] of hs) s += g * Math.sin(TAU * f * gl * tt); d[a + i] += (0.3 * e * s) / peak; }
      }
    } else {
      const notes = [220, 261.6, 329.6, 440, 392, 329.6, 261.6, 293.7];
      notes.forEach((f, j) => { const a = Math.floor(j * 0.5 * sr), m = Math.floor(0.95 * sr); for (let i = 0; i < m; i++) { const tt = i / sr; let s = 0; for (let k = 1; k <= 14; k++) s += (Math.sin(TAU * f * k * tt) / k) * Math.exp(-tt * (2 + k * 1.1)); const idx = (a + i) % n; d[idx] += 0.2 * Math.min(1, tt / 0.004) * s; } });
      for (let j = 0; j < 4; j++) { const a = Math.floor(j * sr), m = Math.floor(0.9 * sr); for (let i = 0; i < m && a + i < n; i++) { const tt = i / sr; d[a + i] += 0.22 * Math.sin(TAU * (j % 2 ? 82.4 : 110) * tt) * Math.exp(-tt * 2.5) * Math.min(1, tt / 0.01); } }
      for (let j = 0; j < 16; j++) burst(j * 0.25, 0.05, j % 4 === 2 ? 0.28 : 0.14, true);
    }
    let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(d[i])); for (let i = 0; i < n; i++) d[i] *= 0.7 / (pk || 1);
    sigCache[key] = buf; return buf;
  }

  /* ======================================================================
     1. Oscillator lab — mass, spring, damper
     ====================================================================== */
  V.oscillatorLab = function (host) {
    const st = A.controls(host, [
      { key: 'f0', label: 'Natural frequency', type: 'range', min: 40, max: 880, step: 1, value: 220, fmt: (v) => fmtHz(v) },
      { key: 'q', label: 'Q — how lightly damped it is', type: 'range', min: 0, max: 2.3, step: 0.01, value: 1.2, fmt: (v) => fmt(Math.pow(10, v), 1) },
      { key: 'view', label: 'Experiment', type: 'select', value: 'free', options: [['free', 'Strike it once — watch it ring down'], ['drive', 'Push it steadily — the resonance curve']] },
      { key: 'r', label: 'Push frequency (× natural)', type: 'range', min: 0.25, max: 3, step: 0.01, value: 1, fmt: (v) => '× ' + fmt(v, 2) },
    ], () => upd());
    btnRow(host, [['Hear it struck', 'play', true, () => play()], ['Stop', 'stop', false, () => A.audio.stopAll()]]);
    volNote(host);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const Q = () => Math.pow(10, st.q);
    const gain = (r, q) => 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(r / q, 2));
    const cv = A.canvas(host, {
      height: 280, animate: true,
      caption: 'Left: a weight on a spring, in slow motion. Right: either the ring-down after one strike, or how strongly the weight responds when it is pushed at different frequencies — the marker shows the push frequency you chose.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t), q = Q(), lw = Math.min(120, w * 0.27), cx = lw / 2, fv = 1.1;
        let y = 0, drv = 0;
        if (st.view === 'free') { const tau = (tt % 4.5); y = Math.exp((-Math.PI * fv * tau) / q) * Math.cos(TAU * fv * tau); }
        else { const g = gain(st.r, q), ph = Math.atan2(st.r / q, 1 - st.r * st.r), amp = Math.min(1, Math.sqrt(g / Math.max(1, q))); drv = Math.cos(TAU * fv * st.r * tt); y = amp * Math.cos(TAU * fv * st.r * tt - ph); }
        const top = 22 + drv * 7, rest = h * 0.55, my = rest + y * h * 0.2;
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 30, top); ctx.lineTo(cx + 30, top); ctx.stroke();
        ctx.lineWidth = 2; ctx.strokeStyle = A.css('accent'); ctx.beginPath(); ctx.moveTo(cx, top);
        const turns = 9; for (let i = 1; i <= turns; i++) ctx.lineTo(cx + (i % 2 ? 11 : -11), top + ((my - 18 - top) * i) / (turns + 1)); ctx.lineTo(cx, my - 18); ctx.stroke();
        ctx.fillStyle = A.css('accent2'); ctx.fillRect(cx - 24, my - 18, 48, 36); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 1; ctx.strokeRect(cx - 24, my - 18, 48, 36);
        A.text(ctx, 'mass', cx, my + 4, { size: 10, align: 'center', weight: 700, color: A.css('panel') });
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.6); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(6, rest); ctx.lineTo(lw - 4, rest); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, st.view === 'free' ? 'struck once' : 'support is shaken', cx, h - 8, { size: 10, align: 'center', color: A.css('muted') });
        const ox = lw + 4, pw = w - ox;
        ctx.save(); ctx.translate(ox, 0);
        if (st.view === 'free') {
          const tau = q / (Math.PI * st.f0), T = 6.91 * tau * 1.1, cyc = st.f0 * T;
          const ax = A.axes(ctx, pw, h, { x: { min: 0, max: T * 1000, label: 'time after the strike (ms)' }, y: { min: -1, max: 1, label: 'motion' }, pad: { l: 40 } });
          const env = [], envn = []; for (let i = 0; i <= 120; i++) { const x = (i / 120) * T; env.push([x * 1000, Math.exp(-x / tau)]); envn.push([x * 1000, -Math.exp(-x / tau)]); }
          if (cyc <= 60) { const pts = []; for (let i = 0; i <= 900; i++) { const x = (i / 900) * T; pts.push([x * 1000, Math.exp(-x / tau) * Math.cos(TAU * st.f0 * x)]); } A.plotLine(ctx, ax, pts, A.css('accent'), 1.6); }
          else { A.plotFill(ctx, ax, env, A.alpha(A.css('accent'), 0.35), 0); A.plotFill(ctx, ax, envn, A.alpha(A.css('accent'), 0.35), 0); }
          A.plotLine(ctx, ax, env, A.css('text'), 1.5, [5, 4]); A.plotLine(ctx, ax, envn, A.css('text'), 1.5, [5, 4]);
        } else {
          const ax = A.axes(ctx, pw, h, { x: { min: 0.25, max: 3, log: true, ticks: [0.25, 0.5, 1, 2, 3], label: 'push frequency ÷ natural frequency' }, y: { min: -20, max: 48, label: 'response (dB)' }, pad: { l: 44 } });
          const pts = []; for (let i = 0; i <= 300; i++) { const r = 0.25 * Math.pow(12, i / 300); pts.push([r, 20 * Math.log10(gain(r, q))]); }
          A.plotLine(ctx, ax, pts, A.css('accent'), 2.4);
          const g = 20 * Math.log10(gain(st.r, q)); dot(ctx, ax.X(st.r), ax.Y(clamp(g, -20, 48)), 6, A.css('bad'));
          A.text(ctx, (g >= 0 ? '+' : '') + fmt(g, 1) + ' dB', clamp(ax.X(st.r) + 10, ax.x0 + 4, ax.x1 - 60), ax.Y(clamp(g, -20, 48)) - 8, { size: 11, weight: 700 });
        }
        ctx.restore();
      },
    });
    function play() { A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return; const tau = Math.max(0.004, Q() / (Math.PI * st.f0)), o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime; o.frequency.value = st.f0; g.gain.setValueAtTime(0.35, t); g.gain.setTargetAtTime(0, t + 0.002, tau); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + Math.min(8, tau * 9 + 0.1)); A.audio.track(o); }
    function upd() {
      const q = Q(), t60 = (2.2 * q) / st.f0, g = gain(st.r, q), ph = (Math.atan2(st.r / q, 1 - st.r * st.r) * 180) / Math.PI;
      out.innerHTML = A.statBox('Ring-down time (to −60 dB)', t60 < 1 ? fmt(t60 * 1000, 0) + ' ms' : fmt(t60, 2) + ' s', `about ${fmt(2.2 * q, 0)} cycles`) + A.statBox('Width of the resonance', fmtHz(st.f0 / q), 'natural frequency ÷ Q') + A.statBox('Boost exactly at resonance', '+' + fmt(20 * Math.log10(q), 1) + ' dB', `motion × ${fmt(q, 1)}`, q > 20 ? 'warn' : '') + A.statBox('At your push frequency', (g >= 1 ? '+' : '') + fmt(20 * Math.log10(g), 1) + ' dB', `lags the push by ${fmt(ph, 0)}°`);
      tip.innerHTML = `<div class="callout mentor">${q < 2 ? 'Heavily damped. One strike gives a dull thud that is over almost at once, and the resonance curve is a low, broad hill. This is what a good bass trap, a car suspension or a well-damped loudspeaker cone looks like: it responds over a wide range and stores almost nothing.' : q < 15 ? 'Moderately damped. It rings for a handful of cycles and favours a band of frequencies around its own. Guitar bodies, drum heads and treated rooms live here — enough resonance to give character, enough loss to stop quickly.' : 'Lightly damped. It rings on and on — a bell, a wine glass, a tuning fork, or a bass mode in a bare concrete room. The response is a tall, needle-thin peak: enormous at one frequency, indifferent to everything else.'} ${st.view === 'drive' ? (st.r < 0.7 ? 'Pushed well below resonance, the weight simply follows the hand: the <b>spring</b> is in charge.' : st.r > 1.4 ? 'Pushed well above resonance, the weight barely moves and goes the opposite way: the <b>mass</b> is in charge. This is exactly how a floating floor or an isolation mount protects what sits on it.' : 'Near resonance, spring and mass cancel each other and only the <b>damping</b> limits the motion.') : 'High Q and long ring-down are the same fact seen two ways: a narrow resonance must ring for a long time.'}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Membrane and plate modes
     ====================================================================== */
  const JZ = [[2.405, 5.52, 8.654], [3.832, 7.016, 10.173], [5.136, 8.417, 11.62], [6.38, 9.761, 13.015], [7.588, 11.065, 14.373]];
  V.membraneModes = function (host) {
    const st = A.controls(host, [
      { key: 'shape', label: 'Surface', type: 'select', value: 'drum', options: [['drum', 'Round drumhead (stretched skin)'], ['plate', 'Square plate (supported at the edges)']] },
      { key: 'm', label: 'Pattern number m', type: 'range', min: 0, max: 4, step: 1, value: 1, fmt: (v) => String(v) },
      { key: 'n', label: 'Pattern number n', type: 'range', min: 1, max: 3, step: 1, value: 1, fmt: (v) => String(v) },
      { key: 'sand', label: 'Sprinkle sand (it gathers on the still lines)', type: 'check', value: true },
    ], () => upd());
    btnRow(host, [['Hear lowest mode, then this one', 'play', false, () => play(false)], ['Hear one hit — all modes together', 'play', true, () => play(true)], ['Stop', 'stop', false, () => A.audio.stopAll()]]);
    volNote(host);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const ratio = (shape, m, n) => (shape === 'drum' ? JZ[m][n - 1] / JZ[0][0] : ((m + 1) * (m + 1) + n * n) / 2);
    const allModes = (shape) => { const L = []; for (let m = 0; m <= 4; m++) for (let n = 1; n <= 3; n++) L.push([m, n, ratio(shape, m, n)]); return L.sort((a, b) => a[2] - b[2]); };
    const shapeFn = (x, y) => { // x,y in -1..1
      if (st.shape === 'drum') { const r = Math.hypot(x, y); if (r > 1) return null; return Jn(st.m, JZ[st.m][st.n - 1] * r) * Math.cos(st.m * Math.atan2(y, x)); }
      return Math.sin(((st.m + 1) * Math.PI * (x + 1)) / 2) * Math.sin((st.n * Math.PI * (y + 1)) / 2);
    };
    let grid = [], gridKey = '';
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Top view of the vibrating surface. The two tints are regions moving in opposite directions at any instant; the lines between them never move at all. The list shows the first modes in order of pitch, as multiples of the lowest one.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t), R = Math.min(h * 0.44, w * 0.29), cx = R + 12, cy = h / 2, cell = Math.max(4, Math.round((2 * R) / 46));
        const key = [st.shape, st.m, st.n, Math.round(R), cell].join();
        if (key !== gridKey) { gridKey = key; grid = []; let mx = 1e-9; for (let px = -R; px < R; px += cell) for (let py = -R; py < R; py += cell) { const v = shapeFn((px + cell / 2) / R, (py + cell / 2) / R); if (v === null) continue; mx = Math.max(mx, Math.abs(v)); grid.push([px, py, v]); } grid.forEach((g) => { g[2] /= mx; }); }
        const ph = Math.cos(TAU * 0.55 * tt), ca = A.css('accent'), cb = A.css('c3'), tx = A.css('text');
        for (const [px, py, v] of grid) { const z = v * ph; ctx.fillStyle = A.alpha(z >= 0 ? ca : cb, Math.min(0.95, Math.abs(z) * 0.95 + 0.04)); ctx.fillRect(cx + px, cy + py, cell, cell); }
        if (st.sand) { ctx.fillStyle = tx; for (const [px, py, v] of grid) if (Math.abs(v) < 0.07) ctx.fillRect(cx + px + cell / 2 - 1, cy + py + cell / 2 - 1, 2, 2); }
        ctx.strokeStyle = tx; ctx.lineWidth = 2; if (st.shape === 'drum') { ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); } else ctx.strokeRect(cx - R, cy - R, 2 * R, 2 * R); ctx.lineWidth = 1;
        const lx = cx + R + 16, L = allModes(st.shape).slice(0, 10), bw = w - lx - 8, mxr = L[L.length - 1][2], rowH = (h - 34) / L.length;
        A.text(ctx, 'pitch ÷ lowest', lx, 14, { size: 10, color: A.css('muted') });
        L.forEach(([m, n, r], i) => { const yy = 24 + i * rowH, sel = m === st.m && n === st.n; ctx.fillStyle = A.alpha(sel ? ca : A.css('muted'), sel ? 0.9 : 0.3); ctx.fillRect(lx, yy, Math.max(3, (bw * r) / mxr), rowH - 5); A.text(ctx, `(${st.shape === 'drum' ? m : m + 1},${n})  × ${fmt(r, 2)}`, lx + 4, yy + (rowH - 5) / 2 + 4, { size: 10, weight: sel ? 800 : 500 }); });
      },
    });
    function play(all) {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return; const base = st.shape === 'drum' ? 110 : 150, t = ctx.currentTime;
      const ping = (f, when, amp, dec) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(amp, when + 0.004); g.gain.setTargetAtTime(0, when + 0.01, dec); o.connect(g).connect(ctx.destination); o.start(when); o.stop(when + dec * 8 + 0.1); A.audio.track(o); };
      if (all) allModes(st.shape).slice(0, 10).forEach(([, , r], i) => ping(base * r, t, 0.22 / (1 + i * 0.5), st.shape === 'drum' ? 0.16 / (1 + i * 0.25) : 0.5 / (1 + i * 0.2)));
      else { ping(base, t, 0.3, 0.3); ping(base * ratio(st.shape, st.m, st.n), t + 0.9, 0.3, 0.3); }
    }
    function upd() {
      const r = ratio(st.shape, st.m, st.n), near = Math.round(r), off = 1200 * Math.log2(r / Math.max(1, near));
      out.innerHTML = A.statBox('This mode', `(${st.shape === 'drum' ? st.m : st.m + 1},${st.n})`, st.shape === 'drum' ? `${st.m} still line${st.m === 1 ? '' : 's'} across, ${st.n - 1} still ring${st.n === 2 ? '' : 's'} inside` : `${st.m + 1} × ${st.n} patches`) + A.statBox('Pitch ÷ lowest mode', '× ' + fmt(r, 3), st.shape === 'drum' ? 'from the zeros of a Bessel function' : '(m² + n²) ÷ 2') + A.statBox('Nearest whole-number harmonic', '× ' + near, Math.abs(off) < 12 ? 'almost in tune with it' : `${fmt(Math.abs(off), 0)} cents ${off > 0 ? 'sharp' : 'flat'} of it`, Math.abs(off) < 12 ? 'good' : 'warn') + A.statBox('Opposite-moving patches', String(st.shape === 'drum' ? Math.max(1, 2 * st.m) * st.n : (st.m + 1) * st.n), 'neighbours cancel each other in the air');
      tip.innerHTML = `<div class="callout mentor">${st.shape === 'drum' ? 'A string’s overtones are whole multiples of its fundamental, so we hear one clear note. A round skin’s overtones fall at × 1.59, × 2.14, × 2.30, × 2.65… — they do not line up, so the ear cannot fuse them into one pitch. That is why a tom says “doom” rather than a clean note, and why a kettledrum needs the air trapped in its bowl to pull the modes towards a musical series.' : 'A plate is stiff, so its overtones spread out even faster than a membrane’s. Sand shaken on a real plate collects along the lines that do not move, drawing these patterns — instrument makers still use the trick to judge a soundboard before the instrument is assembled.'} ${st.m === 0 && st.n === 1 && st.shape === 'drum' ? 'The lowest mode moves the whole skin in one direction, so it pumps air efficiently: lots of sound, quickly spent.' : 'Notice the neighbouring patches moving in opposite directions: at low frequencies their sound largely cancels in the air, so higher modes ring longer but radiate less.'}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Vowel synthesiser — source and filter
     ====================================================================== */
  V.vowelSynth = function (host) {
    const st = A.controls(host, [
      { key: 'vowel', label: 'Vowel', type: 'select', value: 'ah', options: Object.entries(VOW).map(([k, v]) => [k, v[0]]) },
      { key: 'pitch', label: 'Pitch of the vocal folds', type: 'range', min: 70, max: 900, step: 1, value: 120, fmt: (v) => fmtHz(v) },
      { key: 'size', label: 'Vocal tract', type: 'select', value: '1', options: [['1', 'Long (typical adult man)'], ['1.17', 'Medium (typical adult woman)'], ['1.35', 'Short (child)']] },
      { key: 'vib', label: 'Add vibrato', type: 'check', value: false },
    ], () => upd());
    let live = null;
    btnRow(host, [['Sing', 'play', true, () => play()], ['Stop', 'stop', false, () => { A.audio.stopAll(); live = null; }]]);
    volNote(host);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const F = () => VOW[st.vowel][1].map((f) => f * +st.size);
    const cv = A.canvas(host, {
      height: 270,
      caption: 'The smooth curve is the shape the throat and mouth impose (the filter). The vertical stems are the harmonics produced by the vocal folds (the source), spaced by the pitch. What reaches the listener is the stems, cut to the height of the curve.',
      draw(ctx, w, h) {
        const f = [...F(), 3500 * +st.size, 4500 * +st.size], ax = A.axes(ctx, w, h, { x: { min: 60, max: 5000, log: true, label: 'frequency (Hz)' }, y: { min: -60, max: 6, label: 'level (dB)' } });
        const pts = []; let mx = -1e9; for (let i = 0; i <= 260; i++) { const x = 60 * Math.pow(5000 / 60, i / 260), d = formantDb(x, f); mx = Math.max(mx, d); pts.push([x, d]); }
        pts.forEach((p) => { p[1] -= mx; });
        A.plotLine(ctx, ax, pts, A.css('accent2'), 2, [6, 4]);
        ctx.save(); ctx.beginPath(); ctx.rect(ax.x0, ax.y1, ax.x1 - ax.x0, ax.y0 - ax.y1); ctx.clip();
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = Math.max(1.2, Math.min(3, st.pitch / 60));
        for (let k = 1; k * st.pitch < 5000; k++) { const x = k * st.pitch, d = formantDb(x, f) - mx; ctx.beginPath(); ctx.moveTo(ax.X(x), ax.y0); ctx.lineTo(ax.X(x), ax.Y(Math.max(-60, d))); ctx.stroke(); }
        ctx.restore();
        f.slice(0, 3).forEach((x, i) => { if (x < 5000) A.text(ctx, 'F' + (i + 1), ax.X(x), ax.y1 + 12, { size: 11, weight: 800, align: 'center' }); });
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'harmonics from the vocal folds'], [A.css('accent2'), 'vocal-tract filter (formants)', true]]));
    function play() {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return;
      const o = ctx.createOscillator(), lfo = ctx.createOscillator(), lg = ctx.createGain(), master = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = st.pitch; lfo.frequency.value = 5.5; lg.gain.value = st.vib ? st.pitch * 0.02 : 0; lfo.connect(lg).connect(o.frequency);
      master.gain.setValueAtTime(0, ctx.currentTime); master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.08);
      const fl = F().map((f, i) => { const b = ctx.createBiquadFilter(), g = ctx.createGain(); b.type = 'bandpass'; b.frequency.value = f; b.Q.value = f / (BW[i] * 1.6); g.gain.value = [1, 0.55, 0.3][i]; o.connect(b).connect(g).connect(master); return b; });
      master.connect(ctx.destination); o.start(); lfo.start(); o.stop(ctx.currentTime + 20); lfo.stop(ctx.currentTime + 20); A.audio.track(o); A.audio.track(lfo); live = { ctx, o, lg, fl };
    }
    function upd() {
      const f = F();
      if (live) { try { const t = live.ctx.currentTime; live.o.frequency.setTargetAtTime(st.pitch, t, 0.03); live.lg.gain.setTargetAtTime(st.vib ? st.pitch * 0.02 : 0, t, 0.05); live.fl.forEach((b, i) => { b.frequency.setTargetAtTime(f[i], t, 0.03); b.Q.setTargetAtTime(f[i] / (BW[i] * 1.6), t, 0.03); }); } catch (e) { live = null; } }
      const nH = Math.floor(5000 / st.pitch), tube = C / (4 * (0.17 / +st.size));
      out.innerHTML = A.statBox('First formant F1', fmtHz(f[0]), 'set mostly by how open the jaw is') + A.statBox('Second formant F2', fmtHz(f[1]), 'set mostly by tongue position') + A.statBox('Harmonics below 5 kHz', String(nH), `one every ${fmtHz(st.pitch)}`, nH < 8 ? 'warn' : '') + A.statBox('Neutral tube resonance', fmtHz(tube), 'quarter-wave of the tract length');
      tip.innerHTML = `<div class="callout mentor">${st.pitch > f[0] ? '<b>The pitch is now above the first formant.</b> No harmonic falls on F1, so the cue that tells “ah” from “oo” has nothing to light it up — every vowel starts to sound alike. Trained high voices deal with this by opening the jaw to drag F1 up to the note, which is why sung words are hard to understand on top notes.' : st.pitch > 300 ? 'With the harmonics this far apart, the formant curve is only sampled at a few points. The vowel is still recognisable but less vivid than at speaking pitch.' : 'At speaking pitch the harmonics are close together, so they trace out the formant curve in detail and the vowel is unmistakable.'} Change the pitch and the peaks stay put; change the vowel and the stems stay put. That independence is the whole idea of the source–filter model — and the reason an equaliser boost near 2–4 kHz adds “presence” to any voice at any pitch.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Instrument radiation
     ====================================================================== */
  const INST = {
    violin: { name: 'Violin', fund: [196, 3136], over: 16000, lvl: '60–95 dB', front: 'the top plate faces up the page', pat: [[0.88, [[0, 1, 1]]], [0.45, [[0, 1.5, 1]]], [0.14, [[20, 5, 1], [-50, 7, 0.6]]]], mic: ['Below about 500 Hz the body is small beside the wavelength and sound goes everywhere, so the low warmth is the same from any side.', 'Around 1 kHz the top plate starts to aim the sound outward from the face of the instrument.', 'The high harmonics leave in narrow, shifting beams square to the top plate. A microphone right in the beam hears every scratch of the bow.'], hint: 'Mic 1–2 m away, above the player and looking down at the top plate. Closer and on-axis is edgy; from the side or behind it turns dull.' },
    trumpet: { name: 'Trumpet', fund: [165, 1050], over: 12000, lvl: '75–110 dB', front: 'the bell points up the page', pat: [[0.82, [[0, 1, 1]]], [0.38, [[0, 2.2, 1]]], [0.06, [[0, 10, 1]]]], mic: ['The lowest notes spread nearly evenly from the bell — the bell is small compared with a wavelength of a metre or two.', 'Through the middle range the bell begins to behave like a horn and pushes the sound forwards.', 'Above about 2 kHz the brilliance leaves as a tight beam straight down the bell axis.'], hint: 'On the bell axis is the brightest, hardest sound. Move the mic 20–40° off-axis, or back to 1 m or more, for a rounder tone.' },
    flute: { name: 'Flute', fund: [262, 2093], over: 9000, lvl: '60–95 dB', front: 'the player faces up the page; the tube lies left–right', pat: [[0.8, [[0, 1, 1]]], [0.35, [[35, 2, 1], [-35, 2, 1]]], [0.3, [[0, 2.5, 1], [70, 5, 0.5], [-70, 5, 0.5]]]], mic: ['Sound leaves from the mouth hole and the first open finger hole. At low notes those two openings act almost as one small source.', 'When the two openings are about half a wavelength apart they interfere, giving lobes and dips that move as the fingering changes.', 'The breath noise comes from the mouth hole alone, and the highest partials leave in several lobes along the tube.'], hint: 'Mic above and in front, 30–60 cm from the player, between the mouth and the hands. Too close to the lips collects breath noise; do not mic the open end.' },
    piano: { name: 'Grand piano (lid open)', fund: [27.5, 4186], over: 10000, lvl: '60–100 dB', front: 'the open side of the lid faces up the page', pat: [[0.92, [[0, 1, 1]]], [0.5, [[0, 1.5, 1]]], [0.18, [[0, 3.5, 1]]]], mic: ['The soundboard is over a metre across, yet for the bass it is still small beside the wavelength: the low end surrounds the instrument and excites the room.', 'In the middle range the raised lid acts as a mirror, throwing sound out of the open side toward the audience.', 'The top end comes off the soundboard and lid as a fairly narrow fan out of the open side; behind the lid it is noticeably dull.'], hint: 'A pair on the open side, 1–2 m out, sees soundboard and lid together. Inside the lid is brighter and more percussive; on the closed side it is dull.' },
    voice: { name: 'Singing voice', fund: [82, 1050], over: 12000, lvl: '60–105 dB', front: 'the singer faces up the page', pat: [[0.82, [[0, 1, 1]]], [0.55, [[0, 1.2, 1]]], [0.22, [[0, 2.6, 1]]]], mic: ['The mouth is tiny compared with these wavelengths, so the body of the voice goes almost equally in every direction, bending round the head.', 'The head begins to cast a shadow: there is clearly less behind the singer than in front.', 'Consonants and “air” are projected forwards and slightly downwards. Behind the singer they are largely missing, which is why speech from behind is hard to follow.'], hint: 'In front, 15–30 cm, at mouth height or just above and angled down. Aiming slightly off the mouth axis softens harsh “s” sounds and plosive blasts.' },
    kick: { name: 'Kick drum', fund: [45, 110], over: 6000, lvl: '95–115 dB peaks', front: 'the front (resonant) head faces up the page', pat: [[0.3, [[0, 1.2, 1], [180, 1.2, 1]]], [0.3, [[0, 1.5, 0.8], [180, 1.5, 1]]], [0.12, [[180, 4, 1], [0, 3, 0.45]]]], mic: ['The two heads move the air in opposite senses, so the lowest thump leaves front and back and partly cancels to the sides — a figure-of-eight.', 'The body of the note comes from both heads; the shell adds little.', 'The click of the beater lives on the batter side. From the front you hear it only through the port hole.'], hint: 'For click, put a mic inside near the beater. For boom, place one just outside the front head. Blend the two — and check their polarity.' },
  };
  V.instrumentRadiation = function (host) {
    const st = A.controls(host, [
      { key: 'inst', label: 'Instrument', type: 'select', value: 'violin', options: Object.entries(INST).map(([k, v]) => [k, v.name]) },
      { key: 'band', label: 'Part of the sound', type: 'select', value: '2', numeric: true, options: [[0, 'Low — warmth and body'], [1, 'Middle — the note itself'], [2, 'High — bite, air and detail']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const pat = (p, deg) => { let s = 0; for (const [th, pw, wt] of p[1]) { const c = Math.cos(((deg - th) * Math.PI) / 180); if (c > 0) s += wt * Math.pow(c, pw); } return Math.min(1, p[0] + (1 - p[0]) * Math.min(1, s)); };
    const cv = A.canvas(host, {
      height: 330,
      caption: 'Seen from above, schematic. The further a curve reaches from the centre, the more of that part of the sound goes in that direction; the rings are 6 dB apart. The bar underneath shows where the instrument’s notes and overtones sit in the hearing range.',
      draw(ctx, w, h) {
        const I = INST[st.inst], cx = w / 2, R = Math.min(w * 0.36, 112), cy = R + 26, cols = [A.css('c3'), A.css('accent2'), A.css('accent')];
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.4); [1, 2 / 3, 1 / 3].forEach((k) => { ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, TAU); ctx.stroke(); });
        ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
        const rad = (v) => R * clamp(1 + (20 * Math.log10(Math.max(v, 0.01))) / 18, 0.04, 1);
        I.pat.forEach((p, i) => { const sel = i === st.band; ctx.beginPath(); for (let d = 0; d <= 360; d += 3) { const r = rad(pat(p, d > 180 ? d - 360 : d)), a = (d * Math.PI) / 180, x = cx + r * Math.sin(a), y = cy - r * Math.cos(a); d ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); if (sel) { ctx.fillStyle = A.alpha(cols[i], 0.25); ctx.fill(); } ctx.strokeStyle = cols[i]; ctx.lineWidth = sel ? 3 : 1.2; ctx.stroke(); });
        ctx.lineWidth = 1; dot(ctx, cx, cy, 5, A.css('text'));
        A.text(ctx, 'front', cx, cy - R - 8, { size: 11, weight: 700, align: 'center' }); A.text(ctx, 'back', cx, cy + R + 14, { size: 10, align: 'center', color: A.css('muted') });
        const by = h - 44, x0 = 14, x1 = w - 14, X = (f) => x0 + ((Math.log10(f) - Math.log10(20)) / 3) * (x1 - x0);
        ctx.fillStyle = A.alpha(A.css('muted'), 0.15); ctx.fillRect(x0, by, x1 - x0, 14);
        ctx.fillStyle = A.alpha(A.css('accent2'), 0.35); ctx.fillRect(X(I.fund[0]), by, X(I.over) - X(I.fund[0]), 14);
        ctx.fillStyle = A.css('accent'); ctx.fillRect(X(I.fund[0]), by, X(I.fund[1]) - X(I.fund[0]), 14);
        [20, 100, 1000, 10000, 20000].forEach((f) => { ctx.fillStyle = A.css('muted'); ctx.fillRect(X(f), by + 14, 1, 5); A.text(ctx, f >= 1000 ? f / 1000 + 'k' : String(f), X(f), by + 31, { size: 10, align: f === 20 ? 'left' : f === 20000 ? 'right' : 'center', color: A.css('muted') }); });
        A.text(ctx, 'notes (fundamentals)  ·  overtones reach further', x0, by - 6, { size: 10, color: A.css('muted') });
      },
    });
    host.appendChild(A.legend([[A.css('c3'), 'low'], [A.css('accent2'), 'middle'], [A.css('accent'), 'high']]));
    function upd() {
      const I = INST[st.inst], p = I.pat[st.band], fr = pat(p, 0), bk = pat(p, 180), sd = pat(p, 90);
      out.innerHTML = A.statBox('Notes it plays', `${fmtHz(I.fund[0])} – ${fmtHz(I.fund[1])}`, `overtones to about ${fmtHz(I.over)}`) + A.statBox('Typical level at 1 m', I.lvl, 'soft to loud playing') + A.statBox('Side compared with front', fmt(20 * Math.log10(sd / fr), 0) + ' dB', 'in the chosen band') + A.statBox('Back compared with front', fmt(20 * Math.log10(bk / fr), 0) + ' dB', 'in the chosen band', bk / fr < 0.4 ? 'warn' : '');
      tip.innerHTML = `<div class="callout mentor"><b>${I.name} — ${['low', 'middle', 'high'][st.band]} range.</b> ${I.mic[st.band]} <br><b>Where to put a microphone:</b> ${I.hint} <span style="color:var(--muted)">(In this sketch ${I.front}.)</span></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Hearing-loss simulator
     ====================================================================== */
  const HL = {
    normal: ['Healthy young ears', [5, 5, 5, 5, 5, 5, 10], 'Everything is audible. Soft consonants such as “s”, “f” and “t” are clear, cymbals shimmer.'],
    mild: ['Early high-frequency loss', [10, 10, 10, 15, 25, 40, 50], 'Vowels are as loud as ever, so speech does not seem quiet — it seems <i>mumbled</i>. The soft, high consonants are the first to go; so do the top of cymbals and the “air” on a vocal.'],
    notch: ['Noise damage — the dip around 4 kHz', [5, 5, 10, 10, 20, 55, 30], 'The classic mark left by years of loud sound: a dip centred near 4 kHz, where the ear canal’s own resonance concentrates the energy. It sits exactly where consonants carry their meaning.'],
    age: ['Typical age-related loss (around 70 years)', [15, 15, 20, 25, 40, 55, 70], 'A steady slope down towards the treble. Bass and warmth survive; brilliance and intelligibility do not. In a noisy restaurant, conversation becomes guesswork.'],
    severe: ['Severe high-frequency loss', [20, 20, 30, 45, 65, 80, 90], 'Only the low part of the voice gets through. Without hearing aids, speech is a rhythm of vowels with almost no consonants.'],
  };
  V.hearingLossSim = function (host) {
    const st = A.controls(host, [
      { key: 'prof', label: 'Hearing', type: 'select', value: 'notch', options: Object.entries(HL).map(([k, v]) => [k, v[0]]) },
      { key: 'sig', label: 'Listen to', type: 'select', value: 'speech', options: [['speech', 'A speech-like voice'], ['music', 'A music-like phrase with cymbals']] },
      { key: 'tin', label: 'Add tinnitus (a constant high tone)', type: 'check', value: false },
    ], () => upd());
    let live = null;
    btnRow(host, [['Hear it with healthy ears', 'play', false, () => play(true)], ['Hear it with this hearing', 'play', true, () => play(false)], ['Stop', 'stop', false, () => { A.audio.stopAll(); live = null; }]]);
    volNote(host);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const gains = (k) => HL[k][1].map((v, i) => -(v - HL.normal[1][i]));
    const cv = A.canvas(host, {
      height: 290,
      caption: 'An audiogram: how much louder than normal a tone must be before this ear detects it. Up is better. The shaded patch is roughly where the sounds of conversational speech fall — vowels to the lower left, soft consonants to the upper right.',
      draw(ctx, w, h) {
        const x0 = 50, x1 = w - 14, y0 = 20, y1 = h - 38, X = (f) => x0 + (Math.log2(f / 125) / 6) * (x1 - x0), Y = (d) => y0 + ((d + 10) / 110) * (y1 - y0);
        [[-10, 20, 'good', 'normal'], [20, 40, 'warn', 'mild'], [40, 70, 'accent2', 'moderate'], [70, 100, 'bad', 'severe']].forEach(([a, b, c, l]) => { ctx.fillStyle = A.alpha(A.css(c), 0.1); ctx.fillRect(x0, Y(a), x1 - x0, Y(b) - Y(a)); A.text(ctx, l, x1 - 4, Y(a) + 12, { size: 10, align: 'right', color: A.css('muted') }); });
        ctx.fillStyle = A.alpha(A.css('accent'), 0.22); ctx.beginPath(); ctx.moveTo(X(200), Y(30)); ctx.quadraticCurveTo(X(500), Y(15), X(2500), Y(20)); ctx.lineTo(X(6500), Y(30)); ctx.quadraticCurveTo(X(4000), Y(55), X(1000), Y(58)); ctx.quadraticCurveTo(X(250), Y(62), X(200), Y(30)); ctx.fill();
        A.text(ctx, 'speech', X(700), Y(40), { size: 11, weight: 700, align: 'center' });
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.35); ctx.fillStyle = A.css('muted');
        BANDS.forEach((f) => { ctx.beginPath(); ctx.moveTo(X(f), y0); ctx.lineTo(X(f), y1); ctx.stroke(); A.text(ctx, f >= 1000 ? f / 1000 + 'k' : String(f), X(f), y1 + 14, { size: 10, align: 'center', color: A.css('muted') }); });
        for (let d = 0; d <= 100; d += 20) { ctx.beginPath(); ctx.moveTo(x0, Y(d)); ctx.lineTo(x1, Y(d)); ctx.stroke(); A.text(ctx, String(d), x0 - 6, Y(d) + 4, { size: 10, align: 'right', color: A.css('muted') }); }
        A.text(ctx, 'frequency (Hz)', (x0 + x1) / 2, h - 6, { size: 11, align: 'center', color: A.css('muted') });
        ctx.save(); ctx.translate(12, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); A.text(ctx, 'hearing loss (dB)', 0, 0, { size: 11, align: 'center', color: A.css('muted') }); ctx.restore();
        const v = HL[st.prof][1]; ctx.strokeStyle = A.css('bad'); ctx.lineWidth = 2.5; ctx.beginPath(); v.forEach((d, i) => (i ? ctx.lineTo(X(BANDS[i]), Y(d)) : ctx.moveTo(X(BANDS[i]), Y(d)))); ctx.stroke(); ctx.lineWidth = 1;
        v.forEach((d, i) => { dot(ctx, X(BANDS[i]), Y(d), 5, A.css('bad')); dot(ctx, X(BANDS[i]), Y(d), 2.4, A.css('panel')); });
      },
    });
    function play(healthy) {
      A.audio.stopAll(); live = null; const ctx = A.audio.get(); if (!ctx) return;
      const s = ctx.createBufferSource(); s.buffer = makeSig(ctx, st.sig); s.loop = true; const ch = shapeChain(ctx, healthy ? BANDS.map(() => 0) : gains(st.prof)), g = ctx.createGain(); g.gain.value = 0.7;
      s.connect(ch.input); ch.output.connect(g).connect(ctx.destination); s.start(); s.stop(ctx.currentTime + 24); A.audio.track(s);
      if (st.tin && !healthy) { const o = ctx.createOscillator(), tg = ctx.createGain(); o.frequency.value = 6200; tg.gain.value = 0.012; o.connect(tg).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 24); A.audio.track(o); }
      if (!healthy) live = { ch };
    }
    function upd() {
      const v = HL[st.prof][1], pta = (v[2] + v[3] + v[4]) / 3, hf = (v[4] + v[5] + v[6]) / 3;
      if (live) { try { live.ch.update(gains(st.prof)); } catch (e) { live = null; } }
      out.innerHTML = A.statBox('Average loss, 500 Hz – 2 kHz', fmt(pta, 0) + ' dB', pta <= 20 ? 'within the normal range' : pta <= 40 ? 'mild' : pta <= 70 ? 'moderate' : 'severe', pta <= 20 ? 'good' : pta <= 40 ? 'warn' : 'bad') + A.statBox('Average loss, 2 – 8 kHz', fmt(hf, 0) + ' dB', 'where consonants and “air” live', hf <= 20 ? 'good' : hf <= 40 ? 'warn' : 'bad') + A.statBox('Loss at 4 kHz', v[5] + ' dB', 'the first place noise damage shows') + A.statBox('Bass (125–250 Hz)', v[0] + ' dB', 'usually the last to go');
      tip.innerHTML = `<div class="callout mentor"><b>${HL[st.prof][0]}.</b> ${HL[st.prof][2]} ${st.tin ? 'The added tone imitates tinnitus: for many people with noise damage it never switches off, and it is loudest in a quiet room.' : ''}</div><div class="callout warn">This demonstration only removes level. Real damage also blurs pitch and timing and makes loud sounds uncomfortable sooner, so turning the volume up does not restore what was lost — and neither, fully, does a hearing aid. It is a teaching sketch, not a hearing test.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     6. Loudness — decibels, phons and sones
     ====================================================================== */
  const contourAt = (phon, f) => { const c = P.equalLoudness(phon), lf = Math.log10(f); if (f <= c[0][0]) return c[0][1]; for (let i = 1; i < c.length; i++) if (f <= c[i][0]) { const a = c[i - 1], b = c[i], k = (lf - Math.log10(a[0])) / (Math.log10(b[0]) - Math.log10(a[0])); return a[1] + k * (b[1] - a[1]); } return c[c.length - 1][1]; };
  const phonOf = (L, f) => { let lo = -10, hi = 120; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; contourAt(m, f) < L ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
  const sones = (ph) => (ph >= 40 ? Math.pow(2, (ph - 40) / 10) : Math.pow(Math.max(ph, 0) / 40, 2.642));
  V.loudnessSone = function (host) {
    const st = A.controls(host, [
      { key: 'f', label: 'Frequency of the tone', type: 'range', min: Math.log10(25), max: Math.log10(12500), step: 0.005, value: Math.log10(80), fmt: (x) => fmtHz(Math.pow(10, x)) },
      { key: 'L', label: 'Its level', type: 'range', min: 10, max: 110, step: 1, value: 70, unit: 'dB SPL' },
      { key: 'd', label: 'Then change the level by', type: 'range', min: -20, max: 20, step: 1, value: 10, fmt: (v) => (v > 0 ? '+' : '') + v + ' dB' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Each curve joins tones that sound equally loud to an average young listener; the number on it is the loudness level in phons. The filled marker is your tone, the hollow one is the same tone after the level change.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 12500, log: true, label: 'frequency (Hz)' }, y: { min: 0, max: 120, label: 'sound pressure level (dB)' } });
        [10, 20, 40, 60, 80, 100].forEach((p) => { const c = P.equalLoudness(p); A.plotLine(ctx, ax, c, A.alpha(A.css('accent2'), p === 40 ? 1 : 0.55), p === 40 ? 2.2 : 1.3); const at = c[17]; A.text(ctx, String(p), ax.X(1000), ax.Y(at[1]) - 4, { size: 10, weight: 700, align: 'center', bg: A.css('panel') }); });
        const f = Math.pow(10, st.f), L2 = clamp(st.L + st.d, 0, 120);
        ctx.strokeStyle = A.css('text'); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(f), ax.Y(st.L)); ctx.lineTo(ax.X(f), ax.Y(L2)); ctx.stroke(); ctx.setLineDash([]);
        dot(ctx, ax.X(f), ax.Y(st.L), 6, A.css('bad')); ctx.strokeStyle = A.css('bad'); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(ax.X(f), ax.Y(L2), 6, 0, TAU); ctx.stroke(); ctx.lineWidth = 1;
      },
    });
    function upd() {
      const f = Math.pow(10, st.f), p1 = phonOf(st.L, f), p2 = phonOf(st.L + st.d, f), s1 = sones(p1), s2 = sones(p2), k = s2 / Math.max(s1, 1e-6), thr = contourAt(0, f) + 2;
      const sub = (p) => (p < 3 ? 'below or at the threshold of hearing' : `as loud as a 1 kHz tone at ${fmt(p, 0)} dB`);
      out.innerHTML = A.statBox('Loudness level', fmt(Math.max(0, p1), 0) + ' phon', sub(p1)) + A.statBox('Loudness', fmt(s1, s1 < 10 ? 2 : 1) + ' sone', '1 sone = a 1 kHz tone at 40 dB') + A.statBox('After the change', fmt(Math.max(0, p2), 0) + ' phon', `${fmt(s2, s2 < 10 ? 2 : 1)} sone`) + A.statBox('It now sounds', k >= 1 ? `× ${fmt(k, 2)} as loud` : `÷ ${fmt(1 / k, 2)} as loud`, `for a ${st.d > 0 ? '+' : ''}${st.d} dB change`, Math.abs(Math.log2(k)) > Math.abs(st.d) / 10 + 0.25 ? 'warn' : '');
      const steep = Math.abs(p2 - p1) / Math.max(1, Math.abs(st.d));
      tip.innerHTML = `<div class="callout mentor">${p1 < 3 ? `At ${fmtHz(f)} a tone has to reach roughly ${fmt(thr, 0)} dB before an average ear detects it at all — this one is inaudible.` : f < 150 ? `In the bass the curves are squeezed together: here each decibel of level changes the loudness level by about ${fmt(steep, 1)} phon. A small fader move on a bass instrument is a large change to the ear — and a mix balanced loud will sound bass-light when played quietly.` : f > 2000 && f < 5000 ? 'You are in the ear’s most sensitive region, where the ear canal resonates. Sounds here need the least level to be heard — and it is the region loud sound damages first.' : 'In the middle of the range the rule of thumb holds well: +10 dB sounds about twice as loud, −10 dB about half.'} Decibels measure the physical sound; phons say which sounds match in loudness; sones say <i>how many times</i> louder. Doubling the power is only +3 dB — just noticeable — which is why ten violins are needed to sound twice as loud as one.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     7. Daily sound dose
     ====================================================================== */
  const PROT = { none: ['None', 0, 0, ''], foamBad: ['Foam plugs, pushed in loosely', 30, 7, 'A foam plug that is not rolled thin and inserted deep gives a small fraction of its label figure.'], foam: ['Foam plugs, properly inserted', 30, 18, 'Even fitted well, real ears on real days get clearly less than the laboratory label.'], flange: ['Reusable flanged plugs', 25, 13, 'Quick to fit, but the seal breaks easily when you talk, chew or sweat.'], music: ['Custom musicians’ plugs (flat 15 dB)', 15, 13, 'Moulded to your ear, so what you get is close to the label — and the tone stays natural, so people actually keep them in.'], muff: ['Earmuffs', 28, 20, 'Reliable if the cushions seal; glasses, hair and hats all open leaks.'] };
  V.doseCalc = function (host) {
    const row = (i, name, L, hh) => [{ type: 'heading', label: name }, { key: 'l' + i, label: 'Level at your ears', type: 'range', min: 70, max: 115, step: 1, value: L, unit: 'dB(A)' }, { key: 'h' + i, label: 'Time', type: 'range', min: 0, max: 8, step: 0.25, value: hh, fmt: (v) => (v < 1 ? fmt(v * 60, 0) + ' min' : fmt(v, 2) + ' h') }];
    const st = A.controls(host, [...row(1, 'Loudest activity — for example a band rehearsal', 102, 2), { key: 'prot', label: 'Protection worn during it', type: 'select', value: 'none', options: Object.entries(PROT).map(([k, v]) => [k, v[0]]) }, ...row(2, 'Second activity — for example mixing', 82, 4), ...row(3, 'Third activity — for example headphones on the journey', 88, 1)], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    let R = null;
    const cv = A.canvas(host, {
      height: 240,
      caption: 'Each bar is the share of a safe day that one activity uses up, by the “3 dB” rule (85 dB(A) for eight hours = 100 %). The dashed line is the full daily allowance.',
      draw(ctx, w, h) {
        if (!R) return; const x0 = 46, x1 = w - 10, y0 = h - 40, y1 = 16, mx = Math.max(150, R.total * 1.12), Y = (v) => y0 - (Math.min(v, mx) / mx) * (y0 - y1), names = ['Activity 1', 'Activity 2', 'Activity 3', 'Whole day'], vals = [...R.d, R.total], bw = (x1 - x0) / 4;
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.5); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
        const step = mx > 1500 ? 500 : mx > 600 ? 200 : mx > 300 ? 100 : 50; for (let v = 0; v <= mx; v += step) A.text(ctx, v + ' %', x0 - 5, Y(v) + 4, { size: 10, align: 'right', color: A.css('muted') });
        const lab = []; vals.forEach((v, i) => { const c = i === 3 ? (v > 100 ? A.css('bad') : v > 50 ? A.css('warn') : A.css('good')) : A.css('accent2'); ctx.fillStyle = A.alpha(c, 0.85); ctx.fillRect(x0 + i * bw + bw * 0.18, Y(v), bw * 0.64, y0 - Y(v)); lab.push([fmt(v, 0) + ' %', x0 + i * bw + bw / 2, Y(v) - 6]); A.text(ctx, names[i], x0 + i * bw + bw / 2, y0 + 15, { size: 10, align: 'center' }); if (i < 3) A.text(ctx, fmt(R.eff[i], 0) + ' dB(A)', x0 + i * bw + bw / 2, y0 + 29, { size: 10, align: 'center', color: A.css('muted') }); });
        ctx.strokeStyle = A.css('text'); ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(100)); ctx.lineTo(x1, Y(100)); ctx.stroke(); ctx.setLineDash([]);
        lab.forEach(([s, x, y]) => A.text(ctx, s, x, y, { size: 11, weight: 800, align: 'center', bg: A.css('panel') }));
      },
    });
    function upd() {
      const p = PROT[st.prot], eff = [st.l1 - p[2], st.l2, st.l3], hrs = [st.h1, st.h2, st.h3];
      const d = eff.map((L, i) => (100 * hrs[i]) / P.niosh(L)), total = d.reduce((a, b) => a + b, 0), d5 = eff.reduce((s, L, i) => s + (100 * hrs[i]) / P.osha(L), 0), lex = total > 0 ? 85 + 10 * Math.log10(total / 100) : 0, allow = P.niosh(eff[0]);
      R = { d, total, eff };
      const tm = (hh) => (hh >= 1 ? fmt(hh, 1) + ' h' : hh * 60 >= 1 ? fmt(hh * 60, 0) + ' min' : fmt(hh * 3600, 0) + ' s');
      out.innerHTML = A.statBox('Daily dose (3 dB rule)', fmt(total, 0) + ' %', total > 100 ? `${fmt(total / 100, 1)} days’ allowance in one day` : 'within the daily allowance', total > 100 ? 'bad' : total > 50 ? 'warn' : 'good') + A.statBox('Same day, averaged over 8 h', total > 0 ? fmt(lex, 1) + ' dB(A)' : '—', 'the level that would give the same dose') + A.statBox('Safe time at the loudest activity', tm(allow), `at ${fmt(eff[0], 0)} dB(A) reaching the ear`, allow < hrs[0] ? 'bad' : 'good') + A.statBox('Dose by the older 5 dB rule', fmt(d5, 0) + ' %', '90 dB(A) for 8 h, halve per +5 dB', d5 > 100 ? 'bad' : '');
      tip.innerHTML = `<div class="callout ${total > 100 ? 'warn' : 'mentor'}">${total > 400 ? '<b>Several days’ worth of sound in one day.</b> Repeated regularly, this is how permanent damage is done — painlessly and without warning.' : total > 100 ? '<b>Over the daily allowance.</b> One such day is not a catastrophe; a habit of them is. Bring the loudest activity down first — it dominates everything else.' : total > 50 ? 'Inside the allowance, with not much to spare. The allowance is a risk limit, not a guarantee: lower is always better.' : 'A comfortable day for your ears.'} ${p[1] ? `<b>${p[0]}:</b> the packet says ${p[1]} dB; this calculator assumes about ${p[2]} dB in real use. ${p[3]}` : eff[0] >= 95 ? 'Try the protection menu: taking even 12–15 dB off the loudest activity cuts its dose to a few percent of what it was.' : ''} Every +3 dB doubles the sound energy, so it halves the safe time. The 5 dB rule still found in some regulations is far more lenient at high levels and is not a good guide for people who want to keep their hearing.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     8. Earplug types
     ====================================================================== */
  const PLUG = {
    foam: ['Foam plugs (deep, correct fit)', [30, 33, 36, 37, 36, 42, 44], 0.6, 'Maximum protection, cheap, disposable. But the treble is cut far more than the bass, so music turns into a dull rumble — which tempts people to pull them half out, and then the protection collapses.'],
    flange: ['Reusable flanged plugs', [24, 24, 25, 26, 31, 35, 37], 0.55, 'Washable and quick. The tone is still tilted towards the bass, though less than foam. Good for power tools and crowd noise.'],
    music: ['Musicians’ plugs — flat response', [14, 15, 15, 15, 15, 14, 16], 0.85, 'A tuned filter gives nearly the same reduction at every frequency, so the music keeps its balance, only quieter. Less protection on paper, far more in practice, because they stay in for the whole gig.'],
    muff: ['Earmuffs', [14, 20, 28, 35, 35, 38, 36], 0.7, 'Strong in the mid and treble, weak in the bass. Easy to put on and take off between takes; useful for drummers in practice and anyone running machinery.'],
  };
  const SPEC = { band: ['Amplified band rehearsal', [-8, -4, -2, 0, -2, -5, -9]], orch: ['Orchestra, brass section behind you', [-12, -6, -2, 0, -3, -8, -14]], drums: ['Acoustic drum kit at the stool', [-6, -4, -3, 0, 0, -1, -4]] };
  V.earplugTypes = function (host) {
    const st = A.controls(host, [
      { key: 'plug', label: 'Protector', type: 'select', value: 'music', options: Object.entries(PLUG).map(([k, v]) => [k, v[0]]) },
      { key: 'src', label: 'Where you are', type: 'select', value: 'band', options: Object.entries(SPEC).map(([k, v]) => [k, v[0]]) },
      { key: 'L', label: 'Level without protection', type: 'range', min: 85, max: 115, step: 1, value: 103, unit: 'dB(A)' },
    ], () => upd());
    btnRow(host, [['Hear the open ear', 'play', false, () => play(false)], ['Hear through this protector', 'play', true, () => play(true)], ['Stop', 'stop', false, () => A.audio.stopAll()]]);
    host.appendChild(html('<p style="font-size:12px;color:var(--muted);margin:6px 0 10px">The demo keeps the overall drop small so that you can compare the <i>tone</i>; a real protector is also much quieter.</p>'));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const cv = A.canvas(host, {
      height: 270,
      caption: 'How many decibels each kind of protector removes at each frequency (typical laboratory figures; real-world fit gives less). A level line means natural tone; a line that climbs to the right means muffled treble. The thick line is the protector you chose.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 125, max: 8000, log: true, ticks: BANDS, label: 'frequency (Hz)' }, y: { min: 0, max: 50, label: 'attenuation (dB)' } });
        Object.entries(PLUG).forEach(([k, v], i) => { const pts = v[1].map((d, j) => [BANDS[j], d]); A.plotLine(ctx, ax, pts, k === st.plug ? A.series(i) : A.alpha(A.series(i), 0.5), k === st.plug ? 3.5 : 1.5); if (k === st.plug) pts.forEach(([f, d]) => dot(ctx, ax.X(f), ax.Y(d), 4, A.series(i))); });
      },
    });
    host.appendChild(A.legend(Object.values(PLUG).map((v, i) => [A.series(i), v[0]])));
    const calc = () => { const p = PLUG[st.plug], s = SPEC[st.src][1]; let a = 0, b = 0; s.forEach((d, i) => { a += Math.pow(10, d / 10); b += Math.pow(10, (d - p[1][i] * p[2]) / 10); }); return { lab: 10 * Math.log10(s.reduce((q, d, i) => q + Math.pow(10, (d - p[1][i]) / 10), 0) / a), real: 10 * Math.log10(b / a) }; };
    function play(on) { A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return; const p = PLUG[st.plug][1], mn = Math.min(...p), s = ctx.createBufferSource(); s.buffer = makeSig(ctx, 'music'); s.loop = true; const ch = shapeChain(ctx, on ? p.map((d) => -(d - mn) - 4) : BANDS.map(() => 0)), g = ctx.createGain(); g.gain.value = 0.7; s.connect(ch.input); ch.output.connect(g).connect(ctx.destination); s.start(); s.stop(ctx.currentTime + 16); A.audio.track(s); }
    function upd() {
      const p = PLUG[st.plug], r = calc(), tilt = (p[1][5] + p[1][6]) / 2 - (p[1][1] + p[1][2]) / 2, ear = st.L + r.real, t = P.niosh(ear), t0 = P.niosh(st.L);
      const tm = (hh) => (hh >= 24 ? 'all day' : hh >= 1 ? fmt(hh, 1) + ' h' : hh * 60 >= 1 ? fmt(hh * 60, 0) + ' min' : fmt(hh * 3600, 0) + ' s');
      out.innerHTML = A.statBox('Reduction on the label', fmt(-r.lab, 0) + ' dB', 'laboratory fit, this kind of sound') + A.statBox('Realistic reduction', fmt(-r.real, 0) + ' dB', 'typical everyday fit') + A.statBox('Treble cut more than bass by', fmt(tilt, 0) + ' dB', tilt < 4 ? 'natural tone' : tilt < 9 ? 'noticeably dull' : 'very muffled', tilt < 4 ? 'good' : 'warn') + A.statBox('Level reaching the eardrum', fmt(ear, 0) + ' dB(A)', `safe for ${tm(t)} a day (unprotected: ${tm(t0)})`, t >= 2 ? 'good' : t >= 0.5 ? 'warn' : 'bad');
      tip.innerHTML = `<div class="callout mentor"><b>${p[0]}.</b> ${p[3]} ${ear > 94 ? 'At this level even the protected ear has well under an hour a day — turn the source down, move away from it, or use more protection.' : ''} The best protector is the one that is still in your ears at the end of the night: taking plugs out for just a quarter of a loud session throws away most of their benefit.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     9. Doppler pass-by
     ====================================================================== */
  V.dopplerLab = function (host) {
    const st = A.controls(host, [
      { key: 'v', label: 'Speed of the source', type: 'range', min: 5, max: 150, step: 1, value: 30, fmt: (v) => `${fmt(v, 0)} m/s (${fmt(v * 3.6, 0)} km/h)` },
      { key: 'd', label: 'Closest distance as it passes', type: 'range', min: 2, max: 60, step: 1, value: 10, unit: 'm' },
      { key: 'f', label: 'Pitch it really makes', type: 'range', min: 150, max: 1200, step: 5, value: 440, fmt: (v) => fmtHz(v) },
    ], () => upd());
    const T = 3;
    let t0 = performance.now();
    btnRow(host, [['Hear the pass-by', 'play', true, () => play()], ['Stop', 'stop', false, () => A.audio.stopAll()]]);
    volNote(host);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    /* emission time for a given arrival time t (t = 0 when the sound emitted at the closest point arrives... we use source time) */
    const heard = (t) => { let te = t; for (let i = 0; i < 30; i++) te = t - Math.hypot(st.v * te, st.d) / C; const r = Math.hypot(st.v * te, st.d), vr = (st.v * st.v * te) / r; return { f: st.f / (1 + vr / C), r }; };
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top: the source travels left to right, sending out a wavefront at regular intervals, drawn to true scale for the speed chosen — the fronts bunch up ahead and stretch out behind. The dot below the path is the listener. Bottom: the pitch the listener hears against time.',
      draw(ctx, w, h) {
        const tt = ((performance.now() - t0) / 1000) % (2 * T), ts = tt - T, sh = 150, sc = w / (st.v * 2 * T), cy = 52, ly = Math.min(sh - 12, cy + Math.max(18, st.d * sc)), xs = w / 2 + st.v * ts * sc;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, sh); ctx.clip();
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.4); ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); ctx.setLineDash([]);
        const dtE = Math.max(0.012, 28 / (C * sc)); ctx.strokeStyle = A.alpha(A.css('accent'), 0.75); ctx.lineWidth = 1.3;
        for (let te = ts - ((ts + T) % dtE); te > -T - 0.001 && ts - te < (w * 1.2) / (C * sc); te -= dtE) { const r = C * (ts - te) * sc; if (r < 1) continue; ctx.beginPath(); ctx.arc(w / 2 + st.v * te * sc, cy, r, 0, TAU); ctx.stroke(); }
        dot(ctx, xs, cy, 7, A.css('bad')); dot(ctx, w / 2, ly, 6, A.css('text')); A.text(ctx, 'listener', w / 2 + 10, ly + 4, { size: 10 });
        ctx.restore(); ctx.lineWidth = 1;
        ctx.save(); ctx.translate(0, sh);
        const M = st.v / C, ax = A.axes(ctx, w, h - sh, { x: { min: -T, max: T, label: 'time (s) — 0 = closest point' }, y: { min: st.f / (1 + M) - st.f * 0.03, max: st.f / (1 - Math.min(M, 0.9)) + st.f * 0.03, label: 'heard pitch (Hz)' }, pad: { l: 56 } });
        const pts = []; for (let i = 0; i <= 240; i++) { const x = -T + (i / 240) * 2 * T; pts.push([x, heard(x).f]); }
        A.plotLine(ctx, ax, [[-T, st.f], [T, st.f]], A.css('muted'), 1, [4, 4]); A.plotLine(ctx, ax, pts, A.css('accent'), 2.4);
        dot(ctx, ax.X(ts), ax.Y(heard(ts).f), 5, A.css('bad'));
        ctx.restore();
      },
    });
    function play() {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return; const N = 256, fr = new Float32Array(N), ga = new Float32Array(N); for (let i = 0; i < N; i++) { const q = heard(-T + (i / (N - 1)) * 2 * T), e = Math.min(1, i / 8, (N - 1 - i) / 8); fr[i] = q.f; ga[i] = 0.3 * e * Math.min(1, st.d / q.r + 0.03); }
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + 0.05; o.type = 'triangle'; o.frequency.setValueCurveAtTime(fr, t, 2 * T); g.gain.setValueCurveAtTime(ga, t, 2 * T); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 2 * T + 0.05); A.audio.track(o); t0 = performance.now() + 50;
    }
    function upd() {
      const M = st.v / C, fa = st.f / (1 - M), fb = st.f / (1 + M), semi = 12 * Math.log2(fa / fb), sw = (2 * st.d) / st.v;
      out.innerHTML = A.statBox('Approaching (far away)', fmtHz(fa), `+${fmt(((fa / st.f) - 1) * 100, 1)} %`) + A.statBox('Receding (far away)', fmtHz(fb), `−${fmt((1 - fb / st.f) * 100, 1)} %`) + A.statBox('Total pitch drop', fmt(semi, 2) + ' semitones', semi < 0.5 ? 'barely audible' : semi < 2 ? 'a clear slide' : 'a dramatic swoop') + A.statBox('Most of the drop happens in', sw < 1 ? fmt(sw * 1000, 0) + ' ms' : fmt(sw, 1) + ' s', 'about twice (distance ÷ speed)');
      tip.innerHTML = `<div class="callout mentor">${M < 0.03 ? 'At walking or cycling speed the shift is a fraction of a semitone — real, but you would not notice it.' : M < 0.15 ? 'Road-traffic speeds: the familiar “neee-owww” of a passing car or siren, around a semitone or two from start to finish.' : 'A racing car or low aircraft: the pitch falls by several semitones, and because the source is a sizeable fraction of the speed of sound the rise ahead is bigger than the fall behind.'} The pitch never jumps: it glides, and the glide is fastest at the instant of passing. ${st.d < 6 ? 'Standing close to the path makes the glide abrupt.' : st.d > 30 ? 'Standing well back stretches the glide into a slow sigh.' : ''} While the source is coming straight at you the pitch is <i>steady</i> and high — it is not “rising as it approaches”; that impression comes from the loudness growing.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     10. Mach cone
     ====================================================================== */
  V.machCone = function (host) {
    const st = A.controls(host, [
      { key: 'm', label: 'Speed of the source', type: 'range', min: 0.2, max: 3, step: 0.01, value: 1.5, fmt: (v) => `Mach ${fmt(v, 2)} (${fmt(v * C * 3.6, 0)} km/h)` },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const cv = A.canvas(host, {
      height: 270, animate: true,
      caption: 'A source moving left to right sends out a ripple at regular intervals; every ripple grows at the speed of sound. Below Mach 1 the ripples run ahead of the source. Above Mach 1 the source outruns them and they pile up along two straight lines — the shock front that is heard as a sonic boom.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t), M = st.m, loop = 4, ts = tt % loop, vs = (w + 80) / loop, cs = vs / M, cy = h / 2, xs = -40 + vs * ts, dtE = 0.16;
        ctx.strokeStyle = A.alpha(A.css('accent'), 0.7); ctx.lineWidth = 1.3;
        for (let te = Math.floor(ts / dtE) * dtE; te >= 0; te -= dtE) { const r = cs * (ts - te); if (r > w * 1.6) break; if (r < 0.5) continue; ctx.beginPath(); ctx.arc(-40 + vs * te, cy, r, 0, TAU); ctx.stroke(); }
        if (M > 1.001) { const mu = Math.asin(1 / M), L = w * 1.5; ctx.strokeStyle = A.css('bad'); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xs, cy); ctx.lineTo(xs - L * Math.cos(mu), cy - L * Math.sin(mu)); ctx.moveTo(xs, cy); ctx.lineTo(xs - L * Math.cos(mu), cy + L * Math.sin(mu)); ctx.stroke(); ctx.lineWidth = 1; ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.arc(xs, cy, 34, Math.PI - mu, Math.PI); ctx.stroke(); if (xs > 90 && xs < w) A.text(ctx, fmt((mu * 180) / Math.PI, 0) + '°', xs - 62, cy - 8, { size: 11, weight: 800, bg: A.css('panel') }); }
        dot(ctx, xs, cy, 7, A.css('bad'));
        A.text(ctx, M < 0.98 ? 'subsonic — sound runs ahead' : M <= 1.02 ? 'at the speed of sound — a wall of pressure' : 'supersonic — silence ahead of the cone', 10, 18, { size: 11, weight: 700, bg: A.css('panel') });
      },
    });
    function upd() {
      const M = st.m, mu = M > 1 ? (Math.asin(1 / M) * 180) / Math.PI : null, alt = 10000, lag = M > 1 ? (alt * Math.sqrt(M * M - 1)) / (M * C) : null;
      out.innerHTML = A.statBox('Speed', `${fmt(M * C, 0)} m/s`, `${fmt(M * C * 3.6, 0)} km/h at 20 °C`) + A.statBox('Regime', M < 0.8 ? 'Subsonic' : M < 1.2 ? 'Transonic' : 'Supersonic', M < 1 ? 'you hear it coming' : 'it arrives before its sound', M >= 1 ? 'warn' : '') + A.statBox('Cone half-angle', mu ? fmt(mu, 1) + '°' : '—', 'sin μ = 1 ÷ Mach') + A.statBox('Boom delay from 10 km up', lag ? fmt(lag, 0) + ' s' : '—', 'after the aircraft is overhead');
      tip.innerHTML = `<div class="callout mentor">${M < 0.8 ? 'Sound travels faster than the source, so the ripples escape in every direction. They are closer together in front (higher pitch) and further apart behind (lower pitch) — this is the Doppler effect drawn as a picture.' : M <= 1.02 ? 'At Mach 1 the source keeps pace with its own sound. Every ripple it has ever made sits stacked at its nose in one steep pressure front. Pushing through that pile of compressed air is what was once called “the sound barrier”.' : `The source now leaves its ripples behind. Their edges line up along a cone with a half-angle of ${fmt(mu, 0)}°; the faster the source, the narrower the cone. A listener hears nothing at all until the cone sweeps over them, then the whole pressure jump at once — a boom. The boom is not made at the instant of “breaking the barrier”: it is dragged along the ground continuously for as long as the flight stays supersonic.`} The same geometry explains a bullet’s crack, a whip’s snap (the tip goes supersonic) and the V-shaped wake behind a boat.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     11. Steepening of very loud sound
     ====================================================================== */
  V.steepening = function (host) {
    const st = A.controls(host, [
      { key: 'L', label: 'Level at the source', type: 'range', min: 90, max: 174, step: 1, value: 150, unit: 'dB SPL' },
      { key: 'f', label: 'Frequency', type: 'range', min: 2, max: 4, step: 0.01, value: 3, fmt: (x) => fmtHz(Math.pow(10, x)) },
      { key: 'x', label: 'Distance travelled', type: 'range', min: -1, max: 2.3, step: 0.01, value: 0.5, fmt: (x) => A.fmtLen(Math.pow(10, x)) },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const calc = () => { const p0 = 2e-5 * Math.pow(10, st.L / 20) * Math.SQRT2, eps = p0 / (1.2 * C * C), k = (TAU * Math.pow(10, st.f)) / C, xs = 1 / (1.2 * eps * k), s = Math.pow(10, st.x) / xs; const B = []; for (let n = 1; n <= 8; n++) B.push(s <= 1 ? (s < 1e-6 ? (n === 1 ? 1 : 0) : (2 * Jn(n, n * s)) / (n * s)) : 2 / (n * (1 + s))); return { p0, xs, s, B }; };
    let G = calc();
    const cv = A.canvas(host, {
      height: 270, animate: true,
      caption: 'Left: one and a half cycles of the travelling wave — the dashed outline is the pure tone that left the source, the solid line is its shape after the chosen distance. Right: the overtones that the steepening has created, relative to the original tone. An idealised plane wave with no spreading or air absorption: real sound distorts less than this.',
      draw(ctx, w, h, t) {
        const g = G, tt = Math.max(0, t), lw = w * 0.56, mid = h * 0.47, amp = h * 0.3, ph = -tt * 2.2, x0 = 10, x1 = lw - 10;
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.4); ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1, mid); ctx.stroke();
        ctx.strokeStyle = A.css('muted'); ctx.setLineDash([4, 4]); ctx.beginPath(); for (let x = x0; x <= x1; x += 2) { const y = mid - amp * Math.sin(((x - x0) / (x1 - x0)) * 3 * Math.PI + ph); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
        ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, h); ctx.clip();
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.6; ctx.beginPath();
        const se = Math.min(g.s, 1), am = g.s > 1 ? Math.min(1, Math.PI / (1 + g.s)) : 1; let first = true;
        for (let u = ph - 2; u <= ph + 3 * Math.PI + 2; u += 0.03) { const th = u + se * Math.sin(u), x = x0 + ((th - ph) / (3 * Math.PI)) * (x1 - x0), y = mid - amp * am * Math.sin(u); first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false; }
        ctx.stroke(); ctx.restore(); ctx.lineWidth = 1;
        A.text(ctx, 'travels this way →', x0, h - 26, { size: 10, color: A.css('muted') });
        ctx.save(); ctx.translate(lw, 0);
        const pw = w - lw, ax = A.axes(ctx, pw, h, { x: { min: 0.5, max: 8.5, ticks: [1, 2, 3, 4, 5, 6, 7, 8], label: 'harmonic' }, y: { min: -80, max: 0, label: 'dB' }, pad: { l: 38, r: 8 } });
        const bw = Math.max(4, (ax.x1 - ax.x0) / 14); g.B.forEach((b, i) => { const d = Math.max(-80, 20 * Math.log10(Math.abs(b) + 1e-9)); ctx.fillStyle = i ? A.css('accent2') : A.css('accent'); ctx.fillRect(ax.X(i + 1) - bw / 2, ax.Y(d), bw, ax.y0 - ax.Y(d)); });
        ctx.restore();
      },
    });
    function upd() {
      G = calc(); const g = G, h2 = 20 * Math.log10(Math.abs(g.B[1]) / Math.abs(g.B[0]) + 1e-12), thd = (100 * Math.sqrt(g.B.slice(1).reduce((s, b) => s + b * b, 0))) / Math.abs(g.B[0]), atm = (g.p0 / 101325) * 100;
      out.innerHTML = A.statBox('Peak pressure swing', g.p0 >= 1000 ? fmt(g.p0 / 1000, 2) + ' kPa' : fmt(g.p0, g.p0 < 10 ? 2 : 0) + ' Pa', `${atm < 0.01 ? fmt(atm, 4) : fmt(atm, 2)} % of atmospheric pressure`) + A.statBox('Distance to form a shock', g.xs > 5000 ? fmt(g.xs / 1000, 0) + ' km' : A.fmtLen(g.xs), 'if nothing else weakened the wave') + A.statBox('Second harmonic', g.s < 1e-5 ? 'none' : fmt(h2, 0) + ' dB', 'relative to the original tone', h2 > -30 ? 'warn' : 'good') + A.statBox('Distortion created by the air', thd < 0.01 ? '< 0.01 %' : fmt(thd, thd < 1 ? 2 : 0) + ' %', g.s >= 1 ? 'a shock has formed' : 'still a smooth wave', thd > 3 ? 'bad' : thd > 0.5 ? 'warn' : 'good');
      tip.innerHTML = `<div class="callout mentor">${st.L <= 115 ? '<b>Studio and concert levels.</b> The pressure swing is a tiny fraction of atmospheric pressure and the shock distance is measured in kilometres. Over the few metres of a room the air adds no distortion you could measure. This is why all the acoustics in this app can treat air as perfectly linear — sounds simply add.' : st.L <= 140 ? 'Very loud — the throat of a horn loudspeaker, or close to a brass bell played fortissimo. The peaks of the wave travel very slightly faster than the troughs, so the wave leans forward and a second harmonic appears. It is part of the “blare” of loud brass and the main reason horn drivers distort at high power.' : 'Jet engines, rocket launches, explosions. The wave becomes a sawtooth within metres: a near-instant pressure jump followed by a slow fall. Once that shock exists, energy drains into heat at the front and the wave decays faster than ordinary sound.'} Higher frequencies steepen sooner because they pack more cycles into each metre.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     12. The deep sound channel in the sea
     ====================================================================== */
  const SEA = {
    temp: ['Temperate or tropical ocean', (z) => { const e = (2 * (z - 1100)) / 1100; return 1492 * (1 + 0.0074 * (e - 1 + Math.exp(-e))); }, 'Warm water near the surface is fast; it cools with depth and sound slows; deeper still, the growing pressure speeds it up again. The minimum in between is the axis of the deep sound channel.'],
    polar: ['Polar ocean (cold right to the surface)', (z) => 1438 + 0.0165 * z, 'With no warm layer on top, speed simply rises with depth. Every ray curves upward, bounces off the surface (or the ice) and curves upward again — a surface duct.'],
    flat: ['Imaginary sea with the same speed everywhere', () => 1500, 'With no change of speed, rays are straight lines. They hit the surface and the bottom and are scattered and absorbed; sound does not carry far.'],
  };
  V.seaChannel = function (host) {
    const st = A.controls(host, [
      { key: 'sea', label: 'Water', type: 'select', value: 'temp', options: Object.entries(SEA).map(([k, v]) => [k, v[0]]) },
      { key: 'zs', label: 'Depth of the source', type: 'range', min: 50, max: 4500, step: 50, value: 1100, fmt: (v) => fmt(v, 0) + ' m' },
      { key: 'fan', label: 'Spread of the rays (up and down)', type: 'range', min: 3, max: 16, step: 1, value: 11, fmt: (v) => '± ' + v + '°' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const ZM = 5000, RM = 120000;
    let rays = [], trapped = 0;
    function trace() {
      const c = SEA[st.sea][1]; rays = []; trapped = 0;
      for (let i = 0; i < 11; i++) {
        let th = ((-st.fan + (2 * st.fan * i) / 10) * Math.PI) / 180, x = 0, z = st.zs, hit = false, dead = false; const pts = [[0, z]], ds = 150;
        for (let s = 0; s < 1200 && x < RM; s++) { const cz = c(z), g = (c(z + 5) - c(z - 5)) / 10; th += (-(Math.cos(th) / cz) * g) * ds; x += Math.cos(th) * ds; z += Math.sin(th) * ds; if (z < 0) { z = -z; th = -th; hit = true; } if (z > ZM) { dead = true; pts.push([x, ZM]); break; } if (s % 2 === 0) pts.push([x, z]); }
        if (!hit && !dead) trapped++; rays.push({ pts, hit, dead });
      }
    }
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left strip: how the speed of sound changes with depth. Main picture: rays leaving a source and travelling 120 km to the right through water 5 km deep (the depth is hugely exaggerated). Rays always curve towards the depth where sound travels slowest. Faint rays have touched the surface or been lost in the sea bed.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t), pwid = Math.min(86, w * 0.24), y0 = 14, y1 = h - 30, Y = (z) => y0 + (z / ZM) * (y1 - y0), c = SEA[st.sea][1];
        ctx.fillStyle = A.alpha(A.css('accent2'), 0.08); ctx.fillRect(0, y0, w, y1 - y0);
        let mn = 1e9, mx = 0; for (let z = 0; z <= ZM; z += 50) { mn = Math.min(mn, c(z)); mx = Math.max(mx, c(z)); } if (mx - mn < 5) { mn -= 10; mx += 10; }
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.2; ctx.beginPath(); for (let z = 0; z <= ZM; z += 50) { const x = 8 + ((c(z) - mn) / (mx - mn)) * (pwid - 18); z ? ctx.lineTo(x, Y(z)) : ctx.moveTo(x, Y(z)); } ctx.stroke(); ctx.lineWidth = 1;
        A.text(ctx, 'slow', 6, h - 12, { size: 10, color: A.css('muted') }); A.text(ctx, 'fast', pwid - 6, h - 12, { size: 10, align: 'right', color: A.css('muted') });
        ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.moveTo(pwid, y0); ctx.lineTo(pwid, y1); ctx.moveTo(pwid, y0); ctx.lineTo(w, y0); ctx.stroke();
        ctx.fillStyle = A.alpha(A.css('muted'), 0.5); ctx.fillRect(pwid, y1, w - pwid, 4);
        A.text(ctx, 'surface', w - 6, y0 + 12, { size: 10, align: 'right', color: A.css('muted') }); A.text(ctx, 'sea bed', w - 6, y1 - 5, { size: 10, align: 'right', color: A.css('muted') });
        A.text(ctx, 'range 0 → 120 km', (pwid + w) / 2, h - 12, { size: 10, align: 'center', color: A.css('muted') });
        const X = (x) => pwid + (x / RM) * (w - pwid - 4), prog = ((tt % 7) / 5.5) * RM;
        rays.forEach((r) => { ctx.strokeStyle = A.alpha(A.css(r.hit || r.dead ? 'muted' : 'accent'), r.hit || r.dead ? 0.45 : 0.9); ctx.lineWidth = r.hit || r.dead ? 1 : 1.6; ctx.beginPath(); let last = null; for (const [x, z] of r.pts) { if (x > prog) break; last ? ctx.lineTo(X(x), Y(z)) : ctx.moveTo(X(x), Y(z)); last = [x, z]; } ctx.stroke(); if (last && last[0] < RM - 400 && !(r.dead && last[1] >= ZM)) dot(ctx, X(last[0]), Y(last[1]), 2.5, A.css('text')); });
        ctx.lineWidth = 1; dot(ctx, X(0) + 3, Y(st.zs), 5, A.css('bad'));
      },
    });
    function upd() {
      trace(); const c = SEA[st.sea][1]; let za = 0, cm = 1e9; for (let z = 0; z <= ZM; z += 25) if (c(z) < cm) { cm = c(z); za = z; }
      out.innerHTML = A.statBox('Slowest layer (channel axis)', st.sea === 'flat' ? 'none' : fmt(za, 0) + ' m deep', st.sea === 'flat' ? 'speed is the same everywhere' : `${fmt(cm, 0)} m/s there`) + A.statBox('Speed at the source', fmt(c(st.zs), 0) + ' m/s', `about ${fmt(c(st.zs) / C, 1)} × the speed in air`) + A.statBox('Rays held clear of surface and bed', `${trapped} of 11`, trapped >= 7 ? 'most of the sound stays in the channel' : trapped >= 3 ? 'partly trapped' : 'little or none trapped', trapped >= 7 ? 'good' : trapped >= 3 ? 'warn' : 'bad') + A.statBox('Time to travel 1000 km', fmt(1000000 / c(st.zs) / 60, 1) + ' min', 'in air it would take about 49 min');
      tip.innerHTML = `<div class="callout mentor">${SEA[st.sea][2]} ${st.sea === 'temp' ? (trapped >= 7 ? 'With the source near the axis, most rays weave gently above and below it and never touch a boundary. Low-frequency sound trapped like this loses almost nothing and has been detected across whole ocean basins — whales use the same channel.' : 'Move the source towards the slowest layer and narrow the fan: more rays will be captured by the channel instead of striking the surface or the bed.') : ''} The rule behind the picture is the one that bends sound over a cool lake at night and lifts it away from the ground on a hot afternoon: <b>sound always turns towards the region where it travels more slowly.</b></div>`;
      cv.redraw();
    }
    upd();
  };
})();
