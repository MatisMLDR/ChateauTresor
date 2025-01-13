import { useState } from "react";
import { BasicDetails } from "./steps/basic-details";
import { CastleSelection } from "./steps/castle-selection";
import { RiddlesCreation } from "./steps/riddles-creation";
import { ReviewSubmit } from "./steps/review-submit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChasseType } from "@/types";
import { ChateauType} from '@/types';
import { contenuTextuel } from "@/lib/contenuCreationChasse";
import toast, { Toaster } from 'react-hot-toast';


const steps = [
  { title: contenuTextuel.create.steps.basicDetails, component: BasicDetails },
  { title: contenuTextuel.create.steps.castleSelection, component: CastleSelection },
  { title: contenuTextuel.create.steps.riddlesClues, component: RiddlesCreation },
  { title: contenuTextuel.create.steps.reviewSubmit, component: ReviewSubmit },
];

export function CreateHuntForm({ initialData }: { initialData?: Partial<ChasseType> }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ChasseType>>(initialData || { enigmes: [] });

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1_000_000_000); // Génère un nombre entre 0 et 999_999_999
  };


  function transformFormDataToTables(chasse: ChasseType) {
    const chasseTable = {
      id_chasse: chasse.id_chasse,
      titre: chasse.titre || "Nouvelle Chasse",
      capacite: chasse.capacite || 0,
      description: chasse.description || "Pas de description",
      age_requis: chasse.age_requis || 0,
      image: chasse.image,
      date_creation: chasse.date_creation,
      date_modification: chasse.date_modification,
      date_debut: chasse.date_debut,
      date_fin: chasse.date_fin,
      prix: chasse.prix || 0.0,
      difficulte: chasse.difficulte || 1,
      duree_estime: chasse.duree_estime || "00:00:00",
      theme: chasse.theme || "Aucun thème",
      statut: chasse.statut || "Inactif",
      id_chateau: formData.chateau?.id_chateau,
      id_equipe: chasse.id_equipe,             // Il faut faire attention de récupérer l'id d'équipe de l'organisateur
    };

    const enigmesTable = chasse.enigmes?.map((enigme) => ({
      id_enigme: enigme.id, // Générer un ID si non fourni
      id_chasse: chasse.id_chasse,
      titre: enigme.titre,
      description: enigme.description,
      qrCode: enigme.qrCode,
      code: enigme.code,
      endroit_qrcode: enigme.endroit_qrcode,
      temps_max: enigme.temps_max,
      description_reponse: enigme.description_reponse,
      image_reponse: enigme.image_reponse,
    })) || [];

    // Table indices
    const indicesTable = chasse.enigmes?.flatMap((enigme) =>
      enigme.indices.map((indice) => ({
        id_indice: indice.id_indice,
        id_enigme: enigme.id,
        contenu: indice.contenu || "Pas de contenu",
        ordre: indice.ordre || 1,
        degre_aide: indice.degre_aide,
        type: indice.type,
      }))
    ) || [];

    return {
      chasseTable,
      enigmesTable,
      indicesTable,
    };
  }

  const handleSubmit = async () => {
    // Génération d'un identifiant aléatoire pour la chasse
    const chasseId = generateRandomId();

    // Transformation des données en tables avec l'ID généré
    const { chasseTable, enigmesTable, indicesTable } = transformFormDataToTables({
      ...formData,
      id_chasse: chasseId, // Assigner l'ID aléatoire
    } as ChasseType);

    console.log("Final form data submitted:", formData);
    console.log("Chasse Table:", chasseTable);
    console.log("Énigmes Table:", enigmesTable);
    console.log("Indices Table:", indicesTable);

    // Afficher une notification de succès
    toast.success("Les données ont été transformées et prêtes à être sauvegardées.");

    // Simulation d'envoi des données
    try {
      await fetch('/api/chasse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chasseTable, enigmesTable, indicesTable }),
      });

      toast.success("Les données ont été sauvegardées avec succès.");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données :", error);
      toast.error("Une erreur est survenue lors de la sauvegarde des données.");
    }
  };



  const handleFormDataUpdate = (updatedData: Partial<ChasseType>) => {
    setFormData((prevData) => ({ ...prevData, ...updatedData }));
  };

  return (
    <div className="space-y-8">
      <Toaster />
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground">
          Étape {currentStep + 1} sur {steps.length}: {steps[currentStep].title}
        </div>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <CurrentStepComponent
          formData={formData}
          setFormData={handleFormDataUpdate}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          Précédent
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit}>Enregistrer</Button>
        ) : (
          <Button onClick={handleNext}>Suivant</Button>
        )}
      </div>
    </div>
  );
}
