// Run: node tests/physics.test.js
const P = require('../js/physics.js');
let fails = 0;
function ok(cond, msg) { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) fails++; }
const near = (a, b, tol) => Math.abs(a - b) <= tol;

// basics
ok(near(P.speedOfSound(20), 343.2, 0.5), 'c(20°C) ≈ 343 m/s');
ok(near(P.dbSum([90, 90]), 93.01, 0.05), '90 dB + 90 dB = 93 dB');
ok(near(P.distanceLoss(1, 2), 6.02, 0.01), 'inverse square −6 dB / doubling');

// room modes
const modes = P.roomModes(5, 4, 2.5, 100);
ok(near(modes.find(m => m.n.join() === '1,0,0').f, 34.3, 0.05), 'axial (1,0,0) of 5 m room = 34.3 Hz');
ok(near(P.schroeder(0.4, 50), 178.9, 0.5), 'Schroeder freq');
ok(P.boltOK(1.6, 1.28, 1) === true && P.boltOK(3, 3, 3) === false, 'Bolt area check');

// RT
ok(near(P.sabine(100, 32.2), 0.5, 0.001), 'Sabine 100 m³, 32.2 sabins = 0.5 s');
ok(P.eyring(100, 130, 0.25) < P.sabine(100, 130 * 0.25), 'Eyring < Sabine');

// porous absorber sanity
const a1 = P.porousAlpha(125, 15000, 0.05), a2 = P.porousAlpha(1000, 15000, 0.05);
console.log('  50mm wool α125', a1.toFixed(2), 'α1k', a2.toFixed(2));
ok(a1 < 0.4 && a2 > 0.8, '50 mm wool: weak at 125, strong at 1k');
const a3 = P.porousAlpha(125, 15000, 0.05, 0.1);
console.log('  50mm + 100mm gap α125', a3.toFixed(2));
ok(a3 > a1 + 0.15, 'air gap boosts LF absorption');
const a4 = P.porousAlpha(125, 10000, 0.1);
console.log('  100mm α125', a4.toFixed(2), 'α250', P.porousAlpha(250, 10000, 0.1).toFixed(2));

// perforated
const po = { t: 0.012, holeD: 0.008, open: P.holeOpenArea(0.008, 0.032), D: 0.1, fillSigma: 10000 };
const f0 = P.perforatedF0(po);
console.log('  perforated f0', f0.toFixed(0), 'open', (po.open*100).toFixed(1)+'%');
ok(f0 > 200 && f0 < 700, 'perforated f0 plausible');
let peak = 0, pf = 0; for (let f = 50; f < 2000; f *= 1.02) { const a = P.perforatedAlpha(f, po); if (a > peak) { peak = a; pf = f; } }
console.log('  peak α', peak.toFixed(2), '@', pf.toFixed(0));
ok(Math.abs(pf / f0 - 1) < 0.35 && peak > 0.6, 'perforated peak near f0');

// membrane
const mf0 = P.membraneF0(5, 0.1);
console.log('  membrane f0 (5 kg/m², 100 mm, filled)', mf0.toFixed(0));
let mp = 0, mpf = 0; for (let f = 30; f < 1000; f *= 1.02) { const a = P.membraneAlpha(f, { m: 5, D: 0.1, fillSigma: 8000 }); if (a > mp) { mp = a; mpf = f; } }
console.log('  membrane peak', mp.toFixed(2), '@', mpf.toFixed(0));
ok(Math.abs(mpf / mf0 - 1) < 0.4, 'membrane peak near formula');

// QRD
ok(P.qrdSequence(7).join() === '0,1,4,2,2,4,1', 'QRD N=7 sequence');
ok(P.primitiveRoots(7).join() === '3,5', 'primitive roots of 7');

// critical frequency
const gy = P.criticalFreq(P.PANELS.gypsum, 0.0127);
console.log('  fc gypsum 12.7mm', gy.toFixed(0), 'glass 6mm', P.criticalFreq(P.PANELS.glass, 0.006).toFixed(0), 'concrete 150', P.criticalFreq(P.PANELS.concrete, 0.15).toFixed(0));
ok(gy > 2000 && gy < 3500, 'gypsum fc ~2.5 kHz');

// STC calibration of assemblies
function wall(l1, l2, d, filled, conn, damping) {
  const L1 = P.leafProps(l1, damping), L2 = P.leafProps(l2, damping);
  const tl = P.STC_BANDS.map(f => P.doubleLeafTL({ leaf1: L1, leaf2: L2, d, filled, conn, damping }, P.exactThird(f)).tl);
  const tlr = P.RW_BANDS.map(f => P.doubleLeafTL({ leaf1: L1, leaf2: L2, d, filled, conn, damping }, P.exactThird(f)).tl);
  return { stc: P.stc(tl), rw: P.rw(tlr) };
}
const g = [{ mat: 'gypsumX', t: 0.0159 }];
const gg = [{ mat: 'gypsumX', t: 0.0159 }, { mat: 'gypsumX', t: 0.0159 }];
const cases = [
  ['wood stud 1+1 empty', wall(g, g, 0.089, false, 'wood'), [32, 36]],
  ['wood stud 1+1 insulated', wall(g, g, 0.089, true, 'wood'), [35, 40]],
  ['steel stud 1+1 insulated', wall(g, g, 0.092, true, 'steel'), [42, 48]],
  ['RC 1+1 insulated', wall(g, g, 0.1, true, 'resilient'), [45, 52]],
  ['staggered 1+1 insul', wall(g, g, 0.14, true, 'staggered'), [45, 51]],
  ['clips 2+2 insul', wall(gg, gg, 0.11, true, 'clips'), [55, 62]],
  ['double stud 1+1 insul', wall(g, g, 0.2, true, 'none'), [52, 60]],
  ['double stud 2+2 insul', wall(gg, gg, 0.2, true, 'none'), [62, 71]],
];
for (const [n, r, [lo, hi]] of cases) ok(r.stc >= lo && r.stc <= hi, `${n}: STC ${r.stc} (Rw ${r.rw.Rw}, C ${r.rw.C}, Ctr ${r.rw.Ctr}) expected ${lo}-${hi}`);

