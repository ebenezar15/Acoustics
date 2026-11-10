/* ==========================================================================
   Acoustica — "Questions answered & verified" widgets.
   Standing waves (pressure vs velocity), quarter-wave finder, mode ladder,
   which way to face, target curves, surround layout & delays, sub/main
   alignment, floating-floor designer.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C = 343;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const logF = (key, label, a, b, v) => ({ key, label, type: 'range', min: Math.log10(a), max: Math.log10(b), step: 0.002, value: Math.log10(v), fmt: (x) => fmtHz(Math.pow(10, x)) });
  const tone = (f) => { A.audio.stopAll(); if (A.audio.tone) A.audio.tone(f, 2.5); else if (V.playHarm) V.playHarm(f, [1], 2.5); };

  /* ======================================================================
     1. Standing waves — pressure & particle velocity in front of a wall
     ====================================================================== */
  V.standingWave = function (host) {
    const st = A.controls(host, [
      logF('f', 'Frequency', 20, 500, 86),
      { key: 'mode', label: 'Situation', type: 'select', value: 'wall', options: [['wall', 'One hard wall (reflection)'], ['free', 'Free field (no wall, travelling wave)'], ['absorb', 'Wall covered with a good absorber'], ['open', 'Open end (pipe / big opening)'], ['room', 'Room: two hard walls, length below']] },
      { key: 'L', label: 'Distance shown / room length', type: 'range', min: 1, max: 10, step: 0.05, value: 4, unit: 'm' },
      { key: 'ear', label: 'Your ear — distance from the wall', type: 'range', min: 0, max: 10, step: 0.01, value: 1, unit: 'm' },
    ], () => { upd(); });
    const row = el('div', { class: 'row' }); const pl = el('button', { class: 'primary', html: A.icon('play') + ' Play this tone' }), sp = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(pl, sp); host.appendChild(row); pl.onclick = () => tone(Math.pow(10, st.f)); sp.onclick = () => A.audio.stopAll();
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    // complex amplitude of pressure p(x) and particle velocity u(x) (u normalised by ρc)
    function field(x) {
      const f = Math.pow(10, st.f), k = (TAU * f) / C;
      if (st.mode === 'room') {
        const n = 0.04; // light damping
        // rigid both ends, driven at x = L: p ∝ cos(kx)/(sin(kL) + jη), u ∝ j sin(kx)/(...)
        const dr = Math.sin(k * st.L), di = n;
        const den = dr * dr + di * di;
        const pr = (Math.cos(k * x) * dr) / den, pi = (-Math.cos(k * x) * di) / den;
        const ur = (Math.sin(k * x) * di) / den, ui = (Math.sin(k * x) * dr) / den;
        return { p: [pr, pi], u: [ur, ui] };
      }
      const R = { wall: 1, free: 0, absorb: 0.25, open: -1 }[st.mode];
      // incident wave travelling toward the wall at x = 0 plus reflection
      const ci = Math.cos(k * x), si = Math.sin(k * x);
      const p = [ci + R * ci, si - R * si];
      const u = [-(ci - R * ci), -(si + R * si)];
      return { p, u };
    }
    const mag = (z) => Math.hypot(z[0], z[1]);
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top curve = sound <b>pressure</b> (what your ear and most microphones sense). Bottom curve = air-particle <b>velocity</b> (what porous absorbers need). Thin lines: the wave at this instant; shaded: the loudest it gets at each point. At a hard wall the air cannot move (velocity = 0) and the incident and reflected pressure add (×2, +6 dB). One quarter-wavelength out, it flips.',
      draw(ctx, w, h, t) {
        const f = Math.pow(10, st.f), lam = C / f, Lx = st.L;
        const x0 = 46, x1 = w - 14, mid1 = h * 0.3, mid2 = h * 0.72, amp = h * 0.15;
        const X = (x) => x0 + (x / Lx) * (x1 - x0);
        // wall
        if (st.mode !== 'free') { ctx.fillStyle = st.mode === 'absorb' ? A.alpha(A.css('c4'), 0.8) : st.mode === 'open' ? A.alpha(A.css('muted'), 0.15) : A.css('muted'); ctx.fillRect(x0 - 14, 10, 12, h - 20); }
        if (st.mode === 'room') { ctx.fillStyle = A.css('muted'); ctx.fillRect(x1 + 2, 10, 10, h - 20); }
        // quarter-wave markers
        for (let q = 1; q * lam / 4 <= Lx + 1e-6; q++) {
          const xx = X((q * lam) / 4); ctx.strokeStyle = A.alpha(q % 2 ? A.css('bad') : A.css('good'), 0.35); ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(xx, 10); ctx.lineTo(xx, h - 16); ctx.stroke(); ctx.setLineDash([]);
          if (q <= 8) A.text(ctx, q + 'λ/4', xx, h - 4, { align: 'center', size: 10, color: A.css('muted') });
        }
        // normalise
        let mx = 0; const N = 300, pts = [];
        for (let i = 0; i <= N; i++) { const x = (i / N) * Lx, F = field(x); pts.push([x, F]); mx = Math.max(mx, mag(F.p), mag(F.u)); }
        const sc = amp / (mx || 1), ph = TAU * 1.0 * t;
        const draw = (yMid, key, col, label) => {
          ctx.fillStyle = A.alpha(col, 0.15); ctx.beginPath();
          pts.forEach(([x, F], i) => { const yy = yMid - mag(F[key]) * sc; i ? ctx.lineTo(X(x), yy) : ctx.moveTo(X(x), yy); });
          for (let i = pts.length - 1; i >= 0; i--) { const [x, F] = pts[i]; ctx.lineTo(X(x), yMid + mag(F[key]) * sc); }
          ctx.fill();
          ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath();
          pts.forEach(([x, F], i) => { const z = F[key]; const yy = yMid - (z[0] * Math.cos(ph) - z[1] * Math.sin(ph)) * sc; i ? ctx.lineTo(X(x), yy) : ctx.moveTo(X(x), yy); });
          ctx.stroke(); ctx.lineWidth = 1;
          ctx.strokeStyle = A.alpha(A.css('muted'), 0.4); ctx.beginPath(); ctx.moveTo(x0, yMid); ctx.lineTo(x1, yMid); ctx.stroke();
          A.text(ctx, label, x0 + 4, yMid - amp - 6, { size: 11, weight: 700, color: col });
        };
        draw(mid1, 'p', A.css('c3'), 'Pressure (what you hear)');
        draw(mid2, 'u', A.css('accent'), 'Particle velocity (what porous absorbers use)');
        // particles strip (velocity displacement)
        for (let i = 0; i < 40; i++) { const x = (i / 40) * Lx; const F = field(x); const d = (F.u[0] * Math.sin(ph) + F.u[1] * Math.cos(ph)) * 0.04 * Lx / (mx || 1); dot(ctx, X(Math.min(Lx, Math.max(0, x + d))), (mid1 + mid2) / 2, 2.6, A.alpha(A.css('text'), 0.6)); }
        // ear
        const ex = X(Math.min(st.ear, Lx)); ctx.fillStyle = A.css('good'); ctx.beginPath(); ctx.moveTo(ex, mid1 + amp + 8); ctx.lineTo(ex - 7, mid1 + amp + 20); ctx.lineTo(ex + 7, mid1 + amp + 20); ctx.fill();
        A.text(ctx, 'ear', ex, mid1 + amp + 32, { align: 'center', size: 10, color: A.css('good') });
      },
    });
    function upd() {
      const f = Math.pow(10, st.f), lam = C / f, F = field(Math.min(st.ear, st.L)), ref = st.mode === 'room' ? null : 1;
      const pe = mag(F.p), ue = mag(F.u);
      const pdb = ref ? 20 * Math.log10(Math.max(pe, 1e-4)) : null;
      let modeTxt = '';
      if (st.mode === 'room') { const n = (2 * st.L * f) / C; modeTxt = `L = ${fmt(n, 3)} half-wavelengths${Math.abs(n - Math.round(n)) < 0.08 ? ' → <b>resonance (room mode ' + Math.round(n) + ')</b>' : ''}`; }
      out.innerHTML = A.statBox('Wavelength λ', A.fmtLen(lam), 'c / f') + A.statBox('λ/4 — first velocity peak', A.fmtLen(lam / 4), 'where porous traps work best') + A.statBox('λ/2 — next pressure peak', A.fmtLen(lam / 2), 'room mode spacing') +
        (ref ? A.statBox('Pressure at your ear', (pdb > -30 ? (pdb >= 0 ? '+' : '') + fmt(pdb, 2) : '< −30') + ' dB', 're one travelling wave', pdb < -10 ? 'bad' : pdb > 4 ? 'warn' : '') : A.statBox('Room', fmtHz(C / (2 * st.L)) + ' first mode', modeTxt));
      const msg = {
        wall: 'Hard wall: pressure is doubled (+6 dB) at the surface and cancels at λ/4, 3λ/4 …; velocity does the opposite. Nothing disappears — energy is redistributed into loud and quiet spots.',
        free: 'No reflection: one travelling wave. Pressure and velocity peak <b>together</b> (in phase) and every position gets the same level. The 90° pressure/velocity split only appears when a reflection creates a standing wave.',
        absorb: 'A good absorber returns only a weak reflection, so the pattern of peaks and dips flattens out — that is what bass treatment is for.',
        open: 'At an open end the air can move freely: pressure drops to (nearly) zero and velocity is maximum — the reverse of a wall. A pipe closed at one end and open at the other resonates when its length is λ/4; open at both ends, λ/2. A small window in a room is <b>not</b> a full open end — it only leaks a little bass.',
        room: 'Two walls: the wave bounces back and forth. When the length fits a whole number of half-wavelengths (f = n·c/2L) the reflections reinforce and the room <b>resonates</b> — a room mode. Every mode has a pressure maximum at both walls.',
      };
      note.innerHTML = `<div class="callout physics">${msg[st.mode]}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Quarter-wave finder: where is the velocity peak, and is your trap deep enough?
     ====================================================================== */
  V.quarterWave = function (host) {
    const st = A.controls(host, [
      logF('f', 'Problem (boomy) frequency', 25, 500, 100),
      { key: 'd', label: 'Absorber thickness', type: 'range', min: 0.025, max: 0.6, step: 0.005, value: 0.1, unit: 'm' },
      { key: 'gap', label: 'Air gap behind it', type: 'range', min: 0, max: 0.6, step: 0.005, value: 0.05, unit: 'm' },
      { key: 'sig', label: 'Material', type: 'select', value: '8000', options: [['4000', 'Low-density wool / polyester (σ ≈ 4 k)'], ['8000', 'Typical mineral wool (σ ≈ 8 k)'], ['16000', 'Dense board (σ ≈ 16 k)'], ['30000', 'Very dense slab (σ ≈ 30 k)']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    const cv = A.canvas(host, {
      height: 260, animate: true,
      caption: 'Orange: how fast the air moves in front of the wall at the chosen frequency (zero at the wall, maximum at λ/4). Green block: your absorber. Porous absorbers need moving air — but they already absorb a lot when they reach about λ/8–λ/10; λ/4 is the ideal, not the minimum.',
      draw(ctx, w, h, t) {
        const f = Math.pow(10, st.f), lam = C / f, span = Math.max(lam / 2, st.d + st.gap + 0.2);
        const x0 = 40, x1 = w - 14, X = (x) => x0 + (x / span) * (x1 - x0), yb = h - 36, amp = h - 80;
        ctx.fillStyle = A.css('muted'); ctx.fillRect(x0 - 14, 14, 12, yb - 14);
        ctx.fillStyle = A.alpha(A.css('c4'), 0.55); ctx.fillRect(X(st.gap), 14, X(st.gap + st.d) - X(st.gap), yb - 14);
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.5; ctx.beginPath();
        for (let i = 0; i <= 200; i++) { const x = (i / 200) * span; const v = Math.abs(Math.sin((TAU * x) / lam)); const yy = yb - v * amp * (0.85 + 0.15 * Math.sin(t * 6)); i ? ctx.lineTo(X(x), yy) : ctx.moveTo(X(x), yy); }
        ctx.stroke(); ctx.lineWidth = 1;
        [[lam / 4, 'λ/4'], [lam / 8, 'λ/8'], [lam / 2, 'λ/2']].forEach(([x, l]) => { if (x > span) return; ctx.setLineDash([3, 4]); ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(X(x), 14); ctx.lineTo(X(x), yb); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, `${l} = ${A.fmtLen(x)}`, X(x) + 3, 26, { size: 10, color: A.css('muted') }); });
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
        A.text(ctx, 'distance from the wall →', x1, yb + 18, { align: 'right', size: 10, color: A.css('muted') });
      },
    });
    function upd() {
      const f = Math.pow(10, st.f), lam = C / f, a = P.porousAlpha(f, +st.sig, st.d, st.gap);
      const reach = st.d + st.gap;
      // depth (with same gap ratio) needed for alpha >= 0.8 at f
      let need = null; for (let D = 0.02; D <= 1.5; D += 0.01) { if (P.porousAlpha(f, +st.sig, D, 0) >= 0.8) { need = D; break; } }
      out.innerHTML = A.statBox('λ / 4 at ' + fmtHz(f), A.fmtLen(lam / 4), 'ideal reach') + A.statBox('Your reach (gap + panel)', A.fmtLen(reach), fmt((reach / (lam / 4)) * 100, 3) + ' % of λ/4') + A.statBox('Absorption at ' + fmtHz(f), fmt(a, 2), a > 0.8 ? 'excellent' : a > 0.5 ? 'useful' : 'weak', a > 0.8 ? 'good' : a > 0.5 ? 'warn' : 'bad') + A.statBox('Solid depth for α ≥ 0.8', need ? A.fmtLen(need) : '> 1.5 m', need ? fmt((need / (lam / 4)) * 100, 3) + ' % of λ/4' : 'use a membrane / tuned trap');
      note.innerHTML = `<div class="callout mentor">${f < 80 ? 'Below about 80 Hz, porous treatment that reaches λ/4 becomes metres deep. Use <b>pressure-based</b> traps (membrane, Helmholtz) in corners or on walls — where pressure is highest — plus seat & speaker positioning.' : f < 200 ? 'In this range thick porous traps with an air gap work well, especially across corners; a membrane trap is the compact alternative.' : 'At these frequencies a 50–100 mm panel already reaches far enough — this is why thin panels only fix the mids and highs.'}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Mode ladder — spacing, clusters, gaps, modes per octave, peak identifier
     ====================================================================== */
  const ROOMS = { cube: ['Cube 4 × 4 × 4 m (worst case)', 4, 4, 4], good: ['5.7 × 4.2 × 3.0 m (well-spread)', 5.7, 4.2, 3.0], bed: ['Bedroom 3.6 × 3.0 × 2.4 m', 3.6, 3.0, 2.4], garage: ['Garage 6.0 × 3.0 × 2.5 m (2:1)', 6.0, 3.0, 2.5] };
  V.modeLadder = function (host) {
    const st = A.controls(host, [
      { key: 'pre', label: 'Start from', type: 'select', value: 'cube', options: [...Object.entries(ROOMS).map(([k, v]) => [k, v[0]]), ['custom', 'Custom']] },
      { key: 'L', label: 'Length', type: 'range', min: 2, max: 12, step: 0.05, value: 4, unit: 'm' },
      { key: 'W', label: 'Width', type: 'range', min: 2, max: 10, step: 0.05, value: 4, unit: 'm' },
      { key: 'H', label: 'Height', type: 'range', min: 2, max: 6, step: 0.05, value: 4, unit: 'm' },
      { key: 'rt', label: 'Reverb time (for Schroeder)', type: 'range', min: 0.15, max: 1.5, step: 0.05, value: 0.4, unit: 's' },
      { key: 'peak', label: 'A peak you measured (identify it)', type: 'number', value: 43, unit: 'Hz' },
    ], (v) => { if (v.pre !== cur && v.pre !== 'custom') { cur = v.pre; const r = ROOMS[v.pre]; st.set('L', r[1], true); st.set('W', r[2], true); st.set('H', r[3], true); } upd(); });
    let cur = 'cube';
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const idn = el('div'); host.appendChild(idn);
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Top three rows: the axial modes of length, width and height (each a ladder of c/2L, 2·c/2L …). Bottom row: every mode (axial tall, tangential medium, oblique short). Red bands = clusters (modes stacked within 3 %); amber = big gaps. Bars: modes per third-octave — the count grows rapidly with frequency until modes overlap above the Schroeder frequency.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 300, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 40, 50, 60, 80, 100, 150, 200, 300] }, y: { min: 0, max: 5, label: '' }, pad: { l: 64 } });
        const modes = P.roomModes(st.L, st.W, st.H, 300);
        const rows = [['Length', 0, A.css('c3')], ['Width', 1, A.css('accent2')], ['Height', 2, A.css('c4')]];
        rows.forEach(([lab, idx, col], r) => {
          const yy = ax.Y(4.5 - r);
          A.text(ctx, lab, ax.x0 - 6, yy + 4, { align: 'right', size: 10, color: col });
          modes.filter((m) => m.type === 'axial' && m.n[idx] > 0).forEach((m) => { const X = ax.X(m.f); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X, yy - 10); ctx.lineTo(X, yy + 10); ctx.stroke(); });
        });
        ctx.lineWidth = 1;
        const ax1 = modes.filter((m) => m.type === 'axial').map((m) => m.f).sort((a, b) => a - b);
        for (let i = 1; i < ax1.length; i++) {
          const r = ax1[i] / ax1[i - 1];
          if (r < 1.03) { ctx.fillStyle = A.alpha(A.css('bad'), 0.2); ctx.fillRect(ax.X(ax1[i - 1]) - 5, ax.y1, ax.X(ax1[i]) - ax.X(ax1[i - 1]) + 10, ax.Y(1.6) - ax.y1); }
          else if (r > 1.35 && ax1[i] < 150) { ctx.fillStyle = A.alpha(A.css('warn'), 0.12); ctx.fillRect(ax.X(ax1[i - 1]) + 4, ax.y1, ax.X(ax1[i]) - ax.X(ax1[i - 1]) - 8, ax.Y(1.6) - ax.y1); }
        }
        A.text(ctx, 'All', ax.x0 - 6, ax.Y(1.5) + 4, { align: 'right', size: 10, color: A.css('text') });
        modes.forEach((m) => { const X = ax.X(m.f), hh = m.type === 'axial' ? 14 : m.type === 'tangential' ? 9 : 5; ctx.strokeStyle = m.type === 'axial' ? A.css('text') : A.alpha(A.css('text'), 0.5); ctx.beginPath(); ctx.moveTo(X, ax.Y(1.5) - hh); ctx.lineTo(X, ax.Y(1.5) + hh); ctx.stroke(); });
        // modes per third-octave
        P.THIRDS.filter((f) => f >= 20 && f <= 250).forEach((fc) => { const lo = fc / Math.pow(2, 1 / 6), hi = fc * Math.pow(2, 1 / 6); const n = modes.filter((m) => m.f >= lo && m.f < hi).length; const bh = Math.min(0.85, n / 25); ctx.fillStyle = A.alpha(A.css('accent'), 0.35); ctx.fillRect(ax.X(lo) + 1, ax.Y(bh), ax.X(hi) - ax.X(lo) - 2, ax.y0 - ax.Y(bh)); if (n) A.text(ctx, String(n), ax.X(fc), ax.Y(bh) - 2, { align: 'center', size: 9, color: A.css('muted') }); });
        const fs = P.schroeder(st.rt, st.L * st.W * st.H);
        if (fs < 300) { ctx.setLineDash([5, 4]); ctx.strokeStyle = A.css('good'); ctx.beginPath(); ctx.moveTo(ax.X(fs), ax.y1); ctx.lineTo(ax.X(fs), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'Schroeder ' + fmtHz(fs), ax.X(fs) + 4, ax.y1 + 12, { size: 10, color: A.css('good') }); }
      },
    });
    function upd() {
      const modes = P.roomModes(st.L, st.W, st.H, 300), V0 = st.L * st.W * st.H, fs = P.schroeder(st.rt, V0);
      const ax1 = modes.filter((m) => m.type === 'axial').map((m) => m.f).sort((a, b) => a - b);
      let clusters = 0, maxGap = 0; for (let i = 1; i < ax1.length; i++) { if (ax1[i] / ax1[i - 1] < 1.03) clusters++; if (ax1[i] < 120) maxGap = Math.max(maxGap, ax1[i] - ax1[i - 1]); }
      out.innerHTML = A.statBox('Lowest mode', fmtHz(ax1[0]), 'c / 2 × longest side') + A.statBox('Stacked axial modes', String(clusters), clusters > 3 ? 'clustering — boomy notes' : 'well spread', clusters > 3 ? 'bad' : 'good') + A.statBox('Biggest gap below 120 Hz', fmt(maxGap, 2) + ' Hz', maxGap > 25 ? 'notes in the gap sound weak' : '') + A.statBox('Schroeder frequency', fmtHz(fs), 'modes merge above this');
      const pk = +st.peak || 0;
      const near = modes.map((m) => ({ ...m, d: Math.abs(m.f - pk) / pk })).sort((a, b) => a.d - b.d).slice(0, 3);
      const fund = ax1.filter((f) => Math.abs((pk / f) - Math.round(pk / f)) < 0.04 && Math.round(pk / f) >= 2);
      idn.innerHTML = pk ? `<div class="callout data"><b>Your ${fmtHz(pk)} peak</b> is closest to: ${near.map((m) => `${fmtHz(m.f)} — ${m.type} mode (${m.n.join(', ')})`).join('; ')}.${near[0].type === 'axial' && near[0].n.filter((x) => x).length === 1 && Math.max(...near[0].n) > 1 ? ` It is the <b>${Math.max(...near[0].n)}${['', 'st', 'nd', 'rd'][Math.max(...near[0].n)] || 'th'} axial mode</b> of one dimension (a “harmonic” of ${fmtHz(near[0].f / Math.max(...near[0].n))}).` : ''} ${near[0].d > 0.06 ? 'No mode is within 6 % — it may be speaker–boundary interference (SBIR) or a desk/floor reflection rather than a mode.' : ''}</div>` : '';
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Which way to face? Long-axis vs wide set-up
     ====================================================================== */
  V.facing = function (host) {
    const st = A.controls(host, [
      { key: 'L', label: 'Room length (long side)', type: 'range', min: 3, max: 9, step: 0.05, value: 5, unit: 'm' },
      { key: 'W', label: 'Room width (short side)', type: 'range', min: 2.5, max: 7, step: 0.05, value: 3.6, unit: 'm' },
      { key: 'orient', label: 'Set-up', type: 'select', value: 'deep', options: [['deep', 'Facing down the length (desk on a short wall)'], ['wide', 'Facing across the width (desk on a long wall)']] },
      { key: 'seat', label: 'Seat position (fraction of facing depth)', type: 'range', min: 0.2, max: 0.7, step: 0.01, value: 0.38 },
      { key: 'sd', label: 'Speaker to front wall', type: 'range', min: 0.1, max: 1.5, step: 0.01, value: 0.5, unit: 'm' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const note = el('div'); host.appendChild(note);
    function geo() {
      const deep = st.orient === 'deep', D = deep ? st.L : st.W, Wd = deep ? st.W : st.L;
      const ly = D * st.seat, rear = D - ly, side = Wd / 2;
      const sx = Math.tan(Math.PI / 6) * (ly - st.sd); // speakers at ±30°
      const dDir = Math.hypot(sx, ly - st.sd);
      const sidePath = Math.hypot(2 * (side) - sx - 0 + 0, ly - st.sd) ; // image source across side wall (approx, listener at centre)
      const tSide = ((Math.hypot(side * 2 - sx, ly - st.sd) - dDir) / C) * 1000;
      const tRear = ((Math.hypot(sx, (D - st.sd) + rear) - dDir) / C) * 1000;
      const modes = [1, 2, 3].map((n) => 20 * Math.log10(Math.max(0.03, Math.abs(Math.cos((n * Math.PI * ly) / D)))));
      return { deep, D, Wd, ly, rear, side, sx, dDir, tSide, tRear, modes, sbir: C / (4 * st.sd), sidePath };
    }
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Plan view. Expanding rings show the direct sound (green) and the reflections from the side walls and the rear wall arriving at the seat. Facing down the length keeps the rear-wall reflection late (more than ~10 ms) and the side walls symmetrical and close enough to treat.',
      draw(ctx, w, h, t) {
        const g = geo(), pad = 20, wide = w >= 600, sc = Math.max(4, Math.min(((wide ? w - 220 : w) - 2 * pad) / g.Wd, (h - 2 * pad) / g.D));
        const ox = pad, oy = pad, X = (x) => ox + (x + g.Wd / 2) * sc, Y = (y) => oy + y * sc;
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, g.Wd * sc, g.D * sc); ctx.lineWidth = 1;
        const L = [-g.sx, st.sd], R = [g.sx, st.sd], E = [0, g.ly];
        [L, R].forEach((s) => { ctx.fillStyle = A.css('accent'); ctx.fillRect(X(s[0]) - 6, Y(s[1]) - 6, 12, 12); });
        dot(ctx, X(0), Y(g.ly), 7, A.css('good'));
        const ph = (((t % 1.2) + 1.2) % 1.2) / 1.2, rr = ph * Math.max(g.D, g.Wd) * 1.3 * sc;
        ctx.strokeStyle = A.alpha(A.css('good'), 1 - ph); ctx.beginPath(); ctx.arc(X(L[0]), Y(L[1]), rr, 0, TAU); ctx.stroke();
        ctx.strokeStyle = A.alpha(A.css('warn'), 0.8); ctx.beginPath(); ctx.moveTo(X(L[0]), Y(L[1])); ctx.lineTo(X(-g.Wd / 2), Y((L[1] + g.ly) / 2)); ctx.lineTo(X(0), Y(g.ly)); ctx.stroke();
        ctx.strokeStyle = A.alpha(A.css('bad'), 0.8); ctx.beginPath(); ctx.moveTo(X(R[0]), Y(R[1])); ctx.lineTo(X(R[0] / 2), Y(g.D)); ctx.lineTo(X(0), Y(g.ly)); ctx.stroke();
        A.text(ctx, g.deep ? 'front (short wall)' : 'front (long wall)', X(0), oy - 6, { align: 'center', size: 10, color: A.css('muted') });
        if (!wide) return;
        // arrival timeline
        const tx = ox + g.Wd * sc + 30, tw = w - tx - 10, ty = oy + 20;
        A.text(ctx, 'Arrivals at the seat (ms after direct)', tx, ty - 6, { size: 11, weight: 700 });
        const T = (ms) => tx + (ms / 25) * tw;
        ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(tx, ty + 100); ctx.lineTo(tx + tw, ty + 100); ctx.stroke();
        [[0, 'direct', 'good', 90], [g.tSide, 'side', 'warn', 55], [g.tRear, 'rear', 'bad', 45]].forEach(([ms, l, c, hh]) => { const xx = T(Math.min(25, ms)); ctx.fillStyle = A.css(c); ctx.fillRect(xx - 3, ty + 100 - hh, 6, hh); A.text(ctx, `${l} ${fmt(ms, 2)}`, xx, ty + 100 - hh - 4, { align: 'center', size: 10 }); });
        [0, 5, 10, 15, 20, 25].forEach((m) => A.text(ctx, String(m), T(m), ty + 114, { align: 'center', size: 9, color: A.css('muted') }));
        ctx.fillStyle = A.alpha(A.css('good'), 0.1); ctx.fillRect(T(0), ty + 10, T(10) - T(0), 90);
      },
    });
    function upd() {
      const g = geo();
      out.innerHTML = A.statBox('Rear-wall reflection', fmt(g.tRear, 2) + ' ms', g.tRear < 6 ? 'too early — smears the sound' : g.tRear < 10 ? 'borderline' : 'nicely late', g.tRear < 6 ? 'bad' : g.tRear < 10 ? 'warn' : 'good') +
        A.statBox('Side-wall reflection', fmt(g.tSide, 2) + ' ms', 'treat at the mirror points') + A.statBox('Space behind your head', A.fmtLen(g.rear), g.rear < 1 ? 'pressure build-up' : 'room for deep absorption') +
        A.statBox('1st / 2nd / 3rd mode at seat', g.modes.map((d) => (d < -15 ? 'null' : fmt(d, 2))).join(' / ') + ' dB', g.modes.some((d) => d < -15) ? 'you sit in a null' : 'no deep nulls') + A.statBox('Front-wall (SBIR) dip', fmtHz(g.sbir), 'c / 4d');
      note.innerHTML = `<div class="callout ${g.deep ? 'mentor' : 'warn'}">${g.deep ? 'Facing down the length is the safe default in small rooms: symmetrical side walls, a late rear reflection and space to move the seat out of mode nulls. Seat at about 38 % of the length is a good start; check with a measurement.' : 'Facing across the width can work only with very deep rear treatment (≥ 300 mm, ideally more) or a large room. The rear wall sits right behind your head: early reflections and bass build-up are the price for the wide desk.'}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Target curve builder (with REW house-curve export)
     ====================================================================== */
  V.targetCurve = function (host) {
    const st = A.controls(host, [
      { key: 'bass', label: 'Low-frequency lift', type: 'range', min: 0, max: 8, step: 0.5, value: 4, unit: 'dB' },
      { key: 'fb', label: 'Lift starts below', type: 'range', min: 60, max: 250, step: 5, value: 120, unit: 'Hz' },
      { key: 'tilt', label: 'Treble tilt above 1 kHz', type: 'range', min: -2, max: 0, step: 0.1, value: -0.8, unit: 'dB/oct' },
      { key: 'tol', label: 'Tolerance window', type: 'select', value: '3', options: [['3', '± 3 dB (professional)'], ['5', '± 5 dB (very good home room)']] },
      { key: 'eq', label: 'Apply room EQ (cuts only, below 300 Hz)', type: 'check', value: false },
    ], () => upd());
    const row = el('div', { class: 'row' }); const dl = el('button', { html: A.icon('check') + ' Download as REW house curve (.txt)' }); row.appendChild(dl); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tgt = (f) => st.bass / (1 + Math.pow(f / st.fb, 2)) * 1 + (f > 1000 ? st.tilt * Math.log2(f / 1000) : 0);
    const meas = (f) => { let d = tgt(f) * 0.6 + 2 * Math.sin(Math.log(f) * 9) * (f > 300 ? 0.6 : 0); [[42, 9, 6], [68, -14, 10], [96, 7, 8], [130, -6, 9], [172, 5, 10]].forEach(([f0, g, q]) => { const x = q * (f / f0 - f0 / f); d += g / (1 + x * x); }); return d - (f > 8000 ? 3 * Math.log2(f / 8000) : 0); };
    const eqd = (f) => { const m = meas(f); if (!st.eq || f > 300) return m; const e = m - tgt(f); return e > 0 ? m - e * 0.9 : m; };
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Dashed: a perfectly flat line. Green: your target with its tolerance band. Grey: a simulated in-room measurement of an anechoically flat speaker. Room EQ can pull <b>peaks</b> down (blue), but deep <b>nulls</b> cannot be filled with EQ — fix those by moving the seat or speakers.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)', ticks: [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000] }, y: { min: -20, max: 15, label: 'dB' } });
        const fs = []; for (let f = 20; f <= 20000; f *= 1.02) fs.push(f);
        const tol = +st.tol;
        ctx.fillStyle = A.alpha(A.css('good'), 0.12); ctx.beginPath(); fs.forEach((f, i) => { const y = ax.Y(tgt(f) + tol); i ? ctx.lineTo(ax.X(f), y) : ctx.moveTo(ax.X(f), y); }); fs.slice().reverse().forEach((f) => ctx.lineTo(ax.X(f), ax.Y(tgt(f) - tol))); ctx.fill();
        A.plotLine(ctx, ax, [[20, 0], [20000, 0]], A.css('muted'), 1, [5, 5]);
        A.plotLine(ctx, ax, fs.map((f) => [f, meas(f)]), A.alpha(A.css('text'), 0.45), 1.6);
        if (st.eq) A.plotLine(ctx, ax, fs.map((f) => [f, eqd(f)]), A.css('c3'), 2);
        A.plotLine(ctx, ax, fs.map((f) => [f, tgt(f)]), A.css('good'), 2.6);
      },
    });
    function upd() {
      const fs = []; for (let f = 20; f <= 20000; f *= 1.05) fs.push(f);
      const inside = fs.filter((f) => Math.abs(eqd(f) - tgt(f)) <= +st.tol).length / fs.length;
      const deep = fs.filter((f) => f < 300 && eqd(f) - tgt(f) < -6).length;
      out.innerHTML = A.statBox('Within tolerance', fmt(inside * 100, 3) + ' %', 'of the spectrum') + A.statBox('Deep dips left', String(deep > 0 ? 'yes' : 'none'), deep ? 'move seat/speakers — EQ can’t fill' : '', deep ? 'warn' : 'good') + A.statBox('Target at 30 Hz / 10 kHz', `${fmt(tgt(30), 2)} / ${fmt(tgt(10000), 2)} dB`, '');
      cv.redraw();
    }
    dl.onclick = () => {
      const lines = ['* Acoustica house curve'];
      [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000].forEach((f) => lines.push(`${f} ${tgt(f).toFixed(2)}`));
      try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' })); a.download = 'house-curve.txt'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { /* ignore */ }
    };
    upd();
  };

  /* ======================================================================
     6. Surround layout: angles, distances, delays & level trims
     ====================================================================== */
  const LAYOUTS = {
    '5.1': [['C', 0], ['L', -30], ['R', 30], ['Ls', -110], ['Rs', 110]],
    '7.1': [['C', 0], ['L', -30], ['R', 30], ['Lss', -95], ['Rss', 95], ['Lrs', -145], ['Rrs', 145]],
    '7.1.4': [['C', 0], ['L', -30], ['R', 30], ['Lss', -95], ['Rss', 95], ['Lrs', -145], ['Rrs', 145], ['Ltf', -45, 1], ['Rtf', 45, 1], ['Ltr', -135, 1], ['Rtr', 135, 1]],
  };
  V.surroundLayout = function (host) {
    const st = A.controls(host, [
      { key: 'fmt', label: 'Format', type: 'select', value: '7.1.4', options: Object.keys(LAYOUTS).map((k) => [k, k + (k === '7.1.4' ? ' (Dolby Atmos home/studio)' : k === '5.1' ? ' (ITU-R BS.775)' : '')]) },
      { key: 'L', label: 'Room length', type: 'range', min: 3.5, max: 9, step: 0.05, value: 5.5, unit: 'm' },
      { key: 'W', label: 'Room width', type: 'range', min: 3, max: 7, step: 0.05, value: 4.2, unit: 'm' },
      { key: 'H', label: 'Ceiling height', type: 'range', min: 2.3, max: 4, step: 0.05, value: 2.7, unit: 'm' },
      { key: 'r', label: 'Front speaker distance (L/C/R)', type: 'range', min: 1.2, max: 3, step: 0.05, value: 2, unit: 'm' },
      { key: 'al', label: 'Show with time alignment applied', type: 'check', value: true },
    ], () => upd());
    const tbl = el('div'); host.appendChild(tbl);
    let spk = [];
    function layout() {
      const ly = Math.min(st.L - 1, st.r + 0.4), ear = 1.2;
      return LAYOUTS[st.fmt].map(([n, az, top]) => {
        const a = (az * Math.PI) / 180;
        let d2 = st.r; // distance in plan: fronts on circle, others pushed to walls if the circle does not fit
        let x = Math.sin(a) * d2, y = ly - Math.cos(a) * d2;
        if (!top && Math.abs(az) > 45) { // put surrounds on the side/rear walls along the ray
          const dx = Math.sin(a), dy = -Math.cos(a); let tt = 99;
          if (dx) tt = Math.min(tt, ((dx > 0 ? st.W / 2 : -st.W / 2) - 0) / dx - 0.15 / Math.abs(dx));
          if (dy > 0) tt = Math.min(tt, (st.L - ly - 0.15) / dy);
          d2 = Math.max(0.8, tt); x = dx * d2; y = ly + dy * d2;
        }
        let z = ear;
        if (top) { const hz = st.H - ear; d2 = hz / Math.tan((45 * Math.PI) / 180); x = Math.sin(a) * d2 * 0.75; y = ly - Math.cos(a) * d2 * 0.75; z = st.H; }
        if (/ss$/.test(n)) z = ear + 0.3;
        const dist = Math.hypot(x, y - ly, z - ear);
        return { n, az, top: !!top, x, y, z, dist };
      }).map((s, i, arr) => s);
    }
    const cv = A.canvas(host, {
      height: 340, animate: true,
      caption: 'Plan view. Squares: floor-layer speakers; circles: overheads. Rings travel from each speaker to the listener — without time alignment, closer speakers arrive early and pull the image toward them; with delay applied, every wavefront lands together.',
      draw(ctx, w, h, t) {
        const S = spk, pad = 20, sc = Math.min((w - 2 * pad) / st.W, (h - 2 * pad) / st.L), ox = (w - st.W * sc) / 2, oy = pad;
        const X = (x) => ox + (x + st.W / 2) * sc, Y = (y) => oy + y * sc, ly = Math.min(st.L - 1, st.r + 0.4);
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, st.W * sc, st.L * sc); ctx.lineWidth = 1;
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.5); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(X(0), Y(ly), st.r * sc, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        const maxD = Math.max(...S.map((s) => s.dist));
        const period = 2.2, ph = (t % period) / period;
        S.forEach((s, i) => {
          const delay = st.al ? (maxD - s.dist) / C : 0;
          const tt = ph * (maxD / C) * 2.2 - delay;
          const r = tt * C;
          if (r > 0 && r < s.dist * 1.05) { ctx.strokeStyle = A.alpha(A.series(i), 0.7); ctx.beginPath(); ctx.arc(X(s.x), Y(s.y), r * sc, 0, TAU); ctx.stroke(); }
          ctx.fillStyle = A.series(i);
          if (s.top) { ctx.beginPath(); ctx.arc(X(s.x), Y(s.y), 7, 0, TAU); ctx.fill(); } else ctx.fillRect(X(s.x) - 7, Y(s.y) - 7, 14, 14);
          A.text(ctx, s.n, X(s.x), Y(s.y) - 10, { align: 'center', size: 10, weight: 700 });
        });
        dot(ctx, X(0), Y(ly), 8, A.css('good'));
      },
    });
    function upd() {
      spk = layout();
      const maxD = Math.max(...spk.map((s) => s.dist));
      tbl.innerHTML = `<div class="table-wrap"><table><tr><th>Speaker</th><th class="num">Azimuth</th><th class="num">Distance</th><th class="num">Delay to add</th><th class="num">Level trim</th></tr>${spk.map((s) => `<tr><td><b>${s.n}</b>${s.top ? ' (overhead)' : ''}</td><td class="num">${s.az > 0 ? '+' : ''}${s.az}°</td><td class="num">${A.fmtLen(s.dist)}</td><td class="num">${fmt(((maxD - s.dist) / C) * 1000, 2)} ms</td><td class="num">${fmt(20 * Math.log10(s.dist / maxD), 2)} dB</td></tr>`).join('')}</table></div><p class="small muted">Delay = (farthest distance − this distance) / 343 m/s → about 2.9 ms per metre (1 ms ≈ 34 cm). Level trims compensate the inverse-square loss so every speaker reaches the seat at the same level; set them with an SPL meter and pink noise.</p>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     7. Subwoofer + mains alignment at the crossover
     ====================================================================== */
  V.subAlign = function (host) {
    const st = A.controls(host, [
      { key: 'fc', label: 'Crossover frequency', type: 'range', min: 50, max: 150, step: 1, value: 80, unit: 'Hz' },
      { key: 'dd', label: 'Sub is farther than the mains by', type: 'range', min: -2, max: 4, step: 0.01, value: 1.5, unit: 'm' },
      { key: 'ph', label: 'Sub phase dial', type: 'range', min: 0, max: 180, step: 1, value: 0, unit: '°' },
      { key: 'pol', label: 'Sub polarity inverted (180° switch)', type: 'check', value: false },
    ], () => upd());
    const row = el('div', { class: 'row' }); const auto = el('button', { class: 'primary' }, 'Find the best phase (the “loudest at crossover” method)'); row.appendChild(auto); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    function H(f, ph = st.ph, pol = st.pol) {
      const lp = AP.analogFilter('lp', 'LR4', st.fc, f), hp = AP.analogFilter('hp', 'LR4', st.fc, f);
      const tau = st.dd / C, ang = -TAU * f * tau - (ph * Math.PI) / 180 * (f / st.fc) + (pol ? Math.PI : 0);
      const sub = { re: lp.re * Math.cos(ang) - lp.im * Math.sin(ang), im: lp.re * Math.sin(ang) + lp.im * Math.cos(ang) };
      return { sum: 20 * Math.log10(Math.hypot(sub.re + hp.re, sub.im + hp.im) + 1e-9), sub: AP.db(lp), top: AP.db(hp) };
    }
    auto.onclick = () => { let best = [-99, 0, false]; [false, true].forEach((pol) => { for (let p = 0; p <= 180; p += 2) { const v = H(st.fc, p, pol).sum; if (v > best[0]) best = [v, p, pol]; } }); st.set('pol', best[2], true); st.set('ph', best[1]); };
    const cv = A.canvas(host, {
      height: 280,
      caption: 'Dashed: subwoofer and main speakers on their own (Linkwitz–Riley 4th-order crossover). Solid: what you hear when both play. When they are aligned the sum is flat through the crossover; misaligned, a hole opens right where the kick drum lives.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 400, log: true, label: 'Frequency (Hz)', ticks: [20, 40, 60, 80, 100, 150, 200, 300, 400] }, y: { min: -30, max: 8, label: 'dB' } });
        const fs = []; for (let f = 20; f <= 400; f *= 1.015) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, Math.max(-30, H(f).sub)]), A.css('c3'), 1.4, [5, 4]);
        A.plotLine(ctx, ax, fs.map((f) => [f, Math.max(-30, H(f).top)]), A.css('accent2'), 1.4, [5, 4]);
        A.plotLine(ctx, ax, fs.map((f) => [f, Math.max(-30, H(f).sum)]), A.css('accent'), 2.8);
        ctx.setLineDash([3, 3]); ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(ax.X(st.fc), ax.y1); ctx.lineTo(ax.X(st.fc), ax.y0); ctx.stroke(); ctx.setLineDash([]);
      },
    });
    function upd() { const v = H(st.fc).sum; out.innerHTML = A.statBox('Sum at the crossover', (v > 0 ? '+' : '') + fmt(v, 2) + ' dB', v > -1.5 ? 'aligned' : v > -6 ? 'partly out of phase' : 'cancelling — a hole', v > -1.5 ? 'good' : v > -6 ? 'warn' : 'bad') + A.statBox('Arrival difference', fmt((st.dd / C) * 1000, 2) + ' ms', '≈ 2.9 ms per metre') + A.statBox('Period at crossover', fmt(1000 / st.fc, 3) + ' ms', 'half of this = full cancellation'); cv.redraw(); }
    upd();
  };

  /* ======================================================================
     8. Floating-floor designer (target resonance, pads, air spring, coupling)
     ====================================================================== */
  const DECKS = { ply3: ['3 × 18 mm plywood (≈ 32 kg/m²)', 32], plycb: ['3 × 18 mm plywood + 12 mm fibre-cement (≈ 50 kg/m²)', 50], conc50: ['50 mm concrete slab (≈ 115 kg/m²)', 115], conc100: ['100 mm concrete slab (≈ 230 kg/m²)', 230] };
  const PADS = { spring: ['Steel springs (dynamic ≈ static)', 1.0], neo: ['Neoprene pads (dynamic ≈ 1.4 × static)', 1.4], rubber: ['Dense rubber / recycled rubber (≈ 2 × static)', 2.0] };
  V.floatDesign = function (host) {
    const st = A.controls(host, [
      { key: 'deck', label: 'Floating deck', type: 'select', value: 'plycb', options: Object.entries(DECKS).map(([k, v]) => [k, v[0]]) },
      { key: 'live', label: 'Gear, furniture & people (live load)', type: 'range', min: 0, max: 150, step: 5, value: 40, unit: 'kg/m²' },
      { key: 'area', label: 'Floor area', type: 'range', min: 5, max: 60, step: 0.5, value: 15, unit: 'm²' },
      { key: 'sp', label: 'Pad spacing (grid)', type: 'range', min: 0.3, max: 0.9, step: 0.05, value: 0.6, unit: 'm' },
      { key: 'fn', label: 'Target resonance', type: 'range', min: 5, max: 30, step: 0.5, value: 14, unit: 'Hz' },
      { key: 'pad', label: 'Isolator type', type: 'select', value: 'neo', options: Object.entries(PADS).map(([k, v]) => [k, v[0]]) },
      { key: 'gap', label: 'Air gap depth', type: 'range', min: 0.02, max: 0.3, step: 0.005, value: 0.05, unit: 'm' },
      { key: 'fill', label: 'Gap filled with mineral wool', type: 'check', value: true },
      { key: 'fs', label: 'Structural floor resonance', type: 'range', min: 10, max: 60, step: 1, value: 40, unit: 'Hz' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const warn = el('div'); host.appendChild(warn);
    let R = {};
    function calc() {
      const m = DECKS[st.deck][1] + st.live, g = 9.81;
      const dStat = Math.pow(15.76 / st.fn, 2); // mm, from fn = 15.76/√d
      const nPads = Math.ceil(st.area / (st.sp * st.sp)), loadPad = (m * st.area) / nPads;
      const kStatic = (m * g) / (dStat / 1000); // N/m per m²
      const kDyn = kStatic * PADS[st.pad][1];
      const sAir = P.airStiffness(st.gap, st.fill) * 1e6; // N/m³ (per m² of floor)
      const fPads = P.fnFromK(kDyn, m), fReal = P.fnFromK(kDyn + sAir, m), fAirOnly = P.fnFromK(sAir, m);
      return { m, dStat, nPads, loadPad, fPads, fReal, fAirOnly, iso: Math.SQRT2 * fReal, struct: (DECKS[st.deck][1] + st.live) * 1 };
    }
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Top: the deck bouncing on its springs (slowed down). Bottom: transmissibility — above 1 the floor <b>amplifies</b> vibration, below 1 it isolates. Isolation begins at √2 × the real resonance. The real resonance includes the stiffness of the trapped air and the extra dynamic stiffness of rubber, which is why it is usually higher than the design target.',
      draw(ctx, w, h, t) {
        const r = R; const top = 90;
        const y0 = 60 + Math.sin(t * TAU * 0.8) * 5;
        ctx.fillStyle = A.css('muted'); ctx.fillRect(20, 76, w - 40, 10);
        for (let x = 40; x < w - 40; x += 50) { ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y0 + 10); for (let k = 0; k < 6; k++) ctx.lineTo(x + (k % 2 ? 6 : -6), y0 + 10 + ((76 - y0 - 10) * (k + 1)) / 6); ctx.stroke(); }
        ctx.lineWidth = 1; ctx.fillStyle = A.alpha(A.css('accent2'), 0.8); ctx.fillRect(20, y0 - 14, w - 40, 24);
        A.text(ctx, `deck ${fmt(r.m, 3)} kg/m² · ${r.nPads} pads · ${fmt(r.loadPad, 3)} kg each`, w / 2, y0 + 2, { align: 'center', size: 11, weight: 700, color: '#fff' });
        if (st.fill) { ctx.fillStyle = A.alpha(A.css('c4'), 0.25); ctx.fillRect(20, y0 + 10, w - 40, 76 - y0 - 10); }
        const ax = A.axes(ctx, w, h, { x: { min: 3, max: 200, log: true, label: 'Frequency (Hz)', ticks: [5, 10, 20, 40, 63, 100, 200] }, y: { min: -40, max: 25, label: 'Transmissibility (dB)' }, pad: { t: top + 12, b: 34 } });
        const pts = []; for (let f = 3; f <= 200; f *= 1.02) pts.push([f, A.clamp(20 * Math.log10(P.transmissibility(f / r.fReal, 0.08)), -40, 25)]);
        ctx.fillStyle = A.alpha(A.css('bad'), 0.08); ctx.fillRect(ax.x0, ax.y1, ax.X(r.iso) - ax.x0, ax.y0 - ax.y1);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.6);
        [[st.fn, 'target', 'good'], [r.fReal, 'real', 'bad'], [st.fs, 'structure', 'warn']].forEach(([f, l, c]) => { ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css(c); ctx.beginPath(); ctx.moveTo(ax.X(f), ax.y1); ctx.lineTo(ax.X(f), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, `${l} ${fmt(f, 3)} Hz`, ax.X(f) + 3, ax.y1 + (l === 'target' ? 12 : l === 'real' ? 26 : 40), { size: 10, color: A.css(c) }); });
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Static deflection needed', fmt(r.dStat, 3) + ' mm', `fn ≈ 15.8/√d → ${st.fn} Hz`) + A.statBox('Load per pad', fmt(r.loadPad, 3) + ' kg', `${r.nPads} pads on a ${A.fmtLen(st.sp)} grid`) + A.statBox('Real resonance', fmt(r.fReal, 3) + ' Hz', `pads ${fmt(r.fPads, 3)} Hz + air ${fmt(r.fAirOnly, 3)} Hz`, r.fReal > st.fn * 1.3 ? 'warn' : 'good') + A.statBox('Isolates above', fmt(r.iso, 3) + ' Hz', '√2 × real resonance') + A.statBox('Load on the structure', fmt(r.m, 3) + ' kg/m²', 'added on top of the existing floor');
      const w = [];
      if (r.fAirOnly > st.fn) w.push(`The trapped air alone acts as a spring of <b>${fmt(r.fAirOnly, 3)} Hz</b> — stiffer than your target. Deepen the gap, fill it with mineral wool (reduces the air stiffness) or add mass.`);
      if (r.fReal > st.fs / 2) w.push(`Real resonance (${fmt(r.fReal, 3)} Hz) is closer than one octave to the structural floor (${st.fs} Hz): the two can couple and ring together. Aim for a floating resonance at or below half the structural resonance.`);
      if (DECKS[st.deck][1] < 40) w.push('A light deck is hard to tune low and feels “bouncy” underfoot. 40–50 kg/m² is a sensible minimum.');
      if (st.live < 20) w.push('Design for the realistic loaded condition — an empty floor sits higher; adding gear lowers its resonance.');
      warn.innerHTML = w.length ? `<div class="callout warn"><ul style="margin:0;padding-left:18px">${w.map((x) => `<li>${x}</li>`).join('')}</ul></div>` : '<div class="callout mentor">This design hits its target with a safe margin below the structural floor. Check the pad manufacturer’s load–deflection chart, put stiffer pads under walls and heavy racks, and keep a 10 mm sealed perimeter gap.</div>';
      cv.redraw();
    }
    upd();
  };
})();
