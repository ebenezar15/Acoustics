/* ==========================================================================
   Academy curriculum, part 1 (chapters 1–10).
   Each chapter: {id, title, level, mins, summary, sections:[{h, html, viz}], quiz:[{q, opts, a, why}]}
   viz: name of a V.* widget or a function(host).
   ========================================================================== */
window.LESSONS = [
  /* ===================================================================== */
  {
    id: 'sound', n: 1, title: 'What Sound Really Is', level: 'Foundation', mins: 15,
    summary: 'Pressure waves, frequency, wavelength and why size is everything in acoustics.',
    tags: ['pressure', 'frequency', 'wavelength', 'speed of sound', 'octave'],
    sections: [
      { h: 'Sound is a pressure wave', html: `
        <p class="lead">Every acoustic decision you will ever make — a panel thickness, a wall build-up, where to sit — comes back to one idea: sound is a tiny, fast fluctuation of air pressure travelling outward from a vibrating object.</p>
        <p>A speaker cone pushes forward and squeezes the air in front of it (<b>compression</b>), then pulls back and leaves a slightly thinned region (<b>rarefaction</b>). Those regions pass the push on to their neighbours. The molecules themselves only jiggle back and forth a fraction of a millimetre — it is the <i>disturbance</i> that travels.</p>
        <p>The fluctuations are astonishingly small. Atmospheric pressure is about 101 325 Pa; a loud conversation changes it by only ~0.02 Pa, and the threshold of pain is ~20–60 Pa.</p>
        <div class="callout mentor">Whenever a client asks “why doesn’t my egg-crate foam stop the noise?”, bring them back here. Sound is energy moving through <i>any</i> medium — air, wood, concrete, steel. To stop it you must stop the medium from passing the motion on. That is a completely different job from making a room sound good.</div>`, viz: 'wave' },
      { h: 'Frequency, period and amplitude', html: `
        <p><b>Frequency (f)</b> is how many cycles pass per second, measured in hertz (Hz). We hear roughly 20 Hz – 20 kHz when young; the top end falls with age and noise exposure. <b>Period</b> T = 1/f — a 100 Hz wave repeats every 10 ms. <b>Amplitude</b> is the size of the pressure swing — we perceive it as loudness and measure it in decibels.</p>
        <div class="table-wrap"><table>
          <tr><th>Region</th><th>Range</th><th>What lives there</th><th>Acoustic headache</th></tr>
          <tr><td>Sub-bass</td><td>20–60 Hz</td><td>Kick drum fundamental, organ, LFE, HVAC rumble</td><td>Room modes, isolation, structure-borne noise</td></tr>
          <tr><td>Bass</td><td>60–250 Hz</td><td>Bass guitar, male voice body, toms</td><td>Modes, boundary interference (SBIR), boominess</td></tr>
          <tr><td>Low-mids</td><td>250–500 Hz</td><td>Warmth / “mud”</td><td>Boxiness in small booths, thin-panel resonances</td></tr>
          <tr><td>Mids</td><td>500 Hz–2 kHz</td><td>Vocal intelligibility, most instruments</td><td>Early reflections, comb filtering</td></tr>
          <tr><td>Upper-mids</td><td>2–5 kHz</td><td>Presence, consonants; ear’s most sensitive region</td><td>Harshness, flutter echo</td></tr>
          <tr><td>Highs</td><td>5–20 kHz</td><td>Air, cymbals, sibilance</td><td>Easily absorbed — over-absorption makes rooms dull</td></tr>
        </table></div>
        <p>Engineers divide the spectrum into <b>octaves</b> (each a doubling of frequency: 63, 125, 250, 500, 1k, 2k, 4k, 8k Hz) and finer <b>third-octaves</b>. Absorption data, transmission loss and noise criteria are all quoted in these bands.</p>` },
      { h: 'Speed of sound and wavelength', html: `
        <div class="formula"><span class="lbl">Speed of sound in air (T in °C)</span>c ≈ 331.3 · √(1 + T/273.15) ≈ 343 m/s at 20 °C</div>
        <div class="formula"><span class="lbl">Wavelength</span>λ = c / f</div>
        <p>Sound in water travels ~1480 m/s, in concrete ~3000–4000 m/s and in steel ~5000–6000 m/s. That’s why a hammer tapped on a building’s steel frame is heard floors away almost instantly — <b>structure-borne sound</b> is fast and loses little energy.</p>
        <div class="table-wrap"><table>
          <tr><th>Frequency</th><th class="num">Wavelength</th><th class="num">λ/4</th><th>Implication</th></tr>
          <tr><td>20 Hz</td><td class="num">17.2 m</td><td class="num">4.3 m</td><td>Longer than most rooms — only mass and decoupling stop it</td></tr>
          <tr><td>50 Hz</td><td class="num">6.9 m</td><td class="num">1.7 m</td><td>Typical first axial mode of a domestic room</td></tr>
          <tr><td>100 Hz</td><td class="num">3.4 m</td><td class="num">86 cm</td><td>Porous absorber would need ~85 cm depth for full effect</td></tr>
          <tr><td>250 Hz</td><td class="num">1.37 m</td><td class="num">34 cm</td><td>Thick panels + air gap start to work well</td></tr>
          <tr><td>1 kHz</td><td class="num">34 cm</td><td class="num">8.6 cm</td><td>A 50 mm panel already absorbs strongly</td></tr>
          <tr><td>4 kHz</td><td class="num">8.6 cm</td><td class="num">2.1 cm</td><td>Even curtains absorb it — beware “dead but boomy” rooms</td></tr>
        </table></div>
        <div class="callout physics">Objects interact strongly with sound only when they are comparable to or larger than the wavelength. A 30 cm panel is “big” to a 4 kHz wave and invisible to a 60 Hz one. Almost every rule of thumb in this app is a restatement of this.</div>`, viz: 'wavelength' },
    ],
    quiz: [
      { q: 'What actually travels from a speaker to your ear?', opts: ['Air molecules flowing toward you', 'A pressure disturbance passed from molecule to molecule', 'Electromagnetic waves', 'Heat'], a: 1, why: 'Molecules only oscillate around rest positions; the pressure disturbance propagates.' },
      { q: 'Wavelength of 343 Hz in air at 20 °C is about…', opts: ['34 cm', '1 m', '3.4 m', '10 cm'], a: 1, why: 'λ = c/f = 343/343 = 1 m.' },
      { q: 'Why is thin foam ineffective on bass?', opts: ['Foam is the wrong colour', 'Bass wavelengths are metres long — a few cm of foam barely interacts with them', 'Bass travels faster than treble', 'Foam reflects bass'], a: 1, why: 'Size relative to wavelength governs interaction.' },
      { q: 'An octave above 250 Hz is…', opts: ['260 Hz', '375 Hz', '500 Hz', '1 kHz'], a: 2, why: 'An octave is a doubling of frequency.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'decibels', n: 2, title: 'Decibels Without Fear', level: 'Foundation', mins: 20,
    summary: 'Logarithms made practical: adding levels, weighting, and what 3, 6, 10 and 60 dB really mean.',
    tags: ['dB', 'SPL', 'A-weighting', 'Leq', 'dBFS', 'dBu'],
    sections: [
      { h: 'Why a logarithmic scale?', html: `
        <p>The ear handles pressures from 20 µPa (threshold) to about 200 Pa (instant damage) — a ratio of ten million. Writing such numbers is clumsy, and our hearing responds roughly logarithmically anyway. So we use the decibel:</p>
        <div class="formula"><span class="lbl">Sound pressure level</span>L<sub>p</sub> = 20 · log₁₀(p / p₀), p₀ = 20 µPa</div>
        <div class="formula"><span class="lbl">Any power-like quantity (intensity, energy, sound power)</span>L = 10 · log₁₀(W / W₀)</div>
        <p>Pressure uses 20·log because power is proportional to pressure squared. 1 Pa ≈ 94 dB SPL — the level of a standard microphone calibrator.</p>` },
      { h: 'The numbers every acoustician knows by heart', html: `
        <div class="table-wrap"><table>
          <tr><th>Change</th><th>Energy (power)</th><th>Pressure</th><th>How it sounds</th></tr>
          <tr><td>+1 dB</td><td class="num">×1.26</td><td class="num">×1.12</td><td>Just noticeable in direct comparison</td></tr>
          <tr><td>+3 dB</td><td class="num">×2</td><td class="num">×1.41</td><td>Clearly noticeable; doubling the number of sources</td></tr>
          <tr><td>+6 dB</td><td class="num">×4</td><td class="num">×2</td><td>Halving distance from a point source</td></tr>
          <tr><td>+10 dB</td><td class="num">×10</td><td class="num">×3.16</td><td>“Twice as loud”</td></tr>
          <tr><td>+20 dB</td><td class="num">×100</td><td class="num">×10</td><td>Four times as loud</td></tr>
          <tr><td>−30 dB</td><td class="num">÷1000</td><td class="num">÷31.6</td><td>An eighth as loud</td></tr>
          <tr><td>−60 dB</td><td class="num">÷1 000 000</td><td class="num">÷1000</td><td>The definition of reverberation time decay</td></tr>
        </table></div>
        <div class="callout mentor">When a neighbour says “it’s half as loud now”, you’ve gained about 10 dB. When they say “I can’t hear it any more”, you usually needed 25–40 dB. Set expectations in these perceptual terms, not in “percent of noise removed”.</div>`, viz: 'dbThroughWall' },
      { h: 'Adding and subtracting levels', html: `
        <p>Decibels don’t add arithmetically. Two 80 dB sources make 83 dB, not 160 dB. Convert to energy, add, convert back:</p>
        <div class="formula"><span class="lbl">Energy sum</span>L<sub>total</sub> = 10 · log₁₀( Σ 10<sup>Lᵢ/10</sup> )</div>
        <div class="table-wrap"><table>
          <tr><th>Difference between two levels</th><th class="num">0</th><th class="num">1</th><th class="num">2</th><th class="num">3</th><th class="num">4</th><th class="num">6</th><th class="num">8</th><th class="num">10</th></tr>
          <tr><td>Add this to the higher one</td><td class="num">3.0</td><td class="num">2.5</td><td class="num">2.1</td><td class="num">1.8</td><td class="num">1.5</td><td class="num">1.0</td><td class="num">0.6</td><td class="num">0.4</td></tr>
        </table></div>
        <p>Practical consequence: <b>the loudest path dominates</b>. If a wall lets through 30 dB and a door next to it 45 dB, improving the wall does almost nothing until the door is fixed. Same with noise sources: silencing the quieter of two fans is wasted money.</p>
        <p>To find the level of a machine in the presence of background noise, measure both and subtract energies — if the total is less than 3 dB above background, the measurement is unreliable.</p>` },
      { h: 'Weightings and time averages', html: `
        <p>The ear is less sensitive to low and very high frequencies at moderate levels. Meters therefore apply filters:</p>
        <ul>
          <li><b>A-weighting (dBA)</b> — mimics the ear at moderate levels; strongly discounts bass (−26 dB at 63 Hz). Used for hearing protection, environmental noise, background noise limits.</li>
          <li><b>C-weighting (dBC)</b> — almost flat; used for loud sounds and music where bass matters (cinema calibration, peak levels). A big dBC − dBA difference tells you a noise is bass-heavy — the hardest kind to isolate.</li>
          <li><b>Z-weighting</b> — unweighted, flat.</li>
        </ul>
        <p>Levels change with time, so we summarise: <b>L<sub>eq</sub></b> (energy average), <b>L<sub>max</sub></b>, and statistical levels — <b>L<sub>90</sub></b> (exceeded 90 % of the time, the “background”) and <b>L<sub>10</sub></b> (the noisy events).</p>
        <div class="callout warn">Specifying a studio isolation target as “dBA” hides the bass problem. A kick drum may be 105 dBA but 115 dBC. Always design isolation in <b>octave or third-octave bands</b>, down to 63 Hz or lower for music.</div>` },
      { h: 'Decibels in the audio chain', html: `
        <div class="table-wrap"><table>
          <tr><th>Unit</th><th>Reference</th><th>Where you meet it</th></tr>
          <tr><td>dBFS</td><td>Digital full scale (0 dBFS = clip)</td><td>DAW meters, converters</td></tr>
          <tr><td>dBu</td><td>0.775 V RMS</td><td>Pro line level (+4 dBu nominal)</td></tr>
          <tr><td>dBV</td><td>1 V RMS</td><td>Consumer line level (−10 dBV)</td></tr>
          <tr><td>dB SPL</td><td>20 µPa</td><td>Acoustic level in the room</td></tr>
          <tr><td>LUFS / LKFS</td><td>Loudness units re. full scale</td><td>Programme loudness (EBU R128: −23 LUFS)</td></tr>
        </table></div>` },
    ],
    quiz: [
      { q: 'Two identical machines each produce 70 dB. Together they produce…', opts: ['140 dB', '73 dB', '76 dB', '70 dB'], a: 1, why: 'Doubling energy adds 3 dB.' },
      { q: 'A wall that reduces sound by 30 dB lets through what fraction of the energy?', opts: ['1/30', '1/100', '1/1000', '30 %'], a: 2, why: '10^(−30/10) = 0.001.' },
      { q: 'Which weighting is best for judging how bass-heavy a noise is?', opts: ['dBA only', 'Compare dBC with dBA', 'dBFS', 'L90'], a: 1, why: 'A large dBC − dBA gap indicates lots of low-frequency energy.' },
      { q: 'Perceived loudness roughly doubles for every…', opts: ['1 dB', '3 dB', '6 dB', '10 dB'], a: 3, why: 'The common psychoacoustic rule of thumb is +10 dB ≈ twice as loud.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'hearing', n: 3, title: 'Hearing & Psychoacoustics', level: 'Foundation', mins: 20,
    summary: 'How the ear-brain system interprets sound: loudness, masking, localisation and the precedence effect.',
    tags: ['equal loudness', 'Fletcher-Munson', 'Haas', 'masking', 'hearing damage'],
    sections: [
      { h: 'The ear is not a microphone', html: `
        <p>The outer ear funnels and colours sound (the pinna adds direction-dependent notches above ~4 kHz), the middle ear matches impedance from air to fluid, and the cochlea splits sound into overlapping frequency bands — <b>critical bands</b> roughly a third of an octave wide in the mid range. Hair cells in the cochlea do not regenerate: noise damage is permanent.</p>
        <p>The ear’s sensitivity is strongly level-dependent. The equal-loudness contours (Fletcher & Munson, 1933, refined as ISO 226) show how much more bass energy is needed to sound as loud as 1 kHz.</p>`, viz: 'equalLoudness' },
      { h: 'Masking', html: `
        <p>A louder sound hides quieter ones nearby in frequency — and more readily <i>upward</i> in frequency than downward. Bass rumble masks speech; a fan’s broadband hiss masks distant conversation.</p>
        <div class="callout alt">This is why offices use <b>sound masking</b> (a gentle broadband noise at ~40–45 dBA) to improve speech privacy, and why a <i>quiet</i> studio exposes leakage you’d never notice in a busy home. The better your room, the better your isolation must be.</div>` },
      { h: 'Precedence (Haas) effect & early reflections', html: `
        <p>When the same sound arrives twice within roughly 1–30 ms, the brain fuses the two and locates the sound at the first arrival — even if the reflection is somewhat louder. But fused reflections still change <i>timbre</i> (comb filtering) and <i>image</i> (width, focus).</p>
        <ul>
          <li><b>&lt; ~1 ms</b>: summing localisation — the image shifts between sources.</li>
          <li><b>~1–30 ms</b>: fusion; perceived as colouration, spaciousness, or image blur.</li>
          <li><b>&gt; ~50 ms</b> (speech) / ~80 ms (music): heard as a distinct <b>echo</b> if strong enough.</li>
        </ul>
        <p>This is the scientific foundation of control-room design philosophies: LEDE and RFZ aim to keep the first ~15–20 ms after the direct sound clean (reflections ≥ 15–20 dB down), so you hear the recording, not your room.</p>` },
      { h: 'Localisation and spaciousness', html: `
        <p>We locate sound with <b>interaural time differences</b> (below ~1.5 kHz) and <b>interaural level differences</b> (above, where the head shadows). In halls, early reflections arriving from the <b>sides</b> decorrelate the two ears — we perceive this as width (apparent source width) and envelopment. That’s the science behind the success of narrow shoebox halls.</p>` },
      { h: 'Protecting your ears — your most valuable tool', html: `
        <div class="table-wrap"><table>
          <tr><th>Level (dBA)</th><th class="num">85</th><th class="num">88</th><th class="num">91</th><th class="num">94</th><th class="num">97</th><th class="num">100</th><th class="num">106</th><th class="num">112</th></tr>
          <tr><td>NIOSH allowed daily exposure</td><td class="num">8 h</td><td class="num">4 h</td><td class="num">2 h</td><td class="num">1 h</td><td class="num">30 min</td><td class="num">15 min</td><td class="num">3.75 min</td><td class="num">≈ 1 min</td></tr>
        </table></div>
        <p>NIOSH uses an 85 dBA criterion with a 3 dB exchange rate (every +3 dB halves safe time). Mix at a calibrated, moderate level (≈ 79–83 dB SPL C-weighted per channel in small rooms), take breaks, and use musician’s earplugs (flat attenuation) at gigs.</p>
        <div class="callout mentor">After a loud session your hearing has a temporary threshold shift — your highs are dulled for hours. Never make final EQ decisions at the end of a loud day.</div>` },
    ],
    quiz: [
      { q: 'At low listening levels, the ear is least sensitive to…', opts: ['3 kHz', '1 kHz', 'Low bass', '500 Hz'], a: 2, why: 'Equal-loudness contours rise steeply at low frequencies, especially at low phon levels.' },
      { q: 'A reflection arriving 8 ms after the direct sound will usually be…', opts: ['Heard as a separate echo', 'Fused with the direct sound but colour the timbre/image', 'Inaudible always', 'Louder'], a: 1, why: 'Precedence effect: fusion within ~30 ms, but colouration remains.' },
      { q: 'Under NIOSH, if 85 dBA is safe for 8 h, 94 dBA is safe for…', opts: ['4 h', '2 h', '1 h', '15 min'], a: 2, why: '+9 dB = three halvings: 8 → 4 → 2 → 1 h.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'propagation', n: 4, title: 'How Sound Travels', level: 'Foundation', mins: 20,
    summary: 'Inverse-square law, directivity, boundaries, diffraction and barriers.',
    tags: ['inverse square', 'directivity', 'near field', 'diffraction', 'barrier', 'Maekawa'],
    sections: [
      { h: 'The inverse-square law', html: `
        <p>From a small (point) source in free space, energy spreads over a sphere whose area grows with r². Level therefore falls by 6 dB for every doubling of distance:</p>
        <div class="formula"><span class="lbl">Point source</span>L₂ = L₁ − 20 · log₁₀(r₂ / r₁)</div>
        <div class="formula"><span class="lbl">Line source (busy road, rail, line array in its near field)</span>L₂ = L₁ − 10 · log₁₀(r₂ / r₁)</div>
        <p>Indoors this only holds near the source. Further away, the reverberant field — reflections bouncing around — keeps the level roughly constant. The crossover point is the <b>critical distance</b>.</p>`, viz: 'inverseSquare' },
      { h: 'Directivity and boundaries', html: `
        <p>Directivity factor <b>Q</b> describes how a source focuses energy. A source in free space radiates into a full sphere (Q = 1). Put it against a wall (Q = 2) and the same power goes into half the space: +3 dB in power terms, and up to +6 dB at low frequencies where the wall reflection arrives in phase.</p>
        <div class="table-wrap"><table>
          <tr><th>Placement</th><th class="num">Q</th><th class="num">LF gain (ideal)</th></tr>
          <tr><td>Free space</td><td class="num">1</td><td class="num">0 dB</td></tr>
          <tr><td>On a floor / against one wall</td><td class="num">2</td><td class="num">+6 dB</td></tr>
          <tr><td>In a wall–floor edge</td><td class="num">4</td><td class="num">+12 dB</td></tr>
          <tr><td>In a corner</td><td class="num">8</td><td class="num">+18 dB</td></tr>
        </table></div>
        <div class="callout mentor">This is why a speaker sounds bass-heavy when pushed into a corner, and why subwoofers placed in corners excite <i>every</i> room mode. Placement is free EQ — use it before reaching for a plug-in.</div>` },
      { h: 'Near field, far field', html: `
        <p>Close to a large source (or a speaker array), level does not yet follow the inverse-square law — different parts of the source interfere. A rule of thumb: measure at least ~2–3× the largest source dimension away. Near-field monitors are called that because you sit close enough for the direct sound to dominate the room’s reflections, not because you’re in their acoustic near field.</p>` },
      { h: 'Diffraction: sound bends', html: `
        <p>When sound meets an edge or opening comparable in size to its wavelength, it bends around. Bass diffracts around almost everything: that’s why you hear the bass of a car stereo around the corner of a building, and why a 1 % crack in a wall leaks so much.</p>
        <p>Outdoor barriers rely on making sound travel further over the top. Maekawa’s chart (for a point source) relates insertion loss to the Fresnel number N = 2δ/λ, where δ is the extra path length:</p>
        <div class="formula"><span class="lbl">Barrier insertion loss (approx.)</span>IL ≈ 10 · log₁₀(3 + 20N) dB, practical limit ≈ 20–25 dB</div>
        <p>A 3 m garden wall might give 15 dB at 1 kHz but only ~5 dB at 63 Hz — the low rumble of a road or a band still gets over.</p>`, viz: 'surfaces' },
      { h: 'Air absorption & refraction', html: `
        <p>Air itself absorbs high frequencies, significantly above ~2 kHz over long distances — this matters in large halls (it shortens high-frequency reverberation) and outdoors. Temperature and wind gradients <b>refract</b> sound: at night with a temperature inversion, sound bends back down and distant noise becomes audible — a classic cause of evening complaints near venues.</p>` },
    ],
    quiz: [
      { q: 'Moving from 2 m to 8 m from a point source outdoors changes the level by…', opts: ['−6 dB', '−12 dB', '−18 dB', '−24 dB'], a: 1, why: 'Two doublings × 6 dB = 12 dB.' },
      { q: 'A subwoofer in a corner (vs free space) can gain up to…', opts: ['+3 dB', '+6 dB', '+12 dB', '+18 dB'], a: 3, why: 'Three boundaries: Q = 8, about +18 dB at low frequencies ideally.' },
      { q: 'Why do barriers struggle with bass?', opts: ['Bass is quieter', 'Long wavelengths diffract over the top easily', 'Bass travels slower', 'Barriers absorb treble only'], a: 1, why: 'Small Fresnel number at low frequencies = little insertion loss.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'interference', n: 5, title: 'Reflections, Phase & Comb Filtering', level: 'Core', mins: 25,
    summary: 'Why reflections colour sound, what SBIR is, and how flutter echo happens.',
    tags: ['phase', 'polarity', 'comb filter', 'SBIR', 'flutter echo'],
    sections: [
      { h: 'Phase and polarity', html: `
        <p>Phase describes where in its cycle a wave is. Two copies of the same signal add fully when in phase (+6 dB) and cancel when 180° apart. Polarity inversion flips the waveform — the same as 180° at every frequency. A <i>time delay</i>, by contrast, creates a phase shift that grows with frequency.</p>`, viz: 'phase' },
      { h: 'Comb filtering', html: `
        <p>Direct sound + one delayed reflection = a response with regular notches. The first notch is at f = 1/(2Δt), then every 1/Δt. A desk reflection 0.7 m longer than the direct path (Δt ≈ 2 ms) puts its first notch at ~250 Hz and repeats every ~500 Hz across the whole mid-range.</p>
        <div class="callout mentor">Clap your hands between two hard parallel walls, then move a mic near a desk and listen through headphones while you raise and lower it. That swooshing, “phasey” change is comb filtering — and it’s exactly what reflections in your room do to every mix decision.</div>
        <p>Fixes, in order of effectiveness: <b>remove</b> the reflecting surface (angle it, move the speaker), <b>absorb</b> it (thick, broadband), or <b>diffuse</b> it (only if you’re far enough away). Reducing the reflection by 10 dB reduces the notch depth from deep holes to about ±3 dB ripple.</p>`, viz: 'comb' },
      { h: 'SBIR — speaker boundary interference', html: `
        <p>A speaker radiates backwards at low frequencies. The wave reflects off the wall behind it and returns out of phase at the frequency where the round trip equals half a wavelength:</p>
        <div class="formula"><span class="lbl">First cancellation from a boundary at distance d</span>f<sub>null</sub> = c / (4d)</div>
        <div class="table-wrap"><table>
          <tr><th>Speaker–wall distance</th><th class="num">0.2 m</th><th class="num">0.5 m</th><th class="num">0.8 m</th><th class="num">1.0 m</th><th class="num">1.5 m</th><th class="num">2.0 m</th></tr>
          <tr><td>First null</td><td class="num">429 Hz</td><td class="num">172 Hz</td><td class="num">107 Hz</td><td class="num">86 Hz</td><td class="num">57 Hz</td><td class="num">43 Hz</td></tr>
        </table></div>
        <p>Every boundary (front wall, side walls, floor, ceiling) adds its own notch. Solutions:</p>
        <ul>
          <li><b>Flush-mount (soffit) the speakers</b> into a rigid front wall — the boundary is at the baffle, so the null disappears. This is the professional standard in many high-end control rooms.</li>
          <li><b>Very close</b> to the wall (&lt; ~0.3 m) pushes the null up toward or above the woofer’s range where the speaker is more directional.</li>
          <li><b>Far away</b> (&gt; ~1.5–2 m) pushes it down below the important bass — then use very thick absorption behind the speakers.</li>
          <li>Make distances to the front wall, side wall and floor <b>different</b> so the nulls don’t stack at one frequency.</li>
        </ul>
        <div class="callout warn">You can’t EQ out a null: boosting a cancellation just feeds more energy into both the direct and the cancelling reflected wave. Fix it with position or treatment.</div>` },
      { h: 'Flutter echo', html: `
        <p>Two parallel hard surfaces bounce a clap back and forth — a buzzing “zing” with a repetition rate of c/(2·distance). Treat one surface of each parallel pair with absorption or diffusion, or splay one wall by ≥ ~5–10°. Splaying cures flutter; it does <i>not</i> remove room modes (they just get messier).</p>` },
    ],
    quiz: [
      { q: 'A reflection path 1.72 m longer than the direct path gives a first comb notch at…', opts: ['50 Hz', '100 Hz', '200 Hz', '1 kHz'], a: 1, why: 'Δt = 1.72/343 = 5 ms → first notch at 1/(2·0.005) = 100 Hz.' },
      { q: 'A speaker 0.86 m from the front wall has its first SBIR null near…', opts: ['50 Hz', '100 Hz', '200 Hz', '400 Hz'], a: 1, why: 'c/4d = 343/3.44 ≈ 100 Hz.' },
      { q: 'Best permanent fix for SBIR from the front wall?', opts: ['Boost EQ at the null', 'Flush-mount the speakers in a rigid baffle wall', 'Add thin foam behind the speaker', 'Turn the speaker up'], a: 1, why: 'Soffit mounting removes the boundary reflection path.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'modes', n: 6, title: 'Room Modes: The Bass Problem', level: 'Core', mins: 30,
    summary: 'Standing waves, room ratios, Schroeder frequency, and practical strategies for smooth bass.',
    tags: ['room modes', 'standing waves', 'axial', 'Bolt', 'Bonello', 'Schroeder frequency', 'subwoofer'],
    sections: [
      { h: 'Standing waves', html: `
        <p>Between two parallel walls, a wave whose half-wavelength fits the distance exactly reflects back on itself and forms a fixed pattern of high pressure (<b>antinodes</b>) at the walls and zero pressure (<b>nodes</b>) between. These resonances are <b>room modes</b>. Each rings like a bell: it boosts its frequency and decays slowly.</p>
        <div class="formula"><span class="lbl">Rectangular room mode frequencies</span>f = (c/2) · √[ (nₓ/L)² + (n<sub>y</sub>/W)² + (n<sub>z</sub>/H)² ]</div>
        <ul>
          <li><b>Axial</b> modes involve one pair of walls (e.g. 1,0,0) — the strongest.</li>
          <li><b>Tangential</b> modes involve four surfaces (1,1,0) — about 3 dB weaker.</li>
          <li><b>Oblique</b> modes involve all six (1,1,1) — about 6 dB weaker.</li>
        </ul>
        <p>Every mode has a pressure maximum in every <b>corner</b> of the room. That single fact explains why corners are the best place for bass traps and the worst place for a subwoofer if you want an even response.</p>`, viz: 'modes2D' },
      { h: 'The four frequency regions of a room', html: `
        <ol>
          <li><b>Below the first axial mode</b> (f &lt; c/2L): the room acts as a pressure chamber — sealed rooms actually gain bass here (“room gain”).</li>
          <li><b>Modal region</b>: individual modes dominate; the response varies wildly by seat (±15 dB is common in small untreated rooms).</li>
          <li><b>Transition</b> around the <b>Schroeder frequency</b>: modes overlap more and more.</li>
          <li><b>Statistical / ray region</b>: so many modes overlap that the room behaves smoothly — reflections and reverberation dominate.</li>
        </ol>
        <div class="formula"><span class="lbl">Schroeder frequency</span>f<sub>S</sub> ≈ 2000 · √(T₆₀ / V)</div>
        <p>For a 50 m³ studio with T₆₀ = 0.3 s, f<sub>S</sub> ≈ 155 Hz. Below that, think waves and modes; above it, think rays and reflections. In a 20 000 m³ concert hall, f<sub>S</sub> is ~20 Hz — modes are a non-issue, which is why hall acoustics and small-room acoustics are such different disciplines.</p>` },
      { h: 'Room proportions', html: `
        <p>If two dimensions are equal or simple multiples (3 × 3 m, or 2.4 × 4.8 m), their modes stack on the same frequencies — a few very strong peaks with big gaps between. Good proportions spread modes evenly.</p>
        <div class="table-wrap"><table>
          <tr><th>Source</th><th>H : W : L</th></tr>
          <tr><td>Sepmeyer A</td><td>1 : 1.14 : 1.39</td></tr>
          <tr><td>Sepmeyer B</td><td>1 : 1.28 : 1.54</td></tr>
          <tr><td>Sepmeyer C</td><td>1 : 1.60 : 2.33</td></tr>
          <tr><td>Louden</td><td>1 : 1.4 : 1.9</td></tr>
          <tr><td>IEC / EBU-style recommendation</td><td>1.1·W/H ≤ L/H ≤ 4.5·W/H − 4; L/H &lt; 3; W/H &lt; 3</td></tr>
        </table></div>
        <p><b>Bonello’s criterion</b> checks that the number of modes per third-octave band never decreases as frequency rises, and that coincident modes appear only in bands with plenty of others. The Room Analyzer runs both checks for you.</p>
        <div class="callout warn">Obsessing over “perfect ratios” in a room you can’t change is wasted energy. Ratios matter most when you are <i>building</i>. In an existing room, positioning and treatment give you far more.</div>` },
      { h: 'Practical fixes, ranked', html: `
        <ol class="steps">
          <li><b>Listening position.</b> Avoid the exact centre of the room (the first length mode has a null there, so bass vanishes) and the rear wall (every mode peaks there). Start at ~38 % of the room length from the front wall, then measure and move in 5 cm steps.</li>
          <li><b>Speaker / sub position.</b> Move the source to a node of an offending mode to stop exciting it. Subwoofers: try the “sub crawl” — put the sub at your listening seat, crawl around the floor, and place it where the bass sounds smoothest.</li>
          <li><b>Multiple subwoofers.</b> Research by Welti and Devantier (Harman) showed that 2–4 subs at wall mid-points or corners cancel many modes and dramatically improve seat-to-seat consistency.</li>
          <li><b>Bass trapping.</b> Thick porous absorbers in corners (tri-corners best), or tuned membrane/Helmholtz traps for specific modes. Expect to need a lot: low frequencies need volume.</li>
          <li><b>EQ last.</b> Cut peaks (they’re minimum-phase and respond well); never boost nulls.</li>
        </ol>` },
    ],
    quiz: [
      { q: 'The first axial length mode of a 5.72 m long room is…', opts: ['15 Hz', '30 Hz', '60 Hz', '120 Hz'], a: 1, why: 'c/(2L) = 343/11.44 ≈ 30 Hz.' },
      { q: 'Where are the pressure maxima of every room mode?', opts: ['In the centre', 'In the corners', 'At ear height', 'Nowhere in particular'], a: 1, why: 'cos() terms are all ±1 at the boundaries; corners are maxima for all modes.' },
      { q: 'Why is sitting exactly in the middle of the room bad?', opts: ['Too far from speakers', 'Odd-order axial modes have nulls there — bass disappears', 'It is closer to the ceiling', 'It is fine'], a: 1, why: 'The (1,0,0) mode has a node at L/2.' },
      { q: 'Above the Schroeder frequency the room behaves…', opts: ['Modally', 'Statistically / like rays', 'Like an anechoic chamber', 'Like a pressure chamber'], a: 1, why: 'Modal overlap makes the field diffuse and smooth.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'reverb', n: 7, title: 'Reverberation & Room Decay', level: 'Core', mins: 25,
    summary: 'Sabine and Eyring, RT targets for every room type, and the critical distance.',
    tags: ['RT60', 'Sabine', 'Eyring', 'critical distance', 'EDT', 'bass ratio'],
    sections: [
      { h: 'Direct, early, late', html: `
        <p>The sound you hear in a room arrives in three parts: the <b>direct sound</b>; <b>early reflections</b> (first ~50–80 ms) that the brain fuses with it and which define clarity, width and colour; and the <b>late reverberant tail</b>, a dense decaying wash. Reverberation time <b>RT60</b> (T₆₀) is the time for the tail to decay 60 dB after the source stops.</p>`, viz: 'reverb' },
      { h: 'Sabine and Eyring', html: `
        <p>Wallace Clement Sabine, working on Harvard’s Fogg lecture hall around 1895–1900, discovered empirically that RT is proportional to volume and inversely proportional to total absorption:</p>
        <div class="formula"><span class="lbl">Sabine (metric)</span>T₆₀ = 0.161 · V / A, &nbsp; A = Σ Sᵢ·αᵢ (m² sabins)</div>
        <div class="formula"><span class="lbl">Eyring (better for absorbent rooms, ᾱ &gt; ~0.2)</span>T₆₀ = 0.161 · V / ( −S · ln(1 − ᾱ) + 4mV )</div>
        <p>m is air attenuation — negligible below ~1 kHz, significant at 4 kHz in large halls. Both formulas assume a <b>diffuse field</b> (sound energy evenly distributed and travelling in all directions). Small rooms with all the absorption on one surface violate that badly — use the numbers as guides, then measure.</p>
        <div class="callout data"><b>Worked example.</b> A 5 × 4 × 2.7 m room: V = 54 m³, S = 88.6 m². Target 0.3 s → A = 0.161 × 54 / 0.3 = 29 m² sabins. Bare drywall room ≈ 7 m² sabins at 500 Hz → add ≈ 22 m² of α ≈ 1 treatment. At 125 Hz, 50 mm panels give α ≈ 0.2, so you’d need ~5× more area: that’s why you use thick bass traps instead.</div>` },
      { h: 'RT targets', html: `
        <div class="table-wrap"><table>
          <tr><th>Space</th><th>Mid-frequency RT (s)</th><th>Notes</th></tr>
          <tr><td>Vocal booth</td><td>0.12–0.25</td><td>Broadband; avoid boxy low-mids</td></tr>
          <tr><td>Control room</td><td>0.2–0.4</td><td>EBU: Tm = 0.25·(V/100)^⅓ ± 0.05 s, flat with frequency</td></tr>
          <tr><td>Home cinema</td><td>0.25–0.45</td><td>Even across bands</td></tr>
          <tr><td>Classroom</td><td>≤ 0.6</td><td>ANSI S12.60 for rooms ≤ 283 m³</td></tr>
          <tr><td>Live room</td><td>0.4–0.8+</td><td>Ideally variable</td></tr>
          <tr><td>Drama theatre</td><td>0.9–1.3</td><td>Speech clarity first</td></tr>
          <tr><td>Opera</td><td>1.3–1.6</td><td>Text + bloom</td></tr>
          <tr><td>Symphony hall</td><td>1.8–2.2 (occupied)</td><td>Bass ratio 1.1–1.25</td></tr>
          <tr><td>Cathedral</td><td>4–10</td><td>Chant & organ music written for it</td></tr>
        </table></div>
        <p>Stephens & Bate’s classic formula scales optimum RT with volume: T = r·(0.012·V^⅓ + 0.107), with r = 4 for speech, 5 for orchestra, 6 for choral/organ.</p>
        <div class="callout warn">A low mid-band RT with a long bass tail (very common — foam everywhere, no bass traps) sounds <b>dull and boomy at the same time</b>. Balance across bands matters more than the mid-band number.</div>` },
      { h: 'Critical distance', html: `
        <div class="formula"><span class="lbl">Distance where direct and reverberant levels are equal</span>D<sub>c</sub> ≈ 0.057 · √(Q·V / T₆₀)</div>
        <p>In a 60 m³ room with T = 0.3 s and Q = 2 (a speaker on a stand), D<sub>c</sub> ≈ 1.1 m. Mix positions should be within or around D<sub>c</sub> so direct sound dominates. In a 15 000 m³ hall with T = 2 s, D<sub>c</sub> ≈ 5 m — most of the audience hears mostly reverberant sound, which is the point.</p>` },
      { h: 'Other decay measures', html: `
        <ul>
          <li><b>EDT</b> (early decay time): slope of the first 10 dB × 6 — correlates best with perceived reverberance.</li>
          <li><b>T20 / T30</b>: RT extrapolated from −5 to −25 / −35 dB — what analysers report.</li>
          <li><b>Bass ratio</b> BR = (RT₁₂₅ + RT₂₅₀)/(RT₅₀₀ + RT₁ₖ) — warmth in halls; aim ≈ 1 in studios.</li>
        </ul>` },
    ],
    quiz: [
      { q: 'Using Sabine, a 100 m³ room with 40 m² sabins has RT ≈', opts: ['0.2 s', '0.4 s', '0.8 s', '1.6 s'], a: 1, why: '0.161 × 100 / 40 = 0.40 s.' },
      { q: 'Doubling the absorption in a room changes RT by…', opts: ['Halves it', 'Doubles it', '−3 dB', 'Nothing'], a: 0, why: 'T is inversely proportional to A (Sabine).' },
      { q: 'Which formula is more accurate for a highly absorbent studio?', opts: ['Sabine', 'Eyring', 'Mass law', 'Maekawa'], a: 1, why: 'Eyring handles high mean absorption better.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'absorption', n: 8, title: 'Absorption: Porous, Membrane & Helmholtz', level: 'Core', mins: 35,
    summary: 'How absorbers work, how to size them, and which type to choose for which frequency.',
    tags: ['absorber', 'porous', 'flow resistivity', 'bass trap', 'membrane', 'Helmholtz', 'NRC', 'air gap'],
    sections: [
      { h: 'Three families of absorbers', html: `
        <div class="table-wrap"><table>
          <tr><th>Type</th><th>Mechanism</th><th>Range</th><th>Typical use</th></tr>
          <tr><td>Porous (mineral wool, glass/polyester fibre, foam)</td><td>Viscous friction as air moves through fibres</td><td>Broadband; LF limit set by depth</td><td>Reflection points, clouds, broadband bass traps</td></tr>
          <tr><td>Membrane / panel (limp mass or plywood over a sealed cavity)</td><td>Mass-spring resonance; panel flexing</td><td>40–250 Hz, about 1 octave wide</td><td>Tuned bass traps where depth is limited</td></tr>
          <tr><td>Helmholtz (slotted, perforated, single resonators)</td><td>Air in holes (mass) on cavity air (spring)</td><td>80 Hz–2 kHz, tunable</td><td>Architectural wood finishes, low-mid control</td></tr>
          <tr><td>Micro-perforated panels</td><td>Viscous losses in sub-mm holes</td><td>Mid; no fibres needed</td><td>Transparent/clean environments, glass, hygiene areas</td></tr>
        </table></div>` },
      { h: 'Porous absorbers: depth, density and the air gap', html: `
        <p>Porous materials only work where air <i>moves</i>. At a rigid wall the particle velocity is zero; it peaks a quarter-wavelength out. So a thin panel flat on the wall only touches high frequencies. Increase depth, or space the panel off the wall, and it reaches lower.</p>
        <p><b>Flow resistivity σ</b> (Pa·s/m²) tells you how hard it is to blow air through a material. Too low and sound passes straight through; too high and the surface reflects. For practical depths, 5 000–25 000 Pa·s/m² is the sweet spot; for very thick traps (200 mm+), lower σ (≈ 4 000–10 000) works better because total resistance σ·d must stay around 1–3 × ρc (≈ 400–1200 Rayls).</p>
        <div class="table-wrap"><table>
          <tr><th>Depth (wool, on wall)</th><th>Useful down to (α ≳ 0.5)</th><th>With an equal air gap</th></tr>
          <tr><td>25 mm</td><td>≈ 800 Hz</td><td>≈ 500 Hz</td></tr>
          <tr><td>50 mm</td><td>≈ 350 Hz</td><td>≈ 200 Hz</td></tr>
          <tr><td>100 mm</td><td>≈ 175 Hz</td><td>≈ 100 Hz</td></tr>
          <tr><td>200 mm</td><td>≈ 90 Hz</td><td>≈ 60 Hz</td></tr>
          <tr><td>300 mm+ / corner superchunk</td><td>≈ 60 Hz</td><td>—</td></tr>
        </table></div>
        <p>Play with the model below — it uses the Miki impedance model with random-incidence averaging, the same physics as the Absorber Designer.</p>`, viz: 'porous' },
      { h: 'Reading absorption data honestly', html: `
        <ul>
          <li><b>α</b> is the fraction of incident energy not reflected (0–1). Published values above 1 happen because of edge diffraction in lab tests on small samples — treat as ≈ 1.</li>
          <li><b>NRC</b> = average of α at 250, 500, 1k and 2k Hz, rounded to 0.05. It ignores 125 Hz and below entirely. Two products with NRC 0.85 can differ wildly in bass.</li>
          <li><b>SAA</b> (ASTM C423) averages twelve third-octaves from 200 Hz to 2.5 kHz — a bit better.</li>
          <li><b>Mounting matters</b>: “Type A” means flat on a hard surface; “E-400” means 400 mm off the surface (ceiling tiles). The same product performs very differently on each.</li>
        </ul>
        <div class="callout mentor">Independent laboratory work repeatedly shows that published coefficients depend heavily on sample size, mounting and test procedure. When the numbers matter, ask for the full third-octave test report, the mounting type and the lab — not a marketing NRC.</div>` },
      { h: 'Membrane (panel) absorbers', html: `
        <p>A limp or semi-rigid panel (plywood, MDF, hardboard, or a heavy membrane) sealed over an air cavity forms a mass–spring system. Partially filling the cavity with wool broadens and damps the resonance.</p>
        <div class="formula"><span class="lbl">Resonant frequency (m in kg/m², d in m)</span>f₀ ≈ 60 / √(m·d) &nbsp; (empty) &nbsp; · &nbsp; ≈ 50 / √(m·d) &nbsp; (wool-filled)</div>
        <div class="callout data">6 mm plywood (≈ 3.6 kg/m²) over a 100 mm wool-filled cavity: f₀ ≈ 50/√(0.36) ≈ 83 Hz. Thicker panel or deeper cavity → lower f₀.</div>
        <div class="callout warn">A membrane trap must be <b>airtight</b> (sealed edges) or the “spring” leaks and it stops working. Measure before and after — tuned traps that miss their mode by 20 % do little.</div>` },
      { h: 'Helmholtz resonators & slotted panels', html: `
        <div class="formula"><span class="lbl">Perforated / slotted panel over cavity depth D</span>f₀ = (c / 2π) · √( ε / (t′ · D) ), &nbsp; t′ = t + end corrections</div>
        <p>ε is the open-area fraction, t the panel thickness. Lower open area, thicker panel or deeper cavity → lower frequency. Classic “slat walls” — timber battens with gaps over a wool-filled cavity — are exactly this, and they look like architecture rather than treatment.</p>`, viz: 'helmholtz' },
      { h: 'Safety & materials', html: `
        <ul>
          <li><b>Fire</b>: use materials with appropriate fire ratings for your jurisdiction (e.g. Euroclass A1/A2 mineral wool, Class A per ASTM E84). Untreated polyurethane foam is a serious fire risk — the 2003 Station nightclub fire in Rhode Island is the tragic reference case.</li>
          <li><b>Fibres</b>: wrap mineral wool in breathable fabric (if you can easily blow through it, it’s acoustically transparent). Wear gloves, mask and eye protection when cutting.</li>
          <li><b>Density myths</b>: heavier is not always better. Very dense boards (≥ 100 kg/m³) can reflect at the surface; 40–60 kg/m³ wool is ideal for most panels.</li>
        </ul>` },
    ],
    quiz: [
      { q: 'A 50 mm panel flat on the wall is weak at 125 Hz mainly because…', opts: ['It’s not dense enough', 'Particle velocity is near zero close to the wall at low frequencies', 'Bass is absorbed by air', 'Panels only work at 45°'], a: 1, why: 'Velocity peaks at λ/4 (69 cm at 125 Hz) from the wall.' },
      { q: 'NRC ignores which band?', opts: ['500 Hz', '1 kHz', '125 Hz', '2 kHz'], a: 2, why: 'NRC = mean of 250, 500, 1k, 2k Hz.' },
      { q: 'A membrane trap with m = 10 kg/m² over a 100 mm filled cavity resonates near…', opts: ['25 Hz', '50 Hz', '100 Hz', '200 Hz'], a: 1, why: '50/√(10·0.1) = 50 Hz.' },
      { q: 'Spacing a porous panel off the wall…', opts: ['Reduces its bass absorption', 'Extends its absorption to lower frequencies', 'Has no effect', 'Only helps above 4 kHz'], a: 1, why: 'The panel moves into the region of higher particle velocity.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'diffusion', n: 9, title: 'Diffusion & Scattering', level: 'Core', mins: 25,
    summary: 'Schroeder diffusers, number theory, design limits and when not to use diffusion at all.',
    tags: ['diffuser', 'QRD', 'PRD', 'skyline', 'Schroeder', 'scattering coefficient'],
    sections: [
      { h: 'Why diffuse instead of absorb?', html: `
        <p>Absorption removes energy. Diffusion keeps the energy in the room but breaks a single strong reflection into many weaker ones spread in angle and time. The room stays lively without the comb filtering, flutter and image shift of a specular reflection. Diffusion is essential in halls, live rooms and the rear of larger control rooms.</p>`, viz: 'surfaces' },
      { h: 'Schroeder’s number-theory diffusers', html: `
        <p>In 1975 Manfred Schroeder showed that a surface of wells whose depths follow certain number sequences scatters energy almost equally into many directions. The <b>Quadratic Residue Diffuser (QRD)</b> uses:</p>
        <div class="formula"><span class="lbl">Quadratic residue sequence (N prime)</span>sₙ = n² mod N, &nbsp; n = 0 … N−1</div>
        <div class="formula"><span class="lbl">Well depths for design frequency f₀</span>dₙ = sₙ · λ₀ / (2N) = sₙ · c / (2N·f₀)</div>
        <ul>
          <li><b>Lower limit</b> ≈ f₀ (in practice it keeps scattering somewhat below). Lower f₀ → deeper wells.</li>
          <li><b>Upper limit</b> ≈ c / (2w), where w is well width. Narrow wells scatter higher.</li>
          <li><b>Thin rigid fins</b> between wells are essential for a 1D QRD.</li>
          <li><b>Primitive root diffusers (PRD)</b> (sₙ = gⁿ mod N) suppress the specular lobe more; <b>2D skyline</b> blocks scatter in both planes.</li>
        </ul>
        <p>Trevor Cox and Peter D’Antonio’s <i>Acoustic Absorbers and Diffusers</i> is the definitive text. D’Antonio’s company RPG commercialised Schroeder diffusers from the 1980s.</p>` },
      { h: 'Where diffusion works — and where it doesn’t', html: `
        <ul>
          <li>Diffusers need distance: the scattered lobes only form properly some way from the surface. A common guideline is to sit at least ~2–3 m away for typical 1D QRDs; closer, you hear lumpy interference rather than smooth diffusion.</li>
          <li>Diffusers do <b>not</b> fix bass problems below their design frequency, and they don’t reduce RT much — they’re not a substitute for bass trapping.</li>
          <li>Periodic arrays of identical diffusers create grating lobes at specific frequencies; modulate or vary periods on large areas.</li>
          <li>In small rooms, mild scattering surfaces (polycylinders, bookshelves, irregular furniture, 2D skylines) are often more useful than big 1D QRDs.</li>
        </ul>
        <div class="callout alt">Alternatives to dedicated diffusers: angled reflective panels (redirect rather than scatter — the RFZ approach), convex curved surfaces (polycylinders also act as bass absorbers), bookshelves with varied depths, or simply absorbing the reflection when you’re too close for diffusion to work.</div>
        <p>Measure two different things: the <b>scattering coefficient</b> (ISO 17497-1, energy moved out of the specular direction — used in room simulation) and the <b>diffusion coefficient</b> (ISO 17497-2, how uniform the scattered energy is in angle).</p>` },
      { h: 'See it as waves', html: `<p>Pick the <b>QRD diffuser vs flat wall</b> preset and send a pulse. Compare with the “Small room” preset. Watch how the wavefront returning from the wells is broken up.</p>`, viz: (h) => V.waveTank(h, { preset: 'qrd', height: 320 }) },
    ],
    quiz: [
      { q: 'For a QRD with N = 7 and f₀ = 500 Hz, the deepest well (s = 4) is about…', opts: ['5 cm', '20 cm', '39 cm', '1 m'], a: 1, why: 'd = 4 × 343 / (2 × 7 × 500) ≈ 0.196 m.' },
      { q: 'The upper frequency limit of a QRD is set mainly by…', opts: ['Total depth', 'Well width', 'Number of periods', 'Wood species'], a: 1, why: 'fmax ≈ c / (2w).' },
      { q: 'A diffuser 60 cm behind your head in a small room…', opts: ['Works perfectly', 'Is probably too close to diffuse smoothly — absorption may serve better', 'Fixes bass modes', 'Increases isolation'], a: 1, why: 'Diffusers need far-field distance to form even scattering.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'isolation', n: 10, title: 'Soundproofing Fundamentals', level: 'Core', mins: 35,
    summary: 'Mass, decoupling, damping and airtightness — the four pillars of isolation, with STC and Rw explained.',
    tags: ['soundproofing', 'mass law', 'STC', 'Rw', 'decoupling', 'coincidence', 'mass-air-mass', 'damping'],
    sections: [
      { h: 'Absorption is not isolation', html: `
        <p>The most common and expensive misconception in this field. An absorber with α = 0.9 absorbs 90 % of what hits it — and lets most of the rest <i>through</i>. Isolation (transmission loss) is about stopping energy crossing a barrier, measured in dB. A good studio wall stops 99.999 % (50 dB) of the energy. Foam on a wall adds essentially nothing.</p>
        <div class="callout mentor">Think of two separate jobs: <b>isolation</b> (keep sound in/out — built into the structure, decided at design stage, very expensive to fix later) and <b>treatment</b> (make the room sound right — surfaces, can be adjusted forever). Always solve isolation first.</div>`, viz: 'dbThroughWall' },
      { h: 'Pillar 1 — Mass (and the mass law)', html: `
        <p>A heavy panel is harder to set in motion. For a limp single panel in the mass-controlled region:</p>
        <div class="formula"><span class="lbl">Field-incidence mass law (m in kg/m², f in Hz)</span>TL ≈ 20 · log₁₀(m · f) − 47 dB</div>
        <p>Doubling mass or frequency gains only ~6 dB. Going from one to two layers of drywall is +6 dB at best; going from two to four is another +6 dB. Mass alone gets expensive fast.</p>
        <p>Every real panel also has a <b>coincidence frequency</b> f<sub>c</sub>, where bending waves in the panel travel at the same speed as the trace of the sound wave in air. Isolation dips there (around 2.5 kHz for 12.5 mm drywall, ~2 kHz for 6 mm glass, ~100–150 Hz for 150 mm concrete). Stiff thick panels have low f<sub>c</sub>; thin limp ones high.</p>`, viz: 'massLaw' },
      { h: 'Pillar 2 — Decoupling (mass–air–mass)', html: `
        <p>Two leaves separated by an air cavity behave far better than the same total mass in one leaf — <i>above</i> the mass–air–mass resonance f₀, where TL rises at up to 18 dB/octave. Below and at f₀ the double wall is worse than a single leaf.</p>
        <div class="formula"><span class="lbl">Mass–air–mass resonance (m₁, m₂ kg/m², d m)</span>f₀ ≈ 60 · √( (m₁ + m₂) / (m₁ · m₂ · d) ) &nbsp; (≈ 50·√… with absorbent fill)</div>
        <ul>
          <li>Keep f₀ low — ideally below ~50 Hz for music isolation: heavier leaves, deeper cavity.</li>
          <li><b>Decoupling</b> means the leaves aren’t rigidly connected. Every stud, screw and rigid tie is a <b>bridge</b> that bypasses the air spring. Hierarchy (worst → best): shared timber studs → steel studs → resilient channel → staggered studs → isolation clips &amp; channel → fully independent double studs / room-within-room.</li>
          <li><b>Never build three leaves</b> in the same depth (e.g. new wall inside an old one with a thin gap). Each extra leaf adds another resonance; a triple-leaf wall can perform worse at low frequencies than the double-leaf with the same total depth.</li>
        </ul>` },
      { h: 'Pillar 3 — Absorption in the cavity, Pillar 4 — Damping', html: `
        <p><b>Cavity absorption</b> (fibrous insulation, not necessarily dense — it shouldn’t be compressed) damps standing waves inside the cavity and typically adds 3–10 dB in the mids. <b>Damping</b> (a viscoelastic compound between two rigid layers — constrained-layer damping) converts panel vibration to heat, filling in the coincidence dip and reducing resonant transmission. It’s most useful where decoupling is impossible.</p>` },
      { h: 'Pillar 5 — Airtightness (the forgotten one)', html: `
        <p>Sound goes wherever air goes. A 1 % opening in a STC-50 wall reduces it to about STC-20. Seal every perimeter with non-hardening acoustic sealant, back-box electrical outlets with putty pads, stagger outlets in different stud bays, and give every door full perimeter seals and a drop seal.</p>
        <div class="callout data">Composite TL = −10·log₁₀( Σ Sᵢ·10<sup>−TLᵢ/10</sup> / ΣS ). Try the composite calculator on the Soundproofing page to see how one weak element wrecks a great wall.</div>` },
      { h: 'Ratings: STC, Rw, Ctr, field vs lab', html: `
        <div class="table-wrap"><table>
          <tr><th>Rating</th><th>Standard</th><th>Range</th><th>Notes</th></tr>
          <tr><td>STC</td><td>ASTM E413</td><td>125–4000 Hz</td><td>US. Fit of a reference contour; ignores &lt; 125 Hz</td></tr>
          <tr><td>Rw (C, Ctr)</td><td>ISO 717-1</td><td>100–3150 Hz</td><td>Europe/intl. Ctr adapts to traffic/bass-heavy noise</td></tr>
          <tr><td>OITC</td><td>ASTM E1332</td><td>80–4000 Hz</td><td>Outdoor-indoor (traffic, aircraft)</td></tr>
          <tr><td>FSTC, DnT,w, NIC</td><td>Field</td><td>—</td><td>Real buildings with flanking; typically 3–7 dB below lab</td></tr>
        </table></div>
        <div class="callout warn">For music, STC and Rw are only a starting point. A wall can be STC 55 and still leak the kick drum, because the rating barely looks below 125 Hz. Look at the third-octave curve — or the Rw + Ctr — and design for the 63 Hz band explicitly.</div>
        <div class="table-wrap"><table>
          <tr><th>STC</th><th>What you hear through it</th></tr>
          ${[[25, 'Normal speech easily understood'], [30, 'Loud speech understood'], [35, 'Loud speech audible but not intelligible'], [40, 'Loud speech heard as a murmur'], [45, 'Loud speech barely audible'], [50, 'Loud speech not audible; music clearly heard'], [60, 'Loud music faint; bass audible'], [70, 'Pro studio territory'], [80, 'Room-in-room with floated slab']].map(([s, t]) => `<tr><td class="num">${s}</td><td>${t}</td></tr>`).join('')}
        </table></div>` },
    ],
    quiz: [
      { q: 'Doubling the mass of a single wall improves TL by roughly…', opts: ['3 dB', '6 dB', '10 dB', '20 dB'], a: 1, why: 'Mass law: 20·log₁₀(2) ≈ 6 dB.' },
      { q: 'Which is the weakest decoupling method?', opts: ['Isolation clips', 'Separate double studs', 'Shared timber studs', 'Staggered studs'], a: 2, why: 'Shared rigid studs bridge the leaves directly.' },
      { q: 'A 1 % unsealed gap in an STC-50 wall results in about…', opts: ['STC 49', 'STC 45', 'STC 20', 'STC 0'], a: 2, why: 'Composite: τ ≈ 0.01 → TL ≈ 20 dB.' },
      { q: 'Why can a triple-leaf wall perform worse than a double-leaf?', opts: ['It is lighter', 'It introduces additional mass-spring resonances in the low frequencies', 'Three is an unlucky number', 'Coincidence disappears'], a: 1, why: 'Splitting the cavity raises resonances and adds new ones.' },
    ],
  },
];
