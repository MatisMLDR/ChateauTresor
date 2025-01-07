import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="w-full py-20 lg:py-32 xl:py-40 bg-[#f7f7f7]" id="hero">
      <div className="container px-4 md:px-6 flex flex-col md:flex-row">
        <div className="flex flex-col space-y-4 md:w-1/2 w-full">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-[#2b4e73]">
              Plus d'aventure, moins de tracas avec <span className="text-[#6c757d]">Château Trésor</span>
            </h1>
            <p className="text-muted-foreground md:text-xl text-[#6c757d]">
              Gagnez du temps, attirez plus de visiteurs : on gère les détails, vous récoltez le succès.
            </p>
          </div>
          <div className="space-x-4">
  <Button>
    <Link
      className="text-secondary text-sm font-medium hover:underline underline-offset-4"
      href="/login"
    >
      Commencer Maintenant
    </Link>
  </Button>
</div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <Image src="/chateau.png" alt="Hero" width={500} height={500} priority />
        </div>
      </div>
    </section>
  );
};

export default Hero;

