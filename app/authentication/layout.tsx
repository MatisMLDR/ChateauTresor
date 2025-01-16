export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <div className="flex items-center justify-center bg-muted min-h-screen">
      {children}
    </div>
  )
}