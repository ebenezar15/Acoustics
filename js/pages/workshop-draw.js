/* Workshop: extra builds + parametric, dimensioned drawings with live acoustic predictions. */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  LIB.workshop.push(
    { id: 'skyline', name: '2-D Skyline Diffuser', level: 'Intermediate', time: '1–2 days', cost: '$$', summary: 'A block diffuser that scatters in both planes — great on rear walls and ceilings.', materials: ['Square timber stock (e.g. 45 × 45 mm or 50 × 50 mm)', 'Backing board 12 mm ply/MDF', 'Wood glue', 'Finish'], tools: ['Mitre / table saw with a stop block', 'Clamps', 'Grid template'], steps: ['Generate the height grid (drawing below).', 'Cut blocks to each height with a stop block; sort into labelled bins.', 'Mark a grid on the backing board.', 'Glue blocks in place row by row, checking against the drawing.', 'Finish; hang on a French cleat.'], tips: ['Accuracy of the pattern matters more than exact heights.', 'Rotate neighbouring tiles 90° to reduce periodicity.'], calc: 'diffusers' },
    { id: 'fabric-wall', name: 'Stretched-Fabric Acoustic Wall (hidden treatment)', level: 'Advanced', time: '3–5 days', cost: '$$$', summary: 'A timber or aluminium frame with wool behind acoustically transparent fabric — the whole wall becomes treatment, and nothing is visible.', materials: ['Timber battens or a fabric-track system', 'Mineral wool (40–60 kg/m³) to fill the zone depth', 'Acoustically transparent fabric (blow test), fire-rated', 'Solid infill panels where reflective zones are wanted', 'Staples / track inserts'], tools: ['Saw, drill, staple gun', 'Laser level', 'Fabric stretching tools'], steps: ['Mark the “fabric line” at a constant depth around the room.', 'Build the frame on that line; integrate sockets, lights and grilles first.', 'Fill zones: deep wool in corners & front, wool at reflection points, diffusers or solid panels where planned.', 'Fix a black scrim behind the fabric so the wool doesn’t show through.', 'Stretch the fabric evenly, working from the centre to the edges.'], tips: ['Fabric must be stretched off the wool and off diffuser wells.', 'Keep isolation leaf airtight behind — never fix through it with gaps.'], calc: 'treatment' },
    { id: 'integrated-wall', name: 'Integrated Isolation + Treatment Wall', level: 'Advanced', time: '1 week', cost: '$$$', summary: 'One wall depth that isolates and treats: independent airtight leaf, then a fabric-faced absorber zone.', materials: ['Independent studs (not touching the existing wall)', 'Wool for the isolation cavity', '2 layers dense gypsum, sealed', 'Second light frame + wool for the treatment zone', 'Fabric'], tools: ['Framing and drywall tools', 'Acoustic sealant'], steps: ['Build the independent stud frame with a gap to the existing wall.', 'Insulate the isolation cavity.', 'Apply two gypsum layers, staggered seams; seal perimeters with acoustic sealant.', 'Build the treatment frame in front; fill with wool (leave an air gap behind the wool for extra LF).', 'Finish with fabric.'], tips: ['Use the Treatment Simulator → Hidden & integrated tab to split the depth.', 'Services penetrations: seal the isolation leaf with putty pads; the treatment zone is free for cables.'], calc: 'treatment' },
  );

  const PANEL_MASS = { '3hb': ['3 mm hardboard', 2.9, 0.003], '6ply': ['6 mm plywood', 3.6, 0.006], '9ply': ['9 mm plywood', 5.4, 0.009], '12gyp': ['12.5 mm gypsum', 9.5, 0.0125] };
  const BUILDERS = {
    'broadband-panel': (host) => ctl(host, [
      { key: 'w', label: 'Width', type: 'range', min: 300, max: 1200, step: 10, value: 600, unit: 'mm' },
      { key: 'h', label: 'Height', type: 'range', min: 300, max: 2400, step: 10, value: 1200, unit: 'mm' },
      { key: 'd', label: 'Wool thickness', type: 'range', min: 25, max: 200, step: 5, value: 100, unit: 'mm' },
      { key: 'gap', label: 'Air gap behind', type: 'range', min: 0, max: 300, step: 5, value: 100, unit: 'mm' },
    ], (s) => {
      const a = (f) => P.porousAlpha(f, 12000, s.d / 1000, s.gap / 1000);
      return { svg: DR.panel({ w: s.w / 1000, h: s.h / 1000, d: s.d / 1000, gap: s.gap / 1000 }), stats: [['α @125 Hz', fmt(a(125), 2)], ['α @250 Hz', fmt(a(250), 2)], ['α @500 Hz', fmt(a(500), 2)], ['Sabins @250 Hz', fmt(a(250) * s.w * s.h / 1e6, 2)]], cut: [`2 × ${A.fmtLen(s.h / 1000)} and 2 × ${A.fmtLen(s.w / 1000 - 0.036)} frame pieces, ${A.fmtLen(s.d / 1000)} deep`, `Wool ${A.fmtLen(s.w / 1000 - 0.036)} × ${A.fmtLen(s.h / 1000 - 0.036)} × ${A.fmtLen(s.d / 1000)}`, `Fabric ${A.fmtLen(s.w / 1000 + 2 * s.d / 1000 + 0.1)} × ${A.fmtLen(s.h / 1000 + 2 * s.d / 1000 + 0.1)}`, `4 stand-offs ${A.fmtLen(s.gap / 1000)}`] };
    }),
    superchunk: (host) => ctl(host, [
      { key: 'leg', label: 'Triangle leg', type: 'range', min: 300, max: 900, step: 10, value: 600, unit: 'mm' },
      { key: 'H', label: 'Ceiling height', type: 'range', min: 2000, max: 4000, step: 10, value: 2400, unit: 'mm' },
      { key: 't', label: 'Slab thickness', type: 'range', min: 50, max: 150, step: 5, value: 100, unit: 'mm' },
    ], (s) => {
      const n = Math.ceil(s.H / s.t);
      return { svg: DR.superchunk({ leg: s.leg / 1000, H: s.H / 1000, t: s.t / 1000 }), stats: [['Layers', n], ['Slabs needed', Math.ceil(n / 2)], ['Face area', fmt((s.leg / 1000) * Math.SQRT2 * s.H / 1000, 2) + ' m²'], ['Wool volume', fmt(0.5 * (s.leg / 1000) ** 2 * s.H / 1000, 2) + ' m³']], cut: [`Cut ${Math.ceil(n / 2)} slabs of ${A.fmtLen(s.leg / 1000)} × ${A.fmtLen(2 * s.leg / 1000)} into two right triangles each`, 'Stack from floor to ceiling', `Fabric face ${A.fmtLen(s.leg / 1000 * Math.SQRT2 + 0.1)} × ${A.fmtLen(s.H / 1000)}`] };
    }),
    'membrane-trap': (host) => ctl(host, [
      { key: 'f0', label: 'Target mode', type: 'range', min: 30, max: 200, step: 1, value: 60, unit: 'Hz' },
      { key: 'p', label: 'Membrane', type: 'select', value: '6ply', options: Object.entries(PANEL_MASS).map(([k, v]) => [k, `${v[0]} (${v[1]} kg/m²)`]) },
      { key: 'w', label: 'Width', type: 'range', min: 400, max: 1200, step: 10, value: 600, unit: 'mm' },
      { key: 'h', label: 'Height', type: 'range', min: 400, max: 2000, step: 10, value: 1200, unit: 'mm' },
    ], (s) => {
      const [nm, m, tp] = PANEL_MASS[s.p]; const D = Math.pow(50 / s.f0, 2) / m;
      return { svg: DR.membrane({ w: s.w / 1000, h: s.h / 1000, D, tp, wool: Math.min(0.05, D * 0.4) }), stats: [['Cavity depth', A.fmtLen(D), D > 0.4 ? 'deep — choose a heavier membrane' : ''], ['Tuned to', fmtHz(50 / Math.sqrt(m * D))], ['Panel', nm], ['Box volume', fmt(D * s.w * s.h / 1e6 * 1000, 0) + ' L']], cut: [`Sides: 2 × ${A.fmtLen(s.h / 1000)} and 2 × ${A.fmtLen(s.w / 1000 - 0.036)} of 18 mm stock, ${A.fmtLen(D)} deep`, `Back ${A.fmtLen(s.w / 1000)} × ${A.fmtLen(s.h / 1000)}`, `Membrane ${A.fmtLen(s.w / 1000)} × ${A.fmtLen(s.h / 1000)} ${nm}`, `Wool on the back, ${A.fmtLen(Math.min(0.05, D * 0.4))} thick`, 'Weatherstrip around the membrane edge'] };
    }),
    'slot-wall': (host) => ctl(host, [
      { key: 'slat', label: 'Slat width', type: 'range', min: 20, max: 150, step: 1, value: 70, unit: 'mm' },
      { key: 'slot', label: 'Slot width', type: 'range', min: 2, max: 30, step: 1, value: 8, unit: 'mm' },
      { key: 't', label: 'Slat thickness', type: 'range', min: 9, max: 40, step: 1, value: 18, unit: 'mm' },
      { key: 'D', label: 'Cavity depth', type: 'range', min: 30, max: 300, step: 5, value: 100, unit: 'mm' },
    ], (s) => {
      const o = { t: s.t / 1000, slot: true, slotW: s.slot / 1000, open: P.slotOpenArea(s.slot / 1000, s.slat / 1000), D: s.D / 1000, fillSigma: 10000, fabricR: 100 };
      return { svg: DR.slot({ slat: s.slat / 1000, gap: s.slot / 1000, t: s.t / 1000, D: s.D / 1000 }), stats: [['Tuned to', fmtHz(P.perforatedF0(o))], ['Open area', fmt(o.open * 100, 1) + ' %'], ['α at tuning', fmt(P.perforatedAlpha(P.perforatedF0(o), o), 2)], ['Slats per metre', fmt(1000 / (s.slat + s.slot), 1)]], cut: [`Slats ${A.fmtLen(s.slat / 1000)} × ${A.fmtLen(s.t / 1000)}`, `Spacer for ${A.fmtLen(s.slot / 1000)} slots`, `Frame ${A.fmtLen(s.D / 1000)} deep, fully filled with wool`, 'Black fabric behind the slats'] };
    }),
    qrd: (host) => ctl(host, [
      { key: 'N', label: 'Prime N', type: 'select', value: 7, numeric: true, options: [[5, '5'], [7, '7'], [11, '11'], [13, '13']] },
      { key: 'f0', label: 'Design frequency', type: 'range', min: 300, max: 2000, step: 10, value: 500, unit: 'Hz' },
      { key: 'w', label: 'Well width', type: 'range', min: 25, max: 120, step: 1, value: 50, unit: 'mm' },
      { key: 'per', label: 'Periods', type: 'range', min: 1, max: 3, step: 1, value: 1 },
    ], (s) => {
      const d = P.wellDepths(P.qrdSequence(s.N), s.N, s.f0);
      return { svg: DR.qrd({ depths: d, w: s.w / 1000, periods: s.per }), stats: [['Working band', fmtHz(s.f0) + '–' + fmtHz(P.diffuserFmax(s.w / 1000))], ['Max depth', A.fmtLen(Math.max(...d))], ['Width', A.fmtLen((s.N * (s.w + 6) + 6) / 1000 * s.per)]], cut: d.map((x, i) => `Well ${i + 1}: depth ${A.fmtLen(x)} (filler ${A.fmtLen(Math.max(...d) - x)})`) };
    }),
    skyline: (host) => ctl(host, [
      { key: 'N', label: 'Prime N', type: 'select', value: 7, numeric: true, options: [[5, '5'], [7, '7'], [11, '11'], [13, '13']] },
      { key: 'b', label: 'Block size', type: 'range', min: 25, max: 100, step: 1, value: 50, unit: 'mm' },
      { key: 'f0', label: 'Design frequency', type: 'range', min: 400, max: 2500, step: 10, value: 1000, unit: 'Hz' },
    ], (s) => {
      const unit = P.C / (2 * s.N * s.f0);
      return { svg: DR.skyline({ N: s.N, block: s.b / 1000, unit }), stats: [['Height unit', A.fmtLen(unit)], ['Tallest block', A.fmtLen(unit * (s.N - 1))], ['Tile size', A.fmtLen(s.N * s.b / 1000)], ['Blocks per tile', s.N * s.N - 1]], cut: ['Cut each height in a batch with a stop block', 'Label bins by height index'] };
    }),
    cloud: (host) => ctl(host, [
      { key: 'w', label: 'Width', type: 'range', min: 600, max: 2400, step: 10, value: 1200, unit: 'mm' },
      { key: 'l', label: 'Length', type: 'range', min: 600, max: 3000, step: 10, value: 1800, unit: 'mm' },
      { key: 'd', label: 'Wool thickness', type: 'range', min: 50, max: 200, step: 5, value: 100, unit: 'mm' },
      { key: 'drop', label: 'Drop from ceiling', type: 'range', min: 50, max: 600, step: 10, value: 200, unit: 'mm' },
    ], (s) => ({ svg: DR.cloud({ w: s.w / 1000, l: s.l / 1000, d: s.d / 1000, drop: s.drop / 1000 }), stats: [['α @125 Hz', fmt(P.porousAlpha(125, 12000, s.d / 1000, s.drop / 1000), 2)], ['α @500 Hz', fmt(P.porousAlpha(500, 12000, s.d / 1000, s.drop / 1000), 2)], ['Area', fmt(s.w * s.l / 1e6, 2) + ' m²']], cut: [`Frame ${A.fmtLen(s.l / 1000)} × ${A.fmtLen(s.w / 1000)} × ${A.fmtLen(s.d / 1000)}`, '4 rated suspension points'] })),
    'window-plug': (host) => ctl(host, [
      { key: 'w', label: 'Reveal width', type: 'range', min: 400, max: 2400, step: 10, value: 1000, unit: 'mm' },
      { key: 'h', label: 'Reveal height', type: 'range', min: 400, max: 2400, step: 10, value: 1200, unit: 'mm' },
      { key: 'b', label: 'Board total', type: 'range', min: 18, max: 60, step: 1, value: 36, unit: 'mm' },
    ], (s) => ({ svg: DR.windowPlug({ w: s.w / 1000, h: s.h / 1000, board: s.b / 1000 }), stats: [['Plug mass', fmt(750 * s.b / 1000, 1) + ' kg/m²'], ['Weight', fmt(750 * s.b / 1000 * s.w * s.h / 1e6, 1) + ' kg']], cut: [`Board ${A.fmtLen(s.w / 1000 - 0.006)} × ${A.fmtLen(s.h / 1000 - 0.006)} (3 mm clearance each side for seal)`] })),
    'floated-floor': (host) => ctl(host, [
      { key: 'deck', label: 'Deck (2 layers) total', type: 'range', min: 30, max: 60, step: 1, value: 36, unit: 'mm' },
      { key: 'gyp', label: 'Gypsum layers', type: 'range', min: 0, max: 2, step: 1, value: 1 },
      { key: 'sl', label: 'Sleeper depth', type: 'range', min: 45, max: 150, step: 5, value: 95, unit: 'mm' },
      { key: 'sp', label: 'Pad spacing', type: 'range', min: 300, max: 600, step: 10, value: 400, unit: 'mm' },
    ], (s) => { const m = s.deck * 0.62 + s.gyp * 10 + 6; return { svg: DR.floatFloor({ deck: s.deck / 1000, gyp: s.gyp, sleeper: s.sl / 1000, spacing: s.sp / 1000 }), stats: [['Floated mass', fmt(m, 0) + ' kg/m²'], ['Pads per m²', fmt(1 / Math.pow(s.sp / 1000, 2), 1)], ['Air spring f', fmtHz(P.floatingF0(P.airStiffness(s.sl / 1000, true), m + 30))]], cut: ['Size pads in the Floating Floor Designer'] }; }),
    'integrated-wall': (host) => ctl(host, [
      { key: 'iso', label: 'Isolation stud depth', type: 'range', min: 45, max: 150, step: 5, value: 70, unit: 'mm' },
      { key: 'tr', label: 'Treatment zone depth', type: 'range', min: 50, max: 400, step: 5, value: 150, unit: 'mm' },
    ], (s) => { const leaf = P.leafProps([{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }]), base = P.leafProps([{ mat: 'cmu', t: 0.19 }]); const stc = P.stc(P.STC_BANDS.map((f) => P.doubleLeafTL({ leaf1: base, leaf2: leaf, d: (s.iso + 20) / 1000, filled: true, conn: 'none' }, P.exactThird(f)).tl)); return { svg: DR.hybridWall({ base: 'masonry', isoGap: 0.02, stud: s.iso / 1000, leafLayers: 2, airTreat: s.tr * 0.3 / 1000, treat: s.tr * 0.7 / 1000 }), stats: [['Wall STC (est.)', stc], ['α @ 80 Hz', fmt(P.porousAlpha(80, 7000, s.tr * 0.7 / 1000, s.tr * 0.3 / 1000), 2)], ['α @ 125 Hz', fmt(P.porousAlpha(125, 7000, s.tr * 0.7 / 1000, s.tr * 0.3 / 1000), 2)]], cut: ['Treatment zone: wool against the fabric, air behind it'] }; }),
    'fabric-wall': (host) => ctl(host, [{ key: 'L', label: 'Room length', type: 'range', min: 3000, max: 10000, step: 50, value: 6200, unit: 'mm' }, { key: 'W', label: 'Room width', type: 'range', min: 2500, max: 8000, step: 50, value: 4600, unit: 'mm' }, { key: 'd', label: 'Zone depth', type: 'range', min: 100, max: 500, step: 10, value: 250, unit: 'mm' }], (s) => ({ svg: DR.hiddenRoom({ L: s.L / 1000, W: s.W / 1000, depth: s.d / 1000 }), stats: [['Floor lost', fmt(((s.L * s.W) - (s.L - 2 * s.d) * (s.W - 2 * s.d)) / 1e6, 1) + ' m²'], ['Fabric area (walls, 2.6 m)', fmt(2 * (s.L + s.W) / 1000 * 2.6, 0) + ' m²']], cut: ['Plan zones before framing'] })),
  };
  BUILDERS['clips-wall'] = BUILDERS['integrated-wall'];
  BUILDERS['double-stud'] = BUILDERS['integrated-wall'];

  function ctl(host, spec, fn) {
    const card = el('div', { class: 'card' }); host.appendChild(card);
    card.appendChild(html('<h3 style="margin-top:0">Dimensioned drawing — change the sizes</h3><p class="small">All dimensions follow the unit selector at the top of the page.</p>'));
    const out = el('div'), stats = el('div', { class: 'stats' }), cut = el('div');
    const st = A.controls(card, spec, () => draw());
    card.append(stats, out, cut);
    function draw() { const r = fn(st); out.innerHTML = r.svg; stats.innerHTML = r.stats.map(([k, v, d]) => A.statBox(k, v, d)).join(''); cut.innerHTML = r.cut ? `<h4>Cut list</h4><ul>${r.cut.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''; }
    draw();
  }
  const THUMBS = {
    'broadband-panel': () => DR.panel({}), superchunk: () => DR.superchunk({}), 'membrane-trap': () => DR.membrane({}), 'slot-wall': () => DR.slot({}),
    qrd: () => DR.qrd({ depths: P.wellDepths(P.qrdSequence(7), 7, 500) }), skyline: () => DR.skyline({ N: 7, block: 0.05, unit: 0.025 }), cloud: () => DR.cloud({}),
    'window-plug': () => DR.windowPlug({}), 'floated-floor': () => DR.floatFloor({}), 'integrated-wall': () => DR.hybridWall({}), 'clips-wall': () => DR.hybridWall({ base: 'stud' }), 'double-stud': () => DR.hybridWall({ base: 'stud', isoGap: 0.03 }), 'fabric-wall': () => DR.hiddenRoom({}),
  };
  A.workshopThumb = (id) => (THUMBS[id] ? THUMBS[id]() : '');
  A.workshopDrawing = (id, host) => { if (BUILDERS[id]) { BUILDERS[id](host); return true; } return false; };
})();
