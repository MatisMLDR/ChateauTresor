"use client";

import { ChasseType, ImageFile } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contenuTextuel } from "@/constants";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface BasicDetailsProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
  onValidityChange?: (isValid: boolean) => void;
  readOnly?: boolean;
}

export function BasicDetails({ formData, setFormData, onValidityChange, readOnly }: BasicDetailsProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Validation du formulaire
  useEffect(() => {
    const validateForm = () => {
      if (!onValidityChange) return;
      
      const { titre, description, image, duree_estime, prix, age_requis, theme, difficulte } = formData;

      const isTitreValid = !!titre?.trim();
      const isDescriptionValid = !!description?.trim();
      const isImageValid = !!image;
      const isDureeEstimeValid = !!duree_estime && convertirDureeEnMinutes(duree_estime) > 0;
      const isPrixValid = prix !== undefined && prix > 0;
      const isAgeRequisValid = age_requis !== undefined && age_requis >= 1;
      const isThemeValid = !!theme?.trim();
      const isDifficulteValid = [1, 2, 3].includes(difficulte || 0);

      onValidityChange(
        isTitreValid && 
        isDescriptionValid && 
        isImageValid && 
        isDureeEstimeValid && 
        isPrixValid && 
        isAgeRequisValid && 
        isThemeValid &&
        isDifficulteValid
      );
    };

    validateForm();
  }, [formData, onValidityChange]);

  // Aperçu de l'image
  useEffect(() => {
    if (formData.image) {
      if (typeof formData.image === 'string') {
        setImagePreview(formData.image);
      } else if (formData.image instanceof File) {
        setImageLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setImageLoading(false);
        };
        reader.readAsDataURL(formData.image);
      }
    } else {
      setImagePreview(null);
    }
  }, [formData.image]);

  const convertirDureeEnMinutes = (duree: string) => {
    if (!duree) return 0;
    const [heures, minutes] = duree.split(':').map(Number);
    return heures * 60 + minutes;
  };

  const convertirMinutesEnDuree = (minutes: number): string => {
    const heures = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${String(heures).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      setFormData({ ...formData, image: file });
    }
  };

  const dureeEstimeeEnMinutes = formData.duree_estime
    ? convertirDureeEnMinutes(formData.duree_estime)
    : 0;

  const getDifficulteLabel = (value: number) => {
    switch(value) {
      case 1: return 'Facile';
      case 2: return 'Moyen';
      case 3: return 'Difficile';
      default: return 'Non spécifiée';
    }
  };

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div className="space-y-2">
        <Label htmlFor="title">
          {contenuTextuel.create.form.huntTitle} <span className="text-red-500">*</span>
        </Label>
        {readOnly ? (
          <p className="text-sm pt-1">{formData.titre}</p>
        ) : (
          <Input
            id="titre"
            value={formData.titre || ""}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            placeholder={contenuTextuel.create.form.titlePlaceholder}
            required
            readOnly={readOnly}
          />
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          {contenuTextuel.create.form.description} <span className="text-red-500">*</span>
        </Label>
        {readOnly ? (
          <p className="text-sm pt-1 whitespace-pre-line">{formData.description}</p>
        ) : (
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={contenuTextuel.create.form.descriptionPlaceholder}
            rows={4}
            required
            readOnly={readOnly}
          />
        )}
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label>
          Image de la chasse <span className="text-red-500">*</span>
        </Label>
        
        {imageLoading ? (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Chargement de l'image...</p>
          </div>
        ) : imagePreview ? (
          <img
            src={imagePreview}
            alt="Aperçu de l'image"
            className="image-cropped"
          />
        ) : null}

        {!readOnly && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="image"
              className={`cursor-pointer bg-primary text-secondary-foreground px-4 py-2 rounded-md transition-colors ${
                imageLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
              }`}
            >
              {formData.image ? "Changer d'image" : "Sélectionner une image"}
            </label>
            
            {imageLoading ? (
              <span className="text-sm text-muted-foreground">Traitement en cours...</span>
            ) : (
              <span className="text-sm text-muted-foreground">
                {formData.image instanceof File 
                  ? formData.image.name 
                  : formData.image 
                    ? "Image existante" 
                    : "Aucune image sélectionnée"}
              </span>
            )}
          </div>
        )}

        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={imageLoading || readOnly}
        />
      </div>

      {/* Durée et Prix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">
            {contenuTextuel.create.form.duration} <span className="text-red-500">*</span>
          </Label>
          {readOnly ? (
            <p className="text-sm pt-1">{dureeEstimeeEnMinutes} minutes</p>
          ) : (
            <Input
              id="duree_estime"
              type="number"
              min={15}
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
              required
              readOnly={readOnly}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="prix">
            {contenuTextuel.create.form.price} <span className="text-red-500">*</span>
          </Label>
          {readOnly ? (
            <p className="text-sm pt-1">{formData.prix} €</p>
          ) : (
            <Input
              id="prix"
              type="number"
              min={0.01}
              step={0.01}
              value={formData.prix || 0}
              onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
              required
              readOnly={readOnly}
            />
          )}
        </div>
      </div>

      {/* Âge requis et Difficulté */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Age_requis">
            {contenuTextuel.create.form.age} <span className="text-red-500">*</span>
          </Label>
          {readOnly ? (
            <p className="text-sm pt-1">{formData.age_requis} ans</p>
          ) : (
            <Input
              id="age_requis"
              type="number"
              min={1}
              max={110}
              value={formData.age_requis || 15}
              onChange={(e) => setFormData({ ...formData, age_requis: parseFloat(e.target.value) })}
              required
              readOnly={readOnly}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Difficulté <span className="text-red-500">*</span>
          </Label>
          {readOnly ? (
            <p className="text-sm pt-1">
              {getDifficulteLabel(formData.difficulte || 0)}
            </p>
          ) : (
            <Select
              value={String(formData.difficulte || '')}
              onValueChange={(value) => setFormData({ 
                ...formData, 
                difficulte: parseInt(value) as 1 | 2 | 3 
              })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Facile</SelectItem>
                <SelectItem value="2">Moyen</SelectItem>
                <SelectItem value="3">Difficile</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Thème */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">
            {contenuTextuel.create.form.themeContent} <span className="text-red-500">*</span>
          </Label>
          {readOnly ? (
            <p className="text-sm pt-1">{formData.theme}</p>
          ) : (
            <Input
              id="theme"
              value={formData.theme || ""}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              placeholder={contenuTextuel.create.form.themePlaceholder}
              required
              readOnly={readOnly}
            />
          )}
        </div>
      </div>
    </div>
  );
}