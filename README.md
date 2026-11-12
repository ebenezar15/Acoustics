# Acoustica — Sound · Space · Silence

An interactive academy and design studio for audio, acoustics, soundproofing, and studio and hall design. It works like having an experienced acoustician beside you: it explains the physics with animations, gives you the numbers, and walks you through real design decisions and the alternatives.

## Run it

It's a static app with no build step and no dependencies:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

You can also open `index.html` directly. The microphone features need `localhost` or HTTPS.

## What's inside

| Area | Highlights |
|---|---|
| **Academy** | Two course tracks. Acoustics: 25 chapters (including fundamentals, resonance & harmonics; RT60, octave bands & measurement language; treating room modes; hidden & integrated design; flat response), from what sound is to concert halls, plus measurement, audio engineering and project method. Each chapter has interactive visuals, mentor notes, common mistakes, alternatives, rule-of-thumb data and a quiz. Progress is saved in your browser. Audio & Sound Systems: 14 courses on signals and levels, microphones and loudspeakers, consoles and signal flow, digital audio, networking (Dante, AVB/Milan, AES67, MADI), DSP, crossovers and alignment, amplifiers and 100 V systems, arrays, PA design, installation, tuning with RTA and transfer functions, feedback, and production workflows. |
| **Physics Lab** | A real-time 2-D FDTD wave tank (diffraction, interference, standing waves, QRD and absorbers), plus simulations of waves and wavelength, phase and comb filtering (with audio), room modes (audible), reverberation, porous absorption, Helmholtz resonators, mass law and double walls, vibration transmissibility, ISO 226 equal-loudness curves, sampling and aliasing, hall shapes and control-room reflections — and a **Hum, Buzz & Grounding** lab (cable-as-transformer field map, ground-loop area, pin-1 problem, wall-wart distance, noise identification and a step-by-step Hum Detective). |
| **Hear the Decibel** | A sound-level ladder, dB steps you can hear, and a "through the wall" simulator: a synthesised band, pink noise or your own audio file, filtered by the predicted octave-band TL of each construction. |
| **Room Predictor** | From room dimensions alone: ranked problem frequencies (coincident, isolated or long-ringing modes, with the nearest musical note), a card per problem room mode with its pressure map and ranked fixes (seat move, corner traps, a tuned membrane or Helmholtz trap specified for that frequency, EQ), a bass-evenness zone map with the best seat, and treatment placed on a plan and on unfolded wall elevations. One click opens the design in the Treatment Simulator. |
| **Treatment Simulator** | Drag corner traps, tuned membrane and Helmholtz traps, panels, diffusers and clouds into a room. See each mode's decay change, the modal overlap widen and the bass at the seat smooth out. A problem finder suggests each target frequency and the best spot for a trap. Also covers reflections and diffusion, and a planner for hidden or integrated isolation-plus-treatment. |
| **Room Analyzer** | Modes and the Bonello and Bolt checks; predicted bass response at the seat (modal summation); a seat-quality map; RT per band with Sabine and Eyring against a target for the room type; reflection points; a diagnosis; and a quantified treatment plan with a before/after prediction. |
| **Measure** | A live microphone RTA, a clap or balloon-pop RT60 (T20 per octave, using Schroeder integration) and a signal generator. |
| **Room Doctor** | Symptom → causes → how to confirm → fixes → alternatives. |
| **Absorber Designer** | Choice of porous model (Delany–Bazley, Miki, Komatsu) and incidence (normal / field / random); Maa micro-perforated panels; membrane traps including panel bending stiffness; methods and references tab. Previously: | Porous panels with an air gap (Miki model, random incidence), a reverse-design depth finder, and membrane, perforated, slotted and single-Helmholtz absorbers, each with a build sheet. |
| **Diffuser Designer** | QRD, PRD and 2-D skyline diffusers with depths, cut lists, a polar response compared with a flat panel, and the diffusion coefficient against frequency. |
| **Soundproofing** | A layer-by-layer wall builder (Sharp model plus a structural-bridging path) giving STC, Rw (C; Ctr) and a field estimate. Also a composite door/window/gap calculator, an octave-band neighbour-noise planner against NC curves, and an assembly library. |
| **Floating Floors & Vibration** | Springs, pads, mats and floated timber floors, including the trapped-air spring, mount loading and spacing, and insertion loss. Also covers machine isolation. |
| **PA & System Designer** | Venue coverage maps with draggable loudspeakers, headroom against programme level, delay times for fills and towers, subwoofer arrays (cardioid, end-fire), crossover alignment, a tuning lab on a simulated transfer-function analyser, EQ and compressor with audio, amp/cable/100 V/ceiling-spacing/gain-before-feedback calculators, and venue recipes. |
| **Signal Flow & Networks** | Analog vs digital pipelines for live, worship, conference, studio, broadcast and theatre; device catalogue; connectors and level converter; protocol comparison, bandwidth calculator and network checklist; clocking and latency. |
| **Calculators** | About 25 everyday calculators: levels, speakers and timing, SBIR, RT, barriers, HVAC velocity, ventilation, and units. |
| **Case studies** | 24 cases. Project cases follow problem → diagnosis → solution → result, with before/after numbers and charts computed by the physics engine. |
| **Reference** | Design guides for 13 room types, 12 DIY build sheets, case studies, Masters & Schools of thought (with your own notes), a materials library, a glossary and a formula sheet. |

