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
import { UUID } from 'crypto';
import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice';
import Chasse from '@/classes/Chasse';
import { createClient } from '@/utils/supabase/client';
import { Participant } from '@/classes/Participant';
import { Proprietaire } from '@/classes/Proprietaire';
import Chateau from '@/classes/Chateau';

export function NavProjects({
  id_equipe_courante,
  type,
}: {
  id_equipe_courante?: UUID;
  type: SideBarProps['type'];
}) {
  const { isMobile } = useSidebar();
  const [lastThreeHunts, setLastThreeHunts] = useState<Chasse[]>([]);
  const [chateau, setChateau] = useState<Chateau | null>(null);
  const [idUser, setIdUser] = useState<UUID | null>(null);
  if (type === "organisateur") {
    useEffect(() => {
      const fetchLastThreeHunts = async () => {
        try {
          const equipe = await EquipeOrganisatrice.readId(id_equipe_courante!);
          if (equipe) {
            localStorage.setItem('equipe', JSON.stringify(equipe));
            const teamHunts = await equipe.getAllChasses();
            setLastThreeHunts(teamHunts.slice(0, 3)); // Set the last 3 hunts
          }
        } catch (err) {
          console.error('Error fetching hunts:', err);
        }
      };
      fetchLastThreeHunts();
    }, [id_equipe_courante]);
  } else {
    // fetch the current user
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user && user.email) {
            setIdUser(user.id as UUID);
          }
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      };
    }, [idUser]);

    if (type === "participant") {
      // Fetch last three hunts of the participant
      useEffect(() => {
        if (!idUser) return;
        const fetchLastThreeHunts = async () => {
          try {
            const participant = await Participant.readByIdUser(idUser as UUID);
            let hunts = await participant.getAllChasses();
            if (hunts) {
              hunts = hunts.slice(0, 3);
            }
            setLastThreeHunts(hunts);
          } catch (err) {
            console.error('Erreur lors de la récupération des détails du château :', err);
          }
        }
        fetchLastThreeHunts();
      }, []);
    }

    if (type === "proprietaire") {
      // Fetch the castle of the owner
      useEffect(() => {
        if (!idUser) return;
        const fetchCastle = async () => {
          try {
            const proprietaire = await Proprietaire.readByIdUser(idUser as UUID);
            const castle = await proprietaire.getChateau();
            setChateau(castle);
          } catch (err) {
            console.error('Erreur lors de la récupération des détails du château :', err);
          }
        };
        fetchCastle();
      }, [idUser]);
    }
  }

  const renderMenuItems = (hunt: Chasse) => {

    // Based on user type, determine actions
    switch (type) {
      case 'organisateur':

        return (
          <>
            <Link href={`/organisateurs/dashboard/${id_equipe_courante}/modifier_chasse/${hunt.getIdChasse()}`}>
              <DropdownMenuItem>
                <Settings className="text-muted-foreground" />
                Modifier
              </DropdownMenuItem>
            </Link>
            <Link href={`/organisateurs/dashboard/${id_equipe_courante}/${hunt.getIdChasse()}/avis`}>
              <DropdownMenuItem>
                <Star className="text-muted-foreground" />
                Avis
              </DropdownMenuItem>
            </Link>
            <Link href={`/organisateurs/dashboard/${id_equipe_courante}/${hunt.getIdChasse()}/qr`}>
              <DropdownMenuItem>
                <QrCode className="text-muted-foreground" />
                QR
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash className="text-muted-foreground" />
              Supprimer
            </DropdownMenuItem>
          </>
        );
      case 'participant':
        return (
          <>
            <Link href={`/participants/dashboard/chasses/${hunt.getIdChasse()}`}>
              <DropdownMenuItem>
                <Search className="text-muted-foreground" />
                Voir
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={`/participants/dashboard/chasses/${hunt.getIdChasse()}/avis`}>
              <DropdownMenuItem>
                <Star className="text-muted-foreground" />
                Avis
              </DropdownMenuItem>
            </Link>
            <Link href={`/participants/dashboard/chasses/${hunt.getIdChasse()}/createur`}>
              <DropdownMenuItem>
                <User className="text-muted-foreground" />
                Voir le créateur
              </DropdownMenuItem>
            </Link>
          </>
        );
      case 'proprietaire':
        return (
          <>
            <Link href={`/proprietaires/${chateau?.getIdChateau()}/dashboard`}>
              <DropdownMenuItem>
                <Search className="text-muted-foreground" />
                Voir
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={`/proprietaire/${chateau?.getIdChateau()}/modifier`}>
              <DropdownMenuItem>
                <Settings className="text-muted-foreground" />
                Modifier
              </DropdownMenuItem>
            </Link>
            <Link href={`/proprietaire/${chateau?.getIdChateau()}/calendrier`}>
              <DropdownMenuItem>
                <Calendar className="text-muted-foreground" />
                Calendrier
              </DropdownMenuItem>
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        {type === 'organisateur' ? 'Chasses récentes' : type === 'participant' ? 'Vos chasses' : 'Châteaux'}
      </SidebarGroupLabel>
      {type != "proprietaire" && (
        <SidebarMenu>
          {lastThreeHunts.map((hunt) => (
            <SidebarMenuItem key={hunt.getIdChasse()}>
              <SidebarMenuButton asChild>
                <Link
                  href={
                    type === 'organisateur'
                      ? `/organisateurs/dashboard/${id_equipe_courante}/chasses/${hunt.getIdChasse()}`
                      : type === 'participant'
                        ? `/participants/dashboard/chasses/${hunt.getIdChasse()}`
                        : `/chateaux/${hunt.getIdChasse()}`
                  }
                  className="inline-flex max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {/* {type === 'proprietaire' ? <Castle /> : <Map />} */}
                  {hunt.getTitre() || <Skeleton className={'h-full w-full'} />}
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-lg" side={isMobile ? 'bottom' : 'right'} align={isMobile ? 'end' : 'start'}>
                  {renderMenuItems(hunt)}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      )}
    </SidebarGroup>
  );
}
