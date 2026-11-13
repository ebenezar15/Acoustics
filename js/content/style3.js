/* ==========================================================================
   Academy — master track additions:
   M39  Study guide: becoming an acoustic consultant and studio designer
   M40  The consultant's process: brief, forecast, budget tiers, drawings, commissioning
   M41  Studio furniture and workflow: desks, racks, sightlines, cable management
   Original text; no sources quoted.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|do|design|result/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const S = (vb, label, body) => `<svg class="gsvg" viewBox="0 0 ${vb}" role="img" aria-label="${label}">${body}</svg>`;
  const T = (x, y, s, o = '') => `<text x="${x}" y="${y}" ${o}>${s}</text>`;
  const table = (head, rows) => `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const L = (id, text) => `<a href="#/academy/${id}">${text}</a>`;
  const mid = 'text-anchor="middle"';

  /* =====================================================================
     DIAGRAMS — M39
     ===================================================================== */
  const SVG_WEEK = S('700 230', 'A consultant\'s work is a loop from listening to measuring to drawing to site and back', `
    ${T(350, 18, 'The consultant\'s loop', `${mid} font-size="13" font-weight="700"`)}
    ${[['Listen', 'client, room, music'], ['Measure', 'survey and noise'], ['Predict', 'calculate, model'], ['Draw', 'details, specification'], ['Inspect', 'site, hold points'], ['Commission', 'measure, tune, explain']].map(([a, b], i) => {
      const ang = -Math.PI / 2 + (i / 6) * Math.PI * 2, cx = 350 + Math.cos(ang) * 230, cy = 128 + Math.sin(ang) * 78;
      return `<rect x="${cx - 62}" y="${cy - 20}" width="124" height="40" rx="8" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/>${T(cx, cy - 3, a, `${mid} font-size="12" font-weight="700"`)}${T(cx, cy + 12, b, `${mid} font-size="9.5" fill="var(--muted)"`)}`;
    }).join('')}
    <ellipse cx="350" cy="128" rx="150" ry="44" fill="none" stroke="var(--muted)" stroke-dasharray="5 5"/>
    <circle r="7" fill="var(--accent)"><animateMotion dur="9s" repeatCount="indefinite" path="M350 84 A150 44 0 1 1 349.9 84"/></circle>
    ${T(350, 124, 'every job teaches', `${mid} font-size="11" fill="var(--muted)"`)}${T(350, 140, 'the next forecast', `${mid} font-size="11" fill="var(--muted)"`)}`);

  const SVG_PILLARS = S('700 250', 'Six pillars of skill holding up a consultant\'s judgement', `
    <path d="M40 62 L350 14 L660 62 Z" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    ${T(350, 50, 'JUDGEMENT', `${mid} font-size="14" font-weight="700" fill="var(--accent)"`)}
    ${[['Physics', '&amp; maths'], ['Building', '&amp; materials'], ['Measuring', '&amp; instruments'], ['Audio', '&amp; loudspeakers'], ['Drawing', '&amp; writing'], ['Business', '&amp; ethics']].map(([a, b], i) => {
      const x = 62 + i * 100;
      return `<rect x="${x}" y="66" width="76" height="140" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/><rect class="hot" x="${x}" y="66" width="76" height="140" fill="var(--c${i + 1})" opacity=".35" style="animation-delay:${i * 0.35}s"/>
      ${T(x + 38, 128, a, `${mid} font-size="12" font-weight="700"`)}${T(x + 38, 144, b, `${mid} font-size="10.5" fill="var(--muted)"`)}`;
    }).join('')}
    <rect x="40" y="206" width="620" height="14" fill="var(--muted)"/>
    ${T(350, 240, 'Take one pillar away and the roof still comes down — on site, in front of the client.', `${mid} font-size="11" fill="var(--muted)"`)}`);

  const SVG_STAIRS = S('700 240', 'Five stages from listener to independent practice shown as steps', `
    ${T(350, 18, 'Five stages, each with proof you can show', `${mid} font-size="13" font-weight="700"`)}
    ${[['Stage 0', 'Listener', 'your own room, measured'], ['Stage 1', 'Foundations', 'sums match measurements'], ['Stage 2', 'Tools', 'a full drawing set'], ['Stage 3', 'Supervised', 'three built projects'], ['Stage 4', 'Independent', 'repeat clients']].map(([a, b, c], i) => {
      const x = 30 + i * 130, y = 190 - i * 34;
      return `<rect x="${x}" y="${y}" width="130" height="${222 - y}" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/>${T(x + 65, y + 18, a, `${mid} font-size="10" fill="var(--muted)"`)}${T(x + 65, y + 34, b, `${mid} font-size="12" font-weight="700"`)}${T(x + 65, y - 8, c, `${mid} font-size="9.5" fill="var(--accent)"`)}`;
    }).join('')}
    <circle r="8" fill="var(--accent)"><animateMotion dur="8s" repeatCount="indefinite" path="M95 180 L95 180 L225 146 L355 112 L485 78 L615 44"/></circle>`);

  const SVG_KIT = S('700 210', 'A measurement chain: source, room, microphone, interface, software, with a calibrator and a loopback check', `
    ${T(350, 18, 'Trust the chain only after you have checked every link', `${mid} font-size="13" font-weight="700"`)}
    ${[['Source', 'loudspeaker'], ['Room', 'the unknown'], ['Microphone', '+ calibration file'], ['Interface', 'preamp, converter'], ['Software', 'analysis']].map(([a, b], i) => {
      const x = 24 + i * 136;
      return `<rect x="${x}" y="70" width="108" height="50" rx="8" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/>${T(x + 54, 92, a, `${mid} font-size="12" font-weight="700"`)}${T(x + 54, 108, b, `${mid} font-size="9.5" fill="var(--muted)"`)}${i < 4 ? `<path class="leak-pulse" d="M${x + 110} 95 h24 m-7 -5 l7 5 l-7 5" stroke="var(--accent)" stroke-width="2" fill="none"/>` : ''}`;
    }).join('')}
    <path d="M350 68 v-24" stroke="var(--good)" stroke-width="2"/><rect x="300" y="26" width="100" height="20" rx="5" fill="none" stroke="var(--good)" stroke-width="1.5"/>${T(350, 40, 'calibrator: 94 dB', `${mid} font-size="10" fill="var(--good)"`)}
    <path d="M486 122 v32 h-430 v-32" stroke="var(--c3)" stroke-width="2" fill="none" stroke-dasharray="6 4"><animate attributeName="stroke-dashoffset" values="20;0" dur="1.2s" repeatCount="indefinite"/></path>
    ${T(270, 170, 'loopback: output wired to input — the curve must be a straight line', `${mid} font-size="10" fill="var(--c3)"`)}
    ${T(350, 198, 'If the same measurement on two days differs by more than 1 dB, find out why before you believe either.', `${mid} font-size="10.5" fill="var(--muted)"`)}`);

  const SVG_PORTFOLIO = S('700 200', 'One portfolio page: before, drawing, build photo, after, lessons', `
    ${T(350, 18, 'One page per project: five boxes, always the same', `${mid} font-size="13" font-weight="700"`)}
    ${[['Before', 'M0 40 q14 -34 28 -6 q14 30 28 -18 q14 -22 28 14'], ['Drawing', 'M4 8 h76 v40 h-76 z M4 28 h76 M44 8 v40'], ['Build', 'M6 46 v-26 l34 -16 l34 16 v26 z M30 46 v-16 h20 v16'], ['After', 'M0 30 q14 -8 28 -2 q14 6 28 -3 q14 -6 28 2'], ['Lessons', 'M8 12 h68 M8 24 h68 M8 36 h44']].map(([a, d], i) => {
      const x = 22 + i * 134;
      return `<rect x="${x}" y="40" width="120" height="100" rx="8" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/><path d="${d}" transform="translate(${x + 18} 58)" fill="none" stroke="${i === 0 ? 'var(--bad)' : i === 3 ? 'var(--good)' : 'var(--accent)'}" stroke-width="2.5"/>${T(x + 60, 132, a, `${mid} font-size="12" font-weight="700"`)}`;
    }).join('')}
    ${T(350, 168, 'A client cannot judge your physics. They can judge whether "after" is better than "before".', `${mid} font-size="11" fill="var(--muted)"`)}
    ${T(350, 186, 'A mentor can judge your physics from the drawing and the lessons.', `${mid} font-size="11" fill="var(--muted)"`)}`);

  /* =====================================================================
     DIAGRAMS — M40
     ===================================================================== */
  const SVG_FUNNEL = S('700 230', 'Words from the client are turned into numbers on a target sheet', `
    ${T(350, 18, 'From words to numbers', `${mid} font-size="13" font-weight="700"`)}
    ${['"I mix until 2 a.m."', '"The low end must be tight"', '"Neighbours upstairs"', '"It should not feel like a cave"'].map((s, i) => `<g><rect x="16" y="${38 + i * 44}" width="230" height="32" rx="16" fill="var(--panel2)" stroke="var(--muted)"/>${T(131, 59 + i * 44, s, `${mid} font-size="11"`)}</g>`).join('')}
    <path d="M250 54 L330 100 M250 98 L330 112 M250 142 L330 124 M250 186 L330 136" stroke="var(--accent)" stroke-width="2" fill="none" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" values="22;0" dur="1s" repeatCount="indefinite"/></path>
    <path d="M330 84 h60 l-12 34 l12 34 h-60 z" fill="var(--accent)" opacity=".85"/>${T(360, 122, 'brief', `${mid} font-size="11" font-weight="700" fill="var(--bg)"`)}
    <rect x="430" y="36" width="250" height="176" rx="8" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/>${T(555, 56, 'TARGET SHEET', `${mid} font-size="11" font-weight="700" fill="var(--accent)"`)}
    ${['Noise floor: NC 15–20', 'Isolation: about 60 dB', 'Decay: 0.25 s ± 15 %', 'Bass decay: under 1.5× mid', 'Finishes: light, daylight kept'].map((s, i) => `${T(446, 82 + i * 26, '☐ ' + s, 'font-size="11"')}`).join('')}`);

  const SVG_TIERS = S('700 230', 'Good, better and best tiers shown as three columns with what each buys', `
    ${T(350, 18, 'Offer three honest columns, not one take-it-or-leave-it price', `${mid} font-size="13" font-weight="700"`)}
    ${[['GOOD', 'Treatment in the existing shell', ['sealed door, lined walls', 'bass traps, cloud', 'quiet split unit, fresh air'], 96], ['BETTER', 'Decoupled lining + sound lock', ['independent walls and ceiling', 'deep rear and corner trapping', 'ducted low-velocity air'], 138], ['BEST', 'Floated room within a room', ['floated floor, double doors', 'built-in trapping behind fabric', 'remote plant, silencers'], 180]].map(([a, b, rows, hh], i) => {
      const x = 30 + i * 222;
      return `<rect x="${x}" y="${214 - hh}" width="196" height="${hh}" rx="8" fill="var(--panel2)" stroke="var(--c${i + 1})" stroke-width="2"/>${T(x + 98, 232 - hh, a, `${mid} font-size="12" font-weight="700" fill="var(--c${i + 1})"`)}${T(x + 98, 248 - hh, b, `${mid} font-size="10" font-weight="700"`)}${rows.map((r, k) => T(x + 98, 266 - hh + k * 15, r, `${mid} font-size="9.5" fill="var(--muted)"`)).join('')}`;
    }).join('')}
    <path class="leak-pulse" d="M40 32 L650 32 m-9 -5 l9 5 l-9 5" stroke="var(--muted)" stroke-width="1.5" fill="none"/>${T(60, 44, 'more isolation, lower noise, more depth, more money and time', 'font-size="9.5" fill="var(--muted)"')}`);

  const SVG_MONEY = S('700 190', 'Order of spending: what cannot be changed later is paid for first', `
    ${T(350, 18, 'Spend first on what you can never change later', `${mid} font-size="13" font-weight="700"`)}
    ${[['1', 'Shell, doors', 'and floor'], ['2', 'Air and', 'quiet plant'], ['3', 'Geometry and', 'bass control'], ['4', 'Wiring and', 'tie-lines'], ['5', 'Finishes', 'and fabric'], ['6', 'Furniture and', 'equipment']].map(([n, a, b], i) => {
      const x = 16 + i * 114, hh = 120 - i * 14;
      return `<rect x="${x}" y="${150 - hh}" width="100" height="${hh}" rx="6" fill="var(--c${i + 1})" opacity="${0.9 - i * 0.08}"/>${T(x + 50, 172 - hh, n, `${mid} font-size="15" font-weight="700" fill="var(--bg)"`)}${T(x + 50, 166, a, `${mid} font-size="10" font-weight="700"`)}${T(x + 50, 180, b, `${mid} font-size="10" font-weight="700"`)}`;
    }).join('')}
    ${T(690, 40, 'hard to change', 'text-anchor="end" font-size="9.5" fill="var(--muted)" transform="rotate(0)"')}
    <path d="M30 26 L670 62" stroke="var(--muted)" stroke-dasharray="4 4" fill="none"/>${T(40, 36, 'impossible to change later', 'font-size="9.5" fill="var(--muted)"')}${T(660, 76, 'easy to upgrade later', 'text-anchor="end" font-size="9.5" fill="var(--muted)"')}`);

  const SVG_TEAM = S('700 240', 'Who does what: consultant at the centre of client, architect, engineers and trades', `
    ${T(350, 18, 'Who does what — and who must talk to whom', `${mid} font-size="13" font-weight="700"`)}
    <circle cx="350" cy="130" r="40" fill="var(--accent)"/>${T(350, 127, 'Acoustic', `${mid} font-size="11" font-weight="700" fill="var(--bg)"`)}${T(350, 141, 'consultant', `${mid} font-size="11" font-weight="700" fill="var(--bg)"`)}
    ${[['Client', 'decides, pays', 350, 46], ['Architect', 'space, approvals', 560, 70], ['Structural engineer', 'loads, slabs', 610, 150], ['HVAC engineer', 'air, plant', 520, 214], ['Electrician', 'power, earthing', 350, 226], ['Contractor', 'builds, sequences', 180, 214], ['Carpenter / fabric', 'what you see', 90, 150], ['System integrator', 'wiring, tuning', 140, 70]].map(([a, b, x, y], i) => `<line x1="350" y1="130" x2="${x}" y2="${y}" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 5"><animate attributeName="stroke-dashoffset" values="${i % 2 ? '0;20' : '20;0'}" dur="1.4s" repeatCount="indefinite"/></line><rect x="${x - 66}" y="${y - 17}" width="132" height="34" rx="8" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.2"/>${T(x, y - 2, a, `${mid} font-size="11" font-weight="700"`)}${T(x, y + 11, b, `${mid} font-size="9" fill="var(--muted)"`)}`).join('')}`);

  const SVG_HOLD = S('700 200', 'A wall section being closed: the inspection must happen before the boards go on', `
    ${T(350, 18, 'A hold point: look before it is covered', `${mid} font-size="13" font-weight="700"`)}
    <rect x="60" y="50" width="16" height="120" fill="var(--muted)"/><rect x="250" y="50" width="16" height="120" fill="var(--muted)"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M84 ${62 + i * 18} q20 -10 40 0 q20 10 40 0 q20 -10 40 0 q20 10 36 0" stroke="var(--c3)" stroke-width="2" fill="none"/>`).join('')}
    <rect x="150" y="96" width="40" height="26" fill="var(--bad)" opacity=".85" class="leak-pulse"/>${T(170, 113, 'bridge', `${mid} font-size="9" font-weight="700" fill="var(--bg)"`)}
    <rect x="266" y="50" width="12" height="120" fill="var(--panel2)" stroke="var(--text)"><animate attributeName="x" values="330;266;266;330" keyTimes="0;.4;.8;1" dur="5s" repeatCount="indefinite"/></rect>
    <circle cx="170" cy="109" r="30" fill="none" stroke="var(--accent)" stroke-width="3"/><line x1="192" y1="131" x2="214" y2="156" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/>
    ${T(400, 70, 'Before the second face is boarded:', 'font-size="11" font-weight="700"')}
    ${['no timber, pipe or mortar touching both leaves', 'insulation loose and continuous', 'sockets offset, boxes sealed', 'perimeter gaps ready for sealant', 'photograph everything, with a tape in shot'].map((s, i) => T(408, 90 + i * 18, '✓ ' + s, 'font-size="10.5"')).join('')}`);

  /* =====================================================================
     DIAGRAMS — M41
     ===================================================================== */
  const SVG_ZONES = S('700 240', 'Reach zones on a studio desk seen from above', `
    ${T(350, 18, 'Put things where the hands already are', `${mid} font-size="13" font-weight="700"`)}
    <rect x="90" y="60" width="520" height="130" rx="10" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <path d="M350 214 m-250 0 a250 150 0 0 1 500 0" fill="var(--c2)" opacity=".14"/><path d="M350 214 m-170 0 a170 105 0 0 1 340 0" fill="var(--c4)" opacity=".2"/><path d="M350 214 m-95 0 a95 62 0 0 1 190 0" fill="var(--accent)" opacity=".3"><animate attributeName="opacity" values=".2;.45;.2" dur="2.4s" repeatCount="indefinite"/></path>
    <circle cx="350" cy="224" r="12" fill="var(--muted)"/>
    ${T(350, 186, 'every minute', `${mid} font-size="11" font-weight="700"`)}${T(350, 200, 'keyboard, mouse, transport, main fader', `${mid} font-size="9.5" fill="var(--muted)"`)}
    ${T(350, 136, 'every hour: controller, keys, monitor level, patchbay', `${mid} font-size="10.5" font-weight="700"`)}
    ${T(350, 86, 'rarely: outboard set-and-forget, power, computers → racks, closet', `${mid} font-size="10.5" font-weight="700"`)}
    ${T(60, 130, 'side', `${mid} font-size="10" fill="var(--muted)"`)}${T(60, 144, 'rack', `${mid} font-size="10" fill="var(--muted)"`)}${T(640, 130, 'side', `${mid} font-size="10" fill="var(--muted)"`)}${T(640, 144, 'rack', `${mid} font-size="10" fill="var(--muted)"`)}
    <rect x="34" y="70" width="52" height="110" rx="5" fill="none" stroke="var(--text)" stroke-dasharray="4 3"/><rect x="614" y="70" width="52" height="110" rx="5" fill="none" stroke="var(--text)" stroke-dasharray="4 3"/>`);

  const SVG_BOUNCE = S('700 220', 'A big flat desk reflects sound to the ears; a small low open desk does not', `
    ${T(350, 18, 'The desk is an acoustic object', `${mid} font-size="13" font-weight="700"`)}
    ${[[0, 'Big flat console top', true], [350, 'Small, low, open desk', false]].map(([ox, t, bad]) => `
      <rect x="${ox + 270}" y="56" width="34" height="56" rx="3" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="${ox + 276}" cy="84" r="6" fill="var(--accent)"/>
      <circle cx="${ox + 60}" cy="84" r="12" fill="var(--muted)"/>
      <line x1="${ox + 270}" y1="84" x2="${ox + 74}" y2="84" stroke="var(--accent)" stroke-width="2.5"/>
      ${bad ? `<rect x="${ox + 90}" y="140" width="170" height="8" fill="var(--text)"/><path d="M${ox + 270} 86 L${ox + 170} 140 L${ox + 72} 88" stroke="var(--bad)" stroke-width="2" fill="none" stroke-dasharray="6 4"><animate attributeName="stroke-dashoffset" values="20;0" dur="1s" repeatCount="indefinite"/></path>` : `<rect x="${ox + 96}" y="150" width="96" height="6" fill="var(--text)"/>${[0, 1, 2, 3, 4, 5].map((k) => `<line x1="${ox + 104 + k * 16}" y1="146" x2="${ox + 110 + k * 16}" y2="160" stroke="var(--c3)" stroke-width="2"/>`).join('')}<path d="M${ox + 270} 86 L${ox + 210} 176" stroke="var(--good)" stroke-width="2" fill="none" stroke-dasharray="6 4"/>`}
      ${T(ox + 175, 196, t, `${mid} font-size="12" font-weight="700"`)}${T(ox + 175, 212, bad ? 'late copy cancels a band: a comb-filter dip' : 'bounce misses the ears, or is scattered', `${mid} font-size="10" fill="${bad ? 'var(--bad)' : 'var(--good)'}"`)}`).join('')}`);

  const SVG_RACK = S('700 240', 'Rack layout rules: touch at hand height, heavy low, vents above hot units, air path bottom to top', `
    ${T(350, 18, 'A rack is a chimney with front panels', `${mid} font-size="13" font-weight="700"`)}
    <rect x="90" y="36" width="200" height="190" rx="5" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    ${[['patchbay', 'var(--accent)', 16], ['preamps, compressors', 'var(--accent)', 34], ['vent', 'var(--bg)', 14], ['valve unit (hot)', 'var(--c3)', 30], ['converter', 'var(--accent)', 16], ['vent', 'var(--bg)', 14], ['power amplifier (heavy, hot)', 'var(--c3)', 34], ['power', 'var(--muted)', 16]].reduce((acc, [n, c, hh]) => { acc.s += `<rect x="98" y="${acc.y}" width="184" height="${hh - 2}" rx="2" fill="${c}" stroke="var(--line)"/>${T(190, acc.y + hh / 2 + 3, n, `${mid} font-size="9.5" font-weight="700" fill="${c === 'var(--bg)' ? 'var(--muted)' : 'var(--bg)'}"`)}`; acc.y += hh; return acc; }, { s: '', y: 44 }).s}
    ${[0, 1, 2].map((i) => `<path d="M${320 + i * 0} ${214 - i * 60} q14 -14 0 -28 q-14 -14 0 -28" stroke="var(--bad)" stroke-width="2.5" fill="none" opacity=".8"><animate attributeName="opacity" values="0;.9;0" dur="2.4s" begin="${i * 0.6}s" repeatCount="indefinite"/></path>`).join('')}
    ${T(340, 222, 'cool air in, low', 'font-size="10" fill="var(--c2)"')}${T(340, 50, 'warm air out, high', 'font-size="10" fill="var(--bad)"')}
    ${['Touch daily → hand height', 'Heavy → bottom', 'Hot → space above, air path clear', '1 U = 44.45 mm; width 19 inches (482.6 mm)', 'Allow depth for plugs: unit + 10 cm', 'Rear access, or it will never be re-wired'].map((s, i) => T(440, 76 + i * 24, '• ' + s, 'font-size="10.5"')).join('')}`);

  const SVG_CABLE = S('700 210', 'Power and signal cables kept apart and crossing at right angles', `
    ${T(350, 18, 'Two rules stop most hum before it starts', `${mid} font-size="13" font-weight="700"`)}
    ${T(175, 44, 'Keep them apart', `${mid} font-size="12" font-weight="700"`)}
    <line x1="30" y1="80" x2="320" y2="80" stroke="var(--bad)" stroke-width="5"/><line x1="30" y1="150" x2="320" y2="150" stroke="var(--accent)" stroke-width="4"/>
    ${T(34, 72, 'mains', 'font-size="10" fill="var(--bad)"')}${T(34, 168, 'audio', 'font-size="10" fill="var(--accent)"')}
    <path d="M175 86 v58 m-5 -8 l5 8 l5 -8 m-10 -42 l5 -8 l5 8" stroke="var(--muted)" stroke-width="1.5" fill="none"/>${T(184, 120, '30 cm or more, or a metal divider', 'font-size="10" fill="var(--muted)"')}
    ${[0, 1, 2].map((i) => `<ellipse cx="${90 + i * 80}" cy="80" rx="10" ry="${18}" fill="none" stroke="var(--bad)" opacity=".6"><animate attributeName="ry" values="8;26;8" dur="1.6s" begin="${i * 0.3}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0;.7" dur="1.6s" begin="${i * 0.3}s" repeatCount="indefinite"/></ellipse>`).join('')}
    ${T(525, 44, 'Cross once, squarely', `${mid} font-size="12" font-weight="700"`)}
    <line x1="400" y1="110" x2="650" y2="110" stroke="var(--bad)" stroke-width="5"/><line x1="490" y1="56" x2="490" y2="170" stroke="var(--accent)" stroke-width="4"/><circle cx="490" cy="110" r="13" fill="none" stroke="var(--good)" stroke-width="3"/>${T(490, 190, '90°: almost no coupling', `${mid} font-size="10" fill="var(--good)"`)}
    <line x1="560" y1="64" x2="640" y2="160" stroke="var(--accent)" stroke-width="4" stroke-dasharray="6 3"/><circle class="leak-pulse" cx="598" cy="110" r="13" fill="none" stroke="var(--bad)" stroke-width="3"/>${T(626, 190, 'slanted: avoid', `${mid} font-size="10" fill="var(--bad)"`)}`);

  /* =====================================================================
     M39 — STUDY GUIDE: BECOMING AN ACOUSTIC CONSULTANT
     ===================================================================== */
  window.LESSONS.push({
    id: 'm-consultant-path', n: 'M39', track: 'master', title: 'Study Guide: Becoming an Acoustic Consultant and Studio Designer', level: 'Core', mins: 60,
    summary: 'What the job really is, the six pillars of skill it rests on, a staged roadmap from listener to independent practice, the kit and software to learn, how to build a portfolio from nothing, and the ethics that keep you trusted — with a skill radar, a study planner, a kit builder and a portfolio tracker.',
    tags: ['consultant', 'career', 'study guide', 'roadmap', 'studio designer', 'portfolio', 'measurement kit', 'ethics', 'mentor', 'skills', 'India', 'qualifications', 'ear training', 'learning plan'],
    sections: [
      { h: 'What an acoustic consultant actually does', html: `
        <p>From outside, studio design looks like choosing panels. From inside, most of the week is spent <b>finding out, predicting and explaining</b>. A consultant is paid for judgement: knowing what will happen in a room before it is built, saying so in numbers, and getting other people to build it correctly.</p>
        ${SVG_WEEK}
        ${table(['Activity', 'What it looks like', 'Share of a typical project'], [
          ['Listening and surveying', 'Client conversation, site measurements, noise survey, photographs', '10–15 %'],
          ['Calculating and modelling', 'Modes, decay, isolation, ventilation noise, loudspeaker geometry', '15–20 %'],
          ['Drawing and specifying', 'Plans, sections, junction details, schedules, written specification', '30–40 %'],
          ['Coordinating', 'Architect, structural and HVAC engineers, electrician, contractor', '10–15 %'],
          ['Site inspection', 'Hold-point visits before work is covered, answering questions', '10–15 %'],
          ['Commissioning and reporting', 'Measuring the finished room, tuning, hand-over report', '5–10 %'],
        ])}
        <p>The proportions surprise newcomers: <b>drawing and talking outweigh measuring and listening</b>. A brilliant idea that the carpenter cannot read from the drawing does not get built.</p>
        <div class="callout mentor">The practices whose rooms you admire tend to share one habit: they start with a long conversation and end by listening to the finished room with the client's own music. The measuring happens in between, and serves both ends.</div>` },
      { h: 'The kinds of practice, and where studio design sits', html: `
        <p>"Acoustics" is several professions sharing one physics. Knowing the map helps you choose a road — and tells you where the steady work is.</p>
        <div class="uc-grid">
          ${uc('🏢', 'Building acoustics', [['Work', 'Sound insulation between homes, offices, schools, hospitals; room acoustics for ordinary rooms; plant noise'], ['Clients', 'Architects, developers, contractors'], ['Do', 'The largest and steadiest field. Standards-driven, report-heavy.']])}
          ${uc('🌳', 'Environmental noise', [['Work', 'Traffic, industry, construction and event noise; planning assessments; long-term monitoring'], ['Clients', 'Authorities, industry, event organisers'], ['Do', 'Requires standards-grade instruments and careful method.']])}
          ${uc('🎚️', 'Studio and critical-room design', [['Work', 'Control rooms, live rooms, immersive rooms, listening rooms, home cinemas'], ['Clients', 'Musicians, producers, studios, broadcasters, private owners'], ['Do', 'A small, reputation-driven niche where your ears and audio experience count most.']])}
          ${uc('🔊', 'Sound-system and AV design', [['Work', 'Loudspeaker systems for halls, worship spaces, venues; speech intelligibility; tuning'], ['Clients', 'Venues, integrators, architects'], ['Do', 'Blends room acoustics with electroacoustics. Good entry route for audio engineers.']])}
          ${uc('🏛️', 'Performance spaces', [['Work', 'Concert halls, theatres, auditoria, rehearsal rooms'], ['Clients', 'Public bodies, large architects'], ['Do', 'Few projects, long timescales, usually done by established teams.']])}
          ${uc('⚙️', 'Product and industrial noise', [['Work', 'Quieter machines, vehicles, appliances; vibration control'], ['Clients', 'Manufacturers'], ['Do', 'Engineering-degree territory, laboratory based.']])}
        </div>
        <p>Studio design is the smallest of these markets. Many respected studio designers earn part of their living from neighbouring work — home cinemas, worship spaces, offices, noise complaints — and are better designers for it, because those jobs teach isolation, ventilation and construction far more often than studios do.</p>
        <div class="callout data"><b>A realistic mix for a young practice:</b> one or two studios a year that you are proud of, surrounded by a steady flow of treatment jobs, home cinemas, meeting rooms and isolation problems that pay the rent and build your judgement.</div>` },
      { h: 'The skill stack: six pillars', html: `
        ${SVG_PILLARS}
        <p>Each pillar has a level you can recognise as "good enough to be trusted". Use the links: this app's tracks were arranged to cover all six.</p>
        ${table(['Pillar', 'What good looks like', 'How to learn it', 'Start here'], [
          ['<b>Physics &amp; maths</b>', 'You can estimate a mode, a decay time or a level difference on paper, within a sensible margin, before opening any software', 'Pencil-and-paper problems, then check by measuring', `${L('sound', 'Sound')} · ${L('decibels', 'Decibels')} · ${L('propagation', 'Propagation')} · ${L('modes', 'Modes')} · ${L('reverb', 'Reverberation')} · ${L('workbook', 'Workbook')}`],
          ['<b>Building &amp; materials</b>', 'You can draw a wall-to-floor junction and explain how each trade will build it, and what they will get wrong', 'Site visits, talking to tradespeople, taking things apart', `${L('isolation', 'Isolation')} · ${L('flanking', 'Flanking')} · ${L('m-walls', 'Walls')} · ${L('m-floors', 'Floors')} · ${L('m-door-build', 'Doors')} · ${L('m-hvac', 'HVAC')} · ${L('m-india', 'India')}`],
          ['<b>Measuring &amp; instruments</b>', 'Your measurements repeat, you know their uncertainty, and you can tell a room problem from a measurement mistake', 'Measure the same things many times; break your own set-up deliberately', `${L('measurement', 'Measurement')} · ${L('a-measure-depth', 'Measurement in depth')} · ${L('criteria', 'Criteria')}`],
          ['<b>Audio &amp; loudspeakers</b>', 'You can place and align monitors, read a loudspeaker\'s data, and hear what a measurement is showing', 'Critical listening, set up many systems', `${L('hearing', 'Hearing')} · ${L('a-loudspeakers', 'Loudspeakers')} · ${L('a-tuning', 'Tuning')} · ${L('control-room', 'Control rooms')} · ${L('m-immersive-room', 'Immersive rooms')}`],
          ['<b>Drawing &amp; writing</b>', 'A stranger can build from your drawings and a non-technical client can repeat your summary', 'Draw by hand first, then in software; have others read your work', `${L('m-playbook', 'Playbook')} · ${L('m-client-process', 'The consultant\'s process')} · ${L('m-design-language', 'Design language')}`],
          ['<b>Business &amp; ethics</b>', 'Clear scope, honest ranges, fair fees, and the confidence to say "that will not work"', 'Mentors, small jobs, written agreements from day one', `${L('m-client-process', 'The consultant\'s process')} · ${L('m-standards', 'Standards')}`],
        ])}
        <p>Rate yourself below. The radar is saved on this device, so come back every few months and watch the shape fill out.</p>`, viz: 'skillRadar' },
      { h: 'A staged roadmap, with proof at every step', html: `
        ${SVG_STAIRS}
        <p>The stages are defined by what you can <b>show</b>, not by how long you have studied. Move on when the proof exists.</p>
        ${table(['Stage', 'You are learning to…', 'Weekly exercises', 'Proof of skill'], [
          ['<b>0 · Listener</b>', 'Hear rooms and trust a measurement', 'Listen to the same three reference tracks in every room you enter; sweep a sine tone and walk your own room; make your first room measurement', 'A measured before-and-after of your own room with a one-page explanation'],
          ['<b>1 · Foundations</b><br>0–6 months', 'Predict simple things by hand', 'Ten workbook problems; one mode table; one decay-time prediction checked by measurement; one level-difference test across a wall', 'A notebook where your sums and your measurements agree — and notes on why they did not when they did not'],
          ['<b>2 · Tools</b><br>6–12 months', 'Use instruments, models and drawings properly', 'One gated loudspeaker measurement; one modelled room; one junction detail drawn at 1:5 each week; one site visit a month', 'A complete drawing set, calculation pack and report for one room (real or hypothetical)'],
          ['<b>3 · Supervised projects</b><br>12–24 months', 'Deliver real rooms with someone checking you', 'Site inspections with photographs; commissioning measurements; client meetings; a lessons-learned page per job', 'Three built projects with before/after data and a reference from each client'],
          ['<b>4 · Independent practice</b>', 'Carry responsibility', 'A peer review of every design; one new technique or standard studied each month', 'Repeat clients, referrals from architects and contractors, insurance in place'],
        ])}
        <div class="callout warn">The dangerous moment is the jump from Stage 2 to paid isolation work. Treatment mistakes cost a re-hang. Isolation mistakes are sealed inside walls, cost the client their budget and cost you your name. Do your first isolation projects with a mentor, or do treatment-only jobs until you have one.</div>
        <p>The planner sizes the roadmap to your own hours and background.</p>`, viz: 'studyPlanner' },
      { h: 'Formal routes and the self-taught route', html: `
        <p>There is no single gate into this profession, and the right route depends on which kind of practice you want.</p>
        ${table(['Route', 'What it gives you', 'Limits', 'Best for'], [
          ['Degree in physics, engineering or architecture', 'Mathematical and construction grounding; recognised by employers', 'Little or no acoustics unless you choose it as a project', 'Building acoustics, working inside consultancies'],
          ['Degree in audio or music technology', 'Ears, signal flow, measurement habits', 'Light on construction and building physics', 'Studio and sound-system design'],
          ['Postgraduate course in acoustics', 'The full theory, laboratory practice, a thesis', 'Time and cost; few places offer it', 'Anyone aiming at formal consultancy'],
          ['Diploma and membership grades of your national acoustics institute or society', 'A recognised badge, a code of conduct, a network of mentors', 'Entry requirements; examinations', 'Signing reports for building and planning work'],
          ['Short courses and workshops', 'A focused skill in days', 'Quality varies; no substitute for practice', 'Filling a specific gap'],
          ['Self-taught with a mentor', 'Fastest path to practical competence if you are disciplined', 'No badge; you must prove yourself with built work', 'Private studio and listening-room clients'],
        ])}
        <div class="callout example"><b>What is realistic in India.</b> Dedicated acoustics degrees are rare. The common routes are: an engineering or architecture degree followed by a postgraduate specialisation or thesis in acoustics; an audio-engineering background followed by apprenticeship with a practising designer; or a start inside an interior or AV integration firm that builds studios, auditoria and home cinemas. Joining the national acoustical society as a student or associate member, attending its meetings and reading its journal costs little and puts you in a room with the people who can mentor you.</div>
        <p><b>Why membership and insurance matter.</b> A private studio owner will hire you on the strength of your rooms. An architect, a developer or a court will ask what body you belong to and whether you carry professional indemnity insurance — because building work involves other people's money, safety and legal duties. If you plan to sign isolation or noise reports, plan for both.</p>
        ${myth([['"A certificate makes you a consultant."', 'A certificate makes you <i>eligible</i>. Built rooms that measure as you forecast make you a consultant.'], ['"Self-taught designers are not real acousticians."', 'Many respected studio designers came from the control room, not the lecture hall. What they share is that they measured everything and kept learning the building science.']])}` },
      { h: 'Train your ears alongside your sums', html: `
        <p>The best rooms are signed off twice: once by the analyser and once by people who have spent years on both sides of the glass. You need both abilities, and the ears take longer.</p>
        ${flow([['Reference tracks', 'Choose five recordings you know deeply. Play them in every room you visit, at the same level.'], ['Name what you hear', 'Boomy note? Harsh edge? Phantom centre wandering? Write it down before you measure.'], ['Then measure', 'Find the cause on the graph: a mode, a reflection, a decay-time bump.'], ['Close the loop', 'Change one thing, listen again, measure again.']])}
        <ul>
          <li><b>Frequency bands.</b> Practise identifying an octave-band boost or cut by ear until you are right four times in five. Then third-octaves.</li>
          <li><b>Level steps.</b> Learn what 1, 3 and 10 dB sound like — the ${`<a href="#/hear">Hear the Decibel</a>`} page exists for exactly this.</li>
          <li><b>Decay.</b> Clap, listen, guess the decay time, then measure. Your guesses get good surprisingly fast.</li>
          <li><b>Blind comparison.</b> Never judge a change you can see. Level-match and compare blind, as explained in ${L('psy-truth', 'Audio facts, myths and blind testing')}.</li>
          <li><b>Protect the instrument.</b> Keep working levels moderate and take breaks. A consultant with damaged hearing has lost a pillar.</li>
        </ul>
        <div class="callout mentor">Write the listening note <i>before</i> you look at the measurement. Done the other way round, you will simply hear what the graph told you to hear.</div>` },
      { h: 'The measurement kit at three budgets', html: `
        ${SVG_KIT}
        <p>Buy the kit your current stage needs, and learn to verify it. An expensive microphone used carelessly is worth less than a modest one that has been checked.</p>
        <div class="callout data"><b>Three checks that cost nothing:</b><br>1. <b>Loopback</b> — wire an interface output to an input and measure. Anything other than a flat line is your interface, not the room.<br>2. <b>Repeat</b> — measure, move nothing, measure again. Then come back tomorrow. Differences are your uncertainty.<br>3. <b>Swap</b> — borrow a second microphone and compare at the same point. If they disagree, one calibration file is wrong.</div>
        <p>Absolute sound levels need a <b>sound calibrator</b>: a small device that produces a known level (usually 94 dB at 1 kHz) at the microphone. Without one, your graphs show shape correctly but their level is a guess — fine for room tuning, not acceptable for a noise report.</p>`, viz: 'kitBuilder' },
      { h: 'Software to learn, by category', html: `
        <p>Learn <b>categories</b>, not products. Products change; the questions they answer do not.</p>
        ${table(['Category', 'Question it answers', 'What to master', 'Trap'], [
          ['Room-measurement program', 'What is this room doing now?', 'Sweeps, impulse response, gating, waterfall and decay plots, averaging, smoothing choices', 'Smoothing away the problem; trusting one microphone position'],
          ['Mode and treatment calculators', 'What should I expect from these dimensions and this absorber?', 'Mode spacing, absorber depth versus frequency, resonator tuning', 'Treating a calculator\'s output as exact'],
          ['Isolation prediction tool', 'What will this wall or floor achieve?', 'Layer build-ups, cavity depth, resonance, reading a spectrum not just one number', 'Forgetting flanking and leaks, which the tool does not see'],
          ['Ray-tracing and auralisation package', 'Where do reflections go, and what will it sound like?', 'Geometry clean-up, absorption and scattering inputs, reading the reflection sequence', 'Using it below the frequency where rays mean anything — see ' + L('modelling', 'Predicting rooms by computer')],
          ['CAD, BIM or 3-D drawing program', 'How do I tell the builder?', 'Layers, scales, dimensioning to finished faces, section cuts, detail sheets', 'Beautiful renders, no buildable details'],
          ['Spreadsheet', 'Everything else', 'Your own templates for decay time, level sums, ventilation noise, budgets', 'Hidden errors: build in a check row'],
          ['Report and drawing templates', 'How do I look professional and stay consistent?', 'A fixed structure: brief, findings, forecast, recommendations, limits', 'Copying old text that does not fit the new job'],
        ])}
        <div class="callout mentor">Before you rely on any prediction tool, model something you can measure — your own room, a wall you can test — and compare. That one afternoon teaches you how far to trust the tool for the rest of your career.</div>` },
      { h: 'The mathematics you really need', html: `
        <p>Less than people fear, but you must own it rather than look it up.</p>
        ${table(['Topic', 'You should be able to…', 'Used for'], [
          ['Logarithms and decibels', 'Convert ratios to dB and back; add and average levels; know that +3 dB is double the power and +10 dB is roughly twice as loud', 'Everything — ' + L('decibels', 'Decibels')],
          ['Wavelength and frequency', 'Jump between metres and hertz without a calculator (343 ÷ f)', 'Absorber depth, mode frequencies, barrier and diffuser size'],
          ['Areas, volumes, ratios', 'Take off surfaces from a drawing quickly and correctly', 'Decay time, absorption area, budgets'],
          ['Trigonometry', 'Find angles and path lengths from a plan and section', 'Reflection points, speaker angles, sightlines'],
          ['Simple resonance formulas', 'Mass–spring and cavity resonance, with units right', 'Floors, panel and cavity absorbers, double walls'],
          ['Complex numbers, lightly', 'Understand magnitude and phase as two halves of one quantity', 'Reading transfer functions and crossovers'],
          ['Basic statistics', 'Mean, spread, and what "±" means on a result', 'Uncertainty, spatial averaging, honest forecast ranges'],
        ])}
        <p>Work through the ${L('workbook', 'practice workbook')} with a pencil. The goal is the habit of <b>estimating first</b>: write down what you expect, then calculate, then measure. The gap between the three is where learning happens.</p>` },
      { h: 'Reading drawings and writing specifications', html: `
        <p>A consultant's product is paper. You must read architectural drawings fluently — plans, sections, elevations, reflected ceiling plans, details, schedules — and produce your own that leave no room for improvisation.</p>
        <ul>
          <li><b>Scales:</b> 1:100 or 1:50 for layouts, 1:20 for room elevations, 1:5 and 1:2 for junctions. If a detail matters acoustically, it deserves 1:5.</li>
          <li><b>Sections reveal the truth.</b> Plans hide ceilings, floors, ducts and beams. Always cut a section through the worst place.</li>
          <li><b>Junctions, not surfaces.</b> Walls rarely fail in the middle. They fail where they meet the floor, the ceiling, the door frame and the duct.</li>
          <li><b>Schedules:</b> doors, windows, wall types, finishes and fabrics each get a table with a code that appears on the drawings.</li>
          <li><b>Specification:</b> state what must be achieved (performance) or exactly how to build it (prescriptive) — and never both for the same item, or you own every contradiction.</li>
        </ul>
        <p>All of this is developed in ${L('m-client-process', 'The consultant\'s process')}, with an annotated mini drawing set.</p>
        <div class="callout example"><b>Weekly drill.</b> Photograph a junction on any building site. At home, draw it at 1:5 as built, then draw it again as it should have been for good sound isolation. Fifty of these and you will read buildings the way a mechanic reads engines.</div>` },
      { h: 'Building a portfolio from zero', html: `
        ${SVG_PORTFOLIO}
        <p>Nobody hires an untested designer for an expensive room, so start where the stakes are low and the learning is high. Each project is documented the same way: <b>measured before, drawings and calculations, photographs of the build, measured after, lessons learned.</b></p>
        <div class="uc-grid">
          ${uc('🏠', 'Your own room', [['Why', 'You can measure it a hundred times and nobody minds'], ['Do', 'Fix speaker placement first, then bass, then reflections; record each step']])}
          ${uc('🎸', 'A friend\'s studio or rehearsal room', [['Why', 'Your first real brief: someone else\'s taste and budget'], ['Do', 'Write the brief down and get them to agree it']])}
          ${uc('🛕', 'A place of worship or community hall', [['Why', 'Big reverberant volume, speech clarity, grateful users'], ['Do', 'Measure decay and intelligibility; propose treatment and loudspeaker aiming together']])}
          ${uc('🏫', 'A classroom or meeting room', [['Why', 'Clear published criteria to design against'], ['Do', 'Show the calculation, the criterion and the result in one page']])}
          ${uc('☕', 'A café or restaurant', [['Why', 'Finishes must survive grease, cleaning and fashion'], ['Do', 'Measure noise when full, before and after']])}
          ${uc('🚪', 'One isolation fix', [['Why', 'A door or window improved and proven teaches leaks better than any book'], ['Do', 'Level difference in octave bands before and after']])}
        </div>
        <p>Do the early ones free or at cost, say so plainly, and ask in return for permission to measure, photograph and publish. Tick projects off below.</p>`, viz: 'portfolioTracker' },
      { h: 'Mentors, site experience and a practice plan', html: `
        <p>Books and apps teach principles. <b>Sites teach consequences.</b> Find both.</p>
        <ul>
          <li><b>Shadow a contractor</b> for a week on any interior fit-out. Watch what happens to drawings on site, in what order trades arrive, and how often "we always do it this way" overrides the detail.</li>
          <li><b>Learn from carpenters.</b> Ask how they would build your detail faster. Often they are right, and sometimes their shortcut is the acoustic defect — you need to know which.</li>
          <li><b>Learn from HVAC installers.</b> Air noise ruins more good rooms than bad walls do. Understand ducts, fans, velocity and flexible connections from the people who fit them.</li>
          <li><b>Find a mentor</b> by being useful: offer to carry kit, take site photographs, draft details, do measurements. Bring your notebook of sums-versus-measurements; it shows seriousness better than any CV.</li>
          <li><b>Present your work</b> at a local society meeting or to a group of audio engineers. Explaining a project in public exposes every gap.</li>
        </ul>
        <div class="callout data"><b>A practice plan using only this app:</b><br>• <b>Acoustics track</b> end to end for the physics — ${L('sound', 'Sound')} through ${L('halls', 'Halls')}, then ${L('outdoor-sound', 'Outdoor sound')}, ${L('impact-structure', 'Impact sound')} and ${L('modelling', 'Modelling')}.<br>• <b>Master class</b> for buildings and rooms — ${L('m-walls', 'Walls')}, ${L('m-floors', 'Floors')}, ${L('m-door-build', 'Doors')}, ${L('m-hvac', 'HVAC')}, ${L('m-small-rooms', 'Small rooms')}, ${L('m-control', 'Control rooms')}, ${L('m-playbook', 'Playbook')}, ${L('m-standards', 'Standards')}.<br>• <b>Audio track</b> for the electroacoustic side — ${L('a-loudspeakers', 'Loudspeakers')}, ${L('a-tuning', 'Tuning')}, ${L('a-measure-depth', 'Measurement in depth')}, ${L('a-intelligibility', 'Intelligibility')}.<br>• <b>Finish and craft</b> — ${L('m-design-language', 'Design language')}, ${L('m-fabric', 'Fabric')}, ${L('m-fabric-install', 'Fabric installation')}.<br>Alongside, own <b>one comprehensive handbook per pillar</b> — one on architectural acoustics, one on sound insulation in buildings, one on sound reproduction and loudspeakers, one on measurement — and read each cover to cover once, slowly.</div>` },
      { h: 'Ethics: what keeps you trusted', html: `
        <div class="uc-grid">
          ${uc('⚖️', 'Independence', [['Risk', 'Recommending a product because you earn from it'], ['Do', 'Declare any commission. Specify by performance so alternatives can compete.']])}
          ${uc('📏', 'Honest ranges', [['Risk', 'Promising "65 dB of isolation" as a single number'], ['Do', 'Give a range and say what it depends on: workmanship, flanking, the existing building.']])}
          ${uc('🚫', 'No impossible promises', [['Risk', 'Agreeing that drums at midnight in an apartment will be inaudible'], ['Do', 'Say what is achievable, in writing, before design starts.']])}
          ${uc('🧯', 'Safety and structure', [['Risk', 'Adding tonnes of mass or blocking escape routes and ventilation'], ['Do', 'Refer loads to a structural engineer and fire questions to a qualified person. Never guess.']])}
          ${uc('✍️', 'Respect for others\' work', [['Risk', 'Copying another designer\'s drawings or details'], ['Do', 'Study principles, credit ideas, draw your own solutions. A gallery photograph is a lesson, not a template.']])}
          ${uc('🔍', 'Own your errors', [['Risk', 'Hiding a result that missed the forecast'], ['Do', 'Report it, explain it, fix what is yours. Clients forgive mistakes far more readily than silence.']])}
        </div>
        <div class="callout safety">Acoustic work touches structure, fire safety, electricity and air quality. Heavy constructions, sealed rooms without fresh air, combustible linings and blocked exits can injure people. Know the limits of your competence and bring in the right professional — it is part of the job, not a failure of it.</div>` },
      { h: 'Beginner traps, and a twelve-month plan', html: `
        ${myth([
          ['"I will learn the physics later; first I will get clients."', 'Your first clients become your reputation. Do Stage 0 and Stage 1 properly — they take months, not years.'],
          ['"More absorption is always better."', 'Over-damped mid and high frequencies with untouched bass is the classic amateur room. Balance across the spectrum is the goal.'],
          ['"The software said so."', 'Every tool answers a narrower question than you asked. Flanking, leaks and workmanship are yours to judge.'],
          ['"Isolation and treatment are the same thing."', 'One keeps sound in or out; the other shapes sound inside. Different physics, different materials, different budgets.'],
          ['"I can copy that famous room."', 'You can copy its look. Its performance came from its dimensions, its shell, its ventilation and a hundred hidden decisions.'],
          ['"A good design speaks for itself."', 'A good design that is badly drawn, badly explained or never inspected gets built badly.'],
        ])}
        ${table(['Months', 'Study', 'Practice', 'Evidence produced'], [
          ['1–2', 'Sound, decibels, hearing, propagation', 'Measure your own room; reference-track listening log', 'First measurement set and listening notes'],
          ['3–4', 'Modes, reverberation, absorption, diffusion', 'Mode table and decay prediction for your room, checked by measurement', 'Sums-versus-measurement notebook'],
          ['5–6', 'Isolation, flanking, vibration, floors, criteria', 'Level-difference test across one wall; background-noise survey', 'A two-page isolation and noise report'],
          ['7–8', 'Measurement in depth, loudspeakers, tuning', 'Gated speaker measurement; set up and align a pair of monitors blind-tested', 'A monitor placement study'],
          ['9–10', 'Walls, floors, doors, HVAC, playbook', 'Ten junction details at 1:5; two site visits', 'A detail book'],
          ['11–12', 'The consultant\'s process, design language, fabric', 'A complete design for one small room, real or imagined, and treatment of a friend\'s room', 'Drawing set, forecast, and one before/after project'],
        ])}
        <div class="callout mentor">At the end of the year, re-rate yourself on the radar. Then show the notebook, the detail book and the two projects to someone who does this for a living, and ask the only question that matters: <i>"What would you not trust me with yet?"</i></div>` },
    ],
    quiz: [
      { q: 'On a typical studio project, which activity takes the largest share of a consultant\'s time?', opts: ['Measuring the finished room', 'Drawing, detailing and specifying', 'Choosing acoustic products', 'Listening to music with the client'], a: 1, why: 'A design only exists for the builder as drawings and a specification. Detailing junctions and writing schedules usually outweighs every other task.' },
      { q: 'Why should your first paid isolation projects be done with a mentor?', opts: ['Isolation uses more mathematics', 'Isolation mistakes are sealed inside the construction and are very costly to correct', 'Clients insist on it', 'Treatment is not real acoustics'], a: 1, why: 'A treatment error can be re-hung in an afternoon. An isolation error is hidden behind finished walls and usually cannot be fixed without rebuilding.' },
      { q: 'You have a good measurement microphone and interface but no sound calibrator. What can you trust?', opts: ['Absolute sound levels to within 1 dB', 'The shape of responses and before/after differences, but not absolute level', 'Nothing at all', 'Only measurements above 1 kHz'], a: 1, why: 'Without a known reference level the whole chain has an unknown gain. Relative results — shapes, differences, decay times — remain valid.' },
      { q: 'What makes a portfolio project count as evidence?', opts: ['A well-known client name', 'Attractive photographs of the finished room', 'Before and after measurements, drawings and a note of lessons learned', 'The amount of money spent'], a: 2, why: 'Proof is the measured change and the reasoning behind it. Photographs show taste; data and drawings show competence.' },
      { q: 'A client asks you to guarantee that drums at midnight will be inaudible to the flat below. What is the professional response?', opts: ['Agree and specify the heaviest wall you can', 'Agree, but add a small contingency', 'Explain what is realistically achievable in that building, in writing, before design begins', 'Refuse to discuss it'], a: 2, why: 'Promising the impossible is the fastest way to lose trust. Give an honest range and the conditions it depends on, and offer alternatives such as different hours or sources.' },
    ],
  });

  /* =====================================================================
     M40 — THE CONSULTANT'S PROCESS
     ===================================================================== */
  window.LESSONS.push({
    id: 'm-client-process', n: 'M40', track: 'master', title: 'The Consultant\'s Process: Brief, Forecast, Budget Tiers, Drawings and Commissioning', level: 'Core', mins: 60,
    summary: 'How a studio project runs from the first conversation to hand-over: the questions to ask, the site survey, turning words into a target sheet, forecasting in honest ranges, good/better/best budgets, stages and deliverables, the drawing set, site hold points, commissioning, fees and plain-language communication — with a brief builder, a budget tool, a stage planner, a forecast-versus-measured explorer and an annotated drawing set.',
    tags: ['process', 'brief', 'client', 'survey', 'target sheet', 'forecast', 'budget', 'tiers', 'drawings', 'specification', 'site inspection', 'hold point', 'commissioning', 'fees', 'contract', 'design and build', 'India'],
    sections: [
      { h: 'The first conversation', html: `
        <p>The most valuable hour of a project is the first one, and it is mostly spent listening. You are trying to learn not just what the client wants built, but <b>how they work, what they hear, and what they are afraid of</b>.</p>
        ${SVG_FUNNEL}
        ${table(['Ask about…', 'Example question', 'What you are really finding out'], [
          ['Work', 'What will you do in here most days? And on the unusual days?', 'Room type and the criteria that go with it'],
          ['Hours', 'When do you work? When do the neighbours sleep?', 'How much isolation is needed, and in which direction'],
          ['Loudest source', 'What is the loudest thing that will ever happen in this room?', 'The isolation design case — usually bass or drums'],
          ['Neighbours and building', 'Who is on the other side of each wall, the floor and the ceiling?', 'Flanking risk and what "quiet enough" means'],
          ['Monitoring', 'Which loudspeakers, how far away, how loud? Stereo or immersive?', 'Geometry, depth for treatment, future provision'],
          ['Taste', 'Play me a room you love working in. What do you dislike about your current room?', 'Preferred low end and liveness — these differ widely between people'],
          ['People', 'How many in the room at once? Clients on a sofa?', 'Seating area, air quantity, sightlines'],
          ['Picture', 'Will the room be filmed or photographed?', 'Lighting, background wall, finish quality'],
          ['Look and feel', 'Show me three rooms — of any kind — whose atmosphere you want.', 'Design language, daylight, materials'],
          ['Growth', 'What might change in five years?', 'Spare conduits, speaker positions, a second room'],
          ['Money and time', 'What investment range and timeline are you planning around?', 'Whether the brief is possible at all'],
          ['Constraints', 'Lease or owned? Any structural limits, building rules, approvals?', 'What you may not touch'],
        ])}
        <div class="callout mentor">Listen to the pauses as well as the answers. A client who hesitates over the budget question, or who says "the neighbours are fine" a little too quickly, has just told you where the project's real risk lies.</div>
        <p>Ask for photographs, sketches and any floor plans <b>before</b> you visit, and ask the budget and timeline questions on the very first form. It saves both sides from designing a room that was never going to be built.</p>` },
      { h: 'The site survey', html: `
        <p>Never design from a floor plan alone. The survey is a half-day well spent, and the list is always the same.</p>
        ${flow([['Measure', 'Every dimension, twice. Diagonals, beam drops, sill heights, door openings.'], ['Look up and down', 'What is the slab? What is above and below? Where do beams and columns run?'], ['Trace services', 'Ducts, pipes, drains, electrical boards, earthing, existing air-conditioning.'], ['Listen and log', 'Background noise, day and night. Traffic, lifts, plumbing, neighbours.'], ['Test the shell', 'Play pink noise, walk next door. Tap walls and floors. Find the weak path.'], ['Record', 'Photographs of everything with a tape in shot. Sketch as you go.']])}
        <ul>
          <li><b>Structure:</b> concrete slab or timber? Masonry or framed walls? Can the floor carry extra mass? If there is any doubt, a structural engineer decides, not you.</li>
          <li><b>Noise survey:</b> at least a short daytime sample and a late-night sample. The quietest hour sets how audible your client will be; the noisiest sets how much isolation they need for themselves.</li>
          <li><b>Access:</b> can full sheets, long timbers and a heavy door get up the stairs?</li>
          <li><b>Power:</b> supply capacity, earthing quality, where a clean technical feed can come from.</li>
          <li><b>Rules:</b> landlord restrictions, building-society rules, working hours for contractors, approvals.</li>
        </ul>
        <div class="callout warn">The cheapest moment to discover a drain pipe inside the proposed wall, a beam across the ceiling cloud or a lift motor next door is on survey day.</div>` },
      { h: 'Turning words into a target sheet', html: `
        <p>A brief in words cannot be checked. A <b>target sheet</b> can. It has five or six lines, each with a number and a tolerance, and each traceable to something the client said.</p>
        ${table(['Target', 'Mix or mastering room', 'Production room', 'Tracking room', 'Voice booth'], [
          ['Background noise (ventilation on)', 'NC 15–20', 'NC 20–25', 'NC 15–20', 'NC 15'],
          ['Isolation to neighbours', 'Set by loudest level, hours and the neighbour\'s quiet — often 55–65 dB', '50–60 dB', '60–70 dB with drums', '50–60 dB'],
          ['Mid-band decay time', '0.2–0.35 s by room volume, ±15 %', '0.25–0.4 s', '0.4–0.9 s, often adjustable', '0.15–0.25 s'],
          ['Low-frequency behaviour', 'Bass decay under about 1.5–2× mid; no isolated ringing mode', 'As mix room, slightly relaxed', 'Even, not boomy', 'No audible boxiness'],
          ['Early reflections', '10 dB or more below direct for the first 15–20 ms', '6–10 dB below', 'No flutter; chosen liveliness', 'None strong at the microphone'],
          ['Immersive readiness', 'Speaker positions, backing and conduits planned', 'Optional', 'Not applicable', 'Not applicable'],
        ])}
        <p>The background to these numbers is in ${L('criteria', 'Criteria')} and ${L('m-standards', 'Standards explained')}; published recommendations differ and are revised, so cite the edition you used. Notice that taste enters the sheet: two mix engineers can reasonably ask for different bass decay.</p>
        <p>Try the builder: answer the questions as your client would, then read the brief back to them.</p>`, viz: 'briefBuilder' },
      { h: 'Feasibility and forecast metrics', html: `
        <p>Before design begins in earnest, answer one question: <b>can this brief be met in this building for this money?</b> The answer is a set of <i>forecast metrics</i> — predicted isolation, noise floor, decay time and low-frequency behaviour — presented so the client can choose.</p>
        <div class="callout physics"><b>Why forecasts are ranges.</b> A partition predicted at 60 dB will measure 60 dB only if every junction is perfect and no sound finds another path. Real buildings add flanking through floors and ceilings, leaks at services, and workmanship that varies from metre to metre. Decay-time predictions inherit the uncertainty of absorption data, which differ between laboratories and mountings. An honest forecast therefore reads "55–62 dB" or "0.25 s ± 15 %", and says what would push it to either end.</div>
        ${SVG_TIERS}
        <p>Give the client three columns. Each tier states what it buys in plain language — "you can mix at night at moderate level" — beside the numbers. People choose well when the trade is visible.</p>
        <div class="callout mentor">Design so that even the <b>lower edge</b> of your forecast range meets the brief. Then the normal imperfections of construction land you on target instead of in a dispute.</div>` },
      { h: 'Where the money goes', html: `
        ${SVG_MONEY}
        <p>Studio budgets fail in a predictable way: too much on what is seen and bought last, too little on what is hidden and built first. The spending order follows one rule — <b>pay first for what can never be changed later.</b></p>
        ${table(['Priority', 'Why', 'Typical share of a full build'], [
          ['Isolation shell, floor, doors, windows', 'Sealed in for the life of the room', '35–45 %'],
          ['Ventilation and quiet plant', 'Sets the noise floor; ducts are buried behind everything else', '10–18 %'],
          ['Geometry and bass control', 'Needs depth that must be reserved at the start', '10–18 %'],
          ['Electrical, earthing, tie-lines', 'Cheap now, disruptive later', '5–8 %'],
          ['Finishes and fabric', 'Can be simple today and upgraded in a few years', '6–12 %'],
          ['Furniture', 'Replaceable at any time', '3–8 %'],
          ['Contingency', 'Existing buildings always hide something', '10–15 %'],
        ])}
        <p><b>Value engineering without wrecking performance:</b> simplify shapes, reduce the number of rooms, use plainer finishes, phase the furniture — but do not thin the walls, shrink the ducts, delete the sound lock or remove the hold-point inspections. Those "savings" cannot be bought back.</p>
        <p>Move the sliders and watch which outcome suffers.</p>`, viz: 'budgetTiers' },
      { h: 'Stages and deliverables', html: `
        <p>Splitting a project into stages protects both sides: the client approves each step before paying for the next, and you never draw details for a layout that is about to change.</p>
        ${table(['Stage', 'You produce', 'Client decides'], [
          ['1 · Brief and survey', 'Signed brief and target sheet, survey drawings, noise survey', 'That the brief is right'],
          ['2 · Concept', 'Two or three layouts with forecast metrics and a budget band for each', 'Which direction'],
          ['3 · Schematic design', 'Chosen layout developed: wall, floor and ceiling types, door and window schedule, ventilation concept', 'Scope and budget tier'],
          ['4 · Detailed design', 'Treatment layout with depths, ventilation routes and sizes, electrical and tie-line schematic', 'Finishes, fabric, furniture'],
          ['5 · Construction documents', 'Full drawing set, junction details, specification, schedule of finishes, bill of quantities', 'To go to tender'],
          ['6 · Tender support', 'Answers to contractors\' questions, like-for-like comparison of quotes', 'Who builds it'],
          ['7 · Construction', 'Inspections at hold points with photographic notes; responses to site queries', 'Changes, if any'],
          ['8 · Commissioning and hand-over', 'Measurement report against the target sheet, as-built drawings, a short user guide', 'Acceptance'],
        ])}
        <p>The planner turns scope into a programme, hours and an illustrative fee.</p>`, viz: 'stagePlanner' },
      { h: 'Who does what', html: `
        ${SVG_TEAM}
        <p>Acoustic failures are usually <b>coordination failures</b>: the duct that nobody told the acoustician about, the socket the electrician moved, the beam the architect added. Make responsibilities explicit.</p>
        ${table(['Role', 'Owns', 'Needs from you'], [
          ['Architect or interior designer', 'Space planning, approvals, overall look', 'Room sizes and shapes, wall thicknesses, treatment depths, early'],
          ['Structural engineer', 'What the building can carry', 'Weights of walls, floors, ceilings and doors'],
          ['HVAC engineer', 'Air quantities, plant selection, duct sizing', 'Noise criteria, maximum velocities, silencer and lining positions'],
          ['Electrician', 'Power, lighting, earthing', 'Clean technical supply, socket positions that respect isolation, quiet luminaires and drivers'],
          ['Main contractor', 'Sequence, quality, programme', 'Hold points, sample approvals, what may never be substituted'],
          ['Carpenter and fabric installer', 'Everything you see and touch', 'Module set-out, edge details, a mock-up to approve'],
          ['System integrator', 'Wiring, loudspeaker installation, calibration', 'Speaker positions, conduit routes, target responses'],
        ])}
        <div class="uc-grid">
          ${uc('🧩', 'Consultant-only', [['How', 'You design and inspect; a separate contractor builds'], ['For', 'Independent advice; competitive tender; any size of project'], ['Against', 'Depends on the builder following the drawings; more coordination']])}
          ${uc('🔨', 'Design-and-build', [['How', 'One team designs, builds and commissions'], ['For', 'One point of responsibility; details refined by the people who build them; faster'], ['Against', 'Less independent checking; the client must trust one firm with both roles']])}
        </div>
        <p>Some of the most consistent studio builders work design-and-build precisely because acoustic performance lives in the workmanship. If you work consultant-only, your hold points must do that job.</p>` },
      { h: 'Anatomy of the drawing set', html: `
        <p>A studio drawing set is small but dense. Every sheet answers a question a tradesperson will otherwise answer for themselves.</p>
        ${table(['Sheet', 'Question it answers'], [
          ['Plan', 'Where is everything, to what dimension, and what type is each wall?'],
          ['Sections (at least two)', 'How do floor, walls and ceiling meet? Where do ducts and beams pass?'],
          ['Wall, floor and ceiling type details (1:5)', 'Exactly which layers, in which order, fixed how, sealed where?'],
          ['Door and window details', 'Leaf, frame, seals, threshold, glass, the gap between frame and wall'],
          ['Treatment elevations', 'What is behind each fabric bay: depth, material, air gap; where joints fall'],
          ['Reflected ceiling plan', 'Clouds, lights, air terminals, ceiling speakers and access hatches, coordinated'],
          ['HVAC schematic', 'Air path from outside to room and back, with silencers, lining and flexible connections'],
          ['Electrical and tie-line schematic', 'Technical power, earthing, sockets, conduits, wall plates and patch points'],
          ['Schedules', 'Doors, windows, finishes, fabrics, luminaires — coded to the drawings'],
        ])}
        <p>Explore the miniature set below. Each callout is a note you will write hundreds of times.</p>`, viz: 'drawingSet' },
      { h: 'Specifications, mock-ups and samples', html: `
        <p><b>Performance specification</b> says what must be achieved: "the door set shall achieve a stated sound reduction when tested to the named standard". It leaves the method to the supplier and puts the proof on them. <b>Prescriptive specification</b> says exactly how to build it: layers, thicknesses, fixings, sealant. It puts the result on you.</p>
        <ul>
          <li>Use <b>performance</b> for manufactured items with test data: doors, windows, silencers, isolators.</li>
          <li>Use <b>prescriptive</b> for site-built constructions: walls, floors, ceilings, treatment.</li>
          <li>State <b>what may not be substituted</b> without your approval — board density, insulation type, isolator model, fabric.</li>
          <li>Define <b>workmanship</b>: sealant continuous, boards staggered, no fixings through resilient layers, insulation not compressed.</li>
        </ul>
        <div class="callout example"><b>Always ask for a mock-up.</b> One complete fabric bay — frame, infill, scrim, fabric, edge trim, a corner and a socket — built on site and approved before the rest proceeds. And one finished door, hung, sealed and closing properly. Two days of mock-up prevents two weeks of re-work, and gives the trades a physical standard to match. Fabric details are in ${L('m-fabric-install', 'Installing fabric finishes')}.</div>` },
      { h: 'Site supervision and the classic failures', html: `
        ${SVG_HOLD}
        <p>A <b>hold point</b> is a stage at which work stops until you have looked. Agree them in the contract; otherwise the programme will always win.</p>
        ${table(['Classic failure', 'How it happens', 'How to catch it'], [
          ['Bridged resilient layer', 'A screw through a hanger, mortar in the floor gap, a pipe touching both leaves', 'Inspect before closing; run a card around every floated edge'],
          ['Back-to-back sockets', 'Electrician cuts boxes opposite each other in a party wall', 'Mark socket positions on the wall before first fix; offset by a stud bay'],
          ['Unsealed perimeters', 'Boards cut tight, sealant "to follow"', 'Look for the gap and the bead at floor, ceiling and abutments'],
          ['Rigid duct connections', 'Duct screwed straight to the fan or passed solid through the wall', 'Flexible connectors and sleeved, sealed penetrations checked by hand'],
          ['Squashed or missing wool', 'Insulation stuffed tight, or left out above the door', 'Photograph every cavity before it is covered'],
          ['Substituted materials', 'Lighter board, different isolator, tighter fabric', 'Check delivery labels against the specification'],
          ['Door hung last and badly', 'Seals not adjusted, threshold uneven', 'Paper-strip test all round the closed door'],
        ])}
        <p>The full site checklist is in the ${L('m-playbook', 'Design Playbook')}; the physics of why small paths matter so much is in ${L('flanking', 'Flanking')}. Toggle defects below to see what each one costs.</p>`, viz: 'forecastVsMeasured' },
      { h: 'Commissioning and tuning', html: `
        ${flow([['Measure', 'Background noise with plant running; isolation to key neighbours; decay per band; response at the listening position and around it.'], ['Compare', 'Put each result beside the forecast range and the target sheet.'], ['Adjust', 'Speaker and seat position first, then movable treatment, then equalisation last and least.'], ['Listen', 'With the client, on their material, at their level. Agree what is heard.'], ['Hand over', 'Report, as-built drawings, settings, a one-page user guide.']])}
        <p>Measurement tells you whether the room met the forecast. <b>Listening with the client tells you whether it met the brief.</b> When the two disagree, do not argue with the client's ears — find what they are hearing and decide together whether to change it.</p>
        <div class="callout data"><b>A hand-over pack contains:</b> the target sheet with measured results beside each line; graphs with the microphone positions marked; any equaliser or processor settings; as-built drawings showing what is behind each surface; maintenance notes (filters, seals, fabric cleaning); and what was deliberately left adjustable.</div>
        <p>Return after a month or two. Rooms settle, clients learn the room, and a short follow-up visit turns a finished job into a referral.</p>` },
      { h: 'Fees, contracts and saying no', html: `
        <p>Fee structures vary widely between countries, firms and project types — treat everything here as orientation and take local professional advice before you quote.</p>
        ${table(['Structure', 'How it works', 'Suits'], [
          ['Fixed fee per stage', 'A price for each stage, paid on its deliverable', 'Most studio projects; clear for both sides'],
          ['Percentage of construction cost', 'Fee follows the build budget', 'Larger projects with architects; beware the incentive it creates'],
          ['Hourly or daily rate', 'Time recorded and billed, often with a cap', 'Surveys, troubleshooting, open-ended advice'],
          ['Design-and-build price', 'Design is bundled into the construction contract', 'Single-team delivery'],
        ])}
        <ul>
          <li><b>Payment milestones</b> tied to deliverables, with a deposit before work starts.</li>
          <li><b>Scope and exclusions</b> written out: structural design, statutory approvals, fire engineering and equipment supply are usually excluded.</li>
          <li><b>Variations:</b> how changes are requested, priced and approved.</li>
          <li><b>Performance statement:</b> forecasts are given as ranges, conditional on construction to the drawings and on agreed inspections.</li>
          <li><b>Limit of liability</b> and insurance, proportionate to the fee.</li>
          <li><b>Ownership of drawings</b> and permission to photograph and publish.</li>
        </ul>
        <div class="callout mentor"><b>Saying no is part of the service.</b> Decline — or re-scope — a job when the brief cannot be met in the building, when the budget cannot fund the isolation the client needs, when you are asked to remove inspections, or when the work is outside your competence. A clear "this will not work, but here is what would" is remembered far longer than an easy yes.</div>` },
      { h: 'Talking to clients who are not technical', html: `
        <div class="uc-grid">
          ${uc('🗣️', 'Translate numbers into experiences', [['Instead of', '"Dw of 58 dB"'], ['Say', '"Loud mixing here will be a faint murmur next door — audible at night if they listen for it, not in the day."']])}
          ${uc('🖼️', 'Show, do not tell', [['Instead of', 'A paragraph about reflections'], ['Do', 'A plan with the reflection paths drawn, a section showing the depth behind the fabric']])}
          ${uc('🎧', 'Let them hear it', [['Instead of', 'Decay-time graphs'], ['Do', 'An auralisation, or a visit to a finished room with similar targets']])}
          ${uc('📉', 'Give ranges, with reasons', [['Instead of', '"It will be 60 dB"'], ['Say', '"Between 55 and 62, depending mostly on how well the junctions are sealed — which is why I inspect them."']])}
          ${uc('🧭', 'Offer choices, not ultimatums', [['Instead of', '"You must float the floor"'], ['Say', '"Without it, drums are limited to daytime. With it, evenings too. Here is the cost of each."']])}
          ${uc('📝', 'Confirm in writing', [['Instead of', 'A friendly verbal agreement'], ['Do', 'A short note after every meeting: what was decided, what it costs, who does what next']])}
        </div>
        <div class="callout example"><b>India notes.</b> Many projects are contractor-led, with design expected "free" inside the build price — explain what independent design and inspection protect the client from. Expect material substitution; name acceptable alternatives yourself and check deliveries. Schedule wet trades and timber work around the monsoon, and allow drying time before fabric goes on. Find out early which approvals the building society or authority requires. More in ${L('m-india', 'Studio design in India')}.</div>` },
      { h: 'Two worked case studies', html: `
        <div class="callout example"><b>Case 1 — a 20 m² home production room (fictional).</b><br>
        <b>Brief:</b> a songwriter-producer in a first-floor flat, working evenings, monitors at moderate level, no drums, wants daylight and "not a cave". Moderate budget, four months.<br>
        <b>Survey:</b> concrete slab, masonry walls, one neighbour below and one beside; a noisy window air-conditioner; background noise fine at night.<br>
        <b>Targets:</b> NC 20–25; about 50 dB to the neighbour beside; decay 0.3 s ± 15 %; bass decay under twice mid.<br>
        <b>Forecast and tiers:</b> <i>Good</i> — treatment only plus a sealed solid door: mixing at moderate level in the evening. <i>Better</i> — independent lining on the shared wall and a secondary window: 48–55 dB. <i>Best</i> — a floated room: not justified for this use. The client chose <i>better</i>.<br>
        <b>Design:</b> speakers down the long axis facing the window wall, deep rear trapping behind a full-height fabric wall, a ceiling cloud, a quiet ducted unit replacing the window machine, light fabric and timber slats to keep the room bright.<br>
        <b>Hold points:</b> lining frame before boarding; door after hanging; one fabric bay as a mock-up.<br>
        <b>Commissioning:</b> 52 dB measured to the neighbour (inside the forecast), NC 22, decay 0.31 s. One bass mode still prominent — solved by moving the seat 25 cm and retuning one trap. Hand-over with a one-page guide.</div>
        <div class="callout example"><b>Case 2 — a two-room commercial studio (fictional).</b><br>
        <b>Brief:</b> a control room and a live room for bands, including drums, in a ground-floor unit with offices above. Late sessions. Generous but fixed budget, eight months.<br>
        <b>Survey:</b> the offices are empty at night but a residential block is 20 m away; the slab is thick; a shared ventilation riser passes through the unit.<br>
        <b>Targets:</b> NC 15–20 in both rooms; 65–70 dB from live room to upstairs; 60 dB between the rooms; live-room decay adjustable from 0.5 to 0.9 s.<br>
        <b>Feasibility:</b> only a room-within-a-room on a floated floor reaches the upper target. The riser must be boxed and lined. A sound lock serves both rooms.<br>
        <b>Team:</b> structural engineer checks the slab for the added load; HVAC engineer designs a low-velocity system with remote plant; the consultant draws shell, treatment and tie-lines; a contractor builds under five hold points.<br>
        <b>What went wrong:</b> at the second hold point, a plumber's pipe clip was found fixing a waste pipe to both the outer wall and the inner frame. Caught before boarding; ten minutes to fix. After boarding it would have cost several decibels and a week.<br>
        <b>Commissioning:</b> 67 dB to upstairs, 61 dB room to room, NC 17. The band's first comment was about how the drum room sounded, not how quiet it was — which is how it should be.</div>` },
    ],
    quiz: [
      { q: 'Why ask about budget range and timeline in the very first contact?', opts: ['To decide how much to charge', 'Because the brief may be impossible at that budget, and it is better to know before designing', 'It is impolite to ask later', 'So the client feels committed'], a: 1, why: 'Isolation targets have a floor cost. Knowing the investment range early lets you offer realistic tiers or redirect the project before effort is wasted.' },
      { q: 'A forecast for a partition reads "55–62 dB". Where should your design aim relative to the brief?', opts: ['So the top of the range just meets the brief', 'So the middle of the range meets the brief', 'So even the lower edge of the range meets the brief', 'It does not matter; ranges are only for show'], a: 2, why: 'Real construction tends toward the lower part of a prediction because of flanking and workmanship. Designing so the lower edge still satisfies the brief keeps you out of disputes.' },
      { q: 'Which "saving" can be bought back later without rebuilding?', opts: ['Thinner isolation walls', 'Smaller ventilation ducts', 'Simpler finishes and plainer furniture', 'Deleting the sound lock'], a: 2, why: 'Finishes and furniture can be upgraded at any time. Shell, ducts and sound locks are buried and effectively permanent.' },
      { q: 'What is a hold point?', opts: ['A pause in payments', 'A stage where work stops until the consultant has inspected, before it is covered up', 'The moment the client approves the fabric colour', 'A structural support for a floated floor'], a: 1, why: 'Acoustic defects are hidden once boards and fabric go on. Agreed hold points make inspection happen before closing.' },
      { q: 'After commissioning, the measurements meet every target but the client says the low end "feels slow". What do you do?', opts: ['Show them the graphs and explain they are mistaken', 'Add equalisation until they stop complaining', 'Find out what they are hearing — perhaps a long bass decay within tolerance — and decide together whether to adjust', 'Close the project; the targets were met'], a: 2, why: 'Measurement checks the forecast; listening checks the brief. Taste in low-frequency decay varies, and the target sheet may need refining for this client.' },
    ],
  });

  /* =====================================================================
     M41 — STUDIO FURNITURE AND WORKFLOW
     ===================================================================== */
  window.LESSONS.push({
    id: 'm-furniture', n: 'M41', track: 'master', title: 'Studio Furniture and Workflow: Desks, Racks, Sightlines and Cable Management', level: 'Core', mins: 45,
    summary: 'Furniture is part of the room\'s acoustics and of the way people work in it. How to start from workflow, get the ergonomics right, keep the desk from damaging the sound, design racks that stay cool and quiet, route cables that never hum, choose materials and joinery that do not rattle, and brief a local carpenter — with a desk and sightline tool, a rack planner, a cable-path explorer and a cut-list generator.',
    tags: ['furniture', 'desk', 'console', 'rack', 'ergonomics', 'sightline', 'cable management', 'patchbay', 'machine closet', 'joinery', 'plywood', 'carpenter', 'workflow', 'keyboard tray', 'India'],
    sections: [
      { h: 'Furniture is part of the room', html: `
        <p>In a small room the desk is the largest object between you and the loudspeakers, the racks are the largest hard surfaces near your ears, and the sofa is one of the biggest absorbers. Treating furniture as something chosen after the acoustics are "finished" throws away part of the design — or damages it.</p>
        <p>Designers who also build studio furniture begin it the same way they begin a room: with a conversation about <b>how the person actually works</b>. Not "what desk do you want?" but "what do your hands do for eight hours?"</p>
        <div class="callout mentor">Good studio furniture has three jobs: it must <b>stay out of the sound</b>, it must <b>put the right things under the hands</b>, and it must <b>make the room feel like the owner's</b>. A piece that does only the third is decoration.</div>
        ${table(['Furniture', 'Acoustic effect', 'Design response'], [
          ['Desk or console', 'Early reflection into the ears; blocks low speakers', 'Small, low, open; speakers on stands behind it'],
          ['Side racks', 'Side reflections; clutter in the reflection-free zone', 'Low, angled, below the speaker-to-ear line'],
          ['Tall rear rack', 'Large flat reflector on the rear wall', 'Off-centre, angled or recessed into treatment'],
          ['Sofa and ottomans', 'Useful broadband absorption; listeners sit in rear-wall bass build-up', 'Count it as treatment; keep heads off the wall'],
          ['Instrument walls, shelves', 'Scattering — and sympathetic ringing', 'Use as diffusion; damp strings and snares when mixing'],
          ['Hollow cabinets', 'Boxy resonance, rattles', 'Fill, brace, line and vent them'],
        ])}` },
      { h: 'Start from workflow', html: `
        ${SVG_ZONES}
        <p>Sort every object in the studio by how often it is touched. The sorting, not the catalogue, decides the furniture.</p>
        ${table(['How often', 'Examples', 'Where it lives'], [
          ['Every minute', 'Computer keyboard, pointing device, transport, main level control', 'Within forearm reach, elbows at the sides'],
          ['Every hour', 'Control surface, musical keyboard, monitor controller, favourite outboard, patchbay', 'Within arm\'s reach without leaning: desk wings and low side racks'],
          ['Every session', 'Microphone preamps, headphone system, instrument inputs', 'A step away: side rack, wall plate, pedestal'],
          ['Rarely', 'Converters, power, computers, network, set-and-forget processors', 'Rear rack or machine closet'],
        ])}
        <div class="callout example"><b>Use case: the songwriter who plays keys.</b> The musical keyboard is touched every minute, the mixer almost never. The right desk has the keys at playing height on a central tray or well, the computer keyboard above and behind, and the screen lifted just enough to clear both. A conventional mixing desk would have forced a twisted posture for hours a day.</div>
        <p>Watch the person work for half an hour before you draw. People describe the workflow they wish they had; their hands show the one they actually use.</p>` },
      { h: 'Ergonomics: the body sets the dimensions', html: `
        <p>A studio is a workplace where people sit still for a very long time. The dimensions come from the user's body, not from a standard.</p>
        ${table(['Dimension', 'Rule of thumb', 'Why'], [
          ['Seated ear height', 'About 0.70 × body height (roughly 115–128 cm)', 'Sets speaker height and the whole vertical layout'],
          ['Desk height, seated', 'At elbow height with shoulders relaxed: about 0.40 × body height (66–76 cm)', 'Raised shoulders become neck pain within weeks'],
          ['Desk height, standing', 'About 0.63 × body height (100–120 cm)', 'Sit-stand desks need the speakers to follow, or two listening heights planned'],
          ['Screen distance', 'About an arm\'s length or more; farther for larger screens', 'Reduces eye strain and head turning'],
          ['Screen top', 'At or just below eye level, tilted back slightly — and below the line to the speakers', 'Protects the neck and keeps the speakers unobstructed'],
          ['Musical keyboard height', 'White keys about 70–74 cm for most seated players', 'Wrists level, forearms roughly horizontal'],
          ['Knee space', 'At least 60 cm wide, 45 cm deep, clear of rails', 'Otherwise people sit sideways'],
          ['Reach', 'Frequent controls within 40 cm, occasional within 65 cm of the shoulder', 'Leaning out of the listening position changes what you hear'],
        ])}
        <div class="callout safety">Repetitive strain and back injury end more audio careers than hearing loss does. Wrists straight, elbows near 90°, feet supported, and a break to stand and move every half hour. Design the furniture so the comfortable posture is also the correct listening position.</div>
        <p>Set your own height below and see whether desk, screen and speakers agree with each other.</p>`, viz: 'deskErgo' },
      { h: 'Acoustic rules for desks and consoles', html: `
        ${SVG_BOUNCE}
        <p>Sound from each speaker reaches you directly and, a fraction of a millisecond later, by bouncing off the desk. The two copies cancel at some frequencies and reinforce at others — a <b>comb filter</b>, typically with its first dip somewhere between 1 and 3 kHz, right where vocals live. The details and stand designs are in ${L('m-stands-desk', 'Speaker stands and desks')}.</p>
        <ul>
          <li><b>Small and low.</b> The less flat surface between speakers and ears, the weaker the bounce. Every extra 10 cm of depth costs something.</li>
          <li><b>Open underneath and behind.</b> A desk with a solid back panel is a bass-reflecting box; open frames let sound and air through.</li>
          <li><b>Tilt, slot or perforate.</b> A raked top throws the bounce below the ears; a slatted top over absorbent scatters and soaks it.</li>
          <li><b>Absorb the knee cavity.</b> A thick absorbent panel under the top stops the footwell honking.</li>
          <li><b>Speakers off the desk.</b> On heavy decoupled stands behind it, at ear height, not on a shelf that turns the desk into a soundboard.</li>
          <li><b>Do not block.</b> Nothing — screens, racks, lamps — in the line from any driver to your ears, or in the first-reflection paths to the side walls.</li>
          <li><b>Round the edges.</b> Soft radii on the front edge are kind to forearms and reduce edge diffraction a little.</li>
        </ul>
        ${myth([['"A big console makes it a real studio."', 'A large flat console is the strongest reflector in the room. Rooms built around large desks are designed around that reflection from the start.'], ['"Monitor isolation pads fix desk problems."', 'Pads reduce vibration into the desk. They do nothing about sound bouncing off the desk top.']])}` },
      { h: 'Rack design', html: `
        ${SVG_RACK}
        <p>Rack equipment is 19 inches (482.6 mm) wide across its front panel and measured in height by the <b>rack unit</b>: 1 U = 44.45 mm. Everything else about a rack is your design.</p>
        ${table(['Decision', 'Guidance'], [
          ['Clear width between sides', '483–485 mm at the rails; check with a real unit before gluing'],
          ['Depth', 'Deepest unit plus about 10 cm for connectors and bend radius; 45–60 cm covers most audio gear'],
          ['Low side rack', '8–12 U, top tilted back 10–15° so panels face the eyes; top surface below the speaker-to-ear line'],
          ['Tall rear rack', '20 U or more for things rarely touched; keep it off the room\'s centre line or recess it'],
          ['Weight', 'Allow 3–6 kg per U on average, far more for power amplifiers; heavy units at the bottom'],
          ['Mobility', 'Heavy-duty locking castors and a service loop let a rack roll forward for re-wiring'],
          ['Access', 'Removable or open rear; a rack you cannot reach behind will never be wired tidily'],
          ['Rails', 'Steel rack strip, front and — for deep heavy units — rear'],
        ])}
        <p><b>Heat.</b> Every watt a unit draws ends up as heat in the room: 1 W ≈ 3.4 BTU per hour. A rack is a chimney — cool air must enter low, pass the hot units and leave high. Leave a vent space above anything that runs hot, never block the top, and remember that the room's air-conditioning has to remove it all.</p>
        <p><b>Noise.</b> Passive convection is silent but limited to a couple of hundred watts. Beyond that you need fans, and fans in a room with a noise criterion of 20 are a problem. Use large, slow fans with a lined exhaust path, or move the hot and noisy equipment — computers above all — to a <b>machine closet</b> with its own ventilation and a sealed cable sleeve.</p>`, viz: 'rackPlanner' },
      { h: 'Desk types, and when each suits', html: `
        <div class="uc-grid">
          ${uc('▭', 'Minimal desk', [['What', 'A small top on an open frame; screen on an arm; nothing else'], ['Suits', 'Mixing and mastering in the box; the acoustically cleanest choice'], ['Watch', 'Where does the outboard go? Plan side racks or a pedestal.']])}
          ${uc('🎹', 'Split-bay desk with keyboard well', [['What', 'Two equipment bays either side of a central space for a musical keyboard or controller'], ['Suits', 'Writers and producers who play'], ['Watch', 'Total width; keep bays low so they do not shadow the speakers.']])}
          ${uc('▤', 'Low side racks', [['What', 'Free-standing angled racks beside the chair'], ['Suits', 'Hands-on outboard users'], ['Watch', 'They sit near the side-reflection path; keep them below ear line.']])}
          ${uc('▥', 'Tall rack units', [['What', 'Full-height racks at the rear or in a closet'], ['Suits', 'Converters, power, computers, patch fields'], ['Watch', 'Rear-wall reflection; heat; fan noise.']])}
          ${uc('◫', 'Pedestal or sidecar', [['What', 'A small rolling unit for a few favourite pieces or a controller'], ['Suits', 'Flexible rooms; shared spaces'], ['Watch', 'Cable umbilical needs a planned route.']])}
          ${uc('⇅', 'Lift desk', [['What', 'Motorised height adjustment'], ['Suits', 'Long days; several users of different heights'], ['Watch', 'Speakers must not be on it; motors and frames can rattle; cables need slack for the full travel.']])}
        </div>
        <div class="callout mentor">In concept development, sketch several options freely — materials, layouts, functions — and then cut ruthlessly back to what serves the daily work. The right piece usually ends up simpler than the first sketch.</div>` },
      { h: 'Cable management', html: `
        ${SVG_CABLE}
        <p>Tidy cabling is not vanity. It is what makes a studio quiet, reliable and repairable.</p>
        <ul>
          <li><b>Separate families.</b> Mains power, analogue audio, digital and network, and speaker feeds each get their own route. Keep mains at least 30 cm from microphone-level audio, or put an earthed metal divider between them.</li>
          <li><b>Cross at right angles.</b> Where power and signal must meet, cross once, squarely, and move on.</li>
          <li><b>Service loops.</b> Leave enough slack at each end to pull a unit forward or re-terminate a connector — coiled loosely, never tightly wound.</li>
          <li><b>Label both ends</b> before pulling, with the same code that is on your tie-line schedule.</li>
          <li><b>Build the route into the furniture:</b> a hinged trough along the back of the desk, grommets where cables rise, a vertical channel in each rack side, a floor box or skirting trunk to the wall.</li>
          <li><b>Wall plates and floor boxes</b> replace cables across the floor. Place them where instruments and microphones actually stand.</li>
          <li><b>Patchbay at hand height</b> in a side rack or desk bay, with the rear reachable.</li>
          <li><b>Spare capacity:</b> 20–30 % empty space in every trunk and conduit, and a draw-wire left in.</li>
        </ul>
        <p>Room-to-room tie-lines are covered in ${L('m-connect', 'Connecting rooms')}, low-voltage practice in ${L('m-lowvolt', 'Low-voltage wiring')}, and the reasons hum appears at all in ${L('a-ground', 'Hum, buzz and grounding')}.</p>`, viz: 'cablePaths' },
      { h: 'Materials and joinery that stay silent', html: `
        ${table(['Material', 'Strengths', 'Weaknesses', 'Use for'], [
          ['Birch or hardwood plywood', 'Strong, holds screws, stable, attractive edge', 'Cost; quality varies greatly', 'Tops, rack sides, anything structural'],
          ['MDF', 'Flat, dense, well damped, takes paint', 'Weak edges, swells with moisture, heavy, dusty to cut', 'Painted panels, speaker stands filled with sand'],
          ['Solid timber', 'Beautiful, repairable', 'Moves with humidity; wide tops cup and split unless detailed for it', 'Edges, frames, small tops, trims'],
          ['Veneered board', 'The look of fine timber on a stable core', 'Thin veneer cannot be re-sanded much', 'Visible faces'],
          ['Steel frame', 'Slim, strong, open', 'Rings if not damped; needs a fabricator', 'Legs, lift frames, rack rails'],
        ])}
        <ul>
          <li><b>Finishes:</b> hard-wax oil is low-sheen, pleasant to touch and easy to repair locally; lacquer or polyurethane is tougher against spills and sweat but shows scratches and is harder to patch. Low sheen also avoids glare from screens and lights.</li>
          <li><b>Kill resonance.</b> Tap every panel. A clear note means it will sing along with some bass frequency. Brace it, laminate it to a second layer with a flexible adhesive, or line it.</li>
          <li><b>No hollow boxes.</b> Closed plinths and cabinets act as resonators. Fill them with mineral wool, vent them, or leave them open.</li>
          <li><b>No rattles.</b> Felt or cork pads wherever two parts touch without glue; threaded inserts and machine screws for anything that comes apart; captive or soft-close hardware for doors and drawers.</li>
          <li><b>Round what you touch and what sound passes.</b> A 10–20 mm radius on front edges is comfortable and slightly kinder to diffraction.</li>
        </ul>
        <div class="callout example"><b>Sweep test.</b> When the piece is installed, play a slow sine sweep from 40 to 300 Hz at working level and walk around with your hand on each surface. Anything that buzzes or hums along gets a pad, a brace or a screw before hand-over.</div>` },
      { h: 'Matching the room, and furniture as acoustic elements', html: `
        <p>Furniture should speak the same design language as the room: repeat the room's timber, its line weights and its colours, so the piece looks built-in rather than delivered. The principles are in ${L('m-design-language', 'Reading great studios')}.</p>
        <div class="uc-grid">
          ${uc('🎸', 'Guitar wall', [['Acoustic role', 'Irregular scattering surface'], ['Risk', 'Strings ring in sympathy'], ['Do', 'Place on a side or rear wall away from the first-reflection zone; damp strings with a strap when mixing']])}
          ${uc('🎹', 'Wall-mounted keyboard shelves', [['Acoustic role', 'Small reflectors that break up a flat wall'], ['Risk', 'Shelves that ring; cables dangling'], ['Do', 'Slatted timber brackets, a cable slot behind, a wall plate beside']])}
          ${uc('🔊', 'Amplifier alcove', [['Acoustic role', 'A recess lined with absorption keeps loud cabinets out of the room\'s reverberant field'], ['Risk', 'Heat build-up'], ['Do', 'Vent it; add a tie-line and power inside']])}
          ${uc('🛋️', 'Sofa', [['Acoustic role', 'A real broadband absorber'], ['Risk', 'Against the rear wall, listeners hear exaggerated bass'], ['Do', 'Pull it 30–60 cm forward or put deep trapping behind it; tell clients the bass is truer at the desk']])}
          ${uc('⬛', 'Ottoman and low tables', [['Acoustic role', 'Soft ones absorb; hard low tables add a floor-level reflection'], ['Risk', 'A glass table between speakers and sofa'], ['Do', 'Upholstered or timber with a rug beneath']])}
          ${uc('📚', 'Shelves of books and records', [['Acoustic role', 'Useful irregular diffusion and some absorption'], ['Risk', 'Half-empty shelves resonate'], ['Do', 'Fill them unevenly; back them with absorbent']])}
        </div>
        <p><b>Sightlines.</b> From the working position you should see the screen, the person on the sofa and — through glass, if there is a live room — the performer, without standing. Draw eye-level lines in plan and section before fixing rack heights. <b>Lighting:</b> a dimmable, flicker-free task light on the work surface that does not reflect in the screen, and no noisy drivers or transformers within the furniture.</p>` },
      { h: 'Building with a local carpenter in India', html: `
        <p>Excellent custom furniture is very achievable with a good local carpenter — provided the brief is drawn, not described.</p>
        ${flow([['Draw it', 'Plan, front, side and a section at 1:10, with every dimension to finished faces.'], ['Mark the criticals', 'Clear rack width, desk height, knee clearance, tray travel: write the tolerance (±1 mm for rack width).'], ['Bring a real unit', 'A physical piece of rack gear and the rack strip on day one.'], ['Approve a sample', 'One joint, one edge, one finished offcut before the whole piece.'], ['Dry-fit', 'Assemble without glue, check with equipment, then glue and finish.'], ['Test on site', 'Sweep test for rattles; cable routes proved with real cables.']])}
        ${table(['Item', 'Notes for Indian conditions', 'Rough cost range'], [
          ['Plywood', 'Ask for boiling-water-proof (marine) grade from a reputable mill for anything structural; check thickness with a calliper — nominal 18 mm is often less', '₹3,800–6,500 per 8×4 ft sheet (18 mm)'],
          ['MDF or HDF', 'Use moisture-resistant grades; seal all edges', '₹2,200–3,600 per sheet (18 mm)'],
          ['Veneer or laminate', 'Veneer with a matt polyurethane or hard-wax finish looks best; matt laminate is tougher', 'varies widely'],
          ['Rack strip', 'Steel rack rail from pro-audio or electrical-panel suppliers; buy cage nuts and screws at the same time', '₹150–500 per U pair'],
          ['Hardware', 'Full-extension slides for trays, heavy locking castors, threaded inserts, cable grommets, felt tape', '₹1,500–8,000 per piece of furniture'],
          ['Labour and finishing', 'Agree whether polishing is included; allow curing time before loading', 'by quotation'],
        ])}
        <p class="small muted">Costs are rough, illustrative ranges that vary by city, year and quality. Collect local quotations.</p>
        <div class="callout warn"><b>Humidity.</b> Timber and board move with the monsoon. Let material acclimatise in the room for a week, seal every face and edge equally (an unsealed underside makes a top cup), avoid wide solid-timber tops glued rigidly to frames, and choose rust-resistant hardware. Check for termite treatment where that is a local risk.</div>` },
      { h: 'Build it yourself: a minimal desk and side rack', html: `
        <p>The simplest good studio desk is a stiff top on two supports with an open back. If the supports are rack bays, you have built your side racks into it. The logic of the cutting list is always the same:</p>
        <ol>
          <li><b>Top:</b> width × depth. Depth as small as your screen distance allows — 70–80 cm suits most.</li>
          <li><b>Supports:</b> height = desk height − top thickness; depth a few centimetres less than the top so the front edge overhangs.</li>
          <li><b>Rack bays:</b> two sides per bay with 483–485 mm clear between them, plus a floor panel and a rear rail to hold them square.</li>
          <li><b>Stiffening:</b> a rear stretcher and a front rail under the top. Any unsupported span over about 120 cm in 18 mm board needs doubling or a deeper rail.</li>
          <li><b>Tray:</b> a keyboard tray on full-extension slides, with knee clearance checked.</li>
          <li><b>Nest</b> the parts on standard sheets before buying, allowing for saw cuts and grain direction.</li>
        </ol>
        <p>Set your sizes below for a cutting list, sheet layout, weight and rough cost.</p>`, viz: 'deskCutList' },
      { h: 'Mistakes to avoid', html: `
        ${myth([
          ['Buying the desk first and fitting the room around it.', 'Decide speaker and ear positions first; the desk is what fits between them.'],
          ['Speakers on the desk bridge.', 'The desk becomes a resonant soundboard and the speakers end up too close and too low. Use stands.'],
          ['A deep, wide, glossy top.', 'A strong comb-filter bounce and screen glare. Go smaller, matt, raked or slatted.'],
          ['Racks stuffed solid with no vents.', 'Heat shortens equipment life and forces noisy fans. Leave air paths.'],
          ['The computer under the desk.', 'It sets the room\'s noise floor and warms your knees. Move it to a closet or use a silent machine.'],
          ['No access behind.', 'The first re-wire becomes a demolition. Castors, removable backs, service loops.'],
          ['Power strips and audio looms in one bundle.', 'Hum, buzz and an unserviceable tangle. Separate routes from day one.'],
          ['Hollow plinths and thin doors.', 'They boom and rattle on certain notes. Fill, brace and pad.'],
          ['Designing for the owner\'s height only in a shared room.', 'Adjustable chair, footrest, and a screen arm at minimum; a lift desk if several people work long days.'],
        ])}
        <div class="callout mentor"><b>Apply it.</b> Photograph your current workspace from the side with you seated in it. Draw the line from each speaker to your ear, and the bounce off the desk. Mark what your hands touch each minute, hour and session. The redesign usually draws itself.</div>` },
    ],
    quiz: [
      { q: 'What should decide where each piece of equipment lives in a studio?', opts: ['Its price', 'How often it is touched', 'Its colour', 'Its weight alone'], a: 1, why: 'Sorting by frequency of use puts every-minute controls under the hands and rarely-touched units in rear racks or a closet — the basis of both ergonomics and a clean acoustic layout.' },
      { q: 'Why does a large flat desk colour what you hear from the monitors?', opts: ['It absorbs treble', 'A delayed reflection from its surface combines with the direct sound and cancels certain frequencies', 'It blocks bass', 'It vibrates the floor'], a: 1, why: 'The desk bounce arrives a fraction of a millisecond late, producing a comb filter whose first dip often falls in the 1–3 kHz region.' },
      { q: 'A closed rack holds 450 W of equipment in a room with a strict noise criterion. What is the best solution?', opts: ['Add small high-speed fans to the rack', 'Seal the rack to keep the noise in', 'Move the hot, noisy units to a ventilated machine closet, or use large slow fans with a lined exhaust path', 'Ignore it; heat is not an acoustic matter'], a: 2, why: 'That much heat needs forced air, and small fast fans are loud. Remote location or large slow fans with a treated air path keep both temperature and noise under control.' },
      { q: 'Mains and microphone cables must cross under the desk. How?', opts: ['Run them together for a metre to keep it tidy', 'Cross once at a right angle, keeping them separated elsewhere', 'Twist them around each other', 'It makes no difference'], a: 1, why: 'Coupling between cables is strongest when they run parallel and close. A single square crossing minimises it.' },
      { q: 'You tap a new desk side panel and it gives a clear musical note. What does that tell you?', opts: ['The panel is good quality', 'It will resonate at that frequency and needs bracing, damping or filling', 'It needs more lacquer', 'Nothing useful'], a: 1, why: 'A ringing panel stores and re-radiates energy at its resonance. Bracing, constrained-layer damping or lining stops furniture adding its own sound.' },
    ],
  });
})();
