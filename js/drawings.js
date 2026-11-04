/* ==========================================================================
   Acoustica parametric construction drawings (inline SVG, dimensioned in the
   selected length unit). Every function takes metres and returns SVG markup.
   ========================================================================== */
(function () {
  'use strict';
  const DR = (window.DR = {});
  const L = (m) => A.fmtLen(m);
  const fmtScale = (k) => (k > 1.05 ? '×' + A.fmt(k, 1) + ' wider' : 'to scale');
  const col = { wood: 'var(--c3)', wool: 'var(--c4)', fabric: 'var(--accent)', board: 'var(--muted)', air: 'var(--bg2)', metal: 'var(--accent2)', seal: 'var(--c5)' };

  /* ---- primitives ---- */
  const svg = (w, h, body, title) => `<svg class="diagram" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title || 'construction drawing'}" style="max-width:${w}px">${defs}${body}</svg>`;
  const defs = `<defs>
    <pattern id="hatchWool" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="var(--c4)" opacity=".25"/><line x1="0" y1="0" x2="0" y2="8" stroke="var(--c4)" stroke-width="2" opacity=".7"/></pattern>
    <pattern id="hatchWood" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="var(--c3)" opacity=".35"/><line x1="0" y1="3" x2="6" y2="3" stroke="var(--c3)" stroke-width=".8" opacity=".8"/></pattern>
    <pattern id="hatchConc" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="var(--muted)" opacity=".25"/><circle cx="3" cy="3" r="1.2" fill="var(--muted)"/><circle cx="8" cy="7" r=".9" fill="var(--muted)"/></pattern>
    <marker id="dimA" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--text)"/></marker>
  </defs>`;
  const rect = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${Math.max(0.5, w)}" height="${Math.max(0.5, h)}" fill="${fill}" stroke="var(--text)" stroke-width=".8" ${extra}/>`;
  const text = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 11}" text-anchor="${o.anchor || 'middle'}" ${o.bold ? 'font-weight="700"' : ''} ${o.muted ? 'class="mut"' : ''}>${t}</text>`;
  const dimH = (x1, x2, y, label) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="var(--text)" stroke-width=".8" marker-start="url(#dimA)" marker-end="url(#dimA)"/><line x1="${x1}" y1="${y - 5}" x2="${x1}" y2="${y + 5}" stroke="var(--text)" stroke-width=".6"/><line x1="${x2}" y1="${y - 5}" x2="${x2}" y2="${y + 5}" stroke="var(--text)" stroke-width=".6"/>${text((x1 + x2) / 2, y - 5, label, { bold: true })}`;
  const dimV = (x, y1, y2, label, side = 1) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="var(--text)" stroke-width=".8" marker-start="url(#dimA)" marker-end="url(#dimA)"/><line x1="${x - 5}" y1="${y1}" x2="${x + 5}" y2="${y1}" stroke="var(--text)" stroke-width=".6"/><line x1="${x - 5}" y1="${y2}" x2="${x + 5}" y2="${y2}" stroke="var(--text)" stroke-width=".6"/><text x="${x + side * 7}" y="${(y1 + y2) / 2 + 4}" font-size="11" font-weight="700" text-anchor="${side > 0 ? 'start' : 'end'}">${label}</text>`;
  const callout = (x, y, tx, ty, label) => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="var(--muted)" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="2.5" fill="var(--text)"/>${text(tx + (tx > x ? 4 : -4), ty + 4, label, { anchor: tx > x ? 'start' : 'end' })}`;
  const legend = (items, x, y) => items.map(([f, l], i) => `<rect x="${x}" y="${y + i * 18}" width="14" height="12" fill="${f}" stroke="var(--text)" stroke-width=".6"/>${text(x + 20, y + i * 18 + 10, l, { anchor: 'start', size: 10.5 })}`).join('');
  DR.legendStd = (x, y) => legend([['url(#hatchWood)', 'Timber / board'], ['url(#hatchWool)', 'Mineral wool'], [col.fabric, 'Breathable fabric'], [col.air, 'Air gap']], x, y);

  /* ---- broadband panel: front elevation + section ---- */
  DR.panel = function ({ w = 0.6, h = 1.2, d = 0.1, gap = 0.1, frame = 0.018 }) {
    const W = 760, H = 380, sc = Math.min(260 / h, 240 / w);
    const fx = 40, fy = 50, pw = w * sc, ph = h * sc;
    let b = text(fx + pw / 2, 28, 'FRONT ELEVATION', { bold: true, muted: true });
    b += rect(fx, fy, pw, ph, 'url(#hatchWood)') + rect(fx + frame * sc, fy + frame * sc, pw - 2 * frame * sc, ph - 2 * frame * sc, 'url(#hatchWool)');
    b += `<rect x="${fx - 3}" y="${fy - 3}" width="${pw + 6}" height="${ph + 6}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 3"/>`;
    b += dimH(fx, fx + pw, fy + ph + 22, L(w)) + dimV(fx + pw + 22, fy, fy + ph, L(h));
    // section
    const sx = 360, sy = fy, ssc = Math.min(sc, 200 / (d + gap + 0.05)), dd = d * ssc, gg = gap * ssc;
    b += text(sx + 120, 28, 'SECTION A–A', { bold: true, muted: true });
    b += rect(sx, sy, 16, ph, 'url(#hatchConc)') + text(sx + 8, sy + ph + 16, 'wall', { size: 10, muted: true });
    b += rect(sx + 16, sy, gg, ph, col.air) + `<line x1="${sx + 16}" y1="${sy + ph * 0.3}" x2="${sx + 16 + gg}" y2="${sy + ph * 0.3}" stroke="var(--accent2)" stroke-width="3"/><line x1="${sx + 16}" y1="${sy + ph * 0.75}" x2="${sx + 16 + gg}" y2="${sy + ph * 0.75}" stroke="var(--accent2)" stroke-width="3"/>`;
    b += rect(sx + 16 + gg, sy, frame * ssc + 2, ph, 'url(#hatchWood)') + rect(sx + 16 + gg, sy + frame * ssc, dd, ph - 2 * frame * ssc, 'url(#hatchWool)');
    b += `<line x1="${sx + 16 + gg + dd + 2}" y1="${sy - 4}" x2="${sx + 16 + gg + dd + 2}" y2="${sy + ph + 4}" stroke="${col.fabric}" stroke-width="3"/>`;
    b += dimH(sx + 16, sx + 16 + gg, sy + ph + 34, L(gap)) + dimH(sx + 16 + gg, sx + 16 + gg + dd, sy + ph + 58, L(d));
    b += callout(sx + 16 + gg / 2, sy + ph * 0.3, sx + 16 + gg + dd + 40, sy + 20, 'stand-off / Z-clip');
    b += callout(sx + 16 + gg + dd + 2, sy + ph * 0.5, sx + 16 + gg + dd + 40, sy + ph * 0.5, 'fabric face');
    b += callout(sx + 16 + gg + dd / 2, sy + ph * 0.65, sx + 16 + gg + dd + 40, sy + ph * 0.75, 'wool core');
    b += DR.legendStd(620, 260);
    return svg(W, H, b, 'Broadband panel drawing');
  };

  /* ---- corner superchunk: plan + elevation ---- */
  DR.superchunk = function ({ leg = 0.6, H = 2.4, t = 0.1 }) {
    const W = 760, Hh = 400, sc = 240 / leg;
    let b = text(150, 26, 'PLAN (one layer)', { bold: true, muted: true });
    const ox = 40, oy = 40;
    b += rect(ox - 14, oy - 14, leg * sc + 30, 14, 'url(#hatchConc)') + rect(ox - 14, oy, 14, leg * sc + 16, 'url(#hatchConc)');
    b += `<polygon points="${ox},${oy} ${ox + leg * sc},${oy} ${ox},${oy + leg * sc}" fill="url(#hatchWool)" stroke="var(--text)"/>`;
    b += `<line x1="${ox + leg * sc}" y1="${oy}" x2="${ox}" y2="${oy + leg * sc}" stroke="${col.fabric}" stroke-width="4"/>`;
    b += dimH(ox, ox + leg * sc, oy + leg * sc + 24, L(leg)) + dimV(ox + leg * sc + 20, oy, oy + leg * sc, L(leg));
    b += text(ox + leg * sc * 0.55, oy + leg * sc * 0.6, 'face ' + L(leg * Math.SQRT2), { anchor: 'start', bold: true });
    const n = Math.ceil(H / t);
    const ex = 430, ey = 40, esc = 320 / H;
    b += text(ex + 100, 26, 'ELEVATION (corner view)', { bold: true, muted: true });
    for (let i = 0; i < Math.min(n, 60); i++) b += rect(ex, ey + i * t * esc, 180, t * esc, 'url(#hatchWool)', 'stroke-width=".4"');
    b += `<rect x="${ex}" y="${ey}" width="180" height="${H * esc}" fill="none" stroke="${col.fabric}" stroke-width="3"/>`;
    b += dimV(ex + 200, ey, ey + H * esc, L(H) + ` (${n} layers × ${L(t)})`);
    b += text(ex + 90, ey + H * esc + 22, `${Math.ceil(n / 2)} slabs ${L(leg)} × ${L(leg * 2)} cut diagonally`, { size: 11 });
    return svg(W, Hh, b, 'Superchunk drawing');
  };

  /* ---- membrane trap: section ---- */
  DR.membrane = function ({ w = 0.6, h = 1.2, D = 0.15, tp = 0.006, wool = 0.05 }) {
    const W = 760, H = 360, vs = 240 / h, sc = Math.min(4 * vs, 260 / (D + 0.06));
    const ox = 120, oy = 50, dd = D * sc, ph = h * vs;
    let b = text(ox + dd / 2, 28, 'SECTION — sealed box', { bold: true, muted: true });
    b += rect(ox - 18, oy, 18, ph, 'url(#hatchWood)') + text(ox - 9, oy + ph + 16, 'back', { size: 10, muted: true });
    b += rect(ox, oy - 14, dd, 14, 'url(#hatchWood)') + rect(ox, oy + ph, dd, 14, 'url(#hatchWood)');
    b += rect(ox, oy, wool * sc, ph, 'url(#hatchWool)') + rect(ox + wool * sc, oy, dd - wool * sc, ph, col.air);
    b += `<rect x="${ox + dd}" y="${oy - 14}" width="${Math.max(3, tp * sc * 3)}" height="${ph + 28}" fill="var(--c3)" stroke="var(--text)" stroke-width=".8"/>`;
    b += `<path d="M${ox + dd + 1} ${oy} q 10 ${ph / 2} 0 ${ph}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3"/>`;
    b += `<rect x="${ox + dd - 2}" y="${oy - 16}" width="6" height="6" fill="${col.seal}"/><rect x="${ox + dd - 2}" y="${oy + ph + 10}" width="6" height="6" fill="${col.seal}"/>`;
    b += dimH(ox, ox + dd, oy + ph + 40, 'cavity ' + L(D)) + dimH(ox, ox + wool * sc, oy + ph + 64, 'wool ' + L(wool));
    b += dimV(ox - 40, oy, oy + ph, L(h), -1);
    b += callout(ox + dd + 6, oy + ph * 0.25, ox + dd + 90, oy + 30, `membrane ${L(tp)} ply/hardboard`);
    b += callout(ox + dd, oy - 13, ox + dd + 90, oy - 6, 'airtight seal all round');
    b += callout(ox + dd + 6, oy + ph * 0.5, ox + dd + 90, oy + ph * 0.5, 'moves like a drum skin');
    b += callout(ox + wool * sc + 10, oy + ph * 0.7, ox + dd + 90, oy + ph * 0.75, 'air space: the spring');
    b += DR.legendStd(600, 250) + text(600, 340, 'depth drawn ' + fmtScale(sc / vs) + ' for clarity', { anchor: 'start', size: 10, muted: true });
    return svg(W, H, b, 'Membrane trap drawing');
  };

  /* ---- slotted resonator: section ---- */
  DR.slot = function ({ slat = 0.07, gap = 0.008, t = 0.018, D = 0.1, run = 0.6 }) {
    const W = 760, H = 300, n = Math.max(3, Math.min(14, Math.round(run / (slat + gap)))), unit = slat + gap;
    const sc = Math.min(620 / (n * unit), 160 / (D + t + 0.04));
    const ox = 60, oy = 60;
    let b = text(380, 28, 'SECTION — slats over wool-filled cavity', { bold: true, muted: true });
    b += rect(ox, oy, n * unit * sc, 16, 'url(#hatchConc)');
    b += rect(ox, oy + 16, n * unit * sc, D * sc, 'url(#hatchWool)');
    b += `<line x1="${ox}" y1="${oy + 16 + D * sc}" x2="${ox + n * unit * sc}" y2="${oy + 16 + D * sc}" stroke="var(--text)" stroke-width="2.5"/>`;
    for (let i = 0; i < n; i++) b += rect(ox + i * unit * sc, oy + 18 + D * sc, slat * sc, t * sc, 'url(#hatchWood)');
    const y2 = oy + 18 + D * sc + t * sc;
    b += dimH(ox, ox + slat * sc, y2 + 22, 'slat ' + L(slat)) + dimH(ox + slat * sc, ox + unit * sc, y2 + 46, 'slot ' + L(gap));
    b += dimV(ox + n * unit * sc + 24, oy + 16, oy + 16 + D * sc, 'cavity ' + L(D)) + dimV(ox + n * unit * sc + 24, oy + 18 + D * sc, y2, 't ' + L(t));
    b += callout(ox + n * unit * sc * 0.6, oy + 16 + D * sc, ox + n * unit * sc * 0.6, y2 + 70, 'black fabric behind slats');
    return svg(W, H, b, 'Slot resonator drawing');
  };

  /* ---- QRD: section with every well dimensioned ---- */
  DR.qrd = function ({ depths, w = 0.05, fin = 0.006, back = 0.012, periods = 1 }) {
    const N = depths.length, max = Math.max(...depths), cells = N * periods;
    const W = 780, H = 340, sc = Math.min(680 / (cells * (w + fin) + fin), 200 / (max + back));
    const ox = 40, oy = 50;
    let b = text(390, 26, 'SECTION — sound arrives from the top', { bold: true, muted: true });
    const top = oy, bot = oy + max * sc;
    b += rect(ox, bot, (cells * (w + fin) + fin) * sc, back * sc, 'url(#hatchWood)');
    for (let i = 0; i <= cells; i++) b += rect(ox + i * (w + fin) * sc, top, fin * sc, max * sc, 'var(--text)', 'stroke-width="0"');
    for (let i = 0; i < cells; i++) {
      const d = depths[i % N], x = ox + fin * sc + i * (w + fin) * sc, fill = (max - d) * sc;
      if (fill > 0.5) b += rect(x, bot - fill, w * sc, fill, 'url(#hatchWood)');
      if (i < N) b += text(x + (w * sc) / 2, bot + back * sc + 16, L(d), { size: 9.5, bold: true });
    }
    b += dimV(ox + (cells * (w + fin) + fin) * sc + 16, top, bot, 'max ' + L(max)) + dimH(ox + fin * sc, ox + (fin + w) * sc, top - 10, L(w));
    b += text(390, bot + back * sc + 36, 'Numbers = well depth from the front of the fins (one period)', { size: 11, muted: true });
    return svg(W, H, b, 'QRD drawing');
  };

  /* ---- cloud: side elevation ---- */
  DR.cloud = function ({ w = 1.2, l = 1.8, d = 0.1, drop = 0.2, ceil = 2.6 }) {
    const W = 760, H = 300, sc = Math.min(560 / l, 160 / (drop + d + 0.3));
    const ox = 100, oy = 40;
    let b = text(380, 24, 'SIDE ELEVATION', { bold: true, muted: true });
    b += rect(ox - 40, oy, l * sc + 80, 16, 'url(#hatchConc)') + text(ox - 46, oy + 12, 'ceiling', { anchor: 'end', size: 10, muted: true });
    const cy = oy + 16 + drop * sc;
    [0.1, 0.9].forEach((k) => (b += `<line x1="${ox + k * l * sc}" y1="${oy + 16}" x2="${ox + k * l * sc}" y2="${cy}" stroke="var(--accent2)" stroke-width="2"/>`));
    b += rect(ox, cy, l * sc, d * sc, 'url(#hatchWool)') + `<rect x="${ox}" y="${cy}" width="${l * sc}" height="${d * sc}" fill="none" stroke="${col.fabric}" stroke-width="3"/>`;
    b += dimV(ox + l * sc + 26, oy + 16, cy, 'drop ' + L(drop)) + dimV(ox + l * sc + 26, cy, cy + d * sc, L(d)) + dimH(ox, ox + l * sc, cy + d * sc + 26, L(l) + ' × ' + L(w));
    b += callout(ox + 0.1 * l * sc, oy + 16 + drop * sc * 0.5, ox - 10, oy + 70, 'rated cable / eye bolt into joist');
    b += text(ox + (l * sc) / 2, cy + d * sc + 60, `Bottom at ${L(ceil - drop - d)} above floor · both faces absorb`, { size: 11, muted: true });
    return svg(W, H, b, 'Cloud drawing');
  };

  /* ---- skyline: top view with block heights ---- */
  DR.skyline = function ({ N = 7, block = 0.05, unit = 0.025 }) {
    const g = P.skylineGrid(N), W = 640, H = 420, sc = Math.min(340 / (N * block), 40);
    const ox = 40, oy = 40;
    let b = text(ox + (N * block * sc) / 2, 26, 'TOP VIEW — block height in ' + A.lenLabel('mm'), { bold: true, muted: true });
    g.forEach((row, i) => row.forEach((v, j) => { b += rect(ox + j * block * sc, oy + i * block * sc, block * sc, block * sc, `color-mix(in srgb, var(--c3) ${15 + (v / (N - 1)) * 75}%, var(--bg2))`, 'stroke-width=".5"'); b += text(ox + (j + 0.5) * block * sc, oy + (i + 0.5) * block * sc + 4, v ? A.fmt(A.lenDisplay(v * unit * 1000, 'mm'), 1) : '—', { size: Math.max(7, Math.min(10, block * sc / 3)) }); }));
    b += dimH(ox, ox + N * block * sc, oy + N * block * sc + 22, L(N * block));
    b += text(ox + N * block * sc + 20, oy + 20, `Block ${L(block)} square`, { anchor: 'start', size: 11 });
    b += text(ox + N * block * sc + 20, oy + 40, `Height unit ${L(unit)}`, { anchor: 'start', size: 11 });
    return svg(W, H, b, 'Skyline drawing');
  };

  /* ---- isolation + absorption in one wall (section) ---- */
  DR.hybridWall = function ({ base = 'masonry', isoGap = 0.05, leafLayers = 2, stud = 0.07, treat = 0.1, airTreat = 0.05, fabric = true, label = '' }) {
    const W = 780, H = 340, total = (base === 'masonry' ? 0.2 : 0.12) + isoGap + stud + leafLayers * 0.016 + airTreat + treat;
    const sc = 620 / Math.max(total, 0.3), oy = 76, hh = 190;
    let x = 60, b = text(390, 16, 'WALL SECTION — outside ← → inside the room' + (label ? ' · ' + label : ''), { bold: true, muted: true });
    const seg = (w, fill, name, extra) => { const s = rect(x, oy, w * sc, hh, fill, extra) + text(x + (w * sc) / 2, oy + hh + 18, name, { size: 9.5 }) + `<line x1="${x}" y1="${oy + hh + 26}" x2="${x}" y2="${oy + hh + 34}" stroke="var(--muted)"/>`; const d = { x0: x, w }; x += w * sc; return [s, d]; };
    const parts = [];
    const push = (a) => { b += a[0]; parts.push(a[1]); };
    push(seg(base === 'masonry' ? 0.2 : 0.12, base === 'masonry' ? 'url(#hatchConc)' : 'url(#hatchWood)', base === 'masonry' ? 'existing masonry' : 'existing stud wall'));
    push(seg(isoGap, col.air, 'gap'));
    push(seg(stud, 'url(#hatchWool)', 'indep. studs + wool'));
    for (let i = 0; i < leafLayers; i++) push(seg(0.016, 'var(--muted)', i === leafLayers - 1 ? 'gypsum ×' + leafLayers : ''));
    push(seg(airTreat, col.air, 'air'));
    push(seg(treat, 'url(#hatchWool)', 'acoustic wool'));
    if (fabric) b += `<line x1="${x + 2}" y1="${oy - 6}" x2="${x + 2}" y2="${oy + hh + 6}" stroke="${col.fabric}" stroke-width="4"/>` + text(x + 8, oy - 10, 'stretched fabric', { anchor: 'start', size: 10, bold: true });
    b += `<rect x="${parts[1].x0}" y="${oy - 30}" width="${(parts[parts.length - 3].x0 + parts[parts.length - 3].w * sc) - parts[1].x0}" height="10" fill="var(--accent2)" opacity=".5"/>` + text((parts[1].x0 + parts[parts.length - 3].x0) / 2, oy - 34, 'ISOLATION (airtight, decoupled)', { size: 10, bold: true });
    const t0 = parts[parts.length - 2].x0;
    b += `<rect x="${t0}" y="${oy - 30}" width="${x - t0}" height="10" fill="var(--accent)" opacity=".5"/>` + text((t0 + x) / 2, oy - 34, 'TREATMENT', { size: 10, bold: true });
    b += dimH(60, x, oy + hh + 56, 'total depth ' + L(total));
    return svg(W, H, b, 'Integrated isolation and absorption wall');
  };

  /* ---- hidden room treatment (plan) ---- */
  DR.hiddenRoom = function ({ L: RL = 6, W: RW = 4.5, depth = 0.25 }) {
    const W = 760, H = 460, sc = Math.min(560 / RL, 380 / RW), ox = 60, oy = 40, d = depth * sc;
    let b = text(ox + (RL * sc) / 2, 26, 'PLAN — what you see is fabric; what works is behind it', { bold: true, muted: true });
    b += rect(ox, oy, RL * sc, RW * sc, 'url(#hatchConc)');
    b += rect(ox + 10, oy + 10, RL * sc - 20, RW * sc - 20, 'var(--bg2)');
    // zones
    const zone = (x, y, w, h, fill, label) => rect(x, y, w, h, fill, 'stroke-width=".5"') + text(x + w / 2, y + h / 2 + 4, label, { size: 9.5 });
    b += zone(ox + 10, oy + 10, d, RW * sc - 20, 'url(#hatchWool)', '');
    b += zone(ox + RL * sc - 10 - d * 1.4, oy + 10, d * 1.4, RW * sc - 20, 'url(#hatchWool)', '');
    b += zone(ox + 10 + d, oy + 10, RL * sc - 20 - d * 2.4, d * 0.6, 'url(#hatchWool)', '') + zone(ox + 10 + d, oy + RW * sc - 10 - d * 0.6, RL * sc - 20 - d * 2.4, d * 0.6, 'url(#hatchWool)', '');
    [[ox + 10, oy + 10], [ox + 10, oy + RW * sc - 10], [ox + RL * sc - 10, oy + 10], [ox + RL * sc - 10, oy + RW * sc - 10]].forEach(([x, y]) => { const sx = x < ox + 100 ? 1 : -1, sy = y < oy + 100 ? 1 : -1; b += `<polygon points="${x},${y} ${x + sx * d * 2},${y} ${x},${y + sy * d * 2}" fill="var(--c4)" opacity=".55" stroke="var(--text)" stroke-width=".6"/>`; });
    // QRD behind fabric on rear wall
    for (let i = 0; i < 7; i++) b += rect(ox + RL * sc - 10 - d * 1.4 + 4, oy + RW * sc * 0.3 + i * 10, (([0, 1, 4, 2, 2, 4, 1][i]) / 4) * d * 0.7 + 2, 8, 'var(--c3)', 'stroke-width=".4"');
    b += `<rect x="${ox + 10 + d}" y="${oy + 10 + d * 0.6}" width="${RL * sc - 20 - d * 2.4}" height="${RW * sc - 20 - d * 1.2}" fill="none" stroke="${col.fabric}" stroke-width="3"/>`;
    b += callout(ox + 10 + d / 2, oy + RW * sc / 2, ox + 10 + d + 40, oy + RW * sc / 2 + 30, 'front: deep broadband');
    b += callout(ox + 10 + d, oy + 10 + d, ox + 10 + d + 40, oy + RW * sc * 0.2, 'corner bass traps (tri-corners)');
    b += callout(ox + RL * sc - 10 - d * 0.7, oy + RW * sc * 0.45, ox + RL * sc - 110, oy + RW * sc * 0.6, 'rear: diffuser behind fabric');
    b += callout(ox + RL * sc / 2, oy + 10 + d * 0.3, ox + RL * sc / 2 + 30, oy + RW * sc * 0.3, 'side walls: wool at reflection points');
    b += callout(ox + 10 + d + 30, oy + RW * sc - 10 - d * 0.6, ox + 220, oy + RW * sc - 60, 'stretched fabric on frame = the visible finish');
    b += dimH(ox, ox + RL * sc, oy + RW * sc + 24, L(RL)) + dimV(ox + RL * sc + 24, oy, oy + RW * sc, L(RW));
    return svg(W, H, b, 'Hidden treatment plan');
  };

  /* ---- floated timber floor section ---- */
  DR.floatFloor = function ({ deck = 0.036, gyp = 1, sleeper = 0.095, pad = 0.025, spacing = 0.4 }) {
    const W = 760, H = 260, sc = 140 / (deck + gyp * 0.0125 + sleeper + pad + 0.1), ox = 40, oy = 40, wd = 680;
    let b = text(380, 24, 'SECTION — floated timber floor', { bold: true, muted: true });
    let y = oy;
    b += rect(ox, y, wd, deck * sc / 2, 'url(#hatchWood)') + rect(ox, y + deck * sc / 2, wd, deck * sc / 2, 'url(#hatchWood)'); y += deck * sc;
    for (let i = 0; i < gyp; i++) { b += rect(ox, y, wd, 0.0125 * sc, 'var(--muted)'); y += 0.0125 * sc; }
    const n = Math.max(2, Math.round((wd / sc) / spacing));
    b += rect(ox, y, wd, sleeper * sc, 'url(#hatchWool)', 'opacity=".8"');
    for (let i = 0; i <= n; i++) { const x = ox + (i * wd) / n - (i === n ? 45 * sc / 1000 * 1000 * 0.045 : 0); b += rect(Math.min(x, ox + wd - 0.045 * sc), y, 0.045 * sc, sleeper * sc, 'url(#hatchWood)'); b += rect(Math.min(x, ox + wd - 0.045 * sc) - 3, y + sleeper * sc, 0.045 * sc + 6, pad * sc, 'var(--accent2)'); }
    y += sleeper * sc + pad * sc;
    b += rect(ox, y, wd, 22, 'url(#hatchConc)') + text(ox + wd / 2, y + 15, 'structural slab', { size: 10 });
    b += rect(ox - 12, oy - 10, 10, y - oy + 10, 'var(--c4)') + text(ox - 16, oy - 14, 'perimeter strip', { anchor: 'start', size: 10 });
    b += dimV(ox + wd + 16, oy, oy + deck * sc, 'deck ' + L(deck)) + dimV(ox + wd + 16, y - pad * sc - sleeper * sc, y - pad * sc, 'sleeper ' + L(sleeper)) + dimH(ox, ox + wd / n, y + 44, 'pad spacing ' + L(spacing));
    return svg(W, H, b, 'Floated floor drawing');
  };

  /* ---- window plug section ---- */
  DR.windowPlug = function ({ w = 1.0, h = 1.2, board = 0.036, wool = 0.05 }) {
    const W = 700, H = 300, sc = 200 / h, ox = 120, oy = 50;
    let b = text(350, 26, 'SECTION through window reveal', { bold: true, muted: true });
    b += rect(ox - 40, oy - 20, 40, h * sc + 40, 'url(#hatchConc)') + rect(ox + 160, oy - 20, 40, h * sc + 40, 'url(#hatchConc)');
    b += `<line x1="${ox + 6}" y1="${oy}" x2="${ox + 6}" y2="${oy + h * sc}" stroke="var(--accent2)" stroke-width="3"/>` + text(ox + 6, oy + h * sc + 18, 'glass', { size: 10 });
    b += rect(ox + 40, oy, wool * sc * 4, h * sc, 'url(#hatchWool)') + rect(ox + 40 + wool * sc * 4, oy, board * sc * 4, h * sc, 'url(#hatchWood)');
    b += `<rect x="${ox + 36}" y="${oy - 6}" width="${wool * sc * 4 + board * sc * 4 + 8}" height="6" fill="${col.seal}"/><rect x="${ox + 36}" y="${oy + h * sc}" width="${wool * sc * 4 + board * sc * 4 + 8}" height="6" fill="${col.seal}"/>`;
    b += callout(ox + 40 + wool * sc * 4 + board * sc * 2, oy + 40, ox + 260, oy + 30, `laminated board ${L(board)}`) + callout(ox + 40 + wool * sc * 2, oy + h * sc * 0.6, ox + 260, oy + h * sc * 0.55, `wool ${L(wool)} faces the glass`) + callout(ox + 40, oy - 3, ox + 260, oy + h * sc * 0.85, 'compressible seal = airtight');
    b += dimV(ox - 56, oy, oy + h * sc, L(h), -1);
    return svg(W, H, b, 'Window plug drawing');
  };
})();
