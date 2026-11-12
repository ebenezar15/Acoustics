/* ==========================================================================
   Recording, Mixing & Mastering track — part 1 (R1–R5):
   microphones, stereo techniques, miking instruments, the session, DAW/MIDI/sync.
   Original teaching text; brand-neutral.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|do|choose|set-up|result/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const T = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${c}</b>` : c}</td>`).join('')}</tr>`).join('')}</table></div>`;

  /* ------------------------------ diagrams ------------------------------ */
  const SVG_MICTYPES = `<svg class="gsvg" viewBox="0 0 700 220" role="img" aria-label="How the three main microphone types work">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Three ways to turn moving air into voltage</text>
    ${[['Dynamic', 'coil moves in a magnet', 'rugged · handles loud sources', 40], ['Condenser', 'thin membrane next to a charged plate', 'detailed · needs power', 270], ['Ribbon', 'foil strip hanging in a magnet', 'smooth highs · figure-8', 500]].map(([t, a, b, x], i) => `<g>
      <rect x="${x}" y="34" width="170" height="110" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
      ${i === 0 ? `<path class="pane-a" d="M${x + 50} 60 q20 30 0 60" fill="none" stroke="var(--accent)" stroke-width="4"/><rect class="pane-a" x="${x + 62}" y="78" width="26" height="24" fill="none" stroke="var(--c3)" stroke-width="3"/><rect x="${x + 96}" y="66" width="34" height="48" fill="var(--muted)"/><text x="${x + 113}" y="94" text-anchor="middle" font-size="10" fill="var(--panel)">N S</text>`
      : i === 1 ? `<line class="pane-a" x1="${x + 70}" y1="56" x2="${x + 70}" y2="124" stroke="var(--accent)" stroke-width="3"/><rect x="${x + 82}" y="56" width="10" height="68" fill="var(--muted)"/><path d="M${x + 92} 90 h30 v-24 h20" fill="none" stroke="var(--c3)" stroke-width="2"/><text x="${x + 128}" y="112" font-size="10" fill="var(--c3)">+48 V</text>`
      : `<rect x="${x + 46}" y="56" width="20" height="68" fill="var(--muted)"/><rect x="${x + 104}" y="56" width="20" height="68" fill="var(--muted)"/><path class="pane-a" d="M${x + 85} 54 q6 8 0 16 q-6 8 0 16 q6 8 0 16 q-6 8 0 16 q6 4 0 8" fill="none" stroke="var(--accent)" stroke-width="3"/>`}
      <g class="wave-in"><path d="M${x + 16} 80 q8 10 0 20" fill="none" stroke="var(--warn)" stroke-width="2"/><path d="M${x + 26} 74 q12 16 0 32" fill="none" stroke="var(--warn)" stroke-width="2"/></g>
      <text x="${x + 85}" y="164" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="${x + 85}" y="180" text-anchor="middle" font-size="10" fill="var(--muted)">${a}</text><text x="${x + 85}" y="196" text-anchor="middle" font-size="10" fill="var(--good)">${b}</text></g>`).join('')}
  </svg>`;
  const SVG_CHAIN = `<svg class="gsvg" viewBox="0 0 700 130" role="img" aria-label="Microphone signal chain">
    ${[['Source', 'the instrument and the room'], ['Microphone', 'type · pattern · position'], ['Cable', 'balanced, 3-pin'], ['Preamp', 'gain · phantom · pad · HPF'], ['Converter', 'into the recorder']].map(([t, s], i) => `<g><rect x="${14 + i * 138}" y="30" width="120" height="56" rx="8" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/><text x="${74 + i * 138}" y="54" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="${74 + i * 138}" y="72" text-anchor="middle" font-size="9" fill="var(--muted)">${s}</text>${i < 4 ? `<path class="leak-pulse" d="M${134 + i * 138} 58 h18" stroke="var(--accent)" stroke-width="3"/>` : ''}</g>`).join('')}
    <text x="350" y="116" text-anchor="middle" font-size="11" fill="var(--muted)">The earlier in the chain you fix a problem, the better it sounds: source first, then position, then microphone, then anything electronic.</text>
  </svg>`;
  const pair = (x, title, ang, sp, note, pat) => `<g transform="translate(${x} 0)">
      <text x="80" y="16" text-anchor="middle" font-size="11" font-weight="700">${title}</text>
      <path d="M10 44 Q80 14 150 44" fill="none" stroke="var(--muted)" stroke-dasharray="4 4"/>
      <g transform="translate(${80 - sp / 2} 96) rotate(${-ang / 2})"><ellipse cx="0" cy="-22" rx="${pat === 'o' ? 20 : 15}" ry="${pat === '8' ? 24 : 22}" fill="var(--accent)" opacity=".25"/>${pat === '8' ? '<ellipse cx="0" cy="22" rx="15" ry="24" fill="var(--accent)" opacity=".15"/>' : ''}<rect x="-4" y="-8" width="8" height="18" rx="3" fill="var(--text)"/></g>
      <g transform="translate(${80 + sp / 2} 96) rotate(${ang / 2})"><ellipse cx="0" cy="-22" rx="${pat === 'o' ? 20 : 15}" ry="${pat === '8' ? 24 : 22}" fill="var(--c3)" opacity=".25"/>${pat === '8' ? '<ellipse cx="0" cy="22" rx="15" ry="24" fill="var(--c3)" opacity=".15"/>' : ''}<rect x="-4" y="-8" width="8" height="18" rx="3" fill="var(--text)"/></g>
      <text x="80" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">${note}</text></g>`;
  const SVG_PAIRS = `<svg class="gsvg" viewBox="0 0 700 150" role="img" aria-label="Stereo microphone pairs">
    ${pair(10, 'XY', 90, 0, '90°, capsules together', 'c')}${pair(180, 'ORTF', 110, 30, '110°, 17 cm', 'c')}${pair(350, 'AB spaced', 0, 80, 'omnis 40–60 cm apart', 'o')}${pair(520, 'Blumlein', 90, 0, 'figure-8s at 90°', '8')}
  </svg>`;
  const SVG_MS = `<svg class="gsvg" viewBox="0 0 700 190" role="img" aria-label="Mid-Side decoding">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Mid–Side: record M and S, decide the width later</text>
    <ellipse cx="110" cy="80" rx="34" ry="40" fill="var(--accent)" opacity=".3"/><text x="110" y="84" text-anchor="middle" font-size="12" font-weight="700">M</text>
    <ellipse cx="66" cy="120" rx="34" ry="20" fill="var(--c3)" opacity=".3"/><ellipse cx="154" cy="120" rx="34" ry="20" fill="var(--c3)" opacity=".18"/><text x="66" y="124" text-anchor="middle" font-size="11" font-weight="700">+S</text><text x="154" y="124" text-anchor="middle" font-size="11" font-weight="700">−S</text>
    <text x="110" y="166" text-anchor="middle" font-size="10" fill="var(--muted)">cardioid forward + figure-8 sideways</text>
    <path class="leak-pulse" d="M210 100 h60" stroke="var(--accent)" stroke-width="3"/>
    <rect x="280" y="52" width="170" height="96" rx="10" fill="var(--panel2)" stroke="var(--text)"/>
    <text x="365" y="80" text-anchor="middle" font-size="13" font-weight="700">L = M + S</text><text x="365" y="104" text-anchor="middle" font-size="13" font-weight="700">R = M − S</text><text x="365" y="130" text-anchor="middle" font-size="10" fill="var(--muted)">S fader = width control</text>
    <path class="leak-pulse" d="M460 100 h60" stroke="var(--accent)" stroke-width="3"/>
    <rect x="536" y="60" width="26" height="80" fill="var(--text)"/><rect x="640" y="60" width="26" height="80" fill="var(--text)"/><text x="549" y="158" text-anchor="middle" font-size="11">L</text><text x="653" y="158" text-anchor="middle" font-size="11">R</text>
    <circle class="hot" cx="601" cy="100" r="8" fill="var(--warn)"/><text x="601" y="182" text-anchor="middle" font-size="10" fill="var(--muted)">Mono (L + R) = 2M: the Side cancels completely</text>
  </svg>`;
  const SVG_31 = `<svg class="gsvg" viewBox="0 0 700 170" role="img" aria-label="The three to one rule">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">The 3 : 1 rule — keep neighbours at least three times further away</text>
    <circle cx="150" cy="110" r="22" fill="var(--accent)" opacity=".8"/><text x="150" y="114" text-anchor="middle" font-size="10" fill="#fff">source A</text>
    <circle cx="550" cy="110" r="22" fill="var(--c3)" opacity=".8"/><text x="550" y="114" text-anchor="middle" font-size="10" fill="#fff">source B</text>
    <rect x="144" y="54" width="12" height="24" rx="4" fill="var(--text)"/><rect x="544" y="54" width="12" height="24" rx="4" fill="var(--text)"/>
    <line x1="150" y1="80" x2="150" y2="88" stroke="var(--good)" stroke-width="3"/><text x="170" y="74" font-size="11" fill="var(--good)">d</text>
    <path d="M160 66 L540 100" stroke="var(--bad)" stroke-dasharray="5 4"/><text x="350" y="72" text-anchor="middle" font-size="11" fill="var(--bad)">≥ 3 × d → the bleed is about 10 dB lower</text>
    <g class="lock-wave"><circle cx="150" cy="110" r="26" fill="none" stroke="var(--accent)" stroke-width="2"/></g><g class="lock-wave d2"><circle cx="550" cy="110" r="26" fill="none" stroke="var(--c3)" stroke-width="2"/></g>
    <text x="350" y="158" text-anchor="middle" font-size="10" fill="var(--muted)">At 10 dB down the comb filtering between the two microphones is mild enough to ignore.</text>
  </svg>`;
  const SVG_KIT = `<svg class="gsvg" viewBox="0 0 700 250" role="img" aria-label="Drum kit microphone positions from above">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">A drum kit from above: where the microphones go</text>
    <circle cx="350" cy="170" r="48" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><text x="350" y="174" text-anchor="middle" font-size="10">kick</text>
    <circle cx="270" cy="120" r="30" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><text x="270" y="124" text-anchor="middle" font-size="10">snare</text>
    <circle cx="330" cy="92" r="24" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="386" cy="92" r="26" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <circle cx="440" cy="150" r="34" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><text x="440" y="154" text-anchor="middle" font-size="10">floor tom</text>
    <ellipse cx="212" cy="96" rx="30" ry="30" fill="none" stroke="var(--warn)" stroke-width="2"/><text x="212" y="100" text-anchor="middle" font-size="9">hat</text>
    <ellipse cx="260" cy="52" rx="40" ry="14" fill="none" stroke="var(--warn)" stroke-width="2"/><ellipse cx="456" cy="70" rx="46" ry="16" fill="none" stroke="var(--warn)" stroke-width="2"/>
    ${[[350, 200, 1], [262, 108, 2], [300, 40, 3], [420, 40, 3], [332, 80, 4], [448, 136, 4], [200, 84, 5], [560, 200, 6]].map(([x, y, n]) => `<circle class="hot" cx="${x}" cy="${y}" r="9" fill="var(--bad)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${n}</text>`).join('')}
    <text x="20" y="236" font-size="10">① kick · ② snare · ③ overhead pair (equal distance to the snare) · ④ toms · ⑤ hi-hat · ⑥ room mic(s) 2–4 m away</text>
  </svg>`;
  const SVG_LEVELS = `<svg class="gsvg" viewBox="0 0 700 180" role="img" aria-label="Recording level targets">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Where to set recording levels on a digital meter</text>
    <rect x="60" y="40" width="580" height="34" fill="var(--panel2)" stroke="var(--line)"/>
    <rect x="60" y="40" width="330" height="34" fill="var(--good)" opacity=".18"/><rect x="390" y="40" width="96" height="34" fill="var(--good)" opacity=".45"/><rect x="486" y="40" width="96" height="34" fill="var(--warn)" opacity=".35"/><rect x="582" y="40" width="58" height="34" fill="var(--bad)" opacity=".45"/>
    ${[[-60, 60], [-36, 292], [-24, 408], [-18, 466], [-12, 524], [-6, 582], [0, 640]].map(([d, x]) => `<line x1="${x}" y1="74" x2="${x}" y2="82" stroke="var(--muted)"/><text x="${x}" y="96" text-anchor="middle" font-size="10" fill="var(--muted)">${d}</text>`).join('')}
    <text x="438" y="62" text-anchor="middle" font-size="10" font-weight="700">average here</text><text x="534" y="62" text-anchor="middle" font-size="10" font-weight="700">peaks here</text><text x="611" y="62" text-anchor="middle" font-size="10" font-weight="700">spare</text>
    <text x="660" y="96" font-size="10" fill="var(--muted)">dBFS</text>
    <circle class="hot" cx="640" cy="57" r="6" fill="var(--bad)"/>
    <text x="350" y="130" text-anchor="middle" font-size="11">Average around −18 dBFS · loudest peaks between −12 and −6 dBFS · never touch 0</text>
    <text x="350" y="150" text-anchor="middle" font-size="10" fill="var(--muted)">At 24-bit the noise floor is more than 100 dB below full scale, so there is nothing to gain by recording hotter.</text>
  </svg>`;
  const SVG_CUE = `<svg class="gsvg" viewBox="0 0 700 170" role="img" aria-label="Cue mix signal flow">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">The cue (headphone) mix is a separate mix for the performer</text>
    ${[['Live mic', 30, 40], ['Backing tracks', 30, 104]].map(([t, x, y]) => `<rect x="${x}" y="${y}" width="120" height="40" rx="8" fill="var(--panel2)" stroke="var(--text)"/><text x="${x + 60}" y="${y + 25}" text-anchor="middle" font-size="11" font-weight="700">${t}</text>`).join('')}
    <rect x="250" y="56" width="150" height="72" rx="10" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/><text x="325" y="84" text-anchor="middle" font-size="12" font-weight="700">Cue send</text><text x="325" y="102" text-anchor="middle" font-size="10" fill="var(--muted)">pre-fader · own balance</text><text x="325" y="116" text-anchor="middle" font-size="10" fill="var(--muted)">“more me” + comfort reverb</text>
    <rect x="490" y="66" width="170" height="52" rx="10" fill="var(--panel2)" stroke="var(--text)"/><text x="575" y="90" text-anchor="middle" font-size="11" font-weight="700">Headphone amp</text><text x="575" y="106" text-anchor="middle" font-size="10" fill="var(--muted)">→ performer</text>
    <path class="leak-pulse" d="M150 60 L250 80 M150 124 L250 106 M400 92 H490" stroke="var(--accent)" stroke-width="3" fill="none"/>
    <text x="350" y="156" text-anchor="middle" font-size="10" fill="var(--muted)">Pre-fader sends mean you can change your own control-room mix without disturbing what the performer hears.</text>
  </svg>`;
  const SVG_DAW = `<svg class="gsvg" viewBox="0 0 700 200" role="img" aria-label="Anatomy of a DAW session">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Anatomy of a DAW session</text>
    ${['Drums', 'Bass', 'Guitars', 'Vocals'].map((t, i) => `<rect x="20" y="${34 + i * 30}" width="90" height="24" rx="4" fill="var(--panel2)" stroke="var(--text)"/><text x="65" y="${50 + i * 30}" text-anchor="middle" font-size="10" font-weight="700">${t}</text>${[0, 1, 2].map((k) => `<rect x="${124 + k * 96 + (i % 2) * 20}" y="${36 + i * 30}" width="${70 + ((i + k) % 3) * 8}" height="20" rx="3" fill="var(--${['accent', 'c3', 'accent2', 'good'][i]})" opacity=".55"/>`).join('')}`).join('')}
    <line class="pane-a" x1="260" y1="30" x2="260" y2="156" stroke="var(--bad)" stroke-width="2"/>
    <rect x="450" y="34" width="110" height="52" rx="8" fill="var(--panel2)" stroke="var(--text)"/><text x="505" y="56" text-anchor="middle" font-size="11" font-weight="700">Buses</text><text x="505" y="72" text-anchor="middle" font-size="9" fill="var(--muted)">groups · effects</text>
    <rect x="450" y="100" width="110" height="52" rx="8" fill="var(--panel2)" stroke="var(--text)"/><text x="505" y="122" text-anchor="middle" font-size="11" font-weight="700">Plug-ins</text><text x="505" y="138" text-anchor="middle" font-size="9" fill="var(--muted)">EQ · dynamics · reverb</text>
    <rect x="590" y="64" width="90" height="56" rx="8" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/><text x="635" y="88" text-anchor="middle" font-size="11" font-weight="700">Master</text><text x="635" y="104" text-anchor="middle" font-size="9" fill="var(--muted)">→ interface</text>
    <path class="leak-pulse" d="M420 80 H450 M420 126 H450 M560 60 L590 84 M560 126 L590 102" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
    <text x="230" y="184" text-anchor="middle" font-size="10" fill="var(--muted)">tracks hold clips on a timeline · the playhead reads them</text><text x="560" y="184" text-anchor="middle" font-size="10" fill="var(--muted)">signals are routed and summed like a console</text>
  </svg>`;
  const SVG_SYNC = `<svg class="gsvg" viewBox="0 0 700 150" role="img" aria-label="Timecode versus word clock">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Two different kinds of sync</text>
    <rect x="30" y="34" width="300" height="84" rx="10" fill="var(--panel2)" stroke="var(--line)"/><text x="180" y="56" text-anchor="middle" font-size="12" font-weight="700">Timecode — “WHERE are we?”</text>
    <text x="180" y="82" text-anchor="middle" font-size="18" font-weight="800" fill="var(--accent)" class="leak-pulse">01:02:17:08</text><text x="180" y="104" text-anchor="middle" font-size="10" fill="var(--muted)">hours : minutes : seconds : frames — position</text>
    <rect x="370" y="34" width="300" height="84" rx="10" fill="var(--panel2)" stroke="var(--line)"/><text x="520" y="56" text-anchor="middle" font-size="12" font-weight="700">Word clock — “HOW FAST?”</text>
    <path class="pane-a" d="M400 92 ${Array.from({ length: 12 }, (_, i) => `v${i % 2 ? 18 : -18} h20`).join(' ')}" fill="none" stroke="var(--c3)" stroke-width="2.5"/><text x="520" y="110" text-anchor="middle" font-size="10" fill="var(--muted)">one tick per sample — speed</text>
    <text x="350" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">Machines need both: timecode to line up, a shared clock to stay lined up without drifting or clicking.</text>
  </svg>`;

  /* ================================ R1 ================================== */
  const R1 = {
    id: 'r-mics', n: 'R1', track: 'recording', title: 'Microphones in Practice: Types, Patterns and Choosing the Right One', level: 'Foundation', mins: 40,
    summary: 'How the main microphone types work, what their pickup patterns reject, which specifications matter, and how to choose and place a microphone for the job in front of you.',
    tags: ['microphone', 'dynamic', 'condenser', 'ribbon', 'polar pattern', 'proximity effect', 'phantom power', 'preamp', 'self-noise'],
    sections: [
      { h: 'The whole chain in one picture', html: `
        <p class="lead">A microphone does not “capture the instrument”. It captures the air at one point in a room. What you get depends on five links — and the first two matter most.</p>
        ${SVG_CHAIN}
        ${flow([['Fix the source', 'tuning, strings, performance'], ['Find the spot', 'where it sounds right'], ['Pick the pattern', 'what to hear, what to reject'], ['Pick the type', 'tone and toughness'], ['Set the gain', 'clean, with headroom']])}` },
      { h: 'How the three main types work', html: `
        ${SVG_MICTYPES}
        ${T(['Type', 'How it works', 'Sounds like', 'Use it for', 'Watch out'], [
          ['Dynamic (moving coil)', 'A coil glued to the diaphragm moves in a magnet and generates current', 'Solid, slightly rounded highs', 'Drums, guitar amps, loud vocals, live stages', 'Low output: quiet sources need a quiet, high-gain preamp'],
          ['Large-diaphragm condenser', 'A very thin charged membrane next to a back-plate; needs 48 V', 'Detailed, flattering, big', 'Vocals, acoustic instruments, room', 'Picks up everything — including the room and the fridge'],
          ['Small-diaphragm condenser', 'Same principle, smaller capsule', 'Accurate, fast transients, even off-axis', 'Acoustic guitar, overheads, piano, stereo pairs', 'Less “larger than life” on voices'],
          ['Tube / transformer condenser', 'Valve or transformer in the output stage', 'Thicker, smoother when pushed', 'Vocals, sources that sound thin', 'Needs its own power supply and warm-up'],
          ['Ribbon', 'A corrugated foil strip in a magnetic gap; naturally figure-8', 'Smooth top, natural mids', 'Brass, guitar cabs, strings, harsh sources', 'Fragile: wind, plosives and (on old passive types) phantom power can damage it'],
          ['Boundary', 'A capsule mounted flush on a plate lying on a surface', 'Even, open, no comb filtering from that surface', 'Piano lid, stage floor, conference tables, room', 'Needs a large surface under it for bass'],
        ])}
        <p>The electrical side — sensitivity, impedance, balanced lines — is covered in <a href="#/academy/a-transducers">Transducers</a>. Here we concentrate on choosing and using.</p>` },
      { h: 'Pickup patterns: choosing what NOT to hear', html: `
        <p>A pattern is less about where the mic listens than about where it is deaf. Aim the <b>null</b> at whatever you want to reject.</p>
        ${T(['Pattern', 'Hears', 'Deaf at', 'Proximity bass boost', 'Typical use'], [
          ['Omnidirectional', 'All round', 'Nowhere', 'None', 'Natural tone, good rooms, close work without boom'],
          ['Cardioid', 'Front', 'Directly behind (180°)', 'Moderate', 'The default: one source, some rejection'],
          ['Supercardioid / hypercardioid', 'Tighter front, small rear lobe', '≈ 125° / 110° off the back', 'Stronger', 'Stages, tight drum kits; put wedges at the null angle, not straight behind'],
          ['Figure-8', 'Front and back equally', 'Both sides (90°)', 'Strongest', 'Deep side nulls: two singers face to face, rejecting a neighbour beside the mic'],
        ])}`, viz: 'micPatterns' },
      { h: 'Distance: the most powerful control you have', html: `
        <p>Moving a microphone changes three things at once: the balance of direct sound to room, the amount of bass (proximity effect on directional mics), and how much of the neighbours leaks in.</p>
        <div class="callout data"><b>Rules of thumb.</b> Halve the distance → the source gets 6 dB louder against the room. Directional mics boost bass strongly inside about 15 cm. Beyond the room’s critical distance, moving further changes little — you are recording the room.</div>`, viz: 'micDistance' },
      { h: 'The specifications that actually matter', html: `
        ${T(['Specification', 'What it tells you', 'Good to know'], [
          ['Sensitivity (mV/Pa)', 'How much signal for a given sound level', 'Dynamics ≈ 1–3, ribbons ≈ 1–5 (active types more), condensers ≈ 8–40 mV/Pa'],
          ['Self-noise (dBA)', 'The hiss the mic makes with no sound', 'Under ≈ 15 dBA is quiet enough for soft sources; under 10 is excellent'],
          ['Maximum SPL', 'Level at which distortion reaches a stated amount', 'Close drums and brass exceed 130 dB: use the pad or a dynamic'],
          ['Frequency response', 'Tone on axis', 'A “presence lift” flatters vocals but can make cymbals harsh'],
          ['Off-axis response', 'Tone of everything arriving from the side', 'Decides how good the bleed sounds — often more important than the on-axis curve'],
          ['Output impedance', 'What it expects to drive', 'Low (≈ 150–200 Ω) into a preamp input of ≥ 1.5 kΩ'],
        ])}
        <div class="callout mentor">Bleed is never absent, only good or bad. A mic with smooth off-axis response makes leakage sound like a natural room; a mic with a ragged one makes it sound phasey.</div>` },
      { h: 'Switches, power and preamps', html: `
        ${T(['Control', 'What it does', 'Use it when'], [
          ['Phantom power (+48 V)', 'Powers condensers and active ribbons/DI boxes down the mic cable', 'Condensers always. Harmless to modern dynamics on balanced cables; switch it off before patching, and keep it off vintage passive ribbons'],
          ['Pad (−10 / −20 dB)', 'Reduces level before the mic’s own electronics', 'Loud close sources that distort even with the preamp gain at minimum'],
          ['High-pass (low-cut) filter', 'Removes rumble and proximity boom', 'Vocals, guitars, anything that is not a bass instrument'],
          ['Pattern switch', 'Changes the pickup pattern', 'Try omni on a boomy close vocal; figure-8 to null a neighbour'],
          ['Polarity (Ø) on the preamp', 'Inverts the signal', 'Second mic on the same source — choose the setting with more bass'],
        ])}
        <p>A preamp’s job is clean gain. Set it so the loudest passage peaks around −12 to −6 dBFS (see <a href="#/academy/r-session">Running a Session</a>). Quiet sources on dynamic or ribbon mics need 60 dB or more of gain: that is where preamp noise shows.</p>
        <div class="callout safety">Mute the channel and turn monitors down before switching phantom power or plugging and unplugging microphones: the thump can damage speakers, headphones — and ears.</div>` },
      { h: 'Accessories that earn their place', html: `
        <div class="uc-grid">
          ${uc('🫧', 'Pop filter', [['Does', 'Stops blasts of air from P and B sounds'], ['Do', 'Mount it 5–10 cm from the mic; it doubles as a distance marker for the singer']])}
          ${uc('🕸️', 'Shock mount', [['Does', 'Stops stand and floor rumble reaching the capsule'], ['Do', 'Use for condensers on wooden floors; dress the cable in a loose loop']], '#7a5cc7')}
          ${uc('🧱', 'Solid stands and sandbags', [['Does', 'Keeps a carefully found position where you found it'], ['Do', 'Boom arm over a leg of the tripod; weight tall stands']], '#c7772b')}
          ${uc('🎚️', 'DI box', [['Does', 'Turns an instrument’s high-impedance signal into a balanced mic-level one'], ['Do', 'Record a DI track of bass and electric guitar alongside the amp']], '#2b9fc7')}
          ${uc('💨', 'Windshield', [['Does', 'Reduces wind and breath noise'], ['Do', 'Outdoors and for close speech; foam alone is not enough in real wind']], '#4c9a3a')}
        </div>` },
      { h: 'Choosing by source', html: `
        ${T(['Source', 'Good first choice', 'Why', 'If it sounds wrong'], [
          ['Lead vocal (studio)', 'Large-diaphragm condenser, cardioid', 'Detail and presence', 'Harsh → ribbon or dynamic; boomy → back off or omni'],
          ['Loud rock vocal / live', 'Dynamic, cardioid or super', 'Handles level, rejects stage', 'Dull → condenser with pad'],
          ['Podcast / voice in an untreated room', 'Dynamic, close', 'Low sensitivity ignores the room', 'Thin → move closer (proximity)'],
          ['Acoustic guitar', 'Small-diaphragm condenser', 'Fast and even', 'Boomy → move toward the neck'],
          ['Guitar amp', 'Dynamic at the grille', 'Takes the level, focused mids', 'Fizzy → move toward the cone edge; add a ribbon'],
          ['Kick / bass amp', 'Large-diaphragm dynamic', 'Low-frequency headroom', 'No attack → closer to the beater'],
          ['Overheads / cymbals', 'Small or large condensers', 'Transients and air', 'Harsh → ribbons or raise them'],
          ['Brass, strings', 'Ribbon or condenser at a distance', 'Smooth top', 'Scratchy → further away'],
        ])}
        <p>Interactive starting positions for each source are in <a href="#/academy/r-instruments">Miking Instruments</a>.</p>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎙️', 'Bedroom vocal with a noisy computer', [['Problem', 'Fan noise and room echo on a condenser'], ['Do', 'Cardioid with its back to the computer, 15 cm from the mouth, duvet behind the singer; or switch to a dynamic'], ['Result', 'Noise and room drop by 10 dB or more']])}
          ${uc('🎸', 'Singer-guitarist, one take', [['Problem', 'Voice and guitar bleed into each other’s mics'], ['Do', 'Two figure-8 mics: each one’s side null aimed at the other source'], ['Result', 'Useful separation without separating the performer']], '#c7772b')}
          ${uc('🥁', 'Snare drowned by hi-hat', [['Problem', 'Hat louder than snare in the snare mic'], ['Do', 'Supercardioid with its null toward the hat; mic coming in from under the hat'], ['Result', 'Hat drops, snare stays']], '#7a5cc7')}
          ${uc('🎻', 'String quartet in a nice hall', [['Problem', 'Close mics sound scratchy'], ['Do', 'A stereo pair 2–3 m back and above; omnis if the hall is good'], ['Result', 'Natural blend and space']], '#2b9fc7')}
        </div>` },
      { h: 'Myths, problems and care', html: `
        ${myth([
          ['“An expensive microphone fixes a bad room.”', 'A more sensitive, more detailed microphone records more of the bad room. Treat the room or get closer.'],
          ['“Condensers are for studios, dynamics for stage.”', 'Many classic studio vocal and drum sounds are dynamics; choose by sound and by what must be rejected.'],
          ['“Phantom power destroys dynamic microphones.”', 'Not on a correctly wired balanced cable. The risk is faulty cables, patchbays and vintage passive ribbons.'],
          ['“Point the mic at the instrument.”', 'Point it at the sound you want — and point its null at the sound you do not.'],
        ])}
        ${T(['Problem', 'Likely cause', 'Solution'], [
          ['Boomy, muddy close sound', 'Proximity effect', 'Back off, high-pass, or omni'],
          ['Thin, distant, roomy', 'Too far for this room', 'Move in; tighter pattern; absorb behind the performer'],
          ['Harsh sibilance', 'Presence peak on axis', 'Angle the mic 20–30° off the mouth; raise it; try a darker mic'],
          ['Distortion on loud notes', 'Mic electronics or preamp overloading', 'Engage the pad, lower the gain, or move back'],
          ['Hum or buzz', 'Cable, grounding or a nearby power supply', 'Swap the cable; see <a href="#/academy/a-ground">Hum, Buzz & Grounding</a>'],
          ['Pops on P and B', 'Air blast hitting the capsule', 'Pop filter; mic above or beside the mouth line'],
        ])}
        <p><b>Care:</b> store condensers and ribbons dry and covered; never blow into a microphone; carry ribbons upright; keep capsules away from smoke and dust.</p>` },
    ],
    quiz: [
      { q: 'Which microphone pattern has its deepest rejection at the sides (90°)?', opts: ['Omni', 'Cardioid', 'Figure-8', 'Supercardioid'], a: 2, why: 'A figure-8 hears front and back and is deaf at both sides.' },
      { q: 'You halve the distance from mic to singer. Against the room sound, the voice becomes…', opts: ['3 dB louder', '6 dB louder', 'unchanged', 'quieter'], a: 1, why: 'Direct sound follows the inverse-square law; the room level stays roughly constant.' },
      { q: 'A close cardioid vocal sounds boomy. Which is NOT a sensible fix?', opts: ['Move back a little', 'Switch on the high-pass filter', 'Switch to omni', 'Turn on the pad'], a: 3, why: 'The pad lowers level, not bass. The boom is proximity effect.' },
      { q: 'What matters most for how good the leakage from other instruments sounds?', opts: ['Self-noise', 'Off-axis frequency response', 'Maximum SPL', 'Output impedance'], a: 1, why: 'Bleed arrives off-axis; a smooth off-axis response makes it sound natural.' },
      { q: 'Best first choice for speech in an untreated, echoey room?', opts: ['Large condenser at 50 cm', 'Dynamic, close to the mouth', 'Omni condenser at 1 m', 'Boundary mic on the far wall'], a: 1, why: 'Close and low-sensitivity: the voice dominates the room.' },
    ],
  };

  /* ================================ R2 ================================== */
  const R2 = {
    id: 'r-stereo', n: 'R2', track: 'recording', title: 'Stereo and Surround Microphone Techniques', level: 'Core', mins: 40,
    summary: 'How two microphones create a picture between two loudspeakers — coincident, near-coincident and spaced pairs, Mid–Side, when to use which, and how to stay mono-compatible.',
    tags: ['stereo', 'XY', 'ORTF', 'AB', 'Blumlein', 'mid-side', 'Decca tree', 'stereo recording angle', 'mono compatibility', 'surround'],
    sections: [
      { h: 'How a stereo image is made', html: `
        <p class="lead">Your brain places a sound between two loudspeakers using two clues: which speaker is <b>louder</b> and which is <b>earlier</b>. Every stereo microphone technique is a way of turning the position of a source into level differences, time differences, or both.</p>
        <div class="callout data"><b>Rules of thumb.</b> About 15–18 dB of level difference, or about 1–1.5 ms of time difference, puts a sound fully in one speaker. Half of that puts it halfway. The two clues add together.</div>
        ${SVG_PAIRS}` },
      { h: 'Try the techniques', html: `
        <p>Choose a technique, then change the angle and spacing. Watch the shaded <b>stereo recording angle</b>: sources inside it spread from speaker to speaker; anything outside is squashed to one side.</p>`, viz: 'stereoMic' },
      { h: 'Coincident pairs: level differences only', html: `
        ${T(['Technique', 'Set-up', 'Sound', 'Use for'], [
          ['XY', 'Two cardioids, capsules touching, 90–135° apart', 'Sharp, stable centre, modest width, perfect in mono', 'Drum overheads, acoustic guitar, anything that must survive mono'],
          ['Blumlein', 'Two figure-8s at 90°', 'Very natural image and room', 'Small ensembles in good rooms; keep the group within the front 90°'],
          ['Mid–Side (MS)', 'Cardioid (or omni) forward + figure-8 sideways', 'Adjustable width after the event, perfect in mono', 'Broadcast, film, solo instruments, room mics'],
        ])}
        ${SVG_MS}
        <div class="formula"><span class="lbl">MS decoding</span>L = M + S &nbsp;·&nbsp; R = M − S &nbsp;·&nbsp; mono = L + R = 2M</div>
        <p><b>Doing it on a mixer:</b> put M on one channel panned centre. Copy S to two channels, pan them hard left and right, and flip the polarity of the right one. The S faders (moved together) are your width control.</p>` },
      { h: 'Near-coincident pairs: a little of both', html: `
        ${T(['Technique', 'Angle', 'Spacing', 'Stereo recording angle', 'Character'], [
          ['ORTF', '110°', '17 cm', '≈ 95–100°', 'Open and wide, good localisation'],
          ['NOS', '90°', '30 cm', '≈ 80°', 'Slightly narrower pickup, more “spacious”'],
          ['DIN', '90°', '20 cm', '≈ 100°', 'A little tighter than ORTF'],
        ])}
        <p>These are the everyday choices for ensembles, choirs, pianos and audiences: more open than XY, far more mono-safe than widely spaced omnis.</p>
        <div class="callout mentor">Set the pair’s distance so the whole ensemble just fits inside the recording angle. Too close and the edges jump to the speakers; too far and everything huddles in the middle.</div>` },
      { h: 'Spaced pairs and trees: time differences', html: `
        ${T(['Technique', 'Set-up', 'Sound', 'Watch out'], [
          ['AB', 'Two omnis 40–60 cm apart (up to several metres for width)', 'Spacious, airy, real low bass from true omnis', 'Vague centre if too wide; combing in mono'],
          ['AB + centre', 'Third mic in the middle, panned centre', 'Fills the “hole in the middle”', 'Blend the centre low at first'],
          ['Decca tree', 'Three omnis in a T: left and right ≈ 2 m apart, centre ≈ 1–1.5 m forward', 'The classic orchestral film sound', 'Needs height (≈ 3 m) and a fine room'],
          ['Outriggers / spots', 'Extra mics at the flanks or on sections', 'Width and detail', 'Delay or keep them low to protect the main image'],
        ])}` },
      { h: 'Baffled and binaural', html: `
        <p>Put something between two omnis — a disc, a sphere, a dummy head — and the obstacle creates level differences at high frequencies, like your own head. A <b>dummy head</b> (binaural) recording is astonishing on headphones and odd on loudspeakers; a <b>sphere or disc</b> pair is a compromise that works on both.</p>` },
      { h: 'Which technique when?', html: `
        ${T(['Job', 'Start with', 'Why'], [
          ['Drum overheads', 'XY or ORTF; spaced pair for width', 'Phase with close mics; measure equal distance to the snare'],
          ['Acoustic guitar / solo instrument', 'XY, MS or a single mic + room', 'Small source: a wide pair exaggerates movement'],
          ['Grand piano', 'ORTF or a spaced pair inside, or AB outside', 'Wide instrument; check mono'],
          ['Choir / chamber ensemble', 'ORTF or NOS 2–4 m back, above head height', 'Balance blend and clarity by distance'],
          ['Orchestra in a hall', 'Decca tree or AB omnis + outriggers', 'Size and bass; room is part of the sound'],
          ['Room / ambience mics', 'Spaced omnis or Blumlein, facing away', 'Decorrelated, spacious'],
          ['Location / film / broadcast', 'MS', 'Width adjustable, mono-safe'],
          ['Audience', 'Spaced pair or two pairs', 'Wide and enveloping'],
        ])}` },
      { h: 'Mono compatibility — and how to check it', html: `
        <p>When left and right are added, time differences turn into comb filtering. Coincident and MS pairs have none; near-coincident pairs have mild combing high up; widely spaced pairs can lose obvious chunks of the midrange.</p>
        <ol><li>Press the mono button (or pan both channels to the centre) and listen for a hollow, phasey tone or a level drop.</li><li>Watch a correlation meter: it should sit mostly on the positive side.</li><li>If mono matters (broadcast, phones, club systems), prefer XY, MS or near-coincident pairs.</li></ol>` },
      { h: 'Surround and immersive arrays in brief', html: `
        ${T(['Approach', 'Idea', 'Good for'], [
          ['Front array + rear ambience pair', 'A stereo or three-mic front array plus two spaced mics facing the hall', 'Concerts'],
          ['Spaced five-mic arrays', 'Five cardioids or omnis spaced tens of centimetres apart on a frame', 'Enveloping orchestral and ambience capture'],
          ['Double MS', 'A front M, a rear M and one shared S', 'Compact location surround'],
          ['First-order ambisonic (four-capsule) mic', 'Four capsules in a tetrahedron, decoded later to any layout', 'VR, flexible post-production'],
          ['Height layer', 'Extra mics 1–2 m above the main array, aimed up or away', 'Immersive formats'],
        ])}
        <p>Speaker layouts and room requirements for surround are in <a href="#/academy/m-control">Control Rooms</a>.</p>` },
      { h: 'Use cases, mistakes and a checklist', html: `
        <div class="uc-grid">
          ${uc('🎹', 'Home piano recording', [['Set-up', 'ORTF pair 1.5 m from the open lid at lid height'], ['Result', 'Natural width; closer for pop, further for classical']])}
          ${uc('🎤', 'Choir in a church', [['Set-up', 'ORTF on a tall stand 3 m back, 3 m high; omni pair further back for the acoustic'], ['Result', 'Clarity from the main pair, bloom from the omnis']], '#7a5cc7')}
          ${uc('🎬', 'Documentary ambience', [['Set-up', 'MS in a windshield'], ['Result', 'Mono-safe for TV, wide for cinema']], '#c7772b')}
          ${uc('🥁', 'Drum kit, two mics only', [['Set-up', 'XY above the drummer’s head aimed at snare and kick'], ['Result', 'The kit as the drummer hears it, no phase trouble']], '#2b9fc7')}
        </div>
        ${T(['Mistake', 'What you hear', 'Fix'], [
          ['Spaced pair too wide', 'Hole in the middle', 'Narrow it or add a centre mic'],
          ['Pair too close to a wide group', 'Edges stuck in the speakers', 'Move back or reduce the angle'],
          ['Mismatched mics or gains', 'Image leans to one side', 'Matched pair; set gains with a tone or a clap on the centre line'],
          ['MS side mic pointing the wrong way', 'Left and right swapped', 'Positive lobe of the figure-8 to the left'],
          ['Never checking mono', 'Thin, phasey on phones and radio', 'Mono button, every time'],
        ])}` },
    ],
    quiz: [
      { q: 'An XY pair creates its stereo image from…', opts: ['Time differences only', 'Level differences only', 'Both equally', 'Reverberation'], a: 1, why: 'The capsules are at the same point, so there is no time difference.' },
      { q: 'In Mid–Side, what is the left channel?', opts: ['M − S', 'M + S', 'S only', 'M only'], a: 1, why: 'L = M + S, R = M − S.' },
      { q: 'What happens to the Side signal when an MS recording is played in mono?', opts: ['It doubles', 'It cancels completely', 'It moves to the centre', 'It distorts'], a: 1, why: 'L + R = 2M: +S and −S cancel.' },
      { q: 'A widely spaced AB pair summed to mono will most likely…', opts: ['sound identical', 'show comb filtering', 'get wider', 'lose all bass'], a: 1, why: 'Time differences between the channels become cancellations when summed.' },
      { q: 'ORTF is…', opts: ['Two omnis 3 m apart', 'Two cardioids at 110°, 17 cm apart', 'Two figure-8s at 90°', 'One cardioid and one figure-8'], a: 1, why: 'A near-coincident pair mixing level and time cues.' },
    ],
  };

  /* ================================ R3 ================================== */
  const R3 = {
    id: 'r-instruments', n: 'R3', track: 'recording', title: 'Miking Instruments: Drums, Bass, Guitars, Piano, Voice and More', level: 'Core', mins: 50,
    summary: 'A repeatable method for finding microphone positions, the 3:1 rule, phase and polarity between microphones, and practical starting points for the instruments you will meet most.',
    tags: ['mic placement', 'drums', 'guitar', 'piano', 'vocals', '3:1 rule', 'phase', 'polarity', 'leakage', 'DI'],
    sections: [
      { h: 'The method before the recipes', html: `
        <p class="lead">Positions in books are starting points. The method is what always works.</p>
        ${flow([['Fix the source', 'tune it, new strings/heads, right part'], ['Listen in the room', 'walk round while they play'], ['Find the spot', 'put one ear where the mic will go'], ['Place and aim', 'distance = room · angle = tone'], ['Listen in the control room', 'change one thing at a time'], ['Check with the others', 'polarity and bleed']])}
        <div class="callout data"><b>What moving does.</b> Closer: more direct, more bass (directional mics), more detail and mechanical noise. Further: more room, more of the whole instrument, smoother. On-axis: brighter. Off-axis: darker. A few centimetres matter.</div>
        <div class="callout safety">Close to drums, brass and guitar cabinets the level can exceed 110–130 dB. Wear hearing protection while positioning, and have the player stop when your head is next to the source.</div>` },
      { h: 'Starting points, instrument by instrument', html: `
        <p>Pick a source to see where the microphones usually start, which type to reach for, and what moving them does.</p>`, viz: 'instrumentMics' },
      { h: 'The 3:1 rule and leakage', html: `
        ${SVG_31}
        <p>When two microphones on different sources are mixed, each also contains a delayed, quieter copy of the other source. If the copy is at least about 10 dB down, the comb filtering is mild. Keeping every other source three times further from a mic than its own source achieves that.</p>
        <div class="uc-grid">
          ${uc('🤝', 'Leakage as a friend', [['When', 'A band playing together in a good room'], ['Do', 'Arrange players so bleed arrives off the back of each mic and sounds good; commit to the performance']])}
          ${uc('🚧', 'Leakage as an enemy', [['When', 'You need to replace or heavily process individual parts'], ['Do', 'Gobos, booths, DI for bass and keys, amps in another room, tight patterns, closer mics']], '#b33')}
        </div>
        <p>Rooms and booths for separation: <a href="#/academy/m-tracking">Tracking Rooms</a> · <a href="#/academy/m-music-booths">Music Booths</a>.</p>` },
      { h: 'Two mics, one source: polarity and time', html: `
        <p>Two microphones at different distances from the same source hear it at different times. Mixed together, some frequencies add and some cancel. Two tools fix it: the <b>polarity</b> (Ø) button and <b>time alignment</b>.</p>
        ${T(['Pair', 'Typical problem', 'First move'], [
          ['Snare top + bottom', 'Mics face opposite sides of the head: bass cancels', 'Flip polarity on the bottom mic'],
          ['Kick inside + outside', '≈ 1–2 ms apart: hollow low mids', 'Flip polarity and compare; then try sliding the inside track later'],
          ['Bass DI + amp mic', 'Amp arrives ≈ 1 ms late', 'Delay the DI to match the mic'],
          ['Two mics on a guitar cab', 'Different distance from the cone', 'Line up the capsules by eye, then fine-tune by ear for the fullest tone'],
          ['Overheads + close mics', 'Overheads are ≈ 3 ms later', 'Check polarity of each close mic against the overheads; alignment optional'],
        ])}`, viz: 'multiMicPhase' },
      { h: 'Drum kit: from two mics to twelve', html: `
        ${SVG_KIT}
        ${T(['Set-up', 'Microphones', 'Sound'], [
          ['One mic', 'Condenser or ribbon 1–1.5 m in front at chest height', 'Honest, vintage, mono'],
          ['Two mics', 'Kick + one overhead above the snare', 'Punch plus picture'],
          ['Three mics', 'Kick + overhead above the snare + one over the floor-tom shoulder, both the same distance from the snare', 'Wide, phase-coherent, classic rock'],
          ['Four mics', 'Kick, snare, overhead pair', 'The practical minimum for modern control'],
          ['Full kit', 'Kick in/out, snare top/bottom, hat, each tom, overhead pair, room pair', 'Maximum control — and maximum phase checking'],
        ])}
        <p><b>Before any microphone:</b> fresh or well-seated heads, tuned so the drums do not fight each other; a little damping only where a ring is ugly; no squeaky pedals; cymbals chosen for the room. A well-prepared kit records itself.</p>
        <div class="callout mentor">Build the drum sound from the overheads outward: get the whole kit sounding right in the overheads, then add close mics for weight. If a close mic makes the kit smaller, flip its polarity.</div>` },
      { h: 'Bass and guitars', html: `
        ${T(['Source', 'Approach', 'Notes'], [
          ['Electric bass', 'DI always; amp mic if the amp sound matters', 'Blend after aligning; high-pass the amp mic if it adds mud'],
          ['Upright bass', 'Condenser or ribbon 30–50 cm in front of the bridge/f-hole, plus pickup if available', 'Aim higher for finger articulation, lower for body'],
          ['Electric guitar', 'Dynamic at the grille between cone centre and edge; optional ribbon or condenser further back', 'Centre = bright; edge = dark; angle the mic to soften'],
          ['Acoustic guitar', 'Small condenser at the 12th–14th fret, 20–30 cm', 'Never straight at the sound hole; a second mic at the bridge adds body'],
          ['Banjo, mandolin, ukulele', 'Small condenser 20–30 cm, off the centre of the head/sound hole', 'Bright instruments: try a ribbon'],
        ])}` },
      { h: 'Piano, voice, strings, wind and percussion', html: `
        ${T(['Source', 'Approach', 'Notes'], [
          ['Grand piano', 'Pair over the hammers (pop) or at the curve 1–2 m away (classical)', 'Lid fully open; check mono; boundary mics on the lid work well'],
          ['Upright piano', 'Open the top or remove the front panel; pair above or facing the soundboard at the back', 'Pedal and mechanical noises get louder close up'],
          ['Lead vocal', 'Large condenser 15–25 cm, pop filter, slightly above the mouth', 'See <a href="#/academy/m-vo-booths">Voice-over Booths</a> for the room'],
          ['Backing vocals / group', 'One or two mics, singers in a semicircle, balance by stepping in or out', 'Omni if the room is good'],
          ['Violin, viola', '0.5–1 m above, ribbon or condenser', 'Distance tames the bow'],
          ['Cello', '40–60 cm in front of the bridge', ''],
          ['String section', 'Stereo pair above + spot mics kept low', ''],
          ['Trumpet, trombone', '30–60 cm, slightly off the bell axis', 'Ribbons smooth the edge; watch the level'],
          ['Saxophone', '30–50 cm, aimed between bell and keys', ''],
          ['Flute', 'Above the player, between mouthpiece and fingers, 30–50 cm', 'Avoid the breath stream'],
          ['Clarinet, oboe', 'Aimed at the lower keys, 30–50 cm', 'Not at the bell — only the lowest notes come from there'],
          ['Congas, bongos, djembe', 'Dynamic or condenser 10–20 cm above, between the drums', 'Second mic at the bottom of a djembe for bass'],
          ['Shaker, tambourine', '0.5–1 m away with a condenser or ribbon', 'Too close clips and sounds harsh'],
        ])}` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🥁', 'Drums in a small, low room', [['Problem', 'Overheads sound boxy and washy'], ['Do', 'Lower XY overheads, absorption above the kit, rely more on close mics; add artificial room later'], ['Result', 'Tight and controlled']])}
          ${uc('🎸', 'Guitar cab too fizzy', [['Problem', 'Harsh top end'], ['Do', 'Move the mic 2–3 cm toward the cone edge, turn the amp’s gain down, add a ribbon'], ['Result', 'Fuller, smoother']], '#c7772b')}
          ${uc('🎤', 'Singer and acoustic guitar together', [['Problem', 'Bleed makes later fixes impossible'], ['Do', 'Figure-8 on each, nulls aimed at the other source'], ['Result', 'Performance kept, separation gained']], '#7a5cc7')}
          ${uc('🎻', 'Fiddle sounds scratchy', [['Problem', 'Mic too close and on axis'], ['Do', 'Ribbon 60–80 cm above, off to the side'], ['Result', 'Warm and natural']], '#2b9fc7')}
          ${uc('🎹', 'Piano and singer in one room', [['Problem', 'Piano floods the vocal mic'], ['Do', 'Short stick on the lid, mics inside, vocal mic’s null at the piano, blanket over the lid opening'], ['Result', 'Workable balance']], '#4c9a3a')}
        </div>` },
      { h: 'Problems, mistakes and a checklist', html: `
        ${T(['Problem', 'Likely cause', 'Solution'], [
          ['Kick has no low end with both mics up', 'Polarity', 'Flip one; pick the fuller setting'],
          ['Snare sounds thin', 'Top/bottom cancelling or mic too close to the rim', 'Polarity on the bottom; aim at the centre'],
          ['Cymbals harsh in everything', 'Tom/snare mics facing cymbals; bright condensers', 'Re-aim nulls; ribbons or higher overheads; ask for lighter cymbal playing'],
          ['Acoustic guitar boomy', 'Sound hole / proximity', 'Move toward the 12th fret; back off'],
          ['Vocal level all over the place', 'Singer moving', 'Mark the distance; back off the mic a little; ride the level later'],
          ['Sound changes when the stereo pair is collapsed', 'Spaced pair combing', 'Narrow the pair or use a coincident technique'],
        ])}
        <ul><li>Source prepared and in tune? &nbsp;·&nbsp; One mic position found by ear before adding more?</li><li>Every extra mic checked for polarity against the first?</li><li>3:1 respected or bleed deliberately chosen?</li><li>Stands tight, cables dressed, positions photographed and noted?</li></ul>` },
    ],
    quiz: [
      { q: 'The 3:1 rule says a neighbouring source should be…', opts: ['3 dB quieter', 'at least three times as far from a mic as that mic’s own source', '3 m away', 'recorded three times'], a: 1, why: 'That keeps its leakage about 10 dB down, so combing is mild.' },
      { q: 'With top and bottom snare mics, the usual first move is to…', opts: ['EQ the bottom mic', 'Flip the polarity of the bottom mic', 'Delay the top mic by 10 ms', 'Mute the top mic'], a: 1, why: 'They see the head moving in opposite directions.' },
      { q: 'Moving a guitar-cab mic from the cone centre toward the edge makes the sound…', opts: ['brighter', 'darker and fuller', 'louder', 'more distorted'], a: 1, why: 'High frequencies beam from the centre of the cone.' },
      { q: 'Where should a single acoustic-guitar mic usually start?', opts: ['In the sound hole', '20–30 cm from the 12th–14th fret', 'Behind the player', 'At the tuning pegs'], a: 1, why: 'Balanced body and strings without sound-hole boom.' },
      { q: 'For equal snare level and phase in a spaced overhead pair you should…', opts: ['use different mics', 'make both mics the same distance from the snare', 'point both at the kick', 'place one twice as high'], a: 1, why: 'Equal distance means the snare arrives together and stays centred.' },
    ],
  };

  /* ================================ R4 ================================== */
  const R4 = {
    id: 'r-session', n: 'R4', track: 'recording', title: 'Running a Recording Session: Preparation, Levels, Cue Mixes and Checklists', level: 'Core', mins: 45,
    summary: 'What to prepare before anyone plays a note, how to set levels with headroom, how to build headphone mixes people can perform to, and how to keep a session organised and safe.',
    tags: ['session', 'gain staging', 'headroom', 'cue mix', 'click track', 'overdubs', 'documentation', 'backup', 'checklist'],
    sections: [
      { h: 'A session in one line', html: `
        <p class="lead">The engineer’s real job is to make it easy for people to perform. Most of that is preparation and calm; the microphones are the small part.</p>
        ${flow([['Plan', 'songs, line-up, inputs, time'], ['Set up', 'room, mics, lines, headphones'], ['Line check', 'every input, level, polarity'], ['Cue mixes', 'everyone hears what they need'], ['Record', 'takes, notes, markers'], ['Review', 'comps, overdubs'], ['Save & back up', 'two copies before anyone leaves']])}` },
      { h: 'Before the session', html: `
        ${T(['Prepare', 'Details'], [
          ['The music', 'Tempos, keys, arrangements, song order; demos or guide tracks; who plays what, when'],
          ['Input list', 'One line per source: instrument → mic/DI → stand → input number → track name'],
          ['Floor plan', 'Where each player sits, sight lines, gobos, which amps go in which room'],
          ['Template session', 'Tracks named, routed and colour-coded; cue sends, talkback, click and a reverb ready'],
          ['Instruments', 'New strings and heads fitted a day early, tuned; spare strings, sticks, batteries, cables'],
          ['Time plan', 'Set-up and sounds take longer than anyone expects: allow 1–3 hours for a band'],
        ])}
        <div class="callout mentor">Have a microphone open and recording from the moment musicians arrive. The run-through “while you get levels” is often the take.</div>` },
      { h: 'Gain staging and headroom', html: `
        ${SVG_LEVELS}
        <p>Digital has a hard ceiling. Above 0 dBFS the waveform is chopped flat and no tool can restore it. Below it, a 24-bit recording stays clean for more than 100 dB. So aim low:</p>
        <ul><li>Set the preamp during the <b>loudest</b> part of the song.</li><li>Average level near −18 dBFS; peaks between −12 and −6 dBFS.</li><li>That average equals the “0” on analogue-style meters and is where most processors are designed to work.</li></ul>`, viz: 'levelMeter' },
      { h: 'Through the whole chain', html: `
        <p>Every stage has a noise floor and a ceiling. Gain staging is keeping the signal comfortably between them at each step, not just at the recorder.</p>`, viz: 'gainStructure' },
      { h: 'Processing on the way in — or not', html: `
        ${T(['Tool', 'Record with it when…', 'Leave it for the mix when…'], [
          ['High-pass filter', 'Rumble or proximity boom is obviously useless', 'It is a bass instrument'],
          ['EQ', 'You are sure, and moving the mic did not fix it', 'You are guessing'],
          ['Compression', 'Light (2–4 dB) control of a very dynamic singer or bass, by someone who has done it before', 'Any doubt: over-compression cannot be undone'],
          ['Limiter', 'As a safety net on unpredictable sources', 'It is working all the time — lower the gain instead'],
          ['Effects (reverb, delay)', 'Almost never on the recorded track', 'Always: add them in the cue mix only'],
        ])}
        <div class="callout warn">Committing a great sound is professional. Committing a guess is a problem you hand to the mix. If in doubt, record clean and split the signal to a processed second track.</div>` },
      { h: 'Headphone (cue) mixes and latency', html: `
        ${SVG_CUE}
        ${T(['Player', 'Usually wants', 'Tip'], [
          ['Singer', 'Their voice clear, some reverb, the chords, less drums', 'One ear off the headphone helps pitch'],
          ['Drummer', 'Click, bass, guide vocal, little of their own kit', 'Closed, isolating headphones; watch the level'],
          ['Bass player', 'Kick, snare, their own bass', ''],
          ['Guitar / keys', 'Themselves, vocal, drums', ''],
          ['Everyone', 'Talkback that works every time', 'Leave it open between takes'],
        ])}
        <p>If players hear themselves late through the computer, they play worse. Keep the round trip under about 10 ms or use direct monitoring.</p>`, viz: 'latency' },
      { h: 'Click tracks, guide tracks and getting a performance', html: `
        <ul><li><b>Click:</b> pick a sound that cuts through (cowbell, side stick) and subdivide for slow tempos. If the band plays better without it, record without it. Stop click bleed from open headphones into quiet passages.</li>
        <li><b>Guide tracks:</b> a rough vocal and chord instrument give everyone the song’s shape.</li>
        <li><b>Singers:</b> comfortable room temperature and lighting, water, lyrics on a stand, a mix they love. Record everything, including warm-ups. Give one clear note at a time, start with something positive, and take breaks before the voice tires.</li>
        <li><b>Basics vs overdubs:</b> record the rhythm section together for feel; replace or add parts afterwards. When overdubbing, match the original mic, position and settings — which is why you wrote them down.</li></ul>` },
      { h: 'Documentation and backups', html: `
        ${T(['Write down', 'Why'], [
          ['Input list with mic, position, preamp and settings', 'Recalls and overdubs months later'],
          ['Photos of every mic position and the floor plan', 'Faster than words'],
          ['Take sheet: take number, complete/partial, comments, best sections', 'Comping without re-listening to everything'],
          ['Tempo, key, tuning reference, sample rate and bit depth', 'Avoids mismatched overdubs'],
          ['Session file naming: Song_Date_Version', 'No “final_final_2”'],
        ])}
        <div class="callout data"><b>3-2-1 backup.</b> Three copies, on two different kinds of storage, one of them somewhere else. Make the second copy before anyone leaves the building.</div>` },
      { h: 'Troubleshooting on the day', html: `
        ${T(['Symptom', 'Check in this order'], [
          ['No signal', 'Mute/solo → input selected → phantom power → cable → mic → channel'],
          ['Distortion', 'Meter clipping? → preamp gain → pad on the mic → mic too close → headphone amp overloaded (not the recording)'],
          ['Hum / buzz', 'Cable → lighting dimmers → guitar pickups near screens/transformers → ground loop (see <a href="#/academy/a-ground">Hum, Buzz & Grounding</a>)'],
          ['Clicks and drop-outs', 'Buffer too small → sample-rate/clock mismatch → disk full or slow'],
          ['Thin sound when two mics are combined', 'Polarity → distance difference'],
          ['Performer cannot hear', 'Cue send pre/post → headphone amp → the cable they are standing on'],
        ])}` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎸', 'Four-piece band, live in one room, one day', [['Plan', 'Amps in a side room or facing away behind gobos; DI the bass; vocal as a guide only'], ['Do', 'Four cue mixes, template ready, record the run-through'], ['Result', 'Basics for five songs, vocals overdubbed later']])}
          ${uc('🎤', 'Vocal overdub session at home', [['Plan', 'Direct monitoring, 128-sample buffer, comfort reverb in the cue only'], ['Do', 'Three to five full takes, then comp; notes on each'], ['Result', 'A comp built from complete performances']], '#7a5cc7')}
          ${uc('🎻', 'Classical soloist on location', [['Plan', 'Main pair + backup recorder running in parallel at −12 dB lower gain'], ['Do', 'Slate every take; follow with a score'], ['Result', 'No lost take if something clips']], '#c7772b')}
          ${uc('🎙️', 'Podcast with remote guest', [['Plan', 'Each person records locally as well as the call'], ['Do', 'Clap to sync; consistent mic distance'], ['Result', 'Clean separate tracks to edit']], '#2b9fc7')}
        </div>` },
      { h: 'Checklists', html: `
        <div class="grid g2">
          <div class="callout alt" style="margin:0"><b>Before recording</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Instruments tuned; tuner reference agreed</li><li>Every input line-checked and labelled</li><li>Levels set on the loudest passage</li><li>Polarity checked on multi-mic sources</li><li>Cue mixes confirmed by each player</li><li>Session saved; disk space checked</li></ul></div>
          <div class="callout mentor" style="margin:0"><b>After each take / at the end</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Note the take; mark the good bits</li><li>Re-tune between takes</li><li>Save; duplicate the playlist before editing</li><li>Photos and settings recorded</li><li>Two backups made</li><li>Phantom off, mics packed dry</li></ul></div>
        </div>
        <p>The assistant’s job in one sentence: be ahead of the session — the next mic on its stand, the next cable labelled, the notes up to date, the coffee quiet.</p>` },
    ],
    quiz: [
      { q: 'Where should average recording level sit in a 24-bit DAW?', opts: ['As close to 0 dBFS as possible', 'Around −18 dBFS', 'Around −60 dBFS', 'It does not matter'], a: 1, why: 'Peaks at −12 to −6 leave headroom; there is no noise penalty at 24-bit.' },
      { q: 'When should you set the preamp gain?', opts: ['During the quietest part', 'During the loudest part of the song', 'With the player silent', 'After recording'], a: 1, why: 'Otherwise the chorus clips.' },
      { q: 'Why are cue sends usually pre-fader?', opts: ['They are louder', 'So your control-room mix changes do not alter the performer’s headphones', 'To save CPU', 'They add reverb'], a: 1, why: 'The performer’s mix stays stable while you work.' },
      { q: 'A clipped recording can be fixed by…', opts: ['lowering the fader', 'nothing fully — re-record', 'adding EQ', 'normalising'], a: 1, why: 'The flattened waveform has lost information.' },
      { q: 'The 3-2-1 backup rule means…', opts: ['3 takes, 2 mics, 1 mix', '3 copies, 2 kinds of storage, 1 off-site', '3 dB, 2 ms, 1 kHz', '3 tracks per song'], a: 1, why: 'It protects against drive failure, theft and fire.' },
    ],
  };

  /* ================================ R5 ================================== */
  const R5 = {
    id: 'r-daw', n: 'R5', track: 'recording', title: 'The DAW, MIDI and Synchronisation', level: 'Core', mins: 40,
    summary: 'How a digital audio workstation is organised, the settings that matter (buffer, sample rate, bit depth, file formats), MIDI in plain words, and how machines are kept in time with each other.',
    tags: ['DAW', 'audio interface', 'buffer size', 'latency', 'sample rate', 'bit depth', 'file formats', 'MIDI', 'timecode', 'word clock', 'backup'],
    sections: [
      { h: 'What a DAW is', html: `
        <p class="lead">A digital audio workstation is a tape machine, a mixing console, a rack of processors and an editing table in one program. If you understand signal flow on a console, you understand a DAW.</p>
        ${SVG_DAW}
        ${T(['Thing', 'What it is', 'Console equivalent'], [
          ['Track', 'A lane that holds audio or MIDI clips and has a channel strip', 'A tape track + its channel'],
          ['Clip / region', 'A window onto an audio file; editing is non-destructive', 'A piece of tape'],
          ['Insert plug-in', 'A processor in the channel’s path', 'Outboard patched into the insert'],
          ['Send → bus → return', 'A copy of the signal to a shared effect', 'Aux send and effects return'],
          ['Group / subgroup bus', 'Several tracks summed for common control', 'Subgroup'],
          ['Automation', 'Recorded movements of faders, pans, any parameter', 'Fader automation'],
          ['Playlist / takes / comp', 'Alternative takes on one track', '—'],
        ])}
        <p>Console signal flow is explained in <a href="#/academy/a-flow">Signal Flow & the Mixing Console</a>.</p>` },
      { h: 'The audio interface and drivers', html: `
        <p>The interface holds the microphone preamps, the converters (analogue ↔ digital) and the clock. The driver is the software that hands blocks of samples between the interface and the DAW. Choose the manufacturer’s low-latency driver, one interface as the clock master, and the same sample rate everywhere.</p>
        ${T(['Feature', 'Why it matters'], [
          ['Number and type of inputs', 'Mic preamps, line, instrument (high-impedance), digital expansion'],
          ['Direct (hardware) monitoring / built-in mixer', 'Zero-latency headphones while tracking'],
          ['Stable drivers', 'More important than headline specifications'],
          ['Clock and digital I/O', 'Needed as soon as two digital devices are connected'],
          ['Headphone outputs', 'Separate cue mixes'],
        ])}` },
      { h: 'Buffer size: latency versus safety', html: `
        <p>The computer processes audio in blocks. A small block means little delay but little time to do the sums; a large block is safe but slow.</p>
        <div class="formula"><span class="lbl">One buffer of delay</span>time = buffer ÷ sample rate &nbsp;·&nbsp; 256 ÷ 48 000 = 5.3 ms &nbsp;·&nbsp; the round trip is about two buffers plus a couple of milliseconds</div>`, viz: 'bufferLatency' },
      { h: 'Sample rate and bit depth: what to choose', html: `
        ${T(['Setting', 'Choice', 'Reason'], [
          ['Bit depth (recording)', '24-bit', '≈ 144 dB theoretical range: record with generous headroom'],
          ['Bit depth (processing)', '32-bit float inside the DAW', 'Internal clipping is practically impossible; only the final output can clip'],
          ['Sample rate — music', '44.1 or 48 kHz', 'Captures the whole audible band; small files'],
          ['Sample rate — video / broadcast', '48 kHz', 'The picture world’s standard'],
          ['Higher rates (88.2 / 96 kHz)', 'When a client or archive requires, or for heavy pitch/time processing', 'Double the file size and processor load'],
          ['Delivery', '16-bit / 44.1 kHz for CD (with dither); 24-bit masters for streaming services', 'Dither when reducing bit depth'],
        ])}
        <p>The theory — sampling, aliasing, quantisation and dither — is in <a href="#/academy/a-digital">Digital Audio Deep Dive</a>.</p>`, viz: 'sampling' },
      { h: 'Files, formats and keeping a session tidy', html: `
        ${T(['Format', 'What it is', 'Use'], [
          ['WAV / Broadcast WAV (BWF)', 'Uncompressed; BWF adds a time stamp and metadata', 'Recording, mixing, archiving, exchange'],
          ['AIFF', 'Uncompressed, equivalent quality', 'Same uses'],
          ['Lossless compressed (e.g. FLAC, ALAC)', 'About half the size, bit-for-bit identical on playback', 'Archive, delivery'],
          ['Lossy (e.g. MP3, AAC, Opus)', 'Discards what the codec predicts you will not hear', 'Reference copies and distribution only — never as a working format'],
        ])}
        <p>Lossy coding relies on masking. Repeated encoding stacks up artefacts, and very hot masters can clip in the decoder — leave about 1 dB of true-peak headroom on files that will be encoded.</p>
        <ul><li>One folder per song; let the DAW copy every imported file into it.</li><li>Name tracks <b>before</b> recording so the audio files inherit useful names.</li><li>Colour-code and order tracks the same way every time (drums, bass, guitars, keys, vocals, effects).</li><li>Save versions (Song_v03), not overwrites. Consolidate and export stems when a stage is finished.</li><li>3-2-1 backups; test that a backup actually opens.</li></ul>` },
      { h: 'MIDI in plain words', html: `
        <p>MIDI is not sound. It is a stream of instructions — “note 60 on, this hard”, “pedal down”, “move this knob” — that an instrument turns into sound.</p>
        ${T(['Message', 'Meaning', 'Range'], [
          ['Note on / off', 'Which key, and when it starts and stops', 'Notes 0–127 (middle C = 60)'],
          ['Velocity', 'How hard the key was struck', '1–127'],
          ['Control change (CC)', 'Knobs, pedals, wheels: CC1 modulation, CC7 volume, CC10 pan, CC64 sustain', '0–127'],
          ['Pitch bend', 'Bend wheel', '14-bit, finer than CCs'],
          ['Program change', 'Select a sound', '0–127'],
          ['Clock / start / stop', 'Tempo ticks, 24 per quarter note', 'Keeps sequencers and drum machines in step'],
        ])}
        <ul><li><b>Channels and ports:</b> each cable or virtual port carries 16 channels; each channel can address a different instrument.</li>
        <li><b>Connections:</b> the classic 5-pin cable (one direction per cable, about 15 m maximum), USB, network and wireless all carry the same messages.</li>
        <li><b>Virtual instruments:</b> plug-ins that turn MIDI into audio inside the DAW; they need a small buffer while you play them.</li>
        <li><b>Editing:</b> quantise to tighten timing (try 60–80 % strength to keep some feel), edit velocities, transpose, change the sound after the performance.</li>
        <li><b>Render to audio</b> (freeze, bounce) before mixing and archiving: the sound no longer depends on a plug-in existing in ten years.</li></ul>
        <div class="callout mentor">Record the MIDI <i>and</i> the audio of hardware synths. The audio is the performance you heard; the MIDI lets you fix a wrong note without re-recording.</div>` },
      { h: 'Synchronisation: where and how fast', html: `
        ${SVG_SYNC}
        ${T(['Frame rate', 'Where it is used'], [
          ['24 fps', 'Film, cinema'],
          ['25 fps', 'Television in 50 Hz regions'],
          ['23.976 fps', 'Film-style material for 60 Hz video systems'],
          ['29.97 fps (drop-frame and non-drop)', 'Television in 60 Hz regions'],
          ['30 fps', 'Some music and audio-only work'],
        ])}
        ${T(['Signal', 'Carries', 'Notes'], [
          ['Linear timecode (LTC)', 'Position as an audio-rate signal on a cable or track', 'Readable only while playing'],
          ['MIDI timecode (MTC)', 'The same position sent as MIDI messages', 'Locks a DAW to video or another machine'],
          ['MIDI clock', 'Tempo ticks, not position', 'Drum machines, arpeggiators, delays'],
          ['Word clock', 'One pulse per sample', 'One master; everything else follows; 75 Ω cable, terminated'],
          ['Video reference (black burst / tri-level)', 'Frame edges', 'Ties audio clock to picture'],
        ])}
        <div class="callout warn">Clicks and pops when two digital devices are connected almost always mean two clocks running free. Decide which device is the master and set every other one to follow it.</div>` },
      { h: 'Loops and tempo', html: `
        <p>Loop-based production stretches or slices audio so that recordings made at one tempo follow another. Time-stretching works best in small amounts (a few percent to about 10–15 %); slicing at transients works best on drums. Set the session tempo — or a tempo map that follows a live performance — before building on top of it.</p>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎤', 'Singer hears an echo of themselves', [['Cause', 'Software monitoring at a 1024-sample buffer'], ['Do', 'Direct monitoring, or 64–128 samples while tracking'], ['Result', 'Tight timing and pitch']])}
          ${uc('🖥️', 'Mix starts crackling', [['Cause', 'Small buffer left over from tracking; heavy plug-ins'], ['Do', 'Buffer to 1024+, freeze virtual instruments'], ['Result', 'Stable playback']], '#7a5cc7')}
          ${uc('🎬', 'Music for a video', [['Set-up', '48 kHz session, frame rate matched to the picture, BWF exports with time stamps'], ['Result', 'Files drop into the editor in sync']], '#c7772b')}
          ${uc('🎹', 'Hardware synth and DAW drifting', [['Cause', 'No shared tempo reference'], ['Do', 'DAW sends MIDI clock; record the synth’s audio and nudge for its latency'], ['Result', 'Locked parts']], '#2b9fc7')}
          ${uc('💾', 'Opening a five-year-old session', [['Problem', 'Plug-ins missing'], ['Do', 'At the time: print stems and rendered instrument tracks alongside the session'], ['Result', 'The music survives the software']], '#4c9a3a')}
        </div>` },
      { h: 'Problems and a set-up checklist', html: `
        ${T(['Problem', 'Likely cause', 'Solution'], [
          ['Clicks while recording', 'Buffer too small or clock mismatch', 'Raise the buffer; one clock master; same sample rate everywhere'],
          ['Audio plays at the wrong pitch/speed', 'File sample rate differs from the session', 'Convert on import'],
          ['Overdub lands late', 'Latency not compensated', 'Calibrate the interface’s round-trip offset; enable delay compensation'],
          ['MIDI notes stuck on', 'Missed note-off', '“All notes off” / panic button'],
          ['Hard drive full mid-take', 'No space check', 'Plan ≈ 0.5 GB per track-hour at 24-bit/48 kHz'],
          ['Files missing on another computer', 'Audio referenced from elsewhere', '“Save a copy with all files” before moving'],
        ])}
        <ul><li>Sample rate and bit depth chosen for the delivery?</li><li>Clock master decided?</li><li>Buffer set for tracking (small) or mixing (large)?</li><li>Template loaded, tracks named, cue sends ready?</li><li>Disk space and backup destination checked?</li></ul>` },
    ],
    quiz: [
      { q: 'One buffer of 512 samples at 48 kHz lasts about…', opts: ['1 ms', '5 ms', '10.7 ms', '50 ms'], a: 2, why: '512 ÷ 48 000 = 10.7 ms; the round trip is roughly double.' },
      { q: 'Which is true of MIDI?', opts: ['It is compressed audio', 'It is performance instructions, not sound', 'It only works over USB', 'It needs 96 kHz'], a: 1, why: 'Notes, velocities and controllers that an instrument turns into sound.' },
      { q: 'Word clock tells devices…', opts: ['where they are in the song', 'how fast to run, sample by sample', 'the tempo in BPM', 'the key'], a: 1, why: 'Timecode gives position; word clock gives speed.' },
      { q: 'Best working format for recording and mixing?', opts: ['MP3', '24-bit WAV / BWF', 'A lossy streaming format', '8-bit audio'], a: 1, why: 'Uncompressed, with headroom; lossy formats are for distribution only.' },
      { q: 'A mix crackles with many plug-ins. First step?', opts: ['Lower the buffer size', 'Raise the buffer size', 'Raise the sample rate', 'Turn up the master'], a: 1, why: 'A larger buffer gives the computer more time per block; latency does not matter when mixing.' },
    ],
  };

  [R1, R2, R3, R4, R5].forEach((L) => window.LESSONS.push(L));
})();
