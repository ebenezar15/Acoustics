/* ==========================================================================
   Acoustica — mixing & mastering widgets.
   miniMixer, freqMap, envelopeShaper, delayCalc, depthStage, loudnessLab.
   Simplified teaching tools; all audio is synthesised in the browser.
   ========================================================================== */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz } = A;
  const TAU = Math.PI * 2;
  const dB = (x) => 20 * Math.log10(Math.max(x, 1e-6));
  const lin = (d) => Math.pow(10, d / 20);
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const tipBox = (host) => { const d = el('div'); host.appendChild(d); return (items, cls = 'mentor') => { d.innerHTML = `<div class="callout ${cls}"><ul style="margin:0;padding-left:18px">${items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`; }; };
  let whiteBuf = null;
  const white = (ctx) => { if (!whiteBuf || whiteBuf.sampleRate !== ctx.sampleRate) { whiteBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = whiteBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } return whiteBuf; };

  /* ======================================================================
     1. Mini mixer — five synthesised stems you can balance
     ====================================================================== */
  const STEMS = [
    { id: 'kick', name: 'Kick', band: [40, 110], extra: [2000, 4500], col: 'c3' },
    { id: 'snare', name: 'Snare & hat', band: [160, 260], extra: [1500, 11000], col: 'warn' },
    { id: 'bass', name: 'Bass', band: [40, 260], extra: [500, 1200], col: 'accent2' },
    { id: 'pad', name: 'Chord pad', band: [110, 1800], extra: null, col: 'c4' },
    { id: 'lead', name: 'Lead melody', band: [400, 4500], extra: null, col: 'accent' },
  ];
  const PRE = {
    raw: { kick: [0.8, 0, 0, false], snare: [0.8, 0, 0, false], bass: [0.8, 0, 0, false], pad: [0.8, 0, 0, false], lead: [0.8, 0, 0, false] },
    bal: { kick: [0.82, 0, 1, false], snare: [0.66, 0.05, 1, true], bass: [0.7, 0, -1, false], pad: [0.42, -0.55, -2, true], lead: [0.62, 0.35, 2, true] },
  };
  V.miniMixer = function (host) {
    const S = {}; STEMS.forEach((s) => (S[s.id] = { fader: 0.8, pan: 0, tone: 0, hp: false, mute: false, solo: false }));
    let mono = false, playing = false, timer = null, nodes = null, step = 0, nextT = 0, level = 0;
    const bar = el('div', { class: 'row' });
    const bPlay = el('button', { class: 'primary', html: A.icon('play') + ' Play the loop' }), bRaw = el('button', {}, 'Raw: all centre, same level'), bBal = el('button', {}, 'A balanced starting point'), bMono = el('button', {}, 'Mono check: off');
    bar.append(bPlay, bRaw, bBal, bMono); host.appendChild(bar);
    const strips = el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))', gap: '8px', margin: '10px 0' } }); host.appendChild(strips);
    const ui = {};
    STEMS.forEach((s) => {
      const c = el('div', { class: 'card', style: { background: 'var(--panel2)', padding: '8px 10px', borderTop: `4px solid var(--${s.col})` } });
      c.innerHTML = `<b>${s.name}</b>
        <label class="small" style="display:block;margin-top:4px">Level <input data-k="fader" type="range" min="0" max="1" step="0.01" value="0.8" style="width:100%"></label>
        <label class="small" style="display:block">Pan <input data-k="pan" type="range" min="-1" max="1" step="0.05" value="0" style="width:100%"></label>
        <label class="small" style="display:block">Tone <input data-k="tone" type="range" min="-6" max="6" step="1" value="0" style="width:100%"></label>
        <label class="small" style="display:flex;gap:6px;align-items:center"><input data-k="hp" type="checkbox"> High-pass</label>
        <div class="row" style="margin-top:4px;gap:4px"><button data-k="mute" style="padding:2px 10px">M</button><button data-k="solo" style="padding:2px 10px">S</button></div>`;
      c.addEventListener('input', (e) => { const k = e.target.dataset.k; if (!k) return; S[s.id][k] = e.target.type === 'checkbox' ? e.target.checked : +e.target.value; apply(); });
      c.addEventListener('click', (e) => { const k = e.target.dataset.k; if (k !== 'mute' && k !== 'solo') return; S[s.id][k] = !S[s.id][k]; e.target.classList.toggle('primary', S[s.id][k]); apply(); });
      ui[s.id] = c; strips.appendChild(c);
    });
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = tipBox(host);
    const audible = (id) => { const any = STEMS.some((s) => S[s.id].solo); return any ? S[id].solo : !S[id].mute; };
    function syncUI() { STEMS.forEach((s) => { const c = ui[s.id]; ['fader', 'pan', 'tone'].forEach((k) => (c.querySelector(`[data-k="${k}"]`).value = S[s.id][k])); c.querySelector('[data-k="hp"]').checked = S[s.id].hp; ['mute', 'solo'].forEach((k) => c.querySelector(`[data-k="${k}"]`).classList.toggle('primary', S[s.id][k])); }); }
    function apply() {
      if (nodes) { const t = nodes.ctx.currentTime; STEMS.forEach((s) => { const n = nodes.ch[s.id], v = S[s.id]; n.fader.gain.setTargetAtTime(audible(s.id) ? v.fader * v.fader : 0, t, 0.02); n.pan.pan.setTargetAtTime(mono ? 0 : v.pan, t, 0.02); n.hp.frequency.setTargetAtTime(v.hp ? (s.id === 'pad' ? 220 : s.id === 'lead' ? 300 : s.id === 'snare' ? 140 : 60) : 20, t, 0.02); n.tone.gain.setTargetAtTime(v.tone, t, 0.02); }); }
      upd(); cv.redraw();
    }
    function build() {
      const ctx = A.audio.get(); if (!ctx) return null;
      const master = ctx.createGain(); master.gain.value = 0.5;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -6; comp.ratio.value = 8;
      const an = ctx.createAnalyser(); an.fftSize = 512;
      master.connect(comp).connect(an).connect(ctx.destination);
      const ch = {};
      STEMS.forEach((s) => { const inp = ctx.createGain(), hp = ctx.createBiquadFilter(), tone = ctx.createBiquadFilter(), fader = ctx.createGain(), pan = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain(); hp.type = 'highpass'; hp.frequency.value = 20; tone.type = s.id === 'kick' || s.id === 'bass' ? 'peaking' : 'highshelf'; tone.frequency.value = s.id === 'kick' ? 3000 : s.id === 'bass' ? 800 : 3500; tone.Q.value = 0.9; if (!pan.pan) pan.pan = { setTargetAtTime() {} }; inp.connect(hp).connect(tone).connect(fader).connect(pan).connect(master); ch[s.id] = { inp, hp, tone, fader, pan }; });
      return { ctx, master, an, ch, buf: new Float32Array(512) };
    }
    const BASS = [55, 0, 55, 0, 0, 55, 0, 65.4, 73.4, 0, 73.4, 0, 0, 65.4, 0, 49];
    const LEAD = [440, 0, 523.3, 0, 587.3, 0, 523.3, 0, 440, 0, 392, 0, 440, 0, 0, 0, 523.3, 0, 587.3, 0, 659.3, 0, 587.3, 0, 523.3, 0, 440, 0, 392, 0, 0, 0];
    const CHORDS = [[220, 261.6, 329.6], [174.6, 220, 261.6]];
    function voice(ctx, dest, type, f, t, dur, peak, lp) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      if (lp) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl).connect(g); } else o.connect(g);
      g.connect(dest); o.start(t); o.stop(t + dur + 0.05); return o;
    }
    function noise(ctx, dest, t, dur, peak, type, f) { const s = ctx.createBufferSource(); s.buffer = white(ctx); const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = 0.8; const g = ctx.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); s.connect(fl).connect(g).connect(dest); s.start(t, Math.random() * 0.5, dur + 0.05); }
    function schedule() {
      if (!nodes) return; const { ctx, ch } = nodes, sp = 60 / 100 / 4;
      while (nextT < ctx.currentTime + 0.16) {
        const i = step % 32, t = nextT;
        if (i % 8 === 0 || i === 6 || i === 22) { const o = voice(ctx, ch.kick.inp, 'sine', 130, t, 0.28, 0.95); o.frequency.exponentialRampToValueAtTime(45, t + 0.1); noise(ctx, ch.kick.inp, t, 0.02, 0.25, 'bandpass', 3000); }
        if (i % 8 === 4) { noise(ctx, ch.snare.inp, t, 0.16, 0.6, 'bandpass', 1900); voice(ctx, ch.snare.inp, 'triangle', 190, t, 0.1, 0.4); }
        if (i % 2 === 0) noise(ctx, ch.snare.inp, t, 0.035, 0.16, 'highpass', 7500);
        const bf = BASS[i % 16]; if (bf) voice(ctx, ch.bass.inp, 'sawtooth', bf * (i >= 16 ? 0.794 : 1), t, sp * 1.8, 0.55, 500);
        if (i % 16 === 0) CHORDS[(i / 16) | 0].forEach((f) => { const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = 1500; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + 0.25); g.gain.setValueAtTime(0.16, t + sp * 14); g.gain.linearRampToValueAtTime(0, t + sp * 16); o.connect(fl).connect(g).connect(ch.pad.inp); o.start(t); o.stop(t + sp * 16 + 0.05); });
        const lf = LEAD[i]; if (lf) voice(ctx, ch.lead.inp, 'square', lf, t, sp * 1.7, 0.2, 3200);
        step++; nextT += sp;
      }
    }
    function stop() { if (timer) clearInterval(timer); timer = null; playing = false; if (nodes) { try { nodes.master.gain.setTargetAtTime(0, nodes.ctx.currentTime, 0.02); const m = nodes.master; setTimeout(() => { try { m.disconnect(); } catch (e) { /* */ } }, 400); } catch (e) { /* */ } } nodes = null; bPlay.innerHTML = A.icon('play') + ' Play the loop'; }
    bPlay.onclick = () => { if (playing) { stop(); return; } A.audio.stopAll(); nodes = build(); if (!nodes) return; playing = true; step = 0; nextT = nodes.ctx.currentTime + 0.08; apply(); timer = setInterval(schedule, 50); schedule(); A.audio.track({ stop }); bPlay.innerHTML = A.icon('stop') + ' Stop'; };
    const preset = (k) => { STEMS.forEach((s) => { const p = PRE[k][s.id]; Object.assign(S[s.id], { fader: p[0], pan: p[1], tone: p[2], hp: p[3], mute: false, solo: false }); }); syncUI(); apply(); };
    bRaw.onclick = () => preset('raw'); bBal.onclick = () => preset('bal');
    bMono.onclick = () => { mono = !mono; bMono.textContent = 'Mono check: ' + (mono ? 'on' : 'off'); bMono.classList.toggle('primary', mono); apply(); };
    A.onLeave(stop);
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Top: where each stem lives on the frequency axis (solid block = its body, lighter block = its attack or brightness). Blocks that pile up in the same range mask each other — the taller and more opaque a block, the louder that stem. Middle: where each stem sits from left to right. Bottom: the master level while the loop plays.',
      draw(ctx, w, h, t) {
        const x0 = 14, x1 = w - 14, X = (f) => x0 + (Math.log10(f / 20) / 3) * (x1 - x0), top = 14, rowH = 30;
        [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].forEach((f) => { ctx.strokeStyle = A.alpha(A.css('line'), 0.9); ctx.beginPath(); ctx.moveTo(X(f), top); ctx.lineTo(X(f), top + rowH * 5 + 4); ctx.stroke(); A.text(ctx, f >= 1000 ? f / 1000 + 'k' : String(f), X(f), top + rowH * 5 + 16, { align: 'center', size: 9, color: A.css('muted') }); });
        STEMS.forEach((s, i) => {
          const v = S[s.id], on = audible(s.id), a = on ? 0.25 + 0.7 * v.fader : 0.08, y = top + i * rowH + 3;
          const lo = Math.max(s.band[0], v.hp ? (s.id === 'pad' ? 220 : s.id === 'lead' ? 300 : s.id === 'snare' ? 140 : 60) : 20);
          ctx.fillStyle = A.alpha(A.css(s.col), a); ctx.fillRect(X(lo), y, Math.max(2, X(s.band[1]) - X(lo)), rowH - 6);
          if (s.extra) { ctx.fillStyle = A.alpha(A.css(s.col), a * (0.45 + v.tone / 20)); ctx.fillRect(X(s.extra[0]), y + 5, X(s.extra[1]) - X(s.extra[0]), rowH - 16); }
          else if (v.tone) { ctx.fillStyle = A.alpha(A.css(s.col), a * (0.3 + v.tone / 16)); ctx.fillRect(X(3500), y + 5, X(12000) - X(3500), rowH - 16); }
          A.text(ctx, s.name, X(lo) + 4, y + rowH / 2 + 1, { size: 10, weight: 700, color: A.css('text') });
        });
        const py = top + rowH * 5 + 40; ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(x0 + 20, py); ctx.lineTo(x1 - 20, py); ctx.stroke();
        A.text(ctx, 'L', x0 + 6, py + 4, { size: 11, weight: 700 }); A.text(ctx, 'R', x1 - 12, py + 4, { size: 11, weight: 700 }); A.text(ctx, 'C', (x0 + x1) / 2, py + 22, { align: 'center', size: 10, color: A.css('muted') });
        STEMS.forEach((s, i) => { if (!audible(s.id)) return; const px = (x0 + x1) / 2 + (mono ? 0 : S[s.id].pan) * ((x1 - x0) / 2 - 24); dot(ctx, px, py - 4 + ((i % 3) - 1) * 7, 4 + 6 * S[s.id].fader, A.alpha(A.css(s.col), 0.85)); });
        if (nodes) { nodes.an.getFloatTimeDomainData(nodes.buf); let sum = 0; for (let k = 0; k < 512; k++) sum += nodes.buf[k] * nodes.buf[k]; level = Math.max(Math.sqrt(sum / 512), level * 0.9); } else level *= 0.9;
        const my = h - 26, lv = A.clamp((dB(level) + 48) / 48, 0, 1); ctx.fillStyle = A.alpha(A.css('muted'), 0.2); ctx.fillRect(x0, my, x1 - x0, 10); ctx.fillStyle = lv > 0.9 ? A.css('bad') : lv > 0.75 ? A.css('warn') : A.css('good'); ctx.fillRect(x0, my, (x1 - x0) * lv, 10);
        A.text(ctx, 'master level', x0, my - 4, { size: 9, color: A.css('muted') });
      },
    });
    function upd() {
      const on = STEMS.filter((s) => audible(s.id)), centre = on.filter((s) => Math.abs(S[s.id].pan) < 0.1).length;
      const lows = ['kick', 'bass', 'pad'].filter((id) => audible(id) && !(S[id].hp && id === 'pad')).length;
      const lead = S.lead.fader, loudest = Math.max(...on.map((s) => S[s.id].fader), 0.01);
      out.innerHTML = A.statBox('Stems in the centre', `${centre} of ${on.length}`, centre > 3 ? 'crowded middle' : 'room in the middle', centre > 3 ? 'warn' : 'good') + A.statBox('Stems fighting below 250 Hz', String(lows), lows > 2 ? 'muddy low end' : 'clear low end', lows > 2 ? 'bad' : 'good') + A.statBox('Lead vs loudest stem', fmt(dB((lead * lead) / (loudest * loudest)), 1) + ' dB', lead < loudest * 0.7 ? 'melody is buried' : 'melody sits on top', lead < loudest * 0.7 ? 'warn' : 'good');
      const T = [];
      if (lows > 2) T.push('Three stems share the low end. Switch on the pad’s high-pass: it loses nothing you can hear in the mix and the bass and kick clear up at once.');
      if (centre > 3 && !mono) T.push('Almost everything is in the centre. Keep kick, bass and the main melody near the middle; move the pad and the hat-heavy snare stem apart to open the stereo picture.');
      if (S.kick.tone <= 0 && S.bass.tone >= 0 && audible('kick') && audible('bass')) T.push('Kick and bass overlap around 50–100 Hz. Give the kick a little more attack with its tone knob and take some “growl” off the bass (or the reverse) so each has its own space.');
      if (lead < loudest * 0.7 && audible('lead')) T.push('The melody is lower than the backing. Before reaching for EQ, try 2–3 dB more fader.');
      if (mono) T.push('In mono every pan collapses to the centre. If the balance still works here it will work on phones, club systems and small speakers.');
      if (!T.length) T.push('A workable balance: low end shared by only two stems, the melody on top, width used for the supporting parts. Now mute each stem in turn and listen to what it adds.');
      tip(T);
    }
    upd();
  };

  /* ======================================================================
     2. Frequency map — zones, instruments and what the words mean
     ====================================================================== */
  const ZONES = [
    ['Sub', 20, 60, 'Felt more than heard. Too much: loose rumble that eats headroom. Too little: no weight on big systems. High-pass everything that does not need it.'],
    ['Bass', 60, 200, 'The weight of kick and bass. Too much: boom. Too little: thin. Only one or two instruments should own this range.'],
    ['Low-mid “mud”', 200, 500, 'Warmth and body — and where almost every instrument overlaps. A small cut on several tracks here cleans a mix faster than any boost.'],
    ['“Boxy / honk”', 500, 1200, 'Cardboard-box and nasal colours. Cuts here make drums and vocals sound less cheap; a little boost adds punch to guitars and horns.'],
    ['Presence', 1200, 5000, 'Attack, intelligibility, the “forward” sound. Too much: hard and tiring. Too little: distant. The ear is most sensitive here.'],
    ['Sibilance', 5000, 9000, 'Consonants “s” and “t”, cymbal bite, pick noise. Control with a de-esser rather than a broad cut.'],
    ['Air', 9000, 20000, 'Sparkle and openness. A gentle shelf can lift a dull track; too much sounds brittle and raises hiss.'],
  ];
  const INST = [
    ['Kick drum', 40, 100, 100, 5000, 'Weight 50–80 Hz, boxiness around 300–500 Hz, beater click 2–5 kHz.'],
    ['Bass guitar / synth bass', 40, 250, 250, 3000, 'Fundamentals 40–250 Hz, growl 600 Hz–1 kHz, string noise 2–3 kHz.'],
    ['Snare', 150, 250, 250, 10000, 'Body 150–250 Hz, ring 400–900 Hz, crack 2–5 kHz, wires 6–10 kHz.'],
    ['Electric guitar', 80, 1200, 1200, 6000, 'Thickness 150–300 Hz, honk 800 Hz–1.2 kHz, bite 2–4 kHz. Rarely needs anything below 80 Hz.'],
    ['Acoustic guitar', 80, 1200, 1200, 12000, 'Boom 100–200 Hz, body 250 Hz, clarity 3–5 kHz, sparkle 8–12 kHz.'],
    ['Piano', 28, 4200, 4200, 12000, 'Covers almost everything: decide what role it plays and carve the rest.'],
    ['Voice', 85, 1100, 1100, 12000, 'Chest 120–250 Hz, nasal 800 Hz–1.2 kHz, intelligibility 2–5 kHz, sibilance 5–9 kHz, air above 10 kHz.'],
    ['Cymbals & hats', 300, 600, 600, 18000, 'Gong-like clang 300–600 Hz, harshness 3–5 kHz, shimmer 8–16 kHz.'],
    ['Strings / pads', 65, 3500, 3500, 12000, 'Fill 200–500 Hz quickly — the first thing to high-pass and thin out behind a vocal.'],
  ];
  V.freqMap = function (host) {
    let sel = { t: 'z', i: 2 }, geo = null;
    const info = el('div'); const row = el('div', { class: 'row' }); const bH = el('button', { class: 'primary', html: A.icon('play') + ' Hear this range' }); row.appendChild(bH);
    const cv = A.canvas(host, {
      height: 340,
      caption: 'Tap a zone along the top or an instrument bar. Solid part of a bar = the notes themselves (fundamentals); lighter part = harmonics, attack and breath. The ranges are starting points for listening, not rules.',
      draw(ctx, w, h) {
        const x0 = w < 600 ? 92 : 150, x1 = w - 10, X = (f) => x0 + (Math.log10(f / 20) / 3) * (x1 - x0), zy = 10, zh = 38, iy = zy + zh + 16, ih = (h - iy - 26) / INST.length;
        geo = { x0, x1, X, zy, zh, iy, ih };
        ZONES.forEach((z, i) => { const on = sel.t === 'z' && sel.i === i; ctx.fillStyle = A.alpha(A.series(i), on ? 0.85 : 0.3); ctx.fillRect(X(z[1]) + 1, zy, X(z[2]) - X(z[1]) - 2, zh); if (X(z[2]) - X(z[1]) > 34) A.text(ctx, w < 600 ? z[0].replace(/[“”]/g, '').split(' ')[0] : z[0], (X(z[1]) + X(z[2])) / 2, zy + zh / 2 + 4, { align: 'center', size: w < 600 ? 9 : 11, weight: 700, color: on ? '#fff' : A.css('text') }); if (on) { ctx.fillStyle = A.alpha(A.series(i), 0.1); ctx.fillRect(X(z[1]), iy - 6, X(z[2]) - X(z[1]), h - iy - 14); } });
        INST.forEach((n, i) => { const y = iy + i * ih, on = sel.t === 'i' && sel.i === i; A.text(ctx, w < 600 ? n[0].split(' ')[0] : n[0], x0 - 6, y + ih / 2 + 4, { align: 'right', size: w < 600 ? 9 : 11, weight: on ? 800 : 500 }); ctx.fillStyle = A.alpha(A.css('accent'), on ? 1 : 0.7); ctx.fillRect(X(n[1]), y + 4, X(n[2]) - X(n[1]), ih - 8); ctx.fillStyle = A.alpha(A.css('accent'), on ? 0.45 : 0.25); ctx.fillRect(X(n[3]), y + 4, X(n[4]) - X(n[3]), ih - 8); });
        [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].forEach((f) => A.text(ctx, f >= 1000 ? f / 1000 + 'k' : String(f), X(f), h - 8, { align: 'center', size: 9, color: A.css('muted') }));
      },
      onPointer(p) {
        if (p.type !== 'pointerdown' || !geo) return;
        const f = 20 * Math.pow(10, ((p.x - geo.x0) / (geo.x1 - geo.x0)) * 3);
        if (p.y < geo.iy - 4) { const i = ZONES.findIndex((z) => f >= z[1] && f < z[2]); if (i >= 0) sel = { t: 'z', i }; }
        else { const i = Math.floor((p.y - geo.iy) / geo.ih); if (i >= 0 && i < INST.length) sel = { t: 'i', i }; }
        show();
      },
    });
    host.appendChild(row); host.appendChild(info);
    const range = () => (sel.t === 'z' ? [ZONES[sel.i][1], ZONES[sel.i][2]] : [INST[sel.i][1], INST[sel.i][4]]);
    bH.onclick = () => {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return; const [lo, hi] = range();
      const s = ctx.createBufferSource(); s.buffer = A.audio.noiseBuffer('pink', 2); const hp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter(), g = ctx.createGain(); hp.type = 'highpass'; hp.frequency.value = lo; lp.type = 'lowpass'; lp.frequency.value = hi;
      const t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.9, t + 0.05); g.gain.setValueAtTime(0.9, t + 1.1); g.gain.linearRampToValueAtTime(0, t + 1.3);
      s.connect(hp).connect(lp).connect(g).connect(ctx.destination); s.start(t); s.stop(t + 1.4); A.audio.track(s);
    };
    function show() {
      if (sel.t === 'z') { const z = ZONES[sel.i]; const who = INST.filter((n) => n[1] < z[2] && n[4] > z[1]).map((n) => n[0]); info.innerHTML = `<div class="callout data"><b>${z[0]} · ${fmtHz(z[1])}–${fmtHz(z[2])}</b><br>${z[3]}<br><span class="small muted">Instruments with energy here: ${who.join(', ')}.</span></div>`; }
      else { const n = INST[sel.i]; info.innerHTML = `<div class="callout data"><b>${n[0]}</b> · notes ${fmtHz(n[1])}–${fmtHz(n[2])}, overtones to ${fmtHz(n[4])}<br>${n[5]}</div>`; }
      cv.redraw();
    }
    show();
  };

  /* ======================================================================
     3. Envelope shaper — what attack and release do to a sound
     ====================================================================== */
  V.envelopeShaper = function (host) {
    const st = A.controls(host, [
      { key: 'src', label: 'Source', type: 'select', value: 'drum', options: [['drum', 'Snare hits'], ['vocal', 'Vocal phrase (uneven levels)'], ['bass', 'Bass notes']] },
      { key: 'thr', label: 'Threshold', type: 'range', min: -40, max: 0, step: 1, value: -18, unit: 'dB' },
      { key: 'ratio', label: 'Ratio', type: 'range', min: 1, max: 20, step: 0.5, value: 4, fmt: (v) => v + ' : 1' },
      { key: 'att', label: 'Attack', type: 'range', min: 0.1, max: 100, step: 0.1, value: 10, unit: 'ms' },
      { key: 'rel', label: 'Release', type: 'range', min: 10, max: 1000, step: 10, value: 120, unit: 'ms' },
      { key: 'knee', label: 'Knee', type: 'range', min: 0, max: 18, step: 1, value: 6, unit: 'dB' },
      { key: 'mk', label: 'Make-up gain', type: 'range', min: 0, max: 18, step: 0.5, value: 4, unit: 'dB' },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out);
    const tip = tipBox(host);
    const N = 1200, FS = 1000; // 1.2 s at 1 kHz envelope rate
    function source() {
      const e = new Float32Array(N);
      if (st.src === 'drum') [60, 460, 860].forEach((t0, k) => { const pk = [1, 0.7, 0.9][k]; for (let i = t0; i < N; i++) { const tt = (i - t0) / FS; e[i] = Math.max(e[i], pk * (tt < 0.003 ? tt / 0.003 : Math.exp(-(tt - 0.003) / 0.07) * 0.75 + 0.25 * Math.exp(-(tt - 0.003) / 0.25))); } });
      else if (st.src === 'vocal') [[40, 260, 0.22], [300, 240, 0.8], [560, 300, 0.4], [880, 280, 1]].forEach(([t0, len, pk]) => { for (let i = t0; i < Math.min(N, t0 + len); i++) { const u = (i - t0) / len; e[i] = pk * Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.6 * (0.85 + 0.15 * Math.sin(i * 0.3)); } });
      else [[30, 0.9], [330, 0.55], [630, 1], [930, 0.7]].forEach(([t0, pk]) => { for (let i = t0; i < Math.min(N, t0 + 280); i++) { const tt = (i - t0) / FS; e[i] = pk * (tt < 0.008 ? tt / 0.008 : 0.55 + 0.45 * Math.exp(-(tt - 0.008) / 0.06)) * (i > t0 + 250 ? (t0 + 280 - i) / 30 : 1); } });
      return e;
    }
    function run() {
      const e = source(), o = new Float32Array(N), gr = new Float32Array(N), aA = Math.exp(-1 / ((st.att / 1000) * FS)), aR = Math.exp(-1 / ((st.rel / 1000) * FS));
      let g = 0;
      for (let i = 0; i < N; i++) {
        const L = dB(e[i]), over = L - st.thr; let want;
        if (st.knee > 0 && Math.abs(over) < st.knee / 2) want = ((1 / st.ratio - 1) * Math.pow(over + st.knee / 2, 2)) / (2 * st.knee); else want = over > 0 ? (1 / st.ratio - 1) * over : 0;
        g = want < g ? aA * g + (1 - aA) * want : aR * g + (1 - aR) * want;
        gr[i] = g; o[i] = e[i] * lin(g + st.mk);
      }
      return { e, o, gr };
    }
    let R = run();
    const cv = A.canvas(host, {
      height: 320,
      caption: 'Top: the level of the sound over time before compression (thin line) and after (thick line, including make-up gain); the dashed line is the threshold. Bottom: how much the compressor is turning down at each moment. A slow attack lets the front of each hit through; a fast release lets the level spring back between hits.',
      draw(ctx, w, h) {
        const r = R, ax = A.axes(ctx, w, h, { x: { min: 0, max: 1.2, label: 'Time (s)' }, y: { min: -48, max: 6, label: 'Level (dB)' }, pad: { b: 120 } });
        ctx.setLineDash([5, 4]); ctx.strokeStyle = A.css('muted'); ctx.beginPath(); ctx.moveTo(ax.x0, ax.Y(st.thr)); ctx.lineTo(ax.x1, ax.Y(st.thr)); ctx.stroke(); ctx.setLineDash([]);
        const pts = (a) => Array.from(a, (v, i) => [i / FS, A.clamp(dB(v), -48, 6)]);
        A.plotLine(ctx, ax, pts(r.e), A.alpha(A.css('text'), 0.55), 1.3);
        A.plotLine(ctx, ax, pts(r.o), A.css('accent'), 2.6);
        const gy0 = h - 96, gy1 = h - 30, GX = (i) => ax.x0 + (i / N) * (ax.x1 - ax.x0), GY = (g) => gy0 + (Math.min(24, -g) / 24) * (gy1 - gy0);
        ctx.strokeStyle = A.css('line'); ctx.strokeRect(ax.x0, gy0, ax.x1 - ax.x0, gy1 - gy0);
        ctx.fillStyle = A.alpha(A.css('bad'), 0.45); ctx.beginPath(); ctx.moveTo(ax.x0, gy0); for (let i = 0; i < N; i++) ctx.lineTo(GX(i), GY(r.gr[i])); ctx.lineTo(ax.x1, gy0); ctx.fill();
        A.text(ctx, 'gain reduction (0 at the top, 24 dB at the bottom)', ax.x0 + 4, gy1 + 14, { size: 10, color: A.css('muted') });
      },
    });
    function upd() {
      R = run(); const r = R; let maxGR = 0, sumGR = 0, pkI = 0, pkO = 0, sI = 0, sO = 0, n = 0;
      for (let i = 0; i < N; i++) { maxGR = Math.min(maxGR, r.gr[i]); if (r.e[i] > 0.02) { sumGR += r.gr[i]; sI += r.e[i] ** 2; sO += r.o[i] ** 2; n++; } pkI = Math.max(pkI, r.e[i]); pkO = Math.max(pkO, r.o[i]); }
      const crI = dB(pkI) - dB(Math.sqrt(sI / n)), crO = dB(pkO) - dB(Math.sqrt(sO / n));
      out.innerHTML = A.statBox('Most gain reduction', fmt(-maxGR, 1) + ' dB', -maxGR > 12 ? 'heavy' : -maxGR > 5 ? 'firm' : -maxGR > 1 ? 'gentle' : 'almost none', -maxGR > 12 ? 'warn' : '') + A.statBox('Average gain reduction', fmt(-sumGR / n, 1) + ' dB', '') + A.statBox('Peak after', fmt(dB(pkO), 1) + ' dB', `was ${fmt(dB(pkI), 1)} dB`, dB(pkO) > 0 ? 'bad' : '') + A.statBox('Peak-to-average', fmt(crO, 1) + ' dB', `was ${fmt(crI, 1)} dB`, crO < crI - 0.5 ? 'good' : crO > crI + 0.5 ? 'warn' : '');
      const T = [];
      if (-maxGR < 1) T.push('The signal hardly reaches the threshold. Lower the threshold until the meter shows a few dB of reduction on the loud moments.');
      if (st.att >= 15 && st.src !== 'vocal' && -maxGR > 2) T.push('Slow attack: the front of each hit passes before the compressor reacts, so the sound gets <b>punchier</b> — more attack relative to its body.');
      if (st.att < 2 && -maxGR > 2) T.push('Very fast attack: the transient itself is clamped. Good for taming spiky peaks, but it can make drums sound small and dull.');
      if (st.rel < 60 && -maxGR > 4) T.push('Fast release: the gain springs back between notes, raising the tail and the room sound. Push it further and you hear “pumping” or distortion on bass.');
      if (st.rel > 500 && -maxGR > 3) T.push('Slow release: the compressor has not recovered when the next note arrives, so everything is simply turned down. Smooth, but it can flatten the performance.');
      if (st.ratio >= 10) T.push('Ratios of 10:1 and above behave like a limiter: use for peak control, not for tone.');
      if (dB(pkO) > 0) T.push('The output now peaks above full scale. Back off the make-up gain — match the loudness to the bypassed sound so you judge the compression, not the volume.');
      if (st.src === 'vocal' && -maxGR > 3 && st.att <= 15) T.push('On the vocal the loud word is pulled down and, with make-up gain, the quiet words come up: the phrase stays in front of the mix without riding the fader.');
      if (!T.length) T.push('Moderate, musical compression. Bypass it at matched loudness: if you cannot tell what it is doing, you may not need it.');
      tip(T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     4. Delay calculator — tempo to milliseconds, with echoes you can hear
     ====================================================================== */
  const NOTES = [['1/1', 4], ['1/2', 2], ['1/4', 1], ['1/8', 0.5], ['1/16', 0.25], ['1/4 dotted', 1.5], ['1/8 dotted', 0.75], ['1/4 triplet', 2 / 3], ['1/8 triplet', 1 / 3]];
  V.delayCalc = function (host) {
    const st = A.controls(host, [
      { key: 'bpm', label: 'Tempo', type: 'range', min: 50, max: 200, step: 1, value: 110, unit: 'BPM' },
      { key: 'note', label: 'Delay time', type: 'select', value: '6', options: NOTES.map((n, i) => [String(i), n[0]]) },
      { key: 'fb', label: 'Feedback (number of repeats)', type: 'range', min: 0, max: 80, step: 5, value: 40, unit: '%' },
      { key: 'mix', label: 'Echo level', type: 'range', min: 5, max: 80, step: 5, value: 35, unit: '%' },
    ], () => upd());
    const row = el('div', { class: 'row' }); const bH = el('button', { class: 'primary', html: A.icon('play') + ' Hear it' }), bS = el('button', { html: A.icon('stop') + ' Stop' }), bT = el('button', {}, 'Tap tempo'); row.append(bH, bS, bT); host.appendChild(row);
    const tbl = el('div'); host.appendChild(tbl); const tip = tipBox(host);
    const ms = (i = +st.note) => (60000 / st.bpm) * NOTES[i][1];
    let taps = [], t0 = performance.now();
    bT.onclick = () => { const now = performance.now(); taps = taps.filter((x) => now - x < 2500); taps.push(now); if (taps.length >= 2) { const d = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); st.set('bpm', A.clamp(Math.round(60000 / d), 50, 200)); } };
    bS.onclick = () => A.audio.stopAll();
    bH.onclick = () => {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return; const beat = 60 / st.bpm, dly = ctx.createDelay(4.5), fb = ctx.createGain(), wet = ctx.createGain(), out = ctx.createGain();
      dly.delayTime.value = Math.min(4.4, ms() / 1000); fb.gain.value = st.fb / 100; wet.gain.value = st.mix / 100; out.gain.value = 0.8;
      dly.connect(fb).connect(dly); dly.connect(wet).connect(out); out.connect(ctx.destination);
      const t = ctx.currentTime + 0.08;
      [0, 2, 4, 6].forEach((b, k) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = [660, 880, 660, 990][k]; g.gain.setValueAtTime(0, t + b * beat); g.gain.linearRampToValueAtTime(0.5, t + b * beat + 0.005); g.gain.exponentialRampToValueAtTime(0.001, t + b * beat + 0.12); o.connect(g); g.connect(out); g.connect(dly); o.start(t + b * beat); o.stop(t + b * beat + 0.2); A.audio.track(o); });
      [0, 1, 2, 3, 4, 5, 6, 7].forEach((b) => { const s = ctx.createBufferSource(); s.buffer = white(ctx); const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6000; const g = ctx.createGain(); g.gain.setValueAtTime(0.07, t + b * beat); g.gain.exponentialRampToValueAtTime(0.001, t + b * beat + 0.03); s.connect(f).connect(g).connect(out); s.start(t + b * beat, 0, 0.05); A.audio.track(s); });
      t0 = performance.now() + 80;
      A.audio.track({ stop() { try { out.gain.setTargetAtTime(0, ctx.currentTime, 0.02); setTimeout(() => { try { out.disconnect(); fb.disconnect(); } catch (e) { /* */ } }, 300); } catch (e) { /* */ } } });
    };
    const cv = A.canvas(host, {
      height: 170, animate: true,
      caption: 'Two bars at the chosen tempo. Tall marks are the beats; the note is played on beat 1 and each bar shows its echoes getting quieter by the feedback amount. A delay that lands on the grid (or on a dotted/triplet division) becomes part of the groove; one that does not sounds like a mistake.',
      draw(ctx, w, h) {
        const beat = 60000 / st.bpm, total = beat * 8, x0 = 14, x1 = w - 14, X = (m) => x0 + (m / total) * (x1 - x0), base = h - 34;
        for (let b = 0; b <= 8; b++) { ctx.strokeStyle = A.alpha(A.css('muted'), b % 4 === 0 ? 0.9 : 0.4); ctx.lineWidth = b % 4 === 0 ? 2 : 1; ctx.beginPath(); ctx.moveTo(X(b * beat), base); ctx.lineTo(X(b * beat), base - (b % 4 === 0 ? 18 : 10)); ctx.stroke(); if (b < 8) A.text(ctx, String((b % 4) + 1), X(b * beat) + 3, base + 14, { size: 10, color: A.css('muted') }); }
        ctx.lineWidth = 1; ctx.strokeStyle = A.css('line'); ctx.beginPath(); ctx.moveTo(x0, base); ctx.lineTo(x1, base); ctx.stroke();
        ctx.fillStyle = A.css('text'); ctx.fillRect(X(0) - 2, base - 100, 5, 100);
        let a = st.mix / 100, tt = ms();
        for (let k = 0; k < 24 && tt < total && a > 0.02; k++) { ctx.fillStyle = A.alpha(A.css('accent'), 0.35 + 0.65 * a); ctx.fillRect(X(tt) - 2, base - 100 * a, 5, 100 * a); tt += ms(); a *= st.fb / 100 || 0; if (!st.fb) break; }
        const ph = ((performance.now() - t0) % total + total) % total; ctx.strokeStyle = A.css('good'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(ph), 10); ctx.lineTo(X(ph), base); ctx.stroke(); ctx.lineWidth = 1;
      },
    });
    function upd() {
      const q = 60000 / st.bpm, m = ms();
      tbl.innerHTML = `<div class="table-wrap"><table><tr>${NOTES.map((n, i) => `<th class="num" style="${i === +st.note ? 'color:var(--accent)' : ''}">${n[0]}</th>`).join('')}</tr><tr>${NOTES.map((n, i) => `<td class="num" style="${i === +st.note ? 'font-weight:800;color:var(--accent)' : ''}">${fmt(q * n[1], 0)} ms</td>`).join('')}</tr></table></div>
        <div class="stats">${A.statBox('Quarter note', fmt(q, 0) + ' ms', '60 000 ÷ BPM')}${A.statBox('Pre-delay ideas', `${fmt(q / 16, 0)} · ${fmt(q / 8, 0)} · ${fmt(q / 4, 0)} ms`, '1/64 · 1/32 · 1/16 note')}${A.statBox('Reverb that clears by the next bar', '≈ ' + fmt((q * 4) / 1000, 1) + ' s', 'decay about one bar or less')}${A.statBox('Hz for a modulation synced to the beat', fmt(1000 / q, 2) + ' Hz', 'one cycle per beat')}</div>`;
      const T = [];
      if (m < 40) T.push('Under about 40 ms the repeat is not heard as an echo: it fuses with the dry sound and thickens it (doubling). Check it in mono — short delays can cause comb-filter colouration.');
      else if (m < 140) T.push('60–140 ms is the “slap” range: one clear repeat, usually with little or no feedback. Classic on vocals and guitars.');
      else T.push('A rhythmic echo. Dotted eighths against straight eighth-note playing fill the gaps between notes; quarter-note echoes reinforce the pulse.');
      if (st.fb > 65) T.push('High feedback builds a wash that covers the next phrase. Automate the send so only chosen words or notes get the long tail.');
      T.push('Roll the top and bottom off the echo return (for example below 200 Hz and above 4–5 kHz) so the repeats sit behind the dry sound.');
      tip(T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     5. Depth stage — the cues that push a sound back
     ====================================================================== */
  V.depthStage = function (host) {
    const st = A.controls(host, [
      { key: 'lvl', label: 'Level', type: 'range', min: -24, max: 0, step: 1, value: -3, unit: 'dB' },
      { key: 'hf', label: 'High-frequency roll-off', type: 'range', min: 0, max: 12, step: 1, value: 0, fmt: (v) => (v ? '−' + v + ' dB at 8 kHz' : 'none') },
      { key: 'pre', label: 'Reverb pre-delay', type: 'range', min: 0, max: 120, step: 5, value: 60, unit: 'ms' },
      { key: 'rev', label: 'Reverb amount', type: 'range', min: 0, max: 100, step: 5, value: 15, unit: '%' },
      { key: 'dec', label: 'Reverb decay', type: 'range', min: 0.3, max: 3.5, step: 0.1, value: 1.4, unit: 's' },
      { key: 'pan', label: 'Pan', type: 'range', min: -1, max: 1, step: 0.05, value: 0.2, fmt: (v) => (Math.abs(v) < 0.03 ? 'centre' : (v < 0 ? 'L ' : 'R ') + Math.round(Math.abs(v) * 100)) },
    ], () => upd());
    const row = el('div', { class: 'row' }); const bH = el('button', { class: 'primary', html: A.icon('play') + ' Hear this placement' }), bS = el('button', { html: A.icon('stop') + ' Stop' }); row.append(bH, bS); host.appendChild(row);
    const out = el('div', { class: 'stats' }); host.appendChild(out); const tip = tipBox(host);
    const dist = () => A.clamp((-st.lvl / 24) * 0.34 + (st.hf / 12) * 0.2 + (st.rev / 100) * 0.34 + (1 - st.pre / 120) * 0.12 * (st.rev > 5 ? 1 : 0), 0, 1);
    bS.onclick = () => A.audio.stopAll();
    bH.onclick = () => {
      A.audio.stopAll(); const ctx = A.audio.get(); if (!ctx) return;
      const len = Math.floor(ctx.sampleRate * st.dec), ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2) * Math.exp((-6.9 * i) / len) * 0.5; }
      const conv = ctx.createConvolver(); conv.buffer = ir; const pre = ctx.createDelay(0.3); pre.delayTime.value = st.pre / 1000; const wet = ctx.createGain(); wet.gain.value = (st.rev / 100) * 0.9;
      const lp = ctx.createBiquadFilter(); lp.type = 'highshelf'; lp.frequency.value = 5000; lp.gain.value = -st.hf; const dry = ctx.createGain(); dry.gain.value = lin(st.lvl) * 0.6; const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain(); if (pan.pan) pan.pan.value = st.pan; const out2 = ctx.createGain(); out2.gain.value = 1;
      lp.connect(dry).connect(pan).connect(out2); dry.connect(pre).connect(conv).connect(wet).connect(out2); out2.connect(ctx.destination);
      const t = ctx.currentTime + 0.06; [392, 494, 587, 494, 392, 330, 392].forEach((f, k) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = f; const tt = t + k * 0.28; g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(0.5, tt + 0.006); g.gain.exponentialRampToValueAtTime(0.001, tt + 0.24); const f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = 4500; o.connect(f2).connect(g).connect(lp); o.start(tt); o.stop(tt + 0.3); A.audio.track(o); });
      A.audio.track({ stop() { try { out2.gain.setTargetAtTime(0, ctx.currentTime, 0.03); setTimeout(() => { try { out2.disconnect(); } catch (e) { /* */ } }, 300); } catch (e) { /* */ } } });
    };
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Top view of the “stage” your mix creates between the speakers. The listener is at the bottom. The source moves back as it gets quieter, duller and wetter, and forward again with a longer pre-delay, because the gap tells the ear the walls are far away while the source is close. The faint rings are its reverb.',
      draw(ctx, w, h, t) {
        const tt = Math.max(0, t), cx = w / 2, by = h - 30, d = dist(), sy = by - 50 - d * (h - 110), sx = cx + st.pan * (w * 0.32) * (1 - d * 0.35);
        ctx.strokeStyle = A.alpha(A.css('line'), 0.9); for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.ellipse(cx, by, (w * 0.42 * k) / 4, ((h - 70) * k) / 4, 0, Math.PI, TAU); ctx.stroke(); }
        ['close', '', 'mid', '', 'far'].forEach((l, k) => l && A.text(ctx, l, 12, by - 50 - (k / 4) * (h - 110) + 4, { size: 10, color: A.css('muted') }));
        ctx.fillStyle = A.css('accent'); ctx.fillRect(cx - w * 0.36 - 8, by - 34, 16, 22); ctx.fillRect(cx + w * 0.36 - 8, by - 34, 16, 22);
        dot(ctx, cx, by, 8, A.css('good')); A.text(ctx, 'you', cx, by + 18, { align: 'center', size: 10 });
        const n = Math.round(st.rev / 18); for (let k = 0; k < n; k++) { const rr = ((tt * 0.35 + k / Math.max(1, n)) % 1) * (30 + st.dec * 40); ctx.strokeStyle = A.alpha(A.css('c3'), 0.6 * (1 - rr / (30 + st.dec * 40))); ctx.beginPath(); ctx.arc(sx, sy, rr, 0, TAU); ctx.stroke(); }
        dot(ctx, sx, sy, 6 + 10 * lin(st.lvl), A.alpha(A.css('accent2'), 1 - st.hf / 20));
        A.text(ctx, 'source', sx, sy - 16 - 10 * lin(st.lvl), { align: 'center', size: 10, weight: 700 });
      },
    });
    function upd() {
      const d = dist();
      out.innerHTML = A.statBox('Perceived position', d < 0.25 ? 'Up front' : d < 0.5 ? 'Just behind the front' : d < 0.75 ? 'Mid-stage' : 'Far back', `${Math.round(d * 100)} % of the way back`) + A.statBox('Strongest cue in use', st.rev > 40 ? 'reverb amount' : -st.lvl > 12 ? 'level' : st.hf > 6 ? 'brightness' : 'none dominant', '') + A.statBox('Pre-delay', st.pre + ' ms', st.pre < 15 ? 'reverb glued to the source' : st.pre < 50 ? 'slight separation' : 'source stays in front', st.pre >= 50 ? 'good' : '');
      const T = [];
      if (st.rev > 55 && st.pre < 20) T.push('A lot of reverb with no pre-delay pushes the source into the back wall and blurs its attack. Add 40–80 ms of pre-delay to keep the words clear while keeping the space.');
      if (st.rev > 30 && st.dec > 2.4) T.push('Long decays build up under busy parts. Shorten the decay or automate it so the tail only blooms in the gaps.');
      if (d < 0.2) T.push('Loud, bright and dry: this sits right at the front — the lead’s place. If everything is here the mix has no depth.');
      if (st.hf > 6 && st.rev < 15) T.push('Rolling off the highs alone makes a sound darker but not convincingly distant: combine it with a lower level and some early reflections.');
      if (!T.length) T.push('Decide the front-to-back order first (lead, support, background), then use the same one or two reverbs in different amounts so everything shares one “room”.');
      tip(T); cv.redraw();
    }
    upd();
  };

  /* ======================================================================
     6. Loudness lab — limiting, crest factor and normalisation
     ====================================================================== */
  const STYLE = { acoustic: ['Dynamic acoustic recording', -20, 19], pop: ['Modern pop / rock mix', -14, 13], limited: ['Already heavily limited master', -9.5, 8.5] };
  const TARGET = { '-14': 'Streaming, music (about −14 LUFS)', '-16': 'Streaming, speech / podcasts (about −16 LUFS)', '-23': 'Broadcast (about −23 LUFS)', off: 'No normalisation (file played as is)' };
  V.loudnessLab = function (host) {
    const st = A.controls(host, [
      { key: 'style', label: 'The mix', type: 'select', value: 'pop', options: Object.entries(STYLE).map(([k, v]) => [k, v[0]]) },
      { key: 'push', label: 'Push into the limiter', type: 'range', min: 0, max: 12, step: 0.5, value: 0, unit: 'dB' },
      { key: 'ceil', label: 'True-peak ceiling', type: 'range', min: -3, max: 0, step: 0.1, value: -1, unit: 'dBTP' },
      { key: 'tgt', label: 'Where it will be played', type: 'select', value: '-14', options: Object.entries(TARGET) },
    ], () => upd());
    const out = el('div', { class: 'stats' }); host.appendChild(out); const tip = tipBox(host);
    const N = 900; let base = null, baseKey = '';
    function wave() {
      if (baseKey === st.style) return base; baseKey = st.style; const crest = STYLE[st.style][2], a = new Float32Array(N); let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < N; i++) { const beat = i % 75, hit = beat < 5 ? 1 - beat / 6 : 0, sn = (i % 150) > 74 && (i % 150) < 80 ? 0.85 : 0, body = lin(-crest + 3) * (0.8 + 0.4 * Math.sin(i / 60) * Math.sin(i / 17)) * (0.6 + 0.8 * rnd()); a[i] = Math.min(1, Math.max(hit, sn, body)); }
      return (base = a);
    }
    function calc() {
      const s = STYLE[st.style], src = wave(), g = lin(st.push), c = lin(st.ceil), lim = new Float32Array(N); let sum = 0, pk = 0;
      for (let i = 0; i < N; i++) { const v = src[i] * c * g; lim[i] = v > c ? c * (1 - 0.06 * Math.exp(-(v - c) * 3)) + 0.06 * c : v; lim[i] = Math.min(c, lim[i]); sum += lim[i] ** 2; pk = Math.max(pk, lim[i]); }
      let s0 = 0; for (let i = 0; i < N; i++) s0 += (src[i] * c) ** 2;
      const gain = dB(Math.sqrt(sum / N)) - dB(Math.sqrt(s0 / N));
      const lufs = s[1] + (st.ceil + 1) + gain, crest = st.ceil - lufs;
      const tgt = st.tgt === 'off' ? null : +st.tgt, adj = tgt == null ? 0 : lufs > tgt ? tgt - lufs : 0;
      return { src, lim, lufs, crest, adj, tgt, played: lufs + adj, pkPlayed: st.ceil + adj, c };
    }
    let R = calc();
    const cv = A.canvas(host, {
      height: 300, animate: true,
      caption: 'Top: the master as delivered — pushing into the limiter raises the body of the sound until the peaks are shaved flat. Bottom: the same master after the playback service has matched its loudness to the target. Louder masters are simply turned down, and what remains is a waveform with smaller peaks: less punch at the same loudness.',
      draw(ctx, w, h, t) {
        const r = R, x0 = 12, x1 = w - 12, hh = (h - 50) / 2, off = Math.floor(Math.max(0, t) * 40) % N;
        const drawW = (arr, ymid, scale, col, label) => { ctx.fillStyle = A.alpha(A.css('muted'), 0.12); ctx.fillRect(x0, ymid - hh / 2, x1 - x0, hh); ctx.fillStyle = col; const n = Math.floor((x1 - x0) / 2); for (let k = 0; k < n; k++) { const v = arr[(off + Math.floor((k / n) * 450)) % N] * scale * (hh / 2 - 4); ctx.fillRect(x0 + k * 2, ymid - v, 1.6, v * 2); } ctx.setLineDash([4, 4]); ctx.strokeStyle = A.css('bad'); ctx.beginPath(); ctx.moveTo(x0, ymid - (hh / 2 - 4)); ctx.lineTo(x1, ymid - (hh / 2 - 4)); ctx.stroke(); ctx.setLineDash([]); A.text(ctx, label, x0 + 6, ymid - hh / 2 + 14, { size: 11, weight: 700, bg: A.alpha(A.css('panel'), 0.85) }); };
        drawW(r.lim, 16 + hh / 2, 1, A.css('accent'), `As delivered · ${fmt(r.lufs, 1)} LUFS · peak ${fmt(st.ceil, 1)} dBTP`);
        drawW(r.lim, 34 + hh * 1.5, lin(r.adj), A.css('c3'), r.tgt == null ? 'As played · no normalisation' : `As played · ${fmt(r.played, 1)} LUFS · peak ${fmt(r.pkPlayed, 1)} dBTP`);
      },
    });
    function upd() {
      R = calc(); const r = R;
      out.innerHTML = A.statBox('Integrated loudness', fmt(r.lufs, 1) + ' LUFS', 'of the delivered master') + A.statBox('Peak-to-loudness', fmt(r.crest, 1) + ' dB', r.crest < 8 ? 'squashed' : r.crest < 11 ? 'dense' : r.crest < 15 ? 'punchy' : 'very dynamic', r.crest < 8 ? 'bad' : r.crest < 11 ? 'warn' : 'good') + A.statBox('The service turns it', r.tgt == null ? '—' : r.adj < -0.05 ? 'down ' + fmt(-r.adj, 1) + ' dB' : 'not at all', r.tgt == null ? 'played as delivered' : r.adj < -0.05 ? 'louder than the target' : 'at or below the target') + A.statBox('Heard at', fmt(r.played, 1) + ' LUFS', r.tgt != null && r.adj < -0.05 ? `peaks only reach ${fmt(r.pkPlayed, 1)} dBTP` : '');
      const T = [];
      if (r.tgt != null && r.adj < -3) T.push(`This master is ${fmt(-r.adj, 1)} dB hotter than the target, so it is turned down by that amount. All the limiting bought was flatter peaks — a more dynamic master would play at the same loudness with more punch.`);
      if (r.tgt != null && r.adj >= -0.05) T.push('At or below the target: the service leaves it alone (some raise quiet tracks only as far as their peaks allow). Nothing is lost.');
      if (r.tgt == null) T.push('With no normalisation, louder files do sound louder next to others — the reason masters were pushed for decades. Most listening today is normalised, so judge at matched loudness.');
      if (r.crest < 8) T.push('Less than about 8 dB between peaks and loudness: transients are gone, the mix sounds flat and tiring, and lossy encoding may add distortion.');
      if (st.ceil > -0.5) T.push('Leave about 1 dB of true-peak headroom: lossy encoders and converters can overshoot a sample-peak of 0 dBFS and clip.');
      T.push('Targets differ between services and change over time — check the current delivery specification, and master to what sounds best at matched loudness.');
      tip(T); cv.redraw();
    }
    upd();
  };
})();
