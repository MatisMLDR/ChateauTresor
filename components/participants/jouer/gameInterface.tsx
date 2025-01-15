'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EnigmeType } from '@/types';
import IndiceComponent from './indiceComponent';
import Chasse from '@/classes/Chasse';
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
} from "@/components/ui/alert-dialog"; // Importez les composants AlertDialog

interface GameInterfaceProps {
  chasse: any;
  onBack: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ chasse, onBack }) => {
  const [enigmes, setEnigmes] = useState<EnigmeType[]>([]);
  const [currentEnigmeIndex, setCurrentEnigmeIndex] = useState(0);
  const [showIndices, setShowIndices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSaisi, setCodeSaisi] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [useScanner, setUseScanner] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false); // État pour afficher la popup de validation

  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchEnigmes = async () => {
      try {
        const chasseInstance = await Chasse.readId(chasse.id_chasse);
        const enigmes = await chasseInstance.getAllEnigmes();
        const enigmesTriees = enigmes.sort((a, b) => a.ordre - b.ordre);
        setEnigmes(enigmesTriees);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des énigmes :', error);
        setError('Impossible de charger les énigmes. Veuillez réessayer plus tard.');
      }
    };

    fetchEnigmes();
  }, [chasse.id_chasse]);

  const handleCodeValidation = (code: string) => {
    const currentEnigme = enigmes[currentEnigmeIndex];

    if (code === currentEnigme.code_reponse) {
      setValidationMessage('Code correct !');
      setShowValidationPopup(true); // Afficher la popup de validation
    } else {
      setValidationMessage('Code incorrect. Veuillez réessayer.');
    }
  };

  const handleBackAfterSuccess = () => {
    console.log('Redirection vers chassesAchete...');
    router.push('/participants/chassesAchete');
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
        setError('Aucune caméra disponible.');
        setShowQrScanner(false);
      } else {
        await requestCameraPermission();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la caméra :', error);
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setShowQrScanner(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setShowQrScanner(true);
    } catch (error) {
      console.error('Permission de la caméra refusée :', error);
      setError('Permission de la caméra refusée. Veuillez autoriser l\'accès à la caméra.');
      setShowQrScanner(false);
    }
  };

  const handleBack = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
    onBack();
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

  if (showSuccessPage) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Félicitations !</h1>
        <p className="text-lg mb-4">Vous avez résolu toutes les énigmes de cette chasse.</p>
        <button
          onClick={handleBackAfterSuccess}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Retour aux chasses achetées
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <button onClick={handleBack} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md">
          Retour à la liste des chasses
        </button>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (enigmes.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <button onClick={handleBack} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md">
          Retour à la liste des chasses
        </button>
        <p>Chargement des énigmes...</p>
      </div>
    );
  }

  const currentEnigme = enigmes[currentEnigmeIndex];

  return (
    <div className="container mx-auto p-4">
      <button onClick={handleBack} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md">
        Retour à la liste des chasses
      </button>

      <h1 className="text-2xl font-bold mb-4">{currentEnigme.titre}</h1>
      <p className="text-lg mb-4">{currentEnigme.description}</p>

      <div className="mb-4">
        <button
          onClick={() => setShowIndices(!showIndices)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {showIndices ? 'Masquer les indices' : 'Afficher les indices'}
        </button>
      </div>

      {showIndices && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Indices</h2>
          <IndiceComponent idEnigme={currentEnigme.id_enigme} />
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Valider le code</h2>
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
      </div>

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
                if (currentEnigmeIndex < enigmes.length - 1) {
                  setCurrentEnigmeIndex(currentEnigmeIndex + 1); // Passer à l'énigme suivante
                } else {
                  setShowSuccessPage(true); // Afficher la page de succès
                }
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

export default GameInterface;