"use client";

import { useState, useCallback } from "react";
import { BasicDetails } from "./steps/basic-details";
import { CastleSelection } from "./steps/castle-selection";
import { RiddlesCreation } from "./steps/riddles-creation";
import { ReviewSubmit } from "./steps/review-submit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChasseType, RecompenseType, EnigmeType, IndiceType, ChateauType } from "@/types";
import { contenuTextuel } from "@/constants";
import toast, { Toaster } from "react-hot-toast";
import Chasse from "@/classes/Chasse";
import { Enigme } from "@/classes/Enigme";
import Indice from "@/classes/Indice";
import Recompense from "@/classes/Recompense";
import { UUID } from "crypto";
import RewardCreation from "./steps/reward-creation";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

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
  chateauInitial?: ChateauType;
}

export function CreateHuntForm({ initialData, isEditMode = false, onHuntCreated }: CreateHuntFormProps) {
  const router = useRouter();
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ChasseType>>(initialData || { enigmes: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);

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
      const { data, error } = await supabase.storage
        .from('ChateauTresor')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: isEditMode
        });

      if (error) throw new Error(`Échec de l'upload: ${error.message}`);

      const { data: urlData } = supabase.storage
        .from('ChateauTresor')
        .getPublicUrl(fileName);

      return urlData.publicUrl;

    } catch (error) {
      throw error;
    }
  }, [isEditMode]);

  const transformFormDataToTables = useCallback(async (chasse: ChasseType) => {
    setIsSubmitting(true);
    const chasseId = (isEditMode && chasse.id_chasse) ? chasse.id_chasse : crypto.randomUUID() as UUID;

    try {
      if (!chasse.titre?.trim()) throw new Error("Le titre est obligatoire");
      if (!chasse.description?.trim()) throw new Error("La description est obligatoire");
      if (!chasse.chateau?.id_chateau) throw new Error("Aucun château sélectionné");

      let uploadedImage = chasse.image;
      if (chasse.image instanceof File) {
        uploadedImage = await handleUpload(chasse.image, 'chasses', chasseId);
      }

      const processedEnigmes = [];
      for (const enigme of chasse.enigmes || []) {
        let uploadedImageReponse = enigme.image_reponse;
        if (enigme.image_reponse instanceof File) {
          const enigmeId = enigme.id_enigme || crypto.randomUUID() as UUID;
          uploadedImageReponse = await handleUpload(
            enigme.image_reponse,
            'enigmes',
            enigmeId
          );
        }

        const processedIndices = [];
        for (const indice of enigme.indices || []) {
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

      const processedRecompenses = [];
      for (const recompense of chasse.recompenses || []) {
        let uploadedImage = recompense.image;

        if (recompense.image instanceof File) {
          const recompenseId = recompense.id_recompense || crypto.randomUUID() as UUID;
          uploadedImage = await handleUpload(
            recompense.image,
            'recompenses',
            recompenseId
          );
        }

        processedRecompenses.push({
          ...recompense,
          id_recompense: recompense.id_recompense || crypto.randomUUID() as UUID,
          image: uploadedImage
        });
      }

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
          date_debut: chasse.date_debut ? chasse.date_debut.split('T')[0] : "",
          date_fin: chasse.date_fin ? chasse.date_fin.split('T')[0] : "",
          horaire_debut: chasse.horaire_debut || "08:00:00",
          horaire_fin: chasse.horaire_fin || "18:00:00",
          prix: chasse.prix || 0.0,
          difficulte: chasse.difficulte || 1,
          duree_estime: chasse.duree_estime || "00:00:00",
          theme: chasse.theme || "Aucun thème",
          statut: chasse.statut || "En attente de validation",
          id_chateau: chasse.chateau.id_chateau,
          id_equipe: idEquipe,
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

      return finalData;

    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [handleUpload, isEditMode, generateCodeReponse, idEquipe]);

  const handleSubmit = useCallback(async () => {
    try {
      const transformedData = await transformFormDataToTables(formData as ChasseType);
      
      const chasseInstance = new Chasse(transformedData.chasseTable);
      const chasseResult = isEditMode 
        ? await chasseInstance.update() 
        : await chasseInstance.create();

      for (const enigmeData of transformedData.enigmesTable) {
        const enigmeInstance = new Enigme(enigmeData);
        const result = isEditMode && enigmeData.id_enigme 
          ? await enigmeInstance.update() 
          : await enigmeInstance.create();
      }

      for (const indiceData of transformedData.indicesTable) {
        const indiceInstance = new Indice(indiceData);
        const result = isEditMode && indiceData.id_indice 
          ? await indiceInstance.update() 
          : await indiceInstance.create();
      }

      for (const recompenseData of transformedData.recompensesTable) {
        const recompenseInstance = new Recompense(recompenseData);
        const result = isEditMode && recompenseData.id_recompense 
          ? await recompenseInstance.update() 
          : await recompenseInstance.create();
      }

      toast.success("Chasse créée avec succès !");
      if (onHuntCreated) onHuntCreated(transformedData.chasseTable.id_equipe as UUID);
      router.refresh();

    } catch (error) {
      toast.error(`Erreur lors de la création : ${(error as Error).message}`);
    }
  }, [formData, isEditMode, transformFormDataToTables, onHuntCreated, router]);

  const handleFormDataUpdate = useCallback((updatedData: Partial<ChasseType>) => {
    setFormData(prev => ({
      ...prev,
      ...updatedData,
      date_debut: updatedData.date_debut ? updatedData.date_debut.split('T')[0] : prev.date_debut,
      date_fin: updatedData.date_fin ? updatedData.date_fin.split('T')[0] : prev.date_fin,
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
          onValidityChange={(isValid) => setIsStepValid(isValid)}
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
            disabled={isSubmitting || !isStepValid}
            className="min-w-[120px]"
          >
            Suivant →
          </Button>
        )}
      </div>
    </div>
  );
}