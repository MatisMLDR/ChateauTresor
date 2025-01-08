import { participantMenuLinks } from '@/constants';
import { AvatarLinksProps } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import router from 'next/router';
import React from 'react'

const AvatarLinks = ({ isShowed }: AvatarLinksProps) => {

  const handleSignOut = async () => {
      
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/');
  }

  return (
    <ul className={`${isShowed ? 'flex' : 'hidden'} flex-col bg-secondary border border-gray-400 shadow-md text-primary text-center z-[999] absolute left-20 bottom-4 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-secondary`}>
      {participantMenuLinks.map((link, i) => {
        let radius = i === 0 ? 'rounded-t-md border-b' : '';

        return (
          <li key={link.href} onClick={() => router.push(link.href)} className={`hover:bg-secondary-foreground ${radius} cursor-pointer p-2 transition-all duration-150 ease-in-out`}>
            {link.label}
          </li>
        )
      })}
      <li onClick={() => handleSignOut()} className={`bg-red-600 hover:bg-red-500 text-secondary rounded-b-md border-t border-t-transparent cursor-pointer p-2`}>
        Déconnexion
      </li>
    </ul>
  )
}

export default AvatarLinks
