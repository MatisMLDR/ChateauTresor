import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import { createStripeCustomer } from '@/utils/stripe/api'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const {
                data: { user },
                error: getUserError,
            } = await supabase.auth.getUser()

            if (getUserError) {
                console.log("Error getting user: ", getUserError)
                return NextResponse.redirect(`${origin}/auth?error=Erreur lors de la récupération de l'utilisateur`)
            }
            // create Stripe customers
            const stripeID = await createStripeCustomer(user!.id, user!.email!, user!.user_metadata.full_name)
            // Mettre à jour l'utilisateur avec le stripeID
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ stripe_id: stripeID })
                .match({ email: user!.email });
            
            if (updateError) {
                console.log("Error updating user to add his stripeID: ", updateError)
                return NextResponse.redirect(`${origin}/auth?error=Erreur lors de la mise à jour de l'utilisateur`)
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    // return NextResponse.redirect(`${origin}/auth?error=Erreur lors de la connexion`)
    return NextResponse.redirect(`${origin}/authentication/login?redirect=participant`)

}