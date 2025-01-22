import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

