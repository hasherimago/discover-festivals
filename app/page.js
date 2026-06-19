import AppShell from './AppShell'

export async function generateMetadata() {
  return {
    title: "Curated Festivals '26",
    description: "130+ handpicked music festivals across Europe. Electronic, techno, boutique gatherings, forest raves, lakeside stages and more — curated with a point of view.",
    openGraph: {
      title: "Curated Festivals '26",
      description: "Handpicked music & arts festivals across Europe.",
      images: [{ url: 'https://curatedfestivals.com/img/og-main-preview.jpg', width: 1200, height: 630 }],
      url: 'https://curatedfestivals.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Curated Festivals '26",
      images: ['https://curatedfestivals.com/img/og-main-preview.jpg'],
    },
  }
}

export default function Home() {
  return <AppShell />
}