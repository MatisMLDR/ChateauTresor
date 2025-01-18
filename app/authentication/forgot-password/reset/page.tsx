
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { notFound } from 'next/navigation'
export default async function ResetPassword({ searchParams }: { searchParams: { redirect: "participant" | "organisateur" } }) {

    const { redirect } = await searchParams
if (!redirect) {
        <div>loading...</div>
    }

    if (redirect != "participant" && redirect != "organisateur") {
        notFound()
    }

    return (
        <div className="flex items-center justify-center bg-muted min-h-screen" >
            <Card className="w-[350px] mx-auto">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center py-4">
                        <Link href={redirect === "participant" ? "/" : "/organisateurs"}>
                            <Image src="/logo.svg" alt="logo" width={50} height={50} />
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold">Enter your new Password</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <ResetPasswordForm redirect={redirect} />
                </CardContent>
                <CardFooter className="flex-col text-center">
                </CardFooter>
            </Card>
        </div>
    )
}