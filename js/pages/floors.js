/* Floating floors & vibration: floor designer (springs, pads, mats, timber), machine isolation. */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;

  function floor(body) {
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const st = A.controls(card, [
      { type: 'heading', label: 'System' },
      { key: 'sys', label: 'Floating system', type: 'select', value: 'concrete-mounts', options: [['concrete-mounts', 'Concrete slab on discrete mounts (springs or pads)'], ['screed-mat', 'Screed on continuous resilient layer'], ['timber-mounts', 'Timber floor on pads / pucks (sleepers)']] },
      { key: 'area', label: 'Floor area', type: 'range', min: 4, max: 120, step: 1, value: 20, unit: 'm²' },
      { key: 'conc', label: 'Concrete / screed thickness', type: 'range', min: 40, max: 250, step: 5, value: 100, unit: 'mm' },
      { key: 'ply', label: 'Timber deck (ply/OSB) total', type: 'range', min: 18, max: 80, step: 1, value: 40, unit: 'mm' },
      { key: 'gyp', label: 'Gypsum layers in timber deck', type: 'range', min: 0, max: 3, step: 1, value: 1 },
      { type: 'heading', label: 'Loads' },
      { key: 'walls', label: 'Inner walls + ceiling carried by the floor', type: 'range', min: 0, max: 8000, step: 50, value: 0, unit: 'kg' },
      { key: 'live', label: 'Live load share (people, gear)', type: 'range', min: 0, max: 200, step: 5, value: 40, unit: 'kg/m²' },
      { type: 'heading', label: 'Isolation' },
      { key: 'iso', label: 'Isolator type', type: 'select', value: 'spring-25', options: D.ISOLATORS.map((i) => [i.id, i.name]) },
      { key: 'n', label: 'Number of mounts', type: 'range', min: 4, max: 200, step: 1, value: 20 },
      { key: 'layer', label: 'Resilient layer (screed system)', type: 'select', value: 'mw-floor-20', options: D.RESILIENT_LAYERS.map((l) => [l.id, l.name]) },
      { key: 'gap', label: 'Air cavity depth', type: 'range', min: 10, max: 300, step: 5, value: 100, unit: 'mm' },
      { key: 'fillc', label: 'Cavity filled with low-density wool', type: 'check', value: true },
      { key: 'flow', label: 'Lowest frequency to isolate', type: 'range', min: 20, max: 125, step: 1, value: 40, unit: 'Hz' },
    ], () => upd());
    const stats = el('div', { class: 'stats' }); card.appendChild(stats);
    const warn = el('div'); card.appendChild(warn);
    let R = null;
    const g = el('div', { class: 'grid g2' }); body.appendChild(g);
    const c1 = el('div', { class: 'card' }), c2 = el('div', { class: 'card' }); g.append(c1, c2);
    c1.appendChild(html('<h3 style="margin-top:0">Isolation vs frequency</h3>'));
    const curve = A.canvas(c1, {
      height: 300,
      caption: 'Theoretical insertion loss (rigid base, 40·log) and a practical estimate (30·log, EN 12354-2 style). Real floors fall between, limited by flanking and base stiffness.',
      draw(ctx, w, h) {
        if (!R) return;
        const ax = A.axes(ctx, w, h, { x: { min: 2, max: 250, log: true, label: 'Frequency (Hz)', ticks: [2, 5, 10, 20, 31.5, 63, 125, 250], fmt: (v) => String(v) }, y: { min: -20, max: 60, label: 'Isolation (dB)' } });
        const th = [], pr = [];
        for (let f = 2; f <= 250; f *= 1.03) { th.push([f, P.insertionLossDB(f / R.fn, R.zeta)]); pr.push([f, f > R.fn * 1.41 ? Math.min(P.insertionLossDB(f / R.fn, R.zeta), 30 * Math.log10(f / R.fn) - 4.5) : P.insertionLossDB(f / R.fn, R.zeta)]); }
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(ax.x0, ax.Y(0)); ctx.lineTo(ax.x1, ax.Y(0)); ctx.stroke();
        A.plotLine(ctx, ax, th, A.alpha(A.css('accent'), 0.6), 1.5, [5, 4]);
        A.plotLine(ctx, ax, pr, A.css('accent'), 2.5);
        ctx.strokeStyle = A.css('accent2'); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ax.X(st.flow), ax.y1); ctx.lineTo(ax.X(st.flow), ax.y0); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'lowest freq.', ax.X(st.flow) + 4, ax.y1 + 14, { size: 11, color: A.css('accent2') });
        A.text(ctx, 'fn ' + fmtHz(R.fn), ax.X(R.fn), ax.Y(0) - 8, { align: 'center', size: 11, color: A.css('bad') });
      },
    });
    c2.appendChild(html('<h3 style="margin-top:0">Section</h3>'));
    const sect = A.canvas(c2, {
      height: 300, animate: true,
      draw(ctx, w, h, t) {
        if (!R) return;
        const base = h - 40, gapPx = Math.max(14, Math.min(70, st.gap * 0.35)), slab = st.sys === 'timber-mounts' ? 26 : Math.max(16, Math.min(60, st.conc * 0.3));
        const vib = Math.sin(t * 9) * 3, top = base - gapPx - slab;
        const T = P.transmissibility(30 / R.fn, R.zeta);
        ctx.fillStyle = A.css('muted'); ctx.fillRect(20, base + vib, w - 40, 22);
        A.text(ctx, 'structural slab (vibrating)', w / 2, base + 38, { align: 'center', size: 11, color: A.css('muted') });
        ctx.fillStyle = A.alpha(A.css('c4'), st.fillc ? 0.35 : 0.08); ctx.fillRect(34, top + slab, w - 68, gapPx + vib);
        const mv = vib * Math.min(1, T);
        if (st.sys === 'screed-mat') { ctx.fillStyle = A.alpha(A.css('accent2'), 0.6); ctx.fillRect(34, top + slab + mv, w - 68, gapPx + vib - mv); }
        else {
          const n = Math.min(8, Math.max(3, Math.round(Math.sqrt(st.n))));
          for (let i = 0; i < n; i++) {
            const x = 50 + (i * (w - 100)) / (n - 1);
            const iso = D.ISOLATORS.find((x2) => x2.id === st.iso);
            ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2; ctx.beginPath();
            const y0 = top + slab + mv, y1 = base + vib;
            if (iso.type === 'spring') { const k = 6; for (let j = 0; j <= k; j++) { const y = y0 + ((y1 - y0) * j) / k; ctx.lineTo(x + (j % 2 ? 7 : -7) * (j && j < k ? 1 : 0), y); } ctx.stroke(); }
            else { ctx.fillStyle = A.css('accent2'); ctx.fillRect(x - 9, y1 - Math.min(16, gapPx), 18, Math.min(16, gapPx)); if (st.sys === 'timber-mounts') { ctx.fillStyle = A.css('c3'); ctx.fillRect(x - 12, y0, 24, y1 - Math.min(16, gapPx) - y0); } }
            ctx.lineWidth = 1;
          }
        }
        ctx.fillStyle = A.css('accent'); ctx.fillRect(34, top + mv, w - 68, slab);
        A.text(ctx, st.sys === 'timber-mounts' ? 'floated timber deck' : st.sys === 'screed-mat' ? 'floating screed' : 'floated concrete slab', w / 2, top + mv + slab / 2 + 4, { align: 'center', color: A.css('accent-ink'), weight: 700, size: 12 });
        ctx.fillStyle = A.css('c4'); ctx.fillRect(20, top - 40, 14, slab + gapPx + 40); ctx.fillRect(w - 34, top - 40, 14, slab + gapPx + 40);
        A.text(ctx, 'perimeter isolation strip', 36, top - 44, { size: 10, color: A.css('muted') });
        A.text(ctx, `At 30 Hz the floated layer moves ${fmt(Math.min(T, 9) * 100, 0)} % as much as the structure`, 20, 18, { size: 12, weight: 700 });
      },
    });
    const dataCard = el('div', { class: 'card' }); body.appendChild(dataCard);
    function upd() {
      const area = st.area;
      let mDead;
      if (st.sys === 'timber-mounts') mDead = st.ply * 0.62 + st.gyp * 10 + 6; // ply ≈ 620 kg/m³, gypsum 10 kg/m² per layer, sleepers ≈ 6 kg/m²
      else mDead = (st.conc / 1000) * P.CONCRETE_RHO + (st.sys === 'concrete-mounts' ? 0 : 0);
      const mWalls = st.walls / area;
      const mPrime = mDead + mWalls + st.live;
      const M = mPrime * area;
      const sAir = P.airStiffness(st.gap / 1000, st.fillc); // MN/m³
      const fAir = P.floatingF0(sAir, mPrime);
      let fMount, zeta, util = null, defl = null, iso = null;
      if (st.sys === 'screed-mat') {
        const layer = D.RESILIENT_LAYERS.find((l) => l.id === st.layer);
        fMount = P.floatingF0(layer.s, mPrime); zeta = 0.08;
      } else {
        iso = D.ISOLATORS.find((x) => x.id === st.iso);
        const perMount = M / st.n; // kg
        util = perMount / iso.ratedLoad;
        const k = (iso.ratedLoad * P.G) / (iso.ratedDefl / 1000); // N/m per mount (linear)
        defl = (perMount * P.G) / k * 1000; // mm
        const fStatic = P.staticDeflectionFn(Math.max(defl, 0.05));
        fMount = iso.type === 'pad' ? fStatic * Math.sqrt(iso.dyn || 1.4) : fStatic;
        zeta = iso.zeta;
      }
      const fn = Math.sqrt(fMount * fMount + fAir * fAir);
      R = { fn, zeta, fMount, fAir, mPrime, M };
      const il = (f) => (f > fn * 1.41 ? Math.min(P.insertionLossDB(f / fn, zeta), 30 * Math.log10(f / fn) - 4.5) : P.insertionLossDB(f / fn, zeta));
      stats.innerHTML = A.statBox('Floated mass', fmt(mPrime, 0) + ' <small>kg/m²</small>', `total ${fmt(M / 1000, 2)} t`) +
        A.statBox(st.sys === 'screed-mat' ? 'Layer resonance' : 'Mount resonance', fmtHz(fMount), defl != null ? `static deflection ${fmt(defl, 1)} mm` : '') +
        A.statBox('Air-spring resonance', fmtHz(fAir), `cavity ${st.gap} mm${st.fillc ? ', filled' : ''}`, fAir > fMount ? 'warn' : '') +
        A.statBox('System fn', fmtHz(fn), `target ≤ ${fmtHz(st.flow / 3)}`, fn <= st.flow / 3 ? 'good' : fn <= st.flow / 2 ? 'warn' : 'bad') +
        A.statBox(`Isolation @ ${st.flow} Hz`, fmt(il(st.flow), 0) + ' dB', 'practical estimate') +
        A.statBox('Isolation @ 125 Hz', fmt(il(125), 0) + ' dB') +
        (util != null ? A.statBox('Mount loading', fmt(util * 100, 0) + ' %', `${fmt(M / st.n, 0)} kg per mount, rated ${iso.ratedLoad} kg`, util > 1.05 ? 'bad' : util < 0.5 ? 'warn' : 'good') : '') +
        (util != null ? A.statBox('Mount spacing', '≈ ' + fmt(Math.sqrt(area / st.n), 2) + ' m', 'grid') : '');
      const W = [];
      if (util != null && util > 1.05) W.push(['bad', `Mounts are overloaded (${fmt(util * 100, 0)} %). Use ${Math.ceil(M / (iso.ratedLoad * 0.85))} mounts or a higher-capacity type.`]);
      if (util != null && util < 0.5) W.push(['warn', `Mounts are under-loaded (${fmt(util * 100, 0)} %) — ${iso.type === 'pad' ? 'rubber pads are stiff when under-loaded' : 'springs deflect too little'}. Use ≈ ${Math.max(4, Math.round(M / (iso.ratedLoad * 0.8)))} mounts for ~80 % loading.`]);
      if (fAir > fMount * 1.2) W.push(['warn', `The trapped air dominates: f_air ${fmtHz(fAir)} vs mounts ${fmtHz(fMount)}. Deepen the cavity (try ${Math.round(Math.min(300, st.gap * Math.pow(fAir / Math.max(fMount, 1), 2) / 2))} mm), fill it with low-density wool, or add mass.`]);
      if (fn > st.flow / 2) W.push(['bad', `System fn ${fmtHz(fn)} is too close to ${st.flow} Hz — little or no isolation (possibly amplification) at the lowest notes. Lower fn with softer mounts, more mass or deeper cavity.`]);
      if (st.sys === 'timber-mounts' && st.flow < 50) W.push(['warn', 'Light timber floors rarely reach the fn needed for drums/bass below 50 Hz. Add mass (extra gypsum/cement-board layers) or use concrete.']);
      if (mPrime > 300) W.push(['info', `Adds about ${fmt(mPrime, 0)} kg/m² to the structure. Have a structural engineer confirm capacity.`]);
      W.push(['info', 'Perimeter: continuous resilient strip and flexible sealant on every edge; no rigid fixings, tiles or mortar bridging to walls.']);
      warn.innerHTML = W.map(([l, t]) => `<div class="callout ${l === 'bad' || l === 'warn' ? 'warn' : 'data'}" style="${l === 'bad' ? 'border-color:var(--bad)' : ''}">${t}</div>`).join('');
      dataCard.innerHTML = `<h3 style="margin-top:0">Design summary</h3><div class="table-wrap"><table>
        <tr><td>Dead load</td><td class="num">${fmt(mDead, 0)} kg/m²</td></tr><tr><td>Inner walls/ceiling</td><td class="num">${fmt(mWalls, 0)} kg/m²</td></tr><tr><td>Live load share</td><td class="num">${st.live} kg/m²</td></tr>
        <tr><td>Air-layer dynamic stiffness</td><td class="num">${fmt(sAir, 2)} MN/m³</td></tr>
        <tr><td>Combined natural frequency</td><td class="num">√(${fmt(fMount, 1)}² + ${fmt(fAir, 1)}²) = ${fmt(fn, 1)} Hz</td></tr>
        ${[31.5, 63, 125, 250].map((f) => `<tr><td>Practical isolation at ${f} Hz</td><td class="num">${fmt(il(f), 0)} dB</td></tr>`).join('')}
      </table></div>`;
      curve.redraw();
    }
    upd();
  }

  function machine(body) {
    body.appendChild(html('<p class="muted">Isolate a fan, pump, compressor, washing machine or HVAC unit. Forcing frequency = rpm / 60.</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const st = A.controls(card, [
      { key: 'mass', label: 'Machine mass (incl. base)', type: 'range', min: 10, max: 5000, step: 10, value: 300, unit: 'kg' },
      { key: 'rpm', label: 'Lowest running speed', type: 'range', min: 300, max: 3600, step: 10, value: 1450, unit: 'rpm' },
      { key: 'n', label: 'Number of mounts', type: 'range', min: 3, max: 12, step: 1, value: 4 },
      { key: 'eff', label: 'Required isolation efficiency', type: 'range', min: 70, max: 99, step: 1, value: 90, unit: '%' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); card.appendChild(out);
    const adv = el('div'); card.appendChild(adv);
    function upd() {
      const ff = st.rpm / 60;
      const r = P.requiredDeflection(ff, st.eff);
      const kEach = ((st.mass / st.n) * P.G) / (r.deflMM / 1000);
      out.innerHTML = A.statBox('Forcing frequency', fmtHz(ff)) + A.statBox('Required fn', fmtHz(r.fn)) + A.statBox('Static deflection', fmt(r.deflMM, 1) + ' mm') + A.statBox('Load per mount', fmt(st.mass / st.n, 0) + ' kg') + A.statBox('Stiffness per mount', fmt(kEach / 1000, 1) + ' kN/m');
      const type = r.deflMM < 4 ? 'Neoprene/rubber pads are sufficient.' : r.deflMM < 12 ? 'Use neoprene-in-shear mounts or microcellular PU bearings.' : 'Use steel springs (with a neoprene pad under each for high frequencies); consider an inertia base for stability.';
      adv.innerHTML = `<div class="callout mentor">${type} Always add flexible connectors to every pipe, duct and cable, and check that nothing rigid bridges the machine to the structure.</div>`;
    }
    upd();
  }

  A.register('floors', {
    title: 'Floating Floors & Vibration',
    render(root, params) {
      A.pageHead(root, 'Design', 'Floating Floors & Vibration', 'Design floated floors on springs, pads and resilient mats — including the air-spring effect most DIY guides forget — and isolate machinery. Read Academy chapters 12–13 for the theory.');
      const tabs = [['floor', 'Floating floor designer'], ['machine', 'Machine isolation'], ['theory', 'Transmissibility explorer'], ['how', 'Construction methods']];
      A.tabs(root, tabs, (id, body) => {
        if (id === 'floor') floor(body);
        if (id === 'machine') machine(body);
        if (id === 'theory') { const c = el('div', { class: 'card' }); body.appendChild(c); V.transmissibility(c); }
        if (id === 'how') {
          const L = LESSONS.find((l) => l.id === 'floating');
          L.sections.forEach((s) => { body.appendChild(html(`<h2>${s.h}</h2>`)); const d = el('div'); d.innerHTML = s.html; body.appendChild(d); });
          body.appendChild(html('<p><a class="btn" href="#/workshop/floated-floor">Workshop: floated timber floor →</a></p>'));
        }
      }, tabs.find((t) => t[0] === params[0]) ? params[0] : 'floor');
    },
  });
})();
