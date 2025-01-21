"use client"

import { ArrowUpRight, ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import Image from 'next/image';

import EquipeOrganisatrice from "@/classes/EquipeOrganisatrice";
import { MembreEquipe } from "@/classes/MembreEquipe";
import { SideBarProps } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";


export function TeamSwitcher({
  type,
  id_equipe_courante,
}: {
  type: SideBarProps['type'],
  id_equipe_courante?: UUID
}) {
  const { isMobile } = useSidebar()
  const [equipes, setEquipes] = useState<EquipeOrganisatrice[]>([])
  const [idMembre, setIdMembre] = useState<UUID | null>(null)
  const [activeTeam, setActiveTeam] = useState<EquipeOrganisatrice | undefined>(
    equipes.find((team) => team.getIdEquipe() === id_equipe_courante)
  )
  if (type === "organisateur") {
    useEffect(() => {
      const fetchUser = async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.email) {

          try {
            const membre = await MembreEquipe.readByIdUser(user.id as UUID);
            setIdMembre(membre.getIdMembre() as UUID);
            let equipesDuMembre = await MembreEquipe.getAllEquipesOfMembre(membre.getIdMembre() as UUID);
            // Display only the first three teams if they have more than commit
            if (equipesDuMembre.length > 3) {
              equipesDuMembre = equipesDuMembre.slice(0, 3);
            }
            setEquipes(equipesDuMembre as any);
          } catch (err) {
            console.error('Erreur lors de la récupération des détails du château :', err);
          }
        }
      };

      fetchUser();
    }, []);

    // Set the active team once equipes are fetched and id_equipe_courante is available
    useEffect(() => {
      const setTeam = async () => {
        if (equipes.length > 0) {
          // Try to find the active team from the equipes array
          const team = equipes.find((team) => team.getIdEquipe() === id_equipe_courante);
          if (team) {
            setActiveTeam(team);
          } else {
            // If the team is not found, try using the `readId` method
            try {
              const teamFromReadId = await EquipeOrganisatrice.readId(id_equipe_courante!);
              setActiveTeam(teamFromReadId);
            } catch (err) {
              console.error("Failed to fetch team using readId:", err);
            }
          }
        }
      };

      setTeam();
    }, [equipes, id_equipe_courante]);  // Run whenever `equipes` or `id_equipe_courante` changes

    if (equipes.length === 0 || !activeTeam) {
      return (
        <Skeleton className="w-full h-10 rounded-md" />
      )
    }
  }

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
              {type === "participant" &&
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    C. Trésor
                  </span>
                </div>
              }
              {type === "organisateur" &&
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam?.getNom()}
                  </span>
                  <span className="truncate text-xs">{activeTeam?.getStatutVerification()}</span>
                </div>
              }
              {type === "organisateur" && <ChevronsUpDown className="ml-auto" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {type === "organisateur" && (
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
              key={id_equipe_courante}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Équipes
              </DropdownMenuLabel>
              {equipes.map((team, index) => (
                <DropdownMenuItem
                  key={team.getNom()}
                  className={`gap-2 p-2 ${team === activeTeam ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                >
                  <Link href={`/organisateurs/dashboard/${team.getIdEquipe()}`} className="flex items-center gap-2">
                    {team.getNom()}
                  </Link>
                  <DropdownMenuShortcut>{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <Link href={`/organisateurs/dashboard/${id_equipe_courante}/equipes/${idMembre}`} className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <ArrowUpRight className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">Voir toutes ses équipes</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 p-2">
                <Link href={`/organisateurs/onboarding`} className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">Nouvelle équipe</div>
                </Link>
              </DropdownMenuItem>

            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
