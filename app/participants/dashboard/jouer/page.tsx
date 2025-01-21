"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { EnigmeType } from "@/types"
import IndiceComponent from "@/components/participants/jouer/indiceComponent"
import Chasse from "@/classes/Chasse"
import Loader from "@/components/global/loader"
import Link from "next/link"
import { Undo2 } from "lucide-react" // Import de l'icône
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog" // Import des composants AlertDialog
import { buttonVariants } from "@/components/ui/button"
import type { UUID } from "crypto"
import type { Enigme } from "@/classes/Enigme"
import {
  createParticipation,
  getParticipationByParticipantIdAndChasseId,
  participationExists,
} from "@/utils/dao/ParticipationUtils"
import { Participant } from "@/classes/Participant"
import { createClient } from "@/utils/supabase/client" // Import des styles de bouton
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const GameInterface: React.FC = () => {
  const [enigmes, setEnigmes] = useState<EnigmeType[]>([])
  const [currentEnigmeIndex, setCurrentEnigmeIndex] = useState(0)
  const [showIndices, setShowIndices] = useState(false)
  const [chasse, setChasse] = useState<Chasse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessPage, setShowSuccessPage] = useState(false)
  const [isParticipating, setIsParticipating] = useState<boolean>(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null) // État pour stocker le score

  const router = useRouter()
  const searchParams = useSearchParams()
  const chasseId = searchParams.get("chasseId")
  const enigmeIdFromUrl = searchParams.get("enigmeId")

  useEffect(() => {
    const fetchEnigmes = async () => {
      try {
        const chasseInstance = await Chasse.readId(chasseId as UUID)
        setChasse(chasseInstance)
        const enigmes = await chasseInstance.getAllEnigmes()
        const enigmesTriees = enigmes.sort((a: { ordre: number }, b: { ordre: number }) => a.ordre - b.ordre)
        setEnigmes(enigmesTriees)

        if (enigmeIdFromUrl) {
          const index = enigmesTriees.findIndex((enigme: Enigme) => enigme.getId() === enigmeIdFromUrl)
          if (index !== -1) {
            setCurrentEnigmeIndex(index)
          }
        }

        setError(null)
      } catch (error) {
        console.error("Erreur lors de la récupération des énigmes :", error)
        setError("Impossible de charger les énigmes. Veuillez réessayer plus tard.")
      }
    }

    if (chasseId) {
      fetchEnigmes()
    }
  }, [chasseId, enigmeIdFromUrl])

  // Récupérer l'ID de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id) // Récupérer l'ID de l'utilisateur connecté
      } else {
        console.error("Utilisateur non connecté")
        setError("Utilisateur non connecté. Veuillez vous connecter.")
      }
    }

    fetchUser()
  }, [])

  // Récupérer l'ID du participant une fois que userId est défini
  useEffect(() => {
    const fetchParticipantId = async () => {
      if (userId) {
        try {
          const participant = await Participant.readByIdUser(userId as UUID)
          setParticipantId(participant.getIdParticipant())
        } catch (error) {
          console.error("Erreur lors de la récupération du participant :", error)
          setError("Erreur lors de la récupération du participant. Veuillez réessayer.")
        }
      }
    }

    fetchParticipantId()
  }, [userId])

  useEffect(() => {
    const fetchScore = async () => {
      if (userId && chasseId) {
        try {
          const participant = await Participant.readByIdUser(userId as UUID)
          const participation = await getParticipationByParticipantIdAndChasseId(
            participant.getIdParticipant(),
            chasseId as UUID,
          )
          setScore(participation.score) // Mettre à jour l'état du score
        } catch (error) {
          console.error("Erreur lors de la récupération du score :", error)
        }
      }
    }

    fetchScore()
  }, [userId, chasseId])

  // Vérifier et insérer la participation une fois que participantId et chasseId sont définis
  useEffect(() => {
    if (!participantId || !chasseId || !chasse) {
      return
    }
    const checkAndInsertParticipation = async () => {
      if (participantId && chasseId) {
        try {
          // Vérifie si la participation existe
          const exists = await participationExists(participantId as UUID, chasseId as UUID)
          const scoreInitial = await chasse.getScoreInitial()
          if (!exists) {
            // Si la participation n'existe pas, on l'insère
            await createParticipation({
              id_participant: participantId,
              id_chasse: chasseId,
              jour: new Date().toISOString().split("T")[0], // Date du jour au format YYYY-MM-DD
              score: scoreInitial,
            })
            console.log("Participation insérée avec succès.")
          }

          // Met à jour l'état pour indiquer que l'utilisateur participe
          setIsParticipating(true)
        } catch (error) {
          console.error("Erreur lors de la vérification ou de l'insertion de la participation :", error)
          setError("Erreur lors de la vérification de la participation. Veuillez réessayer.")
        }
      }
    }

    checkAndInsertParticipation()
  }, [participantId, chasseId, chasse])

  const handleBackAfterSuccess = () => {
    router.push("/participants/dashboard/chassesAchete")
  }

  const handleBack = () => {
    router.push("/participants/dashboard/chassesAchete")
  }

  if (showSuccessPage) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">Félicitations !</CardTitle>
          <CardDescription className="text-lg text-center">
            Vous avez résolu toutes les énigmes de cette chasse.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={handleBackAfterSuccess} size="lg">
            Retour aux chasses achetées
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-center">{error}</p>
          <Button onClick={handleBack} className="mt-6 w-full">
            Retour à la liste des chasses
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (enigmes.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center">
          <Loader />
          <Button onClick={handleBack} className="mt-6">
            Retour à la liste des chasses
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentEnigme = enigmes[currentEnigmeIndex]
  const progress = ((currentEnigmeIndex + 1) / enigmes.length) * 100

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
      <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="mb-6">
              <Undo2 className="h-6 w-6 mr-2" />
              Retour
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir quitter ?</AlertDialogTitle>
              <AlertDialogDescription>
                Votre progression sera enregistrée, mais vous devrez revenir pour continuer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Non</AlertDialogCancel>
              <AlertDialogAction onClick={handleBack}>Oui</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardTitle className="text-3xl font-bold">{currentEnigme.titre}</CardTitle>
        <CardDescription className="text-lg">{currentEnigme.description}</CardDescription>
      </CardHeader>
      <CardContent>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Énigme {currentEnigmeIndex + 1} sur {enigmes.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
          <span className="text-sm font-medium mt-2 block">Votre score est de : {score} points</span>
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full mb-8">Afficher les indices</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Indices</DrawerTitle>
              <DrawerDescription>Voici les indices disponibles pour cette énigme.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <IndiceComponent idEnigme={currentEnigme.id_enigme as UUID} participantId={participantId as UUID} />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Fermer</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Button asChild className="w-full">
          <Link href={`/participants/dashboard/jouer/scan?chasseId=${chasseId}&enigmeId=${currentEnigme.id_enigme}`}>
            Valider le code
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default GameInterface

