/* Academy: chapter index and lesson reader with interactive visuals and quizzes. */
(function () {
  'use strict';
  const { el, html } = A;

  const TRACKS = [
    ['acoustics', 'Acoustics, Soundproofing & Room Design', 'Twenty-five chapters from “what is sound” to concert halls: waves, fundamentals and harmonics, decibels, RT60 and octave bands, flat response, hearing, room modes and how to treat them, absorption, diffusion, isolation, hidden and integrated design, vibration, floating floors, studios, halls and measurement.'],
    ['audio', 'Audio Engineering & Sound Systems', 'Fifteen courses on the electrical and digital side: signals and levels, transducers, consoles and signal flow, digital audio, networking (Dante, AVB, AES67), DSP, crossovers, amplifiers, hum & grounding, arrays, PA design, installation, tuning with RTA and transfer functions, feedback and production workflows.'],
    ['master', 'Studio Design Master Class', 'Twenty-nine practical courses from first principles to finished buildings: myths and the scientific method, matter and energy, how absorbers work, lab testing, isolation (walls, doors, windows, floating floors), large and small rooms, control rooms, tracking rooms, booths, Foley/ADR, treatment designs, flow resistivity, speakers and flush-mounting, electrical and low-voltage wiring, HVAC, day-lighting — and four dimensioned studio PLANS.'],
  ];
  function progress() { return A.store.get('progress', {}); }
  function saveProgress(id, patch) {
    const p = progress();
    p[id] = Object.assign({}, p[id], patch);
    A.store.set('progress', p);
  }

  function renderIndex(root) {
    A.pageHead(root, 'Academy', 'The Acoustica Academy', 'Two course tracks, ordered like a university programme but taught like an apprenticeship. Every course has interactive physics, rules of thumb, mentor notes, common mistakes, alternatives and a short quiz.');
    const prog = progress();
    const levels = ['Foundation', 'Core', 'Advanced'];
    TRACKS.forEach(([tid, tname, tdesc]) => {
    const inTrack = LESSONS.filter((l) => (l.track || 'acoustics') === tid);
    const done = inTrack.filter((l) => prog[l.id] && prog[l.id].done).length;
    root.appendChild(html(`<div class="card" style="margin-top:22px"><div class="eyebrow small accent" style="text-transform:uppercase;letter-spacing:.12em;font-weight:700">Course track</div><h2 style="margin:.2em 0">${tname}</h2><p class="muted" style="margin:0 0 8px">${tdesc}</p><div class="progress-bar"><i style="width:${Math.round((done / inTrack.length) * 100)}%"></i></div><div class="small" style="margin-top:6px">${done}/${inTrack.length} courses complete</div></div>`));
    levels.forEach((lv) => {
      const list = inTrack.filter((l) => l.level === lv);
      if (!list.length) return;
      root.appendChild(html(`<h3>${lv}</h3>`));
      const g = el('div', { class: 'grid gauto' });
      list.forEach((l) => {
        const p = prog[l.id] || {};
        g.appendChild(html(`<a class="tile" data-level="${l.level}" href="#/academy/${l.id}">
          <div class="row" style="justify-content:space-between"><span class="pill">Chapter ${l.n}</span><span class="small">${l.mins} min ${p.done ? '· <span class="good">✓ done</span>' : ''}</span></div>
          <h3 style="margin-top:8px">${l.title}</h3><p>${l.summary}</p>
          ${p.quiz != null ? `<div class="small" style="margin-top:6px">Quiz: ${p.quiz}%</div>` : ''}
        </a>`));
      });
      root.appendChild(g);
    });
    });
  }

  function renderLesson(root, id) {
    const idx = LESSONS.findIndex((l) => l.id === id);
    if (idx < 0) return renderIndex(root);
    const L = LESSONS[idx];
    const prog = progress();
    const layout = el('div', { class: 'lesson-layout' });
    const toc = el('nav', { class: 'toc' });
    toc.innerHTML = `<a href="#/academy">← All courses</a>` + LESSONS.filter((l) => (l.track || 'acoustics') === (L.track || 'acoustics')).map((l) => `<a href="#/academy/${l.id}" class="${l.id === id ? 'on' : ''}">${l.n}. ${l.title}${prog[l.id] && prog[l.id].done ? '<span class="done">✓</span>' : ''}</a>`).join('');
    const body = el('article', { class: 'lesson' });
    layout.append(toc, body);
    root.appendChild(layout);

    body.appendChild(html(`<div class="page-head"><div class="eyebrow">Chapter ${L.n} · ${L.level} · ${L.mins} min</div><h1>${L.title}</h1><p>${L.summary}</p></div>`));
    body.appendChild(html(`<div class="glance"><span class="pill on">In this chapter</span>${L.sections.map((s, i) => `<a class="pill" href="javascript:void 0" data-s="${i}">${i + 1}. ${s.h}</a>`).join('')}</div>`));
    body.lastChild.addEventListener('click', (e) => { const i = e.target.dataset && e.target.dataset.s; if (i != null) document.getElementById('s' + i).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    const bar = el('div', { class: 'read-progress' }); document.body.appendChild(bar);
    const onScroll = () => { const r = body.getBoundingClientRect(); const p = A.clamp((-r.top + 80) / Math.max(1, r.height - innerHeight + 80), 0, 1); bar.style.width = p * 100 + '%'; };
    window.addEventListener('scroll', onScroll, { passive: true });
    A.onLeave(() => { window.removeEventListener('scroll', onScroll); bar.remove(); });
    L.sections.forEach((s, i) => {
      const sec = el('section', { id: 's' + i });
      sec.appendChild(html(`<h2><span class="sec-num">${i + 1}</span>${s.h}</h2>`));
      const content = el('div'); content.innerHTML = s.html || '';
      sec.appendChild(content);
      if (s.viz) {
        const host = el('div', { class: 'card', style: { padding: '14px 16px' } });
        sec.appendChild(host);
        try {
          if (typeof s.viz === 'function') s.viz(host);
          else if (V[s.viz]) V[s.viz](host);
        } catch (e) { console.error(e); host.textContent = 'Visual failed to load: ' + e.message; }
      }
      body.appendChild(sec);
    });

    // quiz
    if (L.quiz && L.quiz.length) {
      const q = el('section', { class: 'quiz card' });
      q.appendChild(html(`<h2 style="margin-top:0">Check your understanding</h2>`));
      const answers = new Array(L.quiz.length).fill(null);
      const score = el('div', { class: 'small' });
      L.quiz.forEach((item, qi) => {
        const box = el('div', { class: 'q' });
        box.appendChild(html(`<div><b>${qi + 1}. ${item.q}</b></div>`));
        const opts = el('div', { class: 'opts' });
        const why = el('div', { class: 'why' }, item.why);
        item.opts.forEach((o, oi) => {
          const b = el('button', {}, o);
          b.onclick = () => {
            if (answers[qi] != null) return;
            answers[qi] = oi;
            A.$$('button', opts).forEach((x, k) => { if (k === item.a) x.classList.add('right'); else if (k === oi) x.classList.add('wrong'); });
            why.classList.add('show');
            const n = answers.filter((a) => a != null).length;
            const right = answers.filter((a, k) => a === L.quiz[k].a).length;
            score.textContent = `Score: ${right}/${n}`;
            if (n === L.quiz.length) {
              const pct = Math.round((right / n) * 100);
              saveProgress(L.id, { quiz: pct, done: pct >= 50 });
              score.innerHTML = pct >= 50 ? `<span class="good">Chapter complete — ${pct}%.</span> Progress saved.` : `<span class="warn">${pct}% — review the chapter and try again (reload).</span>`;
            }
          };
          opts.appendChild(b);
        });
        box.append(opts, why);
        q.appendChild(box);
      });
      q.appendChild(score);
      body.appendChild(q);
    }

    // prev / next
    const nav = el('div', { class: 'row', style: { justifyContent: 'space-between', marginTop: '20px' } });
    const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    nav.appendChild(prev ? html(`<a class="btn" href="#/academy/${prev.id}">← ${prev.title}</a>`) : el('span'));
    const mark = el('button', {}, prog[L.id] && prog[L.id].done ? '✓ Completed' : 'Mark as complete');
    mark.onclick = () => { saveProgress(L.id, { done: true }); mark.textContent = '✓ Completed'; };
    nav.appendChild(mark);
    nav.appendChild(next ? html(`<a class="btn primary" href="#/academy/${next.id}">${next.title} →</a>`) : html(`<a class="btn primary" href="#/guides">Go design something →</a>`));
    body.appendChild(nav);
  }

  A.register('academy', {
    title: 'Academy',
    render(el, params) { if (params[0]) renderLesson(el, params[0]); else renderIndex(el); },
  });
})();
