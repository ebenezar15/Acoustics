/* ==========================================================================
   Outdoor and environmental sound (5C), structure-borne and impact sound
   (13A), special absorbers (M18F) and computer modelling of rooms (18A).
   Original text written from general knowledge; typical guidance values.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design|solution/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const tbl = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c, i) => `<td>${i ? c : `<b>${c}</b>`}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const C1 = '#7a5cc7', C2 = '#c7772b', C3 = '#2b9fc7', C4 = '#4c9a3a', C5 = '#d14b8f', C6 = '#c7a12b';
  const after = (ids, lesson) => { const L = window.LESSONS; for (const id of ids) { const i = L.findIndex((x) => x.id === id); if (i >= 0) { L.splice(i + 1, 0, lesson); return; } } L.push(lesson); };
  const rings = (cx, cy, col, n = 3, r0 = 10, dr = 14) => Array.from({ length: n }, (_, i) => `<circle class="lock-wave${i ? ' d' + Math.min(3, i + 1) : ''}" cx="${cx}" cy="${cy}" r="${r0 + i * dr}" fill="none" stroke="var(--${col})" stroke-width="1.6"/>`).join('');

  /* =====================================================================
     SVGs — outdoor sound
     ===================================================================== */
  const SVG_OUT_PATH = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="What happens to sound outdoors">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Outdoors: five things act on the sound between source and listener</text>
    <rect x="0" y="170" width="680" height="8" fill="var(--c4)" opacity=".5"/>
    <circle cx="50" cy="140" r="9" fill="var(--accent)"/>${rings(50, 140, 'accent')}
    <text x="50" y="196" text-anchor="middle" font-size="10">source</text>
    <rect x="330" y="96" width="8" height="74" fill="var(--text)"/><text x="334" y="90" text-anchor="middle" font-size="10">④ barrier</text>
    <circle cx="630" cy="150" r="8" fill="var(--good)"/><text x="630" y="196" text-anchor="middle" font-size="10">listener</text>
    <path class="leak-pulse" d="M60 138 L334 94 L622 148" fill="none" stroke="var(--accent2)" stroke-width="2"/>
    <path d="M60 142 Q 200 176 330 168" fill="none" stroke="var(--warn)" stroke-width="1.6" stroke-dasharray="5 4"/>
    <text x="70" y="84" font-size="10" fill="var(--accent2)">① spreading: weaker with distance</text>
    <text x="200" y="194" text-anchor="middle" font-size="10" fill="var(--warn)">③ ground reflection</text>
    <text x="300" y="60" text-anchor="middle" font-size="10" fill="var(--c3)">② air absorbs treble</text>
    <path d="M240 40 q 20 -14 40 0 q 20 14 40 0 q 20 -14 40 0" fill="none" stroke="var(--c3)" stroke-width="1.6"><animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2s" repeatCount="indefinite"/></path>
    <path d="M440 40 l40 0 m-10 -6 l10 6 l-10 6" fill="none" stroke="var(--muted)" stroke-width="1.6"/><text x="490" y="44" font-size="10" fill="var(--muted)">⑤ wind &amp; temperature</text>
    <text x="480" y="130" font-size="10" fill="var(--muted)">shadow zone</text>
  </svg>`;

  const SVG_SPREAD = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Point, line and area sources">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">How fast level falls depends on the shape of the source</text>
    <g><text x="110" y="38" text-anchor="middle" font-size="12" font-weight="700">Point source</text>
      <circle cx="110" cy="110" r="6" fill="var(--accent)"/>${rings(110, 110, 'accent', 3, 16, 18)}
      <text x="110" y="182" text-anchor="middle" font-size="11" fill="var(--bad)">−6 dB per doubling</text><text x="110" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">a generator, a loudspeaker, one car</text></g>
    <g><text x="340" y="38" text-anchor="middle" font-size="12" font-weight="700">Line source</text>
      <rect x="250" y="107" width="180" height="6" rx="3" fill="var(--accent)"/>
      ${[0, 1, 2].map((i) => `<rect class="lock-wave${i ? ' d' + (i + 1) : ''}" x="${244 - i * 4}" y="${95 - i * 14}" width="${192 + i * 8}" height="${30 + i * 28}" rx="${15 + i * 14}" fill="none" stroke="var(--accent)" stroke-width="1.6"/>`).join('')}
      <text x="340" y="182" text-anchor="middle" font-size="11" fill="var(--warn)">−3 dB per doubling</text><text x="340" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">a busy road, a railway, a long line array (near)</text></g>
    <g><text x="570" y="38" text-anchor="middle" font-size="12" font-weight="700">Area source (close)</text>
      <rect x="520" y="60" width="10" height="100" fill="var(--accent)"/>
      ${[0, 1, 2].map((i) => `<line class="lock-wave${i ? ' d' + (i + 1) : ''}" x1="${548 + i * 22}" y1="62" x2="${548 + i * 22}" y2="158" stroke="var(--accent)" stroke-width="1.8"/>`).join('')}
      <text x="570" y="182" text-anchor="middle" font-size="11" fill="var(--good)">≈ 0 dB close to it</text><text x="570" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">a factory wall, an open hangar door</text></g>
  </svg>`;

  const SVG_GROUND = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Ground effect and refraction">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Ground and weather: why the same site sounds different every day</text>
    <g><text x="170" y="36" text-anchor="middle" font-size="11" font-weight="700">Soft ground: the “ground dip”</text>
      <rect x="20" y="150" width="300" height="8" fill="var(--c4)" opacity=".6"/>
      <circle cx="40" cy="120" r="6" fill="var(--accent)"/><circle cx="300" cy="126" r="6" fill="var(--good)"/>
      <path class="leak-pulse" d="M46 120 L294 126" stroke="var(--accent2)" stroke-width="2" fill="none"/>
      <path d="M46 122 L170 150 L294 128" stroke="var(--warn)" stroke-width="2" fill="none" stroke-dasharray="5 4"/>
      <text x="170" y="112" text-anchor="middle" font-size="10" fill="var(--accent2)">direct</text><text x="170" y="172" text-anchor="middle" font-size="10" fill="var(--warn)">reflected — phase flipped by grass or soil</text>
      <text x="170" y="190" text-anchor="middle" font-size="10" fill="var(--muted)">the two cancel around 200–600 Hz: up to 10–20 dB extra loss</text></g>
    <g><text x="510" y="36" text-anchor="middle" font-size="11" font-weight="700">Refraction: the air bends the rays</text>
      <rect x="360" y="150" width="300" height="8" fill="var(--c4)" opacity=".6"/>
      <circle cx="380" cy="140" r="6" fill="var(--accent)"/>
      <path d="M386 138 Q 500 40 650 70" stroke="var(--c3)" stroke-width="2" fill="none"/><text x="440" y="52" font-size="10" fill="var(--c3)">hot afternoon / upwind: bends up</text>
      <path class="leak-pulse" d="M386 140 Q 520 84 650 146" stroke="var(--bad)" stroke-width="2" fill="none"/><text x="510" y="174" text-anchor="middle" font-size="10" fill="var(--bad)">cold clear night / downwind: bends down</text>
      <text x="510" y="190" text-anchor="middle" font-size="10" fill="var(--muted)">±10 dB at a few hundred metres — predict for the worst case</text></g>
  </svg>`;

  const SVG_BARRIER = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Barrier path difference">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A barrier works by making the sound take a detour</text>
    <rect x="0" y="180" width="680" height="8" fill="var(--c4)" opacity=".5"/>
    <polygon points="344,60 680,128 680,180 344,180" fill="var(--muted)" opacity=".13"/>
    <rect x="336" y="60" width="8" height="120" fill="var(--text)"/>
    <circle cx="120" cy="160" r="8" fill="var(--accent)"/><circle cx="560" cy="158" r="8" fill="var(--good)"/>
    <line x1="120" y1="160" x2="560" y2="158" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="5 4"/><text x="150" y="176" font-size="10" fill="var(--muted)">d — the straight line (blocked)</text>
    <path class="leak-pulse" d="M120 160 L340 60 L560 158" fill="none" stroke="var(--accent2)" stroke-width="2.4"/>
    <text x="216" y="98" font-size="11" fill="var(--accent2)" font-weight="700">A</text><text x="460" y="98" font-size="11" fill="var(--accent2)" font-weight="700">B</text>
    <text x="340" y="48" text-anchor="middle" font-size="10">diffracting edge</text>
    <text x="120" y="204" text-anchor="middle" font-size="10">source</text><text x="560" y="204" text-anchor="middle" font-size="10">listener</text>
    <text x="520" y="118" font-size="10" fill="var(--muted)">shadow zone</text>
    <rect x="20" y="30" width="190" height="42" rx="8" fill="var(--panel2)" stroke="var(--accent2)"/><text x="115" y="48" text-anchor="middle" font-size="11" font-weight="700">δ = A + B − d</text><text x="115" y="64" text-anchor="middle" font-size="10" fill="var(--muted)">the path difference</text>
  </svg>`;

  const SVG_DESCR = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Noise descriptors on a level trace">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">One wobbly trace, four honest ways to summarise it</text>
    <line x1="40" y1="170" x2="660" y2="170" stroke="var(--muted)"/><line x1="40" y1="30" x2="40" y2="170" stroke="var(--muted)"/>
    <polyline class="leak-pulse" fill="none" stroke="var(--accent)" stroke-width="2" points="40,140 70,138 90,142 110,120 120,70 130,118 150,140 190,142 220,136 240,104 250,52 262,100 280,138 320,144 360,140 380,126 392,84 404,124 430,142 470,140 500,136 520,96 530,40 542,92 560,136 600,142 660,140"/>
    <line x1="40" y1="40" x2="660" y2="40" stroke="var(--bad)" stroke-dasharray="3 4"/><text x="656" y="36" text-anchor="end" font-size="10" fill="var(--bad)">Lmax — the single loudest instant</text>
    <line x1="40" y1="96" x2="660" y2="96" stroke="var(--c5)" stroke-dasharray="6 4"/><text x="656" y="92" text-anchor="end" font-size="10" fill="var(--c5)">L10 — exceeded 10 % of the time: “the events”</text>
    <line x1="40" y1="116" x2="660" y2="116" stroke="var(--good)" stroke-dasharray="6 4"/><text x="656" y="112" text-anchor="end" font-size="10" fill="var(--good)">Leq — the steady level with the same energy</text>
    <line x1="40" y1="140" x2="660" y2="140" stroke="var(--accent2)" stroke-dasharray="6 4"/><text x="656" y="156" text-anchor="end" font-size="10" fill="var(--accent2)">L90 — exceeded 90 % of the time: “the background”</text>
    <text x="350" y="188" text-anchor="middle" font-size="10" fill="var(--muted)">time →</text>
  </svg>`;

  /* =====================================================================
     SVGs — impact and structure-borne sound
     ===================================================================== */
  const SVG_THREE = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Airborne, impact and structure-borne sound">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Three ways sound gets into the room below</text>
    <rect x="20" y="96" width="640" height="14" fill="var(--muted)" opacity=".6"/>
    <line x1="233" y1="30" x2="233" y2="210" stroke="var(--line)"/><line x1="446" y1="30" x2="446" y2="210" stroke="var(--line)"/>
    <g><text x="126" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent2)">① Airborne</text>
      <circle cx="126" cy="70" r="8" fill="var(--accent2)"/>${rings(126, 70, 'accent2', 2, 14, 10)}
      <path class="leak-pulse" d="M126 112 v50" stroke="var(--accent2)" stroke-width="2" stroke-dasharray="4 4"/>
      <text x="126" y="182" text-anchor="middle" font-size="10">air shakes the floor,</text><text x="126" y="196" text-anchor="middle" font-size="10">floor shakes the air below</text><text x="126" y="210" text-anchor="middle" font-size="10" fill="var(--muted)">voices, TV, loudspeakers</text></g>
    <g><text x="340" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bad)">② Impact</text>
      <rect class="door-press" x="332" y="62" width="16" height="30" fill="var(--bad)"/>
      <path class="leak-pulse" d="M340 112 v54 M320 112 l-14 50 M360 112 l14 50" stroke="var(--bad)" stroke-width="2.4" fill="none"/>
      <text x="340" y="182" text-anchor="middle" font-size="10">a blow puts force straight</text><text x="340" y="196" text-anchor="middle" font-size="10">into the structure</text><text x="340" y="210" text-anchor="middle" font-size="10" fill="var(--muted)">footsteps, chairs, dropped objects</text></g>
    <g><text x="553" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="var(--warn)">③ Structure-borne</text>
      <rect x="528" y="66" width="50" height="30" rx="4" fill="var(--warn)"/><circle class="hot" cx="553" cy="81" r="8" fill="none" stroke="#fff" stroke-width="2"/>
      <path class="leak-pulse" d="M470 103 h180" stroke="var(--warn)" stroke-width="3"/><path d="M640 110 v60" stroke="var(--warn)" stroke-width="2" stroke-dasharray="4 4"/>
      <text x="553" y="182" text-anchor="middle" font-size="10">a machine vibrates the frame;</text><text x="553" y="196" text-anchor="middle" font-size="10">it re-radiates rooms away</text><text x="553" y="210" text-anchor="middle" font-size="10" fill="var(--muted)">pumps, lifts, washing machines, subs</text></g>
  </svg>`;

  const SVG_WAVETYPES = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Waves in solids">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Three kinds of wave travel in a wall or slab — one of them makes the noise</text>
    <g><text x="20" y="52" font-size="11" font-weight="700">Longitudinal</text><text x="20" y="66" font-size="10" fill="var(--muted)">push–pull along the plate · very fast (3 000–5 000 m/s)</text>
      ${Array.from({ length: 30 }, (_, i) => `<line x1="${330 + i * 11 + 5 * Math.sin(i * 0.9)}" y1="42" x2="${330 + i * 11 + 5 * Math.sin(i * 0.9)}" y2="66" stroke="var(--c3)" stroke-width="2"/>`).join('')}</g>
    <g><text x="20" y="110" font-size="11" font-weight="700">Shear</text><text x="20" y="124" font-size="10" fill="var(--muted)">sideways sliding in the plane · about 60 % of that speed</text>
      <path d="M330 112 ${Array.from({ length: 33 }, (_, i) => `L${330 + i * 10} ${112 + 5 * Math.sin(i * 0.9)}`).join(' ')}" fill="none" stroke="var(--c5)" stroke-width="10" opacity=".7"/></g>
    <g><text x="20" y="166" font-size="11" font-weight="700" fill="var(--accent)">Bending (flexural)</text><text x="20" y="180" font-size="10" fill="var(--muted)">the plate ripples like a shaken rug · slow, and faster at high pitch</text>
      <path class="leak-pulse" d="M330 168 ${Array.from({ length: 33 }, (_, i) => `L${330 + i * 10} ${168 + 14 * Math.sin(i * 0.55)}`).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="5"/>
      ${[0, 1, 2, 3].map((i) => `<path class="lock-wave d${(i % 3) + 1}" d="M${370 + i * 76} 148 q 14 -16 28 0" fill="none" stroke="var(--accent2)" stroke-width="1.6"/>`).join('')}</g>
    <text x="490" y="204" text-anchor="middle" font-size="10" fill="var(--accent2)">only bending moves the surface in and out — so only it pushes air</text>
  </svg>`;

  const SVG_TAP = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Impact sound test">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">How impact sound is measured: a standard hammer machine above, a microphone below</text>
    <rect x="60" y="30" width="560" height="170" fill="none" stroke="var(--text)" stroke-width="2"/>
    <rect x="60" y="104" width="560" height="14" fill="var(--muted)" opacity=".7"/>
    <rect x="290" y="76" width="100" height="16" rx="3" fill="var(--panel2)" stroke="var(--text)"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${300 + i * 18}" y="92" width="8" height="12" fill="var(--bad)"><animate attributeName="y" values="84;92;84" dur="0.5s" begin="${i * 0.1}s" repeatCount="indefinite"/></rect>`).join('')}
    <text x="340" y="66" text-anchor="middle" font-size="10">tapping machine: five 0.5 kg hammers, ten blows a second</text>
    ${rings(340, 122, 'bad', 3, 14, 16)}
    <circle cx="420" cy="160" r="6" fill="var(--good)"/><line x1="420" y1="166" x2="420" y2="178" stroke="var(--good)" stroke-width="2"/><text x="432" y="164" font-size="10" fill="var(--good)">microphone, moved around the room</text>
    <text x="80" y="140" font-size="10" fill="var(--muted)">receiving room</text><text x="80" y="50" font-size="10" fill="var(--muted)">source room</text>
    <text x="80" y="188" font-size="10">level L<tspan baseline-shift="sub" font-size="8">i</tspan> in each third-octave band, corrected for the room’s reverberation → L<tspan baseline-shift="sub" font-size="8">n</tspan></text>
    <text x="340" y="214" text-anchor="middle" font-size="10" fill="var(--muted)">A level is reported, not a reduction — so for impact sound a LOWER number is better.</text>
  </svg>`;

  const SVG_FLOAT = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Floating floor and the bridges that ruin it">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A floating floor — and the four bridges that short-circuit it</text>
    <rect x="40" y="150" width="600" height="34" fill="var(--muted)" opacity=".55"/><text x="340" y="172" text-anchor="middle" font-size="10">structural slab</text>
    <rect x="72" y="134" width="536" height="14" fill="var(--warn)" opacity=".85"/><text x="340" y="145" text-anchor="middle" font-size="9">resilient layer — the spring</text>
    <rect x="72" y="100" width="536" height="34" fill="var(--c3)" opacity=".6"/><text x="340" y="121" text-anchor="middle" font-size="10">floating screed or deck — the mass</text>
    <rect x="40" y="40" width="20" height="144" fill="var(--muted)" opacity=".8"/><rect x="620" y="40" width="20" height="144" fill="var(--muted)" opacity=".8"/>
    <rect x="62" y="86" width="8" height="62" fill="var(--warn)"/><rect x="610" y="86" width="8" height="62" fill="var(--warn)"/><text x="22" y="34" font-size="10" fill="var(--warn)">edge strip, all round ↓</text>
    <rect x="62" y="74" width="16" height="22" fill="var(--c6, #c7a12b)" opacity=".9"/><circle class="hot" cx="70" cy="98" r="5" fill="var(--bad)"/><text x="86" y="70" font-size="10" fill="var(--bad)">① skirting pressed onto the floor</text>
    <rect x="200" y="100" width="6" height="52" fill="var(--bad)"/><circle class="hot" cx="203" cy="150" r="5" fill="var(--bad)"/><text x="212" y="96" font-size="10" fill="var(--bad)">② screw or nail through the layer</text>
    <path d="M400 134 l10 14 l10 -14 z" fill="var(--bad)"/><circle class="hot" cx="410" cy="148" r="5" fill="var(--bad)"/><text x="424" y="96" font-size="10" fill="var(--bad)">③ screed leaking through a torn joint</text>
    <rect x="540" y="60" width="10" height="124" fill="var(--bad)" opacity=".8"/><circle class="hot" cx="545" cy="140" r="5" fill="var(--bad)"/><text x="534" y="54" text-anchor="end" font-size="10" fill="var(--bad)">④ pipe cast in rigidly</text>
    <text x="340" y="206" text-anchor="middle" font-size="10" fill="var(--muted)">One rigid contact the size of a coin can cost 10 dB. Sleeve every pipe, turn the layer up at every edge,</text>
    <text x="340" y="220" text-anchor="middle" font-size="10" fill="var(--muted)">fix skirtings to the wall only, with a soft joint above the floor.</text>
  </svg>`;

  /* =====================================================================
     LESSON 5C — Outdoor and environmental sound
     ===================================================================== */
  after(['moving-extreme', 'wave-physics', 'propagation'], {
    id: 'outdoor-sound', n: '5C',
    title: 'Outdoor and Environmental Sound: Air, Ground, Barriers and Noise Descriptors',
    level: 'Core', mins: 34,
    summary: 'What happens to sound when there is no room around it: how level falls with distance, why far-away sound is dull, how ground, wind and temperature bend it, how barriers really work — and the vocabulary of L<sub>Aeq</sub>, L<sub>10</sub>, L<sub>90</sub> and L<sub>den</sub> used to describe noise that never stays still.',
    tags: ['outdoor', 'barrier', 'air absorption', 'environmental noise', 'Leq', 'Lden', 'festival', 'site survey', 'diffraction'],
    sections: [
      { h: 'Outdoors there is no room — only a path', html: `
        <p>Indoors, sound is trapped and the room decides what you hear. Outdoors, sound leaves and never comes back. What reaches a listener depends only on what happens along the <b>path</b> between the two: how far it is, what the air does, what the ground does, what stands in the way, and what the weather is doing today.</p>
        ${SVG_OUT_PATH}
        <p>This matters to a studio designer more than it first appears. The noise your walls must keep out arrives along outdoor paths; the noise your air-conditioning plant, your loading bay or your outdoor event makes is judged at somebody else’s window. Both problems are solved with the same five ideas.</p>
        ${flow([['Spreading', 'energy thins out with distance'], ['Air', 'removes high frequencies'], ['Ground', 'adds or cancels a reflection'], ['Obstacles', 'barriers, buildings, terrain'], ['Weather', 'wind and temperature bend the path']])}
        <div class="callout mentor"><b>Think in decibels lost.</b> Every outdoor calculation is a subtraction: level near the source, minus each loss along the path. If you can estimate five numbers you can predict a neighbour’s level within a few decibels — good enough to decide whether you have a problem.</div>` },
      { h: 'Spreading: point, line and area sources', html: `
        <p>A small source sends its energy out over an ever larger sphere. Double the distance and the same energy covers four times the area: the level drops <b>6 dB</b>. This is the inverse-square law and it is pure geometry — no energy is lost, it is just shared more thinly.</p>
        ${SVG_SPREAD}
        <p>Not every source is small. A stream of traffic behaves like a long line: its energy spreads over a cylinder, not a sphere, and falls only <b>3 dB</b> per doubling. A large radiating wall hardly drops at all until you are further away than its own size. Every source eventually looks like a point once you are far enough away — roughly beyond three times its largest dimension.</p>
        ${tbl(['Source', 'Behaves like', 'Loss per doubling of distance', '10 m → 160 m'], [
          ['Generator, chiller, one loudspeaker', 'Point', '6 dB', '−24 dB'],
          ['Busy road, railway, conveyor', 'Line', '3 dB', '−12 dB'],
          ['Factory façade, stadium opening (close)', 'Area', '0–3 dB', 'small until far away'],
          ['Tall line array, within its own length × a few', 'Line, then point', '3 dB then 6 dB', 'depends on frequency'],
        ])}
        <div class="formula"><span class="lbl">Point source over hard ground</span> L<sub>p</sub> = L<sub>w</sub> − 20·log<sub>10</sub>(r) − 8 dB &nbsp;·&nbsp; r in metres, L<sub>w</sub> = sound power level</div>
        <div class="callout example"><b>Worked example.</b> A rooftop condenser is labelled L<sub>w</sub> = 78 dB(A). At a neighbour’s window 25 m away: 78 − 20·log(25) − 8 = 78 − 28 − 8 = <b>42 dB(A)</b>. If the night-time background there is 35 dB(A), you need about 10 dB more loss — a screen, a quieter unit, or a different position.</div>
        <div class="callout warn"><b>Common mistake:</b> applying “6 dB per doubling” to a road. Moving a house from 20 m to 40 m from a motorway gains only 3 dB — barely noticeable. Distance alone rarely solves traffic noise.</div>` },
      { h: 'The air itself absorbs treble', html: `
        <p>Air is not perfectly springy. As a sound wave squeezes and releases it, oxygen and nitrogen molecules take a moment to pass energy into their internal vibration and back, and some is lost as heat each cycle. The loss is tiny per metre at low frequencies and large at high ones — and it depends strongly on <b>humidity</b> and <b>temperature</b>.</p>
        <p>Order of magnitude at 20 °C and moderate humidity: about <b>0.04 dB per 100 m at 125 Hz</b>, about <b>0.5 dB per 100 m at 1 kHz</b>, about <b>3 dB per 100 m at 4 kHz</b> and around <b>10 dB per 100 m at 8 kHz</b>. That is why thunder close by is a crack and far away is a rumble, and why distant music is all bass.</p>
        <div class="callout physics"><b>Counter-intuitive:</b> very dry air absorbs more than humid air across most of the audio band. “Damp air deadens sound” is folklore; fog and drizzle carry sound rather well.</div>`, viz: 'airAbsorption' },
      { h: 'Ground, vegetation, wind and temperature', html: `
        <p>The ground gives every outdoor sound a second path: a reflection. Over <b>hard ground</b> — asphalt, concrete, water — the reflection adds to the direct sound, up to +3 dB (or +6 dB right at the surface). Over <b>soft ground</b> — grass, soil, snow — the reflection is flipped in phase at grazing angles and partly cancels the direct sound in a broad band, typically 200–600 Hz. This “ground dip” is free attenuation, often worth more than a barrier, when both source and listener are low.</p>
        ${SVG_GROUND}
        <p><b>Vegetation</b> does very little. A hedge or a single row of trees is acoustically invisible; it takes tens of metres of dense woodland to gain a few decibels, mostly at high frequencies. Planting helps people feel better about noise they can no longer see — a real effect, but not an acoustic one.</p>
        <p><b>Weather</b> does a great deal. Sound travels faster in warm air and is carried by wind, so any gradient with height bends the rays. On a sunny afternoon the air is warmest at the ground and sound curves upward, leaving a shadow near the ground. On a clear, still night the ground cools, the air above is warmer, and sound curves back <i>down</i>, skipping over barriers and soft ground. Downwind does the same; upwind does the opposite. The difference between best and worst case at a few hundred metres is easily 10–20 dB. The physics of gradients is covered in <a href="#/academy/m-matter">Sound in Matter</a>.</p>
        <div class="callout warn"><b>For events and plant:</b> the sound-check is in the afternoon (favourable), the complaint comes at 11 pm on a clear night (unfavourable). Always assess the worst case that happens regularly, not the average.</div>` },
      { h: 'Barriers: path difference and the Fresnel number', html: `
        <p>A solid wall between source and listener does not “block” sound the way it blocks light. Sound bends — <b>diffracts</b> — over the top edge into the shadow. How much gets there depends on one thing: how much longer the bent path is than the straight one, compared with the wavelength.</p>
        ${SVG_BARRIER}
        <div class="formula"><span class="lbl">Fresnel number</span> N = 2·δ / λ &nbsp;=&nbsp; 2·δ·f / c</div>
        <div class="formula"><span class="lbl">Insertion loss (single screen, point source)</span> IL ≈ 10·log<sub>10</sub>(3 + 20·N) dB &nbsp;·&nbsp; practical ceiling ≈ 20–24 dB</div>
        <p>Read the formula in words: with zero detour (the edge exactly on the sight line) you still gain about 5 dB. Each doubling of N — by doubling the detour or going up an octave — adds about 3 dB. So the same barrier that gives 19 dB at 2 kHz gives only 9 dB at 125 Hz: <b>barriers are high-frequency devices</b>.</p>
        ${tbl(['Path difference δ', '125 Hz', '500 Hz', '2 kHz'], [
          ['0 (grazing the top)', '5 dB', '5 dB', '5 dB'],
          ['50 mm', '6 dB', '8 dB', '12 dB'],
          ['300 mm', '9 dB', '13 dB', '19 dB'],
          ['1 m', '12 dB', '18 dB', '24 dB (limit)'],
        ])}
        <div class="callout mentor"><b>Three rules that follow directly:</b> (1) put the barrier as close as possible to the source <i>or</i> to the listener — never in the middle; (2) height above the sight line is what counts, not height above the ground; (3) a barrier needs length: sound also comes around the ends, so extend it at least four times its distance from the source to each side, or wrap it around.</div>` , viz: 'barrierDesigner' },
      { h: 'Building a barrier that works — and where they fail', html: `
        <p>Because diffraction over the top limits a barrier to 15–20 dB, the panel itself only needs to be about 10 dB better than that. A surface mass of <b>10 kg/m²</b> or more — 18 mm timber boarding, 4 mm steel, 100 mm blockwork, an earth bund — is plenty. More mass is wasted; what is never wasted is <b>airtightness</b>.</p>
        ${tbl(['Failure', 'What you hear', 'Fix'], [
          ['Gaps between boards or under the panel', 'Hiss and clatter leak through; barrier “does nothing”', 'Overlapped or tongue-and-groove boards; gravel board sealed to the ground'],
          ['Barrier too short', 'Level drops in front, unchanged to the sides', 'Extend or return the ends around the source'],
          ['Reflective barrier facing another wall', 'Sound bounces across and over the top', 'Absorptive facing on the source side'],
          ['Listener above the barrier', 'Upper floors unprotected', 'Raise it, move it to the source, or enclose the source instead'],
          ['Bass source (subwoofers, exhaust, transformers)', 'Thump unaffected', 'Enclosure, silencer, directional array — not a screen'],
        ])}
        <p><b>Indoors</b>, screens behave the same way but with a catch: the ceiling and walls reflect sound around them. A gobo between drums and a vocalist, or a screen between desks, gives the outdoor figure only if the ceiling above and the nearest walls are absorbent. In a live room with a hard ceiling, expect 3–6 dB whatever the screen’s height.</p>
        <p>Diffraction also explains two everyday observations. Bass from a party goes around buildings while the treble stays in line of sight. And directly behind a round or square obstacle there can be a small <b>bright spot</b>, where waves bending around every edge arrive together and add — the shadow is deepest just off the centre line, not on it.</p>
        ${myth([['“A row of conifers will screen the road.”', 'Visually yes, acoustically no. You need a solid, gap-free barrier of 10 kg/m² or more; plant in front of it if you like.'], ['“Double the barrier’s thickness for more isolation.”', 'The sound goes over, not through. Spend on height and on closing gaps.'], ['“An absorptive barrier absorbs the noise.”', 'It only stops reflections back toward the source side. The screening on the listener’s side is the same as a hard barrier.']])}` },
      { h: 'Describing noise that never stays still', html: `
        <p>Indoors you can quote a single level. Outdoors the level changes every second — a lull, a lorry, a siren, a lull. Regulations therefore use <b>statistical descriptors</b>, each answering a different question about the same record.</p>
        ${SVG_DESCR}
        ${tbl(['Symbol', 'What it is', 'What it tells you', 'Typical use'], [
          ['L<sub>Aeq,T</sub>', 'The steady level that would deliver the same sound energy over the period T', 'Overall dose; dominated by the loud moments', 'Almost everything: traffic, industry, events, exposure at work'],
          ['L<sub>A90</sub>', 'Level exceeded for 90 % of the time', 'The background when nothing in particular is happening', 'Baseline against which new noise is judged'],
          ['L<sub>A10</sub>', 'Level exceeded for 10 % of the time', 'How loud the frequent events are', 'Road traffic in some countries'],
          ['L<sub>AFmax</sub>', 'Highest level, “fast” time weighting', 'The loudest single event', 'Sleep disturbance; sizing studio isolation'],
          ['SEL / L<sub>AE</sub>', 'All the energy of one event compressed into one second', 'Lets you add up events (trains, aircraft)', 'Railway and aircraft noise calculations'],
          ['L<sub>dn</sub>', '24-hour L<sub>Aeq</sub> with +10 dB added to night (22:00–07:00)', 'Annoyance, weighting the night', 'Planning in North America'],
          ['L<sub>den</sub>', 'Day, evening (+5 dB) and night (+10 dB) combined', 'Annoyance, weighting evening and night', 'Noise mapping in Europe and elsewhere'],
        ])}
        <div class="callout example"><b>Why the average is “dominated by the loud moments”.</b> One minute at 90 dB carries the same energy as 1 000 minutes at 60 dB. A site that is quiet for 23 hours and has a goods train for 10 minutes can have the same L<sub>Aeq</sub> as a site with steady traffic all day — and feel completely different. That is why you look at L<sub>90</sub> and L<sub>max</sub> as well.</div>`, viz: 'noiseDescriptors' },
      { h: 'Rating levels, penalties and noise maps', html: `
        <p>Two noises with the same L<sub>Aeq</sub> are not equally annoying. Assessment methods therefore add <b>character corrections</b> to the measured level to get a <b>rating level</b>, typically:</p>
        <ul><li><b>Tonal</b> noise (a hum, whine or whistle you can pick out): +2 to +6 dB.</li>
        <li><b>Impulsive</b> noise (bangs, clatter, hammering): +3 to +9 dB.</li>
        <li><b>Intermittent</b> noise that switches on and off noticeably: about +3 dB.</li>
        <li>Noise with strong <b>low-frequency</b> content: assessed separately, often in dB(C) or octave bands, because the A-weighting hides it.</li></ul>
        <p>The rating level is then compared with the background (L<sub>A90</sub>). As a rule of thumb used in several national methods: rating level around the background or below — low impact; about <b>+5 dB</b> above — an adverse impact is likely; <b>+10 dB</b> or more — a significant one, expect complaints. Environmental noise measurement and description are covered by the ISO 1996 series and outdoor propagation by ISO 9613 (check the current editions and your national method).</p>
        <p><b>Noise maps</b> are computer predictions of L<sub>den</sub> and L<sub>night</sub> over a whole city, built from traffic flows, speeds, building outlines and terrain using exactly the losses in this lesson. They are published by many authorities and are a quick first look at a site — but they show annual averages at 4 m height from major sources only. They say nothing about the nightclub next door.</p>
        <div class="callout warn"><b>dB(A) hides bass.</b> At 63 Hz the A-weighting subtracts 26 dB. A subwoofer or a generator exhaust can dominate what a neighbour hears indoors while barely moving the dB(A) reading. Whenever the source is bass-heavy, measure dB(C) or the 63 and 125 Hz octave bands as well.</div>` },
      { h: 'Surveying a studio site and planning an outdoor event', html: `
        <p><b>Choosing or assessing a studio site.</b> The outdoor climate sets how heavy — and how expensive — your shell has to be.</p>
        ${flow([['Walk it', 'roads, rail, flight paths, bars, schools, workshops, plant on neighbouring roofs'], ['Log it', 'unattended meter for at least 24 h, ideally a weekday and a weekend night'], ['Read it', 'LAeq, LA90, and above all LAFmax of regular events, in octave bands'], ['Set the target', 'the noise criterion inside the studio (NC / NR curve)'], ['Subtract', 'outdoor event spectrum − indoor target = isolation needed, band by band'], ['Check outward', 'your monitors and drums at night against the neighbours’ background']])}
        <p>The band-by-band subtraction nearly always shows that the <b>low frequencies</b> decide the construction: a lorry at 85 dB in the 63 Hz band against an indoor target of 45 dB needs 40 dB at 63 Hz, which is box-in-box territory, even though the dB(A) difference looks easy.</p>
        <p><b>Planning an outdoor event.</b> The same subtraction, run forwards: level at the mix position → spreading → air → ground → barriers → weather → level at the nearest home, compared with a limit set by the licence. The big levers are decided before any equipment arrives: which way the stage faces, how far the homes are, and how the bass is controlled.</p>
        <div class="callout mentor"><b>Outdoor plant</b> (chillers, condensers, generators, extract fans) follows the same recipe and is the most common reason a finished studio gets a complaint. See <a href="#/academy/m-building-services">Building Services Noise</a> for selection, silencers and screens.</div>`, viz: 'eventNoise' },
      { h: 'Use cases, problems and solutions', html: `
        <div class="uc-grid">
        ${uc('🏠', 'Home studio next to a main road', [['Problem', 'Lorries intrude on quiet takes; the road is 15 m away'], ['Why', 'Line source: distance barely helps. Low-frequency rumble passes light walls and windows'], ['Do', 'Put the studio on the far side of the house; heavy secondary glazing with a wide cavity; a solid garden wall close to the road helps the ground floor only']], C3)}
        ${uc('❄️', 'Condenser unit and a bedroom window', [['Problem', '42 dB(A) at the neighbour against a 33 dB(A) night background'], ['Why', 'Rating level about 9 dB above background — and tonal, which adds a penalty'], ['Fix', 'Quieter unit or night set-back mode first; then an absorptive-lined screen close to the unit, taller than the sight line to the window; anti-vibration mounts']], C2)}
        ${uc('🎪', 'Weekend festival, village 600 m away', [['Problem', 'Complaints about bass at 11 pm although dB(A) is within limit'], ['Why', 'Air and ground strip mids and highs; a night-time inversion bends the bass back down'], ['Solution', 'Stage facing away; cardioid subwoofer arrays; delay towers so the main system runs quieter; a 63/125 Hz limit; live monitoring at the boundary']], C5)}
        ${uc('🏫', 'School beside a railway', [['Problem', 'Teaching stops for each passing train'], ['Why', 'L<sub>Aeq</sub> looks acceptable; L<sub>AFmax</sub> of each event does not'], ['Design', 'Barrier at the track edge (close to the source), classrooms on the shielded side, sealed façade with mechanical ventilation on the exposed side']], C4)}
        ${uc('🎙️', 'Location recording outdoors', [['Problem', 'Distant traffic and wind spoil dialogue'], ['Why', 'Line-source traffic carries for kilometres; wind makes noise at the microphone itself'], ['Do', 'Record in the lee of a building (barrier), early morning when traffic is low, close directional microphones with full windshields']], C1)}
        ${uc('🏗️', 'Rehearsal room in an industrial estate', [['Problem', 'Quiet by night, noisy by day; neighbours work shifts'], ['Why', 'Background L<sub>A90</sub> falls 15 dB at night, so the same drum kit that was masked at noon is intrusive at midnight'], ['Fix', 'Design the shell for the night background, not the daytime one; lobby doors; no openable windows']], C6)}
        </div>
        <h4>Rules of thumb</h4>
        <ul><li>Point source: −6 dB per doubling of distance. Line source: −3 dB.</li>
        <li>Air absorption matters above 2 kHz and beyond about 100 m; bass travels almost unhindered.</li>
        <li>Breaking the line of sight ≈ 5 dB. A good barrier ≈ 10–15 dB. Nobody gets more than about 20 dB from a screen.</li>
        <li>Barrier mass ≥ 10 kg/m², no gaps, close to the source or the listener.</li>
        <li>A change of 3 dB is just noticeable, 5 dB clearly noticeable, 10 dB sounds half or twice as loud.</li>
        <li>New noise about 5 dB above the background draws attention; 10 dB above draws complaints.</li>
        <li>Design for a clear, still night and a light wind toward the neighbour.</li></ul>
        <div class="callout example"><b>Apply it.</b> Pick the noisiest thing your studio (or your building’s plant) sends outdoors and the nearest window that is not yours. Estimate: level at 1 m, distance, anything in the way. Subtract spreading and any barrier loss, then compare with a guess of the night-time background there (rural 25–30, suburban 30–40, city 40–50 dB(A)). If your result is above the background, you have just found your next project.</div>` },
    ],
    quiz: [
      { q: 'A house is 20 m from a continuously busy motorway. How much quieter would it be at 40 m, from distance alone?', opts: ['About 6 dB', 'About 3 dB', 'About 10 dB', 'No change at all'], a: 1, why: 'A long stream of traffic is a line source: its level falls 3 dB per doubling of distance, not 6.' },
      { q: 'Why does music from a distant outdoor event sound like bass only?', opts: ['Bass is produced at higher power than treble', 'The ear is more sensitive to bass at a distance', 'Air, ground and obstacles remove mid and high frequencies far more than low ones', 'Bass travels faster than treble'], a: 2, why: 'Air absorption rises steeply with frequency, and barriers and soft ground also act mainly on shorter wavelengths. All frequencies travel at the same speed.' },
      { q: 'A barrier gives 18 dB at 2 kHz. What is the best way to improve its performance at 125 Hz?', opts: ['Make the panel twice as heavy', 'Add absorption to the listener’s side', 'Increase the path difference — more height, or move it closer to the source', 'Plant trees behind it'], a: 2, why: 'Sound goes over the top, not through. Only a larger detour compared with the long bass wavelength helps; mass beyond about 10 kg/m² is wasted.' },
      { q: 'Which descriptor best represents the “background” noise against which a new source is judged?', opts: ['L<sub>AFmax</sub>', 'L<sub>A10</sub>', 'L<sub>Aeq</sub>', 'L<sub>A90</sub>'], a: 3, why: 'L<sub>A90</sub> is the level exceeded 90 % of the time — what remains between events.' },
      { q: 'In L<sub>den</sub>, how is night-time noise treated?', opts: ['It is ignored', 'It is counted as if it were 10 dB louder', 'It is counted as if it were 5 dB quieter', 'It is averaged with C-weighting'], a: 1, why: 'L<sub>den</sub> adds a 5 dB penalty to the evening and a 10 dB penalty to the night before averaging, to reflect greater sensitivity when people rest.' },
    ],
  });

  /* =====================================================================
     LESSON 13A — Structure-borne and impact sound
     ===================================================================== */
  after(['floating', 'vibration', 'isolation'], {
    id: 'impact-structure', n: '13A',
    title: 'Structure-borne and Impact Sound: Footsteps, Bending Waves and Floors',
    level: 'Advanced', mins: 36,
    summary: 'Why footsteps, chair legs, washing machines and subwoofers travel through a building in a way voices never do. How solids carry vibration, why bending waves radiate, how impact sound is measured and rated, and what actually works: soft coverings, floating floors, resilient ceilings and proper machine mounts.',
    tags: ['impact sound', 'structure-borne', 'footsteps', 'bending waves', 'critical frequency', 'floating floor', 'Ln,w', 'IIC', 'tapping machine', 'isolators'],
    sections: [
      { h: 'Three ways into the room below', html: `
        <p>When a neighbour complains about “noise through the floor”, three physically different things may be going on. They need different measurements, different ratings and different cures — and fixing the wrong one wastes the whole budget.</p>
        ${SVG_THREE}
        ${tbl(['', 'Airborne', 'Impact', 'Structure-borne (machines)'], [
          ['How energy gets in', 'Sound pressure in the air pushes on a large area', 'A blow delivers force at a point', 'A vibrating machine is bolted to the structure'],
          ['How much gets in', 'Very little — air and concrete are badly matched', 'A lot — solid on solid', 'A lot, continuously, often at one frequency'],
          ['What stops it', 'Mass, airtightness, cavities', 'Softness at the point of impact; floating layers', 'Springs under the machine; flexible connections'],
          ['Rated by', 'R<sub>w</sub>, D<sub>nT,w</sub>, STC — higher is better', 'L<sub>n,w</sub>, L′<sub>nT,w</sub> — lower is better (IIC — higher)', 'Vibration level; resulting noise criterion'],
        ])}
        <div class="callout mentor"><b>The key fact:</b> a 200 mm concrete floor is a superb barrier to voices (R<sub>w</sub> ≈ 57 dB) and a terrible one to a high heel. Mass does almost nothing for impact — a hard heavy floor carries a blow beautifully. Impact sound is cured by <b>softness and separation</b>, not weight.</div>` },
      { h: 'How solids carry sound', html: `
        <p>In air there is only one kind of sound wave: compression. A solid can also resist being sheared and bent, so it supports several kinds of wave at once, and energy converts from one to another at every junction.</p>
        ${SVG_WAVETYPES}
        <p><b>Longitudinal</b> and <b>shear</b> waves move the material <i>along</i> the plane of a wall or slab. They are extremely fast and carry energy over long distances, but they hardly move the surface in and out, so they radiate little sound directly. <b>Bending waves</b> are the ones that matter for noise: the plate ripples, its surface pumps the air, and you hear it.</p>
        <p>Bending waves have a peculiar property: they are <b>dispersive</b>. Their speed is not fixed — it rises with the square root of frequency. Low notes ripple along a plate slowly, high notes quickly.</p>
        <div class="formula"><span class="lbl">Bending-wave speed</span> c<sub>B</sub> = √(2πf) · (B / m′)<sup>¼</sup> &nbsp;·&nbsp; B = bending stiffness, m′ = mass per m²</div>
        <p>Because the speed depends on frequency, there is always one frequency at which the ripple in the plate travels at exactly the speed of sound in air. That is the <b>critical frequency</b>, and it divides the plate’s behaviour in two.</p>
        <div class="callout physics"><b>Why a building “telegraphs”.</b> Losses inside concrete, steel and masonry are tiny — a few percent per cycle. Once vibration is in a rigid frame it can travel several storeys with little decay, radiating from every surface on the way. This is why a pump in the basement can be heard on the fifth floor, and why isolation must happen at the source.</div>` },
      { h: 'Coincidence and radiation: when a plate becomes a loudspeaker', html: `
        <p><b>Below</b> the critical frequency the ripples in the plate are shorter than the wavelength in air. Each bump pushing out sits next to a hollow pulling in; the air simply sloshes sideways from one to the other and little sound escapes. Engineers call this an acoustic short-circuit. Only the edges and fixings, where the cancellation is incomplete, radiate.</p>
        <p><b>Above</b> the critical frequency the ripples are longer than the air wavelength and the cancellation fails. The plate launches a strong plane wave at an angle, with an efficiency near 100 %. <b>At</b> the critical frequency the match is perfect and radiation — and transmission of airborne sound through the plate — peaks: the well-known coincidence dip.</p>
        ${tbl(['Plate', 'Approx. critical frequency', 'Consequence'], [
          ['12.5 mm plasterboard', '2.5–3 kHz', 'Dip near the top of the speech range; hidden by using two different thicknesses or damping'],
          ['6 mm glass', '≈ 2 kHz', 'Sibilance and traffic hiss leak through single glazing; laminated glass damps it'],
          ['18 mm plywood / chipboard', '≈ 1–1.5 kHz', 'Light timber floors and enclosures are weak in the mid-range'],
          ['1 mm steel sheet', '≈ 12 kHz', 'Limp: follows the mass law — but rings like a bell unless damped'],
          ['100 mm concrete / brick', '≈ 180–250 Hz', 'Radiates efficiently over almost the whole audio band'],
          ['200 mm concrete', '≈ 90 Hz', 'Any vibration in the slab is heard'],
        ])}
        <div class="callout warn"><b>Stiffening is not soundproofing.</b> Adding ribs or thickness to “stop a panel vibrating” lowers its critical frequency, often into the worst part of the spectrum. To quieten a panel add <b>damping</b> (constrained-layer compound, laminated boards) or <b>mass</b>, or break the path that feeds it.</div>`, viz: 'bendingWaves' },
      { h: 'Impact sources: what a floor has to cope with', html: `
        <p>Every impact is a short force pulse. Its spectrum depends on how long the contact lasts: a hard, light hammer on concrete touches for a fraction of a millisecond and excites everything up to several kilohertz — a sharp “tick”. A bare heel, a jumping child or a dropped medicine ball stays in contact for tens of milliseconds and puts its energy below 100 Hz — a “thud”.</p>
        ${tbl(['Source', 'Character', 'Main frequency range', 'Best defence'], [
          ['Hard-heeled shoes, dropped cutlery, chair legs', 'Sharp click or scrape', '250 Hz – 4 kHz', 'Any soft surface: carpet, vinyl with foam back, felt pads'],
          ['Barefoot walking, children running', 'Thud', '20–100 Hz', 'Mass + floating floor with low resonance; resilient ceiling'],
          ['Doors slamming, cupboards, switches', 'Bang into the walls', 'Broad', 'Soft closers and buffers; isolate fitted furniture from party walls'],
          ['Washing machines, pumps, fans, lifts', 'Hum or drone at running speed', 'Running speed and harmonics', 'Spring or rubber mounts sized for the speed'],
          ['Plumbing and waste pipes', 'Rush, knock, gurgle', 'Broad + water hammer', 'Resilient pipe clips, lagging, boxed-in with dense board'],
          ['Gym weights, dance, drum kits', 'Heavy thump', '10–80 Hz', 'Thick resilient tiles on a sprung platform; ground floor if possible'],
          ['Subwoofers and guitar cabinets on the floor', 'Bass in the structure', '30–150 Hz', 'Decoupling platform; keep off suspended timber floors'],
        ])}
        <div class="callout mentor"><b>Listen to the complaint.</b> “I hear every footstep as a click” and “it sounds like someone is bowling upstairs” are two different problems. The first is solved in an afternoon with underlay. The second needs construction.</div>` },
      { h: 'Measuring and rating impact sound', html: `
        <p>Because real footsteps vary, laboratories use a standard source: the <b>tapping machine</b>, five small steel hammers dropping in turn ten times a second. It is placed on the floor under test, and the sound pressure level is measured in the room below in third-octave bands.</p>
        ${SVG_TAP}
        <p>The raw level depends on how reverberant the receiving room is, so it is corrected to a standard amount of absorption (giving the <b>normalised</b> level L<sub>n</sub>) or a standard reverberation time of 0.5 s (the <b>standardised</b> level L<sub>nT</sub>). A prime mark (L′) means a field measurement, which includes flanking paths. A reference curve is then slid over the measured spectrum to produce one number.</p>
        ${tbl(['Quantity', 'Where', 'Better is…', 'Notes'], [
          ['L<sub>n,w</sub>', 'Laboratory', 'Lower', 'Floor alone, no flanking (ISO 10140 for the test, ISO 717-2 for the rating — check current editions)'],
          ['L′<sub>n,w</sub>, L′<sub>nT,w</sub>', 'In the building', 'Lower', 'What the occupant gets (ISO 16283-2 for field tests)'],
          ['C<sub>I</sub>', 'Spectrum adaptation term', '—', 'Added to make the rating follow walking noise better, especially on timber floors'],
          ['ΔL<sub>w</sub>', 'Laboratory', 'Higher', 'Improvement a floor covering gives on a standard heavy slab'],
          ['IIC / AIIC', 'North America', 'Higher', 'Roughly IIC ≈ 110 − L<sub>n,w</sub>'],
        ])}
        <div class="callout warn"><b>What the rating misses.</b> The hammer is light and hard; the rating curve starts at 100 Hz. Real footsteps on light floors put their energy at 30–80 Hz. A timber floor with carpet can score well and still be hated. For such floors, tests with a <b>heavy soft source</b> (a dropped rubber ball) and ratings extended down to 50 Hz tell the truth.</div>` },
      { h: 'Concrete floors, coverings and floating floors', html: `
        <p>A bare concrete slab is a consistent starting point: the heavier it is, the lower the impact level, but only slowly — roughly L<sub>n,w</sub> ≈ 164 − 35·log<sub>10</sub>(m′). A 150 mm slab gives about 75 dB; doubling to 300 mm buys only 10 dB. Nobody solves impact sound with concrete alone.</p>
        <p>The cure is to put a <b>spring</b> between the blow and the slab. A soft covering acts as a spring under the hammer. A <b>floating floor</b> — a slab of screed or a timber deck resting on a resilient layer — is a spring under the whole walking surface, and works for heavy impacts too.</p>
        <div class="formula"><span class="lbl">Floating-floor resonance</span> f<sub>0</sub> = 160 · √( s′ / m′ ) Hz &nbsp;·&nbsp; s′ = dynamic stiffness of the layer (MN/m³), m′ = mass of the floating slab (kg/m²)</div>
        <div class="formula"><span class="lbl">Improvement above resonance</span> ΔL ≈ 30 · log<sub>10</sub>( f / f<sub>0</sub> ) dB (screeds) &nbsp;·&nbsp; about 40·log for lightly damped dry decks at their best, less in practice</div>
        <div class="callout example"><b>Worked example.</b> A 50 mm sand–cement screed (m′ ≈ 100 kg/m²) on 25 mm mineral-wool impact board with s′ = 10 MN/m³: f<sub>0</sub> = 160·√(10/100) ≈ <b>50 Hz</b>. At 500 Hz the improvement is about 30·log(10) = 30 dB. On a 150 mm slab that takes L<sub>n,w</sub> from about 75 to the mid-40s — a very good floor. Swap in a stiff 5 mm foam (s′ = 60): f<sub>0</sub> ≈ 124 Hz and you lose 12 dB of that.</div>
        ${SVG_FLOAT}
        <p>Typical single-number improvements on concrete: thin vinyl 3–8 dB; cushioned vinyl or cork 15–20 dB; carpet on thick underlay 25–35 dB; a well-built floating screed 25–35 dB; a timber deck on resilient battens 15–25 dB. Design tools for build-ups are on the <a href="#/floors">Floors page</a> and in <a href="#/academy/m-floors">the Master Class floor lesson</a>.</p>`, viz: 'impactFloor' },
      { h: 'Lightweight timber floors: the thud problem', html: `
        <p>A joisted timber floor has perhaps a tenth of the mass of a concrete one, a fundamental resonance of the whole floor somewhere around 10–25 Hz, and a hollow cavity that acts as a drum. Footsteps excite exactly that region. Soft coverings help the click and do nothing for the boom.</p>
        <p>What works, in order of value:</p>
        <ol><li><b>Decouple the ceiling.</b> Hang the plasterboard on resilient bars or, better, spring hangers, so the joists cannot drive it directly. Use two layers of dense board. This is the single most effective measure.</li>
        <li><b>Fill the cavity</b> with 100 mm or more of mineral wool to damp the cavity resonance (it must not be packed tight).</li>
        <li><b>Add mass on top</b>: dense boards, dry sand or gravel pugging between battens, or a thin screed on a separating layer — 50–100 kg/m² changes the character of the floor.</li>
        <li><b>Float the walking surface</b> on a resilient layer or battens with resilient strips.</li>
        <li><b>Stiffen the joists</b> (deeper sections, blocking) to raise the floor’s resonance above the range where walking has most energy and to reduce the “bounce” people feel.</li></ol>
        <div class="callout mentor"><b>For a studio on a timber floor:</b> do not put drums, bass amps or subwoofers directly on it. A platform alone will not save a light floor. Either move the loud room to the ground slab, or accept a properly engineered floating floor with mass (see <a href="#/academy/m-stands-desk">Stands, Desks and Risers</a>).</div>
        ${myth([['“We’ll put down thick carpet — that fixes footsteps.”', 'It fixes heels and dropped objects. Barefoot thuds on a timber floor are untouched, because their energy lies below where carpet works.'], ['“The floor has a good rating, so the complaint is unreasonable.”', 'The standard rating starts at 100 Hz. Ask for a low-frequency or heavy-impact assessment before blaming the tenant.']])}` },
      { h: 'Flanking, stairs and plumbing', html: `
        <p>Impact energy does not only go straight down. It runs along the slab into every wall it touches and radiates from those walls into rooms below, beside and even above. In a rigid masonry or concrete building this <b>flanking</b> can limit a floor to an L′<sub>nT,w</sub> around 50–55 dB however good the ceiling below is — one more reason to treat the walking surface, not the room underneath.</p>
        <ul><li><b>Stairs</b> are impact sources bolted to party walls. Support flights on resilient bearings, leave a gap to the wall, and use soft treads or nosings.</li>
        <li><b>Pipes</b> carry pump vibration and water noise through every clip. Use rubber-lined clips, never clamp a pipe hard between two structures, sleeve all penetrations, and wrap waste stacks in a dense barrier with a soft layer underneath before boxing in.</li>
        <li><b>Fitted furniture and kitchens</b> on a party wall turn every cupboard door into a drum-stick. Soft-close hardware and a resilient pad behind the carcass are cheap.</li>
        <li><b>Lightweight partitions built on a floating floor</b> must not bridge it: either build the wall off the structural slab and float the floor between walls, or float the floor first and accept that the wall rides on it (never both fixed).</li></ul>
        <div class="callout warn"><b>The order of work matters.</b> In a box-in-box studio the floating floor goes in before the inner walls that stand on it; in ordinary housing the walls go in first and the floor floats between them with an edge strip. Mixing the two approaches in one room creates a bridge.</div>` },
      { h: 'Machines: mounts that isolate and mounts that amplify', html: `
        <p>A machine on springs is a mass on a spring with its own natural frequency. Shake it far above that frequency and the mass cannot follow, so little force reaches the floor. Shake it <i>at</i> that frequency and the motion — and the force into the building — is amplified. The whole art is to get the running speed well above the mount’s natural frequency.</p>
        <div class="formula"><span class="lbl">Natural frequency from static deflection</span> f<sub>n</sub> ≈ 15.8 / √d &nbsp;·&nbsp; d = how far the mounts compress under the machine’s weight, in mm</div>
        ${tbl(['Static deflection', 'Natural frequency', 'Isolates above (ratio 3)', 'Typical mount'], [
          ['1 mm', '≈ 16 Hz', '≈ 47 Hz (2 800 rpm)', 'Ribbed rubber or cork pad'],
          ['5 mm', '≈ 7 Hz', '≈ 21 Hz (1 270 rpm)', 'Rubber-in-shear mount'],
          ['12 mm', '≈ 4.6 Hz', '≈ 14 Hz (820 rpm)', 'Deep elastomer or small spring'],
          ['25 mm', '≈ 3.2 Hz', '≈ 9.5 Hz (570 rpm)', 'Steel spring'],
          ['50 mm', '≈ 2.2 Hz', '≈ 6.7 Hz (400 rpm)', 'Long-travel steel spring'],
        ])}
        <p>A ratio of running to natural frequency of 3 gives about 88 % isolation; 4–5 gives 94–96 %, which is the usual target above occupied or recording spaces. Below a ratio of 1.4 the “isolators” make things worse.</p>
        <div class="callout safety"><b>Do not bridge the mounts.</b> Rigid conduit, an un-looped cable, a pipe without a flexible connector or a shipping bolt left in place carries the vibration straight around the springs. After installation every isolated machine should rock freely when pushed by hand.</div>`, viz: 'machineIsolation' },
      { h: 'Drums, amplifiers and subwoofers on floors', html: `
        <p>Musical sources combine all three paths. A kick drum and a floor tom deliver impacts through their legs and spurs; a bass cabinet shakes its own enclosure, which shakes the floor; and all of them radiate airborne bass that drives the floor as well.</p>
        <ul><li>A <b>drum riser</b> works only if it is a real mass–spring system: a heavy, stiff platform (two or three layers of dense board, or a concrete paver sandwich, 40 kg/m² or more) on soft isolators chosen so the loaded resonance is below about 10–12 Hz. A sheet of plywood on carpet tiles or foam blocks resonates around 30–60 Hz — in the middle of the kick drum — and can make the problem worse.</li>
        <li><b>Amplifier and subwoofer platforms</b>: the same rule. The lighter the cabinet, the softer the isolator must be; many commercial foam pads are too stiff for anything under 30 kg. Check the deflection under load: you want several millimetres.</li>
        <li><b>Airborne bass still gets through.</b> Decoupling removes the structure-borne share — often 5–10 dB in the room below — but if the floor is light, the pressure in the room drives it directly. Level control or a floated room is the only complete answer.</li></ul>
        <p>Build-ups and calculators for risers are in <a href="#/academy/m-stands-desk">Stands, Desks and Risers</a> and on the <a href="#/floors">Floors page</a>.</p>
        <div class="callout example"><b>Quick check of any “isolation” product:</b> put the real load on it and measure how much it squashes. 1 mm → 16 Hz natural frequency: useless below about 50 Hz. 6 mm → 6.5 Hz: starts isolating around 15–20 Hz. If it does not visibly compress, it is not isolating bass.</div>` },
      { h: 'Criteria, diagnosis, use cases and rules of thumb', html: `
        ${tbl(['Situation', 'Typical target (field, L′<sub>nT,w</sub>)', 'Comment'], [
          ['Ordinary flats (many national codes)', '≤ 53–62 dB', 'Minimum legal standards — audible footsteps are still likely near the limit'],
          ['Good-quality flats, hotels', '≤ 45–50 dB', 'Footsteps faint'],
          ['Above bedrooms in premium housing, classrooms', '≤ 40–45 dB', 'Needs a floating floor and usually a resilient ceiling'],
          ['Above recording or mixing rooms', 'Set by the noise criterion (NC 15–20) for real sources', 'Rate with real walking and heavy-impact tests, including below 100 Hz'],
        ])}
        <h4>Diagnosing a complaint</h4>
        ${flow([['Listen', 'click, thud, hum or rush? when?'], ['Find the source', 'someone walks, runs taps, starts machines while you listen below'], ['Tap test', 'knock on floor, walls and pipes above; note which is loudest below'], ['Feel and measure', 'hand, stethoscope, or a phone accelerometer app on walls and ceiling'], ['Name the path', 'direct through the floor, flanking down a wall, or along a pipe'], ['Treat the source side', 'softness or springs first; ceilings last']])}
        <div class="uc-grid">
        ${uc('👠', 'Heels on a tiled concrete floor', [['Problem', 'Sharp clicks in the flat below'], ['Why', 'Hard tile bonded to a hard slab: nothing softens the blow'], ['Fix', 'Tiles on a thin resilient mat (ΔL<sub>w</sub> 15–20 dB) with soft perimeter joints; rugs meanwhile']], C3)}
        ${uc('🧒', 'Children running on a timber floor', [['Problem', 'Booming thuds; the floor has carpet already'], ['Why', 'Energy at 20–60 Hz; light floor and directly fixed ceiling'], ['Fix', 'Ceiling on spring hangers with two dense boards and wool in the void; mass added to the deck above if access allows']], C5)}
        ${uc('🌀', 'Washing machine on an upper floor', [['Problem', 'Whole flat hums on spin cycle'], ['Why', 'Spin at 1 200 rpm = 20 Hz, near the floor’s own resonance'], ['Solution', 'Move it to a stiff location (over a wall); heavy plinth on soft mounts with 6 mm+ deflection; flexible hoses']], C2)}
        ${uc('🏋️', 'Gym above offices', [['Problem', 'Dropped weights heard and felt two floors away'], ['Why', 'Huge low-frequency force pulses into a concrete frame'], ['Design', 'Thick rubber tiles on a sprung, heavy floating floor; lifting platforms; ideally on the ground slab']], C4)}
        ${uc('🥁', 'Rehearsal room on a first floor', [['Problem', 'Kick drum audible in the shop below'], ['Why', 'Riser of plywood on foam resonates at 40 Hz'], ['Fix', 'Heavy riser on properly loaded isolators (below 12 Hz); decoupled amp platforms; reduce airborne bass or relocate']], C1)}
        ${uc('🚿', 'Pump and pipework beside a vocal booth', [['Problem', 'Faint drone on quiet recordings'], ['Why', 'Pump isolated, but the pipes are clipped rigidly to the booth wall'], ['Fix', 'Flexible connectors at the pump, resilient clips, pipes re-routed off the studio structure']], C6)}
        </div>
        <h4>Rules of thumb</h4>
        <ul><li>Airborne sound: add mass. Impact sound: add softness and separation.</li>
        <li>Floating-floor resonance below 50 Hz for housing, below 10–15 Hz for studios.</li>
        <li>Machine running speed at least 3 ×, preferably 5 ×, the mount’s natural frequency.</li>
        <li>Deflection tells all: 1 mm ≈ 16 Hz, 6 mm ≈ 6.5 Hz, 25 mm ≈ 3 Hz.</li>
        <li>One rigid bridge can undo the whole system — inspect before closing up.</li>
        <li>Treat where the energy goes in. A ceiling below is a last resort and is limited by flanking.</li></ul>
        <div class="callout example"><b>Apply it.</b> Ask someone to walk normally, then barefoot heel-first, across the floor above your quietest room while you listen below. Note click versus thud. Then knock on the walls of the room above. If the wall knock is as loud below as the floor knock, flanking is your limit and only work on the source side will help.</div>` },
    ],
    quiz: [
      { q: 'A 200 mm concrete floor isolates voices very well but footsteps poorly. Why?', opts: ['Concrete absorbs high frequencies only', 'An impact puts force directly into the solid, and a hard heavy floor transmits it efficiently', 'Footsteps are louder than voices', 'Concrete has no critical frequency'], a: 1, why: 'Mass resists airborne pressure, but a blow is a solid-to-solid force input. Softness or a floating layer is needed, not more weight.' },
      { q: 'For impact sound ratings such as L<sub>n,w</sub>, which is better?', opts: ['A higher number', 'A lower number', 'It depends on room size', 'Any number above 60'], a: 1, why: 'The rating is the level produced below by a standard hammer machine, so lower means quieter. (The North American IIC runs the other way.)' },
      { q: 'A floating screed has a resonance of 120 Hz. What should be changed to improve footstep isolation?', opts: ['Use a stiffer resilient layer', 'Make the screed thinner', 'Use a softer resilient layer and/or a heavier screed to lower the resonance', 'Bond the screed to the slab at the edges'], a: 2, why: 'f₀ = 160·√(s′/m′). Isolation only begins above f₀, so lower stiffness or more mass moves it below the footstep range. Rigid edges would bridge the floor.' },
      { q: 'Why can a carpeted timber floor have a good impact rating and still cause complaints?', opts: ['The rating ignores energy below 100 Hz, where barefoot thuds lie', 'Carpet increases airborne sound', 'Timber has no bending waves', 'Ratings are only valid for concrete'], a: 0, why: 'The standard hammer and rating curve emphasise mid and high frequencies. Heavy, soft impacts on light floors excite 20–80 Hz.' },
      { q: 'A fan runs at 600 rpm on pads that deflect 1 mm. What happens?', opts: ['Excellent isolation', 'About 50 % isolation', 'The mounts amplify the vibration', 'Nothing — pads have no natural frequency'], a: 2, why: '600 rpm = 10 Hz; 1 mm deflection gives about 16 Hz. The fan runs below the mount resonance (ratio < 1.4), so transmitted force is equal to or greater than with rigid fixing.' },
    ],
  });

  /* =====================================================================
     SVGs — special absorbers
     ===================================================================== */
  const SVG_FAMILY = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Families of special absorbers">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Beyond foam and mineral wool: who absorbs what</text>
    <line x1="60" y1="196" x2="650" y2="196" stroke="var(--text)" stroke-width="1.5"/>
    ${[['31', 60], ['63', 144], ['125', 228], ['250', 312], ['500', 396], ['1k', 480], ['2k', 564], ['4k', 648]].map(([l, x]) => `<line x1="${x}" y1="192" x2="${x}" y2="200" stroke="var(--text)"/><text x="${x}" y="214" text-anchor="middle" font-size="10" fill="var(--muted)">${l}</text>`).join('')}
    <text x="355" y="228" text-anchor="middle" font-size="10" fill="var(--muted)">frequency (Hz)</text>
    ${[['Active bass trap', 60, 190, 34, 'bad'], ['Plate / membrane', 110, 260, 56, 'c5'], ['Coiled “meta” panel (narrow!)', 150, 250, 78, 'c3'], ['Micro-perforated panel', 250, 560, 100, 'accent2'], ['Audience and upholstered seats', 228, 648, 122, 'accent'], ['Curtains (spaced, gathered)', 312, 648, 144, 'c4'], ['Carpet', 440, 648, 166, 'warn']].map(([l, a, b, y, c]) => `<rect x="${a}" y="${y}" width="${b - a}" height="14" rx="6" fill="var(--${c})" opacity=".8"/><text x="${b > 560 ? a - 6 : b + 6}" y="${y + 11}" text-anchor="${b > 560 ? 'end' : 'start'}" font-size="10">${l}</text>`).join('')}
    <circle class="hot" cx="200" cy="85" r="5" fill="var(--c3)"/>
  </svg>`;

  const SVG_SEATDIP = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Seat-dip effect">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The seat-dip: why bass can go missing in the stalls</text>
    <rect x="20" y="168" width="430" height="6" fill="var(--muted)"/>
    <circle cx="40" cy="120" r="8" fill="var(--accent)"/><text x="40" y="190" text-anchor="middle" font-size="10">stage</text>
    ${Array.from({ length: 9 }, (_, i) => `<g><rect x="${110 + i * 36}" y="140" width="6" height="28" fill="var(--c5)"/><rect x="${110 + i * 36}" y="158" width="20" height="5" fill="var(--c5)"/><circle cx="${124 + i * 36}" cy="136" r="7" fill="var(--text)" opacity=".7"/></g>`).join('')}
    <path class="leak-pulse" d="M48 120 L430 128" stroke="var(--bad)" stroke-width="2.2" fill="none"/><text x="250" y="112" text-anchor="middle" font-size="10" fill="var(--bad)">sound skimming the heads at a shallow angle</text>
    <path d="M48 116 L250 40 L430 122" stroke="var(--good)" stroke-width="2" fill="none" stroke-dasharray="6 4"/><text x="250" y="34" text-anchor="middle" font-size="10" fill="var(--good)">ceiling reflection arrives from above — unaffected</text>
    <text x="235" y="206" text-anchor="middle" font-size="10" fill="var(--muted)">the gaps between rows act like a row of resonators a quarter-wave deep</text>
    <g transform="translate(470 40)"><rect x="0" y="0" width="190" height="130" rx="8" fill="var(--panel2)" stroke="var(--line)"/>
      <polyline fill="none" stroke="var(--bad)" stroke-width="2.4" points="10,40 40,42 62,60 78,104 92,70 110,46 140,40 180,38"/>
      <line x1="10" y1="40" x2="180" y2="40" stroke="var(--muted)" stroke-dasharray="3 3"/>
      <text x="78" y="122" text-anchor="middle" font-size="10" fill="var(--bad)">−10 to −20 dB</text><text x="95" y="18" text-anchor="middle" font-size="10">direct sound at the listener</text>
      <text x="20" y="146" font-size="9" fill="var(--muted)">63</text><text x="72" y="146" font-size="9" fill="var(--muted)">150</text><text x="160" y="146" font-size="9" fill="var(--muted)">1k Hz</text></g>
  </svg>`;

  const SVG_MPP = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Micro-perforated panel absorber">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Micro-perforated panel: the holes themselves are the absorber</text>
    <rect x="600" y="36" width="14" height="150" fill="var(--text)"/><text x="607" y="204" text-anchor="middle" font-size="10">wall</text>
    <rect x="420" y="36" width="5" height="150" fill="var(--accent2)"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="419" y="${44 + i * 12}" width="7" height="3" fill="var(--bg, #fff)"/>`).join('')}
    <text x="422" y="204" text-anchor="middle" font-size="10" fill="var(--accent2)">thin sheet</text>
    <line x1="428" y1="112" x2="598" y2="112" stroke="var(--muted)" stroke-dasharray="4 4"/><text x="512" y="106" text-anchor="middle" font-size="10" fill="var(--muted)">air cavity 30–100 mm, empty</text>
    ${[0, 1, 2].map((i) => `<path class="wave-in" d="M${250 + i * 50} 70 q 12 -12 24 0 q 12 12 24 0" fill="none" stroke="var(--accent)" stroke-width="2" opacity="${1 - i * 0.25}"/>`).join('')}
    <g transform="translate(40 50)"><rect x="0" y="0" width="170" height="120" rx="8" fill="var(--panel2)" stroke="var(--accent2)"/>
      <text x="85" y="16" text-anchor="middle" font-size="10" font-weight="700">one hole, magnified</text>
      <rect x="20" y="30" width="130" height="26" fill="var(--accent2)" opacity=".7"/><rect x="20" y="78" width="130" height="26" fill="var(--accent2)" opacity=".7"/>
      <path class="leak-pulse" d="M30 67 h110" stroke="var(--accent)" stroke-width="3"/><path d="M30 59 h110 M30 75 h110" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="2 3"/>
      <text x="85" y="116" text-anchor="middle" font-size="9" fill="var(--bad)">sticky boundary layer fills the hole</text></g>
    <text x="315" y="140" text-anchor="middle" font-size="10">holes 0.1–1 mm</text><text x="315" y="154" text-anchor="middle" font-size="10">open area ≈ 0.5–2 %</text>
    <text x="315" y="172" text-anchor="middle" font-size="10" fill="var(--muted)">clear plastic, metal, timber</text><text x="315" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">or film — no fibres</text>
  </svg>`;

  const SVG_BAFFLE = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Hanging baffles, rafts and edge absorbers">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Absorbers hung in space work on every face</text>
    <rect x="20" y="30" width="640" height="150" fill="none" stroke="var(--text)" stroke-width="2"/>
    ${[0, 1, 2, 3, 4].map((i) => `<g><line x1="${90 + i * 46}" y1="30" x2="${90 + i * 46}" y2="48" stroke="var(--muted)"/><rect x="${86 + i * 46}" y="48" width="8" height="50" rx="2" fill="var(--c4)" opacity=".85"/></g>`).join('')}
    <text x="182" y="116" text-anchor="middle" font-size="10">vertical baffles</text><text x="182" y="130" text-anchor="middle" font-size="10" fill="var(--muted)">both sides + edges exposed</text>
    <line x1="360" y1="30" x2="360" y2="60" stroke="var(--muted)"/><line x1="460" y1="30" x2="460" y2="60" stroke="var(--muted)"/><rect x="340" y="60" width="140" height="10" rx="2" fill="var(--c4)" opacity=".85"/>
    <path class="leak-pulse" d="M380 150 L410 72 M440 150 Q 500 40 420 58" fill="none" stroke="var(--accent)" stroke-width="1.8"/>
    <text x="410" y="96" text-anchor="middle" font-size="10">horizontal raft (“cloud”)</text><text x="410" y="110" text-anchor="middle" font-size="10" fill="var(--muted)">top face catches the ceiling bounce</text>
    <path d="M660 30 L590 30 L660 100 Z" fill="var(--c5)" opacity=".75"/><path d="M660 180 L600 180 L660 120 Z" fill="var(--c5)" opacity=".75"/>
    <text x="590" y="140" text-anchor="end" font-size="10">edge and corner absorbers</text><text x="590" y="154" text-anchor="end" font-size="10" fill="var(--muted)">where bass pressure is highest</text>
    <text x="340" y="200" text-anchor="middle" font-size="10" fill="var(--muted)">A free-hanging panel can absorb 1.2–1.5 times its own face area — its “coefficient” appears to exceed 1.</text>
  </svg>`;

  const SVG_ACTIVE = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Active absorber loop">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">An active absorber: a loudspeaker told to behave like a soft wall</text>
    <rect x="30" y="40" width="300" height="130" fill="none" stroke="var(--text)" stroke-width="2"/>
    <path class="leak-pulse" d="M30 105 q 75 -70 150 0 t 150 0" fill="none" stroke="var(--accent)" stroke-width="2.4"/><text x="110" y="58" text-anchor="middle" font-size="10" fill="var(--accent)">room mode (pressure)</text>
    <rect x="300" y="84" width="26" height="44" fill="var(--text)"/><path class="door-press" d="M300 92 l-16 -10 v46 l16 -10 z" fill="var(--good)"/>
    <circle cx="270" cy="70" r="5" fill="var(--bad)"/><text x="262" y="66" text-anchor="end" font-size="10" fill="var(--bad)">microphone</text>
    <path d="M274 68 C 420 30 470 60 470 80" fill="none" stroke="var(--bad)" stroke-width="1.6" marker-end="none"/>
    <rect x="410" y="80" width="120" height="50" rx="8" fill="var(--panel2)" stroke="var(--c3)"/><text x="470" y="102" text-anchor="middle" font-size="11" font-weight="700">controller</text><text x="470" y="118" text-anchor="middle" font-size="9" fill="var(--muted)">filter · gain · limiter</text>
    <path d="M410 112 H 330" fill="none" stroke="var(--good)" stroke-width="2"/><text x="372" y="146" text-anchor="middle" font-size="10" fill="var(--good)">drive signal</text>
    <text x="555" y="70" font-size="10">works: 20–120 Hz</text><text x="555" y="86" font-size="10">needs: a pressure zone</text><text x="555" y="102" font-size="10" fill="var(--bad)">risk: feedback, hiss,</text><text x="555" y="116" font-size="10" fill="var(--bad)">limited output</text>
    <text x="180" y="188" text-anchor="middle" font-size="10" fill="var(--muted)">the cone yields to pressure and removes energy from the mode</text>
  </svg>`;

  /* =====================================================================
     SVGs — modelling
     ===================================================================== */
  const SVG_PIPE = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="What goes into and comes out of a room model">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A room model: four inputs, one impulse response, many answers</text>
    ${[['Geometry', 'simplified 3-D shape', 34], ['Materials', 'absorption + scattering', 74], ['Sources', 'power + directivity', 114], ['Receivers', 'seats, mic positions', 154]].map(([t, s, y]) => `<g><rect x="20" y="${y}" width="170" height="32" rx="8" fill="var(--panel2)" stroke="var(--accent2)"/><text x="105" y="${y + 14}" text-anchor="middle" font-size="11" font-weight="700">${t}</text><text x="105" y="${y + 26}" text-anchor="middle" font-size="9" fill="var(--muted)">${s}</text><path class="leak-pulse" d="M190 ${y + 16} L250 110" stroke="var(--accent2)" stroke-width="1.6" fill="none"/></g>`).join('')}
    <rect x="250" y="76" width="130" height="68" rx="10" fill="var(--accent)" opacity=".9"/><text x="315" y="104" text-anchor="middle" font-size="12" font-weight="800" fill="var(--accent-ink, #111)">Solver</text><text x="315" y="122" text-anchor="middle" font-size="9" fill="var(--accent-ink, #111)">images · rays · waves</text>
    <path d="M380 110 H 430" stroke="var(--text)" stroke-width="2"/>
    <rect x="430" y="84" width="90" height="52" rx="8" fill="var(--panel2)" stroke="var(--text)"/><polyline points="438,128 440,92 446,120 452,104 458,124 466,112 474,126 484,118 496,128 512,127" fill="none" stroke="var(--accent)" stroke-width="1.6"/><text x="475" y="150" text-anchor="middle" font-size="9" fill="var(--muted)">impulse response</text>
    ${[['RT, EDT, clarity', 44], ['Level and coverage maps', 84], ['Speech intelligibility', 124], ['Auralisation — listen', 164]].map(([t, y]) => `<g><path d="M520 110 L560 ${y + 12}" stroke="var(--good)" stroke-width="1.4" fill="none"/><rect x="560" y="${y}" width="110" height="24" rx="6" fill="var(--panel2)" stroke="var(--good)"/><text x="615" y="${y + 16}" text-anchor="middle" font-size="9">${t}</text></g>`).join('')}
  </svg>`;

  const SVG_REGIONS = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Which method for which frequency range">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">No single method covers the whole spectrum</text>
    <line x1="40" y1="150" x2="650" y2="150" stroke="var(--text)" stroke-width="1.5"/>
    ${[['20', 40], ['50', 130], ['100', 198], ['200', 266], ['500', 356], ['1k', 424], ['2k', 492], ['5k', 582], ['10k', 650]].map(([l, x]) => `<line x1="${x}" y1="146" x2="${x}" y2="154" stroke="var(--text)"/><text x="${x}" y="168" text-anchor="middle" font-size="10" fill="var(--muted)">${l}</text>`).join('')}
    <rect x="40" y="40" width="250" height="34" rx="8" fill="var(--c3)" opacity=".8"/><text x="165" y="61" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">Wave-based: modes, diffraction</text>
    <rect x="250" y="84" width="400" height="34" rx="8" fill="var(--accent)" opacity=".85"/><text x="450" y="105" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent-ink, #111)">Geometric: images + rays</text>
    <rect class="hot" x="250" y="36" width="40" height="86" rx="6" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="270" y="138" text-anchor="middle" font-size="10" fill="var(--bad)">crossover ≈ Schroeder frequency</text>
    <text x="345" y="184" text-anchor="middle" font-size="10" fill="var(--muted)">Small studio: crossover 200–300 Hz — the wave region is most of the problem.</text><text x="345" y="197" text-anchor="middle" font-size="10" fill="var(--muted)">Concert hall: 20–30 Hz — geometric methods do nearly everything.</text>
  </svg>`;

  const SVG_ECHO = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="From echogram to decay">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Reading an echogram: three regions, three jobs</text>
    <line x1="40" y1="170" x2="650" y2="170" stroke="var(--muted)"/><line x1="40" y1="30" x2="40" y2="170" stroke="var(--muted)"/>
    <rect x="52" y="30" width="110" height="140" fill="var(--good)" opacity=".1"/><rect x="162" y="30" width="130" height="140" fill="var(--warn)" opacity=".1"/><rect x="292" y="30" width="358" height="140" fill="var(--c3)" opacity=".08"/>
    <line x1="52" y1="170" x2="52" y2="40" stroke="var(--accent)" stroke-width="4"/>
    ${[[84, 78], [104, 92], [126, 86], [150, 100], [176, 104], [198, 112], [214, 108], [236, 120], [260, 118], [282, 126]].map(([x, y]) => `<line x1="${x}" y1="170" x2="${x}" y2="${y}" stroke="var(--accent2)" stroke-width="2.5"/>`).join('')}
    ${Array.from({ length: 70 }, (_, i) => { const x = 296 + i * 5, y = 128 + i * 0.58 + 6 * Math.sin(i * 2.1); return `<line x1="${x}" y1="170" x2="${x}" y2="${Math.min(168, y)}" stroke="var(--c3)" stroke-width="1.5" opacity=".8"/>`; }).join('')}
    <text x="52" y="34" font-size="10" fill="var(--accent)">direct</text>
    <text x="107" y="56" text-anchor="middle" font-size="10" fill="var(--good)">0–50 ms</text><text x="107" y="68" text-anchor="middle" font-size="9" fill="var(--muted)">clarity, image</text>
    <text x="227" y="56" text-anchor="middle" font-size="10" fill="var(--warn)">50–100 ms</text><text x="227" y="68" text-anchor="middle" font-size="9" fill="var(--muted)">spaciousness or echo</text>
    <text x="470" y="56" text-anchor="middle" font-size="10" fill="var(--c3)">late: thousands of overlapping arrivals</text><text x="470" y="68" text-anchor="middle" font-size="9" fill="var(--muted)">reverberation — only statistics matter</text>
    <path class="leak-pulse" d="M52 44 L650 150" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="6 4" fill="none"/><text x="560" y="124" font-size="10" fill="var(--bad)">decay slope → RT</text>
    <text x="345" y="190" text-anchor="middle" font-size="10" fill="var(--muted)">time after the sound leaves the source →</text>
  </svg>`;

  const SVG_AURAL = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Auralisation chain">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Auralisation: hearing a room that does not exist yet</text>
    <rect x="20" y="60" width="130" height="70" rx="10" fill="var(--panel2)" stroke="var(--accent)"/><text x="85" y="84" text-anchor="middle" font-size="11" font-weight="700">Dry recording</text><text x="85" y="100" text-anchor="middle" font-size="9" fill="var(--muted)">made with no room</text><path d="M40 116 q 8 -10 16 0 t 16 0 t 16 0 t 16 0 t 16 0" fill="none" stroke="var(--accent)" stroke-width="1.6"/>
    <circle cx="200" cy="95" r="18" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><text x="200" y="101" text-anchor="middle" font-size="18" font-weight="800">∗</text><text x="200" y="130" text-anchor="middle" font-size="9" fill="var(--muted)">convolve</text>
    <rect x="135" y="140" width="130" height="40" rx="8" fill="var(--panel2)" stroke="var(--c3)"/><text x="200" y="158" text-anchor="middle" font-size="10" font-weight="700">Modelled impulse response</text><text x="200" y="172" text-anchor="middle" font-size="9" fill="var(--muted)">one per ear, per seat</text>
    <path class="leak-pulse" d="M150 95 H 182 M200 140 V 113 M218 95 H 290" stroke="var(--text)" stroke-width="2" fill="none"/>
    <rect x="290" y="60" width="150" height="70" rx="10" fill="var(--panel2)" stroke="var(--good)"/><text x="365" y="84" text-anchor="middle" font-size="11" font-weight="700">Head-related filters</text><text x="365" y="100" text-anchor="middle" font-size="9" fill="var(--muted)">give each reflection</text><text x="365" y="112" text-anchor="middle" font-size="9" fill="var(--muted)">its direction</text>
    <path d="M440 95 H 500" stroke="var(--text)" stroke-width="2"/>
    <circle cx="560" cy="95" r="26" fill="none" stroke="var(--text)" stroke-width="2"/><rect x="524" y="84" width="10" height="24" rx="4" fill="var(--accent2)"/><rect x="586" y="84" width="10" height="24" rx="4" fill="var(--accent2)"/><path d="M530 84 q 30 -40 60 0" fill="none" stroke="var(--accent2)" stroke-width="3"/>
    <text x="560" y="140" text-anchor="middle" font-size="10">headphones</text><text x="560" y="154" text-anchor="middle" font-size="9" fill="var(--muted)">or a loudspeaker array</text>
    <text x="365" y="40" text-anchor="middle" font-size="10" fill="var(--muted)">Useful for comparing option A with option B — not a guarantee of the finished sound.</text>
  </svg>`;

  /* =====================================================================
     LESSON M18F — Special absorbers
     ===================================================================== */
  after(['m-diffuser-depth', 'm-waveguides', 'm-treat-designs'], {
    id: 'm-special-absorbers', n: 'M18F', track: 'master',
    title: 'Special Absorbers: Audiences and Seats, Micro-perforated, Plate, Metamaterial and Active Systems',
    level: 'Advanced', mins: 34,
    summary: 'The absorbers the catalogue does not start with: the audience itself, upholstered seats, curtains and carpets; fibre-free micro-perforated panels; hanging baffles and edge absorbers; coiled “metamaterial” panels; and loudspeakers that act as absorbers. What each really does, how to size it, and how to read the claims.',
    tags: ['audience absorption', 'seats', 'seat dip', 'curtains', 'micro-perforated', 'MPP', 'baffles', 'metamaterial', 'active absorber', 'active bass trap', 'variable acoustics'],
    sections: [
      { h: 'Beyond foam and wool', html: `
        <p>Porous panels, tuned membranes and slotted resonators cover most studio work. But large rooms, glass buildings, clean rooms, heritage interiors and the bottom octave all pose problems those three cannot solve — because there is no wall to put them on, because fibres are forbidden, because the client wants to see through the absorber, or because a metre of depth is not available.</p>
        ${SVG_FAMILY}
        <p>This lesson walks through the “special” families. Two ideas run through all of them:</p>
        <ul><li><b>Absorption is always friction.</b> Whatever the device looks like, somewhere air is being forced to move against resistance — through cloth, through tiny holes, in a narrow channel, or against a loudspeaker cone that pushes back.</li>
        <li><b>Thin and low-frequency means narrow-band.</b> You can absorb bass in a small depth, or over a wide band, but not both. Every clever panel is a point on that trade-off.</li></ul>
        <div class="callout mentor"><b>Start with what is already in the room.</b> In any space that holds people, the people and what they sit on are usually the largest absorber by far. Design those first; panels fill what is left.</div>` },
      { h: 'People and seats: the biggest absorber in the hall', html: `
        <p>A seated audience is a deep, soft, irregular layer of cloth, hair and air gaps: a first-class broadband absorber, with coefficients around 0.6 at 125 Hz rising to 0.9 and more above 500 Hz. In a concert hall it typically provides <b>half to three-quarters of all the absorption</b> in the room.</p>
        <p>Two practical consequences:</p>
        <ul><li><b>Count area, not heads.</b> Absorption follows the floor area the audience covers (plus a strip of about half a metre around each block, because the exposed edges absorb too). Packing rows closer adds people but hardly adds absorption — one reason densely seated halls stay livelier.</li>
        <li><b>The empty hall is a different hall</b> — unless the seats stand in for the people. A well-upholstered seat, empty, absorbs nearly as much as an occupied one, so rehearsal and performance sound similar and a half-sold house is not a disaster. Hard seats make the room swing wildly with attendance.</li></ul>
        ${tbl(['Seating (per m² of seating area)', '125 Hz', '500 Hz', '2 kHz', 'Behaviour'], [
          ['Hard seats, empty', '0.05', '0.07', '0.08', 'Room is very live when empty'],
          ['Lightly upholstered, empty', '0.35', '0.57', '0.59', 'Moderate change when occupied'],
          ['Heavily upholstered, empty', '0.50', '0.80', '0.82', 'Almost no change when occupied'],
          ['Audience in upholstered seats', '0.62', '0.88', '0.93', 'The reference condition'],
        ])}
        <div class="callout example"><b>Sizing by volume per seat.</b> Because the audience dominates, reverberation time is roughly proportional to the room volume divided by the number of seats: around 4–6 m³ per seat suits speech and cinema, 7–9 m³ opera and multipurpose, 9–12 m³ symphonic music. The ceiling height fixes this on day one.</div>`, viz: 'audienceAbsorption' },
      { h: 'The seat-dip effect', html: `
        <p>Seats do something else that no flat absorber does. Sound travelling from the stage to the stalls skims over row after row at a very shallow angle. The gaps between rows behave like a comb of quarter-wave resonators roughly as deep as the seat backs, and the sound diffracting down into them returns out of phase. The direct sound loses a broad band, typically centred between <b>100 and 200 Hz</b>, by 10–20 dB.</p>
        ${SVG_SEATDIP}
        <p>The dip is in the direct sound only, and only for the first few tens of milliseconds. Listeners perceive it as a lack of bass warmth and weak cellos and basses in the stalls. It cannot be removed by changing seat upholstery. What compensates for it is energy arriving from <b>other directions</b>:</p>
        <ul><li>A steeper floor rake, so sound no longer grazes the heads.</li>
        <li>Strong early reflections from the ceiling, overhead reflectors and side walls, which arrive from above and are not filtered.</li>
        <li>Generous low-frequency reverberation — heavy, rigid walls that do not absorb bass.</li></ul>
        <div class="callout physics"><b>Why it matters to studio people.</b> The same grazing-incidence effect appears over a mixing console, over rows of cinema seats in a dubbing theatre, and across a wide desk surface. Sound that skims a corrugated or cluttered surface is filtered; lift the loudspeakers or tilt the path so it does not graze.</div>` },
      { h: 'Curtains, drapes and carpet', html: `
        <p>A curtain is a thin resistive sheet. It absorbs only where the air is moving through it — and next to a hard wall the air does not move. The first place it moves freely is a quarter-wavelength out. So a curtain’s performance is set less by the fabric than by <b>how far from the wall it hangs</b> and <b>how deeply it is gathered</b>.</p>
        <ul><li><b>Fabric:</b> medium to heavy, unlined, with gentle resistance when you blow through it (0.3–0.6 kg/m² wool serge or cotton velour is the classic). Too open and sound passes through twice untouched; lined or coated and it reflects.</li>
        <li><b>Fullness:</b> 100 % (two metres of cloth per metre of track) is the usual specification. The folds place cloth at many distances at once and roughly double the mid-band absorption.</li>
        <li><b>Spacing:</b> 100–200 mm from the wall extends useful absorption down to about 250–400 Hz. Hard against the wall, only the top octaves are absorbed.</li>
        <li><b>Bass:</b> very little, whatever you do. A room “treated” only with curtains is dull on top and boomy below.</li></ul>
        <p><b>Carpet</b> behaves like a very thin porous absorber: 0.05 at 125 Hz, perhaps 0.3 at 1 kHz and 0.6 at 4 kHz on a thick underlay; much less when glued to concrete. It is valuable for footfall noise and for the floor reflection’s top end, and useless as a general treatment. A fully carpeted room with bare walls is the classic unbalanced room.</p>
        <div class="callout mentor"><b>Variable acoustics for the price of a track.</b> Heavy curtains that can be drawn across reflective walls let one room serve speech and music. Provide a pocket or box for them to retract into — a stacked curtain still exposes half its area.</div>`, viz: 'curtainAbsorber' },
      { h: 'Micro-perforated panels: absorption without fibres', html: `
        <p>Take a thin sheet — metal, acrylic, timber veneer, even a stretched film — and pierce it with holes <b>smaller than a millimetre</b>, covering only about 1 % of the area. Mount it in front of an empty air space. The air in each hole is a tiny mass bouncing on the spring of the cavity, as in any perforated resonator. The difference is that the holes are so narrow that the sticky layer of air clinging to their walls fills them: the hole itself provides the friction, and no porous backing is needed.</p>
        ${SVG_MPP}
        ${tbl(['Design choice', 'Typical range', 'Effect'], [
          ['Hole diameter', '0.1–1 mm (about the sheet thickness)', 'Smaller holes → more resistance → wider, flatter absorption'],
          ['Open area', '0.5–2 %', 'More open area raises the tuned frequency'],
          ['Cavity depth', '30–100 mm (200 mm+ for low tuning)', 'Deeper cavity lowers the tuned frequency'],
          ['Bandwidth', '1–2 octaves at α &gt; 0.5', 'Two layers at different spacings reach 3 octaves'],
          ['Peak absorption', '0.7–0.95', 'Falls away either side — it is still a resonator'],
        ])}
        <p><b>Where it earns its keep:</b> glass atria and meeting rooms (transparent sheets in front of glazing), hospitals, kitchens, pools and clean rooms (wipe-clean, no fibres), heritage ceilings (a stretched micro-perforated film is nearly invisible), and inside ductwork and machinery where wool would shed or soak. The <a href="#/absorbers">Absorber Designer</a> covers conventional perforated panels; the micro-perforated kind follows the same mass-on-a-spring logic with the resistance built in.</p>
        <div class="callout warn"><b>Limits:</b> holes clog with paint and grease — never decorate over them. Performance is mid-band; for bass you need an impractically deep cavity. And prices are high: you are paying for cleanability or transparency, not for more decibels than mineral wool behind a fabric.</div>` },
      { h: 'Plates, absorbing diffusers, baffles and edges', html: `
        <p><b>Plate and membrane resonators — a reminder.</b> A sheet over a sealed cavity resonates at f ≈ 60/√(m′·d) (m′ in kg/m², d in metres) and absorbs around that frequency when the cavity is damped. Heavy steel or dense-board plates bonded to foam push the idea down to 50–100 Hz in 100 mm of depth, and are the standard way to tame the bottom octaves in a control room when corners are full. Detailed design is in <a href="#/absorbers">the designer</a>.</p>
        <p><b>Diffusers that absorb.</b> A well-type diffuser is a set of quarter-wave tubes side by side. Air rushes between neighbouring wells of different depth, and that motion loses energy at the fins. An untreated phase-grating diffuser can absorb 0.3–0.5 in its working band — sometimes welcome, sometimes not. Narrow wells, rough fin edges and gaps increase it; covering the face with cloth turns the diffuser into a rather good absorber and wastes the diffusion.</p>
        ${SVG_BAFFLE}
        <p><b>Absorbers in free space.</b> A panel hung clear of any surface is exposed on both faces and all its edges, and sits where air movement is large. Per square metre of face it absorbs far more than the same panel on a wall — published “coefficients” above 1.0 are real and simply mean the object’s effective area is larger than its face. Rules for hanging baffles: spacing about equal to their depth; rows in two directions if the room has no dominant axis; rafts hung 200–400 mm below the soffit so the upper face works too.</p>
        <p><b>Edges and corners.</b> At low frequencies, pressure is highest where surfaces meet. Triangular or square absorbers along the wall–ceiling junction and in vertical corners treat every axial mode family with comparatively little material, and they are easy to hide behind a cove or a fabric bulkhead.</p>
        <p><b>Planted walls.</b> A living wall is a porous substrate with leaves in front. The substrate behaves like a modest porous absorber (0.4–0.6 at mid and high frequencies when dry, less when saturated); the foliage adds a little scattering above 1 kHz. Pleasant, but size it on the substrate data, not the brochure photograph.</p>` },
      { h: 'Coiled channels and acoustic metamaterials', html: `
        <p>“Metamaterial” simply means a structure whose behaviour comes from its <b>internal geometry</b> rather than the stuff it is made of. Acoustically, three ideas are in practical use:</p>
        <ul><li><b>Coiled or labyrinth channels.</b> A quarter-wave tube absorbs at the frequency whose quarter-wavelength equals its length — 0.86 m for 100 Hz. Fold that tube back and forth inside a panel and the panel can be 50–100 mm thick. Nothing about the physics has changed; only the packaging.</li>
        <li><b>Locally resonant inclusions.</b> Small masses on soft mounts (or membranes carrying small weights) embedded in a panel. Near their resonance they move strongly against the incoming wave and block or absorb it, in a band far below what the panel’s thickness would suggest.</li>
        <li><b>Sonic crystals.</b> Regular arrays of posts or cylinders. Where the spacing equals half a wavelength, scattered waves cancel the transmitted one and a stop-band appears — an “acoustic fence” that lets air and light through. Useful outdoors, in narrow bands.</li></ul>
        <p>All share the same strength — <b>deeply sub-wavelength thickness</b> — and the same weakness: they are resonators, so each element works in a narrow band, and making a panel wide-band means dividing its face among many differently tuned elements, each with a small share of the area. Performance is also sensitive to manufacturing tolerances and to dust and paint in narrow channels.</p>
        <div class="callout mentor"><b>Where they make sense today:</b> a specific, measured, narrow problem (one room mode, a transformer hum, a fan tone) where depth is unavailable. For general broadband treatment, conventional absorbers still win on cost per decibel.</div>`, viz: 'metaAbsorber' },
      { h: 'Active absorbers and active bass traps', html: `
        <p>A passive absorber for 40 Hz wants to be two metres deep. An <b>active</b> absorber replaces depth with electronics: a microphone senses the pressure at a wall, a controller drives a loudspeaker so that its cone moves the way a perfectly absorbing surface would, and the room mode loses energy into the system.</p>
        ${SVG_ACTIVE}
        <p>It is worth separating two different things that both get called “active”:</p>
        ${tbl(['', 'Active absorption / mode damping', 'Active cancellation (“anti-noise”)'], [
          ['Aim', 'Remove energy from a resonance', 'Create an opposite wave at one place'],
          ['Benefit', 'Everywhere the mode is heard', 'A zone about one-tenth of a wavelength across'],
          ['Zone at 50 Hz / 500 Hz', 'Whole room', '≈ 0.7 m / ≈ 7 cm'],
          ['Typical use', 'Bass in small rooms, 20–120 Hz', 'Headphones, ducts, headrests, vehicle cabins'],
          ['Placement', 'In a pressure maximum of the target mode', 'At the listener’s ear'],
        ])}
        <p>Related, simpler approaches use the room’s own loudspeakers: a second subwoofer on the rear wall fed with a delayed, inverted signal absorbs the wave arriving from the front, and multiple subwoofers placed symmetrically avoid exciting certain modes at all. These are covered in the subwoofer and tuning lessons.</p>
        <p><b>Electroacoustic enhancement</b> is the mirror image: instead of removing energy, microphones and many loudspeakers <i>add</i> controlled reflections and reverberation to a room that is naturally dry. A multipurpose hall can be built dead enough for amplified events and cinema, then switched to a longer, concert-like response for orchestras. Done well it is undetectable; it needs a room with low background noise and a naturally short reverberation, careful loudspeaker density, and professional tuning.</p>
        <p>Used for teaching rooms, rehearsal halls and theatres as well, such systems are best thought of as a permanent part of the architecture, not a sound-reinforcement system: they must be specified with the building, maintained, and never used to rescue a room with echoes or noise.</p>`, viz: 'activeTrap' },
      { h: 'Choosing among them — and reading the claims', html: `
        ${tbl(['You need…', 'First choice', 'Why', 'Watch out for'], [
          ['Stable reverberation in a hall', 'Upholstered seating', 'It is already the largest surface', 'Too absorbent caps the RT you can reach'],
          ['Switchable acoustics on a budget', 'Heavy curtains on tracks', 'Cheap, large area, fast', 'No bass effect; storage pocket needed'],
          ['Absorption on glass or in a clean room', 'Micro-perforated sheet or film', 'Transparent, wipeable, no fibres', 'Mid-band only; cost; clogging'],
          ['Absorption with no free wall or ceiling', 'Hanging baffles or rafts', 'Use the room volume', 'Sprinklers, lighting, air flow'],
          ['Control of 40–100 Hz with no depth', 'Plate resonators; active trap', 'Depth-efficient', 'Narrow band; must match a measured problem'],
          ['One stubborn tone or mode', 'Tuned resonator or coiled panel', 'Compact, targeted', 'Tolerance to mistuning'],
          ['Longer reverberation on demand', 'Electroacoustic enhancement', 'Only practical way to add energy', 'Cost, tuning, maintenance'],
        ])}
        ${myth([
          ['“Absorption coefficient 1.3 — this panel absorbs 130 % of the sound!”', 'A test artefact: edges and diffraction make a small or free-hanging sample act larger than its face. Fine for comparing like with like; never multiply it out as if the laws of energy had changed.'],
          ['“30 mm metamaterial panel replaces 300 mm of mineral wool.”', 'At one frequency, possibly. Ask for the full curve in third-octaves from an independent laboratory and look at the bandwidth.'],
          ['“Active bass trap: works at all frequencies.”', 'It works where its loudspeaker has output and its loop is stable — typically 20–120 Hz — and only for modes with high pressure where it stands.'],
          ['“Acoustic curtains block noise from next door.”', 'Curtains absorb reflections inside the room. They add almost nothing to sound insulation unless they are heavy, sealed, limp barriers — a different product.'],
          ['“NRC 0.9, so it will fix the boom.”', 'A single-number rating averages 250 Hz to 2 kHz. It says nothing about 80 Hz.'],
        ])}
        <div class="callout warn"><b>Checklist for any data sheet:</b> which test method and sample size; mounting (on the wall, spaced, free-hanging); results in third-octave bands, not just one number; tested by an independent laboratory; and whether the tested build-up is the one you are buying.</div>` },
      { h: 'Use cases, rules of thumb and practice', html: `
        <div class="uc-grid">
        ${uc('🎻', 'School hall used for orchestra and assemblies', [['Problem', 'Wonderful empty, dead when full — or the reverse'], ['Why', 'Stacking plastic chairs: the audience is the only absorber'], ['Fix', 'Upholstered stacking chairs; drawable curtains along one side wall for speech days']], C1)}
        ${uc('🏢', 'Glass-walled meeting room', [['Problem', 'Harsh, echoey video calls; no wall to treat'], ['Why', 'Parallel glass, hard table, plaster ceiling'], ['Solution', 'Micro-perforated transparent sheets in front of one glass wall; absorbent raft over the table; carpet']], C3)}
        ${uc('🏊', 'Swimming pool hall', [['Problem', 'Whistles and shouting unintelligible; humid, chlorinated air'], ['Why', 'Huge hard volume; fibres and timber degrade'], ['Design', 'Moisture-proof baffles or micro-perforated metal panels at high level; treat at least two adjacent surfaces']], C2)}
        ${uc('🎚️', 'Small control room, 45 Hz mode', [['Problem', 'One note booms and rings for a second; corners already full'], ['Why', 'First length mode; porous traps too shallow'], ['Fix', 'Tuned plate resonators on the rear wall, or an active trap in the rear corner; verify with a decay measurement']], C5)}
        ${uc('🎭', 'Multipurpose theatre', [['Problem', 'Drama wants 1.0 s, the choir wants 1.8 s'], ['Why', 'One fixed volume cannot do both'], ['Design', 'Build for the dry end; add motorised banners for cinema; an enhancement system for unamplified music']], C4)}
        ${uc('🏭', 'Transformer hum at a boundary fence', [['Problem', '100 Hz tone carries to houses'], ['Why', 'Long wavelength: barriers are weak, enclosures overheat'], ['Fix', 'Tuned resonators facing the unit, or a ventilated screen of tuned (sonic-crystal-type) elements designed for 100 and 200 Hz']], C6)}
        </div>
        <h4>Rules of thumb</h4>
        <ul><li>Audience absorption goes by floor area covered, not head count.</li>
        <li>Volume per seat sets the reverberation you can have: 5 m³ speech, 8 m³ opera, 10 m³ symphony.</li>
        <li>Curtains: unlined, 100 % fullness, 100–200 mm off the wall.</li>
        <li>Micro-perforated panels: holes under 1 mm, about 1 % open, 50 mm cavity → mid-band, about two octaves.</li>
        <li>Free-hanging baffles absorb on both faces; space them about as far apart as they are deep.</li>
        <li>Thin + low frequency = narrow band. Always.</li>
        <li>Tuned and active devices go where the pressure of the target mode is highest.</li></ul>
        <div class="callout example"><b>Apply it.</b> Take a room you know that holds an audience — a classroom, a church, a club. Estimate its volume and the floor area covered by seats. Using 0.8 for occupied seating and the empty-seat value from the table, estimate the absorption with and without people, and from RT ≈ 0.161·V/A the change in reverberation. Does that match what you hear at sound-check versus showtime?</div>` },
    ],
    quiz: [
      { q: 'Why do concert halls use upholstered seats?', opts: ['To make the hall as dead as possible', 'So the hall’s reverberation changes little between empty and full', 'To absorb bass below 50 Hz', 'To increase the seat-dip effect'], a: 1, why: 'An empty upholstered seat absorbs nearly as much as an occupied one, so rehearsals and part-sold houses sound like a full concert.' },
      { q: 'What compensates for the seat-dip effect?', opts: ['Thicker seat cushions', 'More absorbent carpet in the aisles', 'Strong early reflections from above and the sides, and a raked floor', 'Raising the stage loudspeakers’ treble'], a: 2, why: 'The dip affects sound grazing the seating. Energy arriving from overhead or lateral directions is not filtered and restores the missing band.' },
      { q: 'A heavy velour curtain hangs flat against a concrete wall and does little at 500 Hz. The best single improvement is to…', opts: ['Add a blackout lining', 'Hang it 150 mm off the wall with deep folds', 'Use a lighter, more open fabric', 'Wet the fabric'], a: 1, why: 'A resistive sheet absorbs where air moves — about a quarter-wavelength from the wall. Spacing and fullness put cloth there; a lining would make it reflective.' },
      { q: 'What makes a micro-perforated panel absorb without any fibrous backing?', opts: ['The sheet vibrates like a drum', 'Viscous friction in the sub-millimetre holes provides the resistance', 'The cavity is filled with gas', 'The holes diffuse the sound'], a: 1, why: 'When holes are comparable in size to the viscous boundary layer, the air moving through them loses energy to friction — the hole is its own damping.' },
      { q: 'Which statement about thin “metamaterial” or coiled-channel bass absorbers is accurate?', opts: ['They absorb all frequencies equally', 'They break the laws of physics by exceeding 100 % absorption', 'They can absorb low frequencies in a small thickness, but only in a narrow band', 'They work best when painted'], a: 2, why: 'They are compact resonators. Depth is traded for bandwidth; covering a wide band needs many differently tuned elements sharing the face area.' },
    ],
  });

  /* =====================================================================
     LESSON 18A — Modelling
     ===================================================================== */
  after(['measurement', 'halls', 'rooms'], {
    id: 'modelling', n: '18A',
    title: 'Predicting Rooms by Computer: Image Sources, Ray Tracing, Wave Models and Auralisation',
    level: 'Advanced', mins: 36,
    summary: 'How acoustic simulation software works under the bonnet, in plain words: mirror-image sources, ray tracing, hybrids, and wave-based solvers; what an echogram tells you; how auralisation lets you listen to a design; where each method fails; and why the quality of the input data matters more than the brand of the program.',
    tags: ['modelling', 'simulation', 'image source', 'ray tracing', 'scattering coefficient', 'FDTD', 'FEM', 'BEM', 'auralisation', 'impulse response', 'echogram', 'prediction'],
    sections: [
      { h: 'Why model a room at all?', html: `
        <p>Formulas such as Sabine’s give one number for a whole room. They cannot tell you that the back row gets an echo from the control-room glass, that the balcony seats are 6 dB down, or that moving the absorbers from the ceiling to the rear wall would cure a flutter. A <b>model</b> can, because it follows sound along actual paths in the actual shape.</p>
        ${SVG_PIPE}
        <p>Modelling is worth the effort when a mistake would be expensive to fix after construction, when the room is too large or odd-shaped for rules of thumb, or when the client needs to <i>hear</i> options before paying for one. For a small rectangular control room, a mode calculator, a reflection-point sketch and a measurement microphone often teach you more, faster — the app’s <a href="#/predict">Predict</a> and <a href="#/treatment">Treatment</a> tools work this way.</p>
        ${flow([['Question', 'what decision will the model inform?'], ['Build', 'simple geometry, honest materials'], ['Run', 'early reflections + decay'], ['Check', 'against formulas and experience'], ['Compare', 'option A vs option B'], ['Calibrate', 'against measurements when the room exists']])}
        <div class="callout mentor"><b>A model is an argument, not an oracle.</b> Its real value is in comparing alternatives under the same assumptions. Absolute predictions are only as good as the absorption and scattering data fed in — which, as we will see, is the weak link.</div>` },
      { h: 'What goes in', html: `
        <p>Every room-acoustics program, whatever its method, asks for the same four things.</p>
        ${tbl(['Input', 'What you provide', 'How much detail', 'Typical mistake'], [
          ['Geometry', 'A closed 3-D shape made of flat faces', 'Surfaces larger than about 0.5 m; leave out mouldings, chairs, handrails', 'Importing the architect’s model with 50 000 faces — slower and <i>less</i> accurate'],
          ['Absorption', 'A coefficient per surface in octave bands 63 Hz–8 kHz', 'From test data for the real build-up and mounting', 'Using the single-number rating, or lab values above 1.0, unchanged'],
          ['Scattering', 'A coefficient 0–1 per surface: the fraction reflected in non-mirror directions', 'Estimated from roughness depth and the detail you left out', 'Leaving it at zero'],
          ['Sources and receivers', 'Position, sound power and directivity; listener positions or a grid', 'Real loudspeaker data files; an all-round source for RT', 'An all-round source to predict speech from a directional loudspeaker'],
        ])}
        <p><b>Scattering</b> deserves a moment. Geometric models treat walls as perfect mirrors unless told otherwise. Real walls have doors, frames, furniture, ornament and diffusers, which throw part of each reflection in other directions. The scattering coefficient stands in for all that omitted detail. As a starting point: large smooth plaster or glass 0.05–0.10; brickwork with deep joints, shallow relief 0.2–0.3; bookshelves, deliberately modulated surfaces 0.4–0.6; seated audience 0.6–0.7.</p>
        <div class="callout warn"><b>Simplify on purpose.</b> A model made of a few hundred well-chosen faces with sensible scattering values beats a photo-realistic one. Small faces are smaller than the wavelengths being modelled, and a ray that “reflects” from a 10 cm facet at 250 Hz is describing something that does not happen.</div>` },
      { h: 'The image-source method', html: `
        <p>A reflection from a flat wall looks, to the listener, exactly as if it came from a second source behind the wall — the <b>mirror image</b> of the real one. Reflect that image in another wall and you have a second-order reflection, and so on. The room is replaced by a lattice of image sources in free space; the distance to each gives its delay and spreading loss, and the walls it “passed through” give its absorption.</p>
        <p>For a rectangular room the lattice is perfectly regular and every image is valid, which makes the method exact (for mirror-like walls) and easy to program. In irregular rooms each candidate image must be tested — is the reflection point actually on the wall? is the path blocked? — and most candidates fail, so the work grows explosively with reflection order.</p>
        <div class="callout physics"><b>How fast it grows.</b> In a box, the number of images up to order N is about (4/3)·N³: 25 at order 2, about 1 500 at order 10, and over 10 000 by order 20. The first 50–100 ms of a concert hall needs order 3–6; the full reverberant tail would need order 50 or more. Hence: images for the early part, something statistical for the rest.</div>
        <p>Because it finds every early reflection exactly, the image method is the right tool for questions about <b>first-reflection points, echoes, flutter between specific surfaces, reflector shaping and stage design</b>.</p>`, viz: 'imageSources' },
      { h: 'Ray tracing, scattering and hybrids', html: `
        <p>Ray tracing turns the problem around. Instead of asking “which reflections reach this listener?”, it fires tens of thousands of rays from the source in all directions and simply follows them. Each ray carries a packet of energy; each time it hits a surface it loses the fraction that surface absorbs, and is sent on — as a mirror reflection, or in a random direction with a probability equal to the scattering coefficient. Whenever a ray passes through a small “detector” volume around a listener, its remaining energy and arrival time are logged.</p>
        <p>The result is a <b>statistical</b> picture: not every reflection is found, but with enough rays the energy arriving in each time slot is right. Cost grows only in proportion to the length of the response, not explosively — so ray tracing handles the late, dense part of the response that image sources cannot reach.</p>
        ${tbl(['Method', 'Idea', 'Strong at', 'Weak at'], [
          ['Image sources', 'Mirror the source in every surface', 'Exact early reflections', 'High orders; curved or highly detailed rooms'],
          ['Ray / particle tracing', 'Follow many energy carriers', 'Late decay, scattering, complex shapes', 'Fine detail of early reflections; needs many rays'],
          ['Beam or cone tracing', 'Follow fat rays that widen with distance', 'Finds early reflections without missing any, faster than testing all images', 'Overlap and gaps between beams need correction'],
          ['Hybrid', 'Images or beams early, rays (often with a “secondary source” trick) late', 'The practical standard in commercial programs', 'The hand-over between the two parts'],
          ['Radiosity', 'Every surface patch exchanges diffuse energy with every other', 'Smooth late decay in very diffuse rooms', 'Ignores mirror reflections altogether'],
        ])}
        <div class="callout mentor"><b>Try this in the tool:</b> rectangle, absorption only on the end walls, scattering near zero. The decay bends into two slopes — a fast start, then a tail that will not die. Now raise the scattering to 0.3. That one slider explains most of the disagreement between naive models and real rooms.</div>`, viz: 'rayTracer' },
      { h: 'The echogram and the impulse response', html: `
        <p>Whatever the method, the output for one source and one listener is a list of arrivals: time, level, direction, and spectrum. Plotted as stems against time it is called an <b>echogram</b> or reflectogram. Add the fine structure of each arrival and you have the room’s <b>impulse response</b> — the room’s complete answer to a click, from which everything else can be worked out.</p>
        ${SVG_ECHO}
        ${tbl(['Read from the echogram', 'How', 'What it predicts'], [
          ['Initial time-delay gap', 'Time from the direct sound to the first strong reflection', 'Sense of intimacy or of room size; under 20 ms feels close'],
          ['Early decay time (EDT)', 'Slope of the first 10 dB of decay', 'Perceived reverberance during running music'],
          ['Reverberation time (T20, T30)', 'Slope from −5 dB down to −25 or −35 dB', 'Fullness after a stop chord'],
          ['Clarity C50 / C80', 'Energy before 50 or 80 ms ÷ energy after', 'Speech (C50) and music (C80) definition'],
          ['Strength G', 'Total level compared with the same source at 10 m in the open', 'Whether the room “supports” the sound'],
          ['Lateral fraction', 'Share of early energy arriving from the sides', 'Apparent source width, spaciousness'],
          ['Isolated late stem', 'A strong arrival more than 50 ms late standing above its neighbours', 'An audible echo — trace it back to its surface'],
        ])}
        <p>These are the same quantities you extract from a measured impulse response in a finished room, defined in the room-acoustic measurement standards (the ISO 3382 series — check the current edition; see also <a href="#/academy/m-standards">the standards lesson</a>). That is deliberate: prediction and measurement speak the same language so one can check the other.</p>` },
      { h: 'What geometric models cannot do', html: `
        <p>Rays and images treat sound as if it were light: it travels in straight lines, reflects like a billiard ball and carries only energy. That is a fair picture when wavelengths are small compared with the room and its surfaces. It fails when they are not.</p>
        ${SVG_REGIONS}
        <ul><li><b>Room modes.</b> Below the Schroeder frequency, f<sub>s</sub> ≈ 2000·√(RT/V), individual resonances dominate. A ray has no phase, so it cannot form a standing wave. In a 50 m³ control room with RT = 0.3 s, f<sub>s</sub> ≈ 155 Hz — and in practice geometric predictions are doubtful below about twice that.</li>
        <li><b>Diffraction.</b> Sound bends around a balcony front, a barrier or a console; plain rays do not. Programs add approximate edge-diffraction corrections, but shadow zones are still predicted too dark.</li>
        <li><b>Small or curved surfaces.</b> A reflector smaller than a few wavelengths reflects weakly and widely; a ray treats it as a perfect mirror. Curved surfaces built from flat facets focus wrongly unless the software handles them specially.</li>
        <li><b>Phase and interference.</b> Comb filtering between a direct sound and a strong reflection, boundary interference near a wall, and the behaviour of tuned absorbers are all wave effects.</li>
        <li><b>Angle-dependent absorption.</b> One coefficient per surface assumes sound arrives from all directions equally. For a grazing reflection off an audience or a porous ceiling, the true value can be very different.</li></ul>
        <div class="callout warn"><b>For studio designers this is the headline:</b> the frequencies where small rooms are hardest — 30 to 300 Hz — are exactly where ray-based software is least reliable. Use mode calculations, wave-based tools or measurement there, and use geometric models for what they are good at: reflection control and mid/high decay.</div>` },
      { h: 'Wave-based methods, SEA and scale models', html: `
        <p>Wave-based methods solve the actual wave equation numerically, so modes, diffraction and interference come out automatically. The price is computation, which rises steeply with frequency.</p>
        ${tbl(['Method', 'In plain words', 'Used for', 'Cost and limits'], [
          ['Finite-difference time-domain', 'Fill the room with a grid of points; step pressure forward in time, each point pushed by its neighbours', 'Impulse responses of rooms at low and mid frequencies; visualising wavefronts', 'Simple and well suited to graphics cards; needs ~10 points per wavelength; stair-stepped boundaries need care'],
          ['Finite elements', 'Divide the air (and structures) into small elements of any shape; solve one frequency at a time', 'Modes of small rooms, cars, loudspeaker cabinets; coupled air–structure problems', 'Handles curved shapes and real materials; matrices become huge above a few hundred hertz'],
          ['Boundary elements', 'Mesh only the surfaces; the air is handled analytically', 'Radiation and scattering into open space: diffusers, barriers, loudspeaker horns', 'Dense matrices; excellent for exterior problems, heavy for large interiors'],
          ['Modal / analytical', 'Add up the known modes of a simple shape', 'Rectangular rooms at low frequency — fast and insightful', 'Only simple shapes and light damping'],
        ])}
        <p>The practical state of the art is a <b>hybrid by frequency</b>: a wave method for the lowest octaves, a geometric method above, joined around the Schroeder frequency.</p>
        <p><b>Statistical energy analysis</b> answers a different question: how vibration energy shares itself among the many walls, floors and cavities of a building. Each element is treated as a reservoir of energy; power flows between connected elements in proportion to the difference in their stored energy, like heat. It ignores detail completely and works when each element has many modes in the band — mid and high frequencies. It is the engine behind the standard methods for predicting flanking transmission between rooms.</p>
        <p><b>Physical scale models</b> — 1:10 or 1:50, tested with ultrasound at 10 or 50 times the frequency — were the design tool for concert halls before computers and are still used for the most ambitious ones, because a real wave in a real shape includes every effect. Air absorption must be controlled (dry air or nitrogen), and materials chosen to match at the scaled frequency.</p>`, viz: 'gridDispersion' },
      { h: 'Auralisation: listening to the model', html: `
        <p>Numbers and colour maps persuade engineers. Clients, musicians and architects are persuaded by <b>hearing</b>. Auralisation is the audio equivalent of a rendered image: the predicted impulse response is combined with a recording made in no room at all, and the result is what that performance would sound like at that seat.</p>
        ${SVG_AURAL}
        ${flow([['Dry source', 'speech or music recorded anechoically'], ['Impulse response', 'predicted for one seat, per frequency band'], ['Direction', 'each arrival filtered for left and right ear'], ['Convolve', 'every sample of the music triggers a scaled copy of the response'], ['Play back', 'headphones, or a loudspeaker array around the listener']])}
        <p><b>What it is good for:</b> comparing two designs (with and without the rear-wall diffuser; curtain open or drawn); demonstrating an echo or a lack of clarity to a non-specialist; training your own ears to connect parameters with sound; checking a public-address design for intelligibility.</p>
        <p><b>What it cannot promise:</b> the absolute sound of the finished room. The low frequencies are the model’s weakest part; generic head filters are not your head; headphones remove the tactile and visual cues; and the source’s directivity is usually simplified. Treat it like an architect’s rendering — convincing, useful, and not a photograph.</p>
        <div class="callout mentor"><b>In the tool below</b>, set a classroom with low absorption and listen to the speech-like signal; then raise the absorption until C50 turns positive. You have just done the single most common job in architectural acoustics, by ear.</div>`, viz: 'auralise' },
      { h: 'Garbage in, garbage out: accuracy and calibration', html: `
        <p>Comparisons in which many experienced users modelled the same real hall and their results were set against measurements delivered a sobering lesson: the spread between users was as large as the spread between programs, and came mostly from the <b>input data</b>.</p>
        <ul><li><b>Absorption coefficients are uncertain.</b> The same material tested in different laboratories can differ by 0.1–0.2, more at low frequencies. Values measured on a 10 m² sample in a reverberation room include edge effects and assume diffuse incidence, neither of which holds on a real wall.</li>
        <li><b>The hardest surfaces matter most.</b> In a live room, changing a plaster wall from 0.02 to 0.04 doubles its absorption and can shift the predicted RT by tens of percent. Small numbers need the most care.</li>
        <li><b>Scattering is an educated guess.</b> There are measurement methods, but data exist for few real surfaces.</li>
        <li><b>Audience and seats</b> depend on row spacing, upholstery and occupancy — often the largest and least certain item.</li></ul>
        ${tbl(['Quantity', 'Just-noticeable difference', 'A good model typically achieves'], [
          ['Reverberation time, EDT', '≈ 5 %', '5–10 % at mid frequencies; worse at 125 Hz and below'],
          ['Clarity C80 / C50', '≈ 1 dB', '1–2 dB'],
          ['Strength G', '≈ 1 dB', '1–2 dB'],
          ['Speech transmission index', '≈ 0.03', '0.03–0.05'],
        ])}
        <p>In other words: at best, about one just-noticeable difference — good enough to choose between designs, not good enough to promise a figure to two decimal places.</p>
        <p><b>Calibration</b> closes the gap. When the room, or a similar one, exists: measure it, model it as built, and adjust the uncertain coefficients (within believable limits) until the model matches in every octave band. A calibrated model predicts the effect of <i>changes</i> — new seats, added banners, a relocated loudspeaker — with far more confidence than a model built from catalogue data alone.</p>
        ${myth([['“The software says RT = 1.43 s.”', 'It says about 1.3–1.6 s, given your inputs. Quote one decimal place and a tolerance.'], ['“More rays and more faces mean more accuracy.”', 'Beyond convergence, more rays change nothing; more small faces usually make it worse. Better input data is the only real upgrade.'], ['“We modelled it, so we don’t need to measure.”', 'Models predict; measurements verify. Commissioning measurements are how you find the bridged isolation mount and the forgotten curtain.']])}` },
      { h: 'A sensible workflow — studio and hall', html: `
        <div class="uc-grid">
        ${uc('🎚️', 'Small studio or control room', [['Low frequencies', 'Mode calculator for dimensions; speaker and listener placement by modal response; wave-based check if the shape is not a box'], ['Mid / high', 'First-reflection geometry by image sources (a mirror on the wall is the analogue version); RT by formula with real coefficients'], ['Do', 'Build, then measure and adjust — in small rooms measurement is quick and beats any model'], ['Skip', 'Elaborate ray tracing of a 40 m³ box']], C3)}
        ${uc('🎻', 'Recital or concert hall', [['Concept', 'Volume per seat and basic shape from precedent and formulas'], ['Design', 'Hybrid geometric model: reflection coverage, clarity, strength and lateral energy across a grid of seats'], ['Refine', 'Reflector angles, balcony fronts, diffusion; auralise key seats for the client'], ['Verify', 'Scale model or wave methods for special risks (focusing, stage, under-balcony); commissioning measurements']], C1)}
        ${uc('🗣️', 'Lecture hall, station, place of worship', [['Goal', 'Speech intelligibility at every listener'], ['Model', 'Real loudspeaker directivity, background noise, absorption with and without people'], ['Output', 'Maps of speech transmission index and level; check worst seats, not the average'], ['Do', 'Calibrate against a measurement of the empty room before choosing loudspeakers']], C4)}
        ${uc('🏢', 'Open-plan office or restaurant', [['Goal', 'Level fall-off with distance; privacy'], ['Model', 'Ray tracing with furniture as screens and high scattering'], ['Output', 'Decay of speech level per doubling of distance; distraction distance'], ['Fix', 'Ceiling absorption class, screen height, masking sound — compare options side by side']], C2)}
        </div>
        <p><b>Tools.</b> Commercial room-acoustics packages are hybrid geometric programs with material libraries, loudspeaker databases, parameter maps and auralisation; they differ mainly in workflow and price. Free and open-source options exist for image-source and ray-based work, for finite-difference and finite-element wave simulation, and as research toolboxes for numerical computing environments. General 3-D drawing programs are commonly used to build the geometry. Whichever you use, the procedure — and the limits — are the ones in this lesson.</p>
        <h4>Rules of thumb</h4>
        <ul><li>Model surfaces bigger than about half a metre; represent the rest by scattering.</li>
        <li>Never leave scattering at zero. 0.1 for plain flat walls is a safe minimum.</li>
        <li>Trust geometric results above roughly twice the Schroeder frequency.</li>
        <li>Wave grids: about 10 points per wavelength; one octave higher costs 16 × more.</li>
        <li>Check the model against Sabine or Eyring first — a 30 % disagreement means an input error or a genuinely non-diffuse room; find out which.</li>
        <li>Report predictions with tolerances; use the model for differences, measurements for absolutes.</li></ul>
        <div class="callout example"><b>Apply it.</b> Sit where you normally listen and hold a small mirror flat against the side wall at ear height; slide it until you can see a loudspeaker in it. You have just found a first-order image source by hand. Do the same for the ceiling and the other wall, measure the three path lengths, and work out each reflection’s delay (extra path ÷ 343 m/s) — then compare with the highlighted arrivals in the image-source tool above.</div>` },
    ],
    quiz: [
      { q: 'Why do practical programs use image sources only for the first few reflection orders?', opts: ['Image sources are inaccurate for early reflections', 'The number of images grows explosively with order', 'Image sources cannot handle absorption', 'They only work outdoors'], a: 1, why: 'The count rises roughly with the cube of the order (and most candidates must be tested for validity), so the late response is handled statistically by rays.' },
      { q: 'A ray-traced model with scattering set to zero predicts a much longer, bent decay than the real room has. The most likely reason is…', opts: ['Too few rays', 'Real surfaces scatter sound, mixing it so all of it meets the absorbers', 'The air absorption was too high', 'The room is too small for rays'], a: 1, why: 'With mirror-only reflections, some rays never reach the absorbing surfaces and ring on. Real rooms have detail that scatters; the coefficient represents it.' },
      { q: 'In a 50 m³ control room, which tool is least trustworthy for predicting the response at 60 Hz?', opts: ['A rectangular-room mode calculation', 'A finite-element model', 'A geometric (ray / image) model', 'A measurement'], a: 2, why: 'At 60 Hz the room is governed by individual modes — a wave effect. Rays carry no phase and cannot form standing waves.' },
      { q: 'What two things are convolved to create an auralisation?', opts: ['Two impulse responses', 'A dry (anechoic) recording and the room’s impulse response', 'A reverberant recording and a noise signal', 'The absorption coefficients and the scattering coefficients'], a: 1, why: 'Convolution imprints the room’s response on a recording that contains no room of its own. A recording that already has reverberation would end up with two rooms.' },
      { q: 'What usually limits the accuracy of a room-acoustic prediction?', opts: ['The number of rays', 'The brand of software', 'Uncertainty in the absorption and scattering data', 'The colour scheme of the results'], a: 2, why: 'Published coefficients vary between laboratories and mountings, and scattering is largely estimated. Calibrating against a measurement is the best remedy.' },
    ],
  });
})();
