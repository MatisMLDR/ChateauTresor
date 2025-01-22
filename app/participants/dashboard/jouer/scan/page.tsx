import GameInterface from '@/components/participants/jouer/GameInterface'
import GameScan from '@/components/participants/jouer/GameScan'
import { SearchParamProps } from '@/types'
import { UUID } from 'crypto'
import React from 'react'

const ScanParticipant = async ({searchParams}: SearchParamProps) => {

  const {enigmeId, chasseId} = await searchParams

  return (
    <GameScan enigmeId={enigmeId as UUID} chasseId={chasseId as UUID} />
  )
}

export default ScanParticipant
