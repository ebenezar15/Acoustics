/* ==========================================================================
   Studio Design Master Class — part 4 (M20–M28):
   speakers, electrical, low-voltage wiring, HVAC, day-lighting and four
   dimensioned studio PLANS. Own words; practical first, theory as needed.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${k === 'Fix' || k === 'Proper fix' ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const table = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const ps = (rows) => table(['Problem', 'Why it happens', 'Solution'], rows);
  const steps = (items) => `<ol class="plan-notes">${items.map((x) => `<li>${x}</li>`).join('')}</ol>`;
  const tools = (links) => `<div class="row" style="margin-top:10px">${links.map(([h, l]) => `<a class="btn" href="#/${h}">${l} →</a>`).join('')}</div>`;

  /** Section drawing: layers stacked top → bottom; [label, thickness px, fill, opts] */
  const buildup = (title, layers, foot) => {
    let y = 34; const parts = [];
    layers.forEach(([lab, t, fill, o = {}]) => {
      parts.push(`<rect x="20" y="${y}" width="200" height="${t}" fill="${fill}" ${o.dash ? 'stroke="var(--muted)" stroke-dasharray="4 3"' : 'stroke="var(--line)"'} ${o.op ? `opacity="${o.op}"` : ''}/>`);
      if (o.springs) for (let x = 45; x < 215; x += 45) parts.push(`<path d="M${x} ${y + 2} l6 ${t / 4 - 1} l-12 ${t / 4} l12 ${t / 4} l-6 ${t / 4 - 2}" stroke="var(--accent)" stroke-width="2" fill="none"/>`);
      if (o.studs) for (let x = 35; x < 215; x += 55) parts.push(`<rect x="${x}" y="${y}" width="10" height="${t}" fill="var(--warn)" opacity=".55"/>`);
      parts.push(`<line x1="220" y1="${y + t / 2}" x2="236" y2="${y + t / 2}" stroke="var(--muted)"/><text x="240" y="${y + t / 2 + 4}" font-size="10.5">${lab}</text>`);
      y += t;
    });
    return `<svg class="gsvg" viewBox="0 0 640 ${y + 30}" role="img" aria-label="${title}"><text x="320" y="20" text-anchor="middle" font-size="12" font-weight="700">${title}</text>${parts.join('')}${foot ? `<text x="320" y="${y + 20}" text-anchor="middle" font-size="10" fill="var(--muted)">${foot}</text>` : ''}</svg>`;
  };
  const WOOL = 'color-mix(in srgb, var(--c4) 45%, var(--panel))', GYP = 'var(--panel2)', CONC = 'color-mix(in srgb, var(--muted) 45%, var(--panel))', AIR = 'var(--panel)', WOOD = 'color-mix(in srgb, var(--warn) 35%, var(--panel))';

  const L = [];

  /* ======================================================================
     M20 — Speakers
     ====================================================================== */
  const SVG_FLUSH = `<svg class="gsvg" viewBox="0 0 640 224" role="img" aria-label="Free-standing versus flush-mounted loudspeaker">
    <text x="160" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bad)">Free-standing: wall reflection returns late</text>
    <text x="480" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="var(--good)">Flush-mounted: the baffle IS the wall</text>
    <rect x="20" y="30" width="16" height="170" fill="var(--muted)" opacity=".6"/><text x="28" y="214" text-anchor="middle" font-size="10" fill="var(--muted)">wall</text>
    <rect x="100" y="85" width="40" height="60" rx="4" fill="var(--accent)"/>
    <path d="M100 115 C 70 115, 45 105, 38 112" stroke="var(--bad)" stroke-width="2" fill="none" stroke-dasharray="5 3"/><path d="M38 118 C 70 160, 160 160, 290 120" stroke="var(--bad)" stroke-width="2" fill="none" stroke-dasharray="5 3"/>
    <path d="M140 115 H290" stroke="var(--accent)" stroke-width="3"/><circle cx="296" cy="115" r="7" fill="var(--good)"/><text x="296" y="140" text-anchor="middle" font-size="10">ear</text>
    <text x="165" y="182" text-anchor="middle" font-size="10" fill="var(--bad)">bass wraps round, bounces, cancels at c/4d</text>
    <rect x="340" y="30" width="40" height="170" fill="var(--text)" opacity=".75"/><rect x="380" y="30" width="10" height="170" fill="var(--muted)" opacity=".6"/>
    <rect x="352" y="85" width="28" height="60" fill="var(--accent)"/>
    <path d="M380 115 H610" stroke="var(--accent)" stroke-width="3"/><circle cx="616" cy="115" r="7" fill="var(--good)"/>
    ${[30, 55, 80].map((r) => `<path d="M${380 + r} ${115 - r} A${r} ${r} 0 0 1 ${380 + r} ${115 + r}" fill="none" stroke="var(--accent)" opacity=".5"/>`).join('')}
    <text x="495" y="214" text-anchor="middle" font-size="10" fill="var(--good)">no gap behind → no notch, +6 dB bass (half space)</text>
  </svg>`;
  const SVG_SOFFIT = buildup('Hard vs soft flush-mount: cross-section through the baffle', [
    ['Room face: fabric over thin absorber (optional)', 12, WOOL],
    ['Baffle: 2–3 layers of 18 mm MDF/ply, glued & screwed', 40, WOOD],
    ['Soft mount only: neoprene/elastomer pads under the cabinet', 10, 'var(--accent2)', { op: 0.7 }],
    ['Cabinet pocket: dense infill (sand / concrete in hard mounts)', 46, CONC],
    ['Cavity behind: absorbent-filled, sealed from the room', 30, WOOL, { dash: true }],
    ['Structural wall', 20, 'var(--muted)', { op: 0.6 }],
  ], 'Hard: speaker rigidly locked into mass. Soft: speaker floats on pads inside a heavy, damped baffle.');

  L.push({
    id: 'm-speakers', n: 'M20', track: 'master', title: 'Speakers: Flush-Mounting, Mid-Field, Near-Field & Subwoofers', level: 'Advanced', mins: 45,
    summary: 'Where and how to mount monitors so the room helps instead of hurts: flush (hard and soft), mid-field, near-field and subwoofers — with placement rules you can apply today.',
    tags: ['flush mounting', 'soffit', 'SBIR', 'mid-field', 'near-field', 'subwoofer', 'placement', 'baffle step'],
    sections: [
      { h: 'Why mounting matters more than the speaker price', html: `
        <p class="lead">At low frequencies every speaker radiates in all directions. Sound goes backwards, hits the wall behind, and comes back late. At one frequency it arrives exactly out of step and cancels — a deep notch you cannot EQ away.</p>
        ${SVG_FLUSH}
        <div class="formula"><span class="lbl">Front-wall notch</span>f ≈ c / (4 · d) — d = distance from the woofer to the wall. 0.85 m → about 100 Hz.</div>
        <div class="callout physics">Three effects decide how a speaker sounds in a room: <b>boundary interference</b> (the notch above), <b>half-space gain</b> (a wall in front of the speaker’s back doubles bass pressure, +6 dB), and <b>diffraction</b> from the cabinet edges (small ripples and a blurred image). Flush-mounting fixes all three at once.</div>` , viz: 'sbir' },
      { h: 'Flush-mounting: hard and soft', html: `
        <p>Flush (soffit) mounting builds the speaker into a large, flat, heavy front wall so its front face is level with the wall. There is no space behind it for a reflection to travel, and no cabinet edge to diffract around.</p>
        ${SVG_SOFFIT}
        <div class="grid g2">
          <div class="callout mentor" style="margin:0"><b>Hard flush-mounting</b><br>The cabinet is locked into a massive, rigid baffle (multi-layer MDF, often with sand or concrete around the box). Tight, punchy, very low distortion. Risk: the baffle and structure can carry vibration to neighbouring rooms.</div>
          <div class="callout alt" style="margin:0"><b>Soft flush-mounting</b><br>The cabinet sits flush but rests on elastomer pads inside a heavy, damped baffle, with a small sealed gap around it. Same acoustic benefit, much less structure-borne bass. Preferred when isolation to other rooms matters.</div>
        </div>
        <h3>Build steps</h3>
        ${flow([['Plan it first', 'speaker model, axis height, angle, crossover to subs'], ['Frame the front wall', 'symmetrical, from the room’s centre line'], ['Build the pocket', 'cabinet + 10–20 mm all round, sealed'], ['Mass & damping', 'multi-layer board, glue, fill voids'], ['Seal & decouple', 'pads (soft) or rigid infill (hard)'], ['Finish & measure', 'fabric face, then measure and tune']])}
        <div class="callout warn">Common mistakes: a <b>hollow</b> lightweight baffle that buzzes; leaving the back of the cabinet open to a cavity that resonates; an air gap round the front edge that whistles; building it before choosing the speaker; mounting so high that the tweeter fires over the listener’s head without tilting.</div>` },
      { h: 'Mid-field monitors', html: `
        <p>Mid-fields are larger monitors listened to at about <b>2–4 m</b>. They play louder and deeper than near-fields and show the room’s bass behaviour more honestly. They need a room big enough that the listener sits outside the boundary-interference mess.</p>
        <ul><li>Place them on rigid, heavy stands or a plinth at ear height (tilt if higher).</li>
          <li>Keep the woofer either very close (&lt; 0.25 m, ideally soffit) or far (&gt; 1.2 m) from the front wall — avoid the 0.5–1 m zone.</li>
          <li>Equilateral triangle, toe-in so the axes cross just behind the head.</li>
          <li>Use when the room is ≥ about 25 m² and you need loudness, low end and client-friendly sound.</li></ul>` },
      { h: 'Near-field monitors', html: `
        <p>Near-fields sit about <b>1–1.5 m</b> away. Because you are close, the direct sound dominates and the room matters less — the reason they became the standard in small studios.</p>
        ${myth([
          ['“Foam isolation pads fix the sound.”', 'They can stop a desk rattling, but a wobbly base blurs bass. A solid stand on the floor is better.'],
          ['“Sitting on the meter bridge is fine.”', 'The console or desk surface reflects sound into your ears a fraction of a millisecond late — comb filtering. Put stands <b>behind</b> the desk and raise or tilt the speakers.'],
          ['“Near-fields need no room treatment.”', 'Bass below ~300 Hz is still controlled by the room. Corner traps and reflection panels still matter.'],
        ])}
        <div class="callout data">Rules of thumb: tweeters at ear height (≈ 1.1–1.2 m seated), 1–1.5 m apart and away from you, at least 20–30 cm from side walls, symmetrical left and right.</div>` },
      { h: 'Subwoofers: crossover, placement and alignment', html: `
        <p>Subwoofers let small speakers stay clean and let you choose a bass position independently of the stereo image. But they must be <b>aligned in time</b> with the mains, or the crossover region cancels.</p>
        ${flow([['Pick a crossover', '60–100 Hz; 80 Hz is a common start'], ['Find the spot', '“sub crawl”: sub at the seat, listen where you crawl'], ['Set level', 'match mains in the overlap band'], ['Align', 'flip polarity / add delay for maximum sum at crossover'], ['Measure', 'transfer function at the seat'], ['EQ last', 'only cut peaks, never fill nulls']])}
        <ul><li><b>Corner loading</b> gives the most output but excites every mode; front-wall middle is often smoother.</li>
          <li><b>Two or four subs</b> (e.g. front-wall midpoints, or all four wall midpoints) cancel some modes and give a much more even bass across seats.</li>
          <li>Directional arrays (cardioid, end-fire) are useful in large rooms and live venues — try them below.</li></ul>`, viz: 'subArray' },
      { h: 'Use cases', html: `<div class="uc-grid">
        ${uc('🏠', 'Home mix room 3.5 × 4 m', [['Choice', 'Near-fields on stands + one sub'], ['Placement', 'Speakers 0.3 m or > 1.2 m from wall; sub on the front wall'], ['Fix', 'Corner traps, reflection panels, time-align sub']])}
        ${uc('🎛️', 'Commercial control room', [['Choice', 'Soffit-mounted mains + near-fields'], ['Placement', 'Mains flush in the front wall, angled to the mix position'], ['Fix', 'Soft mounting if a live room shares the structure']], '#7a5cc7')}
        ${uc('🎬', 'Post-production / film mix', [['Choice', 'LCR behind or in the screen wall + subs'], ['Placement', 'Identical heights, equal distances (or delay)'], ['Fix', 'Bass management, multiple subs for even seats']], '#2b9fc7')}
        ${uc('🎤', 'Tracking room playback', [['Choice', 'Loud mid-fields on rolling stands'], ['Placement', 'Away from walls, aimed at players'], ['Fix', 'Isolate stands from a floated floor with pads']], '#c7772b')}
      </div>` },
      { h: 'Problems & solutions', html: `${ps([
        ['Bass dip at the seat around 80–150 Hz', 'Front-wall notch (0.5–1 m from wall)', 'Move speakers closer or further, or flush-mount'],
        ['Phasey, hollow mids at the desk', 'Desk/console reflection', 'Stands behind the desk, tilt down/up, absorb in front'],
        ['Boomy one-note bass with a sub', 'Sub exciting a mode / misaligned', 'Sub crawl, add a second sub, align polarity & delay'],
        ['Cabinet buzz after flush-mounting', 'Light, hollow baffle or loose fixings', 'Add mass, glue layers, fill voids, tighten pads'],
        ['Neighbours hear the bass more after soffits', 'Hard mounting into the structure', 'Soft mounting on pads, decouple baffle from structure'],
      ])}
        <h3>Apply it</h3>${steps(['Measure your seat-to-wall and speaker-to-wall distances; check the notch frequency with the widget above.', 'Decide: free-standing (cheap, flexible) or flush (best, permanent).', 'Set the triangle, heights and toe-in; mark the floor.', 'Add subs last; align and measure.', 'Treat corners and reflection points, then measure again.'])}
        ${tools([['measure', 'Measure your room'], ['pa', 'System designer'], ['treatment', 'Treatment simulator']])}` },
    ],
    quiz: [
      { q: 'A woofer is 0.85 m from the front wall. Where is the cancellation notch?', opts: ['≈ 25 Hz', '≈ 100 Hz', '≈ 400 Hz', '≈ 1 kHz'], a: 1, why: 'f ≈ c/(4d) = 343/(4×0.85) ≈ 100 Hz.' },
      { q: 'What is the main benefit of soft (decoupled) flush-mounting over hard?', opts: ['More treble', 'Less structure-borne vibration to other rooms', 'Cheaper', 'No need for a baffle'], a: 1, why: 'The speaker floats on pads, so less energy enters the building structure.' },
      { q: 'Best place for near-field stands?', opts: ['On the meter bridge', 'Behind the desk on floor stands', 'On foam pads on the desk', 'In the corners'], a: 1, why: 'Stands behind the desk avoid desk reflections and wobbly bases.' },
      { q: 'You add a subwoofer and the crossover region gets weaker. First thing to try?', opts: ['Boost EQ at 80 Hz', 'Check polarity and delay alignment', 'Move the mains', 'Buy a bigger sub'], a: 1, why: 'A sub out of time with the mains cancels at the crossover.' },
      { q: 'Why do multiple subwoofers help?', opts: ['More loudness only', 'They excite modes differently, evening out bass across seats', 'They remove the need for traps', 'They raise the crossover'], a: 1, why: 'Well-placed multiple subs cancel some modes and smooth seat-to-seat bass.' },
    ],
  });

  /* ======================================================================
     M21 — Electrical
     ====================================================================== */
  const SVG_POWER = `<svg class="gsvg" viewBox="0 0 640 230" role="img" aria-label="Studio power distribution">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Studio power plan: one technical source, star distribution</text>
    <rect x="20" y="80" width="100" height="70" rx="8" fill="var(--panel2)" stroke="var(--text)"/><text x="70" y="110" text-anchor="middle" font-size="11" font-weight="700">Main panel</text><text x="70" y="126" text-anchor="middle" font-size="10" fill="var(--muted)">service entry</text>
    <rect x="180" y="40" width="120" height="60" rx="8" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/><text x="240" y="66" text-anchor="middle" font-size="11" font-weight="700">Technical sub-panel</text><text x="240" y="82" text-anchor="middle" font-size="10" fill="var(--muted)">audio only</text>
    <rect x="180" y="140" width="120" height="60" rx="8" fill="var(--panel2)" stroke="var(--warn)" stroke-width="2"/><text x="240" y="166" text-anchor="middle" font-size="11" font-weight="700">General sub-panel</text><text x="240" y="182" text-anchor="middle" font-size="10" fill="var(--muted)">lights · HVAC · kitchen</text>
    <path d="M120 105 H150 V70 H180 M150 105 V170 H180" stroke="var(--text)" stroke-width="2" fill="none"/>
    ${[['Control room', 40], ['Racks', 80], ['Live room', 120]].map(([t, y]) => `<path d="M300 70 C 340 70, 340 ${y}, 380 ${y}" stroke="var(--accent)" stroke-width="2" fill="none"/><rect x="380" y="${y - 12}" width="110" height="24" rx="5" fill="var(--panel)" stroke="var(--accent)"/><text x="435" y="${y + 4}" text-anchor="middle" font-size="10">${t}</text>`).join('')}
    ${[['Dimmers / LED drivers', 160], ['HVAC plant', 200]].map(([t, y]) => `<path d="M300 170 C 340 170, 340 ${y}, 380 ${y}" stroke="var(--warn)" stroke-width="2" fill="none"/><rect x="380" y="${y - 12}" width="130" height="24" rx="5" fill="var(--panel)" stroke="var(--warn)"/><text x="445" y="${y + 4}" text-anchor="middle" font-size="10">${t}</text>`).join('')}
    <text x="580" y="80" text-anchor="middle" font-size="10" fill="var(--accent)">route audio</text><text x="580" y="94" text-anchor="middle" font-size="10" fill="var(--accent)">beside these</text>
    <text x="580" y="180" text-anchor="middle" font-size="10" fill="var(--warn)">keep audio</text><text x="580" y="194" text-anchor="middle" font-size="10" fill="var(--warn)">away from these</text>
  </svg>`;
  L.push({
    id: 'm-electrical', n: 'M21', track: 'master', title: 'Electrical Wiring & Grounding for Studios', level: 'Core', mins: 35,
    summary: 'Plan studio power that is safe first and quiet second: technical power, circuit planning, zero-loop area routing and keeping dimmer and transformer noise out of your audio.',
    tags: ['safety', 'technical power', 'RCD', 'GFCI', 'zero loop area', 'dimmers', 'ground loop', 'load calculation'],
    sections: [
      { h: 'Safety first — always', html: `
        <div class="callout safety">All premises wiring — panels, circuits, outlets, earthing — is designed and installed by a <b>licensed electrician</b> to your local code. Never remove an earth pin, never use “ground-lift” plug adapters, never install an isolated ground rod. Your job is to plan the studio’s needs and brief the electrician clearly.</div>
        ${flow([['List the gear', 'watts of every device, lights, HVAC'], ['Group the loads', 'audio, lighting, HVAC, general'], ['Size circuits', 'with headroom (≤ 80 % continuous load)'], ['Protect people', 'RCD / GFCI where code requires'], ['Plan routes', 'audio beside its own power'], ['Brief the electrician', 'drawing + load list + quiet requirements']])}
        <div class="callout data"><b>Simple load estimate:</b> add up nameplate watts, divide by the mains voltage for amps, then keep each circuit at no more than about 80 % of its rating. A 16 A circuit at 230 V carries ≈ 2.9 kW continuously; a 20 A circuit at 120 V ≈ 1.9 kW. Power amps at full output can draw far more than their idle rating — use the manufacturer’s “1/8 power” figure for music.</div>` },
      { h: 'Technical power: separate the quiet from the noisy', html: `
        ${SVG_POWER}
        <p>“Technical power” simply means the audio and video gear is fed from its own sub-panel and circuits, kept separate from lighting dimmers, motors, HVAC and kitchen loads. Noisy loads then share as little wiring as possible with the audio system.</p>
        <ul><li>Feed all audio gear in one room (or one system) from the <b>same</b> technical panel, ideally the same phase.</li>
          <li>Run each circuit’s line, neutral and earth <b>together</b> (in the same cable or conduit) — your electrician can also twist them, which strongly reduces induced ground noise.</li>
          <li>Ask for no neutral–earth connections downstream of the main bonding point, and test every outlet.</li>
          <li>Some codes allow special arrangements (e.g. isolated-ground outlets, symmetrical/balanced power). These are electrician decisions under the code — never DIY.</li></ul>`, viz: 'conduitField' },
      { h: 'Zero loop area wiring', html: `
        <p>Every time two pieces of gear are joined by an audio cable <i>and</i> by their power earths, a loop is formed. Stray mains magnetic fields induce hum in it — more for bigger loops. Keep audio cables running <b>right beside</b> the power that feeds the same equipment and the loop shrinks to almost nothing.</p>
        <div class="callout mentor">Practical version: feed the console and outboard from the front, together with their audio trunk; run stage boxes with their power; never let a long audio run take a completely different route from the power of the gear at its ends.</div>`, viz: 'groundLoop' },
      { h: 'Eliminating noise injection and pickup', html: `
        ${table(['Noise source', 'How it gets in', 'Design fix'], [
          ['Phase-cut dimmers', 'Fast current switching induces buzz in nearby cables', 'Separate lighting circuits & routes; filtered or sine-wave dimmers; LED drivers chosen for low noise'],
          ['LED drivers & switch-mode PSUs', 'High-frequency noise on wiring and earth', 'Quality drivers; keep them off technical circuits; ferrites on DC leads'],
          ['Transformers, wall-warts', '50/60 Hz magnetic fields', '≥ 1 m from inputs; rack PSUs in the machine room'],
          ['HVAC motors & compressors', 'Start-up spikes, magnetic fields', 'General panel, separate routes, soft starters'],
          ['Long unbalanced runs', 'No common-mode rejection', 'Balanced everywhere; DI or transformer at the ends'],
          ['Equipment with pin-1 problems', 'Shield current through the circuit board', 'AES48-compliant gear; test suspect units'],
        ])}
        <div class="callout data">Cross audio and power cables at 90°. Where they must run in parallel, keep them in separate trays or conduits a few hundred millimetres apart — unless they feed the same gear, in which case run them tight together (zero loop area).</div>` },
      { h: 'Use cases', html: `<div class="uc-grid">
        ${uc('🏠', 'Home studio', [['Do', 'One dedicated circuit (or two) for all audio, one quality strip per rack'], ['Avoid', 'Dimmer on the same circuit, chargers on random sockets'], ['Fix', 'Ask the electrician for a new radial from the panel']])}
        ${uc('🏢', 'Commercial studio', [['Do', 'Technical sub-panel, star distribution, labelled circuits'], ['Avoid', 'Lighting and HVAC on technical panel'], ['Fix', 'Twisted conductors, documented earthing per code']], '#7a5cc7')}
        ${uc('⛪', 'Church / venue', [['Do', 'Audio power at stage and FOH from the same panel'], ['Avoid', 'FOH on a wall socket at the back of the hall'], ['Fix', 'Run FOH power with the snake; digital snake']], '#c7772b')}
      </div>` },
      { h: 'Find hum fast', html: `<p>When something does hum, work through the questions — the deeper story is in the <a href="#/academy/a-ground">Hum, Buzz & Grounding</a> course.</p>`, viz: 'humDetective' },
      { h: 'Problems & solutions', html: `${ps([
        ['Breaker trips when amps power up', 'Inrush current of large transformers', 'Power sequencer; correct breaker type; spread amps over circuits'],
        ['Buzz when the lights dim', 'Dimmer noise coupled into audio wiring', 'Separate circuits & routes; better dimmers'],
        ['Hum only between two rooms', 'Large ground loop between different panels/phases', 'Same technical panel; route audio with power; transformer ties'],
        ['Outlet tester shows reversed or missing earth', 'Wiring fault', 'Stop using it; electrician repairs — never adapt'],
      ])}
        <h3>Apply it</h3>${steps(['Make a load list with every device’s watts.', 'Mark on the plan where each rack, desk and amp sits.', 'Draw audio routes and place power feeds beside them.', 'Hand drawing + list to a licensed electrician; ask for technical power and RCD/GFCI as required.', 'Test every outlet before installing gear.'])}
        ${tools([['academy/a-ground', 'Hum, Buzz & Grounding course'], ['lab/hum', 'Hum Lab']])}` },
    ],
    quiz: [
      { q: 'Who should install or modify studio circuits and panels?', opts: ['The audio engineer', 'A licensed electrician', 'Anyone careful', 'The equipment supplier'], a: 1, why: 'Premises wiring must be done by a licensed electrician to local code.' },
      { q: 'What is “technical power”?', opts: ['A special type of electricity', 'Separate circuits/panel feeding only audio-video gear', 'Using DC power', 'An isolated ground rod'], a: 1, why: 'It keeps noisy loads off the audio system’s wiring.' },
      { q: 'How should an audio cable run relative to the power feeding the same gear?', opts: ['As far away as possible', 'Right beside it', 'At 45°', 'It doesn’t matter'], a: 1, why: 'Running together minimises loop area and hum pickup.' },
      { q: 'A circuit should continuously carry at most about…', opts: ['50 % of its rating', '80 % of its rating', '100 %', '120 %'], a: 1, why: 'Headroom keeps breakers from tripping and wiring cool.' },
    ],
  });

  /* ======================================================================
     M22 — Low-voltage wiring
     ====================================================================== */
  const SVG_PATCH = `<svg class="gsvg" viewBox="0 0 640 200" role="img" aria-label="Systematic cable labelling">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Every cable: same label at both ends, listed in the schedule</text>
    <rect x="20" y="50" width="120" height="100" rx="8" fill="var(--panel2)" stroke="var(--text)"/><text x="80" y="76" text-anchor="middle" font-size="11" font-weight="700">Live room</text><text x="80" y="92" text-anchor="middle" font-size="10" fill="var(--muted)">wall box LR-A</text>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${50 + i * 20}" cy="120" r="6" fill="var(--accent)"/>`).join('')}
    <path d="M140 100 C 260 60, 360 140, 480 100" stroke="var(--accent)" stroke-width="5" fill="none"/>
    <rect x="200" y="74" width="120" height="22" rx="4" fill="var(--warn)" opacity=".85"/><text x="260" y="89" text-anchor="middle" font-size="10" font-weight="700">TL-LR-A-01…16</text>
    <rect x="480" y="50" width="140" height="100" rx="8" fill="var(--panel2)" stroke="var(--text)"/><text x="550" y="76" text-anchor="middle" font-size="11" font-weight="700">Patchbay</text>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${492 + i * 15}" y="96" width="10" height="10" fill="var(--c3)"/><rect x="${492 + i * 15}" y="114" width="10" height="10" fill="var(--c3)" opacity=".6"/>`).join('')}
    <text x="550" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">tie-lines → normals</text>
    <text x="320" y="185" text-anchor="middle" font-size="10" fill="var(--muted)">Schedule: label · from · to · type · length · colour · tested ✓</text>
  </svg>`;
  L.push({
    id: 'm-lowvolt', n: 'M22', track: 'master', title: 'Audio & Low-Voltage Wiring', level: 'Core', mins: 35,
    summary: 'Balanced lines that really reject noise, speaker cables that do not waste power, and a systematic way to wire a studio so it works first time and stays maintainable.',
    tags: ['impedance balancing', 'CMRR', 'balanced', 'speaker cable', 'damping factor', '70 V / 100 V', 'patchbay', 'labelling', 'cable schedule'],
    sections: [
      { h: 'What “balanced” really means', html: `
        <p class="lead">A balanced line is not about the signal being equal and opposite on the two wires. It is about the two wires having <b>equal impedances to ground</b> all the way from output to input. Then any noise lands equally on both and the input — which listens only to the difference — throws it away.</p>
        <div class="formula"><span class="lbl">Rejection (rule of thumb)</span>CMRR ≈ 20·log₁₀( input common-mode impedance ÷ source impedance imbalance )</div>
        <div class="callout example">A 10 Ω mismatch between hot and cold (one slightly worn connector, one output resistor tolerance) into a basic 10 kΩ input gives only ≈ 60 dB rejection. The same mismatch into a high-common-mode-impedance input or a good input transformer gives 100 dB or more.</div>
        <p>So: choose inputs with high common-mode impedance (transformers, or ICs designed for it) on long or noisy runs, and keep cables and connectors in good condition.</p>`, viz: 'impBalance' },
      { h: 'Speaker wiring', html: `
        <p>Speaker cables carry real current. Their resistance wastes power and lowers the amplifier’s grip on the woofer (damping factor). Long runs need thicker wire — or a 70 V / 100 V distributed line.</p>
        ${table(['Run length (one way)', '8 Ω load', '4 Ω load'], [
          ['up to 5 m', '1.5 mm² (≈ 16 AWG)', '2.5 mm² (≈ 14 AWG)'],
          ['5–15 m', '2.5 mm² (≈ 14 AWG)', '4 mm² (≈ 12 AWG)'],
          ['15–30 m', '4 mm² (≈ 12 AWG)', '6 mm² (≈ 10 AWG) or amp closer'],
          ['> 30 m, many speakers', '70 V / 100 V line system', '—'],
        ])}
        <ul><li><b>Polarity</b>: mark + and − consistently; one reversed speaker loses bass and image.</li>
          <li><b>Connectors</b>: locking speaker connectors in live/install work; never XLR or jack for amp outputs in permanent installs.</li>
          <li><b>Keep amps close</b> to passive speakers where possible — shorter is always better than thicker.</li></ul>`, viz: 'ampLoad' },
      { h: 'The systematic approach', html: `
        ${SVG_PATCH}
        ${flow([['Signal-flow drawing', 'every source and destination'], ['Cable schedule', 'label, type, from, to, length'], ['Wall boxes & tie-lines', 'standard panels in every room'], ['Containment', 'trays/conduit, sized with spare'], ['Separation', 'from power & lighting'], ['Terminate & label', 'both ends, same label'], ['Test & document', 'before walls are closed']])}
        <div class="callout data">Rules of thumb: fill conduit to no more than about 40 %; leave 25–50 % spare tie-lines; one colour per signal type (e.g. mic/line, digital, network, speaker); labels readable without moving the cable; keep 300 mm from parallel power runs that feed other equipment.</div>
        <div class="callout warn">Common mistakes: no spare capacity; unlabelled “mystery” cables; mixing speaker-level and mic-level in the same bundle; closing walls before testing; cheap connectors on permanent tie-lines.</div>` },
      { h: 'Cable types & connectors at a glance', html: `
        ${table(['Signal', 'Cable', 'Connector', 'Keep away from'], [
          ['Mic / line (analogue)', 'Twisted pair, braid or foil shield', 'XLR, TRS', 'Speaker cables, dimmer & lighting feeds'],
          ['Digital audio (AES3)', '110 Ω twisted pair', 'XLR', 'Long parallel runs with analogue mics'],
          ['Audio networking (Dante/AES67)', 'Cat6 / fibre', 'RJ45, etherCON, fibre', 'Sharp bends, overlong unshielded runs near power'],
          ['Headphone feeds', 'Heavier pair (cue amps)', 'TRS, XLR-4', 'Mic lines in the same bundle'],
          ['Speaker (low impedance)', '2-core, sized for length', 'Locking speaker connector', 'All low-level audio'],
          ['70 V / 100 V lines', '2-core, fire-rated where required', 'Terminal blocks', 'Treat as mains-level for separation'],
        ])}
        <div class="callout mentor">Pick one colour per signal type and stick to it in every room. When something breaks at 2 a.m., colours and labels save the session.</div>` },
      { h: 'Use cases', html: `<div class="uc-grid">
        ${uc('🏠', 'Home studio', [['Do', 'Short balanced leads, labelled; one patchbay'], ['Avoid', 'Rats’ nest behind the desk'], ['Fix', 'Velcro ties, cable tray under the desk']])}
        ${uc('🎙️', 'Studio with live room & booths', [['Do', 'Wall boxes with mic, line, headphone and network tie-lines'], ['Avoid', 'Cables through doors'], ['Fix', 'Sealed conduits through isolation walls, with acoustic sealant']], '#7a5cc7')}
        ${uc('🏛️', 'Install with distributed speakers', [['Do', '70 V/100 V lines with tap settings'], ['Avoid', 'Low-impedance speakers on 50 m runs'], ['Fix', 'Calculate line load ≤ 80 % of amp']], '#2b9fc7')}
      </div>` },
      { h: 'Problems & solutions', html: `${ps([
        ['Hum only on one long line', 'Impedance imbalance or poor input CMRR', 'Transformer or high-CMRR input; check connectors'],
        ['Loose, quiet bass from passive speakers', 'Thin, long speaker cable', 'Thicker cable or move amp closer'],
        ['One speaker sounds “thin” with the pair', 'Reversed polarity', 'Check + / − at both ends'],
        ['Nobody knows what a cable does', 'No schedule or labels', 'Label both ends, keep the schedule with the as-built drawings'],
        ['Sound leaks through cable holes', 'Unsealed penetrations in isolation walls', 'Sleeves packed and sealed on both leaves'],
      ])}
        <h3>Apply it</h3>${steps(['Draw the signal flow of the whole studio.', 'Write the cable schedule and choose wall-box positions.', 'Size conduits and trays with spare capacity.', 'Install, terminate and label both ends.', 'Test every line (continuity, polarity, noise) before closing walls.'])}
        ${tools([['systems', 'Signal Flow & Networks'], ['calc', 'Calculators']])}` },
    ],
    quiz: [
      { q: 'What makes a balanced line reject noise?', opts: ['Equal and opposite signals', 'Equal impedances to ground on both wires', 'Thick shielding', 'Gold connectors'], a: 1, why: 'Impedance balance makes noise identical on both wires so the input cancels it.' },
      { q: 'Which input tolerates source imbalance best?', opts: ['10 kΩ differential amp', 'High common-mode impedance input or good transformer', 'Unbalanced input', 'Any input'], a: 1, why: 'Higher common-mode impedance gives higher CMRR for the same imbalance.' },
      { q: 'Long run to many ceiling speakers. Best approach?', opts: ['Very thin cable', '70 V / 100 V line system', 'XLR cables', 'Two amps in series'], a: 1, why: 'High-voltage distributed lines carry power with little loss.' },
      { q: 'When should wiring be tested?', opts: ['After painting', 'Before the walls are closed', 'Only when it fails', 'Never'], a: 1, why: 'Fixing hidden faults after closing walls is costly.' },
    ],
  });

  /* ======================================================================
     M23 — HVAC
     ====================================================================== */
  const SVG_HVAC = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Quiet ducting into a room-in-room studio">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Quiet air path: plant → silencer → baffle box → slow grille</text>
    <rect x="20" y="90" width="80" height="60" rx="8" fill="var(--text)"/><text x="60" y="124" text-anchor="middle" font-size="11" fill="var(--panel)">AHU / fan</text>
    <rect x="100" y="112" width="20" height="16" fill="var(--accent2)"/><text x="110" y="104" text-anchor="middle" font-size="9">flex</text>
    <path d="M120 120 H200" stroke="var(--c3)" stroke-width="16"/>
    <rect x="200" y="104" width="80" height="32" fill="var(--c4)" opacity=".8" stroke="var(--text)"/><text x="240" y="98" text-anchor="middle" font-size="10">silencer</text>
    <path d="M280 120 H330" stroke="var(--c3)" stroke-width="16"/>
    <rect x="330" y="70" width="90" height="100" rx="6" fill="var(--c4)" opacity=".45" stroke="var(--text)"/><path d="M345 120 H380 V90 M395 150 V105" stroke="var(--text)" stroke-width="3"/><text x="375" y="186" text-anchor="middle" font-size="10">baffle box</text>
    <rect x="440" y="40" width="10" height="150" fill="var(--muted)" opacity=".6"/><rect x="470" y="40" width="10" height="150" fill="var(--accent)" opacity=".6"/>
    <text x="460" y="210" text-anchor="middle" font-size="9" fill="var(--muted)">outer · inner leaf</text>
    <path d="M420 120 H520" stroke="var(--c3)" stroke-width="22"/><rect x="520" y="104" width="12" height="32" fill="var(--text)"/>
    ${[0, 1, 2].map((i) => `<path d="M540 ${110 + i * 10} q 20 -4 40 0" stroke="var(--c3)" fill="none" stroke-width="2"/>`).join('')}
    <text x="580" y="160" text-anchor="middle" font-size="10" fill="var(--good)">≤ 1.5–2 m/s</text>
    <text x="465" y="34" text-anchor="middle" font-size="9" fill="var(--muted)">sealed sleeve, both leaves</text>
  </svg>`;
  L.push({
    id: 'm-hvac', n: 'M23', track: 'master', title: 'Heating, Ventilation & Air Conditioning', level: 'Core', mins: 35,
    summary: 'Sealed studios need fresh air and cooling — delivered silently, without creating holes in the isolation. Sizing in plain words, quiet duct design and system choices.',
    tags: ['HVAC', 'fresh air', 'duct velocity', 'silencer', 'baffle box', 'NC', 'mini-split', 'ERV', 'HRV', 'isolation'],
    sections: [
      { h: 'Why studios need serious ventilation', html: `
        <p class="lead">A well-isolated studio is airtight. With three people and a rack of gear inside, CO₂ rises, the room gets hot, and concentration drops within an hour. Ventilation and cooling are not optional — they are part of the acoustic design.</p>
        ${flow([['Fresh air', '≈ 30–36 m³/h per person'], ['Heat out', 'people ≈ 100 W each + every watt of gear & lights'], ['Quiet', 'NC 15–20 recording, 20–25 control'], ['No leaks', 'every duct is a hole in the isolation']])}
        <div class="callout data"><b>Plain-words sizing:</b> air needed to remove heat ≈ watts ÷ 2 (m³/h per watt is ~0.5 for a 6 °C supply-to-room difference). 1.2 kW of gear and three people → about 750 m³/h. Fresh-air needs are usually smaller than cooling airflow in studios full of gear.</div>`, viz: 'ductNoise' },
      { h: 'Quiet design: slow air, long paths, soft surfaces', html: `
        ${SVG_HVAC}
        <ul><li><b>Low velocity</b>: big ducts and many grilles. Noise rises steeply with speed.</li>
          <li><b>Lined ducts</b> absorb fan noise along the run; <b>baffle boxes</b> force sound around absorbent corners; <b>silencers</b> do the heavy lifting near the plant.</li>
          <li><b>Each room gets its own branch</b> with its own silencer — otherwise the duct carries sound from one studio to the next (crosstalk).</li>
          <li><b>Return air</b> needs the same care as supply. Never rely on door undercuts.</li></ul>` },
      { h: 'Isolating the equipment', html: `
        ${table(['Item', 'Treatment'], [
          ['Fans, air handlers, compressors', 'On spring or rubber isolators, ideally in a plant room away from studios'],
          ['Duct connection to the fan', 'Flexible connector to stop vibration travelling along the duct'],
          ['Duct through isolation walls', 'Separate sleeve in each leaf, sealed with acoustic sealant; a short flexible section in the gap so the leaves are not bridged'],
          ['Duct hangers', 'Resilient hangers where ducts hang from a structure shared with a studio'],
          ['Condensate pumps', 'Out of the studio; gravity drains where possible — pumps click and hum'],
        ])}
        <div class="callout warn">Common mistakes: one duct serving two studios with no silencer between; a rigid duct bolted to both leaves of a room-in-room wall; grilles sized for offices (too small, whistle); outdoor units on the studio’s roof or wall.</div>` },
      { h: 'Choosing a system', html: `
        ${table(['System', 'Good for', 'Watch out for'], [
          ['Ductless mini-split', 'Bedroom/home studios; cheap, efficient', 'Indoor fan noise — run on low; no fresh air on its own'],
          ['Ducted split / AHU', 'Multi-room studios; quiet when designed well', 'Needs space for ducts, silencers, plant room'],
          ['ERV / HRV (energy-recovery ventilator)', 'Fresh air without losing heat/cool', 'Add silencers; size for occupants'],
          ['Portable AC', 'Emergency only', 'Loud, leaky hose through the isolation'],
        ])}
        <div class="callout mentor">For a small studio a common, effective combination is a mini-split on its lowest fan setting for cooling, plus a small ERV with silenced ducts for fresh air. Turn the mini-split off for the quietest takes.</div>` },
      { h: 'Use cases', html: `<div class="uc-grid">
        ${uc('🛏️', 'Bedroom studio', [['System', 'Mini-split, low fan'], ['Fresh air', 'Silenced transfer duct or door left open between takes'], ['Fix', 'Mount outdoor unit away from neighbours']])}
        ${uc('🏚️', 'Basement studio', [['System', 'Ducted air handler in the machine room + dehumidifier'], ['Fresh air', 'ERV'], ['Fix', 'Silencer per room, lined flex']], '#7a5cc7')}
        ${uc('🏢', 'Commercial facility', [['System', 'Central low-velocity AHU, VAV boxes outside rooms'], ['Fresh air', 'Per occupancy, with CO₂ control'], ['Fix', 'Plant room on isolated slab']], '#2b9fc7')}
      </div>` },
      { h: 'Problems & solutions', html: `${ps([
        ['Whoosh from the grille', 'Air too fast at the grille', 'More/larger grilles, slower air'],
        ['Hear the next studio through the vent', 'Shared duct with no attenuation', 'Separate branches + silencers / baffle boxes'],
        ['Low hum from the ceiling', 'Fan vibration through rigid duct', 'Flexible connectors, isolators, resilient hangers'],
        ['Room stuffy after 30 minutes', 'No fresh air in an airtight room', 'ERV/HRV or ducted fresh-air supply'],
        ['Isolation dropped after HVAC install', 'Ducts bridging the room-in-room or unsealed sleeves', 'Separate sleeves per leaf, flexible link, sealant'],
      ])}
        <h3>Apply it</h3>${steps(['List people and equipment watts per room.', 'Pick NC targets per room.', 'Choose the system and plant location (away from studios).', 'Size ducts and grilles for low velocity; add silencers per room.', 'Detail every wall penetration; commission and measure NC.'])}
        ${tools([['calc', 'Calculators'], ['isolation', 'Soundproofing']])}` },
    ],
    quiz: [
      { q: 'Why does an isolated studio need mechanical ventilation?', opts: ['It looks professional', 'It is airtight — CO₂ and heat build up', 'For the speakers', 'Building codes only'], a: 1, why: 'Good isolation means no natural air leakage.' },
      { q: 'Biggest single factor for quiet air delivery?', opts: ['Duct colour', 'Low air velocity', 'Round grilles', 'Fan brand'], a: 1, why: 'Air noise rises steeply with velocity.' },
      { q: 'A duct passes through a room-in-room wall. Correct detail?', opts: ['One rigid duct fixed to both leaves', 'Separate sealed sleeves per leaf with a flexible link', 'Leave a gap around it', 'Use the door undercut instead'], a: 1, why: 'This keeps the leaves decoupled and airtight.' },
      { q: 'Typical background-noise target for a recording room?', opts: ['NC 45', 'NC 35', 'NC 15–20', 'NC 60'], a: 2, why: 'Recording rooms need very low noise.' },
    ],
  });

  /* ======================================================================
     M24 — Daylight
     ====================================================================== */
  const SVG_DAY = `<svg class="gsvg" viewBox="0 0 640 230" role="img" aria-label="Daylight options for a studio">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Daylight without losing isolation: three options</text>
    <rect x="20" y="60" width="600" height="140" fill="none" stroke="var(--text)" stroke-width="3"/>
    <rect x="80" y="44" width="70" height="20" fill="var(--c3)" opacity=".5" stroke="var(--c3)"/><rect x="90" y="64" width="50" height="40" fill="var(--c4)" opacity=".35"/><text x="158" y="58" font-size="10">skylight + lined well</text>
    <path d="M115 30 L115 44 M100 32 L108 44 M130 32 L122 44" stroke="var(--warn)" stroke-width="2"/>
    <path d="M100 104 L80 160 M130 104 L150 160" stroke="var(--warn)" opacity=".5" stroke-width="2"/>
    <rect x="280" y="40" width="22" height="30" fill="var(--c3)" opacity=".6"/><path d="M291 70 V120" stroke="var(--c3)" stroke-width="10" opacity=".5"/><text x="291" y="34" text-anchor="middle" font-size="10">light tube</text>
    <rect x="612" y="100" width="16" height="60" fill="var(--c3)" opacity=".6"/><line x1="616" y1="100" x2="616" y2="160" stroke="var(--c3)" stroke-width="2"/><line x1="624" y1="100" x2="624" y2="160" stroke="var(--c3)" stroke-width="2"/>
    <text x="560" y="94" text-anchor="end" font-size="10">studio double window</text><text x="560" y="108" text-anchor="end" font-size="10">on a side wall</text>
    <rect x="40" y="120" width="30" height="40" fill="var(--accent)"/><rect x="40" y="170" width="30" height="20" fill="var(--accent)" opacity=".5"/><text x="55" y="215" text-anchor="middle" font-size="10">speakers</text>
    <text x="26" y="112" font-size="10" fill="var(--bad)">✗ no glass here</text>
    <circle cx="330" cy="160" r="8" fill="var(--good)"/><text x="330" y="186" text-anchor="middle" font-size="10">mix position</text>
  </svg>`;
  L.push({
    id: 'm-daylight', n: 'M24', track: 'master', title: 'Day-Lighting the Studio', level: 'Foundation', mins: 25,
    summary: 'People work better with daylight. Where windows can go acoustically, how to build them so they do not leak sound, and alternatives like skylights, light tubes and borrowed light.',
    tags: ['daylight', 'studio window', 'skylight', 'light tube', 'glare', 'heat gain', 'composite TL'],
    sections: [
      { h: 'Why daylight is worth the effort', html: `
        <p class="lead">Long sessions in a windowless box are tiring. Daylight helps mood, alertness and sleep rhythm — and clients love it. The challenge is that glass is the weakest part of most walls, and a window in the wrong place ruins the room’s symmetry.</p>
        ${SVG_DAY}
        <div class="callout data">Rules of thumb: glass on <b>side walls</b> or the rear, not behind or between the monitors; keep the room symmetrical (match a window with a similar surface opposite, or treat both sides equally); angle large panes a few degrees so they don’t reflect straight back at the mix position.</div>` },
      { h: 'Studio-grade windows', html: `
        ${buildup('Studio double window: section through the wall', [
          ['Outer pane: 10–12.8 mm laminated glass', 12, 'var(--c3)'],
          ['Air gap 100–200 mm, absorbent-lined reveals', 60, WOOL, { dash: true }],
          ['Inner pane: different thickness (e.g. 8.8 mm laminated), tilted 3–5°', 10, 'var(--c3)', { op: 0.7 }],
        ], 'Each pane sits in its own leaf of the wall — the frames never touch.')}
        <ul><li>Two panes of <b>different thickness</b> so their weak frequencies don’t coincide.</li>
          <li>A <b>large gap</b> (100 mm+) and absorbent reveals; thermal double glazing (12–16 mm gaps) is poor for low frequencies.</li>
          <li><b>Laminated</b> glass damps the coincidence dip.</li>
          <li>Seals all round; each frame on its own leaf; desiccant or a breather to stop condensation.</li></ul>`, viz: 'compositeTL' },
      { h: 'Skylights, light tubes and borrowed light', html: `
        ${table(['Option', 'Acoustic notes', 'Best use'], [
          ['Skylight with lined well', 'Add a second pane at ceiling level; line the well with absorber; seal both', 'Detached buildings, top floors'],
          ['Light tube / pipe', 'Small opening, easy to double-seal; diffuser at the ceiling', 'Booths and rooms without outside walls'],
          ['Borrowed light through internal studio windows', 'Daylight passes from a lobby or lounge through studio glass', 'Facilities with daylit circulation'],
          ['Daylight-spectrum LED', 'No acoustic cost; choose silent drivers', 'Everywhere, as a supplement'],
        ])}` },
      { h: 'Glare, reflections and heat', html: `
        <ul><li><b>Screens</b>: avoid windows directly behind or in front of displays — glare. North light (south in the southern hemisphere) is softer.</li>
          <li><b>Blinds or shades</b> between the panes or inside the room; heavy curtains add a little high-frequency absorption.</li>
          <li><b>Heat gain</b>: sunlight on glass adds hundreds of watts. Tell your HVAC designer; use solar-control glass or external shading.</li>
          <li><b>Privacy & security</b> for ground-floor studios full of gear.</li></ul>
        <div class="callout warn">Common mistakes: one big window on one side wall only (asymmetric image); thermal double glazing assumed to be “soundproof”; skylight with a single pane over a mix room; a window right behind the monitors.</div>` },
      { h: 'Use cases', html: `<div class="uc-grid">
        ${uc('🛏️', 'Bedroom studio', [['Situation', 'Existing window on a side wall'], ['Fix', 'Heavy blind + removable window plug for loud sessions'], ['Result', 'Daylight by day, +10–20 dB when plugged']])}
        ${uc('🏡', 'Garden studio', [['Situation', 'New build, free choice'], ['Fix', 'Studio double window on a side wall, skylight over lounge area'], ['Result', 'Bright, symmetric, 50+ dB']], '#4c9a3a')}
        ${uc('🏢', 'Facility', [['Situation', 'Studios in the building core'], ['Fix', 'Borrowed light via glass from a daylit corridor + light tubes'], ['Result', 'Daylight with full isolation']], '#2b9fc7')}
      </div>` },
      { h: 'Problems & solutions', html: `${ps([
        ['Traffic heard through the window', 'Thin or thermal glazing', 'Secondary studio pane with a large gap'],
        ['Image pulls to one side', 'Glass on one side, absorber on the other', 'Match surfaces; treat or angle the glass'],
        ['Room overheats in the afternoon', 'Solar gain', 'Shading, solar-control glass, extra cooling'],
        ['Condensation between panes', 'Moist air trapped', 'Desiccant, breather, better seals'],
      ])}
        <h3>Apply it</h3>${steps(['Mark where daylight could enter (walls, roof, borrowed).', 'Exclude the front wall around the monitors.', 'Choose glazing so the window is no weaker than about the wall minus 5–10 dB.', 'Check the composite wall in the widget above.', 'Plan shading and tell the HVAC designer about solar gain.'])}
        ${tools([['isolation', 'Soundproofing'], ['workshop', 'Workshop drawings']])}` },
    ],
    quiz: [
      { q: 'Where is the worst place for a window in a control room?', opts: ['Rear wall', 'Side wall', 'Behind / between the monitors', 'Ceiling with lined well'], a: 2, why: 'It reflects strongly and breaks the front-wall symmetry.' },
      { q: 'Why use two panes of different thickness?', opts: ['Cheaper', 'Their coincidence dips don’t line up', 'Looks better', 'Less condensation'], a: 1, why: 'Different thicknesses have weak points at different frequencies.' },
      { q: 'Thermal double glazing with a 16 mm gap is…', opts: ['Studio-grade', 'Poor for low-frequency isolation', 'Better than a 150 mm gap', 'Perfect for drums'], a: 1, why: 'A small gap gives a high mass-air-mass resonance.' },
      { q: 'A good daylight option for a booth with no outside wall?', opts: ['Big window', 'Light tube / borrowed light', 'Open door', 'None possible'], a: 1, why: 'Light tubes and internal glass bring daylight with little acoustic cost.' },
    ],
  });

  /* ======================================================================
     PLANS — shared content builders
     ====================================================================== */
  const bom = (rows) => table(['Item', 'Quantity (metric)', 'Quantity (imperial)', 'Notes'], rows);
  const tiers = (rows) => `<div class="uc-grid">${rows.map(([ico, t, items, col]) => uc(ico, t, items, col)).join('')}</div>`;

  /* M25 — Bedroom */
  L.push({
    id: 'm-plan-bedroom', n: 'M25', track: 'master', title: 'Bedroom Studio (PLANS!)', level: 'Foundation', mins: 40,
    summary: 'A 3.6 × 3.0 m bedroom turned into an accurate mix and voice room — no building work, a weekend of DIY, clear materials list and budget tiers.',
    tags: ['bedroom studio', 'plans', 'home studio', 'bill of materials', 'treatment', 'window plug', 'door seals'],
    sections: [
      { h: 'Goals & limits', html: `
        <p class="lead">Goal: reliable mixes and clean voice recordings in a normal bedroom (3.6 × 3.0 × 2.4 m). Limits: no structural work, the room is still a bedroom, neighbours are close.</p>
        <div class="grid g2"><div class="callout mentor" style="margin:0"><b>Realistic</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Accurate monitoring at moderate levels</li><li>Dry, clean voice-over and vocals</li><li>RT ≈ 0.2–0.3 s, even bass</li></ul></div>
        <div class="callout warn" style="margin:0"><b>Not realistic</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Drums or loud amps without complaints</li><li>“Soundproof” with foam</li><li>Flat bass below ~60 Hz in a room this size</li></ul></div></div>` },
      { h: 'The plan', html: `<p>Toggle the layers to see isolation, treatment, gear, electrical and HVAC separately. Numbers match the notes under the drawing. The desk faces down the 3.6 m length so the seat lands near 38 % of the length.</p>`, viz(host) { V.studioPlan(host, 'bedroom'); } },
      { h: 'Section: corner trap and first-reflection panel', html: `
        ${buildup('Wall section at the side reflection point (room side at bottom)', [
          ['Existing wall (plasterboard / masonry)', 18, 'var(--muted)', { op: 0.6 }],
          ['Air gap 50 mm (spacers or French cleat)', 24, AIR, { dash: true }],
          ['Mineral wool 100 mm, 40–60 kg/m³', 44, WOOL],
          ['Timber frame 18 × 120 mm', 8, WOOD],
          ['Breathable fabric face', 6, 'var(--accent2)', { op: 0.6 }],
        ], 'Corner traps: same build, triangular, floor to ceiling — or stacked superchunks.')}
        <p>Use the <a href="#/absorbers">Absorber Designer</a> to check the curve for your depth and gap, and the <a href="#/predict">Room Predictor</a> with 3.6 × 3.0 × 2.4 m to see this room’s problem modes.</p>` },
      { h: 'Step-by-step build', html: `
        ${flow([['Measure & predict', 'room modes, seat position'], ['Seal the door', 'solid core, seals, drop seal'], ['Window plug', 'board + wool, weatherstripped'], ['Corner traps', 'all reachable corners'], ['Reflection panels', 'sides + ceiling cloud'], ['Rear & front', '200 mm rear, absorber behind speakers'], ['Set up & measure', 'triangle, levels, sweep']])}
        <div class="callout data">Mirror trick: sit at the mix position; a friend slides a mirror along the side walls and ceiling. Wherever you see a speaker in the mirror, put a panel.</div>` },
      { h: 'Bill of materials', html: `${bom([
        ['Mineral wool slabs 40–60 kg/m³, 100 mm', '≈ 12 m²', '≈ 130 ft²', 'Corners, panels, rear wall'],
        ['Timber 18 × 120 mm (frames)', '≈ 40 m', '≈ 130 ft', 'Panel frames, plug frame'],
        ['Breathable fabric', '≈ 14 m²', '≈ 150 ft²', 'Blow-through test: you should feel your breath'],
        ['MDF/ply 18 mm', '1 sheet', '1 sheet (4×8 ft)', 'Window plug face'],
        ['Door seal kit + automatic drop seal', '1 set', '1 set', 'For a solid-core door'],
        ['Solid-core door (if needed)', '1', '1', '≈ 30–40 kg'],
        ['Weatherstrip foam', '≈ 6 m', '≈ 20 ft', 'Plug perimeter'],
        ['Ceiling cloud hangers (chain/cable)', '4', '4', 'Rated anchors into joists'],
      ])}` },
      { h: 'Budget tiers', html: `${tiers([
        ['🟢', 'Starter', [['Do', 'Corner traps, 4 reflection panels, door seals'], ['Result', 'Clean mids, better bass, ≈ 25–30 dB isolation']]],
        ['🟡', 'Better', [['Do', '+ ceiling cloud, 200 mm rear, window plug, solid-core door'], ['Result', 'RT ≈ 0.25 s, ≈ 30–35 dB'], ['Bonus', 'Measure with the app']], '#c7a12b'],
        ['🔴', 'Best', [['Do', '+ tuned membrane trap for the worst mode, quality mic + stands, sub with alignment'], ['Result', 'Mixes translate; even bass']], '#c74b4b'],
      ])}
        <div class="callout example">Expected results for the “better” tier: bass variation at the seat reduced from about ±10 dB to ±5 dB; flutter echo gone; voice recordings with no audible room; neighbours hear normal mixing levels faintly — but drums would still be a problem.</div>` },
      { h: 'What NOT to do & upgrade path', html: `
        ${myth([
          ['Cover every wall in thin foam.', 'Kills highs, leaves boomy bass. Use fewer, thicker panels and corner traps.'],
          ['Put the desk in the middle of the room.', 'Bass nulls at the centre. Use ~38 % of length.'],
          ['Seal the room completely with no air.', 'You will cook. Plan quiet ventilation (mini-split + fresh-air breaks).'],
        ])}
        <h3>Upgrade path</h3>${steps(['Measure — fix the biggest bass peak with a tuned trap.', 'Add a subwoofer with proper alignment.', 'Add a second solid door or a light “inner” door for louder sessions.', 'Move up to the basement or garden plans when isolation becomes the limit.'])}
        ${tools([['treatment', 'Treatment simulator'], ['predict', 'Room Predictor'], ['absorbers', 'Absorber Designer']])}` },
    ],
    quiz: [
      { q: 'Where should the mix position be in a 3.6 m long room?', opts: ['1.8 m (centre)', '≈ 1.37 m (38 %)', 'Against the rear wall', '0.5 m from the front'], a: 1, why: '38 % of the length avoids the centre null and rear-wall build-up.' },
      { q: 'Biggest isolation upgrade for little money?', opts: ['Foam on walls', 'Solid-core door with seals', 'Rug', 'Curtains'], a: 1, why: 'Doors with gaps are the weakest link.' },
      { q: 'How do you find first-reflection points?', opts: ['Guess', 'Mirror trick from the seat', 'Corners only', 'Ceiling only'], a: 1, why: 'Where you see a speaker in the mirror, sound reflects to you.' },
      { q: 'What can a bedroom studio NOT realistically do without construction?', opts: ['Accurate mixing', 'Clean vocals', 'Loud drums without complaints', 'Podcasting'], a: 2, why: 'That needs mass and decoupling — building work.' },
    ],
  });

  /* M26 — Basement */
  L.push({
    id: 'm-plan-basement', n: 'M26', track: 'master', title: 'Basement Studio (PLANS!)', level: 'Core', mins: 50,
    summary: 'A 7.2 × 5.0 m basement with control room, booth, sound lock and machine room: room-in-room ceiling, dry construction, quiet HVAC and the code checks you must make.',
    tags: ['basement studio', 'plans', 'room-in-room', 'moisture', 'ceiling height', 'sound lock', 'HVAC', 'egress'],
    sections: [
      { h: 'Why basements are great — and tricky', html: `
        <p class="lead">A concrete slab floor and earth-backed walls are already excellent isolation. The weak point is the <b>ceiling</b>: the house is directly above. The other enemies are <b>moisture</b> and <b>height</b>.</p>
        ${flow([['Check height', '≥ 2.6 m slab to joists before building'], ['Check moisture', 'dry for a full year? any leaks?'], ['Check codes', 'egress, fire, permits'], ['Plan rooms', 'control, booth, lobby, machine'], ['Build ceiling first', 'room-in-room on hangers/joists']])}
        <div class="callout safety">Basement rooms used for occupancy usually need code-compliant escape (egress) routes, smoke detection and sometimes fire-rated ceilings. Check local codes and permits before you start.</div>` },
      { h: 'The plan', html: `<p>Control room 4.2 × 3.9 m and booth 2.7 × 2.4 m are room-in-room; the lobby acts as a sound lock with two doors in series; amps, computer and air handler live in the machine room.</p>`, viz(host) { V.studioPlan(host, 'basement'); } },
      { h: 'Sections: ceiling and wall build-ups', html: `
        ${buildup('Ceiling section (house above → studio below)', [
          ['Floor above (existing)', 16, WOOD],
          ['Existing joists, cavity filled with wool', 40, WOOL, { studs: true }],
          ['Air gap ≥ 25 mm', 16, AIR, { dash: true }],
          ['Independent ceiling joists or isolation hangers', 22, WOOD, { springs: true }],
          ['Mineral wool 100 mm between new joists', 30, WOOL],
          ['2 × 16 mm dense gypsum, joints staggered, sealed', 16, GYP],
        ], 'Inner ceiling never touches the old joists except through the isolation hangers.')}
        ${buildup('Wall section against the foundation', [
          ['Foundation wall (concrete)', 24, CONC],
          ['Vapour-open moisture-tolerant insulation / drained gap', 18, WOOL, { dash: true }],
          ['Air gap 25 mm', 12, AIR, { dash: true }],
          ['Inner stud wall on its own track, wool-filled', 34, WOOL, { studs: true }],
          ['2 × 16 mm gypsum', 14, GYP],
        ], 'Never trap moisture against concrete with plastic sheeting — ask a local building-science professional.')}` },
      { h: 'Step-by-step build', html: `
        ${flow([['Dry & seal', 'fix leaks, dehumidify, test'], ['Services', 'electrician: technical sub-panel; plumbing moved'], ['Ceiling', 'independent joists or hangers, 2 layers'], ['Inner walls', 'own track, gap to walls, sealed'], ['Doors & window', 'acoustic doors, studio window'], ['HVAC', 'ducted, silencers per room'], ['Treat', 'traps, panels, diffuser'], ['Measure', 'isolation, NC, RT, bass']])}
        <div class="callout data">Height budget: 2.6 m slab-to-joist − 0.25 m ceiling build-up − 0.02 m floor finish ≈ <b>2.35 m</b> clear. Do not float a basement slab unless you must — it costs height and the slab is already a superb floor.</div>` },
      { h: 'Bill of materials (main items)', html: `${bom([
        ['Dense gypsum board 16 mm', '≈ 150 m²', '≈ 1 600 ft²', '2 layers on inner walls & ceilings'],
        ['Mineral wool 100 mm', '≈ 110 m²', '≈ 1 200 ft²', 'Wall & ceiling cavities'],
        ['Isolation hangers / clips', '≈ 40', '≈ 40', 'Per manufacturer spacing'],
        ['Studs/track (timber or steel)', '≈ 180 m', '≈ 600 ft', 'Inner leaves'],
        ['Acoustic doors (or solid-core + seals)', '3', '3', 'Control, booth, lobby'],
        ['Studio window (2 panes, laminated)', '1', '1', 'Control ↔ booth'],
        ['Acoustic sealant', '≈ 20 tubes', '≈ 20 tubes', 'Perimeters, penetrations'],
        ['Silencers / lined flex duct', '2 + ≈ 15 m', '2 + ≈ 50 ft', 'One silencer per room'],
        ['Treatment: wool, frames, fabric', '≈ 30 m²', '≈ 320 ft²', 'Traps, panels, cloud'],
      ])}` },
      { h: 'Budget tiers & expected results', html: `${tiers([
        ['🟢', 'Starter', [['Do', 'Treat existing space, seal doors, ceiling insulation + resilient channel'], ['Result', '≈ 40–45 dB to the house']]],
        ['🟡', 'Better', [['Do', 'Room-in-room ceiling, inner walls, two acoustic doors via lobby'], ['Result', '≈ 55–60 dB, NC 20']], '#c7a12b'],
        ['🔴', 'Best', [['Do', '+ booth, studio window, ducted HVAC with silencers, technical power'], ['Result', 'Pro-grade tracking & mixing, ≈ 60–65 dB']], '#c74b4b'],
      ])}
        ${ps([
          ['Musty smell, mould', 'Moisture trapped behind walls', 'Fix water first, vapour-open details, dehumidifier'],
          ['Footsteps from above', 'Ceiling attached to joists', 'Independent ceiling or hangers'],
          ['Low ceiling feels boxy', 'Too much build-up', 'Thin but dense layers, absorptive cloud, avoid floating the slab'],
          ['Furnace noise', 'Plant in the same space', 'Enclose plant, isolate, silence ducts'],
        ])}` },
      { h: 'Upgrade path', html: `${steps(['Start with the control room; build the booth later using the same details.', 'Add bass-tuned traps after measuring.', 'Add an ERV for fresh air when sessions get longer.', 'Upgrade doors to a full sound lock if drums move in.'])}
        ${tools([['predict', 'Room Predictor'], ['isolation', 'Soundproofing'], ['treatment', 'Treatment simulator']])}` },
    ],
    quiz: [
      { q: 'What is usually the weakest isolation path in a basement studio?', opts: ['Slab floor', 'Foundation walls', 'Ceiling to the house above', 'Windows'], a: 2, why: 'The house sits directly on the joists above the studio.' },
      { q: 'Should you float a basement slab?', opts: ['Always', 'Usually not — it costs height and the slab is already good', 'Only for vocals', 'Only with springs'], a: 1, why: 'Float only for very loud sources over occupied spaces.' },
      { q: 'What does the lobby (sound lock) do?', opts: ['Storage', 'Puts two doors in series for much more isolation', 'Ventilation', 'Nothing acoustic'], a: 1, why: 'Two sealed doors in series beat one heavy door.' },
      { q: 'First thing to check before building in a basement?', opts: ['Paint colour', 'Moisture and height', 'Speaker brand', 'Fabric'], a: 1, why: 'Wet or low basements fail no matter how good the acoustics.' },
    ],
  });

  /* M27 — Detached */
  L.push({
    id: 'm-plan-detached', n: 'M27', track: 'master', title: 'Detached Home Studio (PLANS!)', level: 'Advanced', mins: 55,
    summary: 'An 8.4 × 5.6 m garden building with a soffit-mounted control room, live room, sound-lock entry and plant room — from permits and foundations to power, data and HVAC.',
    tags: ['garden studio', 'detached studio', 'plans', 'room-in-room', 'soffit', 'foundation', 'permits', 'floating floor'],
    sections: [
      { h: 'Why build detached', html: `
        <p class="lead">Separating the studio from the house gives you distance (the best isolation of all), freedom of shape and height, and a building designed for sound from the ground up.</p>
        ${flow([['Brief', 'what you record, how loud, when'], ['Site', 'distance to neighbours, access, levels'], ['Permits', 'planning / building rules'], ['Design', 'shell + inner rooms + services'], ['Build', 'foundation → shell → inner rooms'], ['Commission', 'measure, tune, document']])}
        <div class="callout safety">Outbuildings often need planning permission and building approval depending on size, height, use and distance to boundaries. Check local codes early — before buying materials.</div>` },
      { h: 'The plan', html: `<p>Control room 4.6 × 4.2 m with soffit-mounted mains, live room 2.9 × 3.3 m, entry/sound lock so the outside door never opens into a studio, and a plant room for the heat pump and ventilation.</p>`, viz(host) { V.studioPlan(host, 'detached'); } },
      { h: 'Sections: shell, inner room and floor', html: `
        ${buildup('Wall section, outside → inside (top → bottom)', [
          ['Cladding on battens (rain screen)', 12, WOOD],
          ['Sheathing + membrane (weatherproof, vapour-open)', 8, GYP],
          ['Outer frame 140 mm, wool-filled', 34, WOOL, { studs: true }],
          ['2 layers dense board (outer leaf mass)', 14, GYP],
          ['Air gap 25–50 mm — nothing touches', 16, AIR, { dash: true }],
          ['Inner frame 90 mm on its own floor, wool-filled', 28, WOOL, { studs: true }],
          ['2 layers dense gypsum (inner leaf)', 14, GYP],
          ['Room treatment zone (absorber behind fabric)', 22, WOOL, { op: 0.6 }],
        ], 'Expect ≈ 60–70 dB from inside to outside with good doors and windows.')}
        ${buildup('Live-room floor (top → bottom)', [
          ['Floor finish (timber / vinyl)', 10, WOOD],
          ['Concrete or 2 × 18 mm board + gypsum topping', 26, CONC],
          ['Air gap with isolators (rubber pads or springs)', 26, AIR, { springs: true }],
          ['Structural slab on insulation', 34, CONC],
        ], 'Float the live room if drums are played; the control room can sit on the slab.')}` },
      { h: 'Step-by-step build', html: `
        ${flow([['Foundation', 'slab or piers, level, with service ducts'], ['Shell', 'frame, sheathing, roof, weatherproof'], ['Services in', 'power feed, data, drainage'], ['Floors', 'float where needed'], ['Inner rooms', 'own frames, sealed'], ['Doors & windows', 'studio-grade, sound lock'], ['HVAC', 'heat pump + ERV, silencers'], ['Fit-out', 'soffits, treatment, cabling'], ['Commission', 'measure & tune']])}
        <div class="callout data">Power feed: an armoured cable from the house to a sub-panel in the plant room, sized for the total load (often 6–10 kW for HVAC + gear) — design and installation by a licensed electrician. Run data as fibre or Cat6 in a separate duct.</div>` },
      { h: 'Bill of materials (main items)', html: `${bom([
        ['Foundation (slab or piers)', '≈ 47 m² footprint', '≈ 500 ft²', 'Per engineer / local codes'],
        ['Framing timber', '≈ 600 m', '≈ 2 000 ft', 'Outer and inner frames'],
        ['Dense gypsum / board', '≈ 280 m²', '≈ 3 000 ft²', '2 layers each leaf'],
        ['Mineral wool', '≈ 220 m²', '≈ 2 400 ft²', 'Cavities and treatment'],
        ['Acoustic doors', '2 + 1 external', '2 + 1', 'Sound lock + entry'],
        ['Studio double windows', '3', '3', 'CR ↔ live, daylight, live room'],
        ['Floor isolators', '≈ 40 pads or 25 springs', 'same', 'Live room, per load calc'],
        ['Heat pump + ERV + silencers', '1 + 1 + 3', 'same', 'Plant room'],
        ['Sub-panel + armoured feed', '1 + run length', '1', 'Licensed electrician'],
      ])}` },
      { h: 'Budget tiers & expected results', html: `${tiers([
        ['🟢', 'Starter', [['Do', 'Insulated heavy shell, one big room, good door, treatment'], ['Result', '≈ 45–50 dB, great for mixing']]],
        ['🟡', 'Better', [['Do', '+ inner room-in-room for the control room, sound lock'], ['Result', '≈ 55–60 dB, NC 20']], '#c7a12b'],
        ['🔴', 'Best', [['Do', 'Full plan: two inner rooms, floated live room, soffits, studio windows, ducted HVAC'], ['Result', '≈ 65–70 dB, pro tracking']], '#c74b4b'],
      ])}
        ${ps([
          ['Rain drumming on the roof', 'Light roof', 'Mass on the roof + inner ceiling; rain noise needs both'],
          ['Neighbours hear bass', 'Light outer shell', 'More mass on the shell, inner rooms, distance'],
          ['Condensation in the walls', 'Wrong vapour control', 'Vapour-open outer layers, ventilated cladding'],
          ['Heat pump hum outside', 'Outdoor unit near boundary', 'Place away, on isolators, behind a barrier'],
        ])}` },
      { h: 'Upgrade path', html: `${steps(['Design the full plan, build the shell and control room first.', 'Add the live room inner shell later — leave its floor isolators out until drums arrive.', 'Add soffit mounting when you choose final monitors.', 'Measure and add tuned traps.'])}
        ${tools([['predict', 'Room Predictor'], ['floors', 'Floating Floors'], ['isolation', 'Soundproofing']])}` },
    ],
    quiz: [
      { q: 'What is the biggest isolation advantage of a detached studio?', opts: ['Cheaper walls', 'Distance from the house and neighbours', 'No need for doors', 'Better Wi-Fi'], a: 1, why: 'Distance plus a purpose-built shell.' },
      { q: 'Why an entry sound lock?', opts: ['Storage', 'Two doors in series; the outside door never opens into a studio', 'Fire exit', 'Air conditioning'], a: 1, why: 'Sound locks dramatically raise door isolation.' },
      { q: 'Which room most often needs a floated floor?', opts: ['Plant room', 'Live room with drums', 'WC', 'Entry'], a: 1, why: 'Impact and low-frequency energy from drums travel through floors.' },
      { q: 'Who designs and installs the power feed?', opts: ['Anyone', 'A licensed electrician', 'The window supplier', 'The acoustician'], a: 1, why: 'Electrical work follows local code and licensing.' },
    ],
  });

  /* M28 — Pro facility */
  L.push({
    id: 'm-plan-pro', n: 'M28', track: 'master', title: 'Professional Recording Facility (PLANS!)', level: 'Advanced', mins: 60,
    summary: 'A 22 × 15 m facility with control room, live room, iso booths, VO/ADR, mix room, sound-lock corridor and plant: brief, adjacency, structural isolation, MEP coordination, targets and phasing.',
    tags: ['recording facility', 'plans', 'adjacency', 'structural isolation', 'MEP', 'acoustic targets', 'phasing', 'brief'],
    sections: [
      { h: 'Start with the brief', html: `
        <p class="lead">Professional facilities succeed or fail on the brief: who records what, how loud, how many sessions at once, and which rooms must work together.</p>
        ${flow([['Programme', 'rooms, sizes, simultaneous use'], ['Adjacency', 'who needs glass, who needs distance'], ['Targets', 'NC, RT, isolation per pair of rooms'], ['Structure', 'floated slabs, independent boxes'], ['MEP', 'power, HVAC, data coordinated'], ['Phasing', 'build what earns first']])}` },
      { h: 'The plan', html: `<p>Control room A looks into the live room through a large studio window; iso booths sit off the live room with their own windows; VO/ADR and mix room B are on the quiet side of the corridor; plant and machine rooms are grouped away from studios.</p>`, viz(host) { V.studioPlan(host, 'pro'); } },
      { h: 'Adjacency & circulation', html: `
        ${table(['Pair of rooms', 'Relationship', 'Why'], [
          ['Control A ↔ Live room', 'Adjacent, big studio window', 'Sight lines, communication'],
          ['Live ↔ iso booths', 'Adjacent, windows', 'Separation with eye contact'],
          ['Any studio ↔ plant', 'Far apart, corridor between', 'Noise and vibration'],
          ['Studios ↔ lounge/kitchen', 'Separated by corridor + sound locks', 'Clients are noisy'],
          ['Every studio ↔ corridor', 'Two doors (sound lock)', 'Isolation through doors'],
        ])}
        <div class="callout mentor">Circulation is acoustic design: a treated sound-lock corridor stops people walking through one studio to reach another, and keeps the doors pairs-of-two everywhere.</div>` },
      { h: 'Structural isolation section', html: `
        ${buildup('Box-in-box section through a studio (top → bottom)', [
          ['Building roof / slab above', 22, CONC],
          ['Plenum with services, resilient hangers', 26, AIR, { springs: true }],
          ['Inner ceiling: 2–3 layers dense board on own structure', 18, GYP],
          ['Studio volume (4.5–6 m high in live room)', 40, 'var(--panel)', { dash: true }],
          ['Floated concrete slab 100–150 mm', 22, CONC],
          ['Spring or rubber isolators, 25–50 mm gap', 24, AIR, { springs: true }],
          ['Structural slab', 26, CONC],
        ], 'Inner walls stand on the floated slab and carry the inner ceiling — a complete box on springs.')}` },
      { h: 'Acoustic targets per room', html: `
        ${table(['Room', 'Background noise', 'RT (mid)', 'Isolation to neighbours'], [
          ['Control room A', 'NC 15–20', '≈ 0.2–0.3 s, flat-ish by band', '≥ 70 dB to live room (with window)'],
          ['Live room', 'NC 15', '0.5–1.0 s, variable', '≥ 75–80 dB to other studios'],
          ['Iso booths', 'NC 15', '0.25–0.4 s', '≥ 60–70 dB to live room'],
          ['VO / ADR', 'NC 15', '≈ 0.2 s, no boxiness', '≥ 70 dB'],
          ['Mix room B', 'NC 20', '≈ 0.25 s', '≥ 65 dB'],
          ['Lounge / reception', 'NC 30–35', 'treated, not dead', '—'],
        ])}
        <div class="callout data">Isolation figures are room-to-room including doors, windows, flanking and services — the whole package. Specify them in the contract and measure at handover.</div>` },
      { h: 'MEP coordination and the team', html: `
        <ul><li><b>Mechanical</b>: central low-velocity AHU in the plant room on isolators, silencers at every room, VAV boxes outside studios.</li>
          <li><b>Electrical</b>: technical power distribution, separate lighting with quiet drivers, star distribution per code — licensed electrical engineer.</li>
          <li><b>Plumbing & drainage</b>: no pipes over studios; drains wrapped and isolated.</li>
          <li><b>Data & audio</b>: tie-line schedule, fibre/Cat backbone, machine room ventilation.</li></ul>
        <div class="uc-grid">
          ${uc('📐', 'Acoustic consultant', [['Role', 'Targets, isolation design, room acoustics, testing']])}
          ${uc('🏗️', 'Architect & structural engineer', [['Role', 'Building, floated slabs, loads, permits']], '#7a5cc7')}
          ${uc('⚡', 'MEP engineers', [['Role', 'HVAC, electrical, plumbing designed to acoustic targets']], '#c7a12b')}
          ${uc('🎛️', 'Systems integrator', [['Role', 'Audio/video systems, wiring, commissioning']], '#2b9fc7')}
        </div>` },
      { h: 'Phasing, problems & solutions', html: `
        ${flow([['Phase 1', 'shell, plant, control A + live room'], ['Phase 2', 'iso booths, VO/ADR'], ['Phase 3', 'mix room B, lounge upgrades']])}
        ${ps([
          ['Studios meet NC only with HVAC off', 'Ducts too small / too fast', 'Design velocity first; silencers per room; commission and measure'],
          ['Crosstalk between rooms via ceiling plenum', 'Shared plenum above inner ceilings', 'Full-height walls to structure or sealed inner ceilings'],
          ['Footfall in corridor heard in VO booth', 'Corridor floor on same slab as booth', 'Floated booth slab, break in structural slab'],
          ['Budget overrun', 'Isolation underestimated', 'Phase the build; never cut isolation or HVAC to save money'],
        ])}
        <h3>Apply it</h3>${steps(['Write the brief and room list with simultaneous uses.', 'Draw an adjacency diagram before any plan.', 'Set NC, RT and isolation targets per room pair.', 'Appoint consultant, architect, engineers and integrator together.', 'Design, build in phases, measure everything at handover.'])}
        ${tools([['predict', 'Room Predictor'], ['isolation', 'Soundproofing'], ['floors', 'Floating Floors']])}` },
    ],
    quiz: [
      { q: 'What should be written before drawing any plan?', opts: ['Equipment list only', 'The brief and adjacency requirements', 'The fabric colour', 'The website'], a: 1, why: 'Rooms, uses and relationships drive the plan.' },
      { q: 'Typical background-noise target in a pro live room?', opts: ['NC 15', 'NC 35', 'NC 50', 'No target'], a: 0, why: 'Recording rooms need very low noise.' },
      { q: 'What is a “box-in-box” studio?', opts: ['A storage room', 'Inner walls and ceiling on a floated slab, independent of the building', 'A booth inside a booth', 'A speaker cabinet'], a: 1, why: 'A complete independent inner structure on isolators.' },
      { q: 'Where should the plant room be?', opts: ['Next to the control room', 'Grouped away from studios, isolated', 'Above the live room', 'Inside the lounge'], a: 1, why: 'Distance and isolation keep machine noise out.' },
    ],
  });

  L.forEach((l) => window.LESSONS.push(l));
})();
