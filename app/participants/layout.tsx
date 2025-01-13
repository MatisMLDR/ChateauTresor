import React from "react";
import {SideBarMenu} from "@/components/ui/SideBarMenu";

export default function ParticipantsLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SideBarMenu user={"joueur"}>{children}</SideBarMenu>
    );
}
