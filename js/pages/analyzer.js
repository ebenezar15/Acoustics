/* Room Analyzer: modes, Bonello, RT per band, modal bass response at the seat,
   seat-quality map, reflection points and an auto-generated treatment plan. */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const SURF = [['floor', 'Floor'], ['ceiling', 'Ceiling'], ['front', 'Front wall (speakers)'], ['back', 'Rear wall'], ['left', 'Left wall'], ['right', 'Right wall']];
  const DEFAULT = {
    L: 5.2, W: 3.9, H: 2.4, type: 'home-studio',
    surf: { floor: 'floor-parquet', ceiling: 'gypsum-stud', front: 'gypsum-stud', back: 'gypsum-stud', left: 'gypsum-stud', right: 'gypsum-stud' },
    items: [{ mat: 'sofa', area: 1.5 }, { mat: 'rug', area: 4 }],
    lx: 0.38, ly: 0.5, lz: 1.2, sd: 0.6, spread: 1.6, sz: 1.2, sub: false,
  };

  function surfaces(s) {
    return { floor: s.L * s.W, ceiling: s.L * s.W, front: s.W * s.H, back: s.W * s.H, left: s.L * s.H, right: s.L * s.H };
  }
  /** absorption per band; returns {A:[6], S, alphaBar:[6], parts:[{name, A:[6]}]} */
  function absorption(s) {
    const areas = surfaces(s);
    const S = Object.values(areas).reduce((a, b) => a + b, 0);
    const parts = [];
    let Atot = [0, 0, 0, 0, 0, 0];
    const wallAvg = [0, 0, 0, 0, 0, 0];
    SURF.forEach(([k, n]) => {
      const m = D.mat(s.surf[k]);
      const a = m.a.map((x) => Math.min(x, 1) * areas[k]);
      parts.push({ name: n + ' — ' + m.name, A: a });
      a.forEach((v, i) => { Atot[i] += v; wallAvg[i] += v / S; });
    });
    (s.items || []).forEach((it) => {
      const m = D.mat(it.mat);
      const a = m.a.map((x, i) => it.area * (Math.min(x, 1) - wallAvg[i]));
      parts.push({ name: `${m.name} (${fmt(it.area, 1)} m²)`, A: m.a.map((x) => Math.min(x, 1) * it.area) });
      a.forEach((v, i) => (Atot[i] += v));
    });
    Atot = Atot.map((v) => Math.max(v, 0.5));
    return { A: Atot, S, alphaBar: Atot.map((v) => Math.min(0.95, v / S)), parts };
  }
  function rt(s) {
    const V = s.L * s.W * s.H;
    const ab = absorption(s);
    const sab = P.BANDS6.map((f, i) => P.sabineWithAir(V, ab.A[i], P.AIR_M[f]));
    const eyr = P.BANDS6.map((f, i) => P.eyring(V, ab.S, ab.alphaBar[i], P.AIR_M[f]));
    return { V, sab, eyr, ab };
  }
  function roomType(s) { return D.ROOM_TYPES.find((r) => r.id === s.type) || D.ROOM_TYPES[0]; }
  function target(s) {
    const t = roomType(s), V = s.L * s.W * s.H;
    const [lo, hi] = t.rt(V);
    // allow LF rise: studios small, halls more (bass ratio)
    return P.BANDS6.map((f) => {
      const k = f <= 125 ? (t.flat ? 1.25 : 1.3) : f <= 250 ? (t.flat ? 1.1 : 1.15) : f >= 4000 ? 0.9 : 1;
      return [lo * (f >= 4000 ? 0.85 : 1), hi * k];
    });
  }
  function positions(s) {
    const spk = [[s.sd, s.W / 2 - s.spread / 2, s.sz], [s.sd, s.W / 2 + s.spread / 2, s.sz]];
    const rcv = [s.lx * s.L, s.ly * s.W, s.lz];
    return { spk, rcv };
  }

  /* ---------------- recommendation engine ---------------- */
  function advise(s, R, modes) {
    const out = [];
    const add = (lvl, title, text) => out.push({ lvl, title, text });
    const V = R.V, t = roomType(s), tg = target(s);
    const dims = [s.L, s.W, s.H];
    // ratios
    const h = Math.min(...dims);
    const rat = dims.map((d) => d / h).sort((a, b) => a - b).map((x) => fmt(x, 2)).join(' : ');
    if (P.boltOK(s.L, s.W, s.H)) add('good', 'Room proportions are in the Bolt area', `Ratio ${rat}. Modes should be reasonably well distributed.`);
    else add('warn', 'Room proportions are outside the Bolt area', `Ratio ${rat}. Expect clustered modes and gaps. Positioning and bass trapping become more important. If you are building, consider changing a dimension by 10–20 %.`);
    const sameish = (a, b) => Math.abs(a / b - Math.round(a / b)) < 0.06 || Math.abs(b / a - Math.round(b / a)) < 0.06;
    if (sameish(s.L, s.W) || sameish(s.L, s.H) || sameish(s.W, s.H)) add('bad', 'Two dimensions are equal or simple multiples', 'Their axial modes stack on the same frequencies, creating strong peaks and big gaps. Prioritise thick corner bass traps and careful seat placement.');
    const bon = P.bonello(modes);
    if (bon.issues.length) add('warn', 'Bonello criterion issues', bon.issues.slice(0, 4).map((i) => i.msg).join(' · '));
    const fs = P.schroeder(R.eyr[1], V);
    add('info', `Schroeder frequency ≈ ${fmt(fs, 0)} Hz`, `Below this, treat bass as modes (position, traps, multiple subs). Above it, think reflections and decay.${V < 40 ? ' Small rooms have a high Schroeder frequency — bass problems will extend well into the low-mids.' : ''}`);
    // listener position
    const lp = s.lx;
    if (Math.abs(lp - 0.5) < 0.05) add('bad', 'Listener is near the centre of the room length', 'The first length mode has a null here — deep bass will vanish at your seat. Move toward 38 % or 62 % of the length.');
    else if (Math.abs(lp - 0.25) < 0.04 || Math.abs(lp - 0.75) < 0.04) add('warn', 'Listener near ¼ / ¾ of the length', 'This is a null of the 2nd length mode. Try 0.33–0.42 of the length and measure.');
    else if (lp > 0.85) add('warn', 'Listener close to the rear wall', 'All modes peak at the rear wall — bass will be exaggerated. Bring the seat forward or add very deep rear-wall absorption.');
    else add('good', 'Listening position avoids the strongest axial nulls', `Seat at ${fmt(lp * 100, 0)} % of the length (${fmt(lp * s.L, 2)} m from the front wall).`);
    if (Math.abs(s.ly - 0.5) > 0.03) add('warn', 'Seat is off the room’s centre line', 'Symmetry is essential for stereo imaging. Centre the listening position across the width.');
    // SBIR
    const nf = P.sbirNull(s.sd);
    if (nf > 60 && nf < 300) add('warn', `Front-wall SBIR null ≈ ${fmt(nf, 0)} Hz`, `Speakers ${fmt(s.sd, 2)} m from the front wall. Options: soffit-mount, move them to ≤ 0.3 m (null ≥ ${fmt(P.sbirNull(0.3), 0)} Hz), or ≥ 1.5 m with deep absorption behind.`);
    const side = s.W / 2 - s.spread / 2;
    if (Math.abs(side - s.sd) / s.sd < 0.15) add('warn', 'Speaker–front wall and speaker–side wall distances are similar', 'Their SBIR nulls coincide and deepen. Make them differ by at least 30 %.');
    const floorNull = P.sbirNull(s.sz);
    add('info', `Floor-bounce null ≈ ${fmt(floorNull, 0)} Hz`, 'A rug between the speakers and listener helps above ~500 Hz; below that, it is set by woofer height.');
    // geometry
    const dist = Math.hypot(s.lx * s.L - s.sd, s.spread / 2);
    const Dc = P.criticalDistance(V, R.eyr[2], 2);
    add(dist <= Dc * 1.3 ? 'good' : 'warn', `Listening distance ${fmt(dist, 2)} m vs critical distance ${fmt(Dc, 2)} m`, dist <= Dc * 1.3 ? 'Direct sound dominates at the seat — good for accurate monitoring.' : 'Reverberant sound dominates; shorten the distance or add absorption.');
    if (s.H < 2.4) add('warn', 'Low ceiling', 'The ceiling reflection arrives early and strong. A cloud above the listening position is essential.');
    // RT
    const lowBad = [], highDead = [];
    P.BANDS6.forEach((f, i) => { if (R.eyr[i] > tg[i][1] * 1.05) lowBad.push(f); if (R.eyr[i] < tg[i][0] * 0.9) highDead.push(f); });
    if (lowBad.length) add('bad', 'Decay too long in: ' + lowBad.map((f) => A.shortHz(f)).join(', ') + ' Hz', `Target ${fmt(tg[2][0], 2)}–${fmt(tg[2][1], 2)} s for a ${t.name.toLowerCase()}. See the Treatment plan tab for quantities.`);
    if (highDead.length) add('warn', 'Over-absorbed in: ' + highDead.map((f) => A.shortHz(f)).join(', ') + ' Hz', 'Too much thin absorption makes the room dull. Replace thin foam/curtains with thicker broadband panels, or add diffusion/reflective surfaces.');
    if (!lowBad.length && !highDead.length) add('good', 'Reverberation within target in all bands', t.note);
    const ratioLH = R.eyr[0] / R.eyr[3];
    if (ratioLH > 1.6) add('warn', 'Bass decays much longer than mids', `RT125/RT1k = ${fmt(ratioLH, 2)}. Classic sign of thin absorbers without bass traps.`);
    return out;
  }

  /* ---------------- treatment plan ---------------- */
  function plan(s, R) {
    const V = R.V, tg = target(s);
    const need = P.BANDS6.map((f, i) => Math.max(0, (0.161 * V) / ((tg[i][0] + tg[i][1]) / 2) - R.ab.A[i] - 4 * P.AIR_M[f] * V));
    const items = [];
    const cornerFace = 0.85 * s.H; // superchunk face area per vertical corner
    const nCorner = Math.min(4, Math.max(need[0] > 0.5 ? Math.ceil(need[0] / (cornerFace * 0.9)) : 0, need[0] > 0 ? 2 : 0));
    if (nCorner) items.push({ mat: 'bass-trap-corner', area: +(nCorner * cornerFace).toFixed(1), what: `${nCorner} floor-to-ceiling corner bass traps (≈ 600 mm superchunks)`, where: nCorner >= 4 ? 'All four vertical corners' : 'Front corners first, then rear' });
    const extraLF = Math.max(0, need[0] - nCorner * cornerFace * 0.9);
    if (extraLF > 1) items.push({ mat: 'membrane', area: +(extraLF / 0.6).toFixed(1), what: `≈ ${fmt(extraLF / 0.6, 1)} m² of membrane/tuned bass traps or wall–ceiling corner traps`, where: 'Wall–ceiling corners, rear wall, or tuned to the worst measured mode' });
    const side = Math.min(2 * 2 * 0.72, Math.max(1.44, need[3] * 0.3));
    items.push({ mat: 'mw-100-gap', area: +side.toFixed(1), what: '4 broadband panels 600×1200×100 mm + 100 mm air gap', where: 'Side-wall first reflection points (2 per side, mirror trick)' });
    items.push({ mat: 'cloud-100', area: 2.2, what: 'Ceiling cloud 1.2 × 1.8 m, 100 mm, hung 200 mm down', where: 'Above the listening position, covering both speakers’ ceiling reflections' });
    items.push({ mat: 'mw-100-gap', area: +(Math.min(s.W * 1.2, 3)).toFixed(1), what: 'Front-wall absorption behind/between speakers', where: 'Front wall, ear height ± 0.6 m' });
    const rearDist = s.L - s.lx * s.L;
    if (rearDist >= 3) items.push({ mat: 'qrd', area: +(Math.min(s.W * 1.2, 4)).toFixed(1), what: 'Rear-wall diffusion (QRD/skyline) over thick absorption', where: `Rear wall (you are ${fmt(rearDist, 1)} m away — enough for diffusion)` });
    else items.push({ mat: 'mw-100-gap', area: +(Math.min(s.W * 1.4, 5)).toFixed(1), what: '200–300 mm deep rear-wall absorption', where: `Rear wall (${fmt(rearDist, 1)} m away — too close for effective diffusion)` });
    return { need, items };
  }

  /* ---------------- page ---------------- */
  A.register('analyzer', {
    title: 'Room Analyzer',
    render(root) {
      A.pageHead(root, 'Analyse', 'Room Analyzer', 'Enter your room and its surfaces. You get the modal map, predicted bass response at your seat, a seat-quality map, reverberation per band against targets, reflection points, a diagnosis and a quantified treatment plan.');
      const s = Object.assign({}, DEFAULT, A.store.get('analyzer', {}));
      s.surf = Object.assign({}, DEFAULT.surf, s.surf);
      s.items = (s.items || []).slice();
      const save = () => A.store.set('analyzer', s);

      const top = el('div', { class: 'grid g2' });
      root.appendChild(top);
      const inCard = el('div', { class: 'card' });
      top.appendChild(inCard);
      const sumCard = el('div', { class: 'card' });
      top.appendChild(sumCard);

      inCard.appendChild(html('<h3 style="margin-top:0">Room</h3>'));
      const roomCtl = A.controls(inCard, [
        { key: 'L', label: 'Length (front → back)', type: 'number', value: s.L, unit: 'm', step: 0.05 },
        { key: 'W', label: 'Width', type: 'number', value: s.W, unit: 'm', step: 0.05 },
        { key: 'H', label: 'Height', type: 'number', value: s.H, unit: 'm', step: 0.05 },
        { key: 'type', label: 'Room use', type: 'select', value: s.type, options: D.ROOM_TYPES.map((r) => [r.id, r.name]) },
      ], (v) => { Object.assign(s, { L: Math.max(1, v.L), W: Math.max(1, v.W), H: Math.max(1.5, v.H), type: v.type }); refresh(); });
      const presets = el('div', { class: 'row', style: { marginBottom: '8px' } });
      [['Bedroom 3.6×3.0×2.4', [3.6, 3.0, 2.4]], ['Square 3×3×2.4', [3, 3, 2.4]], ['Garage 6×3.5×2.6', [6, 3.5, 2.6]], ['Control 6.4×5×3', [6.4, 5, 3]], ['Booth 1.8×1.5×2.4', [1.8, 1.5, 2.4]]].forEach(([n, d]) => {
        const b = el('button', { class: 'small' }, n);
        b.onclick = () => { roomCtl.set('L', d[0], true); roomCtl.set('W', d[1], true); roomCtl.set('H', d[2]); };
        presets.appendChild(b);
      });
      inCard.appendChild(presets);

      inCard.appendChild(html('<h3>Surfaces</h3>'));
      const matOpts = D.MATERIALS.map((m) => [m.id, `${m.cat}: ${m.name}`]);
      A.controls(inCard, SURF.map(([k, n]) => ({ key: k, label: n, type: 'select', value: s.surf[k], options: matOpts })), (v) => { SURF.forEach(([k]) => (s.surf[k] = v[k])); refresh(); });

      inCard.appendChild(html('<h3>Treatment, furniture & people <small class="muted">(added on top of surfaces)</small></h3>'));
      const itemsBox = el('div');
      inCard.appendChild(itemsBox);
      const addRow = el('div', { class: 'row', style: { marginTop: '8px' } });
      const addSel = el('select', { style: { flex: '1', minWidth: '200px' } });
      matOpts.forEach(([v, l]) => addSel.appendChild(el('option', { value: v }, l)));
      addSel.value = 'mw-100-gap';
      const addArea = el('input', { type: 'number', value: 2, step: 0.1, style: { width: '90px' } });
      const addBtn = el('button', { class: 'primary small' }, '+ Add');
      addBtn.onclick = () => { s.items.push({ mat: addSel.value, area: parseFloat(addArea.value) || 1 }); refresh(); };
      addRow.append(addSel, addArea, el('span', { class: 'small' }, 'm²'), addBtn);
      inCard.appendChild(addRow);
      function renderItems() {
        itemsBox.innerHTML = '';
        if (!s.items.length) itemsBox.appendChild(html('<div class="small">No items yet.</div>'));
        s.items.forEach((it, i) => {
          const r = el('div', { class: 'row', style: { justifyContent: 'space-between', borderBottom: '1px solid var(--line)', padding: '4px 0' } });
          r.appendChild(el('span', { class: 'small' }, `${D.mat(it.mat).name} — ${fmt(it.area, 1)} m²`));
          const x = el('button', { class: 'small ghost' }, '✕');
          x.onclick = () => { s.items.splice(i, 1); refresh(); };
          r.appendChild(x);
          itemsBox.appendChild(r);
        });
      }

      inCard.appendChild(html('<h3>Positions</h3>'));
      A.controls(inCard, [
        { key: 'lx', label: 'Listener from front wall', type: 'range', min: 0.15, max: 0.9, step: 0.01, value: s.lx, fmt: (v) => fmt(v * 100, 0) + ' %' },
        { key: 'ly', label: 'Listener across width', type: 'range', min: 0.1, max: 0.9, step: 0.01, value: s.ly, fmt: (v) => fmt(v * 100, 0) + ' %' },
        { key: 'lz', label: 'Ear height', type: 'range', min: 0.8, max: 1.8, step: 0.05, value: s.lz, unit: 'm' },
        { key: 'sd', label: 'Speakers from front wall', type: 'range', min: 0.1, max: 2, step: 0.01, value: s.sd, unit: 'm' },
        { key: 'spread', label: 'Speaker spacing', type: 'range', min: 0.8, max: 3.5, step: 0.05, value: s.spread, unit: 'm' },
        { key: 'sz', label: 'Woofer height', type: 'range', min: 0.3, max: 1.8, step: 0.05, value: s.sz, unit: 'm' },
      ], (v) => { Object.assign(s, v); refresh(); }, 'ctrl-grid');

      // tabs for outputs
      const out = el('div');
      root.appendChild(out);
      let current = 'overview';
      const views = {};
      A.tabs(out, [['overview', 'Diagnosis'], ['modes', 'Room modes'], ['bass', 'Bass at the seat'], ['rt', 'Reverberation'], ['plan', 'Plan view & reflections'], ['treat', 'Treatment plan']], (id, body) => { current = id; views.body = body; drawView(); });

      function refresh() {
        s.spread = Math.min(s.spread, s.W - 0.4);
        save(); renderItems(); summary(); drawView();
      }
      function summary() {
        const R = rt(s), V = R.V;
        const t = roomType(s);
        const tg = target(s);
        sumCard.innerHTML = '';
        sumCard.appendChild(html(`<h3 style="margin-top:0">At a glance</h3><div class="stats">
          ${A.statBox('Volume', fmt(V, 1) + ' <small>m³</small>')}
          ${A.statBox('Surface', fmt(R.ab.S, 1) + ' <small>m²</small>')}
          ${A.statBox('First axial modes', [s.L, s.W, s.H].map((d) => fmt(P.C / (2 * d), 0)).join(' / ') + ' <small>Hz</small>', 'L / W / H')}
          ${A.statBox('Schroeder freq.', fmt(P.schroeder(R.eyr[1], V), 0) + ' <small>Hz</small>')}
          ${A.statBox('RT @ 500 Hz', fmt(R.eyr[2], 2) + ' <small>s</small>', `target ${fmt(tg[2][0], 2)}–${fmt(tg[2][1], 2)} s`, R.eyr[2] > tg[2][1] ? 'bad' : R.eyr[2] < tg[2][0] ? 'warn' : 'good')}
          ${A.statBox('RT @ 125 Hz', fmt(R.eyr[0], 2) + ' <small>s</small>', `target ≤ ${fmt(tg[0][1], 2)} s`, R.eyr[0] > tg[0][1] ? 'bad' : 'good')}
          ${A.statBox('Bolt area', P.boltOK(s.L, s.W, s.H) ? 'Inside' : 'Outside', '', P.boltOK(s.L, s.W, s.H) ? 'good' : 'warn')}
          ${A.statBox('Background target', 'NC-' + t.nc)}
        </div><p class="small">${t.note}</p>`));
      }
      function drawView() {
        const body = views.body; if (!body) return;
        A.anim.loops.forEach((l) => { if (!document.contains(l.el) || body.contains(l.el)) { l.stop(); A.anim.loops.delete(l); } });
        body.innerHTML = '';
        const R = rt(s);
        const modes = P.roomModes(s.L, s.W, s.H, 300);
        if (current === 'overview') viewOverview(body, R, modes);
        if (current === 'modes') viewModes(body, R, modes);
        if (current === 'bass') viewBass(body, R);
        if (current === 'rt') viewRT(body, R);
        if (current === 'plan') viewPlan(body, R);
        if (current === 'treat') viewTreat(body, R);
      }

      function viewOverview(body, R, modes) {
        const adv = advise(s, R, modes);
        const icon = { good: 'check', warn: 'alert', bad: 'alert', info: 'help' };
        adv.forEach((a) => body.appendChild(html(`<div class="card" style="margin-bottom:10px;border-left:4px solid var(--${a.lvl === 'info' ? 'accent2' : a.lvl})"><div class="row" style="gap:8px"><span class="${a.lvl === 'info' ? '' : a.lvl}" style="width:20px;display:inline-flex">${A.icon(icon[a.lvl])}</span><b>${a.title}</b></div><div class="small" style="margin-top:4px">${a.text}</div></div>`)));
      }

      function viewModes(body, R, modes) {
        body.appendChild(html('<p class="muted">Every resonance below 300 Hz. Axial modes (strongest) are drawn tallest. Click any row in the table to <b>hear</b> it — walk around your room while it plays and you’ll hear the peaks and nulls.</p>'));
        const cols = { axial: A.css('accent'), tangential: A.css('accent2'), oblique: A.css('c3') };
        A.canvas(body, {
          height: 230,
          draw(ctx, w, h) {
            const ax = A.axes(ctx, w, h, { x: { min: 15, max: 300, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 40, 50, 60, 80, 100, 150, 200, 300] }, y: { min: 0, max: 1.1, ticks: [] } });
            const fs = P.schroeder(R.eyr[1], R.V);
            ctx.fillStyle = A.alpha(A.css('muted'), 0.08); ctx.fillRect(ax.X(Math.min(fs, 300)), ax.y1, ax.x1 - ax.X(Math.min(fs, 300)), ax.y0 - ax.y1);
            A.text(ctx, 'Schroeder ' + fmt(fs, 0) + ' Hz →', ax.X(Math.min(fs, 280)) + 4, ax.y1 + 14, { size: 11, color: A.css('muted') });
            modes.forEach((m) => {
              const hgt = m.type === 'axial' ? 1 : m.type === 'tangential' ? 0.7 : 0.45;
              ctx.strokeStyle = cols[m.type]; ctx.lineWidth = m.type === 'axial' ? 2.5 : 1.3;
              ctx.beginPath(); ctx.moveTo(ax.X(m.f), ax.y0); ctx.lineTo(ax.X(m.f), ax.Y(hgt)); ctx.stroke();
            });
            ctx.lineWidth = 1;
          },
        });
        body.appendChild(A.legend([[cols.axial, 'Axial'], [cols.tangential, 'Tangential'], [cols.oblique, 'Oblique']]));
        const bon = P.bonello(modes);
        body.appendChild(html('<h3>Bonello: modes per third-octave band</h3><p class="small">Counts should rise (or stay level) band to band. Red bars drop — those bands will sound uneven.</p>'));
        A.canvas(body, {
          height: 180,
          draw(ctx, w, h) {
            const bands = P.THIRDS.slice(0, 13);
            const mx = Math.max(4, ...bon.counts.slice(0, 13));
            const ax = A.axes(ctx, w, h, { x: { min: 0, max: bands.length, ticks: [] }, y: { min: 0, max: mx + 1, label: 'modes' } });
            bands.forEach((f, i) => {
              const c = bon.counts[i]; const bad = i > 0 && c < bon.counts[i - 1];
              ctx.fillStyle = bad ? A.css('bad') : A.css('accent');
              const x0 = ax.X(i + 0.15), x1 = ax.X(i + 0.85);
              ctx.fillRect(x0, ax.Y(c), x1 - x0, ax.y0 - ax.Y(c));
              A.text(ctx, String(f), (x0 + x1) / 2, ax.y0 + 14, { align: 'center', size: 10, color: A.css('muted') });
            });
          },
        });
        const axial = modes.filter((m) => m.f <= 300);
        const tbl = el('div', { class: 'table-wrap', style: { maxHeight: '360px', marginTop: '12px' } });
        tbl.innerHTML = `<table><tr><th>Frequency</th><th>Mode (L,W,H)</th><th>Type</th><th>Pressure at your seat</th><th></th></tr>${axial.map((m, i) => {
          const { rcv } = positions(s);
          const p = Math.abs(P.modeShape(m.n, [s.L, s.W, s.H], rcv));
          return `<tr data-i="${i}" style="cursor:pointer"><td class="num">${fmt(m.f, 1)} Hz</td><td>(${m.n.join(',')})</td><td>${m.type}</td><td><div class="meter" style="width:120px"><i style="width:${Math.round(p * 100)}%"></i></div></td><td><button class="small">▶ hear</button></td></tr>`;
        }).join('')}</table>`;
        tbl.addEventListener('click', (e) => { const tr = e.target.closest('tr[data-i]'); if (tr) A.audio.tone(axial[+tr.dataset.i].f, 3, -14); });
        body.appendChild(tbl);
      }

      function viewBass(body, R) {
        body.appendChild(html('<p class="muted">Predicted low-frequency response at your seat from both speakers (modal summation in a rigid rectangular room, damping from the predicted RT). Real rooms with flexible walls are smoother, but peaks and nulls appear where predicted. Use it to compare seat and speaker positions.</p>'));
        let compare = true;
        const cmpBtn = el('button', { class: 'small' }, 'Compare with seat at room centre: on');
        cmpBtn.onclick = () => { compare = !compare; cmpBtn.textContent = 'Compare with seat at room centre: ' + (compare ? 'on' : 'off'); cv.redraw(); };
        body.appendChild(cmpBtn);
        const stats = el('div', { class: 'stats' });
        body.appendChild(stats);
        const cv = A.canvas(body, {
          height: 320,
          draw(ctx, w, h) {
            const { spk, rcv } = positions(s);
            const T = R.eyr[0];
            const resp = P.modalResponse(s.L, s.W, s.H, spk, rcv, T, 15, 250, 260);
            const ax = A.axes(ctx, w, h, { x: { min: 15, max: 250, log: true, label: 'Frequency (Hz)', ticks: [20, 30, 40, 50, 60, 80, 100, 150, 200] }, y: { min: -30, max: 20, label: 'Relative level (dB)' } });
            ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(3), ax.x1 - ax.x0, ax.Y(-3) - ax.Y(3));
            if (compare) {
              const c = P.modalResponse(s.L, s.W, s.H, spk, [s.L / 2, s.W / 2, rcv[2]], T, 15, 250, 260);
              A.plotLine(ctx, ax, c.map((p) => [p.f, p.db]), A.alpha(A.css('muted'), 0.9), 1.5, [5, 4]);
            }
            A.plotLine(ctx, ax, resp.map((p) => [p.f, p.db]), A.css('accent'), 2.5);
            const band = resp.filter((p) => p.f >= 30 && p.f <= 150).map((p) => p.db);
            const mean = band.reduce((a, b) => a + b, 0) / band.length;
            const sd = Math.sqrt(band.reduce((a, b) => a + (b - mean) ** 2, 0) / band.length);
            const pk = resp.filter((p) => p.f >= 25 && p.f <= 200).reduce((a, b) => (b.db > a.db ? b : a));
            const nl = resp.filter((p) => p.f >= 25 && p.f <= 200).reduce((a, b) => (b.db < a.db ? b : a));
            stats.innerHTML = A.statBox('Smoothness 30–150 Hz', '±' + fmt(sd, 1) + ' dB', 'standard deviation (lower is better)', sd < 4 ? 'good' : sd < 6 ? 'warn' : 'bad') + A.statBox('Biggest peak', fmtHz(pk.f), fmt(pk.db, 1) + ' dB — trap or EQ cut') + A.statBox('Deepest null', fmtHz(nl.f), fmt(nl.db, 1) + ' dB — move seat/speakers');
          },
        });
        body.appendChild(A.legend([[A.css('accent'), 'Your seat'], [A.css('muted'), 'Seat at room centre', true]]));
      }

      function viewRT(body, R) {
        const tg = target(s);
        body.appendChild(html(`<p class="muted">Predicted reverberation time per octave band (Eyring with air absorption; Sabine dashed) against the target for a <b>${roomType(s).name.toLowerCase()}</b>.</p>`));
        A.canvas(body, {
          height: 300,
          draw(ctx, w, h) {
            const mx = Math.max(1, ...R.eyr, ...R.sab, ...tg.map((t) => t[1])) * 1.15;
            const ax = A.axes(ctx, w, h, { x: { min: 90, max: 5600, log: true, label: 'Octave band (Hz)', ticks: P.BANDS6, fmt: A.shortHz }, y: { min: 0, max: mx, label: 'RT60 (s)' } });
            ctx.fillStyle = A.alpha(A.css('good'), 0.15);
            ctx.beginPath();
            P.BANDS6.forEach((f, i) => { const x = ax.X(f), y = ax.Y(tg[i][1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
            for (let i = 5; i >= 0; i--) ctx.lineTo(ax.X(P.BANDS6[i]), ax.Y(tg[i][0]));
            ctx.closePath(); ctx.fill();
            A.plotLine(ctx, ax, P.BANDS6.map((f, i) => [f, R.sab[i]]), A.css('muted'), 1.5, [5, 4]);
            A.plotLine(ctx, ax, P.BANDS6.map((f, i) => [f, R.eyr[i]]), A.css('accent'), 2.5);
            P.BANDS6.forEach((f, i) => { ctx.fillStyle = A.css('accent'); ctx.beginPath(); ctx.arc(ax.X(f), ax.Y(R.eyr[i]), 4, 0, 7); ctx.fill(); A.text(ctx, fmt(R.eyr[i], 2), ax.X(f), ax.Y(R.eyr[i]) - 9, { align: 'center', size: 11, weight: 700 }); });
          },
        });
        body.appendChild(A.legend([[A.css('accent'), 'Eyring (predicted)'], [A.css('muted'), 'Sabine', true], [A.css('good'), 'Target zone']]));
        const t = el('div', { class: 'table-wrap', style: { marginTop: '12px' } });
        t.innerHTML = `<table><tr><th>Absorption (m² sabins)</th>${P.BANDS6.map((f) => `<th class="num">${A.shortHz(f)}</th>`).join('')}</tr>
          ${R.ab.parts.map((p) => `<tr><td>${p.name}</td>${p.A.map((v) => `<td class="num">${fmt(v, 1)}</td>`).join('')}</tr>`).join('')}
          <tr><td><b>Total (net)</b></td>${R.ab.A.map((v) => `<td class="num"><b>${fmt(v, 1)}</b></td>`).join('')}</tr>
          <tr><td>Needed for target mid</td>${tg.map((x) => `<td class="num">${fmt((0.161 * R.V) / ((x[0] + x[1]) / 2), 1)}</td>`).join('')}</tr></table>`;
        body.appendChild(t);
      }

      function viewPlan(body, R) {
        body.appendChild(html('<p class="muted">Top view. Drag the listener (●). Shaded marks show first-reflection points on the side walls, the dashed rectangle the ceiling reflection zone. Toggle the seat map to see where in the room the bass is smoothest (30–150 Hz).</p>'));
        let showMap = false, dragging = false, mapCache = null, mapKey = '';
        const tg = el('button', { class: 'small' }, 'Show bass seat-quality map');
        tg.onclick = () => { showMap = !showMap; tg.textContent = showMap ? 'Hide seat map' : 'Show bass seat-quality map'; cv.redraw(); };
        body.appendChild(tg);
        const info = el('div', { class: 'stats' });
        body.appendChild(info);
        function seatMap() {
          const key = [s.L, s.W, s.H, s.sd, s.spread, s.sz, s.lz, R.eyr[0]].join();
          if (mapCache && mapKey === key) return mapCache;
          const { spk } = positions(s);
          const nx = 26, ny = 18, grid = [];
          let mn = Infinity, mx = -Infinity;
          for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
            const r = [((i + 0.5) / nx) * s.L, ((j + 0.5) / ny) * s.W, s.lz];
            const resp = P.modalResponse(s.L, s.W, s.H, spk, r, R.eyr[0], 30, 150, 40);
            const m = resp.reduce((a, b) => a + b.db, 0) / resp.length;
            const sd = Math.sqrt(resp.reduce((a, b) => a + (b.db - m) ** 2, 0) / resp.length);
            grid.push(sd); mn = Math.min(mn, sd); mx = Math.max(mx, sd);
          }
          mapCache = { grid, nx, ny, mn, mx }; mapKey = key; return mapCache;
        }
        const cv = A.canvas(body, {
          height: 420,
          onPointer(p, api) {
            const g = api.geom; if (!g) return;
            if (p.type === 'pointerdown') dragging = true;
            if (p.type === 'pointerup' || p.type === 'pointerleave') dragging = false;
            if (dragging) {
              s.ly = A.clamp((p.x - g.ox) / (g.sc * s.W), 0.05, 0.95);
              s.lx = A.clamp((p.y - g.oy) / (g.sc * s.L), 0.1, 0.95);
              save(); summary();
            }
          },
          draw(ctx, w, h, t, dt, api) {
            const sc = Math.min((w - 60) / s.W, (h - 50) / s.L), ox = (w - s.W * sc) / 2, oy = 25;
            api.geom = { sc, ox, oy };
            const T = (x, y) => [ox + y * sc, oy + x * sc]; // x along length (down), y across width (right)
            if (showMap) {
              const m = seatMap(), lut = V.divergingLUT();
              const cw = (s.W * sc) / m.ny, ch = (s.L * sc) / m.nx;
              for (let j = 0; j < m.ny; j++) for (let i = 0; i < m.nx; i++) {
                const v = (m.grid[j * m.nx + i] - m.mn) / (m.mx - m.mn + 1e-9);
                const k = Math.round((1 - v) * 255) * 3;
                ctx.fillStyle = `rgb(${lut[k]},${lut[k + 1]},${lut[k + 2]})`;
                ctx.fillRect(ox + j * cw, oy + i * ch, cw + 0.5, ch + 0.5);
              }
              A.text(ctx, 'orange = smoother bass · blue = rougher', ox, oy + s.L * sc + 18, { size: 11, color: A.css('muted') });
            }
            ctx.strokeStyle = A.css('text'); ctx.lineWidth = 3; ctx.strokeRect(ox, oy, s.W * sc, s.L * sc); ctx.lineWidth = 1;
            A.text(ctx, 'FRONT WALL', ox + (s.W * sc) / 2, oy - 8, { align: 'center', size: 11, color: A.css('muted') });
            const { spk, rcv } = positions(s);
            // first reflection points on side walls
            spk.forEach((sp) => {
              [0, s.W].forEach((wy) => {
                const img = [sp[0], 2 * wy - sp[1]];
                const t2 = (wy - rcv[1]) / (img[1] - rcv[1]);
                const px = rcv[0] + t2 * (img[0] - rcv[0]);
                const q = T(px, wy);
                ctx.fillStyle = A.alpha(A.css('accent'), 0.45); ctx.fillRect(q[0] - 6, q[1] - 0.3 * sc, 12, 0.6 * sc);
                ctx.strokeStyle = A.alpha(A.css('accent'), 0.8); ctx.beginPath(); ctx.moveTo(...T(sp[0], sp[1])); ctx.lineTo(...q); ctx.lineTo(...T(rcv[0], rcv[1])); ctx.stroke();
              });
              ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...T(sp[0], sp[1])); ctx.lineTo(...T(rcv[0], rcv[1])); ctx.stroke(); ctx.lineWidth = 1;
              const q = T(sp[0], sp[1]); ctx.fillStyle = A.css('accent2'); ctx.fillRect(q[0] - 8, q[1] - 8, 16, 16);
            });
            // ceiling reflection zone (midpoint between speakers and listener in plan)
            const cx = (spk[0][0] + rcv[0]) / 2, cyl = s.W / 2 - s.spread / 2 - 0.2, cyr = s.W / 2 + s.spread / 2 + 0.2;
            const a1 = T(cx - 0.6, cyl), a2 = T(cx + 0.6, cyr);
            ctx.setLineDash([5, 4]); ctx.strokeStyle = A.css('c3'); ctx.strokeRect(a1[0], a1[1], a2[0] - a1[0], a2[1] - a1[1]); ctx.setLineDash([]);
            A.text(ctx, 'cloud zone', a2[0] + 4, a1[1] + 10, { size: 10, color: A.css('c3') });
            // corners
            [[0, 0], [0, s.W], [s.L, 0], [s.L, s.W]].forEach(([x, y]) => { const q = T(x, y); ctx.fillStyle = A.alpha(A.css('c4'), 0.6); ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0] + (y ? -1 : 1) * 0.6 * sc, q[1]); ctx.lineTo(q[0], q[1] + (x ? -1 : 1) * 0.6 * sc); ctx.closePath(); ctx.fill(); });
            const q = T(rcv[0], rcv[1]); ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, 7); ctx.fill();
            // scale
            A.text(ctx, `${fmt(s.W, 2)} m`, ox + (s.W * sc) / 2, oy + s.L * sc + (showMap ? 34 : 18), { align: 'center', size: 11, color: A.css('muted') });
            info.innerHTML = A.statBox('Listener', `${fmt(rcv[0], 2)} m from front`, `${fmt(s.lx * 100, 0)} % of length`) + A.statBox('Side reflection delay', fmt(((Math.hypot(spk[0][0] - rcv[0], spk[0][1] + rcv[1]) - Math.hypot(spk[0][0] - rcv[0], spk[0][1] - rcv[1])) / P.C) * 1000, 1) + ' ms') + A.statBox('Ceiling reflection delay', fmt(((Math.hypot(spk[0][0] - rcv[0], (2 * s.H - s.sz - s.lz)) - Math.hypot(spk[0][0] - rcv[0], s.sz - s.lz)) / P.C) * 1000, 1) + ' ms');
          },
        });
        A.onLeave(() => {});
        cv.canvas.style.touchAction = 'none';
      }

      function viewTreat(body, R) {
        const p = plan(s, R);
        body.appendChild(html(`<p class="muted">Absorption still needed to reach the middle of the target range (m² sabins): ${P.BANDS6.map((f, i) => `<b>${A.shortHz(f)}</b> ${fmt(p.need[i], 1)}`).join(' · ')}. The plan below follows the professional order: bass first, then early reflections, then decay & diffusion.</p>`));
        const t = el('div', { class: 'table-wrap' });
        t.innerHTML = `<table><tr><th>#</th><th>Treatment</th><th>Where</th><th class="num">Area</th></tr>${p.items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.what}<div class="small">${D.mat(it.mat).name}</div></td><td>${it.where}</td><td class="num">${fmt(it.area, 1)} m²</td></tr>`).join('')}</table>`;
        body.appendChild(t);
        // before/after
        const after = Object.assign({}, s, { items: s.items.concat(p.items.map((x) => ({ mat: x.mat, area: x.area }))) });
        const Ra = rt(after);
        const tg = target(s);
        body.appendChild(html(`<h3>Predicted result</h3>`));
        A.canvas(body, {
          height: 260,
          draw(ctx, w, h) {
            const mx = Math.max(1, ...R.eyr, ...tg.map((x) => x[1])) * 1.15;
            const ax = A.axes(ctx, w, h, { x: { min: 90, max: 5600, log: true, label: 'Octave band (Hz)', ticks: P.BANDS6, fmt: A.shortHz }, y: { min: 0, max: mx, label: 'RT60 (s)' } });
            ctx.fillStyle = A.alpha(A.css('good'), 0.15); ctx.beginPath();
            P.BANDS6.forEach((f, i) => { const x = ax.X(f), y = ax.Y(tg[i][1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
            for (let i = 5; i >= 0; i--) ctx.lineTo(ax.X(P.BANDS6[i]), ax.Y(tg[i][0]));
            ctx.closePath(); ctx.fill();
            A.plotLine(ctx, ax, P.BANDS6.map((f, i) => [f, R.eyr[i]]), A.css('muted'), 2, [5, 4]);
            A.plotLine(ctx, ax, P.BANDS6.map((f, i) => [f, Ra.eyr[i]]), A.css('accent'), 2.5);
          },
        });
        body.appendChild(A.legend([[A.css('muted'), 'Now', true], [A.css('accent'), 'With this plan'], [A.css('good'), 'Target']]));
        const row = el('div', { class: 'row', style: { marginTop: '10px' } });
        const apply = el('button', { class: 'primary' }, 'Apply this plan to my room');
        apply.onclick = () => { s.items = after.items; refresh(); A.toast('Plan added to treatment list'); };
        row.append(apply, html(`<a class="btn" href="#/workshop">How to build these →</a>`), html(`<a class="btn" href="#/absorbers">Design custom absorbers →</a>`));
        body.appendChild(row);
        body.appendChild(html(`<div class="callout mentor">Predictions assume a diffuse field, which small rooms aren’t. Treat this plan as the first iteration: install the bass traps and reflection-point panels, <a href="#/measure">measure</a>, then adjust. In small rooms the ear judges the low-frequency response and early reflections far more than the RT number.</div>`));
      }

      renderItems(); summary(); drawView();
    },
  });
})();
