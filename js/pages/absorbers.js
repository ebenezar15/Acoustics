/* Absorber Designer: porous, membrane, perforated, slotted, single resonator — with
   predicted α(f), design targeting, and a build sheet. */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz, fmtLen } = A;

  function alphaPlot(host, curves, opts = {}) {
    return A.canvas(host, {
      height: 300,
      caption: opts.caption,
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 31.5, max: 5000, log: true, label: 'Frequency (Hz)', ticks: [31.5, 63, 125, 250, 500, 1000, 2000, 4000], fmt: A.shortHz }, y: { min: 0, max: 1.05, label: 'Absorption coefficient α', ticks: [0, 0.2, 0.4, 0.6, 0.8, 1] } });
        const cs = curves();
        cs.forEach((c, i) => {
          const pts = []; for (let f = 31.5; f <= 5000; f *= 1.025) pts.push([f, c.fn(f)]);
          if (i === 0) A.plotFill(ctx, ax, pts, A.alpha(A.css('accent'), 0.12), 0);
          A.plotLine(ctx, ax, pts, c.color || A.series(i), i === 0 ? 2.5 : 1.5, c.dash);
        });
        if (opts.marker) { const f = opts.marker(); if (f > 31.5 && f < 5000) { ctx.strokeStyle = A.css('accent2'); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ax.X(f), ax.y1); ctx.lineTo(ax.X(f), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'f₀ ' + fmtHz(f), ax.X(f) + 4, ax.y1 + 14, { size: 11, color: A.css('accent2') }); } }
      },
    });
  }
  function bandTable(fn) {
    const b = [63, 125, 250, 500, 1000, 2000, 4000];
    const a = b.map(fn);
    const nrc = Math.round(((fn(250) + fn(500) + fn(1000) + fn(2000)) / 4) * 20) / 20;
    return `<div class="table-wrap"><table><tr><th>Band</th>${b.map((f) => `<th class="num">${A.shortHz(f)}</th>`).join('')}<th class="num">NRC</th></tr><tr><td>α (random)</td>${a.map((x) => `<td class="num">${fmt(x, 2)}</td>`).join('')}<td class="num"><b>${fmt(nrc, 2)}</b></td></tr></table></div>`;
  }

  /* ---------------- porous ---------------- */
  function porous(body) {
    body.appendChild(html('<p class="muted">Broadband panels, clouds and bass traps. Prediction uses the Miki model for the porous layer with an air-gap transfer matrix, averaged over random incidence. Real results also depend on panel size, edges and fabric.</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const st = A.controls(card, [
      { key: 'mat', label: 'Material', type: 'select', value: 'rockwool-40', options: D.POROUS.map((m) => [m.id, m.name]) },
      { key: 'd', label: 'Thickness', type: 'range', min: 25, max: 400, step: 5, value: 100, unit: 'mm' },
      { key: 'gap', label: 'Air gap behind', type: 'range', min: 0, max: 400, step: 5, value: 100, unit: 'mm' },
      { key: 'w', label: 'Panel width', type: 'range', min: 0.3, max: 1.2, step: 0.05, value: 0.6, unit: 'm' },
      { key: 'h', label: 'Panel height', type: 'range', min: 0.3, max: 2.4, step: 0.05, value: 1.2, unit: 'm' },
      { key: 'n', label: 'Quantity', type: 'range', min: 1, max: 30, step: 1, value: 4 },
    ], () => upd());
    const sig = () => D.POROUS.find((m) => m.id === st.mat).sigma;
    const cv = alphaPlot(card, () => [
      { fn: (f) => P.porousAlpha(f, sig(), st.d / 1000, st.gap / 1000) },
      { fn: (f) => P.porousAlpha(f, sig(), st.d / 1000, 0), dash: [5, 4], color: A.css('muted') },
      { fn: (f) => P.porousAlpha(f, sig(), st.d / 1000, st.gap / 1000, false), dash: [2, 3], color: A.css('accent2') },
    ], { caption: 'Solid: your design. Dashed: same panel without air gap. Dotted: normal incidence (sound hitting head-on).' });
    card.appendChild(A.legend([[A.css('accent'), 'Your design (random incidence)'], [A.css('muted'), 'Without air gap', true], [A.css('accent2'), 'Normal incidence', true]]));
    const out = el('div'); card.appendChild(out);
    // target finder
    const tf = el('div', { class: 'card' }); body.appendChild(tf);
    tf.appendChild(html('<h3 style="margin-top:0">Reverse design: what depth do I need?</h3><p class="small">Pick the lowest frequency you need to absorb strongly (α ≥ 0.8). The finder searches thickness + gap combinations for the chosen material.</p>'));
    const tst = A.controls(tf, [{ key: 'f', label: 'Target frequency', type: 'select', value: 125, numeric: true, options: [[63, '63 Hz'], [80, '80 Hz'], [100, '100 Hz'], [125, '125 Hz'], [160, '160 Hz'], [250, '250 Hz'], [500, '500 Hz']] }], () => find());
    const fo = el('div'); tf.appendChild(fo);
    function find() {
      const res = [];
      for (let d = 25; d <= 400; d += 25) for (let g = 0; g <= 400; g += 25) {
        const a = P.porousAlpha(tst.f, sig(), d / 1000, g / 1000);
        if (a >= 0.8) res.push({ d, g, a, tot: d + g });
      }
      res.sort((a, b) => a.tot - b.tot || a.d - b.d);
      const best = res.slice(0, 5);
      fo.innerHTML = best.length ? `<div class="table-wrap"><table><tr><th>Thickness</th><th>Air gap</th><th>Total depth</th><th class="num">α @ ${tst.f} Hz</th></tr>${best.map((r) => `<tr><td>${r.d} mm</td><td>${r.g} mm</td><td>${r.tot} mm</td><td class="num">${fmt(r.a, 2)}</td></tr>`).join('')}</table></div><p class="small">Quarter-wavelength at ${tst.f} Hz = ${fmtLen(P.C / (4 * tst.f))} → the physics explains the depth needed.</p>`
        : `<p class="warn">No combination up to 400 + 400 mm reaches α 0.8 at ${tst.f} Hz with this material. Use a lower-density material, a corner superchunk, or a membrane/Helmholtz trap.</p>`;
    }
    function upd() {
      const s = sig();
      const area = st.w * st.h * st.n;
      const a = (f) => P.porousAlpha(f, s, st.d / 1000, st.gap / 1000);
      const sabins = P.BANDS6.map((f) => a(f) * area);
      out.innerHTML = bandTable(a) + `<div class="stats">${A.statBox('Total face area', fmt(area, 2) + ' m²')}${A.statBox('Sabins @125', fmt(sabins[0], 1))}${A.statBox('Sabins @500', fmt(sabins[2], 1))}${A.statBox('Flow resistance σ·d', fmt((s * st.d) / 1000, 0) + ' Rayl', (s * st.d / 1000) / 415 > 4 ? 'High — surface may reflect' : 'In the useful range')}</div>
        <details><summary>Build sheet</summary><ul><li>${st.n} × panels ${Math.round(st.w * 1000)} × ${Math.round(st.h * 1000)} × ${st.d} mm, ${D.POROUS.find((m) => m.id === st.mat).name}</li><li>Frame timber ${st.d} mm deep: ${st.n * 2} × ${Math.round(st.h * 1000)} mm + ${st.n * 2} × ${Math.round(st.w * 1000 - 36)} mm (for 18 mm stock)</li><li>Fabric ≈ ${fmt(st.n * (st.w + 2 * st.d / 1000 + 0.1) * (st.h + 2 * st.d / 1000 + 0.1), 1)} m² (breathable)</li><li>Stand-offs ${st.gap} mm (${st.n * 4} pcs) or Z-clips + spacer battens</li><li>See <a href="#/workshop/broadband-panel">Workshop → Broadband panel</a></li></ul></details>`;
      cv.redraw();
      find();
    }
    upd();
  }

  /* ---------------- membrane ---------------- */
  function membrane(body) {
    body.appendChild(html('<p class="muted">A sealed box with a panel (or limp membrane) on the front. The panel mass rides on the air spring in the cavity. Use it to target one problem mode when you don’t have the depth for porous traps.</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const st = A.controls(card, [
      { key: 'panel', label: 'Membrane', type: 'select', value: '6ply', options: [['3hb', '3 mm hardboard (≈ 2.9 kg/m²)'], ['6ply', '6 mm plywood (≈ 3.6 kg/m²)'], ['9ply', '9 mm plywood (≈ 5.4 kg/m²)'], ['12ply', '12 mm plywood (≈ 7.2 kg/m²)'], ['12gyp', '12.5 mm gypsum (≈ 9.5 kg/m²)'], ['mlv5', 'Limp mass-loaded vinyl 5 kg/m²'], ['custom', 'Custom mass']] },
      { key: 'm', label: 'Custom surface mass', type: 'range', min: 1, max: 25, step: 0.5, value: 5, unit: 'kg/m²' },
      { key: 'D', label: 'Cavity depth', type: 'range', min: 30, max: 400, step: 5, value: 120, unit: 'mm' },
      { key: 'fill', label: 'Cavity fill', type: 'select', value: 'half', options: [['none', 'Empty (narrow, peaky)'], ['half', 'Wool on back wall (typical)'], ['full', 'Fully filled (broad)']] },
      { key: 'target', label: 'Target mode (finder)', type: 'range', min: 30, max: 200, step: 1, value: 60, unit: 'Hz' },
    ], () => upd());
    const masses = { '3hb': 2.9, '6ply': 3.6, '9ply': 5.4, '12ply': 7.2, '12gyp': 9.5, mlv5: 5 };
    const m = () => (st.panel === 'custom' ? st.m : masses[st.panel]);
    const sig = () => (st.fill === 'none' ? 0 : st.fill === 'half' ? 3000 : 9000);
    const f0 = () => P.membraneF0(m(), st.D / 1000, st.fill !== 'none');
    const cv = alphaPlot(card, () => [{ fn: (f) => P.membraneAlpha(f, { m: m(), D: st.D / 1000, fillSigma: sig(), r: st.fill === 'none' ? 0.08 : 0.15 }) }], { marker: f0, caption: 'Impedance model: panel mass + loss in series with the cavity (air or wool-filled).' });
    const out = el('div'); card.appendChild(out);
    function upd() {
      const need = Math.pow(50 / st.target, 2) / m(); // depth for target (filled formula)
      out.innerHTML = `<div class="stats">${A.statBox('Resonance f₀', fmtHz(f0()), st.fill !== 'none' ? 'f₀ ≈ 50/√(m·d)' : 'f₀ ≈ 60/√(m·d)')}${A.statBox('Panel mass', fmt(m(), 1) + ' kg/m²')}${A.statBox('Depth for ' + st.target + ' Hz', fmtLen(need), 'with this panel, wool in cavity')}${A.statBox('Mass for ' + st.target + ' Hz at this depth', fmt(Math.pow(50 / st.target, 2) / (st.D / 1000), 1) + ' kg/m²')}</div>
        <div class="callout warn">Seal every edge airtight; fix the membrane only at its perimeter; keep wool from touching the membrane (or it adds mass and damping unpredictably). Verify with a measurement — aim within ±10 % of the mode.</div>`;
      cv.redraw();
    }
    upd();
  }

  /* ---------------- perforated / slotted ---------------- */
  function perforated(body, slot) {
    body.appendChild(html(slot ? '<p class="muted">Slats with gaps over a cavity: each slot is a Helmholtz neck. Narrow slots and wide slats lower the tuning; filling the cavity broadens the band.</p>' : '<p class="muted">A panel drilled with holes over a cavity (pegboard, perforated wood/metal). Open-area percentage, panel thickness and cavity depth set the tuning.</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const spec = slot ? [
      { key: 'sw', label: 'Slot width', type: 'range', min: 2, max: 30, step: 1, value: 8, unit: 'mm' },
      { key: 'bw', label: 'Slat width', type: 'range', min: 20, max: 200, step: 5, value: 70, unit: 'mm' },
      { key: 't', label: 'Slat thickness', type: 'range', min: 6, max: 50, step: 1, value: 18, unit: 'mm' },
    ] : [
      { key: 'hd', label: 'Hole diameter', type: 'range', min: 2, max: 25, step: 0.5, value: 6, unit: 'mm' },
      { key: 'sp', label: 'Hole spacing', type: 'range', min: 6, max: 100, step: 1, value: 25, unit: 'mm' },
      { key: 't', label: 'Panel thickness', type: 'range', min: 3, max: 25, step: 1, value: 6, unit: 'mm' },
    ];
    spec.push({ key: 'D', label: 'Cavity depth', type: 'range', min: 20, max: 400, step: 5, value: 100, unit: 'mm' }, { key: 'fill', label: 'Cavity', type: 'select', value: 'full', options: [['none', 'Empty'], ['full', 'Filled with wool'], ['fabric', 'Empty + fabric behind panel']] });
    const st = A.controls(card, spec, () => upd());
    const o = () => {
      const open = slot ? P.slotOpenArea(st.sw / 1000, st.bw / 1000) : P.holeOpenArea(st.hd / 1000, st.sp / 1000);
      return { t: st.t / 1000, holeD: (st.hd || 6) / 1000, slot, slotW: (st.sw || 8) / 1000, open: Math.min(open, 0.6), D: st.D / 1000, fillSigma: st.fill === 'full' ? 10000 : 0, fabricR: st.fill === 'fabric' ? 300 : st.fill === 'full' ? 100 : 0 };
    };
    const cv = alphaPlot(card, () => [{ fn: (f) => P.perforatedAlpha(f, o()) }], { marker: () => P.perforatedF0(o()) });
    const out = el('div'); card.appendChild(out);
    function upd() {
      const p = o();
      out.innerHTML = bandTable((f) => P.perforatedAlpha(f, p)) + `<div class="stats">${A.statBox('Open area', fmt(p.open * 100, 1) + ' %', p.open > 0.25 ? 'Acoustically transparent-ish: behaves like porous' : '')}${A.statBox('Tuning f₀', fmtHz(P.perforatedF0(p)))}${slot ? A.statBox('Slats per metre', fmt(1000 / (st.bw + st.sw), 1)) : A.statBox('Holes per m²', fmt(1e6 / (st.sp * st.sp), 0))}</div>`;
      cv.redraw();
    }
    upd();
  }

  /* ---------------- single resonator ---------------- */
  function bottle(body) {
    body.appendChild(html('<p class="muted">A single Helmholtz resonator — a cavity with a neck (port). Used historically in churches (pots embedded in walls) and today as tuned LF absorbers. Size it for a mode, then place it at a pressure maximum (corner).</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    V.helmholtz(card);
    const t = el('div', { class: 'card' }); body.appendChild(t);
    t.appendChild(html('<h3 style="margin-top:0">Size for a target frequency</h3>'));
    const st = A.controls(t, [
      { key: 'f', label: 'Target', type: 'range', min: 30, max: 300, step: 1, value: 60, unit: 'Hz' },
      { key: 'r', label: 'Port radius', type: 'range', min: 10, max: 100, step: 1, value: 40, unit: 'mm' },
      { key: 'l', label: 'Port length', type: 'range', min: 10, max: 300, step: 5, value: 100, unit: 'mm' },
    ], () => upd());
    const out = el('div'); t.appendChild(out);
    function upd() {
      const S = Math.PI * Math.pow(st.r / 1000, 2), Le = st.l / 1000 + 1.7 * st.r / 1000;
      const Vv = S / (Math.pow((2 * Math.PI * st.f) / P.C, 2) * Le);
      out.innerHTML = `<div class="stats">${A.statBox('Required cavity volume', fmt(Vv * 1000, 1) + ' litres')}${A.statBox('Cube side', fmtLen(Math.cbrt(Vv)))}${A.statBox('Wavelength at f', fmtLen(P.C / st.f))}</div><p class="small">Add a thin porous layer across the inside of the port to widen the bandwidth and absorb rather than just re-radiate.</p>`;
    }
    upd();
  }

  /* ---------------- compare commercial/typical ---------------- */
  function compare(body) {
    body.appendChild(html('<p class="muted">Compare typical published absorption data. Notice how NRC hides the bass differences.</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const ids = ['foam-50', 'mw-50', 'mw-100-gap', 'membrane', 'slot-resonator'];
    const st = A.controls(card, ids.map((id, i) => ({ key: 'm' + i, label: 'Material ' + (i + 1), type: 'select', value: id, options: D.MATERIALS.map((m) => [m.id, m.name]) })), () => cv.redraw());
    const series = () => ids.map((_, i) => D.mat(st['m' + i]));
    const cv = A.canvas(card, {
      height: 260,
      draw(ctx, w, h) {
        const ss = series();
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: 6, ticks: [] }, y: { min: 0, max: 1.05, label: 'α', ticks: [0, 0.2, 0.4, 0.6, 0.8, 1] } });
        const bw = ((ax.x1 - ax.x0) / 6) * 0.84;
        P.BANDS6.forEach((f, i) => {
          A.text(ctx, A.shortHz(f), ax.X(i + 0.5), ax.y0 + 16, { align: 'center', size: 11, color: A.css('muted') });
          ss.forEach((m, k) => { const x = ax.X(i + 0.08) + (bw / ss.length) * k; ctx.fillStyle = A.series(k); const v = Math.min(1, m.a[i]); ctx.fillRect(x, ax.Y(v), bw / ss.length - 2, ax.y0 - ax.Y(v)); });
        });
      },
    });
    const leg = el('div'); card.appendChild(leg);
    const upd = () => { leg.innerHTML = ''; leg.appendChild(A.legend(series().map((m, k) => [A.series(k), `${m.name} (NRC ${fmt(m.nrc, 2)})`]))); };
    card.addEventListener('change', upd); upd();
  }

  A.register('absorbers', {
    title: 'Absorber Designer',
    render(root, params) {
      A.pageHead(root, 'Design', 'Absorber Designer', 'Predict, tune and build absorbers. Each designer uses real impedance physics, shows α by frequency, and gives you a build sheet.');
      const tabs = [['porous', 'Porous panel / bass trap'], ['membrane', 'Membrane trap'], ['perforated', 'Perforated panel'], ['slotted', 'Slotted (slat) resonator'], ['bottle', 'Helmholtz resonator'], ['compare', 'Compare materials']];
      A.tabs(root, tabs, (id, body) => {
        ({ porous, membrane, perforated: (b) => perforated(b, false), slotted: (b) => perforated(b, true), bottle, compare })[id](body);
      }, tabs.find((t) => t[0] === params[0]) ? params[0] : 'porous');
    },
  });
})();
