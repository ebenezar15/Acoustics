/* ==========================================================================
   Structured project case studies with computed before/after visuals.
   Illustrative composites built from the app's own models.
   ========================================================================== */
(function () {
  'use strict';
  const chart = (host, opts) => A.canvas(host, Object.assign({ height: 280 }, opts));
  const fAx = (min, max, label = 'Frequency (Hz)') => ({ min, max, log: true, label });
  const lineBA = (ctx, ax, before, after) => { A.plotLine(ctx, ax, before, A.css('muted'), 1.6, [5, 4]); A.plotLine(ctx, ax, after, A.css('accent'), 2.6); };
  const legendBA = (host, a = 'Before', b = 'After') => host.appendChild(A.legend([[A.css('muted'), a, true], [A.css('accent'), b]]));

  const C = [];
  /* 1 — coincident mode in a mix room */
  C.push({
    id: 'c-mixroom-57', name: 'Mix room with a 57 Hz “one-note” bass', type: 'Project case', tags: ['room modes', 'tuned trap', 'seat position'],
    summary: 'A 6.0 × 3.0 × 2.5 m converted garage: the width and length share modes, the seat sat in a null and the bass ballooned on one note.',
    stats: [['Bass spread at seat', '±9.1 dB', '±4.2 dB'], ['Decay of worst mode', '1.4 s', '0.36 s'], ['Ringing modes', '9', '2']],
    flow: [['Problem', 'Kick and bass vanish at the desk; one note booms when standing'], ['Diagnosis', '6.0 m = 2 × 3.0 m → modes stack at 57, 114, 171 Hz; seat at 50 % of length'], ['Solution', 'Seat to 38 %, 4 corner superchunks, two 57 Hz membrane traps in the front corners'], ['Result', 'Even bass, one mode left mildly long']],
    body: `<p><b>Why it happened.</b> When one dimension is a multiple of another, their axial modes share frequencies — here the 1st width mode and the 2nd length mode both land on 57 Hz. Their energy adds into one tall peak. Sitting at the room centre put the listener on the null of the odd length modes, so other bass notes disappeared.</p>
      <p><b>The fix, in order:</b> (1) move the seat to 38 % of the length — free; (2) broadband corner traps for the whole mode series (57, 114, 171 Hz…); (3) two tuned membrane traps (6 mm ply, ≈ 190 mm cavity) in the front corners, where both modes have maximum pressure.</p>
      <div class="callout mentor">Tuned traps fixed the single coincident mode; the corner superchunks handled its harmonics (114, 171 Hz). Neither alone was enough.</div>`,
    viz(host) {
      const room = { L: 6, W: 3, H: 2.5, alpha: 0.06 };
      const spk = [[0.5, 0.8, 1.1], [0.5, 2.2, 1.1]];
      const items = [[0, 0], [0, 3], [6, 0], [6, 3]].map(([x, y]) => ({ kind: 'corner', x: x ? 5.85 : 0.15, y: y ? 2.85 : 0.15, z0: 0, z1: 2.5, area: 2.1 }))
        .concat([[0.15, 0.15], [0.15, 2.85]].map(([x, y]) => ({ kind: 'membrane', f0: 57, x, y, z0: 0, z1: 1.2, area: 1.2 })));
      const b = P.treatedModes(room, []), a = P.treatedModes(room, items);
      const rb = P.modalResponseModes(room, b, spk, [3.0, 1.5, 1.2], 20, 200), ra = P.modalResponseModes(room, a, spk, [2.28, 1.5, 1.2], 20, 200);
      const off = rb.filter((p) => p.f > 120).reduce((s, p) => s + p.db, 0) / rb.filter((p) => p.f > 120).length;
      chart(host, { caption: 'Predicted bass at the listening seat: before (seat at room centre, untreated) and after (seat at 38 %, traps).', draw(ctx, w, h) { const ax = A.axes(ctx, w, h, { x: fAx(20, 200), y: { min: -30, max: 20, label: 'dB' } }); ctx.fillStyle = A.alpha(A.css('good'), 0.08); ctx.fillRect(ax.x0, ax.Y(3), ax.x1 - ax.x0, ax.Y(-3) - ax.Y(3)); lineBA(ctx, ax, rb.map((p) => [p.f, p.db - off]), ra.map((p) => [p.f, p.db - off])); } });
      legendBA(host);
    },
  });

  /* 2 — kick drum through a wall: fundamentals vs harmonics */
  C.push({
    id: 'c-kick-wall', name: 'Drummer next door: “we hear the thump, not the band”', type: 'Project case', tags: ['harmonics', 'isolation', 'fundamental'],
    summary: 'A rehearsal room shared a timber stud wall with a flat. Neighbours heard only kick and bass — a textbook case of walls filtering harmonics but passing fundamentals.',
    stats: [['Wall STC', '39', '68'], ['Kick at 63 Hz next door', '58 dB', '31 dB'], ['Audible bands', '63–500 Hz', 'none above background']],
    flow: [['Problem', 'Complaints about “thumping” even at moderate levels'], ['Diagnosis', 'Wall TL ≈ 15–20 dB at 50–80 Hz, > 50 dB above 1 kHz: harmonics gone, fundamentals pass'], ['Solution', 'Independent inner room: double stud, 2 + 2 dense gypsum, 200 mm cavity, floated floor on pads'], ['Result', 'Kick fundamental below the flat’s background noise']],
    body: `<p>The kick drum’s energy is in its <b>fundamental</b> (50–80 Hz); the click and attack live in harmonics and transients above 2 kHz. A single stud wall removes the harmonics well but barely touches the fundamental — so the neighbour hears a dull, pitch-less thud. Raising the STC with more drywall alone would mostly improve the frequencies that were already fine.</p>
      <p>The solution targeted the <b>fundamental</b>: decoupled leaves with a deep cavity (lower mass–air–mass resonance), more mass, and a floated floor to stop the kick pedal driving the structure.</p>`,
    viz(host) {
      const g1 = [{ mat: 'gypsumX', t: 0.0159 }], g2 = [{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }];
      const before = (f) => P.doubleLeafTL({ leaf1: P.leafProps(g1), leaf2: P.leafProps(g1), d: 0.089, filled: true, conn: 'wood' }, f).tl;
      const after = (f) => P.doubleLeafTL({ leaf1: P.leafProps(g2), leaf2: P.leafProps(g2), d: 0.2, filled: true, conn: 'none' }, f).tl;
      const kick = V.SOURCES_H.kick;
      chart(host, {
        height: 300, caption: 'Bars: the kick’s harmonics at the source (grey) and next door before (dashed) and after (orange). Curves: wall transmission loss before/after.',
        draw(ctx, w, h) {
          const ax = A.axes(ctx, w, h, { x: fAx(40, 4000), y: { min: 0, max: 110, label: 'Level (dB) / TL (dB)' } });
          const fs = []; for (let f = 40; f <= 4000; f *= 1.03) fs.push(f);
          A.plotLine(ctx, ax, fs.map((f) => [f, before(f)]), A.alpha(A.css('accent2'), 0.6), 1.4, [4, 3]);
          A.plotLine(ctx, ax, fs.map((f) => [f, after(f)]), A.css('accent2'), 2);
          kick.a.forEach((a, i) => { const f = kick.f0 * (i + 1), L = 105 + 20 * Math.log10(a), X = ax.X(f); [[L, A.alpha(A.css('muted'), 0.5), 9], [L - before(f), A.css('muted'), 5], [L - after(f), A.css('accent'), 5]].forEach(([v, c, lw]) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(X, ax.y0); ctx.lineTo(X, ax.Y(Math.max(0, v))); ctx.stroke(); }); });
          ctx.lineWidth = 1;
        },
      });
      host.appendChild(A.legend([[A.alpha(A.css('muted'), 0.5), 'Kick at source'], [A.css('muted'), 'Next door, before'], [A.css('accent'), 'Next door, after'], [A.css('accent2'), 'Wall TL (dashed = before)']]));
    },
  });

  /* 3 — restaurant noise */
  C.push({
    id: 'c-restaurant', name: 'Restaurant where nobody could hear each other', type: 'Project case', tags: ['reverberation', 'Lombard effect', 'ceiling'],
    summary: 'Concrete, glass and timber floors in a 600 m³ dining room: RT 1.9 s at 1 kHz and a crowd shouting over itself.',
    stats: [['RT @ 1 kHz', '1.9 s', '0.6 s'], ['Busy-hour level', '82 dBA', '74 dBA'], ['Conversation distance', '≈ 0.5 m', '≈ 1.5 m']],
    flow: [['Problem', 'Diners shout; staff complain of fatigue'], ['Diagnosis', 'Hard surfaces everywhere; reverberant build-up drives the Lombard effect'], ['Solution', '50 % of the ceiling with 50 mm suspended panels + upholstered banquettes'], ['Result', 'Room “calms”; people speak more quietly']],
    body: `<p>Each diner raises their voice to be heard over the reverberant noise of everyone else (the <b>Lombard effect</b>), which raises the noise again. Cutting the reverberation breaks the loop: the room gets quieter by more than the absorption alone predicts because people stop shouting.</p><p>The ceiling is the largest unobstructed surface, so it delivers the most absorption per euro; banquettes add absorption at seated head height.</p>`,
    viz(host) {
      const V0 = 600, S = 2 * (15 * 10 + 15 * 4 + 10 * 4);
      const aB = [0.05, 0.05, 0.05, 0.06, 0.07, 0.08], aAdd = [0.25, 0.6, 0.85, 0.9, 0.9, 0.85];
      const tb = aB.map((a) => P.sabine(V0, S * a + 15)), ta = aB.map((a, i) => P.sabine(V0, S * a + 15 + 75 * aAdd[i] + 20 * 0.6));
      chart(host, { caption: 'Reverberation time per octave band before and after the ceiling treatment (Sabine).', draw(ctx, w, h) { const ax = A.axes(ctx, w, h, { x: { min: 90, max: 5600, log: true, label: 'Octave band (Hz)', ticks: P.BANDS6, fmt: A.shortHz }, y: { min: 0, max: 2.6, label: 'RT60 (s)' } }); ctx.fillStyle = A.alpha(A.css('good'), 0.12); ctx.fillRect(ax.x0, ax.Y(0.8), ax.x1 - ax.x0, ax.Y(0.5) - ax.Y(0.8)); lineBA(ctx, ax, P.BANDS6.map((f, i) => [f, tb[i]]), P.BANDS6.map((f, i) => [f, ta[i]])); } });
      legendBA(host);
    },
  });

  /* 4 — boxy vocal booth */
  C.push({
    id: 'c-booth', name: 'Boxy vocal booth lined with 25 mm foam', type: 'Project case', tags: ['small room', 'porous depth', 'harmonics'],
    summary: 'A 1.5 × 1.2 × 2.2 m booth: voices sounded honky. The foam absorbed the harmonics above 1 kHz and left the 150–300 Hz modes ringing.',
    stats: [['RT @ 250 Hz', '0.42 s', '0.14 s'], ['RT @ 4 kHz', '0.09 s', '0.11 s'], ['Balance (250 / 4k)', '4.7×', '1.3×']],
    flow: [['Problem', '“Cupboard” sound on every singer'], ['Diagnosis', 'First modes 114–143 Hz; foam works only above ~800 Hz → dead highs, ringing low-mids'], ['Solution', 'Foam removed; 100 mm wool + 50 mm gap on all walls, 200 mm in corners, ceiling 150 mm'], ['Result', 'Even, neutral decay; voices sound natural']],
    body: `<p>A voice’s fundamental (85–255 Hz) and its lower harmonics sit exactly where a tiny booth resonates. Thin foam removes the <i>upper</i> harmonics (brilliance, sibilance) and leaves the <i>lower</i> ones ringing — the definition of boxy. Deep broadband absorption treats both evenly.</p>`,
    viz(host) {
      const V0 = 1.5 * 1.2 * 2.2, S = 2 * (1.5 * 1.2 + 1.5 * 2.2 + 1.2 * 2.2);
      const foam = P.BANDS6.map((f) => P.porousAlpha(f, 14000, 0.025, 0)), deep = P.BANDS6.map((f) => P.porousAlpha(f, 10000, 0.1, 0.05));
      const tb = foam.map((a) => P.eyring(V0, S, Math.min(0.9, a * 0.8 + 0.03))), ta = deep.map((a, i) => P.eyring(V0, S, Math.min(0.92, a * 0.85 + 0.03 + (i < 2 ? 0.1 : 0))));
      chart(host, { caption: 'Decay per band: thin foam (dashed) vs deep broadband absorption (orange).', draw(ctx, w, h) { const ax = A.axes(ctx, w, h, { x: { min: 90, max: 5600, log: true, label: 'Octave band (Hz)', ticks: P.BANDS6, fmt: A.shortHz }, y: { min: 0, max: 0.6, label: 'RT60 (s)' } }); lineBA(ctx, ax, P.BANDS6.map((f, i) => [f, tb[i]]), P.BANDS6.map((f, i) => [f, ta[i]])); } });
      legendBA(host, '25 mm foam', '100 mm + gap broadband');
    },
  });

  /* 5 — home cinema single vs four subs */
  C.push({
    id: 'c-cinema-subs', name: 'Home cinema: one subwoofer, three different movies', type: 'Project case', tags: ['subwoofers', 'seat-to-seat', 'modes'],
    summary: 'A 7 × 5 × 2.7 m cinema with a corner sub: the front row heard huge bass, the back row almost none.',
    stats: [['Seat-to-seat variation 30–100 Hz', '±10 dB', '±3 dB'], ['Subs', '1 (corner)', '4 (wall midpoints)'], ['EQ needed', 'Impossible', '2 gentle cuts']],
    flow: [['Problem', 'Every seat sounds different; EQ helps one seat, hurts others'], ['Diagnosis', 'Corner sub excites every mode; seats sit on different peaks and nulls'], ['Solution', 'Four subs at the wall midpoints, then one shared EQ'], ['Result', 'Bass consistent across rows']],
    body: `<p>A single source in a corner drives every mode at full strength, and each seat lands somewhere different on the standing-wave patterns. Four subs at the wall midpoints cancel the first width and length modes by symmetry (a well-known result from Welti and Devantier’s research), so the remaining response is similar at every seat — and one EQ then fixes all seats at once.</p>`,
    viz(host) {
      const room = { L: 7, W: 5, H: 2.7, alpha: 0.08 }, m = P.treatedModes(room, []);
      const seats = [[3.2, 2.5, 1.1], [3.2, 1.6, 1.1], [5.0, 2.5, 1.2], [5.0, 3.4, 1.2]];
      const one = [[0.2, 0.2, 0.3]], four = [[0.2, 2.5, 0.3], [6.8, 2.5, 0.3], [3.5, 0.2, 0.3], [3.5, 4.8, 0.3]];
      const R = (src) => seats.map((s) => P.modalResponseModes(room, m, src, s, 25, 120, 140));
      const r1 = R(one), r4 = R(four);
      const norm = (rs) => { const mean = rs.flat().reduce((a, p) => a + p.db, 0) / rs.flat().length; return rs.map((r) => r.map((p) => [p.f, p.db - mean])); };
      const n1 = norm(r1), n4 = norm(r4);
      const g = A.el('div', { class: 'grid g2' }); host.appendChild(g);
      [['One corner sub — 4 seats', n1], ['Four midpoint subs — same 4 seats', n4]].forEach(([t, data]) => { const c = A.el('div'); g.appendChild(c); A.canvas(c, { height: 240, caption: t, draw(ctx, w, h) { const ax = A.axes(ctx, w, h, { x: fAx(25, 120), y: { min: -25, max: 15, label: 'dB' } }); data.forEach((d, i) => A.plotLine(ctx, ax, d, A.series(i), 2)); } }); });
    },
  });

  /* 6 — gym above apartments */
  C.push({
    id: 'c-gym', name: 'Gym above apartments: dropped weights and treadmill rumble', type: 'Project case', tags: ['impact', 'floating floor', 'vibration'],
    summary: 'A fitness studio on a 200 mm slab. Below: thuds from dropped weights and a 30 Hz rumble from treadmills.',
    stats: [['Floor system fn', '— (rigid)', '9 Hz'], ['Isolation at 31.5 Hz', '0 dB', '≈ 22 dB'], ['Isolation at 63 Hz', '0 dB', '≈ 31 dB']],
    flow: [['Problem', 'Residents complain about thuds and hum'], ['Diagnosis', 'Impact & machine forces go straight into the slab; forcing 2–40 Hz'], ['Solution', '100 mm concrete floated on PU bearings (≈ 7 Hz) + 100 mm cavity; treadmills on extra pads'], ['Result', 'Thuds reduced to faint; rumble inaudible']],
    body: `<p>Impact noise is structure-borne: no wall or ceiling lining below can fully stop it once the slab is vibrating. The fix belongs at the source — a heavy floated floor whose natural frequency is well below the forcing frequencies. The trapped-air stiffness of the cavity was checked so it didn’t raise the system frequency (see the Floating Floors designer).</p>`,
    viz(host) { const c = A.el('div'); host.appendChild(c); V.transmissibility(c, { fn: 9, ff: 31.5 }); },
  });

  /* 7 — lecture hall echo */
  C.push({
    id: 'c-lecture-echo', name: 'Lecture hall with a slap-back echo', type: 'Project case', tags: ['echo', 'reflections', 'diffusion'],
    summary: 'A 300-seat raked hall: a hard, concave rear wall returned a strong reflection 80 ms after the speaker’s voice.',
    stats: [['Rear-wall reflection', '−4 dB @ 80 ms', '−17 dB'], ['STI (front/back)', '0.55 / 0.46', '0.63 / 0.60'], ['RT @ 1 kHz', '1.2 s', '0.9 s']],
    flow: [['Problem', 'Words blur; a distinct repeat behind the lecturer'], ['Diagnosis', 'Path difference ≈ 27 m → 80 ms; concave wall focuses it'], ['Solution', 'Absorb the lower rear wall, diffuse the upper part, tilt the projection booth glass'], ['Result', 'Echo gone; clearer speech everywhere']],
    body: `<p>Reflections later than ~50 ms are heard as separate echoes for speech. The concave rear wall made it worse by focusing energy back to the lectern. Absorbing it reduced the echo by ~13 dB; diffusing the upper half kept some liveliness for applause and music.</p>`,
    viz(host) {
      chart(host, { caption: 'Echogram at the lectern: the rear-wall echo before (red) and after treatment (orange).', draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: { min: 0, max: 120, label: 'Time (ms)' }, y: { min: -30, max: 0, label: 'dB' } });
        const bar = (t, d, c, lw = 4) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(ax.X(t), ax.y0); ctx.lineTo(ax.X(t), ax.Y(d)); ctx.stroke(); };
        bar(1, 0, A.css('accent2')); [[8, -8], [14, -11], [22, -13], [35, -16]].forEach(([t, d]) => bar(t, d, A.css('muted'), 3));
        bar(80, -4, A.css('bad'), 6); bar(81, -17, A.css('accent'), 4); for (let t = 82; t < 110; t += 2.5) bar(t, -22 - (t - 82) * 0.15, A.alpha(A.css('accent'), 0.5), 2);
        ctx.lineWidth = 1; ctx.fillStyle = A.alpha(A.css('bad'), 0.08); ctx.fillRect(ax.X(50), ax.y1, ax.x1 - ax.X(50), ax.y0 - ax.y1);
        A.text(ctx, 'echo zone for speech (> 50 ms)', ax.X(52), ax.y1 + 14, { size: 11, color: A.css('bad') });
      } });
    },
  });

  /* 8 — podcast table */
  C.push({
    id: 'c-podcast', name: 'Podcast studio that sounded “hollow”', type: 'Project case', tags: ['comb filter', 'early reflections', 'cloud'],
    summary: 'Two hosts at a glass table under a low gypsum ceiling. The table and ceiling bounces arrived within 2–4 ms of the voice.',
    stats: [['Deepest comb notch', '−18 dB', '−4 dB'], ['Early reflection level', '−3 dB', '−15 dB'], ['RT @ 500 Hz', '0.55 s', '0.25 s']],
    flow: [['Problem', 'Hollow, phasey voices that change when hosts lean'], ['Diagnosis', 'Table reflection: 0.6 m extra path → notches every 570 Hz'], ['Solution', 'Felt-topped table, 1.2 × 1.8 m cloud, wall panels at head height, dynamic mics closer'], ['Result', 'Intimate, dry voice; no tonal swings']],
    body: `<p>A strong reflection arriving a couple of milliseconds after the direct voice creates a comb filter — regularly spaced notches across the harmonics of the voice. Because each harmonic falls on a different part of the comb, the timbre changes with every lean. Absorbing the reflecting surfaces collapses the comb.</p>`,
    viz(host) {
      chart(host, { caption: 'Response at the mic: strong table reflection (dashed) vs absorbed reflection (orange).', draw(ctx, w, h) { const ax = A.axes(ctx, w, h, { x: fAx(100, 10000), y: { min: -25, max: 8, label: 'dB' } }); const fs = []; for (let f = 100; f <= 10000; f *= 1.005) fs.push(f); lineBA(ctx, ax, fs.map((f) => [f, P.combResponse(f, 0.6, 0.85)]), fs.map((f) => [f, P.combResponse(f, 0.6, 0.18)])); } });
      legendBA(host);
    },
  });

  /* 9 — transformer hum */
  C.push({
    id: 'c-transformer', name: 'Substation hum in a recording studio', type: 'Project case', tags: ['harmonics', 'vibration', 'tonal noise'],
    summary: 'A building transformer next to the live room produced a tonal hum at 100 Hz with strong harmonics at 200, 300 and 400 Hz.',
    stats: [['100 Hz tone in live room', '38 dB', '19 dB'], ['NC rating', 'NC-30 (tonal)', 'NC-15'], ['Audible harmonics', '100–400 Hz', 'none']],
    flow: [['Problem', 'Faint hum on quiet takes; worse at night'], ['Diagnosis', 'Magnetostriction vibrates at 2× mains (100 Hz) + harmonics; transmitted through the slab'], ['Solution', 'Transformer on spring mounts with neoprene pads, flexible bus connections, live room on its floated slab'], ['Result', 'Hum below the noise floor']],
    body: `<p>Transformers hum at <b>twice</b> the mains frequency (100 Hz in 50 Hz countries, 120 Hz in 60 Hz) because the core’s magnetostriction peaks twice per cycle — plus a harmonic series. Tonal noise is far more noticeable than broadband noise at the same level. Absorption would not help: the energy was structure-borne. Isolating the source with springs (fn ≈ 4 Hz, far below 100 Hz) removed it at the root.</p>`,
    viz(host) {
      const amps = [0.3, 1, 0.35, 0.5, 0.2, 0.25, 0.1, 0.12];
      chart(host, { caption: 'Hum spectrum in the live room before (grey) and after isolating the transformer (orange), against the NC-15 curve.', draw(ctx, w, h) {
        const ax = A.axes(ctx, w, h, { x: fAx(40, 1000), y: { min: 0, max: 50, label: 'dB SPL' } });
        A.plotLine(ctx, ax, P.OCT.slice(0, 5).map((f, i) => [f, P.NC_CURVES[15][i]]), A.css('good'), 1.5, [5, 4]);
        amps.forEach((a, i) => { const f = 50 * (i + 1); if (f < 100 && i === 0) return; const L = 38 + 20 * Math.log10(a), X = ax.X(f); const T = P.transmissibility(f / 4, 0.03); ctx.strokeStyle = A.css('muted'); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(X, ax.y0); ctx.lineTo(X, ax.Y(Math.max(0, L))); ctx.stroke(); ctx.strokeStyle = A.css('accent'); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X, ax.y0); ctx.lineTo(X, ax.Y(Math.max(0, L + 20 * Math.log10(T) * 0.5))); ctx.stroke(); A.text(ctx, f + '', X, ax.Y(Math.max(0, L)) - 6, { align: 'center', size: 10, color: A.css('muted') }); });
        ctx.lineWidth = 1;
      } });
      host.appendChild(A.legend([[A.css('muted'), 'Before'], [A.css('accent'), 'After'], [A.css('good'), 'NC-15', true]]));
    },
  });

  /* 10 — worship feedback */
  C.push({
    id: 'c-worship-feedback', name: 'Worship band: feedback before the vocals were loud enough', type: 'Project case', tags: ['feedback', 'resonance', 'monitors'],
    summary: 'Wedges and a wide PA in a reverberant room: lead vocal rang at 2.5 kHz before reaching the needed level.',
    stats: [['Gain before feedback', '−4 dB short', '+5 dB margin'], ['Open mics', '8', '4 (gated)'], ['Stage level', '98 dBA', '86 dBA']],
    flow: [['Problem', 'Vocals can’t get loud; ringing at 2.5 kHz'], ['Diagnosis', 'Mic worked 30 cm from the mouth; wedges off the cardioid null; 8 open mics'], ['Solution', 'IEMs for band, cardioid mics close-worked, supercardioid wedge angles, fewer open mics'], ['Result', 'Vocals clear and loud with margin']],
    body: `<p>Feedback is resonance: the loop speaker → room → mic → amplifier has a peak, and when its gain reaches 1 at that frequency the system rings. Narrow notches can buy 3–6 dB, but geometry buys far more: halving talker-to-mic distance gains 6 dB, halving open mics gains 3 dB, and in-ear monitors remove the wedges from the loop entirely.</p>`,
    viz(host) { const c = A.el('div'); host.appendChild(c); V.feedback(c); },
  });

  /* 11 — integrated fabric wall mix room */
  C.push({
    id: 'c-hidden-mix', name: 'A mix room with no visible treatment', type: 'Project case', tags: ['hidden treatment', 'integrated wall', 'fabric'],
    summary: 'A client wanted a living-room look. 300 mm of wall depth was split into isolation and a fabric-faced absorber zone around the whole room.',
    stats: [['Wall STC (est.)', '52 (existing)', '70'], ['α @ 125 Hz (wall average)', '0.10', '0.45'], ['Visible panels', 'would need 14', '0']],
    flow: [['Problem', 'Needs isolation + treatment, but no visible panels'], ['Diagnosis', 'Only 300 mm per wall available'], ['Solution', '120 mm independent lining (2 layers), 180 mm wool + air behind stretched fabric; tri-corner traps; QRD behind fabric at rear'], ['Result', 'Pro-grade decay, looks like a lounge']],
    body: `<p>Instead of treating 30 % of each wall with panels, the treatment zone covered 100 % of the wall area behind fabric — several times more low-frequency absorption from the same depth. The airtight isolation leaf stayed sealed behind it. See the <a href="#/treatment/hidden">Hidden & integrated</a> tab to try your own depth split.</p>`,
    viz(host) { const c = A.el('div'); c.innerHTML = DR.hybridWall({ base: 'masonry', isoGap: 0.02, stud: 0.07, leafLayers: 2, airTreat: 0.06, treat: 0.12, label: 'as built' }); host.appendChild(c); },
  });

  LIB.cases.push(...C);
})();
