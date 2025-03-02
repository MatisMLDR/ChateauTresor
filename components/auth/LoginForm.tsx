
"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginOrganisateur, loginParticipant, loginProprietaire, loginUser } from '@/app/auth/actions'
import { useActionState } from "react"
import { AuthProps } from "@/types"

export default function LoginForm({ redirect }: AuthProps) {
    const initialState = {
        message: ''
    }
    let action;
    switch (redirect) {
        case "participant":
            action = loginParticipant;
            break;
        case "organisateur":
            action = loginOrganisateur;
            break;
        default:
            action = loginProprietaire;
    }
    const [formState, formAction] = useActionState(action, initialState)
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
            <div className="grid gap-2 mt-2">
                <Label htmlFor="password">Mot De Passe</Label>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                />
            </div>
            <Button className="w-full text-secondary mt-4" type="submit">Se connecter</Button>
            {formState?.message && (
                <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
            )}
        </form>
    </>)
}