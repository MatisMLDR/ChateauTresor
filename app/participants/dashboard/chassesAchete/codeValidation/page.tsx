// /app/participants/chassesAchete/CodeValidationPage.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
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

const CodeValidationPage: React.FC = () => {
  const [codeSaisi, setCodeSaisi] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [useScanner, setUseScanner] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const scannedCode = searchParams.get('code');
  const enigmeId = searchParams.get('enigmeId'); // Récupère l'ID de l'énigme

  useEffect(() => {
    if (scannedCode) {
      setCodeSaisi(scannedCode);
      handleCodeValidation(scannedCode);
    }
  }, [scannedCode]);

  const handleCodeValidation = (code: string) => {
    // Ici, vous pouvez ajouter la logique pour valider le code avec l'énigme actuelle
    // Par exemple, comparer le code avec le code_reponse de l'énigme
    if (code === 'CODE_ATTENDU') { // Remplacez par la logique de validation réelle
      setValidationMessage('Code correct !');
      setShowValidationPopup(true);
    } else {
      setValidationMessage('Code incorrect. Veuillez réessayer.');
    }
  };

  const handleScan = (data: string) => {
    setCodeSaisi(data);
    setValidationMessage('QR code scanné avec succès !');
    handleCodeValidation(data);

    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }

    setShowQrScanner(false);
    setUseScanner(false);
  };

  const handleError = (err: string) => {
    if (!err.includes('NotFoundException')) {
      console.error('Erreur du scanner de QR code :', err);
      setScanError('Erreur du scanner. Veuillez réessayer.');
      setTimeout(() => {
        setScanError(null);
      }, 3000);
    }
  };

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      if (cameras.length === 0) {
        setScanError('Aucune caméra disponible.');
        setShowQrScanner(false);
      } else {
        await requestCameraPermission();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la caméra :', error);
      setScanError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setShowQrScanner(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setShowQrScanner(true);
    } catch (error) {
      console.error('Permission de la caméra refusée :', error);
      setScanError('Permission de la caméra refusée. Veuillez autoriser l\'accès à la caméra.');
      setShowQrScanner(false);
    }
  };

  const disableScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
    setShowQrScanner(false);
    setUseScanner(false);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && qrScannerRef.current) {
        disableScanner();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (showQrScanner && useScanner) {
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
  }, [showQrScanner, useScanner]);

  return (
    <div className="container mx-auto p-4">
      {/* Bouton pour revenir à la page de jeu avec l'ID de l'énigme */}
      <button
        onClick={() => router.push(`/participants/dashboard/chassesAchete/gameInterface?enigmeId=${enigmeId}`)}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md"
      >
        Retour
      </button>

      <h1 className="text-2xl font-bold mb-4">Valider le code</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setUseScanner(false)}
          className={`px-4 py-2 rounded-md ${
            !useScanner ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          }`}
        >
          Saisir manuellement
        </button>
        <button
          onClick={() => {
            setUseScanner(true);
            checkCameraAvailability();
          }}
          className={`px-4 py-2 rounded-md ${
            useScanner ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
          }`}
        >
          Scanner un QR code
        </button>
      </div>

      {!useScanner ? (
        <div>
          <input
            type="text"
            placeholder="Entrez le code de réponse"
            value={codeSaisi}
            onChange={(e) => setCodeSaisi(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm mb-2"
          />
          <button
            onClick={() => handleCodeValidation(codeSaisi)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Valider
          </button>
        </div>
      ) : (
        showQrScanner && (
          <div>
            <div id="qr-scanner" style={{ width: '100%' }}></div>
            {scanError && <p className="text-red-500 mt-2">{scanError}</p>}
            <button
              onClick={disableScanner}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Désactiver le scanner
            </button>
          </div>
        )
      )}

      {validationMessage && (
        <p className={`mt-4 ${validationMessage.includes('correct') ? 'text-green-500' : 'text-red-500'}`}>
          {validationMessage}
        </p>
      )}

      {/* Popup de validation */}
      <AlertDialog open={showValidationPopup} onOpenChange={setShowValidationPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Énigme validée !</AlertDialogTitle>
            <AlertDialogDescription>
              Félicitations, vous avez résolu cette énigme. Passez à la suivante !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowValidationPopup(false);
                router.push('/participants/dashboard/chassesAchete'); // Rediriger vers la liste des chasses
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CodeValidationPage;