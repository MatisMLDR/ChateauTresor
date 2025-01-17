"use client";

import { ChasseType } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contenuTextuel } from "@/constants";
import { useState } from "react";

interface BasicDetailsProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
}

export function BasicDetails({ formData, setFormData }: BasicDetailsProps) {
  const [fileName, setFileName] = useState<string | null>(null); // État pour stocker le nom du fichier sélectionné

  // Fonction pour convertir une durée au format "HH:MM:SS" en minutes
  const convertirDureeEnMinutes = (duree: string) => {
    if (!duree) return 0;
    const [heures, minutes, secondes] = duree.split(':').map(Number);
    return heures * 60 + minutes + secondes / 60;
  };

  // Fonction pour convertir les minutes en format "HH:MM:SS"
  const convertirMinutesEnDuree = (minutes: number) => {
    const heures = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    return `${String(heures).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Gestion de l'image téléchargée
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
      setFileName(file.name); // Stocker le nom du fichier sélectionné
    }
  };

  // Convertir la durée en minutes pour l'affichage
  const dureeEstimeeEnMinutes = formData.duree_estime
    ? convertirDureeEnMinutes(formData.duree_estime)
    : 0;

  // Récupérer le nom du fichier ou de l'image existante
  const getImageName = () => {
    if (fileName) return fileName; // Afficher le nom du fichier sélectionné
    if (!formData.image) return "Aucun fichier choisi";
    if (formData.image.startsWith("data:image")) {
      return "Fichier téléchargé";
    }
    return formData.image.split('/').pop() || "Image de la chasse"; // Extraire le nom du fichier de l'URL
  };

  return (
    <div className="space-y-6">
      {/* Champ de saisie pour le titre */}
      <div className="space-y-2">
        <Label htmlFor="title">{contenuTextuel.create.form.huntTitle}</Label>
        <Input
          id="titre"
          value={formData.titre || ""}
          onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
          placeholder={contenuTextuel.create.form.titlePlaceholder}
        />
      </div>

      {/* Champ de saisie pour la description */}
      <div className="space-y-2">
        <Label htmlFor="description">{contenuTextuel.create.form.description}</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={contenuTextuel.create.form.descriptionPlaceholder}
          rows={4}
        />
      </div>

      {/* Champ pour télécharger une image */}
      <div className="space-y-2">
        <Label>Image de la chasse</Label> {/* Étiquette non cliquable */}
        {formData.image && (
          <img
            src={formData.image}
            alt="Image de la chasse"
            className="w-32 h-32 object-cover rounded-lg mb-2"
          />
        )}
        <div className="flex items-center gap-2">
          <label
            htmlFor="image"
            className="cursor-pointer bg-primary text-secondary px-4 py-2 rounded-md"
          >
            {formData.image ? "Modifier l'image" : "Choisir une image"}
          </label>
          <span className="text-sm text-muted-foreground">
            {getImageName()}
          </span>
        </div>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden" // Masquer l'input de fichier par défaut
        />
      </div>

      {/* Champs de saisie pour la durée et le prix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">{contenuTextuel.create.form.duration}</Label>
          <Input
            id="duree_estime"
            type="number"
            min={0}
            step={15}
            value={dureeEstimeeEnMinutes}
            onChange={(e) => {
              const minutes = parseFloat(e.target.value);
              if (!isNaN(minutes)) {
                setFormData({
                  ...formData,
                  duree_estime: convertirMinutesEnDuree(minutes),
                });
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prix">{contenuTextuel.create.form.price}</Label>
          <Input
            id="prix"
            type="number"
            min={0}
            step={0.01}
            value={formData.prix || 0}
            onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Age_requis">{contenuTextuel.create.form.age}</Label>
          <Input
            id="age_requis"
            type="number"
            min={0}
            max={110}
            value={formData.age_requis || 1}
            onChange={(e) => setFormData({ ...formData, age_requis: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Champ de saisie pour le theme */}
        <div className="space-y-2">
          <Label htmlFor="theme">{contenuTextuel.create.form.themeContent}</Label>
          <Input
            id="theme"
            value={formData.theme || ""}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            placeholder={contenuTextuel.create.form.themePlaceholder}
          />
        </div>
      </div>
    </div>
  );
}