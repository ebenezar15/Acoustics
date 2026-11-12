/* ==========================================================================
   Acoustica — audio-system widgets, second set:
   loudspeaker enclosures (boxDesigner, baffleStep, impedanceCurve),
   electronics (rcFilter, padCalc, transformerLab, meterBallistics),
   measurement (fftLab, gatingLab, coherenceLab, distortionLab) and
   immersive audio (ambisonicDecoder, bassManager, downmixCalc, panLawLab).
   Simplified, indicative teaching models — not a substitute for measurement.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C0 = 343, RHO = 1.18;
  const dB = (x) => 20 * Math.log10(Math.max(1e-9, x));
  const lin = (d) => Math.pow(10, d / 20);
  const logspace = (a, b, n) => Array.from({ length: n }, (_, i) => a * Math.pow(b / a, i / (n - 1)));
  const logR = (key, label, a, b, v, f) => ({ key, label, type: 'range', min: Math.log10(a), max: Math.log10(b), step: 0.005, value: Math.log10(v), fmt: (x) => f(Math.pow(10, x)) });
  const P10 = (x) => Math.pow(10, x);
  const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const cabs = (a) => Math.hypot(a[0], a[1]);
  const fmtOhm = (r) => (r >= 1e6 ? fmt(r / 1e6, 2) + ' MΩ' : r >= 1000 ? fmt(r / 1000, 2) + ' kΩ' : fmt(r, r < 10 ? 2 : r < 100 ? 1 : 0) + ' Ω');
  const fmtCap = (c) => (c >= 1e-6 ? fmt(c * 1e6, 2) + ' µF' : c >= 1e-9 ? fmt(c * 1e9, 2) + ' nF' : fmt(c * 1e12, 0) + ' pF');
  const volNote = '<p class="small muted" style="margin:.4em 0 0">Keep the volume moderate — start low and bring it up.</p>';
  const callout = (cls, s) => `<div class="callout ${cls}">${s}</div>`;
  const E24 = [1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];
  function nearestE24(r) {
    if (!(r > 0)) return 0;
    const e = Math.floor(Math.log10(r)), m = r / Math.pow(10, e);
    let best = 1, bd = 9;
    for (const v of E24.concat([10])) { const d = Math.abs(Math.log(v / m)); if (d < bd) { bd = d; best = v; } }
    return +(best * Math.pow(10, e)).toPrecision(3);
  }
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -TAU / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const a = i + k, b = a + len / 2, xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
  }
  const gauss = () => { let u = 0, v = 0; while (u === 0) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  const rr = (ctx, x, y, w, h, r, fill, stroke) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); } };
  const line = (ctx, x1, y1, x2, y2, c, lw = 1.5, dash) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); };

  /* ======================================================================
     1. Box designer — sealed and vented enclosures
     ====================================================================== */
  const DRIVERS = {
    mid: ['6.5-inch mid-woofer', { fs: 45, qts: 0.38, vas: 18, sd: 135, xmax: 5, vb: 12, fb: 48, pd: 6 }],
    sub: ['10-inch subwoofer driver', { fs: 28, qts: 0.45, vas: 60, sd: 330, xmax: 12, vb: 35, fb: 27, pd: 7.5 }],
    pa: ['15-inch high-efficiency woofer', { fs: 40, qts: 0.32, vas: 180, sd: 855, xmax: 7, vb: 110, fb: 45, pd: 12 }],
    full: ['4-inch full-range unit', { fs: 80, qts: 0.55, vas: 4, sd: 55, xmax: 3, vb: 5, fb: 75, pd: 3 }],
  };
  V.boxDesigner = function (host) {
    const d0 = DRIVERS.mid[1];
    const st = A.controls(host, [
      { key: 'drv', label: 'Start from a typical driver', type: 'select', value: 'mid', options: Object.entries(DRIVERS).map(([k, v]) => [k, v[0]]) },
      { key: 'box', label: 'Enclosure type', type: 'select', value: 'vented', options: [['sealed', 'Sealed (closed) box'], ['vented', 'Vented (bass-reflex) box']] },
      { key: 'fs', label: 'Fs — free-air resonance', type: 'range', min: 18, max: 120, step: 1, value: d0.fs, unit: 'Hz' },
      { key: 'qts', label: 'Qts — total damping figure', type: 'range', min: 0.18, max: 1.2, step: 0.01, value: d0.qts },
      { key: 'vas', label: 'Vas — equivalent air volume', type: 'range', min: 1, max: 400, step: 1, value: d0.vas, unit: 'L' },
      { key: 'sd', label: 'Sd — cone area', type: 'range', min: 30, max: 1200, step: 5, value: d0.sd, unit: 'cm²' },
      { key: 'xmax', label: 'Xmax — linear travel (one way)', type: 'range', min: 1, max: 25, step: 0.5, value: d0.xmax, unit: 'mm' },
      { key: 'vb', label: 'Box volume (net, internal)', type: 'range', min: 1, max: 400, step: 0.5, value: d0.vb, unit: 'L' },
      { key: 'fb', label: 'Box tuning Fb (vented only)', type: 'range', min: 15, max: 120, step: 0.5, value: d0.fb, unit: 'Hz' },
      { key: 'pd', label: 'Port inside diameter (vented only)', type: 'range', min: 2, max: 20, step: 0.5, value: d0.pd, unit: 'cm' },
      { key: 'pw', label: 'Amplifier power applied', type: 'range', min: 0, max: 3, step: 0.01, value: Math.log10(20), fmt: (v) => fmt(P10(v), 0) + ' W' },
      { key: 'ft', label: 'Animation frequency', type: 'range', min: 15, max: 150, step: 1, value: 40, unit: 'Hz' },
    ], (s) => { if (s.drv !== lastDrv) { lastDrv = s.drv; const d = DRIVERS[s.drv][1]; Object.keys(d).forEach((k) => st.set(k, d[k], true)); } upd(); });
    let lastDrv = 'mid';
    const row = el('div', { class: 'row' });
    const sug = el('button', { class: 'primary', html: 'Suggest a flat alignment' }); row.appendChild(sug); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    let M = null;
    function model() {
      const fs = st.fs, qts = st.qts, vas = st.vas / 1000, vb = st.vb / 1000, sd = st.sd / 1e4, pw = P10(st.pw);
      const qes = qts * 1.12, eta = Math.min(0.06, ((4 * Math.PI * Math.PI) / Math.pow(C0, 3)) * Math.pow(fs, 3) * vas / qes);
      const alpha = vas / vb, ws = TAU * fs, Ts = 1 / ws, Tb = 1 / (TAU * st.fb), vented = st.box === 'vented';
      const pPass = Math.sqrt((eta * pw * RHO * C0) / TAU), aPass = (pPass * TAU / (RHO * sd)) * Math.SQRT2;
      const wc = ws * Math.sqrt(1 + alpha), qtc = qts * Math.sqrt(1 + alpha);
      const sp = Math.PI * Math.pow(st.pd / 200, 2);
      const at = (f) => {
        const w = TAU * f;
        if (!vented) { const u = w / wc, den = [1 - u * u, u / qtc], m = cabs(den); return { g: (u * u) / m, x: aPass / (wc * wc) / m, v: 0, cone: cdiv([1, 0], den), port: [0, 0] }; }
        const D = [Math.pow(w, 4) * Tb * Tb * Ts * Ts - w * w * ((alpha + 1) * Tb * Tb + Ts * Ts) + 1, -Math.pow(w, 3) * Tb * Tb * Ts / qts + w * Ts / qts], m = cabs(D);
        const k = 1 - w * w * Tb * Tb;
        return { g: (Math.pow(w, 4) * Tb * Tb * Ts * Ts) / m, x: (aPass * Ts * Ts * Math.abs(k)) / m, v: (sd * w * aPass * Ts * Ts) / m / sp, cone: cdiv([k, 0], D), port: cdiv([-1, 0], D) };
      };
      const fr = logspace(10, 500, 220), pts = fr.map((f) => [f, at(f)]);
      let f3 = null; for (let i = pts.length - 1; i > 0; i--) if (dB(pts[i][1].g) < -3) { f3 = pts[i][0]; break; }
      let peak = -99; pts.forEach((p) => { peak = Math.max(peak, dB(p[1].g)); });
      let xm = 0, xf = 0, vm = 0; pts.forEach(([f, r]) => { if (f >= 20) { if (r.x > xm) { xm = r.x; xf = f; } vm = Math.max(vm, r.v); } });
      const lv = vented ? (C0 * C0 * sp) / (Math.pow(TAU * st.fb, 2) * vb) - 0.73 * (st.pd / 100) : 0;
      const ref = logspace(10, 500, 120).map((f) => { const u = f / fs; return [f, dB((u * u) / Math.hypot(1 - u * u, u / qts))]; });
      return { pts, f3, peak, xm, xf, vm, lv, qtc, fc: wc / TAU, eta, spl: dB(pPass / 2e-5), sens: dB(Math.sqrt((eta * RHO * C0) / TAU) / 2e-5), vented, at, ref, alpha, ebp: fs / qes };
    }
    sug.onclick = () => {
      const q = st.qts;
      if (st.box === 'sealed') { if (q >= 0.7) { A.toast && A.toast('Qts is already above 0.7 — no sealed box can bring Qtc down to 0.707. Use the largest box you can, or an open baffle.'); st.set('vb', 400); return; } st.set('vb', A.clamp(st.vas / (Math.pow(0.707 / q, 2) - 1), 1, 400)); }
      else { st.set('vb', A.clamp(15 * Math.pow(q, 2.87) * st.vas, 1, 400), true); st.set('fb', A.clamp(0.42 * Math.pow(q, -0.9) * st.fs, 15, 120)); }
    };
    const cv = A.canvas(host, {
      height: 430,
      caption: 'Upper graph: bass response of the driver in the chosen box (solid) against the same driver on a very large baffle (dashed); the horizontal guide is the −3 dB level. Lower graph: peak cone travel at the chosen power, with the driver\'s linear limit drawn as a horizontal guide. The vertical marker is the animation frequency.',
      draw(ctx, w, h) {
        if (!M) return; const h1 = Math.round(h * 0.56);
        const ax = A.axes(ctx, w, h1, { x: { min: 10, max: 500, log: true }, y: { min: -30, max: 9, label: 'Response (dB)' }, pad: { b: 22 } });
        line(ctx, ax.x0, ax.Y(-3), ax.x1, ax.Y(-3), A.css('muted'), 1, [4, 4]);
        A.plotLine(ctx, ax, M.ref, A.css('muted'), 1.5, [5, 4]);
        A.plotLine(ctx, ax, M.pts.map(([f, r]) => [f, dB(r.g)]), A.css('accent'), 2.5);
        if (M.f3) { const x = ax.X(M.f3); line(ctx, x, ax.y1, x, ax.y0, A.css('good'), 1, [3, 3]); A.text(ctx, 'f3 ' + fmtHz(M.f3), Math.min(x + 4, ax.x1 - 70), ax.y1 + 14, { size: 11, color: A.css('good'), weight: 700 }); }
        const xt = ax.X(st.ft); line(ctx, xt, ax.y1, xt, ax.y0, A.css('c3'), 1.5);
        ctx.save(); ctx.translate(0, h1);
        const xmm = st.xmax, top = Math.max(xmm * 1.6, Math.min(xmm * 6, M.xm * 1100));
        const ax2 = A.axes(ctx, w, h - h1, { x: { min: 10, max: 500, log: true, label: 'Frequency (Hz)' }, y: { min: 0, max: top, label: 'Cone travel (mm)' }, pad: { t: 8 } });
        line(ctx, ax2.x0, ax2.Y(xmm), ax2.x1, ax2.Y(xmm), A.css('bad'), 1.5, [5, 3]); A.text(ctx, 'Xmax', ax2.x1 - 36, ax2.Y(xmm) - 4, { size: 10, color: A.css('bad'), weight: 700 });
        A.plotLine(ctx, ax2, M.pts.map(([f, r]) => [f, r.x * 1000]), A.css('c2'), 2.5);
        const xt2 = ax2.X(st.ft); line(ctx, xt2, ax2.y1, xt2, ax2.y0, A.css('c3'), 1.5);
        ctx.restore();
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'Response in this box'], [A.css('muted'), 'Driver alone, huge baffle', true], [A.css('c2'), 'Cone travel'], [A.css('bad'), 'Linear travel limit', true]]));
    A.canvas(host, {
      height: 170, animate: true,
      caption: 'Cut-away of the box at the animation frequency: the cone stroke is drawn relative to its linear limit, and in a vented box the arrows in the port show how hard and in which direction the air plug is moving. Near the tuning frequency the cone almost stops and the port does the work; well below it, port and cone fight each other.',
      draw(ctx, w, h, t) {
        if (!M) return; const tt = Math.max(0, t), r = M.at(st.ft), ph = TAU * 1.1 * tt;
        const bw = Math.min(300, w - 30), bx = (w - bw) / 2, by = 18, bh = h - 40;
        rr(ctx, bx, by, bw, bh, 4, A.css('panel2'), A.css('text'));
        const cm = cabs(r.cone) || 1e-9, amp = Math.min(1.5, r.x / (st.xmax / 1000)), cph = Math.atan2(r.cone[1], r.cone[0]);
        const dx = -amp * 12 * Math.cos(ph + cph), cy = by + bh * 0.38, ch = Math.min(34, bh * 0.3);
        ctx.strokeStyle = amp > 1 ? A.css('bad') : A.css('accent'); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx + 1, cy - ch); ctx.lineTo(bx + 20 + dx, cy - 8); ctx.lineTo(bx + 20 + dx, cy + 8); ctx.lineTo(bx + 1, cy + ch); ctx.stroke();
        rr(ctx, bx + 20 + dx, cy - 10, 26, 20, 3, A.css('muted'));
        ctx.lineWidth = 1; A.text(ctx, 'cone ' + fmt(r.x * 1000, 1) + ' mm', bx + bw - 8, cy + 4, { align: 'right', size: 11, color: amp > 1 ? A.css('bad') : A.css('text') });
        void cm;
        if (M.vented) {
          const py = by + bh * 0.8, pl = Math.min(bw * 0.4, 70);
          ctx.clearRect(bx - 2, py - 9, 5, 18); line(ctx, bx, py - 9, bx + pl, py - 9, A.css('text'), 2); line(ctx, bx, py + 9, bx + pl, py + 9, A.css('text'), 2);
          const pa = Math.min(1.4, r.v / 17), pph = Math.atan2(r.port[1], r.port[0]), s = -pa * 22 * Math.cos(ph + pph), col = r.v > 17 ? A.css('bad') : A.css('c3');
          const x0 = bx + pl * 0.45; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, py); ctx.lineTo(x0 + s, py); ctx.stroke();
          if (Math.abs(s) > 3) { const d = Math.sign(s); ctx.beginPath(); ctx.moveTo(x0 + s + d * 6, py); ctx.lineTo(x0 + s, py - 5); ctx.lineTo(x0 + s, py + 5); ctx.fill(); }
          ctx.lineWidth = 1; A.text(ctx, 'port air ' + fmt(r.v, 1) + ' m/s', bx + bw - 8, py + 4, { align: 'right', size: 11, color: col });
        } else A.text(ctx, 'air inside acts as a spring', bx + bw / 2 + 24, by + bh * 0.82, { align: 'center', size: 11, color: A.css('muted') });
        A.text(ctx, fmtHz(st.ft) + ' · ' + fmt(dB(r.g), 1) + ' dB', bx + bw - 6, by + 16, { align: 'right', size: 11, weight: 700 });
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      M = model(); const m = M;
      const over = m.xm * 1000 > st.xmax;
      let s = A.statBox('−3 dB point (f3)', m.f3 ? fmtHz(m.f3) : '< 10 Hz', m.peak > 1.5 ? 'response peaks +' + fmt(m.peak, 1) + ' dB' : 'no significant peak');
      if (!m.vented) s += A.statBox('System Q (Qtc)', fmt(m.qtc, 2), m.qtc < 0.6 ? 'over-damped: lean, very tight' : m.qtc < 0.8 ? 'flattest response' : m.qtc < 1.05 ? 'slightly warm, small bump' : 'boomy: one-note bass', m.qtc > 1.05 ? 'bad' : m.qtc < 0.8 && m.qtc >= 0.6 ? 'good' : '') + A.statBox('Box resonance (fc)', fmtHz(m.fc), 'driver + air spring');
      else s += A.statBox('Port length', m.lv > 0.005 ? fmt(m.lv * 100, 1) + ' cm' : 'not possible', m.lv <= 0.005 ? 'port too narrow for this tuning — use a wider one' : m.lv * 100 > Math.cbrt(st.vb * 1000) * 0.9 ? 'longer than the box is deep — bend it or use a smaller diameter / passive radiator' : 'for one round port, ' + fmt(st.pd, 1) + ' cm bore', m.lv <= 0.005 ? 'bad' : '') + A.statBox('Peak port air speed', fmt(m.vm, 1) + ' m/s', m.vm > 17 ? 'over ≈ 17 m/s: audible chuffing' : m.vm > 10 ? 'acceptable; flare the ends' : 'quiet', m.vm > 17 ? 'bad' : m.vm > 10 ? 'warn' : 'good');
      s += A.statBox('Largest cone travel (20 Hz up)', fmt(m.xm * 1000, 1) + ' mm', 'at ' + fmtHz(m.xf) + (over ? ' — beyond Xmax' : ' — within Xmax'), over ? 'bad' : 'good');
      s += A.statBox('Level at 1 m, mid-bass', fmt(m.spl, 0) + ' dB', 'sensitivity ≈ ' + fmt(m.sens, 0) + ' dB for 1 W');
      s += A.statBox('Fs ÷ Qes', fmt(m.ebp, 0), m.ebp < 50 ? 'suits a sealed box' : m.ebp > 90 ? 'suits a vented box' : 'works in either');
      out.innerHTML = s;
      let msg;
      if (m.vented && st.qts > 0.6) msg = 'A driver with Qts above about 0.6 is a poor match for a vented box: the response humps and rings. Try the sealed option or an open baffle.';
      else if (m.vented && m.lv <= 0.005) msg = 'The port you chose cannot be made short enough for this tuning. Use a larger diameter (which also lowers air speed) or accept a lower tuning.';
      else if (m.vented && m.vm > 17) msg = 'The port air is moving fast enough to hiss and compress. Use a larger diameter (the port becomes longer), two ports, flared ends, or a passive radiator.';
      else if (over && m.vented && m.xf < st.fb * 0.9) msg = 'The cone runs out of travel <b>below the tuning frequency</b>, where the port no longer loads it. This is why vented boxes need a steep high-pass filter set just under Fb.';
      else if (over) msg = 'The cone exceeds its linear travel at this power. Reduce power, raise the high-pass frequency, choose a driver with more travel or area — or accept more distortion on peaks.';
      else if (!m.vented && m.qtc > 1.05) msg = 'The box is too small for this driver: the air spring stiffens the system and raises Qtc. Enlarge the box, add absorbent filling (worth roughly 15–20 % more apparent volume), or pick a lower-Qts driver.';
      else if (!m.vented && m.qtc < 0.6) msg = 'Very well damped and tight, but bass rolls off early. Fine for a room that adds its own gain at low frequencies; a smaller box would lift the response toward flat.';
      else if (m.peak > 2) msg = 'The response has a hump before it rolls off: more apparent bass, less accuracy. Lower the tuning or enlarge the box to flatten it.';
      else msg = 'A sensible design. Sealed rolls off gently (12 dB per octave) with the best time behaviour; vented buys roughly an extra third to half octave of bass for the same driver, then falls twice as fast (24 dB per octave).';
      tip.innerHTML = callout('mentor', msg);
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Baffle step, edge diffraction and the wall behind
     ====================================================================== */
  V.baffleStep = function (host) {
    const st = A.controls(host, [
      { key: 'bw', label: 'Baffle width', type: 'range', min: 0.12, max: 1.2, step: 0.01, value: 0.22, unit: 'm' },
      { key: 'off', label: 'Driver offset from the baffle centre', type: 'range', min: 0, max: 100, step: 5, value: 0, unit: '%' },
      { key: 'wall', label: 'Distance from baffle to the wall behind', type: 'range', min: 0.1, max: 3, step: 0.05, value: 1.5, unit: 'm' },
      { key: 'wallOn', label: 'Include the wall behind the loudspeaker', type: 'check', value: false },
      { key: 'comp', label: 'Baffle-step compensation applied', type: 'range', min: 0, max: 6, step: 0.5, value: 0, unit: 'dB' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const f3 = () => 115 / st.bw;
    function resp(f, withWall, comp) {
      const fc = f3() / 0.707, x = f / fc;
      let H = cdiv([0.5, x], [1, x]);
      const o = st.off / 100, de = st.bw / 2, amp = 0.17 * (1 - 0.75 * o) * (x * x / (1 + x * x));
      [1 - 0.6 * o, 1 + 0.6 * o].forEach((k) => { const ph = -TAU * f * (de * k) / C0; H = [H[0] - (amp / 2) * Math.cos(ph) * Math.exp(-f / 9000), H[1] - (amp / 2) * Math.sin(ph) * Math.exp(-f / 9000)]; });
      if (withWall) { const om = 1 / (1 + Math.pow(f / f3(), 2)), ph = -TAU * f * (2 * st.wall) / C0, g = 0.85 * om; H = cmul(H, [1 + g * Math.cos(ph), g * Math.sin(ph)]); }
      if (comp > 0) { const k = lin(-comp), c = cdiv([1, x * 1.0], [1, x / k]); H = cmul(H, c); }
      return dB(cabs(H));
    }
    const cv = A.canvas(host, {
      height: 320,
      caption: 'Level on the listening axis, relative to the driver\'s mid and treble output. The dotted trace is the bare baffle in open space; the solid trace adds the wall and the compensation you have selected. The vertical guide marks the centre of the step.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 30, max: 10000, log: true, label: 'Frequency (Hz)' }, y: { min: -12, max: 6, label: 'Level (dB)' } });
        const fr = logspace(30, 10000, 260);
        line(ctx, ax.x0, ax.Y(0), ax.x1, ax.Y(0), A.css('muted'), 1); line(ctx, ax.x0, ax.Y(-6), ax.x1, ax.Y(-6), A.css('muted'), 1, [3, 4]);
        A.plotLine(ctx, ax, fr.map((f) => [f, resp(f, false, 0)]), A.css('muted'), 2, [3, 3]);
        A.plotLine(ctx, ax, fr.map((f) => [f, resp(f, st.wallOn, st.comp) + (st.comp > 0 ? 0 : 0)]), A.css('accent'), 2.5);
        const x = ax.X(f3()); line(ctx, x, ax.y1, x, ax.y0, A.css('c3'), 1.5, [4, 3]); A.text(ctx, 'step ≈ ' + fmtHz(f3()), Math.min(x + 5, ax.x1 - 90), ax.y1 + 14, { size: 11, weight: 700, color: A.css('c3') });
        A.text(ctx, 'treble: radiates forward only (0 dB)', ax.x1 - 6, ax.Y(3.2), { size: 10, align: 'right', color: A.css('muted') }); A.text(ctx, 'bass: radiates all round (−6 dB)', ax.x0 + 6, ax.Y(-6) + 14, { size: 10, color: A.css('muted') });
      },
    });
    host.appendChild(A.legend([[A.css('muted'), 'Bare baffle, open space', true], [A.css('accent'), 'With your wall and compensation']]));
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const fn = C0 / (4 * st.wall);
      out.innerHTML = A.statBox('Baffle-step centre', fmtHz(f3()), '≈ 115 ÷ width in metres') + A.statBox('Step spans roughly', fmtHz(f3() / 3) + ' – ' + fmtHz(f3() * 3), 'a gentle shelf, not a cliff')
        + A.statBox('Edge ripple', st.off < 30 ? 'strongest' : st.off < 70 ? 'reduced' : 'smoothest', st.off < 30 ? 'driver equally far from both edges' : 'unequal edge distances spread it')
        + (st.wallOn ? A.statBox('Wall cancellation near', fmtHz(fn), 'quarter wavelength = ' + fmt(st.wall, 2) + ' m') : '')
        + A.statBox('Typical compensation', st.wallOn && st.wall < 0.5 ? '0–3 dB' : st.wallOn ? '3–4 dB' : '4–6 dB', st.wallOn ? 'room gives some bass back' : 'needed in open space');
      let msg;
      if (st.wallOn && st.wall < 0.4) msg = 'Close to the wall the reflected bass arrives almost in step with the direct sound, so the wall refills most of the step: little or no compensation is needed. This is the same reason flush-mounted monitors have no baffle step at all.';
      else if (st.wallOn) msg = `The wall returns the low frequencies with a delay. They add at the very bottom, but cancel around ${fmtHz(fn)} where the round trip is half a wavelength. Compensation cannot fill that notch — move the loudspeaker much closer to the wall, or much further away.`;
      else if (st.comp >= 5) msg = 'Full compensation makes the box flat in open space, but it is done by turning the mid and treble <b>down</b> about 6 dB — so the system loses that much sensitivity. In a real room, 3–4 dB usually sounds right.';
      else if (st.bw > 0.6) msg = 'A wide baffle pushes the step down toward the bass, where the room and its boundaries take over. That is why wide, shallow cabinets and in-wall loudspeakers sound fuller in the lower midrange.';
      else msg = 'Narrow cabinets put the step right in the lower midrange (a 20 cm box: near 575 Hz). Without compensation the loudspeaker sounds thin and forward; the crossover or the equaliser has to tilt the balance back.';
      tip.innerHTML = callout('mentor', msg);
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Impedance curve
     ====================================================================== */
  V.impedanceCurve = function (host) {
    const st = A.controls(host, [
      { key: 'box', label: 'Mounting', type: 'select', value: 'free', options: [['free', 'Driver in free air'], ['sealed', 'In a sealed box'], ['vented', 'In a vented box']] },
      { key: 're', label: 'Re — voice-coil resistance', type: 'range', min: 2.5, max: 14, step: 0.1, value: 6.2, unit: 'Ω' },
      { key: 'fs', label: 'Fs — free-air resonance', type: 'range', min: 20, max: 120, step: 1, value: 40, unit: 'Hz' },
      { key: 'qms', label: 'Qms — mechanical Q', type: 'range', min: 1, max: 12, step: 0.1, value: 4.5 },
      { key: 'qes', label: 'Qes — electrical Q', type: 'range', min: 0.2, max: 1.5, step: 0.01, value: 0.42 },
      { key: 'le', label: 'Le — voice-coil inductance', type: 'range', min: 0.05, max: 3, step: 0.05, value: 0.8, unit: 'mH' },
      { key: 'ratio', label: 'Vas ÷ box volume', type: 'range', min: 0.3, max: 6, step: 0.1, value: 1.5 },
      { key: 'fb', label: 'Box tuning (vented)', type: 'range', min: 20, max: 100, step: 1, value: 38, unit: 'Hz' },
      { key: 'v', label: 'Amplifier output voltage', type: 'range', min: 1, max: 60, step: 1, value: 20, unit: 'V' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    function Z(f) {
      const w = TAU * f, res = st.re * st.qms / st.qes, Ts = 1 / (TAU * st.fs);
      let zm;
      if (st.box === 'vented') {
        const a = st.ratio, Tb = 1 / (TAU * st.fb), q = st.qms;
        const D = [Math.pow(w, 4) * Tb * Tb * Ts * Ts - w * w * ((a + 1) * Tb * Tb + Ts * Ts) + 1, -Math.pow(w, 3) * Tb * Tb * Ts / q + w * Ts / q];
        zm = cdiv(cmul([0, res * w * Ts / q], [1 - w * w * Tb * Tb, 0]), D);
      } else {
        const k = st.box === 'sealed' ? Math.sqrt(1 + st.ratio) : 1, fc = st.fs * k, qm = st.qms * k;
        zm = cdiv([res, 0], [1, qm * (f / fc - fc / f)]);
      }
      // lossy inductance: rises more slowly than an ideal coil
      const le = st.le / 1000, zl = [0.25 * Math.pow(w * le, 0.8), 0.75 * Math.pow(w * le, 0.9) * Math.pow(TAU * 1000 * le, 0.1)];
      return [st.re + zm[0] + zl[0], zm[1] + zl[1]];
    }
    let M = null;
    const cv = A.canvas(host, {
      height: 330,
      caption: 'Solid trace: size of the electrical impedance the amplifier sees, on the left-hand scale. Dotted trace: phase angle, from −90° at the bottom of the graph to +90° at the top (0° on the centre line). The horizontal guide is the nominal impedance; markers show the resonance peaks and the minimum.',
      draw(ctx, w, h) {
        if (!M) return;
        const ax = A.axes(ctx, w, h, { x: { min: 10, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: 0, max: M.top, label: 'Impedance (Ω)' } });
        line(ctx, ax.x0, ax.Y(M.nom), ax.x1, ax.Y(M.nom), A.css('c3'), 1.5, [6, 4]); A.text(ctx, 'nominal ' + M.nom + ' Ω', ax.x1 - 6, ax.Y(M.nom) - 16, { size: 10, align: 'right', color: A.css('c3'), weight: 700 });
        A.plotLine(ctx, ax, M.pts.map((p) => [p[0], M.top / 2 + (p[2] / 90) * (M.top / 2)]), A.css('muted'), 1.5, [2, 3]);
        A.plotLine(ctx, ax, M.pts.map((p) => [p[0], p[1]]), A.css('accent'), 2.5);
        M.peaks.forEach((p) => { ctx.fillStyle = A.css('c2'); ctx.beginPath(); ctx.arc(ax.X(p[0]), ax.Y(Math.min(p[1], M.top)), 4, 0, TAU); ctx.fill(); A.text(ctx, fmtHz(p[0]), ax.X(p[0]) + 6, Math.max(ax.y1 + 12, ax.Y(Math.min(p[1], M.top)) + 4), { size: 10, weight: 700 }); });
        ctx.fillStyle = A.css('good'); ctx.beginPath(); ctx.arc(ax.X(M.min[0]), ax.Y(M.min[1]), 4, 0, TAU); ctx.fill(); A.text(ctx, 'min ' + fmt(M.min[1], 1) + ' Ω', ax.X(M.min[0]) + 6, ax.Y(M.min[1]) + 14, { size: 10, color: A.css('good'), weight: 700 });
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'Impedance magnitude'], [A.css('muted'), 'Phase angle', true], [A.css('c3'), 'Nominal value', true]]));
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const fr = logspace(10, 20000, 420), pts = fr.map((f) => { const z = Z(f); return [f, cabs(z), (Math.atan2(z[1], z[0]) * 180) / Math.PI]; });
      const peaks = []; let mx = 0;
      for (let i = 1; i < pts.length - 1; i++) { if (pts[i][0] < 400 && pts[i][1] > pts[i - 1][1] && pts[i][1] >= pts[i + 1][1] && pts[i][1] > st.re * 1.3) peaks.push(pts[i]); mx = Math.max(mx, pts[i][0] < 400 ? pts[i][1] : 0); }
      let lastPk = peaks.length ? peaks[peaks.length - 1][0] : st.fs, mn = [0, 1e9], ph = 0;
      pts.forEach((p) => { if (p[0] > lastPk && p[0] < 2000 && p[1] < mn[1]) mn = p; if (Math.abs(p[2]) > Math.abs(ph)) ph = p[2]; });
      if (st.box === 'vented') { let m2 = [0, 1e9]; pts.forEach((p) => { if (peaks.length > 1 && p[0] > peaks[0][0] && p[0] < peaks[1][0] && p[1] < m2[1]) m2 = p; }); M = { saddle: m2 }; } else M = {};
      const nom = [2, 4, 6, 8, 16].reduce((a, b) => (Math.abs(Math.log(b / (mn[1] * 1.15))) < Math.abs(Math.log(a / (mn[1] * 1.15))) ? b : a));
      Object.assign(M, { pts, peaks, min: mn, nom, top: Math.min(120, Math.max(24, Math.ceil(mx / 10) * 10 + 10)) });
      const iMax = st.v / mn[1], pMin = (st.v * st.v) / mn[1], pNom = (st.v * st.v) / nom;
      out.innerHTML = A.statBox('Resonance peak' + (peaks.length > 1 ? 's' : ''), peaks.map((p) => fmtHz(p[0])).join(' and ') || '—', peaks.length ? 'up to ' + fmt(Math.max(...peaks.map((p) => p[1])), 0) + ' Ω' : '')
        + (st.box === 'vented' && M.saddle && M.saddle[0] ? A.statBox('Dip between the peaks', fmtHz(M.saddle[0]), 'this is the box tuning Fb') : '')
        + A.statBox('Minimum impedance', fmt(mn[1], 1) + ' Ω', 'at ' + fmtHz(mn[0]) + ' — just above Re') + A.statBox('Nominal rating', nom + ' Ω', 'the label on the box')
        + A.statBox('Largest phase angle', fmt(ph, 0) + '°', Math.abs(ph) > 45 ? 'a demanding, reactive load' : 'an easy load')
        + A.statBox('Current at the minimum', fmt(iMax, 1) + ' A', fmt(pMin, 0) + ' W drawn (' + fmt(pNom, 0) + ' W by the nominal figure)');
      const T = {
        free: 'In free air there is one peak, exactly at Fs. Its height above Re and its width are how Qms and Qes are measured: a tall, narrow peak means little mechanical loss. Hang a known mass on the cone and the peak moves down — the shift reveals the moving mass.',
        sealed: 'The air in a sealed box stiffens the suspension, so the single peak moves <b>up</b> in frequency from Fs to the box resonance. The ratio of the two frequencies tells you Vas if you know the box volume: this is the “known volume” measuring method.',
        vented: 'A vented box shows the classic <b>double hump</b>. The dip between the two peaks is the tuning frequency Fb — there the port does the work, the cone barely moves, and the motor produces little back-voltage. Equal peak heights suggest the tuning sits near the driver\'s own resonance.',
      };
      tip.innerHTML = callout('mentor', T[st.box] + ' The amplifier sees the highest current demand at the <b>minimum</b>, not at the nominal figure — size the amplifier and cable for that.');
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. RC filter and the guitar-cable treble loss
     ====================================================================== */
  V.rcFilter = function (host) {
    const st = A.controls(host, [
      { key: 'mode', label: 'Circuit', type: 'select', value: 'lp', options: [['lp', 'RC low-pass (R in series, C to ground)'], ['hp', 'RC high-pass (C in series, R to ground)'], ['gtr', 'Passive guitar pickup + cable']] },
      logR('r', 'R — resistance (RC modes)', 100, 1e6, 10000, fmtOhm),
      logR('c', 'C — capacitance (RC modes)', 1e-11, 1e-4, 1e-8, fmtCap),
      { key: 'len', label: 'Cable length (guitar mode)', type: 'range', min: 0.3, max: 15, step: 0.1, value: 6, unit: 'm' },
      { key: 'cpm', label: 'Cable capacitance per metre', type: 'range', min: 50, max: 220, step: 5, value: 110, unit: 'pF/m' },
      { key: 'lh', label: 'Pickup inductance', type: 'range', min: 1.5, max: 9, step: 0.1, value: 3, unit: 'H' },
      { key: 'zin', label: 'Input it plugs into', type: 'select', value: '1e6', options: [['1e6', 'Instrument input, 1 MΩ'], ['2e5', 'Vintage-style input, 220 kΩ'], ['1e4', 'Line input, 10 kΩ (wrong!)']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const gtr = (f, len) => {
      const w = TAU * f, c = len * st.cpm * 1e-12 + 150e-12, rl = 1 / (1 / +st.zin + 1 / 250000), rs = 7000, L = st.lh;
      const zp = cdiv([rl, 0], [1, w * c * rl]);
      return dB(cabs(cdiv(zp, [rs + zp[0], w * L + zp[1]])));
    };
    const rc = (f) => { const x = f / fc(); return st.mode === 'lp' ? -10 * Math.log10(1 + x * x) : -10 * Math.log10(1 + 1 / (x * x)); };
    const fc = () => 1 / (TAU * P10(st.r) * P10(st.c));
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Level passed by the circuit at each frequency. In the two RC modes the vertical guide is the corner frequency, where the output is 3 dB down. In guitar mode the solid trace is your cable and the dotted trace is the same guitar through a 30 cm lead into a buffer or DI box.',
      draw(ctx, w, h) {
        const g = st.mode === 'gtr', ax = A.axes(ctx, w, h, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: g ? -24 : -36, max: g ? 12 : 3, label: 'Level (dB)' } });
        const fr = logspace(20, 20000, 260);
        if (g) {
          const ref = gtr(100, 0.3);
          A.plotLine(ctx, ax, fr.map((f) => [f, gtr(f, 0.3) - ref]), A.css('muted'), 2, [3, 3]);
          A.plotLine(ctx, ax, fr.map((f) => [f, gtr(f, st.len) - ref]), A.css('accent'), 2.5);
        } else {
          line(ctx, ax.x0, ax.Y(-3), ax.x1, ax.Y(-3), A.css('muted'), 1, [4, 4]);
          A.plotLine(ctx, ax, fr.map((f) => [f, rc(f)]), A.css('accent'), 2.5);
          const f0 = fc(); if (f0 > 20 && f0 < 20000) { const x = ax.X(f0); line(ctx, x, ax.y1, x, ax.y0, A.css('c3'), 1.5, [4, 3]); A.text(ctx, fmtHz(f0), Math.min(x + 5, ax.x1 - 60), ax.y1 + 14, { size: 11, weight: 700, color: A.css('c3') }); }
        }
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      if (st.mode === 'gtr') {
        const c = st.len * st.cpm * 1e-12 + 150e-12, f0 = 1 / (TAU * Math.sqrt(st.lh * c)), ref = gtr(100, st.len), fr = logspace(200, 20000, 300);
        let pk = [0, -99]; fr.forEach((f) => { const v = gtr(f, st.len) - ref; if (v > pk[1]) pk = [f, v]; });
        let f3 = null; for (const f of fr) if (f > pk[0] && gtr(f, st.len) - ref < -3) { f3 = f; break; }
        out.innerHTML = A.statBox('Total cable capacitance', fmtCap(st.len * st.cpm * 1e-12), 'plus about 150 pF inside the guitar') + A.statBox('Resonant peak', pk[1] > 0.5 ? fmtHz(pk[0]) : 'none', pk[1] > 0.5 ? '+' + fmt(pk[1], 1) + ' dB “presence” bump' : 'loaded flat: dull tone') + A.statBox('Treble is 3 dB down by', f3 ? fmtHz(f3) : '> 20 kHz', 'everything above falls 12 dB / octave') + A.statBox('Level at 6 kHz', fmt(gtr(6000, st.len) - ref, 1) + ' dB', 'short lead: ' + fmt(gtr(6000, 0.3) - gtr(100, 0.3), 1) + ' dB');
        tip.innerHTML = callout('mentor', +st.zin < 5e4 ? 'A line input loads the pickup so heavily that the peak disappears and the whole tone is dull and quiet. A passive instrument needs an input of about 1 MΩ — an instrument input, a DI box or a buffer pedal.' : `The pickup's large inductance and the cable's capacitance form a resonant low-pass filter near ${fmtHz(f0)}. A longer or more capacitive cable slides that peak downward and the top end goes with it. A buffer or active DI near the guitar isolates the pickup from the cable: after it, the low source impedance can drive tens of metres with no loss.`);
      } else {
        const f0 = fc(), tau = P10(st.r) * P10(st.c);
        out.innerHTML = A.statBox('Corner frequency', f0 > 1e5 ? fmt(f0 / 1000, 0) + ' kHz' : f0 < 1 ? fmt(f0, 2) + ' Hz' : fmtHz(f0), '1 ÷ (2π·R·C)') + A.statBox('Time constant τ = R·C', tau >= 1 ? fmt(tau, 2) + ' s' : tau >= 1e-3 ? fmt(tau * 1000, 2) + ' ms' : fmt(tau * 1e6, 1) + ' µs', '63 % of a step in one τ; settled in 5 τ') + A.statBox('Slope beyond the corner', '6 dB / octave', '20 dB per decade, first order') + A.statBox('Capacitor reactance at 1 kHz', fmtOhm(1 / (TAU * 1000 * P10(st.c))), 'equals R at the corner');
        tip.innerHTML = callout('mentor', st.mode === 'lp' ? (f0 < 15000 ? 'This corner is inside the audio band: the circuit is audibly rolling off treble. The same sum explains why a high source impedance (R) and a long cable (C) lose top end — and why low output impedances are standard.' : 'The corner is above the audio band, so the filter is inaudible but still blocks radio-frequency interference — exactly the job of the small capacitors at equipment inputs.') : (f0 > 30 ? 'This corner is audible: bass is being thinned. It is how a microphone\'s low-cut switch works, and what happens by accident when a coupling capacitor is too small for the load it feeds.' : 'With the corner below the audio band the capacitor simply blocks DC — phantom power, bias voltages, offsets — and lets all of the audio through. That is a coupling capacitor.'));
      }
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Attenuator (pad) calculator
     ====================================================================== */
  V.padCalc = function (host) {
    const st = A.controls(host, [
      { key: 'kind', label: 'Pad type', type: 'select', value: 'U', options: [['L', 'L-pad — unbalanced, bridging'], ['U', 'U-pad — balanced, bridging (microphone / line pad)'], ['T', 'T-pad — unbalanced, impedance-matched']] },
      { key: 'db', label: 'Attenuation wanted', type: 'range', min: 3, max: 50, step: 1, value: 20, unit: 'dB' },
      logR('zs', 'Source (output) impedance', 20, 10000, 150, fmtOhm),
      logR('zl', 'Load (input) impedance', 300, 200000, 2000, fmtOhm),
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    let M = null;
    function calc() {
      const zs = P10(st.zs), zl = P10(st.zl), K = lin(st.db);
      if (st.kind === 'T') {
        const N = K * K, r3 = (2 * Math.sqrt(N * zs * zl)) / (N - 1), r1 = (zs * (N + 1)) / (N - 1) - r3, r2 = (zl * (N + 1)) / (N - 1) - r3;
        const ok = r1 >= 0 && r2 >= 0, a = nearestE24(Math.max(r1, 0)), b = nearestE24(Math.max(r2, 0)), c = nearestE24(r3);
        const zo = b + 1 / (1 / c + 1 / (a + zs)), vth = c / (c + a + zs), loss = -dB((vth * zl) / (zo + zl)) + dB(zl / (zs + zl));
        return { ok, kind: 'T', vals: [['R1 (series, in)', a, r1], ['R2 (series, out)', b, r2], ['R3 (shunt)', c, r3]], loss, zin: a + 1 / (1 / c + 1 / (b + zl)), zout: zo, zs, zl };
      }
      const zin = Math.max(10 * zs, 1500), rp = (zs + zin) / K;
      const okRp = rp < zl * 0.98, r2 = okRp ? 1 / (1 / rp - 1 / zl) : rp, r1 = zin - rp;
      const bal = st.kind === 'U', a = nearestE24(bal ? r1 / 2 : r1), b = nearestE24(r2), r1s = bal ? 2 * a : a, rpS = 1 / (1 / b + 1 / zl);
      const loss = -dB(rpS / (zs + r1s + rpS)) + dB(zl / (zs + zl));
      return { ok: okRp, kind: st.kind, vals: bal ? [['R1a, R1b (one in each leg)', a, r1 / 2], ['R2 (across the two legs)', b, r2]] : [['R1 (series)', a, r1], ['R2 (shunt to ground)', b, r2]], loss, zin: r1s + rpS, zout: 1 / (1 / b + 1 / (r1s + zs)), zs, zl };
    }
    const cv = A.canvas(host, {
      height: 230,
      caption: 'Schematic of the selected pad between the source on the left and the load on the right, labelled with the nearest standard resistor values. In the balanced version the two signal wires are treated identically so the pad does not disturb the balance.',
      draw(ctx, w, h) {
        if (!M) return; const tx = A.css('text'), ac = A.css('accent'), mu = A.css('muted');
        const xl = Math.max(46, w * 0.1), xr = w - xl, yt = 62, yb = h - 52, bal = M.kind === 'U', isT = M.kind === 'T';
        const res = (x, y, wd, ht, lab, horiz) => { rr(ctx, x - wd / 2, y - ht / 2, wd, ht, 3, A.css('panel2'), ac); A.text(ctx, lab, x, horiz ? y - ht / 2 - 6 : y + 4, { align: horiz ? 'center' : 'left', size: 11, weight: 700, color: ac }); };
        ctx.lineWidth = 2;
        line(ctx, xl, yt, xr, yt, tx, 2); line(ctx, xl, yb, xr, yb, tx, 2);
        const xm = isT || w < 420 ? w / 2 : w * 0.62, x1 = xl + (xm - xl) * 0.5;
        ctx.lineWidth = 2; res(x1, yt, 54, 18, fmtOhm(M.vals[0][1]), true);
        if (bal) res(x1, yb, 54, 18, fmtOhm(M.vals[0][1]), true);
        if (isT) res(xm + (xr - xm) * 0.5, yt, 54, 18, fmtOhm(M.vals[1][1]), true);
        line(ctx, xm, yt, xm, yb, tx, 2); ctx.lineWidth = 2; rr(ctx, xm - 9, (yt + yb) / 2 - 26, 18, 52, 3, A.css('panel2'), ac);
        A.text(ctx, fmtOhm(M.vals[isT ? 2 : 1][1]), xm + 14, (yt + yb) / 2 + 4, { size: 11, weight: 700, color: ac });
        [[xl, 'source', fmtOhm(M.zs)], [xr, 'load', fmtOhm(M.zl)]].forEach(([x, a, b], i) => { ctx.fillStyle = A.css('bg'); ctx.strokeStyle = tx; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, (yt + yb) / 2, 20, 0, TAU); ctx.fill(); ctx.stroke(); A.text(ctx, i ? 'IN' : 'OUT', x, (yt + yb) / 2 + 4, { align: 'center', size: 10, weight: 700 }); A.text(ctx, a, x, yt - 30, { align: 'center', size: 11, color: mu }); A.text(ctx, b, x, yt - 16, { align: 'center', size: 11, weight: 700 }); });
        A.text(ctx, bal ? 'balanced pair: hot (top) and cold (bottom)' : 'signal (top) and ground (bottom)', w / 2, h - 16, { align: 'center', size: 11, color: mu });
        ctx.lineWidth = 1;
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      M = calc();
      out.innerHTML = M.vals.map(([k, v, exact]) => A.statBox(k, fmtOhm(v), 'exact: ' + fmtOhm(Math.max(0, exact)))).join('')
        + A.statBox('Loss with standard values', fmt(M.loss, 1) + ' dB', 'target ' + st.db + ' dB', Math.abs(M.loss - st.db) > 1.5 ? 'warn' : 'good')
        + A.statBox('Source now sees', fmtOhm(M.zin), M.zin >= 5 * M.zs ? 'comfortably bridging' : 'heavy load on the source', M.zin >= 5 * M.zs ? 'good' : 'warn') + A.statBox('Load now sees', fmtOhm(M.zout), M.zout * 5 <= M.zl ? 'low enough to drive it' : 'rather high for this input');
      let msg;
      if (!M.ok && M.kind === 'T') msg = 'A matched pad between two different impedances has a <b>minimum loss</b>; you are asking for less than that, so one resistor would have to be negative. Ask for more attenuation, or use a bridging L-pad instead.';
      else if (!M.ok) msg = 'With this little attenuation and this load, the shunt resistor is not needed — the load itself forms the lower half of the divider. Use just the series resistor(s), or ask for more attenuation.';
      else if (M.kind === 'U') msg = 'This is the pad inside an in-line microphone attenuator: two equal series resistors and one across the pair. Use 1 % resistors — any mismatch between the two legs converts hum that should cancel into signal. Remember that a resistive pad in a microphone line also drops phantom-power voltage.';
      else if (M.kind === 'T') msg = 'A T-pad presents the correct impedance in both directions, which matters for long video-style or radio-frequency lines, passive filters and old 600 Ω systems. Modern audio is bridging, so the simpler L or U pad is usually the right tool.';
      else msg = 'A plain voltage divider. Put it at the <b>input end</b> of the cable so the full-level signal travels the cable and noise picked up on the way is attenuated together with it.';
      tip.innerHTML = callout('mentor', msg + ' Pads lower the level; they do not lower the noise of whatever comes after — only pad when a stage would otherwise clip.');
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     6. Transformer lab
     ====================================================================== */
  V.transformerLab = function (host) {
    const st = A.controls(host, [
      { key: 'n', label: 'Turns ratio (primary : secondary)', type: 'range', min: -1.2, max: 1.5, step: 0.01, value: 1, fmt: (v) => (v >= 0 ? '1 : ' + fmt(P10(v), 1) + ' (step-up)' : fmt(P10(-v), 1) + ' : 1 (step-down)') },
      logR('zs', 'Source impedance', 10, 50000, 150, fmtOhm),
      logR('zl', 'Load impedance on the secondary', 100, 1e6, 10000, fmtOhm),
      { key: 'lv', label: 'Signal level into the primary', type: 'range', min: -40, max: 24, step: 1, value: 4, unit: 'dBu' },
      { key: 'f', label: 'Signal frequency', type: 'range', min: 10, max: 200, step: 1, value: 30, unit: 'Hz' },
      { key: 'core', label: 'Core size', type: 'select', value: '1', options: [['0.25', 'Small (budget DI / mic splitter)'], ['1', 'Medium (good line transformer)'], ['4', 'Large (premium output transformer)']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const sat = () => { const v = 0.775 * lin(st.lv), limit = 1.23 * 2.5 * (st.f / 20) * Math.sqrt(+st.core); return v / limit; };
    const cv = A.canvas(host, {
      height: 250, animate: true,
      caption: 'Left: the two windings on their shared core — the number of loops drawn follows the turns ratio. Right: the voltage across the secondary. When low-frequency level asks for more magnetic flux than the core can carry, the tops of the wave collapse: that is saturation, and it produces strong low-order distortion.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t), n = P10(st.n), tx = A.css('text'), cxm = Math.min(w * 0.3, 160), cy = h / 2 - 6;
        const np = n >= 1 ? 4 : Math.min(12, Math.round(4 / n)), ns = n >= 1 ? Math.min(12, Math.round(4 * n)) : 4;
        rr(ctx, cxm - 7, cy - 78, 14, 156, 3, A.css('muted'));
        const coil = (x, k, dir, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2.5; const hh = Math.min(140, k * 16), y0 = cy - hh / 2; ctx.beginPath(); for (let i = 0; i < k; i++) { const y = y0 + (i * hh) / k; ctx.moveTo(x, y); ctx.bezierCurveTo(x + dir * 26, y, x + dir * 26, y + hh / k, x, y + hh / k); } ctx.stroke(); ctx.lineWidth = 1; };
        coil(cxm - 12, np, -1, A.css('accent')); coil(cxm + 12, ns, 1, A.css('c3'));
        A.text(ctx, 'primary', cxm - 30, cy + 96, { align: 'center', size: 11, color: A.css('accent'), weight: 700 }); A.text(ctx, 'secondary', cxm + 36, cy + 96, { align: 'center', size: 11, color: A.css('c3'), weight: 700 });
        const s = sat(), x0 = Math.max(cxm + 80, w * 0.48), x1 = w - 14, amp = Math.min(70, h * 0.3);
        line(ctx, x0, cy, x1, cy, A.css('line'), 1);
        ctx.strokeStyle = A.css('muted'); ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5; ctx.beginPath();
        for (let x = x0; x <= x1; x++) { const p = ((x - x0) / (x1 - x0)) * TAU * 2 - tt * 2.4; const y = cy - Math.sin(p) * amp; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = s > 1 ? A.css('bad') : A.css('c3'); ctx.lineWidth = 2.5; ctx.beginPath();
        for (let x = x0; x <= x1; x++) {
          const p = ((x - x0) / (x1 - x0)) * TAU * 2 - tt * 2.4; let v = Math.sin(p);
          if (s > 1) { const flux = -Math.cos(p) * s, over = Math.max(0, Math.abs(flux) - 1); v *= Math.exp(-over * 3.2); }
          const y = cy - v * amp; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        } ctx.stroke(); ctx.lineWidth = 1;
        A.text(ctx, s > 1 ? 'core saturating' : 'clean', (x0 + x1) / 2, 18, { align: 'center', size: 12, weight: 700, color: s > 1 ? A.css('bad') : A.css('good') });
        A.text(ctx, fmt(st.f, 0) + ' Hz at ' + (st.lv > 0 ? '+' : '') + st.lv + ' dBu', (x0 + x1) / 2, h - 10, { align: 'center', size: 11, color: A.css('muted') });
        void tx;
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const n = P10(st.n), zs = P10(st.zs), zl = P10(st.zl), refl = zl / (n * n), gIdeal = dB(n), gReal = dB((n * refl) / (zs + refl)), zo = zs * n * n, s = sat();
      const fMin = st.f * s;
      out.innerHTML = A.statBox('Voltage gain, unloaded', (gIdeal >= 0 ? '+' : '') + fmt(gIdeal, 1) + ' dB', 'ratio ' + fmt(n, 2) + ' ×') + A.statBox('Load as seen by the source', fmtOhm(refl), 'load ÷ ratio²', refl < 5 * zs ? 'warn' : 'good')
        + A.statBox('Gain actually obtained', (gReal >= 0 ? '+' : '') + fmt(gReal, 1) + ' dB', fmt(gIdeal - gReal, 1) + ' dB lost to loading') + A.statBox('Output impedance at the secondary', fmtOhm(zo), 'source × ratio²')
        + A.statBox('Core flux demand', fmt(s * 100, 0) + ' %', s > 1 ? 'saturating — distortion' : 'within limits', s > 1 ? 'bad' : s > 0.7 ? 'warn' : 'good') + A.statBox('Clean down to about', fmtHz(Math.max(2, fMin)), 'at this level and core size');
      let msg;
      if (s > 1) msg = 'Flux in the core is proportional to <b>voltage ÷ frequency</b>, so the deepest, loudest notes saturate first. Lower the level, use a bigger core — or feed the transformer from a lower source impedance, which also reduces low-frequency distortion.';
      else if (refl < 3 * zs) msg = 'The step-up ratio is now so high that the load, divided by the ratio squared, is dragging the source down — you gain turns but lose signal. There is always a best ratio: for a 150–200 Ω microphone into a valve or FET stage, about 1:5 to 1:10.';
      else if (n > 1.5) msg = 'A step-up transformer gives “free” voltage gain with almost no added noise — which is why ribbon and moving-coil microphones, and many classic microphone preamplifiers, use one. The price: the source impedance is multiplied by the ratio squared.';
      else if (n < 0.7) msg = 'A step-down transformer trades voltage for a much lower output impedance — the principle of the passive DI box (often about 12:1): a 20 dB loss, but a high-impedance instrument can now drive a long balanced microphone line, with the ground loop broken.';
      else msg = 'At 1:1 a transformer changes nothing electrically — its value is <b>isolation</b>. No wire connects the two sides, so ground-loop current cannot flow and common-mode interference is rejected very well.';
      tip.innerHTML = callout('mentor', msg);
    }
    upd();
  };

  /* ======================================================================
     7. Meter ballistics — VU, peak-programme and digital peak
     ====================================================================== */
  V.meterBallistics = function (host) {
    const st = A.controls(host, [
      { key: 'src', label: 'Signal', type: 'select', value: 'drums', options: [['drums', 'Drum kit (short, sharp hits)'], ['vocal', 'Vocal (sustained phrases)'], ['mix', 'Drums + vocal'], ['tone', 'Line-up tone at alignment level']] },
      { key: 'align', label: 'Alignment level (0 VU equals)', type: 'select', value: '-18', options: [['-18', '−18 dBFS'], ['-20', '−20 dBFS'], ['-14', '−14 dBFS'], ['-12', '−12 dBFS']] },
      { key: 'gain', label: 'Input gain', type: 'range', min: -20, max: 12, step: 0.5, value: 0, unit: 'dB' },
    ], () => { reset(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    let s = null, hist = [], lastStat = 0;
    const reset = () => { s = { t: 0, v1: 0, v2: 0, ppm: 0, pk: 0, hold: 0, holdT: 0, maxPk: 0, maxVu: 0 }; hist = []; };
    reset();
    function env(t) {
      let d = 0, v = 0;
      const tb = t % 2, hit = (t0, a, tau) => { const x = tb - t0; return x >= 0 ? a * Math.exp(-x / tau) * Math.min(1, x / 0.002) : 0; };
      d = Math.max(hit(0, 0.8, 0.045), hit(1.0, 0.75, 0.045), hit(0.5, 0.9, 0.06), hit(1.5, 0.9, 0.06), hit(0.25, 0.16, 0.015), hit(0.75, 0.16, 0.015), hit(1.25, 0.16, 0.015), hit(1.75, 0.16, 0.015));
      const ph = t % 4.5; v = ph < 3.4 ? 0.2 * (0.55 + 0.45 * Math.pow(Math.sin(t * 4.3), 2)) * Math.min(1, ph / 0.08) * Math.min(1, (3.4 - ph) / 0.2) * (0.8 + 0.2 * Math.sin(t * 0.9)) : 0;
      if (st.src === 'drums') return [d, 0.32 * d];
      if (st.src === 'vocal') return [v, 0.6 * v];
      if (st.src === 'mix') return [Math.min(1.5, d * 0.85 + v), 0.3 * d + 0.6 * v];
      const a = lin(+st.align); return [a, 0.637 * a];
    }
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top: the last few seconds of the signal\'s peak level. Below: three meters fed the identical signal, all drawn on one digital scale so they can be compared. The averaging meter is slow by design and shows loudness-like level; the peak-programme meter rises fast and falls slowly; the digital meter catches every sample peak and holds the highest for a moment. The tick on each bar is the alignment level.',
      draw(ctx, w, h, t, dt) {
        const g = lin(st.gain), al = lin(+st.align), steps = Math.max(1, Math.round((dt || 0.016) * 1000));
        for (let i = 0; i < steps; i++) {
          s.t += 0.001; const e = env(s.t), p = e[0] * g, r = e[1] * g;
          s.v1 += (r - s.v1) * (0.001 / 0.065); s.v2 += (s.v1 - s.v2) * (0.001 / 0.065);
          s.ppm = p > s.ppm ? s.ppm + (p - s.ppm) * (0.001 / 0.0017) : s.ppm * Math.pow(10, (-8.6 * 0.001) / 20);
          s.pk = p; if (p >= s.hold) { s.hold = p; s.holdT = s.t; } else if (s.t - s.holdT > 1.2) s.hold *= Math.pow(10, (-20 * 0.001) / 20);
          s.maxPk = Math.max(s.maxPk, p); s.maxVu = Math.max(s.maxVu, s.v2);
          if (i % 12 === 0) { hist.push(p); if (hist.length > 320) hist.shift(); }
        }
        const x0 = 14, x1 = w - 14, D = (v) => A.clamp(dB(v), -50, 3), X = (d) => x0 + ((d + 50) / 53) * (x1 - x0);
        const hy = 16, hh = 62; rr(ctx, x0, hy, x1 - x0, hh, 4, A.css('panel2'));
        ctx.fillStyle = A.alpha(A.css('accent'), 0.7); const bwid = (x1 - x0) / 320;
        hist.forEach((p, i) => { const yy = Math.min(1, p) * (hh - 4); ctx.fillRect(x0 + i * bwid, hy + hh - yy, Math.max(1, bwid), yy); });
        A.text(ctx, 'signal peaks, last 4 seconds', x0 + 6, hy + 14, { size: 10, color: A.css('muted') });
        const vuDb = dB(s.v2 / (0.637 * al)), bars = [
          [w < 520 ? 'Averaging (VU-type)' : 'Averaging (VU-type) meter', s.v2 / 0.637, (vuDb >= 0 ? '+' : '') + fmt(Math.max(-30, vuDb), 1) + ' VU', A.css('good')],
          [w < 520 ? 'Peak-programme type' : 'Peak-programme-type meter', s.ppm, (dB(s.ppm / al) >= 0 ? '+' : '') + fmt(Math.max(-40, dB(s.ppm / al)), 1) + (w < 520 ? ' dB' : ' dB re alignment'), A.css('c3')],
          [w < 520 ? 'Digital sample peak' : 'Digital sample-peak meter', s.pk, fmt(D(s.hold), 1) + (w < 520 ? ' dBFS' : ' dBFS (held)'), A.css('accent')],
        ];
        bars.forEach(([lab, v, read, col], i) => {
          const y = hy + hh + 34 + i * 66; A.text(ctx, lab, x0, y - 6, { size: 12, weight: 700 }); A.text(ctx, read, x1, y - 6, { size: 12, align: 'right', weight: 700, color: col });
          rr(ctx, x0, y, x1 - x0, 20, 4, A.css('panel2'));
          const xe = X(D(v)); ctx.fillStyle = col; ctx.fillRect(x0, y, Math.max(0, xe - x0), 20);
          if (X(0) < xe) { ctx.fillStyle = A.css('bad'); ctx.fillRect(X(0), y, xe - X(0), 20); }
          if (i === 2) { const xh = X(D(s.hold)); ctx.fillStyle = A.css('text'); ctx.fillRect(xh - 1.5, y - 2, 3, 24); }
          const xa = X(+st.align); ctx.fillStyle = A.css('text'); ctx.fillRect(xa - 1, y - 4, 2, 28);
          for (let d = -48; d <= 0; d += 6) { const x = X(d); ctx.fillStyle = A.css('muted'); ctx.fillRect(x, y + 20, 1, 4); if (i === 2 && (w > 500 || d % 12 === 0)) A.text(ctx, String(d), x, y + 36, { size: 9, align: 'center', color: A.css('muted') }); }
        });
        A.text(ctx, 'dBFS', x1, hy + hh + 34 + 2 * 66 + 50, { size: 9, align: 'right', color: A.css('muted') });
        if (s.t - lastStat > 0.3 || s.t < lastStat) { lastStat = s.t; stats(); }
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function stats() {
      const al = lin(+st.align), gap = dB(s.maxPk) - dB(s.maxVu / 0.637);
      out.innerHTML = A.statBox('Highest sample peak so far', fmt(dB(s.maxPk), 1) + ' dBFS', s.maxPk >= 1 ? 'CLIPPED' : fmt(-dB(s.maxPk), 1) + ' dB of headroom left', s.maxPk >= 1 ? 'bad' : 'good')
        + A.statBox('Highest averaging-meter reading', fmt(dB(s.maxVu / (0.637 * al)), 1) + ' VU', '0 VU = ' + st.align + ' dBFS') + A.statBox('Peaks above the average reading', fmt(Math.max(0, gap), 1) + ' dB', st.src === 'tone' ? 'steady tone: all meters agree' : 'this is why headroom exists');
      const T = { drums: 'Drum hits are over in a few hundredths of a second. The averaging meter barely twitches while the real peaks are 15–20 dB higher — set drum levels by the peak meter, never by a VU-type meter alone.', vocal: 'Sustained sounds give the averaging meter time to rise, so it tracks loudness well — and the gap to the true peaks is small, roughly 6–10 dB.', mix: 'On a full mix the averaging meter tells you how loud it feels and the peak meter tells you how close you are to clipping. You need both — which is exactly what a modern loudness meter with a true-peak reading provides.', tone: 'With a steady sine wave at alignment level every meter agrees: 0 VU, the reference mark on the peak-programme meter, and the chosen dBFS figure. This is how a studio lines up its analogue and digital equipment.' };
      tip.innerHTML = callout('mentor', T[st.src] + (s.maxPk >= 1 ? ' <b>The digital meter has hit full scale: the converter is clipping. Reduce the input gain.</b>' : ''));
    }
    stats(); void cv;
  };

  /* ======================================================================
     8. FFT lab — resolution, windows and leakage
     ====================================================================== */
  V.fftLab = function (host) {
    const SR = 48000;
    const st = A.controls(host, [
      logR('f1', 'Tone frequency', 100, 10000, 1000, fmtHz),
      { key: 'n', label: 'FFT size (samples per block)', type: 'select', value: '1024', numeric: true, options: [256, 512, 1024, 2048, 4096, 8192, 16384].map((n) => [n, n + ' samples']) },
      { key: 'win', label: 'Window', type: 'select', value: 'rect', options: [['rect', 'Rectangular (none)'], ['hann', 'Hann'], ['flat', 'Flat-top']] },
      { key: 't2', label: 'Add a second, quieter tone', type: 'check', value: false },
      { key: 'sep', label: 'Second tone: spacing above the first', type: 'range', min: 5, max: 500, step: 5, value: 100, unit: 'Hz' },
      { key: 'l2', label: 'Second tone: level', type: 'range', min: -90, max: 0, step: 1, value: -40, unit: 'dB' },
      { key: 'noise', label: 'Add background noise', type: 'check', value: false },
      { key: 'zoom', label: 'Zoom in around the tone', type: 'check', value: false },
    ], () => upd());
    const row = el('div', { class: 'row' }); const snap = el('button', { html: 'Move the tone exactly onto an FFT line' }); row.appendChild(snap); host.appendChild(row);
    snap.onclick = () => { const df = SR / st.n, f = Math.round(P10(st.f1) / df) * df; st.set('f1', Math.log10(f)); };
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    let S = [];
    const cv = A.canvas(host, {
      height: 320,
      caption: 'The spectrum an analyser would display for one block of samples. A perfect result would be a single thin line at the tone frequency; the skirts spreading to either side are leakage, caused by the block cutting the wave off mid-cycle. Each dot in the zoomed view is one FFT line.',
      draw(ctx, w, h) {
        const f0 = P10(st.f1), z = st.zoom, df = SR / st.n;
        const xmin = z ? Math.max(20, f0 - Math.max(600, df * 14)) : 50, xmax = z ? f0 + Math.max(600, df * 14) : 20000;
        const ax = A.axes(ctx, w, h, { x: { min: xmin, max: xmax, log: !z, label: 'Frequency (Hz)', fmt: z ? (v) => fmt(v, 0) : null }, y: { min: -130, max: 6, label: 'Level (dB)' } });
        const pts = S.filter((p) => p[0] >= xmin && p[0] <= xmax);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2);
        if (z && pts.length < 90) pts.forEach((p) => { ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.arc(ax.X(p[0]), ax.Y(Math.max(-130, p[1])), 2.5, 0, TAU); ctx.fill(); });
        const x = ax.X(f0); line(ctx, x, ax.y1, x, ax.y0, A.css('c3'), 1, [3, 3]);
        if (st.t2) { const x2 = ax.X(f0 + st.sep); if (x2 < ax.x1) { line(ctx, x2, ax.y1, x2, ax.y0, A.css('good'), 1, [3, 3]); A.text(ctx, '2nd tone', Math.min(x2 + 4, ax.x1 - 50), ax.y1 + 14, { size: 10, color: A.css('good'), weight: 700 }); } }
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const N = st.n, re = new Float64Array(N), im = new Float64Array(N), f0 = P10(st.f1), a2 = st.t2 ? lin(st.l2) : 0;
      let ws = 0;
      for (let i = 0; i < N; i++) {
        const u = (TAU * i) / N;
        const wv = st.win === 'hann' ? 0.5 - 0.5 * Math.cos(u) : st.win === 'flat' ? 0.21557895 - 0.41663158 * Math.cos(u) + 0.277263158 * Math.cos(2 * u) - 0.083578947 * Math.cos(3 * u) + 0.006947368 * Math.cos(4 * u) : 1;
        ws += wv;
        re[i] = (Math.sin((TAU * f0 * i) / SR + 0.4) + a2 * Math.sin((TAU * (f0 + st.sep) * i) / SR) + (st.noise ? gauss() * 0.003 : 0)) * wv;
      }
      fft(re, im);
      S = []; for (let k = 1; k < N / 2; k++) S.push([(k * SR) / N, dB((2 * Math.hypot(re[k], im[k])) / ws)]);
      const df = SR / N, off = Math.abs(f0 / df - Math.round(f0 / df)), pk = Math.max(...S.map((p) => p[1]));
      const bw = st.win === 'rect' ? 1 : st.win === 'hann' ? 1.5 : 3.77;
      let seen = '—';
      if (st.t2) { const k2 = Math.round((f0 + st.sep) / df), k1 = Math.round(f0 / df); const v2 = S[k2 - 1] ? S[k2 - 1][1] : -200; let mn = 0; for (let k = Math.min(k1, k2); k <= Math.max(k1, k2); k++) if (S[k - 1]) mn = Math.min(mn, S[k - 1][1]); seen = k2 - k1 >= 3 && v2 - mn > 6 ? 'visible' : 'hidden'; }
      out.innerHTML = A.statBox('Frequency resolution', fmt(df, df < 10 ? 2 : 1) + ' Hz', '48 000 ÷ ' + N + ' — spacing of the FFT lines') + A.statBox('Length of one block', fmt((N / SR) * 1000, 1) + ' ms', 'finer frequency = slower in time')
        + A.statBox('Tone sits', off < 0.02 ? 'exactly on a line' : fmt(off, 2) + ' of a line off', off < 0.02 ? 'no leakage at all' : 'so it leaks into its neighbours', off < 0.02 ? 'good' : 'warn')
        + A.statBox('Displayed peak level', fmt(pk, 2) + ' dB', Math.abs(pk) < 0.1 ? 'correct (true level is 0 dB)' : 'reads ' + fmt(-pk, 1) + ' dB low', Math.abs(pk) < 0.2 ? 'good' : 'warn') + A.statBox('Width of the main lobe', '≈ ' + fmt(bw * 2, 1) + ' lines', st.win === 'rect' ? 'narrowest, worst skirts' : st.win === 'hann' ? 'good all-round choice' : 'wide, but level is exact')
        + (st.t2 ? A.statBox('Second tone', seen, seen === 'visible' ? 'resolved from the first' : 'lost in leakage or too close', seen === 'visible' ? 'good' : 'bad') : '');
      let msg;
      if (off < 0.02 && st.win === 'rect') msg = 'When a whole number of cycles fits the block there is nothing to leak — which is why test systems that generate their own signal lock it to the FFT length. Real music and noise never line up so neatly; nudge the frequency and watch the skirts return.';
      else if (st.win === 'rect') msg = 'With no window, the wave is chopped abruptly at the block edges. The FFT assumes the block repeats for ever, sees a click at every join, and smears energy across the whole spectrum: skirts only fall 6 dB per octave. A quiet neighbouring tone is buried.';
      else if (st.win === 'hann') msg = 'The Hann window fades each block in and out, so there is no click at the join. Skirts collapse (falling 18 dB per octave) and quiet components appear. The cost: a main lobe half as wide again, and a level reading up to 1.4 dB low. It is the normal choice for noise and music.';
      else msg = 'The flat-top window has a very wide main lobe, so close tones merge — but the top of that lobe is flat, so the level reads correctly (within about 0.01 dB) wherever the tone falls. Use it when measuring the <b>level</b> of a tone or harmonic; use Hann when separating frequencies.';
      tip.innerHTML = callout('mentor', msg);
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     9. Gating lab — windowing reflections out of a measurement
     ====================================================================== */
  function biquad(x, type, f0, q, sr) {
    const w0 = (TAU * f0) / sr, cs = Math.cos(w0), al = Math.sin(w0) / (2 * q); let b0, b1, b2;
    if (type === 'hp') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; } else { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; }
    const a0 = 1 + al, a1 = -2 * cs, a2 = 1 - al, y = new Float64Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) { const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0; x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v; }
    return y;
  }
  V.gatingLab = function (host) {
    const SR = 48000, N = 16384;
    const st = A.controls(host, [
      { key: 'gate', label: 'Gate (time window) length', type: 'range', min: 1, max: 60, step: 0.5, value: 4, unit: 'ms' },
      { key: 'fl', label: 'Floor reflection arrives after', type: 'range', min: 1.5, max: 15, step: 0.1, value: 5, unit: 'ms' },
      { key: 'fg', label: 'Floor reflection strength', type: 'range', min: 0, max: 0.95, step: 0.05, value: 0.7 },
      { key: 'room', label: 'Include later room reflections and reverberation', type: 'check', value: true },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    let direct = new Float64Array(N); direct[24] = 1;
    direct = biquad(biquad(direct, 'hp', 65, 0.707, SR), 'lp', 17000, 0.707, SR);
    const tail = new Float64Array(N); { let sd = 7; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 1073741823.5 - 1; }; for (let i = Math.floor(0.03 * SR); i < N; i++) tail[i] = rnd() * 0.05 * Math.exp(-(i / SR - 0.03) / 0.06); }
    const mag = (x) => { const re = Float64Array.from(x), im = new Float64Array(N); fft(re, im); const o = []; for (let k = 1; k < N / 2; k++) { const f = (k * SR) / N; if (f >= 20 && f <= 20000) o.push([f, dB(Math.hypot(re[k], im[k]))]); } return o; };
    const thin = (pts) => { const o = []; let lf = 0; pts.forEach((p) => { if (p[0] > lf * 1.012) { o.push(p); lf = p[0]; } }); return o; };
    const TRUE = thin(mag(direct));
    let M = null;
    const cv = A.canvas(host, {
      height: 440,
      caption: 'Upper panel: the measured impulse response — the tall spike is the direct sound, later spikes are reflections. The shaded span is what the gate keeps. Lower panel: the frequency response computed from everything (thin, ragged trace), from the gated part only (bold trace), and the loudspeaker\'s true response (dotted). Left of the vertical guide the gated result cannot be trusted.',
      draw(ctx, w, h) {
        if (!M) return; const h1 = Math.round(h * 0.36);
        const ax = A.axes(ctx, w, h1, { x: { min: -3, max: 60, label: '', ticks: [0, 10, 20, 30, 40, 50, 60], fmt: (v) => v + ' ms' }, y: { min: -0.6, max: 1.1, ticks: [0], fmt: () => '0' }, pad: { b: 22, l: 52 } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.16); ctx.fillRect(ax.X(0), ax.y1, ax.X(Math.min(60, st.gate)) - ax.X(0), ax.y0 - ax.y1);
        const pk = M.pk; const pts = []; for (let i = 0; i < 0.06 * SR; i += 2) { let a = M.ir[i], b = M.ir[i + 1] || 0; pts.push([((i - 24) / SR) * 1000, (Math.abs(a) > Math.abs(b) ? a : b) / pk]); }
        A.plotLine(ctx, ax, pts, A.css('accent'), 1.5);
        A.text(ctx, 'gate', Math.min(ax.X(Math.min(60, st.gate)) - 4, ax.x1 - 4), ax.y1 + 14, { size: 11, align: 'right', color: A.css('good'), weight: 700 });
        A.text(ctx, 'floor', ax.X(st.fl) + 4, ax.Y(0.8), { size: 10, color: A.css('muted') }); A.text(ctx, 'direct', ax.X(0) + 5, ax.Y(-0.42), { size: 10, color: A.css('muted') });
        ctx.save(); ctx.translate(0, h1);
        const ax2 = A.axes(ctx, w, h - h1, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: -30, max: 12, label: 'Level (dB)' }, pad: { t: 8 } });
        const fv = 1000 / st.gate; if (fv > 20) { ctx.fillStyle = A.alpha(A.css('bad'), 0.1); ctx.fillRect(ax2.x0, ax2.y1, ax2.X(Math.min(20000, fv)) - ax2.x0, ax2.y0 - ax2.y1); const x = ax2.X(Math.min(20000, fv)); line(ctx, x, ax2.y1, x, ax2.y0, A.css('bad'), 1.5, [5, 3]); A.text(ctx, 'valid above ' + fmtHz(fv), Math.min(x + 5, ax2.x1 - 110), ax2.y0 - 8, { size: 11, weight: 700, color: A.css('bad') }); }
        A.plotLine(ctx, ax2, M.full, A.css('muted'), 1);
        A.plotLine(ctx, ax2, TRUE, A.css('text'), 1.5, [2, 3]);
        A.plotLine(ctx, ax2, M.gated, A.css('accent'), 2.5);
        ctx.restore();
      },
    });
    host.appendChild(A.legend([[A.css('muted'), 'No gate (room included)'], [A.css('accent'), 'Gated'], [A.css('text'), 'True loudspeaker response', true]]));
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const ir = new Float64Array(N), dl = Math.round((st.fl / 1000) * SR);
      for (let i = 0; i < N; i++) { ir[i] = direct[i] + (i >= dl ? st.fg * direct[i - dl] : 0); }
      if (st.room) { [[18, 0.35], [25.5, -0.3], [33, 0.25], [41, 0.2]].forEach(([ms, g]) => { const d = Math.round((ms / 1000) * SR); for (let i = d; i < N; i++) ir[i] += g * direct[i - d]; }); for (let i = 0; i < N; i++) ir[i] += tail[i]; }
      const g = new Float64Array(N), ge = 24 + Math.round((st.gate / 1000) * SR), fade = Math.max(8, Math.round((ge - 24) * 0.25));
      for (let i = 0; i < Math.min(N, ge); i++) g[i] = ir[i] * (i > ge - fade ? 0.5 + 0.5 * Math.cos((Math.PI * (i - (ge - fade))) / fade) : 1);
      let pk = 0; for (let i = 0; i < 400; i++) pk = Math.max(pk, Math.abs(ir[i]));
      M = { ir, pk, full: thin(mag(ir)), gated: thin(mag(g)) };
      const fv = 1000 / st.gate, clean = st.gate < st.fl && st.fg > 0, incl = st.gate >= st.fl && st.fg > 0;
      out.innerHTML = A.statBox('Lowest valid frequency', fmtHz(fv), '≈ 1 ÷ gate length') + A.statBox('Frequency resolution', fmtHz(fv), 'features narrower than this are smoothed away')
        + A.statBox('Floor reflection', incl ? 'inside the gate' : 'removed', incl ? 'comb filtering in the result' : 'room-free result', incl ? 'bad' : 'good') + A.statBox('First comb notch would be at', st.fg > 0 ? fmtHz(500 / st.fl) : '—', 'half a cycle fits the delay')
        + A.statBox('Path difference for that delay', fmt((st.fl / 1000) * C0, 2) + ' m', 'raise both speaker and microphone to increase it');
      tip.innerHTML = callout('mentor', incl ? 'The gate is long enough to let the floor reflection in, so the “loudspeaker” response shows regular notches that are really the room. Shorten the gate until it closes just before the reflection arrives.' : clean && fv > 300 ? `The reflections are gone — but with only ${fmt(st.gate, 1)} ms of data nothing below about ${fmtHz(fv)} is real. To see lower, delay the first reflection: lift the loudspeaker and microphone to mid-height in the biggest space available, or measure outdoors. Bass is measured separately with the microphone almost touching the cone, then spliced on.` : 'A good compromise: the first reflection is excluded and the valid range reaches reasonably low. In a normal domestic room 3–5 ms is typical; a large hall or outdoor mast can give 15–20 ms.');
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     10. Coherence lab — dual-channel measurement
     ====================================================================== */
  V.coherenceLab = function (host) {
    const st = A.controls(host, [
      { key: 'snr', label: 'Signal level above background noise', type: 'range', min: -10, max: 50, step: 1, value: 30, unit: 'dB' },
      { key: 'rev', label: 'Reverberation reaching the microphone', type: 'range', min: 0, max: 1.5, step: 0.05, value: 0.2 },
      { key: 'dly', label: 'Uncorrected delay between the two channels', type: 'range', min: 0, max: 40, step: 0.5, value: 0, unit: 'ms' },
      { key: 'avg', label: 'Number of averages', type: 'select', value: '16', numeric: true, options: [1, 2, 4, 8, 16, 64].map((n) => [n, String(n)]) },
    ], () => upd());
    const row = el('div', { class: 'row' }); const again = el('button', { html: A.icon('play') + ' Measure again' }); row.appendChild(again); host.appendChild(row);
    again.onclick = () => upd();
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const FR = logspace(25, 20000, 150), T = 85;
    const Htrue = (f) => { const u = f / 70, hp = (u * u) / Math.hypot(1 - u * u, u / 0.7), v = f / 16000, lp = 1 / Math.hypot(1 - v * v, v / 0.7), pk = 1 + 0.5 * Math.exp(-Math.pow(Math.log2(f / 2500) / 0.35, 2)), dip = 1 - 0.45 * Math.exp(-Math.pow(Math.log2(f / 400) / 0.25, 2)); return hp * lp * pk * dip; };
    let M = null;
    const cv = A.canvas(host, {
      height: 420,
      caption: 'Upper panel: the transfer function the analyser reports (solid) against the system\'s true response (dotted). Lower panel: coherence — the share of the microphone signal that is really caused by the reference signal, from 0 (none, do not trust) to 1 (all of it). The guide marks 0.8, a common “trust it” threshold.',
      draw(ctx, w, h) {
        if (!M) return; const h1 = Math.round(h * 0.58);
        const ax = A.axes(ctx, w, h1, { x: { min: 25, max: 20000, log: true }, y: { min: -30, max: 12, label: 'Magnitude (dB)' }, pad: { b: 22 } });
        A.plotLine(ctx, ax, FR.map((f) => [f, dB(Htrue(f))]), A.css('text'), 1.5, [2, 3]);
        A.plotLine(ctx, ax, M.h, A.css('accent'), 2);
        ctx.save(); ctx.translate(0, h1);
        const ax2 = A.axes(ctx, w, h - h1, { x: { min: 25, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: 0, max: 1, label: 'Coherence', ticks: [0, 0.5, 0.8, 1] }, pad: { t: 8 } });
        line(ctx, ax2.x0, ax2.Y(0.8), ax2.x1, ax2.Y(0.8), A.css('good'), 1, [4, 3]);
        A.plotFill(ctx, ax2, M.c, A.alpha(A.css('bad'), 0.25)); A.plotLine(ctx, ax2, M.c, A.css('bad'), 2);
        ctx.restore();
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'Measured transfer function'], [A.css('text'), 'True response', true], [A.css('bad'), 'Coherence']]));
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const K = st.avg, nz = lin(-st.snr), keep = Math.max(0, 1 - st.dly / T), lost = Math.sqrt(Math.max(0, 1 - keep * keep));
      const h = [], c = []; let good = 0, err = 0;
      FR.forEach((f) => {
        const H = Htrue(f); let sxx = 0, syy = 0, sr = 0, si = 0;
        const rv = st.rev * 0.5 * Math.min(1, Math.pow(f / 150, 0.5)) * (f > 6000 ? Math.pow(6000 / f, 0.7) : 1);
        for (let k = 0; k < K; k++) {
          const xr = gauss(), xi = gauss(), yr = H * keep * xr + H * lost * gauss() + H * rv * gauss() + nz * gauss() * (1 + 60 / f), yi = H * keep * xi + H * lost * gauss() + H * rv * gauss() + nz * gauss() * (1 + 60 / f);
          sxx += xr * xr + xi * xi; syy += yr * yr + yi * yi; sr += yr * xr + yi * xi; si += yi * xr - yr * xi;
        }
        const g2 = (sr * sr + si * si) / (sxx * syy), hm = Math.hypot(sr, si) / sxx;
        h.push([f, dB(hm)]); c.push([f, g2]); if (g2 > 0.8) good++; err += Math.abs(dB(hm) - dB(H));
      });
      M = { h, c };
      out.innerHTML = A.statBox('Band with coherence above 0.8', fmt((good / FR.length) * 100, 0) + ' %', K === 1 ? 'meaningless with one average' : 'of the audio range', K === 1 ? 'warn' : good / FR.length > 0.7 ? 'good' : 'bad')
        + A.statBox('Average error of the trace', fmt(err / FR.length, 1) + ' dB', 'against the true response') + A.statBox('Signal kept by time alignment', fmt(keep * 100, 0) + ' %', st.dly > 0 ? 'delay finder not run' : 'channels aligned', keep < 0.8 ? 'bad' : 'good');
      let msg;
      if (K === 1) msg = 'With a single block the coherence is always exactly 1 — there is nothing to compare, so the number is meaningless and the trace is just one noisy snapshot. Coherence only becomes informative once several blocks are averaged.';
      else if (st.dly > 8) msg = 'The microphone signal arrives later than the reference, so each analysis block compares sound that does not belong together. Coherence collapses at <b>all</b> frequencies and the level reads low. Run the delay finder and insert the delay in the reference channel — always the first step.';
      else if (st.snr < 12) msg = 'Background noise is close to the signal level. Coherence falls first where the system is weakest — below the loudspeaker\'s low limit and at the very top. More averages steady the trace; more level or a quieter room actually raises the coherence.';
      else if (st.rev > 0.7) msg = 'The microphone is hearing a lot of late, reverberant sound that the analyser cannot connect to the current block. Coherence drops in the mid band. Move the microphone closer, or use a longer analysis window — and do not equalise dips that sit in low-coherence regions.';
      else msg = 'Healthy data: coherence near 1 across the loudspeaker\'s working range, falling only at the band edges where it produces no output. Wherever coherence is high, the trace can be trusted and equalised; wherever it is low, find out why before touching a filter.';
      tip.innerHTML = callout('mentor', msg);
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     11. Distortion lab
     ====================================================================== */
  V.distortionLab = function (host) {
    const st = A.controls(host, [
      { key: 'kind', label: 'Kind of non-linearity', type: 'select', value: 'sym', options: [['sym', 'Symmetrical soft limiting (tape / transformer-like)'], ['asym', 'Asymmetrical curve (single-ended stage-like)'], ['clip', 'Hard clipping (overloaded converter / amplifier)'], ['cross', 'Crossover notch (under-biased output stage)']] },
      { key: 'drive', label: 'Drive level', type: 'range', min: -30, max: 18, step: 0.5, value: -6, unit: 'dB' },
      { key: 'test', label: 'Test signal', type: 'select', value: 'one', options: [['one', 'Single tone (harmonic distortion)'], ['two', 'Two tones, 1.0 and 1.3 kHz (intermodulation)']] },
    ], () => upd());
    const row = el('div', { class: 'row' });
    const pl = el('button', { class: 'primary', html: A.icon('play') + ' Hear it' }), cl = el('button', { html: A.icon('play') + ' Hear the clean signal' }), sp = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(pl, cl, sp); host.appendChild(row); host.appendChild(html(volNote));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const shape = (x) => {
      const g = lin(st.drive), v = x * g;
      if (st.kind === 'sym') return Math.tanh(v);
      if (st.kind === 'asym') { const y = v >= 0 ? Math.tanh(v * 0.7) / 0.7 : Math.tanh(v * 1.5) / 1.5; return y; }
      if (st.kind === 'clip') return A.clamp(v, -1, 1);
      const dz = 0.04; return Math.abs(v) < dz ? v * 0.15 : v - Math.sign(v) * dz * 0.85;
    };
    let M = null;
    function play(clean) {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return;
      const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05); g.gain.setValueAtTime(0.12, ctx.currentTime + 2.6); g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 2.8);
      const ws = ctx.createWaveShaper(), n = 2048, curve = new Float32Array(n); let mx = 1e-6;
      for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; curve[i] = clean ? x * Math.min(1, lin(st.drive)) : shape(x); mx = Math.max(mx, Math.abs(curve[i])); }
      for (let i = 0; i < n; i++) curve[i] /= Math.max(1, mx); ws.curve = curve;
      const fr = st.test === 'one' ? [220] : [1000, 1300], pre = ctx.createGain(); pre.gain.value = 1 / fr.length;
      fr.forEach((f) => { const o = ctx.createOscillator(); o.frequency.value = f; o.connect(pre); o.start(); o.stop(ctx.currentTime + 2.9); A.audio.track(o); });
      pre.connect(ws).connect(g).connect(ctx.destination);
    }
    pl.onclick = () => play(false); cl.onclick = () => play(true); sp.onclick = () => A.audio.stopAll();
    const cv = A.canvas(host, {
      height: 400,
      caption: 'Upper left: the transfer curve — a straight diagonal would be a perfect device; the highlighted span is how much of it the signal is using. Upper right: the output wave (bold) over the ideal one (dotted). Lower panel: the spectrum — the test tones are the tallest bars, everything else has been created by the non-linearity.',
      draw(ctx, w, h) {
        if (!M) return; const sq = Math.min(h * 0.42 - 24, w * 0.34), h1 = Math.round(sq + 26), x0 = 14, y0 = 12;
        rr(ctx, x0, y0, sq, sq, 4, A.css('panel2'));
        line(ctx, x0, y0 + sq / 2, x0 + sq, y0 + sq / 2, A.css('line')); line(ctx, x0 + sq / 2, y0, x0 + sq / 2, y0 + sq, A.css('line'));
        const lim = Math.max(1.2, M.span * 1.15), tx = (v) => x0 + sq / 2 + (v / lim) * (sq / 2), ty = (v) => y0 + sq / 2 - (v / lim) * (sq / 2);
        ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, sq, sq); ctx.clip();
        line(ctx, tx(-lim), ty(-lim), tx(lim), ty(lim), A.css('muted'), 1, [3, 3]);
        const g = lin(st.drive);
        ctx.strokeStyle = A.css('muted'); ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i <= 80; i++) { const v = -lim + (2 * lim * i) / 80, y = shape(v / g); i ? ctx.lineTo(tx(v), ty(y)) : ctx.moveTo(tx(v), ty(y)); } ctx.stroke();
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const v = -M.span + (2 * M.span * i) / 60, y = shape(v / g); i ? ctx.lineTo(tx(v), ty(y)) : ctx.moveTo(tx(v), ty(y)); } ctx.stroke(); ctx.restore(); ctx.lineWidth = 1;
        A.text(ctx, 'in →', x0 + sq - 4, y0 + sq / 2 - 4, { size: 9, align: 'right', color: A.css('muted') }); A.text(ctx, 'out ↑', x0 + sq / 2 + 4, y0 + 11, { size: 9, color: A.css('muted') });
        const wx0 = x0 + sq + 18, wx1 = w - 12, wy = y0 + sq / 2, wa = sq / 2 - 6;
        line(ctx, wx0, wy, wx1, wy, A.css('line'));
        const cyc = st.test === 'one' ? 2 : 1, pk = Math.max(1e-6, M.outPk, M.span);
        ctx.strokeStyle = A.css('muted'); ctx.setLineDash([2, 3]); ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = wx0; x <= wx1; x++) { const u = (x - wx0) / (wx1 - wx0), y = wy - (M.sig(u * cyc) * g / pk) * wa; x === wx0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.5; ctx.beginPath(); for (let x = wx0; x <= wx1; x++) { const u = (x - wx0) / (wx1 - wx0), y = wy - (shape(M.sig(u * cyc)) / pk) * wa; x === wx0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.lineWidth = 1;
        ctx.save(); ctx.translate(0, h1);
        const two = st.test === 'two';
        const ax = A.axes(ctx, w, h - h1, { x: two ? { min: 0, max: 4200, label: 'Frequency (Hz)', fmt: (v) => fmt(v, 0) } : { min: 0.5, max: 12.5, label: 'Harmonic number (1 = the test tone)', ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], fmt: (v) => String(v) }, y: { min: -100, max: 0, label: 'Level (dB)' }, pad: { t: 8 } });
        M.bars.forEach(([x, d, k]) => { if (d < -100) return; const px = ax.X(x), py = ax.Y(Math.min(0, d)); ctx.fillStyle = k === 'f' ? A.css('good') : k === 'e' ? A.css('c3') : A.css('bad'); ctx.fillRect(px - (two ? 2.5 : 7), py, two ? 5 : 14, ax.y0 - py); });
        ctx.restore();
      },
    });
    host.appendChild(A.legend([[A.css('good'), 'Test tone(s)'], [A.css('c3'), 'Even-order products'], [A.css('bad'), 'Odd-order products']]));
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const two = st.test === 'two', N = 4096, re = new Float64Array(N), im = new Float64Array(N);
      const k1 = two ? 100 : 16, k2 = 130; // bin-centred tones; in two-tone mode bin spacing = 10 Hz
      const sig = (u) => (two ? 0.5 * (Math.sin(TAU * 10 * u) + Math.sin(TAU * 13 * u)) : Math.sin(TAU * u));
      let outPk = 0;
      for (let i = 0; i < N; i++) { const x = two ? 0.5 * (Math.sin((TAU * k1 * i) / N) + Math.sin((TAU * k2 * i) / N)) : Math.sin((TAU * k1 * i) / N); re[i] = shape(x); outPk = Math.max(outPk, Math.abs(re[i])); }
      fft(re, im);
      const a = (k) => (2 * Math.hypot(re[k], im[k])) / N, fund = two ? Math.max(a(k1), a(k2)) : a(k1), bars = [];
      let thd = 0, ev = 0, od = 0, imd = 0, list = [];
      if (!two) { for (let n = 1; n <= 12; n++) { const v = a(k1 * n) / fund; bars.push([n, dB(v), n === 1 ? 'f' : n % 2 ? 'o' : 'e']); if (n > 1) { thd += v * v; if (n % 2) od += v * v; else ev += v * v; } } }
      else { for (let k = 5; k < 420; k++) { const v = a(k) / fund; if (dB(v) > -100) { const isF = k === k1 || k === k2; let ord = 'o'; if (!isF) { for (let m = -6; m <= 6; m++) for (let n = -6; n <= 6; n++) if (m * 100 + n * 130 === k && (Math.abs(m) + Math.abs(n)) % 2 === 0) ord = 'e'; imd += v * v; if (k < 300 && dB(v) > -70) list.push([k * 10, dB(v)]); } bars.push([k * 10, dB(v), isF ? 'f' : ord]); } } }
      M = { bars, span: lin(st.drive), outPk, sig };
      const pc = (v) => { const p = Math.sqrt(v) * 100; return p < 0.001 ? '< 0.001 %' : fmt(p, p < 1 ? 3 : 1) + ' %'; };
      if (!two) out.innerHTML = A.statBox('Total harmonic distortion', pc(thd), fmt(10 * Math.log10(Math.max(1e-12, thd)), 0) + ' dB below the tone', thd > 0.01 ? 'bad' : thd > 0.0001 ? 'warn' : 'good') + A.statBox('Even harmonics (2nd, 4th …)', pc(ev), 'an octave-related colour') + A.statBox('Odd harmonics (3rd, 5th …)', pc(od), 'harder, edgier colour') + A.statBox('Level change of the tone', fmt(dB(fund / lin(st.drive)), 1) + ' dB', 'compression of the fundamental');
      else { list.sort((p, q) => q[1] - p[1]); out.innerHTML = A.statBox('Intermodulation distortion', pc(imd), 'all new components together', imd > 0.01 ? 'bad' : imd > 0.0001 ? 'warn' : 'good') + A.statBox('Difference tone f2 − f1', '300 Hz', fmt(Math.max(-120, dB(a(30) / fund)), 0) + ' dB — second order') + A.statBox('2·f1 − f2 and 2·f2 − f1', '700 Hz, 1.6 kHz', fmt(Math.max(-120, dB(a(70) / fund)), 0) + ' dB — third order') + A.statBox('Strongest new components', list.slice(0, 3).map((p) => fmtHz(p[0])).join(', ') || 'none', 'not musically related to either tone'); }
      const T = {
        sym: 'A curve that bends equally in both directions produces only <b>odd</b> harmonics (3rd, 5th …). At low drive it is nearly straight and distortion is tiny; it grows smoothly — the gentle, forgiving overload of tape and transformers.',
        asym: 'A lop-sided curve treats positive and negative halves differently, which adds <b>even</b> harmonics (2nd, 4th …) and a DC shift. The second harmonic is an octave above the note, so it tends to sound “warm” rather than harsh.',
        clip: 'Below the limit a hard clipper is perfectly clean; above it the wave tops are sliced flat and a long series of strong high harmonics appears at once. This is digital overload and amplifier clipping — the most audible, and the most dangerous for tweeters.',
        cross: 'A notch at the zero crossing is the opposite of clipping: it is worst at <b>low</b> levels, because the kink is a bigger share of a small signal. Raise the drive and the percentage falls. It sounds gritty on quiet passages — the reason distortion must be measured at several levels.',
      };
      tip.innerHTML = callout('mentor', T[st.kind] + (two ? ' With two tones the same curve creates sum and difference frequencies. Unlike harmonics they are <b>not</b> musically related to the notes played, which is why intermodulation is far more objectionable than the same percentage of harmonic distortion.' : ''));
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     12. First-order ambisonic encoder / decoder (horizontal)
     ====================================================================== */
  V.ambisonicDecoder = function (host) {
    const st = A.controls(host, [
      { key: 'az', label: 'Source direction (0° = front, + = left)', type: 'range', min: -180, max: 180, step: 1, value: 35, unit: '°' },
      { key: 'orbit', label: 'Move the source round automatically', type: 'check', value: false },
      { key: 'mic', label: 'Virtual microphone aim', type: 'range', min: -180, max: 180, step: 1, value: 0, unit: '°' },
      { key: 'pat', label: 'Virtual microphone pattern', type: 'range', min: 0, max: 1, step: 0.01, value: 0.5, fmt: (v) => (v < 0.08 ? 'omni' : v < 0.42 ? 'wide cardioid' : v < 0.58 ? 'cardioid' : v < 0.7 ? 'supercardioid' : v < 0.92 ? 'hypercardioid' : 'figure-8') },
      { key: 'spk', label: 'Loudspeaker ring', type: 'select', value: '6', numeric: true, options: [[4, '4 loudspeakers (square)'], [6, '6 loudspeakers (hexagon)'], [8, '8 loudspeakers (octagon)']] },
      { key: 'rot', label: 'Rotate the whole sound field', type: 'range', min: -180, max: 180, step: 1, value: 0, unit: '°' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    let az = 35;
    const enc = () => { const a = ((az + st.rot) * Math.PI) / 180; return { w: 1, x: Math.cos(a), y: Math.sin(a) }; };
    const vm = (e, dirDeg, p) => (1 - p) * e.w + p * (e.x * Math.cos((dirDeg * Math.PI) / 180) + e.y * Math.sin((dirDeg * Math.PI) / 180));
    const spkAng = () => Array.from({ length: st.spk }, (_, i) => (st.spk === 4 ? 45 : 0) + (i * 360) / st.spk);
    const cv = A.canvas(host, {
      height: 440, animate: true,
      caption: 'Plan view, front at the top. The dot is the sound source. Faint shapes: the three recorded components — an all-round pickup (W) and two figure-of-eight pickups pointing front–back (X) and left–right (Y). Bold shape: the virtual microphone built from them, which can be re-aimed and re-shaped after the recording. Bars at each loudspeaker show the decoded feed; hollow bars are inverted-polarity feeds.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t); if (st.orbit) { az = ((tt * 30) % 360) - 180; }
        const wide = w >= 640, R = wide ? Math.min(150, h / 2 - 50) : Math.min(105, w / 2 - 50), cx = wide ? w * 0.3 : w / 2, cy = wide ? h / 2 : R + 52;
        const dir = (deg, r) => [cx - Math.sin((deg * Math.PI) / 180) * r, cy - Math.cos((deg * Math.PI) / 180) * r];
        const e = enc(), src = az + st.rot;
        ctx.strokeStyle = A.css('line'); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
        const polar = (fn, col, lw, dash) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.beginPath(); for (let d = 0; d <= 360; d += 3) { const r = Math.abs(fn(d)) * R * 0.62, p = dir(d, r); d ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore(); };
        polar(() => 1, A.alpha(A.css('muted'), 0.7), 1, [2, 3]);
        polar((d) => Math.cos((d * Math.PI) / 180), A.alpha(A.css('c3'), 0.75), 1.2);
        polar((d) => Math.sin((d * Math.PI) / 180), A.alpha(A.css('good'), 0.75), 1.2);
        polar((d) => (1 - st.pat) + st.pat * Math.cos(((d - st.mic) * Math.PI) / 180), A.css('accent'), 2.5);
        const ma = dir(st.mic, R * 0.7); line(ctx, cx, cy, ma[0], ma[1], A.css('accent'), 1.5, [3, 3]);
        const g = spkAng().map((a) => vm(e, a, 0.5) * (2 / st.spk) * 2);
        spkAng().forEach((a, i) => {
          const p = dir(a, R + 12), q = dir(a, R + 12 + Math.abs(g[i]) * 34 * (st.spk / 4));
          ctx.save(); ctx.lineWidth = 9; ctx.lineCap = 'butt'; ctx.strokeStyle = g[i] >= 0 ? A.css('c2') : A.css('muted'); if (g[i] < 0) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.restore();
          const b = dir(a, R + 3); rr(ctx, b[0] - 6, b[1] - 6, 12, 12, 2, A.css('panel2'), A.css('text'));
        });
        const sp = dir(src, R * 0.86), pu = 5 + 2 * Math.sin(tt * 5); ctx.fillStyle = A.css('bad'); ctx.beginPath(); ctx.arc(sp[0], sp[1], pu, 0, TAU); ctx.fill();
        A.text(ctx, '↑ front', wide ? 14 : 10, 16, { size: 11, color: A.css('muted'), weight: 700 });
        // component bars
        const bx = wide ? w * 0.62 : 20, bw = wide ? w * 0.34 : w - 40, by = wide ? 60 : cy + R + 62, vmv = vm(e, st.mic, st.pat);
        const rows = [['W (all-round)', e.w, A.css('muted')], ['X (front–back)', e.x, A.css('c3')], ['Y (left–right)', e.y, A.css('good')], ['Virtual mic output', vmv, A.css('accent')]];
        rows.forEach(([lab, v, col], i) => {
          const y = by + i * (wide ? 52 : 34); A.text(ctx, lab, bx, y - 5, { size: 11, weight: 700 }); A.text(ctx, (v >= 0 ? '+' : '−') + fmt(Math.abs(v), 2), bx + bw, y - 5, { size: 11, align: 'right', weight: 700, color: col });
          rr(ctx, bx, y, bw, 10, 3, A.css('panel2')); ctx.fillStyle = col; const m = bx + bw / 2; ctx.fillRect(Math.min(m, m + (v * bw) / 2), y, Math.abs((v * bw) / 2), 10); ctx.fillStyle = A.css('text'); ctx.fillRect(m - 0.5, y - 2, 1, 14);
        });
        if (st.orbit && Math.floor(tt * 4) !== Math.floor((tt - 0.02) * 4)) stats();
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function stats() {
      const e = enc(), v = vm(e, st.mic, st.pat), g = spkAng().map((a) => vm(e, a, 0.5)), mx = Math.max(...g), act = g.filter((x) => x > mx * 0.5).length, neg = g.filter((x) => x < -0.02).length;
      out.innerHTML = A.statBox('Encoded signals', 'W ' + fmt(e.w, 2) + ' · X ' + fmt(e.x, 2) + ' · Y ' + fmt(e.y, 2), 'the same three channels whatever the playback system') + A.statBox('Virtual microphone picks up', fmt(dB(Math.abs(v)), 1) + ' dB', Math.abs(v) < 0.1 ? 'source is in its null' : v < 0 ? 'from its rear lobe (inverted)' : 'relative to on-axis')
        + A.statBox('Loudspeakers carrying the source', act + ' of ' + st.spk, 'within 6 dB of the loudest') + A.statBox('Feeds with inverted polarity', String(neg), 'none with cardioid-style decoding');
    }
    function upd() {
      if (!st.orbit) az = st.az; stats();
      tip.innerHTML = callout('mentor', st.spk === 4 ? 'With first-order ambisonics four loudspeakers already recreate the horizontal scene. Each feed is simply a virtual microphone aimed at that loudspeaker. The image is broad — several loudspeakers always share the source — which is the price of only four recorded channels.' : 'More loudspeakers make the ring smoother but <b>not</b> sharper: the sharpness is fixed by the order of the recording. First order gives roughly cardioid-wide images; third order and above (16 or more channels) is needed for pin-point sources. Notice that rotating the whole field is trivial — just a change of X and Y — which is why the format suits head-tracked headphones.');
    }
    upd(); void cv;
  };

  /* ======================================================================
     13. Bass manager
     ====================================================================== */
  const BM_CONTENT = {
    film: ['Film action scene', { L: -6, C: -10, R: -6, Ls: -12, Rs: -12, LFE: 0 }],
    music: ['Music, 5.0 (no LFE used)', { L: -8, C: -20, R: -8, Ls: -18, Rs: -18, LFE: -99 }],
    dialog: ['Dialogue only', { L: -60, C: -14, R: -60, Ls: -60, Rs: -60, LFE: -99 }],
    bass: ['Bass guitar panned centre (equal in L and R)', { L: -6, C: -60, R: -6, Ls: -60, Rs: -60, LFE: -99 }],
    worst: ['Worst case: everything at full scale', { L: 0, C: 0, R: 0, Ls: 0, Rs: 0, LFE: 0 }],
  };
  V.bassManager = function (host) {
    const st = A.controls(host, [
      { key: 'content', label: 'Low-frequency content in the programme', type: 'select', value: 'film', options: Object.entries(BM_CONTENT).map(([k, v]) => [k, v[0]]) },
      { key: 'xo', label: 'Crossover frequency', type: 'range', min: 40, max: 150, step: 5, value: 80, unit: 'Hz' },
      { key: 'lfe', label: 'LFE playback gain', type: 'range', min: 0, max: 10, step: 1, value: 10, unit: 'dB' },
      { key: 'sF', label: 'Front left / right are “small” (bass redirected)', type: 'check', value: true },
      { key: 'sC', label: 'Centre is “small”', type: 'check', value: true },
      { key: 'sS', label: 'Surrounds are “small”', type: 'check', value: true },
      { key: 'sub', label: 'A subwoofer is connected', type: 'check', value: true },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const CH = ['L', 'C', 'R', 'Ls', 'Rs', 'LFE'];
    const small = (c) => (c === 'L' || c === 'R' ? st.sF : c === 'C' ? st.sC : c === 'LFE' ? true : st.sS);
    function model() {
      const lv = BM_CONTENT[st.content][1]; let amp = 0, pw = 0; const route = {};
      CH.forEach((c) => {
        const toSub = small(c) && (st.sub || c !== 'LFE' || true), a = lin(lv[c] + (c === 'LFE' ? st.lfe : 0));
        route[c] = { lv: lv[c], sub: toSub && lv[c] > -90, a };
        if (route[c].sub) { amp += a; pw += a * a; }
      });
      return { route, coh: dB(amp), unc: 10 * Math.log10(Math.max(1e-12, pw)) };
    }
    let M = null;
    const cv = A.canvas(host, {
      height: 360, animate: true,
      caption: 'Signal flow of a bass-management stage. Each channel on the left is split at the crossover: everything above goes straight to its own loudspeaker; the bass of every “small” channel is added to the LFE channel and sent to the subwoofer. Moving dots show where low-frequency energy is travelling; thicker flow means more level.',
      draw(ctx, w, h, t) {
        if (!M) return; const tt = Math.max(0, t), xa = 12, bwd = Math.min(64, w * 0.16), xm = w * 0.46, xs = w - bwd - 12, rowH = (h - 96) / 6, tx = A.css('text');
        const busX = xm + (xs - xm) * 0.45, subY = h - 28;
        CH.forEach((c, i) => {
          const y = 46 + i * rowH, r = M.route[c], act = r.lv > -90, lvl = act ? A.clamp((r.lv + (c === 'LFE' ? st.lfe : 0) + 30) / 36, 0.12, 1.2) : 0;
          rr(ctx, xa, y - 12, bwd, 24, 4, A.css('panel2'), tx); A.text(ctx, c, xa + bwd / 2, y + 4, { align: 'center', size: 12, weight: 700 });
          if (c !== 'LFE') {
            rr(ctx, xs, y - 12, bwd, 24, 4, A.css('panel2'), small(c) ? A.css('muted') : A.css('good')); A.text(ctx, small(c) ? 'small' : 'LARGE', xs + bwd / 2, y + 4, { align: 'center', size: 10, weight: 700, color: small(c) ? A.css('muted') : A.css('good') });
            line(ctx, xa + bwd, y, xs, y, A.css('line'), 1.5);
          } else line(ctx, xa + bwd, y, busX, y, A.css('line'), 1.5);
          if (act) {
            const toSub = r.sub, col = toSub ? A.css('accent') : A.css('good');
            for (let k = 0; k < 3; k++) {
              const u = (tt * 0.45 + k / 3 + i * 0.13) % 1; let px, py;
              if (toSub) { const d1 = busX - (xa + bwd), d2 = Math.abs(subY - y), tot = d1 + d2, s = u * tot; if (s < d1) { px = xa + bwd + s; py = y; } else { px = busX; py = y + (s - d1) * Math.sign(subY - y); } }
              else { px = xa + bwd + u * (xs - xa - bwd); py = y; }
              ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, py, 2 + 3.2 * lvl, 0, TAU); ctx.fill();
            }
          }
        });
        line(ctx, busX, 32, busX, subY, A.css('accent'), 2.5);
        A.text(ctx, 'crossover ' + st.xo + ' Hz', busX, 22, { align: 'center', size: 10, color: A.css('muted') });
        rr(ctx, busX - 58, subY - 13, 116, 26, 5, st.sub ? A.alpha(A.css('accent'), 0.2) : A.alpha(A.css('bad'), 0.2), st.sub ? A.css('accent') : A.css('bad'));
        A.text(ctx, st.sub ? 'SUBWOOFER' : 'NO SUB — LOST', busX, subY + 4, { align: 'center', size: 11, weight: 700, color: st.sub ? A.css('accent') : A.css('bad') });
        A.text(ctx, w < 420 ? 'speakers' : 'loudspeakers', xs + bwd / 2, 22, { align: 'center', size: 10, color: A.css('muted') });
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      M = model(); const n = CH.filter((c) => M.route[c].sub).length;
      const spl = 105 + M.coh, large = CH.filter((c) => c !== 'LFE' && !small(c));
      out.innerHTML = A.statBox('Signals summed into the sub', String(n), CH.filter((c) => M.route[c].sub).join(' + ') || 'none')
        + A.statBox('Sub level, bass in step', (M.coh >= 0 ? '+' : '') + fmt(M.coh, 1) + ' dB', 'relative to one main channel at full scale', M.coh > 12 ? 'bad' : M.coh > 6 ? 'warn' : '')
        + A.statBox('Sub level, unrelated signals', (M.unc >= 0 ? '+' : '') + fmt(M.unc, 1) + ' dB', 'power sum — the typical case') + A.statBox('Peak level the sub must deliver', n ? fmt(spl, 0) + ' dB SPL' : '—', 'if each main channel peaks at 105 dB', spl > 118 ? 'bad' : spl > 112 ? 'warn' : 'good');
      let msg;
      if (!st.sub) msg = 'With no subwoofer, the bass of every “small” channel and the whole LFE channel have nowhere to go. A real processor would redirect them to the “large” loudspeakers at reduced level, or simply drop the LFE — one reason important bass should never live <b>only</b> in the LFE channel.';
      else if (st.content === 'worst') msg = 'Five full-scale channels in step add up to +14 dB, and the LFE with its +10 dB arrives on top: the subwoofer path needs roughly 16 dB more clean output than any single main loudspeaker. This is why cinema and home-cinema subwoofers are so large, and why bass management needs generous digital headroom.';
      else if (st.content === 'bass') msg = 'A bass instrument panned centre is identical in left and right, so the two redirected signals add as voltages: +6 dB, not +3. The bass manager must leave headroom for this, and the sub level must be calibrated with the redirected bass, not just with the LFE test noise.';
      else if (st.xo > 100) msg = 'Above about 100 Hz a subwoofer becomes locatable by ear — voices and guitars start to pull toward it. Use a high crossover only with very small satellites, and then place the sub between the front loudspeakers, or use two.';
      else if (large.length === 5) msg = 'With every loudspeaker set to “large”, only the LFE reaches the subwoofer and each main loudspeaker must reproduce its own bass from wherever it happens to stand — five different sets of room modes. Redirecting to well-placed subs usually gives smoother bass, even with capable main loudspeakers.';
      else msg = 'The LFE channel is recorded 10 dB low and replayed with +10 dB of gain, giving the effects channel extra headroom. It is a <b>content</b> channel; the subwoofer is a <b>loudspeaker</b>. Bass management decides what else that loudspeaker has to reproduce.';
      tip.innerHTML = callout('mentor', msg);
    }
    upd(); void cv;
  };

  /* ======================================================================
     14. Downmix calculator
     ====================================================================== */
  V.downmixCalc = function (host) {
    const sl = (key, label, v) => ({ key, label, type: 'range', min: -60, max: 0, step: 1, value: v, unit: 'dBFS' });
    const st = A.controls(host, [
      sl('L', 'Left', -10), sl('R', 'Right', -10), sl('C', 'Centre', -6), sl('Ls', 'Left surround', -14), sl('Rs', 'Right surround', -14), sl('LFE', 'LFE', -8),
      { key: 'coef', label: 'Downmix coefficients (centre / surround)', type: 'select', value: '3,3', options: [['3,3', '−3 dB / −3 dB (most common)'], ['3,6', '−3 dB / −6 dB'], ['4.5,4.5', '−4.5 dB / −4.5 dB'], ['6,6', '−6 dB / −6 dB'], ['3,99', '−3 dB / surrounds dropped']] },
      { key: 'lfeOn', label: 'Mix the LFE into the fold-down', type: 'check', value: false },
      { key: 'sum', label: 'How the channels add', type: 'select', value: 'unc', options: [['unc', 'Unrelated material (power sum)'], ['coh', 'Worst case: peaks coincide (voltage sum)']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    let M = null;
    function calc() {
      const [c, s] = st.coef.split(',').map(Number), gc = lin(-c), gs = s > 90 ? 0 : lin(-s), gl = st.lfeOn ? lin(-3 + 10 - 10) * lin(-3) : 0;
      const a = (k) => lin(st[k]);
      const partsL = [a('L'), gc * a('C'), gs * a('Ls'), gl * a('LFE')], partsR = [a('R'), gc * a('C'), gs * a('Rs'), gl * a('LFE')];
      const sum = (p) => (st.sum === 'coh' ? p.reduce((x, y) => x + y, 0) : Math.sqrt(p.reduce((x, y) => x + y * y, 0)));
      const Lo = sum(partsL), Ro = sum(partsR);
      // mono: centre and LFE are identical in Lo and Ro, so they add as voltages
      const side = [a('L'), a('R'), gs * a('Ls'), gs * a('Rs')], com = 2 * gc * a('C') + 2 * gl * a('LFE');
      const mono = 0.5 * (st.sum === 'coh' ? side.reduce((x, y) => x + y, 0) + com : Math.sqrt(side.reduce((x, y) => x + y * y, 0) + com * com));
      const cInSt = dB(gc * a('C')) , cRoom = cInSt + 3, cMono = dB(gc * a('C'));
      return { Lo: dB(Lo), Ro: dB(Ro), mono: dB(mono), cShare: dB((gc * a('C')) / Math.max(1e-9, Lo)), cRoom, cMono, gc, gs };
    }
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Left group: the six input channel levels. Right group: the resulting two-channel fold-down (Lo and Ro) and its mono sum. The horizontal guide is digital full scale — any bar that crosses it will clip unless the whole downmix is turned down.',
      draw(ctx, w, h) {
        if (!M) return; const keys = ['L', 'R', 'C', 'Ls', 'Rs', 'LFE'], outs = [['Lo', M.Lo], ['Ro', M.Ro], ['Mono', M.mono]];
        const y0 = h - 34, y1 = 22, Y = (d) => y0 - ((A.clamp(d, -60, 9) + 60) / 69) * (y0 - y1), n = 9.8, bw = (w - 30) / n;
        for (let d = -60; d <= 0; d += 12) { line(ctx, 30, Y(d), w - 6, Y(d), A.css('line'), 1); A.text(ctx, String(d), 26, Y(d) + 3, { size: 9, align: 'right', color: A.css('muted') }); }
        line(ctx, 30, Y(0), w - 6, Y(0), A.css('bad'), 1.5, [5, 3]);
        keys.forEach((k, i) => { const x = 34 + i * bw, y = Y(st[k]); ctx.fillStyle = k === 'C' ? A.css('c3') : k === 'LFE' ? A.css('muted') : A.css('accent'); ctx.fillRect(x, y, bw * 0.7, y0 - y); A.text(ctx, k, x + bw * 0.35, y0 + 14, { size: 10, align: 'center', weight: 700 }); });
        outs.forEach(([k, v], i) => { const x = 34 + (6.6 + i) * bw, y = Y(v); ctx.fillStyle = v > 0 ? A.css('bad') : A.css('good'); ctx.fillRect(x, y, bw * 0.78, y0 - y); A.text(ctx, k, x + bw * 0.39, y0 + 14, { size: 10, align: 'center', weight: 700 }); A.text(ctx, (v > 0 ? '+' : '') + fmt(v, 1), x + bw * 0.39, y - 5, { size: 10, align: 'center', weight: 700, color: v > 0 ? A.css('bad') : A.css('text') }); });
        A.text(ctx, '→', 34 + 6.25 * bw, (y0 + y1) / 2, { size: 18, align: 'center', color: A.css('muted') });
        A.text(ctx, 'dBFS', 4, 12, { size: 9, color: A.css('muted') });
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      M = calc(); const mx = Math.max(M.Lo, M.Ro), need = Math.max(0, mx), worst = dB(1 + M.gc + M.gs + (st.lfeOn ? lin(-3) : 0));
      out.innerHTML = A.statBox('Lo (left total)', (M.Lo > 0 ? '+' : '') + fmt(M.Lo, 1) + ' dBFS', M.Lo > 0 ? 'clips' : fmt(-M.Lo, 1) + ' dB headroom', M.Lo > 0 ? 'bad' : 'good') + A.statBox('Ro (right total)', (M.Ro > 0 ? '+' : '') + fmt(M.Ro, 1) + ' dBFS', M.Ro > 0 ? 'clips' : fmt(-M.Ro, 1) + ' dB headroom', M.Ro > 0 ? 'bad' : 'good')
        + A.statBox('Mono sum (Lo + Ro) ÷ 2', (M.mono > 0 ? '+' : '') + fmt(M.mono, 1) + ' dBFS', 'centre adds fully; sides only partly') + A.statBox('Centre share of Lo', fmt(M.cShare, 1) + ' dB', M.cShare > -3 ? 'dialogue dominates the fold-down' : M.cShare < -12 ? 'dialogue may be masked' : 'healthy dialogue balance')
        + A.statBox('Attenuation needed now', fmt(need, 1) + ' dB', 'to stay below full scale', need > 0 ? 'bad' : 'good') + A.statBox('Guaranteed-safe attenuation', fmt(worst, 1) + ' dB', 'if every channel hit full scale in step');
      let msg;
      if (mx > 0) msg = `The fold-down exceeds full scale by ${fmt(mx, 1)} dB. Decoders protect themselves by scaling the whole downmix (or by limiting), so a hot multichannel mix comes out <b>quieter and more compressed</b> in stereo than you intended. Leave headroom, and always audition the fold-down.`;
      else if (st.lfeOn) msg = 'Including the LFE keeps the low effects in the stereo version, but it is the easiest way to overload a downmix, and many devices simply discard it. The safe practice is the reverse: never put anything in the LFE that the story cannot live without.';
      else if (st.coef === '3,99') msg = 'Dropping the surrounds keeps dialogue clear on small devices but loses ambience, audience and any effect or instrument that lives only in the rear. Check that nothing essential is surround-only.';
      else if (M.cShare < -12) msg = 'The centre channel is a small part of the fold-down — dialogue will struggle against music and effects on a television or phone. This is the single most common complaint about film sound at home.';
      else msg = 'The centre is fed equally to both outputs, so in a room it returns as a phantom image at roughly the intended level (two speakers, power sum: −3 dB + 3 dB). Collapse to <b>mono</b> and those two copies add as voltages (+6 dB), so the centre rises about 3 dB against everything else — “centre build-up”.';
      tip.innerHTML = callout('mentor', msg);
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     15. Pan-law lab
     ====================================================================== */
  const LAWS = { '3': ['−3 dB centre (constant power)', 3], '4.5': ['−4.5 dB centre (compromise)', 4.5], '6': ['−6 dB centre (constant voltage)', 6], '0': ['0 dB centre (no attenuation)', 0] };
  V.panLawLab = function (host) {
    const st = A.controls(host, [
      { key: 'pan', label: 'Pan position', type: 'range', min: -1, max: 1, step: 0.01, value: 0, fmt: (v) => (Math.abs(v) < 0.01 ? 'centre' : fmt(Math.abs(v) * 100, 0) + ' % ' + (v < 0 ? 'left' : 'right')) },
      { key: 'law', label: 'Pan law', type: 'select', value: '3', options: Object.entries(LAWS).map(([k, v]) => [k, v[0]]) },
      { key: 'sweep', label: 'Sweep the pan slowly from side to side (when playing)', type: 'check', value: true },
      { key: 'mono', label: 'Listen in mono (both channels summed)', type: 'check', value: false },
    ], () => upd());
    const row = el('div', { class: 'row' });
    const pl = el('button', { class: 'primary', html: A.icon('play') + ' Play steady noise' }), sp = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(pl, sp); host.appendChild(row); host.appendChild(html(volNote));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const gains = (p, law = +st.law) => {
      const u = (p + 1) / 2;
      if (law === 0) return [Math.min(1, 2 * (1 - u)), Math.min(1, 2 * u)];
      const k = law / 3.0103; // exponent applied to the sine/cosine law: 1 → −3 dB, 2 → −6 dB
      return [Math.pow(Math.cos((u * Math.PI) / 2), k), Math.pow(Math.sin((u * Math.PI) / 2), k)];
    };
    let nodes = null, pNow = 0;
    function apply(p) { if (!nodes) return; const [l, r] = gains(p), ctx = nodes.ctx; if (st.mono) { const m = (l + r) / 2; nodes.gl.gain.setTargetAtTime(m, ctx.currentTime, 0.02); nodes.gr.gain.setTargetAtTime(m, ctx.currentTime, 0.02); } else { nodes.gl.gain.setTargetAtTime(l, ctx.currentTime, 0.02); nodes.gr.gain.setTargetAtTime(r, ctx.currentTime, 0.02); } }
    pl.onclick = () => {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return;
      const s = ctx.createBufferSource(); s.buffer = A.audio.noiseBuffer('pink', 4); s.loop = true;
      const gl = ctx.createGain(), gr = ctx.createGain(), mg = ctx.createChannelMerger(2), master = ctx.createGain(); master.gain.value = 0.35;
      s.connect(gl); s.connect(gr); gl.connect(mg, 0, 0); gr.connect(mg, 0, 1); mg.connect(master).connect(ctx.destination);
      s.start(); s.stop(ctx.currentTime + 24); A.audio.track(s); nodes = { ctx, gl, gr, src: s }; s.onended = () => { if (nodes && nodes.src === s) nodes = null; }; apply(st.pan);
    };
    sp.onclick = () => { A.audio.stopAll(); nodes = null; };
    A.onLeave && A.onLeave(() => { nodes = null; });
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'How the level changes as a sound is panned from hard left to hard right. Two thin traces: the gain sent to each loudspeaker. Bold solid trace: the total level in a normal reflective room, where the two loudspeakers add as power. Bold dotted trace: the level after summing to mono, where they add as voltage. A flat trace means the sound stays equally loud as it moves.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t); pNow = nodes && st.sweep ? Math.sin(tt * 0.9) : st.pan; if (nodes && st.sweep) apply(pNow);
        const ax = A.axes(ctx, w, h, { x: { min: -1, max: 1, ticks: [-1, -0.5, 0, 0.5, 1], fmt: (v) => (v === 0 ? 'centre' : v === -1 ? 'left' : v === 1 ? 'right' : ''), label: 'Pan position' }, y: { min: -18, max: 9, label: 'Level (dB)' } });
        const ps = Array.from({ length: 101 }, (_, i) => -1 + i / 50);
        line(ctx, ax.x0, ax.Y(0), ax.x1, ax.Y(0), A.css('muted'), 1);
        A.plotLine(ctx, ax, ps.map((p) => [p, dB(gains(p)[0])]), A.css('c3'), 1.5); A.plotLine(ctx, ax, ps.map((p) => [p, dB(gains(p)[1])]), A.css('good'), 1.5);
        A.plotLine(ctx, ax, ps.map((p) => { const g = gains(p); return [p, 10 * Math.log10(g[0] * g[0] + g[1] * g[1])]; }), A.css('accent'), 3);
        A.plotLine(ctx, ax, ps.map((p) => { const g = gains(p); return [p, dB(g[0] + g[1])]; }), A.css('text'), 2.5, [3, 4]);
        const x = ax.X(pNow); line(ctx, x, ax.y1, x, ax.y0, A.css('bad'), 1.5);
        const g = gains(pNow); [[g[0], A.css('c3')], [g[1], A.css('good')]].forEach(([v, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, ax.Y(Math.max(-18, dB(v))), 4, 0, TAU); ctx.fill(); });
      },
    });
    host.appendChild(A.legend([[A.css('c3'), 'Left gain'], [A.css('good'), 'Right gain'], [A.css('accent'), 'Total in a room (power)'], [A.css('text'), 'Total in mono (voltage)', true]]));
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const g = gains(st.pan), c = gains(0), room = 10 * Math.log10(c[0] * c[0] + c[1] * c[1]), mono = dB(c[0] + c[1]);
      out.innerHTML = A.statBox('Left / right gain here', fmt(dB(g[0]), 1) + ' / ' + fmt(dB(g[1]), 1) + ' dB', 'at the chosen pan position') + A.statBox('Each side at centre', fmt(dB(c[0]), 1) + ' dB', 'the “pan law” figure')
        + A.statBox('Centre vs. hard-panned, in a room', (room >= 0 ? '+' : '') + fmt(room, 1) + ' dB', Math.abs(room) < 0.3 ? 'even loudness across the stage' : room > 0 ? 'centre sounds louder' : 'centre sounds quieter', Math.abs(room) < 0.3 ? 'good' : 'warn')
        + A.statBox('Centre vs. hard-panned, in mono', (mono >= 0 ? '+' : '') + fmt(mono, 1) + ' dB', Math.abs(mono) < 0.3 ? 'mono balance preserved' : 'centre sources rise in mono', Math.abs(mono) < 0.3 ? 'good' : 'warn');
      const T = { '3': 'Constant power keeps a sound equally loud as it crosses a stereo pair in a normal room, so it is the default in most mixers. The catch: fold to mono and centre-panned sources come up 3 dB against hard-panned ones.', '6': 'Constant voltage is perfectly even in mono — essential for broadcast in the days of mono receivers, and in very dry rooms or headphones where the two channels add coherently — but in an ordinary room centre sources sound about 3 dB down.', '4.5': 'The compromise splits the error: 1.5 dB dip in a room, 1.5 dB rise in mono. Several large-format consoles made it their standard for exactly that reason.', '0': 'With no attenuation both channels stay at full level in the centre and one is simply faded out — a balance control, not a pan. Centre sounds are 3 dB louder in a room and 6 dB louder in mono.' };
      tip.innerHTML = callout('mentor', T[st.law] + ' If a session is moved between systems with different pan laws, every centre-panned level changes relative to the sides — check the setting before recalling a mix.');
      apply(st.pan);
    }
    upd(); void cv;
  };
})();
