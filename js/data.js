/* ==========================================================================
   Acoustica reference data. Absorption coefficients are typical published
   values (random incidence, Sabine) collected from standard texts; real
   products vary — always check manufacturer test data (ASTM C423 / ISO 354).
   ========================================================================== */
(function () {
  'use strict';
  const D = (window.D = {});

  // α at 125, 250, 500, 1k, 2k, 4k Hz
  D.MATERIALS = [
    // ---- hard surfaces
    { id: 'concrete-painted', cat: 'Hard surfaces', name: 'Concrete, painted / sealed', a: [0.01, 0.01, 0.02, 0.02, 0.02, 0.02] },
    { id: 'concrete-raw', cat: 'Hard surfaces', name: 'Concrete, unpainted rough', a: [0.01, 0.02, 0.04, 0.06, 0.08, 0.1] },
    { id: 'block-painted', cat: 'Hard surfaces', name: 'Concrete block, painted', a: [0.1, 0.05, 0.06, 0.07, 0.09, 0.08] },
    { id: 'block-raw', cat: 'Hard surfaces', name: 'Concrete block, unpainted (porous)', a: [0.36, 0.44, 0.31, 0.29, 0.39, 0.25] },
    { id: 'brick', cat: 'Hard surfaces', name: 'Brick, unglazed', a: [0.03, 0.03, 0.03, 0.04, 0.05, 0.07] },
    { id: 'plaster-masonry', cat: 'Hard surfaces', name: 'Plaster on masonry', a: [0.01, 0.02, 0.02, 0.03, 0.04, 0.05] },
    { id: 'marble', cat: 'Hard surfaces', name: 'Marble / glazed tile', a: [0.01, 0.01, 0.01, 0.01, 0.02, 0.02] },
    { id: 'gypsum-stud', cat: 'Hard surfaces', name: 'Gypsum board 12.5 mm on studs', a: [0.29, 0.1, 0.05, 0.04, 0.07, 0.09] },
    { id: 'gypsum-2layer', cat: 'Hard surfaces', name: 'Gypsum board 2×12.5 mm on studs', a: [0.15, 0.08, 0.05, 0.04, 0.06, 0.08] },
    { id: 'wood-panel', cat: 'Hard surfaces', name: 'Plywood paneling 10 mm over air', a: [0.28, 0.22, 0.17, 0.09, 0.1, 0.11] },
    { id: 'wood-solid', cat: 'Hard surfaces', name: 'Solid timber boards 19 mm', a: [0.19, 0.14, 0.09, 0.06, 0.06, 0.05] },
    { id: 'door-wood', cat: 'Hard surfaces', name: 'Solid wood door', a: [0.14, 0.1, 0.06, 0.08, 0.1, 0.1] },
    // ---- glazing
    { id: 'glass-window', cat: 'Glazing', name: 'Window glass, ordinary', a: [0.35, 0.25, 0.18, 0.12, 0.07, 0.04] },
    { id: 'glass-heavy', cat: 'Glazing', name: 'Heavy plate glass', a: [0.18, 0.06, 0.04, 0.03, 0.02, 0.02] },
    // ---- floors
    { id: 'floor-wood', cat: 'Floors', name: 'Wood floor on joists', a: [0.15, 0.11, 0.1, 0.07, 0.06, 0.07] },
    { id: 'floor-parquet', cat: 'Floors', name: 'Parquet on concrete', a: [0.04, 0.04, 0.07, 0.06, 0.06, 0.07] },
    { id: 'floor-vinyl', cat: 'Floors', name: 'Vinyl / linoleum on concrete', a: [0.02, 0.03, 0.03, 0.03, 0.03, 0.02] },
    { id: 'carpet-thin', cat: 'Floors', name: 'Carpet, thin, on concrete', a: [0.02, 0.06, 0.14, 0.37, 0.6, 0.65] },
    { id: 'carpet-pad', cat: 'Floors', name: 'Carpet, heavy, on foam underlay', a: [0.08, 0.24, 0.57, 0.69, 0.71, 0.73] },
    { id: 'rug', cat: 'Floors', name: 'Area rug (thick pile)', a: [0.05, 0.1, 0.3, 0.5, 0.6, 0.65] },
    // ---- porous absorbers
    { id: 'foam-25', cat: 'Porous absorbers', name: 'Acoustic foam 25 mm', a: [0.05, 0.12, 0.35, 0.65, 0.8, 0.85] },
    { id: 'foam-50', cat: 'Porous absorbers', name: 'Acoustic foam 50 mm', a: [0.1, 0.3, 0.7, 0.9, 0.95, 0.95] },
    { id: 'mw-50', cat: 'Porous absorbers', name: 'Mineral wool 50 mm (≈45 kg/m³), on wall', a: [0.17, 0.66, 0.99, 0.99, 0.99, 0.99] },
    { id: 'mw-50-gap', cat: 'Porous absorbers', name: 'Mineral wool 50 mm + 50 mm air gap', a: [0.32, 0.89, 0.99, 0.99, 0.99, 0.99] },
    { id: 'mw-100', cat: 'Porous absorbers', name: 'Mineral wool 100 mm, on wall', a: [0.6, 0.99, 0.99, 0.99, 0.99, 0.99] },
    { id: 'mw-100-gap', cat: 'Porous absorbers', name: 'Mineral wool 100 mm + 100 mm gap', a: [0.85, 0.99, 0.99, 0.99, 0.99, 0.99] },
    { id: 'fabric-panel-50', cat: 'Porous absorbers', name: 'Fabric-wrapped panel 50 mm (A-mount)', a: [0.15, 0.6, 0.95, 0.99, 0.95, 0.9] },
    { id: 'polyester-50', cat: 'Porous absorbers', name: 'Polyester fibre panel 50 mm', a: [0.12, 0.45, 0.85, 0.95, 0.95, 0.9] },
    { id: 'bass-trap-corner', cat: 'Porous absorbers', name: 'Corner bass trap (superchunk) per m² face', a: [0.9, 0.99, 0.99, 0.99, 0.99, 0.99] },
    // ---- resonant
    { id: 'membrane', cat: 'Resonant absorbers', name: 'Membrane trap, 6 mm ply, 100 mm filled cavity', a: [0.6, 0.35, 0.2, 0.12, 0.1, 0.08] },
    { id: 'slot-resonator', cat: 'Resonant absorbers', name: 'Slotted wood resonator, filled', a: [0.4, 0.85, 0.65, 0.4, 0.25, 0.2] },
    { id: 'perforated-panel', cat: 'Resonant absorbers', name: 'Perforated panel (≈10% open) + 50 mm wool', a: [0.35, 0.75, 0.95, 0.8, 0.6, 0.45] },
    { id: 'micro-perf', cat: 'Resonant absorbers', name: 'Micro-perforated panel/foil, 100 mm gap', a: [0.15, 0.45, 0.75, 0.65, 0.4, 0.25] },
    // ---- ceilings
    { id: 'act-mineral', cat: 'Ceilings', name: 'Acoustic ceiling tile, mineral (suspended)', a: [0.7, 0.66, 0.72, 0.92, 0.88, 0.75] },
    { id: 'act-glass', cat: 'Ceilings', name: 'Fibreglass ceiling tile 25 mm (suspended)', a: [0.65, 0.85, 0.95, 0.99, 0.99, 0.95] },
    { id: 'cloud-100', cat: 'Ceilings', name: 'Ceiling cloud 100 mm, 200 mm drop (both faces)', a: [0.75, 0.99, 0.99, 0.99, 0.99, 0.99] },
    // ---- fabrics
    { id: 'drape-heavy', cat: 'Fabrics & soft', name: 'Heavy velour drape, 50% fullness', a: [0.14, 0.35, 0.55, 0.72, 0.7, 0.65] },
    { id: 'drape-light', cat: 'Fabrics & soft', name: 'Light curtain, flat on wall', a: [0.03, 0.04, 0.11, 0.17, 0.24, 0.35] },
    { id: 'sofa', cat: 'Fabrics & soft', name: 'Upholstered sofa (per m² footprint)', a: [0.3, 0.45, 0.6, 0.7, 0.7, 0.65] },
    { id: 'bookshelf', cat: 'Fabrics & soft', name: 'Filled bookshelf (irregular)', a: [0.1, 0.2, 0.3, 0.35, 0.35, 0.3] },
    // ---- audience
    { id: 'seats-occupied', cat: 'Seating & people', name: 'Upholstered seats, occupied (per m²)', a: [0.39, 0.57, 0.8, 0.94, 0.92, 0.87] },
    { id: 'seats-empty', cat: 'Seating & people', name: 'Upholstered seats, empty (per m²)', a: [0.19, 0.37, 0.56, 0.67, 0.61, 0.59] },
    { id: 'pews-wood', cat: 'Seating & people', name: 'Wooden pews, empty (per m²)', a: [0.1, 0.09, 0.08, 0.08, 0.08, 0.08] },
    { id: 'audience-wood', cat: 'Seating & people', name: 'Audience on wooden pews (per m²)', a: [0.57, 0.61, 0.75, 0.86, 0.91, 0.86] },
    // ---- diffusers
    { id: 'qrd', cat: 'Diffusers', name: 'QRD diffuser (wood)', a: [0.2, 0.18, 0.15, 0.12, 0.12, 0.1] },
    { id: 'skyline', cat: 'Diffusers', name: '2D skyline diffuser', a: [0.1, 0.15, 0.2, 0.18, 0.15, 0.12] },
    { id: 'poly', cat: 'Diffusers', name: 'Polycylindrical (curved ply) diffuser', a: [0.35, 0.3, 0.15, 0.1, 0.08, 0.06] },
    // ---- misc
    { id: 'water', cat: 'Misc', name: 'Water surface (pool)', a: [0.01, 0.01, 0.01, 0.015, 0.02, 0.025] },
    { id: 'open-window', cat: 'Misc', name: 'Open window / opening', a: [1, 1, 1, 1, 1, 1] },
  ];
  D.MATERIALS.forEach((m) => {
    m.nrc = Math.round(((m.a[1] + m.a[2] + m.a[3] + m.a[4]) / 4) * 20) / 20;
  });
  D.mat = (id) => D.MATERIALS.find((m) => m.id === id) || D.MATERIALS[0];

  // porous materials for the absorber designer (flow resistivity Pa·s/m²)
  D.POROUS = [
    { id: 'rockwool-40', name: 'Rock/mineral wool ~40 kg/m³', sigma: 12000, rho: 40 },
    { id: 'rockwool-60', name: 'Rock/mineral wool ~60 kg/m³', sigma: 22000, rho: 60 },
    { id: 'rockwool-100', name: 'Rock wool slab ~100 kg/m³', sigma: 45000, rho: 100 },
    { id: 'glasswool-24', name: 'Glass wool ~24 kg/m³ (batt)', sigma: 8000, rho: 24 },
    { id: 'glasswool-48', name: 'Rigid glass fibre ~48 kg/m³ (e.g. “703”-class)', sigma: 18000, rho: 48 },
    { id: 'polyester-25', name: 'Polyester fibre ~25 kg/m³', sigma: 6000, rho: 25 },
    { id: 'cotton', name: 'Recycled cotton/denim batt', sigma: 9000, rho: 30 },
    { id: 'melamine', name: 'Melamine foam', sigma: 11000, rho: 10 },
    { id: 'pu-foam', name: 'Open-cell PU foam (acoustic)', sigma: 14000, rho: 30 },
    { id: 'woodwool', name: 'Wood-wool cement board', sigma: 3000, rho: 400 },
  ];

  // typical noise source spectra, octave bands 63–8k (dB SPL, reverberant level in the source room)
  D.SOURCES = [
    { id: 'drums', name: 'Acoustic drum kit (in room)', oct: [100, 106, 108, 110, 110, 108, 106, 102] },
    { id: 'band', name: 'Full band rehearsal', oct: [108, 112, 110, 108, 106, 104, 100, 95] },
    { id: 'bass-amp', name: 'Bass amp, loud', oct: [108, 108, 104, 98, 92, 86, 78, 70] },
    { id: 'guitar-amp', name: 'Guitar amp, loud', oct: [85, 98, 105, 108, 106, 102, 95, 85] },
    { id: 'theater', name: 'Home cinema peaks (LFE heavy)', oct: [108, 102, 96, 92, 90, 88, 84, 78] },
    { id: 'mixing', name: 'Mixing at 85 dB SPL', oct: [88, 86, 84, 82, 80, 78, 74, 68] },
    { id: 'singer', name: 'Trained singer, loud', oct: [60, 72, 84, 90, 88, 82, 74, 64] },
    { id: 'speech', name: 'Raised speech / podcast', oct: [50, 58, 66, 70, 66, 60, 54, 46] },
    { id: 'piano', name: 'Grand piano, forte', oct: [80, 90, 95, 94, 90, 85, 80, 72] },
    { id: 'traffic', name: 'Urban traffic at façade', oct: [78, 74, 71, 69, 67, 63, 57, 49] },
    { id: 'hvac', name: 'Rooftop HVAC unit (near)', oct: [82, 80, 76, 72, 70, 66, 60, 54] },
    { id: 'tv', name: 'TV at normal level', oct: [60, 64, 66, 65, 62, 58, 52, 45] },
  ];

  // everyday sound level ladder (dB SPL / dBA, approximate)
  D.LADDER = [
    [0, 'Threshold of hearing (young ears, 1 kHz)'],
    [10, 'Breathing, anechoic chamber'],
    [20, 'Rustling leaves · NC-15 recording studio'],
    [30, 'Quiet bedroom at night · whisper at 1 m'],
    [40, 'Library · quiet suburban living room'],
    [50, 'Quiet office · moderate rain'],
    [60, 'Normal conversation at 1 m'],
    [70, 'Vacuum cleaner · busy restaurant'],
    [80, 'Busy street · alarm clock at 1 m'],
    [85, 'Hearing-risk threshold (8 h) · film mix reference'],
    [90, 'Lawnmower · subway train'],
    [100, 'Motorcycle · power tools · loud club'],
    [105, 'Drummer’s ears, hard playing'],
    [110, 'Rock concert front rows · chainsaw'],
    [120, 'Thunderclap · siren at close range'],
    [130, 'Threshold of pain · jet take-off at 50 m'],
    [140, 'Gunshot · firecracker at close range'],
  ];

  // room types: target RT (mid), NC target, guidance
  D.ROOM_TYPES = [
    { id: 'control', name: 'Control / mixing room', rt: (V) => [Math.max(0.15, (window.P ? P.ebuTm(V) : 0.25) - 0.05), (window.P ? P.ebuTm(V) : 0.25) + 0.05], nc: 20, flat: true, note: 'EBU Tech 3276 nominal Tm = 0.25·(V/100)^⅓ s, ±0.05 s from 200 Hz–4 kHz; LF may rise slightly.' },
    { id: 'home-studio', name: 'Home studio (mix + record)', rt: () => [0.2, 0.35], nc: 25, flat: true, note: 'Small rooms: aim for an even decay across bands; bass control matters more than the mid-band number.' },
    { id: 'mastering', name: 'Mastering suite', rt: (V) => [0.2, 0.3], nc: 15, flat: true, note: 'Mastering rooms need the flattest decay and lowest noise floor of any studio space.' },
    { id: 'vocal-booth', name: 'Vocal / voice-over booth', rt: () => [0.12, 0.25], nc: 20, flat: true, note: 'Avoid the “boxy” sound: tiny booths need deep broadband treatment, not thin foam.' },
    { id: 'live', name: 'Live / tracking room', rt: () => [0.4, 0.8], nc: 20, flat: false, note: 'Live rooms benefit from variable acoustics: reflective + absorptive panels.' },
    { id: 'drum', name: 'Drum room', rt: () => [0.35, 0.6], nc: 25, flat: false, note: 'Enough volume and diffusion to let the kit breathe; heavy isolation needed.' },
    { id: 'rehearsal', name: 'Rehearsal room', rt: () => [0.4, 0.6], nc: 30, flat: true, note: 'Rehearsal rooms need heavy LF absorption — band levels exceed 105 dB.' },
    { id: 'theater', name: 'Home cinema / screening', rt: () => [0.25, 0.45], nc: 20, flat: true, note: 'Dolby / THX style guidance: short, even decay; strong LF control for subwoofers.' },
    { id: 'podcast', name: 'Podcast / broadcast', rt: () => [0.2, 0.3], nc: 20, flat: true, note: 'Speech clarity first: kill early reflections around the talkers.' },
    { id: 'classroom', name: 'Classroom (≤ 283 m³)', rt: () => [0.4, 0.6], nc: 30, flat: true, note: 'ANSI/ASA S12.60: RT ≤ 0.6 s, background ≤ 35 dBA in core learning spaces.' },
    { id: 'lecture', name: 'Lecture hall / auditorium (speech)', rt: (V) => [0.7, Math.min(1.1, (window.P ? P.stephensBate(V, 4) : 1))], nc: 25, flat: true, note: 'Speech intelligibility (STI > 0.6) is the design objective.' },
    { id: 'worship', name: 'Worship space (mixed music/speech)', rt: (V) => [1.1, 1.8], nc: 25, flat: false, note: 'Balance congregational singing (longer RT) with speech clarity (directional loudspeakers).' },
    { id: 'concert', name: 'Concert hall (symphonic)', rt: (V) => [1.8, 2.2], nc: 15, flat: false, note: 'Beranek’s favourite halls cluster around RT 1.9–2.1 s occupied with BR 1.1–1.25.' },
    { id: 'opera', name: 'Opera / drama theatre', rt: (V) => [1.2, 1.6], nc: 20, flat: false, note: 'Opera needs clarity for text with enough bloom for the voice.' },
    { id: 'restaurant', name: 'Restaurant / café', rt: () => [0.5, 0.8], nc: 40, flat: true, note: 'Lombard effect: noisy rooms make everyone talk louder. Treat ceilings.' },
    { id: 'office', name: 'Open office', rt: () => [0.4, 0.6], nc: 40, flat: true, note: 'Use ABC: Absorb, Block, Cover (masking).' },
  ];

  D.NC_TARGETS = [
    ['Recording studio / concert hall', 'NC 15–20'],
    ['Control room / mastering', 'NC 15–25'],
    ['Home studio, home cinema', 'NC 20–25'],
    ['Theatre, opera, worship', 'NC 20–25'],
    ['Classroom, conference', 'NC 25–30'],
    ['Private office, hotel room', 'NC 30–35'],
    ['Open office', 'NC 35–40'],
    ['Restaurant, retail', 'NC 40–45'],
  ];

  // fixed-value elements for the composite calculator (lab STC; field 3–7 dB lower)
  D.ELEMENTS = [
    { id: 'hollow-door', name: 'Hollow-core door, no seals', stc: 18 },
    { id: 'solid-door', name: 'Solid-core door, no seals', stc: 24 },
    { id: 'solid-door-seals', name: 'Solid-core door + full seals + drop seal', stc: 32 },
    { id: 'acoustic-door', name: 'Acoustic door set (rated)', stc: 45 },
    { id: 'acoustic-door-hi', name: 'Heavy studio door set (rated)', stc: 52 },
    { id: 'sound-lock', name: 'Two sealed solid doors (sound lock)', stc: 55 },
    { id: 'window-single', name: 'Single glazing 4 mm', stc: 26 },
    { id: 'window-double', name: 'Double glazing 4/16/4 (thermal)', stc: 30 },
    { id: 'window-lam', name: 'Laminated 6.8/12/10 acoustic unit', stc: 38 },
    { id: 'window-secondary', name: 'Window + secondary glazing (100 mm+ gap)', stc: 48 },
    { id: 'window-studio', name: 'Studio window: 2 × laminated, 150 mm+ gap', stc: 55 },
    { id: 'vent-open', name: 'Open vent / unsealed gap', stc: 0 },
    { id: 'outlet-box', name: 'Unsealed back-to-back outlet box', stc: 12 },
  ];

  // wall presets defined by layers (computed with P.doubleLeafTL)
  const G = (n, mat = 'gypsumX', t = 0.0159) => Array.from({ length: n }, () => ({ mat, t }));
  D.WALLS = [
    { id: 'w-wood-1', name: 'Timber stud, 1+1 gypsum, empty', a: G(1), b: G(1), d: 0.089, filled: false, conn: 'wood' },
    { id: 'w-wood-1i', name: 'Timber stud, 1+1 gypsum, insulated', a: G(1), b: G(1), d: 0.089, filled: true, conn: 'wood' },
    { id: 'w-wood-2i', name: 'Timber stud, 2+2 gypsum, insulated', a: G(2), b: G(2), d: 0.089, filled: true, conn: 'wood' },
    { id: 'w-wood-gg', name: 'Timber stud, 2+2 gypsum + damping compound', a: G(2), b: G(2), d: 0.089, filled: true, conn: 'wood', damping: true },
    { id: 'w-steel', name: 'Steel stud, 1+1, insulated', a: G(1), b: G(1), d: 0.092, filled: true, conn: 'steel' },
    { id: 'w-rc', name: 'Timber stud + resilient channel, 1+2', a: G(1), b: G(2), d: 0.1, filled: true, conn: 'resilient' },
    { id: 'w-clips', name: 'Timber stud + clips & channel, 2+2', a: G(2), b: G(2), d: 0.115, filled: true, conn: 'clips' },
    { id: 'w-stag', name: 'Staggered stud, 2+2, insulated', a: G(2), b: G(2), d: 0.14, filled: true, conn: 'staggered' },
    { id: 'w-double', name: 'Double stud (separate), 2+2, insulated', a: G(2), b: G(2), d: 0.2, filled: true, conn: 'none' },
    { id: 'w-double-3', name: 'Double stud, 3+3 gypsum, 250 mm cavity', a: G(3), b: G(3), d: 0.25, filled: true, conn: 'none' },
    { id: 'w-masonry-lining', name: '200 mm block + independent 2-layer lining', a: [{ mat: 'cmu', t: 0.19 }], b: G(2), d: 0.1, filled: true, conn: 'none' },
  ];

  // case-study / design-target isolation guidance
  D.ISOLATION_TARGETS = [
    ['Bedroom ↔ bedroom (code minimum, many regions)', 'STC 50 / Rw 45–50'],
    ['Home office / podcast in a house', 'STC 50–55'],
    ['Home studio, acoustic instruments, detached house', 'STC 55–60'],
    ['Drums or amplified band, attached neighbours', 'STC 65–75 + floated floor'],
    ['Professional studio between rooms', 'STC 60–75 (NIC 55–70 field)'],
    ['Cinema to cinema (multiplex)', 'STC 65–75'],
    ['Concert hall envelope vs. traffic / rail', 'Case-by-case, often 70+ with box-in-box'],
  ];

  // generic isolator families for the floor designer (stiffness per unit or per area)
  D.ISOLATORS = [
    { id: 'spring-25', type: 'spring', name: 'Steel spring mount, 25 mm rated deflection', ratedLoad: 450, ratedDefl: 25, zeta: 0.02 },
    { id: 'spring-50', type: 'spring', name: 'Steel spring mount, 50 mm rated deflection', ratedLoad: 450, ratedDefl: 50, zeta: 0.02 },
    { id: 'spring-25-hd', type: 'spring', name: 'Heavy-duty spring, 25 mm rated deflection', ratedLoad: 1200, ratedDefl: 25, zeta: 0.02 },
    { id: 'neoprene-soft', type: 'pad', name: 'Neoprene/rubber mount, soft (≈5 mm)', ratedLoad: 150, ratedDefl: 5, dyn: 1.4, zeta: 0.06 },
    { id: 'neoprene-med', type: 'pad', name: 'Neoprene/rubber mount, medium (≈8 mm)', ratedLoad: 400, ratedDefl: 8, dyn: 1.4, zeta: 0.06 },
    { id: 'puck', type: 'pad', name: 'Rubber “puck” (hockey-puck style)', ratedLoad: 70, ratedDefl: 3, dyn: 1.6, zeta: 0.08 },
    { id: 'pu-pad', type: 'pad', name: 'Microcellular polyurethane bearing', ratedLoad: 300, ratedDefl: 6, dyn: 1.3, zeta: 0.05 },
  ];
  D.RESILIENT_LAYERS = [
    { id: 'mw-floor-20', name: 'Mineral wool floor board 20 mm (s′≈ 9 MN/m³)', s: 9 },
    { id: 'mw-floor-30', name: 'Mineral wool floor board 30 mm (s′≈ 6 MN/m³)', s: 6 },
    { id: 'rubber-crumb-10', name: 'Recycled rubber crumb mat 10 mm (s′≈ 35 MN/m³)', s: 35 },
    { id: 'rubber-crumb-20', name: 'Recycled rubber crumb mat 20 mm (s′≈ 18 MN/m³)', s: 18 },
    { id: 'pe-foam-5', name: 'Thin PE foam underlay 5 mm (s′≈ 80 MN/m³)', s: 80 },
    { id: 'pu-mat-12', name: 'Polyurethane resilient mat 12 mm (s′≈ 12 MN/m³)', s: 12 },
    { id: 'cork-6', name: 'Cork underlay 6 mm (s′≈ 100 MN/m³)', s: 100 },
  ];

  // octave band colours for some charts
  D.BAND_LABELS = ['125', '250', '500', '1k', '2k', '4k'];
})();
