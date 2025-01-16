import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import Image from 'next/image'
import LoginForm from './LoginForm'
import ProviderSigninBlock from './ProviderSigninBlock'
import { AuthProps } from '@/types'
import AuthHeader from './AuthHeader'

const LoginCard = ({ redirect }: AuthProps) => {
  return (
    <Card className="w-[350px] mx-auto">
      <AuthHeader redirect={redirect} title="Connexion" description="Choisir votre méthode de connexion préférée" />
      <CardContent className="grid gap-4">
        <LoginForm redirect={redirect} />
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
        <Link className="w-full text-sm text-muted-foreground " href={`/forgot-password?redirect=${redirect}`}>
          Mot de passe oublié?
        </Link>
        <Link className="w-full text-sm text-muted-foreground" href={`/signup?redirect=${redirect}`}>	
          Vous n&apos;avez pas de compte? Créer un compte
        </Link>

        <Link className="w-full text-sm text-muted-foreground" href={`/login?redirect=${redirect}`}>
          {`Vous êtes un ${redirect}? Connectez-vous ici`}
        </Link>
      </CardFooter>
    </Card>
  )
}

export default LoginCard
