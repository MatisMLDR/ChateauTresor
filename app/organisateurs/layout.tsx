import React from "react";
import {SideBarCreator} from "@/components/ui/SideBarCreator";

export default function OrganisateursLayout({
                                               children,
                                           }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SideBarCreator>{children}</SideBarCreator>
    );
}
