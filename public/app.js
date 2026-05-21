import { FESTIVALS } from './data.js';

window.toggleSearchClear = function () {
  const val = document.getElementById('search').value;
  document.getElementById('search-clear').style.display = val ? 'flex' : 'none';
};

// ─────────────────────────────────────────────
// SAVED / BOOKMARKS
// ─────────────────────────────────────────────
// TODO: swap localStorage for InstantDB
// Replace getSaved/setSaved with InstantDB read/write:
// import { init, tx, id } from '@instantdb/core'
// const db = init({ appId: 'YOUR_APP_ID' })
// async getSaved() { const { data } = await db.queryOnce({ saved: {} }); return data.saved.map(s => s.name) }
// async setSaved(arr) { ... }

function getSaved() {
  try { return JSON.parse(localStorage.getItem('festival_saved') || '[]'); }
  catch { return []; }
}
function setSaved(arr) {
  localStorage.setItem('festival_saved', JSON.stringify(arr));
}
function isSaved(name) { return getSaved().includes(name); }
function toggleSaved(name) {
  const saved = getSaved();
  const idx = saved.indexOf(name);
  if (idx > -1) saved.splice(idx, 1);
  else saved.push(name);
  setSaved(saved);
  refreshSaveButtons(name);
  if (showSavedOnly) applyFilters();
}
function refreshSaveButtons(name) {
  // Update all heart buttons for this festival name
  document.querySelectorAll(`[data-save-name="${CSS.escape ? CSS.escape(name) : name}"]`).forEach(btn => {
    if (isSaved(name)) btn.classList.add('saved');
    else btn.classList.remove('saved');
  });
}

// ── STATE ──
let activeMonths = [];
let activeTags = [];
let activeCountry = '';
let currentView = 'grid';
let showSavedOnly = false;

const SMILEY_SVG = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="vertical-align:middle;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="2.5"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="2.5"/><path d="M8 14h8"/><path d="M10 14c0 1.5.5 3 2 3s2-1.5 2-3"/></svg>';
const MONTHS = ['May', 'June', 'July', 'August', 'September'];
const TAG_LABELS = ['Curated', 'Electronic', 'Techno', 'Psytrance', 'Mindfulness', 'Burner', 'Offgrid', 'World Music', 'Arts'];
const COUNTRIES = [...new Set(FESTIVALS.map(f => f.country))].sort();

function heartSVG(filled, size) {
  const s = size || 12;
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
}

