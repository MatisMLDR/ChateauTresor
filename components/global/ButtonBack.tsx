import React from 'react'
import { Button } from '../ui/button'
import { ArrowUpLeft, Link } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ButtonBack = () => {

  return (
    <Button className="mb-2 mr-4 p-2" variant="ghost">
      <ArrowUpLeft />
      <Link href="/" >
        Revenir au menu
      </Link>
    </Button>
  )
}

export default ButtonBack
