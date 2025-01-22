import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Cta from "@/components/layout/Cta"
import Testimonials from "@/components/layout/Testimonials"
import Features from "@/components/layout/Features"
import Hero from "@/components/layout/Hero"

// Cela rend la page dynamique au lieu de statique
export const revalidate = 3600


export default async function LandingPage() {

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <Cta />
      </main>
      <Footer  />
    </div>
  )
}