import React from "React";
import {SideBarMenu} from "@/components/ui/SideBarMenu";

export default function ParticipantsLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SideBarMenu type={"participant"}>{children}</SideBarMenu>
    );
}
