/* "In real life" blocks — group 8 (recording, mixing and mastering track). Each REAL(id, {...}) adds a worked
   scene, a step-through animated diagram and a practical wrap-up to an existing lesson (see js/real-kit.js). */
(function () {
  const REAL = window.REAL; if (!REAL) return;

  /* small drawing helpers, used only in this file */
  const T = (x, y, s, o) => { o = o || {}; return `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.z || 13}"${o.f ? ` fill="var(--${o.f})"` : ''}${o.b ? ' font-weight="700"' : ''}>${s}</text>`; };
  const person = (x, y, c) => `<circle cx="${x}" cy="${y}" r="13" fill="var(--${c})"/><rect x="${x - 11}" y="${y + 14}" width="22" height="40" rx="8" fill="var(--${c})"/>`;
  const box = (x, y, w, h, label, c, o) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="var(--panel)" stroke="var(--${c || 'line'})" stroke-width="2"/>${label ? T(x + w / 2, y + h / 2 + 5, label, o) : ''}`;
  const mic = (x, y, c) => `<rect x="${x - 5}" y="${y - 12}" width="10" height="22" rx="5" fill="var(--${c || 'text'})"/><line x1="${x}" y1="${y + 10}" x2="${x}" y2="${y + 34}" stroke="var(--muted)" stroke-width="2"/>`;
  const wave = (x0, y0, len, amp, cyc, c, cls, w) => { let d = ''; for (let i = 0; i <= 60; i++) { const x = x0 + (len * i) / 60, y = y0 - amp * Math.sin((i / 60) * cyc * 2 * Math.PI); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } return `<path d="${d}" fill="none" stroke="var(--${c})" stroke-width="${w || 2.5}"${cls ? ` class="${cls}"` : ''}/>`; };
  const floor = (y) => `<line x1="20" y1="${y}" x2="620" y2="${y}" stroke="var(--line)" stroke-width="2"/>`;

  /* ---------------------------------------------------------------- R1 */
  REAL('r-mics', {
    title: 'the podcast that sounded like a bathroom',
    plain: 'A microphone hears everything in the room, not only the thing you point it at. Moving it closer makes the voice much stronger while the room stays the same, so the room seems to shrink.',
    where: 'A living room in Kochi with a tiled floor and a humming fridge',
    story: `<p>Meera records her first podcast with the microphone 40 cm from her mouth. On playback her voice sounds distant and echoey, and the fridge is clearly there. She is about to buy a more expensive microphone.</p>
      <p>Instead she moves the same microphone to 10 cm, speaks slightly across it with a pop filter in front, and turns it so its dead rear side faces the fridge. She then lowers the preamp gain to get the same recording level. The echo and the fridge drop away.</p>`,
    numbers: [['Old distance → new distance', '40 cm → 10 cm'], ['Voice gets stronger by', '20·log(40 ÷ 10) = 12 dB'], ['Room echo and fridge at the mic', 'unchanged'], ['After turning gain down 12 dB', 'room and fridge 12 dB quieter'], ['Extra bass from being close', 'tame with the 80–100 Hz low-cut']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Moving a microphone closer raises the voice above the room sound">
      ${floor(214)}<rect x="20" y="20" width="600" height="194" fill="none" stroke="var(--line)" stroke-width="2"/>
      ${person(110, 120, 'c1')}${T(110, 240, 'Meera')}
      <rect x="548" y="110" width="50" height="104" rx="6" fill="var(--panel)" stroke="var(--muted)" stroke-width="2"/>${T(573, 240, 'fridge')}
      <g data-step="1-2">${mic(300, 130, 'text')}${T(300, 100, '40 cm away', { f: 'muted' })}
        <path d="M130 128 H290" stroke="var(--c1)" stroke-width="2" class="rl-flow"/></g>
      <g data-step="=2"><path d="M125 110 L250 26 L296 118" stroke="var(--c3)" stroke-width="2" fill="none" class="rl-flow slow"/>
        <path d="M545 150 H312" stroke="var(--bad)" stroke-width="2" fill="none" class="rl-flow rev slow"/></g>
      <g data-step="3"><path d="M125 108 L196 26 L164 114" stroke="var(--c3)" stroke-width="1.5" fill="none" class="rl-flow slow" opacity=".7"/>
        <path d="M545 150 H176" stroke="var(--bad)" stroke-width="1.5" fill="none" class="rl-flow rev slow" opacity=".7"/></g>
      <g data-step="=2">${T(330, 46, 'echo off walls and ceiling', { f: 'c3', a: 'start' })}${T(430, 172, 'fridge hum', { f: 'bad' })}</g>
      <g data-step="3">${mic(160, 130, 'accent')}<path d="M126 128 H152" stroke="var(--c1)" stroke-width="5" class="rl-flow"/></g>
      <g data-step="=3">${T(200, 186, '10 cm: voice +12 dB', { f: 'accent', a: 'start' })}</g>
      <g data-step="4"><path d="M172 118 a16 16 0 0 1 0 24" fill="none" stroke="var(--good)" stroke-width="3" class="rl-pulse"/></g>
      <g data-step="=4">${T(200, 186, 'dead side faces the fridge', { f: 'good', a: 'start' })}</g>
      <g data-step="5"><rect x="290" y="44" width="210" height="60" rx="8" fill="var(--panel)" stroke="var(--good)" stroke-width="2"/>
        ${T(395, 68, 'gain down 12 dB')}${T(395, 90, 'room sounds 12 dB smaller', { f: 'good', z: 12 })}</g>
    </svg>`,
    steps: [
      ['The mic at arm’s length', 'At 40 cm the voice arrives only a little stronger than the sound bouncing around the room.'],
      ['What the mic really hears', 'Echo from the hard walls and the hum of the fridge reach it at nearly the same level wherever it stands.'],
      ['Move in to 10 cm', 'Four times closer makes the voice 12 dB stronger. The room sound at the mic does not change.'],
      ['Aim the dead side', 'A cardioid mic picks up least from behind. Point its back at the noise you want to lose.'],
      ['Turn the gain down', 'To get the same recording level you now need 12 dB less gain, which also lowers the room and the fridge by 12 dB.'],
    ],
    why: [
      'Direct sound falls about 6 dB each time the distance doubles, but the echo in a room is roughly the same everywhere. Distance sets the ratio between the two.',
      'A directional microphone is best thought of as a tool for rejecting things: aim the quiet side, not only the loud side.',
      'Very close, directional microphones exaggerate bass. That is why close voices sound “radio-like” and why the low-cut switch exists.',
    ],
    uses: [
      ['🎙️', 'Voice-over at home', 'Work 10–15 cm from the mic with a pop filter and hang a duvet behind you; it beats a costly mic at 50 cm.'],
      ['🎸', 'Guitar amp on a loud stage', 'Put the mic 3–5 cm from the grille so the amp is far louder than the drums leaking in.'],
      ['🎻', 'A natural classical sound', 'Go the other way: back off to 1–2 m in a good room, because there you want the room in the recording.'],
    ],
    tryit: [
      'Record your voice on a phone at 50 cm, then at 10 cm (slightly off to one side). Match the playback volume and compare how big the room sounds.',
      'With the phone at 10 cm, turn so its microphone end points away from a fan or fridge, and record again.',
      'Say “pop the paper” straight at the phone, then across it at an angle. Listen for the thumps disappearing.',
    ],
    slip: ['Buying a “better” microphone to fix a roomy, noisy recording.', 'Halve the distance first, aim the dead side at the noise, and soften the surface behind you.'],
  });

  /* ---------------------------------------------------------------- R2 */
  REAL('r-stereo', {
    title: 'the choir that went hollow on a phone',
    plain: 'Two microphones make stereo because each one hears a sound slightly louder or slightly earlier than the other. If the timing gap is large, the two signals fight when a phone adds them into one speaker.',
    where: 'A parish church with a 30-voice choir',
    story: `<p>Joseph records the choir with two microphones 1 m apart. On headphones it sounds wide and lovely. The choir director plays it on a phone speaker and the sopranos on the left sound thin and hollow.</p>
      <p>Sound from a singer off to one side reached the far microphone about 1.5 ms after the near one. Added together in mono, that delay cancels a band of notes. Joseph re-records with the two microphones only 17 cm apart, angled outward. The recording is slightly less wide but stays solid on every speaker.</p>`,
    numbers: [['Singer 30° off centre, mics 1 m apart', 'extra path 1 × sin 30° = 0.5 m'], ['Arrival gap', '0.5 ÷ 343 ≈ 1.46 ms'], ['First cancelled note in mono', '1 ÷ (2 × 1.46 ms) ≈ 343 Hz'], ['Mics 17 cm apart', 'gap 0.25 ms → first notch ≈ 2 kHz']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Two spaced microphones hear a side singer at different times">
      <path d="M90 50 Q320 -10 550 50" fill="none" stroke="var(--line)" stroke-width="2"/>
      ${[110, 180, 250, 320, 390, 460, 530].map((x, i) => `<circle cx="${x}" cy="${52 - 22 * Math.sin((i / 6) * Math.PI)}" r="9" fill="var(--${i === 1 ? 'c1' : 'muted'})"/>`).join('')}
      ${T(320, 20, 'choir')}
      <g data-step="1-3">${mic(250, 190, 'c2')}${mic(390, 190, 'c4')}${T(320, 246, 'mics 1 m apart', { f: 'muted' })}</g>
      <g data-step="2-3"><path d="M180 50 L248 176" stroke="var(--c2)" stroke-width="2.5" fill="none" class="rl-flow"/>
        <path d="M184 50 L386 176" stroke="var(--c4)" stroke-width="2.5" fill="none" class="rl-flow"/></g>
      <g data-step="=2">${T(150, 130, 'short path', { f: 'c2' })}${T(360, 110, 'longer by 0.5 m', { f: 'c4', a: 'start' })}</g>
      <g data-step="=3"><rect x="430" y="96" width="190" height="96" rx="8" fill="var(--panel)" stroke="var(--bad)" stroke-width="2"/>
        ${wave(442, 128, 166, 12, 3, 'c2', 'rl-pulse')}${wave(442, 128, 166, -12, 3, 'c4', 'rl-pulse d2')}
        ${T(525, 170, 'in mono: 343 Hz cancels', { f: 'bad', z: 12 })}</g>
      <g data-step="4"><g transform="rotate(-25 306 190)">${mic(306, 190, 'accent')}</g><g transform="rotate(25 334 190)">${mic(334, 190, 'accent')}</g>
        <path d="M181 52 L300 172" stroke="var(--accent)" stroke-width="2.5" fill="none" class="rl-flow"/><path d="M184 50 L330 172" stroke="var(--accent)" stroke-width="2.5" fill="none" class="rl-flow d2"/></g>
      <g data-step="=4">${T(320, 246, '17 cm apart, angled out', { f: 'accent' })}</g>
      <g data-step="=5"><rect x="430" y="96" width="190" height="96" rx="8" fill="var(--panel)" stroke="var(--good)" stroke-width="2"/>
        ${wave(442, 128, 166, 12, 3, 'accent', 'rl-pulse')}${wave(442, 132, 166, 11, 3, 'accent', 'rl-pulse')}
        ${T(525, 170, 'nearly in step: solid mono', { f: 'good', z: 12 })}${T(320, 246, 'gap only 0.25 ms', { f: 'accent' })}</g>
    </svg>`,
    steps: [
      ['Two mics, one metre apart', 'A wide spacing gives a big, airy picture on headphones because the timing between the mics differs a lot.'],
      ['One singer, two path lengths', 'A singer off to the left is 0.5 m closer to the left mic, so the right mic hears her 1.46 ms late.'],
      ['A phone adds them together', 'At 343 Hz the late copy is exactly half a cycle behind and cancels the early one. Her tone goes hollow.'],
      ['Bring the mics together', 'At 17 cm apart and angled outward, the stereo comes mostly from level difference, with only 0.25 ms of timing.'],
      ['Mono survives', 'The first cancellation moves up to about 2 kHz and is shallow, so the choir stays full on any speaker.'],
    ],
    why: [
      'Our ears place sounds using both loudness difference and arrival-time difference. A microphone pair can copy either cue, or a mix of both.',
      'Timing differences sound spacious but turn into cancellations when left and right are summed. Level differences never cancel.',
      'Angled directional mics create level difference without needing distance between them, which is why close pairs are the safe choice.',
    ],
    uses: [
      ['⛪', 'Choir or ensemble', 'Start with a near-coincident pair 2–3 m back and above head height; add spaced outriggers only if the room is good.'],
      ['🥁', 'Drum overheads', 'Measure both overheads the same distance from the snare with a cable or string, so the snare stays centred and strong in mono.'],
      ['📻', 'Anything for broadcast or phones', 'Press the mono button before you pack up. If the sound thins out, close the spacing.'],
    ],
    tryit: [
      'Record a friend walking and talking across a room with two phones 1 m apart, then with the phones touching and angled apart.',
      'Load each pair as left and right in any free editor and listen in stereo, then switch the output to mono.',
      'Note which version loses tone in mono and which just gets narrower.',
    ],
    slip: ['Judging a stereo recording only on headphones.', 'Always check it in mono on a small speaker; if it goes thin, reduce the spacing between the microphones.'],
  });

  /* ---------------------------------------------------------------- R3 */
  REAL('r-instruments', {
    title: 'two singers, two microphones, one hollow sound',
    plain: 'When two microphones both hear the same voice, the far one hears it late. Mixed together, the late copy makes the voice sound hollow unless it is much quieter than the main one.',
    where: 'A duo recording in a carpeted spare room in Bengaluru',
    story: `<p>Arun and Divya sing facing the same way, 60 cm apart, each with a microphone 30 cm from the mouth. Soloed, each microphone sounds fine. With both faders up, the voices turn thin and “phasey”.</p>
      <p>Each voice was leaking into the other microphone only 6 dB quieter than in its own. They moved to 1 m apart, brought the microphones in to 15 cm and angled each microphone’s dead side toward the other singer. The hollow sound went away without any plug-in.</p>`,
    numbers: [['Before: own mic 30 cm, other mic about 60 cm', 'leak = 20·log(30 ÷ 60) = −6 dB'], ['After: own mic 15 cm, other mic about 1 m', 'leak = 20·log(15 ÷ 100) ≈ −16 dB'], ['The 3:1 rule', 'other mic at least 3 × as far → −9.5 dB or better'], ['Aiming the dead side', 'typically a further 10 dB or more']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Leakage between two close vocal microphones and how distance fixes it">
      ${floor(222)}
      <g data-step="1-3">${person(250, 120, 'c1')}${person(390, 120, 'c2')}${mic(250, 60, 'c1')}${mic(390, 60, 'c2')}
        ${T(250, 246, 'Arun')}${T(390, 246, 'Divya')}</g>
      <g data-step="=1">${T(320, 30, 'each mic 30 cm from its singer', { f: 'muted' })}</g>
      <g data-step="=2"><path d="M252 108 L386 66" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow"/><path d="M388 108 L254 66" stroke="var(--bad)" stroke-width="2.5" fill="none" class="rl-flow d2"/>
        ${T(320, 30, 'leak into the other mic: only −6 dB', { f: 'bad' })}</g>
      <g data-step="=3"><rect x="436" y="96" width="190" height="104" rx="8" fill="var(--panel)" stroke="var(--bad)" stroke-width="2"/>
        ${wave(448, 136, 166, 16, 4, 'c1', 'rl-pulse')}${wave(462, 136, 152, 8, 4, 'bad', 'rl-pulse d2')}
        ${T(531, 186, 'late copy: hollow tone', { f: 'bad', z: 12 })}${T(320, 30, 'both faders up', { f: 'muted' })}</g>
      <g data-step="4">${person(150, 120, 'c1')}${person(490, 120, 'c2')}${mic(176, 96, 'c1')}${mic(464, 96, 'c2')}
        ${T(150, 246, 'Arun')}${T(490, 246, 'Divya')}
        <path d="M162 116 L170 104" stroke="var(--c1)" stroke-width="5" class="rl-flow"/><path d="M478 116 L470 104" stroke="var(--c2)" stroke-width="5" class="rl-flow"/></g>
      <g data-step="=4">${T(320, 30, '1 m apart, mics at 15 cm', { f: 'accent' })}</g>
      <g data-step="5"><path d="M164 112 L456 96" stroke="var(--muted)" stroke-width="1.5" fill="none" class="rl-flow slow" opacity=".6"/>
        ${T(320, 30, 'leak now about −16 dB: clean', { f: 'good' })}</g>
    </svg>`,
    steps: [
      ['Two singers, close together', 'Each has a microphone at 30 cm. The other singer’s microphone is only about twice as far away.'],
      ['Each voice reaches both mics', 'Twice the distance is just 6 dB quieter, and it arrives about 1 ms later.'],
      ['The mix combines them', 'A late copy that is nearly as loud cancels some notes and boosts others. The tone turns hollow.'],
      ['Spread out and move in', 'Singers 1 m apart with microphones at 15 cm: each microphone now strongly favours its own singer.'],
      ['The leak becomes harmless', 'At about 16 dB down, plus the microphone’s dead side, the late copy is too quiet to change the tone.'],
    ],
    why: [
      'Cancellation needs two copies of similar strength. Make one copy three times farther away and it is nearly 10 dB down, too weak to carve holes.',
      'Distance is free and works at every frequency; no equaliser can put back notes that have cancelled.',
      'Listening to both microphones together is the only real test, because each one sounds fine on its own.',
    ],
    uses: [
      ['🥁', 'Snare top and bottom', 'The two mics face each other, so flip the polarity of the bottom one and keep whichever setting gives more low end.'],
      ['🎸', 'Guitar and voice together', 'Aim the vocal mic’s dead side down at the guitar and the guitar mic’s dead side up at the mouth.'],
      ['🎤', 'Panel discussion', 'Give each speaker a close microphone and keep neighbours at least three times that distance from it.'],
    ],
    tryit: [
      'Record one voice on two phones: one at 15 cm, one at 30 cm. Line both up in a free editor and play them together.',
      'Move the second phone to 60 cm and repeat. Notice the hollowness fading as the second copy gets weaker.',
      'Slide one track a few milliseconds in the editor and hear the tone change like a slow “whoosh”.',
    ],
    slip: ['Checking each microphone only in solo.', 'Bring both faders up together, listen for thinness, and fix it with distance and aiming before reaching for EQ.'],
  });

  /* ---------------------------------------------------------------- R4 */
  REAL('r-session', {
    title: 'the perfect take that clipped',
    plain: 'Leave empty space above the loudest sound when you record. A digital recorder has a hard ceiling, and anything that hits it is damaged for good, while recording a bit lower costs nothing.',
    where: 'A vocal overdub in a home studio in Chennai',
    story: `<p>Kavya sets the singer’s level so the verse peaks just under the top of the meter, because it “looks healthy”. In the last chorus the singer gives everything, about 8 dB louder. The best take of the night has crunchy, flattened peaks that no tool can fully repair.</p>
      <p>For the next song she asks the singer to sing the loudest line first and sets the gain so that line peaks around −12 dBFS. The verse now looks small on the meter, but the recording is clean and still far above the noise.</p>`,
    numbers: [['First attempt: verse peaks', '−3 dBFS'], ['Chorus is louder by', '8 dB → would be +5 dBFS: clipped'], ['Second attempt: loudest line', '−12 dBFS, verse about −20 dBFS'], ['Noise floor of a decent 24-bit chain', 'around −100 dBFS or lower'], ['Cost of recording 9 dB lower', 'none you can hear']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Recording level with and without headroom">
      <line x1="60" y1="40" x2="600" y2="40" stroke="var(--bad)" stroke-width="2.5"/>${T(604, 34, '0 dBFS ceiling', { a: 'end', f: 'bad', z: 12 })}
      <line x1="60" y1="218" x2="600" y2="218" stroke="var(--line)" stroke-width="2"/>${T(604, 236, 'noise floor far below', { a: 'end', f: 'muted', z: 12 })}
      ${T(190, 250, 'verse')}${T(450, 250, 'last chorus')}
      <g data-step="1-2"><rect x="100" y="56" width="180" height="162" rx="6" fill="var(--c2)" opacity=".55" class="rl-pulse"/></g>
      <g data-step="=1">${T(190, 110, 'peaks at −3: “looks healthy”')}</g>
      <g data-step="=2"><rect x="360" y="40" width="180" height="178" rx="6" fill="var(--bad)" opacity=".6"/>
        <rect x="360" y="12" width="180" height="28" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 5" class="rl-pulse"/>
        ${T(450, 30, '5 dB cut off', { f: 'bad' })}${T(450, 130, 'flattened peaks')}</g>
      <g data-step="3"><line x1="60" y1="96" x2="600" y2="96" stroke="var(--good)" stroke-width="2" class="rl-flow slow"/>${T(64, 90, '−12 dBFS target', { a: 'start', f: 'good', z: 12 })}</g>
      <g data-step="3"><rect x="100" y="134" width="180" height="84" rx="6" fill="var(--c2)" opacity=".55"/></g>
      <g data-step="4"><rect x="360" y="96" width="180" height="122" rx="6" fill="var(--good)" opacity=".55" class="rl-pulse"/></g>
      <g data-step="=4">${T(450, 160, 'loudest line fits')}</g>
      <g data-step="=5"><path d="M320 96 V44" stroke="var(--accent)" stroke-width="3" class="rl-flow"/>${T(332, 74, '12 dB of safety', { f: 'accent', a: 'start' })}
        ${T(190, 180, 'looks small, sounds clean')}</g>
    </svg>`,
    steps: [
      ['Level set on the quiet part', 'The verse peaks at −3 dBFS. The meter looks full, which feels reassuring.'],
      ['The chorus arrives', 'It is 8 dB louder. There is no room above the ceiling, so the tops of the waveform are simply cut off.'],
      ['Set a target with space', 'Aim for the loudest moment to peak around −12 dBFS. Have the performer play that moment first.'],
      ['The loud line fits', 'The chorus now lands well under the ceiling, and the verse sits about 8 dB below it.'],
      ['Nothing was lost', 'A modern chain’s noise sits around 100 dB below the ceiling, so recording lower still leaves a huge clean range.'],
    ],
    why: [
      'Digital clipping is not a gradual squeeze like tape. The waveform is chopped flat, which adds harsh distortion that cannot be undone.',
      'Performers always get louder when the red light is on. Headroom is insurance against the take you most want to keep.',
      'With 24-bit recording the quiet end is so far down that using only the lower part of the meter loses no quality.',
    ],
    uses: [
      ['🎤', 'Vocals and acoustic instruments', 'Rehearse the loudest phrase, set peaks near −12 dBFS, and leave the gain alone for the rest of the song.'],
      ['🥁', 'Drums', 'Hits vary a lot: aim for peaks around −10 to −12 dBFS on close mics and check after a hard fill.'],
      ['🎥', 'Live event recording', 'You get one chance, so peak near −18 dBFS and run a second, safety copy 10 dB lower if the recorder allows.'],
    ],
    tryit: [
      'Open any recording app that shows a level meter. Speak normally, then shout one word. Note how many dB the meter jumps.',
      'Set the input so the shout stays below the top. Record a sentence that ends with the shout.',
      'Now raise the input until normal speech looks “full”, repeat, and listen to what the shout sounds like.',
    ],
    slip: ['Setting the gain so the meter looks full during the soundcheck.', 'Set it on the loudest moment the performer will produce, with about 12 dB to spare, then turn up your headphones instead.'],
  });

  /* ---------------------------------------------------------------- R5 */
  REAL('r-daw', {
    title: 'the guitarist who heard himself late',
    plain: 'A computer handles sound in small batches. A big batch gives the computer an easy job but makes you hear yourself late; a small batch is quick but works the computer harder.',
    where: 'A laptop studio on a desk in Hyderabad',
    story: `<p>Imran plugs his guitar into an audio interface and plays through an amp plug-in. Every note comes back a moment after he picks it, and his timing falls apart. His buffer is set to 512 samples.</p>
      <p>He lowers the buffer to 64 samples while recording and the guitar feels immediate. Later, when mixing forty tracks with many plug-ins, the audio starts to crackle, so he raises the buffer to 1024. Nobody is playing live at that stage, so the delay no longer matters.</p>`,
    numbers: [['Buffer 512 at 48 kHz', '512 ÷ 48 000 = 10.7 ms each way'], ['In and out plus converters', 'about 23 ms round trip'], ['Like standing this far from an amp', '0.023 × 343 ≈ 8 m'], ['Buffer 64', '1.3 ms each way, about 4–5 ms round trip'], ['Most players notice from', 'roughly 10–12 ms']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Audio passing through input and output buffers causing delay">
      ${box(20, 96, 90, 56, 'guitar', 'c1')}${box(150, 96, 100, 56, 'interface', 'muted')}${box(290, 70, 170, 108, '', 'c2')}${T(375, 60, 'computer')}${box(510, 96, 110, 56, 'headphones', 'c4')}
      <path d="M110 124 H150 M250 124 H290 M460 124 H510" stroke="var(--muted)" stroke-width="2.5" class="rl-flow"/>
      <g data-step="1-2">${Array.from({ length: 8 }, (_, i) => `<rect x="${300 + i * 19}" y="92" width="15" height="28" rx="3" fill="var(--bad)" opacity=".7" class="rl-pulse${i % 3 === 1 ? ' d2' : i % 3 === 2 ? ' d3' : ''}"/>`).join('')}
        ${Array.from({ length: 8 }, (_, i) => `<rect x="${300 + i * 19}" y="132" width="15" height="28" rx="3" fill="var(--bad)" opacity=".7" class="rl-pulse${i % 3 === 0 ? ' d2' : ''}"/>`).join('')}</g>
      <g data-step="=1">${T(375, 204, 'buffer 512: wait for a full batch', { f: 'bad' })}</g>
      <g data-step="=2">${T(375, 204, 'in + out ≈ 23 ms late', { f: 'bad' })}<circle cx="565" cy="60" r="12" fill="none" stroke="var(--bad)" stroke-width="3" class="rl-grow"/>${T(565, 40, 'late', { f: 'bad' })}</g>
      <g data-step="3-4"><rect x="300" y="92" width="15" height="28" rx="3" fill="var(--good)" class="rl-pulse"/><rect x="300" y="132" width="15" height="28" rx="3" fill="var(--good)" class="rl-pulse d2"/></g>
      <g data-step="=3">${T(375, 204, 'buffer 64: tiny batches', { f: 'good' })}</g>
      <g data-step="=4">${T(375, 204, 'about 4–5 ms: feels instant', { f: 'good' })}<circle cx="565" cy="60" r="12" fill="none" stroke="var(--good)" stroke-width="3" class="rl-grow"/></g>
      <g data-step="=5">${Array.from({ length: 8 }, (_, i) => `<rect x="${300 + i * 19}" y="92" width="15" height="68" rx="3" fill="var(--c3)" opacity=".6" class="rl-pulse${i % 2 ? ' d2' : ''}"/>`).join('')}
        ${T(375, 204, 'mixing: big buffer, no crackle', { f: 'c3' })}</g>
    </svg>`,
    steps: [
      ['Sound is handled in batches', 'The computer collects a batch of samples (the buffer), processes it, then hands a batch to the output.'],
      ['Big batch, long wait', 'At 512 samples each batch lasts 10.7 ms. In plus out plus conversion makes the guitar about 23 ms late.'],
      ['Shrink the batch to record', 'At 64 samples each batch is only 1.3 ms long, so the computer passes sound through almost at once.'],
      ['The delay drops below notice', 'Around 4–5 ms is like standing 1.5 m from an amplifier. Playing feels natural again.'],
      ['Grow it again to mix', 'Small batches leave the processor little time. With a heavy mix, raise the buffer; nobody is playing live now.'],
    ],
    why: [
      'A buffer is a safety queue. A long queue rides out busy moments in the computer; a short one empties quickly but can run dry, which you hear as clicks.',
      'Delay only matters when someone is performing and listening at the same moment. During mixing, a tenth of a second would go unnoticed.',
      'Many interfaces can send the input straight to the headphones before the computer (direct monitoring), which avoids the delay altogether.',
    ],
    uses: [
      ['🎹', 'Playing software instruments', 'Use 64 or 128 samples so keys respond immediately; freeze heavy tracks if the audio crackles.'],
      ['🎤', 'Singer hearing themselves', 'Switch on direct monitoring at the interface and mute the software return to avoid a doubled, delayed voice.'],
      ['🎚️', 'A large mix', 'Set 1024 or 2048 samples for stable playback, and go back down before the next overdub.'],
    ],
    tryit: [
      'Work out your own delay: buffer size ÷ sample rate × 1000 gives milliseconds one way. Double it and add about 2 ms.',
      'If you have any recording program, set the largest buffer and clap or tap while listening through the software. Notice the slap.',
      'Halve the buffer step by step until the slap disappears, and note the setting at which crackles begin.',
    ],
    slip: ['Leaving one buffer setting for everything.', 'Use a small buffer (or direct monitoring) while performing and a large one while mixing.'],
  });

  /* ---------------------------------------------------------------- R6 */
  const fader = (x, lvl, c, label) => `<rect x="${x - 3}" y="60" width="6" height="130" rx="3" fill="var(--line)"/>${T(x, 212, label, { z: 12 })}`;
  const knob = (x, y, c) => `<rect x="${x - 15}" y="${y - 8}" width="30" height="16" rx="4" fill="var(--${c})"/>`;
  REAL('r-mix-balance', {
    title: 'the vocal that kept getting turned up',
    plain: 'A mix is about how loud things are compared with each other. Turning one thing up and turning the things around it down give the same balance, but only one of them keeps you away from the ceiling.',
    where: 'A five-track demo: drums, bass, two guitars and a voice',
    story: `<p>Sneha cannot hear the vocal, so she raises it 3 dB. Now the guitars feel small, so they go up. Then the drums. After three rounds every fader is higher, the output meter is in the red, and the vocal is exactly as buried as before.</p>
      <p>She pulls everything back, sets the drums and bass so the mix peaks around −6 dBFS, and instead of lifting the vocal she lowers both guitars by 2 dB and pans them left and right. The middle opens up and the voice is clear at the original fader position.</p>`,
    numbers: [['Vocal up 3 dB, three rounds', 'everything +9 dB: output clips'], ['Vocal +2 dB or guitars −2 dB', 'same balance between them'], ['Starting point for the mix bus', 'peaks near −6 dBFS'], ['Guitars panned', 'about 60 % left and right'], ['Level a small change is heard at', 'about 1 dB']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Balancing a mix by turning competing parts down and panning them">
      <line x1="40" y1="60" x2="330" y2="60" stroke="var(--bad)" stroke-width="2"/>${T(40, 52, 'ceiling', { a: 'start', f: 'bad', z: 12 })}
      ${fader(70, 0, '', 'drums')}${fader(130, 0, '', 'bass')}${fader(190, 0, '', 'gtr 1')}${fader(250, 0, '', 'gtr 2')}${fader(310, 0, '', 'voice')}
      <g data-step="=1">${knob(70, 130, 'muted')}${knob(130, 130, 'muted')}${knob(190, 126, 'c2')}${knob(250, 126, 'c2')}${knob(310, 132, 'c1')}${T(185, 240, 'the voice is buried', { f: 'muted' })}</g>
      <g data-step="=2">${knob(70, 82, 'bad')}${knob(130, 82, 'bad')}${knob(190, 78, 'bad')}${knob(250, 78, 'bad')}${knob(310, 84, 'bad')}
        <path d="M40 66 H330" stroke="var(--bad)" stroke-width="6" opacity=".4" class="rl-pulse"/>${T(185, 240, 'all up 9 dB: clipping, same balance', { f: 'bad' })}</g>
      <g data-step="3">${knob(70, 130, 'muted')}${knob(130, 130, 'muted')}${knob(310, 132, 'c1')}</g>
      <g data-step="=3">${knob(190, 126, 'c2')}${knob(250, 126, 'c2')}${T(185, 240, 'reset: bus peaks near −6', { f: 'muted' })}</g>
      <g data-step="4"><g class="rl-bob">${knob(190, 142, 'c2')}${knob(250, 142, 'c2')}</g></g>
      <g data-step="=4">${T(185, 240, 'guitars down 2 dB instead', { f: 'good' })}</g>
      <rect x="380" y="50" width="240" height="150" rx="10" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/>${T(500, 40, 'stage between the speakers', { z: 12, f: 'muted' })}
      ${T(396, 190, 'L', { z: 12 })}${T(604, 190, 'R', { z: 12 })}
      <circle cx="500" cy="120" r="20" fill="var(--c1)" opacity=".85"/>${T(500, 125, 'voice', { z: 11 })}
      <g data-step="1-4"><circle cx="486" cy="112" r="24" fill="var(--c2)" opacity=".45"/><circle cx="514" cy="130" r="24" fill="var(--c2)" opacity=".45"/></g>
      <g data-step="5"><circle cx="428" cy="120" r="22" fill="var(--c2)" opacity=".6" class="rl-pulse"/><circle cx="572" cy="120" r="22" fill="var(--c2)" opacity=".6" class="rl-pulse d2"/>
        ${T(428, 160, 'gtr 1', { z: 11 })}${T(572, 160, 'gtr 2', { z: 11 })}</g>
      <g data-step="=5">${T(185, 240, 'pan the guitars: centre is free', { f: 'good' })}</g>
    </svg>`,
    steps: [
      ['The voice is buried', 'Both guitars sit in the middle with the vocal, at about the same level and in the same range of notes.'],
      ['Turning up, round after round', 'Each lift makes something else feel small. Soon every fader is 9 dB higher and the output is clipping.'],
      ['Reset with headroom', 'Bring everything down so the whole mix peaks near −6 dBFS. Loudness comes later, from the volume knob.'],
      ['Turn the rivals down', 'Lowering the guitars 2 dB gives the same vocal-to-guitar balance as raising the voice, with no clipping.'],
      ['Move them out of the way', 'Panned left and right, the guitars stop covering the centre, and the voice is clear without being louder.'],
    ],
    why: [
      'Ears judge balance by comparison. If everything rises together, nothing has changed except how close you are to distortion.',
      'Two sounds in the same place and the same pitch range hide each other. Separating them by position works like separating two people talking.',
      'A mix with space above it is easier to work on: every later move has somewhere to go.',
    ],
    uses: [
      ['🎚️', 'Starting any mix', 'Pull all faders down, bring up drums and bass to peak near −6 dBFS, then fit everything else around them.'],
      ['🎤', 'Live sound', 'When the singer asks for “more me”, try a little less guitar in that monitor first; the stage gets quieter, not louder.'],
      ['🎬', 'Dialogue over music', 'Dip the music 3–6 dB under speech rather than pushing the voice up into distortion.'],
    ],
    tryit: [
      'Play a song on a phone and a talk-radio stream on another device at once. Make the speech clear by only turning the music down.',
      'Now place the two devices on your left and right instead of together. Notice how much louder the music can be before speech is lost.',
      'In any mixing app, write down your fader positions, lower all of them by 6 dB, and turn your speakers up to match. Compare the output meter.',
    ],
    slip: ['Fixing “I can’t hear it” by turning that track up every time.', 'Ask what is covering it, then turn that down or move it aside, and keep the master well below the ceiling.'],
  });

  /* ---------------------------------------------------------------- R7 */
  const hump = (cx, w, h, c, cls, op) => `<path d="M${cx - w} 200 C${cx - w / 2} 200 ${cx - w / 2} ${200 - h * 2} ${cx} ${200 - h * 2} C${cx + w / 2} ${200 - h * 2} ${cx + w / 2} 200 ${cx + w} 200 Z" fill="var(--${c})" opacity="${op || 0.5}"${cls ? ` class="${cls}"` : ''}/>`;
  const faxis = `<line x1="40" y1="200" x2="610" y2="200" stroke="var(--line)" stroke-width="2"/>${[['40 Hz', 70], ['60', 130], ['100', 205], ['200', 300], ['400', 390], ['1 k', 500], ['3 k', 590]].map(([l, x]) => `<line x1="${x}" y1="200" x2="${x}" y2="206" stroke="var(--muted)"/>${T(x, 222, l, { z: 11, f: 'muted' })}`).join('')}`;
  REAL('r-mix-eq', {
    title: 'the kick and the bass that became one blur',
    plain: 'Two instruments that live at the same pitch range cover each other up. An equaliser lets you turn down a small slice of one so the other can be heard through it.',
    where: 'A rock demo mixed on headphones in a hostel room',
    story: `<p>In Rohan’s mix the kick drum and bass guitar sound powerful alone, but together the low end is a single boomy cloud. Boosting the bass on both, his first idea, makes it worse.</p>
      <p>He finds that the kick’s thump is around 60 Hz and the bass guitar’s body is around 100 Hz. He cuts the bass guitar 3 dB at 60 Hz, cuts the kick 3 dB at 100 Hz, and filters everything below 100 Hz out of the guitars, which were adding rumble nobody could hear as guitar. Now each low instrument has its own slot.</p>`,
    numbers: [['Kick drum thump', 'around 60 Hz'], ['Bass guitar body', 'around 100 Hz'], ['Cut on bass guitar at 60 Hz', '−3 dB, medium width'], ['Cut on kick at 100 Hz', '−3 dB, medium width'], ['High-pass filter on guitars', '100 Hz']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Kick drum and bass guitar spectra overlapping, then separated with equaliser cuts">
      ${faxis}
      <g data-step="1-2">${hump(150, 110, 60, 'c1', 'rl-pulse')}${hump(190, 120, 58, 'c2', 'rl-pulse d2')}</g>
      <g data-step="=1">${T(150, 60, 'kick', { f: 'c1' })}${T(240, 60, 'bass guitar', { f: 'c2' })}</g>
      <g data-step="=2">${T(320, 40, 'same slot: one boomy cloud', { f: 'bad' })}<rect x="100" y="78" width="140" height="122" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="6 5" class="rl-pulse"/></g>
      <g data-step="3-5">${hump(130, 62, 62, 'c1', 'rl-pulse')}${hump(215, 66, 58, 'c2', 'rl-pulse d2')}</g>
      <g data-step="=3"><path d="M130 96 V150" stroke="var(--c2)" stroke-width="3" class="rl-flow"/>${T(130, 60, 'bass: −3 dB at 60 Hz', { f: 'c2', a: 'start' })}</g>
      <g data-step="=4"><path d="M205 96 V150" stroke="var(--c1)" stroke-width="3" class="rl-flow"/>${T(215, 60, 'kick: −3 dB at 100 Hz', { f: 'c1', a: 'start' })}</g>
      <g data-step="1-4">${hump(330, 240, 30, 'c3', '', 0.3)}</g>
      <g data-step="=1">${T(450, 150, 'guitars', { f: 'c3' })}</g>
      <g data-step="5">${hump(400, 190, 32, 'c3', '', 0.35)}<path d="M205 200 Q215 150 250 176" fill="none" stroke="var(--c3)" stroke-width="2.5" class="rl-flow"/></g>
      <g data-step="=5">${T(430, 60, 'guitars filtered below 100 Hz', { f: 'c3' })}${T(170, 40, 'each low part has a slot', { f: 'good' })}</g>
    </svg>`,
    steps: [
      ['Two parts, one range', 'The kick and the bass guitar both put most of their energy between about 50 and 120 Hz.'],
      ['They mask each other', 'Where they overlap you cannot tell them apart, so the low end sounds like one cloud. Boosting adds to the pile.'],
      ['Give the kick 60 Hz', 'Cut a few dB from the bass guitar at 60 Hz. The kick’s thump now pokes through that gap.'],
      ['Give the bass 100 Hz', 'Cut the kick slightly at 100 Hz, so the bass guitar’s body has its own place just above.'],
      ['Clear out the passengers', 'Guitars carry rumble below 100 Hz that you never hear as guitar. Filter it out and the low end tightens.'],
    ],
    why: [
      'A loud sound hides quieter sounds near it in pitch. Lowering one of them in just that region uncovers the other without changing overall levels much.',
      'Cutting leaves headroom alone; boosting eats it. That is why “cut first” is the usual method.',
      'Low-frequency energy you cannot hear as part of an instrument still uses up level and muddies the instruments that live there.',
    ],
    uses: [
      ['🎤', 'Voice over guitars or keys', 'Dip the accompaniment 2–3 dB around 2–4 kHz, where speech clarity sits, rather than brightening the voice.'],
      ['🎙️', 'Podcast or lecture recording', 'High-pass the voice at 80–100 Hz to remove handling noise and room rumble with no change to the speech.'],
      ['🔊', 'Live stage', 'Filter the low end out of every channel that is not kick, bass or keys; the subwoofers get cleaner at once.'],
    ],
    tryit: [
      'In any music app with an equaliser, play a song and pull the 60 Hz slider right down, then the 100–125 Hz slider. Notice which one removes the kick and which the bass line.',
      'Hum a low note while a fan runs. Then hum a higher note. Notice the fan hides the low hum more.',
      'On a phone recording of your voice, apply a low-cut (many editors call it “bass roll-off”) and listen for what is lost: usually only thumps.',
    ],
    slip: ['Boosting bass on both the kick and the bass guitar to make the low end bigger.', 'Decide which one owns which slice, cut the other there by a few dB, and filter lows from everything else.'],
  });

  /* ---------------------------------------------------------------- R8 */
  const bars = (ys, c, cls) => ys.map((h, i) => `<rect x="${70 + i * 44}" y="${200 - h}" width="30" height="${h}" rx="4" fill="var(--${c})" opacity=".7"${cls ? ` class="${cls}${i % 2 ? ' d2' : ''}"` : ''}/>`).join('');
  REAL('r-mix-dynamics', {
    title: 'the singer who whispered and belted',
    plain: 'A compressor is an automatic hand on the volume: when the sound goes above a set level it turns it down by a set proportion. Loud and quiet moments end up closer together, so the whole part can sit higher in the mix.',
    where: 'A ballad vocal in a home studio in Pune',
    story: `<p>Ananya’s verses peak around −20 dBFS and her choruses reach −6 dBFS. With the fader set for the chorus the verses vanish under the piano; set for the verses, the chorus leaps out painfully.</p>
      <p>She puts a compressor on the vocal with the threshold at −18 dBFS and a ratio of 4:1. The chorus peaks, 12 dB over the threshold, come out only 3 dB over. The verses, below the threshold, are untouched. She then adds 6 dB of make-up gain. The difference between whisper and belt has shrunk from 14 dB to 5 dB, and one fader position works for the whole song.</p>`,
    numbers: [['Verse / chorus peaks before', '−20 / −6 dBFS: 14 dB apart'], ['Chorus over the −18 threshold', '12 dB'], ['After 4:1', '12 ÷ 4 = 3 dB over → −15 dBFS'], ['Gain reduction on the chorus', '9 dB'], ['After +6 dB make-up', '−14 / −9 dBFS: 5 dB apart']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A compressor reducing loud vocal peaks above a threshold and make-up gain raising the whole part">
      <line x1="50" y1="200" x2="610" y2="200" stroke="var(--line)" stroke-width="2"/>
      ${T(180, 224, 'verse')}${T(440, 224, 'chorus')}
      <g data-step="1-2">${bars([40, 46, 38, 44, 42, 48], 'c2', 'rl-pulse')}${[150, 160, 146, 158, 152, 156].map((h, i) => `<rect x="${334 + i * 44}" y="${200 - h}" width="30" height="${h}" rx="4" fill="var(--c1)" opacity=".7" class="rl-pulse${i % 2 ? ' d2' : ''}"/>`).join('')}</g>
      <g data-step="=1">${T(180, 140, 'quiet: −20', { f: 'c2' })}${T(460, 30, 'loud: −6', { f: 'c1' })}</g>
      <g data-step="2"><line x1="50" y1="140" x2="610" y2="140" stroke="var(--accent)" stroke-width="2.5" class="rl-flow slow"/></g><g data-step="2-4">${T(56, 134, 'threshold −18', { a: 'start', f: 'accent', z: 12 })}</g>
      <g data-step="3-4">${bars([40, 46, 38, 44, 42, 48], 'c2')}${[75, 78, 74, 77, 76, 77].map((h, i) => `<rect x="${334 + i * 44}" y="${200 - h}" width="30" height="${h}" rx="4" fill="var(--c1)" opacity=".7"/>`).join('')}</g>
      <g data-step="=3">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${349 + i * 44} 48 V118" stroke="var(--bad)" stroke-width="2.5" class="rl-flow${i % 2 ? ' d2' : ''}"/>`).join('')}${T(460, 30, 'pushed down 9 dB', { f: 'bad' })}</g>
      <g data-step="=4">${T(180, 140, 'verse untouched', { f: 'c2' })}${T(460, 100, 'only 3 dB over', { f: 'c1' })}</g>
      <g data-step="5"><g class="rl-bob">${[70, 76, 68, 74, 72, 78].map((h, i) => `<rect x="${70 + i * 44}" y="${200 - h}" width="30" height="${h}" rx="4" fill="var(--good)" opacity=".7"/>`).join('')}${[105, 108, 104, 107, 106, 107].map((h, i) => `<rect x="${334 + i * 44}" y="${200 - h}" width="30" height="${h}" rx="4" fill="var(--good)" opacity=".7"/>`).join('')}</g>
        ${T(320, 30, 'make-up +6 dB: whole part higher, 5 dB apart', { f: 'good' })}</g>
    </svg>`,
    steps: [
      ['Whisper and belt', 'The verse peaks at −20 dBFS and the chorus at −6. No single fader setting suits both.'],
      ['Set a threshold', 'At −18 dBFS the threshold sits just above the verse, so only the loud moments will be touched.'],
      ['The ratio turns peaks down', 'At 4:1, every 4 dB over the threshold comes out as 1 dB over. The 12 dB overshoot becomes 3 dB.'],
      ['Quiet parts pass untouched', 'Anything under the threshold is left exactly as it was. The gap has shrunk from 14 dB to 5 dB.'],
      ['Make-up gain lifts it all', 'Adding 6 dB brings the whole, now more even, vocal up so the verses are heard without the chorus jumping out.'],
    ],
    why: [
      'It does what an engineer’s hand on the fader does, only faster and the same way every time.',
      'Because only the loudest moments are lowered, the average level can be raised: the part sounds louder and steadier at the same peak.',
      'Attack and release decide how quickly the “hand” moves. Slow attack lets the start of each note through; fast release lets it recover between words.',
    ],
    uses: [
      ['🎤', 'Lead vocal', 'Ratio 3:1–4:1, threshold set for 3–6 dB of reduction on loud lines; ride the fader for anything bigger.'],
      ['🎸', 'Bass guitar', 'About 4:1 with 4–8 dB of reduction keeps every note the same size so the low end stays even.'],
      ['📢', 'Announcements and podcasts', 'Gentle 2:1–3:1 keeps a speaker who turns their head or drops their voice at a steady, understandable level.'],
    ],
    tryit: [
      'Work this by hand: threshold −20, ratio 2:1, a peak at −8. How far over is it, what comes out, and how much reduction is that? (12 over → 6 over → −14, so 6 dB.)',
      'Record yourself whispering one sentence and calling out the next. Watch the meter and write down both peak levels.',
      'If your recording app has a compressor or “leveller”, switch it on and repeat. Note how much closer the two readings are.',
    ],
    slip: ['Adding compression until the meter stops moving, then wondering why the track sounds flat and noisy.', 'Aim for a few dB of reduction on the loudest lines only, and use fader moves for the big differences between sections.'],
  });

  /* ---------------------------------------------------------------- R9 */
  REAL('r-mix-space', {
    title: 'the reverb that washed out the words',
    plain: 'Reverb makes a sound seem farther away. A short gap of silence before the reverb starts lets the dry sound be heard first, so you get the sense of space without losing closeness or clarity.',
    where: 'A slow song at 75 beats per minute',
    story: `<p>Farhan adds a big hall reverb straight onto a vocal. It sounds lush in solo, but in the mix the singer seems to stand at the back of the hall and the words smear into each other.</p>
      <p>He moves the reverb to a send, sets a pre-delay of 50 ms, shortens the decay so the tail has faded by the second beat after each word, and filters the low end out of the reverb return. The singer steps forward again, the words stay crisp, and the hall is still there behind her.</p>`,
    numbers: [['One beat at 75 BPM', '60 000 ÷ 75 = 800 ms'], ['Eighth-note echo', '400 ms'], ['Pre-delay (a sixty-fourth note)', '800 ÷ 16 = 50 ms'], ['Decay chosen', 'about 1.6 s (two beats)'], ['Low-cut on the reverb return', 'around 200–300 Hz']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Timeline of a dry vocal word, a pre-delay gap and a reverb tail against the beat">
      <line x1="40" y1="200" x2="610" y2="200" stroke="var(--line)" stroke-width="2"/>
      ${[0, 1, 2, 3].map((i) => `<line x1="${80 + i * 170}" y1="60" x2="${80 + i * 170}" y2="206" stroke="var(--muted)" stroke-dasharray="3 5"/>${T(80 + i * 170, 224, 'beat ' + (i + 1), { z: 11, f: 'muted' })}`).join('')}
      <rect x="80" y="100" width="34" height="100" rx="4" fill="var(--c1)"/>${T(97, 90, 'word', { z: 12, f: 'c1' })}
      <rect x="250" y="120" width="34" height="80" rx="4" fill="var(--c1)" opacity=".9"/>
      <g data-step="1-2"><path d="M80 200 L84 96 Q300 150 600 196 L600 200 Z" fill="var(--c3)" opacity=".5" class="rl-pulse"/></g>
      <g data-step="=1">${T(380, 110, 'reverb starts with the word', { f: 'c3' })}</g>
      <g data-step="=2">${T(380, 110, 'tail covers the next words', { f: 'bad' })}<rect x="246" y="116" width="42" height="88" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 4" class="rl-pulse"/></g>
      <g data-step="3-5"><path d="M124 200 L128 110 Q250 170 420 198 L420 200 Z" fill="var(--c3)" opacity=".5"/></g>
      <g data-step="3"><path d="M114 80 H126" stroke="var(--accent)" stroke-width="3"/><path d="M114 74 V86 M126 74 V86" stroke="var(--accent)" stroke-width="2"/></g>
      <g data-step="=3">${T(130, 62, '50 ms gap: word heard first', { f: 'accent', a: 'start' })}</g>
      <g data-step="=4"><path d="M420 200 V150" stroke="var(--good)" stroke-width="2.5" class="rl-flow"/>${T(430, 140, 'tail gone by beat 3', { f: 'good' })}</g>
      <g data-step="=5"><path d="M130 196 Q260 188 418 199" fill="none" stroke="var(--c4)" stroke-width="3" class="rl-flow slow"/>${T(350, 100, 'lows filtered from the reverb', { f: 'c4' })}${T(350, 120, 'no mud under the mix', { f: 'c4', z: 12 })}</g>
    </svg>`,
    steps: [
      ['Reverb glued to the voice', 'The echo starts the instant the word does, so the ear hears voice and hall as one distant sound.'],
      ['A long tail smears the line', 'A decay of several seconds is still ringing when the next words arrive, and covers them.'],
      ['Add a short gap', 'With 50 ms of pre-delay the dry word is heard on its own first. The singer stays close; the hall sits behind.'],
      ['Fit the tail to the tempo', 'A decay of about two beats (1.6 s here) fades out before it can pile up on later phrases.'],
      ['Thin out the reverb itself', 'Low notes in a reverb only add mud. Cutting below 200–300 Hz on the return keeps the space and loses the fog.'],
    ],
    why: [
      'In a real room, the closer you are to someone, the longer the gap between their voice and the first reflections. Pre-delay copies that cue.',
      'The ear follows the first arrival to decide what a sound is and where it is; later sound adds size as long as it does not bury new words.',
      'Putting the reverb on a send keeps the dry signal untouched and lets you equalise and time the reverb separately.',
    ],
    uses: [
      ['🎤', 'Lead vocal', 'Pre-delay 30–60 ms, decay timed to one or two beats, and automate the send down in busy sections.'],
      ['🥁', 'Snare drum', 'A short plate with the tail ending just before the next snare hit gives size without clutter.'],
      ['🎬', 'Dialogue in film sound', 'Match the reverb to the picture: a little, short and bright for a kitchen; longer with more pre-delay for a hall.'],
    ],
    tryit: [
      'Work out your own song: 60 000 ÷ tempo gives one beat in ms. Halve it for an eighth-note echo; divide by 16 for a pre-delay.',
      'Clap once close to a wall, then from the middle of the room. Notice how the gap before the echo changes how “near” you feel to yourself.',
      'In any app with reverb, set the dry/wet so you only just miss the reverb when it is switched off. That is usually the right amount.',
    ],
    slip: ['Choosing reverb with the track soloed, so it sounds big and beautiful on its own.', 'Set it with the whole mix playing, on a send, with pre-delay and a low-cut, and turn it down until you only notice it when it is muted.'],
  });

  /* ---------------------------------------------------------------- R10 */
  const spikes = (x0, hs, c, cls) => hs.map((h, i) => `<rect x="${x0 + i * 13}" y="${130 - h}" width="8" height="${h * 2}" rx="2" fill="var(--${c})" opacity=".8"${cls ? ` class="${cls}"` : ''}/>`).join('');
  REAL('r-mastering', {
    title: 'the loud master that came out quieter',
    plain: 'Streaming services turn every song up or down so they all play at about the same loudness. A song squashed to be very loud is simply turned down, and then it has less punch than a song that kept its peaks.',
    where: 'Two singles uploaded to the same streaming service',
    story: `<p>Vikram pushes his single through a limiter until it measures −8 LUFS, sure that louder will stand out. His friend Leela leaves hers at −14 LUFS with peaks at −1 dBTP and lively drums.</p>
      <p>The service plays both at about −14 LUFS. Vikram’s song is turned down 6 dB, so its flattened peaks now sit at −7 dBTP. Leela’s is untouched, and her drum hits reach 6 dB higher than his. Played one after the other, hers sounds bigger and his sounds small and dense.</p>`,
    numbers: [['Vikram’s master', '−8 LUFS, peaks −1 dBTP'], ['Service target', 'about −14 LUFS'], ['His playback change', '−14 − (−8) = −6 dB'], ['His peaks after the change', '−7 dBTP'], ['Leela’s master', '−14 LUFS, peaks −1 dBTP: unchanged']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Two masters before and after loudness normalisation by a streaming service">
      <line x1="40" y1="40" x2="610" y2="40" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="4 4"/>${T(606, 34, 'peak ceiling', { a: 'end', z: 11, f: 'bad' })}
      ${T(170, 246, 'Vikram: −8 LUFS')}${T(470, 246, 'Leela: −14 LUFS')}
      <g data-step="1-2">${spikes(60, [84, 86, 85, 86, 84, 86, 85, 86, 85, 84, 86, 85, 86, 84, 85, 86, 85], 'c1', 'rl-pulse')}</g>
      <g data-step="=1">${T(170, 22, 'squashed flat to be loud', { f: 'c1' })}</g>
      ${spikes(360, [30, 86, 34, 40, 84, 32, 44, 86, 30, 36, 82, 34, 46, 86, 32, 38, 84], 'c2', 'rl-pulse d2')}
      <g data-step="=2">${T(470, 22, 'peaks kept, quieter on average', { f: 'c2' })}</g>
      <g data-step="=3"><path d="M40 86 H610" stroke="var(--accent)" stroke-width="2" class="rl-flow slow"/>${T(320, 22, 'the service plays both at −14 LUFS', { f: 'accent' })}
        ${spikes(60, [84, 86, 85, 86, 84, 86, 85, 86, 85, 84, 86, 85, 86, 84, 85, 86, 85], 'c1')}<path d="M170 50 V80" stroke="var(--bad)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="4">${spikes(60, [42, 43, 42, 43, 42, 43, 42, 43, 42, 42, 43, 42, 43, 42, 42, 43, 42], 'c1')}</g>
      <g data-step="=4">${T(170, 22, 'turned down 6 dB', { f: 'bad' })}${T(170, 70, 'peaks now −7 dBTP', { f: 'c1', z: 12 })}</g>
      <g data-step="=5"><path d="M340 46 V86" stroke="var(--good)" stroke-width="3"/><path d="M334 46 H346 M334 86 H346" stroke="var(--good)" stroke-width="2"/>${T(328, 70, '6 dB more punch', { f: 'good', a: 'end' })}
        ${T(170, 22, 'small and dense', { f: 'muted' })}</g>
    </svg>`,
    steps: [
      ['A master made as loud as possible', 'Heavy limiting shaves off every peak, so the song averages −8 LUFS but has almost no difference between loud and soft.'],
      ['A master that kept its peaks', 'The second song averages −14 LUFS. Its drum hits still stand well above the rest of the music.'],
      ['The service levels them', 'To play everything at about the same loudness, it turns the louder song down by the difference: 6 dB.'],
      ['The loud master shrinks', 'After the 6 dB cut its flattened peaks reach only −7 dBTP. The squashing remains; the loudness advantage is gone.'],
      ['The dynamic one wins', 'At equal loudness, the song with real peaks hits 6 dB harder on every drum and sounds larger.'],
    ],
    why: [
      'Loudness meters measure the average over the whole song, close to how we hear, not the tallest peak.',
      'Once playback loudness is equalised, the only thing heavy limiting leaves behind is the damage: flattened drums and distortion.',
      'Peaks are what make a hit feel like a hit. Keeping them is free when the service sets the volume anyway.',
    ],
    uses: [
      ['🎵', 'Releasing music online', 'Aim around −14 to −10 LUFS by ear, true peaks at or below −1 dBTP, and check the service’s current guidance.'],
      ['🎙️', 'Podcasts', 'Target about −16 LUFS for stereo speech so listeners do not reach for the volume between shows.'],
      ['📺', 'Broadcast and adverts', 'Programme loudness is fixed by regulation (around −23 or −24 LUFS), so punch has to come from dynamics, not level.'],
    ],
    tryit: [
      'Pick a modern pop song and an older, more dynamic recording on a streaming app with normalisation switched on. Compare how hard the drums hit.',
      'Switch normalisation off in the app’s settings and compare again. Notice which song jumps in volume.',
      'Work it out: a master at −9 LUFS on a −14 LUFS service is changed by how much? (Turned down 5 dB.)',
    ],
    slip: ['Limiting harder and harder to “compete” on loudness.', 'Match loudness when comparing versions, keep a few dB of real peaks, and leave about 1 dB of true-peak margin.'],
  });

  /* ---------------------------------------------------------------- R11 */
  const fileBox = (x, label, size, hs, c, miss) => `<rect x="${x}" y="70" width="120" height="120" rx="8" fill="var(--panel)" stroke="var(--${c})" stroke-width="2"/>
    ${hs.map((h, i) => `<rect x="${x + 12 + i * 12}" y="${176 - h}" width="8" height="${h}" rx="2" fill="var(--${miss && miss.indexOf(i) >= 0 ? 'line' : c})"${miss && miss.indexOf(i) >= 0 ? ' opacity=".5"' : ''}/>`).join('')}
    ${T(x + 60, 60, label, { z: 12 })}${T(x + 60, 210, size, { z: 12, f: c })}`;
  const HS = [70, 54, 62, 40, 48, 30, 36, 22, 26];
  REAL('r-formats', {
    title: 'the album that lost its cymbals on the way round the band',
    plain: 'Some file types keep every bit of the sound and some throw away the parts you are least likely to notice to make the file small. Throwing away is fine once, at the very end, but each repeat throws away more.',
    where: 'A four-piece band sharing mixes by phone',
    story: `<p>Farida finishes the band’s mixes and sends a small lossy file to the guitarist. He trims the ending and exports it again as a lossy file. The singer adds an intro and exports once more. By the time it comes back, the cymbals sound swirly and the reverb tails are grainy.</p>
      <p>From then on Farida keeps the full-quality master files as the only source. Everyone gets small lossy copies for listening, but any change is made from the master and exported fresh. She also keeps three copies of the masters, one of them away from her house.</p>`,
    numbers: [['1 hour, stereo, 24-bit, 48 kHz', '48 000 × 3 bytes × 2 × 3600 ≈ 1.04 GB'], ['Same hour, lossless packed', 'roughly 0.6 GB, identical when unpacked'], ['Same hour, lossy at 256 kbit/s', '256 000 ÷ 8 × 3600 ≈ 115 MB'], ['Size ratio, master to lossy', 'about 9 to 1'], ['Safe-keeping rule', '3 copies, 2 kinds of storage, 1 off-site']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A master file, a lossless copy, a lossy copy and a re-encoded lossy copy">
      ${fileBox(20, 'master file', '1.04 GB', HS, 'c1')}
      <g data-step="2">${fileBox(175, 'lossless copy', '0.6 GB', HS, 'good')}<path d="M142 130 H172" stroke="var(--good)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=2">${T(235, 26, 'packed smaller, nothing lost', { f: 'good' })}</g>
      <g data-step="3">${fileBox(330, 'lossy copy', '115 MB', HS, 'c2', [5, 7, 8])}<path d="M132 70 V42 H344 V70" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-flow"/></g>
      <g data-step="=3">${T(470, 26, 'hidden details discarded', { f: 'c2' })}<g class="rl-rise" style="--dy:-30px"><rect x="402" y="90" width="8" height="14" fill="var(--c2)"/><rect x="426" y="96" width="8" height="10" fill="var(--c2)"/></g></g>
      <g data-step="4">${fileBox(485, 'lossy again ×2', '115 MB', HS, 'bad', [3, 5, 6, 7, 8])}<path d="M452 130 H482" stroke="var(--bad)" stroke-width="3" class="rl-flow"/></g>
      <g data-step="=4">${T(500, 26, 'each pass discards more', { f: 'bad' })}</g>
      <g data-step="=5"><path d="M80 218 V232 H545 V218" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-flow"/><path d="M390 232 V218 M235 232 V218" stroke="var(--accent)" stroke-width="2.5"/>
        ${T(320, 250, 'always export copies from the master', { f: 'accent' })}</g>
    </svg>`,
    steps: [
      ['The master holds everything', 'An uncompressed file stores every sample as recorded. One hour of stereo at 24-bit, 48 kHz is about 1 GB.'],
      ['Lossless: smaller, identical', 'Lossless packing works like a zip file. It unpacks to exactly the same audio, at roughly 60 % of the size.'],
      ['Lossy: drops what is masked', 'A lossy coder removes sounds hidden behind louder ones. At a good bit rate most people cannot tell; the file is about a ninth of the size.'],
      ['Lossy on lossy adds up', 'Re-encoding a lossy file makes the coder throw away again from what is left. Cymbals and reverb tails suffer first.'],
      ['One source, many copies', 'Keep the master, make every delivery copy directly from it, and store it in three places.'],
    ],
    why: [
      'Lossy coding is a one-way street: the discarded detail is not stored anywhere, so no later conversion can bring it back.',
      'Each encoding pass makes fresh decisions about what to drop, and its small errors pile on top of the earlier ones.',
      'Storage is cheap compared with re-recording. A full-quality master is the only version you can make every future format from.',
    ],
    uses: [
      ['🎵', 'Delivering a release', 'Send the distributor uncompressed or lossless files; they make the lossy versions once, for each service.'],
      ['🎙️', 'Editing a podcast', 'Record and edit uncompressed, then export one lossy file at the end for upload.'],
      ['🗄️', 'Archiving old recordings', 'Store transfers as uncompressed or lossless files with notes on date, source and settings, in three places.'],
    ],
    tryit: [
      'Work out the size of your own project: minutes × 60 × sample rate × (bits ÷ 8) × channels, in bytes. Divide by a million for megabytes.',
      'Take any song file, export it at a low bit rate, then export that result again, five times in a row. Compare the cymbals with the original.',
      'Check where your most important recordings are stored. Count the copies and the places.',
    ],
    slip: ['Editing or re-exporting from a lossy copy because it is the one to hand.', 'Go back to the master every time, and make lossy copies only as the final step.'],
  });

  /* ---------------------------------------------------------------- R12 */
  REAL('r-restoration', {
    title: 'grandmother’s interview with the buzzing charger',
    plain: 'Cleaning a recording means removing one fault at a time, in a sensible order, and stopping while the voice still sounds natural. A little leftover noise is better than a voice that sounds as if it is under water.',
    where: 'A family interview recorded at a kitchen table',
    story: `<p>Nikhil records an hour with his grandmother. On playback there is a steady hum from a phone charger, a soft hiss from the cheap recorder, and a few sharp clicks where the cable was knocked. He applies heavy noise reduction to the whole file and her voice turns thin and warbly.</p>
      <p>He starts again from the untouched original. First he repairs the clicks, then removes the hum with narrow notches at 50, 100 and 150 Hz, and only then lowers the hiss by about 8 dB. Some hiss remains, but her voice is intact and easy to listen to.</p>`,
    numbers: [['Mains hum and its harmonics', '50, 100, 150 Hz (60, 120, 180 where mains is 60 Hz)'], ['Notch width', 'very narrow: a few hertz each'], ['Hiss reduction used', 'about 8 dB, not 30'], ['Order', 'clicks → hum → hiss → EQ'], ['Always keep', 'the untouched original file']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Spectrum of a noisy voice recording being cleaned in stages">
      <line x1="40" y1="210" x2="610" y2="210" stroke="var(--line)" stroke-width="2"/>
      ${[['50 Hz', 90], ['100', 140], ['150', 180], ['1 kHz', 360], ['8 kHz', 560]].map(([l, x]) => `<line x1="${x}" y1="210" x2="${x}" y2="216" stroke="var(--muted)"/>${T(x, 232, l, { z: 11, f: 'muted' })}`).join('')}
      <path d="M150 210 Q300 20 420 150 Q500 200 580 210 Z" fill="var(--c2)" opacity=".5"/>${T(330, 110, 'voice')}
      <g data-step="1-3"><rect x="40" y="170" width="570" height="40" fill="var(--muted)" opacity=".35" class="rl-pulse"/></g>
      <g data-step="1-2">${[90, 140, 180].map((x, i) => `<rect x="${x - 3}" y="${60 + i * 26}" width="6" height="${150 - i * 26}" fill="var(--bad)" class="rl-pulse${i ? ' d2' : ''}"/>`).join('')}</g>
      <g data-step="=1">${[250, 470].map((x) => `<line x1="${x}" y1="30" x2="${x}" y2="210" stroke="var(--warn)" stroke-width="2" stroke-dasharray="3 4" class="rl-pulse d3"/>`).join('')}
        ${T(110, 46, 'hum', { f: 'bad' })}${T(250, 22, 'click', { f: 'warn' })}${T(540, 160, 'hiss', { f: 'muted' })}</g>
      <g data-step="=2">${T(360, 30, '1: clicks repaired', { f: 'good' })}</g>
      <g data-step="3">${[90, 140, 180].map((x) => `<path d="M${x - 8} 172 L${x} 208 L${x + 8} 172" fill="none" stroke="var(--good)" stroke-width="2.5"/>`).join('')}</g>
      <g data-step="=3">${T(360, 30, '2: narrow notches remove the hum', { f: 'good' })}</g>
      <g data-step="4"><rect x="40" y="194" width="570" height="16" fill="var(--muted)" opacity=".35"/></g>
      <g data-step="=4"><path d="M560 168 V192" stroke="var(--good)" stroke-width="3" class="rl-flow"/>${T(360, 30, '3: hiss lowered 8 dB, not erased', { f: 'good' })}</g>
      <g data-step="=5">${T(360, 30, 'stop: the voice is still whole', { f: 'accent' })}<path d="M150 210 Q300 20 420 150 Q500 200 580 210" fill="none" stroke="var(--accent)" stroke-width="2.5" class="rl-flow slow"/></g>
    </svg>`,
    steps: [
      ['Name each fault', 'Three different problems: short clicks, a steady hum at fixed pitches, and a broad hiss across everything.'],
      ['Repair the clicks first', 'A click tool redraws a few milliseconds of waveform. Done first, the clicks cannot confuse the later tools.'],
      ['Notch out the hum', 'Hum lives at 50 Hz and its multiples. Very narrow cuts at exactly those pitches remove it and barely touch the voice.'],
      ['Lower the hiss a little', 'Broadband reduction works on a learned sample of the noise. Take off about 8 dB; more starts to eat the voice.'],
      ['Stop and compare', 'Switch between the original and the cleaned version at the same volume. If the voice has changed, back off.'],
    ],
    why: [
      'Each tool is built for one kind of fault. A single heavy process aimed at everything damages the voice before it removes the noise.',
      'Hum is narrow and steady, so it can be cut precisely. Hiss overlaps the whole voice, so it can only be reduced, not removed.',
      'Listeners forgive steady, low noise within seconds. They do not forgive a voice that warbles or pumps.',
    ],
    uses: [
      ['🎓', 'Lecture or meeting recordings', 'High-pass at 80 Hz, notch any hum, then a light noise reduction; that alone makes hours of speech easier to follow.'],
      ['📼', 'Old cassettes and records', 'Transfer flat at high resolution first, keep that file, and do all cleaning on a copy.'],
      ['🎬', 'Location sound for video', 'Record 20 seconds of “room tone” on set so the editor has a clean sample of the noise to work with.'],
    ],
    tryit: [
      'Record a minute of speech near a fan. In any free audio editor, select a second of fan-only noise and use its noise-reduction tool at a low setting, then a very high one. Compare the voice.',
      'Play a 50 Hz tone from a tone-generator app quietly under your speech recording, then remove it with the editor’s notch or hum filter.',
      'Before closing, save the cleaned file under a new name and check the original is still untouched.',
    ],
    slip: ['Running maximum noise reduction over the whole file in one pass.', 'Fix clicks, then hum, then a modest amount of hiss, comparing with the original after each step.'],
  });

  /* ---------------------------------------------------------------- R13 */
  const harm = (n, cut, c) => Array.from({ length: n }, (_, i) => { const h = 96 / (i + 1) + 6; const on = cut ? i < cut : true; return `<rect x="${238 + i * 13}" y="${216 - (on ? h : Math.min(h, 5))}" width="8" height="${on ? h : Math.min(h, 5)}" rx="2" fill="var(--${on ? c : 'line'})"/>`; }).join('');
  const saw = (x0, y0, n, w, a, c, cls) => { let d = `M${x0} ${y0 + a}`; for (let i = 0; i < n; i++) d += ` L${x0 + (i + 1) * w} ${y0 - a} L${x0 + (i + 1) * w} ${y0 + a}`; return `<path d="${d}" fill="none" stroke="var(--${c})" stroke-width="2.5"${cls ? ` class="${cls}"` : ''}/>`; };
  REAL('r-synthesis', {
    title: 'building a bass sound from a buzz',
    plain: 'A basic synthesiser starts with a bright, buzzy tone, removes some of the brightness with a filter, and shapes the loudness over time. Those three steps make most classic synth sounds.',
    where: 'A producer’s laptop with a stock synthesiser',
    story: `<p>Zoya needs a round, plucky bass for a track but the presets are all too harsh or too dull. She starts from scratch: one sawtooth wave playing a low A at 55 Hz. On its own it is a rude buzz, because it contains every harmonic: 110, 165, 220 Hz and upward.</p>
      <p>She sets a low-pass filter at 400 Hz, which keeps the first seven harmonics and removes the fizz. Then she makes the filter open briefly at the start of each note and close over 300 ms, and gives the loudness a fast start and a short fade. The buzz has become a bass with a clear “pluck” that she can adjust with three knobs.</p>`,
    numbers: [['Note played', 'A at 55 Hz'], ['Sawtooth harmonics', '55, 110, 165, 220 … every multiple'], ['Filter at 400 Hz keeps', '385 ÷ 55 = the first 7 harmonics'], ['Filter envelope', 'opens to about 2 kHz, closes in 300 ms'], ['Loudness envelope', 'attack 5 ms, decay 300 ms']],
    svg: `<svg viewBox="0 0 640 260" aria-label="Oscillator, filter and amplifier shaping a sawtooth into a bass note">
      ${box(30, 30, 150, 70, '', 'c1')}${T(105, 22, 'oscillator', { z: 12 })}${saw(42, 65, 6, 21, 22, 'c1', 'rl-pulse')}
      ${box(245, 30, 150, 70, '', 'c2')}${T(320, 22, 'low-pass filter', { z: 12 })}
      ${box(460, 30, 150, 70, '', 'c4')}${T(535, 22, 'amplifier', { z: 12 })}
      <path d="M180 65 H245 M395 65 H460" stroke="var(--muted)" stroke-width="2.5" class="rl-flow"/>
      <line x1="225" y1="216" x2="610" y2="216" stroke="var(--line)" stroke-width="2"/>${T(120, 170, 'harmonics in the', { z: 12, f: 'muted' })}${T(120, 188, 'sound, low to high', { z: 12, f: 'muted' })}
      <g data-step="=1">${harm(28, 0, 'c1')}${T(480, 150, 'bright and buzzy', { f: 'c1' })}</g>
      <g data-step="2"><path d="M258 50 H330 Q350 50 362 86" fill="none" stroke="var(--c2)" stroke-width="3"/></g>
      <g data-step="=2">${harm(28, 7, 'c2')}<line x1="326" y1="110" x2="326" y2="222" stroke="var(--c2)" stroke-width="2" stroke-dasharray="4 4"/>${T(344, 150, '400 Hz: keeps 7, drops the fizz', { f: 'c2', a: 'start' })}</g>
      <g data-step="=3">${harm(28, 16, 'c2')}<g class="rl-slide" style="--dx:-110px"><line x1="448" y1="110" x2="448" y2="222" stroke="var(--accent)" stroke-width="2.5"/></g>${T(470, 150, 'filter closes in 300 ms', { f: 'accent' })}</g>
      <g data-step="4"><path d="M474 92 L482 42 Q520 84 596 92" fill="none" stroke="var(--c4)" stroke-width="3"/></g>
      <g data-step="=4">${harm(28, 7, 'c4')}${T(480, 150, 'fast start, short fade', { f: 'c4' })}</g>
      <g data-step="=5">${harm(28, 7, 'good')}<g class="rl-bob">${T(470, 150, 'a round, plucky bass', { f: 'good' })}</g></g>
    </svg>`,
    steps: [
      ['Start with a buzz', 'A sawtooth wave at 55 Hz contains that note plus every multiple of it, each a little weaker. It sounds bright and rude.'],
      ['Filter off the top', 'A low-pass filter at 400 Hz lets the first seven harmonics through and removes the rest. The tone turns round and dark.'],
      ['Move the filter in time', 'An envelope opens the filter at the start of the note and lets it close over 300 ms. That bright-to-dark sweep is the “pluck”.'],
      ['Shape the loudness', 'A second envelope on the amplifier gives a 5 ms start and a short fade, so each note is tight and separate.'],
      ['Three knobs to taste', 'Cutoff sets how dark, envelope amount sets how plucky, decay sets how long. That is most of bass synthesis.'],
    ],
    why: [
      'Tone colour is the mix of harmonics. It is easier to start with all of them and carve some away than to add them one by one.',
      'Real instruments are brightest at the start of a note and mellow as it rings. A filter that closes over time copies that behaviour.',
      'Knowing the three stages lets you fix a preset in seconds: too harsh means lower the cutoff; too soft a start means shorten the attack.',
    ],
    uses: [
      ['🎹', 'Fitting a synth into a mix', 'If a pad covers the vocal, lower its filter cutoff before reaching for an equaliser; you remove the harmonics at source.'],
      ['🥁', 'Making a kick drum', 'A sine wave that drops quickly from about 150 Hz to 50 Hz with a fast-fading amplifier envelope is a classic electronic kick.'],
      ['🎬', 'Sound design', 'Slow attack and long release on the same patch turns the bass into a swelling drone for a film scene.'],
    ],
    tryit: [
      'Open any free synth app. Choose a sawtooth, play a low note, and sweep the filter cutoff from top to bottom while listening.',
      'Set the amplifier attack to its slowest and play again; then to its fastest. Notice how the same tone becomes a pad or a pluck.',
      'Work out which harmonics of a 110 Hz note pass a 500 Hz filter (110, 220, 330, 440: four).',
    ],
    slip: ['Scrolling through hundreds of presets looking for the right one.', 'Pick one that is close and adjust cutoff, envelope amount and attack; you will get there faster and learn the instrument.'],
  });

  /* ---------------------------------------------------------------- R14 */
  const comb = (xs, c) => { let d = 'M250 150'; const pts = xs.slice().sort((a, b) => a - b); let x = 250; pts.forEach((n) => { d += ` L${n - 14} 150 L${n} 214 L${n + 14} 150`; x = n + 14; }); d += ' L610 150'; return `<path d="${d}" fill="none" stroke="var(--${c})" stroke-width="2.5"/>`; };
  REAL('r-creative-fx', {
    title: 'the jet-plane sweep on a guitar intro',
    plain: 'Many classic effects are the same trick: mix a sound with a slightly delayed copy of itself. The copy cancels some pitches, and if the delay keeps changing, the cancelled pitches slide up and down.',
    where: 'A clean electric guitar part that needs movement',
    story: `<p>Tara wants the swooshing “jet” sound on a guitar intro. She adds a flanger and turns knobs at random; sometimes it sweeps, sometimes nothing seems to happen.</p>
      <p>Then she learns what it is doing. The effect copies the guitar, delays the copy by a few milliseconds and mixes it back at equal level. With a 1 ms delay, notes at 500 Hz, 1.5 kHz and 2.5 kHz cancel. As a slow control sweeps the delay from 1 ms to 5 ms, those gaps slide down to 100, 300 and 500 Hz. Knowing this, she sets a slow sweep, an equal mix and a touch of feedback, and gets the sound first time.</p>`,
    numbers: [['Delay 1 ms: cancelled pitches', '1 ÷ (2 × 0.001) = 500 Hz, then 1.5 k, 2.5 k'], ['Delay 5 ms: cancelled pitches', '100, 300, 500 Hz'], ['Sweep speed chosen', '0.2 Hz: one sweep every 5 s'], ['Deepest effect', 'dry and delayed at equal level'], ['Longer delay, 15–30 ms', 'becomes chorus, not flanging']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A flanger mixing a signal with a swept delayed copy, creating moving notches">
      ${box(20, 50, 90, 50, 'guitar', 'c1')}${box(500, 50, 110, 50, 'output', 'c4')}
      <path d="M110 66 H500" stroke="var(--c1)" stroke-width="2.5" class="rl-flow"/>${T(300, 56, 'dry path', { z: 12, f: 'muted' })}
      <g data-step="2"><path d="M140 66 V118 H250 M370 118 H470 V84" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-flow"/>
        <rect x="250" y="98" width="120" height="40" rx="8" fill="var(--panel)" stroke="var(--c2)" stroke-width="2"/></g>
      <g data-step="=1">${T(300, 130, 'one signal, heard once')}</g>
      <g data-step="=2">${T(310, 123, 'delay 1 ms', { f: 'c2' })}</g>
      <g data-step="3-5">${T(310, 123, 'delay', { f: 'c2' })}</g>
      <line x1="240" y1="214" x2="610" y2="214" stroke="var(--line)" stroke-width="2"/>${T(120, 176, 'what comes out,', { z: 12, f: 'muted' })}${T(120, 194, 'low to high pitch', { z: 12, f: 'muted' })}
      <g data-step="1-2"><path d="M250 150 H610" stroke="var(--c1)" stroke-width="2.5"/></g>
      <g data-step="=3">${comb([330, 450, 570], 'accent')}${T(330, 242, '500', { z: 11 })}${T(450, 242, '1.5 k', { z: 11 })}${T(570, 242, '2.5 k', { z: 11 })}${T(120, 226, 'gaps where the copy cancels', { z: 12, f: 'accent' })}</g>
      <g data-step="=4"><g class="rl-slide" style="--dx:-70px">${comb([340, 420, 500, 580], 'accent')}</g>
        <circle cx="310" cy="150" r="0" fill="none"/><path d="M290 142 q20 -16 40 0" fill="none" stroke="var(--c2)" stroke-width="2.5" class="rl-bob"/>${T(120, 226, 'delay sweeps: gaps slide', { z: 12, f: 'accent' })}</g>
      <g data-step="=5"><g class="rl-slide" style="--dx:-70px">${comb([340, 420, 500, 580], 'good')}</g>
        <path d="M430 118 V84 H190 V118" fill="none" stroke="var(--c3)" stroke-width="2" class="rl-flow rev"/>${T(120, 226, 'feedback sharpens the sweep', { z: 12, f: 'c3' })}</g>
    </svg>`,
    steps: [
      ['One clean signal', 'The guitar goes straight to the output. Every pitch comes through at its normal strength.'],
      ['Copy it and delay the copy', 'A second path carries the same sound, held back by about 1 ms, and joins the first at equal level.'],
      ['Some pitches cancel', 'Where the copy arrives half a cycle late it wipes out the original: at 500 Hz, 1.5 kHz, 2.5 kHz for a 1 ms delay.'],
      ['Sweep the delay', 'A slow control moves the delay between 1 and 5 ms. The gaps slide down and up through the sound: the “jet”.'],
      ['Mix and feedback set the strength', 'Equal mix gives the deepest gaps. Feeding some output back into the delay makes them sharper and more metallic.'],
    ],
    why: [
      'Two equal sounds half a cycle apart add to nothing. A fixed delay is half a cycle at one set of pitches, so only those vanish.',
      'The ear is very sensitive to a moving pattern of gaps, which is why a small sweep sounds dramatic.',
      'Change only the delay range and the same circuit becomes a flanger (1–5 ms), a chorus (15–30 ms) or a doubling echo (40 ms and up).',
    ],
    uses: [
      ['🎸', 'Movement on a static part', 'A slow, shallow flanger or phaser on a held guitar chord or pad keeps a long section from sounding frozen.'],
      ['🎤', 'Thickening a vocal', 'A chorus with 20 ms delay and gentle sweep, mixed low, makes one voice sound like two singing together.'],
      ['🔍', 'Spotting an accident', 'If a recording sounds “flangey” by itself, two microphones or a reflection are adding a delayed copy; move a mic to fix it.'],
    ],
    tryit: [
      'Play the same song on two phones, starting them as close together as you can. Hold them side by side and listen to the hollow, shifting tone.',
      'Play steady noise (a fan or a noise app) near a hard wall and move your head slowly toward and away from the wall. Hear the sweep.',
      'Work out the first cancelled pitch for a 2 ms delay: 1 ÷ (2 × 0.002) = 250 Hz.',
    ],
    slip: ['Turning every knob up so the effect is obvious all the time.', 'Use a slow sweep and a modest mix, and switch it in only for the sections that need movement.'],
  });
})();
