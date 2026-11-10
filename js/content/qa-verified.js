/* ==========================================================================
   "Questions answered — verified": common acoustics Q&A checked against
   physics, rewritten in plain words, made interactive and placed in the
   lessons where they belong. Every claim is marked ✓ correct,
   ⚠ needs nuance or ✗ incorrect (with the correction).
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const BADGE = { ok: ['✓', 'Correct'], nu: ['⚠', 'Needs nuance'], no: ['✗', 'Incorrect'] };
  const verdicts = (rows, title = 'Statements checked') => `<div class="verify"><div class="verify-h">${title}</div>${rows.map(([claim, v, fix]) => `<div class="vrow v-${v}"><span class="vbadge">${BADGE[v][0]} ${BADGE[v][1]}</span><div><div class="vclaim">“${claim}”</div><div class="vfix">${fix}</div></div></div>`).join('')}</div>`;
  const L = (id) => window.LESSONS.find((l) => l.id === id);
  const addTo = (id, secs, beforeQuiz = true) => { const l = L(id); if (!l) return; l.sections.push(...secs); };
  const qtable = (fs) => `<div class="table-wrap"><table><tr><th>Frequency</th><th class="num">λ</th><th class="num">λ/4 (velocity peak, quiet for pressure)</th><th class="num">λ/2 (next loud spot)</th></tr>${fs.map((f) => `<tr><td>${f} Hz</td><td class="num">${(343 / f).toFixed(2)} m</td><td class="num">${(343 / f / 4).toFixed(2)} m</td><td class="num">${(343 / f / 2).toFixed(2)} m</td></tr>`).join('')}</table></div>`;

  const SVG_WALL = `<svg class="gsvg" viewBox="0 0 640 210" role="img" aria-label="Pressure and velocity near a wall">
    <rect x="20" y="20" width="16" height="170" fill="var(--muted)"/>
    <text x="28" y="14" text-anchor="middle" font-size="11" font-weight="700">wall</text>
    <path d="M36 70 ${Array.from({ length: 60 }, (_, i) => { const x = i * 10; return `L${36 + x} ${70 - 45 * Math.abs(Math.cos((Math.PI * x) / 280))}`; }).join(' ')}" fill="none" stroke="var(--c3)" stroke-width="3"/>
    <path d="M36 175 ${Array.from({ length: 60 }, (_, i) => { const x = i * 10; return `L${36 + x} ${175 - 45 * Math.abs(Math.sin((Math.PI * x) / 280))}`; }).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="3"/>
    ${[0, 1, 2, 3, 4].map((q) => `<line x1="${36 + q * 140}" y1="20" x2="${36 + q * 140}" y2="190" stroke="${q % 2 ? 'var(--bad)' : 'var(--good)'}" stroke-dasharray="3 4" opacity=".6"/><text x="${36 + q * 140}" y="204" text-anchor="middle" font-size="10" fill="var(--muted)">${q === 0 ? '0' : q + 'λ/4'}</text>`).join('')}
    <text x="600" y="34" text-anchor="end" font-size="11" fill="var(--c3)" font-weight="700">pressure (loudness)</text>
    <text x="600" y="140" text-anchor="end" font-size="11" fill="var(--accent)" font-weight="700">particle velocity</text>
    <text x="110" y="108" font-size="10" fill="var(--muted)">pressure trap here (wall)</text>
    <text x="180" y="122" font-size="10" fill="var(--muted)">porous trap reaches here (λ/4)</text>
  </svg>`;
  const SVG_PIPES = `<svg class="gsvg" viewBox="0 0 640 190" role="img" aria-label="Closed and open pipes">
    ${[['Closed – closed (a room)', 'λ/2 = L → f = c/2L', true, true, 20], ['Closed – open', 'λ/4 = L → f = c/4L', true, false, 80], ['Open – open', 'λ/2 = L → f = c/2L', false, false, 140]].map(([t, f, a, b, y]) => `
      <text x="20" y="${y + 12}" font-size="11" font-weight="700">${t}</text><text x="20" y="${y + 28}" font-size="10" fill="var(--muted)">${f}</text>
      <rect x="230" y="${y}" width="360" height="40" fill="var(--panel2)" stroke="var(--line)"/>
      ${a ? `<rect x="224" y="${y - 4}" width="8" height="48" fill="var(--text)"/>` : ''}${b ? `<rect x="588" y="${y - 4}" width="8" height="48" fill="var(--text)"/>` : ''}
      <path d="${Array.from({ length: 37 }, (_, i) => { const x = i * 10, u = x / 360; const v = a && b ? Math.cos(Math.PI * u) : a && !b ? Math.cos((Math.PI / 2) * u) : Math.sin(Math.PI * u); return `${i ? 'L' : 'M'}${230 + x} ${y + 20 - 16 * v}`; }).join(' ')}" fill="none" stroke="var(--c3)" stroke-width="2.5"/>`).join('')}
    <text x="410" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">blue = pressure of the lowest resonance · walls = pressure maximum · open ends = pressure ≈ 0</text>
  </svg>`;
  const SVG_REW = `<svg class="gsvg" viewBox="0 0 640 200" role="img" aria-label="Reading a measured response">
    <rect x="20" y="20" width="600" height="150" fill="var(--panel2)" stroke="var(--line)"/>
    <path d="M30 100 C 60 100, 70 40, 95 40 S 120 100, 140 100 L 170 100 C 185 100, 190 160, 196 165 C 202 160, 208 100, 225 100 L 330 100 ${Array.from({ length: 28 }, (_, i) => `L${335 + i * 10} ${i % 2 ? 108 : 92}`).join(' ')} L 610 100" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
    <text x="95" y="34" text-anchor="middle" font-size="11" font-weight="700" fill="var(--bad)">mountain = mode peak</text>
    <text x="198" y="186" text-anchor="middle" font-size="11" font-weight="700" fill="var(--bad)">canyon = null (don’t EQ)</text>
    <text x="470" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="var(--bad)">comb = early reflection</text>
    <line x1="300" y1="20" x2="300" y2="170" stroke="var(--good)" stroke-dasharray="4 4"/><text x="304" y="34" font-size="10" fill="var(--good)">≈ Schroeder</text>
  </svg>`;

  /* ---------------------------------------------------------------------
     New core lesson (acoustics track, after Room Modes)
     --------------------------------------------------------------------- */
  const PV = {
    id: 'pv-standing', n: '6B', title: 'Pressure, Velocity & Standing Waves: Why Walls Are Loud and Bass Traps Need Depth', level: 'Core', mins: 35,
    summary: 'The everyday questions — why bass is loud at walls and corners, why quiet spots appear, what λ/4 and λ/2 really mean, and where each kind of trap belongs — answered, checked and made interactive.',
    tags: ['pressure', 'particle velocity', 'standing wave', 'quarter wavelength', 'node', 'antinode', 'boundary', 'pipe', 'bass trap placement'],
    sections: [
      { h: 'Two ways to describe a sound wave', html: `
        <p class="lead">Every sound wave carries two things at once: <b>pressure</b> (the air being squeezed and stretched) and <b>particle velocity</b> (the air moving back and forth). Your ears and most microphones respond to pressure; porous absorbers respond to velocity.</p>
        ${flow([['Free space', 'pressure and velocity peak together'], ['Hit a wall', 'air can’t move into it: velocity = 0'], ['Reflection', 'incident + reflected waves overlap'], ['Standing wave', 'fixed loud and quiet spots'], ['Design', 'put ears, traps and subs in the right spots']])}
        <p>Play with the simulator: switch between free field, a hard wall, an absorber-covered wall, an open end and a room with two walls. Drag the ear and listen to the tone.</p>`, viz: 'standingWave' },
      { h: 'Why pressure is highest at a hard wall', html: `
        ${SVG_WALL}
        <p>At a rigid wall the air next to it cannot move, so the incoming and reflected velocities cancel. The incoming and reflected <b>pressures add</b> — for a strong reflection the pressure doubles (+6 dB). That is why bass sounds heavier against a wall and heaviest in a corner, where two or three boundaries add up.</p>
        <div class="uc-grid">
          <div class="uc"><h4><span class="uc-ico">🎙️</span>Boundary microphones</h4><dl><dt>Why on the floor or table</dt><dd>The capsule sits where pressure is doubled and there is no delayed reflection to cause comb filtering.</dd></dl></div>
          <div class="uc"><h4><span class="uc-ico">🔊</span>Subwoofer in a corner</h4><dl><dt>Effect</dt><dd>Couples to every mode at its pressure maximum: more output, but also every resonance excited — it needs heavy trapping.</dd></dl></div>
          <div class="uc"><h4><span class="uc-ico">🛋️</span>Sofa against the back wall</h4><dl><dt>Effect</dt><dd>Your head is in the pressure maximum: exaggerated bass and very early reflections. Pull the seat forward or treat deeply behind it.</dd></dl></div>
        </div>
        <div class="callout physics">Energy is not “converted” at the wall. Two waves (going in and coming back) overlap; where they agree the pressure is high, where they disagree it is low. The total energy is simply redistributed into a pattern of loud and quiet spots.</div>` },
      { h: 'The quarter-wave map: where it’s loud, where it’s quiet', html: `
        <p>The reflected wave has to travel to the wall and back. At a quarter-wavelength (λ/4) from the wall that round trip is half a wavelength, so the reflection arrives upside-down and <b>cancels</b> the pressure — a quiet spot (node) where the air moves fastest. At λ/2 the round trip is a full wavelength and the waves <b>reinforce</b> again.</p>
        ${qtable([40, 63, 86, 100, 125, 200, 500])}
        <div class="callout example">Room 4 m long, tone at 86 Hz (λ = 4 m): loud at both walls and in the centre, quiet at 1 m and 3 m from either wall. Walk the room with a steady bass tone and you will hear exactly this.</div>
        <div class="callout data"><b>Rule:</b> even quarters (0, λ/2, λ …) = pressure high, air still. Odd quarters (λ/4, 3λ/4 …) = pressure low, air moving fastest. Ears like the first; porous absorbers need the second.</div>` },
      { h: 'Rooms, pipes and the fundamental mode', html: `
        ${SVG_PIPES}
        <p>Between two hard walls the longest wave that fits has a pressure maximum at each wall — half a wavelength. So the first axial mode of a dimension is <b>f = c / 2L</b> (343 / 2L). A pipe closed at one end and open at the other resonates at a quarter-wavelength (f = c / 4L).</p>
        <div class="formula"><span class="lbl">Axial modes of one dimension</span>f<sub>n</sub> = n · 343 / (2L) &nbsp; (n = 1, 2, 3 …)</div>
        <p>A 5 m room: 34, 69, 103, 137 Hz … Use the mode ladder in <a href="#/academy/m-small-rooms">Small-Room Acoustics</a> or the <a href="#/predict">Room Predictor</a> for all three dimensions.</p>` },
      { h: 'Where each kind of bass trap belongs', html: `
        <div class="table-wrap"><table><tr><th>Trap type</th><th>Works on</th><th>Best place</th><th>Why</th></tr>
          <tr><td><b>Porous</b> (mineral wool, glass wool, thick foam)</td><td>Particle velocity (friction)</td><td>Spaced off the wall, thick, across corners; ideally reaching toward λ/4</td><td>Air must move through the fibres</td></tr>
          <tr><td><b>Membrane / panel</b> (diaphragmatic)</td><td>Pressure (the panel is pushed)</td><td>On walls and in corners</td><td>Pressure is highest at boundaries for every mode</td></tr>
          <tr><td><b>Helmholtz</b> (slotted/perforated, bottle-type)</td><td>Pressure at the opening</td><td>Walls/corners, or a measured peak location</td><td>Narrow-band: tune to one problem mode</td></tr></table></div>
        <p><b>Can a pressure trap go in the middle of the room?</b> Only for one tuned frequency, at a spot you have measured to be its pressure peak — other frequencies may have a node there. Walls and corners are where <i>every</i> mode has a pressure maximum, which is why traps live there.</p>`, viz: 'quarterWave' },
      { h: 'Ears, pressure microphones and velocity microphones', html: `
        <p>Your eardrum moves when the pressure on its two sides differs, so loudness follows <b>pressure amplitude</b> — a squeeze and a stretch are equally loud. Omnidirectional (pressure) microphones behave the same way.</p>
        <p>Figure-8 and ribbon microphones are <b>pressure-gradient</b> designs: they respond to the difference across the diaphragm, which follows particle velocity. In a standing wave they can pick up bass where an omni hears a null — and near a source they show proximity effect (bass boost).</p>
        <div class="callout mentor">Measuring a room? Use an omni measurement mic: it hears what your ears hear. Recording in a small booth? A directional mic’s low end changes as you move through standing waves — move the singer or mic a few centimetres and listen.</div>` },
      { h: 'Statements checked', html: verdicts([
        ['Sound pressure is maximum at a hard boundary because the boundary forces the particle velocity to zero.', 'ok', 'Correct for a rigid (hard) surface; for a strong reflection the pressure at the surface doubles (+6 dB).'],
        ['At the wall the kinetic energy is converted into pressure to conserve energy.', 'nu', 'A helpful picture, but the real mechanism is superposition: incident and reflected waves add (pressure) and cancel (velocity). Energy is redistributed in space, not converted at a point.'],
        ['In any sound wave, pressure and velocity are 90° apart; at a compression peak the particles stand still.', 'no', 'Only in a <b>standing wave</b>. In a free travelling wave pressure and velocity are <b>in phase</b> (u = p/ρc): the particles move fastest at the compression peak. Try “Free field” in the simulator.'],
        ['The λ/4 point from a wall is the velocity maximum, so porous absorbers work best there.', 'ok', 'Correct for a normal-incidence standing wave. In practice absorbers already work well when they reach about λ/10–λ/8, and sound arrives from many angles — λ/4 is the ideal, not a hard threshold.'],
        ['A 100 Hz wave is about 3.4 m long, so λ/4 is about 0.85 m.', 'ok', '343/100 = 3.43 m; λ/4 = 0.86 m.'],
        ['The room fundamental is f = c/2L.', 'ok', 'For the first axial mode of each dimension. It is not always the strongest peak at your seat — that depends on position and on where modes stack.'],
        ['Pressure reflects in phase from a hard wall; velocity reflects inverted.', 'ok', 'That is exactly why pressure doubles and velocity is zero at the surface.'],
        ['A closed–open pipe resonates at λ/4, an open–open pipe at λ/2.', 'ok', 'Standard pipe acoustics (plus a small end correction at open ends).'],
        ['Opening a window turns the wall into a pressure node and stops a room booming.', 'nu', 'A small window mostly leaks a little bass. Only a large opening into a much bigger space changes the boundary enough to shift or weaken a mode.'],
        ['Your ears and microphones are pressure sensors.', 'nu', 'True for ears and omni (pressure) mics. Figure-8, ribbon and other directional mics are pressure-gradient — they respond to velocity-like differences.'],
        ['Corners are the maximum-pressure point for almost every mode.', 'ok', 'Every mode has a pressure maximum in a rigid corner — the best place to put a pressure trap, and the place a subwoofer excites everything.'],
        ['Place pressure absorbers at walls/corners and porous absorbers away from the wall.', 'ok', 'Correct strategy. Thick porous traps that touch the wall still work — what matters is that they extend out into moving air.'],
      ]) },
    ],
    quiz: [
      { q: 'In a free travelling wave (no reflections), pressure and particle velocity are…', opts: ['90° apart', 'in phase', 'always zero', '180° apart'], a: 1, why: 'u = p/ρc. The 90° split appears only in standing waves.' },
      { q: 'At what distance from a hard wall is the first pressure null for 125 Hz?', opts: ['0 m', '0.69 m', '1.37 m', '2.74 m'], a: 1, why: 'λ = 2.74 m; λ/4 = 0.69 m.' },
      { q: 'Where does a membrane (pressure) trap work best?', opts: ['Room centre', 'At λ/4 from the wall', 'On a wall or in a corner', 'On the ceiling centre'], a: 2, why: 'Pressure is maximal at boundaries for every mode.' },
      { q: 'First axial mode of a 5 m length?', opts: ['17 Hz', '34 Hz', '69 Hz', '86 Hz'], a: 1, why: '343 / (2 × 5) = 34.3 Hz.' },
      { q: 'Which microphone type can pick up bass at a pressure null?', opts: ['Omni pressure mic', 'Figure-8 / ribbon', 'Boundary mic', 'None'], a: 1, why: 'Pressure-gradient mics respond to velocity, which peaks at pressure nulls.' },
    ],
  };
  const mi = window.LESSONS.findIndex((l) => l.id === 'modes');
  window.LESSONS.splice(mi >= 0 ? mi + 1 : window.LESSONS.length, 0, PV);

  /* ---------------------------------------------------------------------
     Additions to existing lessons
     --------------------------------------------------------------------- */
  addTo('m-small-rooms', [
    { h: 'Wave region vs ray region — the Schroeder frequency, checked', html: `
      <p>Below the Schroeder frequency, wavelengths are comparable to the room (roughly 1–10 m), modes are few and far apart, and the room behaves like a set of resonances: loud and quiet spots, one-note bass. Above it, modes overlap so densely that the field becomes statistical — rays, reflections and reverberation describe it well.</p>
      <div class="formula"><span class="lbl">Schroeder frequency</span>f<sub>S</sub> ≈ 2000 · √(RT60 / V) &nbsp; (V in m³)</div>
      <div class="callout example">A 50 m³ mix room with RT60 = 0.3 s: f<sub>S</sub> ≈ 2000·√(0.006) ≈ 155 Hz. A 25 m³ booth at 0.2 s: ≈ 180 Hz. A 2 000 m³ hall at 1.8 s: ≈ 60 Hz.</div>
      ${verdicts([
        ['The Schroeder frequency is around 200–300 Hz in most rooms.', 'nu', 'Typical small studios are about 100–250 Hz; treated rooms and larger rooms lower. Calculate it for your room.'],
        ['Below Schroeder wavelengths are 5–15 m; above it they are 2–10 cm.', 'no', 'The transition is where wavelengths are about 1–3 m (≈ 100–300 Hz). 2–10 cm wavelengths are 3–17 kHz.'],
        ['Above Schroeder there are so many overlapping modes that the response no longer has single-frequency dead spots.', 'ok', 'Modal density grows with f²; above f<sub>S</sub> each frequency excites several overlapping modes.'],
      ])}`, viz: 'modeLadder' },
    { h: 'Mode spacing: why “evenly spread” sounds better', html: `
      <p>Isolated modes with big gaps make some bass notes boom and others vanish. Closely spaced, evenly distributed modes overlap and support every note more evenly. A cube is the worst case: length, width and height share the same modes, so they stack into one super-peak.</p>
      <div class="table-wrap"><table><tr><th>Room</th><th>First axial modes (L / W / H)</th><th>Verdict</th></tr>
        <tr><td>4 × 4 × 4 m cube</td><td>43 / 43 / 43 Hz</td><td><span class="bad">Triple stack + empty gap to 86 Hz</span></td></tr>
        <tr><td>5.7 × 4.2 × 3.0 m</td><td>30 / 41 / 57 Hz</td><td><span class="good">Staggered — interleaving ladders</span></td></tr></table></div>
      ${verdicts([
        ['Treating the lowest fundamental will make its harmonics (2×, 3×) settle down too.', 'nu', 'Each mode is its own resonance with its own decay. A tuned 40 Hz trap leaves 80 and 120 Hz untouched; broadband corner traps help all of them (higher ones more). Prioritising the lowest, longest-ringing mode is still good practice.'],
        ['A peak at an exact multiple of c/2L is a higher-order mode of that dimension.', 'ok', 'Use the peak identifier above. Peaks that match no mode are often speaker–boundary interference or a desk/floor reflection.'],
        ['The number of modes quadruples every octave.', 'nu', 'The total count up to frequency f grows with f³, so the count <i>within</i> each octave grows about 8× per octave at high frequencies; at low frequencies axial modes dominate and growth is slower.'],
      ])}` },
  ]);
  addTo('modes-treat', [
    { h: 'Questions answered: placement by pressure and velocity', html: `
      <p>For the full explanation of why walls are loud and why porous traps need depth, see <a href="#/academy/pv-standing">Pressure, Velocity & Standing Waves</a>. The quick rule:</p>
      ${flow([['Find the problem frequency', 'measure or predict'], ['Pressure trap?', 'wall or corner, tuned near the mode'], ['Porous trap?', 'thick, spaced off, across corners'], ['Re-measure', 'decay time, not just level']])}`, viz: 'quarterWave' },
  ]);
  addTo('measurement', [
    { h: 'Reading a measurement (REW and similar): mountains, canyons and combs', html: `
      ${SVG_REW}
      <div class="table-wrap"><table><tr><th>What you see</th><th>Likely cause</th><th>Test</th><th>Fix</th></tr>
        <tr><td>Broad tall <b>peak</b> below ~200 Hz</td><td>Room mode (seat near a pressure maximum)</td><td>Does it match n·343/2L?</td><td>Move seat; traps; then EQ cut</td></tr>
        <tr><td>Deep narrow <b>dip</b> (≥ 10 dB)</td><td>Mode null or speaker-boundary interference</td><td>Move mic 30 cm — does it move?</td><td>Move seat/speakers. <b>Never boost</b>.</td></tr>
        <tr><td>Regular <b>comb</b> ripples above ~300 Hz</td><td>Early reflection (desk, side wall, floor)</td><td>Impulse/ETC: spike 1–5 ms after direct</td><td>Absorb or redirect the reflection point</td></tr>
        <tr><td>Long ridge in the <b>waterfall</b></td><td>Ringing mode</td><td>Decay much longer than its neighbours</td><td>Pressure trap tuned to it; corner traps</td></tr>
        <tr><td>L and R curves differ</td><td>Asymmetry</td><td>Measure each speaker alone</td><td>Make the room and layout symmetrical</td></tr></table></div>
      ${verdicts([
        ['A modal null cannot be fixed with EQ.', 'ok', 'Boosting adds energy to both the direct and the cancelling reflected wave; the dip remains and the amplifier works harder.'],
        ['The fundamental mode usually has the longest decay tail.', 'nu', 'Often true because absorbers are weakest at the lowest frequencies, but any lightly damped mode can ring longest — read the waterfall.'],
        ['If the comb ripples move when you lower the mic 10 cm, the reflection comes from the desk or floor.', 'ok', 'Vertical movement changes floor/desk path differences most.'],
      ])}` },
  ]);
  addTo('m-control', [
    { h: 'Which way should the desk face? (checked)', html: `
      <p>In small rooms the usual advice — <b>face down the length</b>, desk on a short wall — holds up: the side walls are symmetrical and close enough to treat, the rear-wall reflection arrives late, and there is room to move the seat out of a mode null and the speakers off the front wall.</p>
      ${verdicts([
        ['Always fire down the longest dimension.', 'nu', 'The best default for small rooms, not a law. Large rooms with very deep rear absorption (≥ 1 m) and big consoles often face the long wall successfully.'],
        ['Facing the wide way puts the back wall right behind your head — bass build-up and early reflections.', 'ok', 'Rear reflection 1–3 ms after the direct sound and a pressure maximum at the head. Needs ≥ 300 mm of absorption to tame.'],
        ['In a deep set-up the rear reflection is delayed 10–20 ms.', 'ok', 'With ≥ 1.7 m behind the seat the extra path is ≥ 3.4 m → ≥ 10 ms.'],
      ])}`, viz: 'facing' },
    { h: 'Surround and Atmos rooms: layout, delays and treatment', html: `
      <p>Stereo rooms have a dead front and a reflective or diffuse rear. In surround you sit <i>inside</i> the sound field, so every wall has a speaker near it and the rear wall must not muddle the rear channels.</p>
      <div class="table-wrap"><table><tr><th>Format</th><th>Speaker angles (from front centre)</th><th>Notes</th></tr>
        <tr><td>5.1 (ITU-R BS.775)</td><td>C 0°, L/R ±30°, Ls/Rs ±100–120°</td><td>All at ear height, equal distance</td></tr>
        <tr><td>7.1</td><td>Side surrounds ±90–110°, rear surrounds ±135–150°</td><td>Sides may be raised up to ~15°</td></tr>
        <tr><td>7.1.4 (Dolby Atmos)</td><td>Floor layer as 7.1 + four overheads in front of and behind the listener, about 45° elevation</td><td>Overheads aligned with the front L/R lines</td></tr></table></div>
      <div class="uc-grid">
        <div class="uc"><h4><span class="uc-ico">🧱</span>Rear wall</h4><dl><dt>Do</dt><dd class="fix">Mostly broadband absorption so a pan to the rear is heard from the speaker, not the wall.</dd></dl></div>
        <div class="uc"><h4><span class="uc-ico">☁️</span>Ceiling</h4><dl><dt>Do</dt><dd class="fix">Large thick clouds (≥ 150 mm), leaving the overhead speaker positions clear.</dd></dl></div>
        <div class="uc"><h4><span class="uc-ico">🎚️</span>Console & floor</h4><dl><dt>Do</dt><dd class="fix">Rug or angled console surfaces to stop overheads bouncing to the ears.</dd></dl></div>
        <div class="uc"><h4><span class="uc-ico">⏱️</span>Decay</h4><dl><dt>Aim</dt><dd class="fix">Short, even decay across bands (≈ 0.2–0.4 s in small rooms); bass not ringing longer than treble.</dd></dl></div>
      </div>
      ${verdicts([
        ['1 ms of delay ≈ 34 cm of distance.', 'ok', '343 m/s × 0.001 s = 0.343 m.'],
        ['Use the 1/4-room-length rule to place height speakers.', 'no', 'Not part of Dolby guidance. Place overheads by angle (about 45° elevation, in line with the front L/R) and avoid exact mid-room positions for subwoofers, not heights.'],
        ['Avoid placing any speaker exactly at 50 % of a room dimension.', 'nu', 'At the mid-point odd-order modes have a pressure node, so a <b>subwoofer</b> or full-range speaker there loses those modes. Mostly a bass concern.'],
      ])}`, viz: 'surroundLayout' },
  ]);
  addTo('flat', [
    { h: 'Target curves in practice (checked)', html: `
      <p>A well-designed loudspeaker that measures flat in an anechoic chamber produces a gently <b>downward-tilting</b> curve in a normal room, because it becomes more directional at high frequencies while the room keeps the bass. Listeners — including engineers — consistently prefer something close to that natural tilt over a ruler-flat in-room curve.</p>
      ${verdicts([
        ['A perfectly flat in-room response from 20 Hz to 20 kHz is ideal.', 'no', 'Flat in-room usually sounds thin and bright. Flat <i>anechoic</i> speakers plus a smooth, slightly tilted in-room curve is the goal.'],
        ['Use the Harman 2018 curve as your room target.', 'no', 'Harman 2018 is a <b>headphone</b> target. For rooms use an in-room target from loudspeaker research (a few dB of bass rise below ~100–200 Hz and a gentle treble tilt) or a B&amp;K-style slope.'],
        ['The B&amp;K curve falls about 1 dB per octave.', 'nu', 'A common simplification of a gently sloping house curve. The exact shape matters less than smoothness and symmetry.'],
        ['The bass lift compensates for our ears losing sensitivity at low levels.', 'nu', 'Part of it. Mostly it reflects how good speakers behave in rooms and what listeners prefer.'],
        ['± 3 dB is a professional target; ± 5 dB is very good at home; untreated rooms swing ± 15–20 dB.', 'ok', 'Typical figures for smoothed in-room measurements below a few hundred hertz.'],
        ['Time (decay) matters more than the frequency-response graph.', 'ok', 'A curve can look flat while a mode rings for 500 ms. Check the waterfall and RT per band.'],
      ])}
      <div class="callout mentor">EQ only below the Schroeder frequency, cut peaks rather than boosting dips, measure several positions around the seat, and keep left and right matched.</div>`, viz: 'targetCurve' },
  ]);
  addTo('m-speakers', [
    { h: 'Subwoofer placement and alignment, step by step', html: `
      ${flow([['Start position', 'front wall, between the mains, or 1/4 of the width from a side wall'], ['Avoid the middle', 'never at 50 % of length or width'], ['Subwoofer crawl', 'sub on the chair, listen near the walls, swap'], ['Align', 'polarity/phase for maximum level at the crossover'], ['Verify', 'measure: no hole at the crossover'], ['Then EQ', 'cut the remaining peaks']])}
      <p><b>Polarity trick:</b> temporarily invert the main speakers, play a tone at the crossover frequency and adjust the sub’s phase for the <i>quietest</i> result; restore the mains — the two now sum at maximum. Or simply set the phase for the <i>loudest</i> result with normal polarity.</p>
      ${verdicts([
        ['Two subwoofers, one mid-front wall and one mid-rear wall, smooth the bass over a wider area.', 'ok', 'They cancel odd-order length modes and give more even bass across seats — a well-researched layout.'],
        ['A sub in a corner excites all room modes equally.', 'nu', '<b>Maximally</b>, not equally — the response is louder but still lumpy, so corner subs need strong trapping and EQ.'],
        ['Pushing the sub against the front wall moves its boundary dip above its operating range.', 'ok', 'With d ≈ 0.1 m the c/4d dip lands near 850 Hz — far above a sub’s crossover.'],
        ['An isolation pad under the sub fixes how the bass sounds.', 'nu', 'It can stop rattles and some structure-borne transmission on light floors; it does not change room modes or the response at the seat much.'],
        ['34 cm of movement ≈ 1 ms of delay.', 'ok', 'Moving the sub or adding delay shifts its arrival; at 80 Hz a full cycle is 12.5 ms.'],
      ])}`, viz: 'subAlign' },
  ]);
  addTo('m-tracking', [
    { h: 'Live-room design by instrument (checked)', html: `
      <div class="table-wrap"><table><tr><th>Source</th><th>Room character</th><th>Practical set-up</th></tr>
        <tr><td><b>Drums</b></td><td>Live, high ceiling, hard floor</td><td>Diffusion on walls, ≥ 3 m ceiling, cloud above overheads if the ceiling is low</td></tr>
        <tr><td><b>Vocals</b></td><td>Drier, controlled</td><td>Absorption behind the singer, some reflective/diffuse surface in front so they hear themselves; gobos</td></tr>
        <tr><td><b>Guitar amps</b></td><td>Near a reflective surface for body</td><td>Cloud overhead; gobos to control spill</td></tr>
        <tr><td><b>Strings / acoustic</b></td><td>Natural, even decay</td><td>Mix of wood, diffusion and absorption; avoid parallel bare walls</td></tr></table></div>
      ${verdicts([
        ['Parallel hard walls cause flutter echo.', 'ok', 'Treat or splay one of each parallel pair.'],
        ['Covering a room in thin foam makes it sound boxy.', 'ok', 'Thin foam removes highs only, leaving low-mid build-up.'],
        ['A live room should follow a “B&amp;K slope” frequency response.', 'nu', 'House curves describe loudspeaker reproduction. For live rooms specify <b>reverberation time per band</b> and an even, slightly rising decay toward the bass that is not excessive.'],
        ['Spend more on diffusers than absorbers.', 'nu', 'A matter of taste and room size. Small rooms need enough low-frequency absorption first; diffusion helps larger rooms keep life.'],
        ['A hard floor with a soft ceiling sounds more natural than a carpeted floor with a hard ceiling.', 'nu', 'A common and sensible preference — floor reflections are expected — but it is a design choice, not a rule.'],
      ])}` },
  ]);
  addTo('m-floors', [
    { h: 'Designing a floor to a target resonance (worked example)', html: `
      <div class="formula"><span class="lbl">Resonance from static deflection</span>f<sub>n</sub> ≈ 15.8 / √d &nbsp; (d in mm) → 14 Hz needs d ≈ 1.27 mm</div>
      ${flow([['Deck mass', '3 × 18 mm ply + 12 mm fibre-cement ≈ 50 kg/m²'], ['Add live load', 'gear & people ≈ 25–50 kg/m²'], ['Total weight', 'e.g. 15 m² × 90 kg/m² = 1 350 kg'], ['Pads', '600 mm grid → ≈ 42 pads → ≈ 32 kg each'], ['Pick the pad', 'manufacturer chart: d ≈ 1.27 mm at 32 kg'], ['Check the air', 'a shallow sealed gap adds its own spring']])}
      ${verdicts([
        ['f<sub>n</sub> ≈ 15.8/√d (d in mm), so 14 Hz needs about 1.27 mm of static deflection.', 'ok', 'Correct for linear springs. With rubber/neoprene the <b>dynamic</b> stiffness is 1.2–2× the static value, so the real resonance is higher — use the manufacturer’s dynamic data.'],
        ['Fill the gap with mineral wool to stop the drum effect.', 'ok', 'It damps cavity resonances and slightly softens the air spring.'],
        ['The trapped air acts as a spring and raises the frequency.', 'ok', 'Often underestimated: 50 mm of absorber-filled air under a 90 kg/m² deck alone gives ≈ 24 Hz. Deeper gaps or more mass are needed for low targets.'],
        ['Material weights: 18 mm ply ≈ 8–12 kg/m²; 12 mm fibre-cement ≈ 18–22 kg/m²; 50 mm concrete ≈ 115–125 kg/m².', 'ok', 'Consistent with typical densities (ply ≈ 600, fibre-cement ≈ 1 500, concrete ≈ 2 300–2 400 kg/m³).'],
        ['Isolation starts above 1.4 × f<sub>n</sub>.', 'ok', 'Above √2·f<sub>n</sub> transmissibility drops below 1; below it the floor amplifies.'],
        ['The coin test (a coin on the base floor falls if the floor is bridged) verifies a floating floor.', 'no', 'Not reliable. Measure vibration on both slabs (accelerometers or a phone vibration app for a rough check), do impact tests, and inspect for screws, pipes, mortar or debris bridging the gap.'],
        ['14 Hz is nearly two octaves below a 40 Hz structural floor.', 'nu', '40/14 ≈ 2.9 → about 1.5 octaves. Still a good separation.'],
        ['A floating floor at 50 Hz on a 40 Hz structural floor can make things worse.', 'ok', 'Close resonances couple and ring together. Keep the floating resonance at or below about half the structural one.'],
      ])}
      <div class="callout safety">A floating floor can add 100–300 kg/m². On timber joists or older slabs, have a structural engineer check the load before you build.</div>`, viz: 'floatDesign' },
  ]);
})();
