import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import Link from 'next/link'
import Image from 'next/image'

import ProviderSigninBlock from '@/components/auth/ProviderSigninBlock'
import LoginForm from "@/components/auth/LoginForm"
export default function Login() {
    return (
        <div className="flex items-center justify-center bg-muted min-h-screen">
            <Card className="w-[350px] mx-auto">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center py-4">
                        <Link href='/'>
                            <Image src="/logo.svg" alt="logo" width={50} height={50} />
                        </Link>
                    </div>

                    <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                    <CardDescription>Choisir votre méthode de connexion préférée</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <LoginForm />
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
                    <Link className="w-full text-sm text-muted-foreground " href="/forgot-password">
                        Mot de passe oublié?
                    </Link>
                    <Link className="w-full text-sm text-muted-foreground" href="/signup">
                        Vous n&apos;avez pas de compte? Créer un compte
                    </Link>
                    <Link className="w-full text-sm text-muted-foreground" href="/landing-organisateur">
                        Vous êtes un organisateur? Connectez-vous ici
                    </Link>
                </CardFooter>
            </Card>
        </div >

    )
}