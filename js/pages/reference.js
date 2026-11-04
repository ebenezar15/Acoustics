/* Reference pages: design guides, workshop, case studies, masters, materials, glossary. */
(function () {
  'use strict';
  const { el, html, fmt } = A;
  const ul = (arr) => `<ul>${arr.map((x) => `<li>${x}</li>`).join('')}</ul>`;

  /* ---------------- guides ---------------- */
  A.register('guides', {
    title: 'Studio & Hall Guides',
    render(root, params) {
      const g = LIB.guides.find((x) => x.id === params[0]);
      if (!g) {
        A.pageHead(root, 'Build & reference', 'Studio & Hall Design Guides', 'Targets, a step-by-step design sequence, treatment, common mistakes and alternatives for each type of space — the briefing an experienced consultant would give you on day one.');
        const grid = el('div', { class: 'grid gauto' });
        LIB.guides.forEach((x) => grid.appendChild(html(`<a class="tile" href="#/guides/${x.id}"><div class="ic">${A.icon(x.icon)}</div><h3>${x.name}</h3><p>${x.summary}</p></a>`)));
        root.appendChild(grid);
        root.appendChild(html(`<h2>Quick reference: targets by room</h2>`));
        root.appendChild(html(`<div class="table-wrap"><table><tr><th>Room</th>${['Decay / RT', 'Background', 'Isolation'].map((h) => `<th>${h}</th>`).join('')}</tr>${LIB.guides.map((x) => `<tr><td><a href="#/guides/${x.id}">${x.name}</a></td><td>${(x.targets[0] || [])[1] || ''}</td><td>${(x.targets.find((t) => /Background/.test(t[0])) || [])[1] || ''}</td><td>${(x.targets.find((t) => /Isolation/.test(t[0])) || [])[1] || '—'}</td></tr>`).join('')}</table></div>`));
        return;
      }
      root.appendChild(html(`<div class="page-head"><div class="eyebrow"><a href="#/guides">Guides</a> / Design guide</div><h1>${g.name}</h1><p>${g.summary}</p></div>`));
      root.appendChild(html(`<div class="stats">${g.targets.map(([k, v]) => A.statBox(k, `<span style="font-size:1rem">${v}</span>`)).join('')}</div>`));
      const grid = el('div', { class: 'grid g2' });
      grid.appendChild(html(`<div class="card"><h2 style="margin-top:0">Design sequence</h2><ol class="steps">${g.steps.map((s) => `<li>${s}</li>`).join('')}</ol></div>`));
      grid.appendChild(html(`<div><div class="card"><h3 style="margin-top:0">Treatment kit</h3>${ul(g.treatment)}</div><div class="card"><h3 style="margin-top:0">Common mistakes</h3>${ul(g.mistakes)}</div>${g.alternatives.length ? `<div class="callout alt">${g.alternatives.join('<br>')}</div>` : ''}</div>`));
      root.appendChild(grid);
      const extra = el('div', { class: 'card', style: { marginTop: '16px' } });
      if (['control-room', 'home-studio', 'mastering'].includes(g.id)) { extra.appendChild(html('<h3 style="margin-top:0">Plan your reflections</h3>')); V.reflections(extra, g.id === 'home-studio' ? { L: 5.2, W: 3.9 } : { L: 7, W: 5.5 }); root.appendChild(extra); }
      if (['concert-hall', 'theatre', 'worship'].includes(g.id)) { extra.appendChild(html('<h3 style="margin-top:0">Hall shape and early reflections</h3>')); V.hall(extra); root.appendChild(extra); }
      if (['vocal-booth', 'podcast'].includes(g.id)) { extra.appendChild(html('<h3 style="margin-top:0">Why small rooms sound boxy — explore the modes</h3>')); V.modes2D(extra, { L: 2.2, W: 1.8 }); root.appendChild(extra); }
      root.appendChild(html(`<div class="row" style="margin-top:16px"><a class="btn primary" href="#/analyzer">${A.icon('room')} Analyse your room</a><a class="btn" href="#/isolation">${A.icon('wall')} Plan isolation</a><a class="btn" href="#/workshop">${A.icon('hammer')} Build the treatment</a></div>`));
    },
  });

  /* ---------------- workshop ---------------- */
  A.register('workshop', {
    title: 'Workshop',
    render(root, params) {
      const w = LIB.workshop.find((x) => x.id === params[0]);
      if (!w) {
        A.pageHead(root, 'Build & reference', 'Workshop', 'Build sheets for the things acousticians specify most often. Each links to the designer that sizes it for your room.');
        const grid = el('div', { class: 'grid gauto' });
        LIB.workshop.forEach((x) => grid.appendChild(html(`<a class="tile" href="#/workshop/${x.id}">${A.workshopThumb && A.workshopThumb(x.id) ? `<div class="wk-thumb">${A.workshopThumb(x.id)}</div>` : ''}<div class="row" style="justify-content:space-between"><span class="pill">${x.level}</span><span class="small">${x.time} · ${x.cost}</span></div><h3 style="margin-top:8px">${x.name}</h3><p>${x.summary}</p></a>`)));
        root.appendChild(grid);
        root.appendChild(html(`<div class="callout warn">Safety: wear gloves, a dust mask (P2/N95 or better) and eye protection when cutting mineral wool; use fire-rated materials; hang anything overhead with rated fixings into structure.</div>`));
        return;
      }
      root.appendChild(html(`<div class="page-head"><div class="eyebrow"><a href="#/workshop">Workshop</a> / ${w.level} · ${w.time} · cost ${w.cost}</div><h1>${w.name}</h1><p>${w.summary}</p></div>`));
      const grid = el('div', { class: 'grid g2' });
      grid.appendChild(html(`<div class="card"><h3 style="margin-top:0">Materials</h3>${ul(w.materials)}<h3>Tools</h3>${ul(w.tools)}</div>`));
      grid.appendChild(html(`<div class="card"><h3 style="margin-top:0">Steps</h3><ol class="steps">${w.steps.map((s) => `<li>${s}</li>`).join('')}</ol></div>`));
      const dh = el('div', { style: { marginBottom: '16px' } });
      root.appendChild(dh);
      if (A.workshopDrawing) A.workshopDrawing(w.id, dh);
      root.appendChild(grid);
      root.appendChild(html(`<div class="callout mentor">${w.tips.join(' ')}</div>`));
      const names = { absorbers: 'Absorber Designer', diffusers: 'Diffuser Designer', isolation: 'Soundproofing', floors: 'Floating Floor Designer', calc: 'Calculators', treatment: 'Treatment Simulator' };
      root.appendChild(html(`<p><a class="btn primary" href="#/${w.calc}">Size it in the ${names[w.calc]} →</a></p>`));
    },
  });

  /* ---------------- cases ---------------- */
  A.register('cases', {
    title: 'Case Studies',
    render(root, params) {
      const c = LIB.cases.find((x) => x.id === params[0]);
      if (!c) {
        A.pageHead(root, 'Build & reference', 'Case Studies', 'Problems, diagnoses, solutions and results — with before/after charts computed by the same physics as the tools. Real venues are summarised from widely published facts; project cases are illustrative composites.');
        const tags = [...new Set(LIB.cases.flatMap((x) => x.tags))].sort();
        let tag = '';
        const bar = el('div', { class: 'glance' });
        const draw = () => {
          bar.innerHTML = `<a class="pill ${tag ? '' : 'on'}" href="javascript:void 0" data-t="">All (${LIB.cases.length})</a>` + tags.map((t) => `<a class="pill ${t === tag ? 'on' : ''}" href="javascript:void 0" data-t="${t}">${t}</a>`).join('');
          body.innerHTML = '';
          [['Project case', 'Project cases — problem → solution → result'], ['Illustrative project', 'More illustrative projects'], ['Real hall', 'Landmark halls']].forEach(([type, title]) => {
            const list = LIB.cases.filter((x) => x.type === type && (!tag || x.tags.includes(tag)));
            if (!list.length) return;
            body.appendChild(html(`<div class="group-title"><h2>${title}</h2><span>${list.length}</span></div>`));
            const grid = el('div', { class: 'grid gauto' });
            list.forEach((x) => grid.appendChild(html(`<a class="tile case-tile" href="#/cases/${x.id}">${x.stats ? `<div class="case-stats">${x.stats.slice(0, 2).map(([k, b, a]) => `<div><span>${k}</span><b>${b} → <em>${a}</em></b></div>`).join('')}</div>` : ''}<div>${x.tags.map((t) => `<span class="pill">${t}</span>`).join('')}</div><h3 style="margin-top:8px">${x.name}</h3><p>${x.summary}</p></a>`)));
            body.appendChild(grid);
          });
        };
        bar.addEventListener('click', (e) => { const t = e.target.dataset.t; if (t == null) return; tag = t; draw(); });
        const body = el('div');
        root.append(bar, body);
        draw();
        return;
      }
      root.appendChild(html(`<div class="page-head"><div class="eyebrow"><a href="#/cases">Case studies</a> / ${c.type}</div><h1>${c.name}</h1><p>${c.summary}</p></div>`));
      if (c.stats) root.appendChild(html(`<div class="ba-grid">${c.stats.map(([k, b, a]) => `<div class="ba"><div class="k">${k}</div><div class="ba-row"><span class="ba-b">${b}</span><span class="ba-arrow">→</span><span class="ba-a">${a}</span></div></div>`).join('')}</div>`));
      if (c.flow) root.appendChild(html(`<div class="flowline case-flow">${c.flow.map(([t, d], i) => `<div class="flowstep"><span class="flownum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('')}</div>`));
      const grid = el('div', { class: c.viz ? 'grid g2' : '' });
      const b = el('div', { class: 'card lesson' }); b.innerHTML = c.body; grid.appendChild(b);
      if (c.viz) { const v = el('div', { class: 'card' }); v.appendChild(html('<h3 style="margin-top:0">Before & after</h3>')); grid.appendChild(v); c.viz(v); }
      root.appendChild(grid);
      if (c.tags.includes('shoebox') || c.tags.includes('vineyard')) { const x = el('div', { class: 'card', style: { marginTop: '16px' } }); x.appendChild(html('<h3 style="margin-top:0">Compare hall forms</h3>')); root.appendChild(x); V.hall(x); }
      if (c.id === 'mix-translation') { const x = el('div', { class: 'card', style: { marginTop: '16px' } }); root.appendChild(x); V.modes2D(x, { L: 3, W: 3 }); }
      if (c.id === 'rooftop-hvac') { const x = el('div', { class: 'card', style: { marginTop: '16px' } }); root.appendChild(x); V.transmissibility(x, { fn: 3.2, ff: 24 }); }
      const i = LIB.cases.indexOf(c), nx = LIB.cases[(i + 1) % LIB.cases.length];
      root.appendChild(html(`<p style="margin-top:18px"><a class="btn" href="#/cases">← All cases</a> <a class="btn primary" href="#/cases/${nx.id}">Next: ${nx.name} →</a></p>`));
    },
  });

  /* ---------------- masters ---------------- */
  A.register('masters', {
    title: 'Masters & Schools',
    render(root) {
      A.pageHead(root, 'Build & reference', 'Masters & Schools of Thought', 'The people and philosophies behind modern acoustics and studio design. Learn their ideas, compare approaches, and keep your own notes as you study their work.');
      LIB.masters.forEach((grp) => {
        root.appendChild(html(`<h2>${grp.group}</h2>`));
        if (grp.note) root.appendChild(html(`<div class="callout">${grp.note}</div>`));
        const grid = el('div', { class: 'grid g2' });
        grp.people.forEach((p) => {
          const c = el('div', { class: 'card' });
          c.innerHTML = `<div class="small accent" style="text-transform:uppercase;letter-spacing:.08em">${p.role}</div><h3 style="margin:.2em 0 .5em">${p.name}</h3>${ul(p.ideas)}<div class="small"><b>Study next:</b> ${p.learn.join(' · ')}</div>`;
          const notes = el('textarea', { placeholder: 'Your notes on this designer’s work (saved in this browser)…', style: { marginTop: '10px', minHeight: '60px' } });
          notes.value = A.store.get('note:' + p.id, '');
          notes.oninput = () => A.store.set('note:' + p.id, notes.value);
          c.appendChild(notes);
          grid.appendChild(c);
        });
        root.appendChild(grid);
      });
      root.appendChild(html(`<h2>Comparing control-room philosophies</h2><div class="table-wrap"><table>
        <tr><th></th><th>LEDE</th><th>RFZ</th><th>Non-environment</th><th>Small-room evidence-based</th></tr>
        <tr><td>Front of room</td><td>Absorptive</td><td>Splayed/reflective geometry steering reflections away + absorption</td><td>Hard, massive, flush-mounted monitors</td><td>Treat early reflections as needed</td></tr>
        <tr><td>Rear of room</td><td>Live, diffusive</td><td>Diffusive</td><td>Highly absorptive (deep)</td><td>Absorptive/diffusive by distance</td></tr>
        <tr><td>Low frequencies</td><td>Traps</td><td>Traps, geometry</td><td>Very deep wideband absorption in walls/ceiling</td><td>Positioning + multiple subs + traps</td></tr>
        <tr><td>Space needed</td><td>Medium</td><td>Medium–large</td><td>Large (deep wall cavities)</td><td>Any</td></tr>
        <tr><td>Sound</td><td>Clear with ambience</td><td>Precise and open</td><td>Very direct and revealing</td><td>Depends on execution</td></tr>
      </table></div>`));
    },
  });

  /* ---------------- materials ---------------- */
  A.register('materials', {
    title: 'Materials Library',
    render(root) {
      A.pageHead(root, 'Build & reference', 'Materials Library', 'Typical random-incidence absorption coefficients for common finishes and treatments, porous material properties, and panel properties for isolation. Click rows to compare them on the chart.');
      const card = el('div', { class: 'card' }); root.appendChild(card);
      const top = el('div', { class: 'row' });
      const q = el('input', { type: 'search', placeholder: 'Filter…', style: { flex: '1' } });
      const cats = [...new Set(D.MATERIALS.map((m) => m.cat))];
      const cat = el('select'); cat.appendChild(el('option', { value: '' }, 'All categories')); cats.forEach((c) => cat.appendChild(el('option', { value: c }, c)));
      top.append(q, cat); card.appendChild(top);
      let picked = ['carpet-thin', 'mw-100-gap', 'membrane'];
      const chartHost = el('div'); card.appendChild(chartHost);
      const legend = el('div'); card.appendChild(legend);
      const tbl = el('div', { class: 'table-wrap', style: { maxHeight: '520px', marginTop: '10px' } }); card.appendChild(tbl);
      let chart = null;
      function drawChart() {
        chartHost.innerHTML = ''; legend.innerHTML = '';
        A.anim.loops.forEach((l) => { if (!document.contains(l.el)) A.anim.loops.delete(l); });
        chart = V.alphaBars(chartHost, picked.map((id) => D.mat(id)), { height: 220, max: 1.1 });
        legend.appendChild(A.legend(picked.map((id, k) => [A.series(k), D.mat(id).name])));
      }
      function drawTable() {
        const t = q.value.toLowerCase();
        const rows = D.MATERIALS.filter((m) => (!cat.value || m.cat === cat.value) && (!t || (m.name + m.cat).toLowerCase().includes(t)));
        tbl.innerHTML = `<table><tr><th>Material</th><th>Category</th>${P.BANDS6.map((f) => `<th class="num">${A.shortHz(f)}</th>`).join('')}<th class="num">NRC</th></tr>${rows.map((m) => `<tr data-id="${m.id}" style="cursor:pointer;${picked.includes(m.id) ? 'background:color-mix(in srgb, var(--accent) 12%, transparent)' : ''}"><td>${m.name}</td><td class="small">${m.cat}</td>${m.a.map((a) => `<td class="num">${fmt(a, 2)}</td>`).join('')}<td class="num"><b>${fmt(m.nrc, 2)}</b></td></tr>`).join('')}</table>`;
      }
      tbl.addEventListener('click', (e) => { const tr = e.target.closest('tr[data-id]'); if (!tr) return; const id = tr.dataset.id; picked = picked.includes(id) ? picked.filter((x) => x !== id) : picked.concat(id).slice(-5); drawChart(); drawTable(); });
      q.oninput = drawTable; cat.onchange = drawTable;
      drawChart(); drawTable();
      void chart;
      root.appendChild(html(`<h2>Porous materials</h2><div class="table-wrap"><table><tr><th>Material</th><th class="num">Density kg/m³</th><th class="num">Flow resistivity Pa·s/m²</th></tr>${D.POROUS.map((m) => `<tr><td>${m.name}</td><td class="num">${m.rho}</td><td class="num">${m.sigma.toLocaleString()}</td></tr>`).join('')}</table></div>`));
      root.appendChild(html(`<h2>Panels for isolation</h2><div class="table-wrap"><table><tr><th>Material</th><th class="num">Density kg/m³</th><th class="num">E (GPa)</th><th class="num">Loss factor</th><th class="num">fc @ typical t</th></tr>${Object.entries(P.PANELS).map(([k, m]) => { const t = { gypsum: 0.0125, gypsumX: 0.0159, glass: 0.006, lamGlass: 0.0088, concrete: 0.15, cmu: 0.19, brick: 0.11, steel: 0.002, mlv: 0.0025 }[k] || 0.018; return `<tr><td>${m.name}</td><td class="num">${m.rho}</td><td class="num">${fmt(m.E / 1e9, 2)}</td><td class="num">${m.eta}</td><td class="num">${A.fmtHz(P.criticalFreq(m, t))} @ ${fmt(t * 1000, 1)} mm</td></tr>`; }).join('')}</table></div>`));
      root.appendChild(html(`<div class="callout warn">Values are typical published figures for orientation. Products vary widely with density, facing and mounting. For final design use the manufacturer’s laboratory report (ISO 354 / ASTM C423 for absorption; ISO 10140 / ASTM E90 for transmission loss) and note the mounting type.</div>`));
    },
  });

  /* ---------------- glossary ---------------- */
  A.register('glossary', {
    title: 'Glossary & Formulas',
    render(root, params) {
      A.pageHead(root, 'Learn', 'Glossary & Formula Sheet', 'Every term and equation used in Acoustica, in one place.');
      A.tabs(root, [['terms', 'Glossary'], ['formulas', 'Formula sheet']], (id, body) => {
        if (id === 'terms') {
          const q = el('input', { type: 'search', placeholder: 'Search terms…', style: { width: '100%', maxWidth: '420px', marginBottom: '12px' } });
          body.appendChild(q);
          const list = el('div', { class: 'card' }); body.appendChild(list);
          const hl = params[0] ? decodeURIComponent(params[0]) : '';
          const draw = () => {
            const t = q.value.toLowerCase();
            list.innerHTML = LIB.glossary.filter(([a, b]) => !t || (a + b).toLowerCase().includes(t)).map(([a, b]) => `<div id="g-${a.replace(/\W+/g, '')}" style="padding:8px 0;border-bottom:1px solid var(--line);${a === hl ? 'background:color-mix(in srgb, var(--accent) 12%, transparent)' : ''}"><b>${a}</b><div class="small" style="color:var(--text);opacity:.85">${b}</div></div>`).join('');
          };
          q.oninput = draw; draw();
          if (hl) setTimeout(() => { const n = document.getElementById('g-' + hl.replace(/\W+/g, '')); if (n) n.scrollIntoView({ block: 'center' }); }, 50);
        } else {
          const grid = el('div', { class: 'grid g2' }); body.appendChild(grid);
          LIB.formulas.forEach(([n, f, note]) => grid.appendChild(html(`<div class="formula" style="white-space:normal"><span class="lbl">${n}${note ? ' — ' + note : ''}</span>${f}</div>`)));
        }
      });
    },
  });
})();
