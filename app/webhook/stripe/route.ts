import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
    const supabase = createClient()

    console.log('Webhook received')
    try {
        const response = await request.json()
        console.log(response)
        // On subscribe, write to db
        console.log(response.data.object.customer)

        const { error: planError } = await supabase.auth.updateUser({
            data: {
                plan: response.data.object.id,
            },
        })

        if (planError) {
            throw new Error(`Supabase error: ${planError.message}`);
        }

        // Update the user's plan in the database


        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                plan: response.data.object.id,
            },
        })

        // const { error } = await supabase
        //     .from('users')
        //     .update({ plan: response.data.object.id })
        //     .eq('stripe_id', response.data.object.customer);

        if (updateError) {
            throw new Error(`Supabase error: ${updateError.message}`);
        }
        // Process the webhook payload
    } catch (error: any) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        })
    }
    return new Response('Success', { status: 200 })
}