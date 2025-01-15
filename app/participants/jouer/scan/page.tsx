// /app/participants/jouer/scan/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Chasse from '@/classes/Chasse';
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
} from "@/components/ui/alert-dialog";

const ScanQRCodePage: React.FC = () => {
  const [scanError, setScanError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false); // Nouvel état pour la notification de fin
  const [codeSaisi, setCodeSaisi] = useState('');
  const [useScanner, setUseScanner] = useState(true); // Par défaut, on utilise le scanner
  const [enigmeTitle, setEnigmeTitle] = useState<string>(''); // Nouvel état pour le titre de l'énigme


  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chasseId = searchParams.get('chasseId'); // Récupère l'ID de la chasse
  const enigmeId = searchParams.get('enigmeId');



  // Fonction pour récupérer le titre de l'énigme
  const fetchEnigmeTitle = async () => {
    try {
      const chasseInstance = await Chasse.readId(chasseId);
      const enigmes = await chasseInstance.getAllEnigmes();
      const currentEnigme = enigmes.find((enigme) => enigme.id_enigme === enigmeId);
      if (currentEnigme) {
        setEnigmeTitle(currentEnigme.titre); // Mettre à jour le titre de l'énigme
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du titre de l\'énigme :', error);
    }
  };

  // Récupérer le titre de l'énigme au chargement de la page
  useEffect(() => {
    if (chasseId && enigmeId) {
      fetchEnigmeTitle();
    }
  }, [chasseId, enigmeId]);



  /// Fonction pour valider le code
  const handleCodeValidation = async (code: string) => {
    try {
      const chasseInstance = await Chasse.readId(chasseId);
      const enigmes = await chasseInstance.getAllEnigmes();
      const enigmesTriees = enigmes.sort((a, b) => a.ordre - b.ordre);
      const currentEnigme = enigmesTriees.find((enigme) => enigme.id_enigme === enigmeId);

      if (currentEnigme && code === currentEnigme.code_reponse) {
        setValidationMessage('Code correct !');
        setShowValidationPopup(true);

        // Trouver l'index de l'énigme actuelle
        const currentIndex = enigmesTriees.findIndex((enigme) => enigme.id_enigme === enigmeId);

        // Vérifier s'il y a une énigme suivante
        if (currentIndex < enigmesTriees.length - 1) {
          const nextEnigme = enigmesTriees[currentIndex + 1];
          router.push(`/participants/jouer?chasseId=${chasseId}&enigmeId=${nextEnigme.id_enigme}`);
        } else {
          // Si c'est la dernière énigme, rediriger vers la page de récompense
          router.push(`/participants/jouer/recompenses?chasseId=${chasseId}`);
        }
      } else {
        setValidationMessage('Code incorrect. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la validation du code :', error);
      setValidationMessage('Erreur lors de la validation du code. Veuillez réessayer.');
    }
  };

  // Fonction pour rediriger vers la page de succès après la notification de fin
  const handleCompletionConfirmation = () => {
    setShowCompletionPopup(false);
    router.push(`/participants/jouer/success?chasseId=${chasseId}`);
  };

  // Fonction pour gérer le scan du QR code
  const handleScan = (data: string) => {
    setCodeSaisi(data);
    handleCodeValidation(data);

    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }

    setUseScanner(false);
  };

  // Demander la permission d'accéder à la caméra
  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setUseScanner(true);
    } catch (error) {
      console.error('Permission de la caméra refusée :', error);
      setScanError('Permission de la caméra refusée. Veuillez autoriser l\'accès à la caméra.');
      setUseScanner(false);
    }
  };

  // Vérifier la disponibilité de la caméra
  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      if (cameras.length === 0) {
        setScanError('Aucune caméra disponible.');
        setUseScanner(false);
      } else {
        await requestCameraPermission();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la caméra :', error);
      setScanError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setUseScanner(false);
    }
  };

  // Fonction pour gérer les erreurs du scanner
  const handleError = (err: string) => {
    if (!err.includes('NotFoundException')) {
      console.error('Erreur du scanner de QR code :', err);
      setScanError('En attente de QR code...');
      setTimeout(() => {
        setScanError(null);
      }, 3000);
    }
  };

  // Fonction pour revenir à l'énigme actuelle
  const handleBackToEnigme = () => {
    router.push(`/participants/jouer?chasseId=${chasseId}&enigmeId=${enigmeId}`);
  };

  // Désactiver le scanner
  const disableScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
    setUseScanner(false);
  };

  // Initialiser le scanner de QR code
  useEffect(() => {
    if (useScanner) {
      const qrScannerElement = document.getElementById('qr-scanner');
      if (qrScannerElement) {
        qrScannerRef.current = new Html5QrcodeScanner(
          'qr-scanner',
          { qrbox: 250, fps: 2 },
          false
        );
        qrScannerRef.current.render(handleScan, handleError);
      }
    } else if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear();
        qrScannerRef.current = null;
      }
    };
  }, [useScanner]);

  // Vérifier la disponibilité de la caméra au chargement de la page
  useEffect(() => {
    checkCameraAvailability();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl">

        <h1 className="mb-8 text-3xl font-bold text-gray-800">Valider le code</h1>
        {enigmeTitle && <h2 className="mb-6 text-xl font-semibold text-gray-700">Énigme : {enigmeTitle}</h2>}


        {/* Choix entre saisie manuelle et scan de QR code */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setUseScanner(false)}
            className={`rounded-lg px-6 py-3 shadow-lg transition duration-300 ${
              !useScanner
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Saisir manuellement
          </button>
          <button
            onClick={() => {
              setUseScanner(true);
              checkCameraAvailability();
            }}
            className={`rounded-lg px-6 py-3 shadow-lg transition duration-300 ${
              useScanner
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            Scanner un QR code
          </button>
        </div>

        {/* Saisie manuelle */}
        {!useScanner && (
          <div className="rounded-lg bg-gray-50 p-6 shadow-inner">
            <input
              type="text"
              placeholder="Entrez le code de réponse"
              value={codeSaisi}
              onChange={(e) => setCodeSaisi(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleCodeValidation(codeSaisi)}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white shadow-lg transition duration-300 hover:from-blue-600 hover:to-purple-700"
            >
              Valider
            </button>
            <button
              onClick={handleBackToEnigme}
              className="rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3 text-white shadow-lg transition duration-300 hover:from-gray-600 hover:to-gray-700"
            >
              Revenir à l'énigme
            </button>
          </div>
        )}

        {/* Scanner de QR code */}
        {useScanner && (
          <div>
            <div id="qr-scanner" className="w-full overflow-hidden rounded-lg shadow-lg"></div>
            {scanError && <p className="mt-6 text-lg font-semibold text-red-600">{scanError}</p>}
            <div className="mt-6 flex gap-4">
              <button
                onClick={disableScanner}
                className="rounded-lg bg-gradient-to-r from-red-500 to-pink-600 px-6 py-3 text-white shadow-lg transition duration-300 hover:from-red-600 hover:to-pink-700"
              >
                Désactiver le scanner
              </button>
              <button
                onClick={handleBackToEnigme}
                className="rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3 text-white shadow-lg transition duration-300 hover:from-gray-600 hover:to-gray-700"
              >
                Revenir à l'énigme
              </button>
            </div>
          </div>
        )}

        {/* Message de validation */}
        {validationMessage && (
          <p
            className={`mt-6 text-lg font-semibold ${
              validationMessage.includes('correct') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {validationMessage}
          </p>
        )}

        {/* Popup de validation */}
        <AlertDialog open={showValidationPopup} onOpenChange={setShowValidationPopup}>
          <AlertDialogContent className="rounded-xl bg-white shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                Énigme validée !
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-gray-600">
                Félicitations, vous avez résolu cette énigme. Passez à la suivante !
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setShowValidationPopup(false)}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white shadow-lg transition duration-300 hover:from-blue-600 hover:to-purple-700"
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Popup de fin d'énigme */}
        <AlertDialog open={showCompletionPopup} onOpenChange={setShowCompletionPopup}>
          <AlertDialogContent className="rounded-xl bg-white shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                Félicitations !
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-gray-600">
                Vous avez résolu toutes les énigmes de cette chasse. Bravo !
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={handleCompletionConfirmation}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white shadow-lg transition duration-300 hover:from-blue-600 hover:to-purple-700"
              >
                Terminer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ScanQRCodePage;