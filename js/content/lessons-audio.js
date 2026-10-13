/* ==========================================================================
   Academy — Audio & Sound Systems track (courses A1–A14).
   ========================================================================== */
window.LESSONS = (window.LESSONS || []).concat([
  /* ===================================================================== */
  {
    id: 'a-electric', n: 'A1', track: 'audio', title: 'Electricity & Signals for Audio', level: 'Foundation', mins: 25,
    summary: 'Voltage, current, impedance, power, levels and balanced lines — the electrical side of sound.',
    tags: ['Ohm', 'impedance', 'dBu', 'balanced', 'line level', 'mic level', 'phantom power'],
    sections: [
      { h: 'From air to electrons and back', html: `
        <p class="lead">A sound system is a chain of transducers and amplifiers. A microphone turns air pressure into a tiny voltage; everything after it shapes, routes and amplifies that voltage; a loudspeaker turns current back into air motion. To understand any system, follow the signal and know what it looks like at each point.</p>
        <div class="formula"><span class="lbl">Ohm’s law and power</span>V = I · R &nbsp; · &nbsp; P = V · I = V² / R = I² · R</div>
        <p><b>Impedance</b> (Z, ohms) is resistance that varies with frequency. A loudspeaker rated 8 Ω might be 6 Ω at its minimum and 40 Ω at its bass resonance. Amplifiers care about the minimum; designers care about the curve.</p>` },
      { h: 'Signal levels', html: `
        <div class="table-wrap"><table>
          <tr><th>Level</th><th>Typical voltage</th><th>In dB</th><th>Where</th></tr>
          <tr><td>Microphone</td><td>0.1 mV – 100 mV</td><td>−60 to −20 dBu</td><td>Mic outputs — needs a preamp</td></tr>
          <tr><td>Instrument (Hi-Z)</td><td>~0.1–1 V, high impedance</td><td>—</td><td>Guitar/bass pickups — use a DI box</td></tr>
          <tr><td>Consumer line</td><td>0.316 V</td><td>−10 dBV</td><td>Hi-fi, laptops, DJ gear</td></tr>
          <tr><td>Professional line</td><td>1.228 V</td><td>+4 dBu</td><td>Consoles, processors, amps</td></tr>
          <tr><td>Digital full scale</td><td>(converter)</td><td>0 dBFS ≈ +18 to +24 dBu</td><td>Depends on alignment (EBU: −18 dBFS = 0 dBu)</td></tr>
          <tr><td>Speaker level</td><td>tens to hundreds of volts</td><td>—</td><td>Amplifier outputs</td></tr>
        </table></div>
        <div class="formula"><span class="lbl">References</span>0 dBu = 0.775 V · 0 dBV = 1 V · +4 dBu − (−10 dBV) ≈ 11.8 dB difference</div>` },
      { h: 'Balanced vs unbalanced', html: `
        <p>A <b>balanced</b> line carries the signal on two conductors with equal impedance to ground (usually in opposite polarity) inside a shield. Interference induced along the cable appears equally on both and is cancelled by the receiver’s differential input — <b>common-mode rejection</b>. That is why pro audio uses XLR and TRS for long runs. Unbalanced lines (TS, RCA) are fine for a few metres.</p>
        <ul><li><b>Phantom power</b> (+48 V on pins 2 & 3 via resistors) powers condenser mics and active DIs through the same balanced cable.</li><li><b>DI boxes</b> convert high-impedance unbalanced instruments to low-impedance balanced mic level, and their ground-lift switch breaks ground loops.</li><li><b>Ground loops</b> (hum at 50/60 Hz and harmonics) appear when equipment is grounded through two paths. Fix with proper star grounding and balanced interconnects — never by removing safety earths.</li></ul>` },
      { h: 'Gain structure', html: `<p>Every device has a noise floor and a clipping point; the space between is its dynamic range. Set gain early (at the preamp) so the signal sits well above noise with enough headroom for peaks, then keep later stages near unity.</p>`, viz: 'gainStructure' },
    ],
    quiz: [
      { q: '+4 dBu is approximately…', opts: ['0.316 V', '0.775 V', '1.228 V', '4 V'], a: 2, why: '0.775 × 10^(4/20) ≈ 1.228 V.' },
      { q: 'Why does a balanced line reject noise?', opts: ['Thicker copper', 'Noise induced equally on both conductors is cancelled by the differential input', 'It uses digital transmission', 'It carries phantom power'], a: 1, why: 'Common-mode rejection.' },
      { q: 'A guitar into a mic preamp should go through…', opts: ['A DI box', 'A power amp', 'An RCA adapter', 'Nothing'], a: 0, why: 'DI converts Hi-Z unbalanced to Lo-Z balanced.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-transducers', n: 'A2', track: 'audio', title: 'Transducers: Microphones & Loudspeakers', level: 'Foundation', mins: 35,
    summary: 'How mics and speakers convert energy, what their specs mean, and how directivity is created.',
    tags: ['microphone', 'polar pattern', 'condenser', 'dynamic', 'ribbon', 'loudspeaker', 'sensitivity', 'horn', 'directivity'],
    sections: [
      { h: 'How microphones work', html: `
        <ul>
          <li><b>Dynamic (moving coil)</b>: a diaphragm moves a coil in a magnetic field (electromagnetic induction). Robust, high SPL, no power needed.</li>
          <li><b>Condenser (capacitor)</b>: a diaphragm forms one plate of a capacitor; motion changes capacitance. Needs polarisation (phantom power or electret). Detailed and sensitive.</li>
          <li><b>Ribbon</b>: a thin metal ribbon moves in a magnetic field. Naturally figure-8, smooth top end, fragile with some ribbons and phantom misuse.</li>
          <li><b>MEMS</b>: tiny silicon condensers — phones, beamforming ceiling arrays.</li>
        </ul>
        <div class="table-wrap"><table><tr><th>Spec</th><th>Meaning</th></tr>
          <tr><td>Sensitivity (mV/Pa or dBV/Pa)</td><td>Output for 94 dB SPL. Condensers ~10–40 mV/Pa; dynamics ~1.5–3 mV/Pa</td></tr>
          <tr><td>Self-noise (dBA)</td><td>Equivalent noise; &lt; 15 dBA is very quiet</td></tr>
          <tr><td>Max SPL</td><td>Level at a stated distortion (e.g. 0.5 % THD)</td></tr>
          <tr><td>Polar pattern</td><td>Directional sensitivity</td></tr></table></div>`, viz: 'micPatterns' },
      { h: 'How loudspeakers work', html: `
        <p>A voice coil in a magnetic gap moves a cone or dome (the motor), driving air. Key ideas:</p>
        <ul>
          <li><b>Sensitivity</b> (dB SPL @ 1 W / 1 m): every +3 dB doubles acoustic output for the same amp power.</li>
          <li><b>Max SPL</b>: the useful figure for system design (continuous and peak).</li>
          <li><b>Thiele–Small parameters</b> (Fs, Qts, Vas) describe the driver’s low-frequency behaviour and the box it needs: sealed, ported (bass reflex), bandpass, horn-loaded.</li>
          <li><b>Multi-way systems</b> split the spectrum with a crossover so each driver works where it is efficient and directional control is maintained.</li>
        </ul>` },
      { h: 'Directivity: why speakers beam', html: `
        <p>A radiator is omnidirectional when it is small compared with the wavelength and beams when it is large. A 300 mm woofer is omni at 100 Hz (λ = 3.4 m) but narrows above ~1 kHz. <b>Horns and waveguides</b> control the coverage of high-frequency drivers to a designed pattern (e.g. 90° × 40°). Directivity is described by the coverage angle (−6 dB points), the <b>directivity factor Q</b> and <b>directivity index DI</b> = 10·log Q.</p>
        <div class="callout mentor">Directivity is the most important property in sound-system design. Speech intelligibility, feedback and room excitation all depend on putting sound on the audience and off the walls. A good room design and a good speaker choice often matter more than any EQ.</div>` },
    ],
    quiz: [
      { q: 'Which mic type needs phantom power?', opts: ['Dynamic', 'Condenser', 'Passive ribbon (never)', 'None'], a: 1, why: 'Condensers need polarisation and an internal preamp.' },
      { q: 'Speaker A is 3 dB more sensitive than B. To match A’s level, B needs…', opts: ['Half the power', 'The same power', 'Twice the power', '10× the power'], a: 2, why: '+3 dB = double power.' },
      { q: 'A cardioid rejects most strongly at…', opts: ['0°', '90°', '180°', '45°'], a: 2, why: 'The null of a cardioid is at the rear.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-flow', n: 'A3', track: 'audio', title: 'Signal Flow & the Mixing Console', level: 'Core', mins: 35,
    summary: 'Channel strips, buses, auxes, groups, DCAs, matrices — analog and digital — and how to read any routing.',
    tags: ['signal flow', 'console', 'aux', 'bus', 'DCA', 'matrix', 'insert', 'stagebox', 'digital console'],
    sections: [
      { h: 'The universal pipeline', html: `
        <svg class="diagram" viewBox="0 0 720 120" role="img" aria-label="Signal chain">
          ${['Source', 'Mic / DI', 'Preamp + A/D', 'Console / mixer', 'Processing (DSP)', 'Amplifier', 'Loudspeaker', 'Room + listener'].map((t, i) => `<rect x="${6 + i * 89}" y="40" width="82" height="40" rx="8" fill="var(--panel2)" stroke="var(--accent)"/><text x="${47 + i * 89}" y="64" text-anchor="middle" font-size="11">${t}</text>${i < 7 ? `<path d="M${88 + i * 89} 60 h7" stroke="var(--accent)" stroke-width="2"/>` : ''}`).join('')}
          <text x="6" y="24" class="mut">Every system — studio, church, stadium — is this chain. Learn to trace it and you can troubleshoot anything.</text>
        </svg>` },
      { h: 'Anatomy of a channel strip', html: `
        <ol class="steps">
          <li><b>Input & gain (trim)</b> — set preamp level; phantom power; pad; polarity flip.</li>
          <li><b>High-pass filter</b> — remove rumble and stage low end below the instrument’s range (vocals often 80–120 Hz).</li>
          <li><b>Insert point</b> — send/return for an external processor (analog) or a plug-in slot (digital).</li>
          <li><b>EQ</b> — usually 4-band parametric with shelves.</li>
          <li><b>Dynamics</b> — gate/expander and compressor.</li>
          <li><b>Aux sends</b> — pre-fader (monitors, independent of the main mix) or post-fader (effects, follow the fader).</li>
          <li><b>Pan & fader</b> — position and level in the main mix.</li>
          <li><b>Routing</b> — to main L/R, subgroups/buses, DCAs/VCAs (remote fader control without summing), matrix outputs (mixes of mixes for fills, delays, broadcast, recording).</li>
        </ol>` },
      { h: 'Analog vs digital consoles', html: `
        <div class="table-wrap"><table><tr><th></th><th>Analog</th><th>Digital</th></tr>
          <tr><td>Signal</td><td>Continuous voltage throughout</td><td>Converted at the preamp/stagebox; processed as numbers</td></tr>
          <tr><td>Processing</td><td>Fixed per channel; outboard racks</td><td>EQ, dynamics, effects, delay on every channel and bus</td></tr>
          <tr><td>Recall</td><td>Manual — notes and photos</td><td>Scenes, snapshots, offline editing, show files</td></tr>
          <tr><td>Cabling</td><td>Heavy copper multicore to FOH</td><td>Stageboxes on a single Cat5e/6 or fibre (AES50, Dante, MADI, proprietary)</td></tr>
          <tr><td>Latency</td><td>≈ 0</td><td>~1–3 ms through-system (usually irrelevant except IEMs)</td></tr>
          <tr><td>Strengths</td><td>Immediate, tactile, no menus, some love its colour</td><td>Flexibility, size, recall, multitrack recording, remote control</td></tr>
        </table></div>
        <div class="callout alt">Hybrid systems are common: analog front-ends (favourite preamps, analog summing) into digital routing and recording, or a digital console with analog outboard inserts.</div>` },
      { h: 'Reading a block diagram', html: `<p>Professional design starts with a <b>system block diagram</b>: every device, every connection type, signal direction, and labels that match the cables. Use the <a href="#/systems">Signal Flow & Networks</a> studio to see pipelines for different venues, in analog and digital form.</p>` },
    ],
    quiz: [
      { q: 'Monitor mixes usually come from…', opts: ['Post-fader auxes', 'Pre-fader auxes', 'DCAs', 'The main bus'], a: 1, why: 'Pre-fader sends stay independent of FOH fader moves.' },
      { q: 'A DCA/VCA…', opts: ['Sums audio into a bus', 'Remotely controls the level of assigned channels without summing them', 'Is a type of compressor', 'Adds delay'], a: 1, why: 'It controls gain, not routing.' },
      { q: 'A matrix output is typically used to feed…', opts: ['A guitar amp', 'Fills, delays and broadcast from combinations of buses', 'Phantom power', 'Clock'], a: 1, why: 'Mixes of mixes.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-digital', n: 'A4', track: 'audio', title: 'Digital Audio Deep Dive', level: 'Core', mins: 30,
    summary: 'Sampling, quantisation, dither, clocking, jitter, latency and sample-rate conversion.',
    tags: ['sampling', 'Nyquist', 'bit depth', 'dither', 'word clock', 'jitter', 'latency'],
    sections: [
      { h: 'Sampling & quantisation', html: `<p>An A/D converter measures the voltage fs times per second (sampling) and rounds each measurement to one of 2ᴺ steps (quantisation). Nyquist: frequencies up to fs/2 are captured exactly if the signal is band-limited first (anti-alias filter). Each bit adds ~6 dB of dynamic range.</p>`, viz: 'sampling' },
      { h: 'Dither', html: `<p>When reducing bit depth (e.g. 24-bit mix → 16-bit CD), rounding errors become correlated distortion on quiet signals. <b>Dither</b> adds a tiny amount of noise before truncation so the error becomes benign, signal-independent noise. Apply it once, at the final bit-depth reduction.</p>` },
      { h: 'Clocking, sync & jitter', html: `
        <ul>
          <li>Every digital device has a sample clock. Devices exchanging digital audio must share <b>one master clock</b>; otherwise samples are dropped or repeated (clicks).</li>
          <li>Sync methods: embedded in the data (AES3, MADI), separate <b>word clock</b> (75 Ω BNC), or network time (<b>PTP</b>, IEEE 1588, used by Dante, AES67, AVB).</li>
          <li><b>Jitter</b> is timing uncertainty of the clock; at the converter it becomes noise/distortion. Modern converters reject most interface jitter.</li>
          <li>Sample-rate converters (SRC) bridge domains at different rates — useful but not free; avoid unnecessary conversions.</li>
        </ul>` },
      { h: 'Latency', html: `<p>Converters (≈ 0.3–1 ms each way), buffers, network packets and look-ahead processing (FIR filters, limiters) each add delay. Total latency matters for in-ear monitoring (aim &lt; ~5 ms), for alignment of delay speakers (compensate it), and for video lip-sync.</p>`, viz: 'latency' },
    ],
    quiz: [
      { q: 'What happens if two digital devices run on independent clocks?', opts: ['Nothing', 'Periodic clicks/dropouts from sample slips', 'More bass', 'Phantom power fails'], a: 1, why: 'One master clock is required.' },
      { q: 'Dither should be applied…', opts: ['On every plug-in', 'Once, at the final bit-depth reduction', 'Never', 'Only at 96 kHz'], a: 1, why: 'Dither belongs at the final requantisation.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-network', n: 'A5', track: 'audio', title: 'Audio Networking & Integration', level: 'Advanced', mins: 40,
    summary: 'AES3, MADI, AES50, Dante, AVB/Milan, AES67, ST 2110 — and how to design a robust audio network.',
    tags: ['Dante', 'AVB', 'Milan', 'AES67', 'MADI', 'AES50', 'PTP', 'VLAN', 'QoS', 'redundancy', 'networking'],
    sections: [
      { h: 'Why networks replaced copper', html: `<p>An analog 48-channel multicore is ~30 kg of copper. A single Cat6 or fibre carries hundreds of channels in both directions, plus control, with routing changed in software. The trade-offs: clocking, latency, network design and a new class of failure modes (configuration and IT).</p>` },
      { h: 'The protocols', html: `<div class="table-wrap"><table><tr><th>Protocol</th><th>Medium</th><th>Channels</th><th>Latency</th><th>Notes</th></tr>${AP.PROTOCOLS.map((p) => `<tr><td><b>${p.name}</b></td><td>${p.medium}</td><td>${p.ch}</td><td>${p.latency}</td><td>${p.notes}</td></tr>`).join('')}</table></div>
        <div class="callout mentor">Point-to-point formats (AES3, MADI, AES50) are like dedicated roads: predictable and simple. Network formats (Dante, AVB/Milan, AES67) are like a city road network: flexible and scalable, but they need traffic rules (clocking, QoS, multicast management).</div>` },
      { h: 'Designing an audio network', html: `
        <ol class="steps">
          <li><b>Plan the channel count and flows</b>; compute bandwidth (≈ 1.2–1.5 Mb/s per 48 kHz/24-bit channel including overhead — see the calculator in the Signal Flow studio).</li>
          <li><b>Use managed gigabit switches</b>. Dedicated audio network or a dedicated VLAN; don’t share with uncontrolled office traffic.</li>
          <li><b>QoS</b>: prioritise PTP clock packets highest, then audio (DSCP values per the protocol’s guidance).</li>
          <li><b>Disable Energy-Efficient Ethernet (EEE)</b> on audio ports — it causes clock glitches.</li>
          <li><b>Multicast</b>: enable IGMP snooping with a querier when using multicast flows; prefer unicast for small systems.</li>
          <li><b>Redundancy</b>: Dante primary/secondary on physically separate switches; AVB/Milan seamless redundancy; ring topologies with care.</li>
          <li><b>Clock</b>: decide the PTP leader (preferred leader on the most stable device), and lock everything to it; if video is involved, align to house sync.</li>
          <li><b>Document</b> IP addressing, device names, subscriptions, VLANs and switch configs. Back up configurations.</li>
        </ol>
        <div class="callout warn">Most “Dante problems” are switch problems: unmanaged switches with EEE, multicast flooding, or mixed 100 Mb/1 Gb links carrying too many flows.</div>` },
      { h: 'Control & integration', html: `<p>Beyond audio, systems integrate control: console remote apps, DSP control (third-party protocols over TCP/UDP), room control panels, paging stations, fire alarm interfaces (voice evacuation systems must meet life-safety standards such as EN 54 / NFPA 72), AV-over-IP video, and building management. Integration means one network plan, one naming scheme and one documentation set.</p>` },
    ],
    quiz: [
      { q: 'Why disable Energy-Efficient Ethernet on Dante ports?', opts: ['Saves money', 'Power-saving modes disturb precise PTP clocking', 'It doubles bandwidth', 'It is required by law'], a: 1, why: 'EEE introduces timing variation.' },
      { q: 'Which is the interoperability standard between many AoIP systems?', opts: ['MIDI', 'AES67', 'ADAT', 'S/PDIF'], a: 1, why: 'AES67 bridges Dante, Ravenna, etc.' },
      { q: 'What protocol distributes the clock in Dante/AES67/AVB?', opts: ['NTP', 'PTP (IEEE 1588)', 'DHCP', 'SNMP'], a: 1, why: 'Precision Time Protocol.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-dsp', n: 'A6', track: 'audio', title: 'Signal Processing: Filters, EQ & Dynamics', level: 'Core', mins: 45,
    summary: 'Filters and their orders, parametric EQ, FIR vs IIR, phase, compressors, limiters, gates and delay.',
    tags: ['DSP', 'EQ', 'filter', 'Butterworth', 'Linkwitz-Riley', 'FIR', 'IIR', 'phase', 'compressor', 'limiter', 'gate'],
    sections: [
      { h: 'Filters', html: `
        <p>A filter’s <b>order</b> sets its slope: each order adds 6 dB/octave. Its <b>alignment</b> sets the shape at the corner: Butterworth (maximally flat, −3 dB at fc), Linkwitz-Riley (−6 dB at fc, designed so LP+HP sum flat), Bessel (best phase/transient behaviour, gentle corner).</p>
        <ul><li><b>High-pass/low-pass</b>: remove unwanted ranges; protect drivers.</li><li><b>Shelving</b>: tilt everything above/below a frequency.</li><li><b>Bell (peaking)</b>: boost or cut around a centre with bandwidth set by Q.</li><li><b>Notch</b>: very narrow cut (feedback, hum).</li><li><b>All-pass</b>: changes phase only — used in alignment.</li></ul>` },
      { h: 'Parametric EQ — see it, hear it', html: `<p>Play with real biquad filters (the same maths used in most digital consoles and DSPs) and listen to the result.</p>`, viz: 'eq' },
      { h: 'IIR vs FIR, and phase', html: `
        <p><b>IIR</b> (infinite impulse response) filters, like analog filters, are minimum-phase: magnitude and phase change together. Cheap and low-latency. <b>FIR</b> (finite impulse response) filters can have linear phase — any magnitude with no phase shift — at the cost of latency and processing. Speaker processors use FIR to correct a box’s phase response and build linear-phase crossovers.</p>
        <div class="callout mentor">EQ at a single listening position can fix the loudspeaker; it cannot fix the room for everyone. Minimum-phase peaks from a speaker or a mode respond to EQ; reflection notches (comb filtering) do not — they move with position.</div>` },
      { h: 'Dynamics', html: `
        <ul><li><b>Compressor</b>: reduces level above a threshold by a ratio; attack/release set how fast. Tames dynamics, adds density.</li><li><b>Limiter</b>: high-ratio compressor to protect speakers or meet a level ceiling; look-ahead and true-peak limiters catch inter-sample overs.</li><li><b>Gate/expander</b>: reduces level below a threshold (drum spill, noise).</li><li><b>Multiband/dynamic EQ</b>: compression in a frequency band only (de-essing, resonance control).</li></ul>`, viz: 'compressor' },
      { h: 'Delay', html: `<p>Digital delay aligns sources: drivers inside a box, subs with mains, delay towers with the main PA, and video with audio. 1 ms ≈ 0.343 m. Alignment is the most powerful “EQ” in a system: two sources out of time comb-filter each other.</p>` },
    ],
    quiz: [
      { q: 'A 4th-order filter slopes at…', opts: ['6 dB/oct', '12 dB/oct', '24 dB/oct', '48 dB/oct'], a: 2, why: '4 × 6 dB/oct.' },
      { q: 'Why can’t EQ fix a comb-filter notch for a whole audience?', opts: ['EQ is too weak', 'The notch frequencies change with every listener position', 'Notches are always below 20 Hz', 'It can'], a: 1, why: 'Reflection notches are position dependent and non-minimum-phase.' },
      { q: 'Main advantage of FIR filters in speaker processing?', opts: ['Zero latency', 'Linear-phase or phase-corrected responses', 'Cheaper', 'More bass'], a: 1, why: 'FIR can shape magnitude and phase independently.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-crossover', n: 'A7', track: 'audio', title: 'Crossovers & System Alignment', level: 'Advanced', mins: 30,
    summary: 'How drivers and subwoofers are combined, and how to time-align them with delay and polarity.',
    tags: ['crossover', 'Linkwitz-Riley', 'alignment', 'subwoofer', 'delay', 'polarity', 'phase'],
    sections: [
      { h: 'Combining two sources', html: `<p>Where two sources overlap in frequency (woofer + tweeter, sub + top), the result depends on relative <b>level</b>, <b>time</b> and <b>phase</b>. In time: +6 dB. 180° apart: cancellation. The aim of a crossover is a seamless sum on axis and a smooth transition off axis.</p>`, viz: 'crossover' },
      { h: 'Aligning subs to mains', html: `
        <ol class="steps">
          <li>Choose the crossover (often 80–120 Hz for live, LR4 or the manufacturer’s preset).</li>
          <li>Measure mains alone and sub alone at the reference position with a transfer function (dual-FFT).</li>
          <li>Look at the phase traces through the crossover region. Add delay to whichever arrives first until the phase traces overlay; try polarity if they are ~180° apart.</li>
          <li>Measure both together: you should see summation (+6 dB where equal in level) at crossover.</li>
          <li>Check a few other seats: perfect alignment exists only along one line — choose the line that covers most of the audience.</li>
        </ol>
        <div class="callout warn">Delaying by a whole cycle (e.g. 10 ms at 100 Hz) can “sum” at crossover but smear transients and misalign above and below. Always align the phase slope, not just one frequency.</div>` },
      { h: 'Inside a loudspeaker', html: `<p>Manufacturers align drivers inside a box with passive crossovers or with DSP presets (filters + delays + EQ + limiters). Use their presets: they encode measurements you can’t replicate in the field. Your job is to align <i>boxes</i> to each other and to the room.</p>` },
    ],
    quiz: [
      { q: 'Two LR4 outputs summed in time at fc give…', opts: ['−6 dB', '0 dB (flat)', '+6 dB', '+3 dB'], a: 1, why: 'Each is −6 dB at fc and they are in phase.' },
      { q: 'A sub 2 m further away than the mains arrives late by about…', opts: ['0.6 ms', '5.8 ms', '20 ms', '2 ms'], a: 1, why: '2 / 343 ≈ 5.8 ms.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-amps', n: 'A8', track: 'audio', title: 'Amplifiers, Cables & Power', level: 'Core', mins: 30,
    summary: 'Amp classes and ratings, impedance loads, cable loss, constant-voltage systems, and power & grounding.',
    tags: ['amplifier', 'impedance', 'speaker cable', '70V', '100V', 'constant voltage', 'damping factor', 'power distribution', 'grounding'],
    sections: [
      { h: 'Amplifiers', html: `
        <ul><li><b>Class AB</b>: linear, heavy, inefficient (~50 %).</li><li><b>Class D</b>: switching, efficient (85–95 %), light — now dominant in pro audio.</li><li><b>Ratings</b>: continuous power per channel into 8/4/2 Ω, bridged modes, and peak/burst figures. Compare like with like.</li><li><b>Headroom</b>: programme peaks are 10–20 dB above average; a system averaging 100 dB SPL needs to reach 110–120 dB peaks cleanly.</li><li><b>Powered (active) speakers</b> integrate amp + DSP matched by the manufacturer — simpler and protected.</li></ul>` },
      { h: 'Loads, wiring & cable', html: `<p>Paralleling speakers lowers impedance (more power, more current, more cable loss); series raises it. Cable resistance in series with the speaker wastes power and reduces <b>damping factor</b> (amp control over the cone).</p>`, viz: 'ampLoad' },
      { h: 'Constant-voltage (70 V / 100 V) systems', html: `
        <p>For many speakers over long distances (background music, paging, hotels, retail, schools), the amplifier outputs a high voltage (70.7 V or 100 V at full power) and each speaker has a <b>transformer</b> with power taps (e.g. 1.5/3/6 W). Current is low, so thin cable can run hundreds of metres.</p>
        <div class="formula"><span class="lbl">Tap impedance and loading</span>Z<sub>tap</sub> = V² / P · total taps ≤ ~80 % of amp rating</div>
        <p>Trade-offs: transformer losses and limited bass; ideal for speech and BGM, not for performance audio.</p>` },
      { h: 'Power & grounding', html: `<ul><li>Run audio power from a dedicated, clean distribution with a common earth; keep lighting dimmers on separate circuits/phases.</li><li>Power on in sequence: sources → processing → amplifiers last; power off in reverse.</li><li>Calculate current draw (Class D amps draw far less average current than their rating suggests, but plan for peaks and inrush).</li><li>Never lift safety earths; solve hum with balanced lines, isolation transformers or ground-lift on signal shields.</li></ul>` },
    ],
    quiz: [
      { q: 'Four 8 Ω speakers in parallel present…', opts: ['32 Ω', '8 Ω', '4 Ω', '2 Ω'], a: 3, why: '8/4 = 2 Ω.' },
      { q: 'A 10 W tap on a 100 V line is…', opts: ['10 Ω', '100 Ω', '1000 Ω', '10 kΩ'], a: 2, why: '100²/10 = 1000 Ω.' },
      { q: 'Why switch amplifiers on last?', opts: ['Saves electricity', 'To avoid amplifying turn-on thumps from upstream gear', 'Tradition', 'Clocking'], a: 1, why: 'Prevents damaging transients.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-loudspeakers', n: 'A9', track: 'audio', title: 'Loudspeaker Systems & Arrays', level: 'Advanced', mins: 40,
    summary: 'Point sources, line arrays, columns, distributed systems and subwoofer arrays — the physics of coverage.',
    tags: ['line array', 'point source', 'column', 'coverage', 'cardioid sub', 'end-fire', 'array', 'directivity'],
    sections: [
      { h: 'Point source vs line source', html: `<p>A single box radiates like a point (−6 dB per doubling). A tall, coherent column of boxes radiates a cylindrical wavefront in its near field (−3 dB per doubling) — so it loses less level over distance and keeps front and rear seats closer in level. Curving (J or spiral) arrays shape the vertical coverage to fit the audience plane.</p>`, viz: 'lineVsPoint' },
      { h: 'Choosing the system type', html: `
        <div class="table-wrap"><table><tr><th>Type</th><th>Best for</th><th>Watch out</th></tr>
          <tr><td>Point source (2-way boxes)</td><td>Clubs, small–medium halls, fills, monitors</td><td>Level drop front-to-back in long rooms</td></tr>
          <tr><td>Line array</td><td>Large/long venues, outdoor, arenas, concert halls</td><td>Needs rigging, prediction software, minimum box count for LF control</td></tr>
          <tr><td>Column / steerable column</td><td>Reverberant churches, transport hubs, lecture halls</td><td>Limited bandwidth/SPL; excellent vertical control for intelligibility</td></tr>
          <tr><td>Distributed (ceiling, 70/100 V)</td><td>Offices, retail, hotels, paging, BGM</td><td>Spacing for even coverage; low max SPL</td></tr>
          <tr><td>Delay / fill speakers</td><td>Under balconies, front rows, side seats, long fields</td><td>Must be delayed to the mains</td></tr>
        </table></div>` },
      { h: 'Subwoofer arrays', html: `<p>Subs are nearly omnidirectional. Arraying them lets you aim bass at the audience and away from the stage: <b>gradient cardioid</b> (a reversed or rear box, delayed and polarity-inverted), <b>end-fire</b> (boxes in a row, delayed so they add forward), <b>broadside</b> lines (narrow coverage, beware of power alley), and arc-delayed arrays.</p>`, viz: 'subArray' },
    ],
    quiz: [
      { q: 'In its near field a line array loses about…', opts: ['6 dB per doubling', '3 dB per doubling', '12 dB per doubling', '0 dB'], a: 1, why: 'Cylindrical spreading.' },
      { q: 'A cardioid sub array mainly reduces…', opts: ['Level in front', 'Low-frequency energy on stage/behind the array', 'Latency', 'High frequencies'], a: 1, why: 'Rear cancellation.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-pa-design', n: 'A10', track: 'audio', title: 'Designing a PA for a Venue', level: 'Advanced', mins: 45,
    summary: 'From requirements to a coverage plan: SPL, uniformity, intelligibility, headroom, fills and delays.',
    tags: ['PA design', 'coverage', 'SPL', 'STI', 'delay towers', 'fills', 'venue', 'prediction'],
    sections: [
      { h: 'Requirements first', html: `
        <div class="table-wrap"><table><tr><th>Use</th><th>Programme level (A-weighted average)</th><th>Peak capability</th><th>Priority</th></tr>
          <tr><td>Speech / conference</td><td>70–80 dBA</td><td>+10–15 dB</td><td>Intelligibility (STI ≥ 0.6)</td></tr>
          <tr><td>Worship (contemporary)</td><td>85–95 dBA</td><td>+15 dB</td><td>Coverage, clarity, LF control</td></tr>
          <tr><td>Theatre / musicals</td><td>80–90 dBA</td><td>+15 dB</td><td>Localisation to stage, even coverage</td></tr>
          <tr><td>Rock / pop concert</td><td>95–105 dBA</td><td>+15–20 dB</td><td>Headroom, coverage, LF impact</td></tr>
          <tr><td>EDM / club</td><td>100–110 dBA (check local limits)</td><td>+10–15 dB</td><td>LF energy, reliability</td></tr>
        </table></div>
        <p>Also check legal limits and hearing-protection policy (many regions limit audience exposure, e.g. ~100 dB L<sub>Aeq,15min</sub>).</p>` },
      { h: 'The design process', html: `
        <ol class="steps">
          <li><b>Survey</b>: drawings, audience areas, rigging points and loads, sightlines, room acoustics (RT!), power, cable routes.</li>
          <li><b>Coverage</b>: choose boxes whose patterns fit the audience shape; aim at the audience, keep energy off walls and ceiling. Goal: ±3 dB across the audience in the speech band.</li>
          <li><b>Level</b>: required SPL at the farthest seat + headroom → required max SPL and box count; check with the inverse-square/line-source maths.</li>
          <li><b>Fills & delays</b>: front fills for first rows, out-fills for wide seats, under-balcony and delay towers for long throws, all delayed to the mains so sound localises to the stage (precedence effect: delay ≈ path difference + 5–15 ms).</li>
          <li><b>Subwoofers</b>: placement, arrays to control stage spill and power alley.</li>
          <li><b>Intelligibility</b>: in reverberant rooms prioritise directivity (columns, arrays), more sources closer to listeners, and room treatment. STI depends on direct-to-reverberant ratio and noise.</li>
          <li><b>Prediction</b>: model it (manufacturers provide free prediction software; EASE, ODEON etc. for room acoustics). Iterate.</li>
          <li><b>Infrastructure</b>: amps, processing, network, power, rigging, documentation.</li>
        </ol>
        <p>Practise this in the <a href="#/pa">PA & Sound System Designer</a>: place speakers in a venue and see the coverage map, delay times and headroom.</p>` },
      { h: 'Venue recipes', html: `
        <ul>
          <li><b>Club / bar</b>: two to four point-source tops + subs (cardioid or ground-stacked centre), DJ/booth monitors; robust limiters.</li>
          <li><b>Theatre</b>: L/C/R (centre for vocals), front fills, under-balcony delays, surrounds for effects; localisation to the stage is everything.</li>
          <li><b>House of worship</b>: steerable columns or small line arrays in reverberant spaces; distributed delays down long naves; hearing loop for accessibility.</li>
          <li><b>Conference / ballroom</b>: distributed ceiling or column speakers zoned and delayed; flexible partitioned rooms need matrix routing.</li>
          <li><b>Outdoor festival</b>: flown or ground-stacked line arrays, sub arrays, delay towers every ~60–100 m, weather & wind considerations, noise limits at neighbours.</li>
          <li><b>Stadium / arena</b>: distributed clusters for speech intelligibility in highly reverberant bowls; strict life-safety evacuation requirements.</li>
        </ul>` },
    ],
    quiz: [
      { q: 'A delay speaker 34 m from the mains (path difference at its audience) should be delayed by roughly…', opts: ['1 ms', '34 ms', '≈ 10 ms', '≈ 100 ms plus a few ms for localisation'], a: 3, why: '34 m ≈ 99 ms, plus ~5–15 ms precedence offset.' },
      { q: 'In a very reverberant church, the most important loudspeaker property is…', opts: ['Max SPL', 'Directivity / pattern control', 'Colour', 'Weight'], a: 1, why: 'Putting sound on people and off walls raises direct-to-reverberant ratio.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-install', n: 'A11', track: 'audio', title: 'Installation Practice', level: 'Advanced', mins: 30,
    summary: 'Rigging safety, cabling, labelling, racks, power, documentation and handover.',
    tags: ['installation', 'rigging', 'cabling', 'rack', 'documentation', 'commissioning'],
    sections: [
      { h: 'Safety first', html: `<ul><li>Rigging only to certified points with rated hardware and secondary safeties; follow manufacturer rigging manuals and local regulations. Use qualified riggers for flown systems.</li><li>Electrical work by qualified people; correct cable gauges and protection.</li><li>Life-safety systems (evacuation PA) have their own standards and certification.</li></ul>` },
      { h: 'Cabling & racks', html: `<ul><li>Separate audio, speaker, power and data where possible; cross power cables at 90°.</li><li>Label both ends of every cable with a scheme that matches the drawings.</li><li>Service loops, strain relief, correct connectors (XLR, Speakon/NL4, etherCON, opticalCON).</li><li>Racks: ventilation, front-to-back airflow, rear support, power sequencing, accessible patch points.</li><li>Test every line (continuity, polarity, shield) before connecting equipment.</li></ul>` },
      { h: 'Documentation & handover', html: `<ol class="steps"><li>As-built block diagram, rack elevations, speaker layout, cable schedule.</li><li>Network: IP plan, device names, switch configuration backups.</li><li>DSP/console files, tuning measurements, limiter settings.</li><li>User guide and training for operators.</li><li>Maintenance plan.</li></ol>` },
    ],
    quiz: [{ q: 'What must every cable have at both ends?', opts: ['Gaffer tape', 'A matching label', 'A ferrite', 'A loop'], a: 1, why: 'Labelling matching the documentation makes systems serviceable.' }],
  },

  /* ===================================================================== */
  {
    id: 'a-tuning', n: 'A12', track: 'audio', title: 'Measurement & System Tuning', level: 'Advanced', mins: 45,
    summary: 'RTA vs transfer function, coherence, phase alignment, EQ strategy and target curves.',
    tags: ['tuning', 'RTA', 'transfer function', 'Smaart', 'coherence', 'phase', 'target curve', 'pink noise', 'measurement microphone'],
    sections: [
      { h: 'RTA vs transfer function', html: `
        <div class="table-wrap"><table><tr><th></th><th>RTA (real-time analyser)</th><th>Transfer function (dual-channel FFT)</th></tr>
          <tr><td>What it shows</td><td>The spectrum of whatever the mic hears</td><td>The system’s response: output ÷ input, in magnitude and phase</td></tr>
          <tr><td>Signal</td><td>Needs a known test signal (pink noise)</td><td>Works with any signal — even the show programme</td></tr>
          <tr><td>Phase / time</td><td>No</td><td>Yes — essential for alignment</td></tr>
          <tr><td>Quality indicator</td><td>No</td><td>Coherence: how much of the output is explained by the input</td></tr>
          <tr><td>Use</td><td>Quick checks, feedback finding, spectrum of programme</td><td>Tuning: EQ, delays, crossovers, verification</td></tr>
        </table></div>
        <p>Tools: Rational Acoustics Smaart, Open Sound Meter (free), REW, manufacturer apps. Use a calibrated omni measurement mic.</p>` },
      { h: 'The tuning workflow', html: `
        <ol class="steps">
          <li><b>Verify</b>: every speaker working, correct polarity, correct presets, levels sane.</li>
          <li><b>Align within each array/system</b>: aim, splay, gain shading.</li>
          <li><b>EQ each system</b> for its coverage area using several mic positions (spatial average) — cut broad peaks, ignore narrow position-dependent dips.</li>
          <li><b>Combine</b>: align subs to mains; align fills and delays to the mains at their junction.</li>
          <li><b>Overall tonality</b>: apply the target curve (often a gentle downward tilt or LF lift) by ear and measurement.</li>
          <li><b>Listen</b> with familiar material; walk the room. Measurements serve the ears.</li>
          <li><b>Set limiters</b> and save everything.</li>
        </ol>` },
      { h: 'Tuning lab', html: `<p>Align the sub, then EQ the system to the target. This simulates what you see on a dual-FFT analyser.</p>`, viz: 'tuning' },
      { h: 'Your own measurements', html: `<p>Use the <a href="#/measure">Measure</a> page for a live RTA with your device microphone, and REW or Open Sound Meter with a measurement mic for transfer functions.</p>` },
    ],
    quiz: [
      { q: 'Which tool tells you the phase relationship between sub and mains?', opts: ['RTA', 'SPL meter', 'Transfer function (dual-FFT)', 'Oscilloscope only'], a: 2, why: 'Transfer function measures phase.' },
      { q: 'Low coherence at a frequency means…', opts: ['Perfect data', 'The measurement there is dominated by reflections/noise — don’t EQ on it', 'Bass is too loud', 'Polarity is inverted'], a: 1, why: 'Low coherence = unreliable data.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'a-feedback', n: 'A13', track: 'audio', title: 'Feedback, Monitors & Live Mic Technique', level: 'Core', mins: 25,
    summary: 'Gain before feedback, wedges vs in-ears, and how mic placement wins the battle.',
    tags: ['feedback', 'gain before feedback', 'monitors', 'IEM', 'wedge', 'ringing out'],
    sections: [
      { h: 'Why feedback happens', html: `<p>When the sound from a loudspeaker reaches a microphone loud enough to be re-amplified with a loop gain ≥ 1 at some frequency (and the phase lines up), it rings and grows. Room response and speaker/mic polar patterns decide which frequency goes first.</p>`, viz: 'feedback' },
      { h: 'Monitors', html: `<ul><li><b>Wedges</b>: point them at the performer, place them in the mic’s null (cardioid → rear; supercardioid → ~125°). Ring them out with narrow EQ cuts only where needed.</li><li><b>In-ear monitors (IEM)</b>: no stage feedback, lower stage volume, hearing protection — but isolate performers; add ambient mics. Keep latency low.</li><li><b>Side fills / drum fills</b> cover the stage.</li></ul>` },
      { h: 'Ringing out (the right way)', html: `<ol class="steps"><li>Fix placement first: mic close to source, speakers in front of mics and aimed away.</li><li>Raise gain slowly until it rings; identify the frequency (RTA or ear training).</li><li>Apply a narrow cut (Q 5–10, −3 to −6 dB) there; repeat for 3–5 frequencies maximum.</li><li>More cuts than that degrades the sound — revisit placement instead.</li></ol>` },
    ],
    quiz: [{ q: 'The single most effective way to gain 6 dB before feedback is…', opts: ['Add 6 EQ notches', 'Halve the talker-to-mic distance', 'Turn up the amp', 'Use a bigger PA'], a: 1, why: 'Ds halves → +6 dB PAG.' }],
  },

  /* ===================================================================== */
  {
    id: 'a-workflow', n: 'A14', track: 'audio', title: 'Production Workflows: Live, Studio, Broadcast, Install', level: 'Core', mins: 30,
    summary: 'The end-to-end pipelines professionals follow, from advance to archive.',
    tags: ['workflow', 'live sound', 'recording', 'broadcast', 'stage plot', 'input list', 'soundcheck', 'loudness'],
    sections: [
      { h: 'Live event pipeline', html: `<ol class="steps"><li><b>Advance</b>: tech rider, stage plot, input list, power, rigging, schedule.</li><li><b>Load-in & system build</b>: rig, cable, network, power.</li><li><b>System check & tuning</b>: verify, align, EQ, limiters.</li><li><b>Line check</b>: every input, every output, labelled.</li><li><b>Soundcheck</b>: gain structure, monitors, FOH mix, scenes.</li><li><b>Show</b>: mix, monitor levels/SPL, record multitrack (virtual soundcheck next day).</li><li><b>Load-out & report</b>.</li></ol>` },
      { h: 'Studio pipeline', html: `<ol class="steps"><li>Pre-production (arrangements, tempo, references).</li><li>Tracking (mic choice and placement, gain staging, monitoring/cue mixes, session organisation).</li><li>Editing & comping.</li><li>Mixing (balance, EQ, dynamics, space, automation) in a calibrated room.</li><li>Mastering (final EQ/dynamics, loudness to target, sequencing, dither, delivery formats).</li><li>Archiving (stems, session backups).</li></ol>` },
      { h: 'Broadcast & streaming', html: `<ul><li>Loudness-normalised delivery (EBU R128 −23 LUFS, ATSC A/85 −24 LKFS; streaming platforms normalise playback).</li><li>Redundant paths, IP audio (AES67 / ST 2110-30), clock locked to house reference.</li><li>Mix-minus feeds for remote contributors to avoid echo.</li></ul>` },
      { h: 'Installed systems', html: `<ul><li>Needs analysis → design → submittals → installation → commissioning → training → maintenance.</li><li>Control systems simplify operation (presets, wall panels), and DSP locks settings for non-technical users.</li></ul>` },
    ],
    quiz: [{ q: 'A “virtual soundcheck” uses…', opts: ['A simulation app', 'The multitrack recording of a previous show played back through the console', 'Headphones only', 'An RTA'], a: 1, why: 'Recorded inputs replace the band for practice and tuning.' }],
  },
]);
