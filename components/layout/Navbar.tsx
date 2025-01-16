import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'

type NavbarProps = {
  type?: 'participant' | 'organisateur'
}

const Navbar = ({ type = 'participant' }: NavbarProps) => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center  bg-white border-b fixed border-b-slate-200 w-full" id='navbar'>
      <Link className="flex items-center justify-center" href="#">
        <Image src="/logo.svg" alt="logo" width={50} height={50} />
        <span className="sr-only">Chateau tresor</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#features">
          Fonctionnalités
        </a>
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
          Témoignages
        </a>
        { type === 'organisateur' && (
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
              Plans
            </a>
          )
        }
      </nav>
      <Button className="mx-2 md:mx-4 lg:mx-6 xl:mx-10" >
        <Link className="w-full text-secondary text-sm font-medium" href={`/authentication/login?redirect=${type}`}>
          Se connecter
        </Link>
      </Button>
    </header>
  )
}

export default Navbar
