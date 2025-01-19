import React from "React";
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