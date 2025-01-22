import GameIndice from '@/components/participants/jouer/GameIndice'
import GameInterface from '@/components/participants/jouer/GameInterface'
import { SearchParamProps } from '@/types'
import { UUID } from 'crypto'
import React from 'react'

const IndiceParticipant = async ({searchParams}: SearchParamProps) => {

  const {enigmeId, chasseId} = await searchParams

  return (
    <GameIndice enigmeId={enigmeId as UUID} chasseId={chasseId as UUID} />
  )
}

export default IndiceParticipant
