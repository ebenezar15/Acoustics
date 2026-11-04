/* ==========================================================================
   Acoustica boot: navigation, theme picker, global search.
   ========================================================================== */
(function () {
  'use strict';
  const { el, $, $$ } = A;

  A.NAV = [
    ['Start', [['home', 'Home', 'home']]],
    ['Learn', [['academy', 'Academy', 'graduation'], ['lab', 'Physics Lab', 'lab'], ['hear', 'Hear the Decibel', 'ear'], ['glossary', 'Glossary & Formulas', 'list']]],
    ['Analyse', [['predict', 'Room Predictor', 'star'], ['treatment', 'Treatment Simulator', 'grid'], ['analyzer', 'Room Analyzer', 'room'], ['measure', 'Measure (Mic)', 'mic'], ['doctor', 'Room Doctor', 'help']]],
    ['Sound Systems', [['pa', 'PA & System Designer', 'speaker'], ['systems', 'Signal Flow & Networks', 'layers']]],
    ['Design', [['absorbers', 'Absorber Designer', 'absorb'], ['diffusers', 'Diffuser Designer', 'diffuser'], ['isolation', 'Soundproofing', 'wall'], ['floors', 'Floating Floors & Vibration', 'spring'], ['calc', 'Calculators', 'calc']]],
    ['Build & Reference', [['guides', 'Studio & Hall Guides', 'hall'], ['workshop', 'Workshop (DIY builds)', 'hammer'], ['cases', 'Case Studies', 'map'], ['masters', 'Masters & Schools', 'users'], ['materials', 'Materials Library', 'layers']]],
  ];

  function buildNav() {
    const nav = $('#nav');
    nav.innerHTML = '';
    A.NAV.forEach(([g, items]) => {
      nav.appendChild(el('div', { class: 'nav-group' }, g));
      items.forEach(([id, label, icon]) => nav.appendChild(A.html(`<a href="#/${id}" data-id="${id}">${A.icon(icon)}<span>${label}</span></a>`)));
    });
  }

  function buildTheme() {
    const panel = $('#themePanel');
    const render = () => {
      panel.innerHTML = `<h3 style="margin:0 0 4px">Colour scheme</h3><div class="small">Choose a palette — charts, animations and diagrams follow it.</div>`;
      const sw = el('div', { class: 'swatches' });
      Object.entries(A.THEMES).forEach(([id, t]) => {
        const b = el('button', { class: 'swatch' + (A.theme.current === id ? ' on' : ''), style: { background: t.panel, color: t.text } });
        b.innerHTML = `<div class="dots">${[t.bg, t.accent, t.accent2, t.series[2]].map((c) => `<i style="background:${c}"></i>`).join('')}</div>${t.name}`;
        b.onclick = () => { A.theme.apply(id); render(); };
        sw.appendChild(b);
      });
      panel.appendChild(sw);
      const row = el('div', { class: 'row' });
      const pick = el('input', { type: 'color', value: A.theme.custom || A.css('accent') || '#f5a524', 'aria-label': 'Custom accent colour' });
      pick.oninput = () => A.theme.apply(A.theme.current, pick.value);
      const reset = el('button', { class: 'small' }, 'Reset accent');
      reset.onclick = () => { A.theme.apply(A.theme.current); render(); };
      row.append(el('span', { class: 'small' }, 'Custom accent'), pick, reset);
      panel.appendChild(row);
      panel.appendChild(A.html(`<p class="small" style="margin-top:12px">Typeface: <b>Avenir Next</b> where installed (macOS / iOS), otherwise Nunito Sans, its closest open match.</p>`));
    };
    render();
    $('#themeBtn').innerHTML = A.icon('palette') + '<span>Theme</span>';
    $('#themeBtn').onclick = (e) => { e.stopPropagation(); render(); panel.classList.toggle('open'); };
    document.addEventListener('click', (e) => { if (!panel.contains(e.target)) panel.classList.remove('open'); });
  }

  /* ---------------- search ---------------- */
  function searchIndex() {
    const idx = [];
    A.NAV.forEach(([, items]) => items.forEach(([id, label]) => idx.push({ kind: 'Page', title: label, href: '#/' + id, text: label })));
    (window.LESSONS || []).forEach((ch) => {
      idx.push({ kind: 'Lesson', title: ch.title, href: '#/academy/' + ch.id, text: ch.title + ' ' + (ch.summary || '') + ' ' + (ch.tags || []).join(' ') });
      (ch.sections || []).forEach((s) => s.h && idx.push({ kind: 'Section', title: s.h + ' — ' + ch.title, href: '#/academy/' + ch.id, text: s.h + ' ' + (s.html || '').replace(/<[^>]+>/g, ' ').slice(0, 400) }));
    });
    (window.LIB && LIB.glossary || []).forEach(([t, d]) => idx.push({ kind: 'Term', title: t, href: '#/glossary/' + encodeURIComponent(t), text: t + ' ' + d }));
    (window.LIB && LIB.guides || []).forEach((g) => idx.push({ kind: 'Guide', title: g.name, href: '#/guides/' + g.id, text: g.name + ' ' + g.summary }));
    (window.LIB && LIB.workshop || []).forEach((g) => idx.push({ kind: 'Build', title: g.name, href: '#/workshop/' + g.id, text: g.name + ' ' + g.summary }));
    (window.LIB && LIB.cases || []).forEach((g) => idx.push({ kind: 'Case', title: g.name, href: '#/cases/' + g.id, text: g.name + ' ' + g.summary }));
    (window.LIB && LIB.symptoms || []).forEach((g) => idx.push({ kind: 'Doctor', title: g.name, href: '#/doctor/' + g.id, text: g.name + ' ' + g.symptom }));
    D.MATERIALS.forEach((m) => idx.push({ kind: 'Material', title: m.name, href: '#/materials', text: m.name + ' ' + m.cat }));
    return idx;
  }
  function buildSearch() {
    $('#searchIcon').innerHTML = A.icon('search');
    const input = $('#search'), res = $('#searchResults');
    let index = null, sel = 0, items = [];
    const run = () => {
      index = index || searchIndex();
      const q = input.value.trim().toLowerCase();
      if (!q) { res.classList.remove('open'); return; }
      const words = q.split(/\s+/);
      items = index
        .map((it) => {
          const t = it.title.toLowerCase(), x = it.text.toLowerCase();
          let s = 0;
          for (const w of words) { if (t.includes(w)) s += 3; else if (x.includes(w)) s += 1; else return null; }
          if (t.startsWith(q)) s += 4;
          return { it, s };
        })
        .filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 14).map((x) => x.it);
      sel = 0;
      res.innerHTML = items.length ? items.map((it, i) => `<a href="${it.href}" class="${i === 0 ? 'sel' : ''}"><span class="kind">${it.kind}</span>${A.esc(it.title)}</a>`).join('') : '<div class="empty">No matches</div>';
      res.classList.add('open');
    };
    input.addEventListener('input', run);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % Math.max(1, items.length);
        $$('a', res).forEach((a, i) => a.classList.toggle('sel', i === sel));
      } else if (e.key === 'Enter' && items[sel]) { location.hash = items[sel].href; res.classList.remove('open'); input.blur(); }
      else if (e.key === 'Escape') { res.classList.remove('open'); input.blur(); }
    });
    res.addEventListener('click', () => { res.classList.remove('open'); input.value = ''; });
    document.addEventListener('click', (e) => { if (!res.contains(e.target) && e.target !== input) res.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { e.preventDefault(); input.focus(); } });
  }

  function boot() {
    A.theme.init();
    buildNav();
    buildTheme();
    buildSearch();
    const us = $('#unitSel');
    Object.entries(A.UNITS).forEach(([k, v]) => us.appendChild(el('option', { value: k }, k === 'auto' ? 'Units: metric (auto)' : 'Units: ' + v.name.toLowerCase())));
    us.value = A.unit;
    us.onchange = () => { A.setUnit(us.value); A.route(); A.toast('Lengths now shown in ' + A.UNITS[A.unit].name.toLowerCase()); };
    $('#menuBtn').innerHTML = A.icon('menu');
    $('#menuBtn').onclick = () => $('#sidebar').classList.toggle('open');
    window.addEventListener('hashchange', A.route);
    A.route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
