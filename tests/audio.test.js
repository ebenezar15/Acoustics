// Run: node tests/audio.test.js
const AP = require('../js/audiophys.js');
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const near = (a, b, t) => Math.abs(a - b) <= t;
// peaking EQ gain at centre
ok(near(AP.db(AP.biquadH(AP.biquad('peak', 1000, 6, 1), 1000)), 6, 0.05), 'peak +6 dB at f0');
ok(near(AP.db(AP.biquadH(AP.biquad('peak', 1000, 6, 1), 50)), 0, 0.2), 'peak flat far away');
ok(near(AP.db(AP.biquadH(AP.biquad('lowshelf', 200, 6), 20)), 6, 0.3), 'low shelf +6 at LF');
ok(near(AP.db(AP.biquadH(AP.biquad('highpass', 100, 0, 0.7071), 100)), -3, 0.1), 'HP -3 dB at fc');
// crossovers
const sum = (t, f, inv) => { const lp = AP.analogFilter('lp', t, 1000, f), hp = AP.analogFilter('hp', t, 1000, f); return AP.db(inv ? AP.cx.add(lp, { re: -hp.re, im: -hp.im }) : AP.cx.add(lp, hp)); };
ok([200, 700, 1000, 1400, 5000].every((f) => near(sum('LR4', f), 0, 0.05)), 'LR4 sums flat');
ok(near(AP.db(AP.analogFilter('lp', 'LR4', 1000, 1000)), -6.02, 0.05), 'LR4 −6 dB at fc');
ok(sum('LR2', 1000) < -20 && near(sum('LR2', 1000, true), 0, 0.05), 'LR2 needs polarity inversion to sum flat');
ok(near(AP.db(AP.analogFilter('lp', 'BW2', 1000, 1000)), -3.01, 0.05), 'BW2 −3 dB at fc');
ok(AP.filterOrder('LR4') === 4 && AP.filterOrder('BW3') === 3, 'filter orders');
// cardioid sub: rear sub 1 m behind, delayed d/c, inverted
const d = 1, f = 60, dly = (d / 343) * 1000;
const srcs = [{ x: 0 }, { x: -d, delayMs: dly, pol: -1 }];
const front = AP.db(AP.arrayResponse(srcs, f, 0)), rear = AP.db(AP.arrayResponse(srcs, f, Math.PI));
console.log('  cardioid front', front.toFixed(1), 'rear', rear.toFixed(1));
ok(rear < front - 20, 'gradient cardioid cancels rear');
// end-fire: front source delayed by d/c, same polarity → sums in front
const ef = [{ x: 0, delayMs: dly }, { x: -d }];
ok(near(AP.db(AP.arrayResponse(ef, f, 0)), 6.02, 0.05), 'end-fire sums +6 dB forward');
// electrical
ok(near(AP.parallel([8, 8]), 4, 1e-9) && AP.series([8, 8]) === 16, 'series/parallel');
ok(near(AP.vFromDbu(4), 1.228, 0.002), '+4 dBu = 1.228 V');
ok(near(AP.cvTapZ(100, 10), 1000, 1e-9), '100 V line 10 W tap = 1 kΩ');
ok(near(AP.cableR(50, 2.5), 0.688, 0.001), '50 m 2.5 mm² round trip ≈ 0.69 Ω');
ok(AP.cableLossDb(50, 2.5, 4) < -1.2 && AP.cableLossDb(50, 2.5, 4) > -1.5, 'cable loss 4 Ω ≈ −1.4 dB');
ok(near(AP.ampPower(100, 10, 100, 0), 100, 0.5), 'amp power: 100 dB @10 m with 100 dB/W → 100 W');
ok(near(AP.ceilingSpacing(3, 1.2, 90, 'edge'), 3.6, 0.01), 'ceiling edge-to-edge spacing');
ok(AP.flowMbps(48000, 24, 8, 1) > 9 && AP.flowMbps(48000, 24, 8, 1) < 11, '8 ch flow ≈ 10 Mb/s');
ok(near(AP.pag(10, 3, 0.3, 8, 1, 6), 20 * Math.log10(30 / 2.4) - 6, 1e-9), 'PAG formula');
console.log(fails ? `\n${fails} FAILED` : '\nAll passed');
process.exit(fails ? 1 : 0);
