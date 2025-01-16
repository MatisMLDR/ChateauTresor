import Navbar from "@/components/layout/Navbar"
import Footer_orga from "@/components/layout/Footer_orga"
import Cta_orga from "@/components/layout/Cta_orga"
import Pricing_orga from "@/components/layout/Pricing_orga"
import Testimonials_orga from "@/components/layout/Testimonials_orga"
import Features_orga from "@/components/layout/Features_orga"
import Hero_orga from "@/components/layout/Hero_orga"

// This makes the page dynamic instead of static
export const revalidate = 3600 // Revalidate every hour


export default async function LandingPage() {

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar type="organisateur" />
      <main className="flex-1">
        <Hero_orga />
        <Features_orga />
        <Testimonials_orga />
        <Pricing_orga />
        <Cta_orga />
      </main>
      <Footer_orga />
    </div>
  )
}