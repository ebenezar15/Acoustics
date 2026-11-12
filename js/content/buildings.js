/* ==========================================================================
   Building-type acoustics, building services noise & project workflow
   (Master Class M33, M34) and speech intelligibility / stage monitoring
   (Audio track A13A, A13B). Original text; typical guidance values only.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design|solution/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const tbl = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c, i) => `<td>${i ? c : `<b>${c}</b>`}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const C1 = '#7a5cc7', C2 = '#c7772b', C3 = '#2b9fc7', C4 = '#4c9a3a', C5 = '#d14b8f', C6 = '#c7a12b';

  /* ------------------------------------------------------------------ SVGs */
  const SVG_FOUR = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Four questions for every building">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Every room, whatever its use, is judged on the same four things</text>
    ${[['Quiet enough?', 'background noise', 'NC / NR / dBA', 'c3'], ['Private enough?', 'sound insulation', 'DnT,w · L′nT,w', 'accent2'], ['Right liveliness?', 'reverberation', 'RT by use & volume', 'c4'], ['Understood?', 'intelligibility', 'STI · signal-to-noise', 'good']].map(([t, s, u, c], i) => { const x = 20 + i * 165; return `<g><rect x="${x}" y="32" width="150" height="130" rx="10" fill="var(--panel2)" stroke="var(--${c})" stroke-width="2"/>
      <circle class="hot" cx="${x + 75}" cy="70" r="20" fill="var(--${c})" opacity=".85"/><text x="${x + 75}" y="76" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">${i + 1}</text>
      <text x="${x + 75}" y="112" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="${x + 75}" y="128" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text><text x="${x + 75}" y="146" text-anchor="middle" font-size="10" fill="var(--${c})">${u}</text></g>`; }).join('')}
    <text x="340" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">What changes from building to building is only how much each one matters — and the numbers.</text>
  </svg>`;

  const SVG_RTSCALE = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Reverberation by use">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">How live should it be? Typical mid-frequency reverberation by use</text>
    <line x1="40" y1="150" x2="650" y2="150" stroke="var(--text)" stroke-width="2"/>
    ${[0, 0.5, 1, 1.5, 2, 2.5, 3].map((s) => `<line x1="${40 + s * 200}" y1="146" x2="${40 + s * 200}" y2="154" stroke="var(--text)"/><text x="${40 + s * 200}" y="170" text-anchor="middle" font-size="10" fill="var(--muted)">${s} s</text>`).join('')}
    ${[['studio', 0.2, 0.4, 36, 'c3'], ['office · classroom', 0.4, 0.8, 54, 'accent2'], ['cinema', 0.3, 0.6, 72, 'c3'], ['speech hall · drama', 0.8, 1.3, 90, 'good'], ['opera · chamber', 1.3, 1.8, 108, 'warn'], ['symphony', 1.8, 2.2, 126, 'accent'], ['organ · choral', 2.2, 3.1, 90, 'bad']].map(([l, a, b, y, c]) => `<rect x="${40 + a * 200}" y="${y}" width="${(b - a) * 200}" height="12" rx="4" fill="var(--${c})" opacity=".8"/><text x="${40 + b * 200 + 6}" y="${y + 10}" font-size="10">${l}</text>`).join('')}
    <text x="340" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">Speech wants clarity (short); unamplified music wants bloom (long). Larger rooms sit toward the top of each band.</text>
  </svg>`;

  const SVG_OFFICE = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Open-plan office speech paths">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Open-plan office: three ways a voice reaches the next team</text>
    <rect x="30" y="34" width="620" height="12" fill="var(--c4)" opacity=".8"/><text x="644" y="30" text-anchor="end" font-size="10" fill="var(--c4)">absorbent ceiling</text>
    <rect x="30" y="160" width="620" height="6" fill="var(--muted)"/>
    <circle cx="110" cy="118" r="10" fill="var(--accent)"/><rect x="92" y="130" width="60" height="6" fill="var(--accent2)"/><text x="110" y="182" text-anchor="middle" font-size="10">talker</text>
    <circle cx="560" cy="118" r="10" fill="var(--good)"/><rect x="530" y="130" width="60" height="6" fill="var(--accent2)"/><text x="560" y="182" text-anchor="middle" font-size="10">listener</text>
    <rect x="325" y="80" width="10" height="80" fill="var(--text)"/><text x="330" y="74" text-anchor="middle" font-size="10">screen</text>
    <path class="leak-pulse" d="M120 112 L330 46 L550 112" fill="none" stroke="var(--bad)" stroke-width="2"/><text x="330" y="60" text-anchor="middle" font-size="10" fill="var(--bad)" dx="90">① ceiling bounce</text>
    <path class="leak-pulse" d="M120 114 Q 330 60 550 114" fill="none" stroke="var(--warn)" stroke-width="2" stroke-dasharray="5 4"/><text x="250" y="96" font-size="10" fill="var(--warn)">② over the screen</text>
    <path d="M122 120 L322 120" stroke="var(--good)" stroke-width="2"/><text x="220" y="134" text-anchor="middle" font-size="10" fill="var(--good)">③ direct: blocked</text>
  </svg>`;

  const SVG_HALL = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Variable acoustics in a multipurpose hall">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A multipurpose hall and its variable-acoustics devices (section)</text>
    <path d="M40 190 L40 40 L640 40 L640 190 L560 190 L220 150 L220 190 Z" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/>
    <rect x="60" y="176" width="140" height="14" fill="var(--accent2)"/><text x="130" y="206" text-anchor="middle" font-size="10">stage + shell</text>
    <path d="M60 176 L60 96 L200 76" fill="none" stroke="var(--accent)" stroke-width="3"/>
    ${[280, 360, 440, 520].map((x, i) => `<rect class="${i % 2 ? 'seal-squish' : ''}" x="${x}" y="44" width="14" height="${50 + i * 6}" fill="var(--c4)" opacity=".85"/>`).join('')}
    <rect x="240" y="26" width="360" height="14" fill="none" stroke="var(--c3)" stroke-dasharray="5 4"/><text x="420" y="36" text-anchor="middle" font-size="9" fill="var(--c3)">reverberation chamber / raised ceiling</text>
    <rect x="212" y="170" width="46" height="18" fill="var(--muted)" opacity=".6"/><text x="235" y="206" text-anchor="middle" font-size="10">pit</text>
    <g class="lock-wave"><circle cx="130" cy="150" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/></g><g class="lock-wave d2"><circle cx="130" cy="150" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/></g>
    <text x="596" y="120" text-anchor="end" font-size="10" fill="var(--c4)">retractable banners</text>
    <text x="596" y="134" text-anchor="end" font-size="10" fill="var(--muted)">down = speech / amplified</text><text x="596" y="148" text-anchor="end" font-size="10" fill="var(--muted)">up = orchestral</text>
  </svg>`;

  const SVG_PATHS = `<svg class="gsvg" viewBox="0 0 680 240" role="img" aria-label="Noise paths from a plant room">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">One machine, five ways into the quiet room</text>
    <rect x="30" y="40" width="250" height="160" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/><text x="155" y="58" text-anchor="middle" font-size="11" font-weight="700">plant room</text>
    <rect x="400" y="40" width="250" height="160" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/><text x="525" y="58" text-anchor="middle" font-size="11" font-weight="700">quiet room</text>
    <rect x="90" y="130" width="90" height="50" rx="5" fill="var(--muted)"/><text x="135" y="160" text-anchor="middle" font-size="10" fill="#fff">fan / chiller</text>
    <rect x="80" y="182" width="110" height="8" fill="var(--good)"/><path d="M96 190 l0 8 M174 190 l0 8" stroke="var(--good)" stroke-width="4"/>
    <path d="M180 140 H300 V96 H470" fill="none" stroke="var(--c3)" stroke-width="12" opacity=".5"/><path class="leak-pulse" d="M180 140 H300 V96 H470" fill="none" stroke="var(--c3)" stroke-width="2" stroke-dasharray="6 6"/>
    ${[['①', 232, 118, 'airborne through the wall'], ['②', 340, 96, 'along the duct'], ['③', 135, 212, 'vibration into the structure'], ['④', 300, 60, 'duct-wall break-out'], ['⑤', 470, 120, 'air noise at the grille']].map(([n, x, y]) => `<circle class="hot" cx="${x}" cy="${y}" r="10" fill="var(--bad)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">${n}</text>`).join('')}
    <path class="leak-pulse" d="M280 130 L400 130" stroke="var(--bad)" stroke-width="2"/>
    <path class="leak-pulse" d="M135 200 L135 222 L525 222 L525 200" fill="none" stroke="var(--warn)" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="340" y="236" text-anchor="middle" font-size="10" fill="var(--muted)">① wall · ② duct-borne · ③ structure-borne · ④ break-out · ⑤ regenerated at grilles and dampers</text>
  </svg>`;

  const SVG_ISO = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Vibration isolation of plant">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Mounting a machine so the building does not hum</text>
    <rect x="40" y="170" width="600" height="14" fill="var(--muted)"/><text x="340" y="198" text-anchor="middle" font-size="10" fill="var(--muted)">structural slab (stiff — locate plant near columns or on the ground)</text>
    <rect x="150" y="118" width="260" height="22" fill="var(--text)" opacity=".75"/><text x="280" y="133" text-anchor="middle" font-size="10" fill="#fff">inertia base (concrete, 1–2× machine mass)</text>
    ${[170, 250, 330, 390].map((x) => `<path class="seal-squish" d="M${x} 140 l-7 5 l14 5 l-14 5 l14 5 l-7 5 v5" fill="none" stroke="var(--good)" stroke-width="2.5"/>`).join('')}
    <rect x="190" y="66" width="180" height="52" rx="6" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><text x="280" y="96" text-anchor="middle" font-size="11" font-weight="700">pump / fan / chiller</text>
    <path d="M370 90 H430" stroke="var(--c3)" stroke-width="10"/><path d="M430 82 q8 8 0 16 q8 -8 16 0 q-8 -8 0 -16" fill="var(--warn)"/><rect x="430" y="80" width="26" height="20" fill="var(--warn)" opacity=".7"/><path d="M456 90 H600" stroke="var(--c3)" stroke-width="10"/>
    <text x="443" y="70" text-anchor="middle" font-size="10" fill="var(--warn)">flexible connector</text>
    <path d="M540 90 V40" stroke="var(--good)" stroke-width="2"/><path d="M533 40 h14" stroke="var(--text)" stroke-width="3"/><text x="552" y="54" font-size="10" fill="var(--good)">pipe on spring hangers</text>
    <text x="110" y="156" text-anchor="end" font-size="10" fill="var(--good)">springs: deflection</text><text x="110" y="168" text-anchor="end" font-size="10" fill="var(--good)">sized to the speed</text>
  </svg>`;

  const SVG_STAGES = `<svg class="gsvg" viewBox="0 0 700 150" role="img" aria-label="Acoustic work through the project stages">
    <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700">Acoustics through a building project</text>
    ${[['Brief', 'criteria agreed'], ['Survey', 'noise & vibration'], ['Concept', 'layout, zoning'], ['Detail', 'specs, drawings'], ['Tender', 'what is priced'], ['Site', 'inspect, witness'], ['Commission', 'measure'], ['Handover', 'report, manuals']].map(([t, s], i) => { const x = 14 + i * 86; return `<g><rect x="${x}" y="40" width="76" height="60" rx="8" fill="var(--panel2)" stroke="var(--line)"/><text x="${x + 38}" y="64" text-anchor="middle" font-size="11" font-weight="700">${t}</text><text x="${x + 38}" y="82" text-anchor="middle" font-size="8.5" fill="var(--muted)">${s}</text>${i < 7 ? `<path d="M${x + 76} 70 h10" stroke="var(--accent)" stroke-width="2"/>` : ''}</g>`; }).join('')}
    <rect x="14" y="112" width="252" height="10" fill="var(--good)" opacity=".7"/><rect x="272" y="112" width="250" height="10" fill="var(--warn)" opacity=".7"/><rect x="528" y="112" width="162" height="10" fill="var(--bad)" opacity=".7"/>
    <text x="140" y="138" text-anchor="middle" font-size="10" fill="var(--good)">changes are free</text><text x="397" y="138" text-anchor="middle" font-size="10" fill="var(--warn)">changes cost money</text><text x="609" y="138" text-anchor="middle" font-size="10" fill="var(--bad)">changes cost a rebuild</text>
  </svg>`;

  const SVG_DR = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Direct and reverberant sound">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Intelligibility lives in the direct sound; reverberation and noise drown it</text>
    <line x1="60" y1="160" x2="640" y2="160" stroke="var(--text)"/><line x1="60" y1="160" x2="60" y2="34" stroke="var(--text)"/>
    <text x="350" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">distance from the loudspeaker →</text><text x="40" y="100" font-size="10" fill="var(--muted)" transform="rotate(-90 40 100)" text-anchor="middle">level</text>
    <path d="M70 40 Q 200 110 640 150" fill="none" stroke="var(--accent)" stroke-width="3"/><text x="150" y="60" font-size="10" fill="var(--accent)">direct sound: −6 dB per doubling</text>
    <line x1="60" y1="98" x2="640" y2="98" stroke="var(--warn)" stroke-width="3"/><text x="630" y="92" text-anchor="end" font-size="10" fill="var(--warn)">reverberant level (same everywhere)</text>
    <line x1="60" y1="132" x2="640" y2="132" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/><text x="630" y="146" text-anchor="end" font-size="10" fill="var(--muted)">background noise</text>
    <line x1="252" y1="34" x2="252" y2="160" stroke="var(--good)" stroke-dasharray="4 4"/><circle class="hot" cx="252" cy="98" r="6" fill="var(--good)"/><text x="258" y="46" font-size="10" fill="var(--good)">critical distance</text>
    <text x="150" y="176" text-anchor="middle" font-size="10" fill="var(--good)">clear</text><text x="460" y="176" text-anchor="middle" font-size="10" fill="var(--bad)">increasingly blurred</text>
  </svg>`;

  const SVG_STISCALE = `<svg class="gsvg" viewBox="0 0 680 120" role="img" aria-label="STI scale">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The Speech Transmission Index scale</text>
    ${[[0, 0.3, 'bad', 'bad'], [0.3, 0.45, 'bad', 'poor'], [0.45, 0.6, 'warn', 'fair'], [0.6, 0.75, 'good', 'good'], [0.75, 1, 'good', 'excellent']].map(([a, b, c, l], i) => `<rect x="${40 + a * 600}" y="34" width="${(b - a) * 600 - 3}" height="26" rx="4" fill="var(--${c})" opacity="${i === 0 || i === 4 ? 0.85 : 0.5}"/><text x="${40 + ((a + b) / 2) * 600}" y="52" text-anchor="middle" font-size="11" font-weight="700">${l}</text>`).join('')}
    ${[0, 0.3, 0.45, 0.6, 0.75, 1].map((v) => `<text x="${40 + v * 600}" y="76" text-anchor="middle" font-size="10" fill="var(--muted)">${v}</text>`).join('')}
    <path d="M340 84 v14" stroke="var(--text)" stroke-width="2"/><text x="340" y="112" text-anchor="middle" font-size="10">voice-alarm systems commonly need ≥ 0.50 · lecture and teaching rooms aim for ≥ 0.60</text>
  </svg>`;

  const SVG_LOOP = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Induction loop">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Induction loop: the room becomes a transformer for hearing aids</text>
    <rect x="60" y="40" width="430" height="120" rx="8" fill="var(--panel2)" stroke="var(--line)"/>
    <rect x="80" y="56" width="390" height="88" rx="6" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="10 6" class="leak-pulse"/>
    <text x="275" y="76" text-anchor="middle" font-size="10" fill="var(--accent)">loop cable in the floor carries the audio current</text>
    ${[160, 275, 390].map((x) => `<g class="lock-wave ${x === 275 ? 'd2' : x === 390 ? 'd3' : ''}"><ellipse cx="${x}" cy="110" rx="18" ry="10" fill="none" stroke="var(--c3)" stroke-width="2"/></g><circle cx="${x}" cy="110" r="6" fill="var(--good)"/>`).join('')}
    <text x="275" y="136" text-anchor="middle" font-size="10" fill="var(--c3)">magnetic field picked up by the telecoil (“T” setting)</text>
    <rect x="520" y="70" width="110" height="50" rx="6" fill="var(--panel2)" stroke="var(--text)"/><text x="575" y="92" text-anchor="middle" font-size="10" font-weight="700">loop amplifier</text><text x="575" y="108" text-anchor="middle" font-size="9" fill="var(--muted)">fed from the mixer</text>
    <path d="M520 95 H470" stroke="var(--accent)" stroke-width="2"/>
    <text x="340" y="180" text-anchor="middle" font-size="10" fill="var(--muted)">Direct, dry sound straight into the listener’s own hearing aid — no headset to borrow.</text>
  </svg>`;

  const SVG_NULLS = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Wedge placement in microphone nulls">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Put the wedge where the microphone is deaf</text>
    ${[['Cardioid', 170, [[0, 78]], 'null straight behind'], ['Supercardioid', 510, [[-30, 78], [30, 78]], 'nulls at about ±120°']].map(([name, cx, wedges, note]) => `<g>
      <text x="${cx}" y="40" text-anchor="middle" font-size="12" font-weight="700">${name}</text>
      <path d="${name === 'Cardioid' ? `M${cx} 120 C ${cx - 70} 120, ${cx - 60} 50, ${cx} 50 C ${cx + 60} 50, ${cx + 70} 120, ${cx} 120` : `M${cx} 120 C ${cx - 55} 110, ${cx - 46} 50, ${cx} 50 C ${cx + 46} 50, ${cx + 55} 110, ${cx} 120 C ${cx + 14} 134, ${cx - 14} 134, ${cx} 120`}" fill="var(--accent)" opacity=".2" stroke="var(--accent)" stroke-width="2"/>
      <circle cx="${cx}" cy="120" r="6" fill="var(--bad)"/><circle cx="${cx}" cy="60" r="9" fill="var(--good)"/><text x="${cx}" y="34" text-anchor="middle" font-size="0">.</text>
      ${wedges.map(([dx, dy]) => `<path d="M${cx + dx * 2.2 - 16} ${120 + dy - 20 + 8} h32 l-6 -12 h-20z" fill="var(--text)"/><path class="leak-pulse" d="M${cx + dx * 2.2} ${120 + dy - 26} L${cx + dx * 0.4} 128" stroke="var(--warn)" stroke-width="2" stroke-dasharray="4 4"/>`).join('')}
      <text x="${cx}" y="200" text-anchor="middle" font-size="10" fill="var(--muted)">${note}</text></g>`).join('')}
    <text x="340" y="66" text-anchor="middle" font-size="10" fill="var(--good)">singer</text><text x="340" y="124" text-anchor="middle" font-size="10" fill="var(--bad)">mic</text><text x="340" y="176" text-anchor="middle" font-size="10">wedge</text>
  </svg>`;

  const SVG_IEM = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="In-ear monitoring signal path and latency">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">In-ear monitoring: the chain and its delay budget</text>
    ${[['mic', 'voice'], ['console', 'A/D + mix ≈ 1–2 ms'], ['transmitter', 'analogue ≈ 0 · digital ≈ 1–3 ms'], ['belt-pack', 'limiter'], ['ear-pieces', 'sealed fit']].map(([t, s], i) => { const x = 20 + i * 132; return `<g><rect x="${x}" y="46" width="112" height="56" rx="8" fill="var(--panel2)" stroke="var(--line)"/><text x="${x + 56}" y="70" text-anchor="middle" font-size="11" font-weight="700">${t}</text><text x="${x + 56}" y="88" text-anchor="middle" font-size="8.5" fill="var(--muted)">${s}</text>${i < 4 ? `<path class="leak-pulse" d="M${x + 112} 74 h20" stroke="var(--accent)" stroke-width="2.5"/>` : ''}</g>`; }).join('')}
    <rect x="20" y="124" width="640" height="14" rx="4" fill="var(--good)" opacity=".5"/><rect x="20" y="124" width="150" height="14" rx="4" fill="var(--good)"/><rect x="170" y="124" width="170" height="14" fill="var(--warn)" opacity=".8"/><rect x="340" y="124" width="320" height="14" rx="4" fill="var(--bad)" opacity=".7"/>
    <text x="95" y="156" text-anchor="middle" font-size="10" fill="var(--good)">under ≈ 3 ms: unnoticed</text><text x="255" y="156" text-anchor="middle" font-size="10" fill="var(--warn)">≈ 3–10 ms: singers hear a hollow tone</text><text x="500" y="156" text-anchor="middle" font-size="10" fill="var(--bad)">over ≈ 10 ms: a distinct slap</text>
    <text x="340" y="180" text-anchor="middle" font-size="10" fill="var(--muted)">Your own voice also reaches you through your skull, so the monitor path must stay very short.</text>
  </svg>`;

  /* ============================================================== LESSON A */
  const LA = {
    id: 'm-building-types', n: 'M33', track: 'master', title: 'Acoustics by Building Type: Criteria and Solutions from Offices to Opera Houses', level: 'Core', mins: 60,
    summary: 'What matters acoustically in each kind of building, the typical target ranges, the problems that keep recurring and the solutions that reliably work — with tools for offices, restaurants and halls.',
    tags: ['building types', 'office', 'restaurant', 'classroom', 'hotel', 'hospital', 'cinema', 'theatre', 'concert hall', 'opera', 'stadium', 'variable acoustics', 'speech privacy'],
    sections: [
      { h: 'Four questions for every building', html: `
        <p class="lead">Studios are only one kind of room. The same physics decides whether a classroom teaches, a restaurant is pleasant, a hotel guest sleeps and a concert hall sings — only the priorities and the numbers change.</p>
        ${SVG_FOUR}
        ${flow([['Use', 'who does what, when, how loud?'], ['Criteria', 'noise · insulation · RT · intelligibility'], ['Zoning', 'noisy away from quiet'], ['Construction', 'walls, floors, doors, services'], ['Finishes', 'absorb, reflect, diffuse'], ['Verify', 'measure before handover']])}
        <div class="callout data">All figures in this course are <b>typical guidance</b> drawn from common practice. Real projects follow the client’s brief and the standards and regulations in force locally — check the current editions.</div>
        <p>Browse the room types, filter them, and move the volume slider to see how the recommended reverberation grows with room size.</p>`, viz: 'buildingCriteria' },
      { h: 'How live should it be?', html: `
        ${SVG_RTSCALE}
        <p>Reverberation time is the quickest way to describe a room’s character. Three things set the right value: the <b>use</b> (speech wants clarity, unamplified music wants sustain), the <b>volume</b> (bigger rooms can carry more), and whether sound is <b>amplified</b> (loudspeakers bring their own clarity, so the room should stay out of the way).</p>
        ${tbl(['Use', 'Mid-frequency RT', 'Why'], [['Speech rooms (class, meeting, lecture)', '0.4–1.0 s', 'Consonants must not be smeared by the previous syllable'], ['Amplified music, cinema', '0.3–1.1 s', 'The loudspeakers provide the sound; the room must not add its own'], ['Drama', '0.9–1.3 s', 'Some support for the unamplified voice, still clear'], ['Opera, chamber music', '1.3–1.8 s', 'Text and musical bloom in balance'], ['Symphonic music', '1.8–2.2 s', 'Blend, warmth and envelopment'], ['Organ and choral', '2.2–3+ s', 'Long, seamless sustain']])}
        <div class="callout mentor">Bass reverberation matters as much as the mid-band number: for music a modest rise at low frequencies gives warmth; for speech and amplified sound it gives mud. Always ask for RT in octave bands.</div>` },
      { h: 'Offices: privacy and distraction', html: `
        ${SVG_OFFICE}
        <p>In an open-plan office the problem is not loudness but <b>intelligibility</b>: a colleague’s understandable speech is far more distracting than louder, meaningless noise. Design therefore aims to make speech fall away quickly with distance and to give it something gentle to hide in.</p>
        <ul><li><b>Ceiling first:</b> a highly absorbent ceiling stops the bounce over the screens.</li><li><b>Screens and furniture:</b> ≥ 1.4 m high and absorbent, placed between teams.</li><li><b>Masking sound:</b> a smooth, speech-shaped background around 43–45 dBA shortens the distance at which speech is understood.</li><li><b>Rooms to escape to:</b> phone booths, focus rooms and meeting rooms with real walls and doors.</li></ul>
        <p>For enclosed offices and meeting rooms the issue reverses: speech must stay <b>inside</b>. Partitions that stop at a suspended ceiling leak over the top; doors without seals leak around the edge; ventilation ducts act as speaking tubes unless fitted with crosstalk silencers. Video-conference rooms additionally need a short RT (≈ 0.4–0.6 s) because the far end hears the room through the microphones.</p>`, viz: 'openOffice' },
      { h: 'Restaurants, cafés and bars', html: `
        <p>Dining rooms have a built-in feedback loop: more noise makes people speak up, which makes more noise. Hard fashionable finishes — glass, concrete, tile, an open kitchen — remove the only brake, which is absorption.</p>
        <div class="callout data"><b>Rule of thumb:</b> provide roughly <b>1.5–3 m² of absorption per seat</b> (the higher figure for lively venues), and treat the ceiling first. Aim for the occupied level to stay around or below 70–72 dBA so people can talk across a table without raising their voices.</div>`, viz: 'restaurantNoise' },
      { h: 'Homes, hotels and hospitals', html: `
        ${tbl(['Concern', 'What to specify', 'Typical guidance', 'Usual weak point'], [
          ['Airborne sound between units', 'Separating walls and floors (field rating with a low-frequency term)', '≈ 45–55 dB and above for quality', 'Flanking via façade, floor slab, back-to-back sockets'],
          ['Footsteps and impacts', 'Impact rating of floors (lower is better)', '≈ 50–62 dB; lower for quality', 'Hard floor finishes laid without a resilient layer'],
          ['Bedrooms at night', 'Indoor ambient level', '≈ 25–30 dBA', 'Traffic through windows and vents; plant'],
          ['Plumbing, lifts, doors', 'Maximum levels from building services', '≈ 25–30 dBA in bedrooms', 'Pipes clamped rigidly to light walls; lift motor rooms next to bedrooms'],
          ['Hotel corridors', 'Entrance doors and lobbies', 'door ≈ 30–35 dB', 'Undercut doors, connecting doors'],
          ['Hospital privacy and rest', 'Insulation between consulting rooms; quiet wards', '≈ 45–50 dB; night levels as low as practical', 'Hard washable surfaces, alarms, trolleys']])}
        <div class="uc-grid">
          ${uc('🛏️', 'Hotel next to a bar', [['Problem', 'Bass from the ground-floor bar reaches bedrooms two floors up'], ['Solution', 'Limiter on the sound system, bar ceiling on spring hangers, bedrooms planned away from the bar, lobby doors']])}
          ${uc('🚿', 'Flat with noisy pipes', [['Problem', 'Every flush is heard in the neighbour’s bedroom'], ['Solution', 'Resilient pipe clamps, pipes boxed in two layers of board with wool, no pipes on bedroom walls']], C1)}
          ${uc('🏥', 'Ward that never sleeps', [['Problem', 'Reverberant corridor carries alarms and conversation into bays'], ['Solution', 'Cleanable absorbent ceiling, door closers and seals, alarm volume policy, soft-wheel trolleys']], C3)}
        </div>` },
      { h: 'Schools, lecture halls, music rooms and sports halls', html: `
        <p>Learners — especially young children, people listening in a second language and anyone with a hearing loss — need a much better signal-to-noise ratio than fluent adults: the teacher’s voice should sit at least <b>15 dB above the background</b>. That needs both a short RT and a quiet room.</p>
        ${tbl(['Space', 'Reverberation', 'Background noise', 'Key moves'], [
          ['Classroom', '≈ 0.4–0.8 s (shorter for small rooms and for inclusive design)', '≤ 35 dBA', 'Absorbent ceiling, absorbent rear wall, quiet ventilation'],
          ['Lecture hall', '≈ 0.7–1.0 s', 'NC 25–30', 'Reflective zone above the lecturer, absorbent rear wall, raked seating, speech system'],
          ['Music practice room', '≈ 0.4–0.8 s, ideally adjustable', 'NC 25', 'Heavy or box-in-box walls, lobby doors, some diffusion so it is not dead'],
          ['Ensemble / rehearsal room', '≈ 0.8–1.4 s with enough volume', 'NC 25', 'High ceiling (loudness control), curtains for adjustment'],
          ['Sports hall / pool', 'as low as practical (≈ 1.5–2 s)', 'NC 40–45', 'Robust, moisture-proof absorbers high on walls and roof']])}
        <div class="callout warn">The classic school mistake is the exposed concrete ceiling chosen for thermal mass. Without compensating absorption (hanging baffles, wall panels) the classrooms beneath are unusable for teaching.</div>` },
      { h: 'Worship, cinemas and theatres', html: `
        <div class="uc-grid">
          ${uc('⛪', 'Place of worship', [['Matters', 'Clear speech <i>and</i> generous music — opposite needs'], ['Typical', 'RT from ≈ 1.2 s (speech-led) to 2.5 s+ (organ/choral)'], ['Solution', 'Keep the volume for music; give speech its own clarity with slim, steerable column loudspeakers aimed at the congregation, plus an induction loop']])}
          ${uc('🎬', 'Multiplex cinema', [['Matters', 'Very high insulation between screens; dry, even room; low noise'], ['Typical', 'RT ≈ 0.3–0.6 s, flat with frequency; NC 25–30; ≈ 65–70 dB between screens'], ['Solution', 'Independent double walls and floated structures, absorbent wall linings, baffle wall behind the screen']], C1)}
          ${uc('🎭', 'Drama theatre', [['Matters', 'The unamplified voice to the back row'], ['Typical', 'RT ≈ 0.9–1.3 s; NC 20–25; furthest seat ≈ 20 m'], ['Solution', 'Compact plan, reflecting surfaces near the stage, quiet displacement ventilation']], C2)}
        </div>
        <p>Sight lines and sound lines go together: if a listener can see the performer’s mouth without obstruction, the direct sound arrives. Raked seating and balconies with a shallow overhang (depth no more than about its opening height) keep every seat in the direct field.</p>` },
      { h: 'Concert halls, opera and multipurpose halls', html: `
        ${SVG_HALL}
        ${tbl(['Hall', 'RT (occupied, mid)', 'Volume per seat', 'Character'], [['Speech / conference', '0.8–1.2 s', '3–5 m³', 'Clarity first'], ['Opera', '1.3–1.8 s', '6–9 m³', 'Singers heard over the pit; text understood'], ['Chamber music', '1.4–1.8 s', '6–9 m³', 'Intimacy and detail'], ['Symphonic', '1.8–2.2 s', '8–12 m³', 'Warmth, blend, envelopment from side reflections'], ['Multipurpose', '1.0–2.0 s variable', 'built for the longest use', 'Changed by devices, not by hope']])}
        <p>Because volume cannot be added afterwards, a multipurpose hall is built for its most reverberant use and <b>tamed</b> for the others with retractable banners and curtains; a stage shell projects an orchestra forward from a fly tower; an orchestra pit can be covered to extend the stage. Where the building is too small or dry, electronic enhancement systems add controlled late energy.</p>
        <p>More on hall geometry: <a href="#/academy/halls">Concert Halls &amp; Auditoria</a> and <a href="#/academy/m-large-rooms">Large-Room Acoustics</a>.</p>`, viz: 'hallRT' },
      { h: 'Stadiums, stations, atria and workshops', html: `
        <div class="uc-grid">
          ${uc('🏟️', 'Stadium / outdoor event', [['Matters', 'Intelligible announcements over 100 dBA crowd noise; neighbours'], ['Problems', 'Echoes from far stands, wind and temperature bending sound, community limits'], ['Solution', 'Many loudspeakers close to and aimed down at the seats, delays aligned, bass arrays steered away from housing, monitoring at the boundary']])}
          ${uc('🚉', 'Station concourse / atrium', [['Matters', 'Voice-alarm messages must be understood'], ['Problems', 'RT of 3–5 s from glass and stone'], ['Solution', 'Absorption wherever it can hide (soffits, baffles), many directional loudspeakers at low level, verified by measurement']], C3)}
          ${uc('🏭', 'Factory / workshop', [['Matters', 'Hearing damage; warning signals audible'], ['Problems', 'Machines above 85 dBA all shift'], ['Solution', 'Quieter process first, then enclosures and barriers, absorbent ceilings to cut build-up, hearing protection as the last line']], C2)}
        </div>
        <div class="callout safety">Noise at work is regulated. Where daily exposure approaches about 80–85 dBA, employers must assess it, reduce it at source where practicable and provide hearing protection — check the limits and duties that apply in your country.</div>` },
      { h: 'Master comparison table', html: `
        ${tbl(['Building', 'Noise', 'Insulation', 'Reverberation', 'Intelligibility', 'The recurring mistake'], [
          ['Open-plan office', '●●', '●', '●●●', 'low wanted', 'Hard ceiling, no quiet rooms'],
          ['Meeting / VC room', '●●', '●●●', '●●●', '●●●', 'Partition stops at the ceiling tile'],
          ['Restaurant', '●●●', '●●', '●●●', '●●', 'All hard finishes'],
          ['Dwelling / hotel', '●●●', '●●●', '●', '—', 'Services fixed rigidly; flanking ignored'],
          ['Hospital', '●●●', '●●●', '●●', '●●', 'No cleanable absorption'],
          ['Classroom', '●●●', '●●', '●●●', '●●●', 'Exposed slab, noisy ventilation'],
          ['Cinema', '●●●', '●●●', '●●●', '●●', 'Shared structure between screens'],
          ['Theatre / opera', '●●●', '●●●', '●●●', '●●●', 'Plant noise; deep balcony overhangs'],
          ['Concert hall', '●●●', '●●●', '●●●', '—', 'Too little volume per seat'],
          ['Stadium / concourse', '●', '●● (neighbours)', '●●', '●●●', 'A few loud loudspeakers far away']])}
        <p class="small muted">●●● critical · ●● important · ● secondary.</p>` },
      { h: 'The first three questions on any project — and a checklist', html: `
        ${flow([['What is the loudest thing?', 'inside and outside — and when'], ['What is the quietest need?', 'sleep, recording, concentration'], ['How close are they?', 'distance and zoning cost nothing on paper']])}
        ${myth([
          ['“Acoustics is about finishes; we’ll add panels at the end.”', 'Noise and insulation are decided by layout, structure and services. Panels fix reverberation only.'],
          ['“A thicker wall will stop the noise.”', 'Not if the sound goes round it: floors, ceilings voids, ducts, doors and façades usually set the limit.'],
          ['“Carpet makes a room quiet.”', 'It helps footsteps and high frequencies. Speech-band reverberation needs a ceiling or wall area.'],
          ['“Loudspeakers will fix a reverberant hall.”', 'More level into a reverberant room gives louder mush. Directional sources and absorption fix it.'],
        ])}
        <ul><li>Criteria written down and agreed for all four questions, per room.</li><li>Noisy and quiet rooms separated by buffer spaces on plan and section.</li><li>Every wall, floor, door, window and service penetration rated to the criteria.</li><li>Reverberation calculated in octave bands with the real furnishings and audience.</li><li>Ventilation noise and plant vibration designed, not assumed.</li><li>Measurements at completion: noise, insulation, RT and — where speech matters — STI.</li></ul>
        <p>Related: <a href="#/academy/criteria">Background Noise &amp; Criteria</a> · <a href="#/academy/m-standards">Standards Explained</a> · <a href="#/academy/m-building-services">Building Services Noise</a> · <a href="#/academy/a-intelligibility">Speech Intelligibility</a>.</p>` },
    ],
    quiz: [
      { q: 'In an open-plan office, what is the main acoustic aim?', opts: ['Make it as quiet as possible', 'Make distant speech unintelligible', 'Increase reverberation', 'Maximise insulation between desks'], a: 1, why: 'Understandable speech distracts; absorption, screens and masking shorten the distraction distance.' },
      { q: 'Why does a restaurant with hard finishes get so loud?', opts: ['The kitchen', 'People raise their voices as noise rises, with little absorption to stop the spiral', 'Too many windows', 'Music only'], a: 1, why: 'The Lombard effect: about half a decibel more voice for each decibel of noise.' },
      { q: 'A hall must serve both conference speech and symphony concerts. Build it for…', opts: ['Speech, then add reverberation with curtains', 'The symphonic volume, then reduce reverberation with variable absorption', 'Neither', 'The average'], a: 1, why: 'Volume cannot be added later; reverberation can be removed.' },
      { q: 'A teacher’s voice should be about how far above the background noise?', opts: ['0 dB', '5 dB', '15 dB or more', '40 dB'], a: 2, why: 'Learners need a generous signal-to-noise ratio.' },
      { q: 'Meeting-room privacy is usually lost through…', opts: ['The table', 'The partition stopping at the suspended ceiling, doors and ducts', 'The carpet', 'The lighting'], a: 1, why: 'Sound takes the weakest path: over, round and through services.' },
    ],
  };

  /* ============================================================== LESSON B */
  const LB = {
    id: 'm-building-services', n: 'M34', track: 'master', title: 'Building Services and Equipment Noise, and an Acoustic Project from Brief to Handover', level: 'Core', mins: 50,
    summary: 'How fans, chillers, pumps, lifts and users’ equipment get into quiet rooms and how to stop them — then the acoustic work at each stage of a building project, the documents involved and the failures found on site.',
    tags: ['plant noise', 'vibration isolation', 'duct noise', 'crosstalk', 'inertia base', 'mixed use', 'commissioning', 'specification', 'site inspection'],
    sections: [
      { h: 'One machine, five paths', html: `
        <p class="lead">Mechanical and electrical equipment is the commonest reason a finished room misses its noise target. The cure is rarely a single product: every machine reaches people by several paths, and the loudest untreated one decides the result.</p>
        ${SVG_PATHS}
        ${tbl(['Path', 'What it is', 'Main control'], [['① Airborne', 'Sound through the plant-room walls, floor and doors', 'Heavy construction, sealed doors, distance'], ['② Duct-borne', 'Fan noise travelling inside the ductwork', 'Attenuators, lined ducts, bends'], ['③ Structure-borne', 'Vibration through mounts, pipes and slabs, re-radiated as a hum', 'Isolators, inertia bases, flexible connections'], ['④ Break-out / break-in', 'Sound passing through the thin duct wall', 'Lagging, round ducts, routing away from quiet rooms'], ['⑤ Regenerated', 'Turbulence at dampers, bends and grilles', 'Low velocity, dampers far from outlets, big grilles']])}
        <div class="callout mentor">Start from the manufacturer’s <b>sound power</b> data in octave bands — not a single “dB at 1 m” figure — and insist on it before equipment is ordered.</div>` },
      { h: 'Equipment by equipment', html: `
        ${tbl(['Equipment', 'Character', 'Typical control'], [
          ['Fans and air-handling units', 'Broadband plus blade tones; duct-borne', 'Efficient selection at low speed; attenuators both sides; flexible connections; isolators'],
          ['Chillers and heat pumps', 'Compressor tones, fan noise, strong at night', 'Quiet/night mode; location; barriers or enclosures; spring mounts'],
          ['Pumps and pipework', 'Low-frequency hum, structure-borne', 'Inertia base on springs; flexible connectors; spring pipe hangers for the first 15 m'],
          ['Boilers and flues', 'Combustion rumble, flue resonance', 'Flue silencer; isolate from light structures'],
          ['Lifts', 'Motor, guide rails, door operators', 'Machinery away from bedrooms; isolated rails and motor room'],
          ['Transformers and switchgear', '100/120 Hz hum and harmonics', 'Isolation pads; heavy enclosure; not under quiet rooms'],
          ['Standby generators', 'Very loud: engine, exhaust, radiator fan', 'Acoustic enclosure, exhaust silencers, attenuated air paths, spring mounts'],
          ['Drainage and water', 'Flow, flush, water hammer', 'Resilient clamps, heavy boxed stacks, pressure-reducing valves, arrestors']])}` },
      { h: 'Plant-room location and construction', html: `
        <ul><li><b>Zone first:</b> place plant at ground level or on stiff structure near columns, away from bedrooms, studios and auditoria. A plant room on a long-span roof above a quiet room is the hardest case.</li><li><b>Buffer:</b> put stores, corridors and toilets between plant and quiet rooms.</li><li><b>Envelope:</b> dense walls and floor (often with a floating floor), sealed doors, every pipe and duct penetration sleeved and sealed.</li><li><b>Inside:</b> absorbent lining lowers the build-up by several decibels and makes the room safer to work in.</li></ul>
        ${SVG_ISO}` },
      { h: 'Vibration isolation in plain words', html: `
        <p>An isolator is a spring: the softer it is under the machine’s weight (the more it <b>deflects</b>), the lower its resonance and the more it isolates. Isolation only works well above the mount’s resonance, so slow machines need soft springs.</p>
        ${tbl(['Machine speed', 'Disturbing frequency', 'Typical static deflection', 'Mount'], [['3 000 rpm', '50 Hz', '≈ 5–10 mm', 'Rubber or small springs'], ['1 500 rpm', '25 Hz', '≈ 12–25 mm', 'Steel springs'], ['750 rpm', '12.5 Hz', '≈ 25–50 mm', 'Deep springs'], ['300–500 rpm (large fans)', '5–8 Hz', '≈ 50–75 mm+', 'Deep springs, engineered']])}
        <div class="callout physics">Resonance ≈ 15.8 / √(deflection in mm) Hz. Aim for the resonance to be no more than about a third of the machine’s lowest running frequency — and remember the supporting floor is a spring too: on long-span floors use larger deflections.</div>
        <p>An <b>inertia base</b> (a concrete block 1–2 times the machine’s mass, sitting on the springs) keeps pumps and fans stable and lowers the centre of gravity. <b>Flexible connectors</b> on pipes, ducts and cables stop them bridging the isolators. See <a href="#/academy/vibration">Vibration &amp; Structure-borne Sound</a>.</p>` },
      { h: 'Ducts, crosstalk and air noise', html: `
        <ul><li><b>Attenuators</b> immediately after the fan, before the duct leaves the plant room.</li><li><b>Velocity:</b> the further along the system, the slower the air — noise from turbulence rises very steeply with speed.</li><li><b>Crosstalk:</b> two rooms on the same duct talk to each other. Separate branches, or a crosstalk attenuator between them, sized to match the partition.</li><li><b>Dampers</b> well upstream of grilles (several duct diameters), never directly behind them.</li><li><b>Break-out:</b> a main duct over a quiet ceiling needs lagging or re-routing.</li></ul>
        <p>Design method and numbers: <a href="#/academy/m-hvac">Heating, Ventilation &amp; Air Conditioning</a>.</p>` },
      { h: 'Users’ equipment and mixed-use buildings', html: `
        <div class="uc-grid">
          ${uc('🍳', 'Kitchen extract', [['Problem', 'Roof fan drones into flats; duct runs up the façade'], ['Solution', 'Low-speed fan selection, attenuators, isolated fan, discharge away from windows']])}
          ${uc('🏋️', 'Gym above offices', [['Problem', 'Dropped weights and treadmills thump through the slab'], ['Solution', 'Heavy floating floor or thick impact tiles in free-weight zones; gym at ground level where possible']], C2)}
          ${uc('🧺', 'Laundry / plant in a residential block', [['Problem', 'Spin cycles shake the floor'], ['Solution', 'Machines on isolated plinths, flexible hoses, room off the party wall']], C3)}
          ${uc('🎶', 'Bar or venue under dwellings', [['Problem', 'Bass and structure-borne sound upstairs at night'], ['Solution', 'Box-in-box venue, lobbied entrance, sound limiter tied to the house system, loudspeakers decoupled, management plan']], C5)}
          ${uc('📺', 'AV in a hotel meeting suite', [['Problem', 'Presentations heard in the next room through the folding wall'], ['Solution', 'Rated operable wall with seals and ceiling barrier above; level limits']], C1)}
        </div>` },
      { h: 'Outdoor plant and the neighbours', html: `
        <p>Outside, sound falls about 6 dB for each doubling of distance, a wall behind the unit adds a few decibels, and a barrier helps only if it clearly breaks the line of sight. Assessments usually compare a <b>rating level</b> at the neighbour’s window — the plant level plus penalties for tonal, impulsive or intermittent character — with the existing <b>background</b> level at the quietest time the plant will run.</p>`, viz: 'plantNoise' },
      { h: 'The acoustic project, stage by stage', html: `
        ${SVG_STAGES}
        ${tbl(['Stage', 'Acoustic work', 'Output'], [
          ['Brief', 'Agree uses and criteria room by room', 'Acoustic brief / criteria schedule'],
          ['Site survey', 'Measure ambient noise and vibration, day and night', 'Survey report; façade and isolation needs'],
          ['Concept', 'Zoning, adjacencies, volumes, structural strategy', 'Marked-up plans and sections'],
          ['Detailed design', 'Constructions, details, services noise calculations, room acoustics', 'Specification clauses, performance schedules, details'],
          ['Tender', 'Check alternatives offered by bidders', 'Technical review'],
          ['Construction', 'Site inspections before close-up; witness tests of mock-ups', 'Inspection notes, defect lists'],
          ['Commissioning', 'Measure noise, insulation, RT, STI as required', 'Test certificates'],
          ['Handover', 'Explain how to use and maintain the acoustic features', 'Completion report and manuals']])}` },
      { h: 'Who is responsible for what', html: `
        ${tbl(['Party', 'Owns'], [['Client', 'The brief: what each room is for and how good it must be'], ['Architect', 'Layout, zoning, constructions and finishes that meet the criteria'], ['Acoustic consultant', 'Criteria, calculations, details, review and testing'], ['Structural engineer', 'Loads of heavy and floating constructions, vibration response'], ['Services (M&amp;E) engineer', 'Equipment selections, attenuators, isolators, velocities'], ['Contractor and trades', 'Workmanship: sealing, isolation gaps, no bridging'], ['Commissioning team', 'Balancing air and water so the design noise levels are achieved']])}
        <div class="callout warn">The most valuable hour on any project is the inspection <b>before ceilings and walls are closed</b>. After that, defects are invisible until the test fails.</div>` },
      { h: 'Failures found on site — and their fixes', html: `
        ${tbl(['Found on site', 'Effect', 'Fix'], [
          ['Isolators locked by transit bolts or debris under the base', 'No isolation at all', 'Release bolts, clear the gap, check free movement'],
          ['Rigid conduit or pipe bridging a sprung machine', 'Hum throughout the building', 'Flexible loops and connectors'],
          ['Attenuator omitted or fitted the wrong way round', 'Fan noise at every grille', 'Install as designed before commissioning'],
          ['Partition not sealed at the head or behind services', 'Speech privacy lost', 'Fill and seal; ceiling-void barrier'],
          ['Back-to-back sockets in a separating wall', 'Local leak', 'Offset boxes, putty pads'],
          ['Floating floor bridged by screed at the perimeter', 'Impact rating fails', 'Cut the bridge, restore the isolation strip'],
          ['System never balanced', 'Whistling grilles and dampers', 'Commission; replace undersized grilles'],
          ['Absorbent ceiling value-engineered to plain plasterboard', 'Reverberant, loud room', 'Add baffles, rafts or wall panels']])}` },
      { h: 'Worked example: a studio beneath flats', html: `
        ${flow([['Brief', 'rehearsal/recording studio at ground floor; bedrooms above'], ['Criteria', 'bedrooms ≤ 25–30 dBA and music inaudible; studio NC 20'], ['Survey', 'slab thickness, background at night, existing services'], ['Concept', 'box-in-box room on a floating floor, lobby entrance'], ['Services', 'silenced fresh-air system, condensers on isolators facing away from windows'], ['Inspect', 'isolation gaps, no bridging, penetrations sealed'], ['Test', 'insulation to the flat above, plant noise at windows, room noise']])}
        <div class="callout example">Loud band at 105 dBA in the studio; target in the bedroom about 20 dBA at mid frequencies and no more than the background in the bass. That is roughly 80 dB of mid-frequency isolation — beyond any single slab, so the design relies on an independent inner room, and on agreed <b>operating limits</b> for the lowest octaves that no practical construction can fully contain.</div>
        <p>Related: <a href="#/academy/m-iso-basics">Isolation Fundamentals</a> · <a href="#/academy/m-playbook">The Studio Design Playbook</a> · <a href="#/academy/m-building-types">Acoustics by Building Type</a>.</p>` },
    ],
    quiz: [
      { q: 'A pump hum is heard three floors away but not in the room next to the plant room. The path is most likely…', opts: ['Airborne through the wall', 'Structure-borne through pipes and slab', 'Regenerated at grilles', 'Through the door'], a: 1, why: 'Vibration travels far in structure with little loss and re-radiates.' },
      { q: 'Slower machines need isolators with…', opts: ['Less deflection', 'More deflection', 'No deflection', 'Rubber only'], a: 1, why: 'Lower disturbing frequency needs a lower mount resonance: softer springs.' },
      { q: 'Two offices share a ventilation branch and conversations pass between them. This is…', opts: ['Break-out', 'Crosstalk', 'Regenerated noise', 'Flanking via the floor'], a: 1, why: 'The duct is a speaking tube; fit a crosstalk attenuator or separate branches.' },
      { q: 'When is the most useful acoustic site inspection?', opts: ['After handover', 'Before walls and ceilings are closed', 'During demolition', 'Never'], a: 1, why: 'Bridging, missing seals and missing insulation are visible only then.' },
      { q: 'Outdoor plant is usually assessed by comparing…', opts: ['Its sound power with a fixed limit', 'A rating level at the neighbour with the existing background level', 'Its weight with the roof load', 'Its airflow with the duct size'], a: 1, why: 'Level plus character penalties versus background at the relevant time.' },
    ],
  };

  /* ============================================================== LESSON C */
  const LC = {
    id: 'a-intelligibility', n: 'A13A', track: 'audio', title: 'Designing for Speech Intelligibility, Voice Alarm and Assistive Listening', level: 'Advanced', mins: 50,
    summary: 'What makes speech understandable, how it is measured (STI), which design decisions move it, how voice-alarm systems are engineered, and how loops, infrared and radio systems help people with hearing loss.',
    tags: ['speech intelligibility', 'STI', 'STIPA', 'ALcons', 'C50', 'voice alarm', 'induction loop', 'assistive listening', 'directivity', 'critical distance'],
    sections: [
      { h: 'What makes speech intelligible', html: `
        <p class="lead">Speech is a stream of rapid level changes — syllables a few times a second, consonants lasting tens of milliseconds. Anything that fills in the gaps between them destroys meaning. There are only two culprits: <b>noise</b> and <b>late-arriving sound</b>.</p>
        ${SVG_DR}
        ${tbl(['Factor', 'Effect', 'Design lever'], [['Signal-to-noise ratio', 'Below about +10 dB words start to be lost; above +15 dB little more is gained', 'Enough level, quieter room'], ['Reverberation / late energy', 'Each syllable masks the next', 'Absorption; keep sound off walls and ceiling'], ['Direct-to-reverberant ratio', 'Decides clarity beyond the critical distance', 'Directional loudspeakers, shorter distances'], ['Echoes (> ≈ 50 ms, strong)', 'Heard as repeats', 'Delay alignment, absorb rear walls'], ['Bandwidth', 'Consonants live around 1–4 kHz', 'Flat response 250 Hz–6 kHz at least'], ['Distortion and limiting', 'Smears consonants', 'Headroom'], ['Talker and listener', 'Fast speech, accents, hearing loss, second language', 'Slower messages, higher targets']])}` },
      { h: 'Measuring it: STI, %ALcons and C50', html: `
        ${SVG_STISCALE}
        <p>The <b>Speech Transmission Index</b> (IEC 60268-16) asks one question: how well do the level fluctuations of speech survive the trip from talker to listener? Noise and reverberation both flatten those fluctuations; STI converts the loss into a number from 0 to 1. <b>STIPA</b> is the practical field version: a test signal played through the system and a hand-held meter.</p>
        ${tbl(['Measure', 'What it is', 'Good values'], [['STI / STIPA', 'Preservation of speech modulation, 0–1', '≥ 0.50 voice alarm (typical requirement); ≥ 0.60 teaching and conference'], ['%ALcons', 'Estimated percentage of consonants lost', '< 10 % good; > 15 % poor'], ['C50', 'Early (first 50 ms) to late energy, dB', '> 0 dB acceptable; > +3 dB good']])}
        <div class="callout data">These bands are typical guidance. The qualification an STI value needs depends on the application and the standard in force — check the current edition and any local code.</div>` },
      { h: 'Try it: what moves the number', html: `
        <p>Start with the default reverberant hall and try to reach 0.50. Then change one thing at a time: directivity, distance, number of loudspeakers, reverberation, noise.</p>`, viz: 'stiEstimator' },
      { h: 'Design moves that work', html: `
        <div class="uc-grid">
          ${uc('🎯', 'Directivity and aiming', [['Do', 'Use loudspeakers that put sound on the audience and nothing on walls or ceiling; aim down from above'], ['Why', 'Higher Q raises the direct-to-reverberant ratio everywhere']])}
          ${uc('📏', 'Distance', [['Do', 'Keep listeners within about two to three critical distances of a loudspeaker'], ['Why', 'Beyond that the reverberant field dominates']], C1)}
          ${uc('🔁', 'Distributed systems done right', [['Do', 'Many small units close to listeners, each covering only its patch, turned down, with delays set to the main source'], ['Why', 'Each listener gets direct sound; overlap and excess level only feed reverberation']], C2)}
          ${uc('⏱️', 'Delay alignment', [['Do', 'Delay fill loudspeakers so their sound arrives just after the main source (within ≈ 10–20 ms)'], ['Why', 'Avoids echoes and keeps the image at the talker']], C3)}
          ${uc('🧱', 'Absorption', [['Do', 'Treat the surfaces the loudspeakers illuminate first, and the wall facing the main source'], ['Why', 'Halving RT is worth more than any amplifier']], C4)}
          ${uc('🔇', 'Noise', [['Do', 'Quieter ventilation; ambient-sensing level control in variable-noise spaces'], ['Why', 'Keeps the +10–15 dB margin without shouting']], C5)}
        </div>
        <div class="callout warn">Turning the system up is not a fix. Above roughly 85–90 dBA intelligibility stops improving and then falls, and the reverberant level rises exactly as much as the direct sound.</div>` },
      { h: 'Estimating before you build', html: `
        <div class="formula"><span class="lbl">Critical distance</span>D<sub>c</sub> ≈ 0.057 · √(Q · V / RT) &nbsp;·&nbsp; divide by √N for N similar loudspeakers</div>
        <div class="formula"><span class="lbl">Consonant loss (classic estimate)</span>%ALcons ≈ 200 · D² · RT² · N / (V · Q) for D ≤ 3.2·D<sub>c</sub>; beyond that ≈ 9 · RT</div>
        <p>In words: intelligibility improves with a bigger room for the same RT, more directivity and shorter RT; it worsens with the <i>square</i> of distance and of reverberation time, and with every extra loudspeaker that is not serving the listener. Use these for early comparison, then model, then measure. Loudspeaker choices: <a href="#/academy/a-loudspeakers">Loudspeaker Systems &amp; Arrays</a> and <a href="#/academy/a-pa-design">Designing a PA for a Venue</a>.</p>` },
      { h: 'Worked example: a reverberant hall', html: `
        ${tbl(['Step', 'Situation', 'Estimated STI'], [['As found', '6 000 m³, RT 2.5 s, two wide boxes (Q ≈ 5) 12 m from the seats, noise 55 dBA', '≈ 0.40 — poor'], ['Turn it up', 'Same, +6 dB', 'unchanged: direct and reverberant rise together'], ['Column arrays', 'Q ≈ 12–30 aimed at the seating', '≈ 0.50–0.55'], ['Move closer', 'Delayed fills 6 m from the rear rows', '≈ 0.55–0.60'], ['Add absorption', 'RT down to 1.6 s', '≈ 0.60–0.65 — good']])}
        <div class="callout example">The order of effectiveness is almost always: aim and directivity → distance → absorption → noise. Equalisation is the final polish, not the cure.</div>` },
      { h: 'Voice-alarm and emergency sound systems', html: `
        <p>A voice-alarm system replaces bells and sounders with spoken instructions, which evacuate people faster and more calmly. Because lives depend on it, it is engineered to a much stricter standard than a paging system (EN 54 and ISO 7240 series, with national codes of practice).</p>
        ${tbl(['Feature', 'What it means'], [['Zones', 'Separate loudspeaker circuits so messages can be phased floor by floor'], ['Redundancy', 'Standby amplifiers; A/B loudspeaker circuits so one fault does not silence a zone'], ['Monitoring', 'Continuous supervision of amplifiers, lines and microphones, with fault reporting'], ['Secondary power', 'Batteries sized for standby plus alarm duration'], ['Constant-voltage lines', '100 V or 70 V distribution with fire-rated cable and enclosures'], ['Interface', 'Triggered by the fire-detection system; firefighter’s microphone has priority'], ['Intelligibility', 'Verified by measurement in each acoustically different area, with realistic noise']])}
        <div class="callout safety">Life-safety systems must be designed, installed, commissioned and maintained by qualified specialists to the codes in force, and approved by the responsible authority. Use this course to understand and brief them — not to replace them.</div>` },
      { h: 'Assistive listening: loops, infrared and radio', html: `
        ${SVG_LOOP}
        <p>Hearing aids amplify everything, including reverberation and noise. Assistive systems solve this by delivering the programme <b>directly</b> — in effect giving the listener a seat one metre from the talker.</p>
        ${tbl(['System', 'How it works', 'Strengths', 'Watch out for'], [
          ['Induction loop', 'Audio current in a loop cable creates a magnetic field picked up by the hearing aid’s telecoil', 'No receiver to borrow; discreet; works with most hearing aids', 'Metal in the floor weakens the field; spill into neighbouring rooms; needs correct field strength and flat response (IEC 60118-4)'],
          ['Phased-array loop', 'Two overlapping loop patterns driven out of phase', 'Even coverage, low spill, copes with metal', 'Design and commissioning skill'],
          ['Infrared', 'Modulated light to body-worn receivers', 'Private (does not pass walls); many channels', 'Needs line of sight; receivers to issue, charge and clean; sunlight'],
          ['Radio (FM / digital)', 'Low-power transmitter to receivers', 'Portable, covers large and outdoor areas', 'Licensing and interference; not private'],
          ['Wi-Fi / broadcast audio to phones', 'Stream to the listener’s own device and hearing aids', 'No receivers to manage', 'Latency must be very low for live speech; depends on the user’s device']])}
        <ul><li>Feed the system a clean, close-miked mix — not a room microphone.</li><li>Sign it clearly, train staff, and test regularly with a listener.</li><li>Tour-guide and interpretation systems use the same radio or infrared technology with multiple channels.</li></ul>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🚉', 'Station concourse', [['Problem', 'RT 4 s, announcements unintelligible'], ['Solution', 'Soffit absorption, many small directional units at 4–5 m height, ambient level sensing; STIPA verified per zone']])}
          ${uc('⛪', 'Stone church', [['Problem', 'Spoken word lost beyond the fifth row'], ['Solution', 'Slim steerable columns at the front, delayed pair half-way, loop system for the front pews']], C1)}
          ${uc('🏫', 'Lecture theatre', [['Problem', 'Rear rows and hearing-aid users struggle'], ['Solution', 'Ceiling reflectors, absorbent rear wall, lecturer’s headset mic, infrared or loop system']], C4)}
          ${uc('🏬', 'Shopping mall voice alarm', [['Problem', 'Glass atrium, variable crowd noise'], ['Solution', 'Zoned system, dense loudspeaker layout, automatic level control, absorption in soffits']], C2)}
          ${uc('🏟️', 'Sports hall', [['Problem', 'Coaching and emergency messages blur'], ['Solution', 'Robust wall and roof absorbers; four to six horns aimed at the floor and seating']], C3)}
        </div>` },
      { h: 'Mistakes, problems and a checklist', html: `
        ${tbl(['Problem', 'Likely cause', 'Solution'], [['Loud but not clear', 'Reverberant field dominates', 'More directivity, closer sources, absorption'], ['Clear near, lost at the back', 'One source covering too far', 'Delayed fills; arrays'], ['Echo from the rear wall', 'Strong late reflection', 'Absorb or tilt the wall; aim away'], ['Hollow, phasey sound', 'Overlapping loudspeakers not aligned', 'Delay alignment; reduce overlap'], ['Fine when empty, poor when full', 'Crowd noise', 'Ambient-sensing gain, more headroom'], ['Loop users hear a buzz', 'Mains interference or poor loop layout', 'Survey background field; re-route']])}
        ${myth([['“More loudspeakers means better intelligibility.”', 'Only if each serves its own listeners. Extra, overlapping sources add reverberation.'], ['“Equalisation can fix a reverberant room.”', 'EQ shapes tone; it cannot remove late energy.'], ['“If it sounds fine to the installer, it passes.”', 'Trained ears in an empty room are a poor test. Measure STIPA with realistic noise.']])}
        <ul><li>Target STI agreed per area, with the noise level it must be met in.</li><li>Room RT known or predicted in octave bands.</li><li>Loudspeakers chosen by directivity and aimed on a drawing.</li><li>Delays, levels and EQ commissioned; STIPA measured and recorded.</li><li>Assistive-listening system specified, signed, and tested with users.</li></ul>
        <p>Related: <a href="#/academy/m-building-types">Acoustics by Building Type</a> · <a href="#/academy/a-feedback">Feedback &amp; Live Mic Technique</a> · <a href="#/academy/a-monitoring">Stage Monitoring</a>.</p>` },
    ],
    quiz: [
      { q: 'A reverberant hall sounds loud but unclear. Turning the system up will…', opts: ['Fix it', 'Change nothing useful: direct and reverberant sound rise together', 'Lower the reverberation', 'Increase directivity'], a: 1, why: 'The direct-to-reverberant ratio is unchanged by level.' },
      { q: 'An STI of 0.52 is rated…', opts: ['Bad', 'Poor', 'Fair', 'Excellent'], a: 2, why: 'Fair is 0.45–0.60; many voice-alarm requirements sit at 0.50.' },
      { q: 'Which change most improves intelligibility in a reverberant space?', opts: ['A bigger amplifier', 'More directional loudspeakers aimed at the listeners', 'More bass', 'Wider coverage'], a: 1, why: 'Higher directivity puts energy on people instead of walls.' },
      { q: 'What does a hearing aid’s telecoil pick up?', opts: ['Infrared light', 'The magnetic field from an induction loop', 'Radio waves', 'Ultrasound'], a: 1, why: 'The loop current creates a magnetic field carrying the audio.' },
      { q: 'Why choose infrared over a loop for adjacent cinema screens?', opts: ['It is louder', 'It does not spill through walls', 'It needs no receivers', 'It works in sunlight'], a: 1, why: 'Light is contained by the room, so programmes stay private.' },
    ],
  };

  /* ============================================================== LESSON D */
  const LD = {
    id: 'a-monitoring', n: 'A13B', track: 'audio', title: 'Stage Monitoring, In-Ear Systems and Production Intercom', level: 'Core', mins: 45,
    summary: 'Why performers need monitors, how to place wedges and fills for the most level before feedback, how in-ear systems change the stage, how to protect hearing — and how the crew talks to each other during a show.',
    tags: ['stage monitors', 'wedge', 'side-fill', 'in-ear monitors', 'IEM', 'latency', 'gain before feedback', 'hearing protection', 'intercom', 'talkback'],
    sections: [
      { h: 'Why performers need monitors', html: `
        <p class="lead">The main PA points away from the stage. Without their own feed, performers hear a delayed, bass-heavy wash from the room and cannot pitch, keep time or balance with each other. A monitor mix gives each performer what <i>they</i> need — usually “more me”, plus time (drums, click) and pitch (bass, keys).</p>
        ${flow([['Lower the stage', 'quiet backline first'], ['Choose the type', 'wedges, fills or in-ears'], ['Place in the nulls', 'of each vocal mic'], ['Ring out', 'find and cut feedback frequencies'], ['Build mixes', 'only what each player needs'], ['Protect ears', 'limiters and sensible levels']])}
        <p>Compare the options: change the stage level and watch what happens to the ear level, the spill into the vocal microphone and the daily noise dose.</p>`, viz: 'monitorCompare' },
      { h: 'Wedges, side-fills and drum fills', html: `
        ${SVG_NULLS}
        ${tbl(['Monitor', 'Use', 'Placement'], [['Floor wedge', 'Individual mix for a singer or player', 'In the microphone’s null, aimed at the ears, as close as practical'], ['Side-fills', 'Full-band wash across a large stage', 'Stage left and right, aimed across, time-aligned if possible'], ['Drum fill / sub', 'Kick and bass for the drummer', 'Beside or behind the stool; a tactile “thumper” can replace a sub'], ['Hot-spot / personal monitor', 'Small speaker on a mic stand', 'Very close, so it can be quiet']])}
        <div class="callout data"><b>Rules of thumb.</b> Halving the distance from wedge to ear gives 6 dB more for the performer with no more spill. Every open vocal microphone lowers the feedback margin (about 3 dB per doubling). Cut, don’t boost, when equalising a wedge.</div>` },
      { h: 'Gain before feedback on stage', html: `
        <p>Feedback starts when the monitor’s sound re-enters the microphone as loud as the voice did. The margin comes from four things: the singer staying <b>close to the mic</b>, the wedge sitting in the mic’s <b>null</b>, a <b>smooth</b> wedge response, and as few open mics as possible. Hear and see the mechanism here:</p>`, viz: 'feedback' },
      { h: 'The cost of a loud stage', html: `
        <div class="uc-grid">
          ${uc('🎚️', 'Front-of-house mix', [['Effect', 'Wedge and backline spill reaches the audience late and unbalanced; the engineer mixes “around” it'], ['Fix', 'Lower stage level; in-ears; amps aimed at players, not the room']])}
          ${uc('🎤', 'Vocal microphones', [['Effect', 'Cymbals and guitars in the vocal channel; less usable compression and EQ'], ['Fix', 'Tighter patterns, closer singing, quieter stage']], C1)}
          ${uc('👂', 'Performers’ hearing', [['Effect', '100–110 dBA for hours: tinnitus and permanent loss'], ['Fix', 'In-ears with limiters, musician’s ear-plugs, shorter loud rehearsals']], C5)}
        </div>` },
      { h: 'In-ear monitoring', html: `
        ${SVG_IEM}
        <p>Sealed ear-pieces block 20–30 dB of stage sound, so the mix can be clear at a much lower level, stays the same wherever the performer walks, and cannot feed back. The stage becomes quiet, which transforms the front-of-house sound.</p>
        ${tbl(['Topic', 'Good practice'], [['Fit', 'A proper seal is everything: custom moulds or well-fitted tips. A leak removes bass and isolation'], ['Mixes', 'Stereo if possible — panning separates instruments so the level can be lower'], ['Ambience', 'Audience/stage microphones mixed in, so the performer does not feel isolated'], ['Both ears', 'Never one ear in, one out: the brain loses 6 dB of summation and the performer turns up dangerously'], ['Limiters', 'Brick-wall limiter on every pack, to catch feedback, drops and mistakes'], ['Wireless', 'Coordinate frequencies with the radio mics; directional antenna and combiner; line of sight; spare packs and batteries'], ['Latency', 'Keep the whole path to a few milliseconds — singers hear comb-filtering between their skull-conducted voice and a delayed feed'], ['Personal mixers', 'Network-fed units let each player trim their own mix from stems']])}` },
      { h: 'Hearing dose in plain words', html: `
        <p>Hearing damage depends on level <i>and</i> time. A common occupational rule allows about 85 dBA for 8 hours and <b>halves the time for every 3 dB more</b>: 88 dBA for 4 h, 94 dBA for 1 h, 100 dBA for 15 minutes, 106 dBA for under 4 minutes.</p>
        <div class="callout safety">In-ears protect only if they are used to <b>turn down</b>. Set levels at the start of the day, when ears are fresh; use the limiter; take quiet breaks. Persistent ringing or dullness after a show is a warning, not a badge. Listen to the levels in <a href="#/hear">Hear the Decibel</a> and read <a href="#/academy/hearing">Hearing &amp; Psychoacoustics</a>.</div>` },
      { h: 'Click, cue and talkback', html: `
        <ul><li><b>Click and count-ins</b> go only to the players who need them and never to the audience; in-ears make this simple.</li><li><b>Cue (listen) bus:</b> the monitor engineer listens to exactly what the performer hears — the same model of ear-piece or a matching wedge at the desk.</li><li><b>Talkback:</b> a microphone from the engineer into the mixes, and “shout” mics on stage routed only to in-ears and crew, so the band can talk between songs.</li><li><b>Programme interrupt:</b> cues that duck or replace the programme in a presenter’s ear-piece (broadcast IFB).</li></ul>` },
      { h: 'Production intercom', html: `
        ${tbl(['System', 'How it works', 'Suits'], [['Party-line', 'Everyone on a channel hears everyone; belt-packs on one shared cable', 'Theatre, small events: stage manager, lighting, sound, follow-spots'], ['Matrix', 'Any-to-any routing with programmable keys and groups', 'Broadcast, large shows, venues with many departments'], ['Wireless belt-packs', 'Radio or digital cordless links into either system', 'Roaming crew; needs frequency planning'], ['Show relay and paging', 'Programme sound and calls to dressing rooms and foyers', 'Any venue with backstage areas']])}
        <ul><li>Single-ear headsets for crew who must also hear the room; double-ear for loud positions.</li><li><b>Call lights</b> for positions where talking is impossible.</li><li>Microphone discipline: keys off when not talking; standby and go cues given the same way every time.</li><li>Keep intercom power and audio isolated from the sound system to avoid hum loops.</li></ul>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🍺', 'Pub band, tiny stage', [['Problem', 'Feedback and a wall of noise'], ['Solution', 'Amps down and tilted up, two wedges in the nulls, vocals only in the wedges, high-pass filters']])}
          ${uc('⛪', 'Worship team', [['Problem', 'Stage level drowns the congregation in a live room'], ['Solution', 'In-ears with personal mixers, drum screen, ambience mic']], C1)}
          ${uc('🎸', 'Touring rock show', [['Problem', 'Consistent mixes in a different room every night'], ['Solution', 'Stereo in-ears, snapshot per song, side-fills kept low for feel, spare packs']], C2)}
          ${uc('🎻', 'Orchestra with soloist', [['Problem', 'Players cannot hear across a wide stage'], ['Solution', 'Stage shell and risers first; discreet hot-spots for the back desks']], C3)}
          ${uc('🎭', 'Musical theatre', [['Problem', 'Cast need band; band in a remote room'], ['Solution', 'Foldback loudspeakers hidden in the set, conductor camera, in-ears for the band, matrix intercom']], C4)}
          ${uc('📺', 'Broadcast presenter', [['Problem', 'Needs programme and director’s cues'], ['Solution', 'Single ear-piece with interruptible feed, mix-minus so they never hear their own delayed voice']], C5)}
        </div>` },
      { h: 'Problems and solutions', html: `
        ${tbl(['Problem', 'Likely cause', 'Solution'], [['Feedback as soon as the wedge comes up', 'Wedge outside the mic null; singer far from mic', 'Re-place the wedge, closer singing, cut ringing bands'], ['“I can’t hear myself” at any level', 'Too much else in the mix; stage too loud', 'Remove other sources from the mix before adding more voice'], ['In-ears sound thin', 'Poor seal', 'Different tips or moulds'], ['Singer complains of hollow voice in ears', 'Latency or polarity', 'Shorten the digital path; try inverting polarity'], ['Radio drop-outs', 'Frequency clash or antenna placement', 'Coordinate, raise antennas, use directional types'], ['Hum on intercom', 'Shared earth with audio system', 'Isolate, separate power supply'], ['Players turn up through the night', 'Ear fatigue', 'Start quieter; scheduled breaks']])}
        ${myth([['“Wedges must be loud to be useful.”', 'They must be loud<i>er than the stage</i>. Lower the stage and the wedge can come down too.'], ['“In-ears automatically protect hearing.”', 'Only when the level is set sensibly and limited.'], ['“One ear-piece is a good compromise.”', 'It is the worst option for hearing: the open ear gets the stage, the closed one gets turned up.']])}` },
      { h: 'Checklists', html: `
        <div class="grid g2">
          <div class="callout alt"><b>Small venue</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Backline as low as the drummer allows</li><li>Wedges in mic nulls, high-passed</li><li>Vocals first in monitors; add only what is asked for</li><li>Ring out before doors</li><li>One spare vocal mic and cable on stage</li><li>Ear-plugs available</li></ul></div>
          <div class="callout mentor"><b>Touring show</b><ul style="margin:.3em 0 0;padding-left:18px"><li>Frequency plan for all radio mics, in-ears and intercom</li><li>Limiters set on every pack</li><li>Ambience mics and talkback routed</li><li>Snapshots saved; spare packs, moulds and batteries</li><li>Cue bus matches the artists’ ear-pieces</li><li>Intercom tested at every position</li></ul></div>
        </div>
        <p>Related: <a href="#/academy/a-feedback">Feedback, Monitors &amp; Live Mic Technique</a> · <a href="#/academy/a-intelligibility">Speech Intelligibility</a> · <a href="#/academy/a-workflow">Production Workflows</a>.</p>` },
    ],
    quiz: [
      { q: 'Where should a wedge go for a cardioid vocal microphone?', opts: ['Directly in front of the mic', 'Directly behind the mic, in its null', 'At 90° to the side', 'Above the singer'], a: 1, why: 'A cardioid is least sensitive straight behind.' },
      { q: 'What is the first step to better monitoring on a loud stage?', opts: ['Bigger wedges', 'Lower the backline level', 'More reverb', 'More microphones'], a: 1, why: 'Monitors only need to beat the stage level.' },
      { q: 'Why should in-ear path latency be kept to a few milliseconds?', opts: ['To save battery', 'Singers hear their own voice by bone conduction, so a delayed feed sounds hollow', 'For louder bass', 'It does not matter'], a: 1, why: 'The direct and delayed versions comb-filter.' },
      { q: 'At 94 dBA, a common occupational rule allows about…', opts: ['8 hours', '4 hours', '1 hour', '1 minute'], a: 2, why: '85 dBA for 8 h, halving for every 3 dB: 88→4 h, 91→2 h, 94→1 h.' },
      { q: 'A party-line intercom is one where…', opts: ['Only two people can talk', 'Everyone on the channel hears everyone', 'Calls are routed by a matrix', 'It works only wirelessly'], a: 1, why: 'A shared channel for a team, as in theatre.' },
    ],
  };

  window.LESSONS.push(LA, LB);
  const i = window.LESSONS.findIndex((l) => l.id === 'a-feedback');
  window.LESSONS.splice(i >= 0 ? i + 1 : window.LESSONS.length, 0, LC, LD);
})();
