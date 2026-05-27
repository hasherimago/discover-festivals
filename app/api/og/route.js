import { ImageResponse } from 'next/og'
import FESTIVALS_META from '../../../lib/festivals-meta.js'

export const runtime = 'edge'

const TAG_COLORS = {
  Mindfulness: '#3ecfb2',
  Electronic: '#7c6af0',
  Techno: '#ff6b9d',
  Psytrance: '#c45af0',
  'World Music': '#f07c6a',
  Arts: '#6ab4f0',
  Burner: '#ff7043',
  Offgrid: '#45e88a',
}

function formatDates(f) {
  const s = new Date(f.start + 'T00:00:00')
  const e = new Date(f.end + 'T00:00:00')
  const mos = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if (s.getMonth() === e.getMonth()) return `${s.getDate()}-${e.getDate()} ${mos[s.getMonth()]}`
  return `${s.getDate()} ${mos[s.getMonth()]} - ${e.getDate()} ${mos[e.getMonth()]}`
}

// Shorthand for satori element objects
function el(type, style, children, extra) {
  return { type, key: extra?.key || null, props: { style, ...(children != null ? { children } : {}), ...extra } }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('f') || ''
  const festival = FESTIVALS_META.find((f) => f.slug === slug) || null

  const name = festival?.name || "Curated Festivals '26"
  const location = festival ? `${festival.location}, ${festival.country}` : '- Europe'
  const dates = festival ? formatDates(festival) : 'May - September'
  const tags = festival?.tags || []
  const imgUrl = festival?.img
    ? festival.img.startsWith('http')
      ? festival.img
      : `https://discover-festivals.vercel.app${festival.img}`
    : 'https://discover-festivals.vercel.app/img/og-main-preview.jpg'

  const fontUrl = new URL('/fonts/syne-bold.woff', request.url)
  const syneData = await fetch(fontUrl).then((r) => r.arrayBuffer())

  // satori rules: every multi-child container needs display:flex; no inset shorthand; no special Unicode without fallback font
  const element = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      width: '900px',
      height: '472px',
      background: '#0a0a0a',
      position: 'relative',
      fontFamily: 'Syne',
    },
    [
      // Background image
      el('img', {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.5,
      }, undefined, {
        src: festival
          ? imgUrl
          :'https://discover-festivals.vercel.app/img/og-main-preview.jpg'
      }),

      // Gradient overlay
      el('div', {
        display: 'flex',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to top, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.5) 100%)',
      }),

      // Eyebrow label — top left
      el('div', {
        display: 'flex',
        position: 'absolute',
        top: 48,
        left: 60,
        color: '#e8a045',
        fontSize: 24,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontWeight: 700,
      }, "HANDPICKED by ARSEN"),

      // Bottom content stack
      el('div', {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 52,
        left: 60,
        right: 60,
      }, [
        // Festival name
        el('div', {
          display: 'flex',
          color: '#f0f0f0',
          fontSize: name.length > 30 ? 52 : 68,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginBottom: 14,
        }, name),

        // Date + location
        el('div', {
          display: 'flex',
          color: 'rgba(240,240,240,0.55)',
          fontSize: 24,
          marginBottom: 20,
        }, `${dates}   ${location}`),

        // Tag pills
        tags.length > 0
          ? el('div', { display: 'flex', flexDirection: 'row' }, [
              ...tags.slice(0, 3).map((tag, i) =>
                el('div', {
                  display: 'flex',
                  marginRight: 8,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 12,
                  paddingRight: 12,
                  borderRadius: 100,
                  border: `1.5px solid ${TAG_COLORS[tag] || 'rgba(255,255,255,0.3)'}`,
                  color: TAG_COLORS[tag] || 'rgba(240,240,240,0.7)',
                  fontSize: 16,
                  letterSpacing: '0.06em',
                  textTransform: 'lowercase',
                  fontWeight: 700,
                }, tag, { key: tag })
              ),
            ])
          : null,
      ].filter(Boolean)),
    ].filter(Boolean)
  )

  return new ImageResponse(element, {
    width: 900,
    height: 472,
    fonts: [{ name: 'Syne', data: syneData, weight: 700 }],
  })
}
