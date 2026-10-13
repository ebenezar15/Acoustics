/* Home: hero, learning path, tools overview, mentor tip. */
(function () {
  'use strict';
  const TIPS = [
    'Isolation first, treatment second. Isolation is structure; treatment is furniture.',
    'If a noise is louder in the middle of the ceiling than at the window, suspect structure-borne transmission.',
    'Thin foam makes a room dull and boomy at the same time — it only absorbs highs.',
    'Every room mode has a pressure maximum in every corner. Corners are where bass traps earn their keep.',
    'You can’t EQ a null. Move the seat or the speaker instead.',
    'A 1 % gap turns an STC-50 wall into an STC-20 wall. Seal everything.',
    'An isolator only isolates above √2 × its natural frequency. Near fn it amplifies.',
    'Thermal double glazing is not acoustic glazing — the gap is too small.',
    'Diffusers need distance. Too close, and they’re just lumpy reflectors.',
    'NRC ignores 125 Hz. Ask for the full third-octave data.',
    'The trapped air under a floating slab is a spring. Shallow sealed cavities can ruin a spring floor.',
    'Symmetry left-to-right matters more in a control room than any single panel.',
    'Start the listening seat at ~38 % of the room length, then measure and move in 5 cm steps.',
    'Never build three leaves in the space of two. Each extra leaf adds a resonance.',
    'Rubber pads are designed for a load range. Under-loaded pads are stiff pads.',
  ];

  A.register('home', {
    title: 'Home',
    render(el) {
      const prog = A.store.get('progress', {});
      const total = (window.LESSONS || []).length;
      const done = (window.LESSONS || []).filter((l) => prog[l.id] && prog[l.id].done).length;
      const next = (window.LESSONS || []).find((l) => !(prog[l.id] && prog[l.id].done)) || LESSONS[0];
      const hero = A.html(`<section class="hero">
        <div class="page-head" style="margin:0"><div class="eyebrow">Your acoustician in residence</div></div>
        <h1>Learn the physics of sound. Then design rooms that sound — and isolate — like the best in the world.</h1>
        <p>Acoustica teaches audio, acoustics, soundproofing, studio and hall design the way a seasoned acoustician would: by showing you the physics, giving you the numbers, and walking you through real design decisions — with alternatives.</p>
        <div class="row" style="margin-top:16px">
          <a class="btn primary" href="#/academy/${next.id}">${A.icon('graduation')} ${done ? 'Continue: ' + next.title : 'Start the Academy'}</a>
          <a class="btn" href="#/analyzer">${A.icon('room')} Analyse my room</a>
          <a class="btn" href="#/lab">${A.icon('lab')} Open the Physics Lab</a>
        </div>
      </section>`);
      el.appendChild(hero);
      // animated background waves in hero
      const cv = A.el('canvas');
      hero.prepend(cv);
      const ctx = cv.getContext('2d');
      let raf;
      const draw = (t) => {
        const w = hero.clientWidth, h = hero.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
        if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        for (let k = 0; k < 5; k++) {
          ctx.strokeStyle = A.alpha(A.series(k), 0.5);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 4) {
            const y = h * (0.55 + k * 0.08) + Math.sin(x * (0.008 + k * 0.003) + t * 0.0008 * (k + 1)) * (18 + k * 6) * Math.sin(t * 0.0003 + k);
            x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
        }
        raf = requestAnimationFrame(draw);
      };
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(draw);
      A.onLeave(() => cancelAnimationFrame(raf));

      const pct = total ? Math.round((done / total) * 100) : 0;
      el.appendChild(A.html(`<div class="grid g3">
        <div class="card"><h4 style="margin-top:0">Your progress</h4><div style="font-size:2rem;font-weight:800">${done}/${total} <small class="muted" style="font-size:.9rem">lessons</small></div><div class="progress-bar"><i style="width:${pct}%"></i></div><p class="small" style="margin-top:8px">Complete a lesson’s quiz to mark it done. Progress is saved in this browser.</p></div>
        <div class="card" style="grid-column: span 2"><h4 style="margin-top:0">Mentor’s rule of the day</h4><p style="font-size:1.15rem;font-weight:600;margin:6px 0 0">“${TIPS[new Date().getDate() % TIPS.length]}”</p><p class="small" style="margin-top:8px"><a href="#/doctor">Something wrong with your room? Ask the Room Doctor →</a></p></div>
      </div>`));

      const tiles = [
        ['academy', 'graduation', 'Academy', '20 chapters from “what is sound” to concert halls, with interactive physics and quizzes.'],
        ['lab', 'lab', 'Physics Lab', 'A real-time wave tank, standing waves, comb filters, mass law, vibration — play with the physics.'],
        ['hear', 'ear', 'Hear the Decibel', 'Listen to what 10, 30 and 50 dB of isolation sound like through different walls.'],
        ['analyzer', 'room', 'Room Analyzer', 'Modes, RT per band, bass response at your seat, reflection points and a treatment plan.'],
        ['measure', 'mic', 'Measure', 'Live spectrum analyser and a clap-test RT60 estimate from your microphone.'],
        ['absorbers', 'absorb', 'Absorber Designer', 'Porous, membrane, perforated and slotted absorbers with predicted α(f) and build sheets.'],
        ['diffusers', 'diffuser', 'Diffuser Designer', 'QRD, PRD and skyline diffusers with polar plots and cut lists.'],
        ['isolation', 'wall', 'Soundproofing', 'Wall builder with STC/Rw, composite partitions and a neighbour-noise planner.'],
        ['floors', 'spring', 'Floating Floors', 'Springs, pads, mats and floated timber floors — f₀, deflection, isolator counts.'],
        ['guides', 'hall', 'Studio & Hall Guides', 'Targets, step-by-step design and mistakes for 13 room types.'],
        ['workshop', 'hammer', 'Workshop', 'Build sheets for panels, traps, diffusers, window plugs, floated floors.'],
        ['cases', 'map', 'Case Studies', 'From Boston Symphony Hall to a basement studio — what worked and why.'],
      ];
      el.appendChild(A.html(`<h2>Everything in the studio</h2>`));
      const g = A.el('div', { class: 'grid gauto' });
      tiles.forEach(([id, ic, t, d]) => g.appendChild(A.html(`<a class="tile" href="#/${id}"><div class="ic">${A.icon(ic)}</div><h3>${t}</h3><p>${d}</p></a>`)));
      el.appendChild(g);

      el.appendChild(A.html(`<h2>A learning path to becoming an acoustic engineer</h2>`));
      const path = A.el('div', { class: 'grid g4' });
      const stages = [
        ['Foundations', 'sound,decibels,hearing,propagation', 'Waves, dB, ears and how sound travels.'],
        ['Room acoustics', 'interference,modes,reverb,absorption,diffusion', 'Reflections, modes, decay, absorbers, diffusers.'],
        ['Isolation & vibration', 'isolation,flanking,vibration,floating,criteria', 'Walls, flanking, springs, floors, HVAC.'],
        ['Design practice', 'control-room,rooms,halls,measurement,audio,workflow', 'Studios, halls, measurement and method.'],
      ];
      stages.forEach(([t, ids, d], i) => {
        const list = ids.split(',').map((id) => (window.LESSONS || []).find((l) => l.id === id)).filter(Boolean);
        const c = A.el('div', { class: 'card' });
        c.innerHTML = `<div class="pill on">Stage ${i + 1}</div><h3 style="margin:.4em 0 .2em">${t}</h3><p class="small">${d}</p>` +
          list.map((l) => `<div><a href="#/academy/${l.id}">${prog[l.id] && prog[l.id].done ? '✓ ' : ''}${l.n}. ${l.title}</a></div>`).join('');
        path.appendChild(c);
      });
      el.appendChild(path);
    },
  });
})();
