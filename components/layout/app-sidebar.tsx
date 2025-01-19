'use client';

import * as React from 'React';

import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';
import { TeamSwitcher } from '../organisateurs/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import {
  Castle,
  History,
  LayoutDashboard,
  MapPin,
  Search,
  Plus,
  Calendar,
  LibraryBig,
  User,
} from 'lucide-react';
import { SideBarProps } from '@/types';

const dataUser = {
  teams: [
    {
      name: 'Prestige Heritage',
      plan: 'Creator',
    },
    {
      name: 'Dream Maker',
      plan: 'Organisator',
    },
    {
      name: 'Historical Life',
      plan: 'CEO',
    },
  ],
  navMain: [
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
      title: 'Historique',
      url: '/participants/dashboard/historique',
      icon: History,
    },
    {
      title: 'Profil',
      url: '#',
      icon: User,
      items: [
        {
          title: 'Informations',
          url: '/participants/dashboard/profil',
        },
        {
          title: 'Statistiques',
          url: '/participants/dashboard/statistiques',
        },
      ],
    },
  ],
  chasses: [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    },
  ],
};

const dataOrganisateur = {
  teams: [
    {
      name: 'Prestige Heritage',
      plan: 'School',
    },
    {
      name: 'Dream Maker',
      plan: 'Organisator',
    },
    {
      name: 'Historical Life',
      plan: 'Client',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/organisateurs/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Châteaux',
      url: '/organisateurs/dashboard/chateaux',
      icon: Castle,
    },
    {
      title: 'Chasses',
      url: '#',
      icon: LibraryBig,
    },
    {
      title: 'Créer',
      url: '/organisateurs/dashboard/creation_chasse',
      icon: Plus,
    },
    {
      title: 'Profil',
      url: '#',
      icon: User,
      items: [
        {
          title: 'Informations',
          url: '/organisateurs/dashboard/profil',
        },
        {
          title: 'Statistiques',
          url: '/organisateurs/dashboard/statistiques',
        },
      ],
    },
  ],
  chasses: [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    },
  ],
};

const dataProprietaire = {
  teams: [
    {
      name: 'Chateau',
      plan: 'Tresor',
    },
  ],
  navMain: [
    {
      title: 'Châteaux',
      url: '/proprietaire/dashboard/chateaux',
      icon: Castle,
    },
    {
      title: 'Calendrier',
      url: '/proprietaire/dashboard/calendrier',
      icon: Calendar,
    },
  ],
  chasses: [
    {
      id: "2aab1306-2875-426c-b0d3-f440f05fa8b8",
    },
    {
      id: "63e923ce-db26-4024-90cb-ff43eccfdbcb",
    },
  ],
};

export function AppSidebar({ type, ...props }: SideBarProps) {
  const data = type === 'organisateur' ? dataOrganisateur : type === 'participant' ? dataUser : dataProprietaire;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher type={type} teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects type={type} chasse={data.chasses} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser type={type}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
