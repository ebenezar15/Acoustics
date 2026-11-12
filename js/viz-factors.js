/* ==========================================================================
   Acoustica — factors & aesthetics, activated carbon, India wall builder.
   Simplified teaching models built on the app's physics.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2;
  const OCT = [63, 125, 250, 500, 1000, 2000, 4000, 8000];
  const T16 = P.THIRDS.slice(4, 20);
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };

  /* ======================================================================
     1. Factor board — what changes a room's decay, and what treatment does
     ====================================================================== */
  V.factorBoard = function (host) {
    const st = A.controls(host, [
      { type: 'heading', label: 'The room' },
      { key: 'V', label: 'Room volume', type: 'range', min: 15, max: 400, step: 5, value: 45, unit: 'm³' },
      { key: 'soft', label: 'Surfaces: bare & hard → carpeted & curtained', type: 'range', min: 0, max: 1, step: 0.05, value: 0.15, fmt: (v) => (v < 0.25 ? 'hard (tile, plaster, glass)' : v < 0.6 ? 'mixed' : 'soft (carpet, curtains)') },
      { key: 'furn', label: 'Furniture & clutter', type: 'range', min: 0, max: 6, step: 1, value: 1, fmt: (v) => ['empty', 'a desk', 'desk + shelves', 'sofa + shelves', 'well furnished', 'full', 'crowded'][v] },
      { key: 'ppl', label: 'People in the room', type: 'range', min: 0, max: 12, step: 1, value: 1 },
      { key: 'rh', label: 'Relative humidity', type: 'range', min: 20, max: 90, step: 5, value: 50, unit: '%' },
      { type: 'heading', label: 'The treatment' },
      { key: 'cov', label: 'Treated share of walls + ceiling', type: 'range', min: 0, max: 60, step: 5, value: 0, unit: '%' },
      { key: 'd', label: 'Absorber thickness', type: 'range', min: 0.025, max: 0.3, step: 0.005, value: 0.05, unit: 'm' },
      { key: 'gap', label: 'Air gap behind', type: 'range', min: 0, max: 0.3, step: 0.005, value: 0, unit: 'm' },
      { key: 'corner', label: 'Part of it placed across corners (bass traps)', type: 'check', value: false },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    let R = {};
    function calc() {
      const S = 6.6 * Math.pow(st.V, 2 / 3), floor = Math.pow(st.V, 2 / 3) * 1.25;
      const hard = [0.03, 0.03, 0.03, 0.04, 0.04, 0.05, 0.05, 0.06], softA = [0.02, 0.04, 0.1, 0.22, 0.32, 0.4, 0.45, 0.45];
      const furn = [0.4, 0.8, 1.2, 1.6, 2, 2, 2, 2], ppl = [0.15, 0.25, 0.35, 0.42, 0.46, 0.5, 0.5, 0.5];
      const treatS = (st.cov / 100) * (S - floor);
      const rt = (withT) => OCT.map((f, i) => {
        let Aabs = S * hard[i] + floor * 1.6 * softA[i] * st.soft + st.furn * furn[i] * (1 + st.V / 150) + st.ppl * ppl[i];
        if (withT) { let a = P.porousAlpha(f, 8000, st.d, st.gap); if (st.corner && f <= 250) a = Math.min(1.1, a * 1.7 + 0.08); Aabs += treatS * a; }
        const m = f >= 2000 ? ({ 2000: 0.002, 4000: 0.006, 8000: 0.02 })[f] * (50 / st.rh) : 0;
        return (0.161 * st.V) / (Aabs + 4 * m * st.V);
      });
      const target = 0.25 * Math.pow(st.V / 100, 1 / 3) + 0.05;
      return { before: rt(false), after: rt(true), target, fs: P.schroeder(rt(true)[3], st.V), treatS };
    }
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Reverberation time in each octave band: grey = the room as furnished, coloured = with your treatment. The green band is a sensible target for a small critical-listening room of this volume. Watch what thin panels do: the highs drop below the target while the bass barely moves — the classic “dull yet boomy” room.',
      draw(ctx, w, h, t) {
        const r = R, ax = A.axes(ctx, w, h, { x: { min: 0, max: 8, label: 'Octave band (Hz)', ticks: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5], fmt: (v) => { const f = OCT[Math.floor(v)]; return f >= 1000 ? f / 1000 + 'k' : String(f); } }, y: { min: 0, max: Math.max(1.2, Math.min(4, Math.max(...r.before) * 1.1)), label: 'RT60 (s)' } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.14); ctx.fillRect(ax.x0, ax.Y(r.target * 1.3), ax.x1 - ax.x0, ax.Y(r.target * 0.75) - ax.Y(r.target * 1.3));
        OCT.forEach((f, i) => {
          const bw = (ax.X(1) - ax.X(0)) * 0.36, xb = ax.X(i + 0.5);
          ctx.fillStyle = A.alpha(A.css('muted'), 0.5); ctx.fillRect(xb - bw, ax.Y(r.before[i]), bw, ax.y0 - ax.Y(r.before[i]));
          const v = r.after[i], shim = 1 + 0.02 * Math.sin(t * 6 + i) * Math.min(1, v);
          ctx.fillStyle = v > r.target * 1.3 ? A.css('bad') : v < r.target * 0.75 ? A.css('warn') : A.css('good'); ctx.fillRect(xb, ax.Y(v * shim), bw, ax.y0 - ax.Y(v * shim));
        });
      },
    });
    host.appendChild(A.legend([[A.alpha(A.css('muted'), 0.6), 'As furnished'], [A.css('good'), 'With treatment: on target'], [A.css('bad'), 'too long'], [A.css('warn'), 'too dead']]));
    function upd() {
      R = calc(); const r = R, br = (r.after[1] + r.after[2]) / (r.after[3] + r.after[4]), hi = r.after[5] / r.after[3];
      out.innerHTML = A.statBox('Mid RT (500–1k)', fmt((r.after[3] + r.after[4]) / 2, 2) + ' s', `target ≈ ${fmt(r.target, 2)} s`) + A.statBox('Bass ratio (125–250 ÷ 500–1k)', fmt(br, 2), br > 1.6 ? 'boomy' : br > 1.25 ? 'warm' : 'even', br > 1.6 ? 'bad' : br > 1.25 ? 'warn' : 'good') + A.statBox('Treated area', fmt(r.treatS, 3) + ' m²', '') + A.statBox('Schroeder frequency', fmtHz(r.fs), 'modes rule below this');
      const msgs = [];
      if (st.cov && st.d < 0.08 && !st.gap && br > 1.5) msgs.push('Thin panels flat on the wall fix only the highs. Make them thicker, add an air gap, or move some across the corners.');
      if (br > 1.6 && !st.corner) msgs.push('Bass decays much longer than the mids: add corner traps or pressure (membrane) traps.');
      if (r.after[5] < r.target * 0.6) msgs.push('The room is getting dead at high frequencies. Swap some absorption for slatted/perforated finishes or diffusion.');
      if (st.V < 30) msgs.push('Very small room: modes dominate up to ' + fmtHz(r.fs) + ' — RT alone does not describe it; check the mode tools.');
      if (st.rh > 70 && st.V > 200) msgs.push('Humid air absorbs less at high frequencies than very dry air, and high humidity also threatens materials: plan dehumidification.');
      if (!msgs.length) msgs.push(st.cov ? 'Balanced decay across the bands — now confirm by measurement.' : 'Add treatment and watch which bands respond.');
      note.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${msgs.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Finish designer — how the visible face changes the absorber
     ====================================================================== */
  const PAL = { warm: ['Warm studio', '#b5651d', '#e8d8c3', '#3b2f2f'], nordic: ['Nordic light', '#d9c7a3', '#f4f1ea', '#5d6b6b'], night: ['Midnight', '#1f2a44', '#3d4f7c', '#c9a227'], forest: ['Forest', '#2f5d50', '#9bb39b', '#e9e4d4'], clay: ['Terracotta', '#c1440e', '#f0c9a0', '#40302a'] };
  const FIN = { fabric: 'Open-weave acoustic fabric', print: 'Printed acoustically transparent fabric (art panel)', tight: 'Tight upholstery / leatherette', paint: 'Painted-over fabric or canvas', slat: 'Timber slats with gaps', perf: 'Perforated wood / MDF' };
  V.finishDesigner = function (host) {
    const st = A.controls(host, [
      { key: 'fin', label: 'Visible finish', type: 'select', value: 'fabric', options: Object.entries(FIN) },
      { key: 'pal', label: 'Colour scheme', type: 'select', value: 'warm', options: Object.entries(PAL).map(([k, v]) => [k, v[0]]) },
      { key: 'd', label: 'Absorber thickness behind', type: 'range', min: 0.025, max: 0.2, step: 0.005, value: 0.1, unit: 'm' },
      { key: 'gap', label: 'Air gap behind the absorber', type: 'range', min: 0, max: 0.2, step: 0.005, value: 0.05, unit: 'm' },
      { key: 'slatW', label: 'Slat width (slats)', type: 'range', min: 0.02, max: 0.12, step: 0.005, value: 0.045, unit: 'm' },
      { key: 'slatG', label: 'Gap between slats', type: 'range', min: 0.003, max: 0.04, step: 0.001, value: 0.012, unit: 'm' },
      { key: 'open', label: 'Open area (perforated)', type: 'range', min: 1, max: 30, step: 1, value: 8, unit: '%' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    const base = (f) => P.porousAlpha(f, 8000, st.d, st.gap);
    function alpha(f) {
      const b = base(f);
      switch (st.fin) {
        case 'fabric': return b;
        case 'print': return b * (f > 2000 ? 1 - 0.07 * Math.log2(f / 2000) : 1);
        case 'tight': return b / (1 + Math.pow(f / 1200, 2)) + 0.25 * Math.exp(-Math.pow(Math.log2(f / 250), 2));
        case 'paint': return b / (1 + Math.pow(f / 700, 2)) + 0.05;
        case 'slat': return Math.min(1, P.perforatedAlpha(f, { t: 0.018, slot: true, slotW: st.slatG, open: st.slatG / (st.slatG + st.slatW), D: st.d + st.gap, fillSigma: 8000 }));
        default: return Math.min(1, P.perforatedAlpha(f, { t: 0.012, holeD: 0.006, open: st.open / 100, D: st.d + st.gap, fillSigma: 8000 }));
      }
    }
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Left: how the wall would look. Right: what the finish does to the absorber behind it — dashed is the bare absorber, solid is with the finish. Open fabric changes nothing; airtight or painted faces reflect the highs; slats and perforations turn the panel into a tuned absorber that keeps the room lively.',
      draw(ctx, w, h) {
        const p = PAL[st.pal], lw = Math.min(w * 0.4, 360), x0 = 14, y0 = 16, ww = lw - 20, hh = h - 60;
        ctx.fillStyle = p[2]; ctx.fillRect(x0, y0, ww, hh);
        ctx.fillStyle = p[3]; ctx.fillRect(x0, y0 + hh, ww, 10);
        const pn = 3, pw = (ww - 40) / pn;
        for (let i = 0; i < pn; i++) {
          const px = x0 + 12 + i * (pw + 8), py = y0 + 22, ph = hh - 50;
          if (st.fin === 'slat') { ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px, py, pw, ph); const unit = Math.max(4, (st.slatW + st.slatG) * 160), sw = unit * (st.slatW / (st.slatW + st.slatG)); for (let x = 0; x + sw <= pw; x += unit) { ctx.fillStyle = p[1]; ctx.fillRect(px + x, py, sw, ph); } }
          else if (st.fin === 'perf') { ctx.fillStyle = p[1]; ctx.fillRect(px, py, pw, ph); ctx.fillStyle = '#1a1a1a'; const sp = Math.max(5, 26 / Math.sqrt(st.open)); for (let x = sp / 2; x < pw; x += sp) for (let y = sp / 2; y < ph; y += sp) { ctx.beginPath(); ctx.arc(px + x, py + y, 1.6, 0, TAU); ctx.fill(); } }
          else if (st.fin === 'print') { const g = ctx.createLinearGradient(px, py, px + pw, py + ph); g.addColorStop(0, p[1]); g.addColorStop(0.5, p[3]); g.addColorStop(1, p[2]); ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph); ctx.strokeStyle = A.alpha('#ffffff', 0.5); ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k <= 20; k++) { const u = k / 20; const yy = py + ph * (0.5 + 0.3 * Math.sin(u * 6 + i)); k ? ctx.lineTo(px + u * pw, yy) : ctx.moveTo(px + u * pw, yy); } ctx.stroke(); ctx.lineWidth = 1; }
          else { ctx.fillStyle = i === 1 ? p[3] : p[1]; ctx.fillRect(px, py, pw, ph); if (st.fin === 'fabric') { ctx.strokeStyle = A.alpha('#ffffff', 0.12); for (let y = py; y < py + ph; y += 3) { ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px + pw, y); ctx.stroke(); } } if (st.fin === 'tight' || st.fin === 'paint') { const g = ctx.createLinearGradient(px, py, px + pw, py); g.addColorStop(0, A.alpha('#ffffff', 0.25)); g.addColorStop(0.4, A.alpha('#ffffff', 0)); ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph); } }
        }
        const ax = A.axes(ctx, w, h, { x: { min: 63, max: 8000, log: true, label: 'Frequency (Hz)', ticks: [63, 125, 250, 500, 1000, 2000, 4000, 8000] }, y: { min: 0, max: 1.05, label: 'Absorption α' }, pad: { l: lw + 46, r: 12, t: 14, b: 36 } });
        const fs = []; for (let f = 63; f <= 8000; f *= 1.04) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, base(f)]), A.alpha(A.css('text'), 0.45), 1.5, [5, 4]);
        A.plotFill(ctx, ax, fs.map((f) => [f, A.clamp(alpha(f), 0, 1.05)]), A.alpha(A.css('accent'), 0.12), 0);
        A.plotLine(ctx, ax, fs.map((f) => [f, A.clamp(alpha(f), 0, 1.05)]), A.css('accent'), 2.8);
      },
    });
    function upd() {
      const a125 = alpha(125), a500 = alpha(500), a4k = alpha(4000);
      const kind = a4k > 0.7 && a500 > 0.7 ? 'Broadband absorber' : a4k < 0.4 && a500 > 0.5 ? 'Low/mid absorber that keeps the highs' : a4k < 0.4 ? 'Mostly reflective' : 'Mid/high absorber';
      out.innerHTML = A.statBox('Character', kind, '') + A.statBox('α at 125 Hz', fmt(a125, 2), 'bass') + A.statBox('α at 500 Hz', fmt(a500, 2), 'voice') + A.statBox('α at 4 kHz', fmt(a4k, 2), 'air & sparkle');
      const T = { fabric: 'Blow test: if you can breathe through the cloth easily, sound passes too. Stretch it over a timber frame; choose flame-retardant fabric.', print: 'Dye-sublimation prints on acoustically transparent polyester keep nearly all the absorption — a good way to hide panels as artwork.', tight: 'Airtight coverings turn the face into a membrane: highs bounce off. Use only where you want to keep the room bright, or perforate them.', paint: 'Paint clogs the weave. Never paint fabric panels or wood-wool tiles heavily; a light mist coat at most.', slat: 'Slat wall = tuned absorber: wider gaps and thinner slats raise the working band; narrow gaps lower it and keep more highs. Vary the widths for a more even response and a richer look.', perf: 'Open area sets the character: 1–5 % = bass/low-mid resonator, 10–20 % = wide-band, above ≈ 25 % the panel is almost acoustically invisible.' };
      note.innerHTML = `<div class="callout mentor">${T[st.fin]}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Activated-carbon bass trap
     ====================================================================== */
  const HUM = { dry: ['Dry, sealed with desiccant', 2.0], room: ['Normal room air (≈ 40–60 % RH)', 1.6], humid: ['Humid / monsoon, unsealed', 1.25] };
  V.carbonTrap = function (host) {
    const st = A.controls(host, [
      { key: 'type', label: 'Trap type', type: 'select', value: 'mem', options: [['mem', 'Membrane (panel) trap'], ['helm', 'Helmholtz (slot / hole) trap']] },
      { key: 'D', label: 'Cavity depth', type: 'range', min: 0.05, max: 0.5, step: 0.005, value: 0.15, unit: 'm' },
      { key: 'm', label: 'Panel mass (membrane) / neck “mass” (Helmholtz)', type: 'range', min: 2, max: 20, step: 0.5, value: 6, unit: 'kg/m²' },
      { key: 'fill', label: 'Share of the cavity filled with activated carbon', type: 'range', min: 0, max: 80, step: 5, value: 0, unit: '%' },
      { key: 'hum', label: 'Condition of the carbon', type: 'select', value: 'room', options: Object.entries(HUM).map(([k, v]) => [k, v[0]]) },
      { key: 'area', label: 'Trap face area', type: 'range', min: 0.5, max: 6, step: 0.1, value: 1.2, unit: 'm²' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    function calc() {
      const phi = st.fill / 100, K = HUM[st.hum][1];
      const Ceff = (1 - phi) + phi * K; // apparent cavity "size" multiplier
      const f0 = 60 / Math.sqrt(st.m * st.D), f1 = f0 / Math.sqrt(Ceff);
      const Q0 = 4.5, Q1 = Q0 / (1 + 1.6 * phi);
      const a = (f, fr, Q) => { const x = f / fr - fr / f; return 0.92 / (1 + Q * Q * x * x); };
      return { phi, K, Ceff, f0, f1, Q1, a0: (f) => a(f, f0, Q0), a1: (f) => a(f, f1, Q1), kg: phi * st.D * st.area * 480, eqD: st.D * Ceff };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: section through the trap. Black granules are activated carbon; blue dots are air molecules — as pressure rises some stick to the carbon’s enormous internal surface and are released again as it falls, so the cavity behaves like a larger, softer and more damped air spring. Right: the trap’s absorption without carbon (dashed) and with it (solid).',
      draw(ctx, w, h, t) {
        const r = R, lw = Math.min(w * 0.36, 320), bx = 30, by = 26, bw = lw - 50, bh = h - 70;
        const osc = Math.sin(t * 5);
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh); ctx.lineWidth = 1;
        if (st.type === 'mem') { ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - osc * 12, by + bh / 2, bx, by + bh); ctx.stroke(); ctx.lineWidth = 1; }
        else { ctx.fillStyle = A.css('panel'); ctx.fillRect(bx - 3, by + bh / 2 - 12, 6, 24); ctx.fillStyle = A.alpha(A.css('accent2'), 0.8); ctx.fillRect(bx - 16 + osc * 6, by + bh / 2 - 9, 20, 18); }
        const cw = bw * r.phi;
        ctx.fillStyle = A.alpha(A.css('text'), 0.1); ctx.fillRect(bx + bw - cw, by + 2, cw, bh - 4);
        const n = Math.round(260 * r.phi);
        for (let i = 0; i < n; i++) { const x = bx + bw - cw + ((i * 37.7) % Math.max(1, cw - 6)) + 3, y = by + 6 + ((i * 53.3) % (bh - 12)); dot(ctx, x, y, 2.6, '#1c1c1c'); }
        for (let i = 0; i < 46; i++) {
          const inC = i % 2 === 0 && r.phi > 0;
          const x0 = inC ? bx + bw - cw + ((i * 29) % Math.max(1, cw - 8)) + 4 : bx + 8 + ((i * 31) % Math.max(8, bw - cw - 16));
          const y0 = by + 8 + ((i * 47) % (bh - 16));
          const stuck = inC && Math.sin(t * 5 + i) > 0.2;
          dot(ctx, x0 + (stuck ? 0 : Math.sin(t * 7 + i * 2) * 4 + osc * 3), y0 + (stuck ? 0 : Math.cos(t * 6 + i) * 3), 2, stuck ? A.css('warn') : A.css('c3'));
        }
        A.text(ctx, st.type === 'mem' ? 'panel' : 'neck', bx - 6, by - 8, { size: 10, color: A.css('accent2'), align: 'center' });
        if (r.phi) A.text(ctx, 'carbon in breathable bags', bx + bw - cw / 2, by + bh + 16, { size: 10, align: 'center', color: A.css('muted') });
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 300, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 40, 50, 63, 80, 100, 125, 160, 200, 300] }, y: { min: 0, max: 1, label: 'Absorption α' }, pad: { l: lw + 46, r: 12, t: 14, b: 36 } });
        const fs = []; for (let f = 20; f <= 300; f *= 1.02) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, r.a0(f)]), A.alpha(A.css('text'), 0.5), 1.6, [5, 4]);
        A.plotFill(ctx, ax, fs.map((f) => [f, r.a1(f)]), A.alpha(A.css('accent'), 0.12), 0);
        A.plotLine(ctx, ax, fs.map((f) => [f, r.a1(f)]), A.css('accent'), 2.8);
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Tuning without carbon', fmtHz(r.f0), '60 / √(m·D)') + A.statBox('Tuning with carbon', fmtHz(r.f1), r.phi ? `${fmt(r.f0 - r.f1, 2)} Hz lower` : 'add carbon to see', r.phi ? 'good' : '') + A.statBox('Cavity behaves like', A.fmtLen(r.eqD), r.phi ? `saves ≈ ${A.fmtLen(r.eqD - st.D)} of depth` : 'its real depth') + A.statBox('Bandwidth', r.phi ? 'wider (Q ≈ ' + fmt(r.Q1, 2) + ')' : 'narrow (Q ≈ 4.5)', 'carbon adds damping') + A.statBox('Carbon needed', fmt(r.kg, 3) + ' kg', 'granular, ≈ 480 kg/m³');
      const msgs = [];
      if (!r.phi) msgs.push('Slide in some carbon: the resonance drops and broadens without making the box deeper.');
      if (st.hum === 'humid') msgs.push('Damp carbon has its pores filled with water and loses most of the effect. Seal the trap, include silica-gel sachets and re-dry or replace the carbon if needed.');
      if (r.phi > 0.6) msgs.push('Leave free air next to the panel or neck — the air must be able to move in and out of the granules. Around 30–60 % fill is a practical range.');
      if (r.kg > 60) msgs.push(`That is ${fmt(r.kg, 3)} kg of carbon: check the fixing and the floor, and remember large quantities must be kept dry and away from ignition sources.`);
      msgs.push('The multipliers here (≈ 1.3–2× apparent volume) are indicative values from published experiments at low frequencies and low sound levels; build, measure the tuning and adjust.');
      note.innerHTML = `<div class="callout data"><ul style="margin:0;padding-left:18px">${msgs.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. India wall builder — common masonry + linings, in ₹ and inches
     ====================================================================== */
  const MAS = {
    brick115: ['115 mm (4½″) clay brick, plastered both sides', 'brick', 0.115, 0.024],
    brick230: ['230 mm (9″) clay brick, plastered both sides', 'brick', 0.23, 0.024],
    aac100: ['100 mm AAC block, plastered', { rho: 650, E: 1.8e9, nu: 0.2, eta: 0.012 }, 0.1, 0.024],
    aac200: ['200 mm AAC block, plastered', { rho: 650, E: 1.8e9, nu: 0.2, eta: 0.012 }, 0.2, 0.024],
    flyash230: ['230 mm fly-ash brick, plastered', { rho: 1750, E: 12e9, nu: 0.2, eta: 0.012 }, 0.23, 0.024],
    block200: ['200 mm solid concrete block, plastered', 'cmu', 0.2, 0.024],
    rcc150: ['150 mm RCC wall', 'concrete', 0.15, 0],
  };
  const LIN = {
    none: ['No lining', null, 0, 0, 0],
    dab: ['Gypsum board stuck directly on the wall (dot-and-dab)', [['gypsum', 0.0125]], 0.012, 0, 95],
    g1: ['Independent metal stud + rockwool + 1 × 12.5 mm gypsum', [['gypsum', 0.0125]], null, 1, 190],
    g2: ['Independent stud + rockwool + 2 × 12.5 mm gypsum', [['gypsum', 0.0125], ['gypsum', 0.0125]], null, 1, 270],
    gfc: ['Independent stud + rockwool + 12.5 mm gypsum + 8 mm fibre-cement, damping between', [['gypsum', 0.0125], ['cementBoard', 0.008]], null, 1, 340],
  };
  V.indiaWall = function (host) {
    const st = A.controls(host, [
      { key: 'mas', label: 'Existing / structural wall', type: 'select', value: 'brick115', options: Object.entries(MAS).map(([k, v]) => [k, v[0]]) },
      { key: 'plaster', label: 'Plastered and sealed on both faces, up to the slab', type: 'check', value: true },
      { key: 'lin', label: 'Inner lining (room side)', type: 'select', value: 'none', options: Object.entries(LIN).map(([k, v]) => [k, v[0]]) },
      { key: 'd', label: 'Cavity between wall and lining', type: 'range', min: 0.05, max: 0.2, step: 0.005, value: 0.075, unit: 'm' },
      { key: 'area', label: 'Wall area to line', type: 'range', min: 5, max: 120, step: 1, value: 30, unit: 'm²' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    function model() {
      const M = MAS[st.mas], mat = typeof M[1] === 'string' ? P.PANELS[M[1]] : M[1];
      const m = mat.rho * M[2] + (st.plaster ? 2000 * M[3] : 0);
      const base = { m, fc: P.criticalFreq(mat, M[2]), eta: mat.eta || 0.01, dip: 9 };
      const Lg = LIN[st.lin];
      const leak = st.plaster ? 0 : (/aac/.test(st.mas) ? 2e-3 : 8e-4);
      let tlf, f0 = null, thick = M[2] + (st.plaster ? M[3] : 0), addM = 0;
      if (!Lg[1]) tlf = (f) => P.singleLeafTL(base, f);
      else {
        const leaf2 = P.leafProps(Lg[1].map(([mm, t]) => ({ mat: mm, t })), st.lin === 'gfc');
        const d = Lg[2] != null ? Lg[2] : st.d;
        const o = { leaf1: base, leaf2, d, filled: !!Lg[3], conn: st.lin === 'dab' ? 'solid' : 'none', cap: 82 };
        tlf = (f) => P.doubleLeafTL(o, f).tl; f0 = P.doubleLeafTL(o, 500).f0;
        thick += d + Lg[1].reduce((s, x) => s + x[1], 0); addM = leaf2.m;
      }
      const tl = (f) => -10 * Math.log10(Math.pow(10, -tlf(f) / 10) + leak);
      return { tl, f0, thick, m, addM, stc: P.stc(T16.map(tl)), rw: P.rw(P.THIRDS.slice(3, 19).map(tl)), cost: Lg[4], lost: thick - M[2] - (st.plaster ? M[3] : 0) };
    }
    let R = model();
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Left: the wall build-up to scale. Right: its isolation versus frequency. Dashed lines mark roughly what is needed to keep speech (≈ 45 dB) and amplified music (≈ 60 dB) from the neighbour. Heavy masonry is India’s great advantage — but only when it is plastered, sealed to the slab and lined on an independent frame, never with board stuck straight on.',
      draw(ctx, w, h) {
        const r = R, lw = Math.min(w * 0.3, 260), sc = Math.min(700, (lw - 40) / Math.max(0.2, r.thick)), y0 = 26, y1 = h - 40; let x = 24;
        const M = MAS[st.mas], seg = (t, col, lab) => { const ww = Math.max(2, t * sc); ctx.fillStyle = col; ctx.fillRect(x, y0, ww, y1 - y0); x += ww; };
        if (st.plaster && M[3]) seg(M[3] / 2, A.css('muted'));
        seg(M[2], /aac/.test(st.mas) ? '#cfcfc4' : /rcc|block/.test(st.mas) ? '#8d8d8d' : '#b5533c');
        if (st.plaster && M[3]) seg(M[3] / 2, A.css('muted'));
        const Lg = LIN[st.lin];
        if (Lg[1]) { const d = Lg[2] != null ? Lg[2] : st.d; const xs = x; seg(d, Lg[3] ? A.alpha(A.css('c4'), 0.55) : A.alpha(A.css('muted'), 0.12)); if (st.lin === 'dab') { for (let yy = y0 + 20; yy < y1; yy += 50) { ctx.fillStyle = A.css('bad'); ctx.fillRect(xs, yy, d * sc, 10); } } Lg[1].forEach((l, i) => seg(l[1], i ? A.css('accent2') : A.css('text'))); }
        A.text(ctx, `${fmt(r.thick * 1000, 3)} mm (${fmt(r.thick / 0.0254, 3)}″) total`, 24, h - 16, { size: 11, weight: 700 });
        const ax = A.axes(ctx, w, h, { x: { min: 50, max: 5000, log: true, label: 'Frequency (Hz)', ticks: [63, 125, 250, 500, 1000, 2000, 4000] }, y: { min: 10, max: 90, label: 'Isolation (dB)' }, pad: { l: lw + 46, r: 12, t: 14, b: 36 } });
        [[45, 'speech privacy'], [60, 'amplified music']].forEach(([v, l]) => { ctx.setLineDash([5, 5]); ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(ax.x0, ax.Y(v)); ctx.lineTo(ax.x1, ax.Y(v)); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, l, ax.x1 - 4, ax.Y(v) - 4, { size: 10, align: 'right', color: A.css('muted') }); });
        const fs = []; for (let f = 50; f <= 5000; f *= 1.04) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, A.clamp(r.tl(f), 10, 90)]), A.css('accent'), 2.8);
        if (r.f0 && r.f0 > 50) { ctx.setLineDash([3, 4]); ctx.strokeStyle = A.css('bad'); ctx.beginPath(); ctx.moveTo(ax.X(r.f0), ax.y1); ctx.lineTo(ax.X(r.f0), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'cavity resonance ' + fmtHz(r.f0), ax.X(r.f0) + 3, ax.y1 + 12, { size: 10, color: A.css('bad') }); }
      },
    });
    function upd() {
      R = model(); const r = R, sqft = st.area * 10.764;
      out.innerHTML = A.statBox('Rating', `STC ${r.stc} · Rw ${r.rw.Rw} (${r.rw.C}; ${r.rw.Ctr})`, r.stc >= 60 ? 'studio grade' : r.stc >= 50 ? 'good' : 'ordinary', r.stc >= 58 ? 'good' : r.stc >= 48 ? 'warn' : 'bad') + A.statBox('Bass (63–100 Hz)', fmt((r.tl(63) + r.tl(80) + r.tl(100)) / 3, 3) + ' dB', '') + A.statBox('Room size lost per wall', `${fmt(r.lost * 1000, 3)} mm (${fmt(r.lost / 0.0254, 2)}″)`, '') + A.statBox('Masonry mass', fmt(r.m, 3) + ' kg/m²', r.addM ? `lining +${fmt(r.addM, 3)} kg/m²` : '') + A.statBox('Lining cost (indicative)', r.cost ? '₹' + Math.round((r.cost * sqft) / 1000) + 'k' : '—', r.cost ? `≈ ₹${r.cost}/sq ft · ${fmt(sqft, 3)} sq ft` : 'no lining');
      const msgs = [];
      if (!st.plaster) msgs.push('Unplastered blockwork leaks through its pores and mortar joints — worst with AAC. Plaster both faces and seal the top course to the slab <b>before</b> anything else: it is the cheapest decibels you will ever buy.');
      if (/aac/.test(st.mas)) msgs.push('AAC is light (≈ 650 kg/m³): excellent thermally, weak acoustically. For studio walls prefer 230 mm brick or solid concrete block, or add a heavy independent lining.');
      if (st.lin === 'dab') msgs.push('Board stuck on dabs leaves a 10–15 mm cavity that resonates around 100–250 Hz and is rigidly bridged: it usually makes bass isolation <b>worse</b> than the bare wall. Use an independent stud frame with a 50–100 mm wool-filled cavity.');
      if (st.lin !== 'none' && st.lin !== 'dab' && r.f0 > 70) msgs.push(`Cavity resonance at ${fmtHz(r.f0)}: widen the cavity or add a second board layer to push it lower.`);
      if (st.mas === 'brick115' && st.lin === 'none') msgs.push('A half-brick partition is typical between flats and offices: fine for speech, weak for music. Line it on an independent frame.');
      if (!msgs.length) msgs.push('A solid result. Remember the flanking paths typical of RCC-frame buildings: the shared slab, column–beam junctions, window openings and AC sleeves.');
      note.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${msgs.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };
})();
