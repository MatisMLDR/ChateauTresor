
"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPassword } from '@/app/auth/actions'
import { useActionState } from "react"
export default function ForgotPasswordForm() {
    const initialState = {
        message: ''
    }
    const [formState, formAction] = useActionState(forgotPassword, initialState)
    return (<>
        <form action={formAction}>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    name="email"
                    required
                />
            </div>
            <Button className="w-full text-secondary mt-4" type="submit">Réinitialiser Mot De Passe</Button>
            {formState?.message && (
                <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
            )}
        </form >
    </>)
}