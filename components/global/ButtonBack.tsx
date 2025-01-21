import React from 'react'
import { Button } from '../ui/button'
import { ArrowUpLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ButtonBack = () => {

  const router = useRouter()

  return (
    <Button onClick={() => router.back()} className="mb-2 mr-4 p-2" variant="ghost">
      <ArrowUpLeft />
      Revenir
    </Button>
  )
}

export default ButtonBack