Length units can be switched between metric (auto), mm, cm, m, inches and feet. Build pages include dimensioned, parametric drawings with cut lists. You can switch between 9 colour schemes and set a custom accent colour. The typeface is Avenir Next where installed, falling back to Nunito Sans.

## Accuracy notes

The physics engine (`js/physics.js`) is checked against textbook values and typical published lab results. To run the checks:

```bash
node tests/physics.test.js
node tests/audio.test.js
```

The predictions are meant for design guidance and learning. For final designs, use manufacturers' tested data and measure on site.

### Hum, buzz & grounding (Audio track, course A8A)

A practical course on ground loops and zero loop area wiring: why ground is for safety first, how premises wiring induces ground voltage (length × current × frequency; twisting line/neutral ≈ 60 dB), loop area and EMF = 2πfBA, routing audio beside power, balanced lines and CMRR, the pin-1 problem and AES48, the Hummer test, magnetic neighbours (1/r³), a troubleshooting decision tree, ten real-world recipes (home studio, guitar rig, live FOH, church dimmers, conference AV, DJ booth, home cinema/CATV, podcast/USB, OB truck, stadium) and a new-build checklist. Includes three case studies, Room Doctor entries, glossary and formulas. Concepts after Muncy (1995), Whitlock & Fox and AES48, written in our own words; safety notes throughout (never lift the safety earth; building wiring is for licensed electricians).

### Studio Design Master Class (third Academy track, M1–M28)

A practical curriculum from first principles to finished buildings, with easy, design-ready theory and an interactive widget in nearly every course:

- **First principles** — acoustic myths & the scientific method (myth-buster deck), why DIY design goes wrong (cost-of-mistakes timeline), matter & energy (sound speed in gases/liquids/solids, Snell’s law outdoors, reflected/absorbed/transmitted energy), sound parameters & the inverse-square law, how absorption works (frictional, diffractive, diaphragmatic, resonant — animated), absorption coefficients, RT and lab testing (simulated ASTM C423 reverberation-room test with E795 mountings).
- **Isolation & rooms** — requirement planner (source → allowed NC → required isolation per octave vs. real constructions), walls, doors & windows (composite-wall “weak link” simulator), floating floors, large-room and small-room acoustics (flutter echo you can hear).
- **Studio rooms** — control rooms, tracking rooms, music booths, voice-over booths (booth sizing tool), Foley & ADR, treatment designs, gas flow resistivity (test-rig simulator).
- **Systems & plans** — speakers and flush-mounting (boundary-interference tool), electrical wiring & grounding, audio & low-voltage wiring (impedance balance / CMRR), HVAC (duct-velocity & NC estimator), day-lighting, and four dimensioned **studio PLANS** (bedroom, basement, detached, professional facility) with toggleable isolation / treatment / gear / electrical / HVAC layers.

New widgets live in `js/viz-master.js`, plans in `js/plans.js`, content in `js/content/master-1.js` … `master-4.js`, glossary/formulas in `js/content/master-lib.js`. Several new simulations are also available as Physics Lab tabs.

### Questions answered & verified

A set of common acoustics Q&As (pressure vs velocity at walls, λ/4 and λ/2, room fundamentals, pipes, Schroeder, mode spacing, reading measurements, desk orientation, target curves, surround/Atmos layouts, subwoofer placement and alignment, live rooms, floating-floor design) checked against physics and rewritten in plain language. Each claim is marked ✓ correct, ⚠ needs nuance or ✗ incorrect with the correction, and placed in the lesson where it belongs: a new course **6B Pressure, Velocity & Standing Waves**, plus new sections in Small-Room Acoustics, Treating Room Modes, Measurement, Control Rooms, Flat Response, Speakers, Tracking Rooms and Floating Floors. New interactive tools (`js/viz-qa.js`, Physics Lab → “Standing Waves & Room Set-up”): standing-wave simulator, quarter-wave finder, mode ladder with peak identifier, desk-orientation planner, target-curve builder with REW house-curve export, surround/Atmos layout with delays and trims, sub/mains alignment, floating-floor designer (pads, dynamic stiffness, air spring, coupling).

### Acoustic doors, seals, studio windows, resonance & budget isolation (Master Class M9A)

How to plan and build doors, seals and glass between rooms: door anatomy, seal types and leak tests, sound locks, studio-window rules, where resonances occur (mass–air–mass, coincidence, triple-leaf, cavity) and how to move or damp them, and the cheapest upgrades per decibel. Animated SVG diagrams plus four tools in `js/viz-doors.js` (Physics Lab → “Doors, Windows & Resonance”): door builder, studio-window lab, resonance finder and a budget isolation optimiser. Costs and ratings are simplified teaching estimates.

