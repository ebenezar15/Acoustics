/* ==========================================================================
   Acoustica — hum, buzz & grounding widgets.
   Practical, visual models of where ground noise comes from and how wiring
   choices change it. Physics after Brandt & Sauro, Whitlock, Muncy (1995)
   and AES48; simplified for teaching.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt } = A;
  const MU0 = 4e-7 * Math.PI;
  const TAU = Math.PI * 2;
  const dBV = (v) => 20 * Math.log10(Math.max(v, 1e-12));
  const dBu = (v) => 20 * Math.log10(Math.max(v, 1e-12) / 0.7746);
  const mv = (v) => (v >= 1 ? fmt(v, 3) + ' V' : v >= 1e-3 ? fmt(v * 1e3, 3) + ' mV' : fmt(v * 1e6, 3) + ' µV');
  const verdict = (snr) => snr >= 90 ? ['good', 'Inaudible'] : snr >= 75 ? ['good', 'Only in silence'] : snr >= 60 ? ['warn', 'Audible in quiet passages'] : ['bad', 'Obvious hum'];
  const harmonicSet = (load) => {
    // current harmonic amplitudes relative to the fundamental, by load type
    if (load === 'dimmer') return Array.from({ length: 40 }, (_, i) => { const n = i + 1; return n === 1 ? 1 : n % 2 ? 0.9 / n : 0; });
    if (load === 'led') return Array.from({ length: 40 }, (_, i) => { const n = i + 1; return n === 1 ? 1 : n % 2 ? 0.8 * Math.exp(-(n - 3) / 6) : 0; });
    return [1];
  };
  V.GROUND = { MU0, harmonicSet };

  /** Voltage induced along a ground wire lying beside a line/neutral pair. */
  V.groundWireEMF = (lenM, amps, f, dL, dN) => MU0 * lenM * f * amps * Math.abs(Math.log(dN / dL));

  /* ----------------------------------------------------------------------
     1. The cable is a transformer — drag the ground wire in the conduit
     ---------------------------------------------------------------------- */
  V.conduitField = function (host) {
    const st = A.controls(host, [
      { key: 'len', label: 'Circuit length', type: 'range', min: 3, max: 100, step: 1, value: 30, fmt: (v) => v + ' m' },
      { key: 'I', label: 'Load current', type: 'range', min: 1, max: 40, step: 1, value: 10, unit: 'A' },
      { key: 'f', label: 'Mains', type: 'select', value: '60', options: [['50', '50 Hz (Europe, Asia, Africa…)'], ['60', '60 Hz (Americas…)']] },
      { key: 'load', label: 'What the circuit feeds', type: 'select', value: 'res', options: [['res', 'Heater / kettle / incandescent'], ['led', 'LED drivers & computer PSUs'], ['dimmer', 'Phase-cut lighting dimmers']] },
      { key: 'tw', label: 'Twist line & neutral together', type: 'check', value: false },
    ], () => { upd(); cv.redraw(); });
    const row = el('div', { class: 'row' });
    const pl = el('button', { class: 'primary', html: A.icon('play') + ' Hear the ground noise' });
    const sp = el('button', { html: A.icon('stop') + ' Stop' });
    const ctr = el('button', {}, 'Put ground wire in the middle');
    row.append(pl, sp, ctr); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    // conduit coordinates in mm, centre (0,0), radius 13 mm (≈ 25 mm conduit)
    const L = { x: -5, y: 0 }, N = { x: 5, y: 0 };
    const G = { x: 3, y: 6 };
    let drag = false, geo = null;
    function calc(t = 0) {
      const f = +st.f, h = harmonicSet(st.load);
      let lx = L.x, ly = L.y, nx = N.x, ny = N.y;
      if (st.tw) { const a = t * 1.4; lx = -5 * Math.cos(a); ly = -5 * Math.sin(a); nx = -lx; ny = -ly; }
      const dL = Math.max(2.2, Math.hypot(G.x - lx, G.y - ly)), dN = Math.max(2.2, Math.hypot(G.x - nx, G.y - ny));
      const raw = V.groundWireEMF(st.len, st.I, f, Math.hypot(G.x - L.x, G.y - L.y) || 2.2, Math.hypot(G.x - N.x, G.y - N.y) || 2.2);
      const floor = MU0 * st.len * f * st.I * 0.003; // real cables are never perfectly symmetrical
      const v1 = st.tw ? Math.max(raw, floor) * 0.001 : Math.max(raw, floor); // twisting averages the geometry: ≈ 60 dB less
      const parts = h.map((a, i) => v1 * a * (i + 1)); // induced voltage ∝ dI/dt → × harmonic number
      const tot = Math.sqrt(parts.reduce((s, x) => s + x * x, 0));
      return { lx, ly, nx, ny, dL, dN, v1, parts, tot, f };
    }
    pl.onclick = () => { A.audio.stopAll(); const c = calc(); const m = Math.max(...c.parts); V.playHarm(c.f, c.parts.map((x) => x / m), 0); };
    sp.onclick = () => A.audio.stopAll();
    ctr.onclick = () => { G.x = 0; G.y = 0.01; upd(); cv.redraw(); };
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Left: a cross-section of the cable. Brown = line, blue = neutral, green = ground. The colour map shows how much voltage a ground wire would pick up at each spot — <b>drag the green wire</b>. The dashed line midway between line and neutral is the near-zero zone. Right: the noise voltage along the ground wire over two mains cycles, and its harmonics.',
      draw(ctx, w, h, t, dt, api) {
        const c = calc(t);
        const half = Math.min(w * 0.42, h - 20), R = half / 2 - 8, cx = 14 + half / 2, cy = h / 2, s = R / 13;
        geo = { cx, cy, s };
        // heat map of |ln(dN/dL)|
        const step = 5;
        for (let y = -R; y < R; y += step) for (let x = -R; x < R; x += step) {
          if (x * x + y * y > R * R) continue;
          const mx = x / s, my = y / s;
          const a = Math.abs(Math.log(Math.max(2, Math.hypot(mx - c.nx, my - c.ny)) / Math.max(2, Math.hypot(mx - c.lx, my - c.ly))));
          const k = A.clamp(a / 2.2, 0, 1) * (st.tw ? 0.12 : 1);
          ctx.fillStyle = A.alpha(k > 0.5 ? A.css('bad') : A.css('warn'), 0.08 + 0.6 * k);
          ctx.fillRect(cx + x, cy + y, step, step);
        }
        ctx.strokeStyle = A.css('muted'); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
        // zero line (perpendicular bisector of L–N)
        if (!st.tw) { ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('good'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, '≈ 0 V zone', cx + 4, cy - R + 14, { size: 10, color: A.css('good') }); }
        // field rings around conductors (pulse with mains)
        const ph = Math.sin(t * 3);
        [[c.lx, c.ly, '#a0522d', 'L'], [c.nx, c.ny, '#3b6fd8', 'N']].forEach(([x, y, col, lab], i) => {
          const X = cx + x * s, Y = cy + y * s;
          for (let r = 1; r < 4; r++) { ctx.strokeStyle = A.alpha(col, 0.25 * Math.abs(ph)); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(X, Y, (2.4 + r * 2.6) * s, 0, TAU); ctx.stroke(); }
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X, Y, 2.2 * s, 0, TAU); ctx.fill();
          A.text(ctx, (i === 0 ? (ph > 0 ? '⊙' : '⊗') : (ph > 0 ? '⊗' : '⊙')) + ' ' + lab, X, Y + 4, { align: 'center', size: 11, weight: 700, color: '#fff' });
        });
        const GX = cx + G.x * s, GY = cy + G.y * s;
        ctx.fillStyle = '#2e9e48'; ctx.beginPath(); ctx.arc(GX, GY, 1.9 * s, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#e5c100'; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(GX, GY, 1.9 * s, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'G', GX, GY + 4, { align: 'center', size: 11, weight: 700, color: '#fff' });
        if (st.tw) A.text(ctx, 'twisted: L and N swap sides every few cm', cx, cy + R + 14, { align: 'center', size: 10, color: A.css('muted') });
        // waveform
        const x0 = 14 + half + 26, x1 = w - 10, wy0 = 18, wy1 = h * 0.56;
        const pts = 220, amp = Math.max(...c.parts.map((x, i) => x)) || 1;
        let peak = 0; const vals = [];
        for (let i = 0; i <= pts; i++) { const tt = (i / pts) * 2; let v = 0; c.parts.forEach((p, k) => { v += p * Math.sin(TAU * (k + 1) * tt + (k ? k * 0.7 : 0)); }); vals.push(v); peak = Math.max(peak, Math.abs(v)); }
        ctx.strokeStyle = A.css('line'); ctx.lineWidth = 1; ctx.strokeRect(x0, wy0, x1 - x0, wy1 - wy0);
        const mid = (wy0 + wy1) / 2, sc = (wy1 - wy0) / 2.3 / (peak || 1);
        ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1, mid); ctx.stroke();
        ctx.strokeStyle = st.load === 'res' ? A.css('accent') : A.css('bad'); ctx.lineWidth = 2; ctx.beginPath();
        vals.forEach((v, i) => { const X = x0 + (i / pts) * (x1 - x0), Y = mid - v * sc; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
        ctx.stroke(); ctx.lineWidth = 1;
        A.text(ctx, `ground-wire noise · peak ≈ ${mv(peak)}`, x0 + 6, wy0 + 14, { size: 11, color: A.css('muted'), bg: A.alpha(A.css('panel'), 0.8) });
        // spectrum bars
        const sy0 = wy1 + 26, sy1 = h - 22; const n = Math.min(40, c.parts.length);
        const bw = (x1 - x0) / 40;
        const mx = Math.max(...c.parts);
        A.text(ctx, 'harmonics of the noise (dB)', x0, sy0 - 6, { size: 10, color: A.css('muted') });
        for (let i = 0; i < 40; i++) {
          const p = c.parts[i] || 0; const db = p > 0 ? 20 * Math.log10(p / mx) : -60;
          const hh = Math.max(0, (db + 60) / 60) * (sy1 - sy0);
          ctx.fillStyle = i === 0 ? A.css('accent') : A.css('bad'); ctx.fillRect(x0 + i * bw + 1, sy1 - hh, Math.max(1, bw - 2), hh);
        }
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(x0, sy1); ctx.lineTo(x1, sy1); ctx.stroke();
        [1, 10, 20, 30].forEach((k) => A.text(ctx, fmt(k * c.f, 3), x0 + (k - 0.5) * bw, sy1 + 13, { align: 'center', size: 9, color: A.css('muted') }));
        A.text(ctx, 'Hz', x1, sy1 + 13, { align: 'right', size: 9, color: A.css('muted') });
      },
      onPointer(p, api) {
        if (!geo) return;
        const mx = (p.x - geo.cx) / geo.s, my = (p.y - geo.cy) / geo.s;
        if (p.type === 'pointerdown' && Math.hypot(mx - G.x, my - G.y) < 5) drag = true;
        if (p.type === 'pointerup' || p.type === 'pointerleave') drag = false;
        if (drag && p.type === 'pointermove') { const r = Math.hypot(mx, my); const k = r > 11 ? 11 / r : 1; G.x = mx * k; G.y = my * k; upd(); }
      },
    });
    function upd() {
      const c = calc(0);
      const snrU = dBV(0.316) - dBV(c.tot), cen = V.groundWireEMF(st.len, st.I, +st.f, 5.000, 5.001);
      const [cls, word] = verdict(snrU);
      out.innerHTML = A.statBox('Noise on the ground wire', mv(c.tot), fmt(dBu(c.tot), 3) + ' dBu') +
        A.statBox('Of which harmonics', c.parts.length > 1 ? fmt(100 * Math.sqrt(1 - (c.parts[0] / c.tot) ** 2), 2) + ' %' : '0 %', st.load === 'res' ? 'a smooth hum' : 'heard as buzz') +
        A.statBox('Unbalanced hi-fi link (−10 dBV)', fmt(snrU, 2) + ' dB below', `<span class="${cls}">${word}</span>`, cls) +
        A.statBox('Twisting would give', mv(c.tot * (st.tw ? 1 : 0.001)), st.tw ? 'already twisted' : '≈ 60 dB less');
      note.innerHTML = `<div class="callout ${st.tw ? 'mentor' : 'data'}">${st.tw
        ? 'Twisting forces line and neutral to swap sides every few centimetres, so whatever the ground wire picks up on one twist is cancelled on the next. Typical result: about <b>1 000× (60 dB) less</b> ground voltage — and it costs only labour.'
        : `Every metre, every amp and every hertz adds noise: <b>double the length, current or frequency → +6 dB</b>. This ${st.len} m circuit at ${st.I} A puts ${mv(c.tot)} on the ground wire. Dimmers and switch-mode supplies draw current in fast pulses, so the harmonics — which the ear hears as <b>buzz</b> — are induced even more strongly than the hum.`}</div>`;
    }
    upd();
  };

  /* ----------------------------------------------------------------------
     2. Ground loop area — how cable routing turns a loop into an antenna
     ---------------------------------------------------------------------- */
  const LOOP_PRESETS = {
    home: { name: 'Home studio: interface → powered monitor across the room', L: 4, d: 1.5, P: 5, B: 0.5, power: 'two', route: 'apart', link: 'unbal' },
    live: { name: 'Live gig: FOH console ↔ stage rack, different power', L: 40, d: 4, P: 12, B: 1, power: 'two', route: 'apart', link: 'bal1' },
    church: { name: 'Church / school: AV rack → ceiling projector & amp', L: 25, d: 3, P: 8, B: 1, power: 'two', route: 'apart', link: 'unbal' },
    fixed: { name: 'Same venue, re-routed: zero loop area wiring', L: 40, d: 4, P: 12, B: 1, power: 'two', route: 'beside', link: 'bal' },
  };
  V.groundLoop = function (host) {
    const st = A.controls(host, [
      { key: 'preset', label: 'Scenario', type: 'select', value: 'home', options: [...Object.entries(LOOP_PRESETS).map(([k, v]) => [k, v.name]), ['custom', 'Custom']] },
      { key: 'power', label: 'How the two devices are powered', type: 'select', value: 'two', options: [['same', 'Same outlet / power strip'], ['two', 'Different outlets or circuits']] },
      { key: 'route', label: 'Where the audio cable runs', type: 'select', value: 'apart', options: [['direct', 'Straight across, shortest path'], ['apart', 'Its own route, away from power'], ['beside', 'Right beside the power wiring (zero loop area)']] },
      { key: 'link', label: 'Connection type', type: 'select', value: 'unbal', options: [['unbal', 'Unbalanced (RCA, TS jack, 3.5 mm)'], ['bal1', 'Balanced, but gear has a pin-1 problem'], ['bal', 'Balanced, well-designed (AES48) gear'], ['xfmr', 'Through an isolation transformer']] },
      { key: 'L', label: 'Distance between devices', type: 'range', min: 1, max: 80, step: 1, value: 4, fmt: (v) => v + ' m' },
      { key: 'd', label: 'Gap between audio and power routes', type: 'range', min: 0.2, max: 10, step: 0.1, value: 1.5, fmt: (v) => v + ' m' },
      { key: 'P', label: 'Detour of the power wiring (to the panel and back)', type: 'range', min: 0.5, max: 30, step: 0.5, value: 5, fmt: (v) => v + ' m' },
      { key: 'B', label: 'Stray magnetic field in the building', type: 'range', min: -1, max: 1, step: 0.05, value: Math.log10(0.5), fmt: (v) => fmt(Math.pow(10, v), 2) + ' µT' },
      { key: 'f', label: 'Mains', type: 'select', value: '50', options: [['50', '50 Hz'], ['60', '60 Hz']] },
    ], (v) => {
      if (v.preset !== curP && v.preset !== 'custom') { curP = v.preset; const p = LOOP_PRESETS[v.preset]; ['power', 'route', 'link', 'L', 'd', 'P'].forEach((k) => st.set(k, p[k])); st.set('B', Math.log10(p.B)); }
      upd(); cv.redraw();
    });
    let curP = 'home';
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const msg = el('div'); host.appendChild(msg);
    const REJ = { unbal: 0, bal1: 25, bal: 60, xfmr: 100 };
    function calc() {
      const together = 0.02, d = st.route === 'apart' ? st.d : together;
      let area;
      if (st.route === 'beside') area = st.L * together + (st.power === 'two' ? 2 * st.P * together : 0);
      else area = st.L * (d + (st.power === 'two' ? st.P : 0)) || st.L * together;
      if (st.power === 'same' && st.route === 'direct') area = st.L * together;
      const B = Math.pow(10, st.B) * 1e-6, f = +st.f;
      const emf = TAU * f * B * area;
      const sig = st.link === 'unbal' ? 0.316 : 1.228;
      const hum = emf * Math.pow(10, -REJ[st.link] / 20);
      return { area, emf, hum, snr: dBV(sig) - dBV(hum), d };
    }
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Schematic plan (not to scale). The shaded area is the loop formed by the audio cable’s shield and the power ground path. Stray mains fields passing through it induce a voltage — the bigger the area, the more hum. Moving dots show the loop current.',
      draw(ctx, w, h, t) {
        const c = calc();
        const ty = 70, pad = 70, devY = h * 0.42;
        const Ax = pad, Bx = w - pad;
        const upY = st.route === 'apart' ? 26 : devY;
        const panelY = st.power === 'two' ? h - 34 : devY;
        // field marks
        const pulse = 0.5 + 0.5 * Math.sin(t * TAU * 0.8);
        for (let y = 18; y < h - 10; y += 26) for (let x = 14; x < w - 10; x += 30) A.text(ctx, '·', x + ((y / 26) % 2) * 15, y, { size: 16, color: A.alpha(A.css('c3'), 0.15 + 0.25 * pulse) });
        // loop polygon
        const poly = [];
        if (st.route === 'apart') poly.push([Ax, devY], [Ax, upY], [Bx, upY], [Bx, devY]);
        else if (st.route === 'beside' && st.power === 'two') poly.push([Ax, devY], [Ax - 6, devY], [Ax - 6, panelY - 6], [Bx + 6, panelY - 6], [Bx + 6, devY], [Bx, devY]);
        else poly.push([Ax, devY - 6], [Bx, devY - 6], [Bx, devY]);
        const ground = st.power === 'two' ? [[Bx, devY], [Bx, panelY], [Ax, panelY], [Ax, devY]] : [[Bx, devY], [Bx, devY + 6], [Ax, devY + 6], [Ax, devY]];
        const full = poly.concat(ground);
        ctx.fillStyle = A.alpha(A.css('bad'), 0.12 + 0.2 * pulse * A.clamp(c.area / 50, 0.1, 1));
        ctx.beginPath(); full.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
        // audio cable
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 3.5; ctx.beginPath(); poly.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
        // ground path (power wiring)
        ctx.strokeStyle = '#2e9e48'; ctx.setLineDash([7, 4]); ctx.lineWidth = 2.5; ctx.beginPath(); ground.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
        // loop current dots
        const per = []; let tot = 0; const pathPts = full.concat([full[0]]);
        for (let i = 1; i < pathPts.length; i++) { const l = Math.hypot(pathPts[i][0] - pathPts[i - 1][0], pathPts[i][1] - pathPts[i - 1][1]); per.push(l); tot += l; }
        const speed = A.clamp(40 + dBV(c.emf) + 100, 10, 160);
        for (let k = 0; k < 14; k++) {
          let s = ((t * speed + (k * tot) / 14) % tot), i = 0; while (i < per.length - 1 && s > per[i]) { s -= per[i]; i++; }
          const a = pathPts[i], b = pathPts[i + 1], u = per[i] ? s / per[i] : 0;
          ctx.fillStyle = A.css('bad'); ctx.beginPath(); ctx.arc(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 3, 0, TAU); ctx.fill();
        }
        // devices
        const box = (x, y, label, sub) => { ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x - 48, y - 18, 96, 36, 6); ctx.fill(); ctx.stroke(); A.text(ctx, label, x, y - 2, { align: 'center', size: 11, weight: 700 }); A.text(ctx, sub, x, y + 12, { align: 'center', size: 9, color: A.css('muted') }); };
        box(Ax, devY, 'Source', st.power === 'two' ? 'outlet / circuit A' : 'power strip');
        box(Bx, devY, 'Destination', st.power === 'two' ? 'outlet / circuit B' : 'same strip');
        if (st.power === 'two') { ctx.fillStyle = A.css('panel2'); ctx.fillRect(w / 2 - 50, panelY - 12, 100, 24); ctx.strokeStyle = '#2e9e48'; ctx.strokeRect(w / 2 - 50, panelY - 12, 100, 24); A.text(ctx, 'electrical panel', w / 2, panelY + 4, { align: 'center', size: 10 }); }
        A.text(ctx, 'audio cable (shield)', (Ax + Bx) / 2, (st.route === 'apart' ? upY : devY - 6) - 8, { align: 'center', size: 10, color: A.css('accent'), bg: A.alpha(A.css('panel'), 0.8) });
        A.text(ctx, `loop area ≈ ${fmt(c.area, 2)} m²`, 12, h - 10, { size: 12, weight: 700, color: A.css('bad'), bg: A.alpha(A.css('panel'), 0.85) });
      },
    });
    function upd() {
      const c = calc(); const [cls, word] = verdict(c.snr);
      out.innerHTML = A.statBox('Loop area', fmt(c.area, 2) + ' m²', st.route === 'beside' || (st.power === 'same' && st.route === 'direct') ? 'cables bundled' : 'open loop') +
        A.statBox('Induced in the loop', mv(c.emf), 'EMF = 2π·f·B·A') +
        A.statBox('Reaches the audio', mv(c.hum), st.link === 'unbal' ? 'unbalanced: all of it' : `rejected ${REJ[st.link]} dB`) +
        A.statBox('Hum below the signal', fmt(c.snr, 2) + ' dB', `<span class="${cls}">${word}</span>`, cls);
      const tips = [];
      if (st.route === 'apart') tips.push('Run the audio cable <b>alongside</b> the power wiring instead of on its own route — the loop area collapses (try “Right beside the power wiring”).');
      if (st.power === 'two' && st.route !== 'beside') tips.push('Feed both devices from the <b>same outlet strip or the same circuit</b> so the ground path runs next to the audio cable.');
      if (st.link === 'unbal') tips.push('Unbalanced links put the whole loop voltage in series with your signal. Use balanced outputs, or a <b>DI box / isolation transformer</b> at the receiving end.');
      if (st.link === 'bal1') tips.push('Balanced cable alone is not a cure if the equipment sends shield current through its circuit board (the “pin-1 problem”). Choose AES48-compliant gear, or use an isolation transformer.');
      if (!tips.length) tips.push('This is the professional result: small loop, balanced links, good gear. Hum is far below the signal — without ever touching the safety ground.');
      msg.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${tips.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
    }
    upd();
  };

  /* ----------------------------------------------------------------------
     3. The pin-1 problem inside equipment
     ---------------------------------------------------------------------- */
  V.pin1 = function (host) {
    const st = A.controls(host, [
      { key: 'mode', label: 'Where the cable shield (pin 1) connects', type: 'select', value: 'bad', options: [['bad', 'To the circuit-board ground (pin-1 problem)'], ['good', 'To the metal chassis at the jack (AES48)']] },
      { key: 'Is', label: 'Shield current from the ground loop', type: 'range', min: 1, max: 100, step: 1, value: 10, unit: 'mA' },
      { key: 'Z', label: 'Resistance of the board’s ground trace', type: 'range', min: 1, max: 50, step: 1, value: 10, unit: 'mΩ' },
      { key: 'n', label: 'Inputs connected (mixer channels)', type: 'range', min: 1, max: 48, step: 1, value: 16 },
    ], () => { upd(); cv.redraw(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const msg = el('div'); host.appendChild(msg);
    const noise = () => { const one = st.Is * 1e-3 * st.Z * 1e-3 * (st.mode === 'bad' ? 1 : 0.0005); return { one, all: one * st.n }; };
    const cv = A.canvas(host, {
      height: 280, animate: true,
      caption: 'Inside one piece of gear. Red dots are the shield current arriving on pin 1 of each input cable. With the pin-1 problem it flows along the thin ground trace that the audio circuits use as their 0 V reference, leaving a small noise voltage on every channel. Bonded to the chassis, it takes the heavy metal path straight to the safety earth and never touches the audio.',
      draw(ctx, w, h, t) {
        const bad = st.mode === 'bad';
        const x0 = 70, x1 = w - 70, y0 = 24, y1 = h - 24;
        ctx.fillStyle = A.alpha(A.css('muted'), 0.12); ctx.strokeStyle = A.css('muted'); ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 8); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1;
        A.text(ctx, 'metal chassis', x0 + 10, y0 + 18, { size: 10, color: A.css('muted') });
        // board
        const bx0 = x0 + 70, bx1 = x1 - 90, by0 = y0 + 40, by1 = y1 - 30;
        ctx.fillStyle = A.alpha('#2e9e48', 0.12); ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0); ctx.strokeStyle = '#2e9e48'; ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
        A.text(ctx, 'circuit board', bx0 + 6, by0 + 14, { size: 10, color: '#2e9e48' });
        const busY = by1 - 18;
        ctx.strokeStyle = '#c8a200'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx0 + 10, busY); ctx.lineTo(bx1 - 10, busY); ctx.stroke(); ctx.lineWidth = 1;
        A.text(ctx, '0 V ground trace (audio reference)', (bx0 + bx1) / 2, busY + 13, { align: 'center', size: 9, color: '#c8a200' });
        // inputs
        const nShow = Math.min(st.n, 6);
        const iy = (i) => by0 + 24 + i * ((busY - by0 - 36) / Math.max(1, nShow - 1 || 1));
        for (let i = 0; i < nShow; i++) {
          const y = nShow === 1 ? (by0 + busY) / 2 : iy(i);
          ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.arc(x0, y, 9, 0, TAU); ctx.fill(); ctx.stroke();
          A.text(ctx, 'XLR', x0 - 30, y + 4, { size: 9, color: A.css('muted') });
          ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 9, y); ctx.lineTo(bx0 + 30, y); ctx.stroke(); // signal
          ctx.fillStyle = A.css('accent'); ctx.fillRect(bx0 + 30, y - 8, 26, 16); A.text(ctx, 'amp', bx0 + 43, y + 4, { align: 'center', size: 9, color: A.css('accent-ink') });
          ctx.strokeStyle = A.alpha('#c8a200', 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx0 + 43, y + 8); ctx.lineTo(bx0 + 43, busY); ctx.stroke();
          // shield path
          const path = bad ? [[x0, y + 9], [bx0 + 14, y + 9], [bx0 + 14, busY], [bx1 - 14, busY], [x1 - 6, busY], [x1 - 6, y1 - 6]] : [[x0, y + 9], [x0 + 3, y1 - 3], [x1 - 6, y1 - 3]];
          ctx.strokeStyle = A.alpha(A.css('bad'), 0.5); ctx.setLineDash([3, 3]); ctx.beginPath(); path.forEach(([x, yy], k) => k ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy)); ctx.stroke(); ctx.setLineDash([]);
          let tl = 0; const seg = []; for (let k = 1; k < path.length; k++) { const l = Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]); seg.push(l); tl += l; }
          for (let d = 0; d < 4; d++) { let s = ((t * (40 + st.Is) + d * tl / 4 + i * 13) % tl), k = 0; while (k < seg.length - 1 && s > seg[k]) { s -= seg[k]; k++; } const a = path[k], b = path[k + 1], u = seg[k] ? s / seg[k] : 0; ctx.fillStyle = A.css('bad'); ctx.beginPath(); ctx.arc(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 2.6, 0, TAU); ctx.fill(); }
        }
        if (st.n > nShow) A.text(ctx, `+ ${st.n - nShow} more inputs`, x0 + 14, y1 - 10, { size: 10, color: A.css('muted') });
        // earth
        ctx.strokeStyle = '#2e9e48'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y1 - 6); ctx.lineTo(x1 + 30, y1 - 6); ctx.lineTo(x1 + 30, y1 + 8); ctx.moveTo(x1 + 20, y1 + 8); ctx.lineTo(x1 + 40, y1 + 8); ctx.moveTo(x1 + 24, y1 + 13); ctx.lineTo(x1 + 36, y1 + 13); ctx.moveTo(x1 + 28, y1 + 18); ctx.lineTo(x1 + 32, y1 + 18); ctx.stroke(); ctx.lineWidth = 1;
        A.text(ctx, 'safety earth', x1 + 30, y1 - 12, { align: 'center', size: 9, color: '#2e9e48' });
        if (bad) A.text(ctx, '⚡ noise on 0 V', (bx0 + bx1) / 2, busY - 8, { align: 'center', size: 11, weight: 700, color: A.css('bad'), bg: A.alpha(A.css('panel'), 0.85) });
        else A.text(ctx, '✓ shield current bypasses the board', (x0 + x1) / 2, y1 - 10, { align: 'center', size: 11, weight: 700, color: A.css('good'), bg: A.alpha(A.css('panel'), 0.85) });
      },
    });
    function upd() {
      const n = noise(); const snr = 4 - dBu(n.all); const [cls, word] = verdict(snr);
      out.innerHTML = A.statBox('Noise per input', mv(n.one), fmt(dBu(n.one), 3) + ' dBu') +
        A.statBox(`All ${st.n} inputs together`, mv(n.all), st.n > 1 ? `+${fmt(20 * Math.log10(st.n), 2)} dB (adds up)` : '') +
        A.statBox('Below +4 dBu line level', fmt(snr, 2) + ' dB', `<span class="${cls}">${word}</span>`, cls);
      msg.innerHTML = st.mode === 'bad'
        ? `<div class="callout warn">${st.Is} mA through just ${st.Z} mΩ leaves ${mv(n.one)} on the audio reference — tiny, but it is <i>inside</i> the gear, so balanced inputs cannot reject it, and a big console sums it from every channel. That is why “better cables” never fix a pin-1 problem.</div>`
        : `<div class="callout mentor">Bonding pin 1 to the chassis right at the connector (AES48) sends shield current around the outside of the circuit. Look for “AES48” or ask the manufacturer; test suspect gear with a <b>Hummer</b> test (below).</div>`;
    }
    upd();
  };

  /* ----------------------------------------------------------------------
     4. Wall-warts, power bricks & transformers: the 1/r³ rule
     ---------------------------------------------------------------------- */
  const MAG = { wart: ['Plug-in wall-wart (linear transformer)', 60], brick: ['Laptop / switch-mode brick', 8], toroid: ['Power-amp toroidal transformer', 30], ei: ['Old amp / EI-core transformer', 160], ballast: ['Fluorescent ballast / large transformer', 80] };
  V.wallWart = function (host) {
    const st = A.controls(host, [
      { key: 'src', label: 'Magnetic neighbour', type: 'select', value: 'wart', options: Object.entries(MAG).map(([k, v]) => [k, v[0]]) },
      { key: 'r', label: 'Distance to the audio cable / input', type: 'range', min: 0.05, max: 2, step: 0.01, value: 0.3, fmt: (v) => fmt(v * 100, 3) + ' cm' },
      { key: 'cab', label: 'Audio connection', type: 'select', value: 'unbal', options: [['unbal', 'Unbalanced (instrument / RCA)'], ['bal', 'Balanced twisted pair']] },
    ], () => { upd(); cv.redraw(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const A0 = 0.05, f = 50; // effective pickup area of an instrument input + cable (simplified)
    const hum = (r) => { const B = MAG[st.src][1] * 1e-6 * Math.pow(0.1 / r, 3); const e = TAU * f * B * A0; return st.cab === 'bal' ? e * 0.01 : e; };
    const cv = A.canvas(host, {
      height: 320, animate: true,
      caption: 'Magnetic fields from transformers fall off with the <b>cube</b> of distance: double the distance → 8× weaker (−18 dB). Copper or aluminium cable shields do <b>not</b> block 50/60 Hz magnetic fields — only distance, orientation and twisted pairs do.',
      draw(ctx, w, h, t) {
        const top = 110;
        // illustration
        const sx = 60, sy = top / 2;
        const px = (m) => sx + (m / 2) * (w - sx - 30);
        for (let k = 0; k < 5; k++) { const rr = ((t * 30 + k * 28) % 140) + 14; ctx.strokeStyle = A.alpha(A.css('bad'), Math.max(0, 0.5 * (1 - rr / 154))); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, rr, -1.2, 1.2); ctx.stroke(); }
        ctx.lineWidth = 1;
        ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.roundRect(sx - 24, sy - 18, 48, 36, 5); ctx.fill(); ctx.stroke(); A.text(ctx, '≋', sx, sy + 6, { align: 'center', size: 18, weight: 700 });
        const cx = px(st.r);
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, 8); ctx.lineTo(cx, top - 8); ctx.stroke(); ctx.lineWidth = 1;
        A.text(ctx, 'audio cable', cx + 8, 20, { size: 10, color: A.css('accent') });
        A.text(ctx, `${fmt(st.r * 100, 3)} cm`, (sx + cx) / 2, top - 6, { align: 'center', size: 11, weight: 700, bg: A.alpha(A.css('panel'), 0.8) });
        // chart
        const ax = A.axes(ctx, w, h, { x: { min: 0.05, max: 2, log: true, label: 'Distance (m)', ticks: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2], fmt: (v) => (v < 1 ? Math.round(v * 100) + ' cm' : v + ' m') }, y: { min: -140, max: -20, label: 'Hum (dBV)' }, pad: { t: top + 6, b: 38 } });
        const ptsArr = []; for (let r = 0.05; r <= 2.001; r *= 1.04) ptsArr.push([r, A.clamp(dBV(hum(r)), -140, -20)]);
        A.plotLine(ctx, ax, ptsArr, A.css('bad'), 2.4);
        const Y = ax.Y(A.clamp(dBV(hum(st.r)), -140, -20));
        ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.arc(ax.X(st.r), Y, 6, 0, TAU); ctx.fill();
        ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('good'); ctx.beginPath(); ctx.moveTo(ax.X(1), ax.y1); ctx.lineTo(ax.X(1), ax.y0); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, '1 m rule', ax.X(1) + 4, ax.y1 + 12, { size: 10, color: A.css('good') });
      },
    });
    function upd() {
      const v = hum(st.r), sig = st.cab === 'bal' ? 1.228 : 0.1; const snr = dBV(sig) - dBV(v); const [cls, word] = verdict(snr);
      out.innerHTML = A.statBox('Hum picked up', mv(v), fmt(dBV(v), 3) + ' dBV') +
        A.statBox('Below the signal', fmt(snr, 2) + ' dB', `<span class="${cls}">${word}</span>`, cls) +
        A.statBox('Move it to 1 m', fmt(dBV(hum(st.r)) - dBV(hum(1)), 2) + ' dB less', st.r >= 1 ? 'already there' : '1/r³ falloff');
    }
    upd();
  };

  /* ----------------------------------------------------------------------
     5. What kind of noise is it? — listen and identify
     ---------------------------------------------------------------------- */
  const SOUNDS = {
    hum: { name: 'Hum', h: [1, 0.35, 0.12, 0.05], what: 'A smooth, low drone at the mains frequency (and a little 2nd harmonic).', means: 'Usually a <b>ground loop</b> through a large loop area, or a transformer/wall-wart close to an unbalanced input.' },
    hum2: { name: 'Hum at 2× mains', mul: 2, h: [1, 0.2, 0.05], what: 'A drone one octave above the mains (100/120 Hz).', means: 'Typical of <b>rectifier / power-supply ripple</b> inside gear, or magnetic hum from transformers. Often a faulty or overloaded power supply.' },
    buzz: { name: 'Buzz', h: Array.from({ length: 40 }, (_, i) => (i % 2 === 0 ? 1 / Math.sqrt(i + 1) : 0.15 / (i + 1))), what: 'Harsh and edgy — many harmonics up into the kHz range.', means: '<b>Dimmers</b>, LED drivers and switch-mode supplies sharing wiring with audio, or the <b>pin-1 problem</b> in gear. Harmonics leak in by capacitance and induction.' },
    whine: { name: 'Whine / chirp', tone: 2800, what: 'A high-pitched tone or chirp that may change with screen activity or disk/CPU load.', means: '<b>USB/computer ground noise</b>, switch-mode chargers, or radio interference demodulated by an input. Try battery power, a USB isolator or a DI box.' },
  };
  V.humSounds = function (host) {
    const st = A.controls(host, [{ key: 'f', label: 'Your mains frequency', type: 'select', value: '50', options: [['50', '50 Hz'], ['60', '60 Hz']] }], () => draw());
    const row = el('div', { class: 'row' });
    const info = el('div', { class: 'card', style: { background: 'var(--panel2)', marginTop: '10px' } });
    let cur = 'hum';
    Object.entries(SOUNDS).forEach(([k, s]) => {
      const b = el('button', { class: k === cur ? 'primary' : '', html: A.icon('play') + ' ' + s.name });
      b.onclick = () => {
        cur = k; A.$$('button', row).forEach((x) => x.classList.remove('primary')); b.classList.add('primary');
        A.audio.stopAll();
        if (s.tone) { const ctx = A.audio.get(); if (ctx) { const o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain(); o.type = 'square'; o.frequency.value = s.tone; lfo.frequency.value = 7; lg.gain.value = 300; lfo.connect(lg).connect(o.frequency); g.gain.value = 0.04; o.connect(g).connect(ctx.destination); o.start(); lfo.start(); A.audio.track(o); A.audio.track(lfo); } }
        else V.playHarm(+st.f * (s.mul || 1), s.h, 0);
        draw();
      };
      row.appendChild(b);
    });
    const sp = el('button', { html: A.icon('stop') + ' Stop' }); sp.onclick = () => A.audio.stopAll(); row.appendChild(sp);
    host.appendChild(row); host.appendChild(info);
    const cv = A.canvas(host, {
      height: 170,
      caption: 'Spectrum of the selected noise. Learn to recognise these four — the sound alone often tells you where to look first.',
      draw(ctx, w, h) {
        const s = SOUNDS[cur], f0 = +st.f * (s.mul || 1);
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 10000, log: true, label: 'Frequency (Hz)', ticks: [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000] }, y: { min: -50, max: 0, label: 'dB' } });
        const lines = s.tone ? [[s.tone, 0], [s.tone * 3, -10], [s.tone * 0.5, -30]] : s.h.map((a, i) => [f0 * (i + 1), a > 0 ? 20 * Math.log10(a) : -60]);
        lines.forEach(([f, d]) => { if (f > 10000 || d < -50) return; ctx.strokeStyle = cur === 'buzz' || cur === 'whine' ? A.css('bad') : A.css('accent'); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax.X(f), ax.y0); ctx.lineTo(ax.X(f), ax.Y(d)); ctx.stroke(); });
        ctx.lineWidth = 1;
      },
    });
    function draw() { const s = SOUNDS[cur]; info.innerHTML = `<b>${s.name}</b> — ${s.what}<br><span class="small">What it usually means: ${s.means}</span>`; cv.redraw(); }
    draw();
  };

  /* ----------------------------------------------------------------------
     6. Hum Detective — step-by-step troubleshooting
     ---------------------------------------------------------------------- */
  const T = {
    start: { q: 'When do you hear the noise?', o: [
      ['Always — even with every fader and input turned down', 'always'],
      ['Only when one particular cable or device is connected', 'onecable'],
      ['It changes when lights are dimmed or switched', 'dimmer'],
      ['It changes when I move a cable, guitar or power supply', 'magnetic'],
      ['Only with a laptop, USB or phone charger connected', 'computer'],
      ['Only when the TV / cable box / antenna is connected', 'catv'],
    ] },
    always: { q: 'Unplug the input cable(s) from the power amp or powered speaker. Is the noise still there?', o: [['Yes, still there', 'r_device'], ['No, it stopped', 'onecable']] },
    onecable: { q: 'Plug both devices into the same power strip (temporarily, with normal earthed leads). Does the noise drop a lot?', o: [['Yes, much better', 'r_loop'], ['No change', 'unbal']] },
    unbal: { q: 'Is the connection unbalanced (RCA, TS guitar jack, 3.5 mm, consumer gear)?', o: [['Yes, unbalanced', 'r_unbal'], ['No, it is balanced (XLR / TRS)', 'pin1']] },
    pin1: { q: 'Swap the cable for a known-good one. Does the noise follow one piece of gear, even with good cables?', o: [['Yes — it follows one device', 'r_pin1'], ['It follows the cable', 'r_cable'], ['Not sure', 'r_pin1']] },
    dimmer: { r: 'r_dimmer' }, magnetic: { r: 'r_mag' }, computer: { r: 'r_pc' }, catv: { r: 'r_catv' },
  };
  const R = {
    r_device: { t: 'The noise is made inside the amplifier / powered speaker', why: 'With nothing connected, no ground loop can exist — it is the device itself.', quick: ['Check that it is not just system hiss: is the gain structure right?', 'Move the device away from other transformers and power cables', 'Try it in another room on another circuit'], proper: ['Service it — failing power-supply capacitors cause 100/120 Hz hum', 'Replace with a quieter unit'] },
    r_loop: { t: 'Classic ground loop between two power circuits', why: 'The cable shield and the two power grounds make a loop; magnetic fields from the building wiring induce current in it.', quick: ['Power the whole audio system from one outlet strip or one circuit', 'Use a DI box or line isolation transformer at the receiving end', 'Bundle audio and power cables together (shrink the loop)'], proper: ['Zero loop area wiring: run audio beside the power that feeds the gear', 'Dedicated technical power with twisted line/neutral', 'Balanced, AES48-compliant equipment'] },
    r_unbal: { t: 'Unbalanced link picking up ground voltage', why: 'On RCA and jack links the shield is part of the signal path, so any voltage between the two grounds is added straight to the audio.', quick: ['Keep unbalanced cables short (under ~3 m) and both devices on one strip', 'Insert a passive DI box / isolation transformer'], proper: ['Use balanced outputs and inputs wherever possible', 'Place the conversion to balanced next to the unbalanced device'] },
    r_pin1: { t: 'Likely a pin-1 problem in the equipment', why: 'The gear routes shield current through its circuit-board ground. Balanced cables cannot help because the noise is created inside.', quick: ['Hummer test: inject a small current into pin 1 and listen', 'Try the device’s other inputs/outputs; isolation transformer in the line'], proper: ['Replace or modify to AES48 (pin 1 bonded to chassis at the jack)', 'Prefer AES48-compliant gear for new systems'] },
    r_cable: { t: 'Cable problem', why: 'Broken shields, intermittent connectors, or cable with a drain wire that turns shield current into noise.', quick: ['Test with a cable tester; re-solder or replace'], proper: ['Use cable whose shield construction does not induce noise (drain wire wound with the pair, braid or good foil)', 'Use quality connectors with strain relief'] },
    r_dimmer: { t: 'Dimmer or LED-driver buzz', why: 'Phase-cut dimmers switch current in microseconds; the fast change induces harmonics in nearby ground wires and cables — heard as buzz.', quick: ['Switch dimmers fully on/off for recording', 'Move audio cables away from lighting cables; cross at 90°', 'Put audio on a different circuit from the lighting'], proper: ['Electrician: twist line/neutral and keep each circuit’s conductors together', 'Choose dimmers/LED drivers with filtering (sine-wave or reverse-phase)', 'Separate technical power for audio'] },
    r_mag: { t: 'Magnetic pickup from a nearby transformer or power cable', why: 'Transformers, wall-warts and power cables radiate 50/60 Hz magnetic fields; cable shields do not block them.', quick: ['Move power supplies at least 1 m from inputs and unbalanced cables', 'Rotate the transformer or the guitar/amp to find the quiet orientation', 'Cross power and audio cables at right angles'], proper: ['Mount power supplies in a separate rack or room', 'Use balanced twisted-pair connections', 'Choose humbucking pickups / shielded instrument cavities'] },
    r_pc: { t: 'Computer / USB ground noise', why: 'The laptop charger and USB create a ground loop and inject digital noise (whine changes with screen and CPU activity).', quick: ['Unplug the charger and run on battery to confirm', 'Plug the charger into the same strip as the audio interface', 'USB isolator or a DI box on the interface outputs'], proper: ['Interface with balanced outputs into balanced monitor inputs', 'Earthed (3-pin) charger from the same power strip — never remove the earth pin'] },
    r_catv: { t: 'Cable TV / antenna ground loop', why: 'The coax shield is earthed at the building entrance, a different point from your power earth — a large loop through the house.', quick: ['Fit a coax ground isolator (sheath-current isolator) at the TV or cable box'], proper: ['Have the cable/antenna earth bonded near the main electrical earth (electrician / provider)', 'Use optical (TOSLINK) audio from TV to the AV receiver'] },
  };
  V.humDetective = function (host) {
    const card = el('div', { class: 'card', style: { background: 'var(--panel2)' } });
    host.appendChild(card);
    let path = ['start'];
    function show() {
      const id = path[path.length - 1];
      const node = T[id] && T[id].r ? R[T[id].r] : R[id] ? R[id] : null;
      const crumbs = `<div class="small muted" style="margin-bottom:8px">Step ${path.length}${path.length > 1 ? ' · <a href="javascript:void 0" data-back="1">← back</a> · <a href="javascript:void 0" data-restart="1">start again</a>' : ''}</div>`;
      if (node) {
        card.innerHTML = crumbs + `<div class="eyebrow small accent" style="text-transform:uppercase;letter-spacing:.12em;font-weight:700">Diagnosis</div><h3 style="margin:.2em 0">${node.t}</h3><p>${node.why}</p>
          <div class="grid g2"><div class="callout alt" style="margin:0"><b>Try now (minutes)</b><ul style="margin:.3em 0 0;padding-left:18px">${node.quick.map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div class="callout mentor" style="margin:0"><b>Proper fix (permanent)</b><ul style="margin:.3em 0 0;padding-left:18px">${node.proper.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>
          <div class="callout safety" style="margin-top:10px">Never remove, tape over or “lift” the safety earth on a power lead to cure hum. Any change to building wiring is a job for a licensed electrician.</div>`;
      } else {
        const n = T[id];
        card.innerHTML = crumbs + `<h3 style="margin:.1em 0 .6em">${n.q}</h3><div class="detective-opts">${n.o.map(([l, to]) => `<button data-to="${to}">${l}</button>`).join('')}</div>`;
      }
    }
    card.addEventListener('click', (e) => {
      const b = e.target.closest('[data-to],[data-back],[data-restart]'); if (!b) return;
      if (b.dataset.to) path.push(b.dataset.to);
      else if (b.dataset.back) path.pop();
      else path = ['start'];
      show();
    });
    show();
  };
})();
