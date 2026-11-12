/* Physics Lab: every simulation in one place. */
(function () {
  'use strict';
  const SIMS = [
    ['tank', 'Wave Tank', 'Real-time 2-D wave simulation. Diffraction, interference, standing waves, diffusers and absorbers — as waves.', (h) => V.waveTank(h, { height: 420 })],
    ['harm', 'Harmonics & Timbre', 'Build a sound from its harmonics; remove the fundamental and still hear the pitch.', (h) => { V.harmonics(h); h.appendChild(A.html('<h3>Resonance</h3>')); V.resonance(h); }],
    ['lowhigh', 'Low vs High Targeting', 'Does treating the low end change the highs? Try tuned traps, filters, absorbers and walls.', (h) => { V.lowTarget(h); h.appendChild(A.html('<h3>Strings & room modes</h3>')); V.stringModes(h); }],
    ['flat', 'Flat Response Builder', 'Start from a flat speaker and add what a room does — then fix it.', (h) => V.flatness(h)],
    ['decay', 'RT60 Decay Lab', 'Impulse response → Schroeder curve → EDT, T20, T30.', (h) => V.decayLab(h)],
    ['bands', 'Octave Bands', 'Octave, third-octave and finer bands — see and hear them.', (h) => { V.octaveBands(h); h.appendChild(A.html('<h3>Smoothing</h3>')); V.smoothing(h); }],
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
    ['hum', 'Hum, Buzz & Grounding', 'Drag a ground wire through a cable’s field, shrink a ground loop, see the pin-1 problem and track down hum step by step.', (h) => { h.appendChild(A.html('<h3>What kind of noise is it?</h3>')); V.humSounds(h); h.appendChild(A.html('<h3>The cable is a transformer</h3>')); V.conduitField(h); h.appendChild(A.html('<h3>Ground loop area</h3>')); V.groundLoop(h); h.appendChild(A.html('<h3>The pin-1 problem</h3>')); V.pin1(h); h.appendChild(A.html('<h3>Wall-warts & transformers</h3>')); V.wallWart(h); h.appendChild(A.html('<h3>Hum Detective</h3>')); V.humDetective(h); }],
    ['matter', 'Sound in Matter & Energy', 'Sound speed in gases, liquids and solids; Snell’s law outdoors; where sound energy goes at a surface.', (h) => { V.mediaSpeed(h); h.appendChild(A.html('<h3>Refraction (Snell’s law)</h3>')); V.snell(h); h.appendChild(A.html('<h3>Reflected, absorbed, transmitted</h3>')); V.energyFlow(h); }],
    ['absmech', 'How Absorbers Work & Lab Tests', 'Four absorption mechanisms, a reverberation-room test and a flow-resistivity rig.', (h) => { V.absorbMech(h); h.appendChild(A.html('<h3>Reverberation-room test (C423)</h3>')); V.reverbRoomTest(h); h.appendChild(A.html('<h3>Flow resistivity rig</h3>')); V.flowRes(h); }],
    ['isoplan', 'Isolation Planner & Weak Links', 'What isolation do you need — and how doors, windows and gaps ruin a good wall.', (h) => { V.isoRequirement(h); h.appendChild(A.html('<h3>Doors, windows and gaps</h3>')); V.compositeTL(h); }],
    ['flutter', 'Flutter Echo & Speaker Boundaries', 'Hear a flutter echo and fix it; move a speaker and watch the boundary notch.', (h) => { V.flutter(h); h.appendChild(A.html('<h3>Speaker–boundary interference & flush-mounting</h3>')); V.sbir(h); }],
    ['booth', 'Booths, HVAC & Wiring', 'Booth sizing, quiet ducts and balanced-line impedance.', (h) => { V.boothSize(h); h.appendChild(A.html('<h3>Quiet HVAC</h3>')); V.ductNoise(h); h.appendChild(A.html('<h3>Impedance balance & CMRR</h3>')); V.impBalance(h); }],
    ['standing', 'Standing Waves & Room Set-up', 'Pressure vs velocity at walls, the quarter-wave map, mode ladder, desk direction, target curves, surround delays, sub alignment and floating-floor design.', (h) => { V.standingWave(h); h.appendChild(A.html('<h3>Quarter-wave finder</h3>')); V.quarterWave(h); h.appendChild(A.html('<h3>Mode ladder & peak identifier</h3>')); V.modeLadder(h); h.appendChild(A.html('<h3>Which way to face?</h3>')); V.facing(h); h.appendChild(A.html('<h3>Target curve</h3>')); V.targetCurve(h); h.appendChild(A.html('<h3>Surround layout & delays</h3>')); V.surroundLayout(h); h.appendChild(A.html('<h3>Sub + mains alignment</h3>')); V.subAlign(h); h.appendChild(A.html('<h3>Floating-floor designer</h3>')); V.floatDesign(h); }],
    ['doors', 'Doors, Windows & Resonance', 'Build an acoustic door, design a studio window, find where resonances sit, and spend a budget where it gains the most decibels.', (h) => { V.doorBuilder(h); h.appendChild(A.html('<h3>Studio window lab</h3>')); V.glassLab(h); h.appendChild(A.html('<h3>Resonance finder</h3>')); V.resonanceMap(h); h.appendChild(A.html('<h3>Budget isolation optimiser</h3>')); V.budgetIso(h); }],
    ['playbook', 'Design Playbook Tools', 'Design checklist, build-order timeline, cost calculator, target-mode planner, diffuser fit checker, room-to-room tie-lines, rating fit and the standards explorer.', (h) => { V.designChecklist(h); h.appendChild(A.html('<h3>Order of work</h3>')); V.buildTimeline(h); h.appendChild(A.html('<h3>Cost calculator</h3>')); V.costCalc(h); h.appendChild(A.html('<h3>Target modes from dimensions</h3>')); V.modeTargets(h); h.appendChild(A.html('<h3>Will a diffuser work here?</h3>')); V.diffuserFit(h); h.appendChild(A.html('<h3>Tie-lines between rooms</h3>')); V.tieLines(h); h.appendChild(A.html('<h3>How a single-number rating is made</h3>')); V.ratingFit(h); h.appendChild(A.html('<h3>Standards explorer</h3>')); V.standardsExplorer(h); }],
    ['factors', 'Factors, Finishes, Carbon & India Walls', 'What changes a room’s decay, how finishes change an absorber, activated-carbon bass traps, and a wall builder for Indian masonry.', (h) => { V.factorBoard(h); h.appendChild(A.html('<h3>Finish designer</h3>')); V.finishDesigner(h); h.appendChild(A.html('<h3>Activated-carbon bass trap</h3>')); V.carbonTrap(h); h.appendChild(A.html('<h3>India wall builder</h3>')); V.indiaWall(h); }],
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
