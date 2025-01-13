"use client"

import * as React from "react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd,
    Settings2,
    LayoutDashboard,
    MapPin,
    Castle,
    Search,
    History,
} from "lucide-react"

const dataUser = {
    teams: [
        {
            name: "Prestige Heritage",
            logo: GalleryVerticalEnd,
            plan: "School",
        },
        {
            name: "Dream Maker",
            logo: AudioWaveform,
            plan: "Organisator",
        },
        {
            name: "Historical Life",
            logo: Command,
            plan: "Client",
        },
    ],
    navMain: [
        {
            title: "Carte",
            url: "#",
            icon: MapPin,
            isActive: true,
        },
        {
            title: "Châteaux",
            url: "#",
            icon: Castle,
        },
        {
            title: "Chasses",
            url: "#",
            icon: Search,
        },
        {
            title: "Historique",
            url: "#",
            icon: History,
        },
        {
            title: "Paramètres",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    chasses: [
        {
            name: "Design Engineering",
            url: "#",
            id: 1,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            id: 2,
        },
        {
            name: "Travel",
            url: "#",
            id: 3,
        },
    ],
}

const dataOrganisateur = {
    teams: [
        {
            name: "Prestige Heritage",
            logo: GalleryVerticalEnd,
            plan: "School",
        },
        {
            name: "Dream Maker",
            logo: AudioWaveform,
            plan: "Organisator",
        },
        {
            name: "Historical Life",
            logo: Command,
            plan: "Client",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
        },
        {
            title: "Châteaux",
            url: "#",
            icon: Castle,
        },
        {
            title: "Chasses",
            url: "#",
            icon: Search,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    chasses: [
        {
            name: "Design Engineering",
            url: "#",
            id: 1,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            id: 2,
        },
        {
            name: "Travel",
            url: "#",
            id: 3,
        },
    ],
}

import { SideBarProps } from '@/types';

export function AppSidebar({ user, ...props }: SideBarProps){

    const data = user === "organisateur" ? dataOrganisateur : dataUser;

    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects user={user} chasse={data.chasses} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}

