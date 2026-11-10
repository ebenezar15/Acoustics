/* ==========================================================================
   Academy — Studio Design Master Class, part 2 (M7–M12):
   isolation fundamentals, walls, doors & windows, floating floors,
   large-room and small-room acoustics.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${k === 'Fix' || k === 'Proper fix' || k === 'Solution' ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const table = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const drawing = (fn) => (host) => { const d = document.createElement('div'); d.className = 'drawing'; d.innerHTML = fn(); host.appendChild(d); };
  const push = (L) => window.LESSONS.push(L);

  /* ======================================================================
     M7 — Sound isolation fundamentals
     ====================================================================== */
  const SVG_ISO_VS_TREAT = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Isolation versus treatment">
    <text x="320" y="20" text-anchor="middle" font-size="12" font-weight="700">Two different jobs: keep sound in/out vs. make the room sound good</text>
    <rect x="20" y="40" width="290" height="160" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
    <rect x="160" y="50" width="22" height="140" fill="var(--muted)"/><rect x="186" y="50" width="22" height="140" fill="var(--muted)"/>
    <circle cx="70" cy="120" r="14" fill="var(--accent)"/><path d="M90 105 q15 15 0 30 M100 95 q25 25 0 50" stroke="var(--accent)" fill="none" stroke-width="2"/>
    <path d="M215 120 h60" stroke="var(--bad)" stroke-width="2" stroke-dasharray="3 4"/><text x="245" y="112" text-anchor="middle" font-size="10" fill="var(--bad)">tiny leak</text>
    <text x="165" y="215" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent)">ISOLATION: mass + airtight + decoupled</text>
    <rect x="330" y="40" width="290" height="160" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
    <rect x="590" y="50" width="20" height="140" fill="var(--c4)" opacity=".8"/><rect x="340" y="50" width="16" height="140" fill="var(--c4)" opacity=".8"/>
    <circle cx="420" cy="120" r="14" fill="var(--accent)"/><path d="M440 110 L585 80 M440 120 L585 120 M440 130 L585 160" stroke="var(--accent)" stroke-width="2"/>
    <path d="M585 80 L540 74 M585 160 L545 168" stroke="var(--accent)" stroke-width="1.5" opacity=".35"/>
    <text x="475" y="215" text-anchor="middle" font-size="11" font-weight="700" fill="var(--c4)">TREATMENT: absorb, diffuse, shape</text>
  </svg>`;
  const SVG_REQ = `<svg class="gsvg" viewBox="0 0 640 200" role="img" aria-label="Working out the isolation requirement">
    <text x="320" y="20" text-anchor="middle" font-size="12" font-weight="700">Requirement = source level − allowed level (+ safety margin)</text>
    <rect x="40" y="40" width="70" height="140" fill="var(--bad)" opacity=".7"/><text x="75" y="34" text-anchor="middle" font-size="11">drums ≈ 110 dB</text>
    <rect x="530" y="150" width="70" height="30" fill="var(--good)" opacity=".7"/><text x="565" y="144" text-anchor="middle" font-size="11">bedroom ≈ 25 dB</text>
    <path d="M110 45 H520" stroke="var(--muted)" stroke-dasharray="4 4"/><path d="M520 150 H600" stroke="var(--muted)" stroke-dasharray="4 4"/>
    <path d="M320 48 V146" stroke="var(--accent)" stroke-width="3" marker-end="url(#m7a)"/><defs><marker id="m7a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>
    <text x="330" y="100" font-size="13" font-weight="700" fill="var(--accent)">≈ 85 dB of isolation needed</text>
    <text x="330" y="118" font-size="10" fill="var(--muted)">— and at 63 Hz, not just at mid frequencies</text>
  </svg>`;
  push({
    id: 'm-iso-basics', n: 'M7', track: 'master', title: 'Sound Isolation Fundamentals: Requirements, Base Noise Levels & Testing', level: 'Core', mins: 40,
    summary: 'Isolation versus treatment, the three rules of soundproofing, how to work out what a project actually needs, reference background levels, and why lab ratings drop on site.',
    tags: ['sound isolation', 'soundproofing', 'mass', 'airtightness', 'decoupling', 'NC', 'NR', 'STC', 'ASTC', 'E90', 'E336', 'field testing'],
    sections: [
      { h: 'Isolation is not treatment', html: `
        <p class="lead">“Soundproofing” means stopping sound getting <b>through</b> the building. “Acoustic treatment” means controlling how sound behaves <b>inside</b> a room. They use different materials, different physics and different budgets.</p>
        ${SVG_ISO_VS_TREAT}
        ${myth([
          ['“Foam on the walls will keep the neighbours happy.”', 'Foam weighs almost nothing and is full of air holes. It changes isolation by about 0–1 dB.'],
          ['“Thick insulation in the wall is soundproofing.”', 'Insulation helps <i>inside</i> a cavity between two leaves. On its own, in the open, it isolates almost nothing.'],
          ['“One really good wall is enough.”', 'Sound takes every path — floor, ceiling, doors, ducts, back-to-back sockets. The weakest path sets the result.'],
        ])}` },
      { h: 'The three rules (and a fourth)', html: `
        ${flow([['Mass', 'heavy layers are hard to shake'], ['Airtightness', 'where air goes, sound goes'], ['Decoupling', 'separate leaves, no rigid bridges'], ['Damping', 'turn panel vibration into heat'], ['Absorption in cavities', 'stops the air spring ringing']])}
        <div class="callout data"><b>Rules of thumb</b><ul style="margin:.3em 0 0;padding-left:18px">
          <li>Doubling the mass of a single wall: about <b>+6 dB</b> (in practice often 4–5 dB).</li>
          <li>A hole of just <b>0.1 %</b> of the wall area caps a 60 dB wall near <b>30 dB</b>.</li>
          <li>Two decoupled leaves with insulation between them beat one leaf of the same total mass — <b>above</b> their mass–air–mass resonance.</li>
          <li>Low frequencies are always the hardest: bass needs mass, depth and decoupling.</li></ul></div>` },
      { h: 'How much isolation do you need?', html: `
        <p>Every project is different. The method is always the same: find how loud the source is, decide how quiet the neighbour (or your recording room) must be, and the difference is the isolation you must build — <b>in every frequency band</b>.</p>
        ${SVG_REQ}
        ${flow([['Source', 'what is played, how loud, when'], ['Receiver', 'who listens: bedroom at night? another studio?'], ['Background', 'measure the existing ambient level'], ['Difference', 'per octave, especially 63–125 Hz'], ['Margin', 'add 5–10 dB for flanking and workmanship']])}
        <p>Try it below: pick a source and a receiver, and see which constructions clear every band.</p>`, viz: 'isoRequirement' },
      { h: 'Base noise levels — reference targets', html: `
        <p>Background noise is described by <b>NC</b> (noise criteria, North America) or <b>NR</b> (noise rating, Europe) curves — a single number that limits each octave band — or simply by dBA. Lower is quieter.</p>
        ${table(['Space', 'Target', 'Roughly', 'Why'], [
          ['Voice-over / ADR booth', 'NC 10–15', '≈ 20 dBA', 'Quiet voices are recorded with high gain'],
          ['Recording / tracking room', 'NC 15–20', '≈ 25 dBA', 'Acoustic instruments, room mics'],
          ['Control room', 'NC 20–25', '≈ 30 dBA', 'Must hear reverb tails and fades'],
          ['Bedroom at night', 'NC 20–25', '25–30 dBA', 'Sleep disturbance'],
          ['Living room / home office', 'NC 30–35', '35–40 dBA', 'Comfort'],
          ['Open office', 'NC 35–45', '40–50 dBA', 'Speech privacy'],
          ['Busy street outside', '—', '60–75 dBA', 'Typical daytime road traffic'],
        ])}
        <div class="callout mentor"><b>Do an ambient survey before you design.</b> A cheap sound-level meter app is enough to start: measure at the quietest and busiest times (night, rush hour, weekend), note trains, aircraft, HVAC plant and buses. The quietest time is what your recordings must survive; the loudest is what must not get in.</div>` },
      { h: 'Laboratory tests vs field tests', html: `
        ${table(['', 'Laboratory', 'Field (on site)'], [
          ['Standards', 'ASTM E90 · ISO 10140', 'ASTM E336 · ISO 16283'],
          ['Single number', 'STC · R<sub>w</sub>', 'ASTC, NIC, NNIC · D<sub>nT,w</sub>, R′<sub>w</sub>'],
          ['What it measures', 'Only the test wall — flanking suppressed', 'Everything: wall + floor + ceiling + doors + leaks'],
          ['Typical result', 'The best case', 'Usually <b>5–10 dB lower</b>'],
        ])}
        <p>The lab mounts a sample in an opening between two massive, separately founded rooms, so the only path is through the sample. On site, sound also travels along floors, ceilings, side walls and services (<b>flanking</b>), and real workmanship leaves gaps. Design with lab data, then subtract a realistic margin.</p>
        <div class="callout warn">STC is calculated from 125 Hz to 4 kHz only. Two walls with the same STC can differ by 10 dB at 63 Hz — the band that matters for bass, drums and home cinema. Ask for the full third-octave curve.</div>` },
      { h: 'Real-world situations', html: `<div class="uc-grid">
          ${uc('🏠', 'Mixing in a flat', [['Source', '85 dB mixing, bass to 40 Hz'], ['Receiver', 'Neighbour’s bedroom, NC 25'], ['Need', '≈ 60 dB at 63 Hz'], ['Solution', 'Independent inner room or limit level & use headphones at night']])}
          ${uc('🥁', 'Drum room in a house', [['Source', '110–115 dB peaks'], ['Receiver', 'Family upstairs'], ['Need', '≈ 80–85 dB'], ['Solution', 'Floated room-in-room + sound-lock door; often a garden building is cheaper']], '#c7772b')}
          ${uc('🎙️', 'Voice-over booth by a road', [['Source', 'Traffic 70 dBA, buses at 63 Hz'], ['Receiver', 'Booth NC 15'], ['Need', '≈ 55 dB including low end'], ['Solution', 'Room-in-room booth, secondary glazing, silenced ventilation']], '#2b9fc7')}
          ${uc('🎬', 'Home cinema', [['Source', '105 dB with subs'], ['Receiver', 'Rest of the house, NC 30'], ['Need', '≈ 70 dB at 31–63 Hz'], ['Solution', 'Decoupled walls & ceiling, seal every penetration, isolate subs from the floor']], '#7a5cc7')}
        </div>` },
      { h: 'Problems & solutions', html: table(['Problem', 'Likely cause', 'Solution'], [
          ['Great wall, still leaking', 'Door, outlet boxes, ducts, ceiling void flanking', 'Find the weakest link first; seal; treat the path'],
          ['Mids fine, bass gets through', 'Light construction, cavity too shallow', 'More mass, deeper cavity, decouple, isolate subwoofers'],
          ['Measured result far below lab rating', 'Flanking & workmanship', 'Continuous inner leaf, acoustic sealant, independent ceiling'],
          ['Noise from plant & HVAC', 'Structure-borne vibration, duct crosstalk', 'Isolation mounts, silencers, lined ducts'],
        ]) },
      { h: 'Apply it', html: `
        ${flow([['Survey', 'ambient levels day & night'], ['List sources', 'levels & spectra'], ['Set targets', 'NC per room'], ['Compute need', 'per octave + 5–10 dB'], ['Pick constructions', 'wall, floor, ceiling, doors'], ['Detail every path', 'services, ducts, joints']])}
        <p>Next: <a href="#/academy/m-walls">Walls</a> · <a href="#/academy/m-doors-windows">Doors & windows</a> · <a href="#/academy/m-floors">Floating floors</a> · try the <a href="#/isolation">Soundproofing planner</a>.</p>` },
    ],
    quiz: [
      { q: 'Which of these is soundproofing (isolation), not treatment?', opts: ['Foam panels on the walls', 'A sealed, decoupled second wall', 'A ceiling cloud', 'A diffuser'], a: 1, why: 'Isolation needs mass, airtightness and decoupling.' },
      { q: 'A drum kit makes 110 dB; the neighbour must hear no more than 25 dB. Roughly how much isolation is needed?', opts: ['25 dB', '45 dB', '85 dB plus margin', '135 dB'], a: 2, why: 'Requirement = source − allowed level, plus a margin for flanking.' },
      { q: 'Why is a field result usually lower than the lab STC?', opts: ['Labs cheat', 'Flanking paths and workmanship', 'Temperature', 'Microphones differ'], a: 1, why: 'On site sound travels around the wall too, and real joints leak.' },
      { q: 'A typical target for a voice-over booth is…', opts: ['NC 10–15', 'NC 35', 'NC 45', '60 dBA'], a: 0, why: 'Quiet voices need very low background noise.' },
      { q: 'Why can STC mislead for bass-heavy sources?', opts: ['It ignores frequencies below 125 Hz', 'It only covers bass', 'It is measured outdoors', 'It uses A-weighting'], a: 0, why: 'STC is computed from 125 Hz to 4 kHz.' },
    ],
  });

  /* ======================================================================
     M8 — Walls
     ====================================================================== */
  const SVG_WALLS = `<svg class="gsvg" viewBox="0 0 640 230" role="img" aria-label="Single, double and room-in-room walls">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">From one leaf to two independent leaves</text>
    ${[['Single stud wall', 40, 'wood'], ['Staggered / clips', 250, 'clips'], ['Room-in-room', 460, 'none']].map(([t, x, k]) => `
      <text x="${x + 70}" y="44" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <rect x="${x + 20}" y="56" width="12" height="140" fill="var(--muted)"/><rect x="${x + 108}" y="56" width="12" height="140" fill="var(--muted)"/>
      <rect x="${x + 34}" y="60" width="72" height="132" fill="var(--c4)" opacity=".25"/>
      ${k === 'wood' ? [70, 110, 150].map((y) => `<rect x="${x + 32}" y="${y}" width="76" height="14" fill="var(--warn)"/>`).join('') : ''}
      ${k === 'clips' ? [80, 130, 175].map((y) => `<rect x="${x + 90}" y="${y}" width="18" height="8" fill="var(--warn)"/><circle cx="${x + 94}" cy="${y + 4}" r="5" fill="var(--good)"/>`).join('') : ''}
      ${k === 'none' ? `<line x1="${x + 70}" y1="58" x2="${x + 70}" y2="194" stroke="var(--good)" stroke-dasharray="4 4"/>` : ''}
      <text x="${x + 70}" y="214" text-anchor="middle" font-size="10" fill="var(--muted)">${k === 'wood' ? 'studs bridge both leaves' : k === 'clips' ? 'resilient connection' : 'no connection at all'}</text>`).join('')}
  </svg>`;
  const SVG_MAM = `<svg class="gsvg" viewBox="0 0 640 210" role="img" aria-label="Mass-air-mass resonance">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Two leaves + air = a mass–spring–mass system</text>
    <rect x="160" y="40" width="26" height="130" fill="var(--muted)"/><rect x="454" y="40" width="26" height="130" fill="var(--muted)"/>
    <path d="M190 105 ${Array.from({ length: 20 }, (_, i) => `l13 ${i % 2 ? 16 : -16}`).join(' ')} L450 105" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
    <text x="173" y="186" text-anchor="middle" font-size="10">mass 1</text><text x="467" y="186" text-anchor="middle" font-size="10">mass 2</text><text x="320" y="70" text-anchor="middle" font-size="10" fill="var(--accent)">air in the cavity = spring</text>
    <text x="320" y="202" text-anchor="middle" font-size="11" fill="var(--bad)">Below f₀ the wall acts as one leaf; at f₀ it is WORSE; above it improves fast</text>
  </svg>`;
  push({
    id: 'm-walls', n: 'M8', track: 'master', title: 'Walls: Single, Double & Room-in-Room', level: 'Core', mins: 40,
    summary: 'How single walls follow the mass law and lose out at coincidence, why double walls do better above their resonance, what bridges them, and how room-in-room construction reaches professional isolation.',
    tags: ['mass law', 'coincidence', 'double wall', 'mass-air-mass', 'resilient channel', 'isolation clips', 'room-in-room', 'flanking', 'STC'],
    sections: [
      { h: 'Single walls: the mass law', html: `
        <p class="lead">A single leaf — a concrete wall, a sheet of glass, one layer of drywall — isolates because sound has to <b>shake its mass</b>. Heavier walls are harder to shake, and high frequencies are harder to follow than low ones.</p>
        <div class="formula"><span class="lbl">Mass law (approximate, random incidence)</span>TL ≈ 20·log₁₀(m·f) − 47 dB &nbsp;&nbsp;(m in kg/m², f in Hz)</div>
        <ul><li>Double the mass → about <b>+6 dB</b>. Double the frequency → about <b>+6 dB</b>.</li>
        <li><b>Coincidence dip</b>: at one frequency, bending waves in the panel match the sound in the air and the wall becomes almost transparent. Thin stiff panels (glass, drywall) dip at 2–3 kHz; thick concrete dips around 100–200 Hz.</li>
        <li>Damping (laminated glass, viscoelastic compounds between boards) fills the dip.</li></ul>`, viz: 'massLaw' },
      { h: 'Double walls and the air spring', html: `
        ${SVG_MAM}
        <p>Two leaves separated by air behave like two masses joined by a spring. Below the resonance frequency f₀ they move together like one wall; <b>at f₀ they are worse</b> than one leaf; above f₀ isolation climbs very quickly — about 18 dB per octave.</p>
        <div class="formula"><span class="lbl">Mass–air–mass resonance (with insulation in the cavity)</span>f₀ ≈ 50·√( (m₁ + m₂) / (m₁·m₂·d) ) &nbsp;&nbsp;(m in kg/m², d in m)</div>
        <div class="callout data"><b>Design rule:</b> push f₀ <b>below the lowest frequency you care about</b> — ideally under 40–50 Hz for music. That means heavy leaves and a deep cavity: two layers of 16 mm gypsum each side with a 150–200 mm filled cavity gives f₀ ≈ 30–40 Hz.</div>
        <p>Fill the cavity with soft mineral or glass wool (not rigid board): it damps cavity resonances and lowers f₀ by about 15 %.</p>` },
      { h: 'Bridging: what connects the leaves', html: `
        ${SVG_WALLS}
        ${table(['Connection', 'Typical effect', 'Use when'], [
          ['Shared timber studs', 'Leaves strongly coupled — weakest option', 'Ordinary partitions only'],
          ['Light steel studs', 'Some flexibility, +3–5 dB vs timber', 'Commercial partitions'],
          ['Resilient channel', '+5–10 dB if installed perfectly; easily short-circuited by one screw', 'Budget upgrades, ceilings'],
          ['Isolation clips + hat channel', 'Reliable +8–12 dB, good at low frequencies', 'Upgrading existing walls and ceilings'],
          ['Staggered studs / separate frames', 'Near-independent leaves', 'New construction'],
          ['Independent room-in-room', 'Best possible — leaves only meet at the floor (and that can float too)', 'Studios, cinemas, drums'],
        ])}
        <div class="callout warn"><b>The triple-leaf trap.</b> Adding a third layer in the middle (e.g. lining an existing wall with a new stud wall but leaving the old board in the cavity) creates two small cavities with a <b>higher</b> resonance. A 2-leaf wall with the same total mass and depth usually wins. Remove the middle leaf or design around it.</div>` },
      { h: 'Room-in-room construction', html: `
        <p>The professional answer: a complete inner box — walls, ceiling and often floor — that stands on its own and touches the building only through isolators. The outer shell (masonry or the existing building) is leaf one; the inner room is leaf two.</p>
        <ul><li>Inner walls on their own track/sole plate, ideally on a floated floor or rubber strip.</li><li>Ceiling joists span inner wall to inner wall — never hung rigidly from the building.</li><li>A continuous 25–50 mm air gap all round; services pass through flexible, sealed sleeves.</li></ul>`, viz: drawing(() => DR.hybridWall({ base: 'masonry', isoGap: 0.03, stud: 0.09, leafLayers: 2, airTreat: 0.05, treat: 0.1, label: 'room-in-room' })) },
      { h: 'Laboratory examples — typical ratings', html: `
        ${table(['Construction', 'STC (lab, typical)', 'Low-frequency behaviour'], [
          ['1 × 12.5 mm gypsum each side, 90 mm timber studs, empty', '33–35', 'Poor'],
          ['Same, cavity filled', '36–39', 'Poor'],
          ['2 × 16 mm each side, steel studs, filled', '50–55', 'Fair'],
          ['2 × 16 mm each side, isolation clips, filled', '55–60', 'Good'],
          ['Double stud, 2 + 2 layers, 200 mm filled', '60–65', 'Good'],
          ['200 mm dense concrete', '55–58', 'Good (mass)'],
          ['Concrete + independent 2-layer inner room', '70+', 'Very good'],
        ])}
        <p class="small muted">Representative ranges for orientation; published test reports vary with board density, stud gauge, spacing and sealing. Always design from a full test report of the construction you will actually build.</p>` },
      { h: 'Flanking & sealing details', html: `
        <div class="uc-grid">
          ${uc('🔌', 'Electrical outlets', [['Problem', 'Back-to-back boxes = a hole through the wall'], ['Fix', 'Offset boxes by a stud bay, use putty pads or sealed back-boxes']])}
          ${uc('🧱', 'Head and base of wall', [['Problem', 'Gaps at floor and ceiling junctions'], ['Fix', 'Two beads of non-hardening acoustic sealant each layer; stagger board joints']])}
          ${uc('🌬️', 'Ceiling void & ducts', [['Problem', 'Sound goes over the wall via a shared void'], ['Fix', 'Run the wall to the structure, or add a void barrier; silencers on ducts']])}
          ${uc('🚪', 'Doors & windows', [['Problem', 'Weakest element sets the result'], ['Fix', 'See <a href="#/academy/m-doors-windows">Doors & windows</a>']])}
        </div>` },
      { h: 'Problems & solutions', html: table(['Problem', 'Cause', 'Solution'], [
          ['New stud wall barely better than old', 'Rigid studs bridge the leaves; empty cavity', 'Clips/independent frames, fill cavity, add mass'],
          ['Bass passes, mids fine', 'f₀ too high (light leaves, shallow cavity)', 'More layers, deeper cavity'],
          ['Resilient channel didn’t help', 'Screws into studs short-circuit it', 'Use clips + hat channel; check every screw'],
          ['Isolation drops at 2–3 kHz', 'Coincidence of drywall', 'Two different board thicknesses, damping compound'],
        ]) },
      { h: 'Apply it', html: `
        ${flow([['Set the target', 'from M7, per octave'], ['Pick leaf masses', 'board layers / masonry'], ['Choose cavity depth', 'f₀ below 40–50 Hz'], ['Decouple', 'clips or independent frames'], ['Fill & damp', 'soft wool, damping compound'], ['Seal every joint', 'acoustic sealant, offset outlets']])}
        <p>Model your build in the <a href="#/isolation">Soundproofing planner</a> and see build-ups in the <a href="#/treatment">Treatment simulator</a>’s hidden-wall tab.</p>` },
    ],
    quiz: [
      { q: 'Doubling the mass of a single wall gives roughly…', opts: ['+3 dB', '+6 dB', '+12 dB', 'nothing'], a: 1, why: 'Mass law: 20·log(2) ≈ 6 dB.' },
      { q: 'At the mass–air–mass resonance a double wall is…', opts: ['at its best', 'worse than a single leaf', 'perfectly transparent to highs', 'irrelevant'], a: 1, why: 'The two leaves and the air spring resonate, so isolation dips.' },
      { q: 'How do you lower f₀?', opts: ['Lighter leaves', 'Shallower cavity', 'Heavier leaves and a deeper cavity', 'More screws'], a: 2, why: 'f₀ falls with more mass and more depth.' },
      { q: 'What is the “triple-leaf” problem?', opts: ['Three layers of paint', 'A middle leaf that creates two small cavities and raises resonance', 'Three doors in a row', 'A triple-glazed window'], a: 1, why: 'Splitting the cavity raises the resonance, hurting low-frequency isolation.' },
      { q: 'Best way to stop a resilient channel being short-circuited?', opts: ['Longer screws', 'Check no screw enters a stud, or use isolation clips', 'Glue it', 'Paint it'], a: 1, why: 'One screw into a stud bridges the decoupling.' },
    ],
  });

  /* ======================================================================
     M9 — Doors & windows
     ====================================================================== */
  const SVG_DOOR = `<svg class="gsvg" viewBox="0 0 640 230" role="img" aria-label="Acoustic door sealing">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">A sealed door: heavy leaf, seals on all four sides</text>
    <rect x="200" y="40" width="200" height="170" fill="none" stroke="var(--text)" stroke-width="6"/>
    <rect x="212" y="50" width="176" height="150" fill="var(--muted)" opacity=".5"/>
    <rect x="206" y="46" width="188" height="6" fill="var(--good)"/><rect x="206" y="46" width="6" height="160" fill="var(--good)"/><rect x="388" y="46" width="6" height="160" fill="var(--good)"/>
    <rect x="212" y="198" width="176" height="7" fill="var(--accent)"/>
    <text x="300" y="130" text-anchor="middle" font-size="11">solid core ≥ 25 kg/m²</text>
    <text x="440" y="60" font-size="10" fill="var(--good)">compression seals (head + jambs)</text><path d="M436 56 L396 50" stroke="var(--good)"/>
    <text x="440" y="200" font-size="10" fill="var(--accent)">automatic drop seal / threshold</text><path d="M436 196 L390 202" stroke="var(--accent)"/>
    <text x="30" y="120" font-size="10" fill="var(--muted)">cam-lift hinges</text><text x="30" y="134" font-size="10" fill="var(--muted)">pull the leaf onto</text><text x="30" y="148" font-size="10" fill="var(--muted)">the seals</text>
    <circle cx="200" cy="80" r="5" fill="var(--warn)"/><circle cx="200" cy="170" r="5" fill="var(--warn)"/>
  </svg>`;
  const SVG_WIN = `<svg class="gsvg" viewBox="0 0 640 230" role="img" aria-label="Studio window section">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Studio window: two panes, two frames, a big absorbent gap</text>
    <rect x="80" y="40" width="70" height="170" fill="var(--muted)" opacity=".6"/><rect x="490" y="40" width="70" height="170" fill="var(--muted)" opacity=".6"/>
    <text x="115" y="226" text-anchor="middle" font-size="10">wall leaf 1</text><text x="525" y="226" text-anchor="middle" font-size="10">wall leaf 2</text>
    <rect x="150" y="60" width="340" height="12" fill="var(--c4)" opacity=".8"/><rect x="150" y="178" width="340" height="12" fill="var(--c4)" opacity=".8"/>
    <rect x="190" y="72" width="10" height="106" fill="var(--c3)"/><rect x="420" y="78" width="14" height="96" fill="var(--c3)" transform="rotate(-4 427 126)"/>
    <text x="184" y="96" font-size="10" text-anchor="end" fill="var(--c3)">10 mm</text><text x="440" y="96" font-size="10" fill="var(--c3)">12.8 mm laminated</text>
    <text x="310" y="130" text-anchor="middle" font-size="11" font-weight="700">≥ 100–200 mm air gap</text>
    <text x="320" y="56" text-anchor="middle" font-size="10" fill="var(--c4)">absorbent reveals (fabric over wool)</text>
    <text x="320" y="206" text-anchor="middle" font-size="10" fill="var(--muted)">each pane in its own frame, sealed to its own wall leaf</text>
  </svg>`;
  push({
    id: 'm-doors-windows', n: 'M9', track: 'master', title: 'Doors & Windows — the Weak Links', level: 'Core', mins: 35,
    summary: 'Why a single door or a 10 mm gap can ruin a great wall, how to choose and seal doors, how sound locks work, and how to build windows and observation glass that keep up with the walls.',
    tags: ['composite TL', 'doors', 'seals', 'drop seal', 'sound lock', 'windows', 'laminated glass', 'observation window', 'window plug'],
    sections: [
      { h: 'The leak law', html: `
        <p class="lead">Isolation is like a bucket: water leaves through the biggest hole, not the strongest side. A wall is a <b>composite</b> of wall, door, window and gaps — and the weakest part dominates.</p>
        <div class="formula"><span class="lbl">Composite transmission loss</span>TL = −10·log₁₀( Σ Sᵢ·10^(−TLᵢ/10) / Σ Sᵢ )</div>
        <div class="callout example">A 12 m² wall rated 60 dB with an ordinary 26 dB door ends up near <b>35 dB</b>. Add a 10 mm gap under the door and it drops toward <b>30 dB</b>. Upgrading the wall to 70 dB changes almost nothing — fixing the door does.</div>
        <p>Play with the elements below and watch where the energy goes.</p>`, viz: 'compositeTL' },
      { h: 'Doors: mass, seals and hinges', html: `
        ${SVG_DOOR}
        ${table(['Door', 'Typical rating', 'Notes'], [
          ['Hollow-core interior', '15–20 dB', 'Useless for studios'],
          ['Solid-core (≈ 45 mm), no seals', '25–28 dB', 'Mass is there, the gaps are not sealed'],
          ['Solid-core + full seals + drop seal', '32–36 dB', 'Best DIY value'],
          ['Acoustic studio door (factory)', '40–50 dB', 'Heavy, cam hinges, multiple seals'],
          ['Two sealed doors + sound lock', '55–65 dB', 'The professional standard'],
        ])}
        <div class="callout mentor"><b>DIY upgrade:</b> replace a hollow door with a solid-core one, fit compression seals to head and jambs, an automatic drop seal (or a raised threshold), adjust the latch so the leaf compresses the seals evenly, and seal the frame to the wall with acoustic sealant. A sheet of paper closed in the door should be hard to pull out all the way round.</div>` },
      { h: 'Sound locks', html: `
        <p>Two doors with a small lobby between them behave like a double wall: the lobby is the “cavity”. Line the lobby with absorption so it doesn’t ring, and never open both doors at once. Two 35 dB doors in a sound lock typically give 55–60 dB — more than any single affordable door.</p>
        <div class="callout warn">Doors placed directly opposite each other in a short lobby with hard walls lose much of the benefit. Offset them, and absorb the lobby walls and ceiling.</div>` },
      { h: 'Windows: glass, gaps and frames', html: `
        ${SVG_WIN}
        <ul><li><b>Glass is mass:</b> thicker = better, but each pane has a coincidence dip. Use two <b>different</b> thicknesses so the dips don’t coincide.</li>
        <li><b>Laminated acoustic glass</b> damps the dip — worth it on at least one pane.</li>
        <li><b>The gap is everything:</b> thermal double glazing (6–16 mm gap) is barely better than one pane at low frequencies. Studio windows use 100–200 mm.</li>
        <li><b>Absorbent reveals</b> around the gap damp the air between the panes.</li>
        <li><b>Each pane in its own frame</b>, each frame sealed to its own wall leaf — otherwise the frame bridges the room-in-room.</li>
        <li><b>Angled panes?</b> A few degrees of tilt mostly controls <i>visual and acoustic reflections</i> inside the rooms; it does little for isolation itself. Use it for the control-room window where reflections matter.</li></ul>` },
      { h: 'Window plugs for existing windows', html: `
        <p>For a bedroom or rented room, a removable plug fitted into the reveal turns an ordinary window into a much better one when you record — and comes out when you want daylight.</p>`, viz: drawing(() => DR.windowPlug({})) },
      { h: 'Use cases', html: `<div class="uc-grid">
          ${uc('🛏️', 'Bedroom studio door', [['Problem', 'Family hears every mix'], ['Solution', 'Solid-core door, seals, drop seal: +10–15 dB for a weekend’s work']])}
          ${uc('🎚️', 'Control room to live room glass', [['Problem', 'Window weaker than the walls'], ['Solution', 'Two frames, 10 + 12.8 mm laminated, 150 mm gap, absorbent reveals']], '#2b9fc7')}
          ${uc('🚌', 'Street-facing booth', [['Problem', 'Bus rumble through the window'], ['Solution', 'Secondary glazing 100 mm+ from the existing, or a window plug']], '#c7772b')}
          ${uc('🏢', 'Office meeting room', [['Problem', 'Speech through a glass partition'], ['Solution', 'Laminated glass, sealed head track, door seals']], '#7a5cc7')}
        </div>` },
      { h: 'Problems & solutions', html: table(['Problem', 'Cause', 'Solution'], [
          ['Wall upgrade made no difference', 'Door/window dominates', 'Fix the weakest element first'],
          ['Light visible around the closed door', 'Seals missing or not compressed', 'Adjust strike, add compression seals'],
          ['Window rattles with bass', 'Loose glazing beads, thin glass', 'Re-glaze in resilient gaskets; heavier glass'],
          ['Double window no better than single', 'Small gap or frames bridged', 'Bigger gap, separate frames per leaf'],
        ]) },
      { h: 'Apply it', html: `
        ${flow([['List every opening', 'doors, windows, vents, gaps'], ['Rate each one', 'and its area'], ['Compute composite', 'find the weakest'], ['Upgrade the weakest', 'seals, mass, sound lock'], ['Seal frames', 'to their own leaf'], ['Test', 'light/paper test, then measure']])}
        <p>Model it in the <a href="#/isolation">Soundproofing planner</a>.</p>` },
    ],
    quiz: [
      { q: 'A 60 dB wall with a poor door ends up close to…', opts: ['the wall’s rating', 'the door’s rating', 'the average of the two', '0 dB'], a: 1, why: 'The weak element dominates the composite.' },
      { q: 'Why use two different glass thicknesses?', opts: ['Looks', 'Their coincidence dips fall at different frequencies', 'Cheaper', 'Easier to clean'], a: 1, why: 'Different panes don’t share the same weak frequency.' },
      { q: 'What does a sound lock do?', opts: ['Locks the studio', 'Puts two doors in series with a lobby between them', 'Seals windows', 'Muffles the doorbell'], a: 1, why: 'Two doors + lobby act like a double wall.' },
      { q: 'Biggest single factor for a studio window’s low-frequency isolation?', opts: ['Tint', 'Air gap between panes', 'Frame colour', 'Handle type'], a: 1, why: 'A large gap lowers the mass–air–mass resonance.' },
    ],
  });

  /* ======================================================================
     M10 — Floating floors
     ====================================================================== */
  const SVG_FLOAT = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Floating floor types">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Floating floor types</text>
    ${[['Timber deck on pads', 20], ['Concrete on pads (jack-up)', 230], ['Concrete on springs', 440]].map(([t, x], i) => `
      <text x="${x + 90}" y="44" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <rect x="${x}" y="170" width="180" height="22" fill="var(--muted)" opacity=".6"/>
      <rect x="${x + 10}" y="${i ? 110 : 128}" width="160" height="${i ? 36 : 18}" fill="${i ? 'var(--muted)' : 'var(--warn)'}" opacity="${i ? 0.9 : 0.75}"/>
      ${[30, 90, 150].map((dx) => i === 2 ? `<path d="M${x + dx} 168 ${Array.from({ length: 5 }, (_, k) => `l8 ${k % 2 ? 4 : -4}`).join(' ')}" transform="rotate(-90 ${x + dx} 168)" stroke="var(--accent)" stroke-width="2" fill="none"/>` : `<rect x="${x + dx - 10}" y="${i ? 148 : 148}" width="20" height="${i ? 20 : 20}" fill="var(--accent)" opacity=".85"/>`).join('')}
      ${i === 0 ? `<rect x="${x + 10}" y="146" width="160" height="0" />` : ''}
      <rect x="${x + 4}" y="${i ? 106 : 124}" width="5" height="${i ? 64 : 46}" fill="var(--good)"/>
      <text x="${x + 90}" y="208" text-anchor="middle" font-size="10" fill="var(--muted)">${['DIY-friendly, f₀ ≈ 15–25 Hz', 'cast then lifted on isolators', 'lowest f₀ (≈ 3–8 Hz)'][i]}</text>`).join('')}
    <text x="320" y="64" text-anchor="middle" font-size="10" fill="var(--good)">green = perimeter isolation strip — the floor never touches the walls</text>
  </svg>`;
  push({
    id: 'm-floors', n: 'M10', track: 'master', title: 'Floating Floors', level: 'Advanced', mins: 35,
    summary: 'When a floating floor is worth it, the main types (pads, springs, jack-up concrete, timber decks), natural frequency and loading in plain words, perimeter details, and the mistakes that short-circuit them.',
    tags: ['floating floor', 'rubber pads', 'springs', 'jack-up slab', 'natural frequency', 'transmissibility', 'impact noise', 'flanking'],
    sections: [
      { h: 'Do you need one?', html: `
        <p class="lead">A floating floor separates the room’s floor from the building structure with a resilient layer. It stops <b>structure-borne</b> sound — drums, bass amps, footsteps, subwoofers — from entering the building frame, and it completes a room-in-room.</p>
        ${table(['Situation', 'Float?'], [
          ['Drums, bass amps or subs above/next to neighbours', '<b>Yes</b> — the most effective single measure'],
          ['Room-in-room on a timber or suspended floor', 'Yes, to complete the inner box'],
          ['Control room on a ground-bearing slab', 'Usually not — the slab is already massive and isolated from neighbours'],
          ['Footsteps from above', 'Float the floor <b>above</b> (at the source), not yours'],
          ['Vocal booth, quiet sources', 'Rarely — a rubber underlay may be enough'],
        ])}` },
      { h: 'How it works — mass on a spring', html: `
        <p>The floor (mass) sits on pads or springs (spring). It has a natural frequency f₀. Vibration well <b>above</b> f₀ is isolated; vibration <b>near</b> f₀ is amplified; below f₀ it passes straight through.</p>
        <div class="formula"><span class="lbl">Natural frequency from static deflection</span>f₀ ≈ 15.8 / √(deflection in mm) Hz</div>
        <div class="callout data"><b>Rule of thumb:</b> isolation starts at about 1.4 × f₀ and becomes useful above 3 × f₀. To isolate a kick drum at 50–60 Hz you want f₀ under about 15–20 Hz — that means the pads must actually compress several millimetres under the real load.</div>`, viz: 'transmissibility' },
      { h: 'Types of floating floor', html: `
        ${SVG_FLOAT}
        ${table(['Type', 'Typical f₀', 'Pros', 'Cons'], [
          ['Timber deck (2 × 18 mm ply + gypsum) on rubber pads', '15–25 Hz', 'Light, DIY, low height (≈ 100–150 mm)', 'Less mass → less low-frequency isolation'],
          ['Concrete slab on rubber pads (jack-up or cast on formwork)', '10–15 Hz', 'Mass + isolation, very effective', 'Heavy — structural check needed'],
          ['Concrete on steel springs', '3–8 Hz', 'Best low-frequency isolation', 'Cost, height, specialist design'],
          ['Continuous resilient mat under screed', '20–40 Hz', 'Simple, good for impact noise', 'Limited low-frequency benefit'],
        ])}
        <div class="callout alt"><b>With or without springs?</b> Springs give the lowest f₀ and the best bass isolation, but cost more and need careful damping. Rubber/neoprene pads are cheaper, self-damping and fine for most studios. Choose by the lowest frequency you must stop and the load the building can carry.</div>` },
      { h: 'Section detail', html: `<p>A typical floated timber floor: sleepers on correctly loaded pads, insulation between, two layers of board, and an isolation strip at every wall.</p>`, viz: drawing(() => DR.floatFloor({})) },
      { h: 'Loading — the hidden key', html: `
        <ul><li>Every pad is designed for a load range. <b>Under-loaded</b> pads are too stiff (f₀ too high); <b>over-loaded</b> pads bottom out and creep.</li>
        <li>Work out the load per pad: (floor + inner walls + equipment + people) ÷ number of pads. Then choose pad size/spacing to land in the manufacturer’s ideal range.</li>
        <li>Heavy inner walls standing on the float need more pads beneath them.</li>
        <li>Air trapped under a sealed floor adds stiffness — leave the cavity insulated (soft wool) and avoid fully sealed small cavities.</li></ul>` },
      { h: 'Mistakes that short-circuit a floor', html: `
        <div class="uc-grid">
          ${uc('🔩', 'Screws & fixings', [['Problem', 'A skirting board nailed to floor and wall'], ['Fix', 'Fix skirting to the wall only; leave a sealed gap']], '#d14b8f')}
          ${uc('🧱', 'Mortar or screed bridges', [['Problem', 'Concrete leaks under the perimeter strip'], ['Fix', 'Continuous upstand strip, taped joints, inspect before pouring']], '#c7772b')}
          ${uc('🚰', 'Pipes & conduits', [['Problem', 'Rigid pipe through the float into the slab'], ['Fix', 'Flexible connectors and sleeves']], '#2b9fc7')}
          ${uc('🚪', 'Door thresholds', [['Problem', 'Threshold fixed to both floors'], ['Fix', 'Split threshold with a seal between floors']], '#4c9a3a')}
        </div>
        <div class="callout warn">One rigid bridge can lose most of the improvement. Check every penetration before boards go down.</div>` },
      { h: 'Testing floors', html: `
        <p>Labs test floors two ways: <b>airborne</b> (like walls) and <b>impact</b>, using a standard tapping machine with five steel hammers. Impact results are given as IIC (higher is better) or L′<sub>nT,w</sub> (lower is better). On site, a floated floor commonly improves impact isolation by 15–30 dB — but only if nothing bridges it.</p>` },
      { h: 'Problems & solutions', html: table(['Problem', 'Cause', 'Solution'], [
          ['Floor feels bouncy', 'Pads under-sized or deck too light', 'Heavier deck, more pads, stiffer spacing'],
          ['No improvement in bass', 'f₀ too high or bridged', 'Check loading and every penetration'],
          ['Floor creeps / sinks over time', 'Pads over-loaded', 'Re-calculate load per pad; add pads'],
          ['Drum thumps still reach neighbours', 'Walls/ceiling also flanking', 'Inner walls on the float, independent ceiling'],
        ]) },
      { h: 'Apply it', html: `
        ${flow([['Decide if needed', 'source & neighbours'], ['Target f₀', '≤ 1/3 of the lowest problem frequency'], ['Calculate loads', 'floor, walls, gear, people'], ['Choose pads/springs', 'in their ideal load range'], ['Detail perimeter', 'strip, thresholds, services'], ['Inspect before closing', 'no bridges']])}
        <p>Calculate yours in <a href="#/floors">Floating Floors & Vibration</a>.</p>` },
    ],
    quiz: [
      { q: 'A floating floor isolates vibration…', opts: ['below its natural frequency', 'at its natural frequency', 'well above its natural frequency', 'at all frequencies equally'], a: 2, why: 'Isolation starts at about 1.4 × f₀ and improves above.' },
      { q: 'What happens with under-loaded rubber pads?', opts: ['They are too stiff: f₀ too high', 'They isolate better', 'Nothing', 'They melt'], a: 0, why: 'Pads must be compressed in their design range to be soft enough.' },
      { q: 'Footsteps from the flat above are best fixed…', opts: ['by floating your floor', 'at the source: floating floor above', 'with foam on your ceiling', 'with EQ'], a: 1, why: 'Impact noise is best stopped where it enters the structure.' },
      { q: 'Which is a common short-circuit?', opts: ['Soft wool in the cavity', 'Skirting nailed to both floor and wall', 'Perimeter isolation strip', 'Correct pad spacing'], a: 1, why: 'Any rigid connection bridges the float.' },
    ],
  });

  /* ======================================================================
     M11 — Large-room acoustics
     ====================================================================== */
  const SVG_SHAPES = `<svg class="gsvg" viewBox="0 0 640 210" role="img" aria-label="Hall shapes">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">What shape does to early reflections (plan view)</text>
    <rect x="30" y="40" width="160" height="130" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="110" cy="58" r="6" fill="var(--accent)"/><circle cx="110" cy="140" r="5" fill="var(--good)"/>
    <path d="M110 58 L30 100 L110 140 M110 58 L190 100 L110 140" stroke="var(--good)" fill="none"/><text x="110" y="190" text-anchor="middle" font-size="10">Shoebox: strong side reflections</text>
    <path d="M270 40 L370 40 L420 170 L220 170 Z" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="320" cy="56" r="6" fill="var(--accent)"/><circle cx="320" cy="140" r="5" fill="var(--good)"/>
    <path d="M320 56 L245 105 L200 120" stroke="var(--bad)" fill="none"/><text x="320" y="190" text-anchor="middle" font-size="10">Fan: reflections sent away from seats</text>
    <path d="M470 170 A90 90 0 0 1 610 170" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><path d="M470 170 L610 170" stroke="var(--text)" stroke-width="2"/><circle cx="540" cy="160" r="5" fill="var(--accent)"/>
    <path d="M540 160 L500 110 L540 128 M540 160 L580 110 L540 128" stroke="var(--bad)" fill="none"/><circle cx="540" cy="128" r="6" fill="var(--bad)" opacity=".5"/>
    <text x="540" y="190" text-anchor="middle" font-size="10">Concave: sound focuses (hot spot)</text>
  </svg>`;
  const SVG_ECHO = `<svg class="gsvg" viewBox="0 0 640 170" role="img" aria-label="Echo threshold">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Reflections arriving later than ≈ 50 ms are heard as echoes</text>
    <line x1="40" y1="130" x2="600" y2="130" stroke="var(--muted)"/>
    <rect x="60" y="50" width="10" height="80" fill="var(--accent)"/><text x="65" y="44" text-anchor="middle" font-size="10">direct</text>
    ${[110, 140, 170, 200, 230].map((x, i) => `<rect x="${x}" y="${70 + i * 8}" width="8" height="${60 - i * 8}" fill="var(--good)"/>`).join('')}
    <rect x="80" y="140" width="250" height="8" fill="var(--good)" opacity=".4"/><text x="205" y="162" text-anchor="middle" font-size="10" fill="var(--good)">0–50 ms: fuse with the direct sound (help!)</text>
    <rect x="460" y="70" width="10" height="60" fill="var(--bad)"/><text x="465" y="64" text-anchor="middle" font-size="10" fill="var(--bad)">echo</text>
    <text x="465" y="150" text-anchor="middle" font-size="10" fill="var(--bad)">&gt; 17 m extra path</text>
  </svg>`;
  push({
    id: 'm-large-rooms', n: 'M11', track: 'master', title: 'Large-Room Acoustics: Rays, Shapes, Ratios, Reflections, Echoes, Diffraction & Diffusion', level: 'Core', mins: 45,
    summary: 'How sound behaves in halls, churches, auditoria and large live rooms: when ray thinking works, what shape does, which reflections help and which become echoes, and how diffraction and diffusion make spaces better.',
    tags: ['large rooms', 'ray tracing', 'hall shapes', 'shoebox', 'fan', 'vineyard', 'concave focusing', 'echo', 'flutter', 'diffraction', 'diffusion'],
    sections: [
      { h: 'Wavelength vs room size', html: `
        <p class="lead">In a large room most wavelengths (17 mm at 20 kHz up to 3.4 m at 100 Hz) are small compared with the walls. Sound then behaves like <b>rays</b> of light bouncing around — so we can draw it, trace it and design with geometry.</p>
        ${table(['Frequency', 'Wavelength', 'In a 30 m hall'], [
          ['63 Hz', '5.4 m', 'Still wave-like near surfaces and balconies'],
          ['250 Hz', '1.4 m', 'Ray thinking mostly works'],
          ['1 kHz', '34 cm', 'Rays — reflections behave like mirrors'],
          ['4 kHz', '8.6 cm', 'Rays — small details scatter'],
        ])}
        <p>Ray tracing tells you <i>where</i> reflections go and <i>when</i> they arrive. Reverberation time tells you how long the room keeps ringing overall.</p>`, viz: 'reverb' },
      { h: 'Room shapes — what difference does shape make?', html: `
        ${SVG_SHAPES}
        <ul><li><b>Shoebox</b> (narrow, tall, rectangular): strong early side reflections give envelopment and clarity — the classic concert-hall shape.</li>
        <li><b>Fan</b>: good sightlines and many seats, but side walls throw reflections away from the audience; needs added reflectors.</li>
        <li><b>Vineyard / terraced</b>: seating blocks whose walls act as reflectors — intimacy with large audiences.</li>
        <li><b>Domes, curved rear walls and barrel vaults</b>: concave surfaces <b>focus</b> sound into hot spots and echoes. Break them up, diffuse or absorb.</li></ul>`, viz: 'hall' },
      { h: 'Do room ratios matter in large rooms?', html: `
        <p>Hardly. Ratios matter when room modes are far apart — in <b>small</b> rooms. In a large hall the modes are packed so densely (above a few tens of hertz) that they blend into a smooth reverberant field. What matters is <b>volume per seat</b>, shape, surface treatment and reflection geometry.</p>
        <div class="callout data"><b>Volume per seat (rules of thumb):</b> speech auditoria 3–5 m³ · multi-use 5–7 m³ · concert halls 7–10 m³ · churches/organ music 10–14 m³.</div>` },
      { h: 'Reflections: friends and enemies', html: `
        ${SVG_ECHO}
        <p>Reflections that arrive within about <b>50 ms</b> of the direct sound fuse with it: they make speech louder and clearer and music fuller. Early reflections from the <b>sides</b> (lateral) give the feeling of being surrounded. Reflections arriving later — especially strong single ones from the back wall — are heard as separate <b>echoes</b>.</p>
        <div class="formula"><span class="lbl">Echo risk</span>extra path &gt; 17 m (≈ 50 ms at 343 m/s) and strong → echo</div>` },
      { h: 'Echoes and flutter — causes and remedies', html: `
        <p>A flat, hard rear wall facing the stage returns a delayed copy of everything. Two parallel hard surfaces trap sound into a flutter echo. Remedies: <b>absorb</b> the offending surface, <b>diffuse</b> it, or <b>tilt</b> it so the reflection lands where it helps (the audience close by) instead of back at the stage.</p>`, viz: 'flutter' },
      { h: 'Diffraction — edges that help', html: `
        <p>Sound bends around edges and through openings, more so at low frequencies. That is why you can hear round a corner and why seats under a deep balcony sound dull: the highs can’t bend in.</p>
        <ul><li><b>Balcony rule:</b> keep balcony overhangs shallow (depth ≤ about twice the opening height) so seats underneath still “see” the ceiling.</li>
        <li><b>Edges of reflector panels</b> scatter some sound — useful for spreading reflections; but small panels only reflect frequencies whose wavelength is smaller than the panel.</li>
        <li><b>Gaps between reflector panels</b> let bass through while reflecting the highs — a stage canopy can be tuned this way.</li></ul>`, viz: 'surfaces' },
      { h: 'Diffusion — better spaces and what to avoid', html: `
        <p>Diffusion spreads reflected energy in time and direction. Classic halls get it from coffers, columns, statues and balcony fronts; modern ones from shaped panels and diffusers.</p>
        ${myth([
          ['“More diffusion is always better.”', 'Over-diffusing the stage area can weaken the useful early reflections musicians need to hear each other.'],
          ['“Diffusers replace absorption.”', 'Diffusers don’t shorten reverberation much. Use them to fix echoes and add spaciousness, and absorbers to control RT.'],
          ['“Any bumpy surface diffuses.”', 'Surface depth and width must match the wavelengths you want to scatter — ornament diffuses highs, deep features diffuse mids.'],
        ])}` },
      { h: 'Use cases & problems', html: `<div class="uc-grid">
          ${uc('⛪', 'Church with a barrel vault', [['Problem', 'Focused echoes, long RT, muddy speech'], ['Solution', 'Diffuse/absorb the vault, directional loudspeakers aimed at people, not walls']])}
          ${uc('🏫', 'School hall', [['Problem', 'Rear-wall echo, flutter between side walls'], ['Solution', 'Absorb the rear wall, panels on one side wall, ceiling absorption']], '#c7772b')}
          ${uc('🎻', 'Recital hall', [['Problem', 'Weak sense of envelopment'], ['Solution', 'Lateral reflectors, diffusion on upper walls, keep the stage area live']], '#7a5cc7')}
          ${uc('🎙️', 'Large live room in a studio', [['Problem', 'Slap echo between parallel walls'], ['Solution', 'Splay or diffuse one wall, variable panels, high ceiling kept live']], '#2b9fc7')}
        </div>
        ${table(['Problem', 'Solution'], [['Distinct echo from the back', 'Absorb or diffuse the rear wall; tilt it down'], ['Hot spots / dead spots', 'Break up concave surfaces'], ['Dull under-balcony seats', 'Shallower overhang; reflective soffit'], ['Too reverberant for speech', 'Add absorption; aim loudspeakers at seats']])}` },
      { h: 'Apply it', html: `${flow([['Volume per seat', 'set the RT range'], ['Shape', 'side reflections, no focusing'], ['Trace first reflections', 'where do they land?'], ['Find long paths', '> 17 m → echo risk'], ['Treat', 'absorb / diffuse / tilt'], ['Check RT', 'per octave']])}
        <p>Next: <a href="#/academy/m-small-rooms">Small-room acoustics</a> · <a href="#/diffusers">Diffuser designer</a> · <a href="#/analyzer">Room analyzer</a>.</p>` },
    ],
    quiz: [
      { q: 'Why does ray tracing work well in large rooms?', opts: ['Large rooms have no reflections', 'Most wavelengths are small compared with the surfaces', 'Rays are cheaper', 'Sound is faster in big rooms'], a: 1, why: 'When surfaces are many wavelengths across, sound reflects like light.' },
      { q: 'A concave rear wall tends to…', opts: ['diffuse sound evenly', 'focus sound into hot spots and echoes', 'absorb bass', 'improve clarity'], a: 1, why: 'Curved concave surfaces act like a mirror that focuses.' },
      { q: 'Roughly what extra path length makes a strong reflection an echo?', opts: ['1 m', '5 m', '17 m', '100 m'], a: 2, why: '17 m ≈ 50 ms at the speed of sound.' },
      { q: 'Room ratios matter most in…', opts: ['concert halls', 'small rooms', 'outdoor stages', 'stadiums'], a: 1, why: 'In large rooms modes are dense and blend together.' },
    ],
  });

  /* ======================================================================
     M12 — Small-room acoustics
     ====================================================================== */
  const SVG_SCHROEDER = `<svg class="gsvg" viewBox="0 0 640 190" role="img" aria-label="Schroeder frequency regions">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">A small room has two personalities, split near the Schroeder frequency</text>
    <rect x="40" y="40" width="250" height="110" fill="var(--bad)" opacity=".12"/><rect x="290" y="40" width="70" height="110" fill="var(--warn)" opacity=".15"/><rect x="360" y="40" width="240" height="110" fill="var(--good)" opacity=".12"/>
    <path d="M40 120 ${Array.from({ length: 16 }, (_, i) => `L${55 + i * 15} ${i % 2 ? 70 : 135}`).join(' ')} L300 100 L340 95 ${Array.from({ length: 16 }, (_, i) => `L${360 + i * 15} ${95 + (i % 2 ? 4 : -4)}`).join(' ')}" stroke="var(--accent)" stroke-width="2" fill="none"/>
    <text x="165" y="168" text-anchor="middle" font-size="11" font-weight="700" fill="var(--bad)">WAVES: modes, peaks & nulls</text>
    <text x="325" y="168" text-anchor="middle" font-size="10" fill="var(--warn)">transition</text>
    <text x="480" y="168" text-anchor="middle" font-size="11" font-weight="700" fill="var(--good)">RAYS: reflections</text>
    <text x="165" y="184" text-anchor="middle" font-size="10" fill="var(--muted)">position, traps, multiple subs</text><text x="480" y="184" text-anchor="middle" font-size="10" fill="var(--muted)">absorb / diffuse first reflections</text>
  </svg>`;
  const SVG_SPLAY = `<svg class="gsvg" viewBox="0 0 640 190" role="img" aria-label="Rectangular vs splayed room">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Splaying walls moves modes around — it does not remove them</text>
    <rect x="60" y="40" width="200" height="120" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <path d="M60 100 Q110 40 160 100 T260 100" stroke="var(--bad)" fill="none" stroke-width="2"/><text x="160" y="178" text-anchor="middle" font-size="10">Rectangle: predictable modes — easy to calculate & treat</text>
    <path d="M380 40 L600 52 L600 148 L380 160 Z" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <path d="M380 100 Q430 50 480 96 T600 104" stroke="var(--bad)" fill="none" stroke-width="2" opacity=".8"/><text x="490" y="178" text-anchor="middle" font-size="10">Splayed: no flutter, modes harder to predict</text>
  </svg>`;
  push({
    id: 'm-small-rooms', n: 'M12', track: 'master', title: 'Small-Room Acoustics: Waves, Modes, Shapes, Ratios, Reflections & Diffusion', level: 'Core', mins: 45,
    summary: 'Why control rooms, booths and home studios behave differently from halls: modes and the Schroeder frequency, what shape and ratios really do, which reflections to keep, flutter, diffraction, and whether diffusion helps or hurts.',
    tags: ['small rooms', 'Schroeder frequency', 'room modes', 'room ratios', 'Bolt', 'Bonello', 'splayed walls', 'first reflections', 'flutter', 'diffusion distance'],
    sections: [
      { h: 'Wavelength vs room size', html: `
        <p class="lead">In a 4 m room, a 50 Hz wave (6.9 m long) is bigger than the room. Below a certain frequency, sound does not behave like rays at all — it forms <b>standing waves</b> (modes) with loud and quiet spots fixed in space.</p>
        ${SVG_SCHROEDER}
        <div class="formula"><span class="lbl">Schroeder (transition) frequency</span>f<sub>S</sub> ≈ 2000·√(RT60 / V) &nbsp;&nbsp;(V in m³) — typically 150–300 Hz in small rooms</div>
        <div class="callout example">A 4.5 × 3.6 × 2.7 m room (44 m³) with RT60 = 0.3 s has f<sub>S</sub> ≈ 165 Hz. Everything below is a <b>modal</b> problem (position, bass traps, subs); everything above is a <b>reflection</b> problem (panels, diffusers, symmetry).</div>` },
      { h: 'Modes — the small-room signature', html: `
        <p>Each pair of parallel surfaces supports standing waves at f = n·c/(2L). Axial modes (between two surfaces) are strongest; tangential (four surfaces) and oblique (six) are weaker. Move the listener and the mic in the map below — bass changes by 10–20 dB over a metre.</p>`, viz: 'modes2D' },
      { h: 'Room shapes — what difference does shape make?', html: `
        ${SVG_SPLAY}
        <ul><li>A <b>rectangle</b> has predictable modes. You can calculate, place and treat them — this is why most designers start rectangular.</li>
        <li><b>Splaying</b> walls by a few degrees kills flutter and steers early reflections, but bass modes still exist — they just move and become harder to predict.</li>
        <li><b>Non-parallel ceilings</b> are useful for steering reflections away from the mix position.</li>
        <li>Shape cannot fix bass on its own. Volume, treatment and positioning matter more.</li></ul>` },
      { h: 'Room ratios — when do they count?', html: `
        <p>Ratios decide how evenly the modes are spread. They count most in <b>small, rectangular, untreated</b> rooms. Avoid cubes and dimensions that are simple multiples (2.4 × 4.8 m), and check with the Bolt area or the Bonello criterion.</p>
        ${table(['Ratio (H : W : L)', 'Source', 'Note'], [['1 : 1.14 : 1.39', 'Classic small-room ratio', 'Compact rooms'], ['1 : 1.28 : 1.54', 'Widely quoted', 'Good spread'], ['1 : 1.6 : 2.33', 'Widely quoted', 'Larger rooms'], ['1 : 1 : 1', 'Cube', 'Worst — all modes coincide']])}
        <div class="callout mentor"><b>Don’t obsess.</b> A “perfect” ratio changes the bass by a few dB; seat position changes it by 10–20 dB. Get the ratio roughly right if you are building, then rely on positioning and deep treatment. Check your room in the <a href="#/predict">Room Predictor</a> and <a href="#/analyzer">Room Analyzer</a>.</div>` },
      { h: 'Reflections — when needed and when not', html: `
        <p>Above f<sub>S</sub> the room behaves like a box of mirrors. Strong first reflections from side walls, desk and ceiling arrive within a few milliseconds and blur stereo imaging and tonal balance at the mix position.</p>
        ${table(['Room', 'Early reflections', 'Why'], [
          ['Control room (mixing)', 'Control them — absorb or redirect within ~15–20 ms', 'Hear the recording, not the room'],
          ['Vocal / VO booth', 'Remove them — deep absorption', 'Clean, dry, uncoloured voice'],
          ['Tracking room', 'Keep some, controlled', 'Natural ambience for instruments'],
          ['Listening room / hi-fi', 'Some lateral reflections can be pleasant', 'Spaciousness if the speakers are good off-axis'],
        ])}`, viz: 'reflections' },
      { h: 'Flutter & diffraction in small rooms', html: `
        <p>Flutter is common in small rooms with bare parallel walls — the “zing” after a clap. Fix one wall of each pair. Diffraction around panel edges also matters: small panels absorb more than their area suggests (the edge effect), so <b>spaced, separate panels</b> often outperform one large block of the same area.</p>`, viz: 'flutter' },
      { h: 'Diffusion — needed, or more problems?', html: `
        ${myth([
          ['“Every studio needs diffusers.”', 'Diffusers need distance to work — the listener should be roughly <b>3 wavelengths</b> away (often 2–3 m). Too close and you hear the individual reflections.'],
          ['“A diffuser treats bass.”', 'A 100 mm deep diffuser works down to roughly 500–800 Hz. Below that it is just a reflective wall.'],
          ['“Diffusion is gentler than absorption.”', 'In very small rooms diffusers can add comb filtering. Broadband absorption is often the safer first choice.'],
        ])}
        <div class="callout data"><b>Rule of thumb:</b> use diffusion on the <b>rear wall</b> when the listener is at least 2–3 m from it, and on ceilings over larger rooms. In booths and rooms under ~25 m², prioritise thick broadband absorption.</div>
        <p>Design one in the <a href="#/diffusers">Diffuser designer</a>.</p>` },
      { h: 'Problems & solutions', html: table(['Problem', 'Cause', 'Solution'], [
          ['Boomy one-note bass', 'Strong axial mode, seat at a peak', 'Move seat (≈ 38 % of length), corner traps, tuned trap'],
          ['Bass vanishes at the desk', 'Seat at a null (room centre)', 'Move seat off centre; multiple subs'],
          ['Vague stereo image', 'Asymmetric first reflections', 'Symmetry, side & ceiling panels'],
          ['Harsh, ringing clap', 'Flutter between parallel walls', 'Treat one wall of each pair'],
          ['Phasey, “comb” sound', 'Diffuser too close / desk reflection', 'Absorb instead; move monitors'],
        ]) },
      { h: 'Apply it', html: `${flow([['Check dimensions', 'modes & ratios'], ['Find f<sub>S</sub>', 'split wave vs ray problems'], ['Place speakers & seat', 'symmetry, 38 % rule'], ['Bass first', 'deep corner traps'], ['First reflections', 'side walls, ceiling, desk'], ['Rear wall', 'absorb (small) or diffuse (large)']])}
        <p>Run your room through the <a href="#/predict">Room Predictor</a>, then try fixes in the <a href="#/treatment">Treatment simulator</a>.</p>` },
    ],
    quiz: [
      { q: 'Below the Schroeder frequency a small room is dominated by…', opts: ['ray reflections', 'standing waves (modes)', 'diffusion', 'air absorption'], a: 1, why: 'Wavelengths are comparable to the room, so modes dominate.' },
      { q: 'Splaying walls by a few degrees…', opts: ['removes all modes', 'kills flutter but bass modes remain', 'makes rooms louder', 'replaces bass traps'], a: 1, why: 'Shape redistributes modes but cannot eliminate them.' },
      { q: 'Why can a diffuser cause problems in a tiny booth?', opts: ['It absorbs too much', 'The listener is too close for it to work properly', 'It is too heavy', 'It isolates sound'], a: 1, why: 'Diffusers need distance (about 3 wavelengths).' },
      { q: 'Which matters more for bass at the mix position: a perfect ratio or the seat position?', opts: ['The ratio, always', 'The seat position', 'Neither', 'The wall colour'], a: 1, why: 'Moving the seat changes bass by 10–20 dB; ratios by a few dB.' },
      { q: 'A room 2.4 × 4.8 m in plan is a poor choice because…', opts: ['it is too big', 'one dimension is exactly twice the other, so modes stack', 'it is rectangular', 'it has no corners'], a: 1, why: 'Simple multiples cause coincident modes.' },
    ],
  });
})();
