"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Menu, X } from 'lucide-react'

type NavbarProps = {
  type?: 'participant' | 'organisateur'
}

const Navbar = ({ type = 'participant' }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="px-4 lg:px-6 h-20 flex max-md:justify-between items-center bg-white border-b fixed border-b-slate-200 w-full z-50">
      <Link className={`${isMenuOpen ? 'hidden' : 'flex'} items-center justify-center gap-2`} href="#">
        <Image src="/logo.svg" alt="logo" width={50} height={50} />
        <span className="max-lg:hidden text-lg font-semibold">Chateau tresor</span>
      </Link>

      {/* Navigation desktop */}
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#features">
          Fonctionnalités
        </a>
        <a className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
          Témoignages
        </a>
        {type === 'organisateur' && (
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Plans
          </a>
        )}
      </nav>

      {/* Boutons desktop */}
      <div className="flex items-center gap-2 ml-4">
        <Button variant="outline" className='max-md:hidden border-primary-foreground'>
          <Link className="w-full text-primary text-sm font-medium" href={`/authentication/login?redirect=${type}`}>
            Se connecter
          </Link>
        </Button>
        <Button className='max-md:hidden'>
          <Link className="w-full text-white text-sm font-medium" href={`/authentication/signup?redirect=${type}`}>
            S&apos;inscrire
          </Link>
        </Button>
        {/* Menu mobile */}
        <Button variant="ghost" className='md:hidden ml-2' onClick={toggleMenu}>
          {!isMenuOpen &&
            <Menu className="text-primary" size={48} />
          }
        </Button>
      </div>

      {/* Overlay et menu mobile */}
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} onClick={toggleMenu}></div>

      <div className={`fixed top-0 right-0 h-screen w-full max-w-xs bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className='flex justify-between items-center p-4'>
          <Link className="flex items-center justify-center gap-2" href="#">
            <Image src="/logo.svg" alt="logo" width={50} height={50} />
          </Link>
          <Button variant="ghost" className='' onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="text-primary" size={48} />
            ) : (
              <Menu className="text-primary" size={48} />
            )}
          </Button>
        </div>

        <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">

          <a className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Fonctionnalités
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Témoignages
          </a>
          {type === 'organisateur' && (
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
              Plans
            </a>
          )}

          <div className="flex flex-col gap-4 mt-4">
            <Button variant="outline" className='w-full md:hidden border-primary-foreground'>
              <Link className="w-full text-primary text-sm font-medium" href={`/authentication/login?redirect=${type}`}>
                Se connecter
              </Link>
            </Button>
            <Button className="md:hidden w-full">
              <Link className="w-full text-white text-sm font-medium" href={`/authentication/signup?redirect=${type}`}>
                S&apos;inscrire
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar