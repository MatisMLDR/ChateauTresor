import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'

type HeroProps = {
  type?: "organisateur" | "participant"
}

const Hero = ({ type = "participant"}: HeroProps) => {
  return (
    <section className="w-full max-lg:pb-16 pt-32 pb-20 xl:py-40 bg-[#f7f7f7]" id="hero">
      <div className="container lg:px-6 flex flex-col-reverse max-lg:gap-10 max-lg:text-center lg:flex-row">
        <div className="flex flex-col space-y-4 lg:w-1/2 w-full">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-[#2b4e73]">
              Plus d&apos;aventure, moins de tracas avec <span className="text-[#6c757d]">Château Trésor</span>   
            </h1>
            <p className="text-muted-foreground md:text-xl text-[#6c757d]">
              {
                type === "organisateur" ?
                "Gagnez du temps, attirez plus de visiteurs : on gère les détails, vous récoltez le succès."
                : "Venez participer à une expérience unique dans les châteaux de loire tout en découvrant leurs histoires."
              }
            </p>
          </div>
          <div className="space-x-4">
            <Button>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href={`/authentication/login?redirect=${type}`}
              >
                Commencer Maintenant
              </Link>
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image src="/chateau.png" alt="Hero" className='rounded-md shadow-md' width={500} height={500} priority />
        </div>
      </div>
    </section>
  );
};

export default Hero;

