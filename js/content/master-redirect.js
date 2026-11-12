/* ==========================================================================
   Master Class M18B — Sound redirectors (angled reflectors / deflectors)
   and absorbers: how to calculate and design them.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const fg = (w, a1, a2, deg) => Math.round((343 * ((2 * a1 * a2) / (a1 + a2))) / (2 * Math.pow(w * Math.cos((deg * Math.PI) / 180), 2)));

  const SVG_FOUR = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Four things a surface can do with sound">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Four things a surface can do with a reflection</text>
    ${[['Reflect', 'flat hard wall', 'bad', 0], ['Redirect', 'angled hard panel', 'warn', 1], ['Absorb', 'porous / tuned trap', 'good', 2], ['Diffuse', 'uneven surface', 'c3', 3]].map(([t, s, c, i]) => { const x = 20 + i * 165; return `<g>
      <rect x="${x}" y="30" width="150" height="110" rx="8" fill="var(--panel2)" stroke="var(--line)"/>
      ${i === 1 ? `<line x1="${x + 40}" y1="44" x2="${x + 120}" y2="64" stroke="var(--accent2)" stroke-width="6"/>` : i === 2 ? `<rect x="${x + 30}" y="38" width="90" height="14" fill="var(--c4)"/>` : i === 3 ? Array.from({ length: 9 }, (_, k) => `<rect x="${x + 30 + k * 10}" y="38" width="8" height="${6 + ((k * 3) % 5) * 3}" fill="var(--accent2)"/>`).join('') : `<line x1="${x + 30}" y1="42" x2="${x + 120}" y2="42" stroke="var(--text)" stroke-width="6"/>`}
      <path d="M${x + 30} 125 L${x + 75} ${i === 1 ? 56 : 48}" stroke="var(--accent)" stroke-width="2.5"/>
      ${i === 0 ? `<path class="leak-pulse" d="M${x + 75} 46 L${x + 120} 125" stroke="var(--bad)" stroke-width="2.5"/>` : i === 1 ? `<path class="leak-pulse" d="M${x + 75} 56 L${x + 145} 92" stroke="var(--warn)" stroke-width="2.5"/>` : i === 2 ? `<circle class="hot" cx="${x + 75}" cy="46" r="6" fill="var(--good)"/>` : [-50, -20, 15, 45, 70].map((dx) => `<path class="leak-pulse" d="M${x + 75} 52 L${x + 75 + dx * 0.9} ${118 - Math.abs(dx) * 0.2}" stroke="var(--c3)" stroke-width="1.5"/>`).join('')}
      <text x="${x + 75}" y="160" text-anchor="middle" font-size="12" font-weight="700" fill="var(--${c})">${t}</text><text x="${x + 75}" y="176" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`; }).join('')}
  </svg>`;

  const SVG_ANGLE = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Tilting a panel turns the reflection by twice the angle">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Tilt the panel by θ → the reflection turns by 2θ</text>
    <line x1="60" y1="40" x2="620" y2="40" stroke="var(--muted)" stroke-width="5"/>
    <line x1="250" y1="62" x2="430" y2="40" stroke="var(--accent2)" stroke-width="7"/>
    <path d="M250 40 L250 62 L430 40z" fill="var(--c4)" opacity=".4"/>
    <rect x="110" y="150" width="20" height="20" fill="var(--accent)"/><text x="120" y="188" text-anchor="middle" font-size="10">speaker</text>
    <circle cx="470" cy="170" r="9" fill="var(--good)"/><text x="470" y="198" text-anchor="middle" font-size="10">listener</text>
    <path d="M120 150 L330 46" stroke="var(--accent)" stroke-width="2"/>
    <path d="M330 46 L470 162" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="5 4"/><text x="408" y="136" font-size="10" fill="var(--bad)">flat wall: to the ears</text>
    <path class="leak-pulse" d="M330 52 L640 128" stroke="var(--good)" stroke-width="2.5"/><text x="560" y="96" font-size="10" fill="var(--good)">angled: past the head</text>
    <path d="M250 62 A 70 70 0 0 1 252 40" fill="none" stroke="var(--text)"/><text x="226" y="58" font-size="11" font-weight="700">θ</text>
    <text x="340" y="212" text-anchor="middle" font-size="10" fill="var(--muted)">The wedge behind the panel (green) is free space for a bass absorber.</text>
  </svg>`;

  const SVG_SIZE = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="A reflector only steers wavelengths smaller than itself">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A panel only steers wavelengths clearly smaller than itself</text>
    ${[['High frequency: short waves', 'mirror-like beam', 60, 6, 0.25], ['Near the limit', 'beam widens', 280, 14, 0.6], ['Low frequency: long waves', 'bends round, ignores the angle', 500, 30, 1.25]].map(([t, s, x, lam, sp]) => `<g>
      <line x1="${x}" y1="52" x2="${x + 120}" y2="40" stroke="var(--accent2)" stroke-width="6"/>
      ${[0, 1, 2].map((k) => `<path d="M${x + 20 - k * lam * 0.4} ${150 - k * lam} q 40 ${-lam * 0.2} 80 0" fill="none" stroke="var(--accent)" stroke-width="1.5" opacity="${1 - k * 0.25}"/>`).join('')}
      ${[1, 2, 3].map((k) => `<path class="leak-pulse" d="M${x + 60 + Math.cos(0.6 - sp) * k * 26} ${52 + Math.sin(0.6 + sp * 0.2) * k * 22} A ${k * 26} ${k * 26} 0 0 1 ${x + 60 + Math.cos(0.6 + sp) * k * 26} ${52 + Math.sin(0.6 + sp) * k * 22}" fill="none" stroke="var(--warn)" stroke-width="2"/>`).join('')}
      <text x="${x + 60}" y="178" text-anchor="middle" font-size="11" font-weight="700">${t}</text><text x="${x + 60}" y="194" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`).join('')}
  </svg>`;

  const SVG_ROOM = `<svg class="gsvg" viewBox="0 0 680 280" role="img" aria-label="A control room that uses redirectors and absorbers together">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Redirect the mids and highs, absorb the lows, finish at the rear wall</text>
    <rect x="40" y="36" width="600" height="210" fill="var(--panel2)" stroke="var(--text)" stroke-width="4"/>
    <path d="M42 38 L42 100 L120 50z M42 244 L42 182 L120 232z" fill="var(--c4)" opacity=".8"/>
    <line x1="150" y1="70" x2="330" y2="40" stroke="var(--accent2)" stroke-width="7"/><path d="M150 40 L150 70 L330 40z" fill="var(--c4)" opacity=".45"/>
    <line x1="150" y1="212" x2="330" y2="242" stroke="var(--accent2)" stroke-width="7"/><path d="M150 242 L150 212 L330 242z" fill="var(--c4)" opacity=".45"/>
    <rect x="600" y="44" width="36" height="194" fill="var(--c4)" opacity=".8"/>
    <rect x="96" y="92" width="18" height="18" fill="var(--accent)"/><rect x="96" y="172" width="18" height="18" fill="var(--accent)"/>
    <circle cx="300" cy="141" r="26" fill="none" stroke="var(--good)" stroke-dasharray="5 4"/><circle cx="300" cy="141" r="8" fill="var(--good)"/>
    <path d="M114 100 L300 141 M114 181 L300 141" stroke="var(--good)" stroke-width="1.5"/>
    <path class="leak-pulse" d="M114 100 L230 57 L600 110" stroke="var(--warn)" stroke-width="2" fill="none"/>
    <path class="leak-pulse" d="M114 181 L230 226 L600 172" stroke="var(--warn)" stroke-width="2" fill="none"/>
    ${[['①', 70, 62, 'corner bass traps'], ['②', 240, 30, ''], ['③', 618, 141, ''], ['④', 300, 100, '']].map(([n, x, y]) => `<circle class="hot" cx="${x}" cy="${y}" r="10" fill="var(--bad)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">${n}</text>`).join('')}
    <text x="40" y="262" font-size="10">① corner bass traps · ② angled side panels (redirectors) with absorber in the wedge</text><text x="40" y="276" font-size="10">③ deep rear absorber or diffuser · ④ reflection-free zone around the seat</text>
  </svg>`;

  const L = {
    id: 'm-redirect', n: 'M18B', track: 'master', title: 'Sound Redirectors and Absorbers: How to Calculate and Design Them', level: 'Advanced', mins: 45,
    summary: 'Angled reflector panels (“redirectors” or deflectors) that steer reflections away from the listener, the frequency they work from, how to set their angle and size — and how to size each kind of absorber for a target frequency.',
    tags: ['redirector', 'deflector', 'angled reflector', 'reflection-free zone', 'splayed wall', 'limiting frequency', 'absorber design', 'membrane', 'Helmholtz', 'slot absorber', 'quarter wave'],
    sections: [
      { h: 'Reflect, redirect, absorb or diffuse?', html: `
        <p class="lead">Every reflection in a room has to be dealt with in one of four ways. Absorbing removes energy; diffusing spreads it; <b>redirecting</b> keeps the energy but sends it somewhere harmless — usually past the listener to the rear of the room, where it is absorbed or scattered later.</p>
        ${SVG_FOUR}
        <div class="table-wrap"><table><tr><th>Tool</th><th>What happens to the energy</th><th>Works from</th><th>Use it when</th><th>Cost in space</th></tr>
          <tr><td><b>Redirector</b> (angled hard panel, splayed wall, tilted cloud)</td><td>Kept, steered elsewhere</td><td>The frequency where the panel is a few wavelengths across</td><td>You want a clear image without deadening the room</td><td>Wedge behind the panel (reusable as a bass trap)</td></tr>
          <tr><td><b>Absorber</b></td><td>Turned into heat</td><td>Depends on depth (porous) or tuning (resonant)</td><td>Bass control; too much reverberation; no room to redirect</td><td>Depth ≈ λ/8–λ/4 for porous; less for tuned traps</td></tr>
          <tr><td><b>Diffuser</b></td><td>Kept, spread in time and direction</td><td>Set by its depth; needs distance</td><td>Rear wall or large rooms; keeping life</td><td>50–300 mm plus 2–3 m of distance</td></tr></table></div>
        <div class="callout mentor">Good rooms use all three together: <b>redirect</b> the mids and highs at the sides and ceiling, <b>absorb</b> the bass everywhere you can, and let the redirected sound end on a <b>deep absorber or a diffuser</b> at the rear.</div>` },
      { h: 'How a redirector works: the mirror rule', html: `
        ${SVG_ANGLE}
        <p>Above its working frequency a hard panel behaves like a mirror: angle in = angle out. Two consequences make design easy:</p>
        <ul><li><b>Image source:</b> imagine the loudspeaker reflected in the panel. The reflection seems to come from that mirror image. Move or tilt the panel until the line from the image to the listening zone no longer crosses the panel.</li>
        <li><b>Twice the tilt:</b> rotate the panel by θ and the reflected ray turns by 2θ. A 6° splay turns the reflection 12° — at 2 m that is already 0.42 m sideways, enough to clear a head.</li></ul>
        <div class="formula"><span class="lbl">How far the reflection moves</span>shift at distance d ≈ d · tan(2θ) &nbsp;·&nbsp; depth used by the panel = width · sin θ</div>
        <p>Set the room up below, start with the panel flat (0°), then open it until the reflection clears the listening zone.</p>`, viz: 'redirector' },
      { h: 'The frequency limit: how big must the panel be?', html: `
        ${SVG_SIZE}
        <p>A panel steers sound only when it is large compared with the wavelength. Below a <b>limiting frequency</b> the reflection weakens (about 6 dB per octave for each undersized dimension), spreads out and stops obeying the angle — the wave simply bends around the panel as if it were not there.</p>
        <div class="formula"><span class="lbl">Limiting frequency of a flat reflector (each dimension)</span>f<sub>g</sub> ≈ c · a* / (2 · (w · cos θ)²) &nbsp;·&nbsp; a* = 2·a₁·a₂ / (a₁ + a₂)</div>
        <p class="small muted">w = panel width (or height, with cos θ = 1 for the dimension the sound does not strike obliquely), a₁ = source-to-panel distance, a₂ = panel-to-listener distance, θ = angle of incidence measured from the panel’s normal.</p>
        <div class="table-wrap"><table><tr><th>Panel width</th><th class="num">a₁ = 1.5 m, a₂ = 1.5 m, 45°</th><th class="num">a₁ = 3 m, a₂ = 3 m, 45°</th><th class="num">Hall: a₁ = 8 m, a₂ = 10 m, 30°</th></tr>
          ${[0.6, 1.2, 1.8, 2.4].map((w) => `<tr><td>${w} m</td><td class="num">${fg(w, 1.5, 1.5, 45)} Hz</td><td class="num">${fg(w, 3, 3, 45)} Hz</td><td class="num">${fg(w, 8, 10, 30)} Hz</td></tr>`).join('')}</table></div>
        <div class="callout data"><b>Rules of thumb.</b> Double the panel width → the limit drops two octaves (÷4). Farther away → you need a bigger panel. Grazing incidence (large θ) makes a panel act smaller. In small rooms a 1.2 m panel steers from roughly 500–700 Hz up; below that, treat the reflection with absorption.</div>` },
      { h: 'Designing redirectors, step by step', html: `
        ${flow([['Locate', 'find the first-reflection points: mirror trick or image sources'], ['Choose', 'redirect where depth allows; absorb elsewhere'], ['Angle', 'tilt until the reflection clears a 0.8–1 m wide listening zone'], ['Size', 'make the panel big enough for the limit you need'], ['Back it', 'absorber in the wedge for everything below the limit'], ['Destination', 'rear wall: deep absorber or diffuser'], ['Check', 'impulse/ETC: early reflections ≥ 15–20 dB down for ≈ 15–20 ms']])}
        ${SVG_ROOM}
        <div class="table-wrap"><table><tr><th>Surface</th><th>Typical redirector</th><th>Typical angle</th><th>Notes</th></tr>
          <tr><td>Side walls beside the speakers</td><td>Splayed wall or hinged panel, front edge off the wall</td><td>6–12° (reflection turned 12–24°)</td><td>Keep left and right identical</td></tr>
          <tr><td>Ceiling between speakers and seat</td><td>Tilted hard cloud, lower at the front</td><td>8–15°</td><td>Sends the ceiling bounce over your head to the rear; absorber on top of the cloud</td></tr>
          <tr><td>Front wall around flush-mounted speakers</td><td>The baffle itself, angled toward the seat</td><td>set by the speaker toe-in</td><td>Hard, massive, sealed</td></tr>
          <tr><td>Console / desk</td><td>Sloped top, low profile</td><td>10–20°</td><td>See the desk-bounce lab</td></tr>
          <tr><td>Live room walls</td><td>Non-parallel or convex (curved) panels</td><td>≥ 5–7° to kill flutter</td><td>Convex surfaces redirect <i>and</i> spread</td></tr>
          <tr><td>Halls: overhead reflectors (canopy)</td><td>Arrays of panels 1.5–3 m wide</td><td>aimed by image-source geometry</td><td>Sized for the limit (often 300–500 Hz); cover about half the area</td></tr></table></div>` },
      { h: 'Flat, curved, or hybrid?', html: `
        <div class="uc-grid">
          ${uc('▱', 'Flat angled panel', [['Does', 'Steers the whole reflection in one direction'], ['Design', 'Angle from the mirror rule; size from the limit formula'], ['Watch', 'The energy must land on absorption or diffusion later']])}
          ${uc('◠', 'Convex (poly-cylinder) panel', [['Does', 'Redirects and fans the reflection out, so it is weaker everywhere'], ['Design', 'Chord 0.6–1.2 m, depth 100–200 mm; the hollow behind works as a bass absorber if filled with wool'], ['Watch', 'Never concave — that focuses sound']], '#7a5cc7')}
          ${uc('▤', 'Slatted angled panel (redirector + absorber)', [['Does', 'Slats steer the highs; slots let lows and mids through to the absorber behind'], ['Design', 'Slat width sets the frequency above which it reflects (roughly c / (2 × slat width)); tune the slots with the absorber calculator'], ['Watch', 'Keep the pattern identical left and right']], '#c7772b')}
          ${uc('◣', 'Angled panel with a trapped wedge', [['Does', 'Hard face redirects; the sealed wedge behind is a membrane or porous bass trap'], ['Design', 'Thin panel (6–9 mm) on a wool-filled wedge: redirector above ≈ 300 Hz, panel absorber below'], ['Watch', 'A thin panel absorbs some bass by flexing — usually welcome']], '#2b9fc7')}
        </div>
        ${myth([
          ['“Angled walls remove room modes.”', 'They change the mode shapes and frequencies slightly but the room still has modes. Splays are for reflections and flutter, not bass.'],
          ['“Any small angled panel will redirect the sound.”', 'Only above its limiting frequency. A 30 cm panel steers just the top octaves.'],
          ['“Redirecting is better than absorbing.”', 'It keeps the room lively, but the energy still has to end somewhere. Without a treated rear wall you have only moved the problem.'],
          ['“More angle is always better.”', 'Beyond what clears the listening zone you just lose room depth and may send the reflection to the other side wall.'],
        ])}` },
      { h: 'Absorbers: calculate the right one for a target frequency', html: `
        <p>Redirectors handle the mids and highs. Everything below their limit — and all the bass — is absorber territory. Pick the type by frequency and available depth:</p>
        <div class="table-wrap"><table><tr><th>Absorber</th><th>Sizing formula</th><th>Best range</th><th>Bandwidth</th></tr>
          <tr><td><b>Porous</b> (mineral wool, with air gap)</td><td>total depth ≈ c/(8f) to c/(4f)</td><td>above ≈ 150 Hz (deeper for lower)</td><td>broad</td></tr>
          <tr><td><b>Membrane / panel</b></td><td>f ≈ 60/√(m·D) empty, 50/√(m·D) wool-filled → D = (50/f)²/m</td><td>40–200 Hz</td><td>about an octave</td></tr>
          <tr><td><b>Slot (slat) Helmholtz</b></td><td>f = (c/2π)·√(ε / (D·(t + 1.2·r))) &nbsp; ε = r/(w + r)</td><td>80–500 Hz</td><td>half to one octave (wider with wool)</td></tr>
          <tr><td><b>Perforated panel</b></td><td>f = (c/2π)·√(ε / (D·(t + 0.85·d))) &nbsp; ε = πd²/(4s²)</td><td>100–1 000 Hz</td><td>set by open area</td></tr>
          <tr><td><b>Quarter-wave tube / channel</b></td><td>L = c/(4f)</td><td>40–150 Hz</td><td>narrow, plus odd multiples</td></tr></table></div>
        <p class="small muted">m = panel mass kg/m², D = cavity depth m, r = slot width, w = slat width, t = panel thickness, d = hole diameter, s = hole spacing, c = 343 m/s.</p>
        <p>Enter a target frequency below: the calculator sizes all five and shows which are practical.</p>`, viz: 'absorberCalc' },
      { h: 'Worked example: a 4.6 × 3.4 × 2.5 m mix room', html: `
        <div class="table-wrap"><table><tr><th>Problem</th><th>Tool</th><th>Calculation</th><th>Result</th></tr>
          <tr><td>Side-wall first reflections</td><td>Redirector panels 1.2 × 1.2 m</td><td>a₁ ≈ 1.2 m, a₂ ≈ 1.6 m → a* ≈ 1.37 m; θ ≈ 50° → f<sub>g</sub> ≈ 343·1.37/(2·(1.2·0.64)²)</td><td>≈ 400 Hz limit; 8° splay clears the seat; front edge 170 mm off the wall</td></tr>
          <tr><td>Same reflection below 400 Hz</td><td>Porous fill in the wedge</td><td>up to 170 mm wool + panel edge slots</td><td>useful absorption from ≈ 200 Hz</td></tr>
          <tr><td>Ceiling bounce</td><td>Tilted hard cloud 1.2 × 1.8 m, 10°, 100 mm wool on top</td><td>a* ≈ 1.2 m → f<sub>g</sub> ≈ 220–350 Hz</td><td>bounce sent over the head; absorption above the cloud</td></tr>
          <tr><td>50 Hz width mode</td><td>Membrane traps on side walls</td><td>D = (50/50)²/10 = 0.10 m with a 10 kg/m² panel</td><td>100 mm deep modules, several m²</td></tr>
          <tr><td>75 Hz length mode (2nd)</td><td>Slot absorber, rear wall</td><td>70 mm slats, 8 mm slots, 18 mm thick: ε = 0.103 → D ≈ 0.103·(343/(2π·75))²/0.0276</td><td>≈ 1.97 m — impractical → even with 3 mm slots D ≈ 1.0 m; choose a membrane instead</td></tr>
          <tr><td>Redirected energy</td><td>Rear wall</td><td>300 mm porous (c/(8f) → effective from ≈ 140 Hz)</td><td>reflections die at the back; RFZ kept</td></tr></table></div>
        <div class="callout mentor">Notice the slot-absorber row: the formula told us that design was unbuildable <i>before</i> any timber was cut. That is what the calculation is for — try the numbers in the calculator and switch type when the depth is silly.</div>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎚️', 'Small control room, wants life', [['Problem', 'Absorbing every reflection made the room dead'], ['Design', 'Hard angled side panels with wool behind; absorptive cloud; diffusive rear'], ['Result', 'Clear image, RT stays ≈ 0.25–0.3 s']])}
          ${uc('🎬', 'Atmos / surround room', [['Problem', 'Every wall has speakers; redirected sound would hit another listener position'], ['Design', 'Mostly absorption; small redirectors only at the ceiling'], ['Result', 'Stable imaging over a wider area']], '#7a5cc7')}
          ${uc('🥁', 'Live room with flutter', [['Problem', 'Parallel plaster walls zing'], ['Design', 'Convex plywood panels on one wall, splay ≥ 6°, wool behind'], ['Result', 'Flutter gone, liveliness kept, extra bass absorption']], '#c7772b')}
          ${uc('🎤', 'Lecture / worship hall', [['Problem', 'Rear seats lack clarity; echo from the back wall'], ['Design', 'Overhead reflectors sized for ≈ 400 Hz aimed at the rear seats; absorber on the back wall'], ['Result', 'Stronger early sound, less echo']], '#2b9fc7')}
          ${uc('🏠', 'Living-room studio', [['Problem', 'No panels allowed on the walls'], ['Design', 'Bookshelf angled 8°, tilted artwork panels, thick rug, curtain as the “rear absorber”'], ['Result', 'Reflections steered with furniture']], '#4c9a3a')}
        </div>` },
      { h: 'Mistakes, checks and related tools', html: `
        <div class="table-wrap"><table><tr><th>Mistake</th><th>What happens</th><th>Fix</th></tr>
          <tr><td>Panels too small</td><td>Only treble is steered; mids still reflect to the ears</td><td>Size by the limit formula; absorb behind</td></tr>
          <tr><td>Different angles left and right</td><td>Image pulls to one side</td><td>Mirror everything about the centre line</td></tr>
          <tr><td>No treatment where the sound is sent</td><td>Late slap from the rear wall</td><td>Deep absorber or diffuser at the rear</td></tr>
          <tr><td>Concave shapes (bay, curved rear wall)</td><td>Focusing: hot spots and echoes</td><td>Convex or broken-up surfaces only</td></tr>
          <tr><td>Thin resonating panels left undamped</td><td>Panel rings and colours the sound</td><td>Brace, damp, or fill the cavity with wool</td></tr>
          <tr><td>Relying on angles for bass</td><td>Modes unchanged</td><td>Bass traps: see the mode-placement tools</td></tr></table></div>
        <p><b>Check with a measurement:</b> in the impulse response (ETC view) the side-wall and ceiling reflections should be at least 15–20 dB below the direct sound for the first 15–20 ms. Cover a redirector with a blanket and re-measure to see what it was doing.</p>
        <p>Related: <a href="#/academy/m-treat-designs">Room Treatment Designs</a> · <a href="#/academy/m-control">Control Rooms</a> · <a href="#/absorbers">Absorber Designer</a> · <a href="#/diffusers">Diffuser Designer</a> · <a href="#/lab/stands">Desk bounce &amp; trap placement</a> · <a href="#/lab/reflections">Control-room reflections</a>.</p>` },
    ],
    quiz: [
      { q: 'You tilt a side panel by 8°. By how much does the reflected ray turn?', opts: ['4°', '8°', '16°', '32°'], a: 2, why: 'A mirror turned by θ turns the reflection by 2θ.' },
      { q: 'A reflector panel is made twice as wide. Its limiting frequency…', opts: ['halves', 'drops to a quarter', 'doubles', 'is unchanged'], a: 1, why: 'f is proportional to 1/w²: double the width, two octaves lower.' },
      { q: 'What happens to sound below a redirector’s limiting frequency?', opts: ['It is absorbed', 'It is steered even more', 'It diffracts around the panel and is not steered', 'It is blocked'], a: 2, why: 'The panel is small compared with the wavelength, so the reflection weakens and spreads.' },
      { q: 'A membrane trap for 50 Hz with a 10 kg/m² panel and a wool-filled cavity needs a depth of about…', opts: ['25 mm', '100 mm', '400 mm', '1 m'], a: 1, why: 'D = (50/f)²/m = 1/10 = 0.10 m.' },
      { q: 'After redirecting side reflections to the rear, what must the rear wall have?', opts: ['Nothing — the job is done', 'A mirror', 'Deep absorption or diffusion', 'A window'], a: 2, why: 'Otherwise the energy returns as a late, strong reflection.' },
    ],
  };
  const i = window.LESSONS.findIndex((l) => l.id === 'm-carbon');
  const j = i >= 0 ? i : window.LESSONS.findIndex((l) => l.id === 'm-treat-designs');
  window.LESSONS.splice(j >= 0 ? j + 1 : window.LESSONS.length, 0, L);

  const pointer = { h: 'Steering reflections instead of absorbing them: redirectors', html: `
    <p>An angled hard panel can send a first reflection past the listener instead of absorbing it — keeping the room lively. It works only above a limiting frequency set by the panel’s size, and the redirected sound needs a treated rear wall to land on. Angle, size and worked examples: <a href="#/academy/m-redirect">Sound Redirectors and Absorbers</a>.</p>`, viz: 'redirector' };
  ['m-control', 'm-treat-designs'].forEach((id) => { const l = window.LESSONS.find((x) => x.id === id); if (l) l.sections.push(pointer); });
})();
