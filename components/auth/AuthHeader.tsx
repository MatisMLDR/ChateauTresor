import React from 'react'
import { CardDescription, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import Image from 'next/image'

type AuthHeaderProps = {
  redirect: string
  title: string
  description: string
}

const AuthHeader = ({ redirect, title, description }: AuthHeaderProps) => {
  return (
    <CardHeader className="space-y-1">
      <div className="flex justify-center py-4">
        <Link href={redirect === "participant" ? "/" : "/organisateur"}>
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
        </Link>
      </div>

      <CardTitle className="text-2x\l font-bold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  )
}

export default AuthHeader
