/* ==========================================================================
   Acoustica — "design language" widgets: reading finished studios, ceiling
   cloud arrays, timber slat walls, glass behind loudspeakers, finish
   palettes, immersive loudspeaker layouts, seat-to-seat bass consistency,
   loudspeakers hidden behind fabric and the dual-purpose living-room cinema.
   Simplified, indicative teaching models: right trends and magnitudes,
   not a substitute for a full calculation or a measurement.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, log10 = Math.log10, C0 = 343;
  const tp = (t) => Math.max(0, t);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fill(); };
  const seg = (ctx, x1, y1, x2, y2, c, wd = 1, dash) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = wd; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); };
  const box = (ctx, x, y, w, h, fill, stroke, lw = 1) => { if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h); } };
  const tips = (b, list, cls = 'mentor') => { b.innerHTML = `<div class="callout ${cls}"><ul style="margin:0;padding-left:18px">${list.map((x) => `<li>${x}</li>`).join('')}</ul></div>`; };
  const stats = (host) => { const o = el('div', { class: 'stats' }); host.appendChild(o); return o; };
  const OCT = [125, 250, 500, 1000, 2000, 4000];
  const octFmt = (f) => (f >= 1000 ? f / 1000 + 'k' : String(f));
  const mm = (v) => fmt(v, 0) + ' mm';
  const porous = (f, sigma, d, D) => { try { const a = P.porousAlpha(f, sigma, d, D); return isFinite(a) ? clamp(a, 0, 1) : 0.5; } catch (e) { return clamp(0.2 + 0.8 * Math.min(1, (d + D) * f / 86), 0, 1); } };

  /* ======================================================================
     1. Studio anatomy — what the fabric hides
     ====================================================================== */
  const KIND = { abs: ['c3', 'Absorption'], trap: ['c1', 'Bass trapping'], spk: ['accent', 'Loudspeaker'], air: ['c4', 'Quiet air'], iso: ['c6', 'Isolation'], diff: ['c2', 'Diffusion / scattering'], svc: ['c5', 'Services'] };
  const ARCH = {
    immersive: {
      name: 'Dark immersive mix room', tone: 'dark', roof: 'flat',
      note: 'A calm, dark interior. Every surface you see is fabric; almost everything that does acoustic work is behind it.',
      hid: [
        { k: 'trap', z: 'front', r: [1, 9, 8, 30], t: 'Front-wall bass trap', d: 'A deep cavity (often 400–600 mm) filled loosely with low-density wool or hung panels. It soaks up the bass the mains throw backwards, which weakens the boundary cancellation dip.' },
        { k: 'trap', z: 'rear', r: [89, 9, 10, 36], t: 'Deep rear-wall trap', d: 'The deepest absorber in the room. The rear wall returns the strongest low-frequency reflection to the seat; 500 mm or more here does more than any corner product.' },
        { k: 'abs', z: 'ceil', r: [24, 1.2, 40, 5], t: 'Ceiling absorber over the desk', d: 'Mineral wool with an air space above it. It removes the ceiling bounce between the front speakers and the seat.' },
        { k: 'spk', z: 'ceil', r: [38, 2.2, 5, 3.4], t: 'Hidden height loudspeaker', d: 'Overhead speakers sit in back-boxes behind acoustically transparent fabric, aimed at the listening area.' },
        { k: 'spk', z: 'ceil', r: [66, 2.2, 5, 3.4], t: 'Hidden rear height loudspeaker', d: 'Same idea further back. The back-box is sealed and heavy so the speaker does not leak into the ceiling void.' },
        { k: 'spk', z: 'rear', r: [89.5, 16, 4, 7], t: 'Hidden rear surround', d: 'Flush in a baffle behind the fabric. You see a plain wall; the fabric must pass treble freely.' },
        { k: 'air', z: 'ceil', r: [70, 1, 16, 3], t: 'Lined supply duct and slot diffuser', d: 'Big, slow, lined ductwork ending in a long slot. Low air speed is why you feel fresh air but hear nothing.' },
        { k: 'iso', z: 'floor', r: [0, 0.6, 100, 2.6], t: 'Floated floor', d: 'A heavy floor on resilient mounts, separated from the building slab so late-night work does not travel.' },
        { k: 'iso', z: 'shell', r: [0, 0, 100, 50], t: 'Room-within-a-room shell', d: 'Heavy double walls and lid with an air space, a sound-lock lobby and rated doors. None of it is visible from inside.' },
      ],
      seen: [['mains', 12, 24, 6, 23], ['sub', 19, 36, 6, 11], ['desk', 34, 38, 14, 9], ['chair', 50, 37, 4, 10], ['rug', 28, 47.6, 46, 1.2], ['sofa', 74, 39, 13, 8], ['wash', 30, 8, 0, 0], ['wash', 58, 8, 0, 0]],
    },
    daylight: {
      name: 'Daylight tracking room', tone: 'light', roof: 'high',
      note: 'Tall, white and bright. The treatment is visible but organised into a rhythm, so it reads as architecture.',
      hid: [
        { k: 'abs', z: 'room', r: [22, 7, 14, 2.2], t: 'Suspended cloud (lower tier)', d: 'A framed absorber hung on cables. Air above and around it means the back and edges absorb too.' },
        { k: 'abs', z: 'room', r: [40, 4, 14, 2.2], t: 'Suspended cloud (upper tier)', d: 'Staggered heights break up the flat ceiling plane, add scattering and stop flutter with the floor.' },
        { k: 'abs', z: 'room', r: [58, 7, 14, 2.2], t: 'Suspended cloud (lower tier)', d: 'The array covers roughly a third to a half of the ceiling. The rest stays hard so the room keeps its life.' },
        { k: 'abs', z: 'front', r: [1, 14, 4, 26], t: 'Tall fabric wall panel', d: 'Same proportion as the slit windows beside it. Alternating glass and absorber avoids big parallel reflective areas.' },
        { k: 'diff', z: 'rear', r: [90, 20, 6, 26], t: 'Timber-slat wall over wool', d: 'Slats scatter the highs and keep the room bright; the slots and wool behind absorb low-mids. It also frames the control-room window.' },
        { k: 'trap', z: 'rear', r: [90, 2, 9, 14], t: 'Mezzanine and bulkhead volume', d: 'Deep irregular volumes act as bass absorbers and break up the room\'s simple box shape.' },
        { k: 'iso', z: 'floor', r: [0, 0.6, 100, 2.6], t: 'Timber floor on an isolated slab', d: 'Hard, lively floor. Loose rugs are the adjustable part: roll them out to tame drums, pull them up for strings.' },
        { k: 'air', z: 'ceil', r: [6, 1, 14, 2.4], t: 'Low-velocity supply', d: 'Air is delivered slowly at high level so no ribbon microphone ever hears it.' },
      ],
      seen: [['window', 6, 12, 2.4, 28], ['piano', 30, 36, 18, 12], ['rug', 22, 47.6, 40, 1.2], ['glass', 91, 26, 0.8, 14], ['mezz', 78, 16, 22, 1.2], ['stair', 66, 16, 12, 32]],
    },
    street: {
      name: 'Street-front production suite', tone: 'light', roof: 'flat',
      note: 'A big window behind the monitors, a coffered ceiling and a sofa-filled back half. Comfort-first, but every part is doing a job.',
      hid: [
        { k: 'abs', z: 'ceil', r: [16, 2.4, 16, 4.4], t: 'Coffer-inset cloud', d: 'Each coffer holds a pale fabric absorber with a small downlight. The beam grid hides the fixings and adds depth for scattering.' },
        { k: 'abs', z: 'ceil', r: [38, 2.4, 16, 4.4], t: 'Coffer-inset cloud', d: 'Absorption over the listening and sofa areas cuts the ceiling bounce and conversation level.' },
        { k: 'abs', z: 'ceil', r: [60, 2.4, 16, 4.4], t: 'Coffer-inset cloud', d: 'Deep beams (150–250 mm) leave room for 100 mm of wool plus an air space.' },
        { k: 'trap', z: 'front', r: [1, 30, 8, 16], t: 'Low trap under the window', d: 'The dark band at desk height hides a deep absorber below the glass, behind the loudspeakers.' },
        { k: 'abs', z: 'rear', r: [89, 9, 10, 36], t: 'Deep fabric rear wall', d: 'A plain pale wall with thin vertical joints. Behind it: a deep broadband absorber, thinner towards the top.' },
        { k: 'diff', z: 'room', r: [58, 12, 14, 30], t: 'Dark slatted side wall', d: 'On the side wall behind the sofa. Slats over wool keep some sparkle while controlling low-mids.' },
        { k: 'iso', z: 'front', r: [0.2, 9, 1.2, 21], t: 'Heavy laminated glazing', d: 'Thick laminated glass in a deep frame, often two leaves with a wide gap, so the street stays outside.' },
      ],
      seen: [['window', 3, 9, 1.2, 21], ['curtain', 5, 8, 2, 39], ['mains', 13, 22, 6, 25], ['desk', 26, 38, 13, 9], ['chair', 41, 37, 4, 10], ['ottoman', 56, 42, 14, 5], ['sofa', 74, 39, 13, 8], ['rug', 24, 47.6, 54, 1.2], ['beam', 0, 0, 0, 0]],
    },
    attic: {
      name: 'Attic control room', tone: 'light', roof: 'pitch',
      note: 'A small room under a pitched roof. The slope is an asset: no parallel ceiling, and deep triangular voids for trapping.',
      hid: [
        { k: 'abs', z: 'roofL', r: [10, 1.4, 30, 3.6], t: 'Cloud plane on the front slope', d: 'A large absorber parallel to the rafters with a shadow gap and concealed light around it.' },
        { k: 'abs', z: 'roofR', r: [58, 1.4, 30, 3.6], t: 'Cloud plane on the rear slope', d: 'Follows the pitch so it looks built-in. The void above is extra low-frequency depth.' },
        { k: 'trap', z: 'front', r: [0.5, 28, 9, 18], t: 'Knee-wall trap (front)', d: 'The low triangle where roof meets floor is useless as floor space and perfect as a bass trap.' },
        { k: 'trap', z: 'rear', r: [90.5, 28, 9, 18], t: 'Knee-wall trap (rear)', d: 'Filled with low-density wool behind fabric. Often the deepest absorber in a small attic room.' },
        { k: 'abs', z: 'rear', r: [90.5, 18, 5, 10], t: 'Fabric wall with wool behind', d: 'Pale fabric with barely visible seams. Looks like plaster, behaves like a 100–150 mm absorber.' },
        { k: 'svc', z: 'room', r: [70, 40, 3, 3], t: 'Tie-line wall plate', d: 'Microphone and cue lines to the drum room arrive at a flush plate, so no cable crosses the doorway.' },
        { k: 'air', z: 'roofR', r: [72, -0.6, 12, 2], t: 'Quiet refrigerant air-conditioning', d: 'A variable-speed indoor unit placed outside the room, ducted in through lined flex and a large grille.' },
        { k: 'iso', z: 'floor', r: [0, 0.6, 100, 2.6], t: 'Decoupled floor over the garage', d: 'A floated deck stops footfall and drum energy reaching the structure below.' },
      ],
      seen: [['window', 1.5, 22, 1, 14], ['mon', 12, 26, 4, 7], ['desk', 14, 37, 14, 10], ['chair', 31, 37, 4, 10], ['rack', 40, 40, 8, 7], ['sofa', 68, 40, 14, 7], ['door', 86, 24, 1, 23]],
    },
    cinema: {
      name: 'Living-room cinema', tone: 'dark', roof: 'flat',
      note: 'An ordinary sitting room by day. The walls and ceiling that read as dark paint are fabric, and the loudspeakers are in the walls.',
      hid: [
        { k: 'spk', z: 'front', r: [3, 14, 4, 8], t: 'In-wall front loudspeaker', d: 'Flush in a braced baffle beside the screen, behind fabric or a paint-matched grille.' },
        { k: 'spk', z: 'ceil', r: [40, 2.2, 5, 3.2], t: 'In-ceiling height loudspeaker', d: 'In a sealed back-box between the joists.' },
        { k: 'spk', z: 'rear', r: [90, 16, 4, 7], t: 'In-wall surround', d: 'Invisible in use; the fabric must pass treble and the cavity around it must be lined.' },
        { k: 'abs', z: 'ceil', r: [14, 1.6, 22, 4.6], t: 'Absorptive ceiling behind fabric', d: 'The biggest free surface in a furnished room. 50–100 mm of wool behind a stretched ceiling lowers the decay without anyone noticing.' },
        { k: 'abs', z: 'rear', r: [94.5, 9, 4.5, 36], t: 'Fabric wall lining', d: '50 mm absorber between battens. Thin, so it mainly handles mid and high frequencies.' },
        { k: 'trap', z: 'front', r: [1, 26, 8, 20], t: 'Subwoofers and trap in the joinery', d: 'A cabinet under the screen hides subwoofers and a deep absorber behind a cloth front.' },
        { k: 'air', z: 'ceil', r: [66, 1, 18, 2.6], t: 'Re-tuned air system', d: 'Larger grilles and lined ducts so the existing system drops below the film\'s quiet scenes.' },
      ],
      seen: [['screen', 9.6, 12, 1, 18], ['sofa', 44, 39, 18, 8], ['sofa', 70, 39, 12, 8], ['rug', 26, 47.6, 50, 1.2], ['table', 32, 43, 9, 4], ['lamp', 86, 30, 0, 0]],
    },
    loft: {
      name: 'Loft writing room', tone: 'dark', roof: 'pitch',
      note: 'Comfort first: timber roof, heavy drapes, rugs, sofas and instruments everywhere. Moderately controlled rather than precise.',
      hid: [
        { k: 'diff', z: 'roofL', r: [8, -0.4, 34, 2], t: 'Rough timber-board ceiling', d: 'Reflective, but pitched and uneven, so it scatters instead of fluttering. Wool above the boards helps a little at low frequencies.' },
        { k: 'diff', z: 'roofR', r: [58, -0.4, 34, 2], t: 'Rough timber-board ceiling', d: 'A deliberately live surface balanced by a lot of soft furnishing below.' },
        { k: 'abs', z: 'front', r: [5, 10, 2.5, 37], t: 'Heavy full-height drapes', d: 'Lined, generously gathered curtains at the tall windows: adjustable absorption from about 250 Hz up.' },
        { k: 'abs', z: 'room', r: [22, 47.4, 50, 1.6], t: 'Layered rugs', d: 'Overlapping rugs on a timber floor remove the floor bounce where people play and sing.' },
        { k: 'abs', z: 'room', r: [62, 39, 16, 8], t: 'Sofas as absorbers', d: 'A deep upholstered sofa is a broadband absorber down to about 200 Hz, and a comfortable one.' },
        { k: 'diff', z: 'rear', r: [92, 14, 4, 26], t: 'Instruments and shelves', d: 'Guitars, books and shelving on the walls break up reflections the way a diffuser would.' },
        { k: 'trap', z: 'rear', r: [91, 30, 8.5, 16], t: 'Eaves storage as bass trap', d: 'Cupboards under the eaves stuffed with soft cases and wool tame the lowest modes a little.' },
      ],
      seen: [['window', 1.5, 12, 1, 30], ['mon', 13, 27, 4, 7], ['desk', 14, 38, 14, 9], ['chair', 31, 37, 4, 10], ['drums', 46, 38, 8, 9], ['lamp', 40, 18, 0, 0], ['lamp', 58, 14, 0, 0]],
    },
  };
  V.studioAnatomy = function (host) {
    const st = A.controls(host, [
      { key: 'arch', label: 'Room archetype', type: 'select', value: 'immersive', options: Object.entries(ARCH).map(([k, v]) => [k, v.name]) },
      { key: 'xray', label: 'X-ray: fade the finishes', type: 'range', min: 0, max: 100, step: 1, value: 35, unit: '%' },
      { key: 'labels', label: 'Label what is found', type: 'check', value: true },
    ], () => upd());
    const info = el('div'), tip = el('div');
    let hits = [], pick = -1;
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'A long section through the room: loudspeakers and front wall on the left, rear wall on the right. Slide the x-ray up to fade the fabric and see what is built behind it. Tap or hover any highlighted block for its job.',
      draw(ctx, w, h, t) {
        t = tp(t);
        const a = ARCH[st.arch], x = st.xray / 100, dark = a.tone === 'dark';
        const mx = 14, top = 14, bw = w - mx * 2, bh = h - top - 20;
        const X = (v) => mx + (v / 100) * bw, Y = (v) => top + (v / 50) * bh, SX = (v) => (v / 100) * bw, SY = (v) => (v / 50) * bh;
        const roof = (px) => (a.roof === 'pitch' ? 2 + 14 * Math.abs(px - 50) / 50 : a.roof === 'high' ? 0 : 3);
        const skinD = a.roof === 'pitch' ? 6 : 7;
        // shell
        ctx.fillStyle = A.alpha(A.css('muted'), 0.28);
        ctx.beginPath(); ctx.moveTo(X(-1.5), Y(51.5));
        for (let px = 0; px <= 100; px += 2) ctx.lineTo(X(px), Y(roof(px) - 1.8));
        ctx.lineTo(X(101.5), Y(51.5)); ctx.closePath(); ctx.fill();
        // interior
        const wallCol = dark ? '#2b2f36' : '#ece8df', fabCol = dark ? '#3a3f48' : '#e3ded2', airCol = A.css('bg2');
        ctx.fillStyle = airCol; ctx.beginPath(); ctx.moveTo(X(0), Y(50));
        for (let px = 0; px <= 100; px += 2) ctx.lineTo(X(px), Y(roof(px)));
        ctx.lineTo(X(100), Y(50)); ctx.closePath(); ctx.fill();
        // floor
        box(ctx, X(0), Y(47), SX(100), SY(3), A.alpha('#b58a5a', 0.75));
        // hidden items
        hits = [];
        const place = (it) => {
          let [rx, ry, rw, rh] = it.r;
          if (it.z === 'ceil') ry = roof(rx + rw / 2) + ry;
          else if (it.z === 'roofL' || it.z === 'roofR') ry = roof(rx + rw / 2) + ry + 0.5;
          else if (it.z === 'floor') ry = 47 + ry;
          return [rx, ry, rw, rh];
        };
        a.hid.forEach((it, i) => {
          if (it.z === 'shell') { hits.push({ i, x: X(-1.5), y: Y(-2), w: SX(103), h: SY(3.2), shell: true }); return; }
          const [rx, ry, rw, rh] = place(it), col = A.css(KIND[it.k][0]);
          const px = X(rx), py = Y(ry), pw = SX(rw), ph = SY(rh);
          ctx.save();
          if (it.z === 'roofL' || it.z === 'roofR') { const ang = Math.atan2(SY(14) * (it.z === 'roofL' ? -1 : 1), SX(50)); ctx.translate(px + pw / 2, py + ph / 2); ctx.rotate(ang); ctx.translate(-(px + pw / 2), -(py + ph / 2)); }
          ctx.globalAlpha = 0.25 + 0.75 * x;
          box(ctx, px, py, pw, ph, A.alpha(col, i === pick ? 0.9 : 0.55), col, i === pick ? 2.5 : 1.2);
          if (it.k === 'abs' || it.k === 'trap') { ctx.strokeStyle = A.alpha(col, 0.9); ctx.lineWidth = 0.8; for (let q = px + 4; q < px + pw - 1; q += 7) { ctx.beginPath(); ctx.moveTo(q, py + 2); ctx.quadraticCurveTo(q + 3, py + ph / 2, q, py + ph - 2); ctx.stroke(); } }
          if (it.k === 'spk') dot(ctx, px + pw / 2, py + ph / 2, Math.min(pw, ph) * 0.3, A.css('bg'));
          ctx.restore();
          hits.push({ i, x: px - 3, y: py - 3, w: pw + 6, h: ph + 6 });
        });
        // skin (fabric) fading with x-ray
        ctx.save(); ctx.globalAlpha = 1 - 0.93 * x;
        ctx.fillStyle = fabCol;
        if (a.tone === 'dark' || st.arch === 'street' || st.arch === 'attic') {
          ctx.fillRect(X(0), Y(roof(0)), SX(10), SY(47 - roof(0)));
          ctx.fillRect(X(88), Y(roof(100)), SX(12), SY(47 - roof(100)));
        }
        if (st.arch !== 'daylight' && st.arch !== 'loft') { ctx.beginPath(); for (let px = 0; px <= 100; px += 2) ctx.lineTo(X(px), Y(roof(px))); for (let px = 100; px >= 0; px -= 2) ctx.lineTo(X(px), Y(roof(px) + skinD)); ctx.closePath(); ctx.fill(); }
        if (st.arch === 'loft') { ctx.fillStyle = '#5a4634'; ctx.beginPath(); for (let px = 0; px <= 100; px += 2) ctx.lineTo(X(px), Y(roof(px))); for (let px = 100; px >= 0; px -= 2) ctx.lineTo(X(px), Y(roof(px) + 2)); ctx.closePath(); ctx.fill(); }
        // joints
        ctx.strokeStyle = A.alpha(dark ? '#000000' : '#8a8478', 0.5); ctx.lineWidth = 1;
        if (st.arch !== 'daylight' && st.arch !== 'loft') for (let px = 12; px < 100; px += 12) { ctx.beginPath(); ctx.moveTo(X(px), Y(roof(px) + skinD)); ctx.lineTo(X(px), Y(roof(px) + skinD - 1.4)); ctx.stroke(); }
        ctx.restore();
        // visible furniture
        const ink = A.css('text'), soft = A.alpha(ink, 0.75);
        a.seen.forEach(([k, rx, ry, rw, rh]) => {
          const px = X(rx), py = Y(ry), pw = SX(rw), ph = SY(rh);
          if (k === 'mains' || k === 'mon' || k === 'sub') { box(ctx, px, py, pw, ph, dark ? '#15171b' : '#30343b', A.css('line')); dot(ctx, px + pw / 2, py + ph * 0.3, pw * 0.22, '#7d8491'); if (k !== 'sub') dot(ctx, px + pw / 2, py + ph * 0.7, pw * 0.32, '#7d8491'); if (k === 'mon') seg(ctx, px + pw / 2, py + ph, px + pw / 2, Y(47), soft, 2); }
          else if (k === 'desk' || k === 'rack' || k === 'table' || k === 'ottoman') { box(ctx, px, py, pw, ph * 0.45, k === 'ottoman' ? '#b56a3c' : '#6b4a33'); box(ctx, px + pw * 0.08, py + ph * 0.45, pw * 0.08, ph * 0.55, soft); box(ctx, px + pw * 0.84, py + ph * 0.45, pw * 0.08, ph * 0.55, soft); }
          else if (k === 'chair') { box(ctx, px, py, pw * 0.3, ph * 0.6, soft); box(ctx, px, py + ph * 0.5, pw, ph * 0.14, soft); seg(ctx, px + pw / 2, py + ph * 0.64, px + pw / 2, py + ph, soft, 2); }
          else if (k === 'sofa') { ctx.fillStyle = dark ? '#6d5a4a' : '#8d9096'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px, py + ph * 0.35, pw, ph * 0.65, 5) : ctx.rect(px, py + ph * 0.35, pw, ph * 0.65); ctx.fill(); box(ctx, px + pw * 0.86, py, pw * 0.14, ph * 0.5, ctx.fillStyle); }
          else if (k === 'rug') box(ctx, px, py, pw, ph, '#a6564a');
          else if (k === 'window' || k === 'glass') box(ctx, px, py, pw, ph, A.alpha('#7fc4e8', 0.75), '#7fc4e8');
          else if (k === 'curtain') { ctx.fillStyle = '#23252b'; for (let q = 0; q < 4; q++) ctx.fillRect(px + q * pw / 4, py, pw / 5, ph); }
          else if (k === 'piano') { box(ctx, px, py + ph * 0.25, pw, ph * 0.3, '#111317'); box(ctx, px + pw * 0.1, py + ph * 0.55, pw * 0.05, ph * 0.45, '#111317'); box(ctx, px + pw * 0.85, py + ph * 0.55, pw * 0.05, ph * 0.45, '#111317'); seg(ctx, px + pw * 0.3, py + ph * 0.25, px + pw * 0.9, py - ph * 0.3, '#111317', 2); }
          else if (k === 'drums') { dot(ctx, px + pw * 0.5, py + ph * 0.7, pw * 0.3, '#c9ccd2'); dot(ctx, px + pw * 0.15, py + ph * 0.35, pw * 0.16, '#c9ccd2'); seg(ctx, px + pw * 0.9, py, px + pw * 0.9, py + ph, soft, 1.5); seg(ctx, px + pw * 0.7, py + 2, px + pw * 1.1, py - 1, '#c7a12b', 2); }
          else if (k === 'screen') box(ctx, px, py, pw, ph, '#0d0e11', A.css('line'));
          else if (k === 'mezz') { box(ctx, px, py, pw, ph, '#c9b08a'); seg(ctx, px, py - SY(4), px + pw, py - SY(4), soft, 1); }
          else if (k === 'stair') { for (let q = 0; q < 8; q++) seg(ctx, px + pw - (q + 1) * pw / 8, py + (q + 1) * ph / 8, px + pw - q * pw / 8, py + (q + 1) * ph / 8, '#b58a5a', 2.5); }
          else if (k === 'door') box(ctx, px, py, pw, ph, A.alpha('#7fc4e8', 0.6), '#6b4a33', 2);
          else if (k === 'lamp') { seg(ctx, px, Y(roof(rx) + 2), px, py, soft, 1); ctx.fillStyle = '#1a1b1f'; ctx.beginPath(); ctx.moveTo(px - 9, py + 8); ctx.lineTo(px + 9, py + 8); ctx.lineTo(px + 4, py); ctx.lineTo(px - 4, py); ctx.closePath(); ctx.fill(); ctx.fillStyle = A.alpha('#ffd98a', 0.12 + 0.05 * Math.sin(t * 1.3)); ctx.beginPath(); ctx.moveTo(px - 8, py + 8); ctx.lineTo(px + 8, py + 8); ctx.lineTo(px + 34, Y(47)); ctx.lineTo(px - 34, Y(47)); ctx.closePath(); ctx.fill(); }
          else if (k === 'wash') { const gy = Y(roof(rx) + skinD); ctx.fillStyle = A.alpha('#ffd98a', (0.16 + 0.04 * Math.sin(t * 1.1 + rx)) * (1 - 0.6 * x)); ctx.beginPath(); ctx.moveTo(px - 3, gy); ctx.lineTo(px + 3, gy); ctx.lineTo(px + 26, Y(47)); ctx.lineTo(px - 26, Y(47)); ctx.closePath(); ctx.fill(); dot(ctx, px, gy + 1, 2.5, '#ffe9b8'); }
          else if (k === 'beam') { ctx.save(); ctx.globalAlpha = 1 - 0.8 * x; for (const bx of [14, 35, 57, 78]) box(ctx, X(bx), Y(3), SX(1.8), SY(8.2), '#1c1d21'); ctx.restore(); }
        });
        if (st.arch === 'daylight') { ctx.strokeStyle = A.alpha(ink, 0.5); ctx.lineWidth = 0.8; a.hid.filter((q) => q.z === 'room' && q.k === 'abs').forEach((q) => { for (const fx of [0.1, 0.9]) { ctx.beginPath(); ctx.moveTo(X(q.r[0] + q.r[2] * fx), Y(q.r[1])); ctx.lineTo(X(q.r[0] + q.r[2] * fx), Y(roof(50))); ctx.stroke(); } }); }
        // sound pulses entering the skin
        if (x > 0.15) {
          const src = a.seen.find((q) => q[0] === 'mains' || q[0] === 'mon' || q[0] === 'piano' || q[0] === 'screen' || q[0] === 'drums') || ['', 20, 30, 4, 8];
          const sx0 = X(src[1] + src[3] / 2), sy0 = Y(src[2] + src[4] * 0.3);
          const tg = a.hid.filter((q) => q.k === 'abs' || q.k === 'trap').slice(0, 4);
          tg.forEach((q, n) => { const [rx, ry, rw, rh] = place(q); const ex = X(rx + rw / 2), ey = Y(ry + rh / 2); const u = ((t * 0.35 + n * 0.27) % 1); const px = sx0 + (ex - sx0) * u, py = sy0 + (ey - sy0) * u; dot(ctx, px, py, 3.2 * (1 - u * 0.6), A.alpha(A.css('accent'), 0.85 * (1 - u * u))); });
        }
        // labels
        if (st.labels && x > 0.3) { const used = []; const order = hits.filter((hh) => !hh.shell).sort((p, q) => (q.i === pick) - (p.i === pick)); order.forEach((hh) => { const it = a.hid[hh.i]; if (w < 520 && hh.i !== pick) return; ctx.font = '500 10px sans-serif'; const tw = ctx.measureText(it.t).width + 14; const lx = clamp(hh.x + hh.w / 2, tw / 2 + 4, w - tw / 2 - 4); let ly = clamp(hh.y - 3, 14, h - 6); for (let tries = 0; tries < 6 && used.some((u) => Math.abs(u[0] - lx) < (u[2] + tw) / 2 && Math.abs(u[1] - ly) < 15); tries++) ly += 15; if (used.some((u) => Math.abs(u[0] - lx) < (u[2] + tw) / 2 && Math.abs(u[1] - ly) < 15)) return; used.push([lx, ly, tw]); A.text(ctx, it.t, lx, ly, { size: 10, align: 'center', color: A.css('text'), weight: hh.i === pick ? 700 : 500, bg: A.alpha(A.css('bg'), 0.85) }); }); }
        A.text(ctx, 'FRONT', X(1), h - 5, { size: 10, color: A.css('muted') }); A.text(ctx, 'REAR', X(99), h - 5, { size: 10, color: A.css('muted'), align: 'right' });
      },
      onPointer(p) {
        if (p.type === 'pointerleave') return;
        let f = -1;
        for (const hh of hits) { if (hh.shell) continue; if (p.x >= hh.x && p.x <= hh.x + hh.w && p.y >= hh.y && p.y <= hh.y + hh.h) f = hh.i; }
        if (f < 0) for (const hh of hits) if (hh.shell && p.y < hh.y + hh.h + 4) f = hh.i;
        if (f >= 0 && f !== pick) { pick = f; show(); }
      },
    });
    host.appendChild(A.legend(Object.values(KIND).map(([c, l]) => [A.css(c), l])));
    host.appendChild(info); host.appendChild(tip);
    function show() {
      const a = ARCH[st.arch], it = a.hid[pick];
      info.innerHTML = it ? `<div class="callout physics"><b>${it.t}</b> <span class="small muted">· ${KIND[it.k][1]}</span><br>${it.d}</div>` : '';
    }
    function upd() {
      const a = ARCH[st.arch];
      if (!a.hid[pick]) pick = 0;
      show();
      const n = (k) => a.hid.filter((q) => q.k === k).length;
      const l = [a.note];
      if (st.xray < 20) l.push('With the finishes solid you see what a visitor sees: calm surfaces, furniture, light. Nothing says “acoustic treatment”. Raise the x-ray.');
      else if (st.xray > 70) l.push(`Behind the skin of this room: ${n('abs')} absorber zone(s), ${n('trap')} bass trap(s), ${n('spk')} hidden loudspeaker(s), ${n('air')} quiet-air element(s) and ${n('iso')} isolation layer(s). Count the depth: the deep blocks sit where bass pressure is highest — front wall, rear wall, corners and eaves.`);
      else l.push('Half-faded, notice that the fabric line is straight and simple while the construction behind it varies from 50 mm to over half a metre. One skin, many depths.');
      l.push('When you study any photograph of a finished room, ask where the same blocks would have to be for the room to work. The checklist at the end of the lesson turns that into a routine.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Ceiling cloud array
     ====================================================================== */
  V.cloudArray = function (host) {
    const st = A.controls(host, [
      { key: 'use', label: 'Room use', type: 'select', value: 'live', options: [['live', 'Tracking / live room'], ['mix', 'Control / mix room']] },
      { key: 'L', label: 'Room length', type: 'range', min: 3, max: 12, step: 0.1, value: 7.5, unit: 'm' },
      { key: 'W', label: 'Room width', type: 'range', min: 2.5, max: 9, step: 0.1, value: 5.5, unit: 'm' },
      { key: 'H', label: 'Ceiling height', type: 'range', min: 2.4, max: 6, step: 0.1, value: 4.4, unit: 'm' },
      { key: 'n', label: 'Number of clouds', type: 'range', min: 1, max: 16, step: 1, value: 8, fmt: (v) => fmt(v, 0) },
      { key: 'cl', label: 'Cloud length', type: 'range', min: 0.6, max: 2.4, step: 0.1, value: 1.8, unit: 'm' },
      { key: 'cw', label: 'Cloud width', type: 'range', min: 0.6, max: 1.8, step: 0.1, value: 1.2, unit: 'm' },
      { key: 'th', label: 'Cloud thickness', type: 'range', min: 25, max: 200, step: 5, value: 100, unit: 'mm' },
      { key: 'gap', label: 'Air gap above (drop)', type: 'range', min: 0, max: 800, step: 10, value: 300, unit: 'mm' },
      { key: 'stag', label: 'Height stagger between clouds', type: 'range', min: 0, max: 400, step: 10, value: 150, unit: 'mm' },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 360, animate: true,
      caption: 'Top: plan of the ceiling with the cloud array and the zone where ceiling reflections matter most (outlined). Middle: section showing the drop and the stagger, with sound either reflecting from bare ceiling or dying in a cloud. Bottom: absorption added in each octave band.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const side = w > 460, pw = side ? w * 0.42 : w - 20, phh = side ? 170 : 120;
        const s = Math.min((pw - 20) / st.L, phh / st.W), ox = 14, oy = 14;
        box(ctx, ox, oy, st.L * s, st.W * s, A.css('bg2'), A.css('line'), 1.5);
        R.rects.forEach((r, i) => box(ctx, ox + r.x * s, oy + r.y * s, r.w * s, r.h * s, A.alpha(A.css('accent2'), i % 2 ? 0.75 : 0.5), A.css('accent2')));
        ctx.save(); ctx.setLineDash([5, 4]); box(ctx, ox + R.zone.x * s, oy + R.zone.y * s, R.zone.w * s, R.zone.h * s, null, A.css('accent'), 2); ctx.restore();
        if (st.use === 'mix') { dot(ctx, ox + 0.12 * st.L * s, oy + st.W * s * 0.3, 4, A.css('text')); dot(ctx, ox + 0.12 * st.L * s, oy + st.W * s * 0.7, 4, A.css('text')); dot(ctx, ox + 0.38 * st.L * s, oy + st.W * s * 0.5, 5, A.css('good')); }
        // section
        const sx0 = side ? w * 0.47 : 14, sy0 = side ? 14 : oy + st.W * s + 16, sw = side ? w * 0.5 : w - 28, sh = side ? 170 : 110;
        const ss = Math.min(sw / st.L, sh / st.H);
        const SX = (v) => sx0 + v * ss, SY = (v) => sy0 + (st.H - v) * ss;
        box(ctx, SX(0), SY(st.H), st.L * ss, st.H * ss, A.css('bg2'), A.css('line'), 1.5);
        const cols = R.cols;
        cols.forEach((c, i) => { const z = st.H - st.gap / 1000 - st.th / 1000 - (i % 2 ? st.stag / 1000 : 0); box(ctx, SX(c.x), SY(z + st.th / 1000), c.w * ss, Math.max(3, st.th / 1000 * ss), A.alpha(A.css('accent2'), 0.8), A.css('accent2')); seg(ctx, SX(c.x + c.w * 0.15), SY(z + st.th / 1000), SX(c.x + c.w * 0.15), SY(st.H), A.css('muted'), 0.8); seg(ctx, SX(c.x + c.w * 0.85), SY(z + st.th / 1000), SX(c.x + c.w * 0.85), SY(st.H), A.css('muted'), 0.8); c.z = z; });
        const srcX = st.use === 'mix' ? 0.12 * st.L : 0.3 * st.L, srcZ = 1.2;
        dot(ctx, SX(srcX), SY(srcZ), 4, A.css('text'));
        for (let k = 0; k < 6; k++) {
          const tx = st.L * (0.12 + 0.14 * k + 0.02), u = ((t * 0.4 + k * 0.17) % 1);
          const hit = cols.find((c) => tx >= c.x && tx <= c.x + c.w), tz = hit ? hit.z : st.H;
          const rx = tx + (tx - srcX) * (tz - 1.2) / Math.max(0.3, tz - srcZ);
          const col = hit ? A.css('accent2') : A.css('warn');
          if (u < 0.5) { const q = u / 0.5; seg(ctx, SX(srcX), SY(srcZ), SX(srcX + (tx - srcX) * q), SY(srcZ + (tz - srcZ) * q), A.alpha(col, 0.8), 1.5); }
          else { seg(ctx, SX(srcX), SY(srcZ), SX(tx), SY(tz), A.alpha(col, 0.35), 1.2); if (!hit) { const q = (u - 0.5) / 0.5; seg(ctx, SX(tx), SY(tz), SX(Math.min(st.L, tx + (rx - tx) * q)), SY(tz + (1.2 - tz) * q), A.alpha(col, 0.8), 1.5); } else dot(ctx, SX(tx), SY(tz), 3 + 4 * (u - 0.5), A.alpha(col, 1 - (u - 0.5) * 2)); }
        }
        // bars
        const by = (side ? 200 : sy0 + sh + 16), bh2 = h - by - 26, bx0 = 46, bwid = w - bx0 - 16, mxA = Math.max(4, ...R.A) * 1.15;
        seg(ctx, bx0, by + bh2, bx0 + bwid, by + bh2, A.css('line'));
        OCT.forEach((f, i) => { const bw2 = bwid / OCT.length; const hh = (R.A[i] / mxA) * bh2; box(ctx, bx0 + i * bw2 + bw2 * 0.2, by + bh2 - hh, bw2 * 0.6, hh, A.alpha(A.css('accent2'), 0.75)); A.text(ctx, octFmt(f), bx0 + i * bw2 + bw2 / 2, by + bh2 + 14, { size: 10, align: 'center', color: A.css('muted') }); A.text(ctx, fmt(R.A[i], 1), bx0 + i * bw2 + bw2 / 2, by + bh2 - hh - 4, { size: 10, align: 'center' }); });
        A.text(ctx, 'm² sabins', 4, by + 10, { size: 10, color: A.css('muted') });
      },
    });
    host.appendChild(tip);
    function upd() {
      const L = st.L, W = st.W, n = Math.round(st.n);
      const nx = clamp(Math.round(Math.sqrt(n * L / W)), 1, n), ny = Math.ceil(n / nx);
      const cl = Math.min(st.cl, L / nx * 0.94), cw = Math.min(st.cw, W / ny * 0.94);
      const rects = [], cols = [];
      for (let i = 0; i < n; i++) { const ix = i % nx, iy = Math.floor(i / nx); rects.push({ x: (ix + 0.5) * L / nx - cl / 2, y: (iy + 0.5) * W / ny - cw / 2, w: cl, h: cw }); }
      for (let ix = 0; ix < nx; ix++) cols.push({ x: (ix + 0.5) * L / nx - cl / 2, w: cl });
      const area = n * cl * cw, cover = area / (L * W);
      const zone = st.use === 'mix' ? { x: 0.14 * L, y: W * 0.2, w: 0.3 * L, h: W * 0.6 } : { x: 0.2 * L, y: 0.2 * W, w: 0.6 * L, h: 0.6 * W };
      let in_ = 0, tot = 0;
      for (let i = 0; i < 24; i++) for (let j = 0; j < 24; j++) { const px = zone.x + (i + 0.5) / 24 * zone.w, py = zone.y + (j + 0.5) / 24 * zone.h; tot++; if (rects.some((r) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h)) in_++; }
      const g = st.gap / 1000, d = st.th / 1000;
      const bonus = (f) => 1 + (g <= 0.02 ? 0 : 0.45 * Math.min(1, g / 0.3) * (f <= 250 ? 0.7 : 1));
      const Aadd = OCT.map((f) => area * Math.min(1.5, porous(f, 12000, d, g) * bonus(f)));
      const Vv = L * W * st.H, S = 2 * (L * W + L * st.H + W * st.H);
      const base = st.use === 'mix' ? [0.16, 0.18, 0.2, 0.22, 0.24, 0.25] : [0.1, 0.09, 0.08, 0.08, 0.09, 0.1];
      const rt0 = OCT.map((f, i) => 0.161 * Vv / (S * base[i])), rt1 = OCT.map((f, i) => 0.161 * Vv / (S * base[i] + Aadd[i]));
      R = { rects, cols, zone, A: Aadd };
      const fq = C0 / (4 * (g + d / 2));
      out.innerHTML = A.statBox('Ceiling covered', fmt(cover * 100, 0) + ' %', `${fmt(area, 1)} m² of cloud`, cover > 0.75 ? 'warn' : '')
        + A.statBox('Reflection zone covered', fmt(in_ / tot * 100, 0) + ' %', 'of the outlined area', in_ / tot < 0.6 ? 'warn' : 'good')
        + A.statBox('Decay at 500 Hz', fmt(rt0[2], 2) + ' → ' + fmt(rt1[2], 2) + ' s', 'before → after')
        + A.statBox('Decay at 125 Hz', fmt(rt0[0], 2) + ' → ' + fmt(rt1[0], 2) + ' s', 'the gap is what helps here')
        + A.statBox('Gap + panel most effective near', fmtHz(fq), 'quarter-wave rule of thumb');
      const l = [];
      if (g < 0.05) l.push('Fixed tight to the ceiling the cloud is just a wall panel on the ceiling. Dropping it 150–400 mm lets sound reach its back and edges and pushes useful absorption an octave lower, for no extra material.');
      else l.push(`With a ${mm(st.gap)} gap the back of each panel works too. Try the gap at zero and watch the 125 and 250 Hz bars fall.`);
      if (in_ / tot < 0.6) l.push('The outlined zone is only partly covered. Move material there first — a smaller array in the right place beats a bigger one spread evenly.');
      if (st.use === 'live' && cover > 0.6) l.push('More than about 60 % coverage starts to make a tracking room sound small. Leave bare ceiling between clouds: the hard strips keep the room’s height audible.');
      if (st.use === 'live' && cover < 0.25) l.push('Under a quarter of the ceiling covered: the room will still flutter between floor and ceiling. Aim for roughly a third to a half.');
      if (st.use === 'mix') l.push('In a mix room the cloud must cover the mirror points between each front loudspeaker and every listening seat, then extend past them by 300 mm or so. Depth matters more than area here: 100 mm with a gap is a sensible minimum.');
      if (st.stag > 0) l.push('Staggering alternate clouds by 100–200 mm breaks up the single reflecting plane, exposes more edge and gives the light something to do. It is cheap diffusion.');
      if (st.th < 50) l.push('Panels thinner than 50 mm only work above about 500 Hz, even with a gap. The room gets dull without getting tighter.');
      l.push('Practicalities: hang from the structure, never from the plasterboard; keep lights, sprinklers and smoke detectors working by placing them between clouds or passing them through with collars; leave access to anything above.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Timber slat wall
     ====================================================================== */
  V.slatWall = function (host) {
    const st = A.controls(host, [
      { key: 'sw', label: 'Slat width', type: 'range', min: 15, max: 150, step: 1, value: 40, unit: 'mm' },
      { key: 'gp', label: 'Gap between slats', type: 'range', min: 3, max: 60, step: 1, value: 12, unit: 'mm' },
      { key: 'tk', label: 'Slat thickness', type: 'range', min: 9, max: 50, step: 1, value: 20, unit: 'mm' },
      { key: 'cav', label: 'Cavity depth behind', type: 'range', min: 25, max: 400, step: 5, value: 100, unit: 'mm' },
      { key: 'wool', label: 'Cavity filled with mineral wool and black scrim', type: 'check', value: true },
      { key: 'vary', label: 'Mixed slat depths (some proud of others)', type: 'check', value: false },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const F = []; for (let f = 50; f <= 8000; f *= Math.pow(2, 1 / 6)) F.push(f);
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top: plan section through the slats, cavity and wall, with a wave arriving — part reflects from the slat faces, part slips through the gaps. Bottom: how much is absorbed at each frequency, and how much of the treble comes back as a reflection.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const sy = 16, sh = 86, sc = Math.min((w - 40) / 900, 0.9), mod = (st.sw + st.gp) * sc;
        const cavH = clamp(st.cav * 0.3, 14, 50), tkH = clamp(st.tk * 0.6, 6, 22);
        const yFace = sy + 38;
        box(ctx, 14, yFace + tkH + cavH, w - 28, 8, A.alpha(A.css('muted'), 0.6));
        if (st.wool) { box(ctx, 14, yFace + tkH, w - 28, cavH, A.alpha(A.css('c3'), 0.3)); ctx.strokeStyle = A.alpha(A.css('c3'), 0.8); ctx.lineWidth = 0.8; for (let x = 18; x < w - 18; x += 9) { ctx.beginPath(); ctx.moveTo(x, yFace + tkH + 2); ctx.quadraticCurveTo(x + 4, yFace + tkH + cavH / 2, x, yFace + tkH + cavH - 2); ctx.stroke(); } }
        else box(ctx, 14, yFace + tkH, w - 28, cavH, A.css('bg2'));
        let i = 0;
        for (let x = 14; x < w - 14 - st.sw * sc * 0.5; x += mod, i++) { const proud = st.vary && i % 3 === 1 ? 9 : st.vary && i % 3 === 2 ? 4 : 0; box(ctx, x, yFace - proud, Math.min(st.sw * sc, w - 14 - x), tkH + proud, '#b58a5a', '#7a5a36'); }
        // incoming wavefronts
        for (let k = 0; k < 3; k++) { const u = ((t * 0.5 + k / 3) % 1); const y = sy + u * (yFace - sy); seg(ctx, 20, y, w - 20, y, A.alpha(A.css('accent'), 0.7 * (1 - u * 0.3)), 2); }
        for (let k = 0; k < 3; k++) { const u = ((t * 0.5 + k / 3) % 1); const y = yFace - u * (yFace - sy); seg(ctx, 20, y, w - 20, y, A.alpha(A.css('warn'), 0.55 * R.hfRefl * (1 - u)), 2, st.vary ? [10, 8] : null); }
        A.text(ctx, 'room side', 18, sy - 3, { size: 10, color: A.css('muted') });
        // plot
        const py0 = sy + sh + 46;
        ctx.save(); ctx.translate(0, py0 - 14);
        const ax = A.axes(ctx, w, h - py0 + 14, { x: { min: 50, max: 8000, log: true, ticks: [63, 125, 250, 500, 1000, 2000, 4000, 8000], fmt: octFmt, label: 'Frequency (Hz)' }, y: { min: 0, max: 1, label: 'Fraction' } });
        A.plotFill(ctx, ax, F.map((f, i2) => [f, R.al[i2]]), A.alpha(A.css('accent2'), 0.2), 0);
        A.plotLine(ctx, ax, F.map((f, i2) => [f, R.al[i2]]), A.css('accent2'), 2.5);
        A.plotLine(ctx, ax, F.map((f, i2) => [f, R.re[i2]]), A.css('warn'), 2, [5, 4]);
        seg(ctx, ax.X(R.f0), ax.y0, ax.X(R.f0), ax.y1, A.css('accent'), 1, [3, 3]);
        A.text(ctx, 'slot resonance ' + fmtHz(R.f0), clamp(ax.X(R.f0) + 4, 60, w - 130), ax.y1 + 11, { size: 10, color: A.css('accent') });
        ctx.restore();
      },
    });
    host.appendChild(A.legend([[A.css('accent2'), 'absorbed'], [A.css('warn'), 'reflected or scattered back', true]]));
    host.appendChild(tip);
    function upd() {
      const w = st.sw / 1000, g = st.gp / 1000, tk = st.tk / 1000, D = st.cav / 1000;
      const eps = g / (w + g);
      const delta = (2 * g / Math.PI) * Math.log(1 / Math.sin(Math.PI * eps / 2));
      const tEff = tk + delta;
      const f0 = (C0 / TAU) * Math.sqrt(eps / (D * tEff));
      const Q = st.wool ? 1.1 : 4.5, pk = st.wool ? 0.92 : 0.5;
      const ft = C0 / (2 * w);          // above this the slat faces behave as separate mirrors
      const al = F.map((f) => {
        const r = f / f0; const res = pk / (1 + Q * Q * Math.pow(r - 1 / r, 2));
        const through = eps + (1 - eps) / (1 + Math.pow(f / ft, 2));
        const por = st.wool ? porous(f, 10000, Math.min(D, 0.2), Math.max(0, D - 0.2)) * through * (f > f0 ? 1 : Math.pow(f / f0, 1.5)) : 0.04;
        return clamp(Math.max(res, por), 0.02, 0.99);
      });
      const re = al.map((a) => 1 - a);
      const hf = (re[F.findIndex((f) => f >= 2000)] + re[F.findIndex((f) => f >= 4000)]) / 2;
      const fsc = C0 / (2 * (w + g));
      R = { al, re, f0, hfRefl: hf };
      out.innerHTML = A.statBox('Open area', fmt(eps * 100, 0) + ' %', 'gap ÷ (slat + gap)', eps < 0.05 ? 'warn' : '')
        + A.statBox('Slot resonance', fmtHz(f0), st.wool ? 'broad, damped by the wool' : 'narrow — cavity is empty')
        + A.statBox('Treble sent back', fmt(hf * 100, 0) + ' %', hf > 0.6 ? 'room stays bright' : hf < 0.3 ? 'mostly an absorber' : 'balanced', hf > 0.85 ? 'warn' : '')
        + A.statBox('Scattering starts near', fmtHz(fsc), 'half a wavelength = one slat + gap');
      const l = [];
      if (!st.wool) l.push('With an empty cavity the wall is a sharp, narrow resonator: it absorbs a little in one band and reflects everything else. Wool directly behind the slats (with a black scrim so it cannot be seen) turns the peak into a broad, useful hump.');
      if (eps < 0.06) l.push('Under about 6 % open area the slats act as a nearly solid timber wall. It will look right and do almost nothing except tune one low band. Fine as a deliberate bass absorber, a mistake if you expected a mid absorber.');
      else if (eps > 0.4) l.push('Over 40 % open the slats are acoustically almost transparent: you have a wool absorber with a timber grille. Good for a dead booth, wrong if you wanted to keep a tracking room lively.');
      else l.push('Between about 10 % and 30 % open you get the classic studio slat wall: low-mid absorption from the slots, wool taking the mids, and the timber faces handing back treble so the room does not go dull.');
      if (f0 < 150) l.push(`Tuned to ${fmtHz(f0)} this is a low-frequency absorber. Deep cavities and wide slats push the tuning down; narrow slats and wider gaps push it up.`);
      if (st.vary) l.push('Mixing slat depths (two or three projections) breaks the flat mirror into steps. Above roughly 1 kHz the reflection is spread in time and direction — real diffusion from a few millimetres of timber.');
      else l.push('All slats in one plane reflect treble like a striped mirror. Turn on mixed depths, or vary slat widths across the wall, to scatter instead.');
      l.push('Build notes: fix slats to black-painted battens, staple black acoustically open scrim behind them, keep the wool 10–20 mm off the slats so it does not bulge through, and vary the gap between zones (for example 8 mm, 12 mm, 18 mm) to tune different bands in one wall.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Glass behind the loudspeakers
     ====================================================================== */
  V.glassBehindSpeakers = function (host) {
    const st = A.controls(host, [
      { key: 'dist', label: 'Loudspeaker front to glass', type: 'range', min: 0.25, max: 2.5, step: 0.05, value: 0.9, unit: 'm' },
      { key: 'cur', label: 'Curtain across the glass', type: 'select', value: 'none', options: [['none', 'None — bare glass'], ['sheer', 'Sheer or thin blind'], ['flat', 'Heavy curtain, hung flat'], ['full', 'Heavy lined curtain, gathered to double fullness'], ['fullgap', 'Same, hung 150 mm off the glass']] },
      { key: 'ang', label: 'Glass tilted / splayed by', type: 'range', min: 0, max: 15, step: 1, value: 0, unit: '°' },
      { key: 'spk', label: 'Loudspeaker', type: 'select', value: 'two', options: [['two', 'Two-way nearfield (150–200 mm woofer)'], ['three', 'Large three-way main'], ['sub', 'With subwoofer on the floor at the glass']] },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const F = []; for (let f = 30; f <= 16000; f *= Math.pow(2, 1 / 12)) F.push(f);
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Response at the listening seat with the glass behind the loudspeaker, compared with the same loudspeaker in free space. The deep notch is the bass that goes backwards, bounces off the glass and returns half a wavelength late.',
      draw(ctx, w, h) {
        if (!R) return;
        const ax = A.axes(ctx, w, h, { x: { min: 30, max: 16000, log: true, ticks: [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000], fmt: (f) => (f >= 1000 ? f / 1000 + 'k' : fmt(f, 0)), label: 'Frequency (Hz)' }, y: { min: -24, max: 9, label: 'Change at the seat (dB)' } });
        seg(ctx, ax.x0, ax.Y(0), ax.x1, ax.Y(0), A.css('muted'), 1, [4, 4]);
        A.plotLine(ctx, ax, F.map((f, i) => [f, R.bare[i]]), A.alpha(A.css('muted'), 0.9), 1.5, [5, 4]);
        A.plotFill(ctx, ax, F.map((f, i) => [f, R.y[i]]), A.alpha(A.css('accent'), 0.12), 0);
        A.plotLine(ctx, ax, F.map((f, i) => [f, R.y[i]]), A.css('accent'), 2.5);
        A.text(ctx, 'first cancellation ' + fmtHz(R.fd), clamp(ax.X(R.fd), 80, w - 90), ax.y0 - 6, { size: 10, align: 'center', color: A.css('bad') });
      },
    });
    host.appendChild(A.legend([[A.css('muted'), 'bare glass, square-on', true], [A.css('accent'), 'your settings']]));
    host.appendChild(tip);
    function calc(cur, ang) {
      const depth = st.spk === 'three' ? 0.45 : 0.3, d = (st.spk === 'sub' ? 0.25 : st.dist + depth * 0.5);
      const fb = st.spk === 'three' ? 260 : 420;                      // baffle-step: rear radiation falls above this
      const curA = { none: () => 0, sheer: (f) => 0.03 + 0.12 * f / (f + 2000), flat: (f) => 0.55 * f * f / (f * f + 900 * 900), full: (f) => 0.92 * f * f / (f * f + 450 * 450), fullgap: (f) => 0.95 * f * f / (f * f + 260 * 260) }[cur];
      return F.map((f) => {
        const rear = 1 / Math.sqrt(1 + Math.pow(f / fb, 2.4));
        const glass = 0.97 - 0.12 / (1 + Math.pow(f / 90, 2));            // thin glass passes a little deep bass
        const cu = Math.pow(1 - curA(f), 1);                              // amplitude after two passes ≈ (1-α)
        const steer = 1 / (1 + Math.pow((ang / 6) * (f / 800), 2));       // angled glass sends short wavelengths elsewhere
        const r = rear * glass * cu * steer, ph = TAU * f * 2 * d / C0;
        return 20 * log10(Math.max(0.03, Math.hypot(1 + r * Math.cos(ph), r * Math.sin(ph))));
      });
    }
    function upd() {
      const depth = st.spk === 'three' ? 0.45 : 0.3, d = (st.spk === 'sub' ? 0.25 : st.dist + depth * 0.5), fd = C0 / (4 * d);
      const y = calc(st.cur, st.ang), bare = calc('none', 0);
      const iAt = (f) => F.findIndex((q) => q >= f);
      let dip = 0; F.forEach((f, i) => { if (f > fd * 0.7 && f < fd * 1.4) dip = Math.min(dip, y[i]); });
      let dip0 = 0; F.forEach((f, i) => { if (f > fd * 0.7 && f < fd * 1.4) dip0 = Math.min(dip0, bare[i]); });
      const rip = (arr) => { let lo = 9, hi = -9; F.forEach((f, i) => { if (f >= 1000 && f <= 8000) { lo = Math.min(lo, arr[i]); hi = Math.max(hi, arr[i]); } }); return (hi - lo) / 2; };
      R = { y, bare, fd };
      out.innerHTML = A.statBox('First cancellation', fmtHz(fd), 'speed of sound ÷ (4 × distance to glass)', fd > 60 && fd < 250 ? 'warn' : 'good')
        + A.statBox('Depth of the notch', fmt(dip, 0) + ' dB', `bare glass: ${fmt(dip0, 0)} dB`, dip < -8 ? 'bad' : '')
        + A.statBox('Treble ripple 1–8 kHz', '± ' + fmt(rip(y), 1) + ' dB', `bare glass: ± ${fmt(rip(bare), 1)} dB`, rip(y) > 1.5 ? 'warn' : 'good')
        + A.statBox('Bass boost below the notch', '+' + fmt(Math.max(0, y[iAt(Math.max(32, fd * 0.3))]), 1) + ' dB', 'the glass acts as a wall');
      const l = [];
      if (st.cur !== 'none' && dip - dip0 < 1.5) l.push('Look at the notch: the curtain has barely touched it. Fabric a few centimetres thick cannot absorb a wave several metres long. Curtains fix flutter, glare and treble splash off the glass — not the boundary cancellation.');
      if (st.spk === 'sub') l.push(`With a subwoofer on the floor right at the glass, the cancellation moves up to ${fmtHz(fd)} — above the crossover — so the low end fills in. This is the standard cure when the mains must stand away from a front window.`);
      else if (fd >= 60 && fd <= 250) l.push(`The notch at ${fmtHz(fd)} sits in the body of bass guitar and kick. Either move the loudspeakers very close to the glass (notch rises above about 250 Hz where a thick curtain and the speaker’s own directivity help) or well away from it (notch drops below the speaker’s range), and let a subwoofer near the glass cover the gap.`);
      else if (fd > 250) l.push('Close to the glass the notch is high enough that the loudspeaker radiates little backwards at that frequency, so it stays shallow. Expect a broad bass lift instead — correct it with the monitor’s boundary switch or a shelf cut.');
      else l.push('Far from the glass the notch falls very low, but the room modes now dominate and you have given away a lot of floor. Workable in a large suite, wasteful in a small one.');
      if (st.ang >= 5) l.push(`Tilting or splaying the glass by ${fmt(st.ang, 0)}° throws the treble reflection away from the seat (and away from microphones in the next room). It does nothing below a few hundred hertz.`);
      l.push('A window behind the monitors works when the glass is heavy and well sealed (it is then a decent bass boundary), the two sides are symmetrical, full-height curtains can close for critical listening, and the deep trapping is moved to where it can go: under the sill, the side walls, the ceiling and the rear wall.');
      l.push('Daylight from the front is kinder to the eyes than a bright window behind the screen from the side, but check glare on the display at the hours you actually work.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Palette builder — mood → finish schedule
     ====================================================================== */
  const MOOD = {
    dark: { name: 'Dark cocoon', wall: '#33373f', wall2: '#23262c', ceil: '#24272d', floor: '#8a643e', rug: '#5c4a45', trim: '#15161a', light: '#ffd28a', note: 'Charcoal and ink fabrics, warm low light. Focus goes to the sound and the screen. Hides joints, grilles and shadows; shows dust and lint.' },
    day: { name: 'Daylight airy', wall: '#efece5', wall2: '#dedad0', ceil: '#f6f4ee', floor: '#c9a678', rug: '#d9cfc0', trim: '#ffffff', light: '#fff4d8', note: 'Whites, pale greys and light oak with real daylight. Feels bigger and suits long tracking days and filming. Every seam and stain is visible, so workmanship has to be better.' },
    timber: { name: 'Warm timber', wall: '#e4dccb', wall2: '#9b6b43', ceil: '#efe9dc', floor: '#a9773f', rug: '#b9a17f', trim: '#6b4226', light: '#ffe0a8', note: 'Oatmeal fabric with oak or walnut slats, frames and joinery. Timeless and forgiving; the timber gives back treble so the room does not sound padded.' },
    loft: { name: 'Street-front loft', wall: '#e9e6df', wall2: '#2a2c31', ceil: '#1e1f23', floor: '#b08a5c', rug: '#8f9093', trim: '#141518', light: '#ffe6b8', note: 'Pale walls, black beams and window frames, a dark lower band, leather and plants. Reads as a designed living space; the contrast hides ceiling services.' },
  };
  const ROOMT = { mix: 'Control / mix room', live: 'Tracking room', suite: 'Production / writing suite', cinema: 'Living-room cinema', booth: 'Vocal booth' };
  V.paletteBuilder = function (host) {
    const st = A.controls(host, [
      { key: 'mood', label: 'Mood', type: 'select', value: 'dark', options: Object.entries(MOOD).map(([k, v]) => [k, v.name]) },
      { key: 'room', label: 'Room type', type: 'select', value: 'mix', options: Object.entries(ROOMT) },
      { key: 'india', label: 'Show the India-budget alternative', type: 'check', value: true },
    ], () => upd());
    const tbl = el('div'), tip = el('div');
    const cv = A.canvas(host, {
      height: 250, animate: true,
      caption: 'A swatch elevation of one wall in the chosen mood: ceiling, fabric wall modules with their joints, lower band, floor and rug, with the lighting that suits it.',
      draw(ctx, w, h, t) {
        t = tp(t); const m = MOOD[st.mood], mx = 12, cw2 = w - mx * 2, cH = 34, fH = 30, wy = 10 + cH, wh = h - 20 - cH - fH;
        box(ctx, mx, 10, cw2, cH, m.ceil);
        box(ctx, mx, wy, cw2, wh, m.wall);
        const slats = st.mood === 'timber' || (st.mood === 'loft' && st.room !== 'booth') || st.room === 'live';
        const band = st.mood === 'loft' || st.mood === 'dark';
        if (band) box(ctx, mx, wy + wh * 0.78, cw2, wh * 0.22, m.wall2);
        const mod = cw2 / (w < 500 ? 5 : 8);
        ctx.strokeStyle = A.alpha(st.mood === 'dark' ? '#000000' : '#7c766a', 0.55); ctx.lineWidth = 1;
        for (let x = mx + mod; x < mx + cw2 - 2; x += mod) { ctx.beginPath(); ctx.moveTo(x, wy); ctx.lineTo(x, wy + wh); ctx.stroke(); }
        if (slats) { const sx = mx + mod * (w < 500 ? 3 : 5), sw2 = mod * 2; box(ctx, sx, wy, sw2, wh, st.mood === 'loft' ? '#1c1d21' : '#3a2a1c'); const col = st.mood === 'loft' ? '#33353b' : (st.mood === 'day' ? '#d8b98c' : '#a8733f'); for (let x = sx + 2; x < sx + sw2 - 3; x += 9) box(ctx, x, wy, 6, wh, col); }
        if (st.room === 'live' || st.mood === 'day') { for (const k of [1, 3]) box(ctx, mx + mod * k + mod * 0.3, wy + wh * 0.1, mod * 0.4, wh * 0.72, A.alpha('#8fd0f0', 0.85), m.trim, 2); }
        if (st.room === 'cinema') { box(ctx, mx + cw2 * 0.3, wy + wh * 0.18, cw2 * 0.3, wh * 0.5, '#0b0c0e'); }
        // ceiling clouds / coffers
        if (st.mood === 'loft') { for (let x = mx; x < mx + cw2; x += mod * 2) { box(ctx, x + 6, 16, mod * 2 - 12, cH - 10, '#e7e3da'); dot(ctx, x + mod, 10 + cH / 2, 2.5, '#fff1c8'); } }
        else if (st.room === 'live') { for (let x = mx + 10; x < mx + cw2 - mod; x += mod * 1.6) box(ctx, x, 18 + ((x / mod) | 0) % 2 * 6, mod * 1.2, 7, st.mood === 'dark' ? '#454a54' : '#d9d5cb', A.alpha('#000000', 0.2)); }
        else box(ctx, mx + cw2 * 0.2, 22, cw2 * 0.6, 8, st.mood === 'dark' ? '#3a3f48' : '#e2ded4', A.alpha('#000000', 0.25));
        // light scallops
        const nL = w < 500 ? 3 : 5;
        for (let i = 0; i < nL; i++) { const x = mx + cw2 * (i + 0.5) / nL; const g = ctx.createRadialGradient(x, wy, 2, x, wy + wh * 0.3, wh * 0.75); g.addColorStop(0, A.alpha(m.light, st.mood === 'dark' ? 0.5 : 0.28)); g.addColorStop(1, A.alpha(m.light, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 4, wy); ctx.quadraticCurveTo(x - mod * 0.7, wy + wh * 0.7, x - mod * 0.5, wy + wh); ctx.lineTo(x + mod * 0.5, wy + wh); ctx.quadraticCurveTo(x + mod * 0.7, wy + wh * 0.7, x + 4, wy); ctx.closePath(); ctx.globalAlpha = 0.85 + 0.15 * Math.sin(t * 0.8 + i); ctx.fill(); ctx.globalAlpha = 1; }
        box(ctx, mx, wy + wh, cw2, fH, m.floor);
        for (let x = mx; x < mx + cw2; x += 46) seg(ctx, x, wy + wh, x, wy + wh + fH, A.alpha('#000000', 0.15));
        box(ctx, mx + cw2 * 0.18, wy + wh + 8, cw2 * 0.5, fH - 14, m.rug);
        ctx.strokeStyle = A.css('line'); ctx.lineWidth = 1; ctx.strokeRect(mx, 10, cw2, h - 20);
      },
    });
    host.appendChild(tbl); host.appendChild(tip);
    function rows() {
      const m = st.mood, r = st.room, deep = r === 'mix' || r === 'cinema';
      const fab = { dark: 'Charcoal open-weave fabric, stretched floor to ceiling', day: 'Off-white or pale grey fabric in tall modules', timber: 'Oatmeal fabric between timber frames', loft: 'Pale fabric above a dark lower band' }[m];
      const ceil = r === 'live' ? ['Hung cloud array at staggered heights', '100 mm wool panels, 200–400 mm air above', 'Stops floor–ceiling flutter, shortens decay without deadening'] : m === 'loft' ? ['Dark beam grid with pale fabric panels in each coffer', '100 mm wool plus air space in the beam depth', 'Kills the ceiling bounce; beams add scatter and hide fixings'] : ['Stretched fabric ceiling with a dropped central cloud', deep ? '150–300 mm wool, hidden speakers and lined ducts' : '50–100 mm wool on an air gap', 'First-reflection control over the seat; low-mid absorption'];
      const R2 = [
        ['Front wall', r === 'live' ? 'Painted plaster with tall fabric panels and slit windows' : fab, r === 'live' ? '75–100 mm panels on a 50 mm gap' : deep ? 'Heavy baffle wall or 300–600 mm trap cavity' : '100–150 mm absorber behind the monitors', r === 'live' ? 'Breaks up the big reflective plane; keeps daylight' : 'Tames the boundary cancellation behind the loudspeakers', 'Painted masonry + site-built panels in polyester “matty” cloth'],
        ['Side walls', m === 'timber' || m === 'loft' ? 'Fabric modules with one slatted bay' : fab, r === 'booth' ? '100 mm wool, full coverage' : '100 mm absorber at the mirror points; thinner or reflective elsewhere', 'Removes early side reflections; slats return some treble', 'Battens + rock-wool slabs + stretched cloth; pine or rubber-wood slats'],
        ['Ceiling', ceil[0], ceil[1], ceil[2], 'Rock-wool boards in timber frames hung on chains or wire'],
        ['Rear wall', r === 'live' ? 'Timber-slat feature wall round the window' : fab, r === 'live' ? 'Slats over wool, mixed gaps' : deep ? '400–600 mm deep absorber, thinner near the ceiling' : '200 mm absorber or shelving and sofa', r === 'live' ? 'Scatter plus low-mid absorption' : 'Stops the strongest late reflection and the first length mode', 'Deep site-built trap filled with low-density glass-wool rolls'],
        ['Corners', 'Chamfered or simply straight fabric', 'Floor-to-ceiling trap behind the skin', 'Low-frequency decay', 'Stacked wool triangles or a diagonal framed panel'],
        ['Floor', 'Engineered timber with loose rugs', r === 'live' ? 'Isolated slab or floated deck' : 'Solid, well-supported deck', 'Bright, even reflection; rugs are the adjustable absorber', 'Wood-look vinyl plank or polished tile + thick dhurrie / wool rug'],
        ['Lighting', m === 'dark' ? 'Wall-washing downlights and vertical light reveals' : m === 'day' ? 'Daylight first; small downlights between clouds' : 'Warm downlights in coffers, lamps at sofa height', 'Remote, silent drivers; no fan-cooled fittings', 'No buzz, no hum, no glare on the screen', 'Good-quality 2700–3000 K LEDs on a non-dimming or DC-dimmed driver'],
      ];
      if (r === 'booth') R2.splice(3, 2, ['Rear wall + door', 'Fabric and a full-glass door', '100 mm wool everywhere, door lined on the inside', 'Dry, neutral voice sound with sightlines kept', 'Same build, laminated-glass door with double seals']);
      return R2;
    }
    function upd() {
      const m = MOOD[st.mood], R2 = rows();
      tbl.innerHTML = `<div class="table-wrap"><table><tr><th>Surface</th><th>Finish you see</th><th>What is behind it</th><th>Acoustic job</th>${st.india ? '<th>India-budget alternative</th>' : ''}</tr>${R2.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td>${st.india ? `<td>${r[4]}</td>` : ''}</tr>`).join('')}</table></div>`;
      const l = [m.note];
      if (st.mood === 'dark') l.push('Dark rooms need more light fittings, not fewer: several low-output wall-washers give shape without glare. One bright ceiling light makes a dark room feel like a cave.');
      if (st.mood === 'day') l.push('Pale fabric shows the wool behind it. Always add a black or white lining layer (a thin non-woven scrim) and keep battens the same colour as the fabric so they do not ghost through.');
      if (st.mood === 'timber') l.push('Decide early which timber surfaces are real acoustic devices (slats over wool) and which are trim. Seal or oil both sides of real timber so it does not cup in humid weather.');
      if (st.mood === 'loft') l.push('High contrast draws the eye to the grid. Set out the beam and joint lines first, then fit the clouds, lights and sprinklers into that grid — never the other way round.');
      if (st.room === 'live') l.push('A tracking room that doubles as a video set wants calm backgrounds, daylight that can be blocked, no visible cable runs and a ceiling grid strong enough to hang lights.');
      if (st.room === 'cinema') l.push('For a room that is also a living room, keep ordinary furniture and let the fabric read as paint. Guests should not be able to say where the loudspeakers are.');
      l.push('Rule that survives every mood: pick the acoustic build first (depths, positions, air gaps), then choose a finish that is acoustically open over absorbers and deliberately solid where you want reflection.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     6. Immersive loudspeaker layout
     ====================================================================== */
  const LAY = {
    '5.1': { ear: [['L', -30], ['C', 0], ['R', 30], ['Ls', -110], ['Rs', 110]], top: [] },
    '7.1': { ear: [['L', -30], ['C', 0], ['R', 30], ['Lss', -90], ['Rss', 90], ['Lrs', -140], ['Rrs', 140]], top: [] },
    '5.1.4': { ear: [['L', -30], ['C', 0], ['R', 30], ['Ls', -110], ['Rs', 110]], top: [['Ltf', -1, 1], ['Rtf', 1, 1], ['Ltr', -1, -1], ['Rtr', 1, -1]] },
    '7.1.4': { ear: [['L', -30], ['C', 0], ['R', 30], ['Lss', -90], ['Rss', 90], ['Lrs', -140], ['Rrs', 140]], top: [['Ltf', -1, 1], ['Rtf', 1, 1], ['Ltr', -1, -1], ['Rtr', 1, -1]] },
    '9.1.6': { ear: [['L', -30], ['C', 0], ['R', 30], ['Lw', -60], ['Rw', 60], ['Lss', -90], ['Rss', 90], ['Lrs', -140], ['Rrs', 140]], top: [['Ltf', -1, 1], ['Rtf', 1, 1], ['Ltm', -1, 0], ['Rtm', 1, 0], ['Ltr', -1, -1], ['Rtr', 1, -1]] },
  };
  V.immersiveLayout = function (host) {
    const st = A.controls(host, [
      { key: 'lay', label: 'Layout', type: 'select', value: '7.1.4', options: Object.keys(LAY) },
      { key: 'L', label: 'Room length', type: 'range', min: 3, max: 10, step: 0.1, value: 6, unit: 'm' },
      { key: 'W', label: 'Room width', type: 'range', min: 2.6, max: 8, step: 0.1, value: 4.6, unit: 'm' },
      { key: 'H', label: 'Ceiling height', type: 'range', min: 2.2, max: 4.5, step: 0.05, value: 2.9, unit: 'm' },
      { key: 'sy', label: 'Seat distance from front wall', type: 'range', min: 25, max: 75, step: 1, value: 45, unit: '% of length' },
      { key: 'sx', label: 'Seat offset from centre line', type: 'range', min: -1, max: 1, step: 0.05, value: 0, unit: 'm' },
    ], () => upd());
    const out = stats(host), tbl = el('div'), tip = el('div');
    let R = null, drag = false, geo = null;
    const cv = A.canvas(host, {
      height: 400,
      caption: 'Plan (above) and side section (below). Ear-level loudspeakers sit just inside the walls along their target directions; overhead ones aim for about 45° up, in line with the front pair. Drag the seat on the plan. Loudspeakers outside a generic tolerance window are ringed.',
      draw(ctx, w, h) {
        if (!R) return;
        const pH = h * 0.6 - 14, s = Math.min((w - 28) / st.L, pH / st.W), ox = (w - st.L * s) / 2, oy = 10;
        geo = { s, ox, oy };
        const PX = (y) => ox + y * s, PY = (x) => oy + (st.W / 2 - x) * s;         // plan: front at left
        box(ctx, ox, oy, st.L * s, st.W * s, A.css('bg2'), A.css('line'), 1.5);
        A.text(ctx, 'front', ox + 4, oy + 12, { size: 10, color: A.css('muted') });
        R.sp.forEach((p) => { seg(ctx, PX(R.seat.y), PY(R.seat.x), PX(p.y), PY(p.x), A.alpha(A.css(p.top ? 'accent2' : 'accent'), 0.35), 1, p.top ? [3, 3] : null); });
        R.sp.forEach((p) => { const c = A.css(p.top ? 'accent2' : 'accent'); if (p.top) { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(PX(p.y) - 5, PY(p.x) - 5, 10, 10); } else dot(ctx, PX(p.y), PY(p.x), 5.5, c); if (!p.ok) { ctx.strokeStyle = A.css('bad'); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(PX(p.y), PY(p.x), 10, 0, TAU); ctx.stroke(); } A.text(ctx, p.n, PX(p.y), PY(p.x) + (p.x > 0 ? 18 : -9), { size: 9, align: 'center', color: A.css('text'), bg: A.alpha(A.css('bg'), 0.7) }); });
        dot(ctx, PX(R.seat.y), PY(R.seat.x), 7, A.css('good')); A.text(ctx, 'seat', PX(R.seat.y), PY(R.seat.x) + 20, { size: 10, align: 'center' });
        dot(ctx, PX(0.15), PY(-(st.W / 2 - 0.25)), 5, A.css('c5')); A.text(ctx, 'sub', PX(0.15) + 9, PY(-(st.W / 2 - 0.25)) + 3, { size: 9 });
        // section
        const sy0 = oy + st.W * s + 16, sH = h - sy0 - 8, s2 = Math.min((w - 28) / st.L, sH / st.H), ox2 = (w - st.L * s2) / 2;
        const QX = (y) => ox2 + y * s2, QZ = (z) => sy0 + (st.H - z) * s2;
        box(ctx, ox2, sy0, st.L * s2, st.H * s2, A.css('bg2'), A.css('line'), 1.5);
        R.sp.filter((p) => p.x <= 0.01 || p.top && p.x < 0).forEach((p) => { seg(ctx, QX(R.seat.y), QZ(1.2), QX(p.y), QZ(p.z), A.alpha(A.css(p.top ? 'accent2' : 'accent'), 0.45), 1, p.top ? [3, 3] : null); if (p.top) { ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2; ctx.strokeRect(QX(p.y) - 5, QZ(p.z) - 1, 10, 6); A.text(ctx, fmt(p.el, 0) + '°', QX(p.y), QZ(p.z) + 18, { size: 9, align: 'center', color: p.ok ? A.css('text') : A.css('bad') }); } else dot(ctx, QX(p.y), QZ(p.z), 4.5, A.css('accent')); });
        dot(ctx, QX(R.seat.y), QZ(1.2), 6, A.css('good'));
        seg(ctx, ox2, QZ(1.2), ox2 + st.L * s2, QZ(1.2), A.alpha(A.css('muted'), 0.5), 1, [2, 4]);
      },
      onPointer(p) {
        if (!geo) return;
        if (p.type === 'pointerdown') drag = true; else if (p.type === 'pointerup' || p.type === 'pointerleave') drag = false;
        if (drag && (p.type === 'pointerdown' || p.type === 'pointermove') && p.y < geo.oy + st.W * geo.s + 6) {
          const y = (p.x - geo.ox) / geo.s, x = st.W / 2 - (p.y - geo.oy) / geo.s;
          st.set('sy', clamp(Math.round(y / st.L * 100), 25, 75), true); st.set('sx', clamp(Math.round(x * 20) / 20, -1, 1), true); upd();
        }
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'ear-level loudspeaker'], [A.css('accent2'), 'overhead loudspeaker'], [A.css('good'), 'reference seat'], [A.css('bad'), 'outside the window']]));
    host.appendChild(tbl); host.appendChild(tip);
    function upd() {
      const L = st.L, W = st.W, H = st.H, inset = 0.25, seat = { x: clamp(st.sx, -W / 2 + 0.6, W / 2 - 0.6), y: L * st.sy / 100 }, ear = 1.2;
      const lay = LAY[st.lay], sp = [];
      lay.ear.forEach(([n, az]) => {
        const a = az * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a);      // az 0 = towards the front wall (y decreasing)
        let tmin = 1e9;
        if (dx > 1e-6) tmin = Math.min(tmin, (W / 2 - inset - seat.x) / dx); if (dx < -1e-6) tmin = Math.min(tmin, (-W / 2 + inset - seat.x) / dx);
        if (dy > 1e-6) tmin = Math.min(tmin, (L - inset - seat.y) / dy); if (dy < -1e-6) tmin = Math.min(tmin, (inset + 0.35 - seat.y) / dy);
        tmin = Math.max(0.3, tmin);
        const p = { n, x: seat.x + dx * tmin, y: seat.y + dy * tmin, z: ear, az, el: 0, top: false };
        p.d = tmin; p.target = az; p.ok = tmin >= 1.1; p.why = tmin < 1.1 ? 'too close to the seat' : '';
        sp.push(p);
      });
      const off = H - ear, lrx = sp.find((q) => q.n === 'R');
      const lat = Math.min(Math.abs(lrx ? lrx.x - seat.x : 1.2), W / 2 - 0.4);
      lay.top.forEach(([n, side, fb]) => {
        const want = fb === 0 ? 0 : fb * off;                                    // 45° fore / aft
        const y = clamp(seat.y - want, 0.4, L - 0.4), x = clamp(seat.x + side * Math.max(0.5, lat * 0.85), -W / 2 + 0.3, W / 2 - 0.3);
        const hd = Math.hypot(x - seat.x, y - seat.y), elv = Math.atan2(off, hd) * 180 / Math.PI, elFB = Math.atan2(off, Math.abs(y - seat.y) || 1e-6) * 180 / Math.PI;
        const p = { n, x, y, z: H - 0.08, top: true, d: Math.hypot(hd, off), el: fb === 0 ? elv : elFB, az: Math.atan2(x - seat.x, -(y - seat.y)) * 180 / Math.PI };
        p.ok = fb === 0 ? elv >= 65 : (p.el >= 30 && p.el <= 55) && off >= 0.9; p.why = off < 0.9 ? 'ceiling too low' : !p.ok ? (p.el > 55 ? 'too steep — room is short here' : 'too shallow') : '';
        sp.push(p);
      });
      const dmax = Math.max(...sp.map((p) => p.d)), dmin = Math.min(...sp.map((p) => p.d));
      sp.forEach((p) => { p.delay = (dmax - p.d) / C0 * 1000; p.trim = 20 * log10(p.d / dmax); });
      const bad = sp.filter((p) => !p.ok), asym = Math.abs(seat.x) > 0.05;
      R = { sp, seat };
      out.innerHTML = A.statBox('Loudspeakers', String(sp.length) + ' + sub', st.lay + ' layout')
        + A.statBox('Nearest / farthest', fmt(dmin, 2) + ' / ' + fmt(dmax, 2) + ' m', 'from the seat', dmax / dmin > 2 ? 'warn' : '')
        + A.statBox('Largest delay to add', fmt((dmax - dmin) / C0 * 1000, 1) + ' ms', 'to the nearest loudspeaker')
        + A.statBox('Largest level trim', fmt(20 * log10(dmin / dmax), 1) + ' dB', 'on the nearest loudspeaker', dmax / dmin > 2 ? 'warn' : '')
        + A.statBox('Overhead height above ears', fmt(off, 2) + ' m', off < 1.1 ? 'tight — expect steep angles' : 'workable', off < 1.1 ? 'warn' : 'good')
        + A.statBox('Outside the window', String(bad.length), bad.length ? bad.map((p) => p.n).join(', ') : 'all within tolerance', bad.length ? 'bad' : 'good');
      tbl.innerHTML = `<div class="table-wrap"><table><tr><th>Speaker</th><th>Azimuth</th><th>Elevation</th><th>Distance</th><th>Delay to add</th><th>Level trim</th><th>Check</th></tr>${sp.map((p) => `<tr><td><b>${p.n}</b></td><td>${fmt(p.az, 0)}°</td><td>${fmt(p.el, 0)}°</td><td>${fmt(p.d, 2)} m</td><td>${fmt(p.delay, 1)} ms</td><td>${fmt(p.trim, 1)} dB</td><td>${p.ok ? '✓' : '⚠ ' + p.why}</td></tr>`).join('')}</table></div>`;
      const l = [];
      if (asym) l.push('The seat is off the centre line. Left and right distances now differ, so the phantom centre leans unless every channel is re-timed. Geometry first: put the seat back on the axis of symmetry.');
      if (off < 1.1) l.push(`Only ${fmt(off, 2)} m between ears and ceiling. Overhead loudspeakers end up close and steep, so one seat hears them much louder than the next. Choose wide-dispersion overheads, keep them as far apart as the rules allow, or accept a smaller “good” listening area.`);
      if (dmax / dmin > 2) l.push('The farthest loudspeaker is more than twice as far as the nearest. Delay and level trims fix the reference seat only; other seats will hear the near one dominate. A more central seat or a shorter front distance evens it out.');
      if (st.sy > 62) l.push('Sitting this far back puts the head near the rear wall, where bass builds up and the rear surrounds are almost beside you. Somewhere between 38 % and 55 % of the length usually balances front distance against rear space.');
      if (st.sy < 33) l.push('This close to the front the screen and mains dominate and the front heights have nowhere to go. Move back until the front pair makes roughly an equilateral triangle with the seat.');
      if (!l.length) l.push('This geometry is comfortable: every loudspeaker is inside its window and the distances are similar enough that trims stay small.');
      l.push('The angle windows here are generic teaching values. Each immersive format publishes its own tolerances for azimuth, elevation and distance — design to the current specification document of the format owner, and check it again before you build.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     7. Seat-to-seat bass consistency with multiple subwoofers
     ====================================================================== */
  V.seatConsistency = function (host) {
    const st = A.controls(host, [
      { key: 'L', label: 'Room length', type: 'range', min: 3.5, max: 10, step: 0.1, value: 6, unit: 'm' },
      { key: 'W', label: 'Room width', type: 'range', min: 2.6, max: 8, step: 0.1, value: 4.6, unit: 'm' },
      { key: 'H', label: 'Ceiling height', type: 'range', min: 2.2, max: 4.5, step: 0.05, value: 2.9, unit: 'm' },
      { key: 'subs', label: 'Subwoofers', type: 'select', value: 'c1', options: [['c1', 'One — front corner'], ['m1', 'One — middle of the front wall'], ['f2', 'Two — front wall at ¼ and ¾ width'], ['fb2', 'Two — middle of front and rear walls'], ['c4', 'Four — one in each corner'], ['m4', 'Four — middle of each wall']] },
      { key: 'damp', label: 'Low-frequency damping of the room', type: 'select', value: 'med', options: [['low', 'Light — bare room'], ['med', 'Medium — some bass trapping'], ['high', 'Heavy — deep trapping all round']] },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const F = []; for (let f = 20; f <= 140; f *= Math.pow(2, 1 / 24)) F.push(f);
    const cv = A.canvas(host, {
      height: 330,
      caption: 'Each thin line is the modelled bass response at one of six seats (two rows of three); the thick line is their average. The closer the thin lines stay together, the more people hear the same mix. Inset: where the subwoofers and seats are.',
      draw(ctx, w, h) {
        if (!R) return;
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 140, log: true, ticks: [20, 30, 40, 50, 60, 80, 100, 140], fmt: (f) => fmt(f, 0), label: 'Frequency (Hz)' }, y: { min: -30, max: 15, label: 'Level (dB, relative)' } });
        R.seatsY.forEach((y, i) => A.plotLine(ctx, ax, F.map((f, k) => [f, y[k]]), A.alpha(A.series(i), 0.75), 1.2));
        A.plotLine(ctx, ax, F.map((f, k) => [f, R.mean[k]]), A.css('text'), 2.8);
        // inset plan
        const iw = Math.min(120, w * 0.26), ih = iw * st.W / st.L, ix = ax.x1 - iw - 6, iy = ax.y0 - ih - 8;
        box(ctx, ix, iy, iw, ih, A.alpha(A.css('bg'), 0.9), A.css('line'));
        R.src.forEach((s) => dot(ctx, ix + s[1] / st.L * iw, iy + s[0] / st.W * ih, 4, A.css('c5')));
        R.seats.forEach((s, i) => dot(ctx, ix + s[1] / st.L * iw, iy + s[0] / st.W * ih, 3, A.series(i)));
      },
    });
    host.appendChild(A.legend([[A.css('text'), 'average of the six seats'], [A.css('c5'), 'subwoofer position (inset)']]));
    host.appendChild(tip);
    function upd() {
      const L = st.L, W = st.W, H = st.H, Q = { low: 14, med: 7, high: 3.8 }[st.damp];
      const e = 0.15;
      const src = { c1: [[e, e]], m1: [[W / 2, e]], f2: [[W / 4, e], [3 * W / 4, e]], fb2: [[W / 2, e], [W / 2, L - e]], c4: [[e, e], [W - e, e], [e, L - e], [W - e, L - e]], m4: [[W / 2, e], [W / 2, L - e], [e, L / 2], [W - e, L / 2]] }[st.subs];
      const seats = []; for (const ry of [0.5, 0.68]) for (const rx of [0.3, 0.5, 0.7]) seats.push([W * rx + (rx === 0.5 ? 0.07 : 0), L * ry]);
      const modes = [];
      for (let nx = 0; nx <= 5; nx++) for (let ny = 0; ny <= 6; ny++) for (let nz = 0; nz <= 3; nz++) { const fn = (C0 / 2) * Math.sqrt(Math.pow(nx / W, 2) + Math.pow(ny / L, 2) + Math.pow(nz / H, 2)); if (fn < 220) modes.push([nx, ny, nz, fn, (nx ? 2 : 1) * (ny ? 2 : 1) * (nz ? 2 : 1)]); }
      const psi = (m, x, y, z) => Math.cos(m[0] * Math.PI * x / W) * Math.cos(m[1] * Math.PI * y / L) * Math.cos(m[2] * Math.PI * z / H);
      const sw = modes.map((m) => src.reduce((a, s) => a + psi(m, s[0], s[1], 0.2), 0) / src.length);
      const seatsY = seats.map((s) => {
        const rw = modes.map((m) => psi(m, s[0], s[1], 1.2));
        return F.map((f) => { let re = 0, im = 0; modes.forEach((m, i) => { const fn = Math.max(m[3], 6), a = fn * fn - f * f, b = f * fn / Q, den = a * a + b * b, g = m[4] * sw[i] * rw[i]; re += g * a / den; im -= g * b / den; }); return 20 * log10(Math.hypot(re, im) + 1e-9); });
      });
      const iIn = F.map((f, i) => i).filter((i) => F[i] >= 25 && F[i] <= 110);
      const ref = iIn.reduce((a, i) => a + seatsY.reduce((b, y) => b + y[i], 0) / seatsY.length, 0) / iIn.length;
      seatsY.forEach((y) => y.forEach((v, i) => { y[i] = clamp(v - ref, -40, 20); }));
      const mean = F.map((f, i) => seatsY.reduce((b, y) => b + y[i], 0) / seatsY.length);
      const sd = iIn.reduce((a, i) => { const m = mean[i]; return a + Math.sqrt(seatsY.reduce((b, y) => b + Math.pow(y[i] - m, 2), 0) / seatsY.length); }, 0) / iIn.length;
      const mx = Math.max(...iIn.map((i) => mean[i])), mn = Math.min(...iIn.map((i) => mean[i]));
      let worst = 0; iIn.forEach((i) => { const hi = Math.max(...seatsY.map((y) => y[i])), lo = Math.min(...seatsY.map((y) => y[i])); worst = Math.max(worst, hi - lo); });
      R = { seatsY, mean, src, seats };
      out.innerHTML = A.statBox('Seat-to-seat variation', '± ' + fmt(sd, 1) + ' dB', 'average spread, 25–110 Hz', sd > 4 ? 'bad' : sd > 2.5 ? 'warn' : 'good')
        + A.statBox('Worst gap between seats', fmt(worst, 0) + ' dB', 'at a single frequency', worst > 15 ? 'bad' : '')
        + A.statBox('Average response range', fmt(mx - mn, 0) + ' dB', 'peak to dip — what EQ must fix')
        + A.statBox('Subwoofers', String(src.length), src.length > 1 ? 'same signal to each' : 'single source');
      const l = [];
      if (st.subs === 'c1') l.push('One corner subwoofer drives every mode as hard as possible: plenty of output, but each seat gets a different set of peaks and holes. EQ can flatten one seat and will make the others worse.');
      if (st.subs === 'm1') l.push('Mid-wall placement refuses to excite the odd width modes, which removes some of the left-to-right variation at no cost.');
      if (st.subs === 'f2') l.push('Two subwoofers at the quarter points of the front wall cancel the first and third width modes. A very common arrangement in mix rooms because it fits under the screen or either side of the desk.');
      if (st.subs === 'fb2') l.push('Front and rear mid-wall subwoofers cancel the odd length modes too. The rear unit needs careful delay and level so the bass still appears to come from the front.');
      if (st.subs === 'c4' || st.subs === 'm4') l.push('Four subwoofers placed symmetrically cancel most of the low-order modes between them. The response is not flatter in itself — look at the average — but the seats now agree, and that is what makes one EQ curve valid for everyone.');
      if (st.damp === 'low') l.push('In a lightly damped room the peaks are tall and narrow and ring on. Multiple subwoofers reduce the spread, but deep trapping is still needed to shorten the decay.');
      if (st.damp === 'high') l.push('Heavy damping lowers the peaks and widens them, which also brings the seats together. Trapping and multiple subwoofers add up; neither replaces the other.');
      l.push('Read the result in this order: first make the seats agree (placement and number of subwoofers), then shorten the decay (trapping), and only then equalise the average.');
      l.push('This is a simple rectangular-room mode sum with the same damping for every mode. Real rooms have doors, soft walls and furniture: treat it as a guide to which arrangement to try first, then measure.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     8. Loudspeaker hidden behind fabric
     ====================================================================== */
  V.hiddenSpeaker = function (host) {
    const FAB = { open: ['Open-weave speaker cloth', 90], poly: ['Plain-weave polyester panel fabric', 260], knit: ['Stretch knit under tension', 520], scrim: ['Panel fabric plus a black lining scrim', 700], uph: ['Dense upholstery weave', 1700], velvet: ['Velvet / blackout cloth', 4200] };
    const st = A.controls(host, [
      { key: 'fab', label: 'Fabric in front of the loudspeaker', type: 'select', value: 'poly', options: Object.entries(FAB).map(([k, v]) => [k, v[0]]) },
      { key: 'rec', label: 'Loudspeaker set back behind the fabric line', type: 'range', min: 0, max: 200, step: 5, value: 60, unit: 'mm' },
      { key: 'lined', label: 'Recess walls lined with absorber', type: 'check', value: false },
      { key: 'frame', label: 'A batten or track crosses in front of the tweeter', type: 'check', value: false },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const F = []; for (let f = 200; f <= 20000; f *= Math.pow(2, 1 / 16)) F.push(f);
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'What the fabric and the recess do to the loudspeaker’s response on axis, compared with the same loudspeaker uncovered. The smooth downward tilt is the fabric; the ripple is sound bouncing around the recess before it gets out.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const ax = A.axes(ctx, w, h, { x: { min: 200, max: 20000, log: true, ticks: [250, 500, 1000, 2000, 4000, 8000, 16000], fmt: (f) => (f >= 1000 ? f / 1000 + 'k' : String(f)), label: 'Frequency (Hz)' }, y: { min: -12, max: 4, label: 'Change (dB)' } });
        seg(ctx, ax.x0, ax.Y(0), ax.x1, ax.Y(0), A.css('muted'), 1, [4, 4]);
        A.plotLine(ctx, ax, F.map((f, i) => [f, R.fabOnly[i]]), A.css('accent2'), 1.8, [5, 4]);
        A.plotLine(ctx, ax, F.map((f, i) => [f, R.y[i]]), A.css('accent'), 2.5);
        // little section sketch
        const ix = ax.x0 + 10, iy = ax.y0 - 74, rec = clamp(st.rec / 200, 0, 1) * 44;
        box(ctx, ix, iy, 96, 66, A.alpha(A.css('bg'), 0.9), A.css('line'));
        box(ctx, ix + 8, iy + 18, 14, 30, '#2b2f36'); dot(ctx, ix + 22, iy + 33, 5, '#8a909c');
        if (st.lined) { box(ctx, ix + 22, iy + 10, rec, 5, A.alpha(A.css('c3'), 0.7)); box(ctx, ix + 22, iy + 51, rec, 5, A.alpha(A.css('c3'), 0.7)); } else { seg(ctx, ix + 22, iy + 12, ix + 22 + rec, iy + 12, A.css('muted'), 2); seg(ctx, ix + 22, iy + 54, ix + 22 + rec, iy + 54, A.css('muted'), 2); }
        seg(ctx, ix + 22 + rec + 2, iy + 6, ix + 22 + rec + 2, iy + 60, A.css('accent2'), 2, [2, 2]);
        if (st.frame) box(ctx, ix + 22 + rec - 3, iy + 28, 5, 10, '#6b4a33');
        for (let k = 0; k < 3; k++) { const u = ((t * 0.7 + k / 3) % 1); ctx.strokeStyle = A.alpha(A.css('accent'), 0.8 * (1 - u)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ix + 22, iy + 33, 4 + u * 62, -0.6, 0.6); ctx.stroke(); }
      },
    });
    host.appendChild(A.legend([[A.css('accent2'), 'fabric alone', true], [A.css('accent'), 'fabric + recess as built']]));
    host.appendChild(tip);
    function upd() {
      const Rf = FAB[st.fab][1], d = st.rec / 1000;
      const fabL = (f) => -(20 * log10(1 + Rf / (2 * 413)) * (0.35 + 0.65 * f / (f + 3000)) + (Rf / 1000) * 2.2 * Math.pow(f / 16000, 1.2));
      const amp = d < 0.004 ? 0 : (st.lined ? 0.1 : 0.42) * Math.min(1, d / 0.05);
      const y = F.map((f) => {
        const a = amp * (f * f / (f * f + 700 * 700)), ph = TAU * f * (2 * d + 0.02) / C0;
        let v = fabL(f) + 20 * log10(Math.hypot(1 + a * Math.cos(ph), a * Math.sin(ph)));
        if (st.frame) v += -3.2 * Math.exp(-Math.pow(Math.log2(f / 6500), 2) / 0.5) + 1.2 * Math.exp(-Math.pow(Math.log2(f / 11000), 2) / 0.12);
        return v;
      });
      const fabOnly = F.map(fabL), at = (arr, f) => arr[F.findIndex((q) => q >= f)];
      let lo = 9, hi = -9; F.forEach((f, i) => { if (f >= 1500 && f <= 12000) { const v = y[i] - fabOnly[i]; lo = Math.min(lo, v); hi = Math.max(hi, v); } });
      const rip = (hi - lo) / 2;
      R = { y, fabOnly };
      const l10 = at(fabOnly, 10000);
      out.innerHTML = A.statBox('Fabric loss at 1 kHz', fmt(at(fabOnly, 1000), 1) + ' dB', FAB[st.fab][0])
        + A.statBox('Fabric loss at 10 kHz', fmt(l10, 1) + ' dB', l10 < -3 ? 'not suitable in front of a tweeter' : l10 < -1.5 ? 'correctable with a gentle shelf' : 'effectively transparent', l10 < -3 ? 'bad' : l10 < -1.5 ? 'warn' : 'good')
        + A.statBox('Ripple from the recess', '± ' + fmt(rip, 1) + ' dB', rip > 1.5 ? 'audible colouration' : 'benign', rip > 1.5 ? 'bad' : rip > 0.8 ? 'warn' : 'good')
        + A.statBox('Flow resistance used', fmt(Rf, 0) + ' rayl', 'illustrative value for this cloth type');
      const l = [];
      if (Rf > 1500) l.push('This cloth is acoustically a lid. In front of a loudspeaker it dulls the top octave by several decibels and reflects energy back into the cavity. Keep dense and pile fabrics for surfaces you want reflective, and switch to an open weave over every loudspeaker and every absorber.');
      else if (Rf > 450) l.push('Stretching a knit closes its pores, and a lining scrim adds a second layer. Each is fine over an absorber; in front of a tweeter the two together cost a decibel or two of treble. Either use a single open cloth over the loudspeaker bay or correct with a measured high shelf.');
      else l.push('An open weave like this loses a fraction of a decibel: you can hold it to your mouth and breathe through it freely. That is the test to repeat on every sample before buying a roll.');
      if (d > 0.03 && !st.lined) l.push(`With the loudspeaker ${mm(st.rec)} back in a hard-sided pocket, sound reflects off the pocket walls and the rear of the fabric frame, arriving a fraction of a millisecond late: comb ripple. Bring the baffle up to within 10–20 mm of the fabric, or line the pocket with 25–50 mm of absorber.`);
      if (st.lined && d > 0.03) l.push('Lining the recess takes most of the ripple away. Leave the lining clear of the drivers and ports, and keep the front baffle flush with the surrounding wall surface wherever you can.');
      if (st.frame) l.push('A batten, track or mid-rail in front of the tweeter casts an acoustic shadow and adds its own reflection. Set out the fabric modules from the loudspeaker positions so every driver looks through clear cloth.');
      l.push('Always measure the loudspeaker in place, with and without the fabric panel fitted. If the difference is a smooth tilt of a decibel or two, equalise it; if it is ripple, fix the construction.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     9. The living-room cinema in three modes
     ====================================================================== */
  V.cinemaLivingRoom = function (host) {
    const st = A.controls(host, [
      { key: 'mode', label: 'Time of day', type: 'select', value: 'film', options: [['day', 'Day — family room'], ['eve', 'Evening — friends and music'], ['film', 'Film night']] },
      { key: 'walls', label: 'Fabric wall lining with absorber behind', type: 'check', value: true },
      { key: 'ceil', label: 'Absorptive stretched ceiling', type: 'check', value: true },
      { key: 'drapes', label: 'Heavy lined curtains at the garden doors', type: 'check', value: true },
      { key: 'rug', label: 'Large thick rug', type: 'check', value: true },
      { key: 'air', label: 'Air system re-tuned (large grilles, lined ducts)', type: 'check', value: true },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'One elevation of the room. Elements that are doing acoustic work in the chosen mode are outlined; on film night the hidden loudspeakers show themselves by the sound leaving them.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const mx = 12, cw2 = w - 24, top = 10, flo = h - 34, film = st.mode === 'film', day = st.mode === 'day';
        const wallC = day ? '#4a4e57' : film ? '#1f2227' : '#34373e', ceilC = day ? '#3d4149' : film ? '#17191d' : '#2a2d33';
        box(ctx, mx, top, cw2, 30, ceilC); box(ctx, mx, top + 30, cw2, flo - top - 30, wallC); box(ctx, mx, flo, cw2, 24, day ? '#9a7146' : '#6f5132');
        const hl = (x, y, ww, hh, on) => { if (on) { ctx.save(); ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.strokeRect(x - 2, y - 2, ww + 4, hh + 4); ctx.restore(); } };
        // garden doors
        const dx = mx + cw2 * 0.72, dw = cw2 * 0.22, dy = top + 44, dh = flo - dy;
        box(ctx, dx, dy, dw, dh, day ? '#bfe3f5' : film ? '#0c1220' : '#3a4b63', '#15161a', 3); seg(ctx, dx + dw / 2, dy, dx + dw / 2, dy + dh, '#15161a', 3);
        if (day) { ctx.fillStyle = A.alpha('#fff3cc', 0.16); ctx.beginPath(); ctx.moveTo(dx, dy + dh); ctx.lineTo(dx + dw, dy + dh); ctx.lineTo(dx + dw * 0.5, flo + 24); ctx.lineTo(dx - dw * 0.9, flo + 24); ctx.closePath(); ctx.fill(); }
        if (st.drapes) { const closed = !day, cwid = closed ? dw / 2 + 2 : dw * 0.14; ctx.fillStyle = '#4b3a34'; for (const sx of [dx - 3, dx + dw + 3 - cwid]) for (let q = 0; q < cwid; q += 7) ctx.fillRect(sx + q, dy - 6, 5, dh + 6); hl(dx - 3, dy - 6, dw + 6, dh + 6, closed); }
        // screen wall
        const sx = mx + cw2 * 0.2, sw2 = cw2 * 0.36, sy = top + 54, sh = (flo - top) * 0.36;
        box(ctx, sx, sy, sw2, sh, film ? '#101727' : '#0b0c0e', '#000000'); if (film) { const g = ctx.createLinearGradient(sx, 0, sx + sw2, 0); g.addColorStop(0, A.alpha('#5b7fd1', 0.5 + 0.2 * Math.sin(t * 1.7))); g.addColorStop(1, A.alpha('#d19a5b', 0.4 + 0.2 * Math.sin(t * 1.1 + 1))); ctx.fillStyle = g; ctx.fillRect(sx + 3, sy + 3, sw2 - 6, sh - 6); }
        box(ctx, sx - 8, sy + sh + 14, sw2 + 16, flo - sy - sh - 14, '#2c2420'); hl(sx - 8, sy + sh + 14, sw2 + 16, flo - sy - sh - 14, film);
        // hidden speakers
        const spk = [[sx - 26, sy + sh * 0.35], [sx + sw2 / 2, sy - 14], [sx + sw2 + 26, sy + sh * 0.35], [mx + cw2 * 0.08, top + 15], [mx + cw2 * 0.62, top + 15]];
        spk.forEach(([px, py], i) => { ctx.save(); ctx.globalAlpha = film ? 0.55 : st.mode === 'eve' && i !== 1 && i < 3 ? 0.35 : 0.12; ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.strokeRect(px - 8, py - 11, 16, 22); ctx.restore(); const on = film || (st.mode === 'eve' && (i === 0 || i === 2)); if (on) for (let k = 0; k < 2; k++) { const u = ((t * 0.6 + k / 2 + i * 0.13) % 1); ctx.strokeStyle = A.alpha(A.css('accent'), 0.7 * (1 - u)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, 6 + u * 34, i > 2 ? 0.3 : -0.9, i > 2 ? Math.PI - 0.3 : 0.9); ctx.stroke(); } });
        // sofa + rug + lamp
        if (st.rug) { box(ctx, mx + cw2 * 0.12, flo + 6, cw2 * 0.56, 10, '#8c5a4c'); hl(mx + cw2 * 0.12, flo + 6, cw2 * 0.56, 10, true); }
        ctx.fillStyle = '#6a6d73'; ctx.fillRect(mx + cw2 * 0.02, flo - 36, cw2 * 0.13, 36); ctx.fillRect(mx + cw2 * 0.02, flo - 54, cw2 * 0.03, 54);
        const lx = mx + cw2 * 0.66; seg(ctx, lx, flo, lx, flo - 70, '#111', 2); ctx.fillStyle = film ? '#3a3024' : '#e9c98a'; ctx.beginPath(); ctx.moveTo(lx - 12, flo - 70); ctx.lineTo(lx + 12, flo - 70); ctx.lineTo(lx + 7, flo - 88); ctx.lineTo(lx - 7, flo - 88); ctx.closePath(); ctx.fill();
        if (!film && !day) { const g = ctx.createRadialGradient(lx, flo - 70, 2, lx, flo - 70, 90); g.addColorStop(0, A.alpha('#ffd98a', 0.3)); g.addColorStop(1, A.alpha('#ffd98a', 0)); ctx.fillStyle = g; ctx.fillRect(lx - 90, flo - 160, 180, 180); }
        hl(mx + 2, top + 2, cw2 - 4, 26, st.ceil); hl(mx + 2, top + 34, cw2 * 0.16, flo - top - 40, st.walls);
        if (st.air) { box(ctx, mx + cw2 * 0.34, top + 24, cw2 * 0.2, 4, '#0a0a0b'); for (let k = 0; k < 4; k++) { const u = ((t * (film ? 0.25 : 0.5) + k / 4) % 1); dot(ctx, mx + cw2 * (0.36 + 0.05 * k), top + 30 + u * 26, 1.8, A.alpha(A.css('c4'), 0.7 * (1 - u))); } }
        if (film) { ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(mx, top, cw2, flo + 24 - top); }
      },
    });
    host.appendChild(tip);
    function upd() {
      const day = st.mode === 'day', film = st.mode === 'film';
      let rt = 0.78;
      if (st.ceil) rt -= 0.22; if (st.walls) rt -= 0.13; if (st.rug) rt -= 0.06; if (st.drapes) rt -= day ? 0.02 : 0.1;
      rt = Math.max(0.22, rt);
      const nc = st.air ? (film ? 20 : 25) : (film ? 32 : 35);
      const working = [st.ceil && 'ceiling', st.walls && 'wall lining', st.rug && 'rug', st.drapes && !day && 'curtains', 'sofas'].filter(Boolean);
      R = { rt };
      out.innerHTML = A.statBox('Mid-band decay time', fmt(rt, 2) + ' s', rt > 0.5 ? 'lively — dialogue will blur' : rt < 0.3 ? 'very controlled' : 'comfortable and clear', rt > 0.5 ? 'warn' : 'good')
        + A.statBox('Background noise', 'about NC-' + nc, st.air ? (film ? 'fan on its low setting' : 'normal running') : 'standard grilles hiss', nc > 28 ? 'warn' : 'good')
        + A.statBox('Loudspeakers in use', film ? 'all, including overhead' : day ? 'none' : 'front pair for music', 'none of them visible')
        + A.statBox('Elements working now', String(working.length), working.join(', '));
      const l = [];
      if (day) l.push('By day the curtains are open, the doors to the garden are in use and the room is simply a quiet, slightly soft sitting room. The absorptive ceiling is what makes conversation easy.');
      if (st.mode === 'eve') l.push('In the evening the curtains close for privacy and add their absorption; the front pair plays music with the lamps on. Nothing has been moved or switched except the lights.');
      if (film) l.push('For a film one scene preset closes the curtains, drops the lights, slows the fan and wakes every hidden loudspeaker. The room has not changed shape — only which hidden elements are active.');
      if (!st.ceil) l.push('Without the absorptive ceiling the decay stays long however much furniture you add. In a room that must keep its windows and its plain walls, the ceiling is the one large surface nobody minds giving up.');
      if (!st.walls) l.push('Without any wall lining the side reflections stay strong: speech from the screen loses clarity at the far seats. Even 50 mm behind fabric on the rear and side walls is worth having.');
      if (!st.air) l.push('Standard small grilles hiss at film-night levels of quiet. Larger grilles, slower air and a metre or two of lined duct usually buy 8–10 dB without touching the machine.');
      if (!st.drapes) l.push('Bare glass doors are both a reflection and a light leak. Heavy lined curtains on a ceiling track, stacked clear of the glass by day, solve both.');
      l.push('The low end is the part furniture cannot fix. Hide two or four subwoofers and a deep absorber in the joinery under the screen and in a rear cabinet, then equalise the average of the seats.');
      tips(tip, l); cv.redraw();
    }
    upd();
  };
})();
