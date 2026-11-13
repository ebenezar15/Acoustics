/* ==========================================================================
   Fabric finishes: choosing acoustic fabric, especially in India (M37), and
   installing fabric for a neat finish (M38).
   Original text written from general knowledge; typical guidance values.
   Prices are rough guides only — check current local prices.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design|solution/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const tbl = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c, i) => `<td>${i ? c : `<b>${c}</b>`}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const C1 = '#7a5cc7', C2 = '#c7772b', C3 = '#2b9fc7', C4 = '#4c9a3a', C5 = '#d14b8f', C6 = '#c7a12b';
  const FAB = (window.V && V.fabricList) || [];
  const sagWord = ['stays tight', 'slight', 'relaxes', 'sags badly'];

  /* =====================================================================
     SVGs — choosing fabric
     ===================================================================== */
  const SVG_JOBS = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="The six jobs of a fabric finish">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">One thin layer, six jobs</text>
    ${[['Hide', 'what is behind', 'accent'], ['Protect', 'wool from hands', 'c3'], ['Breathe', 'let sound in', 'good'], ['Look good', 'under real light', 'c5'], ['Stay tight', 'through the monsoon', 'warn'], ['Not burn', 'or spread flame', 'bad']].map(([a, b, c], i) => `<g transform="translate(${18 + i * 110},40)"><rect width="98" height="118" rx="10" fill="var(--panel)" stroke="var(--${c})" stroke-width="2"/><circle cx="49" cy="38" r="20" fill="var(--${c})" opacity=".2"/><text x="49" y="44" text-anchor="middle" font-size="17" font-weight="800" fill="var(--${c})">${i + 1}</text><text x="49" y="82" text-anchor="middle" font-size="12" font-weight="700">${a}</text><text x="49" y="100" text-anchor="middle" font-size="9.5" fill="var(--muted)">${b}</text></g>`).join('')}
    <text x="340" y="180" text-anchor="middle" font-size="11" fill="var(--muted)">Most shop cloth does four or five of these. The skill is finding one that does all six.</text>
  </svg>`;

  const weave = (x, gap, col) => { let s = ''; for (let i = 0; i < 6; i++) { s += `<rect x="${x + i * 26}" y="56" width="${26 - gap}" height="100" fill="var(--${col})" opacity=".55"/>`; s += `<rect x="${x}" y="${56 + i * 17}" width="156" height="${17 - gap * 0.65}" fill="var(--${col})" opacity=".35"/>`; } return s; };
  const SVG_WEAVE = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Open, medium and sealed fabric under a magnifier">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">What matters is whether air can move through the cloth</text>
    <text x="100" y="42" text-anchor="middle" font-size="12" font-weight="700" fill="var(--good)">Open weave</text>
    <text x="340" y="42" text-anchor="middle" font-size="12" font-weight="700" fill="var(--warn)">Tight weave</text>
    <text x="580" y="42" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bad)">Coated / backed</text>
    ${weave(22, 9, 'good')}${weave(262, 3.5, 'warn')}${weave(502, 0, 'bad')}
    <g stroke="var(--accent)" stroke-width="2.2" fill="none">
      <path class="leak-pulse" d="M40 176 v-130 M84 176 v-130 M128 176 v-130 M166 176 v-130"/>
      <path class="leak-pulse" d="M300 176 v-60 M384 176 v-130"/>
      <path d="M560 176 v-18 q 0 -10 -14 -6 M600 176 v-18 q 0 -10 14 -6" stroke="var(--bad)"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></path>
    </g>
    <text x="100" y="198" text-anchor="middle" font-size="10">under ~100 rayls · sound passes</text>
    <text x="340" y="198" text-anchor="middle" font-size="10">~1000 rayls · treble starts to bounce</text>
    <text x="580" y="198" text-anchor="middle" font-size="10">airtight · behaves like a wall</text>
    <text x="340" y="220" text-anchor="middle" font-size="10.5" fill="var(--muted)">Arrows are moving air — which is all a sound wave is. No air through, no sound through.</text>
  </svg>`;

  const SVG_WHERE = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="How open the cloth must be, by what is behind it">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">How open? It depends what the cloth is hiding</text>
    <rect x="40" y="150" width="600" height="14" rx="7" fill="var(--line)"/>
    <rect x="40" y="150" width="150" height="14" rx="7" fill="var(--good)"/><rect x="190" y="150" width="170" height="14" fill="var(--c3)"/><rect x="360" y="150" width="150" height="14" fill="var(--warn)"/><rect x="510" y="150" width="130" height="14" rx="7" fill="var(--bad)"/>
    <text x="40" y="182" font-size="10">0</text><text x="190" y="182" text-anchor="middle" font-size="10">100</text><text x="360" y="182" text-anchor="middle" font-size="10">400</text><text x="510" y="182" text-anchor="middle" font-size="10">1000+</text><text x="640" y="182" text-anchor="end" font-size="10">sealed</text>
    <text x="340" y="204" text-anchor="middle" font-size="10.5" fill="var(--muted)">airflow resistance of the cloth (rayls) — lower is more open</text>
    <g font-size="11" text-anchor="middle">
      <g transform="translate(115,0)"><rect x="-22" y="52" width="44" height="60" rx="4" fill="var(--panel)" stroke="var(--text)"/><circle cx="0" cy="70" r="7" fill="none" stroke="var(--text)"/><circle cx="0" cy="94" r="12" fill="none" stroke="var(--text)"/><text y="128" font-weight="700">Loudspeaker</text><text y="142" font-size="9.5" fill="var(--muted)">only the most open</text></g>
      <g transform="translate(275,0)"><rect x="-40" y="62" width="80" height="40" rx="3" fill="var(--warn)" opacity=".35" stroke="var(--text)"/><text y="128" font-weight="700">Absorber or cloud</text><text y="142" font-size="9.5" fill="var(--muted)">a few hundred is fine</text></g>
      <g transform="translate(435,0)"><path d="M-36 110 v-56 h72 z" fill="var(--warn)" opacity=".35" stroke="var(--text)"/><text y="128" font-weight="700">Deep bass trap</text><text y="142" font-size="9.5" fill="var(--muted)">tighter is acceptable</text></g>
      <g transform="translate(575,0)"><path d="M-36 110 v-30 h12 v-20 h12 v34 h12 v-44 h12 v26 h12 v-16 h12 v50 z" fill="var(--c2)" opacity=".5" stroke="var(--text)"/><text y="128" font-weight="700">Diffuser</text><text y="142" font-size="9.5" fill="var(--bad)">best left uncovered</text></g>
    </g>
  </svg>`;

  const SVG_LAYERS = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Layers of a covered absorber">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">What sits behind a good fabric face</text>
    <rect x="60" y="40" width="20" height="150" fill="var(--muted)" opacity=".5"/><text x="70" y="206" text-anchor="middle" font-size="10">wall</text>
    <rect x="80" y="40" width="50" height="150" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/><text x="105" y="206" text-anchor="middle" font-size="10">air gap</text>
    <rect x="130" y="40" width="150" height="150" fill="var(--warn)" opacity=".3" stroke="var(--text)"/><text x="205" y="118" text-anchor="middle" font-size="11" font-weight="700">absorbing core</text><text x="205" y="206" text-anchor="middle" font-size="10">mineral, glass or polyester wool</text>
    <rect x="282" y="40" width="5" height="150" fill="var(--text)"/><text x="296" y="34" font-size="10">liner — holds fibres, sets the colour</text>
    <rect x="290" y="40" width="14" height="150" fill="var(--c3)" opacity=".3"/><text x="330" y="58" font-size="10" fill="var(--c3)">thin wadding — softens edges (optional)</text>
    <path d="M308 40 v150" stroke="var(--accent)" stroke-width="4" stroke-dasharray="7 3"/><text x="330" y="100" font-size="10" fill="var(--accent)" font-weight="700">face fabric — the only layer anyone sees</text>
    <g stroke="var(--accent2)" stroke-width="2" fill="none"><path class="wave-in" d="M640 76 h-320"/><path class="wave-in" d="M640 120 h-320"/><path class="wave-in" d="M640 162 h-320"/></g>
    <text x="520" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">sound must pass every layer in front of the core</text>
    <g fill="var(--warn)"><circle cx="262" cy="70" r="2"><animate attributeName="cx" values="240;278;240" dur="3s" repeatCount="indefinite"/></circle><circle cx="262" cy="140" r="2"><animate attributeName="cx" values="250;279;250" dur="2.4s" repeatCount="indefinite"/></circle></g>
    <text x="330" y="144" font-size="10" fill="var(--muted)">loose fibres stop at the liner</text>
  </svg>`;

  const SVG_ROLL = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Reading a roll of fabric">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">Reading a roll before you pay for it</text>
    <ellipse cx="90" cy="110" rx="26" ry="60" fill="var(--accent)" opacity=".35" stroke="var(--text)"/><ellipse cx="90" cy="110" rx="7" ry="16" fill="var(--panel)" stroke="var(--text)"/>
    <path d="M90 50 H470 V170 H90" fill="var(--accent)" opacity=".16" stroke="var(--text)"/>
    <g stroke="var(--accent)" opacity=".5">${Array.from({ length: 18 }, (_, i) => `<path d="M${120 + i * 20} 50 V170"/>`).join('')}</g>
    <path d="M486 50 V170 M480 50 h12 M480 170 h12" stroke="var(--text)" fill="none"/><text x="498" y="106" font-size="11" font-weight="700">width</text><text x="498" y="122" font-size="10" fill="var(--muted)">44, 54, 58 or 60 in</text><text x="498" y="138" font-size="10" fill="var(--muted)">sets your widest panel</text>
    <path d="M150 186 h220 m-10 -5 l10 5 l-10 5" stroke="var(--good)" stroke-width="2" fill="none"/><text x="260" y="182" text-anchor="middle" font-size="10" fill="var(--good)">length (warp) — keep every panel this way up</text>
    <path d="M90 50 H470" stroke="var(--c5)" stroke-width="3"/><text x="300" y="44" text-anchor="middle" font-size="10" fill="var(--c5)">selvedge: the woven edge — check it is straight, not wavy</text>
    <rect x="110" y="86" width="86" height="48" rx="4" fill="var(--panel)" stroke="var(--text)"/><text x="153" y="104" text-anchor="middle" font-size="9.5" font-weight="700">LOT / SHADE</text><text x="153" y="118" text-anchor="middle" font-size="9">one lot for</text><text x="153" y="129" text-anchor="middle" font-size="9">the whole job</text>
    <circle cx="340" cy="110" r="22" fill="none" stroke="var(--bad)" stroke-width="2"><animate attributeName="r" values="18;26;18" dur="2.2s" repeatCount="indefinite"/></circle><text x="340" y="114" text-anchor="middle" font-size="9.5" fill="var(--bad)">flaws?</text>
  </svg>`;

  /* =====================================================================
     SVGs — installing fabric
     ===================================================================== */
  const SVG_FAMILIES = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Three ways to put fabric on a room">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">Three families of fabric finish</text>
    <g transform="translate(20,36)"><rect width="200" height="166" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <rect x="22" y="22" width="60" height="100" fill="var(--accent)" opacity=".35" stroke="var(--text)"/><rect x="100" y="22" width="60" height="100" fill="var(--accent)" opacity=".35" stroke="var(--text)"/>
      <text x="100" y="142" text-anchor="middle" font-size="11" font-weight="700">A · Wrapped panels</text><text x="100" y="157" text-anchor="middle" font-size="9.5" fill="var(--muted)">made on a table, hung on clips</text></g>
    <g transform="translate(240,36)"><rect width="200" height="166" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <rect x="14" y="16" width="172" height="110" fill="var(--accent)" opacity=".35" stroke="var(--text)" stroke-width="2"/><path d="M72 16 v110 M130 16 v110" stroke="var(--text)"/><rect x="14" y="110" width="172" height="16" fill="var(--text)" opacity=".3"/>
      <text x="100" y="142" text-anchor="middle" font-size="11" font-weight="700">B · Site-stretched wall</text><text x="100" y="157" text-anchor="middle" font-size="9.5" fill="var(--muted)">cloth tucked into tracks, floor to ceiling</text></g>
    <g transform="translate(460,36)"><rect width="200" height="166" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <path d="M10 14 h180" stroke="var(--muted)" stroke-width="6"/><path d="M50 14 v34 M150 14 v34" stroke="var(--text)"/><rect x="34" y="48" width="132" height="16" fill="var(--accent)" opacity=".4" stroke="var(--text)"><animate attributeName="y" values="48;50;48" dur="3s" repeatCount="indefinite"/></rect>
      <path d="M60 110 l40 -36 l40 36" fill="none" stroke="var(--accent2)" stroke-dasharray="4 3"/><circle cx="60" cy="112" r="4" fill="var(--accent2)"/><circle cx="140" cy="112" r="4" fill="var(--good)"/>
      <text x="100" y="142" text-anchor="middle" font-size="11" font-weight="700">C · Clouds and ceilings</text><text x="100" y="157" text-anchor="middle" font-size="9.5" fill="var(--muted)">framed, braced, hung on rated fixings</text></g>
    <text x="340" y="222" text-anchor="middle" font-size="10.5" fill="var(--muted)">Same cloth, same tests — different carpentry. Most rooms use all three.</text>
  </svg>`;

  const stp = (x, y, v, n, d) => `<g><rect x="${x - (v ? 2 : 7)}" y="${y - (v ? 7 : 2)}" width="${v ? 4 : 14}" height="${v ? 14 : 4}" fill="var(--text)"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${d};${Math.min(0.99, d + 0.05)};1" dur="6s" repeatCount="indefinite"/></rect>${n ? `<text x="${x + (v ? (x < 340 ? 14 : -14) : 0)}" y="${y + (v ? 4 : (y < 110 ? 18 : -9))}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--bad)">${n}</text>` : ''}</g>`;
  const SVG_STAPLE = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Staple order on the back of a panel">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">Staple order: centres first, opposite sides in pairs, corners last</text>
    <rect x="150" y="34" width="380" height="160" fill="var(--accent)" opacity=".14" stroke="var(--accent)"/>
    <rect x="180" y="56" width="320" height="116" fill="var(--panel)" stroke="var(--text)" stroke-width="1.5"/>
    <text x="340" y="118" text-anchor="middle" font-size="11" fill="var(--muted)">back of panel</text>
    ${stp(340, 60, false, 1, 0.05)}${stp(340, 168, false, 2, 0.15)}${stp(496, 114, true, 3, 0.25)}${stp(184, 114, true, 4, 0.35)}
    ${[-2, -1, 1, 2].map((k, i) => stp(340 + k * 44, 60, false, 0, 0.45 + i * 0.03) + stp(340 + k * 44, 168, false, 0, 0.47 + i * 0.03)).join('')}
    ${[-1, 1].map((k, i) => stp(496, 114 + k * 30, true, 0, 0.6 + i * 0.03) + stp(184, 114 + k * 30, true, 0, 0.62 + i * 0.03)).join('')}
    <g stroke="var(--good)" stroke-width="2.5" fill="none"><path d="M340 50 v-14 m-5 6 l5 -6 l5 6"/><path d="M340 178 v14 m-5 -6 l5 6 l5 -6"/><path d="M506 114 h18 m-6 -5 l6 5 l-6 5"/><path d="M174 114 h-18 m6 -5 l-6 5 l6 5"/></g>
    <g fill="none" stroke="var(--bad)" stroke-dasharray="4 3"><rect x="180" y="56" width="46" height="34"/><rect x="454" y="56" width="46" height="34"/><rect x="180" y="138" width="46" height="34"/><rect x="454" y="138" width="46" height="34"/></g>
    <text x="340" y="212" text-anchor="middle" font-size="10.5" fill="var(--muted)">Dashed boxes: leave about 60 mm free each side of every corner until all four sides are done.</text>
  </svg>`;

  const SVG_CORNER = `<svg class="gsvg" viewBox="0 0 680 240" role="img" aria-label="Hospital corner and cut-and-tuck corner">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">Two ways to close a corner (seen from the back)</text>
    <text x="170" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent)">Folded “hospital” corner</text>
    <text x="510" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="var(--c3)">Cut-and-tuck corner</text>
    ${[0, 1, 2].map((i) => `<g transform="translate(${20 + i * 105},52)"><rect x="20" y="20" width="80" height="80" fill="var(--panel)" stroke="var(--text)"/>
      ${i === 0 ? '<path d="M0 0 h100 v20 h-80 v80 h-20 z" fill="var(--accent)" opacity=".25" stroke="var(--accent)"/><path d="M6 6 l22 22" stroke="var(--bad)" stroke-width="2"/><circle cx="28" cy="28" r="3" fill="var(--bad)"/>' : ''}
      ${i === 1 ? '<path d="M20 20 l16 16 h64 v-16 z" fill="var(--accent)" opacity=".45"/><path d="M20 20 l16 16 v64 h-16 z" fill="var(--accent)" opacity=".25"/><path d="M0 40 h20 M40 0 v20" stroke="var(--accent)" stroke-dasharray="3 2"/>' : ''}
      ${i === 2 ? '<path d="M20 20 h80 v14 h-66 z" fill="var(--accent)" opacity=".5"/><path d="M20 20 l14 14 v66 h-14 z" fill="var(--accent)" opacity=".5"/><path d="M20 20 l14 14" stroke="var(--text)" stroke-width="2"/><rect x="50" y="24" width="12" height="4" fill="var(--text)"/><rect x="24" y="52" width="4" height="12" fill="var(--text)"/>' : ''}
      <text x="60" y="122" text-anchor="middle" font-size="10">${['1 · pull the tip over', '2 · fold both ears in', '3 · staple each side'][i]}</text></g>`).join('')}
    ${[0, 1, 2].map((i) => `<g transform="translate(${360 + i * 105},52)"><rect x="20" y="20" width="80" height="80" fill="var(--panel)" stroke="var(--text)"/>
      ${i === 0 ? '<path d="M0 0 h100 v20 h-80 v80 h-20 z" fill="var(--c3)" opacity=".25" stroke="var(--c3)"/><rect x="20" y="20" width="80" height="14" fill="var(--c3)" opacity=".5"/><rect x="50" y="24" width="12" height="4" fill="var(--text)"/>' : ''}
      ${i === 1 ? '<rect x="20" y="20" width="80" height="14" fill="var(--c3)" opacity=".5"/><path d="M0 34 h20 v66 h-20 z" fill="var(--c3)" opacity=".25" stroke="var(--c3)"/><path d="M0 0 h20 v20 h-20 z" fill="none" stroke="var(--bad)" stroke-dasharray="3 2"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></path><text x="10" y="14" text-anchor="middle" font-size="9" fill="var(--bad)">✂</text>' : ''}
      ${i === 2 ? '<rect x="20" y="20" width="80" height="14" fill="var(--c3)" opacity=".5"/><rect x="20" y="20" width="14" height="80" fill="var(--c3)" opacity=".5"/><path d="M20 20 v14" stroke="var(--text)" stroke-width="2"/><rect x="24" y="52" width="4" height="12" fill="var(--text)"/>' : ''}
      <text x="60" y="122" text-anchor="middle" font-size="10">${['1 · finish one side', '2 · cut the spare', '3 · fold under, staple'][i]}</text></g>`).join('')}
    <text x="170" y="204" text-anchor="middle" font-size="10" fill="var(--muted)">no cutting · best for thick or fraying cloth</text>
    <text x="510" y="204" text-anchor="middle" font-size="10" fill="var(--muted)">flattest · best for thin, stable cloth</text>
    <text x="340" y="228" text-anchor="middle" font-size="10.5" fill="var(--muted)">Whichever you choose, make all four corners of every panel the same way.</text>
  </svg>`;

  const SVG_TRACK = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Track joint with cloth tucked into the jaw">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">A track joint, cut through and seen from above</text>
    <rect x="30" y="34" width="620" height="16" fill="var(--muted)" opacity=".4"/><text x="40" y="46" font-size="10">wall</text>
    <rect x="304" y="50" width="72" height="70" fill="rgb(160,120,80)" opacity=".8" stroke="var(--text)"/><text x="340" y="90" text-anchor="middle" font-size="10" fill="#fff">batten</text>
    <rect x="40" y="50" width="264" height="92" fill="var(--warn)" opacity=".25"/><rect x="376" y="50" width="264" height="92" fill="var(--warn)" opacity=".25"/>
    <text x="170" y="100" text-anchor="middle" font-size="10" fill="var(--muted)">wool infill, flush with the track face</text>
    <rect x="304" y="120" width="72" height="22" fill="var(--panel)" stroke="var(--text)" stroke-width="1.5"/><path d="M336 120 v22 M344 120 v22" stroke="var(--text)" stroke-width="1.5"/>
    <text x="392" y="136" font-size="10" fill="var(--muted)">track with two gripping jaws</text>
    <path d="M40 146 H334 V128" fill="none" stroke="var(--accent)" stroke-width="3"/>
    <path d="M640 146 H346 V128" fill="none" stroke="var(--accent)" stroke-width="3"><animate attributeName="d" values="M640 146 H346 L332 164;M640 146 H346 V128;M640 146 H346 V128" dur="3s" repeatCount="indefinite"/></path>
    <g><path d="M346 150 l-5 26 h10 z" fill="var(--text)"/><rect x="339" y="176" width="14" height="26" rx="3" fill="var(--c3)"/><animateTransform attributeName="transform" type="translate" values="0 10;0 -14;0 10" dur="3s" repeatCount="indefinite"/></g>
    <text x="110" y="166" text-anchor="middle" font-size="10" fill="var(--accent)" font-weight="700">cloth, bay 1</text><text x="570" y="166" text-anchor="middle" font-size="10" fill="var(--accent)" font-weight="700">cloth, bay 2</text>
    <text x="340" y="220" text-anchor="middle" font-size="10.5" fill="var(--muted)">From the room you see only a hairline joint. The blunt tool pushes spare cloth into the jaw; pulling it out again releases the bay.</text>
  </svg>`;

  const SVG_ALT = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Four home-made alternatives to proprietary track">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">No track available? Four joints any good carpenter can make</text>
    ${[['Kerf + spline', 'groove and rubber cord'], ['Staple + bead', 'cover strip hides staples'], ['Back-tack strip', 'blind straight edge'], ['Lift-off frame', 'hook-and-loop or magnets']].map(([a, b], i) => `<g transform="translate(${14 + i * 166},34)"><rect width="154" height="166" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <rect x="47" y="20" width="60" height="62" fill="rgb(160,120,80)" opacity=".8" stroke="var(--text)"/>
      ${i === 0 ? '<rect x="73" y="62" width="8" height="20" fill="var(--bg)" stroke="var(--text)"/><path d="M10 84 H73 V68 M144 84 H81 V68" fill="none" stroke="var(--accent)" stroke-width="3"/><circle cx="77" cy="70" r="3.6" fill="var(--c3)"><animate attributeName="cy" values="96;70;70" dur="2.6s" repeatCount="indefinite"/></circle>' : ''}
      ${i === 1 ? '<path d="M10 84 H74 M144 84 H80" fill="none" stroke="var(--accent)" stroke-width="3"/><rect x="60" y="82" width="10" height="4" fill="var(--bad)"/><rect x="84" y="82" width="10" height="4" fill="var(--bad)"/><rect x="52" y="88" width="50" height="10" fill="rgb(120,85,50)" stroke="var(--text)"><animate attributeName="y" values="112;88;88" dur="2.6s" repeatCount="indefinite"/></rect>' : ''}
      ${i === 2 ? '<path d="M56 84 H100" stroke="var(--accent)" stroke-width="3"/><rect x="70" y="87" width="30" height="5" fill="var(--c6)" stroke="var(--text)"/><rect x="80" y="85" width="10" height="4" fill="var(--bad)"/><path d="M56 84 q -8 6 0 12 H144" fill="none" stroke="var(--accent)" stroke-width="3"><animate attributeName="d" values="M56 84 q -8 6 0 12 H60;M56 84 q -8 6 0 12 H144;M56 84 q -8 6 0 12 H144" dur="2.6s" repeatCount="indefinite"/></path>' : ''}
      ${i === 3 ? '<rect x="47" y="82" width="60" height="4" fill="var(--text)"/><g><rect x="22" y="90" width="110" height="26" fill="var(--warn)" opacity=".3" stroke="var(--text)"/><path d="M22 118 H132" stroke="var(--accent)" stroke-width="3"/><rect x="47" y="86" width="60" height="4" fill="var(--c5)"/><animateTransform attributeName="transform" type="translate" values="0 16;0 0;0 0" dur="2.6s" repeatCount="indefinite"/></g>' : ''}
      <text x="77" y="140" text-anchor="middle" font-size="11" font-weight="700">${a}</text><text x="77" y="156" text-anchor="middle" font-size="9.5" fill="var(--muted)">${b}</text></g>`).join('')}
    <text x="340" y="220" text-anchor="middle" font-size="10.5" fill="var(--muted)">All four seen from above, room side at the bottom. Timber shown; aluminium sections work the same way.</text>
  </svg>`;

  const SVG_WALL = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Elevation of a finished stretched-fabric wall">
    <text x="340" y="18" text-anchor="middle" font-size="13" font-weight="700">Anatomy of a calm fabric wall</text>
    <rect x="40" y="34" width="600" height="160" fill="var(--accent)" opacity=".16" stroke="var(--text)" stroke-width="2"/>
    <rect x="40" y="170" width="600" height="24" fill="var(--text)" opacity=".3"/>
    ${[160, 280, 400, 520].map((x) => `<path d="M${x} 34 V170" stroke="var(--text)" stroke-width="1.2"/>`).join('')}
    <rect x="410" y="60" width="100" height="110" fill="var(--good)" opacity=".14"/><text x="460" y="116" text-anchor="middle" font-size="10" fill="var(--good)" font-weight="700">lift-off access bay</text><text x="460" y="130" text-anchor="middle" font-size="9" fill="var(--good)">cables behind</text>
    <rect x="212" y="146" width="16" height="12" fill="var(--panel)" stroke="var(--text)"/><rect x="330" y="146" width="16" height="12" fill="var(--panel)" stroke="var(--text)"/>
    <text x="220" y="140" text-anchor="middle" font-size="9.5" fill="var(--muted)">socket, centred</text>
    <path d="M40 204 h120 M40 200 v8 M160 200 v8" stroke="var(--accent2)" fill="none"/><text x="100" y="220" text-anchor="middle" font-size="10" fill="var(--accent2)">bay ≈ roll width − 100 mm</text>
    <text x="600" y="186" text-anchor="end" font-size="10">darker, tougher skirting band</text>
    <path d="M60 34 l14 -10 M620 34 l-14 -10" stroke="var(--warn)" stroke-width="2"/><text x="340" y="30" text-anchor="middle" font-size="9.5" fill="var(--warn)">wall-washers kept back from the wall so they do not graze every ripple</text>
    <g stroke="var(--warn)" stroke-width="1" opacity=".5"><path d="M100 36 l-20 60 M100 36 l20 60"><animate attributeName="opacity" values=".2;.8;.2" dur="3s" repeatCount="indefinite"/></path><path d="M580 36 l-20 60 M580 36 l20 60"><animate attributeName="opacity" values=".8;.2;.8" dur="3s" repeatCount="indefinite"/></path></g>
  </svg>`;

  /* =====================================================================
     Lesson M37 — choosing fabric
     ===================================================================== */
  const indiaTable = tbl(
    ['Fabric', 'Sound', 'Typical rayls', 'In monsoon humidity', 'Fraying', 'Fire behaviour', 'Rough ₹ / m', 'Best use'],
    FAB.map((f) => [f.n, `<span style="color:var(--${f.cls})">${f.verdict}</span>`, f.r >= 100000 ? 'airtight' : (f.r === f.rs ? '≈ ' + f.r : '≈ ' + f.r + ' relaxed, ' + f.rs + ' stretched'), sagWord[f.sag], f.fray, f.fire, '₹' + f.price[0] + '–' + f.price[1], f.use])
  );

  window.LESSONS.push({
    id: 'm-fabric', n: 'M37', track: 'master', title: 'Fabric Finishes: How to Choose Acoustic Fabric — Especially in India', level: 'Core', mins: 55,
    summary: 'The cloth is the only part of the treatment anyone sees, and the wrong one silently switches the treatment off. Learn the one property that matters, five tests you can do in a shop, which Indian market fabrics pass, and how humidity, fire and dust change the choice.',
    tags: ['fabric', 'acoustic fabric', 'India', 'finishes', 'flow resistance', 'polyester', 'jute', 'cotton', 'liner', 'fire', 'humidity', 'GSM', 'speaker cloth'],
    sections: [
      { h: 'Why the cloth deserves a lesson of its own', html: `
        <p>Look at a well-finished studio and you rarely see “acoustic panels”. You see calm walls and ceilings that happen to be cloth: floor-to-ceiling surfaces with thin, regular joints, clouds with crisp edges, perhaps a darker band along the floor. Almost all of the absorption, bass trapping and wiring is hidden behind that skin (see <a href="#/academy/m-design-language">M35</a>).</p>
        <p>That skin is asked to do six different jobs at once.</p>
        ${SVG_JOBS}
        <div class="callout mentor"><b>The uncomfortable truth.</b> A panel with 100 mm of excellent wool behind a cloth that does not breathe is an expensive notice board. Nobody can see the mistake, and the room simply never sounds as it was designed to. Choosing cloth is acoustic design, not decoration.</div>
        <p>Purpose-made “acoustic fabric” with a published test sheet is easy to buy in some countries and hard to find, or costly, in much of India. The good news: you do not need the label. You need to understand what the label would have told you and test for it yourself.</p>` },
      { h: 'The physics in plain words: can air move through it?', html: `
        <p>A sound wave is air moving back and forth by a tiny amount. For the wool behind the cloth to absorb sound, that moving air has to reach it. So the question for any cloth is simply: <b>how hard is it to push air through?</b></p>
        ${SVG_WEAVE}
        <p>The measured quantity is <b>airflow resistance</b> (also called specific flow resistance), in pascal-seconds per metre — the unit usually nicknamed the <i>rayl</i>. It is the same idea as the flow resistivity of the wool itself (<a href="#/academy/m-flowres">M19</a>), but for a thin sheet.</p>
        ${tbl(['Airflow resistance', 'What it feels like', 'What it does to sound'], [
          ['Under about 100 rayls', 'Breathing through it is like breathing through nothing', 'Acoustically invisible. Safe in front of a loudspeaker.'],
          ['100 – 400 rayls', 'Faint resistance', 'Excellent over absorbers and clouds. A tweeter would lose a touch of sparkle.'],
          ['400 – 1000 rayls', 'You notice yourself pushing', 'The cloth starts to act as part of the absorber: a little more low-mid, less treble.'],
          ['Over 1000 rayls', 'Cheeks puff out', 'Treble bounces off. The panel becomes a mid-bass absorber with a reflective face.'],
          ['Coated, laminated, vinyl', 'No air at all', 'A reflector, or a membrane. The wool behind is wasted at mid and high frequencies.'],
        ])}
        <p>Four things set the resistance: how much <b>open area</b> there is between the yarns; whether the cloth is <b>woven</b> (yarns cross at right angles, holes stay put) or <b>knitted</b> (loops that close when stretched); how <b>thick and hairy</b> the yarn is; and any <b>finish</b> — a coating, backing or lamination seals even an open-looking cloth.</p>
        <div class="callout physics"><b>Tight and flat is not the same as sealed.</b> A cloth can be stretched as tight as a drum skin and still be transparent, if the yarns leave gaps. And a loose, floppy cloth can be airtight if it has a rubbery backing. Judge by breath, never by how taut it looks.</div>`, viz: 'fabricTransmission' },
      { h: 'Transparent, semi-transparent or reflective — and when each is right', html: `
        <p>There is no single “correct” cloth. It depends on what is behind it.</p>
        ${SVG_WHERE}
        <div class="uc-grid">
          ${uc('🔊', 'In front of a loudspeaker', [['Need', 'The most open cloth you can find: grille knit or mesh, under about 100 rayls.'], ['Why', 'Anything tighter costs treble and can add a faint resonance of its own.'], ['Do', 'Stretch it on a slim removable frame; keep frame bars away from the tweeter; black liner only if it also passes the breath test.']], C3)}
          ${uc('▦', 'Broadband absorbers and clouds', [['Need', 'A few hundred rayls or less.'], ['Why', 'These panels are there to absorb the mids and highs; the cover must let them in.'], ['Do', 'Use an open basket-weave polyester. This is ninety percent of the cloth in a typical room.']], C4)}
          ${uc('◣', 'Deep bass traps', [['Need', 'Anything up to about 1000 rayls is acceptable.'], ['Why', 'The trap works below a few hundred hertz, where a cloth of this kind is still open. A little reflected treble is often welcome — it stops the room going dull.'], ['Do', 'This is where stretch knits and thin felts are useful. Some designs deliberately put a membrane or foil here.']], C2)}
          ${uc('▥', 'Diffusers', [['Need', 'No cover at all.'], ['Why', 'A diffuser works by its hard, shaped surface. Cloth adds absorption and hides the shape.'], ['Do', 'Make the diffuser a visible feature. If it must be hidden, use the most open mesh and accept a small loss.']], C5)}
        </div>
        <div class="callout alt"><b>Using a tighter cloth on purpose.</b> A cover of several hundred rayls slightly raises absorption in the low-mids and lowers it at the very top. In a small room that already has too much treble absorption (thin panels everywhere, a carpet, a sofa) that tilt can be exactly what you want. Do it by choice, with a measurement — not by accident.</div>` },
      { h: 'Five tests you can do in the shop', html: `
        <p>Carry a lighter or candle, a small torch (your phone), a water bottle, and — best of all — a hand-sized piece of a cloth you already know works. Then test before you fall in love with a colour.</p>
        ${flow([['Breath', 'Hold one layer tight against your lips and breathe out normally. It should feel almost like open air.'], ['Candle', 'Hold the cloth a hand’s width from a flame and puff through it. The flame should bend.'], ['Light', 'Hold it to a lamp. A fine grid of pin-points is ideal: open, yet hides the core.'], ['Water drop', 'A drop that beads and sits means a coating or backing. Reject.'], ['Noise', 'Play pink noise on a phone, hold the cloth over the speaker. You should hear no change.']])}
        <p>The first four take a minute and catch nearly every bad choice. The fifth can be made semi-scientific: with a measurement microphone or a phone analyser app, compare the spectrum of pink noise from a small speaker with and without the cloth draped over it. Under a decibel of loss up to 10 kHz is transparent; several decibels above 2 kHz is a tight cloth.</p>
        <div class="callout warn"><b>Test it the way it will be used.</b> Knits close up when stretched. Do the breath test with the sample pulled as tight as it will be on the frame, and through every layer you plan to use — face cloth plus liner together.</div>`, viz: 'fieldTests' },
      { h: 'Reading a fabric: fibre, construction, weight, width', html: `
        <p>Shopkeepers describe cloth in their own vocabulary. Translate it into the four things you care about.</p>
        ${SVG_ROLL}
        <h4>Fibre</h4>
        ${tbl(['Fibre', 'Good', 'Bad', 'Verdict'], [
          ['Polyester', 'Does not absorb moisture, holds tension, cheap, endless colours, can be inherently flame-retardant, can be heat-tightened', 'Melts; plain grades can look flat or shiny', 'The default for studio work'],
          ['Polypropylene (olefin)', 'Very stable, stain-resistant, light', 'Fades in sunlight, low melting point', 'Good; common as non-woven liner'],
          ['Cotton', 'Natural look, easy to staple, takes dye well', 'Swells and relaxes with humidity, mildews, burns', 'Small panels in conditioned rooms only'],
          ['Linen and blends', 'Beautiful texture', 'Creases, relaxes, expensive', 'Feature panels'],
          ['Jute / hessian', 'Very open, very cheap', 'Sheds, smells when damp, sags, fades, burns', 'Budget work in dry rooms, always lined'],
          ['Wool and wool blends', 'Rich look, naturally hard to ignite', 'Costly, moths, moves with humidity', 'High-end feature surfaces'],
        ])}
        <h4>Construction</h4>
        <ul>
          <li><b>Plain weave</b> — one over, one under. Open if the yarns are spaced apart; tight if they are packed.</li>
          <li><b>Basket or “matty” weave</b> — yarns in pairs or threes. Naturally open with a pleasant texture: the classic panel cloth.</li>
          <li><b>Panama</b> — a heavier basket weave; “jute-look” polyester is usually this.</li>
          <li><b>Twill</b> (diagonal lines) — packs tightly. Usually too closed.</li>
          <li><b>Jersey and interlock knits</b> — stretchy, wrinkle-free, but the loops close under tension.</li>
          <li><b>Mesh, net, grille knit</b> — as open as cloth gets; see-through.</li>
          <li><b>Four-way stretch</b> — stretches in both directions; excellent for shapes, risky for treble when pulled hard.</li>
        </ul>
        <h4>Weight, width and the rest</h4>
        <ul>
          <li><b>GSM</b> (grams per square metre) — a useful range for face cloth is roughly 120–350 GSM <i>with an open construction</i>. Weight alone tells you nothing: a 200 GSM basket weave breathes, a 200 GSM coated cloth does not.</li>
          <li><b>Width</b> — 44, 54, 58 or 60 inches. This sets your widest panel or bay (see <a href="#/academy/m-fabric-install">M38</a>).</li>
          <li><b>Stretch</b> — pull a 100 mm length and see how far it goes. 5–10 % helps installation; 50 % needs testing under tension.</li>
          <li><b>Backing</b> — turn it over. Any foam, latex, acrylic coating, bonded lining or shiny film: walk away.</li>
          <li><b>Shade and lot</b> — colour varies from one dye lot to the next. One lot for the whole job.</li>
        </ul>` },
      { h: 'The India list: what you can actually buy', html: `
        <p>These are the fabrics you will meet in Indian cloth markets, sofa-fabric and curtain shops, electronics markets and online, with honest verdicts. The numbers are typical estimates to help you rank options — <b>the roll in front of you must still pass the breath test</b>.</p>
        ${indiaTable}
        <div class="callout data"><b>Where to look.</b> Upholstery and curtain-fabric lanes in the big wholesale cloth markets for matty, panama, jute-look and sheers; electronics and speaker-component markets for grille cloth; packaging and bag-material suppliers for non-woven spunbond; sports- and dance-wear fabric shops for stretch knits. Names of qualities change from city to city and shop to shop — describe what you need (“loose basket weave, pure polyester, no backing”) and test. Prices are rough guides per running metre: check current local prices.</div>
        <div class="callout warn"><b>Be careful with anything sold online as “acoustic fabric” with an absorption rating of its own.</b> A thin cloth cannot absorb much by itself — glued flat to a wall it manages perhaps 0.05–0.15 on the usual single-number scale. A high figure quoted for “the fabric” almost always belongs to the panel it was tested on. And some products with this name are velvet laminated to thin foam: soft to touch, but nearly airtight and useless as a cover for a real absorber.</div>`, viz: 'indiaFabricChooser' },
      { h: 'Humidity and climate: the Indian problem', html: `
        <p>A room that is air-conditioned by day and closed up at night swings between perhaps 45 % and 85 % relative humidity, every day of the monsoon. Natural fibres take up moisture, swell and grow longer; when they dry they shrink again. Over a one-metre span, a one percent change is a centimetre of loose cloth.</p>
        ${tbl(['Fibre', 'Length change, dry → humid', 'What you see'], [
          ['Polyester, polypropylene', 'Practically none', 'Stays as installed for years'],
          ['Cotton', 'Up to about 1 %', 'Soft ripples by August, tight again in winter'],
          ['Linen blends', 'About 1 %', 'Ripples and creases'],
          ['Jute / hessian', '1–2 %', 'Obvious belly; may not recover; mildew smell'],
          ['Wool', 'About 1 %', 'Moves, but springs back well'],
        ])}
        <ul>
          <li><b>Coastal cities</b>: salt-laden humid air adds mildew and corrodes plain steel staples. Use stainless or galvanised staples and avoid jute and untreated cotton altogether.</li>
          <li><b>Dry, hot regions</b>: sagging is less of a problem; dust is more. Choose a texture and shade that hide dust and can be vacuumed.</li>
          <li><b>Rooms that are always conditioned</b> (commercial studios with 24-hour AC): natural fibres become workable — but a week-long power or AC failure will show.</li>
        </ul>
        <div class="callout mentor"><b>If you must use a natural fibre:</b> pre-wash or steam it, let it hang in the actual room for 24–48 hours, keep spans short, tension firmly, and install on a humid day so that it only ever gets tighter. Better still, choose a polyester that imitates the look — “jute-look” and “linen-look” polyesters exist for exactly this reason.</div>`, viz: 'humiditySag' },
      { h: 'Fire safety: not optional', html: `
        <p>A studio is a sealed room full of cloth, wool, timber and electrical equipment, often with one door. The fabric is the first thing a flame meets.</p>
        ${tbl(['Term', 'What it means', 'What to ask'], [
          ['Inherently flame-retardant', 'The fibre itself resists burning — certain polyesters, modacrylic, wool. The property cannot be washed or worn out.', 'A test certificate for that exact quality'],
          ['Treated (topical FR)', 'Ordinary cloth dipped or sprayed with a retardant salt. Works, but is lost on washing and can fade in humidity; may stiffen cloth or leave white marks.', 'What treatment, who applied it, when, and a burn test of a sample'],
          ['Untreated', 'Cotton, jute, linen and many blends burn readily. Plain polyester melts and drips, which can still spread fire.', 'Do not use in commercial or public rooms'],
        ])}
        <p>Building rules for commercial and public rooms normally require wall and ceiling linings to meet a <b>surface spread of flame</b> classification, and hanging textiles a <b>vertical flame test</b>. There are national, British/European and American families of these tests, and which one applies depends on the building and the authority. <b>Ask the supplier for a written test certificate, and check the required standard and its current edition with your fire consultant</b> (see <a href="#/academy/m-standards">M31</a>).</p>
        <div class="callout safety"><b>Simple sanity test for a home project.</b> Outdoors, hold a 30 × 100 mm strip of the cloth vertically with tongs and touch a lighter to the bottom edge for three seconds. A cloth that keeps burning upward after the lighter is removed should not go on your walls untreated. This does not replace a certificate — it just weeds out the worst. And remember the wool core and timber matter too: mineral and glass wool do not burn; some foams burn fiercely.</div>
        <ul>
          <li>Keep cloth clear of hot lamps, dimmer packs and amplifier vents; use LED fittings with a proper collar where they pass through fabric.</li>
          <li>Never run fabric over or behind a socket outlet without a proper box and plate.</li>
          <li>FR sprays for natural fibres are sold by fire-safety and tent-material suppliers; re-test after application and re-treat after any wet cleaning.</li>
        </ul>` },
      { h: 'Dust, fibres and the liner', html: `
        <p>Mineral wool and glass wool shed tiny fibres when touched or vibrated. An open face cloth lets sound through — and fibres out. The answer is a <b>liner</b> (also called a scrim): a very thin, breathable sheet between the wool and the face cloth.</p>
        ${SVG_LAYERS}
        ${tbl(['Liner', 'Use it when', 'Notes'], [
          ['Black non-woven spunbond, 40–60 GSM', 'Under dark or mid-tone face cloth; behind grille cloth', 'The cheapest and most useful liner. Some grades are calendered almost airtight — breath-test every roll.'],
          ['White non-woven or white voile', 'Under light face cloth', 'Stops the yellow or brown core showing as blotches.'],
          ['Polyester wadding, about 100 GSM / 5–10 mm', 'Over framed panels, under any face cloth', 'Softens frame edges and hides staple bumps. Very open; almost no acoustic effect.'],
          ['Factory tissue facing on the slab', 'When you can buy slabs with black glass-tissue on one face', 'Tidy and effective; put the faced side to the room.'],
        ])}
        <p>Polyester-fibre absorber boards do not shed irritating fibres and can be used without a liner for health reasons — but a liner is still useful for colour. More on Indian core materials in <a href="#/academy/m-india">M32</a>.</p>
        <div class="callout safety">When cutting mineral or glass wool wear a dust mask, gloves, long sleeves and eye protection, cut with a long knife rather than a saw, and vacuum rather than sweep. Seal the back of every panel too — an open back sheds into the cavity and out through gaps.</div>`, viz: 'readThrough' },
      { h: 'Colour, texture and the look of the room', html: `
        <p>The acoustic tests narrow the field; now choose what the room will look like. A few rules save a lot of regret.</p>
        <ul>
          <li><b>Dark hides, light reveals.</b> Charcoal, deep blue, olive and brown hide joints, shadows, dust and small ripples. Cream and pale grey show the core, the frame, every staple pucker and every fingerprint — they need a liner, wadding and the best workmanship.</li>
          <li><b>Texture forgives.</b> A basket weave or slub breaks up reflections of light and hides tension lines. Smooth, plain cloth shows everything.</li>
          <li><b>Grazing light is merciless.</b> Wall-washers and LED coves close to a fabric wall light up every bump. Either plan for it (wadding, flush cores, textured cloth) or move the light a little further out. Try the real fitting on a sample panel.</li>
          <li><b>Direction and nap.</b> Many cloths look a different shade when turned 90° or upside down. Mark the “up” direction on every piece.</li>
          <li><b>Patterns cost cloth.</b> Stripes and repeats must line up from bay to bay and waste material. Plain or small-texture cloth is far easier.</li>
          <li><b>Two tones are useful.</b> A darker, tougher cloth for the bottom 300 mm protects against feet and vacuum cleaners and visually grounds the wall.</li>
        </ul>
        <div class="uc-grid">
          ${uc('🌙', 'Dark immersive mix room', [['Look', 'Charcoal or deep colour on walls and ceiling; light from concealed strips.'], ['Cloth', 'Dark textured polyester over black liner.'], ['Why it works', 'Speakers, joints and treatment all disappear; attention goes to the sound.']], C1)}
          ${uc('☀', 'Bright daylight live room', [['Look', 'Pale grey panels on white walls, timber slats, rugs.'], ['Cloth', 'Light basket-weave polyester over white liner and wadding.'], ['Watch', 'Read-through and dirty hand marks; specify a cleanable quality.']], C6)}
          ${uc('🛋', 'Living room that is also a theatre', [['Look', 'Walls that read as painted plaster.'], ['Cloth', 'Fine plain-weave polyester in the wall colour, stretched floor to ceiling.'], ['Watch', 'In-wall speakers need the most open cloth; test the exact pairing.']], C4)}
        </div>
        <p>How these choices fit a whole design language is covered in <a href="#/academy/m-design-language">M35</a>; other finishes are in <a href="#/academy/m-factors">M29A</a>.</p>` },
      { h: 'How to buy without regret', html: `
        ${flow([['Shortlist', 'Three or four cloths that pass breath and light in the shop.'], ['Sample', 'Buy half a metre of each. Wrap a test frame with liner and cloth.'], ['Live with it', 'Hang the samples in the room for a week under the real lights and AC cycle.'], ['Measure', 'If you can, compare absorption or pink-noise loss with and without the cloth.'], ['Order', 'Whole quantity plus 10–15 %, one lot, as a continuous length on the roll.'], ['Store', 'Rolled, never folded; dry; off the floor; label the “up” direction.']])}
        <ul>
          <li>Ask for the cloth <b>on the bolt</b>, not as cut pieces, and check the width yourself with a tape — “54 inch” is sometimes 52.</li>
          <li>Unroll a few metres and look for weaving faults, stains, colour bands and a wavy selvedge.</li>
          <li>Keep the supplier’s name, quality name, shade number and lot number in the project file. You will want two more metres one day.</li>
          <li>Keep the off-cuts and a metre or two spare: repairs from a new lot never match.</li>
        </ul>
        ${tbl(['Rough cost per m² of finished face (cloth only, with waste)', 'Typical'], [
          ['Hessian with liner', '₹90–180'], ['Polyester matty / panama with liner', '₹200–450'], ['Speaker grille cloth', '₹250–550'], ['Stretch knit', '₹180–400'], ['Imported certified acoustic fabric, where available', '₹900–2500+'],
        ])}
        <p class="small">Rough guides only — check current local prices. The cloth is usually under a fifth of the cost of a finished panel; do not economise here.</p>` },
      { h: 'Looking after it', html: `
        <ul>
          <li><b>Dust</b>: vacuum gently with a soft brush head two or three times a year, working along the weave. Never beat panels.</li>
          <li><b>Marks</b>: blot, do not rub. Test any cleaner on an off-cut first; a damp microfibre cloth with a drop of mild detergent handles most hand marks on polyester. Water leaves rings on cotton and removes FR treatment.</li>
          <li><b>Slack</b>: polyester can be tightened in place with gentle steam or warm air held well away from the surface; track-fitted cloth can be re-tucked. Sagging natural fibre usually has to be re-stretched.</li>
          <li><b>Pilling and snags</b>: trim with scissors, never pull.</li>
          <li><b>Sun</b>: direct sunlight through a studio window fades most dyes within a couple of years. Use blinds or solar film (see <a href="#/academy/m-daylight">M24</a>).</li>
          <li><b>Smoke and incense</b>: cloth holds smell. Decide the room’s rules early.</li>
        </ul>` },
      { h: 'Problems and fixes', html: `
        ${tbl(['Symptom', 'Likely cause', 'Fix'], [
          ['Room measures and sounds brighter and more “flappy” than predicted', 'Cover too tight; treble never reaches the wool', 'Breath-test the installed cloth; replace on the worst reflection points first'],
          ['Speakers behind cloth sound dull', 'Grille cloth too dense, or doubled with a tight liner', 'Most open knit only; check liner; keep cloth 10–20 mm off the baffle'],
          ['Ripples appear every monsoon', 'Natural fibre, long spans, installed in dry weather', 'Extra support, re-stretch on a humid day, or change to polyester'],
          ['Yellow patches showing through', 'Open light cloth straight over glass wool', 'White liner or wadding behind'],
          ['Dark lines at frames under the lights', 'Core set back from the frame face; grazing light', 'Pack the core flush, add wadding, soften the light'],
          ['Itchy skin, dust on equipment', 'No liner; open backs', 'Add liner, seal backs, vacuum'],
          ['Panels look like two different colours', 'Mixed dye lots, or pieces turned different ways', 'One lot; mark direction; swap panels so differences fall at corners'],
          ['Musty smell', 'Damp natural fibre or damp wall behind', 'Find the moisture source first; ventilate cavity; replace with synthetic'],
        ])}` },
      { h: 'Myths, rules of thumb and apply it', html: `
        ${myth([
          ['“Thicker cloth absorbs more.”', 'The cloth is not the absorber — the core is. Thicker, heavier cloth usually just blocks more treble from reaching it.'],
          ['“Any cloth will do; it is only a cover.”', 'A tight or backed cloth can halve the mid-to-high absorption of a good panel. It is the most common invisible mistake in home studios.'],
          ['“This fabric has a high absorption rating.”', 'A rating quoted for a thin cloth alone is almost always the rating of the panel it was tested over. Ask what was behind it.'],
          ['“Jute is the acoustic fabric.”', 'It is open, which is why it works — and it also sheds, sags, fades, smells and burns. Open polyester does the same job without the baggage.'],
          ['“Velvet is great for acoustics.”', 'Heavy velvet hung in deep folds as a curtain is a fine absorber. The same velvet stretched flat over a panel mostly reflects treble.'],
          ['“If you cannot see through it, sound cannot get through it.”', 'Felts and dense knits can be opaque to the eye and still breathe moderately. Light is a hint; breath is the test.'],
        ])}
        <div class="callout data"><b>Rules of thumb.</b>
          <ul style="margin:.4em 0 0;padding-left:18px">
            <li>If you can breathe through it comfortably, sound can get through it.</li>
            <li>Speakers: under ~100 rayls. Absorbers: a few hundred. Bass traps: up to ~1000. Diffusers: none.</li>
            <li>Polyester for stability; open basket weave for breath and texture; 120–350 GSM.</li>
            <li>No foam, latex, film or coating on the back — ever.</li>
            <li>Liner under every open cloth over mineral or glass wool: black under dark, white under light.</li>
            <li>One dye lot, 10–15 % extra, bought on the roll.</li>
            <li>Commercial room: written flame-test certificate before purchase.</li>
            <li>Test stretched, test lined, test under the real lights.</li>
          </ul></div>
        <div class="callout example"><b>Apply it.</b> Go to one upholstery shop and one electronics market this week with a lighter, a phone torch and a water bottle. Collect six half-metre samples: one grille cloth, two polyester basket weaves, one jute, one cotton, one stretch knit. Run the five tests on each and write the results on masking tape stuck to the sample. Wrap two small test frames with your best candidates over a liner and hang them where the wall-washers will hit them. In a week you will know your cloth — and you will never again buy by colour alone. Then go on to <a href="#/academy/m-fabric-install">M38</a> to learn to fit it.</div>` },
    ],
    quiz: [
      { q: 'Which single property best predicts whether a cloth will let sound reach the absorber behind it?', opts: ['Its weight in GSM', 'Its airflow resistance — how easily air passes through', 'Its colour', 'How tightly it is stretched'], a: 1, why: 'Sound is moving air. A cloth that air passes through freely is acoustically transparent, whatever it weighs or however taut it is.' },
      { q: 'A stretch knit passes the breath test lying on the counter. What must you still check?', opts: ['Nothing more', 'That it still passes when stretched as tight as it will be installed', 'That it is heavier than 400 GSM', 'That it has a foam backing'], a: 1, why: 'Knitted loops close up under tension, so the resistance can rise several-fold when the cloth is pulled tight.' },
      { q: 'Why is polyester usually preferred over cotton or jute for stretched fabric walls in a humid climate?', opts: ['It absorbs more sound', 'It takes up almost no moisture, so it does not lengthen and sag in the monsoon', 'It is always fire-proof', 'It is heavier'], a: 1, why: 'Natural fibres swell and grow about one percent longer when humid, which shows as ripples and bellies; polyester stays the length it was installed.' },
      { q: 'A seller lists a thin “acoustic fabric” with a very high absorption figure of its own. What is the sensible response?', opts: ['Buy it — the number proves it works', 'Ask what it was tested over, and breath-test a sample; a thin cloth alone absorbs very little', 'Use two layers to double the figure', 'Glue it directly to the wall'], a: 1, why: 'A thin cloth by itself absorbs little; such figures usually belong to the whole panel. The cloth’s job is to let sound through to a real absorber.' },
      { q: 'You are covering yellow glass-wool panels with a pale, open-weave cloth. What should go between them?', opts: ['Nothing', 'A sheet of vinyl', 'A white breathable liner or wadding', 'A coat of paint on the cloth'], a: 2, why: 'A liner holds loose fibres in and stops the core colour showing through. Under light cloth it should be white; it must still pass the breath test.' },
    ],
  });

  /* =====================================================================
     Lesson M38 — installing fabric
     ===================================================================== */
  window.LESSONS.push({
    id: 'm-fabric-install', n: 'M38', track: 'master', title: 'Installing Fabric for a Neat Finish: Wrapped Panels, Tracks and Stretched Walls', level: 'Core', mins: 60,
    summary: 'How to get the crisp, calm fabric finish of a professional room: wrapping panels with straight weave and identical corners, stretching whole walls into tracks — or into home-made equivalents when track is not available — building clouds that stay flat and safe, and briefing a local upholsterer to do it.',
    tags: ['fabric', 'installation', 'wrapped panel', 'track system', 'stretched wall', 'upholstery', 'staples', 'corners', 'cloud', 'India', 'finish', 'spline'],
    sections: [
      { h: 'Three families of finish', html: `
        <p>The cloth from <a href="#/academy/m-fabric">M37</a> reaches the room in one of three ways. Each has its own carpentry, cost and look.</p>
        ${SVG_FAMILIES}
        ${tbl(['', 'A · Wrapped panels', 'B · Site-stretched walls', 'C · Clouds and ceilings'], [
          ['Made', 'On a table, then hung', 'In place, on the wall', 'On a table, then lifted and hung'],
          ['Look', 'Separate objects with gaps or butt joints', 'One continuous surface with hairline joints', 'Floating planes'],
          ['Hides', 'Only what is behind each panel', 'Everything: treatment, cables, uneven walls', 'Ceiling treatment, lights, sprinklers'],
          ['Skill', 'Low to medium — a good first project', 'Medium to high', 'Medium, plus structural care'],
          ['Access later', 'Lift the panel off', 'Needs planned removable bays', 'Lower or unclip'],
          ['Best for', 'Home studios, phased budgets, rented rooms', 'Professional “architectural” finish', 'First-reflection control, tall rooms'],
        ])}
        <div class="callout mentor"><b>The finish people admire in professional rooms is mostly family B:</b> whole walls skinned floor to ceiling, joints every 1.2–1.4 m, a tougher band at the bottom, and wrapped clouds above. It looks like quiet architecture rather than “acoustic treatment” — and it is achievable with ordinary materials if the setting-out is careful.</div>` },
      { h: 'Wrapped panels: core, frame and edges', html: `
        <p>A wrapped panel is only as crisp as its edge. Soft wool slabs have soft, crumbly edges; cloth pulled over them rounds off unevenly and dents the first time someone leans on it.</p>
        ${tbl(['Edge method', 'How', 'Result'], [
          ['Timber frame', 'A light frame (say 19 × 45 mm softwood, or the panel thickness) around the slab, corners glued and pinned, core flush with the face', 'The crispest and toughest edge; gives something to staple into; adds a little weight'],
          ['Hardened edge', 'Brush the slab edges with diluted wood glue or a resin hardener and let it dry; staple into a thin back board or glue the cloth to the back', 'Frameless and light; needs rigid, dense slabs; edges stay fragile'],
          ['Back board with spacers', 'Thin plywood or hardboard back, perimeter battens, wool in the tray', 'Strong and easy to hang; the back blocks the air gap, so use only against a wall'],
        ])}
        <ul>
          <li><b>Edge profile</b>: square for a sharp modern look; a small bevel where panels butt together; a radius with wadding for a soft upholstered look. Try them in the edge-detail tool further down.</li>
          <li><b>Keep the core flush</b> with the frame face, or 1–2 mm proud. A core that sits back leaves a visible “picture frame” shadow under the lights.</li>
          <li><b>Do not block the back</b> of panels that will hang off the wall or as clouds — an open, lined back lets the air gap work.</li>
          <li><b>Liner first</b>: staple the liner lightly, then the face cloth over it as a separate layer.</li>
        </ul>`, viz: 'edgeDetail' },
      { h: 'Wrapping step by step', html: `
        <p>Work on a clean, padded table larger than the panel. Wash your hands. Cut the cloth with the weave — pull one thread out to get a perfectly straight cutting line.</p>
        ${SVG_STAPLE}
        ${flow([['Lay out', 'Cloth face-down, liner, then panel face-down. Weave parallel to the edge; equal margin all round.'], ['Centres', 'One staple at the middle of each side: north, south, east, west.'], ['Outwards in pairs', 'A few staples toward the corners, then the same on the opposite side. Staples 20–30 mm apart.'], ['Check the face', 'Flip it. Weave straight? No drag lines? If not, lift staples now.'], ['Corners', 'All four the same way.'], ['Back', 'Trim, cover the back, fit hanging hardware.']])}
        <div class="callout physics"><b>How tight?</b> Firm hand tension — the feeling of smoothing a bed sheet — is right for woven cloth. If the weave lines bend toward a staple, that spot is over-pulled. Stretch knits need more pull, evenly, and should be left an hour and re-checked.</div>
        <ul>
          <li>Staples: 8–10 mm leg for softwood frames, 6 mm for thin boards. Set the gun so the crown sits flat on the cloth without cutting it.</li>
          <li>Staple <b>parallel</b> to the edge, 10–15 mm in from it, on the back — never on the visible edge.</li>
          <li>For a hardened frameless slab, use spray contact adhesive on the back margin only. <b>Never spray adhesive on the face</b>: it soaks into the weave and seals it.</li>
        </ul>`, viz: 'wrapSequence' },
      { h: 'Corners that match', html: `
        <p>Corners are where amateurs are found out. There are two reliable methods; pick one per job.</p>
        ${SVG_CORNER}
        <ul>
          <li>Put the fold line on the <b>top and bottom</b> edges of wall panels (seen least), and on the edges facing away from the door on clouds.</li>
          <li>Keep the fold exactly on the arris of the panel so the corner looks like a mitre, not a pleat.</li>
          <li>For thick cloth, trim away hidden layers inside the fold to reduce bulk, leaving at least 15 mm.</li>
          <li>A dab of fabric glue inside a cut corner stops fraying; keep it off the visible face.</li>
          <li>Rounded corners: make several small pleats on the back, evenly spaced, and staple each — like upholstering a chair seat.</li>
        </ul>
        <div class="callout mentor">Make a small practice frame and do ten corners before touching the real cloth. The tenth will be twice as good as the first, and it costs twenty minutes.</div>` },
      { h: 'Hanging panels and setting the gaps', html: `
        ${tbl(['Fixing', 'How it works', 'Good for', 'Watch'], [
          ['Split batten (French cleat)', 'Two bevelled timber strips, one on the wall, one on the panel, hook together', 'Heavy wall panels; easy lift-off', 'Adds 15–20 mm stand-off — often useful as an air gap'],
          ['Z-clips', 'Interlocking metal clips screwed to wall and panel', 'Slim stand-off; precise', 'Need accurate setting out; allow lift height above the panel'],
          ['Impaling clips + adhesive', 'Spiked plates on the wall bite into the slab; adhesive holds', 'Frameless panels', 'Permanent; damages the slab on removal'],
          ['Hook-and-loop strips', 'Industrial self-grip tape on frame and wall', 'Light panels, access covers', 'Glue fails in heat — screw or staple the wall half'],
          ['Magnets', 'Rare-earth magnets in the frame, steel plates on the wall', 'Access panels over junction boxes', 'Only for light panels; add a safety cord overhead'],
          ['Stand-off brackets', 'Angle brackets or blocks giving 50–100 mm gap', 'Extending low-frequency absorption', 'Close the sides or accept the visible gap'],
        ])}
        <p><b>Gaps.</b> Separate panels look deliberate when every gap is identical and every top edge is on one laser line. Cut a pair of spacer blocks — 8, 10 or 12 mm — and use them at every joint. Paint the wall black or the wall colour behind gaps first. Start setting out from the centre of the wall, or from the feature that the eye lands on (the screen, the window), and let the leftover fall equally at both ends.</p>
        <div class="callout warn">Mark the back of every panel with its position and an “up” arrow before taking it off the table. Cloth looks a different shade upside down.</div>` },
      { h: 'Site-stretched track systems', html: `
        <p>In a track system the cloth is not wrapped round anything. Slim plastic or aluminium tracks with spring-like gripping jaws are fixed around the edge of each bay; wool is fitted between them, flush with the track face; and the cloth is laid over and pushed into the jaws with a blunt tool.</p>
        ${SVG_TRACK}
        ${flow([['Set out', 'Mark bays on the wall with a laser: joints no wider apart than the roll width minus about 100 mm.'], ['Battens', 'Fix true, plumb battens wherever a track will go. Pack them out so all faces are in one plane.'], ['Tracks', 'Fix perimeter tracks first, then mid-wall tracks, mitred at corners.'], ['Infill', 'Fit wool between battens, flush with the track face; line it.'], ['Hang the cloth', 'Tack the top with a few tucks, weave plumb to the laser line.'], ['Tuck', 'Work from the middle of each edge toward the corners, opposite sides in turn. Trim spare cloth as you go.']])}
        <p><b>Why the joints are where they are.</b> A 54-inch cloth is 1.37 m wide. Allow 50 mm each side to tuck, and the widest bay is about 1.27 m; with 60-inch cloth, about 1.42 m. That is exactly the 1.2–1.4 m rhythm you see in professional rooms. The joints are not decoration — they are the width of the roll, set out evenly.</p>
        <ul>
          <li><b>Inside corners</b>: a track on each wall, cloth tucked into both. <b>Outside corners</b>: a corner track, or wrap the cloth round a rounded batten and tuck beyond it.</li>
          <li><b>Sockets, switches, grilles</b>: frame each with a small ring of track or a trim plate. Cut the cloth in an X smaller than the opening and tuck the flaps.</li>
          <li><b>Doors and windows</b>: track runs along the frame or architrave; keep 150 mm of solid batten for it.</li>
          <li><b>Removable bays</b>: where tie-lines, junction boxes or dampers live, make the bay a lift-off frame on magnets or hook-and-loop instead.</li>
          <li><b>Releasing</b>: hook the cloth out with the tool, do the work, re-tuck. This is the great advantage over stapling.</li>
        </ul>`, viz: 'trackWallBuilder' },
      { h: 'In India, when proprietary track is not available', html: `
        <p>Imported track systems exist in the big cities but are expensive and need trained fitters. The same result — taut cloth, hairline joints, releasable bays — can be made with ordinary joinery. A good carpenter and a good sofa upholsterer together can do all four of these.</p>
        ${SVG_ALT}
        ${tbl(['Method', 'How', 'Strengths', 'Weaknesses'], [
          ['Kerf and spline', 'Rout or saw a groove about 4–5 mm wide and 10–12 mm deep along the centre of each batten (or use aluminium insect-screen frame section). Lay the cloth over, press rubber spline cord in with a spline roller.', 'Closest to real track: hairline joint, re-tensionable, releasable. Materials from any mosquito-mesh fabricator.', 'Groove width must suit cloth + cord; test with off-cuts. Two cloths in one groove need a slightly wider kerf.'],
          ['Staple and cover bead', 'Staple both cloths to the batten face; hide the staple line under a slim timber, aluminium flat or fabric-wrapped strip, pinned or screwed.', 'Easiest and most robust. Beads become a design feature.', 'Visible strips; cloth must be un-pinned to release.'],
          ['Back-tack strip', 'Staple the cloth face-down through a strip of stiff card or thin plastic along the starting edge, then fold it back over the strip and pull across the bay.', 'Perfectly straight edge with no visible fixing. Standard upholstery skill.', 'Only for the starting edge; the far edge still needs a bead, kerf or a return round the frame.'],
          ['Slim lift-off frames', 'Build each bay as a light frame, wrap it like a panel, and fix to the wall grid with hook-and-loop, magnets or concealed clips. Butt frames tight.', 'Made on the bench; every bay is an access panel.', 'Needs very accurate frames; joints are double thickness.'],
        ])}
        <div class="callout mentor"><b>A practical hybrid.</b> Back-tack the top edge for a clean ceiling line; kerf-and-spline the vertical joints; and finish the bottom under a screwed-on skirting band. One trim, at the floor, where it protects the cloth anyway.</div>
        <p>Use seasoned, straight timber (or aluminium box section) for battens — green or warped wood moves as it dries in an air-conditioned room and will ripple the wall. Treat timber against termites (<a href="#/academy/m-india">M32</a>).</p>` },
      { h: 'Preparing what is behind the cloth', html: `
        <p>Stretched cloth is honest: it shows the plane of whatever holds it. Time spent on the substrate is what separates a calm wall from a wavy one.</p>
        <ul>
          <li><b>True and plumb.</b> Set battens to a laser line and a long straight-edge, packing behind them. Old masonry walls can be 20–30 mm out; the batten grid, not the wall, defines the finished surface.</li>
          <li><b>One plane.</b> Battens, track faces and the wool surface should all be flush. Proud wool pushes the cloth out as a pillow; recessed wool lets it drum and shows battens as ridges.</li>
          <li><b>Nothing to see.</b> Paint the cavity, battens and any pale cable or pipe matt black, or cover the wool with black liner. Cloth is more see-through under side light than you expect.</li>
          <li><b>Protect wool edges</b> with liner tucked round them so fibres cannot work out at joints.</li>
          <li><b>Finish the services first.</b> Every cable, back-box, damper and sensor must be in, tested and photographed before the cloth goes on (<a href="#/academy/m-connect">M30</a>, <a href="#/academy/m-lowvolt">M22</a>).</li>
          <li><b>Rattles.</b> Tap the grid. Fix loose battens, cable clips and ducts now; behind cloth they will buzz at exactly one bass note for ever.</li>
        </ul>
        ${SVG_WALL}` },
      { h: 'Tension, climate and timing', html: `
        <ul>
          <li><b>Install in the room’s normal conditioned state.</b> Run the air-conditioning for at least two days before and during the work, so timber and cloth settle at the humidity they will live in.</li>
          <li><b>Acclimatise the cloth</b> — unrolled loosely in the room for 24–48 hours.</li>
          <li><b>Polyester</b> can be tightened after fitting with gentle steam or warm air from a distance; small wrinkles pull out overnight. Test on an off-cut — too much heat glazes or shrinks it.</li>
          <li><b>Cotton and linen relax</b> with humidity. Pre-wash or steam them, tension firmly, and if possible fit on a humid day.</li>
          <li><b>Fabric goes on last</b>: after painting, flooring, sanding and all dusty trades, and after lights are aimed. Protect it with clean polythene until handover.</li>
          <li><b>Large bays “breathe”</b> when doors close. Leave a small hidden vent path from cavity to room, or the cloth will pump in and out.</li>
        </ul>
        <div class="callout example"><b>Use case — the August ripple.</b> A home studio finished in February with cotton-blend cloth over 1.8 m spans looked perfect. By August every bay had soft vertical ripples. Fix: an extra vertical batten halved the span, the cloth was re-tensioned on a humid day, and the two worst bays were replaced in a matching polyester. Lesson: decide for the monsoon, not for the day of handover.</div>` },
      { h: 'Seams, joints and patterns', html: `
        <ul>
          <li><b>Up the roll or along it?</b> Normally the length of the roll runs vertically, one drop per bay. <b>Railroading</b> — running the roll horizontally — covers a long low wall with no vertical joints, but only if the wall is lower than the roll width and the cloth looks right sideways.</li>
          <li><b>Keep the weft level.</b> Shine a laser line across the wall and keep one horizontal thread on it from bay to bay. The eye forgives a joint; it does not forgive a weave that climbs.</li>
          <li><b>Track joint or sewn seam?</b> A joint at a track is crisp and intentional. A sewn seam in the middle of a bay shows as a ridge and should be avoided on walls; on a very wide ceiling a flat-felled seam placed on a frame member is acceptable.</li>
          <li><b>Patterns and stripes</b> must match at every joint: buy extra, cut each drop from the same point in the repeat, and number the drops in roll order.</li>
          <li><b>Shade direction</b>: every drop the same way up. Chalk an arrow on the back as it leaves the roll.</li>
        </ul>`, viz: 'fabricEstimator' },
      { h: 'Edges and trims: top, bottom and openings', html: `
        ${tbl(['Where', 'Good details', 'Why'], [
          ['Ceiling line', 'Shadow gap (10–15 mm recess painted black), or a back-tacked blind edge', 'Hides the uneven ceiling junction; no trim to keep straight'],
          ['Floor', 'Skirting band 150–300 mm high in darker, tougher cloth, timber, laminate or metal', 'Takes the kicks, mop and vacuum cleaner; easy to replace'],
          ['Outside corners', 'Rounded timber or metal corner bead under or over the cloth', 'Corners get knocked; unprotected cloth frays there first'],
          ['Door frames', 'Cloth dies into a timber architrave or metal angle', 'Robust edge where hands and equipment pass'],
          ['Windows', 'Cloth returns into the reveal to a bead; keep clear of condensation', 'Wet reveals stain cloth'],
          ['Sockets and plates', 'Back-box extended to the cloth face; plate over the cloth', 'Plate hides the cut; nothing raw is visible'],
          ['Air grilles', 'Timber or metal frame around the opening, cloth tucked to it; never across the airflow unless designed as a fabric-faced diffuser', 'Cloth across a supply grille whistles, soils and blocks air'],
          ['Lights through fabric', 'Rigid ring or collar fixed to the frame; cloth trimmed to the ring; LED fittings only', 'Supports the cut edge and keeps heat off the cloth'],
        ])}
        <div class="callout mentor">The darker band along the floor seen in professional rooms is not only a style choice. It is the sacrificial zone. Design it so it can be unscrewed and re-covered in an hour.</div>` },
      { h: 'Clouds and stretched ceilings', html: `
        <p>A cloud is a wrapped panel that hangs over people’s heads, so two things change: it must stay flat with nothing behind it, and it must be impossible for it to fall.</p>
        <ul>
          <li><b>Frame</b>: timber on edge (depth matters far more than width for stiffness), glued and screwed corners, a cross brace about every 600 mm so cloth tension cannot pull the long sides in.</li>
          <li><b>Core</b>: light slabs of 32–48 kg/m³ resting on thin cross wires or mesh; liner above and below.</li>
          <li><b>Both faces finished</b>: the top is visible from mezzanines and in reflections; cover it with black liner.</li>
          <li><b>Hanging</b>: at least four points into the structural slab or joists with rated anchors, eye-bolts and wire rope or chain with locking adjusters. Add an <b>independent safety cable</b>.</li>
          <li><b>Air gap</b>: hanging 100–300 mm below the ceiling makes the cloud work on both faces and to lower frequencies (<a href="#/academy/m-treat-designs">M18</a>).</li>
          <li><b>Lights and sprinklers</b>: pass them through rigid collars; never bury a sprinkler head or a hot fitting above cloth. Agree sprinkler positions with the fire engineer before designing the cloud layout.</li>
          <li><b>Access</b>: leave a hand gap or hinge one side so fittings above can be reached.</li>
        </ul>
        <p>Whole stretched-fabric ceilings follow the wall method, with closer supports (every 600 mm or less) because gravity adds to every span.</p>`, viz: 'cloudFrame' },
      { h: 'Tools, and working with a local upholsterer', html: `
        ${tbl(['Tool', 'Use', 'Indian equivalent / where'], [
          ['Staple gun', 'Fixing cloth; manual is fine, pneumatic is faster and more even', 'Hardware and upholstery-supply shops; pneumatic upholstery guns need a small compressor'],
          ['Staples, 6–10 mm leg', '6 mm for thin boards, 8–10 mm for softwood', 'Buy galvanised or stainless for humid and coastal sites'],
          ['Tack strip / card strip', 'Back-tacking straight edges', 'Upholstery suppliers; or cut 12 mm strips from stiff card or thin plastic sheet'],
          ['Spline roller and spline cord', 'Kerf-and-spline joints', 'Insect-mesh and window fabricators'],
          ['Tucking tool', 'Pushing cloth into tracks and kerfs', 'A blunt, rounded putty knife or bone folder with polished edges'],
          ['Laser level, long straight-edge', 'Setting out joints and keeping the weave level', 'Tool hire or any site contractor'],
          ['Sharp fabric scissors, rotary cutter, fresh blades', 'Clean cuts', 'Tailoring suppliers'],
          ['Spray contact adhesive', 'Liner and wadding to frames; back margins only', 'Hardware shops; ventilate well'],
          ['Garment steamer or hot-air gun', 'Relaxing wrinkles in polyester', 'Use at a distance; test first'],
          ['Staple lifter, pliers', 'Correcting mistakes without tearing', 'Upholstery suppliers'],
        ])}
        <h4>Briefing a sofa upholsterer or curtain installer</h4>
        <p>Local upholsterers have superb hand skills for tension and corners. What they do not know is acoustics — so tell them the rules that differ from furniture.</p>
        <ul>
          <li><b>No foam, no rexine backing, no glue on the face.</b> Nothing that seals the cloth.</li>
          <li><b>Weave must run dead straight</b> and level — more important than extreme tightness.</li>
          <li><b>All corners identical</b>, fold on top and bottom.</li>
          <li><b>Staples on the back only.</b></li>
          <li>Clean hands, clean table, no tea near the cloth.</li>
        </ul>
        <p>Always commission <b>one sample panel and one sample bay</b> first, approve them under the real lights, sign and date the back, and keep them on site as the standard for the rest.</p>` },
      { h: 'Quality checklist, time and cost', html: `
        <div class="verify">
          <div class="chk">Weave lines straight, parallel to edges, level from bay to bay</div>
          <div class="chk">No puckers between staples; no diagonal drag lines</div>
          <div class="chk">All corners made the same way and equally sharp</div>
          <div class="chk">Joints plumb, evenly spaced, aligned with ceiling and floor features</div>
          <div class="chk">No read-through of core, frame or staples under the real lights</div>
          <div class="chk">Every drop the same way up; one dye lot</div>
          <div class="chk">Sockets, grilles and lights cut clean with no raw edges</div>
          <div class="chk">Nothing rattles when the wall is tapped or a bass sweep is played</div>
          <div class="chk">Access bays work and are marked on the as-built drawing</div>
          <div class="chk">Cloth still passes the breath test as installed, liner included</div>
          <div class="chk">Flame-test certificate and spare cloth handed over</div>
        </div>
        ${tbl(['Finish', 'Rough time', 'Rough total cost per m² (materials + labour)'], [
          ['Wrapped panel, timber frame, 50 mm core, polyester cloth', '45–75 min per panel', '₹900–1800'],
          ['Stretched wall, home-made kerf or bead joints, 50–100 mm infill', '1–1.5 m² per fitter-hour', '₹1200–2500'],
          ['Stretched wall with proprietary track', '1.5–2.5 m² per fitter-hour', '₹2500–5000+'],
          ['Hung cloud, 100 mm core, both faces finished', '2–3 hours each', '₹1500–3000'],
        ])}
        <p class="small">Very rough guides that vary by city, cloth and thickness — check current local prices and get a quotation against a sample.</p>` },
      { h: 'Mistakes, fixes and apply it', html: `
        ${tbl(['Mistake', 'What you see', 'Fix'], [
          ['Stapling one whole side first', 'Diagonal drag lines, wavy weave', 'Lift and redo from the centres, working opposite sides in pairs'],
          ['Staples too far apart or cloth over-pulled at each', 'Scalloped edge, “staple shadows” on the face', 'Staples every 20–30 mm with even tension; wadding over the frame'],
          ['Spray glue on the face of the core', 'Stiff patches; treble absorption lost', 'Glue only on back margins; replace affected cloth'],
          ['Frame too light for the tension', 'Long sides bow inward; hourglass panel', 'Deeper timber, cross braces every 600 mm'],
          ['Cotton fitted in dry season', 'Ripples after the first monsoon', 'Extra supports, re-tension humid, or change to polyester'],
          ['Joints set out from one end', 'A thin sliver bay at the far end', 'Set out from the centre; equal bays'],
          ['Sagging stretched ceiling', 'Belly between supports', 'Supports at 600 mm or less; lighter core; re-tension'],
          ['No access planned', 'Cloth cut open to reach a cable', 'Lift-off bays at every junction box and patch point'],
          ['Cloth fitted before the dusty trades finished', 'Grey film that will not vacuum out', 'Fabric last; polythene protection until handover'],
        ])}
        ${myth([
          ['“Tighter is always neater.”', 'Over-tension bends the weave, bows frames and, with knits, closes the cloth acoustically. Straight and even beats tight.'],
          ['“You need imported track for a professional result.”', 'Track is quicker, not magic. A kerf-and-spline or bead joint, accurately set out, looks every bit as deliberate.'],
          ['“Glue the cloth on — it is quicker.”', 'Glue through the face seals the weave and cannot be undone. Mechanical fixing at the edges only.'],
        ])}
        <div class="callout data"><b>Rules of thumb.</b>
          <ul style="margin:.4em 0 0;padding-left:18px">
            <li>Centres first, opposite sides in pairs, corners last.</li>
            <li>Staples 20–30 mm apart, on the back, parallel to the edge.</li>
            <li>Widest bay = roll width − 100 mm. Set out from the centre.</li>
            <li>Unsupported span of cloth: under about 1.4 m on walls, 0.6 m on ceilings.</li>
            <li>Battens, track and wool face in one plane; cavity black.</li>
            <li>Cross-brace frames every 600 mm; clouds on four rated fixings plus a safety cable.</li>
            <li>Fabric is the last trade in and the first thing protected.</li>
            <li>One approved sample panel is the specification.</li>
          </ul></div>
        <div class="callout example"><b>Apply it.</b> Build one 600 × 1200 mm framed panel this weekend: timber frame, 50 mm slab flush with the face, black liner, your tested cloth. Follow the wrapping tool step by step, make four identical corners, hang it on a split batten and look at it under a torch held flat to the surface. Then draw the longest wall of your room in the track-wall builder, choose a roll width, and set out equal bays that respect the door and sockets. With those two exercises you have the whole craft in miniature.</div>` },
    ],
    quiz: [
      { q: 'In what order should staples go in when wrapping a panel?', opts: ['Down one long side, then the next, working round', 'Corners first, then the middles', 'Centre of each side first, then outwards on opposite sides in pairs, corners last', 'Randomly, as long as it is tight'], a: 2, why: 'Starting at the centres and alternating opposite sides keeps tension balanced and the weave straight; corners are closed last.' },
      { q: 'Why do stretched-fabric walls in professional rooms show vertical joints roughly every 1.2–1.4 m?', opts: ['That is the spacing of the wall studs by law', 'It matches the wavelength of speech', 'It is the width of the fabric roll less the allowance for tucking each side', 'Wider bays would absorb less'], a: 2, why: 'Cloth comes 54–60 inches wide; after about 50 mm is tucked each side, the widest possible bay is around 1.27–1.42 m.' },
      { q: 'Proprietary track is not available. Which home-made joint gives a hairline, releasable, re-tensionable result most like it?', opts: ['Gluing the cloth to the wool', 'A groove (kerf) in the batten with rubber spline cord rolled in', 'Nailing through the face of the cloth', 'Double-sided tape'], a: 1, why: 'The kerf-and-spline joint, borrowed from insect-screen frames, grips the cloth in a groove and can be released and re-tensioned.' },
      { q: 'Why should adhesive never be sprayed over the face of the core before the cloth goes on?', opts: ['It is too expensive', 'It soaks into the weave and seals it, so sound can no longer pass', 'It makes the cloth too loose', 'It changes the colour of the staples'], a: 1, why: 'Glue fills the open spaces between yarns and turns a breathable cover into a reflective one. Fix cloth mechanically at the edges only.' },
      { q: 'A 2.4 m timber-framed cloud is going over the mix position. Which statement is correct?', opts: ['Two screws into the plasterboard ceiling are enough', 'It should hang from rated fixings into the structure at four or more points, with cross braces and an independent safety cable', 'Heavier, denser slabs make it safer', 'The frame timber should be laid flat to keep it slim'], a: 1, why: 'Overhead loads need structural fixings with a generous safety factor and a back-up cable; timber on edge and cross braces keep the frame flat under cloth tension.' },
    ],
  });
})();
