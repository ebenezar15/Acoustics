/* Hear the Decibel: interactive dB ladder, loudness steps, through-the-wall simulator. */
(function () {
  'use strict';
  const { el, html, fmt } = A;

  /* ---------- simple synthesized band loop ---------- */
  function startBand(ctx, out) {
    const bpm = 100, beat = 60 / bpm;
    let next = ctx.currentTime + 0.1, step = 0, timer;
    const noise = A.audio.noiseBuffer('white', 1);
    const bassNotes = [41.2, 41.2, 49, 55, 36.7, 36.7, 49, 55];
    const chords = [[164.8, 196, 246.9], [146.8, 185, 220], [130.8, 164.8, 196], [146.8, 196, 246.9]];
    function kick(t) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); g.gain.setValueAtTime(1.0, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.45); o.connect(g).connect(out); o.start(t); o.stop(t + 0.5); }
    function snare(t) { const s = ctx.createBufferSource(); s.buffer = noise; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.7; const g = ctx.createGain(); g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2); s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + 0.25); const o = ctx.createOscillator(), g2 = ctx.createGain(); o.frequency.value = 190; g2.gain.setValueAtTime(0.35, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.1); o.connect(g2).connect(out); o.start(t); o.stop(t + 0.12); }
    function hat(t, open) { const s = ctx.createBufferSource(); s.buffer = noise; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = ctx.createGain(); g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.25 : 0.05)); s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + 0.3); }
    function bass(t, f, d) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; const g = ctx.createGain(); g.gain.setValueAtTime(0.0, t); g.gain.linearRampToValueAtTime(0.5, t + 0.01); g.gain.setTargetAtTime(0.0, t + d * 0.8, 0.03); o.connect(lp).connect(g).connect(out); o.start(t); o.stop(t + d + 0.2); }
    function pad(t, notes, d) { notes.forEach((f) => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f * 2; const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + 0.05); g.gain.setTargetAtTime(0, t + d * 0.9, 0.1); o.connect(g).connect(out); o.start(t); o.stop(t + d + 0.5); }); }
    function schedule() {
      while (next < ctx.currentTime + 0.25) {
        const s16 = step % 16, bar = Math.floor(step / 16) % 4;
        if (s16 === 0 || s16 === 8 || s16 === 10) kick(next);
        if (s16 === 4 || s16 === 12) snare(next);
        if (s16 % 2 === 0) hat(next, s16 === 14);
        if (s16 % 4 === 0) bass(next, bassNotes[(bar * 2 + (s16 >= 8 ? 1 : 0)) % 8], beat * 0.9);
        if (s16 === 0) pad(next, chords[bar], beat * 4);
        next += beat / 4; step++;
      }
    }
    timer = setInterval(schedule, 50); schedule();
    return { stop() { clearInterval(timer); } };
  }

  A.startBand = startBand;

  /* ---------- TL at octave centres for a wall option ---------- */
  const OCT = [63, 125, 250, 500, 1000, 2000, 4000, 8000];
  function wallOptions() {
    const opts = [
      { id: 'open', name: 'Open doorway (no wall)', tl: OCT.map(() => 0) },
      { id: 'hollow-door', name: 'Closed hollow-core door', tl: [10, 13, 16, 19, 20, 20, 22, 24] },
    ];
    const single = (name, layers) => { const L = P.leafProps(layers); opts.push({ id: name, name, tl: OCT.map((f) => P.singleLeafTL(L, f)) }); };
    single('Single 12.5 mm drywall', [{ mat: 'gypsum', t: 0.0125 }]);
    single('Double-glazed window (as single 8 mm equiv.)', [{ mat: 'glass', t: 0.008 }]);
    D.WALLS.forEach((w) => {
      const a = P.leafProps(w.a, w.damping), b = P.leafProps(w.b, w.damping);
      opts.push({ id: w.id, name: w.name, tl: OCT.map((f) => P.doubleLeafTL({ leaf1: a, leaf2: b, d: w.d, filled: w.filled, conn: w.conn, damping: w.damping }, f).tl) });
    });
    single('150 mm concrete', [{ mat: 'concrete', t: 0.15 }]);
    single('250 mm concrete', [{ mat: 'concrete', t: 0.25 }]);
    return opts;
  }

  A.register('hear', {
    title: 'Hear the Decibel',
    render(root) {
      A.pageHead(root, 'Listen & see', 'Hear the Decibel', 'What does 10 dB of isolation sound like? How about 50? Use headphones or good speakers at a comfortable level. Everything here is synthesised in your browser.');

      /* ---- ladder ---- */
      const lad = el('div', { class: 'card' });
      lad.appendChild(html('<h2 style="margin-top:0">The sound level ladder</h2><p class="muted">Approximate levels of everyday sounds. Click a rung to compare it with the others — every 10 dB is roughly twice as loud.</p>'));
      let sel = 6;
      const cv = A.canvas(lad, {
        height: 470,
        onPointer(p, api) { if (p.type === 'pointerdown') { const i = Math.round(((api.h - 30 - p.y) / (api.h - 50)) * 140 / 10); const idx = D.LADDER.reduce((b, r, k) => (Math.abs(r[0] - i * 10) < Math.abs(D.LADDER[b][0] - i * 10) ? k : b), 0); sel = idx; } },
        draw(ctx, w, h) {
          const Y = (db) => h - 30 - (db / 140) * (h - 50);
          const x0 = 80;
          const grad = ctx.createLinearGradient(0, Y(0), 0, Y(140));
          grad.addColorStop(0, A.css('good')); grad.addColorStop(0.6, A.css('warn')); grad.addColorStop(0.92, A.css('bad'));
          ctx.fillStyle = grad; ctx.fillRect(x0 - 16, Y(140), 10, Y(0) - Y(140));
          ctx.fillStyle = A.alpha(A.css('bad'), 0.08); ctx.fillRect(x0, Y(140), w - x0 - 10, Y(85) - Y(140));
          A.text(ctx, 'risk of hearing damage with exposure', w - 14, Y(87) - 4, { align: 'right', size: 11, color: A.css('bad') });
          const ref = D.LADDER[sel][0];
          D.LADDER.forEach(([db, label], i) => {
            const y = Y(db), on = i === sel;
            ctx.strokeStyle = on ? A.css('accent') : A.css('line'); ctx.beginPath(); ctx.moveTo(x0 - 6, y); ctx.lineTo(w - 10, y); ctx.stroke();
            A.text(ctx, db + ' dB', x0 - 22, y + 4, { align: 'right', size: 11, color: A.css('muted') });
            const rel = P.loudnessRatio(db - ref);
            const relTxt = i === sel ? 'reference' : rel >= 1 ? `${fmt(rel, rel < 10 ? 1 : 0)}× as loud` : `${fmt(rel * 100, rel < 0.1 ? 1 : 0)} % as loud`;
            A.text(ctx, label, x0 + 4, y - 4, { size: on ? 13 : 12, weight: on ? 700 : 500, color: on ? A.css('accent') : A.css('text') });
            A.text(ctx, relTxt, w - 14, y - 4, { align: 'right', size: 11, color: on ? A.css('accent') : A.css('muted') });
          });
        },
      });
      void cv;
      root.appendChild(lad);

      /* ---- loudness steps ---- */
      const steps = el('div', { class: 'card' });
      steps.appendChild(html(`<h2 style="margin-top:0">Hear decibel steps</h2><p class="muted">Pink noise played at a reference level, then reduced. Notice: 1 dB is subtle, 3 dB is clear, 10 dB sounds about half as loud, 20 dB a quarter.</p>`));
      const row = el('div', { class: 'row' });
      [0, -1, -3, -6, -10, -20, -30, -40].forEach((d) => {
        const b = el('button', { class: d === 0 ? 'primary' : '' }, d === 0 ? 'Reference' : d + ' dB');
        b.onclick = () => {
          A.audio.stopAll();
          const ctx = A.audio.get(); if (!ctx) return;
          const src = ctx.createBufferSource(); src.buffer = A.audio.noiseBuffer('pink', 2);
          const g = ctx.createGain(); g.gain.value = 0.5 * Math.pow(10, d / 20);
          src.connect(g).connect(ctx.destination); src.start(); src.stop(ctx.currentTime + 1.6); A.audio.track(src);
        };
        row.appendChild(b);
      });
      const ab = el('button', {}, 'A/B: reference → −10 dB → reference');
      ab.onclick = () => {
        A.audio.stopAll();
        const ctx = A.audio.get(); if (!ctx) return;
        const src = ctx.createBufferSource(); src.buffer = A.audio.noiseBuffer('pink', 4.5);
        const g = ctx.createGain(); const t = ctx.currentTime;
        g.gain.setValueAtTime(0.5, t); g.gain.setValueAtTime(0.5 * 0.316, t + 1.5); g.gain.setValueAtTime(0.5, t + 3);
        src.connect(g).connect(ctx.destination); src.start(); src.stop(t + 4.5); A.audio.track(src);
      };
      row.appendChild(ab);
      steps.appendChild(row);
      root.appendChild(steps);

      /* ---- through the wall ---- */
      const tw = el('div', { class: 'card' });
      tw.appendChild(html(`<h2 style="margin-top:0">Through the wall simulator</h2><p class="muted">A music source (synthesised band, pink noise or your own file) is filtered by the predicted transmission loss of each construction, octave by octave. Notice how walls remove the highs first — the bass and kick drum survive. That is why neighbours complain about bass.</p>`));
      const walls = wallOptions();
      const st = A.controls(tw, [
        { key: 'src', label: 'Source', type: 'select', value: 'band', options: [['band', 'Synth band (drums, bass, keys)'], ['pink', 'Pink noise'], ['file', 'My audio file…']] },
        { key: 'wall', label: 'Construction between you and the source', type: 'select', value: 'w-wood-1i', options: walls.map((w) => [w.id, w.name]) },
        { key: 'boost', label: 'Make-up gain (hear the character)', type: 'range', min: 0, max: 50, step: 1, value: 30, unit: 'dB' },
      ], () => update());
      const fileIn = el('input', { type: 'file', accept: 'audio/*', style: { display: 'none' } });
      tw.appendChild(fileIn);
      const ctl = el('div', { class: 'row' });
      const play = el('button', { class: 'primary', html: A.icon('play') + ' Play' });
      const stop = el('button', { html: A.icon('stop') + ' Stop' });
      const bypass = el('button', {}, 'Bypass wall (hear the source)');
      ctl.append(play, stop, bypass);
      tw.appendChild(ctl);
      const out = el('div', { class: 'stats' });
      tw.appendChild(out);
      root.appendChild(tw);

      let chain = null, band = null, fileBuf = null, srcNode = null, bypassed = false;
      fileIn.onchange = async () => {
        const f = fileIn.files[0]; if (!f) return;
        const ctx = A.audio.get(); if (!ctx) return;
        try { fileBuf = await ctx.decodeAudioData(await f.arrayBuffer()); A.toast('Loaded ' + f.name); } catch (e) { A.toast('Could not decode that file'); }
      };
      st.el.addEventListener('change', (e) => { if (e.target.tagName === 'SELECT' && st.src === 'file' && !fileBuf) fileIn.click(); });

      function curWall() { return walls.find((w) => w.id === st.wall) || walls[0]; }
      function build() {
        const ctx = A.audio.get(); if (!ctx) return null;
        const input = ctx.createGain(); input.gain.value = 0.45;
        const filters = OCT.map((f, i) => {
          const b = ctx.createBiquadFilter();
          b.type = i === 0 ? 'lowshelf' : i === OCT.length - 1 ? 'highshelf' : 'peaking';
          b.frequency.value = f; b.Q.value = 1.1; return b;
        });
        let node = input; filters.forEach((f) => { node.connect(f); node = f; });
        const master = ctx.createGain();
        const an = ctx.createAnalyser(); an.fftSize = 4096; an.smoothingTimeConstant = 0.8;
        node.connect(master); master.connect(an); an.connect(ctx.destination);
        return { input, filters, master, an };
      }
      function update() {
        const w = curWall();
        const tl = w.tl;
        const minTL = Math.min(...tl);
        if (chain) {
          chain.filters.forEach((f, i) => f.gain.value = bypassed ? 0 : Math.max(-40, -(tl[i] - minTL)));
          chain.master.gain.value = bypassed ? 1 : Math.min(1, Math.pow(10, (-minTL + st.boost) / 20));
        }
        const L1 = [100, 106, 108, 110, 110, 108, 106, 102];
        const L2 = L1.map((l, i) => l - tl[i] + 10 * Math.log10(10 / 20));
        const stc = (() => { const f = P.STC_BANDS; const toOct = (x) => { let k = 0; while (k < OCT.length - 1 && OCT[k + 1] <= x) k++; return tl[k]; }; return P.stc(f.map(toOct)); })();
        out.innerHTML = A.statBox('Approx. STC', w.id === 'open' ? '0' : stc, P.stcDescribe(stc)) +
          A.statBox('TL at 63 Hz', fmt(tl[0], 0) + ' dB', 'bass') + A.statBox('TL at 2 kHz', fmt(tl[5], 0) + ' dB', 'treble') +
          A.statBox('Drum kit next door', fmt(P.dBA(L2), 0) + ' dBA', 'from ~115 dBA in the room');
        spec.redraw();
      }
      play.onclick = () => {
        A.audio.stopAll(); if (band) band.stop();
        const ctx = A.audio.get(); if (!ctx) return;
        chain = build(); update();
        if (st.src === 'band') band = startBand(ctx, chain.input);
        else {
          srcNode = ctx.createBufferSource();
          srcNode.buffer = st.src === 'file' && fileBuf ? fileBuf : A.audio.noiseBuffer('pink', 6);
          srcNode.loop = true; srcNode.connect(chain.input); srcNode.start(); A.audio.track(srcNode);
        }
      };
      stop.onclick = () => { A.audio.stopAll(); if (band) { band.stop(); band = null; } };
      bypass.onclick = () => { bypassed = !bypassed; bypass.classList.toggle('primary', bypassed); bypass.textContent = bypassed ? 'Wall bypassed — click to restore' : 'Bypass wall (hear the source)'; update(); };
      A.onLeave(() => { if (band) band.stop(); });

      const spec = A.canvas(tw, {
        height: 280, animate: true,
        caption: 'Bars: predicted transmission loss per octave for the chosen construction (taller = more isolation). Line: live spectrum of what you are hearing.',
        draw(ctx, w, h) {
          const tl = curWall().tl;
          const ax = A.axes(ctx, w, h, { x: { min: 40, max: 12000, log: true, label: 'Frequency (Hz)', ticks: OCT, fmt: A.shortHz }, y: { min: 0, max: 90, label: 'Transmission loss (dB)' } });
          OCT.forEach((f, i) => { const x0 = ax.X(f / 1.3), x1 = ax.X(f * 1.3); ctx.fillStyle = A.alpha(A.css('accent'), 0.35); ctx.fillRect(x0, ax.Y(tl[i]), x1 - x0, ax.y0 - ax.Y(tl[i])); A.text(ctx, fmt(tl[i], 0), (x0 + x1) / 2, ax.Y(tl[i]) - 4, { align: 'center', size: 10, color: A.css('muted') }); });
          if (chain && chain.an) {
            const an = chain.an, data = new Float32Array(an.frequencyBinCount); an.getFloatFrequencyData(data);
            const sr = A.audio.ctx.sampleRate;
            ctx.save(); ctx.beginPath(); ctx.rect(ax.x0, ax.y1, ax.x1 - ax.x0, ax.y0 - ax.y1); ctx.clip();
            ctx.strokeStyle = A.css('accent2'); ctx.lineWidth = 1.5; ctx.beginPath();
            let started = false;
            for (let i = 2; i < data.length; i++) { const f = (i * sr) / an.fftSize; if (f < 40 || f > 12000) continue; const y = ax.Y(Math.max(0, data[i] + 110)); const x = ax.X(f); started ? ctx.lineTo(x, y) : ctx.moveTo(x, y); started = true; }
            ctx.stroke(); ctx.restore();
          }
        },
      });
      update();

      /* ---- energy visual ---- */
      const ev = el('div', { class: 'card' });
      ev.appendChild(html('<h2 style="margin-top:0">What a dB reduction looks like</h2>'));
      root.appendChild(ev);
      V.dbThroughWall(ev);

      /* ---- tones ---- */
      const tn = el('div', { class: 'card' });
      tn.appendChild(html('<h2 style="margin-top:0">Hear the frequency spectrum</h2><p class="muted">Sine tones across the range. Low tones may be inaudible on laptop speakers — that’s the point: small speakers can’t reproduce what a room’s modes do.</p>'));
      const r2 = el('div', { class: 'row' });
      [31.5, 40, 50, 63, 80, 100, 125, 250, 500, 1000, 2000, 4000, 8000, 12000, 16000].forEach((f) => { const b = el('button', { class: 'small' }, A.fmtHz(f)); b.onclick = () => A.audio.tone(f, 1.5, -18); r2.appendChild(b); });
      tn.appendChild(r2);
      root.appendChild(tn);
    },
  });
})();
