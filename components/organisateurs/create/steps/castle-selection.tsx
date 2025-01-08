"use client";

import { ChateauType, ChasseType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin } from "lucide-react";
import { contenuTextuel } from '@/lib/contenuCreationChasse';
import { Input } from '@/components/ui/input';

interface CastleSelectionProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
}

const AVAILABLE_CASTLES: ChateauType[] = [
  {
    id_chateau: 1,
    nom: "Edinburgh Castle",
    description: "Forteresse historique dominant la skyline d'Édimbourg, Écosse",
    localisation: "55.9486,-3.1999",
    image: "https://images.unsplash.com/photo-1580910527739-36f06b8feca3?auto=format&fit=crop&q=80",
  },
  {
    id_chateau: 2,
    nom: "Stirling Castle",
    description: "Une des forteresses les plus historiquement significatives d'Écosse",
    localisation:"56.1238,-3.9470",
    image: "https://images.unsplash.com/photo-1600620795669-0559c9a5a1f6?auto=format&fit=crop&q=80",
  }
];

export function CastleSelection({ formData, setFormData }: CastleSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Sélectionner un château</Label>
        <RadioGroup
          value={formData.id_chateau?.toString()}
          onValueChange={(value) => {
            const castle = AVAILABLE_CASTLES.find((c) => c.id_chateau === parseInt(value));
            setFormData({ ...formData, id_chateau: parseInt(value), chateau: castle });
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_CASTLES.map((castle) => (
              <Card
                key={castle.id_chateau}
                className={`cursor-pointer transition-all ${
                  formData.chateau?.id_chateau === castle.id_chateau ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFormData({ ...formData, chateau: castle })}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={castle.image}
                      alt={castle.image}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RadioGroupItem
                        value={formData.id_chateau}
                        id={formData.id_chateau?.toString()}
                        className="sr-only"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{castle.nom}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      {castle.localisation}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {castle.description}
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
            min={1}
            step={1}
            value={formData.date_debut || ""}
            onChange={(e) =>
              setFormData({ ...formData, date_debut: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_fin">{contenuTextuel.create.form.date_f}</Label>
          <Input
            id="date_fin"
            type="date"
            min={1}
            step={1}
            value={formData.date_fin || ""}
            onChange={(e) =>
              setFormData({ ...formData, date_fin: e.target.value })
            }
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