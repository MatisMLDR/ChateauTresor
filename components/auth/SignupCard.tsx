import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import Image from 'next/image'
import ProviderSigninBlock from './ProviderSigninBlock'

const SignupCard = () => {
  return (
    <div>
      <Card className="w-[350px] mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center py-4">
            <Link href='/'>
              <Image src="/logo.svg" alt="logo" width={50} height={50} />
            </Link>
          </div>

          <CardTitle className="text-2x\l font-bold">S&apos;inscrire</CardTitle>
          <CardDescription>Créer mon compte</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SignupForm />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
            </div>
          </div>
          <ProviderSigninBlock />
        </CardContent>
        <CardFooter className="flex-col text-center">
          <Link className="w-full text-sm text-muted-foreground" href="/login">
            Déjà un compte ? Se connecter
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignupCard
