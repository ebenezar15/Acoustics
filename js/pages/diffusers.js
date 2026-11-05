/* Diffuser Designer: QRD, PRD, 2-D skyline — depths, cut lists, polar response, diffusion coefficient. */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const PRIMES = [5, 7, 11, 13, 17, 19, 23];

  A.register('diffusers', {
    title: 'Diffuser Designer',
    render(root) {
      A.pageHead(root, 'Design', 'Diffuser Designer', 'Schroeder number-theory diffusers. Choose the sequence, prime N, design frequency and well width; get exact depths, a cut list, a drawing and the predicted scattering pattern compared with a flat panel.');
      const card = el('div', { class: 'card' }); root.appendChild(card);
      const st = A.controls(card, [
        { key: 'type', label: 'Type', type: 'select', value: 'qrd', options: [['qrd', '1-D Quadratic residue (QRD)'], ['prd', '1-D Primitive root (PRD)'], ['sky', '2-D Skyline (QRD product)']] },
        { key: 'N', label: 'Prime N', type: 'select', value: 7, numeric: true, options: PRIMES.map((p) => [p, String(p)]) },
        { key: 'f0', label: 'Design (lowest) frequency', type: 'range', min: 250, max: 2000, step: 10, value: 500, unit: 'Hz' },
        { key: 'w', label: 'Well width', type: 'range', min: 20, max: 150, step: 1, value: 50, unit: 'mm' },
        { key: 'fin', label: 'Fin thickness', type: 'range', min: 3, max: 15, step: 1, value: 6, unit: 'mm' },
        { key: 'back', label: 'Back panel thickness', type: 'range', min: 6, max: 25, step: 1, value: 12, unit: 'mm' },
        { key: 'periods', label: 'Periods side by side', type: 'range', min: 1, max: 6, step: 1, value: 2 },
        { key: 'len', label: 'Panel height (1-D)', type: 'range', min: 300, max: 2400, step: 50, value: 1200, unit: 'mm' },
        { key: 'fp', label: 'Show polar at', type: 'range', min: Math.log10(200), max: Math.log10(8000), step: 0.01, value: Math.log10(1000), fmt: (v) => fmtHz(Math.pow(10, v)) },
      ], () => upd());
      const stats = el('div', { class: 'stats' }); card.appendChild(stats);
      const grid = el('div', { class: 'grid g2' }); root.appendChild(grid);
      const drawCard = el('div', { class: 'card' }); const polarCard = el('div', { class: 'card' });
      grid.append(drawCard, polarCard);
      drawCard.appendChild(html('<h3 style="margin-top:0">Profile / layout</h3>'));
      polarCard.appendChild(html('<h3 style="margin-top:0">Scattered energy (polar)</h3>'));
      const cutCard = el('div', { class: 'card' }); root.appendChild(cutCard);
      const coefCard = el('div', { class: 'card' }); root.appendChild(coefCard);
      coefCard.appendChild(html('<h3 style="margin-top:0">Diffusion coefficient vs frequency</h3><p class="small">Normal-incidence, far-field estimate (1 = perfectly uniform scattering). Compare with a flat panel of the same width. Notice the working band between the design frequency and the well-width limit.</p>'));

      function seq() {
        const N = st.N;
        if (st.type === 'prd') { const g = P.primitiveRoots(N)[0]; return { s: P.prdSequence(N, g), g }; }
        return { s: P.qrdSequence(N) };
      }
      function depths() { const { s } = seq(); return P.wellDepths(s, st.N, st.f0); }

      const prof = A.canvas(drawCard, {
        height: 260,
        draw(ctx, w, h) {
          const d = depths();
          if (st.type === 'sky') {
            const g = P.skylineGrid(st.N), mx = st.N - 1;
            const cell = Math.min((w - 40) / st.N, (h - 40) / st.N), ox = (w - cell * st.N) / 2, oy = 20;
            g.forEach((row, i) => row.forEach((v, j) => {
              const t = v / mx;
              ctx.fillStyle = A.alpha(A.css('accent'), 0.15 + 0.85 * t);
              ctx.fillRect(ox + j * cell, oy + i * cell, cell - 1, cell - 1);
              if (cell > 18) A.text(ctx, String(v), ox + j * cell + cell / 2, oy + i * cell + cell / 2 + 4, { align: 'center', size: 10, color: A.css('text') });
            }));
            A.text(ctx, 'Block heights in units (darker = taller)', w / 2, h - 4, { align: 'center', size: 11, color: A.css('muted') });
            return;
          }
          const maxD = Math.max(...d) + st.back / 1000;
          const total = d.length * st.periods;
          const sc = Math.min((w - 40) / (total * (st.w + st.fin) / 1000), (h - 60) / maxD);
          const ox = 20, oy = 30;
          ctx.fillStyle = A.css('muted');
          const bx = total * (st.w + st.fin) / 1000 * sc;
          ctx.fillRect(ox, oy + maxD * sc - (st.back / 1000) * sc, bx, (st.back / 1000) * sc);
          for (let n = 0; n < total; n++) {
            const dn = d[n % d.length];
            const x = ox + n * ((st.w + st.fin) / 1000) * sc;
            // well bottom (filled from back up to depth)
            const fill = (Math.max(...d) - dn) * sc;
            ctx.fillStyle = A.alpha(A.css('accent'), 0.65);
            ctx.fillRect(x + (st.fin / 1000) * sc, oy + (Math.max(...d) - Math.max(...d)) * sc + (maxD - st.back / 1000) * sc - fill, (st.w / 1000) * sc, fill);
            ctx.fillStyle = A.css('text');
            ctx.fillRect(x, oy, Math.max(1, (st.fin / 1000) * sc), maxD * sc);
          }
          ctx.fillStyle = A.css('text'); ctx.fillRect(ox + bx, oy, Math.max(1, (st.fin / 1000) * sc), maxD * sc);
          A.text(ctx, 'Sound arrives from the top ↓  (section view)', ox, 16, { size: 11, color: A.css('muted') });
        },
      });
      const polar = A.canvas(polarCard, {
        height: 300,
        draw(ctx, w, h) {
          const f = Math.pow(10, st.fp);
          const d = st.type === 'sky' ? P.wellDepths(P.qrdSequence(st.N), st.N, st.f0) : depths();
          const ww = (st.w + st.fin) / 1000;
          const dp = P.diffuserPolar(d, ww, f, st.periods);
          const flat = P.diffuserPolar(d.map(() => 0), ww, f, st.periods);
          const cx = w / 2, cy = h - 24, R = Math.min(w / 2 - 20, h - 50);
          ctx.strokeStyle = A.css('line');
          [-30, -20, -10, 0].forEach((db) => { const r = R * (1 + db / 40); ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke(); A.text(ctx, db + ' dB', cx + 4, cy - r + 12, { size: 9, color: A.css('muted') }); });
          [-60, -30, 0, 30, 60].forEach((a) => { const t = (a * Math.PI) / 180; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t) * R, cy - Math.cos(t) * R); ctx.stroke(); });
          const plot = (pts, col, lw, dash) => {
            ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.beginPath();
            pts.forEach((p, i) => { const r = R * Math.max(0, 1 + p.db / 40); const x = cx + Math.sin(p.th) * r, y = cy - Math.cos(p.th) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
            ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
          };
          plot(flat, A.css('muted'), 1.5, [5, 4]);
          plot(dp, A.css('accent'), 2.5);
          A.text(ctx, `${fmtHz(f)} — diffuser d = ${fmt(P.diffusionCoeff(dp), 2)}, flat d = ${fmt(P.diffusionCoeff(flat), 2)}`, 10, 16, { size: 12, weight: 700 });
        },
      });
      polarCard.appendChild(A.legend([[A.css('accent'), 'Diffuser'], [A.css('muted'), 'Flat panel, same size', true]]));
      const coef = A.canvas(coefCard, {
        height: 240,
        draw(ctx, w, h) {
          const d = st.type === 'sky' ? P.wellDepths(P.qrdSequence(st.N), st.N, st.f0) : depths();
          const ww = (st.w + st.fin) / 1000;
          const ax = A.axes(ctx, w, h, { x: { min: 100, max: 10000, log: true, label: 'Frequency (Hz)' }, y: { min: 0, max: 1, label: 'Diffusion coefficient', ticks: [0, 0.2, 0.4, 0.6, 0.8, 1] } });
          const a = [], b = [];
          for (let f = 100; f <= 10000; f *= 1.06) { a.push([f, P.diffusionCoeff(P.diffuserPolar(d, ww, f, st.periods, P.C, 91))]); b.push([f, P.diffusionCoeff(P.diffuserPolar(d.map(() => 0), ww, f, st.periods, P.C, 91))]); }
          ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.X(st.f0), ax.y1, ax.X(Math.min(10000, P.diffuserFmax(st.w / 1000))) - ax.X(st.f0), ax.y0 - ax.y1);
          A.plotLine(ctx, ax, b, A.css('muted'), 1.5, [5, 4]);
          A.plotLine(ctx, ax, a, A.css('accent'), 2.5);
          if (st.type !== 'sky') P.flatPlateFreqs(st.N, st.f0, 10000).forEach((fp) => { ctx.strokeStyle = A.css('bad'); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(fp), ax.y1); ctx.lineTo(ax.X(fp), ax.y0); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, 'flat plate ' + A.shortHz(fp), ax.X(fp) + 3, ax.y1 + 12, { size: 10, color: A.css('bad') }); });
        },
      });

      function upd() {
        const d = depths();
        const { g } = seq();
        const fmax = P.diffuserFmax(st.w / 1000);
        const maxD = Math.max(...d);
        const widthP = (d.length * (st.w + st.fin) + st.fin) / 1000;
        stats.innerHTML = A.statBox('Working band', `${fmtHz(st.f0)} – ${fmtHz(fmax)}`, fmax <= st.f0 * 2 ? 'Narrow: make wells narrower or lower f₀' : 'design f₀ → c/2w') +
          A.statBox('Max well depth', fmt(maxD * 1000, 0) + ' mm', `plus ${st.back} mm back`) +
          A.statBox('Period width', fmt(widthP * 1000, 0) + ' mm', `${st.type === 'sky' ? st.N + '×' + st.N + ' blocks' : d.length + ' wells'}`) +
          A.statBox('Sit at least', fmt(Math.max(2, (3 * P.C) / st.f0 / 2), 1) + ' m away', 'far-field guideline') +
          (st.type === 'prd' ? A.statBox('Primitive root g', g) : '') +
          (st.type !== 'sky' ? A.statBox('Flat-plate frequencies', P.flatPlateFreqs(st.N, st.f0, 20000).slice(0, 3).map(fmtHz).join(', ') || '—', 'all wells ≡ λ/2 multiples → reflects like a flat panel', 'warn') : '') +
          A.statBox('Grating lobes @ ' + fmtHz(Math.pow(10, st.fp)), P.gratingLobes(widthP, Math.pow(10, st.fp)).length, 'more lobes = more even scattering; few periods = lumpy');
        cutCard.innerHTML = '';
        if (st.type === 'sky') {
          const g2 = P.skylineGrid(st.N), unit = (P.C / (2 * st.N * st.f0)) * 1000;
          const counts = {}; g2.flat().forEach((v) => (counts[v] = (counts[v] || 0) + 1));
          cutCard.appendChild(html(`<h3 style="margin-top:0">Cut list — 2-D skyline</h3><p class="small">Blocks ${st.w} × ${st.w} mm. Height unit = ${fmt(unit, 1)} mm (from c / (2·N·f₀)). Glue on a ${st.back} mm backing board ${st.N * st.w} × ${st.N * st.w} mm. Height-0 cells are left empty.</p>
            <div class="table-wrap"><table><tr><th>Height index</th><th class="num">Block height</th><th class="num">Quantity per tile</th><th class="num">× ${st.periods ** 2} tiles</th></tr>${Object.keys(counts).sort((a, b) => a - b).map((k) => `<tr><td>${k}</td><td class="num">${fmt(k * unit, 0)} mm</td><td class="num">${counts[k]}</td><td class="num">${counts[k] * st.periods ** 2}</td></tr>`).join('')}</table></div>
            <p class="small">Total timber length ≈ ${fmt((Object.entries(counts).reduce((s, [k, c]) => s + k * unit * c, 0) * st.periods ** 2) / 1000, 1)} m of ${st.w} × ${st.w} mm stock (excluding saw kerf).</p>`));
        } else {
          cutCard.appendChild(html(`<h3 style="margin-top:0">Cut list — ${st.type.toUpperCase()} N = ${st.N}</h3><p class="small">Wells ${st.w} mm wide separated by ${st.fin} mm fins, panel height ${st.len} mm. Depth measured from the front face of the fins to the well bottom. Overall depth ${fmt(maxD * 1000 + st.back, 0)} mm.</p>
            <div class="table-wrap"><table><tr><th>Well</th><th class="num">Sequence</th><th class="num">Depth</th><th class="num">Filler block height (from back)</th></tr>${d.map((x, i) => `<tr><td>${i + 1}</td><td class="num">${seq().s[i]}</td><td class="num">${fmt(x * 1000, 1)} mm</td><td class="num">${fmt((maxD - x) * 1000, 1)} mm</td></tr>`).join('')}</table></div>
            <ul class="small"><li>Fins: ${d.length * st.periods + 1} pcs × ${st.len} × ${fmt(maxD * 1000, 0)} mm (${st.fin} mm stock)</li><li>Back: 1 pc × ${st.len} × ${fmt((d.length * (st.w + st.fin) * st.periods + st.fin), 0)} mm</li><li>Filler blocks per period as listed (× ${st.periods})</li><li>See <a href="#/workshop/qrd">Workshop → QRD</a></li></ul>`));
        }
        prof.redraw(); polar.redraw(); coef.redraw();
      }
      upd();
      root.appendChild(html(`<div class="callout mentor">Diffusers keep a room alive without the comb filtering of a flat reflector — but only above their design frequency and only when you are far enough away. In a small room, a diffuser 60 cm behind your head is just a lumpy reflector. Use absorption there, and save diffusion for walls ≥ 2–3 m away.</div>`));
    },
  });
})();
