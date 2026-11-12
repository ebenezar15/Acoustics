/* ==========================================================================
   Master Class M18C — Acoustic hangers: hanging bass traps (absorbent-
   wrapped boards hung in a deep cavity) and isolation hangers (springs /
   rubber that carry a ceiling). Theory, sizing, build, placement.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design|result/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  /* ---------- diagrams ---------- */
  const hang = (x, y, a, len = 46) => { const r = (a * Math.PI) / 180, dx = (Math.cos(r) * len) / 2, dy = (Math.sin(r) * len) / 2; return `<line x1="${x - dx}" y1="${y - dy}" x2="${x + dx}" y2="${y + dy}" stroke="var(--c4)" stroke-width="11" opacity=".8"/><line x1="${x - dx}" y1="${y - dy}" x2="${x + dx}" y2="${y + dy}" stroke="var(--text)" stroke-width="3"/>`; };
  const SVG_TWO = `<svg class="gsvg" viewBox="0 0 700 230" role="img" aria-label="Two different things called hangers">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">One word, two different devices</text>
    <rect x="20" y="30" width="320" height="170" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
    <text x="180" y="50" text-anchor="middle" font-size="12" font-weight="700">A · Hanging bass trap</text>
    <rect x="40" y="60" width="280" height="8" fill="var(--muted)"/>
    ${[70, 110, 150, 190, 230, 270].map((x, i) => `<g class="${i % 2 ? 'pane-a' : 'pane-b'}">${hang(x, 92, 50)}</g>`).join('')}
    ${[90, 130, 170, 210, 250, 290].map((x, i) => `<g class="${i % 2 ? 'pane-b' : 'pane-a'}">${hang(x, 136, -50)}</g>`).join('')}
    <line x1="40" y1="166" x2="320" y2="166" stroke="var(--accent)" stroke-dasharray="6 4" stroke-width="2"/>
    <text x="180" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">wrapped boards in a deep cavity: absorbs bass</text>
    <rect x="360" y="30" width="320" height="170" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
    <text x="520" y="50" text-anchor="middle" font-size="12" font-weight="700">B · Isolation hanger</text>
    <rect class="pane-a" x="380" y="60" width="280" height="16" fill="var(--muted)"/>
    ${[420, 520, 620].map((x) => `<path d="M${x} 76 ${Array.from({ length: 8 }, (_, q) => `l${q % 2 ? 12 : -12} 7`).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2"/><rect x="${x - 7}" y="76" width="14" height="7" fill="var(--good)"/>`).join('')}
    <rect x="386" y="134" width="268" height="12" fill="var(--text)"/>
    <text x="520" y="166" text-anchor="middle" font-size="10" fill="var(--muted)">spring / rubber carrying a ceiling:</text>
    <text x="520" y="180" text-anchor="middle" font-size="10" fill="var(--muted)">stops vibration getting through</text>
    <text x="350" y="220" text-anchor="middle" font-size="10" fill="var(--muted)">A changes how the room sounds inside. B changes how much sound gets in or out.</text>
  </svg>`;

  const SVG_PLAN = `<svg class="gsvg" viewBox="0 0 700 250" role="img" aria-label="Plan of a hanger cavity">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Hanger cavity seen from above (rear wall of a control room)</text>
    <rect x="60" y="30" width="580" height="12" fill="var(--muted)"/><text x="350" y="26" text-anchor="middle" font-size="10" fill="var(--muted)"> </text>
    <rect x="60" y="42" width="8" height="150" fill="var(--muted)"/><rect x="632" y="42" width="8" height="150" fill="var(--muted)"/>
    ${[110, 180, 250, 320, 390, 460, 530, 600].map((x) => hang(x, 78, 48, 60)).join('')}
    ${[100, 170, 240, 310, 380, 450, 520, 590].map((x) => hang(x, 148, -48, 60)).join('')}
    <line x1="60" y1="192" x2="640" y2="192" stroke="var(--accent)" stroke-dasharray="7 4" stroke-width="2.5"/>
    <text x="350" y="208" text-anchor="middle" font-size="10" fill="var(--accent)">open fabric front (acoustically transparent)</text>
    <g class="wave-in"><path d="M250 240 q100 -18 200 0" fill="none" stroke="var(--c3)" stroke-width="2.5"/></g>
    <path d="M145 78 h36" stroke="var(--bad)" stroke-width="1.5"/><text x="163" y="116" text-anchor="middle" font-size="10" fill="var(--bad)">150–250 mm apart</text><path d="M163 82 v22" stroke="var(--bad)" stroke-dasharray="2 3"/>
    <path d="M648 42 v150" stroke="var(--text)"/><text x="654" y="120" font-size="10">depth</text><text x="654" y="134" font-size="10">0.6–1.5 m</text>
    <text x="52" y="82" text-anchor="end" font-size="10">row 1</text><text x="52" y="152" text-anchor="end" font-size="10">row 2</text>
    <text x="52" y="112" text-anchor="end" font-size="10" fill="var(--muted)">angles</text><text x="52" y="124" text-anchor="end" font-size="10" fill="var(--muted)">alternate</text>
    <text x="350" y="228" text-anchor="middle" font-size="10" fill="var(--muted)">No straight line of sight from the room to the wall; nothing touches.</text>
  </svg>`;

  const SVG_ONE = `<svg class="gsvg" viewBox="0 0 700 280" role="img" aria-label="One hanger in detail">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">One hanger (front view and section)</text>
    <rect x="60" y="30" width="330" height="14" fill="var(--muted)"/><text x="225" y="41" text-anchor="middle" font-size="10" fill="#fff">timber or steel grid fixed into structure</text>
    <line x1="160" y1="44" x2="160" y2="76" stroke="var(--text)" stroke-width="2"/><line x1="290" y1="44" x2="290" y2="76" stroke="var(--text)" stroke-width="2"/>
    <circle cx="160" cy="46" r="4" fill="var(--bad)"/><circle cx="290" cy="46" r="4" fill="var(--bad)"/>
    <g class="pane-a"><rect x="120" y="76" width="210" height="170" fill="var(--c4)" opacity=".55"/><rect x="134" y="86" width="182" height="150" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
      <text x="225" y="156" text-anchor="middle" font-size="11" font-weight="700">dense board</text><text x="225" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">12–18 mm · 6–12 kg/m²</text></g>
    <line x1="60" y1="266" x2="390" y2="266" stroke="var(--muted)" stroke-width="4"/><path d="M225 246 v20" stroke="var(--bad)" stroke-dasharray="3 3"/><text x="232" y="260" font-size="10" fill="var(--bad)">50–100 mm clear of the floor</text>
    <text x="400" y="50" font-size="10" fill="var(--bad)">① two fixing points: sways, cannot twist</text>
    <text x="400" y="68" font-size="10">② wire, cord or chain — not rigid rod</text>
    <g><rect x="470" y="96" width="56" height="150" fill="var(--c4)" opacity=".55"/><rect x="492" y="96" width="12" height="150" fill="var(--text)"/>
      <path d="M470 86 h22" stroke="var(--text)"/><text x="481" y="82" text-anchor="middle" font-size="10">wrap</text><text x="548" y="150" font-size="10">③ 25–50 mm absorbent</text><text x="548" y="164" font-size="10">on both faces</text>
      <text x="548" y="190" font-size="10">④ held by netting, staples</text><text x="548" y="204" font-size="10">into the board edge or a</text><text x="548" y="218" font-size="10">breathable fabric sleeve</text></g>
    <text x="498" y="266" text-anchor="middle" font-size="10" fill="var(--muted)">section</text>
  </svg>`;

  const SVG_CEIL = `<svg class="gsvg" viewBox="0 0 700 250" role="img" aria-label="Section of a spring-hung ceiling">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Ceiling on isolation hangers (section)</text>
    <rect x="40" y="30" width="620" height="26" fill="var(--muted)"/><text x="350" y="48" text-anchor="middle" font-size="11" fill="#fff">structural floor / joists above</text>
    <rect x="40" y="56" width="18" height="170" fill="var(--muted)" opacity=".6"/><rect x="642" y="56" width="18" height="170" fill="var(--muted)" opacity=".6"/>
    <rect x="70" y="56" width="560" height="96" fill="var(--c4)" opacity=".3"/><text x="350" y="112" text-anchor="middle" font-size="10">mineral wool in the cavity (not packed tight)</text>
    ${[140, 280, 420, 560].map((x) => `<rect x="${x - 8}" y="56" width="16" height="9" fill="var(--good)"/><path class="pane-a" d="M${x} 65 ${Array.from({ length: 8 }, (_, q) => `l${q % 2 ? 12 : -12} 9`).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>`).join('')}
    <rect x="74" y="142" width="552" height="8" fill="var(--accent2)"/><rect x="74" y="150" width="552" height="18" fill="var(--text)"/>
    <text x="350" y="186" text-anchor="middle" font-size="10">channel + 2–3 layers of board (the mass)</text>
    <circle class="hot" cx="66" cy="159" r="8" fill="var(--bad)"/><circle class="hot" cx="634" cy="159" r="8" fill="var(--bad)"/>
    <text x="66" y="206" text-anchor="middle" font-size="10" fill="var(--bad)">5–10 mm gap,</text><text x="66" y="220" text-anchor="middle" font-size="10" fill="var(--bad)">flexible sealant</text>
    <text x="634" y="206" text-anchor="middle" font-size="10" fill="var(--bad)">never touch</text><text x="634" y="220" text-anchor="middle" font-size="10" fill="var(--bad)">the walls</text>
    <text x="350" y="240" text-anchor="middle" font-size="10" fill="var(--muted)">Green = rubber element, orange = spring. Each hanger must carry 70–100 % of its rated load.</text>
  </svg>`;

  const SVG_WHERE = `<svg class="gsvg" viewBox="0 0 700 290" role="img" aria-label="Where hangers go in a control room">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Where hanging traps go in a control room (plan)</text>
    <rect x="40" y="34" width="620" height="210" fill="var(--panel2)" stroke="var(--text)" stroke-width="4"/>
    <line x1="520" y1="36" x2="520" y2="242" stroke="var(--accent)" stroke-dasharray="7 4" stroke-width="2"/>
    ${[60, 100, 140, 180, 220].map((y) => hang(552, y, 40, 40) + hang(618, y - 12, -40, 40)).join('')}
    <line x1="44" y1="74" x2="130" y2="36" stroke="var(--accent)" stroke-dasharray="7 4" stroke-width="2"/><line x1="44" y1="204" x2="130" y2="242" stroke="var(--accent)" stroke-dasharray="7 4" stroke-width="2"/>
    ${hang(68, 50, 60, 26)}${hang(68, 228, -60, 26)}
    <rect x="130" y="96" width="20" height="20" fill="var(--text)"/><rect x="130" y="162" width="20" height="20" fill="var(--text)"/>
    <circle cx="320" cy="139" r="9" fill="var(--good)"/><text x="320" y="164" text-anchor="middle" font-size="10">seat</text>
    <rect x="230" y="84" width="170" height="110" fill="none" stroke="var(--accent)" stroke-dasharray="5 5"/><text x="315" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">ceiling void above</text>
    ${[['①', 585, 139], ['②', 315, 118], ['③', 78, 139]].map(([n, x, y]) => `<circle class="hot" cx="${x}" cy="${y}" r="11" fill="var(--bad)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">${n}</text>`).join('')}
    <text x="40" y="264" font-size="10">① rear wall first: deepest cavity, behind the listener · ② ceiling void: boards hung in rows above fabric or slats</text>
    <text x="40" y="280" font-size="10">③ front corners beside flush-mounted speakers and side-wall cavities, where depth exists</text>
  </svg>`;

  const depthRow = (d) => `<tr><td>${d.toFixed(1)} m</td><td class="num">${Math.round(343 / (4 * d))} Hz</td><td class="num">≈ ${Math.round(343 / (4 * d * 1.5) / 5) * 5}–${Math.round(343 / (4 * d * 1.25) / 5) * 5} Hz</td><td>${d < 0.6 ? 'Too shallow for hangers — use tuned traps' : d < 0.9 ? 'Minimum worth building' : d < 1.3 ? 'Good: one or two rows' : 'Excellent: two or three rows'}</td></tr>`;

  const L = {
    id: 'm-hangers', n: 'M18C', track: 'master', title: 'Acoustic Hangers: Hanging Bass Traps and Isolation Hangers', level: 'Advanced', mins: 45,
    summary: 'Two devices share the name “hanger”: absorbent-wrapped boards hung in a deep cavity to soak up bass, and spring or rubber hangers that carry a ceiling so vibration cannot pass. What each does, how to size, build and place them, and how to check the result.',
    tags: ['hangers', 'hanging bass trap', 'deep cavity', 'rear wall trap', 'isolation hanger', 'spring hanger', 'suspended ceiling', 'low frequency absorption', 'static deflection'],
    sections: [
      { h: 'One word, two devices', html: `
        <p class="lead">In studio design “hanger” can mean a <b>hanging bass trap</b> — boards wrapped in absorbent and hung freely inside a deep cavity — or an <b>isolation hanger</b> — a spring or rubber element from which a ceiling is suspended. The first is room treatment; the second is sound isolation. This course covers both, starting with the bass trap.</p>
        ${SVG_TWO}
        <div class="table-wrap"><table><tr><th></th><th>Hanging bass trap</th><th>Isolation hanger</th></tr>
          <tr><td><b>Job</b></td><td>Absorb low frequencies inside the room</td><td>Stop vibration passing between structure and ceiling</td></tr>
          <tr><td><b>Made of</b></td><td>Dense boards + absorbent wrap, hung on wire or cord</td><td>Steel spring and/or rubber element in a bracket</td></tr>
          <tr><td><b>Needs</b></td><td>Depth: 0.6–1.5 m of cavity</td><td>Correct load on every hanger</td></tr>
          <tr><td><b>Found</b></td><td>Rear walls, ceiling voids and corners of heavily damped control rooms</td><td>Room-in-room ceilings, ducts, pipes</td></tr></table></div>` },
      { h: 'Hanging bass traps: what they are and where they are used', html: `
        ${SVG_PLAN}
        <p>Behind an open fabric wall sits a cavity as deep as the room can spare. Inside it hang rows of boards, each wrapped on both faces with mineral wool, felt or polyester, angled so that there is no straight path to the wall behind, and spaced so that none touches its neighbours. Bass that enters has to squeeze between and along the absorbent faces, and it pushes the boards themselves.</p>
        <div class="uc-grid">
          ${uc('⬛', 'Rear wall', [['Why', 'Deepest cavity available; behind the listener; the pressure zone of every length mode'], ['Typical', '0.8–1.5 m deep across the full width']])}
          ${uc('⬆️', 'Ceiling void', [['Why', 'Often 0.4–1 m of unused height above a fabric or slat ceiling'], ['Typical', 'Boards hung in rows across the room']], '#7a5cc7')}
          ${uc('◣', 'Corners & side cavities', [['Why', 'Wedge spaces beside flush-mounted speakers and behind splayed walls'], ['Typical', 'Short hangers filling the wedge']], '#c7772b')}
        </div>` },
      { h: 'How they work — honestly', html: `
        <p>Three effects are usually given. They act together, and how much each contributes is still argued about:</p>
        ${flow([['Depth', 'a deep cavity is a deep absorber: it reaches low'], ['Obstruction', 'no straight path: sound squeezes past absorbent faces where the air is moving'], ['Moving masses', 'the wave pushes the hanging boards; wrap and friction damp them'], ['Result', 'broad low-frequency absorption without tuning']])}
        <div class="formula"><span class="lbl">How freely a hanger swings</span>f = (1 / 2π) · √(g / L) &nbsp;→&nbsp; with L ≈ 1.3–2.5 m of drop, f ≈ 0.3–0.45 Hz</div>
        <p>That swing frequency is a hundred times lower than the lowest bass note, so at audio frequencies each board behaves as a free mass: nothing but its own weight and the damping wrap resists the push of the sound wave.</p>
        <div class="callout physics">There is no tidy design formula for hanger systems. What is known comes mostly from rooms that have been built and measured: they give deep, even low-frequency absorption when the cavity is deep and the layout is sensible. So design by <b>depth and rules of thumb</b>, then <b>measure</b> — and treat the curve in the simulator below as indicative, not a prediction.</div>` },
      { h: 'Sizing: the rules of thumb', html: `
        <div class="table-wrap"><table><tr><th>Cavity depth</th><th class="num">Quarter-wave limit c/(4·depth)</th><th class="num">Useful with hangers from roughly</th><th>Verdict</th></tr>
          ${[0.4, 0.6, 0.8, 1.0, 1.2, 1.5].map(depthRow).join('')}</table></div>
        <div class="table-wrap"><table><tr><th>Item</th><th>Rule of thumb</th><th>Why</th></tr>
          <tr><td><b>Board</b></td><td>Dense, dead material 12–18 mm: chipboard, plywood, dense fibreboard — about 6–12 kg/m²</td><td>Heavy enough to resist the wave, not so stiff that it rings</td></tr>
          <tr><td><b>Board size</b></td><td>0.3–0.6 m wide; drop = cavity height less 100–150 mm</td><td>Narrow boards angle and pack more easily</td></tr>
          <tr><td><b>Wrap</b></td><td>25–50 mm of mineral wool, felt or polyester on <b>both</b> faces</td><td>Bare boards mostly reflect</td></tr>
          <tr><td><b>Spacing</b></td><td>150–250 mm between neighbours</td><td>Closer: they touch. Wider: bass slips between</td></tr>
          <tr><td><b>Angle</b></td><td>30–60° to the wall, reversed row by row</td><td>Removes any line of sight to the wall</td></tr>
          <tr><td><b>Rows</b></td><td>1 row per ≈ 0.4–0.5 m of depth</td><td>Fill the depth, leave air between rows</td></tr>
          <tr><td><b>Clearances</b></td><td>Nothing touches: 50–100 mm to walls, floor and each other</td><td>A touching hanger is no longer a free mass</td></tr>
          <tr><td><b>Weight</b></td><td>per hanger = width × drop × (board kg/m² + wrap ≈ 2–4 kg/m²)</td><td>Fixing loads: divide by two points per hanger, then add a safety margin</td></tr></table></div>
        <p>Try it: set your cavity, then change the depth, angle and spacing and watch what the simulator says.</p>`, viz: 'hangerTrap' },
      { h: 'Building a hanger wall, step by step', html: `
        ${SVG_ONE}
        ${flow([['Grid', 'timber or steel rails fixed into joists / slab, not into board'], ['Cut', 'boards to width and drop; drill two hanging points'], ['Wrap', 'absorbent on both faces; net, staple or sleeve it'], ['Hang', 'two wires or cords per board, set the angle'], ['Check', 'push each one: it must swing and touch nothing'], ['Front', 'open fabric on a removable timber frame'], ['Measure', 'low-frequency decay before and after']])}
        <div class="callout example"><b>Worked example</b> — rear cavity 3.4 m wide × 1.0 m deep × 2.3 m high.<br>
          Two rows of eight = <b>16 hangers</b>, each 450 mm × 2.2 m of 8 kg/m² board, wrapped with 40 mm of wool on both faces, at 45° with 200 mm between them, the second row angled the other way.<br>
          Weight per hanger ≈ 0.45 × 2.2 × (8 + 3.6) ≈ 11.5 kg → about <b>185 kg</b> in total, 5.7 kg per fixing point before the safety margin.<br>
          Cut list: 16 boards 450 × 2200 mm · ≈ 32 m² of 40 mm absorbent · 32 hooks and wires · two ceiling rails 3.4 m · fabric frame 3.4 × 2.3 m.</div>
        <div class="callout safety">This is a heavy load hung overhead. Fix the grid into structure (joists, slab or a steel frame), use rated hooks, wire and fixings with a generous safety factor, and have the load checked if the ceiling is not obviously capable. Wear a mask and gloves when cutting and wrapping mineral wool, contain loose fibres with a fabric sleeve, and choose absorbent, boards and facing fabric that meet your local fire requirements.</div>
        <p>Make the fabric front removable: you will want to look inside after the first measurement, and again every few years.</p>` },
      { h: 'Placement: where, in what order, and what not to do', html: `
        ${SVG_WHERE}
        <ol><li><b>Rear wall first.</b> It is where length modes have their pressure maximum, it is behind the listener, and it is usually where depth can be spared.</li>
        <li><b>Ceiling void second</b> — boards hung in rows above an open fabric or slatted ceiling.</li>
        <li><b>Corners and side cavities</b> wherever the geometry leaves a deep wedge.</li></ol>
        <p><b>Finish the front for the mids and highs:</b> hangers do most for the bass. Put 50–100 mm of porous absorber just behind the fabric if you want the surface dead across the band, or a slatted face if you want to keep some life.</p>
        <div class="callout warn"><b>What not to do.</b> Hangers in a 200 mm cavity (use a membrane or tuned trap instead) · bare, unwrapped boards · packing the cavity solid so nothing can move · boards touching each other or the wall · hanging from plasterboard · forgetting access.</div>` },
      { h: 'Effects, and how to verify them', html: `
        <div class="table-wrap"><table><tr><th>What you should see</th><th>How to check</th></tr>
          <tr><td>Shorter low-frequency decay (waterfall ridges die sooner)</td><td>Measure at the seat before and after; compare decay times at the modal frequencies</td></tr>
          <tr><td>Smaller peaks <i>and</i> shallower dips, over a wider listening area</td><td>Measure at three or four positions around the seat</td></tr>
          <tr><td>Bass notes more even in level</td><td>Slow sine sweep or bass-heavy music at a steady level</td></tr>
          <tr><td>No change above a few hundred hertz unless you added a porous front</td><td>RT per octave band</td></tr></table></div>
        <div class="table-wrap"><table><tr><th>Alternative</th><th>Depth needed for ≈ 50–60 Hz</th><th>Character</th></tr>
          <tr><td><b>Hangers</b></td><td>0.9–1.5 m</td><td>Broadband, untuned, forgiving</td></tr>
          <tr><td>Solid porous fill</td><td>similar depth</td><td>Simpler; uses far more absorbent; can over-damp the highs</td></tr>
          <tr><td>Membrane traps</td><td>0.15–0.35 m</td><td>Narrower band; must be tuned</td></tr>
          <tr><td>Carbon-assisted traps</td><td>0.15–0.2 m</td><td>See <a href="#/academy/m-carbon">Activated Carbon</a>; needs dry conditions</td></tr></table></div>
        <p>If you do not have the depth, hangers are the wrong tool. See <a href="#/academy/m-treat-designs">Room Treatment Designs</a> and <a href="#/academy/modes-treat">Treating Room Modes</a> for the compact options.</p>` },
      { h: 'Isolation hangers: carrying a ceiling on springs', html: `
        ${SVG_CEIL}
        <p>The other kind of hanger is part of the building shell. A heavy ceiling hung on springs or rubber is a <b>mass on a spring</b>: vibration in the structure above — footsteps, a neighbour’s music, your own bass going the other way — is passed on only below and around the system’s resonance, and is increasingly blocked above it.</p>
        <div class="formula"><span class="lbl">Resonance from static deflection</span>f<sub>n</sub> ≈ 15.8 / √(deflection in mm) &nbsp;·&nbsp; isolation starts above √2 · f<sub>n</sub></div>
        <div class="table-wrap"><table><tr><th>Hanger</th><th>Typical deflection</th><th>Resonance</th><th>Good for</th></tr>
          <tr><td>Rigid channel on joists</td><td>none</td><td>—</td><td>Nothing: no isolation</td></tr>
          <tr><td>Rubber / neoprene hanger or clip</td><td>≈ 3–6 mm</td><td>≈ 8–13 Hz (rubber is stiffer when moving)</td><td>Speech, TV, general music</td></tr>
          <tr><td>Spring hanger</td><td>≈ 20–25 mm or more</td><td>≈ 3–4 Hz</td><td>Drums, subwoofers, cinema, footsteps</td></tr>
          <tr><td>Spring + rubber</td><td>≈ 25 mm</td><td>≈ 3 Hz</td><td>As springs, plus high-frequency blocking through the coil</td></tr></table></div>
        <p>Two more things must be right: each hanger must carry <b>70–100 % of its rated load</b> (too little and it does not compress; too much and it bottoms out), and the ceiling’s resonance on the trapped air must also be low — more mass or a deeper cavity.</p>`, viz: 'isoHanger' },
      { h: 'Selecting and laying out isolation hangers', html: `
        ${flow([['Weigh the ceiling', 'board layers + framing ≈ 12–13 kg/m² per 15 mm layer, + 4 kg/m²'], ['Choose a grid', '0.9–1.2 m each way is typical'], ['Load per hanger', 'mass per m² × grid area'], ['Pick the rating', 'manufacturer’s chart: that load at the deflection you want'], ['Perimeter', 'extra hangers near walls; 5–10 mm sealed gap'], ['Services', 'flexible connections only — no rigid ties'], ['Inspect', 'every hanger compressed, nothing touching']])}
        <div class="callout example">Two layers of 15 mm board ≈ 30 kg/m². On a 1.2 m grid each hanger carries ≈ 43 kg; a 16 m² ceiling needs about 12. Choose the hanger whose chart shows the deflection you want at 43 kg — not simply “a 50 kg hanger”.</div>
        <ul><li><b>Lights, sprinklers, grilles and ducts</b> must not bridge the ceiling to the structure: use flexible duct connectors, flexible conduit, oversized sleeves packed with wool and sealed, and fittings carried by the hung ceiling itself.</li>
        <li><b>One screw through the board into a joist</b> short-circuits every hanger in the room. Mark joist lines and keep fixings short.</li>
        <li>Lay wool in the cavity loosely; do not jam it between ceiling and structure.</li></ul>
        <div class="callout safety">A hung ceiling is a structural element over people’s heads. Use hangers with a fail-safe (captive) design, follow the manufacturer’s load tables, add seismic restraint where your region requires it, and make sure the build-up meets the fire rating your building code asks for.</div>` },
      { h: 'Hanging other things', html: `
        <div class="uc-grid">
          ${uc('🌬️', 'Ducts and pipes', [['Why', 'Fans and pumps shake the pipework, which shakes the building'], ['Do', 'Spring or rubber hangers for the first 10–15 m from any machine; flexible connectors at the unit']])}
          ${uc('☁️', 'Acoustic clouds and baffles', [['Why the gap helps', 'Sound reaches both faces, and the absorber sits out where the air is moving'], ['Do', 'Hang 100–300 mm below the ceiling on wire or chain; fix into structure']], '#7a5cc7')}
          ${uc('🔊', 'Flown loudspeakers and screens', [['Rule', 'Rated rigging points and hardware only, installed by a competent person'], ['Do', 'Secondary safety wire on everything overhead; isolation mounts where the speaker would shake a light ceiling']], '#b33')}
          ${uc('💡', 'Light fittings', [['Why', 'Loose fittings buzz on bass notes'], ['Do', 'Carry them on the hung ceiling or their own wires; flexible cable only']], '#c7a12b')}
        </div>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎚️', 'Small control room, 1 m to spare at the back', [['Problem', 'Long bass decay; seat close to the rear wall'], ['Design', 'Full-width hanger cavity, two rows, 100 mm porous layer behind the fabric'], ['Result', 'Decay below 100 Hz roughly halved; smoother bass across the couch']])}
          ${uc('⬆️', 'Mix room with a 600 mm ceiling void', [['Problem', 'No wall depth available'], ['Design', 'Rows of short hangers above a slatted ceiling; cloud over the seat'], ['Result', 'Height modes tamed without losing floor area']], '#7a5cc7')}
          ${uc('🥁', 'Drum room in a flat', [['Problem', 'Neighbour above hears the kick'], ['Design', 'Three layers of board on spring hangers, 250 mm wool-filled cavity, sealed perimeter'], ['Result', 'Large improvement in the bass; walls and floor treated to match']], '#c7772b')}
          ${uc('🎬', 'Home cinema under a bedroom', [['Problem', 'Subwoofer rumble upstairs'], ['Design', 'Spring-hung double-layer ceiling; ducts on isolation hangers'], ['Result', 'Film at night without complaints']], '#2b9fc7')}
          ${uc('🎸', 'Rehearsal room', [['Problem', 'Boomy and loud'], ['Design', 'Hanger cavity along one long wall behind fabric; rubber-hung ceiling'], ['Result', 'Tighter low end, lower level in the corridor']], '#4c9a3a')}
          ${uc('📏', 'Room too shallow for hangers', [['Problem', 'Only 250 mm available'], ['Do instead', 'Membrane or carbon-assisted traps on the rear wall and corner porous traps'], ['Why', 'Hangers below ≈ 0.6 m are little better than plain absorber']], '#b33')}
        </div>` },
      { h: 'Myths, problems and solutions', html: `
        ${myth([
          ['“Hangers are tuned to a frequency.”', 'They are untuned and broadband. The depth of the cavity sets how low they reach.'],
          ['“Any boards hung in a gap will do.”', 'Unwrapped or touching boards mostly reflect or rattle. Wrap, angle and clearance all matter.'],
          ['“More hangers, packed tighter, absorb more.”', 'Air has to move between them. A cavity packed solid behaves like a plain — and expensive — absorber.'],
          ['“Hangers will also stop sound getting out.”', 'They are treatment. Isolation comes from the heavy, airtight shell behind them.'],
          ['“Any spring hanger isolates.”', 'Only when it is loaded into its working range and nothing bridges the ceiling to the structure.'],
        ])}
        <div class="table-wrap"><table><tr><th>Problem</th><th>Likely cause</th><th>Solution</th></tr>
          <tr><td>Little change in bass decay</td><td>Cavity too shallow; boards unwrapped; too few rows</td><td>Deepen, wrap, add a row — or switch to tuned traps</td></tr>
          <tr><td>Rattle or knock on loud bass</td><td>Hangers touching each other or the wall</td><td>Re-space; shorten; two-point suspension</td></tr>
          <tr><td>Room now too dead in the mids</td><td>Fabric front with thick porous layer everywhere</td><td>Slatted or part-reflective face in front of the cavity</td></tr>
          <tr><td>Fabric front bulges or buzzes</td><td>Frame too light; fabric loose</td><td>Stiffer frame, tension the fabric, keep hangers clear of it</td></tr>
          <tr><td>Hung ceiling does nothing for footsteps</td><td>Rigid bridge: screw into a joist, duct, light fitting, perimeter contact</td><td>Find and cut the bridge; seal the perimeter gap flexibly</td></tr>
          <tr><td>Ceiling “bounces” or sags unevenly</td><td>Hangers over- or under-loaded</td><td>Re-space or change ratings so each carries 70–100 %</td></tr></table></div>` },
      { h: 'Checklist', html: `
        <div class="grid g2">
          <div class="callout mentor" style="margin:0"><b>Hanging bass trap</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Cavity ≥ 0.6 m, ideally ≥ 1 m</li><li>Dense boards, wrapped both faces</li><li>150–250 mm apart, 30–60°, rows alternating</li><li>Two-point suspension; nothing touches</li><li>Grid fixed into structure; load checked</li><li>Removable open-fabric front</li><li>Measured before and after</li></ul></div>
          <div class="callout mentor" style="margin:0"><b>Isolation hangers</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Ceiling mass calculated</li><li>Load per hanger within 70–100 % of rating</li><li>Springs for bass-heavy sources</li><li>Wool in the cavity, loosely</li><li>5–10 mm sealed perimeter gap</li><li>No rigid services or screws bridging</li><li>Fail-safe hangers; fire and seismic rules checked</li></ul></div>
        </div>
        <p>Related: <a href="#/academy/m-walls">Walls &amp; Room-in-Room</a> · <a href="#/academy/m-floors">Floating Floors</a> · <a href="#/academy/m-hvac">HVAC</a> · <a href="#/lab/hangers">Hangers &amp; Waveguides lab</a>.</p>` },
    ],
    quiz: [
      { q: 'What mainly sets how low a hanging bass trap works?', opts: ['The colour of the fabric', 'The depth of the cavity', 'The tuning of each board', 'The number of screws'], a: 1, why: 'Hangers are untuned; depth decides the reach. Below about 0.6 m they are little better than plain absorber.' },
      { q: 'Why are the boards wrapped in absorbent?', opts: ['To make them heavier', 'So air rubbing past and the moving board lose energy', 'To stop them swinging', 'For looks'], a: 1, why: 'Bare boards mostly reflect; the wrap provides the friction and damping.' },
      { q: 'A hanger with a 2 m drop swings at about 0.35 Hz. What does that tell you?', opts: ['It is tuned to 0.35 Hz bass', 'It behaves as a free mass at all audio frequencies', 'It will rattle', 'It is too heavy'], a: 1, why: 'The pendulum frequency is far below audio, so only the board’s mass and damping resist the sound wave.' },
      { q: 'A ceiling weighs 30 kg/m² and is hung on a 1.2 m grid. Load per isolation hanger?', opts: ['About 12 kg', 'About 25 kg', 'About 43 kg', 'About 90 kg'], a: 2, why: '30 × 1.2 × 1.2 ≈ 43 kg — choose a hanger that gives the wanted deflection at that load.' },
      { q: 'A spring-hung ceiling gives no improvement. Most likely reason?', opts: ['Springs are too soft', 'A rigid bridge: a screw, duct or the perimeter touching the structure', 'Too much wool', 'Wrong paint'], a: 1, why: 'One rigid connection short-circuits every hanger.' },
    ],
  };
  const i = window.LESSONS.findIndex((l) => l.id === 'm-redirect');
  window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L);

  const pointer = { h: 'When you have depth to spare: hanging bass traps', html: `
    <p>Where 0.6–1.5 m of depth is available — typically the rear wall or a ceiling void — rows of absorbent-wrapped boards hung freely behind a fabric front give broad, untuned low-frequency absorption. Depth sets how low they reach; nothing may touch. Sizing, build steps and placement: <a href="#/academy/m-hangers">Acoustic Hangers</a>.</p>`, viz: 'hangerTrap' };
  ['m-treat-designs', 'modes-treat'].forEach((id) => { const l = window.LESSONS.find((x) => x.id === id); if (l) l.sections.push(pointer); });
})();
