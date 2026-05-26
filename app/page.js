import AppShell from './AppShell'

export async function generateMetadata() {
  return {
    title: "Curated Festivals '26",
    description: "Handpicked music & arts festivals across Europe.",
    openGraph: {
      title: "Curated Festivals '26",
      description: "Handpicked music & arts festivals across Europe.",
      images: [{ url: 'https://discover-festivals.vercel.app/api/og', width: 1200, height: 630 }],
      url: 'https://curatedfestivals.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Curated Festivals '26",
      images: ['https://discover-festivals.vercel.app/api/og'],
    },
  }
}

export default function Home() {
  return <AppShell />
}