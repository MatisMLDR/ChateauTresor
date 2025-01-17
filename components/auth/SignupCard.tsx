import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import Image from 'next/image'
import ProviderSigninBlock from './ProviderSigninBlock'
import { AuthProps } from '@/types'
import SignupForm from './SignupForm'
import AuthHeader from './AuthHeader'

const SignupCard = ({ redirect }: AuthProps) => {
  return (
    <div>
      <Card className="w-[350px] mx-auto">
        <AuthHeader redirect={redirect} title={`Inscription ${redirect}`} description="Créer mon compte" />
        <CardContent className="grid gap-4">
          <SignupForm redirect={redirect} />
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
          <Link className="w-full text-sm text-muted-foreground" href={`/authentication/login?redirect=${redirect}`}>
            Déjà un compte ? Se connecter
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignupCard
