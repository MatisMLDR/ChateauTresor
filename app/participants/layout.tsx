import React from "react";
import {SideBarPlayer} from "@/components/ui/SideBarPlayer";

export default function ParticipantsLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SideBarPlayer>{children}</SideBarPlayer>
    );
}
