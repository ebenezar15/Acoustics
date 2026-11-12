/* ==========================================================================
   Acoustica — studio design playbook widgets:
   design checklist, build-order timeline, cost calculator, target-mode
   planner, diffuser fit checker, room-to-room tie-line planner,
   ISO 717 rating fit and a standards explorer.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C = 343;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const tPos = (t) => (t < 0 ? 0 : t);

  /* ======================================================================
     1. Design checklist (saved in the browser)
     ====================================================================== */
  const CHECK = [
    ['1 · Brief & targets', 'What is the room for, and how good must it be?', [
      ['Write the brief: mixing, tracking, voice-over, rehearsal, drums? How loud, what hours?', 'Everything else follows from use and loudness.', 'b'],
      ['Set the noise target inside (NC 15–20 recording, NC 20–25 control room)', 'Decides HVAC and shell.', 'b'],
      ['Set the isolation target: source level − what the neighbour may hear, per octave', 'Use the isolation planner; the 63 & 125 Hz bands decide.', 'b'],
      ['Set room-acoustic targets: RT per band, ± dB response window, reflection-free zone', 'e.g. 0.2–0.3 s, ± 5 dB (home) / ± 3 dB (pro).', 'b'],
      ['Fix the budget and add 15–20 % contingency', 'Split roughly: shell 40–50 %, HVAC & electrical 20–25 %, treatment 15–20 %, doors/windows 10–15 %.', 'b'],
      ['Appoint the team: acoustician, structural engineer, M&E engineer, electrician', 'Professional projects; at home at least the electrician and structural check.', 'p'],
    ]],
    ['2 · Site & survey', 'Know what you are starting with.', [
      ['Measure the space accurately (L, W, H, beams, columns, windows, doors)', 'Draw it to scale.', 'b'],
      ['Survey ambient noise (day and night) and vibration sources', 'Traffic, trains, plant, neighbours.', 'b'],
      ['Check the structure: what can the floor carry? Slab or joists?', 'Isolation mass adds 50–300 kg/m².', 'b'],
      ['Check permits, fire escape, ventilation and electrical regulations', 'Before you design, not after.', 'b'],
      ['Find the flanking paths: shared slabs, ducts, ceilings voids, pipes', 'They cap the isolation whatever the wall.', 'b'],
    ]],
    ['3 · Layout & geometry', 'Free decisions on paper that cost a fortune later.', [
      ['Choose room sizes: avoid cubes and simple multiples; check the mode spread', 'Use the mode ladder / Room Predictor.', 'b'],
      ['Decide orientation: face down the length; keep left–right symmetry', 'Windows and doors off the front wall.', 'b'],
      ['Place the seat (≈ 38 % of length to start) and speakers; check nulls and boundary dips', 'Before fixing the desk position.', 'b'],
      ['Subtract isolation and treatment depth from the raw dimensions', 'Walls 150–300 mm, ceiling 200–400 mm, floor 50–150 mm.', 'b'],
      ['Plan sound locks, sight lines, circulation and equipment access', 'A console or piano must fit through the doors.', 'p'],
      ['Put machine room, plant and toilets away from recording rooms', 'Noisy neighbours inside your own building.', 'p'],
    ]],
    ['4 · Isolation shell', 'Mass, airtightness, decoupling — in that order of cheapness.', [
      ['Choose constructions that clear the target in every band (incl. 63 Hz)', 'Check mass–air–mass resonance at least an octave below the lowest problem frequency.', 'b'],
      ['Detail every junction: wall–floor, wall–ceiling, corners, perimeter gaps sealed', 'Draw them; do not leave to site.', 'b'],
      ['Doors: solid, sealed, drop seals; sound locks for loud rooms', 'Door ≈ wall − 10 dB at most.', 'b'],
      ['Windows: two panes, different thickness, wide gap, lined reveals', 'Keep area small.', 'b'],
      ['Floating floor only if needed (drums, structure-borne paths); check loads', 'Tune resonance ≤ half the structural floor.', 'b'],
      ['No rigid bridges: screws, pipes, conduits, mortar droppings', 'One bridge can cost 10 dB.', 'b'],
    ]],
    ['5 · Services', 'Air, power and signal — all of them are holes in your shell.', [
      ['HVAC: fresh air and cooling sized for people + equipment; low velocity', 'Mains < 3 m/s, grilles < 1.5–2 m/s.', 'b'],
      ['Silencer or baffle box at every duct penetration; no crosstalk between rooms', 'Separate branches per room.', 'b'],
      ['Electrical: technical power from one point, safety earth intact, lighting separate', 'Licensed electrician; zero-loop-area routing.', 'b'],
      ['Tie-lines: sealed, offset conduits; panels not back-to-back; spare capacity', 'Plan every cable route before boarding.', 'b'],
      ['Lighting without buzz: quiet drivers, no phase-cut dimmers on audio circuits', '', 'b'],
    ]],
    ['6 · Interior acoustics', 'Now make it sound right.', [
      ['Bass first: corner traps and pressure traps for the target modes', 'Deep and broadband; tuned traps for the worst one or two.', 'b'],
      ['First-reflection points: side walls, ceiling, desk', 'Mirror trick or geometry.', 'b'],
      ['Rear wall: deep absorption; diffusion only if the seat is ≥ 2–3 m away', 'See the diffuser fit checker.', 'b'],
      ['Keep some life: do not cover everything in thin absorber', 'Balance RT across bands.', 'b'],
      ['Speaker mounting: stands or flush-mount; decouple; aim at ears', '', 'b'],
      ['Variable acoustics for tracking rooms (panels, curtains, gobos)', '', 'p'],
    ]],
    ['7 · Build & quality control', 'The order matters as much as the design.', [
      ['Follow the build order: structure → shell → first-fix services → close → seal → second fix → treatment', 'See the timeline.', 'b'],
      ['Inspect before closing every cavity: insulation in, no bridges, cables pulled', 'Photograph everything.', 'b'],
      ['Seal test: torch and pink-noise check of every door, window and penetration', '', 'b'],
      ['Interim isolation test before finishes go on', 'Fixing leaks later is 10× the cost.', 'p'],
    ]],
    ['8 · Commission & tune', 'Measure, adjust, document.', [
      ['Measure noise floor (HVAC on/off) and isolation', '', 'b'],
      ['Measure response and decay at the seat; adjust seat, speakers, traps', 'Waterfall and RT per band.', 'b'],
      ['Align subs and mains; apply EQ last, cuts only, below ~300 Hz', '', 'b'],
      ['Document: drawings as built, cable schedule, settings, measurements', 'Future you will thank you.', 'b'],
    ]],
  ];
  V.DESIGN_CHECK = CHECK;
  V.designChecklist = function (host) {
    let done = A.store.get('designChecklist', {}), mode = A.store.get('designMode', 'home');
    const head = el('div', { class: 'row', style: { justifyContent: 'space-between', alignItems: 'center' } });
    const seg = A.seg([['home', 'Home studio'], ['pro', 'Professional facility']], mode, (v) => { mode = v; A.store.set('designMode', v); draw(); });
    const prog = el('div', { class: 'small' }); const reset = el('button', {}, 'Reset');
    head.append(seg, prog, reset); host.appendChild(head);
    const box = el('div', { class: 'chk' }); host.appendChild(box);
    reset.onclick = () => { done = {}; A.store.set('designChecklist', done); draw(); };
    const openSet = new Set([0]);
    function draw() {
      let tot = 0, ok = 0;
      box.innerHTML = CHECK.map(([title, sub, items], pi) => {
        const vis = items.map((it, ii) => [it, ii]).filter(([it]) => mode === 'pro' || it[2] !== 'p');
        const n = vis.filter(([, ii]) => done[pi + '-' + ii]).length; tot += vis.length; ok += n;
        return `<details class="chk-phase" ${openSet.has(pi) ? 'open' : ''} data-p="${pi}"><summary><span class="chk-ring" style="--p:${vis.length ? n / vis.length : 0}">${n}/${vis.length}</span><b>${title}</b><small>${sub}</small></summary>
          ${vis.map(([it, ii]) => `<label class="chk-item ${done[pi + '-' + ii] ? 'on' : ''}"><input type="checkbox" data-k="${pi}-${ii}" ${done[pi + '-' + ii] ? 'checked' : ''}><span><b>${it[0]}</b>${it[1] ? `<small>${it[1]}</small>` : ''}</span></label>`).join('')}</details>`;
      }).join('');
      A.$$('details', box).forEach((d) => d.addEventListener('toggle', () => { d.open ? openSet.add(+d.dataset.p) : openSet.delete(+d.dataset.p); }));
      prog.innerHTML = `<b>${ok}/${tot}</b> done · saved on this device`;
    }
    box.addEventListener('change', (e) => { const k = e.target.dataset && e.target.dataset.k; if (!k) return; done[k] = e.target.checked; A.store.set('designChecklist', done); draw(); });
    draw();
  };

  /* ======================================================================
     2. Build-order timeline
     ====================================================================== */
  const PHASES = [
    ['Brief, survey & design', 0, 3, 'c3', 'Targets, drawings, loads, permits. Every mistake fixed here is free.', 'Starting to build before the ventilation and cable routes are drawn.'],
    ['Structure & base', 3, 2, 'muted', 'Slab or floor strengthening, openings, drainage, damp-proofing.', 'Discovering the floor cannot carry the isolation mass.'],
    ['Floating floor (if any)', 5, 1.5, 'accent2', 'Pads/springs, deck, perimeter isolation strip.', 'Screws or mortar bridging to the slab; building walls on an unloaded floor.'],
    ['Inner walls & ceiling frames', 6.5, 2, 'accent2', 'Independent frames, isolation hangers, no contact with the outer shell.', 'Rigid ties “just to hold it while we work”.'],
    ['First-fix services', 8.5, 2, 'warn', 'Ducts & silencers, conduits, back boxes, tie-line pipes, cable pulls.', 'Back-to-back boxes; ducts without silencers; no spare conduits.'],
    ['Inspect & photograph', 10.5, 0.5, 'bad', 'Insulation in every cavity, no bridges, every penetration planned.', 'Skipping this — it is the last time you can see inside.'],
    ['Board, mass layers & seal', 11, 2.5, 'accent', 'Staggered layers, damping, acoustic sealant at every perimeter.', 'Boards tight to the floor/ceiling with no sealant gap.'],
    ['Doors, windows & seals', 13.5, 1.5, 'good', 'Frames packed and sealed, seals adjusted, glass on gaskets.', 'Fitting doors before the heavy, dusty work is finished.'],
    ['Leak test & interim measurement', 15, 0.5, 'bad', 'Torch and pink-noise test; fix leaks now.', 'Testing only after the finishes are on.'],
    ['Second fix & finishes', 15.5, 2, 'warn', 'Grilles, sockets, lighting, floor finish, paint.', 'Cutting new holes in the finished shell.'],
    ['Acoustic treatment', 17.5, 2, 'c4', 'Bass traps, reflection panels, clouds, diffusers, fabric.', 'Treating before measuring the bare room.'],
    ['Equipment, wiring & commissioning', 19.5, 2.5, 'c3', 'Install, label, measure, align, tune, document.', 'EQ before position and treatment are right.'],
  ];
  V.buildTimeline = function (host) {
    let sel = 0, playing = true, t0 = performance.now();
    const info = el('div');
    const cv = A.canvas(host, {
      height: 380, animate: true,
      caption: 'The order of work for a room-in-room studio (weeks are illustrative for a single-room home build; a professional facility takes several times longer). The marker walks the schedule — click any bar to see what happens in that phase and the classic mistake.',
      draw(ctx, w, h, t) {
        const total = 22, x0 = 210, x1 = w - 14, rowH = (h - 40) / PHASES.length;
        const X = (wk) => x0 + (wk / total) * (x1 - x0);
        const now = playing ? ((performance.now() - t0) / 1000 * 1.6) % total : PHASES[sel][1] + PHASES[sel][2] / 2;
        for (let wk = 0; wk <= total; wk += 2) { ctx.strokeStyle = A.alpha(A.css('line'), 0.8); ctx.beginPath(); ctx.moveTo(X(wk), 8); ctx.lineTo(X(wk), h - 26); ctx.stroke(); A.text(ctx, 'wk ' + wk, X(wk), h - 10, { align: 'center', size: 9, color: A.css('muted') }); }
        PHASES.forEach((p, i) => {
          const y = 10 + i * rowH, active = now >= p[1] && now < p[1] + p[2];
          if (playing && active) sel = i;
          A.text(ctx, p[0], x0 - 8, y + rowH / 2 + 4, { align: 'right', size: w < 600 ? 9 : 11, weight: i === sel ? 800 : 500, color: i === sel ? A.css('text') : A.css('muted') });
          ctx.fillStyle = A.alpha(A.css(p[3]), i === sel ? 1 : 0.55); ctx.beginPath(); ctx.roundRect(X(p[1]), y + 4, Math.max(8, X(p[1] + p[2]) - X(p[1])), rowH - 8, 5); ctx.fill();
          if (i === sel) { ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1; }
        });
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(now), 4); ctx.lineTo(X(now), h - 24); ctx.stroke(); ctx.lineWidth = 1; dot(ctx, X(now), 6, 5, A.css('accent'));
        if (cv._sel !== sel) { cv._sel = sel; show(); }
      },
      onPointer(p, api) {
        if (p.type !== 'pointerdown') return;
        const rowH = (api.h - 40) / PHASES.length, i = Math.floor((p.y - 10) / rowH);
        if (i >= 0 && i < PHASES.length) { sel = i; playing = false; btn.textContent = '▶ Play the schedule'; show(); }
      },
    });
    const btn = el('button', {}, '⏸ Pause'); btn.onclick = () => { playing = !playing; t0 = performance.now() - (PHASES[sel][1] / 1.6) * 1000; btn.textContent = playing ? '⏸ Pause' : '▶ Play the schedule'; };
    host.appendChild(btn); host.appendChild(info);
    function show() { const p = PHASES[sel]; info.innerHTML = `<div class="grid g2" style="margin-top:8px"><div class="callout mentor" style="margin:0"><b>${sel + 1}. ${p[0]}</b><br>${p[4]}</div><div class="callout warn" style="margin:0">${p[5]}</div></div>`; }
    show();
  };

  /* ======================================================================
     3. Cost calculator
     ====================================================================== */
  V.costCalc = function (host) {
    const st = A.controls(host, [
      { key: 'area', label: 'Floor area (all studio rooms)', type: 'range', min: 6, max: 300, step: 1, value: 16, unit: 'm²' },
      { key: 'H', label: 'Room height', type: 'range', min: 2.2, max: 6, step: 0.1, value: 2.5, unit: 'm' },
      { key: 'rooms', label: 'Rooms', type: 'select', value: '1', options: [['1', 'One room (mix / production)'], ['2', 'Control room + booth'], ['3', 'Control room + live room + booth'], ['6', 'Multi-room facility']] },
      { key: 'iso', label: 'Isolation level', type: 'select', value: 'light', options: [['none', 'Treatment only (no building work)'], ['light', 'Light: seal, heavier doors, window plug/secondary glazing'], ['mod', 'Moderate: independent walls & ceiling (room-in-room)'], ['high', 'High: full room-in-room with floating floor']] },
      { key: 'tier', label: 'Finish & hardware tier', type: 'select', value: 'diy', options: [['diy', 'Budget — DIY materials'], ['mid', 'Mid — trades for key work, bought doors/panels'], ['pro', 'Professional — contractor, specialist products']] },
      { key: 'hvac', label: 'Ventilation & cooling', type: 'select', value: 'split', options: [['none', 'Existing / none'], ['split', 'Mini-split + silenced fresh-air fan'], ['duct', 'Ducted low-velocity system with silencers']] },
      { key: 'mult', label: 'Local price level', type: 'range', min: 0.4, max: 2, step: 0.05, value: 1, fmt: (v) => '× ' + v.toFixed(2) },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tips = el('div'); host.appendChild(tips);
    let parts = [];
    function calc() {
      const k = { diy: 1, mid: 2.2, pro: 4.5 }[st.tier], rooms = +st.rooms, A0 = st.area;
      const perim = 4 * Math.sqrt(A0 / rooms) * rooms, wallA = perim * st.H, surf = wallA + A0;
      const shellRate = { none: 0, light: 6, mod: 55, high: 70 }[st.iso];
      const shell = shellRate * surf * (0.6 + 0.4 * k);
      const floor = st.iso === 'high' ? A0 * 60 * (0.6 + 0.4 * k) : 0;
      const doors = { none: 0, light: 180, mod: 450, high: 650 }[st.iso] * k * (rooms + (rooms > 1 ? 1 : 0));
      const wins = rooms > 1 ? (rooms - 1) * { none: 0, light: 250, mod: 600, high: 800 }[st.iso] * k : (st.iso === 'light' ? 150 * k : 0);
      const treat = A0 * 38 * k;
      const hv = { none: 0, split: 1400 + A0 * 25, duct: 3500 + A0 * 110 }[st.hvac] * (0.7 + 0.3 * k);
      const elec = (400 + A0 * 28) * (0.6 + 0.4 * k) * (st.iso === 'none' ? 0.4 : 1);
      const ties = rooms > 1 ? (rooms - 1) * 350 * k : 0;
      const base = shell + floor + doors + wins + treat + hv + elec + ties;
      const fees = base * { diy: 0, mid: 0.05, pro: 0.12 }[st.tier], cont = (base + fees) * 0.15;
      const P0 = [['Isolation shell (walls, ceiling, sealing)', shell, 'accent2'], ['Floating floor', floor, 'accent'], ['Doors & seals', doors, 'good'], ['Windows / glazing', wins, 'c3'], ['Acoustic treatment', treat, 'c4'], ['HVAC', hv, 'warn'], ['Electrical & lighting', elec, 'bad'], ['Tie-lines & panels', ties, 'muted'], ['Design & engineering fees', fees, 'text'], ['Contingency 15 %', cont, 'line']];
      return P0.map(([n, v, c]) => [n, v * st.mult, c]).filter((p) => p[1] > 0);
    }
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Indicative budget split (materials and typical labour, in US-dollar terms — scale with the “local price level” slider and get real quotes). Use it to see proportions and what a decision does to the total, not as a quotation.',
      draw(ctx, w, h) {
        const tot = parts.reduce((s, p) => s + p[1], 0), x0 = w < 600 ? 150 : 250, bw = w - x0 - 80; let y = 12; const rh = (h - 24) / parts.length;
        parts.forEach((p) => { A.text(ctx, p[0], x0 - 8, y + rh / 2 + 4, { align: 'right', size: w < 600 ? 9 : 11 }); ctx.fillStyle = A.alpha(A.css('muted'), 0.15); ctx.fillRect(x0, y + 3, bw, rh - 6); ctx.fillStyle = A.css(p[2]); ctx.fillRect(x0, y + 3, bw * (p[1] / Math.max(...parts.map((q) => q[1]))), rh - 6); A.text(ctx, '$' + Math.round(p[1] / 10) * 10 + ' · ' + fmt((p[1] / tot) * 100, 2) + ' %', x0 + bw * (p[1] / Math.max(...parts.map((q) => q[1]))) + 6, y + rh / 2 + 4, { size: 10 }); y += rh; });
      },
    });
    function upd() {
      parts = calc(); const tot = parts.reduce((s, p) => s + p[1], 0);
      const big = parts.slice().sort((a, b) => b[1] - a[1])[0];
      out.innerHTML = A.statBox('Indicative total', '$' + (Math.round(tot / 100) * 100).toLocaleString(), 'incl. contingency') + A.statBox('Per m² of floor', '$' + Math.round(tot / st.area).toLocaleString(), '') + A.statBox('Biggest item', big[0].split(' (')[0], fmt((big[1] / tot) * 100, 2) + ' % of the budget');
      const T = [];
      if (st.iso === 'high') T.push('A floating floor is only worth it for drums/structure-borne noise. On a ground-floor slab, skip it and spend on walls, ceiling and doors.');
      if (st.iso === 'mod' || st.iso === 'high') T.push('Standard gypsum board + damping compound + mineral wool gives most of the performance of branded “acoustic” boards for a fraction of the price.');
      if (st.tier !== 'diy') T.push('Do the labour-heavy, low-risk jobs yourself (insulation, sealing, treatment panels, cable pulling); pay trades for structure, electrics and HVAC.');
      T.push('Build treatment from mineral wool, timber frames and fabric: typically 20–30 % of the cost of bought panels with the same absorption.');
      if (st.hvac === 'duct') T.push('Oversize ducts and use more grilles before buying expensive silencers — low velocity is the cheapest noise control.');
      T.push('Seal first: sealant, door seals and a drop seal often buy 8–12 dB for less than 5 % of the budget.');
      tips.innerHTML = `<div class="callout alt"><b>Cheap and effective:</b><ul style="margin:.3em 0 0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Target-mode planner: which modes to design for, where and how
     ====================================================================== */
  V.modeTargets = function (host) {
    const st = A.controls(host, [
      { key: 'L', label: 'Length', type: 'range', min: 2.5, max: 12, step: 0.05, value: 4.6, unit: 'm' },
      { key: 'W', label: 'Width', type: 'range', min: 2, max: 9, step: 0.05, value: 3.4, unit: 'm' },
      { key: 'H', label: 'Height', type: 'range', min: 2.1, max: 5, step: 0.05, value: 2.5, unit: 'm' },
      { key: 'seat', label: 'Seat position along the length', type: 'range', min: 0.2, max: 0.7, step: 0.01, value: 0.38, fmt: (v) => Math.round(v * 100) + ' %' },
      { key: 'panel', label: 'Membrane-trap panel', type: 'select', value: '3.6', options: [['2.4', '4 mm plywood (2.4 kg/m²)'], ['3.6', '6 mm plywood (3.6 kg/m²)'], ['7', '9 mm MDF (7 kg/m²)'], ['10', 'Mass-loaded membrane (10 kg/m²)']] },
    ], () => upd());
    const tbl = el('div'); host.appendChild(tbl);
    let rows = [], sel = 0;
    function build() {
      const dims = [st.L, st.W, st.H], names = ['Length', 'Width', 'Height'], seatR = [st.L * st.seat, st.W / 2, 1.2];
      const modes = P.roomModes(st.L, st.W, st.H, 220);
      const fs = P.schroeder(0.35, st.L * st.W * st.H);
      const cand = modes.filter((m) => (m.type === 'axial' && m.f < Math.min(170, fs * 1.05)) || (m.type === 'tangential' && m.f < 100));
      const axials = modes.filter((m) => m.type === 'axial');
      const list = cand.map((m) => {
        const near = axials.filter((o) => o !== m && Math.abs(o.f - m.f) / m.f < 0.05).length;
        const below = cand.filter((o) => o.f < m.f - 0.01).slice(-1)[0], above = cand.filter((o) => o.f > m.f + 0.01)[0];
        const iso = Math.min(below ? m.f - below.f : 25, above ? above.f - m.f : 25);
        const atSeat = Math.abs(P.modeShape(m.n, dims, seatR));
        const score = (m.type === 'axial' ? 3 : 1.2) + Math.min(2, near) * 2.5 + (iso > 12 ? 1.5 : iso > 7 ? 0.6 : 0) + (m.f < 60 ? 2 : m.f < 100 ? 1.3 : m.f < 140 ? 0.6 : 0) + (atSeat > 0.75 ? 1 : atSeat < 0.15 ? 0.8 : 0);
        const ax = m.n.map((n, i) => (n ? names[i] : null)).filter(Boolean);
        const D = Math.pow(50 / m.f, 2) / +st.panel;
        const fix = m.f < 110 ? `Membrane trap tuned ≈ ${fmtHz(m.f)}: ${st.panel} kg/m² panel over a ${A.fmtLen(D)} wool-filled cavity` : `Porous corner trap ≥ ${A.fmtLen(C / m.f / 8)} deep (or 100 mm + ${A.fmtLen(Math.max(0.05, C / m.f / 8 - 0.1))} gap)`;
        const where = m.type === 'axial' ? (ax[0] === 'Height' ? 'Ceiling (deep cloud) and the wall–ceiling corners' : ax[0] === 'Width' ? 'The two side walls and the vertical corners' : 'Front and rear walls and the vertical corners') : `Vertical corners (tri-corners best)`;
        return { ...m, near, iso, atSeat, score, ax, fix, where, D };
      }).sort((a, b) => b.score - a.score).slice(0, 8);
      return list;
    }
    const cv = A.canvas(host, {
      height: 250, animate: true,
      caption: 'Plan view of the selected mode at ear height: red and blue are the two halves of the pressure swing (they alternate), white lines are the nulls. The green dot is your seat. Click a row in the table to see another mode. Put pressure traps where the colour is strongest (walls/corners); never sit on a white line of an important mode.',
      draw(ctx, w, h, t) {
        t = tPos(t); const m = rows[sel]; if (!m) return;
        const sc = Math.min((w - 40) / st.L, (h - 30) / st.W), ox = (w - st.L * sc) / 2, oy = 14, N = 44, M2 = Math.round(N * st.W / st.L);
        const osc = Math.cos(t * 3);
        for (let i = 0; i < N; i++) for (let j = 0; j < M2; j++) {
          const x = ((i + 0.5) / N) * st.L, y = ((j + 0.5) / M2) * st.W;
          const v = P.modeShape(m.n, [st.L, st.W, st.H], [x, y, 1.2]) * osc;
          ctx.fillStyle = A.alpha(v > 0 ? A.css('bad') : A.css('c3'), Math.min(0.85, Math.abs(v)));
          ctx.fillRect(ox + (i / N) * st.L * sc, oy + (j / M2) * st.W * sc, (st.L * sc) / N + 0.6, (st.W * sc) / M2 + 0.6);
        }
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, st.L * sc, st.W * sc); ctx.lineWidth = 1;
        dot(ctx, ox + st.L * st.seat * sc, oy + (st.W / 2) * sc, 7, A.css('good'));
        A.text(ctx, `${fmtHz(m.f)} · mode (${m.n.join(',')}) · ${m.type}`, ox + 6, oy + 16, { size: 12, weight: 700, bg: A.alpha(A.css('panel'), 0.85) });
        A.text(ctx, 'front', ox - 4, oy + (st.W * sc) / 2, { align: 'right', size: 10, color: A.css('muted') });
      },
    });
    tbl.addEventListener('click', (e) => { const r = e.target.closest('[data-i]'); if (r) { sel = +r.dataset.i; upd(true); } });
    function upd(keep) {
      rows = build(); if (!keep) sel = 0;
      tbl.innerHTML = `<div class="table-wrap"><table class="mode-targets"><tr><th>#</th><th>Mode</th><th>Why it is a target</th><th>At your seat</th><th>Where to treat</th><th>How</th></tr>${rows.map((m, i) => `<tr data-i="${i}" class="${i === sel ? 'sel' : ''}"><td>${i + 1}</td><td><b>${fmtHz(m.f)}</b><br><span class="small muted">${m.type} (${m.n.join(',')}) · ${m.ax.join(' + ')}</span></td><td>${[m.type === 'axial' ? 'axial (strongest kind)' : 'tangential', m.near ? `<span class="bad">stacked with ${m.near} other axial mode${m.near > 1 ? 's' : ''}</span>` : '', m.iso > 12 ? 'isolated — rings on its own' : '', m.f < 80 ? 'very low: hard to absorb' : ''].filter(Boolean).join('; ')}</td><td>${m.atSeat < 0.15 ? (m.n[1] % 2 === 1 && !m.n[0] && !m.n[2] ? 'null (normal on the centre line)' : '<span class="bad">null — note vanishes</span>') : m.atSeat > 0.75 ? '<span class="warn">peak — note booms</span>' : 'moderate'}</td><td>${m.where}</td><td>${m.fix}</td></tr>`).join('')}</table></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Diffuser fit checker for small rooms
     ====================================================================== */
  const DIFFS = { qrd7: ['QRD, 7 wells', 7, 4], qrd13: ['QRD, 13 wells', 13, 12], sky: ['2-D skyline block diffuser', 13, 12], poly: ['Poly-cylinder (curved panel)', 0, 0], shelf: ['Bookshelf / irregular objects', 0, 0] };
  V.diffuserFit = function (host) {
    const st = A.controls(host, [
      { key: 'room', label: 'Room', type: 'select', value: 'ctrl', options: [['ctrl', 'Control room — rear wall behind the seat'], ['live', 'Live / tracking room wall'], ['booth', 'Small booth']] },
      { key: 'dist', label: 'Distance from listener / microphone to the diffuser', type: 'range', min: 0.3, max: 6, step: 0.05, value: 1.5, unit: 'm' },
      { key: 'type', label: 'Diffuser', type: 'select', value: 'qrd7', options: Object.entries(DIFFS).map(([k, v]) => [k, v[0]]) },
      { key: 'depth', label: 'Maximum depth of the diffuser', type: 'range', min: 0.03, max: 0.6, step: 0.01, value: 0.15, unit: 'm' },
      { key: 'well', label: 'Well / block width', type: 'range', min: 0.02, max: 0.15, step: 0.005, value: 0.05, unit: 'm' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const d = DIFFS[st.type];
      let flo, fhi;
      if (d[1]) { flo = (C * d[2]) / (2 * d[1] * st.depth); fhi = C / (2 * st.well); }
      else if (st.type === 'poly') { flo = C / (4 * st.depth) / 1.5; fhi = 8000; }
      else { flo = C / (2 * st.depth); fhi = 6000; }
      const lam = C / flo, need = st.type === 'poly' || st.type === 'shelf' ? Math.max(0.6, lam * 1.0) : Math.max(1.0, 3 * lam);
      return { flo, fhi, need, ok: st.dist >= need, part: st.dist >= need * 0.6 };
    }
    const cv = A.canvas(host, {
      height: 240, animate: true,
      caption: 'A diffuser needs distance for its scattered sound to blend into an even field. Too close, and you hear separate lobes and colouration instead of spaciousness (red zone). The rule of thumb for phase-grating (QRD/skyline) diffusers is about three wavelengths of their lowest working frequency; curved and irregular surfaces are more forgiving.',
      draw(ctx, w, h, t) {
        t = tPos(t); const r = calc(), span = Math.max(6, r.need * 1.2), x0 = 50, x1 = w - 20, X = (m) => x0 + (m / span) * (x1 - x0), cy = h / 2;
        ctx.fillStyle = A.alpha(A.css('bad'), 0.1); ctx.fillRect(X(0), 16, X(Math.min(span, r.need)) - X(0), h - 46);
        ctx.fillStyle = A.alpha(A.css('good'), 0.1); ctx.fillRect(X(Math.min(span, r.need)), 16, x1 - X(Math.min(span, r.need)), h - 46);
        // diffuser
        if (DIFFS[st.type][1]) { const n = 14; for (let i = 0; i < n; i++) { const dd = ((i * i) % 7) / 7; ctx.fillStyle = A.css('accent2'); ctx.fillRect(x0 - 26 + (1 - dd) * 0, 22 + i * ((h - 58) / n), 8 + dd * 18, (h - 58) / n - 2); } }
        else if (st.type === 'poly') { ctx.fillStyle = A.css('accent2'); ctx.beginPath(); ctx.ellipse(x0 - 22, cy - 8, 22, (h - 60) / 2, 0, -Math.PI / 2, Math.PI / 2); ctx.fill(); }
        else { for (let i = 0; i < 9; i++) { ctx.fillStyle = A.css('accent2'); ctx.fillRect(x0 - 24, 22 + i * ((h - 58) / 9), 8 + ((i * 5) % 4) * 5, (h - 58) / 9 - 3); } }
        // scattered wavelets
        for (let k = 0; k < 6; k++) { const rr = ((t * 60 + k * 45) % (x1 - x0)); for (let s = -2; s <= 2; s++) { const a = s * 0.45; const near = rr < X(r.need) - x0; ctx.strokeStyle = A.alpha(near ? A.css('bad') : A.css('good'), 0.7 * (1 - rr / (x1 - x0))); ctx.lineWidth = near ? 2.2 : 1.2; ctx.beginPath(); ctx.arc(x0, cy - 8 + s * 22, rr, a - (near ? 0.12 : 0.5), a + (near ? 0.12 : 0.5)); ctx.stroke(); } }
        ctx.lineWidth = 1;
        dot(ctx, X(Math.min(st.dist, span)), cy - 8, 8, r.ok ? A.css('good') : r.part ? A.css('warn') : A.css('bad'));
        A.text(ctx, st.room === 'ctrl' ? 'seat' : 'mic', X(Math.min(st.dist, span)), cy + 14, { align: 'center', size: 10 });
        [0, 1, 2, 3, 4, 5, 6].filter((m) => m <= span).forEach((m) => A.text(ctx, m + ' m', X(m), h - 14, { align: 'center', size: 9, color: A.css('muted') }));
        A.text(ctx, 'minimum distance ' + A.fmtLen(r.need), X(Math.min(span, r.need)) + 4, 28, { size: 10, weight: 700, color: A.css('good') });
      },
    });
    function upd() {
      const r = calc();
      out.innerHTML = A.statBox('Works from', fmtHz(r.flo), 'set by its depth') + A.statBox('Up to about', fmtHz(r.fhi), DIFFS[st.type][1] ? 'set by the well width' : '') + A.statBox('Needs distance', '≥ ' + A.fmtLen(r.need), DIFFS[st.type][1] ? '≈ 3 wavelengths' : '≈ 1 wavelength') + A.statBox('Verdict', r.ok ? 'Good fit' : r.part ? 'Marginal' : 'Too close', r.ok ? '' : 'see the advice below', r.ok ? 'good' : r.part ? 'warn' : 'bad');
      const adv = r.ok ? 'This diffuser has room to work. Use it above the range your bass traps cover, and keep absorption for the first-reflection points.' : st.room === 'booth' ? 'In a booth there is no distance for diffusion. Use deep broadband absorption on most surfaces and keep one reflective patch (a window, a wooden panel) opposite the microphone’s rear if it sounds too dead.' : st.room === 'ctrl' ? `With only ${A.fmtLen(st.dist)} behind the seat, use deep absorption (≥ 200–300 mm) or a <b>diffsorber</b> (slotted/perforated face over absorber) on the rear wall. Shallow 2-D diffusers (${A.fmtLen(Math.max(0.03, st.depth / 3))} deep, working above ≈ ${fmtHz(r.flo * 3)}) or curved panels can sit on side or ceiling areas that are further from your ears.` : 'Move the microphone further away, or use curved panels, angled walls, bookshelves and furniture — they scatter without needing as much distance — and keep phase-grating diffusers for the far wall or high up.';
      tip.innerHTML = `<div class="callout ${r.ok ? 'mentor' : 'warn'}">${adv}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     6. Tie-lines between rooms: signals, pathways, lengths, standards
     ====================================================================== */
  const SIG = [
    ['mic', 'Microphone lines (analogue)', 'Shielded twisted pair or star-quad multicore', 'XLR-3 (pin 2 hot)', 100, 'Balanced; phantom power on the same pair. Beyond ~100 m put the preamps near the mics.', 'IEC 60268-12 · AES14 · AES48 · IEC 61938', 'accent'],
    ['line', 'Line-level tie-lines (analogue)', 'Shielded twisted-pair multicore', 'XLR / TRS / 25-pin D-sub', 300, 'Balanced +4 dBu; D-sub pinout per AES59 for 8-channel looms.', 'AES48 · AES59', 'accent2'],
    ['aes', 'AES3 digital audio', '110 Ω twisted pair (or 75 Ω coax as AES-3id)', 'XLR-3 / BNC', 100, '110 Ω pair ≈ 100 m; 75 Ω coax several hundred metres.', 'AES3 · AES-3id · IEC 60958-4', 'c3'],
    ['madi', 'MADI (64 channels on one cable)', '75 Ω coax or optical fibre', 'BNC / SC', 100, 'Coax ≈ 100 m; multimode fibre up to 2 km. Fibre also breaks ground loops.', 'AES10', 'c3'],
    ['net', 'Audio network (Dante / AES67 / ST 2110)', 'Cat 6A (or fibre between switches)', 'RJ45 / etherCON / LC', 100, '100 m per copper link (90 m fixed + patch leads); fibre for more or between buildings.', 'AES67 · SMPTE ST 2110-30 · ISO/IEC 11801 · TIA-568', 'good'],
    ['video', 'Video to screens / talkback camera', 'SDI coax, HDBaseT over Cat 6A, or fibre', 'BNC / RJ45', 70, 'Passive HDMI only ≈ 10–15 m; 12G-SDI ≈ 70 m; HDBaseT ≈ 70–100 m; fibre beyond.', 'SMPTE ST 2082 (12G-SDI) · HDBaseT', 'warn'],
    ['cue', 'Headphone cue / talkback', 'Line-level pairs or Cat cable to local headphone amps', 'XLR / RJ45', 150, 'Send line level or a network feed and amplify in the studio; avoid long headphone-level runs.', 'AES48', 'c4'],
    ['spk', 'Loudspeaker lines', 'Heavy two-core, kept away from mic lines', 'speakON / terminals', 30, 'Keep amplifiers close to the speakers or use powered speakers fed at line level.', 'IEC 60268-12', 'bad'],
    ['usb', 'USB / KVM / MIDI', 'Active or fibre extenders', 'USB-A/C · 5-pin DIN', 5, 'USB 2.0 ≈ 5 m, USB 3 ≈ 3 m passive; MIDI ≈ 15 m. Use extenders or put the computer in a machine room with KVM.', 'USB-IF · MIDI 1.0', 'muted'],
    ['clock', 'Word clock / sync', '75 Ω coax, terminated', 'BNC', 50, 'Star distribution from a master clock; one 75 Ω termination at the end of each line.', 'AES11', 'muted'],
  ];
  const PATHS = { hole: ['Cables through a drilled hole (unsealed)', 12e-4], b2b: ['Back-to-back wall boxes', 2.5e-4], offset: ['Offset panels + sealed conduit, packed with putty', 3e-6], trench: ['Floor trench / duct with sand or putty seals at each wall', 2e-6], lobby: ['Over the sound lock: two sealed penetrations in series', 6e-7] };
  V.TIE_SIGNALS = SIG;
  V.tieLines = function (host) {
    const on = { mic: true, net: true, cue: true, video: false, line: false, aes: false, madi: false, spk: false, usb: false, clock: false };
    const st = A.controls(host, [
      { key: 'dist', label: 'Cable run between the rooms', type: 'range', min: 0.3, max: 2.7, step: 0.01, value: Math.log10(8), fmt: (v) => fmt(Math.pow(10, v), 2) + ' m' },
      { key: 'bld', label: 'Rooms are in different buildings / on different power', type: 'check', value: false },
      { key: 'path', label: 'How the cables cross the isolation wall', type: 'select', value: 'b2b', options: Object.entries(PATHS).map(([k, v]) => [k, v[0]]) },
      { key: 'wall', label: 'Wall between the rooms', type: 'range', min: 45, max: 75, step: 1, value: 65, fmt: (v) => 'STC ' + v },
    ], () => upd());
    const chips = el('div', { class: 'plan-layers' }); host.appendChild(chips);
    SIG.forEach((s) => { const c = html(`<label class="pill plan-toggle ${on[s[0]] ? 'on' : ''}"><input type="checkbox" ${on[s[0]] ? 'checked' : ''}> ${s[1].split(' (')[0]}</label>`); c.querySelector('input').onchange = (e) => { on[s[0]] = e.target.checked; c.classList.toggle('on', on[s[0]]); upd(); }; chips.appendChild(c); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tbl = el('div'); host.appendChild(tbl);
    const cv = A.canvas(host, {
      height: 250, animate: true,
      caption: 'Section through the wall between control room (left) and studio (right). Coloured dots are your signals travelling through the cable path; red arcs show sound leaking through the same hole. A good tie-line path is long, bent, packed and sealed at both leaves — and its two wall panels are never opposite each other.',
      draw(ctx, w, h, t) {
        t = tPos(t); const cx = w / 2, good = st.path !== 'hole' && st.path !== 'b2b';
        ctx.fillStyle = A.alpha(A.css('good'), 0.06); ctx.fillRect(10, 14, cx - 40, h - 40); ctx.fillStyle = A.alpha(A.css('bad'), 0.06); ctx.fillRect(cx + 30, 14, w - cx - 40, h - 40);
        A.text(ctx, 'Control room', 20, 32, { size: 12, weight: 700 }); A.text(ctx, 'Studio / live room', w - 20, 32, { size: 12, weight: 700, align: 'right' });
        ctx.fillStyle = A.css('muted'); ctx.fillRect(cx - 30, 14, 14, h - 40); ctx.fillRect(cx + 16, 14, 14, h - 40);
        ctx.fillStyle = A.alpha(A.css('c4'), 0.35); ctx.fillRect(cx - 16, 14, 32, h - 40);
        let path;
        if (st.path === 'hole' || st.path === 'b2b') path = [[60, 120], [cx - 30, 120], [cx + 30, 120], [w - 60, 120]];
        else if (st.path === 'offset') path = [[60, 90], [cx - 30, 90], [cx - 8, 90], [cx + 8, 160], [cx + 30, 160], [w - 60, 160]];
        else if (st.path === 'trench') path = [[60, 150], [90, h - 34], [cx - 30, h - 34], [cx + 30, h - 34], [w - 90, h - 34], [w - 60, 150]];
        else path = [[60, 110], [80, 22], [cx - 30, 22], [cx + 30, 22], [w - 80, 22], [w - 60, 110]];
        ctx.strokeStyle = A.alpha(A.css('text'), 0.6); ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.beginPath(); path.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
        ctx.strokeStyle = A.css('panel'); ctx.lineWidth = 5; ctx.stroke(); ctx.lineWidth = 1;
        if (good) path.forEach(([x, y]) => { if (Math.abs(x - (cx - 30)) < 2 || Math.abs(x - (cx + 30)) < 2) dot(ctx, x + (x < cx ? 7 : -7), y, 7, A.css('good')); });
        [[60, path[0][1]], [w - 60, path[path.length - 1][1]]].forEach(([x, y]) => { ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.roundRect(x - 16, y - 22, 32, 44, 4); ctx.fill(); ctx.stroke(); });
        const seg = []; let tot = 0; for (let i = 1; i < path.length; i++) { const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(l); tot += l; }
        SIG.filter((s) => on[s[0]]).forEach((s, k) => { for (let q = 0; q < 2; q++) { let d = ((t * 90 + k * 37 + q * tot / 2) % tot), i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; } const a = path[i], b = path[i + 1], u = d / seg[i]; dot(ctx, a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 3, A.css(s[7])); } });
        if (!good) { const ph = (t * 1.2) % 1; for (let k = 0; k < 2; k++) { const r = (st.path === 'hole' ? 50 : 28) * ((ph + k / 2) % 1); ctx.strokeStyle = A.alpha(A.css('bad'), 1 - (ph + k / 2) % 1); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx - 32, 120, r, Math.PI - 1, Math.PI + 1); ctx.stroke(); } ctx.lineWidth = 1; }
        if (st.bld) A.text(ctx, 'different power/earth: use fibre or transformer isolation', cx, h - 8, { align: 'center', size: 10, weight: 700, color: A.css('warn') });
      },
    });
    function upd() {
      const d = Math.pow(10, st.dist), leak = PATHS[st.path][1], S = 12;
      const tl = -10 * Math.log10(Math.pow(10, -st.wall / 10) + leak / S);
      out.innerHTML = A.statBox('Wall as designed', 'STC ' + st.wall, '') + A.statBox('With this cable path', '≈ ' + fmt(tl, 3) + ' dB', `lost ${fmt(st.wall - tl, 2)} dB`, st.wall - tl > 8 ? 'bad' : st.wall - tl > 2 ? 'warn' : 'good') + A.statBox('Run length', fmt(d, 3) + ' m', d > 100 ? 'think digital / fibre' : d > 30 ? 'balanced lines only' : 'easy');
      tbl.innerHTML = `<div class="table-wrap"><table><tr><th>Signal</th><th>Cable</th><th>Connector</th><th>At ${fmt(d, 2)} m</th><th>Standards</th></tr>${SIG.filter((s) => on[s[0]]).map((s) => { const ok = d <= s[4]; const iso = st.bld && ['mic', 'line', 'aes', 'cue', 'spk', 'usb', 'clock'].includes(s[0]); return `<tr><td><b>${s[1]}</b></td><td>${s[2]}</td><td>${s[3]}</td><td>${ok ? '<span class="good">✓ within reach</span>' : `<span class="bad">✗ beyond ≈ ${s[4]} m</span>`}${iso ? ' <span class="warn">· isolate (transformer) or go fibre</span>' : ''}<br><span class="small muted">${s[5]}</span></td><td class="small">${s[6]}</td></tr>`; }).join('')}</table></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     7. ISO 717-1 single-number rating: watch the reference curve fit
     ====================================================================== */
  const lp = (layers) => P.leafProps(layers);
  const RCONS = {
    stud: ['Single stud wall, 1 × 12.5 mm each side', (f) => P.doubleLeafTL({ leaf1: lp([{ mat: 'gypsum', t: 0.0125 }]), leaf2: lp([{ mat: 'gypsum', t: 0.0125 }]), d: 0.07, filled: true, conn: 'wood' }, f).tl],
    dbl: ['Double stud wall, 2 + 2 layers', (f) => P.doubleLeafTL({ leaf1: lp([{ mat: 'gypsumX', t: 0.015 }, { mat: 'gypsumX', t: 0.015 }]), leaf2: lp([{ mat: 'gypsumX', t: 0.015 }, { mat: 'gypsumX', t: 0.015 }]), d: 0.2, filled: true, conn: 'none' }, f).tl],
    conc: ['150 mm concrete', (f) => P.singleLeafTL(lp([{ mat: 'concrete', t: 0.15 }]), f)],
    glass: ['Double glazing 6 – 16 – 6 mm', (f) => P.doubleLeafTL({ leaf1: lp([{ mat: 'glass', t: 0.006 }]), leaf2: lp([{ mat: 'glass', t: 0.006 }]), d: 0.016, filled: false, conn: 'none', cap: 60 }, f).tl],
  };
  V.ratingFit = function (host) {
    const st = A.controls(host, [{ key: 'c', label: 'Construction', type: 'select', value: 'stud', options: Object.entries(RCONS).map(([k, v]) => [k, v[0]]) }], () => { t0 = performance.now(); upd(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const F = P.THIRDS.slice(3, 19); let t0 = performance.now(), R = [], res = {};
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'How a single number is made (ISO 717-1). The measured curve (orange) is compared with a standard reference curve (green). The reference is slid down in 1 dB steps until the measured curve falls short of it by no more than 32 dB in total (red bars). The reference value at 500 Hz is then the rating R<sub>w</sub>. C and C<sub>tr</sub> say how much worse it is for pink noise and for bass-heavy noise such as traffic or music.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 90, max: 3500, log: true, label: 'Third-octave band (Hz)', ticks: [100, 200, 400, 800, 1600, 3150] }, y: { min: 10, max: 80, label: 'Sound reduction R (dB)' } });
        const el2 = (performance.now() - t0) / 1000, start = res.Rw + 14, cur = Math.max(res.Rw, Math.round(start - el2 * 5)), shift = cur - 52;
        let sum = 0;
        F.forEach((f, i) => { const ref = P.RW_REF[i] + shift, d = ref - R[i]; if (d > 0) { sum += d; ctx.fillStyle = A.alpha(A.css('bad'), 0.6); ctx.fillRect(ax.X(f) - 5, ax.Y(ref), 10, ax.Y(R[i]) - ax.Y(ref)); } });
        A.plotLine(ctx, ax, F.map((f, i) => [f, P.RW_REF[i] + shift]), A.css('good'), 2.4);
        A.plotLine(ctx, ax, F.map((f, i) => [f, R[i]]), A.css('accent'), 2.6);
        dot(ctx, ax.X(500), ax.Y(P.RW_REF[7] + shift), 6, A.css('good'));
        A.text(ctx, `reference at 500 Hz = ${cur} dB · shortfall ${fmt(sum, 3)} dB ${sum <= 32 ? '≤ 32 ✓' : '> 32 — keep sliding'}`, ax.x0 + 8, ax.y1 + 16, { size: 11, weight: 700, color: sum <= 32 ? A.css('good') : A.css('bad'), bg: A.alpha(A.css('panel'), 0.85) });
      },
    });
    function upd() { R = F.map((f) => RCONS[st.c][1](f)); res = P.rw(R); const stc = P.stc(P.THIRDS.slice(4, 20).map((f) => RCONS[st.c][1](f))); out.innerHTML = A.statBox('R<sub>w</sub> (C; C<sub>tr</sub>)', `${res.Rw} (${res.C}; ${res.Ctr}) dB`, 'ISO 717-1') + A.statBox('For music / traffic', `R<sub>w</sub> + C<sub>tr</sub> = ${res.Rw + res.Ctr} dB`, 'the number that matters for bass', res.Ctr <= -8 ? 'warn' : '') + A.statBox('STC (ASTM E413)', String(stc), '125–4 000 Hz, similar method'); cv.redraw(); }
    upd();
  };

  /* ======================================================================
     8. Standards explorer
     ====================================================================== */
  const STD = [
    ['ISO 3382-1', 'room', 'Room acoustic parameters — performance spaces', 'How to measure RT, EDT, clarity (C80/C50), strength (G), lateral fraction in halls and theatres.', 'Commissioning a hall, comparing with design targets.'],
    ['ISO 3382-2', 'room', 'Reverberation time in ordinary rooms', 'Measuring RT (T20/T30) in studios, classrooms, offices: positions, methods, accuracy grades.', 'Your studio RT measurement.'],
    ['ISO 3382-3', 'room', 'Open-plan offices', 'Speech-privacy measures: STI vs distance, distraction distance.', 'Office fit-outs.'],
    ['ISO 354', 'abs', 'Sound absorption in a reverberation room', 'How absorption coefficients are measured from decay times with/without a sample (ASTM C423 is the US equivalent).', 'Reading product data sheets.'],
    ['ISO 11654', 'abs', 'Rating of absorption: α<sub>w</sub> and classes A–E', 'Turns the ISO 354 curve into one number (α<sub>w</sub>) and a class; shape indicators L, M, H.', 'Comparing ceiling tiles and panels (Europe).'],
    ['ISO 10534-2', 'abs', 'Impedance tube (transfer-function method)', 'Normal-incidence absorption and impedance of small samples.', 'Material R&D; small-sample checks.'],
    ['ISO 9053-1', 'abs', 'Static airflow resistance', 'Measures flow resistivity of porous materials.', 'Choosing wool for absorbers.'],
    ['ISO 17497-1 / -2', 'abs', 'Scattering and diffusion coefficients', 'Part 1: random-incidence scattering coefficient (for modelling). Part 2: directional diffusion coefficient (diffuser quality).', 'Comparing diffusers honestly.'],
    ['ISO 10140 (parts 1–5)', 'iso', 'Laboratory sound insulation of building elements', 'Lab tests of walls, floors, doors, windows: airborne R and impact L<sub>n</sub> (ASTM E90/E492 are US equivalents).', 'Product ratings.'],
    ['ISO 16283-1 / -2 / -3', 'iso', 'Field sound insulation', 'On-site airborne (1), impact (2) and façade (3) tests in finished buildings; replaced ISO 140 field parts.', 'Proving what you built.'],
    ['ISO 717-1 / -2', 'iso', 'Single-number ratings', 'Converts third-octave results to R<sub>w</sub>, D<sub>nT,w</sub> (+C, C<sub>tr</sub>) for airborne and L<sub>n,w</sub>, L′<sub>nT,w</sub> for impact.', 'Every European data sheet and regulation.'],
    ['ISO 12354 (EN 12354)', 'iso', 'Predicting building performance from elements', 'Calculates room-to-room insulation including flanking paths from lab data.', 'Design stage.'],
    ['ISO 10848', 'iso', 'Flanking transmission (lab)', 'Measures flanking via junctions (K<sub>ij</sub>).', 'Lightweight and timber construction design.'],
    ['ISO 1996-1 / -2', 'noise', 'Environmental noise: description, measurement, assessment', 'Defines L<sub>Aeq</sub>, rating levels, how to survey.', 'Site noise surveys.'],
    ['ISO 9613-2', 'noise', 'Outdoor sound propagation', 'Engineering method for attenuation with distance, ground, barriers, air.', 'Plant-noise and venue-noise predictions.'],
    ['ISO 226', 'noise', 'Equal-loudness contours', 'How loud pure tones sound versus frequency and level.', 'Why bass needs more level; weighting curves.'],
    ['ISO 3740 series (e.g. ISO 3741, 3744)', 'noise', 'Sound power of sources', 'How loud a machine is, independent of the room.', 'HVAC equipment selection.'],
    ['ISO 266 / IEC 61260-1', 'meas', 'Preferred frequencies / octave-band filters', 'The standard band centres and filter shapes.', 'Every analyser.'],
    ['IEC 61672-1', 'meas', 'Sound level meters', 'Class 1 / Class 2 accuracy, A/C/Z weighting, Fast/Slow.', 'Choosing a meter.'],
    ['ISO 2631 / ISO 10137', 'vib', 'Human exposure to vibration / building serviceability', 'Evaluating vibration felt by people; floor vibration criteria.', 'Floating floors, footfall, railways.'],
    ['ISO 23591', 'room', 'Acoustic quality criteria for music rehearsal rooms', 'Room volume, height, RT and noise criteria by ensemble type.', 'Rehearsal and practice rooms.'],
    ['ISO 2603 / ISO 4043', 'room', 'Interpreters’ booths (permanent / mobile)', 'Size, isolation, ventilation and noise limits for booths.', 'A useful benchmark for voice booths.'],
    ['BS 8233:2014', 'uk', 'Guidance on sound insulation and noise reduction for buildings', 'Recommended indoor ambient levels (e.g. bedrooms 30 dB L<sub>Aeq</sub> at night, living rooms 35 dB by day) and design guidance.', 'UK design targets for the neighbour’s side of your wall.'],
    ['BS 4142:2014+A1:2019', 'uk', 'Rating and assessing industrial and commercial sound', 'Compares a rating level (with penalties for tones/impulses) against the background L<sub>A90</sub>.', 'Outdoor plant (condensers, fans) near neighbours.'],
    ['BS 5228-1 / -2', 'uk', 'Noise and vibration on construction sites', 'Predicting and controlling construction noise and vibration.', 'During the build.'],
    ['BS 6472-1:2008', 'uk', 'Human exposure to vibration in buildings', 'Vibration dose values and likelihood of adverse comment.', 'Near railways; drum rooms above dwellings.'],
    ['Approved Document E (England)', 'uk', 'Building Regulations: resistance to the passage of sound', 'Minimum performance between dwellings: airborne D<sub>nT,w</sub> + C<sub>tr</sub> ≥ 45 dB (new build), impact L′<sub>nT,w</sub> ≤ 62 dB; pre-completion testing.', 'Studios in or next to dwellings — the legal floor, far below studio needs.'],
    ['BB93', 'uk', 'Acoustic design of schools', 'Noise, insulation and RT criteria for school rooms incl. music rooms.', 'School music and recording rooms.'],
    ['BS EN ISO … ', 'uk', 'British adoptions of ISO/EN standards', 'Most ISO acoustics standards are published in the UK as BS EN ISO with identical text (e.g. BS EN ISO 3382-2, 16283-1, 717-1).', 'Same content, UK designation.'],
    ['BS 7671', 'uk', 'IET Wiring Regulations', 'UK electrical installation requirements (earthing, protection).', 'All studio electrics in the UK.'],
    ['EBU Tech 3276', 'studio', 'Listening conditions for sound programme assessment', 'Reference listening rooms: RT, response tolerance, reflections, noise (NR 10–15), speaker set-up.', 'Control-room targets.'],
    ['ITU-R BS.1116 / BS.775', 'studio', 'Critical listening rooms / multichannel layout', 'Room and system requirements for subjective tests; 5.1 speaker angles.', 'Mastering and surround rooms.'],
    ['AES48 / AES67 / AES3 / AES10', 'studio', 'Audio interconnection standards', 'Shield grounding (48), audio-over-IP interoperability (67), digital audio (3), MADI (10).', 'Tie-lines and wiring.'],
    ['ANSI/ASA S12.2 (NC) · NR curves', 'noise', 'Room-noise criteria', 'Octave-band curves for rating background noise: NC (US) and NR (Europe).', 'HVAC noise targets.'],
  ];
  const CATS = { all: 'All', room: 'Room acoustics', abs: 'Absorption & diffusion', iso: 'Sound insulation', noise: 'Noise', meas: 'Measurement kit', vib: 'Vibration', uk: 'British standards & UK rules', studio: 'Studio & broadcast' };
  V.STANDARDS = STD;
  V.standardsExplorer = function (host) {
    let cat = 'all', q = '';
    const bar = el('div', { class: 'plan-layers' }); host.appendChild(bar);
    Object.entries(CATS).forEach(([k, l]) => { const b = el('button', { class: 'pill' + (k === cat ? ' on' : ''), 'data-c': k }, l); b.onclick = () => { cat = k; A.$$('button', bar).forEach((x) => x.classList.toggle('on', x.dataset.c === k)); draw(); }; bar.appendChild(b); });
    const inp = el('input', { type: 'search', placeholder: 'Search a number or a word (e.g. 717, reverberation, door)…', style: { width: '100%', margin: '6px 0' } }); inp.oninput = () => { q = inp.value.toLowerCase(); draw(); }; host.appendChild(inp);
    const grid = el('div', { class: 'std-grid' }); host.appendChild(grid);
    function draw() {
      const list = STD.filter((s) => (cat === 'all' || s[1] === cat) && (!q || s.join(' ').toLowerCase().includes(q)));
      grid.innerHTML = list.map((s) => `<div class="std-card c-${s[1]}"><div class="std-no">${s[0]}</div><div class="std-cat">${CATS[s[1]]}</div><h4>${s[2]}</h4><p>${s[3]}</p><div class="std-use"><b>Use it for:</b> ${s[4]}</div></div>`).join('') || '<p class="muted">No match.</p>';
    }
    draw();
  };
})();
