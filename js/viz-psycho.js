/* ==========================================================================
   Acoustica — listening-science widgets: precedence effect, masking,
   loudspeaker measurement family, ABX comparator and null (difference) test.
   Simplified, indicative teaching models.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2;
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const logF = (key, label, a, b, v) => ({ key, label, type: 'range', min: Math.log10(a), max: Math.log10(b), step: 0.005, value: Math.log10(v), fmt: (x) => fmtHz(Math.pow(10, x)) });
  const volNote = '<p class="small muted" style="margin:.4em 0 0">Keep the volume moderate. Use headphones or two loudspeakers for the stereo demos.</p>';

  /* ======================================================================
     1. Precedence effect lab
     ====================================================================== */
  const SIGS = { click: ['Clicks (sharp transients)', 5], speech: ['Speech-like noise bursts', 35], music: ['Slow, sustained sounds', 70] };
  V.precedenceLab = function (host) {
    const st = A.controls(host, [
      { key: 'd', label: 'Delay of the second sound', type: 'range', min: -1.3, max: 2, step: 0.01, value: Math.log10(8), fmt: (v) => fmt(Math.pow(10, v), 2) + ' ms' },
      { key: 'lv', label: 'Level of the second sound (relative to the first)', type: 'range', min: -20, max: 12, step: 0.5, value: 0, unit: 'dB' },
      { key: 'sig', label: 'Kind of sound', type: 'select', value: 'speech', options: Object.entries(SIGS).map(([k, v]) => [k, v[0]]) },
    ], () => upd());
    const row = el('div', { class: 'row' });
    const pl = el('button', { class: 'primary', html: A.icon('play') + ' Hear it (first = left, second = right)' }), sp = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(pl, sp); host.appendChild(row); host.appendChild(html(volNote));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    function model() {
      const d = Math.pow(10, st.d), base = SIGS[st.sig][1];
      const thr = A.clamp(base * Math.pow(2, -st.lv / 8), 2, 150); // echo threshold falls when the second sound is louder
      let zone, pos, width = 0.06, echo = false;
      if (d < 1) { zone = 'sum'; pos = A.clamp(-(d / 1) * 0.9 + st.lv / 12, -1, 1); width = 0.08; }
      else if (d < thr) { zone = d < thr * 0.35 ? 'fuse' : 'wide'; pos = A.clamp(-1 + Math.max(0, st.lv - 8) / 6, -1, 1); width = 0.08 + 0.45 * Math.min(1, d / thr) * Math.min(1, Math.pow(10, st.lv / 20)); }
      else { zone = 'echo'; pos = -1; echo = true; width = 0.1; }
      return { d, thr, zone, pos, width, echo, loud: 10 * Math.log10(1 + Math.pow(10, st.lv / 10)) };
    }
    pl.onclick = () => {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return;
      const m = model(), sr = ctx.sampleRate, rep = 0.7, n = 5, buf = ctx.createBuffer(2, Math.floor(sr * rep * n), sr), L = buf.getChannelData(0), R = buf.getChannelData(1);
      const g2 = Math.pow(10, st.lv / 20), len = st.sig === 'click' ? 0.002 : st.sig === 'speech' ? 0.12 : 0.3, burst = new Float32Array(Math.floor(sr * len));
      let lp = 0;
      for (let i = 0; i < burst.length; i++) { const u = i / burst.length, env = st.sig === 'click' ? Math.exp(-u * 8) : Math.sin(Math.PI * u) ** (st.sig === 'music' ? 1.5 : 0.6); const w = Math.random() * 2 - 1; lp += (w - lp) * (st.sig === 'click' ? 0.9 : 0.25); burst[i] = lp * env * (st.sig === 'click' ? 0.7 : 0.9); }
      for (let k = 0; k < n; k++) { const i0 = Math.floor(k * rep * sr) + 200, i1 = i0 + Math.round((m.d / 1000) * sr); for (let i = 0; i < burst.length; i++) { if (i0 + i < L.length) L[i0 + i] += burst[i] * 0.35; if (i1 + i < R.length) R[i1 + i] += burst[i] * 0.35 * g2; } }
      const s = ctx.createBufferSource(); s.buffer = buf; const g = ctx.createGain(); g.gain.value = 0.7 / Math.max(1, g2); s.connect(g).connect(ctx.destination); s.start(); A.audio.track(s);
    };
    sp.onclick = () => A.audio.stopAll();
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Top: two loudspeakers and what a listener in the middle perceives — the blob is the sound image, its width shows how broad it seems; a second blob means a separate echo is heard. Bottom: where the chosen delay sits among the four perceptual zones. The boundaries move with the kind of sound and with the level of the second arrival.',
      draw(ctx, w, h, t) {
        const m = model(), tt = Math.max(0, t), cx = w / 2, span = Math.min(w * 0.36, 300), ys = 46;
        [[-1, 'first'], [1, 'second']].forEach(([s, lab]) => { const x = cx + s * span; ctx.fillStyle = A.css('panel2'); ctx.strokeStyle = A.css('text'); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 16, ys - 20, 32, 40, 4); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1; A.text(ctx, lab, x, ys + 36, { align: 'center', size: 10, color: A.css('muted') }); });
        const ph = (tt * 0.9) % 1;
        ctx.strokeStyle = A.alpha(A.css('accent'), 1 - ph); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx - span, ys, 20 + ph * 70, -0.3, 1.3); ctx.stroke();
        const ph2 = ((tt * 0.9) - Math.min(0.45, m.d / 200) + 1) % 1;
        ctx.strokeStyle = A.alpha(A.css('c3'), (1 - ph2) * Math.min(1, Math.pow(10, st.lv / 20))); ctx.beginPath(); ctx.arc(cx + span, ys, 20 + ph2 * 70, Math.PI - 1.3, Math.PI + 0.3); ctx.stroke(); ctx.lineWidth = 1;
        const iy = ys + 78, ix = cx + m.pos * span, rw = Math.max(14, m.width * span * 2);
        ctx.fillStyle = A.alpha(A.css('accent'), 0.35 + 0.1 * Math.sin(tt * 4)); ctx.beginPath(); ctx.ellipse(ix, iy, rw, 14, 0, 0, TAU); ctx.fill(); dot(ctx, ix, iy, 5, A.css('accent'));
        if (m.echo) { ctx.fillStyle = A.alpha(A.css('bad'), 0.3 + 0.2 * Math.sin(tt * 6)); ctx.beginPath(); ctx.ellipse(cx + span, iy, 18, 12, 0, 0, TAU); ctx.fill(); A.text(ctx, 'echo', cx + span, iy + 28, { align: 'center', size: 10, color: A.css('bad') }); }
        A.text(ctx, 'perceived image', ix, iy + 30, { align: 'center', size: 10, color: A.css('accent') });
        dot(ctx, cx, iy + 62, 8, A.css('good')); A.text(ctx, 'listener', cx, iy + 84, { align: 'center', size: 10, color: A.css('muted') });
        // zone strip
        const x0 = 30, x1 = w - 20, y0 = h - 44, X = (ms) => x0 + ((Math.log10(ms) + 1.3) / 3.3) * (x1 - x0);
        const Z = [[0.05, 1, 'good', 'summing'], [1, m.thr * 0.35, 'c3', 'fused: one sound'], [m.thr * 0.35, m.thr, 'warn', 'wider, fuller'], [m.thr, 100, 'bad', 'echo']];
        Z.forEach(([a, b, c, lab]) => { if (b <= a) return; ctx.fillStyle = A.alpha(A.css(c), 0.3); ctx.fillRect(X(a), y0, X(Math.min(100, b)) - X(a), 18); if (X(Math.min(100, b)) - X(a) > 46) A.text(ctx, lab, (X(a) + X(Math.min(100, b))) / 2, y0 + 13, { align: 'center', size: w < 500 ? 8 : 10 }); });
        [0.1, 1, 10, 100].forEach((ms) => A.text(ctx, ms + ' ms', X(ms), y0 + 32, { align: 'center', size: 9, color: A.css('muted') }));
        ctx.fillStyle = A.css('text'); ctx.beginPath(); ctx.moveTo(X(m.d), y0 - 2); ctx.lineTo(X(m.d) - 6, y0 - 12); ctx.lineTo(X(m.d) + 6, y0 - 12); ctx.fill();
      },
    });
    function upd() {
      const m = model();
      const names = { sum: 'Summing localisation', fuse: 'Precedence: fused', wide: 'Precedence: fused but broader', echo: 'Separate echo' };
      out.innerHTML = A.statBox('What you perceive', names[m.zone], m.zone === 'sum' ? 'one image between the speakers' : m.zone === 'echo' ? 'two events' : 'located at the first arrival', m.zone === 'echo' ? 'bad' : m.zone === 'wide' ? 'warn' : 'good') + A.statBox('Echo threshold here', '≈ ' + fmt(m.thr, 2) + ' ms', 'moves with sound type and level') + A.statBox('Extra path of the second sound', A.fmtLen((m.d / 1000) * 343), 'delay × speed of sound') + A.statBox('Loudness added', '+' + fmt(m.loud, 1) + ' dB', 'even when you hear only one sound');
      const T = { sum: 'Under about 1 ms the two arrivals merge into one image whose position depends on both the time and the level difference — this is how stereo panning and spaced microphones create phantom images.', fuse: 'The ear locks on to the first arrival. The later copy is not heard as a separate event, yet it still adds loudness and a little spaciousness. A reflection in this zone needs to be roughly 10 dB louder than the direct sound to pull the image toward itself.', wide: 'Still one event, but the image is broader and the tone may change slightly. In a listening room this is often heard as pleasant spaciousness; at a mix position it can blur precise imaging.', echo: 'Past the echo threshold the delayed sound separates and becomes a distinct repeat. Sharp sounds split after only a few milliseconds; speech after roughly 30–50 ms; slow music tolerates more. Louder delayed sounds split sooner.' };
      tip.innerHTML = `<div class="callout physics">${T[m.zone]}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     2. Masking lab
     ====================================================================== */
  const bark = (f) => 13 * Math.atan(0.00076 * f) + 3.5 * Math.atan(Math.pow(f / 7500, 2));
  const quiet = (f) => { const k = f / 1000; return 3.64 * Math.pow(k, -0.8) - 6.5 * Math.exp(-0.6 * Math.pow(k - 3.3, 2)) + 0.001 * Math.pow(k, 4); };
  V.maskingLab = function (host) {
    const st = A.controls(host, [
      logF('fm', 'Masker frequency', 100, 8000, 1000),
      { key: 'Lm', label: 'Masker level', type: 'range', min: 40, max: 90, step: 1, value: 75, unit: 'dB' },
      { key: 'kind', label: 'Masker type', type: 'select', value: 'noise', options: [['noise', 'Narrow band of noise'], ['tone', 'Pure tone']] },
      logF('fp', 'Probe tone frequency', 100, 12000, 1400),
      { key: 'Lp', label: 'Probe tone level', type: 'range', min: 0, max: 85, step: 1, value: 40, unit: 'dB' },
    ], () => upd());
    const row = el('div', { class: 'row' });
    const b1 = el('button', { class: 'primary', html: A.icon('play') + ' Masker + probe' }), b2 = el('button', { html: A.icon('play') + ' Masker only' }), b3 = el('button', { html: A.icon('play') + ' Probe only' }), b4 = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(b1, b2, b3, b4); host.appendChild(row); host.appendChild(html(volNote));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const thr = (f) => {
      const fm = Math.pow(10, st.fm), dz = bark(f) - bark(fm), off = st.kind === 'noise' ? 5 : 16;
      const up = Math.max(6, 24 + 230 / fm - 0.2 * st.Lm);
      const m = st.Lm - off - (dz < 0 ? 27 * -dz : up * dz);
      return Math.max(m, quiet(f));
    };
    function play(mask, probe) {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return;
      const g = (L) => Math.pow(10, (L - 96) / 20) * 0.9, fm = Math.pow(10, st.fm), fp = Math.pow(10, st.fp), t0 = ctx.currentTime;
      if (mask) {
        const mg = ctx.createGain(); mg.gain.value = g(st.Lm); mg.connect(ctx.destination);
        if (st.kind === 'tone') { const o = ctx.createOscillator(); o.frequency.value = fm; o.connect(mg); o.start(); o.stop(t0 + 4); A.audio.track(o); }
        else { const s = ctx.createBufferSource(); s.buffer = A.audio.noiseBuffer('white', 4); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fm; bp.Q.value = 6; const bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = fm; bp2.Q.value = 6; const boost = ctx.createGain(); boost.gain.value = 9; s.connect(bp).connect(bp2).connect(boost).connect(mg); s.start(); s.stop(t0 + 4); A.audio.track(s); }
      }
      if (probe) { const o = ctx.createOscillator(), pg = ctx.createGain(); o.frequency.value = fp; pg.gain.value = 0; for (let k = 0; k < 5; k++) { pg.gain.setValueAtTime(0, t0 + k * 0.8); pg.gain.linearRampToValueAtTime(g(st.Lp), t0 + k * 0.8 + 0.04); pg.gain.setValueAtTime(g(st.Lp), t0 + k * 0.8 + 0.4); pg.gain.linearRampToValueAtTime(0, t0 + k * 0.8 + 0.45); } o.connect(pg).connect(ctx.destination); o.start(); o.stop(t0 + 4); A.audio.track(o); }
    }
    b1.onclick = () => play(true, true); b2.onclick = () => play(true, false); b3.onclick = () => play(false, true); b4.onclick = () => A.audio.stopAll();
    const cv = A.canvas(host, {
      height: 290,
      caption: 'The tall bar is the masker; the dot is the probe tone. The curve is the approximate level a tone must exceed to be heard while the masker plays: it rises steeply just below the masker, falls slowly above it (masking spreads upward, more so when loud), and joins the threshold of hearing in quiet far away. Levels here are relative — they depend on your playback volume.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 50, max: 16000, log: true, label: 'Frequency (Hz)', ticks: [50, 100, 200, 500, 1000, 2000, 5000, 10000] }, y: { min: -10, max: 95, label: 'Level (dB)' } });
        const fs = []; for (let f = 50; f <= 16000; f *= 1.02) fs.push(f);
        A.plotLine(ctx, ax, fs.map((f) => [f, A.clamp(quiet(f), -10, 95)]), A.alpha(A.css('muted'), 0.8), 1.4, [5, 4]);
        A.plotFill(ctx, ax, fs.map((f) => [f, A.clamp(thr(f), -10, 95)]), A.alpha(A.css('warn'), 0.15), -10);
        A.plotLine(ctx, ax, fs.map((f) => [f, A.clamp(thr(f), -10, 95)]), A.css('warn'), 2.4);
        const fm = Math.pow(10, st.fm), fp = Math.pow(10, st.fp);
        ctx.fillStyle = A.css('accent2'); ctx.fillRect(ax.X(fm) - (st.kind === 'noise' ? 9 : 3), ax.Y(st.Lm), st.kind === 'noise' ? 18 : 6, ax.y0 - ax.Y(st.Lm));
        const aud = st.Lp > thr(fp);
        ctx.strokeStyle = aud ? A.css('good') : A.css('bad'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax.X(fp), ax.y0); ctx.lineTo(ax.X(fp), ax.Y(st.Lp)); ctx.stroke(); ctx.lineWidth = 1;
        dot(ctx, ax.X(fp), ax.Y(st.Lp), 7, aud ? A.css('good') : A.css('bad'));
        A.text(ctx, aud ? 'audible' : 'masked', ax.X(fp) + 10, ax.Y(st.Lp) - 6, { size: 11, weight: 700, color: aud ? A.css('good') : A.css('bad'), bg: A.alpha(A.css('panel'), 0.8) });
      },
    });
    host.appendChild(A.legend([[A.css('warn'), 'Masked threshold'], [A.css('muted'), 'Threshold in quiet', true], [A.css('accent2'), 'Masker']]));
    function upd() {
      const fp = Math.pow(10, st.fp), fm = Math.pow(10, st.fm), th = thr(fp), aud = st.Lp > th, above = fp > fm;
      out.innerHTML = A.statBox('Probe tone is', aud ? 'audible' : 'masked', aud ? `${fmt(st.Lp - th, 1)} dB above the threshold` : `${fmt(th - st.Lp, 1)} dB too quiet`, aud ? 'good' : 'bad') + A.statBox('Threshold at the probe', fmt(th, 1) + ' dB', th - quiet(fp) > 3 ? `raised ${fmt(th - quiet(fp), 1)} dB by the masker` : 'not affected by the masker') + A.statBox('Probe sits', above ? 'above the masker' : 'below the masker', above ? 'masking reaches far upward' : 'masking falls off quickly downward') + A.statBox('Distance apart', fmt(Math.abs(bark(fp) - bark(fm)), 1) + ' critical bands', '');
      tip.innerHTML = `<div class="callout mentor">${aud ? 'Try moving the probe closer to the masker, or raising the masker level: watch how much further the masking reaches on the high side than on the low side.' : 'This is why a loud bass or low-mid sound hides quieter detail above it, why low-level distortion and noise can be inaudible under music, and why clearing a little low-mid from one instrument can reveal another.'}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     3. Loudspeaker measurement family ("spin" curves) and predicted room curve
     ====================================================================== */
  const lg = (f) => Math.log10(f);
  const bump = (f, f0, g, q) => { const x = q * (f / f0 - f0 / f); return g / (1 + x * x); };
  const hp = (f, fc) => -10 * Math.log10(1 + Math.pow(fc / f, 4));
  const smoothDI = (f, top = 9) => A.clamp(((lg(f) - lg(150)) / (lg(10000) - lg(150))) * top, 0, top + 2) + (f > 10000 ? (lg(f) - 4) * 6 : 0);
  const SPK = {
    good: { name: 'Well-designed two-way with a waveguide', on: (f) => hp(f, 42) + 0.4 * Math.sin(lg(f) * 9), di: (f) => smoothDI(f), note: 'Flat, smooth direct sound and a directivity that rises steadily. Reflections have the same character as the direct sound, so the room curve tilts gently and evenly.' },
    mismatch: { name: 'Two-way without a waveguide (directivity mismatch)', on: (f) => hp(f, 48) + 0.5 * Math.sin(lg(f) * 8), di: (f) => smoothDI(f, 8) + bump(f, 1900, 3.5, 1.6) - bump(f, 3600, 4.5, 1.4), note: 'Flat on axis, but the woofer beams just below the crossover and the small tweeter sprays widely just above it. Off-axis sound has a dip then a flare, so reflections are coloured.' },
    boomy: { name: 'Resonant, boomy box', on: (f) => hp(f, 55) + bump(f, 115, 5.5, 3) + bump(f, 720, 3, 5) + 0.5 * Math.sin(lg(f) * 10), di: (f) => smoothDI(f), note: 'Resonances appear as bumps at the same frequency in every curve. They ring on after the note stops and are audible even when small.' },
    bright: { name: 'Bright “showroom” voicing', on: (f) => hp(f, 50) - bump(f, 3000, 2.5, 1.2) + (f > 4500 ? Math.min(5, (lg(f) - lg(4500)) * 9) : 0) + bump(f, 90, 2.5, 1.5), di: (f) => smoothDI(f), note: 'Impressive for thirty seconds, tiring after an hour. The lifted treble and bass make everything else sound dull by comparison in a quick demo.' },
    small: { name: 'Small speaker, good manners, little bass', on: (f) => hp(f, 95) + 0.4 * Math.sin(lg(f) * 9), di: (f) => smoothDI(f, 8), note: 'Clean and neutral but rolls off below about 100 Hz. With a well-integrated subwoofer it can outperform a larger, less neutral speaker.' },
  };
  V.SPEAKER_TYPES = SPK;
  V.spinorama = function (host) {
    const st = A.controls(host, [
      { key: 'k', label: 'Loudspeaker', type: 'select', value: 'good', options: Object.entries(SPK).map(([k, v]) => [k, v.name]) },
      { key: 'eq', label: 'Equalise the in-room curve flat to the target above 300 Hz', type: 'check', value: false },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    const fs = []; for (let f = 20; f <= 20000; f *= 1.03) fs.push(f);
    const target = (f) => -1.0 * (lg(f) - lg(1000)) * 3.2;                       // gentle downward tilt, about 1 dB per octave
    function curves() {
      const s = SPK[st.k];
      const raw = fs.map((f) => { const on = s.on(f), di = s.di(f); return { f, on, lw: on - di * 0.12, er: on - di * 0.72, sp: on - di, di, erdi: di * 0.72 }; });
      const pir = (c) => 0.12 * c.lw + 0.44 * c.er + 0.44 * c.sp;
      const ref = pir(raw[fs.findIndex((f) => f >= 1000)]);
      const eq = raw.map((c) => (st.eq && c.f > 300 ? -(pir(c) - ref - target(c.f)) : 0));
      return raw.map((c, i) => ({ f: c.f, on: c.on + eq[i], lw: c.lw + eq[i], er: c.er + eq[i], sp: c.sp + eq[i], di: c.di, pir: pir(c) + eq[i] - ref }));
    }
    function score(C) {
      const band = C.filter((c) => c.f >= 200 && c.f <= 12000);
      const dev = Math.sqrt(band.reduce((s, c) => s + c.on * c.on, 0) / band.length);
      let rough = 0; for (let i = 1; i < band.length; i++) rough += Math.abs((band[i].pir - target(band[i].f)) - (band[i - 1].pir - target(band[i - 1].f)));
      rough /= band.length;
      const f6 = (C.find((c) => c.on > -6) || { f: 200 }).f;
      return A.clamp(9.2 - dev * 1.5 - rough * 9 - Math.max(0, Math.log2(f6 / 35)) * 1.1, 1, 9.5);
    }
    let C = curves();
    const cv = A.canvas(host, {
      height: 340,
      caption: 'One loudspeaker, measured all round without a room. From the top: the direct sound on axis; the average over the listening window; the average of the directions that become the first reflections; the average over the whole sphere (sound power). At the bottom, the directivity index — the gap between direct sound and sound power. The heavy line is the response predicted at the seat in a typical room, with the dashed target tilt.',
      draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)', ticks: [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000] }, y: { min: -36, max: 10, label: 'dB (curves offset for clarity)' } });
        const L = (key, off, col, wd, dash) => A.plotLine(ctx, ax, C.map((c) => [c.f, A.clamp(c[key] + off, -36, 10)]), col, wd, dash);
        L('on', 4, A.css('accent'), 2.4); L('lw', 2, A.css('good'), 1.6); L('er', 0, A.css('c3'), 1.6); L('sp', -2, A.css('accent2'), 1.6);
        A.plotLine(ctx, ax, C.map((c) => [c.f, target(c.f) - 16]), A.alpha(A.css('muted'), 0.9), 1.2, [5, 4]);
        A.plotLine(ctx, ax, C.map((c) => [c.f, A.clamp(c.pir - 16, -36, 10)]), A.css('text'), 3);
        A.plotLine(ctx, ax, C.map((c) => [c.f, A.clamp(c.di - 34, -36, 10)]), A.css('warn'), 2);
        A.text(ctx, 'predicted in-room', ax.x1 - 6, ax.Y(-12), { align: 'right', size: 10, bg: A.alpha(A.css('panel'), 0.8) });
        A.text(ctx, 'directivity index', ax.x1 - 6, ax.Y(-29), { align: 'right', size: 10, color: A.css('warn'), bg: A.alpha(A.css('panel'), 0.8) });
      },
    });
    host.appendChild(A.legend([[A.css('accent'), 'On axis'], [A.css('good'), 'Listening window'], [A.css('c3'), 'Early reflections'], [A.css('accent2'), 'Sound power'], [A.css('text'), 'Predicted in-room'], [A.css('warn'), 'Directivity index']]));
    const bar = el('div', { class: 'progress-bar', style: { marginTop: '8px' } }); host.appendChild(bar);
    function upd() {
      C = curves(); const s = SPK[st.k], sc = score(C), band = C.filter((c) => c.f >= 200 && c.f <= 12000);
      const onDev = Math.max(...band.map((c) => c.on)) - Math.min(...band.map((c) => c.on));
      const f6 = (C.find((c) => c.on > -6) || { f: 200 }).f;
      out.innerHTML = A.statBox('Direct sound, 200 Hz–12 kHz', '± ' + fmt(onDev / 2, 1) + ' dB', onDev < 3 ? 'flat and smooth' : onDev < 6 ? 'audibly coloured' : 'strongly coloured', onDev < 3 ? 'good' : onDev < 6 ? 'warn' : 'bad') + A.statBox('Bass reaches (−6 dB)', fmtHz(f6), f6 > 70 ? 'add a subwoofer' : 'full enough for most music') + A.statBox('Predicted preference', fmt(sc, 1) + ' / 10', 'indicative, from smoothness and bass', sc > 6.5 ? 'good' : sc > 4.5 ? 'warn' : 'bad');
      bar.innerHTML = `<i style="width:${sc * 10}%"></i>`;
      const eqMsg = st.eq ? (st.k === 'mismatch' ? ' <b>With room EQ on:</b> the in-room curve now follows the target, but look at the top line — the direct sound has gained a bump and a dip. The equaliser “fixed” the reflections by damaging the sound that reaches you first.' : st.k === 'good' ? ' <b>With room EQ on:</b> almost nothing changes, because the speaker already produces the target on its own.' : ' <b>With room EQ on:</b> because this fault is the same in every direction (it is in the speaker’s direct sound), equalising does genuinely help here — the on-axis curve flattens too.') : '';
      tip.innerHTML = `<div class="callout mentor">${s.note}${eqMsg}</div>`;
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. ABX comparator
     ====================================================================== */
  const binomP = (n, c) => { let p = 0; const C2 = (nn, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (nn - k + i)) / i; return r; }; for (let k = c; k <= n; k++) p += C2(n, k); return p / Math.pow(2, n); };
  V.binomP = binomP;
  V.abxTest = function (host) {
    const st = A.controls(host, [
      { key: 'src', label: 'Test sound', type: 'select', value: 'pink', options: [['pink', 'Pink noise'], ['chord', 'Sustained chord (tone complex)']] },
      { key: 'kind', label: 'Difference between A and B', type: 'select', value: 'level', options: [['level', 'B is louder'], ['eq', 'B has a narrow 1 kHz boost'], ['dist', 'B has added harmonic distortion']] },
      { key: 'amt', label: 'Size of the difference', type: 'range', min: 0, max: 1, step: 0.01, value: 0.33, fmt: (v) => { try { return label(v); } catch (e) { return ''; } } },
      { key: 'n', label: 'Number of trials', type: 'select', value: '12', options: [['8', '8'], ['12', '12'], ['16', '16'], ['20', '20']] },
    ], () => { st.set('amt', st.amt, true); reset(); });
    function amount(v = st.amt) { return st.kind === 'level' ? 0.1 + v * 2.9 : st.kind === 'eq' ? 0.3 + v * 5.7 : 0.1 + v * 9.9; }
    function label(v) { const a = amount(v); return st.kind === 'level' ? '+' + a.toFixed(1) + ' dB' : st.kind === 'eq' ? '+' + a.toFixed(1) + ' dB at 1 kHz' : a.toFixed(1) + ' % distortion'; }
    const row = el('div', { class: 'row' });
    const bA = el('button', { html: A.icon('play') + ' Play A' }), bB = el('button', { html: A.icon('play') + ' Play B' }), bX = el('button', { class: 'primary', html: A.icon('play') + ' Play X' }), bS = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(bA, bB, bX, bS); host.appendChild(row);
    const row2 = el('div', { class: 'row', style: { marginTop: '8px' } });
    const gA = el('button', {}, 'X is A'), gB = el('button', {}, 'X is B'), rs = el('button', {}, 'Start again');
    row2.append(gA, gB, rs); host.appendChild(row2); host.appendChild(html(volNote));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    let trials = [], x = Math.random() < 0.5 ? 'A' : 'B', bufs = {};
    st.set('amt', st.amt, true);
    function source(ctx) {
      const key = st.src; if (bufs[key]) return bufs[key];
      const sr = ctx.sampleRate, n = sr * 3, buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
      if (key === 'pink') { const p = A.audio.noiseBuffer('pink', 3).getChannelData(0); for (let i = 0; i < n; i++) d[i] = p[i] * 1.6; }
      else { const fr = [220, 277.2, 329.6, 440, 554.4, 880]; for (let i = 0; i < n; i++) { let v = 0; fr.forEach((f, k) => { v += Math.sin((TAU * f * i) / sr) / (k + 2); }); d[i] = v * 0.22; } }
      for (let i = 0; i < 2000; i++) { d[i] *= i / 2000; d[n - 1 - i] *= i / 2000; }
      return (bufs[key] = buf);
    }
    function play(which) {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return;
      const s = ctx.createBufferSource(); s.buffer = source(ctx); let node = s; const isB = which === 'B', a = amount();
      const g = ctx.createGain(); g.gain.value = 0.32;
      if (isB && st.kind === 'level') g.gain.value = 0.32 * Math.pow(10, a / 20);
      if (isB && st.kind === 'eq') { const f = ctx.createBiquadFilter(); f.type = 'peaking'; f.frequency.value = 1000; f.Q.value = 4.3; f.gain.value = a; node.connect(f); node = f; }
      if (isB && st.kind === 'dist') { const ws = ctx.createWaveShaper(), cv2 = new Float32Array(1025), k = a / 100; for (let i = 0; i < 1025; i++) { const xx = (i / 512) - 1; cv2[i] = xx + k * 4 * (xx * xx - 0.12) + k * 2 * xx * xx * xx; } ws.curve = cv2; node.connect(ws); node = ws; }
      node.connect(g).connect(ctx.destination); s.start(); A.audio.track(s);
    }
    bA.onclick = () => play('A'); bB.onclick = () => play('B'); bX.onclick = () => play(x); bS.onclick = () => A.audio.stopAll();
    function guess(v) { if (trials.length >= +st.n) return; trials.push({ x, g: v }); x = Math.random() < 0.5 ? 'A' : 'B'; A.audio.stopAll(); upd(); }
    gA.onclick = () => guess('A'); gB.onclick = () => guess('B');
    function reset() { trials = []; x = Math.random() < 0.5 ? 'A' : 'B'; A.audio.stopAll(); upd(); }
    rs.onclick = reset;
    const cv = A.canvas(host, {
      height: 150,
      caption: 'Each square is one trial. Results stay hidden until the last trial so that feedback cannot coach you. A reliable “yes, I hear it” needs a score that guessing would rarely produce — conventionally a chance probability under 5 %.',
      draw(ctx, w, h) {
        const n = +st.n, done = trials.length >= n, bw = Math.min(40, (w - 30) / n), x0 = (w - bw * n) / 2;
        for (let i = 0; i < n; i++) { const tr = trials[i]; ctx.fillStyle = !tr ? A.alpha(A.css('muted'), 0.15) : !done ? A.alpha(A.css('accent'), 0.5) : tr.x === tr.g ? A.css('good') : A.css('bad'); ctx.beginPath(); ctx.roundRect(x0 + i * bw + 2, 30, bw - 4, 46, 5); ctx.fill(); A.text(ctx, String(i + 1), x0 + i * bw + bw / 2, 58, { align: 'center', size: 11, weight: 700, color: tr && done ? '#fff' : A.css('text') }); if (tr && done) A.text(ctx, tr.x, x0 + i * bw + bw / 2, 94, { align: 'center', size: 10, color: A.css('muted') }); }
        A.text(ctx, done ? 'finished — the letter under each square is what X really was' : `trial ${trials.length + 1} of ${n}: play A, B and X as often as you like, then decide`, w / 2, 18, { align: 'center', size: 11, color: A.css('muted') });
      },
    });
    function upd() {
      const n = +st.n, done = trials.length >= n, c = trials.filter((t) => t.x === t.g).length;
      gA.disabled = gB.disabled = done;
      const need = (() => { for (let k = 0; k <= n; k++) if (binomP(n, k) < 0.05) return k; return n; })();
      out.innerHTML = A.statBox('Difference under test', label(st.amt), '') + A.statBox('Trials done', `${trials.length} / ${n}`, done ? 'finished' : 'score hidden until the end') + A.statBox('Needed for a reliable result', `${need} of ${n}`, 'chance below 5 %') + (done ? A.statBox('Your score', `${c} of ${n}`, `guessing gives this or better ${fmt(binomP(n, c) * 100, 1)} % of the time`, binomP(n, c) < 0.05 ? 'good' : 'warn') : '');
      tip.innerHTML = done ? `<div class="callout ${binomP(n, c) < 0.05 ? 'mentor' : 'warn'}">${binomP(n, c) < 0.05 ? 'You reliably heard this difference. Now halve it and try again to find where it disappears for you.' : 'This score is what guessing would give — which does not prove the difference is inaudible to everyone, only that it was not demonstrated here. Make the difference bigger and work down.'}</div>` : '<div class="callout data">Notice how obvious a level difference of 1 dB is when you can see which is which — and how much harder even that becomes when you cannot. A is always the reference, B always carries the change, and X is secretly one of them.</div>';
      cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Null (difference) test
     ====================================================================== */
  const NULLS = { same: ['Identical copies', () => ''], level: ['Level offset', (v) => (0.02 + v * 1.98).toFixed(2) + ' dB'], delay: ['Tiny time offset', (v) => Math.round(1 + v * 23) + ' sample(s) at 48 kHz'], eq: ['Gentle treble tilt', (v) => (0.1 + v * 2.9).toFixed(1) + ' dB at 10 kHz'], dist: ['Added distortion', (v) => (0.01 * Math.pow(10, v * 3)).toFixed(2) + ' %'] };
  V.nullTest = function (host) {
    const st = A.controls(host, [
      { key: 'kind', label: 'How “file B” differs from “file A”', type: 'select', value: 'level', options: Object.entries(NULLS).map(([k, v]) => [k, v[0]]) },
      { key: 'amt', label: 'Size of the difference', type: 'range', min: 0, max: 1, step: 0.01, value: 0.25, fmt: (v) => { try { return NULLS[st.kind][1](v); } catch (e) { return ''; } } },
    ], () => { st.set('amt', st.amt, true); upd(); });
    const row = el('div', { class: 'row' });
    const pA = el('button', { html: A.icon('play') + ' Play A' }), pR = el('button', { class: 'primary', html: A.icon('play') + ' Play the residual (A − B) at its true level' }), pS = el('button', { html: A.icon('stop') + ' Stop' });
    row.append(pA, pR, pS); host.appendChild(row); host.appendChild(html(volNote));
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = el('div'); host.appendChild(tip);
    st.set('amt', st.amt, true);
    const SR = 48000, FR = [[196, 1], [392, 0.6], [587, 0.45], [1175, 0.3], [2349, 0.2], [4699, 0.12], [9397, 0.07]];
    const sigA = (i) => FR.reduce((s, [f, a], k) => s + a * Math.sin((TAU * f * i) / SR + k), 0) * 0.3;
    function sigB(i) {
      const v = st.amt;
      if (st.kind === 'same') return sigA(i);
      if (st.kind === 'level') return sigA(i) * Math.pow(10, (0.02 + v * 1.98) / 20);
      if (st.kind === 'delay') return sigA(i - Math.round(1 + v * 23));
      if (st.kind === 'eq') { const g = 0.1 + v * 2.9; return FR.reduce((s, [f, a], k) => s + a * Math.pow(10, (g * Math.min(1, Math.log2(Math.max(1, f / 1000)) / 3.3)) / 20) * Math.sin((TAU * f * i) / SR + k), 0) * 0.3; }
      const k = (0.01 * Math.pow(10, v * 3)) / 100, x = sigA(i); return x + k * 3.2 * (x * x - 0.06) * 1.0 + k * 2 * x * x * x;
    }
    function resid() { let sa = 0, sr = 0; const N = 9600; for (let i = 0; i < N; i++) { const a = sigA(i), r = a - sigB(i); sa += a * a; sr += r * r; } return sr <= 1e-18 ? -Infinity : 10 * Math.log10(sr / sa); }
    function play(res) {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return;
      const n = ctx.sampleRate * 2.5, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0), k = SR / ctx.sampleRate;
      for (let i = 0; i < n; i++) { const j = i * k; d[i] = (res ? sigA(j) - sigB(j) : sigA(j)) * Math.min(1, i / 2000, (n - i) / 2000); }
      const s = ctx.createBufferSource(); s.buffer = buf; const g = ctx.createGain(); g.gain.value = 0.8; s.connect(g).connect(ctx.destination); s.start(); A.audio.track(s);
    }
    pA.onclick = () => play(false); pR.onclick = () => play(true); pS.onclick = () => A.audio.stopAll();
    const cv = A.canvas(host, {
      height: 300,
      caption: 'Top: file A. Middle: file B. Bottom: what is left when B is subtracted from A, sample by sample, drawn at the same scale. If two files are truly identical, nothing is left. Whatever remains is the complete difference — however it is described in the advertising.',
      draw(ctx, w, h) {
        const x0 = 70, x1 = w - 12, N = 480, rowH = (h - 30) / 3;
        [['File A', sigA, A.css('accent')], ['File B', sigB, A.css('c3')], ['A − B', (i) => sigA(i) - sigB(i), A.css('bad')]].forEach(([lab, fn, col], r) => {
          const mid = 14 + rowH * r + rowH / 2;
          ctx.strokeStyle = A.alpha(A.css('muted'), 0.4); ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1, mid); ctx.stroke();
          A.text(ctx, lab, x0 - 8, mid + 4, { align: 'right', size: 11, weight: 700, color: col });
          ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath();
          for (let i = 0; i <= N; i++) { const y = mid - fn(i) * rowH * 0.62; i ? ctx.lineTo(x0 + (i / N) * (x1 - x0), y) : ctx.moveTo(x0, y); }
          ctx.stroke(); ctx.lineWidth = 1;
        });
      },
    });
    function upd() {
      const r = resid(), v = st.amt;
      out.innerHTML = A.statBox('Residual level', isFinite(r) ? fmt(r, 1) + ' dB' : '−∞ (perfect null)', 'relative to the signal', !isFinite(r) || r < -70 ? 'good' : r < -40 ? 'warn' : 'bad') + A.statBox('Difference applied', NULLS[st.kind][0], NULLS[st.kind][1](v)) + A.statBox('Likely audibility', !isFinite(r) ? 'none — they are the same' : r < -80 ? 'far below anything audible' : r < -55 ? 'buried under the music' : r < -30 ? 'may be audible in careful comparison' : 'clearly audible', '');
      const T = { same: 'A perfect null: the two files are bit-for-bit the same signal. No amount of careful listening can find a difference that does not exist.', level: 'A small level offset leaves a residual that is simply a quiet copy of the music: 0.1 dB leaves about −39 dB, 1 dB about −18 dB. A big residual does not always mean a big audible change — but unmatched levels will bias any listening comparison.', delay: 'A shift of even one sample leaves a large, treble-heavy residual although the two files sound identical. Always time-align (and level-match) before nulling, or the test tells you nothing.', eq: 'The residual contains only the part of the spectrum that changed. Listening to it tells you <i>what</i> changed; its level tells you how much.', dist: 'Distortion leaves new frequencies that were never in file A. At a fraction of a percent the residual sits 50–80 dB down, where music normally masks it.' };
      tip.innerHTML = `<div class="callout physics">${T[st.kind]}</div>`;
      cv.redraw();
    }
    upd();
  };
})();
