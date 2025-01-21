import React from "react";
import {SideBarMenu} from "@/components/ui/SideBarMenu";

export default function OrganisateursLayout({
                                               children,
                                           }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SideBarMenu type={"organisateur"}>{children}</SideBarMenu>
    );
}