/* ==========================================================================
   Master Class M20A — Building speaker stands and the studio desk for
   isolation and acoustic performance; plus "which mode, which place"
   sections for the mode-treatment lessons.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|set-up|result/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  /* ---------------- diagrams ---------------- */
  const spk = (x, y, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-14" y="-22" width="28" height="44" rx="3" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="0" cy="-10" r="3.5" fill="var(--accent)"/><circle cx="0" cy="8" r="8" fill="none" stroke="var(--text)" stroke-width="1.5"/></g>`;
  const head = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="var(--good)"/>`;

  const SVG_THREE = `<svg class="gsvg" viewBox="0 0 720 240" role="img" aria-label="Three things that go wrong with stands and desks">
    <text x="360" y="16" text-anchor="middle" font-size="13" font-weight="700">Three things that go wrong</text>
    <g><text x="120" y="40" text-anchor="middle" font-size="11" font-weight="700">① Wrong height or angle</text>
      <rect x="30" y="150" width="130" height="6" fill="var(--accent2)"/>${spk(60, 128)}${head(200, 96)}
      <line x1="74" y1="118" x2="230" y2="118" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 4"/>
      <line x1="20" y1="96" x2="230" y2="96" stroke="var(--good)" stroke-dasharray="3 4"/>
      <text x="120" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">tweeter fires at your chest:</text><text x="120" y="210" text-anchor="middle" font-size="10" fill="var(--muted)">dull highs, vague image</text></g>
    <g><text x="360" y="40" text-anchor="middle" font-size="11" font-weight="700">② Vibration into the furniture</text>
      <rect x="290" y="150" width="140" height="6" fill="var(--accent2)"/><rect x="298" y="156" width="5" height="50" fill="var(--accent2)"/><rect x="417" y="156" width="5" height="50" fill="var(--accent2)"/>${spk(330, 128)}
      <g class="leak-pulse"><path d="M350 160 q20 14 40 0 M350 172 q20 14 40 0 M350 184 q20 14 40 0" fill="none" stroke="var(--bad)" stroke-width="2"/></g>
      <g class="lock-wave"><circle cx="400" cy="150" r="12" fill="none" stroke="var(--bad)" stroke-width="2"/></g>
      <text x="360" y="226" text-anchor="middle" font-size="10" fill="var(--muted)">desk and floor hum along, late</text></g>
    <g><text x="600" y="40" text-anchor="middle" font-size="11" font-weight="700">③ The desk bounce</text>
      <rect x="540" y="150" width="130" height="6" fill="var(--accent2)"/>${spk(556, 128)}${head(690, 96)}
      <line x1="566" y1="118" x2="682" y2="98" stroke="var(--good)" stroke-width="2"/>
      <polyline points="566,120 628,150 684,102" fill="none" stroke="var(--bad)" stroke-width="2"/>
      <circle class="hot" cx="628" cy="150" r="6" fill="var(--bad)"/>
      <text x="610" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">two arrivals → comb filter:</text><text x="610" y="210" text-anchor="middle" font-size="10" fill="var(--muted)">hollow, phasey mids</text></g>
  </svg>`;

  const SVG_SPRING = `<svg class="gsvg" viewBox="0 0 700 210" role="img" aria-label="Rigid, soft and soft-with-mass mounting">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Coupled, decoupled, and decoupled properly</text>
    ${[['Spikes / hard contact', 110, 'hard'], ['Soft pads, light speaker', 350, 'soft'], ['Soft pads + heavy plate', 590, 'plate']].map(([t, x, k]) => `<g>
      <text x="${x}" y="38" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <rect x="${x - 60}" y="150" width="120" height="8" fill="var(--muted)"/>
      ${k === 'hard' ? `<path d="M${x - 16} 150 l-5 -12 h10z M${x + 16} 150 l-5 -12 h10z" fill="var(--text)"/>` : `<rect class="seal-squish" x="${x - 22}" y="140" width="12" height="10" fill="var(--good)"/><rect class="seal-squish" x="${x + 10}" y="140" width="12" height="10" fill="var(--good)"/>`}
      ${k === 'plate' ? `<rect x="${x - 30}" y="132" width="60" height="8" fill="#8d8d8d"/>` : ''}
      <g class="${k === 'soft' ? 'pane-a' : ''}"><rect x="${x - 22}" y="${k === 'plate' ? 72 : k === 'hard' ? 78 : 80}" width="44" height="60" rx="3" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="${x}" cy="${k === 'plate' ? 112 : 118}" r="10" fill="none" stroke="var(--text)"/></g>
      ${k === 'hard' ? `<g class="leak-pulse"><path d="M${x - 40} 166 v16 M${x} 166 v16 M${x + 40} 166 v16" stroke="var(--bad)" stroke-width="3"/></g>` : ''}
      <text x="${x}" y="198" text-anchor="middle" font-size="10" fill="var(--${k === 'hard' ? 'bad' : k === 'soft' ? 'warn' : 'good'})">${k === 'hard' ? 'all vibration passes down' : k === 'soft' ? 'isolates, but the box can rock' : 'isolates and stays still'}</text></g>`).join('')}
  </svg>`;

  const SVG_STANDS = `<svg class="gsvg" viewBox="0 0 740 290" role="img" aria-label="Five stand builds in section">
    <text x="370" y="16" text-anchor="middle" font-size="13" font-weight="700">Five builds (sections, not to scale)</text>
    <g><text x="80" y="38" text-anchor="middle" font-size="11" font-weight="700">a · sand-filled tube</text>
      <rect x="40" y="236" width="80" height="8" fill="var(--text)"/><rect x="66" y="84" width="28" height="152" fill="var(--muted)"/><rect x="70" y="92" width="20" height="140" fill="#d8b46a"/><line x1="80" y1="78" x2="80" y2="244" stroke="var(--text)" stroke-dasharray="3 3"/>
      <rect x="52" y="76" width="56" height="8" fill="var(--text)"/><rect x="58" y="68" width="10" height="8" fill="var(--good)"/><rect x="92" y="68" width="10" height="8" fill="var(--good)"/><rect x="56" y="30" width="48" height="0" fill="none"/>
      <text x="80" y="262" text-anchor="middle" font-size="10" fill="var(--muted)">threaded rod clamps</text><text x="80" y="276" text-anchor="middle" font-size="10" fill="var(--muted)">plates to the tube</text></g>
    <g><text x="225" y="38" text-anchor="middle" font-size="11" font-weight="700">b · blocks or bricks</text>
      ${[0, 1, 2, 3].map((i) => `<rect x="197" y="${204 - i * 40}" width="56" height="38" fill="#8d8d8d" stroke="var(--panel)" stroke-width="2"/>`).join('')}
      <rect x="191" y="76" width="68" height="8" fill="var(--accent2)"/><rect x="199" y="68" width="10" height="8" fill="var(--good)"/><rect x="241" y="68" width="10" height="8" fill="var(--good)"/>
      <text x="225" y="262" text-anchor="middle" font-size="10" fill="var(--muted)">adhesive between blocks;</text><text x="225" y="276" text-anchor="middle" font-size="10" fill="var(--muted)">felt under the bottom one</text></g>
    <g><text x="370" y="38" text-anchor="middle" font-size="11" font-weight="700">c · box column</text>
      <rect x="330" y="236" width="80" height="8" fill="#c9a57a"/><rect x="348" y="84" width="44" height="152" fill="#c9a57a"/><rect x="354" y="110" width="32" height="120" fill="#d8b46a"/><rect x="354" y="90" width="32" height="18" fill="var(--panel)"/>
      <rect x="340" y="76" width="60" height="8" fill="#c9a57a"/><rect x="346" y="68" width="10" height="8" fill="var(--good)"/><rect x="384" y="68" width="10" height="8" fill="var(--good)"/>
      <text x="370" y="262" text-anchor="middle" font-size="10" fill="var(--muted)">18 mm ply/MDF, glued;</text><text x="370" y="276" text-anchor="middle" font-size="10" fill="var(--muted)">sand in a liner bag</text></g>
    <g><text x="520" y="38" text-anchor="middle" font-size="11" font-weight="700">d · desktop riser</text>
      <rect x="460" y="200" width="120" height="8" fill="var(--accent2)"/><rect x="490" y="186" width="10" height="14" fill="var(--good)"/><rect x="540" y="186" width="10" height="14" fill="var(--good)"/>
      <path d="M482 186 h76 l-6 -50 h-64z" fill="#c9a57a"/><rect x="490" y="150" width="60" height="26" fill="#d8b46a"/><rect x="484" y="128" width="72" height="8" fill="var(--text)"/>
      <text x="520" y="230" text-anchor="middle" font-size="10" fill="var(--muted)">lifts the tweeter to ear</text><text x="520" y="244" text-anchor="middle" font-size="10" fill="var(--muted)">height; mass above pads</text></g>
    <g><text x="660" y="38" text-anchor="middle" font-size="11" font-weight="700">e · wall shelf</text>
      <rect x="716" y="50" width="14" height="200" fill="var(--muted)"/><rect x="630" y="140" width="86" height="8" fill="var(--accent2)"/><path d="M716 148 l-60 0 l60 50z" fill="none" stroke="var(--text)" stroke-width="3"/>
      <rect x="640" y="132" width="10" height="8" fill="var(--good)"/><rect x="690" y="132" width="10" height="8" fill="var(--good)"/><circle cx="722" cy="150" r="3" fill="var(--bad)"/><circle cx="722" cy="196" r="3" fill="var(--bad)"/>
      <text x="650" y="230" text-anchor="middle" font-size="10" fill="var(--muted)">only into masonry</text><text x="650" y="244" text-anchor="middle" font-size="10" fill="var(--muted)">or studs; pads on top</text></g>
    <text x="370" y="60" text-anchor="middle" font-size="10" fill="var(--good)">green = isolator pucks sized for the speaker’s weight</text>
  </svg>`;

  const SVG_TRIANGLE = `<svg class="gsvg" viewBox="0 0 640 250" role="img" aria-label="Speaker placement on stands, plan view">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Placement (plan view)</text>
    <rect x="80" y="30" width="480" height="200" fill="none" stroke="var(--text)" stroke-width="4"/>
    <text x="480" y="46" text-anchor="middle" font-size="10" fill="var(--muted)">front wall</text>
    ${spk(220, 86, 150)}${spk(420, 86, -150)}${head(320, 200)}
    <polygon points="220,86 420,86 320,200" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="6 4"/>
    <rect x="260" y="120" width="120" height="40" rx="4" fill="var(--panel2)" stroke="var(--line)"/><text x="320" y="144" text-anchor="middle" font-size="10" fill="var(--muted)">desk</text>
    <line x1="220" y1="34" x2="220" y2="62" stroke="var(--bad)" stroke-width="2"/><text x="226" y="54" font-size="10" fill="var(--bad)">d → dip at 343 / 4d</text>
    <line x1="84" y1="86" x2="204" y2="86" stroke="var(--c3)" stroke-dasharray="3 3"/><line x1="436" y1="86" x2="556" y2="86" stroke="var(--c3)" stroke-dasharray="3 3"/>
    <text x="144" y="80" text-anchor="middle" font-size="10" fill="var(--c3)">equal</text><text x="496" y="80" text-anchor="middle" font-size="10" fill="var(--c3)">equal</text>
    <text x="320" y="110" text-anchor="middle" font-size="10" fill="var(--accent)">equal sides, 60°</text>
    <text x="470" y="150" text-anchor="middle" font-size="10" fill="var(--muted)">stands just behind the desk</text>
  </svg>`;

  const SVG_DESK = `<svg class="gsvg" viewBox="0 0 700 300" role="img" aria-label="Side view of a good studio desk with dimensions">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">A desk that stays out of the sound (side view)</text>
    <rect x="30" y="268" width="640" height="5" fill="var(--muted)"/>
    <rect x="96" y="96" width="8" height="172" fill="var(--muted)"/><rect x="76" y="262" width="48" height="6" fill="var(--text)"/>${spk(100, 72, 6)}
    <rect x="200" y="158" width="230" height="8" fill="var(--accent2)" transform="rotate(-3 430 162)"/>
    <rect x="210" y="166" width="6" height="102" fill="var(--accent2)"/><rect x="418" y="166" width="6" height="102" fill="var(--accent2)"/><line x1="216" y1="250" x2="418" y2="190" stroke="var(--accent2)" stroke-width="3"/>
    <rect x="247" y="108" width="6" height="50" fill="var(--text)" transform="rotate(-12 250 158)"/>
    <rect x="300" y="170" width="90" height="46" rx="3" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/><text x="345" y="197" text-anchor="middle" font-size="9" fill="var(--muted)">rack bay, angled, low</text>
    <rect x="220" y="174" width="60" height="6" fill="var(--c3)"/><text x="250" y="192" text-anchor="middle" font-size="9" fill="var(--c3)">cable tray</text>
    ${head(520, 72)}<rect x="500" y="150" width="56" height="8" rx="3" fill="var(--muted)"/><rect x="524" y="158" width="6" height="100" fill="var(--muted)"/><rect x="552" y="100" width="6" height="56" fill="var(--muted)"/>
    <line x1="114" y1="64" x2="510" y2="72" stroke="var(--good)" stroke-width="2"/><polyline points="114,66 470,176 512,78" fill="none" stroke="var(--bad)" stroke-dasharray="5 4" opacity=".6"/>
    <text x="560" y="288" text-anchor="middle" font-size="10" fill="var(--bad)">bounce point lands past the desk edge</text>
    <line x1="446" y1="160" x2="446" y2="268" stroke="var(--muted)"/><text x="452" y="232" font-size="10" fill="var(--muted)">720–750 mm</text>
    <line x1="200" y1="286" x2="430" y2="286" stroke="var(--muted)"/><text x="315" y="298" text-anchor="middle" font-size="10" fill="var(--muted)">depth 600–800 mm</text>
    <line x1="590" y1="72" x2="590" y2="268" stroke="var(--good)" stroke-dasharray="3 3"/><text x="596" y="150" font-size="10" fill="var(--good)">ear ≈ 1.2 m</text>
    <text x="100" y="40" text-anchor="middle" font-size="10">floor stand, behind the desk</text>
    <text x="232" y="100" text-anchor="end" font-size="10">screen low,</text><text x="232" y="114" text-anchor="end" font-size="10">tilted back</text>
    <text x="275" y="146" font-size="10">shallow, slightly sloped, open frame</text>
  </svg>`;

  const box = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--panel2)" stroke="var(--text)" stroke-width="2.5"/>`;
  const SVG_FAMILIES = `<svg class="gsvg" viewBox="0 0 740 250" role="img" aria-label="Axial, tangential and oblique modes and their pressure zones">
    <text x="370" y="16" text-anchor="middle" font-size="13" font-weight="700">Three families of modes — and where their pressure piles up (plan views)</text>
    <g><text x="125" y="40" text-anchor="middle" font-size="11" font-weight="700">Axial: two opposite walls</text>${box(30, 52, 190, 130)}
      <rect class="leak-pulse" x="32" y="54" width="14" height="126" fill="var(--bad)" opacity=".8"/><rect class="leak-pulse" x="204" y="54" width="14" height="126" fill="var(--bad)" opacity=".8"/>
      <line x1="125" y1="54" x2="125" y2="180" stroke="var(--panel)" stroke-width="5"/><line x1="125" y1="54" x2="125" y2="180" stroke="var(--muted)" stroke-dasharray="4 4"/>
      <text x="125" y="120" text-anchor="middle" font-size="10" fill="var(--muted)">null plane</text>
      <text x="125" y="202" text-anchor="middle" font-size="10">trap anywhere on those two walls</text><text x="125" y="218" text-anchor="middle" font-size="10" fill="var(--muted)">(1,0,0) (0,1,0) (0,0,1) …</text></g>
    <g><text x="370" y="40" text-anchor="middle" font-size="11" font-weight="700">Tangential: four surfaces</text>${box(275, 52, 190, 130)}
      ${[[277, 54], [445, 54], [277, 162], [445, 162]].map(([x, y]) => `<rect class="leak-pulse" x="${x}" y="${y}" width="18" height="18" fill="var(--bad)" opacity=".85"/>`).join('')}
      <line x1="370" y1="54" x2="370" y2="180" stroke="var(--muted)" stroke-dasharray="4 4"/><line x1="277" y1="117" x2="463" y2="117" stroke="var(--muted)" stroke-dasharray="4 4"/>
      <text x="370" y="202" text-anchor="middle" font-size="10">trap the edges where they meet</text><text x="370" y="218" text-anchor="middle" font-size="10" fill="var(--muted)">(1,1,0): vertical corners, full height</text></g>
    <g><text x="615" y="40" text-anchor="middle" font-size="11" font-weight="700">Oblique: all six surfaces</text>${box(520, 52, 190, 130)}
      ${[[522, 54], [698, 54], [522, 170], [698, 170]].map(([x, y]) => `<circle class="hot" cx="${x + 5}" cy="${y + 5}" r="8" fill="var(--bad)" opacity=".9"/>`).join('')}
      <text x="615" y="112" text-anchor="middle" font-size="10" fill="var(--muted)">peaks only where</text><text x="615" y="126" text-anchor="middle" font-size="10" fill="var(--muted)">three surfaces meet</text>
      <text x="615" y="202" text-anchor="middle" font-size="10">trap the eight tri-corners</text><text x="615" y="218" text-anchor="middle" font-size="10" fill="var(--muted)">(1,1,1): floor &amp; ceiling corners</text></g>
    <text x="370" y="242" text-anchor="middle" font-size="10" fill="var(--good)">A floor-to-ceiling corner trap sits in a hot zone of all three families — that is why corners come first.</text>
  </svg>`;

  /* ---------------- the lesson ---------------- */
  const L = {
    id: 'm-stands-desk', n: 'M20A', track: 'master', title: 'Building Speaker Stands and the Studio Desk for Isolation and Acoustic Performance', level: 'Core', mins: 50,
    summary: 'How to build stands that put the speakers at the right height, keep their vibration out of the room’s structure, and a desk that does not bounce sound into your ears — with recipes, dimensions and tools to test your own set-up.',
    tags: ['speaker stands', 'isolation pads', 'decoupling', 'desk bounce', 'comb filter', 'studio desk', 'ergonomics', 'subwoofer platform', 'spikes'],
    sections: [
      { h: 'Why stands and desks matter', html: `
        <p class="lead">The stand and the desk are the first two “rooms” your monitors meet. Get them wrong and no amount of wall treatment will fix what you hear at the seat.</p>
        ${SVG_THREE}
        ${flow([['Height & aim', 'tweeters at, or aimed at, your ears'], ['Keep vibration local', 'heavy, damped, decoupled'], ['Clear the path', 'nothing flat between speaker and ear'], ['Stay symmetrical', 'left = right'], ['Measure', 'confirm, then adjust']])}` },
      { h: 'What a good stand does', html: `
        <div class="table-wrap"><table><tr><th>Job</th><th>Target</th><th>Why</th></tr>
          <tr><td><b>Height</b></td><td>Tweeter at seated ear height (≈ 1.15–1.25 m), or the speaker tilted so its axis points at the ears</td><td>Speakers are flattest on axis; off-axis the highs fall and the crossover region changes</td></tr>
          <tr><td><b>Rigidity</b></td><td>No sway when you push the top</td><td>A wobbling stand lets the cabinet move against the woofer</td></tr>
          <tr><td><b>Mass</b></td><td>Stand at least as heavy as the speaker; ideally 2–3×</td><td>A heavy support barely moves, so it radiates little</td></tr>
          <tr><td><b>Damping</b></td><td>No “ting” when tapped: sand-filled or solid</td><td>Hollow tubes ring and add their own note</td></tr>
          <tr><td><b>Stable base</b></td><td>Tip-over margin ≥ 15°; wider base for tall or heavy speakers</td><td>Safety first — and stability is stiffness</td></tr>
          <tr><td><b>Decoupling</b></td><td>Resilient layer tuned well below the lowest bass (≈ 6–12 Hz)</td><td>Stops cabinet vibration driving desks and springy floors</td></tr>
          <tr><td><b>Cables</b></td><td>Slack loops, clipped to the column</td><td>A tight cable is a rigid bridge around your isolators</td></tr></table></div>
        <p>Design yours below. Start with the default (hollow tube, rigid contact, timber floor) and improve it step by step.</p>`, viz: 'standBuilder' },
      { h: 'Isolation in plain words', html: `
        ${SVG_SPRING}
        <p>A speaker on a resilient pad is a <b>mass on a spring</b>. It has one resonance; below and around it the pad does nothing (or makes things worse), and well above it the vibration passed down falls away.</p>
        <div class="formula"><span class="lbl">Resonance from how far the pad sinks</span>f<sub>n</sub> ≈ 15.8 / √(deflection in mm) &nbsp;·&nbsp; isolation begins only above √2 · f<sub>n</sub></div>
        <div class="table-wrap"><table><tr><th>Mount</th><th>Typical sink under load</th><th>Resonance</th><th>Isolates above</th><th>Comment</th></tr>
          <tr><td>Spikes, cones, bare contact</td><td>≈ 0</td><td>—</td><td>never</td><td>Coupling and stability, not isolation</td></tr>
          <tr><td>Dense foam pad</td><td>≈ 1 mm</td><td>≈ 18 Hz</td><td>≈ 25 Hz</td><td>Fine for desks; check its weight rating</td></tr>
          <tr><td>Rubber / gel pucks, correctly loaded</td><td>≈ 2–3 mm</td><td>≈ 12 Hz</td><td>≈ 17 Hz</td><td>The practical sweet spot</td></tr>
          <tr><td>Halved squash balls, inner-tube ring</td><td>≈ 4 mm</td><td>≈ 9 Hz</td><td>≈ 13 Hz</td><td>Cheap and effective; less stable</td></tr>
          <tr><td>Spring isolators</td><td>≈ 7 mm</td><td>≈ 6 Hz</td><td>≈ 8 Hz</td><td>Best isolation; little damping, needs mass</td></tr></table></div>
        <div class="callout data"><b>Load matters.</b> A pad only sinks the right amount inside its rated range. Too little weight and it stays stiff (high resonance, no isolation); too much and it bottoms out. Divide the speaker’s weight by the number of pucks and choose pucks whose rating brackets that figure.</div>
        <div class="callout warn"><b>Soft mount, light speaker:</b> when the woofer pushes forward, a light cabinet on soft pads rocks back, softening bass attacks and smearing the stereo image. Put a heavy plate (paving slab, steel plate, 10–15 kg) <i>under the speaker and on top of the isolators</i>: the mass sits above the spring, the box stays still, and the resonance stays low.</div>
        <div class="uc-grid">
          ${uc('🪵', 'Suspended timber or raised floor', [['What happens', 'The floor is a drum skin: it booms and carries bass to the room below'], ['Do', 'Decouple — this is where isolators pay off most']])}
          ${uc('🧱', 'Concrete slab on the ground', [['What happens', 'Almost nothing to excite'], ['Do', 'A heavy, rigid stand is fine; spikes through carpet for stability']], '#7a5cc7')}
          ${uc('🖥️', 'On the desk', [['What happens', 'The desktop becomes a second, late loudspeaker'], ['Do', 'Isolators plus mass, or move to floor stands']], '#c7772b')}
        </div>` },
      { h: 'Build recipes', html: `
        ${SVG_STANDS}
        <div class="table-wrap"><table><tr><th>Build</th><th>Materials</th><th>Good for</th><th>Watch out</th></tr>
          <tr><td><b>a · Sand-filled tube</b></td><td>75–110 mm steel or PVC tube; 12–18 mm plywood or 6 mm steel plates; M10–M12 threaded rod; dry sand</td><td>Near- and mid-fields up to ≈ 20 kg</td><td>Seal the tube ends; sand must be kiln-dry</td></tr>
          <tr><td><b>b · Blocks or bricks</b></td><td>Dense concrete blocks or bricks, construction adhesive, a ply top plate, felt underneath</td><td>Cheapest, very heavy, any size</td><td>Bond the stack so it cannot topple; protect the floor</td></tr>
          <tr><td><b>c · Box column</b></td><td>18 mm plywood or MDF box, glued and screwed, sand in a liner bag, wide plinth</td><td>Heavy mid-fields; looks like furniture</td><td>Leave an air space at the top; seal against leaks</td></tr>
          <tr><td><b>d · Desktop riser</b></td><td>Small ply box or solid block, filled or weighted, on isolator pucks</td><td>Small monitors when floor stands are impossible</td><td>Still on the desk — treat the bounce zone</td></tr>
          <tr><td><b>e · Wall shelf / bracket</b></td><td>Steel bracket into masonry or studs, thick shelf, pads under the speaker</td><td>Tiny rooms, surround speakers</td><td>Walls transmit bass to neighbours; never plasterboard-only fixings</td></tr></table></div>
        <h4>Step by step: the sand-filled tube stand</h4>
        ${flow([['Work out the height', 'ear height − tweeter height above the speaker’s base − isolators'], ['Cut the plates', 'top to suit the speaker, base 300–400 mm square'], ['Drill & assemble', 'rod through the tube centre, nuts and washers both ends'], ['Fill', 'dry sand through a hole in the top plate; tap to settle; plug'], ['Feet', 'spikes on carpet over a slab; pads or felt on hard or timber floors'], ['Isolators', 'three or four pucks on the top plate, rated for the speaker'], ['Test', 'tap the column (dead thud), push the top (no sway)']])}
        <div class="table-wrap"><table><tr><th>Cut list (one stand, 9 kg speaker 360 mm tall, tweeter 270 mm up, ear 1.2 m)</th><th>Size</th></tr>
          <tr><td>Column tube</td><td>≈ 860 mm long, 100 mm diameter</td></tr>
          <tr><td>Top plate</td><td>220 × 280 mm, 18 mm plywood (or 6 mm steel)</td></tr>
          <tr><td>Base plate</td><td>350 × 350 mm, 2 × 18 mm plywood glued (or 8 mm steel)</td></tr>
          <tr><td>Threaded rod</td><td>M10, ≈ 940 mm, 2 nuts, 2 large washers</td></tr>
          <tr><td>Dry sand</td><td>≈ 7 litres (≈ 11 kg)</td></tr>
          <tr><td>Isolators</td><td>4 pucks rated ≈ 1.5–4 kg each (9 kg ÷ 4 ≈ 2.3 kg per puck)</td></tr></table></div>
        <div class="callout safety">A filled stand with a speaker on top can weigh 30–60 kg and stands at head height for a child. Make the base wide, fix or strap the speaker so it cannot slide, lift with two people, and fix wall brackets only into masonry or framing with anchors rated well above the load.</div>` },
      { h: 'Placing the speakers on their stands', html: `
        ${SVG_TRIANGLE}
        <ul><li><b>Triangle:</b> speakers and head form an equilateral triangle (60°), each speaker toed in to point at, or just behind, your ears.</li>
        <li><b>Symmetry:</b> equal distance to each side wall; the centre line of the room passes through your head.</li>
        <li><b>Front wall:</b> the gap behind the speaker creates a dip at 343 / (4 × distance). Either go close (under ≈ 20 cm, dip moves up where it is easily absorbed) or far (over ≈ 1.2 m); avoid the 0.4–1 m zone. Try it in the <a href="#/lab/flutter">boundary tool</a> and see <a href="#/academy/m-speakers">Speakers</a>.</li>
        <li><b>Tilt:</b> if the stand is too low or too high, tilt the speaker so the tweeter axis meets your ears — a few degrees is fine.</li>
        <li><b>Stands behind the desk,</b> not on it: 20–40 cm behind the rear edge usually clears the desk bounce.</li>
        <li><b>Measure both speakers separately</b> at the seat. They should match within a couple of decibels through the mids; if not, look for an asymmetry.</li></ul>` },
      { h: 'The desk as an acoustic object', html: `
        <p>A desktop is a hard mirror placed exactly between the speakers and your ears. The reflection arrives about a millisecond late and cancels the direct sound at regular frequencies — typically a first notch somewhere between 500 Hz and 2 kHz, right where voices live.</p>
        <div class="uc-grid">
          ${uc('🪞', 'Big flat tops', [['Effect', 'Strong, wide bounce zone; comb filtering that changes as you lean'], ['Fix', 'Shallower top, absorber mat on the bounce zone, sloped surface']])}
          ${uc('📦', 'Hollow, boxy desks', [['Effect', 'Panels and cavities ring around 100–250 Hz — a “desk boom”'], ['Fix', 'Open frames, braced or damped panels, fill cavities with wool']], '#7a5cc7')}
          ${uc('🖥️', 'Screens and racks', [['Effect', 'Large screens between the speakers reflect and block; tall racks beside you reflect sideways'], ['Fix', 'Screens low and tilted back, behind the speaker plane; racks below ear line, angled away']], '#c7772b')}
          ${uc('⌨️', 'Trays, laptops, mixers', [['Effect', 'Every hard surface near the line of sight is a small mirror'], ['Fix', 'Slide trays in when listening; keep the laptop lid low; angle the mixer']], '#2b9fc7')}
        </div>`, viz: 'deskLab' },
      { h: 'Designing and building a studio desk', html: `
        ${SVG_DESK}
        <div class="table-wrap"><table><tr><th>Principle</th><th>In practice</th></tr>
          <tr><td>As small and open as the work allows</td><td>Depth 600–800 mm; open steel or timber frame rather than solid side panels</td></tr>
          <tr><td>Monitors off the desk</td><td>Floor stands behind it; a notch or cut-away in the rear edge if needed</td></tr>
          <tr><td>No mirror in the bounce zone</td><td>Top sloped a few degrees toward you, perforated or slatted top over wool, or a thick felt mat</td></tr>
          <tr><td>Low profile</td><td>Nothing on the desk higher than the line from woofer to chin; screen top at or below eye level</td></tr>
          <tr><td>Racks out of the way</td><td>Bays below the top, angled back 10–15°, or in side pods lower than your ears</td></tr>
          <tr><td>Dead, braced structure</td><td>25–30 mm top or two glued layers; cross-brace; wool in any closed cavity; filled or solid legs</td></tr>
          <tr><td>Tidy services</td><td>Cable tray under the rear edge; power on one side, signal on the other; slack for sliding gear</td></tr></table></div>
        <p><b>Typical dimensions:</b> top 720–750 mm high (or to suit your chair so forearms rest level), 600–800 mm deep, 1 400–1 800 mm wide; knee space ≥ 600 mm; screen 500–700 mm from your eyes.</p>
        ${flow([['Mock up', 'cardboard and tape at full size; sit and check sight lines'], ['Frame', '40 × 40 mm steel or 45 × 70 mm timber, cross-braced'], ['Top', 'two layers of 15–18 mm plywood glued, front edge rounded'], ['Rack bays', 'rails on angled sides, ventilated back'], ['Finish', 'matt surface; felt mat where the bounce lands'], ['Check', 'use the desk tool above with your real dimensions, then measure']])}
        <div class="callout alt"><b>Budget route:</b> a plain trestle table with a 25 mm top, monitors on block stands behind it, and a 10 mm wool-felt mat on the desktop outperforms most expensive “studio furniture” with speaker shelves.</div>` },
      { h: 'Ergonomics that also help the acoustics', html: `
        <div class="table-wrap"><table><tr><th>Setting</th><th>Target</th><th>Acoustic side-effect</th></tr>
          <tr><td>Chair height</td><td>Feet flat, thighs level; ears ≈ 1.15–1.25 m</td><td>Fixes the height everything else is built to</td></tr>
          <tr><td>Chair back &amp; headrest</td><td>Low back, no tall headrest</td><td>A high back reflects and shades the rear sound field</td></tr>
          <tr><td>Armrests</td><td>Low or removable</td><td>They collide with the desk and push you out of the sweet spot</td></tr>
          <tr><td>Reach zones</td><td>Keyboard and controller within 400 mm; rarely used gear further away</td><td>Keeps your head on the centre line</td></tr>
          <tr><td>Screen</td><td>Arm’s length; top at or below eye level; tilted back</td><td>Stays out of the speakers’ path</td></tr>
          <tr><td>Seat position in the room</td><td>Start at ≈ 38 % of the room length; never the exact centre</td><td>Avoids the deepest bass nulls</td></tr>
          <tr><td>Standing desk</td><td>Only if stands rise too, or with tilting monitors</td><td>Your ears move 400 mm; so do the vertical modes and the speaker axis</td></tr></table></div>` },
      { h: 'Subwoofers and other equipment', html: `
        <div class="uc-grid">
          ${uc('🔈', 'Subwoofer platform', [['Helps when', 'The floor is suspended timber or a raised deck: a heavy slab on isolators stops the floor drumming'], ['Does little when', 'The sub sits on a ground slab — the room’s modes, not the floor, are the problem']])}
          ${uc('💻', 'Noisy computer', [['Do', 'Move it to another room or a ventilated, lined enclosure with a baffled air path; quiet fans; rubber feet'], ['Why', 'Fan noise raises the noise floor; a vibrating case drums on the desk']], '#7a5cc7')}
          ${uc('💿', 'Turntable', [['Do', 'Wall shelf into masonry, or a heavy plinth on soft isolators'], ['Why', 'Footfall and bass feedback reach the stylus through the furniture']], '#c7772b')}
          ${uc('🎙️', 'Microphone stands', [['Do', 'Shock mount on the mic; rubber feet or a mat under the stand on timber floors'], ['Why', 'Footsteps and kick-drum thump travel up the stand']], '#2b9fc7')}
        </div>
        <p>Building-level isolation — floating floors and room-in-room — is covered in <a href="#/academy/m-floors">Floating Floors</a>. A stand isolator keeps <i>your furniture</i> quiet; it does not soundproof the room.</p>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🛏️', 'Bedroom producer on a timber floor', [['Problem', 'Bass booms downstairs and the desk hums'], ['Set-up', 'Block stands behind the desk, rubber pucks, 10 kg slab under each speaker'], ['Result', 'Cleaner low end; far less thump in the room below']])}
          ${uc('🎧', 'Near-fields on a small desk', [['Problem', 'No room for floor stands'], ['Set-up', 'Weighted desktop risers on pucks, tweeters at ear height, felt mat on the bounce zone'], ['Result', 'Bounce reduced; mids clearer']], '#7a5cc7')}
          ${uc('🎚️', 'Mid-fields behind a console', [['Problem', '25 kg speakers, console reflections'], ['Set-up', 'Sand-filled box columns, raised and tilted down so the bounce clears the console'], ['Result', 'Stable image; console reflection moved out of the critical band']], '#c7772b')}
          ${uc('🔑', 'Rented flat, no drilling', [['Problem', 'Nothing may be fixed to walls'], ['Set-up', 'Free-standing filled stands; isolators; rug under the listening area'], ['Result', 'Fully removable, neighbours hear less']], '#2b9fc7')}
          ${uc('💎', 'Mastering room', [['Problem', 'Needs the cleanest path possible'], ['Set-up', 'No desk between speakers and ears: a small side table; heavy stands on a slab'], ['Result', 'No desk bounce at all']], '#4c9a3a')}
          ${uc('📹', 'Podcast / video desk', [['Problem', 'Desk reflections into the microphone; fan noise'], ['Set-up', 'Felt desk mat, mic on a boom with shock mount, computer in a quiet box'], ['Result', 'Drier voice, lower noise floor']], '#d14b8f')}
        </div>` },
      { h: 'Myths', html: myth([
        ['“Spikes isolate the speaker from the floor.”', 'Spikes couple it firmly. They give stability on carpet; isolation needs a resilient layer.'],
        ['“Foam wedges under the speakers fix everything.”', 'They help on desks above ≈ 25 Hz if correctly loaded. They do not fix height, the desk bounce or room modes.'],
        ['“The heavier the stand, the better — always.”', 'Mass and damping help the stand stay still. On a springy floor, a heavy rigid stand still shakes the floor: add decoupling.'],
        ['“A bigger desk looks more professional.”', 'Every extra square metre of desktop is a mirror. The best-sounding desks are the smallest that fit the work.'],
        ['“Near-field monitors belong on the desk.”', '“Near-field” means close to you (≈ 1–1.5 m). On stands just behind the desk they are still near-field — and sound better.'],
      ]) },
      { h: 'Problems & solutions, and a checklist', html: `
        <div class="table-wrap"><table><tr><th>Problem</th><th>Likely cause</th><th>Solution</th></tr>
          <tr><td>Hollow, “phasey” mids that change as you lean</td><td>Desk bounce</td><td>Monitors behind the desk or raised and tilted; felt mat; shallower desk</td></tr>
          <tr><td>Desk hums on bass notes</td><td>Speakers coupled to a resonant desktop</td><td>Isolators with mass above; brace or damp the desk; floor stands</td></tr>
          <tr><td>Bass feels soft after adding pads</td><td>Light speaker rocking on a soft mount</td><td>Heavy plate under the speaker, firmer pads in their rated range</td></tr>
          <tr><td>Stand rings when tapped</td><td>Hollow column</td><td>Fill with dry sand</td></tr>
          <tr><td>Stand wobbles</td><td>Small base, loose joints, uneven floor</td><td>Wider base, tighten the rod, adjustable feet</td></tr>
          <tr><td>Image pulls to one side</td><td>Unequal distances, one speaker near a wall or a rack</td><td>Restore symmetry; measure each speaker alone</td></tr>
          <tr><td>Neighbour below still hears bass</td><td>Airborne bass and floor structure, not the stands</td><td>Isolators help a little; real fix is floor/ceiling isolation and level</td></tr></table></div>
        <div class="callout mentor"><b>Checklist:</b> ① tweeters on the ear line ② equilateral triangle, toed in ③ stands heavy, damped, stable ④ isolators loaded in range, mass above them ⑤ cables slack ⑥ stands behind the desk ⑦ desk small, low, open ⑧ felt on the bounce zone ⑨ screen low and tilted ⑩ measure left and right.</div>
        <p>Related: <a href="#/academy/m-speakers">Speakers</a> · <a href="#/academy/m-control">Control Rooms</a> · <a href="#/lab/stands">Stands, desk &amp; trap-placement tools</a> · <a href="#/academy/m-factors">What Shapes a Room’s Sound</a>.</p>` },
    ],
    quiz: [
      { q: 'A rubber puck sinks 2.5 mm under the speaker. Roughly where is its resonance, and from where does it isolate?', opts: ['≈ 50 Hz, isolates above 70 Hz', '≈ 10–12 Hz, isolates above ≈ 15–17 Hz', '≈ 2 Hz, isolates above 3 Hz', 'It has no resonance'], a: 1, why: 'fn ≈ 15.8/√2.5 ≈ 10 Hz (a little higher for rubber’s dynamic stiffness); isolation starts above √2·fn.' },
      { q: 'What do spikes under a stand do?', opts: ['Isolate it from the floor', 'Couple it firmly and add stability', 'Absorb bass', 'Lower the resonance'], a: 1, why: 'A rigid point contact passes vibration; it is for stability, especially through carpet.' },
      { q: 'A light speaker on soft pads sounds less punchy. Best fix?', opts: ['Remove the pads and use the desk', 'Put a heavy plate under the speaker, on top of the pads', 'Add more foam', 'Turn up the bass'], a: 1, why: 'Mass above the spring stops the cabinet rocking while keeping the isolation.' },
      { q: 'The simplest way to get rid of the desk bounce is to…', opts: ['Use a bigger desk', 'Put the monitors on stands behind the desk (or raise and tilt them)', 'Add a second screen', 'EQ the notch'], a: 1, why: 'Change the geometry so the reflection point falls off the desktop; comb filters cannot be equalised away.' },
      { q: 'On which floor does decoupling the stands matter most?', opts: ['Ground-bearing concrete slab', 'Suspended timber or raised floor', 'Tiled slab', 'It never matters'], a: 1, why: 'Light, springy floors are easily driven and re-radiate bass; a slab barely moves.' },
    ],
  };
  const i = window.LESSONS.findIndex((l) => l.id === 'm-speakers');
  window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, L);

  /* ---------------- which mode, which place ---------------- */
  const addTo = (id, secs) => { const l = window.LESSONS.find((x) => x.id === id); if (l) l.sections.push(...secs); };
  const PLACE = { h: 'Which mode, which place: finding the right spot for low-frequency absorbers', html: `
    <p class="lead">A bass trap only works on a mode if it sits where that mode has something for it to grab. Two rules decide everything:</p>
    <div class="uc-grid">
      ${uc('🫧', 'Rule 1 — resonant (pressure) traps', [['Types', 'Membrane/panel, Helmholtz, carbon-assisted traps'], ['Place', 'Where the target mode’s <b>pressure</b> is highest: on the room’s boundaries — walls, edges, corners'], ['Never', 'On a null plane of that mode: it does nothing there']])}
      ${uc('🧶', 'Rule 2 — porous (velocity) absorbers', [['Types', 'Mineral wool, glass wool, polyester, thick foam'], ['Place', 'Where the air <b>moves</b>: out from the wall, or so deep that they reach there (λ/8–λ/4)'], ['Best compromise', 'Thick and straddling a corner: several modes pass through it']], '#7a5cc7')}
    </div>
    ${SVG_FAMILIES}
    <div class="table-wrap"><table><tr><th>Mode type</th><th>Where its pressure peaks</th><th>Best trap positions</th><th>Positions that do nothing</th></tr>
      <tr><td><b>Axial, length</b> (n,0,0)</td><td>The whole front and rear walls</td><td>Anywhere on the front or rear wall, including their corners</td><td>Side walls and ceiling at the null planes; mid-room for n = 1</td></tr>
      <tr><td><b>Axial, width</b> (0,n,0)</td><td>Both side walls</td><td>Anywhere on the side walls and their corners</td><td>Front/rear wall centre line; the room’s centre line for odd n</td></tr>
      <tr><td><b>Axial, height</b> (0,0,n)</td><td>Floor and ceiling</td><td>Ceiling (deep cloud, pressure trap above it), wall–ceiling and wall–floor edges</td><td>Walls at mid-height for odd n</td></tr>
      <tr><td><b>Tangential, in plan</b> (n,m,0)</td><td>The four vertical edges where walls meet</td><td>Vertical corners, floor to ceiling</td><td>Wall centres on the null lines</td></tr>
      <tr><td><b>Tangential, with height</b> (n,0,m) (0,n,m)</td><td>Wall–ceiling and wall–floor edges of the walls involved</td><td>Soffit traps along those edges; top and bottom of the wall</td><td>The middle of the wall at mid-height</td></tr>
      <tr><td><b>Oblique</b> (n,m,p)</td><td>The eight three-way corners</td><td>Corner traps that reach the ceiling and/or floor</td><td>Almost everywhere else</td></tr></table></div>
    <div class="callout physics"><b>Higher orders.</b> A mode of order n along a dimension L has pressure maxima at both walls <i>and</i> on planes inside the room at L·k/n (k = 1 … n−1), and nulls at L·(2k−1)/(2n). For the second length mode of a 4.6 m room: maxima at 0, 2.3 and 4.6 m; nulls at 1.15 and 3.45 m. A wall is a pressure maximum for <b>every</b> order — which is why boundary placement never misses.</div>
    <h4>Worked example: 4.6 × 3.4 × 2.5 m</h4>
    <div class="formula"><span class="lbl">Mode frequency</span>f = (343 / 2) · √( (n<sub>x</sub>/L)² + (n<sub>y</sub>/W)² + (n<sub>z</sub>/H)² )</div>
    <div class="table-wrap"><table><tr><th>#</th><th>Mode</th><th class="num">Frequency</th><th>Type</th><th>Where to treat</th><th>With what</th></tr>
      <tr><td>1</td><td>(1,0,0)</td><td class="num">37.3 Hz</td><td>axial · length</td><td>Rear wall (behind the seat) and front wall</td><td>Membrane trap tuned ≈ 37 Hz — heavy panel, deep cavity (carbon helps); plus seat position</td></tr>
      <tr><td>2</td><td>(0,1,0)</td><td class="num">50.4 Hz</td><td>axial · width</td><td>Both side walls, low and in the corners</td><td>Membrane traps ≈ 50 Hz on each side wall (keep left = right)</td></tr>
      <tr><td>3</td><td>(1,1,0)</td><td class="num">62.7 Hz</td><td>tangential</td><td>The four vertical corners, full height</td><td>Deep porous corner traps (≥ 400 mm) or corner membranes ≈ 63 Hz</td></tr>
      <tr><td>4</td><td>(0,0,1)</td><td class="num">68.6 Hz</td><td>axial · height</td><td>Ceiling and wall–ceiling edges</td><td>Thick cloud with an air gap; soffit traps along the edges</td></tr>
      <tr><td>5</td><td>(2,0,0)</td><td class="num">74.6 Hz</td><td>axial · length</td><td>Front and rear walls (also strong at mid-length)</td><td>Rear-wall trap ≈ 75 Hz or 300 mm porous rear absorber</td></tr>
      <tr><td>6</td><td>(1,0,1)</td><td class="num">78.1 Hz</td><td>tangential</td><td>Front/rear wall–ceiling and wall–floor edges</td><td>Soffit trap along the rear wall–ceiling edge</td></tr>
      <tr><td>7</td><td>(0,1,1)</td><td class="num">85.1 Hz</td><td>tangential</td><td>Side wall–ceiling edges</td><td>Soffit traps along both side walls</td></tr>
      <tr><td>8</td><td>(2,1,0)</td><td class="num">90.0 Hz</td><td>tangential</td><td>Vertical corners (and side walls at mid-length)</td><td>The corner traps from row 3 already cover it</td></tr></table></div>
    <p>Notice how few <i>places</i> are needed: four vertical corners, the rear wall, the two side walls and the ceiling perimeter cover all eight. Try your own room in the tool — select a mode, read where it peaks, click to place traps and watch the decay bars.</p>
    <div class="callout data"><b>Rules of thumb</b><ul style="margin:.3em 0 0;padding-left:18px">
      <li><b>Area:</b> one small box does little. Plan in square metres — roughly 1–2 m² of well-placed resonant trap per problem mode in a small room, more for the lowest ones; share the available surfaces between modes by priority.</li>
      <li><b>Tuning:</b> a resonant trap should sit within about ± 10 % of the mode. Measure the room first; build the trap adjustable.</li>
      <li><b>Line of sight:</b> the membrane face or Helmholtz openings must “see” the room. Do not park a sofa, rack or cupboard hard against them.</li>
      <li><b>Layering:</b> a resonant trap can sit <i>behind</i> a porous layer (the bass passes through the wool), not the other way round.</li>
      <li><b>Symmetry:</b> treat left and right alike so the stereo image stays centred.</li>
      <li><b>Seat first:</b> never sit on a null plane of an important mode — no trap will bring that note back.</li></ul></div>
    <h4>Verify before and after</h4>
    <ol><li><b>Walk test:</b> play a sine tone at the mode’s frequency and walk the room with a phone SPL app (or your ears). The loud places are the pressure zones — that is where the trap goes; the quiet lines are the nulls.</li>
    <li><b>Measure the decay</b> of that frequency at the seat (waterfall or band-filtered decay) before and after. Success is a shorter ring, not only a lower peak.</li>
    <li><b>Check the neighbours:</b> make sure the trap did not leave the modes next to it untouched and now more obvious.</li></ol>
    <div class="callout warn"><b>Common mistakes:</b> a tuned trap in the middle of a wall that is a null line for its mode · traps for a length mode placed on the side walls · one 600 × 600 mm trap expected to cure a 40 Hz mode · thin foam “bass traps” in corners · furniture blocking the trap face · tuning from a calculator without measuring the room.</div>
    <p>Go further: the <a href="#/treatment">Room Treatment Simulator</a> for a full layout, the <a href="#/predict">Room Predictor</a> for the list of modes, <a href="#/academy/pv-standing">Pressure, Velocity &amp; Standing Waves</a> for the physics, and <a href="#/academy/m-carbon">Activated Carbon</a> when depth is short.</p>`, viz: 'trapPlacer' };
  ['modes-treat', 'm-small-rooms', 'm-treat-designs'].forEach((id) => addTo(id, [PLACE]));
})();
