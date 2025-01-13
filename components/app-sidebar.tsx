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
    BookOpen,
    Bot,
    Command,
    GalleryVerticalEnd,
    Settings2,
    SquareTerminal,
} from "lucide-react"

const dataUser = {
    user: {
        name: "chateautresor",
        email: "chateautresor@gmail.com",
        avatar: "/logo.svg",
    },
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
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
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

const dataOrganisateur = {
    user: {
        name: "chateautresororga",
        email: "chateautresor@gmail.com",
        avatar: "/logo.svg",
    },
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
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
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
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}

