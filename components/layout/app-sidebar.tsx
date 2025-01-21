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

import { dataNotFullyUnlocked } from '@/constants';
import { SideBarProps } from '@/types';
import { UUID } from 'crypto';
import {
  BellPlus,
  Castle,
  History,
  LayoutDashboard,
  LibraryBig,
  MapPin,
  Plus,
  Search,
  Trophy,
  User
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MembreEquipe } from '@/classes/MembreEquipe';
import { Skeleton } from '../ui/skeleton';

export function AppSidebar({ type, fullyUnlocked, ...props }: SideBarProps) {

  const { id_equipe } = useParams();
  const [isOwner, setIsOwner] = useState(false);
  const [idUser, setIdUser] = useState<UUID | null>(null);
  const [navMainOrganisateur, setNavMainOrganisateur] = useState([] as any);
  const [navMainParticipant, setNavMainParticipant] = useState([] as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && id_equipe && type === "organisateur") {
      localStorage.setItem('id_equipe', id_equipe as string);
    }
  }, [id_equipe]);

  // fetch user details
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
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l"utilisateur :', err);
      } finally {
        setLoading(false);  // Fin du chargement
      }
    };

    if (id_equipe) {
      fetchUser();
    }
  }, [id_equipe]);


  // Check if the current member is a team admin (owner)
  useEffect(() => {
    if (type !== "organisateur") {
      return;
    }
    if (!id_equipe || !idUser) {
      return;
    }
    const checkIfIsOwner = async () => {
      setLoading(true);
      try {
        const membre = await MembreEquipe.readByIdUser(idUser as UUID);
        const appartenanceEquipeCourante = await membre.getAppartenanceEquipe(id_equipe as UUID);
        const isOwner = appartenanceEquipeCourante.role_equipe === 'Administrateur';
        if (isOwner) {
          localStorage.setItem('isOwner', 'true');
          setIsOwner(true);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'équipe :', err);
      } finally {
        setLoading(false);
      }
    }

    checkIfIsOwner();

  }, [id_equipe, idUser]);

  // Set navMain
  useEffect(() => {
    if (type !== "organisateur") {
      return
    }
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
        url: `/organisateurs/dashboard/${id_equipe}/profil/${idUser}/parametres`,
        icon: User,
      },
    ]

    setNavMainOrganisateur(navMainData);
  }, [isOwner, idUser, id_equipe]);

  useEffect(() => {
    if (type !== "participant") {
      return
    }
    if (!idUser) {
      return
    }
    console.log("Nous sommes rentrés dans le useEffect de type participant");
    const navMainData = [
      {
        title: 'Carte',
        url: '/participants/dashboard/carte',
        icon: MapPin,
        isActive: true,
      },
      {
        title: 'Châteaux',
        url: '/participants/dashboard/chateaux',
        icon: Castle,
      },
      {
        title: 'Chasses',
        url: '/participants/dashboard/chasses',
        icon: Search,
      },
      {
        title: 'Classements',
        url: '/participants/dashboard/classements',
        icon: Trophy,
      },
      {
        title: 'Historique',
        url: '/participants/dashboard/historique',
        icon: History,
      },
      {
        title: 'Profil',
        url: `/participants/dashboard/profil`,
        icon: User,
        items: [
          {
            title: 'Informations',
            url: `/participants/dashboard/profil/${idUser}/informations`,
          },
          {
            title: 'Paramètres',
            url: `/participants/dashboard/profil/${idUser}/parametres`,
          },
        ],
      },
    ]
    setNavMainParticipant(navMainData);
  }, [idUser]);



  if (loading) {
    return <Skeleton className='h-full' />;
  }

  // const data = type === 'organisateur' ? dataOrganisateur : type === 'participant' ? dataUser : dataProprietaire;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {(type === "organisateur" && id_equipe) 
          ? <TeamSwitcher type={type} id_equipe_courante={id_equipe as UUID} />
          : <TeamSwitcher type={type} />
        }
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={type === "participant" ? navMainParticipant : navMainOrganisateur} />
        {type === "organisateur" 
          ? <NavProjects type={type} id_equipe_courante={id_equipe as UUID} />
          : <NavProjects type={type} />
        }
      </SidebarContent>
      <SidebarFooter>
        <NavUser type={type} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
