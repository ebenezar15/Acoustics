/* Signal Flow & Networks: workflow pipelines (analog / digital / networked), device catalogue,
   connectors & levels, audio networking calculators, clocking. */
(function () {
  'use strict';
  const { el, html, fmt } = A;

  const PIPES = {
    live: {
      name: 'Live concert / festival',
      analog: [['Sources', 'Vocals, drums, amps, DI’d keys'], ['Mics & DI boxes', 'Dynamic/condenser mics, active/passive DI'], ['Splitter + copper multicore', 'Transformer split to FOH and monitors'], ['Analog FOH console', 'Preamps, EQ, dynamics, auxes, groups'], ['Outboard rack', 'Comps, gates, reverbs via inserts/auxes'], ['System processor', 'Crossover, EQ, delay, limiters'], ['Power amplifiers', 'Racks per array zone'], ['Mains, subs, fills, delays', 'Loudspeaker system'], ['Monitor console → wedges/IEMs', 'Separate mix for performers']],
      digital: [['Sources', 'Vocals, drums, amps, DI’d keys'], ['Mics & DI boxes', 'Same transducers'], ['Digital stageboxes', 'Remote-controlled preamps + A/D on stage'], ['Network / fibre snake', 'Dante, AVB/Milan, MADI or proprietary; redundant'], ['Digital FOH + monitor consoles', 'Shared stagebox with gain compensation; scenes'], ['Multitrack recorder', 'Over network/USB for virtual soundcheck'], ['Networked system processors', 'Matrix, FIR presets, delay towers over fibre'], ['Amplified loudspeakers / amp racks', 'AES or analog backup feeds'], ['Measurement rig', 'Transfer-function analyser at FOH']],
      notes: 'Digital rigs replace heavy copper with fibre/Cat cables and give recall and virtual soundcheck; always keep an analog or AES3 backup feed to the PA processors.',
    },
    worship: {
      name: 'House of worship',
      analog: [['Pulpit & choir mics', 'Gooseneck, lavalier, choir condensers'], ['Analog mixer', 'Simple layout for volunteers'], ['Feedback suppressor / EQ', 'Hardware DSP'], ['Amplifiers', ''], ['Column speakers', 'Directivity for intelligibility'], ['Hearing loop driver', 'Assistive listening']],
      digital: [['Mics, RF systems, IEMs', ''], ['Digital mixer with stagebox', 'Locked scenes for services'], ['Dante network', 'To broadcast room and recorder'], ['Matrix DSP', 'Zones: sanctuary, foyer, overflow, crèche'], ['Steerable columns / small arrays + delays', ''], ['Streaming / broadcast mix', 'Separate mix with loudness control'], ['Hearing loop / assistive listening', ''], ['Control panel', 'One-button presets for volunteers']],
      notes: 'Design for volunteer operation: locked DSP, scene recall, and a separate broadcast mix.',
    },
    conference: {
      name: 'Conference / corporate installation',
      analog: [['Gooseneck mics', ''], ['Automixer', 'Gates/gain-shares open mics'], ['Mixer-amplifier', ''], ['Ceiling speakers (100 V)', 'Zoned'], ['Wall control', 'Volume, source select']],
      digital: [['Ceiling beamforming mics / table mics', 'PoE, Dante'], ['Networked DSP', 'Automixing, AEC, room combining'], ['Video conferencing codec / PC', 'USB or Dante bridge'], ['PoE network amplifiers', 'Power over the same network'], ['Ceiling speakers', 'Distributed'], ['Control system', 'Touch panels, scheduling, room booking']],
      notes: 'Acoustic echo cancellation (AEC) and automixing are the core DSP; plan VLANs with IT.',
    },
    studio: {
      name: 'Recording studio',
      analog: [['Instruments & voices', ''], ['Mics', 'Placement in treated rooms'], ['Analog preamps / channel strips', 'Character & colour'], ['Patchbay', 'Routing hub'], ['Analog console', 'Monitoring and summing'], ['Tape / converters', ''], ['Monitor controller', ''], ['Monitors in a treated control room', '']],
      digital: [['Instruments & voices', ''], ['Mics', ''], ['Preamps (analog or remote-controlled)', ''], ['A/D interface (clocked)', 'Word clock master'], ['DAW', 'Recording, editing, plug-ins, mixing'], ['Cue mix system', 'Personal headphone mixers'], ['D/A + monitor controller', 'Calibrated level'], ['Monitors in a treated control room', '']],
      notes: 'Hybrid is normal: analog preamps and summing with digital recording and recall. One master clock.',
    },
    broadcast: {
      name: 'Broadcast & streaming',
      analog: [['Mics, playback', ''], ['Broadcast console', 'Mix-minus, talkback'], ['Audio processing', 'Compression, limiting'], ['Transmitter / encoder', '']],
      digital: [['Mics, remote contributors', 'IP codecs'], ['IP stageboxes', 'AES67 / ST 2110-30'], ['Broadcast console (IP core)', 'Mix-minus, PFL, automation'], ['Loudness processing', 'EBU R128 / ATSC A/85 targets'], ['Embedders / encoders', 'Audio into video (SDI / IP / streaming)'], ['Monitoring & logging', ''], ['PTP grandmaster', 'Locked to house reference']],
      notes: 'Redundancy and clocking dominate the design; everything must be locked to the house reference.',
    },
    theatre: {
      name: 'Theatre',
      analog: [['RF mics on actors', ''], ['Band mics', ''], ['Analog console with VCAs', 'Line-by-line mixing'], ['Playback (cart/CD)', ''], ['Amps & speakers (L/C/R, fills, delays)', '']],
      digital: [['RF mics + antenna distribution', ''], ['Stageboxes on network', ''], ['Digital console', 'Scene/cue-based, DCAs per scene'], ['Show control / playback', 'MIDI/OSC/timecode triggers'], ['Matrix processor', 'Delay & level per zone'], ['L/C/R, fills, delays, surrounds', ''], ['Assistive listening', '']],
      notes: 'Cue-based automation lets the operator mix actors line by line while the console recalls everything else.',
    },
  };

  const DEVICES = [
    ['Microphones', 'Dynamic, condenser, ribbon, lavalier, headset, boundary, shotgun, beamforming arrays', 'Polar pattern, sensitivity, self-noise, max SPL, handling noise, RF if wireless'],
    ['DI boxes', 'Passive (transformer) and active', 'Input impedance, ground lift, pad, max level'],
    ['Wireless systems', 'Handheld, bodypack, IEM transmitters', 'Frequency planning (licensed bands), antenna distribution, latency (digital RF)'],
    ['Preamps / stageboxes', 'Analog preamps, remote-controlled digital stageboxes', 'Gain range, EIN, headroom, converter quality, network protocol, redundancy'],
    ['Mixing consoles', 'Analog, digital, hybrid; FOH, monitor, broadcast', 'Channel/bus count, processing, scenes, I/O options, control surfaces'],
    ['Outboard / plug-ins', 'Compressors, EQ, reverb, delay', 'Analog colour vs recall; latency in plug-ins'],
    ['Audio interfaces', 'USB, Thunderbolt, PCIe, network', 'Converter quality, latency, clocking, I/O'],
    ['DSP / system processors', 'Speaker processors, matrix DSP, conferencing DSP', 'Filters, FIR, delay, limiters, AEC, control integration'],
    ['Amplifiers', 'Class D multichannel, networked, constant-voltage', 'Power per channel per load, DSP, monitoring, efficiency'],
    ['Loudspeakers', 'Point source, line array, column, ceiling, subwoofer, monitors', 'Max SPL, coverage, sensitivity, rigging, weatherproofing'],
    ['Network switches', 'Managed gigabit switches, AVB switches', 'QoS, IGMP, VLANs, EEE off, PoE budget, redundancy'],
    ['Clocks', 'Word clock generators, PTP grandmasters', 'Stability, outputs, sync to video reference'],
    ['Measurement', 'Calibrated mic, interface, analyser software, SPL meter', 'Dual-channel FFT, coherence, calibration files'],
    ['Recorders & playback', 'Multitrack recorders, show control playback', 'Track count, redundancy, timecode'],
  ];
  const CONNECTORS = [
    ['XLR-3', 'Balanced mic/line, AES3 (110 Ω cable)', 'Pin 1 shield, 2 hot, 3 cold'],
    ['TRS ¼"', 'Balanced line, inserts, headphones', 'Tip/Ring/Sleeve'],
    ['TS ¼"', 'Unbalanced instrument/line', 'Keep short'],
    ['RCA', 'Consumer unbalanced, S/PDIF coax', ''],
    ['Speakon (NL2/NL4/NL8)', 'Loudspeaker level', 'Locking; never use ¼" for high-power speakers'],
    ['BNC 75 Ω', 'Word clock, MADI coax, video', 'Terminate clock lines correctly'],
    ['etherCON / RJ45', 'Dante, AVB, AES50, control', 'Cat5e/6/6a; 100 m max per copper run'],
    ['opticalCON / LC fibre', 'Long-distance network, MADI', 'Kilometres; immune to ground loops and RF'],
    ['TOSLINK', 'ADAT, S/PDIF optical', 'Short runs'],
    ['Phoenix / Euroblock', 'Installed balanced audio, control', 'Common on DSP and install amps'],
  ];

  function flow(nodes) {
    return `<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:stretch">${nodes.map(([t, d], i) => `<div style="display:flex;align-items:center;gap:8px"><div class="card" style="padding:10px 12px;min-width:150px;max-width:220px;background:var(--panel2)"><div style="font-weight:700">${t}</div>${d ? `<div class="small">${d}</div>` : ''}</div>${i < nodes.length - 1 ? '<span class="accent" style="font-size:20px">→</span>' : ''}</div>`).join('')}</div>`;
  }

  A.register('systems', {
    title: 'Signal Flow & Networks',
    render(root, params) {
      A.pageHead(root, 'Design', 'Signal Flow & Networks', 'Workflow pipelines for every kind of venue in analog and digital form, the devices and connectors that make them, and the networking that ties modern systems together.');
      const tabs = [['pipes', 'Workflow pipelines'], ['devices', 'Devices'], ['connect', 'Connectors & levels'], ['network', 'Audio networking'], ['clock', 'Clocking & latency'], ['gain', 'Gain structure']];
      A.tabs(root, tabs, (id, body) => {
        if (id === 'pipes') {
          let pipe = 'live', mode = 'digital';
          const bar = el('div', { class: 'row' });
          const sel = el('select'); Object.entries(PIPES).forEach(([k, v]) => sel.appendChild(el('option', { value: k }, v.name)));
          const seg = A.seg([['analog', 'Analog'], ['digital', 'Digital / networked']], mode, (v) => { mode = v; draw(); });
          bar.append(sel, seg); body.appendChild(bar);
          const out = el('div', { style: { marginTop: '12px' } }); body.appendChild(out);
          sel.onchange = () => { pipe = sel.value; draw(); };
          function draw() { const p = PIPES[pipe]; out.innerHTML = `<div class="card"><h3 style="margin-top:0">${p.name} — ${mode === 'analog' ? 'analog' : 'digital / networked'} signal flow</h3>${flow(p[mode])}<div class="callout mentor" style="margin-top:14px">${p.notes}</div></div>`; }
          draw();
          body.appendChild(html(`<div class="callout alt">Most real systems are hybrids. Typical mixes: analog mics and preamps into digital stageboxes; a digital console with analog outboard on inserts; networked processing with an analog backup feed to the amplifiers.</div>`));
        }
        if (id === 'devices') body.appendChild(html(`<div class="table-wrap"><table><tr><th>Category</th><th>Analog & digital options</th><th>Specs that matter</th></tr>${DEVICES.map(([a, b, c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td class="small">${c}</td></tr>`).join('')}</table></div>`));
        if (id === 'connect') {
          body.appendChild(html(`<div class="table-wrap"><table><tr><th>Connector</th><th>Use</th><th>Notes</th></tr>${CONNECTORS.map(([a, b, c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td class="small">${c}</td></tr>`).join('')}</table></div>`));
          const c = el('div', { class: 'card', style: { marginTop: '14px' } }); body.appendChild(c);
          c.appendChild(html('<h3 style="margin-top:0">Level converter</h3>'));
          const o = el('div', { class: 'stats' });
          const s = A.controls(c, [{ key: 'v', label: 'Value', type: 'number', value: 4 }, { key: 'u', label: 'Unit', type: 'select', value: 'dBu', options: [['dBu', 'dBu'], ['dBV', 'dBV'], ['V', 'Volts RMS'], ['dBFS', 'dBFS (0 dBFS = +24 dBu)']] }], () => upd());
          c.appendChild(o);
          const upd = () => { const V = s.u === 'dBu' ? AP.vFromDbu(s.v) : s.u === 'dBV' ? AP.vFromDbv(s.v) : s.u === 'V' ? s.v : AP.vFromDbu(s.v + 24); o.innerHTML = A.statBox('Volts RMS', fmt(V, 4) + ' V') + A.statBox('dBu', fmt(AP.dBu(V), 2)) + A.statBox('dBV', fmt(AP.dBV(V), 2)) + A.statBox('dBFS (+24 dBu ref)', fmt(AP.dBu(V) - 24, 1)) + A.statBox('Into 8 Ω', fmt(AP.powerFromV(V, 8), 4) + ' W'); };
          upd();
        }
        if (id === 'network') {
          body.appendChild(html(`<div class="table-wrap"><table><tr><th>Protocol</th><th>Medium</th><th>Channels</th><th>Latency</th><th>Distance</th><th>Notes</th></tr>${AP.PROTOCOLS.map((p) => `<tr><td><b>${p.name}</b></td><td>${p.medium}</td><td>${p.ch}</td><td>${p.latency}</td><td>${p.distance}</td><td class="small">${p.notes}</td></tr>`).join('')}</table></div>`));
          const c = el('div', { class: 'card', style: { marginTop: '14px' } }); body.appendChild(c);
          c.appendChild(html('<h3 style="margin-top:0">Bandwidth calculator</h3><p class="small">Approximate network load of audio flows (RTP/UDP/IP/Ethernet overhead included).</p>'));
          const o = el('div', { class: 'stats' });
          const s = A.controls(c, [
            { key: 'ch', label: 'Channels per flow', type: 'number', value: 8 },
            { key: 'flows', label: 'Number of flows', type: 'number', value: 8 },
            { key: 'fs', label: 'Sample rate', type: 'select', value: 48000, numeric: true, options: [[44100, '44.1 kHz'], [48000, '48 kHz'], [96000, '96 kHz']] },
            { key: 'bits', label: 'Bit depth', type: 'select', value: 24, numeric: true, options: [[16, '16'], [24, '24'], [32, '32']] },
            { key: 'pkt', label: 'Packet time', type: 'select', value: 1, numeric: true, options: [[0.125, '125 µs'], [0.25, '250 µs'], [1, '1 ms'], [4, '4 ms']] },
          ], () => upd());
          c.appendChild(o);
          const upd = () => { const m = AP.flowMbps(s.fs, s.bits, s.ch, s.pkt) * s.flows; const raw = AP.channelMbps(s.fs, s.bits, s.ch * s.flows); o.innerHTML = A.statBox('Total channels', s.ch * s.flows) + A.statBox('Payload', fmt(raw, 1) + ' Mb/s') + A.statBox('On the wire', fmt(m, 1) + ' Mb/s', 'incl. overhead') + A.statBox('100 Mb link', fmt(m, 1) + ' %', m > 70 ? 'Too full — use gigabit' : 'OK', m > 70 ? 'bad' : 'good') + A.statBox('1 Gb link', fmt(m / 10, 1) + ' %', '', m / 10 > 70 ? 'bad' : 'good'); };
          upd();
          body.appendChild(html(`<div class="card" style="margin-top:14px"><h3 style="margin-top:0">Network design checklist</h3><ol class="steps">
            <li>Managed gigabit switches; dedicated audio network or VLAN.</li>
            <li>QoS: PTP clock highest priority, audio next (use the protocol vendor’s DSCP map).</li>
            <li>Energy-Efficient Ethernet (EEE / “green Ethernet”) off on audio ports.</li>
            <li>Multicast: IGMP snooping + one querier, or use unicast for small systems.</li>
            <li>Redundancy: primary and secondary networks on separate switches and power; or seamless redundancy (AVB/Milan, ST 2022-7).</li>
            <li>Fibre between buildings or for runs over 100 m; avoids ground loops.</li>
            <li>Static IPs or a documented DHCP scope; consistent device naming (e.g. FOH-Console, SB-Stage-L).</li>
            <li>Separate control/management from audio where possible; secure remote access.</li>
            <li>Backup switch configurations and device presets; document everything.</li>
          </ol></div>`));
          body.appendChild(html(`<div class="card"><h3 style="margin-top:0">Example topology (redundant)</h3>${flow([['Stageboxes', 'Primary + secondary ports'], ['Stage switches A & B', 'Separate power'], ['Fibre A & B', 'To FOH'], ['FOH switches A & B', ''], ['Consoles, recorder', 'Dual-port'], ['System DSP / amps', 'Dual-port + analog backup']])}</div>`));
        }
        if (id === 'clock') {
          body.appendChild(html(`<div class="card"><h3 style="margin-top:0">Clocking</h3><ul><li>One master clock per digital system. Everything else follows it — via the audio stream (AES3, MADI), word clock (75 Ω BNC, terminated) or PTP on the network.</li><li>PTP v1 (Dante legacy) vs PTP v2 (AES67, AVB uses gPTP): bridging may be needed.</li><li>In video facilities, lock audio to the video reference (black burst / tri-level) or to a common PTP grandmaster.</li><li>Symptoms of clock problems: periodic clicks, pops, dropouts, distortion on one device.</li></ul></div>`));
          const c = el('div', { class: 'card' }); body.appendChild(c); c.appendChild(html('<h3 style="margin-top:0">Latency budget</h3>')); V.latency(c);
        }
        if (id === 'gain') { const c = el('div', { class: 'card' }); body.appendChild(c); V.gainStructure(c); }
      }, tabs.find((t) => t[0] === params[0]) ? params[0] : 'pipes');
    },
  });
})();
