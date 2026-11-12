/* ==========================================================================
   Master Class M29 — The Studio Design Playbook: checklist, order of work,
   rules of thumb, mistakes, costs. Plus added sections for existing lessons:
   target modes from dimensions, length-wise vs width-wise, diffusers in
   small rooms. Own words; practical first.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|layout|decision/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const tbl = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<b>${c}</b>` : c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const addTo = (id, secs) => { const l = window.LESSONS.find((x) => x.id === id); if (l) l.sections.push(...secs); };

  /* ---------- diagrams ---------- */
  const STAGES = [['Brief', 'use · loudness · budget', 'c3'], ['Survey', 'size · noise · structure', 'muted'], ['Layout', 'sizes · seat · symmetry', 'accent2'], ['Shell', 'mass · airtight · decoupled', 'accent'], ['Services', 'air · power · signal', 'warn'], ['Interior', 'bass · reflections · life', 'c4'], ['Build', 'right order · inspect', 'good'], ['Tune', 'measure · adjust · record', 'c3']];
  const SVG_PROCESS = `<svg class="gsvg" viewBox="0 0 640 190" role="img" aria-label="The studio design process from brief to commissioning">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">From brief to commissioning: eight stages, one direction</text>
    <path d="M40 78 H600" stroke="var(--line)" stroke-width="6" stroke-linecap="round"/>
    ${STAGES.map(([t, d, c], i) => { const x = 40 + i * 80; return `<circle class="lock-wave${i % 3 === 1 ? ' d2' : i % 3 === 2 ? ' d3' : ''}" cx="${x}" cy="78" r="12" fill="none" stroke="var(--${c})" stroke-width="2"/><circle cx="${x}" cy="78" r="15" fill="var(--${c})"/><text x="${x}" y="83" text-anchor="middle" font-size="12" font-weight="800" fill="var(--panel)">${i + 1}</text><text x="${x}" y="48" text-anchor="middle" font-size="11" font-weight="700">${t}</text>${d.split(' · ').map((w, k) => `<text x="${x}" y="${112 + k * 13}" text-anchor="middle" font-size="9" fill="var(--muted)">${w}</text>`).join('')}`; }).join('')}
    <path d="M40 166 H280" stroke="var(--good)" stroke-width="4"/><text x="160" y="182" text-anchor="middle" font-size="10" fill="var(--good)">paper: changes are free</text>
    <path d="M280 166 H600" stroke="var(--bad)" stroke-width="4"/><text x="440" y="182" text-anchor="middle" font-size="10" fill="var(--bad)">site: every change costs 10× more than the last stage</text>
  </svg>`;

  const SVG_SPLIT = `<svg class="gsvg" viewBox="0 0 640 120" role="img" aria-label="Typical budget split">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Typical budget split for a room-in-room studio</text>
    ${[['Shell: walls, ceiling, floor', 45, 'accent2'], ['HVAC + electrical', 22, 'warn'], ['Treatment', 18, 'c4'], ['Doors + glass', 15, 'good']].reduce((acc, [t, p, c]) => { const x = acc.x, w = p * 6; acc.s += `<rect x="${x}" y="34" width="${w - 3}" height="40" rx="5" fill="var(--${c})"/><text x="${x + w / 2}" y="59" text-anchor="middle" font-size="13" font-weight="800" fill="var(--panel)">${p} %</text><text x="${x + w / 2}" y="90" text-anchor="middle" font-size="10">${t}</text>`; acc.x += w; return acc; }, { x: 20, s: '' }).s}
    <text x="320" y="112" text-anchor="middle" font-size="10" fill="var(--muted)">then add fees (0–12 %) and 15–20 % contingency on top</text>
  </svg>`;

  // worked example 4.6 x 3.4 x 2.5 m
  const EX = { L: [37.3, 74.6, 111.8, 149.1, 186.4], W: [50.4, 100.9, 151.3], H: [68.6, 137.2] };
  const fx = (f) => 60 + (Math.log(f / 30) / Math.log(220 / 30)) * 560;
  const SVG_MODES = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Axial mode ladder for a 4.6 by 3.4 by 2.5 metre room">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Worked example 4.6 × 3.4 × 2.5 m: three ladders of axial modes</text>
    ${[['Length 4.6 m', EX.L, 'c3', 50], ['Width 3.4 m', EX.W, 'accent2', 90], ['Height 2.5 m', EX.H, 'c4', 130]].map(([n, fs, c, y]) => `<text x="54" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--${c})">${n.split(' ')[0]}</text><line x1="60" y1="${y}" x2="620" y2="${y}" stroke="var(--line)"/>${fs.map((f) => `<line x1="${fx(f)}" y1="${y - 13}" x2="${fx(f)}" y2="${y + 13}" stroke="var(--${c})" stroke-width="4"/><text x="${fx(f)}" y="${y - 17}" text-anchor="middle" font-size="9">${Math.round(f)}</text>`).join('')}`).join('')}
    <rect x="${fx(149.1) - 9}" y="32" width="${fx(151.3) - fx(149.1) + 18}" height="78" fill="var(--bad)" opacity=".18"/><text x="${fx(150)}" y="158" text-anchor="middle" font-size="10" fill="var(--bad)" font-weight="700">stacked 149 + 151</text>
    <rect x="${fx(68.6) - 8}" y="60" width="${fx(74.6) - fx(68.6) + 16}" height="86" fill="var(--warn)" opacity=".18"/><text x="${fx(71.5)}" y="158" text-anchor="middle" font-size="10" fill="var(--warn)" font-weight="700">close pair 69 + 75</text>
    <circle class="hot" cx="${fx(37.3)}" cy="50" r="9" fill="none" stroke="var(--bad)" stroke-width="2"/><text x="${fx(37.3)}" y="172" text-anchor="middle" font-size="10" fill="var(--bad)">lowest, alone</text>
    <circle class="hot" cx="${fx(50.4)}" cy="90" r="9" fill="none" stroke="var(--bad)" stroke-width="2"/><text x="${fx(50.4) + 8}" y="186" text-anchor="middle" font-size="10" fill="var(--bad)">seat in its null</text>
    ${[30, 40, 50, 60, 80, 100, 150, 200].map((f) => `<text x="${fx(f)}" y="206" text-anchor="middle" font-size="9" fill="var(--muted)">${f}</text>`).join('')}<text x="630" y="206" text-anchor="end" font-size="9" fill="var(--muted)">Hz</text>
    <line x1="${fx(175)}" y1="30" x2="${fx(175)}" y2="194" stroke="var(--good)" stroke-dasharray="4 4"/><text x="${fx(175) + 4}" y="40" font-size="9" fill="var(--good)">Schroeder ≈ 175</text>
  </svg>`;

  const layout = (x, title, deep, col) => {
    const w = deep ? 150 : 250, h = deep ? 190 : 110, ox = x + (280 - w) / 2, oy = 38 + (190 - h) / 2, cx = ox + w / 2;
    const sy = oy + 22, ey = oy + h * (deep ? 0.4 : 0.52), sx = deep ? 34 : 48;
    return `<text x="${x + 140}" y="26" text-anchor="middle" font-size="12" font-weight="700" fill="var(--${col})">${title}</text>
      <rect x="${ox}" y="${oy}" width="${w}" height="${h}" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/>
      <rect x="${ox + 4}" y="${oy + h - (deep ? 16 : 9)}" width="${w - 8}" height="${deep ? 12 : 5}" fill="var(--c4)"/>
      <rect x="${cx - sx - 7}" y="${sy - 7}" width="14" height="14" fill="var(--accent)"/><rect x="${cx + sx - 7}" y="${sy - 7}" width="14" height="14" fill="var(--accent)"/>
      <circle cx="${cx}" cy="${ey}" r="7" fill="var(--good)"/>
      <path d="M${cx - sx} ${sy} L${ox} ${(sy + ey) / 2} L${cx} ${ey}" fill="none" stroke="var(--warn)" stroke-width="1.5"/>
      <path class="leak-pulse" d="M${cx + sx} ${sy} L${cx + sx / 2} ${oy + h} L${cx} ${ey}" fill="none" stroke="var(--bad)" stroke-width="2"/>
      <text x="${cx}" y="${oy + h + 16}" text-anchor="middle" font-size="10" fill="var(--bad)">${deep ? 'rear bounce: late (10–20 ms)' : 'rear bounce: early (1–5 ms)'}</text>
      <text x="${cx}" y="${oy + h + 30}" text-anchor="middle" font-size="10" fill="var(--muted)">${deep ? 'side walls close, equal, treatable' : 'side walls far · head near rear wall'}</text>`;
  };
  const SVG_LAYOUTS = `<svg class="gsvg" viewBox="0 0 640 276" role="img" aria-label="Length-wise and width-wise layouts compared">
    ${layout(20, 'Length-wise (desk on a short wall)', true, 'good')}${layout(340, 'Width-wise (desk on a long wall)', false, 'warn')}
  </svg>`;

  const SVG_DIFF = `<svg class="gsvg" viewBox="0 0 640 200" role="img" aria-label="Diffusers need distance">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">A diffuser needs distance before its scattered sound blends</text>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${30}" y="${34 + i * 11}" width="${8 + ((i * i) % 7) * 4}" height="9" fill="var(--accent2)"/>`).join('')}
    <rect x="62" y="30" width="230" height="140" fill="var(--bad)" opacity=".1"/><rect x="292" y="30" width="328" height="140" fill="var(--good)" opacity=".1"/>
    ${[-2, -1, 0, 1, 2].map((s) => `<path class="wave-in" d="M70 ${100 + s * 24} q20 ${s * 4} 60 ${s * 9}" fill="none" stroke="var(--bad)" stroke-width="2.5"/>`).join('')}
    ${[0, 1, 2].map((k) => `<path class="lock-wave${k ? ' d' + (k + 1) : ''}" d="M${360 + k * 70} 50 q30 50 0 100" fill="none" stroke="var(--good)" stroke-width="2"/>`).join('')}
    <line x1="292" y1="30" x2="292" y2="170" stroke="var(--text)" stroke-dasharray="4 4"/>
    <text x="177" y="46" text-anchor="middle" font-size="11" font-weight="700" fill="var(--bad)">too close: separate lobes</text><text x="177" y="162" text-anchor="middle" font-size="10" fill="var(--muted)">sounds phasey, coloured</text>
    <text x="456" y="46" text-anchor="middle" font-size="11" font-weight="700" fill="var(--good)">far enough: even, spacious</text><text x="456" y="162" text-anchor="middle" font-size="10" fill="var(--muted)">scattered sound has blended</text>
    <text x="292" y="188" text-anchor="middle" font-size="11" font-weight="700">≈ 3 wavelengths of the lowest working frequency</text>
  </svg>`;

  /* =====================================================================
     A) The lesson
     ===================================================================== */
  const L = {
    id: 'm-playbook', n: 'M29', track: 'master', title: 'The Studio Design Playbook: Checklist, Order of Work, Rules of Thumb, Costs', level: 'Core', mins: 55,
    summary: 'Everything in this track turned into one working method: a checklist you can tick off, the order to plan and build in, the numbers to remember, the mistakes to avoid, and how to cost a studio and spend where it counts.',
    tags: ['checklist', 'design process', 'build order', 'rules of thumb', 'mistakes', 'cost', 'budget', 'home studio', 'professional studio'],
    sections: [
      { h: 'The whole process in one picture', html: `
        <p class="lead">A studio is designed in one direction: decide <b>what it is for</b>, find out <b>what you have</b>, draw the <b>layout</b>, design the <b>shell</b>, thread the <b>services</b> through it, shape the <b>sound inside</b>, build in the right <b>order</b>, then <b>measure and tune</b>. Skipping forward is what makes studios expensive.</p>
        ${SVG_PROCESS}
        ${flow([['Targets first', 'noise, isolation, RT, budget — as numbers'], ['Paper before timber', 'every decision drawn and checked'], ['Holes are designed', 'doors, glass, ducts, cables'], ['Close nothing unseen', 'inspect and photograph every cavity'], ['Measure, then treat', 'tune with data, EQ last']])}
        <div class="callout mentor">Home or professional, the steps are identical. Only the depth changes: at home you are the acoustician, project manager and labourer; in a professional build each step has a specialist and a drawing.</div>` },
      { h: 'The design checklist (tick it off — it saves)', html: `
        <p>Switch between <b>Home studio</b> and <b>Professional facility</b>. Each item carries its rule of thumb. Your ticks are stored on this device, so you can come back to it through the project.</p>
        <div class="callout data"><b>How to use it:</b> do not start a phase until the one before it is complete on paper. Phases 1–5 are planning; nothing is built until phase 5 is ticked.</div>`, viz: 'designChecklist' },
      { h: 'The order for planning and execution', html: `
        <p>Planning runs <i>outside-in</i> (targets → building → room → details). Building runs <i>structure-out</i>: the things you can never reach again go in first.</p>
        ${tbl(['Never do this…', '…before this', 'Because'], [
          ['Order materials', 'The services drawing exists (ducts, conduits, tie-lines)', 'Every service is a hole in the shell; unplanned holes are cut through finished isolation'],
          ['Build inner walls', 'The floating floor (if any) is down and loaded', 'Walls on an unloaded floor change its tuning; walls beside it bridge the perimeter gap'],
          ['Close a wall or ceiling', 'Insulation is in, cables pulled, photos taken', 'It is the last time you will see inside'],
          ['Fit doors and glass', 'Heavy, dusty and wet work is finished', 'Seals and glass get damaged; frames move as the building dries'],
          ['Apply finishes', 'The leak test and an interim isolation check pass', 'Finding a leak behind finished fabric costs ten times more'],
          ['Install treatment', 'You have measured the bare room', 'You treat the modes you have, not the ones you guessed'],
          ['Use EQ', 'Seat, speakers and traps are right', 'EQ cannot fill nulls or shorten decay much'],
        ])}`, viz: 'buildTimeline' },
      { h: 'Rules of thumb — the sheet to pin on the wall', html: `
        <h4>Room size, seat and speakers</h4>
        ${tbl(['Topic', 'Rule', 'Note'], [
          ['Proportions', 'Avoid cubes and whole-number multiples (1:1, 1:2, 2:3 exactly)', 'Ratios spread modes; they do not remove them'],
          ['First mode of a dimension', 'f = c / 2L = 343 / (2 × L)', '5 m → 34 Hz; 2.5 m → 69 Hz'],
          ['Where modes stop ruling', 'Schroeder: f<sub>S</sub> ≈ 2000 · √(RT / V)', '40 m³, 0.3 s → ≈ 173 Hz'],
          ['Seat', 'Start at ≈ 38 % of the length from the front wall; never at 50 %', 'Then measure and move in 10 cm steps'],
          ['Orientation', 'Face down the length, left–right symmetry', 'Doors and windows off the front wall'],
          ['Speaker to front wall', 'Dip at c / 4d: keep d &lt; 0.2 m or &gt; 1.1 m — or flush-mount', '0.5–1 m puts the dip at 85–170 Hz'],
          ['Triangle', 'Equilateral, tweeters at ear height, aimed at or just behind the head', ''],
        ])}
        <h4>Isolation, doors, windows, floors</h4>
        ${tbl(['Topic', 'Rule', 'Note'], [
          ['Order of cheapness', 'Airtight → heavy → decoupled → damped', 'Seal before you add mass'],
          ['Mass law', 'Doubling mass ≈ +5–6 dB (single leaf)', 'Decoupled double leaf: much more'],
          ['Double-leaf resonance', 'f₀ ≈ 60 · √((m₁+m₂)/(m₁·m₂·d)) (≈ 50 with wool)', 'Keep f₀ ≥ an octave below the lowest problem frequency'],
          ['Gaps', 'A 10 mm gap under a door caps the wall at ≈ 30 dB', 'Torch test every seal'],
          ['Doors', 'Door ≈ wall − 10 dB at most; otherwise use a sound lock', 'Two sealed doors ≈ 55–65 dB'],
          ['Windows', 'Two panes, different thickness, gap ≥ 100 mm, lined reveals', 'Keep the area small'],
          ['Floating floor', 'f<sub>n</sub> ≈ 15.8 / √d (d = static deflection, mm)', 'Isolates only above √2 · f<sub>n</sub>; ≤ half the structural floor'],
          ['Third leaf', 'Never add a layer in the middle of a cavity', 'Mass goes on the outer leaves'],
        ])}
        <h4>Services</h4>
        ${tbl(['Topic', 'Rule', 'Note'], [
          ['Duct velocity', 'Mains &lt; 3 m/s, final runs and grilles &lt; 1.5–2 m/s', 'Big ducts are the cheapest silencer'],
          ['Noise floor', 'NC 15–20 recording rooms, NC 20–25 control rooms', 'Measure with HVAC on'],
          ['Duct penetrations', 'Silencer or baffle box at every isolation wall', 'One branch per room: no crosstalk'],
          ['Power', 'All audio from one technical supply; safety earth never lifted', 'Licensed electrician'],
          ['Cables', 'Audio beside its power (zero loop area); mic lines away from speaker and dimmer cables', 'Conduits offset, sealed, with spares'],
        ])}
        <h4>Treatment and targets</h4>
        ${tbl(['Topic', 'Rule', 'Note'], [
          ['Porous depth', 'Reach toward λ/4; useful from ≈ λ/8', '100 Hz: λ/4 = 0.86 m → use corners and gaps'],
          ['Air gap', 'Gap ≈ panel thickness lowers the range by about an octave', '100 mm + 100 mm gap ≫ 100 mm on the wall'],
          ['Below ≈ 80 Hz', 'Pressure traps (membrane / Helmholtz) on walls and in corners', 'Porous would need metres'],
          ['RT', '0.2–0.3 s small control rooms, flat across bands; tracking rooms 0.3–0.8 s by size and style', 'Bass not longer than mids'],
          ['Response window', '± 5 dB very good at home, ± 3 dB professional (smoothed, at the seat)', 'Decay matters more than the line'],
          ['Diffusers', 'Listener ≥ ≈ 3 wavelengths of the lowest working frequency away', 'In small rooms: absorb or use diffsorbers'],
          ['Thin absorber', 'Do not cover everything with 25–50 mm material', 'Dull highs, boomy lows'],
        ])}` },
      { h: 'Mistakes to avoid — what they cost and the fix', html: `
        <h4>Planning</h4>
        ${tbl(['Mistake', 'What happens', 'Fix'], [
          ['No numeric targets', 'Nobody knows when the room is “good enough”; money goes to the wrong places', 'Write NC, isolation per band, RT and budget before drawing'],
          ['Confusing treatment with isolation', 'Foam everywhere, neighbours still complain', 'Design them as two separate jobs'],
          ['Forgetting the depth of isolation and traps', 'A 2.4 m ceiling ends at 2.05 m; the room is too small', 'Subtract every layer on the drawing first'],
          ['Ignoring the structure', 'Floor cannot carry the mass; cracks, deflection, danger', 'Structural check before design'],
          ['Seat at the centre, desk on the wrong wall', 'Bass nulls and asymmetry for the life of the room', 'Lay out seat and speakers before anything else'],
        ])}
        <h4>Isolation</h4>
        ${tbl(['Mistake', 'What happens', 'Fix'], [
          ['Unsealed gaps and back-to-back boxes', 'A 60 dB wall performs like 35–40 dB', 'Sealant, putty pads, offset boxes'],
          ['A rigid bridge (screw, pipe, mortar)', 'Up to 10 dB lost; floating floor “shorted”', 'Inspect before closing; perimeter strips'],
          ['The triple-leaf wall', 'Bass isolation worse than before the “upgrade”', 'One deep cavity, mass on the outside'],
          ['Good wall, ordinary door', 'The door sets the result', 'Sealed heavy door or a sound lock'],
          ['Floating a floor that did not need it', 'Budget gone, height lost, sometimes worse bass', 'Only for drums / structure-borne paths'],
        ])}
        <h4>Services</h4>
        ${tbl(['Mistake', 'What happens', 'Fix'], [
          ['No ventilation in an airtight room', 'Stuffy in 20 minutes; holes cut later', 'Design quiet fresh air from day one'],
          ['Small ducts, fast air', 'Hiss on every recording', 'Bigger ducts, more grilles, silencers'],
          ['A shared duct between two rooms', 'Speech and drums travel down the duct', 'Separate branches with silencers'],
          ['Lifting the safety earth to kill hum', 'Lethal fault condition', 'Fix the loop: one supply, balanced lines, cable routes'],
          ['No spare conduits', 'New holes through finished walls', 'Install 50 % spare capacity, capped and sealed'],
        ])}
        <h4>Treatment and measurement</h4>
        ${tbl(['Mistake', 'What happens', 'Fix'], [
          ['Thin foam on every surface', 'Dead highs, untouched bass', 'Fewer, deeper, broadband traps'],
          ['Diffusers too close to the seat', 'Phasey colouration', 'Absorb, or diffsorbers; check the distance'],
          ['Treating before measuring', 'Traps tuned to the wrong frequencies', 'Measure the bare room first'],
          ['Boosting nulls with EQ', 'Amplifier strain, no improvement', 'Move seat/speakers; cut peaks only'],
          ['One measurement, one position', 'You tune for a point in space', 'Average several positions around the head'],
        ])}` },
      { h: 'How to calculate the cost', html: `
        ${SVG_SPLIT}
        <div class="formula"><span class="lbl">The method</span>Cost = Σ (quantity × unit rate) + fees + contingency (15–20 %)</div>
        ${flow([['Take off quantities', 'm² of wall, ceiling, floor; doors; panes; metres of duct & cable'], ['Unit rates', 'local prices for materials, then labour if hired'], ['Add the holes', 'doors, glass, silencers, panels — priced each'], ['Fees', 'design, structural, electrical sign-off'], ['Contingency', '15–20 %: it will be used']])}
        <h4>Worked example: 16 m² home mix room (4 × 4 m × 2.5 m), light isolation, DIY</h4>
        ${tbl(['Item', 'Quantity', 'Indicative', 'Subtotal'], [
          ['Acoustic sealant, backer rod, putty pads', '6 tubes + pads', '', '$50'],
          ['Solid-core door, compression seals, drop seal', '1 set', '', '$280'],
          ['Removable window plug', '1', '', '$75'],
          ['Corner bass traps (wool, timber, fabric)', '4 floor-to-ceiling', '$70 each', '$280'],
          ['Broadband panels 100 mm (walls + rear)', '10', '$40 each', '$400'],
          ['Ceiling cloud', '1 (1.2 × 1.8 m)', '', '$110'],
          ['Power distribution, cable management', '', '', '$120'],
          ['Measurement microphone', '1', '', '$100'],
          ['<b>Subtotal</b>', '', '', '<b>$1 415</b>'],
          ['Contingency 15 %', '', '', '$210'],
          ['<b>Total</b>', '', '', '<b>≈ $1 600 (≈ $100 / m²)</b>'],
        ])}
        <div class="callout data">The same room as a full room-in-room (independent walls and ceiling, two doors, quiet ventilation) is typically <b>5–10 times</b> that. A professional facility adds structure, floated slabs, specialist doors, ducted HVAC, engineering fees and commissioning: budget per m² rises by another factor of several, and fees of 8–12 % are normal. Prices vary strongly by country — treat every figure here as a proportion, and get real quotes.</div>
        <p>Use the calculator to see how each decision moves the total and the split:</p>`, viz: 'costCalc' },
      { h: 'Cheap <i>and</i> effective: where each dollar works hardest', html: `
        ${tbl(['Priority', 'Do this', 'Typical gain', 'Cost'], [
          ['1', 'Position: seat, speakers, symmetry', 'Often the biggest audible change', 'Free'],
          ['2', 'Seal: sealant, door seals, drop seal', '+8–12 dB at the weak points', 'Very low'],
          ['3', 'DIY bass traps and broadband panels', 'Even bass, clear imaging', 'Low'],
          ['4', 'Solid door / window plug or second pane', '+10–15 dB at that element', 'Low–medium'],
          ['5', 'Second board layer with damping', '+5–8 dB on a light wall', 'Medium'],
          ['6', 'Independent walls and ceiling', '+15–25 dB', 'High'],
          ['7', 'Floating floor', 'Only when structure-borne sound demands it', 'Highest'],
        ])}
        <div class="uc-grid">
          ${uc('🛠️', 'Do it yourself', [['Good DIY jobs', 'Insulation, sealing, panels and traps, fabric frames, cable pulling, painting, measuring'], ['Why', 'Labour-heavy, low risk, easy to inspect']])}
          ${uc('👷', 'Hire it', [['Always professional', 'Structure, electrics, gas, HVAC refrigerant, fire stopping, large glass'], ['Why', 'Safety, regulations, insurance']], '#c7772b')}
          ${uc('🔁', 'Material swaps', [['Instead of…', 'Branded “acoustic” board → standard dense gypsum + damping compound · bought panels → mineral wool + timber + fabric · mass-loaded vinyl → a second board layer · acoustic door → solid core + seals + added MDF'], ['Saves', 'Typically 50–80 % for the same physics']], '#4c9a3a')}
          ${uc('⛔', 'Never economise on', [['These', 'Structural capacity · electrical safety and earthing · ventilation and fresh air · fire safety and escape · moisture control'], ['Because', 'They cannot be fixed later — and they are about people, not sound']], '#c0392b')}
        </div>
        ${myth([
          ['“Spend the money on expensive products.”', 'Spend it on depth, mass, sealing and planning. Physics does not read brand names.'],
          ['“Cheap means thin.”', 'Cheap mineral wool, used <i>thick</i> and in corners, outperforms costly thin panels.'],
          ['“I’ll fix it with EQ / room correction.”', 'Correction polishes a good room; it cannot repair nulls, long decay or leaks.'],
        ])}` },
      { h: 'Use cases: the five decisions that mattered', html: `
        <div class="uc-grid">
          ${uc('🛏️', 'Bedroom producer', [['Decisions', '① Desk on the short wall, seat at 38 % ② Four corner traps before any wall panels ③ Door seals + window plug instead of “soundproof foam” ④ Speakers on stands 15 cm from the wall ⑤ Mix at moderate level, measure with a $100 mic'], ['Result', 'Translating mixes for about $1 500']])}
          ${uc('🥁', 'Garage drum room', [['Decisions', '① Target from the neighbour’s bedroom, per octave ② Room-in-room on the slab — no floating floor needed on ground ③ Two doors back-to-back ④ Silenced fresh air planned first ⑤ Leak test before finishes'], ['Result', 'Evening practice without complaints']], '#c7772b')}
          ${uc('🎚️', 'Basement mix room', [['Decisions', '① Structural and damp check first ② Ceiling on hangers: the only lightweight boundary ③ Subtracted 300 mm before choosing the layout ④ Technical power from one sub-panel ⑤ Measured bare room, then tuned two membrane traps'], ['Result', '± 4 dB at the seat, NC 20']], '#7a5cc7')}
          ${uc('🎙️', 'Podcast studio in an office', [['Decisions', '① Target was speech privacy + low noise, not music isolation ② Sealed door, secondary glazing ③ Quiet ventilation — the old grille was the noise ④ 100 mm absorption on two walls + ceiling ⑤ Table surface treated for reflections'], ['Result', 'Broadcast-quiet for a modest fit-out']], '#2b9fc7')}
          ${uc('🏫', 'School music suite', [['Decisions', '① Noisy rooms grouped away from classrooms ② Corridor as buffer; doors with seals and small vision panels ③ Room heights for ensemble loudness ④ Ducted air, no door grilles ⑤ Variable absorption (curtains) for different uses'], ['Result', 'Rooms usable at the same time']], '#c7a12b')}
          ${uc('🏢', 'Commercial facility', [['Decisions', '① Brief and adjacency plan with the whole team ② Each studio a separate box on its own floated slab ③ Sound locks and machine room ④ Tie-lines and HVAC coordinated in one drawing set ⑤ Commissioning measurements written into the contract'], ['Result', 'Rooms that meet their numbers on day one']], '#4c9a3a')}
        </div>` },
      { h: 'One-page summary', html: `
        ${flow([['Decide', 'use, loudness, targets, budget'], ['Survey', 'dimensions, noise, structure, rules'], ['Lay out', 'sizes, modes, seat, symmetry'], ['Shell', 'airtight, heavy, decoupled, damped'], ['Services', 'air, power, signal — sealed'], ['Interior', 'bass, reflections, balance'], ['Build', 'in order, inspect, test'], ['Tune', 'measure, move, treat, EQ last']])}
        <div class="callout mentor"><b>If you remember only five things:</b> ① targets before drawings; ② the weakest element sets the isolation — seal first; ③ position and bass trapping before anything decorative; ④ every pipe, duct and cable is a designed hole; ⑤ measure before and after every change.</div>
        <p>Go deeper: <a href="#/academy/m-iso-basics">Isolation Fundamentals</a> · <a href="#/academy/m-door-build">Doors, Seals & Windows</a> · <a href="#/academy/m-small-rooms">Small-Room Acoustics</a> · <a href="#/academy/m-control">Control Rooms</a> · <a href="#/academy/m-hvac">HVAC</a> · <a href="#/predict">Room Predictor</a> · <a href="#/treatment">Treatment Simulator</a> · the four <a href="#/academy/m-plan-bedroom">studio PLANS</a>.</p>` },
    ],
    quiz: [
      { q: 'What must exist before any materials are ordered?', opts: ['The fabric colour', 'Numeric targets and a services drawing', 'The monitor speakers', 'A room-correction licence'], a: 1, why: 'Targets decide the design; services are holes that must be planned into the shell.' },
      { q: 'Which is the best first spend in a leaky room?', opts: ['Floating floor', 'Diffusers', 'Sealant, door seals and a drop seal', 'Thicker carpet'], a: 2, why: 'Leaks dominate; sealing gains 8–12 dB at the weak points for very little.' },
      { q: 'When is the right time to install acoustic treatment?', opts: ['Before the walls are closed', 'After measuring the finished bare room', 'Before the doors', 'Whenever it arrives'], a: 1, why: 'You treat the modes and reflections you actually have.' },
      { q: 'A cost estimate should end with…', opts: ['Nothing — quantities × rates is enough', 'Fees and a 15–20 % contingency', 'A 50 % discount', 'The speaker budget'], a: 1, why: 'Fees and contingency are part of every real project.' },
      { q: 'What should never be economised on?', opts: ['Fabric', 'Brand-name panels', 'Structure, electrics, ventilation and fire safety', 'Diffusers'], a: 2, why: 'They protect people and cannot be fixed later.' },
    ],
  };
  window.LESSONS.push(L);

  /* =====================================================================
     B1) Target modes from dimensions
     ===================================================================== */
  const TARGETS = {
    h: 'Calculating your target modes from the room dimensions — and designing them in', html: `
      <p class="lead">You can know which bass frequencies will trouble a room <b>before it is built</b>, from three numbers: length, width and height. Then you reserve the depth for the right traps in the drawing instead of squeezing them in afterwards.</p>
      ${flow([['List the ladders', 'f = n · 343 / (2 × dimension), up to ≈ 200 Hz or Schroeder'], ['Mark the trouble', 'stacked (within ≈ 5 %), isolated (gap > ≈ 20 Hz), seat at a null or peak'], ['Rank', 'axial first, lowest and stacked highest'], ['Choose the trap', 'pressure trap tuned to f, or porous ≥ λ/8 deep'], ['Reserve the depth', 'draw it into walls, corners and ceiling'], ['Adjust and re-check', 'new build: change one dimension 5–10 %']])}
      ${SVG_MODES}
      <h4>Worked example: 4.6 × 3.4 × 2.5 m (39 m³)</h4>
      ${tbl(['Dimension', 'c / 2L', 'Axial modes (Hz)'], [
        ['Length 4.6 m', '343 / 9.2 = 37.3', '37 · 75 · 112 · 149 · 186'],
        ['Width 3.4 m', '343 / 6.8 = 50.4', '50 · 101 · 151 · 202'],
        ['Height 2.5 m', '343 / 5.0 = 68.6', '69 · 137 · 206'],
      ])}
      <p>Seat at 38 % of the length, on the centre line, ears at 1.2 m. On the centre line every <i>odd</i> width mode has a null (50, 151 Hz) and every <i>even</i> one a peak (101 Hz); at 1.2 m the ear is almost on the null of the first height mode (69 Hz) and near the peak of the second (137 Hz).</p>
      ${tbl(['Target', 'Why', 'Trap', 'Where', 'Depth to reserve'], [
        ['37 Hz (L1)', 'Lowest, on its own, rings long', 'Membrane: 10 kg/m² over ≈ 180 mm wool-filled cavity', 'Rear wall and front corners', '200–250 mm on the rear wall'],
        ['50 Hz (W1)', 'Seat is in its null (centre line) — the note vanishes', 'Membrane: 10 kg/m² over ≈ 100 mm; cannot be EQ’d', 'Side walls, low, and vertical corners', '120–150 mm on side walls'],
        ['69 + 75 Hz (H1, L2)', 'Close pair → one broad boom', 'Deep porous corner traps + thick cloud', 'Wall–ceiling corners, rear wall', '400–600 mm corner legs'],
        ['101 Hz (W2)', 'Peak at the seat', 'Porous ≥ 0.42 m (λ/8), or 6 mm ply over ≈ 70 mm', 'Side walls', '100 mm panel + 100–300 mm gap'],
        ['137 Hz (H2)', 'Peak at ear height', 'Ceiling cloud 100 mm + 200 mm gap', 'Above the seat', '300 mm below the ceiling'],
        ['149 + 151 Hz (L4, W3)', 'Stacked within 1.5 %', 'Broadband corner traps', 'All vertical corners', 'Covered by the corner traps'],
      ])}
      <div class="formula"><span class="lbl">Sizing the two trap types</span>Membrane cavity depth D ≈ (50 / f)² / m &nbsp;(m in kg/m², wool-filled) · Porous depth ≥ λ/8 = 343 / (8 · f)</div>
      <div class="callout example"><b>Designing it in:</b> this room loses about 250 mm at the rear wall, 150 mm on each side wall, 300 mm under the ceiling and the four corners. Drawn at the start, the finished room is 4.35 × 3.1 × 2.2 m of clear space with even bass. Discovered at the end, there is nowhere to put any of it.</div>
      <div class="callout alt"><b>New build?</b> Unstack on paper instead: making the room 4.9 m long moves the length ladder to 35 · 70 · 105 · 140 Hz, pulling 140 away from the 151 Hz width mode — but it lands 70 on the 69 Hz height mode, so check the whole ladder again. Change one dimension by 5–10 %, re-run, repeat.</div>
      <p>The planner below does all of this for your dimensions — click a row to see that mode’s pressure map and where your seat sits in it. Then take the result into the <a href="#/predict">Room Predictor</a> and the <a href="#/treatment">Treatment Simulator</a>.</p>`, viz: 'modeTargets',
  };
  addTo('modes-treat', [TARGETS]);
  addTo('m-small-rooms', [TARGETS]);

  /* =====================================================================
     B2) Length-wise vs width-wise
     ===================================================================== */
  addTo('m-control', [{
    h: 'Designing length-wise or width-wise: problems and solutions', html: `
      <p>The earlier section “Which way should the desk face? (checked)” gives the short answer. Here is the full comparison, with the fix for every problem either choice creates.</p>
      ${SVG_LAYOUTS}
      ${tbl(['Issue', 'Length-wise (desk on a short wall)', 'Width-wise (desk on a long wall)', 'Fix when it is a problem'], [
        ['Rear-wall reflection', 'Late: 10–20 ms with ≥ 1.7 m behind the seat', 'Early: 1–5 ms; smears imaging and tone', 'Rear absorption ≥ 300 mm (width-wise: as deep as you can afford)'],
        ['Side reflections', 'Walls close and equal: strong but easy to treat symmetrically', 'Walls far: weak, late — sounds wide', 'Panels at the mirror points; keep left = right'],
        ['Modes at the seat', 'Room to slide the seat along the long ladder to avoid nulls', 'Seat pinned between front and rear wall — few options', 'Move in 10 cm steps while measuring; traps for what remains'],
        ['Bass at the head', 'Head well away from the rear pressure zone', 'Head close to the rear wall: inflated bass', 'Pull the desk forward; pressure traps on the rear wall'],
        ['Speaker-boundary dips', 'Space to choose d (or flush-mount)', 'Speakers pushed against the front wall', 'Very close (&lt; 0.2 m) or flush; boundary EQ'],
        ['Desk and gear width', 'Limited by the room width', 'Generous — room for a large console or three screens', 'Side racks rather than a wider desk'],
        ['Client seating', 'Couch behind the engineer, in a usable field', 'Clients beside the engineer or against the rear wall', 'Accept, or raise a rear couch away from the wall'],
        ['Surround / height speakers', 'Rear speakers have distance', 'Rears very close to the head', 'Length-wise for immersive rooms'],
      ])}
      <div class="callout data"><b>When width-wise is justified:</b> the room is large (≥ ≈ 5 m front-to-back after treatment), a wide console is unavoidable, a door or window makes the short wall unusable, or the room is so long and narrow that side walls would be within ≈ 1 m of the ears. Then budget for a very deep rear wall and near-field monitoring.</div>
      <div class="uc-grid">
        ${uc('📏', 'Long narrow room (6 × 2.8 m)', [['Problem', 'Side walls 1.4 m from the ears: strong early side reflections; long ladder of length modes'], ['Layout', 'Length-wise. Thick side panels at the mirror points, seat at ≈ 38 %, the rear third becomes a deep trap or a booth']])}
        ${uc('⬜', 'Nearly square room (4 × 3.8 m)', [['Problem', 'Length and width modes almost stacked'], ['Layout', 'Either way is acoustically similar — choose the wall without doors/windows as the front, keep symmetry, and spend on corner traps and two tuned traps for the stacked pair']], '#7a5cc7')}
        ${uc('▭', 'Wide shallow room (3 × 6 m)', [['Problem', 'Only 3 m deep whichever way gives width'], ['Layout', 'Width-wise is forced if you want width for gear; then: near-fields close to the front wall, 400–600 mm rear absorption, seat ≈ 1.3 m from the front. Better: partition 1.5 m off one end as a booth or store and work length-wise in the remaining 4.5 × 3 m']], '#c7772b')}
      </div>
      <p>Try both orientations with your own dimensions and watch the reflection timing and the mode levels at the seat:</p>`,
    viz: (host) => V.facing(host),
  }]);

  /* =====================================================================
     B3) Diffusers in small rooms
     ===================================================================== */
  const DIFFUSERS = {
    h: 'Diffusers in small rooms — control rooms and studios', html: `
      <p class="lead">Diffusion scatters a reflection in space and time instead of removing it. In large rooms that keeps life without echoes. In small rooms it only helps where there is <b>enough distance</b> for the scattered sound to blend — and where the bass is already under control.</p>
      ${SVG_DIFF}
      ${tbl(['', 'Diffusion helps when…', 'Diffusion hurts when…'], [
        ['Distance', 'Listener or microphone is ≥ ≈ 3 wavelengths of the diffuser’s lowest working frequency away', 'You sit or record close: separate lobes, comb filtering, “phasey” tone'],
        ['Room balance', 'Bass and first reflections are already treated and the room feels too dead', 'It replaces bass trapping — diffusers do nothing below their design frequency'],
        ['Surface', 'A large far wall or high ceiling would otherwise slap back', 'It is at a first-reflection point near the ears (unless designed for it)'],
      ])}
      <div class="formula"><span class="lbl">Working range of a well (QRD-type) diffuser</span>lowest ≈ set by the maximum well depth · highest ≈ c / (2 × well width) · distance ≈ 3 · c / f<sub>lowest</sub></div>
      <div class="callout example">A 7-well diffuser 150 mm deep starts working around 650 Hz (λ ≈ 0.52 m) → sit at least ≈ 1.6 m away. Make it 300 mm deep to reach ≈ 330 Hz and the distance grows to ≈ 3.1 m — more than most small rooms have behind the seat.</div>
      <h4>Control rooms</h4>
      <ul><li><b>Rear wall:</b> diffuse only if the seat is ≥ ≈ 2–3 m from it. Closer than that, use deep absorption (≥ 200–300 mm) or a <b>diffsorber</b> — a slotted or perforated face over absorber that absorbs lows and mids and scatters highs.</li>
      <li><b>Upper side walls and rear ceiling:</b> good places for shallow 2-D diffusers; they are far from the ears and keep some high-frequency life.</li>
      <li><b>First-reflection points close to the ears:</b> absorb (or redirect) — not diffuse.</li></ul>
      <h4>Studios and live rooms</h4>
      <ul><li>Scatter one of each pair of parallel walls to kill flutter and make the room sound larger: poly-cylinders, angled panels, bookshelves, slatted walls.</li>
      <li>Diffuse the <b>ceiling</b> above drums and ensembles if it is high enough (≥ ≈ 3 m); otherwise absorb above the overheads.</li>
      <li>Keep microphones ≥ 1–1.5 m from phase-grating diffusers; curved surfaces are forgiving and can be closer.</li></ul>
      <h4>Booths</h4>
      <p>No. There is no distance. Use deep broadband absorption and keep one small reflective surface (a window, a wooden panel) if the booth feels unnaturally dead.</p>
      ${tbl(['Option', 'Typical depth', 'Works from – to', 'Minimum distance', 'Cost / notes'], [
        ['Bookshelf with irregular books', '200–300 mm', '≈ 500 Hz – 4 kHz', '≈ 0.7–1 m', 'Almost free; also absorbs a little'],
        ['Poly-cylinder (bent 4–6 mm ply over wool)', '150–300 mm', '≈ 250 Hz – 8 kHz', '≈ 1 m', 'Cheap, also a bass absorber'],
        ['Slatted diffsorber over 100 mm wool', '120–150 mm', 'absorbs &lt; 1 kHz, scatters above', '≈ 0.6 m', 'Best all-rounder for small rear walls'],
        ['2-D skyline blocks', '50–150 mm', '≈ 1 – 8 kHz', '≈ 1 m', 'Ceilings and upper walls'],
        ['QRD, 7 wells, 150 mm', '150 mm', '≈ 650 Hz – 3.4 kHz (50 mm wells)', '≈ 1.6 m', 'Needs accuracy in building'],
        ['QRD, 13 wells, 300 mm', '300 mm', '≈ 530 Hz – 3.4 kHz', '≈ 2 m', 'Larger rooms; rear wall'],
      ])}
      <div class="uc-grid">
        ${uc('🎚️', 'Mix room, 1.2 m behind the seat', [['Do', 'Rear wall: 300 mm absorber with a slatted face. Shallow skyline tiles high on the side walls.'], ['Why', 'Too close for a phase grating; the slats keep highs alive']])}
        ${uc('🎛️', 'Mix room, 3 m behind the seat', [['Do', 'Rear wall: bass trapping below, QRD array at ear height above it.'], ['Why', 'Distance is there; diffusion returns late, even energy']], '#7a5cc7')}
        ${uc('🥁', 'Small live room 4 × 5 m', [['Do', 'Poly-cylinders on one long wall, absorption opposite, absorbent cloud over the kit.'], ['Why', 'No flutter, more “size”, overheads stay clean']], '#c7772b')}
        ${uc('🎤', 'Vocal booth 1.5 × 2 m', [['Do', 'No diffusers. 100–150 mm absorption with air gap on most surfaces.'], ['Why', 'Nothing can blend at 0.5 m']], '#2b9fc7')}
      </div>
      <p>Check your own case — pick the room type, the distance and the diffuser:</p>`, viz: 'diffuserFit',
  };
  addTo('diffusion', [DIFFUSERS]);
  addTo('m-control', [DIFFUSERS]);
  addTo('m-tracking', [DIFFUSERS]);
})();
