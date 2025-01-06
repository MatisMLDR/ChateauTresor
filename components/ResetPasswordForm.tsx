
"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from '@/app/auth/actions'
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react"

function GetCodeHiddenInput() {
    const searchParams = useSearchParams();
    return <Input type="hidden" name="code" value={searchParams.get('code')!} />
}

export default function ResetPasswordForm() {
    const initialState = {
        message: ''
    }
    const [formState, formAction] = useActionState(resetPassword, initialState)
    return (<>
        <form action={formAction}>
            <div className="grid gap-2">
                <Label htmlFor="email">Mot De Passe</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Entrer nouveau mot de passe"
                    name="password"
                    required
                />
                <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    name="confirm_password"
                    required
                />
                <Suspense>
                    <GetCodeHiddenInput />
                </Suspense>
            </div>
            <Button className="w-full mt-4" type="submit">Mettre à jour le mot de passe</Button>
            {formState?.message && (
                <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
            )}
        </form >
    </>)
}