/* ==========================================================================
   Acoustica — recording widgets: microphone distance, stereo techniques,
   multi-mic phase, instrument miking, level meter, buffer latency.
   Simplified teaching models.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2, C = 343;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const tip = (box, list, cls = 'mentor') => { box.innerHTML = `<div class="callout ${cls}"><ul style="margin:0;padding-left:18px">${list.map((x) => `<li>${x}</li>`).join('')}</ul></div>`; };
  const mic = (ctx, x, y, ang, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col || A.css('text'); ctx.beginPath(); ctx.roundRect(-4, -4, 22, 8, 3); ctx.fill(); ctx.beginPath(); ctx.arc(-4, 0, 7, 0, TAU); ctx.fill(); ctx.restore(); };

  /* ======================================================================
     1. Microphone distance: direct vs room, proximity effect, 3:1 rule
     ====================================================================== */
  const PAT = { omni: ['Omnidirectional', 1, 0], card: ['Cardioid', 1.7, 0.5], sup: ['Supercardioid', 1.9, 0.63], fig8: ['Figure-8 (ribbon)', 1.7, 1] };
  const ROOMS = { dead: ['Treated studio / booth', 1.6], mid: ['Furnished room', 0.9], live: ['Live, hard room', 0.5] };
  V.micDistance = function (host) {
    const st = A.controls(host, [
      { key: 'd', label: 'Microphone distance from the source', type: 'range', min: Math.log10(0.02), max: Math.log10(3), step: 0.01, value: Math.log10(0.2), fmt: (v) => fmt(Math.pow(10, v) * 100, 1) + ' cm' },
      { key: 'pat', label: 'Pickup pattern', type: 'select', value: 'card', options: Object.entries(PAT).map(([k, v]) => [k, v[0]]) },
      { key: 'room', label: 'Room', type: 'select', value: 'mid', options: Object.entries(ROOMS).map(([k, v]) => [k, v[0]]) },
      { key: 'd2', label: 'Distance from this mic to the next loud source', type: 'range', min: 0.1, max: 4, step: 0.05, value: 0.6, fmt: (v) => fmt(v * 100, 0) + ' cm' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const box = el('div'); host.appendChild(box);
    const prox = (f, d) => { const g = PAT[st.pat][2]; if (!g) return 0; const kr = (TAU * f * d) / C; const grad = Math.sqrt(1 + 1 / (kr * kr)); return 20 * Math.log10((1 - g) + g * grad); };
    const calc = () => { const d = Math.pow(10, st.d), dc = ROOMS[st.room][1] * PAT[st.pat][1]; return { d, dc, ratio: 20 * Math.log10(dc / d), p100: prox(100, d), bleed: 20 * Math.log10(d / st.d2) }; };
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: the source, the microphone and the room. Solid rings are direct sound; faint rings are the room coming back. Right: the bass boost a directional microphone adds as it gets close (proximity effect). Distance is your main tone and “room” control.',
      draw(ctx, w, h, t) {
        const r = calc(), tt = Math.max(0, t), lw = Math.min(w * 0.42, 360), sy = h / 2, sx = 40, sc = (lw - 80) / 3;
        dot(ctx, sx, sy, 12, A.css('accent')); A.text(ctx, 'source', sx, sy + 28, { align: 'center', size: 10, color: A.css('muted') });
        for (let k = 0; k < 3; k++) { const rr = ((tt * 0.5 + k / 3) % 1) * (lw - 60); ctx.strokeStyle = A.alpha(A.css('accent'), 0.8 * (1 - rr / (lw - 60))); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, rr, -0.7, 0.7); ctx.stroke(); }
        const live = { dead: 0.15, mid: 0.4, live: 0.8 }[st.room];
        for (let k = 0; k < 4; k++) { const rr = ((tt * 0.3 + k / 4) % 1) * (lw - 40); ctx.strokeStyle = A.alpha(A.css('c3'), live * 0.6 * (1 - rr / (lw - 40))); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(lw - 10, 20 + (k % 2) * (h - 40), rr, 0, TAU); ctx.stroke(); }
        ctx.lineWidth = 1;
        const mx = sx + 16 + Math.max(4, r.d * sc); mic(ctx, mx, sy, 0);
        const dcx = sx + 16 + Math.min(3, r.dc) * sc; ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('warn'); ctx.beginPath(); ctx.moveTo(dcx, 24); ctx.lineTo(dcx, h - 24); ctx.stroke(); ctx.setLineDash([]);
        A.text(ctx, 'room takes over', dcx + 4, 34, { size: 10, color: A.css('warn') });
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 1000, log: true, label: 'Frequency (Hz)', ticks: [20, 50, 100, 200, 500, 1000] }, y: { min: -3, max: 24, label: 'Bass boost (dB)' }, pad: { l: lw + 50, r: 12, t: 14, b: 36 } });
        const pts = []; for (let f = 20; f <= 1000; f *= 1.04) pts.push([f, Math.min(24, prox(f, r.d))]);
        A.plotFill(ctx, ax, pts, A.alpha(A.css('accent'), 0.12), 0); A.plotLine(ctx, ax, pts, A.css('accent'), 2.6);
      },
    });
    function upd() {
      const r = calc();
      out.innerHTML = A.statBox('Direct vs room', (r.ratio > 0 ? '+' : '') + fmt(r.ratio, 1) + ' dB', r.ratio > 12 ? 'dry, close' : r.ratio > 3 ? 'mostly direct' : r.ratio > -3 ? 'balanced' : 'mostly room', r.ratio < -3 ? 'warn' : 'good') + A.statBox('Bass boost at 100 Hz', '+' + fmt(r.p100, 1) + ' dB', st.pat === 'omni' ? 'omni: none' : 'proximity effect', r.p100 > 9 ? 'warn' : '') + A.statBox('Room takes over beyond', A.fmtLen(r.dc), 'critical distance for this mic') + A.statBox('Bleed from the neighbour', fmt(r.bleed, 1) + ' dB', st.d2 >= 3 * r.d ? '3:1 rule met' : 'closer than 3:1', st.d2 >= 3 * r.d ? 'good' : 'warn');
      const T = [];
      if (r.p100 > 9) T.push('Strong proximity boost: great for a thin voice, muddy on a boomy one. Back off a little, use the mic’s high-pass switch, or pick an omni.');
      if (r.ratio < 0) T.push('The mic hears more room than source. Move in, choose a tighter pattern, or deaden the room — unless the room is the sound you want.');
      if (st.d2 < 3 * r.d) T.push(`The neighbouring source is less than three times as far away (${A.fmtLen(st.d2)} vs ${A.fmtLen(r.d)}): expect audible bleed and comb filtering when the mics are mixed. Move the mic closer to its own source or the neighbour away.`);
      if (st.pat === 'fig8') T.push('A figure-8 hears front and back equally and nothing at the sides: aim its dead side at the thing you want to reject.');
      if (!T.length) T.push('A workable position. Now move the mic a hand’s width at a time and listen — small moves change tone more than EQ.');
      tip(box, T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Stereo microphone techniques
     ====================================================================== */
  const TECH = { xy: ['XY coincident cardioids', 90, 0, 0.5], ortf: ['ORTF near-coincident', 110, 17, 0.5], nos: ['NOS near-coincident', 90, 30, 0.5], din: ['DIN near-coincident', 90, 20, 0.5], ab: ['AB spaced omnis', 0, 50, 1], blum: ['Blumlein crossed figure-8s', 90, 0, 0], ms: ['Mid–Side (cardioid + figure-8)', 0, 0, 0.5] };
  V.STEREO_TECH = TECH;
  V.stereoMic = function (host) {
    const st = A.controls(host, [
      { key: 'tech', label: 'Technique', type: 'select', value: 'ortf', options: Object.entries(TECH).map(([k, v]) => [k, v[0]]) },
      { key: 'ang', label: 'Angle between the capsules', type: 'range', min: 0, max: 180, step: 5, value: 110, unit: '°' },
      { key: 'sp', label: 'Spacing between the capsules', type: 'range', min: 0, max: 150, step: 1, value: 17, unit: 'cm' },
      { key: 'wid', label: 'Mid–Side width (amount of Side)', type: 'range', min: 0, max: 2, step: 0.05, value: 1 },
      { key: 'src', label: 'Source position on the stage', type: 'range', min: -90, max: 90, step: 1, value: 30, unit: '°' },
      { key: 'sweep', label: 'Sweep the source across the stage', type: 'check', value: true },
    ], (v) => { if (v.tech !== cur) { cur = v.tech; st.set('ang', TECH[cur][1], true); st.set('sp', TECH[cur][2], true); } upd(); });
    let cur = 'ortf';
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const box = el('div'); host.appendChild(box);
    const g = (phi) => { const a = TECH[st.tech][3]; return a + (1 - a) * Math.cos(phi); };
    function chan(deg) {
      const th = (deg * Math.PI) / 180;
      let L, R;
      if (st.tech === 'ms') { const M = 0.5 + 0.5 * Math.cos(th), S = -Math.sin(th) * st.wid; L = M + S; R = M - S; }
      else { const half = ((st.ang / 2) * Math.PI) / 180; L = g(th + half); R = g(th - half); }
      const dt = st.tech === 'ms' ? 0 : ((st.sp / 100) * Math.sin(th) / C) * 1000;
      const dL = 20 * Math.log10((Math.abs(R) + 1e-4) / (Math.abs(L) + 1e-4));
      return { L, R, dt, dL, pos: A.clamp(dL / 16 + dt / 1.2, -1, 1), anti: L * R < 0 };
    }
    function sra() { for (let a = 1; a <= 90; a++) if (Math.abs(chan(a).pos) >= 0.999) return 2 * a; return null; }
    let live = 30;
    const cv = A.canvas(host, {
      height: 330, animate: true,
      caption: 'Top: plan view of the stage, the microphone pair and its pickup patterns. Bottom bar: where the source appears between your two loudspeakers. Right: image position against source angle — a steep line means a narrow stage fills the speakers; a flat line gives a narrow, mono-ish picture.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t); live = st.sweep ? Math.sin(tt * 0.6) * 80 : st.src;
        const c0 = chan(live), lw = Math.min(w * 0.46, 400), cx = lw / 2 + 6, cy = h - 96, R0 = Math.min(lw / 2 - 14, cy - 20);
        ctx.strokeStyle = A.alpha(A.css('muted'), 0.6); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, R0, Math.PI, TAU); ctx.stroke(); ctx.setLineDash([]);
        const S = sra(); if (S && S < 180) { ctx.fillStyle = A.alpha(A.css('good'), 0.1); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R0, -Math.PI / 2 - (S / 2) * Math.PI / 180, -Math.PI / 2 + (S / 2) * Math.PI / 180); ctx.fill(); }
        // polar lobes
        const lobe = (axis, col, fn) => { ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath(); for (let a = 0; a <= 360; a += 4) { const ph = (a * Math.PI) / 180, rr = Math.abs(fn(ph)) * R0 * 0.42, xx = cx + Math.sin(ph + axis) * rr, yy = cy - Math.cos(ph + axis) * rr; a ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.lineWidth = 1; };
        const off = (st.sp / 100) * 60;
        if (st.tech === 'ms') { lobe(0, A.css('accent'), (p) => 0.5 + 0.5 * Math.cos(p)); lobe(-Math.PI / 2, A.css('c3'), (p) => Math.cos(p) * Math.min(1, st.wid)); mic(ctx, cx, cy, -Math.PI / 2); }
        else { const half = ((st.ang / 2) * Math.PI) / 180; ctx.save(); ctx.translate(-off / 2, 0); lobe(-half, A.css('accent'), g); ctx.restore(); ctx.save(); ctx.translate(off / 2, 0); lobe(half, A.css('c3'), g); ctx.restore(); mic(ctx, cx - off / 2, cy, -Math.PI / 2 - half, A.css('accent')); mic(ctx, cx + off / 2, cy, -Math.PI / 2 + half, A.css('c3')); }
        const sa = (live * Math.PI) / 180, sxp = cx + Math.sin(sa) * R0, syp = cy - Math.cos(sa) * R0;
        for (let k = 0; k < 2; k++) { const rr = ((tt * 0.8 + k / 2) % 1) * 46; ctx.strokeStyle = A.alpha(A.css('warn'), 1 - rr / 46); ctx.beginPath(); ctx.arc(sxp, syp, rr, 0, TAU); ctx.stroke(); }
        dot(ctx, sxp, syp, 7, A.css('warn'));
        // speaker bar
        const by = h - 46, bx0 = 30, bx1 = lw - 20;
        ctx.fillStyle = A.alpha(A.css('muted'), 0.2); ctx.fillRect(bx0, by, bx1 - bx0, 10);
        ctx.fillStyle = A.css('text'); ctx.fillRect(bx0 - 14, by - 8, 12, 26); ctx.fillRect(bx1 + 2, by - 8, 12, 26);
        dot(ctx, (bx0 + bx1) / 2 + c0.pos * (bx1 - bx0) / 2, by + 5, 9, c0.anti ? A.css('bad') : A.css('warn'));
        A.text(ctx, 'L', bx0 - 8, by + 34, { align: 'center', size: 11, weight: 700 }); A.text(ctx, 'R', bx1 + 8, by + 34, { align: 'center', size: 11, weight: 700 });
        A.text(ctx, c0.anti ? 'out-of-phase zone: vague image' : 'image between the speakers', (bx0 + bx1) / 2, by + 34, { align: 'center', size: 10, color: c0.anti ? A.css('bad') : A.css('muted') });
        const ax = A.axes(ctx, w, h, { x: { min: -90, max: 90, label: 'Source angle (degrees)', ticks: [-90, -45, 0, 45, 90] }, y: { min: -1.05, max: 1.05, label: 'Image: left … right', ticks: [-1, 0, 1], fmt: (v) => (v < 0 ? 'L' : v > 0 ? 'R' : 'C') }, pad: { l: lw + 50, r: 12, t: 14, b: 36 } });
        const pts = []; for (let a = -90; a <= 90; a += 2) pts.push([a, chan(a).pos]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.6);
        dot(ctx, ax.X(live), ax.Y(c0.pos), 6, A.css('warn'));
      },
    });
    function upd() {
      const c0 = chan(st.src), S = sra(), edge = chan(S ? S / 2 : 60), notch = Math.abs(edge.dt) > 0.02 ? 1000 / (2 * Math.abs(edge.dt)) : null;
      out.innerHTML = A.statBox('Level difference', fmt(c0.dL, 1) + ' dB', 'at ' + st.src + '°') + A.statBox('Time difference', fmt(c0.dt, 2) + ' ms', st.sp ? '' : 'coincident: none') + A.statBox('Stereo recording angle', S ? S + '°' : '> 180°', S ? (S < 70 ? 'narrow: for distant or small sources' : S > 130 ? 'wide: get close' : 'fits a typical ensemble') : 'never reaches full L/R') + A.statBox('Mono compatibility', notch ? (notch < 1500 ? 'risky' : notch < 5000 ? 'fair' : 'good') : 'excellent', notch ? 'first comb notch ≈ ' + fmtHz(notch) : 'no time differences', notch && notch < 1500 ? 'bad' : notch && notch < 5000 ? 'warn' : 'good');
      const T = [];
      if (st.tech === 'ab') T.push('Spaced omnis give a big, airy sound with real bass, but imaging is soft and the mono sum combs. Check in mono; keep the spacing modest (40–60 cm) or add a centre mic.');
      if (st.tech === 'xy') T.push('XY is the safest for mono and for drum overheads; the picture is precise but not very wide. Widen the angle to widen the image.');
      if (st.tech === 'ortf' || st.tech === 'nos' || st.tech === 'din') T.push('Near-coincident pairs mix level and time differences: wider and more open than XY, still reasonable in mono. Set the pair so the ensemble just fills the shaded recording angle.');
      if (st.tech === 'blum') T.push('Crossed figure-8s capture the room behind as well as the stage in front. Sources beyond ±45° fall in the out-of-phase zone — keep the ensemble inside the front quadrant, in a good room.');
      if (st.tech === 'ms') T.push('Mid–Side lets you change the width after the recording: L = M + S, R = M − S. With Side at zero you have a mono cardioid; folding to mono cancels the Side signal completely, so it is perfectly mono-compatible.');
      if (S && S < 60) T.push('Very narrow recording angle: anything wider than this is squashed to one speaker. Reduce the angle or spacing, or move back.');
      tip(box, T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Two microphones on one source: phase, polarity, time alignment
     ====================================================================== */
  const MMP = { snare: ['Snare: top and bottom mics', 0.05, 0.06, true, -3], kick: ['Kick: inside and outside mics', 0.08, 0.55, false, -2], oh: ['Close mic + overhead', 0.05, 1.05, false, -6], amp: ['DI + amp microphone', 0, 0.35, false, 0], cab: ['Two mics on a guitar cabinet', 0.03, 0.12, false, 0] };
  V.multiMicPhase = function (host) {
    const st = A.controls(host, [
      { key: 'pre', label: 'Situation', type: 'select', value: 'kick', options: Object.entries(MMP).map(([k, v]) => [k, v[0]]) },
      { key: 'd1', label: 'Mic 1 distance', type: 'range', min: 0, max: 1, step: 0.005, value: 0.08, fmt: (v) => fmt(v * 100, 1) + ' cm' },
      { key: 'd2', label: 'Mic 2 distance', type: 'range', min: 0, max: 3, step: 0.005, value: 0.55, fmt: (v) => fmt(v * 100, 1) + ' cm' },
      { key: 'lvl', label: 'Mic 2 level relative to mic 1', type: 'range', min: -18, max: 6, step: 0.5, value: -2, unit: 'dB' },
      { key: 'flip', label: 'Flip the polarity of mic 2 (Ø button)', type: 'check', value: false },
      { key: 'align', label: 'Time-align (delay the closer mic)', type: 'check', value: false },
      { key: 'sr', label: 'Sample rate', type: 'select', value: '48000', options: [['44100', '44.1 kHz'], ['48000', '48 kHz'], ['96000', '96 kHz']] },
    ], (v) => { if (v.pre !== cur) { cur = v.pre; const p = MMP[cur]; st.set('d1', p[1], true); st.set('d2', p[2], true); st.set('lvl', p[4], true); st.set('flip', false, true); st.set('align', false, true); } upd(); });
    let cur = 'kick', nodes = null;
    const row = el('div', { class: 'row' }); const play = el('button', { class: 'primary', html: A.icon('play') + ' Hear both mics together' }), solo = el('button', {}, 'Mic 1 alone'), stop = el('button', { html: A.icon('stop') + ' Stop' }); row.append(play, solo, stop); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const box = el('div'); host.appendChild(box);
    const calc = () => { const tau = st.align ? 0 : (st.d2 - st.d1) / C; const inv = MMP[st.pre][3] !== st.flip; const g = Math.pow(10, st.lvl / 20) * (inv ? -1 : 1); return { tau, g, inv, resp: (f) => { const ph = TAU * f * tau; return 20 * Math.log10(Math.hypot(1 + g * Math.cos(ph), g * Math.sin(ph)) + 1e-6); } }; };
    function start(both) {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return; const r = calc();
      const s = ctx.createBufferSource(); s.buffer = A.audio.noiseBuffer('pink', 4); s.loop = true;
      const g1 = ctx.createGain(), dl = ctx.createDelay(0.05), g2 = ctx.createGain(), m = ctx.createGain(); g1.gain.value = 0.5; dl.delayTime.value = Math.max(0, r.tau); g2.gain.value = both ? 0.5 * r.g : 0; m.gain.value = 0.5;
      s.connect(g1).connect(m); s.connect(dl).connect(g2).connect(m); m.connect(ctx.destination); s.start(); A.audio.track(s); nodes = { dl, g2, both };
    }
    play.onclick = () => start(true); solo.onclick = () => start(false); stop.onclick = () => { A.audio.stopAll(); nodes = null; };
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Left: one source, two microphones. The same wavefront reaches the far mic later; mixed together, some frequencies add and others cancel. Right: the frequency response of the two mics summed. Flip polarity or slide one track in time and watch the holes move or vanish.',
      draw(ctx, w, h, t) {
        const r = calc(), tt = Math.max(0, t), lw = Math.min(w * 0.36, 320), sx = 34, sy = h / 2, sc = (lw - 70) / Math.max(0.3, st.d2, st.d1);
        dot(ctx, sx, sy, 13, A.css('accent')); A.text(ctx, 'source', sx, sy + 30, { align: 'center', size: 10, color: A.css('muted') });
        const m1 = sx + 18 + st.d1 * sc, m2 = sx + 18 + st.d2 * sc;
        for (let k = 0; k < 3; k++) { const rr = ((tt * 0.6 + k / 3) % 1) * (lw - 40); ctx.strokeStyle = A.alpha(A.css('accent'), 0.9 * (1 - rr / (lw - 40))); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, rr, -0.6, 0.6); ctx.stroke(); }
        ctx.lineWidth = 1;
        mic(ctx, m1, sy - 26, 0, A.css('c3')); A.text(ctx, 'mic 1', m1 + 4, sy - 40, { size: 10, color: A.css('c3') });
        mic(ctx, m2, sy + 26, 0, A.css('accent2')); A.text(ctx, 'mic 2' + (r.inv ? ' (inverted)' : ''), m2 + 4, sy + 50, { size: 10, color: A.css('accent2') });
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)', ticks: [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000] }, y: { min: -30, max: 9, label: 'Both mics summed (dB)' }, pad: { l: lw + 50, r: 12, t: 14, b: 36 } });
        ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(3), ax.x1 - ax.x0, ax.Y(-3) - ax.Y(3));
        const pts = []; for (let f = 20; f <= 20000; f *= 1.012) pts.push([f, A.clamp(r.resp(f), -30, 9)]);
        A.plotLine(ctx, ax, pts, A.css('accent'), 2.4);
      },
    });
    function upd() {
      const r = calc(), dd = Math.abs(st.d2 - st.d1), ms = (dd / C) * 1000, smp = (dd / C) * +st.sr, low = r.resp(80);
      if (nodes) { nodes.dl.delayTime.value = Math.max(0, r.tau); nodes.g2.gain.value = nodes.both ? 0.5 * r.g : 0; }
      out.innerHTML = A.statBox('Arrival difference', fmt(ms, 2) + ' ms', `${fmt(smp, 0)} samples · ${A.fmtLen(dd)}`) + A.statBox('First cancellation', st.align || dd < 0.002 ? '—' : fmtHz(r.inv ? C / dd : C / (2 * dd)), r.inv ? 'and the deep bass' : 'then every odd multiple') + A.statBox('Low end at 80 Hz', (low > 0 ? '+' : '') + fmt(low, 1) + ' dB', low < -3 ? 'bass is cancelling' : low > 2 ? 'bass reinforced' : 'neutral', low < -3 ? 'bad' : 'good') + A.statBox('Polarity of mic 2', r.inv ? 'inverted' : 'normal', MMP[st.pre][3] ? 'this set-up faces the other way' : '');
      const T = [];
      if (low < -3) T.push('The low end thins out when both mics are up. Press the polarity (Ø) button on one channel and keep whichever setting has more bass — the quickest fix in recording.');
      if (st.pre === 'snare' && !st.flip) T.push('A bottom snare mic sees the drum head moving the opposite way to the top mic. Flip its polarity as a habit, then check by ear.');
      if (!st.align && ms > 1) T.push(`${fmt(ms, 1)} ms apart: sliding the close-mic track later by ${fmt(smp, 0)} samples lines the two up. Useful for kick in/out and DI + amp; for overheads many engineers leave the natural delay and only check polarity.`);
      if (st.align) T.push('Aligned in time, the two mics add evenly at all frequencies. Remember alignment is only right for one source — other instruments in the same mics sit at different distances.');
      if (!T.length) T.push('Compare “both” with “mic 1 alone”. If adding the second mic makes the sound smaller, something is cancelling.');
      tip(box, T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Instrument miking picker
     ====================================================================== */
  const INST = {
    kick: { name: 'Kick drum', shape: 'kick', mics: [[0.42, 0.5, 'Inside, 5–15 cm from the beater head', 'Large-diaphragm dynamic', 'Toward the beater = more click; toward the shell = rounder'], [0.82, 0.5, 'Outside the front head, 5–30 cm', 'Large-diaphragm condenser or dynamic', 'Adds depth and “boom”; check polarity against the inside mic']], move: 'Closer to the beater: attack. Further back or outside: body and sub.', mistake: 'Mixing inside and outside mics without checking polarity — the low end disappears.' },
    snare: { name: 'Snare drum', shape: 'drum', mics: [[0.3, 0.3, 'Top: 3–5 cm above the rim, aimed at the centre', 'Dynamic (cardioid)', 'Aim at the centre for attack, toward the edge for ring'], [0.42, 0.78, 'Bottom: 5–10 cm under, at the snare wires', 'Small condenser or dynamic', 'Adds the “sizzle”; flip its polarity']], move: 'Higher and flatter: more of the whole drum. Lower and steeper: more stick attack.', mistake: 'Pointing the top mic at the hi-hat. Put the hat in the mic’s null instead.' },
    toms: { name: 'Toms', shape: 'drum', mics: [[0.3, 0.3, '3–6 cm above the head, 3–5 cm in from the rim', 'Dynamic, or clip-on condenser', 'Angle toward the centre; keep cymbals behind the mic']], move: 'Further in: more attack, less sustain. Further out: more ring and tone.', mistake: 'Leaving tom mics open all the time — gate or edit, they add cymbal wash.' },
    oh: { name: 'Drum overheads', shape: 'kit', mics: [[0.36, 0.2, 'Left overhead, 0.9–1.3 m above the snare', 'Small or large condenser', 'Equal distance from the snare for a centred image'], [0.64, 0.2, 'Right overhead, the same distance from the snare', 'Matched to the left', 'Measure with a cable or tape']], move: 'Lower: more cymbals, tighter. Higher: more whole kit and room.', mistake: 'Different distances to the snare — it pulls to one side and loses punch.' },
    hat: { name: 'Hi-hat', shape: 'hat', mics: [[0.5, 0.25, '8–15 cm above, toward the outer edge', 'Small-diaphragm condenser with pad', 'Aim away from the snare; avoid the air blast at the edge']], move: 'Toward the bell: thicker “clang”. Toward the edge: brighter and thinner.', mistake: 'Miking where the cymbals meet — every close puffs air into the capsule.' },
    bass: { name: 'Bass guitar', shape: 'cab', mics: [[0.2, 0.75, 'DI box straight from the instrument', 'Active or passive DI', 'Clean, full lows; always record it'], [0.62, 0.45, 'Amp: 5–20 cm from the cone', 'Large dynamic or condenser', 'Adds growl and mids; time-align with the DI']], move: 'Centre of the cone: bright and punchy. Edge: rounder.', mistake: 'Blending DI and amp without aligning them — hollow low mids.' },
    egtr: { name: 'Electric guitar cabinet', shape: 'cab', mics: [[0.6, 0.45, '1–5 cm from the grille, between cone centre and edge', 'Dynamic (cardioid)', 'Centre = bright and biting; edge = darker and fuller'], [0.86, 0.3, 'Optional: ribbon or condenser 30–100 cm back', 'Ribbon / large condenser', 'Adds size and room; check phase with the close mic']], move: 'One centimetre across the cone is a bigger change than most EQ.', mistake: 'Too much gain on the amp: record with less distortion than feels right in the room.' },
    agtr: { name: 'Acoustic guitar', shape: 'guitar', mics: [[0.58, 0.32, '20–30 cm from where the neck joins the body (12th–14th fret)', 'Small-diaphragm condenser', 'Balanced strings and body'], [0.3, 0.7, 'Optional second mic near the lower bout / bridge', 'Large condenser', 'Adds warmth; pan against the first']], move: 'Toward the sound hole: boomy. Toward the neck: brighter with more finger noise.', mistake: 'Pointing straight into the sound hole — overwhelming boom around 100–200 Hz.' },
    piano: { name: 'Grand piano', shape: 'piano', mics: [[0.4, 0.42, 'Over the hammers, treble side, 20–40 cm up', 'Small or large condenser', 'Close = pop/rock attack'], [0.62, 0.52, 'Over the bass strings, same height', 'Matching condenser', 'Further apart = wider; check in mono']], move: 'Inside over the hammers: percussive. Outside at the curve, 1–2 m back: natural, classical.', mistake: 'Very wide spacing inside the lid with no mono check — a hole in the middle.' },
    vox: { name: 'Lead vocal', shape: 'voice', mics: [[0.62, 0.42, '15–25 cm from the mouth, pop filter 5–10 cm in front', 'Large-diaphragm condenser (or a good dynamic)', 'Slightly above the mouth, angled down, reduces pops and nasality']], move: 'Closer: intimate and bassy. Further: natural, more room, more even level.', mistake: 'Singer drifting toward and away from the mic — mark the spot and use the pop filter as a distance guide.' },
    str: { name: 'Violin / viola / cello', shape: 'guitar', mics: [[0.58, 0.16, 'Violin: 50–100 cm above, aimed at the f-holes', 'Small condenser or ribbon', 'Too close sounds scratchy'], [0.72, 0.6, 'Cello: 40–60 cm in front of the bridge', 'Large condenser or ribbon', 'Lower for body, higher for bow articulation']], move: 'Strings radiate upward and outward: distance smooths the bow noise.', mistake: 'Close-miking like a guitar. Give bowed strings space, or use a ribbon.' },
    brass: { name: 'Brass and saxophone', shape: 'horn', mics: [[0.72, 0.4, 'Trumpet/trombone: 30–60 cm, slightly off the bell axis', 'Ribbon or dynamic', 'On-axis is piercing; off-axis is smoother'], [0.5, 0.7, 'Sax: 30–50 cm, aimed between bell and keys', 'Large condenser or ribbon', 'The sound comes from the tone holes as well as the bell']], move: 'Further back lets the sections of the instrument blend.', mistake: 'Mic jammed in the bell — harsh, and level changes wildly as the player moves.' },
  };
  V.INSTRUMENT_MICS = INST;
  V.instrumentMics = function (host) {
    const st = A.controls(host, [{ key: 'inst', label: 'What are you recording?', type: 'select', value: 'kick', options: Object.entries(INST).map(([k, v]) => [k, v.name]) }], () => upd());
    const info = el('div');
    const shape = (ctx, k, x, y, W, H) => {
      ctx.strokeStyle = A.css('text'); ctx.fillStyle = A.css('panel2'); ctx.lineWidth = 2.5;
      const P = (u, v) => [x + u * W, y + v * H];
      const ell = (u, v, ru, rv) => { ctx.beginPath(); ctx.ellipse(...P(u, v), ru * W, rv * H, 0, 0, TAU); ctx.fill(); ctx.stroke(); };
      if (k === 'kick') { ctx.beginPath(); ctx.rect(...P(0.3, 0.22), 0.45 * W, 0.56 * H); ctx.fill(); ctx.stroke(); ell(0.3, 0.5, 0.05, 0.28); ell(0.75, 0.5, 0.05, 0.28); ctx.fillStyle = A.css('panel'); ell(0.75, 0.6, 0.02, 0.08); }
      else if (k === 'drum') { ctx.beginPath(); ctx.rect(...P(0.3, 0.42), 0.34 * W, 0.22 * H); ctx.fill(); ctx.stroke(); ell(0.47, 0.42, 0.17, 0.06); ell(0.47, 0.64, 0.17, 0.06); }
      else if (k === 'kit') { ell(0.5, 0.72, 0.13, 0.13); ell(0.38, 0.52, 0.08, 0.08); ell(0.6, 0.5, 0.07, 0.07); ell(0.7, 0.66, 0.09, 0.09); ell(0.28, 0.4, 0.09, 0.05); ell(0.74, 0.4, 0.1, 0.05); }
      else if (k === 'hat') { ell(0.5, 0.5, 0.2, 0.05); ell(0.5, 0.54, 0.2, 0.05); ctx.beginPath(); ctx.moveTo(...P(0.5, 0.54)); ctx.lineTo(...P(0.5, 0.92)); ctx.stroke(); }
      else if (k === 'cab') { ctx.beginPath(); ctx.roundRect(...P(0.32, 0.18), 0.24 * W, 0.6 * H, 6); ctx.fill(); ctx.stroke(); ell(0.44, 0.45, 0.08, 0.17); ctx.beginPath(); ctx.roundRect(...P(0.12, 0.7), 0.14 * W, 0.12 * H, 4); ctx.fill(); ctx.stroke(); }
      else if (k === 'guitar') { ell(0.36, 0.62, 0.17, 0.24); ell(0.44, 0.38, 0.12, 0.17); ctx.fillStyle = A.css('panel'); ell(0.4, 0.52, 0.04, 0.06); ctx.beginPath(); ctx.moveTo(...P(0.5, 0.3)); ctx.lineTo(...P(0.78, 0.08)); ctx.lineWidth = 7; ctx.stroke(); ctx.lineWidth = 2.5; }
      else if (k === 'piano') { ctx.beginPath(); ctx.moveTo(...P(0.2, 0.3)); ctx.lineTo(...P(0.8, 0.3)); ctx.quadraticCurveTo(...P(0.86, 0.75), ...P(0.6, 0.78)); ctx.quadraticCurveTo(...P(0.4, 0.8), ...P(0.34, 0.6)); ctx.lineTo(...P(0.2, 0.6)); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = A.css('text'); ctx.fillRect(...P(0.2, 0.22), 0.6 * W, 0.07 * H); }
      else if (k === 'voice') { ell(0.36, 0.42, 0.1, 0.17); ctx.beginPath(); ctx.moveTo(...P(0.3, 0.6)); ctx.quadraticCurveTo(...P(0.2, 0.7), ...P(0.18, 0.95)); ctx.lineTo(...P(0.52, 0.95)); ctx.quadraticCurveTo(...P(0.5, 0.7), ...P(0.42, 0.6)); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(...P(0.52, 0.42), 0.015 * W, 0.1 * H, 0, 0, TAU); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(...P(0.2, 0.46)); ctx.lineTo(...P(0.5, 0.42)); ctx.lineTo(...P(0.62, 0.26)); ctx.lineTo(...P(0.62, 0.66)); ctx.lineTo(...P(0.5, 0.5)); ctx.lineTo(...P(0.2, 0.54)); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      ctx.lineWidth = 1;
    };
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'A schematic starting point, not a rule. Numbered markers are microphone positions; the rings show where each one is “listening”. Start here, then move the mic while someone plays and choose with your ears.',
      draw(ctx, w, h, t) {
        const I = INST[st.inst], tt = Math.max(0, t), W = Math.min(w - 20, 520), x = (w - W) / 2, H = h - 20, y = 10;
        shape(ctx, I.shape, x, y, W, H);
        I.mics.forEach((m, i) => { const mx = x + m[0] * W, my = y + m[1] * H; for (let k = 0; k < 2; k++) { const rr = 12 + ((tt * 0.7 + k / 2) % 1) * 22; ctx.strokeStyle = A.alpha(A.series(i), 1 - (rr - 12) / 22); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mx, my, rr, 0, TAU); ctx.stroke(); } ctx.lineWidth = 1; dot(ctx, mx, my, 11, A.series(i)); A.text(ctx, String(i + 1), mx, my + 4, { align: 'center', size: 12, weight: 800, color: '#fff' }); });
      },
    });
    host.appendChild(info);
    function upd() {
      const I = INST[st.inst];
      info.innerHTML = `<div class="table-wrap"><table><tr><th>#</th><th>Position</th><th>Microphone type</th><th>What to listen for</th></tr>${I.mics.map((m, i) => `<tr><td><b>${i + 1}</b></td><td>${m[2]}</td><td>${m[3]}</td><td>${m[4]}</td></tr>`).join('')}</table></div><div class="grid g2"><div class="callout mentor" style="margin:0"><b>Moving the mic:</b> ${I.move}</div><div class="callout warn" style="margin:0">${I.mistake}</div></div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Level meter: headroom habit
     ====================================================================== */
  V.levelMeter = function (host) {
    const st = A.controls(host, [
      { key: 'gain', label: 'Preamp / input gain', type: 'range', min: -12, max: 30, step: 0.5, value: 10, unit: 'dB' },
      { key: 'bits', label: 'Recording bit depth', type: 'select', value: '24', options: [['16', '16-bit'], ['24', '24-bit']] },
      { key: 'src', label: 'Performer', type: 'select', value: 'vox', options: [['vox', 'Singer: quiet verse, loud chorus'], ['drum', 'Drummer: spiky transients'], ['pad', 'Steady synth pad']] },
    ], () => { mx = -99; clips = 0; over = false; upd(); });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const box = el('div'); host.appendChild(box);
    let mx = -99, clips = 0, over = false, hold = -60, avg = -30, last = 0;
    const SRC = { vox: [-40, -28, 12], drum: [-42, -36, 22], pad: [-34, -33, 6] };
    const cv = A.canvas(host, {
      height: 260, animate: true,
      caption: 'A simulated take: the meter shows the average level (wide bar) and the peaks (thin line, with peak-hold marker). The shaded band around −18 dBFS is a healthy average; the top is digital full scale, where the signal is simply cut off.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t), s = SRC[st.src], chorus = (tt % 12) > 6;
        const rms = (chorus ? s[1] : s[0]) + st.gain + Math.sin(tt * 2.3) * 2;
        const spike = Math.pow(Math.abs(Math.sin(tt * 9.7) * Math.sin(tt * 3.1 + 1)), 5);
        const peak = rms + 5 + s[2] * spike;
        avg += (rms - avg) * 0.05; hold = Math.max(hold - 0.25, peak); mx = Math.max(mx, peak);
        if (peak > 0 && !over) { clips++; over = true; } if (peak < -1) over = false;
        const x0 = 60, x1 = w - 20, X = (db) => x0 + ((A.clamp(db, -60, 3) + 60) / 63) * (x1 - x0), y = 70;
        ctx.fillStyle = A.alpha(A.css('good'), 0.14); ctx.fillRect(X(-24), y - 26, X(-12) - X(-24), 92);
        ctx.fillStyle = A.alpha(A.css('bad'), 0.14); ctx.fillRect(X(0), y - 26, x1 - X(0), 92);
        ctx.fillStyle = A.alpha(A.css('muted'), 0.2); ctx.fillRect(x0, y, x1 - x0, 26);
        ctx.fillStyle = rms > -8 ? A.css('warn') : A.css('good'); ctx.fillRect(x0, y, X(rms) - x0, 26);
        ctx.fillStyle = peak > 0 ? A.css('bad') : A.css('accent'); ctx.fillRect(x0, y + 32, X(Math.min(peak, 3)) - x0, 6);
        ctx.fillStyle = hold > 0 ? A.css('bad') : A.css('text'); ctx.fillRect(X(Math.min(hold, 3)) - 2, y - 4, 4, 46);
        [-60, -48, -36, -24, -18, -12, -6, 0].forEach((d) => { A.text(ctx, String(d), X(d), y + 62, { align: 'center', size: 10, color: A.css('muted') }); ctx.strokeStyle = A.alpha(A.css('muted'), 0.5); ctx.beginPath(); ctx.moveTo(X(d), y + 42); ctx.lineTo(X(d), y + 48); ctx.stroke(); });
        A.text(ctx, 'dBFS', x0 - 8, y + 62, { align: 'right', size: 10, color: A.css('muted') });
        A.text(ctx, chorus ? 'CHORUS' : 'verse', x0, y - 34, { size: 12, weight: 700, color: chorus ? A.css('accent') : A.css('muted') });
        if (peak > 0) A.text(ctx, 'CLIP', x1, y - 34, { align: 'right', size: 13, weight: 800, color: A.css('bad') });
        // waveform strip
        const wy = h - 50; ctx.strokeStyle = A.css('accent'); ctx.beginPath();
        for (let i = 0; i <= 200; i++) { const u = i / 200, a = Math.min(1, Math.pow(10, (rms + 8) / 20)) * (0.6 + 0.4 * Math.sin(u * 40 + tt * 6)); const v = A.clamp(Math.sin(u * 180 + tt * 20) * a * 1.4, -1, 1); const yy = wy - v * 28; i ? ctx.lineTo(x0 + u * (x1 - x0), yy) : ctx.moveTo(x0 + u * (x1 - x0), yy); }
        ctx.stroke(); ctx.strokeStyle = A.alpha(A.css('bad'), 0.5); ctx.beginPath(); ctx.moveTo(x0, wy - 28); ctx.lineTo(x1, wy - 28); ctx.moveTo(x0, wy + 28); ctx.lineTo(x1, wy + 28); ctx.stroke();
        if (tt - last > 0.4) { last = tt; show(); }
      },
    });
    function show() {
      const floor = st.bits === '16' ? -96 : -118;
      out.innerHTML = A.statBox('Average level', fmt(avg, 1) + ' dBFS', avg > -10 ? 'too hot' : avg < -30 ? 'low but usable at 24-bit' : 'healthy', avg > -10 ? 'bad' : 'good') + A.statBox('Highest peak so far', fmt(Math.min(mx, 6), 1) + ' dBFS', mx > 0 ? 'clipped' : `headroom ${fmt(-mx, 1)} dB`, mx > 0 ? 'bad' : mx > -3 ? 'warn' : 'good') + A.statBox('Clipped events', String(clips), clips ? 're-record: clipping cannot be undone' : 'clean', clips ? 'bad' : 'good') + A.statBox('Above the noise floor', fmt(avg - floor, 0) + ' dB', st.bits + '-bit');
    }
    function upd() {
      show(); const s = SRC[st.src], T = [];
      const chorusPeak = s[1] + st.gain + 5 + s[2];
      if (chorusPeak > 0) T.push('The loud section will clip. Set the gain during the loudest part of the song, not the first verse, and leave 6–12 dB spare.');
      else if (chorusPeak > -6) T.push('Close to the top. It works, but an excited take will go over. Back off a few dB — at 24-bit you lose nothing.');
      else if (s[1] + st.gain < -34) T.push('Very low. At 24-bit this is still clean, but you will be turning it up a lot later; add some gain.');
      else T.push('Good gain staging: average around −18 dBFS, peaks between −12 and −6. Plug-ins and analogue-modelled processors are designed to work at this level.');
      if (st.bits === '16') T.push('At 16-bit the noise floor is about 96 dB down: usable, but 24-bit gives room to record conservatively with no penalty.');
      if (st.src === 'drum') T.push('Drums have tall, short peaks: the average looks low while the peaks are near the top. Watch the peak meter, not the average.');
      tip(box, T);
    }
    upd();
  };

  /* ======================================================================
     6. Buffer size and latency
     ====================================================================== */
  V.bufferLatency = function (host) {
    const st = A.controls(host, [
      { key: 'buf', label: 'Buffer size', type: 'select', value: '256', options: [32, 64, 128, 256, 512, 1024, 2048].map((b) => [String(b), b + ' samples']) },
      { key: 'sr', label: 'Sample rate', type: 'select', value: '48000', options: [['44100', '44.1 kHz'], ['48000', '48 kHz'], ['96000', '96 kHz']] },
      { key: 'load', label: 'Session size', type: 'select', value: 'mid', options: [['light', 'Light: a few tracks, few plug-ins'], ['mid', 'Medium: 30 tracks, moderate plug-ins'], ['heavy', 'Heavy: big mix, virtual instruments']] },
      { key: 'mon', label: 'Performer hears themselves', type: 'select', value: 'daw', options: [['daw', 'Through the DAW (software monitoring)'], ['direct', 'Direct from the interface (hardware monitoring)']] },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const box = el('div'); host.appendChild(box);
    const calc = () => { const one = (+st.buf / +st.sr) * 1000, rt = st.mon === 'direct' ? 1.5 : 2 * one + 2.2; const need = { light: 0.7, mid: 2.2, heavy: 6 }[st.load] * (+st.sr / 48000); return { one, rt, risk: need / one, m: rt * 0.343 }; };
    const cv = A.canvas(host, {
      height: 250, animate: true,
      caption: 'The signal has to wait for a full buffer on the way in and another on the way out. Small buffers feel instant but give the computer less time for each block; big buffers are safe for mixing but too slow to perform through.',
      draw(ctx, w, h, t) {
        const r = calc(), tt = Math.max(0, t), names = st.mon === 'direct' ? ['Mic', 'Interface mixer', 'Headphones'] : ['Mic', 'Input buffer', 'DAW + plug-ins', 'Output buffer', 'Headphones'], n = names.length, bw = Math.min(120, (w - 40) / n - 12), y = 40;
        const xs = names.map((_, i) => 20 + i * ((w - 40 - bw) / (n - 1)));
        names.forEach((nm, i) => { const buf = /buffer/.test(nm); ctx.fillStyle = buf ? A.alpha(A.css('warn'), 0.25) : A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.beginPath(); ctx.roundRect(xs[i], y, bw, 44, 6); ctx.fill(); ctx.stroke(); A.text(ctx, nm, xs[i] + bw / 2, y + 27, { align: 'center', size: w < 600 ? 9 : 11, weight: 600 }); if (i < n - 1) { ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(xs[i] + bw, y + 22); ctx.lineTo(xs[i + 1], y + 22); ctx.stroke(); } });
        const period = 0.6 + Math.min(4, r.rt / 12), ph = (tt % period) / period, tot = xs[n - 1] + bw - xs[0]; dot(ctx, xs[0] + ph * tot, y + 22, 6, A.css('accent'));
        // perception bar
        const by = 150, x0 = 30, x1 = w - 30, X = (ms) => x0 + (Math.min(ms, 50) / 50) * (x1 - x0);
        [[0, 5, 'good', 'unnoticed'], [5, 12, 'good', 'fine'], [12, 20, 'warn', 'noticeable'], [20, 50, 'bad', 'distracting']].forEach(([a, b, c, l]) => { ctx.fillStyle = A.alpha(A.css(c), a === 0 ? 0.35 : 0.22); ctx.fillRect(X(a), by, X(b) - X(a), 22); A.text(ctx, l, (X(a) + X(b)) / 2, by + 15, { align: 'center', size: 10 }); });
        [0, 5, 12, 20, 50].forEach((m) => A.text(ctx, m + ' ms', X(m), by + 38, { align: 'center', size: 9, color: A.css('muted') }));
        ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.moveTo(X(r.rt), by - 2); ctx.lineTo(X(r.rt) - 7, by - 14); ctx.lineTo(X(r.rt) + 7, by - 14); ctx.fill();
        A.text(ctx, `round trip ${fmt(r.rt, 1)} ms`, A.clamp(X(r.rt), 70, w - 70), by - 20, { align: 'center', size: 11, weight: 700 });
        if (r.risk > 1) A.text(ctx, 'clicks and drop-outs likely', w / 2, h - 16, { align: 'center', size: 12, weight: 700, color: A.css('bad') });
      },
    });
    function upd() {
      const r = calc();
      out.innerHTML = A.statBox('One buffer', fmt(r.one, 1) + ' ms', `${st.buf} ÷ ${+st.sr / 1000} kHz`) + A.statBox('Round-trip latency', fmt(r.rt, 1) + ' ms', r.rt < 10 ? 'comfortable to play through' : r.rt < 20 ? 'singers start to notice' : 'too slow to perform', r.rt < 12 ? 'good' : r.rt < 20 ? 'warn' : 'bad') + A.statBox('Feels like standing', A.fmtLen(r.m), 'from your amplifier') + A.statBox('Computer headroom', r.risk > 1 ? 'overloaded' : r.risk > 0.6 ? 'tight' : 'comfortable', 'time to compute each block', r.risk > 1 ? 'bad' : r.risk > 0.6 ? 'warn' : 'good');
      const T = [];
      if (st.mon === 'direct') T.push('Hardware (direct) monitoring bypasses the computer: near-zero delay at any buffer size. You hear the dry input, so add comfort reverb from the interface’s mixer if it has one.');
      else if (r.rt > 12) T.push('For tracking, lower the buffer to 64–128 samples, or switch the performer to direct monitoring and keep the big buffer.');
      if (r.risk > 1) T.push('The computer cannot finish each block in time. Raise the buffer, freeze or bounce heavy tracks, or bypass latency-heavy plug-ins while recording.');
      if (+st.sr === 96000) T.push('At 96 kHz the same buffer is half as long in time — lower latency — but every plug-in does twice the work.');
      if (!T.length) T.push('A sensible tracking set-up. For mixing, raise the buffer to 1024 or more: latency no longer matters and the computer breathes.');
      tip(box, T); cv.redraw();
    }
    upd();
  };
})();