// ── BUILD FILTERS ──
function buildFilters() {
  const mf = document.getElementById('month-filters');
  MONTHS.forEach(m => {
    const p = document.createElement('div');
    p.className = 'pill';
    p.textContent = m;
    p.onclick = () => { toggleArr(activeMonths, m); p.classList.toggle('active'); applyFilters(); };
    mf.appendChild(p);
  });

  const pill = document.getElementById('country-pill');
  const dropdown = document.getElementById('country-dropdown');
  const pillLabel = document.getElementById('country-pill-label');

  const allOpt = document.createElement('div');
  allOpt.className = 'country-option selected';
  allOpt.textContent = 'All countries';
  allOpt.onclick = () => {
    activeCountry = '';
    pillLabel.textContent = 'All countries';
    pill.classList.remove('active');
    dropdown.querySelectorAll('.country-option').forEach(o => o.classList.remove('selected'));
    allOpt.classList.add('selected');
    pill.classList.remove('open');
    applyFilters();
  };
  dropdown.appendChild(allOpt);

  COUNTRIES.forEach(c => {
    const opt = document.createElement('div');
    opt.className = 'country-option';
    opt.textContent = c;
    opt.onclick = () => {
      activeCountry = c;
      pillLabel.textContent = c;
      pill.classList.add('active');
      dropdown.querySelectorAll('.country-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      pill.classList.remove('open');
      applyFilters();
    };
    dropdown.appendChild(opt);
  });

  pill.addEventListener('click', e => {
    if (e.target.closest('.country-option')) return;
    pill.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.country-pill')) {
      document.querySelectorAll('.country-pill').forEach(p => p.classList.remove('open'));
    }
  });

  const tf = document.getElementById('tag-filters');
  const savedPill = document.createElement('div');
  savedPill.className = 'pill saved-pill';
  savedPill.id = 'saved-filter-pill';
  savedPill.innerHTML = heartSVG(false, 12) + ' Saved';
  savedPill.onclick = () => {
    showSavedOnly = !showSavedOnly;
    savedPill.classList.toggle('active', showSavedOnly);
    savedPill.innerHTML = heartSVG(showSavedOnly, 12) + ' Saved';
    applyFilters();
  };
  tf.appendChild(savedPill);

  const TAG_COLORS = {
    'Curated': ['#e8a045', 'rgba(232,160,69,0.15)', 'rgba(232,160,69,0.4)'],
    'Electronic': ['#7c6af0', 'rgba(124,106,240,0.15)', 'rgba(124,106,240,0.4)'],
    'Techno': ['#ff6b9d', 'rgba(255,107,157,0.15)', 'rgba(255,107,157,0.4)'],
    'Psytrance': ['#c45af0', 'rgba(196,90,240,0.15)', 'rgba(196,90,240,0.4)'],
    'Mindfulness': ['#3ecfb2', 'rgba(62,207,178,0.15)', 'rgba(62,207,178,0.4)'],
    'Burner': ['#ff7043', 'rgba(255,112,67,0.15)', 'rgba(255,112,67,0.4)'],
    'Offgrid': ['#45e88a', 'rgba(69,232,138,0.15)', 'rgba(69,232,138,0.4)'],
    'World Music': ['#f07c6a', 'rgba(240,124,106,0.15)', 'rgba(240,124,106,0.4)'],
    'Arts': ['#6ab4f0', 'rgba(106,180,240,0.15)', 'rgba(106,180,240,0.4)'],
  };

  TAG_LABELS.forEach(t => {
    const p = document.createElement('div');
    p.className = 'pill';
    const ICONS = { 'Electronic': 'ϟ', 'Techno': '◈', 'Psytrance': '✺', 'Mindfulness': '◎', 'Offgrid': '▲' };
    const ICON_SVGS = {
      'Curated': '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="2.5"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="2.5"/><path d="M8 14h8"/><path d="M10 14c0 1.5.5 3 2 3s2-1.5 2-3"/></svg>',
      'World Music': '<svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      'Burner': '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z"/><path d="M12 12c0 3-2 4-2 6a2 2 0 0 0 4 0c0-2-2-3-2-6z"/></svg>',
      'Arts': '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.48 1 3.5 1 1.96 0 3.5-1.54 3.5-3.5 0-1.68-1.33-3.04-2-2.54z"/></svg>',
    };
    p.innerHTML = (ICON_SVGS[t] || (ICONS[t] ? '<span style="margin-right:5px;">' + ICONS[t] + '</span>' : '')) + t;
    const c = TAG_COLORS[t];
    p.onclick = () => {
      toggleArr(activeTags, t);
      const isActive = activeTags.includes(t);
      if (isActive && c) {
        p.style.color = c[0];
        p.style.background = c[1];
        p.style.borderColor = c[2];
      } else {
        p.style.color = '';
        p.style.background = '';
        p.style.borderColor = '';
      }
      applyFilters();
    };
    tf.appendChild(p);
  });
}
function toggleArr(arr, val) {
  const i = arr.indexOf(val);
  if (i > -1) arr.splice(i, 1); else arr.push(val);
}

function matchesTags(f, active) {
  if (!active.length) return true;
  const curatedRequired = active.includes('Curated');
  const otherTags = active.filter(t => t !== 'Curated');
  if (curatedRequired && !f.curated) return false;
  if (otherTags.length && !otherTags.some(t => f.tags.includes(t))) return false;
  return true;
}

