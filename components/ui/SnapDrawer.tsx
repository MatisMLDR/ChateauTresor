"use client"

import * as React from "react"
import { AudioPlayer } from "@/components/ui/AudioPlayer"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export function SnapDrawer() {

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Indice N°1</DrawerTitle>
                        <DrawerDescription>Cet indice a été catégorisé comme facile</DrawerDescription>
                    </DrawerHeader>

                    <AudioPlayer soundLink={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/355309/Swing_Jazz_Drum.mp3"} />

                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline" className={"text-primary"}>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
