/* ==========================================================================
   Acoustica — outdoor sound, impact / structure-borne sound, special
   absorbers and computer modelling widgets.
   Simplified, indicative teaching models: right trends and magnitudes,
   not a substitute for a standard calculation or a measurement.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, log10 = Math.log10;
  const tp = (t) => Math.max(0, t);
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fill(); };
  const seg = (ctx, x1, y1, x2, y2, c, wd = 1, dash) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = wd; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); };
  const tips = (box, list, cls = 'mentor') => { box.innerHTML = `<div class="callout ${cls}"><ul style="margin:0;padding-left:18px">${list.map((x) => `<li>${x}</li>`).join('')}</ul></div>`; };
  const OCT = [63, 125, 250, 500, 1000, 2000, 4000, 8000];
  const AW = OCT.map((f) => P.aWeight(f));
  const CW = [-0.8, -0.2, 0, 0, 0, -0.2, -0.8, -3.0];
  const dbSum = (a) => 10 * log10(a.reduce((s, v) => s + Math.pow(10, v / 10), 0));
  const rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const stats = (host) => { const o = el('div', { class: 'stats' }); host.appendChild(o); return o; };
  const octFmt = (f) => (f >= 1000 ? f / 1000 + 'k' : String(f));

  /** Pure-tone absorption by the atmosphere, dB per metre (standard relaxation model, sea-level pressure). */
  function airAbs(f, tC, rh) {
    const T = tC + 273.15, T0 = 293.15, T01 = 273.16;
    const psat = Math.pow(10, -6.8346 * Math.pow(T01 / T, 1.261) + 4.6151);
    const hh = rh * psat;
    const frO = 24 + 4.04e4 * hh * (0.02 + hh) / (0.391 + hh);
    const frN = Math.pow(T / T0, -0.5) * (9 + 280 * hh * Math.exp(-4.17 * (Math.pow(T / T0, -1 / 3) - 1)));
    return 8.686 * f * f * (1.84e-11 * Math.sqrt(T / T0) + Math.pow(T / T0, -2.5) * (0.01275 * Math.exp(-2239.1 / T) / (frO + f * f / frO) + 0.1068 * Math.exp(-3352 / T) / (frN + f * f / frN)));
  }
  V.airAbsDbPerM = airAbs;

  /* ======================================================================
     1. Air absorption
     ====================================================================== */
  V.airAbsorption = function (host) {
    const SRC = { music: ['Amplified music', [95, 96, 93, 90, 88, 85, 82, 78]], speech: ['Raised voice / crowd', [52, 60, 68, 72, 70, 66, 60, 52]], traffic: ['Road traffic', [78, 75, 72, 70, 70, 67, 60, 52]], pink: ['Equal energy in every octave', [80, 80, 80, 80, 80, 80, 80, 80]] };
    const st = A.controls(host, [
      { key: 'temp', label: 'Air temperature', type: 'range', min: -10, max: 40, step: 1, value: 20, unit: '°C' },
      { key: 'rh', label: 'Relative humidity', type: 'range', min: 10, max: 100, step: 1, value: 50, unit: '%' },
      { key: 'dist', label: 'Distance from the source', type: 'range', min: 1.3, max: 4, step: 0.01, value: 2.7, fmt: (v) => { const d = Math.pow(10, v); return d >= 1000 ? fmt(d / 1000, 1) + ' km' : fmt(d, 0) + ' m'; } },
      { key: 'src', label: 'Source', type: 'select', value: 'music', options: Object.entries(SRC).map(([k, v]) => [k, v[0]]) },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 290,
      caption: 'Octave-band levels of the same source: measured 10 m away, then at your distance with spreading loss only, and finally with the air’s own absorption added. Spreading lowers every band equally; the air takes extra from the top end only, so far-away sound is always duller.',
      draw(ctx, w, h) {
        if (!R) return;
        const hi = Math.ceil((Math.max(...R.ref) + 5) / 10) * 10;
        const ax = A.axes(ctx, w, h, { x: { min: 45, max: 11000, log: true, ticks: OCT, fmt: octFmt, label: 'Octave band (Hz)' }, y: { min: hi - 90, max: hi, label: 'Level (dB)' } });
        A.plotLine(ctx, ax, OCT.map((f, i) => [f, R.ref[i]]), A.css('muted'), 2, [5, 4]);
        A.plotLine(ctx, ax, OCT.map((f, i) => [f, R.spread[i]]), A.css('accent2'), 2);
        A.plotFill(ctx, ax, OCT.map((f, i) => [f, R.far[i]]), A.alpha(A.css('accent'), 0.18), hi - 90);
        A.plotLine(ctx, ax, OCT.map((f, i) => [f, R.far[i]]), A.css('accent'), 2.5);
        OCT.forEach((f, i) => { if (R.air[i] >= 1) A.text(ctx, '−' + fmt(R.air[i], 0), ax.X(f), Math.max(ax.y1 + 12, ax.Y(R.far[i]) - 6), { size: 10, align: 'center', color: A.css('accent') }); });
      },
    });
    host.appendChild(A.legend([[A.css('muted'), 'at 10 m', true], [A.css('accent2'), 'far away — spreading only'], [A.css('accent'), 'far away — spreading + air (numbers: dB taken by the air)']]));
    host.appendChild(tip);
    function upd() {
      const d = Math.pow(10, st.dist), ref = SRC[st.src][1];
      const a = OCT.map((f) => airAbs(f, st.temp, st.rh));
      const sp = 20 * log10(d / 10);
      const air = a.map((x) => x * Math.max(0, d - 10));
      const spread = ref.map((L) => L - sp), far = ref.map((L, i) => L - sp - air[i]);
      R = { ref, spread, far, air };
      const dA0 = dbSum(spread.map((L, i) => L + AW[i])), dA1 = dbSum(far.map((L, i) => L + AW[i]));
      const d20 = 10 + 20 / a[7];
      out.innerHTML = A.statBox('Air loss at 125 Hz', fmt(a[1] * 100, 2) + ' dB / 100 m', 'almost nothing') + A.statBox('Air loss at 1 kHz', fmt(a[4] * 100, 1) + ' dB / 100 m') + A.statBox('Air loss at 4 kHz', fmt(a[6] * 100, 1) + ' dB / 100 m', '', a[6] * 100 > 4 ? 'warn' : '') + A.statBox('Air loss at 8 kHz', fmt(a[7] * 100, 1) + ' dB / 100 m', `20 dB gone after ≈ ${fmt(d20, 0)} m`, 'bad') + A.statBox('Overall level here', fmt(dA1, 0) + ' dBA', `air removed ${fmt(dA0 - dA1, 1)} dBA on top of spreading`);
      const t = [];
      if (st.rh < 30) t.push('Dry air is the most absorbent: the molecular “relaxation” that eats treble moves into the audio band. Desert festivals and winter halls with dry heating lose noticeably more top end over distance.');
      else if (st.rh > 70) t.push('Humid air is kind to high frequencies — the opposite of the common belief that “damp air deadens sound”.');
      if (st.temp < 5) t.push('In cold air the losses at mid frequencies rise while the very top can fall — the curve changes shape, which is why system tuning drifts between a warm sound-check and a cold evening show.');
      if (d > 300) t.push('At this distance the bass has lost almost nothing to the air. What reaches a far neighbour is mostly 50–250 Hz — which is why distant music is a thump and why limits for events are often set in dB(C) or in the bass octave bands.');
      else t.push('Up to a few tens of metres air absorption is negligible below 4 kHz; indoors it only matters in large halls, where it limits reverberation at the top of the spectrum.');
      t.push('Large PA systems compensate with extra high-frequency drive for the far zones — but only up to a point: 20 dB of extra power at 8 kHz is not available.');
      tips(tip, t); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Barrier designer
     ====================================================================== */
  V.barrierDesigner = function (host) {
    const TRAF = [78, 75, 72, 70, 70, 67, 60, 52];
    const st = A.controls(host, [
      { key: 'hs', label: 'Source height', type: 'range', min: 0.2, max: 5, step: 0.1, value: 0.5, unit: 'm' },
      { key: 'ds', label: 'Source → barrier', type: 'range', min: 1, max: 50, step: 0.5, value: 5, unit: 'm' },
      { key: 'hb', label: 'Barrier height', type: 'range', min: 0, max: 8, step: 0.1, value: 3, unit: 'm' },
      { key: 'dr', label: 'Barrier → listener', type: 'range', min: 1, max: 100, step: 0.5, value: 20, unit: 'm' },
      { key: 'hr', label: 'Listener height', type: 'range', min: 1, max: 10, step: 0.1, value: 1.6, unit: 'm' },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 380, animate: true,
      caption: 'Top: a section through source, barrier and listener. Sound can only reach the shadow zone by bending over the top edge; the extra distance of that bent path compared with the straight line is the path difference. Bottom: the resulting insertion loss in each octave band — large for short wavelengths, small for bass.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const top = 22, gy = Math.round(h * 0.5), W = st.ds + st.dr, mx = 34, sx = (w - 2 * mx) / W, Hm = Math.max(st.hb, st.hs, st.hr) + 1.5, sy = (gy - top) / Hm;
        const X = (x) => mx + x * sx, Y = (y) => gy - y * sy;
        ctx.fillStyle = A.alpha(A.css('c4'), 0.25); ctx.fillRect(0, gy, w, 6);
        // shadow zone
        if (R.delta > 0) { ctx.fillStyle = A.alpha(A.css('muted'), 0.14); ctx.beginPath(); ctx.moveTo(X(st.ds), Y(st.hb)); const sl = (st.hb - st.hs) / st.ds; ctx.lineTo(X(W) + mx, Y(st.hb + sl * (st.dr + mx / sx))); ctx.lineTo(X(W) + mx, gy); ctx.lineTo(X(st.ds), gy); ctx.closePath(); ctx.fill(); }
        // source rings
        ctx.save(); ctx.beginPath(); ctx.rect(0, top - 14, X(st.ds), gy - top + 14); ctx.clip();
        for (let k = 0; k < 5; k++) { const r = ((t * 40 + k * 44) % 220); ctx.strokeStyle = A.alpha(A.css('accent'), Math.max(0, 0.7 - r / 320)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(0), Y(st.hs), r, 0, TAU); ctx.stroke(); }
        ctx.restore();
        // diffracted rings
        ctx.save(); ctx.beginPath(); ctx.rect(X(st.ds), top - 14, w, gy - top + 14); ctx.clip();
        const a0 = A.clamp(1 - R.il[4] / 26, 0.12, 1);
        for (let k = 0; k < 5; k++) { const r = ((t * 40 + k * 44) % 220); ctx.strokeStyle = A.alpha(A.css('accent'), Math.max(0, (0.7 - r / 320) * a0)); ctx.lineWidth = 1.5; ctx.beginPath(); if (R.delta > 0) ctx.arc(X(st.ds), Y(st.hb), r, 0, TAU); else ctx.arc(X(0), Y(st.hs), r + st.ds * sx, 0, TAU); ctx.stroke(); }
        ctx.restore();
        seg(ctx, X(0), Y(st.hs), X(W), Y(st.hr), A.css('muted'), 1.2, [5, 4]);
        if (st.hb > 0.05) { seg(ctx, X(0), Y(st.hs), X(st.ds), Y(st.hb), A.css('accent2'), 2); seg(ctx, X(st.ds), Y(st.hb), X(W), Y(st.hr), A.css('accent2'), 2); ctx.fillStyle = A.css('text'); ctx.fillRect(X(st.ds) - 3, Y(st.hb), 6, st.hb * sy); }
        dot(ctx, X(0), Y(st.hs), 6, A.css('accent')); dot(ctx, X(W), Y(st.hr), 6, A.css('good'));
        A.text(ctx, 'source', X(0), gy + 18, { size: 10, align: 'center', color: A.css('muted') }); A.text(ctx, 'listener', X(W), gy + 18, { size: 10, align: 'center', color: A.css('muted') });
        A.text(ctx, R.delta > 0 ? 'shadow zone' : 'line of sight — no shadow', X(st.ds + st.dr * 0.5), gy - 8, { size: 10, align: 'center', color: A.css('muted') });
        // bars
        const by0 = h - 30, by1 = gy + 40, bw = (w - 2 * mx) / 8;
        A.text(ctx, 'Insertion loss per octave band (dB)', mx, by1 - 10, { size: 11, color: A.css('muted') });
        OCT.forEach((f, i) => {
          const v = R.il[i], bh = (v / 25) * (by0 - by1), x = mx + i * bw;
          ctx.fillStyle = A.alpha(v > 15 ? A.css('good') : v > 8 ? A.css('warn') : A.css('bad'), 0.8); ctx.fillRect(x + 4, by0 - bh, bw - 8, bh);
          A.text(ctx, fmt(v, 0), x + bw / 2, by0 - bh - 4, { size: 11, align: 'center', weight: 700 });
          A.text(ctx, octFmt(f), x + bw / 2, by0 + 14, { size: 10, align: 'center', color: A.css('muted') });
        });
        seg(ctx, mx, by0, w - mx, by0, A.css('muted'));
      },
    });
    host.appendChild(tip);
    function upd() {
      const Apath = Math.hypot(st.ds, st.hb - st.hs), B = Math.hypot(st.dr, st.hb - st.hr), d = Math.hypot(st.ds + st.dr, st.hr - st.hs);
      const los = st.hs + (st.hr - st.hs) * st.ds / (st.ds + st.dr);
      const delta = (Apath + B - d) * (st.hb >= los ? 1 : -1);
      const il = OCT.map((f) => (st.hb < 0.05 ? 0 : Math.max(0, P.maekawa(delta, f))));
      R = { delta, il };
      const before = dbSum(TRAF.map((L, i) => L + AW[i])), after = dbSum(TRAF.map((L, i) => L + AW[i] - il[i]));
      const N = 2 * delta * 500 / P.C;
      out.innerHTML = A.statBox('Path difference δ', fmt(delta * 1000, 0) + ' mm', delta > 0 ? 'over the top minus straight line' : 'barrier below the sight line', delta > 0 ? '' : 'bad') + A.statBox('Fresnel number at 500 Hz', fmt(N, 2), 'N = 2δ / λ') + A.statBox('Loss at 125 Hz', fmt(il[1], 0) + ' dB', 'bass bends over easily', il[1] < 8 ? 'bad' : 'warn') + A.statBox('Loss at 1 kHz', fmt(il[4], 0) + ' dB', '', il[4] > 15 ? 'good' : il[4] > 8 ? 'warn' : 'bad') + A.statBox('Traffic noise overall', '−' + fmt(before - after, 0) + ' dBA', before - after >= 10 ? 'about half as loud' : before - after >= 5 ? 'clearly noticeable' : 'barely worth building', before - after >= 10 ? 'good' : before - after >= 5 ? 'warn' : 'bad');
      const t = [];
      if (delta <= 0) t.push('The listener can still see the source over the barrier. Breaking the line of sight is the minimum: it is worth about 5 dB; every extra bit of height then adds more.');
      const mid = Math.min(st.ds, st.dr) / (st.ds + st.dr);
      if (mid > 0.3 && delta > 0) t.push('The barrier is near the middle of the path — the least effective position. Move it close to the source (or close to the listener) and the same height gives a much larger path difference.');
      else if (delta > 0) t.push('Good placement: the barrier is close to one end of the path, which maximises the path difference for a given height.');
      if (st.hr > st.hb + 1) t.push('The listener is higher than the barrier (an upper-floor window, a hillside). Barriers protect ground-level listeners far better than upstairs bedrooms.');
      if (il[4] >= 20) t.push('Above about 20 dB the calculation stops being the limit: sound coming around the ends, through gaps and through the panel itself (use at least 10 kg/m², no gaps at the ground) takes over. Real barriers rarely beat 20–24 dB.');
      t.push('Rule of thumb: just breaking the sight line ≈ 5 dB; each extra metre above it adds roughly 1.5 dB at mid frequencies; halving the wavelength (one octave up) adds about 3 dB.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     3. Environmental noise descriptors
     ====================================================================== */
  V.noiseDescriptors = function (host) {
    const st = A.controls(host, [
      { key: 'span', label: 'Measurement', type: 'select', value: 'day', options: [['day', 'A whole day (24 hours)'], ['short', 'A 15-minute sample']] },
      { key: 'traffic', label: 'Steady road traffic', type: 'check', value: true },
      { key: 'cars', label: 'Individual passing vehicles', type: 'check', value: true },
      { key: 'plane', label: 'Aircraft overhead', type: 'check', value: false },
      { key: 'quiet', label: 'Night-time quiet (traffic dies away)', type: 'check', value: true },
      { key: 'music', label: 'A music event (evening)', type: 'check', value: false },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    function build() {
      const r = rng(7), day = st.span === 'day', n = day ? 1440 : 900, L = new Float32Array(n);
      const bump = (i, c, wd) => Math.exp(-0.5 * Math.pow((i - c) / wd, 2));
      const ev = [];
      if (st.cars) { if (day) for (let k = 0; k < 150; k++) { const hr = r() * 24, night = hr < 6 || hr > 23; if (night && r() < (st.quiet ? 0.85 : 0.5)) continue; ev.push([hr * 60, 0.6, 66 + r() * 12]); } else for (let c = 20 + r() * 20; c < n; c += 25 + r() * 50) ev.push([c, 2.5 + r() * 2, 68 + r() * 10]); }
      if (st.plane) { if (day) for (let k = 0; k < 14; k++) ev.push([(6.5 + r() * 16) * 60, 1.1, 78 + r() * 7]); else ev.push([520, 14, 82]); }
      for (let i = 0; i < n; i++) {
        const hr = day ? i / 60 : 14, parts = [];
        const nightF = day ? A.clamp(Math.min(Math.abs(hr - 3), 24 - Math.abs(hr - 3)) / 4.5, 0, 1) : 1;      // 0 at 3 am → 1 by day
        const rush = day ? 2.5 * (bump(hr, 8.3, 1) + bump(hr, 17.5, 1.3)) : 0;
        parts.push((st.quiet ? 29 : 36) + 8 * nightF + r() * 1.5);
        if (st.traffic) parts.push(58 - (st.quiet ? 17 : 6) * (1 - nightF) + rush + (r() - 0.5) * (day ? 2.5 : 4));
        if (st.music) { if (day) { if (hr >= 19 && hr < 23.5) parts.push(67 + (r() - 0.5) * 4 - (hr > 23 ? 4 : 0)); } else parts.push(64 + 3 * Math.sin(i * 0.9) + (r() - 0.5) * 3); }
        let lin = parts.reduce((s, v) => s + Math.pow(10, v / 10), 0);
        for (const e of ev) { const b = bump(i, e[0], e[1]); if (b > 1e-4) lin += Math.pow(10, e[2] / 10) * b; }
        L[i] = 10 * log10(lin);
      }
      const leq = (a, b) => { let s = 0, c = 0; for (let i = a; i < b; i++) { s += Math.pow(10, L[i] / 10); c++; } return 10 * log10(s / Math.max(1, c)); };
      const sorted = Array.from(L).sort((a, b) => a - b), pc = (p) => sorted[Math.min(n - 1, Math.floor(p * n))];
      const res = { L, n, day, leq: leq(0, n), l10: pc(0.9), l90: pc(0.1), lmax: sorted[n - 1] };
      if (day) {
        const e = (v) => Math.pow(10, v / 10);
        res.ld = leq(420, 1140); res.le = leq(1140, 1380); res.ln = 10 * log10((e(leq(1380, 1440)) * 60 + e(leq(0, 420)) * 420) / 480);
        res.lden = 10 * log10((12 * e(res.ld) + 4 * e(res.le + 5) + 8 * e(res.ln + 10)) / 24);
        const d15 = leq(420, 1320), n9 = 10 * log10((e(leq(1320, 1440)) * 120 + e(leq(0, 420)) * 420) / 540);
        res.ldn = 10 * log10((15 * e(d15) + 9 * e(n9 + 10)) / 24);
      } else res.sel = res.leq + 10 * log10(900);
      return res;
    }
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'A synthetic A-weighted level history built from the ingredients you ticked. The horizontal lines are three different one-number summaries of the same trace: the level exceeded 10 % of the time (the events), the energy average, and the level exceeded 90 % of the time (the background). The moving cursor reads the instantaneous level.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const xm = R.day ? 24 : 15;
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: xm, ticks: R.day ? [0, 3, 6, 9, 12, 15, 18, 21, 24] : [0, 3, 6, 9, 12, 15], fmt: (v) => (R.day ? v + 'h' : v + ' min'), label: R.day ? 'Time of day' : 'Time' }, y: { min: 25, max: 95, label: 'Level (dBA)' } });
        if (R.day) { ctx.fillStyle = A.alpha(A.css('c1'), 0.13); ctx.fillRect(ax.X(0), ax.y1, ax.X(7) - ax.X(0), ax.y0 - ax.y1); ctx.fillRect(ax.X(23), ax.y1, ax.X(24) - ax.X(23), ax.y0 - ax.y1); ctx.fillStyle = A.alpha(A.css('c6'), 0.13); ctx.fillRect(ax.X(19), ax.y1, ax.X(23) - ax.X(19), ax.y0 - ax.y1); A.text(ctx, 'night +10', ax.X(3.5), ax.y1 + 12, { size: 10, align: 'center', color: A.css('muted') }); if (w > 480) A.text(ctx, 'evening +5', ax.X(21), ax.y1 + 12, { size: 10, align: 'center', color: A.css('muted') }); }
        const pts = []; for (let i = 0; i < R.n; i++) pts.push([(i / R.n) * xm, R.L[i]]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 1.2);
        [[R.l10, 'c5', 'L10'], [R.leq, 'good', 'Leq'], [R.l90, 'accent2', 'L90']].forEach(([v, c, l]) => { seg(ctx, ax.x0, ax.Y(v), ax.x1, ax.Y(v), A.css(c), 1.6, [6, 4]); A.text(ctx, l + ' ' + fmt(v, 0), ax.x1 - 4, ax.Y(v) - 4, { size: 10, align: 'right', color: A.css(c), weight: 700 }); });
        const i = Math.floor(((t * 0.06) % 1) * R.n), x = ax.X((i / R.n) * xm);
        seg(ctx, x, ax.y1, x, ax.y0, A.css('text'), 1); dot(ctx, x, ax.Y(R.L[i]), 4, A.css('text'));
        A.text(ctx, fmt(R.L[i], 0) + ' dBA', Math.min(x + 6, ax.x1 - 50), ax.y0 - 8, { size: 11, weight: 700 });
      },
    });
    host.appendChild(tip);
    function upd() {
      R = build(); const r = R;
      let s = A.statBox('L<sub>Aeq</sub> — energy average', fmt(r.leq, 0) + ' dBA', r.day ? 'over 24 h' : 'over 15 min') + A.statBox('L<sub>A10</sub> — the events', fmt(r.l10, 0) + ' dBA', 'exceeded 10 % of the time') + A.statBox('L<sub>A90</sub> — the background', fmt(r.l90, 0) + ' dBA', 'exceeded 90 % of the time') + A.statBox('L<sub>AFmax</sub>', fmt(r.lmax, 0) + ' dBA', 'loudest moment');
      if (r.day) s += A.statBox('Day · evening · night', `${fmt(r.ld, 0)} · ${fmt(r.le, 0)} · ${fmt(r.ln, 0)}`, 'L<sub>Aeq</sub> 07–19 · 19–23 · 23–07') + A.statBox('L<sub>den</sub>', fmt(r.lden, 0) + ' dB', 'evening +5, night +10', r.lden > 65 ? 'bad' : r.lden > 55 ? 'warn' : 'good') + A.statBox('L<sub>dn</sub>', fmt(r.ldn, 0) + ' dB', 'night (22–07) +10');
      else s += A.statBox('Sound exposure level', fmt(r.sel, 0) + ' dB', 'all the energy squeezed into 1 s');
      out.innerHTML = s;
      const t = [];
      if (r.l10 - r.l90 > 12) t.push(`The gap between L10 and L90 is ${fmt(r.l10 - r.l90, 0)} dB — an “eventful” climate. Intermittent noise against a quiet background is far more disturbing than the average suggests; assess events (Lmax, number of events) as well as Leq.`);
      else t.push(`L10 and L90 are only ${fmt(r.l10 - r.l90, 0)} dB apart — a steady noise climate that the single Leq figure describes well.`);
      if (r.day && r.lden - r.leq > 3) t.push(`The penalties lift L<sub>den</sub> ${fmt(r.lden - r.leq, 0)} dB above the plain 24-hour average: noise in the evening and at night counts as if it were 5 and 10 dB louder, because that is when people rest.`);
      if (st.music && r.day) t.push('The music event barely moves the 24-hour average — yet it is exactly what neighbours will complain about. That is why event licences set limits as short-period Leq (often 15 minutes) at the nearest dwelling, usually with a separate bass limit.');
      if (st.quiet) t.push('For a studio site the number that sets your isolation is the loudest regular event (Lmax of lorries, trains, aircraft) at the quietest time — not the daytime average. Survey over at least one full night.');
      if (!st.traffic && !st.cars && !st.plane && !st.music) t.push('With nothing ticked you are looking at a quiet rural background — 30–40 dBA. New noise is judged against this, so the same machine is acceptable in a city and a nuisance here.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     4. Outdoor event noise at a neighbour
     ====================================================================== */
  V.eventNoise = function (host) {
    const SHAPE = [8, 6, 2, 0, -1, -3, -6, -12];
    const DIR = { front: [0, 0, 0, 0, 0, 0, 0, 0], side: [-1, -2, -4, -6, -8, -10, -12, -14], behind: [-2, -4, -8, -12, -15, -18, -20, -22] };
    const CARD = { front: [0, 0], side: [-5, -3], behind: [-13, -9] };
    const st = A.controls(host, [
      { key: 'mix', label: 'Level at the mix position', type: 'range', min: 85, max: 105, step: 1, value: 98, unit: 'dBA' },
      { key: 'dm', label: 'Stage → mix position', type: 'range', min: 15, max: 70, step: 1, value: 35, unit: 'm' },
      { key: 'dn', label: 'Stage → nearest neighbour', type: 'range', min: 2, max: 3.6, step: 0.01, value: 2.78, fmt: (v) => { const d = Math.pow(10, v); return d >= 1000 ? fmt(d / 1000, 1) + ' km' : fmt(d, 0) + ' m'; } },
      { key: 'dir', label: 'Where the neighbour is', type: 'select', value: 'front', options: [['front', 'In front of the stage (on axis)'], ['side', 'To the side'], ['behind', 'Behind the stage']] },
      { key: 'wx', label: 'Weather', type: 'select', value: 'neutral', options: [['neutral', 'Calm, neutral day'], ['down', 'Downwind / clear cold night (worst case)'], ['up', 'Upwind']] },
      { key: 'limit', label: 'Limit at the neighbour', type: 'range', min: 40, max: 75, step: 1, value: 60, unit: 'dBA' },
      { key: 'card', label: 'Directional (cardioid) subwoofer array', type: 'check', value: false },
      { key: 'barrier', label: 'Barrier / stacked containers behind the audience', type: 'check', value: false },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    function at(d) {
      const raw = dbSum(SHAPE.map((v, i) => v + AW[i])), base = SHAPE.map((v) => v + st.mix - raw);
      const L = base.map((v, i) => {
        let x = v - 20 * log10(Math.max(d, 5) / st.dm) - airAbs(OCT[i], 15, 70) * Math.max(0, d - st.dm) + DIR[st.dir][i];
        if (st.card && i < 2) x += CARD[st.dir][i];
        if (st.barrier && d > st.dm + 30) x -= Math.max(0, P.maekawa(0.35, OCT[i]));
        if (d > 100) { const g = Math.min(1, (d - 100) / 300); if (st.wx === 'neutral' && (i === 2 || i === 3)) x -= 3 * g; if (st.wx === 'down' && i >= 2) x += 2 * g; if (st.wx === 'up' && i >= 2) x -= (4 + i) * g; }
        return x;
      });
      return { L, dba: dbSum(L.map((v, i) => v + AW[i])), dbc: dbSum(L.map((v, i) => v + CW[i])) };
    }
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Predicted level against distance from the stage, in dB(A) and dB(C). The gap between the two curves widens with distance because air, ground and barriers remove mid and high frequencies but leave the bass — so the far-away neighbour hears mostly the low end. The vertical marker is the neighbour; the horizontal line is the dB(A) limit.',
      draw(ctx, w, h) {
        if (!R) return;
        const ax = A.axes(ctx, w, h, { x: { min: 30, max: 5000, log: true, fmt: (v) => (v >= 1000 ? v / 1000 + ' km' : v + ' m'), label: 'Distance from the stage' }, y: { min: 30, max: 115, label: 'Level (dB)' } });
        const pa = [], pc = []; for (let e = log10(30); e <= log10(5000); e += 0.03) { const d = Math.pow(10, e), r = at(d); pa.push([d, r.dba]); pc.push([d, r.dbc]); }
        A.plotLine(ctx, ax, pc, A.css('c5'), 2); A.plotLine(ctx, ax, pa, A.css('accent'), 2.5);
        seg(ctx, ax.x0, ax.Y(st.limit), ax.x1, ax.Y(st.limit), A.css('bad'), 1.5, [6, 4]); A.text(ctx, 'limit ' + st.limit + ' dBA', ax.x0 + 6, ax.Y(st.limit) - 5, { size: 10, color: A.css('bad') });
        const d = Math.pow(10, st.dn), x = ax.X(d);
        seg(ctx, x, ax.y1, x, ax.y0, A.css('text'), 1, [3, 3]); dot(ctx, x, ax.Y(R.dba), 5, A.css('accent')); dot(ctx, x, ax.Y(R.dbc), 5, A.css('c5'));
        A.text(ctx, 'neighbour', Math.min(x + 6, ax.x1 - 56), ax.y1 + 12, { size: 10, color: A.css('muted') });
        const xm = ax.X(st.dm); seg(ctx, xm, ax.y0 - 14, xm, ax.y0, A.css('good'), 2); A.text(ctx, 'mix', xm, ax.y0 - 18, { size: 10, align: 'center', color: A.css('good') });
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'dB(A) — overall loudness'], [A.css('c5'), 'dB(C) — includes the bass']]));
    host.appendChild(tip);
    function upd() {
      const d = Math.pow(10, st.dn); R = at(d);
      const over = R.dba - st.limit, loud = R.L.indexOf(Math.max(...R.L));
      out.innerHTML = A.statBox('At the neighbour', fmt(R.dba, 0) + ' dBA', over > 0 ? `${fmt(over, 0)} dB over the limit` : `${fmt(-over, 0)} dB inside the limit`, over > 0 ? 'bad' : over > -3 ? 'warn' : 'good') + A.statBox('Including bass', fmt(R.dbc, 0) + ' dBC', `C − A = ${fmt(R.dbc - R.dba, 0)} dB`, R.dbc - R.dba > 18 ? 'bad' : R.dbc - R.dba > 12 ? 'warn' : '') + A.statBox('Loudest band there', octFmt(OCT[loud]) + ' Hz', fmt(R.L[loud], 0) + ' dB') + A.statBox('Highest mix level that complies', fmt(Math.min(105, st.mix - over), 0) + ' dBA', st.mix - over < 92 ? 'too quiet for a rock show — change the layout' : 'workable', st.mix - over < 92 ? 'bad' : 'good');
      const t = [];
      if (over > 0) t.push(`You are ${fmt(over, 0)} dB over. In order of value: turn the stage so it faces away from the nearest homes, use more and smaller loudspeakers closer to the audience (delay towers) so the main system can run quieter, then barriers, then a lower level.`);
      if (R.dbc - R.dba > 15) t.push('C − A is large: the complaint will be about bass thump through closed windows. A directional subwoofer array aimed away from the homes, a high-pass filter around 40–50 Hz and a separate limit in the 63 and 125 Hz octave bands are the standard tools.');
      if (st.dir === 'front') t.push('The neighbour is on axis — the worst case. Rotating the site so the homes are behind the stage is worth 10–20 dB at mid and high frequencies and costs nothing if done at the planning stage.');
      if (st.wx === 'down') t.push('Downwind or under a night-time temperature inversion, sound bends back towards the ground and levels far away can be 5–10 dB higher than on a neutral afternoon. Always predict and monitor for the evening, not the sound-check.');
      if (st.barrier) t.push('The barrier helps mid and high frequencies near the site but adds only a few decibels at 63 Hz — and nothing for homes on a hillside that can see over it.');
      t.push('Monitor continuously at the mix position and at the boundary during the event, log 15-minute levels, and agree in advance who may tell the engineer to turn down.');
      tips(tip, t); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Impact sound of floors
     ====================================================================== */
  const T3 = [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];
  const REF_IMP = [62, 62, 62, 62, 62, 62, 61, 60, 59, 58, 57, 54, 51, 48, 45, 42];
  function weightedImpact(L19) {
    const L = L19.slice(3);
    let best = -60;
    for (let s = 40; s >= -60; s--) { let dev = 0; for (let i = 0; i < 16; i++) dev += Math.max(0, L[i] - (REF_IMP[i] + s)); if (dev <= 32) best = s; else break; }
    return 60 + best;
  }
  V.weightedImpact = weightedImpact;
  V.impactFloor = function (host) {
    const st = A.controls(host, [
      { key: 'base', label: 'Structural floor', type: 'select', value: 'conc', options: [['conc', 'Concrete slab'], ['timber', 'Timber joists, boards above, plasterboard below']] },
      { key: 'thick', label: 'Slab thickness (concrete only)', type: 'range', min: 100, max: 300, step: 10, value: 150, unit: 'mm' },
      { key: 'cover', label: 'What you walk on', type: 'select', value: 'none', options: [['none', 'Bare / hard tiles bonded to the floor'], ['vinyl', 'Cushioned vinyl'], ['carpet', 'Carpet on thick underlay'], ['screed', 'Floating screed on a resilient layer'], ['deck', 'Floating timber deck on a resilient layer']] },
      { key: 'stiff', label: 'Resilient layer stiffness (floating floors)', type: 'range', min: 4, max: 60, step: 1, value: 12, fmt: (v) => v + ' MN/m³ ' + (v < 10 ? '(soft)' : v < 25 ? '(medium)' : '(stiff)') },
      { key: 'ceil', label: 'Resiliently suspended ceiling below', type: 'check', value: false },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    function spectrum(cover, ceil) {
      const conc = st.base === 'conc', lg2 = (x) => Math.log2(x);
      let L;
      if (conc) { const shape = T3.map((f) => 1.5 * lg2(f / 500)); const target = 164 - 35 * log10(2400 * st.thick / 1000); const off = target - weightedImpact(shape); L = shape.map((v) => v + off); }
      else L = T3.map((f) => (f <= 160 ? 80 : 80 - 5 * lg2(f / 160)));
      const k = conc ? 1 : 0.6;
      let f0 = null;
      const dL = T3.map((f) => {
        let d = 0;
        if (cover === 'vinyl') d = A.clamp(6 * lg2(f / 400), 0, 18) * k;
        if (cover === 'carpet') d = A.clamp(11 * lg2(f / 100), 0, 45) * k;
        if (cover === 'screed' || cover === 'deck') { const m = cover === 'screed' ? 100 : 25; f0 = P.floatingF0(st.stiff, m); const r = f / f0; d = r > 1.15 ? Math.min(cover === 'screed' ? 40 : 30, (cover === 'screed' ? 30 : 25) * log10(r)) * (conc ? 1 : 0.7) : r > 0.75 ? -3 : 0; }
        if (ceil) d += conc ? A.clamp(4 * lg2(f / 50), 0, 14) : A.clamp(5 * lg2(f / 40), 0, 17);
        return d;
      });
      return { L: L.map((v, i) => v - dL[i]), f0 };
    }
    const cv = A.canvas(host, {
      height: 400, animate: true,
      caption: 'Top: the floor build-up with a standard hammer tapping on it; the rings below show how much reaches the room underneath. Bottom: the impact level in the room below in third-octave bands, with the stepped rating curve slid down until it just fits — its value at 500 Hz is the single-number rating. For impact sound, lower is better.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        // --- section
        const sx0 = 20, sx1 = w - 20, fy = 46, conc = st.base === 'conc', ft = conc ? 10 + st.thick / 20 : 22;
        let y = fy;
        const layer = (th, c, a, label) => { ctx.fillStyle = A.alpha(A.css(c), a); ctx.fillRect(sx0, y, sx1 - sx0, th); if (label && w > 430) A.text(ctx, label, sx1 - 6, y + th - 2, { size: 9, align: 'right', color: A.css('text') }); y += th; };
        if (st.cover === 'vinyl') layer(3, 'c3', 0.9, '');
        if (st.cover === 'carpet') layer(7, 'c5', 0.7, 'carpet + underlay');
        if (st.cover === 'screed') { layer(12, 'muted', 0.75, 'screed'); layer(5, 'warn', 0.9, 'resilient layer'); }
        if (st.cover === 'deck') { layer(7, 'c6', 0.8, 'deck'); layer(5, 'warn', 0.9, 'resilient layer'); }
        const topY = fy;
        if (conc) layer(ft, 'muted', 0.5, 'concrete'); else { layer(5, 'c6', 0.8, 'boards'); for (let x = sx0 + 10; x < sx1 - 8; x += 60) { ctx.fillStyle = A.alpha(A.css('c6'), 0.7); ctx.fillRect(x, y, 8, 16); } y += 16; layer(3, 'text', 0.6, ''); }
        if (st.ceil) { for (let x = sx0 + 30; x < sx1; x += 80) seg(ctx, x, y, x, y + 10, A.css('warn'), 2, [2, 2]); y += 10; layer(4, 'text', 0.7, w > 430 ? 'ceiling on resilient hangers' : ''); }
        const hx = w * 0.3, ph = (t * 2) % 1, hy = topY - 6 - 18 * Math.abs(Math.sin(ph * Math.PI));
        ctx.fillStyle = A.css('text'); ctx.fillRect(hx - 5, hy - 12, 10, 12); seg(ctx, hx, hy - 12, hx, hy - 26, A.css('text'), 2);
        A.text(ctx, 'tapping machine', hx + 12, topY - 18, { size: 10, color: A.css('muted') });
        const strength = A.clamp((R.lnw - 25) / 55, 0.05, 1);
        for (let k = 0; k < 3; k++) { const r = ((t * 30 + k * 26) % 78); ctx.strokeStyle = A.alpha(strength > 0.6 ? A.css('bad') : strength > 0.4 ? A.css('warn') : A.css('good'), Math.max(0, (1 - r / 78) * strength)); ctx.lineWidth = 1 + 2 * strength; ctx.beginPath(); ctx.arc(hx, y + 2, r, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); }
        // --- plot
        const ax = A.axes(ctx, w, h, { pad: { t: 150 }, x: { min: 45, max: 3500, log: true, ticks: [50, 100, 200, 500, 1000, 2000], fmt: (v) => String(v), label: 'Third-octave band (Hz)' }, y: { min: 10, max: 90, label: 'Impact level below (dB)' } });
        A.plotLine(ctx, ax, T3.map((f, i) => [f, R.bare[i]]), A.css('muted'), 1.5, [5, 4]);
        const sh = R.lnw - 60; A.plotLine(ctx, ax, T3.slice(3).map((f, i) => [f, REF_IMP[i] + sh]), A.css('accent2'), 2);
        A.plotLine(ctx, ax, T3.map((f, i) => [f, R.L[i]]), A.css('accent'), 2.5);
        dot(ctx, ax.X(500), ax.Y(R.lnw), 5, A.css('accent2')); A.text(ctx, 'rating ' + fmt(R.lnw, 0), ax.X(500) + 8, ax.Y(R.lnw) - 6, { size: 11, weight: 700, color: A.css('accent2') });
        if (R.f0 && R.f0 > 45) { seg(ctx, ax.X(R.f0), ax.y1, ax.X(R.f0), ax.y0, A.css('warn'), 1, [3, 3]); A.text(ctx, 'f₀', ax.X(R.f0) + 3, ax.y1 + 12, { size: 10, color: A.css('warn') }); }
      },
    });
    host.appendChild(A.legend([[A.css('muted'), 'bare structural floor', true], [A.css('accent'), 'your build-up'], [A.css('accent2'), 'rating curve, shifted to fit']]));
    host.appendChild(tip);
    function upd() {
      const b = spectrum('none', false), s = spectrum(st.cover, st.ceil);
      const lnw = weightedImpact(s.L), bare = weightedImpact(b.L), thud = (s.L[0] + s.L[1] + s.L[2]) / 3;
      R = { L: s.L, bare: b.L, lnw, f0: s.f0 };
      const v = lnw <= 45 ? ['Excellent — hotel / studio grade', 'good'] : lnw <= 55 ? ['Good for dwellings', 'good'] : lnw <= 63 ? ['Marginal — footsteps audible', 'warn'] : ['Poor — every step is heard', 'bad'];
      out.innerHTML = A.statBox('Weighted impact level L<sub>n,w</sub>', fmt(lnw, 0) + ' dB', v[0], v[1]) + A.statBox('Improvement over the bare floor', fmt(bare - lnw, 0) + ' dB', 'ΔL<sub>w</sub> of this build-up') + A.statBox('Roughly, as an impact class', '≈ ' + fmt(110 - lnw, 0), 'higher is better on that scale') + A.statBox('Low-frequency thud (50–80 Hz)', fmt(thud, 0) + ' dB', 'outside the rating — but you hear it', thud > 65 ? 'bad' : thud > 55 ? 'warn' : 'good') + (s.f0 ? A.statBox('Floating-floor resonance', fmtHz(s.f0), s.f0 > 80 ? 'too high — softer layer or more mass' : 'good: below the footstep range', s.f0 > 80 ? 'bad' : 'good') : '');
      const t = [];
      if (st.base === 'timber') t.push('Lightweight timber floors can earn a decent rating and still annoy: the energy of a heel sits at 30–80 Hz, below where the rating looks. Only mass in the floor, a decoupled ceiling on soft hangers and a deep cavity with absorption deal with the thud.');
      if (st.cover === 'carpet') t.push('Carpet gives a spectacular number because it removes the high-frequency “click” of the hammer. It does little for bass thud and nothing for airborne sound — and the next tenant can replace it with tiles.');
      if (st.cover === 'vinyl' || st.cover === 'none') t.push('Hard finishes bonded to the structure put the full impact straight in. If the finish must be hard (kitchens, studios, gyms), it must float.');
      if ((st.cover === 'screed' || st.cover === 'deck') && s.f0 > 80) t.push('This resilient layer is too stiff for the mass on top of it. Above its resonance the floor isolates; near it, impact sound is amplified. Aim for a resonance below about 50 Hz for footsteps (and far lower for a studio floor).');
      if (st.cover === 'screed' || st.cover === 'deck') t.push('A floating floor fails at the edges: one screw through the deck, a skirting board touching both floor and wall, or screed leaking through a torn layer bridges it. Use an edge strip all round and inspect before pouring.');
      if (st.ceil) t.push('The ceiling only protects the room below; the vibration is still in the structure and will travel down the walls (flanking). Treating the source side — a floating floor above — is always the stronger move.');
      else if (lnw > 55) t.push('If you cannot touch the floor above (a neighbour’s flat), a heavy ceiling on resilient hangers with an absorbent cavity is the remaining option — expect 10–15 dB, less at the lowest frequencies.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     6. Bending waves and coincidence
     ====================================================================== */
  V.bendingWaves = function (host) {
    const MATS = Object.assign({ concrete: { name: 'Concrete', rho: 2300, E: 3.0e10, nu: 0.2 }, steel: { name: 'Steel sheet', rho: 7800, E: 2.1e11, nu: 0.3 }, alu: { name: 'Aluminium sheet', rho: 2700, E: 7.0e10, nu: 0.33 }, brick: { name: 'Brickwork', rho: 1900, E: 1.6e10, nu: 0.2 } }, P.PANELS);
    const keys = ['gypsum', 'plywood', 'mdf', 'glass', 'steel', 'alu', 'brick', 'concrete'].filter((k) => MATS[k]);
    const st = A.controls(host, [
      { key: 'mat', label: 'Plate material', type: 'select', value: 'gypsum', options: keys.map((k) => [k, MATS[k].name]) },
      { key: 'th', label: 'Thickness', type: 'range', min: 0, max: 2.4, step: 0.01, value: Math.log10(12.5), fmt: (v) => fmt(Math.pow(10, v), Math.pow(10, v) < 10 ? 1 : 0) + ' mm' },
      { key: 'fd', label: 'Driving frequency', type: 'range', min: 1.7, max: 4, step: 0.01, value: 3, fmt: (v) => fmtHz(Math.pow(10, v)) },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cB = (f, m, t) => { const B = (m.E * t * t * t) / (12 * (1 - m.nu * m.nu)); return Math.sqrt(TAU * f) * Math.pow(B / (m.rho * t), 0.25); };
    const cv = A.canvas(host, {
      height: 400, animate: true,
      caption: 'Top: a plate carrying a bending wave at the driving frequency, with the air above it. Below the critical frequency the ripples are shorter than the wavelength in air, neighbouring bumps cancel each other and little sound escapes. Above it, the ripples launch strong plane waves at an angle. Bottom: bending-wave speed against frequency; where it crosses the speed of sound in air is the critical frequency.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const py = 120, x0 = 16, x1 = w - 16, scale = (x1 - x0) / 6;            // 6 m of plate shown (clamped below)
        const lamB = A.clamp(R.lamB * scale, 14, (x1 - x0) * 1.5), lamA = A.clamp(R.lamA * scale, 14, (x1 - x0) * 2);
        const ph = t * 5;
        if (R.above) {
          const th = Math.asin(Math.min(1, R.c / R.cb)), nx = Math.sin(th), ny = -Math.cos(th);
          ctx.save(); ctx.beginPath(); ctx.rect(x0, 8, x1 - x0, py - 14); ctx.clip();
          ctx.strokeStyle = A.alpha(A.css('accent'), 0.55); ctx.lineWidth = 2;
          const adv = ((ph / TAU) % 1) * lamA;
          for (let k = -20; k < 30; k++) { const s = k * lamA + adv, cx = x0 + s * nx, cy = py + s * ny; ctx.beginPath(); ctx.moveTo(cx - 800 * ny, cy + 800 * nx); ctx.lineTo(cx + 800 * ny, cy - 800 * nx); ctx.stroke(); }
          ctx.restore();
          A.text(ctx, `strong radiation at ${fmt((th * 180) / Math.PI, 0)}° from the plate normal`, x0 + 4, 20, { size: 11, color: A.css('accent'), bg: A.css('panel') || undefined });
        } else {
          for (let x = x0; x < x1; x += 3) { const a = Math.cos((TAU * (x - x0)) / lamB - ph); const r = Math.abs(a) * 12 * R.sigma + Math.abs(a) * 5; ctx.fillStyle = A.alpha(a > 0 ? A.css('accent') : A.css('accent2'), 0.25); ctx.fillRect(x, py - 6 - r, 3, r); }
          A.text(ctx, 'bumps and hollows cancel — air just sloshes sideways', x0 + 4, 20, { size: 11, color: A.css('muted') });
        }
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 4; ctx.beginPath();
        for (let x = x0; x <= x1; x += 2) { const y = py + 6 * Math.sin((TAU * (x - x0)) / lamB - ph); if (x === x0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke();
        const m = MATS[st.mat], th = Math.pow(10, st.th) / 1000;
        const ax = A.axes(ctx, w, h, { pad: { t: 160 }, x: { min: 50, max: 10000, log: true, label: 'Frequency (Hz)' }, y: { min: 0, max: 1000, label: 'Wave speed (m/s)' } });
        const pts = []; for (let e = log10(50); e <= 4.001; e += 0.02) { const f = Math.pow(10, e); pts.push([f, cB(f, m, th)]); }
        seg(ctx, ax.x0, ax.Y(R.c), ax.x1, ax.Y(R.c), A.css('accent2'), 2, [6, 4]); A.text(ctx, 'sound in air 343 m/s', ax.x1 - 6, ax.Y(R.c) + 14, { size: 10, align: 'right', color: A.css('accent2') });
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.5);
        if (R.fc >= 50 && R.fc <= 10000) { seg(ctx, ax.X(R.fc), ax.y1, ax.X(R.fc), ax.y0, A.css('bad'), 1.2, [3, 3]); A.text(ctx, 'critical ' + fmtHz(R.fc), Math.min(ax.X(R.fc) + 4, ax.x1 - 90), ax.y1 + 12, { size: 10, color: A.css('bad'), weight: 700 }); }
        const fd = Math.pow(10, st.fd); dot(ctx, ax.X(fd), ax.Y(Math.min(1000, R.cb)), 5, A.css('text'));
      },
    });
    host.appendChild(tip);
    function upd() {
      const m = MATS[st.mat], th = Math.pow(10, st.th) / 1000, fd = Math.pow(10, st.fd), c = P.C;
      const fc = P.criticalFreq(m, th), cb = cB(fd, m, th), r = fd / fc;
      const sigma = r < 0.9 ? A.clamp(0.02 + 0.25 * r * r, 0.02, 0.4) : r < 1.3 ? 1.6 : 1;
      R = { fc, cb, c, lamB: cb / fd, lamA: c / fd, above: fd >= fc, sigma };
      out.innerHTML = A.statBox('Critical frequency', fmtHz(fc), 'bending speed = speed in air', fc > 300 && fc < 4000 ? 'warn' : 'good') + A.statBox('Bending-wave speed here', fmt(cb, 0) + ' m/s', 'rises with √frequency') + A.statBox('Ripple length in the plate', A.fmtLen(cb / fd), `in air: ${A.fmtLen(c / fd)}`) + A.statBox('Radiation', fd >= fc ? 'Efficient' : r > 0.5 ? 'Partial' : 'Weak', fd >= fc ? 'the plate is a loudspeaker' : 'acoustic short-circuit', fd >= fc ? 'bad' : r > 0.5 ? 'warn' : 'good') + A.statBox('Surface mass', fmt(m.rho * th, 1) + ' kg/m²');
      const t = [];
      if (fc > 300 && fc < 4000) t.push(`This plate’s critical frequency (${fmtHz(fc)}) sits in the middle of the range that matters for speech and music. Expect a dip in its sound insulation around there — the coincidence dip. Damping (laminated glass, damping compound between two boards) fills the dip in.`);
      if (fc >= 4000) t.push('Thin, limp sheets keep their critical frequency high, out of harm’s way — which is why two thin boards with damping between them beat one thick board of the same mass.');
      if (fc < 150) t.push('Thick, stiff structures (concrete, brick) have a very low critical frequency: they radiate efficiently across the whole audio band. Once vibration is in a concrete frame, every wall and slab re-radiates it — hence the need to stop it at the source.');
      t.push('Doubling the thickness halves the critical frequency. Stiffening a panel (ribs, thicker board) to “stop it vibrating” moves coincidence down into the useful range — mass and damping are safer tools than stiffness.');
      t.push('A machine bolted to a thin sheet-metal guard is loud because the sheet has a large area to push air. Perforating the sheet, damping it, or isolating the machine from it cures that at source.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     7. Machine isolation
     ====================================================================== */
  V.machineIsolation = function (host) {
    const st = A.controls(host, [
      { key: 'mass', label: 'Machine mass', type: 'range', min: 1.3, max: 3.7, step: 0.01, value: 2.3, fmt: (v) => fmt(Math.round(Math.pow(10, v) / 5) * 5, 0) + ' kg' },
      { key: 'rpm', label: 'Running speed', type: 'range', min: 240, max: 3600, step: 20, value: 1450, unit: 'rpm' },
      { key: 'defl', label: 'Static deflection of the mounts', type: 'range', min: 0.5, max: 50, step: 0.5, value: 6, unit: 'mm' },
      { key: 'kind', label: 'Mount type', type: 'select', value: '0.08', options: [['0.02', 'Steel springs (very little damping)'], ['0.08', 'Rubber / elastomer mounts'], ['0.15', 'Cork or dense pad']] },
      { key: 'base', label: 'Add a concrete inertia base (1.5 × machine mass)', type: 'check', value: false },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: the machine shaking on its mounts; the arrow under the floor shows how much of the shaking force gets through. Right: transmissibility against the ratio of running frequency to the mount’s natural frequency. Below a ratio of 1.4 the mounts make things worse; isolation only begins beyond it, and the marker shows where this installation sits.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const split = w > 520 ? 170 : 110, cx = split / 2, fy = h - 60;
        const vis = A.clamp(R.ff / 12, 0.6, 5), amp = (R.base ? 3 : 7) * A.clamp(R.T < 1 ? 1 : R.T, 1, 2.2), dy = amp * Math.sin(TAU * vis * t);
        seg(ctx, 8, fy, split - 8, fy, A.css('text'), 3);
        const mh = 46, bh = R.base ? 18 : 0, sy = fy - 34;
        [-1, 1].forEach((s) => { ctx.strokeStyle = A.css('warn'); ctx.lineWidth = 2; ctx.beginPath(); const xx = cx + s * 30; for (let k = 0; k <= 8; k++) { const yy = fy - (k / 8) * (34 - dy); ctx.lineTo(xx + (k % 2 ? 6 : -6) * (k > 0 && k < 8 ? 1 : 0), yy); } ctx.stroke(); });
        if (R.base) { ctx.fillStyle = A.alpha(A.css('muted'), 0.7); ctx.fillRect(cx - 46, sy - bh + dy, 92, bh); }
        ctx.fillStyle = A.alpha(A.css('accent'), 0.85); ctx.fillRect(cx - 36, sy - bh - mh + dy, 72, mh);
        const ang = TAU * vis * t; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, sy - bh - mh / 2 + dy, 12, 0, TAU); ctx.stroke(); dot(ctx, cx + 9 * Math.cos(ang), sy - bh - mh / 2 + dy + 9 * Math.sin(ang), 3, '#fff');
        const fl = A.clamp(R.T, 0.03, 2.5) * 16 * Math.abs(Math.sin(TAU * vis * t));
        const col = R.T < 0.2 ? A.css('good') : R.T < 1 ? A.css('warn') : A.css('bad');
        seg(ctx, cx, fy + 6, cx, fy + 6 + fl + 2, col, 4); A.text(ctx, 'force into floor', cx, h - 6, { size: 10, align: 'center', color: A.css('muted') });
        const ax = A.axes(ctx, w, h, { pad: { l: split + 46 }, x: { min: 0.2, max: 10, log: true, ticks: [0.2, 0.5, 1, 1.41, 2, 5, 10], fmt: (v) => String(v), label: 'Running frequency ÷ natural frequency' }, y: { min: -40, max: 25, label: 'Transmitted (dB)' } });
        const pts = []; for (let e = log10(0.2); e <= 1; e += 0.01) { const r = Math.pow(10, e); pts.push([r, 20 * log10(P.transmissibility(r, R.z))]); }
        ctx.fillStyle = A.alpha(A.css('bad'), 0.1); ctx.fillRect(ax.x0, ax.y1, ax.X(1.414) - ax.x0, ax.y0 - ax.y1);
        seg(ctx, ax.x0, ax.Y(0), ax.x1, ax.Y(0), A.css('muted'), 1, [4, 4]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.5);
        const rr = A.clamp(R.r, 0.2, 10); dot(ctx, ax.X(rr), ax.Y(A.clamp(20 * log10(R.T), -40, 25)), 6, col);
        A.text(ctx, 'amplifies', ax.x0 + 6, ax.y1 + 14, { size: 10, color: A.css('bad') }); A.text(ctx, 'isolates', ax.x1 - 6, ax.y1 + 14, { size: 10, align: 'right', color: A.css('good') });
      },
    });
    host.appendChild(tip);
    function upd() {
      const m = Math.round(Math.pow(10, st.mass) / 5) * 5, tot = m * (st.base ? 2.5 : 1), ff = st.rpm / 60, fn = P.staticDeflectionFn(st.defl), r = ff / fn, z = +st.kind, T = P.transmissibility(r, z);
      R = { ff, fn, r, T, z, base: st.base };
      const k = (tot * 9.81) / (st.defl / 1000);
      const eff = (1 - T) * 100;
      out.innerHTML = A.statBox('Forcing frequency', fmt(ff, 1) + ' Hz', st.rpm + ' rpm ÷ 60') + A.statBox('Mount natural frequency', fmt(fn, 1) + ' Hz', `from ${st.defl} mm deflection`) + A.statBox('Frequency ratio', fmt(r, 1), r < 1.41 ? 'below √2 — no isolation' : r < 3 ? 'aim for 3 or more' : 'good', r < 1.41 ? 'bad' : r < 3 ? 'warn' : 'good') + A.statBox('Isolation efficiency', T >= 1 ? 'Amplifies ×' + fmt(T, 1) : fmt(eff, 0) + ' %', T >= 1 ? 'worse than rigid bolting' : `${fmt(-20 * log10(T), 0)} dB less force`, T >= 1 ? 'bad' : eff > 90 ? 'good' : 'warn') + A.statBox('Total mount stiffness needed', fmt(k / 1000, 0) + ' kN/m', `carrying ${fmt(tot, 0)} kg` + (st.base ? ' incl. base' : ''));
      const t = [];
      if (r < 1.41) t.push('The mounts are too stiff for this speed: the machine runs at or below the mount resonance and the floor receives more force than if it were bolted down. Choose softer mounts with more static deflection.');
      else if (eff < 90) t.push('Some isolation, but for plant above or beside quiet rooms aim for 95 % or better (ratio above about 4–5). That means more static deflection: springs rather than pads.');
      else t.push('Good isolation on paper. Now protect it: every pipe, duct and cable conduit must have a flexible connection, or it bridges the mounts and carries the vibration straight past them.');
      if (st.rpm < 700 && st.defl < 20) t.push('Slow machines (large fans, cooling-tower drives, some compressors) need 25–50 mm of deflection — only steel springs provide that. Rubber pads are for fast, light equipment.');
      if (st.base) t.push('An inertia base does not improve the isolation percentage (if the mounts are re-selected for the same deflection). What it does is cut the machine’s own movement, lower the centre of gravity and keep belts and pipes aligned — essential for pumps and reciprocating compressors.');
      if (z < 0.05) t.push('Steel springs pass high-frequency noise along the coil; always sit them on a rubber or neoprene pad. They also bounce on start-up and run-down as the speed passes through resonance — use limit stops.');
      t.push('On a long-span or lightweight floor the floor itself deflects. The mounts must be several times softer than the floor (deflection of mounts ≫ deflection of the structure) or the isolation on paper never arrives.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     8. Audience and seat absorption
     ====================================================================== */
  V.audienceAbsorption = function (host) {
    const B = [125, 250, 500, 1000, 2000, 4000];
    const SEAT = {
      hard: ['Hard (wood / plastic)', [0.05, 0.06, 0.07, 0.08, 0.08, 0.08], [0.36, 0.50, 0.68, 0.82, 0.86, 0.82]],
      light: ['Lightly upholstered', [0.35, 0.45, 0.57, 0.61, 0.59, 0.55], [0.51, 0.64, 0.80, 0.90, 0.90, 0.85]],
      heavy: ['Heavily upholstered', [0.50, 0.66, 0.80, 0.88, 0.82, 0.70], [0.62, 0.76, 0.88, 0.96, 0.93, 0.85]],
    };
    const REST = [0.14, 0.12, 0.10, 0.09, 0.08, 0.07], M = [0, 0, 0.0006, 0.001, 0.00225, 0.006];
    const st = A.controls(host, [
      { key: 'vol', label: 'Hall volume', type: 'range', min: 3, max: 4.5, step: 0.01, value: Math.log10(9000), fmt: (v) => fmt(Math.round(Math.pow(10, v) / 100) * 100, 0) + ' m³' },
      { key: 'seats', label: 'Seats', type: 'range', min: 100, max: 2500, step: 50, value: 900 },
      { key: 'seat', label: 'Seat type', type: 'select', value: 'light', options: Object.entries(SEAT).map(([k, v]) => [k, v[0]]) },
      { key: 'occ', label: 'Occupancy tonight', type: 'range', min: 0, max: 100, step: 5, value: 60, unit: '%' },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    function rt(occ) {
      const Vm = Math.pow(10, st.vol), Sa = st.seats * 0.6, St = 6.3 * Math.pow(Vm, 2 / 3), Sr = Math.max(St - Sa, St * 0.4), s = SEAT[st.seat];
      return B.map((f, i) => P.sabineWithAir(Vm, Sr * REST[i] + Sa * (s[1][i] * (1 - occ) + s[2][i] * occ), M[i]));
    }
    const cv = A.canvas(host, {
      height: 290,
      caption: 'Reverberation time in each octave band for the empty hall (rehearsal), with tonight’s audience, and sold out. The closer the three curves lie, the less the hall changes between rehearsal and concert — which is the whole point of upholstered seats.',
      draw(ctx, w, h) {
        if (!R) return;
        const mx = Math.max(2.5, Math.ceil(Math.max(...R.e) * 2) / 2);
        const ax = A.axes(ctx, w, h, { x: { min: 100, max: 5000, log: true, ticks: B, fmt: octFmt, label: 'Octave band (Hz)' }, y: { min: 0, max: mx, label: 'Reverberation time (s)' } });
        A.plotFill(ctx, ax, B.map((f, i) => [f, R.e[i]]), A.alpha(A.css('accent2'), 0.12), 0);
        A.plotFill(ctx, ax, B.map((f, i) => [f, R.f[i]]), A.alpha(A.css('panel') || '#000', 0.6), 0);
        A.plotLine(ctx, ax, B.map((f, i) => [f, R.e[i]]), A.css('accent2'), 2, [6, 4]);
        A.plotLine(ctx, ax, B.map((f, i) => [f, R.f[i]]), A.css('good'), 2, [2, 3]);
        A.plotLine(ctx, ax, B.map((f, i) => [f, R.n[i]]), A.css('accent'), 3);
      },
    });
    host.appendChild(A.legend([[A.css('accent2'), 'empty', true], [A.css('accent'), 'tonight'], [A.css('good'), 'sold out', true]]));
    host.appendChild(tip);
    function upd() {
      R = { e: rt(0), n: rt(st.occ / 100), f: rt(1) };
      const mid = (a) => (a[2] + a[3]) / 2, Vm = Math.pow(10, st.vol), vps = Vm / st.seats, ch = mid(R.e) - mid(R.f);
      out.innerHTML = A.statBox('Mid-frequency RT, empty', fmt(mid(R.e), 2) + ' s') + A.statBox('Tonight', fmt(mid(R.n), 2) + ' s') + A.statBox('Sold out', fmt(mid(R.f), 2) + ' s') + A.statBox('Rehearsal → concert change', fmt(ch, 2) + ' s', ch < 0.2 ? 'stable — musicians can trust rehearsal' : ch < 0.5 ? 'noticeable' : 'a different hall every night', ch < 0.2 ? 'good' : ch < 0.5 ? 'warn' : 'bad') + A.statBox('Volume per seat', fmt(vps, 1) + ' m³', vps < 5 ? 'speech / cinema' : vps < 8 ? 'multipurpose, opera' : vps <= 12 ? 'symphonic' : 'very live — choral, organ');
      const t = [];
      if (st.seat === 'hard') t.push('With hard seats the audience is almost the only absorber: an empty rehearsal is boomy and washy, a full house is dry. Churches with pews and school halls with stacking chairs behave exactly like this.');
      if (st.seat === 'heavy') t.push('Heavily upholstered seats “pre-absorb” what the people will absorb later, so the hall barely changes with attendance. The price: they cap the reverberation you can ever reach, so concert halls choose seats that are just absorbent enough.');
      if (vps < 6 && mid(R.f) < 1.4) t.push('With so little volume per seat no finish can give a long reverberation — the audience soaks it up. Volume per seat is decided on day one by the ceiling height; it cannot be added later.');
      if (vps > 10) t.push('Plenty of volume per seat: this hall can carry symphonic reverberation. Speech will need a well-aimed loudspeaker system or deployable banners.');
      t.push('Absorption by an audience is counted per square metre of floor it covers (plus a strip around the edge), not per head: squeezing more people into the same seating block changes the reverberation very little.');
      t.push('Sound skimming low over rows of seats loses a band around 100–200 Hz (the “seat-dip”). Raked floors and strong ceiling and side-wall reflections, which arrive from above the heads, put that warmth back.');
      tips(tip, t); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     9. Curtains and drapes
     ====================================================================== */
  V.curtainAbsorber = function (host) {
    const FAB = { sheer: ['Sheer voile (≈ 80 g/m²)', 60], cotton: ['Light cotton (≈ 200 g/m²)', 160], serge: ['Wool serge / medium velour (≈ 500 g/m²)', 480], velour: ['Heavy velour (≈ 700 g/m²)', 850], lined: ['Lined blackout / coated (airtight)', 6000] };
    const st = A.controls(host, [
      { key: 'fab', label: 'Fabric', type: 'select', value: 'serge', options: Object.entries(FAB).map(([k, v]) => [k, v[0]]) },
      { key: 'full', label: 'Fullness (extra fabric gathered in folds)', type: 'range', min: 0, max: 200, step: 10, value: 100, unit: '%' },
      { key: 'gap', label: 'Distance from the wall', type: 'range', min: 0, max: 600, step: 10, value: 150, unit: 'mm' },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    function alphaAt(f, r, gapM, depthM) {
      let s = 0; const n = 14;
      for (let i = 0; i < n; i++) {
        const D = gapM + depthM * (i + 0.5) / n + 0.004;
        let a = 0; for (let j = -2; j <= 2; j++) { const ff = f * Math.pow(2, j / 9), kD = (TAU * ff / P.C) * D, sn = Math.sin(kD), ct = Math.abs(sn) < 1e-4 ? 1e4 : Math.cos(kD) / sn; a += (4 * r) / ((1 + r) * (1 + r) + ct * ct); }
        s += a / 5;
      }
      return A.clamp(s / n * 0.95 + 0.02, 0, 1);
    }
    const cv = A.canvas(host, {
      height: 310, animate: true,
      caption: 'Top: a plan view of the curtain and the wall behind it; air has to move through the cloth to be absorbed, and it moves most a quarter of a wavelength out from the wall. Bottom: the resulting absorption, compared with the same cloth hung flat against the wall.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const x0 = 20, x1 = w - 20, wy = 16, sc = 0.09, gy = wy + 8 + st.gap * sc, dep = R.depth * 1000 * sc;
        ctx.fillStyle = A.css('text'); ctx.fillRect(x0, wy, x1 - x0, 6);
        ctx.strokeStyle = A.css('c5'); ctx.lineWidth = st.fab === 'sheer' ? 1.2 : st.fab === 'velour' || st.fab === 'lined' ? 4 : 2.5; ctx.beginPath();
        const per = 34 / (1 + st.full / 100);
        for (let x = x0; x <= x1; x += 2) { const y = gy + dep * 0.5 * (1 + Math.sin((TAU * (x - x0)) / (per * 2.2))); if (x === x0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke();
        for (let k = 0; k < 4; k++) { const yy = 96 - ((t * 22 + k * 20) % 80); if (yy > gy + dep + 2) seg(ctx, x0 + 30, yy, x1 - 30, yy, A.alpha(A.css('accent'), 0.5), 1.5); else if (yy > wy + 8) seg(ctx, x0 + 30, yy, x1 - 30, yy, A.alpha(A.css('accent'), 0.5 * Math.max(0.1, 1 - R.avg)), 1.5); }
        if (w > 420) A.text(ctx, 'wall', x1 - 4, wy - 3, { size: 10, align: 'right', color: A.css('muted') });
        const ax = A.axes(ctx, w, h, { pad: { t: 108 }, x: { min: 63, max: 8000, log: true, ticks: OCT, fmt: octFmt, label: 'Frequency (Hz)' }, y: { min: 0, max: 1, label: 'Absorption coefficient' } });
        A.plotLine(ctx, ax, R.flat, A.css('muted'), 1.5, [5, 4]);
        A.plotFill(ctx, ax, R.pts, A.alpha(A.css('accent'), 0.15), 0); A.plotLine(ctx, ax, R.pts, A.css('accent'), 2.5);
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'as hung'], [A.css('muted'), 'same cloth flat on the wall', true]]));
    host.appendChild(tip);
    function upd() {
      const r = FAB[st.fab][1] / 413, gap = st.gap / 1000, depth = (st.full / 100) * 0.12;
      const fs = []; for (let e = log10(63); e <= log10(8000) + 0.001; e += 0.03) fs.push(Math.pow(10, e));
      const pts = fs.map((f) => [f, alphaAt(f, r, gap, depth)]), flat = fs.map((f) => [f, alphaAt(f, r, 0, 0)]);
      const at = (f) => alphaAt(f, r, gap, depth), avg = (at(250) + at(500) + at(1000) + at(2000)) / 4, Dm = gap + depth / 2 + 0.004, fq = P.C / (4 * Dm);
      R = { pts, flat, avg, depth };
      out.innerHTML = A.statBox('Average absorption 250 Hz–2 kHz', fmt(avg, 2), avg > 0.65 ? 'a real absorber' : avg > 0.35 ? 'useful' : 'mostly decoration', avg > 0.65 ? 'good' : avg > 0.35 ? 'warn' : 'bad') + A.statBox('At 125 Hz', fmt(at(125), 2), 'curtains do little for bass', at(125) > 0.4 ? 'good' : 'warn') + A.statBox('Works from about', fmtHz(fq), 'quarter-wave of the mean spacing') + A.statBox('Flow resistance of the cloth', fmt(r, 1) + ' × air', r < 0.5 ? 'too open' : r > 4 ? 'too tight' : 'near ideal (1–3 ×)', r < 0.5 || r > 4 ? 'bad' : 'good');
      const t = [];
      if (r < 0.5) t.push('This cloth is too open: sound passes straight through, bounces off the wall and comes back out. Test by blowing through it — a good acoustic fabric offers gentle resistance, like blowing through a thick sweater.');
      if (r > 4) t.push('An airtight lining turns the curtain into a limp membrane: sound reflects off it at mid and high frequencies. Blackout drapes block light, not reverberation — keep an unlined acoustic layer in front.');
      if (st.gap < 50 && st.full < 50) t.push('Flat against the wall, even the best fabric only absorbs the top octaves: the air there hardly moves, so there is nothing for the cloth to resist. Spacing and folds are free performance.');
      if (st.full >= 100) t.push('At 100 % fullness (twice as much cloth as track) the folds spread the cloth over a range of distances, smoothing out the dips you get from a flat sheet at a single spacing.');
      t.push(`To reach an octave lower, double the distance from the wall: at ${fmt(Dm * 2000, 0)} mm mean spacing this curtain would start working near ${fmtHz(fq / 2)}.`);
      t.push('Curtains on a track are the cheapest variable acoustics there is: drawn for speech, amplified music and mixing; open for acoustic ensembles. Hide them in a pocket when open, or they keep absorbing.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     10. Active bass trap
     ====================================================================== */
  V.activeTrap = function (host) {
    const st = A.controls(host, [
      { key: 'len', label: 'Room length', type: 'range', min: 3, max: 9, step: 0.1, value: 5.2, unit: 'm' },
      { key: 'mode', label: 'Mode along the length', type: 'select', numeric: true, value: 1, options: [[1, 'First (one half-wave)'], [2, 'Second'], [3, 'Third']] },
      { key: 'decay', label: 'Decay time of the mode, untreated', type: 'range', min: 0.3, max: 1.6, step: 0.05, value: 0.9, unit: 's' },
      { key: 'gain', label: 'Active trap gain', type: 'range', min: 0, max: 100, step: 5, value: 60, unit: '%' },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 400, animate: true,
      caption: 'The same room mode, struck by a short bass note and left to ring. Upper room: untreated. Lower room: a microphone at the end wall drives a loudspeaker that moves the way an absorbing wall would, draining the mode. The graph underneath shows both decays in decibels; the cursor follows the animation.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const per = 3.4, tau = t % per, x0 = 24, x1 = w - 24, n = st.mode;
        const env = (T) => (tau < 0.35 ? tau / 0.35 : Math.exp((-6.91 * (tau - 0.35)) / T));
        const room = (y, T, active) => {
          ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(x0, y - 34, x1 - x0, 68);
          const a = env(T) * 28 * Math.cos(TAU * 2.2 * t);
          ctx.fillStyle = A.alpha(active ? A.css('good') : A.css('accent'), 0.25); ctx.beginPath(); ctx.moveTo(x0, y);
          for (let x = x0; x <= x1; x += 3) ctx.lineTo(x, y - a * Math.cos((n * Math.PI * (x - x0)) / (x1 - x0)));
          ctx.lineTo(x1, y); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = active ? A.css('good') : A.css('accent'); ctx.lineWidth = 2.5; ctx.beginPath();
          for (let x = x0; x <= x1; x += 3) { const yy = y - a * Math.cos((n * Math.PI * (x - x0)) / (x1 - x0)); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke();
          A.text(ctx, active ? 'with active trap' : 'untreated', x0 + 6, y - 22, { size: 10, color: A.css('muted') });
          if (active) { const k = st.gain / 100, cx = x1 - 12; ctx.fillStyle = A.css('text'); ctx.fillRect(cx - 2, y - 14, 12, 28); const push = k * 5 * env(T) * Math.cos(TAU * 2.2 * t + 1.2); ctx.fillStyle = A.css('good'); ctx.beginPath(); ctx.moveTo(cx - 2, y - 8); ctx.lineTo(cx - 10 - push, y - 14); ctx.lineTo(cx - 10 - push, y + 14); ctx.lineTo(cx - 2, y + 8); ctx.closePath(); ctx.fill(); dot(ctx, cx - 22, y - 24, 3, A.css('bad')); if (w > 430) A.text(ctx, 'mic', cx - 28, y - 21, { size: 9, align: 'right', color: A.css('muted') }); }
        };
        room(52, R.T0, false); room(140, R.T1, true);
        const ax = A.axes(ctx, w, h, { pad: { t: 196 }, x: { min: 0, max: 2.4, fmt: (v) => v + ' s', label: 'Time after the note stops' }, y: { min: -60, max: 0, label: 'Level (dB)' } });
        A.plotLine(ctx, ax, [[0, 0], [2.4, (-60 * 2.4) / R.T0]], A.css('accent'), 2.5); A.plotLine(ctx, ax, [[0, 0], [2.4, (-60 * 2.4) / R.T1]], A.css('good'), 2.5);
        if (tau > 0.35) { const x = ax.X(Math.min(2.4, tau - 0.35)); seg(ctx, x, ax.y1, x, ax.y0, A.css('text'), 1, [3, 3]); }
      },
    });
    host.appendChild(tip);
    function upd() {
      const f = (st.mode * P.C) / (2 * st.len), k = st.gain / 100, T1 = st.decay / (1 + 7 * k), lam = P.C / f;
      R = { T0: st.decay, T1 };
      const red = 20 * log10(1 + 7 * k) * 0.75;
      out.innerHTML = A.statBox('Mode frequency', fmtHz(f), `${st.mode} half-wave${st.mode > 1 ? 's' : ''} in ${fmt(st.len, 1)} m`) + A.statBox('Decay, untreated', fmt(st.decay, 2) + ' s', st.decay > 0.6 ? 'boomy, notes smear' : 'acceptable', st.decay > 0.6 ? 'bad' : 'warn') + A.statBox('Decay with the active trap', fmt(T1, 2) + ' s', T1 < 0.35 ? 'tight' : T1 < 0.6 ? 'better' : 'still long', T1 < 0.35 ? 'good' : T1 < 0.6 ? 'warn' : 'bad') + A.statBox('Peak at resonance', '−' + fmt(red, 0) + ' dB', 'the hump in the response flattens') + A.statBox('Passive trap of equal effect', '≈ ' + A.fmtLen(lam / 8) + ' deep', 'porous, across the whole end wall');
      const t = [];
      if (k < 0.2) t.push('At low gain the unit hardly loads the mode. Raise the gain and the loudspeaker cone “gives way” to the pressure like a soft wall, turning the mode’s energy into heat in the amplifier and driver.');
      else if (k > 0.85) t.push('Very high loop gain is where active systems become unstable: the microphone hears the loudspeaker, phase shifts add up and the unit can ring or howl at some other frequency. Commercial units limit gain and bandwidth for this reason.');
      else t.push('This is damping, not cancelling: the unit works for every listener in the room because it attacks the resonance itself. Compare that with “anti-noise” aimed at one point, which only creates a quiet zone about a tenth of a wavelength across.');
      t.push(`It must sit where the mode has high pressure — a wall or corner at the end of the dimension concerned. In the pressure null (${st.mode === 1 ? 'mid-room' : 'a node line'}) it can do nothing, exactly like a passive pressure trap.`);
      t.push('Active traps make sense from roughly 20 to 120 Hz, where passive absorbers would need to be a metre deep. Above that, ordinary porous absorbers are cheaper, wider-band and cannot fail.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     11. Coiled-channel ("metamaterial") absorber
     ====================================================================== */
  V.metaAbsorber = function (host) {
    const st = A.controls(host, [
      { key: 'th', label: 'Panel thickness available', type: 'range', min: 30, max: 250, step: 5, value: 100, unit: 'mm' },
      { key: 'side', label: 'Length of each pass (panel width)', type: 'range', min: 200, max: 1200, step: 20, value: 600, unit: 'mm' },
      { key: 'ch', label: 'Channel width', type: 'range', min: 3, max: 40, step: 1, value: 12, unit: 'mm' },
      { key: 'folds', label: 'Number of passes (folds)', type: 'range', min: 1, max: 14, step: 1, value: 5, fmt: (v) => String(v) },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 360, animate: true,
      caption: 'Top: a section through the panel. Sound enters the mouth at the face and has to travel the whole folded channel to the closed end and back — the panel behaves like a quarter-wave tube many times longer than it is thick. Bottom: the absorption that results: strong, but only in a narrow band around the tuned frequency (and weaker ones at 3× and 5×).',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const x0 = 24, x1 = w - 24, y0 = 26, H = 96, n = R.n, rowH = H / n;
        ctx.fillStyle = A.alpha(A.css('muted'), 0.18); ctx.fillRect(x0, y0, x1 - x0, H); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(x0, y0, x1 - x0, H);
        for (let i = 1; i < n; i++) { const y = y0 + i * rowH; if (i % 2) seg(ctx, x0, y, x1 - 14, y, A.css('text'), 1.5); else seg(ctx, x0 + 14, y, x1, y, A.css('text'), 1.5); }
        // mouth at top-left (face is the top edge)
        ctx.clearRect(x0 + 2, y0 - 2, 12, 4); A.text(ctx, 'mouth', x0 + 8, y0 - 6, { size: 10, align: 'center', color: A.css('accent') });
        A.text(ctx, 'face of the panel', (x0 + x1) / 2, y0 - 6, { size: 10, align: 'center', color: A.css('muted') });
        const total = n * (x1 - x0), tri = (u) => (u < 1 ? u : 2 - u), s = tri((t * 0.35) % 2) * total;
        const row = Math.min(n - 1, Math.floor(s / (x1 - x0))), fr = s / (x1 - x0) - row, px = row % 2 ? x1 - 8 - fr * (x1 - x0 - 16) : x0 + 8 + fr * (x1 - x0 - 16), py = y0 + (row + 0.5) * rowH;
        dot(ctx, px, py, Math.min(6, rowH * 0.4), A.css('accent'));
        A.text(ctx, 'closed end', n % 2 ? x1 - 6 : x0 + 6, y0 + H + 12, { size: 10, align: n % 2 ? 'right' : 'left', color: A.css('muted') });
        const ax = A.axes(ctx, w, h, { pad: { t: 158 }, x: { min: 20, max: 2000, log: true, label: 'Frequency (Hz)' }, y: { min: 0, max: 1, label: 'Absorption coefficient' } });
        A.plotLine(ctx, ax, R.por, A.css('muted'), 1.5, [5, 4]);
        A.plotFill(ctx, ax, R.pts, A.alpha(A.css('accent'), 0.18), 0); A.plotLine(ctx, ax, R.pts, A.css('accent'), 2.5);
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'coiled channel'], [A.css('muted'), 'mineral wool of the same thickness', true]]));
    host.appendChild(tip);
    function upd() {
      const wall = 3, maxN = Math.max(1, Math.floor((st.th - wall) / (st.ch + wall))), n = Math.min(st.folds, maxN);
      const path = (n * st.side) / 1000 + 0.6 * st.ch / 1000, f0 = P.C / (4 * path);
      const dv = Math.sqrt(1.5e-5 / (Math.PI * f0)) * 1.47, Qi = (st.ch / 2000) / dv, Qr = 14, x = Qr / Qi, pk = (4 * x) / ((1 + x) * (1 + x)), Q = (Qi * Qr) / (Qi + Qr);
      const pts = [], por = [];
      for (let e = log10(20); e <= log10(2000) + 0.001; e += 0.008) {
        const f = Math.pow(10, e); let a = 0;
        [1, 3, 5].forEach((m, i) => { const fm = f0 * m, qq = Q * (1 + 0.4 * i); a = Math.max(a, (pk * (1 - 0.15 * i)) / (1 + Math.pow((2 * qq * (f - fm)) / fm, 2))); });
        pts.push([f, a]); por.push([f, A.clamp(P.porousAlpha(f, 12000, st.th / 1000, 0, true), 0, 1)]);
      }
      R = { n, pts, por };
      const lam = P.C / f0;
      out.innerHTML = A.statBox('Folded path length', A.fmtLen(path), `${n} pass${n > 1 ? 'es' : ''}` + (n < st.folds ? ` — only ${maxN} fit` : ''), n < st.folds ? 'warn' : '') + A.statBox('Tuned frequency', fmtHz(f0), 'c ÷ (4 × path)') + A.statBox('Panel thickness vs wavelength', 'λ / ' + fmt(lam / (st.th / 1000), 0), lam / (st.th / 1000) > 20 ? 'deeply sub-wavelength' : 'modest', lam / (st.th / 1000) > 20 ? 'good' : '') + A.statBox('Peak absorption', fmt(pk, 2), x > 3 ? 'channel too wide: under-damped' : x < 0.33 ? 'channel too narrow: over-damped' : 'well matched', pk > 0.8 ? 'good' : 'warn') + A.statBox('Useful bandwidth', '≈ ' + fmt(f0 / Q, 0) + ' Hz', `only ±${fmt(50 / Q, 0)} % around the tuning`, 'warn');
      const t = [];
      if (n < st.folds) t.push(`Only ${maxN} passes of this channel width fit in a ${st.th} mm panel. Narrow the channel or accept a higher tuning.`);
      if (x < 0.33) t.push('The channel is so narrow that friction at its walls stops the sound getting in: the mouth looks almost like a hard surface. Widen the channel.');
      if (x > 3) t.push('The channel is wide and nearly loss-free: it resonates strongly but reflects most of the energy back out. Add resistance — a fine mesh or thin felt over the mouth — to match it to the air.');
      t.push(`A porous absorber needs roughly a tenth of a wavelength — about ${A.fmtLen(lam / 10)} — to be useful at ${fmtHz(f0)}. The coiled panel does it in ${st.th} mm. That is the whole attraction.`);
      t.push('The catch is the bandwidth: one channel treats one narrow band, like a tuned resonator. Practical panels pack many channels of different lengths side by side, and each one then only has a fraction of the face area.');
      t.push('Treat such panels like any tuned trap: measure the room first, tune to the measured problem, and place them at a pressure maximum of that mode. Ask for independent test data — a narrow-band peak can be made to look impressive on a brochure.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     12. Image sources
     ====================================================================== */
  V.imageSources = function (host) {
    const ROOMS = { a: [8, 5, 'Rectangle 8 × 5 m'], b: [5, 5, 'Square 5 × 5 m'], c: [14, 4, 'Long room 14 × 4 m'] };
    const st = A.controls(host, [
      { key: 'room', label: 'Room (plan view)', type: 'select', value: 'a', options: Object.entries(ROOMS).map(([k, v]) => [k, v[2]]) },
      { key: 'order', label: 'Highest reflection order', type: 'range', min: 0, max: 4, step: 1, value: 2, fmt: (v) => (v === 0 ? 'direct sound only' : String(v)) },
      { key: 'alpha', label: 'Wall absorption', type: 'range', min: 0.02, max: 0.9, step: 0.02, value: 0.2, fmt: (v) => fmt(v, 2) },
      { key: 'pick', label: 'Highlight one arrival', type: 'range', min: 0, max: 1, step: 0.005, value: 0.12, fmt: () => '' },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 460, animate: true,
      caption: 'Top: the real room (bold outline) surrounded by its mirror images. Every dot is a mirror-image source; a straight line from an image to the listener has exactly the length and direction of one reflection path, which is drawn folded back inside the room. The expanding arcs are the true wavefronts. Bottom: the echogram — each stem is one arrival, later and weaker the further away its image lies.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const { Lx, Ly, sx, sy, rx, ry, list, tmax } = R, N = Math.max(1, st.order);
        const top = 8, ph = 250, wx0 = -N * Lx, wx1 = (N + 1) * Lx, wy0 = -N * Ly, wy1 = (N + 1) * Ly;
        const sc = Math.min((w - 16) / (wx1 - wx0), (ph - 8) / (wy1 - wy0)), ox = (w - (wx1 - wx0) * sc) / 2, oy = top + (ph - (wy1 - wy0) * sc) / 2;
        const X = (x) => ox + (x - wx0) * sc, Y = (y) => oy + (y - wy0) * sc;
        ctx.lineWidth = 1; ctx.strokeStyle = A.alpha(A.css('muted'), 0.5);
        for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) if (Math.abs(i) + Math.abs(j) <= st.order && (i || j)) ctx.strokeRect(X(i * Lx), Y(j * Ly), Lx * sc, Ly * sc);
        const tau = (t * 0.28) % 1 * tmax;
        ctx.save(); ctx.beginPath(); ctx.rect(X(0), Y(0), Lx * sc, Ly * sc); ctx.clip();
        ctx.fillStyle = A.alpha(A.css('accent'), 0.06); ctx.fillRect(X(0), Y(0), Lx * sc, Ly * sc);
        list.forEach((im) => { const rad = tau * P.C * sc; ctx.strokeStyle = A.alpha(A.css('accent'), Math.max(0.08, 0.75 * Math.pow(1 - st.alpha, im.ord) / (1 + tau * 30))); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(im.x), Y(im.y), rad, 0, TAU); ctx.stroke(); });
        ctx.restore();
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2.5; ctx.strokeRect(X(0), Y(0), Lx * sc, Ly * sc);
        list.forEach((im) => { if (im.ord) dot(ctx, X(im.x), Y(im.y), 3, A.alpha(A.series(im.ord), 0.9)); });
        const sel = list[R.sel];
        if (sel && sel.ord) {
          seg(ctx, X(sel.x), Y(sel.y), X(rx), Y(ry), A.css('accent2'), 1.2, [4, 4]);
          const fold = (v, L) => { const m = ((v % (2 * L)) + 2 * L) % (2 * L); return m > L ? 2 * L - m : m; };
          ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2.5; ctx.beginPath();
          for (let k = 0; k <= 240; k++) { const u = k / 240, px = fold(sel.x + (rx - sel.x) * u, Lx), py = fold(sel.y + (ry - sel.y) * u, Ly); if (!k) ctx.moveTo(X(px), Y(py)); else ctx.lineTo(X(px), Y(py)); } ctx.stroke();
          dot(ctx, X(sel.x), Y(sel.y), 5, A.css('accent2'));
        }
        dot(ctx, X(sx), Y(sy), 5, A.css('accent')); dot(ctx, X(rx), Y(ry), 5, A.css('good'));
        // echogram
        const ax = A.axes(ctx, w, h, { pad: { t: ph + 22 }, x: { min: 0, max: tmax * 1000, fmt: (v) => v + ' ms', label: 'Arrival time' }, y: { min: -40, max: 3, label: 'Level re direct (dB)' } });
        list.forEach((im, i) => { const x = ax.X(im.t * 1000), y = ax.Y(Math.max(-40, im.lev)); seg(ctx, x, ax.y0, x, y, i === R.sel ? A.css('accent2') : A.alpha(A.series(im.ord), 0.9), i === R.sel ? 3.5 : 2); });
        seg(ctx, ax.X(tau * 1000), ax.y1, ax.X(tau * 1000), ax.y0, A.css('text'), 1, [3, 3]);
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'source'], [A.css('good'), 'listener'], [A.css('accent2'), 'highlighted reflection'], [A.series(1), '1st order'], [A.series(2), '2nd'], [A.series(3), '3rd'], [A.series(4), '4th']]));
    host.appendChild(tip);
    function upd() {
      const [Lx, Ly] = ROOMS[st.room], sx = Lx * 0.24, sy = Ly * 0.34, rx = Lx * 0.72, ry = Ly * 0.62, N = st.order, list = [];
      for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) {
        const ord = Math.abs(i) + Math.abs(j); if (ord > N) continue;
        const x = i % 2 ? i * Lx + (Lx - sx) : i * Lx + sx, y = j % 2 ? j * Ly + (Ly - sy) : j * Ly + sy;
        list.push({ x, y, ord, d: Math.hypot(x - rx, y - ry) });
      }
      list.sort((a, b) => a.d - b.d);
      const d0 = list[0].d;
      list.forEach((im) => { im.t = im.d / P.C; im.lev = -20 * log10(im.d / d0) + im.ord * 10 * log10(1 - st.alpha); });
      const sel = Math.min(list.length - 1, Math.round(st.pick * (list.length - 1)));
      R = { Lx, Ly, sx, sy, rx, ry, list, sel, tmax: list[list.length - 1].t * 1.08 + 0.004 };
      const im = list[sel], n3 = ((2 * N + 1) * (2 * N * N + 2 * N + 3)) / 3;
      const aud = list.filter((x) => x.lev > -20).length;
      out.innerHTML = A.statBox('Image sources in this plan', String(list.length), `a real 3-D box needs ${fmt(n3, 0)}`) + A.statBox('Highlighted arrival', im.ord ? `order ${im.ord}` : 'direct sound', `#${sel + 1} of ${list.length}`) + A.statBox('Delay after the direct sound', fmt((im.t - list[0].t) * 1000, 1) + ' ms', `path ${A.fmtLen(im.d)}`) + A.statBox('Level', fmt(im.lev, 1) + ' dB', 're the direct sound', im.lev > -10 && im.ord ? 'warn' : '') + A.statBox('Arrivals within 20 dB of direct', String(aud), 'the ones you can really hear');
      const t = [];
      if (N === 0) t.push('Order zero is the free field: only the direct sound. Raise the order to add reflections one “generation” at a time.');
      if (N >= 3) t.push(`The number of images grows roughly with the cube of the order in a real room — ${fmt(n3, 0)} at order ${N}, tens of thousands by order 20. That is why programs use image sources only for the first few orders and switch to ray tracing for the rest.`);
      if (st.alpha < 0.1) t.push('With hard walls the higher orders are nearly as strong as the first: the echogram is dense and slow to die — a reverberant room.');
      if (st.alpha > 0.5) t.push('With absorbent walls each bounce costs several decibels: after two orders the arrivals are too weak to matter. This is why a treated control room can be designed almost entirely from first-order reflections.');
      if (st.room === 'b') t.push('In the square room many images are at identical distances: reflections arrive in bunches at the same instant. That coincidence in time is the geometric face of the same problem that stacks room modes at the same frequency.');
      t.push('Drag the highlight slider through the list: the first few arrivals after the direct sound are your first-reflection points — the places where absorption or diffusion is worth the most.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     13. Ray tracer
     ====================================================================== */
  V.rayTracer = function (host) {
    const SHAPES = {
      rect: ['Rectangle', [[0, 0, 12, 0, 'side'], [12, 0, 12, 7, 'end'], [12, 7, 0, 7, 'side'], [0, 7, 0, 0, 'end']], [2, 3]],
      fan: ['Fan (splayed side walls)', [[0, 2.2, 12, 0, 'side'], [12, 0, 12, 7, 'end'], [12, 7, 0, 4.8, 'side'], [0, 4.8, 0, 2.2, 'end']], [1.2, 3.5]],
      balc: ['Rectangle with a balcony', [[0, 0, 12, 0, 'side'], [12, 0, 12, 7, 'end'], [12, 7, 0, 7, 'side'], [0, 7, 0, 0, 'end'], [8, 3.4, 12, 3.4, 'side']], [2, 5.4]],
    };
    const st = A.controls(host, [
      { key: 'shape', label: 'Room shape (section)', type: 'select', value: 'rect', options: Object.entries(SHAPES).map(([k, v]) => [k, v[0]]) },
      { key: 'where', label: 'Where the absorption is', type: 'select', value: 'ends', options: [['ends', 'Only on the two end walls'], ['all', 'Spread evenly over every surface']] },
      { key: 'alpha', label: 'Absorption of the treated surfaces', type: 'range', min: 0.1, max: 0.95, step: 0.05, value: 0.7, fmt: (v) => fmt(v, 2) },
      { key: 'scat', label: 'Scattering coefficient', type: 'range', min: 0, max: 1, step: 0.05, value: 0.05, fmt: (v) => fmt(v, 2) + (v < 0.1 ? ' (mirror-like)' : v > 0.6 ? ' (diffusing)' : '') },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null, rays = [], simT = 0;
    const HARD = 0.04, SPEED = 343;
    const alphaOf = (kind) => (st.where === 'all' ? st.alpha * 0.45 : kind === 'end' ? st.alpha : HARD);
    function hit(segs, x, y, dx, dy) {
      let best = null;
      for (const s of segs) {
        const ex = s[2] - s[0], ey = s[3] - s[1], den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
        const u = ((s[0] - x) * ey - (s[1] - y) * ex) / den, v = ((s[0] - x) * dy - (s[1] - y) * dx) / den;
        if (u > 1e-6 && v >= 0 && v <= 1 && (!best || u < best.u)) best = { u, s };
      }
      return best;
    }
    function bounce(ray, s, rnd) {
      const ex = s[2] - s[0], ey = s[3] - s[1], L = Math.hypot(ex, ey); let nx = -ey / L, ny = ex / L;
      if (nx * ray.dx + ny * ray.dy > 0) { nx = -nx; ny = -ny; }
      ray.e *= 1 - alphaOf(s[4]);
      if (rnd() < st.scat) { const sn = rnd() * 2 - 1, cs = Math.sqrt(1 - sn * sn), tx = -ny, ty = nx; ray.dx = nx * cs + tx * sn; ray.dy = ny * cs + ty * sn; }
      else { const d = 2 * (ray.dx * nx + ray.dy * ny); ray.dx -= d * nx; ray.dy -= d * ny; }
    }
    function simulate() {
      const [, segs, src] = SHAPES[st.shape], rnd = rng(11), NB = 400, dtb = 0.005, E = new Float64Array(NB), NR = 500;
      for (let k = 0; k < NR; k++) {
        const a = (TAU * (k + 0.37)) / NR, ray = { x: src[0], y: src[1], dx: Math.cos(a), dy: Math.sin(a), e: 1 }; let time = 0;
        for (let b = 0; b < 2000 && ray.e > 1e-7 && time < NB * dtb; b++) {
          const h = hit(segs, ray.x, ray.y, ray.dx, ray.dy); if (!h) break;
          const t1 = time + h.u / SPEED;
          for (let i = Math.floor(time / dtb); i <= Math.min(NB - 1, Math.floor(t1 / dtb)); i++) E[i] += ray.e;
          ray.x += ray.dx * h.u; ray.y += ray.dy * h.u; time = t1; bounce(ray, h.s, rnd);
        }
      }
      const pts = []; for (let i = 0; i < NB; i++) pts.push([i * dtb, E[i] > 0 ? 10 * log10(E[i] / E[0]) : -90]);
      const cross = (lv) => { for (const p of pts) if (p[1] <= lv) return p[0]; return NB * dtb; };
      const t5 = cross(-5), t25 = cross(-25), t45 = cross(-45);
      let area = 0, per = 0, wa = 0; const poly = segs.slice(0, 4);
      poly.forEach((s) => { area += (s[0] * s[3] - s[2] * s[1]) / 2; });
      segs.forEach((s) => { const L = Math.hypot(s[2] - s[0], s[3] - s[1]) * (segs.indexOf(s) > 3 ? 2 : 1); per += L; wa += L * alphaOf(s[4]); });
      const mfp = (Math.PI * Math.abs(area)) / per, ab = wa / per, Td = (13.82 * mfp) / (SPEED * -Math.log(1 - ab));
      return { pts, early: 3 * (t25 - t5), late: 3 * (t45 - t25), Td, segs, src };
    }
    function reset() { rays = []; simT = 0; const src = R.src; for (let k = 0; k < 70; k++) { const a = (TAU * (k + 0.5)) / 70; rays.push({ x: src[0], y: src[1], dx: Math.cos(a), dy: Math.sin(a), e: 1, tr: [] }); } }
    const cv = A.canvas(host, {
      height: 470, animate: true,
      caption: 'Top: rays leaving the source in slow motion, fading as each bounce costs them energy; treated surfaces are drawn thicker. Bottom: the energy remaining in the room against time, compared with the straight line that classic diffuse-field theory predicts. With mirror-like walls and absorption in only one direction, rays that never meet the absorber keep ringing and the decay sags into two slopes; scattering mixes the rays and straightens it.',
      draw(ctx, w, h, t, dt) {
        if (!R) return;
        const top = 10, ph = 215, sc = Math.min((w - 24) / 12, ph / 7), ox = (w - 12 * sc) / 2, oy = top + (ph - 7 * sc) / 2;
        const X = (x) => ox + x * sc, Y = (y) => oy + y * sc;
        R.segs.forEach((s) => { const a = alphaOf(s[4]); seg(ctx, X(s[0]), Y(s[1]), X(s[2]), Y(s[3]), a > 0.2 ? A.css('c4') : A.css('text'), a > 0.2 ? 6 : 2.5); });
        // advance
        const slow = 0.02, step = Math.min(0.05, dt || 0.016) * SPEED * slow; simT += Math.min(0.05, dt || 0.016) * slow;
        if (simT > 1.1) reset();
        for (const ray of rays) {
          let rem = step, guard = 0;
          while (rem > 1e-9 && guard++ < 8 && ray.e > 2e-4) { const hh = hit(R.segs, ray.x, ray.y, ray.dx, ray.dy); if (!hh) { ray.e = 0; break; } if (hh.u <= rem) { ray.x += ray.dx * hh.u; ray.y += ray.dy * hh.u; rem -= hh.u; bounce(ray, hh.s, Math.random); ray.tr.push([ray.x, ray.y]); } else { ray.x += ray.dx * rem; ray.y += ray.dy * rem; rem = 0; } }
          ray.tr.push([ray.x, ray.y]); if (ray.tr.length > 7) ray.tr.splice(0, ray.tr.length - 7);
          if (ray.e <= 2e-4) continue;
          const al = A.clamp(0.25 + 0.75 * (1 + log10(ray.e) / 3.7), 0.05, 1);
          ctx.strokeStyle = A.alpha(A.css('accent'), al * 0.8); ctx.lineWidth = 1.3; ctx.beginPath(); ray.tr.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.stroke();
          dot(ctx, X(ray.x), Y(ray.y), 2, A.alpha(A.css('accent'), al));
        }
        dot(ctx, X(R.src[0]), Y(R.src[1]), 5, A.css('accent2'));
        const tm = Math.min(2, Math.max(0.4, Math.ceil(Math.max(R.Td, R.late) * 1.2 * 5) / 5));
        const ax = A.axes(ctx, w, h, { pad: { t: ph + 34 }, x: { min: 0, max: tm, fmt: (v) => fmt(v, 1) + ' s', label: 'Time' }, y: { min: -60, max: 0, label: 'Energy (dB)' } });
        A.plotLine(ctx, ax, [[0, 0], [tm, (-60 * tm) / R.Td]], A.css('muted'), 1.5, [6, 4]);
        A.plotLine(ctx, ax, R.pts, A.css('accent'), 2.5);
        if (simT < tm) seg(ctx, ax.X(simT), ax.y1, ax.X(simT), ax.y0, A.css('text'), 1, [3, 3]);
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'traced decay'], [A.css('muted'), 'diffuse-field formula', true], [A.css('c4'), 'treated surface']]));
    host.appendChild(tip);
    function upd() {
      R = simulate(); reset();
      const ratio = R.late / Math.max(0.01, R.early);
      out.innerHTML = A.statBox('Formula (assumes a diffuse field)', fmt(R.Td, 2) + ' s') + A.statBox('Traced — early part of the decay', fmt(R.early, 2) + ' s', 'what you perceive on running music') + A.statBox('Traced — late part', fmt(R.late, 2) + ' s', ratio > 1.4 ? 'much slower: a lingering tail' : 'matches the early part', ratio > 1.4 ? 'bad' : 'good') + A.statBox('Decay shape', ratio > 1.4 ? 'Double slope' : 'Straight', ratio > 1.4 ? 'the formula is misleading here' : 'the formula can be trusted', ratio > 1.4 ? 'warn' : 'good');
      const t = [];
      if (ratio > 1.4) t.push('Two slopes: rays bouncing between the untreated surfaces never visit the absorber, so they outlive everything else. In a real room this is the flutter or “zing” left over when only the ends (or only the ceiling) are treated. Raise the scattering — or spread the absorption — and watch it disappear.');
      else if (st.scat > 0.3) t.push('With enough scattering the rays forget where they came from within a few bounces; every ray meets the absorber its fair share and the decay is a straight line, as the simple formula assumes.');
      else t.push('Evenly spread absorption gives a healthy decay even with mirror-like walls, because no direction is spared.');
      if (st.scat < 0.1) t.push('A model run with zero scattering is the most common beginner’s error in room simulation: it predicts decays far longer (or stranger) than the real room, where furniture, mouldings and people scatter sound. Typical values are 0.05–0.1 for large flat plaster, 0.3–0.5 for furnished or modulated surfaces, 0.7 for audience.');
      if (st.shape === 'fan') t.push('The splayed walls steer rays towards the wide end. Geometry alone redistributes sound — useful for avoiding flutter, but notice it also sends less energy sideways across the audience.');
      if (st.shape === 'balc') t.push('Watch the pocket under the balcony: few rays find their way in, and those that do lose energy quickly. Under-balcony seats are quieter and drier than the main floor — a classic finding of ray models.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     14. Auralisation
     ====================================================================== */
  V.auralise = function (host) {
    const ROOMS = { booth: ['Vocal booth (12 m³)', 2.0, 2.4, 2.5], living: ['Living room (60 m³)', 5.2, 4.4, 2.6], class: ['Classroom (200 m³)', 9, 7, 3.2], hall: ['Recital hall (3 000 m³)', 25, 15, 8], church: ['Stone church (12 000 m³)', 40, 20, 15] };
    const st = A.controls(host, [
      { key: 'room', label: 'Room', type: 'select', value: 'class', options: Object.entries(ROOMS).map(([k, v]) => [k, v[0]]) },
      { key: 'alpha', label: 'Average absorption', type: 'range', min: 0.03, max: 0.7, step: 0.01, value: 0.12, fmt: (v) => fmt(v, 2) + (v < 0.08 ? ' (bare, hard)' : v < 0.2 ? ' (lightly furnished)' : v < 0.4 ? ' (treated)' : ' (very dead)') },
      { key: 'scat', label: 'Scattering', type: 'range', min: 0, max: 1, step: 0.05, value: 0.4, fmt: (v) => fmt(v, 2) + (v < 0.15 ? ' (flat parallel walls)' : v > 0.6 ? ' (diffusing)' : '') },
      { key: 'sig', label: 'Dry test signal', type: 'select', value: 'speech', options: [['speech', 'Speech-like syllables'], ['click', 'Hand-clap clicks'], ['burst', 'Noise bursts (snare-like)']] },
    ], () => upd());
    const row = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' } });
    const bD = el('button', { html: A.icon('play') + ' Dry (no room)' }), bW = el('button', { class: 'primary', html: A.icon('play') + ' In this room' }), bS = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(bD, bW, bS); host.appendChild(row);
    const out = stats(host), tip = el('div');
    let R = null, lastOut = null;
    function geom() { const [, Lx, Ly, Lz] = ROOMS[st.room], Vm = Lx * Ly * Lz, S = 2 * (Lx * Ly + Lx * Lz + Ly * Lz); return { Lx, Ly, Lz, Vm, S, rt: Math.min(9, (0.161 * Vm) / (S * st.alpha + 4 * 0.002 * Vm)) }; }
    function buildIR(fs) {
      const g = geom(), len = Math.floor(fs * Math.min(6, g.rt * 1.15 + 0.15)), hbuf = new Float32Array(len), rnd = rng(5);
      const s = [g.Lx * 0.2, g.Ly * 0.4, 1.5], r = [g.Lx * 0.7, g.Ly * 0.55, 1.2], L = [g.Lx, g.Ly, g.Lz];
      const d0 = Math.hypot(s[0] - r[0], s[1] - r[1], s[2] - r[2]), refl = Math.sqrt(1 - st.alpha), spec = Math.sqrt(1 - 0.85 * st.scat);
      let first = null;
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) for (let k = -2; k <= 2; k++) {
        const ord = Math.abs(i) + Math.abs(j) + Math.abs(k); if (ord > 2) continue;
        const p = [i, j, k].map((q, a) => (q % 2 ? q * L[a] + (L[a] - s[a]) : q * L[a] + s[a]));
        const d = Math.hypot(p[0] - r[0], p[1] - r[1], p[2] - r[2]), n = Math.round(((d - d0) / P.C) * fs);
        if (n < len) hbuf[n] += (d0 / d) * Math.pow(refl * spec, ord) * (ord % 2 ? -0.9 : 1);
        if (ord === 1 && (first === null || d < first)) first = d;
      }
      const tm = Math.min(0.12, 0.0018 * Math.sqrt(g.Vm)), gTail = 0.5 * refl * (0.35 + 0.65 * st.scat) * Math.min(1, 3 / d0 + 0.25);
      for (let n = 1; n < len; n++) { const tt = n / fs; hbuf[n] += (rnd() * 2 - 1) * gTail * Math.min(1, tt / tm) * Math.exp((-6.91 * tt) / g.rt); }
      const fl = 1 - st.scat;
      if (fl > 0.4) { const perS = (2 * Math.min(g.Lx, g.Ly)) / P.C; for (let m = 1; m * perS < len / fs; m++) { const n = Math.round(m * perS * fs); if (n < len) hbuf[n] += 0.55 * fl * fl * Math.exp((-6.91 * m * perS) / (g.rt * 1.6)) * (m % 2 ? 1 : -1); } }
      return { h: hbuf, g, first: first ? ((first - d0) / P.C) * 1000 : 0 };
    }
    function signal(fs) {
      const n = Math.floor(fs * 2.4), x = new Float32Array(n), rnd = rng(3);
      if (st.sig === 'click') { [0.05, 0.75, 1.45].forEach((t0) => { const a = Math.floor(t0 * fs); for (let i = 0; i < fs * 0.004; i++) x[a + i] = (rnd() * 2 - 1) * Math.exp(-i / (fs * 0.0009)) * 0.9; }); }
      else if (st.sig === 'burst') { [0.05, 0.55, 1.05, 1.3].forEach((t0) => { const a = Math.floor(t0 * fs); for (let i = 0; i < fs * 0.12; i++) x[a + i] = (rnd() * 2 - 1) * Math.exp(-i / (fs * 0.03)) * 0.6; }); }
      else {
        const SYL = [[700, 1200, 1], [300, 2300, 0], [500, 900, 1], [400, 2000, 0], [650, 1100, 1], [320, 2500, 1], [550, 1500, 0]];
        SYL.forEach(([f1, f2, cons], k) => {
          const a = Math.floor((0.05 + k * 0.3) * fs), dur = Math.floor(0.2 * fs), f0 = 118 + 14 * Math.sin(k * 1.3);
          if (cons) for (let i = 0; i < fs * 0.025; i++) x[a - Math.floor(fs * 0.03) + i >= 0 ? a - Math.floor(fs * 0.03) + i : 0] += (rnd() * 2 - 1) * 0.12;
          const res = [f1, f2, 2900].map((f, q) => ({ c: 2 * Math.pow(0.985 - q * 0.004, 1) * Math.cos((TAU * f) / fs), r2: Math.pow(0.985 - q * 0.004, 2), y1: 0, y2: 0, g: [1, 0.55, 0.2][q] }));
          let phs = 0;
          for (let i = 0; i < dur; i++) {
            phs += f0 / fs; let src = 0; if (phs >= 1) { phs -= 1; src = 1; }
            let y = 0; res.forEach((o) => { const v = src + o.c * o.y1 - o.r2 * o.y2; o.y2 = o.y1; o.y1 = v; y += v * o.g; });
            const env = Math.min(1, i / (fs * 0.02), (dur - i) / (fs * 0.05));
            x[a + i] += y * env * 0.06;
          }
        });
      }
      return x;
    }
    function play(wet) {
      stop(); const ctx = A.audio.get(); if (!ctx) return;
      const fs = ctx.sampleRate, sig = signal(fs), buf = ctx.createBuffer(1, sig.length, fs); buf.getChannelData(0).set(sig);
      const src = ctx.createBufferSource(); src.buffer = buf; const g = ctx.createGain(); g.gain.value = wet ? 0.9 : 0.8;
      if (wet) { const ir = buildIR(fs).h, ib = ctx.createBuffer(1, ir.length, fs); ib.getChannelData(0).set(ir); const cv2 = ctx.createConvolver(); cv2.normalize = true; cv2.buffer = ib; src.connect(cv2).connect(g); } else src.connect(g);
      g.connect(ctx.destination); src.start(); A.audio.track(src); lastOut = g;
    }
    function stop() { A.audio.stopAll(); if (lastOut) { try { lastOut.disconnect(); } catch (e) { /* */ } lastOut = null; } }
    bD.onclick = () => play(false); bW.onclick = () => play(true); bS.onclick = stop; A.onLeave(stop);
    const cv = A.canvas(host, {
      height: 280,
      caption: 'The synthetic impulse response of the room you set up: the direct sound at time zero, a handful of distinct early reflections worked out from mirror-image sources, then a dense tail that decays at the predicted reverberation time. “In this room” plays the dry signal convolved with exactly this response — that is all auralisation is.',
      draw(ctx, w, h) {
        if (!R) return;
        const tm = Math.min(R.h.length / R.fs, Math.max(0.25, R.g.rt * 1.1));
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: tm * 1000, fmt: (v) => (tm > 1.5 ? fmt(v / 1000, 1) + ' s' : v + ' ms'), label: 'Time after the direct sound' }, y: { min: -70, max: 3, label: 'Level (dB)' } });
        const cols = Math.floor(ax.x1 - ax.x0), per = Math.max(1, Math.floor((tm * R.fs) / cols));
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 1;
        for (let c = 0; c < cols; c++) { let m = 0; for (let i = c * per; i < (c + 1) * per && i < R.h.length; i++) m = Math.max(m, Math.abs(R.h[i])); const db = m > 0 ? Math.max(-70, 20 * log10(m)) : -70; seg(ctx, ax.x0 + c + 0.5, ax.y0, ax.x0 + c + 0.5, ax.Y(Math.min(3, db)), A.alpha(A.css('accent'), 0.85), 1); }
        A.plotLine(ctx, ax, [[0, -6], [tm * 1000, -6 - (60 * tm) / R.g.rt]], A.css('accent2'), 2, [6, 4]);
        seg(ctx, ax.X(50), ax.y1, ax.X(50), ax.y0, A.css('good'), 1, [3, 3]); if (ax.X(50) < ax.x1 - 60) A.text(ctx, '50 ms', ax.X(50) + 4, ax.y1 + 12, { size: 10, color: A.css('good') });
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'impulse response'], [A.css('accent2'), 'slope of the reverberation time', true], [A.css('good'), 'early / late boundary for speech', true]]));
    host.appendChild(html('<p class="muted" style="font-size:.85em;margin:6px 0">Keep the volume moderate. Headphones make the room much easier to hear.</p>'));
    host.appendChild(tip);
    function upd() {
      const fs = 16000, b = buildIR(fs); R = { h: b.h, g: b.g, fs };
      let e0 = 0, e1 = 0; const n50 = Math.floor(0.05 * fs); for (let i = 0; i < b.h.length; i++) { const v = b.h[i] * b.h[i]; if (i < n50) e0 += v; else e1 += v; }
      const c50 = 10 * log10(e0 / Math.max(e1, 1e-12)), g = b.g, fsch = P.schroeder(g.rt, g.Vm);
      out.innerHTML = A.statBox('Reverberation time', fmt(g.rt, 2) + ' s', `${fmt(g.Vm, 0)} m³, ${fmt(g.S, 0)} m² of surface`) + A.statBox('First reflection arrives after', fmt(b.first, 1) + ' ms', b.first < 5 ? 'colours the sound (comb filter)' : b.first < 30 ? 'fuses with the direct sound' : 'heard as spaciousness / slap', b.first < 5 ? 'warn' : '') + A.statBox('Clarity for speech C50', fmt(c50, 0) + ' dB', c50 > 3 ? 'clear' : c50 > -2 ? 'fair' : 'muddy', c50 > 3 ? 'good' : c50 > -2 ? 'warn' : 'bad') + A.statBox('Geometric model valid above', fmtHz(fsch), 'below this, modes rule', fsch > 150 ? 'warn' : 'good');
      const t = [];
      if (st.scat < 0.25) t.push('Low scattering and parallel walls: listen for the metallic “zing” after each click — that is flutter echo, added here as a repeating reflection between the closest pair of walls. Raise the scattering and it dissolves into smooth reverberation.');
      if (c50 < -2) t.push('Speech in this room is tiring: most of the energy arrives after 50 ms and masks the next syllable. Either absorb (raise the slider) or bring the talker closer — a model would let you compare both before building.');
      if (fsch > 150) t.push('In a room this small the reverberant model is only meaningful above the frequency shown: bass behaviour is governed by individual modes, which neither this demo nor commercial ray tracers reproduce. Wave-based modelling or measurement is needed there.');
      t.push('Real auralisation does the same thing with a more careful impulse response for each ear (binaural), in several frequency bands, using measured loudspeaker directivity. Its value is comparison — option A against option B — rather than an absolute promise of how the room will sound.');
      t.push('The dry signal must really be dry: any room already in the recording gets a second room added on top. That is why anechoic recordings of instruments and voices exist.');
      tips(tip, t); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     15. Wave-based model cost
     ====================================================================== */
  V.gridDispersion = function (host) {
    const st = A.controls(host, [
      { key: 'fmax', label: 'Highest frequency to model', type: 'range', min: 2, max: 3.9, step: 0.01, value: 2.7, fmt: (v) => fmtHz(Math.pow(10, v)) },
      { key: 'vol', label: 'Room volume', type: 'range', min: 1.3, max: 4.3, step: 0.01, value: 2, fmt: (v) => fmt(Math.pow(10, v), 0) + ' m³' },
      { key: 'ppw', label: 'Grid points per wavelength', type: 'range', min: 4, max: 20, step: 1, value: 10, fmt: (v) => String(v) },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const big = (x) => (x >= 1e12 ? fmt(x / 1e12, 1) + ' trillion' : x >= 1e9 ? fmt(x / 1e9, 1) + ' billion' : x >= 1e6 ? fmt(x / 1e6, 1) + ' million' : x >= 1e3 ? fmt(x / 1e3, 0) + ' thousand' : fmt(x, 0));
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top: a wave as the mathematics says it should travel (line) and as the grid carries it (dots). With too few points per wavelength the gridded wave falls behind — numerical dispersion. Bottom: how the number of grid cells explodes with the top frequency for this room; each octave higher costs eight times the memory and sixteen times the computing.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const x0 = 20, x1 = w - 20, y = 50, lamPx = 90, ph = t * 2.2, ph2 = ph * (1 - R.err);
        ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2; ctx.beginPath(); for (let x = x0; x <= x1; x += 2) { const yy = y - 26 * Math.sin((TAU * (x - x0)) / lamPx - ph); if (x === x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke();
        const dx = lamPx / st.ppw; ctx.strokeStyle = A.alpha(A.css('accent'), 0.7); ctx.lineWidth = 1.5; ctx.beginPath();
        for (let x = x0, i = 0; x <= x1; x += dx, i++) { const yy = y - 26 * Math.sin((TAU * (x - x0)) / lamPx - ph2 - R.err * 0.25 * i); if (!i) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke();
        for (let x = x0, i = 0; x <= x1; x += dx, i++) dot(ctx, x, y - 26 * Math.sin((TAU * (x - x0)) / lamPx - ph2 - R.err * 0.25 * i), 3, A.css('accent'));
        const ax = A.axes(ctx, w, h, { pad: { t: 108 }, x: { min: 100, max: 8000, log: true, label: 'Highest frequency modelled (Hz)' }, y: { min: 1e3, max: 1e13, log: true, ticks: [1e3, 1e5, 1e7, 1e9, 1e11, 1e13], fmt: (v) => '10' + ['³', '⁵', '⁷', '⁹', '¹¹', '¹³'][[1e3, 1e5, 1e7, 1e9, 1e11, 1e13].indexOf(v)], label: 'Grid cells' } });
        const Vm = Math.pow(10, st.vol), pts = []; for (let e = 2; e <= 3.91; e += 0.05) { const f = Math.pow(10, e); pts.push([f, A.clamp(Vm / Math.pow(P.C / (f * st.ppw), 3), 1e3, 1e13)]); }
        ctx.fillStyle = A.alpha(A.css('bad'), 0.1); ctx.fillRect(ax.x0, ax.y1, ax.x1 - ax.x0, ax.Y(1e10) - ax.y1); A.text(ctx, 'beyond a desktop computer', ax.x0 + 6, ax.y1 + 14, { size: 10, color: A.css('bad') });
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.5);
        dot(ctx, ax.X(Math.pow(10, st.fmax)), ax.Y(A.clamp(R.cells, 1e3, 1e13)), 6, A.css('text'));
      },
    });
    host.appendChild(tip);
    function upd() {
      const f = Math.pow(10, st.fmax), Vm = Math.pow(10, st.vol), dx = P.C / (f * st.ppw), cells = Vm / Math.pow(dx, 3), fs = (P.C * Math.sqrt(3)) / dx, upd1 = cells * fs, mem = cells * 16;
      const err = Math.pow(Math.PI / st.ppw, 2) / 6;
      R = { cells, err };
      const secs = upd1 / 2e9, tt = secs < 60 ? fmt(secs, secs < 10 ? 1 : 0) + ' s' : secs < 3600 ? fmt(secs / 60, 0) + ' min' : secs < 86400 * 2 ? fmt(secs / 3600, 0) + ' h' : fmt(secs / 86400, 0) + ' days';
      out.innerHTML = A.statBox('Grid spacing', A.fmtLen(dx), `λ ÷ ${st.ppw} at ${fmtHz(f)}`) + A.statBox('Grid cells', big(cells), '', cells > 1e10 ? 'bad' : cells > 1e8 ? 'warn' : 'good') + A.statBox('Memory', mem > 1e12 ? fmt(mem / 1e12, 1) + ' TB' : mem > 1e9 ? fmt(mem / 1e9, 1) + ' GB' : fmt(mem / 1e6, 0) + ' MB', '', mem > 6.4e10 ? 'bad' : mem > 8e9 ? 'warn' : 'good') + A.statBox('Time for 1 s of sound', tt, 'on one fast graphics card', secs > 86400 ? 'bad' : secs > 3600 ? 'warn' : 'good') + A.statBox('Wave-speed error of the grid', fmt(err * 100, 1) + ' %', err > 0.02 ? 'audible detuning of modes' : 'acceptable', err > 0.02 ? 'bad' : 'good');
      const t = [];
      if (cells > 1e10) t.push('This is beyond a workstation. It is exactly why wave-based methods are used for the bottom few octaves and geometric methods take over above — the “hybrid” approach.');
      else t.push('This is practical today. For a small studio, modelling up to 300–500 Hz with a wave method covers the whole modal region — precisely where ray tracing is blind.');
      if (st.ppw < 8) t.push('Fewer than about 8–10 points per wavelength and the grid itself slows the wave down: predicted mode frequencies come out flat and the error grows with distance travelled.');
      t.push('Doubling the top frequency halves the grid spacing: 8 × the cells and, because the time step must shrink too, 16 × the work. Doubling the room volume only doubles it.');
      t.push('The grid is the easy part. The hard part is the boundary: every surface needs a realistic frequency-dependent impedance, and that data is far scarcer than simple absorption coefficients.');
      tips(tip, t);
    }
    upd();
  };
})();
