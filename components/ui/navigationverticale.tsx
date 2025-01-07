"use client"

import { NavigationVerticale_Bouton } from '@/components/ui/navigationverticale_bouton';
import { participantMenuLinks } from '@/constants';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Avatar from '../participants/Avatar';

export function NavigationVerticale() {


  return (
    <div className="relative flex h-screen w-[10vw] transition-all flex-col items-center justify-end bg-[#12304A]">
      <NavigationVerticale_Bouton name={'book'} link={'/participants/historique'} imagePath={'/book.svg'} />
      <NavigationVerticale_Bouton name={'map'} link={'/participants'} imagePath={'/map.svg'} />
      <NavigationVerticale_Bouton name={'castle'} link={'/participants/chateaux'} imagePath={'/castle.svg'} />
      <NavigationVerticale_Bouton name={'chest'} link={'/participants/chasses'} imagePath={'/chest.svg'} />
      <Avatar />
    </div>
  );
}
