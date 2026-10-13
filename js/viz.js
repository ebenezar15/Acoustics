/* ==========================================================================
   Acoustica visual widgets. Each V.xxx(host, opts) builds its own controls
   and an animated canvas that explains one physical idea.
   ========================================================================== */
(function () {
  'use strict';
  const V = (window.V = {});
  const { el, html, fmt, fmtHz, fmtLen, clamp } = A;
  const TAU = Math.PI * 2;

  function hexToRgb(hex) {
    let c = (hex || '#888').replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const n = parseInt(c, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  /** diverging colour LUT: negative → accent2, zero → bg, positive → accent */
  V.divergingLUT = function () {
    const neg = hexToRgb(A.css('accent2')), pos = hexToRgb(A.css('accent')), mid = hexToRgb(A.css('bg2'));
    const lut = new Uint8ClampedArray(256 * 3);
    for (let i = 0; i < 256; i++) {
      const t = (i - 127.5) / 127.5;
      const c = t < 0 ? neg : pos, a = Math.min(1, Math.abs(t));
      for (let k = 0; k < 3; k++) lut[i * 3 + k] = mid[k] + (c[k] - mid[k]) * a;
    }
    return lut;
  };
  V.font = () => getComputedStyle(document.body).fontFamily;

  /* ----------------------------------------------------------------------
     1. Longitudinal wave: particles + pressure curve
     ---------------------------------------------------------------------- */
  V.wave = function (host) {
    const st = A.controls(host, [
      { key: 'f', label: 'Frequency (visual)', type: 'range', min: 0.2, max: 3, step: 0.05, value: 1, unit: '×' },
      { key: 'amp', label: 'Amplitude (loudness)', type: 'range', min: 0, max: 1, step: 0.01, value: 0.6 },
      { key: 'show', label: 'Show', type: 'select', value: 'both', options: [['both', 'Particles + pressure'], ['particles', 'Particles only'], ['pressure', 'Pressure only']] },
    ]);
    const cols = 70, rows = 9;
    const seeds = Array.from({ length: cols * rows }, () => [Math.random() - 0.5, Math.random() - 0.5]);
    A.canvas(host, {
      height: 300, animate: true,
      caption: 'Air molecules don’t travel with the sound — they oscillate around a rest position. Bunching = <b>compression</b> (high pressure), spreading = <b>rarefaction</b> (low pressure). The orange dot is one molecule: watch it go back and forth, not across.',
      draw(ctx, w, h, t) {
        const k = (TAU / (w * 0.42)) * st.f, wt = TAU * 0.6 * st.f * t;
        const top = 20, band = st.show === 'pressure' ? 0 : 150;
        if (st.show !== 'pressure') {
          ctx.fillStyle = A.css('muted');
          for (let i = 0; i < cols; i++)
            for (let j = 0; j < rows; j++) {
              const x0 = 20 + (i + 0.5 + seeds[i * rows + j][0] * 0.5) * ((w - 40) / cols);
              const dx = st.amp * 9 * Math.sin(k * x0 - wt);
              const y = top + (j + 0.5 + seeds[i * rows + j][1] * 0.5) * (band / rows);
              ctx.globalAlpha = 0.75;
              ctx.beginPath(); ctx.arc(x0 + dx, y, 2.1, 0, TAU); ctx.fill();
            }
          ctx.globalAlpha = 1;
          const xm = 20 + 35.5 * ((w - 40) / cols);
          ctx.fillStyle = A.css('accent');
          ctx.beginPath(); ctx.arc(xm + st.amp * 9 * Math.sin(k * xm - wt), top + band / 2, 5, 0, TAU); ctx.fill();
        }
        if (st.show !== 'particles') {
          const y0 = st.show === 'pressure' ? h / 2 : top + band + (h - top - band) / 2, A0 = (st.show === 'pressure' ? h * 0.35 : (h - band - top) * 0.38);
          ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(20, y0); ctx.lineTo(w - 20, y0); ctx.stroke();
          // derivative of displacement → pressure (−∂ξ/∂x): compression where particles converge
          ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2.5; ctx.beginPath();
          for (let x = 20; x <= w - 20; x += 2) { const p = -st.amp * Math.cos(k * x - wt); x === 20 ? ctx.moveTo(x, y0 + p * A0) : ctx.lineTo(x, y0 + p * A0); }
          ctx.stroke(); ctx.lineWidth = 1;
          A.text(ctx, '+ pressure (compression)', 24, y0 - A0 - 2, { color: A.css('muted'), size: 11 });
          A.text(ctx, '− pressure (rarefaction)', 24, y0 + A0 + 12, { color: A.css('muted'), size: 11 });
          // wavelength marker
          const lam = TAU / k;
          if (lam < w - 60) {
            const xa = 40, xb = 40 + lam, yy = y0 + A0 + 22;
            if (yy < h - 2) {
              ctx.strokeStyle = A.css('accent'); ctx.beginPath(); ctx.moveTo(xa, yy); ctx.lineTo(xb, yy); ctx.moveTo(xa, yy - 5); ctx.lineTo(xa, yy + 5); ctx.moveTo(xb, yy - 5); ctx.lineTo(xb, yy + 5); ctx.stroke();
              A.text(ctx, 'λ (one wavelength)', (xa + xb) / 2, yy - 4, { align: 'center', color: A.css('accent'), size: 11 });
            }
          }
        }
      },
    });
  };

  /* ----------------------------------------------------------------------
     2. Wavelength ruler
     ---------------------------------------------------------------------- */
  V.wavelength = function (host) {
    const st = A.controls(host, [
      { key: 'lf', label: 'Frequency', type: 'range', min: Math.log10(20), max: Math.log10(20000), step: 0.005, value: Math.log10(100), fmt: (v) => fmtHz(Math.pow(10, v)) },
      { key: 't', label: 'Air temperature', type: 'range', min: -10, max: 40, step: 1, value: 20, unit: '°C' },
    ]);
    const out = el('div', { class: 'stats' });
    host.appendChild(out);
    const objs = [[0.02, 'Coin'], [0.1, '100 mm absorber'], [0.3, 'Ruler (30 cm)'], [1.0, 'Speaker cabinet height ~1 m'], [1.75, 'Person'], [3.4, 'Room width ~3.4 m'], [8, 'Small hall width'], [17.2, '20 Hz wavelength']];
    const cv = A.canvas(host, {
      height: 190,
      caption: 'Wavelength λ = c / f. Bass waves are as big as rooms (which is why thin foam can’t touch them); treble waves are smaller than your thumb (which is why a 25 mm panel absorbs them).',
      draw(ctx, w, h) {
        const f = Math.pow(10, st.lf), c = P.speedOfSound(st.t), lam = c / f;
        const X = (m) => 30 + ((Math.log10(m) - Math.log10(0.01)) / (Math.log10(20) - Math.log10(0.01))) * (w - 60);
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(30, 120); ctx.lineTo(w - 30, 120); ctx.stroke();
        [0.01, 0.1, 1, 10].forEach((m) => { ctx.beginPath(); ctx.moveTo(X(m), 115); ctx.lineTo(X(m), 125); ctx.stroke(); A.text(ctx, fmtLen(m), X(m), 140, { align: 'center', size: 11, color: A.css('muted') }); });
        objs.forEach(([m, n], i) => {
          ctx.fillStyle = A.css('muted'); ctx.beginPath(); ctx.arc(X(m), 120, 3, 0, TAU); ctx.fill();
          A.text(ctx, n, X(m), i % 2 ? 165 : 102, { align: 'center', size: 10, color: A.css('muted') });
        });
        const x = X(clamp(lam, 0.01, 20));
        ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.moveTo(x, 118); ctx.lineTo(x - 8, 80); ctx.lineTo(x + 8, 80); ctx.fill();
        A.text(ctx, `λ = ${fmtLen(lam)}`, clamp(x, 60, w - 60), 72, { align: 'center', weight: 700, size: 15, color: A.css('accent') });
        // small sine of actual length if it fits
        const wpx = X(Math.min(lam, 20)) - X(0.01);
        A.text(ctx, `${fmtHz(f)} · c = ${fmt(c, 1)} m/s · period ${fmt(1000 / f, 2)} ms · λ/4 = ${fmtLen(lam / 4)}`, 30, 26, { size: 12 });
        void wpx;
      },
    });
    const update = () => {
      const f = Math.pow(10, st.lf), c = P.speedOfSound(st.t), lam = c / f;
      out.innerHTML = A.statBox('Wavelength', fmtLen(lam)) + A.statBox('Quarter-wave', fmtLen(lam / 4), 'Depth a porous absorber needs to be really effective') + A.statBox('Period', fmt(1000 / f, 2) + ' ms') + A.statBox('Octave', f < 250 ? 'Bass' : f < 2000 ? 'Mids' : 'Highs');
      cv.redraw();
    };
    const orig = st;
    host.addEventListener('input', update); update();
    void orig;
  };

  /* ----------------------------------------------------------------------
     3. "What dB reductions look like": energy particles through a wall
     ---------------------------------------------------------------------- */
  V.dbThroughWall = function (host, opts = {}) {
    const st = A.controls(host, [
      { key: 'tl', label: 'Wall reduction (TL)', type: 'range', min: 0, max: 70, step: 1, value: opts.tl || 30, unit: 'dB' },
      { key: 'src', label: 'Source level', type: 'range', min: 60, max: 120, step: 1, value: 100, unit: 'dB' },
    ]);
    const stats = el('div', { class: 'stats' });
    host.appendChild(stats);
    let parts = [], passed = 0, total = 0, acc = 0;
    const cv = A.canvas(host, {
      height: 260, animate: true,
      caption: 'Each dot is a packet of sound energy. A 10 dB wall lets through 1 in 10 packets, 20 dB 1 in 100, 30 dB 1 in 1,000, 60 dB only 1 in a million. The loudness you <i>perceive</i> halves roughly every 10 dB.',
      draw(ctx, w, h, t, dt) {
        const wx = w * 0.55;
        const rate = 220; acc += rate * dt;
        while (acc > 1) { acc--; parts.push({ x: 20, y: 20 + Math.random() * (h - 40), vx: 160 + Math.random() * 60, vy: (Math.random() - 0.5) * 40, through: null }); }
        const p = Math.pow(10, -st.tl / 10);
        ctx.fillStyle = A.alpha(A.css('muted'), 0.25); ctx.fillRect(wx - 10, 0, 20, h);
        ctx.strokeStyle = A.css('muted'); ctx.strokeRect(wx - 10.5, -1, 21, h + 2);
        for (const q of parts) {
          q.x += q.vx * dt; q.y += q.vy * dt;
          if (q.through === null && q.x > wx - 10) { q.through = Math.random() < p; total++; if (q.through) passed++; else { q.vx *= -0.4; q.dead = 0.4; } }
          if (q.dead != null) q.dead -= dt;
        }
        parts = parts.filter((q) => q.x < w + 5 && (q.dead == null || q.dead > 0));
        for (const q of parts) {
          ctx.fillStyle = q.through ? A.css('accent') : A.css('accent2');
          ctx.globalAlpha = q.dead != null ? Math.max(0, q.dead / 0.4) : 0.85;
          ctx.beginPath(); ctx.arc(q.x, q.y, q.through ? 4 : 2.4, 0, TAU); ctx.fill();
        }
        ctx.globalAlpha = 1;
        A.text(ctx, 'Source room', 20, 18, { size: 12, color: A.css('muted') });
        A.text(ctx, 'Neighbour', wx + 20, 18, { size: 12, color: A.css('muted') });
        A.text(ctx, `1 in ${fmtBig(1 / p)} gets through`, wx + 20, h - 14, { size: 13, weight: 700, color: A.css('accent') });
      },
    });
    function fmtBig(n) { return n >= 1e6 ? fmt(n / 1e6, 1) + ' million' : n >= 1000 ? Math.round(n).toLocaleString() : fmt(n, 1); }
    const upd = () => {
      const L2 = st.src - st.tl;
      const loud = P.loudnessRatio(-st.tl);
      stats.innerHTML = A.statBox('Energy passing', (100 * Math.pow(10, -st.tl / 10)).toPrecision(2) + ' %') +
        A.statBox('Perceived loudness', fmt(loud * 100, loud < 0.01 ? 2 : 1) + ' %', '≈ halves every 10 dB') +
        A.statBox('Level next door', fmt(L2, 0) + ' dB', P.stcDescribe(st.tl)) +
        A.statBox('Pressure ratio', '1 : ' + fmt(Math.pow(10, st.tl / 20), 0));
      parts = []; passed = total = 0;
    };
    host.addEventListener('input', upd); upd();
    return cv;
  };

  /* ----------------------------------------------------------------------
     4. Inverse square law with draggable listener
     ---------------------------------------------------------------------- */
  V.inverseSquare = function (host) {
    const st = A.controls(host, [
      { key: 'type', label: 'Source type', type: 'select', value: 'point', options: [['point', 'Point source (speaker, voice)'], ['line', 'Line source (road, line array)']] },
      { key: 'L1', label: 'Level at 1 m', type: 'range', min: 60, max: 120, step: 1, value: 94, unit: 'dB' },
      { key: 'room', label: 'Inside a room (reverberant field)', type: 'check', value: false },
      { key: 'rt', label: 'Room RT60', type: 'range', min: 0.2, max: 3, step: 0.05, value: 0.8, unit: 's' },
    ]);
    let rx = 0.5;
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Drag across the plot. Outdoors, each doubling of distance costs 6 dB (point) or 3 dB (line). Indoors, the level stops falling at the <b>critical distance</b>, where the reverberant field takes over.',
      onPointer(p, api) { if (p.type === 'pointerdown' || p.buttons) rx = clamp(p.x / api.w, 0.05, 0.98); },
      draw(ctx, w, h, t) {
        const V0 = 200, R = P.roomConstant(250, (0.161 * V0) / st.rt / 250);
        const lev = (r) => {
          const direct = st.L1 - P.distanceLoss(1, r, st.type);
          if (!st.room) return direct;
          // reverberant field level relative to direct at 1 m (Q=2)
          const Lw = st.L1 + 20 * Math.log10(1) + 11 - 3; // rough Lw for Q=2
          return P.roomLevel(Lw, r, 2, R);
        };
        const ax = A.axes(ctx, w, h, { x: { min: 0.5, max: 64, log: true, label: 'Distance (m)', ticks: [0.5, 1, 2, 4, 8, 16, 32, 64], fmt: (v) => v + ' m' }, y: { min: st.L1 - 45, max: st.L1 + 8, label: 'Level (dB)' } });
        const pts = []; for (let r = 0.5; r <= 64; r *= 1.03) pts.push([r, lev(r)]);
        const ptsD = []; for (let r = 0.5; r <= 64; r *= 1.03) ptsD.push([r, st.L1 - P.distanceLoss(1, r, st.type)]);
        if (st.room) A.plotLine(ctx, ax, ptsD, A.css('muted'), 1.5, [5, 4]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.5);
        if (st.room) {
          const dc = P.criticalDistance(V0, st.rt, 2);
          ctx.strokeStyle = A.css('accent2'); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ax.X(dc), ax.y1); ctx.lineTo(ax.X(dc), ax.y0); ctx.stroke(); ctx.setLineDash([]);
          A.text(ctx, `critical distance ${fmt(dc, 2)} m`, ax.X(dc) + 4, ax.y1 + 14, { color: A.css('accent2'), size: 11 });
        }
        const r = Math.pow(10, Math.log10(0.5) + rx * (Math.log10(64) - Math.log10(0.5)));
        const L = lev(r);
        ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.arc(ax.X(r), ax.Y(L), 6, 0, TAU); ctx.fill();
        A.text(ctx, `${fmt(r, 1)} m → ${fmt(L, 1)} dB`, ax.X(r) + 10, ax.Y(L) - 10, { weight: 700, bg: A.alpha(A.css('panel'), 0.85) });
        // ripples
        for (let i = 0; i < 4; i++) {
          const rr = ((t * 30 + i * 18) % 72);
          ctx.strokeStyle = A.alpha(A.css('accent'), 1 - rr / 72); ctx.beginPath(); ctx.arc(ax.x0 + 10, ax.y1 + 12, rr * 0.4, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        }
      },
    });
    host.addEventListener('input', () => cv.redraw());
  };

  /* ----------------------------------------------------------------------
     5. Comb filtering from a reflection (with audio)
     ---------------------------------------------------------------------- */
  V.comb = function (host) {
    const st = A.controls(host, [
      { key: 'd', label: 'Extra path length of reflection', type: 'range', min: 0.05, max: 5, step: 0.01, value: 0.68, unit: 'm' },
      { key: 'r', label: 'Reflection strength', type: 'range', min: 0, max: 1, step: 0.01, value: 0.8 },
    ]);
    const bar = el('div', { class: 'row' });
    const btn = el('button', { class: 'primary', html: A.icon('play') + ' Listen (pink noise + reflection)' });
    const btnDry = el('button', { html: 'Dry only' });
    bar.append(btn, btnDry);
    host.appendChild(bar);
    let node = null;
    function play(withRefl) {
      A.audio.stopAll();
      const ctx = A.audio.get(); if (!ctx) return;
      const src = ctx.createBufferSource(); src.buffer = A.audio.noiseBuffer('pink', 4); src.loop = true;
      const g = ctx.createGain(); g.gain.value = 0.5;
      src.connect(g).connect(ctx.destination);
      if (withRefl) {
        const dl = ctx.createDelay(1); dl.delayTime.value = st.d / P.C;
        const rg = ctx.createGain(); rg.gain.value = st.r * 0.5;
        src.connect(dl).connect(rg).connect(ctx.destination);
        node = { dl, rg };
      } else node = null;
      src.start(); A.audio.track(src);
      setTimeout(() => { try { src.stop(); } catch (e) { /* */ } }, 4000);
    }
    btn.onclick = () => play(true);
    btnDry.onclick = () => play(false);
    const cv = A.canvas(host, {
      height: 280,
      caption: 'When a reflection arrives Δt after the direct sound, frequencies whose half-period fits Δt cancel. The notches are spaced 1/Δt apart — like the teeth of a comb. This is why desk, console and side-wall reflections colour what you hear.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: -30, max: 8, label: 'dB' } });
        const pts = []; for (let f = 20; f <= 20000; f *= 1.004) pts.push([f, P.combResponse(f, st.d, st.r)]);
        A.plotFill(ctx, ax, pts, A.alpha(A.css('accent'), 0.12), -30);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2);
        const nulls = P.combNulls(st.d, 3);
        A.text(ctx, `Δt = ${fmt((st.d / P.C) * 1000, 2)} ms · first notch ${fmtHz(nulls[0])} · notch spacing ${fmtHz(P.C / st.d)}`, ax.x0 + 8, ax.y1 + 16, { size: 12, weight: 600 });
      },
    });
    host.addEventListener('input', () => { cv.redraw(); if (node) { node.dl.delayTime.value = st.d / P.C; node.rg.gain.value = st.r * 0.5; } });
  };

  /* ----------------------------------------------------------------------
     6. Phase & polarity summation
     ---------------------------------------------------------------------- */
  V.phase = function (host) {
    const st = A.controls(host, [
      { key: 'ph', label: 'Phase offset of wave B', type: 'range', min: 0, max: 360, step: 1, value: 90, unit: '°' },
      { key: 'b', label: 'Level of wave B', type: 'range', min: 0, max: 1, step: 0.01, value: 1 },
      { key: 'pol', label: 'Invert polarity of B', type: 'check', value: false },
    ]);
    const cv = A.canvas(host, {
      height: 260, animate: true,
      caption: 'Two identical waves in phase add +6 dB. At 180° (or with polarity flipped) they cancel. Anything between gives partial addition — the root of comb filtering, mic phase problems and subwoofer integration.',
      draw(ctx, w, h, t) {
        const y0 = h / 2, amp = h * 0.18, k = TAU / (w / 2.5), sh = t * 2;
        const b = st.b * (st.pol ? -1 : 1), ph = (st.ph * Math.PI) / 180;
        const curve = (fn, col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); for (let x = 0; x <= w; x += 2) { const y = y0 - fn(x) * amp; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); };
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(w, y0); ctx.stroke();
        curve((x) => Math.sin(k * x - sh), A.alpha(A.css('accent2'), 0.8), 1.5);
        curve((x) => b * Math.sin(k * x - sh + ph), A.alpha(A.css('c3'), 0.8), 1.5);
        curve((x) => Math.sin(k * x - sh) + b * Math.sin(k * x - sh + ph), A.css('accent'), 3);
        ctx.lineWidth = 1;
        const sum = Math.hypot(1 + b * Math.cos(ph), b * Math.sin(ph));
        A.text(ctx, `Sum: ${sum < 1e-3 ? '−∞' : (20 * Math.log10(sum) >= 0 ? '+' : '') + fmt(20 * Math.log10(sum), 1)} dB relative to A alone`, 12, 22, { weight: 700, size: 14 });
      },
    });
    cv.el.after(A.legend([[A.css('accent2'), 'Wave A'], [A.css('c3'), 'Wave B'], [A.css('accent'), 'A + B (what you hear)']]));
  };

  /* ----------------------------------------------------------------------
     7. Room modes 2D standing wave
     ---------------------------------------------------------------------- */
  V.modes2D = function (host, opts = {}) {
    const st = A.controls(host, [
      { key: 'L', label: 'Room length', type: 'range', min: 2, max: 12, step: 0.1, value: opts.L || 5, unit: 'm' },
      { key: 'W', label: 'Room width', type: 'range', min: 2, max: 10, step: 0.1, value: opts.W || 3.8, unit: 'm' },
      { key: 'nx', label: 'Mode index along length (nx)', type: 'range', min: 0, max: 4, step: 1, value: 1 },
      { key: 'ny', label: 'Mode index along width (ny)', type: 'range', min: 0, max: 4, step: 1, value: 0 },
    ]);
    const bar = el('div', { class: 'row' });
    const play = el('button', { class: 'primary', html: A.icon('play') + ' Hear this mode' });
    bar.appendChild(play);
    const info = el('span', { class: 'muted small' });
    bar.appendChild(info);
    host.appendChild(bar);
    let lut = null, img = null, listener = [0.62, 0.5];
    window.addEventListener('themechange', () => (lut = null));
    play.onclick = () => { const f = freq(); if (f > 0) A.audio.tone(f, 2.5, -14); };
    const freq = () => (P.C / 2) * Math.sqrt((st.nx / st.L) ** 2 + (st.ny / st.W) ** 2);
    A.canvas(host, {
      height: 330, animate: true,
      caption: 'Colour = sound pressure (orange high, blue low, background = zero). Nodes (no colour) are where that bass note disappears; antinodes at walls and corners are where it booms. Click to move the listener.',
      onPointer(p, api) { if (p.type === 'pointerdown') listener = [p.x / api.w, p.y / api.h]; },
      draw(ctx, w, h, t) {
        if (!lut) lut = V.divergingLUT();
        const aspect = st.L / st.W; let rw = w - 40, rh = rw / aspect;
        if (rh > h - 40) { rh = h - 40; rw = rh * aspect; }
        const ox = (w - rw) / 2, oy = (h - rh) / 2;
        const gw = 120, gh = Math.max(20, Math.round(120 / aspect));
        if (!img || img.width !== gw || img.height !== gh) img = ctx.createImageData(gw, gh);
        const f = freq(); const osc = f > 0 ? Math.cos(TAU * Math.min(f, 400) * 0.01 * t) : 1;
        for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
          const v = Math.cos((st.nx * Math.PI * (i + 0.5)) / gw) * Math.cos((st.ny * Math.PI * (j + 0.5)) / gh) * osc;
          const idx = Math.round((v * 0.5 + 0.5) * 255) * 3, o = (j * gw + i) * 4;
          img.data[o] = lut[idx]; img.data[o + 1] = lut[idx + 1]; img.data[o + 2] = lut[idx + 2]; img.data[o + 3] = 255;
        }
        const off = V._off || (V._off = document.createElement('canvas'));
        off.width = gw; off.height = gh; off.getContext('2d').putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = true; ctx.drawImage(off, ox, oy, rw, rh);
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, rw, rh); ctx.lineWidth = 1;
        const lx = ox + clamp(listener[0] * w - ox, 0, rw), ly = oy + clamp(listener[1] * h - oy, 0, rh);
        const pr = Math.abs(Math.cos((st.nx * Math.PI * (lx - ox)) / rw) * Math.cos((st.ny * Math.PI * (ly - oy)) / rh));
        ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.arc(lx, ly, 7, 0, TAU); ctx.fill();
        A.text(ctx, `Listener: ${pr < 0.03 ? 'null (−∞)' : fmt(20 * Math.log10(pr), 1) + ' dB'} vs. max`, lx + 10, ly - 10, { weight: 700, bg: A.alpha(A.css('panel'), 0.85) });
        A.text(ctx, `${st.L} m`, ox + rw / 2, oy - 6, { align: 'center', color: A.css('muted'), size: 11 });
        info.textContent = f > 0 ? ` Mode (${st.nx},${st.ny},0) = ${fmt(f, 1)} Hz — ${st.nx && st.ny ? 'tangential' : 'axial'}` : ' Choose a mode with nx or ny > 0';
      },
    });
  };

  /* ----------------------------------------------------------------------
     8. Reverberation: bouncing energy rays + decay curve
     ---------------------------------------------------------------------- */
  V.reverb = function (host) {
    const st = A.controls(host, [
      { key: 'alpha', label: 'Average absorption ᾱ', type: 'range', min: 0.03, max: 0.8, step: 0.01, value: 0.15 },
      { key: 'size', label: 'Room size', type: 'range', min: 3, max: 30, step: 0.5, value: 8, unit: 'm' },
    ]);
    const bar = el('div', { class: 'row' });
    const clap = el('button', { class: 'primary', html: A.icon('play') + ' Clap (fire rays)' });
    const hear = el('button', { html: 'Hear this reverb' });
    bar.append(clap, hear);
    host.appendChild(bar);
    let rays = [], hist = [], t0 = 0;
    const fire = (now) => {
      rays = Array.from({ length: 260 }, (_, i) => { const a = (i / 260) * TAU; return { x: 0.3, y: 0.55, vx: Math.cos(a), vy: Math.sin(a), e: 1 }; });
      hist = []; t0 = now;
    };
    let pending = true;
    clap.onclick = () => (pending = true);
    hear.onclick = () => {
      const ctx = A.audio.get(); if (!ctx) return;
      const V0 = st.size ** 2 * 3, S = 2 * (st.size * st.size + 2 * st.size * 3), T = P.eyring(V0, S, st.alpha);
      const len = Math.min(6, T * 1.4 + 0.2), n = Math.floor(ctx.sampleRate * len);
      const buf = ctx.createBuffer(2, n, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp((-6.91 * i) / ctx.sampleRate / T); }
      const conv = ctx.createConvolver(); conv.buffer = buf;
      const src = ctx.createBufferSource(); const cl = ctx.createBuffer(1, 2000, ctx.sampleRate);
      const cd = cl.getChannelData(0); for (let i = 0; i < 2000; i++) cd[i] = (Math.random() * 2 - 1) * Math.exp(-i / 200);
      src.buffer = cl; const g = ctx.createGain(); g.gain.value = 0.6;
      src.connect(conv).connect(g).connect(ctx.destination); src.connect(ctx.destination);
      src.start(); A.audio.track(src);
      pending = true;
    };
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Every bounce removes the fraction ᾱ of each ray’s energy. RT60 is the time for the total energy to fall by 60 dB (a millionth). Bigger rooms → fewer bounces per second → longer RT. More absorption → shorter RT.',
      draw(ctx, w, h, t) {
        if (pending) { fire(t); pending = false; }
        const rw = w * 0.5 - 20, rh = h - 40, ox = 15, oy = 20;
        const V0 = st.size ** 2 * 3, S = 2 * (st.size * st.size + 2 * st.size * 3);
        const T = P.eyring(V0, S, st.alpha);
        const speed = 0.9 / Math.sqrt(st.size / 8); // visual
        let E = 0;
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(ox, oy, rw, rh); ctx.lineWidth = 1;
        for (const r of rays) {
          r.x += r.vx * speed * 0.016; r.y += r.vy * speed * 0.016 * (rw / rh);
          if (r.x < 0 || r.x > 1) { r.vx *= -1; r.x = clamp(r.x, 0, 1); r.e *= 1 - st.alpha; }
          if (r.y < 0 || r.y > 1) { r.vy *= -1; r.y = clamp(r.y, 0, 1); r.e *= 1 - st.alpha; }
          E += r.e;
          ctx.fillStyle = A.alpha(A.css('accent'), Math.min(1, 0.15 + r.e));
          ctx.beginPath(); ctx.arc(ox + r.x * rw, oy + r.y * rh, 2.4, 0, TAU); ctx.fill();
        }
        const el = t - t0;
        if (hist.length < 2000) hist.push([el, 10 * Math.log10(E / rays.length + 1e-9)]);
        const ax = A.axes(ctx, w, h, { pad: { l: w * 0.5 + 50, t: 20, b: 34 }, x: { min: 0, max: 6, label: 'time (s, visual)' }, y: { min: -60, max: 0, label: 'energy (dB)' } });
        A.plotLine(ctx, ax, hist.map(([x, y]) => [x, y]), A.css('accent'), 2);
        A.text(ctx, `Eyring RT60 ≈ ${fmt(T, 2)} s (room ${st.size}×${st.size}×3 m)`, ax.x0 + 8, ax.y1 + 16, { weight: 700, size: 12 });
        if (el > 6.5) pending = true;
      },
    });
    host.addEventListener('input', () => (pending = true));
    void cv;
  };

  /* ----------------------------------------------------------------------
     9. Porous absorber: α(f) and particle-velocity diagram
     ---------------------------------------------------------------------- */
  V.porous = function (host, opts = {}) {
    const st = A.controls(host, [
      { key: 'd', label: 'Absorber thickness', type: 'range', min: 10, max: 300, step: 5, value: opts.d || 50, unit: 'mm' },
      { key: 'gap', label: 'Air gap behind', type: 'range', min: 0, max: 300, step: 5, value: opts.gap || 0, unit: 'mm' },
      { key: 'sigma', label: 'Flow resistivity σ', type: 'range', min: 2000, max: 60000, step: 500, value: opts.sigma || 12000, unit: 'Pa·s/m²', fmt: (v) => fmt(v / 1000, 1) + 'k' },
      { key: 'f', label: 'Show wave at', type: 'range', min: Math.log10(50), max: Math.log10(2000), step: 0.01, value: Math.log10(125), fmt: (v) => fmtHz(Math.pow(10, v)) },
    ]);
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Left: absorption coefficient (Miki model, random incidence). Right: at a hard wall the air particles can’t move (velocity = 0); they move fastest a quarter-wavelength out. Porous absorbers work by friction, so they must sit where air is moving — that’s why depth and air gaps matter.',
      draw(ctx, w, h) {
        const wl = w * 0.58;
        const ax = A.axes(ctx, wl, h, { x: { min: 50, max: 5000, log: true, label: 'Frequency (Hz)' }, y: { min: 0, max: 1.05, label: 'Absorption α', ticks: [0, 0.2, 0.4, 0.6, 0.8, 1] } });
        const pts = [], ptsN = [];
        for (let f = 50; f <= 5000; f *= 1.03) { pts.push([f, P.porousAlpha(f, st.sigma, st.d / 1000, st.gap / 1000)]); ptsN.push([f, P.porousAlpha(f, st.sigma, st.d / 1000, 0)]); }
        if (st.gap > 0) A.plotLine(ctx, ax, ptsN, A.css('muted'), 1.5, [5, 4]);
        A.plotFill(ctx, ax, pts, A.alpha(A.css('accent'), 0.15), 0);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.5);
        P.BANDS6.forEach((f) => { const a = P.porousAlpha(f, st.sigma, st.d / 1000, st.gap / 1000); A.text(ctx, fmt(a, 2), ax.X(f), ax.Y(a) - 8, { align: 'center', size: 10, color: A.css('muted') }); });
        // right panel: wall + absorber + velocity
        const x0 = wl + 30, x1 = w - 14, y0 = 30, y1 = h - 40;
        const f = Math.pow(10, st.f), lam = P.C / f;
        const span = Math.max(0.6, (st.d + st.gap) / 1000 * 1.6, lam / 4 * 1.3); // metres across panel
        const M = (m) => x0 + 14 + (m / span) * (x1 - x0 - 14);
        ctx.fillStyle = A.css('muted'); ctx.fillRect(x0, y0, 14, y1 - y0);
        A.text(ctx, 'wall', x0 + 7, y1 + 14, { align: 'center', size: 10, color: A.css('muted') });
        ctx.fillStyle = A.alpha(A.css('c4'), 0.35);
        const ga = M(st.gap / 1000), gb = M((st.gap + st.d) / 1000);
        ctx.fillRect(ga, y0, gb - ga, y1 - y0);
        A.text(ctx, 'absorber', (ga + gb) / 2, y1 + 14, { align: 'center', size: 10, color: A.css('c4') });
        ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2.5; ctx.beginPath();
        for (let x = x0 + 14; x <= x1; x++) {
          const m = ((x - x0 - 14) / (x1 - x0 - 14)) * span;
          const v = Math.abs(Math.sin((TAU * m) / lam));
          const y = y1 - v * (y1 - y0 - 10);
          x === x0 + 14 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.lineWidth = 1;
        const q = M(lam / 4);
        if (q < x1) { ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('accent'); ctx.beginPath(); ctx.moveTo(q, y0); ctx.lineTo(q, y1); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'λ/4 = ' + fmtLen(lam / 4), q, y0 - 6, { align: 'center', size: 11, color: A.css('accent') }); }
        A.text(ctx, `particle velocity @ ${fmtHz(f)}`, x0 + 18, y0 + 12, { size: 11, color: A.css('accent2') });
      },
    });
    host.addEventListener('input', () => cv.redraw());
    return st;
  };

  /* ----------------------------------------------------------------------
     10. Surface interaction: reflection / absorption / diffusion / diffraction
     ---------------------------------------------------------------------- */
  V.surfaces = function (host) {
    let mode = 'reflect';
    host.appendChild(A.seg([['reflect', 'Reflection'], ['absorb', 'Absorption'], ['diffuse', 'Diffusion'], ['scatter-lf', 'Low freq. vs. small object'], ['diffract', 'Diffraction (edge)']], mode, (v) => { mode = v; rays = []; }));
    let rays = [], acc = 0;
    const desc = {
      reflect: 'A hard flat surface returns energy like a mirror: angle in = angle out. One strong, coherent reflection → comb filtering & flutter echo between parallel walls.',
      absorb: 'A porous absorber converts sound to heat by friction. The reflection is weaker (shown faded); how much weaker depends on frequency and depth.',
      diffuse: 'A diffuser scatters energy in many directions and spreads it in time. The energy is still in the room (liveliness) but no single reflection dominates.',
      'scatter-lf': 'An object much smaller than the wavelength is “invisible” to it: a 125 Hz wave (2.7 m long) flows around a 30 cm panel almost untouched.',
      diffract: 'Sound bends around edges — low frequencies the most. That’s why barriers and walls with gaps leak bass, and why absorbers work beyond their own edges.',
    };
    const cap = el('div', { class: 'small', style: { marginTop: '8px' } });
    A.canvas(host, {
      height: 300, animate: true,
      draw(ctx, w, h, t, dt) {
        cap.textContent = desc[mode];
        const sy = h - 50;
        acc += dt;
        if (acc > 0.22) { acc = 0; rays.push({ x: 40, y: 30, vx: 1, vy: 1, e: 1, born: t, kids: null }); }
        // surface
        if (mode === 'diffuse') {
          const wells = [0, 1, 4, 2, 2, 4, 1];
          for (let i = 0; i < 28; i++) { const d = wells[i % 7] * 6; ctx.fillStyle = A.css('muted'); ctx.fillRect(w * 0.15 + i * (w * 0.7) / 28, sy + d, (w * 0.7) / 28 - 2, 40 - d); }
        } else if (mode === 'absorb') {
          ctx.fillStyle = A.alpha(A.css('c4'), 0.5); ctx.fillRect(w * 0.15, sy, w * 0.7, 26); ctx.fillStyle = A.css('muted'); ctx.fillRect(w * 0.15, sy + 26, w * 0.7, 14);
        } else if (mode === 'scatter-lf') {
          ctx.fillStyle = A.css('muted'); ctx.fillRect(w / 2 - 12, h / 2 - 30, 24, 60);
        } else if (mode === 'diffract') {
          ctx.fillStyle = A.css('muted'); ctx.fillRect(w / 2 - 6, h * 0.35, 12, h * 0.65);
        } else { ctx.fillStyle = A.css('muted'); ctx.fillRect(w * 0.15, sy, w * 0.7, 40); }
        if (mode === 'scatter-lf' || mode === 'diffract') {
          // wavefronts
          const lam = mode === 'scatter-lf' ? 110 : 60;
          for (let k = 0; k < 8; k++) {
            const x = ((t * 60 + k * lam) % (w + lam)) - lam / 2;
            ctx.strokeStyle = A.alpha(A.css('accent'), 0.8);
            ctx.lineWidth = 2;
            if (mode === 'scatter-lf') { ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, h - 10); ctx.stroke(); }
            else {
              const bx = w / 2;
              ctx.beginPath();
              if (x < bx) { ctx.moveTo(x, 10); ctx.lineTo(x, h - 10); }
              else { ctx.moveTo(x, 10); ctx.lineTo(x, h * 0.35 - 4); ctx.arc(bx, h * 0.35, x - bx, -Math.PI / 2 + 0.0001, Math.PI / 2, false); }
              ctx.stroke();
            }
            ctx.lineWidth = 1;
          }
          A.text(ctx, mode === 'scatter-lf' ? 'λ ≫ object: wave passes almost undisturbed' : 'shadow zone is filled by bending (diffracted) waves', 14, 22, { size: 12, color: A.css('muted') });
          return;
        }
        for (const r of rays) {
          const age = t - r.born;
          const sp = 170;
          if (!r.kids) {
            r.x = 40 + age * sp * 0.75; r.y = 30 + age * sp * 0.55;
            if (r.y >= sy) {
              r.kids = [];
              if (mode === 'reflect') r.kids.push({ ang: -Math.atan2(0.55, 0.75), e: 1 });
              else if (mode === 'absorb') r.kids.push({ ang: -Math.atan2(0.55, 0.75), e: 0.12 });
              else for (let k = 0; k < 9; k++) r.kids.push({ ang: -Math.PI * (0.1 + 0.8 * (k / 8)), e: 0.35, delay: Math.random() * 0.12 });
              r.hx = r.x; r.hy = sy; r.ht = t;
            }
            ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.arc(r.x, r.y, 3.5, 0, TAU); ctx.fill();
          } else {
            const a2 = t - r.ht;
            for (const k of r.kids) {
              const aa = a2 - (k.delay || 0); if (aa < 0) continue;
              const x = r.hx + Math.cos(k.ang) * aa * sp, y = r.hy + Math.sin(k.ang) * aa * sp;
              ctx.fillStyle = A.alpha(A.css('accent'), k.e); ctx.beginPath(); ctx.arc(x, y, 3.5 * Math.sqrt(k.e) + 1, 0, TAU); ctx.fill();
            }
          }
        }
        rays = rays.filter((r) => t - r.born < 4);
      },
    });
    host.appendChild(cap);
  };

  /* ----------------------------------------------------------------------
     11. Mass law / double wall TL explorer
     ---------------------------------------------------------------------- */
  V.massLaw = function (host) {
    const st = A.controls(host, [
      { key: 'mat', label: 'Panel material', type: 'select', value: 'gypsumX', options: Object.entries(P.PANELS).map(([k, v]) => [k, v.name]) },
      { key: 't', label: 'Panel thickness', type: 'range', min: 3, max: 250, step: 1, value: 16, unit: 'mm' },
      { key: 'dbl', label: 'Make it a double wall (two equal leaves)', type: 'check', value: false },
      { key: 'gap', label: 'Cavity depth', type: 'range', min: 20, max: 400, step: 5, value: 100, unit: 'mm' },
      { key: 'fill', label: 'Insulation in cavity', type: 'check', value: true },
    ]);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const cv = A.canvas(host, {
      height: 320,
      caption: 'Dashed line: pure mass law (+6 dB per doubling of mass or frequency). Real panels dip at the <b>coincidence frequency</b> where bending waves in the panel match the air wavelength. Double walls trade a resonance dip at f₀ for a much steeper rise above it.',
      draw(ctx, w, h) {
        const leaf = P.leafProps([{ mat: st.mat, t: st.t / 1000 }]);
        const ax = A.axes(ctx, w, h, { x: { min: 50, max: 5000, log: true, label: 'Frequency (Hz)' }, y: { min: 0, max: 90, label: 'Transmission loss (dB)' } });
        const ml = [], s = [], d = [];
        for (let f = 50; f <= 5000; f *= 1.02) {
          ml.push([f, P.massLaw(leaf.m * (st.dbl ? 2 : 1), f)]);
          s.push([f, P.singleLeafTL(leaf, f)]);
          if (st.dbl) d.push([f, P.doubleLeafTL({ leaf1: leaf, leaf2: leaf, d: st.gap / 1000, filled: st.fill, conn: 'none' }, f).tl]);
        }
        A.plotLine(ctx, ax, ml, A.css('muted'), 1.5, [6, 4]);
        A.plotLine(ctx, ax, s, st.dbl ? A.alpha(A.css('accent2'), 0.7) : A.css('accent'), st.dbl ? 1.5 : 2.5);
        if (st.dbl) A.plotLine(ctx, ax, d, A.css('accent'), 2.5);
        if (leaf.fc < 5000 && leaf.fc > 50) { ctx.strokeStyle = A.css('bad'); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(leaf.fc), ax.y1); ctx.lineTo(ax.X(leaf.fc), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'fc ' + fmtHz(leaf.fc), ax.X(leaf.fc) + 4, ax.y1 + 14, { size: 11, color: A.css('bad') }); }
        if (st.dbl) { const r = P.doubleLeafTL({ leaf1: leaf, leaf2: leaf, d: st.gap / 1000, filled: st.fill, conn: 'none' }, 100); if (r.f0 > 50 && r.f0 < 5000) A.text(ctx, 'f₀ ' + fmtHz(r.f0), ax.X(r.f0), ax.y0 - 8, { size: 11, color: A.css('accent'), align: 'center' }); }
      },
    });
    const upd = () => {
      const leaf = P.leafProps([{ mat: st.mat, t: st.t / 1000 }]);
      const tl1 = P.STC_BANDS.map((f) => P.singleLeafTL(leaf, P.exactThird(f)));
      let stc = P.stc(tl1), lab = 'Single panel';
      if (st.dbl) { stc = P.stc(P.STC_BANDS.map((f) => P.doubleLeafTL({ leaf1: leaf, leaf2: leaf, d: st.gap / 1000, filled: st.fill, conn: 'none' }, P.exactThird(f)).tl)); lab = 'Double wall'; }
      out.innerHTML = A.statBox('Surface mass', fmt(leaf.m * (st.dbl ? 2 : 1), 1) + ' <small>kg/m²</small>') + A.statBox('Coincidence fc', fmtHz(leaf.fc)) + A.statBox(lab + ' STC (est.)', stc, P.stcDescribe(stc));
      cv.redraw();
    };
    host.addEventListener('input', upd); host.addEventListener('change', upd); upd();
  };

  /* ----------------------------------------------------------------------
     12. Vibration isolation: animated mass-spring + transmissibility
     ---------------------------------------------------------------------- */
  V.transmissibility = function (host, opts = {}) {
    const st = A.controls(host, [
      { key: 'fn', label: 'Natural frequency fn', type: 'range', min: 2, max: 40, step: 0.5, value: opts.fn || 8, unit: 'Hz' },
      { key: 'ff', label: 'Disturbing frequency', type: 'range', min: 2, max: 120, step: 0.5, value: opts.ff || 30, unit: 'Hz' },
      { key: 'z', label: 'Damping ratio ζ', type: 'range', min: 0.01, max: 0.5, step: 0.01, value: 0.05 },
    ]);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'The isolator only isolates above √2·fn. Near fn it <i>amplifies</i> vibration (resonance). Rule of thumb: make fn at most ⅓ of the lowest frequency you need to stop (≈ 90 % isolation). Damping tames the resonance but slightly reduces high-frequency isolation.',
      draw(ctx, w, h, t) {
        const r = st.ff / st.fn, T = P.transmissibility(r, st.z);
        // left: animation
        const cx = 90, base = h - 40;
        const slow = 1.2; // visual speed
        const bx = Math.sin(TAU * slow * t) * 6;
        const mx = Math.sin(TAU * slow * t - Math.atan2(2 * st.z * r, 1 - r * r)) * 6 * Math.min(T, 4);
        ctx.fillStyle = A.css('muted'); ctx.fillRect(cx - 50, base + bx, 100, 12);
        A.text(ctx, 'vibrating floor', cx, base + 30, { align: 'center', size: 10, color: A.css('muted') });
        const topY = 90 + mx;
        ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2; ctx.beginPath();
        const n = 9; for (let i = 0; i <= n; i++) { const y = topY + 40 + ((base + bx - topY - 40) * i) / n; ctx.lineTo(cx + (i % 2 ? 14 : -14) * (i && i < n ? 1 : 0), y); } ctx.stroke(); ctx.lineWidth = 1;
        ctx.fillStyle = A.css('accent'); ctx.fillRect(cx - 40, topY, 80, 40);
        A.text(ctx, 'mass', cx, topY + 25, { align: 'center', color: A.css('accent-ink'), weight: 700 });
        // right: curve
        const ax = A.axes(ctx, w, h, { pad: { l: 220 }, x: { min: 0.1, max: 10, log: true, label: 'Frequency ratio f / fn', ticks: [0.1, 0.2, 0.5, 1, 1.41, 2, 3, 5, 10], fmt: (v) => (v === 1.41 ? '√2' : String(v)) }, y: { min: -40, max: 25, label: 'Transmissibility (dB)' } });
        const pts = []; for (let x = 0.1; x <= 10; x *= 1.02) pts.push([x, 20 * Math.log10(P.transmissibility(x, st.z))]);
        ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.X(1.414), ax.y1, ax.x1 - ax.X(1.414), ax.y0 - ax.y1);
        ctx.fillStyle = A.alpha(A.css('bad'), 0.08); ctx.fillRect(ax.x0, ax.y1, ax.X(1.414) - ax.x0, ax.y0 - ax.y1);
        A.text(ctx, 'amplification', ax.x0 + 6, ax.y1 + 14, { size: 11, color: A.css('bad') });
        A.text(ctx, 'isolation zone', ax.X(1.6), ax.y1 + 14, { size: 11, color: A.css('good') });
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.5);
        const rr = clamp(r, 0.1, 10);
        ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.arc(ax.X(rr), ax.Y(clamp(20 * Math.log10(T), -40, 25)), 6, 0, TAU); ctx.fill();
      },
    });
    const upd = () => {
      const r = st.ff / st.fn, T = P.transmissibility(r, st.z);
      out.innerHTML = A.statBox('Ratio f/fn', fmt(r, 2)) + A.statBox('Transmissibility', fmt(T, 3), T > 1 ? 'Amplifying!' : 'Isolating', T > 1 ? 'bad' : 'good') +
        A.statBox('Isolation efficiency', fmt(Math.max(0, (1 - T) * 100), 1) + ' %') + A.statBox('Static deflection for fn', fmt(Math.pow(15.76 / st.fn, 2), 1) + ' mm', 'fn = 15.76/√δ(mm)');
      cv.redraw();
    };
    host.addEventListener('input', upd); upd();
  };

  /* ----------------------------------------------------------------------
     13. Helmholtz resonator animation
     ---------------------------------------------------------------------- */
  V.helmholtz = function (host) {
    const st = A.controls(host, [
      { key: 'vol', label: 'Cavity volume', type: 'range', min: 0.5, max: 50, step: 0.5, value: 5, unit: 'litres' },
      { key: 'r', label: 'Neck radius', type: 'range', min: 5, max: 60, step: 1, value: 20, unit: 'mm' },
      { key: 'l', label: 'Neck length', type: 'range', min: 5, max: 200, step: 1, value: 40, unit: 'mm' },
    ]);
    const bar = el('div', { class: 'row' });
    const b = el('button', { class: 'primary', html: A.icon('play') + ' Hear its pitch' });
    bar.appendChild(b); host.appendChild(bar);
    const f0 = () => P.helmholtzF0(Math.PI * (st.r / 1000) ** 2, st.l / 1000, st.vol / 1000, st.r / 1000);
    b.onclick = () => A.audio.tone(f0(), 1.5, -14);
    A.canvas(host, {
      height: 260, animate: true,
      caption: 'The air in the neck is a mass; the air in the cavity is a spring. Blow across a bottle and it rings at f₀ = (c/2π)·√(S / (V·L′)). In a slotted or perforated panel every hole is a tiny neck sharing the cavity behind — a tunable bass/mid absorber.',
      draw(ctx, w, h, t) {
        const f = f0();
        const cx = w * 0.3, by = h - 30, bw = Math.min(200, 60 + st.vol * 4), bh = Math.min(170, 50 + st.vol * 3);
        const nr = Math.max(4, st.r * 0.6), nl = Math.min(90, st.l * 0.5 + 10);
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - nr, by - bh - nl); ctx.lineTo(cx - nr, by - bh); ctx.lineTo(cx - bw / 2, by - bh); ctx.lineTo(cx - bw / 2, by); ctx.lineTo(cx + bw / 2, by); ctx.lineTo(cx + bw / 2, by - bh); ctx.lineTo(cx + nr, by - bh); ctx.lineTo(cx + nr, by - bh - nl);
        ctx.stroke(); ctx.lineWidth = 1;
        const osc = Math.sin(TAU * 1.4 * t);
        ctx.fillStyle = A.css('accent'); ctx.fillRect(cx - nr + 2, by - bh - nl + 4 + osc * 8, nr * 2 - 4, nl - 8);
        // cavity "spring" shading
        ctx.fillStyle = A.alpha(A.css('accent2'), 0.15 + 0.15 * osc); ctx.fillRect(cx - bw / 2 + 2, by - bh + 2, bw - 4, bh - 4);
        A.text(ctx, 'air plug = mass', cx + nr + 10, by - bh - nl / 2, { size: 11, color: A.css('accent') });
        A.text(ctx, 'trapped air = spring', cx, by - bh / 2, { align: 'center', size: 11, color: A.css('accent2') });
        A.text(ctx, `f₀ = ${fmtHz(f)}`, w * 0.62, h / 2 - 10, { size: 26, weight: 700, color: A.css('accent') });
        A.text(ctx, `λ = ${fmtLen(P.C / f)} — yet the resonator is only ~${fmt(Math.cbrt(st.vol / 1000) * 100, 0)} cm across`, w * 0.62, h / 2 + 16, { size: 12, color: A.css('muted') });
      },
    });
  };

  /* ----------------------------------------------------------------------
     14. Equal loudness contours
     ---------------------------------------------------------------------- */
  V.equalLoudness = function (host) {
    const st = A.controls(host, [{ key: 'ph', label: 'Highlight contour', type: 'range', min: 20, max: 100, step: 10, value: 40, unit: 'phon' }]);
    const cv = A.canvas(host, {
      height: 330,
      caption: 'ISO 226:2003 equal-loudness contours. Every point on a line sounds equally loud. At low listening levels the ear is very insensitive to bass — mix too quietly and you add too much low end; mix too loud and you add too little. This is why studios standardise monitoring levels (≈ 79–85 dB SPL).',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 12500, log: true, label: 'Frequency (Hz)' }, y: { min: -10, max: 130, label: 'Sound pressure level (dB SPL)' } });
        for (let ph = 20; ph <= 100; ph += 10) {
          const pts = P.equalLoudness(ph);
          const on = ph === st.ph;
          A.plotLine(ctx, ax, pts, on ? A.css('accent') : A.alpha(A.css('accent2'), 0.5), on ? 3 : 1.3);
          A.text(ctx, ph + ' phon', ax.X(1000) + 3, ax.Y(ph) - 4, { size: 10, color: on ? A.css('accent') : A.css('muted') });
        }
        const pts = P.equalLoudness(st.ph);
        A.text(ctx, `At ${st.ph} phon: 50 Hz needs ${fmt(pts[4][1] - st.ph, 0)} dB more than 1 kHz to sound equally loud`, ax.x0 + 10, ax.y1 + 16, { size: 12, weight: 600 });
      },
    });
    host.addEventListener('input', () => cv.redraw());
  };

  /* ----------------------------------------------------------------------
     15. Sampling & aliasing
     ---------------------------------------------------------------------- */
  V.sampling = function (host) {
    const st = A.controls(host, [
      { key: 'f', label: 'Signal frequency', type: 'range', min: 1, max: 30, step: 0.1, value: 3, unit: 'Hz (visual)' },
      { key: 'fs', label: 'Sample rate', type: 'range', min: 4, max: 60, step: 1, value: 20, unit: 'S/s' },
      { key: 'bits', label: 'Bit depth (quantisation)', type: 'range', min: 2, max: 16, step: 1, value: 16, unit: 'bit' },
    ]);
    const cv = A.canvas(host, {
      height: 280,
      caption: 'Nyquist: you need more than 2 samples per cycle. Above fs/2 the samples describe a false, lower frequency (an alias) — which is why converters filter before sampling. Bit depth sets the step size: each bit adds ≈ 6 dB of dynamic range (16-bit ≈ 96 dB, 24-bit ≈ 144 dB).',
      draw(ctx, w, h) {
        const y0 = h / 2, amp = h * 0.36, T = 1; // 1 s window
        const X = (t) => 20 + (t / T) * (w - 40);
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(20, y0); ctx.lineTo(w - 20, y0); ctx.stroke();
        ctx.strokeStyle = A.alpha(A.css('accent2'), 0.6); ctx.lineWidth = 1.5; ctx.beginPath();
        for (let i = 0; i <= 800; i++) { const t = i / 800; const y = y0 - Math.sin(TAU * st.f * t) * amp; i ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y); } ctx.stroke();
        const q = Math.pow(2, st.bits - 1);
        const samples = [];
        for (let n = 0; n <= st.fs * T; n++) { const t = n / st.fs; const v = Math.round(Math.sin(TAU * st.f * t) * q) / q; samples.push([t, v]); }
        // alias reconstruction
        let fa = st.f % st.fs; if (fa > st.fs / 2) fa = st.fs - fa;
        const sign = (st.f % st.fs) > st.fs / 2 ? -1 : 1;
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.5; ctx.beginPath();
        for (let i = 0; i <= 800; i++) { const t = i / 800; const y = y0 - sign * Math.sin(TAU * fa * t) * amp; i ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y); } ctx.stroke(); ctx.lineWidth = 1;
        ctx.fillStyle = A.css('text');
        samples.forEach(([t, v]) => { ctx.beginPath(); ctx.moveTo(X(t), y0); ctx.lineTo(X(t), y0 - v * amp); ctx.strokeStyle = A.css('muted'); ctx.stroke(); ctx.beginPath(); ctx.arc(X(t), y0 - v * amp, 3.5, 0, TAU); ctx.fill(); });
        const ok = st.f < st.fs / 2;
        A.text(ctx, ok ? `OK: ${fmt(st.f, 1)} Hz < Nyquist ${fmt(st.fs / 2, 1)} Hz — reconstructs correctly` : `ALIAS: ${fmt(st.f, 1)} Hz is above Nyquist → heard as ${fmt(fa, 1)} Hz`, 24, 22, { weight: 700, color: ok ? A.css('good') : A.css('bad') });
        A.text(ctx, `Dynamic range at ${st.bits} bit ≈ ${fmt(6.02 * st.bits + 1.76, 0)} dB`, 24, h - 10, { size: 12, color: A.css('muted') });
      },
    });
    cv.el.after(A.legend([[A.css('accent2'), 'Original signal'], [A.css('accent'), 'What the samples reconstruct']]));
    host.addEventListener('input', () => cv.redraw());
  };

  /* ----------------------------------------------------------------------
     16. Hall shapes: plan ray-trace + echogram (ITDG, lateral energy)
     ---------------------------------------------------------------------- */
  V.hall = function (host) {
    let shape = 'shoebox';
    const seg = A.seg([['shoebox', 'Shoebox'], ['fan', 'Fan-shaped'], ['vineyard', 'Vineyard (terraced)']], shape, (v) => { shape = v; cv.redraw(); });
    host.appendChild(seg);
    const cv = A.canvas(host, {
      height: 340,
      caption: 'Plan view with first-order image-source reflections to one seat (left) and the resulting echogram (right). Shoeboxes deliver early, strong <b>lateral</b> reflections from the narrow parallel side walls — the main ingredient of envelopment. Fan shapes splay the walls so side reflections miss the centre seats. Vineyards recover early reflections by terracing seating blocks whose fronts act as reflectors.',
      draw(ctx, w, h) {
        const pw = w * 0.45, ox = 10, oy = 10, ph = h - 20;
        // geometry in metres: stage at bottom
        let walls;
        if (shape === 'shoebox') walls = [[[-12, 0], [-12, 44]], [[12, 0], [12, 44]], [[-12, 44], [12, 44]]];
        else if (shape === 'fan') walls = [[[-9, 0], [-24, 40]], [[9, 0], [24, 40]], [[-24, 40], [24, 40]]];
        else walls = [[[-18, -6], [-26, 30]], [[18, -6], [26, 30]], [[-26, 30], [26, 30]], [[-9, 8], [-3, 8]], [[3, 8], [9, 8]], [[-13, 16], [-6, 18]], [[6, 18], [13, 16]]];
        const S = [0, 3], R = [4, 24];
        const xs = walls.flat().map((p) => p[0]), ys = walls.flat().map((p) => p[1]);
        const mnx = Math.min(...xs) - 2, mxx = Math.max(...xs) + 2, mny = Math.min(...ys, 0) - 2, mxy = Math.max(...ys) + 2;
        const sc = Math.min(pw / (mxx - mnx), ph / (mxy - mny));
        const T = (p) => [ox + (p[0] - mnx) * sc, oy + ph - (p[1] - mny) * sc];
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3;
        walls.forEach(([a, b]) => { const A1 = T(a), B1 = T(b); ctx.beginPath(); ctx.moveTo(...A1); ctx.lineTo(...B1); ctx.stroke(); });
        ctx.lineWidth = 1;
        const refl = [];
        const d0 = Math.hypot(R[0] - S[0], R[1] - S[1]);
        walls.forEach(([a, b]) => {
          // mirror S across line ab
          const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
          const t = ((S[0] - a[0]) * dx + (S[1] - a[1]) * dy) / L2;
          const fx = a[0] + t * dx, fy = a[1] + t * dy;
          const I = [2 * fx - S[0], 2 * fy - S[1]];
          // intersection of I→R with segment
          const ex = R[0] - I[0], ey = R[1] - I[1];
          const den = ex * dy - ey * dx; if (Math.abs(den) < 1e-9) return;
          const u = ((a[0] - I[0]) * ey - (a[1] - I[1]) * ex) / (dx * ey - dy * ex);
          const s2 = ((a[0] - I[0]) * dy - (a[1] - I[1]) * dx) / (ex * dy - ey * dx);
          if (u < 0 || u > 1 || s2 < 0 || s2 > 1) return;
          const Pt = [a[0] + u * dx, a[1] + u * dy];
          const dist = Math.hypot(R[0] - I[0], R[1] - I[1]);
          const lateral = Math.abs((R[0] - Pt[0]) / Math.hypot(R[0] - Pt[0], R[1] - Pt[1]));
          refl.push({ Pt, dist, lateral });
        });
        // draw rays
        ctx.strokeStyle = A.alpha(A.css('accent2'), 0.9); ctx.beginPath(); ctx.moveTo(...T(S)); ctx.lineTo(...T(R)); ctx.stroke();
        refl.forEach((r) => { ctx.strokeStyle = A.alpha(r.lateral > 0.5 ? A.css('accent') : A.css('c3'), 0.9); ctx.beginPath(); ctx.moveTo(...T(S)); ctx.lineTo(...T(r.Pt)); ctx.lineTo(...T(R)); ctx.stroke(); });
        ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.arc(...T(S), 6, 0, TAU); ctx.fill();
        ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.arc(...T(R), 5, 0, TAU); ctx.fill();
        A.text(ctx, 'stage', T(S)[0], T(S)[1] + 18, { align: 'center', size: 11, color: A.css('muted') });
        // echogram
        const ax = A.axes(ctx, w, h, { pad: { l: pw + 60, b: 36 }, x: { min: 0, max: 120, label: 'Time after direct sound (ms)' }, y: { min: -20, max: 0, label: 'Relative level (dB)' } });
        const bar = (tms, db, col) => { ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax.X(tms), ax.y0); ctx.lineTo(ax.X(tms), ax.Y(Math.max(-20, db))); ctx.stroke(); ctx.lineWidth = 1; };
        bar(0.6, 0, A.css('accent2'));
        let itdg = Infinity, lat = 0, tot = 1;
        refl.forEach((r) => {
          const tms = ((r.dist - d0) / P.C) * 1000; const db = 20 * Math.log10(d0 / r.dist) - 1;
          itdg = Math.min(itdg, tms); const e = Math.pow(10, db / 10); tot += e; lat += e * r.lateral * r.lateral;
          bar(tms, db, r.lateral > 0.5 ? A.css('accent') : A.css('c3'));
        });
        // late tail
        ctx.fillStyle = A.alpha(A.css('muted'), 0.25);
        for (let t = 25; t < 120; t += 2.5) { const db = -6 - t * 0.09 + (Math.sin(t * 13.7) * 1.5); ctx.fillRect(ax.X(t) - 1, ax.Y(db), 2, ax.y0 - ax.Y(db)); }
        A.text(ctx, `ITDG ≈ ${isFinite(itdg) ? fmt(itdg, 0) : '—'} ms · early lateral energy fraction ≈ ${fmt((lat / tot) * 100, 0)} %`, ax.x0 + 6, ax.y1 + 16, { size: 12, weight: 700 });
      },
    });
    cv.el.after(A.legend([[A.css('accent2'), 'Direct sound'], [A.css('accent'), 'Lateral reflection (from the side)'], [A.css('c3'), 'Frontal/overhead-type reflection'], [A.css('muted'), 'Late reverberation']]));
  };

  /* ----------------------------------------------------------------------
     17. NC curve plot with a spectrum
     ---------------------------------------------------------------------- */
  V.ncPlot = function (host, getSpectrum, opts = {}) {
    const cv = A.canvas(host, {
      height: opts.height || 300,
      caption: opts.caption,
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 50, max: 10000, log: true, label: 'Octave band (Hz)', ticks: P.OCT, fmt: A.shortHz }, y: { min: 0, max: 90, label: 'Sound pressure level (dB)' } });
        Object.entries(P.NC_CURVES).forEach(([k, arr]) => {
          A.plotLine(ctx, ax, P.OCT.map((f, i) => [f, arr[i]]), A.alpha(A.css('muted'), 0.6), 1);
          A.text(ctx, 'NC-' + k, ax.X(8000) + 3, ax.Y(arr[7]) + 3, { size: 9, color: A.css('muted') });
        });
        const sp = getSpectrum();
        (Array.isArray(sp[0]) ? sp : [sp]).forEach((s, i) => {
          A.plotLine(ctx, ax, P.OCT.map((f, k) => [f, s[k]]), A.series(i), 2.5);
          P.OCT.forEach((f, k) => { ctx.fillStyle = A.series(i); ctx.beginPath(); ctx.arc(ax.X(f), ax.Y(s[k]), 3.5, 0, TAU); ctx.fill(); });
        });
      },
    });
    return cv;
  };

  /* ----------------------------------------------------------------------
     18. Control room reflections plan (image sources, LEDE/RFZ)
     ---------------------------------------------------------------------- */
  V.reflections = function (host, opts = {}) {
    const st = A.controls(host, [
      { key: 'L', label: 'Room length', type: 'range', min: 3, max: 10, step: 0.1, value: opts.L || 5.5, unit: 'm' },
      { key: 'W', label: 'Room width', type: 'range', min: 2.5, max: 8, step: 0.1, value: opts.W || 4, unit: 'm' },
      { key: 'lp', label: 'Listener from front wall', type: 'range', min: 0.25, max: 0.7, step: 0.01, value: 0.38, fmt: (v) => fmt(v * 100, 0) + ' %' },
      { key: 'spread', label: 'Speaker spacing', type: 'range', min: 1, max: 3.5, step: 0.05, value: 1.6, unit: 'm' },
      { key: 'rear', label: 'Show rear-wall reflection', type: 'check', value: true },
    ]);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const cv = A.canvas(host, {
      height: 380,
      caption: 'Image-source method: mirror each speaker in a wall; the straight line from the mirror image to your head crosses the wall at the <b>first-reflection point</b> — the spot to treat (absorb or diffuse, or angle away for an RFZ). Use the classic mirror trick to find them in a real room.',
      draw(ctx, w, h) {
        const L = st.L, W = st.W;
        const sc = Math.min((w - 40) / W, (h - 40) / L), ox = (w - W * sc) / 2, oy = 20;
        const T = (x, y) => [ox + x * sc, oy + y * sc];
        const lx = W / 2, ly = st.lp * L;
        const half = st.spread / 2;
        // equilateral triangle: speakers ahead by spread*sin60
        const sy = Math.max(0.35, ly - st.spread * Math.sin(Math.PI / 3));
        const spk = [[lx - half, sy], [lx + half, sy]];
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, W * sc, L * sc); ctx.lineWidth = 1;
        A.text(ctx, 'front wall', ox + (W * sc) / 2, oy - 6, { align: 'center', size: 11, color: A.css('muted') });
        const pts = [];
        spk.forEach((s, i) => {
          const walls = [['L', 0], ['R', W]];
          walls.forEach(([n, wx]) => {
            const p = P.reflectionPointX([s[0], s[1]], [lx, ly], wx);
            pts.push(p);
            const img = [2 * wx - s[0], s[1]];
            ctx.setLineDash([3, 4]); ctx.strokeStyle = A.alpha(A.css('muted'), 0.8); ctx.beginPath(); ctx.moveTo(...T(...img)); ctx.lineTo(...T(p[0], p[1])); ctx.stroke(); ctx.setLineDash([]);
            ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(...T(...s)); ctx.lineTo(...T(p[0], p[1])); ctx.lineTo(...T(lx, ly)); ctx.stroke(); ctx.lineWidth = 1;
            ctx.fillStyle = A.alpha(A.css('accent'), 0.35); const q = T(p[0], p[1]); ctx.fillRect(q[0] - 5, q[1] - 22, 10, 44);
            ctx.fillStyle = A.alpha(A.css('muted'), 0.6); const ii = T(...img); ctx.beginPath(); ctx.arc(ii[0], ii[1], 5, 0, TAU); ctx.fill();
          });
          if (st.rear) {
            const img = [s[0], 2 * L - s[1]];
            const t = (L - ly) / (img[1] - ly); const p = [lx + t * (img[0] - lx), L];
            ctx.strokeStyle = A.alpha(A.css('c3'), 0.8); ctx.beginPath(); ctx.moveTo(...T(...s)); ctx.lineTo(...T(...p)); ctx.lineTo(...T(lx, ly)); ctx.stroke();
          }
          ctx.strokeStyle = A.alpha(A.css('accent2'), 0.9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...T(...s)); ctx.lineTo(...T(lx, ly)); ctx.stroke(); ctx.lineWidth = 1;
          ctx.fillStyle = A.css('accent2'); const q = T(...s); ctx.fillRect(q[0] - 7, q[1] - 7, 14, 14);
          void i;
        });
        ctx.fillStyle = A.css('text'); const q = T(lx, ly); ctx.beginPath(); ctx.arc(q[0], q[1], 7, 0, TAU); ctx.fill();
        A.text(ctx, 'you', q[0] + 10, q[1] + 4, { size: 11 });
        // ITDG estimate
        const direct = Math.hypot(spk[0][0] - lx, spk[0][1] - ly);
        const side = Math.hypot(2 * 0 - spk[0][0] - lx, spk[0][1] - ly);
        const rear = Math.hypot(spk[0][0] - lx, 2 * L - spk[0][1] - ly);
        out.innerHTML = A.statBox('Side reflection delay', fmt(((side - direct) / P.C) * 1000, 1) + ' ms', 'Keep early reflections ≥ 15–20 dB down for ~20 ms (RFZ/LEDE idea)') +
          A.statBox('Rear wall delay', fmt(((rear - direct) / P.C) * 1000, 1) + ' ms') +
          A.statBox('Listener position', fmt(ly, 2) + ' m', fmt(st.lp * 100, 0) + ' % of length') +
          A.statBox('Speaker to front wall', fmt(sy, 2) + ' m', 'SBIR null ≈ ' + fmtHz(P.sbirNull(sy)));
      },
    });
    host.addEventListener('input', () => cv.redraw());
  };

  /* ----------------------------------------------------------------------
     19. 2D FDTD wave tank — the centrepiece simulation
     ---------------------------------------------------------------------- */
  V.waveTank = function (host, opts = {}) {
    const W = 220, H = 140, N = W * H;
    let p = new Float32Array(N), pp = new Float32Array(N), np = new Float32Array(N);
    const wall = new Uint8Array(N), damp = new Float32Array(N);
    let srcs = [], tick = 0, lut = null, img = null, tool = 'source', freq = 0.06, pulse = false;
    const presets = {
      free: 'Free field (point source)',
      slit: 'Double slit — interference',
      barrier: 'Barrier — diffraction & shadow',
      room: 'Small room — standing waves',
      absorber: 'Room with absorber on back wall',
      qrd: 'QRD diffuser vs flat wall',
      corner: 'Corner — pressure build-up',
      lens: 'Doorway — sound leaking through an opening',
    };
    const bar = el('div', { class: 'row', style: { marginBottom: '8px' } });
    const sel = el('select'); Object.entries(presets).forEach(([k, v]) => sel.appendChild(el('option', { value: k }, v)));
    sel.value = opts.preset || 'free';
    const tools = A.seg([['source', 'Click: add source'], ['wall', 'Paint wall'], ['absorb', 'Paint absorber'], ['erase', 'Erase']], tool, (v) => (tool = v));
    const fr = el('input', { type: 'range', min: 0.02, max: 0.16, step: 0.005, value: freq, style: { width: '140px' } });
    fr.oninput = () => (freq = +fr.value);
    const pul = el('button', { class: 'small' }, 'Pulse (clap)');
    pul.onclick = () => { pulse = true; };
    const clr = el('button', { class: 'small' }, 'Reset');
    clr.onclick = () => load(sel.value);
    bar.append(sel, tools, el('span', { class: 'small' }, 'Frequency'), fr, pul, clr);
    host.appendChild(bar);
    sel.onchange = () => load(sel.value);
    const idx = (x, y) => y * W + x;
    function rect(x0, y0, x1, y1, v = 1, arr = wall) { for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(W - 1, x1); x++) arr[idx(x, y)] = v; }
    function load(k) {
      p.fill(0); pp.fill(0); np.fill(0); wall.fill(0); damp.fill(0); srcs = []; tick = 0;
      // absorbing sponge boundary
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const d = Math.min(x, y, W - 1 - x, H - 1 - y);
        if (d < 14) damp[idx(x, y)] = 0.12 * Math.pow(1 - d / 14, 2);
      }
      if (k === 'free') srcs.push([W / 2, H / 2]);
      if (k === 'slit') { rect(90, 0, 93, H); rect(90, 58, 93, 63, 0); rect(90, 77, 93, 82, 0); srcs.push([30, 70]); }
      if (k === 'barrier') { rect(110, 50, 113, H); srcs.push([50, 100]); }
      if (k === 'room' || k === 'absorber' || k === 'corner' || k === 'qrd' || k === 'lens') {
        rect(20, 15, W - 21, 18); rect(20, H - 19, W - 21, H - 16); rect(20, 15, 23, H - 16); rect(W - 24, 15, W - 21, H - 16);
        for (let y = 19; y < H - 19; y++) for (let x = 24; x < W - 24; x++) damp[idx(x, y)] = 0.0004;
      }
      if (k === 'room') srcs.push([60, 50]);
      if (k === 'absorber') { for (let y = 19; y < H - 19; y++) for (let x = W - 44; x < W - 24; x++) damp[idx(x, y)] = 0.035; srcs.push([60, 70]); }
      if (k === 'corner') srcs.push([30, 26]);
      if (k === 'qrd') {
        const seq = P.qrdSequence(7); const ww = 4;
        for (let i = 0; i < 14; i++) { const d = seq[i % 7] * 2.2; rect(W - 24 - Math.round(d) - 1, 30 + i * ww, W - 24, 30 + i * ww); for (let y = 30 + i * ww; y < 30 + (i + 1) * ww; y++) for (let x = W - 24 - Math.round(d); x < W - 24; x++) wall[idx(x, y)] = 0; }
        for (let i = 0; i <= 14; i++) rect(W - 24 - 16, 30 + i * ww, W - 24, 30 + i * ww);
        srcs.push([70, 70]);
      }
      if (k === 'lens') { rect(110, 15, 113, H - 16); rect(110, 64, 113, 76, 0); srcs.push([50, 50]); }
    }
    load(sel.value);
    const cv = A.canvas(host, {
      height: opts.height || 360, animate: true,
      caption: 'A real-time 2-D wave simulation (finite-difference time-domain). Orange = compression, blue = rarefaction. Try every preset, paint your own walls and absorbers, and change the frequency: low frequencies diffract around everything, high ones cast shadows.',
      onPointer(pt, api) {
        const gx = Math.floor((pt.x / api.w) * W), gy = Math.floor((pt.y / api.h) * H);
        if (gx < 0 || gy < 0 || gx >= W || gy >= H) return;
        if (pt.type === 'pointerdown' && tool === 'source') { srcs.push([gx, gy]); return; }
        if ((pt.type === 'pointerdown' || pt.buttons) && tool !== 'source') {
          for (let y = gy - 2; y <= gy + 2; y++) for (let x = gx - 2; x <= gx + 2; x++) {
            if (x < 0 || y < 0 || x >= W || y >= H) continue;
            const i = idx(x, y);
            if (tool === 'wall') wall[i] = 1; else if (tool === 'absorb') { wall[i] = 0; damp[i] = 0.04; } else { wall[i] = 0; damp[i] = Math.min(damp[i], 0.0004); }
          }
        }
      },
      draw(ctx, w, h) {
        if (!lut) lut = V.divergingLUT();
        const c2 = 0.45;
        for (let s = 0; s < 3; s++) {
          tick++;
          for (const [sx, sy] of srcs) {
            const i = idx(Math.round(sx), Math.round(sy));
            if (pulse) { for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) p[i + y * W + x] += 1.2 * Math.exp(-(x * x + y * y) / 2); }
            else p[i] += 0.6 * Math.sin(tick * freq * TAU * 0.5);
          }
          pulse = false;
          for (let y = 1; y < H - 1; y++) {
            for (let x = 1; x < W - 1; x++) {
              const i = y * W + x;
              if (wall[i]) { np[i] = 0; continue; }
              const c = p[i];
              const l = wall[i - 1] ? c : p[i - 1], r = wall[i + 1] ? c : p[i + 1], u = wall[i - W] ? c : p[i - W], d = wall[i + W] ? c : p[i + W];
              const v = 2 * c - pp[i] + c2 * (l + r + u + d - 4 * c);
              np[i] = v * (1 - damp[i]);
            }
          }
          const t = pp; pp = p; p = np; np = t;
        }
        if (!img) img = ctx.createImageData(W, H);
        const dimW = hexToRgb(A.css('text'));
        const absC = hexToRgb(A.css('c4'));
        for (let i = 0; i < N; i++) {
          const o = i * 4;
          if (wall[i]) { img.data[o] = dimW[0]; img.data[o + 1] = dimW[1]; img.data[o + 2] = dimW[2]; img.data[o + 3] = 255; continue; }
          const v = Math.max(-1, Math.min(1, p[i] * 2.2));
          const k = Math.round((v * 0.5 + 0.5) * 255) * 3;
          let r = lut[k], g = lut[k + 1], b = lut[k + 2];
          if (damp[i] > 0.02 && damp[i] < 0.1) { r = r * 0.6 + absC[0] * 0.4; g = g * 0.6 + absC[1] * 0.4; b = b * 0.6 + absC[2] * 0.4; }
          img.data[o] = r; img.data[o + 1] = g; img.data[o + 2] = b; img.data[o + 3] = 255;
        }
        const off = V._tank || (V._tank = document.createElement('canvas'));
        off.width = W; off.height = H; off.getContext('2d').putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, w, h);
        srcs.forEach(([sx, sy]) => { ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.arc((sx / W) * w, (sy / H) * h, 5, 0, TAU); ctx.stroke(); });
      },
    });
    window.addEventListener('themechange', () => (lut = null));
    return cv;
  };

  /* ----------------------------------------------------------------------
     20. Generic small α(f) bar chart for a 6-band material
     ---------------------------------------------------------------------- */
  V.alphaBars = function (host, series, opts = {}) {
    return A.canvas(host, {
      height: opts.height || 220,
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: 6, ticks: [], label: 'Octave band (Hz)' }, y: { min: 0, max: opts.max || 1.2, label: 'α', ticks: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2].filter((v) => v <= (opts.max || 1.2)) } });
        const n = series.length, bw = ((ax.x1 - ax.x0) / 6) * 0.8;
        P.BANDS6.forEach((f, i) => {
          A.text(ctx, A.shortHz(f), ax.X(i + 0.5), ax.y0 + 16, { align: 'center', size: 11, color: A.css('muted') });
          series.forEach((s, k) => {
            const x = ax.X(i + 0.1) + (bw / n) * k;
            ctx.fillStyle = A.series(k);
            ctx.fillRect(x, ax.Y(Math.min(s.a[i], opts.max || 1.2)), bw / n - 2, ax.y0 - ax.Y(Math.min(s.a[i], opts.max || 1.2)));
          });
        });
      },
    });
  };
})();
