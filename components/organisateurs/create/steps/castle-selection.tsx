"use client";

import { useEffect, useState } from "react";
import { ChateauType, ChasseType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin } from "lucide-react";
import { contenuTextuel } from "@/lib/contenuCreationChasse";
import { Input } from "@/components/ui/input";
import Chateau from "@/classes/Chateau";

interface SelectionChateauProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
}

export function CastleSelection({ formData, setFormData }: SelectionChateauProps) {
  const [chateaux, setChateaux] = useState<ChateauType[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  // Charger la liste des châteaux
  useEffect(() => {
    const chargerChateaux = async () => {
      try {
        setChargement(true);
        const tousLesChateaux = await Chateau.getAllChateaux();
        setChateaux(
          tousLesChateaux.map((chateau) => ({
            id_chateau: chateau.getIdChateau(),
            nom: chateau.getNom(),
            localisation: chateau.getLocalisation(),
            description: chateau.getDescription(),
            image: chateau.getImage(),
          }))
        );
      } catch (err) {
        console.error(err);
        setErreur("Erreur lors du chargement des châteaux.");
      } finally {
        setChargement(false);
      }
    };

    chargerChateaux();
  }, []);

  if (chargement) {
    return <p>Chargement des châteaux...</p>;
  }

  if (erreur) {
    return <p>{erreur}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Sélectionner un château</Label>
        <RadioGroup
          value={formData.id_chateau?.toString()}
          onValueChange={(valeur) => {
            const chateauSelectionne = chateaux.find(
              (chateau) => chateau.id_chateau.toString() === valeur
            );
            setFormData({ ...formData, id_chateau: valeur as `${string}-${string}-${string}-${string}-${string}`, chateau: chateauSelectionne });
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chateaux.map((chateau) => (
              <Card
                key={chateau.id_chateau}
                className={`cursor-pointer transition-all ${
                  formData.chateau?.id_chateau === chateau.id_chateau ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFormData({ ...formData, chateau })}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={chateau.image || "https://via.placeholder.com/300x200"}
                      alt={chateau.nom}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RadioGroupItem
                        value={chateau.id_chateau.toString()}
                        id={chateau.id_chateau.toString()}
                        className="sr-only"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{chateau.nom}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      {chateau.localisation || "Non spécifiée"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {chateau.description || "Pas de description"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date_debut">{contenuTextuel.create.form.date_d}</Label>
          <Input
            id="date_debut"
            type="date"
            value={formData.date_debut || ""}
            onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_fin">{contenuTextuel.create.form.date_f}</Label>
          <Input
            id="date_fin"
            type="date"
            value={formData.date_fin || ""}
            onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacite">{contenuTextuel.create.form.capaciteMaxTxt}</Label>
        <Input
          id="capacite"
          type="number"
          min={0}
          value={formData.capacite || 1}
          onChange={(e) =>
            setFormData({ ...formData, capacite: parseFloat(e.target.value) })
          }
        />
      </div>
    </div>
  );
}

export default CastleSelection;