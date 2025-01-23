'use client';

import { logout } from '@/app/auth/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { SideBarProps } from '@/types';
import { ChevronsUpDown, LogOut, UserPen } from 'lucide-react';
import Link from 'next/link';

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
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavUser({ type }: SideBarProps) {
  const { isMobile } = useSidebar();
  const [firstLetter, setFirstLetter] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [idUser, setIdUser] = useState('');
  const [idEquipe, setIdEquipe] = useState<string | string[]>('');

  const params = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        setIdUser(user.id);
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

  if (!params.id_equipe) {
    return <Skeleton className="h-12 w-full" />;
  }

  let profileLink;

  switch (type) {
    case "participant":
      profileLink = `/participants/dashboard/profil/${idUser}/parametres`;
      break;
    case "organisateur":
      profileLink = `/organisateurs/dashboard/${params.id_equipe}/profil/${idUser}/parametres`;
      break;
  }

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
                <AvatarFallback className="rounded-lg bg-gold text-primary font-semibold">{firstLetter}</AvatarFallback>
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
            {type != "proprietaire" && (
              <DropdownMenuGroup>
                <Link className='w-full h-full' href={profileLink!}>
                  <DropdownMenuItem>
                    <UserPen />
                    Profil
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            )}
            {type != "proprietaire" && <DropdownMenuSeparator />}
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
