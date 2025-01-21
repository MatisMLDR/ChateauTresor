"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Html5QrcodeScanner } from "html5-qrcode"
import Chasse from "@/classes/Chasse"
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
import type { UUID } from "crypto"
import type { Enigme } from "@/classes/Enigme"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ScanQRCodePage: React.FC = () => {
  const [scanError, setScanError] = useState<string | null>(null)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [showValidationPopup, setShowValidationPopup] = useState(false)
  const [showCompletionPopup, setShowCompletionPopup] = useState(false)
  const [codeSaisi, setCodeSaisi] = useState("")
  const [useScanner, setUseScanner] = useState(true)
  const [enigmeTitle, setEnigmeTitle] = useState<string>("")

  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const chasseId = searchParams.get("chasseId")
  const enigmeId = searchParams.get("enigmeId")

  const fetchEnigmeTitle = async () => {
    try {
      const chasseInstance = await Chasse.readId(chasseId as UUID)
      const enigmes = await chasseInstance.getAllEnigmes()
      const currentEnigme = enigmes.find((enigme: Enigme) => enigme.getId() === enigmeId)
      if (currentEnigme) {
        setEnigmeTitle(currentEnigme.titre)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du titre de l'énigme :", error)
    }
  }

  useEffect(() => {
    if (chasseId && enigmeId) {
      fetchEnigmeTitle()
    }
  }, [chasseId, enigmeId])

  const handleCodeValidation = async (code: string) => {
    try {
      const chasseInstance = await Chasse.readId(chasseId as UUID)
      const enigmes = await chasseInstance.getAllEnigmes()
      const enigmesTriees = enigmes.sort((a: { ordre: number }, b: { ordre: number }) => a.ordre - b.ordre)
      const currentEnigme = enigmesTriees.find((enigme: Enigme) => enigme.getId() === enigmeId)

      if (currentEnigme && code === currentEnigme.code_reponse) {
        setValidationMessage("Code correct !")
        setShowValidationPopup(true)

        const currentIndex = enigmesTriees.findIndex((enigme: Enigme) => enigme.getId() === enigmeId)

        if (currentIndex < enigmesTriees.length - 1) {
          const nextEnigme = enigmesTriees[currentIndex + 1]
          router.push(`/participants/dashboard/jouer?chasseId=${chasseId}&enigmeId=${nextEnigme.getId()}`)
        } else {
          router.push(`/participants/dashboard/jouer/recompenses?chasseId=${chasseId}`)
        }
      } else {
        setValidationMessage("Code incorrect. Veuillez réessayer.")
        console.error("Code incorrect. Veuillez réessayer.")
      }
    } catch (error) {
      console.error("Erreur lors de la validation du code :", error)
      setValidationMessage("Erreur lors de la validation du code. Veuillez réessayer.")
      console.error("Une erreur est survenue lors de la validation du code. Veuillez réessayer.")
    }
  }

  const handleCompletionConfirmation = () => {
    setShowCompletionPopup(false)
    router.push(`/participants/dashboard/jouer/success?chasseId=${chasseId}`)
  }

  const handleScan = (data: string) => {
    setCodeSaisi(data)
    handleCodeValidation(data)

    if (qrScannerRef.current) {
      qrScannerRef.current.clear()
      qrScannerRef.current = null
    }

    setUseScanner(false)
  }

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      setUseScanner(true)
    } catch (error) {
      console.error("Permission de la caméra refusée :", error)
      setScanError("Permission de la caméra refusée. Veuillez autoriser l'accès à la caméra.")
      setUseScanner(false)
      console.error("Permission de la caméra refusée. Veuillez autoriser l'accès à la caméra.")
    }
  }

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter((device) => device.kind === "videoinput")
      if (cameras.length === 0) {
        setScanError("Aucune caméra disponible.")
        setUseScanner(false)
        console.error("Aucune caméra disponible.")
      } else {
        await requestCameraPermission()
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la caméra :", error)
      setScanError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.")
      setUseScanner(false)
      console.error("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.")
    }
  };

  const handleError = (err: string) => {
    if (!err.includes('NotFoundException')) {
      setTimeout(() => {
        setScanError(null);
      }, 3000);
    }
  };

  const handleBackToEnigme = () => {
    router.push(`/participants/dashboard/jouer?chasseId=${chasseId}&enigmeId=${enigmeId}`);
  };

  const disableScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
    setUseScanner(false);
  };

  useEffect(() => {
    if (useScanner) {
      const qrScannerElement = document.getElementById("qr-scanner")
      if (qrScannerElement) {
        qrScannerRef.current = new Html5QrcodeScanner("qr-scanner", { qrbox: 250, fps: 2 }, false)
        qrScannerRef.current.render(handleScan, handleError)
      }
    } else if (qrScannerRef.current) {
      qrScannerRef.current.clear()
      qrScannerRef.current = null
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear()
        qrScannerRef.current = null
      }
    }
  }, [useScanner])

  useEffect(() => {
    checkCameraAvailability()
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !useScanner) {
        handleCodeValidation(codeSaisi)
      }
    }

    window.addEventListener("keypress", handleKeyPress)
    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [codeSaisi, useScanner])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Valider le code</CardTitle>
        {enigmeTitle && <CardDescription>Énigme : {enigmeTitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={useScanner ? "scanner" : "manual"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" onClick={() => setUseScanner(false)}>
              Saisie manuelle
            </TabsTrigger>
            <TabsTrigger
              value="scanner"
              onClick={() => {
                setUseScanner(true)
                checkCameraAvailability()
              }}
            >
              Scanner QR code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Entrez le code de réponse"
                value={codeSaisi}
                onChange={(e) => setCodeSaisi(e.target.value)}
              />
              <Button onClick={() => handleCodeValidation(codeSaisi)} className="w-full">
                Valider
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="scanner">
            <div className="space-y-4">
              <div id="qr-scanner" className="w-full overflow-hidden rounded-lg shadow-lg"></div>
              {scanError && <p className="text-destructive">{scanError}</p>}
              <Button onClick={disableScanner} variant="destructive" className="w-full">
                Désactiver le scanner
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleBackToEnigme} variant="outline" className="w-full mt-4">
          Revenir à l&apos;énigme
        </Button>

        <AlertDialog open={showValidationPopup} onOpenChange={setShowValidationPopup}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Énigme validée !</AlertDialogTitle>
              <AlertDialogDescription>
                Félicitations, vous avez résolu cette énigme. Passez à la suivante !
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowValidationPopup(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showCompletionPopup} onOpenChange={setShowCompletionPopup}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Félicitations !</AlertDialogTitle>
              <AlertDialogDescription>
                Vous avez résolu toutes les énigmes de cette chasse. Bravo !
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleCompletionConfirmation}>Terminer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default ScanQRCodePage

