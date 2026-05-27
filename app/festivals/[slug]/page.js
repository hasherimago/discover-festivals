import FESTIVALS_META from '../../../lib/festivals-meta.js'
import AppShell from '../../AppShell'

export async function generateStaticParams() {
  return FESTIVALS_META.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  if (!slug) return {}

  const festival = FESTIVALS_META.find((f) => f.slug === slug)
  if (!festival) return {}

  const ogImage = `https://discover-festivals.vercel.app/api/og?f=${slug}`

  return {
    title: `${festival.name} — Festival Guide '26`,
    description: festival.description.slice(0, 160),
    openGraph: {
      title: `${festival.name} — Festival Guide '26`,
      description: festival.description.slice(0, 160),
      images: [{ url: ogImage, width: 900, height: 472 }],
      url: `/festivals/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${festival.name} — Festival Guide '26`,
      images: [ogImage],
    },
  }
}

export default async function FestivalPage({ params }) {
  const { slug } = await params
  return <AppShell initialSlug={slug} />
}
