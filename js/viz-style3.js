/* ==========================================================================
   Acoustica — consultant's toolkit widgets:
   study path (skillRadar, studyPlanner, kitBuilder, portfolioTracker),
   client process (briefBuilder, budgetTiers, stagePlanner,
   forecastVsMeasured, drawingSet) and studio furniture (deskErgo,
   rackPlanner, cablePaths, deskCutList).
   Indicative planning and teaching models. Money figures are rough,
   illustrative ranges only — always get local quotations.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt } = A;
  const TAU = Math.PI * 2;
  const FONT = (px, w) => `${w || 400} ${px}px "Nunito Sans", system-ui, sans-serif`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const css = (n) => A.css(n);
  const callout = (cls, s) => `<div class="callout ${cls}">${s}</div>`;
  const P10 = (x) => Math.pow(10, x);
  const inr = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
  const lakh = (v) => (v >= 1e7 ? '₹' + fmt(v / 1e7, 2) + ' crore' : v >= 1e5 ? '₹' + fmt(v / 1e5, 1) + ' lakh' : inr(v));
  const title = (id) => { const L = (window.LESSONS || []).find((l) => l.id === id); return L ? L.title : id; };
  const lessonLink = (id) => `<a href="#/academy/${id}">${title(id)}</a>`;
  const txt = (ctx, s, x, y, o = {}) => { ctx.save(); ctx.font = FONT(o.size || 11, o.bold ? 700 : 400); ctx.fillStyle = o.color || css('text'); ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic'; ctx.fillText(s, x, y); ctx.restore(); };
  const line = (ctx, x1, y1, x2, y2, c, lw = 1.5, dash) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); };
  const rr = (ctx, x, y, w, h, r, fill, stroke, lw) => { ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, Math.max(0, w), Math.max(0, h), r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); } ctx.restore(); };
  const wrapText = (ctx, s, x, y, maxW, lh, o = {}) => {
    ctx.save(); ctx.font = FONT(o.size || 11, o.bold ? 700 : 400); ctx.fillStyle = o.color || css('text'); ctx.textAlign = o.align || 'left';
    const words = String(s).split(' '); let ln = '', n = 0;
    for (const wd of words) { const t = ln ? ln + ' ' + wd : wd; if (ctx.measureText(t).width > maxW && ln) { ctx.fillText(ln, x, y + n * lh); ln = wd; n++; } else ln = t; }
    if (ln) { ctx.fillText(ln, x, y + n * lh); n++; }
    ctx.restore(); return n;
  };
  const moneyNote = '<p class="small muted" style="margin:.4em 0 0">Money figures are rough, illustrative ranges for planning only. Prices differ by city, year and quality — collect local quotations.</p>';

  /* ======================================================================
     1. Skill radar — self-assessment
     ====================================================================== */
  const SKILLS = [
    ['Decibels', 'Decibels, logs and level arithmetic', ['decibels', 'workbook'], 'Add three unequal levels by hand (for example 62, 65 and 71 dB), then check with a calculator. Repeat until you can estimate within 1 dB in your head.'],
    ['Waves & modes', 'Waves, room modes and standing waves', ['modes', 'modes-treat'], 'Calculate the first ten modes of your own room, then find each one with a sine sweep and a level meter at the walls.'],
    ['Decay', 'Reverberation and absorption', ['reverb', 'absorption'], 'Predict the decay time of a room from its surfaces, then measure it. Explain every band where you were more than 20 % out.'],
    ['Isolation', 'Sound isolation and flanking', ['isolation', 'flanking'], 'Measure the level difference across one wall in octave bands, list every path the sound could take, and rank them.'],
    ['Vibration', 'Vibration, floors and impact sound', ['vibration', 'floating', 'impact-structure'], 'Work out the natural frequency of a platform on pads from its load and deflection, then tap-test it.'],
    ['Construction', 'Building construction and materials', ['m-walls', 'm-floors', 'm-india'], 'Visit a site with a carpenter or mason and sketch three real junctions: wall to floor, wall to ceiling and a door frame.'],
    ['HVAC & noise', 'Ventilation, HVAC and noise criteria', ['m-hvac', 'criteria'], 'Measure the background noise spectrum of a room with the air-conditioning on and off and plot it against a noise criterion curve.'],
    ['Measurement', 'Measurement and instrumentation', ['measurement', 'a-measure-depth'], 'Measure the same loudspeaker three times on different days. If the curves differ, find out why before trusting any of them.'],
    ['Modelling', 'Prediction and computer modelling', ['modelling', 'rooms'], 'Model a simple room, predict its early reflections, and compare the predicted arrival times with a measured impulse response.'],
    ['Loudspeakers', 'Loudspeakers, placement and tuning', ['a-loudspeakers', 'a-tuning', 'control-room'], 'Move a pair of monitors in 10 cm steps from the front wall and plot how the boundary dip moves.'],
    ['Drawings', 'Drawing, detailing and specification', ['m-client-process', 'm-playbook'], 'Draw one wall-to-floor junction at 1:5 with every layer labelled, then give it to someone else and ask them to describe how to build it.'],
    ['Clients', 'Clients, business and ethics', ['m-client-process', 'm-standards'], 'Write a one-page summary of a design for a non-technical friend. If they cannot repeat the three key points back, rewrite it.'],
  ];
  V.skillRadar = function (host) {
    const saved = A.store.get('style3:skills', null) || [];
    host.appendChild(html('<p class="small muted" style="margin:0 0 6px">Rate yourself honestly: 0 = never met it, 3 = can do it with notes, 5 = could teach it and have done it on a real project. Your ratings are saved on this device.</p>'));
    const st = A.controls(host, SKILLS.map((s, i) => ({ key: 'k' + i, label: s[1], type: 'range', min: 0, max: 5, step: 1, value: saved[i] == null ? 2 : saved[i], fmt: (v) => v + ' / 5' })), () => { A.store.set('style3:skills', SKILLS.map((_, i) => st['k' + i])); cv.redraw(); upd(); });
    const cv = A.canvas(host, {
      height: 360, caption: 'Your skill shape. A consultant needs a round shape more than a tall spike: one missing pillar is where projects fail.',
      draw(ctx, w, h) {
        const cx = w / 2, cy = h / 2 + 4, R = Math.min(w / 2 - 78, h / 2 - 34), n = SKILLS.length;
        const vals = SKILLS.map((_, i) => st['k' + i]); const order = vals.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).slice(0, 3).map((x) => x[1]);
        for (let r = 1; r <= 5; r++) { ctx.beginPath(); for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i / n) * TAU; const x = cx + Math.cos(a) * R * r / 5, y = cy + Math.sin(a) * R * r / 5; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = css('line'); ctx.lineWidth = r === 3 ? 1.6 : 1; ctx.stroke(); }
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + (i / n) * TAU; line(ctx, cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R, css('line'), 1);
          const weak = order.includes(i); const lx = cx + Math.cos(a) * (R + 10), ly = cy + Math.sin(a) * (R + 12);
          txt(ctx, SKILLS[i][0], lx, ly + 4, { size: w < 420 ? 9.5 : 11, bold: weak, color: weak ? css('bad') : css('muted'), align: Math.abs(Math.cos(a)) < 0.2 ? 'center' : Math.cos(a) > 0 ? 'left' : 'right' });
        }
        ctx.beginPath(); vals.forEach((v, i) => { const a = -Math.PI / 2 + (i / n) * TAU; const x = cx + Math.cos(a) * R * v / 5, y = cy + Math.sin(a) * R * v / 5; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
        ctx.globalAlpha = 0.25; ctx.fillStyle = css('accent'); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = css('accent'); ctx.lineWidth = 2.5; ctx.stroke();
        vals.forEach((v, i) => { const a = -Math.PI / 2 + (i / n) * TAU; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R * v / 5, cy + Math.sin(a) * R * v / 5, order.includes(i) ? 5 : 3.5, 0, TAU); ctx.fillStyle = order.includes(i) ? css('bad') : css('accent'); ctx.fill(); });
        txt(ctx, 'working level', cx + 4, cy - R * 3 / 5 - 3, { size: 9, color: css('muted') });
      },
    });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const plan = el('div'); host.appendChild(plan);
    function upd() {
      const vals = SKILLS.map((_, i) => st['k' + i]); const avg = vals.reduce((a, b) => a + b, 0) / vals.length; const mn = Math.min(...vals);
      const stage = avg < 1.5 ? 'Stage 0–1: foundations' : avg < 2.8 ? 'Stage 2: tools and first projects' : avg < 4 ? 'Stage 3: supervised projects' : 'Stage 4: independent practice';
      out.innerHTML = A.statBox('Average', fmt(avg, 1) + ' / 5', stage) + A.statBox('Lowest skill', mn + ' / 5', mn <= 1 ? 'a gap that will bite on a real job' : 'no dangerous gap', mn <= 1 ? 'bad' : 'good') + A.statBox('Balance', fmt(Math.max(...vals) - mn, 0) + ' point spread', Math.max(...vals) - mn >= 3 ? 'lopsided — work on the weak side' : 'reasonably even');
      const weak = vals.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).slice(0, 3);
      plan.innerHTML = callout('mentor', '<b>Your next three study targets</b><ol style="margin:.4em 0 0 1.1em;padding:0">' + weak.map(([v, i]) => `<li style="margin-bottom:.5em"><b>${SKILLS[i][1]}</b> (${v}/5) — study ${SKILLS[i][2].map(lessonLink).join(', ')}.<br><span class="small"><b>Exercise:</b> ${SKILLS[i][3]}</span></li>`).join('') + '</ol>');
    }
    upd();
  };

  /* ======================================================================
     2. Study planner — month-by-month roadmap
     ====================================================================== */
  const STAGES = [
    ['Stage 0 · Listener', 'Train your ears and measure your own room.', ['sound', 'decibels', 'hearing', 'measurement'], 'A measured before-and-after of your own room'],
    ['Stage 1 · Foundations', 'Physics, decibels, modes, decay, absorption, isolation.', ['propagation', 'modes', 'reverb', 'absorption', 'isolation', 'workbook'], 'Hand calculations that match your measurements'],
    ['Stage 2 · Tools', 'Measurement in depth, modelling, drawing, construction details.', ['a-measure-depth', 'modelling', 'm-walls', 'm-hvac', 'm-playbook'], 'A full drawing set and report for one room'],
    ['Stage 3 · Supervised projects', 'Real rooms for real people, with a mentor checking your work.', ['m-client-process', 'm-design-language', 'm-fabric-install', 'flanking'], 'Three built projects with commissioning data'],
    ['Stage 4 · Independent practice', 'Your own clients, contracts, insurance and continuing study.', ['m-standards', 'm-consultant-path'], 'Repeat clients and referrals'],
  ];
  const GOAL_HOURS = { home: [30, 150, 150, 220], studio: [40, 220, 260, 520], building: [40, 260, 340, 720] };
  const BG_FACTOR = { musician: [0.5, 1.1, 1.0, 1.0], audio: [0.4, 0.85, 0.8, 0.95], architect: [1.0, 0.95, 0.7, 0.85], science: [0.9, 0.6, 0.9, 1.0] };
  V.studyPlanner = function (host) {
    const st = A.controls(host, [
      { key: 'hrs', label: 'Study and practice time', type: 'range', min: 3, max: 30, step: 1, value: 8, fmt: (v) => v + ' h per week' },
      { key: 'bg', label: 'Your background', type: 'select', value: 'musician', options: [['musician', 'Musician or producer'], ['audio', 'Audio engineer'], ['architect', 'Architect, interior or civil background'], ['science', 'Science or engineering student']] },
      { key: 'goal', label: 'Your goal', type: 'select', value: 'studio', options: [['home', 'Designer of home and project studios'], ['studio', 'Studio design consultant'], ['building', 'Building-acoustics consultant']] },
    ], () => { upd(); });
    let M = null;
    const cv = A.canvas(host, {
      height: 250, animate: true, caption: 'A roadmap sized to your weekly hours. The moving marker shows how time is shared between stages; the last stage never ends.',
      draw(ctx, w, h, t) {
        if (!M) return; t = Math.max(0, t);
        const x0 = 14, x1 = w - 14, tot = M.total, sx = (m) => x0 + (m / (tot * 1.12)) * (x1 - x0);
        const cols = ['c1', 'c2', 'c3', 'c4', 'c5'].map(css);
        let acc = 0; const rowH = 30;
        M.months.forEach((m, i) => {
          const y = 28 + i * (rowH + 8), xa = sx(acc), xb = sx(acc + m);
          rr(ctx, xa, y, Math.max(6, xb - xa), rowH, 6, cols[i]);
          const label = STAGES[i][0] + ' · ' + fmt(m, m < 10 ? 1 : 0) + ' mo';
          ctx.font = FONT(11, 700); const tw = ctx.measureText(label).width;
          if (xb + tw + 8 < x1) txt(ctx, label, xb + 6, y + 19, { bold: true }); else txt(ctx, label, Math.max(x0, xa - 6), y + 19, { bold: true, align: xa - 6 - tw > x0 ? 'right' : 'left', color: xa - 6 - tw > x0 ? css('text') : css('bg') });
          acc += m;
        });
        const y4 = 28 + 4 * (rowH + 8); ctx.save(); ctx.setLineDash([6, 4]); rr(ctx, sx(acc), y4, x1 - sx(acc), rowH, 6, null, cols[4], 2); ctx.restore();
        txt(ctx, STAGES[4][0] + ' →', sx(acc) - 6, y4 + 19, { bold: true, align: 'right' });
        line(ctx, x0, 22, x1, 22, css('line'), 1);
        const step = tot > 40 ? 12 : tot > 16 ? 6 : 3;
        for (let m = 0; m <= tot * 1.12; m += step) { line(ctx, sx(m), 18, sx(m), 26, css('muted'), 1); txt(ctx, m ? m + ' mo' : 'start', sx(m), 13, { size: 9.5, color: css('muted'), align: m ? 'center' : 'left' }); }
        const p = (t * 0.12) % 1, mx = sx(p * tot); line(ctx, mx, 24, mx, h - 12, css('accent'), 2, [3, 3]);
        ctx.beginPath(); ctx.arc(mx, h - 10, 5, 0, TAU); ctx.fillStyle = css('accent'); ctx.fill();
      },
    });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const plan = el('div'); host.appendChild(plan);
    function upd() {
      const hrs = GOAL_HOURS[st.goal].map((hh, i) => hh * BG_FACTOR[st.bg][i]); const months = hrs.map((hh) => hh / (st.hrs * 4.35));
      const total = months.reduce((a, b) => a + b, 0); M = { months, total, hrs };
      out.innerHTML = A.statBox('To first paid-quality work', fmt(months[0] + months[1] + months[2], 0) + ' months', 'end of Stage 2') + A.statBox('To independent practice', fmt(total, 0) + ' months', fmt(total / 12, 1) + ' years at this pace', total > 48 ? 'bad' : '') + A.statBox('Total focused hours', fmt(hrs.reduce((a, b) => a + b, 0), 0) + ' h', 'study + practice + site time');
      const tip = st.hrs < 6 ? 'Under six hours a week the plan stretches so far that early lessons fade before you use them. Protect two fixed sessions a week, and make one of them practical.' : st.hrs > 20 ? 'This is close to full-time study. Spend at least half of it on measuring, drawing and site visits — reading alone does not build judgement.' : 'A steady pace. Keep a rhythm of roughly one third reading, one third calculating and measuring, one third drawing and site time.';
      const bgTip = { musician: 'Your ears are your head start. Your gap is usually maths and construction — do the workbook problems with a pencil.', audio: 'You already measure and listen critically. Your gap is usually building construction and drawing — spend time on site.', architect: 'You can draw and you know how buildings go together. Your gap is usually measurement and the physics behind the rules — measure everything you design.', science: 'The physics will come quickly. Your gap is usually ears and construction — listen to a lot of rooms and learn from tradespeople.' }[st.bg];
      plan.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Stage</th><th>Months</th><th>Focus</th><th>Study in this app</th><th>Proof of skill</th></tr></thead><tbody>' + STAGES.map((s, i) => `<tr><td><b>${s[0]}</b></td><td>${i < 4 ? fmt(months[i], months[i] < 10 ? 1 : 0) : 'ongoing'}</td><td>${s[1]}</td><td>${s[2].map(lessonLink).join(' · ')}</td><td>${s[3]}</td></tr>`).join('') + '</tbody></table></div>' + callout('mentor', `<b>Pace:</b> ${tip}<br><b>For your background:</b> ${bgTip}`);
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Kit builder — measurement kit by budget and work type
     ====================================================================== */
  const KIT = {
    starter: [
      ['Measurement microphone', 'Small omnidirectional USB or XLR measurement microphone with an individual calibration file', [6000, 15000], '±1.5 dB 30 Hz–16 kHz with its file', 'Load the calibration file; compare against a second microphone at the same spot'],
      ['Audio interface', 'Two-channel interface with one spare input for a loopback timing reference', [8000, 18000], 'Flat within ±0.2 dB', 'Loop an output to an input and measure it: the curve should be a straight line'],
      ['Level reference', 'A phone or tablet meter app, used only as a rough guide', [0, 1500], '±3 dB at best', 'Check it against a calibrated meter whenever you can borrow one'],
      ['Sound source', 'Your own monitors, plus one small powered loudspeaker to carry', [0, 12000], 'Fine for room response; not for isolation tests', 'Measure it outdoors or gated once so you know its own response'],
      ['Software', 'A free room-measurement program, a spreadsheet and a free room-mode calculator', [0, 0], 'Limited by the microphone, not the software', 'Repeat every measurement; differences over 1 dB need an explanation'],
      ['Accessories', 'Microphone stand, 10 m cable, tape measure, laser distance meter, notebook', [3000, 7000], 'Distances to ±5 mm', 'Check the laser against a steel tape once'],
    ],
    working: [
      ['Measurement microphone', 'Calibrated measurement microphone with 0° and 90° files and a known sensitivity', [15000, 40000], '±1 dB 20 Hz–20 kHz', 'Level-check with the calibrator before every session; log the reading'],
      ['Audio interface', 'Two or four inputs, clean preamps, 48 V, stable drivers', [15000, 40000], 'Flat within ±0.1 dB, low noise', 'Loopback calibration file made and applied'],
      ['Sound level meter', 'A class 2 integrating sound level meter with octave bands', [30000, 90000], '±1.5 dB; suitable for surveys, not for legal reports', 'Periodic laboratory verification; field check with the calibrator'],
      ['Sound calibrator', 'A class 2 calibrator (94 dB at 1 kHz) that fits your microphones', [12000, 35000], '±0.4 dB', 'Send for laboratory calibration every one to two years'],
      ['Sound source', 'A powerful full-range powered loudspeaker and a pink-noise source for isolation tests', [25000, 70000], 'About 100 dB in a source room, enough for most partitions', 'Check that the receive-room level is at least 10 dB above background in every band'],
      ['Software', 'Measurement program, an isolation-prediction tool, a 3-D drawing program and report templates', [0, 60000], 'Predictions within a few dB when inputs are honest', 'Model something you can measure, and compare'],
      ['Accessories', 'Tall stand, boom, 20 m cables, laser, moisture meter, borescope camera, torch, PPE', [15000, 35000], '—', 'Keep a packed kit list and tick it before leaving'],
    ],
    pro: [
      ['Measurement microphones', 'Class 1 measurement microphones and preamplifiers, matched where needed', [150000, 400000], '±0.5 dB with traceable calibration', 'Laboratory calibration certificates on file; calibrator check before and after every job'],
      ['Sound level meter / analyser', 'A class 1 sound level meter with third-octave bands, logging and building-acoustics functions', [300000, 900000], 'Meets the instrument class required by test standards', 'Periodic verification by an accredited laboratory'],
      ['Sound calibrator', 'A class 1 calibrator', [50000, 120000], '±0.25 dB', 'Annual laboratory calibration'],
      ['Sound sources', 'An omnidirectional (dodecahedron) loudspeaker with amplifier, plus a standard tapping machine', [300000, 900000], 'Meets the directivity required for standard tests', 'Check directivity and level; service the tapping machine hammers'],
      ['Vibration', 'An accelerometer or two with a conditioning amplifier', [60000, 250000], 'Finds structure-borne paths that microphones cannot', 'Back-to-back check against a reference'],
      ['Software', 'Building-acoustics analysis, a ray-tracing room-modelling package, noise-mapping (if environmental), CAD or BIM', [200000, 1200000], 'Recognised by clients, courts and authorities when used correctly', 'Benchmark each package against measured rooms'],
      ['Accessories', 'Weather kit, long-term logging case, spare batteries, tripod set, insurance for the lot', [40000, 120000], '—', 'Asset register with serial numbers and calibration dates'],
    ],
  };
  const KIT_EXTRA = {
    rooms: ['Room tuning and treatment', 'Add a second microphone for spatial averaging and a small turntable or marked floor grid for repeatable positions.'],
    iso: ['Isolation testing', 'The loudspeaker must be loud and broad-band, and you need two rooms\' worth of cable. Without a class 1 or 2 meter your results are indicative only — say so in the report.'],
    env: ['Environmental noise', 'You need a weather-protected meter that can log for days, a windshield, and a record of weather. Phone apps are not acceptable evidence.'],
    pa: ['Sound systems', 'Add a dual-channel analyser setup, long cables or a wireless link for the measurement microphone, and a speech-intelligibility test signal.'],
  };
  V.kitBuilder = function (host) {
    const st = A.controls(host, [
      { key: 'lvl', label: 'Budget level', type: 'select', value: 'starter', options: [['starter', 'Starter — learning and your own rooms'], ['working', 'Working — paid studio and small-room jobs'], ['pro', 'Professional — standards-grade testing']] },
      { key: 'work', label: 'Main kind of work', type: 'select', value: 'rooms', options: [['rooms', 'Room tuning and treatment'], ['iso', 'Isolation testing'], ['env', 'Environmental noise surveys'], ['pa', 'Sound-system commissioning']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const body = el('div'); host.appendChild(body);
    function upd() {
      const k = KIT[st.lvl]; const lo = k.reduce((a, r) => a + r[2][0], 0), hi = k.reduce((a, r) => a + r[2][1], 0);
      const acc = { starter: 'Good for trends and before/after comparisons', working: 'Good for design decisions and client reports', pro: 'Suitable for formal test reports' }[st.lvl];
      out.innerHTML = A.statBox('Kit total (rough)', lakh(lo) + ' – ' + lakh(hi), 'excluding laptop') + A.statBox('What it is good for', st.lvl === 'starter' ? 'Learning' : st.lvl === 'working' ? 'Design work' : 'Formal testing', acc) + A.statBox('Weakest link', st.lvl === 'starter' ? 'Absolute level' : st.lvl === 'working' ? 'Instrument class' : 'The operator', st.lvl === 'starter' ? 'no calibrator: relative results only' : st.lvl === 'working' ? 'not accepted for some legal reports' : 'procedure and judgement now matter most');
      const mismatch = (st.lvl === 'starter' && (st.work === 'iso' || st.work === 'env')) ? callout('warn', '<b>Mismatch:</b> a starter kit cannot give trustworthy isolation or environmental noise figures. Use it to learn the method, and borrow or hire a proper meter and calibrator before you report numbers to anyone.') : '';
      body.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Item</th><th>What to look for</th><th>Rough cost</th><th>Accuracy to expect</th><th>How to verify it</th></tr></thead><tbody>' + k.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2][1] ? inr(r[2][0]) + ' – ' + inr(r[2][1]) : 'free'}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('') + '</tbody></table></div>' + callout('mentor', `<b>${KIT_EXTRA[st.work][0]}:</b> ${KIT_EXTRA[st.work][1]}`) + mismatch + moneyNote;
    }
    upd();
  };

  /* ======================================================================
     4. Portfolio tracker
     ====================================================================== */
  const PROJECTS = [
    ['Your own room', 'Measure, treat and re-measure the room you work in.', 'Modes, decay, speaker placement'],
    ['A friend\'s project studio', 'Someone else\'s room, taste and budget.', 'Listening to a client, compromise'],
    ['A vocal or podcast booth', 'A small dry space, built or converted.', 'Small-room absorption, ventilation'],
    ['A band rehearsal room', 'Loud sources and neighbours.', 'Isolation, doors, low-frequency control'],
    ['A place of worship or hall', 'Speech clarity in a reverberant volume.', 'Decay time, intelligibility, loudspeaker aiming'],
    ['A classroom or meeting room', 'Ordinary rooms with clear criteria.', 'Criteria, absorption area, reporting'],
    ['A café or restaurant', 'Noise build-up and comfort.', 'Occupied noise, finishes that survive use'],
    ['A home cinema or listening room', 'Looks matter as much as sound.', 'Hidden treatment, fabric, multi-seat bass'],
    ['An isolation fix', 'One door, window or wall improved and proven.', 'Level difference before and after, flanking'],
    ['A small commercial room', 'A paying client, a contract and a hand-over.', 'Process, drawings, commissioning'],
  ];
  const EVID = ['Measured before', 'Drawings and calculations', 'Photos of the build', 'Measured after + lessons learned'];
  V.portfolioTracker = function (host) {
    let S = A.store.get('style3:portfolio', null); if (!Array.isArray(S) || S.length !== PROJECTS.length) S = PROJECTS.map(() => [0, 0, 0, 0]);
    const cv = A.canvas(host, {
      height: 170, caption: 'Each project counts only when all four kinds of evidence exist. A portfolio is proof, not a list of names.',
      draw(ctx, w, h) {
        const done = S.filter((p) => p.every(Boolean)).length, ticks = S.reduce((a, p) => a + p.filter(Boolean).length, 0), frac = ticks / (PROJECTS.length * 4);
        const cx = Math.min(90, w * 0.24), cy = h / 2, R = 58;
        ctx.lineWidth = 14; ctx.strokeStyle = css('line'); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
        ctx.strokeStyle = css('accent'); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + TAU * Math.max(0.001, frac)); ctx.stroke(); ctx.lineCap = 'butt';
        txt(ctx, Math.round(frac * 100) + '%', cx, cy + 4, { size: 22, bold: true, align: 'center' }); txt(ctx, 'evidence', cx, cy + 20, { size: 10, color: css('muted'), align: 'center' });
        const gx = cx + R + 28, cw = Math.max(14, Math.min(30, (w - gx - 10) / 10 - 4));
        txt(ctx, done + ' of 10 projects complete', gx, 22, { bold: true, size: 12 });
        S.forEach((p, i) => { p.forEach((v, j) => rr(ctx, gx + i * (cw + 4), 36 + j * 24, cw, 20, 4, v ? css('accent') : css('panel2'), css('line'), 1)); txt(ctx, String(i + 1), gx + i * (cw + 4) + cw / 2, 36 + 4 * 24 + 12, { size: 10, align: 'center', color: css('muted') }); });
      },
    });
    const sug = el('div'); host.appendChild(sug);
    const list = el('div', { style: { display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))' } }); host.appendChild(list);
    PROJECTS.forEach((p, i) => {
      const card = el('div', { class: 'card', style: { padding: '10px 12px' } });
      card.appendChild(html(`<div><b>${i + 1}. ${p[0]}</b><div class="small muted">${p[1]}</div><div class="small">Builds: ${p[2]}</div></div>`));
      EVID.forEach((e, j) => {
        const id = 'pf' + i + '_' + j + Math.random().toString(36).slice(2, 6);
        const row = el('div', { class: 'ctrl check', style: { margin: '3px 0 0' } }); const cb = el('input', { type: 'checkbox', id }); cb.checked = !!S[i][j];
        cb.addEventListener('change', () => { S[i][j] = cb.checked ? 1 : 0; A.store.set('style3:portfolio', S); cv.redraw(); upd(); });
        row.appendChild(cb); row.appendChild(el('label', { for: id }, e)); card.appendChild(row);
      });
      list.appendChild(card);
    });
    function upd() {
      const nxt = S.findIndex((p) => !p.every(Boolean)); const done = S.filter((p) => p.every(Boolean)).length;
      if (nxt < 0) { sug.innerHTML = callout('mentor', '<b>All ten documented.</b> Now go back to the earliest one and re-measure it. Explaining what you would do differently today is the strongest page in any portfolio.'); return; }
      const miss = EVID.filter((_, j) => !S[nxt][j]);
      const stage = done < 2 ? 'You are in the learning stages — do these for free and say so.' : done < 6 ? 'You have enough to show a mentor. Ask for a review before taking paid work.' : 'This is a credible portfolio. Start charging, and keep documenting.';
      sug.innerHTML = callout('mentor', `<b>Next best project: ${nxt + 1}. ${PROJECTS[nxt][0]}.</b> Still missing: ${miss.join(', ').toLowerCase()}. ${stage}`);
    }
    upd();
  };

  /* ======================================================================
     5. Brief builder — from conversation to target sheet
     ====================================================================== */
  V.briefBuilder = function (host) {
    const st = A.controls(host, [
      { key: 'use', label: 'Main use of the room', type: 'select', value: 'prod', options: [['prod', 'Writing and production'], ['mix', 'Critical stereo mixing'], ['imm', 'Immersive (multi-speaker) mixing'], ['master', 'Mastering'], ['track', 'Tracking live instruments'], ['voice', 'Voice-over and podcast']] },
      { key: 'hours', label: 'Working hours', type: 'select', value: 'eve', options: [['day', 'Daytime only'], ['eve', 'Days and evenings'], ['night', 'Any hour, including late night']] },
      { key: 'nb', label: 'Nearest neighbour', type: 'select', value: 'wall', options: [['det', 'Detached building, nobody close'], ['wall', 'Shared wall (house or office next door)'], ['apt', 'Apartment: people above and below'], ['com', 'Commercial building with other tenants']] },
      { key: 'src', label: 'Loudest thing in the room', type: 'select', value: 'spk', options: [['quiet', 'Voice and quiet monitoring'], ['spk', 'Monitors at working level'], ['sub', 'Loud monitors with subwoofers'], ['amp', 'Guitar and bass amplifiers'], ['drum', 'Acoustic drums']] },
      { key: 'area', label: 'Floor area', type: 'range', min: 6, max: 90, step: 1, value: 20, unit: 'm²' },
      { key: 'ht', label: 'Clear ceiling height', type: 'range', min: 2.2, max: 5, step: 0.05, value: 2.75, unit: 'm' },
      { key: 'low', label: 'Preferred low end', type: 'select', value: 'bal', options: [['tight', 'Tight and dry'], ['bal', 'Balanced'], ['big', 'Big and generous']] },
      { key: 'live', label: 'Preferred liveness', type: 'select', value: 'bal', options: [['dead', 'Controlled, quite dry'], ['bal', 'Neutral'], ['live', 'Lively and open']] },
      { key: 'bud', label: 'Investment range for the room', type: 'select', value: 'mid', options: [['low', 'Tight — do the essentials well'], ['mid', 'Moderate — a proper room'], ['high', 'Generous — no weak links']] },
      { key: 'time', label: 'Timeline', type: 'select', value: 'norm', options: [['rush', 'Needed within about 6 weeks'], ['norm', '3–6 months'], ['long', 'Flexible']] },
      { key: 'video', label: 'The room will also be filmed', type: 'check', value: false },
      { key: 'day', label: 'Daylight and a view are important', type: 'check', value: true },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const box = el('pre', { style: { whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '.92em', background: 'var(--panel2)', border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 14px', margin: '10px 0', maxWidth: '100%', overflowWrap: 'anywhere' } }); host.appendChild(box);
    const row = el('div', { class: 'row' }); const btn = el('button', { class: 'primary' }, 'Copy the brief'); row.appendChild(btn); host.appendChild(row);
    const tip = el('div'); host.appendChild(tip);
    btn.addEventListener('click', () => { const done = () => { btn.textContent = 'Copied'; setTimeout(() => (btn.textContent = 'Copy the brief'), 1400); }; try { navigator.clipboard.writeText(box.textContent).then(done, done); } catch (e) { done(); } });
    function upd() {
      const V_ = st.area * st.ht;
      const nc = { prod: 'NC 20–25', mix: 'NC 15–20', imm: 'NC 15–20', master: 'NC 15', track: 'NC 15–20', voice: 'NC 15' }[st.use];
      const srcL = { quiet: 80, spk: 88, sub: 98, amp: 105, drum: 110 }[st.src];
      const allow = { det: 50, wall: 35, apt: 30, com: 38 }[st.nb] - (st.hours === 'night' ? 8 : st.hours === 'eve' ? 3 : 0);
      const need = Math.max(25, srcL - allow);
      const isoWord = need <= 45 ? 'ordinary good construction with sealed doors' : need <= 55 ? 'a heavy decoupled lining or double wall, and a sound-rated door' : need <= 65 ? 'a room-within-a-room with a sound lock' : 'a floated room-within-a-room, sound lock and specialist advice';
      let rt = 0.25 * Math.cbrt(V_ / 100); rt *= { prod: 1.1, mix: 1, imm: 0.9, master: 1, track: 1.9, voice: 0.7 }[st.use] * { dead: 0.85, bal: 1, live: 1.2 }[st.live]; rt = clamp(rt, 0.15, 1.2);
      const lowT = { tight: 'bass decay kept short: aim for the lowest octaves to decay no more than about 1.5× the mid-band time', bal: 'bass decay no more than about twice the mid-band time, with no single mode ringing on', big: 'a fuller low end is accepted, but individual modes must still be damped so notes stay even' }[st.low];
      const risks = [];
      if (st.ht < 2.5) risks.push([9, 'Low ceiling: little depth for a ceiling cloud and bass trapping, and a strong floor-to-ceiling mode. Keep the isolation ceiling as thin as it can honestly be.']);
      if (need > 60 && st.nb === 'apt') risks.push([10, 'Very high isolation is needed in an apartment. Structure-borne sound through the slab may make this goal impossible at any sensible cost — say so now.']);
      if (need > 55 && st.bud === 'low') risks.push([9, 'The isolation target and the budget do not match. Either the loudest activity, the hours or the budget has to change.']);
      if (st.use === 'imm' && (st.area < 18 || st.ht < 2.6)) risks.push([8, 'The room is small for an immersive layout: speaker distances and angles will be compromised and height speakers will be close to the ears.']);
      if (st.time === 'rush') risks.push([7, 'A short timeline pushes trades to close walls before inspection and to skip drying and curing time. Agree hold points before work starts.']);
      if (st.area < 12 && (st.use === 'mix' || st.use === 'master')) risks.push([8, 'A very small room for critical work: bass problems will dominate and need deep trapping that eats floor area.']);
      if (st.day && need > 50) risks.push([6, 'Windows are the weak link at this isolation level. Budget for a double-window assembly or accept a smaller window.']);
      if (st.video) risks.push([4, 'Filming needs clean sightlines, quiet lighting and finishes that look good on camera — decide this before treatment is drawn.']);
      if (st.src === 'drum' || st.src === 'sub' || st.src === 'amp') risks.push([6, 'Loud low-frequency sources travel through structure. Floor treatment and flanking details matter more than wall thickness.']);
      if (st.bud === 'low') risks.push([5, 'With a tight budget, protect the invisible work (sealing, ventilation, bass control) and simplify the finishes.']);
      risks.push([1, 'Scope creep: write down what is not included, and agree how changes are priced.']);
      risks.sort((a, b) => b[0] - a[0]);
      const useName = { prod: 'Writing and production room', mix: 'Stereo mix room', imm: 'Immersive mix room', master: 'Mastering room', track: 'Tracking room', voice: 'Voice room' }[st.use];
      const layout = [st.use === 'track' ? 'Variable acoustics: movable absorbers or curtains so the room can be livelier or drier.' : 'Symmetrical about the listening axis; speakers firing down the long dimension.',
        st.use === 'imm' ? 'Plan every speaker position, cable route and hidden cavity before the walls are drawn.' : 'Treatment depth reserved first on the rear wall and in the corners.',
        st.day ? 'Keep the window; place it symmetrically or outside the first-reflection zones.' : 'No window needed: use the wall depth for treatment.',
        st.video ? 'Camera positions and a clean background wall marked on the plan.' : null].filter(Boolean);
      box.textContent = [`DESIGN BRIEF — ${useName}`, `Room: ${fmt(st.area, 0)} m² × ${fmt(st.ht, 2)} m high (about ${fmt(V_, 0)} m³)`, `Hours: ${{ day: 'daytime', eve: 'days and evenings', night: 'any hour' }[st.hours]} · Neighbour: ${{ det: 'detached', wall: 'shared wall', apt: 'apartment', com: 'commercial tenants' }[st.nb]}`, '',
        'TARGET SHEET', `• Background noise: ${nc} with ventilation running`, `• Isolation: roughly ${fmt(need, 0)} dB level difference to the neighbour — typically ${isoWord}`, `• Mid-band decay time: ${fmt(rt * 0.85, 2)}–${fmt(rt * 1.15, 2)} s, even from band to band`, `• Low end: ${lowT}`, `• Early reflections: ${st.use === 'track' || st.use === 'voice' ? 'no flutter echo; no strong single reflection at microphone positions' : 'at least 10 dB below the direct sound for the first 15–20 ms at the listening position'}`, '',
        'LAYOUT NOTES', ...layout.map((s) => '• ' + s), '', 'TOP THREE RISKS', ...risks.slice(0, 3).map((r, i) => `${i + 1}. ${r[1]}`), '', 'These are starting targets to discuss, not guarantees. They are confirmed or revised after the site survey.'].join('\n');
      out.innerHTML = A.statBox('Noise target', nc, 'ventilation on') + A.statBox('Isolation needed', '≈ ' + fmt(need, 0) + ' dB', isoWord, need > 60 ? 'bad' : need > 50 ? '' : 'good') + A.statBox('Decay target', fmt(rt, 2) + ' s', 'mid-band, ±15 %');
      tip.innerHTML = callout(need > 60 ? 'warn' : 'mentor', need > 60 ? '<b>Have the hard conversation first.</b> This brief asks for more isolation than most buildings can give without major construction. Offer the client three honest options: reduce the loudest activity, change the hours, or move the room.' : '<b>Read the brief back to the client.</b> Ask "is this the room you meant?" before drawing anything. Most expensive mistakes are misunderstandings, not physics.');
    }
    upd();
  };

  /* ======================================================================
     6. Budget tiers — where the money goes
     ====================================================================== */
  const CATS = [['shell', 'Isolation shell (walls, floor, ceiling)', 30, 45000], ['door', 'Doors, windows, sound lock', 10, 15000], ['hvac', 'Ventilation and HVAC', 13, 20000], ['treat', 'Acoustic treatment', 14, 20000], ['fin', 'Finishes and fabric', 9, 12000], ['furn', 'Furniture and joinery', 6, 8000], ['elec', 'Electrical and tie-lines', 6, 6000], ['cont', 'Contingency', 12, 0]];
  V.budgetTiers = function (host) {
    const st = A.controls(host, [
      { key: 'bud', label: 'Construction budget (not equipment)', type: 'range', min: Math.log10(2e5), max: Math.log10(3e7), step: 0.01, value: Math.log10(2e6), fmt: (v) => lakh(P10(v)) },
      { key: 'area', label: 'Room floor area', type: 'range', min: 8, max: 120, step: 1, value: 20, unit: 'm²' },
      ...CATS.map((c) => ({ key: c[0], label: c[1], type: 'range', min: 0, max: 45, step: 1, value: c[2], fmt: (v) => v + ' parts' })),
    ], () => { cv.redraw(); upd(); });
    const sat = (x) => 1 - Math.exp(-1.6 * x);
    function model() {
      const B = P10(st.bud), tot = CATS.reduce((a, c) => a + st[c[0]], 0) || 1; const sh = {}, per = {}, r = {};
      CATS.forEach((c) => { sh[c[0]] = st[c[0]] / tot; per[c[0]] = (B * sh[c[0]]) / st.area; r[c[0]] = c[3] ? sat(per[c[0]] / c[3]) : 0; });
      const iso = 0.5 * Math.min(r.shell, r.door) + 0.25 * (r.shell + r.door);
      const noise = 0.6 * Math.min(r.hvac, iso + 0.1) + 0.4 * r.hvac;
      const low = 0.8 * r.treat + 0.2 * r.shell, finish = 0.65 * r.fin + 0.35 * r.furn;
      return { B, sh, per, r, m: [['Isolation', iso], ['Noise floor', noise], ['Low-end control', low], ['Finish quality', finish]] };
    }
    const cv = A.canvas(host, {
      height: 300, caption: 'Top: how the budget is shared. Below: the forecast for four outcomes, with markers for the good, better and best tiers. Illustrative model.',
      draw(ctx, w, h) {
        const M = model(); const x0 = 12, x1 = w - 12; let x = x0; const cols = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'accent2', 'muted'].map(css);
        CATS.forEach((c, i) => { const ww = (x1 - x0) * M.sh[c[0]]; rr(ctx, x, 10, Math.max(0, ww - 1), 26, 3, cols[i]); if (ww > 34) txt(ctx, Math.round(M.sh[c[0]] * 100) + '%', x + ww / 2, 27, { size: 10, bold: true, align: 'center', color: css('bg') }); x += ww; });
        const lw = w < 460 ? 2 : 4; let lx = x0, ly = 52;
        CATS.forEach((c, i) => { const name = c[1].split(' (')[0]; ctx.font = FONT(10); const tw = ctx.measureText(name).width + 22; if (lx + tw > x1) { lx = x0; ly += 15; } rr(ctx, lx, ly - 8, 9, 9, 2, cols[i]); txt(ctx, name, lx + 13, ly, { size: 10, color: css('muted') }); lx += tw; });
        const top = ly + 22, bh = Math.min(34, (h - top - 26) / 4 - 10), lab = w < 460 ? 96 : 130, bx0 = x0 + lab, bw = x1 - bx0 - 8;
        [0.35, 0.6, 0.8].forEach((tv, i) => { const tx = bx0 + bw * tv; line(ctx, tx, top - 4, tx, top + 4 * (bh + 10) - 6, css('muted'), 1, [3, 3]); txt(ctx, ['good', 'better', 'best'][i], tx, h - 8, { size: 10, align: 'center', color: css('muted') }); });
        M.m.forEach(([n, v], i) => { const y = top + i * (bh + 10); txt(ctx, n, x0, y + bh / 2 + 4, { bold: true, size: w < 460 ? 10.5 : 12 }); rr(ctx, bx0, y, bw, bh, 5, css('panel2'), css('line'), 1); rr(ctx, bx0, y, bw * clamp(v, 0.01, 1), bh, 5, v < 0.35 ? css('bad') : v < 0.6 ? css('c3') : css('good')); });
      },
    });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const M = model(); const tier = (v) => (v >= 0.8 ? 'best' : v >= 0.6 ? 'better' : v >= 0.35 ? 'good' : 'below good');
      out.innerHTML = A.statBox('Budget per m²', inr(M.B / st.area), 'construction only') + M.m.map(([n, v]) => A.statBox(n, tier(v), Math.round(v * 100) + ' / 100', v < 0.35 ? 'bad' : v >= 0.6 ? 'good' : '')).join('');
      const W = [];
      if (M.sh.cont < 0.08) W.push('Contingency is under 8 %. Hidden conditions in existing buildings almost always appear — hold back 10–15 %.');
      if (M.r.hvac < 0.3 && M.r.shell > 0.5) W.push('You are building a quiet shell and then putting a noisy, starved ventilation system inside it. The room will be silent only when the air is off.');
      if (M.r.door < 0.3 && M.r.shell > 0.5) W.push('A heavy wall with a weak door performs like the door. Move money from the shell to the door, window and sound lock.');
      if (M.r.treat < 0.3) W.push('Treatment is starved: the room may be isolated but will not sound controlled, especially in the bass.');
      if (M.r.fin > 0.75 && (M.r.treat < 0.5 || M.r.shell < 0.5)) W.push('More is going on what you see than on what you hear. Simplify finishes before cutting the invisible work.');
      if (M.r.elec < 0.25) W.push('Electrical and tie-line money is thin. Cheap wiring is hard to fix after the fabric is on.');
      if (M.B / st.area < 25000) W.push('Below roughly ₹25,000 per m² a full isolated room is unlikely. Consider a treatment-only project, or a smaller room built properly.');
      tip.innerHTML = W.length ? callout('warn', '<b>Check this split:</b><ul style="margin:.3em 0 0 1.1em;padding:0">' + W.map((s) => `<li>${s}</li>`).join('') + '</ul>') + moneyNote : callout('mentor', '<b>A balanced split.</b> Present it to the client as three columns — good, better, best — and let them choose what to trade. Spend first on what cannot be changed later: the shell, the doors and the air.') + moneyNote;
    }
    upd();
  };

  /* ======================================================================
     7. Stage planner — Gantt, hold points and hours
     ====================================================================== */
  const PST = ['Brief and site survey', 'Concept options', 'Schematic design', 'Detailed design', 'Construction drawings and specification', 'Tender support', 'Construction and inspections', 'Commissioning and hand-over'];
  const PSIZE = { small: [[1, 1, 2, 2, 2, 1, 8, 1], [10, 12, 18, 28, 30, 6, 24, 12]], multi: [[2, 2, 3, 4, 4, 2, 16, 2], [18, 22, 34, 52, 56, 12, 46, 22]], fac: [[3, 3, 5, 8, 8, 4, 36, 3], [36, 48, 76, 120, 130, 26, 110, 48]] };
  V.stagePlanner = function (host) {
    const st = A.controls(host, [
      { key: 'size', label: 'Project size', type: 'select', value: 'small', options: [['small', 'One room (home or project studio)'], ['multi', 'Two or three rooms (small commercial)'], ['fac', 'Multi-room facility']] },
      { key: 'rate', label: 'Consultant hourly rate (your own figure)', type: 'range', min: 500, max: 10000, step: 100, value: 2000, fmt: (v) => inr(v) + ' / h' },
      { key: 'iso', label: 'Isolation shell is in scope', type: 'check', value: true },
      { key: 'hvac', label: 'Ventilation / HVAC acoustic design in scope', type: 'check', value: true },
      { key: 'furn', label: 'Custom furniture design in scope', type: 'check', value: false },
      { key: 'av', label: 'Wiring and system integration design in scope', type: 'check', value: false },
      { key: 'site', label: 'Regular site inspections in scope', type: 'check', value: true },
    ], () => { cv.redraw(); upd(); });
    function model() {
      const [d, hh] = PSIZE[st.size]; const dur = d.slice(), hrs = hh.slice();
      if (!st.iso) { [3, 4].forEach((i) => (hrs[i] *= 0.65)); dur[6] *= 0.5; hrs[6] *= 0.6; }
      if (st.hvac) { hrs[2] *= 1.15; hrs[3] *= 1.2; hrs[4] *= 1.15; }
      if (st.furn) { hrs[1] *= 1.15; hrs[3] *= 1.2; hrs[4] *= 1.1; }
      if (st.av) { hrs[3] *= 1.2; hrs[4] *= 1.2; hrs[7] *= 1.4; }
      if (!st.site) hrs[6] *= 0.25;
      const hold = []; if (st.site) { if (st.iso) hold.push([0.25, 'Shell framed, before boards close the cavity'], [0.45, 'Floor and ceiling isolation, before loading']); hold.push([0.62, 'Services first fix, before linings'], [0.8, 'Sample fabric bay and one finished door'], [0.97, 'Pre-commissioning walk-round']); }
      return { dur, hrs, hold, weeks: dur.reduce((a, b) => a + b, 0), H: hrs.reduce((a, b) => a + b, 0) };
    }
    const cv = A.canvas(host, {
      height: 330, animate: true, caption: 'A stage-by-stage programme. Diamonds are hold points: work must stop for inspection before it is covered up.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t); const M = model(); const lab = w < 480 ? 0 : 210, x0 = 10 + lab, x1 = w - 10, top = 30, rh = (h - top - 14) / 8; let acc = 0; const sx = (wk) => x0 + (wk / M.weeks) * (x1 - x0);
        const stepW = M.weeks > 40 ? 8 : M.weeks > 20 ? 4 : 2;
        for (let wk = 0; wk <= M.weeks; wk += stepW) { line(ctx, sx(wk), top - 6, sx(wk), h - 10, css('line'), 1); txt(ctx, 'wk ' + wk, sx(wk), 14, { size: 9.5, color: css('muted'), align: !wk ? 'left' : sx(wk) > x1 - 16 ? 'right' : 'center' }); }
        const now = ((t * 0.07) % 1) * M.weeks;
        M.dur.forEach((d, i) => {
          const y = top + i * rh, xa = sx(acc), xb = sx(acc + d), active = now >= acc && now < acc + d;
          rr(ctx, xa, y + 4, Math.max(5, xb - xa), rh - 9, 4, i === 6 ? css('c3') : css('accent'), active ? css('text') : null, 2);
          if (lab) txt(ctx, PST[i], 10, y + rh / 2 + 4, { size: 11, bold: active }); else { ctx.font = FONT(10); const tw = ctx.measureText(PST[i]).width; txt(ctx, PST[i], xb + tw + 8 < x1 ? xb + 5 : xa - 5, y + rh / 2 + 4, { size: 10, align: xb + tw + 8 < x1 ? 'left' : 'right', bold: active }); }
          if (i === 6) M.hold.forEach(([f]) => { const hx = xa + (xb - xa) * f, hy = y + rh / 2; ctx.save(); ctx.translate(hx, hy); ctx.rotate(Math.PI / 4); ctx.fillStyle = css('bad'); ctx.strokeStyle = css('bg'); ctx.lineWidth = 1.5; ctx.fillRect(-5, -5, 10, 10); ctx.strokeRect(-5, -5, 10, 10); ctx.restore(); });
          acc += d;
        });
        line(ctx, sx(now), top - 4, sx(now), h - 10, css('text'), 1.5, [4, 3]);
      },
    });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const body = el('div'); host.appendChild(body);
    const DELIV = ['Signed brief, survey drawings, noise survey', 'Two or three layout options with pros and cons', 'Chosen layout, wall/floor/ceiling types, forecast metrics', 'Treatment layout, HVAC routes, door and window schedule', 'Full drawing set, details, specification, schedule of finishes, quantities', 'Answers to contractor questions, comparison of quotes', 'Inspection notes with photos at each hold point', 'Commissioning report, as-built drawings, user guide'];
    function upd() {
      const M = model();
      out.innerHTML = A.statBox('Programme', fmt(M.weeks, 0) + ' weeks', fmt(M.weeks / 4.35, 1) + ' months') + A.statBox('Consultant time', fmt(M.H, 0) + ' h', 'spread over the project') + A.statBox('Illustrative fee', lakh(M.H * st.rate), 'hours × your rate — not a quotation') + A.statBox('Hold points', String(M.hold.length), st.site ? 'inspections before cover-up' : 'none: defects will be hidden', st.site ? 'good' : 'bad');
      body.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Stage</th><th>Weeks</th><th>Hours</th><th>Deliverable</th></tr></thead><tbody>' + PST.map((s, i) => `<tr><td><b>${s}</b></td><td>${fmt(M.dur[i], 0)}</td><td>${fmt(M.hrs[i], 0)}</td><td>${DELIV[i]}</td></tr>`).join('') + '</tbody></table></div>' + (M.hold.length ? callout('mentor', '<b>Hold points:</b> ' + M.hold.map((x) => x[1]).join(' · ')) : callout('warn', '<b>No site inspections in scope.</b> Most acoustic failures are construction defects that are invisible once the boards and fabric are on. If the client will not pay for inspections, write that risk into the agreement.')) + '<p class="small muted" style="margin:.4em 0 0">Durations and hours are illustrative. Fees vary widely with country, scope and liability — get local advice before quoting.</p>';
    }
    upd();
  };

  /* ======================================================================
     8. Forecast versus measured — honest ranges and what defects cost
     ====================================================================== */
  const FB = [63, 125, 250, 500, 1000, 2000, 4000];
  const WALLS = { stud: ['Single stud wall, two boards each side', [18, 30, 40, 47, 52, 52, 48]], dbl: ['Double stud wall, two boards each side', [28, 42, 52, 60, 65, 66, 62]], mas: ['Masonry wall with independent lining', [34, 44, 54, 62, 68, 70, 70]], rir: ['Room within a room on a floated floor', [42, 55, 65, 72, 78, 80, 80]] };
  const DEF = [['gap', 'Unsealed perimeter gap', (tl) => tl.map((v, i) => -10 * Math.log10(P10(-v / 10) + P10(-(36 - i * 1.2) / 10)))], ['sock', 'Back-to-back sockets', (tl) => tl.map((v, i) => -10 * Math.log10(P10(-v / 10) + P10(-(50 - i) / 10)))], ['bridge', 'Rigid bridge across the isolation', (tl) => tl.map((v, i) => v - [9, 10, 9, 7, 5, 4, 3][i])], ['duct', 'Rigid duct straight through the wall', (tl) => tl.map((v, i) => -10 * Math.log10(P10(-v / 10) + P10(-[30, 34, 38, 40, 42, 44, 46][i] / 10)))], ['wool', 'Cavity insulation missing or squashed', (tl) => tl.map((v, i) => v - [1, 4, 6, 5, 4, 3, 2][i])]];
  V.forecastVsMeasured = function (host) {
    const st = A.controls(host, [
      { key: 'wall', label: 'Construction forecast', type: 'select', value: 'dbl', options: Object.entries(WALLS).map(([k, v]) => [k, v[0]]) },
      { key: 'care', label: 'Workmanship', type: 'range', min: 0, max: 1, step: 0.05, value: 0.8, fmt: (v) => (v > 0.75 ? 'careful' : v > 0.4 ? 'average' : 'rushed') },
      ...DEF.map((d) => ({ key: d[0], label: d[1], type: 'check', value: false })),
      { key: 'tr1', label: 'Absorber wool compressed behind the fabric', type: 'check', value: false },
      { key: 'tr2', label: 'Fabric too dense, or painted over', type: 'check', value: false },
    ], () => { cv.redraw(); upd(); });
    function model() {
      const base = WALLS[st.wall][1]; const lo = base.map((v, i) => v - (i < 2 ? 6 : 3.5)), hi = base.map((v, i) => v + (i < 2 ? 3 : 2));
      let m = base.map((v, i) => v - (1 - st.care) * (i < 2 ? 4 : 3) + Math.sin(i * 2.3 + 1) * 0.8);
      DEF.forEach((d) => { if (st[d[0]]) m = d[2](m); });
      const rt0 = [0.42, 0.34, 0.3, 0.28, 0.27, 0.26, 0.25]; const rlo = rt0.map((v, i) => v * (i < 2 ? 0.75 : 0.85)), rhi = rt0.map((v, i) => v * (i < 2 ? 1.35 : 1.15));
      let r = rt0.map((v, i) => v * (1 + (1 - st.care) * 0.12 + Math.sin(i * 1.7) * 0.03));
      if (st.tr1) r = r.map((v, i) => v * [1.45, 1.4, 1.25, 1.1, 1.03, 1, 1][i]);
      if (st.tr2) r = r.map((v, i) => v * [1, 1, 1.03, 1.1, 1.25, 1.45, 1.6][i]);
      const avg = (a) => a.slice(1, 6).reduce((x, y) => x + y, 0) / 5;
      return { lo, hi, m, rlo, rhi, r, pAvg: [avg(lo), avg(hi)], mAvg: avg(m), rIn: r.every((v, i) => v <= rhi[i] && v >= rlo[i]), tIn: m.every((v, i) => v >= lo[i] - 0.01) };
    }
    const cv = A.canvas(host, {
      height: 420, caption: 'Shaded bands are the honest forecast range; the line with dots is what the finished room measures. Upper graph: isolation. Lower graph: decay time.',
      draw(ctx, w, h) {
        const M = model(); const hh = h / 2;
        const panel = (y0, yr, lo, hi, m, lab, f) => {
          ctx.save(); ctx.translate(0, y0);
          const ax = A.axes(ctx, w, hh, { x: { min: 50, max: 5000, log: true, label: 'Frequency (Hz)', ticks: FB, fmt: (v) => (v >= 1000 ? v / 1000 + 'k' : v) }, y: { min: yr[0], max: yr[1], label: lab } });
          ctx.beginPath(); FB.forEach((fq, i) => (i ? ctx.lineTo(ax.X(fq), ax.Y(clamp(hi[i], yr[0], yr[1]))) : ctx.moveTo(ax.X(fq), ax.Y(clamp(hi[i], yr[0], yr[1]))))); for (let i = FB.length - 1; i >= 0; i--) ctx.lineTo(ax.X(FB[i]), ax.Y(clamp(lo[i], yr[0], yr[1]))); ctx.closePath(); ctx.globalAlpha = 0.25; ctx.fillStyle = css('accent'); ctx.fill(); ctx.globalAlpha = 1;
          A.plotLine(ctx, ax, FB.map((fq, i) => [fq, clamp(m[i], yr[0], yr[1])]), css('text'), 2.5);
          FB.forEach((fq, i) => { const bad = f(m[i], lo[i], hi[i]); ctx.beginPath(); ctx.arc(ax.X(fq), ax.Y(clamp(m[i], yr[0], yr[1])), 4.5, 0, TAU); ctx.fillStyle = bad ? css('bad') : css('good'); ctx.fill(); });
          ctx.restore();
        };
        panel(0, [10, 90], M.lo, M.hi, M.m, 'Isolation (dB)', (v, lo) => v < lo);
        panel(hh, [0, 0.8], M.rlo, M.rhi, M.r, 'Decay time (s)', (v, lo, hi) => v > hi || v < lo);
      },
    });
    host.appendChild(A.legend([[css('accent'), 'forecast range'], [css('text'), 'measured'], [css('good'), 'inside the range'], [css('bad'), 'outside the range']]));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const M = model(); const lost = (M.pAvg[0] + M.pAvg[1]) / 2 - M.mAvg; const nd = DEF.filter((d) => st[d[0]]).length;
      out.innerHTML = A.statBox('Forecast (125 Hz–2 kHz average)', fmt(M.pAvg[0], 0) + '–' + fmt(M.pAvg[1], 0) + ' dB', 'a range, never one number') + A.statBox('Measured', fmt(M.mAvg, 0) + ' dB', M.tIn ? 'inside the forecast' : 'below the forecast', M.tIn ? 'good' : 'bad') + A.statBox('Lost to defects', fmt(Math.max(0, lost), 0) + ' dB', lost > 9 ? 'sounds more than twice as loud next door' : lost > 4 ? 'clearly audible loss' : 'within normal tolerance', lost > 4 ? 'bad' : 'good') + A.statBox('Decay time', M.rIn ? 'as forecast' : 'out of range', st.tr1 ? 'bass and low-mid ring on' : st.tr2 ? 'treble rings on: fabric is reflecting' : 'even across the bands', M.rIn ? 'good' : 'bad');
      const msg = nd === 0 && !st.tr1 && !st.tr2 ? (st.care < 0.4 ? 'Rushed work alone, with no single obvious defect, already pushes the result toward the bottom of the range. That is why forecasts are ranges and why inspections are worth paying for.' : 'With careful work and no defects the measurement lands inside the forecast band. Quote the client the band — and aim your design so that even its lower edge meets the brief.') : st.gap || st.duct ? 'A leak sets a ceiling on isolation that no amount of wall mass can lift: the heavier the wall, the more decibels one small gap costs. Notice how the high-performance constructions lose the most.' : st.bridge ? 'A rigid bridge turns a decoupled construction back into a single wall, and it hurts most at low frequencies — exactly where studios need help.' : 'Each defect costs a few decibels on its own and they add up. None of them is visible once the room is finished — only a measurement, or an inspection before closing, reveals them.';
      tip.innerHTML = callout(nd || st.tr1 || st.tr2 ? 'warn' : 'mentor', '<b>What this shows:</b> ' + msg);
    }
    upd();
  };

  /* ======================================================================
     9. Drawing set — annotated mini drawings
     ====================================================================== */
  const SHEETS = {
    plan: ['Plan', [[0.12, 0.2, 'Double wall with air gap', 'Two independent leaves with an unbridged cavity. The note gives the wall type code; the build-up is in the wall-type detail, not repeated on the plan.'], [0.5, 0.17, 'Speakers and listening axis', 'A centre line fixes symmetry. Speaker and ear positions are dimensioned from finished surfaces so the builder can set out the treatment around them.'], [0.86, 0.72, 'Sound lock and door swings', 'Two doors with a small absorbent lobby. Swings are drawn so that both doors can never be open in a straight line of sight.'], [0.5, 0.86, 'Rear wall treatment depth', 'The hatched zone is reserved depth for bass trapping. Showing depth on the plan stops furniture, sockets and ducts being planned into it.'], [0.16, 0.6, 'Dimensions to finished faces', 'Critical dimensions are to finished faces, with tolerances. Acoustic drawings state which dimensions matter and which can float.']]],
    sect: ['Section', [[0.5, 0.12, 'Isolation ceiling on hangers', 'An independent ceiling carried on resilient hangers, with the load and deflection of the hangers stated so the right ones are bought.'], [0.5, 0.3, 'Ceiling cloud and cavity', 'The cloud hangs below the isolation ceiling. Depth, air gap and what is above it (lights, ducts) are all shown in section.'], [0.14, 0.52, 'Wall build-up', 'Layers are drawn in order with thicknesses. The cavity insulation is drawn loose, not squashed.'], [0.5, 0.9, 'Floated floor and perimeter gap', 'A floor on a resilient layer, with a soft perimeter strip so the floor never touches the walls. The skirting detail keeps that gap open.'], [0.86, 0.3, 'Duct with lined bends', 'Ventilation enters through a lined, bent path with a flexible connector, so the duct does not undo the wall.']]],
    elev: ['Treatment elevation', [[0.2, 0.3, 'Fabric module lines', 'Vertical joints are set out to a regular module that suits the fabric width. The joints are designed, not left to chance.'], [0.5, 0.5, 'Depth behind the fabric', 'Each bay is tagged with what is behind it: depth, material and air gap. The fabric makes all bays look the same; the tags show they are not.'], [0.8, 0.3, 'Reflective or slatted bay', 'Not every bay absorbs. Some are left reflective or slatted to keep the room alive; these are tagged too.'], [0.5, 0.85, 'Skirting, sockets and access', 'Sockets and tie-line plates are set in the skirting zone or in solid bays, never cut into the middle of a stretched fabric panel.'], [0.12, 0.72, 'Removable panel', 'One marked bay opens for access to services and for future changes to the treatment.']]],
    rcp: ['Reflected ceiling plan', [[0.5, 0.42, 'Cloud over the listening area', 'The cloud is positioned from the listening point, covering the ceiling reflection zone with margin on every side.'], [0.2, 0.2, 'Lights and their noise', 'Fittings are quiet types with remote drivers where possible, and are set out on the same grid as the clouds.'], [0.82, 0.2, 'Supply and return air', 'Air terminals are large, slow and placed away from the listening position; supply and return are on opposite sides so air sweeps the room.'], [0.5, 0.86, 'Height speakers or future provision', 'Positions for ceiling speakers are coordinated now, with backing and cable routes, even if they are fitted later.'], [0.84, 0.66, 'Access hatch', 'Somebody must reach the damper, the junction box and the hangers after hand-over.']]],
    door: ['Door detail', [[0.3, 0.3, 'Solid heavy leaf', 'The leaf construction and weight are stated. A drawing that just says "acoustic door" guarantees a hollow one.'], [0.62, 0.22, 'Double seals at the frame', 'Two compression seals in the same plane all round, adjustable so they can be set after hanging.'], [0.5, 0.88, 'Threshold or drop seal', 'The bottom edge is the usual leak. The detail shows a raised threshold or an automatic drop seal meeting a flat hard strip.'], [0.84, 0.5, 'Frame packed and sealed', 'The gap between frame and wall is packed solid and sealed both sides. The architrave hides it; it does not seal it.'], [0.14, 0.6, 'Heavy hinges, closer, latch', 'Hardware is rated for the leaf weight, and the latch pulls the door onto its seals.']]],
  };
  V.drawingSet = function (host) {
    let note = 0;
    const st = A.controls(host, [
      { key: 'sheet', label: 'Drawing sheet', type: 'select', value: 'plan', options: Object.entries(SHEETS).map(([k, v]) => [k, v[0]]) },
      { key: 'note', label: 'Callout', type: 'range', min: 1, max: 5, step: 1, value: 1, fmt: (v) => 'note ' + v },
    ], () => { note = st.note - 1; cv.redraw(); upd(); });
    const geo = { w: 600, h: 320 };
    const cv = A.canvas(host, {
      height: 330, caption: 'A miniature drawing set for a small studio. Tap a numbered callout, or use the slider, to read what the note is telling the builder.',
      onPointer(p) { if (p.type !== 'pointerdown') return; const cs = SHEETS[st.sheet][1]; let best = -1, bd = 36; cs.forEach((c, i) => { const d = Math.hypot(p.x - geo.x(c[0]), p.y - geo.y(c[1])); if (d < bd) { bd = d; best = i; } }); if (best >= 0) st.set('note', best + 1); },
      draw(ctx, w, h) {
        const m = 16, W = w - 2 * m, H = h - 2 * m; geo.x = (u) => m + u * W; geo.y = (v) => m + v * H; const X = geo.x, Y = geo.y, T = css('text'), Mu = css('muted'), Ac = css('accent');
        rr(ctx, m - 6, m - 6, W + 12, H + 12, 4, css('panel2'), css('line'), 1);
        const hatch = (x, y, ww, hh2, c) => { ctx.save(); ctx.beginPath(); ctx.rect(x, y, ww, hh2); ctx.clip(); ctx.strokeStyle = c; ctx.lineWidth = 1; for (let k = -hh2; k < ww + hh2; k += 7) { ctx.beginPath(); ctx.moveTo(x + k, y + hh2); ctx.lineTo(x + k + hh2, y); ctx.stroke(); } ctx.restore(); };
        const s = st.sheet;
        if (s === 'plan') {
          ctx.strokeStyle = T; ctx.lineWidth = 3; ctx.strokeRect(X(0.06), Y(0.08), X(0.76) - X(0.06), Y(0.94) - Y(0.08)); ctx.lineWidth = 1.5; ctx.strokeRect(X(0.085), Y(0.115), X(0.735) - X(0.085), Y(0.905) - Y(0.115));
          hatch(X(0.09), Y(0.78), X(0.73) - X(0.09), Y(0.9) - Y(0.78), Ac); hatch(X(0.09), Y(0.12), X(0.16) - X(0.09), Y(0.24) - Y(0.12), Ac); hatch(X(0.66), Y(0.12), X(0.73) - X(0.66), Y(0.24) - Y(0.12), Ac);
          line(ctx, X(0.41), Y(0.06), X(0.41), Y(0.96), Mu, 1, [8, 3, 2, 3]);
          rr(ctx, X(0.27), Y(0.2), X(0.05), Y(0.07) - Y(0), 2, T); rr(ctx, X(0.5), Y(0.2), X(0.05), Y(0.07) - Y(0), 2, T);
          ctx.beginPath(); ctx.arc(X(0.41), Y(0.52), 7, 0, TAU); ctx.fillStyle = Ac; ctx.fill(); line(ctx, X(0.295), Y(0.25), X(0.41), Y(0.52), Mu, 1, [3, 3]); line(ctx, X(0.525), Y(0.25), X(0.41), Y(0.52), Mu, 1, [3, 3]);
          rr(ctx, X(0.3), Y(0.36), X(0.22) - X(0), Y(0.08) - Y(0), 3, null, T, 1.5);
          ctx.strokeStyle = T; ctx.lineWidth = 3; ctx.strokeRect(X(0.76), Y(0.56), X(0.94) - X(0.76), Y(0.94) - Y(0.56));
          ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(0.76), Y(0.66), Y(0.16) - Y(0), -Math.PI / 2, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(X(0.94), Y(0.9), Y(0.16) - Y(0), Math.PI, Math.PI * 1.5); ctx.stroke();
          line(ctx, X(0.06), Y(0.99), X(0.76), Y(0.99), Mu, 1); txt(ctx, '4.20 m finished', X(0.41), Y(0.99) - 3, { size: 9, align: 'center', color: Mu });
        } else if (s === 'sect') {
          ctx.strokeStyle = T; ctx.lineWidth = 4; ctx.strokeRect(X(0.05), Y(0.04), X(0.95) - X(0.05), Y(0.98) - Y(0.04));
          ctx.lineWidth = 2; ctx.strokeRect(X(0.1), Y(0.18), X(0.9) - X(0.1), Y(0.9) - Y(0.18));
          for (let k = 0; k < 6; k++) { const hx = X(0.18 + k * 0.128); line(ctx, hx, Y(0.04), hx, Y(0.18), Mu, 1.5); ctx.beginPath(); ctx.arc(hx, Y(0.11), 3, 0, TAU); ctx.fillStyle = Ac; ctx.fill(); }
          hatch(X(0.3), Y(0.27), X(0.7) - X(0.3), Y(0.34) - Y(0.27), Ac); ctx.strokeStyle = T; ctx.lineWidth = 1; ctx.strokeRect(X(0.3), Y(0.27), X(0.7) - X(0.3), Y(0.34) - Y(0.27)); line(ctx, X(0.34), Y(0.18), X(0.34), Y(0.27), Mu, 1); line(ctx, X(0.66), Y(0.18), X(0.66), Y(0.27), Mu, 1);
          hatch(X(0.05), Y(0.18), X(0.1) - X(0.05), Y(0.9) - Y(0.18), Mu);
          rr(ctx, X(0.1), Y(0.86), X(0.8) - X(0), Y(0.04) - Y(0), 0, null, T, 2); for (let k = 0; k < 9; k++) rr(ctx, X(0.13 + k * 0.09), Y(0.9), 12, Y(0.03) - Y(0), 2, Ac);
          ctx.strokeStyle = T; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(1.0), Y(0.24)); ctx.lineTo(X(0.86), Y(0.24)); ctx.lineTo(X(0.86), Y(0.34)); ctx.lineTo(X(0.78), Y(0.34)); ctx.stroke(); ctx.beginPath(); ctx.moveTo(X(1.0), Y(0.3)); ctx.lineTo(X(0.9), Y(0.3)); ctx.lineTo(X(0.9), Y(0.4)); ctx.lineTo(X(0.78), Y(0.4)); ctx.stroke();
          ctx.beginPath(); ctx.arc(X(0.5), Y(0.62), 7, 0, TAU); ctx.fillStyle = Ac; ctx.fill(); txt(ctx, 'ear height', X(0.5) + 10, Y(0.62) + 4, { size: 9, color: Mu });
        } else if (s === 'elev') {
          ctx.strokeStyle = T; ctx.lineWidth = 2.5; ctx.strokeRect(X(0.04), Y(0.08), X(0.96) - X(0.04), Y(0.94) - Y(0.08));
          const tags = ['150 mm wool + 50 gap', '300 mm trap', '100 mm wool', 'slats, reflective', '100 mm wool', '300 mm trap'];
          for (let k = 0; k < 6; k++) { const bx = X(0.04 + k * 0.1533), bw = X(0.1533) - X(0); if (k) line(ctx, bx, Y(0.08), bx, Y(0.8), T, 1); if (k === 3) for (let q = 1; q < 7; q++) line(ctx, bx + (bw * q) / 7, Y(0.1), bx + (bw * q) / 7, Y(0.78), Mu, 2); else hatch(bx + 4, Y(0.4), bw - 8, Y(0.2) - Y(0), k % 2 ? Ac : Mu); ctx.save(); ctx.translate(bx + bw / 2, Y(0.36)); if (w < 520) ctx.rotate(-Math.PI / 2); txt(ctx, tags[k], 0, 0, { size: w < 520 ? 8.5 : 9, align: w < 520 ? 'left' : 'center', color: Mu }); ctx.restore(); }
          line(ctx, X(0.04), Y(0.8), X(0.96), Y(0.8), T, 1.5); [0.3, 0.55, 0.75].forEach((u) => rr(ctx, X(u), Y(0.83), 16, 12, 2, null, T, 1.2));
          ctx.save(); ctx.setLineDash([5, 3]); ctx.strokeStyle = css('bad'); ctx.lineWidth = 1.5; ctx.strokeRect(X(0.05), Y(0.44), X(0.14) - X(0), Y(0.34) - Y(0)); ctx.restore();
        } else if (s === 'rcp') {
          ctx.strokeStyle = T; ctx.lineWidth = 2.5; ctx.strokeRect(X(0.05), Y(0.06), X(0.95) - X(0.05), Y(0.96) - Y(0.06));
          hatch(X(0.3), Y(0.26), X(0.4) - X(0), Y(0.34) - Y(0), Ac); ctx.strokeStyle = T; ctx.lineWidth = 1.5; ctx.strokeRect(X(0.3), Y(0.26), X(0.4) - X(0), Y(0.34) - Y(0));
          [[0.2, 0.2], [0.2, 0.5], [0.2, 0.8], [0.8, 0.5], [0.8, 0.8], [0.5, 0.16]].forEach(([u, v]) => { ctx.beginPath(); ctx.arc(X(u), Y(v), 5, 0, TAU); ctx.strokeStyle = T; ctx.lineWidth = 1.5; ctx.stroke(); line(ctx, X(u) - 7, Y(v), X(u) + 7, Y(v), T, 1); line(ctx, X(u), Y(v) - 7, X(u), Y(v) + 7, T, 1); });
          rr(ctx, X(0.72), Y(0.14), X(0.18) - X(0), Y(0.07) - Y(0), 2, null, T, 1.5); for (let q = 1; q < 6; q++) line(ctx, X(0.72 + q * 0.03), Y(0.14), X(0.72 + q * 0.03), Y(0.21), Mu, 1);
          rr(ctx, X(0.08), Y(0.86), X(0.18) - X(0), Y(0.07) - Y(0), 2, null, T, 1.5); line(ctx, X(0.08), Y(0.86), X(0.26), Y(0.93), Mu, 1);
          [[0.36, 0.86], [0.64, 0.86]].forEach(([u, v]) => { ctx.save(); ctx.setLineDash([3, 3]); rr(ctx, X(u) - 9, Y(v) - 9, 18, 18, 9, null, Ac, 1.5); ctx.restore(); });
          ctx.save(); ctx.setLineDash([4, 3]); rr(ctx, X(0.8), Y(0.6), X(0.09) - X(0), Y(0.12) - Y(0), 0, null, css('bad'), 1.5); ctx.restore();
          ctx.beginPath(); ctx.arc(X(0.5), Y(0.46), 4, 0, TAU); ctx.fillStyle = Mu; ctx.fill();
        } else {
          hatch(X(0.74), Y(0.1), X(0.2) - X(0), Y(0.76) - Y(0), Mu); ctx.strokeStyle = T; ctx.lineWidth = 2; ctx.strokeRect(X(0.74), Y(0.1), X(0.2) - X(0), Y(0.76) - Y(0));
          rr(ctx, X(0.62), Y(0.1), X(0.12) - X(0), Y(0.76) - Y(0), 0, css('panel'), T, 2);
          rr(ctx, X(0.1), Y(0.3), X(0.5) - X(0), Y(0.3) - Y(0), 0, null, T, 2.5); hatch(X(0.1), Y(0.3), X(0.5) - X(0), Y(0.3) - Y(0), Ac);
          [0.26, 0.6].forEach((v) => { ctx.beginPath(); ctx.arc(X(0.61), Y(v) + (v < 0.4 ? 0 : 4), 5, 0, TAU); ctx.fillStyle = css('bad'); ctx.fill(); ctx.beginPath(); ctx.arc(X(0.57), Y(v) + (v < 0.4 ? 0 : 4), 5, 0, TAU); ctx.fill(); });
          line(ctx, X(0.04), Y(0.94), X(0.96), Y(0.94), T, 3); rr(ctx, X(0.3), Y(0.9), X(0.14) - X(0), Y(0.04) - Y(0), 0, Mu); txt(ctx, 'plan view of the latch side; threshold shown below', X(0.1), Y(0.2), { size: 9, color: Mu });
          rr(ctx, X(0.06), Y(0.5), X(0.05) - X(0), Y(0.14) - Y(0), 2, T);
        }
        SHEETS[s][1].forEach((c, i) => { const cx = X(c[0]), cy = Y(c[1]), on = i === note; ctx.beginPath(); ctx.arc(cx, cy, on ? 13 : 10, 0, TAU); ctx.fillStyle = on ? Ac : css('bg'); ctx.fill(); ctx.strokeStyle = on ? css('text') : Ac; ctx.lineWidth = 2; ctx.stroke(); txt(ctx, String(i + 1), cx, cy + 4, { size: 11, bold: true, align: 'center', color: on ? css('bg') : css('text') }); });
        txt(ctx, SHEETS[s][0].toUpperCase(), X(1) - 2, Y(1) + 2, { size: 9, bold: true, align: 'right', color: Mu });
      },
    });
    const tip = el('div'); host.appendChild(tip);
    function upd() { const c = SHEETS[st.sheet][1][note] || SHEETS[st.sheet][1][0]; tip.innerHTML = callout('mentor', `<b>Note ${note + 1} — ${c[2]}.</b> ${c[3]}`); }
    upd();
  };

  /* ======================================================================
     10. Desk ergonomics and desk reflection
     ====================================================================== */
  V.deskErgo = function (host) {
    const st = A.controls(host, [
      { key: 'ht', label: 'Your height', type: 'range', min: 150, max: 200, step: 1, value: 172, unit: 'cm' },
      { key: 'pos', label: 'Working position', type: 'select', value: 'sit', options: [['sit', 'Seated'], ['stand', 'Standing']] },
      { key: 'dk', label: 'Desk top height', type: 'range', min: 60, max: 125, step: 1, value: 72, unit: 'cm' },
      { key: 'dd', label: 'Desk depth', type: 'range', min: 50, max: 130, step: 1, value: 80, unit: 'cm' },
      { key: 'sh', label: 'Speaker acoustic-centre height', type: 'range', min: 90, max: 190, step: 1, value: 122, unit: 'cm' },
      { key: 'sd', label: 'Speaker distance from your ears', type: 'range', min: 80, max: 300, step: 5, value: 140, unit: 'cm' },
      { key: 'scr', label: 'Screen size (diagonal)', type: 'range', min: 0, max: 55, step: 1, value: 27, fmt: (v) => (v ? v + ' inch' : 'no screen') },
      { key: 'tilt', label: 'Desk surface is slatted or strongly tilted', type: 'check', value: false },
    ], () => { cv.redraw(); upd(); });
    function model() {
      const H = st.ht, ear = st.pos === 'sit' ? 0.7 * H : 0.93 * H, idealDesk = st.pos === 'sit' ? 0.405 * H : 0.625 * H;
      const d = st.sd, hs = st.sh, hd = st.dk, front = 12, back = front + st.dd;
      const a = hs - hd, b = ear - hd; const xr = (d * b) / (a + b); const hit = a > 0 && b > 0 && xr >= front && xr <= Math.min(back, d);
      const direct = Math.hypot(d, hs - ear), refl = Math.hypot(d, a + b), dl = (refl - direct) / 100, ms = (dl / 343) * 1000, notch = dl > 0 ? 343 / (2 * dl) : 0;
      const sx = front + st.dd * 0.72, sH = st.scr * 2.54 * 0.49, sBot = hd + 9, sTop = sBot + sH; const lineH = ear + ((hs - ear) * sx) / d; const blocked = st.scr > 0 && sx < d && lineH < sTop + 4;
      const scrDist = sx, scrIdeal = st.scr * 2.54 * 1.1; const ang = (Math.atan2(hs - ear, d) * 180) / Math.PI;
      return { ear, idealDesk, hit, xr, ms, notch, blocked, sx, sBot, sTop, ang, scrDist, scrIdeal, front, back, lineH };
    }
    const cv = A.canvas(host, {
      height: 330, animate: true, caption: 'Side view. The solid line is the direct sound; the dashed line bounces off the desk and arrives a moment later, cancelling a band of frequencies.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t); const M = model(); const span = Math.max(st.sd + 60, 240), sc = Math.min((w - 30) / span, (h - 40) / 215), ox = 22 + 30 * sc, oy = h - 22; const X = (cm) => ox + cm * sc, Y = (cm) => oy - cm * sc; const T = css('text'), Mu = css('muted');
        line(ctx, 8, oy, w - 8, oy, T, 2);
        ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = css('good'); ctx.beginPath(); ctx.arc(X(0), Y(M.ear - 0.33 * st.ht + 0), 40 * sc, -0.9, 0.5); ctx.lineTo(X(0), Y(M.ear - 0.33 * st.ht)); ctx.fill(); ctx.globalAlpha = 0.08; ctx.beginPath(); ctx.arc(X(0), Y(M.ear - 0.33 * st.ht), 65 * sc, -0.9, 0.5); ctx.lineTo(X(0), Y(M.ear - 0.33 * st.ht)); ctx.fill(); ctx.restore();
        ctx.beginPath(); ctx.arc(X(-3), Y(M.ear), 9 * sc + 3, 0, TAU); ctx.fillStyle = Mu; ctx.fill(); line(ctx, X(-6), Y(M.ear) + 10, X(-10), Y(M.ear - 0.3 * st.ht), Mu, 6 * sc + 2);
        if (st.pos === 'sit') { line(ctx, X(-10), Y(M.ear - 0.3 * st.ht), X(18), Y(M.ear - 0.31 * st.ht), Mu, 6 * sc + 2); line(ctx, X(18), Y(M.ear - 0.31 * st.ht), X(20), Y(0), Mu, 5 * sc + 2); rr(ctx, X(-22), Y(M.ear - 0.34 * st.ht), 36 * sc, 4, 2, T); line(ctx, X(-4), Y(M.ear - 0.34 * st.ht), X(-4), Y(0), T, 2); } else line(ctx, X(-10), Y(M.ear - 0.3 * st.ht), X(-6), Y(0), Mu, 6 * sc + 2);
        rr(ctx, X(M.front), Y(st.dk), st.dd * sc, 5, 2, st.tilt ? css('c3') : T); line(ctx, X(M.front + 6), Y(st.dk), X(M.front + 6), Y(0), T, 2); line(ctx, X(M.back - 6), Y(st.dk), X(M.back - 6), Y(0), T, 2);
        line(ctx, X(M.back), Y(M.idealDesk), X(M.back) + 16, Y(M.idealDesk), css('good'), 2); txt(ctx, 'elbow height', X(M.back) + 20, Y(M.idealDesk) + 3, { size: 9, color: css('good') });
        if (st.scr) { rr(ctx, X(M.sx) - 2, Y(M.sTop), 4, (M.sTop - M.sBot) * sc, 1, M.blocked ? css('bad') : T); line(ctx, X(M.sx), Y(M.sBot), X(M.sx), Y(st.dk), T, 2); }
        const spx = X(st.sd), spy = Y(st.sh); rr(ctx, spx - 2, spy - 22 * sc, 24 * sc, 44 * sc, 3, css('panel2'), T, 2); line(ctx, spx + 12 * sc, spy + 22 * sc, spx + 12 * sc, Y(0), T, 3);
        line(ctx, spx, spy, X(0), Y(M.ear), css('accent'), 2.5);
        if (M.hit && !st.tilt) { line(ctx, spx, spy, X(M.xr), Y(st.dk), css('bad'), 2, [6, 4]); line(ctx, X(M.xr), Y(st.dk), X(0), Y(M.ear), css('bad'), 2, [6, 4]); }
        const p = (t * 0.5) % 1; ctx.beginPath(); ctx.arc(spx + (X(0) - spx) * p, spy + (Y(M.ear) - spy) * p, 4, 0, TAU); ctx.fillStyle = css('accent'); ctx.fill();
        line(ctx, X(0), Y(M.ear), X(0) + 60 * sc, Y(M.ear), Mu, 1, [2, 3]); txt(ctx, 'ear ' + fmt(M.ear, 0) + ' cm', X(0) + 4, Y(M.ear) - 14 * sc - 8, { size: 10, color: Mu });
      },
    });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const M = model(); const dErr = st.dk - M.idealDesk; const refl = M.hit && !st.tilt;
      out.innerHTML = A.statBox('Ear height', fmt(M.ear, 0) + ' cm', 'speaker is ' + (Math.abs(st.sh - M.ear) < 5 ? 'level with your ears' : fmt(Math.abs(st.sh - M.ear), 0) + ' cm ' + (st.sh > M.ear ? 'above' : 'below') + ' — tilt it ' + fmt(Math.abs(M.ang), 0) + '°'), Math.abs(st.sh - M.ear) < 12 ? 'good' : '') + A.statBox('Desk height', fmt(st.dk, 0) + ' cm', Math.abs(dErr) <= 3 ? 'at elbow height' : fmt(Math.abs(dErr), 0) + ' cm too ' + (dErr > 0 ? 'high' : 'low') + ' (ideal ≈ ' + fmt(M.idealDesk, 0) + ')', Math.abs(dErr) <= 4 ? 'good' : 'bad') + A.statBox('Desk reflection', refl ? fmt(M.ms, 2) + ' ms late' : st.tilt && M.hit ? 'scattered' : 'misses the desk', refl ? 'first notch near ' + A.fmtHz(M.notch) : 'no strong comb filter', refl ? 'bad' : 'good') + A.statBox('Screen', !st.scr ? 'none' : M.blocked ? 'blocks the speaker' : 'clear of the speaker', st.scr ? 'viewing distance ' + fmt(M.scrDist, 0) + ' cm (comfortable from about ' + fmt(M.scrIdeal, 0) + ')' : '', M.blocked ? 'bad' : 'good');
      const fixes = [];
      if (M.blocked) fixes.push('Lower the screen, push it back below the speaker line, or raise the speakers and tilt them down.');
      if (refl) fixes.push('The desk bounce is real. Make the top smaller or lower, pull the speakers back off the desk onto stands, or use a slatted or tilted surface so the bounce is scattered.');
      if (Math.abs(dErr) > 4) fixes.push('Set the desk at elbow height with shoulders relaxed; raise the chair and add a footrest rather than working with raised shoulders.');
      if (Math.abs(st.sh - M.ear) > 25) fixes.push('The speakers are far from ear height. Tilting helps, but a steep angle puts you off the crossover\'s best axis.');
      if (st.scr && M.scrDist < M.scrIdeal * 0.8) fixes.push('The screen is close for its size: expect neck movement. A deeper desk or a smaller screen is easier on the body.');
      tip.innerHTML = callout(fixes.length ? 'warn' : 'mentor', fixes.length ? '<b>Fix in this order:</b><ul style="margin:.3em 0 0 1.1em;padding:0">' + fixes.map((s) => `<li>${s}</li>`).join('') + '</ul>' : '<b>A clean set-up:</b> ears on the speaker axis, desk at elbow height, the screen below the line of sight to the speakers and no strong desk bounce. Now check it by measurement.');
    }
    upd();
  };

  /* ======================================================================
     11. Rack planner
     ====================================================================== */
  const GEAR = [['pre', 'Microphone preamplifiers (1U)', 1, 25, 4, 0, 2], ['dyn', 'Compressors / equalisers (2U)', 2, 40, 6, 0, 2], ['tube', 'Valve processors (2U, hot)', 2, 80, 8, 1, 0], ['conv', 'Converters / interfaces (1U)', 1, 35, 4, 0, 1], ['amp', 'Power amplifiers (2U, hot)', 2, 150, 12, 1, 0], ['pb', 'Patchbays (1U)', 1, 0, 2, 0, 1], ['pwr', 'Power distribution (1U)', 1, 10, 4, 0, 1], ['pc', 'Rack computer or server (4U, hot)', 4, 250, 15, 1, 0]];
  V.rackPlanner = function (host) {
    const st = A.controls(host, [
      ...GEAR.map((g) => ({ key: g[0], label: g[1], type: 'range', min: 0, max: 6, step: 1, value: g[6], fmt: (v) => v + ' ×' })),
      { key: 'cu', label: 'Other gear — rack units', type: 'range', min: 0, max: 12, step: 1, value: 0, fmt: (v) => v + ' U' },
      { key: 'cw', label: 'Other gear — power drawn', type: 'range', min: 0, max: 600, step: 10, value: 0, unit: 'W' },
      { key: 'place', label: 'Where the rack lives', type: 'select', value: 'side', options: [['side', 'Low side rack at the desk'], ['rear', 'Tall rack at the back of the room'], ['closet', 'Machine closet outside the room']] },
    ], () => { cv.redraw(); upd(); });
    function model() {
      let items = []; GEAR.forEach((g) => { for (let i = 0; i < st[g[0]]; i++) items.push({ n: g[1].split(' (')[0].replace(/s$/, ''), u: g[2], w: g[3], kg: g[4], hot: g[5], k: g[0] }); });
      if (st.cu) items.push({ n: 'Other gear', u: st.cu, w: st.cw, kg: st.cu * 3, hot: st.cw / Math.max(1, st.cu) > 35 ? 1 : 0, k: 'x' });
      const rank = (it) => (it.k === 'pb' ? 0 : it.k === 'pre' || it.k === 'dyn' || it.k === 'tube' ? 1 : it.k === 'conv' ? 2 : it.k === 'x' ? 3 : it.k === 'pwr' ? 4 : it.k === 'pc' ? 5 : 6);
      items.sort((a, b) => rank(a) - rank(b));
      const slots = []; items.forEach((it) => { slots.push(it); if (it.hot) slots.push({ n: 'vent panel', u: 1, w: 0, kg: 0.3, vent: 1 }); });
      const U = slots.reduce((a, s) => a + s.u, 0), W = items.reduce((a, s) => a + s.w, 0), kg = slots.reduce((a, s) => a + s.kg, 0);
      return { slots, U, W, kg, btu: W * 3.412, air: (W * 3) / 10 };
    }
    const cv = A.canvas(host, {
      height: 380, caption: 'Suggested order from top to bottom: things you touch at hand height, heavy and hot units low, with a vent space above each hot unit.',
      draw(ctx, w, h) {
        const M = model(); const maxU = Math.max(12, M.U), uh = Math.min(22, (h - 30) / maxU), rw = Math.min(260, w * 0.55), x = 20, top = 14; const T = css('text');
        rr(ctx, x - 6, top - 6, rw + 12, maxU * uh + 12, 4, css('panel2'), T, 2);
        let u = 0; M.slots.forEach((s) => { const y = top + u * uh; rr(ctx, x, y + 1, rw, s.u * uh - 2, 2, s.vent ? css('bg') : s.hot ? css('c3') : css('accent'), css('line'), 1); if (s.vent) for (let q = 0; q < 10; q++) line(ctx, x + 12 + q * (rw - 24) / 9, y + 4, x + 12 + q * (rw - 24) / 9, y + uh - 4, css('muted'), 1.5); else if (s.u * uh >= 12) txt(ctx, s.n + (s.w ? ' · ' + s.w + ' W' : ''), x + 8, y + (s.u * uh) / 2 + 4, { size: Math.min(11, uh * 0.6 + 3), bold: true, color: css('bg') }); u += s.u; });
        for (let i = u; i < maxU; i++) rr(ctx, x, top + i * uh + 1, rw, uh - 2, 2, null, css('line'), 1);
        const ix = x + rw + 22; if (w - ix > 90) { txt(ctx, M.U + ' U used', ix, 30, { bold: true, size: 13 }); txt(ctx, fmt(M.U * 4.445, 0) + ' cm of rack height', ix, 46, { size: 10.5, color: css('muted') });
          const hh = Math.min(120, h - 110), by = 70; rr(ctx, ix, by, 26, hh, 4, css('panel2'), css('line'), 1); const f = clamp(M.W / 800, 0, 1); rr(ctx, ix, by + hh * (1 - f), 26, hh * f, 4, M.W > 400 ? css('bad') : M.W > 200 ? css('c3') : css('good')); txt(ctx, 'heat', ix + 13, by + hh + 14, { size: 10, align: 'center', color: css('muted') }); wrapText(ctx, fmt(M.W, 0) + ' W into the room, like ' + fmt(M.W / 100, 1) + ' people sitting still', ix + 36, by + 14, w - ix - 44, 14, { size: 10.5 }); }
      },
    });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const M = model(); const hcm = M.U * 4.445;
      out.innerHTML = A.statBox('Rack space', M.U + ' U', fmt(hcm, 0) + ' cm high, plus plinth and top') + A.statBox('Weight', fmt(M.kg, 0) + ' kg', M.kg > 80 ? 'needs heavy castors or a fixed plinth' : 'manageable on castors') + A.statBox('Heat', fmt(M.W, 0) + ' W', fmt(M.btu, 0) + ' BTU/h for the air-conditioning to remove', M.W > 400 ? 'bad' : '') + A.statBox('Airflow needed', fmt(M.air, 0) + ' m³/h', 'for a 10 °C rise through the rack');
      const N = [];
      if (st.place === 'side' && M.U > 12) N.push('A low side rack holds about 8–12 U before it blocks the room or forces a long reach. Split into two side racks, or move the rarely-touched units to a rear rack or closet.');
      if (st.place === 'side') N.push('Tilt a low side rack back 10–15° so the front panels face your eyes, and keep its top below the line from the speakers to your ears.');
      if (st.place !== 'closet' && M.W > 300) N.push('Over about 300 W in a closed rack needs forced air. Fans in a quiet room are a noise source — choose large slow fans, or move the hot units to a ventilated closet.');
      if (st.place !== 'closet' && st.pc > 0) N.push('A computer in the room sets the noise floor. A closet with its own exhaust path, and cables through a sealed sleeve, is the quiet answer.');
      if (st.place === 'closet') N.push('Give the closet a real air path: cool air in low, warm air out high to outside the room, with lined bends so fan noise does not come back down the duct. Allow rear access and cable slack.');
      if (st.place === 'rear') N.push('A tall rear rack is a large flat reflector. Angle it, keep it off the centre line, or set it into the wall treatment with absorption around it.');
      if (!st.pb && (st.pre + st.dyn + st.tube) > 3) N.push('With this much outboard gear, a patchbay at hand height saves crawling behind the rack and protects connectors.');
      tip.innerHTML = callout('mentor', '<b>Layout advice:</b><ul style="margin:.3em 0 0 1.1em;padding:0">' + N.map((s) => `<li>${s}</li>`).join('') + '</ul>');
    }
    upd();
  };

  /* ======================================================================
     12. Cable paths
     ====================================================================== */
  V.cablePaths = function (host) {
    const st = A.controls(host, [
      { key: 'mode', label: 'Routing', type: 'select', value: 'tidy', options: [['tidy', 'Planned: separate power and signal routes'], ['lazy', 'Unplanned: shortest path for everything']] },
      { key: 'closet', label: 'Machine closet position', type: 'select', value: 'rear', options: [['rear', 'Behind the rear wall'], ['side', 'Beside the right wall']] },
      { key: 'pw', label: 'Show mains power', type: 'check', value: true },
      { key: 'an', label: 'Show analogue audio', type: 'check', value: true },
      { key: 'dg', label: 'Show digital and network', type: 'check', value: true },
      { key: 'sp', label: 'Show speaker feeds', type: 'check', value: true },
    ], () => { cv.redraw(); upd(); });
    // room 4.0 m wide (x) by 5.0 m deep (y); front wall at y = 0
    const P = { desk: [2, 1.55], rackL: [0.95, 1.9], rackR: [3.05, 1.9], spL: [1.15, 0.75], spR: [2.85, 0.75], plate: [0.12, 3.4], db: [3.88, 4.7] };
    function routes() {
      const cl = st.closet === 'rear' ? [3.2, 4.92] : [3.92, 2.9]; const R = { pw: [], an: [], dg: [], sp: [] };
      if (st.mode === 'tidy') {
        const py = 4.86, rx = 3.86; // power: along the right wall and rear
        R.pw.push([P.db, [rx, py], [rx, 1.9], P.rackR], [P.db, [rx, py], [rx, 0.3], [2.85, 0.3], P.spR], [[rx, 0.3], [1.15, 0.3], P.spL], [[rx, 1.25], [2.4, 1.25], [2.4, 1.55], P.desk], [[2.4, 1.25], [0.95, 1.25], P.rackL], [P.db, cl]);
        const lx = 0.14; // signal: along the left wall
        R.an.push([P.plate, [lx, 2.2], [0.95, 2.2], P.rackL], [P.rackL, [0.95, 2.2], [2, 2.2], P.desk], [[2, 2.2], [3.05, 2.2], P.rackR]);
        R.dg.push(st.closet === 'rear' ? [cl, [3.2, 4.6], [0.3, 4.6], [0.3, 2.35], [1.8, 2.35], [1.8, 1.6]] : [cl, [3.6, 2.9], [3.6, 2.35], [1.8, 2.35], [1.8, 1.6]]);
        R.sp.push([P.desk, [2, 0.75], P.spL], [[2, 0.75], P.spR]);
      } else {
        R.pw.push([P.db, P.rackR], [P.db, P.spR], [P.db, P.spL], [P.db, P.desk], [P.db, P.rackL], [P.db, cl]);
        R.an.push([P.plate, P.rackL], [P.rackL, P.desk], [P.desk, P.rackR], [P.plate, P.rackR]);
        R.dg.push([cl, P.desk]); R.sp.push([P.desk, P.spL], [P.desk, P.spR]);
      }
      return { R, cl };
    }
    const segs = (poly) => poly.slice(1).map((p, i) => [poly[i], p]);
    const len = (poly) => segs(poly).reduce((a, [p, q]) => a + Math.hypot(q[0] - p[0], q[1] - p[1]), 0);
    function analyse() {
      const { R, cl } = routes(); const on = (k) => st[k]; const sig = [].concat(on('an') ? R.an : [], on('dg') ? R.dg : [], on('sp') ? R.sp : []); const pw = on('pw') ? R.pw : [];
      let good = 0, bad = 0, par = 0; const marks = [];
      pw.forEach((a) => segs(a).forEach(([p1, p2]) => sig.forEach((b) => segs(b).forEach(([q1, q2]) => {
        const d1 = [p2[0] - p1[0], p2[1] - p1[1]], d2 = [q2[0] - q1[0], q2[1] - q1[1]], den = d1[0] * d2[1] - d1[1] * d2[0], l1 = Math.hypot(...d1), l2 = Math.hypot(...d2); if (l1 < 0.01 || l2 < 0.01) return;
        const sinA = Math.abs(den) / (l1 * l2);
        if (sinA < 0.2) { const ux = d1[0] / l1, uy = d1[1] / l1; const dist = Math.abs((q1[0] - p1[0]) * -uy + (q1[1] - p1[1]) * ux); if (dist < 0.25) { const a0 = 0, a1 = l1, b0 = (q1[0] - p1[0]) * ux + (q1[1] - p1[1]) * uy, b1 = (q2[0] - p1[0]) * ux + (q2[1] - p1[1]) * uy; const ov = Math.min(a1, Math.max(b0, b1)) - Math.max(a0, Math.min(b0, b1)); if (ov > 0.15) { par += ov; marks.push([[p1[0] + ux * (Math.max(a0, Math.min(b0, b1)) + ov / 2), p1[1] + uy * (Math.max(a0, Math.min(b0, b1)) + ov / 2)], 2]); } } return; }
        const tt = ((q1[0] - p1[0]) * d2[1] - (q1[1] - p1[1]) * d2[0]) / den, uu = ((q1[0] - p1[0]) * d1[1] - (q1[1] - p1[1]) * d1[0]) / den;
        if (tt > 0.02 && tt < 0.98 && uu > 0.02 && uu < 0.98) { const pt = [p1[0] + d1[0] * tt, p1[1] + d1[1] * tt]; if (sinA > 0.94) { good++; marks.push([pt, 0]); } else { bad++; marks.push([pt, 1]); } }
      }))));
      const L = {}; ['pw', 'an', 'dg', 'sp'].forEach((k) => { L[k] = on(k) ? R[k].reduce((a, p) => a + len(p) + 1.0 + 1.2, 0) : 0; });
      return { R, cl, good, bad, par, marks, L };
    }
    const cv = A.canvas(host, {
      height: 400, animate: true, caption: 'Plan view of a small control room. Moving dashes show each cable family. Rings mark where power meets signal: a clean right-angle crossing is fine, a slanted crossing or a shared run is flagged.',
      draw(ctx, w, h, t) {
        t = Math.max(0, t); const M = analyse(); const sc = Math.min((w - 40) / 4.6, (h - 30) / 5.4), ox = (w - 4.6 * sc) / 2 + 0.1 * sc, oy = 14; const X = (m) => ox + m * sc, Y = (m) => oy + m * sc; const T = css('text'), Mu = css('muted');
        ctx.strokeStyle = T; ctx.lineWidth = 3; ctx.strokeRect(X(0), Y(0), 4 * sc, 5 * sc);
        const box = (p, ww, hh, lab, fill) => { rr(ctx, X(p[0]) - (ww * sc) / 2, Y(p[1]) - (hh * sc) / 2, ww * sc, hh * sc, 3, fill || css('panel2'), T, 1.5); if (lab) txt(ctx, lab, X(p[0]), Y(p[1]) + 3, { size: w < 420 ? 8.5 : 10, align: 'center', color: Mu }); };
        box(P.desk, 1.5, 0.6, 'desk'); box(P.rackL, 0.5, 0.55, 'rack'); box(P.rackR, 0.5, 0.55, 'rack'); box(P.spL, 0.3, 0.35, 'L'); box(P.spR, 0.3, 0.35, 'R');
        if (st.closet === 'rear') { ctx.strokeRect(X(2.6), Y(5), 1.3 * sc, 0.35 * sc); txt(ctx, 'machine closet', X(3.25), Y(5.25), { size: 9, align: 'center', color: Mu }); } else { ctx.strokeRect(X(4), Y(2.4), 0.45 * sc, 1 * sc); ctx.save(); ctx.translate(X(4.27), Y(2.9)); ctx.rotate(Math.PI / 2); txt(ctx, 'closet', 0, 0, { size: 9, align: 'center', color: Mu }); ctx.restore(); }
        rr(ctx, X(0) - 4, Y(P.plate[1]) - 12, 8, 24, 2, css('c4')); txt(ctx, 'tie-line plate', X(0.2), Y(P.plate[1]) + 26, { size: 9, color: Mu });
        rr(ctx, X(3.82), Y(4.58), 12, 16, 2, css('bad')); txt(ctx, 'power board', X(3.78), Y(4.5), { size: 9, color: Mu, align: 'right' });
        ctx.beginPath(); ctx.arc(X(2), Y(2.55), 6, 0, TAU); ctx.fillStyle = Mu; ctx.fill();
        const col = { pw: css('bad'), an: css('accent'), dg: css('c4'), sp: css('c2') };
        ['pw', 'an', 'dg', 'sp'].forEach((k) => { if (!st[k]) return; M.R[k].forEach((poly) => { ctx.save(); ctx.strokeStyle = col[k]; ctx.lineWidth = k === 'pw' ? 3 : 2.2; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 22; ctx.beginPath(); poly.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.stroke(); ctx.restore(); }); });
        M.marks.forEach(([p, kind]) => { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), kind ? 8 + Math.sin(t * 5) * 1.5 : 6, 0, TAU); ctx.strokeStyle = kind ? css('bad') : css('good'); ctx.lineWidth = kind ? 3 : 2; ctx.stroke(); if (kind) { ctx.globalAlpha = 0.2; ctx.fillStyle = css('bad'); ctx.fill(); ctx.globalAlpha = 1; } });
      },
    });
    host.appendChild(A.legend([[css('bad'), 'mains power'], [css('accent'), 'analogue audio'], [css('c4'), 'digital / network'], [css('c2'), 'speaker feeds']]));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function upd() {
      const M = analyse(); const tot = M.L.pw + M.L.an + M.L.dg + M.L.sp;
      out.innerHTML = A.statBox('Clean crossings', String(M.good), 'power meets signal at a right angle', 'good') + A.statBox('Slanted crossings', String(M.bad), M.bad ? 'couple more hum than a square crossing' : 'none', M.bad ? 'bad' : 'good') + A.statBox('Shared runs', fmt(M.par, 1) + ' m', M.par > 0.3 ? 'power and signal side by side' : 'power and signal kept apart', M.par > 0.3 ? 'bad' : 'good') + A.statBox('Cable to buy', fmt(tot, 0) + ' m', 'includes drops and a service loop at each end');
      tip.innerHTML = callout(M.bad || M.par > 0.3 ? 'warn' : 'mentor', M.bad || M.par > 0.3 ? '<b>Shortest is not best.</b> Every slanted crossing and every metre where mains runs beside audio is a chance for hum and buzz, and a tangle nobody can service. Give power one side of the room and signal the other; where they must meet, cross once, squarely.' : '<b>A serviceable layout:</b> mains follows one wall, signal the other, and the two meet only at right angles under the desk. Add 20–30 % spare capacity in every trunk and label both ends of every cable before it is pulled.');
    }
    upd();
  };

  /* ======================================================================
     13. Desk cut list
     ====================================================================== */
  V.deskCutList = function (host) {
    const st = A.controls(host, [
      { key: 'w', label: 'Desk width', type: 'range', min: 120, max: 240, step: 2, value: 170, unit: 'cm' },
      { key: 'd', label: 'Desk depth', type: 'range', min: 60, max: 100, step: 1, value: 78, unit: 'cm' },
      { key: 'h', label: 'Desk height', type: 'range', min: 65, max: 110, step: 1, value: 72, unit: 'cm' },
      { key: 'mat', label: 'Sheet material', type: 'select', value: 'ply18', options: [['ply18', '18 mm plywood'], ['ply25', '25 mm plywood'], ['mdf18', '18 mm MDF'], ['mdf25', '25 mm MDF']] },
      { key: 'bays', label: 'Rack bays under the top', type: 'select', value: '2', options: [['0', 'None — open legs'], ['1', 'One bay'], ['2', 'Two bays']] },
      { key: 'ru', label: 'Rack units per bay', type: 'range', min: 4, max: 12, step: 1, value: 8, fmt: (v) => v + ' U' },
      { key: 'tray', label: 'Sliding keyboard tray', type: 'check', value: true },
    ], () => { cv.redraw(); upd(); });
    function model() {
      const t = /25/.test(st.mat) ? 2.5 : 1.8, mdf = /mdf/.test(st.mat), sideD = st.d - 6, sideH = st.h - t, bays = +st.bays; const parts = [];
      parts.push(['Top', st.w, st.d, 1]);
      if (bays === 0) { parts.push(['Leg panel', sideD, sideH, 2], ['Rear stretcher', st.w - 2 * t - 10, 30, 1], ['Front rail (under top)', st.w - 2 * t - 10, 9, 1]); } else {
        parts.push(['Bay side panel', sideD, sideH, 2 * bays], ['Bay floor', 48.5, sideD, bays], ['Bay rear rail', 48.5, 10, 2 * bays]);
        if (bays === 1) parts.push(['Leg panel', sideD, sideH, 1]);
        parts.push(['Rear stretcher', Math.max(30, st.w - bays * (48.5 + 2 * t) - (bays === 1 ? t : 0) - 10), 30, 1], ['Front rail (under top)', Math.max(30, st.w - bays * (48.5 + 2 * t) - 10), 9, 1]);
      }
      if (st.tray) parts.push(['Keyboard tray', Math.min(110, st.w - bays * 54 - 20), 34, 1]);
      const pieces = []; parts.forEach((p) => { for (let i = 0; i < p[3]; i++) pieces.push({ n: p[0], a: Math.max(p[1], p[2]), b: Math.min(p[1], p[2]) }); });
      pieces.sort((x, y) => y.b - x.b || y.a - x.a);
      const SW = 244, SH = 122, kerf = 0.5, sheets = []; const place = (pc) => { for (const s of sheets) { for (const sh of s.shelves) { if (pc.b <= sh.h + 0.01 && sh.x + pc.a <= SW) { pc.x = sh.x; pc.y = sh.y; sh.x += pc.a + kerf; s.items.push(pc); return; } } if (s.y + pc.b <= SH) { const sh = { y: s.y, h: pc.b, x: pc.a + kerf }; s.shelves.push(sh); pc.x = 0; pc.y = s.y; s.y += pc.b + kerf; s.items.push(pc); return; } } const s = { shelves: [], items: [], y: 0 }; sheets.push(s); place(pc); };
      pieces.forEach((pc) => { if (pc.a > SW || pc.b > SH) { pc.over = 1; } place(pc); });
      const area = pieces.reduce((a, p) => a + (p.a * p.b) / 1e4, 0), kg = area * (t / 100) * (mdf ? 750 : 620);
      const sheetCost = { ply18: [3800, 6500], ply25: [5500, 9000], mdf18: [2200, 3600], mdf25: [3200, 5000] }[st.mat]; const railU = bays * st.ru; const hw = [1500 + bays * 1200 + (st.tray ? 900 : 0), 4000 + bays * 3500 + (st.tray ? 2500 : 0)]; const fin = [area * 2 * 250, area * 2 * 900];
      const span = bays === 2 ? st.w - 2 * (48.5 + 2 * t) : bays === 1 ? st.w - (48.5 + 3 * t) : st.w - 2 * t; const sag = (span > 120 && t < 2.5) || span > 150;
      const bayH = st.ru * 4.445 + 2 * t; return { t, parts, sheets, area, kg, cost: [sheets.length * sheetCost[0] + hw[0] + fin[0], sheets.length * sheetCost[1] + hw[1] + fin[1]], span, sag, bayH, sideH, railU, mdf, bays };
    }
    const cv = A.canvas(host, {
      height: 300, caption: 'How the parts fit on standard 2.44 × 1.22 m sheets (simple layout, saw cuts allowed for). Check grain direction and your yard\'s real sheet size before cutting.',
      draw(ctx, w, h) {
        const M = model(); const n = M.sheets.length, cols = w < 560 ? 1 : Math.min(n, 2), rows = Math.ceil(n / cols), gw = (w - 20 - (cols - 1) * 12) / cols, sc = Math.min(gw / 244, (h - 24 - (rows - 1) * 10) / (rows * 122));
        M.sheets.forEach((s, i) => { const ox = 10 + (i % cols) * (244 * sc + 12), oy = 16 + Math.floor(i / cols) * (122 * sc + 10); rr(ctx, ox, oy, 244 * sc, 122 * sc, 2, css('panel2'), css('muted'), 1.5); txt(ctx, 'sheet ' + (i + 1), ox + 2, oy - 4, { size: 9.5, color: css('muted') });
          s.items.forEach((p, k) => { rr(ctx, ox + p.x * sc, oy + p.y * sc, p.a * sc - 1, p.b * sc - 1, 1, k % 2 ? css('accent') : css('c2'), css('bg'), 1); if (p.a * sc > 60 && p.b * sc > 14) txt(ctx, p.n, ox + p.x * sc + 4, oy + p.y * sc + Math.min(14, p.b * sc - 3), { size: 9.5, bold: true, color: css('bg') }); }); });
      },
    });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const body = el('div'); host.appendChild(body);
    function upd() {
      const M = model();
      out.innerHTML = A.statBox('Sheets', String(M.sheets.length), fmt(M.area, 1) + ' m² of parts') + A.statBox('Weight', fmt(M.kg, 0) + ' kg', M.kg > 70 ? 'build it to come apart for moving' : 'two people can lift it') + A.statBox('Rough cost', inr(M.cost[0]) + ' – ' + inr(M.cost[1]), 'sheets, finish and hardware; not labour') + A.statBox('Longest unsupported span', fmt(M.span, 0) + ' cm', M.sag ? 'will sag and drum: stiffen it' : 'stiff enough', M.sag ? 'bad' : 'good');
      const N = [];
      if (M.sag) N.push('Glue a second strip under the front edge or add a deep front rail: a top that bends is also a top that rings.');
      if (M.bays && M.bayH > M.sideH) N.push(`${st.ru} U needs ${fmt(M.bayH, 0)} cm of height but the bay is only ${fmt(M.sideH, 0)} cm tall. Reduce the rack units or raise the desk.`);
      if (M.bays) N.push(`Rack rails: ${M.bays * 2} pairs of ${st.ru} U strip. Clear width between the bay sides must be 48.3 cm (19 inches) plus 2–3 mm; check it with a real unit before gluing.`);
      if (M.mdf) N.push('MDF is flat and well damped but weak at edges and swells if water gets in. Seal every edge and use inserts, not wood screws, for anything that is taken apart.');
      else N.push('Plywood holds screws and survives humidity better. Buy a good moisture-resistant grade, and expect to fill and sand the exposed edges.');
      N.push('Line the inside of any closed box with felt or thin foam, and put felt pads wherever two panels touch without glue. Tap every panel: a note means a rattle later.');
      body.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Part</th><th>Qty</th><th>Length (cm)</th><th>Width (cm)</th></tr></thead><tbody>' + M.parts.map((p) => `<tr><td><b>${p[0]}</b></td><td>${p[3]}</td><td>${fmt(Math.max(p[1], p[2]), 1)}</td><td>${fmt(Math.min(p[1], p[2]), 1)}</td></tr>`).join('') + `</tbody></table></div><p class="small muted" style="margin:.3em 0">Sheet thickness ${fmt(M.t * 10, 0)} mm. Sizes are finished sizes; ask the yard to allow for the saw cut.</p>` + callout('mentor', '<b>Before you cut:</b><ul style="margin:.3em 0 0 1.1em;padding:0">' + N.map((s) => `<li>${s}</li>`).join('') + '</ul>') + moneyNote;
    }
    upd();
  };
})();
