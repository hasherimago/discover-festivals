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
let _toastTimer = null;
function showSaveToast(saving) {
  let toast = document.getElementById('save-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'save-toast';
    toast.className = 'save-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = saving ? 'Saved! Find it under the Saved filter' : 'Removed from saved';
  toast.classList.remove('visible');
  void toast.offsetWidth;
  toast.classList.add('visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
}

function toggleSaved(name) {
  const saved = getSaved();
  const idx = saved.indexOf(name);
  const saving = idx === -1;
  if (idx > -1) saved.splice(idx, 1);
  else saved.push(name);
  setSaved(saved);
  showSaveToast(saving);
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
let savedScrollY = 0;
let activeMonths = [];
let activeTags = [];
let activeCountry = '';
let currentView = 'grid';
let showSavedOnly = false;
let calendarCurrentMonth = null;

const SMILEY_SVG = '<svg width="13" height="13" viewBox="0 0 96 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;flex-shrink:0;"><path d="M87.1 35.2C87.1 32.2 87 28.8 86.7 24.9C85.1 5.4 68.2 2 47.5 2C26.8 2 9.9 5.4 8.3 24.9C8 28.8 7.9 32.2 7.9 35.2C3.3 37.3 0 42.2 0 47.9C0 54.8 4.8 60.6 11 61.6V70C11 82.8 21.4 93.2 34.3 93.2H60.8C73.6 93.2 84.1 82.8 84.1 70V61.6C90.3 60.6 95.1 54.9 95.1 47.9C95 42.2 91.7 37.3 87.1 35.2ZM82.1 54.5C81.6 54.5 81.4 54.5 81.3 54.4C80.2 54.1 79.1 54.4 78.2 55.1C77.3 55.8 76.8 56.8 76.8 58V70C76.8 78.8 69.6 86 60.7 86H34.3C25.4 86 18.2 78.8 18.2 70V58C18.2 56.9 17.7 55.8 16.8 55.1C15.9 54.4 14.8 54.2 13.7 54.4C13.6 54.4 13.3 54.5 12.9 54.5C9.8 54.5 7.2 51.5 7.2 47.9C7.2 45.1 8.8 42.7 11 41.8V42.5C11 44.5 12.6 46.1 14.6 46.1C16.6 46.1 18.2 44.5 18.2 42.5V35.2C18.2 32.3 19 29.6 20.4 27.3C26.9 29.8 36.6 31.5 47.5 31.5C58.4 31.5 68.1 29.9 74.6 27.3C75.9 29.6 76.8 32.3 76.8 35.2V42.5C76.8 44.5 78.4 46.1 80.4 46.1C82.4 46.1 84 44.5 84 42.5V41.8C86.2 42.7 87.8 45.1 87.8 47.9C87.8 51.6 85.2 54.5 82.1 54.5Z"/><path d="M34.1002 53.2004C37.6348 53.2004 40.5002 50.335 40.5002 46.8004C40.5002 43.2658 37.6348 40.4004 34.1002 40.4004C30.5656 40.4004 27.7002 43.2658 27.7002 46.8004C27.7002 50.335 30.5656 53.2004 34.1002 53.2004Z"/><path d="M60.9 53.2004C64.4346 53.2004 67.3 50.335 67.3 46.8004C67.3 43.2658 64.4346 40.4004 60.9 40.4004C57.3654 40.4004 54.5 43.2658 54.5 46.8004C54.5 50.335 57.3654 53.2004 60.9 53.2004Z"/><path d="M67.9998 65.4998C62.1998 64.1998 56.4998 61.0998 53.7998 59.6998C51.4998 58.4998 48.9998 58.8998 47.4998 60.1998C45.9998 58.8998 43.4998 58.4998 41.1998 59.6998C38.4998 61.0998 32.7998 64.1998 26.9998 65.4998C25.2998 65.8998 24.9998 68.2998 26.6998 68.9998C31.0998 70.9998 36.3998 72.1998 41.1998 71.5998C44.5998 71.1998 46.4998 69.8998 47.4998 68.3998C48.5998 69.9998 50.4998 71.1998 53.7998 71.5998C58.4998 72.1998 63.7998 70.9998 68.2998 68.9998C69.9998 68.2998 69.6998 65.8998 67.9998 65.4998Z"/></svg>';
const MONTHS = ['May', 'June', 'July', 'August', 'September'];
const TAG_ORDER = ["Electronic", "Techno", "Psytrance", "World Music", "Boutique", "Lake", "Beach", "Forest", "Offgrid", "Arts", "Mindfulness"];
const TAG_COLORS = {
  'Curated':    ['#e8a045', 'rgba(232,160,69,0.15)',   'rgba(232,160,69,0.4)'],
  'Electronic': ['#7c6af0', 'rgba(124,106,240,0.15)',  'rgba(124,106,240,0.4)'],
  'Techno':     ['#ff6b9d', 'rgba(255,107,157,0.15)',  'rgba(255,107,157,0.4)'],
  'Psytrance':  ['#c45af0', 'rgba(196,90,240,0.15)',   'rgba(196,90,240,0.4)'],
  'Mindfulness':['#3ecfb2', 'rgba(62,207,178,0.15)',   'rgba(62,207,178,0.4)'],
  'Burner':     ['#ff7043', 'rgba(255,112,67,0.15)',   'rgba(255,112,67,0.4)'],
  'Offgrid':    ['#45e88a', 'rgba(69,232,138,0.15)',   'rgba(69,232,138,0.4)'],
  'World Music':['#f07c6a', 'rgba(240,124,106,0.15)',  'rgba(240,124,106,0.4)'],
  'Arts':       ['#6ab4f0', 'rgba(106,180,240,0.15)',  'rgba(106,180,240,0.4)'],
  'Boutique':   ['#E879F9', 'rgba(232,121,249,0.12)',  'rgba(232,121,249,0.25)'],
  'Lake':       ['#22D3EE', 'rgba(34,211,238,0.12)',   'rgba(34,211,238,0.25)'],
  'Beach':      ['#FBBF24', 'rgba(251,191,36,0.12)',   'rgba(251,191,36,0.25)'],
  'Forest':     ['#86EFAC', 'rgba(134,239,172,0.12)',  'rgba(134,239,172,0.25)'],
};
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
  savedPill.innerHTML = heartSVG(false, 12) + '<span style="margin-left: 4px">Saved</span>';;
  savedPill.onclick = () => {
    showSavedOnly = !showSavedOnly;
    savedPill.classList.toggle('active', showSavedOnly);
    savedPill.innerHTML = heartSVG(showSavedOnly, 12) + ' Saved';
    document.getElementById('saved-info-bar').classList.toggle('visible', showSavedOnly);
    applyFilters();
  };
  tf.appendChild(savedPill);

  ['Curated', ...TAG_ORDER].forEach(t => {
    const p = document.createElement('div');
    p.className = 'pill';
    const ICONS = { 'Electronic': 'ϟ', 'Psytrance': '✺', 'Mindfulness': '◎' };
    const ICON_SVGS = {
      'Curated': '<svg width="13" height="13" viewBox="0 0 96 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M87.1 35.2C87.1 32.2 87 28.8 86.7 24.9C85.1 5.4 68.2 2 47.5 2C26.8 2 9.9 5.4 8.3 24.9C8 28.8 7.9 32.2 7.9 35.2C3.3 37.3 0 42.2 0 47.9C0 54.8 4.8 60.6 11 61.6V70C11 82.8 21.4 93.2 34.3 93.2H60.8C73.6 93.2 84.1 82.8 84.1 70V61.6C90.3 60.6 95.1 54.9 95.1 47.9C95 42.2 91.7 37.3 87.1 35.2ZM82.1 54.5C81.6 54.5 81.4 54.5 81.3 54.4C80.2 54.1 79.1 54.4 78.2 55.1C77.3 55.8 76.8 56.8 76.8 58V70C76.8 78.8 69.6 86 60.7 86H34.3C25.4 86 18.2 78.8 18.2 70V58C18.2 56.9 17.7 55.8 16.8 55.1C15.9 54.4 14.8 54.2 13.7 54.4C13.6 54.4 13.3 54.5 12.9 54.5C9.8 54.5 7.2 51.5 7.2 47.9C7.2 45.1 8.8 42.7 11 41.8V42.5C11 44.5 12.6 46.1 14.6 46.1C16.6 46.1 18.2 44.5 18.2 42.5V35.2C18.2 32.3 19 29.6 20.4 27.3C26.9 29.8 36.6 31.5 47.5 31.5C58.4 31.5 68.1 29.9 74.6 27.3C75.9 29.6 76.8 32.3 76.8 35.2V42.5C76.8 44.5 78.4 46.1 80.4 46.1C82.4 46.1 84 44.5 84 42.5V41.8C86.2 42.7 87.8 45.1 87.8 47.9C87.8 51.6 85.2 54.5 82.1 54.5Z"/><path d="M34.1002 53.2004C37.6348 53.2004 40.5002 50.335 40.5002 46.8004C40.5002 43.2658 37.6348 40.4004 34.1002 40.4004C30.5656 40.4004 27.7002 43.2658 27.7002 46.8004C27.7002 50.335 30.5656 53.2004 34.1002 53.2004Z"/><path d="M60.9 53.2004C64.4346 53.2004 67.3 50.335 67.3 46.8004C67.3 43.2658 64.4346 40.4004 60.9 40.4004C57.3654 40.4004 54.5 43.2658 54.5 46.8004C54.5 50.335 57.3654 53.2004 60.9 53.2004Z"/><path d="M67.9998 65.4998C62.1998 64.1998 56.4998 61.0998 53.7998 59.6998C51.4998 58.4998 48.9998 58.8998 47.4998 60.1998C45.9998 58.8998 43.4998 58.4998 41.1998 59.6998C38.4998 61.0998 32.7998 64.1998 26.9998 65.4998C25.2998 65.8998 24.9998 68.2998 26.6998 68.9998C31.0998 70.9998 36.3998 72.1998 41.1998 71.5998C44.5998 71.1998 46.4998 69.8998 47.4998 68.3998C48.5998 69.9998 50.4998 71.1998 53.7998 71.5998C58.4998 72.1998 63.7998 70.9998 68.2998 68.9998C69.9998 68.2998 69.6998 65.8998 67.9998 65.4998Z"/></svg>',
      'World Music': '<svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      'Burner': '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z"/><path d="M12 12c0 3-2 4-2 6a2 2 0 0 0 4 0c0-2-2-3-2-6z"/></svg>',
      'Arts': '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.48 1 3.5 1 1.96 0 3.5-1.54 3.5-3.5 0-1.68-1.33-3.04-2-2.54z"/></svg>',
      'Techno':   '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M7 1.5l5 2.9v5.2L7 12.5l-5-2.9V4.4z"/></svg>',
      'Boutique': '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M7 1l3.5 4.5-3.5 7.5-3.5-7.5z"/><path d="M3.5 5.5h7"/></svg>',
      'Lake':     '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M1 9c1.5-2 3-2 4.5 0s3 2 4.5 0M1 6c1.5-2 3-2 4.5 0s3 2 4.5 0M5 3c0-1.1.9-2 2-2s2 .9 2 2"/></svg>',
      'Beach':    '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><circle cx="7" cy="7" r="2.5"/><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.9 2.9l1.1 1.1M10 10l1.1 1.1M2.9 11.1L4 10M10 4l1.1-1.1"/></svg>',
      'Forest':   '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><path d="M7 1l3.5 5H9l2.5 4H2.5L5 6H3.5z"/><path d="M7 10v3"/></svg>',
      'Offgrid':  '<svg width="13" height="13" viewBox="0 0 14 14" style="vertical-align:middle;margin-right:5px;flex-shrink:0;"><rect x="0.5" y="10.5" width="2.5" height="3" rx="0.4" fill="currentColor"/><rect x="4" y="7" width="2.5" height="6.5" rx="0.4" fill="currentColor"/><rect x="7.5" y="3" width="2.5" height="10.5" rx="0.4" fill="currentColor"/><line x1="1" y1="1.5" x2="12.5" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
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

function sortFestivals(arr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = [];
  const past = [];
  arr.forEach(f => {
    const endDate = new Date(f.end + 'T00:00:00');
    (endDate >= today ? upcoming : past).push(f);
  });
  upcoming.sort((a, b) => new Date(a.start + 'T00:00:00') - new Date(b.start + 'T00:00:00'));
  past.sort((a, b) => new Date(b.start + 'T00:00:00') - new Date(a.start + 'T00:00:00'));
  return [...upcoming, ...past];
}

function applyFilters() {
  const _strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const q = _strip(document.getElementById('search').value).toLowerCase().trim();
  const country = activeCountry;
  const saved = getSaved();
  const filtered = FESTIVALS.filter(f => {
    if (showSavedOnly && !saved.includes(f.name)) return false;
    if (activeMonths.length && !activeMonths.includes(f.month)) return false;
    if (country && f.country !== country) return false;
    if (!matchesTags(f, activeTags)) return false;
    if (q) {
      const hay = _strip(`${f.name} ${f.location} ${f.country} ${f.tags.join(' ')} ${f.searchAlias || ''}`).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const sorted = sortFestivals(filtered);
  document.getElementById('festival-count').textContent = filtered.length;
  renderGrid(sorted);
  renderList(sorted);
  renderCalendar(sorted);
}

// ── HELPERS ──
function formatDates(f) {
  const s = new Date(f.start + 'T00:00:00');
  const e = new Date(f.end + 'T00:00:00');
  const mos = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yearSuffix = s.getFullYear() !== 2026 ? ` ${s.getFullYear()}` : '';
  if (s.getMonth() === e.getMonth()) return `${s.getDate()}–${e.getDate()} ${mos[s.getMonth()]}${yearSuffix}`;
  return `${s.getDate()} ${mos[s.getMonth()]}–${e.getDate()} ${mos[e.getMonth()]}${yearSuffix}`;
}

function tagEl(t, small) {
  const chip = document.createElement('span');
  const cls = t.replace(/\s+/g, '\\ ');
  chip.className = `tag tag-${t.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')}`;
  chip.classList.add(`tag-${t.replace(/\s+/g, "-")}`);
  if (small) { chip.style.fontSize = '9px'; chip.style.padding = '2px 7px'; }
  chip.textContent = t;
  const c = TAG_COLORS[t];
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
  img.decoding = 'async';
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

// ── NEWSLETTER PROMPT ──
function buildNewsletterPrompt() {
  const wrap = document.createElement('div');
  wrap.className = 'newsletter-prompt';
  wrap.style.cssText = 'grid-column: 1 / -1; padding: 20px 24px; border-radius: 12px; border: 1px solid rgba(232,168,48,0.3); display: flex; flex-direction: column; gap: 12px; margin-top: 4px;';

  const label = document.createElement('p');
  label.textContent = 'Get notified when these lineups drop';
  label.style.cssText = 'margin: 0; font-size: 14px; font-weight: 500; color: #fff;';

  const row = document.createElement('div');
  row.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap; max-width: 520px;';

  const input = document.createElement('input');
  input.type = 'email';
  input.placeholder = 'your@email.com';
  input.style.cssText = 'flex: 1; min-width: 180px; padding: 9px 12px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.3); background: transparent; color: inherit; font-size: 16px; outline: none; font-family: inherit;';

  const btn = document.createElement('button');
  btn.textContent = 'Notify me';
  btn.style.cssText = 'padding: 9px 18px; border-radius: 8px; border: none; background: #E8A830; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; flex-shrink: 0;';

  const msg = document.createElement('div');
  msg.style.cssText = 'font-size: 13px; display: none;';

  btn.onclick = async () => {
    const email = input.value.trim();
    if (!email) { input.focus(); return; }

    const savedNames = getSaved();
    const slugs = savedNames.map(function(n) {
      return n.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    });

    btn.disabled = true;
    btn.textContent = '…';

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, tags: slugs }),
      });
      const data = await res.json().catch(function() { return {}; });
      if (res.ok) {
        row.style.display = 'none';
        msg.style.display = 'block';
        msg.style.color = '#4caf50';
        msg.textContent = "You're in. We'll email you when lineups drop.";
      } else {
        msg.style.display = 'block';
        msg.style.color = '#e05a5a';
        msg.textContent = data.error || 'Something went wrong. Please try again.';
        btn.disabled = false;
        btn.textContent = 'Notify me';
      }
    } catch (_) {
      msg.style.display = 'block';
      msg.style.color = '#e05a5a';
      msg.textContent = 'Something went wrong. Please try again.';
      btn.disabled = false;
      btn.textContent = 'Notify me';
    }
  };

  row.appendChild(input);
  row.appendChild(btn);
  wrap.appendChild(label);
  wrap.appendChild(row);
  wrap.appendChild(msg);
  return wrap;
}

// ── RENDER GRID ──
function renderGrid(festivals) {
  const el = document.getElementById('grid-view');
  el.innerHTML = '';
  if (!festivals.length) {
    el.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>No festivals found</h3><p>Try adjusting your filters</p></div>';
    return;
  }
  if (showSavedOnly && festivals.length > 0) {
    el.appendChild(buildNewsletterPrompt());
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let dividerInserted = false;
  festivals.forEach((f, i) => {
    const isPast = new Date(f.end + 'T00:00:00') < today;
    if (isPast && !dividerInserted) {
      const divider = document.createElement('div');
      divider.className = 'past-divider';
      divider.innerHTML = '<span>Past festivals</span>';
      el.appendChild(divider);
      dividerInserted = true;
    }
    const card = document.createElement('div');
    card.className = 'card' + (f.curated ? ' curated' : '') + (isPast ? ' card--past' : '');
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

// ── RENDER CALENDAR ──
function renderCalendar(festivals) {
  const el = document.getElementById('calendar-view');
  el.innerHTML = '';

  const MONTH_ORDER = ['May', 'June', 'July', 'August', 'September'];
  const MONTH_NUM   = { May: 5, June: 6, July: 7, August: 8, September: 9 };
  const MONTH_DAYS  = { May: 31, June: 30, July: 31, August: 31, September: 30 };
  const PILL_BG = {
    Electronic: 'rgba(124,106,240,0.45)',
    Techno:     'rgba(255,107,157,0.45)',
    Psytrance:  'rgba(196,90,240,0.45)',
    Mindfulness:'rgba(62,207,178,0.45)',
    Burner:     'rgba(255,112,67,0.45)',
    Offgrid:    'rgba(69,232,138,0.45)',
    'World Music':'rgba(240,124,106,0.45)',
    Arts:       'rgba(106,180,240,0.45)',
  };

  const grouped = {};
  festivals.forEach(f => { if (!grouped[f.month]) grouped[f.month] = []; grouped[f.month].push(f); });
  const availableMonths = MONTH_ORDER.filter(m => grouped[m]?.length);

  if (!availableMonths.length) {
    el.innerHTML = '<div class="cal-empty">No festivals found</div>';
    return;
  }

  if (!calendarCurrentMonth || !availableMonths.includes(calendarCurrentMonth)) {
    const now = new Date();
    const nowNum = now.getMonth() + 1;
    const upcoming = availableMonths.filter(m => MONTH_NUM[m] >= nowNum);
    calendarCurrentMonth = upcoming.length ? upcoming[0] : availableMonths[availableMonths.length - 1];
  }

  const monthIdx      = availableMonths.indexOf(calendarCurrentMonth);
  const month         = calendarCurrentMonth;
  const daysInMonth   = MONTH_DAYS[month];
  const monthNum      = MONTH_NUM[month];
  const monthFests    = grouped[month] || [];

  // Header
  const header = document.createElement('div');
  header.className = 'cal-header';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'cal-nav-btn';
  prevBtn.textContent = '←';
  prevBtn.disabled = monthIdx === 0;
  prevBtn.onclick = () => { calendarCurrentMonth = availableMonths[monthIdx - 1]; renderCalendar(festivals); };

  const titleEl = document.createElement('div');
  titleEl.className = 'cal-month-title';
  titleEl.textContent = `${month} 2026`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cal-nav-btn';
  nextBtn.textContent = '→';
  nextBtn.disabled = monthIdx === availableMonths.length - 1;
  nextBtn.onclick = () => { calendarCurrentMonth = availableMonths[monthIdx + 1]; renderCalendar(festivals); };

  header.appendChild(prevBtn);
  header.appendChild(titleEl);
  header.appendChild(nextBtn);
  el.appendChild(header);

  // Timeline
  const timeline = document.createElement('div');
  timeline.className = 'cal-timeline';

  // Day labels
  const dayLabelsEl = document.createElement('div');
  dayLabelsEl.className = 'cal-day-labels';
  dayLabelsEl.style.gridTemplateColumns = `repeat(${daysInMonth}, 1fr)`;
  for (let d = 1; d <= daysInMonth; d++) {
    const lbl = document.createElement('div');
    lbl.className = 'cal-day-label';
    lbl.textContent = (d === 1 || d % 5 === 0) ? d : '';
    dayLabelsEl.appendChild(lbl);
  }
  timeline.appendChild(dayLabelsEl);

  // Compute clipped day ranges and assign lanes
  const withDays = monthFests.map(f => {
    const s = new Date(f.start + 'T00:00:00');
    const e = new Date(f.end   + 'T00:00:00');
    const startDay = s.getMonth() + 1 === monthNum ? s.getDate() : 1;
    const endDay   = e.getMonth() + 1 === monthNum ? e.getDate() : daysInMonth;
    return { f, startDay, endDay: Math.max(startDay, endDay) };
  }).sort((a, b) => a.startDay - b.startDay || a.endDay - b.endDay);

  const laneOccupied = [];
  const assigned = withDays.map(item => {
    let li = laneOccupied.findIndex(l => !l.some(r => r.start <= item.endDay && r.end >= item.startDay));
    if (li === -1) { li = laneOccupied.length; laneOccupied.push([]); }
    laneOccupied[li].push({ start: item.startDay, end: item.endDay });
    return { ...item, lane: li };
  });

  // Build lane rows
  const lanesEl = document.createElement('div');
  lanesEl.className = 'cal-lanes';
  for (let i = 0; i < laneOccupied.length; i++) {
    lanesEl.appendChild(Object.assign(document.createElement('div'), { className: 'cal-lane' }));
  }

  // Place pills
  assigned.forEach(({ f, startDay, endDay, lane }) => {
    const pill = document.createElement('div');
    pill.className = 'cal-pill' + (f.curated ? ' curated' : '');
    pill.title = f.name;
    const textSpan = document.createElement('span');
    textSpan.className = 'cal-pill-text';
    textSpan.textContent = `${f.name} · ${formatDates(f)}`;
    pill.appendChild(textSpan);
    pill.style.left  = `${((startDay - 1) / daysInMonth) * 100}%`;
    pill.style.width = `${((endDay - startDay + 1) / daysInMonth) * 100}%`;
    const colorTag = f.tags.find(t => PILL_BG[t]);
    pill.style.background = colorTag ? PILL_BG[colorTag] : 'rgba(255,255,255,0.12)';
    pill.onclick = () => openDetail(f);
    lanesEl.children[lane].appendChild(pill);
  });

  timeline.appendChild(lanesEl);

  // Today line
  const now = new Date();
  if (now.getFullYear() === 2026 && now.getMonth() + 1 === monthNum) {
    const todayWrap = document.createElement('div');
    todayWrap.className = 'cal-today-wrap';
    todayWrap.style.left = `${((now.getDate() - 0.5) / daysInMonth) * 100}%`;
    timeline.appendChild(todayWrap);
  }

  el.appendChild(timeline);

  // Mobile list (week-grouped, shown via CSS on narrow screens)
  const mobileList = document.createElement('div');
  mobileList.className = 'cal-mobile-list';

  const BORDER_COLORS = {
    Electronic:    '#7c6af0',
    Techno:        '#ff6b9d',
    Psytrance:     '#c45af0',
    Mindfulness:   '#3ecfb2',
    Burner:        '#ff7043',
    Offgrid:       '#45e88a',
    'World Music': '#f07c6a',
    Arts:          '#6ab4f0',
  };
  const weeks = [
    { start: 1,  end: 7,  label: `${month} 1–7`   },
    { start: 8,  end: 14, label: `${month} 8–14`  },
    { start: 15, end: 21, label: `${month} 15–21` },
    { start: 22, end: 28, label: `${month} 22–28` },
    { start: 29, end: 31, label: `${month} 29–31` },
  ];
  weeks.forEach(({ start, end, label }) => {
    const weekFests = monthFests.filter(f => {
      const s = new Date(f.start + 'T00:00:00');
      const e = new Date(f.end   + 'T00:00:00');
      const sd = s.getMonth() + 1 === monthNum ? s.getDate() : 1;
      const ed = e.getMonth() + 1 === monthNum ? e.getDate() : daysInMonth;
      return sd <= end && ed >= start;
    });
    if (!weekFests.length) return;

    const grp = document.createElement('div');
    grp.className = 'cal-week-group';

    const wlbl = document.createElement('div');
    wlbl.className = 'cal-week-label';
    wlbl.textContent = label;
    grp.appendChild(wlbl);

    weekFests.forEach(f => {
      const row = document.createElement('div');
      row.className = 'cal-mobile-row';
      const colorTag = f.tags.find(t => BORDER_COLORS[t]);
      row.style.borderLeftColor = colorTag ? BORDER_COLORS[colorTag] : 'rgba(255,255,255,0.2)';

      const nameEl = document.createElement('div');
      nameEl.className = 'cal-mobile-row-name';
      nameEl.textContent = f.name;
      if (f.curated) {
        nameEl.appendChild(document.createTextNode(' '));
        const ic = document.createElement('span');
        ic.className = 'list-curated';
        ic.innerHTML = SMILEY_SVG;
        nameEl.appendChild(ic);
      }

      const metaEl = document.createElement('div');
      metaEl.className = 'cal-mobile-row-meta';
      metaEl.textContent = `${formatDates(f)} · ${f.location}`;

      row.appendChild(nameEl);
      row.appendChild(metaEl);
      row.onclick = () => openDetail(f);
      grp.appendChild(row);
    });

    mobileList.appendChild(grp);
  });

  el.appendChild(mobileList);
}

// ── EDITORIAL RENDERER ──
function renderEditorial(editorial) {
  const labels = {
    about:     'About',
    vibe:      'The vibe',
    sounds:    'Sounds like',
    doNotMiss: 'Do not miss',
    tip:       'Insider tip',
  };
  const rows = Object.keys(labels)
    .filter(key => editorial[key])
    .map(key => `
      <div class="editorial__row">
        <div class="editorial__label">${labels[key]}</div>
        <div class="editorial__text">${editorial[key]}</div>
      </div>`)
    .join('');
  return `<div class="editorial">${rows}</div>`;
}

// ── POSTER LIGHTBOX ──
function openPosterLightbox(src) {
  const overlay = document.createElement('div');
  overlay.id = 'poster-lightbox';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;';
  const img = document.createElement('img');
  img.src = src;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;display:block;object-fit:contain;';
  overlay.appendChild(img);
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

// ── DETAIL PANEL ──
function openDetail(f) {
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
  saveBtn.innerHTML = heartSVG(isSaved(f.name), 14) + " " + (isSaved(f.name) ? "Saved" : "Save") + `<span class="save-info-icon">ⓘ<span class="save-tooltip">Saved festivals stay in this browser even after you close it. They won't appear on your other devices or browsers.</span></span>`;

  const mobileSaveBtn = document.getElementById('detail-save-mobile');
  mobileSaveBtn.className = 'detail-save-mobile' + (isSaved(f.name) ? ' saved' : '');
  mobileSaveBtn.innerHTML = heartSVG(isSaved(f.name), 14);

  const infoIcon = `<span class="save-info-icon">ⓘ<span class="save-tooltip">Saved festivals stay in this browser even after you close it. They won't appear on your other devices or browsers.</span></span>`;

  const syncSave = () => {
    const saved = isSaved(f.name);
    saveBtn.classList.toggle('saved', saved);
    saveBtn.innerHTML = heartSVG(saved, 14) + " " + (saved ? "Saved" : "Save") + infoIcon;
    mobileSaveBtn.classList.toggle('saved', saved);
    mobileSaveBtn.innerHTML = heartSVG(saved, 14);
  };

  saveBtn.onclick = () => { toggleSaved(f.name); syncSave(); };
  mobileSaveBtn.onclick = () => { toggleSaved(f.name); syncSave(); };
  actionsEl.appendChild(saveBtn);

  // Rich content (curated with description)
  const richEl = document.getElementById('detail-rich');
  const noDataEl = document.getElementById('detail-no-data');

  const hasEditorialContent = f.editorial && Object.values(f.editorial).some(v => v && v.trim());
  if (hasEditorialContent || f.description) {
    const descEl = document.getElementById('detail-description');
    if (hasEditorialContent) {
      descEl.innerHTML = renderEditorial(f.editorial);
    } else if (f.html_content) {
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

  // Media section
  const existingMedia = document.getElementById('detail-media');
  if (existingMedia) existingMedia.remove();

  if (f.video || f.youtube || f.spotify || f.soundcloud || f.poster) {
    const mediaEl = document.createElement('div');
    mediaEl.id = 'detail-media';
    mediaEl.className = 'detail-media';

    if (f.video) {
      const block = document.createElement('div');
      block.className = 'media-block';
      const label = document.createElement('div');
      label.className = 'media-label';
      label.textContent = 'Aftermovie';
      const video = document.createElement('video');
      video.src = f.video;
      video.controls = true;
      video.playsInline = true;
      video.style.cssText = 'width:100%;aspect-ratio:16/9;border-radius:12px;display:block;';
      block.appendChild(label);
      block.appendChild(video);
      mediaEl.appendChild(block);
    }

    if (f.youtube) {
      const block = document.createElement('div');
      block.className = 'media-block';
      const label = document.createElement('div');
      label.className = 'media-label';
      label.textContent = 'Aftermovie';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${f.youtube}`;
      iframe.style.cssText = 'width:100%;aspect-ratio:16/9;border-radius:12px;border:0;display:block;';
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      block.appendChild(label);
      block.appendChild(iframe);
      mediaEl.appendChild(block);
    }

    if (f.spotify) {
      const block = document.createElement('div');
      block.className = 'media-block';
      const label = document.createElement('div');
      label.className = 'media-label';
      label.textContent = 'Playlist';
      const iframe = document.createElement('iframe');
      iframe.src = `https://open.spotify.com/embed/playlist/${f.spotify}?utm_source=generator&theme=0`;
      iframe.style.cssText = 'width:100%;height:152px;border-radius:12px;border:0;display:block;';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      block.appendChild(label);
      block.appendChild(iframe);
      mediaEl.appendChild(block);
    }

    if (f.soundcloud) {
      const block = document.createElement('div');
      block.className = 'media-block';
      const label = document.createElement('div');
      label.className = 'media-label';
      label.textContent = 'Playlist';
      const iframe = document.createElement('iframe');
      iframe.allow = 'autoplay';
      iframe.src = `https://w.soundcloud.com/player/?url=${f.soundcloud}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_artwork=true&buying=false&sharing=false&download=false`;
      iframe.style.cssText = 'width:100%;height:152px;border-radius:12px;border:0;display:block;overflow:hidden;';
      block.appendChild(label);
      block.appendChild(iframe);
      mediaEl.appendChild(block);
    }

    if (f.poster) {
      const block = document.createElement('div');
      block.className = 'media-block';
      const label = document.createElement('div');
      label.className = 'media-label';
      label.textContent = 'Festival poster';
      const posterImg = document.createElement('img');
      posterImg.src = f.poster;
      posterImg.loading = 'lazy';
      posterImg.decoding = 'async';
      posterImg.style.cssText = 'width:100%;border-radius:12px;display:block;cursor:pointer;';
      posterImg.onclick = () => openPosterLightbox(f.poster);
      block.appendChild(label);
      block.appendChild(posterImg);
      mediaEl.appendChild(block);
    }

    const descEl = document.getElementById('detail-description');
    descEl.parentNode.insertBefore(mediaEl, descEl.nextSibling);
  }

  savedScrollY = window.scrollY;
  sessionStorage.setItem('festScrollY', savedScrollY);
  document.body.classList.add('detail-open');
  document.getElementById('view-detail').scrollTop = 0;
  // Only update URL if we're not already on the festival's own route
  const _slug = toSlug(f.name);
  const _alreadyOnRoute = window.location.pathname === `/festivals/${_slug}`;
  if (!_alreadyOnRoute) {
    history.pushState({ festival: f.name }, '', `/festivals/${_slug}`);
  }
  document.title = f.name + ' — Festival Season 2026';
  const _shortDesc = (f.description || '').replace(/\n/g, ' ').slice(0, 200);
  if (_metaDesc) _metaDesc.content = _shortDesc;
  if (_ogTitle) _ogTitle.content = f.name;
  if (_ogDesc) _ogDesc.content = _shortDesc;
}

function closeDetail() {
  document.body.classList.remove('detail-open');
  const y = savedScrollY || parseInt(sessionStorage.getItem('festScrollY') || '0', 10);
  requestAnimationFrame(() => {
    window.scrollTo(0, y);
  });
  history.replaceState({}, '', '/');
  document.title = _origTitle;
  if (_metaDesc) _metaDesc.content = _origMetaDesc;
  if (_ogTitle) _ogTitle.content = _origOgTitle;
  if (_ogDesc) _ogDesc.content = _origOgDesc;
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });
window.addEventListener('popstate', () => {
  const onFestivalRoute = window.location.pathname.match(/^\/festivals\/([^/]+)$/);
  if (!onFestivalRoute) closeDetail();
});

// ── VIEW TOGGLE ──
function setView(v) {
  currentView = v;
  const grid = document.getElementById('grid-view');
  const list = document.getElementById('list-view');
  const cal = document.getElementById('calendar-view');
  const btnGrid = document.getElementById('btn-grid');
  const btnList = document.getElementById('btn-list');
  const btnCal = document.getElementById('btn-calendar');

  grid.style.display = 'none';
  list.style.display = 'none';
  cal.style.display = 'none';
  btnGrid.classList.remove('active');
  btnList.classList.remove('active');
  btnCal.classList.remove('active');

  if (v === 'grid') {
    grid.style.removeProperty('display');
    btnGrid.classList.add('active');
  } else if (v === 'list') {
    list.style.display = 'block';
    btnList.classList.add('active');
  } else if (v === 'calendar') {
    cal.style.display = 'block';
    btnCal.classList.add('active');
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
const _origMetaDesc = _metaDesc ? _metaDesc.content : '';
const _origOgTitle = _ogTitle ? _ogTitle.content : '';
const _origOgDesc = _ogDesc ? _ogDesc.content : '';

// ── INIT ──
buildFilters();
applyFilters();
setView('grid');
setupCountdown();

// Expose to window for inline HTML handlers (onclick, oninput, onchange)
window.setView = setView;
window.applyFilters = applyFilters;
window.closeDetail = closeDetail;

// ── SWIPE-BACK ON DETAIL PANEL ──
let touchStartX = 0;
const _viewDetail = document.getElementById('view-detail');
_viewDetail.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
_viewDetail.addEventListener('touchend', e => {
  if (e.changedTouches[0].clientX - touchStartX > 60) closeDetail();
}, { passive: true });

// ── DEEP LINK ──
// Support both /?f=slug (legacy) and /festivals/slug (new)
const _params = new URLSearchParams(window.location.search);
const _legacySlug = _params.get('f');
const _pathMatch = window.location.pathname.match(/^\/festivals\/([^/]+)$/);
const _initSlug = _pathMatch ? _pathMatch[1] : _legacySlug;
if (_initSlug) {
  const _initFest = FESTIVALS.find(f => toSlug(f.name) === _initSlug);
  if (_initFest) openDetail(_initFest);
}

window.openDetail = function(slug) {
  const fest = FESTIVALS.find(f => toSlug(f.name) === slug);
  if (fest) openDetail(fest);
};

// ── SCROLL TO TOP BUTTON ──
const _scrollTopBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => {
  if (_scrollTopBtn) {
    _scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  }
}, { passive: true });

// ── THEME TOGGLE ──
(function () {
  var STORAGE_KEY = 'festival-theme';
  function getSaved() { return localStorage.getItem(STORAGE_KEY) || 'dark'; }
  function applyTheme(mode) {
    document.documentElement[mode === 'dark' ? 'setAttribute' : 'removeAttribute']('data-theme', 'dark');
  }
  function updateBtns(mode) {
    document.querySelectorAll('[data-theme-btn]').forEach(function(b) {
      b.classList.toggle('active', b.dataset.themeBtn === mode);
    });
  }
  function setMode(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode); updateBtns(mode);
  }
  var saved = getSaved();
  applyTheme(saved); updateBtns(saved);
  document.querySelectorAll('[data-theme-btn]').forEach(function(b) {
    b.addEventListener('click', function() { setMode(b.dataset.themeBtn); });
  });
})();
