import { Coins, Database, UserCheck } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section className="w-full py-10 md:py-20 lg:py-32 bg-muted" id="features">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">Our Features</h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Payments</h3>
            <p className="text-muted-foreground text-center">Seamlesly integrate Stripe Billing to capture subscription payments - Webhooks and all</p>
          </div>
          <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Auth</h3>
            <p className="text-muted-foreground text-center">Utilize our preexisting Superbase integration to auth your users and secure your app </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border-muted-foreground/10 p-4 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Database</h3>
            <p className="text-muted-foreground text-center">Hook into any PostgresDB instance</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