function applyFilters() {
  const q = document.getElementById('search').value.toLowerCase().trim();
  const country = activeCountry;
  const saved = getSaved();
  const filtered = FESTIVALS.filter(f => {
    if (showSavedOnly && !saved.includes(f.name)) return false;
    if (activeMonths.length && !activeMonths.includes(f.month)) return false;
    if (country && f.country !== country) return false;
    if (!matchesTags(f, activeTags)) return false;
    if (q) {
      const hay = `${f.name} ${f.location} ${f.country} ${f.tags.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  document.getElementById('festival-count').textContent = filtered.length;
  renderGrid(filtered);
  renderList(filtered);
}

// ── HELPERS ──
function formatDates(f) {
  const s = new Date(f.start + 'T00:00:00');
  const e = new Date(f.end + 'T00:00:00');
  const mos = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (s.getMonth() === e.getMonth()) return `${s.getDate()}–${e.getDate()} ${mos[s.getMonth()]}`;
  return `${s.getDate()} ${mos[s.getMonth()]}–${e.getDate()} ${mos[e.getMonth()]}`;
}

function tagEl(t, small) {
  const chip = document.createElement('span');
  const cls = t.replace(/\s+/g, '\\ ');
  chip.className = `tag tag-${t.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')}`;
  chip.classList.add(`tag-${t.replace(/\s+/g, "-")}`);
  if (small) { chip.style.fontSize = '9px'; chip.style.padding = '2px 7px'; }
  chip.textContent = t;
  // apply color inline via data attr for flexible CSS
  const colors = {
    'Electronic': ['#7c6af0', 'rgba(124,106,240,0.12)', 'rgba(124,106,240,0.25)'],
    'Techno': ['#ff6b9d', 'rgba(255,107,157,0.12)', 'rgba(255,107,157,0.25)'],
    'Psytrance': ['#c45af0', 'rgba(196,90,240,0.12)', 'rgba(196,90,240,0.25)'],
    'Mindfulness': ['#3ecfb2', 'rgba(62,207,178,0.12)', 'rgba(62,207,178,0.25)'],
    'Burner': ['#ff7043', 'rgba(255,112,67,0.12)', 'rgba(255,112,67,0.25)'],
    'Offgrid': ['#45e88a', 'rgba(69,232,138,0.12)', 'rgba(69,232,138,0.25)'],
    'World Music': ['#f07c6a', 'rgba(240,124,106,0.12)', 'rgba(240,124,106,0.25)'],
    'Arts': ['#6ab4f0', 'rgba(106,180,240,0.12)', 'rgba(106,180,240,0.25)'],
  };
  const c = colors[t];
  if (c) {
    chip.style.color = c[0];
    chip.style.background = c[1];
    chip.style.border = `1px solid ${c[2]}`;
  }
  return chip;
}

function saveBtnEl(f) {
  const btn = document.createElement('button');
  btn.className = 'card-save-btn' + (isSaved(f.name) ? ' saved' : '');
  btn.setAttribute('data-save-name', f.name);
  btn.innerHTML = heartSVG(isSaved(f.name), 15);
  btn.title = isSaved(f.name) ? 'Remove from saved' : 'Save festival';
  btn.onclick = (e) => {
    e.stopPropagation();
    toggleSaved(f.name);
    btn.innerHTML = heartSVG(isSaved(f.name), 15);
    btn.title = isSaved(f.name) ? 'Remove from saved' : 'Save festival';
    if (isSaved(f.name)) btn.classList.add('saved'); else btn.classList.remove('saved');
  };
  return btn;
}

function imgEl(src, cls, alt) {
  const img = document.createElement('img');
  img.className = cls;
  img.alt = alt;
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.onerror = function () {
    const ph = document.createElement('div');
    ph.className = cls === 'card-img' ? 'card-img-placeholder' : 'list-img-placeholder';
    ph.textContent = '🎪';
    this.parentNode.replaceChild(ph, this);
  };
  img.src = src;
  return img;
}

// ── RENDER GRID ──
function renderGrid(festivals) {
  const el = document.getElementById('grid-view');
  el.innerHTML = '';
  if (!festivals.length) {
    el.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>No festivals found</h3><p>Try adjusting your filters</p></div>';
    return;
  }
  festivals.forEach((f, i) => {
    const card = document.createElement('div');
    card.className = 'card' + (f.curated ? ' curated' : '');
    card.style.animationDelay = `${Math.min(i, 20) * 0.03}s`;
    card.onclick = () => openDetail(f);

    if (f.curated) {
      const ribbon = document.createElement('div');
      ribbon.className = 'curated-ribbon';
      ribbon.innerHTML = SMILEY_SVG;
      card.appendChild(ribbon);
    }

    card.appendChild(saveBtnEl(f));
    card.appendChild(imgEl(f.img, 'card-img', f.name));

    const body = document.createElement('div');
    body.className = 'card-body';

    const top = document.createElement('div');
    top.className = 'card-top';
    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = f.name;
    top.appendChild(name);
    if (!f.tickets) {
      const badge = document.createElement('span');
      badge.className = 'badge badge-soldout';
      badge.textContent = 'Sold Out';
      top.appendChild(badge);
    }

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.innerHTML = `
  <div class="card-meta-row">
    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ${formatDates(f)}
  </div>
  <div class="card-meta-row">
    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
    ${f.location}, ${f.country}
  </div>
`;

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'card-tags';
    f.tags.slice(0, 3).forEach(t => tagsWrap.appendChild(tagEl(t)));
    const arrow = document.createElement('span');
    arrow.className = 'card-arrow';
    arrow.textContent = '→';
    footer.appendChild(tagsWrap);
    footer.appendChild(arrow);

    body.appendChild(top);
    body.appendChild(meta);
    body.appendChild(footer);
    card.appendChild(body);
    el.appendChild(card);
  });
}

// ── RENDER LIST ──
function renderList(festivals) {
  const el = document.getElementById('list-view');
  el.innerHTML = '';
  if (!festivals.length) {
    el.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>No festivals found</h3><p>Try adjusting your filters</p></div>';
    return;
  }
  const grouped = {};
  festivals.forEach(f => { if (!grouped[f.month]) grouped[f.month] = []; grouped[f.month].push(f); });
  const monthNums = { 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9 };
  Object.keys(grouped).sort((a, b) => monthNums[a] - monthNums[b]).forEach(month => {
    const grp = document.createElement('div');
    grp.className = 'month-group';
    const hdr = document.createElement('div');
    hdr.className = 'month-header';
    hdr.innerHTML = `<span>◆</span>${month.toUpperCase()} <span style="color:var(--text-dim);font-weight:400;font-size:10px;margin-left:8px;">${grouped[month].length} events</span>`;
    grp.appendChild(hdr);
    grouped[month].forEach((f, i) => {
      const item = document.createElement('div');
      item.className = 'list-item' + (f.curated ? ' curated' : '');
      item.style.animationDelay = `${Math.min(i, 20) * 0.02}s`;
      item.onclick = () => openDetail(f);
      item.appendChild(imgEl(f.img, 'list-img', f.name));
      const info = document.createElement('div');
      info.className = 'list-info';
      const nameRow = document.createElement('div');
      nameRow.className = 'list-name';
      nameRow.textContent = f.name;
      if (f.curated) {
        const lc = document.createElement('span');
        lc.className = 'list-curated';
        lc.innerHTML = SMILEY_SVG;
        nameRow.appendChild(lc);
      }
      const metaRow = document.createElement('div');
      metaRow.className = 'list-meta';
      metaRow.innerHTML = `<span class="list-meta-item"><svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${formatDates(f)}</span><span class="list-meta-item"><svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>${f.location}</span>`;
      info.appendChild(nameRow);
      info.appendChild(metaRow);

      const right = document.createElement('div');
      right.className = 'list-right';
      const listSaveBtn = document.createElement('button');
      listSaveBtn.className = 'list-save-btn' + (isSaved(f.name) ? ' saved' : '');
      listSaveBtn.setAttribute('data-save-name', f.name);
      listSaveBtn.title = isSaved(f.name) ? 'Remove from saved' : 'Save festival';
      listSaveBtn.innerHTML = heartSVG(isSaved(f.name), 16);
      listSaveBtn.onclick = (e) => {
        e.stopPropagation();
        toggleSaved(f.name);
        const saved = isSaved(f.name);
        listSaveBtn.classList.toggle('saved', saved);
        listSaveBtn.title = saved ? 'Remove from saved' : 'Save festival';
        listSaveBtn.innerHTML = heartSVG(saved, 16);
      };
      right.appendChild(listSaveBtn);

      item.appendChild(info);
      item.appendChild(right);
      grp.appendChild(item);
    });
    el.appendChild(grp);
  });
}

// ── DETAIL PANEL ──
function openDetail(f, replace) {
  // Hero BG
  const heroBg = document.getElementById('detail-hero-bg');
  heroBg.src = f.img;
  heroBg.alt = f.name;
  heroBg.referrerPolicy = 'no-referrer';
  heroBg.style.display = 'block';
  heroBg.onerror = function () { this.style.display = 'none'; };

  document.getElementById('detail-name').textContent = f.name;

  const badgesEl = document.getElementById('detail-badges');
  badgesEl.innerHTML = '';
  if (f.curated) {
    const cb = document.createElement('span');
    cb.className = 'badge-curated-detail';
    cb.innerHTML = SMILEY_SVG + ' Curated';
    badgesEl.appendChild(cb);
  }
  if (!f.tickets) {
    const tb = document.createElement('span');
    tb.className = 'badge badge-soldout';
    tb.textContent = 'Sold Out';
    badgesEl.appendChild(tb);
  }

  document.getElementById('detail-dates').textContent = formatDates(f);
  document.getElementById('detail-location').textContent = `${f.location}, ${f.country}`;

  const tagsEl = document.getElementById('detail-tags');
  tagsEl.innerHTML = '';
  f.tags.forEach(t => tagsEl.appendChild(tagEl(t)));

  // Actions
  const actionsEl = document.getElementById('detail-actions');
  actionsEl.innerHTML = '';

  if (f.website) {
    const wb = document.createElement('a');
    wb.className = 'btn-website';
    wb.href = f.website;
    wb.target = '_blank';
    wb.rel = 'noopener';
    wb.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Visit website`;
    actionsEl.appendChild(wb);
  }

  if (f.instagram) {
    const ib = document.createElement('a');
    ib.className = 'btn-instagram';
    ib.href = f.instagram;
    ib.target = '_blank';
    ib.rel = 'noopener';
    ib.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg> Instagram`;
    actionsEl.appendChild(ib);
  }

  // Save button in detail
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn-save-detail' + (isSaved(f.name) ? ' saved' : '');
  saveBtn.setAttribute('data-save-name', f.name);
  saveBtn.innerHTML = heartSVG(isSaved(f.name), 14) + " " + (isSaved(f.name) ? "Saved" : "Save");

  const mobileSaveBtn = document.getElementById('detail-save-mobile');
  mobileSaveBtn.className = 'detail-save-mobile' + (isSaved(f.name) ? ' saved' : '');
  mobileSaveBtn.innerHTML = heartSVG(isSaved(f.name), 14);

  const syncSave = () => {
    const saved = isSaved(f.name);
    saveBtn.classList.toggle('saved', saved);
    saveBtn.innerHTML = heartSVG(saved, 14) + " " + (saved ? "Saved" : "Save");
    mobileSaveBtn.classList.toggle('saved', saved);
    mobileSaveBtn.innerHTML = heartSVG(saved, 14);
  };

  saveBtn.onclick = () => { toggleSaved(f.name); syncSave(); };
  mobileSaveBtn.onclick = () => { toggleSaved(f.name); syncSave(); };
  actionsEl.appendChild(saveBtn);

  // Rich content (curated with description)
  const richEl = document.getElementById('detail-rich');
  const noDataEl = document.getElementById('detail-no-data');

  if (f.description) {
    const descEl = document.getElementById('detail-description');
    if (f.html_content) {
      descEl.innerHTML = f.html_content;
      if (f.quote) {
        const quoteEl = document.createElement('blockquote');
        quoteEl.className = 'detail-quote';
        quoteEl.innerHTML = f.quote.split('\n\n').map(p => `<p>${p}</p>`).join('');
        descEl.append(quoteEl);
      }
    } else if (f.description) {
      const paras = f.description.split('\n\n').filter(p => p.trim());
      descEl.innerHTML = paras.map(p => '<p>' + p + '</p>').join('');
    } else {
      descEl.textContent = '';
    }
    richEl.style.display = 'block';
    noDataEl.style.display = 'none';
  } else {
    richEl.style.display = 'none';
    noDataEl.style.display = 'block';
  }

  document.getElementById('view-detail').scrollTop = 0;
  document.getElementById('view-main').classList.add('slide-out');
  document.getElementById('view-detail').classList.add('open');
  const _slug = toSlug(f.name);
  const _histFn = replace ? 'replaceState' : 'pushState';
  history[_histFn]({ detail: f.name }, '', '?f=' + _slug);
  document.title = f.name + ' — Festival Season 2026';
  const _shortDesc = (f.description || '').replace(/\n/g, ' ').slice(0, 200);
  if (_metaDesc) _metaDesc.content = _shortDesc;
  if (_ogTitle) _ogTitle.content = f.name;
  if (_ogDesc) _ogDesc.content = _shortDesc;
  if (_ogImage) _ogImage.content = f.img || '';
}

function closeDetail(fromPopstate) {
  document.getElementById('view-detail').classList.remove('open');
  document.getElementById('view-main').classList.remove('slide-out');
  if (!fromPopstate) history.pushState({}, '', location.pathname);
  document.title = _origTitle;
  if (_metaDesc) _metaDesc.content = _origMetaDesc;
  if (_ogTitle) _ogTitle.content = _origOgTitle;
  if (_ogDesc) _ogDesc.content = _origOgDesc;
  if (_ogImage) _ogImage.content = _origOgImage;
}

window.addEventListener('popstate', () => closeDetail(true));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

// ── VIEW TOGGLE ── (fixed: both start hidden, .active shows)
function setView(v) {
  currentView = v;
  const grid = document.getElementById('grid-view');
  const list = document.getElementById('list-view');
  const btnGrid = document.getElementById('btn-grid');
  const btnList = document.getElementById('btn-list');
  if (v === 'grid') {
    grid.style.removeProperty('display');
    list.style.display = 'none';
    btnGrid.classList.add('active'); btnList.classList.remove('active');
  } else {
    grid.style.display = 'none';
    list.style.display = 'block';
    btnList.classList.add('active'); btnGrid.classList.remove('active');
  }
}

// ── COUNTDOWN – 3 next festivals, days only ──
function setupCountdown() {
  const now = new Date();
  const upcoming = FESTIVALS
    .map(f => ({ ...f, startDate: new Date(f.start + 'T00:00:00') }))
    .filter(f => f.startDate > now)
    .sort((a, b) => a.startDate - b.startDate)
    .slice(0, 3);

  upcoming.forEach((f, i) => {
    const days = Math.ceil((f.startDate - now) / 86400000);
    document.getElementById(`nuc-name-${i}`).textContent = f.name;
    document.getElementById(`nuc-meta-${i}`).textContent = `${formatDates(f)} · ${f.location}`;
    document.getElementById(`nuc-days-${i}`).textContent = days;
    const card = document.getElementById(`nuc-${i}`);
    if (card) card.onclick = () => openDetail(f);
  });
}

// ── SLUG / META HELPERS ──
function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
const _origTitle = document.title;
const _metaDesc = document.querySelector('meta[name="description"]');
const _ogTitle = document.querySelector('meta[property="og:title"]');
const _ogDesc = document.querySelector('meta[property="og:description"]');
const _ogImage = document.querySelector('meta[property="og:image"]');
const _origMetaDesc = _metaDesc ? _metaDesc.content : '';
const _origOgTitle = _ogTitle ? _ogTitle.content : '';
const _origOgDesc = _ogDesc ? _ogDesc.content : '';
const _origOgImage = _ogImage ? _ogImage.content : '';

// ── INIT ──
buildFilters();
applyFilters();
setView('grid');
setupCountdown();

// Expose to window for inline HTML handlers (onclick, oninput, onchange)
window.setView = setView;
window.applyFilters = applyFilters;
window.closeDetail = closeDetail;

// ── DEEP LINK ──
const _initSlug = new URLSearchParams(location.search).get('f');
if (_initSlug) {
  const _initFest = FESTIVALS.find(f => toSlug(f.name) === _initSlug);
  if (_initFest) openDetail(_initFest, true);
}
