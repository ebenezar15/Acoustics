/* Room Predictor: from dimensions alone, predict problem frequencies, problem zones,
   the best listening position and a placed treatment plan (plan view + wall elevations). */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const L_ = (m) => A.fmtLen(m);
  const CONS = { masonry: ['Masonry / concrete (very rigid)', 0.03], mixed: ['Mixed construction', 0.08], drywall: ['Drywall on studs', 0.14] };
  const USES = { mix: ['Mixing / control room', 0.3], studio: ['Home studio (record + mix)', 0.35], cinema: ['Home cinema', 0.4], booth: ['Vocal booth / podcast', 0.25], rehearsal: ['Rehearsal room', 0.45], listening: ['Hi-fi listening room', 0.4] };

  function predict(s) {
    const { L, W, H } = s, dims = [L, W, H], V0 = L * W * H;
    const room = { L, W, H, alpha: (f) => CONS[s.cons][1] * (f < 100 ? 1.2 : 1) };
    const modes = P.treatedModes(room, [], 300);
    const T = USES[s.use][1];
    const fs = P.schroeder(Math.max(0.25, modes.filter((m) => m.f < 200).reduce((a, m) => a + m.T60, 0) / Math.max(1, modes.filter((m) => m.f < 200).length) * 0.6), V0);
    const fLimit = Math.min(250, Math.max(120, fs * 1.2));

    /* ---- problem frequencies: cluster axial/tangential modes, score them ---- */
    const strong = modes.filter((m) => m.f <= Math.min(fLimit, 200) && m.type !== 'oblique');
    const clusters = [];
    strong.forEach((m) => {
      const c = clusters.find((k) => Math.abs(k.f - m.f) / k.f < 0.03);
      if (c) { c.modes.push(m); c.f = c.modes.reduce((a, x) => a + x.f, 0) / c.modes.length; } else clusters.push({ f: m.f, modes: [m] });
    });
    const density = (f) => modes.filter((m) => Math.abs(Math.log2(m.f / f)) < 1 / 6).length; // modes within ±1/6 octave (incl. oblique)
    clusters.forEach((c, i) => {
      const nAx = c.modes.filter((m) => m.type === 'axial').length, nTan = c.modes.length - nAx;
      const w = Math.min(3, nAx + 0.35 * nTan);
      const prev = clusters[i - 1], next = clusters[i + 1];
      const gap = Math.min(prev ? c.f / prev.f : 2, next ? next.f / c.f : 2);
      c.isolated = gap > 1.1;
      c.coincident = nAx >= 2;
      c.T = Math.max(...c.modes.map((m) => m.T60));
      const crowd = density(c.f); // dense neighbourhoods smooth each other out
      c.score = w * (c.coincident ? 1.7 : 1) * (c.isolated ? 1.5 : 1) * Math.pow(120 / c.f, 0.8) * c.T / Math.sqrt(Math.max(1, crowd - c.modes.length + 1));
      c.why = [c.coincident ? 'two dimensions resonate together' : '', c.isolated ? 'isolated — no neighbouring modes to smooth it' : '', nAx ? 'axial (strongest type)' : 'tangential'].filter(Boolean).join(' · ');
      c.walls = [...new Set(c.modes.flatMap((m) => m.n.map((n, k) => (n ? ['front & rear walls', 'side walls', 'floor & ceiling'][k] : '')).filter(Boolean)))].join(', ');
    });
    const ranked = clusters.slice().sort((a, b) => b.score - a.score);
    const top = ranked.slice(0, 6);
    top.forEach((c) => (c.severity = c.score >= ranked[0].score * 0.7 ? 'high' : c.score >= ranked[0].score * 0.4 ? 'medium' : 'low'));

    /* ---- best listening position (symmetric across width) ---- */
    const respSD = (x, sd) => {
      const spk = [[sd, W / 2 - Math.min(s.spread, W - 0.6) / 2, 1.1], [sd, W / 2 + Math.min(s.spread, W - 0.6) / 2, 1.1]];
      const r = P.modalResponseModes(room, modes, spk, [x, W / 2, 1.2], 30, 150, 50);
      const m = r.reduce((a, p) => a + p.db, 0) / r.length;
      return Math.sqrt(r.reduce((a, p) => a + (p.db - m) ** 2, 0) / r.length);
    };
    let best = { sd: 0.5, x: 0.38 * L, v: 99 };
    [0.3, 0.5, 0.75, 1.0].filter((d) => d < L * 0.25).forEach((sd) => {
      for (let k = 0.3; k <= 0.7; k += 0.02) { const x = k * L; if (x - sd < 1) continue; const pen = (Math.abs(k - 0.5) < 0.06 ? 3 : 0) + (Math.abs(k - 0.25) < 0.03 || Math.abs(k - 0.75) < 0.03 ? 0.8 : 0); const v = respSD(x, sd) + pen; if (v < best.v) best = { sd, x, v }; }
    });
    const centre = respSD(L / 2, best.sd);

    /* ---- zone map: bass unevenness at ear height ---- */
    const nx = 26, ny = Math.max(10, Math.round((26 * W) / L));
    const spkB = [[best.sd, W / 2 - Math.min(s.spread, W - 0.6) / 2, 1.1], [best.sd, W / 2 + Math.min(s.spread, W - 0.6) / 2, 1.1]];
    const grid = [];
    let gmin = 99, gmax = 0;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const r = P.modalResponseModes(room, modes, spkB, [((i + 0.5) / nx) * L, ((j + 0.5) / ny) * W, 1.2], 30, 150, 36);
      const m = r.reduce((a, p) => a + p.db, 0) / r.length;
      const v = Math.sqrt(r.reduce((a, p) => a + (p.db - m) ** 2, 0) / r.length);
      grid.push(v); gmin = Math.min(gmin, v); gmax = Math.max(gmax, v);
    }

    /* ---- treatment plan ---- */
    const items = [];
    const add = (o) => items.push(Object.assign({ z0: 0, z1: H }, o));
    [[0.15, 0.15], [0.15, W - 0.15], [L - 0.15, 0.15], [L - 0.15, W - 0.15]].forEach(([x, y], k) => add({ kind: 'corner', x, y, area: 0.85 * H, label: ['Front-left', 'Front-right', 'Rear-left', 'Rear-right'][k] + ' corner trap', why: 'All modes peak in corners' }));
    // tuned traps for the top low clusters at their best (non-corner-occupied) spot
    const used = [];
    top.filter((c) => c.f < 160).slice(0, 2).forEach((c) => {
      const m = c.modes.slice().sort((a, b) => (a.type === 'axial' ? -1 : 1))[0];
      const kind = c.f < 110 ? 'membrane' : 'helmholtz';
      const z = kind === 'membrane' ? [0, 1.2] : [0.2, 1.4];
      const cands = [];
      for (let t = 0.08; t <= 0.92; t += 0.04) cands.push([0.05, t * W, 'front wall'], [L - 0.05, t * W, 'rear wall'], [t * L, 0.05, 'left wall'], [t * L, W - 0.05, 'right wall']);
      cands.forEach((cnd) => (cnd.w = P.modeWeight(m.n, dims, P.itemPoints({ x: cnd[0], y: cnd[1], z0: z[0], z1: z[1] }, H))));
      cands.sort((a, b) => b.w - a.w);
      const pick = cands.find((cnd) => !used.some((u) => Math.hypot(u[0] - cnd[0], u[1] - cnd[1]) < 0.9) && Math.hypot(cnd[0] - best.x, cnd[1] - W / 2) > 1);
      if (!pick) return; used.push(pick);
      add({ kind, f0: Math.round(c.f), x: pick[0], y: pick[1], z0: z[0], z1: z[1], area: kind === 'membrane' ? 1.2 : 1.5, label: `${kind === 'membrane' ? 'Membrane' : 'Helmholtz'} trap tuned to ${Math.round(c.f)} Hz`, why: `Pressure maximum of mode (${m.n.join(',')}) on the ${pick[2]}` });
    });
    // first reflection points on side walls (both speakers), mirror method
    const lx = best.x;
    spkB.forEach((sp, k) => [0, W].forEach((wy) => {
      const img = [sp[0], 2 * wy - sp[1]], t = (wy - W / 2) / (img[1] - W / 2), px = lx + t * (img[0] - lx);
      if (px > 0.3 && px < L - 0.3) add({ kind: 'panel', x: px, y: wy ? W - 0.05 : 0.05, z0: 0.8, z1: 2.0, area: 0.72, label: `${wy ? 'Right' : 'Left'} wall first reflection (${k ? 'right' : 'left'} speaker)`, why: 'Early reflection within ~5 ms → comb filtering, image blur' });
    }));
    add({ kind: 'cloud', x: (best.sd + lx) / 2, y: W / 2, z0: H - 0.25, z1: H, area: 2.2, label: 'Ceiling cloud', why: `Ceiling reflection (height ${L_(H)})` });
    add({ kind: 'panel', x: 0.05, y: W / 2, z0: 0.6, z1: 1.8, area: Math.min(1.5, W * 0.3), label: 'Front wall absorption (between speakers)', why: `Speaker-boundary null near ${fmtHz(P.sbirNull(best.sd))}` });
    const rear = L - lx;
    if (rear >= 3) add({ kind: 'diffuser', x: L - 0.05, y: W / 2, z0: 1.0, z1: 2.2, area: 1.6, label: 'Rear wall diffuser (over absorption)', why: `You sit ${L_(rear)} from the rear wall — far enough for diffusion` });
    else add({ kind: 'panel', x: L - 0.05, y: W / 2, z0: 0.5, z1: 2.1, area: Math.min(3, W * 0.6), label: 'Deep rear wall absorption (200 mm+)', why: `Rear wall only ${L_(rear)} behind you — absorb, don’t diffuse` });

    const after = P.treatedModes(room, items, 300);
    const spkC = spkB;
    const rB = P.modalResponseModes(room, modes, spkC, [L / 2, W / 2, 1.2], 20, 220, 200), rA = P.modalResponseModes(room, after, spkC, [lx, W / 2, 1.2], 20, 220, 200);
    const sd = (r) => { const b = r.filter((p) => p.f >= 30 && p.f <= 150).map((p) => p.db); const m = b.reduce((a, x) => a + x, 0) / b.length; return Math.sqrt(b.reduce((a, x) => a + (x - m) ** 2, 0) / b.length); };
    const avgT = (arr) => { const a = arr.filter((m) => m.f < 200); return a.reduce((x, m) => x + m.T60, 0) / a.length; };
    const flutter = [['front ↔ rear walls', L], ['side walls', W], ['floor ↔ ceiling', H]].map(([n, d]) => ({ n, d, rate: P.C / (2 * d) }));
    return { room, modes, after, top, clusters, best, centre, grid, nx, ny, gmin, gmax, items, rB, rA, sdB: sd(rB), sdA: sd(rA), tB: avgT(modes), tA: avgT(after), fs, gaps: P.modeGaps(modes, 200, 18), bolt: P.boltOK(L, W, H), target: T, flutter, spk: spkB };
  }

  const KCOL = { corner: 'c4', membrane: 'accent2', helmholtz: 'c3', panel: 'accent', diffuser: 'c5', cloud: 'c6' };

  function elevations(s, R) {
    // unfolded walls: front (y 0→W), right (x 0→L), rear (y W→0), left (x L→0)
    const walls = [['FRONT', s.W, (it) => it.x < 0.1, (it) => it.y], ['RIGHT', s.L, (it) => it.y > s.W - 0.1, (it) => it.x], ['REAR', s.W, (it) => it.x > s.L - 0.1, (it) => s.W - it.y], ['LEFT', s.L, (it) => it.y < 0.1, (it) => s.L - it.x]];
    const total = 2 * (s.L + s.W), sc = 1000 / total, hh = s.H * sc * 1.0, H = Math.max(140, hh + 70);
    let x = 20, b = '';
    walls.forEach(([name, len, onWall, pos]) => {
      const w = len * sc;
      b += `<rect x="${x}" y="30" width="${w}" height="${hh}" fill="var(--bg2)" stroke="var(--text)" stroke-width="1.2"/><text x="${x + w / 2}" y="22" text-anchor="middle" font-size="11" font-weight="700">${name} WALL · ${L_(len)}</text>`;
      R.items.forEach((it) => {
        const c = `var(--${KCOL[it.kind]})`;
        if (it.kind === 'corner') {
          const corners = { FRONT: [[0.15, 0.15], [0.15, s.W - 0.15]], RIGHT: [[0.15, s.W - 0.15], [s.L - 0.15, s.W - 0.15]], REAR: [[s.L - 0.15, s.W - 0.15], [s.L - 0.15, 0.15]], LEFT: [[s.L - 0.15, 0.15], [0.15, 0.15]] }[name];
          corners.forEach(([cx, cy], k) => { if (Math.abs(it.x - cx) < 0.01 && Math.abs(it.y - cy) < 0.01) b += `<rect x="${k ? x + w - 0.42 * sc : x}" y="30" width="${0.42 * sc}" height="${hh}" fill="${c}" opacity=".75"/>`; });
          return;
        }
        if (it.kind === 'cloud' || !onWall(it)) return;
        const p = pos(it), ww = Math.max(0.6, Math.min(len * 0.4, it.area / (it.z1 - it.z0))) * sc;
        const y1 = 30 + (s.H - it.z1) * sc * 1.0, y2 = 30 + (s.H - it.z0) * sc * 1.0;
        b += `<rect x="${x + p * sc - ww / 2}" y="${y1}" width="${ww}" height="${y2 - y1}" fill="${c}" opacity=".85" stroke="var(--text)" stroke-width=".6"/>`;
        if (it.f0) b += `<text x="${x + p * sc}" y="${y1 - 4}" text-anchor="middle" font-size="9" font-weight="700">${it.f0} Hz</text>`;
      });
      b += `<line x1="${x}" y1="${30 + hh - 1.2 * sc}" x2="${x + w}" y2="${30 + hh - 1.2 * sc}" stroke="var(--muted)" stroke-dasharray="3 3"/>`;
      x += w;
    });
    b += `<text x="20" y="${30 + hh + 18}" font-size="10" class="mut">Dashed line = ear height (seated). Walls unfolded clockwise from the front; heights to scale.</text>`;
    return `<svg class="diagram" viewBox="0 0 1040 ${H}" role="img" aria-label="Wall elevations with treatment">${b}</svg>`;
  }

  A.register('predict', {
    title: 'Room Predictor',
    render(root) {
      A.pageHead(root, 'Analyse', 'Room Predictor', 'Enter your room’s dimensions. Before you buy or build anything, see which frequencies will cause trouble, where in the room they are worst, where to sit, and exactly where each absorber, trap and diffuser should go.');
      const s = Object.assign({ L: 5.2, W: 3.9, H: 2.5, use: 'mix', cons: 'mixed', spread: 1.6 }, A.store.get('predict', {}));
      const card = el('div', { class: 'card' }); root.appendChild(card);
      A.controls(card, [
        { key: 'L', label: 'Length (front → back)', type: 'number', value: s.L, unit: 'm' },
        { key: 'W', label: 'Width', type: 'number', value: s.W, unit: 'm' },
        { key: 'H', label: 'Height', type: 'number', value: s.H, unit: 'm' },
        { key: 'use', label: 'Room use', type: 'select', value: s.use, options: Object.entries(USES).map(([k, v]) => [k, v[0]]) },
        { key: 'cons', label: 'Construction', type: 'select', value: s.cons, options: Object.entries(CONS).map(([k, v]) => [k, v[0]]) },
        { key: 'spread', label: 'Speaker spacing', type: 'range', min: 0.8, max: 3, step: 0.05, value: s.spread, unit: 'm' },
      ], (v) => { Object.assign(s, { L: Math.max(1.5, v.L), W: Math.max(1.2, v.W), H: Math.max(1.8, v.H), use: v.use, cons: v.cons, spread: v.spread }); run(); });
      const pre = el('div', { class: 'row', style: { marginTop: '4px' } });
      pre.appendChild(el('span', { class: 'small' }, 'Try:'));
      [['Square bedroom', 3.6, 3.6, 2.4], ['Garage', 6, 3, 2.5], ['Basement', 5.2, 3.9, 2.3], ['Booth', 1.8, 1.5, 2.3], ['Good ratio', 6.2, 4.4, 2.8]].forEach(([n, l, w, h]) => {
        const b = el('button', { class: 'small' }, n); b.onclick = () => { Object.assign(s, { L: l, W: w, H: h }); A.store.set('predict', s); A.route(); }; pre.appendChild(b);
      });
      card.appendChild(pre);
      const out = el('div'); root.appendChild(out);
      let timer = 0;
      function run() { A.store.set('predict', s); clearTimeout(timer); out.style.opacity = 0.5; timer = setTimeout(() => { out.style.opacity = 1; render(predict(s)); }, 60); }

      function render(R) {
        out.innerHTML = '';
        const hi = R.top.filter((c) => c.severity === 'high').length;
        out.appendChild(html(`<div class="stats" style="margin-top:14px">
          ${A.statBox('Problem frequencies', R.top.length, hi + ' high severity', hi > 1 ? 'bad' : 'warn')}
          ${A.statBox('Best seat', L_(R.best.x) + ' from front', fmt((R.best.x / s.L) * 100, 0) + ' % of length', 'good')}
          ${A.statBox('Bass evenness at seat', '±' + fmt(R.sdA, 1) + ' dB', 'centre seat, untreated ±' + fmt(R.sdB, 1) + ' dB', R.sdA < 4 ? 'good' : 'warn')}
          ${A.statBox('Avg modal decay < 200 Hz', fmt(R.tA, 2) + ' s', 'untreated ' + fmt(R.tB, 2) + ' s', R.tA <= R.target * 1.3 ? 'good' : 'warn')}
          ${A.statBox('Room proportions', R.bolt ? 'Good (Bolt area)' : 'Poor (outside Bolt area)', '', R.bolt ? 'good' : 'warn')}
          ${A.statBox('Modal region up to', '≈ ' + fmtHz(R.fs), 'treat as modes below this')}
        </div>`));

        /* problem frequencies */
        const pf = el('div', { class: 'card' }); out.appendChild(pf);
        pf.appendChild(html('<h3 style="margin-top:0">1 · Predicted problem frequencies</h3><p class="small">Ranked by how strong, isolated and long-ringing they will be. Click ▶ to hear one, then walk around the room — you’ll find the loud and quiet zones.</p>'));
        const spec = el('div'); pf.appendChild(spec);
        A.canvas(spec, {
          height: 210,
          draw(ctx, w, h) {
            const ax = A.axes(ctx, w, h, { x: { min: 20, max: 260, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 40, 50, 60, 80, 100, 150, 200, 250] }, y: { min: 0, max: 1.1, ticks: [] } });
            R.modes.filter((m) => m.f < 260).forEach((m) => { const hgt = m.type === 'axial' ? 0.6 : m.type === 'tangential' ? 0.4 : 0.22; ctx.strokeStyle = A.alpha(A.css('muted'), 0.6); ctx.lineWidth = m.type === 'axial' ? 2.5 : 1.2; ctx.beginPath(); ctx.moveTo(ax.X(m.f), ax.y0); ctx.lineTo(ax.X(m.f), ax.Y(hgt)); ctx.stroke(); });
            R.top.forEach((c, i) => { const col = c.severity === 'high' ? A.css('bad') : c.severity === 'medium' ? A.css('warn') : A.css('accent2'); ctx.fillStyle = A.alpha(col, 0.18); const x0 = ax.X(c.f * 0.96), x1 = ax.X(c.f * 1.04); ctx.fillRect(x0, ax.y1, x1 - x0, ax.y0 - ax.y1); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(ax.X(c.f), ax.Y(0.85), 11, 0, 7); ctx.fill(); A.text(ctx, String(i + 1), ax.X(c.f), ax.Y(0.85) + 4, { align: 'center', weight: 800, size: 11, color: '#fff' }); });
            if (R.fs < 260) { ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.X(R.fs), ax.y1, ax.x1 - ax.X(R.fs), ax.y0 - ax.y1); A.text(ctx, 'dense modes →', ax.X(R.fs) + 4, ax.y1 + 14, { size: 10, color: A.css('good') }); }
            ctx.lineWidth = 1;
          },
        });
        const tbl = el('div', { class: 'table-wrap', style: { marginTop: '10px' } });
        tbl.innerHTML = `<table><tr><th>#</th><th>Frequency</th><th>Nearest note</th><th>Severity</th><th>Why</th><th>Loudest at</th><th>Rings for</th><th></th></tr>${R.top.map((c, i) => `<tr><td><b>${i + 1}</b></td><td class="num">${fmtHz(c.f)}</td><td>${V.NOTE ? V.NOTE(c.f) : ''}</td><td><span class="pill tag-${c.severity === 'high' ? 'bad' : c.severity === 'medium' ? 'warn' : 'good'}">${c.severity}</span></td><td class="small">${c.why}<br>modes ${c.modes.map((m) => '(' + m.n.join(',') + ')').join(' ')}</td><td class="small">${c.walls}, corners</td><td class="num">${fmt(c.T, 2)} s</td><td><button class="small" data-f="${c.f}">▶</button></td></tr>`).join('')}</table>`;
        tbl.addEventListener('click', (e) => { const f = e.target.dataset.f; if (f) A.audio.tone(+f, 3, -14); });
        pf.appendChild(tbl);
        const extra = [];
        if (R.gaps.length) extra.push(`<b>Gaps</b> with no modes: ${R.gaps.slice(0, 3).map(([a, b]) => `${fmt(a, 0)}–${fmt(b, 0)} Hz`).join(', ')} — notes here sound weak next to the peaks.`);
        extra.push(`<b>Flutter echo</b> risk between parallel bare surfaces: ${R.flutter.map((f) => `${f.n} (${fmt(f.rate, 0)} repeats/s)`).join(', ')}. Treat one surface of each pair.`);
        extra.push(`<b>Speaker–wall cancellation</b> with speakers ${L_(R.best.sd)} from the front wall: dip near ${fmtHz(P.sbirNull(R.best.sd))}.`);
        pf.appendChild(html(`<ul class="small" style="margin-top:10px">${extra.map((x) => `<li>${x}</li>`).join('')}</ul>`));

        /* problem modes: diagnosis & fixes, one card per mode */
        const pmc = el('div', { class: 'card', style: { marginTop: '14px' } }); out.appendChild(pmc);
        pmc.appendChild(html('<h3 style="margin-top:0">2 · Problem room modes — diagnosis & fixes</h3><p class="small">Each card is one problem mode: its standing-wave pattern at ear height (orange/blue = loud, pale = silent), what you will hear at the recommended seat, and the fixes in order. Build specs are calculated for that exact frequency.</p>'));
        const pg = el('div', { class: 'grid g2' }); pmc.appendChild(pg);
        R.top.slice(0, 4).forEach((c, idx) => {
          const m = c.modes.slice().sort((a, b) => (a.type === 'axial' ? -1 : 1))[0];
          const iB = R.modes.indexOf(m), Ta = R.after[iB] ? R.after[iB].T60 : m.T60;
          const atSeat = Math.abs(P.modeShape(m.n, [s.L, s.W, s.H], [R.best.x, s.W / 2, 1.2]));
          const atCentre = Math.abs(P.modeShape(m.n, [s.L, s.W, s.H], [s.L / 2, s.W / 2, 1.2]));
          const seatTxt = atSeat < 0.3 ? 'near a <b>null</b> — this note will sound weak' : atSeat > 0.75 ? 'near an <b>antinode</b> — this note will boom' : 'in between — moderate';
          // build specs
          const memD = (mat, t, mass) => { const fpl = P.plateF11(P.PANELS[mat], t, 0.6, 1.2); return fpl >= c.f * 0.95 ? 9 : Math.pow(50 / Math.sqrt(c.f * c.f - fpl * fpl), 2) / mass; };
          const mem = [['6 mm plywood', memD('plywood', 0.006, 3.6)], ['9 mm plywood', memD('plywood', 0.009, 5.4)], ['12.5 mm gypsum', memD('gypsum', 0.0125, 9.5)]].find(([, D]) => D <= 0.3) || ['12.5 mm gypsum', memD('gypsum', 0.0125, 9.5)];
          let slot = null; for (let sw = 2; sw <= 30; sw++) { const f = P.perforatedF0({ t: 0.018, slot: true, slotW: sw / 1000, open: P.slotOpenArea(sw / 1000, 0.07), D: 0.1 }); if (!slot || Math.abs(f - c.f) < Math.abs(slot[1] - c.f)) slot = [sw, f]; }
          const walls = m.n.map((n, k) => (n ? ['front/rear walls', 'side walls', 'floor/ceiling'][k] : '')).filter(Boolean).join(' + ');
          const fixes = [];
          if (atSeat < 0.3) fixes.push(`<b>Move the seat or speakers</b> off this null — absorption cannot fill a hole. Moving ${L_(Math.min(0.3, s.L * 0.06))} along the length changes it noticeably; multiple subs help in cinemas.`);
          else if (atSeat > 0.75) fixes.push(`<b>Shift the seat</b> slightly toward a quieter zone of this pattern (pale area on the map), staying symmetric across the width.`);
          fixes.push(`<b>Corner bass traps</b> (already in the plan): this mode peaks in all 8 corners.`);
          if (c.f < 110) fixes.push(`<b>Membrane trap tuned to ${fmtHz(c.f)}</b>: 600 × 1200 mm ${mem[0]} front over a sealed <b>${L_(mem[1])}</b> deep cavity (panel stiffness included), wool on the back, on the ${walls} near a corner.`);
          else fixes.push(`<b>Slotted Helmholtz panel tuned to ≈${fmtHz(slot[1])}</b>: 70 mm × 18 mm slats with <b>${L_(slot[0] / 1000)}</b> gaps over a 100 mm wool-filled cavity, on the ${walls}.`);
          if (atSeat >= 0.3) fixes.push(`<b>EQ cut</b> as a final touch: −3 to −6 dB at ${fmtHz(c.f)}, Q ≈ 4–8 — only after physical fixes, and never boost a null.`);
          const card = el('div', { class: 'card', style: { background: 'var(--panel2)' } }); pg.appendChild(card);
          card.appendChild(html(`<div class="row" style="justify-content:space-between"><b>#${idx + 1} · ${fmtHz(c.f)} ${V.NOTE ? '(' + V.NOTE(c.f) + ')' : ''}</b><span class="pill tag-${c.severity === 'high' ? 'bad' : c.severity === 'medium' ? 'warn' : 'good'}">${c.severity}</span></div><div class="small">Mode (${m.n.join(',')}) · ${m.type} · between the ${walls}${c.modes.length > 1 ? ' · stacked with ' + (c.modes.length - 1) + ' other mode(s)' : ''}</div>`));
          A.canvas(card, {
            height: 150, animate: true,
            draw(ctx, w, h, t) {
              const sc = Math.min((w - 20) / s.W, (h - 20) / s.L), ox = (w - s.W * sc) / 2, oy = 10;
              const lut = V.divergingLUT(), n = 24, nn = Math.round((24 * s.L) / s.W), osc = Math.cos(t * 2.5);
              for (let i = 0; i < n; i++) for (let j = 0; j < nn; j++) { const v = P.modeShape(m.n, [s.L, s.W, s.H], [((j + 0.5) / nn) * s.L, ((i + 0.5) / n) * s.W, 1.2]) * osc; const k = Math.round((v * 0.5 + 0.5) * 255) * 3; ctx.fillStyle = `rgb(${lut[k]},${lut[k + 1]},${lut[k + 2]})`; ctx.fillRect(ox + (i * s.W * sc) / n, oy + (j * s.L * sc) / nn, (s.W * sc) / n + 0.6, (s.L * sc) / nn + 0.6); }
              ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(ox, oy, s.W * sc, s.L * sc); ctx.lineWidth = 1;
              ctx.fillStyle = A.css('good'); ctx.beginPath(); ctx.arc(ox + (s.W / 2) * sc, oy + R.best.x * sc, 5, 0, 7); ctx.fill(); ctx.strokeStyle = A.css('text'); ctx.stroke();
            },
          });
          card.appendChild(html(`<div class="stats" style="grid-template-columns:repeat(3,1fr)">${A.statBox('At your seat', fmt(20 * Math.log10(atSeat + 1e-3), 0) + ' dB', 're loudest point')}${A.statBox('At room centre', fmt(20 * Math.log10(atCentre + 1e-3), 0) + ' dB')}${A.statBox('Rings for', fmt(m.T60, 2) + ' → ' + fmt(Ta, 2) + ' s', 'with plan', Ta < m.T60 * 0.7 ? 'good' : '')}</div><p class="small" style="margin:4px 0">At the recommended seat this mode is ${seatTxt}.</p><ol class="small" style="margin:0;padding-left:1.2em">${fixes.map((f) => `<li>${f}</li>`).join('')}</ol>`));
          const b = el('button', { class: 'small', style: { marginTop: '6px' } }, '▶ Hear ' + fmtHz(c.f)); b.onclick = () => A.audio.tone(c.f, 3, -14); card.appendChild(b);
        });

        /* zone map */
        const zm = el('div', { class: 'card', style: { marginTop: '14px' } }); out.appendChild(zm);
        zm.appendChild(html('<h3 style="margin-top:0">3 · Problem zones & where to sit</h3><p class="small">Map of how uneven the bass (30–150 Hz) will be at seated ear height. Blue = rough (big peaks and holes), orange = smooth. Dashed lines are null lines of the first length modes; corners are pressure maxima.</p>'));
        A.canvas(zm, {
          height: 380,
          draw(ctx, w, h) {
            const sc = Math.min((w - 160) / s.W, (h - 50) / s.L), ox = 60, oy = 26;
            const lut = V.divergingLUT();
            for (let i = 0; i < R.nx; i++) for (let j = 0; j < R.ny; j++) {
              const v = (R.grid[i * R.ny + j] - R.gmin) / (R.gmax - R.gmin + 1e-9), k = Math.round((1 - v) * 255) * 3;
              ctx.fillStyle = `rgb(${lut[k]},${lut[k + 1]},${lut[k + 2]})`;
              ctx.fillRect(ox + (j * s.W * sc) / R.ny, oy + (i * s.L * sc) / R.nx, (s.W * sc) / R.ny + 0.6, (s.L * sc) / R.nx + 0.6);
            }
            ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, s.W * sc, s.L * sc); ctx.lineWidth = 1;
            A.text(ctx, 'FRONT', ox + (s.W * sc) / 2, oy - 8, { align: 'center', size: 11, color: A.css('muted') });
            [[0.5, 'centre: null of odd length modes — avoid'], [0.25, '¼: null of 2nd mode'], [0.75, '¾: null of 2nd mode']].forEach(([k, t]) => { const y = oy + k * s.L * sc; ctx.setLineDash([5, 4]); ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + s.W * sc, y); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, t, ox + s.W * sc + 8, y + 4, { size: 10, color: A.css('muted') }); });
            const yr = oy + (s.L - 0.6) * sc; A.text(ctx, 'rear wall: bass build-up', ox + s.W * sc + 8, yr, { size: 10, color: A.css('muted') });
            R.spk.forEach((sp) => { ctx.fillStyle = A.css('accent2'); ctx.fillRect(ox + sp[1] * sc - 7, oy + sp[0] * sc - 7, 14, 14); });
            const bx = ox + (s.W / 2) * sc, by = oy + R.best.x * sc;
            ctx.fillStyle = A.css('good'); ctx.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 6 : 14, a = (k / 10) * Math.PI * 2 - Math.PI / 2; ctx.lineTo(bx + Math.cos(a) * r, by + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = A.css('text'); ctx.stroke();
            A.text(ctx, 'best seat ' + fmt((R.best.x / s.L) * 100, 0) + ' %', bx + 18, by + 4, { weight: 700, size: 12, bg: A.alpha(A.css('panel'), 0.85) });
            [[0, 0], [0, s.W], [s.L, 0], [s.L, s.W]].forEach(([x, y]) => { ctx.fillStyle = A.css('bad'); ctx.beginPath(); ctx.arc(ox + y * sc, oy + x * sc, 6, 0, 7); ctx.fill(); });
            A.text(ctx, `${L_(s.W)}`, ox + (s.W * sc) / 2, oy + s.L * sc + 16, { align: 'center', size: 10, color: A.css('muted') });
          },
        });
        zm.appendChild(A.legend([[A.css('good'), 'Recommended seat'], [A.css('accent2'), 'Speakers'], [A.css('bad'), 'Corners: pressure maxima (trap here)']]));

        /* treatment plan */
        const tp = el('div', { class: 'card', style: { marginTop: '14px' } }); out.appendChild(tp);
        tp.appendChild(html('<h3 style="margin-top:0">4 · Suggested treatment at the right spots</h3>'));
        const g = el('div', { class: 'grid', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)' } });
        if (innerWidth < 950) g.style.gridTemplateColumns = '1fr';
        tp.appendChild(g);
        const planBox = el('div'); g.appendChild(planBox);
        A.canvas(planBox, {
          height: 360,
          draw(ctx, w, h) {
            const sc = Math.min((w - 40) / s.W, (h - 40) / s.L), ox = (w - s.W * sc) / 2, oy = 22;
            ctx.fillStyle = A.css('bg2'); ctx.fillRect(ox, oy, s.W * sc, s.L * sc);
            ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, s.W * sc, s.L * sc); ctx.lineWidth = 1;
            A.text(ctx, 'FRONT', ox + (s.W * sc) / 2, oy - 7, { align: 'center', size: 10, color: A.css('muted') });
            R.items.forEach((it, n) => {
              const c = A.css(KCOL[it.kind]), px = ox + it.y * sc, py = oy + it.x * sc;
              ctx.fillStyle = c; ctx.strokeStyle = A.css('text');
              if (it.kind === 'corner') { const sx = it.y < s.W / 2 ? 1 : -1, sy = it.x < s.L / 2 ? 1 : -1, cx = it.y < s.W / 2 ? ox : ox + s.W * sc, cy = it.x < s.L / 2 ? oy : oy + s.L * sc; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + sx * 0.6 * sc, cy); ctx.lineTo(cx, cy + sy * 0.6 * sc); ctx.closePath(); ctx.fill(); ctx.stroke(); }
              else if (it.kind === 'cloud') { ctx.globalAlpha = 0.55; ctx.fillRect(px - 0.6 * sc, py - 0.9 * sc, 1.2 * sc, 1.8 * sc); ctx.globalAlpha = 1; ctx.setLineDash([4, 3]); ctx.strokeRect(px - 0.6 * sc, py - 0.9 * sc, 1.2 * sc, 1.8 * sc); ctx.setLineDash([]); }
              else { const along = it.x < 0.1 || it.x > s.L - 0.1, len = Math.max(0.5, Math.min(1.4, it.area / (it.z1 - it.z0))) * sc; const ww = along ? len : 9, hh = along ? 9 : len; ctx.fillRect(px - ww / 2, py - hh / 2, ww, hh); ctx.strokeRect(px - ww / 2, py - hh / 2, ww, hh); }
              const lx = it.kind === 'corner' ? (it.y < s.W / 2 ? ox + 0.25 * sc : ox + s.W * sc - 0.25 * sc) : px, ly = it.kind === 'corner' ? (it.x < s.L / 2 ? oy + 0.25 * sc : oy + s.L * sc - 0.25 * sc) : py;
              ctx.fillStyle = A.css('panel'); ctx.beginPath(); ctx.arc(lx, ly, 8, 0, 7); ctx.fill(); ctx.stroke();
              A.text(ctx, String(n + 1), lx, ly + 3.5, { align: 'center', size: 9, weight: 800 });
            });
            R.spk.forEach((sp) => { ctx.fillStyle = A.css('accent2'); ctx.fillRect(ox + sp[1] * sc - 6, oy + sp[0] * sc - 6, 12, 12); });
            ctx.fillStyle = A.css('good'); ctx.beginPath(); ctx.arc(ox + (s.W / 2) * sc, oy + R.best.x * sc, 7, 0, 7); ctx.fill();
          },
        });
        planBox.appendChild(A.legend(Object.entries({ corner: 'Corner bass trap', membrane: 'Membrane trap', helmholtz: 'Helmholtz trap', panel: 'Broadband panel', diffuser: 'Diffuser', cloud: 'Ceiling cloud' }).map(([k, v]) => [A.css(KCOL[k]), v])));
        const list = el('div', { class: 'table-wrap' }); g.appendChild(list);
        list.innerHTML = `<table><tr><th>#</th><th>Treatment</th><th>Where</th><th>Height</th><th>Why</th></tr>${R.items.map((it, n) => `<tr><td><b>${n + 1}</b></td><td><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--${KCOL[it.kind]});margin-right:6px"></span>${it.label}</td><td class="small">${L_(it.x)} from front, ${L_(it.y)} from left</td><td class="small">${L_(it.z0)}–${L_(it.z1)}</td><td class="small">${it.why}</td></tr>`).join('')}</table>`;
        tp.appendChild(html('<h4>Unfolded wall elevations</h4>'));
        tp.appendChild(html(`<div style="overflow-x:auto">${elevations(s, R)}</div>`));
        const btns = el('div', { class: 'row', style: { marginTop: '10px' } });
        const send = el('button', { class: 'primary' }, 'Open this design in the Treatment Simulator');
        send.onclick = () => {
          A.store.set('treat', { L: s.L, W: s.W, H: s.H, walls: s.cons, target: R.target, items: R.items.map(({ kind, x, y, z0, z1, area, f0 }) => ({ kind, x, y, z0, z1, area, f0 })), lx: R.best.x / s.L, ly: 0.5, lz: 1.2, sd: R.best.sd, spread: s.spread, sel: -1, view: 'problems', mode: 0 });
          A.go('#/treatment');
        };
        btns.append(send, html('<a class="btn" href="#/workshop">Build sheets with drawings →</a>'));
        tp.appendChild(btns);

        /* result */
        const rs = el('div', { class: 'card', style: { marginTop: '14px' } }); out.appendChild(rs);
        rs.appendChild(html('<h3 style="margin-top:0">5 · Predicted result</h3><p class="small">Bass at the listening position: untreated with the seat at the room centre (dashed) vs the recommended seat with this treatment (orange).</p>'));
        A.canvas(rs, {
          height: 260,
          draw(ctx, w, h) {
            const off = R.rB.filter((p) => p.f > 120).reduce((a, p) => a + p.db, 0) / R.rB.filter((p) => p.f > 120).length;
            const ax = A.axes(ctx, w, h, { x: { min: 20, max: 220, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 40, 50, 60, 80, 100, 150, 200] }, y: { min: -30, max: 20, label: 'dB' } });
            ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(3), ax.x1 - ax.x0, ax.Y(-3) - ax.Y(3));
            A.plotLine(ctx, ax, R.rB.map((p) => [p.f, p.db - off]), A.css('muted'), 1.6, [5, 4]);
            A.plotLine(ctx, ax, R.rA.map((p) => [p.f, p.db - off]), A.css('accent'), 2.6);
            R.top.forEach((c, i) => { if (c.f > 220) return; A.text(ctx, String(i + 1), ax.X(c.f), ax.y1 + 12, { align: 'center', size: 10, weight: 800, color: A.css('bad') }); });
          },
        });
        rs.appendChild(html('<div class="callout mentor">This is a prediction for an idealised rectangular room with rigid-ish walls. Real rooms (doors, windows, furniture, flexible walls) shift the details. Use it to plan and buy, then <a href="#/measure">measure</a> and fine-tune the seat and the tuned traps to the measured frequencies.</div>'));
      }
      run();
    },
  });
})();
