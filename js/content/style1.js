/* ==========================================================================
   Reading great studios: a design language (M35) and designing an immersive
   mix room / living-room cinema (M36).
   Original text written as general design teaching; typical guidance values.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|design|solution|hidden/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const tbl = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c, i) => `<td>${i ? c : `<b>${c}</b>`}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const C1 = '#7a5cc7', C2 = '#c7772b', C3 = '#2b9fc7', C4 = '#4c9a3a', C5 = '#d14b8f', C6 = '#c7a12b';
  const rings = (cx, cy, col, n = 3, r0 = 10, dr = 14) => Array.from({ length: n }, (_, i) => `<circle class="lock-wave${i ? ' d' + Math.min(3, i + 1) : ''}" cx="${cx}" cy="${cy}" r="${r0 + i * dr}" fill="none" stroke="var(--${col})" stroke-width="1.6"/>`).join('');
  const wool = (x, y, w, h, col = 'c3') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--${col})" opacity=".22"/>` + Array.from({ length: Math.floor(w / 9) }, (_, i) => `<path d="M${x + 4 + i * 9} ${y + 2} q4 ${h / 2 - 2} 0 ${h - 4}" fill="none" stroke="var(--${col})" stroke-width=".8"/>`).join('');

  /* =====================================================================
     SVGs — design language
     ===================================================================== */
  const SVG_SKIN = `<svg class="gsvg" viewBox="0 0 680 250" role="img" aria-label="One fabric skin hiding several depths of treatment">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">One calm skin, many depths behind it (plan view of a wall)</text>
    <rect x="20" y="206" width="640" height="16" fill="var(--muted)" opacity=".55"/><text x="340" y="240" text-anchor="middle" font-size="10">heavy structural wall (the isolation shell)</text>
    ${wool(24, 66, 150, 140, 'c1')}<rect x="40" y="126" width="118" height="34" rx="4" fill="var(--bg)" opacity=".85"/><text x="99" y="140" text-anchor="middle" font-size="10" font-weight="700">deep bass trap</text><text x="99" y="154" text-anchor="middle" font-size="9">400–600 mm, loose fill</text>
    ${wool(182, 146, 150, 60)}<rect x="206" y="168" width="102" height="17" rx="4" fill="var(--bg)" opacity=".85"/><text x="257" y="180" text-anchor="middle" font-size="10" font-weight="700">100 mm absorber</text><rect x="182" y="66" width="150" height="80" fill="none" stroke="var(--line)" stroke-dasharray="3 3"/><text x="257" y="110" text-anchor="middle" font-size="9">air gap = free low-mid</text>
    <rect x="340" y="120" width="150" height="86" fill="var(--c2)" opacity=".18"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${346 + i * 20}" y="${[130, 150, 124, 160, 138, 152, 128][i]}" width="16" height="${206 - [130, 150, 124, 160, 138, 152, 128][i]}" fill="var(--c2)" opacity=".7"/>`).join('')}<text x="415" y="110" text-anchor="middle" font-size="10" font-weight="700">diffuser behind cloth</text>
    <rect x="498" y="96" width="158" height="110" fill="var(--panel2)" stroke="var(--line)"/><rect x="540" y="100" width="72" height="92" rx="4" fill="var(--text)" opacity=".8"/><circle cx="576" cy="126" r="9" fill="var(--bg)"/><circle cx="576" cy="162" r="16" fill="var(--bg)"/><text x="577" y="88" text-anchor="middle" font-size="10" font-weight="700">hidden loudspeaker</text>
    <line x1="20" y1="60" x2="660" y2="60" stroke="var(--accent2)" stroke-width="3"><animate attributeName="opacity" values="1;.25;1" dur="5s" repeatCount="indefinite"/></line>
    ${[176, 336, 494].map((x) => `<line x1="${x}" y1="52" x2="${x}" y2="68" stroke="var(--text)" stroke-width="1.5"/>`).join('')}
    <text x="24" y="50" font-size="10" fill="var(--accent2)" font-weight="700">stretched fabric — what the eye sees</text><text x="656" y="50" text-anchor="end" font-size="9">joints every ≈ 1.2 m</text>
    ${[257, 415].map((x, i) => `<path class="wave-in" d="M${x} 24 v30" stroke="var(--accent)" stroke-width="2.4" fill="none" style="animation-delay:${i * 0.35}s"/><path d="M${x - 5} 50 l5 8 l5 -8" fill="var(--accent)"/>`).join('')}
    <text x="336" y="38" text-anchor="middle" font-size="10">sound passes</text><text x="336" y="50" text-anchor="middle" font-size="10">straight through</text>
  </svg>`;

  const SVG_ZONES = `<svg class="gsvg" viewBox="0 0 680 330" role="img" aria-label="Where each kind of treatment goes in a control room">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Where things go, and why (plan of a mix room)</text>
    <rect x="110" y="34" width="460" height="270" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <rect x="114" y="38" width="452" height="26" fill="var(--c1)" opacity=".4"/><text x="340" y="55" text-anchor="middle" font-size="10" font-weight="700">① front wall — deep absorption or a massive baffle</text>
    <path d="M114 64 l40 0 l-40 40 z" fill="var(--c1)" opacity=".7"/><path d="M566 64 l-40 0 l40 40 z" fill="var(--c1)" opacity=".7"/>
    <path d="M114 300 l44 0 l-44 -44 z" fill="var(--c1)" opacity=".7"/><path d="M566 300 l-44 0 l44 -44 z" fill="var(--c1)" opacity=".7"/>
    <rect x="114" y="120" width="14" height="80" fill="var(--c3)" opacity=".8"/><rect x="552" y="120" width="14" height="80" fill="var(--c3)" opacity=".8"/>
    <rect x="186" y="258" width="308" height="42" fill="var(--c1)" opacity=".45"/><text x="340" y="283" text-anchor="middle" font-size="10" font-weight="700">④ rear wall — the deepest absorber (or diffusion if &gt; 3 m behind you)</text>
    <rect x="230" y="96" width="220" height="100" fill="none" stroke="var(--c3)" stroke-width="2" stroke-dasharray="6 4"/><text x="340" y="112" text-anchor="middle" font-size="10" fill="var(--c3)" font-weight="700">③ ceiling cloud above</text>
    <rect x="232" y="72" width="26" height="34" rx="3" fill="var(--text)" transform="rotate(-28 245 89)"/><rect x="422" y="72" width="26" height="34" rx="3" fill="var(--text)" transform="rotate(28 435 89)"/>
    <circle cx="340" cy="186" r="9" fill="var(--good)"/><text x="340" y="210" text-anchor="middle" font-size="10">seat ≈ 38 % of the length</text>
    <path class="leak-pulse" d="M250 96 L128 150 L334 184" fill="none" stroke="var(--accent)" stroke-width="1.8"/><path class="leak-pulse" d="M430 96 L552 150 L346 184" fill="none" stroke="var(--accent)" stroke-width="1.8"/>
    <rect x="262" y="222" width="156" height="26" rx="8" fill="var(--c6)" opacity=".7"/><text x="340" y="239" text-anchor="middle" font-size="10">⑥ sofa: absorber you can sit on</text>
    <rect x="270" y="130" width="140" height="28" rx="3" fill="var(--c2)" opacity=".5"/><text x="340" y="148" text-anchor="middle" font-size="9">low, open desk</text>
    <text x="100" y="164" text-anchor="end" font-size="10" font-weight="700">② side mirror</text><text x="100" y="177" text-anchor="end" font-size="10">points</text>
    <text x="580" y="80" font-size="10" font-weight="700">⑤ corners:</text><text x="580" y="93" font-size="10">traps behind</text><text x="580" y="106" font-size="10">a straight skin</text>
    <text x="340" y="322" text-anchor="middle" font-size="10">Left and right are mirror images. Depth goes where bass pressure is highest: rear wall, front wall, corners.</text>
  </svg>`;

  const cloudRow = (x, title, body, note) => `<g transform="translate(${x} 0)"><rect x="0" y="34" width="150" height="8" fill="var(--muted)" opacity=".6"/>${body}<rect x="0" y="150" width="150" height="5" fill="var(--c2)" opacity=".6"/><text x="75" y="174" text-anchor="middle" font-size="10" font-weight="700">${title}</text><text x="75" y="188" text-anchor="middle" font-size="9">${note}</text></g>`;
  const SVG_CLOUDS = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Four ways to build a ceiling cloud">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Four cloud families (sections through the ceiling)</text>
    ${cloudRow(12, 'Flat cloud on a gap', `${wool(20, 70, 110, 14)}<line x1="34" y1="42" x2="34" y2="70" stroke="var(--text)"/><line x1="116" y1="42" x2="116" y2="70" stroke="var(--text)"/><path class="wave-in" d="M75 140 v-52" stroke="var(--accent)" stroke-width="2" fill="none"/><path class="wave-in" d="M132 140 q10 -50 -20 -84" stroke="var(--accent2)" stroke-width="1.6" fill="none" style="animation-delay:.6s"/>`, 'back and edges work too')}
    ${cloudRow(178, 'Staggered array', `${wool(4, 60, 44, 10)}${wool(54, 82, 44, 10)}${wool(104, 60, 44, 10)}${[14, 38, 64, 88, 114, 138].map((q, i) => `<line x1="${q}" y1="42" x2="${q}" y2="${i === 2 || i === 3 ? 82 : 60}" stroke="var(--text)" stroke-width=".8"/>`).join('')}`, 'hard strips keep the life')}
    ${cloudRow(344, 'Pitched planes', `<path d="M0 42 L75 20 L150 42" fill="none" stroke="var(--muted)" stroke-width="6" opacity=".6"/><g transform="rotate(-16 40 56)">${wool(8, 54, 62, 10)}</g><g transform="rotate(16 110 56)">${wool(80, 54, 62, 10)}</g><circle cx="72" cy="48" r="3" fill="var(--c6)"><animate attributeName="opacity" values="1;.4;1" dur="3s" repeatCount="indefinite"/></circle>`, 'follows the roof, hides light')}
    ${cloudRow(510, 'Coffer inset', `${[0, 50, 100].map((q) => `<rect x="${q + (q ? 0 : 0)}" y="42" width="8" height="34" fill="var(--text)"/>`).join('')}<rect x="142" y="42" width="8" height="34" fill="var(--text)"/>${wool(10, 60, 38, 12)}${wool(60, 60, 38, 12)}${wool(110, 60, 30, 12)}<circle cx="29" cy="74" r="2.5" fill="var(--c6)"/><circle cx="79" cy="74" r="2.5" fill="var(--c6)"/><circle cx="125" cy="74" r="2.5" fill="var(--c6)"/>`, 'beam grid hides everything')}
  </svg>`;

  const SVG_LIGHT = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Quiet light and quiet air">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Quiet light and quiet air</text>
    <rect x="20" y="30" width="300" height="14" fill="var(--muted)" opacity=".6"/><rect x="20" y="44" width="16" height="150" fill="var(--accent2)" opacity=".35"/>
    <circle cx="70" cy="48" r="5" fill="var(--c6)"/><path d="M66 50 L36 60 L36 190 L60 190 Z" fill="var(--c6)" opacity=".28"><animate attributeName="opacity" values=".34;.2;.34" dur="4s" repeatCount="indefinite"/></path>
    <text x="80" y="66" font-size="10" font-weight="700">wall-washer close to the fabric</text><text x="80" y="80" font-size="10">grazing light shows the weave,</text><text x="80" y="94" font-size="10">gives a dark room shape</text>
    <rect x="200" y="150" width="90" height="26" rx="3" fill="var(--panel2)" stroke="var(--line)"/><text x="245" y="167" text-anchor="middle" font-size="9">driver in a cupboard</text><path d="M200 163 H120 V54 H76" fill="none" stroke="var(--text)" stroke-dasharray="3 3"/>
    <text x="170" y="212" text-anchor="middle" font-size="10">no buzzing driver or fan in the room</text>
    <rect x="360" y="30" width="300" height="14" fill="var(--muted)" opacity=".6"/><rect x="380" y="44" width="200" height="40" fill="var(--panel2)" stroke="var(--line)"/>${wool(384, 48, 192, 8, 'c4')}${wool(384, 72, 192, 8, 'c4')}
    <rect x="580" y="44" width="60" height="70" fill="var(--panel2)" stroke="var(--line)"/><rect x="590" y="110" width="40" height="5" fill="var(--text)"/>
    ${[0, 1, 2, 3].map((i) => `<circle r="3" fill="var(--c4)"><animateMotion dur="5s" begin="${i * 1.25}s" repeatCount="indefinite" path="M384 64 H606 V150"/><animate attributeName="opacity" values="0;1;1;0" dur="5s" begin="${i * 1.25}s" repeatCount="indefinite"/></circle>`).join('')}
    <text x="480" y="102" text-anchor="middle" font-size="10" font-weight="700">large lined duct, slow air</text><text x="610" y="134" text-anchor="middle" font-size="10">long slot</text>
    <text x="510" y="176" text-anchor="middle" font-size="10">Halve the air speed and the hiss drops by</text><text x="510" y="190" text-anchor="middle" font-size="10">roughly 15–18 dB. Size is silence.</text>
    <text x="510" y="212" text-anchor="middle" font-size="10">You feel the fresh air; you do not hear it.</text>
  </svg>`;

  const SVG_READ = `<svg class="gsvg" viewBox="0 0 680 290" role="img" aria-label="Reading a photograph of a studio in six steps">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Reading a photograph in six steps</text>
    <rect x="30" y="30" width="400" height="240" rx="6" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <path d="M30 70 L120 100 H340 L430 70" fill="none" stroke="var(--line)" stroke-width="1.5"/><path d="M120 100 V214 M340 100 V214" stroke="var(--line)" stroke-width="1.5"/><path d="M30 250 L120 214 H340 L430 250" fill="none" stroke="var(--line)" stroke-width="1.5"/>
    ${[150, 180, 210, 240, 270, 300].map((x) => `<line x1="${x}" y1="100" x2="${x}" y2="214" stroke="var(--line)" stroke-width=".7"/>`).join('')}
    <rect x="160" y="52" width="140" height="10" fill="var(--c3)" opacity=".7" transform="skewX(-8)"/><rect x="150" y="150" width="22" height="50" fill="var(--text)"/><rect x="288" y="150" width="22" height="50" fill="var(--text)"/><rect x="196" y="186" width="68" height="14" fill="var(--c2)" opacity=".7"/>
    <path d="M92 230 H350 L372 244 H66 Z" fill="var(--c5)" opacity=".45"/><rect x="352" y="120" width="60" height="6" fill="var(--text)" opacity=".7"/>
    ${[['1', 380, 60], ['2', 230, 140], ['3', 100, 150], ['4', 382, 112], ['5', 230, 46], ['6', 210, 212]].map(([n, x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="var(--accent)"><animate attributeName="r" values="11;13;11" dur="2.4s" begin="${(+n) * 0.4}s" repeatCount="indefinite"/></circle><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent-ink)">${n}</text>`).join('')}
    <g font-size="11"><text x="452" y="52"><tspan font-weight="700">1 Count the surfaces.</tspan></text><text x="452" y="66">Six sides: which are soft, hard, glass?</text>
    <text x="452" y="92"><tspan font-weight="700">2 Find the speaker geometry.</tspan></text><text x="452" y="106">Triangle, height, distance to walls.</text>
    <text x="452" y="132"><tspan font-weight="700">3 Find the hidden depth.</tspan></text><text x="452" y="146">Door reveals and sills give it away.</text>
    <text x="452" y="172"><tspan font-weight="700">4 Find the air path.</tspan></text><text x="452" y="186">Slots, grilles, bulkheads.</text>
    <text x="452" y="212"><tspan font-weight="700">5 Find the quiet lighting.</tspan></text><text x="452" y="226">Where is it, what does it graze?</text>
    <text x="452" y="252"><tspan font-weight="700">6 Find the cable path.</tspan></text><text x="452" y="266">Plates, trenches, the back of the desk.</text></g>
  </svg>`;

  /* =====================================================================
     SVGs — immersive room
     ===================================================================== */
  const pol = (cx, cy, r, deg) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)];
  const SVG_ANGLES = `<svg class="gsvg" viewBox="0 0 680 320" role="img" aria-label="Ear-level loudspeaker directions around the seat">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Ear-level layer: directions from the seat (generic targets)</text>
    <circle cx="340" cy="170" r="120" fill="none" stroke="var(--line)" stroke-dasharray="4 4"/>
    ${[[-30, 'L'], [0, 'C'], [30, 'R'], [-60, 'wide'], [60, 'wide'], [-90, 'side'], [90, 'side'], [-140, 'rear'], [140, 'rear']].map(([d, n], i) => { const [x, y] = pol(340, 170, 120, d), [tx, ty] = pol(340, 170, 146, d); const wide = n === 'wide'; return `<line x1="340" y1="170" x2="${x}" y2="${y}" stroke="var(--${wide ? 'muted' : 'accent'})" stroke-width="1.2" ${wide ? 'stroke-dasharray="3 3"' : ''}/><rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="3" fill="var(--${wide ? 'muted' : 'text'})" transform="rotate(${d} ${x} ${y})"/><text x="${Math.abs(d) > 45 && Math.abs(d) < 135 ? 340 + (d > 0 ? 136 : -136) : tx}" y="${ty + 4}" text-anchor="${Math.abs(d) > 45 && Math.abs(d) < 135 ? (d > 0 ? 'start' : 'end') : 'middle'}" font-size="10" font-weight="700">${n} ${d === 0 ? '0°' : (d > 0 ? '+' : '−') + Math.abs(d) + '°'}</text>`; }).join('')}
    <circle cx="340" cy="170" r="10" fill="var(--good)"/>${rings(340, 170, 'good', 2, 16, 12)}
    <text x="340" y="196" text-anchor="middle" font-size="10">reference seat</text>
    <rect x="30" y="204" width="150" height="74" rx="8" fill="var(--panel2)" stroke="var(--line)"/><text x="105" y="222" text-anchor="middle" font-size="10" font-weight="700">Three rules</text><text x="105" y="238" text-anchor="middle" font-size="9">same distance if you can</text><text x="105" y="252" text-anchor="middle" font-size="9">left = mirror of right</text><text x="105" y="266" text-anchor="middle" font-size="9">all aimed at the seat</text>
    <rect x="500" y="204" width="160" height="74" rx="8" fill="var(--panel2)" stroke="var(--line)"/><text x="580" y="222" text-anchor="middle" font-size="10" font-weight="700">When distances differ</text><text x="580" y="238" text-anchor="middle" font-size="9">delay the nearer speaker:</text><text x="580" y="252" text-anchor="middle" font-size="9">≈ 2.9 ms per metre</text><text x="580" y="266" text-anchor="middle" font-size="9">then trim its level</text>
    <text x="340" y="312" text-anchor="middle" font-size="10">Each format publishes its own tolerance windows — always design to the current specification.</text>
  </svg>`;

  const SVG_ELEV = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Height loudspeaker elevation window">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Overhead layer: the elevation window (side section)</text>
    <rect x="40" y="34" width="600" height="10" fill="var(--muted)" opacity=".6"/><rect x="40" y="196" width="600" height="8" fill="var(--c2)" opacity=".6"/>
    <circle cx="340" cy="150" r="9" fill="var(--good)"/><line x1="40" y1="150" x2="640" y2="150" stroke="var(--line)" stroke-dasharray="3 5"/><text x="46" y="144" font-size="9">ear height ≈ 1.2 m</text>
    <path d="M340 150 L141 46 L274 46 Z" fill="var(--accent2)" opacity=".2"><animate attributeName="opacity" values=".12;.3;.12" dur="4s" repeatCount="indefinite"/></path><path d="M340 150 L539 46 L406 46 Z" fill="var(--accent2)" opacity=".2"><animate attributeName="opacity" values=".12;.3;.12" dur="4s" repeatCount="indefinite"/></path>
    <rect x="224" y="44" width="24" height="12" fill="var(--text)"/><rect x="432" y="44" width="24" height="12" fill="var(--text)"/>
    <line x1="340" y1="150" x2="236" y2="50" stroke="var(--accent)" stroke-width="1.6"/><line x1="340" y1="150" x2="444" y2="50" stroke="var(--accent)" stroke-width="1.6"/>
    <path d="M300 150 A40 40 0 0 1 311 122" fill="none" stroke="var(--text)"/><text x="262" y="142" font-size="10" font-weight="700">≈ 45°</text>
    <text x="216" y="70" text-anchor="end" font-size="10">front overhead</text><text x="464" y="70" font-size="10">rear overhead</text>
    <text x="120" y="98" text-anchor="middle" font-size="9">too shallow →</text><text x="120" y="110" text-anchor="middle" font-size="9">merges with ear level</text>
    <text x="340" y="60" text-anchor="middle" font-size="8.5">too steep: everything</text><text x="340" y="71" text-anchor="middle" font-size="8.5">sounds “overhead”</text>
    <text x="340" y="222" text-anchor="middle" font-size="10">Horizontal offset for 45° = ceiling height minus ear height. Low ceilings squeeze everything together.</text>
  </svg>`;

  const SVG_BACKBOX = `<svg class="gsvg" viewBox="0 0 680 240" role="img" aria-label="A loudspeaker hidden behind fabric in a wall">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Hiding a surround loudspeaker without spoiling it (plan section)</text>
    <rect x="30" y="34" width="620" height="18" fill="var(--muted)" opacity=".6"/><text x="640" y="30" text-anchor="end" font-size="9">isolation shell — never cut into it</text>
    ${wool(30, 52, 200, 110)}${wool(450, 52, 200, 110)}
    <rect x="240" y="60" width="200" height="106" fill="var(--panel2)" stroke="var(--text)" stroke-width="3"/><text x="340" y="76" text-anchor="middle" font-size="9">sealed, heavy, damped back-box</text>
    ${wool(248, 84, 184, 22, 'c1')}
    <rect x="296" y="112" width="88" height="50" rx="4" fill="var(--text)"/><circle cx="322" cy="150" r="9" fill="var(--bg)"/><circle cx="360" cy="146" r="13" fill="var(--bg)"/>
    <rect x="240" y="160" width="56" height="8" fill="var(--c2)"/><rect x="384" y="160" width="56" height="8" fill="var(--c2)"/><text x="268" y="184" text-anchor="middle" font-size="9">baffle flush</text><text x="412" y="184" text-anchor="middle" font-size="9">with the wall line</text>
    <line x1="30" y1="176" x2="650" y2="176" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="2 2"/><text x="36" y="194" font-size="10" fill="var(--accent2)" font-weight="700">open-weave fabric 10–20 mm in front</text>
    ${[0, 1, 2].map((i) => `<path class="lock-wave${i ? ' d' + (i + 1) : ''}" d="M${310 - i * 14} ${196 + i * 10} Q340 ${214 + i * 14} ${370 + i * 14} ${196 + i * 10}" fill="none" stroke="var(--accent)" stroke-width="1.8"/>`).join('')}
    
    <text x="560" y="210" text-anchor="middle" font-size="9">no batten or track</text><text x="560" y="222" text-anchor="middle" font-size="9">across the drivers</text>
  </svg>`;

  const SVG_SUBS = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Why two subwoofers cancel a room mode">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Why a second subwoofer makes the seats agree (first width mode)</text>
    ${[['One sub in a corner', 30, false], ['Two subs, mirror positions', 360, true]].map(([t, x, two]) => `<g transform="translate(${x} 0)"><rect x="0" y="40" width="290" height="130" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/>
      <path d="M0 ${two ? 105 : 60} ${two ? 'H290' : 'C100 60 190 150 290 150'}" fill="none" stroke="var(--accent)" stroke-width="2.5"${two ? '' : '><animate attributeName="d" values="M0 60 C100 60 190 150 290 150;M0 150 C100 150 190 60 290 60;M0 60 C100 60 190 150 290 150" dur="3s" repeatCount="indefinite"/></path'}${two ? '/>' : '>'}
      <rect x="4" y="44" width="18" height="18" fill="var(--c5)"/>${two ? '<rect x="268" y="44" width="18" height="18" fill="var(--c5)"/>' : ''}
      ${[70, 145, 220].map((sx, i) => `<circle cx="${sx}" cy="130" r="7" fill="var(--c${i + 1})"/>`).join('')}
      <text x="145" y="190" text-anchor="middle" font-size="10" font-weight="700">${t}</text><text x="145" y="204" text-anchor="middle" font-size="9">${two ? 'the mode is pushed equally from both sides and cancels' : 'left seat loud, middle seat in a hole, right seat loud'}</text></g>`).join('')}
  </svg>`;

  /* =====================================================================
     M35 — design language
     ===================================================================== */
  window.LESSONS.push({
    id: 'm-design-language', n: 'M35', track: 'master', title: 'Reading Great Studios: A Design Language You Can Learn', level: 'Core', mins: 60,
    summary: 'How to look at a finished professional room and work out what was built, where and why — the philosophy, six room archetypes, hidden treatment behind stretched fabric, placement rules, glass, timber, light, air and budget versions you can build.',
    tags: ['design language', 'stretched fabric', 'hidden treatment', 'ceiling cloud', 'slat wall', 'window behind speakers', 'aesthetics', 'lighting', 'archetypes', 'photo reading', 'finishes', 'palette'],
    sections: [
      { h: 'Why learn to read rooms', html: `
        <p>The best modern studios do not look like studios. You walk into a calm room with plain walls, a timber floor, a sofa and good light, and only when the music starts do you realise how much has been built. Learning to <b>read</b> such a room — to see the acoustic design through the interior design — is the fastest way to improve your own work, because every good room is a worked answer to the same questions you will face.</p>
        <p>This lesson distils the approach of contemporary design-and-build studio practice into a language of repeatable moves. Nothing here depends on a brand or a secret product. It depends on <b>depth, position, symmetry, quiet services and an honest brief</b>.</p>
        ${flow([['Listen first', 'A long conversation about how the client works and what they like to hear'], ['Set targets', 'Different numbers for a mix room, a writing suite, a live room'], ['Forecast', 'Show predicted isolation, noise, decay and bass response before building'], ['Let physics lead', 'Shell, geometry, depth and air path are fixed first'], ['Make it disappear', 'One calm skin over everything; furniture and light finish the room'], ['Judge by ear', 'Measure, then let working engineers listen and adjust']])}
        <div class="callout mentor"><b>The one-line philosophy.</b> Let the physics decide <i>what</i> and <i>where</i>; let the architecture decide <i>how it looks</i>. When those two are designed by the same hand, the treatment disappears.</div>` },
      { h: 'The approach: no room is “standard”', html: `
        <p>A recurring principle in good practice is that there is <b>no one-size-fits-all room</b>. Two clients with the same floor area can need opposite rooms. The first hour of a project is therefore not about products; it is about the person.</p>
        ${tbl(['Room type', 'What it is for', 'Typical priorities', 'What the client usually says'], [
          ['Critical mix room', 'Decisions that must translate everywhere', 'Flat, fast bass; controlled early reflections; very low noise', '“I need to trust what I hear at any level.”'],
          ['Mastering room', 'The last pair of ears', 'Full-range accuracy to the lowest octave, wide sweet spot, almost no gear in the sound path', '“Nothing between me and the speakers.”'],
          ['Production / writing suite', 'Long creative days with several people', 'Comfort, good sound over a wide area, daylight, flexible furniture', '“It should feel like a living room that happens to sound great.”'],
          ['Immersive mix room', 'Sound from every direction', 'Even decay on every surface, consistent response across seats, hidden speakers', '“The room has to vanish.”'],
          ['Live / tracking room', 'Capturing performers', 'A flattering, adjustable decay; sightlines; quiet air', '“Drums on Monday, strings on Tuesday, a video shoot on Friday.”'],
        ])}
        <p>Even inside one type, taste differs: one mixer wants a tight, dry low end, another wants weight; one drummer wants an explosive room, another wants control. Good designers present a <b>forecast</b> — predicted isolation in dB, a noise-floor target, a decay-time band, a modelled low-frequency response — and then let the client trade those numbers against budget, floor area and looks. See <a href="#/academy/m-playbook">the design playbook</a> for the order of decisions.</p>
        <div class="callout example"><b>Use case.</b> Two songwriters each convert a 4 × 5 m garage. One records loud guitar amps at night next to a neighbour: most of the money goes into the shell and the door. The other programs on headphones and mixes quietly by day: almost all of it goes into the inside — deep trapping, a cloud, a good chair. Same room, opposite budgets, both correct.</div>
        ${myth([['“A professional studio follows one proven recipe.”', 'Professional rooms follow one proven <b>method</b>: brief → targets → forecast → build → measure → listen. The recipe is different every time.']])}` },
      { h: 'Six archetypes — and what each one hides', viz: 'studioAnatomy', html: `
        <p>Most high-end rooms you will see fall into a handful of families. Choose one below and slide the <b>x-ray</b> to fade the finishes.</p>
        <div class="uc-grid">
        ${uc('🌑', 'Dark immersive mix room', [['You see', 'Charcoal fabric walls and ceiling, light grazing down them, glowing vertical reveals, big free-standing mains with subwoofers, a rug, a sofa.'], ['Hidden', 'Deep traps front and rear, overhead and surround loudspeakers behind the cloth, lined ducts, a floated floor inside a heavy shell.']], C1)}
        ${uc('☀️', 'Daylight tracking room', [['You see', 'A tall white room, clouds hung at staggered heights, slit windows alternating with fabric panels, a timber-slat wall, rugs on hardwood.'], ['Hidden', 'Very little — here the treatment is shown, but organised into a rhythm so it reads as architecture.']], C6)}
        ${uc('🏙️', 'Street-front production suite', [['You see', 'A big window behind the monitors with heavy curtains, a dark beam grid with pale panels, a dark band along the bottom of pale walls, sofas.'], ['Hidden', 'Absorbers in every coffer, a low trap under the window, a deep rear wall, heavy laminated glazing.']], C3)}
        ${uc('🏠', 'Attic control room', [['You see', 'Cloud planes following the roof slope, pale fabric walls, chunky timber frames, a console facing a window, glass doors to a small drum room.'], ['Hidden', 'Knee-wall bass traps in the eaves, a decoupled floor, a quiet air-conditioning unit outside the room.']], C4)}
        ${uc('🎬', 'Living-room cinema', [['You see', 'A sitting room with dark walls, ordinary furniture and garden doors. No loudspeakers.'], ['Hidden', 'In-wall and in-ceiling speakers, an absorptive ceiling, subwoofers and a trap in the joinery.']], C5)}
        ${uc('🛋️', 'Loft writing room', [['You see', 'A reclaimed-timber roof, dark walls, heavy drapes, layered rugs, sofas, instruments on the walls.'], ['Hidden', 'Almost nothing: the furnishing is the treatment. Comfortable and moderately controlled, not a precision room.']], C2)}
        </div>` },
      { h: 'Stretched-fabric architecture: why hiding the treatment works', html: `
        ${SVG_SKIN}
        <p>The signature of this style is a wall that looks like smooth painted plaster with thin vertical joints roughly every 1.2 m, and is in fact <b>cloth stretched over a frame</b>. Acoustically this is not a compromise; it is an advantage.</p>
        <ul>
          <li><b>Depth is free to vary.</b> Behind one straight skin you can put 50 mm of absorber at one place and 600 mm of bass trap at another. Thick treatment hung on a wall as boxes looks heavy; the same depth behind fabric is invisible.</li>
          <li><b>Air gaps come for free.</b> A 100 mm absorber spaced 100 mm off the wall works about an octave lower than the same slab fixed to it (see <a href="#/academy/absorption">absorption</a>). The frame gives you that gap.</li>
          <li><b>Mixed devices share one face.</b> Porous absorber, a membrane trap, a diffuser and a loudspeaker can sit side by side without the room looking like a showroom.</li>
          <li><b>Reflective zones can hide too.</b> Where you want reflection, a thin board directly behind the cloth gives a hard surface that looks identical to the absorbing bay next to it.</li>
        </ul>
        <p>The fabric itself must be acoustically open — you should be able to breathe through it easily — and the whole subject of choosing, sourcing and fixing it neatly has its own lesson: <a href="#/academy/m-fabric">acoustic fabric and fabric finishes</a>. For the balance of what goes behind the skin, see <a href="#/academy/flat">designing for a flat response</a>.</p>
        <div class="callout warn"><b>The trap in this style.</b> Because everything looks the same, it is easy to make everything <i>absorbing</i>. A room lined wall-to-wall with 50 mm of wool behind cloth is dead in the treble and still boomy in the bass. Vary the depth, and keep some of the skin deliberately reflective or diffusive.</div>` },
      { h: 'Where things go, and why', html: `
        ${SVG_ZONES}
        ${tbl(['Zone', 'What usually goes there', 'Why', 'How to spot it in a photograph'], [
          ['① Front wall', 'Either a heavy baffle with flush-mounted speakers, or a deep absorber behind free-standing ones', 'The bass a speaker throws backwards returns late and cancels a band (boundary interference). Flush-mounting removes the gap; deep absorption weakens the return.', 'Chamfered front corners, speakers very close to or built into the wall, a deep window sill'],
          ['② Side mirror points', '100 mm or more of absorber, or an angled reflective surface', 'These reflections arrive within a few milliseconds and blur the stereo image', 'Fabric bays level with the gap between speakers and seat; no shelves or glass there'],
          ['③ Ceiling over the desk', 'A cloud, flat or pitched', 'Same reason, and it is the largest uninterrupted surface', 'A dropped panel or coffer with a shadow gap'],
          ['④ Rear wall', 'The deepest absorber in small rooms; diffusion when there are 3 m or more behind the seat', 'The strongest low-frequency reflection and the first length mode both live here', 'A very thick wall at the door reveal; a sofa pulled slightly off it'],
          ['⑤ Corners', 'Floor-to-ceiling bass traps behind a straight or chamfered skin', 'Every mode has a pressure maximum in a corner', 'Corners that are cut off at 45°, or light reveals where a corner should be'],
          ['⑥ Floor', 'Hard timber with loose rugs', 'A consistent, bright reflection the ear expects; rugs are the adjustable part', 'Rug under the seat and between speakers and seat; bare timber round the edges'],
        ])}
        <p>The detailed mode-by-mode placement method is in <a href="#/academy/m-stands-desk">which mode, which place</a>; this table is the map you check a design against.</p>` },
      { h: 'Ceiling clouds: flat, pitched, coffered and staggered', viz: 'cloudArray', html: `
        ${SVG_CLOUDS}
        <p>Four families cover nearly everything you will see:</p>
        <ul>
          <li><b>Flat cloud on a gap</b> — one large panel over the listening position, dropped 150–400 mm. The gap is what earns the low-mid absorption.</li>
          <li><b>Staggered array</b> — many smaller clouds on cables at two or three heights with bare ceiling between. This is the tall tracking-room move: it stops floor–ceiling flutter, adds scattering, and leaves enough hard surface for the room to keep its height.</li>
          <li><b>Pitched planes</b> — large panels parallel to a sloping roof with a shadow gap and concealed light. The roof void behind adds depth.</li>
          <li><b>Coffer-inset</b> — a grid of beams with an absorber and a small downlight in each bay. The grid hides fixings, sprinklers and joints, and gives the eye order.</li>
        </ul>
        <div class="callout data"><b>Rules of thumb.</b> Mix room: cover the mirror points for every seat and extend 300 mm beyond; minimum 100 mm thick on a 100 mm gap. Tracking room: cover one third to one half of the ceiling. Hang from structure, never from plasterboard. Lights and sprinkler heads go between clouds or through them with a collar — agree this with the fire engineer before fixing anything.</div>` },
      { h: 'Timber slats: diffuser, absorber or decoration?', viz: 'slatWall', html: `
        <p>Vertical timber slats appear again and again — round a control-room window, on a side wall behind a sofa, lining a small drum room. The same look can be three different acoustic devices depending on what you cannot see:</p>
        ${tbl(['What is behind', 'What it does', 'Where it suits'], [
          ['Slats on a solid backing', 'Reflects; scatters a little in the treble', 'Decoration, or a live wall in a large room'],
          ['Slats, narrow gaps, deep cavity with wool', 'A slot (Helmholtz) absorber: low-mid absorption while the timber faces return treble', 'Tracking rooms and drum rooms that must stay bright but not boomy'],
          ['Slats, wide gaps, wool directly behind', 'Mostly a porous absorber with a timber grille', 'Booths, rear walls of control rooms'],
          ['Slats of mixed depth or width', 'Adds real scattering above about 1 kHz', 'Anywhere you want life without flutter'],
        ])}
        <p>The tuning comes from open area, slat thickness and cavity depth — the tool below does the sum. The full theory of slot resonators is in <a href="#/academy/m-treat-designs">treatment designs</a> and the calculator in <a href="#/absorbers">the absorber workshop</a>.</p>
        <div class="callout example"><b>Use case — small drum room.</b> A 2.5 × 3 m drum room lined entirely with wool sounds like a cupboard. Line it instead with vertical battens of two or three depths over wool, gaps of 10–15 mm, on three walls, and leave the ceiling as the main absorber. Cymbals stay bright, the low-mid “box” tone goes, and the room photographs well.</div>` },
      { h: 'Glass: windows behind speakers, slit windows and full-glass doors', viz: 'glassBehindSpeakers', html: `
        <p>Daylight is one of the clearest differences between rooms people love and rooms people endure. Good practice treats glass as a design material with known rules instead of banning it.</p>
        <ul>
          <li><b>A window behind the monitors</b> can work well: the glass, if heavy and sealed, is a decent bass boundary, both loudspeakers see the same surface, and you look out past the screens. The cost is that the classic place for the deepest absorber has gone, so the depth must move to the sill, the sides, the ceiling and the rear. Heavy full-height curtains each side close for critical listening.</li>
          <li><b>Tall slit windows alternating with fabric panels</b> of the same proportion give daylight without a large reflective plane, and no two big hard areas face each other.</li>
          <li><b>Full-glass doors</b> keep sightlines between rooms — performers play better when they can see each other. Use laminated glass in heavy frames with two seals, and a pair of doors with a lobby where isolation matters (see <a href="#/academy/m-door-build">doors, seals and windows</a>).</li>
          <li><b>Angle and symmetry.</b> Splaying glass 5–10° keeps the treble reflection away from the seat or a microphone. Whatever you do on the left, do on the right.</li>
        </ul>
        <div class="callout warn"><b>What curtains cannot do.</b> A curtain is a few centimetres of fabric. It controls treble splash and glare; it does nothing to the bass cancellation between a loudspeaker and the glass behind it. Use the tool to see the notch refuse to move.</div>` },
      { h: 'Furniture, floors and rugs as acoustic elements', html: `
        <p>In comfort-led rooms a surprising share of the acoustic work is done by things you would have bought anyway.</p>
        ${tbl(['Element', 'Acoustic behaviour', 'Design use'], [
          ['Deep upholstered sofa', 'Broadband absorber down to about 200 Hz; about 2–3 m² of absorption', 'Against or near the rear wall; replaces a wall panel and seats the client'],
          ['Tufted leather ottoman / bench', 'Reflective on top, absorptive in its volume; scatters', 'Between seat and sofa; breaks the floor bounce to the rear'],
          ['Thick wool rug on underlay', 'Absorbs from about 500 Hz up', 'Under the listening position; roll out or remove in a live room to tune it'],
          ['Open shelving with books and instruments', 'Irregular scattering, some absorption', 'Rear and rear-side walls; never at the mirror points'],
          ['Plants', 'Light scattering, visual softness', 'Corners and beside windows'],
          ['Equipment racks and desk', 'Hard reflectors near your ears', 'Keep low and open; angle side racks; see <a href="#/academy/m-stands-desk">stands and desks</a>'],
        ])}
        <p>Custom furniture is treated as part of the room: racks sized to the actual equipment, a desk that keeps the console low and the cables hidden but reachable, keyboard shelves on the wall instead of stands on the floor. Workflow improvements are acoustic improvements too — fewer hard objects between you and the speakers.</p>` },
      { h: 'Light, colour and mood', viz: 'paletteBuilder', html: `
        ${SVG_LIGHT}
        <p>Three palettes recur, and each is assembled from finishes that are acoustically correct for their position:</p>
        <ul>
          <li><b>Dark cocoon</b> — charcoal fabric, warm low light. The room recedes and attention goes to sound and picture. Needs many small light sources: downlights placed close to the wall so light grazes the weave, vertical light reveals at corners, lamps at sofa height.</li>
          <li><b>Daylight airy</b> — whites, pale grey and light oak with real windows. Feels larger, suits tracking and filming. Workmanship shows, so seams and linings must be perfect.</li>
          <li><b>Warm timber</b> — oatmeal fabric with oak or walnut slats and frames. The timber returns treble so the room never sounds padded.</li>
        </ul>
        <div class="callout safety"><b>Quiet light.</b> Cheap LED drivers and phase-cut dimmers buzz, and some radiate interference that ends up in guitar pickups. Put drivers outside the room, choose constant-current dimming designed for studios or film sets, never fit fan-cooled fittings, and check every circuit with a single-coil guitar before the ceiling is closed. More in <a href="#/academy/m-electrical">electrical design</a> and <a href="#/academy/m-daylight">day-lighting</a>.</div>` },
      { h: 'Quiet you feel but do not hear', html: `
        <p>In every finished room of this standard the air system is nearly invisible: a long narrow slot in a dropped bulkhead, a shadow gap round a cloud, a grille low on a wall behind a sofa. Behind those slots are large, lined ducts moving air slowly, fed from equipment that is outside the room on its own isolation mounts.</p>
        ${flow([['Machine outside', 'Indoor unit in a cupboard or loft, never above the mix position'], ['Long lined runs', 'Several metres of internally lined duct with bends'], ['Big cross-section', 'Air speed at the outlet below about 1.5–2 m/s'], ['Slots, not grilles', 'Long slot diffusers spread air without hiss'], ['Return path', 'A lined return of equal size, or the supply is throttled']])}
        <p>Variable-speed refrigerant systems are popular for small studios because the indoor unit can run very slowly once the room is at temperature. The numbers and sizing method are in <a href="#/academy/m-hvac">HVAC for studios</a>.</p>
        <div class="callout mentor"><b>Mentor note.</b> If you can hear the air in a photograph — a standard square ceiling diffuser straight over the desk, a wall-mounted split unit above the monitors — the room is not at this level, however good the finishes look.</div>` },
      { h: 'Special cases: video-ready live rooms, attics and small footprints', html: `
        <div class="uc-grid">
        ${uc('🎥', 'Live room as a video set', [['Brief', 'The room earns money from filmed sessions as well as recordings.'], ['Design', 'Calm, pale backgrounds; daylight that can be fully blocked; a ceiling grid or rails rated for lights; power and tie-lines at the perimeter so no cable crosses the frame; flicker-free lighting; silent air for long takes.']], C6)}
        ${uc('🏠', 'Attic conversion', [['Problem', 'Low headroom at the edges, a timber structure below, summer heat.'], ['Fix', 'Use the pitched ceiling (no parallel floor–ceiling pair) and turn the eaves into knee-wall bass traps. Float the floor. Put the air unit outside the room. Face the desk towards the gable window, on the centre line of the ridge.']], C4)}
        ${uc('📐', 'Very small room', [['Problem', 'No space for 500 mm traps on every wall.'], ['Fix', 'Spend depth on the rear wall and ceiling only; keep side walls thin (100 mm at mirror points); use near-field monitors close to the front wall; accept a subwoofer plus measured equalisation for the lowest octave.']], C3)}
        ${uc('🪟', 'Shop-front or office unit', [['Problem', 'A full-width window, a suspended ceiling, shared services.'], ['Fix', 'Keep the window, add a second laminated leaf inside; build the beam-grid ceiling below the services; put the deep absorber on the wall opposite the glass.']], C1)}
        </div>` },
      { h: 'Budget versions for a home studio in India', html: `
        <p>The look is achievable with ordinary materials if you copy the <i>moves</i> instead of the products. Climate, materials and trades are covered in <a href="#/academy/m-india">studio design in India</a>.</p>
        ${tbl(['High-end move', 'Budget equivalent', 'Watch out for'], [
          ['Floor-to-ceiling stretched fabric on a track system', 'Site-built timber or aluminium frames with cloth stapled or tucked, set out on a 1.2 m module with a 6–10 mm shadow joint', 'Humidity sag in cotton; use polyester, test by breathing through it'],
          ['Deep rear-wall trap', 'A 300–450 mm framed cavity loosely filled with low-density glass-wool rolls, lined with black scrim', 'Do not compress the wool; keep it off damp masonry'],
          ['Cloud array on cables', '50–100 mm rock-wool slabs in light timber frames on chain or wire from anchor bolts in the slab', 'Fix to concrete, not to false ceiling grid'],
          ['Oak slat wall', 'Pine, rubber-wood or painted MDF battens on black battens over wool', 'Seal all faces against monsoon movement'],
          ['Wall-washing downlights', 'Small 2700–3000 K spotlights 150–200 mm from the wall on a good driver', 'Test for buzz with a guitar before closing up'],
          ['Slot diffusers', 'A long timber slot with a lined plenum box behind, fed by a ducted or cassette unit outside the room', 'Condensate drain and access for cleaning'],
          ['Engineered oak floor + rug', 'Wood-look vinyl plank or tile with a thick dhurrie or wool rug', 'Hollow-sounding laminate on thin foam drums; fix it down fully'],
        ])}
        <div class="callout example"><b>Use case — 3.2 × 4.2 m bedroom, modest budget.</b> Rear wall: 350 mm trap behind pale polyester cloth, door on the side. Front: monitors 150 mm from the wall with a 100 mm absorber behind. Ceiling: one 1.2 × 2.4 m cloud on a 200 mm drop. Sides: two 100 mm bays each at the mirror points, the rest painted. Floor: existing tile plus a rug. One slatted bay in rubber-wood for warmth. It reads as a small designed room, not a room full of panels.</div>` },
      { h: 'Apply it: steal like a designer', html: `
        ${SVG_READ}
        <p>Take any photograph of a finished studio and work through it the same way every time. Ten photographs studied like this are worth more than a hundred scrolled past.</p>
        <div class="verify">
          <div class="chk"><b>1 · Count the surfaces.</b> For each of the six sides: soft, hard, glass or mixed? Is left a mirror of right?</div>
          <div class="chk"><b>2 · Find the speaker geometry.</b> Where is the seat? How far are the speakers from the wall behind them and from the side walls? Flush or free-standing? Subwoofers?</div>
          <div class="chk"><b>3 · Find the hidden depth.</b> Look at door reveals, window sills and corners. A 500 mm reveal tells you how thick the lining is.</div>
          <div class="chk"><b>4 · Find the air path.</b> Slots, grilles, bulkheads, gaps round clouds. Where does air come in and where does it leave?</div>
          <div class="chk"><b>5 · Find the quiet lighting.</b> What does each light graze or wash? Is anything likely to buzz?</div>
          <div class="chk"><b>6 · Find the cable path.</b> Wall plates, floor boxes, the back of the desk. Can you see a single trailing cable?</div>
        </div>
        <div class="callout mentor"><b>Exercise.</b> Sketch a plan and a section of the room in the photograph, mark the six zones from the placement diagram, and write one sentence on what you would do differently in your own room and why. Then open <a href="#/treatment">the treatment planner</a> and try it.</div>
        ${myth([
          ['“Rooms that look this good must be compromising the acoustics.”', 'The opposite is usually true: hiding treatment behind a skin allows more depth than anyone would tolerate as visible boxes.'],
          ['“If I copy the finishes I get the sound.”', 'The finishes are the last 5 %. Copy the depths, positions and symmetry; then choose any finish that is acoustically open.'],
          ['“More absorption is always more professional.”', 'Professional rooms keep timber, glass and furniture reflecting on purpose. Control the bass and the first reflections; leave the rest alive.'],
        ])}` },
    ],
    quiz: [
      { q: 'A wall in a finished mix room looks like smooth plaster with thin vertical joints every 1.2 m. What is the most likely construction?', opts: ['Painted plasterboard with decorative grooves', 'Acoustically open fabric stretched on a frame, with treatment of varying depth behind', 'Solid timber panels', 'Vinyl wallpaper over foam'], a: 1, why: 'Regular narrow joints at a module of about a fabric width are the signature of a stretched-fabric wall. The straight skin hides absorbers, traps and sometimes loudspeakers.' },
      { q: 'You hang a 100 mm cloud tight against the ceiling, then lower it by 300 mm. What changes most?', opts: ['Nothing; only thickness matters', 'It absorbs less because sound escapes round it', 'Low-mid absorption improves because the gap adds effective depth and exposes the back and edges', 'Only the treble absorption improves'], a: 2, why: 'An air gap behind a porous panel moves its useful range lower, and a suspended panel absorbs on its upper face and edges as well.' },
      { q: 'A heavy curtain is drawn across a window 1 m behind the monitors. What happens to the bass cancellation notch near 70 Hz?', opts: ['It disappears', 'It moves up an octave', 'It barely changes', 'It becomes a peak'], a: 2, why: 'A few centimetres of fabric cannot absorb a wave about 5 m long. Curtains treat treble reflections and glare; the notch depends on distance to the glass.' },
      { q: 'A timber slat wall has 5 % open area and an empty cavity. How will it behave?', opts: ['As a broadband absorber', 'Mostly as a reflector with one narrow absorption band', 'As a perfect diffuser at all frequencies', 'It will be acoustically transparent'], a: 1, why: 'Low open area and no damping give a sharp, narrow resonance and reflection everywhere else. Wool behind the slats broadens it; more open area makes it more of an absorber.' },
      { q: 'Which is the best first step when designing a room for a new client?', opts: ['Choose the monitor loudspeakers', 'Pick the fabric colour', 'A long conversation about how they work and what they want to hear, turned into numerical targets', 'Order bass traps for every corner'], a: 2, why: 'Targets come from the person and the use. A forecast of isolation, noise, decay and bass response against budget follows; products come last.' },
    ],
  });

  /* =====================================================================
     M36 — immersive mix room and living-room cinema
     ===================================================================== */
  window.LESSONS.push({
    id: 'm-immersive-room', n: 'M36', track: 'master', title: 'Designing an Immersive Mix Room (and a Living-Room Cinema That Still Looks Like a Living Room)', level: 'Advanced', mins: 50,
    summary: 'Room size, seat and loudspeaker geometry for object-based formats, hiding surrounds and overheads behind fabric, multiple subwoofers for seat-to-seat consistency, decay and noise targets, calibration, and the dual-purpose family room.',
    tags: ['immersive', 'object-based', 'height speakers', 'surround', 'multiple subwoofers', 'bass management', 'hidden speakers', 'home cinema', 'calibration', 'seat consistency', 'back-box'],
    sections: [
      { h: 'What changes when sound comes from everywhere', html: `
        <p>A stereo room has a front and a back. The front makes the sound; the sides and ceiling must not disturb it; the rear absorbs or diffuses what is left. An <b>immersive</b> room — one built for object-based formats with loudspeakers around and above the listener — has no such hierarchy. Every wall and the ceiling carry sources, so every surface is both a “front wall” for its own loudspeakers and a reflection path for the others.</p>
        ${tbl(['Design question', 'Stereo mix room', 'Immersive mix room'], [
          ['Where is the “front”?', 'One wall', 'All round and overhead'],
          ['Early reflections to control', 'From two speakers', 'From 9 to 16 speakers — in practice, all of them'],
          ['Good listening area', 'One seat, perhaps a sofa behind', 'An area: mixer, producer and client should hear the same balance'],
          ['Decay time', 'Short and even', 'Shorter and flatter still, the same in every direction'],
          ['Bass', 'Two mains, maybe a sub', 'Bass management with several subwoofers'],
          ['Looks', 'Speakers are the feature', 'Most speakers are best hidden'],
        ])}
        <p>The formats themselves — channels, objects, scenes, bass management, downmixing — are explained in <a href="#/academy/a-immersive">surround, immersive and binaural audio</a>. This lesson is about the <b>room</b>.</p>
        <div class="callout mentor"><b>The goal in one sentence.</b> A sound panned anywhere on the sphere should have the same tone and the same clarity, and should stay where it was put when you move one seat to the left.</div>` },
      { h: 'Room size and proportion', html: `
        <p>Immersive layouts need distance. Overhead loudspeakers must be far enough above the ears that two neighbouring seats hear them at similar level, and surrounds must be far enough away that nobody sits “inside” one.</p>
        ${tbl(['Room', 'Realistic layout', 'Notes'], [
          ['About 3 × 4 m, 2.6 m high', 'A compact 5.1.4-style room, one seat', 'Works as a personal mix or check room. Overheads are close: choose wide-dispersion models.'],
          ['About 4.5 × 6 m, 2.8–3 m high', '7.1.4-style, two or three seats', 'The practical minimum for commercial work.'],
          ['6 × 8 m and larger, 3.2 m or more', '9.1.6-style, a row of seats', 'Room for a proper machine closet, sound lock and deep trapping all round.'],
        ])}
        <ul>
          <li><b>Height is the scarce dimension.</b> After a floated floor, a cloud and ceiling trapping, a 2.7 m slab-to-slab height can become 2.3 m. Plan the section first.</li>
          <li><b>Avoid near-cubes and simple multiples</b> (see <a href="#/academy/modes">room modes</a>); a slightly long room gives the rear surrounds space.</li>
          <li><b>Symmetry about the centre line is non-negotiable</b>: doors, windows and machine closets are arranged around it.</li>
        </ul>
        <div class="callout data"><b>Rule of thumb.</b> Aim for at least 1.2–1.5 m between the listeners’ ears and the overhead loudspeakers, and at least 1.5 m from the nearest seat to any surround.</div>` },
      { h: 'Seat and loudspeaker geometry', viz: 'immersiveLayout', html: `
        ${SVG_ANGLES}
        <p>Start with the seat, then place loudspeakers along directions from it. The ear-level layer follows the familiar pattern: three across the front, sides near 90°, rears behind, and optional “wides” between front and side for larger layouts.</p>
        ${SVG_ELEV}
        <p>The overhead layer is set by <b>elevation</b>. Front and rear overheads sit roughly 45° up from the seat, in line with (or slightly inside) the left and right front speakers; a six-overhead layout adds a pair almost directly above. Because the horizontal offset for 45° equals the height above the ears, a low ceiling pulls the overheads close together and close to the listener.</p>
        <div class="callout warn"><b>Use the real document.</b> The windows in the tool are generic teaching values. Each format owner publishes its own tolerances for azimuth, elevation, distance and level, and revises them. Design to the <b>current specification</b> and check the latest version before construction — especially if the room is to be approved or certified.</div>
        <p>When a perfect sphere of equal distances is impossible (it nearly always is), each loudspeaker is <b>delayed</b> so its sound arrives with the farthest one, and <b>trimmed</b> to the same level at the seat. That fixes one position. Keeping distances similar is what keeps the other seats close.</p>` },
      { h: 'Consistency across a listening area', html: `
        <p>In a commercial room the person paying for the mix is often on the sofa, not in the chair. Three things decide whether they hear what the mixer hears:</p>
        <ol>
          <li><b>Distance ratios.</b> Move 0.5 m towards a loudspeaker 1.5 m away and it gets about 3.5 dB louder; do the same with one 3 m away and it changes by 1.6 dB. Farther speakers mean a larger good area.</li>
          <li><b>Dispersion.</b> Surround and overhead loudspeakers with wide, smooth coverage (roughly ±45° or more without a treble drop) keep tone constant across seats. Narrow ones create hot spots.</li>
          <li><b>Aiming.</b> Angle each loudspeaker at the centre of the listening <i>area</i>, not at one head. Overheads in angled back-boxes are worth the carpentry.</li>
        </ol>
        <div class="callout example"><b>Use case.</b> A producer complains that the rear effects “jump” to the left whenever she leans over to the client. The left rear surround is 1.1 m from the sofa end. Moving the sofa 400 mm forward and re-aiming both rears at the centre of the sofa reduces the level difference between sofa ends from 6 dB to under 3 dB — no equipment changed.</div>` },
      { h: 'Hiding loudspeakers behind fabric', viz: 'hiddenSpeaker', html: `
        ${SVG_BACKBOX}
        <p>A room with fourteen visible black boxes feels like a showroom. Concealing surrounds and overheads behind the stretched-fabric skin is what lets an immersive room look like a calm interior. It only works if four details are right:</p>
        <ul>
          <li><b>A rigid baffle.</b> The loudspeaker is fixed in or against a stiff panel flush with the back of the fabric frame, so it radiates into the room, not into a pocket.</li>
          <li><b>A sealed, heavy, damped back-box</b> that is <i>inside</i> the room’s isolation shell. Never cut a loudspeaker into the isolating wall or ceiling itself: the hole and the vibrating box destroy the isolation you paid for (see <a href="#/academy/isolation">isolation</a>).</li>
          <li><b>Open cloth, close to the drivers.</b> 10–20 mm in front of the baffle, with no batten, track or mid-rail crossing a tweeter. Fabric choice and tests are in <a href="#/academy/m-fabric">acoustic fabric</a>.</li>
          <li><b>Absorber around, not in front.</b> The bays either side of the loudspeaker stay absorptive; the recess walls are lined.</li>
        </ul>
        <p><b>Front speakers: flush or free-standing?</b> Large free-standing three-way mains with subwoofers beside them are common where the room is also used for stereo and the client wants to see and move them. Flush-mounting in a baffle wall removes the boundary cancellation and looks cleaner, but fixes the geometry for good (see <a href="#/academy/m-speakers">speakers and flush-mounting</a>). Either is valid; decide with the client early because it sets the front-wall depth.</p>` },
      { h: 'Bass: several subwoofers, managed and aligned', viz: 'seatConsistency', html: `
        ${SVG_SUBS}
        <p>Small surround and overhead loudspeakers cannot reproduce deep bass, so their low frequencies are redirected to subwoofers (<b>bass management</b>), which also carry the dedicated low-frequency effects channel. Since all the bass now comes from a few boxes, their number and position decide how evenly the room modes are driven.</p>
        <ul>
          <li><b>One subwoofer</b> excites every mode from one point: loud, but each seat gets different peaks and holes.</li>
          <li><b>Two, placed as mirror images</b> (for example at the quarter points of the front wall), cancel the odd width modes.</li>
          <li><b>Four, at wall mid-points or in the corners</b>, cancel most low-order modes between them. The seats then agree, and one equalisation curve suits everyone.</li>
        </ul>
        ${flow([['Place', 'Symmetrical positions; try mid-walls and quarter points first'], ['Measure', 'Each sub alone at every seat, then together'], ['Align', 'Delay and polarity so the subs add at the crossover with the mains'], ['Trap', 'Deep absorption shortens the decay that EQ cannot'], ['Equalise', 'Cut the peaks of the seat average; never fill deep holes']])}
        <p>Crossover choice, level conventions for the effects channel and time alignment are in <a href="#/academy/a-immersive">immersive audio</a> and <a href="#/academy/a-tuning">system tuning</a>.</p>` },
      { h: 'Decay time, treatment and the “dead but boomy” trap', html: `
        <p>Immersive rooms are specified with a shorter and flatter decay than stereo rooms of the same size, because reflections from any surface now compete with a loudspeaker on that surface. Typical guidance for small and medium mix rooms is a mid-band decay around 0.2–0.3 s, held within a narrow band from about 200 Hz to 4 kHz and rising only gently below.</p>
        <p>The danger is reaching the number with thin material. Fifty millimetres of absorber on every surface gives a beautiful decay figure at 1 kHz and leaves 80 Hz ringing for half a second. The room is then <b>dead and boomy at once</b>.</p>
        ${tbl(['Surface', 'In an immersive room', 'Depth to plan for'], [
          ['Front wall', 'Baffle wall or deep absorber round the screen', '300–600 mm'],
          ['Side walls', 'Absorber between and around hidden surrounds; some scattering towards the rear', '150–300 mm'],
          ['Rear wall', 'The deepest trap, with rear surrounds in baffles', '400–700 mm'],
          ['Ceiling', 'Absorptive across most of its area, with overheads in back-boxes; the void above is bass trapping', '200–400 mm plus void'],
          ['Floor', 'Hard, with a large rug', '—'],
        ])}
        <div class="callout mentor"><b>Mentor note.</b> Keep a little life: a timber floor, the desk, a slatted bay at the rear sides. A room with no reflections at all is tiring to work in and makes mixes that are too wet everywhere else.</div>` },
      { h: 'Noise floor, isolation and equipment heat', html: `
        <p>Immersive mixes use very quiet ambiences and height effects that sit just above silence, so the background noise target is strict — around <b>NC-15 to NC-20</b> for professional rooms (see <a href="#/academy/criteria">criteria</a>). Three things decide whether you reach it:</p>
        <ul>
          <li><b>Air.</b> A dedicated, slow, lined system with slot outlets (<a href="#/academy/m-hvac">HVAC</a>). A dozen amplifiers and a workstation can add over a kilowatt of heat, so cooling load is real.</li>
          <li><b>A machine closet.</b> Computers, amplifiers and network switches go in a ventilated, lined cupboard outside the listening space, reached through sealed cable paths (<a href="#/academy/m-connect">connecting rooms</a>).</li>
          <li><b>The shell.</b> For late-night work at reference level: a floated floor, heavy double walls and lid, a sound-lock lobby with two rated doors. Overview in <a href="#/academy/m-floors">floors</a> and <a href="#/academy/m-door-build">doors and seals</a>.</li>
        </ul>
        <div class="callout safety"><b>Safety.</b> Overhead loudspeakers and clouds are heavy objects above people. Fix to structure with rated hardware and a secondary safety wire, and have loads checked by a structural engineer. Enclosed amplifiers need ventilation and correctly rated circuits (<a href="#/academy/m-electrical">electrical</a>).</div>` },
      { h: 'Screens and displays', html: `
        <p>Picture changes the front wall. A large flat display between or below the front speakers is a mirror for mid and high frequencies; an acoustically transparent projection screen lets the centre speaker sit behind the picture where it belongs, at the cost of some treble loss that must be equalised.</p>
        <ul>
          <li>Keep the three front loudspeakers at the <b>same height</b> where possible, with tweeters near ear level; a centre speaker far below a television pulls dialogue down.</li>
          <li>Recess a flat display into the absorptive front wall so its edges are flush, and tilt it slightly if reflections from surrounds are visible in measurements.</li>
          <li>Leave service access: displays fail more often than walls.</li>
        </ul>` },
      { h: 'Calibration workflow', html: `
        ${flow([['Verify', 'Every speaker plays from the right place with correct polarity'], ['Level', 'Band-limited noise, each channel to the same level at the seat'], ['Delay', 'Arrival times matched to the farthest speaker'], ['Bass', 'Crossovers set; subwoofers aligned to the mains'], ['Target', 'Gentle equalisation of the spatial average towards the agreed curve'], ['Check seats', 'Repeat at the other positions; compromise knowingly'], ['Listen', 'Known material, panning tests, then real mixes']])}
        <p>Measure at several microphone positions around each seat and work on the average: equalising to a single point optimises a spot the size of an orange. Below about 200 Hz, correct peaks of the average; above about 500 Hz, be very sparing — what you see there is mostly loudspeaker and reflection, better fixed physically. The measurement method is in <a href="#/academy/a-measure-depth">measurement in depth</a>.</p>
        <div class="callout data"><b>Document it.</b> Keep the final levels, delays, filter settings and a set of response plots with the date. Re-measure after any change to furniture, fabric or loudspeakers, and at least once a year.</div>` },
      { h: 'The living-room cinema that still looks like a living room', viz: 'cinemaLivingRoom', html: `
        <p>Sometimes the brief is not a studio at all: a family room that hosts friends in the evening and becomes a full immersive cinema at the press of a button. The aim is <b>cohesion, not contrast</b> — it should feel natural in every mode.</p>
        <ul>
          <li><b>Work inside the existing architecture.</b> Keep the cornices, the fireplace wall, the garden doors. Treatment goes into surfaces nobody looks at closely: the ceiling, the wall behind the seating, the joinery under the screen.</li>
          <li><b>Fabric that reads as paint.</b> Dark, matt cloth on walls and ceiling hides in-wall and in-ceiling loudspeakers and 50–100 mm of absorber, and controls stray light from the screen.</li>
          <li><b>Furniture stays domestic.</b> Deep sofas, a rug, lamps and curtains do acoustic work and keep the room homely.</li>
          <li><b>Services step back.</b> The air system is slowed and lined; equipment lives in a cupboard elsewhere; lighting scenes handle the change of mood.</li>
        </ul>
        <div class="callout example"><b>Use case.</b> A sitting room 5 × 6.5 m with French doors on one side. Asymmetry from the doors is balanced with full-height lined curtains on both side walls (a dummy pair opposite the doors). The ceiling is re-lined with fabric over 75 mm of wool, hiding four overhead speakers. Two subwoofers sit in the cabinet under the screen and two in a window seat at the rear. By day nothing suggests a cinema.</div>` },
      { h: 'Budget tiers, an India spare-bedroom example, and common mistakes', html: `
        ${tbl(['Tier', 'What you build', 'What you accept'], [
          ['Check room', '5.1.4-style with compact speakers on wall and ceiling brackets, one or two subs, rear-wall trap, cloud, rug', 'One good seat; visible speakers; domestic noise floor'],
          ['Working room', '7.1.4-style, hidden surrounds and overheads behind fabric, two to four subs, deep treatment on four surfaces, quiet ducted air', 'Limited isolation; daytime reference levels only'],
          ['Commercial room', 'Full shell, sound lock, machine closet, 7.1.4 or larger, baffle wall or large mains, measured and documented calibration', 'Cost and floor area'],
        ])}
        <div class="callout example"><b>Spare bedroom in an Indian apartment, about 3.3 × 4.3 × 2.9 m.</b> Seat at 40 % of the length, facing the short wall. Front three: compact two-way monitors on stands 150 mm from a 100 mm absorber. Surrounds on wall brackets at ±110°, 1.2 m high, angled at the seat. Four overheads on anchor bolts in the concrete slab, about 1.1 m either side of the centre line and 1.4 m in front of and behind the seat — close to 45° with the 1.7 m available above the ears. Two small sealed subwoofers at the front quarter points. Rear wall: 350 mm trap behind polyester cloth. Ceiling: wool boards between the overheads in a timber grid. Split air-conditioner replaced by a ducted unit above the corridor with a lined slot. Agree working hours with neighbours: this tier has little isolation. Climate and materials: <a href="#/academy/m-india">studio design in India</a>.</div>
        ${myth([
          ['“Up-firing or reflected overheads are as good as real ones.”', 'They depend on a flat, hard, reflective ceiling — the opposite of what a mix room needs. Use direct overhead loudspeakers for any room where decisions are made.'],
          ['“More absorption fixes an immersive room.”', 'Thin absorption everywhere gives a dull room with untreated bass. Depth and subwoofer strategy fix it.'],
          ['“Calibration software will sort out the layout.”', 'It corrects time and level at a point. It cannot correct angles, dispersion, reflections from a recess or a mode at the sofa.'],
          ['“Hiding speakers behind cloth always costs treble.”', 'Behind an open weave close to the baffle the loss is a fraction of a decibel. It is the recess, the battens and dense fabric that do the damage.'],
        ])}
        <div class="callout mentor"><b>Apply it.</b> Draw your room in plan and section. Mark the seat, then use the layout tool to place a 5.1.4 or 7.1.4 set and note every warning. Decide which loudspeakers will be hidden, where the subwoofers go as mirror pairs, and which surface gets the deepest trap. Only then choose equipment.</div>` },
    ],
    quiz: [
      { q: 'Why is consistency across a listening area harder in a room with a low ceiling?', opts: ['Low ceilings always have more modes', 'Overhead loudspeakers end up close to the listeners, so small moves change their level a lot', 'Fabric does not work on low ceilings', 'Subwoofers cannot be used'], a: 1, why: 'Level changes with the ratio of distances. A speaker 1 m above one head is far louder there than at the next seat; one 1.5–2 m away is much more even.' },
      { q: 'Where must the back-box of a hidden surround loudspeaker be?', opts: ['Cut into the outer isolating wall to save space', 'Inside the room’s isolation shell, sealed, heavy and damped', 'Left open at the back for better bass', 'Outside the building'], a: 1, why: 'Cutting into the isolating construction creates a leak and a vibrating panel. The loudspeaker and its sealed box belong in the treatment zone inside the shell.' },
      { q: 'What is the main benefit of four symmetrically placed subwoofers over one?', opts: ['Four times the maximum loudness', 'A perfectly flat response with no equalisation', 'Many low-order modes cancel, so the seats hear nearly the same response', 'They remove the need for bass trapping'], a: 2, why: 'Symmetric multiple sources refuse to drive many modes. The average is not necessarily flatter, but seat-to-seat variation falls, making one EQ curve valid for all seats.' },
      { q: 'A room measures 0.25 s decay at 1 kHz but 0.6 s at 80 Hz, with 50 mm panels on every surface. What is the right fix?', opts: ['Add more 50 mm panels', 'Add treble back with equalisation', 'Replace part of the thin treatment with deep low-frequency absorption and keep some surfaces reflective', 'Turn the subwoofers down'], a: 2, why: 'Thin porous material only works at mid and high frequencies. The room is dead and boomy; it needs depth where bass pressure is high, and less thin absorption overall.' },
      { q: 'The angle windows for an immersive layout should be taken from…', opts: ['Whatever fits the furniture', 'The current specification published by the owner of the format', 'A stereo equilateral triangle only', 'The loudspeaker manufacturer’s brochure'], a: 1, why: 'Each format defines and revises its own tolerances for azimuth, elevation, distance and level. Generic values are for learning; build to the latest document.' },
    ],
  });
})();
