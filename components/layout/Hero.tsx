import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className="w-full py-20 lg:py-32 xl:py-40" id='hero'>
      <div className="container px-4 md:px-6 flex flex-col md:flex-row ">
        <div className="flex flex-col space-y-4 md:w-1/2 w-full ">
          <div className="space-y-2">
            <h1 className="text-2xl  tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none">
              Saas Template with Supabase, Stripe, Databases
            </h1>
            <p className=" text-muted-foreground md:text-xl">
              NextJS Boilerplate with everything required to build your next SAAS Product
            </p>
          </div>
          <div className="space-x-4">
            <Button>Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
        <div className="w-full md:w-1/2  flex justify-center">
          <Image src="/hero.png" alt="Hero" width={500} height={500} priority />
        </div>
      </div>
    </section>
  )
}

export default Hero
