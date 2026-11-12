/* ==========================================================================
   Acoustica — sound redirectors (angled reflectors) and an absorber
   design calculator. Simplified teaching models.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C = 343;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };

  /* ======================================================================
     1. Redirector designer — angle, size and the frequency it works from
     ====================================================================== */
  V.redirector = function (host) {
    const st = A.controls(host, [
      { key: 'W', label: 'Room width', type: 'range', min: 2.4, max: 7, step: 0.05, value: 3.6, unit: 'm' },
      { key: 'D', label: 'Speaker-to-listener distance', type: 'range', min: 1, max: 3.5, step: 0.05, value: 1.6, unit: 'm' },
      { key: 'ang', label: 'Panel angle (opened toward the rear)', type: 'range', min: 0, max: 30, step: 0.5, value: 0, unit: '°' },
      { key: 'pw', label: 'Panel width', type: 'range', min: 0.3, max: 2.4, step: 0.05, value: 1.2, unit: 'm' },
      { key: 'ph', label: 'Panel height', type: 'range', min: 0.3, max: 2.4, step: 0.05, value: 1.2, unit: 'm' },
      { key: 'f', label: 'Show wavefronts at', type: 'range', min: Math.log10(100), max: Math.log10(8000), step: 0.01, value: Math.log10(1000), fmt: (v) => fmtHz(Math.pow(10, v)) },
      { key: 'back', label: 'What the redirected sound hits next', type: 'select', value: 'abs', options: [['abs', 'Deep absorber on the rear wall'], ['diff', 'Diffuser on the rear wall'], ['hard', 'Bare rear wall']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const ZONE = 0.45;
    function geo(angDeg = st.ang) {
      const S = [0.6, st.D * 0.5 * Math.tan(Math.PI / 6) * 2 * 0.5 + 0.0]; // speaker (x along length, y from centre line)
      S[1] = (st.D * Math.tan(Math.PI / 6));           // ±30° layout
      S[1] = Math.min(S[1], st.W / 2 - 0.35);
      const Lp = [0.6 + st.D * Math.cos(Math.asin(Math.min(0.99, S[1] / st.D))) , 0];
      const yw = st.W / 2;
      // mirror point on the flat wall
      const xm = S[0] + ((Lp[0] - S[0]) * (yw - S[1])) / ((yw - S[1]) + (yw - Lp[1]));
      const Pc = [xm, yw - 0.02];
      const a = (angDeg * Math.PI) / 180;
      const n = [Math.sin(a), -Math.cos(a)];          // panel normal, tilted toward the rear (+x)
      const d = [Pc[0] - S[0], Pc[1] - S[1]], dl = Math.hypot(d[0], d[1]); const di = [d[0] / dl, d[1] / dl];
      const dn = di[0] * n[0] + di[1] * n[1];
      const r = [di[0] - 2 * dn * n[0], di[1] - 2 * dn * n[1]];
      const tt = (Lp[0] - Pc[0]) * r[0] + (Lp[1] - Pc[1]) * r[1];
      const cl = [Pc[0] + r[0] * tt, Pc[1] + r[1] * tt];
      const miss = tt > 0 ? Math.hypot(cl[0] - Lp[0], cl[1] - Lp[1]) : Math.hypot(Pc[0] - Lp[0], Pc[1] - Lp[1]);
      const a1 = dl, a2 = Math.hypot(Lp[0] - Pc[0], Lp[1] - Pc[1]), aStar = (2 * a1 * a2) / (a1 + a2);
      const cosT = Math.abs(dn);
      const fgw = (C * aStar) / (2 * Math.pow(st.pw * cosT, 2)), fgh = (C * aStar) / (2 * st.ph * st.ph);
      return { S, Lp, Pc, n, r, miss, a1, a2, fg: Math.max(fgw, fgh), fgw, fgh, cosT, xm, yw };
    }
    function needAngle() { for (let a = 0; a <= 30; a += 0.25) if (geo(a).miss >= ZONE) return a; return null; }
    let G = geo();
    const cv = A.canvas(host, {
      height: 340, animate: true,
      caption: 'Plan view (one half of the room mirrored). Green: direct sound. Red/orange: the first reflection from the side-wall panel. Tilting the panel by an angle turns the reflection by <b>twice</b> that angle, so a few degrees is enough to steer it past the listening zone (dashed circle) to the rear wall. The panel only steers wavelengths clearly smaller than itself — move the frequency slider to see the bounce spread out and “ignore” the angle at low frequencies.',
      draw(ctx, w, h, t) {
        const g = G, Ltot = Math.max(5.6, g.Lp[0] + 2.6), sc = Math.min((w - 40) / Ltot, (h - 30) / st.W), ox = 20, oy = (h - st.W * sc) / 2;
        const X = (x) => ox + x * sc, Y = (y) => oy + (st.W / 2 - y) * sc;
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(X(0), Y(st.W / 2), Ltot * sc, st.W * sc); ctx.lineWidth = 1;
        // rear wall treatment
        ctx.fillStyle = st.back === 'abs' ? A.alpha(A.css('c4'), 0.7) : st.back === 'diff' ? A.css('accent2') : 'transparent';
        if (st.back === 'abs') ctx.fillRect(X(Ltot) - 16, Y(st.W / 2) + 2, 14, st.W * sc - 4);
        if (st.back === 'diff') for (let i = 0; i < 14; i++) ctx.fillRect(X(Ltot) - 4 - ((i * 3) % 5) * 3, Y(st.W / 2) + 4 + i * ((st.W * sc - 8) / 14), 4 + ((i * 3) % 5) * 3, (st.W * sc - 8) / 14 - 2);
        // listening zone
        ctx.setLineDash([5, 4]); ctx.strokeStyle = A.css('good'); ctx.beginPath(); ctx.arc(X(g.Lp[0]), Y(0), ZONE * sc, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        dot(ctx, X(g.Lp[0]), Y(0), 6, A.css('good'));
        [1, -1].forEach((sgn) => {
          const S = [g.S[0], g.S[1] * sgn], Pc = [g.Pc[0], g.Pc[1] * sgn], r = [g.r[0], g.r[1] * sgn];
          ctx.fillStyle = A.css('accent'); ctx.fillRect(X(S[0]) - 7, Y(S[1]) - 7, 14, 14);
          ctx.strokeStyle = A.alpha(A.css('good'), 0.7); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(S[0]), Y(S[1])); ctx.lineTo(X(g.Lp[0]), Y(0)); ctx.stroke();
          // panel
          const a = (st.ang * Math.PI) / 180, hx = (st.pw / 2) * Math.cos(a), hy = (st.pw / 2) * Math.sin(a) * sgn;
          const yIn = Pc[1] - sgn * st.pw * Math.sin(a);
          if (st.ang > 1) { ctx.fillStyle = A.alpha(A.css('c4'), 0.4); ctx.beginPath(); ctx.moveTo(X(Pc[0] - hx), Y(Pc[1])); ctx.lineTo(X(Pc[0] - hx), Y(yIn)); ctx.lineTo(X(Pc[0] + hx), Y(Pc[1])); ctx.fill(); }
          ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(X(Pc[0] - hx), Y(yIn)); ctx.lineTo(X(Pc[0] + hx), Y(Pc[1])); ctx.stroke(); ctx.lineWidth = 1;
          // reflected ray
          const hit = g.miss < ZONE, col = hit ? A.css('bad') : A.css('warn');
          let len = 0; if (r[0] > 0.02) len = (Ltot - Pc[0]) / r[0]; else len = 3;
          const yEnd = Pc[1] + r[1] * len; if (Math.abs(yEnd) > st.W / 2) len = Math.abs((-(sgn) * st.W / 2 - Pc[1]) / r[1]);
          ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(S[0]), Y(S[1])); ctx.lineTo(X(Pc[0]), Y(Pc[1])); ctx.lineTo(X(Pc[0] + r[0] * len), Y(Pc[1] + r[1] * len)); ctx.stroke(); ctx.lineWidth = 1;
          // wavefront arcs: narrow beam above fg, wide spread below
          const f = Math.pow(10, st.f), spread = A.clamp(0.25 * Math.sqrt(g.fg / f), 0.12, 1.5), base = Math.atan2(-(r[1]), r[0]);
          for (let k = 0; k < 3; k++) { const rr = ((Math.max(0, t) * 0.9 + k / 3) % 1) * Math.min(len, 3) * sc; ctx.strokeStyle = A.alpha(col, 0.8 * (1 - rr / (3 * sc + 1))); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(Pc[0]), Y(Pc[1]), rr, base - spread, base + spread); ctx.stroke(); }
          ctx.lineWidth = 1;
        });
        A.text(ctx, 'front', X(0) + 4, Y(st.W / 2) + 14, { size: 10, color: A.css('muted') }); A.text(ctx, 'rear', X(Ltot) - 26, Y(st.W / 2) + 14, { size: 10, color: A.css('muted'), align: 'right' });
      },
    });
    function upd() {
      G = geo(); const g = G, need = needAngle(), f = Math.pow(10, st.f);
      out.innerHTML = A.statBox('First reflection', g.miss < ZONE ? 'hits the listening zone' : 'steered past it', `passes ${A.fmtLen(g.miss)} from the head`, g.miss < ZONE ? 'bad' : 'good') +
        A.statBox('Angle needed here', need == null ? '> 30°' : fmt(need, 2) + '°', need != null ? `front edge stands ${A.fmtLen(st.pw * Math.sin((need * Math.PI) / 180))} off the wall` : 'absorb instead') +
        A.statBox('Works as a redirector above', fmtHz(g.fg), `width limit ${fmtHz(g.fgw)} · height limit ${fmtHz(g.fgh)}`, g.fg > 800 ? 'warn' : 'good') +
        A.statBox('At ' + fmtHz(f), f >= g.fg ? 'steered (mirror-like)' : f >= g.fg / 4 ? 'partly steered, spreading' : 'not steered', f < g.fg ? `${fmt(Math.min(24, 20 * Math.log10(g.fg / f) * 0.5 + 0), 2)} dB weaker in the mirror direction` : '');
      const T = [];
      if (g.miss < ZONE) T.push(need != null ? `Open the panel to about <b>${fmt(need, 2)}°</b> so the reflection clears a ${A.fmtLen(ZONE * 2)} wide listening zone.` : 'In this geometry a sensible angle cannot clear the seat — absorb this reflection instead.');
      if (g.fg > 600) T.push(`This panel is small for its job: it steers only above ${fmtHz(g.fg)}. Make it wider/taller, or treat the range below it with absorption (the wedge behind an angled panel is a perfect place for it).`);
      if (st.back === 'hard' && g.miss >= ZONE) T.push('The redirected sound now hits a bare rear wall and returns to you 15–30 ms later as an echo-like reflection. Give it a destination: deep absorption or a diffuser on the rear wall.');
      if (st.ang > 0.5) T.push('Fill the wedge behind the angled panel with mineral wool and leave slots at its edges: redirector for mids and highs, bass absorber behind — two jobs in one depth.');
      if (!T.length) T.push('Flat hard side walls send the first reflection straight to your ears. Tilt, absorb or diffuse that spot.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Absorber calculator — one target frequency, five ways to absorb it
     ====================================================================== */
  V.absorberCalc = function (host) {
    const st = A.controls(host, [
      { key: 'f', label: 'Target frequency', type: 'range', min: Math.log10(30), max: Math.log10(2000), step: 0.005, value: Math.log10(80), fmt: (v) => fmtHz(Math.pow(10, v)) },
      { key: 'm', label: 'Membrane: panel mass', type: 'range', min: 2, max: 20, step: 0.5, value: 5, unit: 'kg/m²' },
      { key: 'slat', label: 'Slot absorber: slat width', type: 'range', min: 0.03, max: 0.15, step: 0.005, value: 0.07, unit: 'm' },
      { key: 'gapS', label: 'Slot absorber: slot width', type: 'range', min: 0.003, max: 0.03, step: 0.001, value: 0.008, unit: 'm' },
      { key: 't', label: 'Slat / panel thickness', type: 'range', min: 0.006, max: 0.04, step: 0.001, value: 0.018, unit: 'm' },
      { key: 'hole', label: 'Perforated panel: hole diameter', type: 'range', min: 0.003, max: 0.02, step: 0.001, value: 0.006, unit: 'm' },
      { key: 'pitch', label: 'Perforated panel: hole spacing', type: 'range', min: 0.015, max: 0.15, step: 0.005, value: 0.05, unit: 'm' },
    ], () => upd());
    const cards = el('div', { class: 'uc-grid' }); host.appendChild(cards);
    function design() {
      const f = Math.pow(10, st.f), lam = C / f, k2 = Math.pow(C / (TAU * f), 2);
      const porous = { ideal: lam / 4, practical: lam / 8 };
      const memD = Math.pow(50 / f, 2) / st.m;
      const epsS = st.gapS / (st.gapS + st.slat), tS = st.t + 1.2 * st.gapS, slotD = (epsS * k2) / tS;
      const epsP = (Math.PI * st.hole * st.hole) / (4 * st.pitch * st.pitch), tP = st.t + 0.85 * st.hole, perfD = (epsP * k2) / tP;
      return { f, lam, porous, memD, epsS, slotD, epsP, perfD, tube: lam / 4 };
    }
    let Dn = design();
    const ok = (d) => d >= 0.02 && d <= 0.6;
    const cv = A.canvas(host, {
      height: 280,
      caption: 'Predicted absorption of each design sized for your target: porous is broadband above its limit; membrane, slot and perforated absorbers are tuned around the target (see the legend). Designs whose required depth is impractical are drawn faint. Always build with some adjustment and confirm by measurement.',
      draw(ctx, w, h) {
        const d = Dn, ax = A.axes(ctx, w, h, { x: { min: 25, max: 4000, log: true, label: 'Frequency (Hz)', ticks: [31, 63, 125, 250, 500, 1000, 2000, 4000] }, y: { min: 0, max: 1.05, label: 'Absorption α' } });
        const fs = []; for (let f = 25; f <= 4000; f *= 1.03) fs.push(f);
        const pd = Math.min(0.6, d.porous.practical);
        A.plotLine(ctx, ax, fs.map((f) => [f, P.porousAlpha(f, 8000, pd * 0.6, pd * 0.4)]), A.alpha(A.css('good'), d.porous.practical > 0.6 ? 0.3 : 1), 2.2);
        A.plotLine(ctx, ax, fs.map((f) => [f, P.membraneAlpha(f, { m: st.m, D: A.clamp(d.memD, 0.02, 1), fillSigma: 8000, r: 0.25 })]), A.alpha(A.css('c3'), ok(d.memD) ? 1 : 0.3), 2.2);
        A.plotLine(ctx, ax, fs.map((f) => [f, Math.min(1, P.perforatedAlpha(f, { t: st.t, slot: true, slotW: st.gapS, open: d.epsS, D: A.clamp(d.slotD, 0.02, 1), fillSigma: 8000 }))]), A.alpha(A.css('accent'), ok(d.slotD) ? 1 : 0.3), 2.2);
        A.plotLine(ctx, ax, fs.map((f) => [f, Math.min(1, P.perforatedAlpha(f, { t: st.t, holeD: st.hole, open: d.epsP, D: A.clamp(d.perfD, 0.02, 1), fillSigma: 8000 }))]), A.alpha(A.css('accent2'), ok(d.perfD) ? 1 : 0.3), 2.2);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(ax.X(d.f), ax.y1); ctx.lineTo(ax.X(d.f), ax.y0); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'target ' + fmtHz(d.f), ax.X(d.f) + 4, ax.y1 + 12, { size: 10, color: A.css('muted') });
      },
    });
    host.appendChild(A.legend([[A.css('good'), 'Porous'], [A.css('c3'), 'Membrane'], [A.css('accent'), 'Slot (Helmholtz)'], [A.css('accent2'), 'Perforated']]));
    function upd() {
      Dn = design(); const d = Dn;
      const card = (ico, name, col, dims, verdict, good) => `<div class="uc" style="border-top-color:${col}"><h4><span class="uc-ico">${ico}</span>${name}</h4><dl>${dims.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}<dt>Verdict</dt><dd class="${good ? 'fix' : ''}">${verdict}</dd></dl></div>`;
      cards.innerHTML =
        card('🧶', 'Porous (wool) absorber', 'var(--good)', [['Ideal reach (λ/4)', A.fmtLen(d.porous.ideal)], ['Practical depth (λ/8, part as air gap)', A.fmtLen(d.porous.practical)], ['Formula', 'depth ≈ c / (8·f) … c / (4·f)']], d.porous.practical <= 0.3 ? 'Practical — simplest and broadband' : d.porous.practical <= 0.6 ? 'Deep: use as a corner trap' : 'Too deep — use a tuned trap', d.porous.practical <= 0.6) +
        card('🥁', 'Membrane (panel) trap', 'var(--c3)', [['Cavity depth', A.fmtLen(d.memD)], ['Panel', `${st.m} kg/m², sealed edges`], ['Formula', 'D = (50 / f)² / m &nbsp;(wool-filled; 60 if empty)']], ok(d.memD) ? 'Good for ' + (d.f < 150 ? 'this range' : 'this, though porous is easier') : d.memD > 0.6 ? 'Too deep — use a heavier panel' : 'Too shallow — use a lighter panel', ok(d.memD)) +
        card('🪵', 'Slot (slat) Helmholtz absorber', 'var(--accent)', [['Cavity depth', A.fmtLen(d.slotD)], ['Open area', fmt(d.epsS * 100, 2) + ' %'], ['Formula', 'D = ε·(c / 2πf)² / (t + 1.2·slot)']], ok(d.slotD) ? 'Buildable; add wool behind the slats' : d.slotD > 0.6 ? 'Too deep — narrower slots or wider slats' : 'Too shallow — wider slots or narrower slats', ok(d.slotD)) +
        card('🕳️', 'Perforated panel absorber', 'var(--accent2)', [['Cavity depth', A.fmtLen(d.perfD)], ['Open area', fmt(d.epsP * 100, 2) + ' %'], ['Formula', 'D = ε·(c / 2πf)² / (t + 0.85·d) &nbsp;·&nbsp; ε = πd² / 4s²']], ok(d.perfD) ? 'Buildable; wool directly behind the panel' : d.perfD > 0.6 ? 'Too deep — fewer / smaller holes' : 'Too shallow — more open area', ok(d.perfD)) +
        card('📯', 'Quarter-wave tube / slot', 'var(--warn)', [['Length', A.fmtLen(d.tube)], ['Formula', 'L = c / (4·f)']], d.tube <= 2.6 ? 'Fits floor-to-ceiling: a corner pipe or wall channel' : 'Longer than the room is high — fold it or choose another type', d.tube <= 2.6);
      cv.redraw();
    }
    upd();
  };
})();
