import FESTIVALS_META from '../lib/festivals-meta.js'
import AppShell from './AppShell'

export async function generateMetadata(props) {
  const searchParams = await props.searchParams
  const slug = searchParams?.f
  if (!slug) return {}

  const festival = FESTIVALS_META.find((f) => f.slug === slug)
  if (!festival) return {}

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  const ogImage = `${baseUrl}/api/og?f=${slug}`

  return {
    title: `${festival.name} — Festival Guide '26`,
    description: festival.description.slice(0, 160),
    openGraph: {
      title: `${festival.name} — Festival Guide '26`,
      description: festival.description.slice(0, 160),
      images: [{ url: ogImage, width: 1200, height: 630 }],
      url: `/?f=${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${festival.name} — Festival Guide '26`,
      images: [ogImage],
    },
  }
}

export default function Home() {
  return <AppShell />
}
