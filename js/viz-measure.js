/* ==========================================================================
   Measurement-language & "flat response" widgets.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const logF = (a, b, n) => Array.from({ length: n }, (_, i) => a * Math.pow(b / a, i / (n - 1)));
  /** fractional-octave power smoothing of [[f, dB]] at 1/n octave */
  V.smooth = function (pts, n) {
    if (!n) return pts;
    const k = Math.pow(2, 1 / (2 * n));
    return pts.map(([f]) => { let e = 0, c = 0; for (const [g, d] of pts) if (g >= f / k && g <= f * k) { e += Math.pow(10, d / 10); c++; } return [f, 10 * Math.log10(e / Math.max(1, c))]; });
  };
  const BANDS = (n, a = 16, b = 22000) => { const out = []; for (let i = -60; i <= 60; i++) { const fc = 1000 * Math.pow(2, i / n); if (fc < a || fc > b) continue; out.push({ fc, lo: fc / Math.pow(2, 1 / (2 * n)), hi: fc * Math.pow(2, 1 / (2 * n)) }); } return out; };
  const NOMINAL = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];
  const nominal = (f) => NOMINAL.reduce((b, x) => (Math.abs(Math.log(x / f)) < Math.abs(Math.log(b / f)) ? x : b), NOMINAL[0]);

  /* ----------------------------------------------------------------------
     Octave band explorer
     ---------------------------------------------------------------------- */
  V.octaveBands = function (host) {
    const st = A.controls(host, [
      { key: 'n', label: 'Band resolution', type: 'select', value: 1, numeric: true, options: [[1, '1/1 octave'], [3, '1/3 octave'], [6, '1/6 octave'], [12, '1/12 octave']] },
      { key: 'axis', label: 'Frequency axis', type: 'select', value: 'log', options: [['log', 'Logarithmic (how we hear)'], ['lin', 'Linear (how Hz count)']] },
      { key: 'groups', label: 'Show octave grouping (low / mid / high)', type: 'check', value: true },
    ], () => { sel = -1; cv.redraw(); info.innerHTML = ''; });
    let sel = -1;
    const info = el('div', { class: 'stats' });
    const cv = A.canvas(host, {
      height: 230,
      caption: 'Each block is one band. On a logarithmic axis every octave is the same width — because every octave is a doubling, and the ear hears doublings as equal steps. On a linear axis the top octave (10–20 kHz) is 10 000 Hz wide while the bottom (20–40 Hz) is 20 Hz wide. Click a band to see its numbers and hear it.',
      onPointer(p, api) {
        if (p.type !== 'pointerdown' || !api.geom) return;
        const bands = BANDS(st.n, 20, 20000), g = api.geom;
        const i = bands.findIndex((b) => p.x >= g.X(b.lo) && p.x < g.X(b.hi));
        if (i < 0) return;
        sel = i; const b = bands[i];
        info.innerHTML = A.statBox('Centre', fmtHz(b.fc), 'nominal ' + fmtHz(nominal(b.fc))) + A.statBox('Lower edge', fmtHz(b.lo)) + A.statBox('Upper edge', fmtHz(b.hi)) + A.statBox('Bandwidth', fmtHz(b.hi - b.lo), fmt(((b.hi - b.lo) / b.fc) * 100, 1) + ' % of centre (constant)');
        const ctx = A.audio.get(); if (!ctx) return;
        A.audio.stopAll();
        const s = ctx.createBufferSource(); s.buffer = A.audio.noiseBuffer('pink', 2.5);
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = b.fc; bp.Q.value = b.fc / (b.hi - b.lo);
        const g2 = ctx.createGain(); g2.gain.value = 1.2;
        s.connect(bp).connect(g2).connect(ctx.destination); s.start(); s.stop(ctx.currentTime + 2.2); A.audio.track(s);
      },
      draw(ctx, w, h, t, dt, api) {
        const lin = st.axis === 'lin';
        const ax = A.axes(ctx, w, h, { x: lin ? { min: 0, max: 20000, label: 'Frequency (Hz)', ticks: [0, 2000, 5000, 10000, 15000, 20000], fmt: A.shortHz } : { min: 20, max: 20000, log: true, label: 'Frequency (Hz)', ticks: [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000], fmt: A.shortHz }, y: { min: 0, max: 1, ticks: [] } });
        api.geom = ax;
        const bands = BANDS(st.n, 20, 20000);
        if (st.groups && !lin) [[44, 355, 'LOW · 63–250 Hz', 'c4'], [355, 1414, 'MID · 500–1k (RT_mid)', 'accent2'], [1414, 11300, 'HIGH · 2k–8k', 'c3']].forEach(([a, b, l, c]) => { ctx.fillStyle = A.alpha(A.css(c), 0.12); ctx.fillRect(ax.X(a), ax.y1, ax.X(b) - ax.X(a), ax.y0 - ax.y1); A.text(ctx, l, (ax.X(a) + ax.X(b)) / 2, ax.y1 + 14, { align: 'center', size: 11, weight: 700, color: A.css(c) }); });
        bands.forEach((b, i) => {
          const x0 = ax.X(Math.max(lin ? 0 : 20, b.lo)), x1 = ax.X(Math.min(20000, b.hi));
          ctx.fillStyle = i === sel ? A.css('accent') : A.alpha(i % 2 ? A.css('accent2') : A.css('accent'), 0.35);
          const top = ax.y1 + 26 + (i % 2) * 8;
          ctx.fillRect(x0, top, Math.max(1, x1 - x0 - 1), ax.y0 - top - 30);
          if (st.n === 1 && x1 - x0 > 26) A.text(ctx, A.shortHz(nominal(b.fc)), (x0 + x1) / 2, ax.y0 - 14, { align: 'center', size: 10, weight: 700 });
        });
        A.text(ctx, `${bands.length} bands from 20 Hz to 20 kHz`, ax.x1 - 6, ax.y1 - 2 + (st.groups && !lin ? 0 : 14), { align: 'right', size: 10, color: A.css('muted') });
      },
    });
    host.appendChild(info);
  };

  /* ----------------------------------------------------------------------
     Decay lab: impulse response → Schroeder curve → EDT / T20 / T30
     ---------------------------------------------------------------------- */
  V.decayLab = function (host) {
    const st = A.controls(host, [
      { key: 'rt', label: 'True reverberation time', type: 'range', min: 0.15, max: 3, step: 0.05, value: 0.8, unit: 's' },
      { key: 'nf', label: 'Background noise floor', type: 'range', min: -80, max: -25, step: 1, value: -60, unit: 'dB' },
      { key: 'early', label: 'Strong early reflections (EDT ≠ RT)', type: 'check', value: false },
      { key: 'double', label: 'Coupled space (double-slope decay)', type: 'check', value: false },
    ], () => { calc(); cv.redraw(); });
    const play = el('button', { class: 'primary small', html: A.icon('play') + ' Hear this decay' });
    host.appendChild(play);
    const out = el('div', { class: 'stats' });
    let D = null;
    function rng(seed) { let x = seed; return () => { x = (x * 16807) % 2147483647; return x / 2147483647 - 0.5; }; }
    function calc() {
      const fs = 4000, len = Math.min(5, st.rt * 1.6 + 0.4), n = Math.floor(fs * len), r = rng(7);
      const x = new Float32Array(n), nf = Math.pow(10, st.nf / 20);
      for (let i = 0; i < n; i++) {
        const t = i / fs;
        let env = Math.exp((-6.91 * t) / st.rt);
        if (st.double) env = 0.85 * Math.exp((-6.91 * t) / (st.rt * 0.55)) + 0.15 * Math.exp((-6.91 * t) / (st.rt * 2.2));
        if (st.early && t < 0.06) env *= 2.2;
        x[i] = r() * 2 * env + r() * 2 * nf;
      }
      x[0] = 1.5;
      // energy envelope (10 ms)
      const win = 40, env = [];
      for (let i = 0; i + win < n; i += 20) { let e = 0; for (let k = 0; k < win; k++) e += x[i + k] * x[i + k]; env.push([i / fs, 10 * Math.log10(e / win + 1e-12)]); }
      const e0 = env[1][1]; env.forEach((p) => (p[1] -= e0));
      // Schroeder integration with truncation where the envelope meets the noise floor
      let cut = n; const nfE = 10 * Math.log10(nf * nf * 4 / 3 + 1e-12) - e0 + 3;
      for (let i = 0; i < env.length; i++) if (env[i][1] < nfE) { cut = Math.floor(env[i][0] * fs); break; }
      const sc = P.schroederCurve(x.subarray(0, Math.max(cut, 200)));
      const sch = []; for (let i = 0; i < sc.length; i += 20) { if (sc[i] < -(-nfE) + 6 && i > fs * 0.05) break; sch.push([i / fs, sc[i]]); }
      const fit = (hi, lo) => { const T = P.decayFit(sc, fs, hi, lo); return T; };
      const edt = (() => { const i1 = sc.findIndex((v) => v <= -10); return i1 > 0 ? (6 * i1) / fs : null; })();
      const range = -nfE;
      D = { env, sch, edt, t20: fit(-5, -25), t30: range > 45 ? fit(-5, -35) : null, range, len };
      out.innerHTML = A.statBox('EDT (0 → −10 dB) × 6', D.edt ? fmt(D.edt, 2) + ' s' : '—', 'how reverberant it sounds') + A.statBox('T20 (−5 → −25) × 3', D.t20 ? fmt(D.t20, 2) + ' s' : '—', 'needs ≥ 35 dB range') + A.statBox('T30 (−5 → −35) × 2', D.t30 ? fmt(D.t30, 2) + ' s' : 'not valid', D.t30 ? 'needs ≥ 45 dB range' : `only ${fmt(range, 0)} dB of range above noise`, D.t30 ? '' : 'warn') + A.statBox('Dynamic range', fmt(range, 0) + ' dB', 'decay above the noise floor');
    }
    play.onclick = () => {
      const ctx = A.audio.get(); if (!ctx) return;
      const n = Math.floor(ctx.sampleRate * D.len), buf = ctx.createBuffer(2, n, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < n; i++) { const t = i / ctx.sampleRate; let env = st.double ? 0.85 * Math.exp((-6.91 * t) / (st.rt * 0.55)) + 0.15 * Math.exp((-6.91 * t) / (st.rt * 2.2)) : Math.exp((-6.91 * t) / st.rt); if (st.early && t < 0.06) env *= 2.2; d[i] = (Math.random() * 2 - 1) * env * 0.5 + (Math.random() * 2 - 1) * Math.pow(10, st.nf / 20) * 0.5; } }
      const s = ctx.createBufferSource(); s.buffer = buf; s.connect(ctx.destination); s.start(); A.audio.track(s);
    };
    const cv = A.canvas(host, {
      height: 330,
      caption: 'Grey: the energy of a measured impulse response (direct sound at 0, decay, then the noise floor). Orange: the Schroeder backward integral — a smooth decay curve. The dashed fit lines extrapolate the slope to −60 dB: EDT uses the first 10 dB, T20 the range −5 → −25 dB, T30 −5 → −35 dB. RT60 is reported as T20 or T30 because real rooms rarely give 60 dB of clean decay.',
      draw(ctx, w, h) {
        if (!D) calc();
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: D.len, label: 'Time (s)' }, y: { min: -80, max: 5, label: 'Level (dB)' } });
        A.plotLine(ctx, ax, D.env, A.alpha(A.css('muted'), 0.7), 1);
        A.plotLine(ctx, ax, D.sch, A.css('accent'), 2.6);
        [[D.edt, 0, 'EDT', A.css('c3')], [D.t20, -5, 'T20', A.css('accent2')], [D.t30, -5, 'T30', A.css('good')]].forEach(([T, y0, l, c], k) => {
          if (!T) return;
          const t0 = y0 === 0 ? 0 : (D.sch.find((p) => p[1] <= y0) || [0])[0];
          A.plotLine(ctx, ax, [[t0, y0], [t0 + T * ((60 + y0) / 60), -60]], c, 1.6, [6, 4]);
          A.text(ctx, `${l} = ${fmt(T, 2)} s`, ax.x1 - 10, ax.y1 + 18 + k * 16, { align: 'right', size: 12, weight: 700, color: c, bg: A.alpha(A.css('panel'), 0.85) });
        });
        ctx.strokeStyle = A.css('bad'); ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(ax.x0, ax.Y(-60)); ctx.lineTo(ax.x1, ax.Y(-60)); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, '−60 dB', ax.x0 + 4, ax.Y(-60) - 4, { size: 10, color: A.css('bad') });
      },
    });
    host.appendChild(out);
    calc();
  };

  /* ----------------------------------------------------------------------
     Smoothing: the same measurement at different resolutions
     ---------------------------------------------------------------------- */
  function roomRaw() {
    const fs = logF(20, 20000, 700);
    const modal = P.modalResponse(5, 4, 2.7, [[0.6, 1.2, 1.1], [0.6, 2.8, 1.1]], [2.0, 2, 1.2], 0.45, 20, 400, 300);
    const mAt = (f) => { if (f > 400) return 0; const i = modal.findIndex((p) => p.f >= f); return i < 0 ? 0 : modal[i].db; };
    let seed = 3; const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
    return fs.map((f) => { const w = Math.max(0, Math.min(1, (400 - f) / 250)); const rip = f > 300 ? r() * 4 * Math.min(1, f / 2000) : 0; return [f, w * mAt(f) + P.combResponse(f, 1.1, 0.55) * (f > 200 ? 1 : 0.3) + rip - (f > 1000 ? 1.2 * Math.log2(f / 1000) : 0)]; });
  }
  V.smoothing = function (host) {
    const raw = roomRaw();
    const st = A.controls(host, [{ key: 'n', label: 'Smoothing', type: 'select', value: 3, numeric: true, options: [[0, 'None (raw)'], [48, '1/48 octave'], [24, '1/24 octave'], [12, '1/12 octave'], [6, '1/6 octave'], [3, '1/3 octave'], [1, '1/1 octave']] }], () => cv.redraw());
    const out = el('div', { class: 'stats' });
    const cv = A.canvas(host, {
      height: 300,
      caption: 'One measurement, many “answers”. Heavy smoothing hides modes and comb filtering; no smoothing shows every reflection notch, most of which you don’t hear as tonal changes. Use ~1/24–1/48 octave below 300 Hz to see modes, 1/6–1/3 octave above it to judge tonal balance. Always say what smoothing you used when quoting “±x dB”.',
      draw(ctx, w, h) {
        const sm = V.smooth(raw, st.n);
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: -30, max: 18, label: 'dB' } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(3), ax.x1 - ax.x0, ax.Y(-3) - ax.Y(3));
        A.plotLine(ctx, ax, raw, A.alpha(A.css('muted'), 0.45), 1);
        A.plotLine(ctx, ax, sm, A.css('accent'), 2.4);
        const band = sm.filter(([f]) => f >= 100 && f <= 10000).map((p) => p[1]);
        out.innerHTML = A.statBox('Spread 100 Hz–10 kHz', '±' + fmt((Math.max(...band) - Math.min(...band)) / 2, 1) + ' dB', st.n ? '1/' + st.n + ' octave smoothing' : 'raw') + A.statBox('Same room, 1/1 octave', '±' + fmt((() => { const b = V.smooth(raw, 1).filter(([f]) => f >= 100 && f <= 10000).map((p) => p[1]); return (Math.max(...b) - Math.min(...b)) / 2; })(), 1) + ' dB');
      },
    });
    host.appendChild(out);
  };

  /* ----------------------------------------------------------------------
     Flat-response builder: what turns a flat speaker into a lumpy room
     ---------------------------------------------------------------------- */
  V.flatness = function (host) {
    const st = A.controls(host, [
      { type: 'heading', label: 'What contributes' },
      { key: 'spk', label: 'Speaker: flat on-axis, smooth directivity', type: 'check', value: true },
      { key: 'tilt', label: 'Room’s reverberant field (directivity → downward tilt)', type: 'check', value: true },
      { key: 'sbir', label: 'Front-wall boundary interference (SBIR)', type: 'check', value: true },
      { key: 'modes', label: 'Room modes below the Schroeder frequency', type: 'check', value: true },
      { key: 'refl', label: 'Early side-wall & desk reflections', type: 'check', value: true },
      { type: 'heading', label: 'What you do about it' },
      { key: 'treat', label: 'Treatment: bass traps + reflection-point absorbers', type: 'check', value: false },
      { key: 'place', label: 'Optimised speaker & seat position', type: 'check', value: false },
      { key: 'eq', label: 'Gentle EQ (cut peaks below 300 Hz only)', type: 'check', value: false },
      { type: 'heading', label: 'How you look at it' },
      { key: 'sm', label: 'Smoothing', type: 'select', value: 6, numeric: true, options: [[24, '1/24 octave'], [12, '1/12 octave'], [6, '1/6 octave'], [3, '1/3 octave']] },
      { key: 'target', label: 'Target', type: 'select', value: 'tilt', options: [['flat', 'Ruler-flat'], ['tilt', 'Gentle downward tilt (typical good room)']] },
    ], () => cv.redraw());
    const out = el('div', { class: 'stats' });
    const fs = logF(20, 20000, 600);
    const tgt = (f) => (st.target === 'flat' ? 0 : f < 100 ? 1.5 : -Math.log2(f / 100) * 0.8 + 1.5);
    function build() {
      const T = st.treat ? 0.22 : 0.55, seat = st.place ? [2.05, 2, 1.2] : [2.5, 2, 1.2], sd = st.place ? 0.25 : 0.9;
      const modal = P.modalResponse(5, 4, 2.7, [[sd, 1.2, 1.1], [sd, 2.8, 1.1]], seat, T, 20, 400, 260);
      const mAt = (f) => { if (f > 400) return 0; const i = modal.findIndex((p) => p.f >= f); return i < 0 ? 0 : modal[i].db; };
      const pts = fs.map((f) => {
        let d = 0;
        if (st.spk) d += AP.db(AP.analogFilter('hp', 'BW4', 42, f)) + 0.6 * Math.sin(Math.log(f) * 7);
        if (st.tilt) d += f > 300 ? -0.9 * Math.log2(f / 300) * (st.treat ? 0.85 : 1) : 0;
        if (st.sbir && f < 600) d += P.combResponse(f, 2 * sd, st.treat ? 0.35 : 0.8) * Math.max(0, Math.min(1, (600 - f) / 300));
        if (st.modes) { const w = Math.max(0, Math.min(1, (380 - f) / 220)); d += w * mAt(f); }
        if (st.refl && f > 250) d += P.combResponse(f, 0.9, st.treat ? 0.15 : 0.6) * 0.8;
        return [f, d];
      });
      let sm = V.smooth(pts, st.sm);
      if (st.eq) { const coarse = V.smooth(pts, 3); sm = sm.map(([f, d], i) => [f, f < 300 ? d - Math.max(0, coarse[i][1] - tgt(f) - 1) : d]); }
      return sm;
    }
    const cv = A.canvas(host, {
      height: 340,
      caption: 'Start with a speaker that is flat in an anechoic chamber (top tick box only), then add what a real room does. Green band: ±3 dB around the target from 200 Hz to 4 kHz, the kind of window broadcast listening-room standards use. Then switch on treatment, placement and EQ, in that order.',
      draw(ctx, w, h) {
        const r = build();
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: -25, max: 15, label: 'Level at the listening seat (dB)' } });
        A.plotFill(ctx, ax, fs.filter((f) => f >= 200 && f <= 4000).map((f) => [f, tgt(f) + 3]), A.alpha(A.css('good'), 0.15), -25);
        A.plotFill(ctx, ax, fs.filter((f) => f >= 200 && f <= 4000).map((f) => [f, tgt(f) - 3]), A.css('bg2'), -25);
        A.plotLine(ctx, ax, fs.map((f) => [f, tgt(f)]), A.css('good'), 1.5, [5, 4]);
        A.plotLine(ctx, ax, r, A.css('accent'), 2.6);
        const inWin = r.filter(([f]) => f >= 200 && f <= 4000), within = inWin.filter(([f, d]) => Math.abs(d - tgt(f)) <= 3).length / inWin.length;
        const low = r.filter(([f]) => f >= 30 && f <= 200).map(([f, d]) => d - tgt(f)), lowSpread = (Math.max(...low) - Math.min(...low)) / 2;
        out.innerHTML = A.statBox('200 Hz–4 kHz inside ±3 dB', fmt(within * 100, 0) + ' %', '', within > 0.95 ? 'good' : within > 0.75 ? 'warn' : 'bad') + A.statBox('30–200 Hz spread', '±' + fmt(lowSpread, 1) + ' dB', lowSpread < 5 ? 'very good for a small room' : 'modes & SBIR dominate', lowSpread < 5 ? 'good' : lowSpread < 9 ? 'warn' : 'bad');
      },
    });
    host.appendChild(out);
  };

  /* ----------------------------------------------------------------------
     Room goals compared: control room vs recording rooms vs halls
     ---------------------------------------------------------------------- */
  V.roomGoals = function (host) {
    const ROOMS = [
      ['Control / mastering room', 'accent', [0.32, 0.28, 0.26, 0.25, 0.25, 0.24, 0.22], [5, 5, 4, 2, 5]],
      ['Vocal booth', 'c5', [0.25, 0.2, 0.17, 0.15, 0.15, 0.14, 0.13], [4, 4, 1, 2, 4]],
      ['Live tracking room', 'c4', [0.7, 0.65, 0.6, 0.6, 0.6, 0.55, 0.5], [2, 3, 5, 4, 3]],
      ['Concert hall (occupied)', 'c3', [2.4, 2.2, 2.0, 1.95, 1.9, 1.7, 1.4], [1, 2, 5, 5, 2]],
      ['Drama theatre', 'accent2', [1.2, 1.1, 1.0, 1.0, 1.0, 0.95, 0.85], [2, 4, 3, 3, 4]],
    ];
    const crit = ['Flat response at one seat', 'Low early reflections', 'Diffuse late sound / envelopment', 'Warmth (bass ratio > 1)', 'Speech / detail clarity'];
    A.canvas(host, {
      height: 300,
      caption: 'Target reverberation per octave band for different rooms. A control room wants a short, nearly flat decay so the room disappears; a concert hall wants a long, warm decay that rises at low frequency (bass ratio 1.1–1.25) and falls gently at high frequency (air absorption, audience).',
      draw(ctx, w, h) {
        const bands = [63, 125, 250, 500, 1000, 2000, 4000];
        const ax = A.axes(ctx, w, h, { x: { min: 50, max: 5000, log: true, label: 'Octave band (Hz)', ticks: bands, fmt: A.shortHz }, y: { min: 0.05, max: 3, log: true, label: 'RT60 (s)', ticks: [0.1, 0.2, 0.5, 1, 2, 3] } });
        ROOMS.forEach(([n, c, rt]) => { A.plotLine(ctx, ax, bands.map((f, i) => [f, rt[i]]), A.css(c), 2.6); A.text(ctx, n, ax.X(4000) + 4 - 120, ax.Y(rt[6]) - 6, { size: 10.5, weight: 700, color: A.css(c) }); });
      },
    });
    const t = el('div', { class: 'table-wrap', style: { marginTop: '10px' } });
    t.innerHTML = `<table><tr><th>Priority (●●●●● = essential)</th>${ROOMS.map(([n, c]) => `<th style="color:var(--${c})">${n}</th>`).join('')}</tr>${crit.map((cr, i) => `<tr><td>${cr}</td>${ROOMS.map(([, c, , p]) => `<td style="color:var(--${c});letter-spacing:2px">${'●'.repeat(p[i])}<span style="opacity:.25">${'●'.repeat(5 - p[i])}</span></td>`).join('')}</tr>`).join('')}</table>`;
    host.appendChild(t);
  };
})();
