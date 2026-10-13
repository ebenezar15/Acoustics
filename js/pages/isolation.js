/* Soundproofing: wall builder (Sharp model + bridging), STC / Rw, composite partitions,
   neighbour-noise planner and assembly library. */
(function () {
  'use strict';
  const { el, html, fmt } = A;
  const MATS = Object.entries(P.PANELS).map(([k, v]) => [k, v.name]);
  const THICK = { gypsum: 12.5, gypsumX: 15.9, fibreGyp: 12.5, plywood: 18, osb: 18, mdf: 18, cementBoard: 12, glass: 6, lamGlass: 8.8, concrete: 150, cmu: 190, brick: 110, steel: 2, mlv: 2.5, timber: 22 };
  const OCT = [63, 125, 250, 500, 1000, 2000, 4000];
  const thirdsOf = (f) => [f / Math.pow(2, 1 / 3), f, f * Math.pow(2, 1 / 3)];

  /** model object → TL function of frequency */
  function model(w) {
    const a = P.leafProps(w.a, w.damping);
    if (!w.b || !w.b.length) return { tl: (f) => P.singleLeafTL(a, f), a, b: null };
    const b = P.leafProps(w.b, w.damping);
    return { tl: (f) => P.doubleLeafTL({ leaf1: a, leaf2: b, d: w.d, filled: w.filled, conn: w.conn, damping: w.damping }, f).tl, a, b, f0: P.doubleLeafTL({ leaf1: a, leaf2: b, d: w.d, filled: w.filled, conn: w.conn }, 100).f0 };
  }
  function ratings(tlf) {
    const stc = P.stc(P.STC_BANDS.map((f) => tlf(P.exactThird(f))));
    const rw = P.rw(P.RW_BANDS.map((f) => tlf(P.exactThird(f))));
    return { stc, ...rw };
  }
  const octTL = (tlf, f) => -10 * Math.log10(thirdsOf(f).reduce((s, x) => s + Math.pow(10, -tlf(x) / 10), 0) / 3);

  /* ---------------- wall builder ---------------- */
  let current = null; // shared with other tabs
  function builder(body) {
    const saved = A.store.get('wall', null);
    const w = saved || { a: [{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }], b: [{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }], d: 0.15, filled: true, conn: 'clips', damping: false, double: true };
    current = w;
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const top = el('div', { class: 'row' });
    const preset = el('select');
    preset.appendChild(el('option', { value: '' }, 'Load a preset…'));
    D.WALLS.forEach((p) => preset.appendChild(el('option', { value: p.id }, p.name)));
    preset.onchange = () => { const p = D.WALLS.find((x) => x.id === preset.value); if (!p) return; Object.assign(w, JSON.parse(JSON.stringify(p)), { double: true }); renderLeaves(); upd(); };
    top.appendChild(preset);
    card.appendChild(top);
    const leaves = el('div', { class: 'grid g2', style: { marginTop: '12px' } });
    card.appendChild(leaves);
    function leafEditor(key, title) {
      const box = el('div', { class: 'card', style: { background: 'var(--panel2)' } });
      box.appendChild(html(`<h4 style="margin-top:0">${title}</h4>`));
      const list = el('div'); box.appendChild(list);
      const draw = () => {
        list.innerHTML = '';
        w[key].forEach((L, i) => {
          const r = el('div', { class: 'row', style: { marginBottom: '6px' } });
          const s = el('select', { style: { flex: '1', minWidth: '150px' } }); MATS.forEach(([v, l]) => s.appendChild(el('option', { value: v }, l))); s.value = L.mat;
          const t = el('input', { type: 'number', value: +(L.t * 1000).toFixed(1), step: 0.5, style: { width: '80px' } });
          const x = el('button', { class: 'small ghost' }, '✕');
          s.onchange = () => { L.mat = s.value; L.t = THICK[s.value] / 1000; t.value = THICK[s.value]; upd(); };
          t.oninput = () => { L.t = Math.max(0.5, parseFloat(t.value) || 1) / 1000; upd(); };
          x.onclick = () => { w[key].splice(i, 1); if (!w[key].length && key === 'a') w.a.push({ mat: 'gypsum', t: 0.0125 }); draw(); upd(); };
          r.append(s, t, el('span', { class: 'small' }, 'mm'), x);
          list.appendChild(r);
        });
      };
      const add = el('button', { class: 'small' }, '+ layer');
      add.onclick = () => { w[key].push({ mat: 'gypsumX', t: 0.0159 }); draw(); upd(); };
      box.appendChild(add);
      draw();
      return box;
    }
    function renderLeaves() { leaves.innerHTML = ''; leaves.appendChild(leafEditor('a', 'Leaf 1 (source side)')); if (w.double) leaves.appendChild(leafEditor('b', 'Leaf 2 (receiving side)')); }
    renderLeaves();
    const st = A.controls(card, [
      { key: 'double', label: 'Double-leaf construction', type: 'check', value: w.double !== false },
      { key: 'd', label: 'Cavity depth', type: 'range', min: 25, max: 500, step: 5, value: w.d * 1000, unit: 'mm' },
      { key: 'filled', label: 'Cavity insulation', type: 'check', value: w.filled },
      { key: 'conn', label: 'Connection between leaves', type: 'select', value: w.conn, options: Object.entries(P.CONNECTIONS).map(([k, v]) => [k, v.name]) },
      { key: 'damping', label: 'Damping compound between layers', type: 'check', value: !!w.damping },
    ], (v) => {
      const wasDouble = w.double;
      Object.assign(w, { double: v.double, d: v.d / 1000, filled: v.filled, conn: v.conn, damping: v.damping });
      if (w.double && (!w.b || !w.b.length)) w.b = [{ mat: 'gypsumX', t: 0.0159 }];
      if (wasDouble !== w.double) renderLeaves();
      upd();
    });
    const stats = el('div', { class: 'stats' }); card.appendChild(stats);
    const cv = A.canvas(card, {
      height: 330,
      caption: 'Third-octave transmission loss (Sharp model for single and double leaves, with an empirical structural-bridge path). Dashed: mass law for the total mass. Grey dotted: STC contour fitted to the curve. Expect field results 3–7 dB lower.',
      draw(ctx, wd, h) {
        const M = model(eff());
        const mTot = M.a.m + (M.b ? M.b.m : 0);
        const ax = A.axes(ctx, wd, h, { x: { min: 50, max: 5000, log: true, label: 'Frequency (Hz)', ticks: P.THIRDS.filter((f, i) => i % 3 === 1), fmt: A.shortHz }, y: { min: 0, max: 100, label: 'TL (dB)' } });
        const pts = P.THIRDS.map((f) => [f, M.tl(P.exactThird(f))]);
        A.plotLine(ctx, ax, P.THIRDS.map((f) => [f, P.massLaw(mTot, f)]), A.css('muted'), 1.3, [6, 4]);
        A.plotFill(ctx, ax, pts, A.alpha(A.css('accent'), 0.12), 0);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.5);
        pts.forEach(([f, v]) => { ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.arc(ax.X(f), ax.Y(v), 2.5, 0, 7); ctx.fill(); });
        const r = ratings(M.tl);
        A.plotLine(ctx, ax, P.STC_BANDS.map((f, i) => [f, r.stc + P.STC_CONTOUR[i]]), A.css('text'), 1, [2, 3]);
        if (M.f0 && M.f0 > 50) { A.text(ctx, 'f₀ ' + A.fmtHz(M.f0), ax.X(M.f0), ax.y0 - 8, { align: 'center', size: 11, color: A.css('bad') }); }
      },
    });
    function eff() { return w.double ? w : { a: w.a, b: null, damping: w.damping }; }
    function upd() {
      A.store.set('wall', w);
      const M = model(eff()), r = ratings(M.tl);
      const mTot = M.a.m + (M.b ? M.b.m : 0);
      stats.innerHTML = A.statBox('STC (lab est.)', r.stc, P.stcDescribe(r.stc)) + A.statBox('Rw (C; Ctr)', `${r.Rw} <small>(${r.C}; ${r.Ctr})</small>`, 'Rw + Ctr for bass-heavy noise: ' + (r.Rw + r.Ctr)) +
        A.statBox('Field estimate', `≈ ${r.stc - 5}`, 'FSTC / DnT,w typically 3–7 lower') + A.statBox('Total mass', fmt(mTot, 1) + ' kg/m²') +
        (M.f0 ? A.statBox('Mass–air–mass f₀', A.fmtHz(M.f0), M.f0 > 80 ? 'High: deepen cavity or add mass' : 'Good — keep below ~50–60 Hz') : '') +
        A.statBox('TL @ 63 Hz', fmt(octTL(M.tl, 63), 0) + ' dB', 'what the kick drum sees');
      cv.redraw();
    }
    upd();
    body.appendChild(html(`<div class="callout warn">Every number assumes perfect workmanship: sealed perimeters, no rigid bridges, no back-to-back outlets, independent framing where specified. One screw into a stud through a clip system, or a 3 mm gap at the floor, will cost more than the second layer of drywall gained.</div>`));
  }

  /* ---------------- composite ---------------- */
  function composite(body) {
    body.appendChild(html('<p class="muted">A partition is only as good as its weakest element. Add the elements of one wall (area and rating) and see the combined result.</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const M = current ? model(current.double === false ? { a: current.a } : current) : null;
    const wallSTC = M ? ratings(M.tl).stc : 55;
    const els = A.store.get('composite', null) || [{ name: 'Wall (from builder)', area: 10, stc: wallSTC }, { name: 'Solid-core door + full seals + drop seal', area: 1.9, stc: 32 }];
    els[0].stc = wallSTC;
    const list = el('div'); card.appendChild(list);
    const addRow = el('div', { class: 'row', style: { marginTop: '8px' } });
    const sel = el('select'); D.ELEMENTS.forEach((e) => sel.appendChild(el('option', { value: e.id }, `${e.name} (STC ${e.stc})`)));
    const area = el('input', { type: 'number', value: 1.9, step: 0.01, style: { width: '90px' } });
    const add = el('button', { class: 'primary small' }, '+ Add element');
    add.onclick = () => { const e = D.ELEMENTS.find((x) => x.id === sel.value); els.push({ name: e.name, area: parseFloat(area.value) || 0.1, stc: e.stc }); draw(); };
    addRow.append(sel, area, el('span', { class: 'small' }, 'm²'), add);
    card.appendChild(addRow);
    const res = el('div', { class: 'stats' }); card.appendChild(res);
    function draw() {
      A.store.set('composite', els);
      list.innerHTML = `<div class="table-wrap"><table><tr><th>Element</th><th class="num">Area m²</th><th class="num">STC</th><th class="num">Share of energy</th><th></th></tr>${(() => {
        const tau = els.map((e) => e.area * Math.pow(10, -e.stc / 10)); const T = tau.reduce((a, b) => a + b, 0);
        return els.map((e, i) => `<tr><td>${e.name}</td><td class="num"><input data-i="${i}" data-k="area" type="number" step="0.01" value="${e.area}" style="width:80px"></td><td class="num"><input data-i="${i}" data-k="stc" type="number" value="${e.stc}" style="width:64px"></td><td class="num">${fmt((tau[i] / T) * 100, 1)} %</td><td>${i ? `<button class="small ghost" data-del="${i}">✕</button>` : ''}</td></tr>`).join('');
      })()}</table></div>`;
      const c = P.compositeTL(els.map((e) => ({ area: e.area, tl: e.stc })));
      res.innerHTML = A.statBox('Composite rating', fmt(c, 1), P.stcDescribe(c)) + A.statBox('Loss vs best element', fmt(Math.max(...els.map((e) => e.stc)) - c, 1) + ' dB', '', Math.max(...els.map((e) => e.stc)) - c > 6 ? 'bad' : 'good');
    }
    list.addEventListener('input', (e) => { const i = e.target.dataset.i; if (i == null) return; els[+i][e.target.dataset.k] = parseFloat(e.target.value) || 0; const c = P.compositeTL(els.map((x) => ({ area: x.area, tl: x.stc }))); res.innerHTML = A.statBox('Composite rating', fmt(c, 1), P.stcDescribe(c)); A.store.set('composite', els); });
    list.addEventListener('change', () => draw());
    list.addEventListener('click', (e) => { const d = e.target.dataset.del; if (d) { els.splice(+d, 1); draw(); } });
    draw();
  }

  /* ---------------- neighbour planner ---------------- */
  function planner(body) {
    body.appendChild(html('<p class="muted">The professional calculation, octave by octave: source level − transmission loss + 10·log(S/A₂) = level in the neighbour’s room. Compare it with their background noise and a criterion curve.</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const st = A.controls(card, [
      { key: 'src', label: 'Noise source', type: 'select', value: 'drums', options: D.SOURCES.map((s) => [s.id, s.name]) },
      { key: 'wall', label: 'Separating construction', type: 'select', value: 'builder', options: [['builder', 'My wall from the builder']].concat(D.WALLS.map((w) => [w.id, w.name])).concat([['c150', '150 mm concrete'], ['c250', '250 mm concrete']]) },
      { key: 'S', label: 'Shared wall area', type: 'range', min: 4, max: 40, step: 0.5, value: 10, unit: 'm²' },
      { key: 'V2', label: 'Neighbour room volume', type: 'range', min: 15, max: 150, step: 1, value: 40, unit: 'm³' },
      { key: 'T2', label: 'Neighbour room RT', type: 'range', min: 0.2, max: 1.2, step: 0.05, value: 0.5, unit: 's' },
      { key: 'crit', label: 'Target criterion', type: 'select', value: 25, numeric: true, options: [[15, 'NR/NC 15 (studio next door)'], [20, 'NC 20 (bedroom at night, strict)'], [25, 'NC 25 (bedroom)'], [30, 'NC 30 (living room)'], [35, 'NC 35 (office)']] },
      { key: 'bg', label: 'Neighbour background (quiet night)', type: 'select', value: 'quiet', options: [['vquiet', 'Very quiet rural night'], ['quiet', 'Quiet suburban night'], ['urban', 'Urban, some traffic']] },
    ], () => upd());
    const BG = { vquiet: [35, 28, 20, 14, 10, 8, 6, 5], quiet: [42, 35, 28, 22, 18, 14, 11, 9], urban: [55, 48, 42, 37, 33, 29, 24, 20] };
    const out = el('div', { class: 'stats' }); card.appendChild(out);
    const verdict = el('div'); card.appendChild(verdict);
    let rows = null;
    const cv = V.ncPlot(card, () => (rows ? [rows.L2, rows.bg] : [[0, 0, 0, 0, 0, 0, 0, 0]]), { height: 320, caption: 'Orange: predicted level in the neighbour’s room. Blue: their background noise. Grey: NC curves. Where orange is below blue, your noise is masked.' });
    card.appendChild(A.legend([[A.series(0), 'Your noise next door'], [A.series(1), 'Their background']]));
    const tbl = el('div'); card.appendChild(tbl);
    function tlfn() {
      if (st.wall === 'builder') { const w = current || A.store.get('wall', null) || D.WALLS[6]; return model(w.double === false ? { a: w.a } : w).tl; }
      if (st.wall === 'c150') return model({ a: [{ mat: 'concrete', t: 0.15 }] }).tl;
      if (st.wall === 'c250') return model({ a: [{ mat: 'concrete', t: 0.25 }] }).tl;
      return model(D.WALLS.find((w) => w.id === st.wall)).tl;
    }
    function upd() {
      const src = D.SOURCES.find((s) => s.id === st.src).oct;
      const tlf = tlfn();
      const A2 = (0.161 * st.V2) / st.T2;
      const tl = P.OCT.map((f) => octTL(tlf, f));
      const L2 = src.map((L, i) => L - tl[i] + 10 * Math.log10(st.S / A2));
      const bg = BG[st.bg];
      const crit = P.NC_CURVES[st.crit] || P.nrCurve(st.crit);
      const req = src.map((L, i) => L + 10 * Math.log10(st.S / A2) - Math.min(crit[i], bg[i] + 0));
      rows = { L2, bg };
      const nc = P.ncRating(L2);
      const audibleBands = P.OCT.filter((f, i) => L2[i] > bg[i]);
      out.innerHTML = A.statBox('Source', fmt(P.dBA(src), 0) + ' dBA') + A.statBox('Next door', fmt(P.dBA(L2), 0) + ' dBA', 'NC-' + nc, nc > st.crit ? 'bad' : 'good') + A.statBox('Their background', fmt(P.dBA(bg), 0) + ' dBA') + A.statBox('Audible bands', audibleBands.length ? audibleBands.map(A.shortHz).join(', ') : 'none', audibleBands.length ? 'above background' : 'masked', audibleBands.length ? 'warn' : 'good');
      const short = P.OCT.map((f, i) => req[i] - tl[i]);
      const worst = Math.max(...short);
      verdict.innerHTML = worst <= 0 ? `<div class="callout data"><b>Meets the target in every octave.</b> Mind flanking paths and workmanship — field results are usually 3–7 dB worse.</div>`
        : `<div class="callout warn"><b>Falls short by up to ${fmt(worst, 0)} dB</b> (worst at ${A.shortHz(P.OCT[short.indexOf(worst)])} Hz). ${P.OCT[short.indexOf(worst)] <= 125 ? 'The deficit is in the bass: add mass and decoupling (independent leaves, deeper cavity), and consider a floating floor for drums/subs.' : 'Add mass, damping and better decoupling, and check doors/windows in the composite tab.'}</div>`;
      // suggestions: presets that meet
      const okWalls = D.WALLS.map((w) => { const f = model(w).tl; const t = P.OCT.map((x) => octTL(f, x)); return { w, ok: req.every((r, i) => t[i] >= r), margin: Math.min(...req.map((r, i) => t[i] - r)) }; }).sort((a, b) => b.margin - a.margin);
      tbl.innerHTML = `<div class="table-wrap" style="margin-top:12px"><table><tr><th>Octave</th>${P.OCT.map((f) => `<th class="num">${A.shortHz(f)}</th>`).join('')}</tr>
        <tr><td>Source L₁</td>${src.map((x) => `<td class="num">${fmt(x, 0)}</td>`).join('')}</tr>
        <tr><td>Wall TL</td>${tl.map((x) => `<td class="num">${fmt(x, 0)}</td>`).join('')}</tr>
        <tr><td>Required TL</td>${req.map((x, i) => `<td class="num ${tl[i] >= x ? 'good' : 'bad'}">${fmt(x, 0)}</td>`).join('')}</tr>
        <tr><td>Next door L₂</td>${L2.map((x) => `<td class="num">${fmt(x, 0)}</td>`).join('')}</tr></table></div>
        <h4>Constructions from the library, best margin first</h4><ul>${okWalls.slice(0, 5).map((o) => `<li>${o.w.name}: ${o.ok ? '<span class="good">meets target</span>' : `<span class="bad">short by ${fmt(-o.margin, 0)} dB</span>`}</li>`).join('')}</ul>`;
      cv.redraw();
    }
    upd();
  }

  /* ---------------- library ---------------- */
  function library(body) {
    body.appendChild(html('<p class="muted">Predicted ratings for common constructions (this app’s model, calibrated against typical published laboratory results). Real products and workmanship vary — use manufacturers’ tested data for final design.</p>'));
    const rows = D.WALLS.map((w) => { const M = model(w); const r = ratings(M.tl); return { w, r, m: M.a.m + M.b.m, t63: octTL(M.tl, 63), t125: octTL(M.tl, 125) }; });
    body.appendChild(html(`<div class="table-wrap"><table><tr><th>Construction</th><th class="num">kg/m²</th><th class="num">Cavity</th><th class="num">STC</th><th class="num">Rw (C;Ctr)</th><th class="num">TL 63 Hz</th><th class="num">TL 125 Hz</th></tr>${rows.map((x) => `<tr><td>${x.w.name}</td><td class="num">${fmt(x.m, 0)}</td><td class="num">${fmt(x.w.d * 1000, 0)} mm</td><td class="num"><b>${x.r.stc}</b></td><td class="num">${x.r.Rw} (${x.r.C};${x.r.Ctr})</td><td class="num">${fmt(x.t63, 0)}</td><td class="num">${fmt(x.t125, 0)}</td></tr>`).join('')}</table></div>`));
    body.appendChild(html(`<h3>Typical isolation targets</h3><div class="table-wrap"><table>${D.ISOLATION_TARGETS.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div>`));
    body.appendChild(html(`<h3>Doors, windows & weak points</h3><div class="table-wrap"><table><tr><th>Element</th><th class="num">Typical STC</th></tr>${D.ELEMENTS.map((e) => `<tr><td>${e.name}</td><td class="num">${e.stc}</td></tr>`).join('')}</table></div>`));
    body.appendChild(html(`<div class="callout alt"><b>Ways to the same result.</b> High isolation can come from mass (concrete, masonry — simple, heavy, structurally demanding), from decoupled lightweight leaves (double stud — light, deep, sensitive to workmanship), or from a hybrid (masonry + independent lining). Choose by available depth, floor loading, budget and the frequencies you must stop.</div>`));
  }

  A.register('isolation', {
    title: 'Soundproofing',
    render(root, params) {
      A.pageHead(root, 'Design', 'Soundproofing Studio', 'Design walls layer by layer, check the weak links, and calculate whether your neighbours will hear you — octave by octave, the way acoustic consultants do it.');
      const tabs = [['builder', 'Wall builder'], ['planner', 'Neighbour noise planner'], ['composite', 'Doors, windows & gaps'], ['library', 'Assembly library'], ['visual', 'Hear & see dB']];
      A.tabs(root, tabs, (id, body) => {
        if (id === 'builder') builder(body);
        if (id === 'composite') composite(body);
        if (id === 'planner') { if (!current) current = A.store.get('wall', null); planner(body); }
        if (id === 'library') library(body);
        if (id === 'visual') { const c = el('div', { class: 'card' }); body.appendChild(c); V.dbThroughWall(c); body.appendChild(html('<p><a class="btn primary" href="#/hear">Listen through different walls →</a></p>')); }
      }, tabs.find((t) => t[0] === params[0]) ? params[0] : 'builder');
    },
  });
})();
