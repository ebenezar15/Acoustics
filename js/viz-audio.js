/* ==========================================================================
   Acoustica audio & sound-system widgets.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2;
  const freqs = (a = 20, b = 20000, n = 300) => Array.from({ length: n }, (_, i) => a * Math.pow(b / a, i / (n - 1)));
  const fAxis = (label = 'Frequency (Hz)') => ({ min: 20, max: 20000, log: true, label, ticks: [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000] });

  function playThrough(build, src = 'pink') {
    A.audio.stopAll();
    const ctx = A.audio.get(); if (!ctx) return null;
    const out = ctx.createGain(); out.gain.value = 0.5;
    const head = build(ctx, out);
    out.connect(ctx.destination);
    let band = null;
    if (src === 'band' && A.startBand) band = A.startBand(ctx, head);
    else { const s = ctx.createBufferSource(); s.buffer = A.audio.noiseBuffer('pink', 6); s.loop = true; s.connect(head); s.start(); A.audio.track(s); }
    const stop = { stop() { if (band) band.stop(); } };
    A.audio.track(stop);
    return { ctx, out, band };
  }

  /* ----------------------------------------------------------------------
     Parametric EQ — magnitude & phase, audible on pink noise or band loop
     ---------------------------------------------------------------------- */
  V.eq = function (host) {
    const bands = [
      { type: 'highpass', f: 60, g: 0, q: 0.707, on: true },
      { type: 'peak', f: 250, g: -4, q: 1.4, on: true },
      { type: 'peak', f: 3000, g: 3, q: 1, on: true },
      { type: 'highshelf', f: 8000, g: 2, q: 0.707, on: true },
    ];
    const types = [['peak', 'Bell (peaking)'], ['lowshelf', 'Low shelf'], ['highshelf', 'High shelf'], ['highpass', 'High-pass'], ['lowpass', 'Low-pass'], ['notch', 'Notch']];
    const grid = el('div', { class: 'grid g2' });
    host.appendChild(grid);
    let nodes = null;
    bands.forEach((b, i) => {
      const c = el('div', { class: 'card', style: { background: 'var(--panel2)', padding: '10px 12px' } });
      c.appendChild(html(`<h4 style="margin:0 0 4px;color:${A.series(i)}">Band ${i + 1}</h4>`));
      const st = A.controls(c, [
        { key: 'type', label: 'Type', type: 'select', value: b.type, options: types },
        { key: 'f', label: 'Frequency', type: 'range', min: Math.log10(20), max: Math.log10(20000), step: 0.005, value: Math.log10(b.f), fmt: (v) => fmtHz(Math.pow(10, v)) },
        { key: 'g', label: 'Gain', type: 'range', min: -18, max: 18, step: 0.5, value: b.g, unit: 'dB' },
        { key: 'q', label: 'Q (bandwidth)', type: 'range', min: 0.3, max: 12, step: 0.05, value: b.q },
      ], (v) => { b.type = v.type; b.f = Math.pow(10, v.f); b.g = v.g; b.q = v.q; sync(); cv.redraw(); });
      grid.appendChild(c);
    });
    const row = el('div', { class: 'row', style: { marginTop: '10px' } });
    const p1 = el('button', { class: 'primary', html: A.icon('play') + ' Hear on pink noise' });
    const p2 = el('button', { html: A.icon('play') + ' Hear on band loop' });
    const by = el('button', {}, 'Bypass: off');
    const stop = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(p1, p2, by, stop); host.appendChild(row);
    let bypass = false;
    const start = (src) => {
      const r = playThrough((ctx, out) => {
        nodes = bands.map(() => ctx.createBiquadFilter());
        const inp = ctx.createGain();
        let n = inp; nodes.forEach((x) => { n.connect(x); n = x; }); n.connect(out);
        sync(); return inp;
      }, src);
      void r;
    };
    function sync() {
      if (!nodes) return;
      nodes.forEach((n, i) => { const b = bands[i]; n.type = b.type; n.frequency.value = b.f; n.Q.value = b.q; n.gain.value = bypass ? 0 : b.g; if (bypass && /pass|notch/.test(b.type)) n.type = 'allpass'; });
    }
    p1.onclick = () => start('pink'); p2.onclick = () => start('band');
    stop.onclick = () => { A.audio.stopAll(); nodes = null; };
    by.onclick = () => { bypass = !bypass; by.textContent = 'Bypass: ' + (bypass ? 'on' : 'off'); sync(); };
    const cv = A.canvas(host, {
      height: 320,
      caption: 'Each coloured curve is one band; the thick curve is the total. The dashed curve is phase: every minimum-phase EQ shifts phase around the frequencies it changes. High Q = narrow and surgical (feedback, resonances); low Q = broad and musical (tone shaping).',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: fAxis(), y: { min: -24, max: 24, label: 'Gain (dB)' } });
        const fs = freqs(20, 20000, 400);
        const cs = bands.map((b) => AP.biquad(b.type, b.f, b.g, b.q));
        cs.forEach((c, i) => A.plotLine(ctx, ax, fs.map((f) => [f, AP.db(AP.biquadH(c, f))]), A.alpha(A.series(i), 0.7), 1.3));
        const tot = fs.map((f) => AP.chainH(cs, f));
        A.plotLine(ctx, ax, fs.map((f, i) => [f, AP.phaseDeg(tot[i]) / 7.5]), A.css('muted'), 1.2, [4, 4]);
        A.plotFill(ctx, ax, fs.map((f, i) => [f, AP.db(tot[i])]), A.alpha(A.css('accent'), 0.12), 0);
        A.plotLine(ctx, ax, fs.map((f, i) => [f, AP.db(tot[i])]), A.css('accent'), 2.6);
        A.text(ctx, 'phase (dashed, ±180° scaled)', ax.x1 - 6, ax.y1 + 14, { align: 'right', size: 10, color: A.css('muted') });
      },
    });
  };

  /* ----------------------------------------------------------------------
     Crossover & sub/top alignment
     ---------------------------------------------------------------------- */
  V.crossover = function (host, opts = {}) {
    const st = A.controls(host, [
      { key: 'type', label: 'Filter alignment', type: 'select', value: opts.type || 'LR4', options: AP.ALIGNMENTS.map((t) => [t, t.replace('BW', 'Butterworth ').replace('LR', 'Linkwitz-Riley ') + ' (' + AP.filterOrder(t) * 6 + ' dB/oct)']) },
      { key: 'fc', label: 'Crossover frequency', type: 'range', min: Math.log10(40), max: Math.log10(5000), step: 0.005, value: Math.log10(opts.fc || 100), fmt: (v) => fmtHz(Math.pow(10, v)) },
      { key: 'delay', label: 'Delay on the high side', type: 'range', min: -10, max: 10, step: 0.05, value: 0, unit: 'ms' },
      { key: 'dist', label: 'Extra distance to low driver/sub', type: 'range', min: 0, max: 6, step: 0.05, value: opts.dist || 0, unit: 'm' },
      { key: 'pol', label: 'Invert polarity of low side', type: 'check', value: false },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const cv = A.canvas(host, {
      height: 330,
      caption: 'Low-pass (blue) + high-pass (purple) = what you hear (orange). Linkwitz-Riley 4th order sums flat when both arrive in time. Move the sub further away (or add delay) and watch the sum dip at crossover — this is exactly what you fix during system tuning with delay and polarity.',
      draw(ctx, w, h) {
        const fc = Math.pow(10, st.fc);
        const lo = Math.max(20, fc / 20), hi = Math.min(20000, fc * 20);
        const ax = A.axes(ctx, w, h, { x: { min: lo, max: hi, log: true, label: 'Frequency (Hz)' }, y: { min: -30, max: 9, label: 'Level (dB)' } });
        const fs = freqs(lo, hi, 300);
        const loH = fs.map((f) => { let x = AP.analogFilter('lp', st.type, fc, f); x = AP.cx.mul(x, AP.delayH(f, AP.msFromDistance(st.dist))); return st.pol ? { re: -x.re, im: -x.im } : x; });
        const hiH = fs.map((f) => AP.cx.mul(AP.analogFilter('hp', st.type, fc, f), AP.delayH(f, st.delay)));
        const sum = fs.map((f, i) => AP.cx.add(loH[i], hiH[i]));
        A.plotLine(ctx, ax, fs.map((f, i) => [f, AP.db(loH[i])]), A.css('accent2'), 1.6);
        A.plotLine(ctx, ax, fs.map((f, i) => [f, AP.db(hiH[i])]), A.css('c3'), 1.6);
        A.plotLine(ctx, ax, fs.map((f, i) => [f, AP.db(sum[i])]), A.css('accent'), 2.8);
        ctx.strokeStyle = A.css('muted'); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(fc), ax.y1); ctx.lineTo(ax.X(fc), ax.y0); ctx.stroke(); ctx.setLineDash([]);
      },
    });
    host.appendChild(A.legend([[A.css('accent2'), 'Low side (sub / woofer)'], [A.css('c3'), 'High side (top / tweeter)'], [A.css('accent'), 'Acoustic sum']]));
    function upd() {
      const fc = Math.pow(10, st.fc);
      const f = (x) => AP.cx.add((() => { let a = AP.cx.mul(AP.analogFilter('lp', st.type, fc, x), AP.delayH(x, AP.msFromDistance(st.dist))); return st.pol ? { re: -a.re, im: -a.im } : a; })(), AP.cx.mul(AP.analogFilter('hp', st.type, fc, x), AP.delayH(x, st.delay)));
      const atFc = AP.db(f(fc));
      const net = st.delay - AP.msFromDistance(st.dist);
      out.innerHTML = A.statBox('Sum at crossover', fmt(atFc, 1) + ' dB', atFc > -1.5 ? 'Aligned' : 'Cancellation — adjust delay/polarity', atFc > -1.5 ? 'good' : 'bad') +
        A.statBox('Arrival offset', fmt(net, 2) + ' ms', 'high side relative to low side') +
        A.statBox('Phase at fc from offset', fmt(((net / 1000) * fc * 360) % 360, 0) + '°') +
        A.statBox('Slope', AP.filterOrder(st.type) * 6 + ' dB/oct');
      cv.redraw();
    }
    upd();
  };

  /* ----------------------------------------------------------------------
     Compressor / limiter / gate
     ---------------------------------------------------------------------- */
  V.compressor = function (host) {
    const st = A.controls(host, [
      { key: 'th', label: 'Threshold', type: 'range', min: -60, max: 0, step: 1, value: -24, unit: 'dB' },
      { key: 'ratio', label: 'Ratio', type: 'range', min: 1, max: 20, step: 0.5, value: 4, fmt: (v) => v + ':1' },
      { key: 'knee', label: 'Knee', type: 'range', min: 0, max: 30, step: 1, value: 6, unit: 'dB' },
      { key: 'att', label: 'Attack', type: 'range', min: 0.001, max: 0.1, step: 0.001, value: 0.01, fmt: (v) => fmt(v * 1000, 0) + ' ms' },
      { key: 'rel', label: 'Release', type: 'range', min: 0.02, max: 1, step: 0.01, value: 0.2, fmt: (v) => fmt(v * 1000, 0) + ' ms' },
      { key: 'mk', label: 'Make-up gain', type: 'range', min: 0, max: 24, step: 0.5, value: 6, unit: 'dB' },
    ], () => { if (node) apply(); curve.redraw(); });
    const row = el('div', { class: 'row' });
    const play = el('button', { class: 'primary', html: A.icon('play') + ' Hear on band loop' });
    const by = el('button', {}, 'Bypass: off');
    const stop = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(play, by, stop); host.appendChild(row);
    let node = null, mk = null, bypass = false, an = null;
    function apply() { node.threshold.value = bypass ? 0 : st.th; node.ratio.value = bypass ? 1 : st.ratio; node.knee.value = st.knee; node.attack.value = st.att; node.release.value = st.rel; mk.gain.value = bypass ? 1 : Math.pow(10, st.mk / 20); }
    play.onclick = () => playThrough((ctx, out) => { node = ctx.createDynamicsCompressor(); mk = ctx.createGain(); an = ctx.createAnalyser(); node.connect(mk).connect(out); mk.connect(an); apply(); return node; }, 'band');
    by.onclick = () => { bypass = !bypass; by.textContent = 'Bypass: ' + (bypass ? 'on' : 'off'); if (node) apply(); };
    stop.onclick = () => { A.audio.stopAll(); node = null; };
    const gainOut = (x) => {
      const T = st.th, R = st.ratio, W = st.knee;
      if (2 * (x - T) < -W) return x;
      if (2 * Math.abs(x - T) <= W) return x + ((1 / R - 1) * Math.pow(x - T + W / 2, 2)) / (2 * W || 1);
      return T + (x - T) / R;
    };
    const curve = A.canvas(host, {
      height: 320, animate: true,
      caption: 'Left: static transfer curve — above the threshold, output rises only 1 dB per “ratio” dB of input. Right: a drum-like envelope (grey) and the compressed result (orange) with gain reduction (blue). Fast attack catches transients; slow attack lets them punch through.',
      draw(ctx, w, h, t) {
        const sw = Math.min(h, w * 0.42);
        const ax = A.axes(ctx, sw, h, { x: { min: -60, max: 0, label: 'Input (dB)' }, y: { min: -60, max: 12, label: 'Output (dB)' } });
        A.plotLine(ctx, ax, [[-60, -60], [0, 0]], A.css('muted'), 1, [4, 4]);
        const pts = []; for (let x = -60; x <= 0; x += 0.5) pts.push([x, gainOut(x) + st.mk]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.6);
        // envelope sim
        const ax2 = A.axes(ctx, w, h, { pad: { l: sw + 50 }, x: { min: 0, max: 2, label: 'Time (s)' }, y: { min: -60, max: 6, label: 'Level (dB)' } });
        const env = [], comp = [], gr = [];
        let g = 0; const dt = 0.002;
        for (let tt = 0; tt <= 2; tt += dt) {
          const ph = (tt + t * 0.5) % 0.5;
          const x = ph < 0.005 ? -6 : -6 - ph * 70 + (Math.floor((tt + t * 0.5) / 0.5) % 2 ? -8 : 0);
          const target = gainOut(x) - x;
          const coef = target < g ? 1 - Math.exp(-dt / st.att) : 1 - Math.exp(-dt / st.rel);
          g += (target - g) * coef;
          env.push([tt, x]); comp.push([tt, x + g + st.mk]); gr.push([tt, g]);
        }
        A.plotLine(ctx, ax2, env, A.css('muted'), 1.2);
        A.plotLine(ctx, ax2, gr, A.css('accent2'), 1.4);
        A.plotLine(ctx, ax2, comp, A.css('accent'), 2.2);
        if (an) { const d = new Float32Array(an.fftSize); an.getFloatTimeDomainData(d); let pk = 0; d.forEach((v) => (pk = Math.max(pk, Math.abs(v)))); A.text(ctx, 'live peak ' + fmt(20 * Math.log10(pk + 1e-9), 1) + ' dBFS', ax2.x0 + 6, ax2.y1 + 14, { size: 11, color: A.css('muted') }); }
      },
    });
  };

  /* ----------------------------------------------------------------------
     Subwoofer arrays: cardioid, end-fire, broadside — polar plot
     ---------------------------------------------------------------------- */
  V.subArray = function (host) {
    const presets = {
      single: { name: 'Single sub', src: () => [{ x: 0 }] },
      pair: { name: 'Two subs side by side (1 m)', src: () => [{ x: 0, y: -0.5 }, { x: 0, y: 0.5 }] },
      gradient: { name: 'Gradient cardioid (rear box inverted + delayed)', src: (d) => [{ x: 0 }, { x: -d, delayMs: AP.msFromDistance(d), pol: -1 }] },
      endfire: { name: 'End-fire (4 boxes in a row, delayed)', src: (d) => [0, 1, 2, 3].map((k) => ({ x: -k * d, delayMs: AP.msFromDistance((3 - k) * d) })) },
      broadside: { name: 'Broadside line of 6 (wide spacing)', src: (d) => [0, 1, 2, 3, 4, 5].map((k) => ({ x: 0, y: (k - 2.5) * d * 2 })) },
    };
    const st = A.controls(host, [
      { key: 'p', label: 'Configuration', type: 'select', value: 'gradient', options: Object.entries(presets).map(([k, v]) => [k, v.name]) },
      { key: 'd', label: 'Box spacing', type: 'range', min: 0.3, max: 2.5, step: 0.05, value: 1.0, unit: 'm' },
      { key: 'f', label: 'Frequency', type: 'range', min: 30, max: 120, step: 1, value: 63, unit: 'Hz' },
    ], () => cv.redraw());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const cv = A.canvas(host, {
      height: 360,
      caption: 'Polar response seen from above (stage at the bottom, audience upward). Subwoofers are nearly omnidirectional on their own — energy behind them muddies the stage. Arrays use spacing, delay and polarity so sound adds in front and cancels behind. Right: front vs rear level across the sub band.',
      draw(ctx, w, h) {
        const src = presets[st.p].src(st.d);
        const pw = Math.min(w * 0.48, h);
        const cx = pw / 2 + 10, cy = h / 2, R = Math.min(pw / 2, h / 2) - 20;
        const ref = AP.db(AP.arrayResponse(src, st.f, 0));
        const mx = Math.max(...Array.from({ length: 72 }, (_, i) => AP.db(AP.arrayResponse(src, st.f, (i / 72) * TAU))));
        ctx.strokeStyle = A.css('line');
        [-30, -20, -10, 0].forEach((db) => { ctx.beginPath(); ctx.arc(cx, cy, R * (1 + db / 36), 0, TAU); ctx.stroke(); });
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.5; ctx.beginPath();
        for (let i = 0; i <= 180; i++) { const th = (i / 180) * TAU; const d = Math.max(-36, AP.db(AP.arrayResponse(src, st.f, th)) - mx); const r = R * (1 + d / 36); const x = cx + Math.sin(th) * r, y = cy - Math.cos(th) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.closePath(); ctx.stroke(); ctx.lineWidth = 1;
        src.forEach((s) => { ctx.fillStyle = s.pol === -1 ? A.css('accent2') : A.css('text'); ctx.fillRect(cx + (s.y || 0) * 14 - 6, cy - s.x * 14 - 6, 12, 12); });
        A.text(ctx, 'audience ↑', cx, 14, { align: 'center', size: 11, color: A.css('muted') });
        A.text(ctx, 'stage ↓', cx, h - 4, { align: 'center', size: 11, color: A.css('muted') });
        const ax = A.axes(ctx, w, h, { pad: { l: pw + 60 }, x: { min: 25, max: 150, log: true, label: 'Frequency (Hz)', ticks: [30, 40, 60, 80, 100, 150] }, y: { min: -30, max: 18, label: 'dB re one box' } });
        const fs = freqs(25, 150, 120);
        A.plotLine(ctx, ax, fs.map((f) => [f, AP.db(AP.arrayResponse(src, f, 0))]), A.css('accent'), 2.4);
        A.plotLine(ctx, ax, fs.map((f) => [f, AP.db(AP.arrayResponse(src, f, Math.PI))]), A.css('accent2'), 2, [5, 4]);
        const rearDb = Math.max(-60, AP.db(AP.arrayResponse(src, st.f, Math.PI))); const lim = (v) => (v <= -60 ? '< −60' : fmt(v, 1));
        out.innerHTML = A.statBox('Front level', fmt(ref, 1) + ' dB', 're one box') + A.statBox('Rear level', lim(rearDb) + ' dB') + A.statBox('Front-to-back', (rearDb <= -60 ? '> ' : '') + fmt(ref - rearDb, 1) + ' dB') + A.statBox('Delay step', fmt(AP.msFromDistance(st.d), 2) + ' ms', 'per box spacing');
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'Front (audience)'], [A.css('accent2'), 'Rear (stage)', true], [A.css('accent2'), 'Inverted-polarity box (square)']]));
  };

  /* ----------------------------------------------------------------------
     Gain structure through a signal chain
     ---------------------------------------------------------------------- */
  V.gainStructure = function (host) {
    const stages = [
      { name: 'Mic out', noise: -129, clip: 10, gain: 0 },
      { name: 'Preamp', noise: -128, clip: 24, gain: 50 },
      { name: 'Console bus', noise: -95, clip: 24, gain: 0 },
      { name: 'DSP / processor', noise: -100, clip: 20, gain: 0 },
      { name: 'Amplifier in', noise: -100, clip: 12, gain: -6 },
    ];
    const st = A.controls(host, [
      { key: 'src', label: 'Source level at mic (voice ≈ −50 dBu)', type: 'range', min: -70, max: -10, step: 1, value: -50, unit: 'dBu' },
      { key: 'pre', label: 'Preamp gain', type: 'range', min: 0, max: 70, step: 1, value: 46, unit: 'dB' },
      { key: 'fad', label: 'Fader / bus gain', type: 'range', min: -30, max: 10, step: 1, value: 0, unit: 'dB' },
      { key: 'dsp', label: 'DSP input gain', type: 'range', min: -20, max: 20, step: 1, value: 0, unit: 'dB' },
      { key: 'amp', label: 'Amp input attenuator', type: 'range', min: -30, max: 0, step: 1, value: -6, unit: 'dB' },
      { key: 'crest', label: 'Programme peak above average', type: 'range', min: 6, max: 24, step: 1, value: 14, unit: 'dB' },
    ], () => cv.redraw());
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Average level (orange) and peaks (light orange) through each stage, against that stage’s noise floor (bottom of the blue bar) and clip point (top). Good gain structure sets the preamp so peaks sit comfortably below clip, then keeps every later stage in its sweet spot — never “gain down then up”.',
      draw(ctx, w, h) {
        const g = [0, st.pre, st.fad, st.dsp, st.amp];
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: stages.length, ticks: [] }, y: { min: -140, max: 40, label: 'Level (dBu)' } });
        let lvl = st.src; let worst = 99, minSnr = 999;
        stages.forEach((s, i) => {
          lvl += g[i];
          const x0 = ax.X(i + 0.2), x1 = ax.X(i + 0.8);
          ctx.fillStyle = A.alpha(A.css('accent2'), 0.18); ctx.fillRect(x0, ax.Y(s.clip), x1 - x0, ax.Y(s.noise) - ax.Y(s.clip));
          ctx.fillStyle = A.alpha(A.css('accent'), 0.35); ctx.fillRect(x0 + 8, ax.Y(lvl + st.crest), x1 - x0 - 16, ax.Y(lvl) - ax.Y(lvl + st.crest));
          ctx.fillStyle = A.css('accent'); ctx.fillRect(x0 + 8, ax.Y(lvl) - 2, x1 - x0 - 16, 4);
          const head = s.clip - (lvl + st.crest), snr = lvl - s.noise;
          worst = Math.min(worst, head); minSnr = Math.min(minSnr, snr);
          A.text(ctx, s.name, (x0 + x1) / 2, ax.y0 + 14, { align: 'center', size: 11, color: A.css('muted') });
          A.text(ctx, head < 0 ? 'CLIPS' : `+${fmt(head, 0)} dB`, (x0 + x1) / 2, ax.Y(s.clip) - 6, { align: 'center', size: 11, weight: 700, color: head < 0 ? A.css('bad') : head < 6 ? A.css('warn') : A.css('good') });
        });
        A.text(ctx, `Worst headroom ${fmt(worst, 0)} dB · worst SNR ${fmt(minSnr, 0)} dB`, ax.x0 + 8, ax.y1 + 16, { weight: 700 });
      },
    });
  };

  /* ----------------------------------------------------------------------
     Point source vs line array: SPL vs distance
     ---------------------------------------------------------------------- */
  V.lineVsPoint = function (host) {
    const st = A.controls(host, [
      { key: 'H', label: 'Line array height', type: 'range', min: 1, max: 12, step: 0.25, value: 4, unit: 'm' },
      { key: 'f', label: 'Frequency', type: 'range', min: Math.log10(100), max: Math.log10(16000), step: 0.01, value: Math.log10(1000), fmt: (v) => fmtHz(Math.pow(10, v)) },
    ], () => cv.redraw());
    const cv = A.canvas(host, {
      height: 300,
      caption: 'A point source loses 6 dB per doubling of distance. A line array behaves like a cylindrical source (−3 dB per doubling) out to a frequency-dependent near-field limit d ≈ H²·f / 2c, then falls like a point source. Tall arrays and high frequencies throw further — which is how large venues get even level front-to-back.',
      draw(ctx, w, h) {
        const f = Math.pow(10, st.f);
        const ax = A.axes(ctx, w, h, { x: { min: 1, max: 200, log: true, label: 'Distance (m)', ticks: [1, 2, 5, 10, 20, 50, 100, 200] }, y: { min: -50, max: 5, label: 'Level re 1 m (dB)' } });
        const ds = freqs(1, 200, 200);
        A.plotLine(ctx, ax, ds.map((r) => [r, -20 * Math.log10(r)]), A.css('accent2'), 2.2);
        A.plotLine(ctx, ax, ds.map((r) => [r, AP.lineSourceLevel(0, r, st.H, f)]), A.css('accent'), 2.6);
        const dn = AP.lineNearField(st.H, f);
        if (dn > 1 && dn < 200) { ctx.strokeStyle = A.css('muted'); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(dn), ax.y1); ctx.lineTo(ax.X(dn), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'near-field limit ' + fmt(dn, 0) + ' m', ax.X(dn) + 4, ax.y1 + 14, { size: 11, color: A.css('muted') }); }
        A.text(ctx, `Level drop 5 m → 40 m: point ${fmt(20 * Math.log10(8), 1)} dB, line ${fmt(AP.lineSourceLevel(0, 5, st.H, f) - AP.lineSourceLevel(0, 40, st.H, f), 1)} dB`, ax.x0 + 8, ax.y0 - 10, { size: 12, weight: 700 });
      },
    });
    host.appendChild(A.legend([[A.css('accent2'), 'Point source'], [A.css('accent'), 'Line array']]));
  };

  /* ----------------------------------------------------------------------
     Microphone polar patterns
     ---------------------------------------------------------------------- */
  V.micPatterns = function (host) {
    const pats = { omni: [1, 'Omni'], sub: [0.7, 'Wide cardioid'], card: [0.5, 'Cardioid'], super: [0.37, 'Supercardioid'], hyper: [0.25, 'Hypercardioid'], fig8: [0, 'Figure-8'] };
    const st = A.controls(host, [{ key: 'p', label: 'Pattern', type: 'select', value: 'card', options: Object.entries(pats).map(([k, v]) => [k, v[1]]) }, { key: 'ang', label: 'Source angle', type: 'range', min: 0, max: 180, step: 1, value: 90, unit: '°' }], () => cv.redraw());
    const cv = A.canvas(host, {
      height: 300,
      caption: 'First-order patterns are a mix of omni (pressure) and figure-8 (pressure gradient): r(θ) = a + (1 − a)·cos θ. Directional mics reject sound from the sides/rear (great for feedback and spill) but show proximity effect — bass boost when close.',
      draw(ctx, w, h) {
        const a = pats[st.p][0];
        const cx = w * 0.3, cy = h / 2, R = Math.min(w * 0.25, h / 2 - 20);
        ctx.strokeStyle = A.css('line');
        [0.25, 0.5, 0.75, 1].forEach((k) => { ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, TAU); ctx.stroke(); });
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.6; ctx.beginPath();
        for (let i = 0; i <= 360; i++) { const th = (i * Math.PI) / 180; const r = Math.abs(a + (1 - a) * Math.cos(th)) * R; const x = cx + Math.sin(th) * r, y = cy - Math.cos(th) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke(); ctx.lineWidth = 1;
        const th = (st.ang * Math.PI) / 180; const g = Math.abs(a + (1 - a) * Math.cos(th));
        ctx.fillStyle = A.css('accent2'); ctx.beginPath(); ctx.arc(cx + Math.sin(th) * R * 1.05, cy - Math.cos(th) * R * 1.05, 7, 0, TAU); ctx.fill();
        const rej = (x) => (x < 1e-4 ? '−∞' : fmt(20 * Math.log10(x), 1));
        A.text(ctx, pats[st.p][1], w * 0.62, 40, { size: 20, weight: 700 });
        A.text(ctx, `Pickup at ${st.ang}°: ${rej(g)} dB`, w * 0.62, 70, { size: 14 });
        A.text(ctx, `Rear (180°): ${rej(Math.abs(a - (1 - a)))} dB`, w * 0.62, 94, { size: 14, color: A.css('muted') });
        A.text(ctx, `Random-energy efficiency: ${fmt(10 * Math.log10(a * a + ((1 - a) * (1 - a)) / 3), 1)} dB`, w * 0.62, 118, { size: 14, color: A.css('muted') });
        A.text(ctx, '(less room / more gain before feedback)', w * 0.62, 138, { size: 11, color: A.css('muted') });
      },
    });
  };

  /* ----------------------------------------------------------------------
     Gain before feedback
     ---------------------------------------------------------------------- */
  V.feedback = function (host) {
    const st = A.controls(host, [
      { key: 'D0', label: 'D0: talker → farthest listener', type: 'range', min: 3, max: 60, step: 0.5, value: 20, unit: 'm' },
      { key: 'Ds', label: 'Ds: talker → mic', type: 'range', min: 0.02, max: 1.5, step: 0.01, value: 0.3, unit: 'm' },
      { key: 'D1', label: 'D1: mic → nearest loudspeaker', type: 'range', min: 1, max: 20, step: 0.5, value: 6, unit: 'm' },
      { key: 'D2', label: 'D2: loudspeaker → farthest listener', type: 'range', min: 2, max: 60, step: 0.5, value: 16, unit: 'm' },
      { key: 'EAD', label: 'EAD: equivalent acoustic distance wanted', type: 'range', min: 0.5, max: 8, step: 0.1, value: 2, unit: 'm' },
      { key: 'NOM', label: 'Number of open mics', type: 'range', min: 1, max: 16, step: 1, value: 2 },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const verdict = el('div'); host.appendChild(verdict);
    function upd() {
      const pag = AP.pag(st.D0, st.D1, st.Ds, st.D2, st.NOM, 6), nag = AP.nag(st.D0, st.EAD);
      out.innerHTML = A.statBox('Potential gain (PAG)', fmt(pag, 1) + ' dB') + A.statBox('Needed gain (NAG)', fmt(nag, 1) + ' dB') + A.statBox('Margin', fmt(pag - nag, 1) + ' dB', pag >= nag ? 'Stable' : 'Will feed back', pag >= nag ? 'good' : 'bad');
      verdict.innerHTML = `<div class="callout ${pag >= nag ? 'data' : 'warn'}">${pag >= nag ? 'The system can deliver the loudness you want before feedback (6 dB stability margin included).' : 'Not enough gain before feedback. The biggest lever is Ds: halving talker-to-mic distance gains 6 dB. Then: more distance D1 between mic and speakers, fewer open mics (each doubling costs 3 dB), directional mics and speakers, and an automixer.'}</div>`;
    }
    upd();
  };

  /* ----------------------------------------------------------------------
     Tuning lab: measured transfer function vs target; delay, polarity, EQ
     ---------------------------------------------------------------------- */
  V.tuning = function (host) {
    host.appendChild(html('<p class="muted">A simulated main + sub system measured at the mix position with a dual-channel FFT (transfer function). The room adds a 125 Hz mode, a floor-bounce dip and some HF loss; the sub is 2.4 m further away than the mains. Tune it: align the sub (delay/polarity), then use EQ to match the target — cut peaks, don’t chase narrow dips.</p>'));
    const st = A.controls(host, [
      { key: 'delay', label: 'Delay on mains', type: 'range', min: 0, max: 15, step: 0.05, value: 0, unit: 'ms' },
      { key: 'pol', label: 'Invert sub polarity', type: 'check', value: false },
      { key: 'subG', label: 'Sub level', type: 'range', min: -12, max: 12, step: 0.5, value: 4, unit: 'dB' },
      { key: 'target', label: 'Target curve', type: 'select', value: 'tilt', options: [['flat', 'Flat'], ['tilt', 'Gentle tilt (common live target)'], ['house', 'LF lift “house curve”']] },
      { key: 'f1', label: 'EQ 1 frequency', type: 'range', min: Math.log10(40), max: Math.log10(16000), step: 0.005, value: Math.log10(125), fmt: (v) => fmtHz(Math.pow(10, v)) },
      { key: 'g1', label: 'EQ 1 gain', type: 'range', min: -15, max: 6, step: 0.5, value: 0, unit: 'dB' },
      { key: 'q1', label: 'EQ 1 Q', type: 'range', min: 0.5, max: 10, step: 0.1, value: 4 },
      { key: 'f2', label: 'EQ 2 frequency', type: 'range', min: Math.log10(40), max: Math.log10(16000), step: 0.005, value: Math.log10(3000), fmt: (v) => fmtHz(Math.pow(10, v)) },
      { key: 'g2', label: 'EQ 2 gain', type: 'range', min: -15, max: 6, step: 0.5, value: 0, unit: 'dB' },
      { key: 'q2', label: 'EQ 2 Q', type: 'range', min: 0.5, max: 10, step: 0.1, value: 1.5 },
      { key: 'hs', label: 'High shelf (air)', type: 'range', min: -6, max: 6, step: 0.5, value: 0, unit: 'dB' },
    ], () => cv.redraw());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const fsList = freqs(30, 18000, 320);
    const subDist = 2.4, fc = 90;
    function system(f, s) {
      let top = AP.cx.mul(AP.analogFilter('hp', 'LR4', fc, f), AP.analogFilter('hp', 'BW2', 55, f));
      top = AP.cx.mul(top, AP.delayH(f, s.delay));
      let sub = AP.cx.mul(AP.analogFilter('lp', 'LR4', fc, f), AP.analogFilter('hp', 'BW2', 28, f));
      sub = AP.cx.mul(sub, AP.delayH(f, AP.msFromDistance(subDist)));
      const sg = Math.pow(10, s.subG / 20) * (s.pol ? -1 : 1);
      let h = AP.cx.add(top, { re: sub.re * sg, im: sub.im * sg });
      // room: mode at 125 Hz (+8 dB), floor bounce comb (path diff 0.9 m, 0.5 refl), HF air loss
      h = AP.cx.mul(h, AP.biquadH(AP.biquad('peak', 125, 8, 5), f));
      const fb = AP.cx.add({ re: 1, im: 0 }, (() => { const e = AP.delayH(f, AP.msFromDistance(0.9)); return { re: 0.45 * e.re, im: 0.45 * e.im }; })());
      h = AP.cx.mul(h, fb);
      h = AP.cx.mul(h, AP.biquadH(AP.biquad('highshelf', 6000, -4), f));
      h = AP.cx.mul(h, AP.biquadH(AP.biquad('peak', 2500, 3, 2), f));
      // user EQ
      h = AP.cx.mul(h, AP.biquadH(AP.biquad('peak', Math.pow(10, s.f1), s.g1, s.q1), f));
      h = AP.cx.mul(h, AP.biquadH(AP.biquad('peak', Math.pow(10, s.f2), s.g2, s.q2), f));
      h = AP.cx.mul(h, AP.biquadH(AP.biquad('highshelf', 8000, s.hs), f));
      return h;
    }
    const targetDb = (f, t) => (t === 'flat' ? 0 : t === 'tilt' ? -2 * Math.log2(f / 1000) * 0.5 : f < 120 ? 6 * (1 - Math.log2(f / 30) / 2) : 0);
    const cv = A.canvas(host, {
      height: 380,
      caption: 'Top: magnitude (thin: raw; thick: ⅓-octave smoothed) vs target (green band ±3 dB). Bottom: phase (blue) and coherence (grey; low coherence means reflections/noise dominate — don’t EQ there). Score is the RMS deviation from target, 40 Hz–16 kHz.',
      draw(ctx, w, h) {
        const hs = fsList.map((f) => system(f, st));
        const raw = hs.map((x) => AP.db(x));
        // 1/3-octave power smoothing, as analysers display for tuning decisions
        const mags = fsList.map((f) => { let e = 0, n = 0; fsList.forEach((g, k) => { if (g >= f / 1.1225 && g <= f * 1.1225) { e += Math.pow(10, raw[k] / 10); n++; } }); return 10 * Math.log10(e / Math.max(1, n)); });
        const off = mags[fsList.findIndex((f) => f >= 1000)] - targetDb(1000, st.target);
        const ax = A.axes(ctx, w, h * 0.62, { x: { min: 30, max: 18000, log: true, ticks: [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000], fmt: A.shortHz }, y: { min: -18, max: 15, label: 'Magnitude (dB)' } });
        A.plotFill(ctx, ax, fsList.map((f) => [f, targetDb(f, st.target) + 3]), A.alpha(A.css('good'), 0.14), -18);
        A.plotFill(ctx, ax, fsList.map((f) => [f, targetDb(f, st.target) - 3]), A.css('bg2'), -18);
        A.plotLine(ctx, ax, fsList.map((f) => [f, targetDb(f, st.target)]), A.css('good'), 1.4, [5, 4]);
        A.plotLine(ctx, ax, fsList.map((f, i) => [f, raw[i] - off]), A.alpha(A.css('accent'), 0.35), 1);
        A.plotLine(ctx, ax, fsList.map((f, i) => [f, mags[i] - off]), A.css('accent'), 2.6);
        ctx.save(); ctx.translate(0, h * 0.62);
        const ax2 = A.axes(ctx, w, h * 0.38, { pad: { t: 6, b: 30 }, x: { min: 30, max: 18000, log: true, label: 'Frequency (Hz)', ticks: [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000], fmt: A.shortHz }, y: { min: -180, max: 180, ticks: [-180, 0, 180], label: 'Phase°' } });
        // coherence: low where floor-bounce notches are deep
        A.plotLine(ctx, ax2, fsList.map((f) => { const n = Math.abs(1 + 0.45 * Math.cos(2 * Math.PI * f * 0.9 / 343)); return [f, -180 + 360 * Math.min(1, 0.35 + n * 0.5)]; }), A.alpha(A.css('muted'), 0.7), 1.2);
        A.plotLine(ctx, ax2, fsList.map((f, i) => [f, AP.phaseDeg(hs[i])]), A.css('accent2'), 1.4);
        ctx.restore();
        const dev = fsList.filter((f) => f >= 40 && f <= 16000).map((f) => { const i = fsList.indexOf(f); return mags[i] - off - targetDb(f, st.target); });
        const rms = Math.sqrt(dev.reduce((a, b) => a + b * b, 0) / dev.length);
        const iX = fsList.findIndex((f) => f >= fc);
        const xover = mags[iX] - off - targetDb(fc, st.target);
        out.innerHTML = A.statBox('Score (RMS deviation)', fmt(rms, 2) + ' dB', rms < 2 ? 'Excellent' : rms < 3.5 ? 'Good' : 'Keep tuning', rms < 2 ? 'good' : rms < 3.5 ? 'warn' : 'bad') + A.statBox('Level at crossover', fmt(xover, 1) + ' dB', 're target') + A.statBox('Sub arrives late by', fmt(AP.msFromDistance(subDist), 2) + ' ms', 'hint: delay the mains to match');
      },
    });
  };

  /* ----------------------------------------------------------------------
     Impedance / amp loading and speaker wiring
     ---------------------------------------------------------------------- */
  V.ampLoad = function (host) {
    const st = A.controls(host, [
      { key: 'z', label: 'Speaker nominal impedance', type: 'select', value: 8, numeric: true, options: [[4, '4 Ω'], [8, '8 Ω'], [16, '16 Ω']] },
      { key: 'n', label: 'Speakers on one channel', type: 'range', min: 1, max: 8, step: 1, value: 2 },
      { key: 'wiring', label: 'Wiring', type: 'select', value: 'parallel', options: [['parallel', 'Parallel'], ['series', 'Series'], ['sp', 'Series-parallel (pairs)']] },
      { key: 'p8', label: 'Amp rating at 8 Ω', type: 'range', min: 50, max: 5000, step: 50, value: 1000, unit: 'W' },
      { key: 'min', label: 'Amp minimum load', type: 'select', value: 2, numeric: true, options: [[2, '2 Ω'], [4, '4 Ω'], [8, '8 Ω']] },
      { key: 'len', label: 'Cable length (one way)', type: 'range', min: 2, max: 150, step: 1, value: 30, unit: 'm' },
      { key: 'mm2', label: 'Cable cross-section', type: 'select', value: 2.5, numeric: true, options: [[1.5, '1.5 mm² (≈16 AWG)'], [2.5, '2.5 mm² (≈14 AWG)'], [4, '4 mm² (≈12 AWG)'], [6, '6 mm² (≈10 AWG)']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    function upd() {
      let Z;
      if (st.wiring === 'parallel') Z = AP.parallel(Array(st.n).fill(st.z));
      else if (st.wiring === 'series') Z = AP.series(Array(st.n).fill(st.z));
      else { const pairs = Math.max(1, Math.floor(st.n / 2)); Z = AP.parallel(Array(pairs).fill(st.z * 2)); }
      const pAt = Z >= 8 ? st.p8 * (8 / Z) : Z >= 4 ? st.p8 * 1.6 * (4 / Z) / 1 : st.p8 * 2.4 * (2 / Z);
      const P = Math.min(pAt, st.p8 * 2.6);
      const loss = AP.cableLossDb(st.len, st.mm2, Z), df = AP.dampingFactor(st.len, st.mm2, Z);
      out.innerHTML = A.statBox('Load impedance', fmt(Z, 2) + ' Ω', Z < st.min ? 'Below amp minimum!' : 'OK', Z < st.min ? 'bad' : 'good') + A.statBox('Approx. amp power', fmt(P, 0) + ' W', 'per channel into this load') + A.statBox('Per speaker', fmt(P / st.n, 0) + ' W') + A.statBox('Cable loss', fmt(loss, 2) + ' dB', fmt((1 - Math.pow(10, loss / 10)) * 100, 0) + ' % power lost', loss < -0.5 ? 'warn' : 'good') + A.statBox('Damping factor at speaker', fmt(df, 0), df < 20 ? 'Low: bass control suffers' : 'OK', df < 20 ? 'warn' : 'good');
      note.innerHTML = `<div class="callout mentor">Lower impedance draws more current and more power — and more cable loss. Keep total cable resistance below ~5 % of the load (loss ≲ 0.4 dB). Long runs to many speakers? Use a constant-voltage (70/100 V) system or move the amplifiers closer.</div>`;
    }
    upd();
  };

  /* ----------------------------------------------------------------------
     Latency budget
     ---------------------------------------------------------------------- */
  V.latency = function (host) {
    const items = [['ad', 'A/D conversion', 0.5], ['net1', 'Network hop (stagebox → console)', 1], ['console', 'Digital console processing', 1.2], ['net2', 'Network (console → DSP)', 1], ['dsp', 'Speaker processor (incl. FIR)', 2], ['da', 'D/A conversion', 0.5]];
    const st = A.controls(host, items.map(([k, n, v]) => ({ key: k, label: n, type: 'range', min: 0, max: 10, step: 0.05, value: v, unit: 'ms' })), () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    function upd() {
      const t = items.reduce((s, [k]) => s + st[k], 0);
      out.innerHTML = A.statBox('Total system latency', fmt(t, 2) + ' ms', `= sound travelling ${fmt(AP.distanceFromMs(t), 1)} m`) + A.statBox('In-ear monitors', t < 5 ? 'Comfortable' : t < 10 ? 'Noticeable to some' : 'Problematic', 'IEM users are most sensitive', t < 5 ? 'good' : t < 10 ? 'warn' : 'bad') + A.statBox('Wedges / PA', t < 15 ? 'Fine' : 'Perceptible', 'compare to standing a few metres away');
    }
    upd();
  };
})();
