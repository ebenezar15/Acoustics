/* ==========================================================================
   Master Class M31 — Acoustic standards explained (ISO, IEC, BS and UK rules).
   Plain-language guide; figures are the commonly cited ones — always check
   the current edition with the publisher before relying on them.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|do|use/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;

  /* ---------- diagrams ---------- */
  const SVG_NAME = `<svg class="gsvg" viewBox="0 0 640 170" role="img" aria-label="How to read a standard designation">
    <text x="320" y="18" text-anchor="middle" font-size="13" font-weight="700">Reading a designation</text>
    ${[['BS', 'UK edition', 60, 'var(--c3)'], ['EN', 'European', 160, 'var(--accent2)'], ['ISO', 'international', 260, 'var(--accent)'], ['16283', 'the number', 370, 'var(--text)'], ['-1', 'part 1', 470, 'var(--good)'], [':2014', 'edition year', 570, 'var(--warn)']].map(([t, d, x, c]) => `
      <rect x="${x - 44}" y="44" width="88" height="40" rx="8" fill="var(--panel2)" stroke="${c}" stroke-width="2.5"/>
      <text x="${x}" y="70" text-anchor="middle" font-size="16" font-weight="800" fill="${c}">${t}</text>
      <line x1="${x}" y1="84" x2="${x}" y2="104" stroke="${c}" stroke-dasharray="3 3"/>
      <text x="${x}" y="118" text-anchor="middle" font-size="10">${d}</text>`).join('')}
    <text x="320" y="148" text-anchor="middle" font-size="11" fill="var(--muted)">Same technical text as ISO 16283-1 — only the national cover page differs.</text>
    <text x="320" y="164" text-anchor="middle" font-size="10" fill="var(--muted)">“+A1:2019” after a year means amendment 1 has been merged in.</text>
  </svg>`;

  const SVG_LADDER = `<svg class="gsvg" viewBox="0 0 640 150" role="img" aria-label="From measurement to regulation">
    ${[['Measure', 'ISO 10140 · 16283', 'third-octave curve', 'var(--accent)'], ['Rate', 'ISO 717', 'one number', 'var(--good)'], ['Predict', 'ISO 12354', 'incl. flanking', 'var(--accent2)'], ['Require', 'regs · BS 8233 · brief', 'number to hit', 'var(--c3)']].map(([t, s, d, c], i) => `
      <rect x="${14 + i * 157}" y="30" width="140" height="92" rx="10" fill="var(--panel2)" stroke="${c}" stroke-width="2.5"/>
      <text x="${84 + i * 157}" y="56" text-anchor="middle" font-size="14" font-weight="800" fill="${c}">${t}</text>
      <text x="${84 + i * 157}" y="78" text-anchor="middle" font-size="9.5">${s}</text>
      <text x="${84 + i * 157}" y="100" text-anchor="middle" font-size="9.5" fill="var(--muted)">${d}</text>
      ${i < 3 ? `<path class="leak-pulse" d="M${156 + i * 157} 76 h12 m-5 -5 l5 5 l-5 5" stroke="var(--text)" stroke-width="2" fill="none"/>` : ''}`).join('')}
    <text x="320" y="18" text-anchor="middle" font-size="13" font-weight="700">The ladder: measurement → rating → prediction → requirement</text>
    <text x="320" y="142" text-anchor="middle" font-size="10" fill="var(--muted)">Each standard does one job. Problems start when a number from one rung is used on another.</text>
  </svg>`;

  const SVG_LABFIELD = `<svg class="gsvg" viewBox="0 0 640 250" role="img" aria-label="Laboratory versus field sound insulation test">
    <text x="160" y="18" text-anchor="middle" font-size="12" font-weight="700">Laboratory (ISO 10140) → R</text>
    <text x="480" y="18" text-anchor="middle" font-size="12" font-weight="700">On site (ISO 16283) → R′, D nT</text>
    <rect x="20" y="40" width="120" height="130" fill="var(--panel2)" stroke="var(--text)" stroke-width="5"/>
    <rect x="180" y="40" width="120" height="130" fill="var(--panel2)" stroke="var(--text)" stroke-width="5"/>
    <rect x="140" y="70" width="40" height="70" fill="var(--accent2)"/>
    <text x="160" y="34" text-anchor="middle" font-size="9">test wall</text>
    <text x="80" y="196" text-anchor="middle" font-size="10">source room</text><text x="240" y="196" text-anchor="middle" font-size="10">receiving room</text>
    <g class="lock-wave"><circle cx="80" cy="105" r="14" fill="none" stroke="var(--accent)" stroke-width="3"/></g>
    <path d="M132 105 H188" stroke="var(--accent)" stroke-width="3" marker-end="url(#stdAr)"/>
    <text x="160" y="216" text-anchor="middle" font-size="10" fill="var(--good)">rooms structurally separate:</text><text x="160" y="230" text-anchor="middle" font-size="10" fill="var(--good)">only the sample transmits</text>
    <defs><marker id="stdAr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker><marker id="stdAr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--bad)"/></marker></defs>
    <rect x="350" y="40" width="260" height="130" fill="var(--panel2)" stroke="var(--text)" stroke-width="5"/>
    <rect x="474" y="40" width="12" height="130" fill="var(--accent2)"/>
    <g class="lock-wave"><circle cx="410" cy="105" r="14" fill="none" stroke="var(--accent)" stroke-width="3"/></g>
    <path d="M452 105 H506" stroke="var(--accent)" stroke-width="3" marker-end="url(#stdAr)"/>
    <path class="leak-pulse" d="M430 44 C 460 24, 500 24, 530 44" fill="none" stroke="var(--bad)" stroke-width="2.5" marker-end="url(#stdAr2)"/>
    <path class="leak-pulse" d="M430 166 C 460 186, 500 186, 530 166" fill="none" stroke="var(--bad)" stroke-width="2.5" marker-end="url(#stdAr2)"/>
    <path class="leak-pulse" d="M468 150 q12 8 24 0" fill="none" stroke="var(--bad)" stroke-width="2.5" marker-end="url(#stdAr2)"/>
    <text x="480" y="196" text-anchor="middle" font-size="10">same wall, real building</text>
    <text x="480" y="216" text-anchor="middle" font-size="10" fill="var(--bad)">flanking via floor, ceiling, side walls,</text><text x="480" y="230" text-anchor="middle" font-size="10" fill="var(--bad)">ducts and gaps — typically 5–8 dB less</text>
  </svg>`;

  const hist = Array.from({ length: 64 }, (_, i) => { const x = i * 9.4; let y = 118 - 10 * Math.sin(i * 0.7) - 6 * Math.sin(i * 1.9 + 1); if (i > 17 && i < 23) y -= 50 * Math.sin(((i - 17) / 6) * Math.PI); if (i > 43 && i < 47) y -= 62 * Math.sin(((i - 43) / 4) * Math.PI); return [20 + x, y]; });
  const SVG_LEQ = `<svg class="gsvg" viewBox="0 0 640 190" role="img" aria-label="LAeq, LA90 and LAFmax on a time history">
    <text x="320" y="16" text-anchor="middle" font-size="13" font-weight="700">One noise recording, three different numbers</text>
    <rect x="20" y="26" width="600" height="130" fill="var(--panel2)" stroke="var(--line)"/>
    <path d="${hist.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')}" fill="none" stroke="var(--text)" stroke-width="1.8"/>
    <line x1="20" y1="48" x2="620" y2="48" stroke="var(--bad)" stroke-dasharray="5 4" stroke-width="2"/><text x="26" y="43" paint-order="stroke" stroke="var(--panel2)" stroke-width="4" font-size="10" font-weight="700" fill="var(--bad)">L AFmax — the single loudest moment</text>
    <line x1="20" y1="100" x2="620" y2="100" stroke="var(--accent)" stroke-width="2.5"/><text x="26" y="95" paint-order="stroke" stroke="var(--panel2)" stroke-width="4" font-size="10" font-weight="700" fill="var(--accent)">L Aeq — the energy average</text>
    <line x1="20" y1="130" x2="620" y2="130" stroke="var(--good)" stroke-dasharray="2 4" stroke-width="2"/><text x="26" y="146" paint-order="stroke" stroke="var(--panel2)" stroke-width="4" font-size="10" font-weight="700" fill="var(--good)">L A90 — exceeded 90 % of the time: the “background”</text>
    <text x="210" y="70" font-size="9" fill="var(--muted)">lorry</text><text x="444" y="60" font-size="9" fill="var(--muted)">door slam</text>
    <text x="320" y="176" text-anchor="middle" font-size="10" fill="var(--muted)">time → (always say over how long: L Aeq,8h, L A90,15min …)</text>
  </svg>`;

  const L = {
    id: 'm-standards', n: 'M31', track: 'master', title: 'Acoustic Standards Explained: the ISO and British Standards You Will Actually Meet', level: 'Core', mins: 50,
    summary: 'What the common ISO, IEC and British standards measure, what their numbers mean, which one answers which practical question — and the mistakes people make when they mix them up.',
    tags: ['ISO 3382', 'ISO 354', 'ISO 11654', 'ISO 10140', 'ISO 16283', 'ISO 717', 'ISO 12354', 'BS 8233', 'BS 4142', 'Approved Document E', 'Rw', 'DnT,w', 'Ctr', 'STC', 'LAeq', 'NR', 'NC', 'EBU 3276'],
    sections: [
      { h: 'Why standards matter — and how to read their names', html: `
        <p class="lead">A standard is an agreed recipe: measure <i>this</i> way, describe the result with <i>that</i> number. Without it, two people can test the same wall and honestly report results 10 dB apart. With it, a figure on a data sheet, in a contract or in a regulation means the same thing to everyone.</p>
        ${SVG_NAME}
        <div class="table-wrap"><table><tr><th>Prefix</th><th>Who publishes</th><th>Typical use in acoustics</th></tr>
          <tr><td><b>ISO</b></td><td>International Organization for Standardization</td><td>Most room-acoustic, absorption and sound-insulation methods</td></tr>
          <tr><td><b>IEC</b></td><td>International Electrotechnical Commission</td><td>Instruments: sound level meters, filters, electro-acoustics</td></tr>
          <tr><td><b>EN</b></td><td>European committee (CEN)</td><td>European adoption; EN 12354 = ISO 12354</td></tr>
          <tr><td><b>BS</b></td><td>British Standards Institution (BSI)</td><td>UK guidance and codes of practice (BS 8233, BS 4142 …)</td></tr>
          <tr><td><b>BS EN ISO</b></td><td>BSI, identical text to the ISO</td><td>The UK name of an international standard</td></tr>
          <tr><td><b>ASTM / ANSI</b></td><td>US bodies</td><td>North-American equivalents: E90, E336, E413 (STC), C423, S12.2 (NC)</td></tr></table></div>
        ${SVG_LADDER}
        <div class="callout warn">Standards are revised, renumbered and withdrawn (the old ISO 140 field parts became ISO 16283, for example). The edition years and figures in this course are the commonly cited ones — <b>always check the current edition with the publisher</b> or the authority that is asking for it before you rely on a number.</div>
        <div class="callout mentor">You do not need to own every standard. You need to know which one produced the number in front of you, what conditions it assumed, and whether that matches your question.</div>` },
      { h: 'Standards explorer', html: `
        <p>Filter by job or search for a number or a word. Each card says what the standard does and when you would meet it. The sections that follow explain the important ones in more depth.</p>`, viz: 'standardsExplorer' },
      { h: 'Room acoustics: ISO 3382 and friends', html: `
        ${flow([['Excite the room', 'sweep, noise burst or balloon'], ['Record the decay', 'omni microphone, several positions'], ['Fit the slope', 'per octave or third-octave band'], ['Report', 'T20/T30, EDT … with the method']])}
        <div class="table-wrap"><table><tr><th>Part</th><th>For</th><th>What it tells you</th></tr>
          <tr><td><b>ISO 3382-1</b></td><td>Concert halls, theatres, performance spaces</td><td>Reverberation time plus the “quality” measures below</td></tr>
          <tr><td><b>ISO 3382-2</b></td><td>Ordinary rooms: studios, classrooms, offices, homes</td><td>How to measure reverberation time and how accurate each effort level is</td></tr>
          <tr><td><b>ISO 3382-3</b></td><td>Open-plan offices</td><td>How far speech stays intelligible and distracting</td></tr>
          <tr><td><b>ISO 23591</b></td><td>Music rehearsal rooms</td><td>Recommended volume, height, reverberation and noise by type of ensemble</td></tr></table></div>
        <div class="table-wrap"><table><tr><th>Term</th><th>Plain meaning</th><th>Why you care</th></tr>
          <tr><td><b>RT / T<sub>60</sub></b></td><td>Time for sound to die away by 60 dB</td><td>The basic “liveness” of a room</td></tr>
          <tr><td><b>T<sub>20</sub>, T<sub>30</sub></b></td><td>The same thing, estimated from the first 20 or 30 dB of clean decay (−5 to −25 / −35 dB)</td><td>Real rooms rarely give 60 dB above the noise floor</td></tr>
          <tr><td><b>EDT</b></td><td>Early decay time: slope of the first 10 dB</td><td>Closest to how reverberant it <i>sounds</i></td></tr>
          <tr><td><b>C<sub>50</sub> / C<sub>80</sub></b></td><td>Clarity: early energy (first 50 or 80 ms) against late energy, in dB</td><td>C<sub>50</sub> for speech, C<sub>80</sub> for music</td></tr>
          <tr><td><b>G</b></td><td>Strength: how much louder the room makes a source than open air would</td><td>Whether a hall “carries”</td></tr>
          <tr><td><b>STI</b></td><td>Speech transmission index, 0–1</td><td>Intelligibility; above about 0.6 is good</td></tr></table></div>
        <div class="callout data"><b>ISO 3382-2 effort levels:</b> <i>survey</i> (a quick check, few positions, octave bands), <i>engineering</i> (the normal level for verifying a design) and <i>precision</i> (more source and microphone positions, third-octaves). A report should say which was used.</div>
        <p>Try the fitting yourself in the <a href="#/lab/decay">RT60 decay lab</a>, and see <a href="#/academy/bands">RT60, Octave Bands &amp; the Language of Measurement</a> for the bands and groupings.</p>
        <div class="callout warn">In small rooms, reverberation time below about 200 Hz is really the decay of individual room modes. The standard method still gives a number, but read a waterfall plot alongside it.</div>` },
      { h: 'Absorption and diffusion: what a data sheet is really telling you', html: `
        <div class="table-wrap"><table><tr><th>Standard</th><th>Method</th><th>Result</th><th>Watch out for</th></tr>
          <tr><td><b>ISO 354</b> (US: ASTM C423)</td><td>10–12 m² of product in a reverberation room; decay with and without it</td><td>Absorption coefficient α<sub>s</sub> per third-octave</td><td>Mounting and sample size change the answer; values above 1.0 are a test artefact</td></tr>
          <tr><td><b>ISO 11654</b></td><td>Arithmetic on the ISO 354 curve</td><td>One number α<sub>w</sub> and a class A–E</td><td>Based on 250 Hz–4 kHz: says nothing about bass</td></tr>
          <tr><td><b>ISO 10534-2</b></td><td>Small sample in an impedance tube</td><td>Normal-incidence α and surface impedance</td><td>Lower than room values; not comparable with ISO 354 figures</td></tr>
          <tr><td><b>ISO 9053-1</b></td><td>Steady airflow through a sample</td><td>Airflow resistance / resistivity</td><td>The key input for predicting porous absorbers</td></tr>
          <tr><td><b>ISO 17497-1</b></td><td>Rotating sample in a reverberation room</td><td>Scattering coefficient s (how much is <i>not</i> reflected like a mirror)</td><td>Input for computer models — not a quality score</td></tr>
          <tr><td><b>ISO 17497-2</b></td><td>Polar response in free field</td><td>Diffusion coefficient d (how <i>evenly</i> sound is spread)</td><td>The one that compares diffusers</td></tr></table></div>
        <div class="table-wrap"><table><tr><th>ISO 11654 class</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>Not classified</th></tr>
          <tr><td>α<sub>w</sub></td><td>0.90–1.00</td><td>0.80–0.85</td><td>0.60–0.75</td><td>0.30–0.55</td><td>0.15–0.25</td><td>≤ 0.10</td></tr></table></div>
        <p>A letter in brackets after α<sub>w</sub> — (L), (M) or (H) — is a <b>shape indicator</b>: the product absorbs noticeably more than the reference curve at low, mid or high frequencies. “α<sub>w</sub> 0.60 (L)” is much more interesting for a studio than a plain 0.60.</p>
        ${flow([['Find the method', 'ISO 354? tube? “estimated”?'], ['Find the mounting', 'on the wall or with an air gap?'], ['Read the curve', '125 Hz and below, not the single number'], ['Compare like with like', 'same method, same mounting']])}
        <p>More in <a href="#/academy/m-lab">Absorption Coefficients, RT &amp; Laboratory Testing</a> and <a href="#/academy/m-flowres">Gas Flow Resistivity</a>.</p>` },
      { h: 'Sound insulation: lab, site, rating, prediction', html: `
        ${SVG_LABFIELD}
        <div class="table-wrap"><table><tr><th>Standard</th><th>Job</th><th>Gives you</th></tr>
          <tr><td><b>ISO 10140</b> (parts 1–5; US: ASTM E90 / E492)</td><td>Laboratory test of one element: wall, floor, door, window</td><td>R (airborne) and L<sub>n</sub> (impact) per third-octave — the element alone</td></tr>
          <tr><td><b>ISO 16283-1 / -2 / -3</b> (US: ASTM E336 / E1007)</td><td>Test in the finished building: airborne, impact, façade</td><td>R′, D<sub>nT</sub>, L′<sub>nT</sub> — everything, flanking included</td></tr>
          <tr><td><b>ISO 717-1 / -2</b> (US: ASTM E413 / E989)</td><td>Turns a curve into one number</td><td>R<sub>w</sub>, D<sub>nT,w</sub> (C; C<sub>tr</sub>) and L<sub>n,w</sub>, L′<sub>nT,w</sub></td></tr>
          <tr><td><b>ISO 12354</b> (EN 12354)</td><td>Calculates room-to-room performance from lab data</td><td>A prediction including every flanking path</td></tr>
          <tr><td><b>ISO 10848</b></td><td>Measures how much junctions pass sideways</td><td>Junction data for ISO 12354, vital for lightweight buildings</td></tr></table></div>
        <div class="table-wrap"><table><tr><th>Symbol</th><th>Read it as</th><th>Notes</th></tr>
          <tr><td><b>R</b></td><td>Sound reduction index of an element, lab</td><td>Per frequency band. Bigger is better.</td></tr>
          <tr><td><b>R′</b></td><td>“Apparent” R measured on site</td><td>The dash (prime) always means <i>in the building, flanking included</i></td></tr>
          <tr><td><b>R<sub>w</sub></b></td><td>Weighted single number from R</td><td>100–3 150 Hz. What data sheets quote</td></tr>
          <tr><td><b>D<sub>n</sub></b></td><td>Level difference normalised to a reference absorption (10 m²)</td><td>Room-to-room, not element</td></tr>
          <tr><td><b>D<sub>nT</sub></b></td><td>Level difference standardised to a 0.5 s reverberation time</td><td>What people in a furnished room actually experience</td></tr>
          <tr><td><b>D<sub>nT,w</sub></b></td><td>Weighted single number from D<sub>nT</sub></td><td>What UK regulations and site tests use</td></tr>
          <tr><td><b>C</b></td><td>Correction for pink-noise-like sources</td><td>Speech, radio, railway at speed. Usually −1 to −2 dB</td></tr>
          <tr><td><b>C<sub>tr</sub></b></td><td>Correction for bass-heavy sources</td><td>Urban traffic, <b>music</b>. Often −4 to −12 dB for light walls</td></tr>
          <tr><td><b>L<sub>n</sub>, L<sub>n,w</sub></b></td><td>Impact sound level under a standard tapping machine, lab</td><td>For impact, <b>smaller is better</b></td></tr>
          <tr><td><b>L′<sub>nT,w</sub></b></td><td>Weighted, standardised impact level on site</td><td>The footsteps figure in regulations</td></tr>
          <tr><td><b>STC / ASTC / NIC</b></td><td>US airborne ratings: lab / apparent on site / plain level difference on site</td><td>125–4 000 Hz; roughly comparable with R<sub>w</sub> / R′<sub>w</sub> / D<sub>w</sub></td></tr>
          <tr><td><b>IIC / AIIC</b></td><td>US impact ratings, lab / site</td><td>Opposite sense to L<sub>n,w</sub>: bigger is better</td></tr></table></div>
        <div class="callout data"><b>Lab vs site:</b> expect the building to deliver roughly <b>5–8 dB less</b> than the laboratory rating of the wall, more if doors, services or lightweight junctions are involved. Specify the site figure you need and choose an element with margin.</div>
        <div class="callout physics"><b>Why C<sub>tr</sub> matters for music:</b> R<sub>w</sub> leans on the mid frequencies. Two walls can both be R<sub>w</sub> 55 while one is 10 dB weaker at 63–125 Hz. R<sub>w</sub> + C<sub>tr</sub> exposes that. Even C<sub>tr</sub> stops at 100 Hz (50 Hz in the extended version), so for drums and subwoofers ask for the third-octave curve.</div>
        <p>Watch the rating being made. Compare the lightweight stud wall and the concrete wall: similar R<sub>w</sub> is possible with very different C<sub>tr</sub>.</p>`, viz: 'ratingFit' },
      { h: 'Noise: the numbers used to describe it', html: `
        ${SVG_LEQ}
        <div class="table-wrap"><table><tr><th>Quantity</th><th>Plain meaning</th><th>Used for</th></tr>
          <tr><td><b>L<sub>Aeq,T</sub></b></td><td>The steady A-weighted level that carries the same energy as the real, varying noise over time T</td><td>Almost every guideline: ambient noise, exposure</td></tr>
          <tr><td><b>L<sub>A90,T</sub></b></td><td>Level exceeded for 90 % of the time: the quiet floor between events</td><td>“Background sound” in BS 4142</td></tr>
          <tr><td><b>L<sub>AFmax</sub></b></td><td>The highest level reached, Fast response</td><td>Sleep disturbance, individual events</td></tr>
          <tr><td><b>NR / NC</b></td><td>The highest standard curve touched by the octave-band spectrum</td><td>HVAC noise in rooms; NR in Europe, NC in the US</td></tr>
          <tr><td><b>L<sub>W</sub></b></td><td>Sound <i>power</i> of a machine — independent of distance and room</td><td>Choosing fans, condensers, chillers</td></tr></table></div>
        <div class="table-wrap"><table><tr><th>Standard</th><th>What it is for</th></tr>
          <tr><td><b>ISO 1996-1 / -2</b></td><td>How to describe, measure and assess environmental noise: the home of L<sub>Aeq</sub>, rating levels and survey method</td></tr>
          <tr><td><b>ISO 9613-2</b></td><td>Calculating how noise falls with distance outdoors: spreading, air, ground, barriers</td></tr>
          <tr><td><b>ISO 226</b></td><td>Equal-loudness contours: why bass needs more level to sound as loud, and where A-weighting came from</td></tr>
          <tr><td><b>ISO 3740 series</b> (3741, 3744 …)</td><td>Measuring a machine’s sound power in a reverberation room or over a reflecting plane</td></tr>
          <tr><td><b>ANSI/ASA S12.2 · NR curves</b></td><td>Room-noise criteria curves. NR and NC numbers are close but not identical — say which you mean</td></tr>
          <tr><td><b>IEC 61672-1</b></td><td>Sound level meters: Class 1 (precision) and Class 2 (general), A/C/Z weighting, Fast/Slow</td></tr>
          <tr><td><b>IEC 61260-1 · ISO 266</b></td><td>Octave and third-octave filters and their standard centre frequencies</td></tr></table></div>
        <div class="callout mentor">A-weighting hides bass. A studio can meet 25 dB(A) and still have a 63 Hz rumble that ruins recordings — which is exactly why studios specify NR or NC curves (octave bands) as well. Targets: see <a href="#/academy/m-iso-basics">Isolation Fundamentals</a> and <a href="#/academy/m-hvac">HVAC</a>.</div>` },
      { h: 'Vibration: when you feel it before you hear it', html: `
        <div class="table-wrap"><table><tr><th>Standard</th><th>What it does</th><th>Studio relevance</th></tr>
          <tr><td><b>ISO 2631</b></td><td>How to measure and weight whole-body vibration as people perceive it</td><td>Basis of the others</td></tr>
          <tr><td><b>ISO 10137</b></td><td>Serviceability of buildings and walkways against vibration, with criteria by use</td><td>Bouncy floors, footfall near sensitive rooms</td></tr>
          <tr><td><b>BS 6472-1</b></td><td>UK guidance on vibration in buildings from sources other than blasting</td><td>Railways, plant, drum rooms above dwellings</td></tr></table></div>
        <p><b>VDV — vibration dose value</b> — is the number BS 6472-1 uses. Think of it as a vibration “dose” added up over a day or night; the arithmetic gives extra weight to the strongest moments, so a few heavy thumps count for more than long gentle tremor. The standard relates ranges of VDV to how likely people are to complain; see the current edition for the ranges.</p>
        <div class="callout example">A studio 40 m from a railway: airborne noise is solved by the shell, but trains shake the ground at 30–80 Hz, which re-radiates from walls as rumble. A vibration survey to these standards decides whether a floating floor or building isolation is needed. See <a href="#/academy/m-floors">Floating Floors</a>.</div>` },
      { h: 'British Standards and UK rules', html: `
        <div class="table-wrap"><table><tr><th>BS 8233:2014 — guideline indoor ambient levels in dwellings</th><th>Daytime 07:00–23:00</th><th>Night 23:00–07:00</th></tr>
          <tr><td>Living room (resting)</td><td>35 dB L<sub>Aeq,16h</sub></td><td>—</td></tr>
          <tr><td>Dining room / area</td><td>40 dB L<sub>Aeq,16h</sub></td><td>—</td></tr>
          <tr><td>Bedroom (sleeping, daytime resting)</td><td>35 dB L<sub>Aeq,16h</sub></td><td>30 dB L<sub>Aeq,8h</sub></td></tr></table></div>
        <p><b>BS 8233</b> is guidance for designing buildings against noise. For a studio builder its main use is on the <i>neighbour’s</i> side: these are the levels their rooms should be able to enjoy with your studio running. They are averages for steady noise — audible music beats can annoy well below them.</p>
        <div class="callout data"><b>BS 4142:2014+A1:2019</b> — for outdoor plant and commercial sound affecting homes. Measure the background (L<sub>A90</sub>) without your equipment; work out your equipment’s level at the neighbour and add character penalties to get the <b>rating level</b>; compare.<ul style="margin:.3em 0 0;padding-left:18px"><li>Rating about <b>+10 dB or more</b> above background: likely a significant adverse impact.</li><li>About <b>+5 dB</b>: likely an adverse impact.</li><li>At or below background: low impact.</li><li>All “depending on the context”. Penalties are added for sound that is tonal (a hum or whine), impulsive, intermittent or otherwise distinctive.</li></ul></div>
        <div class="table-wrap"><table><tr><th>Approved Document E (England) — commonly cited minimums between dwellings</th><th>Airborne D<sub>nT,w</sub> + C<sub>tr</sub></th><th>Impact L′<sub>nT,w</sub></th></tr>
          <tr><td>New-build houses and flats — separating walls and floors</td><td>≥ 45 dB</td><td>≤ 62 dB (floors)</td></tr>
          <tr><td>Conversions (material change of use)</td><td>≥ 43 dB</td><td>≤ 64 dB (floors)</td></tr></table></div>
        <p>Compliance is shown by site testing to ISO 16283 or by using approved robust constructions. Check the current document for the exact requirements and for other building types. <b>Scotland, Wales and Northern Ireland have their own regulations and guidance documents</b> with different figures and descriptors.</p>
        <div class="table-wrap"><table><tr><th>Also met in the UK</th><th>What it covers</th></tr>
          <tr><td><b>BS 5228-1 / -2</b></td><td>Predicting and controlling noise (1) and vibration (2) from construction sites — relevant while you build</td></tr>
          <tr><td><b>BS 6472-1</b></td><td>Human response to vibration in buildings (see above)</td></tr>
          <tr><td><b>BB93</b></td><td>Acoustic design of schools: noise, insulation and reverberation criteria by room type, including music and recording rooms</td></tr>
          <tr><td><b>BS 7671</b></td><td>The IET Wiring Regulations: every electrical installation, including studio technical power and earthing</td></tr>
          <tr><td><b>BS EN ISO …</b></td><td>UK editions of the international standards — identical technical content</td></tr></table></div>
        <div class="callout warn">The building-regulation figure of about 45 dB is a <b>legal minimum for ordinary living</b>. A drum kit at 105–110 dB needs 70–80 dB to reach a neighbour’s bedroom guideline. Meeting the regulations is nowhere near a studio specification.</div>` },
      { h: 'Studio and broadcast references', html: `
        <div class="table-wrap"><table><tr><th>Document</th><th>What it defines</th><th>Useful targets</th></tr>
          <tr><td><b>EBU Tech 3276</b></td><td>A reference listening room for assessing programme sound</td><td>Mid-frequency reverberation time scaled gently with room volume and kept in roughly the <b>0.2–0.4 s</b> region, even with frequency; an in-room response held within a tight tolerance band (about ±3 dB over most of the range); controlled early reflections; background noise preferably <b>NR 10</b>, not above <b>NR 15</b>; symmetrical loudspeaker layout</td></tr>
          <tr><td><b>ITU-R BS.1116</b></td><td>Rooms and methods for critical listening tests of small impairments</td><td>Similar room criteria; the usual reference for mastering-grade rooms</td></tr>
          <tr><td><b>ITU-R BS.775</b></td><td>Multichannel loudspeaker layout</td><td>5.1 angles: centre 0°, left/right ±30°, surrounds ±100–120°</td></tr>
          <tr><td><b>AES48 · AES67 · AES3 · AES10</b></td><td>Shield grounding of equipment; audio-over-IP interoperability; two-channel digital audio; MADI</td><td>See <a href="#/academy/m-connect">Connecting Rooms</a> and <a href="#/academy/a-ground">Hum, Buzz &amp; Grounding</a></td></tr></table></div>
        <div class="callout mentor">These are not laws. They are the best ready-made <b>brief</b> for a control room: quote one in your design targets and your acoustician, builder and client all know what “good” means. See <a href="#/academy/m-control">Control Rooms</a> and <a href="#/academy/flat">Flat Response</a>.</div>` },
      { h: 'Which standard do I need?', html: `
        <div class="table-wrap"><table><tr><th>I want to…</th><th>Standard(s)</th><th>What I get</th></tr>
          <tr><td>Measure my room’s reverberation</td><td>ISO 3382-2</td><td>T20/T30 per band, with a stated accuracy grade</td></tr>
          <tr><td>Compare two absorber products</td><td>ISO 354 curves (not just ISO 11654 α<sub>w</sub>)</td><td>α per third-octave, same mounting</td></tr>
          <tr><td>Compare two diffusers</td><td>ISO 17497-2</td><td>Diffusion coefficient versus frequency</td></tr>
          <tr><td>Specify a wall, door or window to a builder</td><td>ISO 10140 test + ISO 717-1 rating</td><td>R<sub>w</sub> (C; C<sub>tr</sub>) and the full curve</td></tr>
          <tr><td>Predict the finished room-to-room result</td><td>ISO 12354</td><td>Expected D<sub>nT,w</sub> including flanking</td></tr>
          <tr><td>Prove isolation to a neighbour or authority</td><td>ISO 16283-1 (+ -2 for impact) rated by ISO 717</td><td>D<sub>nT,w</sub> (+ C<sub>tr</sub>), L′<sub>nT,w</sub> on site</td></tr>
          <tr><td>Check what the neighbour’s rooms should be able to enjoy (UK)</td><td>BS 8233</td><td>Guideline indoor L<sub>Aeq</sub> values</td></tr>
          <tr><td>Assess my outdoor air-conditioner or fan (UK)</td><td>BS 4142, with ISO 9613-2 for the prediction</td><td>Rating level against background</td></tr>
          <tr><td>Set and check HVAC noise in the studio</td><td>NR / NC curves; meter to IEC 61672</td><td>Octave-band limit, e.g. NR 15</td></tr>
          <tr><td>Set control-room targets</td><td>EBU Tech 3276 / ITU-R BS.1116</td><td>RT, response window, noise, layout</td></tr>
          <tr><td>Design a school music or recording room (England)</td><td>BB93 (and ISO 23591 for rehearsal rooms)</td><td>Noise, insulation and RT criteria by room type</td></tr>
          <tr><td>Assess rumble from trains or a floor that bounces</td><td>BS 6472-1 / ISO 10137 / ISO 2631</td><td>Vibration dose and criteria</td></tr>
          <tr><td>Wire the studio</td><td>BS 7671 (UK) or your national code; AES48 for audio shields</td><td>A safe, quiet installation — by a licensed electrician</td></tr></table></div>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🏠', 'Home-studio complaint in a UK flat', [['Situation', 'Neighbour below hears bass in the evening'], ['Standards in play', 'The floor was built to the building-regulation minimum (about 45 dB with C<sub>tr</sub>); BS 8233 gives the levels their rooms should enjoy'], ['Do', 'Work out source level − target per octave; you will need far more than the minimum at 63–125 Hz. Control at the source (level, sub position, decoupling) and build isolation if the gap is large']])}
          ${uc('🧱', 'Specifying a studio wall to a builder', [['Weak spec', '“A soundproof wall, R<sub>w</sub> 60.”'], ['Use instead', '“On-site D<sub>nT,w</sub> + C<sub>tr</sub> ≥ 60 dB tested to ISO 16283-1, and at least 45 dB in the 63 Hz octave; construction as drawn; all perimeters sealed.”'], ['Why', 'Names the site result, the bass, the test and the workmanship']], '#7a5cc7')}
          ${uc('📄', 'Reading an absorber data sheet', [['It says', '“Class A, α<sub>w</sub> 0.95, NRC 0.95”'], ['Ask', 'Tested to ISO 354? Which mounting — flat on the wall or with a 200 mm void? What is α at 125 Hz?'], ['Use', 'The third-octave table at the mounting you will actually build']], '#c7772b')}
          ${uc('❄️', 'Outdoor condenser near neighbours', [['Situation', 'New cooling for the studio; bedroom window 8 m away'], ['Method', 'Maker’s sound power (ISO 3740 series) → level at the window (ISO 9613-2) → add character penalty for hum → compare with night-time L<sub>A90</sub> (BS 4142)'], ['Do', 'Choose a quieter unit, a night setback mode, a screen or a different location before you buy']], '#2b9fc7')}
          ${uc('📋', 'What a commissioning report should contain', [['Room acoustics', 'RT per band to ISO 3382-2 (grade stated), response at the seat, waterfall'], ['Isolation', 'D<sub>nT</sub> per third-octave and D<sub>nT,w</sub> (C; C<sub>tr</sub>) to ISO 16283 / 717 for each key partition'], ['Noise', 'Octave-band levels and NR/NC with HVAC on and off; meter class and calibration'], ['Use it', 'As the baseline for every later change']], '#4c9a3a')}
        </div>` },
      { h: 'Common misunderstandings', html: `
        ${myth([
          ['“The wall is R<sub>w</sub> 60, so I will get 60 dB on site.”', 'R<sub>w</sub> is the element alone in a laboratory. In a building, flanking, doors and workmanship typically take 5–8 dB or more. Specify the on-site figure.'],
          ['“NRC 0.95 / Class A means it absorbs bass.”', 'Both single numbers start at 250 Hz. Read the curve at 63–125 Hz — it is usually far lower.'],
          ['“A Class 2 sound level meter is useless.”', 'Class 2 is fine for surveys, tuning and before/after comparisons. Class 1 is needed for formal reports and disputes. Calibrate either before use.'],
          ['“It passes Building Regulations, so it is good enough for a studio.”', 'The regulations protect ordinary living at ordinary levels. Studios need 20–35 dB more, especially in the bass.'],
          ['“STC and R<sub>w</sub> are the same thing.”', 'Close for many walls (often within 1–2 dB) but they use different frequency ranges (125–4 000 Hz vs 100–3 150 Hz) and rules. They diverge for constructions with low-frequency weaknesses.'],
          ['“An absorption coefficient above 1 means the data are fake.”', 'It is a known artefact of the reverberation-room method (edge effects). Use 1.0 in calculations.'],
          ['“The standard has a number, so the number is the truth.”', 'Every method has an uncertainty — often ±1–2 dB for ratings and more at low frequencies in small rooms.'],
        ])}
        ${flow([['Ask what was measured', 'element or building? lab or site?'], ['Ask how it was rated', 'which single number, which range?'], ['Ask for the curve', 'bass decides studios'], ['Check the edition', 'current standard, current regulation'], ['Add margin', '5–8 dB lab-to-site, plus uncertainty']])}` },
    ],
    quiz: [
      { q: 'A dash (prime) in a symbol such as R′ or L′<sub>nT,w</sub> means…', opts: ['it is an estimate', 'measured in the building, flanking included', 'A-weighted', 'low frequencies only'], a: 1, why: 'Primed quantities are “apparent” values from site tests.' },
      { q: 'Which pair gives you a single-number rating of a wall tested in a laboratory?', opts: ['ISO 3382-2 and ISO 354', 'ISO 10140 and ISO 717-1', 'ISO 1996 and BS 4142', 'ISO 16283-1 and BS 8233'], a: 1, why: 'ISO 10140 is the lab measurement; ISO 717-1 turns the curve into R<sub>w</sub>.' },
      { q: 'Why add C<sub>tr</sub> to R<sub>w</sub> when the source is music?', opts: ['It makes the number bigger', 'It accounts for bass-heavy spectra where light walls are weak', 'It is required for doors', 'It corrects for temperature'], a: 1, why: 'C<sub>tr</sub> weights the low bands; it is usually a negative correction.' },
      { q: 'In BS 4142, the “background sound level” is described by…', opts: ['L<sub>AFmax</sub>', 'L<sub>Aeq</sub>', 'L<sub>A90</sub>', 'NR'], a: 2, why: 'L<sub>A90</sub>: the level exceeded 90 % of the time.' },
      { q: 'A panel is “Class A, α<sub>w</sub> 0.95”. What do you still not know?', opts: ['Its absorption at 1 kHz', 'Its absorption at 63–125 Hz and the mounting used', 'Whether it is porous', 'Its colour'], a: 1, why: 'ISO 11654 covers 250 Hz–4 kHz; the mounting changes low-frequency results a lot.' },
      { q: 'Which is the best ready-made brief for a control room?', opts: ['Approved Document E', 'BS 5228', 'EBU Tech 3276 / ITU-R BS.1116', 'ISO 9613-2'], a: 2, why: 'They define listening-room RT, response tolerance, reflections and noise.' },
    ],
  };
  window.LESSONS.push(L);
})();
