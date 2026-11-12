/* ==========================================================================
   Master Class M29A — what shapes a room's sound, what makes a treatment
   work, how to design the right treatment, and how to make it look good.
   Practical, illustrated, own words.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/strategy|do|fix/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  /* ---------- diagrams ---------- */
  const hot = (x, y, n) => `<circle class="hot" cx="${x}" cy="${y}" r="10" fill="var(--accent)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10" font-weight="800" fill="var(--accent-ink)">${n}</text>`;
  const leg = (x, y, n, t) => `<text x="${x}" y="${y}" font-size="11"><tspan font-weight="800" fill="var(--accent)">${n}</tspan> ${t}</text>`;
  const SVG_MAP = `<svg class="gsvg" viewBox="0 0 760 320" role="img" aria-label="Map of the factors that shape a room's sound">
    <text x="380" y="16" text-anchor="middle" font-size="13" font-weight="700">Ten things that decide how a room sounds</text>
    <rect x="30" y="40" width="430" height="230" fill="var(--panel2)" stroke="var(--text)" stroke-width="5"/>
    <rect x="26" y="120" width="10" height="70" fill="var(--c3)"/><rect x="330" y="266" width="70" height="10" fill="var(--panel)" stroke="var(--good)" stroke-width="2"/>
    <rect x="70" y="118" width="24" height="24" fill="var(--text)"/><rect x="70" y="170" width="24" height="24" fill="var(--text)"/>
    <g class="lock-wave"><circle cx="100" cy="130" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/></g><g class="lock-wave d2"><circle cx="100" cy="182" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/></g>
    <rect x="120" y="126" width="40" height="60" rx="4" fill="var(--panel)" stroke="var(--muted)"/><circle cx="200" cy="156" r="11" fill="var(--good)"/>
    <rect x="350" y="70" width="80" height="40" rx="8" fill="var(--panel)" stroke="var(--muted)"/><text x="390" y="94" text-anchor="middle" font-size="9" fill="var(--muted)">sofa</text>
    <rect x="34" y="44" width="40" height="40" fill="var(--c4)" opacity=".6"/><rect x="416" y="226" width="40" height="40" fill="var(--c4)" opacity=".6"/>
    <path d="M250 44 v-14 h60 v14" fill="none" stroke="var(--c3)" stroke-width="3"/><text x="280" y="28" text-anchor="middle" font-size="9" fill="var(--c3)">air / AC</text>
    <path class="leak-pulse" d="M470 150 h26" stroke="var(--bad)" stroke-width="3" stroke-dasharray="5 4"/>
    ${hot(245, 250, 1)}${hot(445, 56, 2)}${hot(300, 56, 3)}${hot(390, 126, 4)}${hot(140, 108, 5)}${hot(366, 254, 6)}${hot(478, 132, 7)}${hot(280, 66, 8)}${hot(82, 100, 9)}${hot(200, 190, 10)}
    ${leg(520, 54, 1, 'Size and volume')}${leg(520, 78, 2, 'Proportions and shape')}${leg(520, 102, 3, 'Surfaces and materials')}${leg(520, 126, 4, 'Furniture and people')}${leg(520, 150, 5, 'Speaker and seat positions')}
    ${leg(520, 174, 6, 'Doors, windows, openings')}${leg(520, 198, 7, 'Noise and isolation')}${leg(520, 222, 8, 'Temperature and humidity')}${leg(520, 246, 9, 'The loudspeakers themselves')}${leg(520, 270, 10, 'How the room is used')}
    <text x="245" y="300" text-anchor="middle" font-size="10" fill="var(--muted)">Treatment is only one of them — and it works best after the others are right.</text>
  </svg>`;

  const SVG_RANGES = `<svg class="gsvg" viewBox="0 0 640 190" role="img" aria-label="Three frequency regions and the treatment for each">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Sort every problem by frequency first</text>
    <rect x="20" y="34" width="190" height="96" rx="8" fill="color-mix(in srgb, var(--bad) 12%, var(--panel))" stroke="var(--bad)"/>
    <rect x="216" y="34" width="150" height="96" rx="8" fill="color-mix(in srgb, var(--warn) 12%, var(--panel))" stroke="var(--warn)"/>
    <rect x="372" y="34" width="248" height="96" rx="8" fill="color-mix(in srgb, var(--good) 12%, var(--panel))" stroke="var(--good)"/>
    <text x="115" y="54" text-anchor="middle" font-size="12" font-weight="700">Below ≈ 200 Hz</text><text x="115" y="72" text-anchor="middle" font-size="10">room modes: boom, nulls</text><text x="115" y="94" text-anchor="middle" font-size="10" fill="var(--muted)">position · deep corner traps</text><text x="115" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">membrane / tuned traps</text>
    <text x="291" y="54" text-anchor="middle" font-size="12" font-weight="700">200 – 500 Hz</text><text x="291" y="72" text-anchor="middle" font-size="10">boxiness, boundary dips</text><text x="291" y="94" text-anchor="middle" font-size="10" fill="var(--muted)">100 mm + gap panels</text><text x="291" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">speaker distance</text>
    <text x="496" y="54" text-anchor="middle" font-size="12" font-weight="700">Above ≈ 500 Hz</text><text x="496" y="72" text-anchor="middle" font-size="10">reflections, flutter, long or dead decay</text><text x="496" y="94" text-anchor="middle" font-size="10" fill="var(--muted)">panels at reflection points · cloud</text><text x="496" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">slats, diffusion to keep life</text>
    <line x1="20" y1="150" x2="620" y2="150" stroke="var(--muted)"/>
    ${[[20, '20'], [115, '63'], [210, '200'], [366, '500'], [496, '2k'], [620, '20k']].map(([x, l]) => `<line x1="${x}" y1="145" x2="${x}" y2="155" stroke="var(--muted)"/><text x="${x}" y="170" text-anchor="middle" font-size="10" fill="var(--muted)">${l}</text>`).join('')}
    <text x="320" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">Hz · the first boundary is the room’s Schroeder frequency</text>
  </svg>`;

  const SVG_GAP = `<svg class="gsvg" viewBox="0 0 640 200" role="img" aria-label="Same panel, three mountings">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Same 50 mm panel, three ways to mount it</text>
    ${[['Flat on the wall', 0, 'works from ≈ 400 Hz', 'bad'], ['50 mm air gap', 26, 'works from ≈ 250 Hz', 'warn'], ['Across a corner', 0, 'reaches the bass region', 'good']].map(([t, g, n, c], i) => { const x = 40 + i * 200; return `<g transform="translate(${x} 0)">
      <text x="80" y="40" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      ${i < 2 ? `<rect x="30" y="54" width="12" height="100" fill="var(--muted)"/><rect x="${42 + g}" y="60" width="26" height="88" fill="var(--c4)" opacity=".85"/>
      <path d="M42 154 C 80 150, 110 120, 150 70" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3"/><text x="152" y="66" font-size="9" fill="var(--accent)">air speed</text>`
      : `<path d="M30 54 v100 h110" fill="none" stroke="var(--muted)" stroke-width="12"/><path d="M40 70 L 124 148" stroke="var(--c4)" stroke-width="22" opacity=".85"/><text x="64" y="138" font-size="9" fill="var(--muted)">deep air behind</text>`}
      <text x="80" y="180" text-anchor="middle" font-size="10" fill="var(--${c})">${n}</text></g>`; }).join('')}
    <text x="320" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">Air barely moves at the wall, so a panel pushed out into moving air absorbs lower.</text>
  </svg>`;

  const SVG_HIDDEN = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Hidden treatment behind a stretched fabric wall">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Hidden treatment: a fabric wall with everything behind it (plan section)</text>
    <rect x="20" y="36" width="600" height="18" fill="var(--muted)"/><text x="320" y="49" text-anchor="middle" font-size="10" fill="var(--panel)">structural / isolation wall — sealed, untouched</text>
    <rect x="20" y="54" width="110" height="96" fill="var(--c4)" opacity=".8"/><text x="75" y="106" text-anchor="middle" font-size="10">corner trap</text>
    <rect x="140" y="54" width="150" height="64" fill="var(--c4)" opacity=".55"/><text x="215" y="90" text-anchor="middle" font-size="10">100 mm wool + gap</text>
    <rect x="300" y="54" width="130" height="40" fill="var(--accent2)" opacity=".7"/><rect x="300" y="94" width="130" height="24" fill="none" stroke="var(--accent2)"/><text x="365" y="78" text-anchor="middle" font-size="10">membrane trap</text>
    ${[440, 462, 484, 506, 528, 550, 572, 594].map((x, i) => `<rect x="${x}" y="54" width="16" height="${24 + ((i * 3) % 5) * 12}" fill="var(--accent)" opacity=".7"/>`).join('')}<text x="530" y="136" text-anchor="middle" font-size="10">diffuser</text>
    ${[130, 295, 435].map((x) => `<rect x="${x}" y="54" width="8" height="100" fill="var(--text)"/>`).join('')}
    <line class="pane-a" x1="20" y1="156" x2="620" y2="156" stroke="var(--good)" stroke-width="3"/>
    <text x="320" y="174" text-anchor="middle" font-size="11" fill="var(--good)" font-weight="700">one continuous, acoustically transparent stretched fabric</text>
    <text x="320" y="192" text-anchor="middle" font-size="10" fill="var(--muted)">timber or track frame every 600–1 200 mm · fabric clips in and can be removed</text>
    <text x="320" y="210" text-anchor="middle" font-size="10" fill="var(--muted)">The room looks like a calm, plain wall; 100 % of the surface can be working.</text>
  </svg>`;

  const SVG_SLATS = `<svg class="gsvg" viewBox="0 0 640 190" role="img" aria-label="How slat width and gap tune a slat wall">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Slat walls: the gap is the tuning knob</text>
    ${[['Narrow gaps (≈ 5 %)', 30, 3, 'absorbs lows and low-mids', 'keeps the highs bright'], ['Medium gaps (≈ 15 %)', 26, 6, 'wide mid-band absorber', 'balanced, the usual choice'], ['Wide gaps (≥ 30 %)', 18, 12, 'nearly transparent', 'behaves like the wool behind']].map(([t, sw, g, a, b], i) => { const x0 = 30 + i * 205; let s = ''; for (let x = 0; x + sw <= 170; x += sw + g) s += `<rect x="${x0 + x}" y="50" width="${sw}" height="70" fill="var(--accent)" opacity=".85"/>`; return `<text x="${x0 + 85}" y="38" text-anchor="middle" font-size="11" font-weight="700">${t}</text><rect x="${x0}" y="50" width="170" height="70" fill="#1a1a1a"/>${s}<rect x="${x0}" y="120" width="170" height="14" fill="var(--c4)" opacity=".7"/><text x="${x0 + 85}" y="152" text-anchor="middle" font-size="10">${a}</text><text x="${x0 + 85}" y="166" text-anchor="middle" font-size="10" fill="var(--muted)">${b}</text>`; }).join('')}
    <text x="320" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">Deeper cavity = lower tuning. Mixing slat widths spreads the tuning and looks richer.</text>
  </svg>`;

  const L = {
    id: 'm-factors', n: 'M29A', track: 'master', title: 'What Shapes a Room’s Sound — and Designing Treatment That Works and Looks Good', level: 'Core', mins: 55,
    summary: 'Every factor that changes how a room sounds, every factor that decides whether a treatment actually works, a step-by-step method for choosing the right treatment — and how to make it beautiful without switching it off.',
    tags: ['factors', 'room acoustics', 'treatment design', 'coverage', 'aesthetics', 'fabric', 'slat wall', 'perforated panel', 'stretched fabric', 'interior design', 'Sabine'],
    sections: [
      { h: 'The big picture: ten factors, one room', html: `
        <p class="lead">A room’s sound is not decided by the panels on its walls. It is decided by its size, its shape, what it is built from, what is in it, where you and the speakers sit — and only then by treatment. Get the first things right and the treatment becomes smaller, cheaper and better looking.</p>
        ${SVG_MAP}
        ${flow([['Fixed by the building', 'size, shape, construction'], ['Fixed by layout', 'seat, speakers, doors, windows'], ['Changes daily', 'people, furniture, climate'], ['Your tools', 'treatment and finishes'], ['The judge', 'measurement and your ears']])}
        <div class="callout mentor">Work from the top of that list downward. Moving the seat 30 cm is free; fighting the same problem with panels can cost a wall of depth.</div>` },
      { h: 'Factors that affect the acoustics', html: `
        <div class="table-wrap"><table><tr><th>Factor</th><th>What it changes</th><th>How strongly</th><th>What you can do</th></tr>
          <tr><td><b>Volume</b></td><td>How low and how dense the modes are; how long sound takes to decay; how loud the room gets</td><td>Very strong</td><td>Choose the biggest room available; bigger rooms need less heroic bass treatment</td></tr>
          <tr><td><b>Proportions</b></td><td>Whether modes stack on the same notes or spread out</td><td>Strong in small rooms</td><td>Avoid cubes and simple multiples (2:1, 3:1); change one dimension 5–10 % in a new build</td></tr>
          <tr><td><b>Geometry</b></td><td>Parallel walls → flutter; concave curves → focusing; low ceiling → strong early reflection</td><td>Strong above ~300 Hz</td><td>Treat or angle one of each parallel pair; avoid domes and curved corners; cloud under a low ceiling</td></tr>
          <tr><td><b>Wall construction</b></td><td>Light stud walls flex and soak up bass (and leak it out); masonry and concrete reflect nearly all of it</td><td>Strong below ~150 Hz</td><td>Expect a brick or concrete room to need far more bass trapping than a drywall one</td></tr>
          <tr><td><b>Finishes</b></td><td>Tile, plaster, glass reflect; carpet and curtains absorb mids and highs only</td><td>Strong for mids/highs</td><td>Do not “fix” a room with carpet — it removes highs and leaves the boom</td></tr>
          <tr><td><b>Glass</b></td><td>Bright reflections; thin panes also pass and absorb some bass</td><td>Medium</td><td>Keep it off the front wall and first-reflection points; curtains or angled blinds</td></tr>
          <tr><td><b>Furniture</b></td><td>Scatters and absorbs mids; a sofa is a small bass absorber</td><td>Medium</td><td>Use it deliberately: bookshelf at the rear, sofa on the back wall</td></tr>
          <tr><td><b>People</b></td><td>Each adult adds about 0.4–0.5 m² of absorption at mid/high frequencies</td><td>Strong in live rooms and halls</td><td>Tune for the usual occupancy; variable panels for big differences</td></tr>
          <tr><td><b>Temperature</b></td><td>Speed of sound ≈ 331 + 0.6·T (°C): 10 °C shifts every mode by about 2 %</td><td>Small, but real for tuned traps</td><td>Tune traps at working temperature; keep the room conditioned</td></tr>
          <tr><td><b>Humidity</b></td><td>Air absorbs highs differently (matters in large rooms); swells timber, sags fabric, damps wool</td><td>Small acoustically, large for durability</td><td>Hold roughly 40–60 % RH</td></tr>
          <tr><td><b>Seat & speaker position</b></td><td>Which modes you hear and where boundary dips fall</td><td>Very strong, and free</td><td>Start at ≈ 38 % of the length, symmetrical; move in 10 cm steps while measuring</td></tr>
          <tr><td><b>Speaker directivity</b></td><td>How much sound is thrown at the walls instead of at you</td><td>Medium–strong</td><td>Well-behaved speakers make a room easier to treat</td></tr>
          <tr><td><b>Background noise</b></td><td>Masks detail; you turn up and excite the room more</td><td>Strong for recording</td><td>Quiet the HVAC and computers before buying panels</td></tr>
          <tr><td><b>Flanking & leaks</b></td><td>Sound in/out by indirect paths</td><td>Decides isolation</td><td>Isolation is a separate design — see <a href="#/academy/m-iso-basics">Isolation Fundamentals</a></td></tr></table></div>
        <p>Try the factors yourself. Start with an empty hard room, add furniture and people, then add treatment and watch which bands respond.</p>`, viz: 'factorBoard' },
      { h: 'Factors that decide whether a treatment works', html: `
        ${SVG_GAP}
        <div class="table-wrap"><table><tr><th>Factor</th><th>Effect</th><th>Rule of thumb</th></tr>
          <tr><td><b>Thickness</b></td><td>Sets how low a porous absorber reaches</td><td>Useful from about the frequency where depth ≈ λ/8; 50 mm ≈ 400 Hz+, 100 mm ≈ 250 Hz+, 200 mm ≈ 125 Hz+</td></tr>
          <tr><td><b>Air gap</b></td><td>Free extra depth</td><td>A gap equal to the panel thickness is nearly as good as doubling the wool</td></tr>
          <tr><td><b>Flow resistivity / density</b></td><td>Too open = sound passes untouched; too dense = sound bounces off</td><td>≈ 5–20 kPa·s/m² for panels up to 100 mm; lighter, fluffier wool for very deep traps</td></tr>
          <tr><td><b>Area</b></td><td>Absorption = area × coefficient</td><td>One panel changes nothing you can hear; think in square metres</td></tr>
          <tr><td><b>Placement</b></td><td>The same panel does different jobs in different places</td><td>Corners for bass, mirror points for imaging, rear wall for depth, ceiling for clarity</td></tr>
          <tr><td><b>Mounting vs the data sheet</b></td><td>Lab numbers depend on mounting (flat on the floor, or with a 200–400 mm air space)</td><td>Compare products only at the same mounting; see <a href="#/academy/m-lab">Lab Testing</a></td></tr>
          <tr><td><b>Facing</b></td><td>Breathable fabric: no change. Airtight film or paint: highs reflected</td><td>If you cannot blow through it, sound cannot get through it either</td></tr>
          <tr><td><b>Exposed edges</b></td><td>Small spaced panels absorb more per m² than one big sheet</td><td>Leave gaps between panels; do not box in the edges</td></tr>
          <tr><td><b>Angle of incidence</b></td><td>Grazing sound travels further through the absorber</td><td>Side-wall panels work better than their thickness suggests at high frequencies</td></tr>
          <tr><td><b>Tuning accuracy</b></td><td>A resonant trap 10 % off its mode does little</td><td>Measure the mode, build, measure again; add wool to broaden</td></tr>
          <tr><td><b>Sealing</b></td><td>A leaky membrane trap is just a box</td><td>Seal every joint of the cavity; the panel must be the only thing that moves</td></tr>
          <tr><td><b>Humidity & ageing</b></td><td>Sagging fabric, slumped wool, crumbling foam</td><td>Support wool every 600 mm; use rot-proof materials in humid climates</td></tr>
          <tr><td><b>Installation errors</b></td><td>Panels behind furniture, traps blocked by racks, asymmetry</td><td>Keep treatment exposed and mirror it left–right</td></tr></table></div>
        <div class="callout warn">Published coefficients come from large samples in a reverberation room. A few small panels in a small room at 80 Hz will not behave like the table. Use data to compare products, and measurement to judge the room.</div>` },
      { h: 'Designing the right treatment: a method', html: `
        ${SVG_RANGES}
        ${flow([['Measure or predict', 'response, decay per band, modes'], ['List the problems', 'by frequency range'], ['Pick the mechanism', 'pressure, porous, slatted, diffusing'], ['Place it', 'where that problem lives'], ['Size it', 'area from the Sabine sum'], ['Balance', 'check every band'], ['Build & re-measure', 'adjust, then finish']])}
        <div class="formula"><span class="lbl">How much absorption to add</span>A<sub>needed</sub> = 0.161 · V · (1/T<sub>target</sub> − 1/T<sub>now</sub>) &nbsp; (m² of perfect absorber, per band)</div>
        <div class="callout example"><b>Worked example — 5.0 × 3.6 × 2.5 m = 45 m³.</b> Measured RT: 0.8 s at 500 Hz, 1.1 s at 125 Hz. Targets: 0.3 s and 0.4 s.<br>
          <b>500 Hz:</b> 0.161 × 45 × (1/0.3 − 1/0.8) = 7.25 × 2.08 ≈ <b>15 m²</b>. With panels at α ≈ 0.95 → about 16 m² of 100 mm panels — roughly a quarter of the 61 m² of walls and ceiling.<br>
          <b>125 Hz:</b> 7.25 × (1/0.4 − 1/1.1) ≈ <b>11.5 m²</b>. The same 16 m² of 100 mm + 50 mm gap panels (α ≈ 0.5) give only about 8 → the missing 3–4 m² must come from corner traps or membrane traps.<br>
          <b>Below ≈ 160 Hz</b> (this room’s Schroeder frequency) treat individual modes, not RT: see the <a href="#/predict">Room Predictor</a>.</div>
        <div class="table-wrap"><table><tr><th>Problem you hear / measure</th><th>Treatment type</th><th>Depth</th><th>Where</th></tr>
          <tr><td>One or two booming notes, long ridge in the waterfall</td><td>Membrane or Helmholtz trap tuned to the mode; plus seat move</td><td>100–300 mm</td><td>Walls/corners of the dimension that causes it</td></tr>
          <tr><td>Generally thick, slow bass</td><td>Deep porous corner traps</td><td>300–600 mm corner legs</td><td>Every vertical corner you can; wall–ceiling corners</td></tr>
          <tr><td>Boxy, honky low-mids</td><td>Broadband panels with air gap</td><td>100 mm + 50–100 mm gap</td><td>Rear wall, behind speakers, ceiling</td></tr>
          <tr><td>Vague stereo image, harshness</td><td>Broadband panels</td><td>50–100 mm</td><td>Side-wall and ceiling first-reflection points</td></tr>
          <tr><td>Metallic “zing” on claps</td><td>Absorb or scatter one of each parallel pair</td><td>50 mm or a bookshelf</td><td>Bare parallel walls at ear height</td></tr>
          <tr><td>Room already dead on top but still boomy</td><td>Swap thin panels for slatted or membrane faces</td><td>100–200 mm</td><td>Where the thin panels were</td></tr>
          <tr><td>Flat, lifeless live room</td><td>Diffusion, reflective patches, variable panels</td><td>50–200 mm</td><td>Walls and ceiling away from mics</td></tr></table></div>
        <p>Design the placement in the <a href="#/treatment">Treatment Simulator</a>, size the absorbers in the <a href="#/absorbers">Absorber Designer</a>, and see the build recipes in <a href="#/academy/m-treat-designs">Room Treatment Designs</a>.</p>` },
      { h: 'How much is enough?', html: `
        <div class="table-wrap"><table><tr><th>Room</th><th>Typical coverage of walls + ceiling</th><th>Bass trapping</th><th>Leave reflective</th></tr>
          <tr><td>Small mix / production room</td><td>≈ 20–40 % broadband</td><td>As many corners as possible, full height</td><td>Floor, part of the side and rear walls</td></tr>
          <tr><td>Voice-over booth</td><td>≈ 60–80 %, deep</td><td>Deep absorption does both jobs</td><td>Floor, window</td></tr>
          <tr><td>Tracking / live room</td><td>≈ 15–30 %, much of it movable</td><td>Corners; behind drums</td><td>Hard floor, diffusing walls</td></tr>
          <tr><td>Listening / living room</td><td>≈ 10–25 %, disguised</td><td>Two to four corners</td><td>Most of it — furniture does the rest</td></tr></table></div>
        <div class="uc-grid">
          ${uc('🪫', 'Signs of over-treatment', [['You notice', 'Voices sound close and “inside your head”; you raise your voice to talk; cymbals sound cheap'], ['Measures as', 'RT at 2–4 kHz far below RT at 125–250 Hz'], ['Fix', 'Remove thin panels; reface some with slats or perforated board']])}
          ${uc('🫧', 'Signs of under-treatment', [['You notice', 'Bass notes uneven; claps ring; mixes do not translate'], ['Measures as', 'Response swings beyond ± 10 dB below 200 Hz; long tails'], ['Fix', 'Corners first, then reflection points']], '#c7772b')}
          ${uc('🎯', 'The balanced room', [['You notice', 'Speech is easy, bass notes are even, the room disappears'], ['Measures as', 'RT within about ± 25 % from 125 Hz to 4 kHz'], ['Do', 'Stop. Finish the room and get to work']], '#4c9a3a')}
        </div>
        <div class="callout data">A room does not need to be silent to be accurate. Keep the floor hard, keep some scattering surfaces, and aim for an even decay rather than the shortest one.</div>` },
      { h: 'Aesthetics without losing the acoustics', html: `
        <p class="lead">The face of a panel is part of the absorber. Choose it for how it sounds first — then you are free to make it any colour, texture or picture you like. Try each finish over the same absorber:</p>`, viz: 'finishDesigner' },
      { h: 'Finishes and details that work', html: `
        ${SVG_SLATS}
        <div class="table-wrap"><table><tr><th>Element</th><th>What to do</th><th>Why</th></tr>
          <tr><td><b>Fabric</b></td><td>Open weave you can breathe through easily; flame-retardant; stretch over a timber frame</td><td>Acoustically invisible; cheap; any colour</td></tr>
          <tr><td><b>Printed art panels</b></td><td>Dye-sublimation print on acoustically transparent polyester</td><td>Treatment becomes artwork with almost no loss</td></tr>
          <tr><td><b>Slat walls</b></td><td>Slats 20–60 mm wide, gaps 5–15 mm, black fleece and wool behind, ≥ 50 mm cavity</td><td>Absorbs lows and mids, keeps highs alive, looks architectural</td></tr>
          <tr><td><b>Perforated timber</b></td><td>Open area 1–5 % for bass/low-mid, 10–20 % for wide band; wool directly behind</td><td>Open area is the tuning: above ≈ 25 % the board is nearly transparent</td></tr>
          <tr><td><b>Stretched-fabric walls and ceilings</b></td><td>One continuous fabric on tracks with traps, panels and diffusers behind</td><td>The whole surface can work while the room looks plain and calm</td></tr>
          <tr><td><b>Furniture</b></td><td>Deep, irregularly filled bookshelves; a heavy sofa on the rear wall</td><td>Real scattering and some bass absorption. Plants and thin rugs do very little</td></tr>
          <tr><td><b>Lighting</b></td><td>LED strips in the cove of a ceiling cloud or behind slats; quiet drivers, no phase-cut dimmers</td><td>Light hides the depth of the treatment; bad drivers buzz into audio</td></tr>
          <tr><td><b>Colour</b></td><td>Calm mid-tones around the screen; one accent wall; matte surfaces</td><td>Long sessions need low glare and low visual fatigue</td></tr>
          <tr><td><b>Cables</b></td><td>Trunking behind panels, brush plates, a service void under the desk</td><td>A tidy room looks finished and is easier to keep symmetrical</td></tr>
          <tr><td><b>Durability</b></td><td>Removable fabric covers, kick-proof lower panels (slats or perforated board), vacuum-able faces</td><td>Treatment that gets dirty or dented gets removed</td></tr></table></div>
        ${SVG_HIDDEN}
        <div class="callout safety">Fabric, foam and timber on walls and ceilings add fire load. Use flame-retardant fabrics and mineral-wool cores, keep clear of hot light fittings, and check your local fire regulations for wall and ceiling linings — especially in commercial rooms.</div>` },
      { h: 'Six style recipes', html: `
        <div class="uc-grid">
          ${uc('🪵', 'Warm timber studio', [['Look', 'Oak or walnut slats, cream fabric, warm cove lighting'], ['Materials', 'Slat diffsorbers over wool, fabric panels at reflection points, timber floor'], ['Strategy', 'Slats on rear and upper side walls absorb lows/mids and keep highs; broadband only where imaging needs it'], ['Watch out', 'Too many slats = too bright; keep true absorbers at the mirror points']])}
          ${uc('⬜', 'Minimalist white mix room', [['Look', 'Seamless pale walls, no visible panels'], ['Materials', 'Stretched white fabric walls and ceiling over deep treatment'], ['Strategy', 'Full-surface hidden absorption with tuned traps and a rear diffuser behind the cloth'], ['Watch out', 'White shows dirt — removable fabric; glare from screens']], '#5d6b6b')}
          ${uc('🌌', 'Dark cinema / Atmos room', [['Look', 'Charcoal and midnight blue, star-point or cove lighting'], ['Materials', 'Black acoustically transparent fabric, thick ceiling clouds, upholstered seating'], ['Strategy', 'Absorptive rear wall and ceiling so each speaker is heard cleanly; bass traps in all corners'], ['Watch out', 'Leather seats and bare screens reflect; keep overhead speaker positions clear']], '#1f2a44')}
          ${uc('🛋️', 'Living-room studio in disguise', [['Look', 'Looks like a lounge: art, shelves, curtains'], ['Materials', 'Printed art panels, bookshelf diffuser, corner traps dressed as columns, heavy lined curtains'], ['Strategy', 'Every decorative item has a job; ceiling cloud doubles as a light feature'], ['Watch out', 'Symmetry — match what is on the left with the right']], '#b5651d')}
          ${uc('🎥', 'Content-creator backdrop', [['Look', 'Clean, textured wall behind the presenter; soft practical lights'], ['Materials', 'Slat wall or felt panels in shot; broadband panels and a cloud out of shot'], ['Strategy', 'Kill the reflections the microphone hears (ceiling, wall behind camera, desk)'], ['Watch out', 'Treating only what the camera sees; noisy lights and fans']], '#d14b8f')}
          ${uc('🏛️', 'Heritage / character room', [['Look', 'Brick, beams, plaster mouldings kept visible'], ['Materials', 'Free-standing panels and gobos, rugs, heavy drapes on rails, clouds hung from beams'], ['Strategy', 'Reversible treatment that does not fix to the fabric of the building; exposed brick as scattering'], ['Watch out', 'Brick and plaster reflect bass fully — plan deep free-standing traps']], '#4c9a3a')}
        </div>` },
      { h: 'Paint, plaster and “acoustic” finishes', html: `
        <div class="table-wrap"><table><tr><th>Finish</th><th>Does it work?</th><th>Notes</th></tr>
          <tr><td>Acoustic plaster systems (porous plaster over mineral-wool board)</td><td><span class="good">Yes</span> — mid/high absorption with a seamless look</td><td>Specialist installation; do not repaint with ordinary paint</td></tr>
          <tr><td>Micro-perforated panels and films</td><td><span class="good">Yes</span> — tuned absorber, can be transparent</td><td>Needs the designed air space behind; narrow band</td></tr>
          <tr><td>Wood-wool boards</td><td><span class="good">Yes</span> — robust mid/high absorber, better with wool behind</td><td>Spray-paint lightly only</td></tr>
          <tr><td>Perforated gypsum ceilings</td><td><span class="good">Yes</span> — with fleece and wool above</td><td>Common in offices; fine for corridors and lounges</td></tr>
          <tr><td>Thick paint on fabric panels, foam or wood-wool</td><td><span class="bad">No</span> — clogs the pores</td><td>Highs are reflected; the absorber is switched off</td></tr>
          <tr><td>“Soundproof” or “sound-absorbing” paint</td><td><span class="bad">No</span></td><td>A fraction of a millimetre has neither the mass to block nor the depth to absorb</td></tr>
          <tr><td>Textured wallpaper, cork tiles, thin felt</td><td><span class="warn">Barely</span></td><td>A little at the very top of the range</td></tr></table></div>
        ${myth([
          ['“If it looks soft it absorbs.”', 'Only if air can get in and there is depth behind. Leatherette and painted canvas look soft and reflect.'],
          ['“Wood is bad for acoustics.”', 'Solid timber reflects — as slats, perforated panels or diffusers it becomes one of the most useful finishes.'],
          ['“Plants and bean bags will sort it out.”', 'They add a touch of scattering. They do not replace square metres of real absorption.'],
          ['“Treatment has to be ugly.”', 'The best-treated rooms often show no visible panels at all.'],
        ])}` },
      { h: 'Budget vs premium: where looks cost money', html: `
        <div class="table-wrap"><table><tr><th>Item</th><th>Budget route</th><th>Premium route</th><th>Acoustic difference</th></tr>
          <tr><td>Broadband panels</td><td>DIY timber frame, mineral wool, upholstery-grade open fabric</td><td>Factory panels with bevelled edges</td><td>None, at equal depth and density</td></tr>
          <tr><td>Slat wall</td><td>Planed softwood battens on black fleece, stained</td><td>Veneered slat panels on felt</td><td>Small — depth behind matters more than the veneer</td></tr>
          <tr><td>Corner traps</td><td>Stacked wool triangles behind a fabric frame</td><td>Engineered tuned corner units</td><td>Small for broadband; tuned units win on one mode</td></tr>
          <tr><td>Diffusers</td><td>Bookshelf; bent-plywood polycylinders</td><td>Machined 2-D diffusers</td><td>Real, but only if the room is big enough to use it</td></tr>
          <tr><td>Hidden treatment</td><td>Fabric stapled to battens, joints covered by trims</td><td>Track-mounted stretched fabric system</td><td>None; the track system is neater and removable</td></tr>
          <tr><td>Lighting</td><td>LED tape in a timber cove</td><td>Designed lighting scenes</td><td>None — just avoid buzzing drivers</td></tr></table></div>
        <div class="callout alt"><b>Spend on depth, save on dress.</b> Money buys neat edges and veneers; it does not buy absorption that depth and area cannot. Reuse off-cuts as corner infill, buy fabric by the roll, and build one test panel before making twenty. Build guides are in the <a href="#/workshop">Workshop</a>.</div>` },
      { h: 'Problems, solutions and common mistakes', html: `
        <div class="table-wrap"><table><tr><th>Problem</th><th>Cause</th><th>Solution</th></tr>
          <tr><td>Beautiful panels, room still harsh</td><td>Airtight or painted facing</td><td>Reface with breathable fabric; blow test</td></tr>
          <tr><td>Dull yet boomy</td><td>Thin panels everywhere, no bass trapping</td><td>Fewer, deeper panels; corner traps; slatted faces</td></tr>
          <tr><td>Image pulls to one side</td><td>Décor breaks left–right symmetry (window, shelf, door)</td><td>Mirror the treatment; curtain the window; move the desk</td></tr>
          <tr><td>Treatment only where it “looks nice”</td><td>Design led by the photograph</td><td>Fix the positions acoustically first, then style them</td></tr>
          <tr><td>Mirror, glass picture or TV at a reflection point</td><td>Hard specular reflector beside the listener</td><td>Move it, angle it, or swap for a printed acoustic panel</td></tr>
          <tr><td>Slat wall sounds “pingy”</td><td>Identical slats and gaps: one narrow tuning, regular reflections</td><td>Vary widths and gaps; add wool; break up large flat areas</td></tr>
          <tr><td>Fabric sags after a monsoon or winter</td><td>Humidity cycling; natural fibres</td><td>Polyester fabric, re-tension, hold 40–60 % RH</td></tr>
          <tr><td>Tuned trap does nothing</td><td>Off-frequency or leaky</td><td>Measure the mode, seal the box, re-tune</td></tr></table></div>
        <div class="callout warn">The five classic mistakes: (1) choosing the facing before the absorber; (2) covering every wall with 25–50 mm panels; (3) ignoring corners because they are awkward to dress; (4) breaking symmetry for a feature wall; (5) painting it afterwards.</div>` },
      { h: 'A checklist to hand to your interior designer', html: `
        <div class="table-wrap"><table><tr><th>#</th><th>Requirement</th><th>Why it is not negotiable</th></tr>
          <tr><td>1</td><td>Seat and speaker positions are fixed first; the room stays symmetrical about that line</td><td>Stereo imaging</td></tr>
          <tr><td>2</td><td>Reserve depth: ≥ 100–150 mm on treated walls, 400–600 mm in corners, 150–300 mm on the ceiling cloud and rear wall</td><td>Depth is what absorbs bass</td></tr>
          <tr><td>3</td><td>All facings over absorbers are acoustically transparent (breathable fabric, slats, perforations to the stated open area)</td><td>Otherwise the treatment is switched off</td></tr>
          <tr><td>4</td><td>No paint, lacquer or film over absorbent faces</td><td>Clogs the pores</td></tr>
          <tr><td>5</td><td>No mirrors, glass art or screens at the marked reflection points</td><td>Early reflections</td></tr>
          <tr><td>6</td><td>Hard floor kept, with a rug only where specified</td><td>Balance of decay</td></tr>
          <tr><td>7</td><td>Lighting on quiet drivers, no phase-cut dimmers; fittings do not rattle</td><td>Electrical and mechanical noise</td></tr>
          <tr><td>8</td><td>Nothing fixed through isolation layers without the detail being agreed</td><td>Protects the sound isolation</td></tr>
          <tr><td>9</td><td>Flame-retardant fabrics and mineral-wool cores; local fire rules followed</td><td>Safety</td></tr>
          <tr><td>10</td><td>Final measurement before the finishes are signed off</td><td>Proves it works while changes are still cheap</td></tr></table></div>
        <p>Related: <a href="#/academy/m-playbook">The Studio Design Playbook</a> · <a href="#/academy/m-treat-designs">Room Treatment Designs</a> · <a href="#/academy/m-carbon">Activated Carbon for Bass</a> · <a href="#/absorbers">Absorber Designer</a> · <a href="#/diffusers">Diffuser Designer</a> · <a href="#/treatment">Treatment Simulator</a> · <a href="#/predict">Room Predictor</a>.</p>` },
    ],
    quiz: [
      { q: 'Which change usually costs nothing and has the largest effect on the bass you hear?', opts: ['Adding a rug', 'Moving the seat and speakers', 'Painting the walls', 'Buying thicker cables'], a: 1, why: 'Position decides which modes and boundary dips you sit in.' },
      { q: 'A 45 m³ room has RT = 0.8 s at 500 Hz; the target is 0.3 s. Roughly how much absorption must be added?', opts: ['≈ 2 m²', '≈ 7 m²', '≈ 15 m²', '≈ 45 m²'], a: 2, why: '0.161 × 45 × (1/0.3 − 1/0.8) ≈ 15 m² of perfect absorber.' },
      { q: 'You cover a 100 mm absorber with leatherette. What happens?', opts: ['Nothing changes', 'It absorbs more bass and more treble', 'The highs are reflected; it behaves like a membrane', 'It becomes a diffuser'], a: 2, why: 'An airtight face stops air reaching the wool; high frequencies bounce off.' },
      { q: 'On a slat wall, making the gaps narrower (less open area) generally…', opts: ['moves absorption lower and keeps more highs reflective', 'makes it transparent', 'turns it into a broadband absorber', 'has no effect'], a: 0, why: 'Less open area = more “neck mass”: lower tuning, more high-frequency reflection.' },
      { q: 'A small room is dead at high frequencies but still boomy. The best next step is…', opts: ['more thin foam', 'carpet on the walls', 'replace thin panels with deep/corner or slatted-face treatment', 'turn the bass down'], a: 2, why: 'The problem is too little low-frequency absorption and too much at the top.' },
    ],
  };
  const i = window.LESSONS.findIndex((l) => l.id === 'm-playbook');
  window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L);
})();
