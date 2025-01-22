"use client"
import { IndiceParticipant } from "@/classes/IndiceParticipant"
import { Participant } from "@/classes/Participant"
import Loader from "@/components/global/loader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllIndicesByEnigme } from "@/utils/dao/IndiceUtils"
import { getParticipationByParticipantIdAndChasseId, updateParticipationScore } from "@/utils/dao/ParticipationUtils"
import { createClient } from "@/utils/supabase/client"
import type { UUID } from "crypto"
import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"

interface Indice {
  id_indice: UUID
  contenu: string
  degre_aide: number
  id_enigme: UUID
  ordre: number
  type: string
}

interface IndiceListProps {
  chasseId: UUID
  enigmeId: UUID
  participantId: UUID
}

const IndiceList = ({chasseId, enigmeId, participantId}: IndiceListProps) => {
  const [indices, setIndices] = useState<Indice[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [selectedIndice, setSelectedIndice] = useState<Indice | null>(null)
  const [discoveredIndices, setDiscoveredIndices] = useState<UUID[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
  
      if (error || !user) {
        console.error("Utilisateur non connecté");
        setError("Veuillez vous connecter pour accéder aux indices.");
        return;
      }
      setUserId(user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const indices = await getAllIndicesByEnigme(enigmeId as UUID)
        const sortedIndices = indices.sort(
          (a: { ordre: number }, b: { ordre: number }) => a.ordre - b.ordre
        );
        setIndices(sortedIndices)
        setError(null)
      } catch (error) {
        console.error("Erreur lors de la récupération des indices :", error)
        setError("Impossible de charger les indices. Veuillez réessayer plus tard.")
      }
    }
    fetchIndices()
  }, [enigmeId])

  useEffect(() => {
    const checkAllIndices = async () => {
      if (!userId) return; // Blocage si userId est null
  
      try {
        const participant = await Participant.readByIdUser(userId as UUID);
        const discoveredIds: UUID[] = [];
        
        for (const indice of indices) {
          const isDiscovered = await IndiceParticipant.checkIfIndiceExists(
            participant.getIdParticipant(), 
            indice.id_indice
          );
          if (isDiscovered) discoveredIds.push(indice.id_indice);
        }
        
        setDiscoveredIndices(discoveredIds);
      } catch (error) {
        console.error("Erreur vérification indices:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (indices.length > 0) checkAllIndices();
  }, [indices, userId]); // Déclencher seulement sur userId

  const handleIndiceClick = async (indice: Indice) => {
    setSelectedIndice(indice)
    const participant = await Participant.readByIdUser(userId as UUID)
    const isDiscovered = await IndiceParticipant.checkIfIndiceExists(participant.getIdParticipant(), indice.id_indice)
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
      if (!participant || !participant.getIdParticipant()) {
        throw new Error("Participant non trouvé ou ID invalide.")
      }
      const participantId = participant.getIdParticipant()
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
      let score = participationScore - pointsLost
      if (score < 0) {
        score = 0
      }
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