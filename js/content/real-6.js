/* "In real life" blocks — group 6 (treatment designs, speakers, services and the first studio plans).
   Each REAL(id, {...}) adds a worked scene, a step-through animated diagram and a practical
   wrap-up to an existing lesson (see js/real-kit.js). */
(function () {
  const REAL = window.REAL; if (!REAL) return;
  // short text helper: T(x, y, 'label', { a: anchor, z: size, c: theme colour name, w: bold })
  const T = (x, y, s, o) => { o = o || {}; return `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.z || 13}"${o.c ? ` style="fill:var(--${o.c})"` : ''}${o.w ? ' font-weight="700"' : ''}>${s}</text>`; };
  const head = (x, y, c) => `<circle cx="${x}" cy="${y}" r="11" fill="var(--${c || 'c2'})"/><circle cx="${x - 12}" cy="${y}" r="3" fill="var(--${c || 'c2'})"/><circle cx="${x + 12}" cy="${y}" r="3" fill="var(--${c || 'c2'})"/>`;

  /* ------------------------------------------------------------------ */
  REAL('m-treat-designs', {
    title: 'the room that was covered in thin foam',
    plain: 'Every treatment is a tool for one job. Thin soft panels only stop treble. Thick panels with an air gap stop the middle. Bass needs great depth or a tuned box. Pick the tool by the problem, not by how it looks.',
    where: 'A 4.0 × 3.2 m spare room used for mixing, Hyderabad',
    story: `<p>Ravi’s mixes boomed in the car and sounded dull everywhere else. He had glued 25 mm foam tiles over almost every wall. The room felt “dead”, yet one bass note still rang on and on.</p>
      <p>He measured the room. The ringing note was the 54 Hz mode across the 3.2 m width. Foam that thin does nothing down there. He took most of it off, put 100 mm panels with a 100 mm air gap at the reflection points, built deep traps in the corners, and left the rear wall lively with a diffuser.</p>`,
    numbers: [['Boomy note (width mode)', '343 ÷ (2 × 3.2) ≈ 54 Hz'], ['25 mm foam works above about', '343 ÷ (4 × 0.025) ≈ 3400 Hz'], ['100 mm panel + 100 mm gap', '343 ÷ (4 × 0.2) ≈ 430 Hz and up'], ['Wool depth to reach 54 Hz the same way', '343 ÷ (4 × 54) ≈ 1.6 m']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Plan of a small mix room showing which treatment fixes which problem">
      <rect x="60" y="40" width="520" height="190" fill="var(--panel)" stroke="var(--text)" stroke-width="3"/>
      <rect x="96" y="82" width="22" height="26" fill="var(--text)"/><rect x="96" y="162" width="22" height="26" fill="var(--text)"/>
      ${head(270, 135)}
      ${T(107, 140, 'speakers', { z: 12 })}${T(270, 164, 'you', { z: 12 })}
      <g data-step="1-3"><rect x="64" y="44" width="512" height="182" fill="var(--bad)" opacity=".16" class="rl-pulse"/></g>
      <g data-step="=1">${T(440, 100, '54 Hz boom fills the room', { c: 'bad' })}${T(440, 180, 'echo between bare walls', { c: 'warn' })}</g>
      <g data-step="1-2"><path d="M118 95 L190 44 L262 128" fill="none" stroke="var(--warn)" stroke-width="2.5" class="rl-flow"/>
        <path d="M118 175 L190 226 L262 142" fill="none" stroke="var(--warn)" stroke-width="2.5" class="rl-flow"/>
        <path d="M400 46 V224" fill="none" stroke="var(--warn)" stroke-width="2" class="rl-flow slow"/></g>
      <g data-step="=2"><rect x="62" y="42" width="516" height="186" fill="none" stroke="var(--c5)" stroke-width="5" stroke-dasharray="14 5"/>
        ${T(440, 100, '25 mm foam everywhere', { c: 'c5' })}${T(440, 120, 'treble gone, boom untouched', { z: 12 })}</g>
      <g data-step="3"><rect x="160" y="43" width="62" height="13" fill="var(--c2)"/><rect x="160" y="214" width="62" height="13" fill="var(--c2)"/>
        <rect x="225" y="100" width="92" height="70" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/></g>
      <g data-step="=3">${T(440, 100, 'thick panels + air gap', { c: 'c2' })}${T(440, 120, 'at the mirror points, cloud above', { z: 12 })}</g>
      <g data-step="4"><path d="M62 42 h44 l-44 44 z M62 228 h44 l-44 -44 z M578 42 h-44 l44 44 z M578 228 h-44 l44 -44 z" fill="var(--c4)"/></g>
      <g data-step="=4">${T(440, 100, 'deep corner traps', { c: 'c4' })}${T(440, 120, 'the 54 Hz ring dies faster', { z: 12 })}</g>
      <g data-step="5"><path d="M570 96 v78" stroke="var(--c3)" stroke-width="9" stroke-dasharray="7 6"/>
        <circle cx="540" cy="135" r="20" fill="none" stroke="var(--c3)" stroke-width="2" class="rl-grow"/>
        <circle cx="540" cy="135" r="20" fill="none" stroke="var(--c3)" stroke-width="2" class="rl-grow d3"/></g>
      <g data-step="=5">${T(430, 100, 'diffuser on the rear wall', { c: 'c3' })}${T(430, 120, 'keeps some life in the room', { z: 12 })}</g>
    </svg>`,
    steps: [
      ['Three different problems', 'A booming bass note, a fluttery echo between bare walls, and strong side reflections that smear the stereo picture.'],
      ['One tool for everything fails', 'Thin foam soaks up treble only. The room turns dull while the bass problem stays exactly as it was.'],
      ['Thick panels for the middle', '100 mm panels spaced 100 mm off the wall, placed where the speakers “mirror” to your ears, clean up mids and highs.'],
      ['Depth or tuning for the bass', 'Deep corner traps (or a tuned panel) are the only things that reach 54 Hz in a small room.'],
      ['Scatter what is left', 'A diffuser on the rear wall spreads the remaining sound so the room is controlled but not dead.'],
    ],
    why: [
      'A soft panel only works when it is a fair fraction of the wavelength deep. Treble waves are centimetres long; bass waves are metres long.',
      'An air gap behind a panel puts the wool where the air is moving fastest, so the same panel reaches about an octave lower.',
      'Tuned traps (a panel or a slotted box on an air spring) swap depth for accuracy: they work at one note, so they must be aimed at a measured problem.',
    ],
    uses: [
      ['🎚️', 'Home mix room', 'Start with corner traps and four thick panels at the mirror points before buying anything else.'],
      ['🥁', 'Rehearsal room', 'Cover about a quarter of the walls with 100 mm panels; leave the rest hard so the band can still hear itself.'],
      ['🎙️', 'Podcast corner', 'Speech has little below 100 Hz, so 50–75 mm panels around the mic are enough; no bass traps needed.'],
    ],
    tryit: [
      'Clap once in your room. A zingy, metallic tail means bare parallel walls: that is a job for panels or a bookshelf, not bass traps.',
      'Play a slow sine sweep from 40 to 120 Hz on your speakers at a moderate level. Write down any note that jumps out or hangs on.',
      'Work out a quarter of that note’s wavelength (343 ÷ frequency ÷ 4). If it is more than a metre, you need a corner trap or a tuned trap.',
    ],
    slip: ['Covering every wall with thin foam to “treat the room”.', 'Treat bass first with depth, then use a few thick panels where reflections actually land. Leave some surface hard.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-carbon', {
    title: 'the bass trap that could not get any deeper',
    plain: 'Activated carbon is charcoal full of microscopic pores. Air inside a box filled with it squashes more easily, so a tuned bass trap behaves as if its box were bigger and reaches a lower note.',
    where: 'A narrow edit suite with only 150 mm to spare behind the sofa',
    story: `<p>Meera built a slotted bass trap 150 mm deep. It was tuned to 70 Hz, but her room’s worst ring was at 55 Hz. A deeper box would have pushed the sofa into the doorway.</p>
      <p>She filled part of the cavity with dry activated-carbon granules in breathable cloth bags and measured again. In her box the peak moved down to about 55 Hz and became broader. She sealed the box well and wrote the date on it, because damp carbon slowly loses the effect.</p>`,
    numbers: [['Box depth available', '150 mm'], ['Tuning with plain air', '70 Hz'], ['Carbon makes the air act like (her measurement)', 'about 1.6 × the volume'], ['New tuning', '70 ÷ √1.6 ≈ 55 Hz']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Section through a tuned bass trap box before and after filling it with activated carbon">
      <rect x="150" y="70" width="200" height="130" fill="var(--panel)" stroke="var(--text)" stroke-width="4"/>
      <rect x="146" y="118" width="8" height="34" fill="var(--panel2)"/>
      <path d="M40 135 H140" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      ${T(86, 118, 'bass in', { z: 12 })}
      <path d="M150 222 H350" stroke="var(--muted)" stroke-width="1.5"/><path d="M150 216 v12 M350 216 v12" stroke="var(--muted)" stroke-width="1.5"/>
      ${T(250, 242, '150 mm deep', { z: 12 })}
      <g data-step="=1">${T(250, 140, 'plain air inside', {})}</g>
      <g data-step="1-2"><rect x="160" y="80" width="180" height="110" fill="var(--accent2)" opacity=".15" class="rl-pulse"/></g>
      <g data-step="=2">${T(250, 130, 'tuned to 70 Hz', {})}${T(250, 150, 'the room rings at 55 Hz', { c: 'bad' })}</g>
      <g data-step="3">${Array.from({ length: 60 }, (_, i) => `<circle cx="${170 + (i % 12) * 15}" cy="${92 + Math.floor(i / 12) * 22 + (i % 2) * 5}" r="5" fill="var(--text)" opacity=".75"/>`).join('')}</g>
      <g data-step="=3">${T(250, 56, 'dry carbon granules in cloth bags', {})}</g>
      <g data-step="4">${Array.from({ length: 10 }, (_, i) => `<circle cx="${178 + i * 17}" cy="${104 + (i % 3) * 30}" r="2.6" fill="var(--accent2)" class="rl-bob ${['', 'd2', 'd3'][i % 3]}"/>`).join('')}
        <rect x="150" y="34" width="266" height="182" fill="none" stroke="var(--c4)" stroke-width="2" stroke-dasharray="7 6" class="rl-pulse"/></g>
      <g data-step="=4">${T(283, 26, 'acts like a bigger box', { c: 'c4' })}</g>
      <g data-step="5"><path d="M440 200 H620 M440 200 V60" stroke="var(--muted)" stroke-width="1.5" fill="none"/>
        <path d="M450 195 Q545 190 560 90 Q575 190 615 196" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>
        <path d="M450 192 Q500 180 525 105 Q555 180 615 194" fill="none" stroke="var(--c4)" stroke-width="3"/>
        ${T(560, 80, '70', { z: 12 })}${T(520, 96, '55 Hz', { z: 12, c: 'c4', w: 1 })}${T(530, 222, 'what the trap absorbs', { z: 12 })}</g>
    </svg>`,
    steps: [
      ['A tuned trap is a spring', 'The air in the box is a spring. The air plug in the slot is a weight bouncing on it. Together they soak up one bass note.'],
      ['The box is too small', 'With 150 mm of depth the spring is stiff, so the trap is tuned to 70 Hz. The problem note is lower.'],
      ['Add activated carbon', 'Dry granules in breathable bags go into the cavity, leaving the slot and a little air space clear.'],
      ['The air spring softens', 'Air molecules cling to and leave the pore surfaces as pressure rises and falls, so the air squashes more easily: a softer spring.'],
      ['Lower and wider', 'A softer spring means a lower note. The pores also add friction, so the absorption peak gets broader. Measure to confirm.'],
    ],
    why: [
      'One gram of activated carbon has hundreds of square metres of pore surface. That surface holds and releases air a little, like a sponge breathing.',
      'Tuning falls with the square root of the effective volume, so a big change in volume gives a modest change in pitch. Carbon is a fine-tuning aid, not magic.',
      'Water vapour fills the same pores. A damp box loses much of the gain, which is why the cavity must be sealed and kept dry.',
    ],
    uses: [
      ['🛋️', 'Shallow rear-wall trap', 'When only 150–200 mm is free, carbon can pull a tuned trap down by several hertz without making it deeper.'],
      ['🔊', 'Small subwoofer box', 'The same effect lets a sealed box behave like a larger one; makers of small speakers use it for that reason.'],
      ['🧪', 'A test before you commit', 'Build one trap, measure it with and without the bags, and only then decide whether to fill the other five.'],
    ],
    tryit: [
      'Take the tuning of a trap you own (or plan) and divide it by √1.5 and by √2. That is the realistic range carbon might give you.',
      'Blow across the neck of an empty bottle and note the pitch. Half-fill it with water: a smaller air space gives a higher note. Carbon works the opposite way.',
      'Write down how you would keep a carbon-filled box dry in your climate (sealed joints, cloth bags, a sachet of drying agent).',
    ],
    slip: ['Pouring barbecue charcoal into a trap and expecting a miracle.', 'Use true activated carbon, keep it dry, and judge it only by a before-and-after measurement.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-redirect', {
    title: 'the side wall that was tilted ten degrees',
    plain: 'A hard panel works on sound like a mirror works on light. Tilt the mirror and the reflection goes somewhere else. So you can send a troublesome reflection away from your ears without soaking it up.',
    where: 'A small control room that already felt too dead',
    story: `<p>Imran’s room had so much absorption that it was tiring to work in, yet the stereo image was still blurred by one strong reflection from each side wall. He did not want to add yet another absorber.</p>
      <p>He built two hard plywood panels, 1.2 m wide, and fixed them to the side walls with the front edge 210 mm out, a tilt of 10 degrees. The reflection now passes behind his head and ends in the deep absorber on the rear wall. The room kept its life and the image snapped into focus.</p>`,
    numbers: [['Panel tilt', '10°'], ['Reflection turns by', '2 × 10° = 20°'], ['Sideways shift 2 m further on', '2 × tan 20° ≈ 0.73 m'], ['1.2 m panel steers sound above about', '343 ÷ 1.2 ≈ 290 Hz']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Plan view of a speaker, a side wall and a listener, showing a tilted panel sending the reflection behind the listener">
      <line x1="40" y1="40" x2="600" y2="40" stroke="var(--text)" stroke-width="4"/>
      <rect x="584" y="60" width="16" height="180" fill="var(--c4)" opacity=".8"/>
      ${T(560, 255, 'rear absorber', { z: 12 })}
      <rect x="70" y="150" width="22" height="28" fill="var(--text)"/>${T(81, 198, 'speaker', { z: 12 })}
      ${head(360, 200)}${T(360, 232, 'you', { z: 12 })}
      <path d="M92 168 L345 198" stroke="var(--accent)" stroke-width="2.5" fill="none" class="rl-flow"/>
      <g data-step="1-2"><path d="M92 160 L210 42 L350 190" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${T(250, 120, 'bounce lands on your ear', { c: 'bad' })}</g>
      <g data-step="=2"><path d="M210 42 V110" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 4"/>
        ${T(176, 84, 'in', { z: 12 })}${T(246, 84, 'out', { z: 12 })}${T(330, 120, 'same angle in and out', {})}</g>
      <g data-step="3"><path d="M150 42 L270 74" stroke="var(--c3)" stroke-width="7" stroke-linecap="round"/>
        <path d="M92 160 L196 55 L560 128" stroke="var(--good)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=3">${T(300, 62, 'panel tilted 10°', { c: 'c3', a: 'start' })}${T(420, 150, 'reflection turns 20°', { c: 'good' })}</g>
      <g data-step="4"><circle cx="578" cy="132" r="14" fill="none" stroke="var(--c4)" stroke-width="2.5" class="rl-grow"/></g>
      <g data-step="=4">${T(480, 176, 'passes behind you', { c: 'good' })}${T(480, 196, 'and dies in the absorber', { z: 12 })}</g>
      <g data-step="=5"><path d="M92 150 Q170 20 300 60 Q380 90 350 185" stroke="var(--warn)" stroke-width="2" fill="none" stroke-dasharray="3 5" class="rl-pulse"/>
        ${T(480, 176, 'bass is too long to steer:', { c: 'warn' })}${T(480, 196, 'it wraps round the panel', { z: 12 })}</g>
    </svg>`,
    steps: [
      ['The problem reflection', 'Sound leaves the speaker, hits the flat side wall and arrives at your ear a few milliseconds after the direct sound.'],
      ['The mirror rule', 'A hard surface sends sound off at the same angle it came in, measured from a line square to the surface.'],
      ['Tilt the surface', 'Tilting the panel by 10 degrees swings the reflection by twice that: 20 degrees.'],
      ['Aim it somewhere harmless', 'The reflection now passes behind the listening seat and ends in a deep absorber or a diffuser.'],
      ['Know the limit', 'A panel only steers waves shorter than itself. Below about 290 Hz a 1.2 m panel is ignored; bass needs traps.'],
    ],
    why: [
      'No energy is removed, so the room keeps its liveliness. You only choose where the sound goes.',
      'Turning the surface changes both the incoming and outgoing angles, which is why the beam swings by double the tilt.',
      'Long waves bend around small objects, like sea swell passing a post. A redirector must be big compared with the wavelength it is meant to steer.',
    ],
    uses: [
      ['🎛️', 'Control room side walls', 'Splay or tilt hard panels 6–12° so first reflections miss a listening area about a metre wide.'],
      ['🪟', 'Studio window', 'Lean the control-room glass forward a few degrees so speaker sound goes down into the desk area’s absorber, not back at the mix seat.'],
      ['🎻', 'Live room', 'Angle one wall of a pair by 5° or more to kill flutter echo while keeping the room bright for strings.'],
    ],
    tryit: [
      'Hold a small mirror flat against a side wall and have a friend slide it until you see a speaker from your seat. That is where the reflection hits.',
      'Tilt the mirror about 10 degrees and notice how far the view swings. Sound does the same.',
      'Measure your widest free panel space and divide 343 by it (in metres). That is the lowest frequency a redirector there can steer.',
    ],
    slip: ['Tilting a panel and assuming the reflection has gone.', 'Trace where it goes next. If it ends on another hard wall facing you, you have only delayed the problem.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-hangers', {
    title: 'the false wall with boards hanging behind it',
    plain: 'A hanging bass trap is a deep closet behind a fabric wall, filled with heavy boards hung on wires and wrapped in wool. Bass walks in, gets pushed around between the boards, and little of it comes back out.',
    where: 'A 5.5 m long control room in a converted warehouse',
    story: `<p>Farah’s room had a long, slow rumble under every mix. The lowest length mode sat at 31 Hz and everything below 100 Hz took too long to die away. Thin panels on the rear wall had made no difference.</p>
      <p>The room was long enough to give up 0.9 m at the back. Her builder framed a fabric wall, put a 100 mm absorber layer behind the fabric, and hung two rows of wool-wrapped boards in the space, angled and not touching each other. Measured decay below 100 Hz dropped to roughly half.</p>`,
    numbers: [['Lowest length mode', '343 ÷ (2 × 5.5) ≈ 31 Hz'], ['Cavity depth given up', '0.9 m (0.6 m is the least worth building)'], ['Boards', 'two rows, about 150 mm apart'], ['Bass decay below 100 Hz', 'roughly halved (measured)']],
    svg: `<svg viewBox="0 0 640 284" aria-label="Plan view of a rear-wall cavity with hanging boards absorbing bass">
      <rect x="590" y="30" width="14" height="210" fill="var(--text)"/><line x1="40" y1="30" x2="604" y2="30" stroke="var(--text)" stroke-width="3"/><line x1="40" y1="240" x2="604" y2="240" stroke="var(--text)" stroke-width="3"/>
      ${head(120, 135)}${T(120, 166, 'mix seat', { z: 12 })}
      <path d="M360 34 V236" stroke="var(--c5)" stroke-width="3" stroke-dasharray="3 5"/>${T(354, 258, 'fabric', { z: 12, a: 'end' })}
      <path d="M150 105 H350 M150 135 H350 M150 165 H350" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      <g data-step="1-1"><rect x="364" y="34" width="224" height="202" fill="var(--bad)" opacity=".2" class="rl-pulse"/></g>
      <g data-step="=1">${T(474, 130, 'bass piles up at the wall', { c: 'bad' })}</g>
      <g data-step="2"><rect x="364" y="34" width="26" height="202" fill="var(--c2)" opacity=".55"/></g>
      <g data-step="=2">${T(480, 130, '100 mm absorber layer', { c: 'c2' })}${T(480, 150, 'bass passes straight through', { z: 12 })}</g>
      <g data-step="3">${[0, 1, 2, 3, 4].map((i) => `<g class="rl-shake ${['', 'd2', 'd3', '', 'd2'][i]}"><rect x="${410 + (i % 2) * 14}" y="${44 + i * 40}" width="62" height="12" rx="3" fill="var(--c1)" transform="rotate(${i % 2 ? 24 : -24} ${441 + (i % 2) * 14} ${50 + i * 40})"/></g>`).join('')}
        ${[0, 1, 2, 3].map((i) => `<g class="rl-shake ${['d3', '', 'd2', 'd3'][i]}"><rect x="${500 + (i % 2) * 12}" y="${62 + i * 44}" width="62" height="12" rx="3" fill="var(--c1)" transform="rotate(${i % 2 ? -24 : 24} ${531 + (i % 2) * 12} ${68 + i * 44})"/></g>`).join('')}</g>
      <g data-step="=3">${T(210, 70, 'wool-wrapped boards', { c: 'c1' })}${T(210, 90, 'hung free, not touching', { z: 12 })}</g>
      <g data-step="4"><path d="M350 120 H190 M350 150 H190" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow rev slow"/></g>
      <g data-step="=4">${T(230, 205, 'only a weak echo returns', { c: 'good' })}</g>
      <g data-step="=5"><path d="M364 254 H588" stroke="var(--muted)" stroke-width="1.5"/><path d="M364 248 v12 M588 248 v12" stroke="var(--muted)" stroke-width="1.5"/>
        ${T(230, 205, 'depth decides how low it works', {})}${T(476, 274, '0.9 m', { z: 12, w: 1 })}</g>
    </svg>`,
    steps: [
      ['Bass gathers at the rear wall', 'Room modes put their highest pressure at the walls. That is why the rumble is worst at the back.'],
      ['Let it in', 'A fabric wall with a 100 mm absorber layer tames mids and highs and lets the long bass waves pass into the cavity.'],
      ['Make it work hard', 'Heavy boards wrapped in wool hang freely. The moving air must squeeze around them and through the wool, and the boards swing a little.'],
      ['Little comes back', 'Each squeeze turns sound into a trace of heat. What returns to the room is much weaker.'],
      ['Depth sets the reach', 'These traps are not tuned. A deeper cavity reaches lower; under about 0.6 m a plain thick absorber does as well.'],
    ],
    why: [
      'Friction needs moving air. Away from the wall, inside a deep cavity, the air in a bass wave is moving, so wool placed there can grab it.',
      'The boards force the air along longer, twisting paths and add mass that the wave has to shove around.',
      'Because nothing is tuned to one note, a hanger wall works across a wide band and is forgiving of building errors.',
    ],
    uses: [
      ['🎛️', 'Rear wall of a control room', 'Give up 0.6–1.2 m across the full width where the seat would otherwise sit too close to the back wall anyway.'],
      ['📐', 'Behind an angled front wall', 'The dead triangles beside flush-mounted speakers are free depth: fill them with hangers.'],
      ['🏗️', 'Above a dropped ceiling', 'A 0.6 m void over a fabric ceiling can hold hangers if every board is on rated fixings with a safety wire.'],
    ],
    tryit: [
      'Measure your room length and work out 343 ÷ (2 × length). That is the lowest length mode a rear trap has to fight.',
      'Mark 0.6 m and 0.9 m from your rear wall with tape. Sit at the new “wall” and decide honestly whether the room can spare it.',
      'Sketch a plan of the cavity with boards at alternating angles so no straight path runs from the fabric to the wall.',
    ],
    slip: ['Hanging a few boards in a 300 mm gap and calling it a hanger trap.', 'With little depth, fill the space with thick absorber instead. Hangers pay off only from about 0.6 m deep, and every board needs a secure fixing.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-waveguides', {
    title: 'two monitors that measured the same but sounded different',
    plain: 'A waveguide is a shaped flare around a tweeter. It stops treble spraying sideways, so the sound that bounces off your walls has the same tone as the sound that reaches you directly.',
    where: 'A living-room studio with a bare wall 1 m to the left',
    story: `<p>Arjun compared two pairs of monitors. Both were flat when measured straight in front. In his room one pair sounded sharp and the phantom centre wandered; the other was calm and clear.</p>
      <p>The sharp pair had a bare dome tweeter that threw 2–4 kHz almost sideways, straight onto the side wall. The calm pair had a 200 mm waveguide that kept the tweeter to about 90 degrees, matching the woofer where they cross over. The wall reflection became a quieter copy of the direct sound instead of a bright splash.</p>`,
    numbers: [['Waveguide mouth', '200 mm'], ['Coverage', '90°'], ['Holds that pattern down to about', '25 400 000 ÷ (90 × 200) ≈ 1400 Hz'], ['165 mm woofer starts to narrow near', '343 ÷ 0.165 ≈ 2100 Hz'], ['Crossover', '1800 Hz: inside both ranges']],
    svg: `<svg viewBox="0 0 640 296" aria-label="Plan view of a monitor near a side wall with and without a tweeter waveguide">
      <line x1="40" y1="34" x2="600" y2="34" stroke="var(--text)" stroke-width="4"/>${T(520, 26, 'bare side wall', { z: 12 })}
      <rect x="70" y="150" width="34" height="44" fill="var(--text)"/>${T(87, 214, 'monitor', { z: 12 })}
      ${head(520, 172)}${T(520, 204, 'you', { z: 12 })}
      <path d="M104 172 H505" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      <g data-step="=1">${T(310, 160, 'direct sound: flat and clear', {})}</g>
      <g data-step="=2"><path d="M104 172 L190 40 A160 160 0 0 1 250 250 Z" fill="var(--bad)" opacity=".22"/>
        <path d="M104 166 L250 36 L505 160" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/>
        ${T(380, 80, 'bare dome sprays treble', { c: 'bad' })}${T(380, 100, 'wide onto the wall', { z: 12 })}</g>
      <g data-step="3"><path d="M104 160 L126 146 V198 L104 184 Z" fill="var(--c3)"/>
        <path d="M126 172 L240 58 A160 160 0 0 1 240 286 Z" fill="var(--good)" opacity=".2"/></g>
      <g data-step="=3">${T(360, 80, 'waveguide: treble kept to 90°', { c: 'good' })}</g>
      <g data-step="4"><path d="M126 172 L236 62" stroke="var(--c1)" stroke-width="2" stroke-dasharray="5 4"/><path d="M126 172 L236 282" stroke="var(--c1)" stroke-width="2" stroke-dasharray="5 4"/></g>
      <g data-step="=4">${T(390, 80, 'woofer is also about 90° here', { c: 'c1' })}${T(390, 100, 'so the two match at 1800 Hz', { z: 12 })}</g>
      <g data-step="5"><path d="M126 164 L300 36 L505 162" stroke="var(--good)" stroke-width="1.6" fill="none" class="rl-flow slow"/></g>
      <g data-step="=5">${T(460, 240, 'wall bounce: quieter,', { c: 'good' })}${T(460, 260, 'same tone as the direct sound', { z: 12 })}</g>
    </svg>`,
    steps: [
      ['Direct sound is only half the story', 'On-axis both monitors are flat. But you also hear everything they throw at the walls.'],
      ['A bare tweeter sprays sideways', 'Near the crossover a small dome radiates almost in a half-sphere, while the woofer has already narrowed. The wall gets extra treble.'],
      ['The flare narrows the tweeter', 'A 200 mm waveguide holds the tweeter to about 90 degrees down to roughly 1400 Hz.'],
      ['Woofer and tweeter now match', 'At the 1800 Hz crossover both drivers cover a similar angle, so the off-axis sound has no sudden bright band.'],
      ['Reflections stop colouring the sound', 'What bounces off the wall is weaker and has the same balance as the direct sound, so the image stays put.'],
    ],
    why: [
      'A driver beams when the wavelength gets shorter than its own width. Woofer and tweeter are different sizes, so without help they beam at different frequencies.',
      'A flare acts like a megaphone: its mouth size and angle set how low it can keep control. Bigger mouth, lower control.',
      'Your brain blends reflections arriving within a few milliseconds into the tone of the source. If they are tonally wrong, the whole speaker sounds wrong.',
    ],
    uses: [
      ['🛒', 'Choosing monitors for an untreated room', 'Prefer a smooth, gradually narrowing off-axis response over a slightly flatter on-axis line.'],
      ['📍', 'Placing speakers', 'With controlled 90° coverage you can toe the speakers in so the side walls sit outside the main beam.'],
      ['🧱', 'Deciding how much side treatment', 'Wide-spraying speakers need thick panels at the mirror points; controlled ones may need only one each side.'],
    ],
    tryit: [
      'Play pink noise through one speaker at a low level. Walk slowly from straight ahead to 60° off to the side and listen for the tone changing.',
      'Measure the width of your tweeter’s flare in millimetres and work out 25 400 000 ÷ (90 × width). Compare the result with your crossover frequency.',
      'Hold a thick cushion against the side wall at the mirror point and listen for the centre image tightening.',
    ],
    slip: ['Judging a monitor only by its straight-ahead frequency response.', 'Look at how it behaves 30° and 60° off to the side too. In a small room that sound reaches you a few milliseconds later.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-diffuser-depth', {
    title: 'the diffuser that sat too close to the sofa',
    plain: 'A stepped diffuser is a row of slots of different depths. Sound that falls into deeper slots comes back a little later, so the reflection is broken up and spread sideways instead of bouncing straight back. Three sizes decide what it does: slot width, slot depth and how far away you sit.',
    where: 'A project studio with the client sofa against the rear wall',
    story: `<p>Nikhil built a seven-slot wooden diffuser for the wall behind the sofa: slots 50 mm wide, the deepest 150 mm. It looked superb. But people on the sofa said voices sounded “phasey”, as if coming through a comb.</p>
      <p>The diffuser was fine; the seat was wrong. Heads were only 0.4 m from it, so each ear heard single slots rather than the blended result. He moved the diffuser up the wall to the zone above head height facing the mix seat 2.2 m away, and put a soft panel behind the sofa.</p>`,
    numbers: [['Slot width 50 mm → works up to', '343 ÷ (2 × 0.05) ≈ 3400 Hz'], ['Deepest slot 150 mm → design wavelength', '0.15 × 14 ÷ 4 ≈ 0.53 m'], ['So it starts working near', '343 ÷ 0.53 ≈ 650 Hz'], ['Sit at least 3 wavelengths away', '3 × 0.53 ≈ 1.6 m']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Section through a seven-slot diffuser showing sound returning at different times and spreading out">
      <rect x="150" y="20" width="350" height="16" fill="var(--text)"/>${T(560, 34, 'wall', { z: 12 })}
      ${[0, 1, 4, 2, 2, 4, 1].map((s, i) => `<rect x="${150 + i * 50}" y="36" width="50" height="${96 - s * 24}" fill="var(--c1)" opacity=".85"/><line x1="${150 + i * 50}" y1="36" x2="${150 + i * 50}" y2="134" stroke="var(--text)" stroke-width="3"/>`).join('')}
      <line x1="500" y1="36" x2="500" y2="134" stroke="var(--text)" stroke-width="3"/>
      ${T(86, 90, 'deeper slot,', { z: 12 })}${T(86, 106, 'later return', { z: 12 })}
      <g data-step="1-2">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${175 + i * 50} 250 V140" stroke="var(--accent)" stroke-width="2.5" fill="none" class="rl-flow"/>`).join('')}</g>
      <g data-step="=1">${T(570, 200, 'sound arrives', { z: 12 })}${T(570, 216, 'as one flat wave', { z: 12 })}</g>
      <g data-step="=2">${[0, 1, 4, 2, 2, 4, 1].map((s, i) => `<circle cx="${175 + i * 50}" cy="${139 - s * 24}" r="5" fill="var(--accent2)" class="rl-pulse ${['', 'd2', 'd4', 'd3', 'd3', 'd4', 'd2'][i]}"/>`).join('')}
        ${T(570, 200, 'each slot sends it', { z: 12 })}${T(570, 216, 'back at its own time', { z: 12 })}</g>
      <g data-step="3">${[-70, -45, -20, 0, 20, 45, 70].map((a, i) => `<path d="M325 140 L${325 + Math.round(120 * Math.sin(a * Math.PI / 180))} ${140 + Math.round(120 * Math.cos(a * Math.PI / 180))}" stroke="var(--good)" stroke-width="2" fill="none" class="rl-flow ${i % 2 ? 'slow' : ''}"/>`).join('')}</g>
      <g data-step="=3">${T(560, 200, 'the returns add up', { z: 12 })}${T(560, 216, 'into a wide fan', { z: 12, c: 'good' })}</g>
      <g data-step="=4">${head(250, 168, 'bad')}${T(120, 172, 'too close: you hear', { z: 12, c: 'bad' })}${T(120, 188, 'single slots', { z: 12 })}</g>
      <g data-step="5">${head(325, 262, 'c2')}<path d="M520 140 V262" stroke="var(--muted)" stroke-width="1.5"/><path d="M514 140 h12 M514 262 h12" stroke="var(--muted)" stroke-width="1.5"/></g>
      <g data-step="=5">${T(576, 200, '1.6 m or more:', { z: 12 })}${T(576, 216, 'smooth and even', { z: 12, c: 'good' })}</g>
    </svg>`,
    steps: [
      ['A flat wave arrives', 'Sound from the speakers reaches the diffuser as one front, like a wave rolling onto a beach.'],
      ['Slots delay it by different amounts', 'Sound has to travel down each slot and back. Deep slots return it later than shallow ones.'],
      ['The pieces spread out', 'Those tiny time differences make the returning sound fan out sideways instead of going straight back.'],
      ['Too close and it falls apart', 'Within a metre you hear the separate slots, not the blend. Voices pick up a hollow, combed colour.'],
      ['Give it distance', 'About three wavelengths of its lowest working note (1.6 m here) lets the fan form before it reaches your ears.'],
    ],
    why: [
      'Slot width sets the top note: once the wavelength is shorter than twice the slot width, sound no longer treats each slot as one unit.',
      'Slot depth sets the bottom note: a wave much longer than the slots are deep cannot “feel” the difference between them and sees a flat wall.',
      'The pattern of depths comes from a number sequence chosen so that the spread is even in all directions rather than lumpy.',
    ],
    uses: [
      ['🎛️', 'Rear wall of a longer control room', 'Use a diffuser when the mix seat is 2 m or more from the back wall; closer than that, absorb instead.'],
      ['🎻', 'Live room walls and ceiling', 'Deep diffusers above head height give strings and drums a wide, even bloom without flutter.'],
      ['🏫', 'Rehearsal and teaching rooms', 'A few diffusing panels on one wall cure flutter while keeping the room loud enough to play in.'],
    ],
    tryit: [
      'Measure from your rear wall to the back of your head when seated. Under 1.5 m? Plan an absorber there, not a diffuser.',
      'For any diffuser you are considering, work out 343 ÷ (2 × slot width in metres). That is where it stops working at the top.',
      'Stand close to a full bookshelf and talk, then stand 2 m away and talk. Notice how the “roughness” smooths out with distance.',
    ],
    slip: ['Buying a shallow decorative “diffuser” and expecting it to work on the whole spectrum.', 'Check its depth: 50 mm deep units only scatter treble above roughly 2 kHz. Lower needs real depth.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-special-absorbers', {
    title: 'the hall that only sounded good when it was full',
    plain: 'People are absorbers. A seated audience soaks up more sound than almost anything else in a hall, so an empty hall rings far longer than a full one. Padded seats fix that by absorbing nearly as much empty as a person does sitting in them.',
    where: 'A 300-seat community hall with wooden chairs',
    story: `<p>The choir director, Mrs D’Souza, dreaded rehearsals. In the empty hall every chord smeared into the next and the singers could not hear their own parts. On concert night, with every seat taken, the same hall sounded clear and warm.</p>
      <p>Nothing was wrong with the choir. The audience was the missing acoustic treatment. When the hall replaced the wooden chairs with well-upholstered ones, the empty room dropped from about 2.1 seconds of reverberation to about 1.4, and rehearsals began to sound much like the concert.</p>`,
    numbers: [['Hall volume', '2400 m³'], ['Empty, hard chairs', '0.161 × 2400 ÷ 180 ≈ 2.1 s'], ['Full: 300 people × 0.45 m² each', '0.161 × 2400 ÷ 315 ≈ 1.2 s'], ['Empty, padded seats (+0.3 m² each)', '0.161 × 2400 ÷ 270 ≈ 1.4 s']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Section of a hall showing how the audience and padded seats shorten the reverberation">
      <path d="M40 40 H600 V220 H40 Z" fill="var(--panel)" stroke="var(--text)" stroke-width="3"/>
      <rect x="40" y="186" width="110" height="34" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>${T(95, 208, 'stage', { z: 12 })}
      <circle cx="95" cy="160" r="9" fill="var(--c1)"/><rect x="88" y="169" width="14" height="17" fill="var(--c1)"/>
      ${Array.from({ length: 11 }, (_, i) => `<path d="M${190 + i * 36} 220 v-20 h18" fill="none" stroke="var(--text)" stroke-width="3"/>`).join('')}
      <g data-step="1-1"><path d="M105 158 L300 44 L470 216 L596 120 L420 44" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="2-3">${Array.from({ length: 11 }, (_, i) => `<circle cx="${204 + i * 36}" cy="186" r="8" fill="var(--c2)"/><rect x="${197 + i * 36}" y="194" width="14" height="14" fill="var(--c2)"/>`).join('')}
        <path d="M105 158 L300 44 L400 184" fill="none" stroke="var(--good)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="4">${Array.from({ length: 11 }, (_, i) => `<path d="M${188 + i * 36} 221 v-24 h22 v8 h-14 v16 z" fill="var(--c4)" class="rl-pulse ${['', 'd2', 'd3'][i % 3]}"/>`).join('')}</g>
      <g data-step="4-5"><path d="M105 158 L300 44 L400 196" fill="none" stroke="var(--good)" stroke-width="2" class="rl-flow"/></g>
      <rect x="60" y="246" width="520" height="14" rx="7" fill="var(--panel2)"/>
      <g data-step="=1"><rect x="60" y="246" width="455" height="14" rx="7" fill="var(--bad)"/>${T(250, 130, 'empty, hard chairs: 2.1 s', { c: 'bad', w: 1 })}</g>
      <g data-step="=2"><rect x="60" y="246" width="360" height="14" rx="7" fill="var(--warn)"/>${T(480, 110, 'each person adds 0.45 m²', {})}</g>
      <g data-step="=3"><rect x="60" y="246" width="260" height="14" rx="7" fill="var(--good)"/>${T(480, 110, 'full house: 1.2 s', { c: 'good', w: 1 })}</g>
      <g data-step="=4"><rect x="60" y="246" width="303" height="14" rx="7" fill="var(--good)"/>${T(480, 110, 'padded seats, empty: 1.4 s', { c: 'good', w: 1 })}</g>
      <g data-step="=5"><rect x="60" y="246" width="275" height="14" rx="7" fill="var(--good)"/>${T(476, 110, 'rehearsal sounds like the concert', {})}</g>
      ${T(60, 274, 'reverberation time', { z: 12, a: 'start' })}
    </svg>`,
    steps: [
      ['The empty hall', 'Hard chairs, hard floor, hard walls. Each sound bounces dozens of times before it fades: about 2.1 seconds.'],
      ['The audience arrives', 'Clothing and bodies are soft and deep. Each seated person adds roughly 0.45 m² of absorption.'],
      ['A full house', 'Three hundred people nearly double the hall’s absorption, and the reverberation falls to about 1.2 seconds.'],
      ['Padded seats instead', 'A well-upholstered seat absorbs about 0.3 m² even when empty, so the empty hall is already close to its “full” sound.'],
      ['Rehearsal matches the concert', 'With padded seats, the hall changes little between empty and full. Performers can trust what they hear.'],
    ],
    why: [
      'Reverberation time is volume divided by total absorption. Add absorption and the time falls in direct proportion.',
      'A person sitting in a padded seat covers it, so the seat and the person do not add up: you mostly swap one absorber for another. That is exactly what makes the hall consistent.',
      'An audience is spread over the whole floor, right where most reflections from the ceiling land, so it is very effective for its area.',
    ],
    uses: [
      ['⛪', 'Worship space', 'If speech is muddy only on quiet weekdays, cushioned pews or seat pads are often the cheapest fix.'],
      ['🎓', 'School assembly hall', 'Stacking plastic chairs make an empty hall harsh; heavy curtains you can draw for rehearsals compensate.'],
      ['🎭', 'Small theatre', 'Sound-check with the house empty, then expect less reverberation and more clarity once the audience is in.'],
    ],
    tryit: [
      'Estimate your hall’s volume (length × width × height) and count the seats. Multiply seats by 0.45 to see how much absorption a full house adds.',
      'Clap in an empty room, then again with five friends sitting in it. Listen for the shorter tail.',
      'Look at the seats in a hall you know. Bare wood or plastic means a big gap between empty and full; thick padding means a small one.',
    ],
    slip: ['Tuning a hall’s sound system or treatment while it is empty and assuming it will sound the same on the night.', 'Allow for the audience: either measure with people in, or work it out from the seat count.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-flowres', {
    title: 'the corner trap packed with the wrong wool',
    plain: 'Flow resistivity is how hard it is to blow air through a material. A thin panel needs fairly dense wool so the sound is slowed enough. A deep trap needs light, fluffy wool so bass can get all the way in instead of bouncing off the front.',
    where: 'A drum room in a garage',
    story: `<p>Kabir built floor-to-ceiling corner traps 400 mm deep and packed them tight with heavy, rigid rock-wool slabs, reasoning that denser must be better. The room measured almost the same as before.</p>
      <p>The wool was so resistant that bass met a wall of it and reflected. He swapped the filling for light, fluffy loft insulation and kept the rigid slabs for his 50 mm wall panels, where they belonged. This time the 60–120 Hz decay shortened clearly.</p>`,
    numbers: [['Aim: resistivity × depth', 'about 1–3 kPa·s/m'], ['Dense slab in a 0.4 m trap', '50 × 0.4 = 20 (far too high)'], ['Fluffy wool in the same trap', '5 × 0.4 = 2 (right)'], ['Dense-ish slab in a 50 mm panel', '30 × 0.05 = 1.5 (right)']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Two absorbers compared: dense wool reflects bass at its face, fluffy wool lets it in">
      <rect x="230" y="40" width="150" height="80" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><rect x="380" y="34" width="12" height="92" fill="var(--text)"/>
      <rect x="230" y="160" width="150" height="80" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><rect x="380" y="154" width="12" height="92" fill="var(--text)"/>
      ${T(305, 30, '400 mm deep trap', { z: 12 })}${T(410, 84, 'wall', { z: 12, a: 'start' })}${T(410, 204, 'wall', { z: 12, a: 'start' })}
      <path d="M40 80 H220" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/><path d="M40 200 H220" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      ${T(100, 64, 'bass', { z: 12 })}${T(100, 184, 'bass', { z: 12 })}
      <g data-step="=1">${T(520, 130, 'same box, same depth,', { z: 12 })}${T(520, 146, 'two different fillings', { z: 12 })}</g>
      <g data-step="2">${Array.from({ length: 120 }, (_, i) => `<circle cx="${236 + (i % 20) * 7.3}" cy="${46 + Math.floor(i / 20) * 13.5}" r="2.6" fill="var(--c1)"/>`).join('')}</g>
      <g data-step="=2">${T(520, 70, 'dense, rigid slab', { c: 'c1' })}${T(520, 88, 'packed tight', { z: 12 })}</g>
      <g data-step="3"><path d="M228 92 H60" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=3">${T(520, 70, 'too hard to blow through:', { c: 'bad' })}${T(520, 88, 'bass bounces off the face', { z: 12 })}</g>
      <g data-step="4">${Array.from({ length: 36 }, (_, i) => `<circle cx="${242 + (i % 9) * 16}" cy="${170 + Math.floor(i / 9) * 20 + (i % 2) * 4}" r="2.6" fill="var(--c4)"/>`).join('')}
        <path d="M230 200 H376" stroke="var(--accent)" stroke-width="2" fill="none" class="rl-flow slow"/></g>
      <g data-step="=4">${T(520, 190, 'light, fluffy wool', { c: 'c4' })}${T(520, 208, 'air moves all the way in', { z: 12 })}</g>
      <g data-step="5"><path d="M228 212 H150" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow"/></g>
      <g data-step="=5">${T(520, 190, 'friction all through the depth', { c: 'good' })}${T(520, 208, 'only a little comes back', { z: 12 })}</g>
    </svg>`,
    steps: [
      ['Two traps, one question', 'Both boxes are 400 mm deep. The only difference is what they are filled with.'],
      ['Dense filling', 'The first is packed with heavy, rigid slabs: very hard to push air through.'],
      ['Bass gives up at the surface', 'The wave cannot move air into the slab, so most of it reflects, almost as if the trap were a wall.'],
      ['Fluffy filling', 'The second holds light, open wool. The air in the wave moves through the whole depth.'],
      ['Friction does the work', 'Air rubbing past fibres all the way in turns sound into heat. Little is left to return.'],
    ],
    why: [
      'Absorption comes from air rubbing against fibres. Too few fibres and nothing rubs; too many and the air cannot move at all.',
      'What matters is the total: resistivity multiplied by depth. Thin layers need more resistance per centimetre; thick ones need less.',
      'Density on the label is only a hint. Two wools of the same weight can differ a lot, so use measured flow resistivity when the maker gives it.',
    ],
    uses: [
      ['📐', 'Deep corner and ceiling traps', 'From about 300 mm deep, choose light loft-type wool around 5 kPa·s/m²; it is also the cheapest.'],
      ['🖼️', '50–100 mm wall panels', 'Use semi-rigid slabs around 10–30 kPa·s/m² so the panel holds its shape and has enough resistance.'],
      ['🧮', 'Checking a supplier’s data sheet', 'Multiply the stated resistivity by your depth in metres; aim for a result between about 1 and 3.'],
    ],
    tryit: [
      'Hold a piece of the wool or foam you plan to use against your mouth (through a clean cloth) and breathe. Easy = low resistance, hard = high.',
      'Write down the depth of each absorber you own or plan. Divide 2 by the depth in metres to get a rough target resistivity in kPa·s/m².',
      'Compare that target with the product’s data sheet, or with the rough guide: fluffy loft roll about 5, semi-rigid slab 10–30, heavy board 40 or more.',
    ],
    slip: ['Believing denser, heavier wool always absorbs more.', 'Match the wool to the depth: dense for thin panels, light for deep traps. Wear gloves and a dust mask when handling it.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-speakers', {
    title: 'the hole in the bass that moved with the speakers',
    plain: 'Bass leaves a speaker in all directions, including backwards. It bounces off the wall behind and meets the direct sound again. At one frequency the two cancel and that note almost disappears. Where you stand the speaker decides which note is lost.',
    where: 'A bedroom studio with monitors on stands',
    story: `<p>Leela could never judge bass guitar. Notes around low G vanished on her monitors but boomed on headphones. Equalising the dip made no difference, however much she boosted.</p>
      <p>Her speakers’ fronts were 0.9 m from the wall behind them. Bass going backwards travelled an extra 1.8 m, which is half a wavelength at 95 Hz, so it came back upside down and cancelled. She pushed the speakers back until their fronts were 0.25 m from the wall and hung a 100 mm panel behind each. The dip moved up to about 340 Hz, where the panel absorbs it.</p>`,
    numbers: [['Speaker front to wall', '0.9 m'], ['Cancelled note', '343 ÷ (4 × 0.9) ≈ 95 Hz'], ['Moved to 0.25 m', '343 ÷ (4 × 0.25) ≈ 340 Hz'], ['Flush in the wall', 'no path behind → no dip']],
    svg: `<svg viewBox="0 0 640 290" aria-label="A speaker near a wall: sound reflected from the wall behind cancels the direct sound at one frequency">
      <rect x="40" y="30" width="14" height="150" fill="var(--text)"/>${T(47, 196, 'wall', { z: 12 })}
      ${head(560, 105)}${T(560, 136, 'you', { z: 12 })}
      <path d="M60 222 H600 M60 222 V278" stroke="var(--muted)" stroke-width="1.5" fill="none"/>${T(560, 216, 'bass response', { z: 12 })}
      <g data-step="1-3"><rect x="220" y="84" width="34" height="44" fill="var(--text)"/><path d="M254 100 H540" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${T(390, 84, 'direct sound', {})}<path d="M70 240 H590" stroke="var(--accent)" stroke-width="2.5" fill="none"/></g>
      <g data-step="2-3"><path d="M220 112 H58" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=2">${T(138, 84, 'bass also goes back', { c: 'c3' })}<path d="M70 240 H590" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
        <path d="M54 150 H220" stroke="var(--muted)" stroke-width="1.5"/><path d="M54 144 v12 M220 144 v12" stroke="var(--muted)" stroke-width="1.5"/>${T(138, 168, '0.9 m', { z: 12 })}</g>
      <g data-step="=3"><path d="M58 124 H540" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/>
        ${T(390, 146, 'returns upside down: cancels', { c: 'bad' })}
        <path d="M70 240 H190 Q215 240 225 274 Q235 240 260 240 H590" stroke="var(--bad)" stroke-width="2.5" fill="none"/>${T(225, 216, '95 Hz gone', { z: 12, c: 'bad', w: 1 })}</g>
      <g data-step="=4"><rect x="76" y="84" width="34" height="44" fill="var(--text)"/><rect x="56" y="70" width="14" height="72" fill="var(--c2)"/>
        <path d="M110 100 H540" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
        ${T(330, 84, 'close to the wall + 100 mm panel', { c: 'c2' })}
        <path d="M70 240 H400 Q414 240 420 250 Q426 240 440 240 H590" stroke="var(--good)" stroke-width="2.5" fill="none"/>${T(420, 270, 'small dip near 340 Hz', { z: 12 })}</g>
      <g data-step="=5"><rect x="40" y="84" width="14" height="44" fill="var(--accent)"/><path d="M54 106 H540" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
        <circle cx="54" cy="106" r="20" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-grow"/>
        ${T(330, 84, 'flush in the wall: nothing behind', { c: 'good' })}
        <path d="M70 240 H590" stroke="var(--good)" stroke-width="2.5" fill="none"/></g>
    </svg>`,
    steps: [
      ['Direct sound', 'The speaker fires at you. So far the bass response is even.'],
      ['Bass wraps around the box', 'Low notes spread in every direction, so a good share heads for the wall behind.'],
      ['The return trip cancels', 'After 1.8 m extra travel the 95 Hz wave arrives half a cycle late: exactly opposite. One note drops out.'],
      ['Move close and absorb', 'At 0.25 m the lost note rises to about 340 Hz, where a 100 mm panel behind the speaker can absorb the reflection.'],
      ['Or build it into the wall', 'A flush-mounted speaker has no wall behind it at all. The dip never forms and the bass gains strength.'],
    ],
    why: [
      'Two equal waves that are half a cycle apart add to nothing, like two people pushing a swing at opposite moments.',
      'Equalising cannot fill the hole: boost the note and the reflection is boosted by the same amount and cancels it again.',
      'The dip’s frequency depends only on distance. Short distances push it up to where ordinary absorbers work.',
    ],
    uses: [
      ['🖥️', 'Desk set-up', 'Put small monitors as close to the front wall as their rear ports allow (often 10–20 cm) and treat the wall behind.'],
      ['📏', 'Large floor-standing mains', 'Either go very close or beyond about 2.2 m (dip below 40 Hz); the range 0.5–1.5 m is the worst.'],
      ['🔈', 'Subwoofer', 'Place it right against a wall or in a corner: its dip moves far above the range it plays.'],
    ],
    tryit: [
      'Measure from each speaker’s front face to the wall behind it. Work out 343 ÷ (4 × that distance in metres).',
      'Play a sine tone at that frequency at a moderate level and sit in your normal seat. Then lean forward and back; the note should fade in and out.',
      'Slide the speakers 20 cm closer to the wall and repeat. The weak note will have moved higher.',
    ],
    slip: ['Boosting a deep narrow dip with EQ until the amplifier runs out of power.', 'Find the distance causing it and change the distance. Leave cancellation dips alone in the equaliser.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-stands-desk', {
    title: 'the desk that was acting as a second speaker',
    plain: 'A desk does two unwanted things. Its flat top bounces sound up to your ears a moment after the direct sound, which cancels some notes. And a speaker standing on it shakes it, so the desk hums along. Proper stands and a smaller, lower desk surface fix both.',
    where: 'A producer’s workstation with monitors sitting on the desk',
    story: `<p>Dev’s vocals always sounded hollow around 600 Hz in his room but fine elsewhere. His monitors stood directly on a large glass-topped desk, 1.2 m in front of him.</p>
      <p>The sound bouncing off the desk travelled 0.27 m further than the direct sound and cancelled near 635 Hz. The glass also buzzed in sympathy with the bass. He moved the speakers onto heavy sand-filled stands just behind the desk, raised so the tweeters were at ear height, and replaced the glass with a narrower wooden top. The hollow sound and the buzz both went.</p>`,
    numbers: [['Direct path', '1.20 m'], ['Path via the desk', '√(1.2² + 0.85²) ≈ 1.47 m'], ['Extra distance', '0.27 m'], ['First cancelled note', '343 ÷ (2 × 0.27) ≈ 635 Hz']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Side view of a speaker on a desk showing the desk reflection, and the same speaker on a stand behind the desk">
      ${head(540, 110)}${T(540, 82, 'ears', { z: 12 })}
      <rect x="520" y="126" width="40" height="70" rx="12" fill="var(--c2)" opacity=".6"/>
      <line x1="40" y1="250" x2="600" y2="250" stroke="var(--line)" stroke-width="2"/>
      <g data-step="1-3"><rect x="150" y="166" width="330" height="10" fill="var(--text)"/><path d="M165 176 V250 M465 176 V250" stroke="var(--text)" stroke-width="5"/>
        <rect x="170" y="100" width="46" height="66" fill="var(--text)"/><circle cx="204" cy="118" r="5" fill="var(--accent)"/>
        <path d="M216 118 L524 110" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=1">${T(370, 96, 'direct: 1.20 m', {})}</g>
      <g data-step="2-3"><path d="M216 122 L372 166 L524 114" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=2">${T(316, 204, 'via the desk: 1.47 m', { c: 'bad' })}</g>
      <g data-step="=3">${T(316, 204, '0.27 m late: 635 Hz cancels', { c: 'bad', w: 1 })}
        <g class="rl-shake"><path d="M230 160 H470" stroke="var(--warn)" stroke-width="3"/></g>${T(316, 226, 'and the top shakes with the bass', { z: 12, c: 'warn' })}</g>
      <g data-step="4"><rect x="250" y="176" width="230" height="10" fill="var(--text)"/><path d="M262 186 V250 M468 186 V250" stroke="var(--text)" stroke-width="5"/>
        <rect x="150" y="76" width="46" height="66" fill="var(--text)"/><circle cx="184" cy="96" r="5" fill="var(--accent)"/>
        <rect x="164" y="148" width="18" height="96" fill="var(--c1)"/><rect x="146" y="244" width="54" height="6" fill="var(--c1)"/><rect x="150" y="142" width="46" height="6" fill="var(--c4)"/>
        <path d="M196 98 L524 108" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/></g>
      <g data-step="=4">${T(350, 84, 'tweeter at ear height', {})}${T(110, 200, 'heavy stand', { z: 12, c: 'c1' })}${T(110, 150, 'soft pad', { z: 12, c: 'c4' })}</g>
      <g data-step="=5"><path d="M196 104 L360 176 L470 146" stroke="var(--good)" stroke-width="2" fill="none" class="rl-flow slow"/>
        ${T(330, 270, 'the bounce now passes below your ears', { c: 'good' })}${T(350, 84, 'clean mids, no buzz', {})}</g>
    </svg>`,
    steps: [
      ['Direct sound', 'The tweeter fires straight at your ears across the desk: 1.20 m.'],
      ['The desk bounce', 'Some sound hits the desk top and reflects up to you. That path is 1.47 m.'],
      ['Late copy, missing note', 'Arriving 0.27 m late, the bounce cancels around 635 Hz. The speaker also shakes the desk, which adds a boomy colour.'],
      ['Stands behind a smaller desk', 'Heavy, filled stands with a soft pad carry the speakers. The tweeters sit at ear height and the desk is shorter and lower.'],
      ['The bounce misses you', 'With less desk in the way and a flatter angle, the reflection lands below ear level or not at all.'],
    ],
    why: [
      'A reflection that is delayed by half a wavelength arrives opposite to the direct sound and cancels it. The longer the detour, the lower the note that suffers.',
      'A big thin surface is a sounding board, like a guitar top. Vibration fed into it is re-radiated as extra, blurred bass.',
      'A heavy stand hardly moves, and a soft pad under the speaker stops what little vibration there is from passing on.',
    ],
    uses: [
      ['🎹', 'Keyboard workstation', 'Keep the top as shallow as the keyboard allows and put the speakers on stands behind it, not on the bridge shelf.'],
      ['🎚️', 'Large mixing console', 'Tilt the meter bridge and raise the speakers so the console reflection goes into your chest, not your ears.'],
      ['💻', 'Small laptop desk', 'Cannot use stands? Dense foam wedges that tilt the speakers up and decouple them are the next best thing.'],
    ],
    tryit: [
      'Lay a mirror flat on your desk between you and one speaker. If you can see the tweeter in it from your seat, you have a desk bounce.',
      'Put a folded thick towel over that spot and listen to a vocal you know well. A fuller midrange confirms it.',
      'While music plays, rest your fingertips on the desk top. If you feel it buzzing, the speakers need decoupling.',
    ],
    slip: ['Standing monitors on a hollow shelf or a stack of books at the back of a big desk.', 'Use rigid, heavy stands that hold the tweeter at ear height, and make sure they cannot be knocked over.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-electrical', {
    title: 'the buzz that started whenever the air conditioner ran',
    plain: 'Hum and buzz get into audio gear when noisy machines share its wiring, and when cables form big loops that act like aerials. Give the audio gear its own clean circuit from one point, keep cables bundled close together, and most noise never gets in.',
    where: 'A home studio fed from the same sockets as the kitchen',
    story: `<p>Every time the air conditioner or the fridge switched on, Anita heard a buzz in her monitors and a click on her recordings. Her interface was plugged in by the desk, the monitors into a socket across the room, and the computer into a third.</p>
      <p>A licensed electrician ran one dedicated circuit from the distribution board to a single power strip position at the desk, with its own breaker and proper earth. All the audio gear now plugs in there. She also tied each signal cable alongside its partner instead of looping them around the room. The buzz dropped below what she could hear.</p>`,
    numbers: [['Mains hum and its relatives', '50, 100, 150 Hz…'], ['Old cable loop', 'about 2 m × 3 m = 6 m²'], ['Bundled cables', 'about 0.01 m²'], ['Hum picked up falls by', '6 ÷ 0.01 = 600 × ≈ 56 dB']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Plan of a room showing shared wiring and a large cable loop, then a dedicated circuit with bundled cables">
      <rect x="40" y="30" width="560" height="220" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <rect x="52" y="110" width="30" height="60" fill="var(--text)"/>${T(67, 190, 'board', { z: 12 })}
      <rect x="250" y="44" width="56" height="34" rx="4" fill="var(--c6)"/>${T(278, 66, 'A/C', { z: 12 })}
      <rect x="440" y="190" width="120" height="40" rx="4" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>${T(500, 215, 'desk + gear', { z: 12 })}
      <rect x="500" y="50" width="40" height="30" fill="var(--text)"/>${T(548, 70, 'monitor', { z: 12, a: 'start' })}
      <g data-step="1-2"><path d="M82 126 H278 V78 M278 126 H470 V190 M470 126 H520 V80" fill="none" stroke="var(--warn)" stroke-width="3"/></g>
      <g data-step="=1">${T(180, 116, 'one shared circuit', { c: 'warn' })}</g>
      <g data-step="=2"><path d="M278 80 V126 H470 V186" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-flow"/>
        <circle cx="278" cy="61" r="26" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-grow"/>
        ${T(376, 150, 'motor noise rides in', { c: 'bad' })}</g>
      <g data-step="=3"><path d="M470 190 V126 H520 V80 M540 80 V200 H560" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 4"/>
        <rect x="474" y="84" width="62" height="102" fill="var(--bad)" opacity=".2" class="rl-pulse"/>
        ${T(330, 150, 'big loop = hum aerial', { c: 'bad' })}</g>
      <g data-step="4"><path d="M82 150 H420 V210 H440" fill="none" stroke="var(--good)" stroke-width="4"/>
        <path d="M82 150 H420 V210 H440" fill="none" stroke="var(--panel)" stroke-width="1.5" class="rl-flow"/>
        <path d="M82 126 H278 V78" fill="none" stroke="var(--warn)" stroke-width="3"/></g>
      <g data-step="=4">${T(250, 172, 'dedicated audio circuit', { c: 'good' })}</g>
      <g data-step="5"><path d="M518 190 V80 M524 190 V80" fill="none" stroke="var(--good)" stroke-width="2.5"/></g>
      <g data-step="=5">${T(250, 196, 'power and signal run together:', {})}${T(250, 214, 'no loop, no aerial', { c: 'good' })}</g>
    </svg>`,
    steps: [
      ['Everything shares one circuit', 'The air conditioner, the monitors and the computer all hang off the same run of wire.'],
      ['Motors pollute the supply', 'When a motor starts, it drags the voltage about and sends sharp pulses along the shared wires into the audio gear.'],
      ['Loops catch hum', 'Gear plugged into different sockets and joined by signal cables forms a large loop. Stray magnetic fields induce hum in it.'],
      ['One clean feed', 'A dedicated circuit from the board, installed by an electrician, feeds every piece of audio gear from one point.'],
      ['Close the loops', 'Running each power and signal cable side by side shrinks the loop area hundreds of times, and the hum with it.'],
    ],
    why: [
      'Wire has resistance. Heavy, jerky current from a motor makes the voltage on a shared wire jump, and everything else on that wire sees the jumps.',
      'A loop of wire in a changing magnetic field has a voltage induced in it, in proportion to its area. Small area, small hum.',
      'When all gear takes its earth from one point, there is no voltage difference between chassis to drive current along the cable screens.',
    ],
    uses: [
      ['🏠', 'New home studio', 'Ask the electrician for one audio-only circuit with its own breaker; it is a small cost during any rewiring.'],
      ['🎸', 'Guitar amp buzz', 'Plug amp, pedals and interface into the same strip before blaming the guitar; move away from dimmers and chargers.'],
      ['📹', 'Live stream set-up', 'Feed cameras, computer and mixer from one distribution point so video and audio grounds agree.'],
    ],
    tryit: [
      'List what else is on the circuit that feeds your studio sockets (the breaker label helps). Note any motors, dimmers or kitchen appliances.',
      'With the volume low, listen for hum, then switch nearby lights, fans and chargers off one at a time to find the culprit.',
      'Re-route one long signal cable so it runs beside the power lead of the gear it connects, and listen again.',
    ],
    slip: ['Removing or bypassing a safety earth to cure a hum.', 'Never defeat the earth. Fix the cause: one supply point, short bundled cables, balanced connections; call an electrician for anything inside the wiring.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-lowvolt', {
    title: 'the microphone cable that ran past the dimmer',
    plain: 'A balanced cable carries the signal twice, on two wires, one the mirror image of the other. Interference hits both wires equally. The receiving device subtracts one wire from the other: the signal doubles and the interference cancels.',
    where: 'A small theatre with a 15 m run from the stage to the mixer',
    story: `<p>Joseph was wiring a school theatre. The only route for the microphone cables ran beside the lighting dimmers. A cheap two-conductor (unbalanced) lead he tried first produced a buzz louder than the actor.</p>
      <p>He swapped it for a proper three-pin balanced microphone cable into the mixer’s balanced input. The dimmers were still pushing about 10 mV of noise onto each wire, but the mixer’s input rejected it by 60 dB. The buzz fell from well above the voice to far below it.</p>`,
    numbers: [['Microphone signal', '2 mV'], ['Noise induced on each wire', '10 mV (14 dB above the voice)'], ['Balanced input rejects it by', '60 dB = 1000 ×'], ['Noise left', '10 mV ÷ 1000 = 10 µV'], ['Voice now above the noise by', '20 × log(2000 ÷ 10) ≈ 46 dB']],
    svg: `<svg viewBox="0 0 640 280" aria-label="A balanced cable: the signal travels as two mirror-image copies, noise hits both equally and is cancelled at the input">
      <rect x="40" y="110" width="50" height="60" rx="8" fill="var(--c1)"/>${T(65, 190, 'mic', { z: 12 })}
      <path d="M520 100 L580 140 L520 180 Z" fill="var(--c2)"/>${T(550, 204, 'mixer input', { z: 12 })}${T(538, 145, '−', { z: 18 })}
      <line x1="90" y1="125" x2="520" y2="125" stroke="var(--text)" stroke-width="2"/><line x1="90" y1="155" x2="520" y2="155" stroke="var(--text)" stroke-width="2"/>
      <rect x="270" y="30" width="90" height="34" rx="4" fill="var(--c6)"/>${T(315, 52, 'dimmer', { z: 12 })}
      <g data-step="1"><path d="M100 125 q12 -16 24 0 t24 0 t24 0 t24 0" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-slide" style="--dx:300px"/>
        <path d="M100 155 q12 16 24 0 t24 0 t24 0 t24 0" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-slide" style="--dx:300px"/></g>
      <g data-step="=1">${T(180, 100, 'signal', { z: 12, c: 'accent' })}${T(180, 186, 'mirror image', { z: 12, c: 'accent' })}</g>
      <g data-step="2"><path d="M300 64 V118 M330 64 V118" stroke="var(--bad)" stroke-width="2" fill="none" class="rl-flow"/><path d="M300 132 V148 M330 132 V148" stroke="var(--bad)" stroke-width="2" fill="none" class="rl-flow"/></g>
      <g data-step="=2">${T(440, 60, 'buzz lands on both wires', { c: 'bad' })}</g>
      <g data-step="3"><path d="M380 125 l8 -12 l8 12 l8 -12 l8 12 M380 155 l8 -12 l8 12 l8 -12 l8 12" fill="none" stroke="var(--bad)" stroke-width="2.5" class="rl-pulse"/></g>
      <g data-step="=3">${T(440, 100, 'same size, same direction', { z: 12, c: 'bad' })}</g>
      <g data-step="=4">${T(320, 232, 'top wire minus bottom wire:', {})}${T(320, 252, 'signal × 2, buzz − buzz = 0', { w: 1 })}</g>
      <g data-step="5"><path d="M580 140 h14 q8 -22 16 0 t16 0" fill="none" stroke="var(--good)" stroke-width="3" class="rl-pulse"/></g>
      <g data-step="=5">${T(320, 232, 'out comes a clean, stronger signal', { c: 'good' })}${T(320, 252, 'buzz 10 mV → 10 µV', { z: 12 })}</g>
    </svg>`,
    steps: [
      ['Two copies of the signal', 'The microphone drives two wires. When one swings up, the other swings down by the same amount.'],
      ['Interference arrives', 'The dimmer’s field cuts across the cable. Because the wires are twisted tightly together, both get the same dose.'],
      ['Noise is identical on both', 'The buzz goes up on both wires together. The signal goes up on one and down on the other. That difference is the trick.'],
      ['The input subtracts', 'A balanced input outputs only the difference between the wires. Opposite signals add; equal noise cancels.'],
      ['Clean signal out', 'With 60 dB of rejection the buzz is a thousand times smaller, and the voice is clear.'],
    ],
    why: [
      'Subtracting two things that are equal gives zero. The whole design exists to make the noise equal on both wires.',
      'Twisting the pair makes each wire spend equal time nearest the noise source, so neither picks up more than the other.',
      'The screen around the pair is a shield only; no signal returns through it, so hum currents in the screen do not mix with the audio.',
    ],
    uses: [
      ['🎤', 'Every microphone run', 'Use three-pin balanced cable for mics whatever the length; their signals are tiny and need the protection.'],
      ['🔌', 'Interface to monitors', 'Connect with balanced leads (three-pin or three-contact jack) even over 2 m to stop computer whine reaching the speakers.'],
      ['🎸', 'Long instrument runs', 'A guitar or keyboard more than about 6 m from the mixer should go through a DI box, which converts it to a balanced line.'],
    ],
    tryit: [
      'Look at your cables. Three pins, or a jack with two black rings, means balanced. A jack with one ring is unbalanced.',
      'Check the back of your interface and monitors: are the sockets marked balanced? If both ends are, use balanced leads between them.',
      'With monitors on at low volume and nothing playing, move a phone charger near an unbalanced lead, then near a balanced one, and compare the buzz.',
    ],
    slip: ['Using a guitar lead (one ring) between balanced gear because the plug fits.', 'It fits but throws away the noise rejection. Use a three-contact lead, and keep audio cables away from power bricks and dimmers.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-hvac', {
    title: 'the vocal booth that hissed',
    plain: 'Air makes noise when it is forced through a small opening quickly, like blowing through pursed lips. Move the same amount of air slowly through a big duct with soft lining and a couple of bends, and you get fresh air you cannot hear.',
    where: 'A 2 × 2 m vocal booth in a commercial studio, Chennai',
    story: `<p>Singers kept asking for the air conditioning to be switched off during takes, then stopping after ten minutes because the booth was stifling. The supply came through a 150 mm round duct ending in a small grille right above the microphone.</p>
      <p>The contractor replaced the last run with a 250 mm duct lined inside with 25 mm of absorber, added two bends, hung it on rubber hangers with a flexible connector at the fan unit, and fitted a large grille. Same airflow, a third of the speed. The hiss dropped under the microphone’s own noise and the air stays on during takes.</p>`,
    numbers: [['Air needed', '60 litres per second'], ['150 mm duct', '0.06 ÷ 0.0177 m² ≈ 3.4 m/s (hiss)'], ['250 mm duct', '0.06 ÷ 0.0491 m² ≈ 1.2 m/s (quiet)'], ['Speed cut to', 'about one third']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Air supply to a vocal booth: a small fast duct that hisses, then a large lined duct with bends that is quiet">
      <rect x="40" y="96" width="80" height="70" rx="6" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
      <g class="rl-spin"><path d="M80 111 v40 M60 131 h40" stroke="var(--c2)" stroke-width="5" stroke-linecap="round"/></g>${T(80, 186, 'fan unit', { z: 12 })}
      <rect x="470" y="70" width="140" height="180" fill="var(--panel)" stroke="var(--text)" stroke-width="3"/>${T(540, 240, 'booth', { z: 12 })}
      <circle cx="540" cy="170" r="10" fill="var(--c1)"/><rect x="536" y="180" width="8" height="40" fill="var(--c1)"/>
      <g data-step="1-1"><path d="M120 125 H470 M120 137 H470" stroke="var(--text)" stroke-width="2"/>
        <path d="M124 131 H478" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/>
        <circle cx="480" cy="131" r="14" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-grow"/><circle cx="480" cy="131" r="14" fill="none" stroke="var(--bad)" stroke-width="2" class="rl-grow d2"/>
        ${T(300, 110, '150 mm duct: 3.4 m/s', { c: 'bad' })}${T(300, 160, 'fast air hisses at the grille', { z: 12 })}</g>
      <g data-step="2"><path d="M140 100 H250 V40 H400 V100 H470 M140 162 H290 V80 H360 V162 H470" fill="none" stroke="var(--text)" stroke-width="2"/></g>
      <g data-step="2-5"><path d="M144 131 H270 V60 H380 V131 H476" stroke="var(--good)" stroke-width="3" fill="none" class="rl-flow slow"/></g>
      <g data-step="=2">${T(320, 200, '250 mm duct: same air at 1.2 m/s', { c: 'good' })}</g>
      <g data-step="3"><path d="M146 106 H250 M146 156 H290 M256 46 H394 M296 86 H354 M400 106 H466 M366 156 H466" stroke="var(--c5)" stroke-width="6" opacity=".8"/></g>
      <g data-step="=3">${T(320, 200, 'soft lining + two bends', { c: 'c5' })}${T(320, 218, 'soak up the fan’s own noise', { z: 12 })}</g>
      <g data-step="4"><path d="M120 106 q10 -8 20 -6 M120 156 q10 8 20 6" fill="none" stroke="var(--c4)" stroke-width="4"/>
        <path d="M200 100 V84 M430 100 V84" stroke="var(--c4)" stroke-width="3" stroke-dasharray="3 3"/></g>
      <g data-step="=4">${T(320, 200, 'flexible joint + rubber hangers', { c: 'c4' })}${T(320, 218, 'stop vibration travelling', { z: 12 })}</g>
      <g data-step="5"><rect x="466" y="96" width="8" height="70" fill="var(--good)"/></g>
      <g data-step="=5">${T(320, 200, 'large grille, away from the mic', { c: 'good' })}${T(320, 218, 'air on during every take', { z: 12 })}</g>
    </svg>`,
    steps: [
      ['Small duct, fast air', 'Sixty litres a second through a 150 mm duct means 3.4 m/s. At the grille that turns into a steady hiss.'],
      ['Make the duct bigger', 'The same air through a 250 mm duct moves at 1.2 m/s. Noise from moving air falls steeply as speed drops.'],
      ['Line it and bend it', 'Absorber inside the duct and two bends stop the fan’s whirr from travelling down the tube like a speaking pipe.'],
      ['Float it', 'A flexible connector at the fan and rubber hangers keep the fan’s shake out of the walls and ceiling.'],
      ['End gently', 'A large grille placed away from the microphone lets the air spill into the booth slowly and silently.'],
    ],
    why: [
      'Turbulence makes the noise, and turbulence rises very quickly with speed. Halving the speed cuts air noise by well over 10 dB.',
      'A bare duct is a tube that carries sound as readily as air, in both directions, so it must be lined and bent or it also leaks sound between rooms.',
      'People and equipment give off heat and need fresh air; a quiet system left running beats a loud one that gets switched off.',
    ],
    uses: [
      ['🎙️', 'Voice booth', 'Size the final duct and grille for under about 1.5 m/s, and never aim the outlet at the microphone.'],
      ['🎛️', 'Control room', 'Put the noisy indoor unit in a cupboard or corridor and bring the air in through a lined duct with at least two bends.'],
      ['🏡', 'Home studio on a budget', 'A quiet inline fan in the next room, 3 m of lined flexible duct with an S-bend, and an oversized grille go a long way.'],
    ],
    tryit: [
      'Blow gently through wide-open lips, then hard through pursed lips. Same breath, very different noise: that is duct sizing.',
      'Hold a strip of tissue at your room’s supply grille. If it streams out stiffly and you can hear the air, the outlet is too small.',
      'Work out the speed in your own duct: litres per second ÷ 1000 ÷ duct area in m². Area of a round duct is 3.14 × radius².',
    ],
    slip: ['Sealing a booth airtight for isolation and leaving out ventilation altogether.', 'Plan the air path at the start. A sealed room with people in it becomes hot and stuffy within minutes.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-daylight', {
    title: 'the garden window that did not leak sound',
    plain: 'A studio can have a window. Two heavy panes of different thickness, set far apart in separate frames, block sound almost as well as the wall. Ordinary double glazing does not, because its two thin panes bounce on the thin layer of air between them.',
    where: 'A garden studio 12 m from a neighbour’s bedroom window',
    story: `<p>Tanya wanted daylight and a view of the garden from her mix seat. Her builder offered a standard sealed double-glazed unit: two 4 mm panes with a 12 mm gap. The acoustic consultant warned it would be the weak spot of the whole building, worst right in the bass and low-mid range.</p>
      <p>They fitted a 10 mm laminated pane in the outer wall and a separate 6 mm pane in the inner wall, 150 mm apart, with absorber lining the reveal between them. The inner pane leans a few degrees to throw reflections and glare downward. An outside awning keeps the summer sun off the glass.</p>`,
    numbers: [['Ordinary unit: 4 mm + 12 mm air + 4 mm', 'panes bounce at about 245 Hz'], ['Studio window: 10 mm + 150 mm air + 6 mm', 'bounce moves down to about 51 Hz'], ['Glass weight', '2.5 kg per m² for each mm'], ['Typical result', 'about 30 dB → 50 dB or more']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Section through an ordinary double-glazed unit and a studio window with two separated panes">
      ${T(70, 40, 'outside', { z: 12 })}${T(575, 40, 'studio', { z: 12 })}
      <path d="M30 140 H150" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
      ${head(580, 150)}
      <g data-step="1-2"><rect x="300" y="50" width="40" height="30" fill="var(--text)"/><rect x="300" y="200" width="40" height="30" fill="var(--text)"/>
        <g class="rl-shake"><rect x="308" y="80" width="6" height="120" fill="var(--accent2)"/></g><g class="rl-shake d2"><rect x="326" y="80" width="6" height="120" fill="var(--accent2)"/></g></g>
      <g data-step="=1">${T(320, 256, 'two thin panes, 12 mm of air', {})}</g>
      <g data-step="=2"><path d="M345 140 H540" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/>
        ${T(320, 256, 'they bounce together near 245 Hz', { c: 'bad' })}${T(450, 126, 'bass leaks through', { z: 12, c: 'bad' })}</g>
      <g data-step="3"><rect x="200" y="50" width="50" height="30" fill="var(--text)"/><rect x="200" y="200" width="50" height="30" fill="var(--text)"/>
        <rect x="400" y="50" width="50" height="30" fill="var(--text)"/><rect x="400" y="200" width="50" height="30" fill="var(--text)"/>
        <rect x="218" y="80" width="14" height="120" fill="var(--accent2)"/><path d="M418 80 L430 200" stroke="var(--accent2)" stroke-width="9"/></g>
      <g data-step="=3">${T(225, 256, '10 mm laminated', { z: 12 })}${T(425, 256, '6 mm, leaning', { z: 12 })}${T(325, 140, '150 mm of air', { z: 12 })}</g>
      <g data-step="4"><rect x="250" y="62" width="150" height="12" fill="var(--c5)"/><rect x="250" y="206" width="150" height="12" fill="var(--c5)"/>
        <path d="M240 140 H410" stroke="var(--accent)" stroke-width="1.5" fill="none" class="rl-flow slow"/></g>
      <g data-step="=4">${T(325, 100, 'soft lining in the reveal', { z: 12, c: 'c5' })}${T(325, 256, 'big air gap = soft spring: 51 Hz', { c: 'good' })}</g>
      <g data-step="5"><path d="M150 44 L215 70" stroke="var(--c4)" stroke-width="6"/><path d="M60 60 L205 118" stroke="var(--warn)" stroke-width="2" stroke-dasharray="5 5" class="rl-pulse"/></g>
      <g data-step="=5">${T(120, 200, 'awning stops the sun', { z: 12, c: 'c4' })}${T(520, 200, 'quiet, bright, cool', { c: 'good' })}</g>
    </svg>`,
    steps: [
      ['Ordinary double glazing', 'Two thin panes sealed 12 mm apart. Fine for heat, weak for sound.'],
      ['The panes bounce on the air', 'The thin air layer is a stiff spring joining two light panes. Around 245 Hz they move together and sound walks through.'],
      ['Heavy, different, far apart', 'A studio window uses thick panes of unequal thickness in two separate frames, with a wide gap.'],
      ['A softer spring', 'More air between the panes is a softer spring, and heavier glass is harder to move. The weak note falls to about 51 Hz. Lining the reveal soaks up what is trapped.'],
      ['Mind the sun', 'Shade the glass from outside and lean the inner pane so neither glare nor reflections reach the mix seat.'],
    ],
    why: [
      'Two panes with air between behave like two weights joined by a spring. Near their bounce frequency they block little; well above it they block far more than one pane.',
      'Each pane also has its own weak frequency that depends on thickness. Using two thicknesses means the weak spots do not line up.',
      'Separate frames in separate walls stop vibration crossing through the frame, which would bypass the air gap entirely.',
    ],
    uses: [
      ['🎛️', 'Control-room window to the live room', 'Two panes of different thickness in the two walls, 150 mm or more apart, one leaning 5–10°.'],
      ['🏡', 'Garden studio', 'Keep windows small, on the side away from neighbours, and fixed shut; ventilate through lined ducts instead.'],
      ['🏢', 'Booth with no outside wall', 'Borrow daylight through an internal window or a light tube rather than giving up on daylight.'],
    ],
    tryit: [
      'Tap a window pane at home with a knuckle and listen to the pitch, then tap the wall. The lighter, ringing one is where sound gets through.',
      'Stand outside your room while music plays inside. Walk past the window and the wall and note where it is loudest.',
      'For a window you are planning, add up the glass weight: thickness in mm × 2.5 kg for each square metre, and compare with your wall.',
    ],
    slip: ['Fitting an expensive “acoustic” sealed unit into a single frame and expecting studio isolation.', 'Use two separate panes in two frames with a big gap. Have large or overhead glass specified and fitted by a glazier: it is heavy and must be safety glass.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-plan-bedroom', {
    title: 'setting out a 3.6 × 3.0 m bedroom in one afternoon',
    plain: 'A small bedroom cannot be made soundproof on a budget, but it can be made to tell the truth. Face the desk down the long side, sit a little forward of the middle, and put thick absorbers where bass gathers and where reflections land.',
    where: 'A rented flat in Bengaluru: 3.6 × 3.0 m, 2.4 m ceiling',
    story: `<p>Sneha had her desk in a corner under the window because that was where the bed left space. The bass was huge in the left ear and thin in the right, and mixes never translated.</p>
      <p>She could not alter the walls, so she changed the layout. The desk moved to the middle of the 3.0 m wall, facing down the 3.6 m length. She sat 1.37 m from the front wall with the speakers and her head at the corners of a 1.1 m triangle. Free-standing corner traps, two side panels, a ceiling panel and the bed and wardrobe at the back did the rest. For late nights she still uses headphones.</p>`,
    numbers: [['Length mode', '343 ÷ (2 × 3.6) ≈ 48 Hz'], ['Width mode', '343 ÷ (2 × 3.0) ≈ 57 Hz'], ['Height mode', '343 ÷ (2 × 2.4) ≈ 71 Hz'], ['Seat position', '0.38 × 3.6 ≈ 1.37 m from the front wall']],
    svg: `<svg viewBox="0 0 640 280" aria-label="Plan of a bedroom studio being laid out step by step">
      <rect x="80" y="30" width="480" height="220" fill="var(--panel)" stroke="var(--text)" stroke-width="3"/>
      ${T(320, 270, '3.6 m', { z: 12 })}${T(60, 144, '3.0 m', { z: 12 })}
      <g data-step="=1"><rect x="90" y="40" width="90" height="46" fill="var(--bad)" opacity=".6"/>${T(135, 106, 'desk in a corner', { z: 12, c: 'bad' })}
        <rect x="90" y="40" width="150" height="110" fill="var(--bad)" opacity=".15" class="rl-pulse"/>${T(380, 140, 'lopsided bass, lopsided image', {})}</g>
      <g data-step="2"><rect x="100" y="100" width="56" height="80" rx="3" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/></g>
      <g data-step="=2"><path d="M100 140 H540" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 5" class="rl-flow slow"/>${T(360, 126, 'face down the length, on the centre line', {})}</g>
      <g data-step="3"><rect x="150" y="92" width="16" height="20" fill="var(--text)"/><rect x="150" y="168" width="16" height="20" fill="var(--text)"/>${head(262, 140)}
        <path d="M166 102 L250 140 L166 178" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="=3"><path d="M80 214 H262" stroke="var(--muted)" stroke-width="1.5"/><path d="M80 208 v12 M262 208 v12" stroke="var(--muted)" stroke-width="1.5"/>
        ${T(171, 232, '1.37 m', { z: 12, w: 1 })}${T(410, 126, 'seat at 38 % of the length', {})}${T(410, 146, '1.1 m triangle', { z: 12 })}</g>
      <g data-step="4"><path d="M82 32 h40 l-40 40 z M82 248 h40 l-40 -40 z M558 32 h-40 l40 40 z M558 248 h-40 l40 -40 z" fill="var(--c4)"/>
        <rect x="186" y="32" width="56" height="12" fill="var(--c2)"/><rect x="186" y="236" width="56" height="12" fill="var(--c2)"/>
        <rect x="200" y="104" width="90" height="72" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/></g>
      <g data-step="=4">${T(420, 110, 'corner traps', { c: 'c4' })}${T(420, 130, 'side panels + ceiling panel', { c: 'c2' })}</g>
      <g data-step="5"><rect x="430" y="150" width="120" height="90" rx="4" fill="var(--c3)" opacity=".5"/><rect x="430" y="40" width="120" height="30" fill="var(--c1)" opacity=".6"/></g>
      <g data-step="=5">${T(490, 200, 'bed', { z: 12 })}${T(490, 60, 'wardrobe', { z: 12 })}${T(330, 96, 'soft furniture at the back helps', {})}</g>
    </svg>`,
    steps: [
      ['The usual starting point', 'A desk pushed into a corner. One speaker is near a side wall, the other is not, so left and right never match.'],
      ['Turn and centre the desk', 'Put it in the middle of a short wall, facing down the long side. Left and right now see the same room.'],
      ['Find the seat', 'Sit about 38 % of the room length from the front wall: 1.37 m. Speakers and head make an equal-sided triangle.'],
      ['Treat where it counts', 'Thick traps in the corners for bass; panels at the two side mirror points and above the desk for clarity.'],
      ['Use the furniture', 'The bed, wardrobe and bookshelves behind you absorb and scatter sound for free.'],
    ],
    why: [
      'Symmetry gives both ears the same story. Without it, no amount of treatment makes the stereo picture stable.',
      'Room modes have dead spots at the middle and loud spots at the walls. About 38 % along avoids the worst of both for the main length mode.',
      'In a room this small the first reflections arrive within a few milliseconds, which blurs detail. Absorbing just those few spots brings a big gain.',
    ],
    uses: [
      ['🎧', 'First home studio', 'Layout costs nothing: get the desk centred and the seat placed before buying a single panel.'],
      ['🏠', 'Rented room', 'Use free-standing traps and panels on stands or hung from picture hooks so nothing is fixed to the walls.'],
      ['👨‍👩‍👧', 'Shared bedroom or guest room', 'Panels that double as pinboards and a folding desk keep the room usable for everyone.'],
    ],
    tryit: [
      'Measure your room’s length and multiply by 0.38. Put a strip of tape on the floor at that distance from the front wall.',
      'Sit on the tape and check with a tape measure that each side wall is the same distance from your head.',
      'Play a bass-heavy track and slide your chair 30 cm forward and back from the tape. Pick the spot where the bass is most even.',
    ],
    slip: ['Expecting foam and panels to stop sound reaching the neighbours.', 'Treatment improves the sound inside the room only. For neighbours, keep levels sensible and use headphones at night.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-plan-basement', {
    title: 'the drum room under the living room',
    plain: 'To keep loud sound from the room above, build a second room inside the basement that touches the house as little as possible: its own ceiling hung on springy hangers, its own walls, heavy doors with a lobby between them, and air brought in through lined ducts.',
    where: 'A basement under a family home; living room directly above',
    story: `<p>The Mehta family could follow every drum fill from the sofa upstairs. The basement had a bare timber floor overhead, so sound went straight up through the joists.</p>
      <p>The builder hung a new ceiling of two layers of plasterboard on resilient hangers 250 mm below the joists, with wool in the gap. New stud walls stand just clear of the old ones. A small lobby with a heavy door at each end leads in, and a lined duct brings air from a machine room. Drumming that had been as loud as a conversation upstairs became a faint thud you had to listen for.</p>`,
    numbers: [['Old floor above', 'about 40 kg/m²'], ['New hung ceiling (2 × 12.5 mm board)', 'about 20 kg/m²'], ['Air gap with wool', '250 mm'], ['The pair bounce at about', '60 × √(60 ÷ (20 × 40 × 0.25)) ≈ 33 Hz'], ['Typical gain', 'about 40 dB → about 60 dB']],
    svg: `<svg viewBox="0 0 640 290" aria-label="Section through a house with a basement studio built as a room within a room">
      <rect x="60" y="20" width="520" height="70" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>${T(140, 40, 'living room', { z: 12 })}
      <rect x="430" y="60" width="90" height="26" rx="8" fill="var(--c3)" opacity=".7"/>${head(475, 48, 'c2')}
      <rect x="60" y="90" width="520" height="14" fill="var(--text)"/>
      <rect x="60" y="104" width="14" height="166" fill="var(--text)"/><rect x="566" y="104" width="14" height="166" fill="var(--text)"/><rect x="60" y="270" width="520" height="10" fill="var(--text)"/>
      <ellipse cx="300" cy="238" rx="34" ry="12" fill="var(--c1)"/><rect x="266" y="238" width="68" height="26" fill="var(--c1)"/><circle cx="300" cy="222" r="22" fill="none" stroke="var(--accent)" stroke-width="2" class="rl-grow"/>
      ${T(250, 258, 'drums', { z: 12, a: 'end' })}
      <g data-step="1-1"><path d="M270 214 V60 M300 206 V60 M330 214 V60" stroke="var(--bad)" stroke-width="3" fill="none" class="rl-flow"/>
        ${T(180, 160, 'straight up through the floor', { c: 'bad' })}</g>
      <g data-step="2"><rect x="92" y="138" width="456" height="10" fill="var(--c2)"/>${[130, 220, 310, 400, 490].map((x) => `<path d="M${x} 104 V138" stroke="var(--c4)" stroke-width="3" stroke-dasharray="4 3"/>`).join('')}
        <rect x="92" y="108" width="456" height="26" fill="var(--c5)" opacity=".35"/></g>
      <g data-step="=2">${T(446, 172, 'new ceiling on springy hangers', { c: 'c2' })}${T(446, 190, '250 mm gap filled with wool', { z: 12 })}</g>
      <g data-step="3"><rect x="92" y="138" width="10" height="132" fill="var(--c2)"/><rect x="538" y="138" width="10" height="132" fill="var(--c2)"/></g>
      <g data-step="=3">${T(446, 172, 'new walls stand clear', { c: 'c2' })}${T(446, 190, 'of the old ones', { z: 12 })}${T(108, 208, '← air gap', { z: 12, a: 'start' })}</g>
      <g data-step="2-5"><path d="M270 214 V152 M300 206 V152 M330 214 V152" stroke="var(--accent)" stroke-width="2.5" fill="none" class="rl-flow"/>
        <path d="M300 100 V66" stroke="var(--good)" stroke-width="1.5" fill="none" class="rl-flow slow"/></g>
      <g data-step="4"><rect x="538" y="206" width="10" height="64" fill="var(--warn)"/><rect x="566" y="206" width="14" height="64" fill="var(--warn)"/></g>
      <g data-step="=4">${T(446, 226, 'two heavy doors,', { z: 12, c: 'warn' })}${T(446, 242, 'lobby between', { z: 12 })}</g>
      <g data-step="5"><path d="M110 148 V170 H170" fill="none" stroke="var(--c5)" stroke-width="8"/><path d="M110 150 V170 H176" fill="none" stroke="var(--panel)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="=5">${T(184, 196, 'lined duct for fresh air', { z: 12, c: 'c5' })}${T(446, 180, 'upstairs: a faint thud', { c: 'good' })}</g>
    </svg>`,
    steps: [
      ['The direct route up', 'Drums shake the air, the air shakes the timber floor above, and the floor acts as a loudspeaker into the living room.'],
      ['Hang a second ceiling', 'Two layers of board hang on resilient hangers 250 mm below the joists, with wool in the gap. Nothing rigid joins old and new.'],
      ['Stand new walls clear', 'Inner walls on their own frame, not touching the basement walls, complete the box within the box.'],
      ['Two doors, not one', 'A lobby with a heavy sealed door at each end means one is always shut and sound has two barriers to cross.'],
      ['Let it breathe quietly', 'Fresh air comes in and out through lined ducts with bends, from a machine room that holds the noisy equipment.'],
    ],
    why: [
      'Two heavy layers separated by a soft air gap block far more than one layer twice as heavy, as long as nothing solid bridges the gap.',
      'The layers and the air between them bounce at one low frequency (about 33 Hz here). Above that the isolation climbs quickly; a bigger gap or more mass pushes the weak spot lower.',
      'One rigid fixing, pipe or unsealed gap can undo most of the gain, because sound takes the easiest path.',
    ],
    uses: [
      ['🥁', 'Drum practice room', 'Prioritise the ceiling and the door; concrete basement walls and floor already do most of the work sideways and down.'],
      ['🎬', 'Home cinema below bedrooms', 'The same hung ceiling keeps film explosions from the rooms above.'],
      ['🎛️', 'Control room and booth', 'Build each as its own inner box so one can record while the other monitors loudly.'],
    ],
    tryit: [
      'Play music in your basement or lower room and go upstairs. Put an ear near the floor, a doorway and a duct or pipe to find the loudest path.',
      'Measure the free height. Subtract 300 mm for a hung ceiling and decide whether what is left is workable.',
      'Count the things that would cross the gap between old and new structure (pipes, cables, ducts, light fittings) and note how each could be made flexible.',
    ],
    slip: ['Screwing new plasterboard straight onto the existing joists and expecting isolation.', 'A rigid fixing carries vibration across. Use hangers rated for the ceiling’s weight, installed to the maker’s spacing, and have the structure checked for the added load.'],
  });
})();
