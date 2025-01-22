"use client";

import React from "react";
import { ChasseType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";

interface ReviewSubmitProps {
  formData: Partial<ChasseType>;
  readOnly?: boolean;
}

export function ReviewSubmit({ formData, readOnly }: ReviewSubmitProps) {
  return (
    <div className="space-y-8">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Titre</h3>
            <p className="text-muted-foreground">{formData.titre || "Non spécifié"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {formData.description || "Aucune description"}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Durée estimée : {formData.duree_estime || "Non spécifiée"}</span>
            </div>
            <div>Prix du ticket : {formData.prix ? `${formData.prix}€` : "Non spécifié"}</div>
            <div>Âge Minimum : {formData.age_requis || "Non spécifié"} ans</div>
            <div className="capitalize">Difficulté : {formData.difficulte || "Non spécifiée"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Château sélectionné */}
      <Card>
        <CardHeader>
          <CardTitle>Château sélectionné</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.chateau ? (
            <div className="space-y-4">
              <img
                src={
                  formData.chateau.image instanceof File
                    ? URL.createObjectURL(formData.chateau.image)
                    : formData.chateau.image || "/placeholder-image.png"
                }
                alt={formData.chateau.nom}
                className="h-48 w-full rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{formData.chateau.nom || "Nom non spécifié"}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {formData.chateau.localisation || "Localisation non spécifiée"}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun château sélectionné</p>
          )}
        </CardContent>
      </Card>

      {/* Énigmes */}
      <Card>
        <CardHeader>
          <CardTitle>Énigmes ({formData.enigmes?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.enigmes?.map((enigme, index) => (
              <div
                key={enigme.id_enigme || index}
                className="rounded-lg bg-muted p-4"
              >
                <h3 className="mb-2 font-semibold">Énigme {index + 1}</h3>
                <p className="mb-2 text-muted-foreground">{enigme.titre || "Sans titre"}</p>
                <div className="text-sm text-muted-foreground">
                  {enigme.indices?.length || 0} indice(s) fourni(s)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Récompenses */}
      <Card>
        <CardHeader>
          <CardTitle>Récompenses ({formData.recompenses?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.recompenses?.map((recompense, index) => (
              <div
                key={recompense.id_recompense || index}
                className="rounded-lg bg-muted p-4"
              >
                <h3 className="mb-2 font-semibold">Récompense {index + 1}</h3>
                <p className="mb-2 text-muted-foreground">{recompense.nom || "Sans nom"}</p>
                <div className="text-sm text-muted-foreground">
                  Type: {recompense.type || "Non spécifié"} | 
                  Valeur: {recompense.valeur || "0"} | 
                  Quantité: {recompense.quantite_dispo || "0"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}