/* ==========================================================================
   Academy — Fundamentals, resonance & harmonics (acoustics track, after ch. 1).
   ========================================================================== */
(function () {
  const flow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;
  const NOTES = [['E1', 'Low E, 4-string bass', 41.2], ['A1', 'Low A, 5th string of bass', 55], ['E2', 'Low E, guitar', 82.4], ['A2', 'Male voice (low)', 110], ['C4', 'Middle C', 261.6], ['A4', 'Concert pitch', 440], ['C6', 'High soprano', 1046.5]];
  const L = {
    id: 'harmonics', n: '1A', title: 'Fundamentals, Resonance & Harmonics', level: 'Foundation', mins: 35,
    summary: 'What the fundamental, harmonics and resonant frequencies are, how they shape pitch and timbre, and whether treating the low end changes the highs.',
    tags: ['fundamental', 'harmonics', 'overtones', 'resonance', 'resonant frequency', 'Q', 'timbre', 'missing fundamental', 'harmonic series'],
    sections: [
      { h: 'The fundamental: what sets the pitch', html: `
        <p class="lead">Almost every musical or mechanical sound repeats itself. The rate it repeats at is the <b>fundamental frequency f₀</b>, and it is what we hear as <b>pitch</b>.</p>
        <div class="table-wrap"><table><tr><th>Note</th><th>What it is</th><th class="num">f₀</th><th class="num">Wavelength</th></tr>
          ${NOTES.map(([n, d, f]) => `<tr><td><b>${n}</b></td><td>${d}</td><td class="num">${f} Hz</td><td class="num">${(343 / f).toFixed(2)} m</td></tr>`).join('')}</table></div>
        <div class="callout data">Typical fundamentals: kick drum 40–80 Hz · bass guitar 41–330 Hz · male speech 85–180 Hz · female speech 165–255 Hz · piano 27.5 Hz–4.2 kHz · mains hum 50 or 60 Hz.</div>` },
      { h: 'Harmonics: what sets the timbre', html: `
        <p>Real sounds are not pure sines. A vibrating string or air column also vibrates at <b>2f₀, 3f₀, 4f₀…</b> — the <b>harmonics</b> (or overtones / partials). Their relative levels make a violin sound different from a flute at the same pitch. Drums, bells and stiff piano strings also have <b>inharmonic</b> partials that are not exact multiples.</p>
        ${flow([['f₀', 'fundamental — pitch'], ['2f₀', 'octave above'], ['3f₀', 'octave + 5th'], ['4f₀', 'two octaves'], ['5f₀ …', 'colour, brightness, clarity']])}
        <p>Build a sound from its harmonics below, drag the bars, and listen. Then remove the fundamental: the pitch stays — your brain reconstructs it from the spacing of the harmonics (the <b>missing fundamental</b>).</p>`, viz: 'harmonics' },
      { h: 'Resonance & resonant frequency', html: `
        <p>A <b>resonant frequency</b> belongs to an <i>object or space</i>, not to a sound. It is a frequency at which the object stores energy and responds strongly: a guitar body, a speaker cabinet, a drum shell, a pane of glass, a floor slab, a Helmholtz bottle — and a room (its modes). Push it at that frequency and a small input builds a large, ringing output.</p>
        <ul><li><b>Q</b> (quality factor) says how sharp: bandwidth = f₀/Q, decay ≈ 2.2·Q/f₀ seconds.</li><li><b>Damping</b> lowers Q: the peak drops, widens and stops ringing sooner. Absorbers damp room modes; damping compound damps panels; rubber damps machines.</li><li>Resonators also have <b>overtones</b>: a room or a string has a whole series of resonances.</li></ul>`, viz: 'resonance' },
      { h: 'Strings and rooms share the same maths', html: `<p>A room between two parallel walls is a 1-D resonator, just like a string — with resonances at c/2L, 2·c/2L, 3·c/2L… In a 5 m room that’s 34, 69, 103, 137 Hz. Every note whose fundamental <i>or harmonic</i> lands on one of these gets boosted.</p>`, viz: 'stringModes' },
      { h: 'Does targeting a low frequency affect the higher ones?', html: `
        <p class="lead">It depends entirely on the <b>bandwidth</b> of the tool.</p>
        <div class="grid g2">
          <div class="card"><h4 style="margin-top:0">Affects only the target</h4><ul><li><b>Tuned membrane / Helmholtz trap</b> — about one octave around its frequency.</li><li><b>Notch / narrow EQ</b> — a few hertz.</li><li><b>Vibration isolator tuned to a machine</b> — isolates everything above √2·fn but amplifies near fn.</li></ul></div>
          <div class="card"><h4 style="margin-top:0">Affects everything on one side</h4><ul><li><b>High-pass filter</b> — all below the cut-off.</li><li><b>Deep porous bass trap</b> — from its low limit upward (fundamentals and harmonics).</li><li><b>Thin porous panel</b> — the highs only (harmonics), not the fundamental.</li><li><b>A wall</b> — removes highs much more than lows.</li></ul></div>
        </div>
        <p>So: a tuned trap at a 41 Hz room mode will <b>not</b> change the 82 Hz and 123 Hz modes (the room’s own harmonic series) or the bass guitar’s harmonics — they need broadband trapping or their own traps. A thin panel will not touch 41 Hz at all, only the harmonics above it. Try every combination here:</p>`, viz: 'lowTarget' },
      { h: 'Using it in the real world', html: `
        <div class="table-wrap"><table><tr><th>Situation</th><th>Think about…</th><th>What to do</th></tr>
          <tr><td>Boomy room on certain bass notes</td><td>Which notes? Their fundamentals coincide with room modes (and the mode series n·c/2L).</td><td>Broadband corner traps for the series; tuned trap only for one dominant mode.</td></tr>
          <tr><td>Bass inaudible on small speakers</td><td>Small speakers can’t play the fundamental.</td><td>Make the harmonics carry the note: mild saturation, upper-bass EQ, less sub-only content.</td></tr>
          <tr><td>Muddy mix</td><td>Low-mid harmonics of many instruments pile up at 150–400 Hz.</td><td>High-pass each track below its fundamental; cut overlapping harmonic regions, not the fundamentals.</td></tr>
          <tr><td>Neighbours hear the “thump”</td><td>Walls kill harmonics, pass fundamentals.</td><td>Design isolation for the fundamental (40–80 Hz): mass, decoupling, floated floors.</td></tr>
          <tr><td>Hum in a recording</td><td>Mains hum = 50/60 Hz + harmonics (100/120, 150/180…).</td><td>Fix grounding; if needed, a comb of notches at the harmonic series.</td></tr>
          <tr><td>Machine noise / vibration</td><td>Shaft rate (rpm/60) and blade-pass harmonics.</td><td>Isolate with fn ≤ ⅓ of the lowest forcing frequency; check harmonics for structural resonances.</td></tr>
          <tr><td>Feedback</td><td>The system rings at its most resonant frequency (a peak of speaker × room × mic).</td><td>Narrow notches at the ringing frequencies; better placement first.</td></tr>
          <tr><td>Speech intelligibility</td><td>Vowels live in harmonics up to ~1 kHz, consonants 2–4 kHz.</td><td>Protect 1–4 kHz from reverberation and noise; low-frequency boom masks it upward.</td></tr>
        </table></div>
        ${flow([['Identify f₀', 'note, machine speed, mode, hum'], ['List the harmonics', 'n·f₀ (and inharmonic partials)'], ['Find what matters', 'measure: which peaks ring or annoy'], ['Choose the bandwidth', 'narrow, one-sided or broadband'], ['Verify', 'measure before & after']])}` },
    ],
    quiz: [
      { q: 'The 3rd harmonic of A2 (110 Hz) is…', opts: ['113 Hz', '220 Hz', '330 Hz', '36.7 Hz'], a: 2, why: '3 × 110 Hz.' },
      { q: 'A tuned membrane trap at 41 Hz will strongly affect…', opts: ['Everything above 41 Hz', 'Roughly the octave around 41 Hz only', 'Only 4 kHz', 'Nothing'], a: 1, why: 'Resonant absorbers are band-limited.' },
      { q: 'Why can you hear the pitch of a bass note on a phone speaker?', opts: ['Phones play 41 Hz', 'The brain reconstructs the missing fundamental from the harmonics', 'Bass is louder', 'Compression'], a: 1, why: 'Missing-fundamental effect.' },
      { q: 'Raising damping (lowering Q) of a resonance…', opts: ['Makes it ring longer', 'Lowers and widens the peak and shortens the ringing', 'Moves it up an octave', 'Has no effect'], a: 1, why: 'Q sets peak height, bandwidth and decay.' },
    ],
  };
  const i = window.LESSONS.findIndex((l) => l.id === 'sound');
  window.LESSONS.splice(i + 1, 0, L);
})();
