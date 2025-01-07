"use client";

import { TreasureHunt } from "@/types";
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
import { translations } from "@/lib/contenuCreationChasse";

interface BasicDetailsProps {
  formData: Partial<TreasureHunt>;
  setFormData: (data: Partial<TreasureHunt>) => void;
}

export function BasicDetails({ formData, setFormData }: BasicDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">{translations.create.form.huntTitle}</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder={translations.create.form.titlePlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{translations.create.form.description}</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder={translations.create.form.descriptionPlaceholder}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">{translations.create.form.duration}</Label>
          <Input
            id="duration"
            type="number"
            min={30}
            max={180}
            value={formData.duration || ""}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{translations.create.form.price}</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={0.01}
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">{translations.create.form.difficultyLevel}</Label>
        <Select
          value={formData.difficulty}
          onValueChange={(value: "easy" | "medium" | "hard") =>
            setFormData({ ...formData, difficulty: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={translations.create.form.selectDifficulty} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">{translations.common.difficulty.easy}</SelectItem>
            <SelectItem value="medium">{translations.common.difficulty.medium}</SelectItem>
            <SelectItem value="hard">{translations.common.difficulty.hard}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}