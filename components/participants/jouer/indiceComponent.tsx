"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { getAllIndicesByEnigme } from "@/utils/dao/IndiceUtils"
import type { UUID } from "crypto"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { IndiceParticipant } from "@/classes/IndiceParticipant"
import { Participant } from "@/classes/Participant"
import { createClient } from "@/utils/supabase/client"
import { getParticipationByParticipantIdAndChasseId, updateParticipationScore } from "@/utils/dao/ParticipationUtils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Loader from "@/components/global/loader"

interface Indice {
  id_indice: UUID
  contenu: string
  degre_aide: number
  id_enigme: UUID
  ordre: number
  type: string
}

const IndiceList: React.FC<{ idEnigme: UUID; participantId: UUID }> = ({ idEnigme, participantId }) => {
  const [indices, setIndices] = useState<Indice[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [selectedIndice, setSelectedIndice] = useState<Indice | null>(null)
  const [discoveredIndices, setDiscoveredIndices] = useState<UUID[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const chasseId = searchParams.get("chasseId")
  const enigmeId = searchParams.get("enigmeId")

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        console.error("Utilisateur non connecté")
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const indices = await getAllIndicesByEnigme(idEnigme as UUID)
        const sortedIndices = indices.sort((a, b) => a.ordre - b.ordre)
        setIndices(sortedIndices)
        setError(null)
      } catch (error) {
        console.error("Erreur lors de la récupération des indices :", error)
        setError("Impossible de charger les indices. Veuillez réessayer plus tard.")
      }
    }
    fetchIndices()
  }, [idEnigme])

  useEffect(() => {
    const checkAllIndices = async () => {
      const discoveredIds: UUID[] = []
      const participant = await Participant.readByIdUser(userId as UUID)
      const participantId = participant.id_participant

      for (const indice of indices) {
        try {
          const isDiscovered = await IndiceParticipant.checkIfIndiceExists(participantId, indice.id_indice)
          if (isDiscovered) {
            discoveredIds.push(indice.id_indice)
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification de l'indice ${indice.id_indice}:`, error)
        }
      }
      setDiscoveredIndices(discoveredIds)
      setLoading(false)
    }
    checkAllIndices()
  }, [indices, participantId, userId])

  const handleIndiceClick = async (indice: Indice) => {
    setSelectedIndice(indice)
    const participant = await Participant.readByIdUser(userId as UUID)
    const isDiscovered = await IndiceParticipant.checkIfIndiceExists(participant.id_participant, indice.id_indice)
    if (isDiscovered) {
      setDiscoveredIndices((prev) => [...prev, indice.id_indice])
      setShowConfirmation(false)
      return
    }
    setShowConfirmation(true)
  }

  const handleConfirmation = async (confirmed: boolean) => {
    if (!confirmed || !selectedIndice || !userId) {
      setShowConfirmation(false)
      return
    }

    try {
      const participant = await Participant.readByIdUser(userId as UUID)
      if (!participant || !participant.id_participant) {
        throw new Error("Participant non trouvé ou ID invalide.")
      }
      const participantId = participant.id_participant
      const isDiscovered = await IndiceParticipant.checkIfIndiceExists(participantId, selectedIndice.id_indice)
      if (isDiscovered) {
        setShowConfirmation(false)
        setDiscoveredIndices((prev) => [...prev, selectedIndice.id_indice])
        return
      }

      const indiceParticipant = new IndiceParticipant({
        id_indice: selectedIndice.id_indice,
        id_participant: participantId,
      })
      await indiceParticipant.markAsDiscovered()

      const participation = await getParticipationByParticipantIdAndChasseId(participantId, chasseId as UUID)
      const pointsLost = selectedIndice.degre_aide
      const participationScore = participation.score
      const score = participationScore - pointsLost

      console.log(`Vous avez perdu ${pointsLost} points.`)
      console.log(`Votre nouveau score est de ${score} points.`)
      await updateParticipationScore(participantId, chasseId as UUID, score)

      setDiscoveredIndices((prev) => [...prev, selectedIndice.id_indice])
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'indice :", error)
      if (error instanceof Error) {
        setError(error.message || "Une erreur est survenue lors de la révélation de l'indice.")
      } else {
        setError("Une erreur inattendue est survenue.")
      }
    } finally {
      setShowConfirmation(false)
    }
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent>
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <Loader />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Indices disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indices.map((indice, index) => {
            const isFirst = index === 0
            const previousIndice = index > 0 ? indices[index - 1] : null
            const isVisible = isFirst || (previousIndice && discoveredIndices.includes(previousIndice.id_indice))

            if (!isVisible) return null

            return (
              <Card key={indice.id_indice} className="cursor-pointer hover:bg-gray-100 transition duration-300">
                <CardContent className="p-4">
                  {discoveredIndices.includes(indice.id_indice) ? (
                    <Link
                      href={`/participants/dashboard/jouer/indice/${indice.id_indice}?chasseId=${chasseId}&enigmeId=${enigmeId}`}
                    >
                      <h2 className="text-lg font-semibold text-gray-800">
                        Indice {index + 1} (Déjà révélé)
                      </h2>
                    </Link>
                  ) : (
                    <h2
                      className="text-lg font-semibold text-gray-800"
                      onClick={() => handleIndiceClick(indice)}
                    >
                      Indice {index + 1}
                    </h2>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Attention !</AlertDialogTitle>
              <AlertDialogDescription>
                Révéler cet indice vous fera perdre {selectedIndice?.degre_aide} points. Êtes-vous sûr de vouloir
                continuer ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleConfirmation(false)}>Non</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleConfirmation(true)}>Oui, continuer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default IndiceList