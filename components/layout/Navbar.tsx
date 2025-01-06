import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'

const Navbar = () => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center  bg-white border-b fixed border-b-slate-200 w-full" id='navbar'>
      <Link className="flex items-center justify-center" href="#">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#features">
          Features
        </a>
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
          Testimonials
        </a>
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
          Pricing
        </a>
      </nav>
      <Button className="mx-2 md:mx-4 lg:mx-6 xl:mx-10" >
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
          Get Started
        </Link>
      </Button>
    </header>
  )
}

export default Navbar
