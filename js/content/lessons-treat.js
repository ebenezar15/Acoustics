/* ==========================================================================
   Academy — room-mode treatment and integrated/hidden design (acoustics track).
   Inserted after "Room Modes" and after "Flanking" respectively.
   ========================================================================== */
(function () {
  const svgFlow = (steps) => `<div class="flowline">${steps.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`;

  const MODES_TREAT = {
    id: 'modes-treat', n: '6A', title: 'Treating Room Modes: Find, Target, Place', level: 'Core', mins: 35,
    summary: 'Are modes good or bad? How to find the problem frequencies and zones, choose the absorber, and place it where it actually works.',
    tags: ['room modes', 'bass trap', 'membrane', 'Helmholtz', 'placement', 'waterfall', 'target frequency', 'problem zones'],
    sections: [
      { h: 'Are room modes good or bad?', html: `
        <p class="lead">Neither — they are physics. Every enclosed room has modes. What matters is whether they are <b>few, strong and isolated</b> (bad) or <b>many, damped and overlapping</b> (fine).</p>
        <div class="grid g2">
          <div class="card"><h4 style="margin-top:0">Treat aggressively</h4><ul>
            <li><b>Control rooms, mastering, mixing</b> — you make decisions on what you hear; a 12 dB peak at 63 Hz means bass-light mixes.</li>
            <li><b>Vocal booths, podcast rooms</b> — small rooms put modes in the voice range (boxy sound).</li>
            <li><b>Home cinema & listening rooms</b> — seat-to-seat bass consistency.</li>
            <li><b>Rehearsal & drum rooms</b> — loud LF piles up into mud.</li></ul></div>
          <div class="card"><h4 style="margin-top:0">Treat gently, or leave</h4><ul>
            <li><b>Large live rooms & halls</b> — above ~20–50 Hz the modes are dense; the room is “statistical”, and warmth (bass ratio) is wanted.</li>
            <li><b>Live tracking rooms</b> — some low-frequency character is part of the sound; control only the worst ringing.</li>
            <li><b>Modes below the content</b> — a 22 Hz mode in a podcast room doesn’t matter.</li>
            <li><b>A null at the seat</b> — move first; absorption can’t fill a hole.</li></ul></div>
        </div>
        <div class="callout mentor">The goal in a critical room is not “no modes” but <b>short modal decay</b> (ideally under ~0.3 s at 40–200 Hz) and an <b>even response at the listening position</b>. Damping widens each mode so neighbours overlap and the response smooths out — you’ll see this in the Treatment Simulator.</div>` },
      { h: 'Find the target frequencies — three ways', html: `
        ${svgFlow([['Calculate', 'Room dimensions → axial modes c·n/2L. Look for clusters and gaps.'], ['Measure', 'Sine sweep → waterfall: long ridges are ringing modes; 1/24-octave response shows peaks.'], ['Listen & walk', 'Play each mode frequency (tone generator) and walk the room: loud at walls/corners, quiet at nodes.']])}
        <ol class="steps">
          <li><b>Calculate</b> axial modes for length, width and height (Room Analyzer or Treatment Simulator). Mark coincidences (two dimensions sharing a mode) — they are the usual troublemakers.</li>
          <li><b>Measure at the listening seat</b> with a measurement mic and REW: a 1/24-octave frequency response and a <b>waterfall</b> (spectral decay). The target frequency is a peak that also decays slowly. Note its exact frequency (e.g. 57 Hz, not “around 60”).</li>
          <li><b>Confirm with the mode shape</b>: at the target frequency, a mode is strongest where its pressure antinodes are — at the boundaries it involves and in the corners. Put the mic near a corner (pressure maximum for every mode) to see all modes at once.</li>
          <li><b>Rank</b>: peaks at the seat > 6 dB, decays > 0.4–0.5 s, and anything in the 40–150 Hz range of your content get treated first.</li>
        </ol>` },
      { h: 'Where to put a resonant absorber', html: `
        <p>Membrane and Helmholtz absorbers are <b>pressure-driven</b>: they work by being pushed by the sound pressure. So they must sit where the target mode’s pressure is high:</p>
        <ul>
          <li><b>Corners first</b> — every mode has a pressure maximum in every corner; tri-corners (wall–wall–ceiling) are the strongest.</li>
          <li><b>Walls the mode “uses”</b> — a length mode (1,0,0) peaks on the front and rear walls; a width mode on the side walls; a height mode on floor and ceiling.</li>
          <li><b>Avoid nodes</b> — e.g. the middle of the rear wall at mid-width is a node for the (0,1,0) width mode; a trap there does nothing for it.</li>
        </ul>
        <p>Porous absorbers are <b>velocity-driven</b>, but at low frequency the corner of a room is still where a deep porous trap (superchunk) does most — because it is thick and sits in the zone where several modes meet. Thin porous panels flat on a wall do almost nothing for modes.</p>
        <div class="callout data"><b>Coupling rule.</b> An absorber’s effect on mode n is proportional to its area × absorption at fₙ × (pressure of that mode at the absorber)². At a corner the coupling can be up to 8× the room average; at a node it is zero. The simulator uses exactly this.</div>` },
      { h: 'Which absorber for which problem', html: `
        <div class="table-wrap"><table><tr><th>Problem</th><th>First choice</th><th>Why</th></tr>
          <tr><td>Several modes 40–200 Hz, space available</td><td>Corner superchunks / deep porous traps</td><td>Broadband, forgiving, tackles every mode at once</td></tr>
          <tr><td>One dominant mode 30–120 Hz, little depth</td><td>Membrane (panel) trap tuned to it</td><td>High absorption in ~1 octave from shallow boxes</td></tr>
          <tr><td>Low-mid buildup 100–400 Hz</td><td>Helmholtz / slotted or perforated panels; thick porous</td><td>Tunable, architectural</td></tr>
          <tr><td>Ringing in a small booth 100–300 Hz</td><td>Deep porous on all surfaces + corner traps</td><td>Modes are dense — broadband beats tuning</td></tr>
          <tr><td>A null at the seat</td><td>Move the seat or speaker; multiple subs</td><td>Absorption reduces peaks, cannot add energy</td></tr>
          <tr><td>Problems above ~300 Hz (flutter, harshness)</td><td>Porous panels or diffusers</td><td>Not a modal problem</td></tr>
        </table></div>` },
      { h: 'Quick guide: problem zones → fixes', html: `
        <div class="grid g3">
          <div class="card"><h4 style="margin-top:0">Room centre</h4><p class="small">Null of all odd-order axial modes. Bass disappears. <b>Fix:</b> move the seat to ~38 % of length; don’t sit on the centre lines of length or width if avoidable (width centre is needed for symmetry — compensate with corner traps and multiple subs).</p></div>
          <div class="card"><h4 style="margin-top:0">Against the rear wall</h4><p class="small">Antinode of every length mode → boom. <b>Fix:</b> move forward ≥ 1 m or install very deep rear-wall trapping.</p></div>
          <div class="card"><h4 style="margin-top:0">Corners</h4><p class="small">Maximum pressure for all modes. <b>Fix:</b> best place for bass traps; worst place for a single subwoofer unless you want maximum excitation.</p></div>
          <div class="card"><h4 style="margin-top:0">¼ and ¾ of a dimension</h4><p class="small">Nulls of 2nd-order modes. <b>Fix:</b> avoid seating exactly there; measure in 5 cm steps.</p></div>
          <div class="card"><h4 style="margin-top:0">Speaker ~λ/4 from a wall</h4><p class="small">SBIR cancellation at c/4d. <b>Fix:</b> change distance, soffit-mount, or absorb thickly behind.</p></div>
          <div class="card"><h4 style="margin-top:0">Coincident dimensions</h4><p class="small">Stacked modes = big single peak. <b>Fix:</b> tuned trap at that frequency in the corners those two dimensions share.</p></div>
        </div>
        <p><a class="btn primary" href="#/treatment">Open the Treatment Simulator →</a></p>` },
    ],
    quiz: [
      { q: 'Where does a membrane trap tuned to the (1,0,0) length mode work best?', opts: ['Centre of the side wall', 'Front or rear wall, ideally in the corners', 'Middle of the ceiling', 'Anywhere'], a: 1, why: 'Length modes have pressure maxima on the front/rear walls; corners are maxima for all modes.' },
      { q: 'A deep dip at the seat that moves when you move — best fix?', opts: ['More bass traps', 'EQ boost', 'Move the seat/speakers (or add subs)', 'Diffusers'], a: 2, why: 'Nulls are positional; absorption cannot add energy.' },
      { q: 'Room modes in a large concert hall are…', opts: ['A major problem', 'Dense and overlapping above a few tens of Hz — not a design concern', 'Treated with membrane traps', 'Always at 100 Hz'], a: 1, why: 'Schroeder frequency is very low in large volumes.' },
    ],
  };

  const INTEGRATED = {
    id: 'integrated', n: '11A', title: 'Hidden & Integrated Design: Isolation + Treatment in One Depth', level: 'Advanced', mins: 35,
    summary: 'Combine isolation and absorption in the same wall depth, and design rooms whose treatment is invisible behind fabric, slats and finishes.',
    tags: ['stretched fabric', 'hidden treatment', 'integrated wall', 'soffit', 'bass trap in wall', 'room within room', 'space saving'],
    sections: [
      { h: 'The principle: two jobs, one depth', html: `
        <p class="lead">Isolation needs <b>airtight mass with decoupling</b>. Treatment needs <b>porous or resonant material exposed to the room’s sound</b>. They can share the same depth if you stack them in the right order: isolation outside, treatment inside, a breathable finish in front.</p>
        ${svgFlow([['Structure', 'Existing wall or slab'], ['Isolation cavity', 'Gap + independent studs + wool'], ['Airtight leaf', '2–3 layers gypsum, sealed — never perforated'], ['Treatment zone', 'Air + porous wool, traps, diffusers'], ['Visible finish', 'Stretched fabric, slats, perforated panel']])}
        <div class="callout warn">Never make the isolation leaf do the treatment job by drilling it, using perforated board for it, or leaving it unsealed. The moment air passes through the isolation leaf, the isolation collapses (see the 1 % gap rule).</div>` },
      { h: 'Space-saving strategies that work', html: `
        <ul>
          <li><b>Treatment lives in the room-side cavity.</b> Build the inner isolation leaf, then a second light frame 100–300 mm in front of it filled with wool and faced with fabric. The air + wool depth is now a broadband bass trap across the whole wall area — far more area than a few panels.</li>
          <li><b>Corners become soffits.</b> Fill wall–ceiling and wall–wall corners with deep triangular traps behind the fabric line — the space is awkward anyway.</li>
          <li><b>Ceiling cavity.</b> Between an isolated ceiling and a stretched-fabric false ceiling 200–400 mm lower, fill with wool: a huge, invisible cloud and bass trap.</li>
          <li><b>Speaker soffits</b> as front-wall structure: the baffle wall gives flush-mounting; the volume around and behind is packed with absorption.</li>
          <li><b>Furniture as traps</b>: sofa backs, bookshelves, equipment racks and window seats built as absorbers or diffusers.</li>
          <li><b>Cavity insulation does double duty</b>: the wool in the isolation cavity improves isolation (damps the mass–air–mass resonance) — but it does not treat the room. Count it only for isolation.</li>
        </ul>
        <div class="callout data">Example: a 300 mm wall budget. Separate approach — 200 mm double-stud wall + 100 mm panels on 30 % of the wall. Integrated approach — 150 mm isolation (clips + 2 layers) + 150 mm fabric-faced wool cavity over 100 % of the wall. The integrated wall gives similar STC and several times the low-frequency absorption area. Try it in the Treatment Simulator → Hidden & integrated tab.</div>` },
      { h: 'Designing a room with invisible treatment', html: `
        <ol class="steps">
          <li><b>Plan the acoustic layout first</b> (bass traps, reflection points, rear wall strategy) — exactly as for a visible design.</li>
          <li><b>Draw a fabric line</b> around the room at a constant depth (e.g. 150–300 mm from the isolation leaf). Everything acoustic sits behind it.</li>
          <li><b>Zone the depth</b>: corners → deep porous traps; front wall → deep broadband; first reflection points → absorbers; rear wall → diffusers or deep absorption; areas that should stay reflective → solid panels behind the fabric (yes — fabric can hide reflective areas too).</li>
          <li><b>Choose the finish</b>: acoustically transparent fabric (if you can blow through it easily, it’s transparent), slatted timber (Helmholtz behaviour — design it!), micro-perforated panels, or seamless acoustic plaster.</li>
          <li><b>Hide diffusers carefully</b>: fabric is transparent to sound, so a QRD behind fabric still diffuses. Use tight, light fabric and keep it off the wells.</li>
          <li><b>Lighting, sockets, HVAC grilles</b> are integrated into the fabric frames — plan their positions before fabric goes on.</li>
          <li><b>Fire and hygiene</b>: fabric and wool must meet local fire ratings; enclose wool so fibres don’t shed.</li>
        </ol>` },
      { h: 'Visual guide', html: `<div id="dr-hidden"></div><div id="dr-hybrid" style="margin-top:12px"></div>`, viz: (h) => { h.innerHTML = DR.hiddenRoom({ L: 6.2, W: 4.6, depth: 0.25 }) + DR.hybridWall({ base: 'masonry', isoGap: 0.03, stud: 0.07, leafLayers: 2, airTreat: 0.05, treat: 0.12, label: 'integrated wall' }); } },
    ],
    quiz: [
      { q: 'Where should the treatment sit in an integrated wall?', opts: ['Inside the isolation cavity', 'On the room side of the airtight leaf', 'Outside the building', 'In place of the gypsum'], a: 1, why: 'The airtight leaf must stay sealed; treatment goes in front of it.' },
      { q: 'Does a QRD diffuser still work behind acoustically transparent fabric?', opts: ['No', 'Yes, if the fabric is acoustically transparent', 'Only below 100 Hz', 'Only if painted'], a: 1, why: 'Transparent fabric passes the sound to the wells and back.' },
    ],
  };

  const L = window.LESSONS;
  const iModes = L.findIndex((l) => l.id === 'modes');
  L.splice(iModes + 1, 0, MODES_TREAT);
  const iFl = L.findIndex((l) => l.id === 'flanking');
  L.splice(iFl + 1, 0, INTEGRATED);
})();
