'use client';

import * as React from 'react';

import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import {
  AudioWaveform,
  Castle,
  Command,
  GalleryVerticalEnd,
  History,
  LayoutDashboard,
  MapPin,
  Search,
  Settings2,
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
      url: '/participants',
      icon: MapPin,
      isActive: true,
    },
    {
      title: 'Châteaux',
      url: '/participants/chateaux',
      icon: Castle,
    },
    {
      title: 'Chasses',
      url: '/participants/chasses',
      icon: Search,
    },
    {
      title: 'Historique',
      url: '/participants/historique',
      icon: History,
    },
    {
      title: 'Paramètres',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Informations',
          url: '/profil',
        },
        {
          title: 'Statistiques',
          url: '#',
        },
      ],
    },
  ],
  chasses: [
    {
      name: 'Design Engineering',
      url: '#',
      id: 1,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      id: 2,
    },
    {
      name: 'Travel',
      url: '#',
      id: 3,
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
      url: '/organisateurs/chateaux',
      icon: Castle,
    },
    {
      title: 'Chasses',
      url: '#',
      icon: Search,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Informations',
          url: '/profil',
        },
        {
          title: 'Statistiques',
          url: '#',
        },
      ],
    },
  ],
  chasses: [
    {
      name: 'Design Engineering',
      id: 1,
    },
    {
      name: 'Sales & Marketing',
      id: 2,
    },
    {
      name: 'Travel',
      id: 3,
    },
  ],
};

export function AppSidebar({ user, ...props }: SideBarProps) {
  const data = user === 'organisateur' ? dataOrganisateur : dataUser;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher user={user} teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects user={user} chasse={data.chasses} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
