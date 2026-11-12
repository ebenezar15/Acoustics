/* ==========================================================================
   Master Class M9A — Building acoustic doors, seals and studio windows;
   resonance and budget isolation. Practical, animated, own words.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  /* ---------- animated diagrams ---------- */
  const SVG_DOOR = `<svg class="gsvg" viewBox="0 0 640 300" role="img" aria-label="Anatomy of an acoustic door">
    <text x="320" y="18" text-anchor="middle" font-size="13" font-weight="700">Anatomy of an acoustic door (plan section, looking down)</text>
    <rect x="20" y="60" width="90" height="70" fill="var(--muted)" opacity=".5"/><rect x="530" y="60" width="90" height="70" fill="var(--muted)" opacity=".5"/>
    <text x="65" y="100" text-anchor="middle" font-size="10">wall</text><text x="575" y="100" text-anchor="middle" font-size="10">wall</text>
    <rect x="110" y="60" width="26" height="70" fill="var(--accent2)"/><rect x="504" y="60" width="26" height="70" fill="var(--accent2)"/>
    <rect x="136" y="108" width="14" height="22" fill="var(--accent2)"/><rect x="490" y="108" width="14" height="22" fill="var(--accent2)"/>
    <g class="door-swing"><rect x="140" y="72" width="360" height="36" rx="2" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
      <rect x="146" y="76" width="348" height="8" fill="var(--c3)" opacity=".7"/><rect x="146" y="86" width="348" height="3" fill="var(--good)"/><rect x="146" y="91" width="348" height="13" fill="var(--accent)" opacity=".55"/></g>
    <circle class="seal-squish" cx="146" cy="112" r="5" fill="var(--good)"/><circle class="seal-squish" cx="494" cy="112" r="5" fill="var(--good)"/>
    <circle cx="118" cy="66" r="5" fill="var(--text)"/>
    <path d="M320 150 V132" stroke="var(--muted)"/><text x="320" y="164" text-anchor="middle" font-size="11">① heavy leaf: solid core + added board (mass)</text>
    <path d="M250 182 L250 88" stroke="var(--good)" stroke-dasharray="3 3"/><text x="250" y="196" text-anchor="middle" font-size="11" fill="var(--good)">② damping layer between boards</text>
    <path d="M146 222 V118" stroke="var(--good)" stroke-dasharray="3 3"/><text x="150" y="236" font-size="11" fill="var(--good)">③ compression seal against the stop</text>
    <path d="M118 258 V72" stroke="var(--text)" stroke-dasharray="3 3"/><text x="122" y="272" font-size="11">④ heavy-duty hinges (3–4), frame packed &amp; sealed to the wall</text>
    <text x="620" y="236" text-anchor="end" font-size="11" fill="var(--muted)">⑤ bottom: drop seal or threshold (see below)</text>
    <g class="wave-in"><path d="M300 40 q10 12 0 24" fill="none" stroke="var(--c3)" stroke-width="2"/><path d="M320 36 q14 16 0 32" fill="none" stroke="var(--c3)" stroke-width="2"/><path d="M340 40 q10 12 0 24" fill="none" stroke="var(--c3)" stroke-width="2"/></g>
  </svg>`;

  const sealCell = (x, title, body, note, cls) => `<g transform="translate(${x} 0)">
      <text x="75" y="18" text-anchor="middle" font-size="11" font-weight="700">${title}</text>
      <rect x="10" y="30" width="24" height="110" fill="var(--accent2)"/><rect x="34" y="118" width="26" height="22" fill="var(--accent2)"/>
      <rect class="${cls}" x="40" y="34" width="20" height="82" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/>
      ${body}
      <text x="75" y="160" text-anchor="middle" font-size="10" fill="var(--muted)">${note}</text></g>`;
  const SVG_SEALS = `<svg class="gsvg" viewBox="0 0 640 170" role="img" aria-label="Seal types at the door jamb">
    ${sealCell(0, 'No seal', '<path class="leak-pulse" d="M62 112 q18 -30 50 -40" fill="none" stroke="var(--bad)" stroke-width="2.5"/>', '≈ 2 mm gap · ≈ 25 dB max', '')}
    ${sealCell(160, 'Foam tape', '<rect x="36" y="112" width="22" height="6" fill="var(--warn)"/><path class="leak-pulse" d="M62 112 q14 -18 34 -24" fill="none" stroke="var(--bad)" stroke-width="1.5"/>', 'cheap, flattens in months', '')}
    ${sealCell(320, 'Compression bulb', '<ellipse class="seal-squish" cx="50" cy="114" rx="8" ry="5" fill="var(--good)"/>', 'adjustable stop · long life', 'door-press')}
    ${sealCell(480, 'Double: bulb + magnetic', '<ellipse class="seal-squish" cx="50" cy="114" rx="8" ry="5" fill="var(--good)"/><rect x="60" y="60" width="6" height="30" fill="var(--good)"/><rect x="66" y="60" width="4" height="30" fill="var(--text)"/>', 'two lines of defence', 'door-press')}
  </svg>`;

  const SVG_BOTTOM = `<svg class="gsvg" viewBox="0 0 640 150" role="img" aria-label="Bottom of door options">
    ${[['Open gap', 'bad', ''], ['Sweep', 'warn', '<path d="M52 84 l-6 22 M60 84 l0 22 M68 84 l6 22" stroke="var(--warn)" stroke-width="3"/>'], ['Automatic drop seal', 'good', '<rect class="drop-seal" x="46" y="80" width="28" height="12" rx="3" fill="var(--good)"/><circle cx="40" cy="78" r="3" fill="var(--text)"/>'], ['Threshold + seal', 'good', '<path d="M20 108 h100 v-10 h-40 v-6 h-20 v6 h-40z" fill="var(--muted)"/><ellipse class="seal-squish" cx="60" cy="90" rx="9" ry="4" fill="var(--good)"/>']].map(([t, c, b], i) => `<g transform="translate(${i * 160} 0)">
      <text x="70" y="16" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <rect x="46" y="26" width="28" height="56" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/>
      <rect x="10" y="108" width="130" height="12" fill="var(--muted)" opacity=".6"/>${b}
      ${c === 'bad' ? '<path class="leak-pulse" d="M30 98 h80" stroke="var(--bad)" stroke-width="3" stroke-dasharray="6 5"/>' : c === 'warn' ? '<path class="leak-pulse" d="M40 104 h50" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="4 6"/>' : ''}
      <text x="70" y="140" text-anchor="middle" font-size="10" fill="var(--${c})">${['10 mm gap ≈ limits the wall to ~30 dB', 'helps highs, leaks bass', 'drops as the door closes', 'best seal · step to cross'][i]}</text></g>`).join('')}
  </svg>`;

  const SVG_LOCK = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Sound lock plan">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Sound lock: two ordinary sealed doors beat one expensive door</text>
    <rect x="20" y="40" width="210" height="150" fill="color-mix(in srgb, var(--bad) 8%, var(--panel))" stroke="var(--text)" stroke-width="3"/><text x="125" y="120" text-anchor="middle" font-size="12" font-weight="700">Live room</text><text x="125" y="138" text-anchor="middle" font-size="10" fill="var(--muted)">110 dB drums</text>
    <rect x="230" y="70" width="150" height="90" fill="color-mix(in srgb, var(--c4) 22%, var(--panel))" stroke="var(--text)" stroke-width="3"/><text x="305" y="112" text-anchor="middle" font-size="11" font-weight="700">sound lock</text><text x="305" y="128" text-anchor="middle" font-size="9" fill="var(--muted)">absorber on walls &amp; ceiling</text>
    <rect x="380" y="40" width="240" height="150" fill="color-mix(in srgb, var(--good) 8%, var(--panel))" stroke="var(--text)" stroke-width="3"/><text x="500" y="120" text-anchor="middle" font-size="12" font-weight="700">Control room</text><text x="500" y="138" text-anchor="middle" font-size="10" fill="var(--muted)">quiet</text>
    <rect x="226" y="92" width="8" height="46" fill="var(--panel)"/><rect x="376" y="92" width="8" height="46" fill="var(--panel)"/>
    <line x1="230" y1="92" x2="230" y2="138" stroke="var(--good)" stroke-width="5"/><line x1="380" y1="92" x2="380" y2="138" stroke="var(--good)" stroke-width="5"/>
    <g class="lock-wave"><circle cx="180" cy="115" r="14" fill="none" stroke="var(--bad)" stroke-width="3"/></g>
    <g class="lock-wave d2"><circle cx="300" cy="115" r="8" fill="none" stroke="var(--warn)" stroke-width="2"/></g>
    <g class="lock-wave d3"><circle cx="420" cy="115" r="4" fill="none" stroke="var(--good)" stroke-width="1.5"/></g>
    <text x="230" y="206" text-anchor="middle" font-size="10" fill="var(--good)">door 1 ≈ 35 dB</text><text x="380" y="206" text-anchor="middle" font-size="10" fill="var(--good)">door 2 ≈ 35 dB</text><text x="540" y="206" text-anchor="middle" font-size="10" font-weight="700">together ≈ 55–65 dB</text>
  </svg>`;

  const SVG_WINDOW = `<svg class="gsvg" viewBox="0 0 640 250" role="img" aria-label="Studio window section">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Studio window between two rooms (section)</text>
    <rect x="150" y="30" width="80" height="40" fill="var(--muted)" opacity=".55"/><rect x="150" y="190" width="80" height="40" fill="var(--muted)" opacity=".55"/>
    <rect x="410" y="30" width="80" height="40" fill="var(--muted)" opacity=".55"/><rect x="410" y="190" width="80" height="40" fill="var(--muted)" opacity=".55"/>
    <text x="190" y="54" text-anchor="middle" font-size="10">wall leaf A</text><text x="450" y="54" text-anchor="middle" font-size="10">wall leaf B</text>
    <rect x="230" y="60" width="180" height="10" fill="var(--c4)" opacity=".8"/><rect x="230" y="190" width="180" height="10" fill="var(--c4)" opacity=".8"/>
    <rect class="pane-a" x="196" y="70" width="8" height="120" fill="var(--c3)"/><g transform="rotate(4 446 130)"><rect class="pane-b" x="440" y="70" width="12" height="120" fill="var(--good)"/></g>
    <rect x="190" y="66" width="20" height="6" fill="var(--text)"/><rect x="190" y="188" width="20" height="6" fill="var(--text)"/><rect x="436" y="66" width="20" height="6" fill="var(--text)"/><rect x="436" y="188" width="20" height="6" fill="var(--text)"/>
    <line x1="230" y1="34" x2="410" y2="34" stroke="var(--bad)" stroke-dasharray="4 4"/><text x="320" y="30" text-anchor="middle" font-size="10" fill="var(--bad)">gap in the frame: the two wall leaves never touch</text>
    <text x="110" y="120" text-anchor="end" font-size="11" fill="var(--c3)">① 6–8 mm glass</text><text x="110" y="136" text-anchor="end" font-size="10" fill="var(--muted)">on rubber gaskets</text>
    <text x="500" y="120" font-size="11" fill="var(--good)">② 10–12 mm laminated</text><text x="500" y="136" font-size="10" fill="var(--muted)">different thickness,</text><text x="500" y="150" font-size="10" fill="var(--muted)">slight tilt (glare)</text>
    <text x="320" y="126" text-anchor="middle" font-size="11">③ air gap ≥ 100 mm</text><text x="320" y="142" text-anchor="middle" font-size="10" fill="var(--muted)">(as wide as the wall allows)</text>
    <text x="320" y="216" text-anchor="middle" font-size="10" fill="var(--c4)">④ absorbent reveal lining (wool behind perforated metal / fabric)</text>
    <text x="320" y="242" text-anchor="middle" font-size="10" fill="var(--muted)">⑤ desiccant sachet + sealed perimeter: no fogging, no leaks</text>
  </svg>`;

  const hot = (x, y, n, lab, lx, ly, anchor = 'start') => `<circle class="hot" cx="${x}" cy="${y}" r="9" fill="var(--bad)" opacity=".85"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${n}</text><text x="${lx}" y="${ly}" font-size="10" text-anchor="${anchor}"><tspan font-weight="800" fill="var(--bad)">${n}</tspan> ${lab}</text>`;
  const SVG_RESMAP = `<svg class="gsvg" viewBox="0 0 760 300" role="img" aria-label="Where resonances occur in a studio">
    <text x="380" y="16" text-anchor="middle" font-size="13" font-weight="700">Where resonances hide in a studio (section)</text>
    <rect x="60" y="40" width="420" height="200" fill="var(--panel2)" stroke="var(--text)" stroke-width="6"/>
    <rect x="76" y="56" width="388" height="168" fill="var(--panel)" stroke="var(--accent)" stroke-width="3" stroke-dasharray="8 4"/>
    <rect x="76" y="208" width="388" height="10" fill="var(--accent2)"/>${[100, 180, 260, 340, 420].map((x) => `<path d="M${x} 218 l-4 4 l8 4 l-8 4 l4 4" stroke="var(--accent)" fill="none" stroke-width="1.5"/>`).join('')}
    <rect x="458" y="110" width="26" height="80" fill="var(--panel)"/><rect x="462" y="110" width="5" height="80" fill="var(--accent2)"/><rect x="476" y="110" width="5" height="80" fill="var(--accent2)"/>
    <rect x="56" y="90" width="26" height="60" fill="var(--panel)"/><line x1="62" y1="90" x2="62" y2="150" stroke="var(--c3)" stroke-width="3"/><line x1="76" y1="90" x2="76" y2="150" stroke="var(--c3)" stroke-width="3"/>
    <rect x="200" y="30" width="60" height="18" fill="var(--c3)" opacity=".5"/><text x="230" y="43" text-anchor="middle" font-size="9">duct</text>
    <rect x="250" y="150" width="30" height="50" fill="var(--text)"/><circle cx="265" cy="182" r="9" fill="none" stroke="var(--panel)" stroke-width="2"/>
    ${hot(69, 120, 1, 'Window: mass–air–mass + coincidence', 20, 268)}
    ${hot(471, 150, 2, 'Double door / sound lock resonance', 500, 150)}
    ${hot(68, 200, 3, 'Wall leaves on the cavity air spring', 20, 284)}
    ${hot(270, 221, 4, 'Floating floor on its pads', 240, 268)}
    ${hot(270, 48, 5, 'Ceiling on hangers', 500, 50)}
    ${hot(230, 39, 6, 'Duct walls & plenum', 500, 34)}
    ${hot(265, 120, 7, 'Room modes (the air itself)', 500, 120)}
    ${hot(380, 180, 8, 'Furniture, panels, light fittings', 500, 190)}
    <text x="500" y="268" font-size="10" fill="var(--muted)">Each is a mass on a spring.</text><text x="500" y="282" font-size="10" fill="var(--muted)">Keep them low, damped</text><text x="500" y="296" font-size="10" fill="var(--muted)">and apart from each other.</text>
  </svg>`;

  const L = {
    id: 'm-door-build', n: 'M9A', track: 'master', title: 'Building Acoustic Doors, Seals & Studio Windows — and Taming Resonance on a Budget', level: 'Core', mins: 50,
    summary: 'How to plan and build doors, seals and glass between rooms that actually isolate; the simple theory behind them; where resonances hide and how to move or damp them; and the cheapest upgrades that give the most decibels.',
    tags: ['acoustic door', 'door seals', 'drop seal', 'sound lock', 'studio window', 'laminated glass', 'mass-air-mass', 'coincidence', 'resonance', 'budget isolation', 'acoustic sealant'],
    sections: [
      { h: 'The 60-second idea: sound isolation is plumbing', html: `
        <p class="lead">Think of sound as water under pressure. A thick wall is a strong tank — but water pours out of the smallest hole. Doors and windows are holes you <i>have</i> to make, so they decide how good the whole room is.</p>
        ${flow([['Airtight', 'no gap, crack or keyhole'], ['Heavy', 'mass stops the bass'], ['Damped', 'so it doesn’t ring'], ['Doubled', 'two layers with air between'], ['Decoupled', 'the layers never touch']])}
        <p>Build a door below. Start with the default (a hollow door with a gap under it), then fix it one step at a time and watch the red leaks shrink.</p>`, viz: 'doorBuilder' },
      { h: 'Anatomy of an acoustic door', html: `
        ${SVG_DOOR}
        <div class="table-wrap"><table><tr><th>Part</th><th>What it does</th><th>Budget build</th><th>Pro build</th></tr>
          <tr><td><b>Leaf</b></td><td>Mass blocks sound (each doubling ≈ +5–6 dB)</td><td>Solid-core slab 44 mm (≈ 28 kg/m²) + 12 mm MDF glued on</td><td>Purpose-made 60–100 mm steel or timber door, 45–60 kg/m²</td></tr>
          <tr><td><b>Damping</b></td><td>Stops the leaf ringing at its coincidence frequency</td><td>Damping compound or flexible adhesive between slab and MDF</td><td>Constrained-layer core, sand or mineral fill</td></tr>
          <tr><td><b>Perimeter seals</b></td><td>Airtightness at head and jambs</td><td>Compression bulb seals in a planted timber stop</td><td>Adjustable aluminium seal carriers, double or magnetic seals</td></tr>
          <tr><td><b>Bottom seal</b></td><td>Closes the biggest gap</td><td>Surface-mounted automatic drop seal</td><td>Raised threshold with compression seal, or mortised drop seal</td></tr>
          <tr><td><b>Frame</b></td><td>Must be as solid and sealed as the wall</td><td>Timber frame packed with mineral wool, sealant both sides</td><td>Grouted steel frame, split so the two wall leaves stay separate</td></tr>
          <tr><td><b>Hardware</b></td><td>Carries the weight, no holes through the leaf</td><td>3–4 ball-bearing hinges; latch without a through keyhole</td><td>Cam-lift hinges, compression latch pulling the door onto its seals</td></tr></table></div>
        <div class="callout data"><b>Rule of thumb:</b> a 44 mm solid-core door is ≈ STC 28–30 unsealed, ≈ 33–36 fully sealed; with added mass and damping ≈ 38–42. Two sealed doors with a lined lobby between them: ≈ 55–65.</div>
        <div class="callout safety">A 2 m door at 45 kg/m² weighs over 80 kg. Use hinges rated for the weight, fix the frame into structure, and keep the door on a required escape route openable without a key — check your local fire code before modifying a fire door.</div>` },
      { h: 'Seals: where doors are won or lost', html: `
        ${SVG_SEALS}
        <p>A seal works by being <b>squeezed</b>. It needs a flat surface to press on, enough compression (about a quarter to a third of its height) all the way round, and a latch that holds the door against it. Two seal lines in series are far better than one, because a leak in one is blocked by the other.</p>
        ${SVG_BOTTOM}
        <div class="uc-grid">
          ${uc('🔦', 'Light test', [['How', 'Dark room, bright torch on the other side. Any light you see is a sound leak.'], ['Finds', 'Gaps at corners, under the door, around the frame']])}
          ${uc('📄', 'Paper test', [['How', 'Close the door on a strip of paper. It should grip all the way round.'], ['Finds', 'Places where the seal is not compressed']], '#7a5cc7')}
          ${uc('🕯️', 'Smoke / incense test', [['How', 'Hold an incense stick near the edges with a fan running in the room.'], ['Finds', 'Air paths — where air goes, sound goes']], '#c7772b')}
          ${uc('🔊', 'Pink-noise test', [['How', 'Play pink noise inside, walk the outside with your ear or a phone SPL app close to the edges.'], ['Finds', 'The loudest leak, to fix first']], '#2b9fc7')}
        </div>
        <div class="callout warn">Keyholes, letter slots, cat flaps, cable holes and the gap between frame and wall behind the architrave leak as much as a bad seal. Pull the trim off, pack with mineral wool, and run acoustic sealant on both sides.</div>` },
      { h: 'Two doors and a sound lock', html: `
        ${SVG_LOCK}
        <p>One door, however heavy, has one weak seal line and one leaf. Two modest doors with an absorbent space between them give <b>two</b> of everything, plus the air gap decouples them. The deeper and more absorbent the lobby, the lower its resonance and the better the bass isolation. Even a pair of doors back-to-back in a 200–300 mm deep wall is a big step up.</p>
        <div class="callout example">Rehearsal room onto a corridor: one sealed solid-core door ≈ 35 dB. A second identical door 1 m further, lobby lined with 50 mm absorber: ≈ 55–60 dB at mid frequencies — the drums drop from “loud” to “faint thump”. Try the “sound lock” switch in the builder above.</div>
        <ul><li>Open the doors in opposite directions or stagger them so both are never open in line.</li><li>Line the lobby walls and ceiling with absorber — a bare lobby rings and passes sound along.</li><li>Ventilate the lobby through a silenced path; do not rely on the door gaps.</li></ul>` },
      { h: 'Glass between rooms: the studio window', html: `
        ${SVG_WINDOW}
        <p>Glass is heavy (2.5 kg/m² per millimetre), so it isolates well for its thickness — but two panes with air between them form a mass–spring–mass system, and thin identical panes close together resonate right in the bass. Explore it:</p>`, viz: 'glassLab' },
      { h: 'Planning the window: rules that work', html: `
        <div class="table-wrap"><table><tr><th>Decision</th><th>Do</th><th>Why</th></tr>
          <tr><td>Number of panes</td><td>Two (one per wall leaf). Three is rarely better.</td><td>A middle pane splits the cavity into two stiffer air springs.</td></tr>
          <tr><td>Thickness</td><td>Different on each side: e.g. 6 + 10 mm, or 8 + 12.8 mm laminated</td><td>Staggers the coincidence dips</td></tr>
          <tr><td>Laminated glass</td><td>At least one pane, ideally the thicker one</td><td>The plastic interlayer damps the coincidence dip (and is safer)</td></tr>
          <tr><td>Air gap</td><td>As wide as the wall allows: 100–200 mm+</td><td>Lowers the mass–air–mass resonance below the music</td></tr>
          <tr><td>Reveals</td><td>Absorbent lining all round between the panes</td><td>Damps the cavity’s own resonances</td></tr>
          <tr><td>Mounting</td><td>Each pane in its own leaf, on neoprene/EPDM gaskets, sealed</td><td>Keeps the two wall leaves decoupled and airtight</td></tr>
          <tr><td>Tilt</td><td>Optional 3–6° on one pane</td><td>Controls reflections and glare; isolation benefit is small</td></tr>
          <tr><td>Size</td><td>No bigger than sight lines need</td><td>Glass is usually weaker than the wall — less area, less loss</td></tr></table></div>
        ${myth([
          ['“Triple glazing must be better than double.”', 'For the same total glass and depth, two panes with one wide gap beat three panes with two narrow gaps at low frequencies.'],
          ['“Angled glass gives much more isolation.”', 'The tilt is for reflections and glare. Isolation comes from mass, gap width, damping and sealing.'],
          ['“A sealed thermal double-glazed unit is a studio window.”', 'Its 12–20 mm gap resonates around 150–250 Hz. Use it as <i>one</i> of the two panes if you like, with a second pane 100 mm away.'],
          ['“Acrylic (Perspex) is as good as glass.”', 'It is half the density: you need about twice the thickness for the same mass. Fine for a budget inner pane or a window plug.'],
        ])}
        <div class="callout alt"><b>Budget route:</b> keep the existing window and add a second pane (laminated glass or 10 mm acrylic) in a sealed timber sub-frame 100 mm inside it, with wool-lined reveals. Or build a removable <a href="#/workshop">window plug</a> for recording sessions.</div>` },
      { h: 'Resonance: where it occurs and how to deal with it', html: `
        ${SVG_RESMAP}
        <p>Every isolating construction is some kind of <b>mass on a spring</b>, and every mass on a spring has a frequency where it “sings” and lets sound through. You cannot remove resonances; you choose <b>where</b> they sit and how strongly they ring.</p>
        <div class="table-wrap"><table><tr><th>#</th><th>Resonance</th><th>Typical frequency</th><th>Symptom</th><th>Cure</th></tr>
          <tr><td>1–3</td><td>Mass–air–mass (double walls, doors, glazing)</td><td>30–250 Hz</td><td>Bass passes although mids are blocked</td><td>More mass, deeper cavity, wool in cavity; target ≤ half your lowest problem frequency</td></tr>
          <tr><td>1</td><td>Coincidence (stiff panels, glass)</td><td>Gypsum 13 mm ≈ 2.5–3 kHz · glass 6 mm ≈ 2 kHz · 12 mm ≈ 1 kHz</td><td>A notch in the speech/presence range</td><td>Damping, laminated glass, mismatched thicknesses, two thin layers instead of one thick</td></tr>
          <tr><td>4–5</td><td>Floors and ceilings on isolators</td><td>5–25 Hz</td><td>Amplifies near resonance; “bouncy” floor</td><td>Correctly loaded pads/springs; keep below half the structure’s resonance</td></tr>
          <tr><td>6</td><td>Duct walls, plenums, grilles</td><td>50–500 Hz</td><td>Rumble or a drone note</td><td>Lined ducts, stiffened or lagged panels, flexible connectors</td></tr>
          <tr><td>7</td><td>Room modes</td><td>20–300 Hz</td><td>Boomy notes, dead spots</td><td>Positioning and bass traps — treatment, not isolation</td></tr>
          <tr><td>8</td><td>Sympathetic rattles</td><td>Anywhere</td><td>Buzz on certain notes</td><td>Tighten, pad, damp; find with a slow sine sweep</td></tr></table></div>`, viz: 'resonanceMap' },
      { h: 'Best cheap tools and materials', html: `
        <div class="uc-grid">
          ${uc('🧴', 'Acoustic sealant', [['Use', 'Every perimeter, frame, outlet box and crack; stays flexible for decades'], ['Cost', 'A few dollars a tube — the best value in isolation']])}
          ${uc('🧵', 'Backer rod', [['Use', 'Foam rod pushed into gaps wider than 6 mm before sealing'], ['Cost', 'Pennies per metre']], '#7a5cc7')}
          ${uc('🟫', 'Putty pads', [['Use', 'Wrap the back of electrical boxes in isolation walls (work by a licensed electrician)'], ['Cost', 'Low']], '#c7772b')}
          ${uc('🚪', 'Compression seals & drop seal', [['Use', 'Around and under every studio door'], ['Cost', 'Low to moderate — more dB per dollar than anything else']], '#2b9fc7')}
          ${uc('🪵', 'MDF / plywood + damping compound', [['Use', 'Add mass to doors, window plugs, thin walls'], ['Cost', 'Low']], '#4c9a3a')}
          ${uc('🧱', 'Second layer of gypsum board', [['Use', 'Staggered joints, damping between layers, sealed edges'], ['Cost', 'Moderate; +5–8 dB on a light wall']], '#c7a12b')}
          ${uc('🧶', 'Mineral wool', [['Use', 'Inside cavities, frames, door cores, window reveals — damps resonances'], ['Cost', 'Low. Note: it does not block sound by itself']], '#d14b8f')}
          ${uc('📱', 'Phone SPL app + torch + incense', [['Use', 'Find leaks and compare before/after'], ['Cost', 'Almost free']])}
        </div>
        ${myth([
          ['“Foam, egg boxes or carpet on the wall will stop sound leaving.”', 'They absorb reflections inside the room. Isolation change: about 0 dB.'],
          ['“Mass-loaded vinyl is a miracle layer.”', 'It is simply mass (≈ 5 kg/m²). A layer of gypsum board has more mass for less money; vinyl is useful where flexibility matters (wrapping ducts, door cores).'],
          ['“Fill the wall cavity with foam and it becomes soundproof.”', 'Cavity fill damps the resonance (+3–6 dB). Rigid foam can even bridge the leaves and make things worse; use soft mineral wool.'],
          ['“A heavy curtain over the door or window isolates.”', 'A couple of dB at high frequencies. Good for echo, weak for isolation.'],
        ])}
        <p>Now try it with money: set a budget and let the optimiser choose, or tick upgrades yourself and watch which path leaks most.</p>`, viz: 'budgetIso' },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎤', 'Home vocal booth door', [['Problem', 'Hollow door, 12 mm gap; fridge and traffic on every take'], ['Build', 'Solid-core slab, bulb seals, drop seal, sealant behind the trim'], ['Result', '≈ 18 → 34 dB at the door for a modest spend']])}
          ${uc('🥁', 'Drum room in a garage', [['Problem', 'Neighbours hear kick and snare through the side door'], ['Build', 'Two solid sealed doors back-to-back in a deepened frame, wool-lined gap; added mass with damping'], ['Result', '≈ 50–55 dB at the doorway; the garage door is now the weak link — treat it next']], '#c7772b')}
          ${uc('🎚️', 'Control-room window', [['Problem', 'Need sight lines to the live room without losing the wall'], ['Build', '6 mm + 10.8 mm laminated, 150 mm gap, lined reveals, each pane in its own leaf'], ['Result', '≈ STC 50+, bass resonance pushed below ~60 Hz']], '#7a5cc7')}
          ${uc('🎙️', 'Podcast room in a flat', [['Problem', 'Corridor noise and a street-facing window'], ['Build', 'Door seals + drop seal, window plug for recording, sealant around frames'], ['Result', '≈ +8–12 dB overall, reversible for renters']], '#2b9fc7')}
          ${uc('🎸', 'Rehearsal room in a shared building', [['Problem', 'Sound floods the stairwell'], ['Build', 'Lobby with two doors, absorber lining, silenced ventilation'], ['Result', 'Stairwell level falls by ≈ 20 dB compared with one door']], '#4c9a3a')}
          ${uc('🏫', 'School music practice rooms', [['Problem', 'Rooms disturb each other through corridor doors with vision panels'], ['Build', 'Sealed doors with small laminated double-glazed vision panels; continuous seals; no door grilles — ducted ventilation instead'], ['Result', 'Practice audible only faintly in the corridor']], '#c7a12b')}
          ${uc('🎬', 'Home cinema', [['Problem', 'Bass heard upstairs through a light door and ceiling'], ['Build', 'Heavy sealed door first (cheap), then the ceiling on resilient hangers'], ['Result', 'Mids and highs gone after the door; bass needs the ceiling work']], '#d14b8f')}
        </div>` },
      { h: 'Problems & solutions, and a build checklist', html: `
        <div class="table-wrap"><table><tr><th>Problem</th><th>Likely cause</th><th>Solution</th></tr>
          <tr><td>New heavy door, still hear everything</td><td>Gap under the door; frame not sealed to wall</td><td>Drop seal or threshold; pack and seal behind the architrave</td></tr>
          <tr><td>Door hard to close / springs open</td><td>Too much seal compression or uneven stop</td><td>Adjustable stops; softer bulb; a latch that pulls the door in</td></tr>
          <tr><td>Whistle of air at the door when the HVAC runs</td><td>Room has no return-air path</td><td>Add a silenced transfer duct — never leave a gap “for air”</td></tr>
          <tr><td>Window blocks voices but bass passes</td><td>Narrow gap: mass–air–mass resonance in the bass</td><td>Second pane further away; heavier glass</td></tr>
          <tr><td>Window has a “hole” around 1–3 kHz</td><td>Coincidence, identical panes</td><td>Laminated glass; different thicknesses</td></tr>
          <tr><td>Condensation between panes</td><td>Moist air trapped, no desiccant</td><td>Seal the room side fully, desiccant in the cavity, tiny breather to the dry side only if needed</td></tr>
          <tr><td>Buzz from the door on bass notes</td><td>Loose hardware or leaf resonance</td><td>Tighten; add damping layer; check the latch pulls tight</td></tr></table></div>
        ${flow([['Measure first', 'what level, to whom? (see Isolation Fundamentals)'], ['Seal', 'sealant, seals, drop seal — test with a torch'], ['Add mass', 'solid core, MDF + damping, laminated glass'], ['Double up', 'second door / second pane with a wide gap'], ['Damp', 'wool in cavities and reveals'], ['Re-test', 'pink noise outside, same position, same volume']])}
        <p>Related: <a href="#/academy/m-doors-windows">Doors &amp; Windows — the Weak Links</a> · <a href="#/academy/m-iso-basics">Isolation Fundamentals</a> · <a href="#/isolation">Soundproofing planner</a> · <a href="#/lab/isoplan">Isolation lab</a>.</p>` },
    ],
    quiz: [
      { q: 'You have a hollow door with a 10 mm gap underneath. What gives the most isolation for the least money first?', opts: ['Glue foam to the door', 'Seal the perimeter and the bottom gap', 'Add a second layer of drywall to the wall', 'Hang a curtain'], a: 1, why: 'Leaks dominate. Until they are sealed, extra mass or absorption barely matters.' },
      { q: 'Why use two panes of different thickness in a studio window?', opts: ['It looks better', 'To stagger their coincidence dips', 'To make it lighter', 'To increase reflections'], a: 1, why: 'Identical panes share the same coincidence frequency, deepening the dip.' },
      { q: 'A double-glazed unit with a 16 mm gap blocks speech well but not bass. Why?', opts: ['Glass is too heavy', 'Its mass–air–mass resonance is in the bass range', 'The glass is tilted', 'Too much damping'], a: 1, why: 'A narrow gap is a stiff air spring, so the resonance is high (≈ 150–250 Hz).' },
      { q: 'Adding a third leaf in the middle of a double wall usually…', opts: ['improves bass isolation', 'worsens bass isolation', 'has no effect', 'removes coincidence'], a: 1, why: 'Two small cavities are stiffer springs: the resonance moves up — the triple-leaf trap.' },
      { q: 'What does mineral wool in a cavity do?', opts: ['Blocks sound by its weight', 'Damps cavity resonances and softens the air spring', 'Makes the wall airtight', 'Nothing'], a: 1, why: 'It is a damper, worth a few dB — not a barrier on its own.' },
      { q: 'Best way to get about 60 dB at a doorway on a budget?', opts: ['One very thick door', 'Two sealed doors with a lined lobby', 'A door covered with foam', 'A door with a brush sweep'], a: 1, why: 'Two leaves and two seal lines in series, decoupled by an absorbent air space.' },
    ],
  };
  const i = window.LESSONS.findIndex((l) => l.id === 'm-doors-windows');
  window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L);
})();
