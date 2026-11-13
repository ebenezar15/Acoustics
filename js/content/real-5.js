/* "In real life" blocks — group 5 (Studio Design Master Class: matter, parameters, absorbers,
   lab tests, isolation, walls, doors, floors, rooms, booths). See js/real-kit.js. */
(function () {
  const REAL = window.REAL; if (!REAL) return;
  /* small drawing helpers */
  const top = (n, t, col) => `<g data-step="=${n}"><text x="320" y="24" text-anchor="middle" font-size="14"${col ? ` fill="var(${col})"` : ''}>${t}</text></g>`;
  const man = (x, y, c) => `<circle cx="${x}" cy="${y}" r="9" fill="var(${c})"/><rect x="${x - 7}" y="${y + 10}" width="14" height="28" rx="6" fill="var(${c})"/>`;
  const zig = (x, y1, y2, c) => { const n = 6, h = (y2 - y1) / n; let d = `M${x} ${y1}`; for (let i = 0; i < n; i++) d += ` L${x + (i % 2 ? -7 : 7)} ${y1 + h * (i + 0.5)} L${x} ${y1 + h * (i + 1)}`; return `<path d="${d}" fill="none" stroke="var(${c})" stroke-width="2.5"/>`; };

  /* ------------------------------------------------------------------ M3 */
  REAL('m-matter', {
    title: 'the hammer you hear three floors up',
    plain: 'Sound is energy handed along by whatever it travels in. Stiff, solid things like concrete and steel pass it on much faster and further than air does, which is why building noise travels through the structure.',
    where: 'A four-storey apartment block under renovation in Kochi',
    story: `<p>Ravi is chasing a cable into a ground-floor column with a hammer and chisel. Leela, working from home on the third floor, hears every blow as a sharp knock from her own wall. Yet when Ravi shouts up the stairwell she can barely hear him.</p>
      <p>The shout has to cross three concrete slabs through the air, and each slab reflects almost all of it. The hammer blow goes straight into the concrete frame, which carries it up the column and into her wall in a few thousandths of a second.</p>`,
    numbers: [['Height to the third floor', '9 m'], ['Speed in air', '343 m/s'], ['Speed in concrete', 'about 3,500 m/s'], ['Travel time in concrete', '9 ÷ 3,500 ≈ 2.6 ms'], ['Same distance in air', '9 ÷ 343 ≈ 26 ms']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A hammer blow travels up a concrete column to a listener three floors above">
      <line x1="150" y1="236" x2="560" y2="236" stroke="var(--line)" stroke-width="2"/>
      <g stroke="var(--muted)" stroke-width="6"><line x1="170" y1="180" x2="540" y2="180"/><line x1="170" y1="124" x2="540" y2="124"/><line x1="170" y1="68" x2="540" y2="68"/></g>
      <rect x="340" y="44" width="22" height="192" fill="var(--muted)"/>
      <text x="351" y="254" text-anchor="middle" font-size="12">concrete column</text>
      ${man(300, 196, '--c1')}<text x="262" y="222" text-anchor="end" font-size="12">Ravi</text>
      ${man(440, 80, '--c2')}<text x="462" y="104" font-size="12">Leela</text>
      ${top(1, 'Three concrete slabs between them')}
      <g data-step="2"><circle cx="340" cy="214" r="12" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-grow"/></g>
      ${top(2, 'The hammer shakes the column itself', '--accent')}
      <g data-step="3"><path d="M351 214 V96" stroke="var(--accent)" stroke-width="4" fill="none" class="rl-flow"/></g>
      ${top(3, 'Concrete passes it on at 3,500 m/s', '--accent')}
      <g data-step="=4"><path d="M292 190 Q250 150 232 186" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow slow"/>
        <text x="226" y="146" text-anchor="end" font-size="12" fill="var(--c3)">shout: bounces</text><text x="226" y="162" text-anchor="end" font-size="12" fill="var(--c3)">off the slab</text></g>
      ${top(4, 'Airborne sound is turned back by each slab', '--c3')}
      <g data-step="5"><path d="M362 96 H420" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
        <circle cx="440" cy="80" r="20" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-grow"/></g>
      ${top(5, 'Her wall re-radiates it as a knock', '--c2')}
    </svg>`,
    steps: [
      ['The setting', 'A concrete frame joins every floor. Air only connects the floors through the stairwell.'],
      ['Energy goes into the solid', 'The blow shakes the column directly, so the energy starts inside the structure instead of in the air.'],
      ['Stiff material, fast travel', 'Concrete is very stiff, so each bit pushes the next almost at once: about ten times faster than in air, with little loss.'],
      ['Air is easily stopped', 'A shout in air meets a heavy slab that hardly moves, so nearly all of it reflects back down.'],
      ['The wall becomes a loudspeaker', 'Upstairs the vibrating wall pushes the room air, and Leela hears a knock that seems to come from her own wall.'],
    ],
    why: [
      'Speed depends on stiffness and weight. Concrete is far stiffer than air for its weight, so the push is passed on much faster.',
      'Energy does not vanish. It keeps travelling until friction turns it into a tiny amount of heat, and solid structures have very little friction.',
      'A big change in material (air to concrete) reflects most of the energy. Once energy is already inside the concrete, there is no such barrier.',
    ],
    uses: [
      ['🥁', 'Drums over a shop', 'Put the kit on a floated platform so the kick never enters the slab; treating the air alone will not help.'],
      ['🔧', 'Plant and pumps', 'Sit machines on springs or rubber pads and use flexible pipe connectors so vibration cannot reach the frame.'],
      ['🧱', 'Room-in-a-room', 'Break the solid path with resilient mounts or a second frame that touches the building at soft points only.'],
    ],
    tryit: [
      'Put your ear against a long table and ask someone to scratch the far end lightly. Lift your head: the scratch almost disappears.',
      'Knock on a wall while a friend listens in the next room with an ear to the same wall, then with the ear in the open air.',
      'Stand a ticking kitchen timer on the table, then on a folded towel. Notice how the soft layer cuts the sound the table makes.',
    ],
    slip: ['Adding foam to a room to stop impact noise reaching the neighbours.', 'Break the solid path: float the source or the floor. Foam only changes how the room itself sounds.'],
  });

  /* ------------------------------------------------------------------ M4 */
  REAL('m-params', {
    title: 'the generator at the wedding hall',
    plain: 'In the open, every time you double your distance from a small sound source, the level falls by about 6 dB, because the same energy is spread over four times the area.',
    where: 'A marriage hall with a diesel generator in the yard',
    story: `<p>The hall’s generator sits 7 m from the boundary wall, where Mr Thomas measures 78 dB(A) on his phone app. The house next door has a bedroom window 28 m from the generator, and the family complains during evening functions.</p>
      <p>Before buying anything, he works out what distance alone is doing, and what moving the generator to the far corner of the yard, 56 m from the window, would do.</p>`,
    numbers: [['Measured at 7 m', '78 dB(A)'], ['At 14 m (one doubling)', '78 − 6 = 72 dB(A)'], ['At the window, 28 m', '72 − 6 = 66 dB(A)'], ['If moved to 56 m', '66 − 6 = 60 dB(A)']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Sound level falling by 6 decibels each time distance doubles from a generator">
      <line x1="20" y1="212" x2="620" y2="212" stroke="var(--line)" stroke-width="2"/>
      <rect x="40" y="172" width="50" height="40" rx="5" fill="var(--c1)"/><text x="65" y="236" text-anchor="middle" font-size="12">generator</text>
      <circle cx="65" cy="190" r="26" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/>
      <circle cx="65" cy="190" r="26" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow d3"/>
      <rect x="552" y="120" width="68" height="92" fill="var(--panel)" stroke="var(--muted)" stroke-width="2"/><rect x="566" y="140" width="24" height="28" fill="var(--c2)" opacity=".6"/>
      <text x="586" y="236" text-anchor="middle" font-size="12">bedroom</text>
      <path d="M92 190 H548" stroke="var(--accent)" stroke-width="2" fill="none" class="rl-flow" opacity=".7"/>
      <g data-step="2"><line x1="184" y1="150" x2="184" y2="212" stroke="var(--muted)" stroke-dasharray="4 4"/><text x="184" y="230" text-anchor="middle" font-size="12">7 m</text>
        <text x="184" y="140" text-anchor="middle" font-size="15" fill="var(--accent)">78 dB</text></g>
      <g data-step="3"><line x1="303" y1="150" x2="303" y2="212" stroke="var(--muted)" stroke-dasharray="4 4"/><text x="303" y="230" text-anchor="middle" font-size="12">14 m</text>
        <text x="303" y="140" text-anchor="middle" font-size="15" fill="var(--accent)">72 dB</text></g>
      <g data-step="4"><line x1="541" y1="100" x2="541" y2="212" stroke="var(--muted)" stroke-dasharray="4 4"/><text x="528" y="230" text-anchor="middle" font-size="12">28 m</text>
        <text x="528" y="92" text-anchor="middle" font-size="15" fill="var(--accent)">66 dB</text></g>
      ${top(1, 'A small source sends sound out in all directions')}
      ${top(2, 'The level measured at 7 m')}
      ${top(3, 'Twice as far: four times the area, −6 dB')}
      ${top(4, 'Twice as far again: another −6 dB')}
      ${top(5, 'Move it to 56 m: 60 dB with no purchase', '--good')}
      <g data-step="5"><text x="420" y="60" text-anchor="middle" font-size="13" fill="var(--good)">each doubling of distance = −6 dB</text></g>
    </svg>`,
    steps: [
      ['Sound spreads as a growing shell', 'Outdoors, the energy from a compact source spreads over an ever larger sphere.'],
      ['Start from a known point', 'One honest measurement at a known distance is all you need: here 78 dB(A) at 7 m.'],
      ['Double the distance', 'At 14 m the same energy covers four times the area, so each square metre gets a quarter: 6 dB less.'],
      ['Double again', 'From 14 m to 28 m loses another 6 dB. Notice that the second 6 dB cost 14 m, the first only 7 m.'],
      ['Use distance first', 'Moving the source is often free. A barrier or enclosure then only has to deal with what is left.'],
    ],
    why: [
      'The surface of a sphere grows with the square of its radius, so intensity falls with the square of distance. A quarter of the intensity is 6 dB less.',
      'It only holds in the open. Indoors, reflections stop the level falling after a few metres from the source.',
      'Long sources such as a busy road spread like a cylinder and lose only about 3 dB per doubling.',
    ],
    uses: [
      ['🏭', 'Siting plant', 'Putting a condenser 20 m instead of 5 m from a window gains 12 dB before any screen is built.'],
      ['🎤', 'Microphone distance', 'Halving the mic distance from 40 cm to 20 cm raises the voice 6 dB over the room noise.'],
      ['🔊', 'Outdoor events', 'A stage that reads 100 dB at 10 m will still be about 76 dB at 160 m, four doublings away.'],
    ],
    tryit: [
      'Play steady noise from a phone speaker outdoors. Measure with a sound-level app at 0.5 m, 1 m and 2 m and note the steps.',
      'Repeat indoors in a tiled bathroom. See how the level stops falling once you are a metre or two away.',
      'For a noise that bothers you, pace the distance and work out the level at twice that distance.',
    ],
    slip: ['Expecting 6 dB per doubling inside a room.', 'Use it outdoors or very close to the source. Indoors the reverberant sound takes over and absorption, not distance, sets the level.'],
  });

  /* ------------------------------------------------------------------ M5 */
  REAL('m-absorb-how', {
    title: 'the panel that worked better off the wall',
    plain: 'A soft, fibrous panel absorbs sound by making the moving air rub against its fibres. Air barely moves right at a wall, so the panel does more when it sits where the air moves fastest: a little way out from the wall.',
    where: 'A podcast room in a spare bedroom',
    story: `<p>Meera fixes four 50 mm mineral-wool panels flat on her wall. Voices sound less harsh, but the room is still thick and honky in the low mids. She has no budget for more panels.</p>
      <p>She re-hangs the same panels on 50 mm timber spacers, leaving an air gap behind. The panels now reach an octave lower, and the honk around 800 to 900 Hz drops without a single new panel.</p>`,
    numbers: [['Panel thickness', '50 mm'], ['Flat on the wall, works well above', '343 ÷ (4 × 0.05) ≈ 1,700 Hz'], ['Depth with a 50 mm gap', '100 mm'], ['Spaced, works well above', '343 ÷ (4 × 0.10) ≈ 860 Hz']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Air movement is zero at a wall and greatest a quarter wavelength away; a spaced panel sits in the fast air">
      <rect x="560" y="40" width="22" height="190" fill="var(--muted)"/><text x="571" y="250" text-anchor="middle" font-size="12">wall</text>
      <path d="M40 135 H230" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      <text x="40" y="118" font-size="12">sound arriving</text>
      <g data-step="1-2"><path d="M560 135 Q480 35 400 135 Q320 35 240 135" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-pulse"/>
        <path d="M560 135 Q480 235 400 135 Q320 235 240 135" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-pulse"/>
        <text x="480" y="60" text-anchor="middle" font-size="12" fill="var(--c2)">air moves most here</text></g>
      <g data-step="2-3"><rect x="480" y="50" width="80" height="170" fill="var(--accent)" opacity=".35"/><text x="520" y="240" text-anchor="middle" font-size="12">50 mm panel</text></g>
      <g data-step="3"><path d="M560 135 Q400 -5 240 135" fill="none" stroke="var(--c3)" stroke-width="2.5" class="rl-pulse"/>
        <path d="M560 135 Q400 275 240 135" fill="none" stroke="var(--c3)" stroke-width="2.5" class="rl-pulse"/></g>
      <g data-step="=3"><text x="400" y="52" text-anchor="middle" font-size="12" fill="var(--c3)">lower note: fast air is further out</text></g>
      <g data-step="4"><rect x="400" y="50" width="80" height="170" fill="var(--good)" opacity=".4"/><text x="440" y="240" text-anchor="middle" font-size="12">same panel</text>
        <text x="520" y="240" text-anchor="middle" font-size="12">50 mm gap</text></g>
      <g data-step="5"><circle cx="420" cy="120" r="4" fill="var(--warn)" class="rl-rise"/><circle cx="445" cy="160" r="4" fill="var(--warn)" class="rl-rise d2"/><circle cx="462" cy="100" r="4" fill="var(--warn)" class="rl-rise d3"/></g>
      ${top(1, 'At a hard wall the air cannot move')}
      ${top(2, 'A thin panel on the wall catches only short waves')}
      ${top(3, 'For a lower note the panel sits in slow air')}
      ${top(4, 'Spaced off the wall, it meets the fast air', '--good')}
      ${top(5, 'Rubbing in the fibres turns sound into heat', '--warn')}
    </svg>`,
    steps: [
      ['Still air at the wall', 'A rigid wall stops the air moving. The air moves fastest a quarter of a wavelength out from the wall.'],
      ['Thin panel, high notes only', 'A 50 mm panel on the wall reaches the fast-moving air only for short waves, above about 1,700 Hz.'],
      ['Low notes pass it by', 'For a longer wave the fast air is 100 mm or more from the wall, beyond the panel. Little rubbing, little absorption.'],
      ['Add an air gap', 'Moving the same panel 50 mm out puts it where the air of an 860 Hz wave is moving fastest.'],
      ['Friction does the work', 'Air squeezing between fibres loses energy as a trace of heat. Less energy comes back into the room.'],
    ],
    why: [
      'Porous absorbers work on air movement, not on pressure. No movement through the fibres means no friction and no absorption.',
      'Depth from the wall, not weight of material, sets how low a porous absorber reaches. The gap counts as depth.',
      'Fibres must let air in. Too dense or sealed with paint and the sound bounces off the face instead.',
    ],
    uses: [
      ['🎙️', 'Voice rooms', 'Hang 50 mm panels on 50 mm battens to tame 500 to 1,000 Hz boxiness for the price of some timber.'],
      ['☁️', 'Ceiling clouds', 'Drop a cloud 100 to 200 mm below the ceiling: the gap above it works like extra thickness.'],
      ['🧱', 'Corner traps', 'Straddle a corner with a thick panel: the deep air space behind reaches into the bass.'],
    ],
    tryit: [
      'Hold a thick folded towel flat against a wall and talk towards it from 20 cm. Then hold it 10 cm off the wall and listen again.',
      'Work out the quarter-wavelength frequency for any panel you own: 343 ÷ (4 × depth in metres, gap included).',
      'Blow through a sample of your absorber. If no air passes, it will reflect rather than absorb.',
    ],
    slip: ['Buying denser or thicker foam to fix a low-mid problem while keeping it flat on the wall.', 'Add depth first: space the panel off the wall or put it across a corner.'],
  });

  /* ------------------------------------------------------------------ M6 */
  REAL('m-lab', {
    title: 'two data sheets for the same panel',
    plain: 'An absorption number comes from a test: a sample is laid in a very echoey room and the lab measures how much faster the sound dies away. How the sample was mounted changes the number a lot.',
    where: 'A supplier’s office, comparing quotations',
    story: `<p>Arjun has two quotations for a school music room. Panel A lists an absorption of 0.90. Panel B, at twice the price, lists 1.05. He nearly orders B, then reads the small print: A was tested flat on the floor, B with a 400 mm air space behind it.</p>
      <p>He asks for B’s flat-mounted report. It reads 0.88. The two products are the same thing; only the mounting differed. Since his panels will go flat on a wall, the cheaper one does the same job.</p>`,
    numbers: [['Test room volume', '200 m³'], ['Empty room', 'RT 5.0 s → 0.161 × 200 ÷ 5.0 = 6.4 m²'], ['With 10.8 m² sample', 'RT 2.0 s → 16.1 m²'], ['Added by the sample', '16.1 − 6.4 = 9.7 m²'], ['Coefficient', '9.7 ÷ 10.8 = 0.90']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A reverberation room test: the decay shortens when a sample is laid on the floor">
      <rect x="40" y="44" width="320" height="180" fill="none" stroke="var(--muted)" stroke-width="4"/>
      <g stroke="var(--muted)" stroke-width="3"><line x1="90" y1="70" x2="140" y2="92"/><line x1="200" y1="66" x2="250" y2="60"/><line x1="290" y1="96" x2="330" y2="74"/></g>
      <rect x="54" y="188" width="24" height="30" fill="var(--c1)"/><circle cx="320" cy="150" r="6" fill="var(--c2)"/><line x1="320" y1="156" x2="320" y2="220" stroke="var(--c2)" stroke-width="2"/>
      <text x="200" y="246" text-anchor="middle" font-size="12">hard, echoey test room</text>
      <line x1="410" y1="60" x2="410" y2="210" stroke="var(--line)" stroke-width="2"/><line x1="410" y1="210" x2="620" y2="210" stroke="var(--line)" stroke-width="2"/>
      <text x="515" y="232" text-anchor="middle" font-size="12">time</text><text x="424" y="56" font-size="12">level</text>
      <g data-step="1-2"><path d="M78 196 L200 60 L340 130 L120 220 L60 120 L300 215" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-flow slow" opacity=".8"/></g>
      <g data-step="2"><path d="M414 70 L612 130" stroke="var(--c3)" stroke-width="3" fill="none"/><text x="556" y="88" text-anchor="middle" font-size="13" fill="var(--c3)">empty: 5.0 s</text></g>
      <g data-step="3"><rect x="120" y="208" width="170" height="14" fill="var(--good)" class="rl-pulse"/><text x="205" y="200" text-anchor="middle" font-size="12" fill="var(--good)">10.8 m² sample</text></g>
      <g data-step="4"><path d="M414 70 L500 205" stroke="var(--good)" stroke-width="3" fill="none"/><text x="534" y="176" text-anchor="middle" font-size="13" fill="var(--good)">sample: 2.0 s</text></g>
      ${top(1, 'Noise fills a room that hardly absorbs')}
      ${top(2, 'Switch off: the empty room rings for 5 s')}
      ${top(3, 'Lay the sample on the floor and repeat')}
      ${top(4, 'Now the sound dies in 2 s')}
      ${top(5, 'Extra absorption ÷ sample area = 0.90', '--good')}
    </svg>`,
    steps: [
      ['An echoey room on purpose', 'Hard walls and hanging reflectors keep sound bouncing evenly, so any absorber added stands out clearly.'],
      ['Time the empty room', 'The lab switches off the noise and times how long the level takes to fall by 60 dB: here 5.0 seconds.'],
      ['Add the sample', 'About 10 to 12 m² of the product goes on the floor, mounted in a stated way: flat, or over an air space.'],
      ['Time it again', 'The decay is now much shorter. The difference tells how many square metres of absorption were added.'],
      ['Divide by the area', 'Added absorption divided by sample area gives the coefficient. Edges and air gaps can push it above 1.'],
    ],
    why: [
      'Reverberation time falls as absorption rises, so timing the decay is a simple way to weigh an absorber.',
      'An air space behind the sample makes it act thicker, and exposed edges absorb too. Both raise the number without changing the product.',
      'A single figure hides the frequency detail. Two products with the same average can behave very differently at 125 Hz.',
    ],
    uses: [
      ['📄', 'Comparing quotations', 'Compare only reports with the same mounting; ask for the flat-mounted one if yours go on a wall.'],
      ['🎼', 'Bass problems', 'Read the 125 Hz and 250 Hz columns, not the average, when the room is boomy.'],
      ['🧮', 'Predicting a room', 'Multiply each area by its coefficient per band and add them up before buying anything.'],
    ],
    tryit: [
      'Find a test report for any acoustic product and look for the mounting type and the 125 Hz figure.',
      'Clap in an empty room and time the tail roughly. Bring in a mattress and clap again.',
      'Take a product listed above 1.0 and write down two reasons the lab number can exceed “100 %”.',
    ],
    slip: ['Choosing the product with the highest single absorption figure.', 'Check mounting and the low-frequency bands first; then compare like with like.'],
  });

  /* ------------------------------------------------------------------ M7 */
  REAL('m-iso-basics', {
    title: 'the foam that did not stop the guitar amp',
    plain: 'Stopping sound from leaving a room and improving how the room sounds are two separate jobs. Soft foam does the second. Only heavy, airtight, separated construction does the first.',
    where: 'A terraced house with a shared bedroom wall',
    story: `<p>Kabir plays guitar through a small amplifier at about 100 dB. His neighbour, Mrs Fernandes, hears it clearly through the shared wall at night. Kabir covers the whole wall with foam tiles. His room sounds much drier, and he is sure he has fixed it.</p>
      <p>Next door nothing has changed. The wall still lets the same amount through, because foam weighs almost nothing and air passes straight through it. What finally works is a second, heavy, sealed wall on its own frame, a small distance from the first.</p>`,
    numbers: [['Amp level in the room', '100 dB'], ['Existing wall', 'about 35 dB reduction'], ['Next door', '100 − 35 = 65 dB'], ['Bedroom at night', 'about 30 dB'], ['Still needed', '65 − 30 = 35 dB more'], ['Gain from foam', '0 to 2 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Foam on a wall does not stop sound passing through; a heavy separate sealed wall does">
      <rect x="40" y="50" width="262" height="170" fill="none" stroke="var(--muted)" stroke-width="2"/><rect x="338" y="50" width="262" height="170" fill="none" stroke="var(--muted)" stroke-width="2"/>
      <rect x="302" y="50" width="16" height="170" fill="var(--muted)"/>
      <rect x="70" y="170" width="44" height="50" rx="4" fill="var(--c1)"/><text x="92" y="240" text-anchor="middle" font-size="12">amp, 100 dB</text>
      <rect x="470" y="196" width="110" height="18" rx="6" fill="var(--c2)"/><circle cx="486" cy="188" r="9" fill="var(--c2)"/><text x="525" y="240" text-anchor="middle" font-size="12">neighbour</text>
      <circle cx="92" cy="190" r="22" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/>
      <path d="M118 180 H298" stroke="var(--accent)" stroke-width="4" fill="none" class="rl-flow"/>
      <g data-step="2-3"><path d="M322 180 H462" stroke="var(--bad)" stroke-width="4" fill="none" class="rl-flow"/><text x="400" y="164" text-anchor="middle" font-size="14" fill="var(--bad)">65 dB</text></g>
      <g data-step="3"><path d="M298 52 l-9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7" fill="none" stroke="var(--c3)" stroke-width="3"/></g>
      <g data-step="4"><rect x="332" y="50" width="16" height="170" fill="var(--good)"/><path d="M352 180 H462" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow" opacity=".7"/>
        <text x="408" y="164" text-anchor="middle" font-size="14" fill="var(--good)">about 30 dB</text></g>
      <g data-step="5"><circle cx="340" cy="52" r="6" fill="var(--good)" class="rl-pulse"/><circle cx="340" cy="218" r="6" fill="var(--good)" class="rl-pulse d2"/></g>
      ${top(1, 'A loud source beside a shared wall')}
      ${top(2, 'The wall takes off 35 dB. Not enough', '--bad')}
      ${top(3, 'Foam: his room sounds drier, hers the same', '--c3')}
      ${top(4, 'A second heavy wall with an air gap', '--good')}
      ${top(5, 'Sealed at every edge, or it leaks', '--good')}
    </svg>`,
    steps: [
      ['The problem', 'Sound in Kabir’s room pushes on the shared wall, and the wall pushes the air on the other side.'],
      ['What the wall does', 'A plain single wall removes about 35 dB. The remaining 65 dB is far above a quiet bedroom.'],
      ['What foam does', 'Foam absorbs reflections inside the room. It adds no weight and is not airtight, so the wall passes sound as before.'],
      ['What actually isolates', 'A second heavy layer on its own frame, with an air space between, makes the sound cross two barriers and a soft spring.'],
      ['Close every gap', 'A new wall is only as good as its seals. Perimeter gaps, sockets and door edges must be airtight.'],
    ],
    why: [
      'A heavy wall is hard to shake, so less vibration reaches the far side. Foam is roughly a hundred times too light to matter.',
      'Two walls with air between act like two weights joined by a spring: above a low frequency, each wall moves much less than one wall alone.',
      'Sound takes the easiest route. A small open gap can pass more than the whole wall.',
    ],
    uses: [
      ['🎸', 'Home practice room', 'Spend first on mass, separation and seals; add absorption afterwards for the sound inside.'],
      ['🎬', 'Home cinema', 'A sealed solid door often gains more than any wall panel, because the door is the weakest part.'],
      ['🏢', 'Meeting rooms', 'Take the partition up to the slab above the false ceiling, or speech walks over the top.'],
    ],
    tryit: [
      'Play music in one room and listen next door. Hold a cushion against the wall on the source side: note that nothing changes.',
      'Now close and open the door between the rooms and hear how much difference an airtight barrier makes.',
      'List the three weakest points of your room (door, window, vents) before thinking about walls.',
    ],
    slip: ['Calling foam or panels “soundproofing”.', 'Treat isolation (mass, air gap, seals) and treatment (absorbers, diffusers) as two budgets and two designs.'],
  });

  /* ------------------------------------------------------------------ M8 */
  REAL('m-walls', {
    title: 'one thick wall or two thin ones',
    plain: 'Making a wall twice as heavy only gains about 5 dB. Splitting the same weight into two separate walls with an air gap gains far more, as long as nothing rigid joins them.',
    where: 'A rehearsal studio being built in a warehouse unit in Chennai',
    story: `<p>Suresh needs to keep a loud band from the unit next door. His mason suggests doubling the half-brick wall to a full brick: “twice the wall, twice the soundproofing”. The quote is high and the floor loading worries the landlord.</p>
      <p>Instead they keep the half-brick wall and build a separate stud wall 100 mm away, with two layers of plasterboard and mineral wool in the gap. It is lighter and thinner than a full brick wall and tests about 10 dB better. A week later an electrician screws a conduit bracket through both, and the gain drops until the bracket is removed.</p>`,
    numbers: [['Half-brick wall, about 220 kg/m²', 'about 45 dB'], ['Doubled to full brick', 'about 50 dB (+5)'], ['Half brick + separate lined wall', 'about 60 dB'], ['Spring resonance of two 20 kg/m² leaves, 100 mm apart', '60 × √(40 ÷ (400 × 0.1)) = 60 Hz']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Three wall sections: single, doubled mass, and two separated leaves with an air gap">
      <rect x="100" y="50" width="16" height="160" fill="var(--muted)"/>
      <path d="M30 130 H96" stroke="var(--accent)" stroke-width="4" fill="none" class="rl-flow"/><path d="M120 130 H190" stroke="var(--accent)" stroke-width="2.5" fill="none" class="rl-flow"/>
      <text x="108" y="232" text-anchor="middle" font-size="12">single: 45 dB</text>
      <g data-step="2"><rect x="300" y="50" width="32" height="160" fill="var(--muted)"/>
        <path d="M230 130 H296" stroke="var(--accent)" stroke-width="4" fill="none" class="rl-flow"/><path d="M336 130 H400" stroke="var(--accent)" stroke-width="2" fill="none" class="rl-flow"/>
        <text x="316" y="232" text-anchor="middle" font-size="12">double weight: 50 dB</text></g>
      <g data-step="3"><rect x="500" y="50" width="14" height="160" fill="var(--muted)"/><rect x="556" y="50" width="12" height="160" fill="var(--good)"/>
        <rect x="514" y="50" width="42" height="160" fill="var(--c4)" opacity=".25"/>
        <path d="M436 130 H496" stroke="var(--accent)" stroke-width="4" fill="none" class="rl-flow"/><path d="M572 130 H628" stroke="var(--good)" stroke-width="1.2" fill="none" class="rl-flow slow"/>
        <text x="534" y="232" text-anchor="middle" font-size="12">two leaves: 60 dB</text></g>
      <g data-step="4" class="rl-shake">${zig(535, 80, 120, '--warn')}</g>
      <g data-step="5"><rect x="514" y="160" width="42" height="8" fill="var(--bad)" class="rl-pulse"/><text x="535" y="186" text-anchor="middle" font-size="11" fill="var(--bad)">bracket</text></g>
      ${top(1, 'A heavy wall is hard for sound to shake')}
      ${top(2, 'Twice the weight buys only about 5 dB')}
      ${top(3, 'Split into two leaves with an air gap', '--good')}
      ${top(4, 'The trapped air is a soft spring', '--warn')}
      ${top(5, 'One rigid link lets sound cross the gap', '--bad')}
    </svg>`,
    steps: [
      ['Mass resists movement', 'Sound has to shake the wall to get through. The heavier the wall, the less it moves.'],
      ['The mass law is stingy', 'Each doubling of weight adds only about 5 to 6 dB, so a single wall soon becomes impractically heavy.'],
      ['Two leaves, one gap', 'With two separate leaves the sound must shake the first, squeeze the air, then shake the second.'],
      ['Air as a spring', 'Above the spring resonance (kept low with heavy leaves and a wide, wool-filled gap) each leaf isolates on its own and the gains add up.'],
      ['Keep them apart', 'Any rigid tie, shared stud, bracket or pipe carries vibration straight across. Check before the cavity is closed.'],
    ],
    why: [
      'A weight on a spring stops following a push that is much faster than its natural bounce. The second leaf is that weight.',
      'Wool in the gap damps the air spring and stops the cavity ringing, which is worth several dB.',
      'Below the spring resonance the two leaves move together like one wall, so the benefit is lost for deep bass unless the gap and weights are large.',
    ],
    uses: [
      ['🥁', 'Rehearsal rooms', 'Aim for a resonance below about 40 Hz: two or three board layers each side and a gap of 150 mm or more.'],
      ['🏠', 'Party wall upgrade', 'An independent lined wall 50 to 100 mm clear of the old one beats gluing more board onto it.'],
      ['🎚️', 'Control room to live room', 'Two separate walls on separate floors, with the window glass set in each wall, not bridging them.'],
    ],
    tryit: [
      'Knock on a solid wall, then on a hollow partition. Notice which rings and which thuds.',
      'Use the formula 60 × √((m₁ + m₂) ÷ (m₁ × m₂ × gap in metres)) for a wall you know. Is it below your lowest bass note?',
      'On a drawing or on site, trace every item that touches both leaves: studs, sockets, pipes, shelves.',
    ],
    slip: ['Filling the cavity solid or tying the two leaves together “for strength”.', 'Keep the leaves structurally separate and fill the gap loosely with wool only.'],
  });

  /* ------------------------------------------------------------------ M9 */
  REAL('m-doors-windows', {
    title: 'the 5 mm gap under the studio door',
    plain: 'A wall is only as good as its weakest part. A thin open slot under a door can let through more sound than all the rest of the wall put together.',
    where: 'A new voice-over room in an office',
    story: `<p>Divya’s contractor has built a good 50 dB wall with a solid 35 dB door in it. She tests it with music in the corridor and is shocked: speech outside is clearly audible. Under the door there is a 5 mm gap “for the carpet”.</p>
      <p>She fits an automatic drop seal and compressible seals round the frame. Nothing else changes, and the complaint disappears. The wall never was the problem.</p>`,
    numbers: [['Wall area and rating', '10 m², 50 dB'], ['Door, sealed', '1.9 m², 35 dB'], ['Gap under the door', '0.9 m × 5 mm = 0.0045 m²'], ['Wall + door + open gap', 'about 33 dB'], ['With the gap sealed', 'about 42 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Sound leaking through a gap under a door, then stopped by a drop seal">
      <rect x="60" y="44" width="520" height="176" fill="var(--muted)" opacity=".45"/>
      <rect x="270" y="74" width="100" height="141" fill="var(--c1)"/><circle cx="356" cy="150" r="4" fill="var(--panel)"/>
      <line x1="40" y1="220" x2="600" y2="220" stroke="var(--line)" stroke-width="2"/>
      <text x="150" y="140" text-anchor="middle" font-size="13">wall: 50 dB</text><text x="320" y="110" text-anchor="middle" font-size="12">door: 35 dB</text>
      <g data-step="2-3"><rect x="270" y="215" width="100" height="5" fill="var(--bad)" class="rl-pulse"/></g>
      <g data-step="=2"><text x="320" y="246" text-anchor="middle" font-size="12" fill="var(--bad)">5 mm gap</text></g>
      <g data-step="=3"><circle cx="320" cy="218" r="16" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow"/><circle cx="320" cy="218" r="16" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow d3"/>
        <text x="470" y="140" text-anchor="middle" font-size="15" fill="var(--bad)">total: 33 dB</text></g>
      <g data-step="4"><rect x="270" y="210" width="100" height="10" fill="var(--good)" class="drop-seal"/>
        <rect x="266" y="74" width="4" height="141" fill="var(--good)"/><rect x="370" y="74" width="4" height="141" fill="var(--good)"/><rect x="266" y="70" width="108" height="4" fill="var(--good)"/></g>
      <g data-step="4"><text x="470" y="140" text-anchor="middle" font-size="15" fill="var(--good)">total: 42 dB</text></g>
      <g data-step="5"><path d="M320 74 V215" stroke="var(--warn)" stroke-width="3" class="rl-pulse" fill="none"/></g>
      ${top(1, 'A good wall with a decent door in it')}
      ${top(2, 'A small slot is left under the door', '--bad')}
      ${top(3, 'The slot passes more than everything else', '--bad')}
      ${top(4, 'Seal it all round: 9 dB better at once', '--good')}
      ${top(5, 'Now the door itself is the weak part', '--warn')}
    </svg>`,
    steps: [
      ['Add up the parts', 'A partition is a mix of wall, door, glass and gaps. Each part lets through its own share of sound.'],
      ['A gap has zero resistance', 'An open slot lets sound through almost untouched, however heavy the wall around it.'],
      ['Small area, big leak', 'The slot is less than a twentieth of a percent of the wall, yet it drags 50 dB down to about 33 dB.'],
      ['Seal the whole perimeter', 'A drop seal at the bottom and compressed seals on the other three sides make the door airtight.'],
      ['Find the next weak link', 'Sealed, the total is about 42 dB and the door leaf now limits it. A heavier door or a second door is the next step.'],
    ],
    why: [
      'Decibels hide huge ratios: a 50 dB wall passes one part in 100,000, so any opening passing everything dominates at once.',
      'Sound is air pressure. If air can get through, so can sound.',
      'Improving the strongest part changes almost nothing. Improving the weakest part changes everything.',
    ],
    uses: [
      ['🚪', 'Any studio door', 'Fit seals on all four edges and check with a torch in a dark room: light through means sound through.'],
      ['🪟', 'Windows', 'An openable window left on the latch can undo double glazing. Close and gasket it before upgrading glass.'],
      ['🔌', 'Services', 'Seal round pipes, cables and back boxes with flexible sealant; avoid sockets back to back.'],
    ],
    tryit: [
      'Play speech radio outside a closed door and listen inside. Lay a rolled towel along the bottom gap and listen again.',
      'At night, switch on the corridor light and look for light around your closed door from inside the dark room.',
      'Work out the area of the gap under your own door: width × gap height.',
    ],
    slip: ['Paying for a heavier wall while the door has no seals.', 'Seal first, then upgrade the weakest remaining element, then the next.'],
  });

  /* ------------------------------------------------------------------ M9A */
  REAL('m-door-build', {
    title: 'two ordinary doors beat one expensive door',
    plain: 'A small lobby with a sealed door at each end stops far more sound than a single door, and one of the two is always shut when someone walks through.',
    where: 'A drum teaching room at a music school',
    story: `<p>Farah’s drum room opens straight onto the school corridor through one solid door. Lessons can be heard in every classroom, and each time a student arrives the full drum sound bursts out.</p>
      <p>She builds a 1.2 m deep lobby inside the room with a second solid-core door, both doors with compression seals and drop seals, and lines the lobby walls and ceiling with 50 mm absorber. Corridor levels fall from clearly disturbing to a faint thud, even while students come and go.</p>`,
    numbers: [['One solid-core door, no seals', 'about 20 dB'], ['Same door, sealed all round', 'about 30 dB'], ['Two sealed doors + lined lobby', 'about 45 to 50 dB'], ['Drums at 105 dB in the corridor', '105 − 48 ≈ 57 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Plan of a sound lock: two sealed doors with an absorbent lobby between corridor and studio">
      <line x1="40" y1="60" x2="600" y2="60" stroke="var(--muted)" stroke-width="6"/><line x1="40" y1="200" x2="600" y2="200" stroke="var(--muted)" stroke-width="6"/>
      <path d="M420 60 V110 M420 150 V200" stroke="var(--muted)" stroke-width="8"/>
      <text x="110" y="236" text-anchor="middle" font-size="12">corridor</text><text x="520" y="236" text-anchor="middle" font-size="12">drum room</text>
      <circle cx="530" cy="130" r="18" fill="var(--c1)"/><circle cx="530" cy="130" r="26" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/>
      <path d="M500 130 H430" stroke="var(--accent)" stroke-width="4" fill="none" class="rl-flow"/>
      <g data-step="=1"><path d="M412 130 H60" stroke="var(--bad)" stroke-width="4" fill="none" class="rl-flow"/></g>
      <g data-step="2"><line x1="420" y1="110" x2="420" y2="150" stroke="var(--good)" stroke-width="8"/>
        <circle cx="420" cy="110" r="5" fill="var(--warn)" class="seal-squish"/><circle cx="420" cy="150" r="5" fill="var(--warn)" class="seal-squish"/></g>
      <g data-step="2-3"><path d="M410 130 H60" stroke="var(--warn)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="3"><path d="M220 60 V110 M220 150 V200" stroke="var(--muted)" stroke-width="8"/>
        <rect x="226" y="64" width="188" height="12" fill="var(--c4)" opacity=".7"/><rect x="226" y="184" width="188" height="12" fill="var(--c4)" opacity=".7"/>
        <text x="320" y="96" text-anchor="middle" font-size="12">lined lobby</text></g>
      <g data-step="4"><line x1="220" y1="110" x2="220" y2="150" stroke="var(--good)" stroke-width="8"/>
        <path d="M410 130 H230" stroke="var(--warn)" stroke-width="2" fill="none" class="rl-flow"/><path d="M210 130 H60" stroke="var(--good)" stroke-width="1.2" fill="none" class="rl-flow slow"/></g>
      <g data-step="5"><circle cx="270" cy="150" r="9" fill="var(--c2)" class="rl-slide" style="--dx:100px"/></g>
      ${top(1, 'One unsealed door: sound pours out', '--bad')}
      ${top(2, 'Squeezed seals on all four edges: 30 dB')}
      ${top(3, 'Add a lobby lined with absorber')}
      ${top(4, 'A second sealed door: about 48 dB', '--good')}
      ${top(5, 'Walking through, one door stays shut', '--c2')}
    </svg>`,
    steps: [
      ['The starting point', 'A single door with gaps round it removes only about 20 dB, and nothing at all when it is open.'],
      ['Seals make the door', 'Soft seals pressed evenly on the head, jambs and threshold add about 10 dB for very little money.'],
      ['Build a lobby', 'A small space between two doors gives the sound a second barrier to cross. Lining it stops sound building up inside.'],
      ['Close the second door', 'Two modest sealed doors in series reach 45 to 50 dB, like a heavy and costly special door.'],
      ['It works while in use', 'People pass one door at a time, so the room is never open to the corridor.'],
    ],
    why: [
      'Two barriers with a dead air space between them behave like the two-leaf wall: each one works on what the other let through.',
      'A bare lobby would ring and feed the outer door a louder sound. Absorption in the lobby removes that build-up.',
      'Seals must be compressed evenly. A warped door or one loose hinge leaves a crescent gap that undoes the rest.',
    ],
    uses: [
      ['🎙️', 'Vocal booth', 'Use the wardrobe or a short passage as a lobby between booth and control room.'],
      ['🎬', 'Home cinema', 'A second door at the end of a short hallway gives late-night film levels without waking the house.'],
      ['🏫', 'Music classrooms', 'Pair rooms around a shared lined lobby to save doors and space.'],
    ],
    tryit: [
      'Stand in a hallway between two rooms with both doors closed and a radio playing in one. Open and close each door in turn.',
      'Close a door on a strip of paper at several points round the frame. Where the paper slides out freely, the seal is not touching.',
      'Sketch where a 1.2 m lobby could fit in your own plan without blocking the room.',
    ],
    slip: ['Leaving both lobby doors open “for air” during sessions.', 'Give the room its own quiet ventilation so the doors can stay shut.'],
  });

  /* ------------------------------------------------------------------ M10 */
  REAL('m-floors', {
    title: 'the drum room above the tailor’s shop',
    plain: 'A floating floor is a heavy slab resting on soft pads. If the pads are soft enough for the weight on them, vibration from above mostly fails to reach the building below.',
    where: 'A first-floor drum studio over a shop',
    story: `<p>Imran teaches drums above a tailor’s shop. The tailor hears every kick drum as a thump from the ceiling. Imran lays thick carpet and rubber gym tiles; the thump barely changes.</p>
      <p>An engineer then designs a plywood and screed deck on rubber pads chosen so the finished floor sinks 2.5 mm under its own weight. The thump falls dramatically. Months later a carpenter fixes a skirting board through the deck edge into the wall, and the thump is back until the skirting is cut free.</p>`,
    numbers: [['Pad squash under load', '2.5 mm'], ['Floor bounce frequency', '15.8 ÷ √2.5 ≈ 10 Hz'], ['Kick drum fundamental', '60 Hz (6 × the bounce)'], ['Vibration passed down', '1 ÷ (6² − 1) ≈ 3 % (−31 dB)'], ['Pads too stiff (0.25 mm squash)', '32 Hz bounce → only −8 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A drum on a floating slab over soft pads, compared with a drum directly on the structural floor">
      <rect x="60" y="186" width="520" height="20" fill="var(--muted)"/><text x="320" y="246" text-anchor="middle" font-size="12">shop below</text>
      <g data-step="=1"><ellipse cx="320" cy="166" rx="46" ry="16" fill="var(--c1)"/><rect x="274" y="166" width="92" height="20" fill="var(--c1)"/>
        <path d="M290 208 V236 M320 208 V236 M350 208 V236" stroke="var(--bad)" stroke-width="4" class="rl-flow" fill="none"/></g>
      <g data-step="2"><rect x="120" y="136" width="400" height="16" fill="var(--c2)"/>
        <g class="rl-bob">${zig(160, 152, 186, '--warn')}${zig(260, 152, 186, '--warn')}${zig(380, 152, 186, '--warn')}${zig(480, 152, 186, '--warn')}</g>
        <ellipse cx="320" cy="116" rx="46" ry="16" fill="var(--c1)"/><rect x="274" y="116" width="92" height="20" fill="var(--c1)"/></g>
      <g data-step="3"><text x="180" y="104" text-anchor="middle" font-size="12" fill="var(--warn)">pads squash</text><text x="180" y="120" text-anchor="middle" font-size="12" fill="var(--warn)">2.5 mm</text></g>
      <g data-step="4"><path d="M290 208 V232 M350 208 V232" stroke="var(--good)" stroke-width="1.2" class="rl-flow slow" fill="none"/></g>
      <g data-step="5"><rect x="520" y="136" width="14" height="50" fill="var(--bad)" class="rl-pulse"/><text x="566" y="150" text-anchor="middle" font-size="11" fill="var(--bad)">rigid</text><text x="566" y="164" text-anchor="middle" font-size="11" fill="var(--bad)">touch</text></g>
      ${top(1, 'Drum on the building floor: thump below', '--bad')}
      ${top(2, 'A heavy deck resting on soft pads')}
      ${top(3, 'Weight and softness set a 10 Hz bounce', '--warn')}
      ${top(4, 'A 60 Hz kick is cut by about 31 dB', '--good')}
      ${top(5, 'One rigid contact bridges the float', '--bad')}
    </svg>`,
    steps: [
      ['Direct contact', 'The kick drum shakes the structural floor, which radiates the thump into the shop. Carpet is too thin and light to help at 60 Hz.'],
      ['Mass on a spring', 'A heavy deck on soft pads is a weight on a spring. It has one slow natural bounce.'],
      ['Tune it by the squash', 'The more the pads compress under the real load, the lower the bounce: 2.5 mm gives about 10 Hz.'],
      ['Isolation above the bounce', 'Vibration much faster than the bounce cannot push the heavy deck around, so little passes into the pads and the slab.'],
      ['Guard the edges', 'A skirting, pipe, screw or screed spill that touches both deck and building carries the vibration straight across.'],
    ],
    why: [
      'Push a heavy swing much faster than it naturally swings and it barely moves. The floating deck is that swing.',
      'Pads only work when loaded to their design weight. Under-loaded pads are stiff, the bounce rises, and isolation at bass frequencies is lost.',
      'At and just above the bounce frequency the floor makes things worse, so the bounce must sit well below the lowest note that matters.',
    ],
    uses: [
      ['🥁', 'Drum risers', 'A dense platform on correctly loaded pads under the kit is the cheapest effective treatment for footfall and kick.'],
      ['🔊', 'Subwoofers', 'A heavy plinth on soft mounts keeps a sub from driving a timber floor.'],
      ['🏋️', 'Gyms above offices', 'Thick rubber tiles handle footfall; dropped weights need a properly designed floated slab.'],
    ],
    tryit: [
      'Place a phone on vibrate directly on a table, then on a thick soft sponge with a book on top. Listen to the table.',
      'For a mount you can press, estimate how far it sinks under its load and work out 15.8 ÷ √(squash in mm).',
      'Walk round a floated or laminate floor and look for anything rigid joining it to the wall.',
    ],
    slip: ['Choosing pads by thickness, or using more pads “to be safe”.', 'Choose pads by load so they compress as designed; more pads means stiffer and worse.'],
  });

  /* ------------------------------------------------------------------ M11 */
  REAL('m-large-rooms', {
    title: 'the echo in the school hall',
    plain: 'In a big room a reflection can come back so late that you hear it as a separate echo. Anything arriving more than about a twentieth of a second after the direct sound stops helping and starts confusing.',
    where: 'A 300-seat school assembly hall, 25 m long',
    story: `<p>At the annual day, Principal Rao speaks from the stage. People at the back hear her well. The teachers in the front row hear every word twice: once from the loudspeaker beside them, and again a moment later, slapping back from the bare painted rear wall.</p>
      <p>The school hangs a band of thick absorbent panels across the rear wall at head height and above. The slap disappears, and speech at the front becomes clear without touching the sound system.</p>`,
    numbers: [['Front row to rear wall', '22 m'], ['Extra path for the reflection', '2 × 22 = 44 m'], ['Delay', '44 ÷ 343 ≈ 128 ms'], ['Limit before it is heard as an echo', 'about 50 ms (17 m extra path)']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Long section of a hall: sound travels to the rear wall and returns to the front row as an echo">
      <line x1="40" y1="222" x2="604" y2="222" stroke="var(--line)" stroke-width="2"/><line x1="40" y1="58" x2="604" y2="58" stroke="var(--muted)" stroke-width="3"/>
      <rect x="600" y="58" width="8" height="164" fill="var(--muted)"/><rect x="40" y="196" width="100" height="26" fill="var(--panel)" stroke="var(--muted)"/>
      <rect x="118" y="130" width="18" height="34" fill="var(--c1)"/><text x="90" y="186" text-anchor="middle" font-size="12">stage</text>
      ${man(200, 176, '--c2')}<text x="200" y="244" text-anchor="middle" font-size="12">front row</text>
      <text x="560" y="244" text-anchor="middle" font-size="12">rear wall</text>
      <path d="M138 150 L192 172" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      <g data-step="2"><path d="M138 142 L598 120" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="3-4"><path d="M598 120 L212 172" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=4"><circle cx="200" cy="176" r="18" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/><circle cx="200" cy="176" r="18" fill="none" stroke="var(--bad)" stroke-width="2.5" class="rl-grow d4"/></g>
      <g data-step="5"><rect x="588" y="74" width="12" height="120" fill="var(--good)"/><path d="M586 124 L212 172" stroke="var(--good)" stroke-width="1" fill="none" class="rl-flow slow" opacity=".7"/></g>
      ${top(1, 'Direct sound reaches the front row first')}
      ${top(2, 'The same sound carries on down the hall')}
      ${top(3, 'It returns after 44 m more: 128 ms late', '--bad')}
      ${top(4, 'Heard twice: a clear slap-back echo', '--bad')}
      ${top(5, 'Absorb the rear wall and the echo goes', '--good')}
    </svg>`,
    steps: [
      ['The direct sound', 'Sound from the loudspeaker reaches the front row almost at once, over a few metres.'],
      ['The long way round', 'The rest travels the length of the hall to a large, flat, hard wall.'],
      ['A late return', 'The wall sends it back to the front. It has gone 44 m further and arrives 128 ms after the direct sound.'],
      ['The ear splits them', 'Reflections within about 50 ms blend in and add loudness. Later strong ones are heard separately and blur words.'],
      ['Treat that surface', 'Absorbing, breaking up or tilting the rear wall removes the one reflection causing the trouble.'],
    ],
    why: [
      'Our hearing fuses sounds that arrive close together and separates those far apart. The dividing line for speech is around 50 ms.',
      'The front rows suffer most because their direct sound is early and the return path is longest.',
      'Big flat surfaces reflect like mirrors. Smaller or uneven surfaces scatter the energy so no single strong echo forms.',
    ],
    uses: [
      ['⛪', 'Places of worship', 'Treat the wall opposite the pulpit or the balcony front before adding loudspeakers.'],
      ['🏟️', 'Sports halls', 'Absorb one of each pair of parallel walls to stop flutter between them during announcements.'],
      ['🎭', 'Theatres', 'Tilt or diffuse the rear wall so late energy goes to the ceiling and seats, not back to the stage.'],
    ],
    tryit: [
      'In a large empty hall, clap once from the front and listen for a distinct repeat. Walk towards the back and notice it merge.',
      'Measure or pace the distance to the rear wall and work out the delay: twice the distance ÷ 343.',
      'Find the extra path at which the delay reaches 50 ms (about 17 m) and mark which seats are beyond it.',
    ],
    slip: ['Turning the sound system up to beat an echo.', 'Louder direct sound makes a louder echo. Treat the reflecting surface or aim the loudspeakers away from it.'],
  });

  /* ------------------------------------------------------------------ M12 */
  REAL('m-small-rooms', {
    title: 'the bass that vanished at the desk',
    plain: 'In a small room, some bass notes fit exactly between two walls and stand still: loud at the walls, almost silent in the middle. Where you sit decides how much bass you hear.',
    where: 'A bedroom studio, 3.4 m long',
    story: `<p>Tanvi mixes with her desk and chair in the exact centre of her room, because it looked balanced. Her mixes sound fine at home but boom badly in the car. She keeps adding bass because she cannot hear it.</p>
      <p>She walks slowly from the front wall to the back while a low G plays. The note is huge at both walls and nearly gone in the middle, right where her chair was. She moves the chair to about 1.3 m from the front wall, and for the first time her mixes travel.</p>`,
    numbers: [['Room length', '3.4 m'], ['Note that fits the length', '343 ÷ (2 × 3.4) ≈ 50 Hz'], ['Quiet spot for that note', 'centre, 1.7 m'], ['A good first seat', '38 % of 3.4 m ≈ 1.3 m from the front wall']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A standing wave in a small room: loud at both walls, quiet in the centre; the seat moves to 38 percent">
      <rect x="80" y="56" width="480" height="160" fill="none" stroke="var(--muted)" stroke-width="5"/>
      <rect x="92" y="150" width="22" height="34" fill="var(--c1)"/><text x="103" y="240" text-anchor="middle" font-size="12">front wall</text><text x="548" y="240" text-anchor="middle" font-size="12">back wall</text>
      <g data-step="2"><path d="M84 76 C240 76 280 136 320 136 C360 136 400 76 556 76" fill="none" stroke="var(--c2)" stroke-width="3" class="rl-pulse"/>
        <path d="M84 196 C240 196 280 136 320 136 C360 136 400 196 556 196" fill="none" stroke="var(--c2)" stroke-width="3" class="rl-pulse"/></g>
      <g data-step="=3">${man(320, 150, '--bad')}<text x="320" y="118" text-anchor="middle" font-size="13" fill="var(--bad)">almost no bass</text></g>
      <g data-step="=4">${man(530, 150, '--warn')}<text x="486" y="118" text-anchor="middle" font-size="13" fill="var(--warn)">far too much</text></g>
      <g data-step="5">${man(262, 150, '--good')}<line x1="262" y1="60" x2="262" y2="212" stroke="var(--good)" stroke-dasharray="5 5"/>
        <text x="262" y="240" text-anchor="middle" font-size="12" fill="var(--good)">1.3 m</text></g>
      ${top(1, 'A speaker plays a low note in a 3.4 m room')}
      ${top(2, '50 Hz fits the length exactly and stands still')}
      ${top(3, 'In the centre the pressure cancels', '--bad')}
      ${top(4, 'Against a wall it piles up', '--warn')}
      ${top(5, 'Sit about 38 % in: a fair balance', '--good')}
    </svg>`,
    steps: [
      ['A note the room likes', 'Sound bounces between the front and back walls. For one frequency, the trips line up perfectly.'],
      ['The wave stands still', 'At that frequency the pressure swings hard at each wall and hardly at all midway. The pattern does not move.'],
      ['The centre is a hole', 'Sitting in the middle, you hear almost none of that note, however loud it really is.'],
      ['The walls are hot spots', 'At a wall the same note is at its strongest, along with every other room note.'],
      ['Choose the seat first', 'About 38 % of the length from the front wall avoids the worst holes and peaks of the first few room notes.'],
    ],
    why: [
      'A wave reflected between two walls adds to itself only when a whole number of half-waves fits the distance. Those are the room’s own notes.',
      'Small rooms have these notes spread thinly in the bass, so each one stands out. Large rooms have so many that they blur together.',
      'Moving the seat or the speakers costs nothing and changes the bass more than most treatment.',
    ],
    uses: [
      ['🎚️', 'Mix position', 'Set the chair before anything else; then add bass traps at the walls where the pressure is highest.'],
      ['🔊', 'Subwoofer placement', 'Put the sub where a room note’s quiet zone is, so it cannot drive that note strongly.'],
      ['🛋️', 'Home cinema seats', 'Keep the main row away from both the centre line of the length and the back wall.'],
    ],
    tryit: [
      'Work out your room’s first note for length, width and height: 343 ÷ (2 × size in metres).',
      'Play a steady tone at the length note quietly and walk from front to back. Mark where it fades and where it swells.',
      'Mark 38 % of your room length from the front wall with tape and compare the bass there with the centre.',
    ],
    slip: ['Boosting the missing note with an equaliser.', 'A hole caused by cancellation cannot be filled with level. Move the seat or the speakers, then treat.'],
  });

  /* ------------------------------------------------------------------ M13 */
  REAL('m-control', {
    title: 'the mirror on the side wall',
    plain: 'Sound from each speaker reaches you directly and also by bouncing off the nearest wall a few thousandths of a second later. That bounce smears the stereo picture. You can find the exact spot with a mirror and treat just that.',
    where: 'A project studio control room',
    story: `<p>Nikhil’s vocals never sit dead centre, and panned guitars seem to wander. His speakers are good and symmetrical. A friend holds a small mirror flat against the left wall and slides it along while Nikhil sits in the mix chair.</p>
      <p>When Nikhil sees the left tweeter in the mirror, they mark the wall. They do the same on the right wall and the ceiling, then hang a 100 mm absorber on each mark. The centre snaps into focus.</p>`,
    numbers: [['Speaker to ear, direct', '1.43 m'], ['Via the side wall', '2.91 m'], ['Extra path', '1.48 m'], ['Delay', '1.48 ÷ 343 ≈ 4.3 ms'], ['Mirror point', '0.5 m in front of the speaker']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Plan view: a side-wall reflection from speaker to listener, found with a mirror and treated with a panel">
      <line x1="60" y1="46" x2="600" y2="46" stroke="var(--muted)" stroke-width="6"/><text x="560" y="36" text-anchor="end" font-size="12">side wall</text>
      <rect x="186" y="146" width="28" height="28" fill="var(--c1)"/><text x="170" y="196" text-anchor="middle" font-size="12">speaker</text>
      <circle cx="343" cy="226" r="11" fill="var(--c2)"/><text x="392" y="232" font-size="12">mix seat</text>
      <rect x="276" y="176" width="140" height="22" rx="4" fill="var(--panel)" stroke="var(--muted)"/><text x="346" y="191" text-anchor="middle" font-size="11">desk</text>
      <path d="M214 166 L334 220" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      <g data-step="2-4"><path d="M204 146 L255 50 L338 216" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=3"><text x="470" y="120" text-anchor="middle" font-size="13" fill="var(--bad)">1.5 m further</text><text x="470" y="138" text-anchor="middle" font-size="13" fill="var(--bad)">4.3 ms late</text></g>
      <g data-step="=4"><rect x="196" y="50" width="22" height="8" fill="var(--c3)" class="rl-slide" style="--dx:48px"/><text x="470" y="120" text-anchor="middle" font-size="13" fill="var(--c3)">slide a mirror</text><text x="470" y="138" text-anchor="middle" font-size="13" fill="var(--c3)">along the wall</text></g>
      <g data-step="5"><rect x="205" y="50" width="100" height="16" fill="var(--good)"/><path d="M204 146 L255 68" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow"/>
        <text x="470" y="120" text-anchor="middle" font-size="13" fill="var(--good)">absorber on the mark</text></g>
      ${top(1, 'The direct sound: 1.43 m, arrives first')}
      ${top(2, 'A copy bounces off the side wall', '--bad')}
      ${top(3, 'It arrives late and blurs the image', '--bad')}
      ${top(4, 'See the speaker in the mirror: mark it', '--c3')}
      ${top(5, 'One panel there removes that bounce', '--good')}
    </svg>`,
    steps: [
      ['Direct sound', 'What you want to judge is the sound coming straight from the speaker to your ears.'],
      ['The first reflection', 'A second copy leaves the speaker sideways, hits the wall and reaches you from a slightly different direction.'],
      ['Close in time, so it merges', 'A few milliseconds late, it is not heard as an echo. It combs the frequency response and pulls the image towards the wall.'],
      ['Sound reflects like light', 'A flat wall reflects sound at the same angle as light, so the place where you see the speaker in a mirror is the bounce point.'],
      ['Treat only what matters', 'A thick absorber or a diffuser at each marked point, on both sides and the ceiling, cleans up the early sound.'],
    ],
    why: [
      'Two copies of a sound a few milliseconds apart cancel at some frequencies and add at others, which colours everything you hear.',
      'Stereo imaging depends on tiny left-right timing and level differences. Strong side reflections scramble them.',
      'Treating the handful of first-reflection points gives most of the benefit while leaving the rest of the room lively.',
    ],
    uses: [
      ['🎚️', 'Any mix room', 'Mark both side walls, the ceiling and the desk surface; treat symmetrically left and right.'],
      ['🎧', 'Hi-fi and cinema', 'The same mirror points apply; a bookcase or thick panel there improves focus.'],
      ['🖥️', 'Desks and screens', 'A large flat desk is a reflector too. Keep it low and small between speakers and ears.'],
    ],
    tryit: [
      'Sit in your listening seat while a helper slides a hand mirror along the side wall at speaker height. Mark where each speaker appears.',
      'Hang a folded duvet on one mark and play a mono voice. Listen for the centre image tightening.',
      'Measure the direct and wall-bounce distances with a tape and work out the delay: difference ÷ 343.',
    ],
    slip: ['Covering whole walls with thin foam to “kill reflections”.', 'Use thick absorbers at the marked points only, and keep left and right identical.'],
  });

  /* ------------------------------------------------------------------ M14 */
  REAL('m-tracking', {
    title: 'one room, two sounds',
    plain: 'A recording room does not need one fixed sound. Panels that are hard on one face and absorbent on the other let you make the same room lively for drums or tight for vocals in a minute.',
    where: 'A 40 m² tracking room in a small commercial studio',
    story: `<p>Rohan’s live room sounds wonderful on drums: open and long. On voice-overs and acoustic guitar the same liveliness is a nuisance, and clients complain of “room” on the takes.</p>
      <p>He builds 16 m² of hinged wall panels, timber on one face and 100 mm absorber on the other. Open them to the absorber side and the decay drops by about a quarter. Each session now starts with a choice, and the choice is written on the track sheet.</p>`,
    numbers: [['Room volume', '120 m³'], ['Live setting', 'RT 0.60 s → 0.161 × 120 ÷ 0.60 = 32 m²'], ['Panels flipped', '16 m² × (0.85 − 0.10) = +12 m²'], ['Tight setting', '0.161 × 120 ÷ 44 ≈ 0.44 s']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Hinged panels flip from a hard face to an absorbent face and the room's decay shortens">
      <rect x="50" y="50" width="350" height="166" fill="none" stroke="var(--muted)" stroke-width="4"/>
      <ellipse cx="150" cy="186" rx="34" ry="12" fill="var(--c1)"/><rect x="116" y="186" width="68" height="18" fill="var(--c1)"/>
      <circle cx="150" cy="180" r="24" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/>
      <g data-step="1-2"><rect x="382" y="66" width="12" height="40" fill="var(--c1)"/><rect x="382" y="112" width="12" height="40" fill="var(--c1)"/><rect x="382" y="158" width="12" height="40" fill="var(--c1)"/>
        <path d="M184 176 L380 100 L120 60 L60 150 L378 180" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-flow slow"/></g>
      <g data-step="3"><rect x="374" y="66" width="20" height="40" fill="var(--c4)" class="rl-pulse"/><rect x="374" y="112" width="20" height="40" fill="var(--c4)" class="rl-pulse d2"/><rect x="374" y="158" width="20" height="40" fill="var(--c4)" class="rl-pulse d3"/>
        <path d="M184 176 L372 100" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-flow slow"/></g>
      <line x1="440" y1="60" x2="440" y2="210" stroke="var(--line)" stroke-width="2"/><line x1="440" y1="210" x2="622" y2="210" stroke="var(--line)" stroke-width="2"/><text x="530" y="232" text-anchor="middle" font-size="12">time</text>
      <g data-step="2"><path d="M444 72 L612 190" stroke="var(--c1)" stroke-width="3" fill="none"/><text x="574" y="130" text-anchor="middle" font-size="13" fill="var(--c1)">0.60 s</text></g>
      <g data-step="4"><path d="M444 72 L566 204" stroke="var(--c4)" stroke-width="3" fill="none"/><text x="488" y="180" text-anchor="middle" font-size="13" fill="var(--c4)">0.44 s</text></g>
      ${top(1, 'Timber faces out: sound keeps bouncing')}
      ${top(2, 'A long, open decay that suits drums')}
      ${top(3, 'Flip the panels to their absorbent face')}
      ${top(4, 'The decay shortens by about a quarter')}
      ${top(5, 'Choose per session and note the setting', '--good')}
    </svg>`,
    steps: [
      ['Hard faces', 'With timber showing, most of the sound reflects and the room stays lively.'],
      ['Live decay', 'The sound takes 0.6 s to die away: flattering for drums, strings and group vocals.'],
      ['Soft faces', 'Swinging the panels round exposes 16 m² of thick absorber where the timber was.'],
      ['Tight decay', 'Twelve more square metres of absorption bring the decay down to about 0.44 s.'],
      ['Make it a habit', 'Decide the setting from the instrument and the mic distance, and record it so the sound can be matched later.'],
    ],
    why: [
      'Decay time depends on room volume divided by total absorption. Change the absorption and the decay follows.',
      'A big swing needs a big area. A few small panels change less than you can hear.',
      'Variable elements also move reflections around, so the best spot for a kit may shift with the setting.',
    ],
    uses: [
      ['🥁', 'Drums then vocals', 'Hard faces and distant room mics for the kit; soft faces and a close mic for the vocal overdub.'],
      ['🎻', 'Strings and choirs', 'Leave everything hard and draw heavy curtains only if the engineer asks for less room.'],
      ['🏫', 'Multi-purpose halls', 'Full-height curtains on tracks give the same choice between music and speech.'],
    ],
    tryit: [
      'Record a hand clap in a room with curtains open, then closed, and compare the tails by ear or on a waveform.',
      'Work out the absorption your room has now: 0.161 × volume ÷ decay time.',
      'Work out how many square metres you would have to flip from hard to soft to cut your decay by a quarter.',
    ],
    slip: ['Treating a tracking room until it is as dead as a control room.', 'Keep a lively baseline and add absorption you can remove.'],
  });

  /* ------------------------------------------------------------------ M15 */
  REAL('m-music-booths', {
    title: 'why the vocal booth sounded like a cupboard',
    plain: 'A very small booth puts walls so close to the microphone that their reflections come back almost at once and colour the voice. It needs thick absorption on every side, or it needs to be bigger.',
    where: 'A vocal booth, 1.2 m × 1.5 m, built in the corner of a studio',
    story: `<p>Sneha records a singer in her new booth and every take has a hollow, boxy tone around the lower mids. The booth is lined with thin 25 mm foam and “feels dead” when you talk in it.</p>
      <p>The foam only absorbs the highs. The walls are 0.6 m from the mic, so strong reflections return within a few thousandths of a second, and a note near 143 Hz rings between the side walls. She relines the walls and ceiling with 100 mm absorber over an air gap and the cupboard sound goes.</p>`,
    numbers: [['Booth width', '1.2 m'], ['Note that fits the width', '343 ÷ (2 × 1.2) ≈ 143 Hz'], ['Note that fits the 1.5 m depth', '343 ÷ (2 × 1.5) ≈ 114 Hz'], ['Wall reflection delay', '1.2 ÷ 343 ≈ 3.5 ms']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Plan of a small vocal booth with close wall reflections, then lined with thick absorber">
      <rect x="254" y="50" width="132" height="165" fill="none" stroke="var(--muted)" stroke-width="5"/>
      <circle cx="320" cy="160" r="12" fill="var(--c2)"/><rect x="314" y="108" width="12" height="20" rx="5" fill="var(--c1)"/>
      <text x="320" y="240" text-anchor="middle" font-size="12">booth 1.2 m wide</text>
      <circle cx="320" cy="152" r="16" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/>
      <g data-step="2-3"><path d="M312 152 L258 134 L314 118" fill="none" stroke="var(--bad)" stroke-width="2.5" class="rl-flow"/><path d="M328 152 L382 134 L326 118" fill="none" stroke="var(--bad)" stroke-width="2.5" class="rl-flow"/></g>
      <g data-step="=3"><path d="M258 84 Q320 60 382 84" fill="none" stroke="var(--warn)" stroke-width="3" class="rl-pulse"/><path d="M258 84 Q320 108 382 84" fill="none" stroke="var(--warn)" stroke-width="3" class="rl-pulse"/></g>
      <g data-step="4"><rect x="258" y="54" width="18" height="157" fill="var(--c4)" opacity=".75"/><rect x="364" y="54" width="18" height="157" fill="var(--c4)" opacity=".75"/><rect x="276" y="54" width="88" height="16" fill="var(--c4)" opacity=".75"/><rect x="276" y="195" width="88" height="16" fill="var(--c4)" opacity=".75"/>
        <path d="M312 152 L280 142" fill="none" stroke="var(--good)" stroke-width="1.5" class="rl-flow slow"/><path d="M328 152 L360 142" fill="none" stroke="var(--good)" stroke-width="1.5" class="rl-flow slow"/></g>
      <g data-step="5"><rect x="200" y="36" width="240" height="190" fill="none" stroke="var(--good)" stroke-width="2" stroke-dasharray="7 6"/></g>
      <g data-step="=2"><text x="130" y="130" text-anchor="middle" font-size="13" fill="var(--bad)">back in 3.5 ms</text></g>
      <g data-step="=3"><text x="130" y="88" text-anchor="middle" font-size="13" fill="var(--warn)">143 Hz rings</text><text x="130" y="106" text-anchor="middle" font-size="13" fill="var(--warn)">side to side</text></g>
      <g data-step="=4"><text x="520" y="130" text-anchor="middle" font-size="13" fill="var(--good)">100 mm absorber</text><text x="520" y="148" text-anchor="middle" font-size="13" fill="var(--good)">all round</text></g>
      <g data-step="=5"><text x="530" y="130" text-anchor="middle" font-size="13" fill="var(--good)">or build it</text><text x="530" y="148" text-anchor="middle" font-size="13" fill="var(--good)">2 m × 2.5 m</text></g>
      ${top(1, 'The singer is 0.6 m from every wall')}
      ${top(2, 'Reflections return almost instantly', '--bad')}
      ${top(3, 'A low-mid note fits between the walls', '--warn')}
      ${top(4, 'Thick lining absorbs down into the lows', '--good')}
      ${top(5, 'A bigger booth moves the problem lower', '--good')}
    </svg>`,
    steps: [
      ['Walls within arm’s reach', 'In a tiny booth the mic hears the walls nearly as loudly as the voice.'],
      ['Very early reflections', 'A bounce only 3 to 4 ms behind the voice combs the tone, giving the hollow sound.'],
      ['Room notes in the voice range', 'Small dimensions push the booth’s own notes up to 110 to 150 Hz, right where voices and guitars have body.'],
      ['Absorb deep, not thin', 'Thin foam takes only the top end and leaves the boxiness. Thick absorber with an air gap works down to the lower mids.'],
      ['Size is treatment too', 'Larger dimensions lower the booth’s notes and lengthen the reflection paths, so less lining is needed.'],
    ],
    why: [
      'Absorbers reach down to roughly the frequency whose quarter-wavelength equals their depth. 25 mm reaches about 3,400 Hz; 150 mm about 570 Hz.',
      'A booth that is dead at the top and ringing lower down sounds worse than an untreated room, because the balance is wrong.',
      'Non-parallel walls help flutter slightly but do not remove the low room notes; depth of absorption does.',
    ],
    uses: [
      ['🎤', 'Vocal booths', 'Line at least three walls and the ceiling with 100 mm or more; keep the singer off the centre.'],
      ['🎸', 'Amp cupboards', 'A lined isolation box for a guitar amp needs the same thick absorption or the mic hears the box.'],
      ['🧳', 'Portable shields', 'A curved screen behind the mic helps a little; treating the wall behind the singer helps more.'],
    ],
    tryit: [
      'Speak in a wardrobe full of clothes, then in an empty one of the same size. Hear the cupboard tone come and go.',
      'Work out the first note for each dimension of a booth you use: 343 ÷ (2 × size).',
      'Record a spoken sentence 10 cm from a bare wall and again 1 m from it. Compare the tone.',
    ],
    slip: ['Judging a booth by how dead a hand clap sounds.', 'Judge by a recorded low male voice or acoustic guitar: listen for boxiness in the lower mids.'],
  });

  /* ------------------------------------------------------------------ M16 */
  REAL('m-vo-booths', {
    title: 'the audiobook that failed the noise check',
    plain: 'For spoken word, the room’s background noise matters as much as its echo. The gap between the level of the voice and the level of the room noise at the microphone decides whether a recording is usable.',
    where: 'A home narration booth under the stairs',
    story: `<p>Priya records an audiobook chapter. The platform rejects it: the noise in the pauses is too high. Her booth is well padded and sounds dry, so she is puzzled.</p>
      <p>The culprit is her laptop, sitting inside the booth with its fan running. She moves the laptop outside and runs a long cable to a small screen, then works 10 cm closer to the microphone with a pop filter. The same booth now passes with room to spare.</p>`,
    numbers: [['Voice at 20 cm', '65 dB'], ['Booth noise with laptop inside', '35 dB → gap 30 dB'], ['Gap needed (about)', '40 dB'], ['Laptop moved outside', '24 dB → gap 41 dB'], ['Mic at 10 cm', '+6 dB → gap 47 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A narrator in a booth with a noisy laptop; level bars show the gap between voice and noise growing">
      <rect x="40" y="50" width="350" height="170" fill="none" stroke="var(--muted)" stroke-width="5"/>
      ${man(120, 140, '--c2')}<rect x="168" y="138" width="12" height="22" rx="5" fill="var(--c1)"/><line x1="174" y1="160" x2="174" y2="216" stroke="var(--muted)" stroke-width="3"/>
      <circle cx="136" cy="146" r="14" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/>
      <g data-step="1-2"><rect x="290" y="186" width="60" height="8" fill="var(--muted)"/><rect x="296" y="150" width="48" height="36" fill="var(--panel)" stroke="var(--muted)"/>
        <g class="rl-spin"><path d="M320 158 v20 M310 168 h20" stroke="var(--bad)" stroke-width="3"/></g></g>
      <g data-step="=2"><path d="M292 168 H186" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="3"><rect x="400" y="186" width="50" height="8" fill="var(--muted)"/><rect x="405" y="156" width="40" height="30" fill="var(--panel)" stroke="var(--muted)"/><text x="425" y="212" text-anchor="middle" font-size="11">outside</text></g>
      <line x1="486" y1="230" x2="620" y2="230" stroke="var(--line)" stroke-width="2"/>
      <rect x="500" y="86" width="40" height="144" fill="var(--accent)"/><text x="520" y="250" text-anchor="middle" font-size="12">voice</text><text x="585" y="250" text-anchor="middle" font-size="12">noise</text>
      <g data-step="=2"><rect x="565" y="182" width="40" height="48" fill="var(--bad)" class="rl-pulse"/><text x="585" y="172" text-anchor="middle" font-size="13" fill="var(--bad)">35 dB</text></g>
      <g data-step="3"><rect x="565" y="217" width="40" height="13" fill="var(--good)"/><text x="585" y="208" text-anchor="middle" font-size="13" fill="var(--good)">24 dB</text></g>
      <g data-step="4"><rect x="500" y="67" width="40" height="19" fill="var(--c4)" class="rl-pulse"/><rect x="150" y="138" width="12" height="22" rx="5" fill="var(--c4)"/></g>
      <text x="520" y="60" text-anchor="middle" font-size="13">65 dB</text>
      ${top(1, 'A dry booth and a steady voice')}
      ${top(2, 'A fan inside: only 30 dB between them', '--bad')}
      ${top(3, 'Noise source moved out: the gap is 41 dB', '--good')}
      ${top(4, 'Mic at half the distance: 6 dB more voice', '--c4')}
      ${top(5, 'A 47 dB gap: clean pauses, passes easily', '--good')}
    </svg>`,
    steps: [
      ['Two levels at the mic', 'The microphone hears the voice and everything else. What matters is the difference between them.'],
      ['Noise fills the pauses', 'With a fan in the booth the noise is only 30 dB under the voice, and it is plain to hear whenever the narrator stops.'],
      ['Remove the source', 'Taking the machine outside drops the booth noise by 11 dB. Padding could never do that, because the noise was inside.'],
      ['Get closer', 'Halving the mic distance raises the voice 6 dB while the room noise stays the same.'],
      ['Check before recording', 'Record ten seconds of silence at the start of every session and look at its level.'],
    ],
    why: [
      'Absorption reduces echo, not a noise source sitting in the room with you.',
      'Close to a small source, level rises 6 dB for each halving of distance; steady room noise does not change with mic position.',
      'Listeners on headphones hear the noise floor rise and fall with every edit, so a low and steady floor matters more than a perfect tone.',
    ],
    uses: [
      ['📚', 'Audiobooks', 'Keep computers, drives and lights with fans outside; use a silent screen or tablet inside.'],
      ['🎮', 'Game dialogue', 'Shouted and whispered lines share a session: set the gain for shouts, and the quiet room protects the whispers.'],
      ['📞', 'Remote sessions', 'Switch off the air-conditioner for takes and ventilate between them if there is no silent supply.'],
    ],
    tryit: [
      'Record 10 seconds of silence in your recording spot, then a normal sentence. Compare the two levels on the meter.',
      'Switch off one noise source at a time (fan, fridge, computer) and repeat the silence test to find the worst one.',
      'Record the same sentence at 20 cm and at 10 cm, and compare how audible the room is in each.',
    ],
    slip: ['Using a noise-removal plug-in to pass the check.', 'Remove the noise at the source first. Heavy processing leaves a watery sound that listeners notice.'],
  });

  /* ------------------------------------------------------------------ M17 */
  REAL('m-foley', {
    title: 'footsteps for a film, and a line re-recorded',
    plain: 'Film sound is often re-made afterwards: footsteps and cloth are performed to picture on special floors, and dialogue is re-spoken in a very dry, very quiet room so that any location’s echo can be added later.',
    where: 'A small post-production stage for a regional feature film',
    story: `<p>A street scene was shot beside a generator, so the dialogue and footsteps are unusable. Anand, the Foley artist, walks on a gravel pit in time with the actor on screen while a microphone a metre away records each step. Then he records the rustle of a cotton shirt, a far quieter sound.</p>
      <p>On the first day the air-conditioning hums at 32 dB and the cloth takes are buried. With the unit off the room drops to 20 dB and the same rustle is clean. Later the actor re-speaks her line in the same dry room, and the mixer adds street reverb to match the picture.</p>`,
    numbers: [['Cloth rustle at the mic', 'about 35 dB'], ['Room with air-con on', '32 dB → only 3 dB clear'], ['Room with silent air', '20 dB → 15 dB clear'], ['Room decay for dialogue', 'about 0.2 s']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A Foley stage: a performer walks on surface pits in sync with a screen while a microphone records; noise bars show the margin">
      <rect x="40" y="50" width="120" height="76" rx="4" fill="var(--panel)" stroke="var(--muted)" stroke-width="3"/><text x="100" y="146" text-anchor="middle" font-size="12">picture</text>
      <line x1="40" y1="222" x2="470" y2="222" stroke="var(--line)" stroke-width="2"/>
      <rect x="190" y="206" width="80" height="16" fill="var(--c1)"/><rect x="280" y="206" width="80" height="16" fill="var(--c3)"/><rect x="370" y="206" width="80" height="16" fill="var(--muted)"/>
      <text x="230" y="242" text-anchor="middle" font-size="11">gravel</text><text x="320" y="242" text-anchor="middle" font-size="11">wood</text><text x="410" y="242" text-anchor="middle" font-size="11">concrete</text>
      <g data-step="1"><circle cx="88" cy="80" r="7" fill="var(--c2)" class="rl-slide" style="--dx:24px"/></g>
      <g data-step="2" class="rl-bob">${man(230, 158, '--c2')}</g>
      <g data-step="2"><circle cx="230" cy="206" r="12" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-grow"/>
        <rect x="296" y="168" width="10" height="20" rx="4" fill="var(--c1)"/><line x1="301" y1="188" x2="301" y2="206" stroke="var(--muted)" stroke-width="3"/></g>
      <line x1="496" y1="222" x2="624" y2="222" stroke="var(--line)" stroke-width="2"/>
      <g data-step="3"><rect x="506" y="122" width="34" height="100" fill="var(--accent)"/><text x="523" y="112" text-anchor="middle" font-size="12">cloth</text><text x="523" y="242" text-anchor="middle" font-size="11">35 dB</text></g>
      <g data-step="=4"><rect x="566" y="131" width="34" height="91" fill="var(--bad)" class="rl-pulse"/><text x="583" y="120" text-anchor="middle" font-size="12" fill="var(--bad)">hum</text><text x="583" y="242" text-anchor="middle" font-size="11">32 dB</text></g>
      <g data-step="5"><rect x="566" y="165" width="34" height="57" fill="var(--good)"/><text x="583" y="154" text-anchor="middle" font-size="12" fill="var(--good)">room</text><text x="583" y="242" text-anchor="middle" font-size="11">20 dB</text></g>
      ${top(1, 'The performer watches the picture')}
      ${top(2, 'Steps on the matching surface, in sync')}
      ${top(3, 'Quiet props need a very quiet room')}
      ${top(4, 'Air-con hum is only 3 dB under the cloth', '--bad')}
      ${top(5, 'Silent air: 15 dB clear, a usable take', '--good')}
    </svg>`,
    steps: [
      ['Perform to picture', 'The artist watches the scene and copies the actor’s movement exactly.'],
      ['The right surface', 'Pits of gravel, timber, concrete and more let the same shoes sound like any location.'],
      ['Tiny sounds, close mics', 'Cloth, paper and hands are very quiet. The room must be quieter still by a clear margin.'],
      ['Noise eats the margin', 'A ventilation hum close to the level of the prop cannot be separated from it afterwards.'],
      ['Dry and silent', 'Low noise and a short decay give clean material. Echo to suit the scene is added in the mix, never removed.'],
    ],
    why: [
      'You can add reverberation and background to a clean recording, but you cannot take them away without damage.',
      'Quiet sounds are recorded with high gain, which raises the room noise by the same amount.',
      'A dry room sounds like “nowhere”, which is what lets the mixer place the sound anywhere.',
    ],
    uses: [
      ['🎬', 'Foley stages', 'Design the air system first: large, slow, lined ducts so the room stays near 20 dB while occupied.'],
      ['🗣️', 'Dialogue replacement', 'A decay near 0.2 s and a quiet floor so shoes and script pages make no noise.'],
      ['🎮', 'Game and animation sound', 'The same dry, silent room serves for props, voices and effects.'],
    ],
    tryit: [
      'Record yourself rubbing a shirt sleeve 30 cm from a phone, once with a fan running and once without. Compare.',
      'Film ten seconds of someone walking, then record footsteps to match it while watching. Check the sync.',
      'Speak a line in a bathroom and in a wardrobe. Decide which recording could be made to sound like a street.',
    ],
    slip: ['Recording effects in a nice-sounding live room.', 'Record dry and quiet; add the room that matches the picture afterwards.'],
  });
})();
