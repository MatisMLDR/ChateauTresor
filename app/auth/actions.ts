"use server"
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import { createStripeCustomer } from '@/utils/stripe/api'
import { formatFullName } from '@/lib/utils'
import toast from 'react-hot-toast'
const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ? process.env.NEXT_PUBLIC_WEBSITE_URL : "http://localhost:3000"
export async function resetPassword(currentState: { message: string }, formData: FormData) {

    const supabase = createClient()
    const passwordData = {
        password: formData.get('password') as string,
        confirm_password: formData.get('confirm_password') as string,
        code: formData.get('code') as string
    }
    if (passwordData.password !== passwordData.confirm_password) {
        console.log('Passwords do not match')
        redirect(`/forgot-password/reset?error=Les mots de passe ne correspondent pas`)
    }

    const { data } = await supabase.auth.exchangeCodeForSession(passwordData.code)

    let { error } = await supabase.auth.updateUser({
        password: passwordData.password,
    })

    if (error) {
        console.error('Error updating password:', error)
        return { message: "Erreur lors de la mise à jour du mot de passe" }
    }
    redirect(`/forgot-password/reset/success`)
}

export async function forgotPassword(currentState: { message: string }, formData: FormData) {

    const supabase = createClient()
    const email = formData.get('email') as string
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${PUBLIC_URL}/forgot-password/reset` })

    if (error) {
        return { message: error.message }
    }
    redirect(`/forgot-password/success`)

}

export async function signupOrganisateur(currentState: { message: string }, formData: FormData): Promise<any> {
    const result = await signUpUser(currentState, formData, "organisateur");
    if (result?.message) {
        return result;
    }
}

export async function signupParticipant(currentState: { message: string }, formData: FormData): Promise<any> {
    const result = await signUpUser(currentState, formData, "participant");
    if (result?.message) {
        return result;
    }
}

export async function signUpUser(currentState: { message: string }, formData: FormData, type: "participant" | "organisateur") {
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        nom: formData.get('nom') as string,
        prenom: formData.get('prenom') as string,
        adresse: formData.get('adresse') as string,
        ville: formData.get('ville') as string,
        codePostal: formData.get('code_postal') as string,
        pseudo: formData.get('pseudo') as string,
    }
    console.log("formData : ", data)
    if (data.email === '' || data.password === '') {
        return { message: "Veuillez remplir tous les champs" }
    }

    const supabase = createClient()

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${PUBLIC_URL}/auth/callback`,
            data: {
                username: data.pseudo,
                nom: data.nom,
                prenom: data.prenom,
                adresse: data.adresse,
                ville: data.ville,
                code_postal: data.codePostal,
            }
        }
    })

    if (signUpError) {
        let message = "Erreur lors de la création du compte";
        if (signUpError.message.includes("already registered")) {
            message = "Un compte avec cet email existe déjà. Veuillez vous connecter à la place."
        }
        console.log("ERREUR A LIRE IMPORTANT:", signUpError.message)
        return { message: message }
    }

    if (!signUpData.user) {
        console.log('User data is empty or undefined')
        return { message: "L'utilisateur n'a pas été trouvé" }
    }

    const fullname = formatFullName(data.prenom, data.nom)

    // create Stripe Customer Record using signup response data
    const stripeID = await createStripeCustomer(signUpData.user.id, signUpData.user.email!, fullname)

    // Update user's stripe_id in the database

    const { error: errorStripe } = await supabase
        .from('profiles')
        .update({ stripe_id: stripeID })
        .match({ email: data.email });

    if (errorStripe) {
        console.log('Cannot update user with stripe customer id:', errorStripe)
        return { message: "Impossible de mettre à jour le profil avec le stripeID" }
    }

    // Créer un profil participant ou organisateur
    const { error: errorProfile } = await supabase
        .from(type === "participant" ? 'participant' : 'membre_equipe')
        .insert([{
            id_user: signUpData.user.id,
        }])

    if (errorProfile) {
        console.log(`Cannot create ${type} profile:`, errorProfile)
        return { message: `Erreur lors de la création du profil ${type}` }
    }

    console.log("User created successfully:", signUpData)
    // Revalider le chemin pour mettre à jour les données de l'utilisateur
    revalidatePath('/', 'layout')
    // Notifier l'utilisateur que son compte a été créé avec succès
    // Et lui demander de vérifier sa boîte mail pour activer son compte
    // toast.success('Votre compte a été créé avec succès. Veuillez vérifier votre boîte mail pour activer votre compte.')
    // Rediriger l'utilisateur vers la page de connexion
    redirect(`/authentication/login?redirect=${type}`)
}

export async function loginOrganisateur(currentState: { message: string }, formData: FormData): Promise<any> {


    const result = await loginUser(currentState, formData, "organisateur")
    if (result?.message) {
        return result;
    }
}

export async function loginParticipant(currentState: { message: string }, formData: FormData): Promise<any> {
    
    const result = await loginUser(currentState, formData, "participant");

    if (result?.message) {
        return result;
    }
}

export async function loginUser(currentState: { message: string }, formData: FormData, type: "participant" | "organisateur") {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error('Error logging in:', error)
        return { message: "Erreur lors de la connexion" }
    }
    // Revalider le chemin pour mettre à jour les données de l'utilisateur
    revalidatePath('/', 'layout')
    // Rediriger vers la page d'accueil du participant
    redirect(`/${type}s/dashboard`)
}

export async function logout(userType: "participant" | "organisateur") {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error logging out:', error)
    }
    // Redireger vers la landing page correspondante
    const redirectPath = `/${userType}`

    redirect(redirectPath)
}

export async function signInWithGoogle() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${PUBLIC_URL}/auth/callback`,
        },
    })

    if (error) {
        console.error('Error signing in with Google:', error)
    }

    if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }
}