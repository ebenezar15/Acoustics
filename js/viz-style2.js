/* ==========================================================================
   Acoustica — fabric finishes: choosing cloth (with an Indian market list)
   and installing it neatly (wrapped panels, tracks, stretched walls, clouds).
   Simplified, indicative teaching models: right trends and magnitudes,
   not a substitute for a laboratory test or a structural check.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt } = A;
  const TAU = Math.PI * 2, log10 = Math.log10;
  const tp = (t) => Math.max(0, t);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const seg = (ctx, x1, y1, x2, y2, c, wd = 1, dash) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = wd; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); };
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fill(); };
  const box = (ctx, x, y, w, h, fill, stroke, lw = 1) => { if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h); } };
  const tips = (b, list, cls = 'mentor') => { b.innerHTML = `<div class="callout ${cls}"><ul style="margin:0;padding-left:18px">${list.map((x) => `<li>${x}</li>`).join('')}</ul></div>`; };
  const stats = (host) => { const o = el('div', { class: 'stats' }); host.appendChild(o); return o; };
  const rupee = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
  const Z0 = P.RHO * P.C;

  /* ----------------------------------------------------------------------
     The fabric list: things you can actually buy in Indian cloth,
     upholstery and electronics markets. Flow resistance values are typical
     estimates for teaching — always test the actual cloth.
     r = specific airflow resistance relaxed (rayls), rs = when stretched tight,
     gsm, open = see-through open area (0–1), sag = 0 stable … 3 sags badly,
     wet = what a water drop does, price = rough ₹ per running metre.
     ---------------------------------------------------------------------- */
  const FAB = [
    { k: 'grille', n: 'Speaker grille cloth (polyester knit)', r: 40, rs: 60, gsm: 120, open: 0.45, sag: 0, fray: 'low', fire: 'Melts and shrinks away; FR versions exist', price: [250, 600], wd: 58, stretch: 1, tex: 'plain', wet: 'through', verdict: 'Transparent', cls: 'good', use: 'In front of loudspeakers; any absorber', note: 'Sold in electronics and speaker-parts markets. Thin, so always use a liner or a dark cavity behind it.' },
    { k: 'matty', n: 'Polyester “matty” / basket-weave upholstery cloth', r: 180, rs: 180, gsm: 260, open: 0.22, sag: 0, fray: 'medium', fire: 'Melts; ask for an FR-treated or inherently FR lot', price: [180, 450], wd: 54, stretch: 0, tex: 'textured', wet: 'wick', verdict: 'Good for absorbers', cls: 'good', use: 'Wrapped panels, track walls, clouds', note: 'The workhorse: stable in humidity, hides staples and seams, huge colour range in sofa-fabric shops.' },
    { k: 'panama', n: 'Panama / “jute-look” polyester', r: 250, rs: 250, gsm: 300, open: 0.18, sag: 0, fray: 'medium', fire: 'Melts; FR lots available to order', price: [250, 600], wd: 54, stretch: 0, tex: 'textured', wet: 'wick', verdict: 'Good for absorbers', cls: 'good', use: 'Walls and panels where a natural look is wanted', note: 'Looks like jute or linen without their sagging. Check that it has no latex or acrylic back-coating.' },
    { k: 'hessian', n: 'Hessian / jute (burlap)', r: 60, rs: 60, gsm: 280, open: 0.5, sag: 3, fray: 'high', fire: 'Burns readily unless treated', price: [60, 150], wd: 44, stretch: 0, tex: 'textured', wet: 'wick', verdict: 'Transparent but troublesome', cls: 'warn', use: 'Budget home panels in dry rooms, with a liner', note: 'Very open and very cheap, but it sheds fibre, smells when damp, sags in the monsoon and fades.' },
    { k: 'casement', n: 'Cotton casement / cambric', r: 350, rs: 350, gsm: 140, open: 0.12, sag: 2, fray: 'medium', fire: 'Burns; needs FR treatment (lost on washing)', price: [90, 220], wd: 48, stretch: 0, tex: 'plain', wet: 'wick', verdict: 'Acceptable for absorbers', cls: 'warn', use: 'Home panels in air-conditioned rooms', note: 'Pre-wash and iron before use; expect it to relax in humid weather. Choose the loosest weave on the shelf.' },
    { k: 'mulmul', n: 'Cotton voile / mulmul', r: 110, rs: 110, gsm: 70, open: 0.35, sag: 2, fray: 'medium', fire: 'Burns quickly', price: [80, 200], wd: 44, stretch: 0, tex: 'plain', wet: 'wick', verdict: 'Transparent, see-through', cls: 'warn', use: 'Liner under a face fabric; not a face fabric', note: 'So thin that the core shows through. Useful as an inner dust layer, not as the visible finish.' },
    { k: 'cotlin', n: 'Cotton-linen blend', r: 300, rs: 300, gsm: 220, open: 0.15, sag: 2, fray: 'medium', fire: 'Burns; needs FR treatment', price: [300, 800], wd: 54, stretch: 0, tex: 'textured', wet: 'wick', verdict: 'Acceptable for absorbers', cls: 'warn', use: 'Feature panels in conditioned rooms', note: 'Lovely texture; creases and relaxes with moisture. Keep panels small and pre-shrink the cloth.' },
    { k: 'khadi', n: 'Khadi (hand-spun, hand-woven cotton)', r: 220, rs: 220, gsm: 180, open: 0.2, sag: 3, fray: 'medium', fire: 'Burns; needs FR treatment', price: [150, 400], wd: 40, stretch: 0, tex: 'textured', wet: 'wick', verdict: 'Acceptable, uneven', cls: 'warn', use: 'Small decorative panels', note: 'Beautiful and irregular: narrow widths, shade varies by lot, and it moves with the weather.' },
    { k: 'interlock', n: 'Polyester interlock / jersey knit', r: 200, rs: 450, gsm: 180, open: 0.15, sag: 0, fray: 'low', fire: 'Melts; FR lots to order', price: [150, 350], wd: 62, stretch: 1, tex: 'plain', wet: 'wick', verdict: 'Good if not over-stretched', cls: 'good', use: 'Curved or large seamless panels, clouds', note: 'Stretch removes wrinkles easily. The knit closes up when pulled hard, so test it at installed tension.' },
    { k: 'lycra', n: '4-way stretch knit (lycra-type)', r: 300, rs: 900, gsm: 200, open: 0.1, sag: 0, fray: 'low', fire: 'Melts; check the FR certificate', price: [200, 450], wd: 60, stretch: 1, tex: 'plain', wet: 'wick', verdict: 'Borderline when tight', cls: 'warn', use: 'Bass traps, shaped pieces', note: 'Drum-tight and wrinkle-free, but at full stretch it starts to reflect treble. Fine in front of deep bass absorbers.' },
    { k: 'mesh', n: 'Air-mesh / net fabric', r: 15, rs: 15, gsm: 150, open: 0.7, sag: 0, fray: 'low', fire: 'Melts', price: [120, 300], wd: 58, stretch: 1, tex: 'textured', wet: 'through', verdict: 'Fully transparent, see-through', cls: 'good', use: 'Speaker grilles; over a black liner', note: 'You can see straight through it. Needs a black scrim behind or it shows everything.' },
    { k: 'sheer', n: 'Sheer polyester curtain voile', r: 50, rs: 50, gsm: 60, open: 0.5, sag: 0, fray: 'medium', fire: 'Melts; FR curtain grades exist', price: [100, 300], wd: 54, stretch: 0, tex: 'plain', wet: 'through', verdict: 'Transparent, see-through', cls: 'warn', use: 'Liner; double layer over a dark core', note: 'Stable and cheap but far too thin alone. Slippery to staple straight.' },
    { k: 'felt', n: 'Thin polyester felt (needle-punched)', r: 500, rs: 500, gsm: 350, open: 0.02, sag: 0, fray: 'none', fire: 'Melts; FR grades common', price: [150, 400], wd: 60, stretch: 0, tex: 'textured', wet: 'wick', verdict: 'Semi-transparent', cls: 'warn', use: 'Pin-board style panels, bass traps', note: 'No fraying and easy to cut. Slightly dulls the top octave; pills with rubbing.' },
    { k: 'velvet', n: 'Velvet / velour', r: 1500, rs: 1500, gsm: 350, open: 0.02, sag: 1, fray: 'medium', fire: 'Varies; many burn', price: [300, 900], wd: 54, stretch: 0, tex: 'textured', wet: 'bead', verdict: 'Reflects treble', cls: 'bad', use: 'Curtains hung in folds — not panel covers', note: 'As a heavy pleated curtain it absorbs well. Stretched flat over a panel it blocks the highs from reaching the core.' },
    { k: 'suede', n: 'Suede-look microfibre', r: 2500, rs: 2500, gsm: 280, open: 0, sag: 0, fray: 'low', fire: 'Melts', price: [300, 700], wd: 54, stretch: 0, tex: 'plain', wet: 'bead', verdict: 'Mostly reflective', cls: 'bad', use: 'Seating and trims only', note: 'Usually bonded to a backing. Fails the breath test.' },
    { k: 'canvas', n: 'Canvas / duck cloth', r: 1800, rs: 1800, gsm: 400, open: 0.01, sag: 2, fray: 'low', fire: 'Burns unless treated', price: [150, 400], wd: 44, stretch: 0, tex: 'plain', wet: 'bead', verdict: 'Reflects treble', cls: 'bad', use: 'Protective skirting bands, not covers', note: 'Tough and tempting, but the weave is too tight. Turns a broadband panel into a mid-bass panel.' },
    { k: 'blackout', n: 'Blackout curtain cloth (coated)', r: 200000, rs: 200000, gsm: 320, open: 0, sag: 0, fray: 'low', fire: 'Depends on coating', price: [200, 500], wd: 54, stretch: 0, tex: 'plain', wet: 'bead', verdict: 'Airtight', cls: 'bad', use: 'Window curtains only', note: 'The coating that stops light also stops air. Never over an absorber.' },
    { k: 'rexine', n: 'Rexine / leatherette / vinyl', r: 1000000, rs: 1000000, gsm: 500, open: 0, sag: 0, fray: 'none', fire: 'Depends on grade; smoke is toxic', price: [200, 600], wd: 54, stretch: 0, tex: 'plain', wet: 'bead', verdict: 'Airtight — a reflector', cls: 'bad', use: 'Door pads, arm rests, deliberate membranes', note: 'Completely sealed. Only useful where you actually want a wipe-clean reflecting or membrane surface.' },
    { k: 'spunbond', n: 'Non-woven spunbond, 40–60 GSM (liner)', r: 60, rs: 60, gsm: 50, open: 0.25, sag: 0, fray: 'none', fire: 'Melts', price: [15, 40], wd: 63, stretch: 0, tex: 'plain', wet: 'through', verdict: 'Transparent liner', cls: 'good', use: 'Dust and colour liner under the face cloth', note: 'The thin sheet used for bags and mattress covers. Buy black; reject any that fails the breath test.' },
  ];
  V.fabricList = FAB;
  const FOPT = FAB.map((f) => [f.k, f.n]);
  const fabOf = (k) => FAB.find((f) => f.k === k) || FAB[1];

  /* complex helpers for a covered absorber */
  const { Cx, cadd, cmul, cdiv, cabs, ctan, ccot, cscale } = P.complex;
  function layerZ(Zc, k, d, ZL) {
    const kd = cscale(k, d);
    if (!ZL) return cmul(Cx(0, -1), cmul(Zc, ccot(kd)));
    const t = ctan(kd), j = Cx(0, 1);
    return cmul(Zc, cdiv(cadd(ZL, cmul(j, cmul(Zc, t))), cadd(Zc, cmul(j, cmul(ZL, t)))));
  }
  /* a limp cloth: flow resistance in parallel with its own mass */
  function fabricZ(f, R, gsm) {
    const m = Cx(0, TAU * f * Math.max(0.03, gsm / 1000));
    const r = Cx(R, 0);
    return cdiv(cmul(r, m), cadd(r, m));
  }
  function coveredAlpha(f, R, gsm, d, gap, sigma = 10000) {
    const { Zc, k } = P.porousZk(f, sigma);
    const back = gap > 0 ? layerZ(Cx(Z0), Cx((TAU * f) / P.C, 0), gap, null) : null;
    let Zs = layerZ(Zc, k, d, back);
    if (R > 0) Zs = cadd(Zs, fabricZ(f, R, gsm));
    return P.alphaFromZ(Zs);
  }
  const insertionLoss = (f, R, gsm) => { const z = fabricZ(f, R, gsm); return 20 * log10(cabs(cadd(Cx(1, 0), cscale(z, 1 / (2 * Z0))))); };
  const FQ = []; for (let i = 0; i <= 60; i++) FQ.push(50 * Math.pow(2, i * (Math.log2(16000 / 50) / 60)));
  const kfmt = (f) => (f >= 1000 ? f / 1000 + 'k' : String(f));

  /* ======================================================================
     1. Fabric transmission and covered-absorber response
     ====================================================================== */
  V.fabricTransmission = function (host) {
    const st = A.controls(host, [
      { key: 'fab', label: 'Fabric', type: 'select', value: 'matty', options: [['custom', 'Custom — use the sliders']].concat(FOPT) },
      { key: 'tight', label: 'Stretched drum-tight', type: 'check', value: false },
      { key: 'res', label: 'Custom airflow resistance', type: 'range', min: 1, max: 4, step: 0.02, value: 2.3, fmt: (v) => fmt(Math.pow(10, v), 0) + ' rayls' },
      { key: 'gsm', label: 'Custom weight', type: 'range', min: 40, max: 500, step: 10, value: 200, unit: 'GSM' },
      { key: 'core', label: 'Absorber behind the cloth', type: 'select', value: '50', options: [['50', '50 mm slab on the wall'], ['100', '100 mm slab on the wall'], ['100g', '100 mm slab + 100 mm air gap'], ['300', '300 mm bass trap']] },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv1 = A.canvas(host, {
      height: 230,
      caption: 'Cloth in front of a loudspeaker: how many decibels are lost on the way through, by frequency. A flat line near zero is what a grille needs. The shaded zone under one decibel is inaudible.',
      draw(ctx, w, h) {
        if (!R) return;
        const top = Math.max(6, Math.ceil(Math.max(...R.il) / 3) * 3);
        const ax = A.axes(ctx, w, h, { x: { min: 50, max: 16000, log: true, ticks: [63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000], fmt: kfmt, label: 'Frequency (Hz)' }, y: { min: 0, max: top, label: 'Loss (dB)' } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.12); ctx.fillRect(ax.x0, ax.Y(1), ax.x1 - ax.x0, ax.Y(0) - ax.Y(1));
        A.plotLine(ctx, ax, FQ.map((f, i) => [f, Math.min(top, R.il[i])]), A.css('accent'), 2.5);
      },
    });
    const cv2 = A.canvas(host, {
      height: 250,
      caption: 'The same cloth over an absorber: absorption of the bare core compared with the covered one. A light cover changes almost nothing; a tight one lifts the low-mids a little and takes away the highs — the panel turns from broadband into a mid-bass absorber.',
      draw(ctx, w, h) {
        if (!R) return;
        const ax = A.axes(ctx, w, h, { x: { min: 50, max: 16000, log: true, ticks: [63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000], fmt: kfmt, label: 'Frequency (Hz)' }, y: { min: 0, max: 1.05, label: 'Absorption' } });
        A.plotLine(ctx, ax, FQ.map((f, i) => [f, R.a0[i]]), A.css('muted'), 2, [5, 4]);
        A.plotFill(ctx, ax, FQ.map((f, i) => [f, R.a1[i]]), A.alpha(A.css('accent'), 0.15), 0);
        A.plotLine(ctx, ax, FQ.map((f, i) => [f, R.a1[i]]), A.css('accent'), 2.5);
      },
    });
    host.appendChild(A.legend([[A.css('muted'), 'bare absorber', true], [A.css('accent'), 'with this cloth']]));
    host.appendChild(tip);
    function upd() {
      const f = st.fab === 'custom' ? null : fabOf(st.fab);
      const res = f ? (st.tight ? f.rs : f.r) : Math.pow(10, st.res) * (st.tight ? 1.5 : 1);
      const gsm = f ? f.gsm : st.gsm;
      const d = st.core === '50' ? 0.05 : st.core === '300' ? 0.3 : 0.1, gap = st.core === '100g' ? 0.1 : 0, sig = st.core === '300' ? 5000 : 10000;
      const il = FQ.map((x) => insertionLoss(x, res, gsm));
      const a0 = FQ.map((x) => coveredAlpha(x, 0, gsm, d, gap, sig)), a1 = FQ.map((x) => coveredAlpha(x, res, gsm, d, gap, sig));
      R = { il, a0, a1 };
      const at = (arr, fq) => arr[FQ.reduce((b, x, i) => (Math.abs(Math.log(x / fq)) < Math.abs(Math.log(FQ[b] / fq)) ? i : b), 0)];
      const nrc = (a) => (at(a, 250) + at(a, 500) + at(a, 1000) + at(a, 2000)) / 4;
      const il1 = at(il, 1000), il8 = at(il, 8000), dn = nrc(a1) - nrc(a0), d8 = at(a1, 8000) - at(a0, 8000), d250 = at(a1, 250) - at(a0, 250);
      const spk = il8 < 1 ? ['fine as a grille', 'good'] : il8 < 2.5 ? ['a small, audible loss', 'warn'] : ['not for speakers', 'bad'];
      const abs = d8 > -0.08 ? ['fine over absorbers', 'good'] : d8 > -0.25 ? ['only over bass traps', 'warn'] : ['turns the panel reflective', 'bad'];
      out.innerHTML = A.statBox('Airflow resistance', res >= 100000 ? 'airtight' : fmt(res, 0) + ' rayls', st.tight ? 'at full stretch' : 'relaxed', res < 300 ? 'good' : res < 1000 ? 'warn' : 'bad')
        + A.statBox('Loss at 1 kHz', fmt(il1, 1) + ' dB', 'in front of a speaker')
        + A.statBox('Loss at 8 kHz', fmt(il8, 1) + ' dB', spk[0], spk[1])
        + A.statBox('Absorption at 250 Hz', (d250 >= 0 ? '+' : '') + fmt(d250, 2), 'change caused by the cover')
        + A.statBox('Absorption at 8 kHz', (d8 >= 0 ? '+' : '') + fmt(d8, 2), abs[0], abs[1])
        + A.statBox('Mid-band average', (dn >= 0 ? '+' : '') + fmt(dn, 2), 'average of 250 Hz – 2 kHz');
      const t = [];
      if (res < 100) t.push('Under about 100 rayls the cloth is acoustically invisible — the right choice in front of a loudspeaker and safe over anything.');
      else if (res < 400) t.push('A few hundred rayls: lovely over broadband absorbers and clouds, slightly too much in front of a tweeter.');
      else if (res < 1200) t.push('Around a thousand rayls the cover starts acting as part of the absorber: more low-mid, less treble. Keep it for bass traps and thick panels where the highs are handled elsewhere.');
      else t.push('This cloth is closer to a wall than a curtain. The absorber behind it never sees the treble, so the room keeps its flutter and harshness while the mid-bass is soaked up — the classic “dead but harsh” room.');
      if (f && f.stretch && st.tight) t.push('Stretch knits close their loops as they are pulled. Always do the breath test with the sample stretched as tight as it will be on the frame.');
      if (f && f.stretch && !st.tight) t.push('Tick “stretched drum-tight” to see how much this knit closes up when tensioned.');
      if (st.core === '300') t.push('In front of a deep bass trap a tighter cloth costs nothing useful: the trap is there for the lows, and a little reflected treble keeps the room from going dull.');
      if (gsm > 350 && res > 500) t.push('Heavy and tight together is the worst case: the mass of the cloth blocks the highs as well as its tightness.');
      tips(tip, t, res < 400 ? 'mentor' : 'warn');
      cv1.redraw(); cv2.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Field tests: breath, candle, light, water drop
     ====================================================================== */
  V.fieldTests = function (host) {
    const st = A.controls(host, [
      { key: 'fab', label: 'Fabric sample', type: 'select', value: 'matty', options: FOPT },
      { key: 'test', label: 'Test', type: 'select', value: 'breath', options: [['breath', 'Breath test'], ['candle', 'Candle (blow) test'], ['light', 'Hold-to-light test'], ['water', 'Water-drop test']] },
      { key: 'tight', label: 'Sample stretched tight', type: 'check', value: false },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let f = FAB[1], res = 180, pass = 1;
    const parts = Array.from({ length: 46 }, (_, i) => ({ ph: (i * 0.618) % 1, y: ((i * 0.37) % 1) - 0.5 }));
    A.canvas(host, {
      height: 250, animate: true,
      caption: 'Each test done on the chosen sample. Watch how much of the air, light or water gets through: that is the cloth telling you how sound will be treated.',
      draw(ctx, w, h, t) {
        t = tp(t);
        const cx = w * 0.5, mid = h * 0.52, accent = A.css('accent'), muted = A.css('muted'), text = A.css('text');
        const thru = 1 / (1 + res / 250); // share of air that gets through easily
        if (st.test === 'breath' || st.test === 'candle') {
          // mouth
          ctx.fillStyle = A.alpha(muted, 0.35); ctx.beginPath(); ctx.arc(w * 0.08, mid, 26, -1.2, 1.2); ctx.lineTo(w * 0.08, mid); ctx.fill();
          A.text(ctx, st.test === 'breath' ? 'breathe out' : 'sharp puff', 6, mid + 48, { size: 11, color: muted });
          // fabric
          const sway = Math.sin(t * 5) * (1 - thru) * 5;
          ctx.strokeStyle = text; ctx.lineWidth = 3; ctx.setLineDash(res < 100 ? [5, 5] : res < 600 ? [8, 3] : []); ctx.beginPath(); ctx.moveTo(cx, mid - 80); ctx.quadraticCurveTo(cx + 6 + sway, mid, cx, mid + 80); ctx.stroke(); ctx.setLineDash([]);
          A.text(ctx, 'fabric', cx, mid - 88, { size: 11, align: 'center', color: muted });
          const puff = st.test === 'candle' ? (t % 3 < 1 ? 1 : 0.15) : 0.7 + 0.3 * Math.sin(t * 1.4);
          parts.forEach((p, i) => {
            const u = (p.ph + t * (0.25 + 0.2 * puff)) % 1, through = (i / parts.length) < thru;
            const x0 = w * 0.12, xe = through ? w * 0.86 : cx - 6;
            let x = x0 + u * (xe - x0), y = mid + p.y * (50 + 70 * u);
            if (!through && u > 0.8) { y += (u - 0.8) * 260 * (p.y > 0 ? 1 : -1); x = cx - 8 - (u - 0.8) * 60; }
            dot(ctx, x, y, 2.4, A.alpha(through ? accent : A.css('bad'), 0.25 + 0.6 * puff * (1 - Math.abs(u - 0.5))));
          });
          if (st.test === 'candle') {
            const bx = w * 0.84, by = mid + 30, lean = thru * (t % 3 < 1.3 ? Math.sin(Math.min(1, (t % 3) / 0.5) * Math.PI) * 1 + 0.25 * Math.sin(t * 22) * (t % 3 < 1.3 ? 1 : 0) : 0);
            box(ctx, bx - 7, by, 14, 46, A.alpha(muted, 0.5));
            seg(ctx, bx, by, bx, by - 6, text, 1.5);
            const flick = Math.sin(t * 9) * 1.5;
            ctx.fillStyle = A.css('warn'); ctx.beginPath(); ctx.moveTo(bx - 6, by - 6); ctx.quadraticCurveTo(bx + lean * 34 + flick, by - 22, bx + lean * 46 + flick, by - 40 + lean * 14); ctx.quadraticCurveTo(bx + 8 + lean * 20, by - 18, bx + 6, by - 6); ctx.fill();
            A.text(ctx, lean > 0.3 ? 'flame bends' : thru > 0.3 ? 'flame flickers' : 'flame stays still', bx, by + 62, { size: 11, align: 'center', color: muted });
          } else {
            A.text(ctx, thru > 0.6 ? 'feels like open air' : thru > 0.3 ? 'slight push needed' : 'cheeks puff — air is held back', w * 0.78, mid + 78, { size: 11, align: 'center', color: muted });
          }
        } else if (st.test === 'light') {
          const sz = Math.min(h - 50, w * 0.42), x0 = cx - sz / 2, y0 = 18, n = 11, cell = sz / n, gap = cell * Math.sqrt(clamp(f.open * (st.tight && f.stretch ? 0.5 : 1), 0, 0.8));
          box(ctx, x0, y0, sz, sz, A.alpha(A.css('warn'), 0.9));
          const glow = 0.85 + 0.15 * Math.sin(t * 2);
          ctx.fillStyle = A.alpha('#ffffff', 0.5 * glow); ctx.beginPath(); ctx.arc(cx, y0 + sz / 2, sz * 0.3, 0, TAU); ctx.fill();
          ctx.fillStyle = A.css('panel2');
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
            const th = cell - gap;
            ctx.fillRect(x0 + i * cell, y0 + j * cell, th, cell + 0.5);
            ctx.fillRect(x0 + i * cell, y0 + j * cell, cell + 0.5, th);
          }
          ctx.strokeStyle = text; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, sz, sz);
          A.text(ctx, 'weave magnified, lamp behind', cx, y0 + sz + 18, { size: 11, align: 'center', color: muted });
        } else {
          // water drop
          const fy = mid + 20, cyc = t % 4;
          seg(ctx, w * 0.15, fy, w * 0.85, fy, text, 3, res < 100 ? [5, 5] : res < 600 ? [8, 3] : null);
          A.text(ctx, 'fabric, held flat', w * 0.15, fy - 8, { size: 11, color: muted });
          const col = A.css('c3');
          if (cyc < 0.8) dot(ctx, cx, fy - 100 + (cyc / 0.8) * 92, 7, col);
          else {
            const u = clamp((cyc - 0.8) / 2.6, 0, 1);
            if (f.wet === 'bead') { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, fy - 6, 11, 7, 0, 0, TAU); ctx.fill(); }
            else if (f.wet === 'wick') { ctx.fillStyle = A.alpha(col, 0.55); ctx.beginPath(); ctx.ellipse(cx, fy, 10 + u * 46, 4, 0, 0, TAU); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, fy - 4 * (1 - u), 9 * (1 - u), 6 * (1 - u), 0, 0, TAU); ctx.fill(); }
            else { for (let i = 0; i < 3; i++) dot(ctx, cx - 8 + i * 8, fy + 6 + u * (60 + i * 14), 3.2 * (1 - 0.5 * u), col); }
          }
          A.text(ctx, f.wet === 'bead' ? 'drop sits on top like a bead' : f.wet === 'wick' ? 'drop spreads into the yarn' : 'drop falls straight through', cx, fy + 92, { size: 11, align: 'center', color: muted });
        }
      },
    });
    host.appendChild(tip);
    function upd() {
      f = fabOf(st.fab); res = st.tight ? f.rs : f.r;
      const tight = st.tight && f.stretch;
      const openNow = f.open * (tight ? 0.5 : 1);
      let verdict, cls, mean;
      if (st.test === 'breath' || st.test === 'candle') {
        pass = res < 300 ? 2 : res < 1000 ? 1 : 0;
        verdict = ['Fail', 'Marginal', 'Pass'][pass]; cls = ['bad', 'warn', 'good'][pass];
        mean = st.test === 'breath'
          ? ['You have to push: sound will be pushed back too. Reject it as an absorber cover.', 'Some resistance. Acceptable over deep bass traps, not over thin panels or speakers.', 'Air moves freely, so sound pressure does too. Suitable over absorbers' + (res < 100 ? ' and in front of speakers.' : '.')][pass]
          : ['The flame ignores you. The cloth is a wall to moving air.', 'A lazy flicker only. Use it where treble absorption is not the aim.', 'The flame bends clearly: air is passing with little loss.'][pass];
      } else if (st.test === 'light') {
        pass = openNow > 0.3 ? 2 : openNow > 0.08 ? 1 : 0;
        verdict = ['Opaque', 'Pin-points of light', 'Clear sparkle'][pass]; cls = res > 1000 ? 'bad' : 'good';
        mean = ['No light at all. That is fine for hiding the core but, with a failed breath test, it means a sealed or coated cloth.', 'A fine grid of bright pin-points: an open weave that still hides what is behind. The sweet spot for a face fabric.', 'Lots of light: very transparent to sound, but the core, frame and staples will show. Plan a dark liner.'][pass];
        if (res < 1000 && pass === 0) mean = 'No light, yet air passes: a felt or dense knit. It will hide everything behind and still breathe moderately.';
      } else {
        pass = f.wet === 'bead' ? 0 : 2;
        verdict = { bead: 'Beads on top', wick: 'Soaks in', through: 'Passes through' }[f.wet]; cls = f.wet === 'bead' ? 'bad' : f.wet === 'wick' ? 'warn' : 'good';
        mean = { bead: 'A drop that sits there means a coating, a laminated backing or a very tight pile. Expect a failed breath test too.', wick: 'The yarn drinks the water. No coating — good — but if it is cotton, jute or linen it will also drink monsoon humidity and relax.', through: 'Open enough for water to fall through: no coating, no backing, and synthetic yarn that does not swell.' }[f.wet];
      }
      out.innerHTML = A.statBox('Result', verdict, '', cls) + A.statBox('Typical resistance', res >= 100000 ? 'airtight' : fmt(res, 0) + ' rayls', tight ? 'stretched' : 'relaxed') + A.statBox('Open area you can see', fmt(openNow * 100, 0) + ' %', 'needs a liner above about 25 %') + A.statBox('Overall verdict', f.verdict, f.use, f.cls);
      const t = [mean, f.note];
      if (st.tight && !f.stretch) t.push('This cloth has no real stretch, so tension hardly changes the result.');
      tips(tip, t, cls === 'bad' ? 'warn' : 'mentor');
    }
    upd();
  };

  /* ======================================================================
     3. India fabric chooser
     ====================================================================== */
  V.indiaFabricChooser = function (host) {
    const st = A.controls(host, [
      { key: 'behind', label: 'What is behind the cloth?', type: 'select', value: 'absorber', options: [['speaker', 'A loudspeaker'], ['absorber', 'Broadband absorber / cloud'], ['trap', 'Deep bass trap'], ['diffuser', 'A diffuser'], ['deco', 'Nothing — decorative only']] },
      { key: 'room', label: 'Room', type: 'select', value: 'home', options: [['home', 'Home studio / private room'], ['commercial', 'Commercial or public room']] },
      { key: 'climate', label: 'Climate', type: 'select', value: 'humid', options: [['dry', 'Dry, always air-conditioned'], ['humid', 'Humid monsoon, AC on and off'], ['coastal', 'Coastal, salty and humid']] },
      { key: 'look', label: 'Look', type: 'select', value: 'textured', options: [['plain', 'Plain and smooth'], ['textured', 'Textured weave']] },
      { key: 'shade', label: 'Shade', type: 'select', value: 'dark', options: [['dark', 'Dark'], ['light', 'Light']] },
      { key: 'method', label: 'Installation method', type: 'select', value: 'wrap', options: [['wrap', 'Wrapped panels'], ['track', 'Stretched in tracks / on site']] },
      { key: 'budget', label: 'Budget for the cloth', type: 'range', min: 50, max: 900, step: 10, value: 400, fmt: (v) => rupee(v) + ' / m' },
    ], () => upd());
    const out = stats(host), list = el('div'), tip = el('div');
    host.appendChild(list); host.appendChild(tip);
    function score(f) {
      const why = []; let s = 50;
      if (f.k === 'spunbond') return null;
      const lim = { speaker: 100, absorber: 400, trap: 1200, diffuser: 0, deco: 1e9 }[st.behind];
      const res = st.method === 'track' ? f.rs : f.r;
      if (st.behind === 'diffuser') return null;
      if (res > lim * 2.5) return null;
      if (res <= lim) { s += 25; why.push('breathes freely enough for this job'); } else { s -= 15; why.push('slightly tight for this job — test the actual roll'); }
      if (st.behind === 'trap' && res > 300 && res <= 1200) { s += 5; why.push('a tighter cover is harmless over a bass trap'); }
      const hum = st.climate === 'dry' ? 0.3 : st.climate === 'humid' ? 1 : 1.25;
      s -= f.sag * 11 * hum; if (f.sag === 0) why.push('stable in humidity'); else if (f.sag >= 2 && hum >= 1) why.push('will relax in the monsoon — keep panels small and pre-shrink');
      if (st.climate === 'coastal' && /cotton|jute|khadi|linen/i.test(f.n)) { s -= 8; why.push('natural fibre plus salt air invites mildew'); }
      if (st.room === 'commercial') { if (/Melts/.test(f.fire)) { s += 6; why.push('FR polyester lots can be ordered with a certificate'); } else { s -= 18; why.push('needs FR treatment and a test certificate before it is allowed'); } }
      if (f.tex === st.look) s += 8;
      if (f.open > 0.4 && st.behind !== 'speaker') { s -= 12; why.push('see-through — everything behind must be black-lined'); }
      if (st.shade === 'light' && f.open > 0.3) { s -= 12; why.push('light shades of an open cloth show the core — double liner needed'); }
      if (st.method === 'track') { if (f.stretch) { s += 6; why.push('a little stretch tucks cleanly into a track'); } if (f.wd < 50) { s -= 14; why.push('narrow roll means narrow bays'); } if (f.fray === 'high') s -= 8; }
      if (st.method === 'wrap' && f.fray === 'high') { s -= 6; why.push('frays at cut corners'); }
      const mid = (f.price[0] + f.price[1]) / 2;
      if (f.price[0] > st.budget) return null;
      if (mid <= st.budget) s += 6; else why.push('upper qualities exceed the budget');
      return { f, s, why, res };
    }
    function upd() {
      const t = [];
      if (st.behind === 'diffuser') {
        out.innerHTML = A.statBox('Advice', 'Leave it uncovered', 'a diffuser works by its hard shape', 'warn');
        list.innerHTML = '';
        tips(tip, ['Any cloth across a diffuser adds absorption at high frequencies and hides the wells that do the work. If it must be hidden, use the most open mesh or grille cloth over a black-painted diffuser, and expect a small loss of sparkle.', 'Better: make the diffuser a feature — timber, paint, lighting — and put the fabric on the absorbers.'], 'warn');
        return;
      }
      const ranked = FAB.map(score).filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 5);
      if (!ranked.length) { out.innerHTML = A.statBox('No match', 'Raise the budget', 'or relax one requirement', 'bad'); list.innerHTML = ''; tip.innerHTML = ''; return; }
      const best = ranked[0], mx = Math.max(1, best.s);
      const needLiner = best.f.open > 0.2 || st.shade === 'light';
      const perM2 = ((best.f.price[0] + best.f.price[1]) / 2 / (best.f.wd * 0.0254)) * 1.15 + (needLiner ? 25 : 0);
      out.innerHTML = A.statBox('Best match', best.f.n.split(' (')[0].split(' /')[0], best.f.verdict, best.f.cls)
        + A.statBox('Typical resistance', fmt(best.res, 0) + ' rayls', st.method === 'track' ? 'at installed tension' : 'relaxed')
        + A.statBox('Liner', needLiner ? 'Black non-woven' : 'Optional', needLiner ? 'hides the core and holds dust' : 'still good practice over mineral wool', needLiner ? 'warn' : '')
        + A.statBox('Cloth cost', rupee(perM2) + ' / m²', 'covered area, with 15 % waste')
        + A.statBox('Roll width', best.f.wd + ' in', fmt(best.f.wd * 0.0254, 2) + ' m — sets your bay width');
      list.innerHTML = ranked.map((r, i) => `<div style="border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin:8px 0;background:var(--panel)"><div style="display:flex;gap:8px;align-items:baseline;flex-wrap:wrap"><b style="font-size:1.05em">${i + 1}. ${r.f.n}</b><span class="small muted">${rupee(r.f.price[0])}–${rupee(r.f.price[1])} / m · ${r.f.wd} in wide</span></div><div style="height:8px;border-radius:4px;background:var(--line);margin:6px 0"><div style="height:8px;border-radius:4px;width:${clamp((r.s / mx) * 100, 8, 100)}%;background:var(--${r.f.cls === 'good' ? 'good' : 'warn'})"></div></div><div class="small">${r.why.slice(0, 4).join('; ')}.</div></div>`).join('');
      t.push('Treat the list as a shopping order, not a guarantee: two rolls with the same name can breathe very differently. Carry a lighter-sized sample of a known-good cloth and compare by breath.');
      if (st.room === 'commercial') t.push('For commercial rooms ask the seller, in writing, for the flame test certificate of that exact quality and keep a copy in the project file. Check the required standard with the fire consultant.');
      if (st.behind === 'speaker') t.push('In front of a loudspeaker only the most open cloths qualify. Stretch it on a removable frame so the drivers can be reached, and keep the frame bars away from the tweeter.');
      if (st.climate !== 'dry') t.push('Humid climate: polyester keeps its tension. If you love a cotton or linen look, choose a polyester that imitates it.');
      t.push('Prices are rough guides per running metre — check current local prices and always see the roll in daylight.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     4. Humidity sag
     ====================================================================== */
  V.humiditySag = function (host) {
    const FIB = { poly: ['Polyester weave', 0.04, 0], knit: ['Polyester stretch knit', 0.05, 2.5], cotton: ['Cotton', 0.9, 0], jute: ['Jute / hessian', 1.5, 0], linen: ['Cotton-linen blend', 1.0, 0], wool: ['Wool blend', 1.1, 0.3] };
    const st = A.controls(host, [
      { key: 'fibre', label: 'Fibre', type: 'select', value: 'cotton', options: Object.entries(FIB).map(([k, v]) => [k, v[0]]) },
      { key: 'span', label: 'Unsupported span', type: 'range', min: 0.4, max: 2.4, step: 0.1, value: 1.2, unit: 'm' },
      { key: 'tension', label: 'Tension when installed', type: 'select', value: 'hand', options: [['slack', 'Just pulled flat'], ['hand', 'Firm hand tension'], ['drum', 'Drum-tight (tool or track)']] },
      { key: 'dry', label: 'Humidity with AC running', type: 'range', min: 30, max: 60, step: 1, value: 45, unit: '% RH' },
      { key: 'wet', label: 'Humidity in the monsoon, AC off', type: 'range', min: 50, max: 95, step: 1, value: 85, unit: '% RH' },
      { key: 'when', label: 'Installed when the room was', type: 'select', value: 'dry', options: [['dry', 'Dry (AC on)'], ['wet', 'Humid (AC off)']] },
      { key: 'pre', label: 'Cloth pre-shrunk / acclimatised', type: 'check', value: false },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = { sag: 0, slack: 0, over: 0 };
    A.canvas(host, {
      height: 240, animate: true,
      caption: 'Front view of one bay and, below it, a cut through the cloth. The view breathes between the dry and the humid condition so you can see what the room will do to the finish over a year.',
      draw(ctx, w, h, t) {
        t = tp(t);
        const ph = 0.5 - 0.5 * Math.cos(t * 0.9), wetNow = st.when === 'dry' ? ph : 1 - ph;
        const amt = R.slack > 0 ? (st.when === 'dry' ? ph : 1 - ph) : 0;
        const pw = Math.min(w - 40, 420), x0 = (w - pw) / 2, y0 = 14, phh = 120;
        box(ctx, x0, y0, pw, phh, A.alpha(A.css('accent'), 0.16), A.css('text'), 1.5);
        const rip = clamp(R.sag / 25, 0, 1) * amt;
        ctx.strokeStyle = A.alpha(A.css('text'), 0.25 + 0.5 * rip); ctx.lineWidth = 1.2;
        for (let i = 1; i < 7; i++) { ctx.beginPath(); for (let y = 0; y <= phh; y += 6) { const x = x0 + (pw * i) / 7 + Math.sin(y / 14 + i * 1.7) * 14 * rip * Math.sin((Math.PI * y) / phh); if (y === 0) ctx.moveTo(x, y0 + y); else ctx.lineTo(x, y0 + y); } if (rip > 0.03) ctx.stroke(); }
        A.text(ctx, wetNow > 0.5 ? 'humid — ' + st.wet + ' % RH' : 'dry — ' + st.dry + ' % RH', x0 + pw / 2, y0 + phh / 2 + 4, { size: 12, align: 'center', color: A.css('text'), weight: 700 });
        // section
        const sy = y0 + phh + 44, bow = clamp(R.sag * 1.4, 0, 46) * amt;
        box(ctx, x0 - 6, sy - 10, 6, 34, A.css('muted')); box(ctx, x0 + pw, sy - 10, 6, 34, A.css('muted'));
        seg(ctx, x0, sy + 22, x0 + pw, sy + 22, A.alpha(A.css('muted'), 0.6), 6);
        ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, sy); ctx.quadraticCurveTo(x0 + pw / 2, sy + bow * (R.over > 0 && st.when === 'wet' ? 0 : 1), x0 + pw, sy); ctx.stroke();
        A.text(ctx, 'section: cloth between two fixing edges, core behind', x0 + pw / 2, sy + 48, { size: 11, align: 'center', color: A.css('muted') });
      },
    });
    host.appendChild(tip);
    function upd() {
      const [, growth, give] = FIB[st.fibre];
      const swing = Math.max(0, st.wet - st.dry) / 50;       // 50 % RH swing = full growth figure
      const g = growth * swing * (st.pre ? 0.55 : 1);        // % length change dry → humid
      const pre = { slack: 0.05, hand: 0.25, drum: 0.6 }[st.tension] + give;
      let slack = 0, over = 0;
      if (st.when === 'dry') slack = Math.max(0, g - pre); else over = g; // installed humid: it tightens when dried
      const sag = st.span * 1000 * Math.sqrt((3 * slack / 100) / 8);
      R = { sag, slack, over };
      const risk = sag < 2 ? ['Stays flat', 'good'] : sag < 8 ? ['Soft ripples', 'warn'] : ['Visible sag', 'bad'];
      out.innerHTML = A.statBox('Length change, dry → humid', '+' + fmt(g, 2) + ' %', fmt(g * st.span * 10, 1) + ' mm over this span')
        + A.statBox('Stretch reserve from tensioning', fmt(pre, 2) + ' %', 'what the cloth can give back')
        + A.statBox('Belly, if the slack gathers in one place', fmt(sag, 0) + ' mm', st.when === 'dry' ? 'in the monsoon; in practice it shows as ripples' : 'none — it tightens when the AC runs', risk[1])
        + A.statBox('Finish', st.when === 'wet' && over > 0.5 ? 'Tight, pulling on fixings' : risk[0], '', st.when === 'wet' && over > 0.5 ? 'warn' : risk[1]);
      const t = [];
      if (st.fibre === 'poly' || st.fibre === 'knit') t.push('Polyester takes up almost no moisture, which is why it is the default for stretched walls in humid climates.');
      else t.push('Natural fibres swell and lengthen as they take up moisture. A change of about one percent sounds small, but over a metre it is a centimetre of loose cloth.');
      if (sag >= 2) { t.push('Remedies, in order of effect: switch to polyester; shorten the span with an extra batten or track; tension harder; pre-wash and acclimatise the cloth in the room for 24–48 hours.'); }
      if (st.when === 'wet') t.push(over > 0.5 ? 'Installed humid, this cloth shrinks as the room dries. That keeps it flat, but staples can tear out and light frames can bow — use more fixings and a stiffer frame.' : 'Installing in humid conditions means the cloth only gets tighter afterwards — a useful trick, within reason.');
      else if (sag < 2) t.push('Installed dry and still flat in the monsoon: this combination is safe.');
      if (st.span > 1.5) t.push('Spans over about 1.5 m also pick up air-pressure “breathing” when doors close and bass plays. Add a mid support.');
      tips(tip, t, sag >= 8 ? 'warn' : 'mentor');
    }
    upd();
  };

  /* ======================================================================
     5. Read-through of the core
     ====================================================================== */
  V.readThrough = function (host) {
    const SH = { white: ['White', 245], cream: ['Cream / beige', 215], grey: ['Mid grey', 130], dark: ['Charcoal', 60], black: ['Black', 22] };
    const CORE = { yellow: ['Yellow glass wool', [222, 190, 60]], brown: ['Brown-green mineral wool', [120, 110, 70]], white: ['White polyester wool', [235, 235, 232]], black: ['Black-faced slab', [28, 28, 30]] };
    const st = A.controls(host, [
      { key: 'shade', label: 'Fabric shade', type: 'select', value: 'cream', options: Object.entries(SH).map(([k, v]) => [k, v[0]]) },
      { key: 'open', label: 'Openness of the weave', type: 'range', min: 5, max: 60, step: 1, value: 28, unit: '%' },
      { key: 'core', label: 'Core behind it', type: 'select', value: 'yellow', options: Object.entries(CORE).map(([k, v]) => [k, v[0]]) },
      { key: 'liner', label: 'Liner', type: 'select', value: 'none', options: [['none', 'None'], ['black', 'Black non-woven'], ['white', 'White wadding / non-woven']] },
      { key: 'light', label: 'Lighting', type: 'select', value: 'graze', options: [['flat', 'Soft, from the front'], ['graze', 'Wall-washer grazing down the wall']] },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = { vis: 0, frame: 0, bg: [0, 0, 0] };
    const cv = A.canvas(host, {
      height: 240,
      caption: 'A finished bay as the eye sees it. Left half: what is behind the cloth. Right half: the cloth in place. Timber frame members, joints in the wool and staple lines are what tend to ghost through.',
      draw(ctx, w, h) {
        const pw = Math.min(w - 30, 460), x0 = (w - pw) / 2, y0 = 12, ph = h - 50;
        const cr = st.liner === 'none' ? CORE[st.core][1] : st.liner === 'black' ? [20, 20, 22] : [240, 240, 238];
        const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
        const drawBack = (showFrame) => {
          box(ctx, x0, y0, pw, ph, rgb(cr));
          if (showFrame) { ctx.fillStyle = 'rgba(150,110,70,1)'; ctx.fillRect(x0, y0, pw, 10); ctx.fillRect(x0, y0 + ph - 10, pw, 10); ctx.fillRect(x0, y0, 10, ph); ctx.fillRect(x0 + pw - 10, y0, 10, ph); ctx.fillRect(x0 + pw / 2 - 5, y0, 10, ph); }
          ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 + 10, y0 + ph * 0.55); ctx.lineTo(x0 + pw - 10, y0 + ph * 0.55); ctx.stroke();
        };
        drawBack(true);
        // cloth over the right half
        ctx.save(); ctx.beginPath(); ctx.rect(x0 + pw * 0.42, y0, pw * 0.58, ph); ctx.clip();
        const s = SH[st.shade][1], cloth = [s, s, s * 0.97];
        box(ctx, x0, y0, pw, ph, rgb(cloth));
        ctx.globalAlpha = clamp(R.vis, 0, 0.85); drawBack(true); ctx.globalAlpha = 1;
        if (st.light === 'graze') { const g = ctx.createLinearGradient(0, y0, 0, y0 + ph); g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.2)'); ctx.fillStyle = g; ctx.fillRect(x0, y0, pw, ph); ctx.fillStyle = `rgba(0,0,0,${0.3 * R.frame})`; ctx.fillRect(x0 + pw / 2 + 5, y0, 7, ph); ctx.fillRect(x0, y0 + 10, pw, 5); }
        ctx.restore();
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, pw, ph);
        seg(ctx, x0 + pw * 0.42, y0, x0 + pw * 0.42, y0 + ph, A.css('text'), 1, [4, 3]);
        A.text(ctx, 'behind the cloth', x0 + pw * 0.21, y0 + ph + 18, { size: 11, align: 'center', color: A.css('muted') });
        A.text(ctx, 'finished surface', x0 + pw * 0.71, y0 + ph + 18, { size: 11, align: 'center', color: A.css('muted') });
      },
    });
    host.appendChild(tip);
    function upd() {
      const s = SH[st.shade][1], cr = st.liner === 'none' ? CORE[st.core][1] : st.liner === 'black' ? [20, 20, 22] : [240, 240, 238];
      const lum = (cr[0] * 0.3 + cr[1] * 0.59 + cr[2] * 0.11), sat = (Math.max(...cr) - Math.min(...cr)) / 255;
      const contrast = Math.abs(lum - s) / 255 + sat * 0.8;
      const thin = st.open / 100;
      const vis = clamp(thin * 1.6 * contrast + thin * 0.25 * (s > 150 ? 1 : 0.3), 0, 1);
      const frame = clamp((st.light === 'graze' ? 0.9 : 0.25) * (0.4 + thin) * (st.liner === 'white' ? 0.5 : 1), 0, 1);
      R = { vis, frame };
      const v = vis < 0.12 ? ['Invisible', 'good'] : vis < 0.3 ? ['Faint ghosting', 'warn'] : ['Core shows clearly', 'bad'];
      const fr = frame < 0.35 ? ['Not noticeable', 'good'] : frame < 0.6 ? ['Soft shadow lines', 'warn'] : ['Frame telegraphs', 'bad'];
      out.innerHTML = A.statBox('Core read-through', fmt(vis * 100, 0) + ' %', v[0], v[1]) + A.statBox('Frame and edge shadows', fr[0], st.light === 'graze' ? 'grazing light exaggerates every bump' : 'front light is forgiving', fr[1]) + A.statBox('Liner', st.liner === 'none' ? 'None' : st.liner === 'black' ? 'Black' : 'White', st.liner === 'none' ? 'the core colour is what you see' : 'the liner colour is what you see');
      const t = [];
      if (vis >= 0.12 && st.liner === 'none') t.push('Add a liner. Under dark cloth use black non-woven; under light cloth use white wadding or a white non-woven so the surface reads as one even tone.');
      if (s > 150 && st.liner === 'black') t.push('A black liner under a pale open cloth turns it grey and blotchy. Use a white liner under light fabrics.');
      if (s < 100 && st.liner === 'white') t.push('A white liner under a dark open cloth sparkles through as pale dots. Use black under dark fabrics.');
      if (frame >= 0.35) t.push('To stop frames telegraphing: bring the core flush with the frame face, chamfer or round the frame edge, add 5–10 mm of polyester wadding over everything, and move wall-washers a little further from the wall.');
      if (vis < 0.12 && frame < 0.35) t.push('This combination will read as a calm, even surface — the look of a professionally skinned room.');
      t.push('Dark, slightly textured cloth is the most forgiving finish there is: it hides seams, shadows and dust. Pale smooth cloth is the least forgiving and needs the best workmanship.');
      tips(tip, t, vis >= 0.3 ? 'warn' : 'mentor');
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     6. Wrapping sequence
     ====================================================================== */
  V.wrapSequence = function (host) {
    const STEPS = [
      ['Lay out', 'Clean table. Face cloth face-down, liner on top, panel on top of that, face-down. Line a thread of the weave up with the panel edge and leave the same margin all round.'],
      ['Four centre staples', 'Pull the cloth over the middle of one long side and staple. Go to the opposite side, pull with firm even tension, staple. Then the two short sides. North, south, east, west.'],
      ['Work outwards', 'From each centre staple work towards the corners, a few staples at a time, always swapping to the opposite side. Staples 20–30 mm apart, parallel to the edge.'],
      ['Stop short of the corners', 'Leave about 60 mm unstapled each side of every corner. Turn the panel over and check the weave is straight and there are no diagonal pull lines.'],
      ['Fold the corners', 'Make all four corners the same way, with the fold line running along the top or bottom edge so it is seen least.'],
      ['Trim and finish the back', 'Trim spare cloth 10 mm past the staples. Cover the back with a cheap non-woven sheet so no wool is exposed, and fit the hanging hardware.'],
      ['Inspect', 'Stand the panel up in grazing light. Weave square to the edges, corners identical, no puckers between staples, no shadow of the frame.'],
    ];
    const st = A.controls(host, [
      { key: 'step', label: 'Step', type: 'range', min: 1, max: STEPS.length, step: 1, value: 1, fmt: (v) => v + ' of ' + STEPS.length + ' — ' + STEPS[v - 1][0] },
      { key: 'corner', label: 'Corner method', type: 'select', value: 'hospital', options: [['hospital', 'Folded “hospital” corner'], ['cut', 'Cut-and-tuck corner']] },
    ], () => upd());
    const row = el('div', { class: 'row', style: { gap: '8px', flexWrap: 'wrap', margin: '6px 0' } });
    const bPrev = el('button', { html: '← Back' }), bNext = el('button', { class: 'primary', html: 'Next step →' }), bPlay = el('button', { html: A.icon('play') + ' Play all' });
    row.append(bPrev, bNext, bPlay); host.appendChild(row);
    const out = stats(host), tip = el('div');
    let t0 = 0, now = 0, playing = false, playT = 0;
    bPrev.onclick = () => { playing = false; st.set('step', Math.max(1, st.step - 1)); };
    bNext.onclick = () => { playing = false; st.set('step', Math.min(STEPS.length, st.step + 1)); };
    bPlay.onclick = () => { playing = true; playT = now; st.set('step', 1); };
    A.onLeave(() => { playing = false; });
    A.canvas(host, {
      height: 300, animate: true,
      caption: 'The back of a panel during wrapping. Numbers show the order of the first staples; the small inset shows the corner being closed. Opposite sides are always worked as a pair so the tension stays balanced.',
      draw(ctx, w, h, t) {
        now = t = tp(t);
        if (playing && t - playT > 3.2) { playT = t; if (st.step < STEPS.length) st.set('step', st.step + 1); else playing = false; }
        const u = clamp((t - t0) / 1.6, 0, 1), s = st.step;
        const pw = Math.min(w * 0.56, 330), ph = Math.min(h - 70, pw * 0.62), cx = Math.min(w * 0.4, pw / 2 + 50), cy = h / 2 - 6, x0 = cx - pw / 2, y0 = cy - ph / 2, m = 30;
        const text = A.css('text'), muted = A.css('muted'), acc = A.css('accent');
        // cloth
        const flap = s === 1 ? 1 : s >= 6 ? 0.25 : 1;
        box(ctx, x0 - m * flap, y0 - m * flap, pw + 2 * m * flap, ph + 2 * m * flap, A.alpha(acc, 0.18), A.alpha(acc, 0.7));
        // weave lines on the cloth
        ctx.strokeStyle = A.alpha(acc, 0.25); ctx.lineWidth = 1; for (let x = x0 - m * flap + 8; x < x0 + pw + m * flap; x += 12) { ctx.beginPath(); ctx.moveTo(x, y0 - m * flap); ctx.lineTo(x, y0 + ph + m * flap); ctx.stroke(); }
        // panel back
        box(ctx, x0, y0, pw, ph, A.css('panel2'), text, 1.5);
        box(ctx, x0 + 12, y0 + 12, pw - 24, ph - 24, A.alpha(muted, 0.12), A.alpha(muted, 0.5));
        A.text(ctx, s >= 6 ? 'back cover sheet' : 'back of panel (frame + core)', cx, cy + 4, { size: 11, align: 'center', color: muted });
        // folded-over margins once stapling starts
        const fold = (side, a0, a1) => { ctx.fillStyle = A.alpha(acc, 0.45); if (side === 'N') ctx.fillRect(x0 + pw * a0, y0, pw * (a1 - a0), 12); if (side === 'S') ctx.fillRect(x0 + pw * a0, y0 + ph - 12, pw * (a1 - a0), 12); if (side === 'W') ctx.fillRect(x0, y0 + ph * a0, 12, ph * (a1 - a0)); if (side === 'E') ctx.fillRect(x0 + pw - 12, y0 + ph * a0, 12, ph * (a1 - a0)); };
        const staple = (x, y, vert, n) => { seg(ctx, x - (vert ? 0 : 5), y - (vert ? 5 : 0), x + (vert ? 0 : 5), y + (vert ? 5 : 0), text, 2.5); if (n) A.text(ctx, String(n), x + (vert ? (x < cx ? 12 : -12) : 0), y + (vert ? 4 : (y < cy ? 18 : -10)), { size: 11, align: 'center', weight: 700, color: A.css('bad') }); };
        const reach = s === 2 ? 0.06 : s === 3 ? 0.06 + u * 0.3 : s >= 4 ? 0.38 : 0;
        if (s >= 2) {
          const k = s === 2 ? Math.floor(u * 4.99) : 4;
          const order = [['N', cx, y0 + 6, false], ['S', cx, y0 + ph - 6, false], ['E', x0 + pw - 6, cy, true], ['W', x0 + 6, cy, true]];
          order.forEach(([side, x, y, v], i) => {
            if (i >= k && s === 2) return;
            fold(side, 0.5 - reach - 0.02, 0.5 + reach + 0.02);
            staple(x, y, v, i + 1);
            if (s >= 3) { const len = v ? ph : pw, nSt = Math.floor((reach * len) / 22); for (let j = 1; j <= nSt; j++) { const o = j * 22; if (v) { staple(x, y - o, v); staple(x, y + o, v); } else { staple(x - o, y, v); staple(x + o, y, v); } } }
          });
          if (s === 2 && k < 4) { const [, x, y] = order[k]; dot(ctx, x, y, 7 + 3 * Math.sin(t * 8), A.alpha(A.css('bad'), 0.4)); }
        }
        if (s >= 5) { const c = s === 5 ? u : 1; [[x0, y0], [x0 + pw, y0], [x0, y0 + ph], [x0 + pw, y0 + ph]].forEach(([x, y]) => { ctx.fillStyle = A.alpha(acc, 0.45 * c); ctx.fillRect(x - (x > cx ? 46 : 0), y - (y > cy ? 12 : 0), 46, 12); ctx.fillRect(x - (x > cx ? 12 : 0), y - (y > cy ? 34 : 0), 12, 34); }); }
        // tension arrows
        if (s === 2 || s === 3) { const a = 8 + 4 * Math.sin(t * 5); [[cx, y0 - 14, 0, -1], [cx, y0 + ph + 14, 0, 1], [x0 - 14, cy, -1, 0], [x0 + pw + 14, cy, 1, 0]].forEach(([x, y, dx, dy]) => { seg(ctx, x, y, x + dx * a, y + dy * a, A.css('good'), 2.5); dot(ctx, x + dx * a, y + dy * a, 3, A.css('good')); }); }
        // corner inset
        const ix = Math.max(cx + pw / 2 + m + 14, w - 150), iw = w - ix - 8;
        if (iw > 90) {
          const iy = 14, ih = Math.min(150, h - 60);
          box(ctx, ix, iy, iw, ih, A.css('panel'), A.css('line'));
          A.text(ctx, st.corner === 'hospital' ? 'corner: fold' : 'corner: cut & tuck', ix + iw / 2, iy + ih + 16, { size: 11, align: 'center', color: muted });
          const c = s < 5 ? 0 : s === 5 ? u : 1, px = ix + 18, py = iy + 18, L = Math.min(iw, ih) - 36;
          // panel corner (top-left of back), cloth flaps
          box(ctx, px + 22, py + 22, L - 22, L - 22, A.css('panel2'), text, 1.2);
          ctx.fillStyle = A.alpha(acc, 0.4);
          ctx.fillRect(px + 22 + 20 * (1 - c) + 0, py + 22, L - 22, 12);           // top flap folded over
          if (st.corner === 'hospital') {
            ctx.beginPath(); ctx.moveTo(px + 22, py + 22); ctx.lineTo(px + 22 + 12, py + 22 + 12 * c); ctx.lineTo(px + 22 + 12, py + L); ctx.lineTo(px + 22, py + L); ctx.closePath(); ctx.fill();
            if (c > 0.3) seg(ctx, px + 22, py + 22, px + 22 + 12, py + 22 + 12, text, 1.5);
          } else {
            ctx.fillRect(px + 22, py + 22 + 12, 12, L - 34);
            if (c > 0.3) { seg(ctx, px + 22, py + 22, px + 22 + 12, py + 22 + 12, A.css('bad'), 1.5, [3, 2]); }
            if (c < 1) { ctx.fillStyle = A.alpha(A.css('bad'), 0.35 * (1 - c)); ctx.fillRect(px + 4, py + 4, 18, 18); }
          }
          if (c > 0.6) { seg(ctx, px + 40, py + 28, px + 50, py + 28, text, 2.5); seg(ctx, px + 28, py + 44, px + 28, py + 54, text, 2.5); }
        }
      },
    });
    host.appendChild(tip);
    function upd() {
      t0 = now;
      const s = st.step, [name, body] = STEPS[s - 1];
      out.innerHTML = A.statBox('Step ' + s + ' of ' + STEPS.length, name, '') + A.statBox('Staples', s < 2 ? 'none yet' : s === 2 ? '4' : 'every 20–30 mm', '8–10 mm leg into timber') + A.statBox('Corner', st.corner === 'hospital' ? 'Folded' : 'Cut and tucked', st.corner === 'hospital' ? 'no cutting; slight bulk' : 'flattest; needs a sharp blade');
      const t = [body];
      if (s === 5) t.push(st.corner === 'hospital' ? 'Hospital corner: pull the corner tip straight over the corner and staple it. Fold the two “ears” in so the fold lies exactly on the panel edge, like a bed sheet, and staple each side. Best for thick cloth and for cloth that frays.' : 'Cut-and-tuck: staple one side right up to the corner. Cut away the square of spare cloth, leaving a 15 mm tab. Fold the tab under, bring the second side over so its folded edge sits on the corner line, and staple. Flattest result with thin, stable cloth.');
      if (s === 2) t.push('Tension by hand only, as if smoothing a bed sheet. If you can see the weave bending towards a staple, it is too tight there.');
      if (s === 3) t.push('Never run down one whole side first: the cloth creeps and you end up with diagonal drag lines that no amount of pulling removes.');
      tips(tip, t);
    }
    upd();
  };

  /* ======================================================================
     7. Track wall builder
     ====================================================================== */
  V.trackWallBuilder = function (host) {
    const st = A.controls(host, [
      { key: 'ww', label: 'Wall width', type: 'range', min: 2, max: 8, step: 0.1, value: 4.6, unit: 'm' },
      { key: 'hh', label: 'Wall height', type: 'range', min: 2.2, max: 3.6, step: 0.05, value: 2.7, unit: 'm' },
      { key: 'fw', label: 'Fabric roll width', type: 'select', value: 54, numeric: true, options: [[44, '44 in (1.12 m)'], [54, '54 in (1.37 m)'], [58, '58 in (1.47 m)'], [60, '60 in (1.52 m)']] },
      { key: 'layout', label: 'Bay layout', type: 'select', value: 'equal', options: [['equal', 'Equal bays (calmest)'], ['full', 'Full-width bays + one narrow']] },
      { key: 'door', label: 'Door in this wall', type: 'select', value: 'none', options: [['none', 'No door'], ['left', 'Near the left end'], ['centre', 'In the centre'], ['right', 'Near the right end']] },
      { key: 'win', label: 'Window', type: 'check', value: false },
      { key: 'sock', label: 'Sockets and switch plates', type: 'range', min: 0, max: 6, step: 1, value: 2 },
      { key: 'skirt', label: 'Protective skirting band', type: 'check', value: true },
      { key: 'access', label: 'Removable access bays', type: 'range', min: 0, max: 3, step: 1, value: 1 },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 250,
      caption: 'Elevation of the wall with the track lines drawn in. Every vertical line is a joint where two widths of cloth are tucked into the same track; set them out evenly and they read as deliberate panelling.',
      draw(ctx, w, h) {
        if (!R) return;
        const sc = Math.min((w - 40) / st.ww, (h - 46) / st.hh), x0 = (w - st.ww * sc) / 2, y0 = 12, W = st.ww * sc, H = st.hh * sc;
        const text = A.css('text'), acc = A.css('accent');
        box(ctx, x0, y0, W, H, A.alpha(acc, 0.14), text, 2);
        if (st.skirt) box(ctx, x0, y0 + H - 0.3 * sc, W, 0.3 * sc, A.alpha(text, 0.3));
        R.bays.forEach((b, i) => { const x = x0 + b.x * sc; if (b.access) { ctx.fillStyle = A.alpha(A.css('good'), 0.18); ctx.fillRect(x, y0, b.w * sc, H - (st.skirt ? 0.3 * sc : 0)); A.text(ctx, 'access', x + (b.w * sc) / 2, y0 + 16, { size: 10, align: 'center', color: A.css('good') }); } if (i) seg(ctx, x, y0, x, y0 + H, b.bad ? A.css('bad') : text, 1.5); A.text(ctx, fmt(b.w, 2), x + (b.w * sc) / 2, y0 + H + 14, { size: 10, align: 'center', color: b.bad ? A.css('bad') : A.css('muted') }); });
        R.open.forEach((o) => { box(ctx, x0 + o.x * sc, y0 + H - (o.y + o.h) * sc, o.w * sc, o.h * sc, A.css('panel'), text, 2); A.text(ctx, o.n, x0 + (o.x + o.w / 2) * sc, y0 + H - (o.y + o.h / 2) * sc + 4, { size: 10, align: 'center', color: A.css('muted') }); });
        R.socks.forEach((sx) => box(ctx, x0 + sx * sc - 5, y0 + H - 0.45 * sc - 4, 10, 8, A.css('panel'), text, 1.2));
        A.text(ctx, 'bay widths in metres', x0 + W / 2, y0 + H + 30, { size: 10, align: 'center', color: A.css('muted') });
      },
    });
    A.canvas(host, {
      height: 190, animate: true,
      caption: 'Cut through one joint, seen from above: batten on the wall, track with its two gripping jaws, wool infill flush with the track face, and the tucking tool pushing the edge of the cloth into the jaw. The spare cloth disappears into the track.',
      draw(ctx, w, h, t) {
        t = tp(t);
        const cx = w / 2, by = 30, text = A.css('text'), muted = A.css('muted'), acc = A.css('accent');
        box(ctx, 10, by - 18, w - 20, 16, A.alpha(muted, 0.35)); A.text(ctx, 'wall', 16, by - 6, { size: 10, color: text });
        box(ctx, cx - 26, by, 52, 62, 'rgba(160,120,80,.75)', text); A.text(ctx, 'batten', cx, by + 34, { size: 10, align: 'center', color: '#fff' });
        // wool
        ctx.fillStyle = A.alpha(A.css('warn'), 0.25); ctx.fillRect(18, by, cx - 26 - 18, 78); ctx.fillRect(cx + 26, by, w - 18 - (cx + 26), 78);
        A.text(ctx, 'wool infill', 28, by + 44, { size: 10, color: muted });
        // track
        const ty = by + 62; box(ctx, cx - 26, ty, 52, 16, A.css('panel2'), text, 1.5);
        seg(ctx, cx - 3, ty, cx - 3, ty + 16, text, 1.5); seg(ctx, cx + 3, ty, cx + 3, ty + 16, text, 1.5);
        A.text(ctx, 'track', cx + 34, ty + 34, { size: 10, color: muted });
        // cloth each side, tucked progressively
        const u = (t % 4) / 4, tuckL = clamp(u * 2.4, 0, 1), tuckR = clamp(u * 2.4 - 1.2, 0, 1), fy = ty + 17;
        ctx.strokeStyle = acc; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(18, fy); ctx.lineTo(cx - 5, fy); ctx.lineTo(cx - 5 + 2 * tuckL, fy - 12 * tuckL); if (tuckL < 1) ctx.lineTo(cx + 14 * (1 - tuckL), fy + 10 * (1 - tuckL)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - 18, fy); ctx.lineTo(cx + 5, fy); ctx.lineTo(cx + 5 - 2 * tuckR, fy - 12 * tuckR); if (tuckR < 1) ctx.lineTo(cx - 14 * (1 - tuckR), fy + 16 * (1 - tuckR)); ctx.stroke();
        // tool
        const side = tuckL < 1 ? -1 : 1, prog = tuckL < 1 ? tuckL : tuckR, tx = cx + side * 5, tyy = fy + 46 - 34 * Math.abs(Math.sin(prog * Math.PI * 3));
        if (u < 0.95) { ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.moveTo(tx, tyy); ctx.lineTo(tx - 4, tyy + 22); ctx.lineTo(tx + 4, tyy + 22); ctx.closePath(); ctx.fill(); box(ctx, tx - 6, tyy + 22, 12, 22, A.css('c3')); }
        A.text(ctx, 'room side', w - 20, h - 8, { size: 10, align: 'right', color: muted });
      },
    });
    host.appendChild(tip);
    function upd() {
      const fwm = st.fw * 0.0254, maxBay = fwm - 0.10; // 50 mm tuck each side
      const open = [];
      if (st.door !== 'none') { const dx = st.door === 'left' ? 0.4 : st.door === 'right' ? st.ww - 1.4 : st.ww / 2 - 0.5; open.push({ x: dx, y: 0, w: 1.0, h: 2.1, n: 'door' }); }
      if (st.win) { const wx = st.door === 'centre' ? Math.min(st.ww - 1.7, st.ww * 0.7) : st.door === 'left' ? st.ww - 1.9 : st.door === 'right' ? 0.5 : st.ww / 2 - 0.7; open.push({ x: clamp(wx, 0.2, st.ww - 1.6), y: 1.0, w: 1.4, h: 1.0, n: 'window' }); }
      let widths = [];
      if (st.layout === 'equal') { const n = Math.ceil(st.ww / maxBay); widths = Array(n).fill(st.ww / n); }
      else { let rem = st.ww; while (rem > maxBay + 1e-6) { widths.push(maxBay); rem -= maxBay; } widths.push(rem); }
      let x = 0; const bays = widths.map((wd, i) => { const b = { x, w: wd, bad: wd > maxBay + 1e-6, access: false }; x += wd; return b; });
      // access bays: pick bays not crossed by openings, from the middle out
      const clear = bays.filter((b) => !open.some((o) => o.x < b.x + b.w && o.x + o.w > b.x)).sort((a, b) => Math.abs(a.x + a.w / 2 - st.ww / 2) - Math.abs(b.x + b.w / 2 - st.ww / 2));
      clear.slice(0, st.access).forEach((b) => (b.access = true));
      const socks = Array.from({ length: st.sock }, (_, i) => ((i + 0.5) / st.sock) * st.ww).map((sx) => { const o = open.find((q) => q.y === 0 && sx > q.x - 0.15 && sx < q.x + q.w + 0.15); return o ? clamp(o.x + o.w + 0.3, 0.2, st.ww - 0.2) : sx; });
      const top = st.skirt ? st.hh - 0.3 : st.hh;
      const openPerim = open.reduce((s, o) => s + (o.y === 0 ? 2 * o.h + o.w : 2 * (o.h + o.w)), 0);
      const track = 2 * st.ww + 2 * top + (bays.length - 1) * top * 2 + openPerim + st.sock * 0.4 + bays.filter((b) => b.access).length * 2 * (top + 1);
      const batt = track / 2 * 1.0 + Math.ceil(top / 0.6) * st.ww * 0.5;
      const openArea = open.reduce((s, o) => s + o.w * o.h, 0), area = st.ww * top - openArea;
      const cloth = bays.length * (top + 0.15);
      const narrow = Math.min(...widths), sliver = narrow < 0.45;
      const jointHits = bays.slice(1).filter((b) => open.some((o) => Math.abs(b.x - o.x) < 0.12 && Math.abs(b.x - o.x) > 0.001 || Math.abs(b.x - (o.x + o.w)) < 0.12 && Math.abs(b.x - (o.x + o.w)) > 0.001)).length;
      R = { bays, open, socks };
      out.innerHTML = A.statBox('Bays', String(bays.length), 'widest ' + fmt(Math.max(...widths), 2) + ' m; cloth allows ' + fmt(maxBay, 2) + ' m', bays.some((b) => b.bad) ? 'bad' : 'good')
        + A.statBox('Track', fmt(track, 0) + ' m', 'perimeter, both sides of each joint, round openings')
        + A.statBox('Battens', fmt(batt, 0) + ' m', 'behind every track + noggings')
        + A.statBox('Wool infill', fmt(area, 1) + ' m²', 'flush with the track face')
        + A.statBox('Cloth', fmt(cloth, 1) + ' m', bays.length + ' drops of ' + fmt(top + 0.15, 2) + ' m, one per bay')
        + A.statBox('Access bays', String(bays.filter((b) => b.access).length), 'on removable frames');
      const t = [];
      t.push('The roll width decides the rhythm: a ' + st.fw + '-inch cloth gives bays of at most about ' + fmt(maxBay, 2) + ' m once 50 mm is allowed for tucking each side. This is why professionally skinned rooms show joints every 1.2–1.4 m.');
      if (sliver) t.push('The last bay is only ' + fmt(narrow, 2) + ' m wide — a sliver looks like a mistake. Switch to equal bays, or centre the layout so two equal narrow bays sit at the ends.');
      if (jointHits) t.push('A joint lands within a hand’s width of a door or window edge. Nudge the layout so joints either line up exactly with the opening or stay at least 150 mm clear.');
      if (st.sock) t.push('Fix each socket box to its own batten or back-box extension so the plate sits flush with the finished cloth. Cut a small X in the cloth, tuck the flaps into a mini track or behind a trim ring, never leave raw cut edges.');
      if (!st.skirt) t.push('Without a skirting band the cloth runs to the floor, where vacuum cleaners, feet and chair wheels will mark it within months.');
      if (st.access && bays.filter((b) => b.access).length < st.access) t.push('Not every access bay asked for could be placed: bays crossed by the door or window cannot lift off. Move the opening or put access on another wall.');
      if (!st.access) t.push('No access bays: every cable or wool repair will mean pulling the cloth out of the track. Make at least one bay a lift-off frame where tie-lines and junction boxes live.');
      tips(tip, t, sliver || jointHits ? 'warn' : 'mentor');
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     8. Fabric estimator with cutting diagram
     ====================================================================== */
  V.fabricEstimator = function (host) {
    const st = A.controls(host, [
      { type: 'heading', label: 'Panel type A' },
      { key: 'na', label: 'How many', type: 'range', min: 0, max: 30, step: 1, value: 8 },
      { key: 'wa', label: 'Width', type: 'range', min: 0.3, max: 1.4, step: 0.05, value: 0.6, unit: 'm' },
      { key: 'ha', label: 'Height', type: 'range', min: 0.3, max: 3, step: 0.05, value: 1.2, unit: 'm' },
      { type: 'heading', label: 'Panel type B' },
      { key: 'nb', label: 'How many', type: 'range', min: 0, max: 30, step: 1, value: 4 },
      { key: 'wb', label: 'Width', type: 'range', min: 0.3, max: 1.4, step: 0.05, value: 1.0, unit: 'm' },
      { key: 'hb', label: 'Height', type: 'range', min: 0.3, max: 3, step: 0.05, value: 1.0, unit: 'm' },
      { type: 'heading', label: 'Cloth and allowances' },
      { key: 'thick', label: 'Panel thickness', type: 'range', min: 25, max: 150, step: 5, value: 50, unit: 'mm' },
      { key: 'fw', label: 'Fabric roll width', type: 'select', value: 54, numeric: true, options: [[44, '44 in (1.12 m)'], [54, '54 in (1.37 m)'], [58, '58 in (1.47 m)'], [60, '60 in (1.52 m)']] },
      { key: 'dir', label: 'Cloth has a direction or nap', type: 'check', value: true },
      { key: 'rep', label: 'Pattern repeat', type: 'range', min: 0, max: 60, step: 5, value: 0, unit: 'cm' },
      { key: 'waste', label: 'Extra for mistakes and spares', type: 'range', min: 5, max: 25, step: 1, value: 12, unit: '%' },
      { key: 'price', label: 'Cloth price', type: 'range', min: 60, max: 900, step: 10, value: 300, fmt: (v) => rupee(v) + ' / m' },
      { key: 'liner', label: 'Add a liner under the cloth', type: 'check', value: true },
    ], () => upd());
    const out = stats(host), tip = el('div');
    let R = null;
    const cv = A.canvas(host, {
      height: 230,
      caption: 'Cutting plan along the roll (roll length runs left to right, roll width top to bottom). Each rectangle is one cut piece including its wrap-round allowance; the hatched area is off-cut. Rearranging cuts on paper first is the cheapest saving on the job.',
      draw(ctx, w, h) {
        if (!R || !R.len) { A.text(ctx, 'Add some panels to see the cutting plan', w / 2, h / 2, { align: 'center', color: A.css('muted') }); return; }
        const sc = Math.min((w - 30) / R.len, (h - 50) / R.fwm), x0 = 15, y0 = 14, W = R.len * sc, H = R.fwm * sc;
        box(ctx, x0, y0, W, H, A.alpha(A.css('muted'), 0.12));
        ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, W, H); ctx.clip(); ctx.strokeStyle = A.alpha(A.css('muted'), 0.35); ctx.lineWidth = 1; for (let i = -H; i < W; i += 9) { ctx.beginPath(); ctx.moveTo(x0 + i, y0 + H); ctx.lineTo(x0 + i + H, y0); ctx.stroke(); } ctx.restore();
        R.cuts.forEach((c) => { box(ctx, x0 + c.x * sc, y0 + c.y * sc, c.l * sc, c.a * sc, c.t === 'A' ? A.css('accent') : A.css('c3'), A.css('bg'), 1.5); if (c.l * sc > 16 && c.a * sc > 12) A.text(ctx, c.t, x0 + (c.x + c.l / 2) * sc, y0 + (c.y + c.a / 2) * sc + 4, { size: 10, align: 'center', color: '#fff', weight: 700 }); });
        ctx.strokeStyle = A.css('text'); ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, W, H);
        A.text(ctx, fmt(R.len, 1) + ' m of roll', x0 + W / 2, y0 + H + 16, { size: 11, align: 'center', color: A.css('muted') });
        A.text(ctx, 'selvedge', x0 + 2, y0 + H + 16, { size: 10, color: A.css('muted') });
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'panel type A'], [A.css('c3'), 'panel type B'], [A.css('muted'), 'off-cut']]));
    host.appendChild(tip);
    function upd() {
      const fwm = st.fw * 0.0254 - 0.03, al = 2 * (st.thick / 1000 + 0.05); // wrap round the edge + 50 mm onto the back
      const pieces = [];
      for (let i = 0; i < st.na; i++) pieces.push({ t: 'A', w: st.wa + al, h: st.ha + al });
      for (let i = 0; i < st.nb; i++) pieces.push({ t: 'B', w: st.wb + al, h: st.hb + al });
      const rep = st.rep / 100, up = (v) => (rep > 0 ? Math.ceil(v / rep - 1e-9) * rep : v);
      // shelf packing: l = along the roll, a = across the roll
      const orient = (p) => { const o1 = { l: up(p.h), a: p.w, t: p.t }, o2 = { l: up(p.w), a: p.h, t: p.t }; if (st.dir || rep > 0) return o1.a <= fwm ? o1 : null; const ok = [o1, o2].filter((o) => o.a <= fwm); if (!ok.length) return null; return ok.sort((a, b) => a.l - b.l)[0]; };
      const cuts = []; let tooWide = 0;
      const items = pieces.map(orient).filter((o) => { if (!o) tooWide++; return !!o; }).sort((a, b) => b.l - a.l || b.a - a.a);
      const shelves = [];
      items.forEach((o) => { let s = shelves.find((q) => q.used + o.a <= fwm + 1e-9 && o.l <= q.l + 1e-9); if (!s) { s = { x: shelves.reduce((a, q) => a + q.l, 0), l: o.l, used: 0 }; shelves.push(s); } cuts.push({ x: s.x, y: s.used, l: o.l, a: o.a, t: o.t }); s.used += o.a; });
      const len = shelves.reduce((a, q) => a + q.l, 0);
      const buy = Math.ceil(len * (1 + st.waste / 100) * 2) / 2;
      const area = st.na * st.wa * st.ha + st.nb * st.wb * st.hb;
      const used = cuts.reduce((s, c) => s + c.l * c.a, 0), eff = len ? used / (len * fwm) : 0;
      const perim = st.na * 2 * (st.wa + st.ha) + st.nb * 2 * (st.wb + st.hb);
      const staples = Math.ceil(perim / 0.025 / 100) * 100;
      const linerM = st.liner ? Math.ceil(len * 1.05) : 0;
      const cost = buy * st.price + linerM * 30 + (staples / 1000) * 120;
      R = { cuts, len, fwm: fwm + 0.03 };
      out.innerHTML = A.statBox('Cloth to buy', fmt(buy, 1) + ' m', fmt(len, 1) + ' m net + ' + st.waste + ' %')
        + A.statBox('Face area covered', fmt(area, 1) + ' m²', fmt(area ? buy / area : 0, 2) + ' m of roll per m²')
        + A.statBox('Use of the roll', fmt(eff * 100, 0) + ' %', eff > 0.75 ? 'efficient' : 'a lot of off-cut', eff > 0.75 ? 'good' : eff > 0.55 ? 'warn' : 'bad')
        + A.statBox('Liner', st.liner ? linerM + ' m' : 'none', st.liner ? 'black or white non-woven' : '')
        + A.statBox('Staples', staples.toLocaleString('en-IN'), 'one every 25 mm of edge')
        + A.statBox('Materials total', rupee(cost), 'cloth + liner + staples; check local prices', tooWide ? 'bad' : '');
      const t = [];
      if (tooWide) t.push(tooWide + ' panel(s) are wider than the roll once the wrap-round is added. Narrow the panel, buy a wider cloth, or turn the cloth through 90° (only possible with a plain cloth that has no direction).');
      t.push('Each cut piece is the face size plus the panel thickness plus 50 mm, on every side — here ' + fmt(al * 500, 0) + ' mm per edge.');
      if (st.dir) t.push('With a directional weave or nap every piece must run the same way up the roll, or neighbouring panels will look like two different colours under the lights.');
      else if (eff < 0.75) t.push('With a plain cloth, pieces may be turned to nest better — the plan already does that where it helps.');
      if (st.rep) t.push('A pattern repeat rounds every cut up to a whole number of repeats so the pattern starts at the same point on each panel. Plain or small-texture cloth avoids this cost completely.');
      t.push('Buy everything from one roll or one dye lot in a single purchase, as a continuous length. The next roll of the “same” colour rarely matches.');
      tips(tip, t, tooWide ? 'warn' : 'mentor');
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     9. Edge details
     ====================================================================== */
  V.edgeDetail = function (host) {
    const D = {
      square: ['Square wrapped edge', 'Easy', 'Staple gun, scissors', 'Framed panels with gaps between them; the standard hung panel.', 'A timber frame gives a crisp, hard arris that the cloth turns round. Soft slab edges without a frame round off and dent — harden them or frame them.'],
      bevel: ['Bevelled edge', 'Medium', 'Plane or router for the frame, staple gun', 'Butted panels where a V-joint is wanted; softens thick panels.', 'A 45° chamfer on the frame makes neighbouring panels meet in a neat V and hides small differences in level.'],
      radius: ['Radiused edge', 'Medium', 'Round-over cutter, wadding, staple gun', 'Thick panels, clouds, anything seen from the side.', 'A rounded frame edge plus a thin layer of wadding gives the soft, upholstered look and is kind to grazing light.'],
      shadow: ['Shadow gap between panels', 'Medium', 'Spacers, laser line, split battens', 'Feature walls of separate panels; hides wavy walls.', 'A consistent dark gap of 6–12 mm, with the wall behind painted black, reads as a designed line. Use the same spacer block for every joint.'],
      bead: ['Staple and cover with a timber bead', 'Easy', 'Staple gun, panel pins or screws, mitre saw', 'Site-stretched walls without proprietary track; easy for any carpenter.', 'Cloth is stapled to the batten face and the staple line is hidden under a slim timber or metal strip. Honest, repairable and good looking if the strips are straight.'],
      kerf: ['Kerf and spline', 'Medium', 'Router or table saw for the groove, spline cord, spline roller', 'Home-made track: stretched bays with a hairline joint.', 'A groove 4–5 mm wide in the batten takes the cloth, locked by a rubber spline cord pushed in with a roller — exactly how insect-mesh frames are made. Releasable and re-tensionable.'],
      backtack: ['Back-tack strip (blind edge)', 'Skilled', 'Staple gun, card or plastic tack strip, steady hands', 'Top edges and visible straight starts where no trim is wanted.', 'The cloth is stapled face-down through a stiff strip, then folded back over it. The strip gives a ruler-straight edge with no visible fixing — the upholsterer’s classic trick.'],
    };
    const st = A.controls(host, [{ key: 'kind', label: 'Edge detail', type: 'select', value: 'kerf', options: Object.entries(D).map(([k, v]) => [k, v[0]]) }], () => upd());
    const out = stats(host), tip = el('div');
    let t0 = 0, now = 0;
    A.canvas(host, {
      height: 250, animate: true,
      caption: 'Cut through the edge, seen from above, with the room towards the bottom of the picture. The thick line is the face cloth being fitted; watch where the fixing ends up and what the eye can see from the room.',
      draw(ctx, w, h, t) {
        now = t = tp(t);
        const u = clamp(((t - t0) % 5) / 3, 0, 1), k = st.kind, text = A.css('text'), muted = A.css('muted'), acc = A.css('accent'), wood = 'rgba(160,120,80,.8)', wool = A.alpha(A.css('warn'), 0.25);
        const cx = w / 2, wy = 26;
        box(ctx, 10, wy - 16, w - 20, 16, A.alpha(muted, 0.35)); A.text(ctx, 'wall', 16, wy - 4, { size: 10, color: text });
        A.text(ctx, 'room side', w - 16, h - 8, { size: 10, align: 'right', color: muted });
        const fab = (pts, p = 1) => { // draw polyline partially
          let tot = 0; const segs = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); tot += d; }
          let rem = tot * p; ctx.strokeStyle = acc; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < pts.length && rem > 0; i++) { const d = segs[i - 1], f = Math.min(1, rem / d); ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f); rem -= d; }
          ctx.stroke();
        };
        const stp = (x, y, vert) => seg(ctx, x - (vert ? 0 : 6), y - (vert ? 6 : 0), x + (vert ? 0 : 6), y + (vert ? 6 : 0), A.css('bad'), 3);
        const T = 120, F = 28; // panel depth and frame width, px
        if (k === 'square' || k === 'bevel' || k === 'radius') {
          const px = cx - 130, pw = 280, py = wy + 22;
          box(ctx, px + F, py, pw - F, T, wool);
          // frame edge shape
          ctx.fillStyle = wood; ctx.strokeStyle = text; ctx.lineWidth = 1.2; ctx.beginPath();
          if (k === 'square') { ctx.rect(px, py, F, T); }
          else if (k === 'bevel') { ctx.moveTo(px, py); ctx.lineTo(px + F, py); ctx.lineTo(px + F, py + T); ctx.lineTo(px + 18, py + T); ctx.lineTo(px, py + T - 18); ctx.closePath(); }
          else { ctx.moveTo(px, py); ctx.lineTo(px + F, py); ctx.lineTo(px + F, py + T); ctx.lineTo(px + 22, py + T); ctx.quadraticCurveTo(px, py + T, px, py + T - 22); ctx.closePath(); }
          ctx.fill(); ctx.stroke();
          const pts = k === 'square' ? [[px + pw, py + T + 2], [px - 2, py + T + 2], [px - 2, py - 2], [px + 36, py - 2]] : k === 'bevel' ? [[px + pw, py + T + 2], [px + 17, py + T + 2], [px - 2, py + T - 17], [px - 2, py - 2], [px + 36, py - 2]] : [[px + pw, py + T + 3], [px + 22, py + T + 3], [px + 9, py + T - 1], [px + 1, py + T - 9], [px - 2, py + T - 22], [px - 2, py - 2], [px + 36, py - 2]];
          fab(pts, u); if (u > 0.95) stp(px + 20, py - 2, false);
          A.text(ctx, 'frame', px + F / 2, py + T + 20, { size: 10, align: 'center', color: muted }); A.text(ctx, 'core', px + pw / 2, py + T / 2, { size: 11, align: 'center', color: muted });
          A.text(ctx, 'staples on the back', px + 44, py - 6, { size: 10, color: A.css('bad') }); A.text(ctx, 'visible face', px + pw / 2, py + T + 20, { size: 10, align: 'center', color: acc });
          // neighbour hint
          if (k === 'bevel') { ctx.save(); ctx.translate(2 * px - 6, 0); ctx.scale(-1, 1); box(ctx, px + F, py, 50, T, wool); ctx.fillStyle = wood; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + F, py); ctx.lineTo(px + F, py + T); ctx.lineTo(px + 18, py + T); ctx.lineTo(px, py + T - 18); ctx.closePath(); ctx.fill(); ctx.restore(); A.text(ctx, 'V-joint', px - 3, py + T + 34, { size: 10, align: 'center', color: muted }); }
        } else if (k === 'shadow') {
          const py = wy + 14, g = 14;
          [[cx - g / 2 - 170, cx - g / 2], [cx + g / 2, cx + g / 2 + 170]].forEach(([a, b], i) => { box(ctx, a, py + 14, b - a, T - 14, wool); box(ctx, i ? a : b - 16, py + 14, 16, T - 14, wood, text); box(ctx, i ? a + 30 : b - 70, py, 40, 14, wood, text); });
          box(ctx, cx - g / 2 - 40, wy, 80 + g, 3, '#000');
          fab([[cx - g / 2 - 170, py + T + 2], [cx - g / 2 + 2, py + T + 2], [cx - g / 2 + 2, py + 12], [cx - g / 2 - 20, py + 12]], u);
          fab([[cx + g / 2 + 170, py + T + 2], [cx + g / 2 - 2, py + T + 2], [cx + g / 2 - 2, py + 12], [cx + g / 2 + 20, py + 12]], u);
          seg(ctx, cx - g / 2, py + T + 16, cx + g / 2, py + T + 16, text, 1.5); A.text(ctx, 'same gap everywhere', cx, py + T + 32, { size: 10, align: 'center', color: muted });
          A.text(ctx, 'wall painted black in the gap', cx, wy + 12 + T + 50, { size: 10, align: 'center', color: muted });
          const sy = py + T - 20 + 0; if (u < 0.9) box(ctx, cx - g / 2, sy - 30 * (1 - u), g, 26, A.css('c3'), text);
        } else {
          const py = wy, bw = 60;
          box(ctx, cx - bw / 2, py, bw, T, wood, text); A.text(ctx, 'batten', cx, py + 30, { size: 10, align: 'center', color: '#fff' });
          box(ctx, 18, py, cx - bw / 2 - 18, T, wool); box(ctx, cx + bw / 2, py, w - 18 - (cx + bw / 2), T, wool);
          const fy = py + T + 2;
          if (k === 'bead') {
            fab([[18, fy], [cx - 4, fy]], u); fab([[w - 18, fy], [cx + 4, fy]], u);
            if (u > 0.5) { stp(cx - 14, fy, false); stp(cx + 14, fy, false); }
            const drop = clamp((u - 0.6) / 0.4, 0, 1); box(ctx, cx - 24, fy + 3 + 40 * (1 - drop), 48, 10, 'rgba(120,85,50,.95)', text); A.text(ctx, 'cover bead hides the staples', cx, fy + 70, { size: 10, align: 'center', color: muted });
          } else if (k === 'kerf') {
            ctx.fillStyle = A.css('bg'); ctx.fillRect(cx - 4, fy - 22, 8, 20); ctx.strokeStyle = text; ctx.strokeRect(cx - 4, fy - 22, 8, 20);
            const d = clamp(u * 1.4, 0, 1);
            fab([[18, fy], [cx - 4, fy], [cx - 3, fy - 16 * d]], 1); fab([[w - 18, fy], [cx + 4, fy], [cx + 3, fy - 16 * d]], 1);
            dot(ctx, cx, fy - 14 * d + 26 * (1 - d), 3.6, A.css('c3'));
            if (u < 0.85) { dot(ctx, cx, fy + 26 * (1 - d) + 16, 11, A.alpha(text, 0.6)); A.text(ctx, 'roller', cx + 18, fy + 26 * (1 - d) + 20, { size: 10, color: muted }); }
            A.text(ctx, 'groove + spline cord', cx, fy + 62, { size: 10, align: 'center', color: muted });
          } else {
            // back-tack: cloth comes face-down from the left, strip, then folds back to the right
            const f2 = clamp((u - 0.4) / 0.6, 0, 1);
            fab([[cx - 26, fy + 2], [cx + 22, fy + 2]], clamp(u / 0.3, 0, 1));
            if (u > 0.2) { box(ctx, cx - 4, fy + 5, 28, 5, A.css('c6') || '#c7a12b', text); stp(cx + 10, fy + 4, false); }
            if (f2 > 0) { ctx.strokeStyle = acc; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 26, fy + 2); const ang = Math.PI * f2; ctx.quadraticCurveTo(cx - 34, fy + 8, cx - 26 + 4, fy + 13); ctx.lineTo(cx - 22 + Math.max(0, -Math.cos(ang)) * (w - 18 - cx + 22) * 1, fy + 13 + Math.sin(ang) * 40 * (1 - f2)); ctx.stroke(); }
            A.text(ctx, 'stiff strip gives the straight line; staples end up inside', cx, fy + 66, { size: 10, align: 'center', color: muted });
          }
        }
      },
    });
    host.appendChild(tip);
    function upd() {
      t0 = now;
      const d = D[st.kind];
      out.innerHTML = A.statBox('Skill needed', d[1], d[0], d[1] === 'Easy' ? 'good' : d[1] === 'Medium' ? 'warn' : 'bad');
      tips(tip, [d[4], '<b>Tools:</b> ' + d[2] + '.', '<b>Where it suits:</b> ' + d[3], 'Whatever the detail, make one full-size sample corner first and agree it with the client before repeating it forty times.']);
    }
    upd();
  };

  /* ======================================================================
     10. Cloud frame check
     ====================================================================== */
  V.cloudFrame = function (host) {
    const SEC = { a: ['19 × 45 mm softwood', 0.019, 0.045], b: ['25 × 50 mm softwood', 0.025, 0.05], c: ['38 × 63 mm softwood', 0.038, 0.063], d: ['25 × 75 mm softwood', 0.025, 0.075] };
    const st = A.controls(host, [
      { key: 'len', label: 'Cloud length', type: 'range', min: 0.6, max: 3.6, step: 0.1, value: 2.4, unit: 'm' },
      { key: 'wid', label: 'Cloud width', type: 'range', min: 0.6, max: 1.8, step: 0.1, value: 1.2, unit: 'm' },
      { key: 'thk', label: 'Core thickness', type: 'range', min: 50, max: 200, step: 25, value: 100, unit: 'mm' },
      { key: 'dens', label: 'Core density', type: 'range', min: 16, max: 96, step: 4, value: 48, unit: 'kg/m³' },
      { key: 'sec', label: 'Frame timber (on edge)', type: 'select', value: 'b', options: Object.entries(SEC).map(([k, v]) => [k, v[0]]) },
      { key: 'hang', label: 'Hanging points', type: 'select', value: 4, numeric: true, options: [[4, '4'], [6, '6'], [8, '8']] },
      { key: 'brace', label: 'Cross braces', type: 'range', min: 0, max: 5, step: 1, value: 2 },
    ], () => upd());
    const out = stats(host), tip = el('div'), safe = el('div');
    let R = null;
    A.canvas(host, {
      height: 290, animate: true,
      caption: 'Side view of the cloud on its hangers, with the bending of the frame drawn many times larger than life, and a plan of the frame below. A frame that bows shows as a curved shadow line under the edge and lets the cloth go slack.',
      draw(ctx, w, h, t) {
        if (!R) return; t = tp(t);
        const text = A.css('text'), muted = A.css('muted'), acc = A.css('accent');
        const pw = Math.min(w - 60, 440), x0 = (w - pw) / 2, cy = 16;
        box(ctx, 10, cy - 10, w - 20, 10, A.alpha(muted, 0.4)); A.text(ctx, 'structural ceiling', 14, cy - 1, { size: 9, color: text });
        const n = st.hang / 2, hy = cy + 62, ex = clamp(R.defl * 2500, 0, 22), th = 10 + st.thk / 12;
        const xs = Array.from({ length: n }, (_, i) => x0 + pw * (n === 1 ? 0.5 : 0.1 + (0.8 * i) / (n - 1)));
        const yAt = (x) => { let y = hy; for (let i = 0; i < xs.length - 1; i++) if (x >= xs[i] && x <= xs[i + 1]) { const q = (x - xs[i]) / (xs[i + 1] - xs[i]); y += ex * 4 * q * (1 - q); } if (x < xs[0]) y += ex * 0.6 * ((xs[0] - x) / (xs[0] - x0 + 1)); if (x > xs[n - 1]) y += ex * 0.6 * ((x - xs[n - 1]) / (x0 + pw - xs[n - 1] + 1)); return y; };
        xs.forEach((x) => { seg(ctx, x, cy, x, yAt(x), text, 1.4); seg(ctx, x + 5, cy, x + 5, yAt(x), A.alpha(A.css('good'), 0.8), 1, [3, 3]); dot(ctx, x, cy, 3, text); });
        ctx.fillStyle = A.alpha(acc, 0.3); ctx.strokeStyle = text; ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = x0; x <= x0 + pw; x += 6) ctx.lineTo(x, yAt(x)); for (let x = x0 + pw; x >= x0; x -= 6) ctx.lineTo(x, yAt(x) + th); ctx.closePath(); ctx.fill(); ctx.stroke();
        A.text(ctx, 'bending drawn many times larger than life', x0 + pw / 2, hy + th + ex + 16, { size: 10, align: 'center', color: muted });
        A.text(ctx, 'dashed: independent safety cable', x0 + pw / 2, cy + 22, { size: 10, align: 'center', color: A.css('good') });
        // plan
        const sc = Math.min(pw / st.len, (h - hy - th - 78) / st.wid), PW = st.len * sc, PH = st.wid * sc, px = (w - PW) / 2, py = hy + th + 48;
        box(ctx, px, py, PW, PH, A.alpha(acc, 0.12), text, 3);
        for (let i = 1; i <= st.brace; i++) seg(ctx, px + (PW * i) / (st.brace + 1), py, px + (PW * i) / (st.brace + 1), py + PH, 'rgba(160,120,80,.9)', 3);
        for (let i = 0; i < n; i++) { const hx = px + PW * (n === 1 ? 0.5 : 0.1 + (0.8 * i) / (n - 1)); dot(ctx, hx, py + 4, 4 + Math.sin(t * 3 + i) * 0.6, A.css('bad')); dot(ctx, hx, py + PH - 4, 4 + Math.sin(t * 3 + i) * 0.6, A.css('bad')); }
        A.text(ctx, 'plan: frame, braces and hanging points', w / 2, py + PH + 14, { size: 10, align: 'center', color: muted });
      },
    });
    host.appendChild(tip); host.appendChild(safe);
    function upd() {
      const [, b, d] = SEC[st.sec];
      const core = st.len * st.wid * (st.thk / 1000) * st.dens;
      const frameLen = 2 * (st.len + st.wid) + st.brace * st.wid;
      const frame = frameLen * b * d * 520;
      const cloth = st.len * st.wid * 0.6 + 1.0; // face + back sheet + hardware
      const mass = core + frame + cloth;
      const n = st.hang / 2, span = n > 1 ? (0.8 * st.len) / (n - 1) : st.len;
      const wline = (mass * 9.81) / 2 / st.len;          // N/m on each long rail
      const E = 8e9, I = (b * d * d * d) / 12;
      const defl = (5 * wline * Math.pow(span, 4)) / (384 * E * I);
      const limit = span / 300;
      const perPt = ((mass * 9.81) / st.hang) * 1.5;   // uneven sharing
      const need = (perPt * 5) / 9.81;                  // kg breaking strength, factor 5
      const braceGap = st.len / (st.brace + 1);
      R = { defl };
      out.innerHTML = A.statBox('Total weight', fmt(mass, 1) + ' kg', 'core ' + fmt(core, 1) + ' · frame ' + fmt(frame, 1) + ' · cloth and fittings ' + fmt(cloth, 1))
        + A.statBox('Rail span between hangers', fmt(span, 2) + ' m', '')
        + A.statBox('Rail bending', fmt(defl * 1000, 1) + ' mm', 'aim under ' + fmt(limit * 1000, 1) + ' mm (span ÷ 300)', defl <= limit ? 'good' : defl <= limit * 2 ? 'warn' : 'bad')
        + A.statBox('Load per hanging point', fmt(perPt / 9.81, 1) + ' kg', 'allowing for uneven sharing')
        + A.statBox('Each hanger and fixing rated for', '≥ ' + fmt(Math.ceil(need / 5) * 5, 0) + ' kg', 'breaking strength, safety factor 5', 'warn')
        + A.statBox('Brace spacing', fmt(braceGap, 2) + ' m', braceGap <= 0.65 ? 'holds the cloth tension' : 'long rails will pull inwards', braceGap <= 0.65 ? 'good' : 'warn');
      const t = [];
      if (defl > limit) t.push('The frame bends too much between hangers. Add hanging points, use a deeper timber on edge (depth matters far more than width), or shorten the cloud.');
      else t.push('Bending is within a sensible limit, so the lower edge will read as a straight line.');
      if (braceGap > 0.65) t.push('Stretched cloth pulls the long rails towards each other. Put a cross brace about every 600 mm so the frame stays rectangular and the cloth stays tight.');
      if (mass > 25) t.push('Over 25 kg: build it as two smaller clouds, or lift it with two people and temporary props. Check what the ceiling is actually made of before choosing fixings.');
      if (st.dens > 64 && st.thk >= 100) t.push('Dense, thick slabs are heavy without absorbing more at mid and high frequencies. For clouds, 32–48 kg/m³ is usually the better trade.');
      tips(tip, t, defl > limit ? 'warn' : 'mentor');
      safe.innerHTML = '<div class="callout safety"><b>Overhead safety.</b> This is a rough teaching estimate, not a structural design. Fix only into the structural slab, joists or purpose-made steel — never into plasterboard, false-ceiling grid or plaster. Use rated anchors, closed eye-bolts and locking hardware, and add an independent safety cable to at least two corners so that no single failure can drop the cloud. If in doubt, have a structural engineer check the fixings.</div>';
    }
    upd();
  };
})();
