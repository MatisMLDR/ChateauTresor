import { useState } from "react";
import { BasicDetails } from "./steps/basic-details";
import { CastleSelection } from "./steps/castle-selection";
import { RiddlesCreation } from "./steps/riddles-creation";
import { ReviewSubmit } from "./steps/review-submit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChasseType } from "@/types";
import { contenuTextuel } from "@/lib/contenuCreationChasse";
import toast, { Toaster } from "react-hot-toast";
import Chasse from "@/classes/Chasse";
import { Enigme } from "@/classes/Enigme";
import Indice from "@/classes/Indice";
import { UUID } from "crypto";

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

  function transformFormDataToTables(chasse: ChasseType) {
    const chasseId = crypto.randomUUID();
    const chasseTable = {
      id_chasse: chasseId as UUID,
      titre: chasse.titre || "Nouvelle Chasse",
      capacite: chasse.capacite || 0,
      description: chasse.description || "Pas de description",
      age_requis: chasse.age_requis || 0,
      image: chasse.image,
      date_creation: new Date().toISOString(),
      date_modification: new Date().toISOString(),
      date_debut: chasse.date_debut,
      date_fin: chasse.date_fin,
      prix: chasse.prix || 0.0,
      difficulte: chasse.difficulte || 1,
      duree_estime: chasse.duree_estime || "00:00:00",
      theme: chasse.theme || "Aucun thème",
      statut: chasse.statut || "Inactif",
      id_chateau: chasse.chateau?.id_chateau,
      id_equipe: chasse.id_equipe || "42fdbebf-d919-4bc2-a7b7-f00688f706af",
    };
  
    // Générer un id_enigme unique pour chaque énigme
    const enigmesTable = (chasse.enigmes || []).map((enigme) => {
      const enigmeId = crypto.randomUUID() as UUID; // Générer un UUID unique pour chaque énigme
      return {
        id_enigme: enigmeId,
        id_chasse: chasseId as UUID,
        titre: enigme.titre || "Nouvelle Énigme",
        description: enigme.description || "Pas de description",
        ordre: enigme.ordre || 1,
        code_reponse: enigme.code_reponse || "",
        endroit_qrcode: enigme.endroit_qrcode || "",
        temps_max: Number(enigme.temps_max || 30), // En secondes
        description_reponse: enigme.description_reponse || "",
        image_reponse: enigme.image_reponse || "",
        degre_difficulte: enigme.degre_difficulte || 1,
      };
    });
  
    // Associer les indices à l'id_enigme correspondant
    const indicesTable = (chasse.enigmes || []).flatMap((enigme, index) =>
      (enigme.indices || []).map((indice) => ({
        id_indice: crypto.randomUUID() as UUID,
        id_enigme: enigmesTable[index].id_enigme, // Utiliser l'id_enigme généré pour cette énigme
        contenu: indice.contenu || "Pas de contenu",
        ordre: Number(indice.ordre || 1),
        degre_aide: Number(indice.degre_aide || 1),
        type: indice.type || "text",
      }))
    );
  
    return { chasseTable, enigmesTable, indicesTable };
  }

  const handleSubmit = async () => {
    try {
      // Transformation des données en tables
      const { chasseTable, enigmesTable, indicesTable } = transformFormDataToTables(
        formData as ChasseType
      );
  
      console.log("ChasseTable :", chasseTable);
      console.log("ÉnigmesTable :", enigmesTable);
      console.log("IndicesTable :", indicesTable);
  
      // Étape 1 : Création de la chasse
      const chasse = new Chasse(chasseTable);
      console.log("Création de la chasse...");
      await chasse.create();
      toast.success("Chasse créée avec succès.");
  
      // Récupération de l'ID de la chasse créée
      const chasseId = chasse.getIdChasse();
      console.log("UUID de la chasse :", chasseId);
  
      // Étape 2 : Création des énigmes et indices
      for (let enigmeData of enigmesTable) {
        const enigmeInstance = new Enigme(enigmeData);
        console.log("Création de l'énigme :", enigmeInstance);
        await enigmeInstance.create();
        toast.success(`Énigme "${enigmeData.titre}" créée avec succès.`);
  
        // Étape 3 : Création des indices associés à cette énigme
        const indicesForEnigme = indicesTable.filter(
          (indice) => indice.id_enigme === enigmeData.id_enigme
        );
  
        for (const indiceData of indicesForEnigme) {
          const indiceInstance = new Indice(indiceData);
          console.log("Création de l'indice :", indiceInstance);
          await indiceInstance.create();
        }
        console.log("Indices de l'énigme créés avec succès.");
      }
  
      toast.success("Toutes les données ont été sauvegardées avec succès.");
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      toast.error("Une erreur est survenue lors de la création.");
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
        <CurrentStepComponent formData={formData} setFormData={handleFormDataUpdate} />
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