/* ==========================================================================
   Acoustica — speaker stands, studio desk and bass-trap placement tools.
   Simplified teaching models built on the app's physics.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C = 343;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };

  /* ======================================================================
     1. Speaker-stand builder
     ====================================================================== */
  const COL = { steel: ['Hollow steel / aluminium tube', 6, 0.9], sand: ['Steel or PVC tube filled with dry sand', 24, 0.15], timber: ['Solid timber post / laminated ply', 9, 0.4], block: ['Stacked concrete blocks or bricks', 48, 0.1], mdf: ['MDF box column, sand-filled', 32, 0.12] };
  const DEC = { hard: ['Rigid: spikes, cones or bare contact', 0.05, 1], foam: ['Dense foam pad', 1.2, 1.5], rubber: ['Rubber / sorbothane-type pucks (correctly loaded)', 2.5, 1.4], balls: ['DIY: halved squash balls / inner-tube ring', 4, 1.3], spring: ['Spring isolators', 7, 1.0] };
  V.standBuilder = function (host) {
    const st = A.controls(host, [
      { key: 'ms', label: 'Speaker weight', type: 'range', min: 3, max: 45, step: 0.5, value: 9, unit: 'kg' },
      { key: 'hs', label: 'Speaker height', type: 'range', min: 0.2, max: 0.7, step: 0.01, value: 0.36, unit: 'm' },
      { key: 'tw', label: 'Tweeter height above the speaker’s base', type: 'range', min: 0.1, max: 0.6, step: 0.01, value: 0.27, unit: 'm' },
      { key: 'ear', label: 'Your seated ear height', type: 'range', min: 1.05, max: 1.35, step: 0.01, value: 1.2, unit: 'm' },
      { key: 'col', label: 'Column', type: 'select', value: 'steel', options: Object.entries(COL).map(([k, v]) => [k, v[0]]) },
      { key: 'base', label: 'Base plate width', type: 'range', min: 0.2, max: 0.6, step: 0.01, value: 0.3, unit: 'm' },
      { key: 'dec', label: 'Between speaker and stand', type: 'select', value: 'hard', options: Object.entries(DEC).map(([k, v]) => [k, v[0]]) },
      { key: 'plate', label: 'Heavy plate (paving slab / steel) under the speaker, on top of the isolators', type: 'check', value: false },
      { key: 'floor', label: 'Floor', type: 'select', value: 'timber', options: [['timber', 'Suspended timber / raised floor'], ['slab', 'Concrete slab on ground'], ['desk', 'Stand sits on the desk']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const hStand = Math.max(0.2, st.ear - st.tw);
      const d = DEC[st.dec], fn = 15.76 / Math.sqrt(d[1]) * Math.sqrt(d[2]);
      const zeta = st.dec === 'spring' ? 0.03 : st.dec === 'hard' ? 0.02 : 0.12;
      const T = (f) => (st.dec === 'hard' ? 0 : 20 * Math.log10(P.transmissibility(f / fn, zeta)));
      const mStand = COL[st.col][1] * (hStand / 0.9), mTop = st.ms + (st.plate ? 12 : 0);
      const cog = (mStand * hStand * 0.45 + mTop * (hStand + st.hs / 2)) / (mStand + mTop);
      const tip = (Math.atan(st.base / 2 / cog) * 180) / Math.PI;
      const rock = st.dec !== 'hard' && !st.plate && st.ms < 12 && d[1] >= 2.5;
      return { hStand, fn, T, mStand, cog, tip, ring: COL[st.col][2], rock, iso50: -T(50), iso100: -T(100) };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 320, animate: true,
      caption: 'Left: your stand (animated — the cabinet shakes as the woofer moves; arrows show how much of that vibration reaches the floor). The green line is your ear height; the tweeter should sit on it. Right: transmissibility of the decoupling layer — above 0 dB it amplifies, below it isolates.',
      draw(ctx, w, h, t) {
        const r = R, lw = Math.min(w * 0.36, 300), gy = h - 30, sc = (h - 60) / 1.7, cx = lw / 2;
        const Y = (m) => gy - m * sc;
        ctx.fillStyle = st.floor === 'slab' ? A.css('muted') : st.floor === 'desk' ? A.css('accent2') : '#a8763e'; ctx.fillRect(10, gy, lw - 20, 8);
        const bw = st.base * sc; ctx.fillStyle = A.css('text'); ctx.fillRect(cx - bw / 2, gy - 6, bw, 6);
        const cw = st.col === 'block' ? 34 : st.col === 'mdf' ? 26 : 12;
        ctx.fillStyle = st.col === 'block' ? '#8d8d8d' : st.col === 'timber' ? '#a8763e' : st.col === 'mdf' ? '#c9a57a' : A.css('muted'); ctx.fillRect(cx - cw / 2, Y(r.hStand) + 4, cw, r.hStand * sc - 10);
        if (st.col === 'sand' || st.col === 'mdf') { ctx.fillStyle = A.alpha('#d8b46a', 0.9); ctx.fillRect(cx - cw / 2 + 3, Y(r.hStand) + 14, cw - 6, r.hStand * sc - 26); }
        ctx.fillStyle = A.css('text'); ctx.fillRect(cx - 24, Y(r.hStand), 48, 5);
        const shake = Math.sin(t * 30) * 1.6, tr = Math.pow(10, r.T(60) / 20);
        const padH = st.dec === 'hard' ? 3 : 8; ctx.fillStyle = st.dec === 'hard' ? A.css('text') : A.css('good');
        [-16, 16].forEach((dx) => { if (st.dec === 'hard') { ctx.beginPath(); ctx.moveTo(cx + dx - 4, Y(r.hStand) - padH); ctx.lineTo(cx + dx + 4, Y(r.hStand) - padH); ctx.lineTo(cx + dx, Y(r.hStand)); ctx.fill(); } else ctx.fillRect(cx + dx - 6, Y(r.hStand) - padH, 12, padH); });
        let top = Y(r.hStand) - padH;
        if (st.plate) { ctx.fillStyle = '#8d8d8d'; ctx.fillRect(cx - 26, top - 6, 52, 6); top -= 6; }
        const sw = 46, sh = st.hs * sc, sx = cx - sw / 2 + shake * (r.rock ? 2.2 : 1);
        ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(sx, top - sh, sw, sh, 4); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1;
        const twY = top - st.tw * sc; dot(ctx, sx + sw / 2, twY, 4, A.css('accent')); ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.arc(sx + sw / 2, top - sh * 0.3, Math.min(14, sh * 0.22), 0, TAU); ctx.stroke();
        ctx.setLineDash([5, 4]); ctx.strokeStyle = A.css('good'); ctx.beginPath(); ctx.moveTo(10, Y(st.ear)); ctx.lineTo(lw - 6, Y(st.ear)); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'ear height', lw - 8, Y(st.ear) - 4, { align: 'right', size: 10, color: A.css('good') });
        const n = Math.round(1 + 4 * Math.min(1, tr));
        for (let k = 0; k < n; k++) { const yy = Y(r.hStand) + 12 + ((t * 60 + k * 30) % Math.max(20, r.hStand * sc - 20)); ctx.strokeStyle = A.alpha(A.css('bad'), Math.min(1, 0.25 + tr * 0.6)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - cw / 2 - 8, yy); ctx.lineTo(cx - cw / 2 - 8, yy + 8); ctx.lineTo(cx - cw / 2 - 12, yy + 4); ctx.stroke(); }
        ctx.lineWidth = 1;
        if (COL[st.col][2] > 0.6) for (let k = 0; k < 2; k++) { ctx.strokeStyle = A.alpha(A.css('warn'), 0.5 + 0.4 * Math.sin(t * 20)); ctx.beginPath(); ctx.arc(cx + cw / 2 + 4, Y(r.hStand / 2), 8 + k * 6, -0.8, 0.8); ctx.stroke(); }
        const ax = A.axes(ctx, w, h, { x: { min: 5, max: 500, log: true, label: 'Frequency (Hz)', ticks: [5, 10, 20, 50, 100, 200, 500] }, y: { min: -40, max: 20, label: 'Vibration passed on (dB)' }, pad: { l: lw + 50, r: 12, t: 14, b: 36 } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(0), ax.x1 - ax.x0, ax.y0 - ax.Y(0));
        const pts = []; for (let f = 5; f <= 500; f *= 1.03) pts.push([f, A.clamp(r.T(f), -40, 20)]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.8);
        if (st.dec !== 'hard' && r.fn < 500) { ctx.setLineDash([3, 4]); ctx.strokeStyle = A.css('bad'); ctx.beginPath(); ctx.moveTo(ax.X(r.fn), ax.y1); ctx.lineTo(ax.X(r.fn), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'resonance ' + fmtHz(r.fn), ax.X(r.fn) + 3, ax.y1 + 12, { size: 10, color: A.css('bad') }); }
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Stand height needed', A.fmtLen(r.hStand), 'tweeter at ear height') + A.statBox('Vibration isolation at 50 / 100 Hz', `${fmt(Math.max(0, r.iso50), 2)} / ${fmt(Math.max(0, r.iso100), 2)} dB`, r.iso50 < 3 ? 'none in the bass' : 'working', r.iso50 > 10 ? 'good' : r.iso50 > 3 ? 'warn' : 'bad') + A.statBox('Tip-over margin', fmt(r.tip, 2) + '°', r.tip < 10 ? 'unstable — widen the base' : r.tip < 15 ? 'borderline' : 'stable', r.tip < 10 ? 'bad' : r.tip < 15 ? 'warn' : 'good') + A.statBox('Stand weight', fmt(r.mStand, 3) + ' kg', r.ring > 0.6 ? 'hollow: rings' : 'well damped', r.ring > 0.6 ? 'warn' : 'good');
      const T = [];
      if (r.ring > 0.6) T.push('A hollow metal column rings like a bell when tapped. Fill it with dry sand (or lead shot/kitty litter) — mass and damping in one step.');
      if (st.dec === 'hard' && st.floor !== 'slab') T.push('Rigid contact passes all cabinet vibration into a springy floor or the desk, which then radiates its own delayed bass. Decouple with correctly loaded pads or pucks.');
      if (st.dec === 'hard' && st.floor === 'slab') T.push('On a ground-bearing concrete slab, a rigid, heavy stand is fine: there is little to excite. Spikes through carpet give stability, not isolation.');
      if (st.dec === 'foam') T.push('Foam pads only isolate above roughly 20–25 Hz and compress unevenly. They mainly help on desks and shelves; check the pad is rated for the speaker’s weight.');
      if (r.rock) T.push('A light speaker on a soft mount can rock back as the woofer pushes forward, softening bass transients and blurring the image. Add a heavy plate under the speaker (on top of the isolators) so the mass sits <i>above</i> the spring.');
      if (st.floor === 'desk') T.push('Stands on the desk still couple into it. Best: floor stands just behind the desk; next best: heavy desktop stands on isolators that lift the tweeter to ear height.');
      if (r.tip < 15) T.push('Top-heavy: widen or weight the base, fill the lower column, or strap the speaker — especially with children or pets around.');
      if (!T.length) T.push('A sound design: heavy, damped column; isolation tuned well below the bass; stable base; tweeter on the ear line. Angle the speakers at your ears and measure.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Desk lab — the desk bounce and how to get rid of it
     ====================================================================== */
  const SURF = { hard: ['Flat, hard desktop', 0.9], narrow: ['Shallow desk (pulled toward you)', 0.9], slope: ['Top sloped down toward you / angled console', 0.25], open: ['Open-frame or perforated top', 0.3], soft: ['Absorbent desk mat (thick felt) over the bounce zone', 0.55] };
  V.deskLab = function (host) {
    const st = A.controls(host, [
      { key: 'pos', label: 'Monitors', type: 'select', value: 'bridge', options: [['bridge', 'On the desk / meter bridge'], ['stand', 'On floor stands behind the desk'], ['high', 'On stands, raised and tilted down']] },
      { key: 'D', label: 'Ear-to-speaker distance', type: 'range', min: 0.8, max: 2.5, step: 0.05, value: 1.2, unit: 'm' },
      { key: 'depth', label: 'Desk depth', type: 'range', min: 0.45, max: 1.3, step: 0.05, value: 0.8, unit: 'm' },
      { key: 'surf', label: 'Desk surface', type: 'select', value: 'hard', options: Object.entries(SURF).map(([k, v]) => [k, v[0]]) },
      { key: 'hd', label: 'Desk height', type: 'range', min: 0.65, max: 0.8, step: 0.01, value: 0.73, unit: 'm' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const he = 1.2, hs = st.pos === 'high' ? 1.42 : st.pos === 'stand' ? 1.2 : st.hd + 0.32;
      const depth = st.surf === 'narrow' ? Math.min(st.depth, 0.55) : st.depth;
      const front = st.D - 0.28, back = front - depth; // x measured from the speaker toward the ear
      const a = hs - st.hd, b = he - st.hd, xr = (st.D * a) / (a + b);
      const hits = xr >= Math.max(0, back) && xr <= front;
      const direct = Math.hypot(st.D, hs - he), refl = Math.hypot(st.D, a + b), dp = refl - direct;
      const r = hits ? SURF[st.surf][1] * (direct / refl) : 0;
      const resp = (f) => { const ph = (TAU * f * dp) / C; return 20 * Math.log10(Math.hypot(1 + r * Math.cos(ph), r * Math.sin(ph))); };
      return { he, hs, front, back, xr, hits, dp, r, resp, f1: C / (2 * dp), ms: (dp / C) * 1000, depth };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 320, animate: true,
      caption: 'Left: side view. The direct sound (green) and the bounce off the desk (red) reach your ear a fraction of a millisecond apart and cancel at regular frequencies — a comb filter. Right: what that does to the response. Move the monitors behind the desk, raise them, shorten or slope the desk, and watch the bounce miss the desktop altogether.',
      draw(ctx, w, h, t) {
        const r = R, lw = Math.min(w * 0.42, 380), sc = (lw - 40) / Math.max(1.6, st.D + 0.5), gy = h - 26, X = (x) => 24 + x * sc, Y = (y) => gy - y * sc * 0.95;
        ctx.fillStyle = A.css('muted'); ctx.fillRect(10, gy, lw - 10, 4);
        const dy = Y(st.hd), dx0 = X(Math.max(-0.05, r.back)), dx1 = X(r.front);
        ctx.save(); if (st.surf === 'slope') { ctx.translate(dx1, dy); ctx.rotate(-0.14); ctx.translate(-dx1, -dy); }
        ctx.fillStyle = st.surf === 'soft' ? A.css('c4') : A.css('accent2'); ctx.fillRect(dx0, dy, dx1 - dx0, 7);
        if (st.surf === 'open') { ctx.fillStyle = A.css('panel'); for (let x = dx0 + 6; x < dx1 - 4; x += 12) ctx.fillRect(x, dy, 6, 7); }
        ctx.restore();
        ctx.fillStyle = A.css('accent2'); ctx.fillRect(dx0 + 4, dy + 7, 5, gy - dy - 7); ctx.fillRect(dx1 - 9, dy + 7, 5, gy - dy - 7);
        const sx = X(0), sy = Y(r.hs);
        if (st.pos !== 'bridge') { ctx.fillStyle = A.css('muted'); ctx.fillRect(sx - 3, sy + 16, 6, gy - sy - 16); }
        ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.save(); ctx.translate(sx, sy); if (st.pos === 'high') ctx.rotate(0.18); ctx.beginPath(); ctx.roundRect(-12, -18, 24, 36, 3); ctx.fill(); ctx.stroke(); ctx.restore(); ctx.lineWidth = 1;
        const ex = X(st.D), ey = Y(r.he); dot(ctx, ex, ey, 9, A.css('good')); A.text(ctx, 'ear', ex, ey - 14, { align: 'center', size: 10 });
        ctx.strokeStyle = A.css('good'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
        const rx = X(r.xr);
        ctx.strokeStyle = A.alpha(A.css('bad'), r.hits ? 0.9 : 0.25); ctx.setLineDash(r.hits ? [] : [4, 5]); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(rx, dy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
        const ph = ((t * 0.9) % 1 + 1) % 1;
        dot(ctx, sx + (ex - sx) * ph, sy + (ey - sy) * ph, 4, A.css('good'));
        if (r.hits) { const l1 = Math.hypot(rx - sx, dy - sy), l2 = Math.hypot(ex - rx, ey - dy), d = ph * (l1 + l2) * 0.97; const px = d < l1 ? sx + ((rx - sx) * d) / l1 : rx + ((ex - rx) * (d - l1)) / l2, py = d < l1 ? sy + ((dy - sy) * d) / l1 : dy + ((ey - dy) * (d - l1)) / l2; dot(ctx, px, py, 4, A.css('bad')); }
        else A.text(ctx, 'bounce point misses the desk ✓', (sx + ex) / 2, gy - 6, { align: 'center', size: 10, weight: 700, color: A.css('good') });
        const ax = A.axes(ctx, w, h, { x: { min: 100, max: 10000, log: true, label: 'Frequency (Hz)', ticks: [100, 200, 500, 1000, 2000, 5000, 10000] }, y: { min: -24, max: 9, label: 'At your ear (dB)' }, pad: { l: lw + 50, r: 12, t: 14, b: 36 } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(3), ax.x1 - ax.x0, ax.Y(-3) - ax.Y(3));
        const pts = []; for (let f = 100; f <= 10000; f *= 1.012) pts.push([f, A.clamp(r.resp(f), -24, 9)]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.4);
      },
    });
    function upd() {
      R = calc(); const r = R; let worst = 0; for (let f = 100; f <= 10000; f *= 1.01) worst = Math.min(worst, r.resp(f));
      out.innerHTML = A.statBox('Desk bounce', r.hits ? 'reaches your ears' : 'misses the desk', r.hits ? `${fmt(r.ms, 2)} ms after the direct sound` : '', r.hits ? 'bad' : 'good') + A.statBox('First cancellation', r.hits ? fmtHz(r.f1) : '—', r.hits ? 'then every ' + fmtHz(2 * r.f1) : '') + A.statBox('Deepest notch', r.hits ? fmt(worst, 2) + ' dB' : '0 dB', r.hits && worst < -10 ? 'colours vocals & snare' : 'clean', r.hits && worst < -10 ? 'bad' : r.hits ? 'warn' : 'good') + A.statBox('Bounce lands', A.fmtLen(Math.max(0, r.front - r.xr)) + ' from the desk’s front edge', r.hits ? 'put the absorber mat here' : 'beyond the desktop');
      const T = [];
      if (st.pos === 'bridge') T.push('Monitors on the desk look straight across it. Move them to floor stands 20–40 cm behind the desk, or raise them and tilt down.');
      if (r.hits && st.surf === 'hard') T.push('Cover the bounce zone with a thick felt/wool mat, slope the surface, or use an open-frame desk. Keep big flat surfaces out of the line between speaker and ears.');
      if (r.hits && st.depth > 0.9) T.push('A deep desk is a big mirror. Use the shallowest desk your work allows and put racks to the sides, below desk height.');
      if (!r.hits) T.push('The geometry now sends the bounce past the desk. Check the same way for a second screen, a keyboard tray, a mixer and the armrests.');
      T.push('Screens between the speakers act as reflectors too: keep them low, tilted back, and behind the plane of the speakers.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Trap placer — which mode, which place
     ====================================================================== */
  V.trapPlacer = function (host) {
    const st = A.controls(host, [
      { key: 'L', label: 'Length', type: 'range', min: 2.5, max: 10, step: 0.05, value: 4.6, unit: 'm' },
      { key: 'W', label: 'Width', type: 'range', min: 2, max: 8, step: 0.05, value: 3.4, unit: 'm' },
      { key: 'H', label: 'Height', type: 'range', min: 2.1, max: 4.5, step: 0.05, value: 2.5, unit: 'm' },
      { key: 'kind', label: 'Trap you are placing', type: 'select', value: 'membrane', options: [['membrane', 'Resonant (membrane / Helmholtz) trap tuned to the selected mode'], ['corner', 'Deep porous corner trap (broadband)']] },
      { key: 'area', label: 'Face area of each trap', type: 'range', min: 0.5, max: 4, step: 0.1, value: 1.5, unit: 'm²' },
    ], () => { rebuild(); });
    const chips = el('div', { class: 'plan-layers' }); host.appendChild(chips);
    const row = el('div', { class: 'row' }); const auto = el('button', { class: 'primary' }, 'Place 4 traps where they help the most modes'), clr = el('button', {}, 'Remove all traps'); row.append(auto, clr); host.appendChild(row);
    const rule = el('div'); host.appendChild(rule);
    let modes = [], sel = 0, placed = [], cands = [];
    const room = () => ({ L: st.L, W: st.W, H: st.H, alpha: 0.05 });
    function candidates() {
      const { L, W, H } = st, e = 0.12, c = [];
      [[e, e, 'front-left'], [e, W - e, 'front-right'], [L - e, e, 'rear-left'], [L - e, W - e, 'rear-right']].forEach(([x, y, n]) => c.push({ x, y, z0: 0, z1: H, name: `${n} corner, floor to ceiling`, t: 'corner' }));
      [[e, W / 2, 'front wall, centre'], [L - e, W / 2, 'rear wall, centre'], [L / 2, e, 'left wall, centre'], [L / 2, W - e, 'right wall, centre']].forEach(([x, y, n]) => c.push({ x, y, z0: 0.4, z1: Math.min(H, 2.0), name: n, t: 'wall' }));
      [[e, W / 2, 'front wall–ceiling edge'], [L - e, W / 2, 'rear wall–ceiling edge'], [L / 2, e, 'left wall–ceiling edge'], [L / 2, W - e, 'right wall–ceiling edge']].forEach(([x, y, n]) => c.push({ x, y, z0: H - 0.45, z1: H, name: n, t: 'edge' }));
      [[L / 4, e, 'left wall, ¼ of the length'], [L / 4, W - e, 'right wall, ¼ of the length'], [(3 * L) / 4, e, 'left wall, ¾ of the length'], [(3 * L) / 4, W - e, 'right wall, ¾ of the length']].forEach(([x, y, n]) => c.push({ x, y, z0: 0.4, z1: Math.min(H, 2.0), name: n, t: 'wall' }));
      return c;
    }
    const weight = (m, c) => P.modeWeight(m.n, [st.L, st.W, st.H], P.itemPoints(c, st.H));
    const items = (list) => list.map((p) => ({ kind: p.kind, f0: p.f0, x: p.x, y: p.y, z0: p.z0, z1: p.z1, area: st.area }));
    function decay(list) { const tm = P.treatedModes(room(), items(list), 200); return modes.map((m) => tm.find((x) => x.n.join() === m.n.join()).T60); }
    function rebuild() {
      const all = P.roomModes(st.L, st.W, st.H, 170);
      modes = all.filter((m) => (m.type === 'axial' && m.f < 150) || (m.type === 'tangential' && m.f < 95) || (m.type === 'oblique' && m.f < 85)).slice(0, 9);
      sel = Math.min(sel, modes.length - 1); cands = candidates(); placed = placed.filter((p) => cands[p.ci]).map((p) => Object.assign({}, cands[p.ci], { ci: p.ci, kind: p.kind, f0: p.f0 }));
      chips.innerHTML = ''; modes.forEach((m, i) => { const b = el('button', { class: 'pill' + (i === sel ? ' on' : '') }, `${fmtHz(m.f)} (${m.n.join(',')})`); b.onclick = () => { sel = i; rebuild(); }; chips.appendChild(b); });
      upd();
    }
    function ruleText(m) {
      const [a, b, c2] = m.n, D = ['length', 'width', 'height'], parts = [];
      const act = m.n.map((n, i) => (n ? i : -1)).filter((i) => i >= 0);
      const surf = { 0: 'front and rear walls', 1: 'left and right side walls', 2: 'floor and ceiling' };
      if (m.type === 'axial') parts.push(`<b>Axial ${D[act[0]]} mode.</b> Pressure is highest over the whole of the ${surf[act[0]]} — any spot on them works for a resonant trap, corners included.`);
      else if (m.type === 'tangential') parts.push(`<b>Tangential mode</b> (${D[act[0]]} + ${D[act[1]]}). Pressure peaks along the <b>edges</b> where the ${surf[act[0]]} meet the ${surf[act[1]]}${c2 === 0 ? ' — the vertical room corners, floor to ceiling' : ' — the wall–ceiling and wall–floor edges'}.`);
      else parts.push('<b>Oblique mode.</b> Pressure peaks only in the eight three-way corners: corner-mounted traps reaching the ceiling or floor.');
      const nulls = act.map((i) => { const n = m.n[i], dim = [st.L, st.W, st.H][i]; return `${D[i]}: ` + Array.from({ length: n }, (_, k) => A.fmtLen((dim * (2 * k + 1)) / (2 * n))).join(', '); });
      parts.push(`<b>Dead zones</b> for a resonant trap (pressure nulls) at ${nulls.join(' · ')} from the wall — a pressure trap there does nothing for this mode, but it is where a <i>porous</i> layer hung in free air would work best, and where your ears should not be.`);
      parts.push(`Tune a membrane or Helmholtz trap to ≈ <b>${fmtHz(m.f)}</b>; for porous absorption this mode needs roughly ${A.fmtLen(C / m.f / 8)}–${A.fmtLen(C / m.f / 4)} of depth.`);
      return parts.join('<br>');
    }
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Plan view of the selected mode (colour = pressure, white = nulls). Circles are candidate trap positions: the fuller the ring, the more strongly that spot couples to the selected mode. Squares along the walls are wall–ceiling edges. <b>Click a position to place or remove a trap</b> (green). Corners light up for almost every mode — that is why they are the default place for bass traps.',
      draw(ctx, w, h, t) {
        const m = modes[sel]; if (!m) return;
        const sc = Math.min((w - 60) / st.L, (h - 40) / st.W), ox = (w - st.L * sc) / 2, oy = 20, N = 50, M2 = Math.max(8, Math.round((N * st.W) / st.L)), osc = Math.cos(Math.max(0, t) * 3);
        for (let i = 0; i < N; i++) for (let j = 0; j < M2; j++) { const v = P.modeShape(m.n, [st.L, st.W, st.H], [((i + 0.5) / N) * st.L, ((j + 0.5) / M2) * st.W, m.n[2] ? 0.05 : 1.2]) * osc; ctx.fillStyle = A.alpha(v > 0 ? A.css('bad') : A.css('c3'), Math.min(0.8, Math.abs(v))); ctx.fillRect(ox + (i / N) * st.L * sc, oy + (j / M2) * st.W * sc, (st.L * sc) / N + 0.6, (st.W * sc) / M2 + 0.6); }
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, st.L * sc, st.W * sc); ctx.lineWidth = 1;
        A.text(ctx, 'front', ox - 6, oy + (st.W * sc) / 2, { align: 'right', size: 10, color: A.css('muted') }); A.text(ctx, 'rear', ox + st.L * sc + 6, oy + (st.W * sc) / 2, { size: 10, color: A.css('muted') });
        cands.forEach((c, ci) => {
          const wgt = weight(m, c), k = Math.min(1, wgt / 4), isP = placed.some((p) => p.ci === ci);
          let px = ox + c.x * sc, py = oy + c.y * sc;
          if (c.t === 'edge') { px += c.x < 0.5 ? 30 : c.x > st.L - 0.5 ? -30 : 0; py += c.y < 0.5 ? 30 : c.y > st.W - 0.5 ? -30 : 0; }
          c._px = px; c._py = py;
          const r0 = c.t === 'corner' ? 13 : 10;
          ctx.fillStyle = isP ? A.css('good') : A.css('panel'); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 1.5;
          ctx.beginPath(); if (c.t === 'edge') ctx.rect(px - r0 + 2, py - r0 + 2, 2 * r0 - 4, 2 * r0 - 4); else ctx.arc(px, py, r0, 0, TAU); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = k > 0.6 ? A.css('accent') : k > 0.25 ? A.css('warn') : A.css('muted'); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(px, py, r0 + 4, -Math.PI / 2, -Math.PI / 2 + TAU * k); ctx.stroke(); ctx.lineWidth = 1;
          A.text(ctx, String(ci + 1), px, py + 4, { align: 'center', size: 10, weight: 700, color: isP ? '#fff' : A.css('text') });
        });
      },
      onPointer(p) {
        if (p.type !== 'pointerdown') return;
        const ci = cands.findIndex((c) => Math.hypot(p.x - c._px, p.y - c._py) < 16); if (ci < 0) return;
        const k = placed.findIndex((q) => q.ci === ci);
        if (k >= 0) placed.splice(k, 1); else placed.push(Object.assign({}, cands[ci], { ci, kind: st.kind === 'corner' && cands[ci].t !== 'corner' ? 'membrane' : st.kind, f0: modes[sel].f }));
        upd();
      },
    });
    const bars = A.canvas(host, {
      height: 230,
      caption: 'Estimated decay time of each target mode: grey = bare room, coloured = with the traps you placed. A resonant trap only shortens the modes near its tuning <i>and</i> with pressure at its position; a deep corner trap helps many modes a little.',
      draw(ctx, w, h) {
        if (!modes.length) return;
        const b0 = decay([]), b1 = decay(placed), mx = Math.max(...b0) * 1.1;
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: modes.length, label: 'Target mode', ticks: modes.map((_, i) => i + 0.5), fmt: (v) => fmtHz(modes[Math.floor(v)].f) }, y: { min: 0, max: mx, label: 'Decay T60 (s)' } });
        modes.forEach((m, i) => { const bw = (ax.X(1) - ax.X(0)) * 0.36, xb = ax.X(i + 0.5); ctx.fillStyle = A.alpha(A.css('muted'), 0.5); ctx.fillRect(xb - bw, ax.Y(b0[i]), bw, ax.y0 - ax.Y(b0[i])); ctx.fillStyle = i === sel ? A.css('accent') : b1[i] < b0[i] * 0.7 ? A.css('good') : A.css('warn'); ctx.fillRect(xb, ax.Y(b1[i]), bw, ax.y0 - ax.Y(b1[i])); });
      },
    });
    const tbl = el('div'); host.appendChild(tbl);
    auto.onclick = () => {
      placed = [];
      for (let n = 0; n < 4; n++) {
        const cur = decay(placed); let best = null;
        cands.forEach((c, ci) => { if (placed.some((p) => p.ci === ci)) return; modes.forEach((m) => { if (st.kind !== 'corner' && placed.some((q) => q.kind === 'membrane' && Math.abs(q.f0 - m.f) / m.f < 0.1)) return; const kind = st.kind === 'corner' && c.t !== 'corner' ? 'membrane' : st.kind; const trial = placed.concat([Object.assign({}, c, { ci, kind, f0: m.f })]); const d = decay(trial); const gain = cur.reduce((s, v, i) => s + Math.log(v / d[i]) * (modes[i].f < 100 ? 1.3 : 1), 0); if (!best || gain > best.gain) best = { gain, item: trial[trial.length - 1] }; }); });
        if (best) placed.push(best.item);
      }
      upd();
    };
    clr.onclick = () => { placed = []; upd(); };
    function upd() {
      const m = modes[sel]; if (!m) return;
      rule.innerHTML = `<div class="callout physics">${ruleText(m)}</div>`;
      const ranked = cands.map((c, ci) => ({ ci, c, w: weight(m, c) })).sort((a, b) => b.w - a.w);
      tbl.innerHTML = `<div class="grid g2"><div><h4 style="margin:.4em 0">Best spots for ${fmtHz(m.f)} (${m.n.join(',')})</h4><ol style="margin:0;padding-left:20px">${ranked.slice(0, 5).map((r) => `<li><b>#${r.ci + 1}</b> ${r.c.name} <span class="small muted">· coupling ${fmt((r.w / ranked[0].w) * 100, 2)} %</span></li>`).join('')}</ol><p class="small muted" style="margin:.4em 0 0">Useless for this mode: ${ranked.filter((r) => r.w < ranked[0].w * 0.08).slice(0, 4).map((r) => '#' + (r.ci + 1) + ' ' + r.c.name).join('; ') || 'none of the candidates'}.</p></div>
        <div><h4 style="margin:.4em 0">Traps placed (${placed.length})</h4>${placed.length ? `<ul style="margin:0;padding-left:18px">${placed.map((p) => `<li><b>#${p.ci + 1}</b> ${p.name} — ${p.kind === 'corner' ? 'deep porous corner trap' : 'resonant trap tuned ' + fmtHz(p.f0)}</li>`).join('')}</ul>` : '<p class="muted">Click a numbered position on the plan, or use the button to place four automatically.</p>'}</div></div>`;
      cv.redraw(); bars.redraw();
    }
    rebuild();
  };
})();
