/* ==========================================================================
   Acoustica — Studio Design Master Class widgets.
   Myth buster, DIY cost of mistakes, sound in matter, Snell's law, energy
   balance, absorption mechanisms, reverberation-room test, isolation
   requirement planner, composite walls (doors/windows/gaps), flutter echo,
   speaker-boundary interference, HVAC duct noise, booth sizing, flow
   resistivity rig, impedance balance (CMRR).
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2;
  const OCT = [63, 125, 250, 500, 1000, 2000, 4000, 8000];
  const T16 = P.THIRDS.slice(4, 20);
  const card = (inner, extra = '') => `<div class="card" style="background:var(--panel2);${extra}">${inner}</div>`;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const rr = (ctx, x, y, w, h, r = 6) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };

  /* ======================================================================
     1. Myth buster
     ====================================================================== */
  const MYTHS = [
    ['Egg crates (or egg boxes) on the wall soundproof a room.', false, 'They weigh almost nothing and leave the wall airtightness unchanged, so they block nothing. They barely even absorb. Isolation needs <b>mass, airtightness and decoupling</b>.', 'isolation'],
    ['Acoustic foam stops sound getting out to the neighbours.', false, 'Foam is an <b>absorber</b>: it reduces echoes inside the room. Sound passes straight through it. A 50 mm foam panel changes wall isolation by roughly 0–1 dB.', 'isolation'],
    ['Room corners are the best places for bass traps.', true, 'Every room mode has maximum pressure in the corners, so pressure-driven porous and membrane traps work hardest there.', 'treatment'],
    ['A thick rug will fix boomy bass.', false, 'A rug absorbs mid and high frequencies. Bass wavelengths are metres long and need deep porous traps, membranes or resonators — and good positioning.', 'absorbers'],
    ['A panel spaced off the wall absorbs lower than the same panel mounted flat.', true, 'Porous absorbers need air movement; particle velocity is zero at the wall and grows away from it. An air gap moves the panel to where the air moves more.', 'absorbers'],
    ['An absorption coefficient can never be higher than 1.0.', false, 'In laboratory tests, edge diffraction makes small samples absorb sound from beyond their own area, so reported α can be 1.1–1.3. It is a test artefact, not magic — use 1.0 in calculations.', null],
    ['The higher the NRC, the better a panel is for a studio.', false, 'NRC averages 250–2 000 Hz only. It says nothing about 63–125 Hz, where small rooms have their biggest problems.', 'absorbers'],
    ['Soundproofing and acoustic treatment are the same thing.', false, '<b>Isolation</b> keeps sound in or out (walls, doors, floors). <b>Treatment</b> controls how the room sounds inside (absorbers, diffusers). You usually need both — they are designed separately.', null],
    ['A 10 mm gap under a door can ruin a 60 dB wall.', true, 'Sound flows through openings like water. A 10 mm × 900 mm gap in a 10 m² wall limits the whole wall to about 30 dB.', 'isolation'],
    ['Diffusers make every small room sound better.', false, 'Diffusers need distance (roughly 3 wavelengths, often 2–3 m) to work, and do nothing below their design frequency. In tiny rooms, absorption is usually the better use of space.', 'diffusers'],
    ['Good room proportions remove room modes.', false, 'Ratios only <b>spread</b> the modes more evenly. Every room still has them; they still need treatment and good positioning.', 'analyzer'],
    ['Doubling the wall mass gives about 6 dB more isolation.', true, 'The mass law: each doubling of mass (or frequency) adds about 6 dB for a single wall — which is why decoupled double walls are used for big improvements.', 'isolation'],
  ];
  V.mythBuster = function (host) {
    const box = el('div'); host.appendChild(box);
    let i = 0, score = 0, answered = 0, order = MYTHS.map((_, k) => k);
    const shuffle = () => { order = order.sort(() => Math.random() - 0.5); };
    function show(reveal, guess) {
      const [txt, truth, why, tool] = MYTHS[order[i]];
      const right = guess === truth;
      box.innerHTML = `<div class="myth-card ${reveal ? (truth ? 'is-fact' : 'is-myth') : ''}">
        <div class="small muted">Statement ${i + 1} of ${MYTHS.length} · Score ${score}/${answered}</div>
        <div class="myth-q">“${txt}”</div>
        ${reveal ? `<div class="myth-verdict">${truth ? '✓ FACT' : '✗ MYTH'} <span class="small">${right ? '— you got it' : '— not quite'}</span></div><p>${why}</p>${tool ? `<a class="btn" href="#/${tool}">Test it in the app →</a>` : ''}
          <div class="row" style="margin-top:10px"><button class="primary" data-next="1">Next statement →</button></div>`
          : `<div class="row"><button class="primary" data-g="0">Myth</button><button class="primary" data-g="1">Fact</button></div>`}
      </div>`;
    }
    box.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.g != null) { const g = b.dataset.g === '1'; answered++; if (g === MYTHS[order[i]][1]) score++; show(true, g); }
      if (b.dataset.next) { i = (i + 1) % MYTHS.length; if (!i) { shuffle(); score = 0; answered = 0; } show(false); }
    });
    shuffle(); show(false);
  };

  /* ======================================================================
     2. DIY design: when mistakes are found and what they cost
     ====================================================================== */
  const STAGES = ['Design (paper)', 'Framing', 'Boarding & sealing', 'Finishing', 'Moved in'];
  const MISTAKES = [
    ['Rigid connection under a floating floor (a screw or mortar bridge)', 4, 'The floor “works” until you play drums. Fixing it means lifting the floor.'],
    ['No fresh-air ventilation planned for an airtight room', 4, 'Airtight rooms get stuffy in 20 minutes. Adding quiet ducts later means cutting through the isolation you paid for.'],
    ['Back-to-back electrical boxes in a party wall', 2, 'Each box is a hole through the wall. Found when the boards are up — fixable before finishing, expensive after.'],
    ['Door with a 10 mm gap and no seals', 3, 'Caps the whole wall at about 30 dB. Seals and a threshold are cheap if planned; door replacement is not.'],
    ['Mix position at the room centre', 4, 'Bass nulls at the seat. Free to fix on paper, painful once the desk, cabling and treatment are built around it.'],
    ['Window in the wall behind the monitors', 1, 'Breaks symmetry and causes strong reflections. Moving a window after framing is a rebuild.'],
    ['Ceiling too low after adding the inner room and floating floor', 1, 'Every isolation layer eats height. A 2.4 m room can end up at 2.05 m — check before you start.'],
  ];
  V.diyCost = function (host) {
    const st = A.controls(host, [
      { key: 'm', label: 'Pick a classic mistake', type: 'select', value: '0', options: MISTAKES.map((m, k) => [String(k), m[0]]) },
      { key: 'found', label: 'When is it found?', type: 'range', min: 0, max: 4, step: 1, value: 4, fmt: (v) => STAGES[v] },
    ], () => { upd(); cv.redraw(); });
    const note = el('div'); host.appendChild(note);
    let lastM = '0';
    const mult = [1, 4, 12, 30, 80];
    const cv = A.canvas(host, {
      height: 230, animate: true,
      caption: 'Rule of thumb used by builders: the cost to fix a design error grows roughly tenfold at each construction stage. Paper is the cheapest place to make — and correct — mistakes.',
      draw(ctx, w, h, t) {
        const x0 = 20, bw = (w - 40) / 5, base = h - 40, maxH = h - 70;
        STAGES.forEach((s, k) => {
          const on = k <= st.found;
          const target = (Math.log10(mult[k]) / Math.log10(80)) * maxH * 0.9 + 12;
          const grow = on ? Math.min(1, (t * 1.6) - k * 0.25) : 0;
          const hh = Math.max(0, target * Math.max(0, grow));
          ctx.fillStyle = k === st.found ? A.css('bad') : on ? A.alpha(A.css('warn'), 0.7) : A.alpha(A.css('muted'), 0.2);
          rr(ctx, x0 + k * bw + 8, base - hh, bw - 16, hh, 6); ctx.fill();
          A.text(ctx, '×' + mult[k], x0 + k * bw + bw / 2, base - hh - 6, { align: 'center', size: 12, weight: 700, color: on ? A.css('text') : A.css('muted') });
          A.text(ctx, s, x0 + k * bw + bw / 2, base + 16, { align: 'center', size: 10, color: A.css('muted') });
        });
      },
    });
    function upd() { if (st.m !== lastM) { lastM = st.m; st.set('found', MISTAKES[+st.m][1]); } const m = MISTAKES[+st.m]; note.innerHTML = `<div class="callout warn" style="margin-top:8px"><b>${m[0]}.</b> ${m[2]} Typically discovered at <b>${STAGES[m[1]]}</b>. Fixed on paper: cost ×1. Found at “${STAGES[st.found]}”: roughly <b>×${mult[st.found]}</b>.</div>`; }
    upd();
  };

  /* ======================================================================
     3. Sound in solids, liquids and gases
     ====================================================================== */
  const MEDIA = {
    air: { name: 'Air (gas)', c: null, rho: 1.2, state: 'gas' },
    water: { name: 'Water (liquid)', c: 1480, rho: 1000, state: 'liquid' },
    wood: { name: 'Timber, along the grain (solid)', c: 3800, rho: 500, state: 'solid' },
    gypsum: { name: 'Gypsum board (solid)', c: 1800, rho: 750, state: 'solid' },
    concrete: { name: 'Concrete (solid)', c: 3700, rho: 2300, state: 'solid' },
    steel: { name: 'Steel (solid)', c: 5900, rho: 7850, state: 'solid' },
  };
  V.mediaSpeed = function (host) {
    const st = A.controls(host, [
      { key: 'm', label: 'Medium', type: 'select', value: 'air', options: Object.entries(MEDIA).map(([k, v]) => [k, v.name]) },
      { key: 'T', label: 'Air temperature', type: 'range', min: -10, max: 40, step: 1, value: 20, unit: '°C' },
      { key: 'f', label: 'Frequency', type: 'range', min: Math.log10(20), max: Math.log10(10000), step: 0.01, value: Math.log10(100), fmt: (v) => fmtHz(Math.pow(10, v)) },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const c = () => (st.m === 'air' ? 331.3 * Math.sqrt(1 + st.T / 273.15) : MEDIA[st.m].c);
    A.canvas(host, {
      height: 220, animate: true,
      caption: 'Each dot is a particle. In gases the particles are far apart and only collide; in liquids they touch; in solids they are tied together by springs (bonds), so the push travels much faster. Solids can also carry bending and shear waves — which is how sound “leaks” through structures.',
      draw(ctx, w, h, t) {
        const m = MEDIA[st.m], sp = c();
        const gap = m.state === 'gas' ? 22 : m.state === 'liquid' ? 13 : 11;
        const rows = Math.floor((h - 40) / gap), cols = Math.floor((w - 20) / gap);
        const k = TAU / (w * 0.45), omega = TAU * 0.6 * (sp / 343) ** 0.35;
        for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
          const x0 = 10 + q * gap + (r % 2) * (m.state === 'gas' ? gap / 2 : 0), y0 = 20 + r * gap;
          const jitter = m.state === 'gas' ? Math.sin(q * 7.1 + r * 3.3 + t * 3) * 3 : m.state === 'liquid' ? Math.sin(q * 5 + r * 2 + t * 2) * 1.2 : 0;
          const dx = Math.sin(k * x0 - omega * t * (sp / 343) ** 0.3) * (m.state === 'gas' ? 6 : 4);
          if (m.state === 'solid' && q < cols - 1) { ctx.strokeStyle = A.alpha(A.css('muted'), 0.35); ctx.beginPath(); ctx.moveTo(x0 + dx, y0); ctx.lineTo(x0 + gap + Math.sin(k * (x0 + gap) - omega * t * (sp / 343) ** 0.3) * 4, y0); ctx.stroke(); }
          const comp = Math.cos(k * x0 - omega * t * (sp / 343) ** 0.3);
          dot(ctx, x0 + dx + jitter, y0 + jitter * 0.6, m.state === 'gas' ? 2.6 : 3.2, comp > 0.5 ? A.css('accent') : A.alpha(A.css('text'), 0.55));
        }
        A.text(ctx, `${m.name}: ${fmt(sp, 4)} m/s`, 12, 14, { size: 12, weight: 700, bg: A.alpha(A.css('panel'), 0.85) });
      },
    });
    function upd() {
      const s = c(), f = Math.pow(10, st.f), lam = s / f;
      out.innerHTML = A.statBox('Speed of sound', fmt(s, 4) + ' m/s', st.m === 'air' ? `≈ 331 + 0.6 × ${st.T} °C` : MEDIA[st.m].state) +
        A.statBox('Wavelength at ' + fmtHz(f), A.fmtLen(lam), 'λ = c / f') +
        A.statBox('Time to cross 10 m', fmt((10 / s) * 1000, 3) + ' ms', '') +
        A.statBox('vs air', '×' + fmt(s / 343, 3), s > 1000 ? 'structure-borne sound travels far' : '');
    }
    upd();
  };

  /* ======================================================================
     4. Snell's law — refraction at a boundary & outdoors
     ====================================================================== */
  V.snell = function (host) {
    const st = A.controls(host, [
      { key: 'mode', label: 'Situation', type: 'select', value: 'boundary', options: [['boundary', 'Boundary between two media'], ['day', 'Outdoors: sunny day (warm ground)'], ['night', 'Outdoors: calm night (temperature inversion)'], ['wind', 'Outdoors: wind blowing toward the listener']] },
      { key: 'th', label: 'Angle of incidence', type: 'range', min: 0, max: 85, step: 1, value: 30, unit: '°' },
      { key: 'c2', label: 'Speed ratio c₂ / c₁ (boundary only)', type: 'range', min: 0.5, max: 2, step: 0.01, value: 1.15 },
    ], () => { upd(); cv.redraw(); });
    const note = el('div'); host.appendChild(note);
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Snell’s law: sin θ₁ / c₁ = sin θ₂ / c₂. Sound bends toward the slower medium. Outdoors, temperature and wind make the air a stack of layers, so sound bends up (shadow zones by day) or down (it carries for kilometres on still nights).',
      draw(ctx, w, h, t) {
        if (st.mode === 'boundary') {
          const y = h / 2, x = w / 2;
          ctx.fillStyle = A.alpha(A.css('c3'), 0.12); ctx.fillRect(0, y, w, h - y);
          ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
          ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, h - 10); ctx.stroke(); ctx.setLineDash([]);
          const th = (st.th * Math.PI) / 180, s2 = Math.sin(th) * st.c2, L = Math.min(w, h) * 0.45;
          const ix = x - Math.sin(th) * L, iy = y - Math.cos(th) * L;
          const ph = (t * 0.7) % 1;
          ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(x, y); ctx.stroke();
          ctx.strokeStyle = A.alpha(A.css('accent'), 0.4); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(th) * L, iy); ctx.stroke();
          if (s2 < 1) { const th2 = Math.asin(s2); ctx.strokeStyle = A.css('bad'); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(th2) * L, y + Math.cos(th2) * L); ctx.stroke(); A.text(ctx, `θ₂ = ${fmt((th2 * 180) / Math.PI, 3)}°`, x + 10, y + 40, { size: 12, weight: 700, color: A.css('bad') }); }
          else A.text(ctx, 'Total reflection (beyond the critical angle)', x + 10, y + 40, { size: 12, weight: 700, color: A.css('bad') });
          ctx.lineWidth = 1;
          dot(ctx, ix + (x - ix) * ph, iy + (y - iy) * ph, 5, A.css('accent'));
          A.text(ctx, 'medium 1 (c₁)', 10, 20, { size: 11, color: A.css('muted') }); A.text(ctx, 'medium 2 (c₂ = ' + st.c2 + ' c₁)', 10, h - 12, { size: 11, color: A.css('muted') });
          A.text(ctx, `θ₁ = ${st.th}°`, x - 70, y - 40, { size: 12, weight: 700, color: A.css('accent') });
        } else {
          const g = h - 30;
          const grad = ctx.createLinearGradient(0, 0, 0, g);
          const warmUp = st.mode === 'night';
          grad.addColorStop(0, A.alpha(warmUp ? A.css('warn') : A.css('c3'), 0.18)); grad.addColorStop(1, A.alpha(warmUp ? A.css('c3') : A.css('warn'), 0.18));
          ctx.fillStyle = grad; ctx.fillRect(0, 0, w, g);
          ctx.fillStyle = A.alpha(A.css('good'), 0.3); ctx.fillRect(0, g, w, h - g);
          const sx = 40, sy = g - 20;
          dot(ctx, sx, sy, 7, A.css('accent'));
          const curv = st.mode === 'day' ? -1 : 1;
          for (let a = -30; a <= 40; a += 7) {
            const a0 = (a * Math.PI) / 180;
            ctx.strokeStyle = A.alpha(A.css('accent'), 0.7); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(sx, sy);
            let x = sx, y = sy, ang = a0;
            for (let s = 0; s < 260; s++) { ang -= curv * 0.0024 * (st.mode === 'wind' ? 1.2 : 1); x += Math.cos(ang) * 4; y -= Math.sin(ang) * 4; if (y > g) { y = g; ang = -ang; } if (x > w || y < 0) break; ctx.lineTo(x, y); }
            ctx.stroke();
          }
          ctx.lineWidth = 1;
          const pulse = Math.abs((t * 120) % (w - 60));
          ctx.strokeStyle = A.alpha(A.css('accent'), 0.5); ctx.beginPath(); ctx.arc(sx, sy, pulse, -Math.PI / 2, 0.1); ctx.stroke();
          if (st.mode === 'day') A.text(ctx, 'shadow zone — quieter than distance alone predicts', w - 12, g - 10, { align: 'right', size: 11, weight: 700, color: A.css('bad'), bg: A.alpha(A.css('panel'), 0.8) });
          else A.text(ctx, 'sound bends back down — carries much further', w - 12, g - 10, { align: 'right', size: 11, weight: 700, color: A.css('bad'), bg: A.alpha(A.css('panel'), 0.8) });
          A.text(ctx, st.mode === 'night' ? 'warm air above (faster)' : st.mode === 'wind' ? 'wind faster with height →' : 'cool air above (slower)', 10, 18, { size: 11, color: A.css('muted') });
        }
      },
    });
    function upd() {
      const msg = { boundary: 'Inside buildings refraction matters most in layered and solid structures; in rooms we mostly use reflection, absorption and diffraction. Snell’s law is still what explains why sound bends when the speed changes.', day: '<b>Studio site planning:</b> a noise survey taken on a sunny afternoon can be optimistic — the same road or venue is often much louder at night.', night: '<b>Neighbour complaints at night</b> often come from venues that are inaudible by day: cool ground air and warm air above (an inversion) bend sound back down.', wind: 'Downwind sound bends toward the ground and carries further; upwind it bends up into a shadow zone. Measure environmental noise in several weather conditions.' };
      note.innerHTML = `<div class="callout mentor">${msg[st.mode]}</div>`;
    }
    upd();
  };

  /* ======================================================================
     5. Energy balance at a surface — reflection, absorption, transmission
     ====================================================================== */
  const SURF = {
    concrete: ['200 mm concrete wall', 0.02, 55], drywall: ['Single drywall stud wall', 0.08, 35], foam: ['50 mm foam on drywall', 0.7, 35],
    curtain: ['Heavy curtain in mid-air', 0.5, 4], window: ['Open window', 1, 0], room: ['Room-in-room wall with thick absorber', 0.95, 65],
  };
  V.energyFlow = function (host) {
    const st = A.controls(host, [{ key: 's', label: 'Surface', type: 'select', value: 'foam', options: Object.entries(SURF).map(([k, v]) => [k, v[0]]) }], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const parts = Array.from({ length: 40 }, (_, i) => ({ p: i / 40, fate: 0 }));
    const fates = () => { const [, a, tl] = SURF[st.s]; const tau = Math.pow(10, -tl / 10); return { refl: 1 - a, abs: Math.max(0, a - tau), tr: tau }; };
    A.canvas(host, {
      height: 230, animate: true,
      caption: 'Energy is conserved: every bit of sound that hits a surface is either reflected, turned into heat inside the material (absorbed), or passes through (transmitted). Absorption and isolation are different jobs — foam absorbs a lot but transmits almost as much as the bare wall.',
      draw(ctx, w, h, t) {
        const F = fates(), wx = w * 0.55;
        ctx.fillStyle = A.alpha(A.css('muted'), 0.35); ctx.fillRect(wx, 20, 18, h - 40);
        if (st.s === 'foam' || st.s === 'room') { ctx.fillStyle = A.alpha(A.css('c4'), 0.5); ctx.fillRect(wx - 16, 20, 16, h - 40); }
        parts.forEach((q, i) => {
          const life = (t * 0.35 + q.p) % 1;
          if (life < 0.02) { const r = Math.random(); q.fate = r < F.refl ? 0 : r < F.refl + F.abs ? 1 : 2; q.y = 30 + Math.random() * (h - 60); }
          const y = q.y || h / 2; let x, col = A.css('accent'), a = 1;
          if (life < 0.5) x = 20 + (life / 0.5) * (wx - 30);
          else if (q.fate === 0) { x = wx - 10 - ((life - 0.5) / 0.5) * (wx - 30); col = A.css('c3'); }
          else if (q.fate === 1) { x = wx - 6 + Math.sin(life * 60) * 2; col = A.css('warn'); a = Math.max(0, 1 - (life - 0.5) * 3); }
          else { x = wx + 18 + ((life - 0.5) / 0.5) * (w - wx - 30); col = A.css('bad'); }
          ctx.globalAlpha = a; dot(ctx, x, y, 4, col); ctx.globalAlpha = 1;
        });
        A.text(ctx, 'incident →', 16, 16, { size: 11, color: A.css('accent') });
        A.text(ctx, '← reflected', 16, h - 8, { size: 11, color: A.css('c3') });
        A.text(ctx, 'heat', wx - 4, 14, { size: 11, color: A.css('warn'), align: 'center' });
        A.text(ctx, 'transmitted →', w - 10, 16, { size: 11, color: A.css('bad'), align: 'right' });
      },
    });
    function upd() {
      const F = fates(), tl = SURF[st.s][2];
      out.innerHTML = A.statBox('Reflected', fmt(F.refl * 100, 3) + ' %', 'stays in the room') + A.statBox('Absorbed (→ heat)', fmt(F.abs * 100, 3) + ' %', 'controls echo/reverb') + A.statBox('Transmitted', F.tr < 0.001 ? fmt(F.tr * 1e6, 3) + ' ppm' : fmt(F.tr * 100, 3) + ' %', `TL ≈ ${tl} dB`);
    }
    upd();
  };

  /* ======================================================================
     6. How absorbers work — four mechanisms
     ====================================================================== */
  const MECH = {
    fric: { name: 'Frictional (porous: wool, foam, fabric)', col: 'c4', curve: (f) => P.porousAlpha(f, 10000, 0.1, 0.05), text: 'Air is pushed back and forth through millions of tiny fibres. Friction against the fibres turns the motion into a tiny amount of heat. Works best where air <b>moves</b> most — a quarter-wavelength from the wall — so thickness and air gap set the lowest frequency.' },
    diff: { name: 'Diffractive (edges, slots, small panels)', col: 'c3', curve: (f) => Math.min(1.1, P.perforatedAlpha(f, { t: 0.018, slot: true, slotW: 0.008, open: 0.1, D: 0.1, fillSigma: 10000 }) * (1 + 0.15 * Math.sqrt(250 / f))), text: 'Sound bends around edges and squeezes through slots. Near edges and openings the air speeds up, so a porous layer behind a slatted face — or a small panel with lots of edge — absorbs more than its area suggests. Slats also add <b>tuning</b> and keep some highs reflective.' },
    diaph: { name: 'Diaphragmatic (membrane / panel)', col: 'accent2', curve: (f) => P.membraneAlpha(f, { m: 4, D: 0.15, fillSigma: 8000, r: 0.2 }), text: 'A sealed panel (plywood, MDF, a heavy membrane) on an air cavity is a mass on an air spring. At its resonance it moves most and loses energy in its own damping and in wool inside the cavity. Narrow-band, but strong at <b>low frequencies</b> from shallow depths.' },
    reson: { name: 'Resonant (Helmholtz cavity)', col: 'bad', curve: (f) => { const f0 = 110, Q = 3; const x = f / f0 - f0 / f; return 0.95 / (1 + Q * Q * x * x); }, text: 'Air in a neck or hole (the mass) bounces on the air in the cavity behind (the spring) — like blowing across a bottle. Friction in the neck and wool in the cavity turn the motion to heat. Very selective: perfect for one stubborn mode or a perforated/slotted panel tuned to a band.' },
  };
  V.absorbMech = function (host) {
    const st = A.controls(host, [{ key: 'm', label: 'Mechanism', type: 'select', value: 'fric', options: Object.entries(MECH).map(([k, v]) => [k, v.name]) }], () => { info.innerHTML = card(MECH[st.m].text); cv.redraw(); });
    const info = el('div'); host.appendChild(info); info.innerHTML = card(MECH.fric.text);
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: what happens inside the absorber (animated). Right: its typical absorption curve versus frequency.',
      draw(ctx, w, h, t) {
        const m = MECH[st.m], col = A.css(m.col), lw = Math.min(w * 0.45, 360), cy = h / 2;
        // wall
        ctx.fillStyle = A.alpha(A.css('muted'), 0.4); ctx.fillRect(lw - 16, 20, 16, h - 40);
        const osc = Math.sin(t * 5);
        if (st.m === 'fric') {
          ctx.fillStyle = A.alpha(col, 0.25); ctx.fillRect(lw - 110, 20, 94, h - 40);
          for (let k = 0; k < 60; k++) { const x = lw - 108 + (k * 37) % 90, y = 26 + (k * 53) % (h - 52); ctx.strokeStyle = A.alpha(col, 0.7); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y + 10); ctx.stroke(); }
          for (let k = 0; k < 24; k++) { const y = 30 + k * ((h - 60) / 24); const x = lw - 140 + osc * 14 * (1 - k % 3 * 0.2) + (k % 4) * 20; dot(ctx, x, y, 2.5, A.css('accent')); if (x > lw - 110) { ctx.fillStyle = A.alpha(A.css('warn'), 0.5 + 0.5 * Math.abs(osc)); ctx.fillRect(x - 1, y - 6, 2, 3); } }
          A.text(ctx, 'air ↔ fibres → heat', lw - 60, h - 6, { align: 'center', size: 10, color: A.css('muted') });
        } else if (st.m === 'diff') {
          ctx.fillStyle = A.alpha(A.css('c4'), 0.25); ctx.fillRect(lw - 80, 20, 64, h - 40);
          for (let y = 20; y < h - 20; y += 26) { ctx.fillStyle = A.css('text'); ctx.fillRect(lw - 96, y, 14, 20); }
          for (let y = 40; y < h - 20; y += 26) { const v = Math.abs(osc); ctx.strokeStyle = A.alpha(col, 0.9); ctx.lineWidth = 1 + 3 * v; ctx.beginPath(); ctx.moveTo(lw - 140, y - 6); ctx.quadraticCurveTo(lw - 100, y - 3, lw - 70 + 10 * osc, y - 3); ctx.stroke(); }
          ctx.lineWidth = 1;
          A.text(ctx, 'air jets through slots, bends at edges', lw - 70, h - 6, { align: 'center', size: 10, color: A.css('muted') });
        } else if (st.m === 'diaph') {
          const D = 90; ctx.fillStyle = A.alpha(A.css('c4'), 0.25); ctx.fillRect(lw - D + 20, 20, D - 36, h - 40);
          ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(lw - D, 20); ctx.quadraticCurveTo(lw - D + osc * 18, cy, lw - D, h - 20); ctx.stroke(); ctx.lineWidth = 1;
          ctx.strokeStyle = A.css('muted'); ctx.strokeRect(lw - D, 20, D - 16, h - 40);
          A.text(ctx, 'panel = mass, air = spring', lw - 60, h - 6, { align: 'center', size: 10, color: A.css('muted') });
        } else {
          const bx = lw - 120; ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; rr(ctx, bx, cy - 50, 100, 100, 10); ctx.stroke(); ctx.lineWidth = 1;
          ctx.fillStyle = A.alpha(A.css('c4'), 0.25); ctx.fillRect(bx + 4, cy - 46, 92, 92);
          ctx.fillStyle = A.css('panel'); ctx.fillRect(bx - 2, cy - 10, 8, 20);
          ctx.fillStyle = A.alpha(col, 0.8); ctx.fillRect(bx - 30 + osc * 10, cy - 8, 30, 16);
          A.text(ctx, 'air plug in the neck bounces on the cavity air', lw - 70, h - 6, { align: 'center', size: 10, color: A.css('muted') });
        }
        // incoming wave
        for (let k = 0; k < 4; k++) { const x = 20 + ((t * 60 + k * 40) % 140); ctx.strokeStyle = A.alpha(A.css('accent'), 0.6); ctx.beginPath(); ctx.arc(x - 60, cy, 60, -0.5, 0.5); ctx.stroke(); }
        // curve
        const ax = A.axes(ctx, w, h, { x: { min: 50, max: 5000, log: true, label: 'Frequency (Hz)', ticks: [63, 125, 250, 500, 1000, 2000, 4000] }, y: { min: 0, max: 1.1, label: '' }, pad: { l: lw + 40, r: 14, t: 14, b: 36 } });
        A.text(ctx, 'α', ax.x0 - 30, ax.y1 + 10, { size: 13, weight: 700, color: A.css('muted') });
        const pts = []; for (let f = 50; f <= 5000; f *= 1.04) pts.push([f, A.clamp(m.curve(f), 0, 1.1)]);
        A.plotFill(ctx, ax, pts, A.alpha(col, 0.15), 0); A.plotLine(ctx, ax, pts, col, 2.5);
      },
    });
  };

  /* ======================================================================
     7. Reverberation-room absorption test (ASTM C423 style)
     ====================================================================== */
  const MOUNT = { A: ['Type A — laid flat on the floor', 0], B: ['Type B — glued to gypsum board', 0.0], E405: ['Type E-405 — 405 mm air space (ceiling tiles)', 0.405], E200: ['Type E-200 — 200 mm air space', 0.2] };
  V.reverbRoomTest = function (host) {
    const st = A.controls(host, [
      { key: 'd', label: 'Sample thickness', type: 'range', min: 0.025, max: 0.2, step: 0.005, value: 0.05, unit: 'm' },
      { key: 'sig', label: 'Flow resistivity', type: 'range', min: 3000, max: 40000, step: 500, value: 10000, fmt: (v) => fmt(v / 1000, 3) + ' kPa·s/m²' },
      { key: 'mt', label: 'Mounting (E795)', type: 'select', value: 'A', options: Object.entries(MOUNT).map(([k, v]) => [k, v[0]]) },
      { key: 'band', label: 'Show decay for band', type: 'select', value: '500', options: [125, 250, 500, 1000, 2000, 4000].map((f) => [String(f), fmtHz(f)]) },
    ], () => { upd(); cv.redraw(); bars.redraw(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const V0 = 200, S0 = 214, Ssamp = 6.69, bandsF = [125, 250, 500, 1000, 2000, 4000];
    const aRoom = [0.012, 0.012, 0.014, 0.016, 0.02, 0.026];
    function res() {
      const gap = MOUNT[st.mt][1];
      return bandsF.map((f, i) => {
        const ainf = P.porousAlpha(f, st.sig, st.d, gap);
        const lam = P.C / f, edge = 1 + 0.55 * (10.36 / Ssamp) * (lam / 4) * (1 - 0.4 * ainf);
        const am = ainf * Math.min(edge, 1.45);
        const A1 = aRoom[i] * S0 + 4 * 0.0005 * V0 * (f / 1000), A2 = A1 + am * Ssamp;
        const T1 = P.sabine(V0, A1), T2 = P.sabine(V0, A2);
        return { f, ainf, am, T1, T2, alpha: (0.161 * V0 * (1 / T2 - 1 / T1)) / Ssamp };
      });
    }
    const cv = A.canvas(host, {
      height: 240, animate: true,
      caption: 'A reverberation room is a large, very live, irregular room (≈ 200 m³). Its decay is measured empty and then with about 6.7 m² of sample. The faster decay reveals how many square metres of “perfect absorber” the sample adds (sabins, A = 0.161·V·(1/T₂ − 1/T₁)). Dividing by the sample area gives α.',
      draw(ctx, w, h, t) {
        const r = res().find((x) => String(x.f) === st.band);
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: Math.max(2, r.T1 * 0.7), label: 'Time after the noise stops (s)' }, y: { min: -60, max: 0, label: 'Level (dB)' } });
        const tt = (t % 4) / 4 * Math.max(2, r.T1 * 0.7);
        const line = (T, col, lab) => { const p = []; for (let x = 0; x <= Math.min(tt, ax ? 99 : 0); x += 0.02) p.push([x, Math.max(-60, (-60 * x) / T + Math.sin(x * 40) * 1.2)]); A.plotLine(ctx, ax, p, col, 2.2); A.text(ctx, lab, ax.X(Math.min(tt, T * 0.5)) + 6, ax.Y((-60 * Math.min(tt, T * 0.5)) / T) - 6, { size: 11, color: col, weight: 700 }); };
        line(r.T1, A.css('muted'), `empty: T₁ = ${fmt(r.T1, 3)} s`);
        line(r.T2, A.css('accent'), `with sample: T₂ = ${fmt(r.T2, 3)} s`);
      },
    });
    const bars = A.canvas(host, {
      height: 220,
      caption: 'Bars: α reported by the lab test (includes edge diffraction — can exceed 1). Line: the material’s theoretical α for an infinite area. Mounting changes the result more than many product differences.',
      draw(ctx, w, h) {
        const R = res();
        const ax = A.axes(ctx, w, h, { x: { min: 90, max: 5600, log: true, label: 'Octave band (Hz)', ticks: bandsF }, y: { min: 0, max: 1.4, label: 'α' } });
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.6); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ax.x0, ax.Y(1)); ctx.lineTo(ax.x1, ax.Y(1)); ctx.stroke(); ctx.setLineDash([]);
        R.forEach((r) => { const X = ax.X(r.f); ctx.fillStyle = r.alpha > 1 ? A.css('warn') : A.css('accent'); ctx.fillRect(X - 14, ax.Y(r.alpha), 28, ax.y0 - ax.Y(r.alpha)); A.text(ctx, fmt(r.alpha, 2), X, ax.Y(r.alpha) - 4, { align: 'center', size: 10, weight: 700 }); });
        A.plotLine(ctx, ax, R.map((r) => [r.f, r.ainf]), A.css('c3'), 2);
      },
    });
    function upd() {
      const R = res(), g = (f) => R.find((x) => x.f === f).alpha;
      const nrc = Math.round(((g(250) + g(500) + g(1000) + g(2000)) / 4) * 20) / 20;
      out.innerHTML = A.statBox('NRC (250–2k avg, rounded to 0.05)', fmt(nrc, 2), '') + A.statBox('α at 125 Hz', fmt(g(125), 2), MOUNT[st.mt][1] ? 'air space helps the bass' : 'flat mounting') + A.statBox('Highest reported α', fmt(Math.max(...R.map((r) => r.alpha)), 2), Math.max(...R.map((r) => r.alpha)) > 1 ? 'edge effect: > 1 is normal' : '');
    }
    upd();
  };

  /* ======================================================================
     8. Isolation requirement planner
     ====================================================================== */
  const SRC = {
    drums: ['Drum kit (rock)', [100, 106, 108, 108, 107, 105, 103, 98]], band: ['Band rehearsal', [108, 110, 108, 105, 103, 100, 96, 90]],
    cinema: ['Home cinema with subwoofers', [105, 100, 95, 92, 90, 88, 85, 80]], mix: ['Loud mixing (85 dB C-weighted+)', [95, 92, 88, 85, 84, 82, 80, 75]],
    piano: ['Acoustic piano', [85, 90, 92, 92, 90, 85, 80, 72]], voice: ['Voice / podcast', [52, 62, 70, 74, 72, 66, 60, 52]], dj: ['DJ practice with subs', [115, 112, 104, 100, 98, 96, 92, 86]],
  };
  const RECV = { 20: 'Neighbour’s bedroom at night (NC 20)', 25: 'Neighbour’s living room (NC 25)', 30: 'Office / quiet home space (NC 30)', 15: 'Recording room next door (NC 15)', 35: 'Busy office (NC 35)' };
  const lp = (layers) => P.leafProps(layers);
  const CONS = {
    stud: { name: 'Single stud wall, 1 layer each side, filled', tl: (f) => P.doubleLeafTL({ leaf1: lp([{ mat: 'gypsum', t: 0.0127 }]), leaf2: lp([{ mat: 'gypsum', t: 0.0127 }]), d: 0.09, filled: true, conn: 'wood' }, f).tl },
    clips: { name: 'Stud wall + clips, 2 layers each side', tl: (f) => P.doubleLeafTL({ leaf1: lp([{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }]), leaf2: lp([{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }]), d: 0.12, filled: true, conn: 'clips' }, f).tl },
    double: { name: 'Double-stud wall, 2 + 2 layers, filled', tl: (f) => P.doubleLeafTL({ leaf1: lp([{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }]), leaf2: lp([{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }]), d: 0.2, filled: true, conn: 'none' }, f).tl },
    conc: { name: '200 mm concrete', tl: (f) => P.singleLeafTL(lp([{ mat: 'concrete', t: 0.2 }]), f) },
    rir: { name: '200 mm concrete + independent inner room (2 layers)', tl: (f) => P.doubleLeafTL({ leaf1: lp([{ mat: 'concrete', t: 0.2 }]), leaf2: lp([{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }]), d: 0.15, filled: true, conn: 'none', cap: 85 }, f).tl },
  };
  V.isoRequirement = function (host) {
    const st = A.controls(host, [
      { key: 'src', label: 'What makes the noise', type: 'select', value: 'drums', options: Object.entries(SRC).map(([k, v]) => [k, v[0]]) },
      { key: 'nc', label: 'Who must not be disturbed', type: 'select', value: '20', options: Object.entries(RECV).map(([k, v]) => [k, v]) },
      { key: 'path', label: 'Where is the listener?', type: 'select', value: '0', options: [['0', 'Right behind the shared wall'], ['10', 'Next flat, one room further away'], ['30', 'Separate house ≈ 10 m away (two façades + distance)']] },
      { key: 'flank', label: 'Allowance for flanking & workmanship', type: 'range', min: 0, max: 10, step: 1, value: 5, unit: 'dB' },
    ], () => { upd(); cv.redraw(); });
    const out = el('div'); host.appendChild(out);
    const need = () => SRC[st.src][1].map((L, i) => L - P.NC_CURVES[st.nc][i] + st.flank - (+st.path) * (i < 2 ? 0.6 : 1));
    const cons = () => Object.entries(CONS).map(([k, c]) => { const tl = OCT.map((f) => c.tl(f)); const ok = tl.every((x, i) => x >= need()[i]); const stc = P.stc(T16.map((f) => c.tl(f))); return { k, name: c.name, tl, ok, stc, short: Math.max(...tl.map((x, i) => need()[i] - x)) }; });
    const cv = A.canvas(host, {
      height: 320,
      caption: 'Required isolation per octave = source level − allowed level in the receiving room (NC curve) + a safety allowance. Bars: what you need. Lines: what common constructions deliver. A construction works only if its line clears <b>every</b> bar — usually the 63 and 125 Hz bars decide.',
      draw(ctx, w, h) {
        const n = need(), C = cons();
        const ax = A.axes(ctx, w, h, { x: { min: 45, max: 11000, log: true, label: 'Octave band (Hz)', ticks: OCT }, y: { min: 0, max: 100, label: 'Isolation (dB)' } });
        n.forEach((v, i) => { const X = ax.X(OCT[i]); ctx.fillStyle = A.alpha(A.css('bad'), 0.35); ctx.fillRect(X - 12, ax.Y(Math.max(0, v)), 24, ax.y0 - ax.Y(Math.max(0, v))); });
        C.forEach((c, i) => { A.plotLine(ctx, ax, OCT.map((f, k) => [f, c.tl[k]]), c.ok ? A.css('good') : A.series(i + 1), c.ok ? 2.6 : 1.4, c.ok ? null : [5, 4]); });
      },
    });
    host.appendChild(A.legend([[A.alpha(A.css('bad'), 0.5), 'Required'], [A.css('good'), 'Construction that passes'], [A.css('c2'), 'Fails at some band', true]]));
    function upd() {
      const n = need(), C = cons();
      out.innerHTML = `<div class="stats">${A.statBox('Hardest band', fmtHz(OCT[n.indexOf(Math.max(...n))]), fmt(Math.max(...n), 3) + ' dB needed')}${A.statBox('Approx. STC needed', '≈ ' + Math.round(Math.max(...n.slice(2, 7)) + 5), 'mid-band — but check the bass')}</div>
        <div class="table-wrap"><table><tr><th>Construction</th><th class="num">STC (model)</th><th>Result</th></tr>${C.map((c) => `<tr><td>${c.name}</td><td class="num">${c.stc}</td><td>${c.ok ? '<span class="good">✓ meets every band</span>' : `<span class="bad">✗ short by ${fmt(c.short, 2)} dB</span> at worst band`}</td></tr>`).join('')}</table></div>`;
    }
    upd();
  };

  /* ======================================================================
     9. Composite wall: doors, windows and gaps — the weak links
     ====================================================================== */
  const WALLC = { 45: 'Basic stud wall (≈ 45 dB)', 52: 'Good stud wall (≈ 52 dB)', 60: 'Double-stud wall (≈ 60 dB)', 68: 'Room-in-room (≈ 68 dB)' };
  const DOORS = { 18: 'Hollow-core interior door (≈ 18 dB)', 26: 'Solid-core door, no seals (≈ 26 dB)', 34: 'Solid-core door with full seals (≈ 34 dB)', 45: 'Acoustic studio door (≈ 45 dB)', 60: 'Two sealed doors with a sound lock (≈ 60 dB)' };
  const WINS = { 0: 'No window', 26: 'Single glazing (≈ 26 dB)', 31: 'Thermal double glazing (≈ 31 dB)', 38: 'Laminated double glazing (≈ 38 dB)', 55: 'Studio double window, 150 mm gap (≈ 55 dB)' };
  V.compositeTL = function (host) {
    const st = A.controls(host, [
      { key: 'wall', label: 'Wall', type: 'select', value: '60', options: Object.entries(WALLC) },
      { key: 'door', label: 'Door', type: 'select', value: '34', options: Object.entries(DOORS) },
      { key: 'win', label: 'Window', type: 'select', value: '0', options: Object.entries(WINS) },
      { key: 'gap', label: 'Gap under the door', type: 'range', min: 0, max: 20, step: 1, value: 0, unit: 'mm' },
      { key: 'box', label: 'Unsealed outlet / service holes', type: 'range', min: 0, max: 6, step: 1, value: 0 },
    ], () => { upd(); cv.redraw(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const S = 12;
    function elems() {
      const doorA = 1.9, winA = +st.win ? 1.2 : 0, gapA = (st.gap / 1000) * 0.9, boxA = st.box * 0.0012;
      return [
        { k: 'Wall', area: S - doorA - winA - gapA - boxA, tl: +st.wall, col: 'muted' },
        { k: 'Door', area: doorA, tl: +st.door, col: 'accent' },
        { k: 'Window', area: winA, tl: +st.win || 99, col: 'c3' },
        { k: 'Door gap', area: gapA, tl: 0, col: 'bad' },
        { k: 'Holes', area: boxA, tl: 3, col: 'warn' },
      ].filter((e) => e.area > 0);
    }
    const cv = A.canvas(host, {
      height: 280, animate: true,
      caption: 'Left: the wall elevation; arrows show where sound energy leaks, sized by their share. Right: share of the transmitted energy by element. Sound isolation is like a bucket — it leaks through the biggest hole, not the strongest wall.',
      draw(ctx, w, h, t) {
        const E = elems(), tot = E.reduce((s, e) => s + e.area * Math.pow(10, -e.tl / 10), 0);
        const ew = Math.min(w * 0.55, 420), eh = h - 40, x0 = 14, y0 = 16, sx = ew / 4, sy = eh / 3;
        ctx.fillStyle = A.alpha(A.css('muted'), 0.3); ctx.fillRect(x0, y0, ew, eh);
        const door = { x: x0 + sx * 0.4, y: y0 + eh - 2.1 * sy, w: 0.9 * sx, h: 2.1 * sy };
        ctx.fillStyle = A.alpha(A.css('accent'), 0.5); ctx.fillRect(door.x, door.y, door.w, door.h);
        if (st.gap) { ctx.fillStyle = A.css('bad'); ctx.fillRect(door.x, y0 + eh - Math.max(2, st.gap / 4), door.w, Math.max(2, st.gap / 4)); }
        if (+st.win) { ctx.fillStyle = A.alpha(A.css('c3'), 0.5); ctx.fillRect(x0 + 2.2 * sx, y0 + 0.8 * sy, 1.2 * sx, 1.0 * sy); }
        for (let k = 0; k < st.box; k++) dot(ctx, x0 + 1.7 * sx + k * 14, y0 + eh - 0.35 * sy, 4, A.css('warn'));
        const pulse = (t * 1.5) % 1;
        E.forEach((e) => {
          const share = (e.area * Math.pow(10, -e.tl / 10)) / tot; if (share < 0.02) return;
          const cx = e.k === 'Door' ? door.x + door.w / 2 : e.k === 'Window' ? x0 + 2.8 * sx : e.k === 'Door gap' ? door.x + door.w / 2 : e.k === 'Holes' ? x0 + 1.7 * sx : x0 + 3.5 * sx;
          const cy = e.k === 'Door gap' ? y0 + eh - 6 : e.k === 'Window' ? y0 + 1.3 * sy : e.k === 'Holes' ? y0 + eh - 0.35 * sy : e.k === 'Door' ? door.y + door.h / 2 : y0 + 0.6 * sy;
          const r = 6 + 30 * share * (0.6 + 0.4 * pulse);
          ctx.strokeStyle = A.alpha(A.css(e.col === 'muted' ? 'text' : e.col), 0.9 - pulse * 0.6); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); ctx.lineWidth = 1;
        });
        // share bars
        const bx = x0 + ew + 30, bw = w - bx - 14; let y = y0 + 10;
        A.text(ctx, 'Share of sound getting through', bx, y, { size: 11, weight: 700 }); y += 12;
        E.forEach((e) => { const share = (e.area * Math.pow(10, -e.tl / 10)) / tot; ctx.fillStyle = A.alpha(A.css('muted'), 0.2); ctx.fillRect(bx, y, bw, 18); ctx.fillStyle = A.css(e.col === 'muted' ? 'text' : e.col); ctx.fillRect(bx, y, bw * share, 18); A.text(ctx, `${e.k} · ${fmt(share * 100, 3)} %`, bx + 4, y + 13, { size: 11, color: share > 0.5 ? A.css('panel') : A.css('text') }); y += 26; });
      },
    });
    function upd() {
      const E = elems(), tl = P.compositeTL(E);
      out.innerHTML = A.statBox('Wall alone', st.wall + ' dB', '') + A.statBox('Whole wall as built', fmt(tl, 3) + ' dB', `lost ${fmt(+st.wall - tl, 3)} dB`, +st.wall - tl > 10 ? 'bad' : +st.wall - tl > 4 ? 'warn' : 'good') + A.statBox('Weakest link', E.slice().sort((a, b) => b.area * Math.pow(10, -b.tl / 10) - a.area * Math.pow(10, -a.tl / 10))[0].k, 'fix this first');
    }
    upd();
  };

  /* ======================================================================
     10. Flutter echo between parallel walls (with audio)
     ====================================================================== */
  V.flutter = function (host) {
    const st = A.controls(host, [
      { key: 'd', label: 'Distance between the walls', type: 'range', min: 1.5, max: 12, step: 0.1, value: 3.4, fmt: (v) => fmt(v, 3) + ' m' },
      { key: 'fix', label: 'Treatment', type: 'select', value: 'none', options: [['none', 'Two bare parallel walls'], ['abs', '50 mm absorber on one wall'], ['diff', 'Diffuser / bookshelf on one wall'], ['splay', 'One wall splayed 8°']] },
    ], () => upd());
    const row = el('div', { class: 'row' }); const clap = el('button', { class: 'primary', html: A.icon('play') + ' Clap in this room' }); row.appendChild(clap); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const loss = () => ({ none: 0.93, abs: 0.35, diff: 0.55, splay: 0.45 })[st.fix];
    clap.onclick = () => {
      const ctx = A.audio.get(); if (!ctx) return; A.audio.stopAll();
      const sr = ctx.sampleRate, dur = 2.2, buf = ctx.createBuffer(1, sr * dur, sr), d = buf.getChannelData(0);
      const T = (2 * st.d) / P.C, r = loss();
      for (let n = 0; n < 60; n++) { const t0 = n * T; if (t0 > dur - 0.05) break; const amp = Math.pow(r, n) * (n ? 0.8 : 1); const i0 = Math.floor(t0 * sr); for (let k = 0; k < sr * 0.004; k++) d[i0 + k] += amp * (Math.random() * 2 - 1) * Math.exp(-k / (sr * 0.0008)); }
      for (let i = 0; i < d.length; i++) d[i] += (Math.random() * 2 - 1) * 0.02 * Math.exp(-i / (sr * 0.12));
      const s = ctx.createBufferSource(); s.buffer = buf; const g = ctx.createGain(); g.gain.value = 0.6; s.connect(g).connect(ctx.destination); s.start(); A.audio.track(s);
    };
    A.canvas(host, {
      height: 200, animate: true,
      caption: 'A clap bounces back and forth between two hard parallel surfaces. The regular repeats (every 2d/c seconds) blur into a metallic “zing” with a pitch of c/(2d). Treat or splay just one of the two walls to break the pattern.',
      draw(ctx, w, h, t) {
        const x0 = 30, x1 = w - 30, y0 = 20, y1 = h - 20, r = loss();
        ctx.fillStyle = A.alpha(A.css('muted'), 0.5); ctx.fillRect(x0 - 10, y0, 10, y1 - y0);
        if (st.fix === 'splay') { ctx.save(); ctx.translate(x1 + 5, (y0 + y1) / 2); ctx.rotate(0.14); ctx.fillRect(-5, -(y1 - y0) / 2, 10, y1 - y0); ctx.restore(); }
        else ctx.fillRect(x1, y0, 10, y1 - y0);
        if (st.fix === 'abs') { ctx.fillStyle = A.alpha(A.css('c4'), 0.7); ctx.fillRect(x1 - 12, y0, 12, y1 - y0); }
        if (st.fix === 'diff') { ctx.fillStyle = A.css('accent2'); for (let y = y0; y < y1; y += 12) ctx.fillRect(x1 - ((y / 12) % 3 + 1) * 5, y, ((y / 12) % 3 + 1) * 5, 11); }
        const period = 2.2, ph = (t % period) / period, travel = ph * 8; const n = Math.floor(travel), frac = travel - n;
        const x = n % 2 ? x1 - frac * (x1 - x0) : x0 + frac * (x1 - x0);
        const amp = Math.pow(r, n);
        ctx.strokeStyle = A.alpha(A.css('accent'), Math.max(0.05, amp)); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, y0 + 10); ctx.lineTo(x, y1 - 10); ctx.stroke(); ctx.lineWidth = 1;
        if (st.fix !== 'none' && n >= 1) A.text(ctx, st.fix === 'diff' ? 'scattered' : st.fix === 'splay' ? 'redirected up/down' : 'absorbed', (x0 + x1) / 2, y1 + 14, { align: 'center', size: 10, color: A.css('good') });
      },
    });
    function upd() { const T = (2 * st.d) / P.C; out.innerHTML = A.statBox('Repeat interval', fmt(T * 1000, 3) + ' ms', '2d / c') + A.statBox('Flutter “pitch”', fmtHz(1 / T), 'c / 2d') + A.statBox('Loss per round trip', fmt(-20 * Math.log10(loss() ** 2), 2) + ' dB', st.fix === 'none' ? 'rings for a long time' : 'dies quickly'); }
    upd();
  };

  /* ======================================================================
     11. Speaker–boundary interference (SBIR) & flush mounting
     ====================================================================== */
  V.sbir = function (host) {
    const st = A.controls(host, [
      { key: 'mount', label: 'Mounting', type: 'select', value: 'free', options: [['free', 'Free-standing on stands'], ['wall', 'Pushed back against the wall'], ['hard', 'Hard flush-mounted (soffit, rigid baffle)'], ['soft', 'Soft flush-mounted (decoupled, damped baffle)']] },
      { key: 'd', label: 'Distance: woofer to front wall', type: 'range', min: 0.05, max: 2, step: 0.01, value: 0.7, unit: 'm' },
      { key: 'side', label: 'Also include the side wall & floor', type: 'check', value: true },
    ], () => { upd(); cv.redraw(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const fbs = 115 / 0.25;
    function resp(f) {
      if (st.mount === 'hard' || st.mount === 'soft') return 6 * (1 / (1 + Math.pow(f / fbs, 2))) - 3 + (st.mount === 'soft' ? -0.5 * Math.exp(-((f - 40) ** 2) / 200) : 0);
      const d = st.mount === 'wall' ? 0.08 : st.d;
      const omni = 1 / (1 + Math.pow(f / fbs, 2));
      let re = 1, im = 0; const add = (dist, g) => { const ph = (TAU * f * 2 * dist) / P.C; re += g * omni * Math.cos(ph); im -= g * omni * Math.sin(ph); };
      add(d, 0.9); if (st.side) { add(1.1, 0.7); add(1.0, 0.6); }
      return 20 * Math.log10(Math.hypot(re, im)) - (st.side ? 6 : 3) * omni;
    }
    const cv = A.canvas(host, {
      height: 280,
      caption: 'At low frequencies a loudspeaker radiates in all directions, so sound also bounces off the wall behind it and returns out of phase at c/(4d). Moving the speaker changes the notch — flush-mounting removes it entirely, because there is no gap behind the speaker for the reflection to travel.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 1000, log: true, label: 'Frequency (Hz)', ticks: [20, 50, 100, 200, 500, 1000] }, y: { min: -24, max: 12, label: 'Level at the seat (dB)' } });
        const pts = []; for (let f = 20; f <= 1000; f *= 1.015) pts.push([f, A.clamp(resp(f), -24, 12)]);
        ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(3), ax.x1 - ax.x0, ax.Y(-3) - ax.Y(3));
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.6);
        if (st.mount === 'free' || st.mount === 'wall') { const fn = P.sbirNull(st.mount === 'wall' ? 0.08 : st.d); if (fn > 20 && fn < 1000) { ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('bad'); ctx.beginPath(); ctx.moveTo(ax.X(fn), ax.y1); ctx.lineTo(ax.X(fn), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'c/4d = ' + fmtHz(fn), ax.X(fn) + 4, ax.y1 + 12, { size: 11, color: A.css('bad') }); } }
      },
    });
    function upd() {
      const msg = { free: st.d < 0.3 ? 'Close to the wall: notch pushed high (above ~280 Hz), bass reinforced — needs EQ.' : st.d > 1.2 ? 'Far from the wall: notch drops low and narrow — often the best free-standing choice if the room allows.' : 'The worst zone: 0.5–1 m from the wall puts the notch right in the bass/low-mid range.', wall: 'Against the wall: notch moves up and the bass gets louder. Use the speaker’s boundary EQ switch.', hard: 'Hard flush-mounting: the baffle becomes part of the wall. No front-wall notch, +6 dB more low end (half-space), cleaner imaging. Needs a massive, rigid, well-sealed baffle.', soft: 'Soft flush-mounting: the speaker is flush but sits on decoupling pads in a damped baffle, so it does not shake the structure. Same acoustic benefit; less structure-borne bass to neighbours.' };
      out.innerHTML = `<div class="callout mentor">${msg[st.mount]}</div>`;
    }
    upd();
  };

  /* ======================================================================
     12. HVAC: airflow, duct velocity and noise
     ====================================================================== */
  V.ductNoise = function (host) {
    const st = A.controls(host, [
      { key: 'ppl', label: 'People in the room', type: 'range', min: 1, max: 12, step: 1, value: 3 },
      { key: 'kw', label: 'Equipment heat (amps, computers, lights)', type: 'range', min: 0.2, max: 6, step: 0.1, value: 1.2, unit: 'kW' },
      { key: 'dia', label: 'Duct size (diameter)', type: 'range', min: 100, max: 500, step: 10, value: 200, unit: 'mm' },
      { key: 'grilles', label: 'Number of supply grilles', type: 'range', min: 1, max: 6, step: 1, value: 2 },
      { key: 'sil', label: 'Noise control', type: 'select', value: 'none', options: [['none', 'Bare sheet-metal duct'], ['lined', 'Internally lined duct, 3 m'], ['box', 'Lined duct + baffle (plenum) box'], ['full', 'Silencer + baffle box + flexible connectors']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    let cur = {};
    A.canvas(host, {
      height: 170, animate: true,
      caption: 'Air must reach the room quietly: big ducts and many grilles keep velocity low. Noise from the fan is removed along the way by lined ducts, baffle boxes (sound has to turn corners through absorber) and silencers.',
      draw(ctx, w, h, t) {
        const y = h / 2, hh = A.clamp(st.dia / 12, 10, 40);
        ctx.fillStyle = A.alpha(A.css('muted'), 0.25); ctx.fillRect(60, y - hh / 2, w - 120, hh);
        if (st.sil !== 'none') { ctx.fillStyle = A.alpha(A.css('c4'), 0.6); ctx.fillRect(60, y - hh / 2, w - 120, 4); ctx.fillRect(60, y + hh / 2 - 4, w - 120, 4); }
        if (st.sil === 'box' || st.sil === 'full') { ctx.fillStyle = A.alpha(A.css('c4'), 0.5); rr(ctx, w * 0.55, y - hh - 14, 80, hh * 2 + 28, 6); ctx.fill(); A.text(ctx, 'baffle box', w * 0.55 + 40, y + hh + 28, { align: 'center', size: 10 }); }
        if (st.sil === 'full') { ctx.fillStyle = A.alpha(A.css('accent2'), 0.6); ctx.fillRect(w * 0.32, y - hh / 2 - 6, 60, hh + 12); A.text(ctx, 'silencer', w * 0.32 + 30, y - hh / 2 - 10, { align: 'center', size: 10 }); }
        ctx.fillStyle = A.css('text'); rr(ctx, 10, y - 22, 46, 44, 8); ctx.fill(); A.text(ctx, 'fan', 33, y + 4, { align: 'center', size: 11, color: A.css('panel') });
        A.text(ctx, 'room ▸', w - 54, y + 4, { size: 11, weight: 700 });
        const v = cur.v || 2, n = 26;
        for (let k = 0; k < n; k++) { const x = 60 + (((t * v * 40) + k * ((w - 120) / n)) % (w - 120)); dot(ctx, x, y + Math.sin(k * 3) * hh * 0.3, 2.4, v > 4 ? A.css('bad') : A.css('accent')); }
      },
    });
    function upd() {
      const Q = Math.max(st.ppl * 36, ((st.kw + st.ppl * 0.1) * 1000) / (1.2 * 1005 * 6) * 3600);
      const area = Math.PI * (st.dia / 2000) ** 2, v = Q / 3600 / area, vg = Q / 3600 / (st.grilles * 0.06);
      const ncDuct = 12 + 55 * Math.log10(Math.max(v, 0.5) / 2.5) + 20, ncGr = 15 + 55 * Math.log10(Math.max(vg, 0.3) / 1.5);
      const att = { none: 0, lined: 12, box: 22, full: 35 }[st.sil];
      const ncFan = 55 - att;
      const nc = 10 * Math.log10(Math.pow(10, ncDuct / 10) * (st.sil === 'none' ? 1 : 0.3) + Math.pow(10, ncGr / 10) + Math.pow(10, ncFan / 10));
      cur = { v };
      out.innerHTML = A.statBox('Air needed', fmt(Q, 3) + ' m³/h', 'fresh air & heat removal') + A.statBox('Duct velocity', fmt(v, 2) + ' m/s', v > 4 ? 'too fast for a studio' : v > 2.5 ? 'borderline' : 'quiet', v > 4 ? 'bad' : v > 2.5 ? 'warn' : 'good') + A.statBox('Grille face velocity', fmt(vg, 2) + ' m/s', vg > 2 ? 'whistles' : 'ok') + A.statBox('Estimated room noise', 'NC ' + Math.round(nc), nc <= 20 ? 'recording-grade' : nc <= 25 ? 'control-room grade' : 'too noisy for recording', nc <= 20 ? 'good' : nc <= 25 ? 'warn' : 'bad');
      note.innerHTML = `<div class="callout data">Studio targets: main ducts under about <b>3 m/s</b>, final runs and grilles under about <b>1.5–2 m/s</b>, background noise <b>NC 15–20</b> in recording rooms and <b>NC 20–25</b> in control rooms. Every duct that passes through an isolation wall needs its own silencer or baffle box — or it becomes a speaking tube between rooms.</div>`;
    }
    upd();
  };

  /* ======================================================================
     13. Booth sizing — modes, boxiness and the wall reflection
     ====================================================================== */
  V.boothSize = function (host) {
    const st = A.controls(host, [
      { key: 'L', label: 'Length', type: 'range', min: 0.9, max: 4, step: 0.05, value: 1.5, unit: 'm' },
      { key: 'W', label: 'Width', type: 'range', min: 0.9, max: 4, step: 0.05, value: 1.2, unit: 'm' },
      { key: 'H', label: 'Height', type: 'range', min: 1.9, max: 3, step: 0.05, value: 2.1, unit: 'm' },
      { key: 'dm', label: 'Mic distance to the nearest wall', type: 'range', min: 0.2, max: 1.2, step: 0.05, value: 0.45, unit: 'm' },
      { key: 'tr', label: 'Treatment depth on walls', type: 'range', min: 0.025, max: 0.3, step: 0.005, value: 0.1, unit: 'm' },
    ], () => { upd(); cv.redraw(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    const cv = A.canvas(host, {
      height: 230,
      caption: 'Axial modes (tall lines) and other modes (short) of the booth. In small booths the first modes land at 70–200 Hz — right in the voice’s chest region — and are widely spaced, which causes the “boxy” sound. The green band is what your treatment depth absorbs well (above roughly c/(8·depth)).',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 40, max: 600, log: true, label: 'Frequency (Hz)', ticks: [50, 100, 200, 300, 500] }, y: { min: 0, max: 1, label: '' }, pad: { l: 20 } });
        const fa = P.C / (8 * st.tr);
        ctx.fillStyle = A.alpha(A.css('good'), 0.12); ctx.fillRect(ax.X(A.clamp(fa, 40, 600)), ax.y1, ax.x1 - ax.X(A.clamp(fa, 40, 600)), ax.y0 - ax.y1);
        ctx.fillStyle = A.alpha(A.css('warn'), 0.1); ctx.fillRect(ax.X(100), ax.y1, ax.X(300) - ax.X(100), ax.y0 - ax.y1); A.text(ctx, 'voice “chest” region', ax.X(170), ax.y1 + 12, { align: 'center', size: 10, color: A.css('warn') });
        P.roomModes(st.L, st.W, st.H, 600).forEach((m) => { const X = ax.X(m.f); const hh = m.type === 'axial' ? 0.85 : m.type === 'tangential' ? 0.5 : 0.3; ctx.strokeStyle = m.type === 'axial' ? A.css('bad') : A.alpha(A.css('accent'), 0.7); ctx.lineWidth = m.type === 'axial' ? 2.5 : 1; ctx.beginPath(); ctx.moveTo(X, ax.y0); ctx.lineTo(X, ax.Y(hh)); ctx.stroke(); });
        ctx.lineWidth = 1;
        const fn = P.C / (4 * st.dm); if (fn < 600) { ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('c3'); ctx.beginPath(); ctx.moveTo(ax.X(fn), ax.y0); ctx.lineTo(ax.X(fn), ax.y1); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'mic–wall notch', ax.X(fn) + 4, ax.Y(0.95), { size: 10, color: A.css('c3') }); }
      },
    });
    function upd() {
      const V0 = st.L * st.W * st.H, ax = P.roomModes(st.L, st.W, st.H, 600).filter((m) => m.type === 'axial');
      const first = ax[0].f, dims = [st.L, st.W, st.H].sort((a, b) => a - b), near = Math.abs(dims[1] / dims[0] - Math.round(dims[1] / dims[0])) < 0.08 || Math.abs(dims[2] / dims[1] - Math.round(dims[2] / dims[1])) < 0.08;
      out.innerHTML = A.statBox('Volume', fmt(V0, 3) + ' m³', V0 < 3 ? 'very small' : V0 < 7 ? 'typical VO booth' : 'roomy') + A.statBox('Lowest mode', fmtHz(first), '') + A.statBox('Treatment works above', fmtHz(P.C / (8 * st.tr)), 'c / (8 · depth)') + A.statBox('First comb notch at mic', fmtHz(P.C / (4 * st.dm)), 'move the mic or absorb that wall');
      note.innerHTML = `<div class="callout ${near ? 'warn' : 'mentor'}">${near ? 'Two dimensions are equal or simple multiples — their modes stack. Change one dimension by 10–15 % if you can.' : 'Dimensions are reasonably different. '} Small booths need <b>deep</b> broadband absorption (100–200 mm with an air gap) on most surfaces, not thin foam: thin foam kills the highs and leaves the boxy low-mids. Keep the mouth 40–60 cm from any wall and aim the mic away from the nearest one.</div>`;
    }
    upd();
  };

  /* ======================================================================
     14. Gas flow resistivity test rig
     ====================================================================== */
  const FR = { mineral: ['Mineral wool 45 kg/m³', 12000], glass: ['Glass wool 24 kg/m³', 7000], rock: ['Rock wool slab 100 kg/m³', 30000], poly: ['Polyester fibre 30 kg/m³', 5000], foam: ['Open-cell PU foam', 9000], cotton: ['Recycled cotton batt', 6000] };
  V.flowRes = function (host) {
    const st = A.controls(host, [
      { key: 'mat', label: 'Sample', type: 'select', value: 'mineral', options: Object.entries(FR).map(([k, v]) => [k, v[0]]) },
      { key: 't', label: 'Sample thickness', type: 'range', min: 0.02, max: 0.1, step: 0.005, value: 0.05, unit: 'm' },
      { key: 'Q', label: 'Air flow through the tube', type: 'range', min: 0.5, max: 10, step: 0.1, value: 2, fmt: (v) => fmt(v, 2) + ' L/min' },
    ], () => { upd(); cv.redraw(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const D = 0.1, S = Math.PI * (D / 2) ** 2;
    const calc = () => { const sig = FR[st.mat][1], u = st.Q / 1000 / 60 / S; const dp = sig * u * st.t; return { sig, u, dp }; };
    const cv = A.canvas(host, {
      height: 260, animate: true,
      caption: 'Flow resistivity σ tells you how hard it is to push air through a material. A steady, very slow airflow passes through a sample in a tube; a manometer reads the pressure drop. σ = Δp · S / (Q · t). It is the single most useful number for predicting porous absorption — and you can test it yourself.',
      draw(ctx, w, h, t) {
        const r = calc(); const y = 70, tw = w * 0.55;
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(20, y - 24, tw, 48); ctx.lineWidth = 1;
        const sx = 20 + tw * 0.5; ctx.fillStyle = A.alpha(A.css('c4'), 0.7); ctx.fillRect(sx, y - 23, 30 + st.t * 300, 46);
        for (let k = 0; k < 16; k++) { const x = 24 + ((t * 40 * (st.Q / 2) + k * (tw / 16)) % (tw - 8)); dot(ctx, x, y + ((k * 13) % 30) - 15, 2.2, x > sx && x < sx + 30 + st.t * 300 ? A.css('warn') : A.css('accent')); }
        A.text(ctx, 'air pump → flow meter →', 20, y - 32, { size: 10, color: A.css('muted') });
        A.text(ctx, 'sample', sx + 15, y + 40, { size: 10, color: A.css('muted') });
        // manometer
        const mx = tw + 60, lvl = A.clamp(r.dp / 50, 0, 1) * 60;
        ctx.strokeStyle = A.css('text'); ctx.strokeRect(mx, 20, 14, 90); ctx.strokeRect(mx + 30, 20, 14, 90);
        ctx.fillStyle = A.css('c3'); ctx.fillRect(mx + 1, 65 + lvl / 2, 12, 44 - lvl / 2); ctx.fillRect(mx + 31, 65 - lvl / 2, 12, 44 + lvl / 2);
        A.text(ctx, `Δp = ${fmt(r.dp, 3)} Pa`, mx + 22, 128, { align: 'center', size: 12, weight: 700 });
        // alpha preview
        const ax = A.axes(ctx, w, h, { x: { min: 63, max: 4000, log: true, label: 'Hz', ticks: [63, 125, 250, 500, 1000, 2000, 4000] }, y: { min: 0, max: 1, label: 'α' }, pad: { t: 150, b: 30, l: 40 } });
        [[0.05, 0, 'c3'], [0.1, 0, 'accent'], [0.1, 0.1, 'good']].forEach(([d, g, c]) => { const pts = []; for (let f = 63; f <= 4000; f *= 1.05) pts.push([f, P.porousAlpha(f, r.sig, d, g)]); A.plotLine(ctx, ax, pts, A.css(c), 2); });
      },
    });
    host.appendChild(A.legend([[A.css('c3'), '50 mm on wall'], [A.css('accent'), '100 mm on wall'], [A.css('good'), '100 mm + 100 mm gap']]));
    function upd() { const r = calc(); out.innerHTML = A.statBox('Air speed in sample', fmt(r.u * 1000, 3) + ' mm/s', r.u > 0.005 ? 'keep below ~5 mm/s (ISO 9053)' : 'ok', r.u > 0.005 ? 'warn' : 'good') + A.statBox('Pressure drop', fmt(r.dp, 3) + ' Pa', '') + A.statBox('Flow resistivity σ', fmt(r.sig, 4) + ' Pa·s/m²', r.sig < 5000 ? 'very open — use thicker layers' : r.sig > 25000 ? 'dense — good thin, reflects if too thick' : 'ideal for panels (5–20 k)') + A.statBox('Total resistance', fmt((r.sig * st.t) / (P.RHO * P.C), 2) + ' ρc', 'aim ≈ 1–4 ρc for the whole layer'); }
    upd();
  };

  /* ======================================================================
     15. Impedance balance and CMRR
     ====================================================================== */
  V.impBalance = function (host) {
    const st = A.controls(host, [
      { key: 'dz', label: 'Imbalance between hot and cold source impedance', type: 'range', min: 0, max: 3, step: 0.01, value: 1, fmt: (v) => fmt(Math.pow(10, v), 3) + ' Ω' },
    ], () => { upd(); cv.redraw(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const INP = [['Simple differential amp (10 kΩ common-mode)', 1e4, 'bad'], ['Typical electronic input (50 kΩ)', 5e4, 'warn'], ['High common-mode-impedance IC input (10 MΩ)', 1e7, 'good'], ['Good input transformer (≈ 50 MΩ)', 5e7, 'c3']];
    const cmrr = (zcm, dz) => Math.min(120, 20 * Math.log10(zcm / Math.max(dz, 0.1)));
    const cv = A.canvas(host, {
      height: 260,
      caption: 'A balanced input rejects noise only if both wires have <b>equal impedances</b> to ground all the way from the source. Real outputs, cables and connectors are never perfectly matched; inputs with a very high common-mode impedance tolerate that imbalance far better.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 1, max: 1000, log: true, label: 'Source impedance imbalance (Ω)', ticks: [1, 10, 100, 1000] }, y: { min: 20, max: 120, label: 'CMRR (dB)' } });
        INP.forEach(([n, z, c]) => { const pts = []; for (let d = 1; d <= 1000; d *= 1.1) pts.push([d, cmrr(z, d)]); A.plotLine(ctx, ax, pts, A.css(c), 2.2); });
        const dz = Math.pow(10, st.dz); ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(ax.X(Math.max(1, dz)), ax.y0); ctx.lineTo(ax.X(Math.max(1, dz)), ax.y1); ctx.stroke(); ctx.setLineDash([]);
      },
    });
    host.appendChild(A.legend(INP.map(([n, , c]) => [A.css(c), n])));
    function upd() { const dz = Math.pow(10, st.dz); out.innerHTML = INP.map(([n, z]) => A.statBox(n.split('(')[0], fmt(cmrr(z, dz), 3) + ' dB', '')).join(''); }
    upd();
  };
})();
