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
    body.appendChild(html(`<p class="muted">Broadband panels, clouds and bass traps. Prediction: ${P.POROUS_MODELS[P.porousModel]} impedance model for the porous layer, transfer-matrix air gap, ${P.incidence} incidence. Real results also depend on panel size, edges and fabric.</p>`));
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
      const chk = P.porousZk(125, s, P.porousModel);
      const a = (f) => P.porousAlpha(f, s, st.d / 1000, st.gap / 1000);
      const sabins = P.BANDS6.map((f) => a(f) * area);
      out.innerHTML = bandTable(a) + `<div class="stats">${A.statBox('Total face area', fmt(area, 2) + ' m²')}${A.statBox('Sabins @125', fmt(sabins[0], 1))}${A.statBox('Sabins @500', fmt(sabins[2], 1))}${A.statBox('Flow resistance σ·d', fmt((s * st.d) / 1000, 0) + ' Rayl', (s * st.d / 1000) / 415 > 4 ? 'High — surface may reflect' : 'In the useful range')}</div>
        ${P.porousModel === 'db' && !chk.valid ? `<div class="callout warn">Delany–Bazley is outside its validity range (X = ρf/σ = ${fmt(chk.X, 3)} at 125 Hz; valid ≈ 0.01–1). Switch to Miki or Komatsu for low frequencies.</div>` : ''}
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
      { key: 'pw', label: 'Panel width (between supports)', type: 'range', min: 300, max: 1500, step: 10, value: 600, unit: 'mm' },
      { key: 'ph', label: 'Panel height', type: 'range', min: 300, max: 2400, step: 10, value: 1200, unit: 'mm' },
      { key: 'stiff', label: 'Include panel bending stiffness (more accurate for stiff panels)', type: 'check', value: true },
    ], () => upd());
    const masses = { '3hb': 2.9, '6ply': 3.6, '9ply': 5.4, '12ply': 7.2, '12gyp': 9.5, mlv5: 5 };
    const plate = { '3hb': ['mdf', 0.003], '6ply': ['plywood', 0.006], '9ply': ['plywood', 0.009], '12ply': ['plywood', 0.012], '12gyp': ['gypsum', 0.0125] };
    const fPl = () => (st.stiff && plate[st.panel] ? P.plateF11(P.PANELS[plate[st.panel][0]], plate[st.panel][1], st.pw / 1000, st.ph / 1000) : 0);
    const m = () => (st.panel === 'custom' ? st.m : masses[st.panel]);
    const sig = () => (st.fill === 'none' ? 0 : st.fill === 'half' ? 3000 : 9000);
    const f0 = () => P.membraneF0Plate(m(), st.D / 1000, st.fill !== 'none', fPl());
    const cv = alphaPlot(card, () => [{ fn: (f) => P.membraneAlpha(f, { m: m(), D: st.D / 1000, fillSigma: sig(), r: st.fill === 'none' ? 0.08 : 0.15, fPlate: fPl() }) }, { fn: (f) => P.membraneAlpha(f, { m: m(), D: st.D / 1000, fillSigma: sig(), r: st.fill === 'none' ? 0.08 : 0.15 }), dash: [5, 4], color: A.css('muted') }], { marker: f0, caption: 'Impedance model: panel mass − bending stiffness + loss, in series with the cavity (air or wool-filled). Dashed: limp-mass formula without panel stiffness — stiff, small panels tune noticeably higher.' });
    const out = el('div'); card.appendChild(out);
    function upd() {
      const need = Math.pow(50 / st.target, 2) / m(); // depth for target (filled formula)
      out.innerHTML = `<div class="stats">${A.statBox('Resonance f₀', fmtHz(f0()), st.fill !== 'none' ? 'f₀ ≈ 50/√(m·d)' : 'f₀ ≈ 60/√(m·d)')}${A.statBox('Panel mass', fmt(m(), 1) + ' kg/m²')}${A.statBox('Bending stiffness adds', fPl() ? fmtHz(fPl()) : '—', fPl() ? 'f₀ = √(f_mass-air² + f_plate²)' : 'limp membrane')}${A.statBox('Depth for ' + st.target + ' Hz', fmtLen(need), 'with this panel, wool in cavity')}${A.statBox('Mass for ' + st.target + ' Hz at this depth', fmt(Math.pow(50 / st.target, 2) / (st.D / 1000), 1) + ' kg/m²')}</div>
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

  /* ---------------- micro-perforated panel (Maa) ---------------- */
  function mpp(body) {
    body.appendChild(html('<p class="muted">Sub-millimetre holes in a thin sheet (metal, film, glass, wood veneer) absorb by viscous friction in the holes — no fibres needed, so they work in clean rooms, over windows and on curved surfaces. Calculated with Maa’s micro-perforate theory.</p>'));
    const card = el('div', { class: 'card' }); body.appendChild(card);
    const st = A.controls(card, [
      { key: 'd', label: 'Hole diameter', type: 'range', min: 0.1, max: 3, step: 0.05, value: 0.5, unit: 'mm' },
      { key: 't', label: 'Sheet thickness', type: 'range', min: 0.1, max: 6, step: 0.05, value: 0.5, unit: 'mm' },
      { key: 'p', label: 'Open area', type: 'range', min: 0.2, max: 10, step: 0.1, value: 1, unit: '%' },
      { key: 'D', label: 'Cavity depth', type: 'range', min: 10, max: 300, step: 5, value: 50, unit: 'mm' },
      { key: 'double', label: 'Show the same panel with a 2nd layer of wool in the cavity', type: 'check', value: false },
    ], () => upd());
    const o = () => ({ holeD: st.d / 1000, t: st.t / 1000, open: st.p / 100, D: st.D / 1000 });
    const cv = alphaPlot(card, () => [{ fn: (f) => P.mppAlpha(f, o()) }].concat(st.double ? [{ fn: (f) => P.mppAlpha(f, Object.assign(o(), { fillSigma: 8000 })), color: A.css('c4') }] : []).concat([{ fn: (f) => P.mppAlpha(f, o(), 'normal'), dash: [3, 3], color: A.css('accent2') }]), { caption: 'Solid: field incidence. Dotted: normal incidence. Smaller holes raise the resistance (broader, more damped); thicker sheets and lower open area lower the frequency.' });
    const out = el('div'); card.appendChild(out);
    function upd() {
      const z = P.maaZ(1000, st.d / 1000, st.t / 1000, st.p / 100);
      out.innerHTML = bandTable((f) => P.mppAlpha(f, o())) + `<div class="stats">${A.statBox('Perforate constant k @1 kHz', fmt(z.k, 2), z.k < 1 ? 'very small holes' : z.k < 10 ? 'micro-perforate range' : 'large holes — behaves like ordinary perforate')}${A.statBox('Relative resistance r @1 kHz', fmt(z.r, 2), z.r > 0.5 && z.r < 3 ? 'good damping (≈ 1 ideal)' : 'adjust hole size / open area')}${A.statBox('Holes per m²', fmt((st.p / 100) / (Math.PI * Math.pow(st.d / 2000, 2)), 0))}</div>`;
      cv.redraw();
    }
    upd();
  }

  /* ---------------- methods & sources ---------------- */
  function methods(body) {
    body.appendChild(html(`<div class="card lesson"><h3 style="margin-top:0">How the designers calculate</h3>
      <div class="table-wrap"><table><tr><th>Absorber</th><th>Model</th><th>Valid / notes</th></tr>
      <tr><td>Porous layer</td><td>Delany & Bazley (1970), Miki (1990) or Komatsu (2008) empirical models for characteristic impedance and wavenumber, from flow resistivity σ</td><td>Delany–Bazley ≈ 0.01 < ρf/σ < 1; Miki is better behaved at low frequency; Komatsu improves accuracy for dense materials and low frequency</td></tr>
      <tr><td>Air gap & layers</td><td>Transfer-matrix (impedance translation) through each layer onto a rigid backing</td><td>Locally reacting, infinite panel</td></tr>
      <tr><td>Incidence</td><td>Normal; field (Paris integral 0–78°); random (0–90°)</td><td>Field incidence usually matches reverberation-room data better than 0–90°</td></tr>
      <tr><td>Perforated & micro-perforated panels</td><td>Maa (1998) perforate impedance (viscous resistance + mass with end correction 0.85d), in series with the cavity</td><td>Covers sub-mm micro-perforates and ordinary perforated boards</td></tr>
      <tr><td>Slotted panels</td><td>Helmholtz model with slot end correction (Smits & Kosten) and viscous loss</td><td>Approximate; verify by measurement</td></tr>
      <tr><td>Membrane / panel</td><td>Mass − bending stiffness (plate fundamental, simply supported) + loss, in series with the cavity; f₀² = f²mass-air + f²plate</td><td>Real edge fixing lies between simply supported and clamped; tune by measurement</td></tr>
      <tr><td>Diffusers</td><td>Schroeder QRD/PRD depth sequences; Fraunhofer far-field polar; flat-plate frequencies n·N·f₀; grating lobes sinθ = mλ/period</td><td>Far field, normal incidence</td></tr></table></div>
      <h4>Limits of any calculation</h4><ul><li>Finite panels absorb more than these infinite-panel predictions at low frequency, because of edge diffraction — lab α values above 1 are common for small samples.</li><li>Fabric, facings and paint change the high-frequency result.</li><li>Flow resistivity varies with density and manufacturer — use the supplier’s value where available.</li></ul>
      <h4>References</h4><ul class="small">
        <li>Delany M.E., Bazley E.N. (1970) “Acoustical properties of fibrous absorbent materials”, Applied Acoustics 3.</li>
        <li>Miki Y. (1990) “Acoustical properties of porous materials — modifications of Delany–Bazley models”, J. Acoust. Soc. Jpn (E) 11.</li>
        <li>Komatsu T. (2008) “Improvement of the Delany–Bazley and Miki models for fibrous sound-absorbing materials”, Acoust. Sci. & Tech. 29.</li>
        <li>Maa D.-Y. (1998) “Potential of microperforated panel absorber”, J. Acoust. Soc. Am. 104.</li>
        <li>Kuttruff H. — <i>Room Acoustics</i>; Everest F.A., Pohlmann K. — <i>Master Handbook of Acoustics</i>.</li>
        <li>ISO 354 (absorption measurement), ISO 17497 (scattering & diffusion coefficients).</li></ul>
      <p class="small">Formulas are implemented from these published works; check the original papers and manufacturer data before building something critical.</p></div>`));
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
      const bar = el('div', { class: 'card', style: { padding: '10px 16px', marginBottom: '6px' } });
      root.appendChild(bar);
      A.controls(bar, [
        { key: 'model', label: 'Porous material model', type: 'select', value: P.porousModel, options: Object.entries(P.POROUS_MODELS) },
        { key: 'inc', label: 'Sound incidence', type: 'select', value: P.incidence, options: [['field', 'Field (0–78°, closest to lab data)'], ['random', 'Random (0–90°)'], ['normal', 'Normal (impedance tube)']] },
      ], (v) => { P.porousModel = v.model; P.incidence = v.inc; A.store.set('absModel', { model: v.model, inc: v.inc }); tb.select(cur); });
      let cur = 'porous';
      const tabs = [['porous', 'Porous panel / bass trap'], ['membrane', 'Membrane trap'], ['perforated', 'Perforated panel'], ['mpp', 'Micro-perforated'], ['slotted', 'Slotted (slat) resonator'], ['bottle', 'Helmholtz resonator'], ['compare', 'Compare materials'], ['methods', 'Methods & sources']];
      const tb = A.tabs(root, tabs, (id, body) => {
        cur = id;
        ({ porous, membrane, perforated: (b) => perforated(b, false), mpp, slotted: (b) => perforated(b, true), bottle, compare, methods })[id](body);
      }, tabs.find((t) => t[0] === params[0]) ? params[0] : 'porous');
    },
  });
})();
