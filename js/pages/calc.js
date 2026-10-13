/* Calculators toolbox. */
(function () {
  'use strict';
  const { el, html, fmt, fmtHz, fmtLen } = A;

  function card(host, title, desc, spec, compute) {
    const c = el('div', { class: 'card' });
    c.appendChild(html(`<h3 style="margin-top:0">${title}</h3>${desc ? `<p class="small">${desc}</p>` : ''}`));
    const out = el('div', { class: 'stats' });
    const st = A.controls(c, spec, () => (out.innerHTML = compute(st)));
    c.appendChild(out);
    out.innerHTML = compute(st);
    host.appendChild(c);
    return c;
  }
  const S = A.statBox;

  const GROUPS = {
    basics: (g) => {
      card(g, 'Add / subtract decibels', 'Combine sources, or remove background noise from a measurement.', [
        { key: 'a', label: 'Level A', type: 'number', value: 80, unit: 'dB' },
        { key: 'b', label: 'Level B', type: 'number', value: 76, unit: 'dB' },
        { key: 'n', label: 'Number of identical A sources', type: 'number', value: 1 },
      ], (s) => S('A + B', fmt(P.dbSum([s.a, s.b]), 1) + ' dB') + S('A − B (energy)', s.a > s.b ? fmt(P.dbSubtract(s.a, s.b), 1) + ' dB' : '—', 'source minus background') + S(`${s.n} × A`, fmt(s.a + 10 * Math.log10(Math.max(1, s.n)), 1) + ' dB') + S('Average of A,B', fmt(P.dbAvg([s.a, s.b]), 1) + ' dB'));
      card(g, 'Wavelength, period, quarter-wave', '', [
        { key: 'f', label: 'Frequency', type: 'number', value: 100, unit: 'Hz' },
        { key: 't', label: 'Temperature', type: 'number', value: 20, unit: '°C' },
      ], (s) => { const c = P.speedOfSound(s.t), l = c / s.f; return S('Speed of sound', fmt(c, 1) + ' m/s') + S('Wavelength', fmtLen(l)) + S('λ/2', fmtLen(l / 2)) + S('λ/4', fmtLen(l / 4), 'porous absorber depth for full effect') + S('Period', fmt(1000 / s.f, 3) + ' ms'); });
      card(g, 'Distance attenuation', '', [
        { key: 'L1', label: 'Level at r₁', type: 'number', value: 90, unit: 'dB' },
        { key: 'r1', label: 'r₁', type: 'number', value: 1, unit: 'm' },
        { key: 'r2', label: 'r₂', type: 'number', value: 10, unit: 'm' },
      ], (s) => S('Point source at r₂', fmt(s.L1 - P.distanceLoss(s.r1, s.r2), 1) + ' dB') + S('Line source at r₂', fmt(s.L1 - P.distanceLoss(s.r1, s.r2, 'line'), 1) + ' dB'));
      card(g, 'Hearing exposure', 'Daily permissible exposure time.', [{ key: 'L', label: 'Level', type: 'number', value: 94, unit: 'dBA' }], (s) => { const h = (x) => (x >= 1 ? fmt(x, 2) + ' h' : fmt(x * 60, 1) + ' min'); return S('NIOSH (85 dBA, 3 dB)', h(P.niosh(s.L))) + S('OSHA (90 dBA, 5 dB)', h(P.osha(s.L))); });
    },
    speakers: (g) => {
      card(g, 'Speaker SPL at the listener', 'Free-field estimate; rooms add a few dB at low frequencies.', [
        { key: 'sens', label: 'Sensitivity (1 W / 1 m)', type: 'number', value: 88, unit: 'dB' },
        { key: 'w', label: 'Amplifier power', type: 'number', value: 100, unit: 'W' },
        { key: 'r', label: 'Distance', type: 'number', value: 2.5, unit: 'm' },
        { key: 'n', label: 'Number of speakers', type: 'number', value: 2 },
      ], (s) => { const L = P.speakerSpl(s.sens, s.w, s.r, s.n); return S('Max SPL (continuous)', fmt(L, 1) + ' dB') + S('Headroom over 85 dB', fmt(L - 85, 1) + ' dB', L - 85 < 15 ? 'Aim ≥ 15–20 dB for peaks' : 'OK'); });
      card(g, 'Delay, distance & phase', 'Time-align speakers and subs, or find the cause of a comb filter.', [
        { key: 'd', label: 'Path difference', type: 'number', value: 0.5, unit: 'm' },
        { key: 'f', label: 'At frequency', type: 'number', value: 80, unit: 'Hz' },
      ], (s) => { const dt = s.d / P.C; return S('Delay', fmt(dt * 1000, 3) + ' ms') + S('Samples @48 kHz', fmt(dt * 48000, 1)) + S('Phase shift', fmt(P.phaseShift(s.f, dt), 0) + '°') + S('First comb notch', fmtHz(1 / (2 * dt))); });
      card(g, 'SBIR boundary nulls', 'Distance from each speaker to the nearest boundaries.', [
        { key: 'front', label: 'To front wall', type: 'number', value: 0.6, unit: 'm' },
        { key: 'side', label: 'To side wall', type: 'number', value: 0.9, unit: 'm' },
        { key: 'floor', label: 'Woofer to floor', type: 'number', value: 1.1, unit: 'm' },
      ], (s) => S('Front wall null', fmtHz(P.sbirNull(s.front))) + S('Side wall null', fmtHz(P.sbirNull(s.side))) + S('Floor null', fmtHz(P.sbirNull(s.floor))) + S('Stacking?', Math.min(Math.abs(s.front - s.side), Math.abs(s.front - s.floor), Math.abs(s.side - s.floor)) < 0.15 ? 'Yes — make distances differ' : 'No', '', Math.min(Math.abs(s.front - s.side), Math.abs(s.front - s.floor), Math.abs(s.side - s.floor)) < 0.15 ? 'warn' : 'good'));
    },
    rooms: (g) => {
      card(g, 'Axial room modes (quick)', 'Full analysis in the Room Analyzer.', [
        { key: 'L', label: 'Length', type: 'number', value: 5, unit: 'm' }, { key: 'W', label: 'Width', type: 'number', value: 4, unit: 'm' }, { key: 'H', label: 'Height', type: 'number', value: 2.6, unit: 'm' },
      ], (s) => ['L', 'W', 'H'].map((k) => S(k + ' modes', [1, 2, 3, 4].map((n) => fmt((n * P.C) / (2 * s[k]), 0)).join(' · ') + ' Hz')).join('') + S('Bolt area', P.boltOK(s.L, s.W, s.H) ? 'Inside' : 'Outside'));
      card(g, 'Reverberation (Sabine & Eyring)', '', [
        { key: 'V', label: 'Volume', type: 'number', value: 60, unit: 'm³' },
        { key: 'S', label: 'Total surface', type: 'number', value: 94, unit: 'm²' },
        { key: 'A', label: 'Absorption', type: 'number', value: 25, unit: 'm² sabins' },
      ], (s) => S('Sabine RT', fmt(P.sabine(s.V, s.A), 2) + ' s') + S('Eyring RT', fmt(P.eyring(s.V, s.S, s.A / s.S), 2) + ' s') + S('Mean α', fmt(s.A / s.S, 2)) + S('Schroeder f', fmtHz(P.schroeder(P.sabine(s.V, s.A), s.V))) + S('Critical distance (Q=2)', fmt(P.criticalDistance(s.V, P.sabine(s.V, s.A), 2), 2) + ' m'));
      card(g, 'Absorption needed for a target RT', '', [
        { key: 'V', label: 'Volume', type: 'number', value: 60, unit: 'm³' },
        { key: 'T', label: 'Target RT', type: 'number', value: 0.3, unit: 's' },
        { key: 'A0', label: 'Existing absorption', type: 'number', value: 8, unit: 'm² sabins' },
        { key: 'a', label: 'α of the treatment', type: 'number', value: 0.9 },
      ], (s) => { const need = P.absorptionNeeded(s.V, s.T); return S('Total needed', fmt(need, 1) + ' m²') + S('To add', fmt(Math.max(0, need - s.A0), 1) + ' m²') + S('Treatment area', fmt(Math.max(0, need - s.A0) / Math.max(0.05, s.a), 1) + ' m²'); });
      card(g, 'Optimum RT for halls', 'Stephens & Bate.', [{ key: 'V', label: 'Volume', type: 'number', value: 12000, unit: 'm³' }], (s) => S('Speech', fmt(P.stephensBate(s.V, 4), 2) + ' s') + S('Orchestra', fmt(P.stephensBate(s.V, 5), 2) + ' s') + S('Choir / organ', fmt(P.stephensBate(s.V, 6), 2) + ' s') + S('EBU control-room Tm', fmt(P.ebuTm(s.V), 2) + ' s', 'only meaningful for small rooms'));
    },
    isolation: (g) => {
      card(g, 'Mass law & panel mass', '', [
        { key: 'mat', label: 'Material', type: 'select', value: 'gypsumX', options: Object.entries(P.PANELS).map(([k, v]) => [k, v.name]) },
        { key: 't', label: 'Thickness', type: 'number', value: 15.9, unit: 'mm' },
        { key: 'f', label: 'Frequency', type: 'number', value: 500, unit: 'Hz' },
      ], (s) => { const m = P.PANELS[s.mat].rho * s.t / 1000; const fc = P.criticalFreq(P.PANELS[s.mat], s.t / 1000); return S('Surface mass', fmt(m, 1) + ' kg/m²') + S('Mass-law TL @ f', fmt(P.massLaw(m, s.f), 1) + ' dB') + S('Coincidence fc', fmtHz(fc)); });
      card(g, 'Mass–air–mass resonance', '', [
        { key: 'm1', label: 'Leaf 1 mass', type: 'number', value: 22, unit: 'kg/m²' }, { key: 'm2', label: 'Leaf 2 mass', type: 'number', value: 22, unit: 'kg/m²' }, { key: 'd', label: 'Cavity', type: 'number', value: 150, unit: 'mm' },
      ], (s) => S('f₀ (empty)', fmtHz(60 * Math.sqrt((s.m1 + s.m2) / (s.m1 * s.m2 * s.d / 1000)))) + S('f₀ (insulated)', fmtHz(50 * Math.sqrt((s.m1 + s.m2) / (s.m1 * s.m2 * s.d / 1000)))) + S('Cavity resonance limit', fmtHz(P.C / (2 * Math.PI * s.d / 1000))));
      card(g, 'Level next door', 'L₂ = L₁ − TL + 10·log(S/A₂)', [
        { key: 'L1', label: 'Source room level', type: 'number', value: 100, unit: 'dB' },
        { key: 'TL', label: 'Partition TL', type: 'number', value: 50, unit: 'dB' },
        { key: 'S', label: 'Partition area', type: 'number', value: 10, unit: 'm²' },
        { key: 'A2', label: 'Receiving absorption', type: 'number', value: 12, unit: 'm² sabins' },
      ], (s) => S('Receiving level', fmt(P.receivingLevel(s.L1, s.TL, s.S, s.A2), 1) + ' dB') + S('Level difference D', fmt(s.L1 - P.receivingLevel(s.L1, s.TL, s.S, s.A2), 1) + ' dB'));
      card(g, 'Barrier (Maekawa)', 'Outdoor wall/screen between source and receiver.', [
        { key: 'a', label: 'Source → barrier top', type: 'number', value: 5.4, unit: 'm' },
        { key: 'b', label: 'Barrier top → receiver', type: 'number', value: 10.2, unit: 'm' },
        { key: 'd', label: 'Direct distance', type: 'number', value: 15, unit: 'm' },
      ], (s) => { const dl = s.a + s.b - s.d; return S('Path difference δ', fmt(dl, 2) + ' m') + [63, 250, 1000, 4000].map((f) => S('IL @ ' + A.shortHz(f), fmt(P.maekawa(dl, f), 1) + ' dB')).join(''); });
    },
    hvac: (g) => {
      card(g, 'Duct velocity', 'Keep velocity low for quiet air. Rules of thumb for NC 15–20 rooms: mains ≤ 3–4 m/s, branches ≤ 2–2.5 m/s, grilles ≤ 1.5 m/s.', [
        { key: 'q', label: 'Airflow', type: 'number', value: 300, unit: 'm³/h' },
        { key: 'w', label: 'Duct width', type: 'number', value: 300, unit: 'mm' },
        { key: 'h', label: 'Duct height (0 = round of diameter w)', type: 'number', value: 200, unit: 'mm' },
        { key: 'vt', label: 'Target velocity', type: 'number', value: 2, unit: 'm/s' },
      ], (s) => { const area = s.h > 0 ? (s.w * s.h) / 1e6 : (Math.PI * (s.w / 2000) ** 2); const v = s.q / 3600 / area; const need = s.q / 3600 / s.vt; return S('Velocity', fmt(v, 2) + ' m/s', v > 3 ? 'Too fast for a studio' : v > 2 ? 'OK for mains' : 'Quiet', v > 3 ? 'bad' : v > 2 ? 'warn' : 'good') + S('Area for target', fmt(need * 1e4, 0) + ' cm²') + S('Round Ø for target', fmt(Math.sqrt((4 * need) / Math.PI) * 1000, 0) + ' mm'); });
      card(g, 'Ventilation rate', 'Studios need fresh air — sealed rooms get stuffy fast.', [
        { key: 'V', label: 'Room volume', type: 'number', value: 50, unit: 'm³' },
        { key: 'p', label: 'People', type: 'number', value: 4 },
        { key: 'pp', label: 'Fresh air per person', type: 'number', value: 36, unit: 'm³/h' },
      ], (s) => { const q = s.p * s.pp; return S('Airflow', fmt(q, 0) + ' m³/h') + S('Air changes', fmt(q / s.V, 1) + ' /h') + S('Grille area @1.5 m/s', fmt((q / 3600 / 1.5) * 1e4, 0) + ' cm²'); });
    },
    units: (g) => {
      card(g, 'Unit converter', '', [
        { key: 'v', label: 'Value', type: 'number', value: 1 },
        { key: 'k', label: 'Conversion', type: 'select', value: 'ft-m', options: [['ft-m', 'feet → metres'], ['m-ft', 'metres → feet'], ['in-mm', 'inches → mm'], ['psf-kg', 'lb/ft² → kg/m²'], ['kg-psf', 'kg/m² → lb/ft²'], ['pcf-kg', 'lb/ft³ → kg/m³'], ['f-c', '°F → °C'], ['sab', 'sabins (ft²) → m² sabins'], ['cfm', 'CFM → m³/h'], ['fpm', 'FPM → m/s'], ['rayl', 'Rayl (MKS) → ρc units']] },
      ], (s) => {
        const f = { 'ft-m': [0.3048, 'm'], 'm-ft': [3.28084, 'ft'], 'in-mm': [25.4, 'mm'], 'psf-kg': [4.8824, 'kg/m²'], 'kg-psf': [0.20482, 'lb/ft²'], 'pcf-kg': [16.0185, 'kg/m³'], sab: [0.092903, 'm²'], cfm: [1.69901, 'm³/h'], fpm: [0.00508, 'm/s'], rayl: [1 / 415, '× ρc'] }[s.k];
        if (s.k === 'f-c') return S('Result', fmt(((s.v - 32) * 5) / 9, 2) + ' °C');
        return S('Result', fmt(s.v * f[0], 4) + ' ' + f[1]);
      });
      card(g, 'Octave & third-octave band edges', '', [{ key: 'fc', label: 'Centre frequency', type: 'number', value: 125, unit: 'Hz' }], (s) => S('Octave', `${fmt(s.fc / Math.SQRT2, 1)} – ${fmt(s.fc * Math.SQRT2, 1)} Hz`) + S('Third-octave', `${fmt(s.fc / Math.pow(2, 1 / 6), 1)} – ${fmt(s.fc * Math.pow(2, 1 / 6), 1)} Hz`) + S('Exact base-2 centre', fmt(P.exactThird(s.fc), 2) + ' Hz'));
      card(g, 'Digital audio', '', [{ key: 'bits', label: 'Bit depth', type: 'number', value: 24 }, { key: 'fs', label: 'Sample rate', type: 'number', value: 48000, unit: 'Hz' }], (s) => S('Dynamic range', fmt(6.02 * s.bits + 1.76, 1) + ' dB') + S('Nyquist', fmtHz(s.fs / 2)) + S('Data rate (stereo)', fmt((s.bits * s.fs * 2) / 1e6, 2) + ' Mbit/s'));
    },
  };

  A.register('calc', {
    title: 'Calculators',
    render(root, params) {
      A.pageHead(root, 'Design', 'Calculators', 'The everyday numbers of an acoustician, instantly. Every calculator shows its formula in the Glossary & Formulas page.');
      const tabs = [['basics', 'Levels & waves'], ['speakers', 'Speakers & timing'], ['rooms', 'Room acoustics'], ['isolation', 'Isolation'], ['hvac', 'HVAC & ventilation'], ['units', 'Units & bands']];
      A.tabs(root, tabs, (id, body) => { const g = el('div', { class: 'grid g2' }); body.appendChild(g); GROUPS[id](g); }, tabs.find((t) => t[0] === params[0]) ? params[0] : 'basics');
    },
  });
})();
