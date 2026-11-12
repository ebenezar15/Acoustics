/* ==========================================================================
   Master Class M18D — Waveguides: guiding sound into traps, out of
   loudspeakers and around the room. Theory, calculation, design, placement.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design|result/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const C = 343;
  const beam = (dmm, f) => { const x = (0.705 * (C / f)) / (dmm / 1000); return x >= 1 ? 'all round' : Math.round((2 * Math.asin(x) * 180) / Math.PI) + '°'; };
  const pcf = (deg, mm) => Math.round(2.54e7 / (deg * mm) / 10) * 10;

  /* ---------- diagrams ---------- */
  const SVG_TWO = `<svg class="gsvg" viewBox="0 0 700 230" role="img" aria-label="Two kinds of waveguide in a studio">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">One idea, two jobs: make sound travel the way you choose</text>
    <g><rect x="20" y="34" width="320" height="150" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
      <rect x="290" y="46" width="14" height="126" fill="var(--muted)"/>
      ${[0, 1, 2].map((k) => `<path d="M60 ${52 + k * 42} L286 ${70 + k * 42} L60 ${88 + k * 42}" fill="none" stroke="var(--text)" stroke-width="2"/><path d="M70 ${56 + k * 42} L270 ${70 + k * 42} L70 ${84 + k * 42}" fill="none" stroke="var(--c4)" stroke-width="5" opacity=".7"/>`).join('')}
      ${[0, 1, 2].map((k) => `<g class="wave-in" style="animation-delay:${k * 0.3}s"><path d="M40 ${60 + k * 42} q8 10 0 20" fill="none" stroke="var(--c3)" stroke-width="2.5"/></g>`).join('')}
      <text x="180" y="202" text-anchor="middle" font-size="11" font-weight="700">Absorbing waveguide</text><text x="180" y="218" text-anchor="middle" font-size="10" fill="var(--muted)">leads sound into depth, where it fades</text></g>
    <g><rect x="360" y="34" width="320" height="150" rx="10" fill="var(--panel2)" stroke="var(--line)"/>
      <rect x="390" y="70" width="60" height="78" rx="5" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/>
      <path d="M450 100 L478 82 L478 136 L450 118z" fill="var(--accent2)"/><circle cx="446" cy="109" r="5" fill="var(--accent)"/>
      <path d="M480 109 L650 60 L650 158z" fill="var(--accent)" opacity=".14"/>
      ${[1, 2, 3].map((k) => `<path class="leak-pulse" style="animation-delay:${k * 0.2}s" d="M${480 + k * 46} ${109 - k * 14} q${10 + k * 4} ${k * 14} 0 ${k * 28}" fill="none" stroke="var(--accent)" stroke-width="2"/>`).join('')}
      <text x="520" y="202" text-anchor="middle" font-size="11" font-weight="700">Loudspeaker waveguide</text><text x="520" y="218" text-anchor="middle" font-size="10" fill="var(--muted)">shapes how widely sound leaves the driver</text></g>
  </svg>`;

  const SVG_CUT = `<svg class="gsvg" viewBox="0 0 700 200" role="img" aria-label="Plane wave below cut-off, cross modes above">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Inside a channel: below the cut-off only a flat (plane) wave travels</text>
    ${[['Below c / 2w: plane wave', 30, false], ['Above c / 2w: cross-modes too', 370, true]].map(([t, x, hi]) => `<g>
      <line x1="${x}" y1="50" x2="${x + 300}" y2="50" stroke="var(--text)" stroke-width="4"/><line x1="${x}" y1="130" x2="${x + 300}" y2="130" stroke="var(--text)" stroke-width="4"/>
      ${hi ? Array.from({ length: 9 }, (_, i) => `<path d="M${x + 14 + i * 32} 54 l16 36 l-16 36" fill="none" stroke="var(--warn)" stroke-width="2" opacity=".8"/>`).join('') : Array.from({ length: 7 }, (_, i) => `<line class="leak-pulse" style="animation-delay:${i * 0.15}s" x1="${x + 20 + i * 42}" y1="54" x2="${x + 20 + i * 42}" y2="126" stroke="var(--c3)" stroke-width="3"/>`).join('')}
      <text x="${x - 6}" y="94" text-anchor="end" font-size="11" font-weight="700">w</text>
      <text x="${x + 150}" y="156" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <text x="${x + 150}" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">${hi ? 'sound also zig-zags between the walls' : 'predictable: behaves like a 1-D pipe'}</text></g>`).join('')}
    <text x="350" y="194" text-anchor="middle" font-size="10" fill="var(--muted)">Design low-frequency waveguides for the plane-wave range; above it they still absorb, just less tidily.</text>
  </svg>`;

  const SVG_TERM = `<svg class="gsvg" viewBox="0 0 700 210" role="img" aria-label="Abrupt end versus tapered end">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Sudden change reflects — gradual change lets the wave in</text>
    <g><line x1="30" y1="50" x2="310" y2="50" stroke="var(--text)" stroke-width="3"/><line x1="30" y1="130" x2="310" y2="130" stroke="var(--text)" stroke-width="3"/>
      <rect x="250" y="52" width="60" height="76" fill="var(--c4)" opacity=".8"/>
      <path d="M60 90 H240" stroke="var(--c3)" stroke-width="3"/><path d="M240 90 l-12 -7 v14z" fill="var(--c3)"/>
      <path class="leak-pulse" d="M236 108 H80" stroke="var(--bad)" stroke-width="3"/><path d="M80 108 l12 -7 v14z" fill="var(--bad)"/>
      <text x="170" y="156" text-anchor="middle" font-size="11" font-weight="700">Abrupt face</text><text x="170" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">conditions change at once → part bounces back</text></g>
    <g><line x1="390" y1="50" x2="670" y2="50" stroke="var(--text)" stroke-width="3"/><line x1="390" y1="130" x2="670" y2="130" stroke="var(--text)" stroke-width="3"/>
      <path d="M470 52 L670 52 L670 86z M470 128 L670 128 L670 94z" fill="var(--c4)" opacity=".8"/>
      <path d="M410 90 H640" stroke="var(--c3)" stroke-width="3"/><path d="M640 90 l-12 -7 v14z" fill="var(--c3)"/>
      <path class="leak-pulse" d="M470 108 H430" stroke="var(--bad)" stroke-width="1.5" opacity=".6"/>
      <text x="530" y="156" text-anchor="middle" font-size="11" font-weight="700">Tapered (wedge)</text><text x="530" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">absorption builds up gently → little comes back</text></g>
    <text x="350" y="198" text-anchor="middle" font-size="10" fill="var(--muted)">The same rule shapes anechoic wedges, horn mouths and loudspeaker waveguides. The taper should be at least about λ/4 long.</text>
  </svg>`;

  const SVG_PLAN = `<svg class="gsvg" viewBox="0 0 700 270" role="img" aria-label="Control room with a rear-wall waveguide trap">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Rear-wall waveguide trap in a small control room (plan)</text>
    <rect x="40" y="34" width="620" height="200" fill="var(--panel2)" stroke="var(--text)" stroke-width="4"/>
    <rect x="100" y="84" width="18" height="18" fill="var(--accent)"/><rect x="100" y="166" width="18" height="18" fill="var(--accent)"/>
    <circle cx="300" cy="134" r="9" fill="var(--good)"/><text x="300" y="160" text-anchor="middle" font-size="10">seat</text>
    <line x1="480" y1="38" x2="480" y2="230" stroke="var(--accent)" stroke-dasharray="6 4"/><text x="474" y="52" text-anchor="end" font-size="10" fill="var(--accent)">fabric front</text>
    ${[0, 1, 2, 3].map((k) => { const y = 40 + k * 48; return `<path d="M484 ${y} L654 ${y + 24} L484 ${y + 48}" fill="none" stroke="var(--text)" stroke-width="2.5"/><path d="M494 ${y + 5} L640 ${y + 24} L494 ${y + 43}" fill="none" stroke="var(--c4)" stroke-width="6" opacity=".7"/><g class="wave-in" style="animation-delay:${k * 0.25}s"><path d="M440 ${y + 14} q8 10 0 20" fill="none" stroke="var(--c3)" stroke-width="2.5"/></g>`; }).join('')}
    <path d="M118 93 L300 134 M118 175 L300 134" stroke="var(--good)" stroke-width="1.5"/>
    <path class="leak-pulse" d="M300 134 H440" stroke="var(--c3)" stroke-width="2" stroke-dasharray="5 4"/>
    <line x1="484" y1="246" x2="656" y2="246" stroke="var(--muted)"/><text x="570" y="262" text-anchor="middle" font-size="10" fill="var(--muted)">1.2 m deep · mouths ≈ 0.4 m · lined both faces</text>
    <text x="180" y="262" text-anchor="middle" font-size="10" fill="var(--muted)">bass that reaches the rear wall is led in and does not return</text>
  </svg>`;

  const SVG_SPK = `<svg class="gsvg" viewBox="0 0 700 264" role="img" aria-label="Loudspeaker with and without a waveguide">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Just above the crossover: bare dome vs dome in a waveguide (seen from above)</text>
    ${[['Bare dome on a flat baffle', 30, false], ['Dome in a waveguide', 370, true]].map(([t, x, wg]) => `<g transform="translate(0 24)">
      <rect x="${x + 120}" y="150" width="60" height="40" rx="5" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
      ${wg ? `<path d="M${x + 140} 150 L${x + 128} 138 L${x + 172} 138 L${x + 160} 150z" fill="var(--accent2)"/>` : ''}
      <path d="M${x + 150} ${wg ? 140 : 150} L${x + (wg ? 70 : 10)} ${wg ? 40 : 110} A 150 150 0 0 1 ${x + (wg ? 230 : 290)} ${wg ? 40 : 110}z" fill="var(--accent2)" opacity=".2"/>
      <path d="M${x + 150} 150 L${x + 96} 40 A 120 120 0 0 1 ${x + 204} 40z" fill="var(--c3)" opacity=".25"/>
      <text x="${x + 150}" y="72" text-anchor="middle" font-size="10" fill="var(--c3)">woofer beam</text>
      <text x="${x + (wg ? 262 : 40)}" y="${wg ? 60 : 128}" text-anchor="middle" font-size="10" fill="var(--accent2)">tweeter</text>
      <text x="${x + 150}" y="208" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <text x="${x + 150}" y="224" text-anchor="middle" font-size="10" fill="var(--${wg ? 'good' : 'bad'})">${wg ? 'same width as the woofer: even tone off-axis' : 'far wider than the woofer: bright side-wall reflections'}</text></g>`).join('')}
  </svg>`;

  const L = {
    id: 'm-waveguides', n: 'M18D', track: 'master', title: 'Waveguides: Guiding Sound into Traps, out of Loudspeakers and around the Room', level: 'Advanced', mins: 50,
    summary: 'In studios “waveguide” means two things: lined channels that lead bass into depth to be absorbed, and the shaped flare around a tweeter that sets how widely a loudspeaker radiates. One piece of theory covers both — then how to calculate, design and place each.',
    tags: ['waveguide', 'absorbing waveguide', 'rear wall trap', 'cut-off frequency', 'taper', 'quarter wave', 'transmission line', 'loudspeaker waveguide', 'constant directivity', 'pattern control', 'beamwidth', 'horn'],
    sections: [
      { h: 'What a waveguide is — and the two kinds you meet in a studio', html: `
        <p class="lead">A waveguide is any channel or flare that makes sound travel in a way you chose instead of spreading freely. Studio people use the word for two different things:</p>
        ${SVG_TWO}
        <ul><li><b>Absorbing waveguides</b> — rigid, absorbent-lined guide panels in a deep rear wall, ceiling void or corner. They lead low-frequency sound into the depth of the trap and take energy out of it along the way.</li>
        <li><b>Loudspeaker waveguides</b> — the shaped surface around a tweeter (or the horn of a PA speaker). They decide how wide the beam is and keep it the same width over a range of frequencies.</li></ul>
        ${flow([['Theory', 'plane waves, cut-off, taper, quarter-wave'], ['Absorbing waveguides', 'calculate, design, place'], ['Loudspeaker waveguides', 'calculate, choose, aim'], ['The room', 'what directivity means for treatment']])}
        <div class="callout physics">Both kinds obey the same three ideas: a channel narrower than half a wavelength carries a simple plane wave; a <b>sudden</b> change of cross-section reflects sound while a <b>gradual</b> one does not; and nothing works well until its length is around a quarter of the wavelength.</div>` },
      { h: 'The theory you need, in plain words', html: `
        ${SVG_CUT}
        <div class="formula"><span class="lbl">Cut-off of a channel of width w</span>f<sub>c</sub> = c / (2·w) &nbsp;·&nbsp; below it only the plane wave travels along the channel</div>
        <div class="table-wrap"><table><tr><th>Channel width</th>${[0.15, 0.2, 0.3, 0.4, 0.6, 0.8].map((w) => `<th class="num">${w * 100} cm</th>`).join('')}</tr>
          <tr><td>Plane wave only below</td>${[0.15, 0.2, 0.3, 0.4, 0.6, 0.8].map((w) => `<td class="num">${Math.round(C / (2 * w))} Hz</td>`).join('')}</tr></table></div>
        ${SVG_TERM}
        <div class="formula"><span class="lbl">How long must it be?</span>L ≈ c / (4·f) &nbsp;→&nbsp; 50 Hz: 1.7 m · 70 Hz: 1.2 m · 100 Hz: 0.86 m · 200 Hz: 0.43 m</div>
        <p><b>Grazing absorption.</b> Sound travelling <i>along</i> an absorbent face loses a little energy with every wavelength it travels, because the air next to the lining is dragged through the fibres. So a lined channel absorbs more when it is <b>longer</b>, <b>narrower</b> and lined on <b>both</b> faces — exactly how a duct silencer works. Below the quarter-wave length there is simply not enough path for much to happen.</p>
        <div class="callout data"><b>Rules of thumb.</b> Path length ≥ c/(4f) for the lowest frequency you want. Channel width well under half a wavelength of the range you are targeting. Change things gradually: taper the channel or step the lining. Line both faces, leaving an open core.</div>` },
      { h: 'Absorbing waveguide traps', html: `
        <p>A waveguide trap divides a deep cavity — usually the whole rear wall behind a fabric front — into channels with rigid guide panels (15–18 mm board), each lined with mineral wool, polyester or felt. Sound arriving at the rear wall enters the mouths, travels along between the absorbent faces and fades before it can return to the room.</p>
        <div class="table-wrap"><table><tr><th></th><th>Waveguide trap</th><th>Hangers</th><th>Plain deep wool fill</th></tr>
          <tr><td>Layout</td><td>Fixed, ordered channels</td><td>Free-hanging wrapped boards</td><td>Cavity packed or layered</td></tr>
          <tr><td>How it absorbs</td><td>Grazing loss along lined channels; gentle taper</td><td>Air squeezing past swaying, damped boards</td><td>Friction through the bulk</td></tr>
          <tr><td>Strong point</td><td>Predictable depth limit; rigid, tidy build; edges can be angled away from the listener</td><td>Very low reach in very deep cavities; cheap</td><td>Simple; best above ≈ 100 Hz</td></tr>
          <tr><td>Watch</td><td>Needs careful carpentry</td><td>Heavy ceiling load; boards must not touch</td><td>Too dense a fill reflects bass</td></tr></table></div>
        <p>The two are often <b>combined</b>: waveguide panels form the channels, and hangers or loose wool fill the deepest part of each one. See <a href="#/academy/m-hangers">Acoustic Hangers</a>.</p>
        <div class="callout warn">The behaviour of built waveguide traps is partly empirical — there is no simple exact formula for a lined, tapered, angled channel. The simulator below is an indicative model: use it to compare options, then build and measure the decay before and after.</div>`, viz: 'waveguideTrap' },
      { h: 'How to calculate and design an absorbing waveguide', html: `
        ${flow([['Target', 'lowest frequency f you need to control'], ['Path', 'L ≥ c / (4f); fold the channel if depth is short'], ['Mouth width', '0.3–0.5 m: plane waves through the bass range'], ['Lining', 'each face ≈ 10–30 % of the channel width'], ['Taper', 'narrow the channel or step the lining thicker toward the back'], ['Angle', '20–45° so panel edges do not reflect to the seat'], ['Build', 'rigid 15–18 mm panels, fixed top and bottom'], ['Front', 'open fabric or slats; then measure']])}
        <div class="table-wrap"><table><tr><th>Worked example</th><th>Calculation</th><th>Result</th></tr>
          <tr><td>Room 4.6 × 3.4 m, 1.2 m available at the rear</td><td>Second length mode ≈ 343 / 4.6 = 75 Hz is the target</td><td>Need L ≥ 343 / (4 × 75) = 1.14 m</td></tr>
          <tr><td>Path</td><td>1.2 m deep, panels angled 30° → path ≈ 1.2 / cos 15° ≈ 1.24 m</td><td>Useful from ≈ 343 / (4 × 1.24) ≈ <b>69 Hz</b></td></tr>
          <tr><td>Channels</td><td>3.4 m wall ÷ 0.4 m mouths</td><td>8 channels; plane-wave range up to 343 / 0.8 ≈ 430 Hz</td></tr>
          <tr><td>Lining</td><td>50 mm on each face of a 400 mm channel</td><td>25 % of the width is lined: an open core remains</td></tr>
          <tr><td>For the 37 Hz first mode</td><td>Would need 343 / (4 × 37) = 2.3 m</td><td>Fold the channels (≈ doubles the path) or use tuned traps for that one mode</td></tr></table></div>
        <div class="callout safety">Tall lined panels are heavy and can topple while being fitted. Fix each to floor and ceiling battens, and use wool faced or wrapped so that fibres are not shed into the room’s air.</div>` },
      { h: 'Where to put them', html: `
        ${SVG_PLAN}
        <div class="uc-grid">
          ${uc('🧱', 'Rear wall', [['Why', 'It receives the direct bass and every length mode has pressure there'], ['Do', 'Full width and height if you can; mouths facing the room behind open fabric']])}
          ${uc('☁️', 'Ceiling, seat to rear', [['Why', 'Height modes and the ceiling bounce'], ['Do', 'Shallow channels running front-to-back above a fabric or slatted ceiling']], '#7a5cc7')}
          ${uc('◣', 'Corners', [['Why', 'Pressure maximum for almost every mode'], ['Do', 'Triangular waveguides: panels fanning into the corner, lined both sides']], '#c7772b')}
          ${uc('🪑', 'Under risers and benches', [['Why', 'Free depth in cinema rooms and rear couches'], ['Do', 'Open the riser front with slots; line the joist bays as channels']], '#2b9fc7')}
        </div>
        <ul><li>The <b>mouths must see the room</b>: no cabinets, racks or sofas hard against them.</li>
        <li>Keep a removable fabric frame for <b>access</b> — you will want to adjust linings after measuring.</li>
        <li>Combine with <a href="#/academy/m-redirect">redirectors</a>: side panels steer mid/high reflections to the rear, where the waveguide trap swallows them.</li>
        <li>A slatted or diffusing face across the mouths keeps some high-frequency life in the room while bass passes through.</li></ul>` },
      { h: 'Relatives: pipes, labyrinths, wedges and silencers', html: `
        <div class="table-wrap"><table><tr><th>Device</th><th>How it is a waveguide</th><th>Size it by</th><th>Use</th></tr>
          <tr><td><b>Quarter-wave tube / pipe</b></td><td>A closed pipe resonates when its length is λ/4; wool at the closed end damps it</td><td>L = c / (4f); also works at 3f, 5f …</td><td>One stubborn mode; corner pipes</td></tr>
          <tr><td><b>Labyrinth (transmission-line) trap</b></td><td>A long folded lined channel in a compact box</td><td>Total path ≈ c / (4f)</td><td>Low reach from a shallow wall</td></tr>
          <tr><td><b>Anechoic wedge</b></td><td>A tapered absorber: gradual change, almost no reflection</td><td>Wedge length ≈ λ/4 of the lowest frequency</td><td>Test chambers; the model for tapered linings</td></tr>
          <tr><td><b>Duct silencer / baffle box</b></td><td>Lined channels that air passes through and sound does not</td><td>Longer + narrower airways = more attenuation</td><td>Every duct into a studio — see <a href="#/academy/m-hvac">HVAC</a></td></tr></table></div>` },
      { h: 'Loudspeaker waveguides: why they exist', html: `
        ${SVG_SPK}
        <p>A cone or dome radiates widely while it is small compared with the wavelength and narrows into a beam as frequency rises. Near the crossover a 165 mm woofer is already beaming, but the 25 mm tweeter that takes over is still spraying sound in all directions. On axis the speaker can measure flat; off axis there is a sudden <b>flare of energy</b> just above the crossover, so the reflections from your side walls are brighter than the direct sound.</p>
        <p>A waveguide fixes that: it narrows the tweeter’s radiation to match the woofer at the hand-over, keeps the beam the same width higher up (constant directivity), gives the tweeter extra output at the bottom of its range (so it works less hard), and smooths the diffraction from the cabinet edges.</p>`, viz: 'speakerWaveguide' },
      { h: 'How to calculate a loudspeaker waveguide', html: `
        <div class="formula"><span class="lbl">How low does it hold its pattern?</span>f ≈ 25 000 000 / (coverage angle in degrees × mouth width in mm) &nbsp;(= 10⁶ / (angle × mouth in inches))</div>
        <div class="table-wrap"><table><tr><th>Mouth width</th><th class="num">120°</th><th class="num">100°</th><th class="num">90°</th><th class="num">60°</th></tr>
          ${[100, 150, 200, 300].map((m) => `<tr><td>${m} mm</td>${[120, 100, 90, 60].map((a) => `<td class="num">${pcf(a, m)} Hz</td>`).join('')}</tr>`).join('')}</table></div>
        <div class="formula"><span class="lbl">How wide is the woofer’s beam?</span>−6 dB beam edge where sin(θ/2) ≈ 0.7 · λ / d &nbsp;(d = cone diameter)</div>
        <div class="table-wrap"><table><tr><th>Woofer cone</th>${[1500, 2000, 2500, 3000].map((f) => `<th class="num">${f / 1000} kHz</th>`).join('')}</tr>
          ${[130, 165, 200, 250].map((d) => `<tr><td>${d} mm</td>${[1500, 2000, 2500, 3000].map((f) => `<td class="num">${beam(d, f)}</td>`).join('')}</tr>`).join('')}</table></div>
        ${flow([['Woofer', 'find its beamwidth at the planned crossover'], ['Coverage', 'choose a waveguide angle close to that'], ['Mouth', 'big enough that the pattern holds down to the crossover'], ['Crossover', 'move it until the two widths meet'], ['Spacing', 'drivers as close as possible, ideally within one wavelength'], ['Verify', 'off-axis measurements every 15°']])}
        <ul><li><b>Coverage choice:</b> 100–120° for small near-fields at short distance; 80–90° is the common studio choice; narrower (40–60°) for long throws and reverberant live rooms.</li>
        <li><b>Mouth:</b> blend it into the baffle with a generous round-over. A sharp mouth edge diffracts and causes ripples.</li>
        <li><b>Throat:</b> it must match the dome’s diameter and angle without a step.</li>
        <li><b>Profile:</b> conical (straight walls, simple, good pattern control), oblate-spheroidal and elliptical (smooth, low diffraction), exponential horn (most output, less constant pattern; flare cut-off f<sub>c</sub> = m·c / 4π for flare constant m).</li>
        <li><b>Vertical:</b> two drivers one above the other interfere above and below the axis. Keep the centre-to-centre spacing near or under one wavelength at the crossover (2 kHz → 17 cm), and expect a narrower clean window vertically than horizontally.</li></ul>` },
      { h: 'What it means for the room', html: `
        <div class="uc-grid">
          ${uc('🎯', 'Reflections match the direct sound', [['Effect', 'With even directivity, side-wall and ceiling reflections have the same tonal balance as the direct sound'], ['Result', 'Treatment is simpler and EQ based on a measurement actually sounds right']])}
          ${uc('📐', 'Coverage tells you where to treat', [['Effect', 'A 90° speaker illuminates the side walls ahead of the seat; a 60° one mostly misses them'], ['Design', 'Draw the coverage wedge on the plan: treat or redirect whatever falls inside it']], '#7a5cc7')}
          ${uc('🏛️', 'Narrow coverage in live rooms', [['Effect', 'Less sound on walls and ceiling above the modal range'], ['Result', 'More clarity at a distance, less reverberant wash']], '#c7772b')}
          ${uc('🧱', 'Flush-mounting: the ultimate waveguide', [['Effect', 'The whole front wall becomes the baffle; no edge diffraction, no rear radiation'], ['See', '<a href="#/academy/m-speakers">Speakers: flush-mounting</a>']], '#2b9fc7')}
        </div>
        <div class="callout mentor">When choosing monitors, ask for the <b>directivity plot</b> (off-axis curves or a sonogram), not just the on-axis response. Smooth, gently falling off-axis curves with no bulge above the crossover are what make a speaker easy to live with in a real room. Waveguides do nothing for bass: below a few hundred hertz every box speaker radiates all round and the room’s modes take over.</div>` },
      { h: 'Placing and aiming waveguide speakers', html: `
        <ul><li><b>Aim</b> the axis at your ears, or cross the axes just behind your head for a wider sweet spot.</li>
        <li>Keep the whole <b>listening area inside the coverage</b>: at 1.5 m, a 90° waveguide covers a strip about 3 m wide, a 60° one about 1.7 m.</li>
        <li><b>Do not lay the speaker on its side</b> unless it was designed for it: the wide, smooth pattern is horizontal; on its side the driver-spacing lobes fall across the mix position.</li>
        <li><b>Height:</b> tweeter (waveguide centre) at ear height, or tilt the speaker so the axis meets the ears.</li>
        <li><b>Distance:</b> sit far enough for the drivers to blend (roughly three times the driver spacing or more).</li>
        <li>Keep the mouth clear: no screens, grilles with thick frames or desk edges in front of the waveguide.</li></ul>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎚️', 'Small control room, 1.2 m at the rear', [['Problem', '75 Hz length mode rings; rear reflection smears the image'], ['Design', 'Eight tapered channels 0.4 m wide, 50 mm lining each face, fabric front'], ['Result', 'Useful absorption from ≈ 70 Hz; rear wall acoustically “gone” above it']])}
          ${uc('💿', 'Mastering room', [['Problem', 'Needs even decay down to 40 Hz'], ['Design', 'Full-depth (1.8–2.4 m) folded waveguides with hangers in the deepest third'], ['Result', 'Path ≥ 2 m: reach toward 40 Hz']], '#7a5cc7')}
          ${uc('🎬', 'Home cinema', [['Problem', 'Dialogue unclear, wide seating area'], ['Design', '90° waveguide speakers aimed across the seats; absorbers where the coverage hits the side walls'], ['Result', 'Same tone in every seat']], '#c7772b')}
          ${uc('🎤', 'Live room foldback / PA', [['Problem', 'Reverberant room, feedback'], ['Design', 'Narrow (60°) waveguides aimed at people, not walls'], ['Result', 'More direct sound, less room, more gain before feedback']], '#2b9fc7')}
          ${uc('🔧', 'DIY two-way with a 165 mm woofer', [['Problem', 'Which waveguide and crossover?'], ['Design', 'Woofer ≈ 94° at 2 kHz → choose ≈ 90° coverage; mouth ≥ 140 mm holds 90° down to ≈ 2 kHz'], ['Result', 'Matched hand-over at about 2 kHz']], '#4c9a3a')}
          ${uc('🌬️', 'Duct silencer', [['Problem', 'Fan noise and crosstalk through the supply duct'], ['Design', 'Lined, split airways 1–1.5 m long with a bend'], ['Result', 'Air passes; sound is absorbed along the lined path']], '#c7a12b')}
        </div>` },
      { h: 'Myths, problems and a checklist', html: `
        ${myth([
          ['“A waveguide trap works at any depth.”', 'Its reach is tied to path length: about c/(4f). Half a metre of channel does little below ≈ 170 Hz.'],
          ['“Fill the channels completely for more absorption.”', 'A packed channel looks like a dense wall to bass and reflects it. Leave an open core for the wave to travel in.'],
          ['“A waveguide makes a tweeter go lower and louder for free.”', 'It adds output low in the tweeter’s range, but the pattern is only controlled above a frequency set by the mouth size.'],
          ['“Wider dispersion is always better.”', 'Wider coverage lights up more of the room. Even, <i>matched</i> directivity matters more than width.'],
          ['“Waveguides fix bass problems in the room.”', 'Loudspeaker waveguides work on mids and highs only. Bass is the room’s job: traps and positioning.'],
        ])}
        <div class="table-wrap"><table><tr><th>Problem</th><th>Likely cause</th><th>Solution</th></tr>
          <tr><td>Trap built, lowest mode unchanged</td><td>Path shorter than λ/4 of that mode</td><td>Fold or deepen; add a tuned trap for that mode</td></tr>
          <tr><td>Room became dull</td><td>Open mouths absorb highs too</td><td>Slatted or diffusing face across part of the mouths</td></tr>
          <tr><td>Honky colouration from the rear</td><td>Unlined or too-rigid channel resonating like a pipe</td><td>Line both faces; vary channel lengths slightly</td></tr>
          <tr><td>Harsh off-axis, fine on-axis</td><td>Directivity step at the crossover</td><td>Choose a speaker with matched directivity; treat the side-wall points</td></tr>
          <tr><td>Tone changes when you stand up</td><td>Vertical lobing between drivers</td><td>Tilt to the ears; sit further back; do not turn the speaker sideways</td></tr>
          <tr><td>Ripples above 5 kHz</td><td>Diffraction from a sharp waveguide mouth or a grille frame</td><td>Rounded mouth; remove or thin the grille frame</td></tr></table></div>
        <p><b>Checklist.</b> ① Lowest frequency chosen → path length. ② Mouth width and number of channels. ③ Lining thickness with an open core. ④ Taper or stepped lining. ⑤ Panels angled, fixed top and bottom. ⑥ Mouths clear, fabric removable. ⑦ Speaker coverage drawn on the plan. ⑧ Decay and off-axis response measured.</p>
        <p>Related: <a href="#/academy/m-hangers">Acoustic Hangers</a> · <a href="#/academy/m-redirect">Redirectors and Absorbers</a> · <a href="#/academy/m-treat-designs">Room Treatment Designs</a> · <a href="#/academy/m-speakers">Speakers</a> · <a href="#/lab/hangers">Hangers &amp; Waveguides lab</a>.</p>` },
    ],
    quiz: [
      { q: 'A lined channel is 0.4 m wide. Up to what frequency does only a plane wave travel along it?', opts: ['≈ 107 Hz', '≈ 215 Hz', '≈ 430 Hz', '≈ 860 Hz'], a: 2, why: 'f = c / (2w) = 343 / 0.8 ≈ 430 Hz.' },
      { q: 'You need a waveguide trap to work from 70 Hz. Roughly how long must the sound path be?', opts: ['0.3 m', '0.6 m', '1.2 m', '4.9 m'], a: 2, why: 'L ≈ c / (4f) = 343 / 280 ≈ 1.2 m.' },
      { q: 'Why taper the channel or the lining?', opts: ['It looks better', 'A gradual change reflects less than a sudden one', 'It makes the trap lighter', 'To raise the cut-off'], a: 1, why: 'Gradual change of conditions lets the wave in instead of bouncing it back.' },
      { q: 'What is the main job of a loudspeaker waveguide?', opts: ['More bass', 'Matching the tweeter’s coverage to the woofer’s and keeping it constant', 'Blocking reflections', 'Lowering distortion in the woofer'], a: 1, why: 'It controls directivity so the off-axis sound matches the on-axis sound.' },
      { q: 'A 90° waveguide with a 150 mm mouth holds its pattern down to about…', opts: ['75 Hz', '500 Hz', '1.9 kHz', '8 kHz'], a: 2, why: '25 000 000 / (90 × 150) ≈ 1 880 Hz.' },
    ],
  };
  let i = window.LESSONS.findIndex((l) => l.id === 'm-hangers');
  if (i < 0) i = window.LESSONS.findIndex((l) => l.id === 'm-redirect');
  window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L);

  const add = (id, sec) => { const l = window.LESSONS.find((x) => x.id === id); if (l) l.sections.push(sec); };
  add('m-treat-designs', { h: 'Leading bass into depth: absorbing waveguides', html: `
    <p>Where a room has real depth to spare — typically a metre or more at the rear wall — rigid, absorbent-lined guide panels can divide it into channels that carry low-frequency sound inward and absorb it along the way. Reach is set by the path length (about c/4f). Theory, calculation and placement: <a href="#/academy/m-waveguides">Waveguides</a>.</p>`, viz: 'waveguideTrap' });
  add('m-speakers', { h: 'Waveguides and directivity: why off-axis sound matters', html: `
    <p>A tweeter in a waveguide radiates about as widely as the woofer does at the crossover, so the sound a speaker sends toward your walls has the same tone as the sound it sends to you. That makes reflections less coloured and room treatment more predictable. How to read and calculate it: <a href="#/academy/m-waveguides">Waveguides</a>.</p>`, viz: 'speakerWaveguide' });
})();
