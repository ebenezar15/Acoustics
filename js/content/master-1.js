/* ==========================================================================
   Academy — Studio Design Master Class, part 1 (M1–M6):
   myths & method, DIY, matter & energy, parameters of sound,
   how absorption works, coefficients & laboratory testing.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${k === 'Fix' || k === 'Proper fix' || k === 'Do this' ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const ps = (rows) => `<div class="table-wrap"><table><tr><th>Problem</th><th>Why it happens</th><th>Solution</th></tr>${rows.map(([a, b, c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td>${c}</td></tr>`).join('')}</table></div>`;

  /* ======================================================================
     M1 — Acoustic myths & the scientific method
     ====================================================================== */
  const SVG_METHOD = `<svg class="gsvg" viewBox="0 0 640 200" role="img" aria-label="The scientific method as a loop">
    <text x="320" y="20" text-anchor="middle" font-size="12" font-weight="700">The scientific method is a loop, not a straight line</text>
    ${[['Observe', 'the room booms at 57 Hz', 80], ['Hypothesise', '“a corner trap will fix it”', 200], ['Predict', '“−6 dB at 57 Hz”', 320], ['Test', 'measure before & after', 440], ['Conclude', 'keep, change or reject', 560]].map(([t, d, x], i) => `
      <rect x="${x - 55}" y="60" width="110" height="60" rx="10" fill="var(--panel2)" stroke="${i === 3 ? 'var(--accent)' : 'var(--line)'}" stroke-width="2"/>
      <text x="${x}" y="84" text-anchor="middle" font-size="12" font-weight="700">${t}</text>
      <text x="${x}" y="102" text-anchor="middle" font-size="9" fill="var(--muted)">${d}</text>
      ${i < 4 ? `<path d="M${x + 57} 90 L${x + 63} 90" stroke="var(--accent)" stroke-width="3"/><path d="M${x + 60} 85 L${x + 65} 90 L${x + 60} 95" fill="none" stroke="var(--accent)" stroke-width="2"/>` : ''}`).join('')}
    <path d="M560 122 C 560 175, 80 175, 80 122" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="320" y="186" text-anchor="middle" font-size="11" fill="var(--accent2)">results feed the next question — a claim is only as good as its test</text>
  </svg>`;

  const M1 = {
    id: 'm-myths', n: 'M1', track: 'master', title: 'Acoustic Myths & the Scientific Method', level: 'Foundation', mins: 30,
    summary: 'Why so much acoustic advice is wrong, the eight forces that keep myths alive, and a simple routine to test any claim before you spend money on it.',
    tags: ['myths', 'scientific method', 'measurement', 'critical thinking', 'lab reports'],
    sections: [
      { h: 'Why acoustics is full of myths', html: `
        <p class="lead">Sound is invisible, our ears adapt within seconds, and most people never measure. That combination makes acoustics a perfect breeding ground for confident, wrong advice.</p>
        <p>Every studio built on a myth costs real money: foam glued to a wall that was meant to stop the neighbours complaining, “bass traps” 25 mm thick, or a room built in the “perfect ratio” with the desk in exactly the wrong place. This course gives you a filter: the <b>scientific method</b>.</p>
        ${myth([
          ['“I heard a big difference, so it works.”', 'Hearing is easily fooled by level, expectation and position. A 1 dB louder playback sounds “better”. Measure, or at least compare blind at matched level.'],
          ['“A famous studio uses it, so it’s right.”', 'Famous rooms are built by teams who measured, tuned and often fixed problems you never hear about. Copying one visible detail copies none of that.'],
          ['“The product sheet says NRC 1.0.”', 'NRC hides the bass and depends on mounting and sample size. Ask for the full test report.'],
        ])}
        <div class="callout mentor">Good acousticians are not people who know every answer. They are people who ask “how do we know?” — and then check.</div>` },
      { h: 'The scientific method in five steps', html: `
        ${SVG_METHOD}
        ${flow([['Observe', 'what exactly is wrong, where, at what frequency?'], ['Hypothesise', 'a possible cause and a fix'], ['Predict', 'a number you expect to change'], ['Test', 'change one thing, measure again'], ['Conclude', 'accept, refine or throw away']])}
        <p>The key word is <b>predict</b>. “It will sound better” cannot be tested. “The 57 Hz peak will drop by about 6 dB and its decay will shorten from 0.8 to 0.4 s” can be.</p>
        <div class="callout data"><b>Rules of thumb for a fair test</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Change <b>one</b> variable at a time.</li><li>Keep the microphone, speaker and level exactly the same before and after (tape marks on the floor).</li><li>Repeat each measurement 2–3 times; differences smaller than the repeat-to-repeat spread mean nothing.</li><li>Below ~300 Hz, move the mic 30 cm and measure again — small rooms change a lot from spot to spot.</li></ul></div>` },
      { h: 'Eight reasons bad information survives', html: `
        <p>None of these make people stupid — they affect everyone, including professionals. Recognising them is the first defence.</p>
        <div class="uc-grid">
          ${uc('💰', 'Funding limitations', [['What it is', 'Proper testing costs money; many products are never tested independently.'], ['Acoustics example', 'A “bass trap” sold with only a 500 Hz–4 kHz graph — because the low bands looked bad or were never measured.'], ['Do this', 'No full third-octave report from an accredited lab? Treat the claims as marketing.']])}
          ${uc('🎓', 'Authority', [['What it is', 'Believing a claim because of who said it.'], ['Acoustics example', 'A well-known engineer recommends a material that suited their big room — it fails in your 10 m² room.'], ['Do this', 'Ask: under what conditions was it true? Does that match my room?']], '#7a5cc7')}
          ${uc('🧱', 'Dogmatism', [['What it is', '“This is how it’s always done.”'], ['Acoustics example', 'Insisting every control room must be LEDE, or that diffusers belong on every rear wall.'], ['Do this', 'Treat design philosophies as tools, each suited to certain sizes and budgets.']], '#c7772b')}
          ${uc('🙈', 'Human error', [['What it is', 'Honest mistakes in measuring or building.'], ['Acoustics example', 'A mic moved 20 cm between “before” and “after” — the 6 dB “improvement” is just a different spot.'], ['Do this', 'Mark positions, repeat, write everything down.']], '#2b9fc7')}
          ${uc('🔀', 'Illogical reasoning', [['What it is', 'Jumping from correlation to cause.'], ['Acoustics example', '“I added foam and the neighbours stopped complaining” — they actually went on holiday.'], ['Do this', 'Look for a mechanism. Foam has almost no mass, so it cannot block sound.']], '#d14b8f')}
          ${uc('🔮', 'Mystification', [['What it is', 'Wrapping simple physics in mystery to sell it.'], ['Acoustics example', '“Quantum resonator dots” or secret “tuning” stickers.'], ['Do this', 'If it can’t be explained with mass, springs, friction or geometry, be very suspicious.']], '#c7a12b')}
          ${uc('⏱️', 'Time constraints', [['What it is', 'No time to test, so shortcuts become “facts”.'], ['Acoustics example', 'A contractor skips sealing the back boxes because the deadline is tomorrow — the wall loses 10 dB.'], ['Do this', 'Put testing and inspection in the schedule, not after it.']], '#4c9a3a')}
          ${uc('🦚', 'Ego', [['What it is', 'Refusing to admit a mistake.'], ['Acoustics example', 'A designer defends a booth that measures badly instead of fixing it.'], ['Do this', 'Celebrate measurements that prove you wrong — they save the project.']])}
        </div>` },
      { h: 'Myth or fact? Test yourself', html: `
        <p>Twelve statements you will hear in forums, shops and studios. Decide, then read why — and follow the link to try it in the app.</p>`, viz: 'mythBuster' },
      { h: 'How to test a claim (the five questions)', html: `
        <div class="table-wrap"><table><tr><th>#</th><th>Ask</th><th>Good answer</th><th>Red flag</th></tr>
          <tr><td>1</td><td>What is the mechanism?</td><td>Mass, stiffness, friction, resonance, geometry</td><td>“Proprietary”, “energy”, “vibes”</td></tr>
          <tr><td>2</td><td>What was measured, and how?</td><td>Standard method (ASTM C423, E90, ISO 354…) with the mounting stated</td><td>“Customer feedback”, a single NRC number</td></tr>
          <tr><td>3</td><td>Which frequencies?</td><td>Third-octave data from 63/100 Hz upward</td><td>Only 250 Hz–4 kHz, or a smooth hand-drawn curve</td></tr>
          <tr><td>4</td><td>Who tested it?</td><td>An accredited, independent laboratory</td><td>The manufacturer’s own “lab”</td></tr>
          <tr><td>5</td><td>Does the test match my use?</td><td>Same thickness, air gap, room size and area</td><td>Big-room data used for a tiny booth</td></tr></table></div>
        <div class="callout example">A shop claims a 30 mm “acoustic panel” is a bass trap. The test report shows α = 0.08 at 125 Hz on Type A mounting. Answer: it is a mid/high absorber — useful at reflection points, useless for bass. Five minutes of reading saved the whole budget.</div>` },
      { h: 'Problems & solutions', html: `
        ${ps([
          ['Treatment “didn’t work”', 'The fix targeted the wrong frequency (thin panels for a bass problem)', 'Measure first; match treatment depth to the problem frequency'],
          ['Contradictory forum advice', 'Different rooms, sizes and goals', 'Ask for the room size and measurements behind each claim'],
          ['Before/after sounds different but measures the same', 'Expectation bias, level difference', 'Level-match and compare blind (a friend switches)'],
          ['Product data looks perfect', 'Marketing selects the best band or mounting', 'Request the full report; check mounting type and sample area'],
        ])}` },
      { h: 'Apply it', html: `
        ${flow([['Write the problem', 'with a number: “+12 dB at 57 Hz”'], ['Measure', 'with the free tools in the app'], ['Pick one fix', 'and predict the result'], ['Re-measure', 'same positions, same level'], ['Keep a log', 'what you changed and what happened']])}
        <p>Tools: <a href="#/measure">Measure (mic)</a> · <a href="#/analyzer">Room Analyzer</a> · <a href="#/predict">Room Predictor</a> · <a href="#/doctor">Room Doctor</a>.</p>` },
    ],
    quiz: [
      { q: 'Which statement can actually be tested?', opts: ['“This panel makes the room more musical”', '“This panel will lower the 125 Hz decay time from 0.6 s to 0.4 s”', '“This panel has great energy”', '“Pros love this panel”'], a: 1, why: 'A testable prediction has a number and a measurable quantity.' },
      { q: 'You measured before and after, but moved the mic between them. The result is…', opts: ['Valid', 'Unreliable — two variables changed', 'Better than one test', 'Only wrong above 1 kHz'], a: 1, why: 'Change one variable at a time; in small rooms position alone can change bass by 10 dB.' },
      { q: 'A product lists only NRC 0.95. What is missing?', opts: ['Nothing', 'Colour', 'Low-frequency data, mounting type and the full report', 'The price'], a: 2, why: 'NRC averages 250–2 000 Hz and depends on mounting and sample size.' },
      { q: '“A famous engineer uses it, so it must work” is an example of…', opts: ['Authority bias', 'Snell’s law', 'Mystification', 'Time constraints'], a: 0, why: 'Who said it is not evidence; the conditions and measurements are.' },
    ],
  };

  /* ======================================================================
     M2 — Why DIY goes wrong, and how to DIY right
     ====================================================================== */
  const SVG_DIY = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Isolation versus treatment">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Two different jobs: keep sound in/out vs make the room sound right</text>
    <rect x="30" y="40" width="270" height="150" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
    <text x="165" y="60" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent)">ISOLATION (soundproofing)</text>
    <rect x="150" y="75" width="14" height="90" fill="var(--muted)"/><rect x="172" y="75" width="14" height="90" fill="var(--muted)"/>
    <path d="M60 120 H140" stroke="var(--accent)" stroke-width="4"/><path d="M196 120 H226" stroke="var(--accent)" stroke-width="1.5" opacity=".5"/>
    <text x="165" y="182" text-anchor="middle" font-size="10" fill="var(--muted)">mass · airtightness · decoupling</text>
    <rect x="340" y="40" width="270" height="150" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
    <text x="475" y="60" text-anchor="middle" font-size="12" font-weight="700" fill="var(--c4)">TREATMENT (acoustics)</text>
    <rect x="360" y="75" width="230" height="90" fill="none" stroke="var(--muted)" stroke-width="3"/>
    <rect x="362" y="77" width="14" height="86" fill="var(--c4)" opacity=".7"/><rect x="574" y="77" width="14" height="86" fill="var(--c4)" opacity=".7"/>
    <path d="M420 120 L560 95 L440 150" fill="none" stroke="var(--c4)" stroke-width="2"/>
    <text x="475" y="182" text-anchor="middle" font-size="10" fill="var(--muted)">absorption · diffusion · geometry</text>
  </svg>`;

  const M2 = {
    id: 'm-diy', n: 'M2', track: 'master', title: 'Why DIY Design Goes Wrong — and How to DIY Right', level: 'Foundation', mins: 30,
    summary: 'The classic DIY studio mistakes, what you can safely build yourself, where to hire a professional, and a stage-by-stage plan and budget that avoids paying twice.',
    tags: ['DIY', 'planning', 'budget', 'flanking', 'ventilation', 'codes', 'fire safety'],
    sections: [
      { h: 'The real cost of “learning by building”', html: `
        <p class="lead">DIY is not the problem — <b>DIY design without a plan</b> is. Most mistakes are free to fix on paper and very expensive once boards are on the wall.</p>
        <p>Pick a classic mistake below and see when it is usually discovered and roughly how much more it costs to fix at that stage.</p>`, viz: 'diyCost' },
      { h: 'Mistake #1: confusing isolation with treatment', html: `
        ${SVG_DIY}
        <p>Foam, fabric panels and diffusers change how a room <i>sounds</i>; they do almost nothing for what the neighbours hear. Walls, doors, seals and floors stop sound <i>leaving</i>. Budget and design them separately.</p>
        <div class="callout warn">Spending the whole budget on foam to “soundproof” a drum room is the single most common studio mistake. Foam on a 35 dB wall gives you… a 35 dB wall that sounds deader inside.</div>` },
      { h: 'The other mistakes that catch DIY builders', html: `
        ${ps([
          ['Great wall, neighbours still hear', '<b>Flanking</b>: sound goes around the wall through the floor, ceiling, ducts or back-to-back sockets', 'Treat the room as a box: every surface and every hole matters'],
          ['Room is unbearable after 20 minutes', 'An airtight room has no fresh air', 'Plan silenced ventilation before building (see the HVAC course)'],
          ['Ceiling ends up at 2.05 m', 'Floating floor + inner ceiling + treatment each eat height', 'Draw a section with every layer before you buy anything'],
          ['Floor sags or cracks', 'Double gypsum walls and floating floors are heavy (60–150 kg/m²)', 'Check structural capacity with an engineer'],
          ['Inspection fails / insurance void', 'Electrical, fire and egress rules ignored', 'Permits and licensed trades where the law requires them'],
          ['Treatment chosen by eye', 'Thin panels absorb only highs', 'Measure, then size treatment for the problem frequency'],
        ])}
        <div class="callout safety">Fire: acoustic foams and fabrics burn fast and produce toxic smoke. Use materials with a fire rating suitable for the room (check local codes), and never block escape routes with a second door that locks from outside.</div>` },
      { h: 'What to DIY and when to hire', html: `
        <div class="table-wrap"><table><tr><th>Task</th><th>DIY?</th><th>Notes</th></tr>
          <tr><td>Absorber panels, bass traps, clouds</td><td><span class="good">✓ Yes</span></td><td>Simple carpentry; use the <a href="#/absorbers">Absorber Designer</a> and <a href="#/workshop">Workshop</a> drawings</td></tr>
          <tr><td>Diffusers</td><td><span class="good">✓ Yes</span></td><td>Accurate cutting matters; see <a href="#/diffusers">Diffuser Designer</a></td></tr>
          <tr><td>Door seals, window plugs, sealing gaps</td><td><span class="good">✓ Yes</span></td><td>Cheapest isolation upgrade there is</td></tr>
          <tr><td>Stud walls, inner leaf, double drywall</td><td><span class="warn">~ With care</span></td><td>Needs detail drawings, sealing discipline, check weight</td></tr>
          <tr><td>Floating floor</td><td><span class="warn">~ With care</span></td><td>Isolator selection and load calculation first (<a href="#/floors">Floating Floors</a>)</td></tr>
          <tr><td>Structural changes, roof, foundations</td><td><span class="bad">✗ Hire</span></td><td>Structural engineer + builder</td></tr>
          <tr><td>Electrical wiring, sub-panels</td><td><span class="bad">✗ Hire</span></td><td>Licensed electrician; you supply the “technical power” brief</td></tr>
          <tr><td>HVAC, gas, combustion appliances</td><td><span class="bad">✗ Hire</span></td><td>You specify quiet: low velocity, silencers, lined ducts</td></tr>
          <tr><td>Acoustic design of a pro room</td><td><span class="warn">~ Consultant</span></td><td>A few hours of expert review of your drawings is cheap insurance</td></tr></table></div>` },
      { h: 'Real-world stories', html: `
        <div class="uc-grid">
          ${uc('🥁', 'Garage drum room', [['Problem', 'Built 2 layers of drywall on the existing studs; neighbours still complain'], ['Cause', 'Single stud frame bridges both sides; the roll-up door is a 20 dB hole'], ['Fix', 'Independent inner frame + sealed door plug; floor slab already fine']])}
          ${uc('🎙️', 'Spare-room VO booth', [['Problem', 'Booth sounds boxy and gets hot'], ['Cause', 'Thin foam everywhere and no airflow'], ['Fix', '100 mm broadband panels, silenced intake/exhaust with a quiet inline fan']], '#2b9fc7')}
          ${uc('🏠', 'Loft studio', [['Problem', 'Headroom gone after floating floor'], ['Cause', 'Layers never drawn in section'], ['Fix', 'Rebuilt with a thinner pad-based floor — paid twice']], '#c7772b')}
          ${uc('🎧', 'Home mix room', [['Problem', 'Mixes don’t translate'], ['Cause', 'Desk in the centre of the room — bass null at the seat'], ['Fix', 'Seat moved to 38 % of length: free and the biggest improvement']], '#4c9a3a')}
        </div>` },
      { h: 'A stage-by-stage plan', html: `
        ${flow([['Brief', 'what you record, how loud, when, who must not hear it'], ['Survey', 'measure background noise & the room; check structure'], ['Design on paper', 'plan, sections, wall build-ups, HVAC, power'], ['Review', 'a consultant or experienced builder checks it'], ['Build isolation', 'shell, floor, walls, ceiling, doors, sealing'], ['Services', 'electrical, HVAC, cabling — before closing walls'], ['Treat & tune', 'measure, add treatment, measure again']])}
        <div class="callout data"><b>Budget split that works</b> for a home studio: ≈ 50–60 % isolation & construction, 15–20 % HVAC & electrical, 15–20 % treatment, 5–10 % measurement and contingency. If isolation is not needed (headphone-only, quiet neighbours), most of the money goes to treatment and monitors.</div>` },
      { h: 'Apply it', html: `
        <ol><li>Write a one-page brief: loudest source (dB), hours of use, quietest neighbour room.</li>
          <li>Use the <a href="#/academy/m-iso-basics">isolation requirement planner</a> to see what wall you really need.</li>
          <li>Draw the room in section with every layer and check the final height.</li>
          <li>Run your dimensions in the <a href="#/predict">Room Predictor</a> before fixing the desk position.</li>
          <li>Get the electrical and HVAC brief to licensed trades early.</li></ol>` },
    ],
    quiz: [
      { q: 'Which improves isolation to the neighbours?', opts: ['Acoustic foam', 'Diffusers', 'Mass, airtightness and decoupling', 'Egg crates'], a: 2, why: 'Treatment changes how the room sounds; isolation needs mass, seals and decoupling.' },
      { q: '“Flanking” means…', opts: ['Sound passing around the main wall through other paths', 'A type of diffuser', 'Echo between parallel walls', 'A fire rating'], a: 0, why: 'Floors, ceilings, ducts and sockets can bypass a great wall.' },
      { q: 'Which task should always go to a licensed professional?', opts: ['Building bass traps', 'Sealing a door', 'Electrical sub-panel wiring', 'Hanging a cloud'], a: 2, why: 'Electrical, structural, gas and combustion work are safety-critical and regulated.' },
      { q: 'When is a design mistake cheapest to fix?', opts: ['After moving in', 'During finishing', 'On paper', 'It costs the same'], a: 2, why: 'Costs grow roughly tenfold at each construction stage.' },
    ],
  };

  /* ======================================================================
     M3 — Matter, energy & how sound travels
     ====================================================================== */
  const SVG_STATES = `<svg class="gsvg" viewBox="0 0 640 215" role="img" aria-label="Particles in solids, liquids, gases and plasma">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">How tightly particles are held decides how fast sound travels</text>
    ${[['Solid', 'bonds like springs', '≈ 2 000–6 000 m/s', 85, 'grid'], ['Liquid', 'touching, free to slide', '≈ 1 500 m/s', 245, 'liq'], ['Gas', 'far apart, colliding', '≈ 343 m/s (air)', 405, 'gas'], ['Plasma', 'charged particles', 'stars, lightning', 565, 'pl']].map(([n, d, c, x, k]) => {
      let dots = '';
      for (let i = 0; i < 16; i++) {
        const gx = i % 4, gy = Math.floor(i / 4);
        let px, py;
        if (k === 'grid') { px = x - 36 + gx * 24; py = 52 + gy * 24; }
        else if (k === 'liq') { px = x - 38 + gx * 24 + ((gy * 7) % 9); py = 54 + gy * 22 + ((gx * 5) % 7); }
        else { px = x - 50 + ((i * 37) % 100); py = 46 + ((i * 53) % 96); }
        dots += `<circle cx="${px}" cy="${py}" r="${k === 'gas' || k === 'pl' ? 4 : 6}" fill="${k === 'pl' ? (i % 2 ? 'var(--warn)' : 'var(--c3)') : 'var(--accent)'}" opacity=".85"/>`;
      }
      const springs = k === 'grid' ? Array.from({ length: 12 }, (_, i) => { const gx = i % 3, gy = Math.floor(i / 3); return `<line x1="${x - 36 + gx * 24}" y1="${52 + gy * 24}" x2="${x - 12 + gx * 24}" y2="${52 + gy * 24}" stroke="var(--muted)" stroke-width="1.5"/>`; }).join('') : '';
      return `<rect x="${x - 70}" y="34" width="140" height="120" rx="10" fill="var(--panel2)" stroke="var(--line)"/>${springs}${dots}<text x="${x}" y="172" text-anchor="middle" font-size="12" font-weight="700">${n}</text><text x="${x}" y="188" text-anchor="middle" font-size="9" fill="var(--muted)">${d}</text><text x="${x}" y="202" text-anchor="middle" font-size="9" fill="var(--accent)">${c}</text>`;
    }).join('')}
  </svg>`;

  const SVG_ENERGY = `<svg class="gsvg" viewBox="0 0 640 170" role="img" aria-label="Kinetic and potential energy in a vibrating panel">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">A vibrating panel swaps energy between motion and spring</text>
    ${[[100, -30, 'Max bend: all POTENTIAL', 'var(--accent2)'], [320, 0, 'Centre: all KINETIC (fastest)', 'var(--accent)'], [540, 30, 'Max bend the other way', 'var(--accent2)']].map(([x, b, t, c]) => `
      <path d="M${x - 80} 90 Q ${x} ${90 + b * 1.4} ${x + 80} 90" stroke="${c}" stroke-width="5" fill="none"/>
      <rect x="${x - 86}" y="80" width="8" height="20" fill="var(--muted)"/><rect x="${x + 78}" y="80" width="8" height="20" fill="var(--muted)"/>
      <text x="${x}" y="146" text-anchor="middle" font-size="11" fill="${c}" font-weight="700">${t}</text>`).join('')}
    <text x="320" y="164" text-anchor="middle" font-size="10" fill="var(--muted)">Total energy = kinetic + potential. Damping (friction) bleeds a little off as heat every cycle.</text>
  </svg>`;

  const M3 = {
    id: 'm-matter', n: 'M3', track: 'master', title: 'Matter, Energy & How Sound Travels', level: 'Foundation', mins: 35,
    summary: 'Just enough physics to design with: why sound is faster in solids, how energy moves between motion and springiness, why energy never disappears (it turns into heat), and how sound bends when its speed changes.',
    tags: ['states of matter', 'energy', 'conservation of energy', 'Snell’s law', 'refraction', 'structure-borne sound'],
    sections: [
      { h: 'Sound is energy moving through matter', html: `
        <p class="lead">Sound needs “stuff” to travel through. A loudspeaker pushes the air particles next to it; they push their neighbours; the push travels on while each particle only wiggles back and forth.</p>
        ${SVG_STATES}
        <p>The stiffer the bonds and the lighter the particles, the faster the push travels. That is why a door slam in a concrete building is heard three floors away: in solids sound is 5–15 times faster than in air and loses very little energy per metre.</p>
        <div class="callout physics">Plasma (lightning, stars, a plasma tweeter) is a gas so hot that its atoms have lost electrons. It can still carry pressure waves — some exotic tweeters use a tiny plasma flame as a massless “cone”. For studio design you only need solids, liquids and gases.</div>`, viz: 'mediaSpeed' },
      { h: 'Mass, energy and the forces that hold materials together', html: `
        <p><b>Mass</b> is how much “stuff” something has — it resists being pushed (inertia). <b>Energy</b> is the ability to make something move or change. Sound design is mostly about trading these two.</p>
        <p>Of the four basic forces in nature — gravity, electromagnetism, and the strong and weak nuclear forces — only one really matters to acoustics: the <b>electromagnetic</b> force between atoms. It is what makes materials stiff, makes glue stick and makes a stud wall act like a spring. Gravity only matters because heavy walls and floors must be supported.</p>
        <div class="table-wrap"><table><tr><th>Property</th><th>What it does to sound</th><th>Design use</th></tr>
          <tr><td><b>Mass</b> (kg/m²)</td><td>Heavy panels are hard to shake</td><td>Isolation: mass law, +6 dB per doubling</td></tr>
          <tr><td><b>Stiffness</b></td><td>Stiff panels pass bending waves easily (coincidence)</td><td>Avoid very stiff thin leaves; use damped or layered boards</td></tr>
          <tr><td><b>Damping</b></td><td>Turns vibration into heat</td><td>Damping compounds, wool in cavities, constrained layers</td></tr>
          <tr><td><b>Air (springiness)</b></td><td>Trapped air acts as a spring</td><td>Double walls, membrane traps, floating floors</td></tr></table></div>` },
      { h: 'Kinetic + potential: how things vibrate', html: `
        ${SVG_ENERGY}
        <p>Anything that vibrates — an air particle, a drum head, a plywood bass trap, a floating floor on springs — constantly swaps energy between <b>kinetic</b> (movement) and <b>potential</b> (stored in a spring or a bend). The rate of swapping is its natural (resonant) frequency.</p>
        <div class="formula"><span class="lbl">Total energy of a vibrating system</span>E = E<sub>kinetic</sub> + E<sub>potential</sub> = constant (until damping removes some)</div>
        <div class="callout example">A floating floor is a heavy mass on rubber springs. Below its resonance it moves with the building; well above it, the springs absorb the swap and very little vibration gets through. That is why isolators are chosen so the resonance sits far below the music.</div>` },
      { h: 'Energy never disappears — it changes form', html: `
        <p>The <b>law of conservation of energy</b> is the most useful rule in acoustics: sound hitting a surface must go somewhere. It is reflected back, turned into heat inside the material (absorbed), or passed through (transmitted).</p>
        <div class="formula"><span class="lbl">At every surface</span>incident = reflected + absorbed (heat) + transmitted</div>
        <p>Try the surfaces below — notice how foam “absorbs” a lot but transmits almost as much as the bare wall. And the heat? Tiny: a loud band produces a few watts of sound, warming a room by far less than one person does.</p>`, viz: 'energyFlow' },
      { h: 'Snell’s law: sound bends when its speed changes', html: `
        <p>When sound crosses into a region where it travels at a different speed, it changes direction — <b>refraction</b>. Snell’s law tells you how much: sin θ₁ / c₁ = sin θ₂ / c₂.</p>
        <p>Outdoors, warm and cold layers of air and wind make the atmosphere a stack of such regions. That explains some very practical puzzles: why a festival is inaudible at 3 pm and keeps a village awake at 11 pm, and why noise surveys must cover night and weather.</p>`, viz: 'snell' },
      { h: 'Where you will meet this in real projects', html: `
        <div class="uc-grid">
          ${uc('🏢', 'Apartment studio', [['Physics', 'Sound in concrete travels fast and far'], ['Symptom', 'Kick drum heard on other floors'], ['Do this', 'Decouple speakers and floors (springs/pads) — stop vibration entering the structure']])}
          ${uc('🌙', 'Rural studio, night sessions', [['Physics', 'Temperature inversion bends sound down'], ['Symptom', 'Complaints only at night'], ['Do this', 'Design isolation for the quietest night conditions, not daytime readings']], '#7a5cc7')}
          ${uc('🧽', 'Foam “soundproofing”', [['Physics', 'Energy is absorbed inside the room but still transmitted'], ['Symptom', 'Room sounds dead, neighbours unchanged'], ['Do this', 'Add mass and seal gaps for isolation']], '#c7772b')}
          ${uc('🥁', 'Drum riser', [['Physics', 'Mass on a spring: kinetic ↔ potential'], ['Symptom', 'Riser booms at one note'], ['Do this', 'Add damping (wool in the cavity) and mass; tune resonance below the kick']], '#4c9a3a')}
        </div>` },
      { h: 'Problems & solutions', html: `
        ${ps([
          ['Footsteps & thumps travel through the building', 'Solids carry sound fast with low loss', 'Break the path: resilient layers, floating floors, isolation hangers'],
          ['Wall vibrates at one frequency', 'Resonance: mass + stiffness swap energy', 'Add damping (compound), change mass or stiffness'],
          ['Absorbers made the room dull but not quieter outside', 'Absorption ≠ isolation', 'Separate the two jobs; isolate with mass and seals'],
          ['Outdoor noise survey misleading', 'Refraction changes with time of day and wind', 'Measure across days, nights and weather'],
        ])}` },
      { h: 'Apply it', html: `
        ${flow([['Identify the path', 'air-borne or structure-borne?'], ['Air-borne', 'mass, seals, double leaves'], ['Structure-borne', 'break the solid path with springs/pads'], ['Inside the room', 'turn energy into heat with absorbers'], ['Outdoors', 'check night & downwind conditions']])}
        <p>Next: <a href="#/academy/m-params">The physical parameters of sound</a> · Try <a href="#/lab/vib">vibration isolation</a> and <a href="#/lab/dbwall">dB through a wall</a> in the Physics Lab.</p>` },
    ],
    quiz: [
      { q: 'In which material does sound travel fastest?', opts: ['Air', 'Water', 'Steel', 'Mineral wool'], a: 2, why: 'Stiff bonds carry the push quickly: about 5 900 m/s in steel.' },
      { q: 'Sound energy absorbed by a panel becomes…', opts: ['Nothing — it disappears', 'Heat', 'Light', 'Electricity'], a: 1, why: 'Conservation of energy: friction turns motion into (very little) heat.' },
      { q: 'A vibrating panel at the centre of its swing has mostly…', opts: ['Potential energy', 'Kinetic energy', 'No energy', 'Thermal energy only'], a: 1, why: 'It is moving fastest there; at maximum bend energy is stored as potential.' },
      { q: 'Why can a distant venue be louder at night?', opts: ['People listen harder', 'Temperature inversion bends sound back down', 'The speed of sound doubles', 'Snell’s law stops working'], a: 1, why: 'Refraction in layered air bends sound toward the ground on still nights.' },
    ],
  };

  /* ======================================================================
     M4 — Physical parameters of sound & inverse-square law
     ====================================================================== */
  const SVG_ISL = `<svg class="gsvg" viewBox="0 0 640 245" role="img" aria-label="Inverse square law spreading">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Double the distance → the same energy covers 4× the area → −6 dB</text>
    <circle cx="60" cy="110" r="10" fill="var(--accent)"/>
    ${[[150, 1, '1 m', '90 dB'], [280, 2, '2 m', '84 dB'], [500, 4, '4 m', '78 dB']].map(([x, k, d, L]) => `
      <rect x="${x}" y="${110 - k * 18}" width="${k * 9}" height="${k * 36}" fill="var(--accent)" opacity="${0.75 / k}" stroke="var(--accent)"/>
      <text x="${x + k * 4.5}" y="${110 + k * 18 + 16}" text-anchor="middle" font-size="11" font-weight="700">${d}</text>
      <text x="${x + k * 4.5}" y="${110 + k * 18 + 30}" text-anchor="middle" font-size="10" fill="var(--muted)">${L} · ${k * k}× area</text>`).join('')}
    <path d="M70 110 L150 92 M70 110 L150 128 M70 110 L280 74 M70 110 L280 146 M70 110 L500 38 M70 110 L500 182" stroke="var(--muted)" stroke-dasharray="3 4"/>
  </svg>`;

  const M4 = {
    id: 'm-params', n: 'M4', track: 'master', title: 'The Physical Parameters of Sound & the Inverse-Square Law', level: 'Foundation', mins: 30,
    summary: 'Vibration, intensity and decibels, wavelength and speed — with real-world sizes — and how sound fades with distance outdoors and indoors, for planning sites, rooms and loudspeakers.',
    tags: ['frequency', 'wavelength', 'intensity', 'decibel', 'speed of sound', 'inverse-square law', 'line source', 'critical distance'],
    sections: [
      { h: 'Sound and vibration', html: `
        <p class="lead">Every sound starts with something vibrating — a string, a vocal cord, a cone, a slamming door. The vibration pushes air into small pressure ripples that travel at about <b>343 m/s</b> (20 °C).</p>
        ${flow([['Frequency', 'vibrations per second (Hz) → pitch'], ['Amplitude', 'size of the pressure ripple → loudness'], ['Wavelength', 'distance between ripples → how it meets objects'], ['Speed', 'set by the medium, not the sound']])}
        <div class="formula"><span class="lbl">The one equation to remember</span>wavelength λ = speed c / frequency f &nbsp;&nbsp; (343 / 100 Hz = 3.4 m)</div>` },
      { h: 'Intensity and the decibel', html: `
        <p>Sound <b>intensity</b> is power flowing through each square metre (W/m²). The ear handles a range of a million-million to one, so we use a logarithmic scale: the <b>decibel</b>.</p>
        <div class="table-wrap"><table><tr><th>Change</th><th>dB</th><th>What you notice</th></tr>
          <tr><td>Energy × 2 (two equal sources)</td><td class="num">+3</td><td>Just clearly louder</td></tr>
          <tr><td>Pressure × 2 (distance ÷ 2)</td><td class="num">+6</td><td>Noticeably louder</td></tr>
          <tr><td>Energy × 10</td><td class="num">+10</td><td>About twice as loud</td></tr>
          <tr><td>Energy × 1 000</td><td class="num">+30</td><td>About 8× as loud</td></tr></table></div>
        <div class="callout data">Practical references: quiet bedroom at night 20–25 dBA · conversation 60 dB · loud mixing 85 dB · drum kit 110–120 dB peaks · pain ~130 dB. See <a href="#/hear">Hear the Decibel</a>.</div>` },
      { h: 'Wavelength: why size matters', html: `
        <div class="table-wrap"><table><tr><th>Frequency</th><th>Wavelength</th><th>About the size of…</th><th>Design meaning</th></tr>
          <tr><td>40 Hz</td><td>8.6 m</td><td>a bus</td><td>Walks straight through thin walls; room modes</td></tr>
          <tr><td>100 Hz</td><td>3.4 m</td><td>a room height and a half</td><td>Needs deep traps; small rooms are “modal”</td></tr>
          <tr><td>500 Hz</td><td>0.69 m</td><td>a door width</td><td>Thick panels absorb; objects start to reflect</td></tr>
          <tr><td>1 kHz</td><td>0.34 m</td><td>a ruler</td><td>Speech clarity; 50 mm panels work</td></tr>
          <tr><td>4 kHz</td><td>86 mm</td><td>a phone</td><td>Beams, reflects like light</td></tr>
          <tr><td>10 kHz</td><td>34 mm</td><td>a matchbox</td><td>Absorbed by almost anything soft</td></tr></table></div>
        <p>A surface only “sees” sound whose wavelength is about its own size or smaller. A 600 mm panel barely affects 100 Hz; it reflects 4 kHz like a mirror.</p>`, viz: 'wavelength' },
      { h: 'Speed of sound', html: `
        <p>In air the speed rises about <b>0.6 m/s per °C</b> (331 m/s at 0 °C, 343 m/s at 20 °C). It does not depend on loudness or pitch. Speed links distance to time — the basis of delay alignment, echoes and reflections.</p>
        <div class="formula"><span class="lbl">Time and distance</span>1 ms ≈ 34 cm · 3 ms ≈ 1 m · a reflection 17 m longer than the direct path arrives 50 ms late → heard as an echo</div>
        <div class="callout example">Two speakers 1.7 m apart in depth reach the listener 5 ms apart — enough to smear the kick drum. Delay the nearer one by 5 ms and they line up again.</div>` },
      { h: 'The inverse-square law', html: `
        ${SVG_ISL}
        <p>From a small (point) source, sound spreads as a sphere; each doubling of distance spreads the same energy over four times the area, so the level falls by <b>6 dB</b>.</p>
        <div class="formula"><span class="lbl">Distance loss, point source</span>L₂ = L₁ − 20·log₁₀(r₂ / r₁) &nbsp;·&nbsp; line source (busy road, rail, line array): L₂ = L₁ − 10·log₁₀(r₂ / r₁)</div>`, viz: 'inverseSquare' },
      { h: 'Noise reduction with distance — in real life', html: `
        <div class="uc-grid">
          ${uc('🚗', 'Studio next to a main road', [['Source type', 'Continuous traffic = line source'], ['Rule', '−3 dB per doubling of distance'], ['Do this', 'Distance alone barely helps — 10 m → 40 m is only −6 dB. Put mass in the façade facing the road']])}
          ${uc('🏭', 'Rooftop AC unit', [['Source type', 'Point source'], ['Rule', '−6 dB per doubling'], ['Do this', 'Moving it from 5 m to 20 m away gives −12 dB; add a barrier for another 5–15 dB']], '#c7772b')}
          ${uc('🏠', 'Inside a room', [['Source type', 'Direct + reverberant sound'], ['Rule', 'Beyond the critical distance the level stops falling'], ['Do this', 'Absorption lowers the reverberant level; distance alone doesn’t']], '#2b9fc7')}
          ${uc('🎤', 'Live room mics', [['Source type', 'Close miking'], ['Rule', 'Halve the mic distance → +6 dB direct, same room'], ['Do this', 'Move mics closer before adding treatment for “less room”']], '#4c9a3a')}
        </div>
        <div class="callout warn">Indoors the inverse-square law only holds close to the source. Further away, reflections build a <b>reverberant field</b> that stays roughly constant everywhere — moving away from a noisy machine in a hard room helps far less than outdoors.</div>` },
      { h: 'Problems & solutions', html: `
        ${ps([
          ['Moved the studio further from the road, still noisy', 'Traffic is a line source: only −3 dB per doubling', 'Heavier façade, better windows, a barrier or berm'],
          ['Machine room noise fills the corridor', 'Reverberant field, not distance, dominates indoors', 'Absorb the corridor; isolate the machine room door'],
          ['Echo from the back wall of a hall', 'Reflection path ≥ 17 m longer → ≥ 50 ms', 'Absorb or diffuse the rear wall; angle it'],
          ['Panels “don’t work” on bass', 'Wavelengths much larger than the panel depth', 'Deep traps, air gaps, membranes'],
        ])}` },
      { h: 'Apply it', html: `
        ${flow([['List the sources', 'point or line? outdoor or indoor?'], ['Estimate levels', 'at 1 m or at the site boundary'], ['Apply distance loss', '−6 or −3 dB per doubling'], ['Add barriers / walls', 'for what distance cannot do'], ['Check critical distance', 'indoors use absorption']])}
        <p>Tools: <a href="#/calc">Calculators</a> (distance, dB sum, wavelength) · <a href="#/lab/distance">Distance & Rooms lab</a>.</p>` },
    ],
    quiz: [
      { q: 'What is the wavelength of 343 Hz in air?', opts: ['34 cm', '1 m', '3.4 m', '10 cm'], a: 1, why: 'λ = 343 / 343 = 1 m.' },
      { q: 'You double the distance from a small machine outdoors. The level drops by…', opts: ['3 dB', '6 dB', '10 dB', '20 dB'], a: 1, why: 'Point source: −6 dB per doubling.' },
      { q: 'A busy motorway behaves like…', opts: ['A point source (−6 dB/doubling)', 'A line source (−3 dB/doubling)', 'No source', 'A diffuser'], a: 1, why: 'Continuous traffic spreads cylindrically.' },
      { q: 'Inside a reverberant room, far from the source, moving further away…', opts: ['Keeps reducing level by 6 dB per doubling', 'Changes level very little', 'Raises the level', 'Removes all reflections'], a: 1, why: 'Beyond the critical distance the reverberant field dominates.' },
    ],
  };

  /* ======================================================================
     M5 — How absorption works
     ====================================================================== */
  const SVG_VEL = `<svg class="gsvg" viewBox="0 0 640 200" role="img" aria-label="Particle velocity near a wall">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Porous absorbers need moving air — and air can’t move at the wall</text>
    <rect x="590" y="30" width="20" height="150" fill="var(--muted)"/>
    <path d="M590 105 ${Array.from({ length: 60 }, (_, i) => { const x = 590 - i * 9; const v = Math.sin((i * 9 / 540) * Math.PI) * 60; return `L${x} ${105 - v}`; }).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="3"/>
    <rect x="530" y="30" width="60" height="150" fill="var(--c4)" opacity=".35"/>
    <text x="560" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">thin panel: little motion</text>
    <rect x="320" y="30" width="80" height="150" fill="var(--c4)" opacity=".35"/>
    <text x="360" y="196" text-anchor="middle" font-size="10" fill="var(--good)">gap → panel sits at λ/4 peak</text>
    <text x="200" y="150" text-anchor="middle" font-size="11" fill="var(--accent)">air velocity (peaks at λ/4 from the wall)</text><text x="584" y="122" text-anchor="end" font-size="9" fill="var(--muted)">0 at wall</text>
    <line x1="320" y1="30" x2="320" y2="180" stroke="var(--accent)" stroke-dasharray="4 4"/>
  </svg>`;

  const M5 = {
    id: 'm-absorb-how', n: 'M5', track: 'master', title: 'How Absorption Works: Frictional, Diffractive, Diaphragmatic & Resonant', level: 'Core', mins: 40,
    summary: 'The four ways a material turns sound into heat, what frequency range each covers, how to build and place each one, and a table of treatments by job.',
    tags: ['porous absorber', 'flow resistivity', 'slats', 'membrane trap', 'Helmholtz', 'air gap', 'quarter wavelength'],
    sections: [
      { h: 'Four mechanisms, one goal: sound → heat', html: `
        <p class="lead">Every absorber, however clever, uses one or more of four mechanisms. Knowing which one tells you what frequencies it can reach and where it belongs.</p>
        <p>Pick each mechanism below: the animation shows what moves; the curve shows where it works.</p>`, viz: 'absorbMech' },
      { h: '1 · Frictional (porous) absorption', html: `
        ${SVG_VEL}
        <p>Air pumped through mineral wool, glass wool, polyester, open-cell foam or thick fabric rubs against millions of fibres. The friction steals energy. It works best where the air <b>moves</b> most — a quarter wavelength from a hard wall — so <b>thickness and air gap decide the lowest frequency</b>.</p>
        <div class="callout data"><b>Rules of thumb</b>: works well above roughly c / (4 × total depth). 50 mm on the wall → good above ~500 Hz · 100 mm + 100 mm gap → good above ~250 Hz and useful to 125 Hz · 300 mm corner superchunks → help down to ~60–80 Hz. Flow resistivity of 5–20 kPa·s/m² suits most panels.</div>
        <p>Experiment with depth, gap and density:</p>`, viz: 'porous' },
      { h: '2 · Diffractive absorption (edges, slots and small panels)', html: `
        <p>Sound bends around edges. Near an edge or through a slot, air speeds up — and faster air means more friction in any porous layer behind. Two practical consequences:</p>
        <ul><li><b>Spaced panels</b> absorb more per square metre than one big block (more edges). Panels with gaps between them on a wall work very efficiently.</li>
          <li><b>Slatted fronts</b> (wood slats with gaps over wool) channel air through the slots: they keep some mid/high reflection (a “live” look and sound) while absorbing the low-mids. Change slat width and gap to tune.</li></ul>
        <div class="callout example">A slat wall with 70 mm slats and 10 mm gaps over 100 mm wool absorbs strongly from ~150–800 Hz but reflects much of the treble — ideal for a live room or a lounge that should not sound dead.</div>` },
      { h: '3 · Diaphragmatic (membrane) absorption', html: `
        <p>A sealed panel (plywood, MDF, hardboard, a limp heavy membrane) on an air cavity is a <b>mass on an air spring</b>. At resonance it moves the most and loses energy in its own damping and in wool inside the cavity.</p>
        <div class="formula"><span class="lbl">Membrane resonance (cavity partly filled)</span>f₀ ≈ 50 / √(m · d) &nbsp; m = panel mass (kg/m²), d = cavity depth (m)</div>
        <div class="callout data">6 mm plywood (≈ 3.6 kg/m²) on a 150 mm cavity → f₀ ≈ 68 Hz. Narrow band (about an octave), strong at bass from shallow depths, and it reflects the highs — handy where a room should not get too dead.</div>
        <div class="callout warn">Membranes are pressure devices: put them where the target mode has high pressure (corners, the wall where the mode peaks). A membrane trap tuned to 60 Hz on the wrong wall does almost nothing.</div>` },
      { h: '4 · Resonant (Helmholtz) absorption', html: `
        <p>Blow across a bottle: the air in the neck bounces on the air inside. Perforated or slotted panels over a cavity are arrays of tiny bottles. Friction in the necks and wool in the cavity absorb at the resonance.</p>
        <div class="formula"><span class="lbl">Helmholtz resonance</span>f₀ = (c / 2π) · √( S / (V · L′) ) &nbsp; S neck area, V cavity volume, L′ effective neck length</div>
        <p>Very selective — perfect for one stubborn room mode or for tuning a perforated wall to a band. Try it:</p>`, viz: 'helmholtz' },
      { h: 'Sound-absorbing treatment: examples & uses', html: `
        <div class="table-wrap"><table><tr><th>Treatment</th><th>Mechanism</th><th>Range</th><th>Typical use</th></tr>
          <tr><td>50 mm fabric panel</td><td>Frictional</td><td>500 Hz +</td><td>Reflection points, speech rooms, booths (with deeper bass control)</td></tr>
          <tr><td>100 mm panel + 100 mm gap</td><td>Frictional</td><td>125–250 Hz +</td><td>Control rooms, rear walls, clouds</td></tr>
          <tr><td>Corner superchunk (300 mm+)</td><td>Frictional</td><td>60 Hz +</td><td>All small rooms</td></tr>
          <tr><td>Slatted wall over wool</td><td>Diffractive + frictional</td><td>150–800 Hz</td><td>Live rooms, lounges, halls</td></tr>
          <tr><td>Membrane trap</td><td>Diaphragmatic</td><td>40–150 Hz band</td><td>One or two problem modes, shallow spaces</td></tr>
          <tr><td>Perforated / slotted panel</td><td>Resonant</td><td>Tuned band</td><td>Architectural finishes, auditoria</td></tr>
          <tr><td>Micro-perforated panel</td><td>Resonant + friction in tiny holes</td><td>Broad mid band</td><td>Glass/clear absorbers, clean rooms</td></tr>
          <tr><td>Curtains, carpets, seats, people</td><td>Frictional</td><td>Mid/high</td><td>Variable acoustics, halls</td></tr></table></div>
        <p>Design and draw your own in the <a href="#/absorbers">Absorber Designer</a>; see build drawings in the <a href="#/workshop">Workshop</a>.</p>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎧', 'Home mix room, boomy 60 Hz', [['Mechanism', 'Frictional (corners) + diaphragmatic (one mode)'], ['Do this', '4 deep corner traps + a 60 Hz membrane in a front corner'], ['Avoid', '25 mm foam “bass traps”']])}
          ${uc('🎤', 'Podcast room', [['Mechanism', 'Frictional'], ['Do this', '100 mm panels at mouth height on all walls, rug, cloud'], ['Avoid', 'Covering only the wall in front of you']], '#2b9fc7')}
          ${uc('🎻', 'Live room that should sound alive', [['Mechanism', 'Diffractive (slats) + diffusion'], ['Do this', 'Slat walls on 2 walls, diffuser on one, hard floor'], ['Avoid', 'Wall-to-wall foam']], '#c7772b')}
          ${uc('🏛️', 'Reception with glass walls', [['Mechanism', 'Resonant (micro-perforated)'], ['Do this', 'Micro-perforated ceiling or clear panels'], ['Avoid', 'Thin decorative felt only']], '#7a5cc7')}
        </div>` },
      { h: 'Problems & solutions', html: `
        ${ps([
          ['Room is dull but boomy', 'Only thin porous treatment: highs gone, bass untouched', 'Replace some thin panels with deep traps and air gaps'],
          ['Membrane trap does nothing', 'Wrong tuning or placed at a pressure null', 'Measure the mode; place where its pressure is high'],
          ['Panels on the wall barely help at 125 Hz', 'Mounted flat: air is still at the wall', 'Space them 50–100 mm off the wall'],
          ['Perforated panel rattles', 'Loose fixing or unsealed cavity', 'Seal the cavity edges and screw the panel on a stiff frame'],
        ])}` },
    ],
    quiz: [
      { q: 'Why does an air gap behind a porous panel improve bass absorption?', opts: ['It adds mass', 'It moves the panel to where air velocity is higher', 'It makes the panel resonate', 'It blocks sound'], a: 1, why: 'Air velocity is zero at the wall and peaks a quarter wavelength away.' },
      { q: 'A 6 mm plywood panel on a 150 mm cavity is mainly a…', opts: ['Frictional absorber', 'Diaphragmatic (membrane) absorber', 'Diffuser', 'Isolation wall'], a: 1, why: 'Panel mass + air spring: a membrane resonator near 70 Hz.' },
      { q: 'Slatted wood over wool is useful because it…', opts: ['Absorbs everything equally', 'Absorbs low-mids while keeping some highs reflected', 'Blocks sound to the neighbours', 'Only works at 10 kHz'], a: 1, why: 'Slots channel air into the wool; the slats reflect higher frequencies.' },
      { q: 'Where should a pressure-type bass trap go?', opts: ['Room centre', 'Where the target mode has high pressure, e.g. corners', 'On the door', 'Behind the listener’s head'], a: 1, why: 'Membranes and porous traps for modes work at high pressure; all modes peak in corners.' },
    ],
  };

  /* ======================================================================
     M6 — Coefficients, RT and laboratory testing
     ====================================================================== */
  const SVG_REVROOM = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Reverberation room test setup">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Reverberation-room test: measure decay empty, then with the sample</text>
    <polygon points="60,40 360,30 380,190 40,200" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/>
    <rect x="150" y="150" width="120" height="30" fill="var(--c4)" opacity=".8"/><text x="210" y="170" text-anchor="middle" font-size="10">sample ≈ 6.7 m²</text>
    <path d="M90 60 q20 20 40 0" stroke="var(--accent2)" stroke-width="4" fill="none"/><path d="M290 60 q20 25 40 5" stroke="var(--accent2)" stroke-width="4" fill="none"/>
    <text x="210" y="58" text-anchor="middle" font-size="9" fill="var(--accent2)">hanging diffusers</text>
    <rect x="70" y="160" width="22" height="22" fill="var(--accent)"/><text x="81" y="196" text-anchor="middle" font-size="9">speaker</text>
    <circle cx="320" cy="110" r="6" fill="var(--bad)"/><circle cx="120" cy="110" r="6" fill="var(--bad)"/><text x="320" y="128" text-anchor="middle" font-size="9">mics</text>
    <text x="210" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">≈ 200 m³, hard, non-parallel walls</text>
    <rect x="420" y="40" width="200" height="150" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
    <text x="520" y="62" text-anchor="middle" font-size="11" font-weight="700">The arithmetic</text>
    <text x="520" y="88" text-anchor="middle" font-size="10">empty: T₁ = 6.0 s</text>
    <text x="520" y="106" text-anchor="middle" font-size="10">with sample: T₂ = 3.2 s</text>
    <text x="520" y="130" text-anchor="middle" font-size="10" fill="var(--accent)">A = 0.161·V·(1/T₂ − 1/T₁)</text>
    <text x="520" y="148" text-anchor="middle" font-size="10" fill="var(--accent)">≈ 4.7 m² sabins</text>
    <text x="520" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="var(--good)">α = 4.7 / 6.7 ≈ 0.70</text>
  </svg>`;

  const M6 = {
    id: 'm-lab', n: 'M6', track: 'master', title: 'Absorption Coefficients, Reverberation Time & Laboratory Testing', level: 'Core', mins: 40,
    summary: 'What α, sabins, NRC and SAA really mean, how reverberation time is measured, how reverberation-room tests work (ASTM C423 / ISO 354), why mounting changes everything, and how to read a test report.',
    tags: ['absorption coefficient', 'sabin', 'NRC', 'SAA', 'RT60', 'ASTM C423', 'ISO 354', 'ASTM E795', 'mounting', 'reverberation room'],
    sections: [
      { h: 'The absorption coefficient α in one picture', html: `
        <p class="lead">α is the fraction of sound energy a surface does <b>not</b> reflect. α = 0 is a perfect mirror; α = 1 is an open window.</p>
        <div class="formula"><span class="lbl">Total absorption of a room (sabins, m²)</span>A = Σ (area × α) &nbsp; e.g. 10 m² of panel at α 0.8 = 8 m² sabins — as good as 8 m² of open window</div>
        <div class="table-wrap"><table><tr><th>Surface</th><th class="num">125 Hz</th><th class="num">500 Hz</th><th class="num">2 kHz</th></tr>
          <tr><td>Painted concrete</td><td class="num">0.01</td><td class="num">0.02</td><td class="num">0.02</td></tr>
          <tr><td>Drywall on studs</td><td class="num">0.25</td><td class="num">0.05</td><td class="num">0.04</td></tr>
          <tr><td>Carpet on concrete</td><td class="num">0.05</td><td class="num">0.25</td><td class="num">0.60</td></tr>
          <tr><td>50 mm mineral wool on wall</td><td class="num">0.20</td><td class="num">0.90</td><td class="num">0.95</td></tr>
          <tr><td>100 mm wool + 100 mm gap</td><td class="num">0.60</td><td class="num">1.00</td><td class="num">1.00</td></tr></table></div>
        <div class="callout data">Single numbers: <b>NRC</b> = average of 250, 500, 1k and 2k Hz, rounded to 0.05. <b>SAA</b> = average of twelve third-octaves from 200 to 2 500 Hz. Neither tells you anything about 63–160 Hz — the region that matters most in small studios.</div>` },
      { h: 'Reverberation time — and which number to trust', html: `
        <p>RT (RT60) is how long sound takes to fall by 60 dB after the source stops. Sabine’s formula links it to volume and absorption:</p>
        <div class="formula"><span class="lbl">Sabine (lively rooms) · Eyring (more absorptive rooms)</span>RT = 0.161·V / A &nbsp;·&nbsp; RT = 0.161·V / (−S·ln(1 − ᾱ))</div>
        <div class="table-wrap"><table><tr><th>Protocol</th><th>Use it for</th></tr>
          <tr><td><b>T30</b> (−5 to −35 dB, ×2)</td><td>The standard RT estimate when you have enough signal above noise</td></tr>
          <tr><td><b>T20</b> (−5 to −25 dB, ×3)</td><td>Small or noisy rooms — the most useful everyday number in studios</td></tr>
          <tr><td><b>EDT</b> (0 to −10 dB, ×6)</td><td>How reverberant a room <i>sounds</i>; reveals strong early reflections</td></tr>
          <tr><td>Below the Schroeder frequency</td><td>RT loses meaning in small rooms — look at modal decay (waterfall) instead</td></tr></table></div>
        <p>Measurements follow ISO 3382. Explore a decay curve:</p>`, viz: 'decayLab' },
      { h: 'How a laboratory measures α (ASTM C423 / ISO 354)', html: `
        ${SVG_REVROOM}
        ${flow([['Empty room', 'measure decay T₁ in each third-octave'], ['Add sample', '≈ 6.7 m² (72 ft²) laid in a set mounting'], ['Measure again', 'decay T₂ is shorter'], ['Compute sabins', 'A = 0.161·V·(1/T₂ − 1/T₁)'], ['Divide by area', 'α = A / sample area']])}
        <p>Try it — change thickness, density and mounting and watch the decays and the reported α change.</p>`, viz: 'reverbRoomTest' },
      { h: 'Reverberation rooms: why they look so strange', html: `
        <ul><li><b>Big and hard</b> (often 200 m³ or more): very low absorption so a small sample makes a clear difference.</li>
          <li><b>No parallel walls</b> and <b>hanging diffuser panels</b>: to make the sound field as diffuse as possible, so sound hits the sample from all angles (“random incidence”).</li>
          <li><b>Very quiet and isolated</b>: decays must be measured over 30+ dB.</li>
          <li><b>Several speaker and mic positions</b>, averaged — because even big rooms have modes at low frequencies.</li></ul>
        <div class="callout physics">Below about 100 Hz most reverberation rooms are no longer diffuse, so low-frequency α values carry more uncertainty — another reason to measure bass traps in situ as well.</div>` },
      { h: 'Mounting changes everything (ASTM E795)', html: `
        <div class="table-wrap"><table><tr><th>Mounting</th><th>What it means</th><th>Typical product</th><th>Effect</th></tr>
          <tr><td><b>Type A</b></td><td>Laid directly on the hard floor</td><td>Panels, boards, foam</td><td>Least bass absorption</td></tr>
          <tr><td><b>Type B</b></td><td>Glued/cemented to gypsum board</td><td>Tiles, coatings</td><td>Similar to A</td></tr>
          <tr><td><b>Type D-20</b> etc.</td><td>On furring, 20 mm air space</td><td>Wall systems</td><td>Small bass gain</td></tr>
          <tr><td><b>Type E-405</b></td><td>405 mm air space behind</td><td>Suspended ceiling tiles</td><td>Large gain at 125–250 Hz</td></tr>
          <tr><td><b>Type J</b></td><td>Free-hanging units (baffles)</td><td>Ceiling baffles</td><td>Reported per unit, not per m²</td></tr></table></div>
        <div class="callout warn">Comparing a ceiling tile tested at E-405 with a wall panel tested at Type A is comparing apples with oranges. Always check the mounting line on the report.</div>` },
      { h: 'Why α can be greater than 1', html: `
        <p>A lab sample is only a few square metres. Sound diffracts around its edges, so it absorbs energy arriving from <i>beside</i> its own area — the <b>edge effect</b>. Reported values of 1.05–1.3 are normal for thick absorbers.</p>
        <div class="callout mentor">In your calculations cap α at about 0.95–1.0. When you spread panels out with gaps between them on a wall, you actually <b>use</b> the edge effect — spaced panels absorb more per square metre than one continuous block.</div>` },
      { h: 'Reading a test report: checklist', html: `
        <div class="uc-grid">
          ${uc('📄', 'Must be on the report', [['Lab', 'Independent, accredited lab name and accreditation'], ['Standard', 'ASTM C423 / ISO 354, edition'], ['Mounting', 'Type A, E-405… and air space'], ['Sample', 'Size, thickness, density, facing']])}
          ${uc('📈', 'Data to look at', [['Bands', 'Full third-octaves, ideally from 80–100 Hz'], ['Low end', '125 Hz value for bass work'], ['Shape', 'Smooth vs one peak (resonator)'], ['Single numbers', 'NRC/SAA only as a summary']], '#2b9fc7')}
          ${uc('🚩', 'Red flags', [['Missing', 'No mounting or sample size'], ['Selective', 'Only octave bands above 250 Hz'], ['In-house', '“Tested in our facility”'], ['Rounded', 'Every value exactly 1.00']], '#c7772b')}
        </div>
        ${ps([
          ['Product A beats B on paper, sounds worse', 'Different mountings or sample sizes', 'Compare like with like; look at 125 Hz'],
          ['Calculated RT too short', 'Used lab α > 1 directly', 'Cap α at 1.0; add a safety margin'],
          ['Bass traps “rated” at NRC 1.0', 'NRC ignores the bass', 'Ask for 63–125 Hz data or measure in your room'],
        ])}` },
      { h: 'Apply it', html: `
        ${flow([['Pick the target RT', 'per band for the room type'], ['Estimate absorption needed', 'A = 0.161·V / RT'], ['Choose products', 'with full reports & the right mounting'], ['Predict', 'in the Room Analyzer'], ['Measure & adjust', 'T20 per octave after install']])}
        <p>Tools: <a href="#/analyzer">Room Analyzer</a> · <a href="#/absorbers">Absorber Designer</a> · <a href="#/academy/bands">RT60 & octave bands</a> · <a href="#/lab/decay">RT60 Decay Lab</a>.</p>` },
    ],
    quiz: [
      { q: '10 m² of material with α = 0.6 provides…', opts: ['0.6 sabins', '6 m² sabins', '16 m² sabins', '60 sabins'], a: 1, why: 'A = area × α = 10 × 0.6 = 6 m².' },
      { q: 'Why does NRC mislead for bass traps?', opts: ['It is measured in water', 'It only averages 250–2 000 Hz', 'It is always zero', 'It includes isolation'], a: 1, why: 'NRC says nothing about 63–160 Hz.' },
      { q: 'A ceiling tile tested at E-405 vs Type A will show…', opts: ['Identical results', 'More low-frequency absorption at E-405', 'Less absorption at E-405', 'No data below 1 kHz'], a: 1, why: 'The 405 mm air space greatly increases bass absorption.' },
      { q: 'Reported α = 1.15 means…', opts: ['A measurement error to ignore', 'The edge effect of a finite sample — normal in lab tests', 'The product creates energy', 'It is a diffuser'], a: 1, why: 'Diffraction at the sample edges absorbs energy from beyond its area.' },
      { q: 'Which RT protocol best describes how reverberant a room sounds?', opts: ['T30', 'T20', 'EDT', 'NRC'], a: 2, why: 'EDT is dominated by the early part of the decay that the ear judges.' },
    ],
  };

  window.LESSONS.push(M1, M2, M3, M4, M5, M6);
})();
