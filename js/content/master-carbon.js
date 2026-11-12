/* ==========================================================================
   Master Class M18A — Activated carbon for low-frequency absorption:
   what is proven, what is marketing, and how to use it in a design.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  const SVG_PORES = `<svg class="gsvg" viewBox="0 0 680 250" role="img" aria-label="Three scales of pores in activated carbon">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">One granule, three scales of pores</text>
    <g><rect x="20" y="40" width="180" height="150" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
      ${Array.from({ length: 22 }, (_, i) => `<circle cx="${40 + (i * 37) % 140}" cy="${62 + (i * 53) % 110}" r="${9 + (i % 3) * 2}" fill="#1c1c1c"/>`).join('')}
      <text x="110" y="208" text-anchor="middle" font-size="11" font-weight="700">① between granules</text><text x="110" y="224" text-anchor="middle" font-size="10" fill="var(--muted)">≈ 0.5–3 mm · air flows, friction</text></g>
    <path d="M205 115 h40" stroke="var(--accent)" stroke-width="2" marker-end="url(#cArr)"/>
    <g><rect x="250" y="40" width="180" height="150" rx="10" fill="#1c1c1c"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${262 + i * 18} ${50 + (i % 3) * 8} q ${8 + (i % 2) * 6} 40 ${-6 + (i % 4) * 5} 70 t ${4} 55" stroke="var(--panel2)" stroke-width="${3 + (i % 3)}" fill="none" opacity=".85"/>`).join('')}
      <text x="340" y="208" text-anchor="middle" font-size="11" font-weight="700">② channels inside a granule</text><text x="340" y="224" text-anchor="middle" font-size="10" fill="var(--muted)">micrometres · air diffuses in</text></g>
    <path d="M435 115 h40" stroke="var(--accent)" stroke-width="2" marker-end="url(#cArr)"/>
    <g><rect x="480" y="40" width="180" height="150" rx="10" fill="#2a2a2a"/>
      ${Array.from({ length: 5 }, (_, i) => `<rect x="${492}" y="${54 + i * 26}" width="156" height="10" fill="#111"/>`).join('')}
      ${Array.from({ length: 12 }, (_, i) => `<circle class="${i % 2 ? 'hot' : ''}" cx="${500 + (i * 29) % 140}" cy="${69 + (i % 5) * 26 - (i % 2 ? 0 : 6)}" r="3.5" fill="var(--c3)"/>`).join('')}
      <text x="570" y="208" text-anchor="middle" font-size="11" font-weight="700">③ nanometre pores</text><text x="570" y="224" text-anchor="middle" font-size="10" fill="var(--muted)">air molecules stick &amp; release (sorption)</text></g>
    <defs><marker id="cArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>
    <text x="340" y="244" text-anchor="middle" font-size="10" fill="var(--muted)">A teaspoon of activated carbon has an internal surface about the size of a football pitch.</text>
  </svg>`;

  const SVG_SPRING = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Carbon makes the air spring softer">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Why it lowers a trap’s tuning: a softer air spring</text>
    ${[['Air only', 60, false, '63 Hz'], ['30–50 % carbon', 370, true, '≈ 52–57 Hz']].map(([t, x, c, f]) => `<g>
      <text x="${x + 125}" y="40" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <rect x="${x + 40}" y="52" width="210" height="90" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
      ${c ? `<rect x="${x + 150}" y="54" width="98" height="86" fill="#1c1c1c" opacity=".85"/>` : ''}
      <rect class="pane-a" x="${x + 34}" y="52" width="8" height="90" fill="var(--accent2)"/>
      <path d="M${x + 46} 97 ${Array.from({ length: c ? 5 : 9 }, (_, i) => `l${c ? 18 : 10} ${i % 2 ? 14 : -14}`).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      <text x="${x + 125}" y="162" text-anchor="middle" font-size="11">${c ? 'softer spring → lower, broader resonance' : 'stiff spring'}</text>
      <text x="${x + 125}" y="180" text-anchor="middle" font-size="12" font-weight="700" fill="var(--${c ? 'good' : 'muted'})">${f}</text></g>`).join('')}
    <text x="340" y="100" text-anchor="middle" font-size="22" fill="var(--accent)">→</text>
  </svg>`;

  const SVG_BUILD = `<svg class="gsvg" viewBox="0 0 680 260" role="img" aria-label="Section of a membrane trap with activated carbon">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Membrane bass trap with a carbon-lined cavity (section, not to scale)</text>
    <rect x="470" y="34" width="26" height="190" fill="var(--muted)" opacity=".6"/><text x="483" y="238" text-anchor="middle" font-size="10">wall</text>
    <rect x="190" y="40" width="280" height="178" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/>
    <rect class="pane-a" x="182" y="40" width="9" height="178" fill="var(--accent2)"/>
    <rect x="200" y="48" width="70" height="162" fill="var(--c4)" opacity=".45"/>
    ${[0, 1, 2].map((i) => `<rect x="${330 + i * 44}" y="52" width="34" height="154" rx="6" fill="#1c1c1c"/><rect x="${330 + i * 44}" y="52" width="34" height="154" rx="6" fill="none" stroke="var(--warn)" stroke-dasharray="3 3"/>`).join('')}
    <rect x="286" y="188" width="26" height="18" rx="3" fill="var(--c3)"/>
    <circle class="seal-squish" cx="190" cy="44" r="4" fill="var(--good)"/><circle class="seal-squish" cx="190" cy="214" r="4" fill="var(--good)"/>
    <text x="170" y="100" text-anchor="end" font-size="11" fill="var(--accent2)">① panel</text><text x="170" y="114" text-anchor="end" font-size="10" fill="var(--muted)">ply / MDF / heavy vinyl</text>
    <text x="170" y="150" text-anchor="end" font-size="11" fill="var(--good)">② airtight perimeter</text><text x="170" y="164" text-anchor="end" font-size="10" fill="var(--muted)">sealant, gasket</text>
    <text x="235" y="236" text-anchor="middle" font-size="10" fill="var(--c4)">③ 25–50 mm wool</text><text x="235" y="250" text-anchor="middle" font-size="10" fill="var(--muted)">behind the panel (damping)</text>
    <text x="396" y="236" text-anchor="middle" font-size="10">④ carbon in breathable bags</text><text x="396" y="250" text-anchor="middle" font-size="10" fill="var(--muted)">thin layers with air between</text>
    <text x="520" y="196" font-size="10" fill="var(--c3)">⑤ desiccant sachet</text><path d="M516 194 L314 197" stroke="var(--c3)" stroke-dasharray="3 3"/>
    <text x="520" y="80" font-size="10">⑥ free air gap so air</text><text x="520" y="94" font-size="10">reaches every bag</text>
  </svg>`;

  const L = {
    id: 'm-carbon', n: 'M18A', track: 'master', title: 'Activated Carbon for Low-Frequency Absorption: Evidence, Design & Build', level: 'Advanced', mins: 35,
    summary: 'What activated carbon really does to bass, what is proven and what is marketing, where it earns its place in a design, and a step-by-step way to build and tune a carbon-assisted bass trap.',
    tags: ['activated carbon', 'activated charcoal', 'sorption', 'bass trap', 'membrane absorber', 'Helmholtz', 'low frequency', 'compliance', 'humidity'],
    sections: [
      { h: 'The short answer', html: `
        <p class="lead">Activated carbon (activated charcoal) is not a magic bass sponge. What laboratory research does show is narrower and more useful: when it sits in the <b>air cavity of a resonant trap</b>, the cavity behaves as if it were larger and more damped. The trap tunes lower and wider <b>without getting deeper</b>.</p>
        ${flow([['The problem', 'low-bass traps need deep cavities'], ['The trick', 'carbon makes the air spring softer'], ['The gain', 'lower tuning, wider band, same depth'], ['The catch', 'humidity, dust, weight, uneven evidence'], ['The rule', 'build, measure, adjust']])}
        <div class="callout data">Loudspeaker makers have used the same effect for years: activated carbon inside a cabinet makes it act like a bigger box. The room-acoustics version is the same idea applied to membrane and Helmholtz traps.</div>` },
      { h: 'What activated carbon is', html: `
        ${SVG_PORES}
        <p>Carbon from coconut shell, wood or coal is “activated” with steam or chemicals at high temperature, which etches an enormous network of pores into it — typically 500–1 500 m² of internal surface per gram. It is sold as powder, pellets or <b>granules</b>; for acoustics you want granules.</p>
        <p>Three things then happen to sound-frequency pressure changes inside a bed of granules:</p>
        <ul><li><b>Friction</b> between granules, like any porous absorber.</li>
        <li><b>Diffusion</b> of air into the granules’ inner channels, which adds losses at low frequencies where ordinary absorbers have little.</li>
        <li><b>Sorption</b>: as pressure rises, air molecules stick to the pore walls; as it falls, they are released. The air in the cavity is easier to compress than normal air — a <b>softer spring</b>.</li></ul>` },
      { h: 'How it lowers and widens a trap', html: `
        ${SVG_SPRING}
        <p>A membrane trap is a mass (the panel) on a spring (the trapped air); a Helmholtz trap is a plug of air in a neck on the same kind of spring. The resonance depends on the spring: make the cavity deeper and the spring softens. Carbon softens it without the extra depth, and its internal losses add damping, so the absorption peak is lower in frequency and broader.</p>
        <div class="formula"><span class="lbl">Rule of thumb used in the simulator</span>f<sub>with carbon</sub> ≈ f<sub>air only</sub> / √(1 − φ + φ·K) &nbsp;·&nbsp; φ = filled share of the cavity, K ≈ 1.3–2 (how much “bigger” the carbon-filled part behaves)</div>
        <p>Example: 6 kg/m² panel on a 150 mm cavity tunes to about 63 Hz. Half-filled with carbon in normal room air it drops to roughly 55 Hz — what would otherwise need about 195 mm of depth.</p>`, viz: 'carbonTrap' },
      { h: 'What is proven — and what is not', html: `
        ${myth([
          ['“Carbon panels absorb everything down to 30 Hz.”', 'Published measurements show a real but moderate effect: lower tuning and more damping in resonant traps. Any product claim should come with independent low-frequency test data.'],
          ['“A thin layer of charcoal on the wall is a bass trap.”', 'A few centimetres of granules alone absorb more bass than the same thickness of wool or sand — but still little. The benefit comes from using it inside a tuned cavity.'],
          ['“BBQ charcoal or briquettes work the same.”', 'They are not activated: far less internal surface, lots of dust and binders. Use granular <i>activated</i> carbon.'],
          ['“More carbon is always better.”', 'Air has to reach it. Thick, tightly packed beds and overfilled cavities work worse than several thin, well-ventilated layers.'],
          ['“It keeps working forever.”', 'Moisture and airborne contaminants fill the pores over time. A sealed, dry cavity keeps it effective for years; an open one does not.'],
        ])}
        <div class="callout physics">Laboratory studies of activated carbon at low frequencies report an effective air compliance well above that of plain air and extra absorption below a few hundred hertz, attributed to sorption and its multi-scale pores. The size of the effect depends strongly on the grade, the grain size, the humidity and the sound level — which is why you should treat any multiplier (including the ones in this app) as a starting estimate.</div>` },
      { h: 'Where it earns its place in a design', html: `
        <div class="uc-grid">
          ${uc('📏', 'Not enough depth', [['Situation', 'A 45–60 Hz mode needs a 250–350 mm membrane trap, but only 150–200 mm is available'], ['Design', 'Membrane trap with 30–50 % of the cavity as carbon cassettes; tune by panel mass']])}
          ${uc('🎚️', 'Rear wall of a small control room', [['Situation', 'Seat close to the rear wall; bass build-up; no space for a 600 mm absorber'], ['Design', 'Bank of carbon-assisted membrane modules behind fabric, porous layer in front for mids']], '#7a5cc7')}
          ${uc('📦', 'Corner Helmholtz bank', [['Situation', 'One stubborn axial mode'], ['Design', 'Slot resonators with carbon in the rear of each chamber; expect a broader peak, so tuning is less critical']], '#c7772b')}
          ${uc('🎤', 'Booth with boxy 100–150 Hz', [['Situation', 'Tiny booth, shallow walls'], ['Design', 'Thin panel traps with carbon behind, then 100 mm porous over the top']], '#2b9fc7')}
          ${uc('🚫', 'When not to bother', [['Situation', 'You have the depth, or the room is damp and unconditioned'], ['Do instead', 'Plain deep porous corner traps and ordinary membrane traps are cheaper and more predictable']], '#b33')}
        </div>` },
      { h: 'Materials and process: making it a low-frequency absorber', html: `
        ${SVG_BUILD}
        <div class="table-wrap"><table><tr><th>Item</th><th>Choose</th><th>Why</th></tr>
          <tr><td><b>Carbon type</b></td><td>Granular activated carbon (GAC), coconut-shell based, “washed / dedusted”</td><td>High micropore volume, hard granules, less dust</td></tr>
          <tr><td><b>Grain size</b></td><td>About 1–4 mm (sold as mesh 4×8, 6×12 or 8×30) or 3–4 mm pellets</td><td>Large enough for air to move between grains; powder packs solid and makes dust</td></tr>
          <tr><td><b>Containment</b></td><td>Breathable bags (cotton, polyester mesh finer than the grains) or perforated-metal cassettes, 25–50 mm thick</td><td>Thin beds let air reach all the carbon; nothing spills into the room</td></tr>
          <tr><td><b>Amount</b></td><td>30–60 % of the cavity volume (≈ 480 kg per m³ of carbon)</td><td>Leave free air next to the panel or neck</td></tr>
          <tr><td><b>Damping layer</b></td><td>25–50 mm mineral wool behind the panel, not touching it</td><td>Broadens the peak, as in any membrane trap</td></tr>
          <tr><td><b>Sealing</b></td><td>Airtight box, sealed panel perimeter</td><td>Needed for the trap to work — and it keeps humidity out</td></tr>
          <tr><td><b>Moisture control</b></td><td>Dry the carbon before use; silica-gel sachets in the box; room at 40–60 % RH</td><td>Water fills the pores and removes most of the effect</td></tr>
          <tr><td><b>Structure</b></td><td>Rigid, heavy box (18 mm ply/MDF, braced); strong fixings</td><td>Carbon is heavy: a 1.2 m² × 150 mm trap half-filled holds ≈ 40 kg</td></tr></table></div>
        ${flow([['Design in air', 'pick panel mass & depth for your target: f ≈ 60/√(m·D)'], ['Aim high', 'tune 10–20 % above the target; carbon will pull it down'], ['Build adjustable', 'removable panel, room to add mass or bags'], ['Dry & bag', 'dry carbon, fill thin bags, add desiccant'], ['Seal & measure', 'tap test or near-field sweep to find the resonance'], ['Adjust', 'add/remove bags or panel mass until it sits on the mode'], ['Re-check yearly', 'tuning drifting up = carbon getting damp']])}
        <div class="callout safety">Wear a dust mask and gloves when handling carbon, and keep the dust away from electronics — it is conductive. Activated carbon is combustible: keep it dry, away from heat sources and wiring, and do not store large open quantities in a closed room. Check that any facing fabric and the box meet your local fire requirements.</div>` },
      { h: 'How to measure whether it worked', html: `
        <ol><li><b>Before:</b> measure the room at the seat (frequency response and waterfall) and note the target mode’s frequency and decay time.</li>
        <li><b>Trap alone:</b> tap the panel with a finger and record it with a phone or contact mic — the dominant thump frequency is the tuning. Or place a measurement mic a few centimetres from the panel/neck and run a sweep: the dip or phase flip marks the resonance.</li>
        <li><b>Compare</b> with and without the carbon bags in place. You should see the tuning move down by roughly 10–20 % and the peak broaden.</li>
        <li><b>In the room:</b> install in the pressure zone of the target mode (wall or corner — see <a href="#/academy/pv-standing">Pressure, Velocity &amp; Standing Waves</a>) and re-measure. Judge by the <b>decay time</b> of that mode, not only its level.</li></ol>
        <div class="callout mentor">One trap rarely fixes a mode. Plan area: several modules covering a few square metres on the right surfaces. Use the <a href="#/lab/playbook">target-mode planner</a> to decide where.</div>` },
      { h: 'Cost and sensible alternatives', html: `
        <div class="table-wrap"><table><tr><th>Option for a 50–60 Hz mode</th><th>Depth</th><th>Relative cost</th><th>Predictability</th></tr>
          <tr><td>Deep porous corner trap (400–600 mm)</td><td>very deep</td><td>low</td><td>high — broadband, forgiving</td></tr>
          <tr><td>Plain membrane trap</td><td>250–350 mm</td><td>low–medium</td><td>medium — must be tuned</td></tr>
          <tr><td><b>Membrane trap with carbon</b></td><td>150–200 mm</td><td>medium (carbon ≈ a few dollars per kg in bulk)</td><td>medium — tune by measurement, watch humidity</td></tr>
          <tr><td>Helmholtz bank</td><td>200–300 mm</td><td>medium</td><td>medium–low — narrow, tuning critical</td></tr>
          <tr><td>Seat / speaker move, multiple subs, EQ cut</td><td>none</td><td>none–medium</td><td>high — always try first</td></tr></table></div>
        <p>Carbon is worth its cost when <b>depth</b> is what you are short of. Where you have space, plain thick absorbers are cheaper and more certain. See <a href="#/academy/m-treat-designs">Room Treatment Designs</a> and the <a href="#/absorbers">Absorber Designer</a>.</p>` },
      { h: 'Problems & solutions', html: `
        <div class="table-wrap"><table><tr><th>Problem</th><th>Likely cause</th><th>Solution</th></tr>
          <tr><td>No shift in tuning after adding carbon</td><td>Carbon damp, or bags packed tight with no air path</td><td>Dry it; use thinner bags with gaps; reduce fill</td></tr>
          <tr><td>Trap now tuned too low</td><td>Did not allow for the carbon</td><td>Remove some bags, lighten the panel, or reduce depth</td></tr>
          <tr><td>Absorption peak very weak</td><td>Box leaks or flexes; panel too stiff</td><td>Seal every joint; brace the box; thinner or limp panel</td></tr>
          <tr><td>Black dust around the trap</td><td>Unwashed carbon, coarse bag fabric, leaks</td><td>Finer bags, dedusted grade, seal the box</td></tr>
          <tr><td>Tuning creeps upward over months</td><td>Moisture uptake</td><td>Fresh desiccant, improve room dehumidification, re-dry the carbon</td></tr>
          <tr><td>Rattle on bass notes</td><td>Loose bags touching the panel</td><td>Fix cassettes to the back wall; keep clear of the panel</td></tr></table></div>` },
    ],
    quiz: [
      { q: 'What does activated carbon mainly change when placed in a resonant trap’s cavity?', opts: ['It adds mass to the panel', 'It makes the air spring softer and more damped', 'It blocks sound like a wall', 'It reflects bass'], a: 1, why: 'Sorption and diffusion raise the air’s effective compliance and add losses: lower, broader tuning.' },
      { q: 'Which form should you buy?', opts: ['Powdered activated carbon', 'Barbecue briquettes', 'Granular activated carbon, about 1–4 mm', 'Carbon fibre cloth'], a: 2, why: 'Granules let air move between and into them; powder packs and makes dust; briquettes are not activated.' },
      { q: 'Why keep the carbon dry?', opts: ['It smells otherwise', 'Water fills the pores and removes most of the effect', 'It becomes heavier', 'It turns reflective'], a: 1, why: 'Adsorbed water occupies the micropores that the air would use.' },
      { q: 'You designed a membrane trap for 55 Hz in air and then half-filled it with carbon. It will most likely…', opts: ['stay at 55 Hz', 'tune lower, roughly 47–50 Hz', 'tune higher', 'stop working'], a: 1, why: 'The softer spring pulls the resonance down by about 10–20 %, so aim high before adding carbon.' },
      { q: 'When is carbon the wrong choice?', opts: ['When depth is limited', 'When the room is damp and unconditioned, or you have plenty of depth', 'For membrane traps', 'For 50 Hz modes'], a: 1, why: 'Humidity kills the effect, and with space available plain deep absorbers are cheaper and more predictable.' },
    ],
  };
  const i = window.LESSONS.findIndex((l) => l.id === 'm-treat-designs');
  window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L);

  const pointer = { h: 'Going lower without going deeper: activated carbon', html: `
    <p>When a bass trap cannot be made deep enough, granular activated carbon in its cavity makes the trapped air behave like a larger, more damped volume: the trap tunes lower and wider at the same depth. It works only in a sealed, dry cavity and must be tuned by measurement. Full method, evidence and build details: <a href="#/academy/m-carbon">Activated Carbon for Low-Frequency Absorption</a>.</p>`, viz: 'carbonTrap' };
  ['m-treat-designs', 'm-absorb-how'].forEach((id) => { const l = window.LESSONS.find((x) => x.id === id); if (l) l.sections.push(pointer); });
})();
