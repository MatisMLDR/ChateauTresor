'use client';

import { Map, MoreHorizontal, QrCode, Search, Settings, Star, Trash, type, User } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { Skeleton } from '@/components/ui/skeleton';

import { SideBarProps } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function NavProjects({
  chasse,
  type,
}: {
  chasse: {
    id: string;
  }[];
  type: SideBarProps['type'];
}) {
  const { isMobile } = useSidebar();
  const [chasseNames, setChasseNames] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fonction pour récupérer le nom d'une chasse depuis l'API
    const fetchChasseName = async (id: string) => {
      try {
        const response = await fetch(`/api/chasses/${id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data.titre;
      } catch (error) {
        console.error(`Erreur lors de la récupération de la chasse ${id}`, error);
      }
    };

    // Récupérer tous les noms des chasses
    const fetchAllChasseNames = async () => {
      const names: Record<string, string> = {};
      try {
        const namesArray = await Promise.all(chasse.map((item) => fetchChasseName(item.id)));
        chasse.forEach((item, index) => {
          names[item.id] = namesArray[index];
        });
        setChasseNames(names);
      } catch (error) {
        console.error('Erreur lors de la récupération des noms des chasses', error);
      }
    };

    fetchAllChasseNames();
  }, [chasse]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        {type === 'organisateur' ? 'Chasses récentes' : 'Chasses inscrites'}
      </SidebarGroupLabel>
      <SidebarMenu>
        {chasse.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              {/* Adapte l'URL en fonction du rôle de l'utilisateur */}
              <Link
                href={`${type === 'organisateur' ? '/organisateurs/dashboard/modifier_chasse/' : '/participants/dashboard/chasses/'}${item.id}`}
              >
                <Map />
                {chasseNames[item.id] || <Skeleton className={'h-full w-full'} />}
              </Link>
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
                {type === 'organisateur' ? (
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
                    <Link href={`/participants/dashboard/chasses/${item.id}`}>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}