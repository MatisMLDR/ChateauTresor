"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function Loader() {
  
  return (
    <div className="grid place-items-center w-full h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

