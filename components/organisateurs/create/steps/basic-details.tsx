"use client";

import { ChasseType } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contenuTextuel } from "@/constants";

/**
 * Ce code définit un composant React appelé BasicDetails qui fait partie d'un formulaire multi-étapes
 * pour créer une chasse au trésor. Le composant est responsable de la collecte des détails de base de
 * la chasse au trésor, tels que le titre, la description, la durée, le prix et le niveau de difficulté.
 */

// Définition des props pour le composant BasicDetails
interface BasicDetailsProps {
  formData: Partial<ChasseType>; // Les données actuelles du formulaire
  setFormData: (data: Partial<ChasseType>) => void; // Fonction pour mettre à jour les données du formulaire
}

// Définition du composant BasicDetails
export function BasicDetails({ formData, setFormData }: BasicDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Champ de saisie pour le titre */}
      <div className="space-y-2">
        <Label htmlFor="title">{contenuTextuel.create.form.huntTitle}</Label>
        <Input
          id="titre"
          value={formData.titre || ""}
          onChange={(e) =>
            setFormData({ ...formData, titre: e.target.value })
          }
          placeholder={contenuTextuel.create.form.titlePlaceholder}
        />
      </div>

      {/* Champ de saisie pour la description */}
      <div className="space-y-2">
        <Label htmlFor="description">{contenuTextuel.create.form.description}</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder={contenuTextuel.create.form.descriptionPlaceholder}
          rows={4}
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
            value={formData.duree_estime || 0}
            onChange={(e) =>
              setFormData({ ...formData, duree_estime: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, prix: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Sélecteur pour le niveau de difficulté */}
        <div className="space-y-2">
          <Label htmlFor="difficulte">{contenuTextuel.create.form.difficultyLevel}</Label>
            <Select
            value={formData.difficulte?.toString() || ""}
            onValueChange={(value: string) =>
              setFormData({ ...formData, difficulte: parseInt(value) })
            }
            >
            <SelectTrigger>
              <SelectValue placeholder={contenuTextuel.create.form.selectDifficulty} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{contenuTextuel.common.difficulty.easy}</SelectItem>
              <SelectItem value="2">{contenuTextuel.common.difficulty.medium}</SelectItem>
              <SelectItem value="3">{contenuTextuel.common.difficulty.hard}</SelectItem>
            </SelectContent>
            </Select>
        </div>


        <div className="space-y-2">
          <Label htmlFor="Age_requis">{contenuTextuel.create.form.age}</Label>
          <Input
            id="age_requis"
            type="number"
            min={0}
            max={110}
            value={formData.age_requis || 1}
            onChange={(e) =>
              setFormData({ ...formData, age_requis: parseFloat(e.target.value) })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, theme: e.target.value })
            }
            placeholder={contenuTextuel.create.form.themePlaceholder}
          />
        </div>
      </div>



</div>)
  ;

}