### Design playbook, room-to-room connections and standards (Master Class M29–M31)

- **M29 The Studio Design Playbook** — interactive checklist (home / professional, saved locally), animated order of work, rules-of-thumb sheets, twenty mistakes to avoid, cost method with an indicative cost calculator, and the cheapest effective upgrades.
- **M30 Connecting Studio and Control Room** — what crosses the wall, pathways that keep the isolation (offset panels, sealed conduits, trenches), near/far/other-building strategies, panels and patchbays, talkback and cue, the interconnection standards (AES48, AES3, AES10, AES67, ISO/IEC 11801 …).
- **M31 Acoustic Standards Explained** — ISO 3382, 354, 11654, 10140, 16283, 717, 12354, 1996, BS 8233, BS 4142, Approved Document E and more, with a searchable explorer and an animated ISO 717-1 rating fit.
- New sections in existing lessons: calculating target modes from room dimensions, length-wise vs width-wise layouts, diffusers in small rooms.
- Tools in `js/viz-playbook.js` (Physics Lab → “Design Playbook Tools”). Costs and ratings are indicative teaching estimates; always check the current edition of any standard.

### Factors & aesthetics, activated carbon, and studio design in India (Master Class M29A, M18A, M32)

- **M29A What Shapes a Room's Sound** — the factors that affect acoustics and treatment performance, a treatment design method, and finishes that look good without losing absorption (factor board and finish designer tools).
- **M18A Activated Carbon for Low-Frequency Absorption** — evidence vs marketing, where it helps (inside sealed resonant traps), materials, build and tuning process, with a carbon-trap simulator. Multipliers are indicative.
- **M32 Studio Design in India** — RCC/masonry buildings, local materials, climate, air-conditioning, power and earthing, codes and noise limits, process, indicative budgets in rupees, with an India wall builder.
- Tools in `js/viz-factors.js` (Physics Lab → “Factors, Finishes, Carbon & India Walls”).

### Speaker stands, the studio desk, and mode-by-mode trap placement (Master Class M20A)

- **M20A Building Speaker Stands and the Studio Desk** — stand height, mass, damping and decoupling; five build recipes; the desk bounce and desk design; ergonomics; subwoofer and equipment isolation.
- **Which mode, which place** — new section in Treating Room Modes, Small-Room Acoustics and Room Treatment Designs: where each mode family has its pressure peaks, best and useless trap positions, worked example.
- Tools in `js/viz-stands.js` (Physics Lab → “Stands, Desk & Trap Placement”): stand builder, desk-bounce lab, trap placer with before/after modal decay.

### Sound redirectors and absorber calculation (Master Class M18B)

Angled reflector panels (redirectors / deflectors) that steer reflections past the listener: the mirror rule (tilt θ → reflection turns 2θ), the limiting frequency set by panel size, step-by-step design, flat / convex / slatted / wedge-backed hybrids, and how to size porous, membrane, slot, perforated and quarter-wave absorbers for a target frequency. Tools in `js/viz-redirect.js` (Physics Lab → “Redirectors & Absorber Calculator”).

### Acoustic hangers and waveguides (Master Class M18C, M18D)

- **M18C Acoustic Hangers** — hanging bass traps (absorbent-wrapped boards hung in a deep cavity): theory, sizing rules, build, placement, verification; and isolation hangers for suspended ceilings, ducts and clouds.
- **M18D Waveguides** — shared theory (plane waves, cut-off, tapers, quarter-wave), absorbing waveguide traps and how to design them, loudspeaker waveguides and directivity matching, and what constant directivity means for room treatment.
- Tools in `js/viz-hangers.js` (Physics Lab → “Hangers & Waveguides”). Hanger and waveguide-trap absorption curves are indicative — measure before and after.

### Recording, Mixing & Mastering track, listening science, wave physics, building types

A fourth Academy track and further lessons written from general knowledge of the field (no text taken from any book; no authors named):

- **Recording, Mixing & Mastering (R1–R10)** — microphones in practice, stereo and surround techniques, miking instruments, running a session, DAW/MIDI/sync, building a mix (balance and panning, EQ and masking, dynamics, space), monitoring, loudness and mastering.
- **Listening science (4A–4C)** — how we hear rooms and reflections, judging loudspeakers from measurements, audio facts and myths with blind testing.
- **Wave physics (5A)**, **Diffuser design in depth (M18E)**, **Workbook of practice problems (21)**.
- **Acoustics by building type (M33)**, **Building services noise and project workflow (M34)**, **Speech intelligibility, voice alarm and assistive listening (A13A)**, **Stage monitoring, in-ears and intercom (A13B)**.
- Thirty new tools in `js/viz-recording.js`, `js/viz-mixing.js`, `js/viz-psycho.js`, `js/viz-physics2.js`, `js/viz-buildings.js`, grouped in five new Physics Lab tabs.
