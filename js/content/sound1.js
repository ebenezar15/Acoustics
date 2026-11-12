/* ==========================================================================
   Three acoustics-track lessons: vibration and musical instruments (1B),
   hearing in depth and hearing protection (4D), moving sources and sound
   beyond the studio (5B). Original text and drawings.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design|result/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const insertAfter = (ids, L) => { let i = -1; for (const id of ids) { i = window.LESSONS.findIndex((l) => l.id === id); if (i >= 0) break; } window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L); };
  const wave = (x0, y, len, amp, cycles, n = 80) => Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${(x0 + (len * i) / n).toFixed(1)} ${(y - amp * Math.sin((i / n) * Math.PI * 2 * cycles)).toFixed(1)}`).join(' ');

  /* =====================================================================
     1B — vibration and instruments
     ===================================================================== */
  const SVG_MSD = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Mass, spring and damper, and where they appear">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Every vibrating thing is some mix of three parts</text>
    <line x1="40" y1="34" x2="170" y2="34" stroke="var(--text)" stroke-width="3"/>
    <path d="M80 34 l0 10 l10 6 l-20 10 l20 10 l-20 10 l20 10 l-10 6 l0 10" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
    <path d="M130 34 v30 M120 64 h20 v26 h-20 z M130 90 v22" fill="none" stroke="var(--c4)" stroke-width="2.2"/>
    <rect class="pane-a" x="62" y="112" width="86" height="40" rx="4" fill="var(--accent2)" opacity=".8" stroke="var(--text)"/>
    <text x="105" y="137" text-anchor="middle" font-size="12" font-weight="700">mass</text>
    <text x="56" y="76" text-anchor="end" font-size="10" fill="var(--accent)">spring</text><text x="150" y="80" font-size="10" fill="var(--c4)">damper</text>
    <text x="105" y="176" text-anchor="middle" font-size="10" fill="var(--muted)">motion · squeeze · heat</text>
    ${[['Guitar string', 'its own weight', 'its tension', 'air + the bridge'], ['Loudspeaker cone', 'cone + coil', 'surround + box air', 'surround + magnet'], ['Floating floor', 'the slab', 'the rubber pads', 'the rubber’s loss'], ['Bottle / bass trap', 'air plug in the neck', 'air in the body', 'friction in the neck'], ['Room bass mode', 'the air', 'the air', 'absorbers on the walls']].map(([n, m, s, d], i) => `<g font-size="10.5"><text x="200" y="${58 + i * 28}" font-weight="700">${n}</text><text x="318" y="${58 + i * 28}" fill="var(--accent2)">${m}</text><text x="432" y="${58 + i * 28}" fill="var(--accent)">${s}</text><text x="540" y="${58 + i * 28}" fill="var(--c4)">${d}</text></g>`).join('')}
    <g font-size="10" fill="var(--muted)"><text x="318" y="36">mass</text><text x="432" y="36">spring</text><text x="540" y="36">damping</text></g>
    <line x1="196" y1="42" x2="660" y2="42" stroke="var(--line)"/>
  </svg>`;
  const SVG_Q = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Low, medium and high Q">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Q: the same fact seen in time and in frequency</text>
    ${[['Low Q (about 1)', 'thud — gone at once', 1.2, 'broad, low hill', 'good', 20], ['Medium Q (about 8)', 'rings a few cycles', 6, 'clear peak', 'warn', 240], ['High Q (about 50)', 'sings on and on', 30, 'tall needle', 'bad', 460]].map(([t, a, q, b, c, x]) => `<g transform="translate(${x} 0)">
      <path d="${Array.from({ length: 101 }, (_, i) => `${i ? 'L' : 'M'}${(i * 0.95).toFixed(1)} ${(62 - 26 * Math.exp(-i / (q * 3)) * Math.cos(i * 0.55)).toFixed(1)}`).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="1.8"/>
      <path d="${Array.from({ length: 101 }, (_, i) => { const r = 0.4 + i * 0.012, g = 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(r / q, 2)); return `${i ? 'L' : 'M'}${(105 + i * 0.95).toFixed(1)} ${(92 - Math.max(1, Math.min(64, 15 * Math.log10(g) * 2.6 + 8))).toFixed(1)}`; }).join(' ')}" fill="none" stroke="var(--${c})" stroke-width="2.2"/>
      <line x1="0" y1="62" x2="95" y2="62" stroke="var(--line)"/><line x1="105" y1="92" x2="200" y2="92" stroke="var(--line)"/>
      <text x="48" y="112" text-anchor="middle" font-size="9.5" fill="var(--muted)">in time</text><text x="152" y="112" text-anchor="middle" font-size="9.5" fill="var(--muted)">in frequency</text>
      <text x="100" y="136" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="100" y="152" text-anchor="middle" font-size="10">${a}</text><text x="100" y="167" text-anchor="middle" font-size="10" fill="var(--${c})">${b}</text></g>`).join('')}
  </svg>`;
  const SVG_STRING = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="String modes and the effect of where it is plucked">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A string’s overtones are whole multiples — and where you pluck decides which ones you get</text>
    ${[1, 2, 3, 4].map((n) => `<g><path d="${wave(40, 26 + n * 36, 280, 13, n / 2)}" fill="none" stroke="var(--accent)" stroke-width="2"/><path d="${wave(40, 26 + n * 36, 280, -13, n / 2)}" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".45"/><text x="330" y="${30 + n * 36}" font-size="10.5">${n === 1 ? 'fundamental  f' : n + ' × f'}</text></g>`).join('')}
    <g transform="translate(420 0)">
      <text x="120" y="42" text-anchor="middle" font-size="11" font-weight="700">Plucked in the middle</text>
      <path d="M10 70 L120 50 L230 70" fill="none" stroke="var(--accent2)" stroke-width="2.2"/>
      ${[1, 2, 3, 4, 5, 6, 7].map((k) => `<rect x="${20 + k * 26}" y="${k % 2 ? 118 - 34 / k : 117}" width="12" height="${k % 2 ? 34 / k : 1}" fill="var(--accent2)"/>`).join('')}
      <text x="120" y="132" text-anchor="middle" font-size="9.5" fill="var(--muted)">only odd harmonics: hollow, round</text>
      <text x="120" y="152" text-anchor="middle" font-size="11" font-weight="700">Plucked near the bridge</text>
      <path d="M10 178 L205 160 L230 178" fill="none" stroke="var(--c3)" stroke-width="2.2"/>
      ${[1, 2, 3, 4, 5, 6, 7].map((k) => `<rect x="${20 + k * 26}" y="${216 - 22 * Math.abs(Math.sin(k * 0.45)) / Math.sqrt(k) - 6}" width="12" height="${22 * Math.abs(Math.sin(k * 0.45)) / Math.sqrt(k) + 6}" fill="var(--c3)"/>`).join('')}
      <text x="120" y="228" text-anchor="middle" font-size="9.5" fill="var(--muted)">strong high harmonics: bright, twangy</text>
    </g>
  </svg>`;
  const SVG_PIPES = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Open and closed pipes">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Same length of tube, two different instruments</text>
    <g transform="translate(30 30)">
      <rect x="0" y="20" width="270" height="34" fill="var(--panel2)" stroke="var(--text)"/><rect x="-3" y="20" width="4" height="34" fill="var(--panel)"/><rect x="269" y="20" width="4" height="34" fill="var(--panel)"/>
      <path d="M0 51 Q135 -2 270 51" fill="none" stroke="var(--accent)" stroke-width="2"/>
      <path d="M0 25 Q135 77 270 25" fill="none" stroke="var(--c3)" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="135" y="74" text-anchor="middle" font-size="12" font-weight="700">Open at both ends — flute, recorder</text>
      <text x="135" y="90" text-anchor="middle" font-size="10.5">lowest note: wavelength = 2 × length</text>
      <text x="135" y="106" text-anchor="middle" font-size="10.5" fill="var(--good)">all harmonics: f, 2f, 3f, 4f…</text>
      <text x="135" y="122" text-anchor="middle" font-size="10" fill="var(--muted)">60 cm tube → about 286 Hz</text>
    </g>
    <g transform="translate(370 30)">
      <rect x="0" y="20" width="270" height="34" fill="var(--panel2)" stroke="var(--text)"/><rect x="-4" y="16" width="6" height="42" fill="var(--text)"/><rect x="269" y="20" width="4" height="34" fill="var(--panel)"/>
      <path d="M2 51 Q150 47 270 25" fill="none" stroke="var(--c3)" stroke-width="2" stroke-dasharray="4 3"/>
      <path d="M2 25 Q150 27 270 51" fill="none" stroke="var(--accent)" stroke-width="2"/>
      <text x="135" y="74" text-anchor="middle" font-size="12" font-weight="700">Closed at one end — clarinet, panpipe</text>
      <text x="135" y="90" text-anchor="middle" font-size="10.5">lowest note: wavelength = 4 × length</text>
      <text x="135" y="106" text-anchor="middle" font-size="10.5" fill="var(--warn)">odd harmonics only: f, 3f, 5f…</text>
      <text x="135" y="122" text-anchor="middle" font-size="10" fill="var(--muted)">60 cm tube → about 143 Hz, an octave lower</text>
    </g>
    <text x="340" y="182" text-anchor="middle" font-size="10" fill="var(--muted)">solid line: size of the pressure swing · dashed line: size of the air movement — one is greatest where the other is zero</text>
  </svg>`;
  const SVG_VOICE = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="The voice as source and filter">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The voice: a buzzer, a tube and an opening</text>
    <g transform="translate(20 34)"><rect width="150" height="112" rx="8" fill="var(--panel2)"/>
      ${Array.from({ length: 11 }, (_, k) => `<rect x="${14 + k * 12}" y="${88 - 70 / (1 + k * 0.6)}" width="5" height="${70 / (1 + k * 0.6)}" fill="var(--accent)"/>`).join('')}
      <text x="75" y="106" text-anchor="middle" font-size="10" fill="var(--muted)">even row of harmonics</text><text x="75" y="134" text-anchor="middle" font-size="12" font-weight="700">1 · Source</text><text x="75" y="150" text-anchor="middle" font-size="10">vocal folds set the pitch</text></g>
    <text x="196" y="94" font-size="22" font-weight="700" fill="var(--muted)">×</text>
    <g transform="translate(226 34)"><rect width="190" height="112" rx="8" fill="var(--panel2)"/>
      <path d="M12 88 C30 20 46 20 60 70 C74 86 84 40 100 34 C116 40 124 80 140 62 C150 50 160 70 178 86" fill="none" stroke="var(--accent2)" stroke-width="2.4"/>
      <text x="40" y="24" font-size="10" font-weight="700">F1</text><text x="96" y="28" font-size="10" font-weight="700">F2</text><text x="142" y="52" font-size="10" font-weight="700">F3</text>
      <text x="95" y="106" text-anchor="middle" font-size="10" fill="var(--muted)">resonances of throat and mouth</text><text x="95" y="134" text-anchor="middle" font-size="12" font-weight="700">2 · Filter</text><text x="95" y="150" text-anchor="middle" font-size="10">tongue, jaw and lips set the vowel</text></g>
    <text x="436" y="94" font-size="22" font-weight="700" fill="var(--muted)">=</text>
    <g transform="translate(470 34)"><rect width="190" height="112" rx="8" fill="var(--panel2)"/>
      ${Array.from({ length: 13 }, (_, k) => { const f = k / 12, e = 0.2 + 0.8 * Math.exp(-Math.pow((f - 0.14) / 0.08, 2)) + 0.6 * Math.exp(-Math.pow((f - 0.46) / 0.09, 2)) + 0.3 * Math.exp(-Math.pow((f - 0.76) / 0.07, 2)); return `<rect x="${14 + k * 13}" y="${88 - 62 * Math.min(1, e) / (1 + k * 0.08)}" width="5" height="${62 * Math.min(1, e) / (1 + k * 0.08)}" fill="var(--c3)"/>`; }).join('')}
      <text x="95" y="106" text-anchor="middle" font-size="10" fill="var(--muted)">harmonics cut to the filter’s shape</text><text x="95" y="134" text-anchor="middle" font-size="12" font-weight="700">3 · What we hear</text><text x="95" y="150" text-anchor="middle" font-size="10">a note and a vowel</text></g>
  </svg>`;
  const SVG_BEAM = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Instruments radiate bass everywhere and treble in beams">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Bass goes everywhere; treble leaves in beams — so tone depends on where you stand</text>
    ${[['Low notes', 'wavelength bigger than the instrument', 62, 62, 'c3', 110], ['Middle', 'wavelength about its size', 62, 40, 'accent2', 340], ['High overtones', 'wavelength much smaller', 66, 14, 'accent', 570]].map(([t, s, ry, rx, c, x]) => `<g>
      <ellipse cx="${x}" cy="${rx < 20 ? 72 : rx < 50 ? 90 : 98}" rx="${rx}" ry="${rx < 20 ? 46 : 58}" fill="var(--${c})" opacity=".22" stroke="var(--${c})" stroke-width="2"/>
      <rect x="${x - 9}" y="92" width="18" height="12" rx="2" fill="var(--text)"/>
      <text x="${x}" y="176" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="${x}" y="192" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`).join('')}
    <circle cx="570" cy="40" r="4" fill="var(--good)"/><text x="548" y="44" font-size="10" fill="var(--good)" text-anchor="end">mic in the beam: bright</text>
    <circle cx="604" cy="98" r="4" fill="var(--bad)"/><text x="612" y="102" font-size="10" fill="var(--bad)">side: dull</text>
  </svg>`;

  const VIB = {
    id: 'vibration-instruments', n: '1B', title: 'Vibration and How Musical Instruments Make Sound', level: 'Core', mins: 55,
    summary: 'Where sound comes from before it reaches the air: weights on springs, strings, bars, skins, plates, pipes and the human voice — and what each one teaches you about miking instruments and designing the rooms they play in.',
    tags: ['oscillator', 'resonance', 'Q', 'damping', 'beats', 'string', 'drum modes', 'Chladni', 'soundboard', 'pipes', 'reed', 'formants', 'voice', 'radiation pattern', 'directivity'],
    sections: [
      { h: 'Everything that sounds is a weight on a spring', html: `
        <p class="lead">Before sound is a wave in the air, it is something solid shaking. Almost every shaking thing — a string, a drum skin, a speaker cone, even the air in a room — behaves like a weight bouncing on a spring. Understand that one toy and you understand the family.</p>
        ${SVG_MSD}
        <p>Three ingredients decide everything:</p>
        <ul><li><b>Mass</b> — the part that is heavy and reluctant to change its motion.</li><li><b>Spring (stiffness)</b> — the part that pushes back when displaced.</li><li><b>Damping</b> — whatever turns motion into heat: friction, air resistance, sound radiated away.</li></ul>
        <p>Pull the weight down and let go. The spring pulls it back, its mass carries it past the middle, the spring pulls it back again. It swaps energy between “stretched spring” and “moving mass” at one particular rate: its <b>natural frequency</b>.</p>
        <div class="formula"><span class="lbl">Natural frequency</span>f₀ = (1 ÷ 2π) × √( stiffness ÷ mass )</div>
        <p>Read it in words: <b>stiffer → higher; heavier → lower.</b> Tighten a guitar string or a drum head (stiffer) and the pitch rises. Use a thicker string, add tape to a drum head, put a heavier slab on a floating floor (more mass) and it falls. Note the square root: to drop the pitch by an octave you need <i>four times</i> the mass, or a spring four times softer.</p>
        <div class="callout example"><b>Worked example.</b> A 20 kg loudspeaker sits on four rubber feet. Together the feet compress 1 mm under its weight. A handy shortcut gives the bounce frequency straight from that sag: f₀ ≈ 15.8 ÷ √(sag in mm) = about 16 Hz. Softer feet that sag 4 mm would halve it to 8 Hz. (The same shortcut is used for floating floors and machine mounts elsewhere in this app.)</div>` },
      { h: 'Damping, ringing and Q', html: `
        <p>Without damping the weight would bounce for ever. With a little, each swing is slightly smaller than the last and the motion dies away smoothly. With a lot, it creeps back to rest without overshooting at all.</p>
        ${SVG_Q}
        <p>Engineers squeeze “how lightly damped” into one number, <b>Q</b> (quality factor). You can read Q three ways, and they all say the same thing:</p>
        <div class="table-wrap"><table><thead><tr><th>Way of looking</th><th>What Q tells you</th><th>Handy rule</th></tr></thead><tbody>
          <tr><td>In time</td><td>How long it rings after one strike</td><td>about 2.2 × Q cycles to fall by 60 dB</td></tr>
          <tr><td>In frequency</td><td>How narrow the resonance is</td><td>width = f₀ ÷ Q</td></tr>
          <tr><td>In strength</td><td>How much it magnifies a push at exactly f₀</td><td>motion × Q, that is 20 log Q decibels</td></tr></tbody></table></div>
        <p>So a bell (Q in the thousands) rings for many seconds, is “in tune” over a hair-thin band, and can be set singing by the faintest sound at its pitch. A drum stuffed with a pillow (Q of 2 or 3) goes “thup” and responds to almost anything.</p>
        <div class="callout mentor"><b>Why a studio designer cares.</b> A bass mode in a bare room is a high-Q resonator: one note booms and hangs on. Adding absorption lowers the Q — the peak drops <i>and</i> the ring-down shortens, together, automatically. You cannot have one without the other. That is why a waterfall plot and a frequency response always tell the same story.</div>`, viz: 'oscillatorLab' },
      { h: 'Pushing in rhythm: forced vibration and resonance', html: `
        <p>Now do not strike the weight — <i>push</i> it steadily, at a frequency of your choosing. Three different things happen depending on how your push compares with the natural frequency:</p>
        <div class="table-wrap"><table><thead><tr><th>You push…</th><th>What the weight does</th><th>Who is in charge</th><th>Where you meet it</th></tr></thead><tbody>
          <tr><td>much slower than f₀</td><td>follows your hand exactly</td><td>the spring</td><td>A wall panel at very low frequencies: its stiffness sets the isolation</td></tr>
          <tr><td>at f₀</td><td>huge motion, a quarter-cycle late</td><td>only the damping</td><td>Feedback howl, a booming room mode, a buzzing light fitting</td></tr>
          <tr><td>much faster than f₀</td><td>barely moves, opposite to your hand</td><td>the mass</td><td>A floating floor, a turntable mat, the mass law for walls</td></tr></tbody></table></div>
        <p>This single table explains two things that look unrelated. <b>Resonance</b> is the middle row: the place where a small, well-timed push builds a large motion. <b>Isolation</b> is the bottom row: put a machine on springs soft enough that its running speed is well above f₀, and the floor underneath hardly feels it.</p>
        <div class="callout warn"><b>The dangerous middle.</b> An isolation mount makes things <i>worse</i> for vibration near its own resonance. Mounts must be chosen so that the lowest frequency you care about is at least about 1.4 times f₀ — and preferably three times or more.</div>
        <h4>Transients — the start-up matters too</h4>
        <p>A resonator does not jump to full swing; it builds up over roughly the same number of cycles that it takes to die away. A high-Q system therefore responds slowly: it smears the start and the end of every note. Instruments use this (a piano soundboard that “blooms”), and rooms suffer from it (bass that arrives late and leaves late).</p>` },
      { h: 'Adding vibrations: beats and the idea of a spectrum', html: `
        <p>Two vibrations at once simply add. If they have nearly the same frequency, they drift in and out of step and the loudness throbs: these are <b>beats</b>. The throb rate is just the difference between the two frequencies — 440 Hz and 443 Hz beat three times a second. Musicians tune by slowing the beats until they vanish.</p>
        <p>Now the big idea, in plain words: <b>any steady, repeating vibration, however complicated its shape, is the sum of simple sine vibrations</b> at a base frequency and its whole multiples — the fundamental and its harmonics. The recipe — how much of each — is the <b>spectrum</b>, and it is what your ear reports as tone colour.</p>
        <ul><li>A smooth, rounded shape needs few harmonics: a flute, a sine-like hum.</li><li>A shape with sharp corners needs many: a bowed violin, a trumpet, a buzzing reed.</li><li>A sound that does not repeat at all (a cymbal, a consonant, a door slam) needs frequencies that are <i>not</i> whole multiples, spread across a band.</li></ul>
        <div class="callout mentor">You have already met this in the <a href="#/academy/harmonics">Harmonics</a> course. Here we use it the other way round: instead of asking what a waveform contains, we ask <i>why</i> each kind of instrument produces the recipe it does.</div>` },
      { h: 'Strings', html: `
        <p>A stretched string can vibrate in one loop, two, three, and so on. Because both ends are fixed, only whole numbers of half-waves fit — so its natural frequencies are exact whole multiples of the lowest one. That is the reason strings sound so clearly “in tune with themselves”.</p>
        ${SVG_STRING}
        <div class="formula"><span class="lbl">String</span>f = (1 ÷ 2L) × √( tension ÷ mass per metre )</div>
        <p>Halve the sounding length (press at the 12th fret) and the note rises an octave. Quadruple the tension for the same result — which is why low strings are made heavy (wound) instead of slack.</p>
        <h4>Where and how you excite it decides the tone</h4>
        <ul><li><b>Position.</b> A harmonic cannot be excited at a point where it has no motion. Pluck at the exact middle and every even harmonic is missing — a hollow, clarinet-like sound. Pluck near the bridge and the high harmonics are strong — bright and thin. Piano hammers strike about one-seventh to one-ninth of the way along to tame particular harmonics.</li><li><b>Hardness and width.</b> A fingernail or hard pick makes a sharp kink, rich in highs; the pad of a thumb makes a rounded one. A hard piano hammer at fortissimo is brighter than the same hammer played softly — loudness and brightness rise together on almost every instrument.</li><li><b>Bowing.</b> The bow alternately grips and releases the string hundreds of times a second, producing a sawtooth-like motion with a full set of harmonics that can be sustained indefinitely.</li></ul>
        <h4>Real strings are slightly stiff</h4>
        <p>A thick steel string resists bending as well as stretching, which pushes its upper overtones slightly sharp — they are no longer perfect multiples. This <b>inharmonicity</b> is strongest in short, fat strings (a small upright piano’s bass) and is part of why a concert grand, with its long strings, sounds clearer. Piano tuners “stretch” the octaves to make the out-of-place overtones agree.</p>
        <div class="callout data">A string on its own is nearly silent: it is far too thin to push much air. It needs a <b>soundboard or body</b> to do the radiating — which is the subject of the plates section below.</div>` },
      { h: 'Bars, skins and plates: why percussion is different', html: `
        <p>Strings and air columns give tidy whole-number overtones. Stiff or two-dimensional vibrators do not, and that is the fundamental difference between a “note” and a “clang”.</p>
        <div class="table-wrap"><table><thead><tr><th>Vibrator</th><th>Overtones relative to the lowest</th><th>What it sounds like</th><th>How makers cope</th></tr></thead><tbody>
          <tr><td>String</td><td>1, 2, 3, 4, 5…</td><td>One clear pitch</td><td>Nothing needed</td></tr>
          <tr><td>Uniform bar (free ends)</td><td>1, 2.76, 5.40, 8.93…</td><td>Clangy, bell-like</td><td>Marimba bars are carved thin underneath until the second mode sits at exactly 4×</td></tr>
          <tr><td>Tuning fork</td><td>1, then about 6.3</td><td>Almost a pure tone after the first instant</td><td>The high “clink” dies quickly; the fundamental rings</td></tr>
          <tr><td>Round skin (ideal)</td><td>1, 1.59, 2.14, 2.30, 2.65…</td><td>A thump with vague pitch</td><td>Kettledrums use the trapped air to pull modes towards 2 : 3 : 4 : 5</td></tr>
          <tr><td>Plate / cymbal / bell</td><td>Hundreds of unrelated modes</td><td>Shimmer, crash, or (if carefully shaped) a struck note</td><td>Bells are profiled on a lathe to tune five partials</td></tr></tbody></table></div>
        <h4>Drums in practice</h4>
        <ul><li><b>Tuning lugs.</b> Each lug changes the tension in its sector. If they are uneven, the pairs of modes that should share a frequency split apart and the drum “growls” with slow beats. Tapping in front of each lug and matching the pitches clears it.</li><li><b>Two heads.</b> The batter head and the resonant head are coupled by the air between them. Equal tuning gives the longest sustain; a lower resonant head gives a pitch that droops after the hit.</li><li><b>Damping.</b> A strip of tape, a gel pad, a ring or a pillow lowers the Q of the high modes first. The drum becomes shorter and “deader” — easier to record in a small room, less exciting in a big one.</li></ul>
        <p>Try the modes below. Listen to the single modes, then to one hit with all of them, and notice how the ear refuses to settle on a pitch.</p>`, viz: 'membraneModes' },
      { h: 'Soundboards and bodies: the instrument’s loudspeaker', html: `
        <p>A guitar string, a violin string and a piano string all need help: something wide and light that the string can shake and that can in turn shake the air. That is the <b>soundboard</b> — the top of a guitar, the belly of a violin, the big spruce board in a piano.</p>
        <p>A soundboard is a plate, so it has dozens of modes of its own, visible as sand patterns when the plate is shaken. Unlike a bell’s, they are heavily damped (low Q) and so closely packed that they overlap into a bumpy but continuous response. The instrument does not ring at those frequencies so much as <i>favour</i> them: they are a fixed filter stamped on every note, in the same way that the mouth stamps a vowel on the voice.</p>
        <ul><li><b>Guitar.</b> The lowest “air” resonance (air pumping in and out of the sound hole — a bottle resonance) sits near 100 Hz; the main top-plate resonance near 200 Hz. Together they give the body of the low strings. A boomy note on an acoustic guitar is usually one of these two.</li><li><b>Violin.</b> A bottle resonance near 280 Hz, strong plate resonances around 450–550 Hz, and a broad hill near 2.5 kHz from the bridge rocking — the region that gives a fine violin its carrying power.</li><li><b>Piano.</b> A board large enough to radiate bass, ribbed so that it is stiff yet light. The cast-iron frame carries twenty tonnes of string tension so the board itself does not have to.</li></ul>
        <div class="callout mentor"><b>Trade-off every maker faces.</b> A light, lively top turns string energy into sound quickly: loud, but the note dies fast (banjo). A heavy, stiff top takes energy slowly: quieter, but with long sustain (solid-body electric guitar — which is why it needs an amplifier).</div>` },
      { h: 'Pipes, reeds and lips', html: `
        <p>Wind instruments use a column of air as the resonator. The air column chooses the pitch; a reed, the player’s lips or a jet of breath keeps it going.</p>
        ${SVG_PIPES}
        <ul><li><b>Open at both ends</b> (flute, recorder, most organ flue pipes): half a wavelength fits in the tube; every harmonic is available.</li><li><b>Closed at one end</b> (clarinet, panpipe, stopped organ pipe): only a quarter of a wavelength is needed, so the same tube plays an octave lower, but only the odd harmonics fit. That missing set of even harmonics is the clarinet’s “hollow” colour in its low register.</li><li><b>Cones</b> (oboe, saxophone, bassoon): closed at the reed end yet behaving like an open pipe with all harmonics — one of the pleasant surprises of acoustics.</li></ul>
        <div class="formula"><span class="lbl">Pipes</span>open–open: f = c ÷ 2L &nbsp;·&nbsp; closed–open: f = c ÷ 4L &nbsp;·&nbsp; add about 0.6 × radius to L for each open end</div>
        <p>Because the speed of sound rises with temperature, <b>wind instruments go sharp as they warm up</b> — about 3 cents per °C — while strings go flat as they expand. An orchestra tunes after warming up for exactly this reason, and a studio with unstable temperature has tuning problems between takes.</p>
        <h4>Reeds and lips are valves</h4>
        <p>A reed (or a brass player’s lips) is a valve that the pressure in the pipe itself opens and closes. Each time the reflected wave returns from the far end it flips the valve, which lets in another puff at exactly the right moment. The pipe is in charge of the timing; the player supplies the air. Finger holes shorten the working length; blowing harder or tightening the lips jumps to a higher mode (“overblowing”).</p>
        <p>The flared <b>bell</b> of a brass instrument does two jobs: it shifts the tube’s natural frequencies into a usable musical series, and it helps high frequencies escape into the room. Low frequencies are mostly reflected back at the bell (which is what sustains the note); highs leak out — and are beamed forward.</p>` },
      { h: 'The voice: a source and a filter', html: `
        <p>The voice is a wind instrument with a twist: the pitch-maker and the tone-shaper are almost completely independent.</p>
        ${SVG_VOICE}
        <ul><li><b>Source.</b> The vocal folds chop the breath into puffs — roughly 85–180 times a second for most men’s speech, 165–255 for most women’s, higher for children. The puffs are sharp-edged, so they carry a long row of harmonics falling away gently with frequency.</li><li><b>Filter.</b> The throat and mouth form a tube about 17 cm long in an adult man, closed at the folds and open at the lips. Its resonances are called <b>formants</b>. A plain tube of that length would resonate near 500, 1500 and 2500 Hz; moving the tongue, jaw and lips slides them about.</li><li><b>Vowels are formant patterns.</b> The first two formants identify the vowel: “ee” has a low first and a high second (about 270 and 2300 Hz); “ah” has them close together (about 730 and 1100 Hz); “oo” has both low.</li></ul>
        <p>That is why you can sing any vowel on any note — and why a recording played at the wrong speed sounds like a different-sized person: the formants shift with the pitch, which never happens in a real throat.</p>
        <h4>Consonants are noise</h4>
        <p>“S”, “sh”, “f”, “t”, “k” are made by turbulence at a narrow gap or by a sudden release, with no pitch at all. Their energy sits high — “s” between about 4 and 9 kHz — and they are 20–30 dB weaker than vowels, yet they carry most of the meaning. Anything that hides them (reverberation, background noise, hearing loss) destroys intelligibility while leaving the voice “loud enough”.</p>
        <div class="callout mentor"><b>Useful numbers at the mixing desk.</b> Chest and warmth: 100–250 Hz. Boxiness: 300–600 Hz. Vowel clarity: 1–3 kHz. The “singer’s ring” that lets a trained voice ride over an orchestra: an extra cluster of energy near 3 kHz. Sibilance: 5–9 kHz.</div>`, viz: 'vowelSynth' },
      { h: 'How instruments throw their sound into the room', html: `
        <p>An instrument is not a point that sprays the same sound in every direction. The rule is the one that governs loudspeakers and microphones:</p>
        ${SVG_BEAM}
        <div class="callout physics"><b>Size against wavelength.</b> While the radiating part is small compared with the wavelength, sound spreads evenly. Once it is comparable or larger, the sound is thrown in beams and lobes. A violin body is about 35 cm long — one wavelength at roughly 1 kHz. Below that it is nearly omnidirectional; above, the pattern becomes complicated and changes from note to note.</div>
        <p>Consequences you can use at once:</p>
        <ul><li><b>No single close position hears the whole instrument.</b> Each spot gets the bass plus whichever treble beams happen to pass through it. The balanced sound exists only further away, where the room has mixed everything together.</li><li><b>Moving a microphone is a tone control</b> — a far more natural one than an equaliser. On-axis of a trumpet bell or a guitar-amp cone is bright; a hand’s width to the side is noticeably softer.</li><li><b>The room finishes the instrument.</b> Sound sent upward and backward is real sound the instrument makes. A dead booth throws it away; a good room returns it, blended, a few milliseconds later.</li></ul>
        <p>Explore the patterns below, then see the practical placements in <a href="#/academy/r-instruments">Miking instruments</a>.</p>`, viz: 'instrumentRadiation' },
      { h: 'How loud, how wide, how low: numbers for the designer', html: `
        <div class="table-wrap"><table><thead><tr><th>Source</th><th>Lowest note</th><th>Useful overtones to</th><th>Typical level at 1 m</th><th>Design consequence</th></tr></thead><tbody>
          <tr><td>Speaking voice</td><td>85–250 Hz</td><td>8 kHz</td><td>55–75 dB</td><td>A vocal booth needs to be quiet more than it needs heavy isolation outward</td></tr>
          <tr><td>Trained singer</td><td>80–1050 Hz</td><td>12 kHz</td><td>up to 105 dB</td><td>Loud enough to overload a microphone preamp at close range</td></tr>
          <tr><td>Acoustic guitar</td><td>82 Hz</td><td>12 kHz</td><td>60–85 dB</td><td>Quiet: room noise and computer fans become audible</td></tr>
          <tr><td>Grand piano</td><td>27.5 Hz</td><td>10 kHz</td><td>60–100 dB</td><td>Seven octaves: needs a room that is even from 30 Hz upward</td></tr>
          <tr><td>Brass section</td><td>about 40 Hz (tuba)</td><td>10 kHz</td><td>up to 110 dB</td><td>Directional: aim away from other microphones</td></tr>
          <tr><td>Drum kit</td><td>40–60 Hz (kick)</td><td>16 kHz (cymbals)</td><td>100–115 dB peaks</td><td>Sets the isolation requirement of most studios</td></tr>
          <tr><td>Bass guitar amplifier</td><td>41 Hz (31 Hz five-string)</td><td>5 kHz</td><td>95–110 dB</td><td>The hardest thing to keep inside a building</td></tr>
          <tr><td>Pipe organ</td><td>16 Hz</td><td>10 kHz</td><td>up to 110 dB in the room</td><td>Needs a long reverberation and a very quiet blower</td></tr></tbody></table></div>
        <p><b>Dynamic range matters as much as loudness.</b> An orchestra can move from about 40 dB to over 100 dB in one piece. To record it you need a room whose background noise is below the quietest passage — which is why noise criteria for recording spaces are so strict — and a signal chain with room for the peaks.</p>
        <div class="uc-grid">
          ${uc('🥁', 'Drum room for a project studio', [['Problem', 'Loud, impulsive, 40 Hz to 16 kHz; modes of the skins excite modes of the room'], ['Do', 'Isolation sized for 110 dB at 50 Hz; a room big enough that its first modes are below the kick; movable absorption so the decay can be tuned'], ['Result', 'Tight when you want it, live when you want it']], 'var(--accent)')}
          ${uc('🎻', 'Recording a string quartet', [['Problem', 'Close microphones catch scratchy beams; the players need to hear each other'], ['Do', 'A moderately live room, microphones 2–3 m up and back, players in their normal arc'], ['Result', 'Blended tone, with the room doing the mixing']], 'var(--accent2)')}
          ${uc('🎤', 'Vocal booth', [['Problem', 'A small box adds its own “vowel”: a boxy resonance around 200–500 Hz'], ['Do', 'Thick broadband absorption, non-parallel or treated walls, singer off-centre'], ['Result', 'The booth’s formants no longer argue with the singer’s']], 'var(--c3)')}
          ${uc('🎹', 'Piano in a living room', [['Problem', 'Bass surrounds the instrument and excites room modes; lid throws treble at one wall'], ['Do', 'Open side towards the long dimension, rug under it, absorption behind the open side'], ['Result', 'Clear bass and a top end that does not glare']], 'var(--c4)')}
        </div>` },
      { h: 'Myths, rules of thumb and applying it', html: `
        ${myth([['A drum has a note just like a guitar string.', 'Its overtones are not whole multiples, so the pitch is vague. That is why drums can be tuned “roughly” to a song without sounding out of tune.'], ['The string makes the sound of a guitar.', 'The string chooses the pitch and the recipe; the body does nearly all the radiating and stamps its own resonances on every note.'], ['A long ring means lots of energy.', 'It means low damping. A high-Q resonator holds on to a small amount of energy for a long time.'], ['The best microphone position is as close as possible.', 'Close positions hear one beam of a complicated pattern. Distance — in a good room — is what gives balance.'], ['Singers change vowel by changing pitch.', 'Pitch is the folds; vowel is the mouth. They are independent — until the pitch climbs above the first formant.']])}
        <h4>Rules of thumb</h4>
        <ul><li>Stiffer or lighter → higher. Heavier or slacker → lower. Four times the mass for one octave.</li><li>Ring-down ≈ 2.2 × Q cycles. Resonance width = f₀ ÷ Q. Boost at resonance = Q.</li><li>Isolation only begins above 1.4 × the mount’s natural frequency.</li><li>Beat rate = difference in frequency.</li><li>Open pipe c ÷ 2L, stopped pipe c ÷ 4L; wind goes sharp about 3 cents per °C.</li><li>An instrument beams above the frequency whose wavelength equals its size.</li></ul>
        ${flow([['Find the resonator', 'String, skin, bar, plate or air column?'], ['Find the radiator', 'Which surface or opening actually moves the air?'], ['Estimate the range', 'Lowest note and highest useful overtone'], ['Think direction', 'Where do the highs go? Where does the bass go?'], ['Choose room and mic', 'Distance, angle and the amount of room to let in']])}
        <div class="callout example"><b>Apply it today.</b> Take any instrument you own. Play one sustained note while a friend walks a slow circle around you at arm’s length, then at three metres. Notice how much the tone changes close up and how little it changes far away. You have just heard why microphone technique exists.</div>` },
    ],
    quiz: [
      { q: 'You want to lower a resonance by one octave by adding mass only. How much mass is needed?', opts: ['Twice as much', 'Four times as much', 'Half as much', 'Ten times as much'], a: 1, why: 'Frequency goes as the square root of stiffness over mass, so an octave (half the frequency) needs four times the mass.' },
      { q: 'A resonance at 100 Hz has a Q of 20. Roughly how wide is it, and how long does it ring?', opts: ['5 Hz wide, about 0.44 s', '20 Hz wide, about 0.05 s', '50 Hz wide, about 2 s', '100 Hz wide, about 1 s'], a: 0, why: 'Width = 100 ÷ 20 = 5 Hz; ring-down ≈ 2.2 × 20 = 44 cycles = 0.44 s at 100 Hz.' },
      { q: 'Why does a drum have a less definite pitch than a guitar string?', opts: ['It is louder', 'Its overtones are not whole-number multiples of the lowest mode', 'It has no fundamental', 'Drum heads are heavier than strings'], a: 1, why: 'A round skin’s modes fall at 1, 1.59, 2.14, 2.30… so the ear cannot fuse them into one pitch.' },
      { q: 'A soprano sings a note at 800 Hz on the vowel “oo” (first formant near 300 Hz). What happens?', opts: ['The vowel is unchanged', 'The vowel becomes hard to identify because no harmonic lies near the first formant', 'The note goes flat', 'The formants move up automatically with pitch'], a: 1, why: 'With the fundamental above F1 there is nothing to excite that resonance, so vowels converge.' },
      { q: 'You move a microphone from directly on the axis of a trumpet bell to 30° off it. The sound becomes…', opts: ['Brighter', 'Softer in the treble, with little change in the low notes', 'Quieter at all frequencies equally', 'Lower in pitch'], a: 1, why: 'High frequencies are beamed along the bell axis; lows spread widely.' },
    ],
  };

  /* =====================================================================
     4D — hearing in depth
     ===================================================================== */
  const SVG_EAR = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Outer, middle and inner ear">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Three stages: collect, match, analyse</text>
    <rect x="14" y="30" width="230" height="150" rx="10" fill="var(--accent)" opacity=".08"/><rect x="250" y="30" width="170" height="150" rx="10" fill="var(--accent2)" opacity=".1"/><rect x="426" y="30" width="240" height="150" rx="10" fill="var(--c3)" opacity=".1"/>
    <path d="M40 60 C10 80 12 140 44 158 C60 164 66 150 58 140 C46 126 50 100 64 96" fill="none" stroke="var(--text)" stroke-width="3"/>
    <path d="M66 96 C120 92 170 96 226 100 M66 118 C120 116 170 114 226 116" fill="none" stroke="var(--text)" stroke-width="2"/>
    <path class="wave-in" d="M84 107 h110" stroke="var(--accent)" stroke-width="3"/>
    <line x1="230" y1="86" x2="238" y2="130" stroke="var(--bad)" stroke-width="4"/><text x="234" y="146" text-anchor="middle" font-size="9.5" fill="var(--bad)">eardrum</text>
    <path class="pane-a" d="M240 104 l34 -14 l22 16 l30 -6" fill="none" stroke="var(--text)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="274" cy="90" r="5" fill="var(--accent2)"/><circle cx="296" cy="106" r="5" fill="var(--accent2)"/><circle cx="328" cy="100" r="5" fill="var(--accent2)"/>
    <text x="335" y="74" text-anchor="middle" font-size="9.5" fill="var(--muted)">three tiny bones</text>
    <path d="M330 140 q20 26 50 30" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 3"/><text x="372" y="162" font-size="9" fill="var(--muted)">tube to throat</text>
    <path d="M440 104 c40 -50 130 -50 150 0 c16 40 -40 70 -80 50 c-30 -14 -30 -50 0 -58 c24 -6 44 14 34 30 c-8 12 -26 8 -26 -4" fill="none" stroke="var(--c3)" stroke-width="5" stroke-linecap="round"/>
    <text x="434" y="46" font-size="9.5" fill="var(--bad)">high pitch at the entrance</text><text x="660" y="172" text-anchor="end" font-size="9.5" fill="var(--good)">low pitch at the centre</text>
    <path d="M610 130 q30 10 46 -8" fill="none" stroke="var(--warn)" stroke-width="3"/><text x="636" y="150" text-anchor="middle" font-size="9" fill="var(--muted)">nerve</text>
    <g font-size="12" font-weight="700" text-anchor="middle"><text x="128" y="200">Outer ear — collects</text><text x="335" y="200">Middle ear — matches</text><text x="546" y="200">Inner ear — analyses</text></g>
    <g font-size="9.5" text-anchor="middle" fill="var(--muted)"><text x="128" y="214">canal boosts 2–5 kHz</text><text x="335" y="214">air → fluid, about 30 dB gained</text><text x="546" y="214">pitch laid out along a spiral</text></g>
  </svg>`;
  const SVG_COCH = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="The cochlea unrolled into a frequency map">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The inner ear, unrolled: a 35 mm strip with pitch mapped along it</text>
    <path d="M40 60 L640 78 L640 92 L40 110 Z" fill="var(--panel2)" stroke="var(--text)"/>
    ${[['16 k', 60], ['8 k', 130], ['4 k', 205], ['2 k', 285], ['1 k', 365], ['500', 445], ['250', 520], ['100', 590], ['20', 632]].map(([l, x]) => `<line x1="${x}" y1="56" x2="${x}" y2="114" stroke="var(--line)"/><text x="${x}" y="128" text-anchor="middle" font-size="10">${l}</text>`).join('')}
    <path d="${Array.from({ length: 61 }, (_, i) => { const x = 40 + i * 10, e = Math.exp(-Math.pow((x - 205) / 46, 2)); return `${i ? 'L' : 'M'}${x} ${(85 - 30 * e * Math.sin(i * 0.9)).toFixed(1)}`; }).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
    <rect x="170" y="48" width="70" height="72" rx="6" fill="var(--bad)" opacity=".14" stroke="var(--bad)" stroke-dasharray="4 3"/>
    <text x="205" y="44" text-anchor="middle" font-size="10" fill="var(--bad)" font-weight="700">noise damage starts here</text>
    <text x="40" y="150" font-size="10.5" font-weight="700">stiff, narrow end near the middle ear</text><text x="640" y="150" text-anchor="end" font-size="10.5" font-weight="700">floppy, wide end at the tip</text>
    <text x="340" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">A 4 kHz tone makes one patch of the strip ripple. About 3,500 inner hair cells along the strip report where the ripple is.</text>
    <text x="340" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">They do not grow back.</text>
  </svg>`;
  const SVG_DOSE = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Safe daily listening time halves for every 3 dB">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Every +3 dB halves the safe time</text>
    ${[[85, '8 h', 'busy street, loud restaurant', 'good'], [88, '4 h', 'lawn mower, loud mixing', 'good'], [91, '2 h', 'underground train, shouting', 'warn'], [94, '1 h', 'personal player near full', 'warn'], [97, '30 min', 'small rehearsal, power tools', 'warn'], [100, '15 min', 'band rehearsal, nightclub', 'bad'], [103, '7½ min', 'in front of the stage', 'bad'], [106, 'under 4 min', 'at the drum stool, loud cymbals', 'bad'], [112, '1 min', 'next to the main speakers', 'bad']].map(([L, t, w, c], i) => { const wd = 300 * Math.pow(0.72, i) + 16; return `<g><text x="60" y="${44 + i * 19}" text-anchor="end" font-size="11" font-weight="700">${L} dB(A)</text><rect x="68" y="${34 + i * 19}" width="${wd.toFixed(0)}" height="13" rx="3" fill="var(--${c})" opacity=".75"/><text x="${(76 + wd).toFixed(0)}" y="${44 + i * 19}" font-size="11" font-weight="700">${t}</text><text x="660" y="${44 + i * 19}" text-anchor="end" font-size="10" fill="var(--muted)">${w}</text></g>`; }).join('')}
    <text x="340" y="214" text-anchor="middle" font-size="10" fill="var(--muted)">Recommended daily limits for unprotected ears — a level of risk, not a guarantee of safety.</text>
  </svg>`;
  const SVG_PLUG = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Fitting a foam earplug">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A foam plug only works if it goes in — the three-step fit</text>
    ${[['1 · Roll', 'into a thin, crease-free cylinder', `<rect x="-26" y="-7" width="52" height="14" rx="7" fill="var(--warn)"/><path d="M-34 -16 q34 -12 68 0 M-34 16 q34 12 68 0" fill="none" stroke="var(--muted)" stroke-width="2"/>`], ['2 · Pull', 'the ear up and back to straighten the canal', `<path d="M-10 -30 C-36 -16 -34 22 -8 32 C4 34 6 22 0 14" fill="none" stroke="var(--text)" stroke-width="3"/><path class="wave-in" d="M-4 -34 l12 -12" stroke="var(--accent)" stroke-width="3"/>`], ['3 · Hold', 'for 20–30 s while it expands', `<path d="M-40 -12 H30 M-40 12 H30" stroke="var(--text)" stroke-width="2"/><rect class="seal-squish" x="-22" y="-10" width="46" height="20" rx="8" fill="var(--warn)"/><line x1="34" y1="-18" x2="34" y2="18" stroke="var(--bad)" stroke-width="3"/>`]].map(([t, s, art], i) => `<g transform="translate(${120 + i * 220} 84)">${art}<text y="62" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text y="78" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`).join('')}
    <text x="340" y="184" text-anchor="middle" font-size="10" fill="var(--muted)">Check: your own voice should sound deep and boomy, and cupping your hands over your ears should change nothing.</text>
  </svg>`;
  const SVG_BIN = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Two-eared hearing: time and level differences">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Two ears, three clues to direction</text>
    ${[['Arrival time', 'below about 1.5 kHz', 'up to 0.65 ms difference', 110], ['Level (head shadow)', 'above about 1.5 kHz', 'up to 20 dB difference', 340], ['Outer-ear colouring', 'above about 5 kHz', 'tells up/down and front/back', 570]].map(([t, a, b, x], i) => `<g>
      <circle cx="${x}" cy="88" r="26" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><path d="M${x - 4} 62 l4 -8 l4 8" fill="var(--text)"/>
      <ellipse cx="${x - 28}" cy="88" rx="4" ry="9" fill="var(--accent2)"/><ellipse cx="${x + 28}" cy="88" rx="4" ry="9" fill="var(--accent2)"/>
      ${i === 0 ? `<path class="wave-in" d="M${x + 86} 50 L${x + 34} 84" stroke="var(--accent)" stroke-width="2.5"/><path d="M${x + 86} 50 C${x + 20} 30 ${x - 40} 40 ${x - 32} 80" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3"/>` : i === 1 ? `<path class="wave-in" d="M${x + 86} 88 H${x + 36}" stroke="var(--accent)" stroke-width="4"/><path d="M${x - 36} 88 h-30" stroke="var(--accent)" stroke-width="1.2"/><path d="M${x - 30} 60 l-34 -10 M${x - 30} 116 l-34 10" stroke="var(--muted)" stroke-dasharray="3 3"/>` : `<path class="wave-in" d="M${x + 40} 34 L${x + 30} 78" stroke="var(--accent)" stroke-width="2.5"/><path d="M${x + 76} 124 L${x + 34} 96" stroke="var(--c3)" stroke-width="2.5"/>`}
      <text x="${x}" y="140" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="${x}" y="156" text-anchor="middle" font-size="10">${a}</text><text x="${x}" y="171" text-anchor="middle" font-size="10" fill="var(--muted)">${b}</text></g>`).join('')}
  </svg>`;

  const HEAR = {
    id: 'hearing-depth', n: '4D', title: 'Hearing in Depth — and How to Protect It', level: 'Core', mins: 55,
    summary: 'How the ear actually works, what loudness and pitch really are, how hearing gets damaged — and the practical habits, numbers and protectors that let you work with sound for a lifetime.',
    tags: ['ear', 'cochlea', 'hair cells', 'critical bands', 'phon', 'sone', 'pitch', 'binaural', 'tinnitus', 'threshold shift', 'noise dose', 'exchange rate', 'earplugs', 'audiogram', 'hearing protection'],
    sections: [
      { h: 'Your most important piece of equipment', html: `
        <p class="lead">A microphone can be replaced. A loudspeaker can be reconed. The two sensors on the sides of your head cannot be repaired or upgraded — and every judgement you will ever make about sound passes through them.</p>
        <div class="callout safety"><b>Read this first.</b> Noise damage to hearing is <b>painless, gradual, cumulative and permanent</b>. There is no warning signal you can rely on. By the time you notice difficulty following conversation in a noisy room, the damage was done years earlier. Everything in this course is general education, not medical advice: if you have ringing that does not go away, a sudden change in hearing, pain or dizziness, see a doctor or audiologist promptly — a sudden loss in one ear is an emergency.</div>
        <p>This course has two halves. First, how hearing works — enough to make the rest of the Academy’s rules about loudness, masking and localisation feel obvious. Second, how it fails and how to stop that happening, with numbers you can actually use.</p>
        ${flow([['Understand the ear', 'Collect, match, analyse'], ['Know the measures', 'Decibels, phons, sones'], ['Know the risk', 'Level × time = dose'], ['Measure your day', 'A phone meter is enough to start'], ['Protect and monitor wisely', 'Right plug, right level, regular tests']])}` },
      { h: 'The ear in three stages', html: `
        ${SVG_EAR}
        <h4>Outer ear — a collector and a direction-finder</h4>
        <p>The visible flap (the pinna) and the 2.5 cm canal are not just a funnel. The canal is a tube closed at one end by the eardrum, so it resonates — a quarter-wave resonance near 3 kHz that <b>boosts sounds between about 2 and 5 kHz by 10–15 dB</b>. That is exactly where speech consonants live, and it is why our hearing is most sensitive there. The folds of the pinna add small, direction-dependent peaks and dips above 5 kHz that the brain learns to read as “above”, “behind” or “in front”.</p>
        <h4>Middle ear — an impedance-matching transformer</h4>
        <p>The inner ear is filled with fluid. Sound in air meeting fluid would almost all bounce off — only about a thousandth of the energy would get in (see <a href="#/academy/wave-physics">the impedance course</a>). The middle ear solves this with a neat mechanical trick: the eardrum is about 17 times larger in area than the tiny window into the inner ear, and the three small bones linking them act as a lever. Force collected over a large area is concentrated on a small one, raising the pressure roughly 20–25 times. Nearly 30 dB of sensitivity is recovered.</p>
        <p>Two small muscles can stiffen this chain when a loud sound arrives, cutting low-frequency transmission by 10–20 dB. But the reflex takes several hundredths of a second and tires within minutes: it does nothing against a gunshot or a snare hit, and very little against a long concert.</p>
        <h4>Inner ear — a frequency analyser</h4>
        <p>The cochlea is a fluid-filled spiral the size of a pea. Running along it is a ribbon — the basilar membrane — that is narrow and stiff at the entrance and wide and floppy at the far end. From the first lesson in this track: stiff and light means high resonance, floppy and heavy means low. So each place along the ribbon responds best to its own frequency.</p>
        ${SVG_COCH}
        <p>Sitting on the ribbon are the <b>hair cells</b>. About 3,500 <i>inner</i> hair cells turn the ripple into nerve signals. Some 12,000 <i>outer</i> hair cells do something remarkable: they are tiny motors that push in time with quiet sounds, amplifying them by up to 50 dB and sharpening the tuning. They are the reason you can hear a pin drop and also survive a rock concert — and they are the first thing loud sound destroys.</p>` },
      { h: 'Critical bands: the ear’s built-in analyser', html: `
        <p>Because each place on the ribbon responds to a small range of frequencies, the ear behaves like a bank of overlapping filters — about 24 of them across the hearing range. Each is called a <b>critical band</b>.</p>
        <div class="table-wrap"><table><thead><tr><th>Centre frequency</th><th>Approximate width of the band</th><th>As a musical interval</th></tr></thead><tbody>
          <tr><td>100 Hz</td><td>about 100 Hz</td><td>nearly an octave</td></tr><tr><td>500 Hz</td><td>about 110 Hz</td><td>about a minor third</td></tr><tr><td>1 kHz</td><td>about 160 Hz</td><td>a little under a minor third</td></tr><tr><td>4 kHz</td><td>about 700 Hz</td><td>a little under a minor third</td></tr><tr><td>10 kHz</td><td>about 2.5 kHz</td><td>about a major third</td></tr></tbody></table></div>
        <p>Above roughly 500 Hz the bands are close to a third of an octave wide — which is why third-octave analysers and graphic equalisers are a sensible match to hearing. Critical bands explain a surprising amount:</p>
        <ul><li><b>Masking.</b> A sound hides another most easily when both fall in the same band (see <a href="#/academy/r-mix-eq">EQ and masking</a>).</li><li><b>Roughness and consonance.</b> Two tones inside one band beat and sound rough; separated by more than a band they sound smooth. This is the physical root of why small intervals in the bass sound muddy and the same intervals higher up sound fine.</li><li><b>Loudness adds across bands.</b> Spread the same power over several bands and it sounds louder than when it is crammed into one — wide-band noise is louder than a tone of the same level.</li><li><b>Data-reduced audio.</b> Codecs throw away whatever is masked within each band.</li></ul>` },
      { h: 'Loudness: decibels, phons and sones', html: `
        <p>The decibel measures the physical sound. It does <i>not</i> tell you how loud something seems, for two reasons: the ear’s sensitivity depends strongly on frequency, and “twice as loud” is not “twice the decibels”.</p>
        <ul><li><b>Phon</b> answers “which sounds match?”. A sound has a loudness level of 60 phons if it seems as loud as a 1 kHz tone at 60 dB. The equal-loudness curves join tones of matching loudness.</li><li><b>Sone</b> answers “how many times louder?”. One sone is defined as 40 phons. Each +10 phons doubles the sones.</li></ul>
        <div class="formula"><span class="lbl">Loudness</span>sones = 2 ^ ( (phons − 40) ÷ 10 ) &nbsp;·&nbsp; so +10 dB ≈ twice as loud, −10 dB ≈ half as loud</div>
        <div class="table-wrap"><table><thead><tr><th>Change</th><th>Power</th><th>What you hear</th></tr></thead><tbody>
          <tr><td>+1 dB</td><td>× 1.26</td><td>The smallest step most people detect when comparing directly</td></tr><tr><td>+3 dB</td><td>× 2</td><td>Clearly noticeable, far from “double”</td></tr><tr><td>+6 dB</td><td>× 4</td><td>Obviously louder</td></tr><tr><td>+10 dB</td><td>× 10</td><td>About twice as loud</td></tr><tr><td>+20 dB</td><td>× 100</td><td>About four times as loud</td></tr></tbody></table></div>
        <p><b>Bass needs level.</b> At 50 Hz a tone must reach about 45 dB before you hear it at all, and at low levels the equal-loudness curves are bunched together: a small change in decibels is a big change in loudness. Practical consequences: a mix balanced at high volume loses its bass when played quietly; “loudness” buttons boost the bass for quiet listening; and bass that is 6 dB too strong in a room is a much bigger problem than 6 dB at 1 kHz.</p>
        <div class="callout mentor"><b>Pick one monitoring level and stay there.</b> Because tonal balance shifts with level, professionals calibrate to a fixed listening level (often 79–85 dB(C) of pink noise per speaker, lower in small rooms) and judge balance there, checking briefly louder and quieter.</div>`, viz: 'loudnessSone' },
      { h: 'Pitch, time and the limits of hearing', html: `
        <h4>Pitch</h4>
        <p>The ear judges pitch two ways at once: by <i>where</i> on the ribbon the ripple is, and — below about 4–5 kHz — by the <i>timing</i> of nerve firings, which lock to the waveform. Timing is the more precise: around 1 kHz a trained listener can tell tones apart that differ by about 0.2 %, three cents. Above 5 kHz, where timing fails, tones still sound higher or lower but lose their sense of musical interval — which is why no instrument’s top note is much above 4 kHz (the piano’s top C is 4186 Hz).</p>
        <p>The brain also infers a <b>missing fundamental</b>: give it harmonics at 200, 300 and 400 Hz and it hears a 100 Hz pitch that is not physically there. That is how a tiny phone speaker conveys a bass line, and how “bass enhancer” processors work.</p>
        <h4>The range, and what age does to it</h4>
        <p>The textbook range is 20 Hz to 20 kHz, and it applies to healthy children. The upper limit falls steadily through life as the hair cells at the high-frequency end — which every sound has to pass on its way in — wear out first.</p>
        <div class="table-wrap"><table><thead><tr><th>Age</th><th>Typical upper limit</th><th>Typical loss at 8 kHz (no noise exposure)</th></tr></thead><tbody>
          <tr><td>20</td><td>17–19 kHz</td><td>0 dB</td></tr><tr><td>40</td><td>14–16 kHz</td><td>about 10 dB</td></tr><tr><td>60</td><td>10–12 kHz</td><td>about 30 dB</td></tr><tr><td>75</td><td>6–8 kHz</td><td>about 50 dB</td></tr></tbody></table></div>
        <p>These are averages with a wide spread, and noise exposure adds to them. Experienced engineers in their sixties still make excellent records: almost everything that matters musically is below 10 kHz, and trained listening compensates for a great deal. But it is a reason to use a spectrum analyser as a second opinion on the top octave.</p>
        <h4>Time</h4>
        <p>The ear resolves gaps of about 2–3 ms, yet it <i>integrates</i> loudness over roughly 100–200 ms — a click must be much higher in level than a steady tone to sound equally loud. That is why peak meters and loudness meters disagree, and why short transients can be clipped surprisingly hard before anyone notices. It also takes time to recover: after a loud sound, quieter sounds are masked for up to 100–200 ms.</p>` },
      { h: 'Two ears: finding where sound comes from', html: `
        ${SVG_BIN}
        <ul><li><b>Time difference.</b> A sound from the right reaches the right ear up to about 0.65 ms before the left. The brain uses this below roughly 1.5 kHz, and can detect differences as small as 10 millionths of a second — a degree or two of angle straight ahead.</li><li><b>Level difference.</b> Above about 1.5 kHz the head is large compared with the wavelength and casts an acoustic shadow: the far ear receives up to 20 dB less. Below a few hundred hertz the sound simply bends round the head and both ears get the same level.</li><li><b>Spectral cues.</b> Time and level cannot separate front from back or up from down — the differences are identical. The pinna’s direction-dependent filtering, and small head movements, settle it. The complete set of these filters for one person is their head-related transfer function, the basis of binaural and headphone surround.</li></ul>
        <p>Design consequences appear all over this app: stereo works by feeding the first two cues; a reflection arriving within about a millisecond shifts the image, while one arriving later is fused with the direct sound (see <a href="#/academy/psy-reflections">How we hear rooms</a>); and very low bass cannot be localised, which is why one subwoofer can serve two speakers.</p>
        <div class="callout mentor"><b>The cocktail-party effect.</b> Two ears let the brain pull one voice out of a crowd — worth as much as 10–15 dB of signal-to-noise. Hearing damage that is unequal between the ears, or blocks one ear, wrecks this ability long before quiet listening is affected. It is usually the first thing people complain about.</div>` },
      { h: 'How hearing gets damaged', html: `
        <p>Loud sound overworks the outer hair cells and the nerve connections beneath the inner ones. What happens next depends on how much and how often.</p>
        <div class="table-wrap"><table><thead><tr><th>Name</th><th>What you notice</th><th>What has happened</th></tr></thead><tbody>
          <tr><td><b>Temporary threshold shift</b></td><td>Dull, “cotton-wool” hearing and ringing after a loud night; recovers in hours to days</td><td>Hair cells exhausted and swollen. A warning that the dose was too high — and some of the nerve connections may not have recovered even though the hearing test has</td></tr>
          <tr><td><b>Permanent threshold shift</b></td><td>Nothing at first; later, missing consonants, trouble in noisy places</td><td>Hair cells have died. Begins as a dip around 3–6 kHz, deepens and spreads</td></tr>
          <tr><td><b>Tinnitus</b></td><td>Ringing, hissing or buzzing with no external source</td><td>The brain turning up its own gain to make up for missing input. Affects a large share of professional musicians</td></tr>
          <tr><td><b>Hyperacusis</b></td><td>Ordinary sounds feel uncomfortably or painfully loud</td><td>Loss of the ear’s normal level control</td></tr>
          <tr><td><b>Distorted pitch</b></td><td>One ear hears a note slightly sharp or flat, or rough</td><td>Damaged tuning along a patch of the membrane — devastating for a musician</td></tr>
          <tr><td><b>“Hidden” loss</b></td><td>A normal hearing test, yet real trouble understanding speech in noise</td><td>Nerve connections lost while the hair cells survive; quiet tones are still detected</td></tr>
          <tr><td><b>Acoustic trauma</b></td><td>Immediate loss, often with pain and ringing</td><td>One very intense impulse — gunshot, firework, explosion, feedback shriek in an earpiece — has physically torn structures</td></tr></tbody></table></div>
        <p>Why the dip near 4 kHz? The ear canal’s own resonance delivers 10–15 dB more energy there than anywhere else, so that patch of the cochlea takes the heaviest beating from every kind of noise, whatever its spectrum.</p>
        <p>Listen to what the common patterns do to speech and music. Compare “healthy ears” with each setting — and notice that the damaged version is not simply quieter.</p>`, viz: 'hearingLossSim' },
      { h: 'Dose: level × time', html: `
        <p>The risk depends on the total sound energy the ear receives over the day, so loudness and duration trade against each other. The most widely recommended rule is simple:</p>
        <div class="formula"><span class="lbl">The 3 dB rule</span>85 dB(A) for 8 hours = one full daily dose. Each +3 dB halves the time; each −3 dB doubles it.</div>
        ${SVG_DOSE}
        <p>Three decibels is a doubling of sound energy, so this is just “equal energy”. Some workplace regulations still use a more lenient <b>5 dB rule</b> starting from 90 dB(A): by that reckoning 100 dB(A) is allowed for two hours, where the 3 dB rule allows fifteen minutes. The 5 dB rule was a compromise, not a finding about ears; use the 3 dB rule to look after yourself. Many rules also require protection to be <i>available</i> from 80 dB(A) and set an absolute ceiling for peaks at about 135–140 dB(C), because a single impulse above that can do instant damage.</p>
        <div class="table-wrap"><table><thead><tr><th>Activity</th><th>Typical level at the ear</th><th>Unprotected time for a full day’s dose</th></tr></thead><tbody>
          <tr><td>Mixing at a sensible level</td><td>75–83 dB(A)</td><td>all day</td></tr><tr><td>Mixing “to impress the client”</td><td>90–95 dB(A)</td><td>45 min – 2½ h</td></tr><tr><td>Acoustic piano practice</td><td>80–90 dB(A)</td><td>2½ – 8 h</td></tr><tr><td>Violin (player’s left ear)</td><td>85–95 dB(A)</td><td>45 min – 8 h</td></tr><tr><td>Orchestra, in front of the brass</td><td>92–98 dB(A)</td><td>25 min – 1½ h</td></tr><tr><td>Drum kit, at the stool</td><td>100–108 dB(A)</td><td>2½ – 15 min</td></tr><tr><td>Amplified rehearsal in a small room</td><td>98–106 dB(A)</td><td>4 – 25 min</td></tr><tr><td>Nightclub or front-of-stage</td><td>100–110 dB(A)</td><td>1½ – 15 min</td></tr><tr><td>Headphones, portable player at full</td><td>95–105 dB(A)</td><td>5 – 45 min</td></tr></tbody></table></div>
        <div class="callout warn"><b>The loud bit dominates.</b> Eight hours at 80 dB(A) uses about a third of a day’s dose. Fifteen minutes at 100 dB(A) uses a whole one. Add up a day below and see which activity actually matters.</div>`, viz: 'doseCalc' },
      { h: 'Protection that works — and that you will actually wear', html: `
        <div class="table-wrap"><table><thead><tr><th>Protector</th><th>Label figure</th><th>Typical real-world</th><th>Tone</th><th>Best for</th></tr></thead><tbody>
          <tr><td>Foam plugs</td><td>28–33 dB</td><td>10–20 dB (fit-dependent)</td><td>Muffled: treble cut far more than bass</td><td>Machinery, sleeping, emergencies in your pocket</td></tr>
          <tr><td>Reusable flanged plugs</td><td>20–27 dB</td><td>8–15 dB</td><td>Somewhat muffled</td><td>Crowds, travel, DIY</td></tr>
          <tr><td>“High-fidelity” universal plugs</td><td>12–20 dB</td><td>10–16 dB</td><td>Fairly even</td><td>Concert-goers; an inexpensive first step</td></tr>
          <tr><td>Custom musicians’ plugs (9, 15 or 25 dB filters)</td><td>as chosen</td><td>close to the label</td><td>Flat — music keeps its balance</td><td>Players, engineers, anyone who works in loud sound</td></tr>
          <tr><td>Earmuffs</td><td>22–31 dB</td><td>15–25 dB</td><td>Weak in the bass, strong above</td><td>Drum practice, power tools; quick on and off</td></tr>
          <tr><td>Plugs + muffs together</td><td>—</td><td>only about 5 dB more than the better one</td><td>Very muffled</td><td>Shooting, extreme noise</td></tr></tbody></table></div>
        <p><b>Why the real figure is lower than the label.</b> Laboratory ratings are measured on trained subjects with perfectly fitted protectors. In daily use a foam plug is often barely inside the canal. A common, cautious habit is to halve the label figure for plugs and take about three-quarters of it for muffs.</p>
        ${SVG_PLUG}
        <p><b>Why flat matters.</b> An ordinary plug blocks the ear canal and so removes its 3 kHz resonance as well as blocking sound, which is why everything goes dull. A musicians’ plug contains a small tuned filter that puts the resonance back. The sound is simply quieter — so people keep them in, and a 15 dB plug worn all night beats a 30 dB plug worn half the time.</p>
        <div class="callout data"><b>The arithmetic of taking them out.</b> At 100 dB(A), a protector giving a real 20 dB brings you to 80. Remove it for just 10 minutes of a two-hour session and those minutes alone give two-thirds of a daily dose — more than the other 110 minutes combined.</div>
        <h4>In-ear monitors</h4>
        <p>Sealed in-ears block 20–30 dB of stage sound, which lets a performer monitor at a lower level than wedges would need. They only protect if they are used that way: a sealed earpiece will happily deliver 110 dB. Use a limiter, keep both ears in (taking one out makes you turn the other up), and add an ambience microphone rather than breaking the seal.</p>`, viz: 'earplugTypes' },
      { h: 'Safe working habits for engineers and musicians', html: `
        <div class="uc-grid">
          ${uc('🎚️', 'Mixing engineer', [['Risk', 'Level creeping up through a long session as the ears tire'], ['Do', 'Calibrate a fixed listening level and mark it; check loud for a minute, not an hour; take ten minutes of quiet every hour'], ['Result', 'Better decisions as well as safer ears — fatigue makes everything sound dull, so you add treble you will regret']], 'var(--accent)')}
          ${uc('🥁', 'Drummer', [['Risk', '100–108 dB(A) at the stool; cymbals at ear height'], ['Do', '15 or 25 dB custom plugs or isolating in-ears; lower-volume cymbals and sticks for practice; raise cymbals above ear level'], ['Result', 'A full day of practice inside the allowance']], 'var(--bad)')}
          ${uc('🎻', 'Orchestral player', [['Risk', 'Brass and percussion directly behind; violinists’ own left ear'], ['Do', 'Risers and spacing, clear acoustic screens used with care, 9–15 dB flat plugs for the loud passages'], ['Result', 'Peaks tamed without losing ensemble']], 'var(--accent2)')}
          ${uc('🎧', 'Headphone listener', [['Risk', 'Turning up to drown out trains and traffic'], ['Do', 'Use closed or noise-cancelling headphones so the music can be quieter; set the device’s volume limit; follow “60 % volume, 60 minutes, then a break”'], ['Result', 'Typically 10–15 dB lower listening level for the same clarity']], 'var(--c3)')}
          ${uc('🔊', 'Live sound engineer', [['Risk', 'Several hours at 98–105 dB(A), night after night'], ['Do', 'Measure the level at the mix position; mix to a target average; wear flat plugs for sound-check and support acts'], ['Result', 'The audience is safer too']], 'var(--c4)')}
          ${uc('🏗️', 'Studio builder', [['Risk', 'Saws, routers and nail guns: 100–115 dB(A), impulsive'], ['Do', 'Earmuffs on a hook by every machine; foam plugs in every pocket'], ['Result', 'You get to hear the room you built']], 'var(--warn)')}
        </div>
        <h4>The quiet room is a hearing-protection device</h4>
        <p>People set listening level to sit comfortably above the background. In a room with noisy ventilation, computer fans and traffic rumble, “comfortable” ends up 10 dB or more higher than in a properly quiet room — and the bass has to be louder still to be heard over low-frequency noise. Every decibel of background noise you design out of a studio is a decibel its users will not need to add at the monitors. Good isolation, silent ventilation and a controlled decay are not luxuries; over a thirty-year career they are worth more than any pair of earplugs.</p>
        <h4>Warning signs — act on any of them</h4>
        <ul><li>Ringing or a feeling of fullness after a session.</li><li>Sounds seem dull, or speech is muffled, when you leave.</li><li>You have to shout to someone an arm’s length away (the level is probably above 85–90 dB(A)).</li><li>Ordinary sounds have started to feel harsh.</li></ul>` },
      { h: 'Audiograms: reading the report card', html: `
        <p>A hearing test plays quiet tones at set frequencies (usually 250 Hz to 8 kHz) and finds the faintest you can detect in each ear. The result is plotted as <b>decibels of hearing loss</b> relative to healthy young ears, with better hearing at the top.</p>
        <div class="table-wrap"><table><thead><tr><th>Loss</th><th>Description</th><th>Everyday effect</th></tr></thead><tbody>
          <tr><td>−10 to 20 dB</td><td>Normal range</td><td>None</td></tr><tr><td>20–40 dB</td><td>Mild</td><td>Soft speech and speech in noise are difficult</td></tr><tr><td>40–70 dB</td><td>Moderate</td><td>Normal conversation is hard without a hearing aid</td></tr><tr><td>70–90 dB</td><td>Severe</td><td>Only loud speech close to the ear is heard</td></tr></tbody></table></div>
        <p>What to look for in the shape:</p>
        <ul><li><b>A dip at 3–6 kHz that recovers at 8 kHz</b> — the signature of noise exposure.</li><li><b>A steady slope down to the right</b> — typical of ageing.</li><li><b>A clear difference between the ears</b> — one-sided exposure (a drummer’s hi-hat ear, a violinist’s left ear), or something that needs medical attention.</li></ul>
        <h4>When to get tested</h4>
        <ul><li>A <b>baseline</b> test when you start working seriously with sound — so later tests have something to be compared with.</li><li>Every one or two years if you work regularly in levels above 85 dB(A).</li><li>Immediately after any sudden change, any ringing that lasts more than a day or two, or any loud accident.</li></ul>
        <p>Ask for extended high-frequency testing (up to 16 kHz) if it is offered: changes show up there first.</p>` },
      { h: 'Myths, rules of thumb and applying it', html: `
        ${myth([['My ears have toughened up — loud music does not bother me any more.', 'Ears do not toughen. Not being bothered usually means some hearing has already gone.'], ['If it does not hurt, it is not harmful.', 'Pain begins around 120–130 dB. Damage begins around 85 dB with enough time. There are 40 decibels of silent harm in between.'], ['The ringing went away, so no harm done.', 'The hearing test may recover while nerve connections do not. Repeated temporary shifts add up to a permanent one.'], ['Earplugs ruin the music.', 'Foam plugs do. Flat-response plugs keep the balance and simply turn it down.'], ['Music is safer than industrial noise at the same level.', 'The ear measures energy, not enjoyment.'], ['Twice the decibels is twice as loud.', '+10 dB is about twice as loud; twice the power is only +3 dB.']])}
        <h4>Rules of thumb</h4>
        <ul><li>85 dB(A) for 8 hours; halve the time for every +3 dB.</li><li>If you must raise your voice to be heard at arm’s length, protect or leave.</li><li>Halve the label figure for plugs; three-quarters for muffs.</li><li>The plug you keep in beats the plug with the bigger number.</li><li>+10 dB ≈ twice as loud; 1 dB is the smallest useful step.</li><li>Ten minutes of quiet for every hour of loud.</li></ul>
        <div class="callout example"><b>Apply it today.</b> Install a sound-level-meter app on your phone (they are rough, but good to within a few decibels in the mid range). Measure three things: your usual monitoring level at the listening position, your rehearsal or practice, and your headphones (hold the phone’s microphone against the earpiece — crude, but revealing). Put the numbers into the dose calculator above. Then decide what one change would cut your daily dose the most.</div>` },
    ],
    quiz: [
      { q: 'What is the job of the three small bones of the middle ear?', opts: ['To detect pitch', 'To match airborne sound to the fluid of the inner ear so that it is not reflected', 'To protect against all loud sounds', 'To equalise pressure'], a: 1, why: 'Area ratio plus lever action raises the pressure about 20-fold, recovering nearly 30 dB that would be lost at the air–fluid boundary.' },
      { q: 'By the 3 dB rule, how long is an unprotected daily dose at 100 dB(A)?', opts: ['2 hours', '1 hour', '15 minutes', '4 hours'], a: 2, why: '85 → 8 h, 88 → 4, 91 → 2, 94 → 1, 97 → 30 min, 100 → 15 min.' },
      { q: 'Why do musicians prefer flat-response plugs to foam plugs with a higher rating?', opts: ['They are cheaper', 'They reduce all frequencies about equally, so the music keeps its balance and the plugs stay in', 'They block more bass', 'They need no fitting'], a: 1, why: 'Protection that is worn the whole time beats stronger protection that gets pulled out.' },
      { q: 'A hearing test shows a dip at 4 kHz that recovers at 8 kHz. This most likely indicates…', opts: ['Normal ageing', 'Noise-induced damage', 'Ear wax', 'A faulty headphone'], a: 1, why: 'The canal resonance concentrates energy near 3–4 kHz, so noise damage first appears as a notch there.' },
      { q: 'You raise a sound by 10 dB. Roughly how does its loudness change in the mid range?', opts: ['Ten times as loud', 'About twice as loud', 'Barely noticeable', 'Four times as loud'], a: 1, why: '+10 phons doubles the sones.' },
    ],
  };

  /* =====================================================================
     5B — moving sources and extreme sound
     ===================================================================== */
  const SVG_DOP = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Doppler effect: wavefronts bunch up ahead of a moving source">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A moving source squeezes the waves ahead and stretches those behind</text>
    <clipPath id="s1dopclip"><rect x="0" y="24" width="680" height="154"/></clipPath>
    <g clip-path="url(#s1dopclip)">${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${250 + i * 22}" cy="100" r="${(6 - i) * 26}" fill="none" stroke="var(--accent)" stroke-width="1.6" opacity="${0.35 + i * 0.1}"/>`).join('')}</g>
    <circle cx="372" cy="100" r="7" fill="var(--bad)"/><path class="wave-in" d="M384 100 h40" stroke="var(--bad)" stroke-width="3"/>
    <circle cx="640" cy="100" r="6" fill="var(--text)"/><text x="640" y="126" text-anchor="middle" font-size="10">hears it higher</text>
    <circle cx="40" cy="100" r="6" fill="var(--text)"/><text x="46" y="126" text-anchor="middle" font-size="10">hears it lower</text>
    <text x="520" y="64" text-anchor="middle" font-size="10" fill="var(--good)" font-weight="700">short wavelength</text><text x="150" y="40" text-anchor="middle" font-size="10" fill="var(--warn)" font-weight="700">long wavelength</text>
    <text x="340" y="194" text-anchor="middle" font-size="10" fill="var(--muted)">Every wavefront still travels at the speed of sound; only their spacing changes.</text>
  </svg>`;
  const SVG_SPEC = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="The sound spectrum from infrasound to ultrasound">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Sound does not stop where hearing does</text>
    <rect x="20" y="52" width="170" height="34" fill="var(--c4)" opacity=".4"/><rect x="190" y="52" width="250" height="34" fill="var(--accent)" opacity=".5"/><rect x="440" y="52" width="220" height="34" fill="var(--c3)" opacity=".45"/>
    <g font-size="12" font-weight="700" text-anchor="middle"><text x="105" y="74">Infrasound</text><text x="315" y="74">Audible</text><text x="550" y="74">Ultrasound</text></g>
    ${[['0.1 Hz', 20], ['1 Hz', 105], ['20 Hz', 190], ['1 kHz', 315], ['20 kHz', 440], ['1 MHz', 560], ['10 MHz', 660]].map(([l, x]) => `<line x1="${x}" y1="86" x2="${x}" y2="94" stroke="var(--text)"/><text x="${x}" y="108" text-anchor="${x < 30 ? 'start' : x > 650 ? 'end' : 'middle'}" font-size="10">${l}</text>`).join('')}
    <g font-size="10" fill="var(--muted)"><text x="24" y="44">earthquakes · volcanoes · wind turbines</text><text x="24" y="130">ocean waves · large machinery</text><text x="24" y="146">wavelengths of tens of metres to km</text>
    <text x="315" y="44" text-anchor="middle">speech · music · noise</text><text x="315" y="130" text-anchor="middle">17 m down to 17 mm in air</text>
    <text x="656" y="44" text-anchor="end">bats · parking sensors · cleaning baths</text><text x="656" y="130" text-anchor="end">medical imaging · flaw detection</text><text x="656" y="146" text-anchor="end">wavelengths under a millimetre</text></g>
    <text x="340" y="178" text-anchor="middle" font-size="10" fill="var(--muted)">The physics is identical throughout; only the wavelength — and therefore what it can bend round or resolve — changes.</text>
  </svg>`;
  const SVG_STEEP = `<svg class="gsvg" viewBox="0 0 680 180" role="img" aria-label="A very loud wave steepens into a sawtooth">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Very loud sound distorts itself as it travels (waves moving to the right)</text>
    ${[['At the source', 0, 30], ['Further on', 0.6, 250], ['Shock formed', 1, 470]].map(([t, s, x]) => `<g transform="translate(${x} 0)">
      <line x1="0" y1="86" x2="180" y2="86" stroke="var(--line)"/>
      <path d="${Array.from({ length: 241 }, (_, i) => { const u = (i / 240) * Math.PI * 4, th = u + s * Math.sin(u); return `${i ? 'L' : 'M'}${((th / (Math.PI * 4)) * 180).toFixed(1)} ${(86 - 38 * Math.sin(u)).toFixed(1)}`; }).join(' ')}" fill="none" stroke="var(--${s === 0 ? 'good' : s < 1 ? 'warn' : 'bad'})" stroke-width="2.4"/>
      <text x="90" y="146" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="90" y="162" text-anchor="middle" font-size="10" fill="var(--muted)">${s === 0 ? 'a pure tone' : s < 1 ? 'peaks catching up: harmonics appear' : 'a sawtooth with a near-vertical front'}</text></g>`).join('')}
    <path class="wave-in" d="M218 86 h22 M438 86 h22" stroke="var(--muted)" stroke-width="2"/>
  </svg>`;
  const SVG_SEA = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Sound speed profile and the deep sound channel">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Sound in the sea bends towards the slow layer — and gets trapped there</text>
    <rect x="20" y="30" width="640" height="150" fill="var(--accent2)" opacity=".1"/><line x1="20" y1="30" x2="660" y2="30" stroke="var(--text)" stroke-width="2"/><rect x="20" y="180" width="640" height="6" fill="var(--muted)" opacity=".6"/>
    <path d="M110 30 C112 50 60 60 56 78 C54 100 90 150 124 180" fill="none" stroke="var(--accent)" stroke-width="2.6"/>
    <text x="126" y="48" font-size="10">warm: fast</text><text x="66" y="82" font-size="10" font-weight="700" fill="var(--good)">slowest (about 1 km)</text><text x="132" y="170" font-size="10">high pressure: fast</text>
    <line x1="170" y1="78" x2="660" y2="78" stroke="var(--good)" stroke-dasharray="5 4"/>
    ${[24, 38, 52].map((a) => `<path d="${Array.from({ length: 99 }, (_, i) => `${i ? 'L' : 'M'}${180 + i * 4.9} ${(78 - a * Math.sin(i * (0.2 - a * 0.0012))).toFixed(1)}`).join(' ')}" fill="none" stroke="var(--c3)" stroke-width="1.5" opacity=".8"/>`).join('')}
    <circle cx="180" cy="78" r="5" fill="var(--bad)"/>
    <text x="340" y="204" text-anchor="middle" font-size="10" fill="var(--muted)">Rays weave above and below the axis without touching surface or sea bed, so almost nothing is lost.</text>
  </svg>`;

  const MOVE = {
    id: 'moving-extreme', n: '5B', title: 'Moving Sources and Sound Beyond the Studio: Doppler, Shock Waves, Ultrasound and Underwater Sound', level: 'Core', mins: 45,
    summary: 'What happens when the source moves, when it moves faster than sound, when sound gets too loud for the air to carry cleanly, when it is too high or too low to hear, and when it travels through water and rock — and what each extreme teaches the studio designer.',
    tags: ['Doppler', 'Mach', 'sonic boom', 'shock wave', 'nonlinear', 'harmonic generation', 'infrasound', 'ultrasound', 'parametric speaker', 'underwater', 'sound channel', 'sonar', 'seismic'],
    sections: [
      { h: 'Why look outside the studio?', html: `
        <p class="lead">Every rule in this Academy quietly assumes that the source stands still, that the air behaves gently, and that sound stays in the range we can hear. Step outside those assumptions and the same physics produces sirens that change pitch, booms from the sky, pictures of unborn babies and whale songs that cross oceans.</p>
        <p>This is partly for the pleasure of knowing. But each extreme also shines a light back on ordinary room acoustics: it shows <i>why</i> the everyday rules work, and where their edges are.</p>
        ${flow([['Source moves', 'Doppler shift'], ['Faster than sound', 'Mach cone and boom'], ['Too loud', 'Steepening and shock'], ['Too high, too low', 'Ultrasound and infrasound'], ['Other media', 'Water, rock, structures'], ['Back to the room', 'What it means for design']])}` },
      { h: 'The Doppler effect', html: `
        ${SVG_DOP}
        <p>A source sends out wavefronts at a steady rate. If it is moving towards you, each new front starts a little closer than the last, so they arrive more often: higher pitch. Moving away, they arrive less often: lower pitch. Nothing has happened to the speed of the sound, only to the spacing of the fronts.</p>
        <div class="formula"><span class="lbl">Doppler</span>heard frequency = true frequency × (c + listener’s speed towards source) ÷ (c − source’s speed towards listener)</div>
        <p>For speeds much lower than sound a shortcut is plenty: <b>the shift in percent ≈ speed ÷ 3.4 m/s</b>. A car at 34 m/s (about 120 km/h) is 10 % sharp coming and 9 % flat going — a little under two semitones each way, so the pitch drops by more than a minor third as it passes.</p>
        <div class="callout mentor"><b>Three things people get wrong.</b> (1) The pitch does <i>not</i> rise as the car approaches — it is steady and high, then glides down as it passes, then steady and low. The sense of “rising” is the loudness growing. (2) Only the part of the motion along the line between source and listener counts. Directly abeam there is no shift at all. (3) The shift does not depend on distance, only on speed.</div>
        <p>Hear it and see the glide below. Move the listener closer to the road and the glide becomes abrupt; move back and it stretches out.</p>`, viz: 'dopplerLab' },
      { h: 'Doppler in music and audio', html: `
        <div class="uc-grid">
          ${uc('🎹', 'The rotating-speaker cabinet', [['Idea', 'A horn spins at about 0.7 or 6.5 turns a second. As the mouth sweeps towards you and away, pitch wobbles up and down; as it points at you and away, loudness and tone wobble too'], ['Result', 'Vibrato, tremolo and a moving spatial image at once — the swirling organ sound. Recording it needs two microphones spaced around the cabinet to capture the motion']], 'var(--accent)')}
          ${uc('🔊', 'Doppler distortion in loudspeakers', [['Idea', 'A cone that is making a large, slow bass movement is also the source of the treble. The treble’s source is therefore moving to and fro, and its pitch is modulated at the bass frequency'], ['Fix', 'Split the range between several drivers so that no cone makes big excursions while also carrying high frequencies. In practice it is one of the smaller distortions, well below what the motor and suspension produce']], 'var(--accent2)')}
          ${uc('🎬', 'Sound design', [['Idea', 'A pass-by sounds real only if pitch, level and tone all change together'], ['Do', 'Automate a pitch glide of the right size for the speed, a level curve following 1 ÷ distance, and a little high-frequency loss with distance'], ['Result', 'A convincing fly-past from a static recording']], 'var(--c3)')}
          ${uc('📡', 'Measuring speed', [['Idea', 'Send a tone at a moving object and compare the echo’s frequency with the original'], ['Result', 'Speed cameras, weather radar, blood-flow meters in hospitals and the motion sensors in automatic doors all work this way — with radio waves or ultrasound']], 'var(--c4)')}
        </div>
        <p>Wind is a quieter relative of the same idea. A steady wind does not change the pitch you hear from a fixed source (source and listener are not moving relative to each other), but it does bend the sound path — downwind sound is bent towards the ground and carries; upwind it is lifted away. Outdoor events learn this every summer.</p>` },
      { h: 'Faster than sound: the Mach cone', html: `
        <p>Speed compared with the speed of sound is the <b>Mach number</b>. Mach 1 is about 343 m/s (1235 km/h) at 20 °C — and only about 295 m/s in the cold air at airliner cruising height, because the speed of sound depends on temperature.</p>
        <p>Below Mach 1 the source’s own sound runs ahead of it, “warning” the air. At Mach 1 the source keeps pace with its sound and the wavefronts pile up at its nose. Above Mach 1 it outruns them: the fronts overlap along a cone trailing behind, and along that cone they add into one abrupt pressure jump — a <b>shock wave</b>.</p>
        <div class="formula"><span class="lbl">Mach cone</span>sin (half-angle) = 1 ÷ Mach number &nbsp;·&nbsp; Mach 1.4 → 46° · Mach 2 → 30° · Mach 3 → 19.5°</div>
        <p>Where the cone sweeps across the ground, people hear a <b>sonic boom</b>: typically a double thump, from the shocks at the nose and tail, with a pressure jump of 50–100 pascals — only about 130 dB peak, but arriving in a few thousandths of a second, which is what rattles windows.</p>
        <ul><li>The boom is not a one-off event at the moment of “breaking the barrier”. It is dragged along the ground continuously, in a carpet tens of kilometres wide, for as long as the aircraft is supersonic.</li><li>You hear nothing before it arrives. The aircraft is already well past overhead.</li><li>A rifle bullet’s “crack” is its own small boom and arrives before the muzzle bang. The snap of a whip is the tip passing Mach 1. Thunder is the shock from air heated explosively by lightning.</li></ul>`, viz: 'machCone' },
      { h: 'When sound is too loud for the air: steepening and shock', html: `
        <p>All of ordinary acoustics rests on one convenient fact: at normal levels, air is <b>linear</b>. Two sounds pass through each other without interacting; double the source and you double the pressure; a pure tone stays a pure tone. Rooms, absorbers, equalisers and measurements all depend on it.</p>
        <p>It is only an approximation. In the compressed part of a wave the air is slightly warmer, so sound travels slightly faster there — and the air itself is moving forward. In the rarefied part, the opposite. So the crests gradually catch up with the troughs.</p>
        ${SVG_STEEP}
        <p>A wave that leans forward is no longer a pure sine: it has acquired harmonics — the air has distorted it. Given enough level and distance the front becomes vertical: a shock.</p>
        <div class="table-wrap"><table><thead><tr><th>Level</th><th>Pressure swing vs atmosphere</th><th>Where you meet it</th><th>Does the air distort it?</th></tr></thead><tbody>
          <tr><td>94 dB</td><td>0.001 %</td><td>Loud monitoring</td><td>No — utterly negligible</td></tr>
          <tr><td>120 dB</td><td>0.03 %</td><td>Front row of a loud concert</td><td>Not measurably over room distances</td></tr>
          <tr><td>140–150 dB</td><td>0.3–1 %</td><td>Inside the throat of a horn driver; a trumpet bell at full blast</td><td>Yes — a few percent of second harmonic within a metre</td></tr>
          <tr><td>160–170 dB</td><td>3–9 %</td><td>Close to a jet engine or rocket</td><td>Strongly — the “crackle” of a jet is shocks</td></tr>
          <tr><td>194 dB</td><td>100 %</td><td>The limit for an undistorted wave: the trough would be a vacuum</td><td>Beyond this it is a blast wave, not sound</td></tr></tbody></table></div>
        <p><b>Horns.</b> A compression driver squeezes a large diaphragm’s output through a throat a few centimetres across, so pressures there can pass 150 dB even when the audience hears 100 dB. The air in the throat distorts the wave before the horn has expanded it. This is a real limit of horn loudspeakers at high power; larger throats and faster-opening horns reduce it.</p>
        <p><b>Brass.</b> Played loudly, the wave inside a trombone or trumpet steepens along the long narrow tube — part of the reason the tone becomes “brassy” at fortissimo.</p>`, viz: 'steepening' },
      { h: 'Blast and impulse: why peak limits exist', html: `
        <p>An explosion, a gunshot or a firework produces a single shock: pressure leaps in microseconds, falls back in a millisecond or so, and briefly dips below atmospheric. The ear’s protective reflex needs tens of milliseconds to act, so it is useless here, and the delicate structures of the inner ear can be damaged mechanically in one event.</p>
        <div class="table-wrap"><table><thead><tr><th>Source</th><th>Typical peak level at the ear</th></tr></thead><tbody>
          <tr><td>Hand clap close to the ear, balloon bursting</td><td>125–155 dB</td></tr><tr><td>Snare rim-shot at the player’s ear</td><td>125–135 dB</td></tr><tr><td>Firework at a few metres</td><td>150–170 dB</td></tr><tr><td>Rifle or shotgun at the shooter’s ear</td><td>155–170 dB</td></tr><tr><td>Airbag deployment</td><td>160–170 dB</td></tr></tbody></table></div>
        <div class="callout safety"><b>Peak limits.</b> Occupational rules set a ceiling of about 135–140 dB(C) peak that must never be exceeded without protection, however short the sound — quite separate from the daily dose described in <a href="#/academy/hearing-depth">Hearing in depth</a>. For acoustic testing this matters: popping balloons or firing a starter pistol to measure a room is a real exposure. Wear protection, stand back, or use a loudspeaker sweep instead.</div>
        <p>For the measurer there is a second lesson: an impulse that loud is in the non-linear range close to the source, so the “impulse response” it gives is not quite what a gentle signal would give. Swept sine measurements avoid both problems.</p>` },
      { h: 'Too low and too high to hear: infrasound and ultrasound', html: `
        ${SVG_SPEC}
        <h4>Infrasound — below about 20 Hz</h4>
        <p>Wavelengths of tens of metres to kilometres. It bends round almost anything, passes through ordinary walls nearly untouched, and is hardly absorbed by the air, so it travels enormous distances: instruments detect volcanic eruptions and large explosions from the far side of the planet. Everyday sources are wind on buildings, ventilation fans with pulsing flow, heavy traffic, large diesel engines and wind turbines. At high enough levels it is perceived as pressure, vibration or unease rather than as tone, and it rattles lightweight ceilings and windows — which people <i>do</i> hear.</p>
        <h4>Ultrasound — above about 20 kHz</h4>
        <p>Wavelengths of millimetres or less. That makes it easy to focus into beams and able to resolve fine detail — and it is absorbed rapidly in air (about 1 dB per metre at 40 kHz, far more higher up), so in air it is strictly short-range.</p>
        <div class="table-wrap"><table><thead><tr><th>Use</th><th>Frequency</th><th>How it works</th></tr></thead><tbody>
          <tr><td>Bats, dolphins, parking sensors, room occupancy detectors</td><td>20–200 kHz</td><td>Send a click, time the echo: distance = speed × time ÷ 2</td></tr>
          <tr><td>Cleaning baths</td><td>20–40 kHz</td><td>Intense sound in liquid makes tiny bubbles form and collapse, scrubbing surfaces</td></tr>
          <tr><td>Medical imaging</td><td>2–15 MHz</td><td>Echoes from boundaries between tissues with different impedance; higher frequency gives finer detail but less depth</td></tr>
          <tr><td>Testing welds and castings</td><td>0.5–10 MHz</td><td>A crack is an impedance step that returns an early echo</td></tr>
          <tr><td>Directional “audio spotlight” speakers</td><td>carrier 40–60 kHz</td><td>See below</td></tr></tbody></table></div>
        <h4>The parametric loudspeaker — sound from ultrasound</h4>
        <p>Here non-linearity is put to work. An array a hand’s width across is many wavelengths wide at 40 kHz, so it emits a pencil-thin beam of ultrasound. That beam is made intense and modulated with the audio signal; the slight non-linearity of the air then “demodulates” it along the beam, creating audible sound in mid-air. Because the audible sound is born along a long thin column, it inherits the beam’s narrowness — you hear it only when standing in the beam. Museums and shop displays use it. The price is poor efficiency, very little bass and noticeable distortion.</p>
        <div class="callout mentor"><b>Do “ultrasonic” audio formats matter?</b> Recording above 20 kHz does no harm, and gives filters room to work gently. But content up there is not heard as such, and if it is strong it can create audible distortion products in amplifiers and tweeters. Controlled blind tests are the only way to settle such questions — see <a href="#/academy/psy-truth">Facts, myths and blind testing</a>.</div>` },
      { h: 'Sound in the sea', html: `
        <p>Water is about 800 times denser than air but far stiffer still, so sound travels about <b>1500 m/s</b> in it — more than four times faster than in air — and loses very little energy: at 100 Hz the sea absorbs roughly a thousandth of a decibel per kilometre. Light fades within a hundred metres of sea; radio hardly penetrates at all. Sound is how everything underwater sees, talks and navigates.</p>
        <p>The speed is not uniform. It rises with <b>temperature</b> (about 3–4 m/s per °C), with <b>depth</b> (about 1.7 m/s per 100 m, from pressure) and slightly with <b>saltiness</b>.</p>
        ${SVG_SEA}
        <p>In most oceans that gives a profile with a minimum roughly a kilometre down: above it the water is warmer (faster); below it the pressure wins (faster again). And sound always bends towards the slower region — the same refraction that carries voices across a cool lake at night. A ray heading upward from the slow layer is turned back down; a ray heading down is turned back up. Sound launched near that depth is trapped in a natural waveguide, the <b>deep sound channel</b>, spreading in two dimensions instead of three and never touching the lossy surface or sea bed.</p>
        <ul><li>Low-frequency signals in the channel have been received thousands of kilometres from the source.</li><li>Large whales call at 15–30 Hz, frequencies that the channel carries across ocean basins.</li><li><b>Sonar</b> either listens (passive) or sends a ping and times the echo (active). Fish-finders and depth sounders are the everyday versions.</li><li>The same bending creates <b>shadow zones</b> that sound cannot reach directly — submarines hide in them.</li></ul>`, viz: 'seaChannel' },
      { h: 'Sound in solids: rock, steel and buildings', html: `
        <p>Solids carry sound faster and with less loss than air, and in more than one way. Air can only be squeezed, so it carries only compression waves. A solid also resists changing shape, so it carries <b>shear</b> waves, and thin plates and beams carry <b>bending</b> waves — the ones that matter most in buildings.</p>
        <div class="table-wrap"><table><thead><tr><th>Medium</th><th>Speed of compression waves</th><th>Compared with air</th></tr></thead><tbody>
          <tr><td>Air (20 °C)</td><td>343 m/s</td><td>1</td></tr><tr><td>Water</td><td>about 1480 m/s</td><td>4.3 ×</td></tr><tr><td>Timber along the grain</td><td>3500–5000 m/s</td><td>10–15 ×</td></tr><tr><td>Brick, concrete</td><td>3000–4000 m/s</td><td>about 10 ×</td></tr><tr><td>Steel, aluminium, glass</td><td>5000–6000 m/s</td><td>about 16 ×</td></tr></tbody></table></div>
        <p><b>Earthquakes</b> are the grandest example. The fast compression wave arrives first, then the slower, more destructive shear wave; the gap between them tells a seismologist how far away the quake was — about 8 km for each second of delay. Because liquids cannot carry shear, the shadow the shear waves leave on the far side of the planet revealed that the Earth has a liquid outer core.</p>
        <p><b>In buildings</b> the same thing happens at a smaller scale. A footstep, a pump or a subway train puts vibration into the structure, where it travels quickly and with little loss through concrete and steel, and is re-radiated as sound by walls and floors far from the source. This is why airborne isolation alone never makes a quiet studio: see <a href="#/academy/flanking">Flanking</a>, <a href="#/academy/vibration">Vibration isolation</a> and <a href="#/academy/floating">Floating floors</a>.</p>
        <div class="callout physics"><b>Heat and sound.</b> A sound wave slightly warms the air it compresses and cools the air it expands. Usually that is a tiny loss. Arrange a steep temperature difference along a stack of narrow channels inside a resonant tube, however, and the exchange runs the other way: heat drives a powerful sound wave — and a powerful sound wave can pump heat. Such thermoacoustic engines and refrigerators have no moving parts apart from the gas itself.</div>` },
      { h: 'What the extremes teach the studio designer', html: `
        <div class="table-wrap"><table><thead><tr><th>Extreme</th><th>Lesson for ordinary rooms</th></tr></thead><tbody>
          <tr><td>Steepening needs 140 dB and more</td><td>At studio levels air is linear. Sounds simply add; room acoustics can be measured with a quiet sweep and the result holds at any normal level. If you hear distortion, it is the equipment — or something rattling</td></tr>
          <tr><td>Infrasound passes through almost anything</td><td>The lower the frequency, the harder it is to stop or absorb. Isolation and bass control are always the expensive part of a studio</td></tr>
          <tr><td>Ultrasound is easily beamed and easily absorbed</td><td>High frequencies are the easy part: a few centimetres of absorber or a small obstacle deals with them. Over-treating the highs while ignoring the lows is the classic beginner’s mistake</td></tr>
          <tr><td>The ocean channel and the cool lake</td><td>Sound bends towards slower (cooler) air. Outdoors, temperature and wind gradients decide how far noise carries — a site that measures quiet at noon may not be at night</td></tr>
          <tr><td>Solids carry sound fast and far</td><td>Break the structural path: floating floors, resilient mounts, flexible connections on every pipe and duct</td></tr>
          <tr><td>The impedance step at air–water</td><td>Big changes of impedance reflect. That is the principle behind every massive wall, and the reason a porous absorber must be “nearly air”</td></tr>
          <tr><td>Doppler</td><td>A moving source or microphone changes pitch — keep microphones and stands still, and remember that a spinning speaker is an effect, not a fault</td></tr></tbody></table></div>
        ${myth([['A siren’s pitch rises as it comes towards you.', 'It is steady and high on approach and steady and low on departure; the glide happens only as it passes.'], ['The sonic boom happens when the aircraft breaks the sound barrier.', 'It is produced continuously during supersonic flight and sweeps along the ground beneath.'], ['Very loud bass in a club is distorted by the air.', 'Not at 110–120 dB. The distortion is in amplifiers, drivers and your own ears.'], ['Sound travels worse in water than in air.', 'It travels over four times faster and vastly further. It is our ears, matched to air, that work badly underwater.'], ['Ultrasound is dangerous because you cannot hear it.', 'In air it is absorbed within metres and little of it enters the ear; exposure limits exist for intense industrial sources, but ordinary sensors are harmless.']])}
        <h4>Rules of thumb</h4>
        <ul><li>Doppler shift in percent ≈ speed in m/s ÷ 3.4.</li><li>Mach cone: sin (half-angle) = 1 ÷ Mach.</li><li>Air is effectively linear below about 130 dB.</li><li>Speed of sound: air 343, water 1500, concrete and steel 3000–6000 m/s.</li><li>Sound bends towards the slower region.</li><li>Echo ranging: distance = speed × time ÷ 2.</li></ul>
        <div class="callout example"><b>Apply it today.</b> Stand safely beside a road and listen to one car pass. Hum the pitch of its engine or tyre note as it approaches and again as it leaves. The interval you hum tells you its speed: about one semitone total for 36 km/h, two for 72 km/h, three for 107 km/h. Check your answer against the speed limit.</div>` },
    ],
    quiz: [
      { q: 'A car passes you at a steady speed in a straight line. How does the pitch of its horn behave?', opts: ['Rises steadily as it approaches, then falls', 'Steady and high while approaching, a glide down as it passes, then steady and low', 'Jumps instantly from high to low', 'Stays constant; only loudness changes'], a: 1, why: 'Only the speed along the line to the listener matters; that changes smoothly through zero as the car passes.' },
      { q: 'An aircraft flies at Mach 2. What is the half-angle of its shock cone?', opts: ['60°', '45°', '30°', '19.5°'], a: 2, why: 'sin μ = 1 ÷ 2, so μ = 30°.' },
      { q: 'Why can room acoustics be treated as linear at normal listening levels?', opts: ['Because walls absorb the distortion', 'Because the pressure swing is a minute fraction of atmospheric pressure, so wave steepening over room distances is negligible', 'Because loudspeakers are linear', 'Because the ear cannot hear distortion'], a: 1, why: 'At 100 dB the swing is about 0.003 % of atmospheric pressure and a shock would need kilometres to form.' },
      { q: 'Why does sound stay trapped in the deep sound channel of the ocean?', opts: ['The water there is saltier', 'Sound bends towards the layer where it travels slowest, so rays are turned back from above and below', 'The sea bed reflects it perfectly', 'Pressure stops it rising'], a: 1, why: 'Refraction towards the speed minimum makes a natural waveguide.' },
      { q: 'Which statement about very low and very high frequencies helps a studio designer most?', opts: ['Both are equally easy to absorb', 'Low frequencies pass through and bend round obstacles and are hard to stop; high frequencies are easily blocked and absorbed', 'High frequencies travel further through walls', 'Infrasound cannot pass through buildings'], a: 1, why: 'Long wavelengths ignore obstacles and thin absorbers; short ones do not.' },
    ],
  };

  insertAfter(['harmonics', 'sound'], VIB);
  insertAfter(['psy-truth', 'hearing'], HEAR);
  insertAfter(['wave-physics', 'propagation'], MOVE);
})();
