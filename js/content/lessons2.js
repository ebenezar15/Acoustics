/* ==========================================================================
   Academy curriculum, part 2 (chapters 11–20).
   ========================================================================== */
window.LESSONS = (window.LESSONS || []).concat([
  /* ===================================================================== */
  {
    id: 'flanking', n: 11, title: 'Flanking Paths & Weak Links', level: 'Core', mins: 25,
    summary: 'Doors, windows, ducts, outlets and structure: where real-world isolation is lost.',
    tags: ['flanking', 'doors', 'windows', 'seals', 'sound lock', 'composite'],
    sections: [
      { h: 'Sound takes every path', html: `
        <p>The partition between two rooms is only one route. Sound also travels through the floor slab and up the other side (structure-borne flanking), through a shared ceiling void, along ducts, through back-to-back outlets, under doors and around window frames. Field performance is typically 3–7 dB below lab — and 15 dB+ below when flanking is ignored.</p>
        <svg class="diagram" viewBox="0 0 640 230" role="img" aria-label="Flanking paths diagram">
          <rect x="10" y="40" width="620" height="150" fill="none" stroke="currentColor" opacity=".5"/>
          <rect x="310" y="40" width="20" height="150" fill="var(--muted)" opacity=".5"/>
          <rect x="10" y="190" width="620" height="16" fill="var(--muted)" opacity=".35"/>
          <rect x="10" y="24" width="620" height="16" fill="var(--muted)" opacity=".25"/>
          <circle cx="120" cy="120" r="12" fill="var(--accent)"/><text x="100" y="150">source</text>
          <path d="M135 120 H 450" stroke="var(--accent)" stroke-width="3" marker-end="url(#ar)"/><text x="345" y="112">1 direct</text>
          <path d="M120 135 V 198 H 520 V 150" stroke="var(--c3)" stroke-width="2.5" fill="none" marker-end="url(#ar)"/><text x="360" y="222">2 floor slab (structure-borne)</text>
          <path d="M120 105 V 32 H 500 V 80" stroke="var(--accent2)" stroke-width="2.5" fill="none" marker-end="url(#ar)"/><text x="350" y="18">3 ceiling void / roof</text>
          <path d="M260 160 h 120" stroke="var(--c5)" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#ar)"/><text x="235" y="182">4 outlet / duct / door gap</text>
          <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>
        </svg>` },
      { h: 'Doors', html: `
        <ul>
          <li>Hollow-core door ≈ STC 18–20; solid-core ≈ 24–28; with full perimeter compression seals and an automatic drop seal ≈ 30–35; certified acoustic door sets 40–55+.</li>
          <li>The <b>sound lock</b>: two sealed solid doors with a small absorbent vestibule between. Often the most cost-effective route to high isolation at an opening.</li>
          <li>Doors on a floated floor need the threshold detailed so the door, frame and seals don’t bridge floated and structural slabs.</li>
          <li>Test seals with a torch in a dark room or a piece of paper: if light or paper passes, sound does.</li>
        </ul>` },
      { h: 'Windows', html: `
        <ul>
          <li>Thermal double glazing (4/16/4) is acoustically mediocre: its mass–air–mass resonance sits around 200–300 Hz, right in the musical range. ≈ STC 28–32.</li>
          <li>Better: <b>laminated</b> glass (the interlayer damps coincidence), <b>different thicknesses</b> per pane (so coincidence dips don’t align), and a <b>large air gap</b> (100–200 mm+) with absorbent reveals.</li>
          <li>Studio windows: two separately framed laminated panes in independent walls, sealed into each leaf, gap ≥ 150 mm. Angling one pane slightly helps control reflections and the visual, but contributes little to isolation itself.</li>
          <li>Secondary glazing on an existing window is often the cheapest large improvement for traffic noise.</li>
        </ul>` },
      { h: 'Ducts, pipes and services', html: `
        <p>A duct connecting two rooms is a speaking tube. Use lined ducts with bends, silencers or <b>crosstalk attenuators</b>, and route supply/return so rooms don’t share an unlined path. Pipes must pass through walls in oversized sleeves sealed with resilient material — never rigidly fixed to both leaves.</p>
        <p>Electrical: never place outlet boxes back-to-back; offset by at least one stud bay and wrap with putty pads. Conduits should not bridge isolated leaves — use flexible connections at the break.</p>` },
      { h: 'The weakest link rule, quantified', html: `
        <div class="callout data">A 10 m² wall of STC 55 with a 2 m² door of STC 25: composite ≈ 32. Upgrade the door to STC 45: composite ≈ 50. Upgrading the <i>wall</i> to STC 65 instead: composite still ≈ 32. Always fix the weakest element first.</div>`, viz: (h) => {
          const st = A.controls(h, [
            { key: 'wall', label: 'Wall TL', type: 'range', min: 20, max: 75, step: 1, value: 55, unit: 'dB' },
            { key: 'door', label: 'Door TL', type: 'range', min: 10, max: 60, step: 1, value: 25, unit: 'dB' },
            { key: 'gap', label: 'Unsealed gap area', type: 'range', min: 0, max: 200, step: 1, value: 0, unit: 'cm²' },
          ]);
          const out = A.el('div', { class: 'stats' }); h.appendChild(out);
          const upd = () => {
            const els = [{ area: 8, tl: st.wall }, { area: 2, tl: st.door }];
            if (st.gap > 0) els.push({ area: st.gap / 10000, tl: 0 });
            const c = P.compositeTL(els);
            out.innerHTML = A.statBox('Composite TL', A.fmt(c, 1) + ' dB', P.stcDescribe(c)) + A.statBox('Wall alone', st.wall + ' dB') + A.statBox('Lost to weak links', A.fmt(st.wall - c, 1) + ' dB', '', st.wall - c > 6 ? 'bad' : 'good');
          };
          h.addEventListener('input', upd); upd();
        } },
    ],
    quiz: [
      { q: 'Cheapest big upgrade for a room with STC-55 walls and a hollow-core door?', opts: ['Thicker walls', 'A solid, fully sealed door (or a sound lock)', 'Foam on the door', 'More insulation'], a: 1, why: 'The door dominates the composite.' },
      { q: 'Why is standard thermal double glazing mediocre for music?', opts: ['Too heavy', 'Its mass–air–mass resonance sits in the low-mid range', 'It blocks light', 'Glass absorbs bass'], a: 1, why: 'Thin gaps put f₀ around 200–300 Hz.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'vibration', n: 12, title: 'Vibration & Structure-Borne Noise', level: 'Advanced', mins: 30,
    summary: 'Single-degree-of-freedom isolation, transmissibility, springs vs rubber, impact noise.',
    tags: ['vibration', 'transmissibility', 'natural frequency', 'springs', 'neoprene', 'impact noise', 'IIC'],
    sections: [
      { h: 'The mass on a spring', html: `
        <p>Any mass on a resilient support has a natural frequency f<sub>n</sub>. Below it, vibration passes straight through; near it, vibration is <b>amplified</b>; above √2·f<sub>n</sub> it is reduced, increasingly so with frequency.</p>
        <div class="formula"><span class="lbl">Natural frequency</span>f<sub>n</sub> = (1/2π)·√(k/m) &nbsp;=&nbsp; 15.76 / √δ &nbsp; (δ = static deflection in mm)</div>
        <div class="formula"><span class="lbl">Transmissibility (damping ratio ζ, r = f/f<sub>n</sub>)</span>T = √[ (1 + (2ζr)²) / ((1 − r²)² + (2ζr)²) ]</div>
        <p>The static deflection formula is beautifully practical: an isolator that compresses 25 mm under its load gives f<sub>n</sub> ≈ 3.2 Hz; 5 mm gives ≈ 7 Hz; 1 mm gives ≈ 16 Hz — whatever the mass.</p>`, viz: 'transmissibility' },
      { h: 'Choosing an isolator', html: `
        <div class="table-wrap"><table>
          <tr><th>Isolator</th><th>Typical static deflection</th><th>f<sub>n</sub></th><th>Pros</th><th>Cons</th></tr>
          <tr><td>Steel springs</td><td>25–50 mm (up to 100)</td><td>2–4 Hz</td><td>Lowest f<sub>n</sub>, stable, durable</td><td>Little damping; high-frequency “surge” transmission — pair with a rubber pad</td></tr>
          <tr><td>Neoprene / rubber mounts</td><td>3–10 mm</td><td>6–12 Hz (higher dynamically)</td><td>Damped, cheap, compact</td><td>Dynamic stiffness 1.2–2× static; creep; must be loaded in range</td></tr>
          <tr><td>Microcellular PU bearings</td><td>3–10 mm</td><td>6–15 Hz</td><td>Engineered load ranges, predictable</td><td>Product-specific design charts</td></tr>
          <tr><td>Mineral wool / resilient mats</td><td>1–5 mm</td><td>15–40 Hz (with screed)</td><td>Continuous support; simple</td><td>Higher f<sub>n</sub>; impact noise focus</td></tr>
          <tr><td>Air springs</td><td>—</td><td>1–3 Hz</td><td>Very low f<sub>n</sub></td><td>Cost, maintenance; specialist use</td></tr>
        </table></div>
        <div class="callout warn">An under-loaded rubber pad is a stiff pad. Pads are designed for a load range — if your floor is too light for the pads chosen, the deflection is tiny and f<sub>n</sub> high. Size the <b>number</b> of mounts to put each in its optimum load range.</div>
        <div class="callout mentor">Rule of thumb: f<sub>n</sub> ≤ ⅓ of the lowest disturbing frequency gives ≈ 85–90 % isolation. For a kick drum (fundamental ~50–60 Hz) aim for f<sub>n</sub> ≲ 15–20 Hz; for 25 Hz organ pedal or HVAC plant, single-digit f<sub>n</sub> — i.e. springs.</div>` },
      { h: 'Machinery', html: `
        <p>Forcing frequency = rpm / 60. A fan at 1 450 rpm → 24 Hz. For 90 % isolation you need f<sub>n</sub> ≈ 7 Hz → 5 mm deflection. Add inertia bases for heavy rotating plant to lower the centre of gravity and stabilise springs; use flexible connectors on every duct and pipe — a rigid pipe short-circuits any isolator.</p>` },
      { h: 'Impact noise', html: `
        <p>Footsteps, dropped objects and drum pedals inject energy directly into the structure. Airborne ratings (STC, Rw) don’t capture this. Impact ratings: <b>IIC</b> (ASTM, higher is better) and <b>L′nT,w</b> (ISO, lower is better). Soft floor finishes (carpet) help mid/high impacts; only floated floors help low-frequency thuds.</p>` },
    ],
    quiz: [
      { q: 'An isolator deflecting 9 mm under load has f_n ≈', opts: ['2 Hz', '5.3 Hz', '9 Hz', '15 Hz'], a: 1, why: '15.76/√9 = 5.25 Hz.' },
      { q: 'At f = f_n, an isolator…', opts: ['Isolates best', 'Amplifies vibration', 'Has no effect', 'Absorbs sound'], a: 1, why: 'Resonance: transmissibility > 1.' },
      { q: 'Isolation begins above…', opts: ['f_n', '√2·f_n', '2·f_n', '10·f_n'], a: 1, why: 'T < 1 only when r > √2.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'floating', n: 13, title: 'Floating Floors & Room-Within-Room', level: 'Advanced', mins: 40,
    summary: 'Concrete jack-up slabs on springs, pads and mats; floated timber floors; perimeter details and calculations.',
    tags: ['floating floor', 'jack-up', 'springs', 'pucks', 'room within room', 'air spring', 'dynamic stiffness'],
    sections: [
      { h: 'Why float a floor?', html: `
        <p>Walls and ceilings can be decoupled with studs and clips, but the floor carries everything — and drums, amps and subwoofers couple straight into it. A floating floor is a heavy layer supported on resilient elements, isolated from the structure and from the surrounding walls. Build the inner walls and ceiling <b>on</b> the floated floor and you have a true room-within-room.</p>
        <svg class="diagram" viewBox="0 0 680 250" role="img" aria-label="Floating floor build-ups">
          <text x="10" y="18" font-weight="700">A · Concrete slab on springs / pads (jack-up)</text>
          <rect x="10" y="80" width="320" height="18" fill="var(--muted)" opacity=".55"/><text x="335" y="94" class="mut">structural slab</text>
          <rect x="30" y="36" width="280" height="26" fill="var(--accent)" opacity=".75"/><text x="40" y="54" fill="var(--accent-ink)">100–150 mm floated concrete</text>
          ${[60, 130, 200, 270].map((x) => `<path d="M${x} 62 l6 3 -12 3 12 3 -12 3 6 3" stroke="var(--accent2)" stroke-width="2" fill="none"/>`).join('')}
          <text x="10" y="116" class="mut">air cavity 50–150 mm, wool-filled · perimeter resilient strip</text>
          <rect x="10" y="36" width="8" height="44" fill="var(--c4)"/>
          <text x="350" y="18" font-weight="700">B · Floated screed on resilient mat</text>
          <rect x="350" y="80" width="320" height="18" fill="var(--muted)" opacity=".55"/>
          <rect x="350" y="66" width="320" height="14" fill="var(--c4)" opacity=".7"/><text x="360" y="77" font-size="11">resilient layer (wool / rubber)</text>
          <rect x="350" y="40" width="320" height="26" fill="var(--accent)" opacity=".75"/><text x="360" y="58" fill="var(--accent-ink)">50–75 mm sand-cement screed</text>
          <text x="10" y="150" font-weight="700">C · Floated timber floor on pucks / pads</text>
          <rect x="10" y="222" width="320" height="18" fill="var(--muted)" opacity=".55"/>
          ${[40, 110, 180, 250, 300].map((x) => `<rect x="${x}" y="206" width="18" height="16" fill="var(--accent2)"/>`).join('')}
          <rect x="10" y="194" width="320" height="12" fill="var(--c3)" opacity=".75"/><text x="20" y="204" font-size="10">timber sleepers / joists</text>
          <rect x="10" y="168" width="320" height="10" fill="var(--accent)" opacity=".8"/><rect x="10" y="178" width="320" height="10" fill="var(--accent)" opacity=".6"/><rect x="10" y="188" width="320" height="6" fill="var(--muted)"/>
          <text x="335" y="182" class="mut">2× ply/OSB + gypsum, glued</text>
          <text x="350" y="150" font-weight="700">D · Room-within-room</text>
          <rect x="360" y="222" width="300" height="18" fill="var(--muted)" opacity=".55"/>
          <rect x="380" y="202" width="260" height="14" fill="var(--accent)" opacity=".75"/>
          ${[400, 470, 540, 610].map((x) => `<path d="M${x} 216 l4 2 -8 2 8 2 -4 1" stroke="var(--accent2)" stroke-width="2" fill="none"/>`).join('')}
          <rect x="384" y="160" width="10" height="42" fill="var(--c3)"/><rect x="626" y="160" width="10" height="42" fill="var(--c3)"/>
          <rect x="384" y="156" width="252" height="8" fill="var(--c3)"/>
          <rect x="364" y="150" width="8" height="72" fill="var(--muted)"/><rect x="648" y="150" width="8" height="72" fill="var(--muted)"/>
          <text x="420" y="188" font-size="11">inner walls + ceiling sit on floated slab</text>
        </svg>` },
      { h: 'The design calculation, step by step', html: `
        <ol class="steps">
          <li><b>Define the lowest frequency to isolate.</b> Bass guitar and kick: ~40 Hz. Organ, cinema LFE, HVAC: 20–25 Hz.</li>
          <li><b>Pick a target f<sub>n</sub></b> ≤ ⅓–½ of that. For 40 Hz → f<sub>n</sub> ≈ 10–15 Hz (pads may do). For 25 Hz → 5–8 Hz (springs).</li>
          <li><b>Compute the load.</b> Dead load: concrete ≈ 24 kg/m² per 10 mm (2400 kg/m³); timber/OSB ≈ 6–7 kg/m² per 10 mm; gypsum ≈ 8–10 kg/m² per 12.5 mm. Add the inner walls and ceiling if they sit on the floor, plus a realistic share of the live load (people, gear, piano).</li>
          <li><b>Select isolators</b> whose rated load and deflection give the target f<sub>n</sub>; compute the number required = total load / optimum load per mount; check spacing (typically 300–600 mm for timber floors, 0.6–1.2 m for concrete on springs).</li>
          <li><b>Account for the trapped-air spring.</b> A sealed cavity of depth d adds stiffness s′<sub>air</sub> ≈ 0.10–0.14 / d MN/m³. A 50 mm cavity adds ≈ 2–3 MN/m³ — which under a 100 mm slab alone gives ≈ 15 Hz, swamping a 3 Hz spring system! Use deeper cavities (100–150 mm+), fill with low-density wool, and combine: f<sub>total</sub> = √(f<sub>mounts</sub>² + f<sub>air</sub>²).</li>
          <li><b>Check isolation</b>: theoretical insertion loss ≈ 40·log₁₀(f/f<sub>n</sub>) above √2·f<sub>n</sub>; in real buildings expect less (base flexibility, slab resonances, flanking) — EN 12354-2 uses ≈ 30·log₁₀(f/f₀) for floating screeds.</li>
        </ol>
        <div class="callout data"><b>Worked example.</b> 100 mm concrete floated floor (240 kg/m²) + 40 kg/m² live load = 280 kg/m². Springs at 25 mm static deflection → f<sub>n</sub> ≈ 3.2 Hz. Cavity 100 mm wool-filled → s′ ≈ 1.0 MN/m³ → f<sub>air</sub> ≈ 160·√(1.0/280) ≈ 9.6 Hz. Combined ≈ 10 Hz. Isolation at 63 Hz ≈ 30–40 dB theoretical. With a 50 mm cavity: f<sub>air</sub> ≈ 13.5 Hz → combined ≈ 14 Hz — a significant loss caused by the air alone.</div>
        <p>Open the <a href="#/floors">Floating Floor Designer</a> to run these numbers for your own project.</p>` },
      { h: 'Construction methods', html: `
        <h4>Concrete jack-up slab (springs or pads in housings)</h4>
        <p>Isolator housings are cast into the slab on a bond-breaker sheet over the structural floor. After curing, the slab is jacked up by turning screws in each housing until the design air gap is reached. Precise, adjustable, and the professional standard for high-isolation studios.</p>
        <h4>Poured on pads (“lost formwork”)</h4>
        <p>Rubber/PU pads support a plywood deck, a waterproof membrane goes on top, and concrete is poured. Perimeter isolation board keeps the slab off the walls. Cheaper; no adjustment.</p>
        <h4>Floating screed on a continuous resilient layer</h4>
        <p>Mineral wool floor board or rubber mat, membrane, then a 50–75 mm screed. Great for impact noise; f₀ typically 15–40 Hz, so limited for low bass.</p>
        <h4>Floated timber floor (common in home studios)</h4>
        <p>Rod Gervais’ <i>Home Recording Studio: Build It Like the Pros</i> popularised carefully engineered floated timber floors and room-within-room construction for home builders: sleepers on resilient pads, two layers of OSB/ply glued and screwed in staggered seams, often with gypsum between. Lighter than concrete, so f<sub>n</sub> is higher — fine for vocals, guitar and mixing; marginal for drums unless mass is increased.</p>` },
      { h: 'Details that make or break it', html: `
        <ul>
          <li><b>Perimeter</b>: a continuous resilient strip (10–25 mm) between floated floor and every wall, sealed with flexible sealant. One rigid contact (a screw, a tile, a hardened mortar drip) can cost 10–20 dB.</li>
          <li><b>Walls on the floor or floor inside the walls?</b> Inner walls standing on the floated slab give the best room-in-room. Walls on the structural slab with the floor floating inside is simpler but the floor-wall junction is a flanking path.</li>
          <li><b>Ceilings</b>: either supported on the inner walls (independent joists) or hung from the structure on spring/neoprene hangers rated for the load.</li>
          <li><b>Doors and thresholds</b>: the inner door frame belongs to the inner room; the threshold gap gets a compressible seal.</li>
          <li><b>Services</b>: flexible connections for every pipe, duct and conduit crossing the isolation break.</li>
          <li><b>Structural engineer</b>: a 150 mm floated slab adds ~360 kg/m². Always confirm the building can carry it.</li>
        </ul>` },
    ],
    quiz: [
      { q: 'Why can a shallow sealed cavity spoil a spring-floated slab?', opts: ['Moisture', 'The trapped air acts as a stiff spring in parallel, raising f_n', 'It makes the slab heavier', 'It reduces fire rating'], a: 1, why: 's′air ≈ 0.1–0.14/d MN/m³ — large for small d.' },
      { q: 'Each 10 mm of concrete adds about…', opts: ['2.4 kg/m²', '24 kg/m²', '240 kg/m²', '10 kg/m²'], a: 1, why: '2400 kg/m³ × 0.01 m = 24 kg/m².' },
      { q: 'The most common way a floated floor fails is…', opts: ['Too heavy', 'A rigid bridge at the perimeter or through services', 'Too many isolators', 'Too much insulation'], a: 1, why: 'Short circuits bypass the isolators.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'criteria', n: 14, title: 'Background Noise, NC & HVAC', level: 'Advanced', mins: 25,
    summary: 'Noise criteria curves, quiet air-conditioning design and electrical noise.',
    tags: ['NC', 'NR', 'RC', 'HVAC', 'duct', 'silencer', 'background noise'],
    sections: [
      { h: 'Noise criteria curves', html: `
        <p>Background noise is specified with curves: <b>NC</b> (Noise Criteria, Beranek), <b>RC</b> (Room Criteria — also checks spectrum balance for rumble and hiss) and <b>NR</b> (Noise Rating, ISO). A room meets NC-20 if its octave-band spectrum lies under the NC-20 curve in every band.</p>`,
        viz: (h) => {
          const st = A.controls(h, [{ key: 'src', label: 'Example spectrum', type: 'select', value: 'quiet', options: [['quiet', 'Well-designed studio'], ['hvac', 'Typical office HVAC'], ['rumble', 'Rumbly plant room nearby']] }]);
          const specs = { quiet: [42, 33, 24, 18, 14, 11, 9, 8], hvac: [58, 52, 46, 41, 38, 34, 30, 26], rumble: [68, 60, 46, 36, 30, 26, 22, 18] };
          const out = A.el('div', { class: 'stats' }); h.appendChild(out);
          const cv = V.ncPlot(h, () => specs[st.src], { caption: 'Spectrum plotted over NC curves. The rating is set by the band that pokes highest.' });
          const upd = () => { const s = specs[st.src]; out.innerHTML = A.statBox('NC rating', 'NC-' + P.ncRating(s)) + A.statBox('NR rating', 'NR-' + P.nrRating(s)) + A.statBox('Overall', A.fmt(P.dBA(s), 0) + ' dBA'); cv.redraw(); };
          h.addEventListener('change', upd); upd();
        } },
      { h: 'Targets', html: `<div class="table-wrap"><table><tr><th>Space</th><th>Target</th></tr>${D.NC_TARGETS.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div>` },
      { h: 'Quiet air-conditioning — the rules', html: `
        <ol class="steps">
          <li><b>Low velocity.</b> Noise rises steeply with air speed (~ 50–60·log₁₀ of velocity). Rules of thumb for NC 15–20 rooms: main ducts ≤ 3–4 m/s, branches ≤ 2–2.5 m/s, final run and grilles ≤ 1.5 m/s. Use large ducts and many diffusers.</li>
          <li><b>Distance & lining.</b> Locate plant far away; isolate it on springs with flexible connectors; use internally lined duct for the final runs.</li>
          <li><b>Silencers and plenums.</b> A lined plenum box (“baffle box”) or attenuator at every room entry. Crosstalk silencers between rooms sharing a duct.</li>
          <li><b>Isolation break.</b> Ducts entering a room-in-room need flexible sections across the isolation gap and must penetrate each leaf with sealed resilient collars.</li>
          <li><b>Split systems</b>: inner units have fans — choose low-noise models, run at low speed, consider ducted fan-coils located outside the room.</li>
        </ol>
        <div class="callout mentor">Most “silent” studios fail commissioning on HVAC, not walls. Budget the HVAC as part of the acoustic design from day one, and get the mechanical engineer to quote NC levels, not just cooling capacity.</div>` },
      { h: 'Electrical & lighting noise', html: `<p>Avoid dimmers that buzz (phase-cut with cheap chokes), magnetic ballasts and noisy LED drivers. Separate technical power and lighting circuits, star-grounding and balanced lines prevent hum. Transformers and UPS units belong outside critical rooms.</p>` },
    ],
    quiz: [
      { q: 'If a room’s spectrum touches NC-30 at 125 Hz but is under NC-20 elsewhere, its rating is…', opts: ['NC-20', 'NC-25', 'NC-30', 'NC-15'], a: 2, why: 'The worst band sets the rating.' },
      { q: 'The single most effective HVAC noise strategy is…', opts: ['Bigger fans', 'Low air velocity in ducts and grilles', 'Metal grilles', 'Higher pressure'], a: 1, why: 'Flow noise rises steeply with velocity.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'control-room', n: 15, title: 'Control Room Design', level: 'Advanced', mins: 45,
    summary: 'LEDE, RFZ, non-environment and other philosophies; geometry, monitors, symmetry and targets.',
    tags: ['control room', 'LEDE', 'RFZ', 'non-environment', 'CID', 'soffit', '38% rule', 'mixing room'],
    sections: [
      { h: 'What a control room must do', html: `
        <p>A control room is a measuring instrument. Mixes made in it must <b>translate</b> to every other system. That requires: a flat, smooth low-frequency response at the mix position; early reflections controlled so stereo imaging and tonal balance are accurate; a short, even decay; low noise; and perfect left–right symmetry.</p>` },
      { h: 'Design philosophies', html: `
        <div class="table-wrap"><table>
          <tr><th>Approach</th><th>Origin</th><th>Core idea</th><th>Character</th></tr>
          <tr><td><b>LEDE</b> (Live End – Dead End)</td><td>Don & Carolyn Davis with Chips Davis, late 1970s</td><td>Absorptive front around the speakers removes early reflections; a live, diffusive rear returns delayed, diffuse energy after a clean initial time-delay gap</td><td>Clear imaging with some sense of space</td></tr>
          <tr><td><b>RFZ</b> (Reflection-Free Zone)</td><td>Developed in the 1980s</td><td>Use geometry (splayed front walls/ceiling) and absorption to steer first reflections away from a zone around the listener; diffuse the rear</td><td>Precise, open, uses less absorption</td></tr>
          <tr><td><b>Non-environment</b></td><td>Tom Hidley; developed and documented extensively by Philip Newell</td><td>Hard front wall with flush-mounted monitors, everything else highly absorptive down to low frequencies; hard floor. The room contributes almost nothing.</td><td>Very direct, fast, revealing; large wall depths needed</td></tr>
          <tr><td><b>CID</b> (Controlled Image Design)</td><td>Bob Walker, BBC R&D, 1990s</td><td>Shape and treat surfaces so reflections arriving within the critical window are sufficiently attenuated or redirected</td><td>Analytical, geometry-driven</td></tr>
          <tr><td><b>Full-band neutral</b> (broadband-everything)</td><td>Contemporary small-room practice</td><td>Aim for the room to be acoustically neutral across the whole band — remove the room’s signature while avoiding a deadened feel</td><td>Needs deep, low-frequency-effective treatment on most surfaces</td></tr>
          <tr><td><b>Measured, small-room approach</b></td><td>Controlled listening research on loudspeakers and small rooms</td><td>In small rooms the room is a modal system below ~300 Hz; treat bass with multiple subs, positioning and traps; use good, well-behaved speakers; some lateral reflections can be pleasant if the speakers are good</td><td>Evidence-based, flexible</td></tr>
        </table></div>
        <div class="callout mentor">No philosophy wins outright. All good rooms share: symmetry, a controlled early-reflection field, smooth bass, and low noise. Pick the approach that suits the room’s size and your budget — RFZ/LEDE suit mid-sized rooms; non-environment needs depth for very thick walls; small home rooms benefit most from measurement-based bass management plus broadband treatment.</div>` },
      { h: 'Geometry & monitor placement', html: `
        <ul>
          <li><b>Symmetry</b> about the centre line, left to right, is non-negotiable. Asymmetric rooms smear the stereo image.</li>
          <li>Usually face the <b>long</b> dimension (rear wall further away, side walls farther from the speakers), though narrow rooms may work better across.</li>
          <li>Listener at ~<b>38 % of room length</b> from the front wall as a starting point — it avoids the deepest axial nulls at 25/50 %. Measure and adjust.</li>
          <li><b>Equilateral triangle</b> between speakers and listener (≈ 60° included angle), tweeters aimed at the ears, at ear height (~1.2 m seated).</li>
          <li><b>Soffit / flush-mounting</b> removes front-wall SBIR and baffle-step loss, improving bass and imaging. The baffle wall must be massive and rigid, and the speaker decoupled from it.</li>
          <li>Console/desk: tilt or shape to avoid strong desk reflections; keep the meter bridge low; consider monitors slightly above the desk tilted down.</li>
        </ul>`, viz: 'reflections' },
      { h: 'Treatment plan for a typical mid-sized room', html: `
        <ol class="steps">
          <li><b>Bass traps</b> in all available corners (vertical wall–wall corners, wall–ceiling corners) — 300 mm+ deep porous traps, or tuned traps for measured problem modes.</li>
          <li><b>Front wall</b>: thick absorption behind the speakers (or soffit-mount).</li>
          <li><b>Side-wall first reflection points</b>: 100 mm+ broadband absorbers, or angle panels (RFZ).</li>
          <li><b>Ceiling cloud</b> over the mix position, spaced off the ceiling.</li>
          <li><b>Rear wall</b>: if ≥ ~3 m behind you, diffusion over thick absorption; if closer, deep absorption (200–300 mm+).</li>
          <li><b>Measure</b> (REW etc.), adjust listening position, then refine with targeted traps and minimal EQ.</li>
        </ol>
        <div class="callout data"><b>Typical targets.</b> Frequency response ±3 dB (1/6-oct smoothed) above ~200 Hz, ±5 dB below; RT/decay even across bands; early reflections in first ~15–20 ms ≥ 15–20 dB below direct (ETC); background ≤ NC-20; modal decay at 40–200 Hz &lt; ~ 300–400 ms.</div>` },
    ],
    quiz: [
      { q: 'The core idea of an RFZ room is…', opts: ['Make the room dead everywhere', 'Steer early reflections away from the listening zone with geometry and absorption', 'Use only diffusion', 'Remove all bass'], a: 1, why: 'Reflection-free zone around the listener.' },
      { q: 'Why is the listener often placed at ~38 % of the room length?', opts: ['Golden ratio aesthetics', 'Avoids the deep axial nulls at 25 % and 50 %', 'It is closest to the speakers', 'Building codes'], a: 1, why: 'Avoids low-order axial nulls.' },
      { q: 'Flush-mounting monitors mainly solves…', opts: ['Flutter echo', 'Front-wall SBIR and baffle-step loss', 'Isolation', 'HVAC noise'], a: 1, why: 'The baffle becomes the boundary.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'rooms', n: 16, title: 'Live Rooms, Booths, Rehearsal & Cinema', level: 'Advanced', mins: 30,
    summary: 'Design principles for every other studio space and home theatres.',
    tags: ['live room', 'vocal booth', 'drum room', 'rehearsal', 'home theater', 'podcast'],
    sections: [
      { h: 'Live rooms', html: `
        <ul>
          <li><b>Volume is king</b>: bigger rooms have lower Schroeder frequencies, denser modes and more natural ambience. Ceiling height 3–4 m+ makes a dramatic difference.</li>
          <li>Non-parallel walls or diffusing surfaces kill flutter; avoid symmetrical “boxy” shapes.</li>
          <li><b>Variable acoustics</b>: hinged panels (absorptive one side, reflective/diffusive the other), heavy curtains on tracks, movable gobos. One room can go from drum-friendly to string-quartet bloom.</li>
          <li>Hard floor (timber on floated slab is classic) with rugs for flexibility.</li>
        </ul>` },
      { h: 'Vocal & voice-over booths', html: `
        <p>Small booths have their lowest modes in the vocal range (a 1.5 m booth: first axial ≈ 114 Hz), giving the infamous “boxy” sound. Thin foam makes it worse — it removes the highs and leaves the low-mids.</p>
        <ul>
          <li>Minimum practical size ≈ 1.5 × 1.8 m floor, as tall as possible; 2 × 2.5 m is far better.</li>
          <li>Line all walls and ceiling with <b>deep broadband absorption</b> (100–150 mm wool with air gap), corners thicker still.</li>
          <li>Isolation: decoupled walls, sealed door, quiet ventilation through lined baffle-box silencers (booths get hot fast).</li>
          <li>Window to the control room: double, laminated, different thicknesses.</li>
        </ul>` },
      { h: 'Drum and rehearsal rooms', html: `
        <p>A drum kit produces 105–120 dB with energy down to 40–50 Hz. Isolation dominates: room-in-room on a floated floor for any attached building. Acoustically, drums like some liveliness — a hard floor and diffusive upper walls — with heavy LF absorption to keep the kick and toms controlled. Rehearsal rooms need even more LF absorption because bass amps and kick build up modes quickly.</p>` },
      { h: 'Home cinema & screening rooms', html: `
        <ul>
          <li>Short, even decay (≈ 0.2–0.4 s for typical home rooms); strongly control first reflections from side walls for the front speakers.</li>
          <li>Rear and surround walls: mix of absorption and diffusion for envelopment.</li>
          <li><b>Multiple subwoofers</b> (2–4) with careful placement and integration are the single biggest upgrade for even bass across seats.</li>
          <li>Avoid seats against the rear wall (bass build-up) or at the room’s centre (nulls).</li>
          <li>Isolation matters both ways — cinema peaks exceed 105 dB in the LFE channel.</li>
          <li>Follow the integrator guidelines of your chosen reference (e.g. Dolby’s home-theatre layout recommendations, CEDIA/CTA RP22 for immersive home cinema performance).</li>
        </ul>` },
      { h: 'Podcast & broadcast rooms', html: `<p>Speech close to a mic in a room with early reflections sounds hollow. Absorb broadband reflections around each talker (ceiling above the table, walls nearby), use directional dynamic mics close to the mouth, and keep HVAC and computer fans quiet. RT 0.2–0.3 s; NC-20 to 25.</p>` },
    ],
    quiz: [
      { q: 'Why does thin foam make small vocal booths sound “boxy”?', opts: ['It adds bass', 'It absorbs highs but leaves the low-mid modes untouched', 'It reflects', 'It is too heavy'], a: 1, why: 'Booth modes are in the low-mid range; thin foam only works high up.' },
      { q: 'The biggest upgrade for even home-cinema bass across seats is usually…', opts: ['A bigger single sub', 'Multiple well-placed subwoofers', 'Diffusers', 'Carpet'], a: 1, why: 'Multiple subs cancel modal variation across seats.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'halls', n: 17, title: 'Concert Halls & Auditoria', level: 'Advanced', mins: 45,
    summary: 'Shoebox vs vineyard, Beranek’s parameters, ITDG, clarity, envelopment and variable acoustics.',
    tags: ['concert hall', 'shoebox', 'vineyard', 'ITDG', 'C80', 'D50', 'IACC', 'Beranek', 'bass ratio', 'auditorium'],
    sections: [
      { h: 'What makes a great hall', html: `
        <p>Leo Beranek surveyed conductors, musicians and critics about dozens of halls and correlated rankings with measurable parameters. The best-rated halls — Vienna’s Musikverein, Amsterdam’s Concertgebouw, Boston Symphony Hall — share a long, narrow <b>shoebox</b> form, rich early lateral reflections, mid-frequency RT around 2 s occupied and a warm bass ratio.</p>
        <div class="table-wrap"><table>
          <tr><th>Parameter</th><th>Meaning</th><th>Typical preferred values (symphonic)</th></tr>
          <tr><td>RT<sub>mid</sub> (occupied)</td><td>Reverberance</td><td>1.8–2.2 s</td></tr>
          <tr><td>EDT</td><td>Perceived reverberance</td><td>≈ RT, slightly longer is fine</td></tr>
          <tr><td>C80</td><td>Clarity: early (0–80 ms) vs late energy</td><td>≈ −2 to +2 dB</td></tr>
          <tr><td>D50</td><td>Definition (speech)</td><td>&gt; 0.5 for speech</td></tr>
          <tr><td>G</td><td>Strength (loudness vs free field at 10 m)</td><td>≈ +4 to +6 dB</td></tr>
          <tr><td>LF / LEF</td><td>Early lateral energy fraction (width)</td><td>&gt; 0.2</td></tr>
          <tr><td>1 − IACC<sub>E</sub></td><td>Spaciousness (ears hear different signals)</td><td>Higher is better (≈ 0.6–0.7)</td></tr>
          <tr><td>ITDG</td><td>Initial time-delay gap at main floor centre</td><td>≤ ~20 ms (intimacy)</td></tr>
          <tr><td>BR</td><td>Bass ratio (warmth)</td><td>1.1–1.25</td></tr>
          <tr><td>ST<sub>early</sub></td><td>Stage support (ensemble hearing)</td><td>≈ −14 to −12 dB</td></tr>
        </table></div>`, viz: 'hall' },
      { h: 'Hall forms', html: `
        <ul>
          <li><b>Shoebox</b>: narrow (≈ 20–25 m), tall, rectangular; strong lateral reflections; size limited (~1700–2600 seats) before seats get too far away.</li>
          <li><b>Vineyard / terraced</b>: audience in terraces around the stage (Berlin Philharmonie, 1963, architect Hans Scharoun with acoustician Lothar Cremer). Terrace walls act as reflectors to restore early reflections; intimacy for large audiences.</li>
          <li><b>Fan-shaped</b>: maximises sightlines and seats, but splayed side walls throw reflections away from the centre — poor envelopment unless corrected with reflectors.</li>
          <li><b>Horseshoe</b>: traditional opera; tiered boxes bring the audience close; shorter RT for text.</li>
        </ul>
        <div class="callout mentor">Volume per seat is a quick sanity check: concert halls ≈ 8–12 m³ per seat to reach ~2 s with a full audience; drama theatres 4–6 m³; lecture rooms 3–5 m³. The audience is the biggest absorber in the room — design the seats so that the empty-hall RT stays close to the occupied value (upholstered seats with perforated undersides).</div>` },
      { h: 'Shaping, focusing and echo control', html: `
        <ul>
          <li><b>Concave surfaces focus</b> — domes, curved rear walls and circular plans create hot spots and echoes. Make them convex, diffusive, or absorptive.</li>
          <li><b>Rear walls</b> facing the stage return late, strong reflections (echo) — tilt, diffuse or absorb them.</li>
          <li><b>Balconies</b>: keep overhang depth ≤ the opening height (≈ 1 : 1 for concert halls, up to 2 : 1 for theatres) so seats underneath still receive reverberant energy.</li>
          <li><b>Overstage canopies / reflectors</b> provide early reflections for musicians and front seats; their height is often adjustable.</li>
          <li><b>Diffusion at scale</b>: modern halls use surface relief over large areas — Hamburg’s Elbphilharmonie (2017, acoustics by Yasuhisa Toyota / Nagata Acoustics) famously uses about 10 000 uniquely milled gypsum-fibre panels.</li>
        </ul>` },
      { h: 'Variable acoustics', html: `
        <p>Multi-purpose halls must serve amplified music, speech and orchestra. Tools: retractable banners and curtains, adjustable canopies, coupled reverberation chambers with operable doors (Dallas’s Meyerson Symphony Center by Russell Johnson / Artec is a well-known example), and electro-acoustic enhancement systems that use microphones, processing and distributed loudspeakers to extend RT.</p>` },
      { h: 'Speech auditoria & worship spaces', html: `
        <p>For speech, intelligibility (STI ≥ 0.6) drives design: moderate RT, strong early reflections from ceilings close to the talker, absorptive rear walls to kill echo, and directional loudspeakers aimed at absorptive audience areas. For mixed worship, design a mid-band RT that supports congregational singing (1.2–1.8 s) and use steerable column/line-array loudspeakers to keep speech clear.</p>` },
    ],
    quiz: [
      { q: 'Why do shoebox halls rank so highly?', opts: ['They are cheapest', 'Narrow parallel side walls give strong early lateral reflections', 'They have the shortest RT', 'They seat the most people'], a: 1, why: 'Lateral energy → envelopment and width.' },
      { q: 'A C80 of +8 dB in a symphony hall suggests…', opts: ['Very reverberant', 'Very clear, possibly dry for orchestra', 'Echo problems', 'Low bass'], a: 1, why: 'High C80 = lots of early vs late energy.' },
      { q: 'Concave rear walls are a problem because they…', opts: ['Absorb too much', 'Focus reflections into hot spots and echoes', 'Diffuse too much', 'Lower RT'], a: 1, why: 'Concave surfaces focus sound.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'measurement', n: 18, title: 'Measurement & Analysis', level: 'Advanced', mins: 30,
    summary: 'Impulse responses, sweeps, waterfalls, RT and ETC — and how to measure a room properly.',
    tags: ['measurement', 'REW', 'impulse response', 'sweep', 'waterfall', 'ETC', 'calibration'],
    sections: [
      { h: 'Tools', html: `
        <ul>
          <li><b>Measurement microphone</b>: small omnidirectional condenser with an individual calibration file (e.g. the many affordable USB or XLR measurement mics available).</li>
          <li><b>Interface & software</b>: Room EQ Wizard (REW) is free and the de-facto standard for studios and home cinema. Professional suites add ISO 3382 and building-acoustics features.</li>
          <li><b>Calibrated SPL meter</b> or a calibrator (94 dB @ 1 kHz) to set absolute levels.</li>
          <li>For building acoustics: a powerful omnidirectional source (dodecahedron), a tapping machine for impact tests, and Class 1 sound level meters.</li>
        </ul>` },
      { h: 'The impulse response is everything', html: `
        <p>Excite the room with a logarithmic (exponential) sine sweep, deconvolve, and you obtain the <b>impulse response</b> — the room’s complete acoustic fingerprint between that speaker and that mic. Every analysis comes from it:</p>
        <ul>
          <li><b>Frequency response</b> (with smoothing — 1/3 octave for overview, 1/24–1/48 to see modes).</li>
          <li><b>Waterfall / spectral decay</b>: which frequencies ring — modes show as long ridges.</li>
          <li><b>RT (T20/T30, EDT)</b> per band via Schroeder backward integration.</li>
          <li><b>ETC</b> (energy–time curve): spot individual early reflections, measure their delay and level → find the surface responsible (delay × 343 = extra path).</li>
          <li><b>Step response</b>: time alignment of drivers and subs.</li>
        </ul>
        <div class="callout mentor">Turn reflections into geometry: an ETC spike 3.5 ms after the direct sound means a path 1.2 m longer. Walk around with a tape measure and you’ll find the culprit — desk, side wall, ceiling or a glass window.</div>` },
      { h: 'Good practice', html: `
        <ol class="steps">
          <li>Measure each speaker separately, then together; then the sub(s) alone and integrated.</li>
          <li>Use several positions around the listening seat (e.g. a 30–50 cm grid) — single-point bass data misleads.</li>
          <li>Mic pointed at the ceiling (90° cal) or at the speaker (0° cal) consistent with its calibration file.</li>
          <li>Measure at a moderate level well above background noise; keep the room quiet; turn off HVAC for RT tests and note it.</li>
          <li>Save every measurement with notes. Change one thing at a time and re-measure.</li>
        </ol>
        <p>Try a simplified version on the <a href="#/measure">Measure</a> page: a live spectrum analyser and a clap-test RT60 estimator using your device’s microphone.</p>` },
    ],
    quiz: [
      { q: 'An ETC reflection 5 ms after the direct sound implies an extra path of…', opts: ['0.5 m', '1.7 m', '5 m', '17 m'], a: 1, why: '0.005 × 343 ≈ 1.7 m.' },
      { q: 'To see individual room modes, use smoothing of…', opts: ['1 octave', '1/3 octave', '1/24 octave or finer', 'none needed'], a: 2, why: 'Heavy smoothing hides narrow modal peaks and dips.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'audio', n: 19, title: 'Audio Engineering Essentials', level: 'Core', mins: 35,
    summary: 'Signal flow, gain staging, microphones, digital audio, monitoring and loudness.',
    tags: ['gain staging', 'microphone', 'sample rate', 'bit depth', 'LUFS', 'monitoring', 'subwoofer'],
    sections: [
      { h: 'Signal flow and gain staging', html: `
        <p>Source → microphone → preamp → (processing) → converter → DAW → monitoring. Each stage has a noise floor and a clipping point; <b>gain staging</b> keeps the signal comfortably between.</p>
        <ul>
          <li>Pro line level +4 dBu, consumer −10 dBV. Mismatches give either noise or distortion.</li>
          <li>At 24-bit, record with peaks around −12 to −6 dBFS and averages around −18 dBFS (a common alignment for 0 VU). There’s no benefit to recording “hot”.</li>
          <li>Plug-ins modelling analogue gear often expect ≈ −18 dBFS input.</li>
        </ul>` },
      { h: 'Digital audio', html: `<p>Sample rate sets the highest frequency (fs/2); bit depth sets dynamic range (~6 dB per bit). 44.1/48 kHz at 24-bit is the professional norm; higher rates can ease filter design and some processing.</p>`, viz: 'sampling' },
      { h: 'Microphones', html: `
        <div class="table-wrap"><table>
          <tr><th>Type</th><th>Character</th><th>Typical uses</th></tr>
          <tr><td>Dynamic (moving coil)</td><td>Robust, handles high SPL, less detailed top</td><td>Guitar cabs, snare, broadcast voice, live vocals</td></tr>
          <tr><td>Large-diaphragm condenser</td><td>Sensitive, detailed, needs phantom power</td><td>Vocals, acoustic instruments, room mics</td></tr>
          <tr><td>Small-diaphragm condenser</td><td>Accurate, consistent off-axis</td><td>Overheads, acoustic guitar, measurement</td></tr>
          <tr><td>Ribbon</td><td>Smooth top, figure-8, fragile</td><td>Brass, guitar amps, room, Blumlein pairs</td></tr>
        </table></div>
        <ul>
          <li><b>Polar patterns</b>: omni (no proximity effect, hears the room), cardioid (rejects rear), figure-8 (rejects sides — useful against side reflections), hypercardioid.</li>
          <li><b>Proximity effect</b>: directional mics boost bass when close.</li>
          <li><b>3:1 rule</b>: when multiple mics capture multiple sources, keep each mic-to-mic distance ≥ 3× source-to-mic distance to limit comb filtering.</li>
          <li>The room is part of the recording — a great mic in a boxy room records a boxy sound.</li>
        </ul>` },
      { h: 'Monitoring & loudness', html: `
        <ul>
          <li>Calibrate monitoring level so decisions are repeatable — a common small-room reference is ≈ 79–83 dB SPL (C-weighted, slow) per speaker from −20 dBFS RMS pink noise; film rooms use 85 dB (large rooms) by convention.</li>
          <li><b>Subwoofer integration</b>: choose the crossover, set level with measurements, align phase/delay at the crossover, and place the sub using measurements — not the manual’s photo.</li>
          <li><b>Loudness</b> is measured in LUFS (ITU-R BS.1770). Broadcast: EBU R128 −23 LUFS, ATSC A/85 −24 LKFS. Streaming services normalise playback (many around −14 LUFS integrated).</li>
        </ul>` },
    ],
    quiz: [
      { q: 'Dynamic range of 24-bit audio is about…', opts: ['48 dB', '96 dB', '144 dB', '200 dB'], a: 2, why: '6.02 × 24 + 1.76 ≈ 146 dB theoretical.' },
      { q: 'The 3:1 rule helps avoid…', opts: ['Clipping', 'Comb filtering between mics', 'Hum', 'Aliasing'], a: 1, why: 'Distance keeps leakage ≥ ~9 dB lower.' },
    ],
  },

  /* ===================================================================== */
  {
    id: 'workflow', n: 20, title: 'The Acoustician’s Method', level: 'Advanced', mins: 25,
    summary: 'From brief to commissioning: the order of operations professionals follow on every project.',
    tags: ['workflow', 'project', 'brief', 'site survey', 'commissioning', 'budget'],
    sections: [
      { h: 'The sequence', html: `
        <ol class="steps">
          <li><b>Brief & targets.</b> What happens in each room, when, how loud? Who are the neighbours? Write targets: isolation per octave (or STC/Rw + LF target), background NC, RT per band, frequency response tolerance, budget.</li>
          <li><b>Site survey.</b> Measure background noise (day/night, L90 and Leq per octave), existing isolation, structure (slab type, load capacity — get an engineer), ceiling height, services routes, vibration sources (rail, traffic, plant).</li>
          <li><b>Isolation design.</b> Required TL = source level − allowable receiver level + correction for room absorption and area. Choose constructions per partition, then floors and ceilings, then doors, windows, services. Detail every junction.</li>
          <li><b>Geometry & layout.</b> Room shapes and proportions, symmetry, monitor placement, sightlines, workflow, machine rooms away from critical spaces.</li>
          <li><b>Treatment.</b> Bass control first, then early reflections, then decay and diffusion. Leave room for adjustment.</li>
          <li><b>HVAC & electrical.</b> Quiet air at low velocity, silencers, isolation breaks, technical power.</li>
          <li><b>Construction supervision.</b> Inspect cavities before closing (debris bridges!), check seals, isolator loads and gaps, door seals.</li>
          <li><b>Commissioning.</b> Measure isolation, background noise, RT, frequency response; tune positions, traps and EQ; document.</li>
        </ol>
        <div class="callout mentor">Isolation decisions are permanent and expensive to change; treatment decisions are cheap and reversible. Spend your thinking time where mistakes cost the most.</div>` },
      { h: 'Budget tiers', html: `
        <div class="table-wrap"><table>
          <tr><th>Tier</th><th>Isolation</th><th>Treatment</th><th>Typical result</th></tr>
          <tr><td>Bedroom / existing room</td><td>Seal gaps, solid door with seals, window plug</td><td>DIY broadband panels, corner superchunks, cloud</td><td>Huge improvement in mix accuracy; neighbours still hear loud music</td></tr>
          <tr><td>Converted space (garage/basement)</td><td>Decoupled inner leaf (clips or independent studs), 2–3 layers drywall, sound-lock doors, floated timber floor</td><td>Planned treatment, tuned traps, diffusion where space allows</td><td>STC 55–65; serious home studio</td></tr>
          <tr><td>Commercial studio</td><td>Room-in-room on floated concrete, acoustic doors/windows, engineered HVAC</td><td>Designer room (RFZ/LEDE/non-environment), measured and tuned</td><td>STC 65–80; world-class rooms</td></tr>
        </table></div>` },
      { h: 'Your checklist', html: `
        <ul>
          <li>☐ Targets written per room</li><li>☐ Background noise measured</li><li>☐ Structural load checked</li><li>☐ Isolation per partition calculated incl. LF</li><li>☐ Flanking paths reviewed (floor, ceiling, services)</li><li>☐ Doors/windows specified</li><li>☐ HVAC velocities & silencers</li><li>☐ Room ratios and layout checked</li><li>☐ Treatment plan (bass → reflections → decay)</li><li>☐ Construction inspection plan</li><li>☐ Commissioning measurements</li>
        </ul>` },
    ],
    quiz: [
      { q: 'Which should be designed first?', opts: ['Diffusers', 'Isolation', 'Paint colour', 'EQ'], a: 1, why: 'Isolation is structural and hard to change later.' },
      { q: 'Why inspect cavities before closing walls?', opts: ['Fire inspection only', 'Debris or stray screws can bridge leaves and destroy decoupling', 'To add more insulation', 'Not needed'], a: 1, why: 'Mechanical bridges short-circuit isolation.' },
    ],
  },
]);
