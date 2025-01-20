"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement de la page
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Ajustez ce délai selon vos besoins

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="grid place-items-center w-full h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

