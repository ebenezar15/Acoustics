/* ==========================================================================
   Acoustica core: namespace, storage, themes, router, UI helpers,
   canvas/animation manager, plotting primitives and shared audio context.
   ========================================================================== */
(function () {
  'use strict';
  const A = (window.A = window.A || {});

  /* ---------------- tiny DOM helpers ---------------- */
  A.$ = (s, r = document) => r.querySelector(s);
  A.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  A.el = function (tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      e.appendChild(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
    return e;
  };
  A.html = function (str) {
    const t = document.createElement('template');
    t.innerHTML = str.trim();
    return t.content.childElementCount === 1 ? t.content.firstElementChild : t.content;
  };
  A.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  A.fmt = function (n, d = 1) {
    if (n == null || !isFinite(n)) return '—';
    const a = Math.abs(n);
    if (a !== 0 && (a >= 1e6 || a < 1e-3)) return n.toExponential(2);
    return Number(n).toFixed(d).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  };
  A.fmtHz = (f) => (f >= 1000 ? A.fmt(f / 1000, f >= 10000 ? 0 : 1) + ' kHz' : A.fmt(f, f < 100 ? 1 : 0) + ' Hz');
  A.fmtLen = (m) => (m < 0.01 ? A.fmt(m * 1000, 1) + ' mm' : m < 1 ? A.fmt(m * 100, 1) + ' cm' : A.fmt(m, 2) + ' m');
  A.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  A.lerp = (a, b, t) => a + (b - a) * t;

  A.toast = function (msg, ms = 2200) {
    const t = A.el('div', { class: 'toast' }, msg);
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms);
  };

  /* ---------------- storage (never required to work) ---------------- */
  A.store = {
    get(k, d) { try { const v = localStorage.getItem('acoustica:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('acoustica:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };

  /* ---------------- icons (inline SVG, stroke-based) ---------------- */
  const ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    book: '<path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4z"/><path d="M20 4h-4a3 3 0 00-3 3"/><path d="M20 4v14h-6"/>',
    wave: '<path d="M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0"/>',
    ear: '<path d="M6 9a6 6 0 1112 0c0 4-4 5-4 9a3 3 0 01-6 0"/><path d="M9 9a3 3 0 016 0"/>',
    room: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 15l5-4 5 3 8-6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    wall: '<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M3 15h18M9 4v5M15 9v6M9 15v5"/>',
    floor: '<path d="M2 18h20M4 14h16v4H4z"/><path d="M6 14v-2M10 14v-2M14 14v-2M18 14v-2"/><path d="M3 10h18"/>',
    spring: '<path d="M12 2v3l-5 2 10 3-10 3 10 3-5 2v4"/>',
    calc: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    map: '<path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    hall: '<path d="M3 21V9l9-6 9 6v12"/><path d="M7 21v-6h10v6M7 11h10"/>',
    star: '<path d="M12 3l2.7 5.6 6.2.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.2-.9z"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14a5 5 0 016 6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    tool: '<path d="M14 6a4 4 0 105 5l-8 8-3-3z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    palette: '<path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.2-1.6-.4-1 .3-2.4 1.8-2.4H17a4 4 0 004-4c0-5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    stop: '<rect x="6" y="6" width="12" height="12"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 2-2.5 2-2.5 4M12 17h.01"/>',
    diffuser: '<path d="M3 20V8h3v12M6 20V4h3v16M9 20v-9h3v9M12 20V6h3v14M15 20v-7h3v7M18 20V9h3v11"/>',
    absorb: '<path d="M4 4h4v16H4z"/><path d="M12 7c2 1 2 3 0 4s-2 3 0 4M17 5c3 2 3 5 0 7s-3 5 0 7"/>',
    hammer: '<path d="M14 4l6 6-3 3-6-6z"/><path d="M11 7L3 15l3 3 8-8"/>',
    lab: '<path d="M9 3h6M10 3v6l-6 10a1.5 1.5 0 001.3 2h13.4A1.5 1.5 0 0020 19L14 9V3"/><path d="M7 15h10"/>',
    speaker: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="6.5" r="1.5"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    graduation: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  };
  A.icon = (name, cls = '') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.wave}</svg>`;

  /* ---------------- themes ---------------- */
  A.THEMES = {
    'control-room': { name: 'Control Room', dark: true, bg: '#0d1117', bg2: '#121924', panel: '#161f2c', panel2: '#1c2738', line: '#263449', text: '#e6edf6', muted: '#8fa1b8', accent: '#f5a524', accent2: '#38bdf8', ink: '#1a1203', series: ['#f5a524', '#38bdf8', '#a78bfa', '#34d399', '#f472b6', '#fb7185'] },
    'studio-daylight': { name: 'Studio Daylight', dark: false, bg: '#f7f5f0', bg2: '#efece4', panel: '#ffffff', panel2: '#f3f0e8', line: '#e2ddd1', text: '#1f2328', muted: '#6b6457', accent: '#c2410c', accent2: '#0369a1', ink: '#ffffff', series: ['#c2410c', '#0369a1', '#7c3aed', '#047857', '#be185d', '#b45309'] },
    'oak-felt': { name: 'Oak & Felt', dark: true, bg: '#17130f', bg2: '#1d1813', panel: '#241e17', panel2: '#2d251c', line: '#3c3226', text: '#f1e9dc', muted: '#b5a48c', accent: '#d9a441', accent2: '#7fb77e', ink: '#1b1405', series: ['#d9a441', '#7fb77e', '#e07a5f', '#81b2d9', '#c39bd3', '#f2cc8f'] },
    'ocean-lab': { name: 'Ocean Lab', dark: true, bg: '#061a1f', bg2: '#082229', panel: '#0b2a33', panel2: '#0f3540', line: '#16485a', text: '#e0f4f7', muted: '#86b3bd', accent: '#2dd4bf', accent2: '#fbbf24', ink: '#03201c', series: ['#2dd4bf', '#fbbf24', '#60a5fa', '#f472b6', '#a3e635', '#fb923c'] },
    'nordic': { name: 'Nordic Minimal', dark: false, bg: '#f3f5f7', bg2: '#e9edf1', panel: '#ffffff', panel2: '#f0f3f6', line: '#d9e0e7', text: '#15202b', muted: '#5f6f80', accent: '#1d4ed8', accent2: '#0f766e', ink: '#ffffff', series: ['#1d4ed8', '#0f766e', '#b91c1c', '#7c3aed', '#c2410c', '#0e7490'] },
    'ember': { name: 'Ember', dark: true, bg: '#140b0b', bg2: '#1b0f0f', panel: '#231414', panel2: '#2c1919', line: '#432525', text: '#f8e9e4', muted: '#c39b90', accent: '#ff6b35', accent2: '#ffd166', ink: '#200a02', series: ['#ff6b35', '#ffd166', '#06d6a0', '#7cb7ff', '#ef476f', '#c77dff'] },
    'synthwave': { name: 'Synthwave', dark: true, bg: '#120b25', bg2: '#170f30', panel: '#1e1440', panel2: '#26194f', line: '#38286e', text: '#f3eaff', muted: '#a99bd0', accent: '#ff4fd8', accent2: '#3cf0ff', ink: '#1a0016', series: ['#ff4fd8', '#3cf0ff', '#ffe66d', '#7cff9b', '#ff8a5c', '#a78bfa'] },
    'paper': { name: 'Paper & Ink', dark: false, bg: '#fbfaf7', bg2: '#f4f2ec', panel: '#ffffff', panel2: '#f6f4ee', line: '#e5e1d6', text: '#111111', muted: '#666055', accent: '#111111', accent2: '#b91c1c', ink: '#ffffff', series: ['#111111', '#b91c1c', '#1d4ed8', '#15803d', '#a16207', '#7e22ce'] },
    'high-contrast': { name: 'High Contrast', dark: true, bg: '#000000', bg2: '#0a0a0a', panel: '#111111', panel2: '#1a1a1a', line: '#5a5a5a', text: '#ffffff', muted: '#d0d0d0', accent: '#ffe600', accent2: '#00e5ff', ink: '#000000', series: ['#ffe600', '#00e5ff', '#ff5cf0', '#5cff7a', '#ff9d00', '#ffffff'] },
  };

  A.theme = {
    current: null,
    apply(id, customAccent) {
      const t = A.THEMES[id] || A.THEMES['control-room'];
      const r = document.documentElement.style;
      const accent = customAccent || t.accent;
      const map = { bg: t.bg, bg2: t.bg2, panel: t.panel, panel2: t.panel2, line: t.line, text: t.text, muted: t.muted, accent, accent2: t.accent2, 'accent-ink': customAccent ? A.theme.inkFor(customAccent) : t.ink };
      for (const k in map) r.setProperty('--' + k, map[k]);
      const s = t.series.slice();
      if (customAccent) s[0] = customAccent;
      s.forEach((c, i) => r.setProperty('--c' + (i + 1), c));
      r.setProperty('--good', t.dark ? '#34d399' : '#15803d');
      r.setProperty('--warn', t.dark ? '#fbbf24' : '#b45309');
      r.setProperty('--bad', t.dark ? '#f87171' : '#b91c1c');
      r.setProperty('--shadow', t.dark ? '0 10px 30px rgba(0,0,0,.4)' : '0 10px 30px rgba(30,30,50,.12)');
      document.documentElement.style.colorScheme = t.dark ? 'dark' : 'light';
      document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
      A.theme.current = id;
      A.theme.custom = customAccent || null;
      A.store.set('theme', { id, accent: customAccent || null });
      A._cssCache = null;
      window.dispatchEvent(new Event('themechange'));
    },
    inkFor(hex) {
      const c = hex.replace('#', '');
      const n = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16);
      const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#111111' : '#ffffff';
    },
    init() {
      const saved = A.store.get('theme', null);
      let id = saved && saved.id;
      if (!id) id = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'studio-daylight' : 'control-room';
      A.theme.apply(id, saved && saved.accent);
    },
  };

  /* read colour tokens for canvas drawing (cached per theme) */
  A.css = function (name) {
    if (!A._cssCache) A._cssCache = {};
    if (!(name in A._cssCache)) A._cssCache[name] = getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim();
    return A._cssCache[name];
  };
  A.series = (i) => A.css('c' + ((i % 6) + 1));
  A.alpha = function (hex, a) {
    if (!hex || hex[0] !== '#') return hex;
    let c = hex.slice(1);
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const n = parseInt(c, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };

  /* ---------------- router & page registry ---------------- */
  A.pages = {};
  A.nav = [];
  A.register = function (id, def) { A.pages[id] = Object.assign({ id }, def); };
  A.cleanups = [];
  A.onLeave = (fn) => A.cleanups.push(fn);
  A.go = (hash) => { location.hash = hash; };

  A.route = function () {
    const raw = location.hash.replace(/^#\/?/, '') || 'home';
    const [id, ...rest] = raw.split('/');
    const page = A.pages[id] || A.pages.home;
    A.cleanups.splice(0).forEach((fn) => { try { fn(); } catch (e) { console.warn(e); } });
    A.anim.stopAll();
    A.audio.stopAll();
    const host = A.$('#page');
    host.innerHTML = '';
    const wrap = A.el('div', { class: 'page' });
    host.appendChild(wrap);
    try {
      page.render(wrap, rest.map(decodeURIComponent));
    } catch (e) {
      console.error(e);
      wrap.innerHTML = `<div class="card"><h2>Something went wrong</h2><p class="muted">${A.esc(e.message)}</p></div>`;
    }
    A.$$('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.id === page.id));
    document.title = (page.title ? page.title + ' · ' : '') + 'Acoustica';
    A.$('.sidebar').classList.remove('open');
    if (!rest.length || page.scrollTop !== false) window.scrollTo(0, 0);
  };

  /* ---------------- animation / canvas manager ---------------- */
  A.anim = {
    loops: new Set(),
    stopAll() { this.loops.forEach((l) => l.stop()); this.loops.clear(); },
  };

  /**
   * A.canvas(host, {height, aspect, draw(ctx, w, h, t, dt), animate, onPointer})
   * Creates a HiDPI canvas that redraws on resize/theme change and optionally animates
   * (only while visible on screen).
   */
  A.canvas = function (host, opts) {
    const box = A.el('div', { class: 'viz' });
    const cv = A.el('canvas');
    box.appendChild(cv);
    if (opts.caption) box.appendChild(A.el('div', { class: 'cap', html: opts.caption }));
    host.appendChild(box);
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, raf = 0, running = false, visible = true, last = 0, t0 = performance.now();
    const api = { el: box, canvas: cv, ctx, opts, paused: false };
    function size() {
      const cw = box.clientWidth || 600;
      const ch = opts.height || Math.round(cw * (opts.aspect || 0.5));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
      cv.style.height = ch + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = cw; h = ch; api.w = w; api.h = h;
    }
    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      if (visible && !api.paused) draw((now - t0) / 1000, dt);
      raf = requestAnimationFrame(frame);
    }
    function draw(t = (performance.now() - t0) / 1000, dt = 0) {
      if (!w) size();
      ctx.clearRect(0, 0, w, h);
      try { opts.draw(ctx, w, h, t, dt, api); } catch (e) { console.error(e); }
    }
    api.redraw = () => draw();
    api.start = () => { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); A.anim.loops.add(api); };
    api.stop = () => { running = false; cancelAnimationFrame(raf); };
    api.resize = () => { size(); draw(); };
    const ro = new ResizeObserver(() => { const old = w; size(); if (old !== w || !running) draw(); });
    ro.observe(box);
    const io = new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; });
    io.observe(box);
    const onTheme = () => draw();
    window.addEventListener('themechange', onTheme);
    A.onLeave(() => { ro.disconnect(); io.disconnect(); window.removeEventListener('themechange', onTheme); api.stop(); });
    if (opts.onPointer) {
      const handler = (ev) => {
        const r = cv.getBoundingClientRect();
        const p = ev.touches ? ev.touches[0] : ev;
        opts.onPointer({ x: p.clientX - r.left, y: p.clientY - r.top, type: ev.type, buttons: ev.buttons }, api);
        if (!running) draw();
      };
      ['pointerdown', 'pointermove', 'pointerup', 'pointerleave'].forEach((e) => cv.addEventListener(e, handler));
    }
    size();
    if (opts.animate) api.start(); else requestAnimationFrame(() => draw());
    return api;
  };

  /* ---------------- plotting primitives ---------------- */
  /**
   * A.axes(ctx, w, h, {x:{min,max,log,label,ticks,fmt}, y:{...}, pad})
   * draws grid + labels and returns {X(v), Y(v), x0,x1,y0,y1}
   */
  A.axes = function (ctx, w, h, o) {
    const pad = Object.assign({ l: 52, r: 16, t: 14, b: 38 }, o.pad || {});
    const x0 = pad.l, x1 = w - pad.r, y0 = h - pad.b, y1 = pad.t;
    const xa = o.x, ya = o.y;
    const X = xa.log
      ? (v) => x0 + ((Math.log10(v) - Math.log10(xa.min)) / (Math.log10(xa.max) - Math.log10(xa.min))) * (x1 - x0)
      : (v) => x0 + ((v - xa.min) / (xa.max - xa.min)) * (x1 - x0);
    const Y = ya.log
      ? (v) => y0 - ((Math.log10(v) - Math.log10(ya.min)) / (Math.log10(ya.max) - Math.log10(ya.min))) * (y0 - y1)
      : (v) => y0 - ((v - ya.min) / (ya.max - ya.min)) * (y0 - y1);
    const line = A.css('line'), muted = A.css('muted');
    ctx.save();
    ctx.font = '11px ' + getComputedStyle(document.body).fontFamily;
    ctx.lineWidth = 1;
    const xt = xa.ticks || (xa.log ? A.logTicks(xa.min, xa.max) : A.niceTicks(xa.min, xa.max, Math.max(3, Math.floor((x1 - x0) / 80))));
    const yt = ya.ticks || A.niceTicks(ya.min, ya.max, Math.max(3, Math.floor((y0 - y1) / 40)));
    ctx.strokeStyle = A.alpha(line, 1) || line;
    ctx.fillStyle = muted;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (const t of xt) {
      if (t < xa.min || t > xa.max) continue;
      const x = Math.round(X(t)) + 0.5;
      ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y0); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillText(xa.fmt ? xa.fmt(t) : xa.log ? A.shortHz(t) : A.fmt(t, 2), x, y0 + 6);
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (const t of yt) {
      if (t < ya.min - 1e-9 || t > ya.max + 1e-9) continue;
      const y = Math.round(Y(t)) + 0.5;
      ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillText(ya.fmt ? ya.fmt(t) : A.fmt(t, 2), x0 - 6, y);
    }
    ctx.strokeStyle = muted; ctx.globalAlpha = 0.7;
    ctx.strokeRect(x0 + 0.5, y1 + 0.5, x1 - x0, y0 - y1);
    ctx.globalAlpha = 1;
    if (xa.label) { ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(xa.label, (x0 + x1) / 2, h - 2); }
    if (ya.label) { ctx.save(); ctx.translate(12, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ya.label, 0, 0); ctx.restore(); }
    ctx.restore();
    return { X, Y, x0, x1, y0, y1 };
  };
  A.shortHz = (f) => (f >= 1000 ? (f / 1000) + 'k' : String(Math.round(f)));
  A.logTicks = function (min, max) {
    const out = [];
    const base = [1, 2, 5];
    for (let e = Math.floor(Math.log10(min)); e <= Math.ceil(Math.log10(max)); e++)
      for (const b of base) { const v = b * Math.pow(10, e); if (v >= min && v <= max) out.push(v); }
    return out;
  };
  A.niceTicks = function (min, max, n = 5) {
    const span = max - min;
    if (!(span > 0)) return [min];
    const step0 = span / n;
    const mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const r = step0 / mag;
    const step = (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * mag;
    const out = [];
    for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) out.push(+v.toFixed(10));
    return out;
  };
  /** polyline through points [[x,y],...] using axis mappers */
  A.plotLine = function (ctx, ax, pts, color, width = 2, dash) {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round';
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    let started = false;
    ctx.rect(ax.x0, ax.y1, ax.x1 - ax.x0, ax.y0 - ax.y1); ctx.clip();
    ctx.beginPath();
    for (const [x, y] of pts) {
      if (!isFinite(y)) { started = false; continue; }
      const px = ax.X(x), py = ax.Y(y);
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  };
  A.plotFill = function (ctx, ax, pts, color, baseY) {
    ctx.save();
    ctx.beginPath(); ctx.rect(ax.x0, ax.y1, ax.x1 - ax.x0, ax.y0 - ax.y1); ctx.clip();
    ctx.fillStyle = color;
    ctx.beginPath();
    const by = baseY == null ? ax.y0 : ax.Y(baseY);
    ctx.moveTo(ax.X(pts[0][0]), by);
    for (const [x, y] of pts) ctx.lineTo(ax.X(x), ax.Y(y));
    ctx.lineTo(ax.X(pts[pts.length - 1][0]), by);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  A.text = function (ctx, s, x, y, o = {}) {
    ctx.save();
    ctx.font = `${o.weight || 500} ${o.size || 12}px ` + getComputedStyle(document.body).fontFamily;
    ctx.fillStyle = o.color || A.css('text');
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.base || 'alphabetic';
    if (o.bg) {
      const m = ctx.measureText(s);
      const pw = m.width + 8, ph = (o.size || 12) + 6;
      let bx = x - 4; if (ctx.textAlign === 'center') bx = x - pw / 2; if (ctx.textAlign === 'right') bx = x - pw + 4;
      let by = y - ph + 4; if (ctx.textBaseline === 'middle') by = y - ph / 2; if (ctx.textBaseline === 'top') by = y - 3;
      ctx.fillStyle = o.bg; ctx.fillRect(bx, by, pw, ph);
      ctx.fillStyle = o.color || A.css('text');
    }
    ctx.fillText(s, x, y);
    ctx.restore();
  };
  A.legend = function (items) {
    return A.html(`<div class="legend">${items.map(([c, l, dash]) => `<span><i style="background:${c};${dash ? 'background:repeating-linear-gradient(90deg,' + c + ' 0 4px,transparent 4px 7px)' : ''}"></i>${l}</span>`).join('')}</div>`);
  };

  /* ---------------- control builder ---------------- */
  /**
   * A.controls(host, spec, onChange) — spec: [{key,label,type,min,max,step,value,unit,options,fmt,hint}]
   * returns state object (live), plus .set(key, value)
   */
  A.controls = function (host, spec, onChange, cls = 'ctrl-grid') {
    const grid = A.el('div', { class: cls });
    const state = {};
    const inputs = {};
    const fire = A.debounceFrame(() => onChange && onChange(state));
    for (const s of spec) {
      if (s.type === 'heading') { grid.appendChild(A.el('div', { style: { gridColumn: '1/-1', marginTop: '6px' }, html: `<h4 style="margin:0">${s.label}</h4>` })); continue; }
      state[s.key] = s.value;
      const wrap = A.el('div', { class: 'ctrl' + (s.type === 'check' ? ' check' : ''), title: s.hint || '' });
      let input;
      const val = A.el('b');
      const showVal = () => {
        if (s.type === 'range') val.textContent = (s.fmt ? s.fmt(state[s.key]) : A.fmt(state[s.key], 3)) + (s.unit ? ' ' + s.unit : '');
      };
      if (s.type === 'select') {
        input = A.el('select');
        for (const o of s.options) {
          const [v, l] = Array.isArray(o) ? o : typeof o === 'object' ? [o.value, o.label] : [o, o];
          const op = A.el('option', { value: v }, l);
          if (String(v) === String(s.value)) op.selected = true;
          input.appendChild(op);
        }
        input.addEventListener('change', () => { const v = input.value; state[s.key] = s.numeric ? +v : v; fire(); });
        wrap.appendChild(A.el('label', {}, s.label));
        wrap.appendChild(input);
      } else if (s.type === 'check') {
        input = A.el('input', { type: 'checkbox', id: 'c_' + s.key + Math.random().toString(36).slice(2, 6) });
        input.checked = !!s.value;
        input.addEventListener('change', () => { state[s.key] = input.checked; fire(); });
        wrap.appendChild(input);
        wrap.appendChild(A.el('label', { for: input.id }, s.label));
      } else if (s.type === 'number' || s.type === 'text') {
        input = A.el('input', { type: s.type, value: s.value, min: s.min, max: s.max, step: s.step || 'any' });
        input.addEventListener('input', () => { state[s.key] = s.type === 'number' ? parseFloat(input.value) || 0 : input.value; fire(); });
        wrap.appendChild(A.el('label', {}, s.label + (s.unit ? ` (${s.unit})` : '')));
        wrap.appendChild(input);
      } else {
        input = A.el('input', { type: 'range', min: s.min, max: s.max, step: s.step || 'any', value: s.value });
        input.addEventListener('input', () => { state[s.key] = parseFloat(input.value); showVal(); fire(); });
        const lab = A.el('label', {}, A.el('span', {}, s.label), val);
        wrap.appendChild(lab); wrap.appendChild(input);
        showVal();
      }
      inputs[s.key] = { input, showVal, s };
      grid.appendChild(wrap);
    }
    host.appendChild(grid);
    Object.defineProperty(state, 'set', {
      enumerable: false,
      value(k, v, silent) {
        const it = inputs[k]; if (!it) return;
        state[k] = v;
        if (it.s.type === 'check') it.input.checked = !!v; else it.input.value = v;
        it.showVal && it.showVal();
        if (!silent) fire();
      },
    });
    Object.defineProperty(state, 'el', { enumerable: false, value: grid });
    return state;
  };
  A.debounceFrame = function (fn) {
    let q = false;
    return function () { if (q) return; q = true; requestAnimationFrame(() => { q = false; fn(); }); };
  };
  A.seg = function (options, value, onChange) {
    const s = A.el('div', { class: 'seg' });
    options.forEach(([v, l]) => {
      const b = A.el('button', { class: v === value ? 'on' : '' }, l);
      b.addEventListener('click', () => { A.$$('button', s).forEach((x) => x.classList.remove('on')); b.classList.add('on'); onChange(v); });
      s.appendChild(b);
    });
    return s;
  };
  A.tabs = function (host, tabs, onSelect, initial) {
    const bar = A.el('div', { class: 'tabs' });
    const body = A.el('div');
    host.appendChild(bar); host.appendChild(body);
    const select = (id) => {
      A.$$('button', bar).forEach((b) => b.classList.toggle('on', b.dataset.id === id));
      body.innerHTML = '';
      A.anim.loops.forEach((l) => { if (!document.contains(l.el)) { l.stop(); A.anim.loops.delete(l); } });
      A.audio.stopAll();
      onSelect(id, body);
    };
    tabs.forEach(([id, label]) => {
      const b = A.el('button', { 'data-id': id }, label);
      b.addEventListener('click', () => select(id));
      bar.appendChild(b);
    });
    select(initial || tabs[0][0]);
    return { select };
  };
  A.pageHead = function (host, eyebrow, title, lead) {
    host.appendChild(A.html(`<div class="page-head"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${lead ? `<p>${lead}</p>` : ''}</div>`));
  };
  A.statBox = (k, v, d, cls = '') => `<div class="stat"><div class="k">${k}</div><div class="v ${cls}">${v}</div>${d ? `<div class="d">${d}</div>` : ''}</div>`;

  /* ---------------- audio ---------------- */
  A.audio = {
    ctx: null,
    get() {
      if (!this.ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) { A.toast('Web Audio is not supported in this browser'); return null; }
        this.ctx = new C();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    noiseBuffer(type = 'pink', seconds = 4) {
      const ctx = this.get(); if (!ctx) return null;
      const n = Math.floor(ctx.sampleRate * seconds);
      const buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, br = 0;
      for (let i = 0; i < n; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'white') d[i] = white * 0.35;
        else if (type === 'brown') { br = (br + 0.02 * white) / 1.02; d[i] = br * 3.2; }
        else {
          // Paul Kellet's refined pink filter
          b0 = 0.99886 * b0 + white * 0.0555179; b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852; b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522; b5 = -0.7616 * b5 - white * 0.016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
          b6 = white * 0.115926;
        }
      }
      return buf;
    },
    stopAll() { (this.active || []).forEach((n) => { try { n.stop(); } catch (e) { /* */ } }); this.active = []; },
    track(n) { (this.active = this.active || []).push(n); return n; },
    /** play a sine tone for `dur` seconds with soft envelope */
    tone(freq, dur = 1.5, gainDb = -18, type = 'sine') {
      const ctx = this.get(); if (!ctx) return;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      const peak = Math.pow(10, gainDb / 20), t = ctx.currentTime;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.05);
      g.gain.setValueAtTime(peak, t + dur - 0.1); g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
      return this.track(o);
    },
  };
})();
