'use client'

import { useState, useRef, useEffect } from 'react'
import Script from 'next/script'

export default function AppShell({ initialSlug }) {
  const [fabOpen, setFabOpen] = useState(false)
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [submitName, setSubmitName] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle') // idle | submitting | success | error
  const [photoZoomed, setPhotoZoomed] = useState(false)

  const fabRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (fabRef.current && !fabRef.current.contains(e.target)) {
        setFabOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (initialSlug) {
      // app.js exposes window.openDetail — call it after the script loads
      const timer = setTimeout(() => {
        if (typeof window.openDetail === 'function') {
          window.openDetail(initialSlug)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [initialSlug])

  useEffect(() => {
    if (!isAboutOpen) setPhotoZoomed(false)
  }, [isAboutOpen])

  async function handleSubmit() {
    if (!submitName.trim()) return
    setSubmitStatus('submitting')
    try {
      const res = await fetch(
        'https://formspree.io/f/mpqnrbpj', /* replace with your Formspree form ID */
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ festival: submitName }),
        }
      )
      if (res.ok) {
        setSubmitStatus('success')
        setTimeout(() => {
          setSubmitName('')
          setSubmitStatus('idle')
          setIsSubmitOpen(false)
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    }
  }

  const overlayStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.82)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  }

  const modalBox = (maxWidth) => ({
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    maxWidth,
    width: '90%',
    padding: '36px',
    position: 'relative',
    boxSizing: 'border-box',
  })

  const closeBtn = {
    position: 'absolute', top: '16px', right: '16px',
    background: 'none', border: 'none',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '20px', cursor: 'pointer', lineHeight: 1,
    padding: '4px 8px',
  }

  return (
    <>
      {/* ══════════════════════ MAIN VIEW ══════════════════════ */}
      <div id="view-main">

        <header>
          <div className="header-left">
            <h1>Curated Festivals  <span>&apos;26</span></h1>
            <div className="subtitle">
              Europe<span className="dot"> · </span><span id="festival-count"></span>&nbsp;Events<span className="subtitle-dates"><span className="dot"> · </span>May—September</span><span className="dot"> · </span>
              <svg width="13" height="13" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0,marginRight:'3px'}}>
                <path d="M87.1 35.2C87.1 32.2 87 28.8 86.7 24.9C85.1 5.4 68.2 2 47.5 2C26.8 2 9.9 5.4 8.3 24.9C8 28.8 7.9 32.2 7.9 35.2C3.3 37.3 0 42.2 0 47.9C0 54.8 4.8 60.6 11 61.6V70C11 82.8 21.4 93.2 34.3 93.2H60.8C73.6 93.2 84.1 82.8 84.1 70V61.6C90.3 60.6 95.1 54.9 95.1 47.9C95 42.2 91.7 37.3 87.1 35.2ZM82.1 54.5C81.6 54.5 81.4 54.5 81.3 54.4C80.2 54.1 79.1 54.4 78.2 55.1C77.3 55.8 76.8 56.8 76.8 58V70C76.8 78.8 69.6 86 60.7 86H34.3C25.4 86 18.2 78.8 18.2 70V58C18.2 56.9 17.7 55.8 16.8 55.1C15.9 54.4 14.8 54.2 13.7 54.4C13.6 54.4 13.3 54.5 12.9 54.5C9.8 54.5 7.2 51.5 7.2 47.9C7.2 45.1 8.8 42.7 11 41.8V42.5C11 44.5 12.6 46.1 14.6 46.1C16.6 46.1 18.2 44.5 18.2 42.5V35.2C18.2 32.3 19 29.6 20.4 27.3C26.9 29.8 36.6 31.5 47.5 31.5C58.4 31.5 68.1 29.9 74.6 27.3C75.9 29.6 76.8 32.3 76.8 35.2V42.5C76.8 44.5 78.4 46.1 80.4 46.1C82.4 46.1 84 44.5 84 42.5V41.8C86.2 42.7 87.8 45.1 87.8 47.9C87.8 51.6 85.2 54.5 82.1 54.5Z" fill="currentColor"/>
                <path d="M34.1002 53.2004C37.6348 53.2004 40.5002 50.335 40.5002 46.8004C40.5002 43.2658 37.6348 40.4004 34.1002 40.4004C30.5656 40.4004 27.7002 43.2658 27.7002 46.8004C27.7002 50.335 30.5656 53.2004 34.1002 53.2004Z" fill="currentColor"/>
                <path d="M60.9 53.2004C64.4346 53.2004 67.3 50.335 67.3 46.8004C67.3 43.2658 64.4346 40.4004 60.9 40.4004C57.3654 40.4004 54.5 43.2658 54.5 46.8004C54.5 50.335 57.3654 53.2004 60.9 53.2004Z" fill="currentColor"/>
                <path d="M67.9998 65.4998C62.1998 64.1998 56.4998 61.0998 53.7998 59.6998C51.4998 58.4998 48.9998 58.8998 47.4998 60.1998C45.9998 58.8998 43.4998 58.4998 41.1998 59.6998C38.4998 61.0998 32.7998 64.1998 26.9998 65.4998C25.2998 65.8998 24.9998 68.2998 26.6998 68.9998C31.0998 70.9998 36.3998 72.1998 41.1998 71.5998C44.5998 71.1998 46.4998 69.8998 47.4998 68.3998C48.5998 69.9998 50.4998 71.1998 53.7998 71.5998C58.4998 72.1998 63.7998 70.9998 68.2998 68.9998C69.9998 68.2998 69.6998 65.8998 67.9998 65.4998Z" fill="currentColor"/>
              </svg>
              Handpicked by <a href="https://www.instagram.com/arsenmalash/" target="_blank" rel="noopener noreferrer" style={{color:'inherit',textDecoration:'none',borderBottom:'1px solid currentColor',marginLeft:'3px'}}>Arsen</a>
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
                  <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01"/>
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
              ✦ Description &amp; links for this festival haven&apos;t been added yet.<br />
              Visit the source page for details.
            </div>
          </div>
        </div>
      </div>{/* /view-detail */}


      {/* ══════════════════════ FAB ══════════════════════ */}
      <div id="fab-container" ref={fabRef} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 500 }}>

        {/* Pill: Suggest a festival — bottom: 84px from viewport = 60px above container */}
        <div style={{
          position: 'absolute', right: 0,
          bottom: fabOpen ? '60px' : '0px',
          opacity: fabOpen ? 1 : 0,
          transform: fabOpen ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease, bottom 0.2s ease',
          pointerEvents: fabOpen ? 'auto' : 'none',
          whiteSpace: 'nowrap',
        }}>
          <button
            onClick={() => { setFabOpen(false); setIsSubmitOpen(true) }}
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              color: 'white',
              fontSize: '14px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a' }}
          >
            😛 Suggest a festival
          </button>
        </div>

        {/* Pill: About — bottom: 136px from viewport = 112px above container, 50ms stagger */}
        <div style={{
          position: 'absolute', right: 0,
          bottom: fabOpen ? '112px' : '0px',
          opacity: fabOpen ? 1 : 0,
          transform: fabOpen ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.2s ease 0.05s, transform 0.2s ease 0.05s, bottom 0.2s ease 0.05s',
          pointerEvents: fabOpen ? 'auto' : 'none',
          whiteSpace: 'nowrap',
        }}>
          <button
            onClick={() => { setFabOpen(false); setIsAboutOpen(true) }}
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              color: 'white',
              fontSize: '14px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a' }}
          >
            👋 About
          </button>
        </div>

        {/* Main FAB button */}
        <button
          onClick={() => setFabOpen(o => !o)}
          style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            background: '#1a1a1a',
            border: '1px solid rgba(232,160,69,0.3)',
            color: '#e8a045',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s, color 0.25s',
            position: 'relative', zIndex: 1,
            padding: 0,
          }}
          aria-label={fabOpen ? 'Close menu' : 'Open menu'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>

      </div>

      {/* ══════════════════════ SCROLL TO TOP ══════════════════════ */}
      <button id="scroll-top-btn" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 15V5M10 5L5 10M10 5L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ══════════════════════ SUGGEST A FESTIVAL MODAL ══════════════════════ */}
      {isSubmitOpen && (
        <div style={overlayStyle} onMouseDown={() => setIsSubmitOpen(false)}>
          <div style={modalBox('420px')} onMouseDown={e => e.stopPropagation()}>
            <button style={closeBtn} onClick={() => setIsSubmitOpen(false)}>×</button>

            <div style={{ fontSize: '20px', fontWeight: 600, color: 'white' }}>
            Missing a festival worth going to? 
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
            Drop the name — I'll look into it.
            </div>

            <input
              type="text"
              value={submitName}
              onChange={e => setSubmitName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              placeholder="Festival name..."
              style={{
                marginTop: '24px',
                width: '100%',
                boxSizing: 'border-box',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                display: 'block',
              }}
              onFocus={e => { e.target.style.borderColor = '#e8a045' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />

            {submitStatus === 'success' ? (
              <div style={{ marginTop: '12px', color: '#e8a045', textAlign: 'center', fontSize: '16px' }}>
                Thanks! We&apos;ll check it out 🎪
              </div>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={submitStatus === 'submitting' || !submitName.trim()}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    background: '#e8a045',
                    color: '#0a0a0a',
                    fontWeight: 600,
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '15px',
                    border: 'none',
                    cursor: (submitStatus === 'submitting' || !submitName.trim()) ? 'default' : 'pointer',
                    opacity: (submitStatus === 'submitting' || !submitName.trim()) ? 0.6 : 1,
                    display: 'block',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => { if (submitStatus !== 'submitting' && submitName.trim()) e.currentTarget.style.background = '#f0b055' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#e8a045' }}
                >
                  {submitStatus === 'submitting' ? 'Sending…' : 'Submit'}
                </button>
                {submitStatus === 'error' && (
                  <div style={{ marginTop: '8px', color: '#f87171', fontSize: '13px' }}>
                    Something went wrong, try again.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}


      {/* ══════════════════════ ABOUT MODAL ══════════════════════ */}
      {isAboutOpen && (
        <div style={overlayStyle} onMouseDown={() => setIsAboutOpen(false)}>
          <div
            style={{ ...modalBox('460px'), display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onMouseDown={e => e.stopPropagation()}
          >
            <button style={closeBtn} onClick={() => setIsAboutOpen(false)}>×</button>

            <img
              src="/img/arsen.png"
              alt="Profile"
              onClick={() => setPhotoZoomed(z => !z)}
              style={{
                width: photoZoomed ? '260px' : '96px',
                height: photoZoomed ? '260px' : '96px',
                borderRadius: '50%',
                border: '2px solid #e8a045',
                objectFit: 'cover',
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'width 0.3s ease, height 0.3s ease, border-radius 0.3s ease',
              }}
            />

            <div style={{ fontSize: '18px', fontWeight: 600, color: 'white', textAlign: 'center' }}>
              {""/* YOUR NAME */}
            </div>

            <div style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              textAlign: 'center',
              marginTop: '10px',
              maxWidth: '500px',
            }}>
              <p style={{ marginBottom: '12px' }}>Welcome to Curated Festivals.</p>
              <p style={{ marginBottom: '12px' }}>Hey, I'm Arsen and I created this site because I couldn't find a single good curated festival list anywhere. Everything was scattered across reels, posts and Reddit threads. So I built one myself.</p>
<p>Every festival here is hand-picked by me — ones I'd actually consider going to. No SEO filler, no paid placements. It's free and open to everyone, and I hope the list keeps growing as more good festivals find their audience.</p>
            </div>

            <a
              href={/* YOUR LINK */ 'https://www.instagram.com/arsenmalash/'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '14px', color: '#e8a045', textAlign: 'center', marginTop: '16px', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
            >
              {"My Instagram"}
            </a>

          </div>
        </div>
      )}


      <Script src="/app.js" type="module" strategy="afterInteractive" />
    </>
  )
}
