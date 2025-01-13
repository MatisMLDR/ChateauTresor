"use client"

import {
  Settings,
  Star,
  Map,
  MoreHorizontal,
  Trash,
  Search,
  User,
  QrCode,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { SideBarProps } from "@/types";
import Link from "next/link";

export function NavProjects({ chasse, user }: {
  chasse: {
    name: string
    url: string
    id: number
  }[],
  user: SideBarProps["user"]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        {user === 'organisateur' ? 'Chasses récentes' : 'Chasses inscrites'}
      </SidebarGroupLabel>
      <SidebarMenu>
        {chasse.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <Map />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                {user === 'organisateur' ? (
                  <>
                    <Link href={`${item.id}/update`}>
                      <DropdownMenuItem>
                        <Settings className="text-muted-foreground" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`${item.id}/avis`}>
                      <DropdownMenuItem>
                        <Star className="text-muted-foreground" />
                        <span>Avis</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`${item.id}/qr`}>
                      <DropdownMenuItem>
                        <QrCode className="text-muted-foreground" />
                        <span>QR</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash className="text-muted-foreground" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <Link href={`${item.id}/voir`}>
                      <DropdownMenuItem>
                        <Search className="text-muted-foreground" />
                        <span>Voir</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link href={`${item.id}/avis`}>
                      <DropdownMenuItem>
                        <Star className="text-muted-foreground" />
                        <span>Avis</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`${item.id}/createur`}>
                      <DropdownMenuItem>
                        <User className="text-muted-foreground" />
                        <span>Voir le créateur</span>
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

