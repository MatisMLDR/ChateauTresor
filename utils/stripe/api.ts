import { Stripe } from 'stripe';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '../supabase/server';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ? process.env.NEXT_PUBLIC_WEBSITE_URL : "http://localhost:3000"
export async function getStripePlan(email: string) {
    const supabase = createClient()
    // const {
    //     data: user
    // } = await supabase.from('users').select().eq('email', email)


    const user = await (await supabase.auth.getUser()).data.user;

    if (!user) {
        throw new Error("User not found")
    }

    const subscription = await stripe.subscriptions.retrieve(
        user.user_metadata.stripe_id as string
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
    
    const user = await (await supabase.auth.getUser()).data.user

    if (!user) {
        throw new Error("User not found")
    }

    const customerSession = await stripe.customerSessions.create({
        customer: user.user_metadata.stripe_id as string,
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
    
    const user = await (await supabase.auth.getUser()).data.user

    if (!user) {
        throw new Error("User not found")
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.user_metadata.stripe_id as string,
        return_url: `${PUBLIC_URL}/dashboard`,
    });
    return portalSession.url
}

export async function getStripeProducts(): Promise<StripeProduct[]> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-06-20'
    });

    const products = await stripe.products.list({
        active: true,
        expand: ['data.default_price']
    });

    return products.data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        features: product.metadata?.features ? JSON.parse(product.metadata.features) : [],
        price: product.default_price as Stripe.Price
    }));
}