import { useState, useEffect } from "react";
import { BasicDetails } from "./steps/basic-details";
import { CastleSelection } from "./steps/castle-selection";
import { RiddlesCreation } from "./steps/riddles-creation";
import { ReviewSubmit } from "./steps/review-submit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChasseType, RecompenseType } from "@/types";
import { contenuTextuel } from "@/constants";
import toast, { Toaster } from "react-hot-toast";
import Chasse from "@/classes/Chasse";
import { Enigme } from "@/classes/Enigme";
import Indice from "@/classes/Indice";
import Recompense from "@/classes/Recompense";
import { UUID } from "crypto";
import RewardCreation from "./steps/reward-creation";
import { useRouter } from "next/navigation";

const steps = [
  { title: contenuTextuel.create.steps.basicDetails, component: BasicDetails },
  { title: contenuTextuel.create.steps.castleSelection, component: CastleSelection },
  { title: contenuTextuel.create.steps.riddlesClues, component: RiddlesCreation },
  { title: contenuTextuel.create.steps.rewards, component: RewardCreation },
  { title: contenuTextuel.create.steps.reviewSubmit, component: ReviewSubmit }
];

interface CreateHuntFormProps {
  initialData?: Partial<ChasseType>;
  isEditMode?: boolean; // Nouvelle prop pour indiquer si on est en mode édition
}

export function CreateHuntForm({ initialData, isEditMode = false }: CreateHuntFormProps) {
  const router = useRouter();
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

  // Fonction pour générer un code de réponse de 6 chiffres
  const generateCodeReponse = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Génère un nombre entre 100000 et 999999
  };

  const transformFormDataToTables = (chasse: ChasseType) => {
    const chasseId = isEditMode ? chasse.id_chasse : crypto.randomUUID(); // Utiliser l'ID existant en mode édition
    const chasseTable = {
      id_chasse: chasseId as UUID,
      titre: chasse.titre || "Nouvelle Chasse",
      capacite: chasse.capacite || 0,
      description: chasse.description || "Pas de description",
      age_requis: chasse.age_requis || 0,
      image: chasse.image,
      date_creation: chasse.date_creation || new Date().toISOString(),
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
      const enigmeId = isEditMode ? enigme.id_enigme : crypto.randomUUID(); // Utiliser l'ID existant en mode édition
      return {
        id_enigme: enigmeId as UUID,
        id_chasse: chasseId as UUID,
        titre: enigme.titre || "Nouvelle Énigme",
        description: enigme.description || "Pas de description",
        ordre: enigme.ordre || 1,
        code_reponse: enigme.code_reponse || generateCodeReponse(), // Générer un code de réponse si non fourni
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
        id_indice: isEditMode ? indice.id_indice : crypto.randomUUID(), // Utiliser l'ID existant en mode édition
        id_enigme: enigmesTable[index].id_enigme, // Utiliser l'id_enigme généré pour cette énigme
        contenu: indice.contenu || "Pas de contenu",
        ordre: Number(indice.ordre || 1),
        degre_aide: Number(indice.degre_aide || 1),
        type: indice.type || "text",
      }))
    );

    // Générer un id_recompense unique pour chaque récompense
    const recompensesTable = (chasse.recompenses || []).map((recompense) => ({
      id_recompense: isEditMode ? recompense.id_recompense : crypto.randomUUID(), // Utiliser l'ID existant en mode édition
      id_chasse: chasseId as UUID, // Lier la récompense à la chasse
      nom: recompense.nom || "Nouvelle Récompense",
      description: recompense.description || "Pas de description",
      type: recompense.type || "Générique",
      valeur: recompense.valeur || 0.0,
      quantite_dispo: recompense.quantite_dispo || 0,
      prix_reel: recompense.prix_reel || 0.0,
      image: recompense.image || null,
      date_modification: new Date().toISOString(),
    }));

    return { chasseTable, enigmesTable, indicesTable, recompensesTable };
  };

  const handleSubmit = async () => {
    try {
      // Transformation des données en tables
      const { chasseTable, enigmesTable, indicesTable, recompensesTable } = transformFormDataToTables(
        formData as ChasseType
      );

      console.log("ChasseTable :", chasseTable);
      console.log("ÉnigmesTable :", enigmesTable);
      console.log("IndicesTable :", indicesTable);
      console.log("RécompensesTable :", recompensesTable);

      // Étape 1 : Création ou mise à jour de la chasse
      const chasse = new Chasse(chasseTable);
      if (isEditMode) {
        console.log("Mise à jour de la chasse...");
        await chasse.update(); // Utiliser la méthode update en mode édition
        toast.success("Chasse mise à jour avec succès.");
      } else {
        console.log("Création de la chasse...");
        await chasse.create(); // Utiliser la méthode create en mode création
        toast.success("Chasse créée avec succès.");
      }

      // Récupération de l'ID de la chasse
      const chasseId = chasse.getIdChasse();
      console.log("UUID de la chasse :", chasseId);

      // Étape 2 : Création ou mise à jour des énigmes et indices
      for (let enigmeData of enigmesTable) {
        const enigmeInstance = new Enigme(enigmeData);
        if (isEditMode) {
          console.log("Mise à jour de l'énigme :", enigmeInstance);
          await enigmeInstance.update(); // Utiliser la méthode update en mode édition
        } else {
          console.log("Création de l'énigme :", enigmeInstance);
          await enigmeInstance.create(); // Utiliser la méthode create en mode création
        }
        toast.success(`Énigme "${enigmeData.titre}" sauvegardée avec succès.`);

        // Étape 3 : Création ou mise à jour des indices associés à cette énigme
        const indicesForEnigme = indicesTable.filter(
          (indice) => indice.id_enigme === enigmeData.id_enigme
        );

        for (const indiceData of indicesForEnigme) {
          const indiceInstance = new Indice(indiceData);
          if (isEditMode) {
            console.log("Mise à jour de l'indice :", indiceInstance);
            await indiceInstance.update(); // Utiliser la méthode update en mode édition
          } else {
            console.log("Création de l'indice :", indiceInstance);
            await indiceInstance.create(); // Utiliser la méthode create en mode création
          }
        }
        console.log("Indices de l'énigme sauvegardés avec succès.");
      }

      // Étape 4 : Création ou mise à jour des récompenses
      for (const recompenseData of recompensesTable) {
        const recompenseInstance = new Recompense({
          ...recompenseData,
          id_recompense: recompenseData.id_recompense as `${string}-${string}-${string}-${string}-${string}`
        });
        if (isEditMode) {
          console.log("Mise à jour de la récompense :", recompenseInstance);
          await recompenseInstance.update(); // Utiliser la méthode update en mode édition
        } else {
          console.log("Création de la récompense :", recompenseInstance);
          await recompenseInstance.create(); // Utiliser la méthode create en mode création
        }
        toast.success(`Récompense "${recompenseData.nom}" sauvegardée avec succès.`);
      }

      toast.success("Toutes les données ont été sauvegardées avec succès.");

    } catch (error) {
      console.error("Erreur lors de la création ou de la mise à jour :", error);
      toast.error("Une erreur est survenue lors de la sauvegarde.");
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
          <Button onClick={handleSubmit}>
            {isEditMode ? "Mettre à jour" : "Enregistrer"}
          </Button>
        ) : (
          <Button onClick={handleNext}>Suivant</Button>
        )}
      </div>
    </div>
  );
}