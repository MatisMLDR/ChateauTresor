import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
    const supabase = createClient()

    console.log('Webhook received')
    try {
        const response = await request.json()
        console.log(response)
        // On subscribe, write to db
        console.log(response.data.object.customer)

        // await db.update(usersTable).set({ plan: response.data.object.id }).where(eq(usersTable.stripe_id, response.data.object.customer));
        const { error } = await supabase
            .from('users')
            .update({ plan: response.data.object.id })
            .eq('stripe_id', response.data.object.customer);

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }
        // Process the webhook payload
    } catch (error: any) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        })
    }
    return new Response('Success', { status: 200 })
}