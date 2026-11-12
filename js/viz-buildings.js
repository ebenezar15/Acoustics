/* ==========================================================================
   Acoustica — building-type acoustics, plant noise, speech intelligibility
   and stage monitoring widgets. Simplified, indicative teaching models.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const tp = (t) => Math.max(0, t);
  const tips = (box, list, cls = 'mentor') => { box.innerHTML = `<div class="callout ${cls}"><ul style="margin:0;padding-left:18px">${list.map((x) => `<li>${x}</li>`).join('')}</ul></div>`; };

  /* ======================================================================
     1. Building-type criteria explorer
     ====================================================================== */
  // [name, category, RT text or Stephens–Bate factor, noise, insulation, intelligibility, top problem, top solution]
  const TYPES = [
    ['Open-plan office', 'work', '0.4–0.6 s', 'NC 35–40 · 40–45 dBA (often with masking)', 'Low between desks; screens + distance', 'Low is the goal between teams (privacy)', 'Colleagues’ speech is intelligible 10 m away', 'Class A ceiling, screens ≥ 1.4 m, masking sound, quiet rooms'],
    ['Cellular office / meeting room', 'work', '0.4–0.6 s', 'NC 30–35', 'DnT,w ≈ 40–50 dB between rooms', 'High inside, private outside', 'Speech leaks over the partition via the ceiling void', 'Walls to the slab or ceiling barriers; sealed doors; crosstalk silencers'],
    ['Video-conference room', 'work', '0.4–0.5 s', 'NC 25–30', 'DnT,w ≈ 45–50 dB', 'Very high (microphones hear the room)', 'Boomy, echoey far-end sound', 'Absorb two adjacent walls + ceiling; table mics close to talkers'],
    ['Restaurant / café', 'social', '0.5–0.8 s', 'Design for ≤ 70–72 dBA occupied', 'To neighbours and dwellings above', 'Conversation at 1 m', 'Noise spirals as guests raise their voices', '≈ 1.5–3 m² of absorption per seat; ceilings, banquettes, curtains'],
    ['Dwelling / flat', 'living', 'Furnished ≈ 0.4–0.6 s', '25–30 dBA bedrooms, 30–35 living', 'DnT,w + Ctr ≈ 45–55 dB; impact L′nT,w ≈ 50–62', '—', 'Footsteps, plumbing and neighbours’ bass', 'Floating floors, resilient ceilings, boxed and lagged pipes'],
    ['Hotel bedroom', 'living', '≈ 0.5 s', '25–30 dBA (NC 25–30)', 'DnT,w ≈ 50–55 dB; corridor door ≈ 35 dB', '—', 'Corridor noise and connecting doors', 'Lobbied entries, sealed doors, quiet fan-coil units'],
    ['Hospital ward / consulting', 'living', '0.5–0.8 s', '30–40 dBA; lower at night', 'DnT,w ≈ 45–50 dB (privacy)', 'High at the bedside; private between rooms', 'Alarms, trolleys, hard cleanable surfaces', 'Cleanable absorbent ceilings, door seals, alarm management'],
    ['Classroom', 'learn', 4.2, 'NC 25–30 · ≤ 35 dBA', 'DnT,w ≈ 45–50 dB', 'Very high: signal ≥ 15 dB above noise', 'Long RT + noisy ventilation = lost consonants', 'Absorbent ceiling + rear wall, quiet HVAC, short distances'],
    ['Lecture hall', 'learn', 4.6, 'NC 25–30', 'DnT,w ≈ 50 dB', 'Very high', 'Rear rows lose clarity', 'Reflective front + ceiling reflectors, absorbent rear, speech system'],
    ['Music practice / teaching room', 'learn', '0.4–0.8 s (variable is best)', 'NC 25', 'DnT,w ≈ 55–65 dB', '—', 'Loudness and room-to-room leakage', 'Box-in-box or heavy walls, door lobbies, mixed absorption + diffusion'],
    ['Sports hall / swimming pool', 'learn', '1.5–2.0 s (as low as practical)', 'NC 40–45', 'To adjacent teaching spaces', 'Instruction + emergency announcements', 'Huge hard volume: shouting, whistles, echoes', 'Impact-/moisture-resistant absorbers on roof and upper walls'],
    ['Place of worship', 'perform', 5.6, 'NC 25–30', 'From traffic / to neighbours', 'High for speech; warmth for music', 'Speech and organ want opposite acoustics', 'Column / steered arrays for speech; keep volume for music; variable drapes'],
    ['Cinema', 'perform', '0.3–0.6 s (volume-dependent, flat)', 'NC 25–30; premium ≤ NC 20', 'DnT,w ≈ 65–70 dB between screens', 'High (dialogue)', 'Bass from the next screen; projector/HVAC noise', 'Independent double walls, floated structures, absorptive walls'],
    ['Drama theatre', 'perform', 4.4, 'NC 20–25', 'High from foyer, street, rain', 'Very high, unamplified', 'Weak voice at the back; noisy plant', 'Short distances, reflectors, moderate RT, very quiet ventilation'],
    ['Opera house', 'perform', 5.0, 'NC 15–20', 'High', 'High (text) with musical bloom', 'Balance between pit and singers', 'Pit overhang design, horseshoe balconies, RT ≈ 1.3–1.8 s'],
    ['Concert hall (symphonic)', 'perform', 6.0, 'NC 15 (≤ 20 dBA)', 'Very high — often box-in-box', '—', 'Lack of warmth or early lateral sound', 'Shoebox/vineyard geometry, ≈ 8–12 m³ per seat, diffusion'],
    ['Multipurpose hall', 'perform', '1.0–2.0 s variable', 'NC 20–25', 'High', 'High for speech uses', 'One acoustic cannot suit every use', 'Banners, moveable ceilings/chambers, stage shell, enhancement systems'],
    ['Stadium / outdoor venue', 'big', 'Open air; roofed bowls 2–5 s', 'Crowd 95–105 dBA at peaks', 'Community noise limits at the boundary', 'Announcements and emergency messages', 'Echoes, long distances, weather, neighbours', 'Distributed/delayed clusters, steep aiming, noise management plan'],
    ['Station concourse / atrium', 'big', '2–5 s unless treated', '55–70 dBA activity noise', '—', 'Voice alarm must be understood', 'Announcements become mush', 'Absorption wherever possible + many directional loudspeakers close to people'],
    ['Factory / workshop', 'big', 'As low as practical', 'Exposure limits: action at 80–85 dBA', 'Enclosures; to offices and neighbours', 'Warning signals audible', 'Hearing damage risk', 'Quieter machines first, enclosures, barriers, absorbers, hearing protection'],
  ];
  const CAT = { all: 'All', work: 'Workplaces', social: 'Eating & drinking', living: 'Living, sleeping & care', learn: 'Learning & sport', perform: 'Performance', big: 'Large & industrial' };
  V.BUILDING_TYPES = TYPES;
  V.buildingCriteria = function (host) {
    let cat = 'all', q = '';
    const st = A.controls(host, [{ key: 'vol', label: 'Room volume (for the volume-dependent rooms)', type: 'range', min: 2, max: 4.4, step: 0.02, value: Math.log10(1500), fmt: (v) => fmt(Math.round(Math.pow(10, v) / 10) * 10, 0) + ' m³' }], () => draw());
    const bar = el('div', { class: 'plan-layers' }); host.appendChild(bar);
    Object.entries(CAT).forEach(([k, l]) => { const b = el('button', { class: 'pill' + (k === cat ? ' on' : ''), 'data-c': k }, l); b.onclick = () => { cat = k; A.$$('button', bar).forEach((x) => x.classList.toggle('on', x.dataset.c === k)); draw(); }; bar.appendChild(b); });
    const inp = el('input', { type: 'search', placeholder: 'Search a room type or a word (e.g. privacy, bass, alarm)…', style: { width: '100%', margin: '6px 0' } }); inp.oninput = () => { q = inp.value.toLowerCase(); draw(); }; host.appendChild(inp);
    const grid = el('div', { class: 'std-grid' }); host.appendChild(grid);
    const cls = { work: 'c-iso', social: 'c-noise', living: 'c-uk', learn: 'c-studio', perform: 'c-abs', big: 'c-vib' };
    function draw() {
      const Vm = Math.pow(10, st.vol);
      const list = TYPES.filter((s) => (cat === 'all' || s[1] === cat) && (!q || s.join(' ').toLowerCase().includes(q)));
      grid.innerHTML = list.map((s) => {
        const rt = typeof s[2] === 'number' ? `≈ ${fmt(P.stephensBate(Vm, s[2]) * 0.9, 1)}–${fmt(P.stephensBate(Vm, s[2]) * 1.1, 1)} s at ${fmt(Math.round(Vm / 10) * 10, 0)} m³` : s[2];
        return `<div class="std-card ${cls[s[1]]}"><div class="std-no">${s[0]}</div><div class="std-cat">${CAT[s[1]]} · typical guidance</div><p style="margin-top:6px"><b>Reverberation:</b> ${rt}<br><b>Background noise:</b> ${s[3]}<br><b>Insulation:</b> ${s[4]}<br><b>Intelligibility:</b> ${s[5]}</p><div class="std-use"><b>Usual problem:</b> ${s[6]}<br><b>Proven fix:</b> ${s[7]}</div></div>`;
      }).join('') || '<p class="muted">No match.</p>';
    }
    draw();
  };

  /* ======================================================================
     2. Restaurant noise — the Lombard spiral
     ====================================================================== */
  V.restaurantNoise = function (host) {
    const st = A.controls(host, [
      { key: 'seats', label: 'Seats', type: 'range', min: 10, max: 300, step: 5, value: 80 },
      { key: 'occ', label: 'Occupancy', type: 'range', min: 10, max: 100, step: 5, value: 80, unit: '%' },
      { key: 'vol', label: 'Room volume', type: 'range', min: 80, max: 3000, step: 10, value: 400, unit: 'm³' },
      { key: 'ab', label: 'Finishes', type: 'range', min: 0.04, max: 0.4, step: 0.01, value: 0.08, fmt: (v) => (v < 0.1 ? 'bare: glass, plaster, tile' : v < 0.2 ? 'some soft furnishing' : v < 0.3 ? 'absorbent ceiling' : 'ceiling + walls treated') },
      { key: 'music', label: 'Background music level', type: 'range', min: 40, max: 85, step: 1, value: 60, unit: 'dBA' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc(ab = st.ab) {
      const N = Math.max(1, Math.round((st.seats * st.occ) / 100)), S = 6.6 * Math.pow(st.vol, 2 / 3);
      const Aabs = S * ab + N * 0.35, talkers = Math.max(1, N / 3.5);
      let LN = 60, LS = 58;
      for (let i = 0; i < 60; i++) { LS = A.clamp(55 + 0.5 * (LN - 45), 55, 82); const sp = LS + 11 + 10 * Math.log10(talkers) + 10 * Math.log10(4 / Aabs); LN = 0.5 * LN + 0.5 * P.dbSum([sp, st.music, 38]); }
      return { N, Aabs, LN, LS, snr: LS - LN, rt: P.sabine(st.vol, Aabs), perSeat: Aabs / N };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 250, animate: true,
      caption: 'Each dot is a table; the rings are voices. As the room gets noisier people raise their voices (roughly half a decibel for every decibel of noise), which makes it noisier still — the Lombard spiral. Absorption is the only thing that breaks the loop: more absorbing area per guest means everyone can speak quietly again.',
      draw(ctx, w, h, t) {
        const r = R, n = Math.min(40, Math.max(3, Math.round(r.N / 4))), cols = Math.ceil(Math.sqrt(n * (w / h))), rows = Math.ceil(n / cols), loud = A.clamp((r.LN - 55) / 30, 0.05, 1);
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(8, 8, w - 16, h - 16); ctx.lineWidth = 1;
        if (st.ab > 0.2) { ctx.fillStyle = A.alpha(A.css('c4'), 0.6); ctx.fillRect(10, 10, w - 20, 6); } if (st.ab > 0.3) { ctx.fillStyle = A.alpha(A.css('c4'), 0.6); ctx.fillRect(10, 10, 6, h - 20); ctx.fillRect(w - 16, 10, 6, h - 20); }
        for (let i = 0; i < n; i++) {
          const x = 30 + ((i % cols) + 0.5) * ((w - 60) / cols), y = 28 + (Math.floor(i / cols) + 0.5) * ((h - 56) / rows);
          for (let k = 0; k < 2; k++) { const ph = ((tp(t) * (0.5 + loud) + i * 0.37 + k / 2) % 1); ctx.strokeStyle = A.alpha(loud > 0.6 ? A.css('bad') : loud > 0.4 ? A.css('warn') : A.css('good'), (1 - ph) * 0.8); ctx.beginPath(); ctx.arc(x, y, 5 + ph * (10 + 40 * loud), 0, TAU); ctx.stroke(); }
          dot(ctx, x, y, 5, A.css('text'));
        }
      },
    });
    function upd() {
      R = calc(); const r = R;
      let need = null; for (let a = 0.04; a <= 0.6; a += 0.01) { if (calc(a).LN <= 70) { need = calc(a); break; } }
      const v = r.snr > 1 ? ['Easy conversation', 'good'] : r.snr > -3 ? ['Raised voices needed', 'warn'] : ['Shouting across the table', 'bad'];
      out.innerHTML = A.statBox('Noise level, room in use', fmt(r.LN, 0) + ' dBA', r.LN > 80 ? 'staff exposure worth checking' : r.LN > 72 ? 'loud' : 'comfortable', r.LN > 78 ? 'bad' : r.LN > 72 ? 'warn' : 'good') + A.statBox('Talking across the table (1 m)', v[0], `voice ${fmt(r.LS, 0)} dBA vs noise`, v[1]) + A.statBox('Reverberation time', fmt(r.rt, 1) + ' s', 'occupied') + A.statBox('Absorption per guest', fmt(r.perSeat, 1) + ' m²', need ? `≈ ${fmt(need.perSeat, 1)} m² needed for ≤ 70 dBA` : 'music alone exceeds 70 dBA');
      const T = [];
      if (r.LN > 72 && st.ab < 0.25) T.push('Add absorption: an absorbent ceiling is the single biggest step; then upholstered seating, curtains and wall panels at ear height.');
      if (st.music > r.LN - 6 && st.music > 65) T.push('The music is driving the spiral — guests talk over it. Turn it down 5 dB, or zone it away from dining tables.');
      if (r.perSeat < 1.5) T.push('Rule of thumb: aim for roughly 1.5–3 m² of absorption per seat (more for lively venues).');
      if (!T.length) T.push('Comfortable: guests can talk at normal effort. Keep kitchen and bar noise screened, and check the level again at full occupancy.');
      tips(tip, T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Open-plan office — speech decay and distraction distance
     ====================================================================== */
  const CEIL = { hard: ['Hard ceiling (plaster / exposed slab)', 3.5], mid: ['Standard mineral tile (class C)', 5.5], good: ['High-performance absorbent ceiling (class A)', 7.5] };
  V.openOffice = function (host) {
    const st = A.controls(host, [
      { key: 'ceil', label: 'Ceiling', type: 'select', value: 'mid', options: Object.entries(CEIL).map(([k, v]) => [k, v[0]]) },
      { key: 'scr', label: 'Screen height between desks', type: 'range', min: 0, max: 1.8, step: 0.1, value: 1.1, fmt: (v) => (v ? fmt(v, 1) + ' m' : 'none') },
      { key: 'gap', label: 'Desk spacing', type: 'range', min: 1.4, max: 4, step: 0.1, value: 2, unit: 'm' },
      { key: 'bg', label: 'Background sound (ventilation)', type: 'range', min: 28, max: 45, step: 1, value: 35, unit: 'dBA' },
      { key: 'mask', label: 'Sound masking system on (≈ 43–45 dBA, speech-shaped)', type: 'check', value: false },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const D2 = CEIL[st.ceil][1] + (st.scr > 1.2 ? (st.scr - 1.2) * 4 + 1 : 0), bg = st.mask ? Math.max(st.bg, 44) : st.bg;
      const L = (r) => 57 - D2 * Math.log2(Math.max(1, r)) - (st.scr > 1.2 && r > st.gap * 0.8 ? 2 : 0);
      const rD = Math.pow(2, (57 - bg + 1) / D2), rP = Math.pow(2, (57 - bg + 9) / D2);
      return { D2, bg, L, rD, rP };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: plan of desks around one talker. A desk is marked when that person can follow the conversation without trying (they are inside the distraction distance). Right: speech level against distance with the background level as a line — where the two meet, speech stops being understandable. Absorbent ceilings and screens steepen the fall; masking raises the line.',
      draw(ctx, w, h, t) {
        const r = R, lw = Math.min(w * 0.45, 400), cx = lw / 2, cy = h / 2, sc = (lw - 20) / 26;
        for (let ix = -6; ix <= 6; ix++) for (let iy = -3; iy <= 3; iy++) {
          const x = ix * st.gap, y = iy * st.gap; if (Math.abs(x) * sc > lw / 2 - 8 || Math.abs(y) * sc > h / 2 - 8) continue;
          const d = Math.hypot(x, y), px = cx + x * sc, py = cy + y * sc;
          if (!ix && !iy) continue;
          ctx.fillStyle = d < r.rD ? A.css('bad') : d < r.rP ? A.css('warn') : A.css('good'); ctx.fillRect(px - 5, py - 4, 10, 8);
        }
        [[r.rD, 'bad'], [r.rP, 'good']].forEach(([rr, c]) => { ctx.setLineDash([5, 4]); ctx.strokeStyle = A.css(c); ctx.beginPath(); ctx.arc(cx, cy, Math.min(rr * sc, lw), 0, TAU); ctx.stroke(); ctx.setLineDash([]); });
        for (let k = 0; k < 3; k++) { const ph = ((tp(t) * 0.5 + k / 3) % 1); ctx.strokeStyle = A.alpha(A.css('accent'), 1 - ph); ctx.beginPath(); ctx.arc(cx, cy, ph * Math.min(r.rD * sc, lw / 2), 0, TAU); ctx.stroke(); }
        dot(ctx, cx, cy, 6, A.css('accent'));
        const ax = A.axes(ctx, w, h, { x: { min: 1, max: 32, log: true, label: 'Distance from the talker (m)', ticks: [1, 2, 4, 8, 16, 32], fmt: (v) => String(v) }, y: { min: 20, max: 60, label: 'Speech level (dBA)' }, pad: { l: lw + 52, r: 12, t: 14, b: 36 } });
        const pts = []; for (let d = 1; d <= 32; d *= 1.1) pts.push([d, Math.max(20, r.L(d))]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.8);
        A.plotLine(ctx, ax, [[1, r.bg], [32, r.bg]], A.css('muted'), 1.6, [5, 4]);
        A.text(ctx, st.mask ? 'masking sound' : 'background', ax.x1 - 4, ax.Y(r.bg) - 5, { align: 'right', size: 10, color: A.css('muted') });
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Speech falls by', fmt(r.D2, 1) + ' dB', 'per doubling of distance', r.D2 >= 7 ? 'good' : r.D2 >= 5 ? 'warn' : 'bad') + A.statBox('Distraction distance', fmt(r.rD, 1) + ' m', r.rD <= 5 ? 'good' : r.rD <= 8 ? 'typical' : 'poor', r.rD <= 5 ? 'good' : r.rD <= 8 ? 'warn' : 'bad') + A.statBox('Privacy distance', fmt(r.rP, 1) + ' m', 'speech no longer followed') + A.statBox('Desks disturbed by one talker', String(Math.max(0, Math.round((Math.PI * r.rD * r.rD) / (st.gap * st.gap)) - 1)), 'within the distraction distance');
      const T = [];
      if (st.ceil !== 'good') T.push('Upgrade the ceiling first: a class A absorbent ceiling is the foundation of every good open-plan office.');
      if (st.scr < 1.3) T.push('Screens below about 1.3–1.4 m do little: sound passes over seated heads. Use taller, absorbent screens between teams, not between every desk.');
      if (!st.mask && st.bg < 38) T.push('A very quiet ventilation system makes every word audible. A gentle masking sound around 43–45 dBA shortens the distraction distance considerably.');
      if (st.mask) T.push('Masking only works with absorption: on its own it just makes the office louder. Keep it smooth, speech-shaped and below about 45–48 dBA.');
      T.push('Plan by activity: phone-heavy teams together, focus work furthest away, and enough enclosed rooms for calls and meetings.');
      tips(tip, T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Hall RT by use, with variable acoustics
     ====================================================================== */
  const USES = { amp: ['Amplified music / cinema', 0.6, 1.1, 4, 6], speech: ['Speech / conference', 0.8, 1.2, 3, 5], drama: ['Drama', 0.9, 1.3, 4, 6], opera: ['Opera', 1.3, 1.8, 6, 9], chamber: ['Chamber music', 1.4, 1.8, 6, 9], symph: ['Symphonic music', 1.8, 2.2, 8, 12], organ: ['Organ / choral', 2.2, 3.2, 10, 14] };
  V.hallRT = function (host) {
    const st = A.controls(host, [
      { key: 'use', label: 'Main use the hall is built for', type: 'select', value: 'symph', options: Object.entries(USES).map(([k, v]) => [k, v[0]]) },
      { key: 'seats', label: 'Seats', type: 'range', min: 100, max: 2500, step: 50, value: 900 },
      { key: 'ban', label: 'Variable absorption deployed (banners, curtains)', type: 'range', min: 0, max: 100, step: 5, value: 0, unit: '%' },
      { key: 'cham', label: 'Reverberation chambers / raised ceiling open', type: 'check', value: false },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const u = USES[st.use], vps = (u[3] + u[4]) / 2, V0 = st.seats * vps, rt0 = (u[1] + u[2]) / 2;
      const A0 = (0.161 * V0) / rt0, Aban = A0 * 0.9 * (st.ban / 100), Vc = V0 * (st.cham ? 1.25 : 1);
      const rt = (0.161 * Vc) / (A0 * (st.cham ? 1.08 : 1) + Aban);
      const fits = Object.entries(USES).filter(([, v]) => rt >= v[1] * 0.95 && rt <= v[2] * 1.05).map(([, v]) => v[0]);
      return { u, vps, V0, rt, fits };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 280, animate: true,
      caption: 'Top: a schematic section of the hall — banners drop down the side walls as you deploy them and the roof volume opens with the chambers. Bottom: recommended mid-frequency reverberation bands for each use, with a marker for this hall as currently set. One fixed acoustic cannot serve speech and symphony; variable devices move the marker.',
      draw(ctx, w, h, t) {
        const r = R, sh = 96, x0 = 30, x1 = w - 30;
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, sh); ctx.lineTo(x0, st.cham ? 8 : 26); ctx.lineTo(x1, st.cham ? 8 : 26); ctx.lineTo(x1, sh); ctx.lineTo(x1 - 60, sh); ctx.lineTo(x0 + 110, sh - 26); ctx.lineTo(x0 + 110, sh); ctx.closePath(); ctx.stroke(); ctx.lineWidth = 1;
        if (st.cham) { ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0, 26); ctx.lineTo(x1, 26); ctx.stroke(); ctx.setLineDash([]); }
        ctx.fillStyle = A.css('accent2'); ctx.fillRect(x0 + 20, sh - 8, 70, 8);
        const drop = (st.ban / 100) * 50; ctx.fillStyle = A.alpha(A.css('c4'), 0.8); for (let k = 0; k < 6; k++) ctx.fillRect(x0 + 140 + k * ((x1 - x0 - 220) / 5), 28, 10, drop);
        const life = A.clamp(r.rt / 3, 0.1, 1);
        for (let k = 0; k < 3; k++) { const ph = ((tp(t) * 0.4 + k / 3) % 1); ctx.strokeStyle = A.alpha(A.css('accent'), (1 - ph) * life); ctx.beginPath(); ctx.arc(x0 + 55, sh - 12, ph * (x1 - x0) * 0.9 * life, -1.2, 0.1); ctx.stroke(); }
        const ax = A.axes(ctx, w, h, { x: { min: 0.4, max: 3.4, label: 'Mid-frequency reverberation time (s)' }, y: { min: 0, max: 7, label: '' }, pad: { l: w < 600 ? 110 : 170, r: 14, t: sh + 16, b: 36 } });
        Object.entries(USES).forEach(([k, v], i) => { const y = ax.Y(6.5 - i), on = k === st.use; ctx.fillStyle = A.alpha(on ? A.css('accent') : A.css('muted'), on ? 0.8 : 0.4); ctx.fillRect(ax.X(v[1]), y - 6, ax.X(v[2]) - ax.X(v[1]), 12); A.text(ctx, v[0], ax.x0 - 6, y + 4, { align: 'right', size: w < 600 ? 9 : 10, weight: on ? 700 : 500 }); });
        const X = ax.X(A.clamp(r.rt, 0.4, 3.4)); ctx.strokeStyle = A.css('bad'); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X, ax.y1); ctx.lineTo(X, ax.y0); ctx.stroke(); ctx.lineWidth = 1;
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Design target', `${r.u[1]}–${r.u[2]} s`, r.u[0]) + A.statBox('Volume per seat', `${r.u[3]}–${r.u[4]} m³`, `≈ ${fmt(Math.round(r.V0 / 100) * 100, 0)} m³ in total`) + A.statBox('Reverberation now', fmt(r.rt, 2) + ' s', st.ban || st.cham ? 'with variable devices' : 'as built', '') + A.statBox('Suits', r.fits.length ? r.fits.join(', ') : 'between uses', '', r.fits.length ? 'good' : 'warn');
      const T = [];
      if (st.use === 'speech' || st.use === 'amp') T.push('A hall built small and dry for speech cannot be made reverberant with curtains — you can only remove reverberation, not add volume. For occasional music consider an electronic enhancement system.');
      else T.push('Build the volume for the most reverberant use, then tame it for the others with retractable banners and curtains (they need to be heavy, pleated and hung off the wall to work at low-mid frequencies).');
      if (st.ban > 60) T.push('Fully deployed banners mostly remove mid and high frequencies; the bass stays long. Add low-frequency variable absorption or accept a warmer amplified sound.');
      if (st.cham) T.push('Coupled chambers and raised ceilings add late reverberation without losing clarity — the decay becomes double-sloped.');
      tips(tip, T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Plant noise at a neighbour
     ====================================================================== */
  const PLANT = { hp: ['Domestic heat pump', 62], cond: ['Rooftop condenser unit', 74], kit: ['Kitchen extract fan + duct outlet', 82], ahu: ['Air-handling unit (outdoor)', 86], chil: ['Air-cooled chiller', 96], gen: ['Standby generator (open set)', 108] };
  V.plantNoise = function (host) {
    const st = A.controls(host, [
      { key: 'eq', label: 'Equipment', type: 'select', value: 'cond', options: Object.entries(PLANT).map(([k, v]) => [k, `${v[0]} — sound power ≈ ${v[1]} dBA`]) },
      { key: 'n', label: 'Number of units', type: 'range', min: 1, max: 8, step: 1, value: 2 },
      { key: 'd', label: 'Distance to the neighbour’s window', type: 'range', min: 3, max: 150, step: 1, value: 20, unit: 'm' },
      { key: 'refl', label: 'Unit stands against a wall (reflection)', type: 'check', value: true },
      { key: 'ctrl', label: 'Noise control', type: 'select', value: 'none', options: [['none', 'None'], ['bar', 'Solid barrier just breaking the line of sight'], ['barhi', 'Tall barrier well above the line of sight'], ['sil', 'Attenuators / acoustic louvres on the unit'], ['enc', 'Full acoustic enclosure with silenced openings']] },
      { key: 'bgn', label: 'Background level at the neighbour (night, LA90)', type: 'range', min: 25, max: 55, step: 1, value: 35, unit: 'dBA' },
      { key: 'tone', label: 'Noise has a tonal hum or whine (+ penalty)', type: 'check', value: false },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const CT = { none: 0, bar: 7, barhi: 14, sil: 10, enc: 22 };
    function calc() {
      const lw = PLANT[st.eq][1] + 10 * Math.log10(st.n);
      const lp = lw - 20 * Math.log10(st.d) - 8 + (st.refl ? 3 : 0) - CT[st.ctrl];
      const rating = lp + (st.tone ? 5 : 0);
      return { lw, lp, rating, margin: rating - st.bgn };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 230, animate: true,
      caption: 'Section: the plant on the left, the neighbour’s window on the right. Rings are sound leaving the unit; they fade with distance (about 6 dB per doubling outdoors) and are cut by the barrier or enclosure. The assessment compares a rating level at the window (with a penalty for tones) against the existing background sound there.',
      draw(ctx, w, h, t) {
        const r = R, gy = h - 34, ux = 70, hx = w - 70;
        ctx.fillStyle = A.css('muted'); ctx.fillRect(10, gy, w - 20, 4);
        if (st.refl) { ctx.fillStyle = A.alpha(A.css('muted'), 0.6); ctx.fillRect(22, gy - 110, 12, 110); }
        ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(ux - 26, gy - 40, 52, 40, 4); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1;
        if (st.ctrl === 'enc') { ctx.strokeStyle = A.css('good'); ctx.lineWidth = 4; ctx.strokeRect(ux - 36, gy - 52, 72, 52); ctx.lineWidth = 1; }
        if (st.ctrl === 'sil') { ctx.fillStyle = A.css('good'); ctx.fillRect(ux + 26, gy - 36, 12, 32); }
        if (st.ctrl === 'bar' || st.ctrl === 'barhi') { ctx.fillStyle = A.css('good'); const bh = st.ctrl === 'bar' ? 62 : 100; ctx.fillRect(ux + 60, gy - bh, 8, bh); }
        ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(hx - 30, gy - 100, 60, 100); ctx.lineWidth = 1; ctx.fillStyle = A.css('c3'); ctx.fillRect(hx - 30, gy - 70, 6, 26);
        const str = A.clamp((r.lp - 20) / 50, 0.05, 1), cut = CT[st.ctrl] ? 0.45 : 1;
        for (let k = 0; k < 5; k++) { const ph = ((tp(t) * 0.35 + k / 5) % 1), rr = ph * (hx - ux); ctx.strokeStyle = A.alpha(r.margin > 5 ? A.css('bad') : r.margin > 0 ? A.css('warn') : A.css('good'), (1 - ph) * (rr > 70 ? cut : 1) * (0.3 + 0.7 * str)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ux, gy - 20, rr, -Math.PI / 2 - 0.2, 0.05); ctx.stroke(); }
        ctx.lineWidth = 1;
        A.text(ctx, `${fmt(r.lp, 0)} dBA at the window`, hx, gy - 108, { align: 'center', size: 11, weight: 700 });
        A.text(ctx, `${st.d} m`, (ux + hx) / 2, gy + 18, { align: 'center', size: 10, color: A.css('muted') });
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Total sound power', fmt(r.lw, 0) + ' dBA', `${st.n} unit${st.n > 1 ? 's' : ''}`) + A.statBox('Level at the window', fmt(r.lp, 0) + ' dBA', `control: −${CT[st.ctrl]} dB`) + A.statBox('Rating level', fmt(r.rating, 0) + ' dBA', st.tone ? 'includes +5 dB for tone' : 'no character penalty') + A.statBox('Versus background', (r.margin > 0 ? '+' : '') + fmt(r.margin, 0) + ' dB', r.margin <= 0 ? 'low impact' : r.margin <= 5 ? 'adverse impact likely' : 'significant adverse impact likely', r.margin <= 0 ? 'good' : r.margin <= 5 ? 'warn' : 'bad');
      const T = [];
      if (r.margin > 0) {
        T.push(`You need about <b>${fmt(Math.ceil(r.margin), 0)} dB</b> more reduction. In order of cost: choose a quieter unit or a night set-back mode, move it further away or behind the building, then barriers, attenuators and enclosures.`);
        if (st.d < 15) T.push('Doubling the distance gives 6 dB. Moving the plant to the far side of the roof is often worth more than a barrier.');
        if (st.ctrl === 'bar') T.push('A barrier that only just hides the unit gives 5–8 dB. Make it taller, closer to the source, solid (≥ 10 kg/m²) and absorbent on the plant side.');
        if (st.tone) T.push('Tones attract a penalty and complaints. Ask for low-tone fans, anti-vibration mounts and speed control that avoids resonances.');
      } else T.push('Rating level at or below the background: a low likelihood of complaints. Record the assumptions and re-measure after installation.');
      if (st.ctrl === 'enc') T.push('Enclosures need airflow: use silenced inlet and outlet paths sized by the equipment supplier, or the plant overheats.');
      tips(tip, T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     6. Speech-intelligibility (STI) estimator
     ====================================================================== */
  V.stiEstimator = function (host) {
    const st = A.controls(host, [
      { key: 'vol', label: 'Room volume', type: 'range', min: 2, max: 5, step: 0.02, value: Math.log10(6000), fmt: (v) => fmt(Math.round(Math.pow(10, v) / 10) * 10, 0) + ' m³' },
      { key: 'rt', label: 'Reverberation time', type: 'range', min: 0.3, max: 6, step: 0.1, value: 2.5, unit: 's' },
      { key: 'noise', label: 'Background noise at the listener', type: 'range', min: 30, max: 85, step: 1, value: 55, unit: 'dBA' },
      { key: 'lvl', label: 'Speech level at 1 m from a loudspeaker', type: 'range', min: 70, max: 105, step: 1, value: 90, unit: 'dBA' },
      { key: 'Q', label: 'Loudspeaker directivity', type: 'select', value: '5', options: [['2', 'Ceiling speaker / wide (Q ≈ 2)'], ['5', 'Typical two-way box (Q ≈ 5)'], ['12', 'Column or horn (Q ≈ 12)'], ['30', 'Steered column array (Q ≈ 30)']] },
      { key: 'd', label: 'Listener to the nearest loudspeaker', type: 'range', min: 1, max: 40, step: 0.5, value: 12, unit: 'm' },
      { key: 'n', label: 'Loudspeakers playing into the room', type: 'range', min: 1, max: 40, step: 1, value: 2 },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const Vm = Math.pow(10, st.vol), Q = +st.Q, Aabs = (0.161 * Vm) / st.rt;
      const d = Math.pow(10, st.lvl / 10) * (1 / (st.d * st.d)), dRef = Math.pow(10, st.lvl / 10);
      const rev = dRef * ((16 * Math.PI) / (Q * Aabs)) * st.n, nz = Math.pow(10, st.noise / 10);
      const sig = d + rev, snr = 10 * Math.log10(sig / nz), dr = 10 * Math.log10(d / rev);
      const Fs = [0.63, 1.25, 2.5, 5, 10]; let sum = 0;
      Fs.forEach((F) => { const mr = 1 / Math.sqrt(1 + Math.pow((TAU * F * st.rt) / 13.8, 2)); const m = ((d + rev * mr) / (d + rev)) * (1 / (1 + nz / sig)); const s = A.clamp(10 * Math.log10(m / (1 - m + 1e-9)), -15, 15); sum += (s + 15) / 30; });
      const sti = sum / Fs.length, dc = 0.057 * Math.sqrt((Q * Vm) / st.rt) / Math.sqrt(st.n);
      return { sti, snr, dr, dc, level: 10 * Math.log10(sig) };
    }
    let R = calc();
    const band = (s) => (s < 0.3 ? ['Bad', 'bad'] : s < 0.45 ? ['Poor', 'bad'] : s < 0.6 ? ['Fair', 'warn'] : s < 0.75 ? ['Good', 'good'] : ['Excellent', 'good']);
    const cv = A.canvas(host, {
      height: 240, animate: true,
      caption: 'Top: the loudspeaker’s direct sound (rings toward the listener) against the reverberant wash filling the room (shading). Bottom: the estimated Speech Transmission Index on its usual quality scale. This is a simplified estimate for comparing options — real systems are verified by measurement (STIPA).',
      draw(ctx, w, h, t) {
        const r = R, y = 70, sx = 50, lx = Math.min(w - 50, sx + 40 + st.d * ((w - 140) / 40));
        ctx.fillStyle = A.alpha(A.css('warn'), A.clamp(0.08 + (10 - r.dr) / 60, 0.05, 0.5)); ctx.fillRect(10, 14, w - 20, 110);
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(10, 14, w - 20, 110); ctx.lineWidth = 1;
        ctx.fillStyle = A.css('accent'); ctx.fillRect(sx - 9, y - 14, 18, 28);
        const half = A.clamp(1.6 / Math.sqrt(+st.Q), 0.15, 1.5);
        for (let k = 0; k < 4; k++) { const ph = ((tp(t) * 0.5 + k / 4) % 1), rr = ph * (lx - sx); ctx.strokeStyle = A.alpha(A.css('accent'), 1 - ph * 0.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, y, rr, -half, half); ctx.stroke(); }
        ctx.lineWidth = 1; dot(ctx, lx, y, 8, A.css('good')); A.text(ctx, 'listener', lx, y + 24, { align: 'center', size: 10 });
        const gx0 = 30, gx1 = w - 30, gy = h - 44, X = (s) => gx0 + s * (gx1 - gx0);
        [[0, 0.3, 'bad', 'bad'], [0.3, 0.45, 'bad', 'poor'], [0.45, 0.6, 'warn', 'fair'], [0.6, 0.75, 'good', 'good'], [0.75, 1, 'good', 'excellent']].forEach(([a, b, c, l], i) => { ctx.fillStyle = A.alpha(A.css(c), i === 0 || i === 4 ? 0.75 : 0.45); ctx.fillRect(X(a), gy, X(b) - X(a) - 2, 18); A.text(ctx, l, (X(a) + X(b)) / 2, gy + 32, { align: 'center', size: 10, color: A.css('muted') }); });
        const px = X(r.sti); ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.moveTo(px, gy + 2); ctx.lineTo(px - 7, gy - 12); ctx.lineTo(px + 7, gy - 12); ctx.fill();
        A.text(ctx, 'STI ' + fmt(r.sti, 2), px, gy - 16, { align: 'center', size: 12, weight: 700 });
      },
    });
    function upd() {
      R = calc(); const r = R, b = band(r.sti);
      out.innerHTML = A.statBox('Estimated STI', fmt(r.sti, 2), b[0], b[1]) + A.statBox('Direct-to-reverberant', (r.dr > 0 ? '+' : '') + fmt(r.dr, 0) + ' dB', r.dr < -10 ? 'lost in the reverberation' : r.dr < 0 ? 'beyond critical distance' : 'direct sound leads', r.dr < -10 ? 'bad' : r.dr < 0 ? 'warn' : 'good') + A.statBox('Signal above noise', (r.snr > 0 ? '+' : '') + fmt(r.snr, 0) + ' dB', r.snr < 10 ? 'aim for ≥ 10–15 dB' : 'enough', r.snr < 6 ? 'bad' : r.snr < 10 ? 'warn' : 'good') + A.statBox('Critical distance', fmt(r.dc, 1) + ' m', 'keep listeners within ≈ 2–3× this') + A.statBox('Speech level at listener', fmt(r.level, 0) + ' dBA', '');
      const T = [];
      if (r.dr < -6) T.push('Reverberation is the limit. Options that work: more directional loudspeakers aimed at people (not walls), loudspeakers closer to listeners, fewer but better-aimed sources, and absorption — especially on the surfaces the loudspeakers hit.');
      if (st.n > 8 && r.dr < 0) T.push('Many wide loudspeakers all feed the reverberant field. A distributed system only helps when each listener is close to one unit — reduce coverage overlap and turn each unit down.');
      if (r.snr < 10) T.push('Noise is the limit: raise the speech level (within comfort — above about 85–90 dBA intelligibility stops improving), or reduce the noise.');
      if (st.rt > 2.5) T.push('With RT above about 2.5 s, ordinary loudspeakers rarely reach STI 0.50. Plan steered column arrays or dense distributed systems together with acoustic treatment.');
      if (r.sti >= 0.6) T.push('A good result on paper. Confirm with a STIPA measurement at several positions with realistic background noise.');
      tips(tip, T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     7. Wedge vs in-ear monitoring
     ====================================================================== */
  V.monitorCompare = function (host) {
    const st = A.controls(host, [
      { key: 'mode', label: 'Monitoring', type: 'select', value: 'wedge', options: [['wedge', 'Floor wedges'], ['iem', 'In-ear monitors'], ['both', 'In-ears plus a low-level wedge']] },
      { key: 'stage', label: 'Backline & drums at the singer’s position', type: 'range', min: 85, max: 112, step: 1, value: 100, unit: 'dBA' },
      { key: 'want', label: 'How far the singer wants their mix above the stage sound', type: 'range', min: 0, max: 12, step: 1, value: 6, unit: 'dB' },
      { key: 'fit', label: 'In-ear fit / isolation', type: 'select', value: '25', options: [['12', 'Loose universal tips (≈ 12 dB)'], ['25', 'Good universal or custom moulds (≈ 25 dB)'], ['30', 'Deep custom fit (≈ 30 dB)']] },
      { key: 'hrs', label: 'Playing time per day (rehearsal + show)', type: 'range', min: 0.5, max: 6, step: 0.5, value: 2, unit: 'h' },
      { key: 'pat', label: 'Vocal microphone', type: 'select', value: '14', options: [['8', 'Cardioid, wedge off to the side (poor null)'], ['14', 'Cardioid, wedge directly behind the mic'], ['18', 'Supercardioid, wedges at ±120°']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function calc() {
      const iso = +st.fit, wedge = st.mode === 'wedge' ? st.stage + st.want : st.mode === 'both' ? st.stage - 8 : 0;
      const ear = st.mode === 'wedge' ? P.dbSum([st.stage, wedge]) : P.dbSum([st.stage - iso, st.mode === 'both' ? wedge - iso : 0, Math.max(78, st.stage - iso + st.want)]);
      const voice = 104, wedgeAtMic = wedge ? wedge - 2 - (+st.pat) : 0, spill = P.dbSum([st.stage - 6, wedgeAtMic || 0]);
      const gbf = wedge ? voice - (wedge - 2) + (+st.pat) - 6 : 99;
      const allowed = P.niosh(ear), dose = (st.hrs / allowed) * 100;
      return { wedge, ear, spill, clean: voice - spill, gbf, allowed, dose };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 260, animate: true,
      caption: 'Stage plan. The band’s own sound washes over the singer; wedges add more on top so the singer can hear, and all of it spills into the vocal microphone. In-ear monitors seal the ear, so the mix can be much quieter and the stage — and the front-of-house sound — becomes cleaner.',
      draw(ctx, w, h, t) {
        const r = R, cx = w / 2, sy = h - 70;
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(14, 14, w - 28, h - 40); ctx.lineWidth = 1;
        A.text(ctx, 'audience', cx, h - 8, { align: 'center', size: 10, color: A.css('muted') });
        [[cx - 110, 50, 'amp'], [cx, 40, 'drums'], [cx + 110, 50, 'amp']].forEach(([x, y, l]) => { ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.roundRect(x - 26, y - 14, 52, 28, 4); ctx.fill(); ctx.stroke(); A.text(ctx, l, x, y + 4, { align: 'center', size: 10 }); for (let k = 0; k < 2; k++) { const ph = ((tp(t) * 0.5 + k / 2) % 1); ctx.strokeStyle = A.alpha(A.css('warn'), (1 - ph) * A.clamp((st.stage - 80) / 30, 0.2, 1)); ctx.beginPath(); ctx.arc(x, y, 20 + ph * 110, 0.3, Math.PI - 0.3); ctx.stroke(); } });
        dot(ctx, cx, sy, 10, st.mode === 'wedge' ? A.css('text') : A.css('good')); A.text(ctx, 'singer', cx + 16, sy + 4, { size: 10 });
        dot(ctx, cx, sy + 22, 4, A.css('bad')); A.text(ctx, 'mic', cx + 10, sy + 28, { size: 9, color: A.css('muted') });
        if (r.wedge) { [-40, 40].forEach((dx) => { ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.moveTo(cx + dx - 16, sy + 46); ctx.lineTo(cx + dx + 16, sy + 46); ctx.lineTo(cx + dx + 10, sy + 34); ctx.lineTo(cx + dx - 10, sy + 34); ctx.fill(); for (let k = 0; k < 2; k++) { const ph = ((tp(t) * 0.7 + k / 2) % 1); ctx.strokeStyle = A.alpha(A.css('accent'), (1 - ph) * A.clamp((r.wedge - 80) / 30, 0.2, 1)); ctx.beginPath(); ctx.arc(cx + dx, sy + 36, 8 + ph * 60, -Math.PI + 0.5, -0.5); ctx.stroke(); } }); }
        if (st.mode !== 'wedge') { ctx.strokeStyle = A.css('good'); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, sy, 15, 0, TAU); ctx.stroke(); ctx.lineWidth = 1; }
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Level at the singer’s eardrum', fmt(r.ear, 0) + ' dBA', st.mode === 'wedge' ? `wedges at ${fmt(r.wedge, 0)} dBA` : 'inside the ear-piece', r.ear > 100 ? 'bad' : r.ear > 92 ? 'warn' : 'good') + A.statBox('Safe daily time at that level', r.allowed >= 8 ? '8 h or more' : r.allowed >= 1 ? fmt(r.allowed, 1) + ' h' : fmt(r.allowed * 60, 0) + ' min', '85 dBA / 8 h, halving every 3 dB') + A.statBox('Daily noise dose', fmt(r.dose, 0) + ' %', r.dose > 100 ? 'over the limit' : 'within the limit', r.dose > 100 ? 'bad' : r.dose > 50 ? 'warn' : 'good') + A.statBox('Voice above spill in the vocal mic', fmt(r.clean, 0) + ' dB', r.clean < 6 ? 'muddy front-of-house mix' : 'clean', r.clean < 6 ? 'bad' : r.clean < 10 ? 'warn' : 'good') + A.statBox('Margin before feedback', r.gbf > 50 ? 'no wedge' : fmt(r.gbf, 0) + ' dB', r.gbf < 3 ? 'on the edge' : '', r.gbf < 3 ? 'bad' : r.gbf < 8 ? 'warn' : 'good');
      const T = [];
      if (st.mode === 'wedge' && r.ear > 100) T.push('Wedges have to beat the stage level, so every “more me” makes the whole stage louder. Lower the backline first: turn amps down, angle them at the players’ ears, shield the drums.');
      if (st.mode === 'wedge' && r.gbf < 8) T.push('Put the wedge in the microphone’s null (straight behind a cardioid; about 120° either side for a supercardioid), keep the mic close to the mouth and cut the ringing frequencies.');
      if (st.mode !== 'wedge' && +st.fit < 20) T.push('Poorly sealed in-ears leak the stage in, so the player turns the mix up — losing the hearing-protection benefit. Fit matters more than the price of the driver.');
      if (st.mode !== 'wedge') T.push('Always set a limiter on in-ear feeds, add an ambience microphone so the performer does not feel cut off, and never use a single ear-piece (people turn one ear up far too loud).');
      if (r.dose > 100) T.push('This exposure exceeds a full daily dose. Reduce the level or the time, and use musician’s ear-plugs in rehearsal.');
      tips(tip, T); cv.redraw();
    }
    upd();
  };
})();
