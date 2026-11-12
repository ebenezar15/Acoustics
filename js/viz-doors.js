/* ==========================================================================
   Acoustica — doors, seals, studio windows, resonance and budget isolation.
   Door builder, studio-window lab, resonance finder, budget optimiser.
   Simplified teaching models built on the app's wall physics.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2;
  const T16 = P.THIRDS.slice(4, 20);
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const tPos = (t) => (t < 0 ? 0 : t);
  const fAx = { min: 50, max: 5000, log: true, label: 'Frequency (Hz)', ticks: [63, 125, 250, 500, 1000, 2000, 4000] };

  /* ======================================================================
     1. Door builder — leaf, seals, threshold, sound lock
     ====================================================================== */
  const CORES = { hollow: ['Hollow-core interior door', 9, 2500, 15], solid: ['Solid-core door, 44 mm', 28, 750, 60], thick: ['Solid-core door, 54 mm', 36, 600, 90], steel: ['Insulated steel acoustic door (bought)', 55, 1800, 900] };
  const ADDS = { none: ['Nothing added', 0, 0], mdf1: ['+ 12 mm MDF glued to one face', 9, 30], mdf2: ['+ 12 mm MDF on both faces', 18, 60], ply2: ['+ 18 mm plywood on both faces', 22, 80], steel: ['+ 1.5 mm steel sheet on one face', 12, 70] };
  const SEALS = { none: ['No seals (typical 2 mm gap)', 2, 0], foam: ['Foam weatherstrip tape', 0.5, 12], bulb: ['Compression bulb seals in a stop', 0.08, 45], dbl: ['Double seals: bulb + magnetic', 0.02, 110] };
  const BOTT = { gap: ['Open gap', 1, 0], sweep: ['Brush / rubber sweep', 0.25, 15], drop: ['Automatic drop seal', 0.03, 70], thresh: ['Raised threshold + compression seal', 0.01, 60] };
  V.doorBuilder = function (host) {
    const st = A.controls(host, [
      { key: 'core', label: 'Door leaf', type: 'select', value: 'hollow', options: Object.entries(CORES).map(([k, v]) => [k, v[0]]) },
      { key: 'add', label: 'Added mass', type: 'select', value: 'none', options: Object.entries(ADDS).map(([k, v]) => [k, v[0]]) },
      { key: 'damp', label: 'Damping compound between layers', type: 'check', value: false },
      { key: 'seal', label: 'Head & jamb seals', type: 'select', value: 'none', options: Object.entries(SEALS).map(([k, v]) => [k, v[0]]) },
      { key: 'bot', label: 'Bottom of the door', type: 'select', value: 'gap', options: Object.entries(BOTT).map(([k, v]) => [k, v[0]]) },
      { key: 'gap', label: 'Gap under the door', type: 'range', min: 1, max: 20, step: 1, value: 10, unit: 'mm' },
      { key: 'lock', label: 'Second identical door (sound lock)', type: 'check', value: false },
      { key: 'depth', label: 'Sound-lock depth', type: 'range', min: 0.1, max: 2, step: 0.05, value: 1, unit: 'm' },
      { key: 'lined', label: 'Sound lock lined with absorber', type: 'check', value: true },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const S = 0.9 * 2.04;
    function model() {
      const c = CORES[st.core], a = st.core === 'steel' ? ADDS.none : ADDS[st.add];
      const m = c[1] + a[1], leaf = { m, fc: c[2] * (a[1] ? 0.85 : 1), eta: st.damp && a[1] ? 0.15 : st.core === 'steel' ? 0.08 : 0.03, dip: st.damp && a[1] ? 6 : 12 };
      const jamb = (SEALS[st.seal][1] / 1000) * 4.98, bott = ((st.gap / 1000) * BOTT[st.bot][1]) * 0.9;
      const tauOf = (wmm) => Math.min(1, wmm / 2);
      const leakTau = (jamb * tauOf(SEALS[st.seal][1]) + bott * tauOf(st.gap * BOTT[st.bot][1])) / S;
      const leafTL = (f) => Math.min(P.singleLeafTL(leaf, f), st.core === 'hollow' ? 24 : 99);
      const one = (f) => -10 * Math.log10(Math.pow(10, -leafTL(f) / 10) + leakTau);
      let total = one, f0 = null;
      if (st.lock) {
        f0 = 60 * Math.sqrt((2 * m) / (m * m * st.depth));
        total = (f) => { const dl = P.doubleLeafTL({ leaf1: leaf, leaf2: leaf, d: st.depth, filled: st.lined, conn: 'none', cap: 80 }, f).tl; const series = 2 * one(f) - (st.lined ? 4 : 10); return Math.min(dl, Math.max(one(f) + 3, series)); };
      }
      const cost = (c[3] + a[2] + (st.damp && a[1] ? 35 : 0) + SEALS[st.seal][2] + BOTT[st.bot][2]) * (st.lock ? 2 : 1);
      const share = leakTau / (leakTau + Math.pow(10, -leafTL(500) / 10));
      return { m, leaf, leafTL, total, one, stc: P.stc(T16.map(total)), stcLeaf: P.stc(T16.map(leafTL)), f0, cost, share, leakTau, jamb, bott };
    }
    let M = model();
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Left: plan view through the door (animated). Waves arrive from the loud side; red arcs are sound squeezing through gaps, sized by how much leaks. Right: isolation versus frequency — dashed is the door leaf alone, solid is the door as built with its leaks. Until the gaps are sealed, adding mass to the leaf does almost nothing.',
      draw(ctx, w, h, t) {
        t = tPos(t);
        const lw = Math.min(w * 0.42, 380), cy = h / 2, dx = lw * 0.55;
        // wall + frame
        ctx.fillStyle = A.alpha(A.css('muted'), 0.55); ctx.fillRect(dx - 12, 14, 24, cy - 70 - 14); ctx.fillRect(dx - 12, cy + 70, 24, h - 14 - cy - 70);
        const thick = 6 + M.m / 5;
        const vib = Math.sin(t * 18) * Math.min(3, 60 * Math.pow(10, -M.leafTL(250) / 20));
        const doors = st.lock ? [dx - 34, dx + 34] : [dx];
        if (st.lock) { ctx.fillStyle = st.lined ? A.alpha(A.css('c4'), 0.35) : A.alpha(A.css('muted'), 0.1); ctx.fillRect(dx - 34, cy - 70, 68, 140); A.text(ctx, 'sound lock', dx, cy - 76, { align: 'center', size: 10, color: A.css('muted') }); }
        doors.forEach((x) => {
          ctx.fillStyle = st.core === 'steel' ? A.css('c3') : A.css('accent2'); ctx.fillRect(x - thick / 2 + vib, cy - 62, thick, 124 - Math.min(10, st.gap * BOTT[st.bot][1]));
          if (st.seal !== 'none') { ctx.fillStyle = A.css('good'); ctx.fillRect(x - thick / 2 - 2, cy - 68, thick + 4, 5); }
          if (st.bot !== 'gap') { ctx.fillStyle = A.css('good'); ctx.fillRect(x - thick / 2 - 2, cy + 62 - 2, thick + 4, 5); }
        });
        // incoming waves
        for (let k = 0; k < 5; k++) { const x = 10 + ((t * 70 + k * 38) % (dx - 60)); ctx.strokeStyle = A.alpha(A.css('c3'), 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, cy - 60); ctx.quadraticCurveTo(x + 10, cy, x, cy + 60); ctx.stroke(); }
        // leaks
        const xr = doors[doors.length - 1] + thick / 2 + 4, ph = (t * 1.2) % 1;
        const leak = (y, tau) => { const r = Math.min(46, 6 + 46 * Math.sqrt(Math.min(1, tau * 400))); if (r < 7) return; for (let k = 0; k < 2; k++) { const rr = r * ((ph + k * 0.5) % 1); ctx.strokeStyle = A.alpha(A.css('bad'), 1 - (ph + k * 0.5) % 1); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(xr, y, rr, -1.1, 1.1); ctx.stroke(); } };
        const lockF = st.lock ? (st.lined ? 0.05 : 0.2) : 1;
        leak(cy - 64, (M.jamb / S) * lockF); leak(cy + 62, (M.bott / S) * lockF);
        const leafTau = Math.pow(10, -M.leafTL(500) / 10) * lockF;
        for (let k = 0; k < 3; k++) { const x = xr + 6 + ((t * 60 + k * 30) % 80); ctx.strokeStyle = A.alpha(A.css('accent'), Math.min(0.9, leafTau * 60)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, cy - 40); ctx.quadraticCurveTo(x + 8, cy, x, cy + 40); ctx.stroke(); }
        ctx.lineWidth = 1;
        A.text(ctx, 'loud side', 12, 26, { size: 11, color: A.css('c3'), weight: 700 }); A.text(ctx, 'quiet side', lw - 6, 26, { size: 11, color: A.css('muted'), weight: 700, align: 'right' });
        // plot
        const ax = A.axes(ctx, w, h, { x: fAx, y: { min: 0, max: 80, label: 'Isolation (dB)' }, pad: { l: lw + 50, r: 12, t: 14, b: 36 } });
        const fs = []; for (let f = 50; f <= 5000; f *= 1.04) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, Math.min(80, M.leafTL(f))]), A.alpha(A.css('text'), 0.5), 1.5, [5, 4]);
        A.plotLine(ctx, ax, fs.map((f) => [f, Math.min(80, M.total(f))]), A.css('accent'), 2.8);
        const mark = (f, lab, c) => { if (f < 50 || f > 5000) return; ctx.setLineDash([3, 4]); ctx.strokeStyle = A.css(c); ctx.beginPath(); ctx.moveTo(ax.X(f), ax.y1); ctx.lineTo(ax.X(f), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, lab, ax.X(f) + 3, ax.y1 + 12, { size: 10, color: A.css(c) }); };
        mark(M.leaf.fc, 'coincidence', 'warn'); if (M.f0) mark(M.f0, 'lock resonance', 'bad');
      },
    });
    function upd() {
      M = model();
      out.innerHTML = A.statBox('Door as built', 'STC ' + M.stc, M.stc >= 45 ? 'studio grade' : M.stc >= 35 ? 'good' : M.stc >= 28 ? 'ordinary' : 'weak', M.stc >= 40 ? 'good' : M.stc >= 30 ? 'warn' : 'bad') + A.statBox('Leaf alone could give', 'STC ' + M.stcLeaf, `lost ${Math.max(0, M.stcLeaf - M.stc)} to leaks` + (st.lock ? ' (one door)' : '')) + A.statBox('Leaf mass', fmt(M.m, 3) + ' kg/m²', `≈ ${fmt(M.m * S, 3)} kg — check the hinges`) + A.statBox('Sound through gaps', fmt(M.share * 100, 3) + ' %', 'of what gets past one door') + A.statBox('Rough parts cost', '≈ $' + Math.round(M.cost / 10) * 10, 'typical DIY prices, vary widely');
      const next = M.share > 0.5 ? (st.bot === 'gap' ? 'The gap under the door is your biggest leak — fit a drop seal or a threshold with a compression seal first.' : st.seal === 'none' || st.seal === 'foam' ? 'Seal the head and jambs with compression bulb seals in an adjustable stop.' : 'Add a second seal line: two seals in series beat one perfect seal.') : st.core === 'hollow' ? 'Leaks are under control — now the hollow leaf is the limit. Swap to a solid-core slab.' : !st.lock && M.stc < 45 ? 'To go further, add mass with damping, or better: a second door forming a sound lock.' : 'This is a strong door. Make sure the wall around it is at least as good, and that the frame is packed and sealed to the wall.';
      tip.innerHTML = `<div class="callout mentor"><b>Next best move:</b> ${next}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Studio window lab — two panes, gap, reveals; resonances animated
     ====================================================================== */
  V.glassLab = function (host) {
    const st = A.controls(host, [
      { key: 't1', label: 'Pane 1 thickness', type: 'range', min: 4, max: 19, step: 1, value: 6, unit: 'mm' },
      { key: 'l1', label: 'Pane 1 laminated', type: 'check', value: false },
      { key: 't2', label: 'Pane 2 thickness', type: 'range', min: 0, max: 19, step: 1, value: 6, fmt: (v) => (v ? v + ' mm' : 'none (single glazing)') },
      { key: 'l2', label: 'Pane 2 laminated', type: 'check', value: false },
      { key: 'd', label: 'Air gap between panes', type: 'range', min: 0.006, max: 0.3, step: 0.002, value: 0.016, unit: 'm' },
      { key: 'rev', label: 'Absorbent lining on the reveals (inside the gap)', type: 'check', value: false },
      { key: 'tilt', label: 'Tilt one pane a few degrees', type: 'check', value: false },
      { key: 'show', label: 'Animate the panes at', type: 'select', value: 'f0', options: [['low', 'A low frequency (below resonance)'], ['f0', 'The mass–air–mass resonance'], ['fc', 'The coincidence frequency'], ['mid', 'Mid frequencies (working range)']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function model() {
      const g1 = P.leafProps([{ mat: st.l1 ? 'lamGlass' : 'glass', t: st.t1 / 1000 }]);
      const fc1 = P.criticalFreq(P.PANELS[st.l1 ? 'lamGlass' : 'glass'], st.t1 / 1000);
      if (!st.t2) return { tl: (f) => P.singleLeafTL(g1, f), fc1, fc2: null, f0: null, single: true };
      const g2 = P.leafProps([{ mat: st.l2 ? 'lamGlass' : 'glass', t: st.t2 / 1000 }]);
      const fc2 = P.criticalFreq(P.PANELS[st.l2 ? 'lamGlass' : 'glass'], st.t2 / 1000);
      const o = { leaf1: g1, leaf2: g2, d: st.d, filled: st.rev, conn: 'none', cap: 70 };
      const same = Math.abs(fc1 - fc2) / fc1 < 0.12;
      return { tl: (f) => { let v = P.doubleLeafTL(o, f).tl; if (same) { const x = Math.log2(f / fc1); v -= 5 * Math.exp(-x * x * 8); } return v; }, fc1, fc2, f0: P.doubleLeafTL(o, 500).f0, same };
    }
    let M = model();
    const cv = A.canvas(host, {
      height: 320, animate: true,
      caption: 'Left: section through the window (motion greatly exaggerated). Below the resonance both panes move together like one sheet; at the mass–air–mass resonance they “breathe” against the trapped air and isolation collapses; at coincidence, bending ripples run along the glass and sound sails through. Right: the resulting isolation curve with those weak spots marked.',
      draw(ctx, w, h, t) {
        t = tPos(t);
        const lw = Math.min(w * 0.38, 330), cx = lw * 0.5, y0 = 36, y1 = h - 40, gapPx = st.t2 ? A.clamp(st.d * 500, 12, 110) : 0;
        ctx.fillStyle = A.alpha(A.css('muted'), 0.5); ctx.fillRect(cx - gapPx / 2 - 30, y0 - 22, gapPx + 60, 22); ctx.fillRect(cx - gapPx / 2 - 30, y1, gapPx + 60, 22);
        if (st.rev && st.t2) { ctx.fillStyle = A.alpha(A.css('c4'), 0.7); ctx.fillRect(cx - gapPx / 2 + 4, y0, gapPx - 8, 8); ctx.fillRect(cx - gapPx / 2 + 4, y1 - 8, gapPx - 8, 8); }
        const ph = t * 7;
        const pane = (x, thk, sign, lam, tilt) => {
          ctx.beginPath();
          for (let i = 0; i <= 40; i++) {
            const u = i / 40, y = y0 + u * (y1 - y0);
            let dxp = 0;
            if (st.show === 'low') dxp = Math.sin(ph) * 7 * Math.sin(Math.PI * u);
            else if (st.show === 'f0') dxp = sign * Math.sin(ph * 1.6) * 9 * Math.sin(Math.PI * u);
            else if (st.show === 'fc') dxp = Math.sin(ph * 2 - u * 26) * 4;
            else dxp = Math.sin(ph * 2) * 1 * Math.sin(Math.PI * u) * sign;
            const xx = x + dxp + (tilt ? (u - 0.5) * 16 : 0);
            i ? ctx.lineTo(xx, y) : ctx.moveTo(xx, y);
          }
          ctx.strokeStyle = lam ? A.css('good') : A.css('c3'); ctx.lineWidth = Math.max(3, thk * 0.9); ctx.stroke(); ctx.lineWidth = 1;
        };
        pane(cx - gapPx / 2, st.t1, -1, st.l1, false);
        if (st.t2) pane(cx + gapPx / 2, st.t2, 1, st.l2, st.tilt);
        for (let k = 0; k < 4; k++) { const x = 6 + ((t * 60 + k * 30) % Math.max(20, cx - gapPx / 2 - 30)); ctx.strokeStyle = A.alpha(A.css('accent'), 0.6); ctx.beginPath(); ctx.moveTo(x, y0 + 30); ctx.quadraticCurveTo(x + 8, (y0 + y1) / 2, x, y1 - 30); ctx.stroke(); }
        A.text(ctx, st.t2 ? `${st.t1} mm · ${fmt(st.d * 1000, 3)} mm air · ${st.t2} mm` : `${st.t1} mm single pane`, cx, h - 6, { align: 'center', size: 11, weight: 700 });
        const ax = A.axes(ctx, w, h, { x: fAx, y: { min: 10, max: 75, label: 'Isolation (dB)' }, pad: { l: lw + 50, r: 12, t: 14, b: 36 } });
        const fs = []; for (let f = 50; f <= 5000; f *= 1.03) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, A.clamp(M.tl(f), 10, 75)]), A.css('accent'), 2.8);
        const mark = (f, lab, c, row) => { if (!f || f < 50 || f > 5000) return; ctx.setLineDash([3, 4]); ctx.strokeStyle = A.css(c); ctx.beginPath(); ctx.moveTo(ax.X(f), ax.y1); ctx.lineTo(ax.X(f), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, lab, ax.X(f) + 3, ax.y1 + 12 + row * 13, { size: 10, color: A.css(c) }); };
        mark(M.f0, 'resonance ' + fmtHz(M.f0 || 0), 'bad', 0); mark(M.fc1, 'coincidence 1', 'warn', 1); if (M.fc2) mark(M.fc2, 'coincidence 2', 'warn', 2);
      },
    });
    function upd() {
      M = model();
      const stc = P.stc(T16.map(M.tl)), low = (M.tl(63) + M.tl(80) + M.tl(100)) / 3;
      out.innerHTML = A.statBox('Window rating', 'STC ' + stc, stc >= 50 ? 'studio grade' : stc >= 40 ? 'good' : stc >= 33 ? 'ordinary' : 'weak', stc >= 45 ? 'good' : stc >= 36 ? 'warn' : 'bad') + A.statBox('Bass isolation (63–100 Hz)', fmt(low, 3) + ' dB', low < 25 ? 'kick and bass get through' : '') + (M.f0 ? A.statBox('Mass–air–mass resonance', fmtHz(M.f0), M.f0 > 100 ? 'in the music range — widen the gap' : 'safely low', M.f0 > 100 ? 'bad' : 'good') : '') + A.statBox('Coincidence dips', fmtHz(M.fc1) + (M.fc2 ? ' / ' + fmtHz(M.fc2) : ''), M.same ? 'same glass both sides — dips stack' : 'staggered');
      const tips = [];
      if (M.single) tips.push('One pane follows the mass law only. A second pane with a wide gap is worth far more than thicker single glass.');
      if (M.f0 > 100) tips.push(`The panes resonate against the air at ${fmtHz(M.f0)}. A sealed thermal unit with a 12–20 mm gap is poor for music: use two separate panes ≥ 100 mm apart.`);
      if (M.same) tips.push('Both panes are the same thickness, so their coincidence dips line up. Use different thicknesses (e.g. 6 mm + 10 mm) or laminate one pane.');
      if (!st.rev && !M.single) tips.push('Line the reveals between the panes with absorber (wool behind perforated metal or fabric) to damp the cavity.');
      if (st.tilt) tips.push('Tilting a pane mainly controls visual glare and flutter reflections inside the room; the isolation gain is small and comes from the wider average gap.');
      if (!tips.length) tips.push('A strong studio window: wide gap, mismatched panes, damped cavity. Mount each pane in its own wall leaf on soft gaskets so the frames never touch.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${tips.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Resonance finder — where it occurs and how to move or damp it
     ====================================================================== */
  const RES = {
    mam: { name: 'Double wall / double door / double glazing (mass–air–mass)' },
    coin: { name: 'Any stiff panel: coincidence dip' },
    triple: { name: 'Triple-leaf trap (adding a third layer in the middle)' },
    cavity: { name: 'Cavity standing waves (empty stud bays, window gaps)' },
  };
  V.resonanceMap = function (host) {
    const st = A.controls(host, [
      { key: 'k', label: 'Where is the resonance?', type: 'select', value: 'mam', options: Object.entries(RES).map(([k, v]) => [k, v.name]) },
      { key: 'm1', label: 'Mass of leaf 1', type: 'range', min: 5, max: 60, step: 1, value: 10, unit: 'kg/m²' },
      { key: 'm2', label: 'Mass of leaf 2', type: 'range', min: 5, max: 60, step: 1, value: 10, unit: 'kg/m²' },
      { key: 'd', label: 'Air gap / cavity depth', type: 'range', min: 0.01, max: 0.4, step: 0.005, value: 0.05, unit: 'm' },
      { key: 'wool', label: 'Mineral wool in the cavity', type: 'check', value: false },
      { key: 'damp', label: 'Damping layer in the panels', type: 'check', value: false },
      { key: 'mat', label: 'Panel (for coincidence)', type: 'select', value: 'gypsum', options: [['gypsum', 'Gypsum board'], ['plywood', 'Plywood'], ['mdf', 'MDF'], ['glass', 'Glass'], ['concrete', 'Concrete']] },
      { key: 'tp', label: 'Panel thickness (for coincidence)', type: 'range', min: 4, max: 200, step: 1, value: 13, unit: 'mm' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const leafOf = (m) => ({ m, fc: 2500, eta: st.damp ? 0.15 : 0.02, dip: st.damp ? 5 : 12 });
    function model() {
      const k = (st.wool ? 50 : 60);
      if (st.k === 'mam') { const f0 = k * Math.sqrt((st.m1 + st.m2) / (st.m1 * st.m2 * st.d)); return { f: f0, tl: (f) => P.doubleLeafTL({ leaf1: leafOf(st.m1), leaf2: leafOf(st.m2), d: st.d, filled: st.wool, conn: 'none' }, f).tl, ref: (f) => P.singleLeafTL(leafOf(st.m1 + st.m2), f) }; }
      if (st.k === 'triple') {
        const m3 = (st.m1 + st.m2) / 2, d2 = st.d / 2;
        const f3 = k * Math.sqrt((st.m1 + m3) / (st.m1 * m3 * d2));
        const two = (f) => P.doubleLeafTL({ leaf1: leafOf(st.m1 + m3 / 2), leaf2: leafOf(st.m2 + m3 / 2), d: st.d, filled: st.wool, conn: 'none' }, f).tl;
        const three = (f) => { const base = two(f); const x = Math.log2(f / f3); return f < f3 * 1.6 ? base - 9 * Math.exp(-x * x * 2) - (f < f3 ? 4 : 0) : base + 3; };
        return { f: f3, f2: k * Math.sqrt((st.m1 + st.m2 + m3) / ((st.m1 + m3 / 2) * (st.m2 + m3 / 2) * st.d)), tl: three, ref: two };
      }
      if (st.k === 'coin') { const mat = P.PANELS[st.mat], fc = P.criticalFreq(mat, st.tp / 1000), leaf = { m: mat.rho * st.tp / 1000, fc, eta: st.damp ? 0.15 : mat.eta, dip: st.damp ? 4 : 14 }; return { f: fc, tl: (f) => P.singleLeafTL(leaf, f), ref: (f) => P.massLaw(leaf.m, f) }; }
      const fcav = 343 / (2 * Math.max(st.d, 0.01));
      const base = (f) => P.doubleLeafTL({ leaf1: leafOf(st.m1), leaf2: leafOf(st.m2), d: st.d, filled: true, conn: 'none' }, f).tl;
      return { f: fcav, f2: 343 / (2 * 2.4), tl: (f) => base(f) - (st.wool ? 0 : 6 + 3 * Math.sin(Math.log(f) * 9)), ref: base };
    }
    let M = model();
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: what is physically moving at the resonance (exaggerated). Right: isolation with the resonance dip (solid) compared with the ideal without it (dashed). The cure is always one of three: move it out of the way (more mass, wider gap), damp it (wool, damping compound, laminated glass), or avoid creating it (no third leaf, no matched panels).',
      draw(ctx, w, h, t) {
        t = tPos(t);
        const lw = Math.min(w * 0.36, 300), cx = lw / 2, y0 = 30, y1 = h - 30, osc = Math.sin(t * 8);
        if (st.k === 'coin') {
          ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = A.clamp(st.tp / 4, 3, 20); ctx.beginPath();
          for (let i = 0; i <= 50; i++) { const u = i / 50, y = y0 + u * (y1 - y0); const x = cx + Math.sin(t * 9 - u * 22) * 7; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.lineWidth = 1;
          for (let k = 0; k < 5; k++) { const yy = y0 + ((t * 50 + k * 50) % (y1 - y0)); ctx.strokeStyle = A.alpha(A.css('accent'), 0.6); ctx.beginPath(); ctx.moveTo(cx - 70, yy - 30); ctx.lineTo(cx - 14, yy); ctx.stroke(); ctx.strokeStyle = A.alpha(A.css('bad'), 0.6); ctx.beginPath(); ctx.moveTo(cx + 14, yy); ctx.lineTo(cx + 70, yy + 30); ctx.stroke(); }
          A.text(ctx, 'sound wave matches the bending wave', cx, h - 8, { align: 'center', size: 10, color: A.css('muted') });
        } else {
          const gp = A.clamp(st.d * 400, 14, 120), xs = st.k === 'triple' ? [cx - gp / 2, cx, cx + gp / 2] : [cx - gp / 2, cx + gp / 2];
          if (st.wool) { ctx.fillStyle = A.alpha(A.css('c4'), 0.35); ctx.fillRect(cx - gp / 2, y0, gp, y1 - y0); }
          xs.forEach((x, i) => { const sgn = st.k === 'cavity' ? 0 : i === 0 ? -1 : i === xs.length - 1 ? 1 : 0; const mm = i === 0 ? st.m1 : i === xs.length - 1 ? st.m2 : (st.m1 + st.m2) / 2; ctx.fillStyle = st.damp ? A.css('good') : A.css('accent2'); const tw = 4 + mm / 4; ctx.fillRect(x - tw / 2 + sgn * osc * 6 * (st.wool ? 0.5 : 1), y0, tw, y1 - y0); });
          if (st.k === 'cavity') { for (let i = 0; i < 12; i++) { const y = y0 + 10 + i * ((y1 - y0 - 20) / 11); dot(ctx, cx + Math.sin(t * 9) * (gp / 2 - 8) * Math.cos((i / 11) * Math.PI) * (st.wool ? 0.2 : 1), y, 2.5, A.css('accent')); } A.text(ctx, 'air sloshing inside the cavity', cx, h - 8, { align: 'center', size: 10, color: A.css('muted') }); }
          else { for (let s = 0; s < xs.length - 1; s++) { const a = xs[s], b = xs[s + 1]; ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 1.5; for (let yy = y0 + 30; yy < y1 - 10; yy += 50) { ctx.beginPath(); ctx.moveTo(a + 6, yy); const n = 8; for (let q = 1; q <= n; q++) ctx.lineTo(a + 6 + ((b - a - 12) * q) / n, yy + (q % 2 ? -5 : 5)); ctx.stroke(); } } ctx.lineWidth = 1; A.text(ctx, 'mass – air spring – mass', cx, h - 8, { align: 'center', size: 10, color: A.css('muted') }); }
        }
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 5000, log: true, label: 'Frequency (Hz)', ticks: [31, 63, 125, 250, 500, 1000, 2000, 4000] }, y: { min: 0, max: 90, label: 'Isolation (dB)' }, pad: { l: lw + 50, r: 12, t: 14, b: 36 } });
        const fs = []; for (let f = 20; f <= 5000; f *= 1.03) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, A.clamp(M.ref(f), 0, 90)]), A.alpha(A.css('text'), 0.45), 1.4, [5, 4]);
        A.plotLine(ctx, ax, fs.map((f) => [f, A.clamp(M.tl(f), 0, 90)]), A.css('accent'), 2.8);
        if (M.f >= 20 && M.f <= 5000) { ctx.setLineDash([3, 4]); ctx.strokeStyle = A.css('bad'); ctx.beginPath(); ctx.moveTo(ax.X(M.f), ax.y1); ctx.lineTo(ax.X(M.f), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, fmtHz(M.f), ax.X(M.f) + 3, ax.y1 + 12, { size: 11, weight: 700, color: A.css('bad') }); }
      },
    });
    function upd() {
      M = model();
      const note = M.f < 40 ? 'below most music' : M.f < 125 ? 'in the bass — kick, bass guitar' : M.f < 500 ? 'in the low mids — voices' : M.f < 2500 ? 'in the speech range' : 'high — cymbals, sibilance';
      out.innerHTML = A.statBox('Resonance at', fmtHz(M.f), note, M.f > 60 && M.f < 2500 ? 'warn' : 'good') + (st.k === 'triple' ? A.statBox('Same masses as two leaves', fmtHz(M.f2), 'one deep cavity is lower') : '') + (st.k === 'cavity' ? A.statBox('Across a 2.4 m high cavity', fmtHz(M.f2), 'and its multiples') : '') + A.statBox('Isolation at the resonance', fmt(M.tl(M.f), 3) + ' dB', `ideal ${fmt(M.ref(M.f), 3)} dB`);
      const T = {
        mam: `<b>f₀ ≈ ${st.wool ? 50 : 60}·√((m₁+m₂)/(m₁·m₂·d))</b>. Below f₀ the two leaves act as one; isolation only “takes off” about an octave above it. <b>Fixes:</b> more mass on each leaf, a deeper cavity, wool in the cavity, and never rigidly tie the leaves. Aim for f₀ at least an octave below the lowest frequency you must stop.`,
        coin: `At the coincidence frequency the sound’s wavelength along the panel equals the panel’s own bending wavelength, and the panel becomes “transparent”. Thicker/stiffer panels push it <b>down</b> into the speech range (13 mm gypsum ≈ 2.5–3 kHz; 25 mm ≈ 1.3 kHz; 100 mm concrete ≈ 150 Hz). <b>Fixes:</b> two thin layers instead of one thick one, damping compound between layers, laminated glass, different thicknesses on each side.`,
        triple: `Splitting one cavity into two smaller ones makes two stiffer air springs — the resonance moves <b>up</b> and bass isolation gets worse than a two-leaf wall of the same mass. <b>Fix:</b> put all the extra mass on the outer leaves and keep one big cavity; remove the middle leaf or open it up.`,
        cavity: `Air trapped in an empty cavity has its own standing waves (c/2d across the gap, and much lower ones along its height and width). They couple the two leaves at those frequencies. <b>Fix:</b> fill the cavity loosely with mineral wool; line window reveals with absorber.`,
      };
      tip.innerHTML = `<div class="callout physics">${T[st.k]}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Budget isolation optimiser
     ====================================================================== */
  const UP = [
    ['caulk', 'Acoustic sealant around frames, skirting & outlets + putty pads', 30, 'Closes the hidden holes'],
    ['seals', 'Door perimeter compression seals', 45, 'Stops the jamb & head leaks'],
    ['drop', 'Automatic drop seal (or threshold + seal)', 70, 'Closes the gap under the door'],
    ['solid', 'Replace hollow door with a solid-core slab', 160, 'Door leaf 18 → 30 dB'],
    ['mdf', 'Glue 12 mm MDF + damping compound to the door', 70, 'More mass, less ringing'],
    ['plug', 'Removable window plug (board + wool, sealed)', 75, 'Window +12–15 dB when fitted'],
    ['second', 'Secondary glazing, 100 mm from the existing window', 280, 'Window 28 → 45 dB, keeps daylight'],
    ['wall', 'Extra layer of 15 mm gypsum + damping compound on the wall', 380, 'Wall +6–8 dB'],
    ['curtain', 'Heavy curtain over the window', 90, 'Mostly absorbs — ≈ 2 dB of isolation'],
    ['foam', 'Acoustic foam tiles on the walls', 120, 'Treatment, not isolation: 0 dB'],
    ['rug', 'Thick rug & underlay', 110, 'Footsteps to the room below only'],
  ];
  V.budgetIso = function (host) {
    const on = {};
    const st = A.controls(host, [{ key: 'budget', label: 'Your budget', type: 'range', min: 0, max: 1500, step: 10, value: 250, fmt: (v) => '$' + v }], () => upd());
    const row = el('div', { class: 'row' }); const auto = el('button', { class: 'primary' }, 'Pick the best upgrades for this budget'), clr = el('button', {}, 'Clear'); row.append(auto, clr); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const list = el('div', { class: 'budget-list' }); host.appendChild(list);
    function calc(o) {
      const wallTL = 38 + (o.wall ? 7 : 0);
      let doorLeaf = o.solid ? 30 : 18; if (o.mdf) doorLeaf += o.solid ? 4 : 5;
      const jamb = o.seals ? 0.0004 : 0.008, bott = o.drop ? 0.0003 : 0.009, holes = o.caulk ? 0.0002 : 0.004;
      let win = 28; if (o.second) win = 45; if (o.plug) win = Math.max(win, 28) + 13; if (o.curtain) win += 2;
      const E = [{ k: 'Wall', area: 9, tl: wallTL }, { k: 'Door leaf', area: 1.84, tl: doorLeaf }, { k: 'Door gaps', area: jamb + bott, tl: 0 }, { k: 'Window', area: 1.4, tl: win }, { k: 'Holes & cracks', area: holes, tl: 0 }];
      const tot = E.reduce((s, e) => s + e.area * Math.pow(10, -e.tl / 10), 0), S = E.reduce((s, e) => s + e.area, 0);
      return { tl: -10 * Math.log10(tot / S), E: E.map((e) => ({ ...e, share: (e.area * Math.pow(10, -e.tl / 10)) / tot })) };
    }
    const spent = () => UP.filter((u) => on[u[0]]).reduce((s, u) => s + u[2], 0);
    auto.onclick = () => { UP.forEach((u) => (on[u[0]] = false)); let left = st.budget; for (;;) { const base = calc(on).tl; let best = null; UP.forEach((u) => { if (on[u[0]] || u[2] > left) return; const g = calc({ ...on, [u[0]]: true }).tl - base; if (g > 0.3 && (!best || g / u[2] > best.v)) best = { id: u[0], v: g / u[2], c: u[2] }; }); if (!best) break; on[best.id] = true; left -= best.c; } upd(); };
    clr.onclick = () => { UP.forEach((u) => (on[u[0]] = false)); upd(); };
    list.addEventListener('click', (e) => { const b = e.target.closest('[data-id]'); if (!b) return; on[b.dataset.id] = !on[b.dataset.id]; upd(); });
    const cv = A.canvas(host, {
      height: 230, animate: true,
      caption: 'Where the sound gets out of a typical bedroom studio (one wall with a door and a window). Each bar is that path’s share of the leak. Spend on the longest bar first — sealing gaps costs little and often gains more than rebuilding a wall.',
      draw(ctx, w, h, t) {
        t = tPos(t);
        const r = calc(on), x0 = 120, bw = w - x0 - 60; let y = 18;
        r.E.forEach((e, i) => { A.text(ctx, e.k, x0 - 8, y + 16, { align: 'right', size: 12, weight: 700 }); ctx.fillStyle = A.alpha(A.css('muted'), 0.18); ctx.fillRect(x0, y, bw, 24); const col = e.share > 0.4 ? A.css('bad') : e.share > 0.15 ? A.css('warn') : A.css('good'); ctx.fillStyle = col; const ww = bw * e.share; ctx.fillRect(x0, y, ww, 24); if (e.share > 0.05) for (let k = 0; k < 3; k++) { const px = x0 + ((t * 80 + k * 60 + i * 20) % Math.max(10, ww)); dot(ctx, px, y + 12, 3, A.alpha('#ffffff', 0.7)); } A.text(ctx, fmt(e.share * 100, 2) + ' %', x0 + ww + 6, y + 16, { size: 11 }); y += 38; });
      },
    });
    function upd() {
      const base = calc({}).tl, r = calc(on), s = spent();
      let best = null; UP.forEach((u) => { if (on[u[0]]) return; const g = calc({ ...on, [u[0]]: true }).tl - r.tl; if (!best || g / u[2] > best.v) best = { u, g, v: g / u[2] }; });
      out.innerHTML = A.statBox('Isolation now', fmt(r.tl, 3) + ' dB', `started at ${fmt(base, 3)} dB`, r.tl - base > 10 ? 'good' : '') + A.statBox('Gained', '+' + fmt(r.tl - base, 2) + ' dB', r.tl - base >= 10 ? 'about half as loud next door' : r.tl - base >= 5 ? 'clearly quieter' : 'barely noticeable') + A.statBox('Spent', '$' + s, s > st.budget ? 'over budget' : `$${st.budget - s} left`, s > st.budget ? 'bad' : '') + (best && best.g > 0.3 ? A.statBox('Next best buy', '+' + fmt(best.g, 2) + ' dB for $' + best.u[2], best.u[1].split(' (')[0].slice(0, 46)) : A.statBox('Next best buy', '—', 'the remaining items add no isolation'));
      list.innerHTML = UP.map((u) => { const g = on[u[0]] ? r.tl - calc({ ...on, [u[0]]: false }).tl : calc({ ...on, [u[0]]: true }).tl - r.tl; return `<button class="budget-item ${on[u[0]] ? 'on' : ''}" data-id="${u[0]}"><span class="bi-check">${on[u[0]] ? '✓' : '+'}</span><span class="bi-name"><b>${u[1]}</b><small>${u[3]}</small></span><span class="bi-cost">$${u[2]}</span><span class="bi-gain ${g < 0.3 ? 'zero' : ''}">${g < 0.05 ? '0' : '+' + fmt(g, 2)} dB</span></button>`; }).join('');
      cv.redraw();
    }
    upd();
  };
})();
