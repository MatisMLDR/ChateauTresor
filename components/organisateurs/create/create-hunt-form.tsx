import { useState } from "react";
import { BasicDetails } from "./steps/basic-details";
import { CastleSelection } from "./steps/castle-selection";
import { RiddlesCreation } from "./steps/riddles-creation";
import { ReviewSubmit } from "./steps/review-submit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChasseType } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import Chasse from "@/classes/Chasse";
import { Enigme } from "@/classes/Enigme";
import Indice from "@/classes/Indice";

const steps = [
  { title: "Informations de base", component: BasicDetails },
  { title: "Sélection du château", component: CastleSelection },
  { title: "Création des énigmes", component: RiddlesCreation },
  { title: "Revue et validation", component: ReviewSubmit },
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

  const generateRandomId = () => Math.floor(Math.random() * 1_000_000_000);

  const transformFormDataToTables = (chasse: ChasseType) => {
    const chasseTable = {
      id_chasse: chasse.id_chasse || generateRandomId(),
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
      id_equipe: chasse.id_equipe || 1, // Ajustez selon vos besoins
    };

    const enigmesTable = chasse.enigmes?.map((enigme) => ({
      id_enigme: enigme.id_enigme || generateRandomId(), // ID unique pour l'énigme
      id_chasse: chasseTable.id_chasse, // Correspond à la clé étrangère vers `chasse`
      titre: enigme.titre || "Nouvelle Énigme", // Défaut défini dans votre structure SQL
      description: enigme.description || "Pas de description", // Défaut défini dans votre structure SQL
      ordre: enigme.ordre ?? 1, // Assure un ordre par défaut à 1
      degre_difficulte: enigme.degre_difficulte ?? 1, // Assure un degré de difficulté par défaut à 1
      temps_max: enigme.temps_max ?? "00:30:00", // Définit un temps maximum par défaut
      code_reponse: enigme.code_reponse || "", // Valeur par défaut pour éviter `null`
      endroit_qrcode: enigme.endroit_qrcode || "", // Valeur par défaut vide pour `endroit_qrcode`
      description_reponse: enigme.description_reponse || "Pas de description", // Défaut défini
      image_reponse: enigme.image_reponse || "", // Valeur par défaut vide pour `image_reponse`
      indices: enigme.indices || [], // Définit un tableau vide pour les indices par défaut
    })) || [];

    const indicesTable = chasse.enigmes?.flatMap((enigme) =>
      enigme.indices?.map((indice) => ({
        id_indice: indice.id_indice || generateRandomId(),
        id_enigme: enigme.id_enigme, // Lien vers l'énigme
        contenu: indice.contenu || "Pas de contenu",
        ordre: indice.ordre || 1,
        degre_aide: indice.degre_aide || 1,
        type: indice.type || "Text",
      }))
    ) || [];

    return { chasseTable, enigmesTable, indicesTable };
  };

  const handleSubmit = async () => {
    try {
      // Génération d'un ID unique pour la chasse
      const chasseId = generateRandomId();

      // Transformation des données du formulaire avec des IDs explicitement liés
      const finalFormData: ChasseType = {
        ...formData,
        id_chasse: chasseId, // Attribuer l'ID généré à la chasse
        enigmes: formData.enigmes?.map((enigme) => {
          const enigmeId = enigme.id_enigme || generateRandomId(); // Générer un ID pour chaque énigme
          return {
            ...enigme,
            id_enigme: enigmeId,
            id_chasse: chasseId, // Relier l'énigme à la chasse
            indices: enigme.indices?.map((indice) => ({
              ...indice,
              id_indice: indice.id_indice || generateRandomId(), // Générer un ID pour chaque indice
              id_enigme: enigmeId, // Relier chaque indice à son énigme
              id_chasse: chasseId, // Relier chaque indice à la chasse
            })) || [],
          };
        }) || [],
      };

      // Extraction des données en tables pour insertion
      const { chasseTable, enigmesTable, indicesTable } = transformFormDataToTables(finalFormData);

      // Vérification explicite que l'ID de la chasse est défini
      if (!chasseTable.id_chasse) {
        throw new Error("ID de la chasse manquant après génération");
      }

      console.log("Données transformées :");
      console.log("Chasse :", chasseTable);
      console.log("Énigmes :", enigmesTable);
      console.log("Indices :", indicesTable);

      // Création de la chasse
      console.log("Création de la chasse...");
      const chasse = new Chasse(chasseTable);
      await chasse.create();
      toast.success("Chasse créée avec succès.");

      // Création des énigmes
      console.log("Création des énigmes...");
      for (const enigmeData of enigmesTable) {
        const enigme = new Enigme(enigmeData);
        await enigme.create();
      }
      toast.success("Énigmes créées avec succès.");

      // Création des indices
      console.log("Création des indices...");
      for (const indiceData of indicesTable) {
        const indice = new Indice(indiceData);
        await indice.create();
      }
      toast.success("Indices créés avec succès.");

      console.log("Tous les éléments ont été créés avec succès.");
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


