"use client";

import Chasse from "@/classes/Chasse";
import { Enigme } from "@/classes/Enigme";
import Indice from "@/classes/Indice";
import Recompense from "@/classes/Recompense";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { contenuTextuel } from "@/constants";
import { ChasseType } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BasicDetails } from "./steps/basic-details";
import { CastleSelection } from "./steps/castle-selection";
import { ReviewSubmit } from "./steps/review-submit";
import RewardCreation from "./steps/reward-creation";
import { RiddlesCreation } from "./steps/riddles-creation";

const steps = [
  { title: contenuTextuel.create.steps.basicDetails, component: BasicDetails },
  { title: contenuTextuel.create.steps.castleSelection, component: CastleSelection },
  { title: contenuTextuel.create.steps.riddlesClues, component: RiddlesCreation },
  { title: contenuTextuel.create.steps.rewards, component: RewardCreation },
  { title: contenuTextuel.create.steps.reviewSubmit, component: ReviewSubmit }
];

interface CreateHuntFormProps {
  initialData?: Partial<ChasseType>;
  isEditMode?: boolean;
  onHuntCreated?: (id_equipe: string) => void;
}

export function CreateHuntForm({ initialData, isEditMode = false, onHuntCreated }: CreateHuntFormProps) {
  const router = useRouter();
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ChasseType>>(initialData || { enigmes: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupération de l'ID équipe depuis l'URL
  const idEquipe = params.id_equipe as UUID;

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  const handleStepNavigation = (direction: 'next' | 'previous') => {
    const newStep = direction === 'next' ? currentStep + 1 : currentStep - 1;
    setCurrentStep(Math.max(0, Math.min(newStep, steps.length - 1)));
    window.scrollTo(0, 0);
  };

  const generateCodeReponse = useCallback(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  const handleUpload = useCallback(async (
    file: File,
    folder: 'chasses' | 'enigmes' | 'indices' | 'recompenses',
    id: UUID,
    options?: { subfolder?: 'sons' | 'images' }
  ) => {
    const supabase = createClient();
    const extension = file.name.split('.').pop() || 'bin';
    const subfolderPath = options?.subfolder ? `${options.subfolder}/` : '';
    const fileName = `${folder}/${subfolderPath}${id}.${extension}`;

    try {
      console.log(`Tentative d'upload vers ${fileName}`);
      const { data, error } = await supabase.storage
        .from('ChateauTresor')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: isEditMode
        });

      if (error) {
        console.error(`Erreur upload ${fileName}:`, error);
        throw new Error(`Échec de l'upload: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('ChateauTresor')
        .getPublicUrl(fileName);

      console.log(`Upload réussi pour ${fileName}`, urlData);
      return urlData.publicUrl;

    } catch (error) {
      console.error(`Erreur complète upload ${fileName}:`, error);
      throw error;
    }
  }, [isEditMode]);

  const transformFormDataToTables = useCallback(async (chasse: ChasseType) => {
    setIsSubmitting(true);
    const chasseId = (isEditMode && chasse.id_chasse) ? chasse.id_chasse : crypto.randomUUID() as UUID;

    try {
      // Validation des champs obligatoires
      if (!chasse.titre?.trim()) throw new Error("Le titre est obligatoire");
      if (!chasse.description?.trim()) throw new Error("La description est obligatoire");
      if (!chasse.chateau?.id_chateau) throw new Error("Aucun château sélectionné");

      // Upload image principale
      let uploadedImage = chasse.image;
      if (chasse.image instanceof File) {
        console.log("Début upload image principale...");
        uploadedImage = await handleUpload(chasse.image, 'chasses', chasseId);
        console.log("Image principale uploadée:", uploadedImage);
      }

      // Traitement des énigmes
      const processedEnigmes = [];
      for (const enigme of chasse.enigmes || []) {
        console.log("Traitement énigme:", enigme.titre);

        // Upload image réponse
        let uploadedImageReponse = enigme.image_reponse;
        if (enigme.image_reponse instanceof File) {
          const enigmeId = enigme.id_enigme || crypto.randomUUID() as UUID;
          uploadedImageReponse = await handleUpload(
            enigme.image_reponse,
            'enigmes',
            enigmeId
          );
          console.log("Image réponse uploadée:", uploadedImageReponse);
        }

        // Traitement des indices
        const processedIndices = [];
        for (const indice of enigme.indices || []) {
          console.log("Traitement indice:", indice.type);
          let contenu = indice.contenu;

          if (indice.contenu instanceof File) {
            const subfolder = indice.type === 'image' ? 'images' : 'sons';
            const indiceId = indice.id_indice || crypto.randomUUID() as UUID;
            contenu = await handleUpload(
              indice.contenu,
              'indices',
              indiceId,
              { subfolder }
            );
            console.log("Contenu indice uploadé:", contenu);
          }

          processedIndices.push({
            ...indice,
            id_indice: indice.id_indice || crypto.randomUUID() as UUID,
            contenu
          });
        }

        processedEnigmes.push({
          ...enigme,
          id_enigme: enigme.id_enigme || crypto.randomUUID() as UUID,
          image_reponse: uploadedImageReponse,
          indices: processedIndices
        });
      }

      // Traitement des récompenses
      const processedRecompenses = [];
      for (const recompense of chasse.recompenses || []) {
        console.log("Traitement récompense:", recompense.nom);
        let uploadedImage = recompense.image;

        if (recompense.image instanceof File) {
          const recompenseId = recompense.id_recompense || crypto.randomUUID() as UUID;
          uploadedImage = await handleUpload(
            recompense.image,
            'recompenses',
            recompenseId
          );
          console.log("Image récompense uploadée:", uploadedImage);
        }

        processedRecompenses.push({
          ...recompense,
          id_recompense: recompense.id_recompense || crypto.randomUUID() as UUID,
          image: uploadedImage
        });
      }

      // Construction final des données
      const finalData = {
        chasseTable: {
          id_chasse: chasseId,
          titre: chasse.titre,
          capacite: chasse.capacite || 0,
          description: chasse.description,
          age_requis: chasse.age_requis || 0,
          image: uploadedImage,
          date_creation: chasse.date_creation || new Date().toISOString(),
          date_modification: new Date().toISOString(),
          date_debut: chasse.date_debut ? new Date(chasse.date_debut).toISOString() : "",
          date_fin: chasse.date_fin ? new Date(chasse.date_fin).toISOString() : "",
          horaire_debut: chasse.horaire_debut || "08:00:00",
          horaire_fin: chasse.horaire_fin || "18:00:00",
          prix: chasse.prix || 0.0,
          difficulte: chasse.difficulte || 1,
          duree_estime: chasse.duree_estime || "00:00:00",
          theme: chasse.theme || "Aucun thème",
          statut: chasse.statut || "En attente de validation",
          id_chateau: chasse.chateau.id_chateau,
          id_equipe: idEquipe, // Utilisation de l'ID équipe depuis l'URL
        },
        enigmesTable: processedEnigmes.map((enigme, index) => ({
          id_enigme: enigme.id_enigme,
          id_chasse: chasseId,
          titre: enigme.titre || `Énigme ${index + 1}`,
          description: enigme.description || "",
          code_reponse: enigme.code_reponse || generateCodeReponse(),
          ordre: enigme.ordre || index + 1,
          endroit_qrcode: enigme.endroit_qrcode || "",
          temps_max: enigme.temps_max || 30,
          description_reponse: enigme.description_reponse || "",
          image_reponse: enigme.image_reponse || "",
          degre_difficulte: enigme.degre_difficulte || 1,
        })),
        indicesTable: processedEnigmes.flatMap(enigme => 
          enigme.indices.map(indice => ({
            id_indice: indice.id_indice,
            id_enigme: enigme.id_enigme,
            contenu: indice.contenu,
            ordre: indice.ordre || 1,
            degre_aide: indice.degre_aide || 1,
            type: indice.type || "text",
          }))
        ),
        recompensesTable: processedRecompenses.map(recompense => ({
          id_recompense: recompense.id_recompense,
          id_chasse: chasseId,
          nom: recompense.nom || "Récompense sans nom",
          description: recompense.description || "",
          type: recompense.type || "physique",
          valeur: recompense.valeur || 0,
          quantite_dispo: recompense.quantite_dispo || 0,
          prix_reel: recompense.prix_reel || 0,
          image: recompense.image,
          date_modification: new Date().toISOString(),
        }))
      };

      console.log("Données finales transformées:", JSON.stringify(finalData, null, 2));
      return finalData;

    } catch (error) {
      console.error("Erreur lors de la transformation des données:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [handleUpload, isEditMode, generateCodeReponse, idEquipe]);

  const handleSubmit = useCallback(async () => {
    try {
      console.log("Début de la soumission...");
      const transformedData = await transformFormDataToTables(formData as ChasseType);
      
      console.log("Enregistrement de la chasse...");
      const chasseInstance = new Chasse(transformedData.chasseTable);
      const chasseResult = isEditMode 
        ? await chasseInstance.update() 
        : await chasseInstance.create();
      console.log("Résultat chasse:", chasseResult);

      console.log(`Enregistrement des ${transformedData.enigmesTable.length} énigmes...`);
      for (const enigmeData of transformedData.enigmesTable) {
        console.log("Enregistrement énigme:", enigmeData.titre);
        const enigmeInstance = new Enigme(enigmeData);
        const result = isEditMode && enigmeData.id_enigme 
          ? await enigmeInstance.update() 
          : await enigmeInstance.create();
        console.log("Résultat énigme:", result);
      }

      console.log(`Enregistrement des ${transformedData.indicesTable.length} indices...`);
      for (const indiceData of transformedData.indicesTable) {
        console.log("Enregistrement indice:", indiceData.type);
        const indiceInstance = new Indice(indiceData);
        const result = isEditMode && indiceData.id_indice 
          ? await indiceInstance.update() 
          : await indiceInstance.create();
        console.log("Résultat indice:", result);
      }

      console.log(`Enregistrement des ${transformedData.recompensesTable.length} récompenses...`);
      for (const recompenseData of transformedData.recompensesTable) {
        console.log("Enregistrement récompense:", recompenseData.nom);
        const recompenseInstance = new Recompense(recompenseData);
        const result = isEditMode && recompenseData.id_recompense 
          ? await recompenseInstance.update() 
          : await recompenseInstance.create();
        console.log("Résultat récompense:", result);
      }

      toast.success("Chasse créée avec succès !");
      if (onHuntCreated) onHuntCreated(transformedData.chasseTable.id_equipe as UUID);
      router.refresh();

    } catch (error) {
      console.error("Erreur complète:", {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        formData: JSON.parse(JSON.stringify(formData, (_, v) => {
          if (v instanceof File) return { name: v.name, type: v.type, size: v.size };
          return v;
        }))
      });
      toast.error(`Erreur lors de la création : ${(error as Error).message}`);
    }
  }, [formData, isEditMode, transformFormDataToTables, onHuntCreated, router]);

  const handleFormDataUpdate = useCallback((updatedData: Partial<ChasseType>) => {
    setFormData(prev => ({
      ...prev,
      ...updatedData,
      enigmes: updatedData.enigmes ? updatedData.enigmes.map((newEnigme, index) => ({
        ...prev.enigmes?.[index],
        ...newEnigme,
        indices: newEnigme.indices?.map((newIndice, idx) => ({
          ...prev.enigmes?.[index]?.indices?.[idx],
          ...newIndice,
        })),
      })) : prev.enigmes,
      recompenses: updatedData.recompenses ? updatedData.recompenses.map((newRec, i) => ({
        ...prev.recompenses?.[i],
        ...newRec,
      })) : prev.recompenses,
    }));
  }, []);

  return (
    <div className="space-y-8">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      
      <div className="space-y-2">
        <Progress value={progress} className="h-2 bg-muted" />
        <div className="text-sm text-muted-foreground text-center">
          Étape {currentStep + 1} sur {steps.length} • {steps[currentStep].title}
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <CurrentStepComponent 
          formData={formData} 
          setFormData={handleFormDataUpdate} 
        />
      </div>

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => handleStepNavigation('previous')}
          disabled={currentStep === 0 || isSubmitting}
          className="min-w-[120px]"
        >
          ← Précédent
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[160px] bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Enregistrement...</span>
            ) : isEditMode ? (
              "Mettre à jour la chasse"
            ) : (
              "Publier la chasse"
            )}
          </Button>
        ) : (
          <Button 
            onClick={() => handleStepNavigation('next')}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            Suivant →
          </Button>
        )}
      </div>
    </div>
  );
}