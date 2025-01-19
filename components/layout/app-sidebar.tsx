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

import { SideBarProps } from '@/types';
import { dataNotFullyUnlocked, dataOrganisateur, dataProprietaire, dataUser } from '@/constants';

export function AppSidebar({ type, fullyUnlocked, ...props }: SideBarProps) {
  if (!fullyUnlocked) {
    const data = dataNotFullyUnlocked;
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher type={type} teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser type={type}/>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }
  
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
