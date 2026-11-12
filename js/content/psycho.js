/* ==========================================================================
   Academy — listening science (acoustics track, after "hearing"):
   4A How we hear rooms · 4B Judging loudspeakers · 4C Audio facts and myths.
   Original text; no sources quoted.
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const uc = (ico, title, rows, col) => `<div class="uc" style="${col ? `border-top-color:${col}` : ''}"><h4><span class="uc-ico">${ico}</span>${title}</h4><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd class="${/fix|do|design|result/i.test(k) ? 'fix' : ''}">${v}</dd>`).join('')}</dl></div>`;
  const myth = (pairs) => `<div class="myth">${pairs.map(([m, r]) => `<div class="m">${m}</div><div class="r">${r}</div>`).join('')}</div>`;
  const binom = (n, c) => { let p = 0; const C = (nn, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (nn - k + i)) / i; return r; }; for (let k = c; k <= n; k++) p += C(n, k); return p / Math.pow(2, n); };

  /* ------------------------------ diagrams ------------------------------ */
  const SVG_TIMELINE = `<svg class="gsvg" viewBox="0 0 680 220" role="img" aria-label="Arrival of direct sound, early reflections and reverberation">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">What reaches your ear after one sharp sound</text>
    <line x1="50" y1="170" x2="650" y2="170" stroke="var(--muted)"/>
    <rect x="68" y="46" width="8" height="124" fill="var(--good)"/><text x="72" y="38" text-anchor="middle" font-size="11" font-weight="700" fill="var(--good)">direct</text>
    ${[[120, 70], [150, 58], [176, 74], [205, 50], [236, 60]].map(([x, hh]) => `<rect class="leak-pulse" x="${x}" y="${170 - hh}" width="6" height="${hh}" fill="var(--warn)"/>`).join('')}
    ${Array.from({ length: 46 }, (_, i) => { const x = 270 + i * 8, hh = 52 * Math.exp(-i / 14) * (0.6 + 0.4 * Math.abs(Math.sin(i * 2.3))); return `<rect x="${x}" y="${170 - hh}" width="4" height="${hh}" fill="var(--c3)" opacity=".8"/>`; }).join('')}
    <text x="178" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="var(--warn)">early reflections</text><text x="178" y="188" text-anchor="middle" font-size="10" fill="var(--muted)">first ≈ 50 ms: fused with the direct sound</text>
    <text x="450" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="var(--c3)">reverberation</text><text x="450" y="188" text-anchor="middle" font-size="10" fill="var(--muted)">dense, from all directions: “the room”</text>
    <text x="72" y="188" text-anchor="middle" font-size="10" fill="var(--muted)">tells where</text>
    <text x="640" y="206" text-anchor="end" font-size="10" fill="var(--muted)">time →</text>
  </svg>`;

  const SVG_DIRECTIONS = `<svg class="gsvg" viewBox="0 0 680 240" role="img" aria-label="Reflections from the side and from the front or above are heard differently">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The same reflection, two directions, two results</text>
    ${[[170, 'From the side (lateral)', 'ears receive it differently → width, spaciousness', true], [510, 'From front, back or above', 'both ears receive the same → tone change, no width', false]].map(([cx, t, s, lat]) => `<g>
      <circle cx="${cx}" cy="130" r="26" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="${cx - 26}" cy="130" r="5" fill="var(--text)"/><circle cx="${cx + 26}" cy="130" r="5" fill="var(--text)"/><path d="M${cx - 6} 106 l6 -10 l6 10" fill="none" stroke="var(--text)" stroke-width="2"/>
      <path d="M${cx} 40 L${cx} 100" stroke="var(--good)" stroke-width="3"/><text x="${cx + 8}" y="56" font-size="10" fill="var(--good)">direct</text>
      ${lat ? `<path class="leak-pulse" d="M${cx + 140} 96 L${cx + 36} 126" stroke="var(--warn)" stroke-width="3"/><text x="${cx + 96}" y="92" font-size="10" fill="var(--warn)">reflection</text>` : `<path class="leak-pulse" d="M${cx + 22} 36 L${cx + 6} 100" stroke="var(--warn)" stroke-width="3"/><text x="${cx + 34}" y="70" font-size="10" fill="var(--warn)">reflection</text>`}
      <text x="${cx}" y="190" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="${cx}" y="208" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`).join('')}
    <text x="340" y="232" text-anchor="middle" font-size="10" fill="var(--muted)">View from above; the small triangle is the nose.</text>
  </svg>`;

  const SVG_PHANTOM = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Phantom centre image and what happens off centre">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">The phantom centre exists only on the centre line</text>
    ${[[170, 0, 'On the centre line', 'equal time and level → image in the middle'], [510, 42, 'One seat to the side', 'nearer speaker arrives first → image collapses to it']].map(([cx, off, t, s]) => `<g>
      <rect x="${cx - 110}" y="44" width="22" height="28" fill="var(--accent)"/><rect x="${cx + 88}" y="44" width="22" height="28" fill="var(--accent)"/>
      <circle cx="${cx + off}" cy="170" r="12" fill="var(--good)"/>
      <path d="M${cx - 99} 72 L${cx + off} 158 M${cx + 99} 72 L${cx + off} 158" stroke="var(--muted)" stroke-dasharray="4 4"/>
      <ellipse class="hot" cx="${cx + (off ? 86 : 0)}" cy="${off ? 66 : 60}" rx="${off ? 16 : 22}" ry="12" fill="var(--c3)" opacity=".75"/>
      <text x="${cx + (off ? 86 : 0)}" y="${off ? 96 : 92}" text-anchor="middle" font-size="10" fill="var(--c3)">voice appears here</text>
      <text x="${cx}" y="204" text-anchor="middle" font-size="12" font-weight="700">${t}</text><text x="${cx}" y="220" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`).join('')}
  </svg>`;

  const SVG_BLIND = `<svg class="gsvg" viewBox="0 0 680 200" role="img" aria-label="Sighted versus blind loudspeaker comparison">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Same four loudspeakers, judged two ways</text>
    ${[['Seeing them', [7.6, 6.6, 6.9, 4.1], 40], ['Behind a curtain, levels matched', [6.2, 6.6, 5.4, 6.1], 370]].map(([t, v, x0]) => `<g>
      <text x="${x0 + 130}" y="40" text-anchor="middle" font-size="11" font-weight="700">${t}</text>
      <line x1="${x0}" y1="160" x2="${x0 + 270}" y2="160" stroke="var(--muted)"/>
      ${v.map((s, i) => `<rect x="${x0 + 16 + i * 64}" y="${160 - s * 13}" width="40" height="${s * 13}" rx="4" fill="var(--${['accent', 'good', 'c3', 'accent2'][i]})"/><text x="${x0 + 36 + i * 64}" y="176" text-anchor="middle" font-size="10">${['costly', 'plain', 'famous', 'cheap'][i]}</text>`).join('')}</g>`).join('')}
    <text x="340" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">Illustrative: when listeners cannot see, size, price and badge stop voting. Ratings then follow the measured sound.</text>
  </svg>`;

  const SVG_SPIN = `<svg class="gsvg" viewBox="0 0 680 250" role="img" aria-label="Where each measurement curve comes from">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">One speaker, measured all round: four averages</text>
    <rect x="320" y="110" width="40" height="52" rx="4" fill="var(--panel2)" stroke="var(--text)" stroke-width="2"/><circle cx="340" cy="142" r="10" fill="none" stroke="var(--text)" stroke-width="2"/><circle cx="340" cy="122" r="4" fill="var(--text)"/>
    <circle cx="340" cy="136" r="100" fill="none" stroke="var(--accent2)" stroke-dasharray="3 5"/>
    <path d="M340 136 L340 36" stroke="var(--accent)" stroke-width="4"/>
    <path d="M340 136 L305 44 A 100 100 0 0 1 375 44 Z" fill="var(--good)" opacity=".3"/>
    <path class="leak-pulse" d="M340 136 L256 82 M340 136 L424 82 M340 136 L246 170 M340 136 L434 170" stroke="var(--c3)" stroke-width="2.5"/>
    <text x="346" y="34" font-size="11" font-weight="700" fill="var(--accent)">① on axis</text>
    <text x="120" y="58" font-size="11" font-weight="700" fill="var(--good)">② listening window</text><text x="120" y="72" font-size="10" fill="var(--muted)">average over a small cone:</text><text x="120" y="86" font-size="10" fill="var(--muted)">what seats near the axis get</text>
    <text x="470" y="96" font-size="11" font-weight="700" fill="var(--c3)">③ early reflections</text><text x="470" y="110" font-size="10" fill="var(--muted)">directions that hit floor,</text><text x="470" y="124" font-size="10" fill="var(--muted)">ceiling, side and rear walls</text>
    <text x="470" y="196" font-size="11" font-weight="700" fill="var(--accent2)">④ sound power</text><text x="470" y="210" font-size="10" fill="var(--muted)">everything, in all directions:</text><text x="470" y="224" font-size="10" fill="var(--muted)">feeds the reverberation</text>
    <text x="120" y="196" font-size="11" font-weight="700" fill="var(--warn)">⑤ directivity index</text><text x="120" y="210" font-size="10" fill="var(--muted)">① minus ④: how much more</text><text x="120" y="224" font-size="10" fill="var(--muted)">goes forward than elsewhere</text>
  </svg>`;

  const SVG_RES = `<svg class="gsvg" viewBox="0 0 680 190" role="img" aria-label="A resonance versus an interference dip">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Two blemishes that look alike and sound very different</text>
    ${[['Resonance: a bump in every direction', 'rings on after the note — audible even when small', 60, true], ['Interference dip: moves with angle', 'narrow, changes with position — often inaudible', 380, false]].map(([t, s, x0, res]) => `<g>
      <rect x="${x0}" y="34" width="250" height="100" fill="var(--panel2)" stroke="var(--line)"/>
      ${[0, 1, 2].map((k) => `<path d="M${x0 + 8} ${70 + k * 16} H${x0 + (res ? 96 : 80 + k * 26)} q 12 0 ${res ? '18 -18' : '14 22'} q ${res ? '8 -8 16 0' : '4 8 8 0'} q ${res ? '6 18 18 18' : '6 -22 14 -22'} H${x0 + 242}" fill="none" stroke="var(--${['accent', 'c3', 'accent2'][k]})" stroke-width="2"/>`).join('')}
      <text x="${x0 + 125}" y="154" text-anchor="middle" font-size="11" font-weight="700">${t}</text><text x="${x0 + 125}" y="170" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text></g>`).join('')}
    <text x="340" y="186" text-anchor="middle" font-size="10" fill="var(--muted)">Three lines in each panel = the same speaker measured at three angles.</text>
  </svg>`;

  const SVG_BIG = `<svg class="gsvg" viewBox="0 0 680 230" role="img" aria-label="Where the large errors in a playback chain are">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">Where the errors are — typical size of each link’s contribution</text>
    ${[['Cables (short runs)', 0.3, 'good', '< 0.1 dB'], ['Converters (DAC/ADC)', 0.6, 'good', '≈ ±0.1 dB'], ['Amplifier (within its limits)', 1, 'good', '≈ ±0.1–0.2 dB'], ['Microphone / headphone', 9, 'warn', '≈ ±2–4 dB'], ['Loudspeaker', 14, 'warn', '≈ ±2–5 dB'], ['Room at low frequencies', 40, 'bad', '≈ ±10–20 dB'], ['Seat and speaker position', 34, 'bad', '≈ ±5–15 dB']].map(([t, v, c, lab], i) => `<text x="212" y="${48 + i * 24}" text-anchor="end" font-size="11">${t}</text><rect x="220" y="${37 + i * 24}" width="${Math.max(3, v * 9)}" height="15" rx="3" fill="var(--${c})"/><text x="${228 + Math.max(3, v * 9)}" y="${48 + i * 24}" font-size="10" fill="var(--muted)">${lab}</text>`).join('')}
    <text x="340" y="220" text-anchor="middle" font-size="10" fill="var(--muted)">Indicative frequency-response deviation. The bars at the bottom are a hundred times the bars at the top.</text>
  </svg>`;

  const SVG_ABX = `<svg class="gsvg" viewBox="0 0 680 170" role="img" aria-label="How an ABX test works">
    <text x="340" y="16" text-anchor="middle" font-size="13" font-weight="700">ABX: can you tell which one X is?</text>
    ${[['A', 'known: version 1', 70, 'accent'], ['B', 'known: version 2', 250, 'c3'], ['X', 'secretly A or B', 430, 'warn']].map(([l, s, x, c]) => `<rect x="${x}" y="40" width="150" height="70" rx="10" fill="var(--panel2)" stroke="var(--${c})" stroke-width="3"/><text x="${x + 75}" y="76" text-anchor="middle" font-size="26" font-weight="800" fill="var(--${c})">${l}</text><text x="${x + 75}" y="98" text-anchor="middle" font-size="10" fill="var(--muted)">${s}</text>`).join('')}
    <circle class="hot" cx="600" cy="75" r="14" fill="var(--warn)"/><text x="600" y="80" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">?</text>
    <text x="340" y="138" text-anchor="middle" font-size="11">Levels matched · switch freely · answer “X is A” or “X is B” · repeat 12–20 times · count the correct answers</text>
    <text x="340" y="158" text-anchor="middle" font-size="10" fill="var(--muted)">If you cannot beat coin-tossing, the difference has not been shown to be audible to you, with that material.</text>
  </svg>`;

  /* ====================================================================== */
  const L1 = {
    id: 'psy-reflections', n: '4A', title: 'How We Hear Rooms: Reflections, the Precedence Effect, Imaging and Space', level: 'Core', mins: 45,
    summary: 'What the ear and brain do with the direct sound, the first reflections and the reverberation — why we locate the source correctly in a reflective room, when reflections add space and when they blur, how phantom images work, and what all of it means for treating a room.',
    tags: ['precedence effect', 'first wavefront', 'early reflections', 'echo threshold', 'spaciousness', 'envelopment', 'phantom image', 'masking', 'critical band', 'adaptation'],
    sections: [
      { h: 'Three things arrive, and the brain treats them differently', html: `
        <p class="lead">A microphone records one messy signal. A listener hears a <b>source</b> in a <b>space</b>. The difference is the processing between the ears: the first arrival tells us <i>where</i> and <i>what</i>; the next few tell us <i>how big</i> and <i>how near</i>; the tail tells us <i>what kind of room</i>.</p>
        ${SVG_TIMELINE}
        ${flow([['Direct sound', 'location, tone, attack'], ['Early reflections', 'fused: loudness, width, intimacy'], ['Late reflections', 'if strong and late: echoes'], ['Reverberation', 'envelopment, size, “wetness”'], ['Adaptation', 'after minutes the room recedes']])}
        <div class="callout physics">This is why a measured frequency response and what you hear can disagree. A graph adds everything that arrives within its time window; hearing separates the first sound from what follows, to a remarkable degree.</div>` },
      { h: 'The precedence effect: the first wavefront wins', html: `
        <p>When the same sound reaches you from two directions a few milliseconds apart, you do not hear two sounds. You hear <b>one</b>, located at whichever arrived <b>first</b>. The later arrival is not thrown away: it makes the sound louder, a little broader and sometimes slightly different in tone — but it does not move the image, unless it is much louder (roughly 10 dB) than the first.</p>
        <div class="table-wrap"><table><tr><th>Delay of the second arrival</th><th>What is heard</th><th>Where it matters</th></tr>
          <tr><td>0 – about 1 ms</td><td><b>Summing localisation:</b> one image somewhere between the two, set by time <i>and</i> level</td><td>Stereo panning, spaced and coincident microphone pairs</td></tr>
          <tr><td>about 1 – 5 ms (clicks) up to 30–50 ms (speech)</td><td><b>Fusion:</b> one sound at the first arrival; later sound adds loudness and width</td><td>First reflections in rooms; delayed fill loudspeakers in halls</td></tr>
          <tr><td>beyond the echo threshold</td><td><b>Echo:</b> a separate repeat</td><td>Rear-wall slap in halls, long delays in sound systems</td></tr></table></div>
        <p>The echo threshold is not one number: sharp transients split after a few milliseconds, running speech after roughly 30–50 ms, slow legato music later still; and a louder delayed sound splits sooner. Try all of it:</p>`, viz: 'precedenceLab' },
      { h: 'What one reflection can do: four possible effects', html: `
        <div class="uc-grid">
          ${uc('↔️', 'Image shift', [['When', 'Strong reflection within about a millisecond, or much louder than the direct sound'], ['Example', 'A speaker beside a hard wall: the image leans toward the wall']])}
          ${uc('🌫️', 'Spaciousness (image broadening)', [['When', 'Reflection from the side, 5–40 ms late, within roughly 10–20 dB of the direct sound'], ['Example', 'Side-wall reflections in a concert hall or a living room']], '#7a5cc7')}
          ${uc('🎚️', 'Tone change', [['When', 'Reflection arrives from nearly the same direction as the direct sound, or very early'], ['Example', 'Desk or console bounce; floor bounce on a single microphone']], '#c7772b')}
          ${uc('📢', 'Echo', [['When', 'Late and strong: beyond the echo threshold'], ['Example', 'Flat rear wall of a hall, 20 m behind the stage']], '#b33')}
        </div>
        <p><b>Comb filtering, heard versus measured.</b> Add a reflection to the direct sound at a microphone and the graph shows deep regular notches. Yet in a room the same reflection is often heard only as “a bit more spacious”. Two reasons: the two ears receive different combs (so the brain does not get one consistent notch pattern), and the reflection comes from a different direction from the source. The comb becomes clearly audible when the reflection comes from the <i>same</i> direction as the direct sound, when it is very early (under about 1–2 ms), or when a single microphone has already summed them into one signal.</p>
        <div class="callout example">Record a voice with one microphone 30 cm above a hard table: the comb is baked into the recording and is obvious. Listen to the same voice live at the same spot with two ears: it sounds almost normal. See <a href="#/academy/interference">Interference &amp; Comb Filtering</a>.</div>` },
      { h: 'Direction matters: side reflections versus front, rear and overhead', html: `
        ${SVG_DIRECTIONS}
        <p>A reflection from the <b>side</b> reaches the two ears at different times and levels. That <i>difference between the ears</i> is what the brain reads as width and space. A reflection from the front, behind or above reaches both ears nearly identically; it adds no width, so what you notice instead is a change of tone.</p>
        <div class="callout data"><b>Rules of thumb.</b> Early lateral energy → apparent source width (the orchestra seems wider than the stage). Late lateral energy → envelopment (being surrounded by the hall). Early ceiling/floor/desk energy → mostly tonal colouration. This is why halls are built narrow with reflective side walls, and why the ceiling above a mix position is usually absorbed first.</div>` },
      { h: 'When reflections help and when they hurt', html: `
        <div class="table-wrap"><table><tr><th>Situation</th><th>Early reflections…</th><th>Why</th><th>Design response</th></tr>
          <tr><td>Speech in a classroom or meeting room</td><td><span class="good">help</span> (within ≈ 50 ms)</td><td>They add useful loudness to the direct sound; later energy smears syllables</td><td>Reflective surface near the talker and overhead; absorb the rear and upper walls</td></tr>
          <tr><td>Concert hall</td><td><span class="good">help</span> (lateral)</td><td>Width, intimacy, loudness</td><td>Narrow plan, side-wall and balcony-front reflections; diffusion</td></tr>
          <tr><td>Relaxed music listening at home</td><td><span class="good">often preferred</span></td><td>Side reflections add spaciousness that most listeners like — <i>if</i> the loudspeaker’s off-axis sound is as neutral as its direct sound</td><td>Leave or diffuse side walls; choose speakers with smooth directivity</td></tr>
          <tr><td>Critical mixing / mastering</td><td><span class="warn">reduce</span></td><td>Precise image placement and hearing the recording’s own space, not the room’s</td><td>Absorb or redirect first reflections; keep left and right identical</td></tr>
          <tr><td>Home cinema / immersive</td><td><span class="warn">control</span></td><td>Many channels already supply the space; room reflections blur their positions</td><td>Absorption at reflection points, particularly rear and ceiling</td></tr>
          <tr><td>Any room: strong, very early reflection from a close surface</td><td><span class="bad">hurt</span></td><td>Tonal colouration and image pull</td><td>Move the speaker or seat; absorb that spot</td></tr>
          <tr><td>Any room: late, strong, isolated reflection</td><td><span class="bad">hurt</span></td><td>Echo</td><td>Absorb, tilt or diffuse the offending surface</td></tr></table></div>
        <div class="callout mentor">“Should I absorb the side-wall reflections?” has no single answer. It depends on the job of the room and on the quality of the loudspeakers’ off-axis sound. See <a href="#/academy/m-control">Control Rooms</a> and <a href="#/academy/m-redirect">Sound Redirectors and Absorbers</a>.</div>` },
      { h: 'Phantom images and the stereo seat', html: `
        ${SVG_PHANTOM}
        <p>Two loudspeakers create a <b>phantom</b> image by summing localisation: equal signals arriving together are heard in the middle. Move sideways and the nearer speaker’s sound arrives first by a fraction of a millisecond — precedence takes over and the “centre” slides to that speaker. Each 10 cm off the centre line changes the arrival difference by very roughly 0.1–0.3 ms, which is enough to shift the image noticeably.</p>
        <ul><li><b>The phantom centre is tonally imperfect</b> even in the best seat: each ear gets the sound twice (once from each speaker, about a quarter of a millisecond apart), producing a dip around 2 kHz that a real centre speaker does not have. Early side reflections partly fill it in.</li>
        <li><b>A real centre channel</b> anchors dialogue for every seat — the main reason cinema and television sound use one.</li>
        <li><b>For mixing:</b> symmetry and an exact centre seat matter more than almost anything else in the room.</li></ul>` },
      { h: 'Masking and critical bands, in plain words', html: `
        <p>The inner ear sorts sound into overlapping frequency bands (about a third of an octave wide in the middle of the range). A loud sound in one band raises the threshold for quieter sounds in the same band and — less strongly — in the bands <b>above</b> it. That is <b>simultaneous masking</b>. A loud sound also hides quieter ones that come just after it (for up to roughly 100–200 ms) and even just before it (a few milliseconds): <b>temporal masking</b>.</p>`, viz: 'maskingLab' },
      { h: 'What masking means in practice', html: `
        <div class="uc-grid">
          ${uc('🎛️', 'Mixing', [['Effect', 'Low-mid build-up from several instruments hides detail above it'], ['Do', 'Cut a little of the masker rather than boosting the masked part']])}
          ${uc('🏠', 'Room decay', [['Effect', 'A long bass decay masks the low-level detail that follows each note'], ['Do', 'Shorten low-frequency decay; clarity improves across the range']], '#7a5cc7')}
          ${uc('🔇', 'Background noise', [['Effect', 'HVAC rumble masks quiet reverb tails and low-level edits'], ['Do', 'Meet the noise target before judging subtle things']], '#c7772b')}
          ${uc('💿', 'Data-reduced audio', [['Effect', 'Coders remove what the masking model says cannot be heard'], ['Do', 'Judge codecs with blind comparisons, not waveforms']], '#2b9fc7')}
          ${uc('📉', 'Distortion', [['Effect', 'Low-order harmonics close to a loud tone are well masked; harsh high-order ones are not'], ['Do', 'Ask what kind of distortion, not just how many per cent']], '#4c9a3a')}
        </div>` },
      { h: 'Adaptation: we listen through rooms', html: `
        <p>Walk into an unfamiliar room and its character is obvious for a minute or two. Then it fades: the brain builds a model of the room and subtracts it, so a familiar voice still sounds like itself in a kitchen, a car or a hall. The same happens with loudspeakers in rooms — within limits we hear “the speaker” and “the room” as separate things.</p>
        <ul><li>Adaptation works best for steady, broadband properties (overall tilt, general liveliness) and <b>poorly</b> for narrow resonances and for low-frequency room modes, which is why bass problems stay annoying.</li>
        <li>It is the reason quick A/B demonstrations exaggerate differences that would vanish after ten minutes — and why engineers can mix successfully in imperfect rooms they know well.</li>
        <li>It is <i>not</i> an excuse: adaptation costs effort and fails when you move between rooms. A neutral, symmetrical room simply asks less of it.</li></ul>
        <div class="callout warn">Do not “fix” with equalisation what adaptation already handles (the broad character of a normally furnished room above a few hundred hertz). Fix what it cannot handle: bass resonances, asymmetry, strong isolated reflections, echoes and noise.</div>` },
      { h: 'Try it yourself', html: `
        ${flow([['Clap test', 'walk the room clapping: listen for zing (flutter) and slap (echo)'], ['Mirror test', 'a helper slides a mirror along the walls; where you see a speaker is a first-reflection point'], ['Blanket test', 'cover one reflection point at a time and listen to image and tone'], ['Head move', 'play pink noise in mono and move your head 10 cm: hear the comb change'], ['Centre check', 'mono voice: the image should be narrow and dead centre'], ['Give it ten minutes', 'judge again after adaptation has done its work']])}
        ${myth([
          ['“All reflections are bad and should be absorbed.”', 'Early lateral reflections add loudness and spaciousness and are preferred in many listening situations. Absorb those that damage what the room is for.'],
          ['“If the graph shows comb filtering, I must be hearing it.”', 'Two ears and directional hearing hide much of what one microphone shows. Trust the graph for causes, your ears for consequences.'],
          ['“A reflection has to be eliminated completely.”', 'Reducing an early reflection by roughly 10–15 dB is usually enough to remove its influence on imaging.'],
          ['“A dead room is an accurate room.”', 'Very dead rooms are fatiguing and unlike any room your listeners use. Accuracy comes from balance and symmetry, not from removing all sound.'],
          ['“Our hearing is too poor to notice the room.”', 'The opposite: hearing is so good at separating source from room that we stop noticing — until the bass or an echo breaks the illusion.'],
        ])}` },
    ],
    quiz: [
      { q: 'Two identical sounds reach you from left and right, the right one 10 ms later and equally loud. You hear…', opts: ['Two separate sounds', 'One sound in the middle', 'One sound on the left, a little louder and broader', 'Nothing — they cancel'], a: 2, why: 'Precedence: the first arrival sets the location; the later one fuses with it.' },
      { q: 'Which reflection contributes most to a sense of width?', opts: ['From the ceiling', 'From the side wall', 'From the desk', 'From directly behind the speaker'], a: 1, why: 'Lateral reflections create differences between the ears, which the brain hears as width.' },
      { q: 'Why is the comb filtering of a room reflection often less audible than the graph suggests?', opts: ['Graphs exaggerate by 20 dB', 'The two ears receive different patterns and the reflection comes from another direction', 'Hearing ignores everything above 1 kHz', 'It is always masked by bass'], a: 1, why: 'Binaural, directional hearing does not sum the sounds the way one microphone does.' },
      { q: 'You sit 30 cm left of the centre line and the singer moves to the left speaker. Why?', opts: ['The left speaker is louder by 10 dB', 'The left speaker’s sound now arrives first — precedence', 'The room is asymmetrical', 'The recording is faulty'], a: 1, why: 'A fraction of a millisecond is enough to move a phantom image to the earlier speaker.' },
      { q: 'A loud 500 Hz sound is most likely to hide a quiet tone at…', opts: ['100 Hz', '250 Hz', '700 Hz', '8 kHz'], a: 2, why: 'Masking spreads mainly upward from the masker, and most strongly to nearby frequencies.' },
    ],
  };

  /* ====================================================================== */
  const L2 = {
    id: 'psy-speakers', n: '4B', title: 'Judging Loudspeakers: Measurements that Predict What We Hear', level: 'Advanced', mins: 45,
    summary: 'Why looking at a loudspeaker changes how it sounds, what listeners prefer when they cannot see it, and how a set of anechoic curves — direct sound, listening window, early reflections, sound power and directivity — predicts both the sound quality and the response you will measure in your room.',
    tags: ['loudspeaker', 'blind listening', 'on-axis', 'listening window', 'sound power', 'directivity index', 'predicted in-room response', 'resonance', 'subwoofers', 'headphones'],
    sections: [
      { h: 'Your eyes are part of your hearing', html: `
        <p class="lead">Put four loudspeakers behind an acoustically transparent curtain, match their levels, and the ratings listeners give change — sometimes dramatically — compared with the ratings they give when they can see which is which. Controlled listening tests have shown this repeatedly, with experienced engineers as well as beginners.</p>
        ${SVG_BLIND}
        <p>Nothing dishonest is going on. Price, size, brand, the opinion of the person beside you and what you expect to hear all feed into the same judgement as the sound does. The only way to judge the sound alone is to remove the other inputs.</p>
        ${flow([['Hide identity', 'curtain, or a helper who does the switching'], ['Match levels', 'within about 0.1–0.2 dB; louder nearly always “wins”'], ['Same position', 'each speaker in the same spot, or positions rotated'], ['Same music', 'short familiar passages, repeated'], ['Repeat', 'several rounds; do you rate consistently?']])}` },
      { h: 'What listeners prefer when they cannot see', html: `
        <p>Across many such tests the preferred loudspeakers share the same measurable properties, in roughly this order of importance:</p>
        <div class="table-wrap"><table><tr><th>Property</th><th>What it means</th><th>Sounds like when wrong</th></tr>
          <tr><td><b>Flat, smooth direct sound</b></td><td>The first arrival has no broad tilts, bumps or dips</td><td>Bright, dull, nasal, boxy, hollow</td></tr>
          <tr><td><b>Smooth off-axis behaviour</b></td><td>Sound sent toward walls, floor and ceiling is a gently duller copy of the direct sound, with no sudden changes</td><td>Tone changes with seat; treble “detached” from the rest; room EQ never quite works</td></tr>
          <tr><td><b>No resonances</b></td><td>Cabinet, drivers and ports do not ring</td><td>One-note colouration that follows the speaker from room to room</td></tr>
          <tr><td><b>Bass extension</b></td><td>How low it plays at useful level</td><td>Thin, lightweight (bass extension accounts for a large share of overall preference)</td></tr>
          <tr><td><b>Low distortion and compression at the levels you use</b></td><td>Stays clean when loud</td><td>Harsh or congested on peaks</td></tr></table></div>
        <div class="callout data">Notice what is <i>not</i> on the list: cabinet finish, exotic materials, the type of driver, or price. Any technology can produce these properties; none guarantees them.</div>` },
      { h: 'One speaker, five curves', html: `
        ${SVG_SPIN}
        <p>Measure a loudspeaker at many angles all the way round (in an anechoic room, or outdoors, or with time-windowing) and average the results in four ways. Each average corresponds to a part of what you will hear in a room:</p>
        <div class="table-wrap"><table><tr><th>Curve</th><th>What it predicts</th><th>What to look for</th></tr>
          <tr><td>① On axis</td><td>The first sound for a listener exactly in front</td><td>Flat and smooth</td></tr>
          <tr><td>② Listening window</td><td>Direct sound over a realistic range of seats and heights</td><td>Flat; nearly identical to ①</td></tr>
          <tr><td>③ Early reflections</td><td>The first bounces from floor, ceiling and walls</td><td>Smooth, gently falling; same shape as ②</td></tr>
          <tr><td>④ Sound power</td><td>Total output: what feeds the reverberation</td><td>Smooth, falling more steeply</td></tr>
          <tr><td>⑤ Directivity index</td><td>How directional the speaker is at each frequency</td><td>Smoothly rising or constant — <b>no bumps or dips</b></td></tr></table></div>
        <p>Explore five typical loudspeakers. Watch especially what happens at the bottom (directivity) and what the equaliser does to the top line.</p>`, viz: 'spinorama' },
      { h: 'Resonances versus interference dips', html: `
        ${SVG_RES}
        <p>A <b>resonance</b> is stored energy: a panel, a cone or a volume of air that keeps moving after the signal stops. It shows as a bump (sometimes a small one) at the <i>same frequency in every curve</i>, because it radiates in all directions. Hearing is very sensitive to it: broad, low-Q resonances can be audible at well under a decibel of bump.</p>
        <p>An <b>interference dip</b> comes from two sounds cancelling at one angle — two drivers at the crossover, or an edge of the cabinet. It appears at one angle and moves or disappears at others, so it mostly vanishes in the averaged curves. Narrow dips like this are usually harmless.</p>
        <div class="callout mentor">Reading tip: a feature that lines up vertically through all the curves is a resonance — and equalising it down genuinely helps, because it is in the speaker itself. A feature present on axis only is interference — leave it alone.</div>` },
      { h: 'From anechoic curves to your room', html: `
        <p>In a normally furnished room, above a few hundred hertz, what a microphone at the seat records is a blend: a little direct sound, a lot of early reflections, and the reverberant sound. A weighted average of curves ②, ③ and ④ predicts that measurement well.</p>
        <div class="formula"><span class="lbl">Predicted in-room response (rule of thumb)</span>≈ 12 % listening window + 44 % early reflections + 44 % sound power</div>
        <p>Two consequences:</p>
        <ul><li>A loudspeaker that is <b>flat on axis</b> with smoothly rising directivity gives a room curve that <b>tilts gently downward</b> — roughly 1 dB per octave, more in dead rooms and with directional speakers. That tilt is correct. Equalising it flat makes the direct sound bright. See <a href="#/academy/flat">Flat Response: Myth, Goal &amp; Method</a>.</li>
        <li>If the directivity has a step (woofer beaming below the crossover, tweeter spraying above it), the room curve shows a dip and a bump although the direct sound is flat. An equaliser that flattens the room curve puts the opposite error into the direct sound — which is what you localise and judge tone by. <b>You cannot equalise directivity.</b> Choose a speaker with a waveguide or matched drivers instead: <a href="#/academy/m-waveguides">Waveguides</a>.</li></ul>` },
      { h: 'Below the transition frequency the room takes over', html: `
        <p>Under roughly 200–300 Hz in domestic-sized rooms the response at the seat is dominated by room modes and by where the speaker and listener are. Two excellent loudspeakers will measure alike here in the same positions — and both will have peaks and dips of 10–20 dB.</p>
        <div class="uc-grid">
          ${uc('🪑', 'Seat-to-seat variation', [['Problem', 'Bass is right in one chair and wrong in the next'], ['Fix', 'Several subwoofers in chosen positions make seats more alike; then one EQ suits them all']])}
          ${uc('📐', 'Position first', [['Problem', 'A null at the seat'], ['Fix', 'Move the seat or sub; EQ cannot fill a null']], '#7a5cc7')}
          ${uc('🎛️', 'Measurement-based EQ', [['Problem', 'Peaks that boom'], ['Fix', 'Cut peaks, guided by measurements at the listening area — this is where EQ works best']], '#c7772b')}
          ${uc('🧱', 'Damping', [['Problem', 'Long decays'], ['Fix', 'Bass absorption shortens ringing that EQ alone only partly addresses']], '#2b9fc7')}
        </div>
        <p>More in <a href="#/academy/pv-standing">Pressure, Velocity &amp; Standing Waves</a> and <a href="#/academy/m-speakers">Speakers: Flush-Mounting, Mid-Field, Near-Field &amp; Subwoofers</a>.</p>` },
      { h: 'Headphones, briefly', html: `
        <p>A headphone bypasses the room, the head and the outer ear, so a response that measures “flat” at the eardrum sounds wrong. The neutral target for headphones is a curve that mimics what good loudspeakers in a good room deliver to the eardrum: a broad rise of roughly 10–15 dB around 3 kHz (the ear’s own gain) and, by most listeners’ preference, a few decibels of extra bass. Preferences for the amount of bass vary between listeners more than anything else.</p>
        <div class="callout warn">Never copy a room target curve to a headphone or the reverse. They are measured at different places (in the room versus at the eardrum) and are not interchangeable.</div>` },
      { h: 'Reading a specification sheet critically', html: `
        <div class="table-wrap"><table><tr><th>You see</th><th>Ask</th></tr>
          <tr><td>“40 Hz – 20 kHz”</td><td>Within what tolerance? ±3 dB, or −10 dB? Measured how, at what distance?</td></tr>
          <tr><td>A single very smooth curve</td><td>How much smoothing? Is it on axis only? Where are the off-axis or sound-power curves?</td></tr>
          <tr><td>“In-room response”</td><td>Whose room? It tells you about that room and position, not about the speaker</td></tr>
          <tr><td>Sensitivity and maximum SPL</td><td>Over what bandwidth, at what distortion, for how long?</td></tr>
          <tr><td>Impressive driver materials</td><td>Do the measurements show an absence of resonances? That is the only thing the material is for</td></tr>
          <tr><td>No measurements at all</td><td>Why not?</td></tr></table></div>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎚️', 'Choosing nearfield monitors', [['Do', 'Shortlist by flat direct sound and smooth directivity; then compare two finalists blind at matched level in your own room'], ['Result', 'Mixes that translate, because the reflections in your room match the direct sound']])}
          ${uc('🏠', 'Living-room system', [['Do', 'Prefer wide, even dispersion; leave side walls reflective; add subwoofer(s) and equalise the bass only'], ['Result', 'Spacious, even sound across the sofa']], '#7a5cc7')}
          ${uc('🎬', 'Home cinema', [['Do', 'Identical or closely matched front speakers including the centre; controlled directivity; multiple subs'], ['Result', 'Pans that keep the same tone across the screen']], '#c7772b')}
          ${uc('🔧', 'A speaker that sounds “off”', [['Do', 'Measure near-field and at several angles: is the fault in every curve (resonance — equalise) or only in some (directivity — place and treat)?'], ['Result', 'The right cure for the fault you actually have']], '#2b9fc7')}
          ${uc('🛒', 'In a shop demo', [['Do', 'Ask for equal levels; distrust instant impressions of “detail” (often just treble); listen to voices and piano'], ['Result', 'You avoid buying the loudest or brightest speaker']], '#4c9a3a')}
        </div>` },
      { h: 'Checklist, and common misunderstandings', html: `
        <ol><li>Direct sound flat within about ±1.5–2 dB from a few hundred hertz to at least 10 kHz.</li>
          <li>Off-axis curves parallel to the direct sound, falling smoothly; no step near the crossover.</li>
          <li>No bump that appears at the same frequency in every curve.</li>
          <li>Bass extension suited to the use, or a plan for subwoofers.</li>
          <li>Enough clean output for your listening distance (remember the 6 dB lost per doubling of distance).</li>
          <li>Compared blind, level-matched, in your room — at least once.</li></ol>
        ${myth([
          ['“Measurements cannot tell you how a speaker sounds.”', 'One on-axis curve cannot. A full set of on- and off-axis curves predicts listener preference well; the room and position add the rest.'],
          ['“Trained listeners prefer something different from everyone else.”', 'They rate more consistently and can explain why, but they rank the same speakers best as untrained listeners do.'],
          ['“Room correction makes any speaker neutral.”', 'It can correct what is wrong in every direction and in the bass. It cannot repair uneven directivity.'],
          ['“A flat measured room curve is the goal.”', 'A flat curve at the seat means a rising direct sound. Aim for flat direct sound and accept the natural downward tilt.'],
          ['“Bigger and dearer is safer.”', 'Without seeing them, listeners regularly prefer modest, well-engineered speakers over costly, coloured ones.'],
        ])}` },
    ],
    quiz: [
      { q: 'Why must loudspeaker comparisons be level-matched?', opts: ['To protect the tweeters', 'Because the louder one is usually judged better even when it is not', 'Because amplifiers clip otherwise', 'It is not important'], a: 1, why: 'A fraction of a decibel of extra level is heard as “more detail”, not as “louder”.' },
      { q: 'A bump appears at 700 Hz in the on-axis, early-reflection and sound-power curves alike. It is most likely…', opts: ['An interference dip', 'A resonance', 'A room mode', 'Measurement noise'], a: 1, why: 'A resonance radiates in all directions, so it shows in every curve.' },
      { q: 'A loudspeaker that is flat on axis with smoothly rising directivity will measure in a normal room as…', opts: ['Flat', 'Rising toward the treble', 'Gently falling toward the treble', 'Random'], a: 2, why: 'Less energy is sent off axis at high frequencies, so the reflected and reverberant sound is duller.' },
      { q: 'The room curve of a speaker shows a dip at 2 kHz and a bump at 3.5 kHz, but the direct sound is flat. What is the cure?', opts: ['Equalise the room curve flat', 'Add bass traps', 'Nothing an equaliser can fix: it is a directivity mismatch', 'Turn the speaker upside down'], a: 2, why: 'EQ changes all directions equally; it would damage the flat direct sound.' },
      { q: 'Below about 200–300 Hz in a small room, the response at the seat depends mainly on…', opts: ['The tweeter', 'The speaker’s cabinet finish', 'Room modes and the positions of speaker and listener', 'The cable'], a: 2, why: 'The room dominates the bass; position, multiple subs, damping and EQ are the tools.' },
    ],
  };

  /* ====================================================================== */
  const L3 = {
    id: 'psy-truth', n: '4C', title: 'Audio Facts and Myths: What Is Audible and How to Test It', level: 'Core', mins: 40,
    summary: 'The four measurable things that define audio fidelity, how big each error typically is in real equipment and rooms, roughly how small a difference can be heard, and how to find out for yourself with level matching, blind ABX trials and the null test.',
    tags: ['fidelity', 'distortion', 'noise', 'frequency response', 'blind test', 'ABX', 'null test', 'level matching', 'bias', 'myths', 'dither', 'jitter'],
    sections: [
      { h: 'Four parameters describe everything a device does to a signal', html: `
        <p class="lead">Whatever goes wrong between a microphone and your ears falls into one of four families. If a device changes none of them audibly, it is transparent — whatever it costs and however it is built.</p>
        <div class="table-wrap"><table><tr><th>Parameter</th><th>What it is</th><th>Sounds like</th><th>Typical modern electronics</th><th>Typical transducers and rooms</th></tr>
          <tr><td><b>Frequency response</b></td><td>Some frequencies louder or quieter than they should be</td><td>Bright, dull, thin, boomy, nasal</td><td>Flat within about ±0.1 dB</td><td>Speakers ±2–5 dB; rooms ±10–20 dB in the bass</td></tr>
          <tr><td><b>Distortion</b></td><td>New frequencies added: harmonics, and sum-and-difference tones between notes (intermodulation)</td><td>Harsh, gritty, congested</td><td>0.001–0.05 %</td><td>Speakers 0.3–3 % (more in the bass, more when loud)</td></tr>
          <tr><td><b>Noise</b></td><td>Hiss, hum, buzz, interference</td><td>Background veil, hum</td><td>90–120 dB below full level</td><td>Room noise is usually the real floor: 20–35 dB SPL</td></tr>
          <tr><td><b>Time-based errors</b></td><td>Speed variation, echoes, ringing, phase shift</td><td>Wow/flutter, smearing, hollow tone</td><td>Negligible in digital systems</td><td>Rooms: reflections and long bass decay dominate</td></tr></table></div>
        ${SVG_BIG}
        <div class="callout mentor">The chain is only as good as its worst link, and the worst links are almost always the loudspeakers, the room and where things are placed. Spend attention in proportion to the size of the bars.</div>` },
      { h: 'Roughly how small a difference can we hear?', html: `
        <p>These are approximate figures for attentive listeners in good conditions. Real music, masking and room noise usually make things harder, not easier.</p>
        <div class="table-wrap"><table><tr><th>Change</th><th>About the smallest audible</th><th>Notes</th></tr>
          <tr><td>Overall level</td><td>≈ 0.2–0.5 dB in a direct switch</td><td>Heard as “clearer” or “fuller” rather than “louder”</td></tr>
          <tr><td>Broad tonal tilt or shelf (an octave or more wide)</td><td>≈ 0.2–0.5 dB</td><td>Wide changes are the easiest to hear</td></tr>
          <tr><td>Narrow peak (a third of an octave)</td><td>≈ 1–3 dB</td><td>Narrow dips are harder still</td></tr>
          <tr><td>Harmonic distortion on music</td><td>≈ 0.1–1 % and upward</td><td>Depends on the kind: low-order is masked, high-order and intermodulation are noticed sooner</td></tr>
          <tr><td>Steady noise</td><td>When it rises above the room’s own noise in any band</td><td>Tonal hum is noticed at far lower level than hiss</td></tr>
          <tr><td>Echo of the same signal</td><td>Depends on delay — see the precedence lab</td><td>—</td></tr>
          <tr><td>Absolute phase / moderate phase shift</td><td>Generally inaudible on music</td><td>Can be heard on special test signals and headphones</td></tr></table></div>
        <div class="callout data">The first row matters most for testing: if two things differ in level by a few tenths of a decibel, listeners reliably prefer the louder one and describe it in terms of quality. <b>Match levels to within about 0.1–0.2 dB</b> (with a meter, not by ear) before comparing anything.</div>` },
      { h: 'Why sincere people hear things that are not there', html: `
        <div class="uc-grid">
          ${uc('💭', 'Expectation', [['What happens', 'Knowing which device is playing changes what you hear, in the direction you expect'], ['Guard', 'Do not know: blind the test']])}
          ${uc('🔊', 'Louder is better', [['What happens', 'A tiny level advantage is heard as more detail and depth'], ['Guard', 'Match levels with a meter']], '#c7772b')}
          ${uc('🧠', 'Short memory', [['What happens', 'Detailed memory for sound fades in a few seconds; long pauses hide real differences and invent others'], ['Guard', 'Switch quickly on short repeated passages']], '#7a5cc7')}
          ${uc('🙆', 'Moving your head', [['What happens', 'In a room, 10 cm of movement shifts comb-filter notches by hundreds of hertz and changes the bass by several decibels'], ['Guard', 'Same seat, same posture; repeat']], '#2b9fc7')}
          ${uc('✅', 'Confirmation', [['What happens', 'After spending money or effort we look for the improvement and remember the hits'], ['Guard', 'Count results; let chance be a possible answer']], '#4c9a3a')}
        </div>
        <p>None of this means listening is worthless — it means listening has to be <b>arranged</b> so that only the sound can influence the answer.</p>` },
      { h: 'ABX: a blind test you can run at home', html: `
        ${SVG_ABX}
        ${flow([['Prepare', 'two versions, levels matched, same start point'], ['Blind', 'software or a helper assigns X at random'], ['Listen', 'switch A, B, X as often as you like'], ['Answer', '“X is A” or “X is B”'], ['Repeat', '12–20 trials without feedback'], ['Count', 'compare your score with chance']])}
        <div class="table-wrap"><table><tr><th>Trials</th><th>Correct answers</th><th>Chance of doing that well by guessing</th><th>Verdict</th></tr>
          ${[[8, 7], [10, 9], [12, 10], [16, 12], [16, 14], [20, 15], [20, 12]].map(([n, c]) => { const p = binom(n, c) * 100; return `<tr><td>${n}</td><td>${c}</td><td>${p < 1 ? p.toFixed(2) : p.toFixed(1)} %</td><td>${p < 5 ? '<span class="good">difference heard</span>' : '<span class="warn">not demonstrated</span>'}</td></tr>`; }).join('')}</table></div>
        <p>Try it. Start with a 1 dB level difference (easy when sighted — notice how much less obvious it is blind), then make it smaller.</p>`, viz: 'abxTest' },
      { h: 'The null test: subtract one from the other', html: `
        <p>If two signals are supposed to be the same, invert one and add them. Whatever is left <i>is</i> the difference — all of it. Identical files cancel to silence. This needs no golden ears and no opinions.</p>`, viz: 'nullTest' },
      { h: 'What a null test proves, and what it does not', html: `
        <div class="table-wrap"><table><tr><th>Result</th><th>It means</th><th>Caution</th></tr>
          <tr><td>Perfect silence</td><td>The two are identical. No audible difference is possible.</td><td>—</td></tr>
          <tr><td>Residual 80 dB or more below the signal</td><td>The difference is far below audibility under music</td><td>—</td></tr>
          <tr><td>Residual 40–60 dB down</td><td>A real but small difference; listen to the residual to learn what it is</td><td>Confirm audibility with a blind test</td></tr>
          <tr><td>Large residual</td><td>Either a big difference <i>or</i> a mis-aligned test</td><td>A 0.1 dB level mismatch leaves about −39 dB; a one-sample shift leaves a large treble-heavy residual. Align level and time first.</td></tr></table></div>
        <div class="callout warn">A large residual does not by itself mean an audible difference (a tiny delay nulls badly but sounds identical). A tiny residual, however, does mean an inaudible one. The test is strongest when it says “the same”.</div>` },
      { h: 'Common beliefs, examined calmly', html: `
        ${myth([
          ['“Expensive cables improve the sound of short analogue connections.”', 'A cable’s effect is set by resistance, capacitance and shielding. For line-level runs of a few metres and adequately thick speaker cable, competent cables differ by far less than 0.1 dB. Long runs, high-impedance sources (guitar pickups, turntable cartridges) and thin speaker wire are where cable properties do become audible.'],
          ['“Very high sample rates sound better on playback.”', '44.1 or 48 kHz already carries everything up to about 20 kHz. Higher rates are useful in production for some processing; blind tests of playback find differences rarely and inconsistently.'],
          ['“Digital audio is a staircase.”', 'The stair-step picture shows stored numbers, not the output. After the reconstruction filter the waveform is smooth and passes through every sample.'],
          ['“Electronics and cables need burn-in.”', 'Measured changes in electronics after warm-up are tiny. Loudspeaker drivers loosen slightly in their first hours. Most of what people report over weeks is their own adaptation.'],
          ['“Jitter ruins digital sound.”', 'Jitter is real and measurable; in competent modern converters its products sit roughly 100 dB or more below the music.'],
          ['“Dither is noise, so leave it out.”', 'Dither replaces distortion that follows the signal with a constant, very low hiss. It matters when reducing to 16 bits; at 24 bits it is academic.'],
          ['“If I can hear it sighted, I do not need a blind test.”', 'A real difference survives blinding. Only an imagined one is threatened by it.'],
        ])}` },
      { h: 'Where money and effort really change the sound', html: `
        <div class="table-wrap"><table><tr><th>Rank</th><th>Change</th><th>Typical size of improvement</th><th>Cost</th></tr>
          <tr><td>1</td><td>Seat and loudspeaker position; symmetry</td><td>Up to 10–20 dB in the bass; imaging transformed</td><td>Free</td></tr>
          <tr><td>2</td><td>Bass treatment and first-reflection treatment</td><td>Decay halved; several dB smoother</td><td>Low–medium</td></tr>
          <tr><td>3</td><td>Better loudspeakers (neutral, even directivity)</td><td>Several dB of colouration removed</td><td>Medium–high</td></tr>
          <tr><td>4</td><td>Subwoofer(s) properly integrated, with measured EQ</td><td>An extra octave; more even bass</td><td>Medium</td></tr>
          <tr><td>5</td><td>Quieter room (noise control)</td><td>10–20 dB more usable dynamic range</td><td>Varies</td></tr>
          <tr><td>6</td><td>Source material: recording and mastering quality</td><td>Often larger than everything else</td><td>—</td></tr>
          <tr><td>…</td><td>Competent electronics → costlier electronics; short cable → exotic cable</td><td>Usually below audibility</td><td>Can be very high</td></tr></table></div>
        <p>See also <a href="#/academy/m-myths">Acoustic Myths &amp; the Scientific Method</a> and <a href="#/academy/a-digital">Digital Audio Deep Dive</a>.</p>` },
      { h: 'Use cases', html: `
        <div class="uc-grid">
          ${uc('🎛️', 'New converter or interface', [['Test', 'Loop a file out and back in through each, align and null against the original'], ['Result', 'Residual tells you exactly what each one adds']])}
          ${uc('🔌', 'Plug-in “analogue warmth”', [['Test', 'Null the processed against the dry signal; listen to the residual'], ['Result', 'You learn whether it is EQ, distortion, level — or nothing']], '#7a5cc7')}
          ${uc('💿', 'Lossy versus lossless files', [['Test', 'ABX with level matched and identical start points'], ['Result', 'You find the bit rate at which you personally stop hearing it']], '#c7772b')}
          ${uc('🎚️', 'Two masters of the same song', [['Test', 'Loudness-match first, then compare'], ['Result', 'The “better” one is often just the louder one until levels are equal']], '#2b9fc7')}
          ${uc('🧰', 'A tweak that “opened up the sound”', [['Test', 'Have a helper apply or remove it at random, ten times'], ['Result', 'A real effect is identified nearly every time']], '#4c9a3a')}
        </div>` },
      { h: 'A short method for any audio claim', html: `
        ${flow([['Which parameter?', 'response, distortion, noise or time'], ['How big?', 'measure or null it'], ['Above threshold?', 'compare with the table'], ['Blind check', 'level-matched ABX'], ['Decide', 'spend where the big bars are']])}
        <div class="callout mentor">Being wrong in a blind test is not a failure; it is information you could not have obtained any other way — and it usually saves money.</div>` },
    ],
    quiz: [
      { q: 'Which of these typically contributes the largest errors in a playback system?', opts: ['The interconnect cables', 'The digital converter', 'The room and the loudspeaker placement', 'The power cord'], a: 2, why: 'Room and position errors reach 10–20 dB in the bass; electronics are flat within fractions of a decibel.' },
      { q: 'How closely should levels be matched before comparing two devices?', opts: ['Within 3 dB', 'Within 1 dB', 'Within about 0.1–0.2 dB', 'It does not matter'], a: 2, why: 'Smaller level differences than you would call “louder” still bias preference.' },
      { q: 'You score 9 out of 16 in an ABX test. What does that show?', opts: ['You heard the difference', 'The devices are identical', 'Nothing was demonstrated — that score is typical of guessing', 'The test was broken'], a: 2, why: 'About 40 % of pure-guessing runs score 9 or better; roughly 12 of 16 is needed.' },
      { q: 'Two files null to −95 dB. You can conclude…', opts: ['They sound clearly different', 'Any difference is far below audibility', 'One is distorted', 'Nothing'], a: 1, why: 'A residual that low is buried beneath the music and the room noise.' },
      { q: 'A null test leaves a loud, bright-sounding residual. First thing to check?', opts: ['Buy better cables', 'Whether the two files are time-aligned and level-matched', 'The sample rate of your interface', 'Nothing: the files are very different'], a: 1, why: 'A shift of a single sample or a small gain error produces a large residual from identical-sounding files.' },
    ],
  };

  const at = () => window.LESSONS.findIndex((l) => l.id === 'hearing');
  [L1, L2, L3].forEach((L, k) => { const i = at(); window.LESSONS.splice(i >= 0 ? i + 1 + k : window.LESSONS.length, 0, L); });
})();
