/* ==========================================================================
   Acoustica — physics-under-the-hood, diffuser-depth and workbook widgets.
   impedanceStep, sourceTypes, mufflerTL, diffuserModulation, binaryPanel,
   workbook. Simplified teaching models.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C = 343;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const logF = (key, label, a, b, v) => ({ key, label, type: 'range', min: Math.log10(a), max: Math.log10(b), step: 0.005, value: Math.log10(v), fmt: (x) => fmtHz(Math.pow(10, x)) });

  /* ======================================================================
     1. Impedance step — what happens when sound meets a different medium
     ====================================================================== */
  const MEDIA = {
    air: ['Air', 1.2, 343], wool: ['Light mineral wool (“almost air”)', 1.6, 330], water: ['Water', 1000, 1480], wood: ['Timber (across the grain)', 500, 3300],
    glass: ['Glass', 2500, 5200], concrete: ['Concrete', 2300, 3500], steel: ['Steel', 7850, 5900],
  };
  const zTxt = (z) => (z >= 1e6 ? fmt(z / 1e6, 2) + ' Mrayl' : fmt(z, 0) + ' rayl');
  V.impedanceStep = function (host) {
    const st = A.controls(host, [
      { key: 'm1', label: 'Sound arrives in', type: 'select', value: 'air', options: Object.entries(MEDIA).map(([k, v]) => [k, v[0]]) },
      { key: 'm2', label: 'and meets', type: 'select', value: 'concrete', options: Object.entries(MEDIA).map(([k, v]) => [k, v[0]]) },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const calc = () => { const a = MEDIA[st.m1], b = MEDIA[st.m2], Z1 = a[1] * a[2], Z2 = b[1] * b[2]; const R = (Z2 - Z1) / (Z2 + Z1), T = (4 * Z1 * Z2) / Math.pow(Z1 + Z2, 2); return { Z1, Z2, R, T, c1: a[2], c2: b[2] }; };
    let G = calc();
    const cv = A.canvas(host, {
      height: 260, animate: true,
      caption: 'A steady wave arrives from the left and meets a new medium at the centre line. Top-left trace: the incoming wave. Bottom-left: the part sent back. Right: the part that gets through. Heights are drawn in proportion to the square root of the energy, so a trace half as tall carries a quarter of the energy. Wavelengths stretch in faster media.',
      draw(ctx, w, h, t) {
        const g = G, tt = Math.max(0, t), mid = w / 2, amp = h * 0.16, y1 = h * 0.28, y2 = h * 0.72, om = tt * 4;
        ctx.fillStyle = A.alpha(A.css('muted'), 0.08); ctx.fillRect(0, 0, mid, h);
        ctx.fillStyle = A.alpha(A.css('accent2'), 0.14); ctx.fillRect(mid, 0, w - mid, h);
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mid, 6); ctx.lineTo(mid, h - 6); ctx.stroke(); ctx.lineWidth = 1;
        const k1 = TAU / Math.max(40, w * 0.11), k2 = k1 * Math.max(0.12, Math.min(1.4, g.c1 / g.c2));
        const trace = (x0, x1, y, a, fn, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); for (let x = x0; x <= x1; x += 2) { const yy = y - a * fn(x); x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); ctx.lineWidth = 1; ctx.strokeStyle = A.alpha(A.css('muted'), 0.4); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); };
        trace(8, mid - 2, y1, amp, (x) => Math.sin(k1 * (x - mid) - om), A.css('accent'));
        trace(8, mid - 2, y2, amp * Math.sqrt(1 - g.T) * Math.sign(g.R || 1), (x) => Math.sin(-k1 * (x - mid) - om), A.css('bad'));
        trace(mid + 2, w - 8, (y1 + y2) / 2, Math.max(0.6, amp * Math.sqrt(g.T)), (x) => Math.sin(k2 * (x - mid) - om), A.css('good'));
        A.text(ctx, 'incoming →', 12, y1 - amp - 6, { size: 11, weight: 700 });
        A.text(ctx, `← reflected ${fmt((1 - g.T) * 100, g.T < 0.01 ? 3 : 1)} %`, 12, y2 - amp - 6, { size: 11, weight: 700 });
        A.text(ctx, `transmitted ${g.T < 0.001 ? fmt(g.T * 100, 4) : fmt(g.T * 100, 2)} % →`, w - 12, (y1 + y2) / 2 - amp - 6, { size: 11, weight: 700, align: 'right' });
        A.text(ctx, MEDIA[st.m1][0], 12, h - 10, { size: 10, color: A.css('muted') }); A.text(ctx, MEDIA[st.m2][0], w - 12, h - 10, { size: 10, color: A.css('muted'), align: 'right' });
      },
    });
    function upd() {
      G = calc(); const g = G, db = -10 * Math.log10(Math.max(g.T, 1e-12));
      out.innerHTML = A.statBox('Impedance, first medium', zTxt(g.Z1), 'ρ × c') + A.statBox('Impedance, second medium', zTxt(g.Z2), `ratio ${fmt(Math.max(g.Z1, g.Z2) / Math.min(g.Z1, g.Z2), 1)} : 1`) + A.statBox('Pressure reflection R', (g.R >= 0 ? '+' : '') + fmt(g.R, 4), g.R < 0 ? 'inverted reflection' : 'same-sign reflection') + A.statBox('Energy getting through', g.T < 0.001 ? fmt(g.T * 100, 4) + ' %' : fmt(g.T * 100, 2) + ' %', `${fmt(db, 1)} dB lost at this step`, db > 20 ? 'good' : db > 3 ? 'warn' : '');
      const ratio = Math.max(g.Z1, g.Z2) / Math.min(g.Z1, g.Z2);
      tip.innerHTML = `<div class="callout mentor">${ratio > 500 ? 'A huge impedance step: almost everything bounces back. This is the root of sound isolation — air cannot “push” a heavy, stiff wall — and also why an underwater swimmer hardly hears someone shouting on the poolside.' : ratio > 5 ? 'A moderate step: a useful share is reflected and the rest passes. Layered constructions use several such steps in a row.' : ratio > 1.05 ? 'Nearly matched: the wave walks straight in with almost no reflection. That is exactly what a porous absorber must be — “almost air” at its surface — so sound enters it instead of bouncing off, and is then lost to friction inside.' : 'Identical media: no boundary as far as the wave is concerned.'} The formula ignores thickness: a thin sheet lets more through than this single step suggests, which is why real walls follow the mass law.</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Source types — monopole, dipole, cardioid, piston
     ====================================================================== */
  const J1 = (x) => { if (Math.abs(x) < 1e-6) return x / 2; let s = 0, term = x / 2; for (let k = 0; k < 30; k++) { s += term; term *= -(x * x) / (4 * (k + 1) * (k + 2)); } return s; };
  const SRC = {
    mono: ['Monopole (a small pulsing sphere)', 'A sealed-box subwoofer below a few hundred hertz; any source much smaller than the wavelength. Radiates equally in all directions.'],
    dip: ['Dipole (two opposite monopoles)', 'An open-baffle or panel loudspeaker, a ribbon or figure-8 microphone, a bare driver with no box. Front and back are out of phase: nothing to the sides, and the bass cancels unless the baffle is big.'],
    card: ['Cardioid (monopole + dipole)', 'A cardioid microphone, a cardioid subwoofer array. The two parts add in front and cancel behind.'],
    pist: ['Piston in a wall (a cone in a baffle)', 'Any woofer or tweeter. Wide at low frequencies; narrows to a beam once the cone is larger than about a wavelength (ka above ≈ 2).'],
  };
  V.sourceTypes = function (host) {
    const st = A.controls(host, [
      { key: 'type', label: 'Source', type: 'select', value: 'mono', options: Object.entries(SRC).map(([k, v]) => [k, v[0]]) },
      { key: 'ka', label: 'Size compared with the wavelength (ka)', type: 'range', min: 0.1, max: 10, step: 0.1, value: 1 },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const D = (th) => { // th measured from the forward axis, radians
      if (st.type === 'mono') return 1;
      if (st.type === 'dip') return Math.cos(th);
      if (st.type === 'card') return (1 + Math.cos(th)) / 2;
      const x = st.ka * Math.sin(th); return Math.abs(th) > Math.PI / 2 ? 0 : (Math.abs(x) < 1e-6 ? 1 : (2 * J1(x)) / x);
    };
    const eff = () => { const k = st.ka; const m = 10 * Math.log10((k * k) / (1 + k * k)); if (st.type === 'mono' || st.type === 'pist') return m; if (st.type === 'dip') return 2 * m + (k < 1 ? 0 : 0); return 1.5 * m; };
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: the source seen from above, radiating upward on the page. Ring brightness shows how strongly it radiates in each direction; for the dipole the two halves are in opposite phase. Right: the same thing as a polar plot (10 dB per ring). ka compares the source size with the wavelength: ka = 1 means the circumference equals one wavelength.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t), lw = Math.min(w * 0.5, 420), cx = lw / 2, cy = h / 2, Rm = Math.min(lw, h) / 2 - 14;
        for (let k = 0; k < 5; k++) {
          const rr = ((tt * 0.35 + k / 5) % 1) * Rm;
          for (let a = 0; a < 72; a++) {
            const th = (a / 72) * TAU, d = D(th > Math.PI ? th - TAU : th), ad = Math.abs(d); if (ad < 0.03) continue;
            ctx.strokeStyle = A.alpha(d >= 0 ? A.css('accent') : A.css('c3'), Math.min(1, ad) * (1 - rr / Rm) * 0.95); ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(cx, cy, rr + 4, -Math.PI / 2 + th - 0.045, -Math.PI / 2 + th + 0.045); ctx.stroke();
          }
        }
        ctx.lineWidth = 1;
        if (st.type === 'pist') { ctx.fillStyle = A.css('muted'); ctx.fillRect(cx - Rm, cy, 2 * Rm, 5); ctx.fillStyle = A.css('text'); const pw = A.clamp(st.ka * 6, 6, 60); ctx.fillRect(cx - pw / 2, cy - 3, pw, 6); }
        else if (st.type === 'dip') { dot(ctx, cx, cy - 5, 5, A.css('accent')); dot(ctx, cx, cy + 5, 5, A.css('c3')); }
        else dot(ctx, cx, cy, 6, A.css('text'));
        A.text(ctx, 'front', cx, 14, { align: 'center', size: 10, color: A.css('muted') });
        // polar
        const px = lw + (w - lw) / 2, py = h / 2 + 6, PR = Math.min(w - lw, h) / 2 - 22;
        if (PR > 30) {
          for (let r = 1; r <= 3; r++) { ctx.strokeStyle = A.alpha(A.css('muted'), 0.35); ctx.beginPath(); ctx.arc(px, py, (PR * r) / 3, 0, TAU); ctx.stroke(); }
          ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.6; ctx.beginPath();
          for (let a = 0; a <= 360; a += 2) { const th = (a * Math.PI) / 180, d = Math.abs(D(th > Math.PI ? th - TAU : th)); const db = Math.max(-30, 20 * Math.log10(Math.max(d, 1e-4))); const rr = PR * (1 + db / 30); const x = px + rr * Math.sin(th), y = py - rr * Math.cos(th); a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke(); ctx.lineWidth = 1;
          A.text(ctx, '0°', px, py - PR - 6, { align: 'center', size: 10, color: A.css('muted') }); A.text(ctx, '180°', px, py + PR + 14, { align: 'center', size: 10, color: A.css('muted') });
        }
      },
    });
    function upd() {
      const side = 20 * Math.log10(Math.max(1e-4, Math.abs(D(Math.PI / 2 - 1e-6)))), back = 20 * Math.log10(Math.max(1e-4, Math.abs(D(Math.PI))));
      let bw = 360; if (st.type === 'pist') { for (let a = 0; a <= 90; a += 0.5) { if (Math.abs(D((a * Math.PI) / 180)) < 0.5) { bw = 2 * a; break; } bw = 180; } } else if (st.type === 'dip') bw = 120; else if (st.type === 'card') bw = 180;
      out.innerHTML = A.statBox('Level to the side (90°)', side < -35 ? 'null' : fmt(side, 1) + ' dB', '') + A.statBox('Level behind (180°)', back < -35 ? (st.type === 'pist' ? 'blocked by the wall' : 'null') : fmt(back, 1) + ' dB', st.type === 'dip' ? 'full level, opposite phase' : '') + A.statBox('Coverage (−6 dB)', bw >= 360 ? 'all round' : fmt(bw, 0) + '°', '') + A.statBox('Efficiency vs a large source', fmt(eff(), 1) + ' dB', st.ka < 1 ? 'small compared with the wave' : 'large enough');
      tip.innerHTML = `<div class="callout mentor"><b>Where you meet it:</b> ${SRC[st.type][1]} ${st.ka < 0.5 ? 'At this small ka the source is a poor radiator: the air simply slides out of the way instead of being compressed. A monopole loses about 6 dB per halving of ka, a dipole about 12 dB — which is why open-baffle bass needs huge cone area.' : st.type === 'pist' && st.ka > 2 ? 'The cone is now bigger than the wavelength, so it beams: this is the moment to cross over to a smaller driver or a waveguide.' : ''}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Expansion-chamber silencer and side-branch resonator
     ====================================================================== */
  V.mufflerTL = function (host) {
    const st = A.controls(host, [
      { key: 'dp', label: 'Pipe / duct diameter', type: 'range', min: 0.05, max: 0.4, step: 0.005, value: 0.15, unit: 'm' },
      { key: 'dc', label: 'Chamber diameter', type: 'range', min: 0.1, max: 1.2, step: 0.01, value: 0.5, unit: 'm' },
      { key: 'L', label: 'Chamber length', type: 'range', min: 0.2, max: 3, step: 0.05, value: 1.0, unit: 'm' },
      { key: 'res', label: 'Add a side-branch (Helmholtz) resonator', type: 'check', value: false },
      { key: 'vol', label: 'Resonator volume', type: 'range', min: 2, max: 200, step: 1, value: 40, fmt: (v) => v + ' L' },
      { key: 'dn', label: 'Resonator neck diameter', type: 'range', min: 0.02, max: 0.15, step: 0.005, value: 0.06, unit: 'm' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function model() {
      const m = Math.pow(Math.max(st.dc, st.dp) / st.dp, 2), S = (Math.PI * st.dp * st.dp) / 4;
      const Sn = (Math.PI * st.dn * st.dn) / 4, ln = 0.03 + 0.85 * st.dn, C0 = Sn / ln, Vr = st.vol / 1000, f0 = (C / TAU) * Math.sqrt(C0 / Vr), beta = Math.sqrt(C0 * Vr) / (2 * S);
      const tlC = (f) => 10 * Math.log10(1 + 0.25 * Math.pow(m - 1 / m, 2) * Math.pow(Math.sin((TAU * f * st.L) / C), 2));
      const tlR = (f) => { if (!st.res) return 0; const x = f / f0 - f0 / f; return Math.min(40, 10 * Math.log10(1 + Math.pow(beta / (Math.abs(x) + 0.02), 2))); };
      return { m, f0, tl: (f) => tlC(f) + tlR(f), tlC, peak: 10 * Math.log10(1 + 0.25 * Math.pow(m - 1 / m, 2)), fFirst: C / (4 * st.L), fPass: C / (2 * st.L), fCut: (1.84 * C) / (Math.PI * st.dc) };
    }
    let M = model();
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top: the silencer in section — sound travels left to right; the sudden change of area sends part of the wave back, and the chamber length decides which frequencies are cancelled. Bottom: transmission loss. The loss repeats in humps and falls to zero at the pass-bands, where the chamber is a whole number of half-wavelengths long. A side-branch resonator adds one deep, narrow notch.',
      draw(ctx, w, h, t) {
        const g = M, tt = Math.max(0, t), top = 96, cy = 50, x0 = 20, x1 = w - 20, cw = Math.min(260, (x1 - x0) * 0.5), cxa = (x0 + x1) / 2 - cw / 2;
        const ph = A.clamp(st.dp * 90, 8, 30), ch = A.clamp(st.dc * 70, ph + 8, 84);
        ctx.fillStyle = A.alpha(A.css('muted'), 0.22); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 1.5;
        ctx.fillRect(x0, cy - ph / 2, x1 - x0, ph); ctx.fillRect(cxa, cy - ch / 2, cw, ch); ctx.strokeRect(cxa, cy - ch / 2, cw, ch);
        if (st.res) { const rx = cxa - 46; ctx.fillRect(rx - 3, cy - ph / 2 - 12, 6, 12); ctx.beginPath(); ctx.roundRect(rx - 18, cy - ph / 2 - 40, 36, 28, 5); ctx.fill(); ctx.stroke(); }
        ctx.lineWidth = 1;
        for (let k = 0; k < 14; k++) { const u = ((tt * 0.25 + k / 14) % 1), x = x0 + u * (x1 - x0), inC = x > cxa && x < cxa + cw, a = x > cxa + cw ? 0.3 : 1; ctx.strokeStyle = A.alpha(A.css('accent'), a); ctx.lineWidth = 2; const hh = inC ? ch : ph; ctx.beginPath(); ctx.moveTo(x, cy - hh / 2 + 3); ctx.lineTo(x, cy + hh / 2 - 3); ctx.stroke(); }
        for (let k = 0; k < 3; k++) { const u = ((tt * 0.25 + k / 3) % 1), x = cxa - u * (cxa - x0); ctx.strokeStyle = A.alpha(A.css('bad'), 0.7 * (1 - u)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, cy - ph / 2 + 3); ctx.lineTo(x, cy + ph / 2 - 3); ctx.stroke(); }
        ctx.lineWidth = 1;
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 2000, log: true, label: 'Frequency (Hz)', ticks: [20, 50, 100, 200, 500, 1000, 2000] }, y: { min: 0, max: Math.max(20, Math.ceil((g.peak + (st.res ? 22 : 4)) / 10) * 10), label: 'Transmission loss (dB)' }, pad: { t: top + 10, b: 36 } });
        for (let n = 1; n * g.fPass <= 2000; n++) { ctx.strokeStyle = A.alpha(A.css('bad'), 0.45); ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(ax.X(n * g.fPass), ax.y1); ctx.lineTo(ax.X(n * g.fPass), ax.y0); ctx.stroke(); ctx.setLineDash([]); }
        const pts = []; for (let f = 20; f <= 2000; f *= 1.008) pts.push([f, g.tl(f)]);
        A.plotFill(ctx, ax, pts, A.alpha(A.css('accent'), 0.12), 0); A.plotLine(ctx, ax, pts, A.css('accent'), 2.4);
        if (g.fCut < 2000) { ctx.fillStyle = A.alpha(A.css('muted'), 0.18); ctx.fillRect(ax.X(g.fCut), ax.y1, ax.x1 - ax.X(g.fCut), ax.y0 - ax.y1); A.text(ctx, 'model unreliable (cross-modes)', ax.x1 - 4, ax.y1 + 12, { size: 10, align: 'right', color: A.css('muted') }); }
      },
    });
    function upd() {
      M = model(); const g = M;
      out.innerHTML = A.statBox('Area ratio m', fmt(g.m, 1), '(chamber ÷ pipe diameter)²') + A.statBox('Maximum loss per hump', fmt(g.peak, 1) + ' dB', 'set only by the area ratio', g.peak > 15 ? 'good' : g.peak > 8 ? 'warn' : 'bad') + A.statBox('First maximum', fmtHz(g.fFirst), 'chamber = ¼ wavelength') + A.statBox('First pass-band (no loss)', fmtHz(g.fPass), 'chamber = ½ wavelength', 'warn') + (st.res ? A.statBox('Resonator notch', fmtHz(g.f0), 'tune it to the problem tone') : '');
      const T = [];
      if (g.m < 4) T.push('The area change is too small to reflect much. Loss depends on the <b>ratio of areas</b>: a chamber three times the pipe diameter gives about 13 dB, five times about 22 dB.');
      T.push(`This chamber does nothing at ${fmtHz(g.fPass)} and its multiples. Make sure the fan’s blade tone or the engine’s firing frequency does not sit there — change the length, or add a second chamber of a different length.`);
      if (st.res) T.push('The side branch removes one tone only. It is the right tool for a steady hum (a fan tone, a 50/100 Hz transformer note) on top of a broadband silencer.');
      T.push('Real HVAC silencers add absorbent lining, which fills in the pass-bands and works at mid and high frequencies; the reactive chamber shown here is what handles the lows.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Diffuser modulation — periodic lobes vs modulated arrays
     ====================================================================== */
  const PRIMES = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];
  const MOD = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0];
  V.diffuserModulation = function (host) {
    const st = A.controls(host, [
      { key: 'N', label: 'Wells per unit (prime number N)', type: 'select', value: '7', options: [5, 7, 11, 13, 17].map((n) => [String(n), 'N = ' + n]) },
      { key: 'rep', label: 'Number of units side by side', type: 'range', min: 1, max: 8, step: 1, value: 6 },
      { key: 'arr', label: 'Arrangement', type: 'select', value: 'per', options: [['per', 'Periodic: the same unit repeated'], ['mod', 'Modulated: unit and its inverse in an irregular order'], ['big', 'One large unit with a bigger prime (same total width)']] },
      { key: 'f0', label: 'Design frequency', type: 'range', min: 300, max: 1200, step: 10, value: 500, unit: 'Hz' },
      { key: 'ww', label: 'Well width', type: 'range', min: 0.03, max: 0.1, step: 0.005, value: 0.05, unit: 'm' },
      logF('f', 'Show the response at', 300, 6000, 1500),
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function depthsFor(arr) {
      const N = +st.N, seq = P.qrdSequence(N), inv = seq.map((s) => (N - s) % N);
      if (arr === 'big') { const tot = N * st.rep, Nb = PRIMES.find((p) => p >= tot) || tot; return { d: P.qrdSequence(Nb).slice(0, tot).map((s) => (s * C) / (2 * Nb * st.f0)), Nb }; }
      let d = []; for (let r = 0; r < st.rep; r++) { const use = arr === 'mod' && MOD[r % MOD.length] === 0 ? inv : seq; d = d.concat(use.map((s) => (s * C) / (2 * N * st.f0))); }
      return { d, Nb: N };
    }
    function polar(d, f) {
      const k = (TAU * f) / C, n = d.length, outp = [];
      for (let a = -90; a <= 90; a += 1) {
        const s = Math.sin((a * Math.PI) / 180); let re = 0, im = 0;
        for (let i = 0; i < n; i++) { const ph = -2 * k * d[i] + k * (i - (n - 1) / 2) * st.ww * s; re += Math.cos(ph); im += Math.sin(ph); }
        const x = (k * st.ww * s) / 2, el2 = Math.abs(x) < 1e-6 ? 1 : Math.sin(x) / x;
        outp.push({ deg: a, db: 20 * Math.log10((Math.hypot(re, im) / n) * Math.abs(el2) + 1e-6) });
      }
      return outp;
    }
    let cur = null, ref = null, flat = null, dd = null;
    const cv = A.canvas(host, {
      height: 330,
      caption: 'Top: the diffuser array seen from above (deeper wells drawn longer; inverted units are tinted). Bottom: how strongly it reflects in each direction for sound arriving straight on, relative to a flat panel of the same size. The dashed trace is the plain periodic array for comparison. An even, fan-like curve is good diffusion; a few tall spikes are lobes.',
      draw(ctx, w, h) {
        if (!cur) return;
        const x0 = 20, x1 = w - 20, n = dd.d.length, bw = (x1 - x0) / n, mx = Math.max(...dd.d, 0.01), N = +st.N;
        for (let i = 0; i < n; i++) { const unit = Math.floor(i / N), invU = st.arr === 'mod' && MOD[unit % MOD.length] === 0; ctx.fillStyle = st.arr === 'big' ? A.css('accent2') : invU ? A.css('c3') : A.css('accent2'); ctx.fillRect(x0 + i * bw + 0.5, 12, Math.max(1, bw - 1), 6 + (dd.d[i] / mx) * 52); }
        if (st.arr !== 'big') for (let r = 1; r < st.rep; r++) { ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.moveTo(x0 + r * N * bw, 8); ctx.lineTo(x0 + r * N * bw, 74); ctx.stroke(); }
        const ax = A.axes(ctx, w, h, { x: { min: -90, max: 90, label: 'Direction of the reflection (degrees)', ticks: [-90, -60, -30, 0, 30, 60, 90] }, y: { min: -40, max: 0, label: 'Level re flat panel (dB)' }, pad: { t: 92, b: 36 } });
        A.plotLine(ctx, ax, ref.map((p) => [p.deg, Math.max(-40, p.db)]), A.alpha(A.css('text'), 0.4), 1.3, [5, 4]);
        A.plotFill(ctx, ax, cur.map((p) => [p.deg, Math.max(-40, p.db)]), A.alpha(A.css('accent'), 0.14), -40);
        A.plotLine(ctx, ax, cur.map((p) => [p.deg, Math.max(-40, p.db)]), A.css('accent'), 2.4);
      },
    });
    function upd() {
      const f = Math.pow(10, st.f); dd = depthsFor(st.arr);
      cur = polar(dd.d, f); ref = polar(depthsFor('per').d, f); flat = polar(dd.d.map(() => 0), f);
      const dc = P.diffusionCoeff(cur), dr = P.diffusionCoeff(ref), df = P.diffusionCoeff(flat), norm = (d) => Math.max(0, (d - df) / (1 - df));
      const peak = Math.max(...cur.map((p) => p.db)), N = +st.N, Wp = N * st.ww, lobes = P.gratingLobes(Wp, f).length;
      out.innerHTML = A.statBox('Evenness (normalised diffusion)', fmt(norm(dc), 2), `periodic: ${fmt(norm(dr), 2)}`, norm(dc) > 0.5 ? 'good' : norm(dc) > 0.25 ? 'warn' : 'bad') + A.statBox('Strongest reflection', fmt(peak, 1) + ' dB', 're a flat panel', peak > -6 ? 'bad' : peak > -12 ? 'warn' : 'good') + A.statBox('Unit width', A.fmtLen(Wp), st.arr === 'big' ? `one unit, N = ${dd.Nb}` : `${st.rep} units · ${lobes} lobe directions`) + A.statBox('Deepest well', A.fmtLen(Math.max(...dd.d)), `works ${fmtHz(st.f0)} – ${fmtHz(C / (2 * st.ww))}`) + A.statBox('Flat-plate frequency', fmtHz(dd.Nb * st.f0), Math.abs(f - dd.Nb * st.f0) / f < 0.06 ? 'you are on it: acts as a mirror' : 'avoid in the working band');
      const T = [];
      if (st.arr === 'per' && st.rep > 2) T.push(`Repeating the same ${N}-well unit ${st.rep} times makes the wall a grating: energy is thrown into ${lobes} fixed directions and little goes between them. More repeats make the spikes <b>narrower</b>, not the diffusion better.`);
      if (st.arr === 'mod') T.push('Mixing the unit with its inverse in an irregular order breaks the repetition, so the lobes smear into a much more even fan — with the same two moulds or cutting lists.');
      if (st.arr === 'big') T.push(`One long sequence (N = ${dd.Nb}) never repeats within the wall. Best evenness, but every well is a different depth: more work to build, and the flat-plate frequency moves up to ${fmtHz(dd.Nb * st.f0)}.`);
      if (st.rep === 1 && st.arr !== 'big') T.push('A single narrow unit diffuses, but only down to the frequency where its total width is a couple of wavelengths.');
      if (f < st.f0) T.push('Below the design frequency the wells are too shallow to shift the phase: the array behaves almost like a flat panel.');
      tip.innerHTML = `<div class="callout mentor"><ul style="margin:0;padding-left:18px">${T.map((x) => `<li>${x}</li>`).join('') || '<li>Change the arrangement and the frequency to see lobes appear and collapse.</li>'}</ul></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Binary hybrid panel (amplitude diffuser over absorber)
     ====================================================================== */
  const TAPS = { 4: [4, 3], 5: [5, 3], 6: [6, 5], 7: [7, 6] };
  function mls(order, seed) { const [a, b] = TAPS[order]; let reg = Array.from({ length: order }, (_, i) => ((seed >> i) & 1)); if (!reg.some(Boolean)) reg[0] = 1; const outp = []; for (let i = 0; i < (1 << order) - 1; i++) { outp.push(reg[order - 1]); const nb = reg[a - 1] ^ reg[b - 1]; reg.pop(); reg.unshift(nb); } return outp; }
  V.binaryPanel = function (host) {
    const st = A.controls(host, [
      { key: 'ord', label: 'Sequence length', type: 'select', value: '6', options: [['4', '15 elements (order 4)'], ['5', '31 elements (order 5)'], ['6', '63 elements (order 6)'], ['7', '127 elements (order 7)']] },
      { key: 'G', label: 'Cells per side', type: 'range', min: 8, max: 24, step: 1, value: 16 },
      { key: 'size', label: 'Panel size (square)', type: 'range', min: 0.3, max: 1.2, step: 0.05, value: 0.6, unit: 'm' },
      { key: 'hole', label: 'Hole diameter (share of a cell)', type: 'range', min: 0.3, max: 0.9, step: 0.05, value: 0.6, fmt: (v) => Math.round(v * 100) + ' %' },
      { key: 'D', label: 'Absorber depth behind the panel', type: 'range', min: 0.025, max: 0.2, step: 0.005, value: 0.05, unit: 'm' },
    ], () => upd());
    const row = el('div', { class: 'row' }); const bNew = el('button', { class: 'primary' }, 'New pattern'), bRot = el('button', {}, 'Rotate 90°'); row.append(bNew, bRot); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    let seed = 5, rot = 0, grid = [];
    bNew.onclick = () => { seed = 1 + Math.floor(Math.random() * 120); upd(); }; bRot.onclick = () => { rot = (rot + 1) % 4; upd(); };
    function build() {
      const seq = mls(+st.ord, seed), L = seq.length, G = st.G; let step = Math.round(Math.sqrt(L)) + 1; const gcd = (a, b) => (b ? gcd(b, a % b) : a); while (gcd(step, L) !== 1) step++;
      let g = Array.from({ length: G }, (_, i) => Array.from({ length: G }, (_, j) => seq[(i * step + j + seed) % L]));
      for (let r = 0; r < rot; r++) g = g[0].map((_, j) => g.map((rowv) => rowv[j]).reverse());
      return g;
    }
    const cv = A.canvas(host, {
      height: 320,
      caption: 'The panel as you would drill or route it: a hole means “sound goes through to the absorber here”, a blank cell means “reflects”. Because the open and closed patches follow a pseudo-random binary sequence, the reflected sound has no regular pattern to form lobes. Print it, tape it to a board and drill.',
      draw(ctx, w, h) {
        const G = st.G, sz = Math.min(h - 20, w * 0.5 - 20), x0 = 16, y0 = 10, cs = sz / G;
        ctx.fillStyle = '#c9a57a'; ctx.fillRect(x0, y0, sz, sz); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(x0, y0, sz, sz); ctx.lineWidth = 1;
        ctx.fillStyle = '#1a1a1a';
        for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) if (grid[i][j]) { ctx.beginPath(); ctx.arc(x0 + (j + 0.5) * cs, y0 + (i + 0.5) * cs, (cs * st.hole) / 2, 0, TAU); ctx.fill(); }
        const xs = x0 + sz + 34, ws = w - xs - 12;
        if (ws > 150) {
          const e = st.size / G, d = e * st.hole, ones = grid.flat().filter(Boolean).length / (G * G), eps = (ones * Math.PI * d * d) / (4 * e * e), fAbs = (C / TAU) * Math.sqrt(eps / (st.D * (0.006 + 0.85 * d)));
          const ax = A.axes(ctx, w, h, { x: { min: 100, max: 10000, log: true, label: 'Frequency (Hz)', ticks: [100, 250, 500, 1000, 2000, 5000, 10000] }, y: { min: 0, max: 1, label: 'Share of the sound' }, pad: { l: xs + 30, r: 12, t: 14, b: 36 } });
          const fs = []; for (let f = 100; f <= 10000; f *= 1.04) fs.push(f);
          const absb = (f) => { const x = f / fAbs - fAbs / f; return Math.min(0.95, 0.9 / (1 + 0.35 * x * x) + (f > fAbs ? 0.35 * ones : 0)); };
          const fS = C / (2 * e), sca = (f) => (1 - absb(f)) * (1 / (1 + Math.pow(fS / 4 / f, 3)));
          A.plotFill(ctx, ax, fs.map((f) => [f, absb(f)]), A.alpha(A.css('c4'), 0.25), 0); A.plotLine(ctx, ax, fs.map((f) => [f, absb(f)]), A.css('c4'), 2.2);
          A.plotLine(ctx, ax, fs.map((f) => [f, sca(f)]), A.css('accent'), 2.2);
          A.text(ctx, 'absorbed', ax.X(fAbs), ax.Y(0.93) - 4, { size: 10, align: 'center', color: A.css('c4'), weight: 700 }); A.text(ctx, 'scattered', ax.X(Math.min(8000, fS)), ax.Y(sca(Math.min(8000, fS))) - 6, { size: 10, align: 'center', color: A.css('accent'), weight: 700 });
        }
      },
    });
    function upd() {
      grid = build(); const G = st.G, e = st.size / G, d = e * st.hole, ones = grid.flat().filter(Boolean).length / (G * G), eps = (ones * Math.PI * d * d) / (4 * e * e), fAbs = (C / TAU) * Math.sqrt(eps / (st.D * (0.006 + 0.85 * d))), fS = C / (2 * e);
      out.innerHTML = A.statBox('Cell / hole size', `${fmt(e * 1000, 1)} / ${fmt(d * 1000, 1)} mm`, `${G} × ${G} cells`) + A.statBox('Cells with a hole', fmt(ones * 100, 0) + ' %', `${grid.flat().filter(Boolean).length} holes to drill`) + A.statBox('Open area', fmt(eps * 100, 1) + ' %', eps < 0.05 ? 'low: mostly a bass/low-mid absorber' : eps > 0.25 ? 'high: nearly transparent' : 'balanced') + A.statBox('Absorbs most around', fmtHz(fAbs), 'set by open area and depth') + A.statBox('Scatters from about', fmtHz(fS / 4) + ' up', `cell = ½ wavelength at ${fmtHz(fS)}`);
      tip.innerHTML = `<div class="callout mentor">Thin (${A.fmtLen(st.D + 0.006)} overall), flat and paintable, so it hides behind fabric or passes as a decorative panel. Use it where you want to <b>absorb the low-mids but keep the highs alive</b> — side walls and ceilings of small rooms. Do not tile many identical copies in the same orientation: rotate or regenerate neighbouring panels so the wall as a whole does not repeat. ${eps > 0.3 ? 'With this much open area the reflective patches are too small to scatter: reduce the hole size.' : ''}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     6. Workbook — practice problems with checked answers
     ====================================================================== */
  const rnd = (a, b, step = 1) => Math.round((a + Math.random() * (b - a)) / step) * step;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const r1 = (x) => Math.round(x * 10) / 10, r2 = (x) => Math.round(x * 100) / 100;
  const TOPICS = {
    addDb: ['Adding decibels', () => { const L = [rnd(70, 95), rnd(70, 95), rnd(70, 95)]; const a = P.dbSum(L); return { q: `Three machines measure ${L[0]} dB, ${L[1]} dB and ${L[2]} dB on their own at your position. What is the level with all three running?`, a, unit: 'dB', abs: 0.5, sol: `Convert each level to relative power, add, convert back: L = 10·log₁₀(10^(${L[0]}/10) + 10^(${L[1]}/10) + 10^(${L[2]}/10)) = <b>${fmt(a, 1)} dB</b>. Check: the answer must be above the loudest (${Math.max(...L)} dB) but by no more than 4.8 dB.` }; }],
    dist: ['Level versus distance', () => { const L1 = rnd(85, 110), r1v = pick([1, 2]), r2v = pick([6, 8, 10, 15, 20, 30, 40]); const a = L1 - 20 * Math.log10(r2v / r1v); return { q: `A loudspeaker outdoors gives ${L1} dB at ${r1v} m. What is the level at ${r2v} m (free field, point source)?`, a, unit: 'dB', abs: 0.5, sol: `L₂ = L₁ − 20·log₁₀(r₂/r₁) = ${L1} − 20·log₁₀(${r2v}/${r1v}) = ${L1} − ${fmt(20 * Math.log10(r2v / r1v), 1)} = <b>${fmt(a, 1)} dB</b>. Check: 6 dB less for every doubling of distance.` }; }],
    wave: ['Wavelength', () => { const f = pick([31.5, 40, 50, 63, 80, 100, 125, 160, 250, 500, 1000, 2000, 4000]); const a = C / f; return { q: `What is the wavelength of a ${f} Hz tone in air (c = 343 m/s)? Answer in metres.`, a, unit: 'm', pct: 3, sol: `λ = c / f = 343 / ${f} = <b>${fmt(a, 3)} m</b>. A quarter of that, ${fmt(a / 4, 3)} m, is the ideal reach of a porous absorber for this tone.` }; }],
    mode: ['First room mode', () => { const L = rnd(3, 9, 0.1); const a = C / (2 * L); return { q: `A room is ${fmt(L, 1)} m long. What is the frequency of its first axial length mode?`, a, unit: 'Hz', pct: 3, sol: `f = c / (2·L) = 343 / (2 × ${fmt(L, 1)}) = <b>${fmt(a, 1)} Hz</b>. The next ones are at 2×, 3× … = ${fmt(2 * a, 1)}, ${fmt(3 * a, 1)} Hz.` }; }],
    schro: ['Schroeder frequency', () => { const V0 = rnd(25, 400, 5), T = rnd(0.2, 1.2, 0.05); const a = 2000 * Math.sqrt(T / V0); return { q: `A room has a volume of ${V0} m³ and a reverberation time of ${fmt(T, 2)} s. Below roughly what frequency do individual room modes dominate?`, a, unit: 'Hz', pct: 3, sol: `f<sub>S</sub> = 2000·√(T / V) = 2000·√(${fmt(T, 2)} / ${V0}) = <b>${fmt(a, 0)} Hz</b>. Bigger or deader rooms push it lower.` }; }],
    sabine: ['Reverberation time (Sabine)', () => { const Lx = rnd(4, 9, 0.5), W = rnd(3, 6, 0.5), H = rnd(2.4, 3.6, 0.1), af = pick([0.05, 0.1, 0.3]), ac = pick([0.05, 0.5, 0.7]), aw = pick([0.03, 0.05, 0.1]); const Sf = Lx * W, Sw = 2 * (Lx + W) * H, V0 = Lx * W * H, Aabs = Sf * af + Sf * ac + Sw * aw, a = (0.161 * V0) / Aabs; return { q: `A room ${fmt(Lx, 1)} × ${fmt(W, 1)} × ${fmt(H, 1)} m has floor α = ${af}, ceiling α = ${ac} and walls α = ${aw}. Estimate RT60 with Sabine’s formula.`, a, unit: 's', pct: 4, sol: `V = ${fmt(V0, 1)} m³. Floor and ceiling ${fmt(Sf, 1)} m² each, walls ${fmt(Sw, 1)} m². A = ${fmt(Sf, 1)}×${af} + ${fmt(Sf, 1)}×${ac} + ${fmt(Sw, 1)}×${aw} = ${fmt(Aabs, 2)} m² sabins. RT = 0.161·V / A = 0.161 × ${fmt(V0, 1)} / ${fmt(Aabs, 2)} = <b>${fmt(a, 2)} s</b>.` }; }],
    need: ['Absorption needed', () => { const V0 = rnd(40, 300, 10), Tn = rnd(0.8, 2.0, 0.1), Tt = rnd(0.3, 0.6, 0.05); const a = 0.161 * V0 * (1 / Tt - 1 / Tn); return { q: `A ${V0} m³ room has RT60 = ${fmt(Tn, 1)} s. How many m² sabins of absorption must be added to reach ${fmt(Tt, 2)} s?`, a, unit: 'm² sabins', pct: 4, sol: `ΔA = 0.161·V·(1/T<sub>target</sub> − 1/T<sub>now</sub>) = 0.161 × ${V0} × (1/${fmt(Tt, 2)} − 1/${fmt(Tn, 1)}) = <b>${fmt(a, 1)} m²</b>. With panels of α = 0.9 that is ${fmt(a / 0.9, 1)} m² of panel.` }; }],
    nrc: ['NRC from four coefficients', () => { const c4 = [rnd(0.1, 0.5, 0.01), rnd(0.4, 0.9, 0.01), rnd(0.7, 1.0, 0.01), rnd(0.7, 1.0, 0.01)]; const avg = (c4[0] + c4[1] + c4[2] + c4[3]) / 4, a = Math.round(avg * 20) / 20; return { q: `A panel has α = ${c4[0].toFixed(2)}, ${c4[1].toFixed(2)}, ${c4[2].toFixed(2)}, ${c4[3].toFixed(2)} at 250, 500, 1 000 and 2 000 Hz. What is its NRC?`, a, unit: '', abs: 0.026, sol: `Average the four: (${c4.map((x) => x.toFixed(2)).join(' + ')}) / 4 = ${avg.toFixed(3)}; round to the nearest 0.05 → <b>NRC ${a.toFixed(2)}</b>. Note that NRC says nothing about 125 Hz and below.` }; }],
    comp: ['Composite wall', () => { const S = rnd(10, 20), TLw = rnd(45, 65), Sd = pick([1.9, 2.0, 2.1]), TLd = rnd(20, 38); const a = P.compositeTL([{ area: S - Sd, tl: TLw }, { area: Sd, tl: TLd }]); return { q: `A ${S} m² wall with TL = ${TLw} dB contains a ${Sd} m² door with TL = ${TLd} dB. What is the TL of the whole wall?`, a, unit: 'dB', abs: 0.5, sol: `Add the transmitted fractions by area: τ = [(${fmt(S - Sd, 1)} × 10^(−${TLw}/10)) + (${Sd} × 10^(−${TLd}/10))] / ${S}; TL = −10·log₁₀ τ = <b>${fmt(a, 1)} dB</b>. The door, not the wall, sets the result.` }; }],
    req: ['Required isolation', () => { const Ls = rnd(90, 115), Lt = rnd(20, 40), sm = pick([3, 5, 8]); const a = Ls - Lt + sm; return { q: `A source produces ${Ls} dB in the studio. The neighbour must receive no more than ${Lt} dB. With a ${sm} dB safety margin, how much isolation is needed?`, a, unit: 'dB', abs: 0.5, sol: `Required = source − allowed + margin = ${Ls} − ${Lt} + ${sm} = <b>${a} dB</b> (check it in every octave band, the bass ones first).` }; }],
    barrier: ['Barrier attenuation', () => { const d = rnd(0.1, 1.5, 0.05), f = pick([125, 250, 500, 1000, 2000]); const Nf = (2 * d * f) / C, a = P.maekawa(d, f); return { q: `A wall between source and listener makes the sound path ${fmt(d, 2)} m longer than the straight line. Estimate the attenuation at ${f} Hz (thin-barrier formula 10·log₁₀(3 + 20N), limited to 24 dB).`, a, unit: 'dB', abs: 0.5, sol: `Fresnel number N = 2·δ·f / c = 2 × ${fmt(d, 2)} × ${f} / 343 = ${fmt(Nf, 2)}. Attenuation = 10·log₁₀(3 + 20 × ${fmt(Nf, 2)}) = <b>${fmt(a, 1)} dB</b>${a >= 24 ? ' (limited to 24 dB)' : ''}. Barriers work far better for high than for low frequencies.` }; }],
    crit: ['Critical distance', () => { const V0 = rnd(200, 5000, 50), T = rnd(0.8, 2.5, 0.1), Q = pick([2, 5, 10]); const a = P.criticalDistance(V0, T, Q); return { q: `A hall of ${V0} m³ has RT60 = ${fmt(T, 1)} s. A loudspeaker has directivity Q = ${Q}. At what distance are direct and reverberant sound equal?`, a, unit: 'm', pct: 3, sol: `D<sub>c</sub> = 0.057·√(Q·V / T) = 0.057 × √(${Q} × ${V0} / ${fmt(T, 1)}) = <b>${fmt(a, 2)} m</b>. Listeners much farther than this hear mostly the room.` }; }],
    flutter: ['Flutter echo', () => { const d = rnd(2.5, 12, 0.1); const a = C / (2 * d); return { q: `Two bare parallel walls are ${fmt(d, 1)} m apart. How many times per second does a clap return (the flutter repeat rate)?`, a, unit: 'Hz', pct: 3, sol: `Each round trip is 2·d = ${fmt(2 * d, 1)} m, taking ${fmt((2 * d / C) * 1000, 1)} ms. Rate = c / (2·d) = 343 / ${fmt(2 * d, 1)} = <b>${fmt(a, 1)} per second</b>.` }; }],
    defl: ['Static deflection', () => { const fn = rnd(5, 20, 0.5); const a = Math.pow(15.8 / fn, 2); return { q: `A floating floor should have a natural frequency of ${fmt(fn, 1)} Hz. What static deflection (in mm) must its isolators have under load?`, a, unit: 'mm', pct: 4, sol: `f<sub>n</sub> ≈ 15.8 / √d → d = (15.8 / f<sub>n</sub>)² = (15.8 / ${fmt(fn, 1)})² = <b>${fmt(a, 2)} mm</b>. Isolation begins above √2 × ${fmt(fn, 1)} = ${fmt(fn * Math.SQRT2, 1)} Hz.` }; }],
    duct: ['Duct velocity', () => { const Q = rnd(100, 1500, 50), dmm = pick([150, 200, 250, 300, 400]); const Aa = (Math.PI * Math.pow(dmm / 1000, 2)) / 4, a = Q / 3600 / Aa; return { q: `${Q} m³/h of air flows through a round duct of ${dmm} mm diameter. What is the air velocity?`, a, unit: 'm/s', pct: 3, sol: `Area = π·d²/4 = ${fmt(Aa, 4)} m². Flow = ${Q}/3600 = ${fmt(Q / 3600, 4)} m³/s. v = Q / A = <b>${fmt(a, 2)} m/s</b>. Studio targets: under 3 m/s in main ducts, under 1.5–2 m/s at grilles.` }; }],
    delay: ['Delay for a loudspeaker', () => { const d = rnd(8, 60); const a = (d / C) * 1000; return { q: `A delay loudspeaker stands ${d} m in front of the main system. What delay (in ms) aligns it with the sound arriving from the main speakers?`, a, unit: 'ms', pct: 3, sol: `t = d / c = ${d} / 343 = <b>${fmt(a, 1)} ms</b>. In practice add about 10 ms more so the main system is heard first and the image stays on stage.` }; }],
  };
  V.WORKBOOK_TOPICS = TOPICS;
  V.workbook = function (host) {
    let score = A.store.get('workbook', {}), topic = 'addDb', prob = null, shown = false;
    const top = el('div', { class: 'row', style: { alignItems: 'center', flexWrap: 'wrap' } });
    const sel = el('select'); Object.entries(TOPICS).forEach(([k, v]) => sel.appendChild(el('option', { value: k }, v[0]))); sel.onchange = () => { topic = sel.value; gen(); };
    const sc = el('span', { class: 'small' }); top.append(sel, sc); host.appendChild(top);
    const box = el('div', { class: 'card', style: { background: 'var(--panel2)', marginTop: '10px' } }); host.appendChild(box);
    const ok = (x) => prob && (prob.abs != null ? Math.abs(x - prob.a) <= prob.abs : Math.abs(x - prob.a) <= Math.abs(prob.a) * (prob.pct / 100));
    function gen() { prob = TOPICS[topic][1](); V._wbLast = prob; shown = false; draw(null); }
    function draw(res) {
      const s = score[topic] || [0, 0], all = Object.values(score).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
      sc.innerHTML = `This topic: <b>${s[0]}/${s[1]}</b> · all topics: <b>${all[0]}/${all[1]}</b>`;
      box.innerHTML = `<div class="eyebrow small accent" style="text-transform:uppercase;letter-spacing:.12em;font-weight:700">${TOPICS[topic][0]}</div><p style="font-size:1.05rem;margin:.4em 0 .8em">${prob.q}</p>
        <div class="row" style="align-items:center;flex-wrap:wrap"><input type="number" step="any" class="wb-in" placeholder="Your answer" style="max-width:160px"> <span>${prob.unit}</span><button class="primary wb-check">Check</button><button class="wb-show">Show worked solution</button><button class="wb-new">New problem</button></div>
        <div class="wb-res" style="margin-top:10px">${res == null ? '' : res ? `<div class="callout mentor"><b>Correct.</b> The exact value is ${fmt(prob.a, 2)} ${prob.unit}.</div>` : `<div class="callout warn">Not quite — try again, or look at the worked solution. Tolerance: ${prob.abs != null ? '± ' + prob.abs + ' ' + prob.unit : '± ' + prob.pct + ' %'}.</div>`}</div>
        ${shown ? `<div class="callout physics wb-sol">${prob.sol}</div>` : ''}`;
    }
    box.addEventListener('click', (e) => {
      if (e.target.closest('.wb-check')) { const v = parseFloat(box.querySelector('.wb-in').value); if (isNaN(v)) return; const good = ok(v); const s = score[topic] || [0, 0]; if (!prob.done) { s[1]++; if (good) s[0]++; score[topic] = s; A.store.set('workbook', score); prob.done = true; } const keep = box.querySelector('.wb-in').value; draw(good); box.querySelector('.wb-in').value = keep; }
      else if (e.target.closest('.wb-show')) { shown = true; const keep = box.querySelector('.wb-in').value; draw(null); box.querySelector('.wb-in').value = keep; }
      else if (e.target.closest('.wb-new')) gen();
    });
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList.contains('wb-in')) box.querySelector('.wb-check').click(); });
    gen();
  };
})();
