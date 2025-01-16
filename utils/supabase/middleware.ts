
import { Participant } from '@/classes/Participant'
import { createServerClient } from '@supabase/ssr'
import { UUID } from 'crypto'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    const {
        data: { user },
    } = await supabase.auth.getUser()
    const url = request.nextUrl.clone()
    const isParticipant = url.pathname.startsWith('/participants')

    if (request.nextUrl.pathname.startsWith('/webhook')) {
        return supabaseResponse
    }

    if (
        !user &&
        (request.nextUrl.pathname.startsWith('/organisateurs/') ||
        request.nextUrl.pathname.startsWith('/participants/'))

    ) {
        // no user, potentially respond by redirecting the user to the login page
        url.pathname = `/authentication/login?redirect=${isParticipant ? 'participant' : 'organisateur'}`
        return NextResponse.redirect(url)
    }
    // If user is logged in, redirect to dashboard
    if (user && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/authentication/login' || request.nextUrl.pathname === '/organisateurs')) {
        let participant;
        try {
            participant = await Participant.readByIdUser(user.id as UUID);
        } catch (error) {
            // Optionally log the error, but no need to handle it further
        }
        url.pathname = participant ? '/participants/dashboard' : '/organisateurs/dashboard';
        return NextResponse.redirect(url)
    }
    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}