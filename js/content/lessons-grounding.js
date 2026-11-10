/* ==========================================================================
   Academy — "Hum, Buzz & Grounding" (audio track).
   Practical course on ground loops, pin-1 problems, dimmer buzz and zero
   loop area wiring. Concepts after J. H. Brandt’s tech note on grounding,
   Brandt & Sauro, Whitlock & Fox, Muncy (1995) and AES48 — in our own words.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${k === 'Fix' || k === 'Proper fix' ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  /* ---------- diagrams (inline SVG, theme-aware) ---------- */
  const SVG_SAFETY = `<svg class="gsvg" viewBox="0 0 640 210" role="img" aria-label="Fault current path through the safety earth">
    <defs><marker id="gar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--bad)"/></marker></defs>
    <rect x="20" y="40" width="120" height="120" rx="10" fill="var(--panel2)" stroke="var(--line)"/><text x="80" y="64" text-anchor="middle" font-size="13" font-weight="700">Electrical panel</text>
    <rect x="44" y="80" width="72" height="26" rx="5" fill="var(--panel)" stroke="var(--warn)"/><text x="80" y="98" text-anchor="middle" font-size="11">breaker</text>
    <text x="80" y="140" text-anchor="middle" font-size="11" fill="var(--muted)">earth bar</text>
    <line x1="140" y1="92" x2="470" y2="92" stroke="#a0522d" stroke-width="4"/><text x="300" y="84" text-anchor="middle" font-size="11">line (live)</text>
    <line x1="140" y1="118" x2="470" y2="118" stroke="#3b6fd8" stroke-width="4"/><text x="300" y="112" text-anchor="middle" font-size="11">neutral</text>
    <line x1="140" y1="146" x2="470" y2="146" stroke="#2e9e48" stroke-width="4" stroke-dasharray="8 4"/><text x="300" y="164" text-anchor="middle" font-size="11">safety earth (ground)</text>
    <rect x="470" y="50" width="150" height="120" rx="10" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><text x="545" y="74" text-anchor="middle" font-size="13" font-weight="700">Amplifier</text><text x="545" y="90" text-anchor="middle" font-size="10" fill="var(--muted)">metal case</text>
    <path d="M520 92 L540 110 L528 112 L548 132" stroke="var(--bad)" stroke-width="3" fill="none"/><text x="560" y="118" font-size="10" fill="var(--bad)">fault</text>
    <path d="M520 146 C 420 190, 260 190, 150 150" stroke="var(--bad)" stroke-width="2.5" fill="none" marker-end="url(#gar)"/>
    <text x="330" y="202" text-anchor="middle" font-size="11" fill="var(--bad)" font-weight="700">fault current returns on the earth wire → breaker trips in milliseconds</text>
    <text x="320" y="24" text-anchor="middle" font-size="12" font-weight="700">If a live wire touches the case, the earth carries the fault home and the breaker trips.</text>
  </svg>`;

  const SVG_TRANSFORMER = `<svg class="gsvg" viewBox="0 0 640 170" role="img" aria-label="Premises wiring behaves like a transformer">
    <rect x="20" y="30" width="600" height="110" rx="12" fill="var(--panel2)" stroke="var(--line)"/>
    <path d="M40 70 H600" stroke="#a0522d" stroke-width="5"/><path d="M40 110 H600" stroke="#3b6fd8" stroke-width="5"/>
    <path d="M40 92 H600" stroke="#2e9e48" stroke-width="3" stroke-dasharray="8 4"/>
    ${[100, 200, 300, 400, 500].map((x) => `<ellipse cx="${x}" cy="70" rx="14" ry="22" fill="none" stroke="var(--bad)" opacity=".45"/><ellipse cx="${x}" cy="110" rx="14" ry="22" fill="none" stroke="var(--bad)" opacity=".45"/>`).join('')}
    <text x="48" y="62" font-size="11">line — 10 A out →</text><text x="48" y="128" font-size="11">neutral — 10 A back ←</text><text x="470" y="88" font-size="11" fill="#2e9e48" font-weight="700">ground: a “secondary winding”</text>
    <text x="320" y="20" text-anchor="middle" font-size="12" font-weight="700">Every power circuit is a weak transformer: load current induces a voltage on the ground wire.</text>
    <text x="320" y="160" text-anchor="middle" font-size="11" fill="var(--muted)">More metres, more amps, faster current changes (dimmers) → more ground voltage. Centred or twisted → far less.</text>
  </svg>`;

  const plan = (title, zero) => `<svg class="gsvg" viewBox="0 0 320 230" role="img" aria-label="${title}">
    <text x="160" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="${zero ? 'var(--good)' : 'var(--bad)'}">${title}</text>
    <rect x="10" y="26" width="300" height="190" rx="8" fill="none" stroke="var(--line)" stroke-width="2"/>
    <rect x="22" y="150" width="54" height="48" rx="4" fill="var(--panel2)" stroke="#2e9e48"/><text x="49" y="178" text-anchor="middle" font-size="9">panel</text>
    <rect x="236" y="40" width="62" height="34" rx="4" fill="var(--panel2)" stroke="var(--text)"/><text x="267" y="61" text-anchor="middle" font-size="9">stage rack</text>
    <rect x="236" y="168" width="62" height="34" rx="4" fill="var(--panel2)" stroke="var(--text)"/><text x="267" y="189" text-anchor="middle" font-size="9">console</text>
    ${zero
      ? `<path d="M76 168 H190 V57 H236" stroke="#2e9e48" stroke-width="3" fill="none" stroke-dasharray="6 3"/><path d="M76 180 H236" stroke="#2e9e48" stroke-width="3" fill="none" stroke-dasharray="6 3"/>
         <path d="M196 62 V176 H236" stroke="var(--accent)" stroke-width="3" fill="none"/><path d="M196 62 H236" stroke="var(--accent)" stroke-width="3"/>
         <path d="M190 57 H236 V62 H196 V176 H236 V180 H76 V168 H190z" fill="var(--good)" opacity=".18"/>
         <text x="92" y="110" font-size="10" fill="var(--good)">audio runs right</text><text x="92" y="123" font-size="10" fill="var(--good)">beside the power</text><text x="92" y="136" font-size="10" fill="var(--good)" font-weight="700">→ loop area ≈ 0</text>`
      : `<path d="M76 160 H120 V57 H236" stroke="#2e9e48" stroke-width="3" fill="none" stroke-dasharray="6 3"/><path d="M76 190 H236" stroke="#2e9e48" stroke-width="3" fill="none" stroke-dasharray="6 3"/>
         <path d="M267 74 V100 H160 V140 H267 V168" stroke="var(--accent)" stroke-width="3" fill="none"/>
         <path d="M120 57 H236 V74 H267 V100 H160 V140 H267 V168 H236 V190 H76 V160 H120z" fill="var(--bad)" opacity=".16"/>
         <text x="128" y="122" font-size="10" fill="var(--bad)">big loop between</text><text x="128" y="134" font-size="10" fill="var(--bad)">audio and power routes</text>`}
    <text x="20" y="226" font-size="9" fill="var(--muted)">— audio trunk   - - power feeds (with ground)</text>
  </svg>`;

  const SVG_BALANCED = `<svg class="gsvg" viewBox="0 0 640 170" role="img" aria-label="How a balanced line rejects noise">
    <rect x="20" y="40" width="110" height="90" rx="8" fill="var(--panel2)" stroke="var(--text)"/><text x="75" y="64" text-anchor="middle" font-size="12" font-weight="700">Output</text><text x="75" y="84" text-anchor="middle" font-size="10" fill="var(--muted)">+ signal on hot</text><text x="75" y="98" text-anchor="middle" font-size="10" fill="var(--muted)">− signal on cold</text>
    <rect x="510" y="40" width="110" height="90" rx="8" fill="var(--panel2)" stroke="var(--text)"/><text x="565" y="64" text-anchor="middle" font-size="12" font-weight="700">Input</text><text x="565" y="84" text-anchor="middle" font-size="10" fill="var(--muted)">hot − cold</text><text x="565" y="98" text-anchor="middle" font-size="10" fill="var(--good)">signal ×2, noise ×0</text>
    <path d="M130 70 ${Array.from({ length: 12 }, (_, i) => `Q ${150 + i * 30} ${i % 2 ? 100 : 60} ${160 + i * 30} 85`).join(' ')} L510 70" stroke="var(--accent)" stroke-width="3" fill="none"/>
    <path d="M130 100 ${Array.from({ length: 12 }, (_, i) => `Q ${150 + i * 30} ${i % 2 ? 60 : 110} ${160 + i * 30} 85`).join(' ')} L510 100" stroke="var(--c3)" stroke-width="3" fill="none"/>
    <path d="M130 124 H510" stroke="var(--muted)" stroke-width="2" stroke-dasharray="3 3"/><text x="320" y="142" text-anchor="middle" font-size="10" fill="var(--muted)">shield → chassis at both ends (pin 1, AES48)</text>
    <text x="320" y="24" text-anchor="middle" font-size="12" font-weight="700">Noise lands equally on both twisted wires; the input only listens to the difference.</text>
    <text x="320" y="162" text-anchor="middle" font-size="10" fill="var(--muted)">Common-mode rejection (CMRR) of 60–90 dB is typical — when source and input impedances are well matched.</text>
  </svg>`;

  const L = {
    id: 'a-ground', n: 'A8A', track: 'audio', title: 'Hum, Buzz & Grounding: Ground Loops and Zero Loop Area Wiring', level: 'Core', mins: 45,
    summary: 'Why systems hum, where the noise really comes from, how to find it in minutes and how to wire so it never appears — with ten real-world recipes and no unsafe tricks.',
    tags: ['ground loop', 'hum', 'buzz', 'pin 1', 'AES48', 'zero loop area', 'balanced', 'dimmer', 'technical power', 'isolation transformer'],
    sections: [
      { h: 'What you hear, and what it tells you', html: `
        <p class="lead">Almost every “mystery noise” in a sound system is one of four sounds. Learn to recognise them and you already know where to look.</p>
        ${flow([['Hear it', 'hum, 2× hum, buzz or whine'], ['Isolate it', 'unplug one thing at a time'], ['Name the mechanism', 'loop, magnetic, pin 1, dimmer, USB'], ['Fix the cause', 'not the symptom'], ['Keep it safe', 'safety earth stays connected']])}
        <div class="callout safety">Mains electricity kills. Nothing in this course requires opening an electrical panel, removing an earth pin or using a “ground-lift” plug adapter. Building wiring changes are for a licensed electrician; your job is to know what to ask for.</div>`, viz: 'humSounds' },
      { h: 'Ground’s real job is safety', html: `
        <p>The green/yellow (or green, or bare) wire in every power cable exists so that if a live wire touches a metal case, a big current flows home and the breaker trips immediately. That is the whole reason it exists.</p>
        ${SVG_SAFETY}
        <p>Because the earth wire is bonded to every metal box, rack and chassis, it also becomes the reference that audio shields connect to. Noise problems start when <b>small voltages appear between different points of that ground</b> — and those small voltages get into the audio.</p>
        ${myth([
          ['“The ground is dirty — something is leaking current into it.”', 'Leakage is usually tiny. Most ground voltage is <b>induced magnetically</b> by the current in the power wiring itself.'],
          ['“Lift the earth pin and the hum goes away, so that’s the fix.”', 'It removes the hum <i>and your protection</i>. A fault can then make the chassis — and the microphone in a singer’s hand — live.'],
          ['“A dedicated ground rod gives a quieter ground.”', 'An isolated rod creates a <b>second</b> ground with a different voltage, and it is unsafe/illegal in most codes. All earths must be bonded together.'],
          ['“Better (more expensive) cables will fix hum.”', 'Only if the old cable was broken. Hum is a <b>system</b> problem: loop area, power wiring and equipment design.'],
          ['“Cable shields block hum.”', 'Shields stop electric fields and radio. They do almost nothing to 50/60 Hz <b>magnetic</b> fields — copper would need to be ~8–9 mm thick.'],
        ])}` },
      { h: 'Where ground voltage comes from: the cable is a transformer', html: `
        <p>When current flows out on the line wire and back on the neutral, each wire is surrounded by a magnetic field. The ground wire sits in that field. If it is closer to one conductor than the other, the fields don’t cancel at its position, and a voltage is induced along it — just like the secondary winding of a transformer.</p>
        ${SVG_TRANSFORMER}
        <div class="callout data"><b>Rules of thumb</b><ul style="margin:.3em 0 0;padding-left:18px">
          <li>Ground voltage grows with <b>length × current × frequency</b>. Double any of them → +6 dB of noise.</li>
          <li>A ground wire exactly <b>midway</b> between line and neutral picks up almost nothing.</li>
          <li><b>Twisting</b> line and neutral together typically cuts it by around 1 000× (≈ 60 dB).</li>
          <li><b>Dimmers and LED drivers</b> switch current in microseconds; the fast change induces strong harmonics — that is the <i>buzz</i>.</li></ul></div>
        <p>Drag the ground wire around the cable below, change the load and try twisting.</p>`, viz: 'conduitField' },
      { h: 'Ground loops: a loop is an antenna', html: `
        <p>Connect two pieces of gear with an audio cable and you have joined their grounds twice — once through the cable shield, once through the power wiring back at the panel. Together they form a <b>loop</b>. Any stray mains magnetic field passing through that loop induces a voltage around it, and current flows in the shield.</p>
        <div class="formula"><span class="lbl">Voltage induced in a loop</span>EMF = 2π · f · B · A &nbsp;&nbsp;(A = loop area, B = magnetic field)</div>
        <div class="callout example">In a field of just 1 µT at 60 Hz, a loop of 20 m² (audio cable 10 m from the power route over a 2 m run… or 2 m from it over 10 m) induces about 7.5 mV. Pull the same cable in beside the power so the loop is 0.3 m², and it falls to about 0.1 mV — roughly <b>36 dB quieter</b>, with no change of equipment.</div>
        <p>So the most powerful tool you have is not a gadget — it is the <b>route</b> of the cable. Halve the loop area → 6 dB less hum. Try the scenarios: then re-route them.</p>`, viz: 'groundLoop' },
      { h: 'Zero loop area wiring — route audio with the power', html: `
        <p>“Zero loop area” wiring (a term from Neil Muncy’s work) means arranging cables so the audio shields and the power grounds that feed the same gear <b>run side by side</b>. If there’s no area between them, there’s nothing for a magnetic field to pass through.</p>
        <div class="ba-svg">${plan('Conventional: separate routes', false)}${plan('Zero loop area: audio beside power', true)}</div>
        ${flow([['Plan power first', 'one technical-power source for the audio system'], ['Pair the routes', 'audio conduit/trunk beside the power conduit feeding the same racks'], ['Feed from the front', 'console power and audio arrive together'], ['Tight bundles', 'at patch bays, stage boxes and extension points'], ['Keep magnets away', 'transformers ≥ 1 m from unbalanced lines']])}
        <div class="callout mentor">On a gig you can apply the same idea in minutes: run the multicore or stage-box cable and the FOH power cable <b>taped together</b> along the same path, and power FOH from the stage distro instead of a random wall socket at the back of the hall.</div>` },
      { h: 'Balanced lines — and why they are not magic', html: `
        ${SVG_BALANCED}
        <p>A balanced connection sends the signal on two twisted wires and the receiver listens only to their <b>difference</b>. Noise that lands equally on both is rejected. This is why professional systems use XLR/TRS everywhere.</p>
        <ul><li><b>Twisting</b> is what rejects magnetic fields — each twist reverses the pickup.</li>
        <li><b>CMRR</b> (how well the input rejects common noise) depends on the real source and cable impedances, not the brochure number. Transformer inputs keep high CMRR even with imperfect sources.</li>
        <li><b>Unbalanced</b> links (RCA, TS, 3.5 mm) use the shield as the return conductor, so any ground voltage is added straight into the signal. Keep them short and local, or convert to balanced at the source.</li></ul>
        <div class="callout warn"><b>“Connect the shield at one end only.”</b> It can quieten a loop, but it is a workaround, not a cure: the cable now leaks RF in, interference can get worse at high frequencies, and the problem returns as soon as someone swaps the cable. Fix the loop area or the equipment instead — and use a DI or isolation transformer when you must break a loop at the signal level.</div>` },
      { h: 'Inside the gear: the pin-1 problem', html: `
        <p>Even with balanced cables, a lot of equipment hums because of how it was built. If the cable shield (XLR pin 1) is connected to the circuit board’s ground instead of the metal chassis, shield current flows through the same thin copper that the audio circuits use as their 0 V reference. A few millivolts of noise then appear <i>inside</i> the box, where no balanced input can reject them.</p>
        <p>The cure, standardised as <b>AES48</b>, is simple: bond pin 1 to the chassis right at the connector, so shield current goes around the outside of the circuit to the safety earth.</p>`, viz: 'pin1' },
      { h: 'Testing gear: the Hummer test and friends', html: `
        <ol><li><b>Hummer test</b> (after Bill Whitlock): a small, current-limited low-voltage AC source (a few hundred mA from a small transformer through a resistor and lamp) is connected between pin 1 of an input/output and the chassis. If you hear hum on the output, the device has a pin-1 problem. Build one only if you are competent with low-voltage electronics, or buy a ready-made tester.</li>
        <li><b>Swap test</b>: move the same cable to another channel or another device — does the noise follow the gear or the cable?</li>
        <li><b>Battery test</b>: run a laptop on battery, or a recorder on batteries. If the noise disappears, it was coming through the power/ground path.</li>
        <li><b>Outlet tester</b>: a cheap plug-in tester shows reversed polarity or a missing earth — both common causes of noise and serious safety faults.</li></ol>
        <div class="callout safety">If an outlet tester shows a missing earth or reversed wiring, stop using that outlet and call an electrician. Do not “fix” it with adapters.</div>` },
      { h: 'Magnetic neighbours: wall-warts, bricks and transformers', html: `
        <p>Power transformers leak 50/60 Hz magnetic fields. They fall off very fast — with the <b>cube</b> of distance — so the cure is almost always to move them. Shielded cable will not help; distance, rotation and twisted-pair balanced connections will.</p>
        <div class="callout data">Moving a power supply from 30 cm to 1 m from an unbalanced input gives about <b>31 dB</b> less hum. Pedalboard tip: mount the supply at the far end from the guitar input and the amp’s input jack.</div>`, viz: 'wallWart' },
      { h: 'Hum Detective — find it in minutes', html: `
        <p>Work through the questions. The order matters: start with what you can change for free (routing and power), and only then buy hardware.</p>`, viz: 'humDetective' },
      { h: 'Ten real-world recipes', html: `
        <div class="uc-grid">
          ${uc('🎧', 'Home studio: interface → powered monitors', [['Symptom', 'Low hum from monitors, worse when the laptop charges'], ['Cause', 'Laptop charger and monitors on different sockets; unbalanced RCA leads'], ['Fix', 'Everything on one power strip; balanced TRS → XLR leads; earthed charger on the same strip'], ['If still there', 'USB isolator, or a passive DI / line isolator on the outputs']])}
          ${uc('🎸', 'Guitar rig & pedalboard', [['Symptom', 'Hum rises when you face the amp or near the board’s power supply'], ['Cause', 'Magnetic pickup: single-coil pickups and transformers'], ['Fix', 'Isolated-output pedal supply at the far end of the board; turn to the quiet angle; 1 m from amp transformers'], ['Proper fix', 'Shielded guitar cavities, humbuckers, DI with ground lift to FOH']], '#c7772b')}
          ${uc('🎤', 'Live band: stage ↔ front of house', [['Symptom', 'Buzz in the PA as soon as the multicore is connected'], ['Cause', 'FOH powered from the back of the hall, stage from another phase: a 40 m loop'], ['Fix', 'Power FOH from the stage distro; run the FOH power cable taped to the multicore'], ['Proper fix', 'Digital snake over fibre/Cat (breaks the loop); AES48 gear']])}
          ${uc('⛪', 'Church / school hall with stage lighting', [['Symptom', 'Buzz that changes when the lights are dimmed'], ['Cause', 'Phase-cut dimmers + audio cables run alongside lighting circuits'], ['Fix', 'Separate audio and lighting routes; cross at 90°; audio on its own circuit'], ['Proper fix', 'Electrician: twisted L-N lighting feeds; filtered/sine-wave dimmers; technical power for audio']], '#7a5cc7')}
          ${uc('📽️', 'Conference room: AV rack → ceiling projector', [['Symptom', 'Hum bars on video, hum in ceiling speakers'], ['Cause', 'Projector earthed at the ceiling, rack in a cupboard on another circuit'], ['Fix', 'Run the HDMI/HDBaseT and projector power together; feed both from the rack’s circuit'], ['Proper fix', 'HDBaseT/fibre extenders that isolate grounds; balanced audio to amps']])}
          ${uc('🎚️', 'DJ booth', [['Symptom', 'Hum when the DJ’s laptop connects to the club mixer'], ['Cause', 'Laptop + mixer + booth amps on different sockets; RCA everywhere'], ['Fix', 'One booth power strip for all DJ gear; balanced mixer outputs to the system'], ['Quick save', 'Stereo DI / isolator between laptop interface and mixer']], '#d14b8f')}
          ${uc('📺', 'Home cinema / hi-fi with cable TV', [['Symptom', 'Hum only when the TV coax is plugged in'], ['Cause', 'Coax earthed at the street/building entry: a whole-house loop'], ['Fix', 'Coax ground (sheath-current) isolator at the TV/box'], ['Alternative', 'Optical audio from TV to receiver']])}
          ${uc('🎙️', 'Podcast / streaming desk', [['Symptom', 'Whine that changes with screen activity'], ['Cause', 'USB ground noise from the computer and charger'], ['Fix', 'Charger in the same strip as the interface; short USB; ferrites; powered USB hub with isolation'], ['Proper fix', 'Interface with balanced outs; avoid unbalanced aux inputs']], '#2b9fc7')}
          ${uc('🚐', 'Broadcast truck / outside broadcast', [['Symptom', 'Hum when patching the truck to the venue system'], ['Cause', 'Truck generator earth vs venue earth: two power systems'], ['Fix', 'Isolation transformers on every analogue tie line; digital/fibre ties'], ['Rule', 'Never disconnect the truck’s safety earth bond — ask the venue electrician']], '#4c9a3a')}
          ${uc('🏟️', 'Stadium or large install (field case)', [['Symptom', 'Hundreds of millivolts between ground points across the building'], ['Cause', 'Long feeders, high current, untwisted conductors'], ['Fix', 'Twisting the line and neutral conductors of the feeders'], ['Result', 'Ground voltage reported to fall from ≈ 650 mV to under 3 mV (≈ 47 dB)']], '#c7a12b')}
        </div>` },
      { h: 'New build checklist (hand this to your electrician & integrator)', html: `
        <div class="table-wrap"><table><tr><th>#</th><th>Do this</th><th>Why</th></tr>
          <tr><td>1</td><td>Twist line and neutral (and keep each circuit’s conductors together) for every circuit sharing a conduit or tray with audio</td><td>Removes most induced ground voltage</td></tr>
          <tr><td>2</td><td>Run audio trunks beside the power feeding the same equipment; feed the console from the front</td><td>Zero loop area</td></tr>
          <tr><td>3</td><td>No neutral–ground bonds downstream of the main/service point; test every outlet</td><td>Stray neutral current on the ground is a big noise source — and a code violation</td></tr>
          <tr><td>4</td><td>Technical power for audio, separate from lighting/HVAC; balanced (symmetrical) power only where the electrical code allows it (e.g. NEC Art. 647)</td><td>Keeps dimmer and motor noise off audio grounds</td></tr>
          <tr><td>5</td><td>Choose cable whose drain wire is wound with the pair or which has no drain; braid or good foil shields</td><td>Avoids shield-current-induced noise</td></tr>
          <tr><td>6</td><td>Specify AES48-compliant equipment; Hummer-test anything doubtful before install</td><td>Prevents pin-1 problems</td></tr>
          <tr><td>7</td><td>Avoid unbalanced interconnects; where unavoidable keep them short and in one rack</td><td>Unbalanced = no rejection</td></tr>
          <tr><td>8</td><td>Keep transformers, wall-warts and dimmer racks ≥ 1 m from audio inputs</td><td>1/r³ magnetic falloff</td></tr>
          <tr><td>9</td><td>Follow IEEE 1100 and your local electrical code; never isolated ground rods</td><td>Safety and a single ground reference</td></tr></table></div>
        <div class="callout alt"><b>Your hum toolkit:</b> outlet tester · cable tester · 2 passive DI boxes with ground-lift (signal shield only) · a stereo line isolation transformer · coax ground isolator · USB isolator · clip-on ferrites · gaffer tape (to bundle audio and power). <b>Never carry “cheater” ground-lift plug adapters.</b></div>` },
      { h: 'Further reading', html: `
        <ul class="small"><li>J. H. Brandt — technical note on grounding, ground loops and zero loop area wiring; and Brandt &amp; Sauro on technical power and grounding.</li>
          <li>N. Muncy (1995), “Noise susceptibility in analog and digital signal processing systems”, <i>J. Audio Eng. Soc.</i> 43(6) — the pin-1 problem and shield-current-induced noise.</li>
          <li>AES48 — interconnections, grounding and EMC for balanced audio equipment.</li>
          <li>B. Whitlock &amp; R. Fox — grounding and interfacing articles and seminars; Rane Notes 110 &amp; 151.</li>
          <li>H. Ott — <i>Electromagnetic Compatibility Engineering</i>; IEEE Std 1100 (“Emerald Book”); NEC Article 647.</li></ul>` },
    ],
    quiz: [
      { q: 'What is the primary purpose of the ground (earth) wire?', opts: ['A quiet reference for audio', 'Carrying fault current so the breaker trips', 'Draining static from cables', 'Reducing hum'], a: 1, why: 'Ground is for safety first. Audio uses it as a reference, which is why we never lift it.' },
      { q: 'Where does most ground voltage in a building come from?', opts: ['Leakage from appliances', 'Lightning', 'Magnetic induction from current in the power wiring', 'Bad ground rods'], a: 2, why: 'The line/neutral current induces a voltage along the ground wire, like a transformer secondary.' },
      { q: 'You halve the area of a ground loop. The induced hum…', opts: ['falls by 3 dB', 'falls by 6 dB', 'is unchanged', 'rises'], a: 1, why: 'EMF = 2π·f·B·A, so halving A halves the voltage: −6 dB.' },
      { q: 'A guitar amp hums near the pedalboard’s power brick. Best first step?', opts: ['Use a more expensive shielded cable', 'Move the brick ≥ 1 m away or rotate it', 'Lift the amp’s earth pin', 'Turn up the noise gate'], a: 1, why: 'Magnetic fields fall with the cube of distance; shields do not stop them. Never lift the earth.' },
      { q: 'A console hums with balanced cables, and the hum grows with the number of inputs connected. Likely cause?', opts: ['Phantom power', 'Pin-1 problem in the console', 'Wrong sample rate', 'Too much reverb'], a: 1, why: 'Shield current flowing on the board ground adds noise per input — balanced cables cannot reject it.' },
      { q: 'Lights on a dimmer make the PA buzz. Which is a proper (permanent) fix?', opts: ['Shield the speakers', 'Twisted line/neutral feeds and separate routes/circuits for audio', 'Connect a ground rod to the mixer', 'Use a higher sample rate'], a: 1, why: 'Fast dimmer current induces harmonics; twisting and separation remove the coupling.' },
    ],
  };

  const i = window.LESSONS.findIndex((l) => l.id === 'a-amps');
  window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L);
})();
