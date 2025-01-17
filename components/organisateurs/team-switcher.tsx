"use client"

import * as React from "React"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import Image from 'next/image';

import { SideBarProps } from "@/types"
import { useEffect } from "react"
import { useState } from "react";

export function TeamSwitcher({
                               teams,
                               type
                             }: {
  teams: {
    name: string
    plan: string
  }[],
  type: SideBarProps['type'];

}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = useState({
    name: "Château",
    plan: "Trésor"
  })

  useEffect(() => {
    if (type === "organisateur" && teams.length > 0) {
      setActiveTeam(teams[0])
    }
  }, [type, teams])

  return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                  size="lg"
                  className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground 
                  ${type === "organisateur" ? "cursor-pointer" : "cursor-default hover:bg-sidebar"}`}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image src={"/logo.svg"} alt={"Logo Chateau Tresor"} layout={"fill"} className={"!static"} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
                {type === "organisateur" && <ChevronsUpDown className="ml-auto" />}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            {type === "organisateur" && (
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Équipes
                  </DropdownMenuLabel>
                  {teams.map((team, index) => (
                      <DropdownMenuItem
                          key={team.name}
                          onClick={() => setActiveTeam(team)}
                          className="gap-2 p-2"
                      >
                        {team.name}
                        <DropdownMenuShortcut>{index + 1}</DropdownMenuShortcut>
                      </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">Rejoindre une équipe</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            )}
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
  )
}
