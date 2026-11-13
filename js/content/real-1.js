/* "In real life" blocks — group 1. Each REAL(id, {...}) adds a worked scene, a step-through
   animated diagram and a practical wrap-up to an existing lesson (see js/real-kit.js). */
(function () {
  const REAL = window.REAL; if (!REAL) return;

  /* small drawing helpers */
  const person = (x, y, c) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/><rect x="${x - 10}" y="${y + 13}" width="20" height="38" rx="7" fill="${c}"/>`;
  const pts = (x0, y0, len, fn, n = 60) => Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${(x0 + len * i / n).toFixed(1)} ${(y0 - fn(i / n)).toFixed(1)}`).join(' ');
  const wave = (x0, y0, len, amp, cyc, ph = 0) => pts(x0, y0, len, (u) => amp * Math.sin(2 * Math.PI * cyc * u + ph));
  const modeD = (x0, y0, len, amp, n) => pts(x0, y0, len, (u) => amp * Math.sin(n * Math.PI * u));
  const vib = (x0, y0, len, amp, n, col, dur = 0.9, w = 3) => `<path fill="none" stroke="${col}" stroke-width="${w}" d="${modeD(x0, y0, len, amp, n)}"><animate attributeName="d" dur="${dur}s" repeatCount="indefinite" values="${modeD(x0, y0, len, amp, n)};${modeD(x0, y0, len, -amp, n)};${modeD(x0, y0, len, amp, n)}"/></path>`;
  const cosD = (x0, y0, len, amp, n) => pts(x0, y0, len, (u) => amp * Math.cos(n * Math.PI * u));
  const vibCos = (x0, y0, len, amp, n, col, dur = 1) => `<path fill="none" stroke="${col}" stroke-width="3" d="${cosD(x0, y0, len, amp, n)}"><animate attributeName="d" dur="${dur}s" repeatCount="indefinite" values="${cosD(x0, y0, len, amp, n)};${cosD(x0, y0, len, -amp, n)};${cosD(x0, y0, len, amp, n)}"/></path>`;
  const T = (x, y, s, extra = '') => `<text x="${x}" y="${y}" text-anchor="middle" font-size="13" ${extra}>${s}</text>`;
  const rings = (cx, cy, col, n = 3, r = 22) => Array.from({ length: n }, (_, i) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="2.5" class="rl-grow ${['', 'd2', 'd3', 'd4'][i]}"/>`).join('');

  REAL('sound', {
    title: 'the clap in the stairwell',
    plain: 'Sound is air being pushed and pulled very quickly. Nothing travels from the source to you except the push itself, handed from one bit of air to the next at about 343 metres every second.',
    where: 'A concrete stairwell in an apartment block',
    story: `<p>Asha claps once at the bottom of a stairwell. Her friend on the third floor, 20 m away, hears the clap a moment later, followed by a long ringing tail. Neither of them felt any wind. What actually moved?</p>
      <p>Her hands squeezed a thin layer of air. That squeezed layer pushed the next one and sprang back, and the push ran up the stairwell like a nudge passing down a queue. The hard walls kept bouncing it back, which is the ringing.</p>`,
    numbers: [['Distance', '20 m'], ['Speed of sound at 20 °C', '343 m/s'], ['Time to arrive', '20 ÷ 343 ≈ 58 ms'], ['Air movement at a loud clap', 'well under 1 mm']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A clap sends a pressure pulse through air to a listener">
      <line x1="30" y1="210" x2="610" y2="210" stroke="var(--line)" stroke-width="2"/>
      ${person(70, 150, 'var(--c1)')}${T(70, 236, 'claps here')}
      ${person(570, 150, 'var(--c2)')}${T(552, 236, 'hears it 58 ms later')}
      <g fill="var(--muted)">${Array.from({ length: 22 }, (_, i) => `<circle cx="${120 + i * 19}" cy="150" r="3.2"/>`).join('')}</g>
      <g data-step="=1">${T(320, 70, 'Still air: molecules evenly spaced')}</g>
      <g data-step="2"><g class="rl-pulse"><rect x="104" y="120" width="34" height="60" rx="6" fill="var(--accent)" opacity=".35"/></g></g>
      <g data-step="=2">${T(121, 108, 'squeeze', 'fill="var(--accent)"')}</g>
      <g data-step="3"><path d="M150 150 H540" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=3">${T(345, 100, 'the squeeze is passed along at 343 m/s')}</g>
      <g data-step="4"><circle cx="570" cy="150" r="26" fill="none" stroke="var(--c2)" stroke-width="3" class="rl-grow"/></g>
      <g data-step="=4">${T(345, 100, 'each molecule only wobbles and returns', 'fill="var(--c2)"')}</g>
      <g data-step="5"><path d="M540 130 Q330 20 130 130" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow rev slow"/>
        ${T(335, 40, 'hard walls send it back: the ringing tail', 'fill="var(--c3)"')}</g>
    </svg>`,
    steps: [
      ['Before the clap', 'The air is at rest. Its molecules are spread evenly, at normal atmospheric pressure.'],
      ['The hands squeeze the air', 'A thin layer next to the hands is compressed: pressure there rises a tiny amount above normal.'],
      ['The squeeze is handed on', 'That layer pushes its neighbour and relaxes. The push travels outward at about 343 m/s; the air itself stays put.'],
      ['It reaches the ear', 'After 58 ms the pressure change moves the eardrum. Each molecule on the way only wobbled back and forth.'],
      ['The room answers', 'Concrete walls reflect almost all of it, so the pulse keeps arriving again and again: reverberation.'],
    ],
    why: [
      'Air is springy: squeeze it and it pushes back. That springiness plus the weight of the air sets the speed, which is why speed depends on temperature and not on loudness.',
      'Only energy travels. If the air itself travelled, a kick drum would blow papers off the desk.',
      'A hard, heavy wall barely moves when the push arrives, so the push bounces off. A soft, porous surface lets the air rub through it and turns the motion into a little heat.',
    ],
    uses: [
      ['⏱️', 'Timing a delay', 'A speaker 34 m from the stage is heard 0.1 s late. Delay the nearer speakers by distance ÷ 343 so everything arrives together.'],
      ['🎤', 'Finding an echo', 'Clap and listen: if you hear a distinct repeat, the surface causing it is more than about 8.5 m away there and back.'],
      ['🏠', 'Judging a room', 'A long tail after a clap tells you the surfaces are hard and reflective before you measure anything.'],
    ],
    tryit: [
      'Stand 17 m from a large wall outdoors and clap. You should hear the echo about a tenth of a second later (34 m round trip ÷ 343).',
      'Clap in your bathroom, then in a room with a sofa and curtains. Count how long each tail lasts.',
      'Hold a tissue in front of a speaker playing bass: it quivers in place and does not blow away.',
    ],
    slip: ['Thinking louder sound travels faster.', 'Speed depends on the air (mainly temperature). Loudness only changes how big the pressure swing is.'],
  });

  REAL('harmonics', {
    title: 'one guitar string, many notes at once',
    plain: 'A single note is really a stack of notes. The lowest one gives the pitch you name; the fainter, higher ones stacked on top give the instrument its character.',
    where: 'A music classroom in Chennai',
    story: `<p>Lakshmi plucks the open A string of a classroom guitar. Her students all agree it is “an A”. Then she lightly touches the string exactly at its middle and plucks again: a clear note one octave higher rings out. She touches it one third of the way along and a still higher note appears.</p>
      <p>Those higher notes were inside the first pluck all the time. Touching the string only silenced the lower ones, so the class could hear what was hiding underneath.</p>`,
    numbers: [['String length', '0.65 m'], ['Lowest note (fundamental)', '110 Hz'], ['Touch at ½ → 2nd harmonic', '2 × 110 = 220 Hz'], ['Touch at ⅓ → 3rd harmonic', '3 × 110 = 330 Hz'], ['Wave speed on the string', '2 × 0.65 × 110 = 143 m/s']],
    svg: `<svg viewBox="0 0 640 280" aria-label="A string vibrating in one, two and three loops at the same time">
      <rect x="40" y="40" width="10" height="180" rx="3" fill="var(--muted)"/><rect x="430" y="40" width="10" height="180" rx="3" fill="var(--muted)"/>
      <line x1="50" y1="70" x2="430" y2="70" stroke="var(--line)" stroke-width="1"/>
      <line x1="50" y1="130" x2="430" y2="130" stroke="var(--line)" stroke-width="1"/>
      <line x1="50" y1="190" x2="430" y2="190" stroke="var(--line)" stroke-width="1"/>
      <g data-step="=1">${T(240, 30, 'a string fixed at both ends')}</g>
      <g data-step="2">${vib(50, 70, 380, 22, 1, 'var(--c1)', 1.2)}<text x="455" y="75" font-size="13">110 Hz: the pitch</text></g>
      <g data-step="3">${vib(50, 130, 380, 16, 2, 'var(--c2)', 0.6)}<circle cx="240" cy="130" r="5" fill="var(--text)"/><text x="455" y="135" font-size="13">220 Hz: 2 loops</text></g>
      <g data-step="4">${vib(50, 190, 380, 12, 3, 'var(--c3)', 0.4)}<circle cx="176.7" cy="190" r="5" fill="var(--text)"/><circle cx="303.3" cy="190" r="5" fill="var(--text)"/><text x="455" y="195" font-size="13">330 Hz: 3 loops</text></g>
      <g data-step="=3">${T(240, 258, 'the dot stays still: touch there')}</g>
      <g data-step="5"><rect x="470" y="212" width="20" height="50" fill="var(--c1)" class="rl-pulse"/><rect x="510" y="232" width="20" height="30" fill="var(--c2)" class="rl-pulse d2"/><rect x="550" y="244" width="20" height="18" fill="var(--c3)" class="rl-pulse d3"/>
        ${T(240, 258, 'all three happen together; their mix is the tone')}</g>
    </svg>`,
    steps: [
      ['A string held at both ends', 'The ends cannot move, so only shapes that fit exactly between them can last.'],
      ['One loop: the fundamental', 'The whole string swings as one loop, 110 times a second. This is the note you name.'],
      ['Two loops: the 2nd harmonic', 'The string also swings in two halves at twice the speed. The middle point stays still.'],
      ['Three loops: the 3rd harmonic', 'And in three parts at three times the speed, with two still points.'],
      ['The mix is the timbre', 'All of these sound at once. How strong each one is makes a guitar sound different from a flute on the same note.'],
    ],
    why: [
      'Only whole numbers of loops fit between two fixed ends, so the extra notes land at exactly 2, 3, 4… times the lowest one.',
      'Plucking near the bridge feeds the short loops more, so the tone gets brighter. Plucking near the middle feeds the big loop, so it gets rounder.',
      'A room between two walls behaves the same way with air instead of string, which is why rooms have favourite bass notes.',
    ],
    uses: [
      ['🎚️', 'Cleaning a muddy mix', 'A bass at 110 Hz also has energy at 220 and 330 Hz. Cutting 2–3 dB around 220–330 Hz can clear space for a voice without losing the bass note.'],
      ['📱', 'Bass on small speakers', 'A phone cannot play 55 Hz, but it plays 110 and 165 Hz and your brain fills in the missing low note.'],
      ['🏠', 'Finding a room boom', 'If a room booms at 43 Hz, expect weaker trouble near 86 and 129 Hz along the same direction.'],
    ],
    tryit: [
      'On any guitar or tanpura, touch a string lightly at the halfway point and pluck: you hear the octave.',
      'Hum a steady low note and slowly change your mouth from “oo” to “ee”. The pitch stays; the harmonics change.',
      'Play a low note on a phone speaker and on headphones. Notice you still know which note it is on the phone.',
    ],
    slip: ['Boosting the fundamental to make an instrument “clearer”.', 'Clarity lives in the harmonics, usually 2 to 5 times the note. Look there first.'],
  });

  REAL('vibration-instruments', {
    title: 'the snare that buzzes when the bass plays',
    plain: 'Everything that can vibrate has a favourite speed. Push it at that speed, even gently, and it swings widely. Push at any other speed and it barely moves.',
    where: 'A rehearsal room above a shop',
    story: `<p>Meera’s band notices that the snare drum hisses every time the bass player holds one particular note, even though nobody touches the drum. On other notes it stays silent.</p>
      <p>The snare head and wires happen to be tuned so that they like to vibrate at about 190 Hz. The bass note G is 196 Hz, close enough to keep nudging the head in time with its own swing. Tightening the head a little moves its favourite speed away, and a small felt pad soaks up what is left.</p>`,
    numbers: [['Snare head’s favourite frequency', '≈ 190 Hz'], ['Bass note that sets it off (G)', '196 Hz'], ['Mismatch', '(196 − 190) ÷ 190 ≈ 3 %'], ['Neighbouring note F♯', '185 Hz — also close, buzzes a little'], ['Note E', '165 Hz — 13 % away, silent']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A bass amplifier sets a snare drum vibrating in sympathy">
      <line x1="20" y1="222" x2="620" y2="222" stroke="var(--line)" stroke-width="2"/>
      <rect x="50" y="110" width="100" height="112" rx="8" fill="var(--panel)" stroke="var(--muted)" stroke-width="2"/><circle cx="100" cy="166" r="34" fill="none" stroke="var(--muted)" stroke-width="3"/>
      ${T(100, 246, 'bass amp')}
      <ellipse cx="500" cy="150" rx="70" ry="12" fill="var(--panel)" stroke="var(--muted)" stroke-width="2"/><rect x="430" y="150" width="140" height="40" fill="var(--panel)" stroke="var(--muted)" stroke-width="2"/>
      <line x1="470" y1="190" x2="450" y2="222" stroke="var(--muted)" stroke-width="3"/><line x1="530" y1="190" x2="550" y2="222" stroke="var(--muted)" stroke-width="3"/>
      ${T(500, 246, 'snare drum')}
      <g data-step="=1">${T(300, 60, 'the drum has a favourite speed: 190 Hz')}</g>
      <g data-step="=2"><path d="${wave(160, 150, 250, 14, 3)}" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-flow"/></g>
      <g data-step="=2">${T(290, 110, 'note E, 165 Hz: wrong rhythm', 'fill="var(--c2)"')}${T(500, 120, 'still')}</g>
      <g data-step="3-5"><path d="${wave(160, 150, 250, 14, 4)}" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-flow"/></g>
      <g data-step="3-4"><g class="rl-shake"><ellipse cx="500" cy="150" rx="70" ry="12" fill="none" stroke="var(--accent)" stroke-width="3"/></g>${rings(500, 150, 'var(--accent)', 2, 40)}</g>
      <g data-step="=3">${T(290, 110, 'note G, 196 Hz: right rhythm', 'fill="var(--accent)"')}${T(500, 110, 'buzz!', 'fill="var(--accent)"')}</g>
      <g data-step="=4">${T(320, 60, 'each push arrives in time with the swing')}</g>
      <g data-step="5"><rect x="478" y="134" width="44" height="10" rx="4" fill="var(--good)"/>${T(500, 118, 'felt pad + retune', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['The drum has a favourite speed', 'Its tension and weight set a natural frequency, here about 190 times a second.'],
      ['A push at the wrong rhythm', 'A bass note at 165 Hz pushes sometimes with the head and sometimes against it. The pushes cancel and the head hardly moves.'],
      ['A push at the right rhythm', 'At 196 Hz almost every push arrives as the head is already moving that way.'],
      ['The swing builds up', 'Small pushes add, cycle after cycle, until the head moves enough to rattle the wires. That is resonance.'],
      ['Two cures', 'Move the favourite speed (retune) or steal the energy (damping). Either one stops the build-up.'],
    ],
    why: [
      'It is the playground swing: tiny pushes in time with the swing send it high; the same pushes at random times do nothing.',
      'Low damping means a sharp, strong resonance at one note. More damping means a weaker response spread over more notes.',
      'Every instrument body, wall panel, window and loudspeaker cone obeys the same rule, which is why one idea explains so many rattles.',
    ],
    uses: [
      ['🪟', 'A rattling window', 'If glass buzzes on one bass note, press it with a finger. If the buzz stops, add a strip of soft sealant: that is damping.'],
      ['🎸', 'Guitar dead spots and wolf notes', 'One fretted note that dies quickly or howls means the neck or body resonates there. A small added mass shifts it.'],
      ['🧱', 'Bass traps that use resonance', 'A panel absorber is a resonance on purpose: tune a panel and air gap to the boomy note and let its damping eat the energy.'],
    ],
    tryit: [
      'Play a slow bass sweep (a sine sweep app, quiet level) in your room and write down every object that rattles and at which frequency.',
      'Hold a ruler over a table edge and flick it. Shorten the overhang: the favourite speed rises.',
      'Sing a steady note into a guitar’s sound hole and stop suddenly. The strings tuned to that note keep ringing.',
    ],
    slip: ['Turning the bass down to stop one rattle.', 'Find the object, then damp it or shift its tuning. The music was not the fault.'],
  });

  REAL('decibels', {
    title: 'two generators are not twice as loud',
    plain: 'Decibels count in multiplications, not additions. Doubling the number of equal sources adds only 3 dB, and it takes about ten of them to sound twice as loud.',
    where: 'The service yard of a wedding hall',
    story: `<p>Imran manages a wedding hall. One diesel generator measures 80 dB at the neighbour’s gate, 5 m away. For a big event he must run a second identical generator, and the neighbour fears it will be “160 dB”.</p>
      <p>Imran measures again with both running: 83 dB. Noticeably louder, but nowhere near double. He then moves both sets to the far corner, 10 m from the gate, and the reading drops to 77 dB, quieter than one generator was before.</p>`,
    numbers: [['One generator at 5 m', '80 dB'], ['Two generators', '80 + 3 = 83 dB'], ['Ten generators', '80 + 10 = 90 dB (sounds about twice as loud)'], ['Two generators moved to 10 m', '83 − 6 = 77 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Sound level from one, two and ten generators, and after doubling the distance">
      <line x1="20" y1="212" x2="620" y2="212" stroke="var(--line)" stroke-width="2"/>
      ${person(560, 148, 'var(--c2)')}${T(560, 236, 'neighbour’s gate')}
      <rect x="486" y="40" width="130" height="46" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <g data-step="=1"><text x="551" y="70" text-anchor="middle" font-size="20" font-weight="700">80 dB</text></g>
      <g data-step="=2"><text x="551" y="70" text-anchor="middle" font-size="20" font-weight="700">83 dB</text></g>
      <g data-step="=3"><text x="551" y="70" text-anchor="middle" font-size="20" font-weight="700">90 dB</text></g>
      <g data-step="=4"><text x="551" y="70" text-anchor="middle" font-size="20" font-weight="700">77 dB</text></g>
      <g data-step="1-3"><rect x="298" y="172" width="54" height="40" rx="5" fill="var(--c1)"/>${rings(327, 190, 'var(--c1)', 2, 30)}</g>
      <g data-step="2-3"><rect x="236" y="172" width="54" height="40" rx="5" fill="var(--c1)"/></g>
      <g data-step="=3">${Array.from({ length: 8 }, (_, i) => `<rect x="${112 + (i % 4) * 62}" y="${128 - Math.floor(i / 4) * 44}" width="54" height="40" rx="5" fill="var(--c1)"/>`).join('')}</g>
      <g data-step="=4"><rect x="60" y="172" width="54" height="40" rx="5" fill="var(--c1)"/><rect x="124" y="172" width="54" height="40" rx="5" fill="var(--c1)"/>${rings(120, 190, 'var(--c1)', 2, 30)}
        <path d="M190 190 H530" stroke="var(--c1)" stroke-width="2.5" fill="none" class="rl-flow"/>${T(350, 176, '10 m')}</g>
      <g data-step="=1">${T(330, 150, 'one set, 5 m away')}</g>
      <g data-step="=2">${T(300, 150, 'two sets: +3 dB, not +80')}</g>
      <g data-step="=3">${T(232, 66, 'ten sets: +10 dB = “twice as loud”')}</g>
      <g data-step="=4">${T(330, 120, 'double the distance: −6 dB')}</g>
    </svg>`,
    steps: [
      ['One generator', 'It gives 80 dB at the gate. This is the starting point.'],
      ['Add an identical one', 'The sound energy doubles. On the decibel scale, doubling energy is +3 dB, so the meter reads 83.'],
      ['How many for “twice as loud”?', 'Ears need about +10 dB to call something twice as loud. That takes ten times the energy: ten generators.'],
      ['Distance is the cheap fix', 'Each doubling of distance from a small source outdoors removes 6 dB. Moving from 5 m to 10 m beats switching one generator off.'],
    ],
    why: [
      'Hearing works by ratios: the step from 1 to 2 feels the same as the step from 10 to 20. A scale built on ratios matches what we hear.',
      'The loudest sound we can bear carries about a million million times the power of the quietest. Decibels squeeze that into 0–120.',
      'Because the scale is a ratio, you never add two dB values directly. You add the energies, and equal energies always give +3.',
    ],
    uses: [
      ['🔊', 'Buying a bigger amplifier', 'Doubling amplifier power (100 W → 200 W) buys only 3 dB. For “twice as loud” you would need 1000 W, or a more sensitive speaker.'],
      ['🧱', 'Reading a wall rating', 'A wall that takes 50 dB off lets through one hundred-thousandth of the energy. A 3 mm gap can undo most of that.'],
      ['📏', 'Planning speaker distance', '94 dB at 2 m becomes 88 dB at 4 m and 82 dB at 8 m. Count doublings, subtract 6 each time.'],
    ],
    tryit: [
      'Install a free sound level meter app. Play pink noise from one speaker and note the reading at your seat.',
      'Turn on a second identical speaker at the same level. The reading rises about 3 dB, not double.',
      'Outdoors, measure a small speaker at 1 m and then at 2 m. Expect a drop close to 6 dB.',
    ],
    slip: ['Adding decibels like ordinary numbers (80 + 80 = 160).', 'Equal sources add 3 dB per doubling. Unequal ones: if one is 10 dB louder, the quieter one adds almost nothing.'],
  });

  REAL('hearing', {
    title: 'the mix that lost its bass at night',
    plain: 'Your ears turn the bass down when the volume is low. The same recording sounds full when loud and thin when quiet, even though nothing in it changed.',
    where: 'A bedroom studio, late evening',
    story: `<p>Priya finishes a mix in the afternoon with her speakers fairly loud. It sounds rich and balanced. At 11 pm she plays it quietly so as not to wake the house, and the bass guitar and kick have almost vanished, while the voice still sounds fine.</p>
      <p>She had done nothing wrong. At low levels the ear is far less sensitive to low notes than to the mid-range where speech lives. Had she raised the bass to fix the quiet version, the loud version would have boomed. She now checks every mix at one fixed moderate level, with a mark on the volume knob.</p>`,
    numbers: [['Afternoon listening level', '≈ 80 dB'], ['Night listening level', '≈ 50 dB'], ['Extra level a 50 Hz tone needs to match 1 kHz, quiet', 'roughly 35–40 dB more'], ['Same gap when playing loud', 'roughly 20–25 dB more'], ['Ear’s most sensitive region', '2–5 kHz']],
    svg: `<svg viewBox="0 0 640 270" aria-label="At low volume the ear hears much less bass than at high volume">
      <line x1="60" y1="220" x2="600" y2="220" stroke="var(--muted)" stroke-width="1.5"/><line x1="60" y1="30" x2="60" y2="220" stroke="var(--muted)" stroke-width="1.5"/>
      ${T(110, 242, 'bass')}${T(330, 242, 'voice range')}${T(550, 242, 'treble')}
      <text x="8" y="24" font-size="12">↑ level needed</text>
      <g data-step="=1">${T(330, 52, 'how strong must a tone be to sound equally loud?')}</g>
      <g data-step="2"><path d="M70 60 C150 150 250 196 330 198 S 460 206 500 190 S 570 150 595 130" fill="none" stroke="var(--c2)" stroke-width="3"/>
        <text x="360" y="186" font-size="13" fill="var(--c2)">quiet listening</text></g>
      <g data-step="3"><path d="M70 62 V178" stroke="var(--c2)" stroke-width="2" class="rl-flow"/><circle cx="330" cy="198" r="6" fill="var(--c2)" class="rl-pulse"/></g>
      <g data-step="=3">${T(250, 100, 'bass needs ~40 dB more')}</g>
      <g data-step="4"><path d="M70 40 C150 80 250 104 330 106 S 460 112 500 100 S 570 74 595 62" fill="none" stroke="var(--accent)" stroke-width="3"/>
        <text x="470" y="60" font-size="13" fill="var(--accent)">loud listening</text></g>
      <g data-step="=4">${T(300, 84, 'played loud, the curve is flatter')}</g>
      <g data-step="5"><line x1="60" y1="150" x2="600" y2="150" stroke="var(--good)" stroke-width="2" stroke-dasharray="6 6"/>
        ${T(330, 142, 'pick one moderate level, always mix there', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['The question', 'How strong must a tone be, at each pitch, to sound as loud as a mid-range tone?'],
      ['At a quiet level', 'The curve dips in the voice range, where the ear is sharpest, and climbs steeply towards the bass.'],
      ['The bass penalty', 'A very low note needs far more level than a mid note before it sounds equally loud, so quiet music sounds thin.'],
      ['At a loud level', 'The curve flattens. Bass and treble catch up, so the same music sounds fuller and more exciting.'],
      ['What to do', 'Judge balance at one repeatable, moderate level. Then check briefly quiet and loud, without changing the mix for either.'],
    ],
    why: [
      'The ear canal and the tiny bones behind the eardrum favour the 2–5 kHz range, the band that carries consonants in speech.',
      'Low sounds must move the whole hearing system further before the nerve cells respond, so they need a head start.',
      'Louder nearly always sounds “better” at first, because more bass and treble become audible. That is why level matching matters in any comparison.',
    ],
    uses: [
      ['🎚️', 'A fixed monitoring level', 'Set pink noise to about 75–79 dB (slow, C-weighted) at your seat in a small room, mark the knob, and mix there.'],
      ['🛒', 'Comparing two speakers or plugins', 'Match their loudness within a fraction of a dB first. Otherwise the louder one wins for the wrong reason.'],
      ['🏠', 'Late-night listening', 'A “loudness” or night setting lifts bass and treble at low volume on purpose. Use it for listening, never for mixing.'],
    ],
    tryit: [
      'Play a song you know well at a normal level. Turn it down a lot. Notice which instruments fade first.',
      'With a tone generator app at a quiet, fixed volume, play 1 kHz and then 60 Hz. The 60 Hz tone may be almost inaudible.',
      'Mark the volume position you used for your last good mix, and start the next session there.',
    ],
    slip: ['Adding bass because the mix sounds thin when played quietly.', 'Check it at your reference level. If it is right there, leave it alone.'],
  });

  REAL('psy-reflections', {
    title: 'the desk pushed against the side wall',
    plain: 'Your brain decides where a sound is from the first copy that arrives. Copies bouncing off nearby walls a few thousandths of a second later are not heard as echoes; they quietly change the tone and pull the image sideways.',
    where: 'A spare-room studio with the desk in a corner',
    story: `<p>Arjun’s desk sits with its left edge near a painted wall. Singers in his mixes always seem to lean left, and the left speaker sounds slightly “boxy”, although both speakers measure the same when tested alone outdoors.</p>
      <p>The left speaker’s sound reaches him twice: straight, and off the wall about two thousandths of a second later. That is far too soon to hear as an echo, but the two copies partly cancel at some pitches, and the extra energy on the left drags the centre image over. One 10 cm thick panel on the wall, at the spot where he can see the speaker in a mirror, puts the voice back in the middle.</p>`,
    numbers: [['Speaker to ear, direct', '1.20 m'], ['Speaker to wall to ear', '≈ 1.92 m'], ['Extra path', '1.92 − 1.20 = 0.72 m'], ['Delay', '0.72 ÷ 343 ≈ 2.1 ms'], ['First cancelled frequency', '343 ÷ (2 × 0.72) ≈ 240 Hz']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Plan view: direct sound and a side-wall reflection reaching a listener">
      <rect x="40" y="34" width="560" height="12" fill="var(--muted)"/>${T(560, 26, 'side wall')}
      <rect x="110" y="170" width="40" height="52" rx="5" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>${T(130, 244, 'left speaker')}
      <circle cx="500" cy="196" r="18" fill="var(--c2)"/>${T(500, 244, 'listener')}
      <g data-step="1"><path d="M150 196 H482" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${T(316, 186, 'direct sound: 1.20 m', 'fill="var(--accent)"')}</g>
      <g data-step="2-4"><path d="M150 190 L316 46 L484 188" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2">${T(316, 140, 'bounce: 1.92 m, 2.1 ms late', 'fill="var(--c3)"')}</g>
      <g data-step="=3">${T(316, 140, 'too early to be an echo')}<circle cx="500" cy="196" r="26" fill="none" stroke="var(--c3)" stroke-width="2.5" class="rl-pulse"/></g>
      <g data-step="=4"><path d="M500 150 H440" stroke="var(--bad)" stroke-width="3" marker-end="none"/><path d="M440 150 l12 -7 v14 z" fill="var(--bad)"/>${T(420, 136, 'image pulled towards the wall', 'fill="var(--bad)"')}</g>
      <g data-step="5"><rect x="266" y="46" width="100" height="18" rx="3" fill="var(--good)"/><path d="M150 190 L310 66" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/>
        ${T(480, 84, 'absorber at the mirror point', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['The direct sound', 'The shortest path arrives first. The brain uses it to decide where the sound is.'],
      ['The side-wall bounce', 'A second copy travels 0.72 m further and arrives 2.1 ms later, almost as strong.'],
      ['No echo is heard', 'Copies inside the first few hundredths of a second are fused with the direct sound, so you hear one event.'],
      ['But the sound changes', 'The pair cancels near 240 Hz and its odd multiples, and the extra energy tilts the stereo image towards the wall.'],
      ['Treat the mirror point', 'A thick absorber where the bounce lands weakens the copy. The same panel on the other side keeps the room even.'],
    ],
    why: [
      'In nature the first arrival is always the true direction, so hearing learnt to trust it and fold later copies into it.',
      'A copy delayed by a few milliseconds is in step at some pitches and exactly out of step at others, which carves dips into the tone.',
      'Later, weaker reflections from the sides arrive differently at each ear, and that is what makes a room feel spacious instead of boxy.',
    ],
    uses: [
      ['🪞', 'The mirror trick', 'Sit at the mix seat while a friend slides a mirror along the wall. Wherever you see a speaker, that is where a panel goes.'],
      ['🎤', 'Recording a voice', 'A singer 30 cm from a bare window adds a bounce under 2 ms late. Step 1 m into the room or hang a duvet behind the mic.'],
      ['🎬', 'Home cinema dialogue', 'Strong reflections from a glass table blur speech. A rug or cloth over it between screen and sofa is often enough.'],
    ],
    tryit: [
      'Play a mono voice recording through both speakers. Does it sit exactly between them? Note which way it leans.',
      'Hold a thick folded duvet against the nearer side wall at ear height and listen again.',
      'Measure your direct and bounced paths with a tape and work out the delay: extra metres ÷ 343.',
    ],
    slip: ['Treating the wall with a thin 2 cm foam tile.', 'Thin foam only removes treble from the bounce. Use at least 10 cm of dense absorber so it works down into the voice range.'],
  });

  REAL('psy-speakers', {
    title: 'two speakers behind a curtain',
    plain: 'When people cannot see what they are hearing, they nearly all prefer the same thing: a speaker whose response is flat and smooth, both straight ahead and off to the sides.',
    where: 'A hi-fi shop, then a friend’s living room',
    story: `<p>In the shop, Kavya prefers a large, expensive speaker over a plain smaller one. The salesman played the big one a touch louder. She borrows both for the weekend, hides them behind a thin bed-sheet, matches their volume with a meter app, and has her brother switch between them without telling her which is which.</p>
      <p>Over twenty rounds she picks the plain one fourteen times. Its published measurements explain why: an even, gently falling curve wherever you measure it, while the big one has a bump in the upper bass and a ragged response to the sides.</p>`,
    numbers: [['Level difference in the shop', '≈ 1 dB (enough to bias a choice)'], ['Level match for a fair test', 'within about 0.2 dB'], ['Blind rounds', '20'], ['Times the plain speaker was chosen', '14 of 20 = 70 %']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Two loudspeakers hidden behind a curtain and their response curves">
      <rect x="50" y="110" width="70" height="110" rx="6" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><circle cx="85" cy="180" r="22" fill="none" stroke="var(--muted)" stroke-width="3"/><circle cx="85" cy="135" r="9" fill="none" stroke="var(--muted)" stroke-width="3"/>
      <rect x="160" y="70" width="90" height="150" rx="6" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><circle cx="205" cy="175" r="30" fill="none" stroke="var(--muted)" stroke-width="3"/><circle cx="205" cy="105" r="12" fill="none" stroke="var(--muted)" stroke-width="3"/>
      ${T(85, 244, 'plain')}${T(205, 244, 'big and costly')}
      <line x1="330" y1="220" x2="610" y2="220" stroke="var(--muted)" stroke-width="1.5"/><line x1="330" y1="60" x2="330" y2="220" stroke="var(--muted)" stroke-width="1.5"/>
      ${T(350, 240, 'bass')}${T(590, 240, 'treble')}
      <g data-step="=1">${T(150, 40, 'seen: size and price decide')}</g>
      <g data-step="2"><rect x="30" y="52" width="250" height="176" fill="var(--panel2)" stroke="var(--line)" stroke-width="2" opacity=".93"/>
        ${[70, 110, 150, 190, 230].map((x) => `<path d="M${x} 52 q8 88 0 176" stroke="var(--line)" stroke-width="2" fill="none"/>`).join('')}</g>
      <g data-step="=2">${T(155, 40, 'hidden: only the sound is left')}</g>
      <g data-step="=3">${T(155, 40, 'matched in level, switched at random')}<path d="M120 140 h40" stroke="var(--accent)" stroke-width="3" class="rl-pulse"/></g>
      <g data-step="4"><path d="M335 110 C400 108 470 116 540 122 S 600 130 608 132" fill="none" stroke="var(--good)" stroke-width="3"/>
        <path d="M335 128 C400 128 470 138 540 148 S 600 160 608 162" fill="none" stroke="var(--good)" stroke-width="2" stroke-dasharray="5 5" class="rl-flow slow"/>
        <text x="470" y="100" font-size="13" fill="var(--good)">plain: smooth</text></g>
      <g data-step="5"><path d="M335 150 C360 120 390 118 410 160 S 450 190 480 160 S 520 150 560 180 S 600 170 608 190" fill="none" stroke="var(--bad)" stroke-width="3"/>
        <text x="455" y="208" font-size="13" fill="var(--bad)">big: bumps and dips</text></g>
      <g data-step="=5">${T(155, 40, 'listeners pick the smooth one')}</g>
    </svg>`,
    steps: [
      ['Sighted listening', 'Size, price, looks and what you were told all shape what you believe you hear.'],
      ['Hide the speakers', 'A thin sheet that lets sound through removes everything except the sound.'],
      ['Match and randomise', 'Equal loudness and an unknown order remove the two biggest unfair advantages.'],
      ['The smooth speaker', 'Its response is even straight ahead (solid line) and to the sides (dashed line), so the room’s reflections sound like the direct sound.'],
      ['The bumpy speaker', 'A bass bump can impress for a minute, but bumps and uneven side response colour every recording, and listeners mark it down.'],
    ],
    why: [
      'In a room you hear the speaker’s output in all directions, because the walls return it. If the sideways sound is uneven, the room hands back the unevenness.',
      'A narrow bump is a resonance: it rings on after the music stops, which the ear notices more than a narrow dip.',
      'Louder sounds fuller, so a 1 dB advantage is easily mistaken for better quality.',
    ],
    uses: [
      ['🛒', 'Choosing monitors', 'Ask for measurements at several angles. Prefer smooth, similar curves over any single impressive number.'],
      ['🎚️', 'Using equaliser on a speaker', 'A broad, gentle correction to a smooth speaker works. Equaliser cannot repair a speaker whose side response is ragged.'],
      ['🏠', 'Below about 300 Hz', 'In a normal room the room decides the bass. Fix that with placement, seat position and bass traps before blaming the speaker.'],
    ],
    tryit: [
      'Compare two headphones or speakers with a friend switching, eyes closed, levels matched by a meter app.',
      'Walk slowly around one speaker playing pink noise. If the tone changes sharply as you move sideways, its side response is uneven.',
      'Look up the published angle measurements for a speaker you own and find where the curves stop being parallel.',
    ],
    slip: ['Judging speakers in a shop, by eye and at different volumes.', 'Match levels, hide the labels, and use recordings you know. Then read the measurements.'],
  });

  REAL('psy-truth', {
    title: 'the “night and day” upgrade, tested',
    plain: 'If two pieces of audio gear truly sound different, you can pick them apart without knowing which is playing. If you cannot, the difference was in the expectation, not in the sound.',
    where: 'A project studio comparing two digital converters',
    story: `<p>Dev is sure his new converter sounds “more open” than the old one. Before selling the old unit he records the same mix through both, lines the two files up, flips one upside down and adds them together. Whatever is left is the true difference between them.</p>
      <p>What is left sits 70 dB below the music: a faint hiss he can only hear with the volume turned far up. He then tries a blind comparison of the two files sixteen times and gets nine right, which is what coin-tossing gives. He keeps the old converter and spends the money on two bass traps.</p>`,
    numbers: [['Difference left after subtraction', '70 dB below the music'], ['As a fraction of the signal', '≈ 0.03 %'], ['Blind trials', '16'], ['Correct answers', '9 (pure guessing averages 8)'], ['Needed to be convincing', '12 or more of 16']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Null test: one recording is inverted and added to another, leaving almost nothing">
      <text x="24" y="58" font-size="13">A</text><text x="24" y="138" font-size="13">B</text><text x="16" y="226" font-size="13">A+B</text>
      <path d="${pts(60, 55, 520, (u) => 22 * Math.sin(12 * u) + 10 * Math.sin(31 * u))}" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
      <g data-step="1-2"><path d="${pts(60, 135, 520, (u) => 22 * Math.sin(12 * u) + 10 * Math.sin(31 * u))}" fill="none" stroke="var(--c2)" stroke-width="2.5"/></g>
      <g data-step="=1">${T(330, 100, 'the same music through two devices')}</g>
      <g data-step="=2">${T(330, 100, 'line them up to the exact sample')}<path d="M60 20 V250" stroke="var(--accent)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="3"><path d="${pts(60, 135, 520, (u) => -22 * Math.sin(12 * u) - 10 * Math.sin(31 * u))}" fill="none" stroke="var(--c2)" stroke-width="2.5"/></g>
      <g data-step="=3">${T(330, 100, 'flip B upside down')}</g>
      <g data-step="4"><path d="${pts(60, 222, 520, (u) => 1.6 * Math.sin(140 * u) * Math.sin(9 * u))}" fill="none" stroke="var(--good)" stroke-width="2.5" class="rl-pulse"/></g>
      <g data-step="=4">${T(330, 196, 'what is left: 70 dB down', 'fill="var(--good)"')}</g>
      <g data-step="=5">${T(330, 196, 'blind test: 9 of 16 = guessing')}
        ${Array.from({ length: 16 }, (_, i) => `<circle cx="${180 + i * 20}" cy="256" r="7" fill="${[0, 2, 3, 6, 7, 9, 12, 13, 15].includes(i) ? 'var(--good)' : 'var(--bad)'}" class="rl-pulse ${i % 2 ? 'd2' : ''}"/>`).join('')}</g>
    </svg>`,
    steps: [
      ['Record the same thing twice', 'Play one mix through device A and device B and capture both results.'],
      ['Line them up', 'Slide one file until both start on exactly the same sample, and match their levels.'],
      ['Flip one', 'Inverting B turns every peak into a dip of the same size.'],
      ['Add them', 'Everything the two files share cancels to silence. Only the true difference remains, and you can measure and hear it.'],
      ['Check with your ears, blind', 'Sixteen tries without knowing which is which. Around 8 right means no audible difference; 12 or more means there is one.'],
    ],
    why: [
      'Hearing is steered by expectation. Knowing which device is playing changes what you perceive, honestly and without your noticing.',
      'Subtraction cannot be fooled: if nothing is left, nothing was different.',
      'A device can only change four things: frequency balance, noise, distortion and timing. All four show up in what is left over.',
    ],
    uses: [
      ['💸', 'Before buying an upgrade', 'Borrow it and run a null test and a blind test. Spend where the difference is large: speakers, the room, microphones and their placement.'],
      ['🧪', 'Checking a plugin or export', 'Null a file against its “lossless” copy or a bypassed plugin to prove it is really untouched.'],
      ['👂', 'Settling a studio argument', 'Let a third person switch A and B at random and keep score. Sixteen rounds takes ten minutes.'],
    ],
    tryit: [
      'In any audio editor, duplicate a track, invert the copy and play both: silence. Now change the copy’s level by 0.5 dB and hear what appears.',
      'Export a song as a high-quality compressed file, bring it back in, line it up and null it against the original. Listen to what the coder removed.',
      'Ask a friend to switch two cables or settings at random ten times while you write down your guesses.',
    ],
    slip: ['Comparing by memory, days apart, knowing which is which.', 'Switch quickly, match levels, and hide the identity. Then trust the score.'],
  });

  REAL('hearing-depth', {
    title: 'the drummer’s two-hour rehearsal',
    plain: 'Hearing damage depends on how loud and for how long, multiplied together. Every 3 dB louder halves the time you can safely stay.',
    where: 'A small rehearsal room, three evenings a week',
    story: `<p>Rohan plays drums in a room the size of a bedroom. A meter app at his head reads about 100 dB(A) during songs. After each two-hour rehearsal his ears ring until bedtime, and lately the ringing lasts into the next morning.</p>
      <p>At 100 dB(A) the daily allowance is used up in about fifteen minutes. Two hours is eight days’ worth in one evening. He buys flat-response musicians’ earplugs, checks that they seal properly, and hangs thick absorbers on two walls. With the plugs alone his exposure drops to a quarter of the daily limit, and the ringing stops.</p>`,
    numbers: [['Level at the drummer’s ears', '100 dB(A)'], ['Safe time at 85 dB(A)', '8 hours'], ['Safe time at 100 dB(A)', '8 h halved 5 times = 15 min'], ['Two hours at 100 dB(A)', '120 ÷ 15 = 8 × the daily dose'], ['With plugs that really give 15 dB', '85 dB(A): 2 h ÷ 8 h = 25 %']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Daily noise dose filling up with and without earplugs">
      <g font-size="13">${[[85, '8 h'], [88, '4 h'], [91, '2 h'], [94, '1 h'], [97, '30 min'], [100, '15 min']].map(([l, t], i) => `<g data-step="2"><rect x="${40 + i * 96}" y="${64 - i * 4}" width="84" height="${44 + i * 4}" rx="6" fill="var(--panel)" stroke="${i === 5 ? 'var(--bad)' : 'var(--line)'}" stroke-width="2"/><text x="${82 + i * 96}" y="84" text-anchor="middle">${l} dB</text><text x="${82 + i * 96}" y="102" text-anchor="middle" fill="var(--muted)">${t}</text></g>`).join('')}</g>
      <g data-step="=1">${T(320, 90, 'rehearsal level at the ears: 100 dB(A)')}${rings(320, 150, 'var(--bad)', 3, 20)}</g>
      <g data-step="=2">${T(320, 40, 'each +3 dB halves the safe time')}</g>
      <rect x="40" y="170" width="560" height="34" rx="8" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/>
      <line x1="110" y1="162" x2="110" y2="212" stroke="var(--text)" stroke-width="2"/><text x="110" y="232" text-anchor="middle" font-size="12">100 % of a day’s dose</text>
      <g data-step="3-4"><rect x="42" y="172" width="556" height="30" rx="7" fill="var(--bad)" class="rl-pulse"/></g>
      <g data-step="=3">${T(360, 150, 'two hours unprotected: 800 %', 'fill="var(--bad)"')}</g>
      <g data-step="=4">${T(360, 150, 'ringing ears = warning already given', 'fill="var(--bad)"')}</g>
      <g data-step="5"><rect x="42" y="172" width="556" height="30" rx="7" fill="var(--panel)"/><rect x="42" y="172" width="18" height="30" rx="7" fill="var(--good)"/>
        ${T(360, 150, 'with well-fitted plugs: 25 %', 'fill="var(--good)"')}
        <text x="320" y="262" text-anchor="middle" font-size="13">plus a quieter room and short breaks</text></g>
    </svg>`,
    steps: [
      ['Measure the level', 'A phone app is rough but good enough to tell 85 from 100 dB(A). Hold it at head height while playing.'],
      ['The halving rule', '85 dB(A) is allowed for 8 hours. Every 3 dB more cuts the time in half: 100 dB(A) leaves 15 minutes.'],
      ['Add up the evening', 'Two hours at 100 dB(A) is eight daily doses. The ear has no time to recover.'],
      ['Ringing is the alarm', 'Ringing or dull hearing afterwards means hair cells were overloaded. Repeated often enough, the loss becomes permanent.'],
      ['Bring the dose down', 'Plugs that seal, a less reflective room, lower stage volume and breaks all multiply together.'],
    ],
    why: [
      'The hair cells in the inner ear do not grow back. Once enough are lost, no treatment restores them.',
      'Three decibels is a doubling of sound energy, so 3 dB louder for half the time is the same total energy.',
      'Earplugs rarely reach the number on the packet in real use. A poor seal can halve the protection, so fit matters more than the rating.',
    ],
    uses: [
      ['🥁', 'Rehearsals and gigs', 'Flat-response plugs take 15–20 dB off evenly, so the music still sounds right and you keep them in.'],
      ['🎧', 'Headphone work', 'If someone next to you can follow the song from your headphones, you are probably above 85 dB(A). Turn down and take a break each hour.'],
      ['🎚️', 'Long mixing days', 'Mix around 75–80 dB. You can work all day, your judgement stays steady, and loud checks are kept to a minute.'],
    ],
    tryit: [
      'Measure your usual rehearsal, gig or headphone level with a meter app and look up the safe time on the halving ladder.',
      'Insert foam plugs properly: roll thin, pull the ear up and back, hold for 20 seconds. Your own voice should sound boomy when they seal.',
      'Book a hearing test now, while your hearing is good, so you have a baseline to compare against later.',
    ],
    slip: ['Believing your ears “get used to it”.', 'They do not toughen; they lose sensitivity. If sound seems less loud than it used to, that is damage, not adaptation. This is general education, not medical advice: see an audiologist about any lasting ringing.'],
  });

  REAL('propagation', {
    title: 'the back row at morning assembly',
    plain: 'Outdoors, sound from a small source thins out as it spreads. Every time you double your distance, the level drops by 6 dB.',
    where: 'A school playground',
    story: `<p>Mrs D’Souza addresses assembly through one loudspeaker on a stand. The children in the front row, 2 m away, cover their ears. The back row, 16 m away, cannot follow the announcements. Turning the volume up only makes the front row more uncomfortable.</p>
      <p>The caretaker adds a second small speaker halfway back, aimed at the rear rows and delayed so that its sound leaves just as the main speaker’s sound passes it. The main speaker is turned down. The front row is now comfortable and the back row hears clearly.</p>`,
    numbers: [['Level 1 m from the speaker', '100 dB'], ['Front row at 2 m', '100 − 6 = 94 dB'], ['Back row at 16 m (4 doublings)', '100 − 24 = 76 dB'], ['Front-to-back difference', '18 dB'], ['Delay for a fill speaker at 8 m', '8 ÷ 343 ≈ 23 ms']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Sound level falling by 6 dB for each doubling of distance from a loudspeaker">
      <line x1="20" y1="212" x2="620" y2="212" stroke="var(--line)" stroke-width="2"/>
      <rect x="40" y="120" width="34" height="50" rx="4" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><line x1="57" y1="170" x2="57" y2="212" stroke="var(--text)" stroke-width="3"/>
      ${[[190, '2 m'], [320, '4 m'], [450, '8 m'], [580, '16 m']].map(([x, d]) => `${person(x, 162, 'var(--c2)')}<text x="${x}" y="236" text-anchor="middle" font-size="13">${d}</text>`).join('')}
      <g data-step="1-4">${rings(74, 145, 'var(--accent)', 3, 30)}</g>
      <g data-step="=1">${T(330, 60, 'sound spreads over an ever larger sphere')}</g>
      <g data-step="2"><text x="190" y="130" text-anchor="middle" font-size="15" font-weight="700">94</text></g>
      <g data-step="3"><text x="320" y="130" text-anchor="middle" font-size="15" font-weight="700">88</text><text x="450" y="130" text-anchor="middle" font-size="15" font-weight="700">82</text></g>
      <g data-step="3-4"><path d="M205 100 Q255 76 305 100" fill="none" stroke="var(--accent)" stroke-width="2"/>${T(255, 74, '−6 dB', 'fill="var(--accent)"')}
        <path d="M335 100 Q385 76 435 100" fill="none" stroke="var(--accent)" stroke-width="2"/>${T(385, 74, '−6 dB', 'fill="var(--accent)"')}</g>
      <g data-step="4"><text x="580" y="130" text-anchor="middle" font-size="15" font-weight="700" fill="var(--bad)">76</text></g>
      <g data-step="=4">${T(385, 40, 'front too loud, back too quiet: 18 dB apart')}</g>
      <g data-step="5"><rect x="372" y="92" width="26" height="36" rx="4" fill="var(--panel)" stroke="var(--good)" stroke-width="2"/><line x1="385" y1="128" x2="385" y2="212" stroke="var(--good)" stroke-width="3"/>
        ${rings(398, 110, 'var(--good)', 2, 26)}${T(430, 40, 'fill speaker, delayed 23 ms', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['Sound spreads out', 'The same energy has to cover a bigger and bigger surface as it travels away.'],
      ['Close is loud', 'At 2 m the front row gets 94 dB, about as loud as a power drill at arm’s length.'],
      ['Each doubling costs 6 dB', 'Twice the distance means four times the area, so a quarter of the energy per square metre.'],
      ['The far rows lose out', 'Four doublings later the back row has 24 dB less than at 1 m. No volume setting suits both ends.'],
      ['Shorten the distance', 'A second speaker near the back, delayed to match the first, gives far listeners a nearby source.'],
    ],
    why: [
      'It is the same reason a torch beam is dimmer on a far wall: fixed power, growing area.',
      'Indoors the walls return the sound, so beyond a certain distance the level stops falling. Outdoors there is nothing to return it.',
      'A long line of speakers spreads in one direction less, so it loses only about 3 dB per doubling near the line, which is why line arrays reach far.',
    ],
    uses: [
      ['🎤', 'Microphone distance', 'Moving a mic from 20 cm to 10 cm from a singer gives 6 dB more voice against the same background noise.'],
      ['📢', 'Covering an audience', 'Raise and tilt the speaker so front listeners are further from it and off its main beam; the spread from front to back shrinks.'],
      ['🏡', 'Noise to a neighbour', 'A pump 5 m from a fence moved to 20 m away is 12 dB quieter there, before any barrier is built.'],
    ],
    tryit: [
      'Outdoors, play steady noise from a small speaker. Measure at 1, 2 and 4 m with a meter app and check for about 6 dB steps.',
      'Repeat in your living room. Notice that beyond 2–3 m the level hardly drops: you are now hearing the room.',
      'Work out the delay for a second speaker 12 m from the first: 12 ÷ 343 seconds.',
    ],
    slip: ['Turning up one speaker to reach the back.', 'Bring a speaker closer to the far listeners, or raise and aim the main one. Level differences are set by distance ratios, not by volume.'],
  });

  REAL('wave-physics', {
    title: 'why you cannot hear the poolside from under water',
    plain: 'When sound meets a material that is much harder to push than the one it is travelling in, nearly all of it bounces back. The bigger the mismatch, the stronger the bounce.',
    where: 'A swimming pool on a busy afternoon',
    story: `<p>Zoya ducks under the surface and the shouting children, the whistle and the music all drop to a murmur. Her ears are fine and water carries sound very well, so why the silence?</p>
      <p>Air is light and easy to push; water is about 3,600 times harder to push. A sound wave in air arriving at the surface is like a table-tennis ball hitting a bowling ball: it bounces off and hands over almost nothing. About one part in a thousand of the energy gets through. A heavy studio wall plays the same trick on purpose.</p>`,
    numbers: [['How hard air pushes back', '≈ 415 units'], ['How hard water pushes back', '≈ 1,480,000 units'], ['Ratio', '≈ 3,600 to 1'], ['Energy that crosses the surface', '4 × 415 ÷ 1,480,000 ≈ 0.1 %'], ['As a level drop', '≈ 30 dB']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Sound in air reflecting from a water surface with very little passing through">
      <rect x="0" y="150" width="640" height="120" fill="var(--c2)" opacity=".18"/>
      <line x1="0" y1="150" x2="640" y2="150" stroke="var(--c2)" stroke-width="3"/>
      <text x="24" y="40" font-size="13">AIR: light, easy to push</text><text x="24" y="250" font-size="13">WATER: 3,600 × harder to push</text>
      <circle cx="430" cy="212" r="13" fill="var(--c1)"/><rect x="443" y="204" width="46" height="16" rx="7" fill="var(--c1)"/>
      <g data-step="1"><path d="M120 40 L300 148" stroke="var(--accent)" stroke-width="4" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${T(330, 80, 'a shout travels down through the air', 'fill="var(--accent)"')}</g>
      <g data-step="=2"><circle cx="300" cy="150" r="14" fill="none" stroke="var(--text)" stroke-width="3" class="rl-pulse"/>${T(330, 190, 'the surface barely moves')}</g>
      <g data-step="3"><path d="M300 148 L480 40" stroke="var(--accent)" stroke-width="4" fill="none" class="rl-flow"/></g>
      <g data-step="=3">${T(530, 104, '99.9 % bounces back', 'fill="var(--accent)"')}</g>
      <g data-step="4"><path d="M300 152 L340 250" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow"/></g>
      <g data-step="=4">${T(250, 208, '0.1 % gets in: −30 dB', 'fill="var(--good)"')}</g>
      <g data-step="=5">${T(476, 136, 'a heavy wall does the same in a room')}<rect x="296" y="20" width="10" height="128" fill="var(--muted)"/></g>
    </svg>`,
    steps: [
      ['Sound arrives in air', 'The wave is a small push carried by a very light material.'],
      ['It meets something hard to push', 'Water needs thousands of times more pressure to move by the same amount, so the surface hardly responds.'],
      ['Most of it reflects', 'The push has nowhere to go, so it turns round. From the air side the water looks almost like a solid wall.'],
      ['A trace gets through', 'Only about a thousandth of the energy enters the water: 30 dB quieter.'],
      ['The studio version', 'Dense brick or layered plasterboard is hard for air to push, so sound in the room stays in the room.'],
    ],
    why: [
      'How hard a material pushes back depends on its density times its sound speed. Both are far higher for water and masonry than for air.',
      'Energy transfers best between things that are equally easy to push, like two equal balls colliding. A mismatch in either direction sends it back.',
      'This is why mass stops sound and why soft fluffy materials do not: fluffy material is almost as easy to push as air, so sound walks in. That makes it an absorber, not a barrier.',
    ],
    uses: [
      ['🧱', 'Soundproofing', 'To keep sound in, add heavy, airtight layers. To stop echoes inside, add soft porous layers. They are different jobs.'],
      ['📯', 'Horns and megaphones', 'A horn widens gradually so the mismatch between a small driver and open air is eased, and more sound gets out.'],
      ['🩺', 'Gel for a medical scan', 'A thin air gap would reflect almost everything, so gel fills it and lets the sound pass into the body.'],
    ],
    tryit: [
      'In a bath or pool, put your ears under and have someone talk normally above the water. Then tap two spoons together under water: that carries easily.',
      'Press your ear to a table and scratch the far end lightly. Lift your head and scratch again: the air path is much weaker.',
      'Hold a pillow, then a heavy book, in front of a small speaker. Which blocks more? Which would reduce echo more?',
    ],
    slip: ['Using foam or wool panels to stop sound reaching the neighbours.', 'Absorbers match air and let sound through. Use mass and airtightness for isolation, and absorbers only for the sound inside the room.'],
  });

  REAL('moving-extreme', {
    title: 'the ambulance that changes note as it passes',
    plain: 'A source moving towards you squeezes its sound waves together, so you hear a higher note. As it moves away the waves are stretched and the note drops.',
    where: 'A pavement beside a main road',
    story: `<p>Farah waits to cross as an ambulance approaches at 72 km/h. Its siren sounds bright and urgent. The moment it passes her the note sags, as if someone had retuned it. The driver hears the same steady note all the time.</p>
      <p>Each wave leaves the siren a little closer to Farah than the one before, so they arrive bunched up: more per second, higher pitch. After it passes, each wave starts a little further away, so they arrive spread out. The total drop is about two notes on a piano.</p>`,
    numbers: [['Siren note', '700 Hz'], ['Ambulance speed', '72 km/h = 20 m/s'], ['Heard while approaching', '700 × 343 ÷ (343 − 20) ≈ 743 Hz'], ['Heard while leaving', '700 × 343 ÷ (343 + 20) ≈ 661 Hz'], ['Drop as it passes', '743 ÷ 661 ≈ 1.12, about two semitones']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Sound waves bunched ahead of a moving ambulance and stretched behind it">
      <line x1="10" y1="200" x2="630" y2="200" stroke="var(--line)" stroke-width="2"/>
      ${person(70, 136, 'var(--c3)')}${T(72, 226, 'behind: 661 Hz')}
      ${person(580, 136, 'var(--c2)')}${T(566, 226, 'ahead: 743 Hz')}
      <g class="rl-slide" style="--dx:30px"><rect x="284" y="152" width="78" height="36" rx="6" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><rect x="340" y="140" width="22" height="14" rx="3" fill="var(--bad)" class="rl-pulse"/><circle cx="302" cy="192" r="9" fill="var(--text)"/><circle cx="346" cy="192" r="9" fill="var(--text)"/></g>
      <g data-step="=1">${T(320, 60, 'the siren makes a steady 700 Hz')}</g>
      <g data-step="2" fill="none" stroke="var(--accent)" stroke-width="2.5">${[0, 1, 2, 3, 4].map((i) => `<path d="M${378 + i * 22} 100 q14 50 0 100" class="rl-pulse ${['', 'd2', 'd3', 'd4', ''][i]}"/>`).join('')}</g>
      <g data-step="=2">${T(430, 84, 'bunched up ahead', 'fill="var(--accent)"')}</g>
      <g data-step="3" fill="none" stroke="var(--c3)" stroke-width="2.5">${[0, 1, 2, 3].map((i) => `<path d="M${262 - i * 44} 100 q-14 50 0 100" class="rl-pulse ${['', 'd2', 'd3', 'd4'][i]}"/>`).join('')}</g>
      <g data-step="=3">${T(196, 84, 'stretched out behind', 'fill="var(--c3)"')}</g>
      <g data-step="=4">${T(320, 40, 'more waves per second = higher note')}<circle cx="580" cy="136" r="24" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/></g>
      <g data-step="=5">${T(320, 40, 'as it passes, the note drops two semitones')}<circle cx="70" cy="136" r="24" fill="none" stroke="var(--c3)" stroke-width="2.5" class="rl-grow"/></g>
    </svg>`,
    steps: [
      ['A steady source', 'The siren sends out 700 waves every second, whatever the vehicle is doing.'],
      ['Ahead: waves bunch up', 'The vehicle chases its own sound, so each wave starts closer to the one before.'],
      ['Behind: waves stretch', 'It runs away from the sound it sends backwards, so the gaps between waves grow.'],
      ['The listener in front', 'More waves reach her each second: she hears about 743 Hz.'],
      ['The listener behind', 'Fewer waves per second arrive: about 661 Hz. Passing from one side to the other gives the familiar falling swoop.'],
    ],
    why: [
      'Sound travels at a fixed speed through the air regardless of how fast the source moves, so a moving source cannot carry its waves with it.',
      'Pitch is simply how many waves reach the ear each second. Change the spacing and you change the pitch.',
      'If the source reaches the speed of sound, the waves ahead pile into a single front: that is the sonic boom.',
    ],
    uses: [
      ['🎹', 'The rotary-speaker sound', 'A spinning horn moves towards and away from the listener several times a second, giving a gentle wobble of pitch and level that an organ uses on purpose.'],
      ['🎬', 'Sound design for film', 'A pass-by sounds real only if the pitch falls as the object passes. Add a downward bend of a tone or two at the crossing point.'],
      ['🚗', 'Speed checks and medical scans', 'Radar guns and blood-flow scanners measure the frequency shift of a reflected wave to find speed.'],
    ],
    tryit: [
      'Stand safely back from a road and listen to a motorbike or horn pass. Hum the note before and after.',
      'Tie a small buzzer or phone playing a steady tone in a sock and swing it gently in a circle. A friend 5 m away hears the pitch wobble.',
      'Work out the shift for a train at 30 m/s with a 500 Hz horn: 500 × 343 ÷ 313 approaching.',
    ],
    slip: ['Thinking the pitch keeps rising as the vehicle gets closer.', 'The pitch is steady and high on approach, then drops as it passes. Only the loudness rises on the way in.'],
  });

  REAL('outdoor-sound', {
    title: 'a wall between the generator and the bedroom',
    plain: 'A solid barrier forces sound to bend over the top. The more it has to bend, the quieter it gets, and high notes are cut much more than low rumble.',
    where: 'A house backing onto a small workshop',
    story: `<p>The Nair family’s bedroom window faces a workshop generator 12 m away. They ask a mason for a wall. He offers 1.8 m of brick halfway between; the family’s engineer cousin asks for 3 m, built 2 m from the generator.</p>
      <p>The cousin’s wall makes the sound travel 0.93 m further to climb over the top. That extra distance cuts the mid-range drone by about 18 dB and the low rumble by about 12 dB. The lower, halfway wall would barely have broken the line of sight and done almost nothing.</p>`,
    numbers: [['Straight path, generator to window', '12.0 m'], ['Path over the 3 m wall', '2.83 + 10.11 = 12.94 m'], ['Extra path', '0.93 m'], ['Reduction at 500 Hz', '≈ 18 dB'], ['Reduction at 125 Hz', '≈ 12 dB']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Sound bending over a barrier wall between a generator and a window">
      <line x1="10" y1="220" x2="630" y2="220" stroke="var(--line)" stroke-width="2"/>
      <rect x="40" y="180" width="56" height="40" rx="5" fill="var(--c1)"/>${T(68, 244, 'generator')}
      <rect x="548" y="90" width="80" height="130" fill="var(--panel)" stroke="var(--muted)" stroke-width="2"/><rect x="556" y="150" width="26" height="30" fill="var(--c2)" opacity=".5"/>${T(588, 244, 'bedroom')}
      <g data-step="=1"><path d="M96 196 L556 165" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/>${T(320, 150, 'no wall: a clear 12 m path', 'fill="var(--bad)"')}</g>
      <g data-step="2"><rect x="150" y="80" width="14" height="140" fill="var(--muted)"/>${T(157, 70, '3 m wall')}</g>
      <g data-step="=2">${T(380, 150, 'line of sight is cut')}<path d="M96 196 L150 192" stroke="var(--bad)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="3"><path d="M96 190 L157 80 L556 165" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=3">${T(390, 100, 'over the top: 0.93 m further', 'fill="var(--accent)"')}</g>
      <g data-step="4"><path d="M164 82 L548 164 L548 220 L164 220 Z" fill="var(--good)" opacity=".14"/></g>
      <g data-step="=4">${T(360, 200, 'shadow zone: mid-range down 18 dB', 'fill="var(--good)"')}</g>
      <g data-step="=5">${T(400, 40, 'low rumble bends more easily: only 12 dB')}<path d="M157 80 Q360 96 556 165" stroke="var(--c3)" stroke-width="6" fill="none" opacity=".6" class="rl-flow slow"/></g>
    </svg>`,
    steps: [
      ['No barrier', 'Sound travels straight from the generator to the window, losing level only through distance.'],
      ['Break the line of sight', 'A solid, gap-free wall blocks the straight path. If you can still see the source, the wall does almost nothing.'],
      ['Sound bends over the edge', 'It reaches the window by a longer route over the top. The extra length is what counts.'],
      ['A shadow forms', 'Behind the wall, short waves (mid and high notes) cannot bend sharply enough, so they fall by 15–20 dB.'],
      ['Long waves leak round', 'Bass wavelengths are metres long and bend easily, so rumble is reduced less. Height and closeness to the source help most.'],
    ],
    why: [
      'Waves bend round edges more when the wavelength is large compared with the detour. At 125 Hz the wave is 2.7 m long; at 500 Hz only 0.7 m.',
      'Putting the wall near the source (or near the listener) makes the detour steep and long. In the middle, the same wall gives the smallest detour.',
      'The wall itself only needs to be reasonably heavy (about 10 kg per square metre or more) and free of gaps, because the sound going over the top is the limit.',
    ],
    uses: [
      ['❄️', 'Air-conditioner or pump noise', 'A solid screen 1 m taller than the unit and close to it can take 8–12 dB off at a neighbour’s window.'],
      ['🎪', 'Outdoor events', 'Stage containers, a line of parked trucks or a temporary screen behind the stage shield the nearest houses from mid and high frequencies.'],
      ['🛣️', 'Choosing a studio site', 'A plot below road level or behind a row of buildings is already in a shadow zone. Check low-frequency traffic rumble separately.'],
    ],
    tryit: [
      'Play a voice recording on a phone, step behind a parked van or a garden wall, and notice how speech dulls while low sounds remain.',
      'Peek over the top until you can just see the phone: the level jumps the moment the line of sight opens.',
      'Sketch your own noise problem in section, measure the three sides of the triangle, and work out the extra path.',
    ],
    slip: ['Building a low wall halfway between source and listener, or one with gaps at the bottom.', 'Go high, go close to the source, and seal every gap. A gap under a barrier lets sound straight through and can undo much of its benefit.'],
  });

  REAL('interference', {
    title: 'the speaker who sounded hollow with two mics on',
    plain: 'When the same sound reaches a mixer by two paths of different length, the two copies cancel at some pitches and add at others. The result sounds hollow, like speaking into a tube.',
    where: 'A conference room with a podium microphone',
    story: `<p>At a company meeting, the chairman wears a clip-on microphone and also stands at a podium microphone. Both are left on. His voice through the speakers sounds thin and “phasey”, and it changes every time he leans.</p>
      <p>His mouth is 20 cm from the clip-on mic and 54 cm from the podium mic. The second copy arrives one thousandth of a second late. Mixed equally, the two cancel completely at 500 Hz, 1,500 Hz and 2,500 Hz, right in the speech range. The operator mutes the podium mic and the voice is full again.</p>`,
    numbers: [['Mouth to clip-on mic', '0.20 m'], ['Mouth to podium mic', '0.54 m'], ['Path difference', '0.34 m'], ['Delay', '0.34 ÷ 343 ≈ 1 ms'], ['Cancelled frequencies', '500, 1,500, 2,500 Hz …']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Two copies of a wave, one delayed, adding and cancelling to give a comb-shaped response">
      <text x="20" y="52" font-size="13">mic 1</text><text x="20" y="112" font-size="13">mic 2</text><text x="20" y="196" font-size="13">mix</text>
      <path d="${wave(80, 48, 250, 18, 3)}" fill="none" stroke="var(--c1)" stroke-width="2.5" class="rl-flow slow"/>
      <g data-step="1-2"><path d="${wave(80, 108, 250, 18, 3)}" fill="none" stroke="var(--c2)" stroke-width="2.5"/></g>
      <g data-step="=1">${T(480, 60, 'same voice, same timing')}<path d="${wave(80, 192, 250, 34, 3)}" fill="none" stroke="var(--good)" stroke-width="3"/>${T(480, 196, 'they add: louder', 'fill="var(--good)"')}</g>
      <g data-step="=2">${T(480, 60, 'now mic 2 is 34 cm further away')}<path d="M80 80 h42" stroke="var(--accent)" stroke-width="3" class="rl-pulse"/></g>
      <g data-step="3-4"><path d="${wave(80, 108, 250, 18, 3, Math.PI)}" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-flow slow"/></g>
      <g data-step="=3">${T(480, 60, 'at 500 Hz: 1 ms = half a wave late')}<path d="M80 192 H330" stroke="var(--bad)" stroke-width="3"/>${T(480, 196, 'peak meets dip: silence', 'fill="var(--bad)"')}</g>
      <g data-step="4"><line x1="370" y1="250" x2="620" y2="250" stroke="var(--muted)"/><path d="M372 130 Q395 130 406 248 Q418 130 450 130 Q480 130 492 248 Q504 130 536 130 Q566 130 578 248 Q590 130 616 130" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
        <text x="406" y="270" text-anchor="middle" font-size="12">500</text><text x="492" y="270" text-anchor="middle" font-size="12">1.5k</text><text x="578" y="270" text-anchor="middle" font-size="12">2.5k Hz</text></g>
      <g data-step="=4">${T(495, 112, 'a row of notches: comb filtering', 'fill="var(--accent)"')}</g>
      <g data-step="=5">${T(480, 60, 'mute one mic')}<path d="${wave(80, 192, 250, 18, 3)}" fill="none" stroke="var(--good)" stroke-width="3" class="rl-flow slow"/>${T(205, 240, 'one clean copy', 'fill="var(--good)"')}<path d="M70 96 L340 122 M70 122 L340 96" stroke="var(--bad)" stroke-width="3"/></g>
    </svg>`,
    steps: [
      ['Two identical copies in step', 'If both microphones were the same distance away, the copies would simply add and be 6 dB louder.'],
      ['One copy is late', 'The podium mic is 34 cm further from the mouth, so its copy lags by a thousandth of a second.'],
      ['Half a wave late means cancel', 'At 500 Hz one wave lasts 2 ms, so a 1 ms lag puts every peak on top of a dip. The two erase each other.'],
      ['A comb of notches', 'The same happens at 1,500, 2,500 Hz and so on, while in between they add. Plotted, it looks like a comb.'],
      ['Remove one path', 'Mute or lower one microphone by 10 dB or more and the comb disappears.'],
    ],
    why: [
      'Sound pressures add like pushes: two equal pushes in the same direction double, two in opposite directions cancel.',
      'A fixed delay is half a wave at one pitch, a whole wave at double that pitch, one and a half at triple. So cancel, add, cancel alternates all the way up.',
      'The cancellation is deep only when both copies are nearly equal in level, which is why turning one down is such an easy cure.',
    ],
    uses: [
      ['🎤', 'Several microphones on a stage', 'Keep each mic at least three times further from other sources than from its own. The leaked copy is then too weak to comb.'],
      ['🔊', 'A speaker near a wall', 'The wall bounce is a delayed copy. A speaker 1 m from the wall behind it dips near 343 ÷ (4 × 1) ≈ 86 Hz. Move it or mount it flush.'],
      ['🥁', 'Two mics on one drum', 'Top and bottom snare mics face opposite ways, so one is flipped. Press the polarity button and choose the fuller sound.'],
    ],
    tryit: [
      'In an audio editor, duplicate a voice track, shift the copy 1 ms later and play both. Then shift it by 10 ms and compare.',
      'Play pink noise from one speaker and move your head slowly towards a bare wall. You hear a “whoosh” as the notches slide.',
      'Record yourself on a phone held 20 cm from a hard table, then 20 cm above a folded towel on the table.',
    ],
    slip: ['Reaching for the equaliser to fix a hollow sound.', 'A comb has dozens of notches that move when anything moves. Remove the second path instead: mute, re-position, or absorb the reflection.'],
  });

  REAL('modes', {
    title: 'the bass note that booms in one spot and vanishes in another',
    plain: 'A room has a few bass notes that fit exactly between its walls. Those notes pile up near the walls and thin out in the middle, so the same music has different bass depending on where you stand.',
    where: 'A 4 m × 3 m bedroom used for music',
    story: `<p>Nikhil plays bass through a small amplifier in his bedroom. One low note, the open E, roars when he sits on the bed against the wall and almost disappears when he stands in the middle of the room. Other notes behave normally.</p>
      <p>His room is 4.0 m long. A sound wave whose half-length is exactly 4.0 m has a frequency of about 43 Hz, and the open E is 41 Hz, close enough to get trapped bouncing between the end walls. Pressure is greatest at those walls and near zero halfway. He moves his chair to a spot a bit over a third of the way along the room and builds two thick corner traps, and the note evens out.</p>`,
    numbers: [['Room length', '4.0 m'], ['First lengthwise mode', '343 ÷ (2 × 4.0) ≈ 43 Hz'], ['Open E on a bass', '41 Hz'], ['Width mode (3.0 m)', '343 ÷ (2 × 3.0) ≈ 57 Hz'], ['Height mode (2.7 m)', '343 ÷ (2 × 2.7) ≈ 64 Hz']],
    svg: `<svg viewBox="0 0 640 280" aria-label="A standing wave between two walls: loud at the walls, quiet in the middle">
      <rect x="60" y="50" width="520" height="170" fill="none" stroke="var(--muted)" stroke-width="5"/>
      ${T(320, 246, 'room length 4.0 m')}
      <g data-step="=1"><path d="M90 135 H550" stroke="var(--accent)" stroke-width="3" class="rl-flow"/><path d="M550 150 H90" stroke="var(--accent)" stroke-width="3" class="rl-flow rev"/>${T(320, 110, 'a bass note bounces end to end')}</g>
      <g data-step="2">${vibCos(64, 135, 512, 62, 1, 'var(--accent)', 1.6)}</g>
      <g data-step="=2">${T(320, 40, '43 Hz fits exactly: half a wave = 4.0 m')}</g>
      <g data-step="3-4"><circle cx="100" cy="135" r="20" fill="var(--bad)" opacity=".5" class="rl-pulse"/><circle cx="540" cy="135" r="20" fill="var(--bad)" opacity=".5" class="rl-pulse"/></g>
      <g data-step="=3">${T(320, 40, 'at the walls: pressure swings most = boom', 'fill="var(--bad)"')}</g>
      <g data-step="4"><circle cx="320" cy="135" r="9" fill="var(--c2)"/></g>
      <g data-step="=4">${T(320, 40, 'in the middle: almost no pressure = no bass', 'fill="var(--c2)"')}</g>
      <g data-step="5"><path d="M63 53 h46 l-46 46 z M63 217 h46 l-46 -46 z M577 53 h-46 l46 46 z M577 217 h-46 l46 -46 z" fill="var(--good)"/>
        <circle cx="258" cy="150" r="13" fill="var(--c2)"/>${T(258, 186, 'seat at 38 %')}
        ${T(320, 40, 'corner traps + a better seat', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['Bass bounces between walls', 'A low note travels the length of the room, reflects, and meets itself coming back.'],
      ['One note fits exactly', 'When half a wavelength equals the room length, outgoing and returning waves line up and build a fixed pattern.'],
      ['Loud at the walls', 'The pressure swings most at the two end walls, so a listener there hears that note exaggerated.'],
      ['Quiet in the middle', 'Halfway along, the pattern has a still point. That one note nearly vanishes there.'],
      ['Two practical fixes', 'Sit away from both the walls and the exact centre (around 38 % of the length is a common start), and put thick absorbers in corners where every mode is strong.'],
    ],
    why: [
      'It is the guitar string again, with air between walls instead of wire between pegs: only shapes that fit can last.',
      'Small rooms have their fitting notes in the musical bass range and spaced far apart, so each one stands out. Large halls have them so low and so crowded that they blend.',
      'Corners are where the length, width and height patterns all have their loud ends, so a trap there works on every one of them.',
    ],
    uses: [
      ['🪑', 'Choosing the listening seat', 'Never mix with your head at the exact middle of the room or against the back wall. Try 38 % of the length from the front wall and fine-tune by ear.'],
      ['📐', 'Choosing a room', 'Avoid cube-like rooms and sizes that are simple multiples (3 × 3 × 3 m, 2.5 × 5 m). Their modes stack on the same notes.'],
      ['🔊', 'Placing a subwoofer', 'Put the sub at your seat, play a bass sweep, crawl round the walls and mark where it sounds most even. Put the sub there.'],
    ],
    tryit: [
      'Work out your room’s three lowest modes: 172 ÷ length, 172 ÷ width, 172 ÷ height (in metres).',
      'Play a sine tone at the lengthwise one, quietly, and walk slowly from one end wall to the other. Find the dead spot in the middle.',
      'Crouch in a corner while the tone plays. It is loudest there: that is where bass traps earn their keep.',
    ],
    slip: ['Using an equaliser boost to fill a bass hole at the seat.', 'A hole caused by a still point cannot be filled with more power. Move the seat or the speaker first, then treat, then equalise peaks only.'],
  });
})();
