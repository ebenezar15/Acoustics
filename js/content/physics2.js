/* ==========================================================================
   Three lessons: the physics under the hood (impedance, sources, pipes,
   acoustic filters); diffuser design in depth; and a workbook of practice
   problems with worked solutions. Original text and problems.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design|result/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const insertAfter = (ids, L) => { let i = -1; for (const id of ids) { i = window.LESSONS.findIndex((l) => l.id === id); if (i >= 0) break; } window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L); };

  /* =====================================================================
     A — wave physics
     ===================================================================== */
  const SVG_PV = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="A sound wave as pressure and particle motion">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">One wave, three linked quantities</text>
    ${Array.from({ length: 56 }, (_, i) => { const x = 30 + i * 11.2, d = Math.sin((i / 56) * Math.PI * 4); return `<circle cx="${(x + d * 6).toFixed(1)}" cy="52" r="3" fill="var(--text)" opacity="${(0.45 + 0.4 * Math.cos((i / 56) * Math.PI * 4)).toFixed(2)}"/>`; }).join('')}
    <text x="30" y="34" font-size="10" fill="var(--muted)">air particles: crowded = compression, spread = rarefaction</text>
    <path d="M30 110 ${Array.from({ length: 63 }, (_, i) => `L${30 + i * 10} ${(110 - 26 * Math.cos((i / 62) * Math.PI * 4)).toFixed(1)}`).join(' ')}" fill="none" stroke="var(--c3)" stroke-width="2.5"/>
    <text x="656" y="96" text-anchor="end" font-size="11" font-weight="700" fill="var(--c3)">pressure p</text>
    <path d="M30 168 ${Array.from({ length: 63 }, (_, i) => `L${30 + i * 10} ${(168 - 20 * Math.cos((i / 62) * Math.PI * 4)).toFixed(1)}`).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
    <text x="656" y="154" text-anchor="end" font-size="11" font-weight="700" fill="var(--accent)">particle velocity u</text>
    <text x="340" y="194" text-anchor="middle" font-size="10" fill="var(--muted)">In a free travelling wave p and u rise and fall together; their ratio is the impedance ρc.</text>
  </svg>`;
  const SVG_STEP = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Reflection at an impedance step">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A change of impedance is a mirror — the bigger the change, the better the mirror</text>
    ${[['air → mineral wool', 'nearly matched', 0.06, 'good', 20], ['air → water', '≈ 0.1 % gets in', 0.93, 'warn', 240], ['air → concrete', '≈ 0.02 % gets in', 0.98, 'bad', 460]].map(([t, s, r, c, x]) => `<g>
      <rect x="${x}" y="34" width="100" height="100" fill="var(--panel2)"/><rect x="${x + 100}" y="34" width="100" height="100" fill="var(--accent2)" opacity="${0.15 + r * 0.5}"/>
      <line x1="${x + 100}" y1="30" x2="${x + 100}" y2="138" stroke="var(--text)" stroke-width="2"/>
      <path class="wave-in" d="M${x + 14} 70 h70" stroke="var(--accent)" stroke-width="4"/>
      <path d="M${x + 86} 100 h-${Math.round(70 * r)}" stroke="var(--bad)" stroke-width="${1 + 4 * r}"/>
      <path d="M${x + 112} 84 h${Math.round(8 + 64 * (1 - r))}" stroke="var(--good)" stroke-width="${1 + 4 * (1 - r)}"/>
      <text x="${x + 100}" y="156" text-anchor="middle" font-size="11" font-weight="700">${t}</text><text x="${x + 100}" y="172" text-anchor="middle" font-size="10" fill="var(--${c})">${s}</text></g>`).join('')}
  </svg>`;
  const SVG_LUMP = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Lumped acoustic elements and their analogies">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Three building blocks — the same in air, in mechanics and in circuits</text>
    ${[['Acoustic mass', 'air plug in a neck or port', 'a weight', 'an inductor', 30, `<rect x="60" y="60" width="90" height="26" fill="var(--panel2)" stroke="var(--text)"/><rect class="pane-a" x="80" y="62" width="50" height="22" fill="var(--accent)" opacity=".7"/>`],
      ['Acoustic compliance', 'air trapped in a cavity', 'a spring', 'a capacitor', 250, `<rect x="60" y="48" width="90" height="50" rx="6" fill="var(--c4)" opacity=".35" stroke="var(--text)"/><path d="M75 73 l8 -10 l8 20 l8 -20 l8 20 l8 -20 l8 10" fill="none" stroke="var(--accent)" stroke-width="2"/>`],
      ['Acoustic resistance', 'friction in wool, cloth, a mesh', 'a damper', 'a resistor', 470, `<rect x="60" y="56" width="90" height="34" fill="var(--panel2)" stroke="var(--text)"/>${Array.from({ length: 9 }, (_, i) => `<line x1="${68 + i * 9}" y1="58" x2="${72 + i * 9}" y2="88" stroke="var(--c4)" stroke-width="2"/>`).join('')}`]].map(([t, a, m, e, x, art]) => `<g transform="translate(${x} 0)">${art}
      <text x="105" y="122" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="105" y="138" text-anchor="middle" font-size="10" fill="var(--muted)">${a}</text>
      <text x="105" y="158" text-anchor="middle" font-size="10">mechanical: ${m}</text><text x="105" y="174" text-anchor="middle" font-size="10">electrical: ${e}</text></g>`).join('')}
    <text x="340" y="194" text-anchor="middle" font-size="10" fill="var(--muted)">Valid while the part is small compared with the wavelength.</text>
  </svg>`;
  const SVG_FILT = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Three acoustic filters in a duct">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Acoustic filters built from pipes and cavities</text>
    ${[['Expansion chamber', 'low-pass: blocks in humps', 20, `<rect x="0" y="66" width="200" height="16" fill="var(--panel2)" stroke="var(--text)"/><rect x="60" y="44" width="80" height="60" fill="var(--panel2)" stroke="var(--text)"/>`],
      ['Side-branch resonator', 'band-stop: one deep notch', 240, `<rect x="0" y="66" width="200" height="16" fill="var(--panel2)" stroke="var(--text)"/><rect x="92" y="52" width="10" height="14" fill="var(--panel2)" stroke="var(--text)"/><rect x="72" y="26" width="50" height="28" rx="5" fill="var(--c4)" opacity=".4" stroke="var(--text)"/>`],
      ['Constriction / orifice', 'high-pass: lets highs through', 460, `<rect x="0" y="56" width="200" height="36" fill="var(--panel2)" stroke="var(--text)"/><rect x="96" y="56" width="8" height="13" fill="var(--text)"/><rect x="96" y="79" width="8" height="13" fill="var(--text)"/>`]].map(([t, s, x, art]) => `<g transform="translate(${x} 20)">${art}<path class="wave-in" d="M10 74 h40" stroke="var(--accent)" stroke-width="3"/><text x="100" y="130" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="100" y="146" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`).join('')}
  </svg>`;

  const WAVE = {
    id: 'wave-physics', n: '5A', title: 'The Physics Under the Hood: Impedance, Sources, Pipes and Acoustic Filters', level: 'Advanced', mins: 50,
    summary: 'The handful of physical ideas that explain almost everything else in this app: why walls reflect, why small speakers have no bass, why ports and bottles resonate, and how a pipe and a box make a silencer.',
    tags: ['wave equation', 'acoustic impedance', 'reflection coefficient', 'intensity', 'monopole', 'dipole', 'piston', 'ka', 'lumped elements', 'acoustic filter', 'expansion chamber', 'silencer'],
    sections: [
      { h: 'The wave equation, in words', html: `
        <p class="lead">You never need to solve the wave equation to design a studio — but knowing what it <i>says</i> makes every rule of thumb in this app obvious instead of magic.</p>
        ${SVG_PV}
        <p>Air has two properties that matter: it has <b>mass</b> (it resists being accelerated) and it is <b>springy</b> (it resists being squeezed). Put those together and you get two simple statements:</p>
        <ul><li><b>Push rule:</b> a difference in pressure between two neighbouring points accelerates the air between them.</li>
        <li><b>Squeeze rule:</b> if more air flows into a spot than out of it, the pressure there rises.</li></ul>
        <p>Chain those two rules along a line of air and a disturbance passes itself along at a fixed speed, c = √(stiffness / density) ≈ 343 m/s at 20 °C. That chain <i>is</i> the wave equation:</p>
        <div class="formula"><span class="lbl">Wave equation (one dimension)</span>∂²p/∂x² = (1/c²) · ∂²p/∂t² &nbsp;—&nbsp; “how sharply pressure curves in space” = “how fast it changes in time”, scaled by c</div>
        ${flow([['Pressure p', 'tiny changes around 100 000 Pa: 1 Pa is already 94 dB'], ['Particle velocity u', 'how fast the air itself moves: mm/s, not m/s'], ['Density ρ', '1.2 kg/m³ — the “mass” of the medium'], ['Speed c', 'how fast the pattern travels']])}` },
      { h: 'Acoustic impedance: how hard the medium pushes back', html: `
        <p><b>Specific acoustic impedance</b> is pressure divided by particle velocity: how much pressure it takes to make the medium move at a given speed. For a free travelling wave it is simply the density times the speed of sound — the <b>characteristic impedance</b> ρc.</p>
        <div class="table-wrap"><table><tr><th>Medium</th><th class="num">Density (kg/m³)</th><th class="num">Speed (m/s)</th><th class="num">ρc</th><th>Feels like</th></tr>
          <tr><td>Air</td><td class="num">1.2</td><td class="num">343</td><td class="num">≈ 413 rayl</td><td>very easy to move</td></tr>
          <tr><td>Water</td><td class="num">1 000</td><td class="num">1 480</td><td class="num">≈ 1.48 Mrayl</td><td>3 600 × stiffer than air</td></tr>
          <tr><td>Concrete</td><td class="num">2 300</td><td class="num">3 500</td><td class="num">≈ 8 Mrayl</td><td>20 000 × stiffer than air</td></tr>
          <tr><td>Steel</td><td class="num">7 850</td><td class="num">5 900</td><td class="num">≈ 46 Mrayl</td><td>110 000 × stiffer than air</td></tr></table></div>
        <div class="callout data">In air, 1 Pa (94 dB) moves the air at only 1/413 m/s ≈ 2.4 mm/s. Sound is a very small motion carrying a very small amount of power — a full orchestra radiates only a few watts.</div>` },
      { h: 'Why a change of impedance reflects sound', html: `
        ${SVG_STEP}
        <p>When a wave arrives at a boundary between two media, pressure and velocity must match on both sides. If the second medium is much harder to move, it cannot accept the motion the wave brings, so most of the wave turns back.</p>
        <div class="formula"><span class="lbl">Normal incidence on a thick second medium</span>R = (Z₂ − Z₁) / (Z₂ + Z₁) &nbsp;·&nbsp; energy transmitted = 4·Z₁·Z₂ / (Z₁ + Z₂)²</div>
        <div class="callout example"><b>Air → water:</b> transmitted = 4 × 413 × 1.48 M / (1.48 M)² ≈ 0.0011, about 0.1 % — a loss of roughly 30 dB. That is why you cannot hear poolside conversation under water. <b>Air → concrete:</b> ≈ 0.02 % (≈ 37 dB) for a single step into an endless block; a real wall of finite thickness then follows the mass law.</div>
        <p>Two design lessons follow. <b>Isolation</b> wants the largest possible mismatch (heavy, stiff layers, with air gaps between them so the wave meets several mismatches). <b>Absorption</b> wants the smallest possible mismatch at the surface — a material that is “almost air” — so sound walks in and is then worn down by friction.</p>`, viz: 'impedanceStep' },
      { h: 'Intensity, power and level', html: `
        <p><b>Intensity</b> is the power flowing through each square metre: I = p·u, and in a free wave I = p² / (ρc). <b>Sound power</b> (watts) belongs to the source; <b>sound pressure</b> is what arrives at a point and depends on distance and on the room.</p>
        <div class="table-wrap"><table><tr><th>Quantity</th><th>Unit</th><th>Level and reference</th><th>Depends on</th></tr>
          <tr><td>Sound power W</td><td>watt</td><td>L<sub>W</sub> = 10·log(W / 10⁻¹² W)</td><td>the source only</td></tr>
          <tr><td>Intensity I</td><td>W/m²</td><td>L<sub>I</sub> = 10·log(I / 10⁻¹² W/m²)</td><td>source, distance, direction</td></tr>
          <tr><td>Pressure p</td><td>pascal</td><td>L<sub>p</sub> = 20·log(p / 20 µPa)</td><td>source, distance, room</td></tr></table></div>
        <p>A point source in open air spreads its power over a sphere of area 4πr², so intensity falls as 1/r² and pressure as 1/r — the <b>inverse-square law</b>, −6 dB per doubling of distance. Far from the source the wavefront is so gently curved that it behaves as a <b>plane wave</b>; close to a source that is large compared with the distance (the <b>near field</b>) level changes little with distance and pressure and velocity are not yet in step.</p>
        <div class="callout mentor">Fan and air-conditioner data sheets quote sound <i>power</i>. The pressure you will get at a seat depends on the room: L<sub>p</sub> ≈ L<sub>W</sub> + 10·log(Q/4πr² + 4/R). See <a href="#/academy/m-hvac">HVAC</a>.</div>` },
      { h: 'Sources: monopole, dipole and the piston', html: `
        <p>All real sources are combinations of a few simple types. What decides how they behave is their size compared with the wavelength, written <b>ka</b> (k = 2π/λ, a = the source’s radius): ka = 1 means the circumference equals one wavelength.</p>
        <div class="uc-grid">
          ${uc('●', 'Monopole', [['Is', 'A small surface that pulses in and out — a sealed subwoofer'], ['Pattern', 'Equal in all directions'], ['Low frequencies', 'Output falls 6 dB per halving of ka: it needs more excursion or more area']])}
          ${uc('◐', 'Dipole', [['Is', 'Two monopoles in opposite phase — an open-backed driver, a ribbon mic'], ['Pattern', 'Figure-of-eight, nulls to the sides'], ['Low frequencies', 'Front and back cancel: −12 dB per halving of ka unless a baffle keeps them apart']], '#7a5cc7')}
          ${uc('◔', 'Cardioid', [['Is', 'A monopole plus a dipole'], ['Pattern', 'Adds in front, cancels behind'], ['Used in', 'Directional microphones and cardioid subwoofer arrays']], '#c7772b')}
          ${uc('▬', 'Piston in a baffle', [['Is', 'A cone or dome in a cabinet or wall'], ['Pattern', 'Wide when ka is below about 1; a narrowing beam above about 2'], ['Consequence', 'Every driver must hand over to a smaller one before it beams']], '#2b9fc7')}
        </div>
        <p>A <b>baffle</b> (or a box) stops the back wave of a cone from sneaking round to cancel the front wave. That is the whole reason loudspeakers have enclosures — and why a flush-mounted speaker, whose baffle is the entire wall, loses nothing to the rear at all.</p>`, viz: 'sourceTypes' },
      { h: 'Standing waves in pipes — with the end correction', html: `
        <p>A pipe is the simplest resonator: the wave reflects at each end and reinforces itself when the length fits. A closed end is a pressure maximum; an open end is (nearly) a pressure zero. See <a href="#/academy/pv-standing">Pressure, Velocity &amp; Standing Waves</a> for the animated version.</p>
        <div class="table-wrap"><table><tr><th>Pipe</th><th>Resonances</th><th>Example: 1 m long</th></tr>
          <tr><td>Closed at both ends (a room dimension)</td><td>f = n·c / (2L)</td><td>171.5, 343, 514.5 Hz</td></tr>
          <tr><td>Open at both ends</td><td>f = n·c / (2L′)</td><td>≈ 167, 333 Hz (50 mm bore)</td></tr>
          <tr><td>Closed at one end, open at the other</td><td>f = (2n − 1)·c / (4L′)</td><td>≈ 84, 253 Hz (50 mm bore)</td></tr></table></div>
        <div class="formula"><span class="lbl">End correction</span>The air just outside an open end moves with the air inside, so the pipe behaves as if longer: L′ ≈ L + 0.6·r per unflanged open end (≈ 0.85·r if the end sits in a wall)</div>
        <p>The same correction lengthens the neck of every Helmholtz resonator, loudspeaker port and slot absorber — forget it and your trap tunes too high.</p>` },
      { h: 'Lumped elements: masses, springs and resistances of air', html: `
        ${SVG_LUMP}
        <p>When a part is much smaller than the wavelength, you can stop thinking about waves inside it and treat it as one “lump”. There are only three kinds:</p>
        <div class="table-wrap"><table><tr><th>Element</th><th>What it is</th><th>Formula</th><th>Where you meet it</th></tr>
          <tr><td><b>Acoustic mass</b> (inertance)</td><td>A slug of air that must be accelerated</td><td>M = ρ·l′ / S</td><td>Port tubes, resonator necks, slots, perforations</td></tr>
          <tr><td><b>Acoustic compliance</b></td><td>A volume of air that can be squeezed</td><td>C = V / (ρ·c²)</td><td>Speaker boxes, trap cavities, the air behind a membrane</td></tr>
          <tr><td><b>Acoustic resistance</b></td><td>Friction that turns motion into heat</td><td>from flow resistivity × thickness</td><td>Wool, cloth, mesh, narrow slits</td></tr></table></div>
        <div class="formula"><span class="lbl">A mass on a spring resonates</span>f₀ = 1 / (2π·√(M·C)) = (c / 2π) · √( S / (V · l′) ) &nbsp;— the Helmholtz resonator</div>
        <p>Because the mathematics is identical, engineers draw acoustic systems as electrical circuits (pressure ↔ voltage, volume flow ↔ current) or as mechanical ones (force, velocity). A bass-reflex speaker, a slot bass trap and an HVAC silencer are all the same circuit with different part values.</p>` },
      { h: 'Acoustic filters: silencers made of geometry', html: `
        ${SVG_FILT}
        <p>Put lumps and pipes in a duct and you have a filter for sound — one that needs no absorbent at all, which matters at low frequencies where absorbent hardly works.</p>
        <div class="formula"><span class="lbl">Expansion chamber (a wide section in a pipe)</span>TL = 10·log₁₀[ 1 + ¼·(m − 1/m)²·sin²(kL) ] &nbsp;·&nbsp; m = area ratio, L = chamber length, k = 2πf/c</div>
        <ul><li>The <b>height</b> of the humps depends only on the area ratio m: m = 4 → 6.5 dB, 9 → 13 dB, 16 → 18 dB, 25 → 22 dB.</li>
        <li>The <b>position</b> of the humps depends on the length: maxima where L is an odd number of quarter-wavelengths, and <b>no loss at all</b> where L is a whole number of half-wavelengths.</li>
        <li>A <b>side-branch Helmholtz resonator</b> short-circuits the duct at one frequency — a deep, narrow notch for a steady tone.</li>
        <li>A <b>lining</b> of absorbent fills in the gaps and takes care of mid and high frequencies.</li></ul>`, viz: 'mufflerTL' },
      { h: 'Where each idea shows up in a studio', html: `
        <div class="table-wrap"><table><tr><th>Idea</th><th>In the building</th><th>In the equipment</th></tr>
          <tr><td>Impedance mismatch</td><td>Heavy walls, double leaves with air gaps, floating floors</td><td>Why a microphone diaphragm must be very light</td></tr>
          <tr><td>Impedance match</td><td>Porous absorbers, tapered wedges, <a href="#/academy/m-waveguides">waveguide traps</a></td><td>Horns and waveguides that load a driver</td></tr>
          <tr><td>Monopole / dipole / ka</td><td>Corner loading of subs, cardioid sub arrays</td><td>Sealed vs open-baffle speakers; omni vs figure-8 mics</td></tr>
          <tr><td>Piston beaming</td><td>Which walls a speaker “lights up”</td><td>Crossover frequency choice</td></tr>
          <tr><td>Pipe resonance + end correction</td><td>Room modes; quarter-wave traps; duct rumble</td><td>Port tuning, organ-pipe resonances in ports</td></tr>
          <tr><td>Mass–compliance resonance</td><td>Helmholtz and membrane traps; mass–air–mass in walls and windows</td><td>Bass-reflex boxes, mic capsules</td></tr>
          <tr><td>Acoustic filters</td><td><a href="#/academy/m-hvac">HVAC silencers</a>, plenum boxes, sound locks</td><td>Mic wind-shields, ear-plugs with flat filters</td></tr></table></div>
        <div class="uc-grid">
          ${uc('🌬️', 'A fan tone at 125 Hz in a control room', [['Physics', 'One steady frequency travelling down a duct'], ['Design', 'A chamber 0.69 m long (quarter-wave at 125 Hz) with a large area ratio, or a side-branch resonator tuned to 125 Hz'], ['Result', '15–25 dB at the tone before any lining']])}
          ${uc('🔊', 'An open-baffle speaker with no bass', [['Physics', 'A dipole: front and rear cancel when the baffle is small compared with the wavelength'], ['Fix', 'Bigger baffle, more cone area, or a monopole subwoofer below ≈ 100 Hz']], '#7a5cc7')}
          ${uc('🧱', 'Foam on a wall for “soundproofing”', [['Physics', 'Foam is almost air: no impedance step, so nothing is reflected back to the source side'], ['Fix', 'Add mass and an air gap; keep the foam for echo control']], '#c7772b')}
          ${uc('🍾', 'A trap that tuned 15 % too high', [['Physics', 'The neck’s end correction was forgotten, so the air mass was underestimated'], ['Fix', 'Use l′ = l + 0.85·r at each flanged end, or lengthen the neck']], '#2b9fc7')}
        </div>` },
      { h: 'Common misunderstandings', html: `
        ${myth([
          ['“Sound moves air from the speaker to my ears.”', 'The air only shuffles back and forth by a fraction of a millimetre; it is the pattern that travels.'],
          ['“Dense absorbers are better because they are heavier.”', 'An absorber must be close to air’s impedance at its surface. Too dense and it reflects.'],
          ['“A bigger woofer always goes lower.”', 'Low-frequency output depends on the volume of air moved (area × excursion) and the box, not on diameter alone; a bigger cone also beams sooner.'],
          ['“A silencer chamber works at all frequencies.”', 'It has pass-bands with zero loss wherever its length is a multiple of a half-wavelength.'],
          ['“The air→wall formula gives the wall’s isolation.”', 'It describes one step into an endless medium. A real wall is thin compared with the wavelength in it and moves as a whole — the mass law.'],
        ])}
        <p>Related: <a href="#/academy/m-matter">Matter, Energy &amp; How Sound Travels</a> · <a href="#/academy/pv-standing">Pressure, Velocity &amp; Standing Waves</a> · <a href="#/academy/m-hvac">HVAC</a> · <a href="#/academy/m-waveguides">Waveguides</a>.</p>` },
    ],
    quiz: [
      { q: 'Characteristic impedance of a medium is…', opts: ['density ÷ speed of sound', 'density × speed of sound', 'pressure × velocity', 'frequency × wavelength'], a: 1, why: 'Z = ρc: about 413 rayl for air.' },
      { q: 'About how much sound energy passes from air into water at normal incidence?', opts: ['50 %', '10 %', '1 %', '0.1 %'], a: 3, why: '4Z₁Z₂/(Z₁+Z₂)² ≈ 0.0011 — roughly 30 dB lost.' },
      { q: 'Why does an unbaffled driver (a dipole) lose bass?', opts: ['The cone is too heavy', 'Front and rear waves cancel when the path between them is short compared with the wavelength', 'Air is too stiff', 'It beams'], a: 1, why: 'Opposite-phase radiation from the two sides cancels at long wavelengths.' },
      { q: 'An expansion chamber is 0.5 m long. At which frequency does it give NO loss?', opts: ['86 Hz', '172 Hz', '343 Hz', '100 Hz'], a: 2, why: 'Pass-bands where L = λ/2: f = c/(2L) = 343 Hz (and multiples).' },
      { q: 'What does the end correction do to a resonator neck?', opts: ['Makes it act shorter', 'Makes it act longer, lowering the tuning', 'Adds resistance only', 'Nothing'], a: 1, why: 'Air just outside the opening moves too, adding to the mass.' },
    ],
  };
  insertAfter(['propagation'], WAVE);

  /* =====================================================================
     B — diffuser design in depth
     ===================================================================== */
  const qrd = (N) => Array.from({ length: N }, (_, n) => (n * n) % N);
  const wells = (seq, N, x, y, w, hmax, col) => seq.map((s, i) => `<rect x="${x + i * w}" y="${y}" width="${w - 1}" height="${4 + (s / (N - 1)) * hmax}" fill="${col}"/>`).join('');
  const SVG_LOBES = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Periodic and modulated diffuser arrays">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Same units, different order: lobes versus an even fan</text>
    <g><text x="170" y="38" text-anchor="middle" font-size="11" font-weight="700">Periodic: A A A A</text>
      ${[0, 1, 2, 3].map((r) => wells(qrd(7), 7, 44 + r * 63, 46, 9, 36, 'var(--accent2)')).join('')}
      ${[-60, -30, 0, 30, 60].map((a) => `<path class="leak-pulse" d="M170 96 L${170 + Math.sin((a * Math.PI) / 180) * 110} ${96 + Math.cos((a * Math.PI) / 180) * 110}" stroke="var(--bad)" stroke-width="3"/>`).join('')}
      <text x="170" y="222" text-anchor="middle" font-size="10" fill="var(--bad)">energy in a few fixed directions</text></g>
    <g><text x="510" y="38" text-anchor="middle" font-size="11" font-weight="700">Modulated: A B A A B A (B = inverse of A)</text>
      ${[0, 1, 2, 3].map((r) => wells(r === 1 || r === 3 ? qrd(7).map((s) => (7 - s) % 7) : qrd(7), 7, 384 + r * 63, 46, 9, 36, r === 1 || r === 3 ? 'var(--c3)' : 'var(--accent2)')).join('')}
      ${Array.from({ length: 15 }, (_, i) => -84 + i * 12).map((a) => `<path d="M510 96 L${510 + Math.sin((a * Math.PI) / 180) * 100} ${96 + Math.cos((a * Math.PI) / 180) * 100}" stroke="var(--good)" stroke-width="1.5"/>`).join('')}
      <text x="510" y="222" text-anchor="middle" font-size="10" fill="var(--good)">energy spread evenly</text></g>
  </svg>`;
  const SVG_FAMILY = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Families of diffusing surfaces">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The diffuser family</text>
    ${[['Phase grating', 'wells of calculated depth', 0, wells(qrd(11), 11, 20, 40, 9, 44, 'var(--accent2)')],
      ['Curved (arc)', 'spreads by geometry', 1, `<path d="M20 44 Q70 104 120 44" fill="var(--accent2)"/>`],
      ['Pyramids / triangles', 'redirect more than diffuse', 2, `<path d="M20 44 L45 88 L70 44 L95 88 L120 44z" fill="var(--accent2)"/>`],
      ['Stepped / optimised', 'irregular blocks', 3, [14, 40, 22, 52, 8, 34, 46, 18, 30, 10].map((h, i) => `<rect x="${20 + i * 10}" y="44" width="9" height="${h}" fill="var(--accent2)"/>`).join('')],
      ['Binary hybrid', 'holes over absorber', 4, `<rect x="20" y="44" width="100" height="10" fill="var(--text)"/><rect x="20" y="54" width="100" height="26" fill="var(--c4)" opacity=".5"/>${[1, 0, 1, 1, 0, 0, 1, 0, 1, 0].map((b, i) => (b ? `<rect x="${22 + i * 10}" y="44" width="6" height="10" fill="var(--panel)"/>` : '')).join('')}`]].map(([t, s, i, art]) => `<g transform="translate(${i * 132} 0)">${art}<text x="70" y="124" text-anchor="middle" font-size="11" font-weight="700">${t}</text><text x="70" y="140" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`).join('')}
    <text x="340" y="170" text-anchor="middle" font-size="10" fill="var(--muted)">Depth sets the lowest frequency · element width sets the highest · total width and order set the evenness</text>
    <text x="340" y="190" text-anchor="middle" font-size="10" fill="var(--muted)">All are drawn in plan with the room below.</text>
  </svg>`;
  const SVG_MOD = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Modular diffusing elements on a studio wall">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Modular elements: a few standard boxes, arranged irregularly</text>
    <rect x="20" y="30" width="640" height="150" fill="var(--panel2)" stroke="var(--line)"/>
    ${[[30, 40, 90, 60, 3], [125, 40, 60, 60, 1], [190, 40, 120, 60, 2], [315, 40, 60, 60, 3], [380, 40, 90, 60, 1], [475, 40, 60, 60, 2], [540, 40, 110, 60, 3], [30, 106, 60, 64, 2], [95, 106, 120, 64, 1], [220, 106, 60, 64, 3], [285, 106, 90, 64, 2], [380, 106, 60, 64, 3], [445, 106, 120, 64, 1], [570, 106, 80, 64, 2]].map(([x, y, w, h, d]) => `<rect class="${d === 3 ? 'pane-a' : ''}" x="${x}" y="${y}" width="${w - 4}" height="${h - 4}" rx="3" fill="var(--accent2)" opacity="${0.3 + d * 0.22}" stroke="var(--text)" stroke-width="1"/><text x="${x + w / 2 - 2}" y="${y + h / 2 + 2}" text-anchor="middle" font-size="10" fill="var(--text)">${['', 'shallow', 'medium', 'deep'][d]}</text>`).join('')}
    <text x="340" y="200" text-anchor="middle" font-size="10">Each box is a rigid, sealed or damped module: its face scatters mids and highs, its depth step scatters lower down,</text>
    <text x="340" y="216" text-anchor="middle" font-size="10">and the air inside (with a light panel front or a slot) absorbs bass. No two neighbours are alike.</text>
  </svg>`;

  const DIFF = {
    id: 'm-diffuser-depth', n: 'M18E', track: 'master', title: 'Diffuser Design in Depth: Sequences, Modulation, Hybrid and Modular Diffusers', level: 'Advanced', mins: 50,
    summary: 'Beyond the basic well diffuser: how diffusion is judged, why repeated units make lobes and how modulation cures it, two-dimensional, fractal, curved and geometric shapes, thin binary hybrid panels, and modular box systems for large studios.',
    tags: ['diffuser', 'quadratic residue', 'primitive root', 'modulation', 'grating lobes', 'flat-plate frequency', 'fractal', 'binary amplitude', 'maximum-length sequence', 'modular diffuser', 'diffusion coefficient', 'scattering coefficient'],
    sections: [
      { h: 'What “good diffusion” means — and how it is measured', html: `
        <p class="lead">A diffuser’s job is to turn one strong reflection into many weak ones, spread evenly in direction and in time, <i>without</i> removing much energy. Three questions decide whether it is good: how evenly, over what frequency range, and from how far away?</p>
        ${SVG_FAMILY}
        <div class="table-wrap"><table><tr><th>Measure</th><th>What it describes</th><th>How it is obtained</th><th>Use it for</th></tr>
          <tr><td><b>Polar response</b></td><td>Level reflected in each direction, per frequency band</td><td>Microphones on an arc around the sample in a reflection-free space</td><td>Seeing lobes and gaps directly</td></tr>
          <tr><td><b>Diffusion coefficient</b> (0–1)</td><td>How <i>uniform</i> that polar response is</td><td>Calculated from the polar response; often “normalised” against a flat panel of the same size</td><td>Comparing the quality of diffusers</td></tr>
          <tr><td><b>Scattering coefficient</b> (0–1)</td><td>The share of energy <i>not</i> reflected in the mirror direction</td><td>Reverberation-room method with a rotating sample</td><td>Input to room-modelling software</td></tr></table></div>
        <div class="callout warn">The two coefficients are not interchangeable. A surface that redirects everything into one off-mirror direction (a tilted panel, a row of triangles) has a <b>high scattering</b> coefficient but <b>poor diffusion</b>. Always ask which one a data sheet quotes — see <a href="#/academy/m-standards">Acoustic Standards Explained</a>.</div>` },
      { h: 'Phase-grating diffusers: the three numbers that matter', html: `
        <p>A well-type diffuser is a row of slots of different depths. Sound going down a well and back returns late by a different amount from each well, so the reflected wavefront is scrambled. The depths follow a number sequence chosen so that the scrambling is even — the classic is the <b>quadratic-residue sequence</b>, s<sub>n</sub> = n² mod N for a prime N.</p>
        <div class="formula"><span class="lbl">Well depths</span>d<sub>n</sub> = s<sub>n</sub> · c / (2 · N · f₀) &nbsp;·&nbsp; example N = 7, f₀ = 500 Hz: sequence 0 1 4 2 2 4 1 → depths 0, 49, 196, 98, 98, 196, 49 mm</div>
        <div class="table-wrap"><table><tr><th>Design number</th><th>Sets</th><th>Rule</th></tr>
          <tr><td><b>Design frequency f₀</b></td><td>The lowest useful frequency (in practice about half an octave below)</td><td>Deepest well ≈ λ₀/2 × (s<sub>max</sub>/N)</td></tr>
          <tr><td><b>Well width w</b></td><td>The highest useful frequency</td><td>f<sub>max</sub> ≈ c / (2·w): 50 mm → 3.4 kHz</td></tr>
          <tr><td><b>Flat-plate frequency</b></td><td>A frequency where every well returns in step and the diffuser is a mirror</td><td>f = N · f₀ (and multiples): N = 7, f₀ = 500 → 3.5 kHz</td></tr></table></div>
        <p>Keep the flat-plate frequency above f<sub>max</sub> by choosing N large enough: N·f₀ &gt; c/(2w).</p>
        <div class="callout physics"><b>Why deep narrow wells absorb.</b> Air rubs against the fins, neighbouring wells at very different pressures drive air around the fin tops, and the wells act as quarter-wave resonators. A badly built unit (thin fins, leaks, rough wells) can have α of 0.3–0.6 in its working band. Sometimes that is welcome — most often you want rigid, sealed, smooth wells and wells no narrower than about 25 mm.</div>` },
      { h: 'The periodicity problem — and modulation', html: `
        ${SVG_LOBES}
        <p>One unit of seven wells is only 35 cm wide; walls are covered by repeating it. But any repeating structure is a <b>grating</b>: it can only send energy in the directions where sin θ = m·λ / (unit width). More repeats do not add directions — they sharpen the same few spikes. Between the spikes there is very little.</p>
        <p><b>Modulation</b> breaks the repetition without needing dozens of different units:</p>
        <ul><li>Make a second unit that is the <b>inverse</b> of the first (each depth replaced by “maximum minus depth”, or simply the same unit turned end for end if it is asymmetric).</li>
        <li>Arrange the two in an <b>aperiodic order</b> — for example following a pseudo-random binary sequence such as A B A A B B A B.</li>
        <li>Or use <b>one long sequence</b> with a large prime (N = 43, 61 …) that never repeats across the wall.</li></ul>
        <p>Try it: start with six periodic units, look at the spikes, then switch to “modulated”.</p>`, viz: 'diffuserModulation' },
      { h: 'Other sequences, two dimensions and fractals', html: `
        <div class="uc-grid">
          ${uc('🔢', 'Primitive-root sequences', [['Idea', 'Depths from powers of a “primitive root” of a prime; N − 1 wells'], ['Effect', 'Suppresses the mirror reflection at the design frequency instead of evening out all lobes'], ['Use', 'Where the specular reflection is the main enemy (a rear wall behind a listener)']])}
          ${uc('▦', 'Two-dimensional diffusers', [['Idea', 'A grid of blocks or cells whose heights follow a 2-D sequence'], ['Effect', 'Scatters into a hemisphere, so each direction gets less energy (more attenuation of the reflection)'], ['Use', 'Ceilings and rear walls; note each cell needs the same depth as a 1-D well']], '#7a5cc7')}
          ${uc('🌿', 'Fractal (nested) diffusers', [['Idea', 'A small high-frequency diffuser built into the bottom of each well of a large low-frequency one'], ['Effect', 'Extends the bandwidth both down (big, wide wells) and up (small wells)'], ['Use', 'Large rooms where one unit must cover 200 Hz – 8 kHz']], '#4c9a3a')}
          ${uc('🧮', 'Other number tricks', [['Idea', 'Power-residue, Luke and optimised numeric sequences'], ['Effect', 'Trade evenness against depth or bandwidth'], ['Use', 'Mostly for manufacturers; the rules above stay the same']], '#c7772b')}
        </div>` },
      { h: 'Geometric diffusers: arcs, pyramids, triangles and steps', html: `
        <div class="table-wrap"><table><tr><th>Shape</th><th>What it does</th><th>Works from</th><th>Limits</th></tr>
          <tr><td><b>Convex arc (poly-cylinder)</b></td><td>Fans the reflection out evenly in one plane</td><td>Chord ≈ one wavelength upward</td><td>A row of identical arcs is periodic again — vary the widths; cavity behind should be damped</td></tr>
          <tr><td><b>Triangles / wedges</b></td><td><b>Redirect</b>: each face is a small tilted mirror</td><td>Face width ≈ 2 wavelengths upward</td><td>Certain angles send sound straight back; high scattering, poor diffusion</td></tr>
          <tr><td><b>Pyramids</b></td><td>Redirect into four directions</td><td>As triangles</td><td>Good at breaking flutter, weak at true diffusion</td></tr>
          <tr><td><b>Random steps / blocks</b></td><td>Diffuse if step depths and widths vary widely</td><td>Deepest step ≈ λ/4 upward</td><td>Truly random can be worse than designed; use an optimised or sequence-based layout</td></tr>
          <tr><td><b>Optimised curves</b></td><td>A computer searches for the shape with the most even polar response</td><td>Depth-limited as always</td><td>Each shape is specific to its width and band</td></tr></table></div>
        <div class="callout mentor">Concave shapes are never diffusers: they focus. If a design drawing shows a concave curve facing the room, turn it round.</div>` },
      { h: 'Hybrid “binary” diffusers: thin, flat and paintable', html: `
        <p>A phase grating needs depth — 20 cm for 500 Hz. A <b>binary amplitude</b> diffuser takes a different route: a thin rigid sheet with holes or slots in some places and not in others, mounted over an absorber. Where there is a hole the sound goes through and is absorbed (“0”); where there is none it reflects (“1”). If the pattern of 1s and 0s follows a <b>maximum-length sequence</b> — a pseudo-random binary sequence with a flat spectrum — the reflected energy has no regular pattern and is scattered.</p>
        <div class="table-wrap"><table><tr><th>Property</th><th>Typical</th><th>Design lever</th></tr>
          <tr><td>Total depth</td><td>30–100 mm</td><td>Absorber thickness behind the mask</td></tr>
          <tr><td>Scattering band</td><td>From roughly 1 kHz upward for 20–40 mm cells</td><td>Cell size ≈ half a wavelength at the upper end</td></tr>
          <tr><td>Absorption</td><td>Strong in the low-mids (250–800 Hz), falling above</td><td>Open area and backing depth (a perforated-panel resonance)</td></tr>
          <tr><td>Look</td><td>Flat; can hide behind fabric</td><td>Pattern can double as decoration</td></tr></table></div>
        <p>It never diffuses as well as a deep grating (half the energy that would be scattered is absorbed instead), but in small rooms that is often exactly the mix you want: tame the low-mids, keep the highs alive, and use almost no depth.</p>`, viz: 'binaryPanel' },
      { h: 'Modular diffusing elements for large studios', html: `
        ${SVG_MOD}
        <p>Broadcast and orchestral studios need many square metres of treatment that is robust, repeatable and cheap to make. The modular approach uses a small family of standard box-shaped elements — say three depths and two or three widths — fixed to the walls in an <b>irregular arrangement</b>.</p>
        <ul><li><b>Diffusion</b> comes from the steps between boxes of different depth (like a coarse stepped diffuser) and from their varied widths.</li>
        <li><b>Low-frequency absorption</b> comes from the boxes themselves: a light front panel on a sealed, damped cavity is a membrane absorber, and gaps or slots between modules add Helmholtz absorption.</li>
        <li><b>Flexibility:</b> swap a reflective front for an absorbent or perforated one to tune the room’s decay band by band without changing the layout.</li></ul>
        <div class="callout data"><b>Rules of thumb.</b> Use at least three different depths in the ratio of roughly 1 : 2 : 3 (for example 100, 200, 300 mm). Never place two identical modules side by side. Cover 30–50 % of the wall area and distribute the rest as plain absorption or reflective wall. Check the combined absorption: a wall of sealed boxes can absorb far more bass than intended.</div>` },
      { h: 'Absorption by diffusers, and active surfaces', html: `
        <div class="table-wrap"><table><tr><th>Diffuser</th><th>Typical absorption coefficient</th><th>Why</th></tr>
          <tr><td>Well-built 1-D phase grating</td><td>0.1–0.3, peaking around f₀ to 3f₀</td><td>Losses at fins, coupling between wells</td></tr>
          <tr><td>Poorly sealed or thin-finned grating</td><td>0.3–0.6</td><td>Leaks and vibrating fins</td></tr>
          <tr><td>2-D block diffuser</td><td>0.2–0.4</td><td>More edges and surface per m²</td></tr>
          <tr><td>Poly-cylinder (damped cavity)</td><td>0.2–0.4 at low frequencies, low above</td><td>The curved skin is a membrane absorber</td></tr>
          <tr><td>Binary hybrid panel</td><td>0.6–0.9 in the low-mids, 0.3–0.5 above</td><td>By design</td></tr></table></div>
        <p>Count this absorption in your reverberation-time budget — a rear wall of diffusers is not acoustically “free”.</p>
        <p><b>Active</b> absorbers and diffusers use a loudspeaker and microphone under electronic control to present a chosen impedance to the room. They can absorb at low frequencies from a small box, but cost, stability and maintenance keep them rare outside research and specialised bass control.</p>` },
      { h: 'Distance, placement and the listener', html: `
        <p>A diffuser’s scattered sound needs space to blend. Sit too close and you hear the individual wells or lobes as colouration. As a working rule, allow about <b>three wavelengths of the lowest design frequency</b> between a phase grating and the nearest ear or microphone — 2 m for a 500 Hz unit. Curved and hybrid surfaces are more forgiving. The full discussion and a fit-checker are in <a href="#/academy/diffusion">Diffusion &amp; Scattering</a> (section “Diffusers in small rooms”).</p>
        <div class="uc-grid">
          ${uc('🎚️', 'Small control room, 1.5 m behind the seat', [['Problem', 'Too close for a deep grating'], ['Design', 'Deep absorption on the rear wall; binary hybrid panels on the upper side walls and ceiling'], ['Result', 'Low-mids controlled, top end kept, no lobes at the head']])}
          ${uc('🎻', 'Orchestral studio, 14 m wide', [['Problem', 'Needs even, lively sound for players and microphones'], ['Design', 'Modular boxes in three depths over 40 % of the walls, fronts mixed reflective/absorptive'], ['Result', 'Even decay; fronts swapped to trim the bass']], '#7a5cc7')}
          ${uc('🎬', 'Cinema rear wall', [['Problem', 'A slap echo back to the screen'], ['Design', 'Modulated grating array, units and inverses in an irregular order'], ['Result', 'Echo broken up without deadening the room']], '#c7772b')}
          ${uc('🥁', 'Drum room with flutter', [['Problem', 'Parallel walls'], ['Design', 'Poly-cylinders of three different chords on one wall, damped inside'], ['Result', 'Flutter gone plus some bass absorption']], '#2b9fc7')}
        </div>` },
      { h: 'Worked designs', html: `
        <h4>1 · A modulated array for a 3.4 m rear wall</h4>
        <div class="table-wrap"><table><tr><th>Step</th><th>Decision</th><th>Result</th></tr>
          <tr><td>Band</td><td>Diffuse from about 500 Hz to 3 kHz; seat 2.2 m away (≥ 3 × 0.69 m = 2.06 m ✓)</td><td>f₀ = 500 Hz</td></tr>
          <tr><td>Well width</td><td>f<sub>max</sub> = c/(2w) ≥ 3 kHz</td><td>w = 50 mm → 3.43 kHz</td></tr>
          <tr><td>Prime</td><td>N·f₀ must exceed f<sub>max</sub>: N &gt; 6.9</td><td>N = 7 (flat-plate at 3.5 kHz, just above the band)</td></tr>
          <tr><td>Depths</td><td>s·c/(2·N·f₀) with s = 0 1 4 2 2 4 1</td><td>0, 49, 196, 98, 98, 196, 49 mm (+ 12 mm back) → ≈ 210 mm overall</td></tr>
          <tr><td>Unit width</td><td>7 wells × 50 mm + fins</td><td>≈ 0.38 m → 8 units fill 3.04 m; 0.18 m of absorber each side</td></tr>
          <tr><td>Modulation</td><td>Unit A and inverse B (depths 196 − d) in the order A B A A B B A B</td><td>Lobes smeared; check in the simulator with 8 units</td></tr></table></div>
        <h4>2 · A 600 × 600 mm binary hybrid panel</h4>
        <div class="table-wrap"><table><tr><th>Step</th><th>Decision</th><th>Result</th></tr>
          <tr><td>Cells</td><td>16 × 16 grid</td><td>37.5 mm cells → scattering up to c/(2 × 0.0375) ≈ 4.6 kHz</td></tr>
          <tr><td>Pattern</td><td>63-element maximum-length sequence wrapped across the grid</td><td>≈ half the cells open: about 128 holes</td></tr>
          <tr><td>Holes</td><td>22 mm diameter in open cells (≈ 60 % of the cell width)</td><td>Open area ≈ 0.5 × π·22²/(4·37.5²) ≈ 13–14 %</td></tr>
          <tr><td>Sheet and backing</td><td>6 mm plywood or MDF over 50 mm mineral wool, sealed frame</td><td>Absorption centred in the low-mids; overall depth 56 mm</td></tr>
          <tr><td>On the wall</td><td>Rotate neighbouring panels by 90° or use a different pattern</td><td>The wall as a whole does not repeat</td></tr></table></div>
        <p>Design the well depths and check flat-plate and lobe frequencies in the <a href="#/diffusers">Diffuser Designer</a>.</p>` },
      { h: 'Common misunderstandings', html: `
        ${myth([
          ['“More repeats of a diffuser give more diffusion.”', 'They give narrower lobes. Break the repetition with modulation or a longer sequence.'],
          ['“A high scattering coefficient means good diffusion.”', 'A tilted mirror scatters everything away from the specular direction and diffuses nothing.'],
          ['“Diffusers add no absorption.”', 'Typically 0.1–0.4, more if poorly built. Budget for it.'],
          ['“Any random blocks of wood will do.”', 'Random can accidentally be nearly periodic or nearly flat at some frequencies; sequences and optimisation exist to avoid that.'],
          ['“A thin panel with a pattern is as good as a deep one.”', 'Depth still sets the lowest frequency. Thin hybrid panels trade diffusion strength for absorption.'],
        ])}` },
    ],
    quiz: [
      { q: 'What happens when the same diffuser unit is repeated many times along a wall?', opts: ['Diffusion becomes perfectly even', 'Energy concentrates into a few lobe directions', 'It stops reflecting', 'The design frequency drops'], a: 1, why: 'A periodic surface is a grating; more periods sharpen the lobes.' },
      { q: 'A quadratic-residue diffuser has N = 7 and f₀ = 500 Hz. Its first flat-plate frequency is…', opts: ['500 Hz', '1 750 Hz', '3 500 Hz', '7 000 Hz'], a: 2, why: 'f = N·f₀ = 3 500 Hz: every well depth is then a multiple of half a wavelength.' },
      { q: 'Which measure tells you how evenly a surface spreads sound?', opts: ['Scattering coefficient', 'Diffusion coefficient', 'NRC', 'STC'], a: 1, why: 'The diffusion coefficient is calculated from the uniformity of the polar response.' },
      { q: 'A binary hybrid panel…', opts: ['needs wells 200 mm deep', 'absorbs through its holes and reflects from its solid patches in a pseudo-random pattern', 'only works below 100 Hz', 'is a kind of bass trap'], a: 1, why: 'Amplitude rather than phase variation, laid out by a maximum-length sequence.' },
      { q: 'Rows of identical triangles on a wall mainly…', opts: ['absorb bass', 'redirect sound into a few directions', 'diffuse perfectly', 'isolate the room'], a: 1, why: 'Each face is a tilted mirror: high scattering, limited diffusion.' },
    ],
  };
  insertAfter(['m-redirect', 'm-treat-designs'], DIFF);

  /* =====================================================================
     C — workbook
     ===================================================================== */
  const ex = (n, title, given, steps, ans, check) => `<div class="card" style="background:var(--panel2);margin:10px 0"><div class="eyebrow small accent" style="text-transform:uppercase;letter-spacing:.12em;font-weight:700">Example ${n}</div><h4 style="margin:.2em 0 .4em;text-transform:none;letter-spacing:0">${title}</h4><p style="margin:.2em 0"><b>Given:</b> ${given}</p><ol style="margin:.3em 0;padding-left:20px">${steps.map((s) => `<li>${s}</li>`).join('')}</ol><p style="margin:.3em 0"><b>Answer:</b> <span class="good">${ans}</span></p><p class="small muted" style="margin:0"><b>Sanity check:</b> ${check}</p></div>`;
  const BOOK = {
    id: 'workbook', n: '21', title: 'Workbook: Practice Problems with Worked Solutions', level: 'Core', mins: 60,
    summary: 'Sixteen kinds of practice problem with fresh numbers every time, checked answers and worked solutions — plus sixteen fully worked examples and a formula sheet.',
    tags: ['practice', 'problems', 'worked examples', 'decibels', 'reverberation', 'isolation', 'room modes', 'formula sheet'],
    sections: [
      { h: 'How to use the workbook', html: `
        <p class="lead">Reading about acoustics builds recognition; solving problems builds skill. Ten minutes here after each course will do more than re-reading it.</p>
        ${flow([['Pick a topic', 'sixteen types, from decibels to duct velocity'], ['Solve on paper', 'write the formula before the numbers'], ['Check', 'answers are accepted within about 3 % or 0.5 dB'], ['Read the solution', 'even when you were right'], ['New numbers', 'repeat until it is boring']])}
        <div class="callout mentor">Always finish with a sanity check: is the answer in the range you would expect? A level higher than the loudest source but less than 5 dB above it; a wavelength between a couple of centimetres and 17 m; a room mode between 20 and 100 Hz. Catching nonsense is the most valuable habit in engineering.</div>`, viz: 'workbook' },
      { h: 'Levels and decibels', html: `
        ${ex(1, 'Adding three sources', '85 dB, 88 dB and 90 dB measured separately at the same position.', ['Convert to relative power: 10^8.5 = 3.16 × 10⁸, 10^8.8 = 6.31 × 10⁸, 10^9.0 = 10.0 × 10⁸.', 'Add: 19.47 × 10⁸.', 'Convert back: 10·log₁₀(19.47 × 10⁸).'], '92.9 dB', 'Above the loudest (90 dB) by less than 4.8 dB ✓.')}
        ${ex(2, 'Two identical sources', 'Two machines, each 80 dB alone.', ['Doubling the power adds 10·log₁₀(2) = 3 dB.'], '83 dB', 'Not 160 dB — decibels are logarithms and never simply add.')}` },
      { h: 'Distance and barriers', html: `
        ${ex(3, 'Level at a distance', 'A loudspeaker outdoors gives 94 dB at 1 m. Find the level at 8 m.', ['L₂ = L₁ − 20·log₁₀(r₂/r₁) = 94 − 20·log₁₀(8).', '20·log₁₀(8) = 18.1 dB.'], '75.9 dB', 'Three doublings of distance (1→2→4→8) at 6 dB each = 18 dB ✓.')}
        ${ex(4, 'A garden wall as a noise barrier', 'The path over the wall is 0.5 m longer than the straight line. Frequency 500 Hz.', ['Fresnel number N = 2·δ·f/c = 2 × 0.5 × 500 / 343 = 1.46.', 'Attenuation ≈ 10·log₁₀(3 + 20·N) = 10·log₁₀(32.2).'], '≈ 15 dB', 'At 125 Hz the same wall gives only about 10 dB: barriers are weak for bass.')}` },
      { h: 'Wavelength and room modes', html: `
        ${ex(5, 'Wavelengths', 'Find λ at 50 Hz and at 2 kHz.', ['λ = c / f = 343 / 50 = 6.86 m.', '343 / 2000 = 0.172 m.'], '6.86 m and 17.2 cm', 'A 40 : 1 frequency ratio gives a 40 : 1 size ratio — why one treatment cannot suit both.')}
        ${ex(6, 'First axial modes of a room', 'Room 5.2 × 3.8 × 2.6 m.', ['Length: 343 / (2 × 5.2) = 33.0 Hz.', 'Width: 343 / (2 × 3.8) = 45.1 Hz.', 'Height: 343 / (2 × 2.6) = 66.0 Hz — note that this is exactly twice the length mode (2.6 m is half of 5.2 m).'], '33.0, 45.1 and 66.0 Hz', 'The height mode stacks on the second length mode at 66 Hz: a likely “one-note” problem.')}
        ${ex(7, 'Schroeder frequency', 'The same room (V = 51.4 m³) with RT60 = 0.35 s.', ['f<sub>S</sub> = 2000·√(T/V) = 2000·√(0.35 / 51.4).', '√(0.00681) = 0.0825.'], '≈ 165 Hz', 'Typical of small studios (100–250 Hz) ✓.')}` },
      { h: 'Reverberation and absorption', html: `
        ${ex(8, 'Sabine reverberation time', 'Room 5.2 × 3.8 × 2.6 m. Carpeted floor α = 0.30, plaster ceiling α = 0.05, walls α = 0.04 (500 Hz).', ['V = 51.4 m³; floor and ceiling 19.76 m² each; walls 2 × (5.2 + 3.8) × 2.6 = 46.8 m².', 'A = 19.76 × 0.30 + 19.76 × 0.05 + 46.8 × 0.04 = 5.93 + 0.99 + 1.87 = 8.79 m² sabins.', 'RT = 0.161 × 51.4 / 8.79.'], '≈ 0.94 s', 'Far too long for a control room (target ≈ 0.3 s) — consistent with a bare, carpeted room.')}
        ${ex(9, 'How much absorption to add', 'Bring the room above from 0.94 s to 0.35 s.', ['Total needed: A = 0.161 × 51.4 / 0.35 = 23.6 m² sabins.', 'To add: 23.6 − 8.8 = 14.8 m² sabins.', 'With panels of α = 0.9: 14.8 / 0.9.'], '≈ 16.5 m² of panel', 'About a quarter of the wall and ceiling area — the usual range for small critical rooms ✓.')}` },
      { h: 'Sound isolation and composite walls', html: `
        ${ex(10, 'A good wall with a door', 'A 12 m² wall, TL 55 dB, with a 1.9 m² door of TL 30 dB.', ['Transmitted fractions: wall 10.1 × 10^−5.5 = 3.19 × 10⁻⁵; door 1.9 × 10⁻³ = 1.90 × 10⁻³.', 'Average: (3.19 × 10⁻⁵ + 1.90 × 10⁻³) / 12 = 1.61 × 10⁻⁴.', 'TL = −10·log₁₀(1.61 × 10⁻⁴).'], '≈ 37.9 dB', 'The door, 16 % of the area, has cost 17 dB. Result ≈ door TL + 10·log(12/1.9) = 30 + 8 ✓.')}
        ${ex(11, 'The same wall with a gap under the door', 'Add a 10 mm × 0.9 m gap (0.009 m², TL 0 dB).', ['Add the gap’s fraction: 0.009 × 1 = 9.0 × 10⁻³.', 'Average: (3.2 × 10⁻⁵ + 1.90 × 10⁻³ + 9.0 × 10⁻³) / 12 = 9.11 × 10⁻⁴.', 'TL = −10·log₁₀(9.11 × 10⁻⁴).'], '≈ 30.4 dB', 'A gap the size of a ruler has cost another 7.5 dB: seal first.')}
        ${ex(12, 'Required isolation', 'Drums reach 105 dB in the studio; the neighbour should receive no more than 30 dB; allow 5 dB for flanking.', ['Required = 105 − 30 + 5.'], '80 dB', 'Beyond any single wall: a room-in-room job — and check 63 Hz separately.')}` },
      { h: 'Noise, HVAC and vibration', html: `
        ${ex(13, 'Duct velocity', '300 m³/h through a 200 mm round duct.', ['Area = π × 0.2² / 4 = 0.0314 m².', 'Flow = 300 / 3600 = 0.0833 m³/s.', 'v = 0.0833 / 0.0314.'], '≈ 2.65 m/s', 'Fine for a main duct (under 3 m/s). For 1.5 m/s at the grille you need 0.0833 / 1.5 = 0.056 m² of free area.')}
        ${ex(14, 'Isolators for a floating floor', 'Target natural frequency 8 Hz.', ['d = (15.8 / f<sub>n</sub>)² = (15.8 / 8)² = 3.9 mm static deflection.', 'Isolation starts at √2 × 8 = 11.3 Hz.', 'At 50 Hz the frequency ratio is 6.25; transmissibility ≈ 1/(6.25² − 1) = 0.026.'], '3.9 mm deflection; about 32 dB reduction at 50 Hz (undamped ideal)', 'Real floors with damping and trapped air achieve less — design with margin.')}` },
      { h: 'Speech and sound systems', html: `
        ${ex(15, 'Critical distance in a hall', 'V = 1 200 m³, RT60 = 1.4 s, loudspeaker Q = 5.', ['D<sub>c</sub> = 0.057·√(Q·V/T) = 0.057 × √(5 × 1200 / 1.4).', '√(4286) = 65.5.'], '≈ 3.7 m', 'Most seats are farther than this, so they hear mainly reverberation: use more directional loudspeakers or add absorption.')}
        ${ex(16, 'Delay for a fill loudspeaker', 'A delay speaker stands 34 m in front of the main system.', ['t = d / c = 34 / 343 = 0.0991 s.'], '≈ 99 ms (set about 109 ms so the main system arrives first)', '≈ 2.9 ms per metre ✓.')}` },
      { h: 'Formula sheet', html: `
        <div class="table-wrap"><table><tr><th>Topic</th><th>Formula</th><th>Notes</th></tr>
          <tr><td>Add levels</td><td>L = 10·log₁₀ Σ 10^(Lᵢ/10)</td><td>two equal sources: +3 dB</td></tr>
          <tr><td>Distance (point source)</td><td>L₂ = L₁ − 20·log₁₀(r₂/r₁)</td><td>−6 dB per doubling</td></tr>
          <tr><td>Wavelength</td><td>λ = c / f</td><td>c = 343 m/s at 20 °C</td></tr>
          <tr><td>Axial room modes</td><td>f = n·c / (2·L)</td><td>each dimension separately</td></tr>
          <tr><td>Schroeder frequency</td><td>f<sub>S</sub> = 2000·√(T / V)</td><td>T in s, V in m³</td></tr>
          <tr><td>Sabine</td><td>RT60 = 0.161·V / A, A = Σ S·α</td><td>metric units</td></tr>
          <tr><td>Absorption to add</td><td>ΔA = 0.161·V·(1/T₂ − 1/T₁)</td><td></td></tr>
          <tr><td>NRC</td><td>mean of α at 250, 500, 1k, 2k, rounded to 0.05</td><td>ignores bass</td></tr>
          <tr><td>Composite TL</td><td>TL = −10·log₁₀( Σ Sᵢ·10^(−TLᵢ/10) / ΣSᵢ )</td><td>a gap has TL = 0</td></tr>
          <tr><td>Barrier</td><td>A ≈ 10·log₁₀(3 + 20·N), N = 2δf/c</td><td>limit ≈ 24 dB</td></tr>
          <tr><td>Critical distance</td><td>D<sub>c</sub> = 0.057·√(Q·V / T)</td><td></td></tr>
          <tr><td>Flutter rate</td><td>f = c / (2·d)</td><td>d between parallel walls</td></tr>
          <tr><td>Isolator deflection</td><td>f<sub>n</sub> ≈ 15.8 / √d<sub>mm</sub></td><td>isolates above √2·f<sub>n</sub></td></tr>
          <tr><td>Duct velocity</td><td>v = Q / A</td><td>Q in m³/s</td></tr>
          <tr><td>Delay</td><td>t = d / c</td><td>≈ 2.9 ms per metre</td></tr></table></div>
        <p>Check your work with the app’s tools: <a href="#/calc">Calculators</a> · <a href="#/analyzer">Room Analyzer</a> · <a href="#/isolation">Soundproofing planner</a> · <a href="#/floors">Floating Floors</a>.</p>` },
    ],
    quiz: [
      { q: 'Two sources of 70 dB and 70 dB together give…', opts: ['140 dB', '76 dB', '73 dB', '70 dB'], a: 2, why: 'Doubling the power adds 3 dB.' },
      { q: 'A 60 dB wall has a hole of 0.1 % of its area. The result is closest to…', opts: ['60 dB', '50 dB', '30 dB', '10 dB'], a: 2, why: 'τ ≈ 0.001 from the hole dominates: −10·log(0.001) = 30 dB.' },
      { q: 'First length mode of a 4 m room?', opts: ['21 Hz', '43 Hz', '86 Hz', '172 Hz'], a: 1, why: '343 / (2 × 4) = 42.9 Hz.' },
      { q: 'A room’s RT must halve. The total absorption must…', opts: ['halve', 'stay the same', 'double', 'increase by 3 dB'], a: 2, why: 'RT is inversely proportional to A.' },
      { q: 'Which is a good sanity check for an added-levels answer?', opts: ['It equals the sum of the numbers', 'It is a little above the loudest source', 'It is below the quietest source', 'It is always +6 dB'], a: 1, why: 'The total is above the loudest source but by no more than 10·log(number of sources).' },
    ],
  };
  insertAfter(['workflow', 'measurement'], BOOK);
})();
