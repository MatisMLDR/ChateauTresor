import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Check } from 'lucide-react'
import { getStripeProducts } from '@/utils/stripe/api'

const Pricing = async () => {
  const products = await getStripeProducts();

  return (
    <section className="w-full py-10 md:py-20 lg:py-32 bg-muted" id="pricing">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">Pricing Plans</h2>
        <p className="text-muted-foreground text-center mb-8 md:text-xl">Choose the perfect plan for your needs</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {product.price.unit_amount
                    ? `$${(product.price.unit_amount / 100).toFixed(2)}/${product.price.recurring?.interval}`
                    : 'Custom'}
                </p>
                <ul className="mt-4 space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4 w-full"
                  href={`/signup?plan=${product.id}`}
                >
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
