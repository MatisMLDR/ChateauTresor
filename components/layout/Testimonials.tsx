import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Star } from 'lucide-react'

const Testimonials = () => {
  return (
    <section className="w-full py-10 md:py-20 lg:py-32" id="testimonials">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">What Our Customers Say</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-2">&quot;This product has revolutionized our workflow. Highly recommended!&quot;</p>
              <p className="font-semibold">- Sarah J., CEO</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-2">&quot;Wow everything is already integrated! Less time configuring, more time building!.&quot;</p>
              <p className="font-semibold">- Mark T., CTO</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-2">&quot;We&aposve seen a 200% increase in productivity since implementing this solution.&quot;</p>
              <p className="font-semibold">- Emily R., Operations Manager</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
