/* Room Doctor: symptom → causes → diagnosis → fixes → alternatives. */
(function () {
  'use strict';
  const { el, html } = A;
  const TOOL = { analyzer: ['Room Analyzer', 'room'], absorbers: ['Absorber Designer', 'absorb'], diffusers: ['Diffuser Designer', 'diffuser'], isolation: ['Soundproofing', 'wall'], floors: ['Floating Floors', 'spring'], calc: ['Calculators', 'calc'], measure: ['Measure', 'mic'] };
  A.register('doctor', {
    title: 'Room Doctor',
    render(root, params) {
      A.pageHead(root, 'Analyse', 'Room Doctor', 'Describe what you hear. The Doctor walks you through likely causes, how to confirm them, the fixes in order of effectiveness, and the alternatives — the way an acoustician would on a site visit.');
      const layout = el('div', { class: 'grid', style: { gridTemplateColumns: 'minmax(220px, 300px) 1fr' } });
      if (innerWidth < 860) layout.style.gridTemplateColumns = '1fr';
      root.appendChild(layout);
      const list = el('div', { class: 'card', style: { padding: '10px' } });
      const q = el('input', { type: 'search', placeholder: 'Describe the problem… e.g. “boomy”, “neighbours”', style: { width: '100%', marginBottom: '8px' } });
      list.appendChild(q);
      const items = el('div', { class: 'toc', style: { position: 'static', maxHeight: 'none' } });
      list.appendChild(items);
      const detail = el('div');
      layout.append(list, detail);
      let cur = params[0] || LIB.symptoms[0].id;
      function renderList() {
        const t = q.value.toLowerCase().trim();
        items.innerHTML = '';
        LIB.symptoms.filter((s) => !t || (s.name + ' ' + s.symptom + ' ' + s.causes.join(' ')).toLowerCase().includes(t)).forEach((s) => {
          const a = el('a', { href: '#/doctor/' + s.id, class: s.id === cur ? 'on' : '' }, s.name);
          a.onclick = (e) => { e.preventDefault(); cur = s.id; history.replaceState(null, '', '#/doctor/' + s.id); renderList(); show(); };
          items.appendChild(a);
        });
      }
      function show() {
        const s = LIB.symptoms.find((x) => x.id === cur) || LIB.symptoms[0];
        const li = (arr) => arr.length ? `<ul>${arr.map((x) => `<li>${x}</li>`).join('')}</ul>` : '<p class="small">—</p>';
        detail.innerHTML = `<div class="card"><div class="eyebrow small accent" style="text-transform:uppercase;letter-spacing:.1em">Symptom</div><h2 style="margin-top:4px">${s.name}</h2><p class="muted" style="font-size:1.05rem">“${s.symptom}”</p>
          <div class="grid g2">
            <div><h3>Likely causes</h3>${li(s.causes)}</div>
            <div><h3>How to confirm</h3>${li(s.diagnose)}</div>
          </div>
          <h3>Fixes, most effective first</h3><ol class="steps">${s.fixes.map((x) => `<li>${x}</li>`).join('')}</ol>
          ${s.alternatives.length ? `<div class="callout alt">${s.alternatives.join(' · ')}</div>` : ''}
          ${s.tools.length ? `<div class="row" style="margin-top:12px">${s.tools.map((t) => `<a class="btn" href="#/${t}">${A.icon(TOOL[t][1])} ${TOOL[t][0]}</a>`).join('')}</div>` : ''}
        </div>`;
      }
      q.oninput = renderList;
      renderList(); show();
    },
    scrollTop: false,
  });
})();
