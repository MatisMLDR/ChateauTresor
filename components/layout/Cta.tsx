import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

const Cta = () => {
  return (
    <section className="w-full py-10 md:py-20 lg:py-32 " id='cta'>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Your Journey Today</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Join thousands of satisfied customers and take your business to the next level.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Link className="btn" href="#">
              <Button className=" p-7" >Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cta
