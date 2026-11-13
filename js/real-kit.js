/* Acoustica — "In real life" layer.
   REAL(lessonId, data) adds two sections to an existing lesson:
     1. near the top: plain-words summary, a realistic worked scene with numbers,
        and a step-through animated diagram of how it works;
     2. at the end: why it works, where you will use it, a short exercise, a common slip.
   Data shape:
     { title, plain, where, story, numbers:[[label,value]], svg, steps:[[title,detail]],
       why:[...], uses:[[icon,title,text]], tryit:[...], slip:[wrong,right] } */
(function () {
  const esc = (s) => String(s);
  const pending = [];

  function stepper(host, d) {
    const A = window.A;
    const wrap = document.createElement('div'); wrap.className = 'rl-stage';
    wrap.innerHTML = d.svg || '';
    const svg = wrap.querySelector('svg');
    if (svg) { svg.classList.add('gsvg', 'rl-svg'); if (!svg.getAttribute('role')) svg.setAttribute('role', 'img'); }
    const steps = d.steps || [];
    const cap = document.createElement('div'); cap.className = 'rl-cap';
    const bar = document.createElement('div'); bar.className = 'rl-bar';
    const dots = document.createElement('div'); dots.className = 'rl-dots';
    const mk = (label, title) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'ghost rl-btn'; b.textContent = label; b.title = title; b.setAttribute('aria-label', title); return b; };
    const back = mk('‹', 'Previous step'), play = mk('❚❚', 'Pause'), next = mk('›', 'Next step');
    let cur = 1, playing = true, timer = null;
    const n = Math.max(1, steps.length);
    const show = () => {
      if (svg) svg.querySelectorAll('[data-step]').forEach((g) => {
        const spec = g.getAttribute('data-step'); let on;
        if (spec.indexOf('-') > 0) { const p = spec.split('-').map(Number); on = cur >= p[0] && cur <= p[1]; }
        else if (spec.charAt(0) === '=') on = cur === Number(spec.slice(1));
        else on = cur >= Number(spec);
        g.classList.toggle('rl-off', !on);
        g.classList.toggle('rl-now', spec.replace('=', '') === String(cur));
      });
      const s = steps[cur - 1];
      cap.innerHTML = s ? `<span class="rl-num">${cur}</span><div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>` : '';
      dots.innerHTML = steps.map((_, i) => `<i class="${i + 1 === cur ? 'on' : ''}"></i>`).join('');
    };
    const go = (k) => { cur = ((k - 1 + n) % n) + 1; show(); };
    const tick = () => { timer = setInterval(() => { if (playing && document.body.contains(wrap) && !document.hidden) go(cur + 1); }, 3800); };
    const stop = () => { playing = false; play.textContent = '▶'; play.title = 'Play'; play.setAttribute('aria-label', 'Play'); };
    back.onclick = () => { stop(); go(cur - 1); };
    next.onclick = () => { stop(); go(cur + 1); };
    play.onclick = () => { playing = !playing; play.textContent = playing ? '❚❚' : '▶'; play.title = playing ? 'Pause' : 'Play'; play.setAttribute('aria-label', play.title); };
    bar.appendChild(back); bar.appendChild(play); bar.appendChild(next); bar.appendChild(dots);
    host.appendChild(wrap); host.appendChild(cap);
    if (n > 1) host.appendChild(bar);
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) stop();
    show(); if (n > 1) tick();
    if (A && A.onLeave) A.onLeave(() => clearInterval(timer));
  }

  function build(d) {
    const nums = (d.numbers || []).map(([k, v]) => `<div class="rl-numbox"><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('');
    const top = {
      h: 'In real life: ' + d.title,
      html: `<div class="rl-plain"><span>In plain words</span>${esc(d.plain)}</div>
        <div class="rl-scene"><div class="rl-where">${esc(d.where || 'A real situation')}</div>${d.story}
        ${nums ? `<div class="rl-nums">${nums}</div>` : ''}</div>
        <p class="small muted" style="margin:.6em 0 .2em">How it works, step by step — it plays by itself; use the arrows to go at your own pace.</p>`,
      viz: (host) => stepper(host, d),
    };
    const why = (d.why || []).map((w) => `<li>${esc(w)}</li>`).join('');
    const uses = (d.uses || []).map(([i, t, x]) => `<div class="rl-use"><span>${esc(i)}</span><div><b>${esc(t)}</b><p>${esc(x)}</p></div></div>`).join('');
    const tryit = (d.tryit || []).map((t) => `<li>${esc(t)}</li>`).join('');
    const end = {
      h: 'Why it works, where you will use it, and a 10-minute exercise',
      html: `${why ? `<h3>Why it works</h3><ul class="rl-why">${why}</ul>` : ''}
        ${uses ? `<h3>Where you will use it</h3><div class="rl-uses">${uses}</div>` : ''}
        ${tryit ? `<h3>Try it in 10 minutes</h3><ol class="rl-try">${tryit}</ol>` : ''}
        ${d.slip ? `<div class="rl-slip"><div><small>Easy slip</small>${esc(d.slip[0])}</div><div><small>Do this instead</small>${esc(d.slip[1])}</div></div>` : ''}`,
    };
    return [top, end];
  }

  function apply(id, d) {
    const L = (window.LESSONS || []).find((l) => l.id === id);
    if (!L || L._real) return !!L;
    const [top, end] = build(d);
    L.sections.splice(Math.min(1, L.sections.length), 0, top);
    L.sections.push(end);
    L._real = true;
    return true;
  }

  window.REAL = function (id, d) { if (!apply(id, d)) pending.push([id, d]); };
  window.REAL.flush = function () { for (let i = pending.length - 1; i >= 0; i--) if (apply(pending[i][0], pending[i][1])) pending.splice(i, 1); return pending.map((p) => p[0]); };
  window.REAL.stepper = stepper;
})();
