/* "In real life" blocks — group 4 (amplifiers to DIY). Each REAL(id, {...}) adds a worked scene,
   a step-through animated diagram and a practical wrap-up to an existing lesson (see js/real-kit.js). */
(function () {
  const REAL = window.REAL; if (!REAL) return;
  const spk = (x, y, c) => `<rect x="${x}" y="${y}" width="26" height="36" rx="4" fill="var(--panel)" stroke="${c || 'var(--text)'}" stroke-width="2"/><circle cx="${x + 13}" cy="${y + 22}" r="8" fill="none" stroke="${c || 'var(--text)'}" stroke-width="2"/><circle cx="${x + 13}" cy="${y + 8}" r="3" fill="${c || 'var(--text)'}"/>`;
  const person = (x, y, c) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/><rect x="${x - 8}" y="${y + 10}" width="16" height="28" rx="6" fill="${c}"/>`;

  REAL('a-amps', {
    title: 'eight ceiling speakers in a café',
    plain: 'An amplifier pushes electrical power down a cable to a loudspeaker. A long thin cable wastes some of that power as heat, so for long runs with many speakers we send the power at a high voltage and step it down at each speaker.',
    where: 'A 120 m² café with a small equipment cupboard',
    story: `<p>Farah wants background music from eight ceiling speakers. The cupboard is 30 m of cable away from the furthest one. Her first idea is an ordinary hi-fi amplifier and thin 1.5 mm² cable to an 8 ohm speaker.</p>
      <p>The installer suggests a 100 volt line instead: one cable loops past every speaker, each speaker has a small transformer set to 6 watts, and the amplifier only has to be a little bigger than the total.</p>`,
    numbers: [['Cable resistance, 30 m out and back', '60 m × 0.0115 Ω ≈ 0.7 Ω'], ['Loss into one 8 Ω speaker', '0.7 ÷ 8.7 ≈ 8 % of the power'], ['100 V line load', '8 × 6 W = 48 W → 100² ÷ 48 ≈ 208 Ω'], ['Loss on the 100 V line', '0.7 ÷ 208.7 ≈ 0.3 %'], ['Amplifier to choose', '48 W + 25 % spare ≈ 60 W']],
    svg: `<svg viewBox="0 0 640 260" aria-label="An amplifier feeding ceiling loudspeakers along one long cable through small transformers">
      <rect x="24" y="110" width="84" height="56" rx="8" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <text x="66" y="143" text-anchor="middle" font-size="14">amplifier</text>
      <line x1="108" y1="138" x2="600" y2="138" stroke="var(--muted)" stroke-width="3"/>
      ${[200, 320, 440, 560].map((x) => `<line x1="${x}" y1="138" x2="${x}" y2="84" stroke="var(--muted)" stroke-width="2"/>${spk(x - 13, 40)}`).join('')}
      <text x="354" y="228" text-anchor="middle" font-size="13" fill="var(--muted)">30 m of cable</text>
      <g data-step="=1"><path d="M108 138 H600" stroke="var(--bad)" stroke-width="4" fill="none" class="rl-pulse"/>
        <text x="354" y="170" text-anchor="middle" font-size="13" fill="var(--bad)">low voltage, high current: cable warms</text></g>
      <g data-step="2"><path d="M108 138 H600" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="354" y="170" text-anchor="middle" font-size="13" fill="var(--accent)">100 V line: small current, tiny loss</text></g>
      <g data-step="3">${[200, 320, 440, 560].map((x) => `<rect x="${x - 10}" y="92" width="20" height="16" rx="3" fill="var(--c3)"/>`).join('')}</g>
      <g data-step="=3"><text x="354" y="170" text-anchor="middle" font-size="13" fill="var(--c3)">a transformer at each speaker: 6 W tap</text></g>
      <g data-step="4">${[200, 320, 440, 560].map((x, i) => `<circle cx="${x}" cy="60" r="20" fill="none" stroke="var(--c2)" stroke-width="2" class="rl-grow ${['', 'd2', 'd3', 'd4'][i]}"/>`).join('')}</g>
      <g data-step="=4"><text x="354" y="170" text-anchor="middle" font-size="13" fill="var(--c2)">every speaker gets its share</text></g>
      <g data-step="5"><text x="66" y="194" text-anchor="middle" font-size="13" fill="var(--good)">60 W for 48 W</text></g>
    </svg>`,
    steps: [
      ['Low voltage on a long cable', 'An 8 ohm speaker needs a lot of current. That current flows through the cable resistance and about 8 % of the power turns into heat on the way.'],
      ['Raise the voltage', 'On a 100 volt line the same power needs far less current, so the same cable loses only about 0.3 %.'],
      ['Step down at each speaker', 'A small transformer on each speaker takes a fixed number of watts from the line. The tap sets how loud that speaker is.'],
      ['Add up the taps', 'Eight speakers at 6 W ask for 48 W in total. They all hang on one pair of wires, looped from one to the next.'],
      ['Leave spare power', 'Choose an amplifier about a quarter bigger than the total, here 60 W, so it never runs flat out.'],
    ],
    why: [
      'Power lost in a cable depends on the current squared. Halve the current and the loss drops to a quarter, which is the same reason power companies use high-voltage lines.',
      'A transformer trades voltage for current without wasting much, so each speaker still gets the gentle low voltage it needs.',
      'Adding up watts is easier than working out the combined impedance of many speakers, so mistakes are rarer.',
    ],
    uses: [
      ['☕', 'Shops and cafés', 'Six to thirty small speakers on one cable, each tapped at 3 to 10 W, from one amplifier.'],
      ['🏫', 'Schools and paging', 'Corridor runs of 100 m or more lose almost nothing on a 100 V line.'],
      ['🎸', 'Short, loud runs', 'For a stage monitor 5 m away, stay low-impedance and use thick cable, 2.5 mm² or more.'],
    ],
    tryit: [
      'List the speakers in a room you know and give each a tap in watts. Add them up.',
      'Multiply the total by 1.25. That is the smallest amplifier to consider.',
      'Work out the loss for your own cable: length there and back × 0.0115 Ω per metre for 1.5 mm², divided by the speaker impedance plus that resistance.',
    ],
    slip: ['Connecting an ordinary 8 ohm speaker straight onto a 100 V line.', 'Only speakers with a line transformer go on the line. Leave any wiring inside mains-powered equipment to a qualified person.'],
  });

  REAL('a-ground', {
    title: 'the laptop that hums through the speakers',
    plain: 'Hum appears when two pieces of equipment are joined by an audio cable and also by their mains earth wires. A small unwanted voltage between the two earths rides along the audio cable and is amplified as a low buzz.',
    where: 'A community hall with a laptop at the back and powered speakers at the front',
    story: `<p>Imran plugs his laptop charger into a socket at the back of the hall and runs a 15 m headphone-to-jack cable to a powered speaker plugged in at the stage. As soon as the charger is connected, a steady 50 Hz hum appears.</p>
      <p>He does not touch any earth pins. Instead he puts a small isolating DI box at the laptop and sends a balanced microphone cable to the speaker. The hum drops below hearing and the music is unchanged.</p>`,
    numbers: [['Voltage between the two earths', 'about 20 mV'], ['Signal level', '1 V'], ['Unbalanced: hum below signal', '20 log(0.02 ÷ 1) ≈ −34 dB (clearly audible)'], ['Balanced input rejecting 60 dB', '−34 − 60 = −94 dB (inaudible)']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Two devices joined by an audio cable and by mains earth forming a loop that carries hum">
      <rect x="40" y="70" width="110" height="60" rx="8" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <text x="95" y="105" text-anchor="middle" font-size="14">laptop</text>
      <rect x="490" y="70" width="110" height="60" rx="8" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <text x="545" y="105" text-anchor="middle" font-size="14">speaker</text>
      <line x1="150" y1="100" x2="490" y2="100" stroke="var(--muted)" stroke-width="3"/>
      <text x="320" y="88" text-anchor="middle" font-size="13" fill="var(--muted)">audio cable, 15 m</text>
      <path d="M95 130 V214 H545 V130" stroke="var(--muted)" stroke-width="3" fill="none"/>
      <text x="320" y="236" text-anchor="middle" font-size="13" fill="var(--muted)">mains earth wiring in the building</text>
      <g data-step="=1"><path d="M150 100 H490" stroke="var(--c2)" stroke-width="3" fill="none" class="rl-flow"/>
        <text x="320" y="56" text-anchor="middle" font-size="13" fill="var(--c2)">music travels along the cable</text></g>
      <g data-step="2-3"><path d="M95 130 V214 H545 V130" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow slow"/>
        <path d="M490 100 H150" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow slow"/></g>
      <g data-step="=2"><text x="320" y="56" text-anchor="middle" font-size="13" fill="var(--bad)">a loop: hum current circulates</text></g>
      <g data-step="=3"><circle cx="545" cy="100" r="34" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-grow"/>
        <text x="320" y="56" text-anchor="middle" font-size="13" fill="var(--bad)">20 mV of hum is amplified with the music</text></g>
      <g data-step="4"><rect x="176" y="84" width="46" height="32" rx="5" fill="var(--good)"/>
        <text x="199" y="105" text-anchor="middle" font-size="12" style="fill:var(--bg)">DI</text>
        <path d="M222 100 H490" stroke="var(--good)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=4"><text x="320" y="56" text-anchor="middle" font-size="13" fill="var(--good)">isolate and balance: loop broken for audio</text></g>
      <g data-step="=5"><text x="320" y="56" text-anchor="middle" font-size="13" fill="var(--good)">both earths stay connected: safe and silent</text>
        <path d="M95 130 V214 H545 V130" stroke="var(--good)" stroke-width="2" fill="none" class="rl-pulse"/></g>
    </svg>`,
    steps: [
      ['One wanted path', 'The audio cable carries the music from the laptop to the speaker. Its screen also joins the two metal cases.'],
      ['A second, hidden path', 'Both devices are also joined through their mains earth wires. Together the two paths make a loop.'],
      ['The loop picks up hum', 'The two sockets sit at slightly different earth voltages, here about 20 mV. An unbalanced input cannot tell this from the music.'],
      ['Break the loop for audio only', 'An isolating DI box passes the music through a transformer and sends it balanced. The hum voltage now appears equally on both signal wires and is cancelled.'],
      ['Keep the safety earth', 'Nothing was done to any mains plug. The protective earth still does its job.'],
    ],
    why: [
      'An unbalanced cable uses its screen as the return wire, so any voltage along the screen is added straight to the signal.',
      'A balanced input listens only to the difference between its two wires. Hum arrives the same on both, so it subtracts to almost nothing.',
      'Mains wiring always has small voltage differences between sockets, and they grow with distance and with heavy loads on the circuit.',
    ],
    uses: [
      ['💻', 'Laptops and phones on a PA', 'Use a DI box with a transformer and a ground-lift switch; run balanced cable for anything over 5 m.'],
      ['🎸', 'Guitar amps and pedalboards', 'Power everything from one socket strip so all earths share one point.'],
      ['📺', 'Home cinema with cable TV', 'An aerial or cable feed often brings a second earth; an aerial isolator on that feed removes the loop.'],
    ],
    tryit: [
      'Listen to the hum: a smooth low note is usually a loop; a rough buzz often comes from dimmers or chargers nearby.',
      'Run the laptop on battery for a minute. If the hum stops, the charger earth completes the loop.',
      'Plug source and speaker into the same socket strip and listen again. A shorter loop usually means less hum.',
    ],
    slip: ['Cutting or taping over the earth pin of a mains plug to stop the hum.', 'Never remove a safety earth. Break the loop in the audio path with an isolating transformer or a balanced connection.'],
  });

  REAL('a-loudspeakers', {
    title: 'front row too loud, back row too quiet',
    plain: 'Sound from a small loudspeaker gets weaker quickly as you walk away, about 6 dB for every doubling of distance. A tall, thin column of drivers throws sound more evenly, losing closer to 3 dB per doubling over its working range.',
    where: 'A school hall 18 m deep with one speaker on a stand',
    story: `<p>At assembly, the teachers in the front row at 2 m wince while pupils at the back, 16 m away, cannot follow the words. Turning the speaker up only moves the complaint from the back to the front.</p>
      <p>The school swaps the box for a 2 m tall column speaker at the same spot. The front row is now quieter, the back row louder, and the level difference between them is roughly halved.</p>`,
    numbers: [['Distance ratio, front to back', '16 ÷ 2 = 8 (three doublings)'], ['Small box: level drop', '3 × 6 = 18 dB'], ['Tall column, in its working range', '3 × 3 ≈ 9 dB'], ['Aim for', 'no more than about 6 dB from front to back']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Side view of a hall comparing a small loudspeaker with a tall column loudspeaker">
      <line x1="20" y1="220" x2="620" y2="220" stroke="var(--line)" stroke-width="2"/>
      ${person(150, 172, 'var(--c1)')}${person(560, 172, 'var(--c2)')}
      <text x="150" y="240" text-anchor="middle" font-size="13">front row, 2 m</text>
      <text x="560" y="240" text-anchor="middle" font-size="13">back row, 16 m</text>
      <g data-step="1-2">${spk(50, 150)}
        <circle cx="76" cy="168" r="40" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-grow"/>
        <circle cx="76" cy="168" r="40" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-grow d3"/></g>
      <g data-step="=1"><text x="330" y="50" text-anchor="middle" font-size="14">small box: sound spreads as a ball</text></g>
      <g data-step="=2"><text x="150" y="150" text-anchor="middle" font-size="14" fill="var(--bad)">94 dB</text>
        <text x="560" y="150" text-anchor="middle" font-size="14" fill="var(--bad)">76 dB</text>
        <text x="330" y="50" text-anchor="middle" font-size="14" fill="var(--bad)">18 dB difference</text></g>
      <g data-step="3"><rect x="54" y="60" width="18" height="150" rx="4" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
        ${[76, 100, 124, 148, 172, 196].map((y) => `<circle cx="63" cy="${y}" r="5" fill="var(--text)"/>`).join('')}
        ${[90, 130, 170].map((y, i) => `<path d="M80 ${y} H600" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow ${['', 'd2', 'd3'][i]}"/>`).join('')}</g>
      <g data-step="=3"><text x="330" y="50" text-anchor="middle" font-size="14">tall column: sound leaves as a sheet</text></g>
      <g data-step="=4"><text x="150" y="150" text-anchor="middle" font-size="14" fill="var(--good)">90 dB</text>
        <text x="560" y="150" text-anchor="middle" font-size="14" fill="var(--good)">81 dB</text>
        <text x="330" y="50" text-anchor="middle" font-size="14" fill="var(--good)">about 9 dB difference</text></g>
      <g data-step="=5"><text x="330" y="50" text-anchor="middle" font-size="14">aim it over heads, tilt to the back row</text>
        <path d="M80 80 L600 170" stroke="var(--good)" stroke-width="2" fill="none" class="rl-flow slow"/></g>
    </svg>`,
    steps: [
      ['A small box is a point', 'Its sound spreads in all forward directions like a growing ball, so the same energy covers four times the area each time the distance doubles.'],
      ['Six decibels per doubling', 'From 2 m to 16 m is three doublings: 18 dB. If the front is comfortable, the back is far too quiet.'],
      ['A column is a line', 'A tall stack of drivers spreads sound sideways but hardly up or down. The energy covers only twice the area per doubling.'],
      ['Three decibels per doubling', 'Over the range where the column behaves as a line, front to back differs by about 9 dB. This works best at mid and high frequencies, where speech clarity lives.'],
      ['Height and aim finish the job', 'Mount the speaker above head height and tilt it at the back rows. The front row then sits slightly off its main beam, which evens things out further.'],
    ],
    why: [
      'Loudness falls because the same sound energy is stretched over a bigger surface. A ball surface grows faster than a cylinder surface.',
      'A column also sends less sound to the ceiling and floor, so less reverberation is stirred up in a lively hall.',
      'The line effect only lasts for a certain distance, which grows with column height and with frequency. A short column behaves like a small box at low frequencies.',
    ],
    uses: [
      ['⛪', 'Worship spaces', 'Slim columns on the front pillars give even speech in a long, reverberant nave.'],
      ['🎤', 'Small venues', 'Fly or raise point-source boxes to 2.5 m or more and tilt them down so the front and back distances are more alike.'],
      ['🏟️', 'Large events', 'Line arrays hang many boxes in a curve to keep the level within about 6 dB over 50 m and more.'],
    ],
    tryit: [
      'Play pink noise from a small speaker. Measure with a phone meter app at 1 m, 2 m and 4 m outdoors; expect about 6 dB less each time.',
      'Indoors, repeat the walk. The level stops falling after a few metres because the room’s reflections take over.',
      'For a hall you know, count the doublings from the nearest to the furthest seat and multiply by 6.',
    ],
    slip: ['Putting the speaker on the floor or at ear height, firing straight into the front row.', 'Raise it and aim it at the furthest seats. The front row should hear the edge of the beam, not the centre.'],
  });

  REAL('a-enclosures', {
    title: 'a first sealed subwoofer box',
    plain: 'A loudspeaker driver in a closed box works like a weight on a spring. The air trapped in the box is an extra spring: a smaller box is a stiffer spring, which raises the lowest note the speaker plays well and makes the bass tighter or boomier.',
    where: 'A workshop bench, building a small sealed bass speaker',
    story: `<p>Ravi has a 20 cm woofer. Its data sheet says it resonates at 40 Hz in free air, has a total Q of 0.40 and an equivalent air volume of 40 litres. He wants clean, tight bass and has room for a 20 litre box.</p>
      <p>He works out what the box does before cutting any wood. The 20 litre box lifts the resonance to about 69 Hz and brings the Q to about 0.69, which is very close to the smooth, well-damped target of 0.7.</p>`,
    numbers: [['Stiffness ratio', '40 L ÷ 20 L = 2'], ['Multiplier', '√(1 + 2) ≈ 1.73'], ['Resonance in the box', '40 Hz × 1.73 ≈ 69 Hz'], ['Q in the box', '0.40 × 1.73 ≈ 0.69 (smooth)'], ['If the box were 10 L', '√5 ≈ 2.24 → 89 Hz, Q 0.89 (boomier)']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A loudspeaker cone on a sealed box with the trapped air acting as a spring">
      <rect x="60" y="50" width="200" height="170" rx="6" fill="var(--panel)" stroke="var(--text)" stroke-width="3"/>
      <g class="rl-shake"><path d="M260 90 L230 115 V155 L260 180 Z" fill="var(--c1)"/></g>
      <text x="160" y="240" text-anchor="middle" font-size="13">sealed box, 20 litres</text>
      <line x1="330" y1="210" x2="610" y2="210" stroke="var(--muted)" stroke-width="2"/>
      <line x1="330" y1="60" x2="330" y2="210" stroke="var(--muted)" stroke-width="2"/>
      <text x="470" y="236" text-anchor="middle" font-size="12" fill="var(--muted)">frequency →</text>
      <text x="344" y="72" font-size="12" fill="var(--muted)">level</text>
      <g data-step="=1"><text x="160" y="36" text-anchor="middle" font-size="13">cone = weight on its own spring</text></g>
      <g data-step="2">${Array.from({ length: 6 }, (_, i) => `<path d="M${90 + i * 22} 110 q8 12 0 24 q-8 12 0 24" stroke="var(--c2)" stroke-width="2.5" fill="none" class="rl-pulse ${['', 'd2', 'd3'][i % 3]}"/>`).join('')}</g>
      <g data-step="=2"><text x="160" y="36" text-anchor="middle" font-size="13" fill="var(--c2)">trapped air is a second spring</text></g>
      <g data-step="3"><path d="M335 205 C390 200 410 110 450 104 H605" stroke="var(--good)" stroke-width="3" fill="none"/>
        <line x1="428" y1="100" x2="428" y2="210" stroke="var(--good)" stroke-width="1.5" stroke-dasharray="4 4"/></g>
      <g data-step="=3"><text x="470" y="50" text-anchor="middle" font-size="13" fill="var(--good)">20 L: 69 Hz, Q 0.69, smooth</text></g>
      <g data-step="4"><path d="M335 207 C420 204 440 74 476 86 C492 96 500 104 520 104 H605" stroke="var(--warn)" stroke-width="3" fill="none" class="rl-pulse"/></g>
      <g data-step="=4"><text x="470" y="50" text-anchor="middle" font-size="13" fill="var(--warn)">10 L: 89 Hz, Q 0.89, a bump</text></g>
      <g data-step="=5"><text x="470" y="50" text-anchor="middle" font-size="13">pick the box for the sound you want</text>
        <rect x="60" y="50" width="200" height="170" rx="6" fill="none" stroke="var(--good)" stroke-width="4" class="rl-pulse"/></g>
    </svg>`,
    steps: [
      ['The driver alone', 'The cone has mass and its suspension is a spring. Together they have a natural frequency, here 40 Hz, and a damping figure called Q, here 0.40.'],
      ['Add the box', 'Closing the back traps air. Push the cone in and the air pushes back, so the total spring is stiffer.'],
      ['Twenty litres', 'The stiffer spring raises the resonance to 69 Hz and the Q to 0.69. Around 0.7 the bass rolls off smoothly with no hump.'],
      ['Ten litres', 'A smaller box is stiffer still: 89 Hz and Q 0.89. There is less deep bass and a small bump that sounds warm but less tight.'],
      ['Choose on purpose', 'Box size is a decision about sound and space. Work it out first, then cut the panels and seal every joint airtight.'],
    ],
    why: [
      'Stiffer springs make things vibrate faster, like a tighter guitar string. A small box is a stiff air spring.',
      'The same multiplier raises both the resonance and the Q, which is why one short sum predicts both.',
      'A leak lets the air spring escape at low frequencies, so an unsealed joint undoes the design.',
    ],
    uses: [
      ['🔊', 'Home subwoofer', 'Pick a box that gives a Q between 0.6 and 0.8 for bass that suits music and film.'],
      ['🚗', 'Car audio', 'Very small boxes push Q above 1; expect a one-note thump around the resonance.'],
      ['🎚️', 'Studio monitors', 'Sealed designs are chosen where a clean stop to each bass note matters more than extension.'],
    ],
    tryit: [
      'Find a driver data sheet and note three numbers: free-air resonance, total Q and equivalent volume.',
      'Divide the equivalent volume by a box volume you like, add 1, and take the square root.',
      'Multiply resonance and Q by that figure. If Q lands above 1, try a bigger box.',
    ],
    slip: ['Choosing the box size to fit the shelf and hoping the bass works out.', 'Run the short sum first. If the space is fixed, choose a driver whose numbers suit that volume.'],
  });

  REAL('a-pa-design', {
    title: 'how many watts for a 200-seat hall',
    plain: 'Designing a sound system starts from the listener: decide how loud it must be at the furthest seat, add spare room for peaks, work back to the loudspeaker, and only then choose the amplifier.',
    where: 'A 200-seat church hall, 20 m from the speakers to the last row',
    story: `<p>The committee asks Grace, a volunteer, “is 100 watts enough?” She cannot answer without knowing the speaker and the distance, so she starts from the other end: speech should reach the last row at about 85 dB, with 10 dB spare so peaks do not distort.</p>
      <p>The speaker they like gives 97 dB at 1 m from 1 watt. Working back from the last row tells her the answer: about 250 watts, so a 300 watt amplifier channel, not 100.</p>`,
    numbers: [['Target at the last row', '85 dB + 10 dB spare = 95 dB'], ['Loss over 20 m', '20 log(20) ≈ 26 dB'], ['Needed at 1 m', '95 + 26 = 121 dB'], ['Above 1 watt (97 dB)', '121 − 97 = 24 dB'], ['Power', '10^(24 ÷ 10) ≈ 250 W']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Working back from the furthest listener to the loudspeaker and amplifier power">
      <line x1="20" y1="210" x2="620" y2="210" stroke="var(--line)" stroke-width="2"/>
      <rect x="20" y="96" width="70" height="44" rx="6" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <text x="55" y="123" text-anchor="middle" font-size="13">amp</text>
      <line x1="90" y1="118" x2="130" y2="118" stroke="var(--muted)" stroke-width="3"/>
      ${spk(130, 96)}${person(570, 160, 'var(--c2)')}
      <text x="570" y="234" text-anchor="middle" font-size="13">last row, 20 m</text>
      <path d="M160 116 H548" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      <g data-step="1"><text x="570" y="140" text-anchor="middle" font-size="14" fill="var(--c2)">95 dB</text></g>
      <g data-step="=1"><text x="330" y="50" text-anchor="middle" font-size="14">start at the listener: 85 + 10 spare</text></g>
      <g data-step="2"><path d="M548 170 H170" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow slow"/>
        <text x="360" y="190" text-anchor="middle" font-size="13" fill="var(--c3)">+26 dB lost over 20 m</text></g>
      <g data-step="=2"><text x="330" y="50" text-anchor="middle" font-size="14">walk back to the speaker</text></g>
      <g data-step="3"><text x="143" y="86" text-anchor="middle" font-size="14" fill="var(--accent)">121 dB</text></g>
      <g data-step="=3"><text x="330" y="50" text-anchor="middle" font-size="14">needed at 1 m: 121 dB</text></g>
      <g data-step="4"><text x="55" y="164" text-anchor="middle" font-size="14" fill="var(--good)">250 W</text>
        <rect x="20" y="96" width="70" height="44" rx="6" fill="none" stroke="var(--good)" stroke-width="3" class="rl-pulse"/></g>
      <g data-step="=4"><text x="330" y="50" text-anchor="middle" font-size="14">24 dB over 1 watt = 250 watts</text></g>
      <g data-step="=5"><text x="330" y="50" text-anchor="middle" font-size="14">check the front row is not too loud</text>
        ${person(250, 160, 'var(--c1)')}</g>
    </svg>`,
    steps: [
      ['Start at the furthest seat', 'Decide the level needed there. Clear speech in a quiet hall is about 85 dB; add 10 dB so loud moments stay clean.'],
      ['Add back the distance loss', 'Sound from a single speaker loses 20 × log(distance) decibels compared with 1 m. For 20 m that is 26 dB.'],
      ['Level needed at 1 m', '95 + 26 = 121 dB at 1 m. Check the speaker’s stated maximum is at least this.'],
      ['Turn decibels into watts', 'The speaker gives 97 dB from 1 W. It needs 24 dB more, and every 10 dB is ten times the power: about 250 W.'],
      ['Check the nearest seat', 'The front row at 4 m would hear 14 dB more than the back. Raise and aim the speaker, or add a delay speaker, to even it out.'],
    ],
    why: [
      'Every 3 dB more needs double the power, so a small change in the target or distance changes the amplifier size a lot.',
      'A more sensitive speaker saves more power than a bigger amplifier: 3 dB more sensitivity halves the watts needed.',
      'Spare room for peaks matters because speech and music peaks sit 10 dB or more above their average level.',
    ],
    uses: [
      ['⛪', 'Halls and worship spaces', 'Work back from the last row; if the answer is over 500 W per speaker, add a second speaker further down the hall.'],
      ['🎉', 'Outdoor events', 'There are no walls to help, so use the full distance loss and add 3 to 6 dB for crowd noise.'],
      ['🏫', 'Classrooms', 'At 8 m, loss is only 18 dB; a few watts into a decent speaker is plenty.'],
    ],
    tryit: [
      'Pick a room and measure, or pace out, the distance to the furthest seat.',
      'Find a speaker’s sensitivity figure (dB at 1 m for 1 W) on its data sheet.',
      'Do the five-line sum above with your own numbers and see what power comes out.',
    ],
    slip: ['Buying by watts on the amplifier label.', 'Choose the level at the listener first, then the speaker, then the amplifier that gives it that power with a little to spare.'],
  });

  REAL('a-install', {
    title: 'the fault found in five minutes',
    plain: 'A good installation is one that is safe, tidy and written down. Every cable has the same label at both ends, every heavy item has a second safety fixing, and a simple drawing shows where everything goes.',
    where: 'A school hall with two wall-mounted speakers and a small rack',
    story: `<p>On a Monday morning the left speaker in the hall is silent. The caretaker opens the rack and finds each cable labelled, with a one-page drawing taped inside the door: “L-SPK: amp channel 1 to left wall speaker”. He follows the label, finds a plug knocked half out during cleaning, pushes it home, and is done in five minutes.</p>
      <p>The same fault in the old hall, with unlabelled cables behind a cupboard, once took an engineer half a day. The speakers themselves were hung by a qualified installer on rated brackets, each with a separate steel safety wire to the wall.</p>`,
    numbers: [['Speaker weight', '25 kg'], ['Bracket rated working load', '50 kg (stated by its maker)'], ['Second fixing', 'steel safety wire to its own anchor'], ['Labels', 'same name at both ends of every cable'], ['Time to find the fault', '5 minutes instead of hours']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A wall loudspeaker with a bracket and safety wire, a labelled cable and an equipment rack">
      <line x1="560" y1="20" x2="560" y2="240" stroke="var(--text)" stroke-width="4"/>
      <rect x="486" y="70" width="50" height="76" rx="5" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <circle cx="511" cy="118" r="14" fill="none" stroke="var(--text)" stroke-width="2"/><circle cx="511" cy="88" r="5" fill="var(--text)"/>
      <rect x="40" y="90" width="90" height="130" rx="6" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      ${[108, 136, 164, 192].map((y) => `<rect x="50" y="${y}" width="70" height="18" rx="3" fill="var(--panel2)" stroke="var(--muted)"/>`).join('')}
      <text x="85" y="240" text-anchor="middle" font-size="13">rack</text>
      <path d="M130 118 H300 V190 H511 V146" stroke="var(--muted)" stroke-width="3" fill="none"/>
      <g data-step="1"><path d="M536 108 H560" stroke="var(--c1)" stroke-width="7"/>
        <text x="470" y="60" text-anchor="middle" font-size="13">rated bracket</text></g>
      <g data-step="2"><path d="M524 70 Q545 40 560 44" stroke="var(--good)" stroke-width="2.5" fill="none" class="rl-pulse"/>
        <circle cx="560" cy="44" r="5" fill="var(--good)"/>
        <text x="598" y="28" text-anchor="middle" font-size="12">safety wire</text></g>
      <g data-step="3"><rect x="140" y="106" width="52" height="20" rx="4" fill="var(--accent)"/><text x="166" y="121" text-anchor="middle" font-size="12" style="fill:var(--accent-ink)">L-SPK</text>
        <rect x="440" y="180" width="52" height="20" rx="4" fill="var(--accent)"/><text x="466" y="195" text-anchor="middle" font-size="12" style="fill:var(--accent-ink)">L-SPK</text></g>
      <g data-step="4"><rect x="218" y="24" width="150" height="56" rx="6" fill="var(--panel)" stroke="var(--c2)" stroke-width="2"/>
        <text x="293" y="46" text-anchor="middle" font-size="12" fill="var(--c2)">drawing in the rack door</text>
        <path d="M232 62 H286 V70 H354" stroke="var(--c2)" stroke-width="2" fill="none"/></g>
      <g data-step="5"><path d="M130 118 H300 V190 H511 V146" stroke="var(--good)" stroke-width="3" fill="none" class="rl-flow"/>
        <circle cx="130" cy="118" r="9" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/></g>
    </svg>`,
    steps: [
      ['Hang it on rated hardware', 'The bracket and its wall fixings carry a stated working load well above the speaker’s weight. A qualified installer chooses fixings to suit the wall.'],
      ['Add a second fixing', 'A separate steel safety wire goes to its own anchor. If the bracket ever fails, the speaker cannot fall.'],
      ['Label both ends', 'The cable carries the same short name at the rack and at the speaker, so nobody has to guess or trace it by hand.'],
      ['Leave a drawing', 'One page showing what connects to what lives inside the rack door, with a copy in the office.'],
      ['Fault-finding becomes following', 'When something stops working, you follow the label and the drawing straight to the problem.'],
    ],
    why: [
      'Anything above people’s heads must stay up even if one part fails, which is why there are always two independent fixings.',
      'Memory fades and staff change; labels and drawings do not. The person fixing a fault is rarely the person who installed it.',
      'Tidy cables with a little slack are not pulled, bent sharply or knocked out, so there are fewer faults to find.',
    ],
    uses: [
      ['🏫', 'Schools and halls', 'A one-page drawing and labels let non-technical staff fix the most common faults themselves.'],
      ['🎚️', 'Studios', 'Number every tie-line at both wall plates and on the patchbay so a session never stops for a mystery cable.'],
      ['🎪', 'Touring', 'Colour-code looms by destination (stage left, stage right, front of house) to halve the set-up time.'],
    ],
    tryit: [
      'Pick one system you use, even a home hi-fi, and sketch what plugs into what on one page.',
      'Label each cable at both ends with masking tape and a pen, using the names from your sketch.',
      'Unplug one cable at random a week later and time how long it takes to put it back correctly.',
    ],
    slip: ['Hanging a speaker yourself from whatever screws and plugs are to hand.', 'Overhead loads need rated hardware, a second safety fixing and a competent installer. Do the labelling and drawings yourself; leave the rigging to them.'],
  });

  REAL('a-tuning', {
    title: 'the delay speaker that made speech muddy',
    plain: 'When a second loudspeaker further down a hall plays the same sound, it reaches nearby listeners before the sound from the main speaker does. The two arrivals blur the words. Holding the second speaker back by the right fraction of a second lines them up.',
    where: 'A long community hall with a main speaker at the stage and a helper speaker halfway down',
    story: `<p>Speech at the back of the hall is loud enough since Leela added a helper speaker 17 m from the stage, but people say it sounds “double” and seems to come from the side wall instead of the stage.</p>
      <p>She measures the distance, sets a delay of 50 ms on the helper speaker, then adds 10 ms more. The double sound disappears, the voice seems to come from the stage again, and nothing was turned up.</p>`,
    numbers: [['Main speaker to helper speaker', '17 m'], ['Travel time', '17 ÷ 343 ≈ 50 ms'], ['Extra so the stage is heard first', '+10 ms'], ['Delay to set', '≈ 60 ms'], ['Helper level', 'no more than about 10 dB above the main, at the seat']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A main loudspeaker and a delayed helper loudspeaker reaching a listener at the back of a hall">
      <line x1="20" y1="214" x2="620" y2="214" stroke="var(--line)" stroke-width="2"/>
      ${spk(40, 110, 'var(--c1)')}${spk(330, 60, 'var(--c2)')}${person(560, 166, 'var(--text)')}
      <text x="53" y="236" text-anchor="middle" font-size="13">main</text>
      <text x="343" y="48" text-anchor="middle" font-size="13">helper, 17 m on</text>
      <text x="560" y="236" text-anchor="middle" font-size="13">back row</text>
      <g data-step="1"><path d="M70 130 H540" stroke="var(--c1)" stroke-width="3" fill="none" class="rl-flow slow"/></g>
      <g data-step="=1"><text x="200" y="118" text-anchor="middle" font-size="13" fill="var(--c1)">main: long trip, arrives late</text></g>
      <g data-step="2"><path d="M360 84 L545 160" stroke="var(--c2)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="470" y="92" text-anchor="middle" font-size="13" fill="var(--c2)">helper: short trip, arrives first</text></g>
      <g data-step="=3"><circle cx="560" cy="176" r="26" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow"/>
        <circle cx="560" cy="176" r="26" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow d2"/>
        <text x="200" y="180" text-anchor="middle" font-size="13" fill="var(--bad)">two arrivals 50 ms apart: blurred</text></g>
      <g data-step="4"><rect x="296" y="100" width="94" height="26" rx="5" fill="var(--good)"/>
        <text x="343" y="118" text-anchor="middle" font-size="13" style="fill:var(--bg)">wait 60 ms</text></g>
      <g data-step="=5"><circle cx="560" cy="176" r="26" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/>
        <text x="200" y="180" text-anchor="middle" font-size="13" fill="var(--good)">one clear arrival, from the stage</text></g>
    </svg>`,
    steps: [
      ['The main speaker', 'Its sound has to cross the whole hall. By the time it reaches the back it is quiet and late.'],
      ['The helper speaker', 'It is close to the back rows, so its sound is loud and arrives almost at once.'],
      ['Two arrivals', 'The listener hears the helper first and the main about 50 ms later. Gaps over about 30 ms are heard as a smear or an echo on speech.'],
      ['Hold the helper back', 'Delay the helper by the travel time between the two speakers, 17 ÷ 343 ≈ 50 ms, plus about 10 ms.'],
      ['One sound from the stage', 'The main now arrives just first, so the ear locates the voice at the stage, and the helper quietly adds loudness and clarity.'],
    ],
    why: [
      'Sound is slow: about 3 ms per metre. Electricity in the cable is effectively instant, so the far speaker gets the signal long before the air carries it there.',
      'The ear decides where a sound comes from by which copy arrives first, as long as the later one is not much louder.',
      'Timing problems cannot be fixed with tone controls. Set delay first, then level, and only then touch the EQ.',
    ],
    uses: [
      ['⛪', 'Long halls', 'One delay per row of helper speakers: distance from the main in metres × 2.9 ms, plus 10 ms.'],
      ['🔊', 'Subwoofer to main speakers', 'Delay whichever is closer to the listener so their sound lines up at the crossover frequency.'],
      ['🎪', 'Outdoor delay towers', 'Re-check on the day: a 10 °C change in temperature alters the speed of sound by about 2 %.'],
    ],
    tryit: [
      'Measure, or pace, the distance between two speakers in a hall you know. Multiply the metres by 2.9 to get milliseconds.',
      'With two phones or a phone and a speaker playing the same radio stream out of time, hear how a small offset smears speech.',
      'If the system has a delay setting, compare 0 ms, the calculated value and the value plus 10 ms from the back row.',
    ],
    slip: ['Turning up the treble on the helper speaker to make speech clearer.', 'Set the delay first. Most “muddy” complaints from helper speakers are timing, not tone.'],
  });

  REAL('a-measure-depth', {
    title: 'measuring a speaker without the room',
    plain: 'When you measure a loudspeaker in an ordinary room, the microphone hears the speaker first and the room’s reflections a few thousandths of a second later. If you keep only the first part of the recording, you see the speaker alone, but you lose the ability to judge the bass.',
    where: 'A living room, with a speaker on a stand and a measurement microphone 1 m away',
    story: `<p>Nikhil has built a pair of speakers and wants to see their response. His first measurement looks like a comb, full of deep dips. He suspects the speaker, but the dips move when he raises the stand.</p>
      <p>The culprit is the floor. With speaker and microphone both 1.2 m high and 1 m apart, the floor bounce travels 1.6 m further and arrives 4.7 ms late. He sets the analyser’s time window to end just before that and the comb vanishes. The cost: the trace is only trustworthy above about 215 Hz.</p>`,
    numbers: [['Direct path', '1.0 m'], ['Floor-bounce path', '2 × √(0.5² + 1.2²) = 2.6 m'], ['Extra time', '1.6 ÷ 343 ≈ 4.7 ms'], ['Window length', 'about 4.7 ms'], ['Lowest trustworthy frequency', '1 ÷ 0.0047 ≈ 215 Hz']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Direct sound and a floor reflection reaching a microphone, with a time window cutting off the reflection">
      <line x1="20" y1="170" x2="300" y2="170" stroke="var(--text)" stroke-width="3"/>
      ${spk(40, 40)}
      <circle cx="262" cy="60" r="7" fill="var(--c2)"/><line x1="262" y1="67" x2="262" y2="170" stroke="var(--muted)" stroke-width="2"/>
      <line x1="53" y1="76" x2="53" y2="170" stroke="var(--muted)" stroke-width="2"/>
      <text x="262" y="44" text-anchor="middle" font-size="12">mic</text>
      <line x1="340" y1="170" x2="620" y2="170" stroke="var(--muted)" stroke-width="2"/>
      <text x="480" y="192" text-anchor="middle" font-size="12" fill="var(--muted)">time →</text>
      <g data-step="1"><path d="M70 60 H252" stroke="var(--good)" stroke-width="3" fill="none" class="rl-flow"/>
        <path d="M370 170 V70" stroke="var(--good)" stroke-width="5"/></g>
      <g data-step="=1"><text x="160" y="28" text-anchor="middle" font-size="13" fill="var(--good)">direct: 1.0 m</text></g>
      <g data-step="2"><path d="M66 70 L160 168 L256 66" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/>
        <path d="M470 170 V110" stroke="var(--bad)" stroke-width="5" class="rl-pulse"/></g>
      <g data-step="=2"><text x="160" y="28" text-anchor="middle" font-size="13" fill="var(--bad)">floor bounce: 2.6 m, 4.7 ms late</text></g>
      <g data-step="=3"><path d="M350 240 q15 -30 30 0 q15 30 30 0 q15 -30 30 0 q15 30 30 0 q15 -30 30 0 q15 30 30 0 q15 -30 30 0 q15 30 30 0" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-pulse"/>
        <text x="160" y="28" text-anchor="middle" font-size="13" fill="var(--bad)">together: a comb of dips</text></g>
      <g data-step="4"><rect x="352" y="56" width="104" height="116" rx="4" fill="var(--accent)" opacity=".25"/>
        <line x1="456" y1="50" x2="456" y2="176" stroke="var(--accent)" stroke-width="3"/>
        <text x="404" y="46" text-anchor="middle" font-size="12" fill="var(--accent)">keep this part</text></g>
      <g data-step="=4"><text x="160" y="28" text-anchor="middle" font-size="13" fill="var(--accent)">window ends before the bounce</text></g>
      <g data-step="=5"><path d="M420 220 H610" stroke="var(--good)" stroke-width="3" fill="none"/>
        <path d="M350 232 C385 232 400 222 420 220" stroke="var(--warn)" stroke-width="3" fill="none" stroke-dasharray="4 5" class="rl-pulse"/>
        <text x="420" y="250" text-anchor="middle" font-size="12">dashed part: below 215 Hz, unknown</text>
        <text x="160" y="28" text-anchor="middle" font-size="13" fill="var(--good)">speaker alone, above 215 Hz</text></g>
    </svg>`,
    steps: [
      ['The direct sound arrives', 'It takes the shortest path, 1 m, and shows on the time picture as the first tall spike.'],
      ['The floor bounce follows', 'Its path is 2.6 m, so it arrives 4.7 ms later as a second, smaller spike.'],
      ['Together they make a comb', 'At some frequencies the bounce cancels the direct sound, at others it adds. The response fills with dips that belong to the room, not the speaker.'],
      ['Cut the recording short', 'Tell the analyser to use only the first 4.7 ms. The bounce is thrown away before it is analysed.'],
      ['Read the result honestly', 'The trace now shows the speaker alone, but a window this short cannot show anything slower than about 215 Hz. Bass needs a different method, such as a very close microphone.'],
    ],
    why: [
      'A reflection is a late copy. Adding a late copy to the original always produces evenly spaced dips, like two ripples meeting in a pond.',
      'To see one full cycle of a low note you must record at least that long. A 4.7 ms window is shorter than one cycle of anything below 215 Hz.',
      'Raising speaker and microphone delays the bounce, which is why measurements are often made high up or outdoors.',
    ],
    uses: [
      ['🔧', 'Speaker building', 'Raise the speaker and mic to mid-height in the room to push the first bounce beyond 5 ms.'],
      ['🎚️', 'Checking a studio monitor', 'Window out the desk and floor reflections to see whether a dip is the speaker or the room.'],
      ['🏟️', 'Tuning a PA', 'Use a longer window in a big room at a distance; the room is part of what the audience hears.'],
    ],
    tryit: [
      'For your own speaker and mic heights, work out the bounce path: 2 × √((distance ÷ 2)² + height²).',
      'Subtract the direct distance, divide by 343, and you have the latest your window can end.',
      'Divide 1 by that time in seconds to find the lowest frequency you can trust.',
    ],
    slip: ['Reading the bass from a windowed measurement and “fixing” it with EQ.', 'Below the limit set by the window, the trace is a guess. Measure bass with the mic a few centimetres from the cone, or in the room with the full recording.'],
  });

  REAL('a-feedback', {
    title: 'the lectern microphone that howls',
    plain: 'Feedback is a loop: the microphone hears the loudspeaker, the system makes that louder, the loudspeaker plays it again, and round it goes. The cure is to make the talker louder at the microphone than the loudspeaker is, mostly by getting the microphone closer to the mouth.',
    where: 'A school assembly with a microphone on a lectern',
    story: `<p>The head teacher stands 30 cm back from the lectern microphone. To be heard at the back, the operator pushes the level up until the system rings and then howls. He backs it off and now nobody can hear.</p>
      <p>The operator lowers the stand so the microphone sits 5 cm from her mouth. Her voice is now far stronger at the microphone, so he can turn the system down a lot, well clear of the howl, and she is louder in the hall than before.</p>`,
    numbers: [['Mouth to microphone, before', '30 cm'], ['Mouth to microphone, after', '5 cm'], ['Voice gets stronger at the mic by', '20 log(30 ÷ 5) ≈ 15.6 dB'], ['Loudspeaker sound at the mic', 'unchanged'], ['Extra safe loudness', 'about 15 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A feedback loop from loudspeaker to microphone to amplifier and back">
      ${person(120, 86, 'var(--c1)')}
      <rect x="300" y="170" width="80" height="44" rx="6" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <text x="340" y="197" text-anchor="middle" font-size="13">mixer + amp</text>
      ${spk(520, 70)}
      <path d="M240 192 H300 M380 192 H533 V106" stroke="var(--muted)" stroke-width="3" fill="none"/>
      <g data-step="1-3"><line x1="240" y1="100" x2="240" y2="192" stroke="var(--muted)" stroke-width="3"/><circle cx="240" cy="94" r="9" fill="var(--c2)"/></g>
      <g data-step="=1"><path d="M132 90 H228" stroke="var(--c1)" stroke-width="2" fill="none" class="rl-flow slow"/>
        <text x="330" y="36" text-anchor="middle" font-size="13">30 cm away: weak voice at the mic</text></g>
      <g data-step="2-3"><path d="M518 88 Q380 20 250 88" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/>
        <path d="M240 192 H300 M380 192 H533 V106" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="330" y="36" text-anchor="middle" font-size="13" fill="var(--bad)">turned up: the mic hears the speaker</text></g>
      <g data-step="=3"><circle cx="533" cy="88" r="30" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow"/>
        <circle cx="533" cy="88" r="30" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow d2"/>
        <text x="330" y="36" text-anchor="middle" font-size="13" fill="var(--bad)">round and round: it howls</text></g>
      <g data-step="4"><path d="M150 100 V192 H300" stroke="var(--muted)" stroke-width="3" fill="none"/><circle cx="150" cy="94" r="9" fill="var(--good)"/>
        <path d="M132 90 H142" stroke="var(--c1)" stroke-width="5"/></g>
      <g data-step="=4"><text x="330" y="36" text-anchor="middle" font-size="13" fill="var(--good)">5 cm away: voice 15.6 dB stronger</text></g>
      <g data-step="5"><path d="M518 88 Q380 40 162 90" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-dasharray="3 6"/></g>
      <g data-step="=5"><text x="330" y="36" text-anchor="middle" font-size="13" fill="var(--good)">gain down 15 dB: loop too weak to ring</text></g>
    </svg>`,
    steps: [
      ['A weak voice at the microphone', 'At 30 cm the voice has already spread out. The microphone needs a lot of amplification to make it loud in the hall.'],
      ['The microphone hears the hall', 'With the level that high, sound from the loudspeaker reaching the microphone is nearly as strong as the voice.'],
      ['The loop closes', 'Once the loudspeaker sound comes back to the microphone as strong as it left, each trip round makes it louder. One frequency takes off as a howl.'],
      ['Move the microphone closer', 'At 5 cm the voice is 15.6 dB stronger at the microphone, while the loudspeaker sound there has not changed.'],
      ['Turn the system down', 'The same loudness in the hall now needs 15 dB less amplification, so the loop is far too weak to sustain itself.'],
    ],
    why: [
      'Close to a small source, level changes fast with distance: halving the distance gives about 6 dB. The loudspeaker is metres away, so a few centimetres make no difference to it.',
      'A loop only howls when a full trip round gives back at least as much as went in. Anything that weakens one part of the loop restores stability.',
      'Tone controls can remove one ringing frequency, but another soon takes its place. Distance fixes all frequencies at once.',
    ],
    uses: [
      ['🎤', 'Speeches', 'A headset or lapel microphone keeps the distance fixed at a few centimetres however the talker moves.'],
      ['🎸', 'Bands', 'Keep loudspeakers in front of the microphone line and point each microphone’s least sensitive side at the nearest speaker.'],
      ['⛪', 'Worship and meetings', 'Mute microphones nobody is using: each extra open microphone costs up to 3 dB of safe level.'],
    ],
    tryit: [
      'Record your voice on a phone at 30 cm and then at 5 cm, speaking equally loudly, and compare the meter levels.',
      'At a venue, walk the line between microphone and loudspeaker and note whether the loudspeaker is in front of or behind the microphone.',
      'Ask the talker to hold a fist between chin and microphone as a distance guide.',
    ],
    slip: ['Pulling down sliders on a graphic equaliser every time it rings.', 'First get the microphone closer and the loudspeakers further forward. Use the equaliser only for the last few decibels.'],
  });

  REAL('a-intelligibility', {
    title: 'loud announcements nobody understands',
    plain: 'Speech is understood when the sound coming straight from the loudspeaker is stronger than the echoing wash of the room. In a big echoing space that only holds for a few metres, unless the loudspeaker aims its sound tightly at the listeners.',
    where: 'A 3000 m³ temple hall with marble floors and a 3 second reverberation time',
    story: `<p>Announcements in the hall are plenty loud, yet beyond the first few rows nobody can make out the words. The committee’s plan is a bigger amplifier.</p>
      <p>A consultant, Dev, shows why that will not help: the existing wide-angle speakers put most of their sound onto walls and ceiling. With those, the direct sound wins only out to about 2.5 m. He replaces them with narrow column speakers aimed at the congregation and adds more of them down the hall, so every listener sits within about 6 m of one.</p>`,
    numbers: [['Room volume, reverberation time', '3000 m³, 3 s'], ['Wide speaker (directivity 2)', '0.057 × √(2 × 3000 ÷ 3) ≈ 2.5 m'], ['Narrow column (directivity 10)', '0.057 × √(10 × 3000 ÷ 3) ≈ 5.7 m'], ['Design rule used', 'keep listeners within about this distance'], ['Result', 'more speakers, each quieter and closer']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Direct sound and reverberant sound in a large hall, with wide and narrow loudspeakers">
      <rect x="20" y="24" width="600" height="196" rx="6" fill="none" stroke="var(--text)" stroke-width="3"/>
      ${spk(40, 90)}${person(200, 150, 'var(--c1)')}${person(480, 150, 'var(--c2)')}
      <text x="200" y="140" text-anchor="middle" font-size="12">2 m</text><text x="480" y="140" text-anchor="middle" font-size="12">12 m</text>
      <g data-step="1"><path d="M70 110 H186" stroke="var(--good)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1"><text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--good)">direct sound: clear, but fades fast</text></g>
      <g data-step="2-3"><path d="M66 96 L300 28 L460 216 L600 80" stroke="var(--bad)" stroke-width="2" fill="none" class="rl-flow slow"/>
        <path d="M66 120 L240 216 L420 28 L610 180" stroke="var(--bad)" stroke-width="2" fill="none" class="rl-flow slow d2"/></g>
      <g data-step="=2"><text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--bad)">echoing wash: same level everywhere</text></g>
      <g data-step="=3"><line x1="236" y1="30" x2="236" y2="216" stroke="var(--warn)" stroke-width="2" stroke-dasharray="6 5"/>
        <text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--warn)">beyond 2.5 m the wash wins</text></g>
      <g data-step="4"><rect x="46" y="84" width="14" height="48" fill="var(--c3)"/>
        <path d="M70 100 L330 150 M70 116 L330 172" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/>
        <line x1="348" y1="30" x2="348" y2="216" stroke="var(--good)" stroke-width="2" stroke-dasharray="6 5"/></g>
      <g data-step="=4"><text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--c3)">narrow beam on people: clear to 5.7 m</text></g>
      <g data-step="5">${spk(380, 60, 'var(--c3)')}<path d="M406 96 L470 150" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=5"><text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--good)">add a second speaker for the far rows</text></g>
    </svg>`,
    steps: [
      ['Direct sound', 'Sound straight from the loudspeaker carries the crisp consonants. It gets weaker with every step away.'],
      ['Reverberant sound', 'Sound that has bounced many times fills the hall evenly. It is a blur of everything said in the last few seconds.'],
      ['Where they cross', 'At the critical distance the two are equal. With a wide speaker in this hall that is only about 2.5 m. Further back, the blur is louder than the words.'],
      ['Aim the sound', 'A narrow column puts its energy on the listeners instead of the walls. Less wash is created, and the clear zone grows to about 5.7 m.'],
      ['Bring speakers closer', 'More speakers, each covering a short distance and delayed to match, keep every seat inside a clear zone. Soft finishes that shorten the reverberation help too.'],
    ],
    why: [
      'A bigger amplifier raises the direct sound and the wash by the same amount, so the balance between them does not change at all.',
      'Sound that lands on people and soft seats is absorbed; sound that lands on marble keeps bouncing. Aim decides which happens.',
      'Consonants are short and quiet. A 3 second tail from the previous word easily covers them.',
    ],
    uses: [
      ['🚉', 'Stations and airports', 'Many small speakers close to people, each quiet, instead of a few loud horns.'],
      ['⛪', 'Worship spaces', 'Slim columns on pillars, tilted to the congregation, with delays set down the hall.'],
      ['🚨', 'Voice alarm', 'Systems are measured for speech clarity (STI), because an evacuation message that is loud but unclear fails.'],
    ],
    tryit: [
      'In an echoing space, have a friend read a list of similar words (pat, bat, cat, mat) and walk away until you start getting them wrong.',
      'Note that distance: it is roughly the critical distance for a human talker in that room.',
      'Ask them to speak louder. Notice that you still cannot tell the words apart.',
    ],
    slip: ['Turning the system up when people say they cannot understand.', 'Improve the balance instead: narrower speakers aimed at people, speakers closer to listeners, or less reverberation.'],
  });

  REAL('a-monitoring', {
    title: 'the singer who cannot hear herself',
    plain: 'A stage monitor lets a performer hear themselves. A vocal microphone is almost deaf in one direction, straight behind it. Put the monitor exactly there and it can be much louder before the system starts to ring.',
    where: 'A small club stage with one floor monitor and one vocal microphone',
    story: `<p>Maya keeps asking for “more me” in her floor monitor. It sits off to her side, and every time the engineer raises it, the system starts to ring. The band is not especially loud; the monitor is simply in the wrong place.</p>
      <p>The engineer moves the wedge to sit directly behind the microphone, pointing up at her face, in line with the microphone’s tail. Now he can raise it well beyond the old ringing point, and she can hear herself at a lower, more comfortable overall level than before.</p>`,
    numbers: [['Cardioid mic pickup at the side (90°)', 'about −6 dB'], ['Pickup straight behind (180°)', 'about −20 dB or lower'], ['Extra monitor level before ringing', 'roughly 20 − 6 = 14 dB'], ['Monitor distance to her ears', 'about 1.5 m'], ['Keep stage level', 'as low as lets her sing in tune']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Top view of a singer, a cardioid microphone and a floor monitor placed at the side and then behind the microphone">
      ${person(470, 100, 'var(--c1)')}
      <text x="470" y="170" text-anchor="middle" font-size="13">singer</text>
      <path d="M380 110 C330 50 250 80 250 110 C250 140 330 170 380 110 Z" fill="var(--c2)" opacity=".18" stroke="var(--c2)" stroke-width="2" transform="rotate(180 340 110)"/>
      <circle cx="400" cy="110" r="8" fill="var(--c2)"/><line x1="400" y1="110" x2="372" y2="110" stroke="var(--c2)" stroke-width="5"/>
      <text x="386" y="84" text-anchor="middle" font-size="12" fill="var(--c2)">mic</text>
      <g data-step="=1"><text x="200" y="36" text-anchor="middle" font-size="13">the shaded shape is where the mic listens</text>
        <path d="M455 110 H412" stroke="var(--c1)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="2-3"><rect x="366" y="186" width="68" height="34" rx="5" fill="var(--panel)" stroke="var(--bad)" stroke-width="2"/><text x="400" y="208" text-anchor="middle" font-size="12">monitor</text>
        <path d="M400 186 V124" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="200" y="36" text-anchor="middle" font-size="13" fill="var(--bad)">monitor at the side: mic hears it</text></g>
      <g data-step="=3"><circle cx="400" cy="110" r="24" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow"/>
        <text x="200" y="36" text-anchor="middle" font-size="13" fill="var(--bad)">raise it and the system rings</text></g>
      <g data-step="4"><rect x="138" y="92" width="68" height="36" rx="5" fill="var(--panel)" stroke="var(--good)" stroke-width="2"/><text x="172" y="115" text-anchor="middle" font-size="12">monitor</text>
        <path d="M206 100 Q330 40 458 96" stroke="var(--good)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=4"><text x="200" y="160" text-anchor="middle" font-size="13" fill="var(--good)">monitor behind the mic: its deaf spot</text></g>
      <g data-step="=5"><text x="200" y="160" text-anchor="middle" font-size="13" fill="var(--good)">about 14 dB more before ringing</text>
        <circle cx="470" cy="100" r="22" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/></g>
    </svg>`,
    steps: [
      ['How the microphone listens', 'A cardioid microphone hears best in front, less at the sides and least straight behind. Seen from above, its sensitivity is heart-shaped.'],
      ['Monitor at the side', 'From the side the microphone still picks up half of what the monitor sends. That sound goes round the loop again.'],
      ['The ringing point arrives early', 'Raise the monitor a little and the loop closes: one frequency starts to sing on its own.'],
      ['Monitor in the deaf spot', 'Directly behind the microphone the pickup is about 20 dB down, yet the monitor still points straight at the singer’s face.'],
      ['Louder for her, quieter overall', 'The monitor can now go about 14 dB higher before ringing. In practice use a few decibels of that and keep the rest as safety.'],
    ],
    why: [
      'Feedback depends on how much monitor sound gets into the microphone, not on how loud it is at the singer’s ears. Placement changes the first without hurting the second.',
      'Different microphones are deaf in different places: a supercardioid’s quietest directions are about 125° either side, so two wedges angled there suit it better.',
      'Lower stage level means less spill into every microphone and less strain on everyone’s hearing.',
    ],
    uses: [
      ['🎤', 'Lead vocal', 'One wedge on the microphone’s tail for a cardioid; a pair at about 125° for a supercardioid.'],
      ['🥁', 'Drummers', 'A small side fill or in-ear monitors beat a huge wedge fighting the kit.'],
      ['🎧', 'In-ear monitors', 'Removing wedges altogether can drop stage level by 10 dB or more; set in-ear volume low to protect hearing.'],
    ],
    tryit: [
      'Look up the pickup pattern of a microphone you use and find the angle where it is least sensitive.',
      'Speak into the microphone’s front, side and back while watching the input meter. Note the drop in each direction.',
      'Sketch your stage from above and mark where each monitor sits compared with that quiet angle.',
    ],
    slip: ['Answering every “more me” by turning the monitor up.', 'First aim the monitor at the performer’s head from the microphone’s quiet side, and turn down whatever is masking them. Keep levels moderate: ears do not recover from loud stages.'],
  });

  REAL('a-workflow', {
    title: 'working backwards from doors at seven',
    plain: 'Professional sound work follows the same order every time: find out what is needed, plan, set up, check every line, rehearse, run the show, pack down and save the files. Planning the day backwards from the moment the audience arrives stops the checks being squeezed out.',
    where: 'A wedding reception with a five-piece band and speeches',
    story: `<p>Sana is engineering her first wedding. Doors open at 19:00. On her previous gig she arrived “with plenty of time” and still ended up line-checking while guests walked in, because nobody had told her the venue’s power was at the far end of the room.</p>
      <p>This time she phones the venue and the band a week ahead, writes a one-page plan, and sets times backwards from doors. A dead cable shows up at the line check with an hour to spare, and she swaps it without anyone noticing.</p>`,
    numbers: [['Doors', '19:00'], ['Quiet room, playlist on', '18:30'], ['Sound check with the band', '17:00 – 18:15 (75 min)'], ['Line check, every input', '16:30 – 17:00'], ['Load in and set up', '14:30 – 16:30 (2 h)']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A timeline of a show day planned backwards from doors">
      <line x1="40" y1="150" x2="600" y2="150" stroke="var(--muted)" stroke-width="4"/>
      ${[[60, 'advance'], [180, 'load in'], [290, 'line check'], [400, 'sound check'], [500, 'show'], [585, 'archive']].map(([x, t]) => `<circle cx="${x}" cy="150" r="9" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><text x="${x}" y="184" text-anchor="middle" font-size="12">${t}</text>`).join('')}
      <g data-step="=1"><circle cx="60" cy="150" r="16" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-grow"/>
        <text x="320" y="60" text-anchor="middle" font-size="14">a week before: ask, list, draw</text></g>
      <g data-step="=2"><path d="M500 120 H180" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/>
        <text x="320" y="60" text-anchor="middle" font-size="14" fill="var(--c3)">set times backwards from doors</text>
        <text x="500" y="110" text-anchor="middle" font-size="12" fill="var(--c3)">19:00</text><text x="180" y="110" text-anchor="middle" font-size="12" fill="var(--c3)">14:30</text></g>
      <g data-step="=3"><circle cx="290" cy="150" r="16" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow"/>
        <text x="320" y="60" text-anchor="middle" font-size="14" fill="var(--bad)">line check finds a dead cable</text></g>
      <g data-step="=4"><circle cx="400" cy="150" r="16" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/>
        <text x="320" y="60" text-anchor="middle" font-size="14" fill="var(--good)">sound check is for music, not faults</text></g>
      <g data-step="5"><path d="M40 150 H585" stroke="var(--good)" stroke-width="4" fill="none" class="rl-flow slow"/></g>
      <g data-step="=5"><text x="320" y="60" text-anchor="middle" font-size="14">show, pack down, save and label files</text></g>
    </svg>`,
    steps: [
      ['Advance', 'A week ahead, ask the venue about power, access and room size, and ask the band for an input list and stage plan. Write one page everyone can read.'],
      ['Plan backwards', 'Start from doors and subtract: quiet time, sound check, line check, set-up. The result tells you when to arrive, here 14:30.'],
      ['Line check', 'Before the band plays a note, tap or speak into every input and confirm it arrives on the right channel. Faults found here cost minutes.'],
      ['Sound check', 'With all lines proven, the band’s time goes on balance and monitors, loudest instruments first.'],
      ['Show, strike, archive', 'Run the show from your notes, pack down in reverse order, and save the mixer file and any recording with the date and venue in the name.'],
    ],
    why: [
      'Most show-day disasters are known faults found too late. A fixed order finds them while there is still time to fix them.',
      'Working backwards exposes an impossible schedule a week ahead, when it can still be changed.',
      'Saved files and notes turn every job into a head start on the next one at that venue.',
    ],
    uses: [
      ['🎉', 'Weddings and corporate events', 'Speeches matter most: check the handheld and a spare before anything else.'],
      ['🎙️', 'Recording sessions', 'The same order applies: advance, set up, line check, get sounds, record, back up twice.'],
      ['🏫', 'School productions', 'A printed cue sheet and a named person per microphone prevent most first-night problems.'],
    ],
    tryit: [
      'Take an event you know and write its doors time at the bottom of a page.',
      'Work upwards, subtracting quiet time, sound check, line check and set-up, to find the arrival time.',
      'Write the five questions you would ask the venue by phone a week before.',
    ],
    slip: ['Starting the sound check before every line has been proven.', 'Do a full line check first. Then the band’s time is spent on how it sounds, not on hunting a dead cable.'],
  });

  REAL('a-immersive', {
    title: 'the surround mix that distorts on a television',
    plain: 'A surround mix often ends up played on two speakers. The player folds the centre and surround channels into left and right at a reduced level. If the mix was already near full level, the fold-down can overload, so leave room for it and always listen to the two-speaker version.',
    where: 'A small post-production room finishing a short film in 5.1',
    story: `<p>Meera’s 5.1 mix sounds excellent in her room. On the director’s television, loud scenes crackle. Her mix never clipped, so what went wrong?</p>
      <p>The television folded six channels into two. In the loud scene her left channel peaks at −3 dBFS and the dialogue in the centre at −6 dBFS. The fold-down adds the centre to the left at 0.707 of its level, and the sum goes just over full scale. She lowers the mix by 2 dB, checks the fold-down in her room, and the crackle is gone.</p>`,
    numbers: [['Left peak, −3 dBFS', '0.708 of full scale'], ['Centre peak, −6 dBFS', '0.501 of full scale'], ['Centre into left at −3 dB', '0.501 × 0.707 ≈ 0.354'], ['Fold-down left', '0.708 + 0.354 = 1.06 → clips'], ['Fix', 'leave about 2 dB more room, then re-check']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Five surround channels folding down into left and right stereo channels">
      ${[['L', 120, 60, 'var(--c1)'], ['C', 320, 40, 'var(--c2)'], ['R', 520, 60, 'var(--c1)'], ['Ls', 150, 190, 'var(--c3)'], ['Rs', 490, 190, 'var(--c3)']].map(([t, x, y, c]) => `<rect x="${x - 22}" y="${y - 16}" width="44" height="32" rx="6" fill="var(--panel)" stroke="${c}" stroke-width="2.5"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="13" fill="${c}">${t}</text>`).join('')}
      <circle cx="320" cy="140" r="10" fill="var(--text)"/>
      <g data-step="=1"><text x="320" y="246" text-anchor="middle" font-size="13">five speakers around the listener</text>
        ${[[120, 60], [320, 40], [520, 60], [150, 190], [490, 190]].map(([x, y], i) => `<path d="M${x} ${y} L320 140" stroke="var(--muted)" stroke-width="2" fill="none" class="rl-flow ${['', 'd2', 'd3', 'd4', ''][i]}"/>`).join('')}</g>
      <g data-step="2"><path d="M298 44 H144" stroke="var(--c2)" stroke-width="3" fill="none" class="rl-flow"/>
        <path d="M342 44 H496" stroke="var(--c2)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--c2)">centre shared to L and R at −3 dB</text></g>
      <g data-step="3"><path d="M146 174 L122 78" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/>
        <path d="M494 174 L518 78" stroke="var(--c3)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=3"><text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--c3)">surrounds join their own side at −3 dB</text></g>
      <g data-step="=4"><rect x="92" y="38" width="56" height="44" rx="8" fill="none" stroke="var(--bad)" stroke-width="4" class="rl-pulse"/>
        <text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--bad)">0.708 + 0.354 = 1.06: overload</text></g>
      <g data-step="=5"><rect x="92" y="38" width="56" height="44" rx="8" fill="none" stroke="var(--good)" stroke-width="4"/>
        <text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--good)">2 dB lower: 0.84 — clean on two speakers</text></g>
    </svg>`,
    steps: [
      ['The mix in the room', 'Each of the five main channels feeds its own speaker. Nothing is added together electrically, so each can run close to full level.'],
      ['The centre is shared out', 'For two-speaker playback, the centre channel is sent to both left and right, each at −3 dB (0.707), so its loudness stays about the same.'],
      ['The surrounds are folded in', 'Left surround joins left, right surround joins right, usually also at −3 dB. The bass effects channel is commonly left out.'],
      ['The sum can overload', 'Left at 0.708 plus centre at 0.354 makes 1.06, above the maximum of 1. The player clips the peaks, which is heard as crackle.'],
      ['Leave room and listen', 'Bring the whole mix down a little, about 2 dB here, and audition the fold-down yourself before delivery.'],
    ],
    why: [
      'Adding signals makes a bigger signal. Each channel alone can be legal while their sum is not.',
      'The −3 dB share for the centre keeps its acoustic power the same when two speakers play it instead of one.',
      'Most listeners hear the two-speaker or headphone version, so that version deserves at least as much checking as the surround one.',
    ],
    uses: [
      ['🎬', 'Film and video delivery', 'Check the stereo fold-down for clipping and for dialogue that sinks under music.'],
      ['🎵', 'Immersive music', 'Compare the binaural headphone render with the speaker mix; reverb and width often change the most.'],
      ['🏠', 'Home cinema set-up', 'If dialogue is lost on a two-speaker system, look for a centre or dialogue level setting in the player.'],
    ],
    tryit: [
      'Take channel peaks from any surround mix (or invent some) and convert each from dBFS to a fraction: 10^(dB ÷ 20).',
      'Compute left + 0.707 × centre + 0.707 × left surround. Anything above 1 will clip.',
      'On a streaming film, switch the audio between surround and stereo and listen for what changes in the dialogue.',
    ],
    slip: ['Approving a surround mix after hearing it only on the surround system.', 'Always audition the two-speaker fold-down and a mono sum, and leave headroom for them.'],
  });

  REAL('m-myths', {
    title: 'egg trays on the garage wall',
    plain: 'Many acoustic “tips” survive because they look right and nobody measures them. A claim is worth your money only if it names how it works, gives a number you can check, and still holds when you test it before and after.',
    where: 'A drummer’s garage with a neighbour 6 m away',
    story: `<p>Arjun covers his garage walls with cardboard egg trays because a video said they soundproof a room. The room does sound a little less harsh inside. His neighbour hears exactly as much drumming as before.</p>
      <p>He then tests the claim properly. Stopping sound needs weight, and egg trays weigh about 0.3 kg per square metre. A simple estimate says that blocks essentially nothing, while one layer of 12.5 mm plasterboard, thirty times heavier, blocks about 26 dB at 500 Hz. He also measures outside with a phone before and after: no change. The trays come down.</p>`,
    numbers: [['Egg trays', '≈ 0.3 kg/m²'], ['Mass-law estimate at 500 Hz', '20 log(0.3 × 500) − 47 ≈ −3 → about 0 dB'], ['12.5 mm plasterboard', '≈ 9 kg/m²'], ['Mass-law estimate at 500 Hz', '20 log(9 × 500) − 47 ≈ 26 dB'], ['Measured outside, before / after trays', 'no difference']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Drum sound passing straight through a light egg-tray lining but being blocked by a heavy wall layer">
      <circle cx="90" cy="130" r="30" fill="var(--panel)" stroke="var(--c1)" stroke-width="3"/>
      <text x="90" y="135" text-anchor="middle" font-size="13">drums</text>
      ${person(570, 110, 'var(--c2)')}
      <text x="570" y="176" text-anchor="middle" font-size="13">neighbour</text>
      <g data-step="1-3"><path d="M330 40 ${Array.from({ length: 9 }, (_, i) => `q8 10 0 20`).join(' ')}" stroke="var(--warn)" stroke-width="4" fill="none"/></g>
      <g data-step="=1"><text x="320" y="28" text-anchor="middle" font-size="13">the claim: egg trays soundproof a room</text></g>
      <g data-step="2-3"><path d="M124 130 H548" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="320" y="28" text-anchor="middle" font-size="13" fill="var(--bad)">0.3 kg/m²: sound walks straight through</text></g>
      <g data-step="=3"><text x="570" y="88" text-anchor="middle" font-size="13" fill="var(--bad)">same level</text>
        <text x="320" y="28" text-anchor="middle" font-size="13">measure outside, before and after</text></g>
      <g data-step="4"><rect x="318" y="36" width="24" height="190" fill="var(--c3)"/>
        <path d="M124 130 H314" stroke="var(--c1)" stroke-width="3" fill="none" class="rl-flow"/>
        <path d="M346 130 H548" stroke="var(--c1)" stroke-width="1.5" fill="none" stroke-dasharray="2 8" class="rl-pulse"/></g>
      <g data-step="=4"><text x="320" y="28" text-anchor="middle" font-size="13" fill="var(--c3)">9 kg/m², sealed: about 26 dB less</text></g>
      <g data-step="=5"><text x="320" y="28" text-anchor="middle" font-size="13" fill="var(--good)">mechanism, number, test: then spend</text>
        <circle cx="570" cy="110" r="26" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/></g>
    </svg>`,
    steps: [
      ['Hear the claim', '“Egg trays soundproof a room.” It is cheap, it looks like studio foam, and plenty of people repeat it.'],
      ['Ask how it would work', 'Blocking sound takes mass and airtightness. Egg trays have almost no mass and are full of gaps, so there is no mechanism.'],
      ['Ask for a number, then measure', 'A level meter outside reads the same before and after. The only change is slightly less harshness inside, which is a different job.'],
      ['Compare with something that has a mechanism', 'A sealed layer thirty times heavier blocks about 26 dB at 500 Hz by the same simple estimate, and real walls do better with more layers and an air gap.'],
      ['Keep the routine', 'Mechanism, number, before-and-after test. Any product or tip that cannot pass those three is not worth the money yet.'],
    ],
    why: [
      'Reducing echo inside a room and stopping sound leaving it are different problems with different cures. Myths usually blur the two.',
      'People judge by eye and by hope. A treated wall looks quieter, and having spent the effort we want it to have worked.',
      'A measurement with the same source, same position and same settings before and after removes the wishful thinking.',
    ],
    uses: [
      ['🛒', 'Before buying a product', 'Ask for test data for the frequencies you care about, not a single headline figure.'],
      ['📺', 'Watching advice videos', 'Check whether a before-and-after measurement is shown with the same set-up.'],
      ['🏠', 'Your own room', 'Change one thing at a time and re-measure, so you know what did what.'],
    ],
    tryit: [
      'Pick one acoustic tip you have heard and write down what mechanism it relies on: mass, airtightness, absorption or separation.',
      'Play steady noise in a room and measure next door with a phone meter. Hang a blanket on the wall and measure again.',
      'Then stand inside and clap before and after the blanket. Note which of the two things changed.',
    ],
    slip: ['Judging a treatment by how it looks or by listening inside the room when the complaint is next door.', 'Measure where the problem is heard, before and after, with everything else unchanged.'],
  });

  REAL('m-diy', {
    title: 'the 10 mm gap that cost 15 decibels',
    plain: 'Sound gets out through the weakest point. A heavy, well-built wall with a small open gap performs like a much poorer wall, so sealing and the order of work matter as much as the materials.',
    where: 'A home studio built in a spare room over a weekend',
    story: `<p>Karthik builds a heavy double-layer wall to keep his practice room from disturbing the family. On paper it should stop about 45 dB. When he measures in the corridor he gets barely 30. He assumes the wall design is wrong and prices up a third layer.</p>
      <p>A friend points at the door: there is a 10 mm gap underneath, 0.9 m wide. That slot is less than a tenth of one percent of the wall’s area, yet it lets through thirty times more sound than the whole wall. A drop seal and frame seals costing very little bring the result close to the design figure. The third layer would have changed nothing.</p>`,
    numbers: [['Wall area and design value', '10 m², 45 dB'], ['Gap under the door', '0.9 m × 0.01 m = 0.009 m² (0.09 %)'], ['Sound through the wall', '10^(−4.5) ≈ 0.00003 of what hits it'], ['Sound through the gap', '0.0009 (thirty times more)'], ['Combined result', '−10 log(0.00003 + 0.0009) ≈ 30 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A heavy wall with a door, where sound escapes through the gap under the door">
      <rect x="290" y="24" width="30" height="206" fill="var(--c3)"/>
      <rect x="290" y="110" width="30" height="120" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <line x1="20" y1="230" x2="620" y2="230" stroke="var(--text)" stroke-width="3"/>
      <text x="130" y="60" text-anchor="middle" font-size="13">practice room</text>
      <text x="480" y="60" text-anchor="middle" font-size="13">corridor</text>
      <circle cx="110" cy="150" r="24" fill="var(--panel)" stroke="var(--c1)" stroke-width="3"/>
      <g data-step="1"><path d="M136 130 H286" stroke="var(--c1)" stroke-width="3" fill="none" class="rl-flow"/>
        <path d="M324 130 H520" stroke="var(--c1)" stroke-width="1.2" fill="none" stroke-dasharray="2 9"/></g>
      <g data-step="=1"><text x="320" y="16" text-anchor="middle" font-size="13">heavy wall: 45 dB on paper</text></g>
      <g data-step="2-3"><rect x="290" y="222" width="30" height="8" fill="var(--bad)" class="rl-pulse"/>
        <path d="M134 164 Q230 226 290 226 H330 Q420 226 520 170" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=2"><text x="320" y="16" text-anchor="middle" font-size="13" fill="var(--bad)">10 mm under the door: 0.09 % of the area</text></g>
      <g data-step="=3"><text x="480" y="108" text-anchor="middle" font-size="14">only 30 dB</text>
        <text x="320" y="16" text-anchor="middle" font-size="13" fill="var(--bad)">the gap leaks 30× more than the wall</text></g>
      <g data-step="4"><rect x="288" y="220" width="34" height="10" rx="2" fill="var(--good)"/>
        <rect x="286" y="108" width="4" height="122" fill="var(--good)"/></g>
      <g data-step="=4"><text x="320" y="16" text-anchor="middle" font-size="13" fill="var(--good)">drop seal and frame seals fitted</text></g>
      <g data-step="=5"><text x="480" y="108" text-anchor="middle" font-size="14">close to 45 dB</text>
        <text x="320" y="16" text-anchor="middle" font-size="13" fill="var(--good)">seal first, then judge the wall</text></g>
    </svg>`,
    steps: [
      ['A good wall on paper', 'Two heavy layers, well fixed, should pass only about three hundred-thousandths of the sound that hits them: 45 dB.'],
      ['One small opening', 'The 10 mm slot under the door is tiny, under a tenth of a percent of the wall. But an opening passes nearly all the sound that reaches it.'],
      ['The leak dominates', 'Add the two paths and the gap carries thirty times more sound than the entire wall. The measured result falls to about 30 dB.'],
      ['Seal it', 'A drop seal at the threshold and compression seals round the frame close the opening. Sockets, pipe holes and the wall perimeter get sealant too.'],
      ['Then judge the wall', 'With the leaks closed the wall can finally do its job. Only now is it worth asking whether more mass is needed.'],
    ],
    why: [
      'Sound behaves like water in a tank: it does not matter how thick the sides are if there is a hole.',
      'Decibels hide how big the difference is. A 45 dB wall lets through about a thirtieth of what a 30 dB one does, so even a tiny full leak outweighs it.',
      'Doing the cheap, fiddly sealing first avoids paying twice for heavy materials that could never show their value.',
    ],
    uses: [
      ['🚪', 'Doors', 'Fit a drop seal and full perimeter seals before thinking about a heavier door.'],
      ['🔌', 'Sockets and pipes', 'Never put sockets back to back; seal every cable and pipe hole with flexible sealant.'],
      ['🧱', 'Wall edges', 'Leave a small gap at floor, ceiling and side walls and fill it with flexible sealant, not hard filler.'],
    ],
    tryit: [
      'At night, switch the room light on, stand outside in the dark and look for light round the door. Where light leaks, sound leaks.',
      'Play steady noise inside and move your ear or a phone meter slowly round the door frame from outside to find the loudest spot.',
      'Measure the gap under your door, multiply by its width, and compare with the wall area as a percentage.',
    ],
    slip: ['Adding more layers when a new wall underperforms.', 'Hunt for gaps first: door edges, sockets, pipes and the wall perimeter. Seal them, measure again, then decide. Get advice before adding heavy layers to floors or ceilings, and keep ventilation and fire escape in the plan.'],
  });
})();
