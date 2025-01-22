import GameInterface from '@/components/participants/jouer/GameInterface'
import { SearchParamProps } from '@/types'
import { UUID } from 'crypto'
import React from 'react'

const GameParticipant = async ({searchParams}: SearchParamProps) => {

  const {enigmeId, chasseId} = await searchParams

  return (
    <GameInterface enigmeId={enigmeId as UUID} chasseId={chasseId as UUID} />
  )
}

export default GameParticipant
