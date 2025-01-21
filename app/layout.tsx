import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Château Trésor",
  description: "Participez à une expérience ludique et interactive dans les châteaux de la Loire.",
  openGraph: {
    title: "Château Trésor",
    description: "Participez à une expérience ludique et interactive dans les châteaux de la Loire.",
    url: process.env.NEXT_PUBLIC_WEBSITE_URL,
    siteName: "Château Trésor",
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    title: "Château Trésor",
    card: "summary_large_image",
    description: "Participez à une expérience ludique et interactive dans les châteaux de la Loire.",
    creatorId: "@chateautresor",
    site: process.env.NEXT_PUBLIC_WEBSITE_URL,
    // images: [""], -> Add images
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      {/* Required for pricing table */}
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
