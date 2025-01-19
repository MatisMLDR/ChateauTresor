'use client';

import { Map, Castle, MoreHorizontal, QrCode, Search, Settings, Star, Calendar, Trash, User } from 'lucide-react';

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
    // Fonction pour récupérer le nom d'une chasse ou d'un château depuis l'API
    const fetchItemName = async (id: string) => {
      try {
        let url = `/api/chasses/${id}`;
        if (type === "proprietaire") {
          url = `/api/chateaux/${id}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        if(type === "proprietaire") {
          return data.nom;
        }
        return data.titre;
      } catch (error) {
        console.error(`Erreur lors de la récupération de l'item ${id}`, error);
      }
    };
  
    // Récupérer tous les noms des chasses ou des châteaux
    const fetchAllItemNames = async () => {
      const names: Record<string, string> = {};
      try {
        const namesArray = await Promise.all(chasse.map((item) => fetchItemName(item.id)));
        chasse.forEach((item, index) => {
          names[item.id] = namesArray[index];
        });
        setChasseNames(names);
      } catch (error) {
        console.error('Erreur lors de la récupération des noms des chasses', error);
      }
    };
  
    fetchAllItemNames();
  }, [chasse, type]); // Ajoutez type à la liste des dépendances

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        {type === 'organisateur' ? 'Chasses récentes' : type === 'participant' ? 'Vos chasses' : 'Châteaux'}
      </SidebarGroupLabel>
      <SidebarMenu>
        {chasse.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              {/* Adapte l'URL en fonction du rôle de l'utilisateur */}
              <Link
                href={`${type === 'organisateur' ? '/organisateurs/dashboard/modifier_chasse/' : type === 'participant' ? `/participants/dashboard/chasses/'}${item.id}` : '/chateaux/'}${item.id}`}
              >
                {type === 'proprietaire' ? <Castle /> : <Map />}
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
                    <Link href={`/organisateurs/dashboard/modifier_chasse/${item.id}`}>
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
                ) : type === 'participant' ? (
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
                ) : (        
                  //Partie sur les propriétaires de châteaux
                  <>
                    <Link href={`/proprietaires/dashboard/chasses/${item.id}`}>
                      <DropdownMenuItem>
                        <Search className="text-muted-foreground" />
                        <span>Voir</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link href={`/proprietaire/modifier/${item.id}`}>
                      <DropdownMenuItem>
                        <Settings className="text-muted-foreground" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/proprietaire/calendrier/${item.id}`}>
                      <DropdownMenuItem>
                        <Calendar className="text-muted-foreground" />
                        <span>Calendrier</span>
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