import Chasse from '@/classes/Chasse'
import { Participant } from '@/classes/Participant'
import ClassementGeneralChasseRealisees from '@/components/global/ClassementGeneralChasseRealisees'
import ClassementGeneralPoints from '@/components/global/ClassementGeneralPoints'
import Loader from '@/components/global/loader'
import { getAllParticipants } from '@/utils/dao/ParticipantUtils'
import { getAllParticipations } from '@/utils/dao/ParticipationUtils'
import { createClient } from '@/utils/supabase/server'
import { UUID } from 'crypto'
import React from 'react'

const Classements = async () => {

  const supabase = createClient()
  const user = (await supabase.auth.getUser()).data.user

  if (!user || !user.id) {
    return <Loader />
  }


  return (
    <div className='p-4'>
      <h1 className="text-3xl font-bold mb-8">
        Classements
      </h1>
      <ClassementGeneralChasseRealisees idUser={user.id as UUID} />
      {/* <ClassementGeneralPoints /> */}
    </div>
  )
}

export default Classements
