/* ==========================================================================
   Recording, Mixing & Mastering track — R11–R14: formats and media,
   noise reduction and restoration, sound synthesis, creative processing.
   Original text; simplified, practical, tool-driven.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|do|approach|move/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const tbl = (head, rows) => `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const SAFE = `<div class="callout safety">The sound demos on this page are generated in your browser at a modest level. Start with your volume low — distortion, noise and resonant filters can be far louder on headphones than they look on screen.</div>`;

  /* =============================== SVGs =============================== */
  const SVG_MEDIA = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Four storage media compared by noise floor and headroom">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Every medium is a window: a floor of noise below, a ceiling of distortion above</text>
    <g font-size="10">
      <line x1="60" y1="200" x2="660" y2="200" stroke="var(--muted)"/>
      <text x="56" y="50" text-anchor="end" fill="var(--muted)">loud</text><text x="56" y="198" text-anchor="end" fill="var(--muted)">quiet</text>
      <g><rect x="90" y="62" width="90" height="92" fill="var(--c3)" opacity=".75"/><rect x="90" y="154" width="90" height="46" fill="var(--muted)" opacity=".35"/><rect class="hot" x="90" y="44" width="90" height="18" fill="var(--warn)" opacity=".7"/><text x="135" y="216" text-anchor="middle">Vinyl disc</text><text x="135" y="112" text-anchor="middle" fill="#fff">≈ 60 dB</text></g>
      <g><rect x="230" y="54" width="90" height="112" fill="var(--accent2)" opacity=".8"/><rect x="230" y="166" width="90" height="34" fill="var(--muted)" opacity=".35"/><rect class="hot" x="230" y="36" width="90" height="18" fill="var(--warn)" opacity=".7"/><text x="275" y="216" text-anchor="middle">Analogue tape</text><text x="275" y="114" text-anchor="middle" fill="#fff">≈ 65–75 dB</text></g>
      <g><rect x="370" y="44" width="90" height="142" fill="var(--accent)" opacity=".85"/><rect x="370" y="186" width="90" height="14" fill="var(--muted)" opacity=".35"/><rect x="370" y="40" width="90" height="4" fill="var(--bad)"/><text x="415" y="216" text-anchor="middle">16-bit digital</text><text x="415" y="118" text-anchor="middle" fill="#fff">≈ 96 dB</text></g>
      <g><rect x="510" y="44" width="90" height="152" fill="var(--good)" opacity=".8"/><rect x="510" y="196" width="90" height="4" fill="var(--muted)" opacity=".35"/><rect x="510" y="40" width="90" height="4" fill="var(--bad)"/><text x="555" y="216" text-anchor="middle">24-bit digital</text><text x="555" y="124" text-anchor="middle" fill="#fff">&gt; 120 dB*</text></g>
      <text x="620" y="54" fill="var(--warn)">soft</text><text x="620" y="66" fill="var(--warn)">overload</text>
      <text x="616" y="34" fill="var(--bad)">hard clip</text>
    </g>
    <text x="340" y="229" text-anchor="middle" font-size="9" fill="var(--muted)">* limited in practice by the analogue electronics around the converter</text>
  </svg>`;

  const SVG_TAPE = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Tape passing erase, record and replay heads">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Tape recording: tiny magnets lined up by a head as the tape slides past</text>
    <rect x="20" y="86" width="640" height="26" fill="var(--c3)" opacity=".35" stroke="var(--c3)"/>
    <g fill="var(--text)" opacity=".8">
      <g><animateTransform attributeName="transform" type="translate" from="0 0" to="40 0" dur="1.2s" repeatCount="indefinite"/>
        ${Array.from({ length: 17 }, (_, i) => `<rect x="${i * 40 - 20}" y="94" width="${i > 8 ? 14 + (i % 3) * 6 : 6}" height="10" rx="2" fill="${i > 8 ? 'var(--accent)' : 'var(--muted)'}"/>`).join('')}
      </g>
    </g>
    <g font-size="10" text-anchor="middle">
      <path d="M140 60 h50 v26 h-18 v-10 h-14 v10 h-18z" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/><text x="165" y="50">Erase head</text><text x="165" y="134" fill="var(--muted)">wipes the old recording</text>
      <path d="M330 60 h50 v26 h-21 v-10 h-8 v10 h-21z" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/><text x="355" y="50" fill="var(--accent)">Record head</text><text x="355" y="134" fill="var(--muted)">audio + ultrasonic bias</text>
      <path class="hot" d="M352 86 q3 10 6 0" fill="none" stroke="var(--accent)" stroke-width="2"/>
      <path d="M520 60 h50 v26 h-22 v-10 h-6 v10 h-22z" fill="var(--panel2)" stroke="var(--accent2)" stroke-width="2"/><text x="545" y="50" fill="var(--accent2)">Replay head</text><text x="545" y="134" fill="var(--muted)">turns magnetism back to voltage</text>
      <text x="60" y="80" fill="var(--muted)">blank tape →</text><text x="620" y="80" fill="var(--muted)">→ take-up</text>
    </g>
    <g font-size="10">
      <rect x="40" y="156" width="190" height="60" rx="6" fill="var(--panel2)" stroke="var(--line)"/><text x="50" y="172" font-weight="700">Faster tape</text><text x="50" y="186">more treble, less hiss,</text><text x="50" y="200">bass bump moves up, costs tape</text>
      <rect x="245" y="156" width="190" height="60" rx="6" fill="var(--panel2)" stroke="var(--line)"/><text x="255" y="172" font-weight="700">Wider track</text><text x="255" y="186">more magnets per channel:</text><text x="255" y="200">about 3 dB quieter per doubling</text>
      <rect x="450" y="156" width="190" height="60" rx="6" fill="var(--panel2)" stroke="var(--line)"/><text x="460" y="172" font-weight="700">Hotter level</text><text x="460" y="186">further above the hiss, until</text><text x="460" y="200">peaks round off (saturation)</text>
    </g>
  </svg>`;

  const SVG_GROOVE = `<svg class="gsvg" viewBox="0 0 680 240" role="img" aria-label="Stereo record groove in cross-section">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">One V-shaped groove carries two channels</text>
    <g>
      <path d="M40 70 h120 l50 80 l50 -80 h120 v120 h-340z" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/>
      <g><animateTransform attributeName="transform" type="translate" values="-6 0;6 0;-6 0" dur="1.6s" repeatCount="indefinite"/>
        <path d="M210 138 l-12 -30 h24z" fill="var(--accent)"/><rect x="206" y="60" width="8" height="48" fill="var(--muted)"/></g>
      <path d="M160 70 l50 80" stroke="var(--accent2)" stroke-width="4"/><path d="M260 70 l-50 80" stroke="var(--c3)" stroke-width="4"/>
      <text x="150" y="62" text-anchor="end" font-size="10" fill="var(--accent2)">left wall = left channel</text><text x="270" y="62" font-size="10" fill="var(--c3)">right wall = right channel</text>
      <text x="210" y="208" text-anchor="middle" font-size="10">both walls moving together = side-to-side</text><text x="210" y="222" text-anchor="middle" font-size="10" fill="var(--muted)">(mono, centre-panned sound)</text>
    </g>
    <g>
      <path d="M410 70 h80 l50 80 l50 -80 h70 v120 h-250z" fill="var(--panel2)" stroke="var(--text)" stroke-width="1.5"/>
      <g><animateTransform attributeName="transform" type="translate" values="0 -7;0 7;0 -7" dur="1.6s" repeatCount="indefinite"/>
        <path d="M540 138 l-12 -30 h24z" fill="var(--warn)"/><rect x="536" y="60" width="8" height="48" fill="var(--muted)"/></g>
      <text x="540" y="208" text-anchor="middle" font-size="10">walls moving in opposition = up-and-down</text><text x="540" y="222" text-anchor="middle" font-size="10" fill="var(--warn)">(out-of-phase sound — risky in the bass)</text>
    </g>
  </svg>`;

  const SVG_MASK = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Masking lets a coder discard quiet components near a loud one">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Perceptual coding: do not spend bits on what the ear cannot hear</text>
    <line x1="50" y1="190" x2="650" y2="190" stroke="var(--muted)"/><text x="350" y="210" text-anchor="middle" font-size="10" fill="var(--muted)">frequency →</text>
    <path d="M50 150 C 140 176, 200 150, 250 60 L 262 40 L 274 60 C 330 120, 430 160, 520 176 S 620 150, 650 110" fill="var(--accent2)" opacity=".18" stroke="var(--accent2)" stroke-width="2"/>
    <text x="440" y="134" font-size="10" fill="var(--accent2)">masking threshold</text>
    <line x1="262" y1="190" x2="262" y2="36" stroke="var(--accent)" stroke-width="5"/><text x="262" y="30" text-anchor="middle" font-size="10" fill="var(--accent)">loud tone</text>
    <g stroke="var(--muted)" stroke-width="3" stroke-dasharray="3 3"><line x1="232" y1="190" x2="232" y2="118"/><line x1="296" y1="190" x2="296" y2="110"/><line x1="340" y1="190" x2="340" y2="150"/></g>
    <text x="300" y="100" font-size="10" fill="var(--muted)">hidden → dropped</text>
    <g stroke="var(--accent)" stroke-width="4"><line x1="120" y1="190" x2="120" y2="110"/><line x1="470" y1="190" x2="470" y2="90"/><line x1="580" y1="190" x2="580" y2="120"/></g>
    <text x="120" y="102" text-anchor="middle" font-size="10">audible → kept</text>
    <rect class="hot" x="50" y="176" width="600" height="14" fill="var(--warn)" opacity=".35"/><text x="60" y="187" font-size="9">coding noise, shaped to stay under the threshold</text>
  </svg>`;

  const SVG_321 = `<svg class="gsvg" viewBox="0 0 680 170" role="img" aria-label="Three copies on two kinds of storage with one off site">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The archive rule: 3 copies · 2 kinds of storage · 1 somewhere else</text>
    <g font-size="10" text-anchor="middle">
      <rect x="60" y="50" width="140" height="70" rx="8" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/><text x="130" y="80" font-weight="700">Working drive</text><text x="130" y="96" fill="var(--muted)">fast, in the studio</text>
      <rect x="270" y="50" width="140" height="70" rx="8" fill="var(--panel2)" stroke="var(--accent2)" stroke-width="2"/><text x="340" y="80" font-weight="700">Second medium</text><text x="340" y="96" fill="var(--muted)">a different technology</text>
      <rect x="480" y="50" width="140" height="70" rx="8" fill="var(--panel2)" stroke="var(--c3)" stroke-width="2"/><text x="550" y="80" font-weight="700">Off-site copy</text><text x="550" y="96" fill="var(--muted)">another building / cloud</text>
      <path class="lock-wave" d="M200 85 h70" stroke="var(--good)" stroke-width="3"/><path class="lock-wave d2" d="M410 85 h70" stroke="var(--good)" stroke-width="3"/>
      <text x="340" y="146">verify checksums on every copy · migrate to fresh media every few years · write down what each file is</text>
    </g>
  </svg>`;

  const SVG_FAULTS = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Where each kind of noise sits on a time-frequency map">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Know the enemy: each fault has its own shape in time and frequency</text>
    <rect x="60" y="30" width="580" height="170" fill="var(--panel2)" stroke="var(--line)"/>
    <text x="50" y="42" text-anchor="end" font-size="10" fill="var(--muted)">high</text><text x="50" y="198" text-anchor="end" font-size="10" fill="var(--muted)">low</text><text x="350" y="218" text-anchor="middle" font-size="10" fill="var(--muted)">time →</text>
    <rect x="60" y="30" width="580" height="60" fill="var(--muted)" opacity=".3"/><text x="70" y="46" font-size="10">hiss — everywhere, all the time, strongest to the ear up high</text>
    <g stroke="var(--warn)" stroke-width="3"><line x1="60" y1="186" x2="640" y2="186"/><line x1="60" y1="174" x2="640" y2="174" opacity=".8"/><line x1="60" y1="162" x2="640" y2="162" opacity=".6"/><line x1="60" y1="150" x2="640" y2="150" opacity=".4"/></g><text x="70" y="144" font-size="10" fill="var(--warn)">hum and buzz — steady horizontal lines at the mains frequency and its multiples</text>
    <g stroke="var(--bad)" stroke-width="2.5"><line class="leak-pulse" x1="210" y1="30" x2="210" y2="200"/><line class="leak-pulse" x1="388" y1="30" x2="388" y2="200"/><line class="leak-pulse" x1="402" y1="30" x2="402" y2="200"/><line class="leak-pulse" x1="560" y1="30" x2="560" y2="200"/></g><text x="216" y="108" font-size="10" fill="var(--bad)">clicks — vertical lines: every frequency, for an instant</text>
    <path d="M60 196 q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t20 0" fill="none" stroke="var(--c3)" stroke-width="5" opacity=".7"/><text x="470" y="198" font-size="10" fill="var(--c3)">rumble, wind, thumps</text>
    <g fill="var(--accent)" opacity=".8"><rect x="100" y="96" width="80" height="6"/><rect x="100" y="112" width="70" height="5"/><rect x="250" y="88" width="110" height="6"/><rect x="250" y="104" width="100" height="5"/><rect x="250" y="120" width="80" height="4"/><rect x="430" y="100" width="100" height="6"/><rect x="430" y="116" width="90" height="5"/></g><text x="100" y="128" font-size="10" fill="var(--accent)">the music you want to keep</text>
  </svg>`;

  const SVG_COMPAND = `<svg class="gsvg" viewBox="0 0 680 210" role="img" aria-label="Companding: compress before the noisy medium, expand after">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Companding: lift the quiet parts over the hiss, then put them back</text>
    <g font-size="10" text-anchor="middle">
      <g><rect x="40" y="50" width="120" height="110" fill="var(--panel2)" stroke="var(--line)"/><rect x="60" y="60" width="26" height="100" fill="var(--accent)"/><rect x="100" y="130" width="26" height="30" fill="var(--accent)" opacity=".6"/><text x="100" y="178">Original</text><text x="100" y="192" fill="var(--muted)">loud + quiet passage</text></g>
      <path d="M165 105 h35" stroke="var(--text)" stroke-width="2" marker-end="url(#s4arr)"/><text x="182" y="96">squeeze</text>
      <g><rect x="205" y="50" width="120" height="110" fill="var(--panel2)" stroke="var(--line)"/><rect x="225" y="60" width="26" height="100" fill="var(--accent)"/><rect x="265" y="100" width="26" height="60" fill="var(--accent)" opacity=".6"/><text x="265" y="178">Encoded</text><text x="265" y="192" fill="var(--muted)">quiet part raised</text></g>
      <path d="M330 105 h35" stroke="var(--text)" stroke-width="2" marker-end="url(#s4arr)"/><text x="347" y="96">tape</text>
      <g><rect x="370" y="50" width="120" height="110" fill="var(--panel2)" stroke="var(--line)"/><rect x="390" y="60" width="26" height="100" fill="var(--accent)"/><rect x="430" y="100" width="26" height="60" fill="var(--accent)" opacity=".6"/><rect class="hot" x="372" y="136" width="116" height="24" fill="var(--muted)" opacity=".55"/><text x="430" y="178">On the medium</text><text x="430" y="192" fill="var(--muted)">hiss added underneath</text></g>
      <path d="M495 105 h35" stroke="var(--text)" stroke-width="2" marker-end="url(#s4arr)"/><text x="512" y="96">stretch</text>
      <g><rect x="535" y="50" width="120" height="110" fill="var(--panel2)" stroke="var(--line)"/><rect x="555" y="60" width="26" height="100" fill="var(--accent)"/><rect x="595" y="130" width="26" height="30" fill="var(--accent)" opacity=".6"/><rect x="537" y="150" width="116" height="10" fill="var(--muted)" opacity=".55"/><text x="595" y="178">Decoded</text><text x="595" y="192" fill="var(--good)">hiss pushed down too</text></g>
    </g>
    <defs><marker id="s4arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--text)"/></marker></defs>
  </svg>`;

  const SVG_SPECSUB = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Spectral noise reduction subtracts a learned noise print">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Spectral noise reduction: learn the noise alone, then turn down every band where only noise lives</text>
    <g font-size="10" text-anchor="middle">
      <rect x="30" y="40" width="190" height="130" fill="var(--panel2)" stroke="var(--line)"/><path d="M30 150 q20 -10 40 -4 t40 2 t40 -6 t40 4 t30 -2 V170 H30z" fill="var(--muted)" opacity=".5"/><text x="125" y="188">1 · Noise print</text><text x="125" y="202" fill="var(--muted)">a second of “silence”</text>
      <rect x="245" y="40" width="190" height="130" fill="var(--panel2)" stroke="var(--line)"/><path d="M245 150 q20 -10 40 -4 t40 2 t40 -6 t40 4 t30 -2 V170 H245z" fill="var(--muted)" opacity=".5"/>
      <g fill="var(--accent)"><rect x="270" y="70" width="8" height="100"/><rect x="300" y="92" width="8" height="78"/><rect x="330" y="110" width="8" height="60"/><rect x="360" y="126" width="8" height="44"/><rect x="390" y="146" width="8" height="24" opacity=".6"/><rect x="412" y="152" width="8" height="18" opacity=".6"/></g><text x="340" y="188">2 · Music + noise</text><text x="340" y="202" fill="var(--muted)">quiet partials sit in the noise</text>
      <rect x="460" y="40" width="190" height="130" fill="var(--panel2)" stroke="var(--line)"/>
      <g fill="var(--accent)"><rect x="485" y="70" width="8" height="100"/><rect x="515" y="92" width="8" height="78"/><rect x="545" y="110" width="8" height="60"/><rect x="575" y="126" width="8" height="44"/></g>
      <g fill="var(--bad)"><rect class="leak-pulse" x="605" y="158" width="8" height="12"/><rect class="leak-pulse" x="500" y="160" width="5" height="10"/><rect class="leak-pulse" x="632" y="156" width="5" height="14"/></g>
      <text x="555" y="188">3 · After subtraction</text><text x="555" y="202" fill="var(--bad)">too much → lost tails + chirpy leftovers</text>
    </g>
  </svg>`;

  const SVG_ORDER = `<svg class="gsvg" viewBox="0 0 680 150" role="img" aria-label="Order of restoration operations">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Repair in this order — each step makes the next one's job easier</text>
    <g font-size="10" text-anchor="middle">
      ${[['Transfer', 'flat, high-res, untouched copy', 'var(--muted)'], ['Clicks', 'shortest, sharpest faults first', 'var(--bad)'], ['Hum', 'narrow notches or hum removal', 'var(--warn)'], ['Broadband', 'hiss: gentle spectral reduction', 'var(--accent2)'], ['Tone & level', 'EQ, dynamics, loudness last', 'var(--good)']].map(([t, d, c], i) => `<g><rect x="${20 + i * 132}" y="44" width="116" height="64" rx="8" fill="var(--panel2)" stroke="${c}" stroke-width="2"/><text x="${78 + i * 132}" y="70" font-weight="700">${i + 1} · ${t}</text><text x="${78 + i * 132}" y="88" font-size="9" fill="var(--muted)">${d}</text>${i < 4 ? `<path class="lock-wave${i % 2 ? ' d2' : ''}" d="M${136 + i * 132} 76 h16" stroke="var(--text)" stroke-width="2"/>` : ''}</g>`).join('')}
      <text x="340" y="134" fill="var(--muted)">Always work on a copy. Keep the untouched transfer and a note of every setting you used.</text>
    </g>
  </svg>`;

  /* ================================ R11 ================================ */
  window.LESSONS.push({
    id: 'r-formats', n: 'R11', track: 'recording', title: 'Formats and Media: Tape, Vinyl, Optical Disc, Files and Data-Compressed Audio', level: 'Core', mins: 34,
    summary: 'Where the music actually lives once it is recorded — magnetic tape, a vinyl groove, pits on a disc, a PCM file or a data-compressed stream — what each one does to the sound, and how to prepare, deliver and archive for every one of them.',
    tags: ['tape', 'vinyl', 'RIAA', 'optical disc', 'PCM', 'WAV', 'lossless', 'lossy', 'codec', 'bit rate', 'archive', 'checksum', 'delivery'],
    sections: [
      { h: 'Why the medium matters', html: `
        <p>A recording is only as good as the thing it is stored on. Every storage medium is a <b>window</b>: there is a floor of noise at the bottom, a ceiling at the top where it overloads, and a limited range of frequencies it can hold in between. Your job is to fit the music inside the window — and to know what the frame adds.</p>
        ${SVG_MEDIA}
        ${tbl(['Property', 'What it means for the sound', 'Who wins'], [
          ['<b>Noise floor</b>', 'Hiss, crackle or quantising noise under quiet passages', 'Digital, by 30 dB or more'],
          ['<b>Overload behaviour</b>', 'Gradual rounding (analogue) or sudden hard clipping (digital)', 'Analogue is forgiving; digital is clean until it is not'],
          ['<b>Bandwidth</b>', 'How far down and up the frequencies go without loss', 'Digital is flat; tape and vinyl bend at both ends'],
          ['<b>Speed stability</b>', 'Wow, flutter and pitch drift', 'Digital is locked to a clock'],
          ['<b>Durability</b>', 'Wear with each play; decay over decades', 'Digital copies are perfect — if somebody keeps copying them'],
        ])}
        <div class="callout mentor">None of these is “better” for music by magic. Analogue media add a mild, usually pleasant, coloration; digital media add (almost) nothing. Choose on purpose, not from nostalgia or fashion.</div>` },
      { h: 'Analogue tape in plain words', html: `
        <p>Tape is a plastic ribbon coated with billions of microscopic magnets. The <b>record head</b> is a tiny electromagnet: as the tape slides past, the audio current lines the magnets up in a pattern that copies the waveform. On playback the moving pattern induces a small voltage in the <b>replay head</b>.</p>
        ${SVG_TAPE}
        <ul>
          <li><b>Bias.</b> Magnetic particles are stubborn — small signals barely move them. Mixing in a strong ultrasonic tone (far above hearing) “shakes” the particles so even quiet audio is recorded cleanly. Too little bias: gritty, bright, distorted. Too much: smooth but dull.</li>
          <li><b>Record and replay equalisation.</b> Tape loses treble on the way in and the head boosts treble on the way out. A matched pair of curves on record and replay brings the response back to flat while keeping hiss down.</li>
          <li><b>Speed and width.</b> Faster tape and wider tracks put more magnets under the head each second: better treble, lower noise. The price is more tape and, at high speeds, a “head bump” in the bass that moves upward.</li>
          <li><b>Saturation.</b> Once nearly all the magnets are aligned, extra level cannot push them further. Peaks round off gently — <i>tape compression</i> — and a little third harmonic appears.</li>
        </ul>
        <div class="callout physics">Rule of thumb: every doubling of track width buys about 3 dB less hiss; every doubling of tape speed raises the treble limit by roughly an octave.</div>`, viz: 'tapeLab' },
      { h: 'Living with tape: faults, care and why people still use it', html: `
        ${tbl(['Fault', 'What you hear', 'Cause', 'Cure'], [
          ['Hiss', 'Steady “shhh” in quiet passages', 'The random grain of the magnetic particles', 'Record hotter, faster, wider; noise reduction'],
          ['Wow', 'Slow pitch wobble (piano goes seasick)', 'Uneven tape speed: worn rollers, sticky reels', 'Service the transport'],
          ['Flutter', 'Fast, rough pitch shimmer', 'Tape scraping or vibrating at the heads', 'Clean guides; check tension'],
          ['Drop-outs', 'Brief dips in level or treble', 'Dirt or lost coating', 'Clean heads; new tape'],
          ['Print-through', 'A faint echo before a loud entry', 'Magnetism copying through neighbouring layers on the reel', 'Store “tails out”; rewind before play'],
          ['Dull or phasey stereo', 'Treble comes and goes', 'Head tilted (azimuth error)', 'Align heads to the tape'],
        ])}
        <div class="uc-grid">
          ${uc('🎚️', 'Daily routine on a tape machine', [['Clean', 'Heads and guides with the proper fluid before every session'], ['Demagnetise', 'Heads periodically — a magnetised head adds hiss and erases treble'], ['Align', 'Play a calibration tape, set replay level and azimuth, then set bias and record level for <i>this</i> tape type'], ['Do', 'Record test tones at the head of the reel so anyone can line up to it later']], 'var(--accent)')}
          ${uc('🥁', 'Why some still track to tape', [['Sound', 'Gentle peak rounding and a low-end bump flatter drums, bass and dense guitars'], ['Workflow', 'Limited tracks and no screen force decisions and complete takes'], ['Cost', 'Tape, maintenance and no “undo”'], ['Modern approach', 'Track to tape, transfer to a workstation at once; or use a tape-style saturation processor (see <a href="#/academy/r-creative-fx">R14</a>)']], 'var(--c3)')}
        </div>` },
      { h: 'Vinyl: sound cut into a groove', html: `
        <p>A record stores the waveform as the <b>wiggle of a spiral groove</b>. A heated stylus on a cutting lathe carves it into a soft lacquer disc; copies are pressed from metal moulds. On playback a diamond tip rides the groove and its motion is turned into voltage by the cartridge.</p>
        ${SVG_GROOVE}
        <p>The two walls of the V sit at 45° each. Sound common to both channels moves the stylus <b>side to side</b>; sound that is opposite in the two channels moves it <b>up and down</b>. That is why low frequencies must be mono on a record: big vertical swings either throw the playback stylus out of the groove or make the cutter lift off the disc.</p>
        ${tbl(['Limit of the medium', 'What the cutting engineer does', 'What you should do in the mix'], [
          ['Bass needs wide grooves', 'Lowers level or filters the deepest bass on long sides', 'Keep sides under about 18–20 minutes; high-pass at 30–40 Hz'],
          ['Out-of-phase bass moves the stylus vertically', 'Sums everything below roughly 150 Hz to mono', 'Pan kick and bass to the centre; check a mono fold-down'],
          ['Loud sibilance and cymbals overheat the cutter and mistrack', 'De-esses and limits the extreme top', 'Control “s” sounds and hi-hat splash before it gets there'],
          ['Inner grooves move slower under the stylus', 'Accepts more treble distortion near the label', 'Put the loud, bright songs first on each side and the gentle ones last'],
          ['Surface noise and crackle', 'Cuts as loud as the side length allows', 'Do not send a heavily limited master — it gains nothing and distorts sooner'],
        ])}` },
      { h: 'The record/replay curve and the groove budget', html: `
        <p>Cut “flat”, bass notes would need grooves so wide that a side would last a few minutes, while treble would be tiny wiggles buried in surface noise. The fix is a fixed, standardised pair of curves:</p>
        <ul>
          <li><b>On cutting:</b> bass is turned <i>down</i> and treble turned <i>up</i>.</li>
          <li><b>On replay:</b> the exact mirror image — bass up, treble down — which also turns the surface hiss down by the same amount.</li>
        </ul>
        <p>The curve has three turning points, near <b>50 Hz</b>, <b>500 Hz</b> and <b>2.1 kHz</b>. Relative to 1 kHz the replay stage lifts 20 Hz by almost 20 dB and cuts 20 kHz by almost 20 dB. This is why a turntable must feed a dedicated equalised input — and why hum at that input is such a problem: it gets the same 20 dB of bass lift.</p>
        <div class="callout alt">Use the tool: lengthen the side, raise the level or add bass and watch the turns of the groove squeeze together until they touch.</div>`, viz: 'vinylEQ' },
      { h: 'Optical disc and linear PCM files', html: `
        <p>A compact disc stores numbers, not waveforms. Microscopic <b>pits</b> in a reflective layer are read by a laser as ones and zeros. Because scratches and dust are inevitable, the data are spread out and wrapped in <b>error-correcting codes</b>: small gaps are repaired exactly, larger ones are disguised by interpolation, and only severe damage mutes or skips.</p>
        ${tbl(['Format idea', 'Typical numbers', 'Use'], [
          ['Standard audio disc', '16-bit, 44.1 kHz, stereo — about 1411 kbit/s', 'Consumer release'],
          ['Video-world audio', '48 kHz, 16 or 24-bit', 'Film, broadcast, streaming video'],
          ['High-resolution PCM', '24-bit at 88.2, 96 or 192 kHz', 'Recording, mixing, mastering, archive'],
          ['One-bit streams', 'A single bit at several megahertz', 'Some high-resolution disc formats and many converter chips internally'],
        ])}
        <p>On a computer the same numbers live in a <b>file</b>. The audio itself is <i>linear PCM</i> — one number per sample per channel (see <a href="#/academy/a-digital">digital audio</a>). The file around it is a <b>container</b> that adds a header (sample rate, word length, channel count) and, usefully, <b>metadata</b>:</p>
        <ul>
          <li><b>Broadcast-style wave files</b> carry a <i>timestamp</i>: the exact position on the session timeline where the recording began. Drop the file into any workstation and it lands in the right place — priceless when moving a project between studios.</li>
          <li>Names, scene and take numbers, track titles, artist and catalogue codes can travel inside the file rather than on a sticky note.</li>
          <li>Very long or many-channel recordings need the 64-bit versions of these containers; the classic ones stop at 4 GB.</li>
        </ul>` },
      { h: 'Lossless and lossy data compression', html: `
        <p>Two very different things are both called “compression” of audio files (and neither is the dynamics compression of <a href="#/academy/r-mix-dynamics">R8</a>).</p>
        <div class="uc-grid">
          ${uc('📦', 'Lossless packing', [['Idea', 'Like a zip file designed for audio: predict each sample from the last few and store only the small error'], ['Result', 'About 40–70 % of the original size. Unpacked, every bit is identical'], ['Use', 'Archives, distribution to listeners who want the full quality, sending masters'], ['Do', 'Use it freely — it is safe']], 'var(--good)')}
          ${uc('✂️', 'Perceptual (lossy) coding', [['Idea', 'Analyse the sound the way the ear does and throw away what is masked'], ['Result', 'A tenth of the size or less. What is discarded is gone for good'], ['Use', 'Streaming, downloads, broadcast, voice calls'], ['Do', 'Encode once, from the full-quality master']], 'var(--warn)')}
        </div>
        ${SVG_MASK}
        <p>The trick behind lossy coding is <a href="#/academy/psy-reflections">masking</a>: a loud sound makes quieter sounds near it in frequency (and just before or after it in time) inaudible. The coder splits the signal into many narrow bands, works out the masking threshold for each short block of time, and then gives each band only enough bits to keep its own quantising noise <i>under</i> that threshold.</p>`, viz: 'codecLab' },
      { h: 'Coding artefacts and preparing masters for streaming', html: `
        ${tbl(['Artefact', 'What it sounds like', 'When it shows'], [
          ['Loss of highs', 'Dull, closed-in top end', 'Low bit rates: the coder lowers its cut-off to save bits'],
          ['Pre-echo', 'A puff of noise just before a sharp hit', 'Castanets, claps, plucked strings — the block is longer than the silence before the hit'],
          ['Swirling / “underwater”', 'Watery, phasey cymbals and reverb tails', 'Dense, noisy material at modest rates'],
          ['Birdies', 'Chirps and warbles around sustained tones', 'Bands switching on and off from block to block'],
          ['Stereo collapse', 'Image narrows or wanders', 'Very low rates, where the two channels share bits'],
        ])}
        ${flow([['Finish at full quality', '24-bit PCM at the session sample rate'], ['Leave true-peak room', 'Peaks at about −1 dBTP: the decoder can overshoot'], ['Do not over-limit', 'Crushed masters decode with more distortion'], ['Audition the codec', 'Listen through the target format before approval'], ['Deliver PCM', 'Let the service make its own encodes'], ['Never re-encode lossy', 'Each generation discards different detail']])}
        <div class="callout warn">Why headroom matters: after coding, the waveform is rebuilt from fewer components, so its peaks land in slightly different places — often a little <i>higher</i>. A master that touches 0 dB can clip in the listener's player even though your file never did. See <a href="#/academy/r-mastering">mastering</a>.</div>
        ${myth([['“A 320 kbit/s file converted back to PCM is a master again.”', 'The discarded detail does not come back; the file just gets bigger. Keep the real master.'], ['“Higher sample rates make lossy files sound better.”', 'The coder throws away the ultrasonic content first. Feed it clean 44.1 or 48 kHz.'], ['“Sample-rate conversion and dither are optional.”', 'Convert once, with a good converter, and dither whenever word length is reduced — see <a href="#/academy/a-digital">digital audio</a>.']])}` },
      { h: 'Archiving and migration', html: `
        <p>Tapes stick, discs rot, drives die quietly and formats fall out of use. An archive is not a shelf — it is a <b>routine</b>.</p>
        ${SVG_321}
        <ul>
          <li><b>Format:</b> uncompressed or lossless PCM, 24-bit, at the original sample rate, in a widely used open container. Never archive only a lossy file or a session that needs one particular program to open.</li>
          <li><b>What to keep:</b> the final masters; the mix stems; the consolidated multitrack (every track as a file starting from zero); the session file; and a plain-text note listing tempo, sample rate, song key, who played what and which take is which.</li>
          <li><b>Checksums:</b> a short fingerprint calculated from every byte of a file. Store it next to the file. If a later check gives a different fingerprint, the file has silently changed — restore it from another copy.</li>
          <li><b>Migration:</b> copy the whole archive to fresh storage every few years, verify, and only then retire the old copy.</li>
          <li><b>Old analogue media:</b> transfer once, carefully, at high resolution and with no processing; the transfer becomes the new master (more in <a href="#/academy/r-restoration">R12</a>).</li>
        </ul>`, viz: 'archivePlanner' },
      { h: 'Choosing a format for delivery', html: `
        ${tbl(['Destination', 'Deliver', 'Watch out for'], [
          ['Streaming services', '24-bit PCM, 44.1 or 48 kHz, peaks ≤ −1 dBTP', 'Loudness normalisation: very loud masters are simply turned down'],
          ['Compact disc', '16-bit, 44.1 kHz with dither; the disc image with track marks and codes', 'Gaps, track order and text must be final'],
          ['Vinyl', 'A separate, less limited master, 24-bit; one file per side with timings', 'Side length, mono bass, sibilance, song order'],
          ['Film, video, broadcast', '48 kHz, 24-bit, timestamped files; stems if asked', 'The programme loudness target of the broadcaster'],
          ['Another studio or mixer', 'Consolidated 24-bit multitrack, all files from the same start point', 'Label every file clearly; include a rough mix'],
          ['Client approval copy', 'A good lossy file is fine', 'Mark it “reference — not for release”'],
        ])}
        <div class="uc-grid">
          ${uc('💿', 'One album, three masters', [['Problem', 'The label wants streaming, disc and vinyl from one mix'], ['Approach', 'Master the streaming version first; derive the 16-bit disc version with dither; make a vinyl pre-master with less limiting, mono lows and tamed sibilance'], ['Result', 'Each format gets what it can physically carry']], 'var(--accent)')}
          ${uc('📻', 'Podcast with music', [['Problem', 'Listeners complain of “watery” music under the voice'], ['Cause', 'Low-rate mono coding of dense stereo music'], ['Fix', 'Raise the bit rate one step, or use simpler, less busy music beds; export from PCM, not from an earlier lossy file']], 'var(--accent2)')}
          ${uc('🗄️', 'Studio closing down', [['Problem', 'Twenty years of sessions on ageing drives and tapes'], ['Approach', 'List everything; transfer tapes first (they decay fastest); consolidate sessions to plain files; three copies with checksums'], ['Result', 'Recordings that can still be opened in twenty more years']], 'var(--c3)')}
        </div>
        <div class="callout example"><b>Apply it.</b> Take your latest mix. (1) Export 24-bit PCM. (2) Make a lossless copy and confirm it unpacks bit-identical. (3) Encode a lossy copy at a low and a high bit rate and listen for the artefacts in the table. (4) Write the checksum of the master into a text file beside it.</div>` },
    ],
    quiz: [
      { q: 'Why is an ultrasonic bias signal added when recording to tape?', opts: ['To erase the tape', 'To shake the magnetic particles so that quiet audio is recorded without distortion', 'To make the tape run at a steady speed', 'To add treble'], a: 1, why: 'Magnetic particles respond poorly to small signals on their own; bias keeps them in the linear part of their behaviour.' },
      { q: 'On replay, the standard vinyl equalisation curve…', opts: ['Boosts bass and cuts treble, mirroring what was done on cutting', 'Cuts bass and boosts treble', 'Is flat', 'Only removes hum'], a: 0, why: 'Bass was reduced and treble raised on cutting to save groove space and beat surface noise; replay does the opposite.' },
      { q: 'Why must deep bass be centred (mono) on a vinyl master?', opts: ['Mono is louder', 'Out-of-phase bass becomes vertical groove movement that can make the stylus jump', 'Turntables are mono below 1 kHz', 'To save pressing cost'], a: 1, why: 'Opposite-polarity signals move the groove up and down; large vertical swings cause mistracking or cutter lift.' },
      { q: 'What makes perceptual (lossy) coding possible?', opts: ['Faster processors', 'Masking: loud sounds hide nearby quieter ones, so those need not be stored accurately', 'Removing all bass', 'Lower sample rates only'], a: 1, why: 'The coder keeps its quantising noise below the masking threshold computed for each short block.' },
      { q: 'Which statement about archiving is correct?', opts: ['One good drive is enough', 'Lossy files are fine as the only master', 'Keep at least three copies on two kinds of storage with one off site, and verify checksums', 'Checksums improve sound quality'], a: 2, why: 'Storage fails silently; several verified copies in different places are the only real protection.' },
    ],
  });

  /* ================================ R12 ================================ */
  window.LESSONS.push({
    id: 'r-restoration', n: 'R12', track: 'recording', title: 'Noise Reduction and Audio Restoration', level: 'Core', mins: 32,
    summary: 'How to recognise hiss, hum, buzz, clicks, crackle, clipping, rumble and room sound; which tool removes each one; the order to work in; and how to stop before the cure sounds worse than the disease.',
    tags: ['noise reduction', 'restoration', 'hiss', 'hum', 'click', 'crackle', 'de-clip', 'expander', 'gate', 'spectral', 'de-reverb', 'dialogue', 'archive transfer'],
    sections: [
      { h: 'Name the fault before you reach for a tool', html: `
        ${SAFE}
        <p>“Noise” is not one thing. Each fault has its own fingerprint in <b>time</b> (constant, or brief?) and in <b>frequency</b> (one pitch, a set of pitches, or everything?). The fingerprint tells you which tool can separate it from the music.</p>
        ${SVG_FAULTS}
        ${tbl(['Fault', 'Sounds like', 'In time', 'In frequency', 'First-choice tool'], [
          ['Hiss', '“shhh”', 'Constant', 'Everywhere', 'Spectral reduction, gentle expander'],
          ['Hum', 'Low drone', 'Constant', 'Mains frequency + a few multiples', 'Narrow notch filters'],
          ['Buzz', 'Raspy edge', 'Constant', 'Many mains multiples, up into the kilohertz', 'Comb of notches / hum remover'],
          ['Clicks, pops', '“tick”, “tock”', 'A millisecond or less', 'Everywhere, briefly', 'De-click (detect and redraw)'],
          ['Crackle', 'Frying, fizzing', 'Hundreds of tiny clicks a second', 'Everywhere', 'De-crackle'],
          ['Clipping', 'Harsh, flat-topped crunch', 'On peaks only', 'Added high harmonics', 'De-clip (rebuild the peaks)'],
          ['Rumble, wind, plosives', 'Thumps and roar', 'Bursts', 'Below about 100–200 Hz', 'High-pass filter, low-band reduction'],
          ['Room tone, reverb', 'Distant, boxy, echoey', 'Follows every sound', 'Same as the source', 'De-reverb (limited); better microphone position'],
          ['Wow, speed drift', 'Pitch wobble', 'Slow', '—', 'Pitch/time correction; fix the transport'],
          ['Azimuth / phase error', 'Hollow, dull mono', 'Constant', 'Worse at high frequencies', 'Realign the head; time-align the channels'],
        ])}` },
      { h: 'Prevention beats cure, every time', html: `
        <p>No repair tool is free: each one removes a little of the wanted sound along with the fault. Ten minutes of prevention at the session saves hours of restoration — and sounds better.</p>
        <div class="uc-grid">
          ${uc('🎛️', 'Hiss', [['Cause', 'Too little level at the microphone preamp, then gain added later'], ['Do', 'Set gain so peaks sit comfortably high at the <i>first</i> stage; move the mic closer; choose a quieter mic for quiet sources']], 'var(--accent)')}
          ${uc('🔌', 'Hum and buzz', [['Cause', 'Ground loops, unbalanced cables, dimmers, chargers, guitars near transformers'], ['Do', 'Balanced lines, one clean power feed, lift the problem at its source — see the <a href="#/academy/a-ground">grounding course</a>']], 'var(--warn)')}
          ${uc('🌬️', 'Rumble, wind, pops', [['Cause', 'Footfall through the stand, air-conditioning, breath blasts'], ['Do', 'Shock mount, pop filter, windshield, the mic slightly off-axis from the mouth, high-pass at the preamp']], 'var(--c3)')}
          ${uc('📈', 'Clipping', [['Cause', 'Levels set for the rehearsal, not the performance'], ['Do', 'Leave 12–18 dB of headroom in 24-bit recording; a clipped take is the hardest fault of all to repair']], 'var(--bad)')}
          ${uc('🏠', 'Too much room', [['Cause', 'Microphone too far away in a live space'], ['Do', 'Halve the distance; use a more directional pattern; hang absorbers behind and beside the performer']], 'var(--accent2)')}
        </div>
        <div class="callout mentor">Always record 10–20 seconds of “silence” in the same set-up — the room and the equipment noise with nobody playing. It is the <b>noise print</b> that spectral tools learn from, and the filler an editor needs to cover gaps.</div>` },
      { h: 'Companding: the classic noise reduction for analogue media', html: `
        <p>Tape hiss is fixed in level. Quiet music sits close to it; loud music covers it. So: <b>turn the quiet passages up before they reach the tape, and turn them back down afterwards.</b> The music returns to its original level — and the hiss, which was added in between, is turned down along with it. Compress + expand = <i>compand</i>.</p>
        ${SVG_COMPAND}
        <ul>
          <li>Practical systems work mostly on the <b>treble</b>, where hiss is most audible, or split the spectrum into several bands so that a loud bass note does not “open the door” for hiss in the treble.</li>
          <li>They are <b>double-ended</b>: the recording must be decoded by the matching system, lined up to the same reference level. Otherwise the expander does not undo exactly what the compressor did.</li>
        </ul>
        ${tbl(['Symptom of mistracking', 'Likely cause'], [
          ['Bright, squashed, “breathing” sound', 'An encoded tape played back with no decoding'],
          ['Dull, pumping sound', 'A non-encoded tape played through the decoder'],
          ['Hiss swishing up and down behind notes', 'Record and replay levels do not match; lost treble on the tape'],
        ])}
        <div class="callout data">When transferring an old tape, find out which noise-reduction system (if any) was used and line the decoder up to the tones on the reel. If in doubt, make one flat transfer with no decoding as well — it can always be decoded later.</div>` },
      { h: 'Filters for rumble and hum', html: `
        <p>When a fault lives at frequencies the music does not need, a plain filter is the cleanest fix.</p>
        <ul>
          <li><b>High-pass</b> at 60–100 Hz clears rumble, footfall and plosive thumps from voices and most instruments. Steeper slopes remove more but can thin a deep voice.</li>
          <li><b>Notch filters</b> take a very narrow slice out at one frequency. Hum needs one at the mains frequency (50 or 60 Hz) and one at each audible multiple: 100, 150, 200… or 120, 180, 240…</li>
          <li><b>Sharpness (Q)</b> is the trade-off. A narrow notch leaves the music almost untouched but must sit exactly on the hum; a wide one is forgiving but punches holes in bass notes.</li>
        </ul>
        <div class="formula"><span class="lbl">Width of a notch</span> width (Hz) ≈ centre frequency ÷ Q &nbsp;→&nbsp; 50 Hz at Q = 25 is only 2 Hz wide</div>
        <div class="callout alt">Try a smooth hum, then an edgy buzz. Count how many notches the buzz really needs, and watch the “notes dented” figure climb as the notches get wider.</div>`, viz: 'humNotch' },
      { h: 'Gates and downward expanders', html: `
        <p>An <b>expander</b> turns the level down whenever the signal drops below a threshold; a <b>gate</b> is an expander with an extreme ratio — nearly “off”. They do nothing while the music plays; they simply stop you hearing the noise in the pauses.</p>
        ${tbl(['Control', 'What it does', 'Starting point for speech'], [
          ['Threshold', 'Level below which gain reduction begins', '6–10 dB above the noise floor'],
          ['Ratio', 'How steeply level falls below threshold', '1:2 to 1:3 (gentle)'],
          ['Range', 'The most it is allowed to cut', '10–15 dB, not silence'],
          ['Attack', 'How fast it opens when sound returns', 'Under 1–2 ms'],
          ['Release / hold', 'How slowly it closes again', '100–300 ms; follow the natural decay'],
        ])}
        <p>Three ways it goes wrong — all visible in the tool:</p>
        <ul>
          <li><b>Chatter:</b> threshold inside the noise; the gate flickers. Raise the threshold, lengthen the release or add hold.</li>
          <li><b>Clipped starts:</b> attack too slow; the first consonant or drum transient is shaved off.</li>
          <li><b>Pumping noise:</b> too much range; the hiss leaps in with every word and out after it, which is more distracting than steady hiss.</li>
        </ul>`, viz: 'expanderGate' },
      { h: 'Clicks, crackle and clipping', html: `
        <p>A click is a few damaged samples. The repair has two steps: <b>detect</b> where the waveform does something no musical signal would do — an impossibly sudden jump — and then <b>interpolate</b>: throw the damaged samples away and redraw them from the healthy audio on each side.</p>
        ${flow([['Detect', 'Look for sudden jumps far larger than the local average'], ['Mark', 'Flag the bad samples plus a small margin'], ['Redraw', 'Predict the missing stretch from before and after'], ['Check', 'Listen to what was removed — it should be clicks only']])}
        <ul>
          <li><b>Crackle</b> is thousands of tiny clicks. De-crackle uses a lower threshold and gentler repair; push it too far and the top end goes soft and “plastic”.</li>
          <li><b>De-clip</b> treats every flat-topped peak as a gap and rebuilds a plausible rounded peak above it. Lower the level first — the rebuilt peaks need somewhere to go.</li>
          <li><b>Thumps and pops</b> (plosives, record warps, mic knocks) are low-frequency versions; they need longer repair windows or a dedicated low-band tool.</li>
        </ul>
        <div class="callout warn">A drum hit, a plucked string and a consonant also start with a sudden jump. Set the detector too keen and it “repairs” them — the over-de-clicked sound is dull and lifeless. Find the setting in the tool where every click is caught but the drum hit is left alone.</div>`, viz: 'declickDemo' },
      { h: 'Spectral noise reduction, repair and machine-learning tools', html: `
        ${SVG_SPECSUB}
        <p><b>Spectral noise reduction</b> splits the sound into hundreds of narrow bands in short slices of time. From a stretch of noise alone it learns how much noise each band usually holds. Then, slice by slice, any band holding little more than that amount is turned down; bands clearly holding music are left alone.</p>
        <ul>
          <li>Used gently (6–12 dB) it is remarkably transparent. Used hard, bands near the limit switch on and off at random — a twittering, watery residue called <b>musical noise</b> — and the quiet tails of notes and reverbs disappear.</li>
          <li>The noise print must match: if the hiss changes (a fader move, a different take), learn it again.</li>
        </ul>
        <p><b>Spectral repair</b> shows the recording as a picture — time across, frequency up, brightness for level — and lets you select a cough, a chair squeak or a phone ring and replace just that patch with material invented from its surroundings. It is slow, manual and astonishingly effective on short, isolated events.</p>
        <p><b>Machine-learning separators</b> have been trained on vast numbers of examples to tell speech from everything else, or one instrument from another. They power modern dialogue isolation and de-reverb. Their limits:</p>
        ${myth([['“The new tools can rescue anything.”', 'They guess. On hard material they smear consonants, add a synthetic sheen, or drop quiet words entirely. Always compare with the original.'], ['“De-reverb gives a dry studio sound.”', 'It can reduce the tail; it cannot restore the directness of a close microphone. Keep some room or it sounds processed.'], ['“More reduction is better.”', 'Listeners forgive steady, low noise. They do not forgive artefacts that come and go with the voice.']])}`, viz: 'denoiseLab' },
      { h: 'Order of operations — and knowing when to stop', html: `
        ${SVG_ORDER}
        <p>Why this order? Clicks are broadband: left in, they smear through every later filter and confuse the noise print. Hum is steady and narrow: removing it next lets the broadband stage learn hiss alone. EQ and dynamics come last because they change the level and tone that all the earlier detectors depend on.</p>
        <div class="callout mentor"><b>How much is enough?</b>
          <ul style="margin:6px 0 0;padding-left:18px">
            <li>Aim to make the noise <i>unnoticeable</i>, not absent. Leave a little — a dead-silent background sounds unnatural and exposes every edit.</li>
            <li>Judge in context: with the music or picture, at normal listening level, not soloed at full volume.</li>
            <li>Compare before and after at <b>matched loudness</b>. Quieter often seems “cleaner” for the wrong reason.</li>
            <li>Listen to the <b>removed</b> signal alone. If you can make out words or notes in it, you are taking music.</li>
            <li>Take breaks. Ears stop hearing artefacts after a few minutes of staring at them.</li>
          </ul></div>
        <div class="callout warn"><b>Integrity.</b> Restoration changes evidence. For legal, historical or journalistic recordings, never work on the only copy, keep the untouched original, log every process, and do not remove or alter content in ways that change its meaning. Enhancement for clarity is one thing; editing what was said is another.</div>` },
      { h: 'Transferring old media', html: `
        <p>With an old tape, disc or cassette, the playback is the precious moment — the carrier may not survive many more. Get the best possible signal off it once; do all the “improving” afterwards on copies.</p>
        ${flow([['Inspect and clean', 'Mould, sticky coating, warps, dirt — treat before playing'], ['Best playback', 'Right speed, right equalisation, aligned head or correct stylus size'], ['Capture flat', '24-bit, 96 kHz, no processing, generous headroom'], ['Document', 'Carrier, machine, settings, date, faults noticed'], ['Preserve', 'Checksum; three copies; this is the new master'], ['Restore a copy', 'Clicks → hum → hiss → tone; keep each stage']])}
        ${tbl(['Carrier', 'Typical problems', 'Transfer tip'], [
          ['Open-reel tape', 'Sticky binder, print-through, unknown speed or noise reduction', 'Adjust azimuth by ear for maximum treble in mono; note any tones on the reel'],
          ['Cassette', 'Azimuth error, dull highs, speed drift', 'Align azimuth for each tape; check which noise reduction was used'],
          ['Vinyl', 'Clicks, crackle, warps, inner-groove distortion', 'Wet-clean the disc; correct tracking force; transfer in stereo even if the record is mono'],
          ['Older coarse-groove discs', 'Heavy surface noise, non-standard curves and speeds', 'Larger stylus; try several sizes; apply the right curve afterwards'],
          ['Early digital tape and discs', 'Drop-outs, obsolete players', 'Transfer digitally if possible; do not delay — the machines are disappearing'],
        ])}
        <div class="callout physics">Why capture a mono record in stereo? The two groove walls wear differently and clicks rarely damage both equally. You can later choose the cleaner wall, or combine them so the music adds and much of the noise does not.</div>` },
      { h: 'Workflows and use cases', html: `
        <div class="uc-grid">
          ${uc('🎙️', 'Interview recorded in a café', [['Faults', 'Clatter, music in the background, plosives, a refrigerator hum'], ['Approach', 'High-pass at 80 Hz; notch the hum; dialogue isolation at a moderate setting mixed 70/30 with the original; repair the worst clatter by hand'], ['Stop when', 'The voice is easy to follow. A café should still sound a little like a café']], 'var(--accent)')}
          ${uc('🎸', 'Guitar amp with buzz', [['Faults', 'Edgy buzz from a dimmer, hiss from high gain'], ['Approach', 'Hum remover with many harmonics during pauses only (automate it); a gentle expander keyed to the playing'], ['Better fix', 'Turn the guitar away from the transformer and switch the dimmer off before the take']], 'var(--warn)')}
          ${uc('📼', 'Family tape from decades ago', [['Faults', 'Hiss, dull top, wow, a 50 Hz hum'], ['Approach', 'Azimuth-aligned flat transfer; notch hum; 8 dB of spectral reduction; a small treble lift afterwards'], ['Stop when', 'Voices are clear. The slight hiss left behind is part of the document']], 'var(--c3)')}
          ${uc('🎻', 'Live concert recording', [['Faults', 'Air-conditioning rumble, audience coughs, one clipped climax'], ['Approach', 'Low-band reduction rather than a steep high-pass (keep the hall\'s low end); spectral repair on coughs in quiet bars; de-clip the climax'], ['Avoid', 'Broadband reduction that strips the hall\'s natural reverb tail']], 'var(--accent2)')}
          ${uc('🎬', 'Dialogue for picture', [['Faults', 'Every shot has a different background'], ['Approach', 'Clean each clip lightly, then lay continuous room tone underneath so the cuts disappear'], ['Rule', 'Consistency between shots matters more than how clean any single one is']], 'var(--good)')}
        </div>
        ${tbl(['Rule of thumb', ''], [
          ['Fix it at the source', 'Any repair costs quality; a second take costs minutes'],
          ['Smallest tool first', 'A filter before a notch, a notch before spectral reduction, anything before machine learning'],
          ['6–12 dB is plenty', 'Beyond that, artefacts grow faster than the benefit'],
          ['Automate, do not blanket', 'Apply repair only where the fault is audible'],
          ['Keep every stage', 'Save the transfer and each processed version so you can go back'],
        ])}
        <div class="callout example"><b>Apply it.</b> Record yourself speaking near a computer fan with the gain set too low. Then: (1) note each fault you hear; (2) fix in the order clicks → hum → hiss; (3) match loudness and compare; (4) listen to the removed signal. Finally re-record with the gain right and the fan off — and compare <i>that</i>.</div>` },
    ],
    quiz: [
      { q: 'Which tool best suits a steady 50 Hz hum with two or three harmonics?', opts: ['Broadband spectral reduction at maximum', 'A noise gate', 'Narrow notch filters at 50 Hz and its multiples', 'A low-pass filter'], a: 2, why: 'Hum is steady and narrow in frequency, so narrow notches remove it while touching very little music.' },
      { q: 'How does companding reduce tape hiss?', opts: ['It filters out all treble', 'It raises quiet passages before the tape and lowers them after, so the hiss added in between is lowered too', 'It records at half speed', 'It gates the output'], a: 1, why: 'Compress on record, expand on replay: the music returns to its level, the hiss ends up lower.' },
      { q: 'A gate “chatters” on a noisy vocal. The most likely cause is…', opts: ['Attack too slow', 'Threshold set within the noise level, with a short release', 'Range too small', 'Sample rate too low'], a: 1, why: 'When noise itself keeps crossing the threshold the gate flickers; raise the threshold or lengthen release/hold.' },
      { q: 'What is the recommended order of repair?', opts: ['EQ, hiss, hum, clicks', 'Clicks, then hum, then broadband noise, then EQ and dynamics', 'Hiss first, always', 'Order does not matter'], a: 1, why: 'Short broadband faults go first; steady narrow ones next; broadband last; tone and level only after cleaning.' },
      { q: 'What causes “musical noise” (a twittering, watery residue)?', opts: ['Too little noise reduction', 'Over-aggressive spectral reduction switching bands on and off at random', 'A missing pop filter', 'Vinyl surface wear'], a: 1, why: 'Bands hovering near the noise estimate are passed in one slice and removed in the next, leaving random chirps.' },
    ],
  });

  /*__LESSONS34__*/
})();
