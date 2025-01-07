"use client"

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import AvatarLinks from './AvatarLinks';

const Avatar = () => {
    const [firstLetter, setFirstLetter] = useState('');
    const [isShowed, setIsShowed] = useState(false);
  
    const router = useRouter();
  
    useEffect(() => {
      const fetchUser = async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser()
  
        if (user && user.email) {
          setFirstLetter(user.email.charAt(0).toUpperCase()); // Set the first letter of the user's email
        } else {
          router.push('/login'); // Redirect to login if no user is found
        }
      };
  
      fetchUser();
    }, [firstLetter]);
  

  
  return (
    <>
      <button className='w-12 h-12 p-1 rounded-full flex items-center justify-center bg-slate-100 m-4 focus:ring-4' onClick={() => setIsShowed(!isShowed)}>
        <span className='text-2xl font-bold text-[#12304A]'>
          {firstLetter}
        </span>
      </button>
      <AvatarLinks isShowed={isShowed} />
    </>
  )
}

export default Avatar
