import { Stripe } from 'stripe';
import { eq } from "drizzle-orm";
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '../supabase/server';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ? process.env.NEXT_PUBLIC_WEBSITE_URL : "http://localhost:3000"
export async function getStripePlan(email: string) {
    const supabase = createClient()
    const {
        data: user
    } = await supabase.from('users').select().eq('email', email)

    if (!user || user.length === 0) {
        throw new Error("User not found")
    }

    const subscription = await stripe.subscriptions.retrieve(
        user[0].stripe_subscription_id as string
    );
    const productId = subscription.items.data[0].plan.product as string
    const product = await stripe.products.retrieve(productId)
    return product.name
}

export async function createStripeCustomer(id: string, email: string, name?: string) {
    const customer = await stripe.customers.create({
        name: name ? name : "",
        email: email,
        metadata: {
            supabase_id: id
        }
    });
    // Create a new customer in Stripe
    return customer.id
}

export async function createStripeCheckoutSession(email: string) {
    const supabase = createClient()
    const {
        data: user
    } = await supabase.from('users').select().eq('email', email)

    if (!user || user.length === 0) {
        throw new Error("User not found")
    }

    const customerSession = await stripe.customerSessions.create({
        customer: user[0].stripe_id,
        components: {
            pricing_table: {
                enabled: true,
            },
        },
    });
    return customerSession.client_secret
}

export async function generateStripeBillingPortalLink(email: string) {
    const supabase = createClient()
    const {
        data: user
    } = await supabase.from('users').select().eq('email', email)

    if (!user || user.length === 0) {
        throw new Error("User not found")
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: user[0].stripe_id,
        return_url: `${PUBLIC_URL}/dashboard`,
    });
    return portalSession.url
}