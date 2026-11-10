/* ==========================================================================
   Acoustica — dimensioned studio PLANS with toggleable layers
   (isolation, treatment, gear, electrical, HVAC). Data-driven SVG.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html } = A;
  const R = (x, y, w, h, label, wall, sub, lx, ly) => ({ t: 'room', x, y, w, h, label, wall, sub, lx, ly });
  const D = (x, y, w, dir, opts = {}) => Object.assign({ t: 'door', x, y, w, dir }, opts);
  const W = (x, y, w, dir, opts = {}) => Object.assign({ t: 'win', x, y, w, dir }, opts);
  const I = (k, x, y, w, h, o = {}) => Object.assign({ t: 'item', k, x, y, w, h }, o);
  const N = (n, x, y) => ({ t: 'note', n, x, y });
  const DIM = (x1, y1, x2, y2, off = 0.5) => ({ t: 'dim', x1, y1, x2, y2, off });

  /* ---------------------------------------------------------------- data */
  const PLANS = {
    bedroom: {
      name: 'Bedroom studio', size: [3.6, 3.0], height: '2.4 m',
      budget: 'Low · mostly treatment, light isolation',
      els: [
        R(0, 0, 3.6, 3.0, 'Bedroom studio', 'ext', '3.6 × 3.0 × 2.4 m', 2.6, 1.25),
        D(2.55, 0, 0.82, 'h', { sw: 1, type: 'std' }), W(3.6, 0.55, 0.95, 'v', { plug: true }),
        I('trap', 0, 0, 0.55, 0.55, { c: 'tl' }), I('trap', 0, 2.45, 0.55, 0.55, { c: 'bl' }), I('trap', 3.05, 2.45, 0.55, 0.55, { c: 'br' }),
        I('panel', 0.75, 0.0, 0.9, 0.1), I('panel', 0.75, 2.9, 0.9, 0.1), I('panel', 0, 0.85, 0.12, 1.3, { label: 'front wall absorber' }),
        I('cloud', 0.75, 0.85, 1.1, 1.3), I('panel', 3.4, 1.65, 0.2, 1.2, { label: '200 mm rear absorber' }),
        I('desk', 0.45, 0.95, 0.6, 1.1), I('spk', 0.5, 0.9, 0.2, 0.2), I('spk', 0.5, 1.9, 0.2, 0.2), I('seat', 1.25, 1.35, 0.3, 0.3),
        I('bed', 2.0, 1.75, 1.4, 1.25, { label: 'bed + duvet = bass absorber' }), I('rack', 1.1, 0.15, 0.5, 0.4, { label: 'rack' }),
        I('outlet', 0.1, 0.6, 0.12, 0.12), I('outlet', 0.1, 2.25, 0.12, 0.12), I('hvac', 2.0, 0.0, 0.5, 0.15, { label: 'mini-split (low fan)' }),
        DIM(0, 3.0, 3.6, 3.0, 0.35), DIM(3.6, 0, 3.6, 3.0, 0.35), DIM(0, 2.7, 1.37, 2.7, 0),
        N(1, 1.4, 1.2), N(2, 0.25, 0.25), N(3, 3.5, 1.0), N(4, 2.95, 0.15),
      ],
      notes: ['Listening seat at about 38 % of the room length (1.37 m), speakers and seat forming an equilateral triangle, everything symmetrical about the centre line.', 'Floor-to-ceiling corner traps (100 mm wool + air, or superchunks) in every corner you can reach.', 'Removable window plug: 36 mm board + 50 mm wool, sealed with weatherstrip — +10 to +20 dB when recording.', 'Solid-core door with perimeter seals and an automatic drop seal — the cheapest real isolation upgrade.'],
      spec: [['Isolation', 'Seal the door (solid core + seals), window plug, rugs over hard floors. Expect ≈ 30–35 dB — enough for normal mixing, not for drums.'], ['Treatment', '4 corner traps, side and ceiling first-reflection panels (100 mm + 50 mm gap), 200 mm rear wall, front wall absorber behind the speakers.'], ['Gear & layout', 'Desk on the short wall, speakers on stands ≥ 20 cm from the wall, tweeters at ear height.'], ['Electrical', 'One quality power strip for all audio gear on one circuit; laptop charger on the same strip.'], ['HVAC', 'Ductless mini-split on its lowest fan setting; door undercut replaced by a silenced transfer duct if fresh air is needed.']],
    },
    basement: {
      name: 'Basement studio', size: [7.2, 5.0], height: '2.6 m (slab to joists)',
      budget: 'Medium · room-in-room ceiling, concrete floor',
      els: [
        R(0, 0, 4.2, 3.9, 'Control room', 'rir', '4.2 × 3.9 m, 2.35 m clear', 2.8, 0.55), R(4.5, 0, 2.7, 2.4, 'Vocal booth', 'rir', '2.7 × 2.4 m', 5.6, 0.6),
        R(4.5, 2.7, 2.7, 2.3, 'Lobby / sound lock', 'int', null, 5.75, 4.5), R(0, 4.2, 2.0, 0.8, 'Machine & HVAC', 'int', null, 1.0, 4.4), R(2.2, 4.2, 2.3, 0.8, 'Corridor', 'int', null, 3.0, 4.85),
        D(3.25, 3.9, 0.82, 'h', { sw: 1, type: 'acoustic' }), D(5.4, 2.4, 0.82, 'h', { sw: -1, type: 'acoustic' }), D(4.5, 4.0, 0.9, 'v', { sw: 1, type: 'std' }), D(7.2, 3.4, 0.9, 'v', { sw: -1, type: 'std' }),
        W(4.2, 0.5, 1.2, 'v', { studio: true }),
        I('trap', 0, 0, 0.7, 0.7, { c: 'tl' }), I('trap', 0, 3.2, 0.7, 0.7, { c: 'bl' }), I('trap', 3.5, 3.2, 0.7, 0.7, { c: 'br' }), I('trap', 3.5, 0, 0.7, 0.7, { c: 'tr' }),
        I('panel', 0.9, 0, 1.2, 0.12), I('panel', 0.9, 3.78, 1.2, 0.12), I('cloud', 0.9, 0.9, 1.5, 2.1), I('diff', 3.95, 1.0, 0.25, 1.9, { label: 'rear diffuser' }),
        I('desk', 0.55, 1.2, 0.7, 1.5), I('spk', 0.25, 1.05, 0.25, 0.25), I('spk', 0.25, 2.6, 0.25, 0.25), I('seat', 1.45, 1.8, 0.3, 0.3), I('sofa', 2.6, 3.25, 0.8, 0.5, { label: 'client couch' }),
        I('panel', 4.5, 0, 2.7, 0.12), I('panel', 7.08, 0, 0.12, 2.4), I('mic', 5.9, 1.1, 0.2, 0.2), I('trap', 6.6, 1.8, 0.6, 0.6, { c: 'br' }),
        I('rack', 0.2, 4.35, 0.6, 0.5, { label: 'amps / computer' }), I('hvac', 1.0, 4.3, 0.8, 0.5, { label: 'air handler' }),
        I('duct', 1.8, 4.5, 0.12, 0, { path: [[1.8, 4.55], [2.2, 4.55], [2.2, 4.0], [1.6, 4.0], [1.6, 3.6]] }), I('duct', 1.8, 4.5, 0, 0, { path: [[2.4, 4.55], [4.35, 4.55], [4.35, 2.55], [5.9, 2.55], [5.9, 2.2]] }),
        I('silencer', 1.4, 3.85, 0.45, 0.25), I('silencer', 5.6, 2.45, 0.5, 0.25),
        I('panelboard', 0.05, 4.75, 0.35, 0.2), I('outlet', 0.1, 1.0, 0.12, 0.12), I('outlet', 0.1, 2.75, 0.12, 0.12), I('outlet', 6.95, 0.3, 0.12, 0.12),
        DIM(0, 5.0, 7.2, 5.0, 0.35), DIM(7.2, 0, 7.2, 5.0, 0.35), DIM(0, 0, 4.2, 0, -0.35),
        N(1, 3.0, 1.1), N(2, 4.35, 1.4), N(3, 6.6, 3.9), N(4, 1.8, 4.6), N(5, 0.4, 3.5),
      ],
      notes: ['Room-in-room ceiling: independent joists or isolation hangers + 2 layers of 16 mm gypsum, wool in the cavity. The concrete slab already makes an excellent floor — do not float it unless you record drums above someone.', 'Studio window between control room and booth: two panes of different thickness (e.g. 10 mm and 12.8 mm laminated), ≥ 100 mm apart, absorbent reveals, one pane tilted a few degrees.', 'Lobby / sound lock: two sealed doors in series give 55–65 dB where a single door gives 35–45.', 'Air handler and amps live outside the studio. Every duct crossing an isolation wall gets a silencer; velocity under 2 m/s at the grilles.', 'Basements are damp: dehumidify, use moisture-tolerant insulation against concrete, and keep a vapour-open detail. Check egress/fire codes before building rooms.'],
      spec: [['Isolation', 'Inner-leaf walls on their own track, 2 × 16 mm gypsum, 25 mm gap to the foundation wall; ceiling on hangers; two acoustic doors via the lobby.'], ['Treatment', '4 floor-to-ceiling corner traps, side & ceiling reflection panels, rear diffuser (room depth > 3.5 m allows it), booth lined with 100–150 mm absorption.'], ['Gear', 'Desk on the 3.9 m wall, speakers on stands or soffits, couch at the back (it is also a bass absorber).'], ['Electrical', 'Dedicated technical-power sub-panel; all audio circuits from it; audio and power routed together (zero loop area).'], ['HVAC', 'Ducted, low-velocity system with silencers and lined flex; return air via silenced transfer ducts through the lobby.']],
    },
    detached: {
      name: 'Detached home studio (garden building)', size: [8.4, 5.6], height: '3.0 m external, 2.6 m inside',
      budget: 'Medium-high · new build, full room-in-room',
      els: [
        R(0, 0, 8.4, 5.6, '', 'ext'), R(0.3, 0.3, 4.6, 4.2, 'Control room', 'rir', '4.6 × 4.2 m', 3.4, 0.8), R(5.2, 0.3, 2.9, 3.3, 'Live room', 'rir', '2.9 × 3.3 m', 6.6, 2.6),
        R(5.2, 3.9, 2.9, 1.4, 'Entry / sound lock', 'int'), R(0.3, 4.8, 2.4, 0.5, 'Plant', 'int', null, 2.2, 5.1), R(3.0, 4.8, 1.9, 0.5, 'WC / store', 'int'),
        D(4.9, 3.6, 0.82, 'v', { sw: -1, type: 'acoustic' }), D(6.2, 3.6, 0.82, 'h', { sw: -1, type: 'acoustic' }), D(8.4, 4.1, 0.95, 'v', { sw: -1, type: 'ext' }),
        W(4.9, 0.9, 1.2, 'v', { studio: true }), W(2.0, 0, 1.4, 'h', { studio: true, label: 'daylight (studio double window)' }), W(8.4, 0.9, 1.2, 'v', { studio: true }),
        I('trap', 0.3, 0.3, 0.75, 0.75, { c: 'tl' }), I('trap', 0.3, 3.75, 0.75, 0.75, { c: 'bl' }), I('trap', 4.15, 3.75, 0.75, 0.75, { c: 'br' }), I('trap', 4.15, 0.3, 0.75, 0.75, { c: 'tr' }),
        I('soffit', 0.3, 1.05, 0.45, 0.5), I('soffit', 0.3, 3.25, 0.45, 0.5), I('desk', 0.95, 1.6, 0.75, 1.6), I('seat', 1.95, 2.25, 0.3, 0.3),
        I('panel', 1.2, 4.38, 1.6, 0.12), I('cloud', 1.1, 1.3, 1.7, 2.3), I('diff', 4.6, 1.5, 0.3, 1.5, { label: 'diffsorber' }),
        I('drums', 6.0, 0.8, 1.2, 1.1), I('diff', 5.2, 0.3, 2.9, 0.25, { label: 'diffuser' }), I('panel', 7.98, 1.0, 0.12, 2.0),
        I('hvac', 0.4, 4.85, 0.9, 0.4, { label: 'heat pump + ERV' }), I('duct', 0, 0, 0, 0, { path: [[1.3, 5.05], [2.8, 5.05], [2.8, 4.6]] }), I('duct', 0, 0, 0, 0, { path: [[2.8, 5.05], [5.0, 5.05], [5.0, 3.75], [6.65, 3.75], [6.65, 3.5]] }), I('silencer', 2.6, 4.55, 0.45, 0.22), I('silencer', 6.35, 3.6, 0.5, 0.22),
        I('panelboard', 1.4, 4.85, 0.3, 0.2), I('outlet', 0.45, 2.35, 0.12, 0.12), I('outlet', 7.9, 3.3, 0.12, 0.12),
        DIM(0, 5.6, 8.4, 5.6, 0.35), DIM(8.4, 0, 8.4, 5.6, 0.35), DIM(0.3, 0.3, 4.9, 0.3, -0.6),
        N(1, 2.5, 3.2), N(2, 0.55, 1.95), N(3, 6.6, 4.5), N(4, 1.6, 5.05), N(5, 7.6, 2.9),
      ],
      notes: ['Outer shell: timber frame with 2 layers of board and a heavy external cladding; inner rooms on their own frames, 25–50 mm air gap, never touching the shell.', 'Hard soffit (flush) mounting for the main monitors in a dense, massive front baffle — no front-wall notch, cleaner bass.', 'Entry sound lock: the outside door never opens straight into a studio room.', 'Plant room outside the inner rooms: heat pump + energy-recovery ventilator; lined ducts and silencers at every penetration.', 'Live room with a diffuser on one long wall and broadband absorption opposite — live but no flutter; floor floated on rubber pads if drums are played here.'],
      spec: [['Isolation', 'Slab-on-grade base, floated inner floors (pads or springs) in the live room, room-in-room walls and ceilings, studio windows and acoustic doors. Expect 60–70 dB.'], ['Treatment', 'Soffit-mounted mains, corner traps, ceiling cloud, rear diffsorber; live room with mixed diffusion/absorption.'], ['Daylight', 'Studio-grade double window on the side wall away from the speakers, with internal blinds; skylight with a deep, lined well (optional).'], ['Electrical', 'Sub-panel in the plant room, technical power for audio, separate lighting circuits with LED drivers that do not buzz.'], ['HVAC', 'Heat pump + ERV, low-velocity ducts, baffle boxes, lined flex; door undercuts never used for return air.']],
    },
    pro: {
      name: 'Professional recording facility', size: [22, 15], height: '4.5–6 m clear',
      budget: 'High · purpose-built, structural isolation',
      els: [
        R(0, 0, 22, 15, '', 'ext'), R(0.8, 0.8, 6.6, 6.2, 'Control room A', 'rir', '6.6 × 6.2 m', 4.6, 6.3), R(8.0, 0.8, 9.0, 6.8, 'Live room', 'rir', '9.0 × 6.8 m, 5 m high', 12.5, 6.2),
        R(17.5, 0.8, 3.7, 3.2, 'Iso booth 1', 'rir'), R(17.5, 4.3, 3.7, 3.3, 'Iso booth 2', 'rir'), R(0.8, 8.4, 3.4, 3.6, 'VO / ADR booth', 'rir', null, 2.5, 11.4),
        R(4.6, 8.4, 4.8, 4.4, 'Mix / edit room B', 'rir', null, 7.6, 12.2), R(9.8, 8.4, 2.6, 3.0, 'Machine room', 'int', null, 11.1, 10.6), R(9.8, 11.7, 2.6, 2.5, 'Plant', 'int', null, 11.1, 13.6),
        R(12.8, 8.4, 4.6, 5.8, 'Lounge / kitchen', 'int'), R(17.8, 8.4, 3.4, 5.8, 'Reception', 'int'), R(0.8, 7.2, 20.4, 0.9, 'Sound-lock corridor', 'int'), R(0.8, 12.3, 3.4, 1.9, 'Store', 'int'),
        D(3.8, 7.0, 1.0, 'h', { sw: 1, type: 'acoustic' }), D(11.5, 7.6, 1.2, 'h', { sw: 1, type: 'acoustic' }), D(18.8, 4.0, 0.9, 'h', { sw: -1, type: 'acoustic' }), D(19.0, 7.6, 0.9, 'h', { sw: 1, type: 'acoustic' }),
        D(2.0, 8.4, 0.9, 'h', { sw: -1, type: 'acoustic' }), D(6.5, 8.4, 0.9, 'h', { sw: -1, type: 'acoustic' }), D(22, 10.5, 1.2, 'v', { sw: -1, type: 'ext' }),
        W(7.4, 2.4, 2.4, 'v', { studio: true }), W(17.0, 1.8, 1.4, 'v', { studio: true }), W(17.0, 5.2, 1.4, 'v', { studio: true }), W(14, 15, 3, 'h', { label: 'daylight' }),
        I('soffit', 0.8, 2.2, 0.7, 0.9), I('soffit', 0.8, 4.7, 0.7, 0.9), I('desk', 1.9, 2.8, 1.0, 2.6), I('seat', 3.2, 3.95, 0.35, 0.35), I('sofa', 5.6, 3.3, 0.9, 1.6),
        I('trap', 0.8, 0.8, 1.0, 1.0, { c: 'tl' }), I('trap', 0.8, 6.0, 1.0, 1.0, { c: 'bl' }), I('diff', 7.0, 1.5, 0.4, 4.8, { label: 'rear diffuser array' }), I('cloud', 1.8, 2.0, 3.0, 4.2),
        I('drums', 13.5, 2.0, 2.0, 1.8), I('piano', 9.0, 4.2, 2.4, 1.5), I('diff', 8.0, 0.8, 9.0, 0.35, { label: 'diffusers' }), I('panel', 8.0, 7.25, 9.0, 0.35, { label: 'variable panels' }),
        I('mic', 19.2, 2.3, 0.25, 0.25), I('mic', 19.2, 5.8, 0.25, 0.25), I('mic', 2.4, 10.2, 0.25, 0.25), I('desk', 5.0, 9.8, 0.8, 1.8), I('spk', 4.8, 9.6, 0.25, 0.25), I('spk', 4.8, 11.4, 0.25, 0.25),
        I('rack', 10.1, 8.7, 2.0, 0.6, { label: 'racks (quiet)' }), I('hvac', 10.1, 12.0, 1.8, 1.0, { label: 'AHU' }), I('panelboard', 12.0, 12.0, 0.3, 0.3),
        I('duct', 0, 0, 0, 0, { path: [[11.0, 11.9], [11.0, 7.65], [4.0, 7.65], [4.0, 7.0]] }), I('duct', 0, 0, 0, 0, { path: [[11.0, 7.65], [15.0, 7.65], [15.0, 7.6]] }), I('duct', 0, 0, 0, 0, { path: [[15.0, 7.65], [19.4, 7.65], [19.4, 7.6]] }),
        I('silencer', 3.7, 7.45, 0.6, 0.3), I('silencer', 14.7, 7.45, 0.6, 0.3), I('silencer', 19.1, 7.45, 0.6, 0.3), I('silencer', 10.8, 11.5, 0.5, 0.3),
        DIM(0, 15, 22, 15, 0.6), DIM(22, 0, 22, 15, 0.6), N(1, 4, 0.6), N(2, 12.5, 6.4), N(3, 11, 7.65), N(4, 3.6, 9.2), N(5, 10.4, 13.0),
      ],
      notes: ['Each studio room is a separate structural box on its own floated slab (springs or rubber mounts), with seismic and fire detailing — 70–90 dB room-to-room is typical.', 'Live room with variable acoustics: hinged or rotating panels, diffusers high on the walls, 4.5–6 m ceiling for a natural, open sound.', 'Sound-lock corridor: every studio is entered through two doors; the corridor is treated so it does not ring.', 'VO/ADR booth sized ≥ 3 × 3.5 m so the voice is not boxy, NC 15, lined deeply; picture monitor behind glass or a silent display.', 'Plant and machine rooms away from studios, on their own isolated slab; ducts reach each room through silencers and baffle boxes.'],
      spec: [['Isolation', 'Structural room-in-room with floated slabs, independent walls & ceilings, double studio windows, acoustic door pairs. NC 15 in recording rooms.'], ['Treatment', 'Control room designed to a chosen philosophy (RFZ / non-environment / full-band neutral), measured and tuned; live room variable.'], ['Speakers', 'Hard or soft flush-mounted mains, mid-fields on stands, near-fields on the console bridge, subwoofers integrated in the front wall.'], ['Electrical', 'Isolated technical-power system per the local code, star distribution from one point, zero loop area cable routing, separate lighting with quiet drivers.'], ['HVAC', 'Central low-velocity AHU, lined ducts, silencers at every room, VAV boxes outside the studios, night setback; fresh-air rates per occupancy.']],
    },
  };

  /* ---------------------------------------------------------------- render */
  const LAYERS = [['iso', 'Isolation'], ['treat', 'Treatment'], ['gear', 'Gear & furniture'], ['elec', 'Electrical'], ['hvac', 'HVAC'], ['dims', 'Dimensions & notes']];
  function svgPlan(P0) {
    const [SW, SH] = P0.size, pad = 0.9, sc = 100 / Math.max(SW, SH) * 9;
    const X = (v) => (v + pad) * sc, Y = (v) => (v + pad) * sc, L = (v) => v * sc;
    const vbW = X(SW + pad), vbH = Y(SH + pad);
    const out = [];
    const txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 0.2 * sc}" text-anchor="${o.anchor || 'middle'}" ${o.weight ? `font-weight="${o.weight}"` : ''} fill="${o.fill || 'var(--text)'}">${s}</text>`;
    P0.els.filter((e) => e.t === 'room').forEach((r) => {
      const t = r.wall === 'ext' ? 0.25 : r.wall === 'rir' ? 0.12 : 0.1;
      out.push(`<g class="L-base"><rect x="${X(r.x)}" y="${Y(r.y)}" width="${L(r.w)}" height="${L(r.h)}" fill="${r.wall === 'rir' ? 'color-mix(in srgb, var(--accent) 5%, var(--panel))' : 'var(--panel)'}" stroke="var(--text)" stroke-width="${L(t)}"/></g>`);
      if (r.wall === 'rir') out.push(`<g class="L-iso"><rect x="${X(r.x + 0.16)}" y="${Y(r.y + 0.16)}" width="${L(r.w - 0.32)}" height="${L(r.h - 0.32)}" fill="none" stroke="var(--accent)" stroke-width="${L(0.035)}" stroke-dasharray="${L(0.12)} ${L(0.08)}" opacity=".8"/></g>`);
      const lx = r.lx != null ? r.lx : r.x + r.w / 2, ly = r.ly != null ? r.ly : r.y + r.h / 2;
      if (r.label) out.push(`<g class="L-base">${txt(X(lx), Y(ly) - (r.sub ? 0.08 * sc : 0), r.label, { weight: 700, size: Math.min(0.24 * sc, L(r.w) / (r.label.length * 0.55)) })}${r.sub ? txt(X(lx), Y(ly) + 0.2 * sc, r.sub, { size: Math.min(0.16 * sc, L(r.w) / (r.sub.length * 0.5)), fill: 'var(--muted)' }) : ''}</g>`);
    });
    P0.els.forEach((e) => {
      if (e.t === 'door') {
        const sw = e.sw || 1, ac = e.type === 'acoustic';
        if (e.dir === 'h') out.push(`<g class="L-iso"><rect x="${X(e.x)}" y="${Y(e.y) - L(0.13)}" width="${L(e.w)}" height="${L(0.26)}" fill="var(--panel)"/><path d="M${X(e.x)} ${Y(e.y)} l0 ${L(e.w) * sw} A${L(e.w)} ${L(e.w)} 0 0 ${sw > 0 ? 0 : 1} ${X(e.x + e.w)} ${Y(e.y)}" fill="none" stroke="${ac ? 'var(--accent)' : 'var(--muted)'}" stroke-width="${L(ac ? 0.05 : 0.03)}"/>${ac ? `<line x1="${X(e.x)}" y1="${Y(e.y)}" x2="${X(e.x + e.w)}" y2="${Y(e.y)}" stroke="var(--good)" stroke-width="${L(0.05)}"/>` : ''}</g>`);
        else out.push(`<g class="L-iso"><rect x="${X(e.x) - L(0.13)}" y="${Y(e.y)}" width="${L(0.26)}" height="${L(e.w)}" fill="var(--panel)"/><path d="M${X(e.x)} ${Y(e.y)} l${L(e.w) * sw} 0 A${L(e.w)} ${L(e.w)} 0 0 ${sw > 0 ? 1 : 0} ${X(e.x)} ${Y(e.y + e.w)}" fill="none" stroke="${ac ? 'var(--accent)' : 'var(--muted)'}" stroke-width="${L(ac ? 0.05 : 0.03)}"/>${ac ? `<line x1="${X(e.x)}" y1="${Y(e.y)}" x2="${X(e.x)}" y2="${Y(e.y + e.w)}" stroke="var(--good)" stroke-width="${L(0.05)}"/>` : ''}</g>`);
      } else if (e.t === 'win') {
        const col = 'var(--c3)';
        const g = e.dir === 'h' ? `<rect x="${X(e.x)}" y="${Y(e.y) - L(0.12)}" width="${L(e.w)}" height="${L(0.24)}" fill="var(--panel)" stroke="${col}" stroke-width="${L(0.02)}"/><line x1="${X(e.x)}" y1="${Y(e.y) - L(0.05)}" x2="${X(e.x + e.w)}" y2="${Y(e.y) - L(0.05)}" stroke="${col}" stroke-width="${L(0.03)}"/>${e.studio ? `<line x1="${X(e.x)}" y1="${Y(e.y) + L(0.06)}" x2="${X(e.x + e.w)}" y2="${Y(e.y) + L(0.06)}" stroke="${col}" stroke-width="${L(0.03)}"/>` : ''}`
          : `<rect x="${X(e.x) - L(0.12)}" y="${Y(e.y)}" width="${L(0.24)}" height="${L(e.w)}" fill="var(--panel)" stroke="${col}" stroke-width="${L(0.02)}"/><line x1="${X(e.x) - L(0.05)}" y1="${Y(e.y)}" x2="${X(e.x) - L(0.05)}" y2="${Y(e.y + e.w)}" stroke="${col}" stroke-width="${L(0.03)}"/>${e.studio ? `<line x1="${X(e.x) + L(0.06)}" y1="${Y(e.y)}" x2="${X(e.x) + L(0.06)}" y2="${Y(e.y + e.w)}" stroke="${col}" stroke-width="${L(0.03)}"/>` : ''}`;
        out.push(`<g class="L-iso">${g}${e.plug ? `<rect x="${X(e.x) - L(0.2)}" y="${Y(e.y)}" width="${L(0.08)}" height="${L(e.w)}" fill="var(--accent2)" opacity=".7"/>` : ''}</g>`);
      } else if (e.t === 'item') {
        const x = X(e.x), y = Y(e.y), w = L(e.w), h = L(e.h);
        const lab = e.label ? txt(x + w / 2, y + h / 2 + 0.06 * sc, e.label, { size: Math.min(0.14 * sc, Math.max(w, h) / (e.label.length * 0.5)), fill: 'var(--text)' }) : '';
        switch (e.k) {
          case 'trap': { const pts = { tl: [[x, y], [x + w, y], [x, y + h]], tr: [[x + w, y], [x + w, y + h], [x, y]], bl: [[x, y + h], [x, y], [x + w, y + h]], br: [[x + w, y + h], [x, y + h], [x + w, y]] }[e.c]; out.push(`<g class="L-treat"><polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="var(--c4)" opacity=".75"/></g>`); break; }
          case 'panel': out.push(`<g class="L-treat"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--c4)" opacity=".8"/>${e.label && Math.max(w, h) > 1.5 * sc ? lab : ''}</g>`); break;
          case 'cloud': out.push(`<g class="L-treat"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--c4)" opacity=".12" stroke="var(--c4)" stroke-dasharray="${L(0.1)} ${L(0.06)}" stroke-width="${L(0.03)}"/>${txt(x + w / 2, y + L(0.25), 'ceiling cloud above', { size: 0.13 * sc, fill: 'var(--muted)' })}</g>`); break;
          case 'diff': { const n = Math.max(3, Math.round(Math.max(w, h) / L(0.12))); let s = ''; for (let i = 0; i < n; i++) { const d = ((i * 3) % 5 + 1) / 5; s += w > h ? `<rect x="${x + (i * w) / n}" y="${y}" width="${w / n - 0.5}" height="${h * d}" fill="var(--accent2)" opacity=".75"/>` : `<rect x="${x + w * (1 - d)}" y="${y + (i * h) / n}" width="${w * d}" height="${h / n - 0.5}" fill="var(--accent2)" opacity=".75"/>`; } out.push(`<g class="L-treat">${s}</g>`); break; }
          case 'desk': out.push(`<g class="L-gear"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${L(0.05)}" fill="var(--panel2)" stroke="var(--text)" stroke-width="${L(0.02)}"/>${txt(x + w / 2, y + h / 2, 'desk', { size: 0.13 * sc, fill: 'var(--muted)' })}</g>`); break;
          case 'spk': case 'soffit': out.push(`<g class="L-gear"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${e.k === 'soffit' ? 'var(--text)' : 'var(--accent)'}"/><g class="pl-wave"><path d="M${x + w + L(0.1)} ${y + h / 2 - L(0.15)} q${L(0.1)} ${L(0.15)} 0 ${L(0.3)}" fill="none" stroke="var(--accent)" stroke-width="${L(0.025)}"/><path d="M${x + w + L(0.25)} ${y + h / 2 - L(0.25)} q${L(0.16)} ${L(0.25)} 0 ${L(0.5)}" fill="none" stroke="var(--accent)" stroke-width="${L(0.02)}"/></g></g>`); break;
          case 'seat': out.push(`<g class="L-gear"><circle cx="${x + w / 2}" cy="${y + h / 2}" r="${w / 2}" fill="var(--good)"/></g>`); break;
          case 'mic': out.push(`<g class="L-gear"><circle cx="${x + w / 2}" cy="${y + h / 2}" r="${w / 2}" fill="var(--bad)"/>${txt(x + w / 2, y + h + L(0.2), 'mic', { size: 0.12 * sc, fill: 'var(--muted)' })}</g>`); break;
          case 'sofa': case 'bed': case 'piano': case 'drums': case 'rack': out.push(`<g class="L-gear"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${L(0.08)}" fill="var(--panel2)" stroke="var(--muted)" stroke-width="${L(0.02)}"/>${txt(x + w / 2, y + h / 2 + 0.05 * sc, e.label || e.k, { size: Math.min(0.15 * sc, w / ((e.label || e.k).length * 0.5)), fill: 'var(--muted)' })}</g>`); break;
          case 'outlet': out.push(`<g class="L-elec"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--warn)"/></g>`); break;
          case 'panelboard': out.push(`<g class="L-elec"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--warn)" stroke="var(--text)" stroke-width="${L(0.02)}"/>${txt(x + w / 2, y - L(0.06), 'tech power', { size: 0.12 * sc, fill: 'var(--warn)' })}</g>`); break;
          case 'hvac': out.push(`<g class="L-hvac"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--c3)" opacity=".35" stroke="var(--c3)" stroke-width="${L(0.02)}"/>${lab}</g>`); break;
          case 'silencer': out.push(`<g class="L-hvac"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--c3)" stroke="var(--text)" stroke-width="${L(0.015)}"/></g>`); break;
          case 'duct': out.push(`<g class="L-hvac"><polyline points="${e.path.map(([a, b]) => X(a) + ',' + Y(b)).join(' ')}" fill="none" stroke="var(--c3)" stroke-width="${L(0.09)}" opacity=".4"/><polyline class="pl-air" points="${e.path.map(([a, b]) => X(a) + ',' + Y(b)).join(' ')}" fill="none" stroke="var(--c3)" stroke-width="${L(0.03)}" stroke-dasharray="${L(0.1)} ${L(0.12)}"/></g>`); break;
          default: break;
        }
      } else if (e.t === 'dim') {
        const hz = e.y1 === e.y2, o = L(e.off);
        const x1 = X(e.x1) + (hz ? 0 : o), y1 = Y(e.y1) + (hz ? o : 0), x2 = X(e.x2) + (hz ? 0 : o), y2 = Y(e.y2) + (hz ? o : 0);
        const len = Math.hypot(e.x2 - e.x1, e.y2 - e.y1);
        out.push(`<g class="L-dims"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="${L(0.015)}" marker-start="url(#plTick)" marker-end="url(#plTick)"/>${hz ? txt((x1 + x2) / 2, y1 - L(0.07), A.fmtLen(len), { size: 0.17 * sc, fill: 'var(--muted)' }) : `<text transform="translate(${x1 + L(0.17)} ${(y1 + y2) / 2}) rotate(90)" text-anchor="middle" font-size="${0.17 * sc}" fill="var(--muted)">${A.fmtLen(len)}</text>`}</g>`);
      } else if (e.t === 'note') {
        out.push(`<g class="L-dims"><circle cx="${X(e.x)}" cy="${Y(e.y)}" r="${0.17 * sc}" fill="var(--accent)"/>${txt(X(e.x), Y(e.y) + 0.06 * sc, e.n, { size: 0.18 * sc, weight: 700, fill: 'var(--accent-ink)' })}</g>`);
      }
    });
    return `<svg class="plan-svg" viewBox="0 0 ${vbW} ${vbH}" role="img" aria-label="${P0.name} plan"><defs><pattern id="plHatch" width="${L(0.2)}" height="${L(0.2)}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="${L(0.2)}" stroke="var(--text)" stroke-width="${L(0.03)}"/></pattern><marker id="plTick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6"><line x1="5" y1="0" x2="5" y2="10" stroke="var(--muted)" stroke-width="1.5"/></marker></defs>${out.join('')}</svg>`;
  }

  V.STUDIO_PLANS = PLANS;
  V.studioPlan = function (host, kind) {
    const P0 = PLANS[kind];
    const wrap = el('div', { class: 'plan-wrap' });
    host.appendChild(wrap);
    wrap.appendChild(html(`<div class="row" style="justify-content:space-between;align-items:baseline"><h3 style="margin:0">${P0.name} — plan</h3><span class="small muted">Overall ${A.fmtLen(P0.size[0])} × ${A.fmtLen(P0.size[1])} · height ${P0.height} · ${P0.budget}</span></div>`));
    const tg = el('div', { class: 'plan-layers' });
    const box = el('div', { class: 'plan-box' }); box.innerHTML = svgPlan(P0);
    LAYERS.forEach(([k, l]) => { const id = 'pl_' + k + Math.random().toString(36).slice(2, 6); const lab = html(`<label class="pill plan-toggle on"><input type="checkbox" id="${id}" checked> ${l}</label>`); const inp = lab.querySelector('input'); inp.onchange = () => { box.classList.toggle('hide-' + k, !inp.checked); lab.classList.toggle('on', inp.checked); }; tg.appendChild(lab); });
    wrap.append(tg, box);
    wrap.appendChild(html(`<div class="plan-legend small"><span><i style="background:var(--accent)"></i>Inner (room-in-room) leaf</span><span><i style="background:var(--good)"></i>Acoustic door (seals)</span><span><i style="background:var(--c3)"></i>Window / HVAC</span><span><i style="background:var(--c4)"></i>Absorber / trap</span><span><i style="background:var(--accent2)"></i>Diffuser</span><span><i style="background:var(--warn)"></i>Electrical</span></div>`));
    wrap.appendChild(html(`<ol class="plan-notes">${P0.notes.map((n) => `<li>${n}</li>`).join('')}</ol>`));
    wrap.appendChild(html(`<div class="table-wrap"><table><tr><th>Layer</th><th>What goes in</th></tr>${P0.spec.map(([a, b]) => `<tr><td><b>${a}</b></td><td>${b}</td></tr>`).join('')}</table></div>`));
    const onUnit = () => { box.innerHTML = svgPlan(P0); };
    window.addEventListener('unitchange', onUnit); A.onLeave(() => window.removeEventListener('unitchange', onUnit));
  };
})();
