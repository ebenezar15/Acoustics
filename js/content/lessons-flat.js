/* ==========================================================================
   Academy — "RT60, octave bands & measurement language" and
   "Flat response: myth, goal & method" (acoustics track).
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;

  const BANDS = {
    id: 'bands', n: '7A', title: 'RT60, Octave Bands & the Language of Measurement', level: 'Core', mins: 40,
    summary: 'What RT60 really measures, how T20/T30/EDT are derived, what octave and third-octave bands are, how bands are grouped, and how to read acoustic data without being fooled.',
    tags: ['RT60', 'T20', 'T30', 'EDT', 'octave band', 'third octave', 'octave grouping', 'bass ratio', 'smoothing', 'Schroeder integration'],
    sections: [
      { h: 'RT60 in one picture', html: `
        <p class="lead">RT60 is the time it takes for sound in a room to fall by <b>60 dB</b> — to one millionth of its energy — after the source stops. 60 dB is roughly the drop from loud music to near-silence, which is why Sabine chose it.</p>
        ${flow([['Source stops', 'or a clap / sweep is played'], ['Direct sound passes', 'then early reflections'], ['Reverberant decay', 'a straight line on a dB scale'], ['Fit the slope', 'over a clean part of the decay'], ['Extrapolate to −60 dB', 'that time is RT60']])}
        <p>Because rooms decay exponentially, the decay is a <b>straight line in dB</b>. Its slope tells you RT: a slope of −100 dB/s means RT60 = 0.6 s.</p>
        <div class="callout data">RT60 is always given <b>per frequency band</b>. “The room is 0.4 s” usually means the average of the 500 Hz and 1 kHz bands (RT<sub>mid</sub>). At 63 Hz the same room may be 0.9 s.</div>` },
      { h: 'T20, T30 and EDT — what the meter actually reports', html: `
        <p>Real rooms rarely give 60 dB of clean decay above the background noise. So analysers fit a shorter range and multiply:</p>
        <div class="table-wrap"><table><tr><th>Measure</th><th>Range fitted</th><th>Multiply by</th><th>Needs</th><th>Tells you</th></tr>
          <tr><td><b>EDT</b> (early decay time)</td><td>0 → −10 dB</td><td>× 6</td><td>—</td><td>How reverberant the room <i>sounds</i> (dominated by early reflections)</td></tr>
          <tr><td><b>T20</b></td><td>−5 → −25 dB</td><td>× 3</td><td>≈ 35 dB above noise</td><td>RT60 estimate, robust in noisy or small rooms</td></tr>
          <tr><td><b>T30</b></td><td>−5 → −35 dB</td><td>× 2</td><td>≈ 45 dB above noise</td><td>RT60 estimate, preferred when the range is available</td></tr></table></div>
        <p>The smooth decay curve comes from <b>Schroeder backward integration</b> of the impulse response (ISO 3382). If EDT ≠ T30, the room is not one simple space: strong early reflections, coupled volumes (a stage house, a balcony, a reverberation chamber) or a non-diffuse field.</p>`, viz: 'decayLab' },
      { h: 'Octave bands and third-octave bands', html: `
        <p>Hearing is logarithmic: every <b>doubling</b> of frequency is heard as the same musical step (an octave). So acoustics splits the spectrum into bands of constant <i>ratio</i>, not constant Hz.</p>
        <div class="formula"><span class="lbl">Octave band with centre fc</span>lower = fc/√2 · upper = fc·√2 · bandwidth ≈ 70.7 % of fc</div>
        <div class="formula"><span class="lbl">Third-octave band</span>lower = fc/2^(1/6) · upper = fc·2^(1/6) · bandwidth ≈ 23.2 % of fc</div>
        <div class="table-wrap"><table><tr><th>Octave centre</th>${[63, 125, 250, 500, 1000, 2000, 4000, 8000].map((f) => `<th class="num">${f >= 1000 ? f / 1000 + 'k' : f}</th>`).join('')}</tr>
          <tr><td>Covers (Hz)</td>${[63, 125, 250, 500, 1000, 2000, 4000, 8000].map((f) => `<td class="num">${Math.round(f / Math.SQRT2)}–${Math.round(f * Math.SQRT2)}</td>`).join('')}</tr>
          <tr><td>Third-octave centres inside</td>${[63, 125, 250, 500, 1000, 2000, 4000, 8000].map((f) => { const n = { 63: '50 63 80', 125: '100 125 160', 250: '200 250 315', 500: '400 500 630', 1000: '800 1k 1.25k', 2000: '1.6k 2k 2.5k', 4000: '3.15k 4k 5k', 8000: '6.3k 8k 10k' }; return `<td class="num small">${n[f]}</td>`; }).join('')}</tr></table></div>
        <p>Standard centres are rounded “nominal” values (IEC 61260 / ISO 266); exact centres are 1000·2<sup>n/3</sup> Hz. Third-octave bands are close to the ear’s <b>critical bands</b> above ~500 Hz, which is why most product data and building-acoustics ratings use them. <b>Pink noise</b> has equal energy in every octave, so it looks flat on an octave-band analyser.</p>`, viz: 'octaveBands' },
      { h: 'Octave grouping — the shorthand professionals use', html: `
        <div class="table-wrap"><table><tr><th>Group</th><th>Bands</th><th>Single-number</th><th>Use</th></tr>
          <tr><td><b>Low</b></td><td>63, 125, 250 Hz</td><td>Bass ratio BR = (RT₁₂₅ + RT₂₅₀)/(RT₅₀₀ + RT₁ₖ)</td><td>Warmth in halls (1.1–1.25); ≈ 1 in control rooms</td></tr>
          <tr><td><b>Mid</b></td><td>500, 1k Hz</td><td>RT<sub>mid</sub> = (RT₅₀₀ + RT₁ₖ)/2</td><td>The headline “RT” of a room; speech intelligibility</td></tr>
          <tr><td><b>High</b></td><td>2k, 4k (8k) Hz</td><td>Treble ratio = (RT₂ₖ + RT₄ₖ)/(RT₅₀₀ + RT₁ₖ)</td><td>Brilliance; air absorption lowers it in big halls</td></tr>
          <tr><td>Absorption</td><td>250–2k Hz</td><td>NRC (4 octaves), SAA (12 third-octaves 200–2.5k)</td><td>Quick comparison of absorbers — ignores bass!</td></tr>
          <tr><td>Isolation</td><td>125–4k (STC), 100–3.15k (Rw)</td><td>STC / Rw (+C, Ctr)</td><td>Walls & floors; check 63 Hz separately for music</td></tr>
          <tr><td>Noise</td><td>63–8k octaves</td><td>NC / NR / dBA</td><td>Background noise targets</td></tr></table></div>
        <div class="callout warn">Every single-number rating hides frequencies. A room with RT<sub>mid</sub> 0.3 s can still ring for 1 s at 50 Hz; a wall with STC 55 can leak the kick drum; a panel with NRC 0.95 can do nothing below 250 Hz. Always ask for the band data.</div>` },
      { h: 'Smoothing — why the same room can be “±2 dB” or “±15 dB”', html: `<p>Frequency-response plots are smoothed over a fraction of an octave. The more smoothing, the flatter any room looks. A claim like “flat within ±2 dB” means nothing without the smoothing and the frequency range.</p>`, viz: 'smoothing' },
      { h: 'Reading a measurement report — checklist', html: `
        <ol class="steps"><li>Which <b>bands</b> (octave, third-octave) and which <b>range</b> (does it go down to 63 Hz?).</li><li>RT: is it <b>T20 or T30</b>; how many positions averaged; occupied or empty.</li><li>Frequency response: what <b>smoothing</b>, which <b>position(s)</b>, gated or steady-state.</li><li>Ratings (NRC, STC, NC…): look at the <b>band values</b> behind them.</li><li>Mounting & test standard for product data (ISO 354 / ASTM C423 for absorption).</li></ol>` },
    ],
    quiz: [
      { q: 'A decay falls 30 dB in 0.25 s. RT60 is…', opts: ['0.25 s', '0.5 s', '0.75 s', '1 s'], a: 1, why: '60 dB takes twice as long: 0.5 s.' },
      { q: 'T30 is fitted over…', opts: ['0 to −30 dB', '−5 to −35 dB, ×2', '−5 to −25 dB, ×3', '0 to −10 dB, ×6'], a: 1, why: 'ISO 3382 definition.' },
      { q: 'The 1 kHz octave band runs from about…', opts: ['900–1100 Hz', '707–1414 Hz', '500–2000 Hz', '891–1122 Hz'], a: 1, why: 'fc/√2 to fc·√2. (891–1122 Hz is the third-octave.)' },
      { q: 'Bass ratio uses which bands?', opts: ['63 & 125 / 2k & 4k', '125 & 250 / 500 & 1k', '250 / 1k', 'all bands'], a: 1, why: 'BR = (RT125 + RT250)/(RT500 + RT1k).' },
    ],
  };

  const FLAT = {
    id: 'flat', n: '15A', title: 'Flat Response: Myth, Goal & Method', level: 'Advanced', mins: 45,
    summary: 'What “flat” really means, whether a control room can be flat, every factor that stops it, and how to build rooms that sound great and translate — plus how recording rooms and halls differ.',
    tags: ['flat response', 'target curve', 'translation', 'control room', 'in-room response', 'EBU Tech 3276', 'ITU-R BS.1116', 'recording room', 'concert hall'],
    sections: [
      { h: 'Three different things called “flat”', html: `
        <div class="grid g3">
          <div class="card"><h4 style="margin-top:0">1 · Flat loudspeaker</h4><p class="small">On-axis response measured in an anechoic chamber, ideally with smoothly changing off-axis response. <b>Achievable</b> and the most important of the three — good monitors are within about ±1–2 dB.</p></div>
          <div class="card"><h4 style="margin-top:0">2 · Flat in-room curve at the seat</h4><p class="small">The steady-state response measured at the mix position. Above a few hundred hertz it should <b>not</b> be ruler-flat: a flat speaker with normal directivity in a normally treated room produces a <b>gentle downward tilt</b> (shown repeatedly by controlled listening research). Forcing it flat with EQ makes the speaker’s direct sound bright.</p></div>
          <div class="card"><h4 style="margin-top:0">3 · Flat low-frequency response</h4><p class="small">Below the Schroeder frequency the room dominates: modes and boundary interference give ±10–20 dB swings in untreated small rooms. This is the part you fight with position, trapping, multiple subs and (cuts-only) EQ.</p></div>
        </div>
        <div class="callout mentor">So is “flat” over-hyped? <b>“Flat speaker” is essential. “Flat in-room curve” is a misunderstanding.</b> The real goal is: a neutral loudspeaker, a smooth (not perfectly flat) in-room response that follows a sensible target, even bass across the listening area, and controlled early reflections.</div>` },
      { h: 'Build the in-room response, layer by layer', html: `<p>Start with a flat speaker and switch on each thing a room does. Then fix it in the professional order: <b>treatment → placement → EQ</b>.</p>`, viz: 'flatness' },
      { h: 'Every factor that shapes the response', html: `
        <div class="table-wrap"><table><tr><th>Factor</th><th>Frequency range</th><th>Effect</th><th>Fix</th></tr>
          <tr><td>Loudspeaker on-axis & directivity</td><td>All</td><td>Tonal balance; how reflections are coloured</td><td>Choose speakers with flat on-axis and smooth off-axis response</td></tr>
          <tr><td>Room modes</td><td>Below ≈ 200–300 Hz (small rooms)</td><td>±10–20 dB peaks/nulls, long ringing</td><td>Proportions, seat & speaker position, bass traps, multiple subs, cut EQ</td></tr>
          <tr><td>Boundary interference (SBIR)</td><td>≈ 60–400 Hz</td><td>Deep notches at c/4d</td><td>Soffit-mount, or very close / far from walls + thick absorption</td></tr>
          <tr><td>Early reflections</td><td>Above ≈ 300 Hz</td><td>Comb filtering, image blur</td><td>Absorb or redirect within ~15–20 ms; symmetry</td></tr>
          <tr><td>Reverberant field</td><td>Mid–high</td><td>Downward tilt at the seat; decay colour</td><td>Even absorption across bands (thick, not thin)</td></tr>
          <tr><td>Desk / console</td><td>≈ 200 Hz–2 kHz</td><td>Comb filtering</td><td>Speakers behind/above the desk; angled or absorbent desk</td></tr>
          <tr><td>Listening distance & level</td><td>All</td><td>Direct/reverberant ratio; loudness-dependent balance</td><td>Sit within critical distance; calibrate level (≈ 79–85 dB SPL)</td></tr>
          <tr><td>Measurement method</td><td>—</td><td>Smoothing, mic position and windowing change the curve</td><td>Average several positions; state smoothing</td></tr></table></div>` },
      { h: 'What the standards ask for', html: `
        <p>Broadcast reference listening rooms (EBU Tech 3276 and ITU-R BS.1116) are a well-documented definition of a neutral room. Their main requirements, in summary:</p>
        <ul>
          <li><b>Reverberation</b>: nominal T<sub>m</sub> = 0.25·(V/V₀)<sup>⅓</sup> s with V₀ = 100 m³, held within a narrow tolerance (about ±0.05 s) from 200 Hz to 4 kHz, with somewhat more allowed at low frequency.</li>
          <li><b>Early reflections</b>: at least 10 dB below the direct sound in roughly the first 15 ms.</li>
          <li><b>Operational room response</b>: at the listening position within a tolerance window of a few dB around a smooth curve, tightest in the mid band and wider at the frequency extremes.</li>
          <li><b>Background noise</b>: very low (NR 10, not exceeding NR 15).</li>
          <li><b>Symmetry and size</b>: symmetrical room, adequate floor area and good dimension ratios.</li>
        </ul>
        <p class="small">Check the current editions of EBU Tech 3276 and ITU-R BS.1116 for the exact tolerance masks before commissioning a room; this app’s Room Analyzer uses the T<sub>m</sub> formula above as its control-room target.</p>` },
      { h: 'How to achieve a great-sounding, translating control room', html: `
        ${flow([['Neutral speakers', 'flat on-axis, smooth directivity, enough LF headroom'], ['Geometry', 'symmetry, ratios, 38 % seat, triangle, soffit if possible'], ['Bass', 'deep corner traps, tuned traps, multiple subs'], ['Reflections', 'absorb/redirect first 15–20 ms; diffuse the rear if far enough'], ['Measure & tune', 'several positions; cut-only EQ below Schroeder'], ['Calibrate & verify', 'level, references, check on other systems']])}
        <p><b>Translation</b> means your mixes sound right on other systems. It comes from <i>accuracy where the music lives</i> (a neutral speaker, smooth bass at the seat, no strong early reflections) and <i>familiarity</i> (knowing your room with reference tracks). A room that is ruler-flat at one microphone position but lumpy elsewhere translates worse than a room that is smooth everywhere around your head.</p>
        <div class="callout data"><b>Realistic small-room results.</b> 200 Hz–20 kHz: within about ±3 dB of a smooth target at 1/6-octave smoothing. 30–200 Hz: ±5 dB after treatment, placement and subs (±10–15 dB untreated). Modal decay below 200 Hz: under ~0.3–0.4 s.</div>` },
      { h: 'Recording rooms and performance halls: different goals', html: `
        <p>Only the control room aims for “the room disappears”. Other rooms are part of the instrument:</p>
        <ul><li><b>Live tracking rooms</b>: longer, diffuse decay, variable acoustics, no flutter, controlled bass — the room adds character the engineer can choose.</li><li><b>Vocal booths</b>: short and even across bands; neutral but not dead-sounding.</li><li><b>Concert halls</b>: long, warm, enveloping (RT ≈ 1.8–2.2 s occupied, BR 1.1–1.25, strong lateral reflections, ITDG ≤ ~20 ms).</li><li><b>Theatres and lecture rooms</b>: clarity first (shorter RT, strong early reflections for intelligibility).</li></ul>`, viz: 'roomGoals' },
      { h: 'Common myths', html: `
        <ul><li><b>“Room correction makes any room flat.”</b> EQ can tame peaks at one seat; it cannot fix nulls, ringing in time, or reflections that differ seat to seat.</li><li><b>“Deader is more accurate.”</b> Over-deadening with thin absorbers removes highs only; the room becomes dull and boomy. Aim for an even decay across bands.</li><li><b>“Flat at 1/3-octave means accurate.”</b> Heavy smoothing hides modes. Look at 1/24-octave below 300 Hz and at the waterfall.</li><li><b>“A flat curve sounds neutral.”</b> A flat in-room curve above ~500 Hz usually sounds bright with good loudspeakers; a gentle tilt sounds neutral.</li></ul>` },
    ],
    quiz: [
      { q: 'Which “flat” is most important to get right?', opts: ['A ruler-flat in-room curve at one point', 'The loudspeaker’s anechoic on-axis response and smooth directivity', 'Flat RT60 at 63 Hz', 'Flat dBA'], a: 1, why: 'A neutral loudspeaker is the foundation; the in-room curve naturally tilts.' },
      { q: 'A nominal EBU-style control-room RT for a 100 m³ room is about…', opts: ['0.1 s', '0.25 s', '0.6 s', '1.2 s'], a: 1, why: 'Tm = 0.25·(V/100)^⅓ = 0.25 s.' },
      { q: 'The right order to fix a lumpy response is…', opts: ['EQ → treatment → placement', 'Treatment → placement → EQ', 'Placement only', 'EQ only'], a: 1, why: 'Physical fixes first; EQ last and cut-only.' },
    ],
  };

  const L = window.LESSONS;
  L.splice(L.findIndex((l) => l.id === 'reverb') + 1, 0, BANDS);
  L.splice(L.findIndex((l) => l.id === 'control-room') + 1, 0, FLAT);
})();
