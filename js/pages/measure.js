/* Measure: live RTA from the microphone, clap-test RT60 per octave, signal generator. */
(function () {
  'use strict';
  const { el, html, fmt } = A;

  A.register('measure', {
    title: 'Measure',
    render(root) {
      A.pageHead(root, 'Analyse', 'Measure your room', 'Use your device microphone for a real-time spectrum analyser and a clap/balloon-pop RT60 estimate. Phone and laptop mics are uncalibrated and often roll off bass — use results as relative guides. For serious work, use a calibrated measurement mic with Room EQ Wizard.');
      let stream = null, ctx = null, src = null, an = null;
      A.onLeave(() => { if (stream) stream.getTracks().forEach((t) => t.stop()); });
      async function mic() {
        if (stream) return true;
        ctx = A.audio.get(); if (!ctx) return false;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        } catch (e) { A.toast('Microphone permission denied or unavailable'); return false; }
        src = ctx.createMediaStreamSource(stream);
        an = ctx.createAnalyser(); an.fftSize = 8192; an.smoothingTimeConstant = 0.6;
        src.connect(an);
        return true;
      }

      /* ---------------- RTA ---------------- */
      const rta = el('div', { class: 'card' });
      rta.appendChild(html('<h2 style="margin-top:0">Real-time analyser</h2><p class="muted">Shows the spectrum your microphone hears, in third-octave bars plus a fine FFT trace. Play pink noise from your speakers (button below) and walk around: watch the bass bars jump as you move through room modes.</p>'));
      const row = el('div', { class: 'row' });
      const go = el('button', { class: 'primary', html: A.icon('mic') + ' Start microphone' });
      const pink = el('button', {}, 'Play pink noise');
      const hold = el('button', {}, 'Hold peak: off');
      row.append(go, pink, hold);
      rta.appendChild(row);
      root.appendChild(rta);
      let peakHold = false, peaks = null, running = false;
      hold.onclick = () => { peakHold = !peakHold; peaks = null; hold.textContent = 'Hold peak: ' + (peakHold ? 'on' : 'off'); };
      pink.onclick = () => {
        A.audio.stopAll();
        const c = A.audio.get(); if (!c) return;
        const s = c.createBufferSource(); s.buffer = A.audio.noiseBuffer('pink', 8); s.loop = true;
        const g = c.createGain(); g.gain.value = 0.35; s.connect(g).connect(c.destination); s.start(); A.audio.track(s);
        setTimeout(() => { try { s.stop(); } catch (e) { /* */ } }, 20000);
      };
      go.onclick = async () => { if (await mic()) { running = true; cv.start(); go.textContent = 'Microphone on'; go.disabled = true; } };
      const cv = A.canvas(rta, {
        height: 320,
        caption: 'Levels are relative (dBFS-based), not calibrated SPL.',
        draw(ctx2, w, h) {
          const ax = A.axes(ctx2, w, h, { x: { min: 20, max: 20000, log: true, label: 'Frequency (Hz)' }, y: { min: -110, max: -10, label: 'Level (dB, relative)' } });
          if (!running || !an) { A.text(ctx2, 'Press “Start microphone”', w / 2, h / 2, { align: 'center', color: A.css('muted') }); return; }
          const d = new Float32Array(an.frequencyBinCount); an.getFloatFrequencyData(d);
          const sr = ctx.sampleRate, N = an.fftSize;
          // third-octave bars
          const centres = []; for (let n = -17; n <= 13; n++) centres.push(1000 * Math.pow(2, n / 3));
          const bands = centres.map((fc) => {
            const lo = fc / Math.pow(2, 1 / 6), hi = fc * Math.pow(2, 1 / 6);
            let e = 0, c = 0;
            for (let i = Math.max(1, Math.floor((lo * N) / sr)); i <= Math.min(d.length - 1, Math.ceil((hi * N) / sr)); i++) { e += Math.pow(10, d[i] / 10); c++; }
            return c ? 10 * Math.log10(e) : -120;
          });
          if (peakHold) peaks = peaks ? peaks.map((p, i) => Math.max(p, bands[i])) : bands.slice();
          centres.forEach((fc, i) => {
            const x0 = ax.X(fc / Math.pow(2, 1 / 6)) + 1, x1 = ax.X(fc * Math.pow(2, 1 / 6)) - 1;
            const y = ax.Y(Math.max(-110, Math.min(-10, bands[i])));
            ctx2.fillStyle = A.alpha(A.css('accent'), 0.55); ctx2.fillRect(x0, y, x1 - x0, ax.y0 - y);
            if (peaks) { ctx2.fillStyle = A.css('bad'); ctx2.fillRect(x0, ax.Y(Math.min(-10, peaks[i])) - 1, x1 - x0, 2); }
          });
          ctx2.save(); ctx2.beginPath(); ctx2.rect(ax.x0, ax.y1, ax.x1 - ax.x0, ax.y0 - ax.y1); ctx2.clip();
          ctx2.strokeStyle = A.css('accent2'); ctx2.lineWidth = 1.3; ctx2.beginPath();
          let st = false;
          for (let i = 1; i < d.length; i++) { const f = (i * sr) / N; if (f < 20) continue; if (f > 20000) break; const x = ax.X(f), y = ax.Y(d[i]); st ? ctx2.lineTo(x, y) : ctx2.moveTo(x, y); st = true; }
          ctx2.stroke(); ctx2.restore();
          // dominant LF peak
          let bi = 0, bv = -200; for (let i = 1; i < d.length; i++) { const f = (i * sr) / N; if (f < 25) continue; if (f > 300) break; if (d[i] > bv) { bv = d[i]; bi = i; } }
          A.text(ctx2, `Strongest bass peak: ${fmt((bi * sr) / N, 1)} Hz`, ax.x0 + 8, ax.y1 + 16, { weight: 700 });
        },
      });
      cv.stop();

      /* ---------------- Clap RT60 ---------------- */
      const rtc = el('div', { class: 'card' });
      rtc.appendChild(html(`<h2 style="margin-top:0">Clap test: RT60 estimate</h2><p class="muted">Press <b>Record</b>, wait a second for quiet, then make one sharp, loud impulse — a hand clap, a balloon pop, or two boards slapped together — and stay silent. The app finds the impulse, filters it into octave bands and fits the decay (Schroeder backward integration, T20 method). Turn off fans and HVAC first. A balloon pop gives the best low-frequency energy.</p>`));
      const r2 = el('div', { class: 'row' });
      const rec = el('button', { class: 'primary', html: A.icon('mic') + ' Record 4 s' });
      const status = el('span', { class: 'small' });
      r2.append(rec, status);
      rtc.appendChild(r2);
      const res = el('div', { class: 'stats' });
      rtc.appendChild(res);
      root.appendChild(rtc);
      let lastCurves = null;
      const decayCv = A.canvas(rtc, {
        height: 280,
        draw(c2, w, h) {
          const ax = A.axes(c2, w, h, { x: { min: 0, max: 2, label: 'Time after impulse (s)' }, y: { min: -60, max: 0, label: 'Energy decay (dB)' } });
          if (!lastCurves) { A.text(c2, 'Decay curves will appear here', w / 2, h / 2, { align: 'center', color: A.css('muted') }); return; }
          lastCurves.forEach((cv2, i) => {
            const pts = []; const step = Math.max(1, Math.floor(cv2.curve.length / 600));
            for (let k = 0; k < cv2.curve.length; k += step) pts.push([k / cv2.fs, cv2.curve[k]]);
            A.plotLine(c2, ax, pts, A.series(i), 1.8);
          });
        },
      });
      rtc.appendChild(A.legend(P.BANDS6.map((f, i) => [A.series(i), A.shortHz(f) + ' Hz'])));
      rec.onclick = async () => {
        if (!(await mic())) return;
        rec.disabled = true; status.textContent = 'Recording… clap now!';
        const fs = ctx.sampleRate, len = Math.floor(fs * 4);
        const buf = new Float32Array(len); let pos = 0;
        const proc = ctx.createScriptProcessor(4096, 1, 1);
        const sink = ctx.createGain(); sink.gain.value = 0;
        src.connect(proc); proc.connect(sink).connect(ctx.destination);
        proc.onaudioprocess = (e) => {
          const d = e.inputBuffer.getChannelData(0);
          for (let i = 0; i < d.length && pos < len; i++) buf[pos++] = d[i];
          if (pos >= len) { proc.disconnect(); src.disconnect(proc); analyse(buf, fs); rec.disabled = false; }
        };
      };
      function analyse(x, fs) {
        let pk = 0, pi = 0; for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > pk) { pk = a; pi = i; } }
        // noise floor from the first 0.4 s
        let nf = 0; const nN = Math.min(pi - 10, Math.floor(fs * 0.4)); for (let i = 0; i < nN; i++) nf += x[i] * x[i]; nf = nN > 0 ? Math.sqrt(nf / nN) : 1e-4;
        const snr = 20 * Math.log10(pk / (nf + 1e-9));
        if (pk < 0.05 || snr < 30) { status.textContent = `Impulse too quiet (peak/noise ≈ ${fmt(snr, 0)} dB). Clap louder or reduce background noise.`; return; }
        const seg = x.subarray(Math.max(0, pi - 20), Math.min(x.length, pi + Math.floor(fs * 2.5)));
        const out = []; lastCurves = [];
        P.BANDS6.forEach((f) => {
          const c = P.bandpassCoeffs(f, 1.41, fs);
          let y = P.biquad(seg, c); y = P.biquad(y, c);
          // truncate at noise floor (Lundeby-lite): find where smoothed envelope hits floor + 3 dB
          const win = Math.floor(fs * 0.02); let cut = y.length;
          const tailE = (() => { let e = 0, n = 0; for (let i = Math.floor(y.length * 0.85); i < y.length; i++) { e += y[i] * y[i]; n++; } return e / Math.max(1, n); })();
          for (let i = win; i < y.length; i += win) { let e = 0; for (let k = i - win; k < i; k++) e += y[k] * y[k]; e /= win; if (e < tailE * 2) { cut = i; break; } }
          const curve = P.schroederCurve(y.subarray(0, Math.max(cut, Math.floor(fs * 0.15))));
          const t = P.decayFit(curve, fs, -5, -25);
          out.push(t); lastCurves.push({ curve, fs });
        });
        status.textContent = `Impulse found (peak/noise ≈ ${fmt(snr, 0)} dB).`;
        res.innerHTML = P.BANDS6.map((f, i) => A.statBox(A.shortHz(f) + ' Hz', out[i] ? fmt(out[i], 2) + ' s' : '—', out[i] ? 'T20' : 'not enough decay range')).join('');
        A.store.set('measuredRT', out);
        decayCv.redraw();
      }

      /* ---------------- signal generator ---------------- */
      const gen = el('div', { class: 'card' });
      gen.appendChild(html('<h2 style="margin-top:0">Signal generator</h2><p class="muted">Sine tones for hunting room modes and rattles, slow sweeps, and noise. Start quietly — low frequencies at high level can damage small speakers.</p>'));
      const gst = A.controls(gen, [
        { key: 'f', label: 'Frequency', type: 'range', min: Math.log10(20), max: Math.log10(1000), step: 0.002, value: Math.log10(50), fmt: (v) => A.fmtHz(Math.pow(10, v)) },
        { key: 'lvl', label: 'Level', type: 'range', min: -40, max: -6, step: 1, value: -20, unit: 'dBFS' },
      ], () => { if (osc) { osc.frequency.setTargetAtTime(Math.pow(10, gst.f), A.audio.ctx.currentTime, 0.02); og.gain.setTargetAtTime(Math.pow(10, gst.lvl / 20), A.audio.ctx.currentTime, 0.02); } });
      let osc = null, og = null;
      const gr = el('div', { class: 'row' });
      const tone = el('button', { class: 'primary' }, 'Tone on/off');
      const sweep = el('button', {}, 'Slow sweep 20–200 Hz (30 s)');
      const stopB = el('button', {}, 'Stop');
      gr.append(tone, sweep, stopB); gen.appendChild(gr); root.appendChild(gen);
      const stopTone = () => { if (osc) { try { osc.stop(); } catch (e) { /* */ } osc = null; } };
      tone.onclick = () => {
        if (osc) return stopTone();
        const c = A.audio.get(); if (!c) return;
        osc = c.createOscillator(); og = c.createGain(); osc.frequency.value = Math.pow(10, gst.f); og.gain.value = Math.pow(10, gst.lvl / 20);
        osc.connect(og).connect(c.destination); osc.start(); A.audio.track(osc);
      };
      sweep.onclick = () => {
        stopTone();
        const c = A.audio.get(); if (!c) return;
        osc = c.createOscillator(); og = c.createGain(); og.gain.value = Math.pow(10, gst.lvl / 20);
        osc.frequency.setValueAtTime(20, c.currentTime); osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 30);
        osc.connect(og).connect(c.destination); osc.start(); osc.stop(c.currentTime + 30); A.audio.track(osc);
      };
      stopB.onclick = () => { stopTone(); A.audio.stopAll(); };
      A.onLeave(stopTone);
    },
  });
})();
