'use client'

import Script from 'next/script'

export default function AppShell() {
  return (
    <>
      {/* ══════════════════════ MAIN VIEW ══════════════════════ */}
      <div id="view-main">

        <header>
          <div className="header-left">
            <h1>Curated Festivals  <span>&apos;26</span></h1>
            <div className="subtitle">
              Europe<span className="dot"> · </span><span id="festival-count"></span>&nbsp;Events<span className="subtitle-dates"><span className="dot"> · </span>May—September</span><span className="dot"> · </span>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{flexShrink:0,marginRight:'3px'}}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5"/>
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5"/>
                <path d="M8 14h8"/>
                <path d="M10 14c0 1.5.5 3 2 3s2-1.5 2-3"/>
              </svg>
              Handpicked by Arsen
            </div>
          </div>
          <div className="header-right">
            <div className="view-toggle">
              <button id="btn-grid" className="active" onClick={() => window.setView('grid')}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M10 3H3V10H10V3Z"/>
                  <path d="M21 3H14V10H21V3Z"/>
                  <path d="M21 14H14V21H21V14Z"/>
                  <path d="M10 14H3V21H10V14Z"/>
                </svg>
                Grid
              </button>
              <button id="btn-list" onClick={() => window.setView('list')}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 10H3M21 6H3M21 14H3M21 18H3"/>
                </svg>
                List
              </button>
              <button id="btn-calendar" onClick={() => window.setView('calendar')}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M16 2V6M8 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"/>
                </svg>
                Calendar
              </button>
            </div>
          </div>
        </header>

        {/* ── NEXT UP: 3 festivals ── */}
        <div id="countdown-banner">
          <div className="next-up-card" id="nuc-0">
            <div className="nuc-left">
              <div className="nuc-label">⮕ Next Up</div>
              <div className="nuc-name" id="nuc-name-0">—</div>
              <div className="nuc-meta" id="nuc-meta-0">—</div>
            </div>
            <div className="nuc-days">
              <span className="num" id="nuc-days-0">—</span>
              <span className="lbl">days</span>
            </div>
          </div>
          <div className="next-up-card" id="nuc-1">
            <div className="nuc-left">
              <div className="nuc-label">⮕ Coming Up</div>
              <div className="nuc-name" id="nuc-name-1">—</div>
              <div className="nuc-meta" id="nuc-meta-1">—</div>
            </div>
            <div className="nuc-days">
              <span className="num" id="nuc-days-1">—</span>
              <span className="lbl">days</span>
            </div>
          </div>
          <div className="next-up-card" id="nuc-2">
            <div className="nuc-left">
              <div className="nuc-label">⮕ On Horizon</div>
              <div className="nuc-name" id="nuc-name-2">—</div>
              <div className="nuc-meta" id="nuc-meta-2">—</div>
            </div>
            <div className="nuc-days">
              <span className="num" id="nuc-days-2">—</span>
              <span className="lbl">days</span>
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="search-wrap">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              id="search"
              placeholder="Search festivals, locations, vibes…"
              onInput={() => { window.applyFilters(); window.toggleSearchClear(); }}
            />
            <button
              id="search-clear"
              className="search-clear"
              onClick={() => {
                document.getElementById('search').value = '';
                window.applyFilters();
                window.toggleSearchClear();
                document.getElementById('search').focus();
              }}
              aria-label="Clear search"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="filters-row">
            <span className="filter-group-label">Month</span>
            <div className="filter-group" id="month-filters"></div>
            <span className="filter-group-label" style={{marginLeft:'8px'}}>Country</span>
            <div className="country-pill" id="country-pill">
              <span id="country-pill-label">All countries</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
              <div className="country-dropdown" id="country-dropdown"></div>
            </div>
          </div>
          <div className="filters-row">
            <span className="filter-group-label">Vibe</span>
            <div className="filter-group" id="tag-filters"></div>
          </div>
          <div id="saved-info-bar" className="saved-info-bar">
            Saved festivals stay in this browser even after you close it. They won&apos;t appear on your other devices or browsers.
          </div>
        </div>

        <div id="main">
          <div id="grid-view"></div>
          <div id="list-view"></div>
          <div id="calendar-view"></div>
        </div>

      </div>{/* /view-main */}


      {/* ══════════════════════ DETAIL VIEW ══════════════════════ */}
      <div id="view-detail">
        <button className="detail-back" onClick={() => window.closeDetail()}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
          Back
        </button>
        <button className="detail-save-mobile" id="detail-save-mobile"></button>

        <div className="detail-hero-wrap" id="detail-hero-wrap">
          <img id="detail-hero-bg" src={undefined} alt="" className="detail-hero-bg" />
          <div className="detail-hero-overlay"></div>
          <div className="detail-hero-content" id="detail-hero-content"></div>
        </div>

        <div className="detail-body">
          <div className="detail-name-row">
            <div className="detail-name" id="detail-name"></div>
            <div className="detail-badges" id="detail-badges"></div>
          </div>

          <div className="detail-meta">
            <span id="detail-dates"></span>
            <span className="detail-meta-sep">·</span>
            <span id="detail-location"></span>
          </div>

          <div className="detail-tags-row" id="detail-tags"></div>

          <div className="detail-actions" id="detail-actions"></div>

          <div id="detail-rich" style={{display:'none'}}>
            <div className="detail-divider"></div>
            <div className="detail-description" id="detail-description"></div>
          </div>

          <div id="detail-no-data" style={{display:'none'}}>
            <div className="detail-divider"></div>
            <div className="detail-pending-note">
              ✦ Description & links for this festival haven&apos;t been added yet.<br />
              Visit the source page for details.
            </div>
          </div>
        </div>
      </div>{/* /view-detail */}

      <Script src="/app.js" type="module" strategy="afterInteractive" />
    </>
  )
}
