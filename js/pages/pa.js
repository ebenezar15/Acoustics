/* PA & Sound System Designer: coverage map, delays, sub arrays, alignment, tuning, calculators, venue recipes. */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const D2R = Math.PI / 180;

  const SPK = {
    ps8: { name: 'Compact 8" point source (90×60)', h: 90, v: 60, max: 127 },
    ps12: { name: '12" 2-way (90×50)', h: 90, v: 50, max: 134 },
    ps15: { name: '15" 2-way long-throw (60×40)', h: 60, v: 40, max: 138 },
    fill: { name: 'Front/out-fill 5" (110×70)', h: 110, v: 70, max: 118 },
    col: { name: 'Steerable column (120×20)', h: 120, v: 20, max: 118 },
    line: { name: 'Large line array, 12 × 12" (90° H)', h: 90, v: 32, max: 143, line: true, H: 5 },
    lineS: { name: 'Small line array, 6 × 6.5" (110° H)', h: 110, v: 30, max: 133, line: true, H: 1.6 },
    ceil: { name: 'Ceiling speaker 6.5" on 100 V (6 W)', h: 100, v: 100, max: 104, ceiling: true },
  };
  const LEVELS = { speech: ['Speech / conference', 75, 15], worship: ['Contemporary worship', 90, 12], theatre: ['Theatre / musical', 85, 15], rock: ['Rock / pop concert', 100, 15], club: ['Club / EDM', 100, 12] };

  const PRESETS = {
    club: { name: 'Club (15 × 10 m)', L: 15, W: 10, ear: 1.7, prog: 'club', spk: [
      { t: 'ps12', x: 1.5, y: 0, z: 2.6, yaw: 12, tilt: 6, role: 'main', label: 'Main L' },
      { t: 'ps12', x: 8.5, y: 0, z: 2.6, yaw: -12, tilt: 6, role: 'main', label: 'Main R' },
    ] },
    theatre: { name: 'Theatre (24 × 18 m, balcony delays)', L: 24, W: 18, ear: 1.2, prog: 'theatre', spk: [
      { t: 'ps15', x: 2, y: 0, z: 7, yaw: 14, tilt: 14, role: 'main', label: 'Left' },
      { t: 'ps15', x: 16, y: 0, z: 7, yaw: -14, tilt: 14, role: 'main', label: 'Right' },
      { t: 'ps12', x: 9, y: 0, z: 8, yaw: 0, tilt: 20, role: 'main', label: 'Centre' },
      { t: 'fill', x: 5, y: 0, z: 1, yaw: 0, tilt: -3, role: 'fill', label: 'Front fill 1' },
      { t: 'fill', x: 13, y: 0, z: 1, yaw: 0, tilt: -3, role: 'fill', label: 'Front fill 2' },
      { t: 'ps8', x: 4, y: 17, z: 3.4, yaw: 0, tilt: 18, role: 'delay', label: 'Under-balcony 1' },
      { t: 'ps8', x: 9, y: 17, z: 3.4, yaw: 0, tilt: 18, role: 'delay', label: 'Under-balcony 2' },
      { t: 'ps8', x: 14, y: 17, z: 3.4, yaw: 0, tilt: 18, role: 'delay', label: 'Under-balcony 3' },
    ] },
    church: { name: 'Reverberant church (36 × 14 m)', L: 36, W: 14, ear: 1.2, prog: 'speech', spk: [
      { t: 'col', x: 0.4, y: 2, z: 3, yaw: 25, tilt: 3, role: 'main', label: 'Column L' },
      { t: 'col', x: 13.6, y: 2, z: 3, yaw: -25, tilt: 3, role: 'main', label: 'Column R' },
      { t: 'col', x: 0.4, y: 13, z: 3, yaw: 25, tilt: 3, role: 'delay', label: 'Delay column L1' },
      { t: 'col', x: 13.6, y: 13, z: 3, yaw: -25, tilt: 3, role: 'delay', label: 'Delay column R1' },
      { t: 'col', x: 0.4, y: 24, z: 3, yaw: 25, tilt: 3, role: 'delay', label: 'Delay column L2' },
      { t: 'col', x: 13.6, y: 24, z: 3, yaw: -25, tilt: 3, role: 'delay', label: 'Delay column R2' },
    ] },
    conference: { name: 'Conference room, ceiling grid (20 × 14 m)', L: 20, W: 14, ear: 1.2, prog: 'speech', spk: [] },
    festival: { name: 'Outdoor festival (90 × 60 m, delay towers)', L: 90, W: 60, ear: 1.7, prog: 'rock', spk: [
      { t: 'line', x: 18, y: 0, z: 11, yaw: 8, tilt: 6, role: 'main', label: 'Main array L' },
      { t: 'line', x: 42, y: 0, z: 11, yaw: -8, tilt: 6, role: 'main', label: 'Main array R' },
      ...[8, 19, 30, 41, 52].map((x, i) => ({ t: 'ps12', x, y: 0, z: 1.2, yaw: 0, tilt: -2, role: 'fill', label: 'Front fill ' + (i + 1) })),
      { t: 'line', x: 18, y: 50, z: 9, yaw: 0, tilt: 5, role: 'delay', label: 'Delay tower L' },
      { t: 'line', x: 42, y: 50, z: 9, yaw: 0, tilt: 5, role: 'delay', label: 'Delay tower R' },
    ] },
    ballroom: { name: 'Ballroom / hall (30 × 20 m)', L: 30, W: 20, ear: 1.2, prog: 'worship', spk: [
      { t: 'lineS', x: 3, y: 0, z: 6, yaw: 12, tilt: 8, role: 'main', label: 'Array L' },
      { t: 'lineS', x: 17, y: 0, z: 6, yaw: -12, tilt: 8, role: 'main', label: 'Array R' },
      { t: 'fill', x: 10, y: 0, z: 1, yaw: 0, tilt: -3, role: 'fill', label: 'Centre front fill' },
    ] },
  };
  function conferenceGrid(p) {
    const sp = AP.ceilingSpacing(3.2, p.ear, 100, 'minimum');
    const nx = Math.max(1, Math.round(p.W / sp)), ny = Math.max(1, Math.round(p.L / sp));
    const out = [];
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) out.push({ t: 'ceil', x: ((i + 0.5) * p.W) / nx, y: ((j + 0.5) * p.L) / ny, z: 3.2, yaw: 0, tilt: 90, role: 'main', label: `C${i + 1}.${j + 1}` });
    return out;
  }

  function splAt(s, px, py, pz) {
    const T = SPK[s.t];
    const dx = px - s.x, dy = py - s.y, dz = pz - s.z;
    const r = Math.max(0.5, Math.hypot(dx, dy, dz));
    const ps = s.yaw * D2R, ts = (T.ceiling ? 90 : s.tilt) * D2R;
    const a = [Math.sin(ps) * Math.cos(ts), Math.cos(ps) * Math.cos(ts), -Math.sin(ts)];
    const rt = [Math.cos(ps), -Math.sin(ps), 0];
    const up = [a[1] * rt[2] - a[2] * rt[1], a[2] * rt[0] - a[0] * rt[2], a[0] * rt[1] - a[1] * rt[0]];
    const lx = dx * rt[0] + dy * rt[1] + dz * rt[2], ly = dx * a[0] + dy * a[1] + dz * a[2], lz = dx * up[0] + dy * up[1] + dz * up[2];
    let off;
    if (T.ceiling) { const th = Math.acos(Math.max(-1, Math.min(1, ly / r))) / D2R; off = AP.offAxisDb(th * 2, T.h * 2) / 2 + AP.offAxisDb(th, T.h) / 2; }
    else {
      const th = Math.atan2(lx, ly) / D2R, tv = Math.atan2(lz, Math.hypot(lx, ly)) / D2R;
      off = AP.offAxisDb(th, T.h) + AP.offAxisDb(tv, T.v);
      if (ly < 0) off -= 15;
    }
    const L = T.line ? AP.lineSourceLevel(T.max, r, T.H, 1000) : T.max - 20 * Math.log10(r);
    return L + off;
  }

  /* ---------------- coverage designer ---------------- */
  function coverage(body) {
    let st = A.store.get('pa', null);
    if (!st || !st.spk) st = load('theatre');
    function load(k) {
      const p = PRESETS[k];
      const spk = k === 'conference' ? conferenceGrid(p) : JSON.parse(JSON.stringify(p.spk));
      return { preset: k, L: p.L, W: p.W, ear: p.ear, prog: p.prog, spk, sel: 0, view: 'abs' };
    }
    const save = () => A.store.set('pa', st);
    const top = el('div', { class: 'card' }); body.appendChild(top);
    const row = el('div', { class: 'row' });
    const pre = el('select'); Object.entries(PRESETS).forEach(([k, v]) => pre.appendChild(el('option', { value: k }, v.name))); pre.value = st.preset;
    pre.onchange = () => { st = load(pre.value); save(); rebuild(); };
    const view = A.seg([['abs', 'Max SPL'], ['rel', 'Uniformity (re median)']], st.view, (v) => { st.view = v; save(); map.redraw(); });
    row.append(el('span', { class: 'small' }, 'Venue'), pre, view);
    top.appendChild(row);
    const venueBox = el('div'); top.appendChild(venueBox);
    const stats = el('div', { class: 'stats' }); top.appendChild(stats);
    const grid = el('div', { class: 'grid', style: { gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', marginTop: '14px' } });
    if (innerWidth < 900) grid.style.gridTemplateColumns = '1fr';
    body.appendChild(grid);
    const mapCard = el('div', { class: 'card' }); const spkCard = el('div', { class: 'card' });
    grid.append(mapCard, spkCard);
    const delayCard = el('div', { class: 'card', style: { marginTop: '14px' } }); body.appendChild(delayCard);
    let cache = null, dragging = false;

    function compute() {
      const nx = 64, ny = Math.max(16, Math.min(110, Math.round((64 * st.L) / st.W)));
      const vals = new Float32Array(nx * ny);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const px = ((i + 0.5) / nx) * st.W, py = 0.5 + ((j + 0.5) / ny) * (st.L - 0.5);
        let e = 0; st.spk.forEach((s) => (e += Math.pow(10, splAt(s, px, py, st.ear) / 10)));
        vals[j * nx + i] = 10 * Math.log10(e + 1e-12);
      }
      const sorted = Array.from(vals).sort((a, b) => a - b);
      const q = (p) => sorted[Math.floor(p * (sorted.length - 1))];
      const med = q(0.5);
      const within = Array.from(vals).filter((v) => Math.abs(v - med) <= 3).length / vals.length;
      cache = { nx, ny, vals, med, p5: q(0.05), p95: q(0.95), min: sorted[0], max: sorted[sorted.length - 1], within };
      return cache;
    }
    const lut = () => {
      const stops = [A.css('bg2'), A.css('accent2'), A.css('c4'), A.css('accent'), A.css('bad')].map((h) => { const c = h.replace('#', ''); const n = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; });
      return (t) => { t = Math.max(0, Math.min(0.9999, t)) * (stops.length - 1); const i = Math.floor(t), f = t - i; return stops[i].map((v, k) => Math.round(v + (stops[i + 1][k] - v) * f)); };
    };
    mapCard.appendChild(html('<h3 style="margin-top:0">Coverage map at ear height</h3><p class="small">Drag to move the selected loudspeaker. Predicted broadband (≈ 1 kHz) peak SPL capability, energy sum of all sources, with simple directivity models.</p>'));
    const map = A.canvas(mapCard, {
      height: 460,
      onPointer(p, api) {
        const g = api.geom; if (!g) return;
        if (p.type === 'pointerdown') {
          const hit = st.spk.findIndex((s) => Math.hypot(g.ox + s.x * g.sc - p.x, g.oy + s.y * g.sc - p.y) < 14);
          if (hit >= 0) { st.sel = hit; renderList(); }
          dragging = true;
        }
        if (p.type === 'pointerup' || p.type === 'pointerleave') { if (dragging) { dragging = false; save(); refreshStats(); } }
        if (dragging && st.spk[st.sel]) {
          const s = st.spk[st.sel];
          s.x = A.clamp((p.x - g.ox) / g.sc, 0, st.W); s.y = A.clamp((p.y - g.oy) / g.sc, -2, st.L);
          cache = null;
        }
      },
      draw(ctx, w, h, t, dt, api) {
        const c = cache || compute();
        const sc = Math.min((w - 70) / st.W, (h - 40) / (st.L + 2)), ox = (w - st.W * sc) / 2 - 20, oy = 2 * sc + 10;
        api.geom = { sc, ox, oy };
        const col = lut();
        const lo = st.view === 'abs' ? c.p5 - 3 : c.med - 12, hi = st.view === 'abs' ? c.max : c.med + 6;
        const cw = (st.W * sc) / c.nx, ch = ((st.L - 0.5) * sc) / c.ny;
        for (let j = 0; j < c.ny; j++) for (let i = 0; i < c.nx; i++) {
          const v = c.vals[j * c.nx + i];
          const [r, g, b] = col((v - lo) / (hi - lo));
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(ox + i * cw, oy + 0.5 * sc + j * ch, cw + 0.6, ch + 0.6);
        }
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.strokeRect(ox, oy, st.W * sc, st.L * sc); ctx.lineWidth = 1;
        ctx.fillStyle = A.alpha(A.css('muted'), 0.35); ctx.fillRect(ox, oy - 2 * sc, st.W * sc, 2 * sc);
        A.text(ctx, 'STAGE', ox + (st.W * sc) / 2, oy - sc + 4, { align: 'center', size: 11, weight: 700, color: A.css('text') });
        st.spk.forEach((s, k) => {
          const T = SPK[s.t]; const x = ox + s.x * sc, y = oy + s.y * sc;
          if (!T.ceiling) {
            const len = Math.min(60, 6 * sc); const a0 = (s.yaw - T.h / 2) * D2R, a1 = (s.yaw + T.h / 2) * D2R;
            ctx.fillStyle = A.alpha(A.css('text'), k === st.sel ? 0.22 : 0.1);
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(a0) * len, y + Math.cos(a0) * len); ctx.lineTo(x + Math.sin(a1) * len, y + Math.cos(a1) * len); ctx.closePath(); ctx.fill();
          }
          ctx.fillStyle = s.role === 'main' ? A.css('text') : s.role === 'delay' ? A.css('c3') : A.css('c5');
          ctx.beginPath(); ctx.arc(x, y, k === st.sel ? 8 : 6, 0, 7); ctx.fill();
          if (k === st.sel) { ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); ctx.lineWidth = 1; }
        });
        // colour scale
        const bx = ox + st.W * sc + 18, by = oy, bh = st.L * sc;
        for (let i = 0; i < 60; i++) { const [r, g, b] = col(1 - i / 60); ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(bx, by + (i / 60) * bh, 12, bh / 60 + 1); }
        A.text(ctx, fmt(hi, 0), bx + 16, by + 10, { size: 10, color: A.css('muted') });
        A.text(ctx, fmt(lo, 0), bx + 16, by + bh, { size: 10, color: A.css('muted') });
        A.text(ctx, st.view === 'abs' ? 'dB SPL' : 'dB', bx - 2, by + bh + 14, { size: 10, color: A.css('muted') });
        A.text(ctx, `${st.W} m`, ox + (st.W * sc) / 2, oy + st.L * sc + 16, { align: 'center', size: 11, color: A.css('muted') });
      },
    });
    map.canvas.style.touchAction = 'none';
    mapCard.appendChild(A.legend([[A.css('text'), 'Main'], [A.css('c5'), 'Fill'], [A.css('c3'), 'Delay']]));

    function renderVenue() {
      venueBox.innerHTML = '';
      A.controls(venueBox, [
        { key: 'L', label: 'Audience depth', type: 'number', value: st.L, unit: 'm' },
        { key: 'W', label: 'Width', type: 'number', value: st.W, unit: 'm' },
        { key: 'ear', label: 'Ear height', type: 'number', value: st.ear, unit: 'm' },
        { key: 'prog', label: 'Programme', type: 'select', value: st.prog, options: Object.entries(LEVELS).map(([k, v]) => [k, `${v[0]} (${v[1]} dBA + ${v[2]} dB peaks)`]) },
      ], (v) => { st.L = Math.max(4, v.L); st.W = Math.max(3, v.W); st.ear = v.ear; st.prog = v.prog; cache = null; save(); refreshStats(); map.redraw(); });
    }
    function renderList() {
      spkCard.innerHTML = '<h3 style="margin-top:0">Loudspeakers</h3>';
      const list = el('div', { style: { maxHeight: '170px', overflow: 'auto', border: '1px solid var(--line)', borderRadius: '10px' } });
      st.spk.forEach((s, k) => {
        const r = el('div', { class: 'row', style: { justifyContent: 'space-between', padding: '5px 10px', cursor: 'pointer', background: k === st.sel ? 'var(--panel2)' : '' } });
        r.innerHTML = `<span class="small"><b>${s.label}</b> · ${SPK[s.t].name.split(' (')[0]} · ${s.role}</span>`;
        r.onclick = () => { st.sel = k; renderList(); map.redraw(); };
        list.appendChild(r);
      });
      spkCard.appendChild(list);
      const btns = el('div', { class: 'row', style: { margin: '8px 0' } });
      const add = el('button', { class: 'small primary' }, '+ Add speaker');
      add.onclick = () => { st.spk.push({ t: 'ps8', x: st.W / 2, y: st.L / 2, z: 3, yaw: 0, tilt: 10, role: 'delay', label: 'New ' + (st.spk.length + 1) }); st.sel = st.spk.length - 1; cache = null; save(); renderList(); refreshStats(); map.redraw(); };
      const del = el('button', { class: 'small' }, 'Remove selected');
      del.onclick = () => { st.spk.splice(st.sel, 1); st.sel = 0; cache = null; save(); renderList(); refreshStats(); map.redraw(); };
      btns.append(add, del); spkCard.appendChild(btns);
      const s = st.spk[st.sel];
      if (!s) return;
      A.controls(spkCard, [
        { key: 'label', label: 'Name', type: 'text', value: s.label },
        { key: 't', label: 'Model type', type: 'select', value: s.t, options: Object.entries(SPK).map(([k, v]) => [k, v.name]) },
        { key: 'role', label: 'Role', type: 'select', value: s.role, options: [['main', 'Main'], ['fill', 'Fill'], ['delay', 'Delay']] },
        { key: 'x', label: 'Across (x)', type: 'range', min: 0, max: st.W, step: 0.1, value: s.x, unit: 'm' },
        { key: 'y', label: 'From stage edge (y)', type: 'range', min: -2, max: st.L, step: 0.1, value: s.y, unit: 'm' },
        { key: 'z', label: 'Height', type: 'range', min: 0.3, max: 20, step: 0.1, value: s.z, unit: 'm' },
        { key: 'yaw', label: 'Aim left/right', type: 'range', min: -90, max: 90, step: 1, value: s.yaw, unit: '°' },
        { key: 'tilt', label: 'Tilt down', type: 'range', min: -20, max: 60, step: 1, value: s.tilt, unit: '°' },
      ], (v) => { Object.assign(s, v); cache = null; save(); refreshStats(); map.redraw(); const lab = list.children[st.sel]; if (lab) lab.querySelector('span').innerHTML = `<b>${s.label}</b> · ${SPK[s.t].name.split(' (')[0]} · ${s.role}`; }, 'ctrl-grid');
    }
    function refreshStats() {
      const c = cache || compute();
      const [nm, prog, crest] = LEVELS[st.prog];
      const need = prog + crest;
      const head = c.p5 - need;
      stats.innerHTML = A.statBox('Peak SPL (median seat)', fmt(c.med, 1) + ' dB') + A.statBox('Quietest 5 % of seats', fmt(c.p5, 1) + ' dB') +
        A.statBox('Needed for ' + nm.toLowerCase(), fmt(need, 0) + ' dB', `${prog} dBA avg + ${crest} dB peaks`) +
        A.statBox('Headroom at weakest seats', (head >= 0 ? '+' : '') + fmt(head, 1) + ' dB', head >= 0 ? 'Enough level' : 'Not enough — add/upgrade boxes or delays', head >= 0 ? 'good' : 'bad') +
        A.statBox('Seats within ±3 dB', fmt(c.within * 100, 0) + ' %', 'of median', c.within > 0.7 ? 'good' : c.within > 0.5 ? 'warn' : 'bad') +
        A.statBox('Spread (5–95 %)', fmt(c.p95 - c.p5, 1) + ' dB', 'aim ≤ 6 dB');
      // delay table
      const mains = st.spk.filter((s) => s.role === 'main');
      const others = st.spk.filter((s) => s.role !== 'main');
      delayCard.innerHTML = '<h3 style="margin-top:0">Delay settings for fills and delays</h3><p class="small">Reference point: where each speaker’s aim meets ear height. Delay = (distance from nearest main − distance from this speaker) / c + 8 ms precedence offset, so the audience localises to the stage.</p>';
      if (!others.length || !mains.length) { delayCard.appendChild(html('<p class="small">No fills or delays in this design.</p>')); return; }
      const rows = others.map((s) => {
        const T = SPK[s.t]; const tl = (T.ceiling ? 90 : s.tilt) * D2R, ps = s.yaw * D2R;
        const dist = tl > 0.02 ? Math.min(30, (s.z - st.ear) / Math.sin(tl)) : 8;
        const ref = [s.x + Math.sin(ps) * Math.cos(tl) * dist, s.y + Math.cos(ps) * Math.cos(tl) * dist, st.ear];
        const dOwn = Math.hypot(ref[0] - s.x, ref[1] - s.y, ref[2] - s.z);
        const dMain = Math.min(...mains.map((m) => Math.hypot(ref[0] - m.x, ref[1] - m.y, ref[2] - m.z)));
        const dl = Math.max(0, AP.msFromDistance(dMain - dOwn) + 8);
        return `<tr><td>${s.label}</td><td class="num">${fmt(dMain, 1)} m</td><td class="num">${fmt(dOwn, 1)} m</td><td class="num"><b>${fmt(dl, 1)} ms</b></td></tr>`;
      });
      delayCard.appendChild(html(`<div class="table-wrap"><table><tr><th>Speaker</th><th class="num">Main → ref.</th><th class="num">Speaker → ref.</th><th class="num">Suggested delay</th></tr>${rows.join('')}</table></div>`));
    }
    function rebuild() { cache = null; pre.value = st.preset; renderVenue(); renderList(); refreshStats(); map.redraw(); }
    rebuild();
    body.appendChild(html(`<div class="callout mentor">Simplified prediction: broadband level, idealised directivity, no room reflections, line arrays assumed curved to fit the audience. Use it to learn layout logic and to sanity-check designs; use the manufacturer’s prediction software for final designs.</div>`));
  }

  /* ---------------- calculators ---------------- */
  function calcs(body) {
    const g = el('div', { class: 'grid g2' }); body.appendChild(g);
    const card = (t, d, spec, fn) => { const c = el('div', { class: 'card' }); c.appendChild(html(`<h3 style="margin-top:0">${t}</h3>${d ? `<p class="small">${d}</p>` : ''}`)); const o = el('div', { class: 'stats' }); const s = A.controls(c, spec, () => (o.innerHTML = fn(s))); c.appendChild(o); o.innerHTML = fn(s); g.appendChild(c); };
    const S = A.statBox;
    card('SPL budget & amplifier power', 'Will one box reach the back row with headroom?', [
      { key: 'tgt', label: 'Target programme level at farthest seat', type: 'number', value: 95, unit: 'dB' },
      { key: 'r', label: 'Distance to farthest seat', type: 'number', value: 25, unit: 'm' },
      { key: 'head', label: 'Peak headroom', type: 'number', value: 15, unit: 'dB' },
      { key: 'sens', label: 'Speaker sensitivity (1 W/1 m)', type: 'number', value: 100, unit: 'dB' },
      { key: 'max', label: 'Speaker max SPL @1 m', type: 'number', value: 133, unit: 'dB' },
      { key: 'n', label: 'Boxes covering that seat', type: 'number', value: 2 },
    ], (s) => { const need1m = s.tgt + s.head + 20 * Math.log10(s.r) - 10 * Math.log10(Math.max(1, s.n)); return S('Needed at 1 m per box', fmt(need1m, 1) + ' dB') + S('Speaker margin', fmt(s.max - need1m, 1) + ' dB', s.max >= need1m ? 'OK' : 'Too small / too far', s.max >= need1m ? 'good' : 'bad') + S('Amp power per box', fmt(AP.ampPower(s.tgt, s.r, s.sens, s.head, s.n), 0) + ' W'); });
    card('Delay tower / fill timing', '', [
      { key: 'dm', label: 'Main PA → listener', type: 'number', value: 60, unit: 'm' },
      { key: 'df', label: 'Delay speaker → listener', type: 'number', value: 12, unit: 'm' },
      { key: 'haas', label: 'Precedence offset', type: 'number', value: 8, unit: 'ms' },
    ], (s) => S('Path difference', fmt(s.dm - s.df, 1) + ' m') + S('Delay to set', fmt(AP.msFromDistance(s.dm - s.df) + s.haas, 1) + ' ms') + S('Level of mains there', 'relative ' + fmt(-20 * Math.log10(s.dm / s.df), 1) + ' dB', 'delay should be ≤ ~6 dB louder'));
    card('Constant-voltage (70 / 100 V) zone', '', [
      { key: 'V', label: 'Line voltage', type: 'select', value: 100, numeric: true, options: [[70, '70.7 V'], [100, '100 V']] },
      { key: 'n', label: 'Number of speakers', type: 'number', value: 24 },
      { key: 'tap', label: 'Tap per speaker', type: 'number', value: 6, unit: 'W' },
      { key: 'amp', label: 'Amplifier rating', type: 'number', value: 240, unit: 'W' },
      { key: 'len', label: 'Cable length (one way)', type: 'number', value: 150, unit: 'm' },
      { key: 'mm2', label: 'Cable cross-section', type: 'number', value: 1.5, unit: 'mm²' },
    ], (s) => { const tot = s.n * s.tap, Z = (s.V * s.V) / tot, loss = AP.cableLossDb(s.len, s.mm2, Z); return S('Total load', tot + ' W', tot <= s.amp * 0.8 ? '≤ 80 % of amp: OK' : 'Over 80 % — use a bigger amp or split zones', tot <= s.amp * 0.8 ? 'good' : 'bad') + S('Line impedance', fmt(Z, 1) + ' Ω') + S('Tap impedance', fmt(AP.cvTapZ(s.V, s.tap), 0) + ' Ω') + S('Cable loss', fmt(loss, 2) + ' dB', '', loss < -0.5 ? 'warn' : 'good'); });
    card('Ceiling speaker spacing', 'Distributed systems: coverage at ear height.', [
      { key: 'h', label: 'Ceiling height', type: 'number', value: 3, unit: 'm' },
      { key: 'ear', label: 'Ear height (seated 1.2 / standing 1.7)', type: 'number', value: 1.2, unit: 'm' },
      { key: 'cov', label: 'Speaker coverage angle', type: 'number', value: 100, unit: '°' },
      { key: 'area', label: 'Floor area', type: 'number', value: 300, unit: 'm²' },
    ], (s) => ['edge', 'minimum', 'centre'].map((m) => { const d = AP.ceilingSpacing(s.h, s.ear, s.cov, m); return S({ edge: 'Edge-to-edge', minimum: 'Minimum overlap', centre: 'Centre-to-centre (best)' }[m], fmt(d, 2) + ' m', '≈ ' + Math.ceil(s.area / (d * d)) + ' speakers'); }).join(''));
    const lp = el('div', { class: 'card' }); body.appendChild(lp); lp.appendChild(html('<h3 style="margin-top:0">Amplifier loading & cable</h3>')); V.ampLoad(lp);
    const fb = el('div', { class: 'card' }); body.appendChild(fb); fb.appendChild(html('<h3 style="margin-top:0">Gain before feedback</h3>')); V.feedback(fb);
    const lv = el('div', { class: 'card' }); body.appendChild(lv); lv.appendChild(html('<h3 style="margin-top:0">Line array vs point source</h3>')); V.lineVsPoint(lv);
  }

  /* ---------------- venue recipes ---------------- */
  const RECIPES = [
    ['Club / bar (100–500 people)', ['2–4 point-source tops (12"–15") on poles or flown', 'Subs: centre cluster or cardioid pair to keep the DJ booth clean', 'DJ monitors; limiter/processor locked by the venue', 'Digital mixer or DJ mixer → DSP → amps / powered speakers'], 'Limiters at the venue’s licence level; LF isolation to neighbours (see Soundproofing).'],
    ['Theatre / musical', ['L/C/R or L/R + centre vocal cluster, flown at proscenium', 'Front fills in the stage lip, out-fills for side seats', 'Under/over-balcony delays', 'Surrounds/effects zones; show control & playback (QLab-type)', 'Digital console with scenes; RF mics with antenna distribution'], 'Localisation to performers: delays aligned so sound appears to come from the stage.'],
    ['House of worship', ['Steerable columns or small line arrays for speech clarity in reverberant naves', 'Distributed delay positions down long rooms', 'Hearing loop / assistive listening', 'Stage monitoring: IEMs reduce stage noise', 'Network (Dante) to broadcast/streaming room'], 'Target STI ≥ 0.5–0.6; volunteers need simple scenes and locked processing.'],
    ['Conference / hotel ballroom', ['Distributed ceiling or column speakers with delay zones', 'Partitionable rooms: matrix DSP with room-combining logic', 'Ceiling beamforming mics or gooseneck mics + automixer', 'Integration with video conferencing (AEC), control panels'], 'Acoustic echo cancellation for remote participants; even coverage at seated ear height.'],
    ['Outdoor festival', ['Flown line arrays L/R, sub arrays (cardioid/end-fire) across the front', 'Delay towers every ~60–100 m; front fills', 'Fibre/redundant network between stage, FOH and delay towers', 'Weather protection, generator power, noise monitoring at neighbours'], 'Wind and temperature gradients bend sound; site noise limits drive design.'],
    ['Arena / stadium', ['Distributed clusters for speech intelligibility; main arrays for shows', 'Long delay lines and zoning', 'Life-safety voice evacuation integration (certified)', 'Redundant amplification and networks'], 'Very long RT and huge distances: directivity and many sources close to listeners.'],
    ['Retail / restaurant BGM', ['70/100 V ceiling or pendant speakers, zoned', 'Small DSP/mixer-amp with scheduling and paging', 'Keep level low and even; avoid “hot spots” by tables'], 'Comfort and paging intelligibility, not loudness.'],
    ['Studio / broadcast facility', ['Analog front-ends and monitor controllers; digital routing (Dante/MADI/ST 2110)', 'Talkback, cue mixes, tie lines', 'Master clock / house sync distribution', 'Loudness metering and redundant recording'], 'Clock and routing architecture are designed first.'],
  ];

  A.register('pa', {
    title: 'PA & Sound System Designer',
    render(root, params) {
      A.pageHead(root, 'Design', 'PA & Sound System Designer', 'Lay out loudspeakers in a venue and see the coverage, level and headroom; compute delays; design subwoofer arrays; align crossovers; tune a system on a simulated analyser; and size amps, cables and 100 V zones.');
      const tabs = [['coverage', 'Coverage designer'], ['subs', 'Subwoofer arrays'], ['align', 'Crossover & alignment'], ['tuning', 'Tuning lab'], ['eq', 'EQ & dynamics'], ['calc', 'System calculators'], ['venues', 'Venue recipes']];
      A.tabs(root, tabs, (id, body) => {
        const card = () => { const c = el('div', { class: 'card' }); body.appendChild(c); return c; };
        if (id === 'coverage') coverage(body);
        if (id === 'subs') V.subArray(card());
        if (id === 'align') { V.crossover(card(), { fc: 100, dist: 1.5 }); body.appendChild(html('<p class="muted">Start with the sub 1.5 m behind the mains: the sum dips at crossover. Add delay to the high side (≈ 4.4 ms) or try polarity, until the sum is flat.</p>')); }
        if (id === 'tuning') V.tuning(card());
        if (id === 'eq') { const c1 = card(); c1.appendChild(html('<h3 style="margin-top:0">Parametric EQ</h3>')); V.eq(c1); const c2 = card(); c2.appendChild(html('<h3 style="margin-top:0">Compressor / limiter</h3>')); V.compressor(c2); }
        if (id === 'calc') calcs(body);
        if (id === 'venues') {
          const g = el('div', { class: 'grid g2' }); body.appendChild(g);
          RECIPES.forEach(([n, items, note]) => g.appendChild(html(`<div class="card"><h3 style="margin-top:0">${n}</h3><ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul><p class="small"><b>Design driver:</b> ${note}</p></div>`)));
          body.appendChild(html('<p><a class="btn primary" href="#/academy/a-pa-design">Learn the full PA design process →</a> <a class="btn" href="#/systems">Signal flow & networks →</a></p>'));
        }
      }, tabs.find((t) => t[0] === params[0]) ? params[0] : 'coverage');
    },
  });
})();
