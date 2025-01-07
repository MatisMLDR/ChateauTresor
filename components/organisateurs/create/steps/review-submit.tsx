"use client";

import { TreasureHunt } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, AlertTriangle } from "lucide-react";

/**
 * Ce code définit un composant React appelé ReviewSubmit qui fait partie d'un formulaire
 * multi-étapes pour créer une chasse au trésor. Le composant est responsable de l'affichage
 * d'un récapitulatif des informations saisies par l'utilisateur avant la soumission finale.
 */

// Définition des props pour le composant ReviewSubmit
interface ReviewSubmitProps {
  formData: Partial<TreasureHunt>; // Les données actuelles du formulaire
  setFormData: (data: Partial<TreasureHunt>) => void; // Fonction pour mettre à jour les données du formulaire
}

// Définition du composant ReviewSubmit
export function ReviewSubmit({ formData }: ReviewSubmitProps) {
  // Vérifie si toutes les informations requises sont complètes
  const isComplete =
    formData.titre &&
    formData.description &&
    formData.castle &&
    formData.prix &&
    formData.age_requis &&
    formData.duree_estime &&
    formData.difficulte &&
    formData.date_fin &&
    formData.date_debut &&
    formData.theme &&
    formData.capacite &&
    formData.riddles?.length;

  return (
    <div className="space-y-8">
      {/* Carte pour les informations de base */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Title</h3>
            <p className="text-muted-foreground">{formData.titre}</p>
          </div>
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground">{formData.description}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Durée estimée : {formData.duree_estime} minutes</span>
            </div>
            <div>Prix du ticket : {formData.prix}€</div>
            <div>Âge Minimum : {formData.age_requis} ans</div>
            <div className="capitalize">Difficulté : {formData.difficulte} </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte pour le château sélectionné */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Castle</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.castle ? (
            <div className="space-y-4">
              <img
                src={formData.castle.imageUrl}
                alt={formData.castle.name}
                className="h-48 w-full rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{formData.castle.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {formData.castle.address}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun chateau seléctionné</p>
          )}
        </CardContent>
      </Card>

      {/* Carte pour les énigmes */}
      <Card>
        <CardHeader>
          <CardTitle>Riddles ({formData.riddles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.riddles?.map((riddle, index) => (
              <div key={riddle.id} className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-semibold">Riddle {index + 1}</h3>
                <p className="mb-2 text-muted-foreground">{riddle.question}</p>
                <div className="text-sm text-muted-foreground">
                  {riddle.clues.length} clues provided
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message d'avertissement si les informations ne sont pas complètes */}
      {!isComplete && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">Please complete all required information before submitting</p>
        </div>
      )}
    </div>
  );
}