import GameIndice from '@/components/participants/jouer/GameIndice'
import GameInterface from '@/components/participants/jouer/GameInterface'
import GameRecompense from '@/components/participants/jouer/GameRecompense'
import { SearchParamProps } from '@/types'
import { UUID } from 'crypto'
import React from 'react'

const RecompenseParticipant = async ({searchParams}: SearchParamProps) => {

  const { chasseId} = await searchParams

  return (
    <GameRecompense chasseId={chasseId as UUID} />
  )
}

export default RecompenseParticipant
