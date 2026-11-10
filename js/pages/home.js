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
        <h1>Learn the physics of sound. Then design rooms and sound systems that perform like the best in the world.</h1>
        <p>Acoustica teaches acoustics, soundproofing, studio and hall design, audio engineering and sound-system design the way a seasoned acoustician would: by showing you the physics, giving you the numbers, and walking you through real design decisions — with alternatives.</p>
        <div class="row" style="margin-top:16px">
          <a class="btn primary" href="#/academy/${next.id}">${A.icon('graduation')} ${done ? 'Continue: ' + next.title : 'Start the Academy'}</a>
          <a class="btn" href="#/predict">${A.icon('star')} Predict my room</a>
          <a class="btn" href="#/treatment">${A.icon('grid')} Treat my room</a>
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

      /* ---- learning map: two tracks as connected nodes ---- */
      el.appendChild(A.html(`<div class="group-title"><h2>Your learning map</h2><span>click any stop · filled = completed</span></div>`));
      const tracks = [['acoustics', 'Acoustics, soundproofing & room design'], ['audio', 'Audio engineering & sound systems'], ['master', 'Studio Design Master Class']];
      let mapSvg = '<svg viewBox="0 0 1000 450" role="img" aria-label="Learning map">';
      tracks.forEach(([tid, tname], ti) => {
        const list = LESSONS.filter((l) => (l.track || 'acoustics') === tid);
        const y0 = 70 + ti * 150, n = list.length;
        mapSvg += `<text x="20" y="${y0 - 42}" font-weight="800" font-size="15" fill="var(--text)">${tname}</text>`;
        const pts = list.map((l, i) => [40 + (i * 920) / Math.max(1, n - 1), y0 + (i % 2 ? 22 : -8)]);
        mapSvg += `<path d="M${pts.map((p) => p.join(' ')).join(' L')}" fill="none" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>`;
        const lvl = { Foundation: 'c4', Core: 'accent2', Advanced: 'c3' };
        list.forEach((l, i) => {
          const [x, y] = pts[i], d = prog[l.id] && prog[l.id].done;
          mapSvg += `<a href="#/academy/${l.id}"><title>${l.n}. ${l.title}</title><circle class="node" cx="${x}" cy="${y}" r="13" fill="${d ? 'var(--accent)' : 'var(--panel)'}" stroke="var(--${lvl[l.level]})" stroke-width="3"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="9" font-weight="800">${l.n}</text></a>`;
        });
      });
      mapSvg += `<g font-size="11" fill="var(--muted)"><circle cx="760" cy="438" r="6" fill="none" stroke="var(--c4)" stroke-width="3"/><text x="772" y="442">Foundation</text><circle cx="850" cy="438" r="6" fill="none" stroke="var(--accent2)" stroke-width="3"/><text x="862" y="442">Core</text><circle cx="910" cy="438" r="6" fill="none" stroke="var(--c3)" stroke-width="3"/><text x="922" y="442">Advanced</text></g></svg>`;
      el.appendChild(A.html(`<div class="card lmap">${mapSvg}</div>`));

      /* ---- workbench: tools grouped by job, each with a small illustration ---- */
      const ART = {
        wave: '<path d="M0 35 C 30 5, 60 65, 90 35 S 150 5, 180 35 S 240 65, 270 35 S 330 5, 360 35" stroke="var(--accent)" stroke-width="3" fill="none"/><path d="M0 35 C 30 20, 60 50, 90 35 S 150 20, 180 35 S 240 50, 270 35 S 330 20, 360 35" stroke="var(--accent2)" stroke-width="2" fill="none" opacity=".7"/>',
        modes: '<rect x="120" y="10" width="120" height="50" rx="4" fill="none" stroke="var(--text)" stroke-width="2"/><rect x="120" y="10" width="40" height="50" fill="var(--accent)" opacity=".55"/><rect x="200" y="10" width="40" height="50" fill="var(--accent2)" opacity=".55"/><path d="M120 10 l14 0 l-14 14z M240 10 l-14 0 l14 14z M120 60 l14 0 l-14 -14z M240 60 l-14 0 l14 -14z" fill="var(--c4)"/>',
        bars: [10, 25, 18, 34, 22, 40, 28, 16, 30, 12].map((h, i) => `<rect x="${100 + i * 17}" y="${62 - h}" width="11" height="${h}" rx="2" fill="var(--${i % 3 ? 'accent' : 'accent2'})" opacity=".8"/>`).join(''),
        wall: '<rect x="130" y="8" width="18" height="56" fill="var(--muted)"/><rect x="152" y="8" width="26" height="56" fill="var(--c4)" opacity=".6"/><rect x="182" y="8" width="10" height="56" fill="var(--muted)"/><rect x="196" y="8" width="28" height="56" fill="var(--accent)" opacity=".45"/>',
        diff: [0, 1, 4, 2, 2, 4, 1, 0, 1, 4, 2, 2, 4, 1].map((d, i) => `<rect x="${110 + i * 10}" y="${14 + d * 9}" width="8" height="${48 - d * 9}" fill="var(--c3)"/>`).join(''),
        spk: '<rect x="150" y="12" width="26" height="48" rx="4" fill="var(--panel)" stroke="var(--text)" stroke-width="2"/><circle cx="163" cy="42" r="8" fill="none" stroke="var(--text)" stroke-width="2"/><path d="M190 20 q 18 16 0 32 M200 12 q 30 24 0 48" stroke="var(--accent)" stroke-width="3" fill="none"/>',
        net: '<g stroke="var(--accent2)" stroke-width="2"><line x1="130" y1="36" x2="180" y2="14"/><line x1="130" y1="36" x2="180" y2="58"/><line x1="180" y1="14" x2="230" y2="36"/><line x1="180" y1="58" x2="230" y2="36"/></g><g fill="var(--accent)"><circle cx="130" cy="36" r="7"/><circle cx="180" cy="14" r="7"/><circle cx="180" cy="58" r="7"/><circle cx="230" cy="36" r="7"/></g>',
        build: '<path d="M130 58 h100 M140 58 v-36 h80 v36" stroke="var(--text)" stroke-width="2" fill="none"/><path d="M140 22 l80 36" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 4"/><text x="180" y="18" font-size="10" text-anchor="middle" fill="var(--text)">1200 mm</text>',
        ear: '<circle cx="180" cy="36" r="22" fill="none" stroke="var(--accent)" stroke-width="3"/><circle cx="180" cy="36" r="12" fill="none" stroke="var(--accent2)" stroke-width="3"/><circle cx="180" cy="36" r="4" fill="var(--text)"/>',
      };
      const groups = [
        ['Learn', 'concepts, physics, practice', [['academy', 'Academy', `Three tracks · ${(window.LESSONS || []).length} courses with interactive physics and quizzes`, 'wave'], ['lab', 'Physics Lab', 'Wave tank and 20+ simulations', 'wave'], ['hear', 'Hear the Decibel', 'Listen through walls; hear dB steps', 'ear']]],
        ['Analyse', 'find what is wrong', [['predict', 'Room Predictor', 'Dimensions → problem frequencies, modes, zones and placed treatment', 'modes'], ['treatment', 'Treatment Simulator', 'Place traps & diffusers; see every mode change', 'modes'], ['analyzer', 'Room Analyzer', 'Modes, RT, bass at the seat, treatment plan', 'bars'], ['measure', 'Measure', 'Live RTA and clap-test RT60', 'bars'], ['doctor', 'Room Doctor', 'Symptom → cause → fix', 'modes']]],
        ['Design', 'size it and predict it', [['absorbers', 'Absorber Designer', 'Porous, membrane, Helmholtz', 'wall'], ['diffusers', 'Diffuser Designer', 'QRD, PRD, skyline + polar plots', 'diff'], ['isolation', 'Soundproofing', 'Walls, STC/Rw, neighbour planner', 'wall'], ['floors', 'Floating Floors', 'Springs, pads, air spring', 'wall']]],
        ['Sound systems', 'audio engineering in practice', [['pa', 'PA & System Designer', 'Coverage maps, delays, tuning lab', 'spk'], ['systems', 'Signal Flow & Networks', 'Pipelines, Dante/AVB/AES67', 'net']]],
        ['Build', 'drawings, guides, references', [['workshop', 'Workshop', 'Dimensioned drawings & cut lists', 'build'], ['guides', 'Studio & Hall Guides', '13 room types', 'build'], ['cases', 'Case Studies', 'Real halls & projects', 'build'], ['materials', 'Materials Library', 'α tables & properties', 'bars']]],
      ];
      groups.forEach(([g, sub, items]) => {
        el.appendChild(A.html(`<div class="group-title"><h2>${g}</h2><span>${sub}</span></div>`));
        const gr = A.el('div', { class: 'grid gauto' });
        items.forEach(([id, t, d, art]) => gr.appendChild(A.html(`<a class="tile" href="#/${id}"><div class="art"><svg viewBox="0 0 360 70" preserveAspectRatio="xMidYMid meet">${ART[art]}</svg></div><h3>${t}</h3><p>${d}</p></a>`)));
        el.appendChild(gr);
      });

      el.appendChild(A.html(`<div class="group-title"><h2>Learning path, stage by stage</h2><span>a suggested order</span></div>`));
      const path = A.el('div', { class: 'grid gauto' });
      const stages = [
        ['Foundations', 'sound,harmonics,decibels,hearing,propagation', 'Waves, fundamentals & harmonics, dB, ears and how sound travels.'],
        ['Room acoustics', 'interference,modes,modes-treat,reverb,bands,absorption,diffusion', 'Reflections, modes and their treatment, decay, absorbers, diffusers.'],
        ['Isolation & vibration', 'isolation,flanking,integrated,vibration,floating,criteria', 'Walls, flanking, integrated design, springs, floors, HVAC.'],
        ['Design practice', 'control-room,flat,rooms,halls,measurement,audio,workflow', 'Studios, halls, measurement and method.'],
        ['Audio foundations', 'a-electric,a-transducers,a-flow,a-digital', 'Signals, mics & speakers, consoles, digital audio.'],
        ['Processing & networks', 'a-network,a-dsp,a-crossover,a-amps', 'AoIP, DSP, crossovers, amps and cabling.'],
        ['Sound system design', 'a-loudspeakers,a-pa-design,a-install,a-tuning,a-feedback,a-workflow', 'Arrays, PA design, installation, tuning, workflows.'],
        ['Master Class: first principles', 'm-myths,m-diy,m-matter,m-params,m-absorb-how,m-lab', 'Myths, method, matter & energy, absorption mechanisms, lab testing.'],
        ['Master Class: isolation & rooms', 'm-iso-basics,m-walls,m-doors-windows,m-floors,m-large-rooms,m-small-rooms', 'Requirements, walls, doors, windows, floors, large and small rooms.'],
        ['Master Class: studio rooms', 'm-control,m-tracking,m-music-booths,m-vo-booths,m-foley,m-treat-designs,m-flowres', 'Control rooms, tracking rooms, booths, Foley/ADR and treatment designs.'],
        ['Master Class: systems & PLANS', 'm-speakers,m-electrical,m-lowvolt,m-hvac,m-daylight,m-plan-bedroom,m-plan-basement,m-plan-detached,m-plan-pro', 'Speakers, wiring, HVAC, daylight and four studio plans.'],
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
