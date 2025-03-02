import { AppSidebar } from "@/components/layout/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { SideBarProps } from '@/types';

import React from "react";

export function SideBarMenu({ children, type, fullyUnlocked = true }: SideBarProps) {

    return (
        <SidebarProvider>
            <AppSidebar type={type} fullyUnlocked={fullyUnlocked} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1 z-10" />
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>

    )
}
