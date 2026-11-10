/* ==========================================================================
   Library additions for hum, buzz & grounding: case studies, Room Doctor
   symptoms, glossary and formulas.
   ========================================================================== */
(function () {
  'use strict';
  const MU0 = 4e-7 * Math.PI;
  const chart = (host, opts) => A.canvas(host, Object.assign({ height: 260 }, opts));

  LIB.cases.push(
    {
      id: 'c-stadium-twist', name: 'Stadium sound system: twisting the feeders', type: 'Project case', tags: ['grounding', 'technical power', 'twisted conductors'],
      summary: 'A large sports venue measured hundreds of millivolts between ground points. Twisting line and neutral in the feeders removed nearly all of it.',
      stats: [['Ground voltage between racks', '≈ 650 mV', '< 3 mV'], ['Improvement', '—', '≈ 47 dB'], ['Equipment changed', '—', 'none']],
      flow: [['Problem', 'Hum and buzz on long tie lines between amp rooms'], ['Diagnosis', 'Long, heavily loaded feeders with untwisted conductors inducing voltage on the ground'], ['Solution', 'Electrical contractor twisted line and neutral conductors of the feeders'], ['Result', 'Ground voltage under 3 mV — noise problem gone']],
      body: `<p>This field example, reported in John H. Brandt’s grounding tech note, is the strongest argument for treating hum at its source. Nothing in the audio system changed: the fix was in how the power conductors were laid. Long feeders carry large currents, and every metre of separation between line and neutral leaves a net magnetic field that the parallel ground wire “sees” as a transformer secondary.</p>
        <div class="callout mentor">Twisting costs labour, not equipment — but it has to be specified before the cables are pulled. Put it in the electrical spec for any venue with long runs and audio tie lines.</div>
        <p class="small muted">Chart: the app’s simplified model of ground-wire voltage versus feeder length for 100 A at 60 Hz, untwisted vs twisted.</p>`,
      viz(host) {
        const v = (len, tw) => MU0 * len * 60 * 100 * Math.log(2) * (tw ? 0.002 : 1);
        chart(host, { caption: 'Induced ground voltage grows with feeder length; twisting holds it near zero.', draw(ctx, w, h) {
          const ax = A.axes(ctx, w, h, { x: { min: 10, max: 300, log: true, label: 'Feeder length (m)', ticks: [10, 20, 50, 100, 200, 300] }, y: { min: -80, max: 10, label: 'Ground voltage (dBV)' } });
          const a = [], b = []; for (let L = 10; L <= 300; L *= 1.05) { a.push([L, 20 * Math.log10(v(L, false))]); b.push([L, 20 * Math.log10(v(L, true))]); }
          A.plotLine(ctx, ax, a, A.css('bad'), 2.4); A.plotLine(ctx, ax, b, A.css('good'), 2.4);
          A.text(ctx, 'untwisted', ax.X(150), ax.Y(20 * Math.log10(v(150, false))) - 8, { size: 11, color: A.css('bad') });
          A.text(ctx, 'twisted', ax.X(150), ax.Y(20 * Math.log10(v(150, true))) - 8, { size: 11, color: A.css('good') });
        } });
      },
    },
    {
      id: 'c-home-hum', name: 'Home studio hum that came from the laptop charger', type: 'Project case', tags: ['ground loop', 'USB', 'home studio'],
      summary: 'Monitors hummed only when the laptop was charging. Moving three plugs and two cables fixed it for free.',
      stats: [['Hum at the monitors', '−62 dB re signal', '−98 dB'], ['Loop area', '≈ 6 m²', '≈ 0.1 m²'], ['Cost', '—', '0 (one power strip)']],
      flow: [['Problem', 'Hum + whine from monitors while charging'], ['Diagnosis', 'Battery test: noise vanished on battery → power/ground path'], ['Solution', 'Charger, interface and monitors on one strip; RCA leads replaced with balanced TRS'], ['Result', 'Inaudible even with monitors turned up']],
      body: `<p>The interface fed the monitors through 3 m unbalanced RCA leads; the monitors were plugged into a wall socket behind the desk, and the laptop charger into a socket across the room. Interface → USB → laptop → charger → building wiring → monitors → RCA shield made a loop of several square metres.</p>
        <ol><li>Unplugged the charger: hum gone → the loop runs through the charger.</li><li>Put everything on one power strip and routed all leads together.</li><li>Changed to balanced TRS–XLR leads (the monitors and interface both had balanced connections).</li></ol>
        <div class="callout warn">The tempting “fix” — a two-pin adapter on the charger or monitor — removes the safety earth. It may hide the hum, but a fault could then make the gear live. Never do it.</div>`,
      viz(host) { const c = A.el('div'); host.appendChild(c); V.groundLoop(c); },
    },
    {
      id: 'c-church-dimmer', name: 'Church hall: dimmer buzz in the PA', type: 'Project case', tags: ['dimmer', 'buzz', 'house of worship'],
      summary: 'Buzz followed the stage-light dimmers. Separating routes and circuits, then filtered dimmers, cured it.',
      stats: [['Buzz with lights at 50 %', 'clearly audible', 'inaudible'], ['Audio/lighting cable spacing', 'same tray', '> 300 mm, 90° crossings'], ['Dimmers', 'phase-cut', 'filtered / LED drivers']],
      flow: [['Problem', 'Buzz in speech mics when stage lights dim'], ['Diagnosis', 'Mic lines in the same tray as dimmed lighting circuits; audio on a lighting circuit'], ['Solution', 'New audio route, audio on its own circuit, electrician twisted the dimmed feeds'], ['Result', 'Silent at any lighting level']],
      body: `<p>Phase-cut dimmers switch the current on part-way through each half-cycle, in a few microseconds. That fast change induces a stream of harmonics in anything running alongside — the ear hears it as buzz rather than hum. Moving the audio away from the lighting cables (and crossing at right angles where they meet) removes most of the coupling; twisting the dimmed feeds and using filtered dimmers removes the rest.</p>`,
      viz(host) { const c = A.el('div'); host.appendChild(c); V.conduitField(c); },
    },
  );

  // richer Room Doctor entries
  const hi = LIB.symptoms.findIndex((s) => s.id === 'hum');
  const humEntries = [
    { id: 'hum', name: 'Electrical hum (50/60 Hz drone)', symptom: 'A low, steady drone in speakers or recordings; often worse when certain gear is connected.', causes: ['Ground loop between devices on different outlets or circuits', 'Large loop area: audio cables routed away from the power feeding the same gear', 'Unbalanced (RCA/TS) links over long distances', 'Pin-1 problem in equipment', 'Transformers or wall-warts close to inputs'], diagnose: ['Disconnect inputs one at a time — which cable brings it in?', 'Plug both ends into one power strip temporarily', 'Run laptops/recorders on battery', 'Use the Hum Detective in the Hum Lab'], fixes: ['Power the audio system from one outlet strip / circuit', 'Route audio cables beside the power cables (zero loop area)', 'Balanced connections; DI or isolation transformer where needed', 'AES48 gear; Hummer-test suspects', 'Move power supplies ≥ 1 m from inputs'], alternatives: ['Digital/fibre links between buildings or stages break the loop entirely'], tools: ['academy/a-ground', 'lab/hum'] },
    { id: 'buzz', name: 'Buzz that changes with the lights', symptom: 'Harsh, edgy buzz that appears or changes when dimmers, LED drivers or chargers switch.', causes: ['Phase-cut dimmers or LED drivers sharing wiring routes with audio', 'Audio on a lighting circuit', 'Untwisted power conductors inducing harmonics on the ground'], diagnose: ['Switch lights fully on/off and listen', 'Trace audio and lighting cable routes'], fixes: ['Separate audio from lighting routes; cross at 90°', 'Audio on its own circuit / technical power', 'Electrician: twisted line/neutral, filtered dimmers'], alternatives: ['Switch dimmers off for recordings'], tools: ['academy/a-ground', 'lab/hum'] },
  ];
  if (hi >= 0) LIB.symptoms.splice(hi, 1, ...humEntries); else LIB.symptoms.push(...humEntries);

  LIB.glossary.push(
    ['Ground loop', 'A closed path formed when two devices are connected both by an audio shield and by their power grounds; stray magnetic fields induce hum current in it.'],
    ['Safety earth / ground', 'The protective conductor that carries fault current so the breaker trips. Never disconnect it to cure hum.'],
    ['Loop area', 'The area enclosed between an audio cable and the ground path; induced hum is proportional to it (EMF = 2πfBA).'],
    ['Zero loop area wiring', 'Muncy’s term for routing audio cables right beside the power wiring that feeds the same equipment so that the loop encloses almost no area.'],
    ['Pin-1 problem', 'Equipment that connects XLR pin 1 (shield) to its circuit-board ground instead of the chassis, so shield current creates noise inside the gear.'],
    ['AES48', 'AES standard for grounding and EMC of balanced audio equipment: bond the shield to the chassis at the connector.'],
    ['Hummer test', 'Injecting a small current-limited AC current between pin 1 and chassis to reveal pin-1 problems (after Whitlock).'],
    ['Shield-current-induced noise', 'Noise coupled into a pair by current in the cable shield; depends on cable construction such as drain-wire placement.'],
    ['Technical power', 'Dedicated, carefully wired power for audio/video equipment, separate from lighting and HVAC loads.'],
    ['Balanced (symmetrical) power', '120 V supplied as ±60 V about ground (US NEC Art. 647) to reduce ground noise; only where codes allow.'],
    ['Isolation transformer (line)', 'Audio transformer that passes signal while breaking the ground connection between two devices; high CMRR.'],
    ['DI box ground lift', 'Switch that disconnects the audio shield (not the safety earth) between DI input and output to break a loop.'],
    ['Twisted L–N', 'Twisting line and neutral conductors together so their fields cancel along the run, greatly reducing induced ground voltage.'],
  );
  LIB.formulas.push(
    ['Ground-wire induced voltage', 'V ≈ μ₀·ℓ·f·I·ln(d_N/d_L)', 'ℓ length, I load current, d distances from ground wire to neutral/line'],
    ['Ground-loop EMF', 'EMF = 2π·f·B·A', 'B in tesla, A loop area in m²'],
    ['Transformer field falloff', 'B ∝ 1/r³ → ΔL = 60·log₁₀(r₂/r₁) dB', '0.3 → 1 m ≈ 31 dB'],
    ['Pin-1 noise', 'V = I_shield·Z_bus; n inputs ≈ +20·log₁₀ n dB', ''],
  );
})();
