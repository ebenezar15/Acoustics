/* ==========================================================================
   Recording, Mixing & Mastering track — R6–R10: building a mix (balance,
   EQ, dynamics, space) and monitoring, loudness and mastering.
   Original text; simplified, practical, tool-driven.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|do|approach|move/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const tbl = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const SAFE = `<div class="callout safety">Protect your hearing: mix at a moderate level (around 79–85 dB SPL C-weighted at the seat for short checks, lower for long sessions), take a 10-minute break every hour, and never judge a mix with tired ears. Loud always sounds “better” — until the next morning.</div>`;

  /* ------------------------------- SVGs ------------------------------- */
  const SVG_BOX = `<svg class="gsvg" viewBox="0 0 680 250" role="img" aria-label="The mix as a box with height, width and depth">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A mix is a box you fill: tall, wide and deep</text>
    <rect x="150" y="40" width="380" height="170" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <path d="M150 40 l40 -14 h380 l-40 14 M530 40 l40 -14 v170 l-40 14" fill="none" stroke="var(--muted)"/>
    <text x="120" y="60" text-anchor="end" font-size="10">highs</text><text x="120" y="130" text-anchor="end" font-size="10">mids</text><text x="120" y="204" text-anchor="end" font-size="10">lows</text>
    <text x="160" y="228" font-size="10">left</text><text x="340" y="228" text-anchor="middle" font-size="10">centre</text><text x="520" y="228" text-anchor="end" font-size="10">right</text>
    <text x="604" y="60" font-size="10" fill="var(--muted)">far</text><text x="562" y="218" font-size="10" fill="var(--muted)">near</text>
    <ellipse cx="340" cy="190" rx="60" ry="14" fill="var(--c3)" opacity=".75"/><text x="340" y="194" text-anchor="middle" font-size="10" fill="#fff">kick · bass</text>
    <ellipse class="hot" cx="340" cy="120" rx="46" ry="16" fill="var(--accent)" opacity=".85"/><text x="340" y="124" text-anchor="middle" font-size="10" fill="#fff">lead vocal</text>
    <ellipse cx="210" cy="130" rx="40" ry="14" fill="var(--accent2)" opacity=".7"/><text x="210" y="134" text-anchor="middle" font-size="10" fill="#fff">guitar L</text>
    <ellipse cx="470" cy="130" rx="40" ry="14" fill="var(--accent2)" opacity=".7"/><text x="470" y="134" text-anchor="middle" font-size="10" fill="#fff">keys R</text>
    <ellipse cx="340" cy="150" rx="34" ry="10" fill="var(--warn)" opacity=".8"/><text x="340" y="154" text-anchor="middle" font-size="9" fill="#fff">snare</text>
    <ellipse cx="250" cy="66" rx="52" ry="10" fill="var(--c4)" opacity=".6"/><ellipse cx="430" cy="66" rx="52" ry="10" fill="var(--c4)" opacity=".6"/><text x="340" y="70" text-anchor="middle" font-size="10">cymbals · air</text>
    <text x="340" y="246" text-anchor="middle" font-size="10" fill="var(--muted)">Height = frequency · width = panning · depth = level, brightness and reverb</text>
  </svg>`;
  const SVG_ARR = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="Arrangement roles through a song">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Arrangement roles: no more than a few things should speak at once</text>
    ${[['Foundation (drums + bass)', 'c3', [[0, 100]]], ['Pad (sustained chords)', 'c4', [[12, 30], [50, 100]]], ['Rhythm (strums, percussion)', 'accent2', [[25, 50], [62, 100]]], ['Lead (vocal or solo)', 'accent', [[12, 46], [50, 74], [80, 100]]], ['Fills (answers in the gaps)', 'warn', [[46, 50], [74, 80]]]].map(([n, c, segs], i) => `<text x="196" y="${48 + i * 28}" text-anchor="end" font-size="10">${n}</text>${segs.map(([a, b]) => `<rect x="${206 + a * 4.5}" y="${36 + i * 28}" width="${(b - a) * 4.5}" height="16" rx="3" fill="var(--${c})" opacity=".8"/>`).join('')}`).join('')}
    <text x="206" y="184" font-size="10" fill="var(--muted)">intro</text><text x="290" y="184" font-size="10" fill="var(--muted)">verse</text><text x="440" y="184" font-size="10" fill="var(--muted)">chorus</text><text x="570" y="184" font-size="10" fill="var(--muted)">verse / out</text>
  </svg>`;
  const SVG_MASK = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Masking and complementary EQ">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Masking: two sounds in one range hide each other — carve a slot for each</text>
    ${[[30, 'Before', false], [360, 'After complementary EQ', true]].map(([x, t, fx]) => `<g><text x="${x + 145}" y="38" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <rect x="${x}" y="46" width="290" height="120" fill="var(--panel2)" stroke="var(--line)"/>
      <path d="M${x + 10} 160 C ${x + 50} ${fx ? 70 : 60}, ${x + 90} ${fx ? 80 : 60}, ${x + 130} ${fx ? 140 : 110} S ${x + 220} 158, ${x + 280} 160" fill="var(--c3)" opacity=".55" stroke="var(--c3)"/>
      <path d="M${x + 10} 160 C ${x + 60} ${fx ? 150 : 110}, ${x + 100} ${fx ? 120 : 70}, ${x + 150} ${fx ? 66 : 64} S ${x + 240} 150, ${x + 280} 160" fill="var(--accent)" opacity=".5" stroke="var(--accent)"/>
      ${fx ? '' : `<ellipse class="hot" cx="${x + 100}" cy="92" rx="34" ry="22" fill="none" stroke="var(--bad)" stroke-width="2.5"/>`}
      <text x="${x + 56}" y="182" font-size="10">bass</text><text x="${x + 160}" y="182" font-size="10">guitar</text></g>`).join('')}
    <text x="340" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">Cut the guitar where the bass lives; cut the bass where the guitar speaks. Both sound clearer at lower faders.</text>
  </svg>`;
  const SVG_FILT = `<svg class="gsvg" viewBox="0 0 680 170" role="img" aria-label="Filter shapes">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The five EQ shapes</text>
    ${[['High-pass', 'M0 80 C 30 80, 40 30, 60 30 H120'], ['Low shelf', 'M0 50 H30 C 55 50, 55 30, 80 30 H120'], ['Bell (wide)', 'M0 40 C 40 40, 40 10, 60 10 S 80 40, 120 40'], ['Bell (narrow cut)', 'M0 30 H48 C 56 30, 56 76, 60 76 S 64 30, 72 30 H120'], ['Low-pass', 'M0 30 H60 C 80 30, 90 80, 120 80']].map(([n, d], i) => `<g transform="translate(${18 + i * 132} 40)"><rect width="120" height="90" fill="var(--panel2)" stroke="var(--line)"/><line x1="0" y1="30" x2="120" y2="30" stroke="var(--muted)" stroke-dasharray="3 3"/><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="3"/><text x="60" y="108" text-anchor="middle" font-size="11" font-weight="700">${n}</text></g>`).join('')}
  </svg>`;
  const SVG_COMP = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Compressor controls">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">What the controls do</text>
    <g><rect x="30" y="36" width="250" height="160" fill="var(--panel2)" stroke="var(--line)"/>
      <line x1="30" y1="196" x2="280" y2="36" stroke="var(--muted)" stroke-dasharray="4 4"/>
      <path d="M30 196 L160 113 L280 84" fill="none" stroke="var(--accent)" stroke-width="3"/>
      <line x1="160" y1="36" x2="160" y2="196" stroke="var(--bad)" stroke-dasharray="3 3"/><text x="164" y="50" font-size="10" fill="var(--bad)">threshold</text>
      <text x="230" y="76" font-size="10" fill="var(--accent)">ratio 4:1</text><text x="208" y="118" font-size="10" fill="var(--muted)">1:1 (off)</text>
      <text x="155" y="212" text-anchor="middle" font-size="10">input level →</text><text x="22" y="120" font-size="10" transform="rotate(-90 22 120)" text-anchor="middle">output →</text></g>
    <g><rect x="330" y="36" width="320" height="160" fill="var(--panel2)" stroke="var(--line)"/>
      <path d="M340 180 V70 L350 60 C 380 64, 400 108, 440 112 H520 C 560 112, 580 150, 640 170" fill="none" stroke="var(--text)" stroke-width="1.5" opacity=".5"/>
      <path class="leak-pulse" d="M340 180 V70 L350 60 C 362 80, 372 122, 392 126 H520 C 540 126, 560 150, 640 170" fill="none" stroke="var(--accent)" stroke-width="3"/>
      <line x1="350" y1="40" x2="350" y2="190" stroke="var(--good)" stroke-dasharray="3 3"/><line x1="392" y1="40" x2="392" y2="190" stroke="var(--good)" stroke-dasharray="3 3"/>
      <text x="371" y="52" text-anchor="middle" font-size="10" fill="var(--good)">attack</text>
      <line x1="520" y1="40" x2="520" y2="190" stroke="var(--warn)" stroke-dasharray="3 3"/><text x="560" y="52" text-anchor="middle" font-size="10" fill="var(--warn)">release</text>
      <text x="490" y="212" text-anchor="middle" font-size="10">time → (one loud note)</text></g>
  </svg>`;
  const SVG_PAR = `<svg class="gsvg" viewBox="0 0 680 170" role="img" aria-label="Parallel compression and sidechain routing">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Two routings worth knowing</text>
    <g><text x="165" y="40" text-anchor="middle" font-size="11" font-weight="700">Parallel compression</text>
      <rect x="20" y="78" width="60" height="30" rx="5" fill="var(--panel2)" stroke="var(--text)"/><text x="50" y="97" text-anchor="middle" font-size="10">drums</text>
      <path d="M80 93 H250" stroke="var(--accent)" stroke-width="2.5"/><text x="165" y="86" text-anchor="middle" font-size="10">dry (punch)</text>
      <path d="M90 93 V132 H120 M190 132 H240 V93" stroke="var(--c3)" stroke-width="2.5" fill="none"/><rect x="120" y="118" width="70" height="28" rx="5" fill="var(--c3)" opacity=".8"/><text x="155" y="136" text-anchor="middle" font-size="10" fill="#fff">crushed</text>
      <rect x="250" y="78" width="60" height="30" rx="5" fill="var(--panel2)" stroke="var(--text)"/><text x="280" y="97" text-anchor="middle" font-size="10">sum</text></g>
    <g><text x="510" y="40" text-anchor="middle" font-size="11" font-weight="700">Sidechain ducking</text>
      <rect x="360" y="60" width="60" height="28" rx="5" fill="var(--panel2)" stroke="var(--text)"/><text x="390" y="78" text-anchor="middle" font-size="10">bass</text>
      <rect x="470" y="60" width="86" height="28" rx="5" fill="var(--c3)" opacity=".8"/><text x="513" y="78" text-anchor="middle" font-size="10" fill="#fff">compressor</text>
      <path d="M420 74 H470 M556 74 H640" stroke="var(--accent)" stroke-width="2.5"/>
      <rect x="360" y="120" width="60" height="28" rx="5" fill="var(--panel2)" stroke="var(--text)"/><text x="390" y="138" text-anchor="middle" font-size="10">kick</text>
      <path class="leak-pulse" d="M420 134 H513 V88" stroke="var(--warn)" stroke-width="2.5" fill="none" stroke-dasharray="5 4"/><text x="560" y="132" font-size="10" fill="var(--warn)">key input: the kick</text><text x="560" y="146" font-size="10" fill="var(--muted)">tells the bass to dip</text></g>
  </svg>`;
  const SVG_REV = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Anatomy of a reverb">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Anatomy of a reverb: direct sound, pre-delay, early reflections, tail</text>
    <line x1="40" y1="160" x2="650" y2="160" stroke="var(--text)"/>
    <rect x="60" y="40" width="6" height="120" fill="var(--accent)"/><text x="64" y="34" text-anchor="middle" font-size="10">direct</text>
    <path d="M70 172 H150" stroke="var(--good)" stroke-width="2"/><text x="110" y="188" text-anchor="middle" font-size="10" fill="var(--good)">pre-delay</text>
    ${[150, 168, 180, 197, 210, 228].map((x, i) => `<rect class="${i % 2 ? 'leak-pulse' : ''}" x="${x}" y="${84 + i * 6}" width="4" height="${76 - i * 6}" fill="var(--warn)"/>`).join('')}<text x="190" y="74" text-anchor="middle" font-size="10" fill="var(--warn)">early reflections</text>
    <path d="M240 160 L240 112 C 320 122, 440 148, 640 159 L640 160z" fill="var(--c3)" opacity=".55"/><text x="420" y="124" text-anchor="middle" font-size="10" fill="var(--c3)">reverb tail (decay time)</text>
    <text x="650" y="176" text-anchor="end" font-size="10" fill="var(--muted)">time →</text>
  </svg>`;
  const SVG_SEND = `<svg class="gsvg" viewBox="0 0 680 150" role="img" aria-label="Send and return routing">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Sends and returns: one reverb, many tracks</text>
    ${['vocal', 'guitar', 'snare'].map((n, i) => `<rect x="30" y="${34 + i * 34}" width="80" height="24" rx="5" fill="var(--panel2)" stroke="var(--text)"/><text x="70" y="${50 + i * 34}" text-anchor="middle" font-size="10">${n}</text><path d="M110 ${46 + i * 34} H520" stroke="var(--accent)" stroke-width="2"/><path class="leak-pulse" d="M${150 + i * 26} ${46 + i * 34} V132 H260" stroke="var(--c3)" stroke-width="1.6" fill="none" stroke-dasharray="4 4"/>`).join('')}
    <rect x="260" y="118" width="90" height="26" rx="5" fill="var(--c3)" opacity=".85"/><text x="305" y="135" text-anchor="middle" font-size="10" fill="#fff">reverb 100 % wet</text>
    <rect x="370" y="118" width="80" height="26" rx="5" fill="var(--panel2)" stroke="var(--c3)"/><text x="410" y="135" text-anchor="middle" font-size="10">EQ on return</text>
    <path d="M350 131 H370 M450 131 H520" stroke="var(--c3)" stroke-width="2"/>
    <rect x="520" y="34" width="120" height="110" rx="6" fill="var(--panel2)" stroke="var(--text)"/><text x="580" y="92" text-anchor="middle" font-size="11" font-weight="700">mix bus</text>
  </svg>`;
  const SVG_METER = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Peak, loudness and crest factor">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Peak, loudness and the gap between them</text>
    <rect x="40" y="30" width="600" height="150" fill="var(--panel2)" stroke="var(--line)"/>
    ${Array.from({ length: 100 }, (_, i) => { const hit = i % 12 === 0 ? 120 : i % 12 === 6 ? 96 : 0, body = 34 + 14 * Math.sin(i / 5) + (i * 37 % 11); const hh = Math.max(hit, body); return `<rect x="${44 + i * 5.9}" y="${178 - hh}" width="3.6" height="${hh}" fill="var(--accent)" opacity=".7"/>`; }).join('')}
    <line x1="40" y1="58" x2="640" y2="58" stroke="var(--bad)" stroke-dasharray="5 4"/><text x="634" y="52" text-anchor="end" font-size="10" fill="var(--bad)">true peak (ceiling ≈ −1 dBTP)</text>
    <line x1="40" y1="132" x2="640" y2="132" stroke="var(--good)" stroke-width="2"/><text x="634" y="126" text-anchor="end" font-size="10" fill="var(--good)">integrated loudness (LUFS)</text>
    <path d="M70 60 V130" stroke="var(--text)" stroke-width="1.5"/><path d="M66 66 L70 60 L74 66 M66 124 L70 130 L74 124" fill="none" stroke="var(--text)"/><text x="78" y="100" font-size="10" font-weight="700">peak-to-loudness = punch</text>
    <text x="340" y="200" text-anchor="middle" font-size="10" fill="var(--muted)">Limiting raises the loudness line toward the peak line. Normalisation then moves both down together.</text>
  </svg>`;
  const SVG_CHAIN = `<svg class="gsvg" viewBox="0 0 680 120" role="img" aria-label="A typical mastering chain">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">A typical mastering chain (use only the stages the music needs)</text>
    ${['Listen & compare', 'Corrective EQ', 'Gentle compression', 'Tone / stereo (M-S)', 'Limiter + true-peak', 'Dither & export'].map((n, i) => `<rect x="${12 + i * 111}" y="40" width="100" height="44" rx="6" fill="var(--panel2)" stroke="var(--${i === 4 ? 'bad' : 'text'})"/><text x="${62 + i * 111}" y="66" text-anchor="middle" font-size="10" font-weight="700">${n}</text>${i < 5 ? `<path class="leak-pulse" d="M${112 + i * 111} 62 h11" stroke="var(--accent)" stroke-width="2.5"/>` : ''}`).join('')}
    <text x="340" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">Changes are small: usually 0.5–2 dB of EQ, 1–2 dB of compression, a few dB of limiting.</text>
  </svg>`;

  /* ============================== R6 ============================== */
  const R6 = {
    id: 'r-mix-balance', n: 'R6', track: 'recording', title: 'Building a Mix I: Balance, Panning and Arrangement', level: 'Core', mins: 45,
    summary: 'What a mix is for, how to prepare a session, and how to get most of the way there with nothing but faders, pan pots and a clear idea of which part matters most.',
    tags: ['mixing', 'balance', 'panning', 'arrangement', 'gain staging', 'mono', 'automation', 'buses', 'reference tracks'],
    sections: [
      { h: 'What a mix is for', html: `
        <p class="lead">A mix has one job: make the listener feel the song. Technically that means every part can be heard for what it contributes, the most important thing is always obvious, and the result works on any playback system.</p>
        ${flow([['Prepare', 'organise, clean, gain-stage'], ['Balance', 'faders and pans only'], ['Fit', 'EQ so parts stop fighting'], ['Control', 'dynamics where levels wander'], ['Place', 'depth with reverb and delay'], ['Move', 'automation and interest'], ['Check', 'mono, references, other speakers']])}
        ${SVG_BOX}
        <p>Think of the six things you can change: <b>level</b>, <b>left–right position</b>, <b>frequency content</b>, <b>depth</b>, <b>dynamics</b> and <b>movement over time</b>. This lesson covers the first two — which do more than all the plug-ins that follow.</p>` },
      { h: 'Prepare the session before you mix', html: `
        ${tbl(['Step', 'What to do', 'Why'], [
          ['Organise', 'Name and colour tracks; order them the same way every time (drums, bass, guitars, keys, vocals, effects)', 'You find things without thinking'],
          ['Group', 'Route related tracks to subgroups: drums, guitars, backing vocals', 'One fader per section; shared processing'],
          ['Clean', 'Trim silence, add short fades at every edit, remove clicks and count-ins', 'Noise adds up across 40 tracks'],
          ['Gain-stage', 'Set clip gain so tracks average around −18 dBFS with peaks well below 0', 'Plug-ins and the mix bus keep headroom'],
          ['Phase check', 'On multi-miked sources flip polarity and nudge timing; keep whichever gives the fuller low end', 'Fixes thin drums before any EQ'],
          ['Listen through', 'Play the rough mix top to bottom and write down what the song is about', 'Decides what leads'],
        ])}
        <div class="callout mentor">Leave the mix-bus meter peaking around −6 dBFS while you work. Level on the master is free to add later; clipped plug-ins are not free to undo.</div>` },
      { h: 'Arrangement comes first', html: `
        ${SVG_ARR}
        <p>Most “mix problems” are arrangement problems. Parts fall into roles: a <b>foundation</b> (drums and bass), a <b>pad</b> (sustained harmony), a <b>rhythm</b> part, a <b>lead</b>, and <b>fills</b> that answer the lead. Trouble starts when two parts play the same role in the same range at the same time.</p>
        <ul><li>Two guitars strumming the same chords in the same octave → pan them apart, or mute one in the verse.</li>
        <li>Fills that play over the vocal → move, mute or duck them.</li>
        <li>A piano and a pad both filling 200–500 Hz → thin one out.</li></ul>
        <div class="callout data"><b>Rule of thumb:</b> the ear follows about three or four things at once. The mute button is a mixing tool.</div>` },
      { h: 'Build the balance — try it', html: `
        <p>Play the loop, press “Raw”, then build a balance with faders and pans only. Use the high-pass and tone controls last. Compare with the suggested starting point and check in mono.</p>`, viz: 'miniMixer' },
      { h: 'Where to start, and how to move the faders', html: `
        <div class="uc-grid">
          ${uc('🥁', 'Foundation first', [['How', 'Kick and bass, then snare and the rest of the kit, then harmony, then the lead on top'], ['Suits', 'Rock, pop, dance — music driven by the groove'], ['Watch', 'Leaving no room for the vocal: bring it in early to check']])}
          ${uc('🎤', 'Lead first', [['How', 'Set the vocal (or solo instrument) at a comfortable level, then fit everything around it'], ['Suits', 'Songs, ballads, podcasts, dialogue'], ['Watch', 'A thin rhythm section: push the foundation up until it supports']], '#7a5cc7')}
          ${uc('🎚️', 'All faders up', [['How', 'Push everything up roughly, then adjust while the whole thing plays'], ['Suits', 'Live recordings, jazz, classical'], ['Watch', 'Getting lost: mute down to the core and rebuild if it turns to soup']], '#2b9fc7')}
        </div>
        <ul><li><b>Faders before plug-ins.</b> If a part cannot be placed with level and pan, then reach for EQ.</li>
        <li><b>Small moves.</b> 1 dB is audible on a lead; 3 dB is a clear change; 6 dB is a different mix.</li>
        <li><b>Mix quietly</b> for balance decisions: at low level only the loudest things are heard, so the hierarchy is obvious.</li></ul>` },
      { h: 'Panning: width with a purpose', html: `
        ${tbl(['Position', 'Usually lives here', 'Why'], [
          ['Centre', 'Kick, snare, bass, lead vocal', 'Both speakers share the load; survives mono and one-sided listening'],
          ['Half left / right', 'Toms, keys, supporting guitars, harmony vocals', 'Space around the centre without holes'],
          ['Hard left / right', 'Doubled rhythm guitars, stereo overheads, wide pads, effects returns', 'Maximum width; the pair must be balanced in level and tone'],
        ])}
        <p><b>LCR mixing</b> uses only three positions — hard left, centre, hard right. It forces clear decisions and gives a wide, uncluttered picture. Whatever the approach, keep the <b>low end in the centre</b>: bass below about 100–120 Hz carries no useful direction and two speakers reproduce it more cleanly than one.</p>
        <div class="callout warn">A “stereo” part that is just the same signal on both sides is mono. Width comes from <i>differences</i> between left and right — two performances, two microphones, or different processing.</div>` },
      { h: 'Mono, references and automation', html: `
        <ul><li><b>Mono check:</b> press mono regularly. Parts that vanish are out of phase; a balance that works in mono works everywhere.</li>
        <li><b>References:</b> load two or three commercial mixes in a similar style, match their loudness to yours, and compare low end, vocal level and brightness. See <a href="#/academy/flat">Flat Response</a> for why your room matters here.</li>
        <li><b>Automation:</b> a static balance is right for only part of the song. Ride the vocal word by word, lift the guitars 1–2 dB in the chorus, pull the pad down under the verse.</li>
        <li><b>Buses:</b> balance within a group (the drum kit), then balance groups against each other.</li></ul>
        ${SAFE}` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎸', 'Four-piece rock band', [['Problem', 'Wall of guitars buries the vocal'], ['Approach', 'Guitars hard left/right, vocal centre and 2 dB up, guitars automated down in verses']])}
          ${uc('🎙️', 'Podcast with two voices and music', [['Problem', 'Music bed fights the speech'], ['Approach', 'Voices centre and loud; music 15–20 dB below speech, lifted only in the gaps']], '#7a5cc7')}
          ${uc('🎹', 'Electronic track', [['Problem', 'Kick and sub-bass smear'], ['Approach', 'Both mono and centre; choose which owns 50 Hz; duck the bass from the kick']], '#c7772b')}
          ${uc('🎻', 'Live acoustic recording', [['Problem', 'Leakage in every microphone'], ['Approach', 'All faders up; pan as on stage; balance with small moves; no solo decisions']], '#2b9fc7')}
          ${uc('🎬', 'Film dialogue scene', [['Problem', 'Words lost under effects and music'], ['Approach', 'Dialogue is the lead: centre, constant level; everything else is automated around it']], '#4c9a3a')}
          ${uc('🎶', 'Singer-songwriter', [['Problem', 'Sounds small'], ['Approach', 'Voice centre, two guitar mics panned moderately apart, a little room — nothing else needed']], '#d14b8f')}
        </div>` },
      { h: 'Problems, mistakes and a checklist', html: `
        ${tbl(['Problem', 'Likely cause', 'First thing to try'], [
          ['Vocal buried', 'Too many parts in the centre and in the 1–4 kHz range', 'Vocal up 2 dB; pan or lower the competitors'],
          ['Muddy low end', 'Several tracks with energy below 250 Hz', 'Decide who owns the bass; high-pass the rest (next lesson)'],
          ['Sounds small', 'Everything centred, nothing in front', 'Pan pairs wide; make one thing clearly loudest'],
          ['Falls apart in mono', 'Wide parts out of phase', 'Flip polarity, narrow the offending pair, or re-record a double'],
          ['Chorus has no lift', 'Static balance', 'Automate: hold something back in the verse so the chorus can grow'],
          ['Mix peaks into the red', 'Faders creeping up', 'Select all faders, pull down 6 dB, turn the monitors up'],
        ])}
        ${myth([
          ['“I’ll fix it in the mix.”', 'A good arrangement and recording mixes itself. Fix it at the source whenever you can.'],
          ['“More plug-ins make a more professional mix.”', 'Balance and pan do most of the work; every extra process is a chance to make it worse.'],
          ['“Solo the track to get it right.”', 'Nobody hears it solo. Judge every change with everything playing.'],
          ['“Loud monitoring helps me hear detail.”', 'It hides balance errors and tires your ears. Mix mostly quiet.'],
        ])}
        ${flow([['Prepare', 'organise, clean, −18 dBFS average'], ['Decide the lead', 'what is the song about?'], ['Rough balance', 'faders only, 10 minutes'], ['Pan', 'centre the core, widen the support'], ['Mono check', 'fix what disappears'], ['Reference', 'at matched loudness'], ['Automate', 'section by section']])}
        <p>Next: <a href="#/academy/r-mix-eq">EQ, masking and the frequency map</a>. Related: <a href="#/academy/a-flow">Signal Flow &amp; the Mixing Console</a> · <a href="#/academy/m-control">Control Rooms</a>.</p>` },
    ],
    quiz: [
      { q: 'What should you reach for first when a part will not sit in the mix?', opts: ['A compressor', 'The fader and pan', 'A reverb', 'A limiter'], a: 1, why: 'Level and position solve most placement problems before any processing.' },
      { q: 'Why keep kick and bass in the centre?', opts: ['Tradition only', 'Both speakers share the low end and it survives mono', 'It makes them louder on the meter', 'To avoid EQ'], a: 1, why: 'Low frequencies carry little direction and are reproduced more cleanly by both speakers.' },
      { q: 'A doubled guitar disappears when you press mono. Why?', opts: ['It is too quiet', 'The two sides are out of phase with each other', 'Mono removes guitars', 'The pan law'], a: 1, why: 'Out-of-phase content cancels when left and right are summed.' },
      { q: 'A sensible average level for tracks in a 24-bit session is about…', opts: ['0 dBFS', '−3 dBFS', '−18 dBFS', '−60 dBFS'], a: 2, why: 'It leaves headroom for peaks, plug-ins and the mix bus.' },
      { q: 'Why make balance decisions at low monitoring level?', opts: ['To save electricity', 'Only the loudest elements remain audible, exposing the hierarchy', 'Bass is louder when quiet', 'It widens the stereo image'], a: 1, why: 'Quiet listening reveals what is too loud or too soft, and protects your ears.' },
    ],
  };

  /* ============================== R7 ============================== */
  const R7 = {
    id: 'r-mix-eq', n: 'R7', track: 'recording', title: 'Building a Mix II: EQ, Masking and the Frequency Map', level: 'Core', mins: 45,
    summary: 'Why sounds hide each other, how to carve space with cuts before boosts, what engineers mean by mud, boxiness, presence and air, and starting points for every common instrument.',
    tags: ['EQ', 'masking', 'high-pass', 'frequency ranges', 'mud', 'presence', 'complementary EQ', 'dynamic EQ', 'Q'],
    sections: [
      { h: 'Three reasons to equalise', html: `
        <p class="lead">Every EQ move should have one of three purposes. If you cannot say which, bypass it.</p>
        <div class="uc-grid">
          ${uc('🩹', 'Fix', [['Aim', 'Remove something wrong: rumble, a room resonance, harshness, proximity boom'], ['Tool', 'High-pass filters and narrow cuts']])}
          ${uc('🧩', 'Fit', [['Aim', 'Make parts stop masking each other so each is heard at a lower level'], ['Tool', 'Moderate cuts, complementary between two instruments']], '#7a5cc7')}
          ${uc('✨', 'Enhance', [['Aim', 'Bring out character: weight, attack, presence, air'], ['Tool', 'Gentle, wide boosts or shelves — last, and least']], '#c7772b')}
        </div>
        ${SVG_FILT}
        <p>The EQ theory — filter types, phase, Q — is in <a href="#/academy/a-dsp">Signal Processing</a>; here we use it.</p>` },
      { h: 'Masking: why a full mix sounds smaller than its parts', html: `
        ${SVG_MASK}
        <p>When two sounds have energy in the same range at the same time, the louder hides the quieter: the ear cannot separate them. The instinct is to turn the hidden part up — which now hides something else. The cure is to give each part its <b>own range</b>.</p>
        <div class="callout physics">Masking works upward: a loud low sound hides quieter sounds above it more than the other way round. That is why uncontrolled bass makes a whole mix feel unclear. See <a href="#/academy/hearing">Hearing</a>.</div>` },
      { h: 'The frequency map', html: `
        <p>Tap the zones and the instruments. Listen to each range, and read what too much or too little of it does.</p>`, viz: 'freqMap' },
      { h: 'Starting points by instrument', html: `
        ${tbl(['Source', 'High-pass around', 'Weight', 'Trouble', 'Definition', 'Top'], [
          ['Kick', '30–40 Hz', '50–80 Hz', '300–500 Hz (boxy)', '2–5 kHz (beater)', '—'],
          ['Snare', '80–100 Hz', '150–250 Hz', '400–900 Hz (ring)', '2–5 kHz (crack)', '8–10 kHz (wires)'],
          ['Bass', '30–40 Hz', '60–120 Hz', '200–300 Hz (mud)', '700 Hz–1 kHz (growl)', '2–3 kHz (strings)'],
          ['Electric guitar', '80–100 Hz', '150–250 Hz', '300–500 Hz; 2.5–4 kHz (harsh)', '1.5–3 kHz', 'low-pass 8–10 kHz if fizzy'],
          ['Acoustic guitar', '80–100 Hz', '200–250 Hz', '100–200 Hz (boom)', '3–5 kHz', '10–12 kHz (sparkle)'],
          ['Piano / keys', '40–80 Hz', '100–250 Hz', '300–500 Hz', '2–5 kHz', '8 kHz+'],
          ['Voice', '80–120 Hz', '150–250 Hz', '300–500 Hz; 800 Hz–1.2 kHz (nasal)', '2–5 kHz', '10 kHz+ (air); 5–9 kHz sibilance'],
          ['Cymbals / overheads', '200–400 Hz', '—', '3–5 kHz (harsh)', '6–8 kHz', '10–16 kHz'],
        ])}
        <div class="callout warn">These are places to <b>listen</b>, not settings to copy. Every recording is different: sweep a narrow boost to find the problem by ear, then cut there.</div>` },
      { h: 'Cut first, then boost — a method', html: `
        ${flow([['High-pass', 'everything that is not kick or bass'], ['Find', 'sweep a narrow +8 dB bell until it sounds worst'], ['Cut', '2–6 dB there, Q about 2–4'], ['Compare', 'bypass at matched level, in the mix'], ['Enhance', 'a wide +1–3 dB only if still needed'], ['Re-balance', 'the fader has to move after EQ']])}
        <ul><li><b>Narrow to cut, wide to boost.</b> Problems are narrow; character is broad.</li>
        <li><b>High-pass until you hear it thin, then back off.</b> Dozens of tracks each leaking a little 60–150 Hz add up to mud.</li>
        <li><b>A cut somewhere else is often the better “boost”.</b> Want a brighter vocal? Try cutting 300 Hz first.</li>
        <li><b>EQ in context.</b> A guitar that sounds thin in solo may be exactly right behind a bass and a vocal.</li></ul>
        <p>Experiment on pink noise or the band loop:</p>`, viz: 'eq' },
      { h: 'Complementary EQ: making two parts share', html: `
        ${tbl(['Pair', 'Give the first', 'Give the second'], [
          ['Kick + bass', 'Kick owns 50–70 Hz and 3 kHz click; cut 100–150 Hz', 'Bass owns 80–150 Hz and 800 Hz growl; cut 60 Hz and 3 kHz'],
          ['Vocal + guitars', 'Vocal keeps 2–4 kHz', 'Guitars: wide 2–3 dB dip at 2–4 kHz, pan away from centre'],
          ['Vocal + pad / keys', 'Vocal keeps 200–400 Hz body', 'Pad: high-pass 200–300 Hz, dip where the vocal sits'],
          ['Snare + guitars', 'Snare crack 2–3 kHz', 'Guitars leave a gap there or step back in level'],
          ['Two rhythm guitars', 'One brighter (cut 250 Hz)', 'One darker (cut 3 kHz), panned opposite'],
        ])}
        <p>The swap between kick and bass can go either way — a deep kick with a mid-range bass, or a clicky kick over a deep bass. Choose one and commit.</p>` },
      { h: 'Beyond static EQ', html: `
        <ul><li><b>Dynamic EQ</b> cuts or boosts a band only when it gets too loud — ideal for a note that booms occasionally or harshness that appears only on loud phrases.</li>
        <li><b>Multiband compression</b> splits the signal into bands and compresses each: a stronger, broader tool, best kept for problem material.</li>
        <li><b>De-essing</b> is dynamic EQ aimed at 5–9 kHz.</li>
        <li><b>Linear-phase vs minimum-phase:</b> normal (minimum-phase) EQ shifts phase near the changed frequencies, which is usually harmless and sounds natural. Linear-phase EQ avoids the shift but adds latency and “pre-ringing”; it is mainly useful when processing two closely related signals in parallel, or in mastering.</li></ul>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎤', 'Boomy close-miked vocal', [['Cause', 'Proximity effect at 150–250 Hz'], ['Fix', 'High-pass 100 Hz, 3 dB wide cut at 200 Hz; no top boost needed afterwards']])}
          ${uc('🎸', 'Guitars mask the singer', [['Cause', 'Both strongest at 2–4 kHz'], ['Fix', 'Dip guitars 2–3 dB there, pan wide; leave the vocal alone']], '#7a5cc7')}
          ${uc('🥁', 'Cardboard drums', [['Cause', 'Build-up at 300–500 Hz from every drum mic'], ['Fix', 'Cut 3–4 dB on the drum bus or on each tom and kick']], '#c7772b')}
          ${uc('🎙️', 'Podcast recorded in a bare room', [['Cause', 'Room resonances and boxiness'], ['Fix', 'High-pass 80 Hz, narrow cuts at the ringing notes, gentle presence lift; treat the room next time']], '#2b9fc7')}
          ${uc('🎹', 'Dense electronic mix', [['Cause', 'Every synth is full-range'], ['Fix', 'Assign each synth a range; high- and low-pass the rest away']], '#4c9a3a')}
          ${uc('🎬', 'Dialogue under music', [['Cause', 'Score overlaps speech at 1–4 kHz'], ['Fix', 'Dynamic dip on the music keyed from the dialogue']], '#d14b8f')}
        </div>` },
      { h: 'Problems, mistakes and a checklist', html: `
        ${tbl(['Symptom', 'Where to listen', 'Typical move'], [
          ['Muddy', '200–500 Hz on most tracks', 'High-pass and small cuts on everything but the foundation'],
          ['Boomy', '80–200 Hz', 'Cut the resonant note; check the room is not fooling you'],
          ['Boxy / honky', '400 Hz–1.2 kHz', 'Narrow cut found by sweeping'],
          ['Harsh / tiring', '2.5–5 kHz', 'Small wide cut, or dynamic EQ on loud passages'],
          ['Dull', '8 kHz and above', 'First remove mud; then a gentle high shelf'],
          ['Thin', '100–250 Hz', 'You high-passed too far, or polarity is wrong between mics'],
        ])}
        ${myth([
          ['“Boosting makes it better.”', 'Louder sounds better for a moment. Match the level before and after to hear the truth.'],
          ['“There is a magic frequency for each instrument.”', 'Tables are maps for where to listen; the recording decides.'],
          ['“EQ every track.”', 'If it fits, leave it alone.'],
          ['“Fix the mix EQ for my room’s bass problem.”', 'If your room has a peak at 60 Hz you will cut 60 Hz from every mix. Treat or learn the room first.'],
        ])}
        ${SAFE}
        <p>Next: <a href="#/academy/r-mix-dynamics">Compression, limiting, gates and automation</a>. Try the <a href="#/lab/eq">EQ lab</a>.</p>` },
    ],
    quiz: [
      { q: 'What is masking?', opts: ['A type of filter', 'A louder sound hiding a quieter one in the same frequency range', 'Phase cancellation', 'Clipping'], a: 1, why: 'The ear cannot separate sounds that occupy the same range at once.' },
      { q: 'Which is the usual order of work?', opts: ['Boost, then cut', 'High-pass and cut problems first, then enhance if needed', 'Only shelves', 'EQ in solo only'], a: 1, why: 'Removing what is wrong often makes boosts unnecessary.' },
      { q: 'A mix is “muddy”. Where do you listen first?', opts: ['20–40 Hz', '200–500 Hz', '5–8 kHz', '12–16 kHz'], a: 1, why: 'Nearly every instrument overlaps in the low mids.' },
      { q: 'Complementary EQ between kick and bass means…', opts: ['Boosting both at 60 Hz', 'Giving each a range to own and cutting the other there', 'Panning them apart', 'Compressing both'], a: 1, why: 'Each instrument gets its own slot so neither masks the other.' },
      { q: 'When is dynamic EQ the better tool?', opts: ['For a constant rumble', 'When a problem appears only on some notes or loud phrases', 'For panning', 'To add reverb'], a: 1, why: 'It acts only when the band exceeds a threshold, leaving the rest untouched.' },
    ],
  };

  /* ============================== R8 ============================== */
  const R8 = {
    id: 'r-mix-dynamics', n: 'R8', track: 'recording', title: 'Building a Mix III: Compression, Limiting, Gates and Automation', level: 'Core', mins: 45,
    summary: 'What compression really does to the shape and tone of a sound, how attack and release decide punch, starting settings for common sources, and when a fader ride is the better answer.',
    tags: ['compression', 'attack', 'release', 'ratio', 'parallel compression', 'sidechain', 'de-esser', 'gate', 'limiter', 'automation'],
    sections: [
      { h: 'Two jobs: level control and shape', html: `
        <p class="lead">A compressor turns the loud parts down. That simple act does two different jobs depending on how fast it works.</p>
        <div class="uc-grid">
          ${uc('📏', 'Level control (slower)', [['Does', 'Evens out a performance so quiet words are heard and loud ones do not jump out'], ['Sounds like', 'A steadier, closer, more “finished” track']])}
          ${uc('🥊', 'Envelope shaping (faster)', [['Does', 'Changes the balance between a note’s attack and its body or tail'], ['Sounds like', 'More punch, more sustain, more room sound — or less of each']], '#c7772b')}
        </div>
        ${SVG_COMP}` },
      { h: 'The controls in plain words', html: `
        ${tbl(['Control', 'What it sets', 'Too little', 'Too much'], [
          ['Threshold', 'The level above which compression starts', 'Nothing happens', 'Everything is squashed all the time'],
          ['Ratio', 'How hard it turns down above the threshold (4:1 = 4 dB in, 1 dB out)', 'Barely controls', 'Flat, lifeless; behaves as a limiter above ~10:1'],
          ['Attack', 'How quickly it reacts', 'Fast: clamps the transient, dulls punch', 'Slow: peaks escape, the hit pokes out'],
          ['Release', 'How quickly it lets go', 'Fast: pumping, raised noise, bass distortion', 'Slow: never recovers, the whole track sinks'],
          ['Knee', 'How gradually compression begins', 'Hard knee: obvious, grabby', 'Soft knee: gentle, sometimes vague'],
          ['Make-up gain', 'Restores the level lost', 'Sounds quieter, so “worse”', 'Sounds louder, so “better” — match by ear'],
        ])}
        <p>Play with the real thing: <a href="#/lab/dyn">Compressor lab</a>.</p>`, viz: 'compressor' },
      { h: 'See what attack and release do', html: `
        <p>Choose a source and move attack and release. Watch how the front of each hit and the gaps between hits change.</p>`, viz: 'envelopeShaper' },
      { h: 'Starting settings by source', html: `
        ${tbl(['Source', 'Ratio', 'Attack', 'Release', 'Reduction', 'Aim'], [
          ['Lead vocal', '3:1–4:1', '5–15 ms', '80–200 ms', '3–6 dB', 'Even, upfront; often two gentle stages in series'],
          ['Bass', '4:1–6:1', '20–40 ms', '100–250 ms', '4–8 dB', 'Solid, every note the same weight'],
          ['Kick', '4:1', '20–40 ms', '50–120 ms', '3–6 dB', 'Keep the click, tighten the body'],
          ['Snare', '4:1', '10–30 ms', '80–150 ms', '3–6 dB', 'More crack with slower attack; more body with faster'],
          ['Drum bus', '2:1–4:1', '20–30 ms', 'fast or auto', '2–4 dB', 'Glue; transients intact'],
          ['Acoustic guitar', '3:1', '15–30 ms', '100–200 ms', '2–4 dB', 'Control strums without flattening'],
          ['Mix bus', '1.5:1–2:1', '30 ms+', 'auto / 100–300 ms', '1–2 dB', 'Cohesion only; mix into it from early on'],
        ])}
        <div class="callout warn">Starting points, not settings. Set the threshold by the gain-reduction meter and your ears; then adjust attack and release until the track moves with the music.</div>` },
      { h: 'Compressor characters', html: `
        ${tbl(['Type (generic)', 'Behaviour', 'Often chosen for'], [
          ['VCA-type', 'Fast, precise, clean; controls peaks firmly', 'Drums, buses, anything needing punch and control'],
          ['Optical-type', 'Slow, smooth, programme-dependent release', 'Vocals, bass, gentle levelling'],
          ['FET-type', 'Very fast, coloured, aggressive', 'Drums, vocals with attitude, parallel crush'],
          ['Variable-mu (valve) type', 'Soft knee, gentle, thickens', 'Mix bus, mastering, “glue”'],
          ['Digital / look-ahead', 'Can react before the peak arrives', 'Transparent limiting, mastering'],
        ])}
        <p>The character matters less than the settings. Learn one clean compressor thoroughly before collecting flavours.</p>` },
      { h: 'Parallel, sidechain and friends', html: `
        ${SVG_PAR}
        <ul><li><b>Parallel compression:</b> blend a heavily compressed copy under the untouched signal. The dry path keeps the transients; the crushed path lifts the quiet detail. Great on drums and vocals.</li>
        <li><b>Sidechain ducking:</b> one signal controls the compressor on another — the kick dips the bass for a few milliseconds; speech dips the music bed.</li>
        <li><b>De-esser:</b> a compressor that listens only to 5–9 kHz and turns down “s” sounds. Place it before bright EQ and reverb sends.</li>
        <li><b>Gate / expander:</b> the opposite of a compressor — turns down what is <i>below</i> a threshold. Cleans tom mics and noisy amps; an expander (gentle ratio) is less obvious than a hard gate.</li>
        <li><b>Limiter:</b> a very fast, very high-ratio compressor that stops peaks at a ceiling. Use for protection and final level, not for tone.</li>
        <li><b>Transient shaper:</b> changes attack and sustain directly, regardless of level.</li></ul>` },
      { h: 'Automation: the first compressor', html: `
        <p>Before compressing a vocal by 10 dB, ride its level. Clip-gain or fader automation evens out the big differences — a whispered verse, a shouted chorus — with no side effects. The compressor then only has to manage the small, fast ones.</p>
        ${flow([['Clip gain', 'bring phrases to a similar level'], ['Compress gently', '3–4 dB on peaks'], ['Ride the fader', 'word-by-word in key lines'], ['De-ess', 'only what needs it'], ['Limit', 'the last stray peaks']])}
        <div class="callout mentor">If you can hear a compressor working and did not mean to, it is doing too much or releasing at the wrong speed.</div>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎤', 'Dynamic singer', [['Problem', 'Verses vanish, choruses leap out'], ['Approach', 'Clip-gain the sections, 4:1 with 4 dB reduction, then ride key words']])}
          ${uc('🎸', 'Uneven bass player', [['Problem', 'Some notes boom, others disappear'], ['Approach', '4:1, medium attack, 6 dB on the loud notes; dynamic EQ on the one booming note']], '#7a5cc7')}
          ${uc('🥁', 'Drums lack excitement', [['Problem', 'Punchy but small'], ['Approach', 'Parallel bus: fast attack and release, 10+ dB reduction, blended in until the room comes alive']], '#c7772b')}
          ${uc('🎙️', 'Podcast with a loud and a quiet speaker', [['Problem', 'Listeners keep adjusting volume'], ['Approach', 'Match levels with clip gain, 3:1 on each voice, limiter on the output, duck the music from speech']], '#2b9fc7')}
          ${uc('🎹', 'Dance track', [['Problem', 'Kick and bass collide'], ['Approach', 'Sidechain the bass from the kick: fast attack, release timed to the groove']], '#4c9a3a')}
          ${uc('🎬', 'Dialogue scene', [['Problem', 'Whispers and shouts in one take'], ['Approach', 'Automation first; gentle 2:1; limiter to protect; never pump the room tone']], '#d14b8f')}
        </div>` },
      { h: 'Problems, mistakes and a checklist', html: `
        ${tbl(['Symptom', 'Cause', 'Fix'], [
          ['No punch', 'Attack too fast, too much reduction', 'Slow the attack to 20–30 ms; reduce less'],
          ['Pumping / breathing', 'Release too fast or too much reduction on a full mix', 'Lengthen the release; raise the threshold; high-pass the sidechain'],
          ['Dull, lifeless', 'Over-compression', 'Back off; use parallel compression instead'],
          ['Noise and room sound came up', 'Make-up gain lifts everything quiet', 'Less reduction; gate or expander before the compressor'],
          ['Bass distorts', 'Release shorter than one cycle of the note', 'Release above ~50–100 ms'],
          ['Sibilance worse after compression', 'Compressor lifted the quiet “s” relative to vowels', 'De-esser after the compressor'],
        ])}
        ${myth([
          ['“Compression makes things louder.”', 'It makes loud parts quieter. Make-up gain makes things louder.'],
          ['“Every track needs a compressor.”', 'Sustained, even sources (pads, distorted guitars) are already compressed.'],
          ['“Fast attack = punch.”', 'The opposite: a slower attack lets the punch through.'],
          ['“The mix-bus limiter is how professionals get loud.”', 'Loudness comes from balance and arrangement; the limiter adds the last few dB.'],
        ])}
        ${SAFE}
        <p>Next: <a href="#/academy/r-mix-space">Reverb, delay, modulation and depth</a>.</p>` },
    ],
    quiz: [
      { q: 'You want more “crack” from a snare. Which attack setting helps?', opts: ['The fastest possible', 'A slower attack (10–30 ms) so the transient passes', 'Attack does not matter', 'Zero attack with look-ahead'], a: 1, why: 'A slow attack lets the hit through before the body is turned down.' },
      { q: 'A ratio of 4:1 means…', opts: ['Output is four times louder', 'For every 4 dB over the threshold, 1 dB comes out', 'Four compressors in series', 'Attack is 4 ms'], a: 1, why: 'Ratio is input change to output change above the threshold.' },
      { q: 'Pumping on a full mix is usually caused by…', opts: ['Too slow a release', 'Too fast a release or too much gain reduction', 'Too little make-up gain', 'A soft knee'], a: 1, why: 'The gain audibly springs back between loud events.' },
      { q: 'What does parallel compression preserve?', opts: ['The noise floor', 'The transients of the dry signal', 'The stereo width', 'The sample rate'], a: 1, why: 'The untouched path keeps the attack while the compressed path adds density.' },
      { q: 'What should you try before compressing a vocal heavily?', opts: ['A limiter', 'Riding the level with clip gain or automation', 'More reverb', 'A gate'], a: 1, why: 'Automation fixes big level differences without side effects.' },
    ],
  };

  /* ============================== R9 ============================== */
  const NOTE_T = [['1/4', 1], ['1/8', 0.5], ['1/16', 0.25], ['1/4 dotted', 1.5], ['1/8 dotted', 0.75], ['1/8 triplet', 1 / 3]];
  const R9 = {
    id: 'r-mix-space', n: 'R9', track: 'recording', title: 'Building a Mix IV: Reverb, Delay, Modulation and Depth', level: 'Core', mins: 45,
    summary: 'How to place sounds near or far, choose and set reverbs, time delays to the tempo, use modulation sparingly, and keep the whole thing clear in mono.',
    tags: ['reverb', 'pre-delay', 'delay', 'depth', 'tempo', 'slapback', 'chorus', 'flanger', 'sends', 'returns', 'precedence effect'],
    sections: [
      { h: 'Depth: the third dimension', html: `
        <p class="lead">Left–right comes from panning. Front–back comes from four cues the ear uses to judge distance. Use them together and a flat mix becomes a stage.</p>
        ${tbl(['Cue', 'Close', 'Far'], [
          ['Level', 'Louder', 'Quieter'],
          ['Brightness', 'Full highs, clear transients', 'Softer highs (air absorbs them)'],
          ['Direct-to-reverb balance', 'Mostly dry', 'Mostly reverberant'],
          ['Pre-delay / early reflections', 'Long gap before the room answers', 'Reflections arrive almost with the sound'],
        ])}
        <p>Move the source around the stage and listen:</p>`, viz: 'depthStage' },
      { h: 'Anatomy of a reverb', html: `
        ${SVG_REV}
        ${tbl(['Parameter', 'What it does', 'Typical use'], [
          ['Pre-delay', 'Gap between the dry sound and the reverb', '20–80 ms keeps vocals clear; 0 ms pushes things back'],
          ['Decay time', 'How long the tail lasts', '0.3–0.8 s rooms, 1–1.8 s plates, 2 s+ halls; shorter for fast songs'],
          ['Early reflections', 'The first echoes that describe the room’s size', 'More for realism and “glue”; less for a smooth wash'],
          ['Size / diffusion', 'Density and smoothness of the tail', 'High diffusion for vocals, lower for a grainy vintage feel'],
          ['Damping / high cut', 'How quickly highs die in the tail', 'Darker reverbs sit behind the source'],
          ['Low cut', 'Removes bass from the reverb', 'Almost always: 150–300 Hz, to avoid mud'],
        ])}` },
      { h: 'Reverb types and what they are good for', html: `
        ${tbl(['Type', 'Sound', 'Good for'], [
          ['Room', 'Short, natural, early reflections', 'Drums, guitars, gluing dry tracks together'],
          ['Hall', 'Long, smooth, wide', 'Strings, ballads, pads, classical'],
          ['Plate', 'Bright, dense, no early reflections', 'Vocals, snare'],
          ['Spring', 'Boingy, mid-heavy', 'Guitars, vintage colour'],
          ['Chamber', 'Dense and warm with character', 'Vocals, horns, drums'],
          ['Convolution', 'A recording of a real space or device', 'Realism, film sound, matching location dialogue'],
          ['Gated / reverse / shimmer', 'Obvious effects', 'A deliberate feature, not a space'],
        ])}
        <div class="callout data"><b>Rule of thumb:</b> two or three reverbs serve a whole mix — one short (room), one long (plate or hall), maybe one special. Many sources into the same space sound like one band in one place.</div>` },
      { h: 'Pre-delay and the precedence effect', html: `
        <p>The ear locates a sound by the first arrival and ignores copies that follow within about 30–40 ms, merging them into one event (the precedence effect). Mixing uses this in two ways:</p>
        <ul><li><b>Pre-delay</b> of 20–80 ms lets the dry voice register first, so it stays in front while the reverb fills in behind it.</li>
        <li><b>Short delays</b> (under ~35 ms) fuse with the source and thicken or widen it; longer ones are heard as separate echoes.</li></ul>
        <div class="callout warn"><b>Haas widening caution:</b> panning a sound to one side and a 10–30 ms delayed copy to the other makes it sound huge in stereo — and hollow or cancelled in mono. Always check mono; prefer two real takes.</div>` },
      { h: 'Time it to the tempo', html: `
        <div class="formula"><span class="lbl">Quarter-note time</span>ms = 60 000 ÷ BPM</div>
        ${tbl(['Note value', ...[90, 100, 120, 140].map((b) => b + ' BPM')], NOTE_T.map(([n, m]) => [n, ...[90, 100, 120, 140].map((b) => Math.round((60000 / b) * m) + ' ms')]))}
        <p>Delays on the grid become part of the rhythm. Reverb decay can be timed too: aim for the tail to fade just before the next strong beat or bar.</p>`, viz: 'delayCalc' },
      { h: 'Delays you will use', html: `
        <div class="uc-grid">
          ${uc('👋', 'Slapback', [['Time', '60–140 ms, one repeat'], ['Use', 'Vocals and guitars: presence and attitude without reverb wash']])}
          ${uc('👥', 'Doubling', [['Time', '15–40 ms, no feedback, slight pitch or time wobble'], ['Use', 'Thicken a vocal or guitar; check mono']], '#7a5cc7')}
          ${uc('🏓', 'Ping-pong', [['Time', 'Tempo-synced, alternating sides'], ['Use', 'Width and movement on sparse parts']], '#c7772b')}
          ${uc('🥁', 'Tempo echo', [['Time', '1/4, 1/8 or dotted 1/8 with feedback'], ['Use', 'Fill the gaps after a line; automate the send for “throws”']], '#2b9fc7')}
        </div>
        <p>A filtered delay often does a reverb’s job with less clutter: it gives a sense of space in the gaps while leaving the mix dry and upfront.</p>` },
      { h: 'Modulation effects', html: `
        ${tbl(['Effect', 'How it works', 'Sound'], [
          ['Chorus', 'A 15–30 ms delayed copy with slowly varying delay time', 'Thicker, wider, gently detuned'],
          ['Flanger', 'A very short (1–10 ms) varying delay with feedback', 'Sweeping, jet-like comb filter'],
          ['Phaser', 'Sweeping all-pass filters instead of a delay', 'Softer, swirling notches'],
          ['Tremolo / auto-pan', 'Level or position varied by a slow oscillator', 'Pulse and movement'],
          ['Vibrato / rotary', 'Pitch (and level) modulation', 'Organ-style swirl'],
        ])}
        <p>All of them work by combining a signal with a moving copy of itself — the comb filtering explained in <a href="#/academy/interference">Interference</a>, used on purpose.</p>` },
      { h: 'Sends, returns and keeping it clean', html: `
        ${SVG_SEND}
        <ul><li><b>Sends for shared space, inserts for one-off effects.</b> On a send the effect is 100 % wet and the fader sets how much each track gets.</li>
        <li><b>EQ the return:</b> high-pass at 150–300 Hz, low-pass at 5–8 kHz. A reverb without lows and extreme highs sits behind the mix.</li>
        <li><b>Compress or duck the return</b> from the dry signal so the effect blooms in the gaps.</li>
        <li><b>Set the level, then pull it back 2 dB.</b> You notice a good reverb when you mute it, not while it plays.</li></ul>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎤', 'Lead vocal in a pop song', [['Approach', 'Plate, 1.4 s, 60 ms pre-delay, high-passed; dotted-eighth delay thrown on last words']])}
          ${uc('🥁', 'Dry close-miked drums', [['Approach', 'Short room (0.5 s) on the whole kit for glue; longer plate on snare only']], '#7a5cc7')}
          ${uc('🎻', 'String quartet', [['Approach', 'One hall, pre-delay near zero, all four instruments at similar send levels']], '#c7772b')}
          ${uc('🎙️', 'Podcast / voice-over', [['Approach', 'None — or the faintest short room to soften a very dead booth']], '#2b9fc7')}
          ${uc('🎹', 'Ambient electronic track', [['Approach', 'Long halls and feedback delays are the instrument; carve their lows so the bass stays clear']], '#4c9a3a')}
          ${uc('🎬', 'Matching studio dialogue to a location', [['Approach', 'Convolution of a similar room, level and EQ matched to the production sound']], '#d14b8f')}
        </div>` },
      { h: 'Problems, mistakes and a checklist', html: `
        ${tbl(['Symptom', 'Cause', 'Fix'], [
          ['Washed out, distant', 'Too much reverb, no pre-delay', 'Less send, 40–80 ms pre-delay, shorter decay'],
          ['Muddy', 'Bass in the reverb', 'High-pass the return; keep kick and bass dry'],
          ['Sounds small / flat', 'Everything equally dry and close', 'Push support parts back; keep the lead forward'],
          ['Hollow in mono', 'Short stereo delays or wideners', 'Narrow or remove; use real doubles'],
          ['Echoes clutter the vocal', 'Constant delay with high feedback', 'Automate throws; duck the return'],
          ['Sibilant splashes', 'Bright reverb fed with “s” sounds', 'De-ess the send; low-pass the return'],
        ])}
        ${myth([
          ['“More reverb sounds more professional.”', 'Modern mixes are drier than they seem. Depth comes from contrast, not quantity.'],
          ['“Each track needs its own reverb.”', 'Shared spaces make a mix sound like one performance.'],
          ['“Reverb fixes a bad room recording.”', 'It adds a second room on top of the first. Record dry in a good space.'],
        ])}
        ${SAFE}
        <p>Next: <a href="#/academy/r-mastering">Monitoring, loudness and mastering</a>.</p>` },
    ],
    quiz: [
      { q: 'A quarter note at 120 BPM lasts…', opts: ['250 ms', '500 ms', '1 000 ms', '120 ms'], a: 1, why: '60 000 ÷ 120 = 500 ms.' },
      { q: 'What does reverb pre-delay do for a vocal?', opts: ['Makes it darker', 'Keeps the dry voice in front by delaying the reverb', 'Adds bass', 'Compresses it'], a: 1, why: 'The first arrival is heard clearly before the room answers.' },
      { q: 'Which combination pushes a sound to the back?', opts: ['Louder, brighter, dry', 'Quieter, duller, more reverb, no pre-delay', 'Hard panned', 'More compression'], a: 1, why: 'Those are the ear’s distance cues.' },
      { q: 'Why high-pass a reverb return?', opts: ['To make it louder', 'To keep low-frequency reverb from muddying the mix', 'To add sibilance', 'It is required by the plug-in'], a: 1, why: 'Bass reverb blurs kick and bass and eats headroom.' },
      { q: 'What is the risk of Haas-style widening?', opts: ['It is too quiet', 'It can cancel or sound hollow in mono', 'It adds latency', 'It needs two reverbs'], a: 1, why: 'The delayed copy comb-filters with the original when summed.' },
    ],
  };

  /* ============================== R10 ============================== */
  const R10 = {
    id: 'r-mastering', n: 'R10', track: 'recording', title: 'Monitoring, Loudness and Mastering', level: 'Advanced', mins: 50,
    summary: 'How to make a mix translate, what peak, RMS, LUFS and true-peak meters tell you, why loudness normalisation ended the loudness race, and what mastering actually does.',
    tags: ['mastering', 'LUFS', 'true peak', 'loudness normalisation', 'crest factor', 'limiter', 'dither', 'translation', 'mid-side', 'metering'],
    sections: [
      { h: 'Translation: the real test', html: `
        <p class="lead">A mix is finished when it works everywhere: studio monitors, a phone, earbuds, a car, a club. No single system tells the whole truth — you learn what each one hides.</p>
        ${tbl(['Check on', 'Reveals', 'Hides'], [
          ['Main monitors in a treated room', 'Balance, depth, tone — if the room is honest', 'Depends on the room: see Flat Response'],
          ['Small single speaker / phone', 'Mid-range balance; whether bass and kick are audible without lows', 'Low end and stereo'],
          ['Headphones', 'Clicks, edits, noise, reverb tails, panning detail', 'Low-end feel, speaker-style imaging'],
          ['Car', 'Bass balance and vocal level in a noisy place', 'Fine detail'],
          ['Mono', 'Phase problems, centre balance', 'Width'],
          ['Very quiet', 'What is loudest: is it the right thing?', 'Bass (the ear is less sensitive)'],
        ])}
        <p>Your monitoring chain decides everything you do: <a href="#/academy/flat">Flat Response: Myth, Goal &amp; Method</a> and <a href="#/academy/m-control">Control Rooms</a>.</p>
        ${SAFE}` },
      { h: 'Reading the meters', html: `
        ${SVG_METER}
        ${tbl(['Meter', 'Measures', 'Use it for'], [
          ['Sample peak (dBFS)', 'The highest sample value', 'Avoiding digital clipping'],
          ['True peak (dBTP)', 'The peak of the reconstructed waveform between samples', 'Setting the final ceiling — it can exceed sample peak by 1–3 dB'],
          ['RMS', 'Average signal power over a short window', 'A rough sense of density'],
          ['LUFS — momentary, short-term, integrated', 'Loudness as heard (frequency-weighted, gated); integrated = whole programme', 'Delivery targets and comparing mixes'],
          ['Loudness range (LRA)', 'How much the loudness varies through the piece', 'Checking dynamics for speech, film, classical'],
          ['Correlation / goniometer', 'How similar left and right are (+1 mono, 0 wide, −1 out of phase)', 'Mono compatibility'],
          ['Spectrum analyser', 'Energy against frequency', 'Confirming what you hear; spotting sub-bass you cannot hear'],
        ])}` },
      { h: 'Loudness normalisation — try it', html: `
        <p>Most streaming and broadcast playback now measures each programme’s integrated loudness and adjusts its playback gain toward a target. Push a master into the limiter and see what the listener actually receives:</p>`, viz: 'loudnessLab' },
      { h: 'Targets and ceilings', html: `
        ${tbl(['Destination', 'Typical target', 'Notes'], [
          ['Music streaming', 'in the region of −14 LUFS integrated', 'Louder masters are turned down; quieter ones may be left or raised'],
          ['Podcasts / spoken word', 'about −16 LUFS (stereo)', 'Consistency between episodes matters most'],
          ['Broadcast television / radio', 'about −23 LUFS (Europe) or −24 LKFS (North America)', 'Delivery is rejected if outside tolerance'],
          ['Cinema', 'Mixed to a calibrated monitoring level instead', 'Dialogue-anchored'],
          ['True-peak ceiling', 'about −1 dBTP (−2 dBTP for some lossy formats)', 'Prevents overshoot and encoder clipping'],
        ])}
        <div class="callout warn">Targets differ between platforms and are revised from time to time. Always check the current delivery specification — and remember a target is where playback is <i>adjusted to</i>, not a level you must hit.</div>
        <div class="callout data"><b>Crest factor</b> (peak-to-loudness) is the useful number: roughly 9–14 dB for most modern music, more for acoustic and classical. Below about 8 dB the punch is gone.</div>` },
      { h: 'What mastering is', html: `
        ${SVG_CHAIN}
        <p>Mastering is the last creative step and the first technical one: a fresh pair of ears in an accurate room makes the songs sound like a record and prepares the files for release.</p>
        <ul><li><b>Tonal balance</b> across the album, by small broad EQ moves.</li>
        <li><b>Dynamics:</b> gentle compression for cohesion; limiting for final level and peak control.</li>
        <li><b>Stereo and mid-side:</b> processing the centre (mid) and the sides separately — for example tightening the bass in the centre or adding air to the sides. A little goes a long way.</li>
        <li><b>Sequencing:</b> song order, gaps, fades, level matching between tracks by ear.</li>
        <li><b>Quality control:</b> listening start to finish for clicks, noise and errors.</li></ul>` },
      { h: 'Preparing a mix for mastering', html: `
        ${flow([['Leave headroom', 'peaks around −6 to −3 dBFS'], ['No limiter', 'remove mix-bus limiting; keep gentle glue if it is part of the sound'], ['Full resolution', '24-bit or 32-bit float, at the session sample rate'], ['Clean ends', 'no cut-off tails; leave a second of silence'], ['Versions', 'main, instrumental, vocal up/down, stems if asked'], ['Notes', 'references and anything you are unsure about']])}` },
      { h: 'Dither, sample rate and formats', html: `
        <ul><li><b>Dither:</b> when reducing bit depth (for example 24-bit to 16-bit), add dither — very low-level noise that turns quantisation distortion into a smooth, benign hiss. Apply once, as the very last step. See it in the widget below.</li>
        <li><b>Sample-rate conversion:</b> do it once with a high-quality converter, before the final limiter and dither.</li>
        <li><b>Delivery:</b> uncompressed 24-bit WAV at the original rate for streaming distribution; 16-bit / 44.1 kHz for CD; lossy formats are made by the service from your master.</li>
        <li><b>Metadata:</b> titles, artist, ISRC codes, artwork, track order, gaps.</li>
        <li><b>Stems:</b> grouped sub-mixes (drums, bass, music, vocals, effects) that sum to the mix — for mastering adjustments, remixes, film and games.</li></ul>`, viz: 'sampling' },
      { h: 'Vinyl and immersive deliverables', html: `
        <div class="uc-grid">
          ${uc('💿', 'Vinyl', [['Bass', 'Keep low frequencies mono and controlled: wide, out-of-phase bass makes the groove jump'], ['Highs', 'Tame sibilance and extreme top; they distort on playback'], ['Length', 'Longer sides mean lower level and less bass — about 18–20 minutes per side at 33⅓ rpm is comfortable']])}
          ${uc('🎧', 'Surround and immersive', [['Deliver', 'A channel-based or object-based master to the format’s specification, plus a stereo version'], ['Check', 'Loudness is measured on the whole programme; verify the stereo and headphone renders'], ['Room', 'Monitoring layout and calibration matter even more: see <a href="#/academy/m-control">Control Rooms</a>']], '#7a5cc7')}
        </div>` },
      { h: 'Mastering your own work — and when not to', html: `
        ${tbl(['Do it yourself when', 'Hire a mastering engineer when'], [
          ['Demos, drafts, social clips, podcasts', 'A commercial release, an album, vinyl'],
          ['You can compare to references at matched loudness', 'Your room is untreated or you are too close to the mix'],
          ['Only level and a safety ceiling are needed', 'Tracks from different sessions must sound like one record'],
        ])}
        ${flow([['Rest your ears', 'a day away from the mix'], ['Compare', 'references, level-matched'], ['EQ', 'only what three systems agree on'], ['Limit', 'until it stops sounding better — then back off 1 dB'], ['Ceiling', '−1 dBTP'], ['Listen through', 'start to finish, on two systems'], ['Export', 'dither if reducing bit depth']])}` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎸', 'Rock single for streaming', [['Approach', 'Limit for sound, not for a number: landing around −10 to −12 LUFS is fine — it will be turned down, so make sure it still punches at matched level']])}
          ${uc('🎻', 'Acoustic / classical album', [['Approach', 'Almost no limiting; −18 to −20 LUFS is natural; consistency between movements matters']], '#7a5cc7')}
          ${uc('🎙️', 'Podcast series', [['Approach', 'Every episode to the same loudness (about −16 LUFS), −1 dBTP, speech always intelligible on a phone']], '#c7772b')}
          ${uc('📺', 'Programme for broadcast', [['Approach', 'Mix to the broadcaster’s loudness target and tolerance; measure the whole programme; deliver the report']], '#2b9fc7')}
          ${uc('🎹', 'Club track', [['Approach', 'Mono-solid low end, controlled sub, tested on a big system; often played without normalisation']], '#4c9a3a')}
          ${uc('🎬', 'Short film', [['Approach', 'Dialogue sets the level; wide dynamic range for cinema, a tighter version for online']], '#d14b8f')}
        </div>` },
      { h: 'Problems, mistakes and a checklist', html: `
        ${tbl(['Symptom', 'Cause', 'Fix'], [
          ['Sounds great here, wrong everywhere else', 'Room or monitors misleading you', 'Treat the room; learn references; check on more systems'],
          ['Master is quieter than others on a service', 'It was not: normalisation matched them; yours may have less density', 'Compare at matched loudness; fix the mix balance, not the limiter'],
          ['Distortion after upload', 'Inter-sample peaks clipping in the encoder', 'True-peak limiter, −1 dBTP ceiling'],
          ['Flat, tiring', 'Over-limiting', 'Reduce limiting until the drums breathe'],
          ['Bass disappears on small speakers', 'All the bass energy is below 60 Hz', 'Add harmonics (saturation) or a bass part an octave up'],
          ['Tracks jump in level across an album', 'Matched by meter, not by ear', 'Match the vocal or lead level by ear between songs'],
        ])}
        ${myth([
          ['“Louder masters win.”', 'With normalisation they are turned down. Dynamics win.'],
          ['“Mastering can fix a bad mix.”', 'It can polish and balance; it cannot re-balance the vocal against the guitars.'],
          ['“Hit −14 LUFS exactly.”', 'It is a playback reference, not a creative goal.'],
          ['“Dither is audible noise, so skip it.”', 'Its noise is far quieter than the distortion it prevents.'],
        ])}
        <p>Related: <a href="#/academy/a-digital">Digital Audio Deep Dive</a> · <a href="#/academy/a-dsp">Signal Processing</a> · <a href="#/academy/hearing">Hearing</a>.</p>` },
    ],
    quiz: [
      { q: 'What does integrated LUFS measure?', opts: ['The highest peak', 'The perceived loudness of the whole programme', 'Stereo width', 'Bit depth'], a: 1, why: 'It is a frequency-weighted, gated average over the full programme.' },
      { q: 'A master at −8 LUFS is uploaded to a service that normalises to about −14 LUFS. What happens?', opts: ['It plays 6 dB louder than others', 'It is turned down about 6 dB', 'It is rejected', 'It is limited again'], a: 1, why: 'Playback gain is reduced to match the target; the squashed peaks stay squashed.' },
      { q: 'Why set a true-peak ceiling near −1 dBTP?', opts: ['It sounds warmer', 'Peaks between samples and lossy encoding can exceed 0 dBFS and clip', 'It increases loudness', 'It removes dither'], a: 1, why: 'The reconstructed waveform can overshoot the sample values.' },
      { q: 'When is dither applied?', opts: ['Before every plug-in', 'Once, as the last step when reducing bit depth', 'Only on vinyl', 'Never with 24-bit sessions that stay 24-bit'], a: 1, why: 'It replaces quantisation distortion with benign noise at the final word-length reduction.' },
      { q: 'Which is the most reliable sign of over-limiting?', opts: ['High LUFS reading alone', 'Very small peak-to-loudness range and loss of punch', 'A wide correlation meter', 'A 48 kHz sample rate'], a: 1, why: 'When the crest factor collapses, transients — and impact — are gone.' },
    ],
  };

  [R6, R7, R8, R9, R10].forEach((L) => window.LESSONS.push(L));
})();