// single leaves
function single(layers) { const L = P.leafProps(layers); return P.stc(P.STC_BANDS.map(f => P.singleLeafTL(L, P.exactThird(f)))); }
const c150 = single([{ mat: 'concrete', t: 0.15 }]);
ok(c150 >= 50 && c150 <= 58, '150 mm concrete STC ' + c150 + ' (expect ~53-55)');
const gl6 = single([{ mat: 'glass', t: 0.006 }]);
ok(gl6 >= 28 && gl6 <= 33, '6 mm glass STC ' + gl6 + ' (expect ~31)');
const gyp1 = single(g);
ok(gyp1 >= 26 && gyp1 <= 31, 'single 16mm gypsum STC ' + gyp1 + ' (expect ~28)');

// composite
ok(near(P.compositeTL([{ area: 9.9, tl: 50 }, { area: 0.1, tl: 0 }]), 20, 0.1), '1% hole → TL ≈ 20 dB');

// vibration
ok(near(P.staticDeflectionFn(25), 3.15, 0.01), '25 mm deflection → 3.15 Hz');
ok(near(P.transmissibility(Math.SQRT2, 0), 1, 1e-9), 'T=1 at r=√2');
ok(near(P.floatingF0(10, 100), 50.6, 0.1), 'floating floor f0');

// NC
ok(P.ncRating(P.NC_CURVES[30]) === 30, 'NC of NC-30 curve = 30');
ok(P.ncRating(P.NC_CURVES[30].map(x => x + 2)) > 30, 'NC raises when exceeded');
ok(near(P.nrRating(P.nrCurve(25)), 25, 1), 'NR round-trip');

// ISO 226 at 1k = phon
ok(near(P.equalLoudness(60)[17][1], 60, 0.5), 'ISO226 1 kHz equals phon');
ok(P.equalLoudness(40)[0][1] > 90, 'ISO226 20 Hz at 40 phon ~ 99 dB');

// modal response finite
const mr = P.modalResponse(5, 4, 2.5, [0.5, 1, 1.2], [3.1, 2, 1.2], 0.4);
ok(mr.every(p => isFinite(p.db)), 'modal response finite');

// diffuser polar
const dp = P.diffuserPolar(P.wellDepths(P.qrdSequence(7), 7, 500), 0.05, 1000);
const flat = P.diffuserPolar([0, 0, 0, 0, 0, 0, 0], 0.05, 1000);
console.log('  diffusion coeff QRD', P.diffusionCoeff(dp).toFixed(2), 'flat', P.diffusionCoeff(flat).toFixed(2));
ok(P.diffusionCoeff(dp) > P.diffusionCoeff(flat), 'QRD diffuses more than flat');

// Schroeder decay
const fs = 8000, T = 0.6, n = fs; const x = new Float32Array(n);
for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * Math.exp(-6.91 * i / fs / T);
const t60 = P.decayFit(P.schroederCurve(x), fs);
ok(near(t60, 0.6, 0.06), 'Schroeder fit recovers T60 ' + t60.toFixed(2));

// modal treatment: a tuned trap at a mode's antinode damps it far more than at its node
{
  const room = { L: 5, W: 4, H: 2.5, alpha: 0.05 };
  const base = P.treatedModes(room, []);
  const m100 = base.find((m) => m.n.join() === '1,0,0');
  const atCorner = P.treatedModes(room, [{ kind: 'membrane', f0: m100.f, x: 0, y: 0, area: 2 }]).find((m) => m.n.join() === '1,0,0');
  const atNode = P.treatedModes(room, [{ kind: 'membrane', f0: m100.f, x: 2.5, y: 0, area: 2 }]).find((m) => m.n.join() === '1,0,0');
  console.log('  T60 (1,0,0): bare', m100.T60.toFixed(2), 'trap at corner', atCorner.T60.toFixed(2), 'trap at node', atNode.T60.toFixed(2));
  ok(atCorner.T60 < m100.T60 * 0.6 && Math.abs(atNode.T60 - m100.T60) < 0.05, 'placement matters: antinode damps, node does nothing');
  const r = P.modalResponseModes(room, base, [0.5, 1, 1.2], [3, 2, 1.2]);
  ok(r.every((p) => isFinite(p.db)), 'treated modal response finite');
}
console.log(fails ? `\n${fails} FAILED` : '\nAll passed');
process.exit(fails ? 1 : 0);
