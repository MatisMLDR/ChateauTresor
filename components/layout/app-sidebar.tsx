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
import { useEffect } from 'react';

export function AppSidebar({ type, fullyUnlocked, ...props }: SideBarProps) {

  const { id_equipe } = useParams();

  useEffect(() => {
    if (id_equipe) {
      localStorage.setItem('id_equipe', id_equipe as string);
    }
  }, [id_equipe]);


  if (!fullyUnlocked) {
    const data = dataNotFullyUnlocked;
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher type={type} id_equipe_courante={id_equipe as UUID} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser type={type} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  const data = type === 'organisateur' ? dataOrganisateur : type === 'participant' ? dataUser : dataProprietaire;

  let navMain = [  // Use `let` so that it's mutable
    {
      title: 'Dashboard',
      url: `/organisateurs/dashboard/${id_equipe}`,  // Dynamic URL with `id_equipe`
      icon: LayoutDashboard,
    },
    {
      title: 'Châteaux',
      url: `/organisateurs/dashboard/${id_equipe}/chateaux`,  // Dynamic URL with `id_equipe`
      icon: Castle,
    },
    {
      title: 'Chasses',
      url: `/organisateurs/dashboard/${id_equipe}/chasses`,  // Dynamic URL with `id_equipe`
      icon: LibraryBig,
    },
    {
      title: 'Demandes',
      url: `/organisateurs/dashboard/${id_equipe}/demandes`,  // Dynamic URL with `id_equipe`
      icon: BellPlus,
    },
    {
      title: 'Créer',
      url: `/organisateurs/dashboard/${id_equipe}/creation_chasse`,  // Dynamic URL with `id_equipe`
      icon: Plus,
    },
    {
      title: 'Profil',
      url: `/organisateurs/dashboard/${id_equipe}/profil`,  // Dynamic URL with `id_equipe`
      icon: User,
      items: [
        {
          title: 'Informations',
          url: `/organisateurs/dashboard/${id_equipe}/profil/informations`,  // Dynamic URL with `id_equipe`
        },
        {
          title: 'Statistiques',
          url: `/organisateurs/dashboard/${id_equipe}/profil/statistiques`,  // Dynamic URL with `id_equipe`
        },
      ],
    },
  ];

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
