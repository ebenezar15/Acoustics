/* ==========================================================================
   Studio Design Master Class — part 3 (M13–M19):
   control rooms, tracking rooms, music booths, voice-over booths, Foley & ADR,
   room treatment designs, flow resistivity & absorption coefficients.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${k === 'Fix' || k === 'Proper fix' ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const ps = (rows) => `<div class="table-wrap"><table><tr><th>Problem</th><th>Why it happens</th><th>Solution</th></tr>${rows.map(([a, b, c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td>${c}</td></tr>`).join('')}</table></div>`;
  const drawing = (fn) => (host) => { const d = document.createElement('div'); d.className = 'drawing'; d.innerHTML = fn(); host.appendChild(d); };

  /* ======================================================================
     M13 — Control rooms
     ====================================================================== */
  const SVG_CR = `<svg class="gsvg" viewBox="0 0 640 300" role="img" aria-label="Control room plan with reflection-free zone">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Plan: symmetry, a reflection-free zone and a diffuse rear</text>
    <path d="M60 40 L580 40 L600 280 L40 280 Z" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <path d="M60 40 L200 40 L120 120 L48 120 Z" fill="var(--c4)" opacity=".55"/><path d="M580 40 L440 40 L520 120 L592 120 Z" fill="var(--c4)" opacity=".55"/>
    <rect x="200" y="40" width="240" height="14" fill="var(--c4)" opacity=".55"/>
    <rect x="190" y="66" width="22" height="22" fill="var(--accent)"/><rect x="428" y="66" width="22" height="22" fill="var(--accent)"/>
    <rect x="250" y="150" width="140" height="26" rx="4" fill="var(--panel)" stroke="var(--muted)"/><text x="320" y="167" text-anchor="middle" font-size="10" fill="var(--muted)">desk (low, sloped)</text>
    <circle cx="320" cy="196" r="8" fill="var(--good)"/>
    <ellipse cx="320" cy="190" rx="70" ry="48" fill="var(--good)" opacity=".12" stroke="var(--good)" stroke-dasharray="5 3"/>
    <text x="320" y="252" text-anchor="middle" font-size="10" fill="var(--good)">reflection-free zone</text>
    <line x1="201" y1="77" x2="320" y2="196" stroke="var(--accent)" stroke-width="1.5"/><line x1="439" y1="77" x2="320" y2="196" stroke="var(--accent)" stroke-width="1.5"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${130 + i * 32}" y="${266 - ((i * 5) % 4) * 4}" width="26" height="${10 + ((i * 5) % 4) * 4}" fill="var(--accent2)" opacity=".8"/>`).join('')}
    <text x="320" y="296" text-anchor="middle" font-size="10" fill="var(--accent2)">rear wall: deep absorption + diffusion</text>
    <line x1="320" y1="30" x2="320" y2="288" stroke="var(--muted)" stroke-dasharray="3 5"/>
    <text x="70" y="140" font-size="10" fill="var(--muted)">splayed / absorbed</text><text x="500" y="140" font-size="10" fill="var(--muted)">mirror image</text>
  </svg>`;
  const M13 = {
    id: 'm-control', n: 'M13', track: 'master', title: 'Control Rooms — the Heart of the Studio', level: 'Advanced', mins: 50,
    summary: 'How to size, shape and treat the room where every decision is judged: ratios, shapes, design philosophies, targets, the physics that bites, and the furniture that quietly ruins it.',
    tags: ['control room', 'room ratios', 'RFZ', 'LEDE', 'SBIR', 'first reflections', 'symmetry', 'desk reflection'],
    sections: [
      { h: 'What a control room has to do', html: `
        <p class="lead">A control room is a measuring instrument. Its job is to let you hear the <b>recording</b>, not the room — so that decisions made here sound right everywhere else.</p>
        ${flow([['Isolate', 'quiet inside, neighbours happy'], ['Size & shape', 'ratios, symmetry, depth for treatment'], ['Place', 'speakers and seat first'], ['Treat', 'bass, first reflections, rear wall'], ['Measure & tune', 'decay, response, imaging']])}
        <div class="callout mentor">The order matters. Treatment cannot rescue a seat in a modal null or speakers 70 cm from a hard wall. Fix geometry and placement first; treatment refines; EQ is the final trim.</div>` },
      { h: 'Room ratios — when they matter and how to check', html: `
        <p>Below a few hundred hertz a small room behaves like a set of resonances (modes). Dimensions that are equal or simple multiples stack modes on the same frequency, giving one-note bass. A good ratio <b>spreads</b> them out; it does not remove them.</p>
        <div class="table-wrap"><table><tr><th>Ratio (H : W : L)</th><th>Example for 2.7 m height</th><th>Comment</th></tr>
          <tr><td>1 : 1.14 : 1.39</td><td>2.7 × 3.1 × 3.8 m</td><td>Compact; fine for a small mix room</td></tr>
          <tr><td>1 : 1.28 : 1.54</td><td>2.7 × 3.5 × 4.2 m</td><td>Widely used, even spread</td></tr>
          <tr><td>1 : 1.4 : 1.9</td><td>2.7 × 3.8 × 5.1 m</td><td>Good for mid-size rooms</td></tr>
          <tr><td>1 : 1.6 : 2.33</td><td>2.7 × 4.3 × 6.3 m</td><td>Larger rooms; deep rear treatment</td></tr>
          <tr><td>1 : 1 : 2 or 1 : 2 : 3 <span class="bad">✗</span></td><td>2.7 × 2.7 × 5.4 m</td><td>Stacked modes — avoid</td></tr></table></div>
        <div class="callout data"><b>Quick check:</b> no two dimensions within ~5 % of each other or of a whole-number multiple. Run the real inside dimensions <i>after</i> isolation linings in the <a href="#/predict">Room Predictor</a> or <a href="#/analyzer">Room Analyzer</a>. Above roughly 4 × 5 m floor area, ratios matter less than treatment.</div>` },
      { h: 'Room shapes and design philosophies', html: `
        ${SVG_CR}
        <div class="table-wrap"><table><tr><th>Shape / approach</th><th>Idea</th><th>Best for</th></tr>
          <tr><td><b>Rectangle, treated</b></td><td>Simple box, symmetrical; geometry predictable; treatment does the work</td><td>Home and project rooms — easiest to model and build</td></tr>
          <tr><td><b>Splayed front walls</b></td><td>Angle the front side walls/ceiling so first reflections miss the listener</td><td>RFZ-style rooms; less absorption needed</td></tr>
          <tr><td><b>Trapezoid / non-parallel</b></td><td>Avoids flutter; modes still exist but are less predictable</td><td>Larger rooms; never as a substitute for bass control</td></tr>
          <tr><td><b>LEDE</b></td><td>Absorptive front, live diffuse rear</td><td>Imaging with a sense of space</td></tr>
          <tr><td><b>RFZ</b></td><td>Geometry + absorption steer early reflections away from a zone around the head</td><td>Mid-size professional rooms</td></tr>
          <tr><td><b>Non-environment</b></td><td>Hard front with flush speakers, everything else very absorptive to low frequencies</td><td>Rooms with plenty of wall depth</td></tr>
          <tr><td><b>Full-band neutral</b></td><td>Deep, broadband treatment so the room adds little at any frequency</td><td>Rooms where wall depth can be given to treatment</td></tr></table></div>
        <div class="callout mentor">Every successful approach shares four things: symmetry about the listening axis, a clean first 15–20 ms at the seat, smooth controlled bass, and a low noise floor. Pick the approach your room size and budget can actually support.</div>` },
      { h: 'Control-room acoustics: the targets', html: `
        <div class="uc-grid">
          ${uc('⏱️', 'Decay time', [['Target', 'RT60 ≈ 0.2–0.3 s at mid frequencies for typical rooms (20–80 m³)'], ['Shape', 'Roughly flat; allowed to rise slightly below 200 Hz, never ring'], ['Check', 'No band more than ~50 % above the mid value']])}
          ${uc('🎯', 'Early reflections', [['Target', 'First reflections ≥ 15–20 dB below direct sound in the first ~15 ms'], ['How', 'Absorb or redirect side walls, ceiling, desk'], ['Why', 'Clear imaging and stable tonal balance']], 'var(--c3)')}
          ${uc('🔊', 'Low frequencies', [['Target', '±5 dB or better 30–200 Hz at the seat'], ['How', 'Seat position, speaker position, deep traps, sub placement'], ['Waterfall', 'No mode ringing longer than the rest of the room']], 'var(--c4)')}
          ${uc('🤫', 'Background noise', [['Target', 'NC 20–25 (NC 15–20 if you also record here)'], ['How', 'Isolation, quiet HVAC, computers in a machine room']], 'var(--good)')}
        </div>`, viz: 'roomGoals' },
      { h: 'Design considerations — it’s physics', html: `
        <p>Four effects decide most control-room results. All of them are geometry, so they are cheapest to fix on paper.</p>
        <ul><li><b>Speaker–boundary interference (SBIR)</b>: low frequencies radiate backwards, reflect off the wall behind the speaker and cancel at c/(4d). Move the speaker, or flush-mount it.</li>
        <li><b>Room modes</b>: seat at ~38 % of the length, never at the centre; subs where they excite the modes least.</li>
        <li><b>Comb filtering</b>: a strong reflection arriving ~1 ms late carves regular notches across the spectrum.</li>
        <li><b>First reflections</b>: side walls, ceiling and desk create image sources that blur the stereo image.</li></ul>
        <p>Try moving the woofer away from the front wall below — watch the notch move.</p>`, viz: 'sbir' },
      { h: 'Finding the first reflection points', html: `
        <p>Use the mirror trick: sit at the mix position, have a helper slide a mirror along each side wall and the ceiling. Wherever you see a speaker’s tweeter, place broadband absorption (at least 100 mm with an air gap) or angle the surface.</p>`, viz: 'reflections' },
      { h: 'Problem equipment and furniture', html: `
        <div class="uc-grid">
          ${uc('🎛️', 'Console / desk', [['Symptom', 'Phasey, comb-filtered top end; changes as you lean'], ['Cause', 'Large flat surface reflecting into the ears ~1 ms late'], ['Fix', 'Speakers raised on stands behind the desk, tilted down; sloped or shorter desk; meter bridge low']])}
          ${uc('🗄️', 'Racks between speakers', [['Symptom', 'Smeared centre image, mid-range diffraction'], ['Cause', 'Hard boxes in the speaker–listener path'], ['Fix', 'Racks to the side or behind the seat, below ear height']], 'var(--c3)')}
          ${uc('🪟', 'Glass and screens', [['Symptom', 'Bright, unstable image on one side'], ['Cause', 'Glass and large monitors are near-perfect reflectors'], ['Fix', 'Angle glass up/down 5–10°; screens low and tilted; keep symmetry']], 'var(--accent2)')}
          ${uc('🛋️', 'Couch and cabinets', [['Symptom', 'Bass different at the back; rattles'], ['Cause', 'Hard cabinets resonate; couch is an absorber'], ['Fix', 'Couch at the rear (useful bass absorber); cabinets with damped doors, away from corners']], 'var(--c4)')}
          ${uc('💻', 'Noisy computers', [['Symptom', 'Fan hiss masks quiet details, misleads reverb tails'], ['Cause', 'Computers and drives in the room'], ['Fix', 'Machine room or isolated closet, KVM/fibre extenders, fanless gear']], 'var(--bad)')}
          ${uc('💡', 'Lighting & HVAC', [['Symptom', 'Buzz, whoosh'], ['Cause', 'Dimmers, LED drivers, fast air'], ['Fix', 'Quiet drivers, low-velocity air, silencers']], 'var(--warn)')}
        </div>
        ${ps([['Bass vanishes at the seat', 'Seat at 50 % of length (modal null) or SBIR notch', 'Move seat to ~38 %, move speakers, add traps'], ['Image leans left', 'Asymmetric reflections (door, window, cabinet)', 'Mirror treatment on both sides; move furniture'], ['Mixes too bright elsewhere', 'Room over-damped at highs, under-damped at lows', 'Swap thin foam for deep broadband + traps'], ['Different every time you move', 'Desk reflection / seat at a mode boundary', 'Raise and angle speakers; seat off centre']])}` },
      { h: 'Apply it — design a control room in eight steps', html: `
        ${flow([['Inside dims', 'after linings — check ratio'], ['Long axis', 'face down the length'], ['Seat', '≈ 38 % of length, on centre line'], ['Speakers', 'equilateral, tweeters at ear height'], ['Bass', 'corner traps floor-to-ceiling'], ['Reflections', 'side walls, ceiling, desk'], ['Rear wall', 'deep absorption, diffusion if ≥ 3 m away'], ['Measure', 'adjust, then EQ last']])}
        <div class="callout warn">Common mistakes: treating only with thin foam, symmetry broken by a door or window beside one speaker, speakers on the desk, and placing the seat by eye at the room centre.</div>
        <p>Tools: <a href="#/predict">Room Predictor</a> · <a href="#/treatment">Treatment Simulator</a> · <a href="#/measure">Measure</a></p>` },
    ],
    quiz: [
      { q: 'Why do good room ratios matter?', opts: ['They remove room modes', 'They spread modes more evenly in frequency', 'They increase isolation', 'They set RT60'], a: 1, why: 'Every room has modes; ratios only avoid stacking them on the same frequency.' },
      { q: 'A typical mid-frequency RT60 target for a 40 m³ control room is…', opts: ['0.05 s', '0.2–0.3 s', '0.8 s', '1.5 s'], a: 1, why: 'Short and roughly even decay, without being anechoic.' },
      { q: 'The best place to sit relative to room length is…', opts: ['Exactly in the middle', 'Against the rear wall', 'About 38 % from the front wall', 'At 25 % from the rear wall'], a: 2, why: 'The centre is a null for odd length modes; ~38 % avoids the worst nulls and peaks.' },
      { q: 'The desk causes a comb-filtered, phasey sound. Best fix?', opts: ['More foam on the rear wall', 'Raise speakers behind the desk and tilt them down', 'Boost the treble', 'Add a subwoofer'], a: 1, why: 'Changing geometry stops the desk reflection reaching the ears.' },
      { q: 'Flush-mounting the speakers mainly fixes…', opts: ['Flutter echo', 'Speaker–boundary interference from the front wall', 'Isolation to neighbours', 'HVAC noise'], a: 1, why: 'With no gap behind the speaker there is no delayed front-wall reflection.' },
    ],
  };

  /* ======================================================================
     M14 — Tracking rooms
     ====================================================================== */
  const SVG_TRACK = `<svg class="gsvg" viewBox="0 0 640 260" role="img" aria-label="Tracking room with live and dead zones">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">One room, many sounds: live end, dead end and movable gobos</text>
    <rect x="30" y="32" width="580" height="200" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <rect x="30" y="32" width="230" height="200" fill="var(--c4)" opacity=".18"/><text x="145" y="52" text-anchor="middle" font-size="11" fill="var(--c4)" font-weight="700">DEAD END — vocals, guitars</text>
    <rect x="380" y="32" width="230" height="200" fill="var(--accent2)" opacity=".12"/><text x="495" y="52" text-anchor="middle" font-size="11" fill="var(--accent2)" font-weight="700">LIVE END — drums, strings</text>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${388 + i * 22}" y="${32}" width="18" height="${8 + ((i * 3) % 4) * 4}" fill="var(--accent2)"/>`).join('')}
    <rect x="34" y="60" width="10" height="160" fill="var(--c4)"/><rect x="150" y="120" width="70" height="8" fill="var(--text)" transform="rotate(-25 185 124)"/><text x="185" y="150" text-anchor="middle" font-size="10" fill="var(--muted)">gobo</text>
    <circle cx="100" cy="130" r="9" fill="var(--bad)"/><text x="100" y="158" text-anchor="middle" font-size="10">vocal mic</text>
    <rect x="460" y="110" width="70" height="56" rx="10" fill="var(--panel)" stroke="var(--muted)"/><text x="495" y="142" text-anchor="middle" font-size="10" fill="var(--muted)">drum kit</text>
    <circle cx="495" cy="90" r="6" fill="var(--bad)"/><circle cx="440" cy="200" r="6" fill="var(--bad)"/><text x="440" y="222" text-anchor="middle" font-size="10">room mic</text>
    <path d="M270 210 L370 210" stroke="var(--muted)" stroke-width="2"/><text x="320" y="204" text-anchor="middle" font-size="10" fill="var(--muted)">hinged panels: flip live ↔ dead</text>
  </svg>`;
  const M14 = {
    id: 'm-tracking', n: 'M14', track: 'master', title: 'Tracking Rooms', level: 'Advanced', mins: 45,
    summary: 'Rooms where music is made: size and shape for instruments and voice, how much isolation real bands need, how live a room should be, and how to build in variety with live/dead zones and movable treatment.',
    tags: ['tracking room', 'live room', 'variable acoustics', 'gobos', 'isolation', 'drums', 'RT60'],
    sections: [
      { h: 'Control room vs tracking room', html: `
        <p class="lead">A control room should be neutral. A tracking room is part of the instrument — its sound ends up on the record. So the goal is <b>pleasant, controllable</b> acoustics, not the shortest possible decay.</p>
        ${myth([['“A tracking room should be as dead as possible.”', 'Dead rooms make drums and strings sound small and lifeless; you can add reverb, but not a real room’s early reflections.'], ['“Bigger is always better.”', 'Volume and ceiling height help, but a small room with good treatment and variable panels beats a large, ringing garage.'], ['“Live rooms don’t need bass control.”', 'Uncontrolled modes make kick, bass amps and toms boom. Live rooms need bass trapping too.']])}` },
      { h: 'Ratios and shapes for music and voice', html: `
        <div class="table-wrap"><table><tr><th>Use</th><th>Minimum practical</th><th>Good</th><th>Shape notes</th></tr>
          <tr><td>Voice / single instrument</td><td>≈ 12 m³ (2.4 × 2.2 × 2.3 m)</td><td>20–30 m³</td><td>Avoid cubes; deep treatment; one splayed wall helps flutter</td></tr>
          <tr><td>Small band / drums</td><td>≈ 45 m³</td><td>80–150 m³, ceiling ≥ 3 m</td><td>Height matters most for drums and overheads</td></tr>
          <tr><td>Ensembles, piano, strings</td><td>≈ 150 m³</td><td>300 m³+, ceiling 4–6 m</td><td>Non-parallel walls, diffusion high up</td></tr></table></div>
        <p>The same ratio rules as control rooms apply below ~200 Hz. In larger rooms (above ~100 m³) shape and diffusion matter more than exact ratios.</p>` },
      { h: 'How much isolation does a band need?', html: `
        <p>Drums peak at 115–125 dB close up; a guitar stack 110 dB. A neighbour’s bedroom at night allows about 20–25 dB. That gap — often 80+ dB at 63 Hz — decides the construction.</p>
        <div class="callout data"><b>Rules of thumb:</b> drums next to homes need room-in-room walls and ceiling and a floated floor; amps and vocals need double-leaf walls and good doors; a sound lock (two doors) between tracking room and control room is normal practice.</div>
        <p>Choose “Drum kit” or “Band rehearsal” below and see which constructions pass every band.</p>`, viz: 'isoRequirement' },
      { h: 'Tracking-room acoustics: how live?', html: `
        ${SVG_TRACK}
        <div class="table-wrap"><table><tr><th>Room volume</th><th>Mid RT60 (rock / pop)</th><th>Mid RT60 (acoustic / classical)</th></tr>
          <tr><td>30–60 m³</td><td>0.3–0.4 s</td><td>0.4–0.5 s</td></tr>
          <tr><td>60–150 m³</td><td>0.4–0.6 s</td><td>0.6–0.9 s</td></tr>
          <tr><td>150–400 m³</td><td>0.5–0.8 s</td><td>0.9–1.4 s</td></tr></table></div>
        <p>Keep the bass decay close to the mid decay — rising bass reverb is what makes rooms sound muddy.</p>`, viz: 'reverb' },
      { h: 'Variable acoustics: build in choices', html: `
        <div class="uc-grid">
          ${uc('🚪', 'Hinged / rotating panels', [['How', 'One face absorptive, the other reflective or diffusive'], ['Effect', 'RT change of 30–50 % in minutes'], ['Tip', 'Place on the walls facing each other to also control flutter']])}
          ${uc('🎭', 'Heavy curtains', [['How', 'Velour/molton, 50–100 % fullness, 100+ mm from the wall'], ['Effect', 'Mid/high absorption on demand'], ['Limit', 'Little effect below 250 Hz']], 'var(--c3)')}
          ${uc('🧱', 'Gobos', [['How', 'Movable absorber screens, 100 mm wool on a frame, castors'], ['Effect', 'Local separation and a dead pocket for vocals or amps'], ['Tip', 'One side hard for a brighter option']], 'var(--c4)')}
          ${uc('⬆️', 'High ceiling & diffusion', [['How', 'Diffusers above 2 m, clouds that can be raised'], ['Effect', 'Natural early reflections without flutter'], ['Tip', 'Hard floor (wood) + rugs to vary']], 'var(--accent2)')}
          ${uc('🪵', 'Floors', [['Wood', 'Warm, lively for drums and strings'], ['Concrete/tile', 'Bright, aggressive'], ['Rugs', 'Quick deadening under amps and vocals']], 'var(--warn)')}
        </div>`, viz: 'surfaces' },
      { h: 'Mic placement in the room', html: `
        <ul><li>Keep close mics 0.6–1 m from hard walls, or put a gobo behind the source.</li>
        <li>Room mics: try 3–5 m from the kit at about 1–1.5 m height and at the opposite end; avoid the room centre (modal nulls).</li>
        <li>Vocals and acoustic guitar: the dead end, facing <i>into</i> the room so the mic’s rear (dead side) faces the hard wall.</li>
        <li>Listen while walking with headphones — the best spot is often 30 cm away from where you started.</li></ul>
        ${ps([['Boomy kick and toms', 'Low modes, untreated corners', 'Corner traps, kit off the centre line, kick away from corners'], ['Harsh cymbals in room mics', 'Low hard ceiling', 'Clouds above the kit; raise mics; diffusion overhead'], ['Flutter on handclaps', 'Parallel bare walls', 'Treat or diffuse one wall of each pair'], ['Bleed between instruments', 'Live room, no separation', 'Gobos, iso booths, rugs, cardioid/figure-8 rejection']])}` },
      { h: 'Apply it', html: `
        ${flow([['Decide uses', 'drums? strings? voice?'], ['Volume & height', 'as much as you can isolate'], ['Isolation', 'from source level and neighbours'], ['Base treatment', 'bass traps + controlled flutter'], ['Variable layer', 'panels, curtains, gobos'], ['Test & tune', 'clap, record, adjust']])}
        <div class="callout warn">Common mistakes: covering everything with foam; forgetting ventilation for a sealed room full of musicians; no sight lines to the control room; no cable passes, so doors are left ajar during sessions.</div>` },
    ],
    quiz: [
      { q: 'A tracking room should be…', opts: ['As dead as possible', 'Pleasantly live and controllable', 'Identical to the control room', 'Bare concrete'], a: 1, why: 'Its sound is captured on the record; variety and control matter more than deadness.' },
      { q: 'Which matters most for drum rooms?', opts: ['Carpet', 'Ceiling height and volume', 'Foam thickness', 'Window size'], a: 1, why: 'Height avoids harsh early ceiling reflections over the kit.' },
      { q: 'A hinged panel with one absorptive and one reflective side gives…', opts: ['More isolation', 'Variable reverberation', 'Lower noise floor', 'Bass trapping only'], a: 1, why: 'Flipping panels changes the absorption in the room.' },
      { q: 'Where do vocals usually go in a live/dead room?', opts: ['Live end, facing the diffuser', 'Dead end, mic’s rear toward the hard wall', 'Room centre', 'Corner'], a: 1, why: 'The dead end limits room sound; pointing the dead side of the mic at the wall rejects its reflection.' },
    ],
  };

  /* ======================================================================
     M15 — Music recording booths
     ====================================================================== */
  const SVG_BOOTH = `<svg class="gsvg" viewBox="0 0 640 250" role="img" aria-label="Section through an isolated booth">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Section: a booth is a small room-in-room — with air, light and cables</text>
    <rect x="80" y="40" width="480" height="180" fill="none" stroke="var(--text)" stroke-width="6"/>
    <rect x="104" y="58" width="432" height="150" fill="var(--panel2)" stroke="var(--accent)" stroke-width="4" stroke-dasharray="10 4"/>
    <rect x="112" y="66" width="416" height="16" fill="var(--c4)" opacity=".7"/><rect x="112" y="66" width="16" height="134" fill="var(--c4)" opacity=".7"/><rect x="512" y="66" width="16" height="134" fill="var(--c4)" opacity=".7"/>
    <rect x="100" y="208" width="440" height="10" fill="var(--muted)"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${118 + i * 54}" y="218" width="16" height="8" fill="var(--bad)"/>`).join('')}
    <text x="320" y="242" text-anchor="middle" font-size="10" fill="var(--muted)">floated floor on isolation pads (drum booths)</text>
    <rect x="300" y="26" width="60" height="22" fill="var(--c3)"/><text x="330" y="40" text-anchor="middle" font-size="9" fill="var(--panel)">silencer</text>
    <path d="M330 48 L330 80" stroke="var(--c3)" stroke-width="4"/>
    <rect x="536" y="100" width="24" height="60" fill="var(--panel)" stroke="var(--c3)" stroke-width="2"/><text x="590" y="132" text-anchor="middle" font-size="10" fill="var(--c3)">window</text>
    <rect x="80" y="160" width="24" height="18" fill="var(--warn)"/><text x="50" y="174" text-anchor="middle" font-size="10" fill="var(--warn)">cable pass</text>
    <text x="320" y="140" text-anchor="middle" font-size="11" fill="var(--muted)">deep absorption 100–200 mm</text>
  </svg>`;
  const M15 = {
    id: 'm-music-booths', n: 'M15', track: 'master', title: 'Music Recording Booths', level: 'Core', mins: 35,
    summary: 'Drum booths, amp isolation cabinets, vocal and instrument booths: sizes that work, isolation, ventilation, sight lines, cable passes and treatment that avoids the dreaded “boxy” sound.',
    tags: ['booth', 'drum booth', 'amp cabinet', 'vocal booth', 'ventilation', 'cable pass', 'boxy'],
    sections: [
      { h: 'Why booths exist — and their catch', html: `
        <p class="lead">Booths give <b>separation</b>: a loud source stays off the other mics, or a quiet source stays clean. The catch: small rooms have widely spaced low modes and strong nearby reflections, which make recordings boxy.</p>
        ${SVG_BOOTH}` },
      { h: 'Booth types and sizes', html: `
        <div class="uc-grid">
          ${uc('🥁', 'Drum booth', [['Size', '≥ 3 × 3.5 m floor, ceiling ≥ 2.7 m (bigger is far better)'], ['Isolation', 'Room-in-room + floated floor'], ['Treatment', 'Deep bass traps, absorptive clouds over the kit, some diffusion'], ['Watch', 'Small drum booths sound like a closet — consider recording drums in the main room instead']])}
          ${uc('🎸', 'Amp booth / iso cabinet', [['Size', 'Closet 1 × 1.2 m, or a sealed speaker cabinet with a mic inside'], ['Isolation', 'Double-leaf walls or a heavy lined box'], ['Treatment', 'Fully absorptive; the close mic does the work'], ['Watch', 'Heat from valve amps — ventilate']], 'var(--c3)')}
          ${uc('🎤', 'Vocal / instrument booth', [['Size', '≥ 2 × 2.4 m, ceiling ≥ 2.4 m'], ['Isolation', 'Double-leaf, studio window to control room'], ['Treatment', '100–200 mm broadband on most surfaces'], ['Watch', 'Mic 40–60 cm from any wall']], 'var(--accent2)')}
          ${uc('🎹', 'Piano / ensemble booth', [['Size', '≥ 25–35 m³'], ['Isolation', 'Same as a small tracking room'], ['Treatment', 'Some liveness, variable panels'], ['Watch', 'Sight lines to everyone']], 'var(--c4)')}
        </div>` },
      { h: 'Check your booth size', html: `<p>Set your booth dimensions, mic distance and treatment depth. Look for axial modes crowding the 100–300 Hz “chest” region and whether your treatment reaches down there.</p>`, viz: 'boothSize' },
      { h: 'Ventilation, light, sight lines and cables', html: `
        <div class="callout data"><b>Booths get hot.</b> A singer adds ≈ 100 W, a valve amp 200–400 W. A sealed 6 m³ booth climbs several degrees in 15 minutes. Plan ≈ 30–50 m³/h of fresh air per person through silenced ducts (low velocity, lined, with a baffle box) — never through gaps.</div>
        <ul><li><b>Window</b>: double glazing, panes of different thickness, ≥ 100 mm apart, sealed separately, one pane tilted; line of sight to the engineer and other players.</li>
        <li><b>Cable passes</b>: a lined, sealed conduit (or two offset sleeves packed with wool and sealant), or wall-boxes with XLR/TRS/Cat6 panels. Never route cables under the door.</li>
        <li><b>Lighting</b>: warm, dimmable LED with quiet drivers; no buzzing transformers inside.</li>
        <li><b>Headphones & talkback</b>: a local headphone mixer saves many doors opening.</li></ul>` },
      { h: 'Problems & solutions', html: `
        ${ps([['Boxy, honky voice', 'Modes 100–300 Hz, thin foam', 'Deep broadband (100–200 mm + gap) on walls and ceiling; bigger booth'], ['Comb-filtered, hollow tone', 'Mic too close to a hard wall or glass', 'Mic ≥ 40–60 cm from walls; absorb behind the singer; angle the glass'], ['Drums leak to control room', 'Rigid floor, single door, gaps', 'Floated floor, door pair (sound lock), seal cable passes'], ['Singer feels claustrophobic', 'Tiny, dark, dead booth', 'Window, light, a little reflection/diffusion, ventilation'], ['Stuffy after 20 minutes', 'No fresh air', 'Silenced supply and return, low-velocity grilles']])}
        <div class="callout warn">Common mistakes: building the booth first and the vents later; one big door with a gap; cubic dimensions; making the booth so small the treatment leaves no room for the musician.</div>` },
      { h: 'Apply it — booth checklist', html: `
        ${flow([['Purpose', 'drums, amps or voice?'], ['Size', 'as large as the space allows'], ['Isolation', 'walls, floor, door, window'], ['Air', 'silenced supply & return'], ['Treatment', 'deep broadband + bass'], ['Services', 'cable panel, light, headphones'], ['Test', 'record voice, check boxiness']])}
        <p>Tools: <a href="#/isolation">Soundproofing planner</a> · <a href="#/absorbers">Absorber Designer</a> · <a href="#/analyzer">Room Analyzer</a></p>` },
    ],
    quiz: [
      { q: 'The main acoustic risk of a small booth is…', opts: ['Too much reverb', 'A boxy sound from low-mid modes and close reflections', 'Too much isolation', 'Flutter only'], a: 1, why: 'Small rooms put strong, sparse modes in the 100–300 Hz voice region.' },
      { q: 'How should cables enter a booth?', opts: ['Under the door', 'Through a sealed, lined cable pass or wall panel', 'Through the window frame', 'Through the ventilation duct'], a: 1, why: 'Any open gap kills the isolation.' },
      { q: 'Why does a booth need ventilation?', opts: ['To add reverb', 'People and amps heat a sealed room quickly', 'To lower modes', 'It doesn’t'], a: 1, why: 'Airtight rooms get hot and stuffy within minutes.' },
      { q: 'Best treatment for a vocal booth?', opts: ['25 mm foam everywhere', 'Deep broadband absorption on most surfaces', 'Bare walls', 'Diffusers only'], a: 1, why: 'Thin foam kills highs and leaves boxy low-mids.' },
    ],
  };

  /* ======================================================================
     M16 — Voice-over booths
     ====================================================================== */
  const SVG_VO = `<svg class="gsvg" viewBox="0 0 640 230" role="img" aria-label="Voice-over booth plans compared">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Same floor area, two layouts: square box vs splayed, deeply lined</text>
    <rect x="50" y="40" width="160" height="160" fill="var(--panel2)" stroke="var(--bad)" stroke-width="3"/>
    <rect x="56" y="46" width="148" height="6" fill="var(--c4)"/><rect x="56" y="46" width="6" height="148" fill="var(--c4)"/>
    <circle cx="130" cy="120" r="8" fill="var(--bad)"/><text x="130" y="216" text-anchor="middle" font-size="11" fill="var(--bad)">1.2 × 1.2 m, thin foam: boxy</text>
    <path d="M380 40 L600 52 L590 200 L380 200 Z" fill="var(--panel2)" stroke="var(--good)" stroke-width="3"/>
    <path d="M394 54 L586 66 L578 186 L394 186 Z" fill="var(--c4)" opacity=".35"/>
    <circle cx="470" cy="120" r="8" fill="var(--bad)"/><path d="M470 120 L540 120" stroke="var(--muted)" stroke-dasharray="3 3"/><text x="505" y="114" text-anchor="middle" font-size="9" fill="var(--muted)">facing into the room</text>
    <rect x="555" y="100" width="10" height="40" fill="var(--text)"/><text x="490" y="216" text-anchor="middle" font-size="11" fill="var(--good)">2.2 × 1.8 m, one splayed wall, 150 mm lining</text>
    <text x="295" y="125" text-anchor="middle" font-size="22" fill="var(--muted)">→</text>
  </svg>`;
  const M16 = {
    id: 'm-vo-booths', n: 'M16', track: 'master', title: 'Voice-over Booths', level: 'Core', mins: 35,
    summary: 'Spoken word is unforgiving: every reflection and every hum is audible. Sizes and shapes that avoid boxiness, deep acoustic control, a silent noise floor, and honest advice on closets, blanket forts and portable booths.',
    tags: ['voice-over', 'VO booth', 'boxy', 'NC 15', 'portable booth', 'mic placement', 'flutter'],
    sections: [
      { h: 'What a VO booth must deliver', html: `
        <p class="lead">A clean voice: no room sound, no boxy colour, no background noise. Voice-over is often compressed and loud in the mix, which raises everything else — noise floor and reflections — too.</p>
        <div class="uc-grid">
          ${uc('🎙️', 'Dry', [['Target', 'Room reflections ≥ 20 dB below the voice in the first 20 ms'], ['Why', 'Clients add their own space later']])}
          ${uc('🔈', 'Uncoloured', [['Target', 'No boxy peak 100–300 Hz'], ['Why', 'Boxiness cannot be EQ’d out cleanly']], 'var(--c3)')}
          ${uc('🤫', 'Silent', [['Target', 'NC 15 or lower'], ['Why', 'Compression lifts the noise floor 10–15 dB']], 'var(--good)')}
        </div>` },
      { h: 'Size and shape', html: `
        ${SVG_VO}
        <div class="table-wrap"><table><tr><th>Floor size</th><th>Verdict</th><th>Notes</th></tr>
          <tr><td>&lt; 1.2 × 1.2 m</td><td class="bad">Boxy unless extremely deep lining</td><td>Modes from ~140 Hz upward, mouth always close to a wall</td></tr>
          <tr><td>1.5 × 1.8 m</td><td class="warn">Workable with 100–150 mm broadband everywhere</td><td>Typical home build; keep height ≥ 2.1 m</td></tr>
          <tr><td>2 × 2.4 m and up</td><td class="good">Good</td><td>Room to keep the mic 60 cm from walls</td></tr></table></div>
        <p>Splaying one wall (5–10°) or making the booth trapezoidal helps flutter, but does not cure low-frequency boxiness — only volume and deep absorption do.</p>`, viz: 'boothSize' },
      { h: 'Acoustic control', html: `
        <ul><li><b>Deep broadband</b>: 100–150 mm mineral wool (≈ 40–60 kg/m³) with a 25–50 mm gap, on all walls and the ceiling; a rug or carpet on the floor.</li>
        <li><b>Low frequencies</b>: corner traps or thicker absorption in two corners; even small booths gain clarity from it.</li>
        <li><b>Mic position</b>: mouth 40–60 cm from the nearest wall, facing the longest dimension; mic’s dead side toward the door or window.</li>
        <li><b>Flutter</b>: any two bare parallel surfaces (door + opposite wall, glass + wall) will ring. Hear it below and break it.</li></ul>`, viz: (host) => V.flutter(host) },
      { h: 'Noise floor: the silent booth', html: `
        <div class="callout data">NC 15 is roughly 25 dBA — quieter than a library. Achieving it needs double-leaf walls (STC 50+), a sealed acoustic door, and ventilation with silencers and very low air speed (≤ 1.5 m/s at the grille).</div>
        <ul><li>Computers outside the booth; use a silent tablet or fanless screen and a remote keyboard.</li>
        <li>No mains transformers, fridges or dehumidifiers on the other side of a thin wall.</li>
        <li>LED lights with quiet drivers; test with the gain at your recording level.</li>
        <li>Ventilation: a fan in a separate box feeding a lined, baffled duct; switch it off only for takes if you must.</li></ul>` },
      { h: 'Home VO setups — honest verdicts', html: `
        <div class="uc-grid">
          ${uc('👕', 'Walk-in closet full of clothes', [['Works', 'Reasonable highs/mids absorption'], ['Doesn’t', 'Boxy low-mids if small; no isolation'], ['Fix', 'Add deep panels on the bare walls, face the clothes']])}
          ${uc('🛏️', 'Blanket fort / duvets on stands', [['Works', 'Cuts reflections behind the mic'], ['Doesn’t', 'Thin blankets do little below 500 Hz; no isolation'], ['Fix', 'Use moving blankets doubled + a bed/duvet behind you']], 'var(--c3)')}
          ${uc('📦', 'Portable/modular booth', [['Works', 'Consistent sound, some isolation (15–30 dB)'], ['Doesn’t', 'Small ones get boxy and hot'], ['Fix', 'Choose the largest that fits; add bass traps; ventilate']], 'var(--accent2)')}
          ${uc('🎧', 'Reflection filter on a mic stand', [['Works', 'Slightly less room behind the mic'], ['Doesn’t', 'Room reflections still reach the front of the mic'], ['Fix', 'Treat behind you first — that’s what the mic hears']], 'var(--warn)')}
          ${uc('🏠', 'Built-in booth', [['Works', 'Best isolation and sound if designed well'], ['Doesn’t', 'Expensive to fix if too small or unventilated'], ['Fix', 'Plan size, air and door first']], 'var(--good)')}
        </div>` },
      { h: 'Problems & solutions', html: `
        ${ps([['Boxy, cardboard voice', 'Booth too small, thin foam', 'Bigger booth or 150 mm broadband + corner traps'], ['Hollow / phasey', 'Mouth close to wall or glass', 'Mic 40–60 cm from walls; absorb the wall in front'], ['Hum or hiss in recordings', 'Computer fans, transformers, HVAC', 'Move computers out; silencers; quiet drivers'], ['Traffic rumble', 'Light booth walls, no floor isolation', 'Heavier walls, isolation pads, record at quiet times'], ['Echo on plosives', 'Flutter between parallel surfaces', 'Treat one surface of each pair']])}` },
      { h: 'Apply it', html: `
        ${flow([['Choose space', 'largest quiet corner'], ['Size', '≥ 1.5 × 1.8 × 2.1 m'], ['Walls & door', 'mass + seals'], ['Air', 'silenced, low speed'], ['Line it', '100–150 mm + gap'], ['Mic', '40–60 cm from walls'], ['Test', 'record, listen for boxiness & noise']])}
        <p>Tools: <a href="#/analyzer">Room Analyzer</a> · <a href="#/absorbers">Absorber Designer</a> · <a href="#/isolation">Soundproofing</a></p>` },
    ],
    quiz: [
      { q: 'Why is the noise floor so critical in VO?', opts: ['Voices are loud', 'Compression raises background noise along with the voice', 'Microphones are noisy', 'It isn’t'], a: 1, why: 'Heavy compression lifts quiet sounds — including the room noise.' },
      { q: 'A 1 × 1 m booth with thin foam usually sounds…', opts: ['Natural', 'Boxy', 'Too live', 'Perfect'], a: 1, why: 'Sparse low-mid modes and close reflections.' },
      { q: 'Where should the mic be?', opts: ['Touching the wall', 'Mouth 40–60 cm from the nearest wall', 'In a corner', 'Under a desk'], a: 1, why: 'Distance pushes comb-filter notches lower and weaker.' },
      { q: 'A reflection filter alone mainly fails because…', opts: ['It is too heavy', 'The mic still hears the room in front of it (behind the talker)', 'It adds bass', 'It causes hum'], a: 1, why: 'Most of what a cardioid mic picks up comes from its front — the wall behind you.' },
    ],
  };

  /* ======================================================================
     M17 — Foley & ADR
     ====================================================================== */
  const SVG_FOLEY = `<svg class="gsvg" viewBox="0 0 640 240" role="img" aria-label="Foley stage plan with pits">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">Foley stage: surface pits, prop storage and a dead, silent room</text>
    <rect x="30" y="30" width="580" height="190" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/>
    ${[['sand', 'var(--warn)'], ['gravel', 'var(--muted)'], ['water', 'var(--c3)'], ['concrete', 'var(--text)'], ['wood', 'var(--accent2)'], ['carpet', 'var(--c4)']].map(([n, c], i) => `<rect x="${50 + (i % 3) * 110}" y="${50 + Math.floor(i / 3) * 80}" width="96" height="66" fill="${c}" opacity=".35" stroke="${c}"/><text x="${98 + (i % 3) * 110}" y="${88 + Math.floor(i / 3) * 80}" text-anchor="middle" font-size="11">${n}</text>`).join('')}
    <rect x="400" y="50" width="190" height="70" fill="var(--panel)" stroke="var(--muted)"/><text x="495" y="88" text-anchor="middle" font-size="11" fill="var(--muted)">props & doors rig</text>
    <rect x="400" y="140" width="190" height="60" fill="var(--panel)" stroke="var(--c3)"/><text x="495" y="168" text-anchor="middle" font-size="11" fill="var(--c3)">picture screen + cue lights</text>
    <circle cx="210" cy="200" r="7" fill="var(--bad)"/><circle cx="300" cy="200" r="7" fill="var(--bad)"/><text x="255" y="216" text-anchor="middle" font-size="10">close & mid mics</text>
  </svg>`;
  const M17 = {
    id: 'm-foley', n: 'M17', track: 'master', title: 'Foley & ADR', level: 'Advanced', mins: 35,
    summary: 'Rooms for film and game sound: Foley stages with surface pits and props, ADR rooms that let actors match their on-set dialogue — both needing a near-silent noise floor and short, controlled decay.',
    tags: ['Foley', 'ADR', 'post-production', 'NC 15', 'surface pits', 'dialogue', 'picture'],
    sections: [
      { h: 'What Foley and ADR are', html: `
        <p class="lead"><b>Foley</b> is performing everyday sounds to picture — footsteps, cloth, props. <b>ADR</b> (automated dialogue replacement) is re-recording an actor’s lines in sync with the picture when the set recording is unusable.</p>
        <p>Both are recorded quietly and closely, then placed into the film’s mix. Any room sound, hum or air noise becomes part of every step and every line — so these rooms must be <b>silent and neutral</b>.</p>` },
      { h: 'The Foley stage', html: `
        ${SVG_FOLEY}
        <div class="uc-grid">
          ${uc('🪨', 'Pits', [['What', 'Recessed trays: sand, gravel, dirt, water, leaves'], ['Build', '100–200 mm deep, lined, drained (water), removable lids'], ['Tip', 'Isolate pits from the floor structure so footsteps don’t boom']])}
          ${uc('🧱', 'Surfaces', [['What', 'Concrete, tile, wood decking, metal, carpet, stairs'], ['Build', 'Panels 1 × 1 m or larger on a solid base'], ['Tip', 'Stairs and a real door frame are used constantly']], 'var(--accent2)')}
          ${uc('📦', 'Props', [['What', 'Cupboards full of shoes, fabrics, glass, keys, guns (fake)'], ['Build', 'Storage outside the recording area to keep the room dead'], ['Tip', 'Quiet shelving — nothing that rattles']], 'var(--c3)')}
        </div>
        <div class="callout data"><b>Targets:</b> NC 10–15, RT60 ≈ 0.2–0.3 s and flat, ceiling ≥ 3.5–4 m so overhead reflections are late and weak, floor area 30–60 m³+ for movement.</div>` },
      { h: 'The ADR room', html: `
        <ul><li><b>Perspective matching</b>: the actor’s new line must sound like the set — close or distant, indoors or out. Rooms are dead and neutral, with optional movable reflective panels to suggest small spaces.</li>
        <li><b>Picture & cues</b>: a large silent screen or projector behind glass; visual “beeps/streamers” and headphone cues so actors can sync.</li>
        <li><b>Mics</b>: a boom mic (matching the production mic) plus a lavalier position; both at the same perspective as on set.</li>
        <li><b>Comfort</b>: actors may spend hours; ventilation and light matter.</li></ul>
        <div class="callout warn">Projectors and display power supplies are classic noise sources. Put them in a booth behind glass or use a fanless display.</div>` },
      { h: 'Isolation and HVAC', html: `
        <p>Foley and ADR rooms usually need room-in-room construction, sound-lock doors and floated floors (footsteps and impacts are performed inside). HVAC must deliver plenty of air very quietly: large ducts, lined runs and silencers.</p>`, viz: 'ductNoise' },
      { h: 'Problems & solutions', html: `
        ${ps([['Footsteps boom', 'Pits on a resonant timber floor', 'Pits on a solid or floated mass base; damp the pit structure'], ['Hum on quiet props', 'Projector, LED drivers, ground loops', 'Projector in a booth, quiet drivers, balanced lines'], ['ADR sounds “studio-y”', 'Room too live or too dead vs set', 'Movable panels, matching mic, perspective by distance'], ['Air noise in recordings', 'Fast air, small grilles', 'Large low-velocity grilles, silencers, lined flex'], ['Props rattle in the room', 'Hard shelving inside', 'Storage outside or damped cabinets']])}` },
      { h: 'Apply it', html: `
        ${flow([['Define work', 'Foley, ADR or both'], ['Size & height', '≥ 3.5 m ceiling'], ['Isolation', 'room-in-room, sound lock'], ['Silent services', 'HVAC, picture, power'], ['Surfaces & pits', 'variety, isolated'], ['Treat', 'dead, flat, movable panels'], ['Test', 'NC, RT, sync workflow']])}
        <p>Tools: <a href="#/isolation">Soundproofing</a> · <a href="#/calc">Calculators</a> · <a href="#/absorbers">Absorber Designer</a></p>` },
    ],
    quiz: [
      { q: 'Foley is…', opts: ['Re-recording dialogue', 'Performing everyday sounds to picture', 'Mixing music', 'Measuring rooms'], a: 1, why: 'Footsteps, cloth and props performed in sync with the film.' },
      { q: 'Why are ADR rooms neutral and dead?', opts: ['To add reverb later and match the set perspective', 'To sound bigger', 'Because actors prefer it', 'To save money'], a: 0, why: 'The mixer adds the space that matches the scene.' },
      { q: 'Typical noise target for Foley/ADR?', opts: ['NC 40', 'NC 30', 'NC 10–15', 'NC 50'], a: 2, why: 'Quiet props and dialogue reveal any background noise.' },
      { q: 'Best place for a noisy projector?', opts: ['On the console', 'In a separate booth behind glass', 'Above the actor', 'Under the floor'], a: 1, why: 'Keeps fan noise out of the recording room.' },
    ],
  };

  /* ======================================================================
     M18 — Room treatment designs
     ====================================================================== */
  const qrdDepths = () => { const N = 7, f0 = 500; return P.wellDepths(P.qrdSequence(N), N, f0); };
  const SVG_FAMILY = `<svg class="gsvg" viewBox="0 0 640 220" role="img" aria-label="Treatment family overview">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">The treatment family, low to high frequency</text>
    <line x1="40" y1="190" x2="600" y2="190" stroke="var(--muted)"/>
    ${['63', '125', '250', '500', '1k', '2k', '4k'].map((f, i) => `<text x="${60 + i * 88}" y="206" text-anchor="middle" font-size="10" fill="var(--muted)">${f}</text>`).join('')}
    <rect x="50" y="40" width="190" height="22" rx="5" fill="var(--bad)" opacity=".75"/><text x="145" y="55" text-anchor="middle" font-size="10" fill="var(--panel)">Helmholtz (narrow)</text>
    <rect x="50" y="70" width="230" height="22" rx="5" fill="var(--accent2)" opacity=".75"/><text x="165" y="85" text-anchor="middle" font-size="10" fill="var(--panel)">membrane / panel</text>
    <rect x="90" y="100" width="510" height="22" rx="5" fill="var(--c4)" opacity=".75"/><text x="345" y="115" text-anchor="middle" font-size="10" fill="var(--panel)">deep broadband (200 mm + gap)</text>
    <rect x="200" y="130" width="300" height="22" rx="5" fill="var(--c3)" opacity=".75"/><text x="350" y="145" text-anchor="middle" font-size="10" fill="var(--panel)">slatted / diffsorber (absorb low, reflect high)</text>
    <rect x="300" y="160" width="300" height="22" rx="5" fill="var(--accent)" opacity=".75"/><text x="450" y="175" text-anchor="middle" font-size="10" fill="var(--accent-ink)">diffusers (QRD, skyline)</text>
  </svg>`;
  const M18 = {
    id: 'm-treat-designs', n: 'M18', track: 'master', title: 'Room Treatment Designs', level: 'Advanced', mins: 55,
    summary: 'Six families of treatment you can build: broadband absorbers, slatted absorbers, Helmholtz resonators, membrane absorbers, diffsorbers and diffusors — how each works, build recipes, where they go and the mistakes to avoid.',
    tags: ['broadband absorber', 'slat absorber', 'Helmholtz', 'membrane', 'diffsorber', 'QRD', 'skyline', 'polycylinder'],
    sections: [
      { h: 'Choosing the right tool', html: `
        ${SVG_FAMILY}
        <p>Each family works in a different frequency range and has a different side effect. Most good rooms combine three: deep broadband for the bulk, tuned devices for stubborn modes, and diffusion or slats to keep some life.</p>`, viz: 'absorbMech' },
      { h: '1 · Broadband porous absorbers', html: `
        <p><b>How</b>: air moves through fibres and loses energy as heat. Depth (plus air gap) sets the lowest frequency: about a quarter-wavelength is where they become very effective.</p>
        <div class="table-wrap"><table><tr><th>Build</th><th>Effective from about</th><th>Use</th></tr>
          <tr><td>50 mm wool, flat</td><td>500 Hz</td><td>Flutter control, booths (not alone)</td></tr>
          <tr><td>100 mm wool + 50 mm gap</td><td>200 Hz</td><td>First reflections, ceiling clouds</td></tr>
          <tr><td>200 mm + 100 mm gap</td><td>80–100 Hz</td><td>Rear walls, corners</td></tr>
          <tr><td>Superchunk / corner fill</td><td>60–80 Hz</td><td>Floor-to-ceiling corner bass traps</td></tr></table></div>
        <p><b>Recipe</b>: timber frame, mineral or glass wool 40–60 kg/m³ (σ ≈ 8–15 kPa·s/m²), breathable fabric (blow-through test), no plastic wrap facing the room.</p>`, viz: drawing(() => DR.panel({ w: 0.6, h: 1.2, d: 0.1, gap: 0.05 })) },
      { h: '2 · Broadband absorption with slats', html: `
        <p><b>How</b>: a porous absorber behind spaced slats. Gaps let low and mid frequencies through to the absorber (and add a resonant boost, like many small Helmholtz necks); the slat faces reflect and scatter highs. Result: deep absorption that does not kill the room’s top end.</p>
        <ul><li>Open area 10–25 %: more absorption at highs; 3–8 %: absorption shifts lower, highs reflected.</li>
        <li>Vary slat widths (e.g. 30/45/70 mm) to avoid a single tuned reflection pattern.</li>
        <li>Keep gaps ≥ 5–6 mm to avoid whistling and dust clogging.</li></ul>`, viz: drawing(() => DR.slot({ slat: 0.05, gap: 0.01, t: 0.018, D: 0.1, run: 0.6 })) },
      { h: '3 · Helmholtz resonators', html: `
        <div class="formula"><span class="lbl">Resonance</span>f₀ = (c / 2π) · √( S / (V · L′) ) &nbsp;— S neck area, V cavity volume, L′ neck length + end corrections</div>
        <p><b>How</b>: the air in a neck or hole bounces on the air spring of the cavity. Narrow-band and powerful — ideal for one stubborn mode, or (as a perforated/slotted panel over a cavity) for a band.</p>
        <p><b>Recipe</b>: perforated board (5–8 mm holes, 1–10 % open) or slats over a sealed cavity, 25–50 mm wool behind the face to widen the bandwidth. Seal every edge: leaks detune it. Build in the <a href="#/absorbers">Absorber Designer</a>.</p>` },
      { h: '4 · Membrane (panel) absorbers', html: `
        <div class="formula"><span class="lbl">Rule of thumb</span>f₀ ≈ 60 / √(m · d) &nbsp;(m in kg/m², d cavity depth in m; ≈ 50 with wool in the cavity)</div>
        <p><b>How</b>: a sealed limp or semi-rigid panel (3–9 mm plywood/MDF, vinyl membrane) on an air cavity. Mass on a spring — strong at 40–150 Hz from 100–200 mm depth.</p>
        <p><b>Place</b> where the target mode has high pressure: corners and the walls that mode runs between. <b>Mistakes</b>: panel glued to the frame on all sides (too stiff), leaks around edges, cavity crammed with wool against the panel (over-damped, shifts tuning).</p>`, viz: drawing(() => DR.membrane({ w: 0.6, h: 1.2, D: 0.15, tp: 0.006, wool: 0.05 })) },
      { h: '5 · Diffsorbers (hybrid surfaces)', html: `
        <p><b>How</b>: a reflective face with a pattern of holes or slots (often in a mathematical sequence) over an absorber. Low frequencies pass through and are absorbed; highs hit the face and are scattered rather than reflected as one beam.</p>
        <ul><li>Good where a room needs bass/mid absorption but sounds dull with plain fabric panels — rear walls of small control rooms, live-room side walls.</li>
        <li>Face: 3–6 mm hardwood/MDF/perforated metal; 15–30 % open; mix hole sizes.</li></ul>` },
      { h: '6 · Diffusors', html: `
        <p><b>How</b>: wells or blocks of different depth delay parts of the reflection so they re-radiate in many directions. Energy stays in the room but is spread in time and angle.</p>
        <div class="table-wrap"><table><tr><th>Type</th><th>Scatters</th><th>Range (typical)</th><th>Note</th></tr>
          <tr><td>QRD (1-D)</td><td>One plane</td><td>≈ 500 Hz – 4 kHz (depth & well width)</td><td>Classic rear-wall diffuser</td></tr>
          <tr><td>PRD</td><td>One plane, less specular</td><td>Similar</td><td>Different sequence</td></tr>
          <tr><td>Skyline (2-D)</td><td>Hemisphere</td><td>≈ 800 Hz – 5 kHz</td><td>Ceilings, rear walls</td></tr>
          <tr><td>Polycylinder</td><td>Wide, smooth</td><td>Broad; also absorbs low as a membrane</td><td>Large rooms, live rooms</td></tr></table></div>
        <div class="callout warn">Diffusers need distance: sit at least ~3 m from them, otherwise you hear a lumpy pattern instead of a diffuse field. In small rooms, absorption is often the better use of the wall.</div>
        <p>Below: a 7-well QRD for 500 Hz design frequency. Design your own in the <a href="#/diffusers">Diffuser Designer</a>.</p>`, viz: drawing(() => DR.qrd({ depths: qrdDepths(), w: 0.05, fin: 0.006, back: 0.012, periods: 2 })) },
      { h: 'Placement, problems & solutions', html: `
        ${ps([['Room dull yet boomy', 'Only thin porous panels', 'Swap some for deep broadband/traps; add slats or diffsorbers'], ['Tuned trap does nothing', 'Wrong position (pressure node) or leaky', 'Put it where the mode is loud — corners; seal edges'], ['Diffuser sounds “grainy”', 'Listener too close', 'Move it ≥ 3 m away or use absorption'], ['Slats whistle', 'Gaps too narrow / sharp edges', 'Wider gaps, rounded edges'], ['Panels rattle', 'Loose membranes, fixings', 'Glue blocks, foam tape, screws at proper spacing']])}
        ${flow([['Measure/predict', 'which bands, where'], ['Bulk', 'deep broadband + corners'], ['Targets', 'membrane or Helmholtz for 1–2 modes'], ['Life', 'slats, diffsorbers, diffusers'], ['Re-measure', 'adjust']])}
        <p>Tools: <a href="#/absorbers">Absorber Designer</a> · <a href="#/diffusers">Diffuser Designer</a> · <a href="#/workshop">Workshop builds</a> · <a href="#/treatment">Treatment Simulator</a></p>` },
    ],
    quiz: [
      { q: 'What mostly sets the lowest frequency of a porous absorber?', opts: ['Fabric colour', 'Depth plus air gap', 'Frame wood', 'Panel width'], a: 1, why: 'Air must be moving where the fibres are; deeper reaches lower.' },
      { q: 'Slats in front of an absorber mainly…', opts: ['Add isolation', 'Reflect/scatter highs while letting lows through', 'Stop bass', 'Make it lighter'], a: 1, why: 'Hybrid behaviour: deep absorption without deadening the top.' },
      { q: 'A membrane absorber is best placed…', opts: ['Where the target mode has high pressure (often corners)', 'In the middle of the ceiling always', 'Behind the listener’s head', 'Anywhere'], a: 0, why: 'Pressure-driven devices work where the mode’s pressure is high.' },
      { q: 'Why can diffusers be a poor choice in small rooms?', opts: ['They are too heavy', 'You need distance from them to hear a diffuse field', 'They absorb too much', 'They cause hum'], a: 1, why: 'Close up you hear the individual reflections, not diffusion.' },
      { q: 'Helmholtz resonators are…', opts: ['Broadband', 'Narrow-band, tuned by neck and cavity', 'Diffusers', 'Isolation devices'], a: 1, why: 'Mass of air in the neck on the cavity spring.' },
    ],
  };

  /* ======================================================================
     M19 — Flow resistivity & absorption coefficients
     ====================================================================== */
  const SVG_RIG = `<svg class="gsvg" viewBox="0 0 640 200" role="img" aria-label="Flow resistivity test rig">
    <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="700">A flow-resistivity rig: steady, slow air through a sample in a tube</text>
    <rect x="30" y="80" width="70" height="50" rx="8" fill="var(--text)"/><text x="65" y="110" text-anchor="middle" font-size="10" fill="var(--panel)">fan/pump</text>
    <rect x="120" y="88" width="70" height="34" rx="6" fill="var(--panel2)" stroke="var(--c3)" stroke-width="2"/><text x="155" y="109" text-anchor="middle" font-size="10" fill="var(--c3)">flow meter</text>
    <rect x="200" y="80" width="300" height="50" fill="none" stroke="var(--text)" stroke-width="2"/>
    <rect x="330" y="81" width="40" height="48" fill="var(--c4)" opacity=".75"/><text x="350" y="148" text-anchor="middle" font-size="10">sample (thickness t)</text>
    <path d="M100 105 H120 M190 105 H200" stroke="var(--text)" stroke-width="3"/>
    <path d="M300 80 V50 H400 V80" fill="none" stroke="var(--warn)" stroke-width="2"/><rect x="335" y="36" width="30" height="22" fill="var(--panel)" stroke="var(--warn)"/><text x="350" y="51" text-anchor="middle" font-size="10" fill="var(--warn)">Δp</text>
    <text x="350" y="182" text-anchor="middle" font-size="11" font-weight="700">σ = Δp · S / (Q · t)</text>
    <text x="560" y="110" text-anchor="middle" font-size="10" fill="var(--muted)">to open air →</text>
  </svg>`;
  const M19 = {
    id: 'm-flowres', n: 'M19', track: 'master', title: 'Gas Flow Resistivity & Absorption Coefficients in Practice', level: 'Advanced', mins: 40,
    summary: 'The one number that predicts how a porous material absorbs — what it is, how to test it (lab and home rig), which values to buy — and how to read absorption coefficients without being misled in small rooms.',
    tags: ['flow resistivity', 'ISO 9053', 'ASTM C522', 'absorption coefficient', 'NRC', 'small rooms', 'third-octave'],
    sections: [
      { h: 'What flow resistivity is', html: `
        <p class="lead">Flow resistivity (σ) measures how hard it is to push air through a material, per metre of thickness. Too open and air passes without much friction; too dense and the surface reflects instead of letting sound in.</p>
        ${myth([['“Denser insulation always absorbs better.”', 'Up to a point. Very dense boards reflect at mid/high frequencies; the best panels sit at a moderate σ for their thickness.'], ['“Any fluffy material works the same.”', 'Two products with the same density can differ 2–3× in σ, depending on fibre diameter.'], ['“Flow resistivity is only for labs.”', 'A simple home rig gives values good enough for design choices.']])}` },
      { h: 'How it is tested', html: `
        ${SVG_RIG}
        <ul><li><b>Lab method (ISO 9053 / ASTM C522)</b>: a very low, steady airflow passes through a cut sample sealed in a tube; the pressure drop and flow give σ. Air speed is kept tiny (millimetres per second) so the result matches acoustic conditions.</li>
        <li><b>DIY rig</b>: a small fan or aquarium pump, a flow meter (or a known-volume bag and a stopwatch), a 100 mm pipe with a sealed sample holder, and a sensitive manometer (inclined water tube or a digital differential pressure gauge).</li></ul>
        <div class="callout safety">Wear gloves, eye protection and a dust mask when cutting mineral or glass wool, and work in a ventilated space. Seal the sample edges in the holder — leaks around the sample make σ read far too low.</div>`, viz: 'flowRes' },
      { h: 'Typical values and how to choose', html: `
        <div class="table-wrap"><table><tr><th>Material</th><th>Approx. σ (kPa·s/m²)</th><th>Good for</th></tr>
          <tr><td>Polyester fibre 20–30 kg/m³</td><td>3–6</td><td>Thick layers (150 mm+), corner fills</td></tr>
          <tr><td>Glass wool 24–32 kg/m³</td><td>6–10</td><td>100–200 mm panels and traps</td></tr>
          <tr><td>Mineral wool 40–60 kg/m³</td><td>10–20</td><td>50–100 mm panels, clouds</td></tr>
          <tr><td>Rock wool slab 100+ kg/m³</td><td>25–50</td><td>Thin panels only; reflects if very thick</td></tr>
          <tr><td>Open-cell PU foam</td><td>5–15 (varies)</td><td>Booth linings, high-frequency control</td></tr></table></div>
        <div class="callout data"><b>Rule of thumb:</b> aim for a total layer resistance σ · t of about 1–4 ρc (≈ 400–1 600 Pa·s/m). Thin panel → choose higher σ; thick trap → choose lower σ.</div>`, viz: 'porous' },
      { h: 'Absorption coefficients — reading them right', html: `
        <ul><li>α is measured in a reverberation room on a large sample (≈ 6.7 m²) with a stated mounting. It is a random-incidence average over many directions.</li>
        <li><b>NRC</b> averages 250–2 000 Hz only. Two panels with the same NRC can differ hugely at 125 Hz.</li>
        <li>Values above 1.0 are a test artefact (edge diffraction). Use 1.0 in calculations.</li>
        <li>Always ask for full third-octave data, the mounting (A, E-400…) and the test standard.</li></ul>` },
      { h: 'Why α tables mislead in small rooms', html: `
        <p>Below roughly 200–300 Hz a small room is not a diffuse field — it is a few modes. An absorber’s effect then depends on <b>where</b> it is relative to each mode’s pressure (for porous: velocity) pattern, not just its α × area.</p>
        <div class="uc-grid">
          ${uc('📍', 'Placement beats α', [['Example', 'The same 2 m² trap in a corner vs mid-wall'], ['Result', 'Corner: much stronger effect on many modes'], ['Lesson', 'Use pressure maps (Room Predictor) to place']])}
          ${uc('📐', 'Area-weighted averages', [['Example', 'Room average α 0.4 from 30 % coverage'], ['Result', 'Fine for RT at mids, meaningless for one mode'], ['Lesson', 'Model modes separately (Treatment Simulator)']], 'var(--c3)')}
          ${uc('🧪', 'Lab vs room', [['Example', 'α 0.9 at 125 Hz in the lab report'], ['Result', 'Small panels on a wall rarely reach it'], ['Lesson', 'Expect less; measure the room']], 'var(--warn)')}
        </div>
        ${ps([['Panels bought by NRC do nothing for bass', 'NRC ignores 125 Hz and below', 'Choose by third-octave data at 63–125 Hz; go deeper'], ['DIY panel performs worse than expected', 'σ too high/low for the thickness, leaks, plastic facing', 'Measure σ, pick density for thickness, breathable fabric'], ['RT prediction wrong at lows', 'Diffuse-field formula in a modal room', 'Use modal tools below the Schroeder frequency']])}` },
      { h: 'Apply it', html: `
        ${flow([['Target band', 'where is the problem?'], ['Thickness', 'from quarter-wave guide'], ['σ', 'match to thickness'], ['Test', 'rig or datasheet'], ['Predict', 'Absorber Designer'], ['Place', 'by mode map'], ['Verify', 'measure the room']])}
        <p>Tools: <a href="#/absorbers">Absorber Designer</a> · <a href="#/treatment">Treatment Simulator</a> · <a href="#/predict">Room Predictor</a> · <a href="#/materials">Materials Library</a></p>` },
    ],
    quiz: [
      { q: 'Flow resistivity describes…', opts: ['How heavy a material is', 'How hard it is to push air through it per metre', 'Its fire rating', 'Its stiffness'], a: 1, why: 'It controls the friction losses in porous absorbers.' },
      { q: 'For a thick (200 mm) trap you should prefer…', opts: ['Very high σ', 'Lower σ', 'Any σ', 'Closed-cell foam'], a: 1, why: 'Total resistance σ·t should stay moderate.' },
      { q: 'Why does NRC mislead for studios?', opts: ['It includes 63 Hz', 'It ignores frequencies below 250 Hz', 'It is in dB', 'It is measured in rooms'], a: 1, why: 'Small-room problems are mostly below 250 Hz.' },
      { q: 'Below ~200 Hz in a small room, absorber effect depends strongly on…', opts: ['Colour', 'Placement relative to modes', 'Fabric brand', 'Room temperature'], a: 1, why: 'The field is modal, not diffuse.' },
    ],
  };

  [M13, M14, M15, M16, M17, M18, M19].forEach((L) => window.LESSONS.push(L));
})();
