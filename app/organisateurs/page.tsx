import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Cta from "@/components/layout/Cta"
import Pricing from "@/components/layout/Pricing"
import Testimonials from "@/components/layout/Testimonials"
import Features from "@/components/layout/Features"
import Hero from "@/components/layout/Hero"

// This makes the page dynamic instead of static
export const revalidate = 3600 // Revalidate every hour


export default async function LandingPage() {

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar type="organisateur" />
      <main className="flex-1">
        <Hero type="organisateur" />
        <Features type="organisateur" />
        <Testimonials />
        <Pricing />
        <Cta type="organisateur" />
      </main>
      <Footer type="organisateur" />
    </div>
  )
}