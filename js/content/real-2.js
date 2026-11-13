/* "In real life" blocks — group 2 (standing waves to flat response). Each REAL(id, {...}) adds a worked
   scene, a step-through animated diagram and a practical wrap-up to an existing lesson (see js/real-kit.js). */
(function () {
  const REAL = window.REAL; if (!REAL) return;

  // small drawing helpers (theme colours only)
  const person = (x, y, c) => `<circle cx="${x}" cy="${y}" r="11" fill="${c}"/><rect x="${x - 9}" y="${y + 12}" width="18" height="34" rx="7" fill="${c}"/>`;
  const spk = (x, y, c) => `<rect x="${x - 13}" y="${y - 22}" width="26" height="44" rx="4" fill="${c || 'var(--text)'}"/><circle cx="${x}" cy="${y + 7}" r="8" fill="var(--panel2)"/><circle cx="${x}" cy="${y - 11}" r="4" fill="var(--panel2)"/>`;
  const pts = (n, f) => Array.from({ length: n + 1 }, (_, i) => f(i / n)).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');

  /* ------------------------------------------------------------------ */
  REAL('pv-standing', {
    title: 'the bass note that vanishes at the chair',
    plain: 'When a bass note fits exactly between two walls, it stops travelling and stands still. It is then loud at the walls and almost silent halfway between them, so what you hear depends on where you sit.',
    where: 'A 4.3 m long spare bedroom used for mixing, Pune',
    story: `<p>Rahul set his chair in the exact middle of the room because it looked tidy. One low synth note, around 40 Hz, kept disappearing from his mixes, so he turned it up. In the car the same note was huge.</p>
      <p>He played a steady 40 Hz tone and walked the room. Against the back wall it shook his chest. In the middle it was nearly gone. Nothing was wrong with the speakers: the note was standing between the front and back walls, and his chair sat in its quiet spot.</p>`,
    numbers: [['Room length', '4.3 m'], ['Note that fits', '343 ÷ (2 × 4.3) ≈ 40 Hz'], ['Quiet spot', 'half way: 2.15 m'], ['Better seat (38 %)', '0.38 × 4.3 ≈ 1.6 m']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A 40 hertz note standing between the front and back walls of a room">
      <rect x="52" y="40" width="8" height="184" fill="var(--text)"/><rect x="580" y="40" width="8" height="184" fill="var(--text)"/>
      <line x1="52" y1="224" x2="588" y2="224" stroke="var(--line)" stroke-width="3"/>
      <text x="64" y="246" font-size="12" style="fill:var(--muted)">front wall</text><text x="576" y="246" font-size="12" text-anchor="end" style="fill:var(--muted)">back wall</text>
      ${spk(92, 186)}
      <g data-step="1-2"><path d="M110 130 H570" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/><text x="320" y="70" text-anchor="middle" font-size="13" data-step="=1">40 Hz note heads for the back wall</text></g>
      <g data-step="=2"><path d="M570 150 H110" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/><text x="320" y="70" text-anchor="middle" font-size="13">it bounces straight back</text></g>
      <g data-step="3"><g class="rl-pulse">
        <path d="${pts(40, (u) => [60 + u * 520, 132 - 62 * Math.cos(Math.PI * u)])}" stroke="var(--accent)" stroke-width="3" fill="none"/>
        <path d="${pts(40, (u) => [60 + u * 520, 132 + 62 * Math.cos(Math.PI * u)])}" stroke="var(--accent)" stroke-width="3" fill="none"/></g>
        <text x="112" y="58" font-size="13" style="fill:var(--bad)" text-anchor="middle">LOUD</text><text x="528" y="58" font-size="13" style="fill:var(--bad)" text-anchor="middle">LOUD</text>
        <text x="320" y="112" font-size="13" style="fill:var(--accent2)" text-anchor="middle">quiet</text></g>
      <g data-step="1-4">${person(320, 166, 'var(--c2)')}</g>
      <g data-step="=4"><circle cx="320" cy="150" r="34" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-pulse"/><text x="320" y="36" text-anchor="middle" font-size="13" style="fill:var(--bad)">chair in the quiet spot</text></g>
      <g data-step="5">${person(258, 166, 'var(--good)')}<path d="M306 200 H274" stroke="var(--good)" stroke-width="3" marker-end="none" class="rl-flow"/><text x="258" y="36" text-anchor="middle" font-size="13" style="fill:var(--good)">move to 1.6 m: bass returns</text></g>
    </svg>`,
    steps: [
      ['The note leaves the speaker', 'A 40 Hz wave is 8.6 m long. It travels down the room towards the back wall.'],
      ['The wall sends it back', 'The hard wall reflects it. Now two equal waves cross each other, one going each way.'],
      ['The two waves lock in place', 'Because half a wavelength is exactly the room length, they add at the walls and cancel in the middle, every time.'],
      ['The chair is in the cancelled zone', 'Rahul hears almost no 40 Hz, turns it up, and his mix becomes bass-heavy everywhere else.'],
      ['Move the seat off the quiet spot', 'At about 38 % of the room length he is away from the middle null and away from the wall build-up.'],
    ],
    why: [
      'A hard wall cannot move, so the air next to it cannot move either. All the wave’s energy shows up there as pressure, and ears hear pressure.',
      'Half a wavelength away from a wall the same thing happens again; a quarter wavelength away the pressure is lowest. For 40 Hz those distances are 4.3 m and 2.15 m.',
      'It is like a skipping rope held at both ends: the ends are fixed, the middle swings. The pattern is set by the length, not by how hard you swing.',
    ],
    uses: [
      ['🪑', 'Choosing the seat', 'Start with your ears about 38 % of the room length from the front wall and never exactly half way.'],
      ['🧱', 'Placing bass traps', 'Pressure-type traps (membranes, tuned boxes) go on walls and in corners, where the pressure is highest.'],
      ['🎤', 'Placing a microphone', 'A bass amp miked in the middle of a small room can sound thin; move the mic a metre and listen again.'],
    ],
    tryit: [
      'Measure your room length in metres and work out 343 ÷ (2 × length). That is your first front-to-back note.',
      'Play that tone quietly from a tone-generator app through your speakers.',
      'Walk slowly from the back wall to the front. Notice the loud wall, the quiet middle, and where it sounds even.',
    ],
    slip: ['Turning up the bass because it sounds weak at your chair.', 'Walk the room first. If the note is strong at the walls, the fix is the seat position or trapping, not more level.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('modes-treat', {
    title: 'the one bass-guitar note that booms',
    plain: 'Every room makes a few bass notes ring longer and louder than the rest. You fix that by finding the exact note, finding where in the room it is strongest, and putting the right kind of absorber there.',
    where: 'A 3.4 m wide rehearsal and recording room over a shop',
    story: `<p>Every time the bass player hits a low G, the whole room hums for nearly a second after the note stops. Other notes are fine. Divya, who runs the room, had already covered the walls with thin foam tiles and nothing changed.</p>
      <p>She swept a tone slowly upward and the hum peaked at 50 Hz. That matched the room’s width. So the note was bouncing side to side, and it was strongest at the two side walls. She built two tuned panel traps for 50 Hz, fixed one to each side wall, and the hum dropped to less than half its length.</p>`,
    numbers: [['Room width', '3.4 m'], ['Side-to-side note', '343 ÷ (2 × 3.4) ≈ 50 Hz'], ['Quarter wavelength at 50 Hz', '6.9 ÷ 4 ≈ 1.7 m'], ['Ring time before → after', 'about 0.9 s → 0.4 s']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Plan of a room with a side to side bass mode and tuned traps on the side walls">
      <rect x="120" y="40" width="400" height="190" fill="none" stroke="var(--text)" stroke-width="6"/>
      <text x="320" y="254" text-anchor="middle" font-size="12" style="fill:var(--muted)">plan view — width 3.4 m</text>
      <rect x="300" y="50" width="40" height="22" rx="4" fill="var(--text)"/><text x="320" y="92" text-anchor="middle" font-size="12">bass amp</text>
      <g data-step="1"><path d="M300 61 H132" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/><path d="M340 61 H508" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1"><text x="320" y="150" text-anchor="middle" font-size="13">low G bounces side to side</text></g>
      <g data-step="2"><rect x="124" y="44" width="70" height="182" fill="var(--bad)" opacity=".28" class="rl-pulse"/><rect x="446" y="44" width="70" height="182" fill="var(--bad)" opacity=".28" class="rl-pulse d2"/>
        <rect x="290" y="100" width="60" height="126" fill="var(--accent2)" opacity=".18"/></g>
      <g data-step="=2"><text x="160" y="140" text-anchor="middle" font-size="13">strong</text><text x="480" y="140" text-anchor="middle" font-size="13">strong</text><text x="320" y="170" text-anchor="middle" font-size="13">weak</text></g>
      <g data-step="=3"><rect x="124" y="110" width="10" height="60" fill="var(--muted)"/><text x="232" y="132" text-anchor="middle" font-size="13">thin foam at the wall:</text><text x="232" y="150" text-anchor="middle" font-size="13">air hardly moves here</text>
        <path d="M142 190 H288" stroke="var(--muted)" stroke-width="2"/><text x="215" y="208" text-anchor="middle" font-size="12" style="fill:var(--muted)">fastest air is 1.7 m out</text></g>
      <g data-step="4"><rect x="124" y="84" width="16" height="110" rx="3" fill="var(--good)" class="rl-shake"/><rect x="500" y="84" width="16" height="110" rx="3" fill="var(--good)" class="rl-shake"/></g>
      <g data-step="=4"><text x="320" y="140" text-anchor="middle" font-size="13" style="fill:var(--good)">panel traps tuned to 50 Hz</text><text x="320" y="158" text-anchor="middle" font-size="13" style="fill:var(--good)">on the high-pressure walls</text></g>
      <g data-step="5"><text x="320" y="140" text-anchor="middle" font-size="14">ring: 0.9 s → 0.4 s</text><rect x="230" y="156" width="180" height="10" rx="5" fill="var(--line)"/><rect x="230" y="156" width="80" height="10" rx="5" fill="var(--good)"/></g>
    </svg>`,
    steps: [
      ['One note fits the width', 'A 50 Hz wave is 6.9 m long, so half of it is exactly the 3.4 m width. It bounces between the side walls in step with itself.'],
      ['Find where it is strong', 'Pressure builds up at both side walls and is weak down the centre line of the room.'],
      ['Why thin foam failed', 'Foam only works where air is moving. At a wall the air is nearly still, and the fast-moving zone is 1.7 m out in the room.'],
      ['Use a pressure trap at the wall', 'A sealed panel or membrane trap is pushed by pressure. Tuned to 50 Hz and fixed where pressure is highest, it soaks the note up.'],
      ['Measure again', 'The note now dies in about 0.4 s instead of 0.9 s. Other notes are unchanged, which is what you want.'],
    ],
    why: [
      'A trap can only take energy from a mode if it sits where that mode is strong. The same trap in a weak zone does almost nothing.',
      'Porous absorbers need moving air, so for deep bass they must be very thick or stand far from the wall. Tuned traps work on pressure and can be thin.',
      'Modes are not all bad: they also support the bass. The aim is to shorten the ringing ones, not to remove the low end.',
    ],
    uses: [
      ['🎸', 'A booming note in a rehearsal room', 'Sweep a tone to find it, match it to a room dimension with 343 ÷ (2 × size), and trap the two walls it bounces between.'],
      ['🎚️', 'A mix room with a hole in the bass', 'A dip at the chair is usually a mode’s quiet spot: move the seat or speakers before buying traps.'],
      ['🛋️', 'A home cinema with one-note bass', 'Corner traps catch length, width and height modes together, because every mode has high pressure in the corners.'],
    ],
    tryit: [
      'Work out 343 ÷ (2 × size) for your room’s length, width and height. Write the three notes down.',
      'Play each as a quiet tone and stop it suddenly. Listen for the one that keeps ringing.',
      'For that note, put your head near each pair of facing walls. The pair where it is loudest is the pair to treat.',
    ],
    slip: ['Covering walls with thin foam to fix a bass boom.', 'Identify the note and its walls first, then use deep corner absorbers or a tuned trap placed at the high-pressure surface.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('reverb', {
    title: 'the school hall where announcements turn to mush',
    plain: 'Reverberation is the sound that keeps bouncing around a room after the source has stopped. The bigger and harder the room, the longer it lasts, and soft absorbing area is what shortens it.',
    where: 'A school assembly hall, 20 m × 12 m × 6 m, with plaster walls and a tiled floor',
    story: `<p>The head teacher’s morning announcements were impossible to follow from the back half of the hall. A louder sound system made it worse: more sound went in, and more sound kept ringing.</p>
      <p>Mr Iyer, the physics teacher, clapped and timed the tail at well over two seconds. He counted up how much absorbing area the hall had, worked out how much it needed for speech, and the school fitted absorbing panels across most of the ceiling. The same microphone and speakers now sound clear to the last row.</p>`,
    numbers: [['Volume', '20 × 12 × 6 = 1440 m³'], ['Absorption before', '96 m² → 0.161 × 1440 ÷ 96 ≈ 2.4 s'], ['Needed for 1.0 s', '0.161 × 1440 ÷ 1.0 ≈ 232 m²'], ['Panels to add (α 0.85)', '(232 − 96) ÷ 0.85 ≈ 160 m²']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Section of a hall showing direct sound, reflections and ceiling absorbers">
      <rect x="40" y="40" width="560" height="180" fill="none" stroke="var(--text)" stroke-width="5"/>
      ${person(90, 160, 'var(--c1)')}${person(540, 160, 'var(--c2)')}
      <text x="90" y="244" text-anchor="middle" font-size="12" style="fill:var(--muted)">talker</text><text x="540" y="244" text-anchor="middle" font-size="12" style="fill:var(--muted)">back row, 16 m away</text>
      <g data-step="1"><path d="M104 160 H526" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1"><text x="320" y="150" text-anchor="middle" font-size="13">direct sound: the clear part</text></g>
      <g data-step="2-3"><path d="M100 150 L300 46 L530 150" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow"/><path d="M100 170 L330 216 L530 172" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow d2"/></g>
      <g data-step="=2"><text x="320" y="120" text-anchor="middle" font-size="13">early bounces arrive just after</text></g>
      <g data-step="=3"><path d="M100 150 L170 46 L250 216 L330 46 L410 216 L490 46 L530 150" stroke="var(--bad)" stroke-width="1.8" fill="none" class="rl-flow slow" opacity=".8"/>
        <text x="320" y="120" text-anchor="middle" font-size="13" style="fill:var(--bad)">then 2.4 s of leftover bounces</text><text x="320" y="138" text-anchor="middle" font-size="13" style="fill:var(--bad)">bury the next words</text></g>
      <g data-step="4">${Array.from({ length: 7 }, (_, i) => `<rect x="${78 + i * 70}" y="46" width="60" height="12" rx="3" fill="var(--good)"/>`).join('')}</g>
      <g data-step="=4"><text x="320" y="88" text-anchor="middle" font-size="13" style="fill:var(--good)">160 m² of absorbing ceiling panels</text><path d="M200 150 L250 62" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow"/><path d="M380 150 L430 62" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow d2"/></g>
      <g data-step="5"><text x="320" y="100" text-anchor="middle" font-size="14">tail: 2.4 s → 1.0 s</text><rect x="200" y="112" width="240" height="10" rx="5" fill="var(--line)"/><rect x="200" y="112" width="100" height="10" rx="5" fill="var(--good)"/><text x="320" y="142" text-anchor="middle" font-size="13">words stay separate</text></g>
    </svg>`,
    steps: [
      ['The direct sound', 'The first thing the back row hears comes straight from the talker. It carries the clear consonants.'],
      ['Early reflections help', 'Bounces arriving within about a twentieth of a second blend with the direct sound and make it louder.'],
      ['Late reflections hurt', 'In a hard hall the sound keeps bouncing for 2.4 s. The tail of one word is still there when the next three arrive.'],
      ['Add absorbing area', 'Each bounce off an absorbing panel loses most of its energy. The ceiling is the biggest free surface, so the panels go there.'],
      ['The tail shortens', 'With 232 m² of absorption in total the tail lasts about 1.0 s, which suits speech in a hall this size.'],
    ],
    why: [
      'Decay time is a simple ratio: room volume divided by total absorbing area. Double the absorption and you halve the time.',
      'A louder system does not help, because it feeds the tail as much as the words. The ratio of clear sound to leftover sound stays the same.',
      'Think of a bucket with a small hole: sound is the water, absorption is the hole. A bigger hole empties it faster.',
    ],
    uses: [
      ['🏫', 'Classrooms and halls', 'For speech aim for roughly 0.6–1.0 s; treat the ceiling first because it is large and out of reach.'],
      ['⛪', 'Worship spaces', 'Choir and organ like about 2 s, speech does not; use speakers aimed at the people and absorb the back wall.'],
      ['🍽️', 'Cafés and restaurants', 'Getting under about 0.8 s stops the spiral where everyone talks louder to be heard.'],
    ],
    tryit: [
      'Clap once in your largest room and count “one-thousand-one…” until the sound is gone. That is a rough decay time.',
      'Measure the room and work out its volume in cubic metres.',
      'Use absorption ≈ 0.161 × volume ÷ time to see how many square metres of absorption the room has now, and how many more you need for your target.',
    ],
    slip: ['Buying a more powerful sound system to fix an echoing hall.', 'Add absorbing area first (ceiling, back wall), and aim the speakers at the audience instead of the walls.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('bands', {
    title: 'the report that said 0.3 seconds',
    plain: 'A room does not have one reverberation time. It has a different one for bass, for mids and for treble. Splitting sound into bands, like splitting light into colours, shows you which part of the room is misbehaving.',
    where: 'A converted garage mix room, measured by a visiting installer',
    story: `<p>Meera paid for a measurement and got one line: “RT 0.3 s — excellent”. Yet kick drums still smeared into each other and every mix came out thin on other systems.</p>
      <p>She asked for the same data band by band. The mids and highs were indeed about 0.3 s. The 63 Hz band was 0.9 s. The single figure had been taken at mid frequencies, where her foam panels work, and said nothing about the bass, which was the actual problem.</p>`,
    numbers: [['Octave bands', '63, 125, 250, 500, 1k, 2k, 4k Hz'], ['Width of the 125 Hz band', '125 ÷ 1.41 to 125 × 1.41 ≈ 88–177 Hz'], ['T20 reading', '20 dB drop in 0.15 s → × 3 = 0.45 s'], ['Her room', '0.9 s at 63 Hz, 0.3 s at 1 kHz']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Bar chart of decay time in seven octave bands, long in the bass and short in the treble">
      <line x1="70" y1="220" x2="600" y2="220" stroke="var(--line)" stroke-width="2"/><line x1="70" y1="40" x2="70" y2="220" stroke="var(--line)" stroke-width="2"/>
      <text x="62" y="224" text-anchor="end" font-size="12" style="fill:var(--muted)">0</text><text x="62" y="134" text-anchor="end" font-size="12" style="fill:var(--muted)">0.5 s</text><text x="62" y="48" text-anchor="end" font-size="12" style="fill:var(--muted)">1.0 s</text>
      ${['63', '125', '250', '500', '1k', '2k', '4k'].map((f, i) => `<text x="${116 + i * 70}" y="240" text-anchor="middle" font-size="12" style="fill:var(--muted)">${f}</text>`).join('')}
      <text x="335" y="258" text-anchor="middle" font-size="12" style="fill:var(--muted)">octave band (Hz)</text>
      <g data-step="=1"><path d="M90 60 C200 80 260 150 590 215" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow slow"/><text x="350" y="80" text-anchor="middle" font-size="13">one clap contains every pitch</text></g>
      <g data-step="2">${[0.9, 0.6, 0.4, 0.3, 0.3, 0.28, 0.25].map((v, i) => `<rect x="${92 + i * 70}" y="${220 - v * 176}" width="48" height="${v * 176}" rx="4" fill="${i < 2 ? 'var(--bad)' : 'var(--c2)'}" ${i < 2 ? 'class="rl-pulse"' : ''}/>`).join('')}</g>
      <g data-step="=2"><text x="400" y="80" text-anchor="middle" font-size="13">filter it into bands, time each one</text></g>
      <g data-step="=3"><line x1="70" y1="167" x2="600" y2="167" stroke="var(--warn)" stroke-width="3" stroke-dasharray="8 6"/><text x="400" y="80" text-anchor="middle" font-size="13" style="fill:var(--warn)">“RT 0.3 s” = mids only</text></g>
      <g data-step="4"><text x="116" y="52" text-anchor="middle" font-size="13" style="fill:var(--bad)">0.9 s</text></g>
      <g data-step="=4"><text x="400" y="80" text-anchor="middle" font-size="13" style="fill:var(--bad)">the bass rings three times longer</text></g>
      <g data-step="5"><rect x="92" y="150" width="48" height="70" rx="4" fill="var(--good)" opacity=".85"/><rect x="162" y="150" width="48" height="70" rx="4" fill="var(--good)" opacity=".85"/><text x="400" y="80" text-anchor="middle" font-size="13" style="fill:var(--good)">target: bass within reach of mids</text></g>
    </svg>`,
    steps: [
      ['One clap, all pitches', 'A clap or a sweep excites the whole range at once. The recording holds every band’s decay mixed together.'],
      ['Split into bands', 'Filters separate it into octave bands whose centre doubles each time. The decay of each band is timed on its own.'],
      ['What a single number hides', 'A lone “RT” is usually the 500 Hz and 1 kHz bands. It can look perfect while the bass is far off.'],
      ['Read the bass bands', 'Here 63 Hz rings for 0.9 s: three times the mids. That is the smear Meera hears on kick drums.'],
      ['Set a target per band', 'Good small rooms keep the low bands within about a third above the mids. Now she knows the treatment has to be deep bass trapping.'],
    ],
    why: [
      'Materials absorb some pitches and not others. Thin soft panels take the highs and leave the lows, so the bands drift apart.',
      'Our ears also work in bands: each octave sounds like an equal step, which is why the chart’s steps double rather than add.',
      'Meters rarely have 60 dB of clean decay to time, so they time the first 20 or 30 dB and scale it up. That is all T20 and T30 mean.',
    ],
    uses: [
      ['📄', 'Reading a product data sheet', 'Look at the 125 Hz column, not the single NRC figure, if your problem is bass.'],
      ['📏', 'Checking a room report', 'Ask for a table from 63 Hz to 4 kHz with the method (T20 or T30) and the number of positions.'],
      ['🔧', 'Choosing treatment', 'Long 2–4 kHz bands need thin soft surfaces; long 63–125 Hz bands need depth or tuned traps.'],
    ],
    tryit: [
      'Install a free room-measurement or spectrum app that shows octave bands.',
      'Clap, or burst a balloon, in a tiled bathroom and then in a furnished bedroom. Compare which bands hang on longest.',
      'Find any absorber data sheet and read the 125 Hz and 4 kHz values. Notice how different they are.',
    ],
    slip: ['Trusting one “RT” or “NRC” number.', 'Always ask for the band-by-band table and look at the lowest bands first.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('absorption', {
    title: 'the thin foam that did nothing for the boxy voice',
    plain: 'A soft absorber works by letting moving air rub against its fibres. Air barely moves right at a wall, so a thin panel stuck flat on the wall only catches high notes. Thickness, or a gap behind it, is what reaches lower.',
    where: 'A podcast corner in a flat, 2.5 m from wall to wall',
    story: `<p>Arjun stuck 25 mm foam tiles on the wall behind his microphone. The room lost its sharp ring, but his voice still sounded boxy and hollow around 200 Hz, like talking into a cupboard.</p>
      <p>He replaced the tiles with two 100 mm mineral-wool panels wrapped in fabric and hung them on battens 100 mm off the wall. Same wall area, eight times the reach into the room. The boxiness went, because the panel now sits where 200 Hz air is actually moving.</p>`,
    numbers: [['Fastest air at 1 kHz', '343 ÷ 1000 ÷ 4 ≈ 86 mm from wall'], ['Fastest air at 200 Hz', '343 ÷ 200 ÷ 4 ≈ 430 mm from wall'], ['Foam tile reach', '25 mm'], ['Panel + gap reach', '100 + 100 = 200 mm']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Air movement near a wall, with a thin tile and a thick panel on an air gap">
      <rect x="40" y="30" width="14" height="200" fill="var(--text)"/><text x="47" y="250" text-anchor="middle" font-size="12" style="fill:var(--muted)">wall</text>
      <line x1="54" y1="230" x2="610" y2="230" stroke="var(--line)" stroke-width="2"/>
      <g data-step="1"><path d="${pts(40, (u) => [54 + u * 540, 130 - 70 * Math.sin(Math.PI * u / 1.0 * 0.5 * 1.0 * (540 / 430))])}" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-pulse"/>
        <path d="${pts(40, (u) => [54 + u * 540, 130 + 70 * Math.sin(Math.PI * u * 0.5 * (540 / 430))])}" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-pulse"/>
        <line x1="484" y1="50" x2="484" y2="230" stroke="var(--muted)" stroke-dasharray="4 5"/><text x="484" y="44" text-anchor="middle" font-size="12">430 mm</text></g>
      <g data-step="=1"><text x="320" y="24" text-anchor="middle" font-size="13">200 Hz: how far the air swings</text><text x="110" y="120" font-size="12" style="fill:var(--muted)">still</text><text x="484" y="250" text-anchor="middle" font-size="12" style="fill:var(--muted)">fastest</text></g>
      <g data-step="2-3"><rect x="54" y="60" width="31" height="140" fill="var(--muted)" opacity=".8"/></g>
      <g data-step="=2"><text x="320" y="24" text-anchor="middle" font-size="13">25 mm tile: sits in the still zone</text></g>
      <g data-step="=3"><path d="M600 110 H96" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/><path d="M96 150 H600" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/><text x="320" y="24" text-anchor="middle" font-size="13" style="fill:var(--bad)">200 Hz passes through and bounces back</text></g>
      <g data-step="4"><rect x="180" y="50" width="126" height="160" rx="6" fill="var(--good)" opacity=".75"/><text x="243" y="250" text-anchor="middle" font-size="12" style="fill:var(--good)">100 mm panel</text><text x="117" y="250" text-anchor="middle" font-size="12" style="fill:var(--muted)">100 mm gap</text></g>
      <g data-step="=4"><text x="320" y="24" text-anchor="middle" font-size="13" style="fill:var(--good)">thick panel on a gap: in moving air</text></g>
      <g data-step="5"><path d="M600 130 H312" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/><g fill="var(--warn)">${Array.from({ length: 6 }, (_, i) => `<circle cx="${200 + i * 18}" cy="${110 + (i % 3) * 20}" r="3" class="rl-rise ${i % 2 ? 'd2' : ''}" style="--dy:-26px"/>`).join('')}</g>
        <text x="320" y="24" text-anchor="middle" font-size="13">air rubs on fibres → a little heat</text></g>
    </svg>`,
    steps: [
      ['Air is still at the wall', 'A wall cannot move, so air touching it cannot move either. The swing grows as you go out, peaking a quarter wavelength away.'],
      ['A thin tile sits in still air', 'A 25 mm tile on the wall occupies the zone where 200 Hz air hardly moves at all.'],
      ['So the low note ignores it', 'With nothing to rub against, the 200 Hz wave goes through the tile, reflects off the wall and comes back out.'],
      ['Go thicker and add a gap', 'A 100 mm panel spaced 100 mm off the wall reaches 200 mm into the room, where the air is moving.'],
      ['Friction does the work', 'Air pushing back and forth through the fibres loses energy as a tiny amount of heat. Less comes back, and the boxiness fades.'],
    ],
    why: [
      'Absorption is friction. No air movement means no friction, however good the material is.',
      'The gap is free performance: moving the same panel away from the wall puts it in faster air without buying more material.',
      'Too dense is as bad as too thin. If air cannot get in, the panel reflects; if it flows through too easily, nothing rubs.',
    ],
    uses: [
      ['🎙️', 'Voice and podcast rooms', 'Use 100 mm panels on a 50–100 mm gap behind and beside the microphone instead of thin tiles.'],
      ['🎚️', 'Mix rooms', 'First-reflection panels should be at least 100 mm thick so they treat the whole voice range, not only the hiss.'],
      ['🏢', 'Offices and classrooms', 'Ceiling tiles hung 200 mm or more below the slab absorb far lower than the same tiles glued on.'],
    ],
    tryit: [
      'Hold a thick folded duvet flat against a wall and talk towards it from 30 cm. Listen to your voice.',
      'Now hold the duvet a hand-span away from the wall and talk again. The low part of your voice should sound drier.',
      'Work out 343 ÷ frequency ÷ 4 for the lowest note you want to treat. That is the reach you need.',
    ],
    slip: ['Judging an absorber by how soft it feels or by one headline number.', 'Check its thickness and mounting gap against the lowest frequency you need, and read the 125–250 Hz values.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('diffusion', {
    title: 'the back wall that slapped',
    plain: 'A flat hard wall sends sound back as one strong copy, like a mirror. A diffuser breaks that copy into many weak ones going in different directions and at slightly different times, so the room stays lively without a distinct echo.',
    where: 'A 6 m long control room with a bare plaster rear wall',
    story: `<p>Kabir heard a faint “tick-tick” on every snare hit and a hollow colour on vocals. The rear wall was 3.2 m behind his chair, flat and hard. Each sound passed him, hit the wall and came back as a clear second copy.</p>
      <p>Covering the whole wall with absorber fixed the tick but made the small room feel dead and tiring. He kept deep absorption in the corners and fitted a stepped timber diffuser across the middle of the wall. The second copy became a soft wash, and the room sounded bigger than it is.</p>`,
    numbers: [['Extra path via rear wall', '2 × 3.2 = 6.4 m'], ['Delay of the copy', '6.4 ÷ 343 ≈ 19 ms'], ['Deepest well for 500 Hz (7 wells)', '4 × 0.686 ÷ 14 ≈ 0.20 m'], ['Closest seat (3 wavelengths)', '3 × 0.686 ≈ 2.1 m']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Plan of a room: a flat rear wall returns one strong reflection, a diffuser returns many weak ones">
      <rect x="40" y="36" width="560" height="196" fill="none" stroke="var(--text)" stroke-width="5"/>
      ${spk(86, 134)}<circle cx="300" cy="134" r="12" fill="var(--c2)"/><text x="300" y="166" text-anchor="middle" font-size="12" style="fill:var(--muted)">listener</text>
      <text x="320" y="254" text-anchor="middle" font-size="12" style="fill:var(--muted)">plan view — rear wall on the right</text>
      <g data-step="1"><path d="M104 134 H286" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1"><text x="200" y="118" text-anchor="middle" font-size="13">direct sound</text></g>
      <g data-step="2-3"><path d="M314 126 H592" stroke="var(--accent)" stroke-width="2" fill="none" class="rl-flow"/><path d="M592 142 H316" stroke="var(--bad)" stroke-width="4" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="450" y="112" text-anchor="middle" font-size="13">passes, hits the flat wall…</text></g>
      <g data-step="=3"><text x="450" y="112" text-anchor="middle" font-size="13" style="fill:var(--bad)">one strong copy, 19 ms late</text><circle cx="300" cy="134" r="22" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow"/></g>
      <g data-step="4">${[18, 34, 10, 26, 10, 34, 18, 34, 10, 26].map((d, i) => `<rect x="${596 - d}" y="${70 + i * 13}" width="${d}" height="11" fill="var(--c4)"/>`).join('')}
        <rect x="574" y="40" width="22" height="26" fill="var(--muted)"/><rect x="574" y="202" width="22" height="26" fill="var(--muted)"/></g>
      <g data-step="=4"><text x="450" y="60" text-anchor="middle" font-size="13" style="fill:var(--good)">wells of different depths</text><text x="520" y="222" text-anchor="end" font-size="12" style="fill:var(--muted)">corners: bass traps</text></g>
      <g data-step="5">${[[-70, 0], [-40, 1], [-12, 2], [14, 3], [42, 1], [72, 2]].map(([dy, k]) => `<path d="M562 134 L${340 + k * 14} ${134 + dy}" stroke="var(--good)" stroke-width="1.8" fill="none" class="rl-flow ${k % 2 ? 'd2' : ''}"/>`).join('')}
        <text x="430" y="60" text-anchor="middle" font-size="13" style="fill:var(--good)">many weak copies, spread in time</text></g>
    </svg>`,
    steps: [
      ['Direct sound arrives', 'The speaker’s sound reaches Kabir first. This is what he wants to judge.'],
      ['It carries on to the rear wall', 'The same wavefront passes his head and travels another 3.2 m to the flat plaster wall.'],
      ['A mirror copy returns', 'The flat wall reflects it whole. A strong copy arrives 19 ms later: late enough to colour the sound and blur the stereo image.'],
      ['Break up the surface', 'A diffuser has wells of different depths. Sound entering a deep well comes out later than sound from a shallow one. The corners keep their bass traps.'],
      ['One echo becomes a wash', 'The returning energy fans out sideways and is smeared over a few milliseconds. Nothing is thrown away, but nothing arrives as a clear copy.'],
    ],
    why: [
      'The ear notices a single strong late copy far more than the same energy split into many small pieces.',
      'Different depths mean different delays; neighbouring wells then send waves out of step, which bends the reflection away from the mirror direction.',
      'The depth sets the lowest note it can scatter and the well width sets the highest, so a real diffuser only works over a few octaves.',
    ],
    uses: [
      ['🎚️', 'Rear wall of a mix room', 'Use it only if you sit at least about three wavelengths of its lowest frequency away: around 2 m for a 500 Hz design.'],
      ['🎻', 'Live rooms for strings and drums', 'Diffusing panels on walls and ceiling keep the room bright and even without flutter between parallel walls.'],
      ['🎭', 'Small halls and worship spaces', 'Diffusing a concave or flat rear wall removes the slap heard on stage while keeping the hall’s liveness.'],
    ],
    tryit: [
      'Stand 3 m from a bare wall, face away from it and clap. Listen for the “tick” coming back.',
      'Do the same in front of a full, untidy bookshelf. The tick should turn into a softer blur.',
      'Measure from your listening seat to the wall behind you and work out 2 × distance ÷ 343 to get the delay of your own rear-wall copy.',
    ],
    slip: ['Putting a diffuser right behind your head in a tiny room.', 'Closer than about 2 m you hear the separate wells. In very small rooms use deep absorption behind the seat instead.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('isolation', {
    title: 'the neighbour who still hears the guitar amp',
    plain: 'Stopping sound from getting through a wall is a different job from making a room sound nice inside. Soft foam tidies the sound in the room. Only weight, a separated second wall and sealed gaps keep it from the neighbour.',
    where: 'A terraced house: music room on one side of a single brick wall, a child’s bedroom on the other',
    story: `<p>Sam plays guitar through an amp at about 100 dB. The neighbours complained, so he covered the shared wall with foam. His room sounded drier. Next door, nothing changed: they could still follow every song.</p>
      <p>A builder then put up a second wall on Sam’s side: a timber frame standing 50 mm clear of the brick, filled with mineral wool, faced with two layers of heavy plasterboard and sealed all round the edge. Now the neighbours hear, at most, a faint thump on the loudest notes.</p>`,
    numbers: [['Amp level in the room', 'about 100 dB'], ['Single brick wall blocks', 'about 45 dB → 55 dB next door'], ['Foam on that wall', 'still about 55 dB next door'], ['Brick + separate lined wall', 'about 60 dB → 40 dB next door']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Section through a party wall: foam changes little, a separate second wall and seals reduce the sound passing">
      <line x1="30" y1="226" x2="610" y2="226" stroke="var(--line)" stroke-width="3"/>
      <rect x="330" y="40" width="30" height="186" fill="var(--c6)" opacity=".8"/><text x="345" y="248" text-anchor="middle" font-size="12" style="fill:var(--muted)">brick</text>
      <rect x="70" y="170" width="46" height="56" rx="5" fill="var(--text)"/><circle cx="93" cy="198" r="14" fill="var(--panel2)"/><text x="93" y="248" text-anchor="middle" font-size="12" style="fill:var(--muted)">amp 100 dB</text>
      <rect x="500" y="196" width="90" height="16" rx="6" fill="var(--c2)"/><rect x="500" y="212" width="8" height="14" fill="var(--c2)"/><rect x="582" y="212" width="8" height="14" fill="var(--c2)"/><text x="545" y="248" text-anchor="middle" font-size="12" style="fill:var(--muted)">bedroom</text>
      <g data-step="1"><path d="M120 190 H326" stroke="var(--accent)" stroke-width="5" fill="none" class="rl-flow"/></g>
      <g data-step="1-3"><path d="M364 190 H500" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1"><text x="225" y="170" text-anchor="middle" font-size="13">hits the wall</text><text x="432" y="170" text-anchor="middle" font-size="13" style="fill:var(--bad)">55 dB gets through</text><rect x="330" y="40" width="30" height="186" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-shake"/></g>
      <g data-step="2-3"><rect x="314" y="60" width="16" height="150" fill="var(--muted)" opacity=".8"/></g>
      <g data-step="=2"><text x="225" y="50" text-anchor="middle" font-size="13">foam: light and full of holes</text><text x="432" y="170" text-anchor="middle" font-size="13" style="fill:var(--bad)">still 55 dB</text></g>
      <g data-step="=3"><text x="225" y="50" text-anchor="middle" font-size="13">the brick is what moves…</text><text x="225" y="68" text-anchor="middle" font-size="13">and it re-radiates next door</text><rect x="330" y="40" width="30" height="186" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-shake"/></g>
      <g data-step="4"><rect x="240" y="40" width="14" height="186" fill="var(--text)"/><rect x="226" y="40" width="14" height="186" fill="var(--text)" opacity=".7"/><rect x="254" y="40" width="52" height="186" fill="var(--warn)" opacity=".45"/>
        <rect x="222" y="36" width="36" height="6" fill="var(--good)"/><rect x="222" y="224" width="36" height="6" fill="var(--good)"/></g>
      <g data-step="=4"><text x="130" y="50" text-anchor="middle" font-size="13" style="fill:var(--good)">2 boards + wool + 50 mm gap</text><text x="130" y="68" text-anchor="middle" font-size="13" style="fill:var(--good)">edges sealed, not touching</text></g>
      <g data-step="5"><path d="M364 190 H500" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow"/><text x="432" y="170" text-anchor="middle" font-size="13" style="fill:var(--good)">about 40 dB: a faint thump</text></g>
    </svg>`,
    steps: [
      ['Sound shakes the wall', 'Air pressure from the amp pushes the brick wall. The wall moves a tiny amount and pushes the air in the bedroom.'],
      ['Foam is added', 'Foam weighs almost nothing and air passes through it. It reduces echoes in Sam’s room but hardly changes how much the brick is pushed.'],
      ['The wall is still the path', 'What matters is how hard the wall is to move. A single 115 mm brick wall stops about 45 dB, so 55 dB arrives next door.'],
      ['Build a second, separate wall', 'A heavy lined frame that does not touch the brick must be shaken first; then the air gap with wool; then the brick. Sealed edges stop leaks.'],
      ['Much less gets through', 'The pair of walls stops around 60 dB. The amp arrives at about 40 dB: under most background noise except for low notes.'],
    ],
    why: [
      'Heavy things are hard to shake. Doubling a wall’s weight buys about 6 dB; a second wall separated by air buys far more than the same weight added to the first.',
      'The air gap acts like a soft spring between the two walls, and the wool stops that gap from ringing.',
      'Sound behaves like water: a gap of a few millimetres round a wall or socket leaks more than the whole wall lets through.',
    ],
    uses: [
      ['🎸', 'Practice rooms in shared buildings', 'Budget for a room-within-a-room on the shared walls and ceiling; treat echo inside as a separate, later job.'],
      ['🛏️', 'A quiet bedroom beside a noisy road', 'Add a second window pane with a wide gap and seal the frame before thinking about wall panels.'],
      ['🏢', 'Meeting rooms', 'Take the wall right up to the slab above and seal it; a partition that stops at the false ceiling leaks over the top.'],
    ],
    tryit: [
      'Play music on a phone in one room, close the door and listen from the next room. Note what you hear: mostly bass.',
      'Hang a thick duvet over the door on the music side and listen again. Very little changes.',
      'Now run your hand round the door edges and under it to feel for gaps. Lay a rolled towel along the bottom and listen once more.',
    ],
    slip: ['Buying acoustic foam or egg boxes to “soundproof” a room.', 'Use them for echo only. For neighbours you need weight, a separated layer and airtight sealing.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('flanking', {
    title: 'the expensive wall with the hollow door',
    plain: 'Sound always takes the easiest way out. A very good wall with an ordinary door, a gap or a shared air duct in it performs almost like the weak part alone.',
    where: 'A vocal booth built off a corridor in a small studio',
    story: `<p>Nisha paid for a double wall rated at 55 dB around her vocal booth. With the door shut she could still hear people talking in the corridor on her recordings. The builder had fitted a light hollow-core door with a 5 mm gap underneath.</p>
      <p>She did the sum: the door is only a fifth of the wall area, but each square metre of it lets through a thousand times more sound than the wall, so in total about 250 times more comes through the door. Swapping it for a heavy solid door with seals all round and a drop seal at the bottom recovered most of what she had paid for.</p>`,
    numbers: [['Wall: 8 m² at 55 dB', 'lets through 8 × 0.0000032'], ['Hollow door: 2 m² at 25 dB', 'lets through 2 × 0.0032'], ['Wall + hollow door together', 'about 32 dB'], ['Wall + sealed 40 dB door', 'about 46 dB']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Elevation of a wall with a door: most sound passes through the door and its gap">
      <rect x="60" y="40" width="520" height="180" fill="var(--c6)" opacity=".35" stroke="var(--text)" stroke-width="3"/>
      <text x="200" y="70" text-anchor="middle" font-size="13">double wall: 55 dB</text>
      <rect x="420" y="80" width="90" height="140" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><circle cx="436" cy="154" r="4" fill="var(--text)"/>
      <line x1="40" y1="222" x2="600" y2="222" stroke="var(--line)" stroke-width="3"/>
      <g data-step="1">${[0, 1, 2].map((i) => `<circle cx="${150 + i * 90}" cy="${130 + (i % 2) * 30}" r="5" fill="var(--accent)" class="rl-pulse ${i ? 'd' + (i + 1) : ''}"/>`).join('')}</g>
      <g data-step="=1"><text x="230" y="200" text-anchor="middle" font-size="13">the wall leaks a trickle</text></g>
      <g data-step="2-3"><circle cx="465" cy="140" r="26" fill="var(--bad)" opacity=".5" class="rl-pulse"/></g>
      <g data-step="=2"><text x="465" y="70" text-anchor="middle" font-size="13" style="fill:var(--bad)">hollow door: 25 dB</text></g>
      <g data-step="3-4"><rect x="420" y="214" width="90" height="6" fill="var(--bad)" class="rl-pulse"/></g>
      <g data-step="=3"><text x="465" y="246" text-anchor="middle" font-size="13" style="fill:var(--bad)">5 mm gap: an open leak</text><text x="230" y="200" text-anchor="middle" font-size="13">result: about 32 dB overall</text></g>
      <g data-step="=4"><rect x="250" y="44" width="60" height="16" fill="var(--warn)" class="rl-pulse"/><text x="280" y="34" text-anchor="middle" font-size="13" style="fill:var(--warn)">shared air duct: another way round</text></g>
      <g data-step="5"><rect x="420" y="80" width="90" height="140" fill="var(--good)" opacity=".5" stroke="var(--good)" stroke-width="4"/><rect x="420" y="214" width="90" height="6" fill="var(--good)"/>
        <text x="465" y="70" text-anchor="middle" font-size="13" style="fill:var(--good)">solid door + seals: 40 dB</text><text x="230" y="200" text-anchor="middle" font-size="13" style="fill:var(--good)">result: about 46 dB overall</text></g>
    </svg>`,
    steps: [
      ['A strong wall', 'The double wall lets through only about three millionths of the sound that hits it.'],
      ['A weak door in it', 'A hollow door at 25 dB lets through about three thousandths: a thousand times more per square metre.'],
      ['Add the leaks together', 'Total sound through = wall share + door share + gap. The door and its gap dominate, and the whole partition performs at about 32 dB.'],
      ['Check the other ways round', 'Sound also travels through shared ducts, over ceilings, through back-to-back sockets and along the floor. Each is a path to close.'],
      ['Fix the weakest part first', 'A solid, sealed 40 dB door lifts the whole partition to about 46 dB. Thickening the wall would have changed nothing.'],
    ],
    why: [
      'Decibels hide how big the differences are: 30 dB weaker means a thousand times more sound energy gets through.',
      'The total is set by the sum of the leaks, so the largest leak sets the result, however small its area.',
      'Structure carries sound too: a wall that stops airborne sound can be bypassed by a floor or ceiling that both rooms share.',
    ],
    uses: [
      ['🚪', 'Studio and booth doors', 'Match the door to the wall: solid core, compressed seals on three sides and a drop seal or threshold at the bottom.'],
      ['🌬️', 'Air-conditioning between rooms', 'Give each room its own lined duct branch with bends, never one straight shared duct.'],
      ['🔌', 'Sockets and pipes', 'Stagger sockets so they are not back to back, and seal every cable and pipe hole with flexible sealant.'],
    ],
    tryit: [
      'At night, switch off the light in one room and leave the next room lit. Every line of light you see round the door is a sound leak.',
      'Play pink noise or radio hiss in one room, and in the other move your ear along the door edges, sockets and skirting to find the loudest spot.',
      'Seal that one spot temporarily with tape or a towel and listen to how much the level drops.',
    ],
    slip: ['Adding more layers to a wall when the door, window or duct is the weak point.', 'List every path, estimate the weakest, and spend on that one first.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('integrated', {
    title: 'the room that could only spare 175 mm per wall',
    plain: 'A studio wall has two jobs: keep sound from getting out, and stop sound bouncing around inside. Built separately they eat a lot of floor space. Built cleverly, the frame of the isolating wall can also hold the absorber.',
    where: 'A 3.0 m × 4.0 m bedroom being turned into a production room',
    story: `<p>Farah’s room was already small. The usual recipe is an inner wall for isolation and then absorber panels in front of it. That added up to 275 mm on each wall and would have left a room barely 2.4 m wide.</p>
      <p>Her designer turned the inner wall inside out. The heavy boards went on the outer side of the frame, facing the old wall, and the frame’s 100 mm depth was left open to the room, filled with mineral wool and covered with stretched fabric. Same isolation, same absorber depth, 100 mm less per wall.</p>`,
    numbers: [['Usual build-up', '50 gap + 100 frame + 25 boards + 100 absorber = 275 mm'], ['Inside-out build-up', '50 gap + 25 boards + 100 frame with wool = 175 mm'], ['Floor left, usual', '2.45 × 3.45 ≈ 8.5 m²'], ['Floor left, inside-out', '2.65 × 3.65 ≈ 9.7 m²']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Two wall sections compared: a conventional inner wall plus absorber, and an inside-out wall that combines them">
      <text x="170" y="28" text-anchor="middle" font-size="13">usual: two separate layers</text><text x="480" y="28" text-anchor="middle" font-size="13">inside-out: one shared depth</text>
      <rect x="30" y="44" width="30" height="170" fill="var(--c6)" opacity=".8"/><rect x="340" y="44" width="30" height="170" fill="var(--c6)" opacity=".8"/>
      <text x="45" y="232" text-anchor="middle" font-size="11" style="fill:var(--muted)">old wall</text><text x="355" y="232" text-anchor="middle" font-size="11" style="fill:var(--muted)">old wall</text>
      <g data-step="1"><rect x="78" y="44" width="56" height="170" fill="var(--warn)" opacity=".4"/><rect x="134" y="44" width="16" height="170" fill="var(--text)"/><text x="114" y="232" text-anchor="middle" font-size="11" style="fill:var(--muted)">frame + boards</text></g>
      <g data-step="2"><rect x="150" y="44" width="56" height="170" fill="var(--good)" opacity=".5"/><text x="186" y="248" text-anchor="middle" font-size="11" style="fill:var(--muted)">absorber</text><path d="M30 256 H206" stroke="var(--bad)" stroke-width="3"/><text x="260" y="260" text-anchor="middle" font-size="12" style="fill:var(--bad)">275 mm</text></g>
      <g data-step="3"><rect x="388" y="44" width="16" height="170" fill="var(--text)"/><text x="396" y="248" text-anchor="middle" font-size="11" style="fill:var(--muted)">boards</text></g>
      <g data-step="4"><rect x="404" y="44" width="56" height="170" fill="var(--good)" opacity=".5"/>${[0, 1, 2].map((i) => `<rect x="404" y="${44 + i * 82}" width="56" height="6" fill="var(--c1)"/>`).join('')}
        <line x1="462" y1="44" x2="462" y2="214" stroke="var(--accent2)" stroke-width="3"/><text x="486" y="232" text-anchor="middle" font-size="11" style="fill:var(--muted)">frame + wool + fabric</text></g>
      <g data-step="5"><path d="M600 110 H470" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/><path d="M600 150 H470" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow d2"/>
        <g fill="var(--warn)">${Array.from({ length: 5 }, (_, i) => `<circle cx="${412 + i * 10}" cy="${100 + (i % 3) * 26}" r="3" class="rl-rise ${i % 2 ? 'd2' : ''}" style="--dy:-22px"/>`).join('')}</g>
        <path d="M340 256 H462" stroke="var(--good)" stroke-width="3"/><text x="520" y="260" text-anchor="middle" font-size="12" style="fill:var(--good)">175 mm</text><rect x="388" y="44" width="16" height="170" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-shake"/></g>
    </svg>`,
    steps: [
      ['The usual inner wall', 'A frame stands clear of the old wall with heavy boards on the room side. This heavy, separate layer does the isolating.'],
      ['Then absorber on top', 'Panels are added in front for the room’s sound. The two layers together take 275 mm off every wall.'],
      ['Flip the boards outward', 'Put the same heavy boards on the far side of the frame, facing the old wall across the air gap. The isolation is unchanged.'],
      ['Fill the open frame', 'The frame’s 100 mm depth now faces the room. Pack it with mineral wool and stretch fabric across the studs.'],
      ['One depth does both jobs', 'Sound from the room enters the wool and is absorbed; the heavy boards behind still block it. The wall is 175 mm thick instead of 275.'],
    ],
    why: [
      'Isolation needs weight separated by air; it does not care which side of the frame the weight is on.',
      'Absorption needs depth of soft material facing the room; the empty space between studs is exactly that depth going spare.',
      'In a small room every 100 mm returned to the floor also moves the walls’ bass problems lower and makes a better listening triangle possible.',
    ],
    uses: [
      ['🏠', 'Bedroom and garage studios', 'Use inside-out walls and ceiling to gain around a square metre of floor in a 12 m² room.'],
      ['🎬', 'Home cinemas', 'Hide absorbers, bass traps and speakers behind one continuous fabric skin so the room looks like plain architecture.'],
      ['🎙️', 'Vocal booths', 'In a booth barely 1.5 m wide, the wall depth is the only place deep enough to hold useful absorption.'],
    ],
    tryit: [
      'Sketch your room to scale and draw a 275 mm band inside every wall. Measure the floor that is left.',
      'Redraw it with a 175 mm band and compare the two areas.',
      'Mark on the sketch where a door, window and sockets would pass through, because each needs its own sealed detail.',
    ],
    slip: ['Leaving the wool-filled frame as the only layer and forgetting the heavy sealed boards behind it.', 'Fabric and wool absorb but do not isolate. The airtight, heavy board layer must be continuous behind them.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('vibration', {
    title: 'the rooftop fan above the vocal booth',
    plain: 'A machine sitting on springs passes very little shaking into the building, but only if the springs are soft enough for that machine’s speed. Springs that are too stiff can make the shaking worse.',
    where: 'A small studio on the top floor, with an air-conditioning fan on the roof slab directly above',
    story: `<p>A low hum at 15 Hz and its overtones crept into every quiet vocal take. It came from a roof fan turning at 900 revolutions a minute, bolted to the slab on thin rubber pads the installer called “anti-vibration”.</p>
      <p>Leela, the engineer, checked the pads: they squashed only 2 mm under the fan’s weight. That is too stiff for a 15 Hz machine. The fan was remounted on steel springs that compress 25 mm, with flexible connections on the duct and cable. The hum on the recordings disappeared.</p>`,
    numbers: [['Fan speed', '900 rpm ÷ 60 = 15 Hz'], ['Rubber pad, 2 mm squash', 'bounces at 15.8 ÷ √2 ≈ 11 Hz'], ['11 Hz mount under 15 Hz fan', 'passes about 125 %: worse'], ['Spring, 25 mm squash', '15.8 ÷ √25 ≈ 3 Hz → passes about 5 %']],
    svg: `<svg viewBox="0 0 640 270" aria-label="A roof fan on stiff pads shakes the slab; on soft springs it does not">
      <rect x="40" y="150" width="560" height="22" fill="var(--text)" opacity=".85"/><text x="70" y="166" font-size="12" style="fill:var(--panel)">roof slab</text>
      <rect x="430" y="172" width="150" height="80" fill="none" stroke="var(--line)" stroke-width="2"/><text x="505" y="216" text-anchor="middle" font-size="12" style="fill:var(--muted)">vocal booth</text>
      <g class="rl-shake"><rect x="230" y="60" width="150" height="64" rx="8" fill="var(--c2)"/><g class="rl-spin"><path d="M305 72 V112 M285 92 H325" stroke="var(--panel)" stroke-width="5"/></g></g>
      <text x="305" y="50" text-anchor="middle" font-size="13">fan: 900 rpm = 15 pushes a second</text>
      <g data-step="1-3"><rect x="244" y="124" width="34" height="26" fill="var(--muted)"/><rect x="332" y="124" width="34" height="26" fill="var(--muted)"/></g>
      <g data-step="=1"><text x="150" y="138" text-anchor="middle" font-size="13">thin rubber pads</text></g>
      <g data-step="2-3"><path d="M300 176 Q380 196 430 196" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/><rect x="40" y="150" width="560" height="22" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-shake"/></g>
      <g data-step="=2"><text x="150" y="200" text-anchor="middle" font-size="13" style="fill:var(--bad)">slab shakes, booth hums</text></g>
      <g data-step="=3"><text x="150" y="200" text-anchor="middle" font-size="13" style="fill:var(--bad)">pad bounces at 11 Hz:</text><text x="150" y="218" text-anchor="middle" font-size="13" style="fill:var(--bad)">too close to 15 Hz</text></g>
      <g data-step="4">${[250, 338].map((x) => `<path d="M${x} 124 l12 4 l-24 5 l24 5 l-24 5 l24 5 l-12 2" stroke="var(--good)" stroke-width="3" fill="none" class="rl-bob"/>`).join('')}</g>
      <g data-step="=4"><text x="150" y="138" text-anchor="middle" font-size="13" style="fill:var(--good)">springs: 25 mm squash, 3 Hz</text></g>
      <g data-step="5"><path d="M300 176 Q380 196 430 196" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow"/><text x="150" y="200" text-anchor="middle" font-size="13" style="fill:var(--good)">only about 5 % reaches the slab</text><path d="M380 84 q30 -20 60 0" stroke="var(--c3)" stroke-width="3" fill="none"/><text x="486" y="80" font-size="12" style="fill:var(--c3)">flexible duct</text></g>
    </svg>`,
    steps: [
      ['A machine pushes rhythmically', 'The fan is never perfectly balanced, so it pushes down on its supports 15 times a second.'],
      ['Stiff pads pass it on', 'Thin rubber squashes only 2 mm. The slab gets the full push and carries it through the building.'],
      ['Worse: near-resonance', 'Any mount has its own bounce rate. This one bounces at 11 Hz, close to 15 Hz, so it amplifies the push by about a quarter.'],
      ['Fit soft springs', 'Springs that compress 25 mm under the fan bounce at about 3 Hz: five times slower than the machine pushes.'],
      ['The fan floats', 'The springs cannot keep up with 15 pushes a second, so only about 5 % of the force reaches the slab. Flexible duct and cable stop the push sneaking round.'],
    ],
    why: [
      'A soft mount is like a slack lead on a dog: quick tugs at one end do not reach the other. A stiff mount is a tight lead.',
      'How far a mount squashes under the load tells you its bounce rate directly: more squash means slower bounce and better isolation.',
      'The mount must bounce at one third of the machine’s speed or less. Between about 0.7 and 1.4 times, it makes things worse.',
    ],
    uses: [
      ['🌀', 'Fans, compressors and pumps', 'Slow machines need steel springs with 20–25 mm of squash; thin rubber only suits fast machines above about 50 Hz.'],
      ['🔊', 'Subwoofers and speakers on floors', 'Use pads or a platform chosen for the speaker’s weight so they actually compress, not rigid spikes on a timber floor.'],
      ['🧺', 'Washing machines over a bedroom', 'A heavy slab under the machine on soft pads lowers the bounce rate; pads alone under a light machine may not.'],
    ],
    tryit: [
      'Hang a bunch of keys on a long rubber band. Move your hand up and down slowly: the keys follow.',
      'Now move your hand quickly in small strokes: the keys stay almost still. That is isolation.',
      'Find the speed where the keys swing wildly. That is the resonance to stay well above.',
    ],
    slip: ['Trusting any pad labelled “anti-vibration”.', 'Check how far it compresses under your machine’s weight and compare the resulting bounce rate with the machine’s speed.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('floating', {
    title: 'the drum room above a shop',
    plain: 'A floating floor is a heavy slab resting on springs or rubber pads, touching nothing else. The drums shake the slab, but the soft supports pass very little of that shaking into the building.',
    where: 'A 4 m × 5 m drum room on the first floor, over a tailor’s shop',
    story: `<p>Downstairs, the tailor could feel every kick-drum hit through his ceiling. Thick carpet under the kit made no difference, because the thump was going through the building structure, not the air.</p>
      <p>The studio cast a 100 mm concrete slab on rubber pads, with a soft strip all round its edge so it never touches the walls. The pads were chosen so the loaded slab sinks 2.5 mm onto them. The tailor now hears the drums only faintly, and feels nothing.</p>`,
    numbers: [['Slab weight', '20 m² × 240 kg/m² = 4800 kg'], ['Plus kit, amps and people', 'about 5400 kg in all'], ['Pads at 150 kg each', '5400 ÷ 150 = 36 pads'], ['Bounce rate at 2.5 mm squash', '15.8 ÷ √2.5 ≈ 10 Hz']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Section through a floating concrete floor on pads with a perimeter gap, above a shop">
      <rect x="40" y="186" width="560" height="20" fill="var(--text)" opacity=".85"/><text x="320" y="201" text-anchor="middle" font-size="12" style="fill:var(--panel)">building floor</text>
      <rect x="40" y="40" width="16" height="146" fill="var(--text)" opacity=".85"/><rect x="584" y="40" width="16" height="146" fill="var(--text)" opacity=".85"/>
      <rect x="250" y="216" width="140" height="40" fill="none" stroke="var(--line)" stroke-width="2"/><text x="320" y="240" text-anchor="middle" font-size="12" style="fill:var(--muted)">shop below</text>
      <g data-step="1-2"><circle cx="300" cy="150" r="26" fill="var(--c1)"/><circle cx="300" cy="150" r="17" fill="var(--panel2)" class="rl-pulse"/></g>
      <g data-step="=1"><text x="300" y="100" text-anchor="middle" font-size="13">kick drum on the building floor</text></g>
      <g data-step="=2"><path d="M300 208 V236" stroke="var(--bad)" stroke-width="4" fill="none" class="rl-flow"/><path d="M280 196 H60 V60" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/><path d="M320 196 H590 V60" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/><text x="300" y="100" text-anchor="middle" font-size="13" style="fill:var(--bad)">thump travels through the structure</text></g>
      <g data-step="3">${Array.from({ length: 8 }, (_, i) => `<rect x="${84 + i * 66}" y="172" width="22" height="14" rx="3" fill="var(--good)" class="${i % 2 ? 'seal-squish' : ''}"/>`).join('')}
        <rect x="66" y="148" width="508" height="24" fill="var(--muted)"/><text x="320" y="165" text-anchor="middle" font-size="12" style="fill:var(--panel)">100 mm concrete, 240 kg/m²</text>
        <circle cx="300" cy="122" r="26" fill="var(--c1)"/><circle cx="300" cy="122" r="17" fill="var(--panel2)" class="rl-pulse"/></g>
      <g data-step="=3"><text x="300" y="80" text-anchor="middle" font-size="13" style="fill:var(--good)">heavy slab on 36 rubber pads</text></g>
      <g data-step="4"><rect x="56" y="148" width="10" height="24" fill="var(--warn)" class="rl-pulse"/><rect x="574" y="148" width="10" height="24" fill="var(--warn)" class="rl-pulse"/></g>
      <g data-step="=4"><text x="300" y="80" text-anchor="middle" font-size="13" style="fill:var(--warn)">soft edge strip: touches no wall</text></g>
      <g data-step="5"><path d="M300 208 V236" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow"/><text x="300" y="80" text-anchor="middle" font-size="13" style="fill:var(--good)">slab bounces at 10 Hz; kick is 50 Hz</text></g>
    </svg>`,
    steps: [
      ['The problem', 'A kick drum pushes the floor around 50 times a second. On a normal floor that push goes straight into the building.'],
      ['Structure carries it far', 'Concrete and brick carry vibration with little loss. It spreads into walls and the ceiling below, which then act like loudspeakers.'],
      ['Float a heavy slab', 'A 100 mm concrete slab is cast on rubber pads. It weighs nearly five tonnes, so the drums can barely move it.'],
      ['Keep the edge free', 'A soft strip runs round the whole edge. One nail, pipe or lump of mortar bridging to the wall would undo most of the work.'],
      ['Slow bounce, fast drums', 'On its pads the slab bounces at about 10 Hz. The 50 Hz kick is five times faster, so in theory only about 4 % of the push gets through.'],
    ],
    why: [
      'The slab on pads is a weight on a spring. It only passes on shaking that is slower than, or close to, its own bounce rate.',
      'Weight helps twice: a heavy slab moves less when hit, and it squashes the pads further, which lowers the bounce rate.',
      'Any rigid link to the building is a short circuit, just as one wire bridging a switch makes the switch useless.',
    ],
    uses: [
      ['🥁', 'Drum and rehearsal rooms upstairs', 'Float the floor first; then build the room’s walls on the floating slab so the whole room is separated.'],
      ['🎬', 'Cinemas and studios beside trains or plant', 'It works in both directions: a floated room is also protected from rumble coming in through the ground.'],
      ['🏋️', 'Gyms above offices', 'Dropped weights need a thick floated slab or deep rubber tiles designed for the weight, not thin mats.'],
    ],
    tryit: [
      'Put a phone on a table, set it to vibrate and call it. Listen to the table buzz.',
      'Now rest the phone on a folded towel on the same table and call again. The buzz mostly vanishes.',
      'Finally push a pencil between the phone and the table across the towel. The buzz returns: that pencil is a bridge.',
    ],
    slip: ['Laying carpet, foam or thin rubber under a drum kit and expecting the thump to stop.', 'Low-frequency impact needs real mass on properly loaded soft supports, with no rigid contact at the edges.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('impact-structure', {
    title: 'the footsteps from the flat upstairs',
    plain: 'A voice has to shake the air, and then the air has to shake a heavy floor, which is hard. A heel hits the floor directly, so the floor itself becomes the sound source. That is why you hear footsteps from upstairs but not conversation.',
    where: 'Two flats, one above the other, with tiles laid straight onto a 150 mm concrete slab',
    story: `<p>Anita, downstairs, never hears her upstairs neighbours talk or play the television. But she hears every step, every chair dragged, every dropped spoon, even from rooms that are not above her bedroom.</p>
      <p>When the upstairs flat was refurbished, the owner agreed to lift the tiles and lay a new 50 mm screed on a soft resilient mat, turned up at the walls. The footsteps dropped from clearly annoying to barely noticeable. Nothing was done to Anita’s ceiling at all.</p>`,
    numbers: [['Screed weight', 'about 100 kg per m²'], ['Mat stiffness', '10 MN per m³'], ['Bounce rate of screed on mat', '160 × √(10 ÷ 100) ≈ 50 Hz'], ['Improvement at 500 Hz', '30 × log(500 ÷ 50) ≈ 30 dB']],
    svg: `<svg viewBox="0 0 640 280" aria-label="A footstep on a bare slab radiates below and along walls; a floating screed on a soft mat stops most of it">
      <rect x="40" y="110" width="560" height="26" fill="var(--text)" opacity=".85"/><text x="110" y="132" font-size="11" style="fill:var(--panel)">150 mm concrete slab</text>
      <rect x="40" y="30" width="14" height="230" fill="var(--text)" opacity=".85"/><rect x="586" y="30" width="14" height="230" fill="var(--text)" opacity=".85"/>
      ${person(480, 190, 'var(--c2)')}<text x="480" y="266" text-anchor="middle" font-size="12" style="fill:var(--muted)">flat below</text>
      <g data-step="1-3"><g class="rl-bob"><rect x="286" y="76" width="16" height="30" rx="5" fill="var(--c1)"/><rect x="282" y="100" width="34" height="10" rx="4" fill="var(--c1)"/></g></g>
      <g data-step="=1"><text x="300" y="56" text-anchor="middle" font-size="13">a heel strikes the hard floor</text></g>
      <g data-step="2-3"><path d="M300 116 H60" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/><path d="M300 116 H580" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="300" y="56" text-anchor="middle" font-size="13" style="fill:var(--bad)">the shock runs through the slab</text></g>
      <g data-step="=3">${[120, 220, 320, 420].map((x, i) => `<path d="M${x} 140 V180" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow ${i % 2 ? 'd2' : ''}"/>`).join('')}<path d="M56 150 H100" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/>
        <text x="270" y="204" text-anchor="middle" font-size="13" style="fill:var(--bad)">whole ceiling and walls radiate</text></g>
      <g data-step="4"><rect x="56" y="100" width="528" height="10" fill="var(--good)"/><rect x="56" y="78" width="8" height="32" fill="var(--good)"/><rect x="576" y="78" width="8" height="32" fill="var(--good)"/><rect x="64" y="78" width="512" height="22" fill="var(--muted)"/>
        <g class="rl-bob"><rect x="286" y="44" width="16" height="30" rx="5" fill="var(--c1)"/><rect x="282" y="68" width="34" height="10" rx="4" fill="var(--c1)"/></g></g>
      <g data-step="=4"><text x="300" y="24" text-anchor="middle" font-size="13" style="fill:var(--good)">new screed on a soft mat, edges turned up</text></g>
      <g data-step="5"><path d="M300 140 V180" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow"/><text x="270" y="204" text-anchor="middle" font-size="13" style="fill:var(--good)">about 30 dB less at 500 Hz</text></g>
    </svg>`,
    steps: [
      ['A direct hit', 'The heel delivers a sharp knock straight into the tile and slab. No air is involved at this stage.'],
      ['The slab carries it', 'Concrete passes the shock along as a ripple. It reaches the far side of the flat almost undiminished.'],
      ['Everything it touches radiates', 'The slab’s underside and the walls joined to it shake the air downstairs. That is why footsteps seem to come from everywhere.'],
      ['Separate the walking surface', 'A new screed sits on a soft mat that also turns up the walls. The top layer is now a heavy plate on a spring.'],
      ['Shocks above its bounce rate are blocked', 'The screed on its mat bounces at about 50 Hz. Faster content is cut steeply: about 30 dB at 500 Hz, where heel clicks and scrapes live.'],
    ],
    why: [
      'Stopping the knock at the top is far easier than chasing it once it is in the structure, because then it comes out of every surface.',
      'A soft covering lengthens the hit, like landing on a mattress instead of concrete: the same push spread over more time has less high-frequency content.',
      'A hung ceiling below only treats one of the escape routes. The walls still carry the rest down.',
    ],
    uses: [
      ['🏢', 'Flats and hotels', 'Specify a floating screed or a floating timber floor on a resilient layer under any hard floor finish.'],
      ['🥁', 'Kick drums, amps and subwoofers', 'Stand them on a heavy platform resting on pads sized for the weight, so the platform bounces well below 20 Hz.'],
      ['🚿', 'Pipes, stairs and machines', 'Hang pipes on rubber-lined clips and sit machines on proper mounts; a rigid clip is a footstep that never stops.'],
    ],
    tryit: [
      'Tap a table top with a fingernail while a friend presses an ear to the far end. It is loud.',
      'Lay a folded tea-towel on the table and tap through it. The click nearly disappears, though the dull thud remains.',
      'Ask someone to walk upstairs in shoes, then in socks. The difference you hear is the top surface doing its work.',
    ],
    slip: ['Adding insulation or a suspended ceiling downstairs as the first move.', 'Treat the floor that is being hit: a soft or floating layer on top is the most effective and usually the cheapest fix.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('criteria', {
    title: 'the vocal take with the air-conditioner in it',
    plain: 'Every room has a background noise level, mostly from air-conditioning. For recording it must be far lower than for ordinary rooms, and the way to get there is slow-moving air in big, lined ducts with the noisy machine kept outside.',
    where: 'A 2 m × 2 m vocal booth with a wall-mounted split air-conditioner',
    story: `<p>Rohan recorded a whispered verse. On playback, once the vocal was compressed, a steady “shhh” rose up behind every line. He had stopped noticing the air-conditioner months ago, but the microphone had not.</p>
      <p>Switching it off solved the hiss and made the booth unbearable within ten minutes. The lasting fix was to move the machine out of the booth and feed the air through a large duct lined with absorber, with two bends and a big open grille. Same amount of air, moving five times slower, and the booth dropped to near silence.</p>`,
    numbers: [['Split unit in the booth', 'about 42 dB(A): fine for an office'], ['Target for a vocal booth', 'about 20–25 dB(A)'], ['Air through a 150 mm round duct', '0.1 m³/s ÷ 0.018 m² ≈ 5.7 m/s'], ['Same air, 300 × 300 mm duct', '0.1 ÷ 0.09 ≈ 1.1 m/s']],
    svg: `<svg viewBox="0 0 640 270" aria-label="A booth with a noisy wall unit, then with a remote unit feeding slow air through a lined duct">
      <rect x="330" y="70" width="250" height="160" fill="none" stroke="var(--text)" stroke-width="5"/><text x="455" y="250" text-anchor="middle" font-size="12" style="fill:var(--muted)">vocal booth</text>
      <line x1="470" y1="130" x2="470" y2="226" stroke="var(--text)" stroke-width="3"/><rect x="460" y="112" width="20" height="30" rx="8" fill="var(--c2)"/>
      <g data-step="1-2"><rect x="360" y="80" width="90" height="26" rx="5" fill="var(--muted)"/><g fill="none" stroke="var(--bad)" stroke-width="2.5">${[0, 1, 2].map((i) => `<path d="M${375 + i * 26} 110 q8 14 0 28" class="rl-flow ${i ? 'd' + (i + 1) : ''}"/>`).join('')}</g></g>
      <g data-step="=1"><text x="170" y="100" text-anchor="middle" font-size="13">fan and fast air inside the booth</text><text x="170" y="120" text-anchor="middle" font-size="13" style="fill:var(--bad)">42 dB(A) of hiss</text></g>
      <g data-step="=2"><rect x="100" y="150" width="140" height="14" rx="4" fill="var(--line)"/><rect x="100" y="150" width="96" height="14" rx="4" fill="var(--c2)"/><rect x="100" y="176" width="140" height="14" rx="4" fill="var(--line)"/><rect x="100" y="176" width="74" height="14" rx="4" fill="var(--bad)" class="rl-pulse"/>
        <text x="94" y="162" text-anchor="end" font-size="12">whisper</text><text x="94" y="188" text-anchor="end" font-size="12">hiss</text><text x="170" y="216" text-anchor="middle" font-size="13">only 13 dB apart: audible</text></g>
      <g data-step="3"><rect x="50" y="34" width="70" height="44" rx="6" fill="var(--muted)"/><g class="rl-spin"><path d="M85 44 V68 M73 56 H97" stroke="var(--panel)" stroke-width="4"/></g></g>
      <g data-step="=3"><text x="190" y="110" text-anchor="middle" font-size="13">machine moved outside the booth</text></g>
      <g data-step="4"><path d="M120 44 H250 V20 H400 V70" fill="none" stroke="var(--good)" stroke-width="26" opacity=".35"/><path d="M120 44 H250 V20 H400 V66" fill="none" stroke="var(--accent2)" stroke-width="3" class="rl-flow slow"/></g>
      <g data-step="=4"><text x="190" y="110" text-anchor="middle" font-size="13" style="fill:var(--good)">big lined duct with bends</text><text x="190" y="130" text-anchor="middle" font-size="13" style="fill:var(--good)">air at 1.1 m/s, not 5.7</text></g>
      <g data-step="5"><rect x="370" y="74" width="60" height="8" fill="var(--good)"/><text x="190" y="110" text-anchor="middle" font-size="13" style="fill:var(--good)">booth at about 22 dB(A)</text><text x="190" y="130" text-anchor="middle" font-size="13">whisper now 33 dB above the noise</text></g>
    </svg>`,
    steps: [
      ['A unit that seems quiet', 'A wall unit at 42 dB(A) is normal for an office. You stop hearing it within minutes.'],
      ['The microphone hears it', 'A whisper reaches the microphone at about 55 dB. The hiss is only 13 dB lower, and compression lifts it further.'],
      ['Move the machine out', 'Fan and compressor noise should start outside the room, where walls can keep it away.'],
      ['Slow the air down', 'Hiss comes from air rushing through small openings. A duct five times bigger in area carries the same air five times slower; lining and bends absorb fan noise on the way.'],
      ['Check against a target', 'The booth now measures about 22 dB(A). The whisper sits 33 dB above the noise, and the hiss stays buried.'],
    ],
    why: [
      'Air noise rises very steeply with speed, so halving the speed is worth far more than any silencer bolted on afterwards.',
      'Every bend lined with absorber forces the sound to bounce off soft surfaces while the air simply flows round.',
      'A noise target written down before building (so many dB, or a criterion curve) gives the air-conditioning installer something to design to and you something to measure.',
    ],
    uses: [
      ['🎙️', 'Booths and control rooms', 'Aim near 20–25 dB(A) and keep air speed at the grille under about 1.5 m/s.'],
      ['🏫', 'Classrooms and meeting rooms', 'About 35 dB(A) keeps speech clear without anyone raising their voice.'],
      ['🛏️', 'Bedrooms and home cinemas', 'About 30 dB(A) or less; choose the largest, slowest fan setting that keeps the room comfortable.'],
    ],
    tryit: [
      'Install a sound-level-meter app, sit still and read the level in your room with everything running.',
      'Switch off the air-conditioner, fridge and computer fans one at a time. Note how many dB each one was adding.',
      'Hold a strip of tissue at the supply grille. If it flaps hard, the air is moving fast enough to hiss.',
    ],
    slip: ['Choosing an air-conditioner by cooling power and price only.', 'Ask for its noise level, put the machine outside the quiet room, and size ducts and grilles for slow air.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('control-room', {
    title: 'the mix that leaned left in the car',
    plain: 'A control room has one job: let you hear what is really in the recording. That needs the left and right halves of the room to be mirror images, the speakers and your head to form an equal-sided triangle, and the first bounces off nearby surfaces to be tamed.',
    where: 'A 3.5 m × 4.5 m home mix room with the desk pushed into a corner',
    story: `<p>Imran’s mixes sounded balanced at his desk, yet in the car the vocal sat to the left and the bass was uneven. His desk was in a corner: the left speaker had a wall right beside it and the right speaker had open room.</p>
      <p>He turned the set-up to face the short wall, centred it, put his head 1.7 m from the front wall, and set speakers and head 1.2 m apart on all three sides. A friend slid a mirror along each side wall; where Imran could see a speaker in it, a 100 mm panel went up. A third panel hangs over the desk. The next mix translated.</p>`,
    numbers: [['Seat from front wall', '0.38 × 4.5 ≈ 1.7 m'], ['Triangle sides', '1.2 m each, 60° apart'], ['Side-wall bounce: extra path', 'about 0.9 m → 0.9 ÷ 343 ≈ 2.6 ms late'], ['First cancelled note', '343 ÷ (2 × 0.9) ≈ 190 Hz']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Plan of a symmetrical control room with the listening triangle and first reflection panels">
      <rect x="170" y="24" width="300" height="236" fill="none" stroke="var(--text)" stroke-width="5"/>
      <line x1="320" y1="24" x2="320" y2="260" stroke="var(--line)" stroke-dasharray="5 6"/>
      <text x="88" y="140" text-anchor="middle" font-size="12" style="fill:var(--muted)">plan view</text><text x="88" y="156" text-anchor="middle" font-size="12" style="fill:var(--muted)">front wall at top</text>
      <g data-step="=1"><rect x="186" y="40" width="20" height="28" fill="var(--bad)"/><rect x="262" y="40" width="20" height="28" fill="var(--bad)"/><circle cx="234" cy="110" r="10" fill="var(--bad)"/>
        <text x="560" y="130" text-anchor="middle" font-size="13" style="fill:var(--bad)">desk in the corner:</text><text x="560" y="148" text-anchor="middle" font-size="13" style="fill:var(--bad)">left ≠ right</text></g>
      <g data-step="2"><rect x="270" y="46" width="20" height="28" fill="var(--text)" transform="rotate(-25 280 60)"/><rect x="350" y="46" width="20" height="28" fill="var(--text)" transform="rotate(25 360 60)"/><circle cx="320" cy="132" r="11" fill="var(--c2)"/></g>
      <g data-step="=2"><text x="560" y="130" text-anchor="middle" font-size="13">centre on the short wall</text><text x="560" y="148" text-anchor="middle" font-size="13">head at 38 % of length</text></g>
      <g data-step="3"><path d="M280 64 L360 64 L320 132 Z" fill="none" stroke="var(--accent)" stroke-width="2.5"/></g>
      <g data-step="=3"><text x="560" y="130" text-anchor="middle" font-size="13" style="fill:var(--accent)">equal triangle, 1.2 m sides</text></g>
      <g data-step="=4"><path d="M280 64 L172 96 L310 130" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/><path d="M360 64 L468 96 L330 130" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/>
        <text x="560" y="130" text-anchor="middle" font-size="13" style="fill:var(--bad)">side bounce: 2.6 ms late</text><text x="560" y="148" text-anchor="middle" font-size="13" style="fill:var(--bad)">cancels around 190 Hz</text></g>
      <g data-step="5"><rect x="174" y="72" width="12" height="52" fill="var(--good)"/><rect x="454" y="72" width="12" height="52" fill="var(--good)"/><rect x="286" y="80" width="68" height="40" fill="var(--good)" opacity=".3" stroke="var(--good)" stroke-dasharray="4 4"/>
        <path d="M290 66 L324 122" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/><path d="M350 66 L318 122" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow d2"/>
        <text x="560" y="130" text-anchor="middle" font-size="13" style="fill:var(--good)">panels at the mirror points</text><text x="560" y="148" text-anchor="middle" font-size="13" style="fill:var(--good)">and a cloud overhead</text></g>
    </svg>`,
    steps: [
      ['An uneven room', 'With the desk in a corner, the left speaker is boosted by its nearby wall and the right is not. The balance you hear is the room’s, not the mix’s.'],
      ['Make left and right mirror images', 'Face the short wall, sit on the centre line, and put your head about 38 % of the room length from the front wall.'],
      ['Form an equal triangle', 'Each speaker and your head are the same distance apart, with the speakers aimed at your ears. A centred voice now appears exactly in the middle.'],
      ['Find the first bounces', 'Sound also reaches you via the side walls, 2.6 ms late. That copy cancels some notes and blurs where instruments seem to be.'],
      ['Absorb at the mirror points', 'Thick panels where a mirror on the wall shows you a speaker, plus one over the desk, leave the direct sound clear.'],
    ],
    why: [
      'Your brain places a sound by comparing what the two ears get. If the room treats left and right differently, every placement is skewed.',
      'A copy arriving within a few milliseconds is not heard as an echo; it is heard as a change in tone, so you end up “fixing” things that are not wrong.',
      'The 38 % seat is a starting point that avoids the worst quiet spots of the front-to-back bass modes; small moves from there are normal.',
    ],
    uses: [
      ['🎚️', 'Setting up any mix position', 'Symmetry and the triangle cost nothing and matter more than which speakers you own.'],
      ['🎧', 'Checking a room you are visiting', 'Play a mono voice: if it does not sit dead centre and stay there as pitch changes, the room is uneven.'],
      ['📺', 'Home cinema and hi-fi', 'The same rules place the main pair and the seat; first-reflection panels sharpen dialogue.'],
    ],
    tryit: [
      'Measure your room, then mark the centre line and a point 38 % of the way back from the front wall. Sit there.',
      'Use a tape measure to make speaker-to-speaker and speaker-to-ear distances equal.',
      'Have a friend slide a hand mirror along each side wall at ear height. Mark every spot where you can see a speaker from your seat.',
    ],
    slip: ['Buying better monitors to fix mixes that do not translate.', 'Fix position, symmetry and first reflections first. Good speakers in a lopsided set-up still mislead.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('flat', {
    title: 'flat on the box, lumpy at the chair',
    plain: 'A speaker can be perfectly even on its own and still sound very uneven where you sit, because the room adds its own peaks and holes. You get close to “flat” by positioning and treatment first, and only then by a little gentle equalising.',
    where: 'A bedroom studio with a pair of small monitors on stands',
    story: `<p>Tara’s monitors were sold as flat within 2 dB. Her first measurement at the chair showed a 10 dB hump at 43 Hz and a deep hole at 107 Hz. She assumed the speakers were faulty.</p>
      <p>They were not. The hump was a room mode, and the hole came from the speakers standing 0.8 m in front of the wall, so the sound going backwards returned out of step. She pushed the speakers back to 15 cm from the wall with a thick panel behind each, added corner traps, and finally cut 43 Hz by 6 dB with an equaliser. The curve now stays within about 5 dB.</p>`,
    numbers: [['Speaker 0.8 m from wall', 'hole at 343 ÷ (4 × 0.8) ≈ 107 Hz'], ['Speaker 0.15 m from wall', 'hole moves to 343 ÷ 0.6 ≈ 570 Hz'], ['Room mode (4 m length)', '343 ÷ 8 ≈ 43 Hz, +10 dB'], ['Equaliser used', 'one cut of 6 dB at 43 Hz; no boosts']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Frequency response at the listening seat: flat speaker, then a room peak and hole, then repaired">
      <line x1="60" y1="220" x2="600" y2="220" stroke="var(--line)" stroke-width="2"/><line x1="60" y1="40" x2="60" y2="220" stroke="var(--line)" stroke-width="2"/>
      <line x1="60" y1="130" x2="600" y2="130" stroke="var(--line)" stroke-dasharray="3 6"/>
      ${[['30', 80], ['60', 170], ['125', 262], ['250', 352], ['500', 442], ['1k', 532]].map(([t, x]) => `<text x="${x}" y="238" text-anchor="middle" font-size="12" style="fill:var(--muted)">${t}</text>`).join('')}
      <text x="330" y="258" text-anchor="middle" font-size="12" style="fill:var(--muted)">frequency (Hz)</text><text x="52" y="134" text-anchor="end" font-size="12" style="fill:var(--muted)">0</text><text x="52" y="74" text-anchor="end" font-size="12" style="fill:var(--muted)">+10</text><text x="52" y="194" text-anchor="end" font-size="12" style="fill:var(--muted)">−10</text>
      <g data-step="=1"><path d="M70 136 C120 128 200 131 600 130" stroke="var(--c2)" stroke-width="3" fill="none"/><text x="340" y="60" text-anchor="middle" font-size="13">the speaker alone: within 2 dB</text></g>
      <g data-step="2-3"><path d="M70 136 C100 132 112 72 126 70 C142 72 150 128 170 132 C215 132 230 150 242 206 C252 150 266 126 300 122 C380 140 460 124 600 130" stroke="var(--bad)" stroke-width="3" fill="none"/></g>
      <g data-step="=2"><text x="340" y="60" text-anchor="middle" font-size="13" style="fill:var(--bad)">the same speaker at the chair</text><circle cx="126" cy="70" r="12" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-grow"/><circle cx="242" cy="204" r="12" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-grow d2"/></g>
      <g data-step="=3"><text x="126" y="56" text-anchor="middle" font-size="12">room mode, 43 Hz</text><text x="300" y="206" font-size="12">wall bounce, 107 Hz</text></g>
      <g data-step="=4"><path d="M70 136 C100 132 112 82 126 80 C142 82 150 128 170 132 C240 134 300 124 380 128 C440 132 470 140 482 150 C494 138 520 130 600 130" stroke="var(--warn)" stroke-width="3" fill="none"/>
        <text x="340" y="60" text-anchor="middle" font-size="13" style="fill:var(--warn)">speakers back, panels and traps in</text><path d="M246 200 V150" stroke="var(--warn)" stroke-width="2.5" class="rl-flow"/></g>
      <g data-step="5"><path d="M70 136 C100 133 112 112 126 110 C142 112 150 128 170 132 C240 134 300 124 380 128 C440 132 470 140 482 148 C494 138 520 130 600 130" stroke="var(--good)" stroke-width="3" fill="none"/>
        <rect x="60" y="100" width="540" height="60" fill="var(--good)" opacity=".1"/><text x="340" y="60" text-anchor="middle" font-size="13" style="fill:var(--good)">a small cut at 43 Hz: within ±5 dB</text><path d="M126 84 V106" stroke="var(--good)" stroke-width="2.5" class="rl-flow"/></g>
    </svg>`,
    steps: [
      ['Flat on its own', 'Measured with no room around it, the speaker is even to within 2 dB. That is what the data sheet shows.'],
      ['Not flat at the chair', 'In the room the same speaker measures with a 10 dB hump at 43 Hz and a deep hole at 107 Hz.'],
      ['Name each cause', 'The hump is the room’s front-to-back mode. The hole is sound bouncing off the wall behind the speaker and returning half a cycle late.'],
      ['Fix by position and treatment', 'Close to the wall, the hole moves up to about 570 Hz where a thick panel can absorb it. Corner traps shorten and lower the 43 Hz hump.'],
      ['Equalise last and lightly', 'A single 6 dB cut trims what remains of the hump. The hole was never boosted: you cannot fill a cancellation with power.'],
    ],
    why: [
      'A hole caused by two waves cancelling stays a hole however much power you add, because both waves grow together. Only moving things changes it.',
      'A peak from a mode rings on in time as well as being loud. Trapping fixes both; an equaliser cut only lowers the level.',
      'Perfectly flat at one spot is neither possible nor needed. Smooth, with no sharp features and a tidy decay, is what makes mixes translate.',
    ],
    uses: [
      ['📐', 'Placing monitors', 'Either very close to the front wall (under about 20 cm) or well over a metre away; the in-between distances put the hole in the bass.'],
      ['🎛️', 'Using room-correction software', 'Let it cut broad peaks below about 300 Hz and switch off any boost over a few dB.'],
      ['🔍', 'Reading a measurement', 'Look at it with light smoothing, then ask of every feature: is it a mode, a boundary bounce, or the speaker?'],
    ],
    tryit: [
      'Measure from the front of your speaker to the wall behind it and work out 343 ÷ (4 × distance). That is where your wall-bounce hole sits.',
      'Play a slow sine sweep from 30 to 300 Hz at low volume and note which notes jump out and which vanish at your seat.',
      'Move the speakers 30 cm nearer the wall, repeat the sweep, and notice how the weak note has moved higher.',
    ],
    slip: ['Boosting a hole in the response with an equaliser.', 'Move the speaker or the seat, or treat the surface causing it. Use the equaliser only to trim peaks.'],
  });
})();
