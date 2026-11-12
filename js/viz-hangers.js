/* ==========================================================================
   Acoustica — acoustic hangers and waveguides.
   Hanging bass trap, ceiling isolation hangers, absorbing waveguide trap,
   loudspeaker waveguide directivity. Simplified, indicative teaching models.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C = 343;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };

  /* ======================================================================
     1. Hanging bass trap (hangers in a deep cavity)
     ====================================================================== */
  V.hangerTrap = function (host) {
    const st = A.controls(host, [
      { key: 'D', label: 'Cavity depth (wall to fabric front)', type: 'range', min: 0.3, max: 1.8, step: 0.05, value: 1.0, unit: 'm' },
      { key: 'Wc', label: 'Cavity width', type: 'range', min: 1.5, max: 6, step: 0.1, value: 3.4, unit: 'm' },
      { key: 'Hc', label: 'Hanger height (drop)', type: 'range', min: 1, max: 3.5, step: 0.05, value: 2.2, unit: 'm' },
      { key: 'pw', label: 'Hanger board width', type: 'range', min: 0.3, max: 1.2, step: 0.05, value: 0.45, unit: 'm' },
      { key: 'sp', label: 'Spacing between hangers', type: 'range', min: 0.1, max: 0.5, step: 0.01, value: 0.2, unit: 'm' },
      { key: 'ang', label: 'Hanger angle to the wall', type: 'range', min: 0, max: 80, step: 5, value: 45, unit: '°' },
      { key: 'm', label: 'Board mass', type: 'range', min: 3, max: 16, step: 0.5, value: 8, unit: 'kg/m²' },
      { key: 'wrap', label: 'Absorbent wrap on each side', type: 'range', min: 0, max: 0.075, step: 0.005, value: 0.04, unit: 'm' },
      { key: 'zig', label: 'Alternate the angle row by row (zig-zag)', type: 'check', value: true },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const a = (st.ang * Math.PI) / 180;
      const reach = st.pw * Math.sin(a) + 0.05, rows = Math.max(1, Math.floor(st.D / Math.max(0.15, reach + 0.07)));
      const pitch = (st.sp + st.wrap * 2 + 0.018) / Math.max(0.35, Math.sin(a));
      const perRow = Math.max(1, Math.floor(st.Wc / pitch));
      const n = rows * perRow;
      const block = Math.min(1, ((st.pw * Math.cos(a)) / pitch) * (st.zig ? 1.15 : 1) + (rows > 1 ? 0.25 : 0)); // how much of the straight-through path is interrupted
      const woolPath = rows * st.wrap * 2 / Math.max(0.35, Math.sin(a) + 0.2);                                        // wool crossed on the way in
      const fillFrac = Math.min(1, (n * st.pw * (st.wrap * 2 + 0.018)) / (st.Wc * st.D));
      const alpha = (f) => {
        const por = st.wrap > 0.004 ? P.porousAlpha(f, A.clamp(6000 * fillFrac * 2.5, 1200, 7000), st.D * 0.95, 0) : 0.08;
        const lam = C / f, depthTerm = 1 / (1 + Math.pow(lam / 4 / (st.D * (1 + 0.5 * block)), 2.2));
        const massTerm = 0.55 * block * (st.wrap > 0.01 ? 1 : 0.35) * (1 / (1 + Math.pow(f / 180, 2))) * Math.min(1, st.m / 6) * Math.min(1, st.D / 0.6);
        return A.clamp(1 - (1 - por * (0.55 + 0.45 * depthTerm)) * (1 - massTerm * depthTerm), 0, 1);
      };
      const mass = n * st.pw * st.Hc * (st.m + st.wrap * 2 * 45);
      return { rows, perRow, n, block, alpha, mass, pend: (1 / TAU) * Math.sqrt(9.81 / Math.max(0.5, st.Hc * 0.6)), fLow: C / (4 * st.D * (1 + 0.5 * block)), fillFrac, a };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Left: plan view looking down into the hanger cavity (rigid wall at the top, fabric front at the bottom). Each bar is a hanging board wrapped in absorbent; blue arcs are low-frequency sound working its way in, squeezing between the hangers and nudging them. Right: indicative absorption of the whole system (solid) compared with the same depth of plain wool fill (dashed).',
      draw(ctx, w, h, t) {
        const r = R, lw = Math.min(w * 0.44, 400), x0 = 18, y0 = 22, cw = lw - 36, sc = cw / st.Wc, chh = Math.min(h - 62, Math.max(170, st.D * sc * 1.7)), scy = chh / st.D;
        ctx.fillStyle = A.css('muted'); ctx.fillRect(x0, y0 - 8, cw, 8);
        ctx.strokeStyle = A.alpha(A.css('accent'), 0.7); ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(x0, y0 + chh); ctx.lineTo(x0 + cw, y0 + chh); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'fabric front — room side', x0 + cw / 2, y0 + chh + 16, { align: 'center', size: 10, color: A.css('muted') });
        const sway = Math.sin(Math.max(0, t) * 2.2) * 0.06;
        for (let row = 0; row < r.rows; row++) {
          const yy = y0 + ((row + 0.5) / r.rows) * chh, sgn = st.zig && row % 2 ? -1 : 1, a = r.a * sgn + sway * (row % 2 ? 1 : -1);
          for (let k = 0; k < r.perRow; k++) {
            const xx = x0 + ((k + 0.5) / r.perRow) * cw, hx = (st.pw / 2) * Math.cos(a) * sc, hy = (st.pw / 2) * Math.sin(a) * scy;
            if (st.wrap > 0.004) { ctx.strokeStyle = A.alpha(A.css('c4'), 0.75); ctx.lineWidth = Math.max(4, (st.wrap * 2 + 0.018) * sc); ctx.beginPath(); ctx.moveTo(xx - hx, yy - hy); ctx.lineTo(xx + hx, yy + hy); ctx.stroke(); }
            ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xx - hx, yy - hy); ctx.lineTo(xx + hx, yy + hy); ctx.stroke();
          }
        }
        ctx.lineWidth = 1;
        for (let k = 0; k < 4; k++) { const ph = ((Math.max(0, t) * 0.35 + k / 4) % 1), yy = y0 + chh - ph * chh; ctx.strokeStyle = A.alpha(A.css('c3'), 0.85 * (1 - ph) * (1 - ph)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + 6, yy); ctx.quadraticCurveTo(x0 + cw / 2, yy - 14, x0 + cw - 6, yy); ctx.stroke(); }
        ctx.lineWidth = 1;
        const ax = A.axes(ctx, w, h, { x: { min: 25, max: 2000, log: true, label: 'Frequency (Hz)', ticks: [31, 63, 125, 250, 500, 1000, 2000] }, y: { min: 0, max: 1.05, label: 'Absorption α (indicative)' }, pad: { l: lw + 52, r: 12, t: 14, b: 36 } });
        const fs = []; for (let f = 25; f <= 2000; f *= 1.04) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, P.porousAlpha(f, 6000, st.D * 0.95, 0) * 0.92]), A.alpha(A.css('text'), 0.45), 1.5, [5, 4]);
        A.plotFill(ctx, ax, fs.map((f) => [f, r.alpha(f)]), A.alpha(A.css('accent'), 0.12), 0);
        A.plotLine(ctx, ax, fs.map((f) => [f, r.alpha(f)]), A.css('accent'), 2.8);
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Hangers', `${r.n} (${r.rows} row${r.rows > 1 ? 's' : ''} × ${r.perRow})`, `${A.fmtLen(st.pw)} × ${A.fmtLen(st.Hc)} each`) + A.statBox('Useful from about', fmtHz(r.fLow), 'set mainly by the depth') + A.statBox('α at 50 / 100 Hz', `${fmt(r.alpha(50), 2)} / ${fmt(r.alpha(100), 2)}`, '', r.alpha(63) > 0.6 ? 'good' : r.alpha(63) > 0.35 ? 'warn' : 'bad') + A.statBox('Total hanging weight', fmt(r.mass, 1) + ' kg', 'check the ceiling fixings', r.mass > 400 ? 'warn' : '') + A.statBox('Hanger swing frequency', fmt(r.pend, 2) + ' Hz', 'far below audio = free to move');
      const T = [];
      if (st.D < 0.6) T.push('Hangers need depth: under about 600 mm they are little better than plain thick absorption. Use a membrane or tuned trap instead for shallow spaces.');
      if (st.wrap < 0.015) T.push('Bare boards mostly reflect. Wrap both faces with 25–50 mm of wool, felt or polyester so the air rubbing past them loses energy.');
      if (st.ang < 20) T.push('Hangers parallel to the wall leave straight open lanes. Angle them 30–60° (and alternate the direction row by row) so sound has no line of sight to the wall.');
      if (st.sp < 0.12) T.push('Too tightly packed: the hangers must not touch each other or the walls, and air needs room to move between them.');
      if (st.sp > 0.35) T.push('Widely spaced hangers let bass pass between them almost untouched — close up to roughly 150–250 mm.');
      if (r.mass > 400) T.push(`About ${fmt(r.mass, 1)} kg hangs from the ceiling: fix a timber or steel grid into structure, never into plasterboard, and have the load checked.`);
      if (!T.length) T.push('A sound layout. Hang each board from two points on wire or cord so it can sway but not twist into its neighbours; finish with an open fabric front and measure the decay before and after.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Isolation hangers for a suspended ceiling
     ====================================================================== */
  const HG = { direct: ['Rigid: channels screwed to the joists', 0.02, 1], rubber: ['Rubber / neoprene hangers or clips', 3, 1.4], spring: ['Spring hangers (25 mm deflection type)', 20, 1], combo: ['Spring + rubber hangers', 25, 1] };
  V.isoHanger = function (host) {
    const st = A.controls(host, [
      { key: 'type', label: 'Hanger', type: 'select', value: 'rubber', options: Object.entries(HG).map(([k, v]) => [k, v[0]]) },
      { key: 'layers', label: 'Ceiling board layers (15 mm gypsum)', type: 'range', min: 1, max: 4, step: 1, value: 2 },
      { key: 'grid', label: 'Hanger spacing (grid)', type: 'range', min: 0.6, max: 1.5, step: 0.05, value: 1.2, unit: 'm' },
      { key: 'area', label: 'Ceiling area', type: 'range', min: 5, max: 80, step: 1, value: 16, unit: 'm²' },
      { key: 'cav', label: 'Cavity above the ceiling', type: 'range', min: 0.05, max: 0.6, step: 0.01, value: 0.25, unit: 'm' },
      { key: 'load', label: 'Hanger loaded to this share of its rating', type: 'range', min: 20, max: 130, step: 5, value: 80, unit: '%' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const m = st.layers * 12.8 + 4, h = HG[st.type];
      const defl = h[1] * Math.min(1.2, st.load / 100);
      const fn = st.type === 'direct' ? null : (15.76 / Math.sqrt(Math.max(0.05, defl))) * Math.sqrt(h[2]);
      const n = Math.ceil(st.area / (st.grid * st.grid)), per = (m * st.area) / n;
      const fmam = 50 * Math.sqrt((m + 300) / (m * 300 * st.cav));
      const T = (f) => (fn ? 20 * Math.log10(P.transmissibility(f / fn, st.type === 'spring' ? 0.04 : 0.1)) : 0);
      return { m, defl, fn, n, per, fmam, T };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: section through the ceiling. The structural floor above shakes (footsteps, bass); the hangers decide how much of that reaches the hung ceiling. Right: the fraction of vibration passed on — below 0 dB the hangers isolate. The dashed line is the resonance of the ceiling mass on the trapped air, which also has to stay low.',
      draw(ctx, w, h, t) {
        const r = R, lw = Math.min(w * 0.38, 330), x0 = 20, cw = lw - 40, tt = Math.max(0, t);
        const sh = Math.sin(tt * 22) * 2.2, tr = r.fn ? Math.min(1.6, Math.pow(10, r.T(60) / 20)) : 1;
        ctx.fillStyle = A.css('muted'); ctx.fillRect(x0, 30 + sh, cw, 22);
        A.text(ctx, 'structural floor above', x0 + cw / 2, 24, { align: 'center', size: 10, color: A.css('muted') });
        const cy = 30 + 22 + A.clamp(st.cav * 260, 40, 150);
        ctx.fillStyle = A.alpha(A.css('c4'), 0.35); ctx.fillRect(x0, 52 + sh, cw, cy - 52);
        const nH = Math.max(2, Math.round(cw / (st.grid * 60)));
        for (let k = 0; k < nH; k++) {
          const x = x0 + ((k + 0.5) / nH) * cw; ctx.strokeStyle = st.type === 'direct' ? A.css('bad') : A.css('accent'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 52 + sh);
          if (st.type === 'spring' || st.type === 'combo') { const top = 52 + sh, bot = cy + sh * tr; for (let q = 1; q <= 8; q++) ctx.lineTo(x + (q % 2 ? 6 : -6), top + ((bot - top) * q) / 8); }
          else ctx.lineTo(x, cy + sh * tr);
          ctx.stroke();
          if (st.type === 'rubber' || st.type === 'combo') { ctx.fillStyle = A.css('good'); ctx.fillRect(x - 6, 54 + sh, 12, 8); }
        }
        ctx.lineWidth = 1;
        ctx.fillStyle = A.css('text'); ctx.fillRect(x0, cy + sh * tr, cw, 4 + st.layers * 4);
        A.text(ctx, `hung ceiling · ${fmt(r.m, 1)} kg/m²`, x0 + cw / 2, cy + 30 + st.layers * 4, { align: 'center', size: 10 });
        const ax = A.axes(ctx, w, h, { x: { min: 3, max: 500, log: true, label: 'Frequency (Hz)', ticks: [5, 10, 20, 50, 100, 200, 500] }, y: { min: -45, max: 20, label: 'Vibration passed on (dB)' }, pad: { l: lw + 52, r: 12, t: 14, b: 36 } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(0), ax.x1 - ax.x0, ax.y0 - ax.Y(0));
        const pts = []; for (let f = 3; f <= 500; f *= 1.03) pts.push([f, A.clamp(r.T(f), -45, 20)]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.8);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('warn'); ctx.beginPath(); ctx.moveTo(ax.X(r.fmam), ax.y1); ctx.lineTo(ax.X(r.fmam), ax.y0); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'air-cavity resonance ' + fmtHz(r.fmam), ax.X(r.fmam) + 3, ax.y1 + 12, { size: 10, color: A.css('warn') });
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Hanger resonance', r.fn ? fmt(r.fn, 1) + ' Hz' : 'none — rigid', r.fn ? `deflection ${fmt(r.defl, 2)} mm` : 'no isolation', !r.fn ? 'bad' : r.fn < 8 ? 'good' : 'warn') + A.statBox('Isolates above', r.fn ? fmt(r.fn * Math.SQRT2, 1) + ' Hz' : '—', '√2 × resonance') + A.statBox('Hangers needed', String(r.n), `${fmt(r.per, 1)} kg each`) + A.statBox('Ceiling mass', fmt(r.m, 1) + ' kg/m²', `${st.layers} layer${st.layers > 1 ? 's' : ''} + framing`) + A.statBox('Air-cavity resonance', fmtHz(r.fmam), r.fmam > 60 ? 'deepen the cavity or add mass' : 'low enough', r.fmam > 60 ? 'warn' : 'good');
      const T = [];
      if (st.type === 'direct') T.push('A rigidly fixed ceiling passes impact and bass vibration straight through. Even simple rubber hangers or clips transform the result.');
      if (st.load < 50) T.push('Under-loaded hangers barely compress, so the resonance stays high. Choose a softer rating or space them further apart so each carries 70–100 % of its rated load.');
      if (st.load > 110) T.push('Over-loaded hangers bottom out and become rigid. Use more hangers or a higher rating.');
      if (r.fn && r.fn > 12) T.push('For bass-heavy sources (drums, subwoofers, home cinema) aim for spring hangers with a resonance below about 6–8 Hz.');
      T.push('Keep the perimeter free: a 5–10 mm gap sealed with flexible sealant. One screw through the ceiling into a joist short-circuits every hanger.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Absorbing waveguide trap (guide panels leading sound into depth)
     ====================================================================== */
  V.waveguideTrap = function (host) {
    const st = A.controls(host, [
      { key: 'L', label: 'Depth of the waveguide channels', type: 'range', min: 0.3, max: 2.4, step: 0.05, value: 1.2, unit: 'm' },
      { key: 'wm', label: 'Channel width at the mouth', type: 'range', min: 0.1, max: 0.8, step: 0.01, value: 0.4, unit: 'm' },
      { key: 'taper', label: 'Channel shape', type: 'select', value: 'taper', options: [['taper', 'Tapering to a point (wedge)'], ['const', 'Constant width'], ['fold', 'Folded: sound turns a corner (doubles the path)']] },
      { key: 'lin', label: 'Absorbent lining on each guide panel', type: 'range', min: 0.01, max: 0.12, step: 0.005, value: 0.05, unit: 'm' },
      { key: 'ang', label: 'Guide panels angled to the room by', type: 'range', min: 0, max: 60, step: 5, value: 30, unit: '°' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const path = st.L * (st.taper === 'fold' ? 1.9 : 1) / Math.cos((st.ang * Math.PI) / 180 * 0.5);
      const fc = C / (2 * st.wm), fLow = C / (4 * path);
      const fillRatio = Math.min(1, (2 * st.lin) / st.wm);
      const alpha = (f) => {
        const lam = C / f, depth = 1 / (1 + Math.pow(lam / 4 / path, 2.2));
        const graze = 1 - Math.exp(-(path / st.wm) * fillRatio * 2.2 * Math.min(1, f / 60));
        const taperGain = st.taper === 'taper' ? 1 : st.taper === 'fold' ? 0.92 : 0.8;
        const mouthLoss = 1 - 0.08 / (1 + Math.pow(fc / f, 4));
        return A.clamp((0.25 + 0.75 * depth) * graze * taperGain * mouthLoss + 0.05, 0, 1);
      };
      return { path, fc, fLow, fillRatio, alpha };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 320, animate: true,
      caption: 'Left: plan view of a rear-wall waveguide trap. Rigid guide panels lined with absorbent split the wall depth into channels. Sound enters at the mouths (bottom), is carried along between the absorbent faces and fades before it can come back. A taper reflects less from the mouth because the change is gradual. Right: indicative absorption — the low limit follows the path length.',
      draw(ctx, w, h, t) {
        const r = R, lw = Math.min(w * 0.42, 380), x0 = 18, y0 = 20, cw = lw - 36, ch = h - 62, n = Math.max(2, Math.round(3.2 / Math.max(0.2, st.wm + 0.1))), cwid = cw / n, tt = Math.max(0, t);
        ctx.fillStyle = A.css('muted'); ctx.fillRect(x0, y0 - 8, cw, 8);
        const lean = Math.tan((st.ang * Math.PI) / 180) * 0.35 * cwid;
        for (let k = 0; k <= n; k++) {
          const xb = x0 + k * cwid, xt = xb + (st.taper === 'taper' ? 0 : lean);
          ctx.strokeStyle = A.alpha(A.css('c4'), 0.8); ctx.lineWidth = Math.max(4, (st.lin / st.wm) * cwid * 0.9); ctx.beginPath(); ctx.moveTo(xb, y0 + ch);
          if (st.taper === 'taper') { ctx.lineTo(xb + (k < n ? cwid / 2 : 0) - (k === n ? cwid / 2 : 0), y0 + 4); } else ctx.lineTo(xt, y0 + 4);
          ctx.stroke();
          if (st.taper === 'taper' && k < n) { ctx.beginPath(); ctx.moveTo(xb + cwid, y0 + ch); ctx.lineTo(xb + cwid / 2, y0 + 4); ctx.stroke(); }
          ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xb, y0 + ch);
          if (st.taper === 'taper') ctx.lineTo(xb + (k < n ? cwid / 2 : -cwid / 2), y0 + 4); else ctx.lineTo(xt, y0 + 4);
          ctx.stroke();
        }
        if (st.taper === 'fold') { ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; for (let k = 0; k < n; k++) { ctx.beginPath(); ctx.moveTo(x0 + k * cwid + cwid / 2, y0 + ch * 0.25); ctx.lineTo(x0 + k * cwid + cwid / 2, y0 + ch); ctx.stroke(); } }
        ctx.lineWidth = 1;
        for (let k = 0; k < n; k++) for (let q = 0; q < 3; q++) {
          const ph = ((tt * 0.4 + q / 3 + k * 0.07) % 1), y = y0 + ch - ph * ch, half = st.taper === 'taper' ? (cwid / 2) * (1 - ph) * 0.8 : cwid * 0.32, xc = x0 + k * cwid + cwid / 2 + (st.taper === 'taper' ? 0 : lean * ph);
          ctx.strokeStyle = A.alpha(A.css('c3'), Math.max(0, 0.9 * Math.pow(1 - ph, 1.6))); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xc - half, y); ctx.quadraticCurveTo(xc, y - 8, xc + half, y); ctx.stroke();
        }
        ctx.lineWidth = 1;
        A.text(ctx, 'mouths — room side', x0 + cw / 2, y0 + ch + 16, { align: 'center', size: 10, color: A.css('muted') });
        const ax = A.axes(ctx, w, h, { x: { min: 25, max: 2000, log: true, label: 'Frequency (Hz)', ticks: [31, 63, 125, 250, 500, 1000, 2000] }, y: { min: 0, max: 1.05, label: 'Absorption α (indicative)' }, pad: { l: lw + 52, r: 12, t: 14, b: 36 } });
        const fs = []; for (let f = 25; f <= 2000; f *= 1.04) fs.push(f);
        A.plotFill(ctx, ax, fs.map((f) => [f, r.alpha(f)]), A.alpha(A.css('accent'), 0.12), 0);
        A.plotLine(ctx, ax, fs.map((f) => [f, r.alpha(f)]), A.css('accent'), 2.8);
        [[r.fLow, 'depth limit', 'bad'], [r.fc, 'plane-wave limit', 'warn']].forEach(([f, l, c], i) => { if (f < 25 || f > 2000) return; ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css(c); ctx.beginPath(); ctx.moveTo(ax.X(f), ax.y1); ctx.lineTo(ax.X(f), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, `${l} ${fmtHz(f)}`, ax.X(f) + 3, ax.y1 + 12 + i * 13, { size: 10, color: A.css(c) }); });
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Sound path in the channel', A.fmtLen(r.path), st.taper === 'fold' ? 'folded: nearly double' : '') + A.statBox('Useful from about', fmtHz(r.fLow), 'c / (4 × path)') + A.statBox('Plane waves up to', fmtHz(r.fc), 'c / (2 × channel width)') + A.statBox('α at 50 / 100 Hz', `${fmt(r.alpha(50), 2)} / ${fmt(r.alpha(100), 2)}`, '', r.alpha(63) > 0.6 ? 'good' : r.alpha(63) > 0.35 ? 'warn' : 'bad') + A.statBox('Lining fills', fmt(r.fillRatio * 100, 2) + ' % of the channel', r.fillRatio > 0.7 ? 'nearly solid: reflects' : r.fillRatio < 0.15 ? 'thin: weak damping' : 'good balance', r.fillRatio > 0.7 || r.fillRatio < 0.15 ? 'warn' : 'good');
      const T = [];
      if (r.path < 0.9) T.push('The low limit is set by the path: under about 1 m of channel the trap fades below roughly 100 Hz. Deepen it or fold the channels.');
      if (st.taper === 'const') T.push('A constant channel reflects more at its mouth and at its end. Taper it, or stagger the lining so the absorption builds up gradually.');
      if (r.fillRatio > 0.7) T.push('The lining almost closes the channel: sound sees a dense face and reflects. Leave an open core so the wave can travel in.');
      if (st.ang < 15 && st.taper !== 'taper') T.push('Guide panels square to the room show a hard edge to the listener. Angle them so reflections from the panel edges are sent sideways into the next channel.');
      if (!T.length) T.push('A workable waveguide trap. Use rigid, heavy guide panels (18 mm board), line both faces, close the front with open fabric, and verify with a decay measurement.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Loudspeaker waveguide — directivity matching at the crossover
     ====================================================================== */
  V.speakerWaveguide = function (host) {
    const st = A.controls(host, [
      { key: 'wd', label: 'Woofer diameter (cone)', type: 'range', min: 80, max: 380, step: 5, value: 165, unit: 'mm' },
      { key: 'fx', label: 'Crossover frequency', type: 'range', min: 800, max: 4000, step: 50, value: 2200, unit: 'Hz' },
      { key: 'wg', label: 'Tweeter', type: 'select', value: 'none', options: [['none', '25 mm dome on a flat baffle (no waveguide)'], ['wg', 'Dome in a waveguide']] },
      { key: 'mouth', label: 'Waveguide mouth width', type: 'range', min: 60, max: 400, step: 5, value: 150, unit: 'mm' },
      { key: 'cov', label: 'Waveguide coverage angle', type: 'range', min: 50, max: 120, step: 5, value: 90, unit: '°' },
      { key: 'f', label: 'Show the radiation pattern at', type: 'range', min: Math.log10(300), max: Math.log10(16000), step: 0.01, value: Math.log10(2200), fmt: (v) => fmtHz(Math.pow(10, v)) },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const piston = (dmm, f) => { const x = (0.705 * (C / f)) / (dmm / 1000); return x >= 1 ? 180 : (2 * Math.asin(x) * 180) / Math.PI; };
    const fpc = () => 1e6 / (st.cov * st.mouth);
    const tweeter = (f) => { if (st.wg === 'none') return Math.min(180, piston(25, f) * 1.0 + (f < 3000 ? 0 : 0)); const fp = fpc(); return f >= fp ? st.cov : Math.min(180, st.cov * Math.pow(fp / f, 1.1)); };
    const woofer = (f) => piston(st.wd, f);
    const system = (f) => { const wl = 1 / (1 + Math.pow(f / st.fx, 4)); return woofer(f) * wl + tweeter(f) * (1 - wl); };
    const cv = A.canvas(host, {
      height: 320, animate: true,
      caption: 'Left: the speaker seen from above with its beam at the chosen frequency (the wedge is the −6 dB coverage). Right: coverage angle versus frequency for the woofer, the tweeter and the two combined. A good design has no sudden step at the crossover — the waveguide narrows the tweeter to meet the woofer, so the sound sent toward the walls has the same tone as the sound sent to you.',
      draw(ctx, w, h, t) {
        const lw = Math.min(w * 0.34, 300), cx = lw / 2 + 6, cy = h - 70, f = Math.pow(10, st.f), bw = system(f), R0 = Math.min(lw / 2 - 10, h - 110);
        ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(cx - 36, cy, 72, 44, 5); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1;
        if (st.wg === 'wg') { ctx.fillStyle = A.css('accent2'); ctx.beginPath(); ctx.moveTo(cx - 6, cy + 14); ctx.lineTo(cx - 6 - st.mouth / 16, cy); ctx.lineTo(cx + 6 + st.mouth / 16, cy); ctx.lineTo(cx + 6, cy + 14); ctx.fill(); }
        const half = (Math.min(179, bw) / 2) * (Math.PI / 180);
        ctx.fillStyle = A.alpha(A.css('accent'), 0.16); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R0, -Math.PI / 2 - half, -Math.PI / 2 + half); ctx.closePath(); ctx.fill();
        for (let k = 0; k < 4; k++) { const rr = ((Math.max(0, t) * 0.5 + k / 4) % 1) * R0; ctx.strokeStyle = A.alpha(A.css('accent'), 0.9 * (1 - rr / R0)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, rr, -Math.PI / 2 - half, -Math.PI / 2 + half); ctx.stroke(); }
        ctx.lineWidth = 1;
        A.text(ctx, `${fmtHz(f)} · ${bw >= 179 ? 'all round' : fmt(bw, 1) + '° wide'}`, cx, 18, { align: 'center', size: 12, weight: 700 });
        const ax = A.axes(ctx, w, h, { x: { min: 300, max: 16000, log: true, label: 'Frequency (Hz)', ticks: [300, 500, 1000, 2000, 4000, 8000, 16000] }, y: { min: 0, max: 190, label: 'Coverage angle (−6 dB), degrees' }, pad: { l: lw + 56, r: 12, t: 14, b: 36 } });
        const fs = []; for (let ff = 300; ff <= 16000; ff *= 1.03) fs.push(ff);
        A.plotLine(ctx, ax, fs.map((ff) => [ff, woofer(ff)]), A.alpha(A.css('c3'), 0.8), 1.5, [5, 4]);
        A.plotLine(ctx, ax, fs.map((ff) => [ff, tweeter(ff)]), A.alpha(A.css('accent2'), 0.8), 1.5, [2, 4]);
        A.plotLine(ctx, ax, fs.map((ff) => [ff, system(ff)]), A.css('accent'), 3);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(ax.X(st.fx), ax.y1); ctx.lineTo(ax.X(st.fx), ax.y0); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'crossover', ax.X(st.fx) + 3, ax.y1 + 12, { size: 10, color: A.css('muted') });
        dot(ctx, ax.X(f), ax.Y(Math.min(190, bw)), 6, A.css('accent'));
      },
    });
    host.appendChild(A.legend([[A.css('c3'), 'Woofer', true], [A.css('accent2'), 'Tweeter', true], [A.css('accent'), 'System']]));
    function upd() {
      const wX = woofer(st.fx), tX = tweeter(st.fx), step = tX - wX, fp = fpc();
      out.innerHTML = A.statBox('Woofer at the crossover', (wX >= 179 ? 'omni' : fmt(wX, 1) + '°'), wX < 70 ? 'already beaming' : '') + A.statBox('Tweeter at the crossover', (tX >= 179 ? 'omni' : fmt(tX, 1) + '°'), st.wg === 'wg' ? 'waveguide-controlled' : 'tiny dome: very wide') + A.statBox('Step at the crossover', (step > 0 ? '+' : '') + fmt(step, 1) + '°', Math.abs(step) < 25 ? 'well matched' : Math.abs(step) < 60 ? 'noticeable' : 'big mismatch', Math.abs(step) < 25 ? 'good' : Math.abs(step) < 60 ? 'warn' : 'bad') + (st.wg === 'wg' ? A.statBox('Waveguide holds its pattern down to', fmtHz(fp), fp > st.fx ? 'above the crossover — make it bigger' : 'below the crossover ✓', fp > st.fx ? 'warn' : 'good') : A.statBox('Add a waveguide', 'to control the tweeter', 'try the second option'));
      const T = [];
      if (st.wg === 'none' && step > 60) T.push('The woofer has narrowed to a beam but the bare dome sprays sound almost everywhere: off-axis there is a flare of energy just above the crossover, so side-wall reflections sound brighter than the direct sound. A waveguide fixes this.');
      if (st.wg === 'wg' && fp > st.fx) T.push(`This waveguide is too small to control ${fmtHz(st.fx)}: it needs a mouth of about ${Math.round(1e6 / (st.cov * st.fx))} mm for ${st.cov}° — or raise the crossover.`);
      if (st.wg === 'wg' && Math.abs(step) < 25 && fp <= st.fx) T.push('Matched directivity: the off-axis response falls smoothly, which makes the room’s reflections sound like the direct sound and makes treatment and EQ far more predictable.');
      if (wX < 60) T.push('The woofer is beaming hard at this crossover. Cross over lower (or use a smaller woofer / a mid driver) so the hand-over happens where the woofer is still about as wide as the waveguide.');
      T.push('Rule of thumb for waveguides and horns: pattern control holds down to f ≈ 1 000 000 ÷ (coverage angle × mouth width in mm).');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };
})();
