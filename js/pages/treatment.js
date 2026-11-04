/* Room Treatment Simulator: place absorbers & diffusers in a room and see their effect on each
   mode's decay, the modal distribution, the bass at the seat and early reflections. */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const KINDS = {
    corner: { name: 'Corner bass trap (porous, floor–ceiling)', short: 'Corner trap', snap: 'corner', area: (H) => 0.85 * H, z: (H) => [0, H], col: 'c4' },
    membrane: { name: 'Membrane trap (tuned)', short: 'Membrane', snap: 'wall', area: () => 1.2, z: () => [0, 1.2], col: 'accent2', tuned: true, f0: 60 },
    helmholtz: { name: 'Helmholtz / slot resonator (tuned)', short: 'Helmholtz', snap: 'wall', area: () => 1.5, z: () => [0.2, 1.4], col: 'c3', tuned: true, f0: 125 },
    panel: { name: 'Broadband panel 100 mm + 50 mm gap', short: 'Panel', snap: 'wall', area: () => 0.72, z: () => [0.8, 2.0], col: 'accent' },
    diffuser: { name: 'Diffuser (QRD / skyline)', short: 'Diffuser', snap: 'wall', area: () => 1.2, z: () => [1.0, 2.2], col: 'c5' },
    cloud: { name: 'Ceiling cloud 1.2 × 1.8 m', short: 'Cloud', snap: 'ceiling', area: () => 2.2, z: (H) => [H - 0.05, H], col: 'c6' },
  };
  const WALLS = { masonry: ['Masonry / concrete', 0.03], mixed: ['Mixed (some drywall, furniture)', 0.08], drywall: ['Drywall on studs (flexes at LF)', 0.14] };
  const DEFAULT = { L: 5.2, W: 3.9, H: 2.5, walls: 'mixed', target: 0.35, items: [], lx: 0.38, ly: 0.5, lz: 1.2, sd: 0.6, spread: 1.6, sel: -1, view: 'problems', mode: 0 };

  function snap(s, it) {
    const k = KINDS[it.kind];
    if (k.snap === 'corner') { it.x = it.x < s.L / 2 ? 0.15 : s.L - 0.15; it.y = it.y < s.W / 2 ? 0.15 : s.W - 0.15; }
    else if (k.snap === 'wall') {
      const d = [it.x, s.L - it.x, it.y, s.W - it.y], m = d.indexOf(Math.min(...d));
      if (m === 0) it.x = 0.05; if (m === 1) it.x = s.L - 0.05; if (m === 2) it.y = 0.05; if (m === 3) it.y = s.W - 0.05;
      it.x = A.clamp(it.x, 0.05, s.L - 0.05); it.y = A.clamp(it.y, 0.05, s.W - 0.05);
    } else { it.x = A.clamp(it.x, 0.5, s.L - 0.5); it.y = A.clamp(it.y, 0.5, s.W - 0.5); }
    const [z0, z1] = k.z(s.H); it.z0 = z0; it.z1 = z1; it.area = it.area || k.area(s.H);
  }
  function model(s) {
    const room = { L: s.L, W: s.W, H: s.H, alpha: (f) => WALLS[s.walls][1] * (f < 100 ? 1.2 : 1) };
    const items = s.items.map((it) => ({ ...it }));
    const bare = P.treatedModes(room, [], 260), treated = P.treatedModes(room, items, 260);
    const spk = [[s.sd, s.W / 2 - s.spread / 2, 1.1], [s.sd, s.W / 2 + s.spread / 2, 1.1]];
    const rcv = [s.lx * s.L, s.ly * s.W, s.lz];
    const rb = P.modalResponseModes(room, bare, spk, rcv, 20, 250, 220), rt = P.modalResponseModes(room, treated, spk, rcv, 20, 250, 220);
    const ref = rb.filter((p) => p.f > 120).map((p) => p.db).sort((a, b) => a - b)[Math.floor(rb.filter((p) => p.f > 120).length / 2)] || 0;
    rb.forEach((p) => (p.db -= ref)); rt.forEach((p) => (p.db -= ref));
    const sd = (r) => { const b = r.filter((p) => p.f >= 30 && p.f <= 150).map((p) => p.db); const m = b.reduce((a, c) => a + c, 0) / b.length; return Math.sqrt(b.reduce((a, c) => a + (c - m) ** 2, 0) / b.length); };
    return { room, bare, treated, rb, rt, sdB: sd(rb), sdT: sd(rt), spk, rcv };
  }
  /** best location for a tuned trap for mode m: corners + wall points */
  function bestSpot(s, m, kind) {
    const dims = [s.L, s.W, s.H], cands = [];
    [[0.15, 0.15], [0.15, s.W - 0.15], [s.L - 0.15, 0.15], [s.L - 0.15, s.W - 0.15]].forEach(([x, y]) => cands.push({ x, y, where: 'corner' }));
    for (let t = 0.1; t < 1; t += 0.1) { cands.push({ x: 0.05, y: t * s.W, where: 'front wall' }, { x: s.L - 0.05, y: t * s.W, where: 'rear wall' }, { x: t * s.L, y: 0.05, where: 'left wall' }, { x: t * s.L, y: s.W - 0.05, where: 'right wall' }); }
    const [z0, z1] = KINDS[kind].z(s.H);
    cands.forEach((c) => (c.w = P.modeWeight(m.n, dims, P.itemPoints({ x: c.x, y: c.y, z0, z1 }, s.H))));
    return cands.sort((a, b) => b.w - a.w)[0];
  }
  function problems(s, M) {
    const out = [];
    M.bare.forEach((m, i) => {
      if (m.f > 220) return;
      const T = M.treated[i].T60;
      const peak = Math.max(...M.rt.filter((p) => Math.abs(p.f - m.f) < m.f * 0.03).map((p) => p.db), -99);
      const strong = m.type === 'axial' || (m.type === 'tangential' && m.f < 120);
      if ((T > s.target * 1.6 && strong) || (peak > 6 && strong)) out.push({ i, m, T, peak });
    });
    return out.sort((a, b) => b.T - a.T).slice(0, 8);
  }

  function simulator(body) {
    let s = Object.assign({}, DEFAULT, A.store.get('treat', {}));
    s.items = (s.items || []).map((x) => ({ ...x }));
    const save = () => A.store.set('treat', s);
    let M = model(s);

    const top = el('div', { class: 'card' }); body.appendChild(top);
    A.controls(top, [
      { key: 'L', label: 'Length', type: 'number', value: s.L, unit: 'm' },
      { key: 'W', label: 'Width', type: 'number', value: s.W, unit: 'm' },
      { key: 'H', label: 'Height', type: 'number', value: s.H, unit: 'm' },
      { key: 'walls', label: 'Room construction', type: 'select', value: s.walls, options: Object.entries(WALLS).map(([k, v]) => [k, v[0]]) },
      { key: 'target', label: 'Target modal decay', type: 'range', min: 0.15, max: 0.8, step: 0.05, value: s.target, unit: 's' },
      { key: 'lx', label: 'Listener from front wall', type: 'range', min: 0.15, max: 0.9, step: 0.01, value: s.lx, fmt: (v) => fmt(v * 100, 0) + ' %' },
    ], (v) => { Object.assign(s, { L: Math.max(1.5, v.L), W: Math.max(1.5, v.W), H: Math.max(2, v.H), walls: v.walls, target: v.target, lx: v.lx }); s.items.forEach((it) => snap(s, it)); refresh(); });
    const pal = el('div', { class: 'row', style: { marginTop: '4px' } });
    pal.appendChild(el('span', { class: 'small' }, 'Add:'));
    Object.entries(KINDS).forEach(([k, v]) => {
      const b = el('button', { class: 'small', html: `<i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--${v.col})"></i> ${v.short}` });
      b.onclick = () => { const it = { kind: k, x: s.L / 2, y: 0, f0: v.f0 }; if (k === 'corner') { const used = s.items.filter((i) => i.kind === 'corner').length; it.x = used % 2 ? s.L : 0; it.y = used >= 2 ? s.W : 0; } if (k === 'cloud') { it.x = s.lx * s.L * 0.8; it.y = s.W / 2; } snap(s, it); s.items.push(it); s.sel = s.items.length - 1; refresh(); };
      pal.appendChild(b);
    });
    const clear = el('button', { class: 'small ghost' }, 'Clear all');
    clear.onclick = () => { s.items = []; s.sel = -1; refresh(); };
    const auto = el('button', { class: 'small primary' }, 'Auto-treat problems');
    pal.append(clear, auto);
    top.appendChild(pal);
    const stats = el('div', { class: 'stats' }); top.appendChild(stats);

    const grid = el('div', { class: 'grid', style: { gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', marginTop: '14px' } });
    if (innerWidth < 950) grid.style.gridTemplateColumns = '1fr';
    body.appendChild(grid);
    const planCard = el('div', { class: 'card' }), sideCard = el('div', { class: 'card' });
    grid.append(planCard, sideCard);
    planCard.appendChild(html('<h3 style="margin-top:0">Room plan — drag treatment to place it</h3>'));
    const viewSeg = A.seg([['problems', 'Problem pressure map'], ['mode', 'Selected mode'], ['none', 'Plain']], s.view, (v) => { s.view = v; save(); plan.redraw(); });
    planCard.appendChild(viewSeg);
    let dragging = -1;
    const plan = A.canvas(planCard, {
      height: 400, animate: true,
      onPointer(p, api) {
        const g = api.geom; if (!g) return;
        const X = (p.y - g.oy) / g.sc, Y = (p.x - g.ox) / g.sc;
        if (p.type === 'pointerdown') {
          dragging = s.items.findIndex((it) => Math.hypot(it.x - X, it.y - Y) < 0.35);
          s.sel = dragging; renderItem();
          if (dragging < 0 && X > 0 && Y > 0 && X < s.L && Y < s.W) { s.lx = A.clamp(X / s.L, 0.1, 0.95); s.ly = A.clamp(Y / s.W, 0.05, 0.95); M = model(s); updateAll(false); }
        }
        if (p.type === 'pointermove' && dragging >= 0 && p.buttons) { const it = s.items[dragging]; it.x = A.clamp(X, 0, s.L); it.y = A.clamp(Y, 0, s.W); snap(s, it); }
        if ((p.type === 'pointerup' || p.type === 'pointerleave') && dragging >= 0) { dragging = -1; refresh(); }
      },
      draw(ctx, w, h, t, dt, api) {
        const sc = Math.min((w - 40) / s.W, (h - 40) / s.L), ox = (w - s.W * sc) / 2, oy = 24;
        api.geom = { sc, ox, oy };
        const T = (x, y) => [ox + y * sc, oy + x * sc];
        // pressure map at ear height
        if (s.view !== 'none') {
          const probs = M.probs || (M.probs = problems(s, M));
          const list = s.view === 'mode' ? [M.bare[s.mode] || M.bare[0]] : probs.length ? probs.map((p) => p.m) : M.bare.filter((m) => m.type === 'axial' && m.f < 150);
          const nx = 40, ny = Math.round((40 * s.L) / s.W);
          const lut = V.divergingLUT();
          const osc = s.view === 'mode' ? Math.cos(t * 3) : 1;
          for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
            const r = [((j + 0.5) / ny) * s.L, ((i + 0.5) / nx) * s.W, s.lz];
            let v;
            if (s.view === 'mode') v = P.modeShape(list[0].n, [s.L, s.W, s.H], r) * osc;
            else { v = 0; list.forEach((m) => (v += Math.pow(P.modeShape(m.n, [s.L, s.W, s.H], r), 2))); v = v / list.length * 2 - 1; }
            const k = Math.round((A.clamp(v, -1, 1) * 0.5 + 0.5) * 255) * 3;
            ctx.fillStyle = `rgb(${lut[k]},${lut[k + 1]},${lut[k + 2]})`;
            ctx.fillRect(ox + (i * s.W * sc) / nx, oy + (j * s.L * sc) / ny, (s.W * sc) / nx + 0.6, (s.L * sc) / ny + 0.6);
          }
        }
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, s.W * sc, s.L * sc); ctx.lineWidth = 1;
        A.text(ctx, 'FRONT (speakers)', ox + (s.W * sc) / 2, oy - 8, { align: 'center', size: 11, color: A.css('muted') });
        M.spk.forEach((sp) => { const q = T(sp[0], sp[1]); ctx.fillStyle = A.css('accent2'); ctx.fillRect(q[0] - 7, q[1] - 7, 14, 14); });
        const q = T(M.rcv[0], M.rcv[1]); ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.arc(q[0], q[1], 7, 0, 7); ctx.fill();
        s.items.forEach((it, k) => {
          const K = KINDS[it.kind]; const p = T(it.x, it.y);
          ctx.fillStyle = A.css(K.col); ctx.strokeStyle = k === s.sel ? A.css('text') : A.alpha(A.css('text'), 0.4); ctx.lineWidth = k === s.sel ? 3 : 1;
          const sz = K.snap === 'corner' ? 0.6 * sc : K.snap === 'ceiling' ? 1.2 * sc : 0.6 * sc;
          if (K.snap === 'corner') { const sx = it.y < s.W / 2 ? 1 : -1, sy = it.x < s.L / 2 ? 1 : -1; const cx = it.y < s.W / 2 ? ox : ox + s.W * sc, cy = it.x < s.L / 2 ? oy : oy + s.L * sc; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + sx * sz, cy); ctx.lineTo(cx, cy + sy * sz); ctx.closePath(); ctx.fill(); ctx.stroke(); }
          else if (K.snap === 'ceiling') { ctx.globalAlpha = 0.6; ctx.fillRect(p[0] - (0.9 * sc), p[1] - (0.6 * sc), 1.8 * sc, 1.2 * sc); ctx.globalAlpha = 1; ctx.strokeRect(p[0] - 0.9 * sc, p[1] - 0.6 * sc, 1.8 * sc, 1.2 * sc); }
          else { const along = it.x <= 0.06 || it.x >= s.L - 0.06; const ww = along ? sz : 10, hh = along ? 10 : sz; ctx.fillRect(p[0] - ww / 2, p[1] - hh / 2, ww, hh); ctx.strokeRect(p[0] - ww / 2, p[1] - hh / 2, ww, hh); }
          ctx.lineWidth = 1;
          if (K.tuned) A.text(ctx, Math.round(it.f0) + ' Hz', p[0], p[1] - 10, { align: 'center', size: 10, weight: 700, bg: A.alpha(A.css('panel'), 0.8) });
        });
        A.text(ctx, s.view === 'problems' ? 'orange = high pressure of the problem modes → where pressure traps work' : s.view === 'mode' ? `mode (${(M.bare[s.mode] || M.bare[0]).n.join(',')}) ${fmt((M.bare[s.mode] || M.bare[0]).f, 1)} Hz — orange/blue = antinodes, pale = node` : '', ox, oy + s.L * sc + 16, { size: 10.5, color: A.css('muted') });
      },
    });
    plan.canvas.style.touchAction = 'none';
    const itemBox = el('div', { style: { marginTop: '8px' } }); planCard.appendChild(itemBox);

    sideCard.appendChild(html('<h3 style="margin-top:0">Modal decay — every mode below 250 Hz</h3><p class="small">Grey = untreated, coloured = with your treatment. Bars above the dashed target ring too long. Click a bar to see that mode on the plan and hear it.</p>'));
    let barsGeom = null;
    const bars = A.canvas(sideCard, {
      height: 250,
      onPointer(p) { if (p.type !== 'pointerdown' || !barsGeom) return; let best = -1, bd = 12; M.bare.forEach((m, i) => { const d = Math.abs(barsGeom.X(m.f) - p.x); if (d < bd) { bd = d; best = i; } }); if (best >= 0) { s.mode = best; s.view = 'mode'; save(); A.audio.tone(M.bare[best].f, 2.5, -14); plan.redraw(); bars.redraw(); } },
      draw(ctx, w, h) {
        const mx = Math.max(1, ...M.bare.map((m) => m.T60)) * 1.05;
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 250, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 40, 50, 60, 80, 100, 150, 200, 250] }, y: { min: 0, max: Math.min(3, mx), label: 'Decay T60 (s)' } });
        barsGeom = ax;
        M.bare.forEach((m, i) => {
          const x = ax.X(m.f), lw = m.type === 'axial' ? 4 : m.type === 'tangential' ? 2.5 : 1.5;
          ctx.strokeStyle = A.alpha(A.css('muted'), 0.45); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x, ax.y0); ctx.lineTo(x, ax.Y(Math.min(m.T60, 3))); ctx.stroke();
          const Tt = M.treated[i].T60;
          ctx.strokeStyle = Tt > s.target * 1.6 ? A.css('bad') : Tt > s.target ? A.css('warn') : A.css('good'); ctx.beginPath(); ctx.moveTo(x, ax.y0); ctx.lineTo(x, ax.Y(Math.min(Tt, 3))); ctx.stroke();
          if (i === s.mode) { ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 1; ctx.strokeRect(x - 5, ax.Y(Math.min(m.T60, 3)) - 4, 10, ax.y0 - ax.Y(Math.min(m.T60, 3)) + 4); }
        });
        ctx.lineWidth = 1; ctx.strokeStyle = A.css('accent'); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ax.x0, ax.Y(s.target)); ctx.lineTo(ax.x1, ax.Y(s.target)); ctx.stroke(); ctx.setLineDash([]);
      },
    });
    sideCard.appendChild(html('<h3>Modal distribution & overlap</h3><p class="small">Each bump is one mode, as wide as its bandwidth (≈ 2.2 / T60 Hz). Damping widens modes until they overlap — that is what turns a lumpy bass into a smooth one.</p>'));
    const dist = A.canvas(sideCard, {
      height: 170,
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { pad: { b: 30 }, x: { min: 20, max: 250, log: true, ticks: [20, 30, 50, 80, 100, 150, 200, 250] }, y: { min: 0, max: 1.05, ticks: [] } });
        [['bare', A.alpha(A.css('muted'), 0.6)], ['treated', A.css('accent')]].forEach(([key, c]) => {
          const pts = []; for (let f = 20; f <= 250; f *= 1.006) { let v = 0; M[key].forEach((m) => { const bw = 2.2 / m.T60, x = (f - m.f) / (bw / 2), wgt = m.type === 'axial' ? 1 : m.type === 'tangential' ? 0.6 : 0.35; v = Math.max(v, wgt / (1 + x * x)); }); pts.push([f, v]); }
          A.plotLine(ctx, ax, pts, c, key === 'treated' ? 2 : 1.4);
        });
      },
    });
    const respCard = el('div', { class: 'card', style: { marginTop: '14px' } }); body.appendChild(respCard);
    respCard.appendChild(html('<h3 style="margin-top:0">Bass at the listening position (click the plan to move the listener)</h3>'));
    const resp = A.canvas(respCard, {
      height: 280,
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 250, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 40, 50, 60, 80, 100, 150, 200, 250] }, y: { min: -30, max: 20, label: 'Level (dB)' } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(3), ax.x1 - ax.x0, ax.Y(-3) - ax.Y(3));
        A.plotLine(ctx, ax, M.rb.map((p) => [p.f, p.db]), A.css('muted'), 1.5, [5, 4]);
        A.plotLine(ctx, ax, M.rt.map((p) => [p.f, p.db]), A.css('accent'), 2.6);
      },
    });
    respCard.appendChild(A.legend([[A.css('muted'), 'Untreated', true], [A.css('accent'), 'With treatment']]));
    const probCard = el('div', { class: 'card', style: { marginTop: '14px' } }); body.appendChild(probCard);

    function renderItem() {
      itemBox.innerHTML = '';
      const it = s.items[s.sel];
      if (!it) { itemBox.appendChild(html('<p class="small">Tip: click a placed item to edit it. Click empty floor to move the listener.</p>')); return; }
      const K = KINDS[it.kind];
      const spec = [{ key: 'area', label: 'Face area', type: 'range', min: 0.2, max: 6, step: 0.1, value: it.area, unit: 'm²' }];
      if (K.tuned) spec.unshift({ key: 'f0', label: 'Tuned frequency', type: 'range', min: 30, max: 300, step: 1, value: it.f0, unit: 'Hz' });
      itemBox.appendChild(html(`<div class="row" style="justify-content:space-between"><b>${K.name}</b></div>`));
      A.controls(itemBox, spec, (v) => { Object.assign(it, v); refresh(); });
      const row = el('div', { class: 'row' });
      const del = el('button', { class: 'small' }, 'Remove');
      del.onclick = () => { s.items.splice(s.sel, 1); s.sel = -1; refresh(); };
      const go = el('a', { class: 'btn small', href: it.kind === 'diffuser' ? '#/diffusers' : '#/workshop/' + ({ corner: 'superchunk', membrane: 'membrane-trap', helmholtz: 'slot-wall', panel: 'broadband-panel', cloud: 'cloud' }[it.kind] || 'qrd') }, 'Build it →');
      row.append(del, go); itemBox.appendChild(row);
    }
    function renderProblems() {
      const P2 = problems(s, M);
      probCard.innerHTML = '<h3 style="margin-top:0">Problem finder</h3>';
      if (!P2.length) { probCard.appendChild(html('<div class="callout data">No strong ringing modes left in the 20–220 Hz range at this target. Measure the real room to confirm, then fine-tune the seat position.</div>')); return; }
      const t = el('div', { class: 'table-wrap' });
      t.innerHTML = `<table><tr><th>Mode</th><th class="num">Frequency</th><th class="num">Decay now</th><th class="num">Peak at seat</th><th>Best spot for a pressure trap</th><th></th></tr>${P2.map((p, k) => {
        const kind = p.m.f < 110 ? 'membrane' : 'helmholtz'; const b = bestSpot(s, p.m, kind);
        return `<tr><td>(${p.m.n.join(',')}) ${p.m.type}</td><td class="num">${fmtHz(p.m.f)}</td><td class="num ${p.T > s.target * 1.6 ? 'bad' : 'warn'}">${fmt(p.T, 2)} s</td><td class="num">${p.peak > -50 ? (p.peak > 0 ? '+' : '') + fmt(p.peak, 1) + ' dB' : '—'}</td><td>${b.where} (${A.fmtLen(b.x)}, ${A.fmtLen(b.y)})</td><td><button class="small" data-k="${k}">+ ${kind === 'membrane' ? 'Membrane' : 'Helmholtz'} trap</button></td></tr>`;
      }).join('')}</table>`;
      t.addEventListener('click', (e) => { const k = e.target.dataset.k; if (k == null) return; addTuned(P2[+k]); });
      probCard.appendChild(t);
      probCard.appendChild(html('<p class="small">Peaks at the seat are reduced by damping; dips (nulls) are not — move the listener instead (click the plan).</p>'));
    }
    function addTuned(p) {
      const kind = p.m.f < 110 ? 'membrane' : 'helmholtz', b = bestSpot(s, p.m, kind);
      const it = { kind, x: b.x, y: b.y, f0: Math.round(p.m.f) }; snap(s, it); s.items.push(it); s.sel = s.items.length - 1; refresh();
    }
    auto.onclick = () => {
      const corners = s.items.filter((i) => i.kind === 'corner').length;
      for (let k = corners; k < 4; k++) { const it = { kind: 'corner', x: k % 2 ? s.L : 0, y: k >= 2 ? s.W : 0 }; snap(s, it); s.items.push(it); }
      M = model(s);
      problems(s, M).slice(0, 3).forEach((p) => { const kind = p.m.f < 110 ? 'membrane' : 'helmholtz', b = bestSpot(s, p.m, kind); const it = { kind, x: b.x, y: b.y, f0: Math.round(p.m.f) }; snap(s, it); s.items.push(it); });
      refresh(); A.toast('Added corner traps and tuned traps for the worst modes');
    };
    function updateAll(full = true) {
      const ring = (arr) => arr.filter((m) => m.f < 200 && m.T60 > s.target * 1.6 && m.type !== 'oblique').length;
      const avg = (arr) => { const a = arr.filter((m) => m.f < 200); return a.reduce((x, m) => x + m.T60, 0) / a.length; };
      stats.innerHTML = A.statBox('Avg modal decay < 200 Hz', fmt(avg(M.treated), 2) + ' s', 'untreated ' + fmt(avg(M.bare), 2) + ' s', avg(M.treated) <= s.target * 1.2 ? 'good' : 'warn') +
        A.statBox('Ringing modes', ring(M.treated), 'untreated ' + ring(M.bare), ring(M.treated) ? 'warn' : 'good') +
        A.statBox('Bass smoothness at seat', '±' + fmt(M.sdT, 1) + ' dB', 'untreated ±' + fmt(M.sdB, 1) + ' dB', M.sdT < 4 ? 'good' : M.sdT < 6 ? 'warn' : 'bad') +
        A.statBox('Schroeder frequency', fmtHz(P.schroeder(Math.max(0.2, avg(M.treated)), s.L * s.W * s.H))) +
        A.statBox('Treatment items', s.items.length, fmt(s.items.reduce((a, b) => a + b.area, 0), 1) + ' m² face area');
      if (full) renderItem();
      renderProblems();
      bars.redraw(); dist.redraw(); resp.redraw();
    }
    function refresh() { save(); M = model(s); updateAll(); }
    updateAll();
  }

  /* ---------------- early reflections (above Schroeder) ---------------- */
  function reflections(body) {
    const st = A.controls(body, [
      { key: 'side', label: 'Side-wall reflection points', type: 'select', value: 'panel', options: [['none', 'Bare wall'], ['thin', '25 mm foam'], ['panel', '100 mm panel + gap'], ['diffuser', 'Diffuser']] },
      { key: 'ceil', label: 'Ceiling above listener', type: 'select', value: 'cloud', options: [['none', 'Bare ceiling'], ['panel', 'Panel on ceiling'], ['cloud', 'Cloud 200 mm drop'], ['diffuser', 'Diffuser']] },
      { key: 'rear', label: 'Rear wall', type: 'select', value: 'diffuser', options: [['none', 'Bare wall'], ['panel', 'Deep absorption'], ['diffuser', 'Diffuser']] },
      { key: 'desk', label: 'Desk / console', type: 'select', value: 'none', options: [['none', 'Reflective desk'], ['angled', 'Speakers raised & angled']] },
      { key: 'f', label: 'Frequency band', type: 'select', value: 2000, numeric: true, options: [[500, '500 Hz'], [1000, '1 kHz'], [2000, '2 kHz'], [4000, '4 kHz']] },
    ], () => cv.redraw());
    const al = (k, f) => ({ none: 0.05, thin: P.porousAlpha(f, 14000, 0.025, 0), panel: P.porousAlpha(f, 12000, 0.1, 0.05), cloud: P.porousAlpha(f, 12000, 0.1, 0.2), diffuser: 0.15, angled: 0 })[k];
    const cv = A.canvas(body, {
      height: 320,
      caption: 'Energy–time curve at the listening position for a typical 5 × 4 × 2.6 m room. Absorbers lower a reflection by 10·log(1 − α); diffusers break it into many smaller, later arrivals (grey). The green zone is the “reflection-free” goal: ≥ 15–20 dB down for the first ~20 ms.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: 30, label: 'Time after direct sound (ms)' }, y: { min: -40, max: 0, label: 'Level re direct (dB)' } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.1); ctx.fillRect(ax.x0, ax.Y(-15), ax.X(20) - ax.x0, ax.y0 - ax.Y(-15));
        const refl = [['Desk', 1.2, st.desk === 'angled' ? 'angled' : 'none'], ['Left wall', 2.4, st.side], ['Right wall', 2.6, st.side], ['Floor', 3.4, 'thin'], ['Ceiling', 3.9, st.ceil], ['Front wall', 6.5, 'panel'], ['Rear wall', 13, st.rear]];
        const d0 = 1.8;
        ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ax.X(0.3), ax.y0); ctx.lineTo(ax.X(0.3), ax.Y(0)); ctx.stroke();
        refl.forEach(([n, extra, k]) => {
          const tms = (extra / P.C) * 1000, base = 20 * Math.log10(d0 / (d0 + extra));
          if (k === 'angled') return;
          const a = al(k, st.f);
          let lv = base + 10 * Math.log10(1 - Math.min(0.99, a));
          if (k === 'diffuser') { lv = base - 8; for (let i = 0; i < 10; i++) { const tt = tms + i * 0.6, l = base - 10 - i * 0.8; ctx.strokeStyle = A.alpha(A.css('muted'), 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax.X(tt), ax.y0); ctx.lineTo(ax.X(tt), ax.Y(Math.max(-40, l))); ctx.stroke(); } }
          ctx.strokeStyle = lv > -15 && tms < 20 ? A.css('bad') : A.css('accent'); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax.X(tms), ax.y0); ctx.lineTo(ax.X(tms), ax.Y(Math.max(-40, lv))); ctx.stroke();
          A.text(ctx, n, ax.X(tms), ax.Y(Math.max(-40, lv)) - 6, { align: 'center', size: 10, color: A.css('muted') });
        });
        ctx.lineWidth = 1;
      },
    });
    body.appendChild(html('<div class="callout mentor">Below the Schroeder frequency, treatment is about modes (previous tab). Above it, it is about reflections: absorb or redirect the early ones near the listener, diffuse the late ones — if you are far enough away.</div>'));
  }

  /* ---------------- hidden & integrated ---------------- */
  function hidden(body) {
    const c1 = el('div', { class: 'card' }); body.appendChild(c1);
    c1.appendChild(html('<h3 style="margin-top:0">Space budget: separate vs integrated</h3><p class="small">Same total wall depth, two ways to use it. Left curve: isolation rating; right: low-frequency absorption the wall gives the room.</p>'));
    const st = A.controls(c1, [
      { key: 'depth', label: 'Total depth available (from existing wall)', type: 'range', min: 150, max: 600, step: 10, value: 300, unit: 'mm' },
      { key: 'cover', label: 'Panel coverage in the “separate” approach', type: 'range', min: 10, max: 60, step: 5, value: 30, unit: '%' },
      { key: 'base', label: 'Existing wall', type: 'select', value: 'masonry', options: [['masonry', '200 mm masonry'], ['stud', 'Timber stud + 1 layer']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); c1.appendChild(out);
    const cv = A.canvas(c1, {
      height: 280,
      draw(ctx, w, h) {
        const R = calc();
        const ax = A.axes(ctx, w, h, { x: { min: 40, max: 1000, log: true, label: 'Frequency (Hz)', ticks: [50, 63, 80, 100, 125, 160, 200, 250, 500, 1000] }, y: { min: 0, max: 1.05, label: 'Wall-average absorption α' } });
        const fs = []; for (let f = 40; f <= 1000; f *= 1.04) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, R.aSep(f)]), A.css('accent2'), 2.2);
        A.plotLine(ctx, ax, fs.map((f) => [f, R.aInt(f)]), A.css('accent'), 2.8);
      },
    });
    c1.appendChild(A.legend([[A.css('accent2'), 'Separate: thicker isolation + panels on part of the wall'], [A.css('accent'), 'Integrated: isolation + fabric-faced cavity over the whole wall']]));
    const draw = el('div', { class: 'grid g2', style: { marginTop: '12px' } }); c1.appendChild(draw);
    function calc() {
      const D = st.depth / 1000;
      const base = st.base === 'masonry' ? [{ mat: 'cmu', t: 0.19 }] : [{ mat: 'gypsum', t: 0.0125 }];
      const leaf = [{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }];
      const sepCav = Math.max(0.05, D - 0.032 - 0.1 * 0); // all depth to isolation; panels mounted on top (protrude 100 mm, counted separately)
      const intCav = Math.max(0.04, Math.min(0.12, D * 0.4) - 0.032 + 0.032), treat = Math.max(0.05, D - intCav - 0.032);
      const tl = (cav) => { const a = P.leafProps(base), b = P.leafProps(leaf); return P.STC_BANDS.map((f) => P.doubleLeafTL({ leaf1: a, leaf2: b, d: cav, filled: true, conn: 'none' }, P.exactThird(f)).tl); };
      const stcSep = P.stc(tl(Math.max(0.04, D - 0.1 - 0.032))), stcInt = P.stc(tl(intCav));
      return {
        stcSep, stcInt, intCav, treat, sepCav: Math.max(0.04, D - 0.1 - 0.032),
        aSep: (f) => (st.cover / 100) * P.porousAlpha(f, 12000, 0.1, 0) + (1 - st.cover / 100) * 0.05,
        aInt: (f) => P.porousAlpha(f, 7000, treat * 0.7, treat * 0.3),
      };
    }
    function upd() {
      const R = calc();
      out.innerHTML = A.statBox('Separate: wall STC', R.stcSep, `cavity ${A.fmtLen(R.sepCav)} + 100 mm panels`) + A.statBox('Integrated: wall STC', R.stcInt, `cavity ${A.fmtLen(R.intCav)}`) +
        A.statBox('α @ 80 Hz', fmt(R.aSep(80), 2) + ' → ' + fmt(R.aInt(80), 2), 'separate → integrated', R.aInt(80) > R.aSep(80) * 1.5 ? 'good' : '') + A.statBox('α @ 125 Hz', fmt(R.aSep(125), 2) + ' → ' + fmt(R.aInt(125), 2), 'separate → integrated');
      draw.innerHTML = `<div>${DR.hybridWall({ base: st.base, isoGap: 0.02, stud: Math.max(0.03, R.sepCav - 0.02), leafLayers: 2, airTreat: 0.0, treat: 0.1, fabric: true, label: 'separate' })}</div><div>${DR.hybridWall({ base: st.base, isoGap: 0.02, stud: Math.max(0.02, R.intCav - 0.02), leafLayers: 2, airTreat: R.treat * 0.3, treat: R.treat * 0.7, fabric: true, label: 'integrated' })}</div>`;
      cv.redraw();
    }
    upd();
    const c2 = el('div', { class: 'card', style: { marginTop: '14px' } }); body.appendChild(c2);
    c2.appendChild(html('<h3 style="margin-top:0">A room whose treatment you can’t see</h3>'));
    const st2 = A.controls(c2, [{ key: 'L', label: 'Room length', type: 'number', value: 6.2, unit: 'm' }, { key: 'W', label: 'Room width', type: 'number', value: 4.6, unit: 'm' }, { key: 'd', label: 'Depth behind the fabric line', type: 'range', min: 100, max: 500, step: 10, value: 250, unit: 'mm' }], () => (pl.innerHTML = DR.hiddenRoom({ L: st2.L, W: st2.W, depth: st2.d / 1000 })));
    const pl = el('div'); c2.appendChild(pl); pl.innerHTML = DR.hiddenRoom({ L: st2.L, W: st2.W, depth: st2.d / 1000 });
    const L = LESSONS.find((l) => l.id === 'integrated');
    L.sections.slice(0, 3).forEach((s) => { const d = el('div', { class: 'card', style: { marginTop: '14px' } }); d.innerHTML = `<h3 style="margin-top:0">${s.h}</h3>${s.html}`; body.appendChild(d); });
  }

  function guide(body) {
    const L = LESSONS.find((l) => l.id === 'modes-treat');
    L.sections.forEach((s) => { const d = el('div', { class: 'card', style: { marginBottom: '14px' } }); d.innerHTML = `<h3 style="margin-top:0">${s.h}</h3>${s.html}`; body.appendChild(d); });
    const c = el('div', { class: 'card' }); body.appendChild(c);
    c.appendChild(html('<h3 style="margin-top:0">See a mode, move the listener, hear it</h3>')); V.modes2D(c);
  }

  A.register('treatment', {
    title: 'Treatment Simulator',
    render(root, params) {
      A.pageHead(root, 'Analyse & design', 'Room Treatment Simulator', 'Place bass traps, tuned resonators, panels, diffusers and clouds in a room and watch what each one does to every room mode, the modal distribution, the bass at your seat and the early reflections. Then build it.');
      const tabs = [['sim', 'Modes & placement'], ['refl', 'Reflections & diffusion'], ['hidden', 'Hidden & integrated design'], ['guide', 'Quick guide: modes']];
      A.tabs(root, tabs, (id, body) => ({ sim: simulator, refl: reflections, hidden, guide })[id](body), tabs.find((t) => t[0] === params[0]) ? params[0] : 'sim');
    },
  });
})();
