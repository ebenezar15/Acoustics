/* ==========================================================================
   Master Class M30 — Connecting studio and control room without losing
   isolation: tie-lines, cable pathways, panels, talkback and the standards
   behind them. Practical, illustrated, own words.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|build|do|link/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  /* ---------- diagrams ---------- */
  const SVG_PROBLEM = `<svg class="gsvg" viewBox="0 0 640 250" role="img" aria-label="Every cable is a hole in the wall">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">Every cable that crosses the wall is a hole in it</text>
    <rect x="20" y="34" width="250" height="150" fill="color-mix(in srgb, var(--good) 8%, var(--panel))" stroke="var(--text)" stroke-width="3"/>
    <rect x="370" y="34" width="250" height="150" fill="color-mix(in srgb, var(--bad) 8%, var(--panel))" stroke="var(--text)" stroke-width="3"/>
    <text x="145" y="58" text-anchor="middle" font-size="12" font-weight="700">Control room</text><text x="495" y="58" text-anchor="middle" font-size="12" font-weight="700">Studio / live room</text>
    <rect x="270" y="34" width="22" height="150" fill="var(--muted)"/><rect x="348" y="34" width="22" height="150" fill="var(--muted)"/>
    <rect x="292" y="34" width="56" height="150" fill="var(--c4)" opacity=".35"/>
    <text x="320" y="200" text-anchor="middle" font-size="10" fill="var(--muted)">two leaves + cavity</text>
    <path d="M250 110 H390" stroke="var(--text)" stroke-width="7"/><path d="M250 110 H390" stroke="var(--panel)" stroke-width="3"/>
    <rect x="236" y="92" width="16" height="36" rx="3" fill="var(--panel2)" stroke="var(--text)"/><rect x="388" y="92" width="16" height="36" rx="3" fill="var(--panel2)" stroke="var(--text)"/>
    <g class="lock-wave"><circle cx="430" cy="110" r="14" fill="none" stroke="var(--bad)" stroke-width="3"/></g>
    <path class="leak-pulse" d="M232 96 q-18 14 0 28" fill="none" stroke="var(--bad)" stroke-width="3"/>
    <path class="leak-pulse" d="M218 88 q-26 22 0 44" fill="none" stroke="var(--bad)" stroke-width="2"/>
    <text x="145" y="150" text-anchor="middle" font-size="10" fill="var(--bad)">drums heard through the wall box</text>
    <g font-size="10">
      <circle cx="40" cy="222" r="5" fill="var(--accent)"/><text x="50" y="226">audio (mic, line, digital)</text>
      <circle cx="200" cy="222" r="5" fill="var(--c4)"/><text x="210" y="226">cue &amp; talkback</text>
      <circle cx="320" cy="222" r="5" fill="var(--warn)"/><text x="330" y="226">sight: window / video</text>
      <circle cx="470" cy="222" r="5" fill="var(--good)"/><text x="480" y="226">data &amp; control</text>
      <circle cx="40" cy="242" r="5" fill="var(--bad)"/><text x="50" y="246">power — its own separate route</text>
      <circle cx="320" cy="242" r="5" fill="var(--c3)"/><text x="330" y="246">air — separate silenced ducts per room</text>
    </g>
  </svg>`;

  const pathCell = (x, title, good, body, note) => `<g transform="translate(${x} 0)">
      <text x="150" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="var(--${good ? 'good' : 'bad'})">${good ? '✓' : '✗'} ${title}</text>
      <rect x="100" y="28" width="18" height="150" fill="var(--muted)"/><rect x="182" y="28" width="18" height="150" fill="var(--muted)"/>
      <rect x="118" y="28" width="64" height="150" fill="var(--c4)" opacity=".3"/>
      ${body}
      <text x="150" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">${note}</text></g>`;
  const SVG_PATHS = `<svg class="gsvg" viewBox="0 0 640 205" role="img" aria-label="Bad and good cable pathways through a double wall">
    ${pathCell(0, 'Back-to-back boxes', false, `
      <rect x="84" y="86" width="18" height="34" rx="3" fill="var(--panel2)" stroke="var(--text)"/><rect x="198" y="86" width="18" height="34" rx="3" fill="var(--panel2)" stroke="var(--text)"/>
      <path d="M100 103 H200" stroke="var(--text)" stroke-width="6"/><path d="M100 103 H200" stroke="var(--panel)" stroke-width="2"/>
      <path class="leak-pulse" d="M80 90 q-16 13 0 26" fill="none" stroke="var(--bad)" stroke-width="3"/><path class="leak-pulse" d="M66 82 q-24 21 0 42" fill="none" stroke="var(--bad)" stroke-width="2"/>
      <text x="226" y="140" font-size="10" fill="var(--bad)">straight,</text><text x="226" y="152" font-size="10" fill="var(--bad)">open, rigid</text>`, 'a short tube between the rooms')}
    ${pathCell(320, 'Offset panels, sealed conduit', true, `
      <rect x="84" y="46" width="18" height="34" rx="3" fill="var(--panel2)" stroke="var(--text)"/><rect x="198" y="128" width="18" height="34" rx="3" fill="var(--panel2)" stroke="var(--text)"/>
      <path d="M100 63 H130 C150 63 150 145 170 145 H200" fill="none" stroke="var(--text)" stroke-width="6"/><path d="M100 63 H130 C150 63 150 145 170 145 H200" fill="none" stroke="var(--panel)" stroke-width="2"/>
      <path d="M132 70 C150 80 150 130 168 138" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3"/>
      <circle class="seal-squish" cx="109" cy="63" r="7" fill="var(--good)"/><circle class="seal-squish" cx="191" cy="145" r="7" fill="var(--good)"/>
      <text x="50" y="120" text-anchor="middle" font-size="10" fill="var(--good)">putty seal</text><text x="50" y="132" text-anchor="middle" font-size="10" fill="var(--good)">at each leaf</text>
      <text x="230" y="100" font-size="10" fill="var(--accent)">flexible</text><text x="230" y="112" font-size="10" fill="var(--accent)">section</text>`, 'long, bent, packed, decoupled')}
  </svg>`;

  const SVG_DIST = `<svg class="gsvg" viewBox="0 0 640 170" role="img" aria-label="Choosing the link by distance">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">How far apart are the rooms? The distance picks the technology</text>
    <rect x="20" y="40" width="150" height="46" fill="var(--good)" opacity=".25"/><rect x="170" y="40" width="190" height="46" fill="var(--warn)" opacity=".25"/><rect x="360" y="40" width="130" height="46" fill="var(--accent2)" opacity=".25"/><rect x="490" y="40" width="130" height="46" fill="var(--c3)" opacity=".3"/>
    <line x1="20" y1="86" x2="620" y2="86" stroke="var(--text)" stroke-width="2"/>
    ${[[20, '0'], [170, '15 m'], [360, '100 m'], [490, 'other building']].map(([x, l]) => `<line x1="${x}" y1="80" x2="${x}" y2="94" stroke="var(--text)"/><text x="${x}" y="108" font-size="10" text-anchor="${x === 20 ? 'start' : 'middle'}">${l}</text>`).join('')}
    <text x="95" y="60" text-anchor="middle" font-size="11" font-weight="700">Analogue multicore</text><text x="95" y="76" text-anchor="middle" font-size="10">simple, zero latency</text>
    <text x="265" y="60" text-anchor="middle" font-size="11" font-weight="700">Stage box + network</text><text x="265" y="76" text-anchor="middle" font-size="10">preamps near the mics</text>
    <text x="425" y="60" text-anchor="middle" font-size="11" font-weight="700">Fibre between switches</text><text x="425" y="76" text-anchor="middle" font-size="10">or MADI on fibre</text>
    <text x="555" y="60" text-anchor="middle" font-size="11" font-weight="700">Fibre only</text><text x="555" y="76" text-anchor="middle" font-size="10">no copper earth link</text>
    <g class="lock-wave"><circle cx="40" cy="140" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/></g>
    <text x="60" y="144" font-size="10" fill="var(--muted)">Copper carries signal and earth; glass carries only light — that is why fibre also cures hum between buildings.</text>
  </svg>`;

  const xlr = (x, y, c) => `<circle cx="${x}" cy="${y}" r="9" fill="var(--panel)" stroke="var(--${c})" stroke-width="2.5"/><circle cx="${x - 3}" cy="${y - 2}" r="1.3" fill="var(--text)"/><circle cx="${x + 3}" cy="${y - 2}" r="1.3" fill="var(--text)"/><circle cx="${x}" cy="${y + 3}" r="1.3" fill="var(--text)"/>`;
  const SVG_PANEL = `<svg class="gsvg" viewBox="0 0 640 210" role="img" aria-label="A studio wall panel layout">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">A studio-side wall panel, laid out by signal level</text>
    <rect x="30" y="30" width="580" height="140" rx="8" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/>
    <text x="48" y="50" font-size="10" font-weight="700" fill="var(--accent)">MIC LINES 1–12 (to control room)</text>
    ${Array.from({ length: 12 }, (_, i) => xlr(54 + (i % 6) * 30, 68 + Math.floor(i / 6) * 28, 'accent') + `<text x="${54 + (i % 6) * 30}" y="${86 + Math.floor(i / 6) * 28}" font-size="7" text-anchor="middle">${i + 1}</text>`).join('')}
    <text x="250" y="50" font-size="10" font-weight="700" fill="var(--accent2)">LINE RETURNS / CUE</text>
    ${Array.from({ length: 4 }, (_, i) => xlr(258 + i * 30, 68, 'accent2')).join('')}
    <text x="250" y="104" font-size="10" font-weight="700" fill="var(--c4)">INSTRUMENT / RE-AMP</text>
    ${[0, 1].map((i) => `<circle cx="${258 + i * 30}" cy="124" r="8" fill="var(--panel)" stroke="var(--c4)" stroke-width="2.5"/><circle cx="${258 + i * 30}" cy="124" r="2.5" fill="var(--text)"/>`).join('')}
    <text x="400" y="50" font-size="10" font-weight="700" fill="var(--good)">NETWORK (Cat 6A)</text>
    ${[0, 1, 2, 3].map((i) => `<rect x="${400 + i * 28}" y="60" width="20" height="16" rx="2" fill="var(--panel)" stroke="var(--good)" stroke-width="2"/>`).join('')}
    <text x="400" y="104" font-size="10" font-weight="700" fill="var(--warn)">VIDEO / CLOCK (BNC)</text>
    ${[0, 1, 2].map((i) => `<circle cx="${410 + i * 28}" cy="124" r="7" fill="var(--panel)" stroke="var(--warn)" stroke-width="2.5"/>`).join('')}
    <text x="530" y="50" font-size="10" font-weight="700" fill="var(--c3)">FIBRE</text>
    <rect x="530" y="60" width="26" height="14" rx="2" fill="var(--panel)" stroke="var(--c3)" stroke-width="2"/>
    <text x="48" y="160" font-size="9" fill="var(--muted)">Label every socket with the same number at both ends. Leave blank plates for expansion.</text>
    <rect x="30" y="182" width="120" height="18" rx="4" fill="var(--bad)" opacity=".2"/><text x="90" y="195" text-anchor="middle" font-size="10" fill="var(--bad)">mains: separate box</text>
    <text x="160" y="195" font-size="10" fill="var(--muted)">at least 300 mm away, its own conduit, crossing audio at 90°</text>
  </svg>`;

  const SVG_CUE = `<svg class="gsvg" viewBox="0 0 640 190" role="img" aria-label="Talkback and cue loop between rooms">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">The human connection: talkback, cue, sight and the red light</text>
    <rect x="20" y="34" width="230" height="130" rx="8" fill="color-mix(in srgb, var(--good) 8%, var(--panel))" stroke="var(--text)" stroke-width="2"/>
    <rect x="390" y="34" width="230" height="130" rx="8" fill="color-mix(in srgb, var(--bad) 8%, var(--panel))" stroke="var(--text)" stroke-width="2"/>
    <text x="135" y="54" text-anchor="middle" font-size="11" font-weight="700">Control room</text><text x="505" y="54" text-anchor="middle" font-size="11" font-weight="700">Studio</text>
    <rect x="60" y="80" width="80" height="40" rx="5" fill="var(--panel2)" stroke="var(--text)"/><text x="100" y="98" text-anchor="middle" font-size="10">console /</text><text x="100" y="111" text-anchor="middle" font-size="10">interface</text>
    <rect x="470" y="70" width="90" height="26" rx="5" fill="var(--panel2)" stroke="var(--c4)"/><text x="515" y="87" text-anchor="middle" font-size="10">headphone amp</text>
    <circle cx="515" cy="130" r="12" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/><text x="515" y="134" text-anchor="middle" font-size="9">mic</text>
    <path d="M140 90 H470" stroke="var(--c4)" stroke-width="2.5" stroke-dasharray="7 5" class="leak-pulse"/><text x="305" y="84" text-anchor="middle" font-size="10" fill="var(--c4)">cue mix + talkback → (line level or network)</text>
    <path d="M503 130 H140" stroke="var(--accent)" stroke-width="2.5"/><text x="305" y="146" text-anchor="middle" font-size="10" fill="var(--accent)">← microphone lines</text>
    <rect x="290" y="100" width="60" height="20" fill="var(--c3)" opacity=".35" stroke="var(--c3)"/><text x="320" y="114" text-anchor="middle" font-size="9">window / camera</text>
    <circle class="hot" cx="590" cy="48" r="7" fill="var(--bad)"/><text x="578" y="52" text-anchor="end" font-size="9" fill="var(--bad)">REC light</text>
    <text x="320" y="182" text-anchor="middle" font-size="10" fill="var(--muted)">Amplify headphones in the studio; never send headphone-level audio down a long line next to mic cables.</text>
  </svg>`;

  const L = {
    id: 'm-connect', n: 'M30', track: 'master', title: 'Connecting Studio and Control Room Without Losing Isolation: Tie-lines, Pathways & Standards', level: 'Advanced', mins: 50,
    summary: 'What has to cross between the rooms, which cables and connectors carry it, how far each can run, how to take them through an isolation wall without a leak, and the industry standards that make it all plug together.',
    tags: ['tie-lines', 'wall box', 'conduit', 'multicore', 'stage box', 'Dante', 'AES67', 'MADI', 'fibre', 'talkback', 'cue', 'patchbay', 'AES48', 'cable schedule'],
    sections: [
      { h: 'The problem in one picture', html: `
        <p class="lead">You spent the budget on a 65 dB wall — and then you have to push forty cables through it. Each one is a hole. The art of tie-lines is getting <b>signals across and sound not across</b>.</p>
        ${SVG_PROBLEM}
        ${flow([['List what must cross', 'audio, cue, video, data'], ['Pick the carrier', 'analogue, digital, network, fibre'], ['Choose the pathway', 'offset, bent, packed, sealed'], ['Keep leaves apart', 'no rigid pipe bridging the cavity'], ['Seal & test', 'putty, then pink noise'], ['Document', 'labels + cable schedule']])}
        <div class="callout data"><b>Scale of the risk:</b> a single open 25 mm hole in a 12 m² wall rated 65 dB pulls it down to roughly 45 dB. A sealed, bent conduit costs you almost nothing. The difference is a handful of putty and ten minutes of planning.</div>` },
      { h: 'What connects the rooms', html: `
        <div class="table-wrap"><table><tr><th>Connection</th><th>Cable</th><th>Connector</th><th>Comfortable run</th><th>Notes</th></tr>
          <tr><td><b>Microphone lines</b> (analogue)</td><td>Shielded twisted pair or star-quad multicore</td><td>XLR-3, pin 2 hot</td><td>≈ 100 m</td><td>Balanced, phantom power on the same pair. Further than that: put the preamps near the mics.</td></tr>
          <tr><td><b>Line tie-lines</b> (analogue)</td><td>Shielded twisted-pair multicore</td><td>XLR, TRS or 25-pin D-sub</td><td>≈ 300 m</td><td>Balanced +4 dBu; 8 channels per D-sub loom.</td></tr>
          <tr><td><b>Instrument / DI / re-amp</b></td><td>Convert at the source, then use a balanced line</td><td>DI box → XLR; re-amp box → jack</td><td>Hi-Z cable itself ≈ 5–6 m</td><td>Never run a guitar-level, high-impedance signal through the wall: it loses treble and picks up hum.</td></tr>
          <tr><td><b>AES3 digital</b></td><td>110 Ω twisted pair, or 75 Ω coax</td><td>XLR-3 / BNC</td><td>≈ 100 m on pair; several hundred m on coax</td><td>Two channels per cable; needs the right impedance cable.</td></tr>
          <tr><td><b>MADI</b></td><td>75 Ω coax or optical fibre</td><td>BNC / SC</td><td>≈ 100 m coax; up to 2 km multimode fibre</td><td>64 channels on one cable.</td></tr>
          <tr><td><b>Audio network</b> (Dante, AES67, ST 2110-30)</td><td>Cat 6A; fibre between switches</td><td>RJ45 / locking RJ45 / LC</td><td>100 m per copper link</td><td>Hundreds of channels both ways; 90 m fixed cable + patch leads.</td></tr>
          <tr><td><b>Headphone cue & talkback</b></td><td>Line-level pairs or Cat cable</td><td>XLR / RJ45</td><td>≈ 150 m at line level</td><td>Amplify in the studio; personal mixers over the network.</td></tr>
          <tr><td><b>Foldback loudspeakers</b></td><td>Heavy two-core, away from mic lines</td><td>Locking speaker connector / terminals</td><td>≈ 30 m</td><td>Better: powered speakers fed at line level.</td></tr>
          <tr><td><b>Video</b> (screens, camera)</td><td>SDI coax, HDBaseT on Cat 6A, or fibre</td><td>BNC / RJ45</td><td>≈ 70 m</td><td>Passive HDMI only ≈ 10–15 m.</td></tr>
          <tr><td><b>Control</b> (USB, KVM, MIDI)</td><td>Active or fibre extenders</td><td>USB · 5-pin DIN</td><td>USB ≈ 3–5 m passive; MIDI ≈ 15 m</td><td>Or keep the computer in a machine room and extend keyboard/video/mouse.</td></tr>
          <tr><td><b>Word clock / sync</b></td><td>75 Ω coax, terminated once</td><td>BNC</td><td>≈ 50 m</td><td>Star from a master clock.</td></tr></table></div>
        <div class="uc-grid">
          ${uc('🪟', 'The visual link', [['Window', 'Instant, no latency, but the biggest weak spot in the wall — two panes, wide gap (see the windows course).'], ['Camera + screen', 'No hole in the wall; a frame or two of delay; works for rooms far apart.']])}
          ${uc('🗣️', 'The human link', [['Talkback', 'A mic in the control room routed to the cue mix, muted during takes.'], ['Listen-back', 'A room mic in the studio so the engineer hears the players between takes.'], ['Red light / tally', 'A low-voltage signal that says “recording”.']], '#c7772b')}
        </div>
        <div class="callout mentor">Count what you need today, then add <b>30–50 % spare</b> lines and at least one empty conduit with a draw-wire. Pulling a cable through a finished isolation wall later is the most expensive cable you will ever buy.</div>` },
      { h: 'Pathways that keep the isolation', html: `
        ${SVG_PATHS}
        <div class="table-wrap"><table><tr><th>Rule</th><th>Why</th></tr>
          <tr><td><b>Offset the panels</b> — never back-to-back; at least one stud bay (≈ 400–600 mm) apart, more is better</td><td>A straight tube between two boxes is a speaking tube.</td></tr>
          <tr><td><b>Penetrate each leaf separately</b> and seal each penetration</td><td>Two seals in series; a leak in one is blocked by the other.</td></tr>
          <tr><td><b>Flexible section across the cavity</b> (flexible conduit or loose cable loop)</td><td>A rigid pipe ties the two leaves together and carries vibration across.</td></tr>
          <tr><td><b>Bends</b> in the route (two or more)</td><td>Sound loses energy at every lined bend; signals do not care.</td></tr>
          <tr><td><b>Pack the conduit</b>: mineral wool along its length, removable acoustic putty at both ends</td><td>Airtight, yet you can pull another cable next year.</td></tr>
          <tr><td><b>Several small conduits</b> rather than one huge one; fill unused ones</td><td>Smaller holes are easier to seal; separates mic, line/data and video.</td></tr>
          <tr><td><b>Back boxes</b>: heavy (steel or lined timber), wrapped with putty pads, sealed to the board</td><td>A thin plastic box is a hole with a lid.</td></tr>
          <tr><td><b>Floor trench or duct</b> with a sand or putty seal where it passes under each wall</td><td>Great for consoles; must be closed at every room boundary.</td></tr>
          <tr><td><b>Route over the sound lock</b> when you can</td><td>The cable leaves one room into the lobby and enters the other from it: two sealed penetrations, far apart.</td></tr></table></div>
        <div class="callout safety">Holes through walls and floors may need tested fire-stopping, and mains cables have their own rules. Check your local building and electrical codes; use a licensed electrician for anything carrying mains.</div>
        <p>Try it: choose the signals you need, set the distance, then change how the cables cross the wall and watch the isolation figure.</p>`, viz: 'tieLines' },
      { h: 'Next door, down the corridor, or another building?', html: `
        ${SVG_DIST}
        <div class="table-wrap"><table><tr><th>Situation</th><th>Best carrier</th><th>Why</th><th>Watch out for</th></tr>
          <tr><td><b>Adjacent rooms</b> (≤ 15 m of cable)</td><td>Analogue mic/line multicore + a couple of Cat 6A lines</td><td>Simple, repairable, no latency, no clocks</td><td>The wall penetration; panel offset</td></tr>
          <tr><td><b>Same building, 15–100 m</b> (other floor, end of corridor)</td><td>Stage box with preamps in the studio + audio network; analogue only for a few critical lines</td><td>Short mic cables, hundreds of channels on two cables, easy re-routing</td><td>Network latency in cue mixes (keep total round trip under ≈ 5–10 ms); a proper switch; spare link</td></tr>
          <tr><td><b>Over 100 m</b></td><td>Fibre between network switches, or MADI on fibre</td><td>Copper Ethernet stops at 100 m; fibre runs kilometres</td><td>Fibre type (single-mode vs multimode) must match the transceivers</td></tr>
          <tr><td><b>Different building or different electrical supply</b></td><td>Fibre for everything; transformer isolation on any analogue line you must keep</td><td>The two earths are at different voltages — copper would carry hum current, and in a fault or lightning event, danger</td><td>Never rely on audio shields to bond two buildings</td></tr>
          <tr><td><b>Machine room in between</b></td><td>Both rooms tie to the racks; the patchbay lives there</td><td>Noisy computers and converters out of both rooms; one central star point</td><td>Cooling and a silent path for KVM/video</td></tr></table></div>
        <div class="callout physics"><b>Latency in plain numbers:</b> analogue is effectively instant. A well-set audio network adds about 0.25–2 ms each way; each AD or DA conversion roughly 0.5–1.5 ms. Singers start to notice their own voice in headphones as “doubled” somewhere above about 5–10 ms in total.</div>
        <p>Hum after linking two rooms is almost always a ground loop or a pin-1 problem — see <a href="#/academy/a-ground">Hum, Buzz & Grounding</a>. Power both rooms’ audio equipment from the same technical-power source where you can, and route the tie-lines beside that power route.</p>` },
      { h: 'Wall boxes, panels and patchbays', html: `
        ${SVG_PANEL}
        <ul>
          <li><b>Group by level:</b> microphone level, line level, digital/data and video in separate blocks — and separate conduits behind them.</li>
          <li><b>Connector convention:</b> signal flows <i>out of pins</i>. On XLR, outputs are male and inputs female — so a studio wall panel that <i>receives</i> microphones has female sockets, and a cue <i>send</i> into the studio appears there on a male.</li>
          <li><b>Number everything identically</b> at both ends and on the cable itself (wrap-around labels 50 mm from each connector).</li>
          <li><b>Patchbay normalling:</b> the everyday route is wired through (“normalled”) so nothing needs patching for a standard session; inserting a patch cord breaks or taps it (full-normal / half-normal).</li>
          <li><b>Shields:</b> bond to the chassis/panel at the connector (AES48 practice); do not join pin 1 to the connector shell lug inside cable-mounted plugs unless the system design calls for it.</li>
          <li><b>Isolated panel sockets</b> for coax (BNC) and data so they do not make accidental earth connections through the plate.</li>
        </ul>
        <div class="callout data"><b>Separation rules of thumb:</b> microphone cables ≥ 300 mm from parallel mains runs (more for dimmer or motor circuits), ≥ 100 mm from loudspeaker lines; cross mains at 90°. Yet keep the audio route <i>alongside the technical power that feeds the same gear</i> in its own conduit — close but separated — to keep ground-loop area small.</div>` },
      { h: 'Talkback, cue and sight lines', html: `
        ${SVG_CUE}
        <div class="uc-grid">
          ${uc('🎧', 'Cue (headphone) mixes', [['Simple', 'One or two stereo mixes from the console to a headphone amplifier in the studio.'], ['Better', 'Personal mixers: each player balances “more me” from 8–16 stems sent over one Cat cable.'], ['Rule', 'Zero-latency (analogue or direct) monitoring for singers and drummers.']])}
          ${uc('🎙️', 'Talkback', [['Do', 'Dedicated mic and a latching/momentary button; auto-dim the control-room speakers so it does not feed back.'], ['And', 'A listen-back mic in the studio, ducked while recording.']], '#7a5cc7')}
          ${uc('🔴', 'Red light / tally', [['Do', 'Low-voltage relay from the recorder’s record status to lamps outside each door and inside the studio.'], ['Why', 'Stops people opening a sound-lock door mid-take.']], '#c7772b')}
          ${uc('📹', 'Window or camera?', [['Window', 'Natural eye contact; costs isolation and wall space.'], ['Camera', 'Free placement, rooms can be far apart; check the delay — a conductor’s beat on a slow display is useless.']], '#2b9fc7')}
        </div>
        <div class="callout warn">Headphone-level cue signals and loudspeaker lines are thousands of times stronger than microphone signals. Bundled together for 20 m, the click track turns up in the vocal mic channel. Keep them in different cables and different conduits.</div>` },
      { h: 'The industry standards behind the plugs', html: `
        <div class="table-wrap"><table><tr><th>Standard</th><th>What it says, in one sentence</th><th>What it means for your wiring</th></tr>
          <tr><td><b>AES48</b></td><td>Cable shields of balanced equipment connect to the chassis, not to the circuit’s signal ground.</td><td>Buy compliant gear and bond shields at the panel: no “pin-1 problem”, shields can be connected at both ends.</td></tr>
          <tr><td><b>AES14</b></td><td>XLR-3 polarity: pin 1 shield, pin 2 positive (“hot”), pin 3 negative.</td><td>Wire every cable the same way and absolute polarity is preserved end to end.</td></tr>
          <tr><td><b>AES59</b></td><td>Pin assignment for 8 balanced channels on a 25-pin D-sub connector.</td><td>Looms from different makers are interchangeable; check older gear that predates it.</td></tr>
          <tr><td><b>IEC 60268-12</b></td><td>Which connectors are used for which professional audio interfaces, and how they are wired.</td><td>The reason XLR, jack and loudspeaker connectors are consistent between manufacturers.</td></tr>
          <tr><td><b>IEC 61938</b></td><td>Defines analogue interface practice including phantom power (P48: 48 V through matched resistors on pins 2 and 3).</td><td>Phantom travels on normal balanced mic lines; both conductors must be intact and balanced.</td></tr>
          <tr><td><b>AES3</b> (IEC 60958-4)</td><td>Two-channel digital audio on 110 Ω balanced pair; AES-3id is the 75 Ω coax variant.</td><td>Use true 110 Ω cable, not ordinary mic cable, for long runs.</td></tr>
          <tr><td><b>AES10</b></td><td>MADI: up to 64 channels on one coax or fibre.</td><td>One thin cable replaces a 64-way multicore; fibre gives electrical isolation.</td></tr>
          <tr><td><b>AES11</b></td><td>How digital audio equipment is synchronised to a common reference.</td><td>One master clock; everything else follows it.</td></tr>
          <tr><td><b>AES67</b> · <b>SMPTE ST 2110-30</b></td><td>A common way to send uncompressed audio over IP networks so different systems interoperate.</td><td>Network audio products from different families can exchange streams when set to these modes.</td></tr>
          <tr><td><b>ISO/IEC 11801</b> · <b>TIA-568</b></td><td>Structured cabling: cable categories, connectors, the 100 m channel limit, testing.</td><td>Install Cat 6A as permanent links (≤ 90 m) to wall sockets, patch with short leads, and have links certified.</td></tr>
          <tr><td><b>EBU R 68</b> · <b>SMPTE RP 155</b></td><td>Alignment levels between analogue and digital: EBU −18 dBFS = 0 dBu; SMPTE −20 dBFS = +4 dBu.</td><td>Agree one reference for the whole facility so every converter lines up.</td></tr>
          <tr><td><b>IEC 60364</b> · <b>BS 7671</b> · <b>NEC</b></td><td>Electrical installation rules: earthing, protection, segregation of circuits.</td><td>Mains wiring by a licensed electrician; audio stays in separate containment.</td></tr></table></div>
        <p>For the acoustic and building standards (ISO 717, ISO 16283, BS 8233 …) see <a href="#/academy/m-standards">Acoustic Standards Explained</a>.</p>` },
      { h: 'Step by step: planning the tie-line system', html: `
        ${flow([['Count', 'channels per type, both directions'], ['Add spare', '30–50 % + an empty conduit'], ['Draw the route', 'on the plan, with lengths'], ['Pick the pathway', 'offset panels, trench or over the lobby'], ['Specify panels', 'layout, labels, back boxes'], ['Pull before boarding', 'photograph the open wall'], ['Seal', 'wool + putty at both leaves'], ['Test & document', 'continuity, polarity, pink noise, schedule']])}
        <div class="table-wrap"><table><tr><th>Cable ID</th><th>From</th><th>To</th><th>Signal</th><th>Cable type</th><th>Length</th><th>Conduit</th><th>Tested</th></tr>
          <tr><td>M01–M12</td><td>Studio panel SP1, XLR-F 1–12</td><td>Patchbay A, rows 1–12</td><td>Mic</td><td>12-pair star-quad multicore</td><td>14 m</td><td>C1 (mic only)</td><td>✓ polarity</td></tr>
          <tr><td>L01–L04</td><td>Patchbay B 1–4</td><td>SP1, XLR-M 13–16</td><td>Cue / line returns</td><td>4-pair shielded multicore</td><td>14 m</td><td>C2</td><td>✓</td></tr>
          <tr><td>N01–N04</td><td>Switch port 9–12</td><td>SP1, RJ45 1–4</td><td>Audio network / personal mixers</td><td>Cat 6A F/UTP</td><td>16 m</td><td>C2</td><td>✓ certified</td></tr>
          <tr><td>V01</td><td>Video router out 3</td><td>SP1, BNC 1</td><td>Video to studio screen</td><td>75 Ω SDI coax</td><td>16 m</td><td>C3</td><td>✓</td></tr>
          <tr><td>—</td><td colspan="5">Spare conduit C4 with draw-wire, both ends sealed with putty</td><td>C4</td><td>—</td></tr></table></div>
        <div class="callout example"><b>Commissioning test:</b> play pink noise loudly in the studio, close everything, and listen at each control-room wall box with your ear (or a phone SPL app held at the plate). Any box that is clearly louder than the plain wall beside it needs more putty or a heavier back box.</div>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🏠', 'Home studio with a booth next door', [['Need', '4 mic lines, 1 headphone feed, 1 screen'], ['Link', 'A 4-pair multicore and one Cat 6A in a 32 mm conduit; panels 600 mm apart; putty both ends'], ['Result', 'Wall stays within ≈ 1 dB of its design; total parts cost is small']])}
          ${uc('🏢', 'Control room and live room on different floors', [['Need', '24 mics, 8 cue stems, video both ways'], ['Link', 'Stage box in the live room, two Cat 6A (main + spare) and one SDI coax through a sealed riser sleeve at each floor'], ['Result', 'Mic cables stay under 10 m; riser penetrations fire-stopped and acoustically sealed']], '#7a5cc7')}
          ${uc('🏫', 'School: studio wing 60 m from the control room', [['Need', 'Flexible use of three practice rooms as recording spaces'], ['Link', 'Structured Cat 6A to a wall plate in each room, portable network stage box, analogue only for talkback'], ['Result', 'Any room becomes “the studio” by plugging in one box']], '#c7a12b')}
          ${uc('🏭', 'Two buildings', [['Need', 'Concert hall to a recording suite across a courtyard'], ['Link', 'Duplex fibre (plus spare pair) in a buried duct; network switches or MADI at each end; no copper audio between buildings'], ['Result', 'No hum from earth-potential differences, kilometres of reach']], '#2b9fc7')}
          ${uc('🚐', 'Mobile / outside-broadcast truck to a hall', [['Need', 'Fast, repeatable hook-up without propping doors open'], ['Link', 'Permanent tie panel on the outside wall wired to the stage: fibre + a few transformer-isolated analogue lines; weatherproof, lockable'], ['Result', 'Doors stay shut during the concert; isolation and security kept']], '#4c9a3a')}
        </div>` },
      { h: 'Problems & solutions, and mistakes to avoid', html: `
        <div class="table-wrap"><table><tr><th>Problem</th><th>Likely cause</th><th>Solution</th></tr>
          <tr><td>Hum appears as soon as the rooms are linked</td><td>Ground loop between two power sources; pin-1 problem in a device</td><td>Same technical power for both rooms; route audio beside it; transformer isolation or fibre; AES48 gear</td></tr>
          <tr><td>You can hear the drummer at the control-room wall box</td><td>Back-to-back boxes, open conduit, light plastic back box</td><td>Pack and putty the conduit; putty pads on the box; relocate one panel to offset</td></tr>
          <tr><td>Click track audible on mic channels</td><td>Cue or speaker lines bundled with mic lines</td><td>Separate cables and conduits; send cue at line level and amplify locally</td></tr>
          <tr><td>HDMI picture drops out</td><td>Passive cable too long; bent sharply in the conduit</td><td>HDBaseT / SDI / fibre extender; pull pre-terminated cable gently or terminate after pulling</td></tr>
          <tr><td>Network audio clicks or drops</td><td>Unsuitable switch settings, energy-saving ports, damaged cable, clock master conflict</td><td>Use a switch set up for audio (no energy-efficient Ethernet, QoS as the protocol recommends); certify the link; one clock master</td></tr>
          <tr><td>Singer complains of an “echo” in headphones</td><td>Monitoring through the computer with a large buffer</td><td>Direct/zero-latency monitoring path for the performer</td></tr>
          <tr><td>Not enough lines a year later</td><td>No spare capacity planned</td><td>Use the spare conduit; add a network stage box instead of more copper</td></tr></table></div>
        ${myth([
          ['“Digital means the wall penetration doesn’t matter.”', 'One Cat cable still needs a hole. It is a smaller hole — seal it just the same.'],
          ['“Lift the shield at one end of every tie-line to stop hum.”', 'A workaround that lets radio interference in. Fix the earthing and use compliant equipment.'],
          ['“A big 100 mm pipe makes future pulls easy.”', 'And makes a perfect sound duct. Use several small conduits, packed and sealed.'],
          ['“Expanding foam seals the conduit.”', 'It is light, rigid and permanent: poor isolation and no future pulls. Use mineral wool and non-setting putty.'],
        ])}
        <p>Related: <a href="#/academy/m-lowvolt">Audio & Low-Voltage Wiring</a> · <a href="#/academy/m-electrical">Electrical Wiring & Grounding</a> · <a href="#/academy/m-door-build">Doors, Seals & Studio Windows</a> · <a href="#/systems">Signal Flow & Networks</a>.</p>` },
    ],
    quiz: [
      { q: 'Why should the wall panels on each side of an isolation wall never be back-to-back?', opts: ['It looks untidy', 'The straight path between them is a short sound duct', 'Cables get too short', 'It causes ground loops'], a: 1, why: 'Offset panels with a bent, packed conduit force sound through seals and absorber.' },
      { q: 'The studio is 80 m of cable away from the control room. Best plan for 24 microphones?', opts: ['24 long guitar cables', 'A stage box with preamps in the studio and an audio network link', 'Unbalanced multicore', 'Headphone extension leads'], a: 1, why: 'Keep mic cables short; send audio digitally over Cat 6A (≤ 100 m) or fibre.' },
      { q: 'Two buildings on different electrical supplies must be linked. Which is safest and quietest?', opts: ['Copper multicore with all shields joined', 'Optical fibre', 'Speaker cable', 'Coax with the screen earthed at both ends'], a: 1, why: 'Fibre carries no earth current, so no hum and no fault path between buildings.' },
      { q: 'What does AES48 require?', opts: ['Pin 3 hot on XLRs', 'Shields bonded to the equipment chassis, not signal ground', '75 Ω cable for microphones', 'Fibre for all tie-lines'], a: 1, why: 'It removes the pin-1 problem so shields can be connected at both ends without hum.' },
      { q: 'What is the right way to close a conduit you may need again?', opts: ['Expanding foam', 'Leave it open', 'Mineral wool inside and removable acoustic putty at both ends', 'Tape'], a: 2, why: 'Airtight and absorbent now, and you can still pull another cable later.' },
    ],
  };
  window.LESSONS.push(L);
})();
