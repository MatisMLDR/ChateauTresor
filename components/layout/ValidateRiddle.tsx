"use client"

import React, {useState} from 'react'
import { InputOTPWithDash } from '../ui/input-otp-dash'
import { TitleTwo } from '../ui/TitleTwo'
import { SnapDrawer } from '../ui/SnapDrawer'

const ValidateRiddle = () => {
    const [isShowed, setIsShowed] = useState(false);


    return (
        <section className="grid w-full h-screen bg-primary place-items-center">
            <TitleTwo text={isShowed ? "Scanner le QR Code" : "Saisir le code" } color="light" />
            <InputOTPWithDash />
            <SnapDrawer />
            <div className={"flex flex-col"}>
                <span
                    className={"text-secondary"}>{isShowed ? "Vous n'avez pas de caméra ?" : "Vous préférez utiliser votre caméra ?"}</span>
                <span className={"text-amber-600 transition hover:underline text-center hover:cursor-pointer"}
                      onClick={() => setIsShowed(!isShowed)}>{isShowed ? "Saisir le code" : "Scanner le code"}</span>
            </div>

        </section>
    );
};

export default ValidateRiddle;

