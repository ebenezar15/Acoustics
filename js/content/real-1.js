/* "In real life" blocks — group 1. Each REAL(id, {...}) adds a worked scene, a step-through
   animated diagram and a practical wrap-up to an existing lesson (see js/real-kit.js). */
(function () {
  const REAL = window.REAL; if (!REAL) return;

  REAL('sound', {
    title: 'the clap in the stairwell',
    plain: 'Sound is air being pushed and pulled very quickly. Nothing travels from the source to you except the push itself, handed from one bit of air to the next at about 343 metres every second.',
    where: 'A concrete stairwell in an apartment block',
    story: `<p>Asha claps once at the bottom of a stairwell. Her friend on the third floor, 20 m away, hears the clap a moment later, followed by a long ringing tail. Neither of them felt any wind. What actually moved?</p>
      <p>Her hands squeezed a thin layer of air. That squeezed layer pushed the next one and sprang back, and the push ran up the stairwell like a nudge passing down a queue. The hard walls kept bouncing it back, which is the ringing.</p>`,
    numbers: [['Distance', '20 m'], ['Speed of sound at 20 °C', '343 m/s'], ['Time to arrive', '20 ÷ 343 ≈ 58 ms'], ['Air movement at a loud clap', 'well under 1 mm']],
    svg: `<svg viewBox="0 0 640 260" aria-label="A clap sends a pressure pulse through air to a listener">
      <rect x="0" y="0" width="640" height="260" fill="none"/>
      <line x1="30" y1="210" x2="610" y2="210" stroke="var(--line)" stroke-width="2"/>
      <circle cx="70" cy="150" r="16" fill="var(--c1)"/><rect x="58" y="166" width="24" height="44" rx="8" fill="var(--c1)"/>
      <text x="70" y="236" text-anchor="middle" font-size="13">claps here</text>
      <circle cx="570" cy="150" r="16" fill="var(--c2)"/><rect x="558" y="166" width="24" height="44" rx="8" fill="var(--c2)"/>
      <text x="570" y="236" text-anchor="middle" font-size="13">hears it 58 ms later</text>
      <g fill="var(--muted)">${Array.from({ length: 22 }, (_, i) => `<circle cx="${120 + i * 19}" cy="150" r="3.2"/>`).join('')}</g>
      <g data-step="=1"><text x="320" y="60" text-anchor="middle" font-size="15">Still air: molecules evenly spaced</text></g>
      <g data-step="2"><g class="rl-pulse"><rect x="104" y="120" width="34" height="60" rx="6" fill="var(--accent)" opacity=".35"/></g>
        <text x="121" y="108" text-anchor="middle" font-size="13" fill="var(--accent)">squeeze</text></g>
      <g data-step="3"><path d="M150 150 H540" stroke="var(--accent)" stroke-width="3" fill="none" class="rl-flow"/>
        <text x="345" y="100" text-anchor="middle" font-size="14">the squeeze is passed along at 343 m/s</text></g>
      <g data-step="4"><circle cx="570" cy="150" r="26" fill="none" stroke="var(--c2)" stroke-width="3" class="rl-grow"/>
        <text x="345" y="72" text-anchor="middle" font-size="14" fill="var(--c2)">each molecule only wobbles and returns</text></g>
      <g data-step="5"><path d="M540 130 Q330 20 130 130" stroke="var(--c3)" stroke-width="2.5" fill="none" class="rl-flow rev slow"/>
        <text x="335" y="40" text-anchor="middle" font-size="13" fill="var(--c3)">hard walls send it back: the ringing tail</text></g>
    </svg>`,
    steps: [
      ['Before the clap', 'The air is at rest. Its molecules are spread evenly, at normal atmospheric pressure.'],
      ['The hands squeeze the air', 'A thin layer next to the hands is compressed: pressure there rises a tiny amount above normal.'],
      ['The squeeze is handed on', 'That layer pushes its neighbour and relaxes. The push travels outward at about 343 m/s; the air itself stays put.'],
      ['It reaches the ear', 'After 58 ms the pressure change moves the eardrum. Each molecule on the way only wobbled back and forth.'],
      ['The room answers', 'Concrete walls reflect almost all of it, so the pulse keeps arriving again and again: reverberation.'],
    ],
    why: [
      'Air is springy: squeeze it and it pushes back. That springiness plus the weight of the air sets the speed, which is why speed depends on temperature and not on loudness.',
      'Only energy travels. If the air itself travelled, a kick drum would blow papers off the desk.',
      'A hard, heavy wall barely moves when the push arrives, so the push bounces off. A soft, porous surface lets the air rub through it and turns the motion into a little heat.',
    ],
    uses: [
      ['⏱️', 'Timing a delay', 'A speaker 34 m from the stage is heard 0.1 s late. Delay the nearer speakers by distance ÷ 343 so everything arrives together.'],
      ['🎤', 'Finding an echo', 'Clap and listen: if you hear a distinct repeat, the surface causing it is more than about 8.5 m away there and back.'],
      ['🏠', 'Judging a room', 'A long tail after a clap tells you the surfaces are hard and reflective before you measure anything.'],
    ],
    tryit: [
      'Stand 17 m from a large wall outdoors and clap. You should hear the echo about a tenth of a second later (34 m round trip ÷ 343).',
      'Clap in your bathroom, then in a room with a sofa and curtains. Count how long each tail lasts.',
      'Hold a tissue in front of a speaker playing bass: it quivers in place and does not blow away.',
    ],
    slip: ['Thinking louder sound travels faster.', 'Speed depends on the air (mainly temperature). Loudness only changes how big the pressure swing is.'],
  });
})();
