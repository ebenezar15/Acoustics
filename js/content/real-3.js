/* "In real life" blocks — group 3: rooms, halls, measurement, modelling, audio essentials, method,
   workbook, and the first audio-track lessons. See js/real-kit.js for the data shape. */
(function () {
  const REAL = window.REAL; if (!REAL) return;
  const t = (x, y, s, o = '') => `<text x="${x}" y="${y}" text-anchor="middle" font-size="13" ${o}>${s}</text>`;
  const person = (x, y, c) => `<circle cx="${x}" cy="${y}" r="11" fill="var(${c})"/><rect x="${x - 9}" y="${y + 12}" width="18" height="34" rx="7" fill="var(${c})"/>`;
  const box = (x, y, w, h, label, c = '--panel') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="var(${c})" stroke="var(--line)" stroke-width="1.5"/>${t(x + w / 2, y + h / 2 + 5, label)}`;

  /* ---------------------------------------------------------------- rooms */
  REAL('rooms', {
    title: 'the rehearsal room over the shop',
    plain: 'A room for loud music needs soft, thick surfaces to soak up sound, or every hit keeps bouncing around and the band turns into a blur. How much soft surface you need can be worked out from the size of the room.',
    where: 'A 4 × 5 m rehearsal room above a shop',
    story: `<p>Ravi’s band rehearses in a bare room with plastered walls and a tiled floor. After ten minutes nobody can hear the vocals, so everyone turns up, and it gets worse. A clap rings for about a second.</p>
      <p>He works out how much absorption the room has and how much it needs for a tail of 0.4 s, then builds 100 mm mineral-wool panels for the walls and a cloud over the drum kit. The band now plays quieter and hears more.</p>`,
    numbers: [['Room volume', '4 × 5 × 2.7 = 54 m³'], ['Absorption now (tail 1.1 s)', '0.161 × 54 ÷ 1.1 ≈ 8 m²'], ['Needed for 0.4 s', '0.161 × 54 ÷ 0.4 ≈ 22 m²'], ['Panels to add', 'about 14 m² of 100 mm wool']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Section of a rehearsal room before and after adding absorbers">
      <rect x="60" y="40" width="520" height="180" fill="var(--panel)" stroke="var(--text)" stroke-width="3"/>
      ${person(180, 160, '--c1')}<circle cx="230" cy="190" r="16" fill="none" stroke="var(--c1)" stroke-width="3"/>
      ${person(460, 160, '--c2')}
      ${t(205, 238, 'drums')}${t(460, 238, 'singer')}
      <g data-step="1-2"><path d="M240 180 L400 44 L560 150 L420 216 L100 120" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/>
        <path d="M230 170 L70 100 L300 44 L570 200" stroke="var(--bad)" stroke-width="2" fill="none" class="rl-flow slow"/></g>
      <g data-step="=1">${t(320, 28, 'hard walls: every hit keeps bouncing')}</g>
      <g data-step="=2">${t(320, 28, 'the clap rings for 1.1 s')}</g>
      <g data-step="3"><rect x="64" y="70" width="14" height="120" fill="var(--c4)"/><rect x="562" y="70" width="14" height="120" fill="var(--c4)"/>
        <rect x="150" y="56" width="170" height="12" fill="var(--c4)" class="rl-bob"/></g>
      <g data-step="=3">${t(320, 28, '14 m² of thick panels and a cloud')}</g>
      <g data-step="4"><path d="M240 180 L235 70" stroke="var(--good)" stroke-width="2.5" fill="none" class="rl-flow"/>
        <path d="M250 178 L560 130" stroke="var(--good)" stroke-width="2.5" fill="none" class="rl-flow"/>
        <path d="M440 170 L260 176" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow rev"/></g>
      <g data-step="=4">${t(320, 28, 'sound hits a panel once and stops')}</g>
      <g data-step="=5">${t(320, 28, 'tail 0.4 s: the vocal is clear')}</g>
    </svg>`,
    steps: [
      ['A bare room', 'Plaster and tile reflect almost everything, so each drum hit crosses the room dozens of times.'],
      ['The tail piles up', 'New notes land on top of old ones. Loudness climbs and words disappear.'],
      ['Add thick absorbers', 'Panels at the side walls and a cloud above the kit give the room about 14 m² more absorption.'],
      ['Sound dies after one bounce', 'What hits a panel is mostly gone. The direct sound from each player now stands out.'],
      ['The result', 'The tail drops to about 0.4 s. The band can play quieter and still hear each other.'],
    ],
    why: [
      'Loudness in a room builds up like water in a bath with a small drain. Absorbers are a bigger drain.',
      'Thin foam only removes treble. Thick panels (100 mm or more) also take the low mids, where the mud lives.',
      'A cloud over the drums catches cymbal spray before it reaches the vocal microphone.',
    ],
    uses: [
      ['🥁', 'Rehearsal room', 'Aim for a tail of 0.3–0.5 s; start with panels covering about a quarter of the walls and a cloud over the kit.'],
      ['🎙️', 'Vocal booth', 'A very small room needs absorption on nearly every surface, 100 mm thick, or it sounds like a box.'],
      ['🎬', 'Home cinema', 'Treat the first-reflection points and the rear wall so dialogue stays clear at any seat.'],
    ],
    tryit: [
      'Measure your room and work out the volume in cubic metres.',
      'Record a clap on your phone and time the tail, then compute absorption as 0.161 × volume ÷ time.',
      'Work out the absorption needed for 0.4 s and subtract: that is roughly the square metres of thick panel to add.',
    ],
    slip: ['Covering the walls with thin foam tiles and wondering why it still booms.', 'Use fewer but thicker panels (100 mm with an air gap) and add corner bass traps.'],
  });

  /* ---------------------------------------------------------------- halls */
  REAL('halls', {
    title: 'the hall that suits the choir but not the speaker',
    plain: 'A big hall keeps sound alive for a long time. That makes music rich, but speech needs the sound to die quickly. Reflections that arrive straight after the direct sound help; the ones that arrive late blur it.',
    where: 'A 200-seat school assembly hall',
    story: `<p>At rehearsal in the empty hall the choir sounds glorious, but the headteacher’s announcements are hard to follow at the back. On concert night, with every seat taken, speech is suddenly much clearer.</p>
      <p>The audience is the reason: 200 people are a large soft surface. The music teacher also notices that the low ceiling panel over the stage throws sound to the back rows only a few milliseconds after the direct sound, which makes voices seem louder there.</p>`,
    numbers: [['Hall volume', '1500 m³'], ['Empty: tail 2.4 s', 'absorption ≈ 0.161 × 1500 ÷ 2.4 ≈ 100 m²'], ['200 people add', '200 × 0.45 ≈ 90 m²'], ['Full hall', '0.161 × 1500 ÷ 190 ≈ 1.3 s'], ['Ceiling reflection arrives', '4 m extra path ≈ 12 ms later']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Long section of a hall showing direct sound, an early ceiling reflection and late reverberation">
      <path d="M40 220 L40 90 L140 50 L600 50 L600 220 Z" fill="var(--panel)" stroke="var(--text)" stroke-width="3"/>
      <rect x="40" y="190" width="120" height="30" fill="var(--panel2)" stroke="var(--line)"/>
      ${person(100, 142, '--c1')}${t(100, 244, 'stage')}
      <path d="M150 70 L330 58" stroke="var(--accent)" stroke-width="6"/>
      <g data-step="5">${Array.from({ length: 12 }, (_, i) => `<circle cx="${230 + i * 30}" cy="204" r="9" fill="var(--c4)"/>`).join('')}</g>
      <g data-step="1-4"><circle cx="550" cy="204" r="9" fill="var(--c2)"/></g>
      ${t(550, 244, 'back row')}
      <g data-step="1"><path d="M112 150 L545 200" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${t(380, 32, 'direct sound: 15 m')}</g>
      <g data-step="2"><path d="M112 146 L240 64 L545 196" stroke="var(--good)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=2">${t(380, 32, 'ceiling bounce: 12 ms later, helps', 'fill="var(--good)"')}</g>
      <g data-step="3-4"><path d="M112 146 L596 80 L60 120 L596 180 L300 54" stroke="var(--bad)" stroke-width="2" fill="none" class="rl-flow slow"/></g>
      <g data-step="=3">${t(380, 32, 'late bounces: the 2.4 s tail', 'fill="var(--bad)"')}</g>
      <g data-step="=4">${t(380, 32, 'words run into each other')}</g>
      <g data-step="=5">${t(380, 32, 'full house: tail falls to 1.3 s', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['Direct sound', 'The voice travels 15 m straight to the back row and arrives first, but weak.'],
      ['Early reflection', 'A panel over the stage sends a copy that arrives 12 ms later. The ear adds it to the direct sound, so the voice seems louder and clearer.'],
      ['Late reflections', 'Sound that has crossed the hall many times arrives for more than two seconds.'],
      ['Speech blurs', 'Each syllable is still ringing when the next one starts.'],
      ['The audience absorbs', 'People and clothes nearly double the absorption, and the tail drops to about 1.3 s.'],
    ],
    why: [
      'The ear fuses sound arriving within about 50 ms into one louder sound. After that it starts to hear a separate smear.',
      'Reverberation time grows with volume and shrinks with absorption, so tall halls ring longer.',
      'Upholstered seats absorb almost as much as people, so the hall sounds similar full or empty.',
    ],
    uses: [
      ['🎻', 'Music hall', 'Aim for about 1.8–2.2 s for orchestral music and keep side walls close enough to give strong early reflections.'],
      ['🗣️', 'Lecture or drama', 'Aim for about 0.8–1.2 s and add a reflector over the speaker.'],
      ['⛪', 'Multi-use hall', 'Use heavy curtains or movable panels to switch between a long and a short tail.'],
    ],
    tryit: [
      'In any large hall, clap on stage while a friend listens at the back, empty and then with people in.',
      'Estimate the extra path of the ceiling reflection with a tape measure and divide by 343 to get the delay.',
      'Count how many seats are upholstered. Each is worth roughly 0.4–0.5 m² of absorption.',
    ],
    slip: ['Judging a hall’s acoustics when it is empty.', 'Check it at the occupancy it will really have, or choose seats that absorb like people.'],
  });

  /* ---------------------------------------------------------------- measurement */
  REAL('measurement', {
    title: 'the desk reflection hiding in the measurement',
    plain: 'A measurement plays a known test sound and records what reaches the microphone. Comparing the two shows every reflection as a separate arrival in time, and shows what those reflections do to the tone.',
    where: 'A bedroom mixing desk',
    story: `<p>Kiran’s mixes sound thin in the car. She puts a measurement microphone where her head goes, plays a sweep from one speaker and looks at the result. There is a deep notch near 500 Hz.</p>
      <p>The time view shows why: a second arrival one millisecond after the first. A one-millisecond delay means 34 cm of extra path, which is exactly the bounce off her desk. A thick mat on the desk and tilting the speakers shrinks the notch.</p>`,
    numbers: [['Extra path via the desk', '0.34 m'], ['Delay', '0.34 ÷ 343 ≈ 1 ms'], ['First notch', '1 ÷ (2 × 0.001 s) = 500 Hz'], ['Next notches', '1500 Hz, 2500 Hz …']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Speaker, desk and microphone with direct and reflected paths, and the resulting graphs">
      <rect x="40" y="60" width="44" height="70" rx="6" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="62" cy="84" r="8" fill="var(--c1)"/><circle cx="62" cy="110" r="12" fill="var(--c1)"/>
      <rect x="90" y="150" width="170" height="10" fill="var(--muted)"/>${t(175, 180, 'desk')}
      <circle cx="290" cy="90" r="9" fill="var(--c2)"/><line x1="290" y1="99" x2="290" y2="150" stroke="var(--c2)" stroke-width="3"/>${t(290, 180, 'mic')}
      <g data-step="1"><path d="M86 92 L280 90" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${t(180, 50, 'sweep: direct path')}</g>
      <g data-step="2"><path d="M86 104 L180 150 L282 94" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=2">${t(180, 50, 'desk bounce: 34 cm longer', 'fill="var(--bad)"')}</g>
      <g data-step="3"><rect x="360" y="30" width="250" height="100" rx="8" fill="var(--panel)" stroke="var(--line)"/>
        <line x1="375" y1="115" x2="595" y2="115" stroke="var(--muted)"/>
        <line x1="400" y1="115" x2="400" y2="45" stroke="var(--accent)" stroke-width="4"/>
        <line x1="440" y1="115" x2="440" y2="70" stroke="var(--bad)" stroke-width="4" class="rl-pulse"/>
        <text x="485" y="62" font-size="12">time view:</text><text x="485" y="80" font-size="12">second arrival</text><text x="485" y="98" font-size="12">1 ms later</text></g>
      <g data-step="4"><rect x="360" y="145" width="250" height="110" rx="8" fill="var(--panel)" stroke="var(--line)"/>
        <path d="M375 190 Q420 186 450 190 Q468 192 474 236 Q480 192 500 188 Q540 184 556 222 Q562 186 595 188" stroke="var(--c3)" stroke-width="2.5" fill="none"/>
        <circle cx="474" cy="236" r="7" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-grow"/>
        <text x="380" y="166" font-size="12">tone view: notch at 500 Hz</text></g>
      <g data-step="5"><rect x="90" y="142" width="170" height="8" rx="4" fill="var(--c4)"/></g>
      <g data-step="=5">${t(180, 50, 'soft mat on the desk', 'fill="var(--good)"')}${t(180, 210, 'bounce weaker, notch shallower')}</g>
    </svg>`,
    steps: [
      ['Play a known sound', 'A sweep runs from low to high. The software knows exactly what was sent.'],
      ['Two paths reach the mic', 'One straight from the speaker, one off the desk that is 34 cm longer.'],
      ['The time view', 'The software turns the recording into an impulse response. Each arrival is a spike; the desk bounce sits 1 ms after the first.'],
      ['The tone view', 'At 500 Hz the late copy arrives exactly out of step and cancels. That is the notch.'],
      ['Fix and re-measure', 'Absorb or redirect the bounce and the notch fills in. Measuring again proves it.'],
    ],
    why: [
      'A delay in milliseconds converts straight to distance (34 cm per ms), so the time view tells you which surface is responsible.',
      'A copy delayed by half a wavelength cancels; that sets where the notches fall.',
      'Measuring before and after is the only way to know whether a change really helped.',
    ],
    uses: [
      ['🎚️', 'Mix position', 'Find first reflections within 5 ms of the direct sound and treat those surfaces first.'],
      ['🔊', 'Subwoofer placement', 'Move the sub half a metre at a time and keep the position with the smoothest response below 100 Hz.'],
      ['🏫', 'Classroom check', 'Measure the reverberation time and compare it with the target for speech (about 0.6 s).'],
    ],
    tryit: [
      'Measure the direct distance from one speaker to your ear, and the distance via the desk top. Subtract.',
      'Divide the difference by 343 to get the delay, then compute 1 ÷ (2 × delay) for the first notch frequency.',
      'Lay a folded blanket on the desk and listen to pink noise with and without it.',
    ],
    slip: ['Reaching for the equaliser to fill a notch caused by a reflection.', 'Boosting cannot fix a cancellation. Remove or weaken the reflection instead.'],
  });

  /* ---------------------------------------------------------------- modelling */
  REAL('modelling', {
    title: 'testing a community hall before it is built',
    plain: 'A room model lets you try a design on a computer before spending money. It treats each wall as a mirror to find reflections, then adds up how quickly the sound dies for the materials you choose.',
    where: 'A new 12 × 8 m community hall, still on paper',
    story: `<p>Meera, the architect, wants plain plastered walls and a hard ceiling. The acoustician builds a simple model and it predicts a tail of 1.6 seconds, too long for meetings and classes.</p>
      <p>They swap 40 m² of the ceiling for an absorbing tile in the model and the tail drops to under a second. The change costs little at drawing stage and would have been expensive after opening.</p>`,
    numbers: [['Volume', '12 × 8 × 4 = 384 m³'], ['Plaster design', 'absorption ≈ 39 m² → 1.6 s'], ['Add 40 m² tile (α 0.8)', '+32 m² → 71 m² total'], ['New prediction', '0.161 × 384 ÷ 71 ≈ 0.9 s']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Plan of a hall with a mirror-image source behind a wall and a decay graph">
      <rect x="60" y="70" width="300" height="150" fill="var(--panel)" stroke="var(--text)" stroke-width="3"/>
      <circle cx="120" cy="170" r="9" fill="var(--c1)"/>${t(120, 198, 'talker')}
      <circle cx="300" cy="150" r="9" fill="var(--c2)"/>${t(300, 178, 'listener')}
      <g data-step="1"><path d="M129 168 L291 151" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="2"><rect x="60" y="14" width="300" height="56" fill="none" stroke="var(--muted)" stroke-dasharray="5 5"/>
        <circle cx="120" cy="34" r="9" fill="none" stroke="var(--c1)" stroke-width="2" stroke-dasharray="4 3" class="rl-pulse"/>
        <path d="M128 40 L300 150" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3 4" fill="none"/></g>
      <g data-step="=2">${t(240, 30, 'mirror image of the talker')}</g>
      <g data-step="3"><path d="M124 162 L184 70 L296 144" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=3">${t(240, 30, 'gives the real bounce path', 'fill="var(--c3)"')}</g>
      <rect x="400" y="50" width="210" height="150" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <line x1="415" y1="185" x2="598" y2="185" stroke="var(--muted)"/><line x1="415" y1="62" x2="415" y2="185" stroke="var(--muted)"/>
      <g data-step="4"><path d="M415 70 L590 176" stroke="var(--bad)" stroke-width="3" fill="none"/></g>
      <g data-step="=4"><text x="430" y="226" font-size="13" fill="var(--bad)">plaster: dies in 1.6 s</text></g>
      <g data-step="5"><path d="M415 70 L515 180" stroke="var(--good)" stroke-width="3" fill="none"/>
        <rect x="110" y="96" width="200" height="50" rx="6" fill="var(--c4)" opacity=".3" class="rl-pulse"/></g>
      <g data-step="=5"><text x="430" y="226" font-size="13" fill="var(--good)">with tile: 0.9 s</text>${t(210, 244, 'shaded: absorbing tile overhead')}</g>
    </svg>`,
    steps: [
      ['Start with the direct path', 'The model draws the straight line from talker to listener.'],
      ['Mirror the source', 'Each wall acts like a mirror. A copy of the talker placed behind the wall shows where a reflection seems to come from.'],
      ['Draw the reflection', 'The line from the mirror copy to the listener crosses the wall at the bounce point. Repeat for every wall and for bounces of bounces.'],
      ['Add up the decay', 'Each bounce loses the fraction that the wall material absorbs. With plaster the energy takes 1.6 s to die.'],
      ['Change a material', 'Swap part of the ceiling for an absorbing tile and run it again: 0.9 s.'],
    ],
    why: [
      'At mid and high frequencies sound reflects off large flat walls much as light does off a mirror, so geometry works.',
      'The answer is only as good as the absorption figures you feed in, so treat it as a range, not a promise.',
      'Below roughly 200 Hz in small rooms the mirror idea breaks down and wave methods or room-mode sums are needed.',
    ],
    uses: [
      ['🏛️', 'New halls and classrooms', 'Compare two or three finish options for reverberation time before tender.'],
      ['🔈', 'Speaker coverage', 'Check that every seat gets direct sound within about 6 dB of the front rows.'],
      ['🎧', 'Client listening', 'Play a dry voice through the modelled room so a non-technical client can hear the options.'],
    ],
    tryit: [
      'Sketch your room in plan. Mark the speaker and your seat.',
      'Mirror the speaker across one side wall and draw a straight line to your seat. Where it crosses the wall is the reflection point.',
      'Hold a mirror flat on that wall at that spot: from your seat you should see the speaker in it.',
    ],
    slip: ['Trusting a model’s single number to one decimal place.', 'Quote a range, and calibrate the model against a measurement whenever a real room exists.'],
  });

  /* ---------------------------------------------------------------- audio */
  REAL('audio', {
    title: 'the podcast that was either hissy or crunchy',
    plain: 'Every piece of audio gear has a quiet floor of hiss and a loud ceiling where it distorts. Setting gain means placing your signal comfortably between the two, at every stage of the chain.',
    where: 'A two-person podcast at a kitchen table',
    story: `<p>Imran’s first episode is full of hiss, because he recorded at a very low level and turned it up afterwards, which turned the hiss up too. For the second episode he sets the gain high, and every laugh comes out crunchy.</p>
      <p>For the third he sets the preamp so normal speech peaks around −12 on the meter. Laughs reach about −4, nothing clips, and the hiss stays more than 50 dB below the voice.</p>`,
    numbers: [['Microphone output for speech', 'about 2 mV'], ['Preamp gain 40 dB', '× 100 → about 0.2 V'], ['Target peak on the meter', '−12 dBFS'], ['Room left before clipping', '12 dB'], ['Hiss below the voice', 'more than 50 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Signal chain from microphone to recorder with a level meter between noise floor and clipping">
      ${box(30, 150, 90, 50, 'mic')}${box(170, 150, 110, 50, 'preamp')}${box(330, 150, 120, 50, 'recorder')}
      <path d="M120 175 H170" stroke="var(--accent)" stroke-width="3" class="rl-flow"/><path d="M280 175 H330" stroke="var(--accent)" stroke-width="3" class="rl-flow"/>
      <rect x="520" y="30" width="46" height="200" rx="6" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <rect x="520" y="30" width="46" height="18" rx="6" fill="var(--bad)" opacity=".6"/><text x="575" y="44" font-size="12">clip</text>
      <rect x="520" y="200" width="46" height="30" fill="var(--muted)" opacity=".5"/><text x="575" y="220" font-size="12">hiss</text>
      <g data-step="=1"><rect x="528" y="170" width="30" height="58" fill="var(--warn)" class="rl-pulse"/>${t(300, 80, 'gain too low: voice sits near the hiss')}</g>
      <g data-step="=2"><rect x="528" y="34" width="30" height="194" fill="var(--bad)" class="rl-shake"/>${t(300, 80, 'gain too high: peaks hit the ceiling')}</g>
      <g data-step="3"><rect x="528" y="90" width="30" height="138" fill="var(--good)"/><line x1="512" y1="90" x2="574" y2="90" stroke="var(--text)" stroke-dasharray="4 3"/></g>
      <g data-step="=3">${t(300, 80, 'speech peaks at −12: room above and below')}</g>
      <g data-step="=4"><rect x="528" y="58" width="30" height="32" fill="var(--accent)" class="rl-pulse"/>${t(300, 80, 'a laugh uses the spare room, no clipping')}</g>
      <g data-step="=5">${t(300, 80, 'set gain once at the start of the chain')}<circle cx="225" cy="140" r="20" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/></g>
    </svg>`,
    steps: [
      ['Too low', 'The voice is only just above the hiss. Turning it up later raises both together.'],
      ['Too high', 'Loud moments run out of room. The tops of the wave are cut off and it sounds crunchy; this cannot be undone.'],
      ['Just right', 'Set the preamp so normal speech peaks around −12 dBFS.'],
      ['Headroom does its job', 'A sudden laugh is 8 dB louder and still fits under the ceiling.'],
      ['Set it at the first stage', 'Get the level right at the preamp. Later stages then need little or no extra gain, so they add little noise.'],
    ],
    why: [
      'Noise is added at every stage. A strong, clean signal early keeps it far below the programme.',
      'Digital clipping is a hard wall: there is nothing above 0 dBFS, so anything louder is simply flattened.',
      'With 24-bit recording the floor is so low that leaving 12 dB spare costs nothing.',
    ],
    uses: [
      ['🎙️', 'Voice recording', 'Speak at your loudest for ten seconds and set the gain so that peaks reach about −10 dBFS.'],
      ['🎸', 'Live mixing', 'Set each channel’s gain with the fader at zero so the faders work in their fine range.'],
      ['📹', 'Video sound', 'Turn off auto-gain on the camera; it pumps the room noise up in every pause.'],
    ],
    tryit: [
      'Record yourself on a phone app that shows a level meter, talking normally, then loudly.',
      'Find the input setting where loud speech peaks about three quarters of the way up.',
      'Record ten seconds of silence at that setting and listen on headphones: that is your noise floor.',
    ],
    slip: ['Recording as hot as possible “for quality”.', 'Leave about 12 dB of headroom. Clipped peaks are far worse than a slightly lower level.'],
  });

  /* ---------------------------------------------------------------- workflow */
  REAL('workflow', {
    title: 'the café nobody could talk in',
    plain: 'A good acoustic job follows the same loop every time: listen and measure, name the cause, set a target number, design to that number, then measure again to prove it.',
    where: 'An 80 m² café with a concrete ceiling',
    story: `<p>Customers at Leela’s café keep leaving reviews that say “lovely food, too loud”. Her first idea is to buy some foam tiles. Instead she follows the method: a clap test and a phone measurement give a tail of 1.5 s, and the cause is obvious, since every surface is hard.</p>
      <p>She sets a target of 0.7 s, works out the absorption to add, and hangs fabric-wrapped panels from the ceiling. The second measurement reads 0.75 s. People stop shouting, so the room is quieter still.</p>`,
    numbers: [['Volume', '80 m² × 3 m = 240 m³'], ['Measured tail', '1.5 s → absorption ≈ 26 m²'], ['Target 0.7 s', 'needs ≈ 55 m²'], ['To add', '29 m² → 37 m² of panel at α 0.8'], ['Measured after', '0.75 s']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Five-stage loop: measure, diagnose, target, design, verify">
      ${[['Measure', 70], ['Diagnose', 195], ['Target', 320], ['Design', 445], ['Verify', 570]].map(([l, x], i) => `<g data-step="${i + 1}"><circle cx="${x}" cy="80" r="34" fill="var(--panel)" stroke="var(--c${i + 1})" stroke-width="3"/>${t(x, 85, l)}</g>`).join('')}
      ${[132, 257, 382, 507].map((x, i) => `<g data-step="${i + 2}"><path d="M${x - 26} 80 H${x + 26}" stroke="var(--accent)" stroke-width="3" class="rl-flow"/></g>`).join('')}
      <g data-step="5"><path d="M570 118 Q570 190 320 190 Q70 190 70 118" stroke="var(--muted)" stroke-width="2" fill="none" class="rl-flow slow"/>${t(320, 210, 'not there yet? go round again', 'fill="var(--muted)"')}</g>
      <g data-step="=1">${t(320, 236, 'clap test and phone app: tail 1.5 s')}<circle cx="70" cy="80" r="34" fill="none" stroke="var(--c1)" stroke-width="3" class="rl-grow"/></g>
      <g data-step="=2">${t(320, 236, 'cause: glass, tile and concrete everywhere')}</g>
      <g data-step="=3">${t(320, 236, 'target for easy conversation: 0.7 s')}</g>
      <g data-step="=4">${t(320, 236, 'add 37 m² of ceiling panels')}</g>
      <g data-step="=5">${t(320, 236, 'measure again: 0.75 s, close enough', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['Measure first', 'Put a number on the complaint. Here the tail is 1.5 s.'],
      ['Diagnose', 'Ask what physically causes it. All the surfaces are hard, so sound has nowhere to go.'],
      ['Set a target', 'Pick a figure that suits the use. For a café where people talk, about 0.7 s.'],
      ['Design to the number', 'Calculate the absorption needed and choose where it can go without getting in the way.'],
      ['Verify', 'Measure again in the same way. If it misses, go back round the loop.'],
    ],
    why: [
      'Without a first measurement you cannot tell whether your fix worked or by how much.',
      'Naming the cause stops you buying the wrong cure, such as absorbers for a problem that is really noise coming through a wall.',
      'A target number turns an argument about taste into a calculation.',
    ],
    uses: [
      ['🍽️', 'Noisy restaurants and offices', 'Measure the tail, aim for 0.6–0.8 s, add ceiling absorption, re-measure.'],
      ['🏠', 'Neighbour noise', 'Find the path first (wall, floor, door gap) before spending on any one of them.'],
      ['🎛️', 'A home studio', 'Measure at the mix seat, fix the biggest problem, measure again, then move to the next.'],
    ],
    tryit: [
      'Pick one sound problem you live with and write it as a number you could measure (seconds, decibels, or a frequency).',
      'Write down the most likely physical cause and one thing that would prove it.',
      'Write the target you would accept. You now have a brief.',
    ],
    slip: ['Buying treatment first and asking what the problem was afterwards.', 'Measure and diagnose before spending. The cheapest fix is usually the one aimed at the real cause.'],
  });

  /* ---------------------------------------------------------------- workbook */
  REAL('workbook', {
    title: 'the generator and the neighbour',
    plain: 'Most everyday acoustics sums use three ideas: sound drops 6 dB each time the distance doubles outdoors, two equal sources together are only 3 dB louder than one, and a 10 dB change sounds about twice or half as loud.',
    where: 'A wedding marquee with a hired generator',
    story: `<p>Sunil measures 78 dB at 7 m from the generator. The nearest house is 28 m away, and the caterer wants to bring a second, identical generator. Will the neighbour be bothered?</p>
      <p>He works it out on a napkin. Twenty-eight metres is 7 m doubled twice, so 12 dB less: 66 dB. A second generator adds 3 dB: 69 dB. That is as loud as a busy street, so he moves both generators behind the storeroom wall.</p>`,
    numbers: [['At 7 m', '78 dB'], ['At 14 m (one doubling)', '78 − 6 = 72 dB'], ['At 28 m (two doublings)', '72 − 6 = 66 dB'], ['Two generators', '66 + 3 = 69 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A generator with sound level falling 6 decibels for each doubling of distance">
      <line x1="30" y1="200" x2="610" y2="200" stroke="var(--line)" stroke-width="2"/>
      <rect x="40" y="160" width="56" height="40" rx="6" fill="var(--c1)" class="rl-shake"/>${t(68, 224, 'generator')}
      <path d="M560 200 V150 L585 128 L610 150 V200 Z" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>${t(585, 224, 'house')}
      <g data-step="1"><line x1="180" y1="196" x2="180" y2="150" stroke="var(--muted)" stroke-dasharray="4 3"/>${t(180, 140, '7 m')}${t(180, 122, '78 dB', 'fill="var(--bad)" font-weight="700"')}
        <path d="M96 180 H178" stroke="var(--accent)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="2"><line x1="300" y1="196" x2="300" y2="150" stroke="var(--muted)" stroke-dasharray="4 3"/>${t(300, 140, '14 m')}${t(300, 122, '72 dB', 'fill="var(--warn)" font-weight="700"')}
        <path d="M182 180 H298" stroke="var(--accent)" stroke-width="2.5" class="rl-flow"/></g>
      <g data-step="3"><line x1="540" y1="196" x2="540" y2="150" stroke="var(--muted)" stroke-dasharray="4 3"/>${t(540, 110, '28 m')}${t(540, 92, '66 dB', 'fill="var(--good)" font-weight="700"')}
        <path d="M302 180 H538" stroke="var(--accent)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="4"><rect x="40" y="112" width="56" height="40" rx="6" fill="var(--c6)" class="rl-shake"/>${t(540, 74, '+3 dB = 69 dB', 'fill="var(--bad)" font-weight="700"')}</g>
      <g data-step="5"><rect x="118" y="100" width="12" height="100" fill="var(--text)"/></g>
      <g data-step="=1">${t(330, 40, 'start from what you measured')}</g>
      <g data-step="=2">${t(330, 40, 'double the distance: take off 6 dB')}</g>
      <g data-step="=3">${t(330, 40, 'double again: take off another 6 dB')}</g>
      <g data-step="=4">${t(330, 40, 'a second equal source adds only 3 dB')}</g>
      <g data-step="=5">${t(330, 40, 'a solid wall in the line of sight helps most')}</g>
    </svg>`,
    steps: [
      ['Start with a measurement', '78 dB at 7 m. Always note the distance with the level.'],
      ['First doubling', 'At 14 m the same energy is spread over four times the area: 6 dB less.'],
      ['Second doubling', 'At 28 m it is 6 dB less again: 66 dB.'],
      ['Add the second source', 'Two equal sources give double the energy, which is +3 dB, not double the decibels.'],
      ['Decide what to do', '69 dB at a bedroom window is too much, so block the line of sight with something solid and heavy.'],
    ],
    why: [
      'Decibels are a logarithmic scale, so you add and subtract them for distance and never add them like ordinary numbers for two sources.',
      'Outdoors sound spreads over a growing sphere; indoors reflections stop the level falling this fast.',
      'To sound half as loud you need about 10 dB less, which is a tenth of the energy. Small reductions take big changes.',
    ],
    uses: [
      ['🎪', 'Outdoor events', 'From the level at the mixing desk and its distance, estimate the level at the nearest house.'],
      ['🏭', 'Plant noise', 'Two identical fans are 3 dB louder than one; four are 6 dB louder.'],
      ['🔈', 'Speaker coverage', 'A listener at 16 m gets 12 dB less than one at 4 m, so far seats may need their own speakers.'],
    ],
    tryit: [
      'With a phone sound-meter app, measure a steady source (a fan, a tap running) at 1 m and at 2 m outdoors or in a large room.',
      'Check how close the drop is to 6 dB. Indoors it will be less: that difference is the room.',
      'Predict the level at 4 m, then measure it.',
    ],
    slip: ['Adding 78 dB and 78 dB to get 156 dB.', 'Two equal sources add 3 dB: 78 + 78 = 81 dB.'],
  });

  /* ---------------------------------------------------------------- a-electric */
  REAL('a-electric', {
    title: 'the thin cable that ate the volume',
    plain: 'Electricity flows in a loop, and everything in the loop shares the voltage in proportion to its resistance. A long thin speaker cable has enough resistance to take a noticeable share that should have gone to the speaker.',
    where: 'A garden party with a speaker 30 m from the amplifier',
    story: `<p>Farah runs 30 m of thin bell-wire-sized cable to a speaker at the end of the garden. It works, but it is quieter than the identical speaker on a short lead and the bass sounds loose.</p>
      <p>The cable is the reason. Thirty metres out and thirty back is 60 m of thin copper, about 1.4 ohms, in series with an 8 ohm speaker. Swapping to a thicker cable brings the loss down to something nobody can hear.</p>`,
    numbers: [['Cable length (out and back)', '60 m'], ['0.75 mm² copper', '60 × 0.023 ≈ 1.4 Ω'], ['Speaker gets', '8 ÷ 9.4 = 85 % of the voltage (−1.4 dB)'], ['2.5 mm² copper', '0.41 Ω → 95 % (−0.4 dB)']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Amplifier, long cable with resistance and loudspeaker forming a loop">
      ${box(30, 95, 100, 70, 'amplifier')}
      <rect x="520" y="85" width="80" height="90" rx="8" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><circle cx="560" cy="130" r="26" fill="var(--c2)"/>${t(560, 198, '8 Ω speaker')}
      <path d="M130 110 H520" stroke="var(--c1)" stroke-width="3" fill="none"/><path d="M520 150 H130" stroke="var(--c1)" stroke-width="3" fill="none"/>
      <g data-step="1"><path d="M130 110 H520" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/><path d="M520 150 H130" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${t(325, 50, 'current flows out and back: a loop')}</g>
      <g data-step="2-3"><path d="M250 110 l10 -10 l14 20 l14 -20 l14 20 l14 -20 l14 20 l10 -10" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-pulse"/>
        <path d="M400 150 l-10 10 l-14 -20 l-14 20 l-14 -20 l-14 20 l-14 -20 l-10 10" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-pulse"/></g>
      <g data-step="=2">${t(325, 50, 'thin 60 m cable acts as a 1.4 Ω resistor', 'fill="var(--bad)"')}</g>
      <g data-step="=3">${t(325, 50, 'speaker gets 85 %, the cable warms up')}<circle cx="560" cy="130" r="18" fill="var(--panel2)"/></g>
      <g data-step="4"><path d="M130 110 H520" stroke="var(--good)" stroke-width="7" fill="none" opacity=".6"/><path d="M520 150 H130" stroke="var(--good)" stroke-width="7" fill="none" opacity=".6"/></g>
      <g data-step="=4">${t(325, 50, 'thicker cable: 0.41 Ω, speaker gets 95 %', 'fill="var(--good)"')}</g>
      <g data-step="=5">${t(325, 50, 'rule: cable under 5 % of the speaker ohms')}<circle cx="560" cy="130" r="34" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/></g>
    </svg>`,
    steps: [
      ['A loop', 'Current leaves the amplifier, passes through the speaker and returns. Both wires count.'],
      ['The cable has resistance', 'Thin, long copper resists the flow. Here it adds up to 1.4 ohms.'],
      ['The voltage is shared', 'The speaker gets 8 parts in 9.4. The rest heats the cable, and the amplifier has a weaker grip on the cone.'],
      ['Use thicker copper', 'More than three times the cross-section means less than a third of the resistance.'],
      ['A simple rule', 'Keep the cable resistance below about 5 % of the speaker impedance: 0.4 Ω for an 8 Ω speaker.'],
    ],
    why: [
      'Ohm’s law: voltage = current × resistance. In a series loop the larger resistance takes the larger share.',
      'Resistance grows with length and shrinks with thickness, like water in a long narrow hose.',
      'A 4 Ω speaker is twice as sensitive to cable resistance as an 8 Ω one, so it needs thicker cable.',
    ],
    uses: [
      ['🔌', 'Choosing speaker cable', 'Up to about 10 m, 1.5 mm² is fine for 8 Ω; for 30 m use 2.5 mm² or more.'],
      ['🏟️', 'Very long runs', 'Distributed 70/100 V systems raise the voltage so the same cable loses far less.'],
      ['🔋', 'Low-voltage power', 'A 12 V supply on a long thin lead can sag enough to make equipment misbehave.'],
    ],
    tryit: [
      'Read the cross-section printed on a speaker cable (for example 2 × 1.5 mm²).',
      'Estimate its loop resistance: 0.017 ÷ area in mm² × twice the length in metres.',
      'Compare that with 5 % of your speaker’s impedance. This is a paper exercise: do not open any mains-powered equipment.',
    ],
    slip: ['Counting only the one-way length of the cable.', 'Current flows out and back, so use twice the run length when working out resistance.'],
  });

  /* ---------------------------------------------------------------- a-electronics */
  REAL('a-electronics', {
    title: 'the guitar that went dull on a long lead',
    plain: 'A cable behaves like a small capacitor between the signal wire and its shield. Fed from a weak, high-resistance source it bleeds away treble. Fed from a strong, low-resistance source it does almost nothing.',
    where: 'A small stage, guitarist six metres from the amplifier',
    story: `<p>Anand’s electric guitar sounds bright through a short lead at home but dull through the 6 m lead on stage. Nothing is broken. The pickup and volume control together are a weak source of about 50 thousand ohms, and the longer cable has twice the capacitance.</p>
      <p>A small buffer pedal at his feet, which has an output of about one thousand ohms, drives the cable instead. The sparkle comes back, with the same cable.</p>`,
    numbers: [['Cable', '6 m × 100 pF/m = 600 pF'], ['Source resistance', '≈ 50 kΩ'], ['Treble starts falling at', '1 ÷ (2π × 50 kΩ × 600 pF) ≈ 5.3 kHz'], ['With a 1 kΩ buffer', '≈ 265 kHz: far above hearing']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Guitar, cable drawn as a capacitor to ground, and amplifier">
      ${box(30, 90, 100, 60, 'guitar')}${box(510, 90, 100, 60, 'amp')}
      <path d="M130 120 H510" stroke="var(--c1)" stroke-width="3" fill="none"/>
      <line x1="60" y1="215" x2="580" y2="215" stroke="var(--muted)" stroke-width="2"/>${t(580, 238, 'shield')}
      <g data-step="1"><path d="M130 120 H510" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${t(320, 50, 'signal travels along the centre wire')}</g>
      <g data-step="2"><line x1="320" y1="120" x2="320" y2="158" stroke="var(--text)" stroke-width="2"/><line x1="298" y1="158" x2="342" y2="158" stroke="var(--text)" stroke-width="4"/><line x1="298" y1="172" x2="342" y2="172" stroke="var(--text)" stroke-width="4"/><line x1="320" y1="172" x2="320" y2="215" stroke="var(--text)" stroke-width="2"/></g>
      <g data-step="=2">${t(320, 50, 'wire and shield form a 600 pF capacitor')}</g>
      <g data-step="3-4"><path d="M312 124 V210" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/>${t(400, 170, 'treble leaks away', 'fill="var(--bad)"')}</g>
      <g data-step="=3">${t(320, 50, 'weak 50 kΩ source cannot keep up')}</g>
      <g data-step="=4">${t(320, 50, 'highs above 5 kHz arrive reduced')}<rect x="530" y="70" width="60" height="8" rx="4" fill="var(--bad)" class="rl-pulse"/></g>
      <g data-step="5"><rect x="160" y="96" width="70" height="48" rx="8" fill="var(--good)"/>${t(195, 125, 'buffer')}</g>
      <g data-step="=5">${t(320, 50, 'strong 1 kΩ source: the leak no longer matters', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['The signal path', 'The guitar signal travels down the centre wire of the cable to the amplifier.'],
      ['A hidden capacitor', 'The centre wire and the shield around it are two conductors close together: a capacitor of about 100 pF per metre.'],
      ['High frequencies leak', 'A capacitor passes fast changes easily, so treble takes the shortcut to the shield.'],
      ['The weak source loses', 'A 50 kΩ source cannot supply enough current to make up the loss, so everything above about 5 kHz falls away.'],
      ['Buffer it', 'A buffer copies the signal from a 1 kΩ output. The same leak is now tiny by comparison.'],
    ],
    why: [
      'A resistor feeding a capacitor makes a low-pass filter with its corner at 1 ÷ (2πRC). Bigger R or bigger C means a lower corner.',
      'This is why professional gear uses low output impedance feeding high input impedance: cables then barely matter.',
      'A direct box does the same job and also balances the signal for long runs.',
    ],
    uses: [
      ['🎸', 'Passive guitars and basses', 'Keep the lead under about 5 m, or put a buffer or direct box within the first few metres.'],
      ['🎹', 'Keyboards to the stage box', 'Use a direct box so 30 m of cable carries a low-impedance balanced signal.'],
      ['🎚️', 'Simple filters', 'The same R and C sum designs a rumble filter or a treble roll-off on purpose.'],
    ],
    tryit: [
      'Find your cable’s length and assume about 100 pF per metre.',
      'Compute the corner frequency for a 50 kΩ source: 1 ÷ (6.28 × 50 000 × capacitance in farads).',
      'If you have two leads, play the same phrase through the short and the long one and listen to the top end.',
    ],
    slip: ['Blaming the amplifier, the strings or “cheap cable” for dull tone.', 'Check length and source impedance first. A buffer or direct box near the instrument is the fix.'],
  });

  /* ---------------------------------------------------------------- a-transducers */
  REAL('a-transducers', {
    title: 'one idea working forwards and backwards',
    plain: 'A microphone turns air movement into a tiny electrical signal. A loudspeaker does the same thing in reverse. In both, a coil of wire moves in the field of a magnet.',
    where: 'A school assembly with one handheld microphone',
    story: `<p>Divya speaks into a handheld microphone 10 cm from her mouth. Her voice pushes a thin diaphragm with a small coil glued to it. The coil moving past a magnet produces about two thousandths of a volt.</p>
      <p>The amplifier makes that signal thousands of times bigger and sends it to a coil on the back of a loudspeaker cone. Now current pushes the coil, the cone pushes the air, and 300 pupils hear her at the back of the hall.</p>`,
    numbers: [['Voice at the microphone', '≈ 94 dB (1 pascal)'], ['Microphone output', '≈ 2 mV'], ['Speaker: 90 dB at 1 m for 1 W', '100 W → 110 dB at 1 m'], ['At 16 m (four doublings)', '110 − 24 = 86 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Voice to microphone coil and magnet, through an amplifier, to a loudspeaker coil and cone">
      ${person(46, 96, '--c1')}
      <rect x="130" y="80" width="10" height="80" rx="4" fill="var(--c2)" class="rl-shake"/>
      <rect x="140" y="104" width="34" height="32" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-shake"/>
      <rect x="150" y="92" width="50" height="12" fill="var(--muted)"/><rect x="150" y="136" width="50" height="12" fill="var(--muted)"/>
      ${t(160, 186, 'microphone')}
      ${box(270, 92, 100, 56, 'amplifier')}
      <rect x="440" y="104" width="34" height="32" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-shake"/>
      <rect x="430" y="92" width="50" height="12" fill="var(--muted)"/><rect x="430" y="136" width="50" height="12" fill="var(--muted)"/>
      <path d="M474 120 L530 70 L530 170 Z" fill="var(--c2)" class="rl-shake"/>${t(480, 186, 'loudspeaker')}
      <g data-step="1">${[0, 1, 2].map((i) => `<path d="M${72 + i * 18} 96 q10 24 0 48" stroke="var(--c1)" stroke-width="2.5" fill="none" class="rl-pulse d${i + 1}"/>`).join('')}</g>
      <g data-step="=1">${t(320, 40, 'voice pushes the thin diaphragm')}</g>
      <g data-step="=2">${t(320, 40, 'coil moves past the magnet: 2 mV appears')}<circle cx="157" cy="120" r="26" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-grow"/></g>
      <g data-step="3"><path d="M200 120 H270" stroke="var(--accent)" stroke-width="2" fill="none" class="rl-flow"/><path d="M370 120 H430" stroke="var(--accent)" stroke-width="5" fill="none" class="rl-flow"/></g>
      <g data-step="=3">${t(320, 40, 'amplifier makes it thousands of times bigger')}</g>
      <g data-step="=4">${t(320, 40, 'current in the coil pushes the cone')}<circle cx="457" cy="120" r="26" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-grow"/></g>
      <g data-step="5">${[0, 1, 2].map((i) => `<path d="M${546 + i * 22} ${80 - i * 10} q${14 + i * 4} ${40 + i * 10} 0 ${80 + i * 20}" stroke="var(--c2)" stroke-width="2.5" fill="none" class="rl-pulse d${i + 1}"/>`).join('')}</g>
      <g data-step="=5">${t(320, 40, 'the cone moves the air: 86 dB at the back')}</g>
    </svg>`,
    steps: [
      ['Sound arrives', 'Pressure changes from the voice push a light diaphragm in and out.'],
      ['Motion becomes voltage', 'A coil fixed to the diaphragm moves through a magnetic field, which generates a small voltage that follows the sound.'],
      ['Amplify', 'The amplifier makes an identical but much larger copy with enough current to do work.'],
      ['Voltage becomes motion', 'In the loudspeaker that current flows in a coil sitting in a magnet’s field, which pushes the coil and the cone attached to it.'],
      ['Motion becomes sound', 'The cone pushes the air. A larger cone and more travel move more air, which is what bass needs.'],
    ],
    why: [
      'A wire moving in a magnetic field generates voltage; a current in a wire in that field feels a force. Same physics, two directions.',
      'A microphone diaphragm is tiny and light to follow fast detail; a woofer cone is large and strong to shift air.',
      'Most of the electrical power in a speaker becomes heat. Only about 1 % becomes sound, which is why sensitivity figures matter.',
    ],
    uses: [
      ['🎤', 'Choosing a microphone', 'A moving-coil type is tough and handles loud close sources; a condenser type is more sensitive for quiet detail.'],
      ['🔊', 'Sizing a system', 'From the sensitivity and amplifier power, estimate the level at the farthest seat: minus 6 dB per doubling of distance.'],
      ['🎧', 'Headphones and earphones', 'They are small loudspeakers sealed to the ear, so milliwatts are plenty.'],
    ],
    tryit: [
      'Look up the sensitivity of a speaker you own (dB at 1 m for 1 W or 2.83 V).',
      'Add 10 dB for 10 W, 20 dB for 100 W, then take off 6 dB for each doubling of distance to your seat.',
      'Compare with a phone sound-meter reading at a comfortable level. Keep levels moderate.',
    ],
    slip: ['Assuming twice the amplifier power is twice as loud.', 'Double the power is only +3 dB. A more sensitive speaker or a shorter distance changes far more.'],
  });

  /* ---------------------------------------------------------------- a-flow */
  REAL('a-flow', {
    title: 'the fader that did not turn the monitor down',
    plain: 'A mixing desk is a set of pipes. Each microphone goes through the same stages in the same order, and at certain points a copy can be tapped off to somewhere else. Knowing where each tap sits explains almost every surprise.',
    where: 'A Sunday service with a volunteer at the mixing desk',
    story: `<p>The singer asks for less of herself in the stage monitor. Joseph pulls her channel fader down. The congregation now cannot hear her, but the monitor is exactly as loud as before.</p>
      <p>The monitor is fed from an auxiliary send that is tapped off before the fader, so the fader cannot affect it. He puts the fader back and turns down the monitor send knob on her channel instead.</p>`,
    numbers: [['Preamp gain', '+35 dB'], ['Monitor send (pre-fader)', 'taken before the fader'], ['Reverb send (post-fader)', 'taken after the fader'], ['Fader to main mix', '−5 dB']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Channel signal flow: preamp, equaliser, fader and main mix, with pre-fader and post-fader sends">
      ${box(20, 100, 70, 46, 'mic')}${box(120, 100, 80, 46, 'gain')}${box(230, 100, 70, 46, 'EQ')}${box(360, 100, 80, 46, 'fader')}${box(520, 100, 100, 46, 'main mix')}
      <g data-step="1"><path d="M90 123 H120" stroke="var(--accent)" stroke-width="3" class="rl-flow"/><path d="M200 123 H230" stroke="var(--accent)" stroke-width="3" class="rl-flow"/><path d="M300 123 H360" stroke="var(--accent)" stroke-width="3" class="rl-flow"/><path d="M440 123 H520" stroke="var(--accent)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=1">${t(320, 40, 'every channel: gain, EQ, fader, mix')}</g>
      <g data-step="2"><path d="M330 123 V200 H400" stroke="var(--c2)" stroke-width="3" fill="none" class="rl-flow"/><circle cx="330" cy="123" r="5" fill="var(--c2)"/>
        <rect x="400" y="178" width="110" height="44" rx="8" fill="var(--panel)" stroke="var(--c2)" stroke-width="2"/>${t(455, 205, 'monitor send')}</g>
      <g data-step="=2">${t(320, 40, 'monitor copy is tapped before the fader', 'fill="var(--c2)"')}</g>
      <g data-step="=3">${t(320, 40, 'fader down: main gets quieter, monitor does not')}<rect x="356" y="96" width="88" height="54" rx="10" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-pulse"/></g>
      <g data-step="4"><path d="M480 123 V70 H520" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/><circle cx="480" cy="123" r="5" fill="var(--c3)"/>
        <rect x="520" y="48" width="100" height="40" rx="8" fill="var(--panel)" stroke="var(--c3)" stroke-width="2"/>${t(570, 73, 'reverb send')}</g>
      <g data-step="=4">${t(300, 40, 'reverb copy is tapped after the fader', 'fill="var(--c3)"')}</g>
      <g data-step="=5">${t(320, 40, 'so: turn the monitor send knob, not the fader')}<circle cx="455" cy="200" r="34" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/></g>
    </svg>`,
    steps: [
      ['The main path', 'Microphone, gain, equaliser, fader, then the main mix. Signal always runs in that order.'],
      ['A pre-fader tap', 'The monitor send takes its copy before the fader, so the stage mix stays put while you ride the house mix.'],
      ['Why the fader did nothing', 'Pulling the fader changes only what comes after it. The monitor copy was already taken.'],
      ['A post-fader tap', 'The reverb send is taken after the fader, so the effect rises and falls with the voice.'],
      ['The right control', 'To change the monitor, turn that channel’s monitor send. To change the house, use the fader.'],
    ],
    why: [
      'Anything upstream affects everything downstream. Gain and equaliser changes reach the monitor as well as the house.',
      'Performers need a steady monitor level, so monitor sends are normally pre-fader.',
      'Effects should stay in proportion to the dry sound, so effect sends are normally post-fader.',
    ],
    uses: [
      ['🎤', 'Stage monitors', 'Use pre-fader sends so house mix moves do not disturb the performers.'],
      ['🎬', 'Recording feed or live stream', 'Decide whether the stream should follow your fader moves (post) or have its own balance (pre).'],
      ['🔍', 'Fault finding', 'No sound? Follow the path in order: source, gain, mute, fader, routing, master, amplifier.'],
    ],
    tryit: [
      'On any mixer or audio software, find one channel’s send and check whether it is marked pre or post.',
      'Pull the fader down and listen to (or watch the meter of) the send’s destination.',
      'Draw the path of one microphone through the desk as boxes and arrows, marking each tap.',
    ],
    slip: ['Turning up the channel gain mid-show to make someone louder in the house.', 'Gain feeds everything, including the monitors, and may cause feedback. Use the fader for the house.'],
  });

  /* ---------------------------------------------------------------- a-digital */
  REAL('a-digital', {
    title: 'what an hour of concert becomes on a memory card',
    plain: 'Digital audio measures the height of the sound wave thousands of times a second and writes each measurement down as a number. Enough measurements, taken finely enough, rebuild the original wave exactly within the range we can hear.',
    where: 'A stereo recording of a one-hour school concert',
    story: `<p>Nisha sets her recorder to 48 000 samples per second and 24 bits. She wonders whether the memory card will last, and whether “48 kHz” loses anything.</p>
      <p>The sums are short. Each second is 48 000 measurements, three bytes each, for two channels. The hour fills about one gigabyte. And 48 000 measurements a second can describe everything up to 24 kHz, above the limit of human hearing.</p>`,
    numbers: [['Highest frequency captured', '48 000 ÷ 2 = 24 kHz'], ['24 bits of range', '24 × 6 ≈ 144 dB'], ['Data per second', '48 000 × 3 bytes × 2 = 288 kB'], ['One hour', '288 kB × 3600 ≈ 1.04 GB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A smooth wave being sampled, rounded to levels, stored as numbers and rebuilt">
      <line x1="40" y1="140" x2="600" y2="140" stroke="var(--line)"/>
      <g data-step="1-4"><path d="M40 140 C100 20 160 20 220 140 S340 260 400 140 S520 20 600 110" stroke="var(--muted)" stroke-width="2.5" fill="none"/></g>
      <g data-step="=1">${t(320, 28, 'the sound wave from the microphone')}<circle cx="40" cy="140" r="6" fill="var(--accent)" class="rl-slide" style="--dx:560px"/></g>
      <g data-step="2-4">${[[70, 86], [110, 56], [150, 60], [190, 100], [230, 152], [270, 198], [310, 224], [350, 208], [390, 156], [430, 100], [470, 58], [510, 48], [550, 68], [590, 102]].map(([x, y], i) => `<line x1="${x}" y1="140" x2="${x}" y2="${y}" stroke="var(--accent)" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4.5" fill="var(--accent)" class="rl-pulse d${(i % 4) + 1}"/>`).join('')}</g>
      <g data-step="=2">${t(320, 28, 'measure its height 48 000 times a second')}</g>
      <g data-step="=3">${[40, 80, 120, 160, 200, 240].map((y) => `<line x1="40" y1="${y}" x2="600" y2="${y}" stroke="var(--c3)" stroke-width="1" stroke-dasharray="3 5"/>`).join('')}${t(320, 28, 'round each height to the nearest step')}</g>
      <g data-step="=4">${t(320, 28, 'store the heights as a list of numbers')}<text x="60" y="250" font-size="12" font-family="var(--mono)">+54 +84 +80 +40 −12 −58 −84 −68 −16 +40 +82 …</text></g>
      <g data-step="5"><path d="M40 140 C100 20 160 20 220 140 S340 260 400 140 S520 20 600 110" stroke="var(--good)" stroke-width="3.5" fill="none" class="rl-flow slow"/></g>
      <g data-step="=5">${t(320, 28, 'playback joins the dots into the same wave', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['An analogue wave', 'The microphone signal is a smooth, continuous voltage.'],
      ['Sample it', 'The converter measures the voltage at evenly spaced instants: 48 000 every second.'],
      ['Round to steps', 'Each measurement is rounded to the nearest of about 16.7 million levels (24 bits). The rounding error is far below anything audible.'],
      ['Store numbers', 'The sound is now just a long list of numbers that can be copied forever without loss.'],
      ['Rebuild', 'On playback a filter draws the one smooth curve that passes through all the points. Below half the sample rate that curve is the original.'],
    ],
    why: [
      'You need more than two samples per cycle to pin down a tone, so the sample rate must be more than twice the highest frequency you want.',
      'Each extra bit halves the rounding error, which lowers the noise floor by about 6 dB.',
      'Anything above half the sample rate must be filtered out before sampling, or it folds back as a false tone.',
    ],
    uses: [
      ['💾', 'Planning storage', 'Mono 48 kHz 24-bit is about 8.6 MB a minute. Multiply by channels and minutes.'],
      ['🎚️', 'Choosing settings', 'Record at 24 bits for headroom; 44.1 or 48 kHz covers the whole audible range.'],
      ['📡', 'Streaming and networks', 'The same sum gives the bit rate a link must carry: about 1.15 Mbit/s per channel.'],
    ],
    tryit: [
      'Work out the file size for a 3-minute stereo song at 44.1 kHz and 16 bits (44 100 × 2 bytes × 2 channels × 180 s).',
      'Check your answer against a real uncompressed file of that length (about 32 MB).',
      'In any audio app, export the same clip at 8 bits and listen to the hiss that rounding adds.',
    ],
    slip: ['Believing that a higher sample rate always sounds better.', 'Beyond covering the audible range it only makes bigger files. Good microphones, levels and rooms matter far more.'],
  });

  /* ---------------------------------------------------------------- a-network */
  REAL('a-network', {
    title: 'one thin cable instead of a fat multicore',
    plain: 'Networked audio chops each channel into small numbered packets and sends them over ordinary computer network cable. One device keeps the beat so every packet is played at exactly the right moment.',
    where: 'A school auditorium, stage to mixing desk at the back',
    story: `<p>The old 32-way copper multicore, as thick as a wrist, has failed again. The technician, Peter, replaces it with a digital stage box, a network switch and one ordinary network cable to the desk, 60 m away.</p>
      <p>All 32 microphones travel down that single cable with room to spare, and the same network carries the mix back to the amplifiers. The delay is about a thousandth of a second, less than sound takes to travel 35 cm.</p>`,
    numbers: [['One channel', '48 000 × 24 bits ≈ 1.15 Mbit/s'], ['32 channels', '≈ 37 Mbit/s'], ['Capacity of the link', '1000 Mbit/s'], ['Network delay', '≈ 1 ms'], ['Copper cable limit', '100 m per run']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Stage box, network switch, mixing desk and amplifiers linked by network cable carrying packets">
      ${box(20, 100, 110, 60, 'stage box')}${box(250, 100, 110, 60, 'switch')}${box(500, 40, 120, 56, 'mixing desk')}${box(500, 164, 120, 56, 'amplifiers')}
      <path d="M130 130 H250" stroke="var(--line)" stroke-width="4"/><path d="M360 118 L500 68" stroke="var(--line)" stroke-width="4"/><path d="M360 142 L500 192" stroke="var(--line)" stroke-width="4"/>
      <g data-step="=1">${t(250, 36, '32 mics become numbers in the stage box')}${[0, 1, 2, 3].map((i) => `<line x1="${34 + i * 24}" y1="100" x2="${34 + i * 24}" y2="74" stroke="var(--c1)" stroke-width="3" class="rl-pulse d${i + 1}"/>`).join('')}</g>
      <g data-step="2">${[0, 1, 2].map((i) => `<rect x="140" y="124" width="16" height="12" rx="2" fill="var(--accent)" class="rl-slide d${i + 1}" style="--dx:90px"/>`).join('')}</g>
      <g data-step="=2">${t(250, 36, 'numbers travel as small packets')}</g>
      <g data-step="3"><path d="M360 118 L500 68" stroke="var(--accent)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=3">${t(250, 36, 'the switch passes each packet on')}</g>
      <g data-step="4"><circle cx="305" cy="86" r="10" fill="var(--c3)" class="rl-pulse"/>${t(305, 70, 'clock', 'fill="var(--c3)"')}
        <circle cx="560" cy="110" r="5" fill="var(--c3)" class="rl-pulse"/><circle cx="75" cy="174" r="5" fill="var(--c3)" class="rl-pulse"/><circle cx="560" cy="234" r="5" fill="var(--c3)" class="rl-pulse"/></g>
      <g data-step="=4">${t(250, 36, 'one clock keeps every device in step')}</g>
      <g data-step="5"><path d="M500 80 L370 126" stroke="var(--c2)" stroke-width="2" fill="none" class="rl-flow"/><path d="M360 142 L500 192" stroke="var(--c2)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=5">${t(250, 36, 'the mix returns on the same network')}</g>
    </svg>`,
    steps: [
      ['Convert at the stage', 'The stage box turns each microphone into digital audio right next to the performers.'],
      ['Packets', 'The audio is cut into small packets, each labelled with where it is going and when it should play.'],
      ['The switch delivers', 'A network switch forwards each packet to the devices that asked for that channel.'],
      ['One clock for all', 'One device is chosen as the leader. The others lock to its timing, so samples line up to within a millionth of a second.'],
      ['Both directions', 'The finished mix goes back down the same cables to the amplifiers and anywhere else on the network.'],
    ],
    why: [
      'Digital audio is only numbers, and networks are very good at moving numbers reliably and cheaply.',
      'A gigabit link has room for hundreds of channels, so one cable replaces dozens of copper pairs.',
      'Numbers do not pick up hum on the way, so long runs stay clean. The limit becomes the cable length and the switch quality.',
    ],
    uses: [
      ['🏫', 'Halls and theatres', 'Stage box to desk on one cable, with a second cable by a different route as a spare.'],
      ['🏢', 'Buildings with many rooms', 'Send any source to any room by changing a setting, not by pulling new cable.'],
      ['📼', 'Multitrack recording', 'A laptop on the network can record every channel without extra hardware.'],
    ],
    tryit: [
      'Count the channels in a system you know and multiply by 1.15 Mbit/s. Compare with 1000 Mbit/s.',
      'Measure or estimate the cable route. Anything over 100 m needs a second switch or optical fibre.',
      'Sketch the devices as boxes joined to one switch and mark which one would be the clock leader.',
    ],
    slip: ['Plugging audio devices into any cheap office switch with power-saving features on.', 'Use switches the audio system’s maker approves, turn off energy-saving modes, and keep audio on its own network or VLAN.'],
  });

  /* ---------------------------------------------------------------- a-dsp */
  REAL('a-dsp', {
    title: 'the best man’s boomy, jumpy microphone',
    plain: 'An equaliser turns chosen pitch ranges up or down, like a very precise tone control. A compressor is an automatic hand on the volume that turns loud moments down so everything sits at a steadier level.',
    where: 'A wedding reception, speech through a small sound system',
    story: `<p>The best man holds the microphone against his chin. His voice is thick and boomy, and every time he laughs the speakers bark. Guests at the back cannot follow the quiet lines.</p>
      <p>Priya, at the mixer, switches in a high-pass filter at 100 Hz, cuts 3 dB around 250 Hz, and sets a compressor to 4:1 with the threshold at −20. The boom goes, the loud laughs drop by 9 dB, and she can raise the whole voice so the quiet lines carry.</p>`,
    numbers: [['High-pass filter', 'removes rumble below 100 Hz'], ['Cut at 250 Hz', '−3 dB'], ['Loud laugh', '−8 dB: 12 dB over the threshold'], ['After 4:1 compression', '12 ÷ 4 = 3 dB over → −17 dB'], ['Gain reduction', '9 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A frequency curve being cleaned by filters, and level bars before and after compression">
      <rect x="30" y="50" width="330" height="170" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <line x1="45" y1="140" x2="345" y2="140" stroke="var(--muted)" stroke-dasharray="4 4"/>
      <text x="50" y="212" font-size="12">bass</text><text x="300" y="212" font-size="12">treble</text>
      <g data-step="=1"><path d="M45 100 Q110 70 150 110 Q200 140 345 140" stroke="var(--bad)" stroke-width="3" fill="none"/>${t(195, 36, 'too much low end: boom')}</g>
      <g data-step="2-5"><path d="M45 200 Q80 190 95 140 Q130 150 150 150 Q175 150 200 140 L345 140" stroke="var(--good)" stroke-width="3" fill="none"/></g>
      <g data-step="=2">${t(195, 36, 'high-pass at 100 Hz, dip at 250 Hz')}<circle cx="150" cy="150" r="8" fill="none" stroke="var(--good)" stroke-width="2" class="rl-grow"/></g>
      <rect x="400" y="50" width="210" height="170" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <line x1="410" y1="120" x2="600" y2="120" stroke="var(--warn)" stroke-dasharray="5 4"/><text x="408" y="114" font-size="11" fill="var(--warn)">threshold</text>
      <g data-step="3-5"><rect x="430" y="150" width="34" height="60" fill="var(--c2)"/><rect x="540" y="150" width="34" height="60" fill="var(--c2)"/></g>
      <g data-step="=3"><rect x="485" y="64" width="34" height="146" fill="var(--bad)" class="rl-pulse"/>${t(505, 36, 'laugh: 12 dB over')}</g>
      <g data-step="4-5"><rect x="485" y="106" width="34" height="104" fill="var(--good)"/></g>
      <g data-step="=4">${t(505, 36, '4:1 leaves 3 dB over')}<path d="M502 66 V102" stroke="var(--text)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="=5">${t(320, 36, 'now raise the whole voice: quiet lines carry')}<rect x="430" y="130" width="34" height="20" fill="var(--accent)" class="rl-pulse"/><rect x="540" y="130" width="34" height="20" fill="var(--accent)" class="rl-pulse"/></g>
    </svg>`,
    steps: [
      ['Hear the problem', 'A microphone held very close exaggerates bass. The voice is thick below about 300 Hz.'],
      ['Shape the tone', 'A high-pass filter removes rumble below 100 Hz, and a gentle 3 dB dip at 250 Hz clears the boom.'],
      ['A loud moment arrives', 'The laugh peaks at −8 dB, which is 12 dB above the compressor’s threshold.'],
      ['The compressor reacts', 'At 4:1, only a quarter of the excess gets through: 3 dB. The laugh comes out at −17 dB.'],
      ['Make-up gain', 'With the peaks under control, the whole voice can be raised, so quiet words are easier to hear.'],
    ],
    why: [
      'Cutting what there is too much of sounds more natural than boosting everything else.',
      'Speech can swing by 30 dB or more. A room full of guests masks the quiet end unless the range is narrowed.',
      'Below the threshold the compressor does nothing, so normal speech is untouched.',
    ],
    uses: [
      ['🗣️', 'Speech systems', 'High-pass every voice microphone at 80–120 Hz and use gentle 2:1 to 4:1 compression.'],
      ['🎸', 'Bass guitar in a mix', 'Compress to even out notes so each one is heard, then set the level once.'],
      ['📻', 'Podcasts and streams', 'Light compression and a limiter keep levels steady for people listening on phones.'],
    ],
    tryit: [
      'Record your voice with the phone very close and again at 20 cm. Hear the extra bass up close.',
      'In any audio app, apply a high-pass (low-cut) filter at 100 Hz to the close recording and compare.',
      'Work out the output for a peak 8 dB over the threshold at a ratio of 2:1 (answer: 4 dB over).',
    ],
    slip: ['Boosting treble to fix a boomy voice.', 'Remove the excess bass first with a high-pass filter and a low-mid cut. Then judge whether any boost is needed.'],
  });

  /* ---------------------------------------------------------------- a-crossover */
  REAL('a-crossover', {
    title: 'the subwoofer that made the bass thinner',
    plain: 'A crossover sends low notes to the big speaker and high notes to the small one. Around the hand-over point both play together, so they must push at the same moment. If one is late, they partly cancel.',
    where: 'A band’s small sound system in a function room',
    story: `<p>Vikram adds a subwoofer and sets the crossover at 100 Hz. The very low notes are bigger, but the punch around 100 Hz is weaker than before. The sub sits against the back wall, one metre farther from the audience than the main speakers.</p>
      <p>That metre makes the sub about 3 ms late. He delays the main speakers by 2.9 ms in the processor so both arrive together. The punch returns without touching the volume.</p>`,
    numbers: [['Extra distance to the sub', '1.0 m'], ['Sub arrives late by', '1.0 ÷ 343 ≈ 2.9 ms'], ['At 100 Hz (wavelength 3.4 m)', '1 m ≈ 105° out of step'], ['Sum when misaligned', '≈ +1.7 dB, not +6 dB'], ['Fix', 'delay the mains 2.9 ms']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Subwoofer set back from the main speaker, two waves out of step and then aligned at the listener">
      <line x1="30" y1="228" x2="610" y2="228" stroke="var(--line)" stroke-width="2"/>
      <rect x="40" y="168" width="66" height="60" rx="6" fill="var(--c1)"/>${t(73, 250, 'sub')}
      <rect x="150" y="96" width="40" height="70" rx="6" fill="var(--c2)"/><line x1="170" y1="166" x2="170" y2="228" stroke="var(--muted)" stroke-width="4"/>${t(170, 250, 'main')}
      ${person(560, 170, '--c4')}
      <g data-step="=1">${t(330, 36, 'lows to the sub, highs to the main')}<path d="M300 70 H380 Q410 70 430 110" stroke="var(--c1)" stroke-width="3" fill="none"/><path d="M370 110 Q390 70 420 70 H500" stroke="var(--c2)" stroke-width="3" fill="none"/>${t(400, 126, '100 Hz')}</g>
      <g data-step="2"><path d="M73 160 V140 H170" stroke="var(--bad)" stroke-width="2" fill="none" stroke-dasharray="4 3"/></g>
      <g data-step="=2">${t(330, 36, 'the sub is 1 m farther back')}${t(122, 132, '1 m', 'fill="var(--bad)"')}</g>
      <g data-step="3-4"><path d="M106 200 q26 -36 52 0 t52 0 t52 0 t52 0 t52 0 t52 0 t52 0 t52 0" stroke="var(--c1)" stroke-width="2.5" fill="none" class="rl-flow"/>
        <path d="M190 130 q26 36 52 0 t52 0 t52 0 t52 0 t52 0 t52 0 t52 0" stroke="var(--c2)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=3">${t(360, 36, 'near 100 Hz the two waves are out of step')}</g>
      <g data-step="=4">${t(360, 36, 'they partly cancel: weak punch', 'fill="var(--bad)"')}</g>
      <g data-step="5"><path d="M106 200 q26 -36 52 0 t52 0 t52 0 t52 0 t52 0 t52 0 t52 0 t52 0" stroke="var(--c1)" stroke-width="2.5" fill="none" class="rl-flow"/>
        <path d="M190 130 q13 -18 26 0 q26 36 52 0 t52 0 t52 0 t52 0 t52 0 t52 0" stroke="var(--good)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=5">${t(360, 36, 'delay the main 2.9 ms: peaks line up', 'fill="var(--good)"')}</g>
    </svg>`,
    steps: [
      ['Split the work', 'A low-pass filter feeds the sub and a high-pass feeds the main. At 100 Hz both are playing.'],
      ['Check the distances', 'The sub is 1 m farther from the listener than the main speaker.'],
      ['The sub is late', 'One metre is 2.9 ms. At 100 Hz that is nearly a third of a cycle.'],
      ['Partial cancellation', 'One speaker pushes while the other is already pulling back, so they add to much less than they should.'],
      ['Delay the nearer one', 'Hold the main speakers back by 2.9 ms. Now both push together and the sum is a full +6 dB.'],
    ],
    why: [
      'Two equal sounds in step add to +6 dB; half a cycle apart they cancel completely. Timing decides which you get.',
      'You cannot make the far speaker early, so you always delay the nearer one.',
      'Filters themselves shift timing, so the final check is a measurement or a polarity flip: the setting with the most output at the crossover is right.',
    ],
    uses: [
      ['🔊', 'Sub and tops', 'Measure the distance difference to the main listening spot and delay the nearer speakers by distance ÷ 343.'],
      ['🏠', 'Home cinema', 'The distance settings in the receiver are doing this job. Enter real tape-measure distances.'],
      ['📢', 'Delay speakers down a hall', 'Delay them by their distance from the stage ÷ 343, plus about 10 ms, so sound still seems to come from the front.'],
    ],
    tryit: [
      'Measure from your seat to each speaker and to the subwoofer. Note the difference in metres.',
      'Convert it to milliseconds (about 2.9 ms per metre).',
      'Play a 100 Hz tone quietly and flip the sub’s polarity switch. If it gets louder when flipped, your timing is off.',
    ],
    slip: ['Turning the subwoofer up to fix a hole at the crossover.', 'A timing cancellation cannot be filled with level. Align the arrival times first, then set the balance.'],
  });
})();
