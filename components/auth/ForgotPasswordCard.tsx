import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import { AuthProps } from '@/types'
import React from 'react'
import AuthHeader from './AuthHeader'

const ForgotPasswordCard = ({ redirect }: AuthProps) => {

  return (
    <Card className="w-[350px] mx-auto">
      <AuthHeader redirect={redirect} title="Forgot Your Password?" description="Enter your email address" />
      <CardContent className="grid gap-4">
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className="flex-col text-center">
        <Link className="w-full text-sm text-muted-foreground mb-2" href={`/authentication/login?redirect=${redirect}`}>
          Retour à la connexion
        </Link>
        <Link className="w-full text-sm text-muted-foreground" href={`/authentication/signup?redirect=${redirect}`}>
          Pas de compte ? S&apos;inscrire
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ForgotPasswordCard
