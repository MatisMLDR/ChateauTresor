'use client';

import { ChevronsUpDown, LogOut, UserPen } from 'lucide-react';
import { logout } from '@/app/auth/actions';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { SideBarProps } from '@/types';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export function NavUser({type} : SideBarProps) {
  const { isMobile } = useSidebar();
  const [firstLetter, setFirstLetter] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        setFirstLetter(user.email.charAt(0).toUpperCase()); // Set the first letter of the user's email
        setEmail(user.email);
        try {
          setLogin(user.user_metadata.username); // Va marcher pour les nouveaux utilisateurs
        } catch (err) {
          console.error('Erreur lors de la récupération des détails du château :', err);
        }
      } 
    };

    fetchUser();
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-gold text-primary">{firstLetter}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {login ? (
                  <span className="truncate font-semibold">{login}</span>
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}

                {email ? (
                  <span className="truncate text-xs">{email}</span>
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-gold text-primary">{firstLetter}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {login ? (
                    <span className="truncate font-semibold">{login}</span>
                  ) : (
                    <Skeleton className="h-4 w-full" />
                  )}

                  {email ? (
                    <span className="truncate text-xs">{email}</span>
                  ) : (
                    <Skeleton className="h-4 w-full" />
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={`/${type === "organisateur" ? "organisateurs" : type === "participant" ? "participants" : "proprietaires"}/dashboard/profil`}>
                <DropdownMenuItem>
                  <UserPen />
                  Profil
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* TODO : Modifier le lien pour qu'il redirige vers la landing page correspondante */}
            <DropdownMenuItem onClick={() => logout(type)}> 
              <LogOut />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
