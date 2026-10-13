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
| **Academy** | Two course tracks. Acoustics: 20 chapters, from what sound is to concert halls, plus measurement, audio engineering and project method. Each chapter has interactive visuals, mentor notes, common mistakes, alternatives, rule-of-thumb data and a quiz. Progress is saved in your browser. Audio & Sound Systems: 14 courses on signals and levels, microphones and loudspeakers, consoles and signal flow, digital audio, networking (Dante, AVB/Milan, AES67, MADI), DSP, crossovers and alignment, amplifiers and 100 V systems, arrays, PA design, installation, tuning with RTA and transfer functions, feedback, and production workflows. |
| **Physics Lab** | A real-time 2-D FDTD wave tank (diffraction, interference, standing waves, QRD and absorbers), plus simulations of waves and wavelength, phase and comb filtering (with audio), room modes (audible), reverberation, porous absorption, Helmholtz resonators, mass law and double walls, vibration transmissibility, ISO 226 equal-loudness curves, sampling and aliasing, hall shapes and control-room reflections. |
| **Hear the Decibel** | A sound-level ladder, dB steps you can hear, and a "through the wall" simulator: a synthesised band, pink noise or your own audio file, filtered by the predicted octave-band TL of each construction. |
| **Room Analyzer** | Modes and the Bonello and Bolt checks; predicted bass response at the seat (modal summation); a seat-quality map; RT per band with Sabine and Eyring against a target for the room type; reflection points; a diagnosis; and a quantified treatment plan with a before/after prediction. |
| **Measure** | A live microphone RTA, a clap or balloon-pop RT60 (T20 per octave, using Schroeder integration) and a signal generator. |
| **Room Doctor** | Symptom → causes → how to confirm → fixes → alternatives. |
| **Absorber Designer** | Porous panels with an air gap (Miki model, random incidence), a reverse-design depth finder, and membrane, perforated, slotted and single-Helmholtz absorbers, each with a build sheet. |
| **Diffuser Designer** | QRD, PRD and 2-D skyline diffusers with depths, cut lists, a polar response compared with a flat panel, and the diffusion coefficient against frequency. |
| **Soundproofing** | A layer-by-layer wall builder (Sharp model plus a structural-bridging path) giving STC, Rw (C; Ctr) and a field estimate. Also a composite door/window/gap calculator, an octave-band neighbour-noise planner against NC curves, and an assembly library. |
| **Floating Floors & Vibration** | Springs, pads, mats and floated timber floors, including the trapped-air spring, mount loading and spacing, and insertion loss. Also covers machine isolation. |
| **PA & System Designer** | Venue coverage maps with draggable loudspeakers, headroom against programme level, delay times for fills and towers, subwoofer arrays (cardioid, end-fire), crossover alignment, a tuning lab on a simulated transfer-function analyser, EQ and compressor with audio, amp/cable/100 V/ceiling-spacing/gain-before-feedback calculators, and venue recipes. |
| **Signal Flow & Networks** | Analog vs digital pipelines for live, worship, conference, studio, broadcast and theatre; device catalogue; connectors and level converter; protocol comparison, bandwidth calculator and network checklist; clocking and latency. |
| **Calculators** | About 25 everyday calculators: levels, speakers and timing, SBIR, RT, barriers, HVAC velocity, ventilation, and units. |
| **Reference** | Design guides for 13 room types, 12 DIY build sheets, case studies, Masters & Schools of thought (with your own notes), a materials library, a glossary and a formula sheet. |

You can switch between 9 colour schemes and set a custom accent colour. The typeface is Avenir Next where installed, falling back to Nunito Sans.

## Accuracy notes

The physics engine (`js/physics.js`) is checked against textbook values and typical published lab results. To run the checks:

```bash
node tests/physics.test.js
node tests/audio.test.js
```

The predictions are meant for design guidance and learning. For final designs, use manufacturers' tested data and measure on site.
