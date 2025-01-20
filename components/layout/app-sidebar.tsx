'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { TeamSwitcher } from '../organisateurs/team-switcher';
import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';

import { dataNotFullyUnlocked, dataOrganisateur, dataProprietaire, dataUser } from '@/constants';
import { SideBarProps } from '@/types';
import { UUID } from 'crypto';
import {
  BellPlus,
  Castle,
  LayoutDashboard,
  LibraryBig,
  Plus,
  User
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MembreEquipe } from '@/classes/MembreEquipe';
import { Skeleton } from '../ui/skeleton';

export function AppSidebar({ type, fullyUnlocked, ...props }: SideBarProps) {

  const { id_equipe } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [idUser, setIdUser] = useState<UUID | null>(null);
  const [navMain, setNavMain] = useState([] as any);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    if (typeof window !== 'undefined' && id_equipe) {
      localStorage.setItem('id_equipe', id_equipe as string);
    }
  }, [id_equipe]);

   // Check if the current member is a team admin (owner)
   useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);  // Commencer le chargement
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.email) {
          setIdUser(user.id as UUID);
          const membre = await MembreEquipe.readByIdUser(user.id as UUID);
          const appartenanceEquipeCourante = await membre.getAppartenanceEquipe(id_equipe as UUID);
          const isOwner = appartenanceEquipeCourante.role_equipe === 'Administrateur'; 
          if (isOwner) {
            localStorage.setItem('isOwner', 'true');
            setIsOwner(true);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'équipe :', err);
      } finally {
        setLoading(false);  // Fin du chargement
      }
    };

    if (id_equipe) {
      fetchUser();
    }
  }, [id_equipe]);

  // Set navMain
  useEffect(() => {
    if (!id_equipe || !idUser) {
      return
    }

    let navMainData = [  // Use `let` so that it's mutable
      {
        title: 'Dashboard',
        url: `/organisateurs/dashboard/${id_equipe}`,  
        icon: LayoutDashboard,
      },
      {
        title: 'Châteaux',
        url: `/organisateurs/dashboard/${id_equipe}/chateaux`,  
        icon: Castle,
      },
      {
        title: 'Chasses',
        url: `/organisateurs/dashboard/${id_equipe}/chasses`,  
        icon: LibraryBig,
      },
       
      ...(isOwner ? [{
        title: 'Demandes',
        url: `/organisateurs/dashboard/${id_equipe}/demandes`,  
        icon: BellPlus,
      }] : []),  // Si isOwner est vrai, on ajoute cet objet, sinon un tableau vide
      {
        title: 'Créer',
        url: `/organisateurs/dashboard/${id_equipe}/creation_chasse`,  
        icon: Plus,
      },
      {
        title: 'Profil',
        url: `/organisateurs/dashboard/${id_equipe}/profil`,  
        icon: User,
        items: [
          {
            title: 'Informations',
            url: `/organisateurs/dashboard/profil/${idUser}/informations`,  
          },
          {
            title: 'Statistiques',
            url: `/organisateurs/dashboard/profil/${idUser}/statistiques`,  
          },
        ],
      },
    ]

    setNavMain(navMainData);
  }, [isOwner, idUser, id_equipe]);

  if (loading) {
    return <Skeleton className='h-full' />;
  }

  // const data = type === 'organisateur' ? dataOrganisateur : type === 'participant' ? dataUser : dataProprietaire;


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher type={type} id_equipe_courante={id_equipe as UUID} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects type={type} id_equipe_courante={id_equipe as UUID} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser type={type} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
