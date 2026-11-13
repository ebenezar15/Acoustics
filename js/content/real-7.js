/* "In real life" blocks — group 7 (plans, playbook, connections, standards, India, buildings,
   design language, immersive rooms, fabric, the consultant's path and process, furniture).
   Each REAL(id, {...}) adds a worked scene, a step-through animated diagram and a practical
   wrap-up to an existing lesson (see js/real-kit.js). */
(function () {
  const REAL = window.REAL; if (!REAL) return;

  /* ------------------------------------------------------------------ */
  REAL('m-plan-detached', {
    title: 'the garden studio and the bedroom 12 metres away',
    plain: 'A garden studio keeps the peace when three things work together: a heavy room built inside another heavy room, distance to the neighbour, and an entrance with two doors so one is always shut.',
    where: 'A garden studio in a quiet suburb, neighbour’s bedroom 12 m away',
    story: `<p>Ravi plays drums at about 105 dB inside his new garden studio. The inner room sits on its own floor inside the outer shell, and together they block about 60 dB. On the first night the neighbour still hears a faint thump. Ravi walks round the building and finds it: the sound is coming out of the single entrance door, which only blocks about 35 dB.</p>
      <p>He adds a small lobby with a second sealed door. Now every path out of the building is about as good as the walls, and at the neighbour’s window the drums sit below the night-time background.</p>`,
    numbers: [['Drums inside', '105 dB'], ['Just outside the wall', '105 − 60 = 45 dB'], ['12 m away (about 22 dB less)', '≈ 23 dB'], ['Out through one door', '105 − 35 = 70 dB'], ['Night background outside', 'about 30 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Section of a garden studio with an inner room, a lobby with two doors, and a neighbouring house">
      <line x1="20" y1="214" x2="620" y2="214" stroke="var(--line)" stroke-width="2"/>
      <rect x="60" y="84" width="250" height="130" fill="none" stroke="var(--muted)" stroke-width="7"/>
      <rect x="84" y="104" width="178" height="100" fill="var(--panel)" stroke="var(--c2)" stroke-width="5"/>
      <rect x="84" y="204" width="178" height="6" fill="var(--c4)"/>
      <circle cx="160" cy="170" r="14" fill="var(--c1)"/><rect x="140" y="184" width="40" height="18" rx="3" fill="var(--c1)"/>
      <text x="173" y="240" text-anchor="middle" font-size="13">room inside a room</text>
      <path d="M520 214 V150 L560 118 L600 150 V214 Z" fill="var(--panel)" stroke="var(--muted)" stroke-width="3"/>
      <rect x="548" y="160" width="24" height="24" fill="var(--accent2)" opacity=".5"/>
      <text x="560" y="240" text-anchor="middle" font-size="13">neighbour</text>
      <g data-step="1"><circle cx="160" cy="170" r="20" fill="none" stroke="var(--c1)" stroke-width="3" class="rl-grow"/>
        <circle cx="160" cy="170" r="20" fill="none" stroke="var(--c1)" stroke-width="3" class="rl-grow d3"/></g>
      <g data-step="=1"><text x="173" y="74" text-anchor="middle" font-size="14">drums: 105 dB inside</text></g>
      <g data-step="=2"><text x="185" y="74" text-anchor="middle" font-size="14">two heavy shells: −60 dB</text>
        <path d="M64 150 H30" stroke="var(--good)" stroke-width="3" class="rl-flow slow"/><text x="28" y="140" font-size="13" fill="var(--good)">45</text></g>
      <g data-step="=3"><path d="M316 130 H510" stroke="var(--good)" stroke-width="2.5" class="rl-flow slow"/>
        <text x="414" y="118" text-anchor="middle" font-size="13">12 m of open air: about −22 dB</text>
        <text x="414" y="150" text-anchor="middle" font-size="13" fill="var(--good)">≈ 23 dB at the window</text></g>
      <g data-step="=4"><rect x="306" y="150" width="8" height="60" fill="var(--bad)"/>
        <path d="M318 180 H514" stroke="var(--bad)" stroke-width="4" class="rl-flow"/>
        <text x="414" y="168" text-anchor="middle" font-size="13" fill="var(--bad)">one door: 70 dB gets out</text></g>
      <g data-step="5"><rect x="310" y="140" width="56" height="74" fill="none" stroke="var(--muted)" stroke-width="5"/>
        <rect x="306" y="150" width="8" height="60" fill="var(--good)"/><rect x="362" y="150" width="8" height="60" fill="var(--good)"/></g>
      <g data-step="=5"><text x="378" y="132" font-size="13">lobby, two doors</text>
        <path d="M376 180 H514" stroke="var(--good)" stroke-width="2" class="rl-flow slow"/>
        <text x="446" y="168" text-anchor="middle" font-size="13" fill="var(--good)">below the background</text></g>
    </svg>`,
    steps: [
      ['The source', 'Drums fill the inner room at about 105 dB. That is the number every wall, door and duct has to deal with.'],
      ['Two heavy shells with a gap', 'The inner room touches the outer building only through soft mounts. Together they take off about 60 dB, leaving 45 dB just outside.'],
      ['Distance helps for free', 'Sound spreads out as it travels. Twelve metres of open air takes off roughly another 22 dB.'],
      ['The weak door spoils it', 'A single door blocks only about 35 dB. Almost all the sound that escapes goes through it, and the walls no longer matter.'],
      ['A lobby with two doors', 'Two sealed doors with a small lined lobby between them perform like the walls. Now the weakest path is as good as the strongest.'],
    ],
    why: [
      'Sound leaves a building like water leaves a bucket: through the biggest hole. Improving the walls does nothing while a door, window or duct is much weaker.',
      'Two separate heavy layers with air between block far more than one layer twice as thick, because the second layer is not shaken directly by the first.',
      'Placing the building, its door and its plant on the side away from the neighbour costs nothing and can be worth as much as an extra wall.',
    ],
    uses: [
      ['🥁', 'Planning a drum room', 'Start from 105–110 dB inside and the night background outside; the difference is the isolation every path must reach.'],
      ['🚪', 'Choosing the entrance', 'If walls give 55 dB or more, plan a sound lock: one door alone rarely passes 40 dB.'],
      ['📐', 'Siting the building', 'Turn the door and the air-conditioning unit away from the nearest bedroom; each doubling of distance gains about 6 dB.'],
    ],
    tryit: [
      'Sketch your plot. Mark the nearest neighbour’s window and measure the distance from where a studio wall would be.',
      'Play music in a room at a steady, comfortable level, close the door, and walk around outside it. Notice that the door and its gaps are where you hear most.',
      'List every opening your studio would need (door, window, fresh air, cables). Next to each, write how it will be made as good as the wall.',
    ],
    slip: ['Spending the whole budget on thick walls and fitting one ordinary door.', 'Decide the isolation target first, then bring every path up to it: walls, floor, roof, doors, glass, ducts and cable entries.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-plan-pro', {
    title: 'the voice booth next to the drum room',
    plain: 'In a multi-room studio, the cheapest isolation is the floor plan. Put quiet rooms far from loud rooms and let corridors, stores and lobbies sit in between.',
    where: 'A two-floor commercial studio being planned in an industrial unit',
    story: `<p>Anita’s first sketch puts the voice booth right beside the live room because it makes the corridor shorter. The live room will see 110 dB drum takes; the voice booth must stay at about 20 dB so whispers record cleanly. One wall would have to block 90 dB. Even an excellent double wall manages about 65.</p>
      <p>She swaps two rooms on paper. The equipment store and the corridor now sit between the live room and the booth, and each loud room gets its own floor slab. The same two walls, with a buffer between them and no shared floor, now reach the target.</p>`,
    numbers: [['Loudest source', '110 dB'], ['Quietest room target', '20 dB'], ['Isolation needed', '110 − 20 = 90 dB'], ['One very good double wall', 'about 65 dB'], ['Two walls with a buffer room, separate slabs', 'about 85–90 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Floor plan showing a loud live room, a quiet voice booth and a buffer room placed between them">
      <rect x="40" y="50" width="560" height="170" fill="none" stroke="var(--line)" stroke-width="2"/>
      <rect x="50" y="60" width="200" height="150" fill="var(--panel)" stroke="var(--c1)" stroke-width="4"/>
      <text x="150" y="126" text-anchor="middle" font-size="15">LIVE ROOM</text><text x="150" y="146" text-anchor="middle" font-size="13" fill="var(--c1)">110 dB</text>
      <circle cx="150" cy="176" r="10" fill="none" stroke="var(--c1)" stroke-width="3" class="rl-grow"/>
      <g data-step="1-2"><rect x="254" y="60" width="110" height="150" fill="var(--panel)" stroke="var(--c2)" stroke-width="4"/>
        <text x="309" y="126" text-anchor="middle" font-size="14">VOICE</text><text x="309" y="146" text-anchor="middle" font-size="13" fill="var(--c2)">needs 20 dB</text>
        <rect x="372" y="60" width="218" height="150" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 5"/>
        <text x="481" y="140" text-anchor="middle" font-size="13" fill="var(--muted)">store + corridor</text></g>
      <g data-step="=1"><text x="320" y="36" text-anchor="middle" font-size="14">first sketch: loud and quiet share a wall</text></g>
      <g data-step="=2"><path d="M236 135 H300" stroke="var(--bad)" stroke-width="5" class="rl-flow"/>
        <text x="320" y="36" text-anchor="middle" font-size="14" fill="var(--bad)">needs 90 dB, one wall gives 65</text></g>
      <g data-step="3"><rect x="254" y="60" width="218" height="150" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 5"/>
        <text x="363" y="130" text-anchor="middle" font-size="13" fill="var(--muted)">store + corridor</text>
        <text x="363" y="150" text-anchor="middle" font-size="13" fill="var(--muted)">(buffer)</text>
        <rect x="480" y="60" width="110" height="150" fill="var(--panel)" stroke="var(--c2)" stroke-width="4"/>
        <text x="535" y="126" text-anchor="middle" font-size="14">VOICE</text><text x="535" y="146" text-anchor="middle" font-size="13" fill="var(--c2)">20 dB</text></g>
      <g data-step="=3"><text x="320" y="36" text-anchor="middle" font-size="14">swap: a buffer room in between</text>
        <path d="M252 110 H330" stroke="var(--warn)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=4"><path d="M150 216 Q340 250 535 216" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-flow"/>
        <text x="320" y="36" text-anchor="middle" font-size="14" fill="var(--bad)">a shared floor still carries it round</text></g>
      <g data-step="5"><line x1="252" y1="212" x2="252" y2="228" stroke="var(--good)" stroke-width="4"/><line x1="476" y1="212" x2="476" y2="228" stroke="var(--good)" stroke-width="4"/></g>
      <g data-step="=5"><text x="320" y="36" text-anchor="middle" font-size="14" fill="var(--good)">separate slabs: 85–90 dB reached</text>
        <text x="363" y="246" text-anchor="middle" font-size="13" fill="var(--good)">breaks in the floor</text></g>
    </svg>`,
    steps: [
      ['The tempting plan', 'Loud and quiet rooms are put side by side to save corridor. It looks efficient on paper.'],
      ['Do the subtraction', 'Loudest level minus quietest target is the isolation needed: 90 dB here. No single wall does that.'],
      ['Move the rooms', 'Stores, corridors, lobbies and toilets do not mind noise. Placed between the loud and quiet rooms they become free isolation.'],
      ['Mind the floor', 'Sound also travels through any structure both rooms stand on. A shared slab can carry more than the walls let through.'],
      ['Break the structure', 'Give each critical room its own floated floor or separate slab. Now the buffer and the walls can do their job.'],
    ],
    why: [
      'Two walls separated by a whole room behave almost independently, so their isolation nearly adds, which two leaves of one wall can never do.',
      'Moving a room on a drawing costs nothing; adding 20 dB to a built wall can cost more than the rest of the room.',
      'Structure carries vibration sideways. Until the floor is broken, the best wall in the world is by-passed.',
    ],
    uses: [
      ['🗺️', 'First layout sketch', 'Write the loudest level or quietest target in each room, then subtract across every shared wall before drawing anything else.'],
      ['🏫', 'Schools and offices', 'Put stores and corridors between music rooms and classrooms, and plant rooms away from meeting rooms.'],
      ['🏠', 'A home studio', 'Use a wardrobe, bathroom or hallway as the buffer between the studio and a bedroom.'],
    ],
    tryit: [
      'Draw your home or workplace as boxes. Label each room loud, normal or quiet.',
      'Circle every wall where loud touches quiet. Could a cupboard, corridor or bathroom go between them instead?',
      'Stand in a quiet room while someone taps the floor two rooms away with a shoe heel. If you hear it, the floor is the path.',
    ],
    slip: ['Fixing a bad room layout later with thicker walls.', 'Settle adjacencies and structural breaks first. Walls are sized only after the plan has done all it can.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-playbook', {
    title: 'six lakh rupees, spent in the right order',
    plain: 'Build a studio from the outside in: first stop the noise, then make the air quiet, then fix the room’s sound, and only then choose speakers. Each step makes the next one worth its money.',
    where: 'A 4 × 3.4 m spare room in a flat, budget ₹6,00,000',
    story: `<p>Meera’s first shopping list spends ₹3.5 lakh on monitors and the rest on foam tiles. A friend asks two questions: can the neighbours hear you, and can you hear the air-conditioner in your recordings? The answer to both is yes, and no speaker will fix either.</p>
      <p>She re-orders the money: seal and line the shell and replace the door first, quieten the air, build deep corner traps and a ceiling cloud, then buy smaller monitors and measure. She keeps a tenth back for surprises. The cheaper speakers in the finished room sound better than the expensive ones would have in the bare one.</p>`,
    numbers: [['Shell, door and seals', '₹2.0 lakh'], ['Quiet air-conditioning and fresh air', '₹0.9 lakh'], ['Bass traps, cloud, panels, fabric', '₹1.3 lakh'], ['Monitors and stands', '₹1.2 lakh'], ['Held back for surprises (10 %)', '₹0.6 lakh'], ['Total', '₹6.0 lakh']],
    svg: `<svg viewBox="0 0 640 270" aria-label="A room being built in order: shell, door, quiet air, treatment, loudspeakers and measurement">
      <line x1="20" y1="224" x2="620" y2="224" stroke="var(--line)" stroke-width="2"/>
      <rect x="150" y="70" width="340" height="154" fill="var(--panel)" stroke="var(--muted)" stroke-width="3"/>
      <g data-step="=1"><rect x="150" y="70" width="340" height="154" fill="none" stroke="var(--c1)" stroke-width="9"/>
        <text x="320" y="50" text-anchor="middle" font-size="14">1 · heavy, sealed shell</text>
        <path d="M100 150 H140" stroke="var(--bad)" stroke-width="3" class="rl-flow"/><text x="96" y="140" text-anchor="end" font-size="13">street</text></g>
      <g data-step="2"><rect x="150" y="70" width="340" height="154" fill="none" stroke="var(--c1)" stroke-width="9"/></g>
      <g data-step="=2"><rect x="484" y="130" width="12" height="94" fill="var(--good)"/>
        <text x="320" y="50" text-anchor="middle" font-size="14">2 · solid door with seals all round</text>
        <path d="M500 180 H560" stroke="var(--good)" stroke-width="2" class="rl-flow slow"/></g>
      <g data-step="3"><rect x="484" y="130" width="12" height="94" fill="var(--good)"/>
        <rect x="190" y="78" width="110" height="14" rx="3" fill="var(--c2)"/></g>
      <g data-step="=3"><path d="M210 96 V140 M245 96 V140 M280 96 V140" stroke="var(--c2)" stroke-width="2.5" class="rl-flow slow"/>
        <text x="320" y="50" text-anchor="middle" font-size="14">3 · slow, quiet air</text></g>
      <g data-step="4"><path d="M158 78 H190 L158 126 Z" fill="var(--c3)"/><path d="M482 78 H450 L482 126 Z" fill="var(--c3)"/>
        <rect x="158" y="150" width="14" height="60" fill="var(--c3)"/><rect x="468" y="150" width="14" height="60" fill="var(--c3)"/>
        <rect x="330" y="96" width="110" height="10" rx="3" fill="var(--c3)"/></g>
      <g data-step="=4"><text x="320" y="50" text-anchor="middle" font-size="14">4 · corner traps, cloud, side panels</text></g>
      <g data-step="5"><rect x="210" y="150" width="26" height="40" rx="3" fill="var(--text)"/><circle cx="223" cy="164" r="6" fill="var(--panel)"/>
        <circle cx="400" cy="158" r="12" fill="var(--c4)"/><rect x="390" y="170" width="20" height="40" rx="6" fill="var(--c4)"/>
        <path d="M240 164 H384" stroke="var(--accent)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=5"><text x="320" y="50" text-anchor="middle" font-size="14">5 · speakers last, then measure</text></g>
      <text x="320" y="252" text-anchor="middle" font-size="13" fill="var(--muted)">each layer is fitted before the next</text>
    </svg>`,
    steps: [
      ['Shell first', 'Close every gap, add mass to the weak surfaces. Nothing done later can be heavier or more airtight than this layer.'],
      ['Then the door', 'The door is the largest opening. A solid leaf with seals on all four sides brings it close to the walls.'],
      ['Then quiet air', 'A sealed room needs fresh, cool air. Slow air through large lined ducts is quiet; fast air through small grilles hisses into every take.'],
      ['Then the room’s own sound', 'Deep traps in the corners, absorption at the first reflection points and a cloud overhead. Now what you hear is the speaker, not the room.'],
      ['Speakers and measurement last', 'Choose monitors to suit the finished room, place them, measure, and adjust. This step is quick when the first four were done well.'],
    ],
    why: [
      'Each layer hides the one before it. You cannot seal a wall once the treatment and fabric are on it.',
      'A weak early step sets a ceiling on everything after it: speakers cannot reveal detail that is buried under air-conditioner noise or room boom.',
      'Money spent early is spent once. Money spent out of order is usually spent twice.',
    ],
    uses: [
      ['🧾', 'Splitting a budget', 'Give roughly a third to the shell and door, a sixth to air, a fifth each to treatment and speakers, and keep a tenth back.'],
      ['📅', 'Booking trades', 'Mason and carpenter for the shell, then the air-conditioning installer, then electrician, then treatment, then equipment.'],
      ['🔁', 'Upgrading an existing room', 'Walk the same order and fix the first weak layer you find before touching anything later in the list.'],
    ],
    tryit: [
      'Write your budget at the top of a page and split it across the five steps before looking at any product.',
      'In your room, turn everything off and listen for one minute. Write down every noise you hear and which step would remove it.',
      'Ask of every planned purchase: which earlier step does this depend on, and is that step done?',
    ],
    slip: ['Buying speakers and foam first because they are the fun part.', 'Work outside-in: shell, door, air, treatment, speakers. Keep ten percent of the money unspent until the end.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-factors', {
    title: 'the handsome felt tiles that left the boom',
    plain: 'A treatment only works on sounds whose waves are short enough for its depth. Thin panels tame hiss and brightness; only deep panels, with air behind them, reach the bass.',
    where: 'A 5 × 4 m living room used for listening',
    story: `<p>Arjun covers a third of his walls with smart 12 mm felt tiles. Claps sound tighter and voices clearer, so he is pleased, until he plays music with a bass guitar. The low notes still hang on for over a second. He measures: the middle of the range has dropped from 0.9 s to 0.6 s, but the bass has not moved at all.</p>
      <p>The reason is size. A 125 Hz wave is 2.7 m long and simply does not notice a 12 mm tile. He builds four 100 mm panels, stands them 100 mm off the wall in the corners behind the same grey fabric, and the bass finally comes down. The room looks almost the same.</p>`,
    numbers: [['Wavelength at 125 Hz', '343 ÷ 125 ≈ 2.7 m'], ['Wavelength at 4 kHz', '343 ÷ 4000 ≈ 86 mm'], ['12 mm tile: works well above', 'about 2 kHz'], ['100 mm panel + 100 mm gap: works from', 'about 150–200 Hz'], ['Bass decay before → after', '1.1 s → 0.6 s']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Short and long sound waves meeting a thin tile and a deep panel with an air gap">
      <rect x="560" y="30" width="24" height="200" fill="var(--muted)"/>
      <text x="572" y="248" text-anchor="middle" font-size="13">wall</text>
      <g data-step="1-3"><rect x="548" y="30" width="12" height="200" fill="var(--c3)"/></g>
      <g data-step="=1"><text x="300" y="40" text-anchor="middle" font-size="14">a 12 mm tile on the wall</text></g>
      <g data-step="=2"><path d="M60 100 ${Array.from({ length: 20 }, (_, i) => `q6 ${i % 2 ? 18 : -18} 12 0`).join(' ')} h240" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-flow"/>
        <text x="300" y="60" text-anchor="middle" font-size="14">short waves (treble): soaked up</text>
        <circle cx="548" cy="100" r="8" fill="var(--good)" class="rl-pulse"/></g>
      <g data-step="=3"><path d="M60 150 q60 -60 120 0 t120 0 t120 0 t120 0" fill="none" stroke="var(--c1)" stroke-width="3" class="rl-flow slow"/>
        <path d="M540 190 q-60 40 -120 0 t-120 0 t-120 0" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-flow slow"/>
        <text x="300" y="60" text-anchor="middle" font-size="14" fill="var(--bad)">2.7 m bass wave: bounces straight back</text></g>
      <g data-step="4"><rect x="440" y="30" width="60" height="200" fill="var(--c3)" opacity=".85"/>
        <rect x="500" y="30" width="60" height="200" fill="none" stroke="var(--line)" stroke-dasharray="4 4"/>
        <rect x="434" y="30" width="6" height="200" fill="var(--c4)"/></g>
      <g data-step="=4"><text x="470" y="20" text-anchor="middle" font-size="12">100 mm</text><text x="530" y="20" text-anchor="middle" font-size="12">air gap</text>
        <text x="230" y="60" text-anchor="middle" font-size="14">deep panel, spaced off the wall</text></g>
      <g data-step="=5"><path d="M60 150 q60 -60 120 0 t120 0 t120 0" fill="none" stroke="var(--c1)" stroke-width="3" class="rl-flow slow"/>
        <circle cx="470" cy="150" r="14" fill="var(--good)" class="rl-pulse"/>
        <text x="230" y="60" text-anchor="middle" font-size="14" fill="var(--good)">bass now loses energy in the depth</text>
        <text x="230" y="230" text-anchor="middle" font-size="13">same fabric face, same look</text></g>
    </svg>`,
    steps: [
      ['A thin, good-looking finish', 'Felt, thin foam, carpet and curtains against the wall are all only millimetres deep.'],
      ['Treble is absorbed', 'High notes have waves a few centimetres long. The air rubs back and forth inside the fibres and gives up its energy.'],
      ['Bass ignores it', 'A bass wave is metres long. Right at a wall the air hardly moves, so a thin layer there has nothing to rub against.'],
      ['Add depth and a gap', 'A thick panel held away from the wall sits where the air in a bass wave is actually moving.'],
      ['Now the whole range is treated', 'With deep absorbers in the corners, bass and treble decay at a similar rate. The fabric on the front can stay exactly as it was.'],
    ],
    why: [
      'Absorbers work by friction on moving air. Air moves most a quarter of a wavelength from a wall, which for bass is half a metre or more into the room.',
      'Over-treating treble while leaving bass makes a room sound dull and boomy at once, which is worse than doing nothing.',
      'Looks and performance are separate layers: the fabric is the look, the depth behind it is the performance.',
    ],
    uses: [
      ['🛋️', 'Living room listening', 'Put the deep panels in corners and behind the sofa; keep thin decorative pieces for flutter between bare parallel walls.'],
      ['🎙️', 'Podcast corner', 'Speech needs control from about 125 Hz up: use 100 mm panels, not 12 mm tiles.'],
      ['🏢', 'Office or café ceiling', 'Hang panels with a gap above them; the gap adds low-mid absorption at no cost.'],
    ],
    tryit: [
      'Hum a low note, then hiss “sss”, facing a thick curtain from 20 cm. The hiss changes clearly; the hum hardly at all.',
      'Divide 343 by any frequency to get its wavelength in metres. Do it for 60, 250 and 4000 Hz and compare with your treatment depth.',
      'Clap, then play a short bass note from a speaker, and listen to which one rings longer in your room.',
    ],
    slip: ['Judging a treatment by a hand clap, which only tests the treble.', 'Check the bass separately, and choose depth from the lowest frequency you need to control: roughly a tenth of its wavelength or more.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-connect', {
    title: 'one 50 mm hole in a 60 dB wall',
    plain: 'Cables must pass between rooms, but sound will happily use the same route. A cable path has to be bent, packed and sealed so that wires get through and air does not.',
    where: 'The wall between a control room and a live room',
    story: `<p>The wall between Dev’s two rooms was built carefully and tested at about 60 dB. Then the installer drilled a neat 50 mm hole straight through for the microphone multicore and left it open “for future cables”. The next test showed 37 dB. Speech from the live room was plainly audible at the desk.</p>
      <p>The hole was filled and replaced with two conduits that enter low on one side, bend twice inside the wall cavity and come out a metre along on the other side. The cables were pulled, the conduits packed with mineral wool and capped with flexible sealant. The wall went back to 59 dB.</p>`,
    numbers: [['Wall area', '10 m²'], ['Hole area', 'π × 0.025² ≈ 0.002 m²'], ['Hole as a share of the wall', '0.02 %'], ['Wall alone', '60 dB'], ['Wall with the open hole', '≈ 37 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Section through a double wall with an open cable hole, then with an offset packed conduit">
      <text x="110" y="34" text-anchor="middle" font-size="14">LIVE ROOM</text><text x="530" y="34" text-anchor="middle" font-size="14">CONTROL ROOM</text>
      <rect x="270" y="46" width="34" height="184" fill="var(--muted)"/><rect x="336" y="46" width="34" height="184" fill="var(--muted)"/>
      <rect x="304" y="46" width="32" height="184" fill="var(--c3)" opacity=".35"/>
      <circle cx="110" cy="130" r="12" fill="none" stroke="var(--c1)" stroke-width="3" class="rl-grow"/><circle cx="110" cy="130" r="6" fill="var(--c1)"/>
      <g data-step="=1"><text x="320" y="252" text-anchor="middle" font-size="13">two heavy leaves, wool between: 60 dB</text>
        <path d="M130 130 H262" stroke="var(--c1)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="2-3"><rect x="268" y="150" width="104" height="16" fill="var(--panel2)" stroke="var(--bad)" stroke-width="2"/>
        <path d="M150 158 H268" stroke="var(--text)" stroke-width="4"/><path d="M372 158 H500" stroke="var(--text)" stroke-width="4"/></g>
      <g data-step="=2"><text x="320" y="252" text-anchor="middle" font-size="13">a straight 50 mm hole for the cable</text></g>
      <g data-step="=3"><path d="M130 146 H520" stroke="var(--bad)" stroke-width="4" class="rl-flow"/>
        <text x="320" y="252" text-anchor="middle" font-size="13" fill="var(--bad)">sound takes the hole: 37 dB</text></g>
      <g data-step="4"><path d="M150 200 H286 V184 H320 V96 H354 V80 H500" fill="none" stroke="var(--c2)" stroke-width="10"/>
        <path d="M150 200 H286 V184 H320 V96 H354 V80 H500" fill="none" stroke="var(--text)" stroke-width="3"/>
        <rect x="258" y="190" width="14" height="20" fill="var(--c4)"/><rect x="368" y="70" width="14" height="20" fill="var(--c4)"/></g>
      <g data-step="=4"><text x="320" y="252" text-anchor="middle" font-size="13">offset conduit: in low, out high</text></g>
      <g data-step="=5"><circle cx="320" cy="140" r="9" fill="var(--good)" class="rl-pulse"/><circle cx="265" cy="200" r="8" fill="var(--good)" class="rl-pulse d2"/><circle cx="375" cy="80" r="8" fill="var(--good)" class="rl-pulse d3"/>
        <path d="M130 130 H262" stroke="var(--c1)" stroke-width="3" class="rl-flow"/>
        <text x="320" y="252" text-anchor="middle" font-size="13" fill="var(--good)">packed and sealed: back to 59 dB</text></g>
    </svg>`,
    steps: [
      ['A good wall', 'Two heavy leaves that do not touch, with absorbent in the gap. Sound has to shake one leaf, cross the gap and shake the next.'],
      ['A convenient hole', 'A straight sleeve is drilled through both leaves at the same spot so cables can be pulled easily.'],
      ['Sound takes the shortcut', 'Air in the hole connects the rooms directly. A hole of two thousandths of a square metre lets through more sound than the other ten square metres together.'],
      ['Offset the path', 'Enter one leaf low, travel inside the cavity, leave the other leaf somewhere else. There is no longer any straight line through.'],
      ['Pack and seal', 'Stuff the conduit ends with mineral wool around the cables and cap them with flexible sealant. Wires pass, air does not.'],
    ],
    why: [
      'Isolation is counted in fractions let through. A 60 dB wall passes one millionth; an open hole passes everything that hits it, so even a tiny hole dominates.',
      'Bends force sound to reflect off lined surfaces several times, losing energy at each turn, while a cable bends without complaint.',
      'Flexible sealant stays airtight when the building moves; hard filler cracks and the leak returns.',
    ],
    uses: [
      ['🎚️', 'Studio tie-lines', 'Fit wall panels on each side at different positions, joined by a packed, bent conduit; never back to back.'],
      ['🔌', 'Sockets in a party wall', 'Stagger socket boxes by at least one stud bay and wrap the backs with sealing putty.'],
      ['🖥️', 'Home office', 'A network cable through a wall: drill at a downward angle, pull the cable, then fill the hole fully with flexible sealant.'],
    ],
    tryit: [
      'Close a door and listen to a radio on the other side. Then cover the keyhole or the gap under the door with a folded towel and listen again.',
      'Look for existing cable holes, pipe entries and back-to-back sockets in your walls and list them.',
      'Work out a hole’s share of a wall: area of the hole divided by area of the wall. Notice how small a share causes a big loss.',
    ],
    slip: ['Leaving a spare open sleeve “for later”.', 'Every opening is packed and sealed on the day it is made. A spare conduit is capped at both ends until it is used.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-standards', {
    title: 'one wall, two reports, two different numbers',
    plain: 'A standard is an agreed way of measuring. Two numbers can only be compared if they were measured the same way, so always read the letters in front of the number, not just the number.',
    where: 'A rehearsal room being let in a converted warehouse',
    story: `<p>The brochure for Farah’s new rehearsal room says the dividing wall is “R<sub>w</sub> 55”. After moving in she pays for a test between her room and next door, and the report says “D<sub>nT,w</sub> 47”. She assumes she has been cheated out of 8 dB.</p>
      <p>She has not. The 55 is how the wall panel performed in a laboratory, where sound can only go through the panel itself. The 47 is what the two real rooms achieve, where sound also runs through the shared floor, the ceiling void and the side walls. And because her band is bass-heavy, the figure that predicts what the neighbour hears is lower again: the same wall with the low-frequency correction is about 48.</p>`,
    numbers: [['Lab rating of the wall panel', 'Rw 55'], ['Measured between the real rooms', 'DnT,w 47'], ['Lost to other paths', '55 − 47 = 8 dB'], ['Lab rating with bass correction (Ctr −7)', '55 − 7 = 48'], ['Typical lab-to-site drop', '5–8 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A wall tested in a laboratory with one sound path, and the same wall in a building with extra paths through floor and ceiling">
      <text x="160" y="28" text-anchor="middle" font-size="14">LABORATORY</text><text x="480" y="28" text-anchor="middle" font-size="14">REAL BUILDING</text>
      <rect x="30" y="50" width="120" height="150" fill="var(--panel)" stroke="var(--muted)" stroke-width="6"/><rect x="170" y="50" width="120" height="150" fill="var(--panel)" stroke="var(--muted)" stroke-width="6"/>
      <rect x="150" y="70" width="20" height="110" fill="var(--c2)"/>
      <rect x="350" y="50" width="260" height="150" fill="var(--panel)" stroke="var(--muted)" stroke-width="4"/>
      <rect x="472" y="50" width="16" height="150" fill="var(--c2)"/>
      <rect x="350" y="200" width="260" height="12" fill="var(--muted)"/><rect x="350" y="38" width="260" height="12" fill="var(--muted)"/>
      <circle cx="80" cy="125" r="7" fill="var(--c1)"/><circle cx="400" cy="125" r="7" fill="var(--c1)"/>
      <circle cx="80" cy="125" r="12" fill="none" stroke="var(--c1)" stroke-width="2.5" class="rl-grow"/><circle cx="400" cy="125" r="12" fill="none" stroke="var(--c1)" stroke-width="2.5" class="rl-grow d2"/>
      <g data-step="=1"><text x="160" y="232" text-anchor="middle" font-size="13">rooms share nothing but the panel</text></g>
      <g data-step="2"><path d="M92 125 H240" stroke="var(--c1)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=2"><text x="160" y="232" text-anchor="middle" font-size="13">one path only: Rw 55</text></g>
      <g data-step="3"><path d="M412 125 H560" stroke="var(--c1)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=3"><text x="480" y="232" text-anchor="middle" font-size="13">same wall, same direct path</text></g>
      <g data-step="4"><path d="M410 140 Q440 206 480 206 T550 140" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-flow"/>
        <path d="M410 110 Q440 44 480 44 T550 110" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=4"><text x="480" y="232" text-anchor="middle" font-size="13" fill="var(--bad)">plus floor and ceiling paths</text></g>
      <g data-step="=5"><text x="160" y="232" text-anchor="middle" font-size="13">Rw 55 = the product</text>
        <text x="480" y="232" text-anchor="middle" font-size="13" fill="var(--good)">DnT,w 47 = what you live with</text>
        <text x="320" y="252" text-anchor="middle" font-size="13" fill="var(--muted)">both honest, not the same question</text></g>
    </svg>`,
    steps: [
      ['The laboratory', 'Two rooms are built so that they touch only through the test opening. Whatever is fitted in the opening is the only way through.'],
      ['The lab number', 'The result, R with a small w, rates the wall product itself. It is the best that wall can ever do.'],
      ['The same wall on site', 'Built into a real building, the wall still passes the same small amount directly.'],
      ['The other paths', 'Sound also travels along the floor, the ceiling and the side walls, around the wall. These flanking paths add to what arrives.'],
      ['The site number', 'A field test, D with nT and w, measures everything that arrives. It is lower, and it is the one that matches what people hear.'],
    ],
    why: [
      'A wall rating and a room-to-room rating answer different questions: “how good is this product?” and “how much will I hear next door?”.',
      'Single numbers are weighted towards speech. Music and traffic have more bass, so a correction is added to give a fairer, lower figure.',
      'Standards exist so a test in one place can be repeated in another. That only works if the method named on the report is the same.',
    ],
    uses: [
      ['📄', 'Reading a quotation', 'Check whether a promised figure is a lab rating of the wall or a site result between rooms; allow 5–8 dB between them.'],
      ['🎸', 'Bass-heavy sources', 'Ask for the rating with its low-frequency correction, or the full table of results from 50 Hz upward.'],
      ['✍️', 'Writing a specification', 'State the quantity, the standard and where it is measured: for example “at least DnT,w 60 between rooms A and B, tested on completion”.'],
    ],
    tryit: [
      'Find any product data sheet with a sound rating. Write down the letters before the number and the standard it quotes.',
      'Take a real pair of rooms you know. List every surface they share besides the dividing wall: floor, ceiling, corridor wall, window wall.',
      'Rewrite the vague sentence “the room will be soundproof” as one line with a quantity, a number and a test.',
    ],
    slip: ['Comparing an American STC, a European Rw and a site DnT,w as if they were the same scale.', 'Compare like with like. If the letters differ, ask for the test report and read which standard and which paths it covers.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-india', {
    title: 'the brick room that grew mould in July',
    plain: 'A plastered brick wall is a gift for blocking sound, but in a humid climate anything soft pressed against an outside wall will get damp. Leave a small air gap, use materials that do not mind moisture, and keep the room dry with the air-conditioner.',
    where: 'A ground-floor room in Chennai, one wall facing outside',
    story: `<p>Suresh lines his 230 mm brick room with mineral wool held behind plywood and cotton fabric, fixed straight onto the walls on untreated wood battens. It sounds good in March. By late July, with the outside air at 85 % humidity, the outside wall smells musty, black spots show through the fabric and the cloth hangs in ripples.</p>
      <p>The rebuild on that wall is simple: treated battens set 25 mm off the brick so the wall can breathe, wool kept off the masonry, a polyester face fabric, and the air-conditioner run on its dry setting for an hour each day in the monsoon. The brick still does the heavy work of isolation; it just needed keeping dry.</p>`,
    numbers: [['230 mm brick, plastered both sides', 'about 460 kg/m²'], ['Sound blocked by that wall', 'around 50 dB'], ['Monsoon air outside', '80–90 % humidity'], ['Target inside', '45–60 % humidity'], ['Air gap behind the lining', '25 mm']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Section of an outside brick wall with a lining, showing moisture in monsoon and a ventilated gap as the fix">
      <text x="90" y="30" text-anchor="middle" font-size="14">OUTSIDE</text><text x="520" y="30" text-anchor="middle" font-size="14">ROOM</text>
      <rect x="200" y="44" width="90" height="186" fill="var(--c1)" opacity=".8"/>
      ${Array.from({ length: 6 }, (_, i) => `<line x1="200" y1="${74 + i * 30}" x2="290" y2="${74 + i * 30}" stroke="var(--panel)" stroke-width="2"/>`).join('')}
      <text x="245" y="250" text-anchor="middle" font-size="13">brick</text>
      <g data-step="=1"><path d="M60 137 H190" stroke="var(--c2)" stroke-width="3" class="rl-flow"/><path d="M190 150 H90" stroke="var(--c2)" stroke-width="2" class="rl-flow slow"/>
        <text x="120" y="120" text-anchor="middle" font-size="13">traffic noise</text><text x="470" y="140" text-anchor="middle" font-size="13">heavy wall: about −50 dB</text></g>
      <g data-step="2-3"><rect x="290" y="44" width="50" height="186" fill="var(--c3)" opacity=".6"/><rect x="340" y="44" width="8" height="186" fill="var(--c4)"/></g>
      <g data-step="=2">${Array.from({ length: 5 }, (_, i) => `<circle cx="${70 + i * 28}" cy="${90 + (i % 2) * 70}" r="5" fill="var(--accent2)" class="rl-slide" style="--dx:70px"/>`).join('')}
        <text x="110" y="200" text-anchor="middle" font-size="13">monsoon: 85 % humidity</text><text x="470" y="140" text-anchor="middle" font-size="13">wool pressed on the brick</text></g>
      <g data-step="=3"><rect x="290" y="44" width="50" height="186" fill="var(--bad)" opacity=".35" class="rl-pulse"/>
        <path d="M352 60 q10 40 0 80 t0 80" fill="none" stroke="var(--bad)" stroke-width="3"/>
        <text x="470" y="130" text-anchor="middle" font-size="13" fill="var(--bad)">damp wool, mould,</text><text x="470" y="148" text-anchor="middle" font-size="13" fill="var(--bad)">cotton sags</text></g>
      <g data-step="4"><rect x="290" y="44" width="16" height="186" fill="none" stroke="var(--good)" stroke-width="2" stroke-dasharray="4 4"/>
        <rect x="306" y="44" width="50" height="186" fill="var(--c3)" opacity=".6"/><rect x="356" y="44" width="6" height="186" fill="var(--c4)"/></g>
      <g data-step="=4"><path d="M298 226 V50" stroke="var(--good)" stroke-width="2.5" class="rl-flow slow"/>
        <text x="480" y="130" text-anchor="middle" font-size="13">25 mm gap, treated battens,</text><text x="480" y="148" text-anchor="middle" font-size="13">polyester fabric</text></g>
      <g data-step="5"><rect x="560" y="50" width="60" height="22" rx="4" fill="var(--c2)"/></g>
      <g data-step="=5"><path d="M570 76 V120 M590 76 V120 M610 76 V120" stroke="var(--c2)" stroke-width="2.5" class="rl-flow slow"/>
        <text x="480" y="150" text-anchor="middle" font-size="13" fill="var(--good)">dry mode: room at 50–55 %</text></g>
    </svg>`,
    steps: [
      ['Brick does the isolation', 'A thick plastered brick wall is heavy, and heavy walls block sound. This part of Indian construction is an advantage.'],
      ['The monsoon arrives', 'Outside air carries a lot of water. An outside wall is cooler on the room side when the air-conditioner runs, so moisture collects there.'],
      ['Soft materials suffer', 'Wool pressed on the damp wall stays wet. Untreated wood and cotton feed mould, and cotton stretches when humid, so the fabric ripples.'],
      ['Let the wall breathe', 'A small gap behind the lining lets the wall dry. Treated or metal framing and polyester cloth are not bothered by humidity.'],
      ['Dry the room', 'The air-conditioner removes water as well as heat. Keeping the room near 50 % protects the treatment, the instruments and the electronics.'],
    ],
    why: [
      'Water moves from damp air towards cool surfaces. Anything absorbent at that surface becomes a sponge.',
      'Mineral wool itself does not rot, but a wet absorber loses performance and the dust and wood around it grow mould.',
      'Polyester fibres take up almost no water, so the cloth stays the same length in March and in July.',
    ],
    uses: [
      ['🧱', 'Lining an outside wall', 'Keep absorbers 25 mm off the masonry on treated battens, and fix any seepage before closing the wall.'],
      ['🪟', 'Windows and doors', 'Use uPVC or well-sealed hardwood frames; swollen timber stops seals from closing in the monsoon.'],
      ['❄️', 'Running the room', 'Run the air-conditioner’s dry mode before and after sessions in humid months, and keep a small humidity meter on the desk.'],
    ],
    tryit: [
      'Tape a 30 cm square of clear plastic tightly to an outside wall for two days. Water droplets underneath mean that wall is damp.',
      'Buy or borrow a small humidity meter and note the reading morning and evening for a week.',
      'Touch each wall of your room on a humid day. The coolest, clammiest one is the wall that needs the gap.',
    ],
    slip: ['Copying a dry-climate wall detail: wool and cotton fixed tight against an outside masonry wall.', 'Add an air gap, moisture-proof framing and polyester fabric on outside walls, and control humidity with the air-conditioner.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-building-types', {
    title: 'the restaurant where nobody could hear the waiter',
    plain: 'In a hard-surfaced room every voice lingers, so people raise their voices over it, which makes everyone else do the same. Soaking up the lingering sound, usually at the ceiling, breaks the loop.',
    where: 'An 80-seat restaurant, 12 × 8 m with a 3.2 m ceiling',
    story: `<p>Leela’s new restaurant has a polished concrete floor, glass front and plaster ceiling. On a full Friday the noise is so high that waiters lean in to take orders and guests leave early. A clap test when the room is empty rings for about 1.6 seconds.</p>
      <p>She cannot carpet the floor or cover the glass, but the ceiling is free. Sixty square metres of sound-absorbing panels go up between the lights. The ring drops to about 0.6 seconds. On the next full night the room is not just a few decibels quieter; people have stopped shouting, because they no longer need to.</p>`,
    numbers: [['Room volume', '12 × 8 × 3.2 ≈ 307 m³'], ['Absorption before (RT 1.6 s)', '0.161 × 307 ÷ 1.6 ≈ 31 m²'], ['Added: 60 m² of panel at 0.8', '48 m²'], ['New reverberation time', '0.161 × 307 ÷ 79 ≈ 0.6 s'], ['Drop in built-up noise', '10 log(79 ÷ 31) ≈ 4 dB, plus quieter talkers']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Section of a restaurant with tables: voices reflecting off a hard ceiling, then absorbed by ceiling panels">
      <rect x="40" y="40" width="560" height="180" fill="var(--panel)" stroke="var(--muted)" stroke-width="4"/>
      ${[130, 320, 510].map((x) => `<rect x="${x - 34}" y="176" width="68" height="6" fill="var(--c4)"/><rect x="${x - 3}" y="182" width="6" height="36" fill="var(--c4)"/>
        <circle cx="${x - 50}" cy="160" r="9" fill="var(--c1)"/><circle cx="${x + 50}" cy="160" r="9" fill="var(--c2)"/>`).join('')}
      <g data-step="=1"><path d="M90 158 H160" stroke="var(--c1)" stroke-width="3" class="rl-flow"/>
        <text x="320" y="246" text-anchor="middle" font-size="13">one table talking: easy to hear</text></g>
      <g data-step="2-3"><path d="M84 150 L200 46 L330 150" fill="none" stroke="var(--bad)" stroke-width="2.5" class="rl-flow"/>
        <path d="M274 150 L400 46 L520 150" fill="none" stroke="var(--bad)" stroke-width="2.5" class="rl-flow d2"/>
        <path d="M464 150 L330 46 L190 150" fill="none" stroke="var(--bad)" stroke-width="2.5" class="rl-flow rev"/></g>
      <g data-step="=2"><text x="320" y="246" text-anchor="middle" font-size="13">hard ceiling: every voice reaches every table</text></g>
      <g data-step="=3">${[80, 270, 460].map((x, i) => `<circle cx="${x}" cy="160" r="12" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow ${i ? 'd' + (i + 1) : ''}"/>`).join('')}
        <text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--bad)">so everyone talks louder, and louder</text></g>
      <g data-step="4"><rect x="80" y="50" width="150" height="12" rx="3" fill="var(--c3)"/><rect x="250" y="50" width="150" height="12" rx="3" fill="var(--c3)"/><rect x="420" y="50" width="150" height="12" rx="3" fill="var(--c3)"/></g>
      <g data-step="=4"><path d="M84 150 L190 66" fill="none" stroke="var(--good)" stroke-width="2.5" class="rl-flow"/><path d="M274 150 L380 66" fill="none" stroke="var(--good)" stroke-width="2.5" class="rl-flow"/>
        <circle cx="190" cy="60" r="7" fill="var(--good)" class="rl-pulse"/><circle cx="380" cy="60" r="7" fill="var(--good)" class="rl-pulse d2"/>
        <text x="320" y="246" text-anchor="middle" font-size="13">60 m² of absorbing ceiling</text></g>
      <g data-step="=5"><path d="M90 158 H160" stroke="var(--c1)" stroke-width="3" class="rl-flow"/><path d="M280 158 H350" stroke="var(--c1)" stroke-width="3" class="rl-flow"/><path d="M470 158 H540" stroke="var(--c1)" stroke-width="3" class="rl-flow"/>
        <text x="320" y="246" text-anchor="middle" font-size="13" fill="var(--good)">voices stay at their own table</text></g>
    </svg>`,
    steps: [
      ['A quiet moment', 'With one table talking, speech crosses the table directly and is easy to follow.'],
      ['The room fills', 'Each voice also bounces off the hard ceiling, floor and glass and arrives at every other table as a blur.'],
      ['The shouting loop', 'To be heard over the blur, people speak up. That raises the blur, so others speak up too. Levels climb until people give up.'],
      ['Treat the ceiling', 'The ceiling is the largest surface nothing else needs. Absorbing panels there catch each voice on its first bounce.'],
      ['The loop breaks', 'With less lingering sound, people can talk normally and still be understood, so the room settles far lower than the panels alone would predict.'],
    ],
    why: [
      'Reverberation time is set by room volume divided by total absorption. You cannot change the volume, so you add absorption.',
      'People automatically raise their voices by about half of any rise in background noise. Lowering the background a little therefore lowers it a lot.',
      'Different buildings need different targets: a restaurant wants conversation at a table, a classroom wants one voice to carry, a concert hall wants sound to bloom.',
    ],
    uses: [
      ['🍽️', 'Cafés and restaurants', 'Aim for about 0.5–0.8 s when furnished; treat at least half the ceiling area if the floor and walls must stay hard.'],
      ['🏫', 'Classrooms', 'Aim for about 0.4–0.6 s so every child hears consonants; an absorbing ceiling plus a pinboard rear wall often does it.'],
      ['🏢', 'Open offices', 'Absorbing ceiling first, then screens between desks; add gentle background sound for privacy.'],
    ],
    tryit: [
      'Clap once in an empty restaurant, a classroom and a carpeted bedroom. Count “one-thousand” until the sound has gone, and compare.',
      'Estimate your room’s volume, then use 0.161 × volume ÷ reverberation time to find how much absorption it has now.',
      'In a noisy café, notice how loudly you are speaking. Step outside and say the same sentence: that difference is the loop.',
    ],
    slip: ['Hanging a few decorative panels on one wall and expecting a noisy room to calm down.', 'Work out the area needed from the volume and target time, and use the ceiling, where a large area fits without being touched or blocked.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-building-services', {
    title: 'the hiss that came out of the grille',
    plain: 'Air-conditioning makes noise in three ways: the fan’s own noise travels along the duct, the machine’s vibration travels through the building, and fast air hisses at the grille. Each needs its own fix.',
    where: 'A small recording room served by a fan unit in the corridor ceiling',
    story: `<p>Imran’s new vocal room is well sealed, so every take now has a steady “shhh” and a low hum under it. The contractor suggests thicker walls. Imran switches the fan off for ten seconds and the room is silent: the walls are fine, the noise is arriving with the air.</p>
      <p>Three small changes fix it. A flexible sleeve and spring hangers stop the fan unit shaking the duct and ceiling. Two metres of lined duct with one bend swallow the fan’s rumble. And the tiny grille is replaced with a large one, so the same amount of air enters slowly instead of whistling through a slot.</p>`,
    numbers: [['Air needed', '150 litres per second'], ['Old grille opening', '0.02 m²  →  7.5 m/s'], ['New grille opening', '0.075 m²  →  2 m/s'], ['Air hiss at the grille', 'roughly 30 dB lower'], ['Rule for quiet rooms', 'keep grille air under about 2 m/s']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A fan unit feeding a room through a duct, with fixes: flexible connector, spring hangers, lined bend and a large grille">
      <rect x="360" y="110" width="250" height="120" fill="var(--panel)" stroke="var(--muted)" stroke-width="4"/>
      <text x="485" y="250" text-anchor="middle" font-size="13">recording room</text>
      <circle cx="520" cy="180" r="9" fill="var(--c4)"/><rect x="512" y="190" width="16" height="36" rx="5" fill="var(--c4)"/>
      <line x1="30" y1="40" x2="610" y2="40" stroke="var(--muted)" stroke-width="5"/>
      <rect x="50" y="60" width="90" height="56" rx="6" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
      <g class="rl-spin"><path d="M95 72 V104 M79 88 H111" stroke="var(--c2)" stroke-width="4"/></g>
      <text x="95" y="136" text-anchor="middle" font-size="13">fan unit</text>
      <path d="M140 76 H400 V110" fill="none" stroke="var(--text)" stroke-width="2"/><path d="M140 100 H376 V110" fill="none" stroke="var(--text)" stroke-width="2"/>
      <g data-step="=1"><path d="M146 88 H386 V140" fill="none" stroke="var(--c2)" stroke-width="3" class="rl-flow"/>
        <text x="260" y="66" text-anchor="middle" font-size="13">air travels to the room</text></g>
      <g data-step="=2"><path d="M146 88 H386 V150" fill="none" stroke="var(--bad)" stroke-width="5" class="rl-flow"/>
        <text x="260" y="66" text-anchor="middle" font-size="13" fill="var(--bad)">fan rumble rides along the duct</text></g>
      <g data-step="=3"><g class="rl-shake"><line x1="70" y1="40" x2="70" y2="60" stroke="var(--bad)" stroke-width="4"/><line x1="120" y1="40" x2="120" y2="60" stroke="var(--bad)" stroke-width="4"/></g>
        <path d="M130 40 H420 V108" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-flow"/>
        <text x="270" y="30" text-anchor="middle" font-size="13" fill="var(--bad)">vibration runs through the slab</text></g>
      <g data-step="=4"><rect x="376" y="112" width="24" height="8" fill="var(--bad)"/>
        <path d="M388 124 l-16 30 M388 124 l0 34 M388 124 l16 30" stroke="var(--bad)" stroke-width="2.5" class="rl-pulse"/>
        <text x="520" y="98" text-anchor="middle" font-size="13" fill="var(--bad)">small grille: 7.5 m/s hiss</text></g>
      <g data-step="5"><path d="M70 40 q-6 5 0 10 t0 10" fill="none" stroke="var(--good)" stroke-width="3"/><path d="M120 40 q-6 5 0 10 t0 10" fill="none" stroke="var(--good)" stroke-width="3"/>
        <rect x="140" y="74" width="22" height="28" fill="var(--good)" opacity=".7"/>
        <rect x="220" y="70" width="120" height="6" fill="var(--c3)"/><rect x="220" y="100" width="120" height="6" fill="var(--c3)"/>
        <rect x="360" y="112" width="70" height="8" fill="var(--good)"/></g>
      <g data-step="=5"><path d="M370 126 V156 M395 126 V156 M420 126 V156" stroke="var(--good)" stroke-width="2" class="rl-flow slow"/>
        <text x="280" y="130" text-anchor="middle" font-size="12">lined duct</text><text x="150" y="160" text-anchor="middle" font-size="12">flexible sleeve, springs</text>
        <text x="525" y="98" text-anchor="middle" font-size="13" fill="var(--good)">big grille: 2 m/s, silent</text></g>
    </svg>`,
    steps: [
      ['Air has to get in', 'A sealed room needs cooled, fresh air. It arrives through a duct from a fan somewhere nearby.'],
      ['Path one: down the duct', 'A duct is a speaking tube. Fan noise travels inside it straight to the room, however thick the walls are.'],
      ['Path two: through the building', 'The fan unit vibrates. If it is bolted hard to the ceiling, the slab and the duct carry that hum into the room’s surfaces.'],
      ['Path three: made at the grille', 'Force air quickly through a small opening and it becomes turbulent. That turbulence is the hiss, and it is created inside the room.'],
      ['Three matching fixes', 'Springs and a flexible sleeve stop vibration; a lined duct with a bend absorbs fan noise; a large grille lets air in slowly and quietly.'],
    ],
    why: [
      'Noise made by moving air rises very steeply with speed: halving the air speed cuts it by roughly 15–18 dB.',
      'Lining works because sound in a duct keeps striking the walls; a bend forces even the straight-through sound to hit the lining.',
      'A spring between a machine and the building lets the machine shake without passing the shaking on.',
    ],
    uses: [
      ['🎙️', 'Vocal and voice-over rooms', 'Size grilles for 1.5–2 m/s and put the fan unit outside the room on springs.'],
      ['🛏️', 'Bedrooms and hotel rooms', 'A rattling ceiling near the indoor unit usually means it is hung rigidly: ask for anti-vibration hangers.'],
      ['🏫', 'Classrooms and meeting rooms', 'If speech is hard to follow only when the air is on, the grilles are too small or the fan speed too high.'],
    ],
    tryit: [
      'Switch your air-conditioner or fan off for ten seconds while recording on your phone. Listen to the recording: the change is your services noise.',
      'Hold a strip of tissue 10 cm below a supply grille. Gentle flutter is fine; pulled out straight means the air is fast enough to hiss.',
      'Rest your fingertips on the wall beside an indoor unit. A buzz you can feel is vibration that needs soft mounts, not a thicker wall.',
    ],
    slip: ['Trying to cure air-conditioning noise by adding wall mass or more acoustic panels.', 'Find which of the three paths it is first (duct, structure or grille), then fix that path at its source.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-design-language', {
    title: 'reading a photograph of a calm room',
    plain: 'The best studios look like plain, quiet rooms because the working parts are hidden behind fabric. If you learn where to look, a single photo tells you how deep the treatment is and where everything sits.',
    where: 'A producer studying a photo before planning a 3.6 m wide room',
    story: `<p>Kavya keeps a photo of a mix room she loves: soft grey walls, a timber floor, a sofa, nothing that looks like “acoustics”. She starts counting. The walls have fine vertical joints every 1.2 m, so they are fabric bays, not plaster. At the door, the wall is about 400 mm thick, so there is real depth behind the cloth. The front corners are cut off at an angle. The ceiling has a slim slot instead of a grille.</p>
      <p>She draws the same idea for her own room. Giving up 300 mm on each side leaves 3.0 m clear, and behind one plain skin she can fit side absorbers, deep corner traps and the rear-wall trap. The room will be smaller on the tape measure and far bigger in sound.</p>`,
    numbers: [['Joint spacing seen', '1.2 m (one cloth width per bay)'], ['Wall depth seen at the door', 'about 400 mm'], ['Her room: width before → after', '3.6 m → 3.0 m'], ['Depth given to each side wall', '300 mm'], ['300 mm of absorber is useful down to', 'about 150 Hz']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Plan of a room with a plain fabric skin that fades to reveal absorbers, corner traps, a rear trap and hidden loudspeakers">
      <rect x="60" y="30" width="520" height="200" fill="var(--panel)" stroke="var(--muted)" stroke-width="6"/>
      <rect x="150" y="60" width="18" height="26" rx="3" fill="var(--text)"/><rect x="150" y="174" width="18" height="26" rx="3" fill="var(--text)"/>
      <circle cx="330" cy="130" r="11" fill="var(--c4)"/>
      <rect x="470" y="96" width="34" height="68" rx="8" fill="var(--c4)" opacity=".5"/>
      <g data-step="1-2"><path d="M130 44 H520 V216 H130 Z" fill="none" stroke="var(--c2)" stroke-width="3"/>
        <path d="M100 74 L130 44 M100 186 L130 216" stroke="var(--c2)" stroke-width="3"/><line x1="100" y1="74" x2="100" y2="186" stroke="var(--c2)" stroke-width="3"/></g>
      <g data-step="=1"><text x="320" y="254" text-anchor="middle" font-size="13">what the photo shows: a plain fabric room</text></g>
      <g data-step="=2">${[208, 286, 364, 442].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="50" stroke="var(--accent)" stroke-width="3" class="rl-pulse"/><line x1="${x}" y1="210" x2="${x}" y2="220" stroke="var(--accent)" stroke-width="3" class="rl-pulse"/>`).join('')}
        <text x="320" y="254" text-anchor="middle" font-size="13">clue 1: joints every 1.2 m = cloth bays</text></g>
      <g data-step="3"><path d="M130 44 H520 V216 H130 Z" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="5 5" opacity=".6"/>
        <rect x="170" y="34" width="290" height="10" fill="var(--c3)"/><rect x="170" y="216" width="290" height="10" fill="var(--c3)"/></g>
      <g data-step="=3"><text x="320" y="254" text-anchor="middle" font-size="13">behind the sides: absorbers at the reflection points</text>
        <path d="M168 76 L300 44 L326 122" fill="none" stroke="var(--c1)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="4"><path d="M64 34 H128 L98 72 H64 Z" fill="var(--c5)"/><path d="M64 226 H128 L98 188 H64 Z" fill="var(--c5)"/>
        <rect x="522" y="34" width="54" height="192" fill="var(--c5)" opacity=".8"/></g>
      <g data-step="=4"><text x="320" y="254" text-anchor="middle" font-size="13">in the corners and rear: deep bass traps</text>
        <circle cx="549" cy="130" r="12" fill="none" stroke="var(--text)" stroke-width="2" class="rl-grow"/></g>
      <g data-step="5"><rect x="300" y="34" width="26" height="10" fill="var(--accent)"/><rect x="300" y="216" width="26" height="10" fill="var(--accent)"/></g>
      <g data-step="=5"><path d="M313 48 L328 118" stroke="var(--accent)" stroke-width="2" class="rl-flow"/><path d="M313 212 L328 142" stroke="var(--accent)" stroke-width="2" class="rl-flow"/>
        <text x="320" y="254" text-anchor="middle" font-size="13">even surround speakers hide behind the cloth</text></g>
    </svg>`,
    steps: [
      ['What you see', 'Plain fabric walls, a hard floor with a rug, ordinary furniture. Nothing looks technical.'],
      ['Find the joints', 'Regular fine lines about 1.2 m apart mean stretched fabric bays. Paint and plaster have no such rhythm.'],
      ['Find the depth', 'Look at door and window reveals. A wall 300–400 mm thick has absorbers behind the cloth where the first reflections land.'],
      ['Find the bass control', 'Cut-off corners and a thick rear wall are where the deep traps live, because bass builds up at room edges.'],
      ['Find what else is hidden', 'Surround speakers, air slots and cable routes share the same cavity. One calm skin covers many jobs.'],
    ],
    why: [
      'Treatment needs depth, and depth is ugly when exposed. A sound-transparent skin lets you use any depth and any mix of absorbers without showing them.',
      'A calm-looking room is easier to work in for long hours than one covered in foam shapes.',
      'Reading finished rooms trains your eye: the same five clues appear in almost every professional space.',
    ],
    uses: [
      ['📷', 'Studying any studio photo', 'Count surfaces, find the speakers, look for joints, reveals and cut corners, then guess the depths before reading the caption.'],
      ['📝', 'Planning your own room', 'Decide how much width you can give away first; 150–300 mm per side is typical for a small room.'],
      ['🏠', 'A living room that must stay a living room', 'One fabric-covered wall with 200 mm behind it hides more treatment than panels dotted everywhere.'],
    ],
    tryit: [
      'Pick three photos of professional studios. For each, mark where you think the absorbers, bass traps and speakers are hidden.',
      'Measure your room’s width. Mark 200 mm in from each wall with tape on the floor and stand inside the lines to feel the finished size.',
      'Knock gently along a wall in a cinema or studio you visit. A dull, soft sound behind cloth means depth; a hard knock means board.',
    ],
    slip: ['Copying the visible finish of a famous room (the colour, the slats) without the depth behind it.', 'Copy the principle: decide what must happen at each surface, give it the depth it needs, then cover it with one calm skin.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-immersive-room', {
    title: 'four ceiling speakers in a spare bedroom',
    plain: 'An immersive room surrounds you with speakers, including overhead. It works when every speaker is at the right angle from your ears and its sound arrives at the same moment and the same loudness as the others.',
    where: 'A 4.2 × 3.4 m bedroom with a 2.7 m ceiling',
    story: `<p>Nisha is adding four height speakers to her stereo room. Her first idea is to put them in the four ceiling corners, “as far apart as possible”. She checks the angle from her chair: the corners are almost level with the horizon, far too low, and jammed against two walls where the bass swells.</p>
      <p>She works it out from her ears instead. Seated, her ears are 1.2 m above the floor and the speakers will hang at 2.6 m, so they are 1.4 m above her. For a 45° angle they must also be 1.4 m in front of and behind her. That puts them closer to her than the front speakers, so they are delayed by a fraction of a millisecond and trimmed to the same level.</p>`,
    numbers: [['Height of speakers above the ears', '2.6 − 1.2 = 1.4 m'], ['Forward / back distance for 45°', '1.4 m'], ['Distance to each height speaker', '1.4 ÷ sin 45° ≈ 2.0 m'], ['Distance to the front speakers', '2.2 m'], ['Delay for the nearer height speakers', '0.2 ÷ 343 ≈ 0.6 ms']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Side view of a room: a seated listener, front speaker, and two ceiling speakers at 45 degrees in front and behind">
      <rect x="60" y="30" width="520" height="200" fill="var(--panel)" stroke="var(--muted)" stroke-width="5"/>
      <circle cx="330" cy="140" r="11" fill="var(--c4)"/><rect x="318" y="152" width="24" height="44" rx="7" fill="var(--c4)"/><rect x="300" y="196" width="60" height="8" fill="var(--muted)"/>
      <rect x="96" y="120" width="22" height="40" rx="3" fill="var(--text)"/><rect x="104" y="160" width="6" height="68" fill="var(--muted)"/>
      <text x="107" y="250" text-anchor="middle" font-size="12">front</text>
      <g data-step="=1"><rect x="72" y="38" width="26" height="12" fill="var(--bad)"/><rect x="542" y="38" width="26" height="12" fill="var(--bad)"/>
        <path d="M330 140 L92 48 M330 140 L550 48" stroke="var(--bad)" stroke-width="2" stroke-dasharray="6 5"/>
        <text x="320" y="254" text-anchor="middle" font-size="13" fill="var(--bad)">in the corners: too low, and boomy</text></g>
      <g data-step="2"><line x1="330" y1="140" x2="330" y2="44" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 4"/></g>
      <g data-step="=2"><text x="344" y="96" font-size="13">1.4 m up</text>
        <text x="320" y="254" text-anchor="middle" font-size="13">start from the ears, not the room</text></g>
      <g data-step="3"><rect x="222" y="38" width="28" height="12" fill="var(--accent)"/><rect x="410" y="38" width="28" height="12" fill="var(--accent)"/>
        <path d="M330 140 L236 50 M330 140 L424 50" stroke="var(--accent)" stroke-width="2.5"/></g>
      <g data-step="=3"><text x="288" y="110" text-anchor="end" font-size="13">45°</text><text x="372" y="110" font-size="13">45°</text>
        <text x="320" y="254" text-anchor="middle" font-size="13">1.4 m in front and 1.4 m behind</text></g>
      <g data-step="=4"><path d="M236 52 L326 134" stroke="var(--accent)" stroke-width="3" class="rl-flow"/><path d="M120 140 H316" stroke="var(--c2)" stroke-width="3" class="rl-flow"/>
        <text x="214" y="132" text-anchor="middle" font-size="12">2.2 m</text><text x="262" y="74" text-anchor="end" font-size="12">2.0 m</text>
        <text x="320" y="254" text-anchor="middle" font-size="13">heights are nearer: they arrive early</text></g>
      <g data-step="=5"><circle cx="330" cy="140" r="16" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/>
        <text x="460" y="110" font-size="13" fill="var(--good)">delay 0.6 ms</text><text x="460" y="128" font-size="13" fill="var(--good)">match levels</text>
        <text x="320" y="254" text-anchor="middle" font-size="13" fill="var(--good)">everything lands together</text></g>
    </svg>`,
    steps: [
      ['The obvious mistake', 'Speakers pushed into the ceiling corners are too near the horizon to sound “above”, and corners exaggerate bass.'],
      ['Measure from the ears', 'Find the seated ear height and the height the speakers will be at. The difference is what sets every angle.'],
      ['Set the angle', 'For 45°, the forward and backward distance equals that height difference. Mark those two lines on the ceiling.'],
      ['Compare the distances', 'Measure from each speaker to the listening position. Any speaker that is nearer will be heard first and seem louder.'],
      ['Align time and level', 'Delay the nearer speakers so all arrive together, then set each one to the same loudness at the seat with a test noise.'],
    ],
    why: [
      'Your brain places a sound by tiny differences in arrival time and level. If a speaker is early or loud, sounds get pulled towards it.',
      'Height is judged by angle from the ear, so the right position depends on where you sit, not on where the ceiling corners are.',
      'With speakers on every side, every surface now has a speaker firing at it, so absorption has to be spread around the room, not just at the front.',
    ],
    uses: [
      ['🎚️', 'Setting up a mix room', 'Measure all speaker distances with a tape or laser, enter them in the processor, then verify with level-matched noise.'],
      ['🎬', 'A home cinema', 'Place the height pair roughly 45° in front and behind the main seats; avoid directly overhead or tight in corners.'],
      ['🛋️', 'More than one seat', 'Align to the middle seat and check the others; two or more subwoofers even out the bass between seats.'],
    ],
    tryit: [
      'Sit in your listening chair. Measure your ear height and your ceiling height, and subtract.',
      'Mark on the ceiling (with removable tape) the spots that distance in front of and behind your head. That is roughly 45°.',
      'Measure from your head to each existing speaker. Divide any difference in metres by 343 to see the delay in seconds.',
    ],
    slip: ['Placing speakers where the room makes it convenient and hoping calibration will fix it.', 'Get the angles right physically first. Delay and level trims fine-tune a good layout; they cannot repair a wrong one.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-fabric', {
    title: 'the velvet that switched the panels off',
    plain: 'Fabric on an acoustic panel has one job: let sound through to the absorber behind it. If you cannot breathe easily through the cloth, sound cannot get through either, and the panel becomes a decorated board.',
    where: 'A home studio in Bengaluru, six new 100 mm panels',
    story: `<p>Priya builds six deep mineral-wool panels and wraps them in a rich, heavy velvet from a furnishing shop because it looks expensive. The room barely changes: cymbals still splash and speech still sounds hard. She presses a corner of the leftover velvet to her lips and tries to breathe through it. Almost nothing passes.</p>
      <p>She goes back to the cloth market with a simple test instead of a brand name. A plain polyester basket-weave upholstery cloth lets her breathe freely and shows pinpoints of light when held up to a lamp. It costs less than half as much. Re-wrapped, the same six panels finally do what the wool inside was always able to do.</p>`,
    numbers: [['Velvet: breath test', 'fails (air hardly passes)'], ['Open-weave polyester: breath test', 'passes easily'], ['Velvet, per metre', 'about ₹450'], ['Polyester basket weave, per metre', 'about ₹180'], ['Treble absorbed by the panel', 'about a third → nearly all']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Sound meeting a tight fabric and reflecting, then passing through an open weave into the absorber">
      <rect x="430" y="40" width="120" height="180" fill="var(--c3)" opacity=".6"/><rect x="550" y="40" width="20" height="180" fill="var(--muted)"/>
      <text x="490" y="244" text-anchor="middle" font-size="13">absorber</text><text x="560" y="244" text-anchor="middle" font-size="13">wall</text>
      <circle cx="70" cy="130" r="8" fill="var(--c1)"/><circle cx="70" cy="130" r="14" fill="none" stroke="var(--c1)" stroke-width="2.5" class="rl-grow"/>
      <g data-step="1-2"><rect x="420" y="40" width="10" height="180" fill="var(--bad)"/></g>
      <g data-step="=1"><text x="250" y="60" text-anchor="middle" font-size="14">tight, heavy cloth on the face</text>
        <path d="M90 130 H410" stroke="var(--c1)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=2"><path d="M90 120 H410" stroke="var(--c1)" stroke-width="3" class="rl-flow"/><path d="M410 146 H110" stroke="var(--bad)" stroke-width="3" class="rl-flow"/>
        <text x="250" y="60" text-anchor="middle" font-size="14" fill="var(--bad)">sound bounces off the cloth</text>
        <text x="250" y="176" text-anchor="middle" font-size="13">the wool behind never gets it</text></g>
      <g data-step="=3"><ellipse cx="250" cy="130" rx="46" ry="30" fill="none" stroke="var(--text)" stroke-width="2"/><path d="M226 130 h48" stroke="var(--text)" stroke-width="2"/>
        <rect x="302" y="96" width="8" height="68" fill="var(--bad)"/><path d="M300 130 h-6" stroke="var(--bad)" stroke-width="3" class="rl-pulse"/>
        <text x="250" y="60" text-anchor="middle" font-size="14">breath test: no air gets through</text></g>
      <g data-step="4">${Array.from({ length: 12 }, (_, i) => `<rect x="420" y="${42 + i * 15}" width="10" height="9" fill="var(--good)"/>`).join('')}</g>
      <g data-step="=4"><text x="250" y="60" text-anchor="middle" font-size="14">open weave: gaps between the threads</text>
        <path d="M200 110 h60 M200 130 h60 M200 150 h60" stroke="var(--c2)" stroke-width="2.5" class="rl-flow"/><text x="230" y="182" text-anchor="middle" font-size="13">air passes freely</text></g>
      <g data-step="=5"><path d="M90 130 H540" stroke="var(--c1)" stroke-width="3" class="rl-flow"/>
        <circle cx="490" cy="130" r="14" fill="var(--good)" class="rl-pulse"/>
        <text x="250" y="60" text-anchor="middle" font-size="14" fill="var(--good)">sound goes in and is absorbed</text></g>
    </svg>`,
    steps: [
      ['A dense cloth goes on', 'Velvet, canvas, leatherette and blackout cloth are woven or coated so tightly that air cannot pass.'],
      ['Sound meets a barrier', 'High notes in particular reflect off the tight surface. The absorber behind is cut off, however thick it is.'],
      ['The breath test shows it', 'Hold the cloth to your mouth and breathe normally. If you have to push, sound has to push too.'],
      ['Choose an open weave', 'Plain or basket-weave polyester has small gaps between threads. You can breathe through it and see light through it.'],
      ['The panel wakes up', 'Sound passes the cloth almost untouched and loses its energy in the wool. Same panel, same depth, very different room.'],
    ],
    why: [
      'Sound is moving air. A material that stops air moving through it stops sound getting through it.',
      'The cloth itself absorbs almost nothing; all the work is done by the depth behind it. The cloth only has to get out of the way.',
      'Polyester keeps its length in humid weather, so it stays tight; cotton and jute take up moisture and sag.',
    ],
    uses: [
      ['🛍️', 'Buying in a cloth market', 'Carry a torch and do the breath and light tests on the actual roll; buy all you need from that one roll plus 10–15 % extra.'],
      ['🔊', 'In front of a loudspeaker', 'Use the most open cloth you can find, such as speaker grille cloth; anything denser dulls the treble.'],
      ['🧵', 'Over mineral wool', 'Put a thin, breathable black liner under an open weave to hold fibres in and stop the core showing through.'],
    ],
    tryit: [
      'Gather five fabrics from home: a T-shirt, a bedsheet, a towel, a curtain, a shopping bag. Breathe through each and rank them.',
      'Hold each one up to a lamp. The ones showing pinpoints of light between threads are the open weaves.',
      'Play hissy noise from a phone and hold each fabric over the speaker. Dense ones dull the hiss; open ones do not.',
    ],
    slip: ['Choosing fabric by its look and feel, or by a label that says “acoustic”.', 'Test the real roll: breath, light and a stretch check. A cheap cloth that passes beats an expensive one that does not.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-fabric-install', {
    title: 'the wall with one wavy bay',
    plain: 'Fabric looks neat when it is pulled evenly from the middle outwards, with the weave kept straight, in the same air conditions the room will live in. Uneven pulling or a change in humidity shows up later as ripples.',
    where: 'A 2.4 m high fabric wall in a studio in Kochi',
    story: `<p>Thomas stretches cotton cloth over five wall bays on a dry day with the air-conditioner running. He works from the top-left corner across each bay, stapling as he goes. It looks perfect. A month later, in the monsoon with the room shut and the air-conditioner off for a week, the middle bay hangs in soft waves and the weave leans to one side.</p>
      <p>Two things went wrong. Cotton grows when it takes up moisture: half a percent of 2.4 m is 12 mm of slack. And starting at a corner dragged the weave diagonally. He redoes the wall in polyester, left in the room for two days first, fixing the centre of each side and working out to the corners. It has stayed flat through two monsoons.</p>`,
    numbers: [['Bay height', '2.4 m'], ['Cotton growth when humid', 'about 0.5 %'], ['Slack that creates', '2400 × 0.005 = 12 mm'], ['Polyester growth', 'under 0.1 %  →  about 2 mm'], ['Acclimatise the cloth in the room', '24–48 hours']],
    svg: `<svg viewBox="0 0 640 270" aria-label="A fabric bay being fixed from the centre of each side outwards, compared with a bay that ripples in humid weather">
      <rect x="200" y="30" width="240" height="200" fill="var(--panel)" stroke="var(--muted)" stroke-width="6"/>
      <g opacity=".35">${Array.from({ length: 7 }, (_, i) => `<line x1="${230 + i * 30}" y1="34" x2="${230 + i * 30}" y2="226" stroke="var(--c2)"/>`).join('')}${Array.from({ length: 5 }, (_, i) => `<line x1="204" y1="${62 + i * 34}" x2="436" y2="${62 + i * 34}" stroke="var(--c2)"/>`).join('')}</g>
      <g data-step="1"><circle cx="320" cy="34" r="7" fill="var(--accent)"/><circle cx="320" cy="226" r="7" fill="var(--accent)"/></g>
      <g data-step="=1"><path d="M320 120 V50 M320 140 V210" stroke="var(--accent)" stroke-width="3" class="rl-flow"/>
        <text x="100" y="124" text-anchor="middle" font-size="13">1 · centre top,</text><text x="100" y="142" text-anchor="middle" font-size="13">then centre bottom</text></g>
      <g data-step="2"><circle cx="204" cy="130" r="7" fill="var(--accent)"/><circle cx="436" cy="130" r="7" fill="var(--accent)"/></g>
      <g data-step="=2"><path d="M300 130 H220 M340 130 H420" stroke="var(--accent)" stroke-width="3" class="rl-flow"/>
        <text x="100" y="124" text-anchor="middle" font-size="13">2 · centre left,</text><text x="100" y="142" text-anchor="middle" font-size="13">then centre right</text></g>
      <g data-step="3">${[250, 285, 355, 390].map((x) => `<circle cx="${x}" cy="34" r="5" fill="var(--c4)"/><circle cx="${x}" cy="226" r="5" fill="var(--c4)"/>`).join('')}${[80, 180].map((y) => `<circle cx="204" cy="${y}" r="5" fill="var(--c4)"/><circle cx="436" cy="${y}" r="5" fill="var(--c4)"/>`).join('')}</g>
      <g data-step="=3"><path d="M320 46 H232 M320 46 H408 M320 214 H232 M320 214 H408" stroke="var(--c4)" stroke-width="2.5" class="rl-flow"/>
        <text x="100" y="124" text-anchor="middle" font-size="13">3 · work outwards,</text><text x="100" y="142" text-anchor="middle" font-size="13">corners last</text></g>
      <g data-step="=4"><path d="M214 90 q50 26 106 0 t106 0 M214 130 q50 30 106 0 t106 0 M214 170 q50 26 106 0 t106 0" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-bob"/>
        <text x="540" y="116" text-anchor="middle" font-size="13" fill="var(--bad)">humid week:</text><text x="540" y="134" text-anchor="middle" font-size="13" fill="var(--bad)">cotton grows 12 mm</text><text x="540" y="152" text-anchor="middle" font-size="13" fill="var(--bad)">and ripples</text></g>
      <g data-step="=5"><rect x="206" y="36" width="228" height="188" fill="var(--good)" opacity=".12" class="rl-pulse"/>
        <text x="540" y="116" text-anchor="middle" font-size="13" fill="var(--good)">polyester,</text><text x="540" y="134" text-anchor="middle" font-size="13" fill="var(--good)">rested 2 days,</text><text x="540" y="152" text-anchor="middle" font-size="13" fill="var(--good)">stays flat</text>
        <text x="100" y="132" text-anchor="middle" font-size="13">weave lines stay square</text></g>
      <text x="320" y="258" text-anchor="middle" font-size="12" fill="var(--muted)">one fabric bay, seen from the front</text>
    </svg>`,
    steps: [
      ['Fix the centres, top and bottom', 'Hold the cloth with a thread line vertical. Fix the middle of the top, pull gently down and fix the middle of the bottom.'],
      ['Then the centres of the sides', 'Fix the middle of the left, pull gently across and fix the middle of the right. The cloth is now held in a cross.'],
      ['Work out to the corners', 'Add fixings in pairs, moving from each centre towards the corners, keeping the weave lines straight. Corners are closed last.'],
      ['What humidity does', 'Natural fibres lengthen when damp. A cloth fitted tight in dry air has nowhere to put the extra length, so it bellies.'],
      ['Choose and prepare the cloth', 'Use polyester, let it hang in the room for a day or two, and fit it in the room’s normal conditions. A track edge lets you re-tighten later.'],
    ],
    why: [
      'Pulling from the centre shares the tension evenly; pulling from a corner drags the weave diagonally and locks the distortion in.',
      'The eye spots a wobbly line instantly. Keeping one thread parallel to the edge is what makes a bay look professionally done.',
      'Bays no wider than the cloth (about 1.2–1.4 m) need no seams and are short enough to tension by hand.',
    ],
    uses: [
      ['🖼️', 'Wrapping a loose panel', 'Lay it face down, staple the centre of each side on the back, work outwards, and fold all four corners the same way.'],
      ['🧱', 'A full fabric wall', 'Set vertical battens at cloth-width spacing with a laser line, and make at least one bay removable for access.'],
      ['🪡', 'Briefing a local upholsterer', 'Ask for one sample bay first and agree the checklist: straight grain, identical corners, no puckers, no staples showing.'],
    ],
    tryit: [
      'Stretch a handkerchief over a book: first pinning from one corner round, then again from the centre of each side outwards. Compare the weave lines.',
      'Hang a metre of cotton and a metre of polyester in the bathroom after a hot shower. Measure each before and after.',
      'Look closely at a fabric-covered office partition or cinema wall and find where the joints, corners and fixings are hidden.',
    ],
    slip: ['Fitting the fabric drum-tight on a dry day, starting at a corner.', 'Acclimatise the cloth, start from the centres, keep the grain straight, and leave a way to re-tension after the first humid season.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-consultant-path', {
    title: 'a first paid job: the echoing classroom',
    plain: 'A consultant’s work is a loop: measure the problem, calculate what will fix it, write it down clearly enough for a builder, then measure again to prove it worked. You can practise that loop on small real rooms long before you design a studio.',
    where: 'A primary-school classroom, 9 × 7 m with a 3.2 m ceiling',
    story: `<p>Eight months into his self-study, Nikhil is asked by a teacher he knows whether anything can be done about her classroom, where children at the back cannot follow. He visits after school with a measurement microphone and a laptop, pops six balloons at different spots and finds the sound takes about 1.4 seconds to die away. For speech in a room this size, about 0.6 seconds is the aim.</p>
      <p>That evening he works out how much absorption is missing, turns it into square metres of a ceiling tile the school’s contractor can buy, and writes a one-page note with a sketch. Three weeks later he measures again: 0.62 seconds. The before-and-after graph, the sums and two photos become the first page of his portfolio.</p>`,
    numbers: [['Room volume', '9 × 7 × 3.2 ≈ 202 m³'], ['Absorption now (1.4 s)', '0.161 × 202 ÷ 1.4 ≈ 23 m²'], ['Absorption needed (0.6 s)', '0.161 × 202 ÷ 0.6 ≈ 54 m²'], ['To add', '54 − 23 = 31 m²'], ['Ceiling tile at 0.85', '31 ÷ 0.85 ≈ 36 m² (ceiling is 63 m²)']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A loop of four stages: measure, calculate, specify, verify, with a decay bar that shortens after treatment">
      ${[['MEASURE', 90, 'c1'], ['CALCULATE', 250, 'c2'], ['SPECIFY', 410, 'c3'], ['VERIFY', 560, 'c4']].map(([t, x, c]) => `<rect x="${x - 62}" y="40" width="124" height="46" rx="10" fill="var(--panel)" stroke="var(--${c})" stroke-width="3"/><text x="${x}" y="69" text-anchor="middle" font-size="14">${t}</text>`).join('')}
      <path d="M152 63 H188 M312 63 H348 M472 63 H498" stroke="var(--muted)" stroke-width="3" class="rl-flow"/>
      <path d="M560 86 V110 H90 V88" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 5"/>
      <line x1="60" y1="210" x2="580" y2="210" stroke="var(--line)" stroke-width="2"/>
      <g data-step="1"><rect x="80" y="150" width="420" height="22" rx="4" fill="var(--bad)" opacity=".75"/></g>
      <g data-step="=1"><rect x="28" y="36" width="124" height="54" rx="12" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-pulse"/>
        <circle cx="70" cy="161" r="8" fill="none" stroke="var(--text)" stroke-width="2.5" class="rl-grow"/>
        <text x="290" y="140" text-anchor="middle" font-size="13">balloon pop: sound lasts 1.4 s</text></g>
      <g data-step="2"><line x1="260" y1="140" x2="260" y2="204" stroke="var(--good)" stroke-width="3" stroke-dasharray="6 4"/></g>
      <g data-step="=2"><rect x="188" y="36" width="124" height="54" rx="12" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-pulse"/>
        <text x="270" y="232" font-size="13" fill="var(--good)">target 0.6 s  →  add 31 m² of absorption</text></g>
      <g data-step="=3"><rect x="348" y="36" width="124" height="54" rx="12" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-pulse"/>
        <rect x="330" y="124" width="170" height="14" rx="3" fill="var(--c3)" class="rl-bob"/>
        <text x="415" y="232" text-anchor="middle" font-size="13">one page: 36 m² of ceiling tile, where, how</text></g>
      <g data-step="4"><rect x="80" y="178" width="186" height="22" rx="4" fill="var(--good)"/></g>
      <g data-step="=4"><rect x="498" y="36" width="124" height="54" rx="12" fill="none" stroke="var(--accent)" stroke-width="3" class="rl-pulse"/>
        <text x="390" y="194" text-anchor="middle" font-size="13" fill="var(--good)">measured after: 0.62 s</text></g>
      <g data-step="=5"><rect x="520" y="126" width="64" height="76" rx="6" fill="var(--panel)" stroke="var(--accent)" stroke-width="3" class="rl-bob"/>
        <path d="M530 150 h44 M530 164 h44 M530 178 h30" stroke="var(--accent)" stroke-width="3"/>
        <text x="300" y="232" text-anchor="middle" font-size="13">graph, sums and photos: portfolio page one</text></g>
      <text x="64" y="166" text-anchor="end" font-size="12">before</text><text x="64" y="194" text-anchor="end" font-size="12">after</text>
    </svg>`,
    steps: [
      ['Measure', 'Go to the room, listen, and take numbers: here, how long sound lingers. Without a “before” you can never show what you changed.'],
      ['Calculate', 'Compare with a sensible target for the room’s use and work out the gap in plain units a builder understands.'],
      ['Specify', 'Turn the gap into a product type, an area and a position, on one page with a sketch. Clear instructions are half the job.'],
      ['Verify', 'Return and measure the same way. Sometimes it matches; when it does not, you have learned something you could not get from a book.'],
      ['Record it', 'Keep the measurements, the working, photos and what you would do differently. Six such pages make a portfolio.'],
    ],
    why: [
      'Clients pay for a prediction that comes true. The loop of forecast and check is how you earn the right to make bigger predictions.',
      'Small rooms with one clear problem teach the same method as large projects, with less at stake.',
      'Writing for a builder forces you to understand the solution properly; vague ideas do not survive being drawn.',
    ],
    uses: [
      ['🏫', 'Starter projects', 'Classrooms, prayer halls, cafés and meeting rooms: one measurement, one sum, one fix, one re-test.'],
      ['🎧', 'Your own room', 'Measure before and after every change you make; your own room is a free laboratory.'],
      ['📚', 'Directing your study', 'When a real job exposes something you cannot calculate, that is the next chapter to study.'],
    ],
    tryit: [
      'Pick one echoey room you can get into. Record a single clap on your phone and count roughly how long it takes to fade.',
      'Estimate the room’s volume and use 0.161 × volume ÷ time to find its present absorption, then repeat for a target time.',
      'Write a five-line note saying what you would add, how much and where, as if for a carpenter who has never met you.',
    ],
    slip: ['Reading and collecting software for years before measuring a single real room.', 'Start the measure, calculate, specify, verify loop now on small rooms, and study what each job shows you do not know.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-client-process', {
    title: 'the brief that changed the design',
    plain: 'Clients ask for a solution (“make it soundproof”). A consultant’s first job is to find the real need behind it, turn that into numbers, and show honestly what each budget will and will not achieve.',
    where: 'A ground-floor room in an apartment block, a family living upstairs',
    story: `<p>Rohan’s enquiry says only: “I want a soundproof room for music, budget about ₹12 lakh.” Twenty minutes of questions change everything. He plays acoustic drums. He practises after work, sometimes until midnight. The bedroom of the flat above is directly over the room. Now there is something to calculate.</p>
      <p>The consultant shows three forecasts as bars against the quiet of the bedroom at night. The basic build would still be clearly heard. The middle one leaves a soft thump. The best one is close to silent but costs twice his budget. Rohan picks the middle build and agrees to stop drumming at ten. He decided; the consultant made the decision possible.</p>`,
    numbers: [['Drums in the room', '105 dB'], ['Bedroom above at night', 'about 30 dB'], ['Good build (50 dB)', '105 − 50 = 55 dB upstairs'], ['Better build (62 dB)', '105 − 62 = 43 dB upstairs'], ['Best build (72 dB)', '105 − 72 = 33 dB upstairs']],
    svg: `<svg viewBox="0 0 640 270" aria-label="Three forecast bars showing drum level upstairs for good, better and best builds against the bedroom background level">
      <line x1="90" y1="220" x2="600" y2="220" stroke="var(--line)" stroke-width="2"/><line x1="90" y1="40" x2="90" y2="220" stroke="var(--line)" stroke-width="2"/>
      <text x="80" y="224" text-anchor="end" font-size="12">20</text><text x="80" y="174" text-anchor="end" font-size="12">40</text><text x="80" y="124" text-anchor="end" font-size="12">60</text><text x="80" y="74" text-anchor="end" font-size="12">80</text>
      <text x="26" y="134" font-size="12" fill="var(--muted)">dB</text>
      <g data-step="=1"><circle cx="330" cy="120" r="14" fill="var(--c1)"/><circle cx="330" cy="120" r="20" fill="none" stroke="var(--c1)" stroke-width="3" class="rl-grow"/>
        <text x="330" y="70" text-anchor="middle" font-size="14">“Make it soundproof.”</text>
        <text x="330" y="176" text-anchor="middle" font-size="13">what? when? who is next door?</text></g>
      <g data-step="2"><line x1="90" y1="195" x2="600" y2="195" stroke="var(--accent2)" stroke-width="2.5" stroke-dasharray="7 5"/></g>
      <g data-step="=2"><text x="345" y="186" text-anchor="middle" font-size="13" fill="var(--accent2)">bedroom above at night: 30 dB</text>
        <text x="345" y="70" text-anchor="middle" font-size="14">the real need: drums, late, under a bedroom</text></g>
      <g data-step="3"><rect x="150" y="132.5" width="80" height="87.5" fill="var(--bad)" opacity=".8"/>
        <text x="190" y="240" text-anchor="middle" font-size="13">good</text><text x="190" y="124" text-anchor="middle" font-size="13">55</text></g>
      <g data-step="=3"><text x="420" y="110" text-anchor="middle" font-size="13" fill="var(--bad)">clearly heard upstairs</text></g>
      <g data-step="4"><rect x="300" y="162.5" width="80" height="57.5" fill="var(--warn)" opacity=".85"/>
        <text x="340" y="240" text-anchor="middle" font-size="13">better</text><text x="340" y="154" text-anchor="middle" font-size="13">43</text>
        <rect x="450" y="187.5" width="80" height="32.5" fill="var(--good)" opacity=".85"/>
        <text x="490" y="240" text-anchor="middle" font-size="13">best</text><text x="490" y="179" text-anchor="middle" font-size="13">33</text></g>
      <g data-step="=4"><text x="345" y="70" text-anchor="middle" font-size="14">three honest forecasts, three prices</text></g>
      <g data-step="=5"><rect x="292" y="140" width="96" height="88" rx="8" fill="none" stroke="var(--accent)" stroke-width="4" class="rl-pulse"/>
        <text x="345" y="70" text-anchor="middle" font-size="14">client chooses: “better”, and stops at 10 pm</text></g>
    </svg>`,
    steps: [
      ['The request', 'A client describes a solution in everyday words. “Soundproof” can mean anything from “less echo” to “silent next door”.'],
      ['The questions', 'What makes the sound, how loud, at what hours, who is on the other side and how quiet is it there? Now there is a source and a target.'],
      ['The first forecast', 'Source level minus the isolation of a build gives the level next door. Compare it with the background there.'],
      ['Options side by side', 'Show two or three builds with their forecast result and cost. Give ranges, not promises, and say what each one cannot do.'],
      ['The client decides', 'With the trade-offs visible, the client chooses performance, budget and habits together. Write the agreed target into the contract.'],
    ],
    why: [
      'People can only choose between things they can compare. Bars against a familiar background level are easier to judge than decibel tables.',
      'A forecast agreed in advance protects both sides: the client knows what they are buying and you know what you must deliver.',
      'Often the best solution includes a change in use (hours, instrument, room) that no construction can match for cost.',
    ],
    uses: [
      ['☎️', 'First call with any client', 'Ask about the source, the hours, the neighbours and the money before you talk about materials.'],
      ['📊', 'Presenting options', 'Three tiers with a forecast level, a cost and one sentence on what each still leaves audible.'],
      ['🧾', 'Avoiding disputes', 'Put the target and how it will be measured in writing, and test it at hand-over.'],
    ],
    tryit: [
      'Write ten questions you would ask someone who says “I need a soundproof room”. Try them on a friend.',
      'For your own room, write the loudest thing you do and the quietest neighbouring space. Subtract to get your isolation need.',
      'Explain to a non-technical person, in two sentences, the difference between “quieter next door” and “silent next door”.',
    ],
    slip: ['Quoting for what the client asked for, without finding out what they need.', 'Interview first, forecast second, price third. Never promise “soundproof”; promise a number and a way to check it.'],
  });

  /* ------------------------------------------------------------------ */
  REAL('m-furniture', {
    title: 'the desk that carved a notch at 720 Hz',
    plain: 'A flat desk between you and your speakers acts like a mirror for sound. The reflected copy arrives a moment after the direct sound and cancels part of it, so some notes sound thin no matter how good the speakers are.',
    where: 'A producer’s desk, speakers standing on the desktop',
    story: `<p>Sana’s vocals always sound slightly hollow in her room, but fine on headphones. Her monitors sit on a deep, flat desk, 1.2 m from her ears. A friend slides a hand mirror across the desktop: about half-way, Sana can see the speaker’s tweeter in it. That is exactly where sound is bouncing off the desk to her ears.</p>
      <p>The bounce travels 24 cm further than the direct sound, enough to cancel around 720 Hz, right in the body of a voice. She moves the monitors onto stands just behind the desk and raises them slightly, so the bounce point falls in the gap beyond the desk’s back edge. The hollow sound is gone, and the desk has more space on it.</p>`,
    numbers: [['Direct path, speaker to ear', '1.20 m'], ['Path via the desktop', '1.44 m'], ['Extra distance', '0.24 m'], ['Cancelled frequency', '343 ÷ (2 × 0.24) ≈ 720 Hz'], ['Arrives late by', '0.24 ÷ 343 ≈ 0.7 ms']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Side view of a speaker, desk and listener showing the direct sound and a reflection off the desktop, then the speaker moved behind the desk">
      <line x1="30" y1="232" x2="610" y2="232" stroke="var(--line)" stroke-width="2"/>
      <circle cx="500" cy="100" r="13" fill="var(--c4)"/><rect x="486" y="114" width="28" height="60" rx="8" fill="var(--c4)"/><rect x="470" y="174" width="60" height="8" fill="var(--muted)"/><rect x="496" y="182" width="8" height="50" fill="var(--muted)"/>
      <g data-step="1-3"><rect x="150" y="150" width="300" height="10" fill="var(--c1)"/><rect x="170" y="160" width="8" height="72" fill="var(--c1)"/><rect x="420" y="160" width="8" height="72" fill="var(--c1)"/>
        <rect x="170" y="96" width="34" height="54" rx="4" fill="var(--text)"/><circle cx="187" cy="112" r="6" fill="var(--panel)"/><circle cx="187" cy="134" r="9" fill="var(--panel)"/></g>
      <g data-step="=1"><path d="M206 112 L486 100" stroke="var(--c2)" stroke-width="3" class="rl-flow"/>
        <text x="340" y="60" text-anchor="middle" font-size="14">direct sound: 1.20 m</text></g>
      <g data-step="2-3"><path d="M206 112 L486 100" stroke="var(--c2)" stroke-width="3" class="rl-flow"/>
        <path d="M206 116 L330 150 L486 104" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=2"><circle cx="330" cy="150" r="7" fill="var(--bad)" class="rl-pulse"/>
        <text x="340" y="60" text-anchor="middle" font-size="14" fill="var(--bad)">desk bounce: 1.44 m, 0.7 ms late</text></g>
      <g data-step="=3"><path d="M250 70 q30 -30 60 0 t60 0" fill="none" stroke="var(--c2)" stroke-width="2.5"/><path d="M250 70 q30 30 60 0 t60 0" fill="none" stroke="var(--bad)" stroke-width="2.5" class="rl-pulse"/>
        <text x="340" y="36" text-anchor="middle" font-size="14">at 720 Hz the two cancel</text></g>
      <g data-step="4"><rect x="240" y="150" width="210" height="10" fill="var(--c1)"/><rect x="260" y="160" width="8" height="72" fill="var(--c1)"/><rect x="420" y="160" width="8" height="72" fill="var(--c1)"/>
        <rect x="150" y="76" width="34" height="54" rx="4" fill="var(--text)"/><circle cx="167" cy="92" r="6" fill="var(--panel)"/><circle cx="167" cy="114" r="9" fill="var(--panel)"/>
        <rect x="163" y="130" width="8" height="102" fill="var(--muted)"/><rect x="146" y="226" width="42" height="6" fill="var(--muted)"/></g>
      <g data-step="=4"><text x="340" y="50" text-anchor="middle" font-size="14">speakers on stands behind a shallower desk</text>
        <path d="M186 96 L486 100" stroke="var(--c2)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=5"><path d="M186 96 L486 100" stroke="var(--c2)" stroke-width="3" class="rl-flow"/>
        <path d="M186 100 L214 190" stroke="var(--good)" stroke-width="2.5" stroke-dasharray="5 5" class="rl-pulse"/>
        <text x="340" y="50" text-anchor="middle" font-size="14" fill="var(--good)">the bounce point now misses the desk</text></g>
    </svg>`,
    steps: [
      ['The direct sound', 'Sound goes straight from the speaker to your ears. This is the part you want to hear.'],
      ['The desk reflection', 'A second copy bounces off the desktop, like light off a mirror, and reaches your ears slightly later.'],
      ['Cancellation', 'At the frequency where the late copy is exactly half a wave behind, the two cancel. A narrow band of the music goes missing.'],
      ['Move the furniture', 'Put speakers on stands behind the desk, at ear height, and keep the desk shallow and low.'],
      ['The mirror point misses', 'The spot where the bounce would happen is now in the air behind the desk. No reflection, no notch.'],
    ],
    why: [
      'Two equal sounds half a wavelength apart add to nothing. The frequency this happens at depends only on the extra distance.',
      'Equalisation cannot fill the hole: boost the speaker and the reflection is boosted too.',
      'Furniture is the nearest surface to your ears, so its reflections are the strongest in the room after the direct sound.',
    ],
    uses: [
      ['🪞', 'Checking any desk', 'Slide a mirror over the desktop from your seat. Wherever you see a speaker driver, sound is bouncing to you.'],
      ['🛠️', 'Ordering a desk from a carpenter', 'Ask for a shallow top, an open frame rather than solid sides, and racks angled below the line from speakers to ears.'],
      ['🖥️', 'Big screens', 'Keep a monitor low and tilted back so it does not sit in the direct line or mirror sound into your face.'],
    ],
    tryit: [
      'Do the mirror test on your own desk and mark the bounce points with small stickers.',
      'Measure the direct path and the bounce path with a tape. Divide 343 by twice the difference to find your notch frequency.',
      'Lay a folded towel or thick blanket on the bounce point and listen to a voice recording with and without it.',
    ],
    slip: ['Placing monitors on a deep, bare desktop and trying to correct the sound with equalisation.', 'Fix the geometry: speakers on stands behind a shallow desk, drivers at ear height, and nothing flat between them and you.'],
  });
})();
