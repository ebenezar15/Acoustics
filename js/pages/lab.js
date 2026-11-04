/* Physics Lab: every simulation in one place. */
(function () {
  'use strict';
  const SIMS = [
    ['tank', 'Wave Tank', 'Real-time 2-D wave simulation. Diffraction, interference, standing waves, diffusers and absorbers — as waves.', (h) => V.waveTank(h, { height: 420 })],
    ['harm', 'Harmonics & Timbre', 'Build a sound from its harmonics; remove the fundamental and still hear the pitch.', (h) => { V.harmonics(h); h.appendChild(A.html('<h3>Resonance</h3>')); V.resonance(h); }],
    ['lowhigh', 'Low vs High Targeting', 'Does treating the low end change the highs? Try tuned traps, filters, absorbers and walls.', (h) => { V.lowTarget(h); h.appendChild(A.html('<h3>Strings & room modes</h3>')); V.stringModes(h); }],
    ['wave', 'Sound Waves', 'Longitudinal motion, compression and rarefaction.', (h) => { V.wave(h); h.appendChild(A.html('<h3>Wavelength vs. the world</h3>')); V.wavelength(h); }],
    ['phase', 'Phase & Comb Filtering', 'Two waves summing, and what a single reflection does to the spectrum (with audio).', (h) => { V.phase(h); h.appendChild(A.html('<h3>Comb filter from one reflection</h3>')); V.comb(h); }],
    ['modes', 'Room Modes', 'Standing-wave pressure maps — hear each mode and move the listener.', (h) => V.modes2D(h)],
    ['reverb', 'Reverberation', 'Rays losing energy at every bounce; decay curve and Eyring RT.', (h) => V.reverb(h)],
    ['absorb', 'Absorption', 'Porous absorber physics: depth, air gap, flow resistivity, particle velocity.', (h) => { V.porous(h); h.appendChild(A.html('<h3>Helmholtz resonator</h3>')); V.helmholtz(h); }],
    ['surfaces', 'Reflection, Diffusion, Diffraction', 'How surfaces and edges treat incoming sound.', (h) => V.surfaces(h)],
    ['distance', 'Distance & Rooms', 'Inverse-square law, critical distance.', (h) => V.inverseSquare(h)],
    ['mass', 'Mass Law & Double Walls', 'Transmission loss, coincidence and mass–air–mass resonance.', (h) => V.massLaw(h)],
    ['dbwall', 'What dB Reductions Look Like', 'Energy packets through a wall.', (h) => V.dbThroughWall(h)],
    ['vib', 'Vibration Isolation', 'Mass on a spring and the transmissibility curve.', (h) => V.transmissibility(h)],
    ['hearing', 'Hearing Curves', 'ISO 226 equal-loudness contours.', (h) => V.equalLoudness(h)],
    ['digital', 'Digital Audio', 'Sampling, Nyquist, aliasing and bit depth.', (h) => V.sampling(h)],
    ['halls', 'Hall Shapes', 'Shoebox vs fan vs vineyard: lateral reflections and ITDG.', (h) => V.hall(h)],
    ['reflections', 'Control-Room Reflections', 'Image sources and first-reflection points.', (h) => V.reflections(h)],
    ['eq', 'EQ & Filters', 'Parametric EQ with real biquad filters — magnitude, phase, and audio.', (h) => V.eq(h)],
    ['xover', 'Crossovers & Alignment', 'Low-pass + high-pass, delay and polarity — how sources sum.', (h) => V.crossover(h)],
    ['dyn', 'Compressor', 'Threshold, ratio, knee, attack and release, heard and seen.', (h) => V.compressor(h)],
    ['subs', 'Subwoofer Arrays', 'Cardioid, end-fire and broadside arrays.', (h) => V.subArray(h)],
    ['line', 'Line Arrays', 'Point source vs line source level over distance.', (h) => V.lineVsPoint(h)],
    ['mics', 'Microphone Patterns', 'Omni to figure-8 and what they reject.', (h) => V.micPatterns(h)],
    ['gain', 'Gain Structure', 'Headroom and noise through a signal chain.', (h) => V.gainStructure(h)],
    ['tune', 'System Tuning', 'A simulated transfer-function analyser: align and EQ a system.', (h) => V.tuning(h)],
  ];
  A.register('lab', {
    title: 'Physics Lab',
    render(el, params) {
      A.pageHead(el, 'Physics Lab', 'See the physics move', 'Every concept in acoustics as an interactive simulation. Change the parameters, break things, and build intuition — the fastest way to think like an acoustician.');
      const start = SIMS.find((s) => s[0] === params[0]) ? params[0] : 'tank';
      A.tabs(el, SIMS.map((s) => [s[0], s[1]]), (id, body) => {
        const s = SIMS.find((x) => x[0] === id);
        body.appendChild(A.html(`<p class="muted">${s[2]}</p>`));
        const card = A.el('div', { class: 'card' });
        body.appendChild(card);
        s[3](card);
        history.replaceState(null, '', '#/lab/' + id);
      }, start);
    },
    scrollTop: false,
  });
})();
