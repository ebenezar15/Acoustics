/* ==========================================================================
   Master Class M32 — Studio design in India: materials, climate, process
   and best practice. Practical, illustrated, own words. Figures are
   indicative ranges; verify locally.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|plan/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  /* ---------- diagrams ---------- */
  const SVG_OVER = `<svg class="gsvg" viewBox="0 0 700 250" role="img" aria-label="What is different about building a studio in India">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Six things that shape a studio build in India</text>
    <rect x="270" y="70" width="160" height="130" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/>
    <line x1="270" y1="113" x2="430" y2="113" stroke="var(--text)" stroke-width="3"/><line x1="270" y1="156" x2="430" y2="156" stroke="var(--text)" stroke-width="3"/>
    <rect x="296" y="120" width="108" height="30" fill="color-mix(in srgb, var(--accent) 25%, var(--panel))" stroke="var(--accent)"/><text x="350" y="139" text-anchor="middle" font-size="10" font-weight="700">your studio</text>
    <text x="350" y="98" text-anchor="middle" font-size="9" fill="var(--muted)">neighbour above</text><text x="350" y="182" text-anchor="middle" font-size="9" fill="var(--muted)">neighbour below</text>
    <circle class="hot" cx="270" cy="135" r="9" fill="var(--bad)"/><text x="270" y="139" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">1</text>
    <text x="250" y="126" text-anchor="end" font-size="11" font-weight="700">RCC frame + masonry</text><text x="250" y="140" text-anchor="end" font-size="10" fill="var(--muted)">heavy walls, shared slabs</text>
    <circle class="hot" cx="350" cy="66" r="9" fill="var(--bad)"/><text x="350" y="70" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">2</text>
    <text x="350" y="42" text-anchor="middle" font-size="11" font-weight="700">Heat, humidity, monsoon</text><text x="350" y="54" text-anchor="middle" font-size="10" fill="var(--muted)">AC always on · damp · mould</text>
    <circle class="hot" cx="430" cy="135" r="9" fill="var(--bad)"/><text x="430" y="139" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">3</text>
    <text x="450" y="126" font-size="11" font-weight="700">Dense, noisy surroundings</text><text x="450" y="140" font-size="10" fill="var(--muted)">traffic, horns, generators</text>
    <circle class="hot" cx="290" cy="204" r="9" fill="var(--bad)"/><text x="290" y="208" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">4</text>
    <text x="250" y="200" text-anchor="end" font-size="11" font-weight="700">Power quality</text><text x="250" y="214" text-anchor="end" font-size="10" fill="var(--muted)">dips, cuts, earthing</text>
    <circle class="hot" cx="410" cy="204" r="9" fill="var(--bad)"/><text x="410" y="208" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">5</text>
    <text x="450" y="200" font-size="11" font-weight="700">Materials &amp; skills</text><text x="450" y="214" font-size="10" fill="var(--muted)">great masons &amp; carpenters</text>
    <circle class="hot" cx="350" cy="226" r="9" fill="var(--bad)"/><text x="350" y="230" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">6</text>
    <text x="350" y="246" text-anchor="middle" font-size="10" fill="var(--muted)">Apartment living: society rules and hours matter as much as decibels</text>
    <g class="wave-in"><path d="M560 60 q10 12 0 24" fill="none" stroke="var(--c3)" stroke-width="2"/><path d="M580 56 q14 16 0 32" fill="none" stroke="var(--c3)" stroke-width="2"/></g>
  </svg>`;

  const SVG_FRAME = `<svg class="gsvg" viewBox="0 0 700 280" role="img" aria-label="RCC frame building section with flanking paths">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">An RCC-frame building: where sound really travels</text>
    <rect x="60" y="34" width="14" height="216" fill="var(--text)"/><rect x="340" y="34" width="14" height="216" fill="var(--text)"/><rect x="620" y="34" width="14" height="216" fill="var(--text)"/>
    <rect x="60" y="34" width="574" height="12" fill="var(--text)"/><rect x="60" y="136" width="574" height="12" fill="var(--text)"/><rect x="60" y="238" width="574" height="12" fill="var(--text)"/>
    <rect x="74" y="148" width="266" height="90" fill="color-mix(in srgb, var(--accent) 12%, var(--panel))"/><text x="207" y="196" text-anchor="middle" font-size="12" font-weight="700">Your studio</text>
    <rect x="354" y="148" width="266" height="90" fill="var(--panel2)"/><text x="487" y="196" text-anchor="middle" font-size="11">Neighbour (same floor)</text>
    <rect x="74" y="46" width="266" height="90" fill="var(--panel2)"/><text x="207" y="94" text-anchor="middle" font-size="11">Neighbour above</text>
    <rect x="354" y="46" width="266" height="90" fill="var(--panel2)"/>
    <rect x="336" y="150" width="22" height="86" fill="#b5533c" opacity=".85"/><text x="347" y="262" text-anchor="middle" font-size="9" fill="var(--muted)">infill wall</text>
    <rect x="56" y="170" width="22" height="40" fill="var(--c3)" opacity=".6"/><text x="48" y="192" text-anchor="end" font-size="9" fill="var(--c3)">window</text>
    <path class="leak-pulse" d="M300 190 H336" stroke="var(--good)" stroke-width="3"/><text x="300" y="182" text-anchor="end" font-size="9" fill="var(--good)">① through the wall (usually OK)</text>
    <path class="leak-pulse" d="M250 236 Q250 252 350 252 T450 236" fill="none" stroke="var(--bad)" stroke-width="3"/><text x="450" y="230" font-size="9" fill="var(--bad)">② along the shared slab</text>
    <path class="leak-pulse" d="M200 150 V120" stroke="var(--bad)" stroke-width="3"/><text x="210" y="128" font-size="9" fill="var(--bad)">③ up through the slab</text>
    <path class="leak-pulse" d="M80 190 H40 Q20 150 40 100 H74" fill="none" stroke="var(--bad)" stroke-width="3"/><text x="18" y="150" font-size="9" fill="var(--bad)" transform="rotate(-90 18 150)" text-anchor="middle">④ window to window</text>
    <path class="leak-pulse" d="M330 152 Q347 140 364 152" fill="none" stroke="var(--warn)" stroke-width="3"/><text x="372" y="162" font-size="9" fill="var(--warn)">⑤ gap at beam / unsealed top course</text>
    <text x="350" y="276" text-anchor="middle" font-size="10" fill="var(--muted)">Heavy masonry is a gift. The slab, the windows and unsealed junctions decide the result.</text>
  </svg>`;

  const SVG_HEIGHT = `<svg class="gsvg" viewBox="0 0 700 270" role="img" aria-label="Height budget for a 10 foot slab-to-slab room">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Height budget: a 10 ft (3.05 m) slab-to-slab flat</text>
    <rect x="120" y="30" width="330" height="16" fill="var(--text)"/><text x="460" y="42" font-size="10">slab above (≈ 125–150 mm)</text>
    <rect x="120" y="46" width="330" height="20" fill="var(--c4)" opacity=".45"/><text x="460" y="60" font-size="10" fill="var(--c4)">100–150 mm void: hangers + rockwool</text>
    ${[160, 240, 320, 400].map((x) => `<path d="M${x} 46 v6 l-3 2 l6 3 l-6 3 l3 2 v4" stroke="var(--accent)" fill="none" stroke-width="1.5"/>`).join('')}
    <rect x="120" y="66" width="330" height="6" fill="var(--accent2)"/><text x="460" y="76" font-size="10" fill="var(--accent2)">2 × 12.5 mm gypsum, sealed edges</text>
    <rect x="200" y="84" width="170" height="14" fill="var(--c4)" opacity=".8"/><text x="460" y="96" font-size="10" fill="var(--c4)">cloud 100 mm (only over the seat)</text>
    <text x="285" y="150" text-anchor="middle" font-size="12" font-weight="700">clear height ≈ 2.60–2.68 m</text><text x="285" y="166" text-anchor="middle" font-size="10" fill="var(--muted)">(about 8 ft 6 in – 8 ft 9 in)</text>
    <line x1="140" y1="72" x2="140" y2="212" stroke="var(--muted)" stroke-dasharray="4 3"/><path d="M136 78 l4 -6 l4 6 M136 206 l4 6 l4 -6" fill="none" stroke="var(--muted)"/>
    <rect x="120" y="212" width="330" height="5" fill="var(--warn)"/><text x="460" y="216" font-size="10" fill="var(--warn)">floor finish (wood / vinyl / rug)</text>
    <rect x="120" y="217" width="330" height="8" fill="var(--accent2)"/><text x="460" y="228" font-size="10" fill="var(--accent2)">2 × 18 mm ply or 40–50 mm screed</text>
    ${[150, 210, 270, 330, 390, 430].map((x) => `<rect class="seal-squish" x="${x}" y="225" width="14" height="5" fill="var(--good)"/>`).join('')}<text x="460" y="240" font-size="10" fill="var(--good)">rubber / cork-rubber pads + wool</text>
    <rect x="120" y="230" width="330" height="16" fill="var(--text)"/><text x="460" y="254" font-size="10">structural slab</text>
    <text x="120" y="264" font-size="10" fill="var(--muted)">Start ≈ 2.90 m clear · floor −60 to −80 mm · ceiling −150 to −180 mm · beams hang lower: plan around them.</text>
  </svg>`;

  const acCell = (x, good) => `<g transform="translate(${x} 0)">
    <text x="165" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="var(--${good ? 'good' : 'bad'})">${good ? '✓ Done right' : '✗ Typical install'}</text>
    <rect x="150" y="50" width="26" height="170" fill="#b5533c" opacity=".85"/>
    <rect x="40" y="70" width="100" height="34" rx="6" fill="var(--panel2)" stroke="var(--text)"/><text x="90" y="91" text-anchor="middle" font-size="10">indoor unit</text>
    <rect x="200" y="140" width="80" height="60" rx="4" fill="var(--panel2)" stroke="var(--text)"/><text x="240" y="174" text-anchor="middle" font-size="10">compressor</text>
    <path d="M140 96 H${good ? 150 : 150} ${good ? 'V120 H176 V150 H200' : 'H200 V150'}" fill="none" stroke="var(--c3)" stroke-width="4"/>
    ${good ? `<circle class="seal-squish" cx="152" cy="120" r="6" fill="var(--good)"/><circle class="seal-squish" cx="174" cy="120" r="6" fill="var(--good)"/>
      <rect x="206" y="200" width="16" height="6" fill="var(--good)"/><rect x="258" y="200" width="16" height="6" fill="var(--good)"/>
      <text x="165" y="238" text-anchor="middle" font-size="9" fill="var(--good)">sleeve packed &amp; sealed both faces · pipe with a bend</text>
      <text x="165" y="250" text-anchor="middle" font-size="9" fill="var(--good)">compressor on rubber pads, away from the mic wall</text>`
    : `<path class="leak-pulse" d="M150 96 q-22 -14 -34 -34" fill="none" stroke="var(--bad)" stroke-width="2.5"/><path class="leak-pulse" d="M176 96 q20 -12 30 -30" fill="none" stroke="var(--bad)" stroke-width="2.5"/>
      <path class="leak-pulse" d="M200 190 q-14 6 -26 0" fill="none" stroke="var(--bad)" stroke-width="2.5"/>
      <text x="165" y="238" text-anchor="middle" font-size="9" fill="var(--bad)">65 mm hole left open around the pipes</text>
      <text x="165" y="250" text-anchor="middle" font-size="9" fill="var(--bad)">compressor bolted to the wall: hum in every take</text>`}
  </g>`;
  const SVG_AC = `<svg class="gsvg" viewBox="0 0 700 260" role="img" aria-label="Split air-conditioner installation right and wrong">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">The split-AC pipe sleeve: India’s most common studio leak</text>
    ${acCell(0, false)}${acCell(350, true)}
  </svg>`;

  const SVG_POWER = `<svg class="gsvg" viewBox="0 0 700 170" role="img" aria-label="Power chain for a studio">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">A clean, safe power chain</text>
    ${[['Mains / meter', 'single or three phase', 'muted'], ['DB with MCB + RCCB', 'separate audio circuit', 'warn'], ['Servo stabiliser', 'holds the voltage', 'c3'], ['Online UPS', 'rides through cuts', 'accent2'], ['Audio power strip', 'one earth point', 'good']].map(([t, s, c], i) => `<rect x="${14 + i * 138}" y="46" width="118" height="54" rx="8" fill="var(--panel2)" stroke="var(--${c})" stroke-width="2"/><text x="${73 + i * 138}" y="70" text-anchor="middle" font-size="10" font-weight="700">${t}</text><text x="${73 + i * 138}" y="86" text-anchor="middle" font-size="9" fill="var(--muted)">${s}</text>${i < 4 ? `<path class="leak-pulse" d="M${132 + i * 138} 73 h20" stroke="var(--accent)" stroke-width="3"/>` : ''}`).join('')}
    <path d="M73 100 V136 H627 V100" fill="none" stroke="var(--good)" stroke-width="3" stroke-dasharray="7 4"/><text x="350" y="130" text-anchor="middle" font-size="10" fill="var(--good)" font-weight="700">continuous protective earth to a tested earth pit — never broken, never “lifted”</text>
    <text x="350" y="158" text-anchor="middle" font-size="10" fill="var(--muted)">ACs, compressors, fridge and lifts on other circuits / another phase · inverter and DG set outside the studio shell</text>
  </svg>`;

  const L = {
    id: 'm-india', n: 'M32', track: 'master', title: 'Studio Design in India: Materials, Climate, Process & Best Practice', level: 'Core', mins: 55,
    summary: 'How to build a home or professional studio with what Indian buildings, climate, markets and trades give you: masonry and linings, floors and ceilings, doors and windows, monsoon-proofing, air-conditioning, power and earthing, codes and noise limits, process, and indicative budgets in ₹.',
    tags: ['India', 'brick', 'AAC', 'RCC', 'rockwool', 'gypsum', 'monsoon', 'humidity', 'split AC', 'earthing', 'NBC 2016', 'noise rules', 'budget'],
    sections: [
      { h: 'What is different in India', html: `
        <p class="lead">The physics is the same everywhere. What changes is the building you start with, the weather, the noise outside, the power coming in, what the market sells — and who builds it.</p>
        ${SVG_OVER}
        ${flow([['Use the mass', 'brick, block and RCC are already heavy'], ['Seal it', 'plaster, joints, sleeves, windows'], ['Line it', 'independent frame + wool'], ['Keep it dry & cool', 'AC, fresh air, dehumidify'], ['Clean power', 'earthing, stabiliser, UPS'], ['Be a good neighbour', 'hours and society rules']])}
        <div class="callout mentor">Most Indian rooms fail on <b>holes and climate</b>, not on wall weight: AC sleeves, window gaps, unplastered block, damp insulation. Fix those first and the money you spend on linings actually shows up as decibels.</div>` },
      { h: 'The building you start with', html: `
        ${SVG_FRAME}
        <p>Nearly all urban buildings are a <b>reinforced-concrete (RCC) frame</b> — columns, beams and slabs — with masonry infill walls of clay brick, fly-ash brick, AAC block or solid concrete block. Typical floor-to-floor height is about <b>9½–10 ft (2.9–3.05 m)</b>, with beams hanging 300–450 mm below the slab.</p>
        <ul><li><b>Good news:</b> a plastered 230 mm (9″) brick or solid-block wall is already a strong sound barrier.</li>
        <li><b>Weak points:</b> the slab is continuous under and over your neighbours (structure-borne bass and footfall); windows, balcony doors and ventilators are light; the top course of infill is often left loosely packed under the beam.</li>
        <li><b>Check before designing:</b> which walls are 115 mm (4½″) partitions and which are 230 mm; whether they are plastered on <i>both</i> faces; where the beams and columns are; what the slab can carry.</li></ul>
        <p>Try your wall below: choose the masonry, untick “plastered” to see what leaks cost, then add a lining.</p>`, viz: 'indiaWall' },
      { h: 'Masonry choices', html: `
        <div class="table-wrap"><table><tr><th>Wall (plastered both faces)</th><th class="num">Mass (≈ kg/m²)</th><th class="num">Isolation (≈ R<sub>w</sub>)</th><th>Good</th><th>Watch out</th><th>Verdict for studios</th></tr>
          <tr><td>115 mm (4½″) clay brick</td><td class="num">230–270</td><td class="num">43–47</td><td>Cheap, everywhere</td><td>Thin for music; often poorly filled joints</td><td>Speech only — line it</td></tr>
          <tr><td>230 mm (9″) clay brick</td><td class="num">430–480</td><td class="num">50–55</td><td>Heavy, forgiving, easy to chase and fix into</td><td>Thickness; weight on upper floors</td><td><span class="good">Excellent base wall</span></td></tr>
          <tr><td>230 mm fly-ash brick</td><td class="num">400–460</td><td class="num">50–54</td><td>Uniform size, widely available</td><td>Quality varies by supplier</td><td><span class="good">Very good</span></td></tr>
          <tr><td>100 mm AAC block</td><td class="num">90–120</td><td class="num">36–40</td><td>Light, fast, cool</td><td>Light = weak; porous if unplastered</td><td><span class="bad">Avoid for isolation</span></td></tr>
          <tr><td>200 mm AAC block</td><td class="num">160–190</td><td class="num">42–46</td><td>Thermal insulation</td><td>Far below brick of the same thickness</td><td>Only with a heavy lining</td></tr>
          <tr><td>200 mm solid concrete block</td><td class="num">400–460</td><td class="num">50–55</td><td>Dense, strong</td><td>Hollow blocks are much weaker unless grouted</td><td><span class="good">Excellent</span></td></tr>
          <tr><td>150 mm RCC wall</td><td class="num">350–380</td><td class="num">50–54</td><td>Airtight, strong</td><td>Cost; structural design needed</td><td>Excellent where it exists</td></tr></table></div>
        <p class="small muted">Approximate values for well-built, fully plastered walls; site results are usually several dB lower because of flanking and workmanship.</p>
        <div class="callout data"><b>Four masonry rules:</b> (1) plaster <b>both</b> faces, 12–15 mm, right up to the slab and behind any false ceiling; (2) fill every bed and perpend joint — no “dry” vertical joints; (3) pack and seal the gap under the beam or slab with mortar, then sealant; (4) never cut conduit chases or switch boxes back-to-back on a studio wall.</div>` },
      { h: 'Linings and room-in-room with local materials', html: `
        <p>The standard upgrade is an <b>independent lining</b>: a galvanised-iron (GI) metal-stud frame standing 25 mm clear of the masonry, rockwool in the cavity, and two layers of board with staggered, sealed joints. Do it on all four walls and the ceiling and you have a room-in-room.</p>
        <div class="table-wrap"><table><tr><th>Material</th><th>Use it for</th><th>Note</th></tr>
          <tr><td>Gypsum board 12.5 / 15 mm</td><td>Lining and ceiling mass layers</td><td>Two layers, staggered joints; moisture-resistant grade in damp areas</td></tr>
          <tr><td>Fibre-cement board 6–10 mm</td><td>Second, denser layer; wet or coastal locations</td><td>Heavier than gypsum for its thickness; harder to cut</td></tr>
          <tr><td>Cement-bonded particle board</td><td>Floor decks, heavy linings, door skins</td><td>Dense and moisture tolerant; needs pre-drilling</td></tr>
          <tr><td>Plywood (BWR / BWP grades)</td><td>Floor decks, frames, membrane-trap fronts</td><td>Use boiling-water-resistant grades; commercial MR ply swells in monsoon</td></tr>
          <tr><td>HDHMR / MDF</td><td>Door mass layers, slats, perforated faces</td><td>HDHMR copes with humidity far better than plain MDF</td></tr>
          <tr><td>Rockwool slabs 48 / 64 / 96 kg/m³</td><td>Cavity fill (48), absorber panels and bass traps (48–64), thin panels (96)</td><td>Itchy: gloves, mask, wrap in cloth</td></tr>
          <tr><td>Glass wool 16–48 kg/m³</td><td>Cavity fill, deep bass traps, above false ceilings</td><td>Light, cheap per volume; keep it dry</td></tr>
          <tr><td>Polyester (PET) fibre panels</td><td>Finished wall panels, safe-to-touch absorbers</td><td>Clean and colourful; thin panels are mid/high absorbers only</td></tr>
          <tr><td>Wood-wool boards</td><td>Durable ceilings and impact-resistant walls</td><td>Needs wool and an air gap behind to absorb well</td></tr>
          <tr><td>Spring / rubber ceiling hangers, resilient clips</td><td>Decoupling ceilings and linings</td><td>Choose by load; one screw bridging to the slab defeats them</td></tr>
          <tr><td>Acoustic (non-hardening) sealant</td><td>Every perimeter and penetration</td><td>Stays flexible; ordinary silicone or POP filler cracks</td></tr></table></div>
        ${myth([
          ['“Thermocol (EPS) sheets soundproof a room.”', 'EPS is light, stiff and closed-cell: it neither blocks nor absorbs, and it is a fire risk.'],
          ['“Egg trays or thin PU foam on the wall will stop the neighbours complaining.”', 'They slightly reduce flutter inside the room. Isolation change: about 0 dB.'],
          ['“Bubble wrap / foil insulation in the cavity works like rockwool.”', 'It is a thermal product. Cavities need a porous fibre fill to damp resonance.'],
          ['“Stick gypsum board straight onto the wall — it is quicker.”', 'A 10–15 mm bridged cavity resonates in the bass and usually makes isolation worse. Use an independent frame.'],
        ])}` },
      { h: 'Floors and ceilings — and the height budget', html: `
        ${SVG_HEIGHT}
        <ul><li><b>Floor:</b> vitrified tile on a slab is heavy but acoustically reflective and it carries impact sound. For most rooms, a rug and good treatment are enough. If you record drums or have neighbours below, float a deck: rubber or cork-rubber pads, wool between them, two layers of 18 mm BWP ply (or a 40–50 mm screed on a resilient mat), with a 10 mm sealed gap to every wall.</li>
        <li><b>Ceiling:</b> a false ceiling on spring or rubber hangers, 100–150 mm below the slab, wool above, two layers of board, perimeter left 6–10 mm clear and sealed. This is what protects the flat upstairs — and you from their footsteps.</li>
        <li><b>Beams:</b> box them inside the lining or use the bays between them for deeper bass trapping; do not let the false ceiling touch them rigidly.</li></ul>
        <div class="callout example"><b>Worked example.</b> Clear height under the slab 2.90 m (9 ft 6 in). Floating deck and finish −70 mm; ceiling void, hangers and boards −170 mm → <b>2.66 m (8 ft 9 in)</b> finished. A 100 mm cloud over the mix position leaves 2.56 m there. Under a 400 mm beam you would have only ≈ 2.26 m — so plan the seat and tall gear away from beams.</div>
        <div class="callout safety">A floating floor plus linings can add 60–150 kg/m². On upper floors, ask a structural engineer before adding screeds, sand or masonry.</div>` },
      { h: 'Doors and windows from the Indian market', html: `
        <div class="uc-grid">
          ${uc('🚪', 'Flush door upgrade', [['Start', 'Solid-core flush door, 32–40 mm (reject hollow or honeycomb cores)'], ['Build', 'Glue + screw 12 mm HDHMR or ply on one or both faces, compression seals in a teak or hardwood stop, drop seal at the bottom'], ['Result', 'From ≈ 20–25 dB to ≈ 33–38 dB']])}
          ${uc('🚪🚪', 'Double doors with a lobby', [['Where', 'Drum rooms, commercial studios, rooms opening to a corridor'], ['Build', 'Two sealed doors 600–1 200 mm apart, lobby lined with absorber'], ['Result', '≈ 50–60 dB at the doorway']], '#7a5cc7')}
          ${uc('🪟', 'uPVC / aluminium windows', [['Start', 'Sliding windows leak badly; casement or fixed units seal much better'], ['Build', 'Laminated glass 8–10 mm; then a second fixed pane ≈ 100 mm inside with lined reveals'], ['Result', '≈ 25 dB (slider) → 40–48 dB']], '#2b9fc7')}
          ${uc('🧱', 'Window plug / brick-up', [['Where', 'Rooms that do not need the daylight, or only while recording'], ['Build', 'Removable board + rockwool plug, or brick up and plaster'], ['Result', 'Plug +12–15 dB; brick-up = as good as the wall']], '#c7772b')}
        </div>
        <div class="callout warn"><b>Close the forgotten holes:</b> ventilators above doors and windows, exhaust-fan openings, grill frames, the 65–75 mm core hole for split-AC pipes, cable-TV and internet entries, and the gap around door frames hidden by the architrave. Each one can cap the whole room at 25–30 dB.</div>
        <p>Details and tools: <a href="#/academy/m-door-build">Building Acoustic Doors, Seals &amp; Studio Windows</a>.</p>` },
      { h: 'Climate: heat, humidity and the monsoon', html: `
        <div class="table-wrap"><table><tr><th>Risk</th><th>What happens</th><th>Do this</th></tr>
          <tr><td>High humidity (coasts, monsoon)</td><td>Mould in fabric and wool, swollen MDF, rusted screws, detuned instruments, crackly pots and connectors</td><td>Hold ≈ <b>45–60 % RH</b>: AC in dry mode or a dehumidifier; a hygrometer on the wall; silica gel in mic and instrument cases</td></tr>
          <tr><td>Damp external walls</td><td>Efflorescence, wet insulation, peeling finishes</td><td>Fix leaks and waterproof outside first; keep a 25 mm air gap between masonry and lining; never trap a wet wall</td></tr>
          <tr><td>Termites and borers</td><td>Timber frames and ply eaten from inside</td><td>Anti-termite treatment of the site/walls; treated or seasoned hardwood; BWP ply; GI studs instead of timber where possible</td></tr>
          <tr><td>Corrosion near the sea</td><td>GI framing and hangers rust</td><td>Heavier zinc coating or powder-coated sections, stainless fixings, fibre-cement instead of gypsum in exposed zones</td></tr>
          <tr><td>Heat</td><td>Gear and people overheat in a sealed room</td><td>Size the AC for people + equipment; shade or insulate sun-facing walls and roofs</td></tr>
          <tr><td>Wet materials on site</td><td>Wool and board soaked during monsoon work</td><td>Store off the floor under cover; close up only when dry; schedule dry trades outside peak monsoon</td></tr></table></div>
        <div class="callout mentor">A terrace (top-floor) room bakes under the sun and is hammered by rain noise. Insulate and waterproof the roof first, add a heavy false ceiling on hangers, and check rain noise before you commit to recording there.</div>` },
      { h: 'Air-conditioning and fresh air', html: `
        ${SVG_AC}
        <ul><li><b>Split ACs</b> suit home studios: pick a model with a low-fan “quiet” mode, mount the indoor unit away from microphones, and switch it off for the quietest takes if needed. The outdoor unit goes on <b>rubber pads</b>, not rigidly on the studio wall, and never under the window you record beside.</li>
        <li><b>The pipe sleeve</b> must be packed with wool and sealed with non-hardening sealant on both faces, with the pipes bent so there is no straight line of sight.</li>
        <li><b>Professional rooms</b> use ducted or cassette units outside the acoustic shell, lined ducts, silencers or baffle boxes at every wall, and low air speed (mains under about 3 m/s, grilles under 1.5–2 m/s).</li>
        <li><b>Fresh air</b> is not optional in a sealed room. Use a treated-fresh-air unit or an energy-recovery ventilator with silenced ducts — never an open window or an undercut door.</li>
        <li><b>Heat load:</b> allow roughly 100–150 W per person plus the real power of your gear and lights; a small control room with three people and a rack can need 1–1.5 tons of cooling.</li></ul>
        <p>Method and calculator: <a href="#/academy/m-hvac">Heating, Ventilation &amp; Air Conditioning</a>.</p>` },
      { h: 'Power: fluctuation, outages and earthing', html: `
        ${SVG_POWER}
        <ul><li><b>Voltage swings and cuts</b> are normal in many areas. Feed the audio system from a servo stabiliser and an <b>online (double-conversion) UPS</b>; size it for the computer, interface, monitors and a few minutes to save and shut down.</li>
        <li><b>Inverters and DG sets</b> are noisy electrically and acoustically. Keep them outside the studio shell, on vibration mounts, and test for hum when running on them.</li>
        <li><b>Earthing:</b> many older flats have a poor or missing earth. Have a licensed electrician test it and, if needed, provide a proper earth pit and bonding to the relevant Indian Standards (IS 3043 for earthing, IS 732 for wiring). Use three-pin plugs everywhere; never remove an earth pin to cure hum.</li>
        <li><b>Phases and circuits:</b> on a three-phase supply, put all audio on one phase and the ACs, compressors, pumps and lifts on the others. On single phase, give audio its own circuit from the distribution board, with an RCCB.</li>
        <li><b>Lighting:</b> cheap LED drivers and fan regulators buzz into audio; choose good drivers and avoid phase-cut dimmers on the audio circuit.</li></ul>
        <div class="callout safety">All mains work — distribution boards, earth pits, new circuits — is for a licensed electrician. Your job is to specify what you need and to test for hum afterwards. See <a href="#/academy/a-ground">Hum, Buzz &amp; Grounding</a>.</div>` },
      { h: 'Codes, standards and noise limits to know', html: `
        <div class="table-wrap"><table><tr><th>Document</th><th>What it covers</th><th>Why you care</th></tr>
          <tr><td><b>National Building Code of India 2016</b>, Part 8 Section 4</td><td>Acoustics, sound insulation and noise control in buildings</td><td>Design guidance and recommended criteria</td></tr>
          <tr><td><b>NBC 2016</b>, Part 4</td><td>Fire and life safety</td><td>Exits, materials, electrical safety in a sealed, fabric-lined room</td></tr>
          <tr><td><b>IS 1950</b></td><td>Code of practice for sound insulation of non-industrial buildings</td><td>Insulation guidance for dwellings, offices, schools</td></tr>
          <tr><td><b>IS 2526</b></td><td>Acoustical design of auditoriums and conference halls</td><td>Halls, live-recording and devotional spaces</td></tr>
          <tr><td><b>IS 3043</b> · <b>IS 732</b></td><td>Earthing · electrical wiring installations</td><td>Safe, quiet power</td></tr>
          <tr><td><b>ISO standards</b> (3382, 16283, 717 …)</td><td>Measurement and rating methods</td><td>Used by test labs and consultants in India too — see <a href="#/academy/m-standards">Standards Explained</a></td></tr></table></div>
        <p><b>Ambient noise limits</b> commonly cited from the Noise Pollution (Regulation and Control) Rules, 2000 (day = 6 am–10 pm, night = 10 pm–6 am), in dB(A) L<sub>eq</sub>:</p>
        <div class="table-wrap"><table><tr><th>Area</th><th class="num">Day</th><th class="num">Night</th></tr>
          <tr><td>Industrial</td><td class="num">75</td><td class="num">70</td></tr>
          <tr><td>Commercial</td><td class="num">65</td><td class="num">55</td></tr>
          <tr><td>Residential</td><td class="num">55</td><td class="num">45</td></tr>
          <tr><td>Silence zone (around hospitals, schools, courts)</td><td class="num">50</td><td class="num">40</td></tr></table></div>
        <div class="callout warn">These are the commonly quoted figures — check the current rules, your state and municipal regulations, and your housing-society by-laws, which often restrict <b>hours</b> and commercial use regardless of level. Choose flame-retardant fabrics and avoid exposed PU foam: a studio is a sealed room full of electrical equipment.</div>` },
      { h: 'Process and people', html: `
        ${flow([['Brief', 'use, loudness, hours, budget'], ['Survey', 'walls, slab, beams, noise, power'], ['Drawings', 'plans, sections, every junction'], ['Civil', 'masonry, plaster, waterproofing'], ['Frames & boards', 'studs, hangers, wool, sealing'], ['MEP', 'AC, fresh air, electrical, tie-lines'], ['Finishes', 'doors, glass, treatment, fabric'], ['Commission', 'measure, tune, document']])}
        <ul><li><b>Draw everything.</b> Skilled carpenters and fabricators will build exactly what is drawn — and improvise what is not. Give dimensioned sections of the wall, floor, ceiling, door and window, in mm (and inches if the team prefers).</li>
        <li><b>Build a mock-up:</b> one square metre of the lining and one absorber panel, approved before the full order.</li>
        <li><b>Be on site at “before closing”.</b> Check the wool, the 25 mm gap, the sealant and that no screw, conduit or pipe bridges the gap — then photograph it. This single visit protects most of your budget.</li>
        <li><b>Approve samples</b> of board, wool density, fabric and seals; check delivered materials against them.</li>
        <li><b>Plan the calendar:</b> monsoon, festival seasons and labour availability affect schedules; order long-lead items (doors, glass, AC) early.</li>
        <li><b>Explain the “why”.</b> Once the team understands that one rigid contact or one open hole undoes the work, they become your best quality inspectors.</li></ul>
        <p>Full sequence and checklist: <a href="#/academy/m-playbook">The Studio Design Playbook</a>.</p>` },
      { h: 'Budget in ₹ — indicative tiers', html: `
        <div class="table-wrap"><table><tr><th>Level</th><th>What you get</th><th class="num">Indicative ₹ per sq ft of carpet area</th></tr>
          <tr><td><b>Treatment-only home room</b></td><td>DIY rockwool + fabric panels, corner traps, rug, door seals</td><td class="num">300 – 900</td></tr>
          <tr><td><b>Sealed and lined room</b></td><td>Plaster/seal, upgraded door, secondary glazing, lining on one or two walls, treatment</td><td class="num">1,000 – 2,500</td></tr>
          <tr><td><b>Room-in-room</b></td><td>Independent walls and ceiling, floated deck, double doors, quiet AC and fresh air, full treatment</td><td class="num">2,500 – 5,500</td></tr>
          <tr><td><b>Professional facility</b></td><td>Multiple isolated rooms, structural floors, ducted HVAC with silencers, technical power, designed interiors</td><td class="num">5,000 – 12,000+</td></tr></table></div>
        <p class="small muted">Very rough guidance for construction and acoustic works only (no audio equipment or furniture). Prices vary widely by city, year, finish and contractor — get itemised quotes. 1 m² = 10.76 sq ft.</p>
        <p><b>What drives the cost:</b> how many surfaces are isolated, doors and glass, air-conditioning and fresh air, finish quality, and how much is done by specialists.</p>
        <div class="callout alt"><b>Cheap and effective in India:</b>
          <ul style="margin:.3em 0 0;padding-left:18px"><li>Plaster and seal every masonry wall, both faces, to the slab — the best value there is.</li>
          <li>Build new studio walls in 230 mm brick or solid block instead of AAC.</li>
          <li>Seal the AC sleeve, ventilators and exhaust openings.</li>
          <li>Heavy flush door + added board + seals + drop seal.</li>
          <li>Secondary glazing 100 mm inside the existing window, or a removable plug.</li>
          <li>DIY absorbers: rockwool slabs in timber or GI frames, wrapped in breathable fabric — a fraction of the cost of bought panels.</li>
          <li>Spend the savings on quiet air-conditioning, fresh air and good earthing.</li></ul></div>` },
      { h: 'Use cases, problems and mistakes', html: `
        <div class="uc-grid">
          ${uc('🏢', 'Bedroom studio in an apartment', [['Situation', '10 × 12 ft room, 115 mm partition to the next flat, sliding window to a busy road'], ['Plan', 'Seal sleeve and ventilator; secondary glazing; door seals; lining on the party wall; corner traps and a cloud; work on monitors by day, headphones late'], ['Result', 'Mixing without complaints; not a drum room']])}
          ${uc('🏠', 'Terrace room on an independent house', [['Situation', 'Hot roof, rain noise, own walls on all sides'], ['Plan', 'Waterproof and insulate the roof; ceiling on hangers; 230 mm brick walls; lobby door; split AC with sealed sleeve'], ['Result', 'Comfortable all year; rain barely audible']], '#c7772b')}
          ${uc('🛣️', 'Commercial studio on a main road', [['Situation', 'Traffic and horns at 75–85 dB(A) outside, shops either side'], ['Plan', 'Rooms set back behind a lobby and office; room-in-room; no windows to the street; ducted AC with silencers; UPS and separate phase'], ['Result', 'NC 20 inside; clients do not hear the road']], '#7a5cc7')}
          ${uc('🎙️', 'Podcast / dubbing studio in an office building', [['Situation', 'Raised floor, light partitions, central AC and a shared ceiling void'], ['Plan', 'Take walls slab-to-slab; ceiling on hangers; silencers on the supply and return; sealed door; deep absorption in the booth'], ['Result', 'Clean voice recordings during office hours']], '#2b9fc7')}
          ${uc('🎓', 'Music school rooms', [['Situation', 'Several practice rooms along a corridor, tight budget'], ['Plan', '230 mm brick between rooms, plastered; sealed solid doors with small laminated vision panels; staggered doors; PET or rockwool panels; shared quiet AC with separate branches'], ['Result', 'Lessons run side by side']], '#4c9a3a')}
          ${uc('🪔', 'Devotional / live recording hall', [['Situation', 'Hard marble floor and walls, long echo, ceiling fans'], ['Plan', 'Absorptive ceiling and rear wall, carpets or rugs for sessions, directional loudspeakers, quiet fans or AC for takes; follow hall-design guidance (IS 2526)'], ['Result', 'Clear speech and singing, usable recordings']], '#c7a12b')}
        </div>
        <div class="table-wrap"><table><tr><th>Problem</th><th>Likely cause</th><th>Solution</th></tr>
          <tr><td>Neighbour hears everything through a “thick” wall</td><td>AC sleeve, ventilator, window, or unplastered face</td><td>Find the leak with pink noise; seal; then judge the wall</td></tr>
          <tr><td>Bass heard in the flat below</td><td>Sub and monitors exciting the slab</td><td>Decouple speakers and sub; floating deck; limit level and hours</td></tr>
          <tr><td>Musty smell, black spots on panels</td><td>Humidity above ~65 %, damp wall behind</td><td>Dehumidify; fix the wall; replace affected wool and fabric</td></tr>
          <tr><td>Hum that comes and goes</td><td>Poor earth, AC compressor on the audio circuit, inverter running</td><td>Electrician to test earthing; separate circuit/phase; online UPS</td></tr>
          <tr><td>Stuffy, tiring room</td><td>Sealed with no fresh air</td><td>Silenced fresh-air system</td></tr>
          <tr><td>Rain or traffic in recordings</td><td>Light roof or window</td><td>Heavy ceiling on hangers; secondary glazing or plug</td></tr></table></div>
        <div class="callout warn"><b>Mistakes seen again and again:</b> AAC block for isolation walls · AC sleeves left open · gypsum stuck directly on the wall · thermocol and egg trays as “soundproofing” · no fresh air · wool installed wet · earthing ignored · assuming decibels are the only issue when the society’s complaint is really about <b>hours</b> and commercial use.</div>` },
    ],
    quiz: [
      { q: 'Which wall is the best starting point for a studio in India?', opts: ['100 mm AAC block', '115 mm brick, unplastered', '230 mm brick or solid block, plastered both faces', 'Gypsum partition on a single stud'], a: 2, why: 'Mass plus airtightness: about 450 kg/m² and a sealed surface.' },
      { q: 'A split AC has just been installed and isolation has dropped sharply. First thing to check?', opts: ['The fabric colour', 'The pipe sleeve through the wall', 'The sample rate', 'The rug'], a: 1, why: 'An open 65–75 mm core hole can cap the room at 25–30 dB. Pack and seal it both sides.' },
      { q: 'Why is gypsum board stuck directly onto masonry a poor idea?', opts: ['It looks bad', 'The thin bridged cavity resonates in the bass and can reduce isolation', 'It is too heavy', 'It absorbs too much'], a: 1, why: 'Use an independent frame with a 50–100 mm wool-filled cavity instead.' },
      { q: 'What relative humidity should you aim to hold in the studio?', opts: ['10–20 %', '45–60 %', '75–85 %', 'It does not matter'], a: 1, why: 'Dry enough to stop mould and corrosion, not so dry that instruments suffer.' },
      { q: 'Your society complains although measured levels are within the limits. Most likely reason?', opts: ['The meter is wrong', 'By-laws on hours and commercial use, not just decibels', 'Too much treatment', 'The wrong plug'], a: 1, why: 'Agree working hours and get permissions; isolation alone does not settle it.' },
    ],
  };
  window.LESSONS.push(L);
})();
