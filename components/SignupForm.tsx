"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormStatus } from 'react-dom'
import { signup } from '@/app/auth/actions'
import { useActionState } from "react"
import { useState } from "react"

export default function SignupForm() {
    const initialState = {
        message: ''
    }
    const [formState, formAction] = useActionState(signup, initialState)
    const { pending } = useFormStatus()
    const [step, setStep] = useState(1)
    const [password, setPassword] = useState("")
    const [verifPassword, setVerifPassword] = useState("")
    const [passwordMatch, setPasswordMatch] = useState(true)
    const [postalCode, setPostalCode] = useState("")
    const [isValidPostal, setIsValidPostal] = useState(true)
    const [showPostalError, setShowPostalError] = useState(false)

    const validatePasswords = (pass: string, verify: string) => {
        const isMatch = pass === verify
        setPasswordMatch(isMatch)
        return isMatch
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        validatePasswords(e.target.value, verifPassword)
    }

    const handleVerifPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerifPassword(e.target.value)
        validatePasswords(password, e.target.value)
    }

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault()
        setStep(2)
    }

    const validatePostalCode = (value: string) => {
        return /^\d{5}$/.test(value)
    }

    const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPostalCode(value)
        setIsValidPostal(validatePostalCode(value))
        setShowPostalError(true)
    }

    const handlePostalBlur = () => {
        setShowPostalError(false)
    }

    return (
        <>
            {step === 1 && (
                <div>
                    <form onSubmit={handleNextStep}>
                        <div className="grid gap-2">
                            <Label htmlFor="pseudo">Pseudonyme</Label>
                            <Input
                                id="pseudo"
                                type="text"
                                placeholder="Pseudonyme"
                                name="pseudo"
                                required
                            />
                        </div>
                        <div className="grid gap-2 mt-2">
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
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <Label htmlFor="Verifpassword">Confirmer votre mot de passe</Label>
                            <Input
                                id="Verifpassword"
                                type="password"
                                name="Verifpassword"
                                required
                                value={verifPassword}
                                onChange={handleVerifPasswordChange}
                            />
                            {!passwordMatch && password && verifPassword && (
                                <p className="text-sm text-red-500">Les mots de passe ne correspondent pas</p>
                            )}
                        </div>


                        <Button
                            className="w-full mt-4"
                            type="submit"
                            disabled={!passwordMatch || !password || !verifPassword}
                        >
                            Continuer
                        </Button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div>
                    <form action={formAction}>
                        <div className="flex gap-4">
                            <div className="grid gap-2 mt-2 flex-1">
                                <Label htmlFor="nom">Nom*</Label>
                                <Input
                                    id="nom"
                                    type="text"
                                    name="nom"
                                    required
                                />
                            </div>
                            <div className="grid gap-2 mt-2 flex-1">
                                <Label htmlFor="prenom">Prénom*</Label>
                                <Input
                                    id="prenom"
                                    type="text"
                                    name="prenom"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 mt-2">
                            <Label htmlFor="adresse">Adresse </Label>
                            <Input
                                id="adresse"
                                type="text"
                                name="adresse"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="grid gap-2 mt-2">
                                <Label htmlFor="ville">Ville </Label>
                                <Input
                                    id="ville"
                                    type="text"
                                    name="ville"
                                />
                            </div>
                            <div className="grid gap-2 mt-2" style={{ minHeight: '80px' }}>
                                <Label htmlFor="code_postal">Code postal</Label>
                                <Input
                                    id="code_postal"
                                    type="text"
                                    name="code_postal"
                                    maxLength={5}
                                    value={postalCode}
                                    onChange={handlePostalChange}
                                    onBlur={handlePostalBlur}
                                    className={!isValidPostal ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {!isValidPostal && showPostalError && (
                                    <p className="text-sm text-red-500">Incorrect</p>
                                )}
                            </div>
                        </div>


                        <Button className="w-full mt-4" type="submit" aria-disabled={pending}>
                            {pending ? 'Submitting...' : "Finaliser l'inscription"}
                        </Button>
                        {formState?.message && (
                            <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
                        )}
                    </form>
                </div>
            )}
        </>
    )
}