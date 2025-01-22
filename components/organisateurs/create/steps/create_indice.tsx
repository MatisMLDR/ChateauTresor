"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { IndiceType } from "@/types";

interface CreateIndiceProps {
  onClose: () => void;
  onSubmit: (indice: { 
    type: "text" | "image" | "son"; 
    contenu: string | File; 
    degre_aide?: number; 
    ordre?: number 
  }) => void;
  indice?: IndiceType | null;
  readOnly?: boolean;
}

export function CreateIndice({ onClose, onSubmit, indice, readOnly }: CreateIndiceProps) {
  const [type, setType] = useState<"text" | "image" | "son">(indice?.type || "text");
  const [content, setContent] = useState<string | File | null>(indice?.contenu || null);
  const [degre_aide, setAide] = useState(indice?.degre_aide || 1);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    if (type === "image" && !file.type.match(/image\/(jpeg|png|webp)/)) {
      setError("Format d'image non supporté (JPEG, PNG, WEBP seulement)");
      return;
    }
    
    if (type === "son" && !file.type.match(/audio\/(mpeg|wav)/)) {
      setError("Format audio non supporté (MP3, WAV seulement)");
      return;
    }

    setContent(file);
    setError(null);
  };

  const handleSubmit = () => {
    if (readOnly) return;

    // Validation finale avant soumission
    if (!content) {
      setError("Le contenu est obligatoire");
      return;
    }

    if (type === "text" && typeof content !== "string") {
      setError("Le contenu texte est invalide");
      return;
    }

    if ((type === "image" || type === "son") && !(content instanceof File)) {
      setError("Veuillez sélectionner un fichier valide");
      return;
    }

    // Préparation des données à envoyer
    const indiceData = {
      type,
      contenu: content,
      degre_aide,
      ordre: indice?.ordre // Garde l'ordre existant si modification
    };

    // Appel de la fonction parent
    onSubmit(indiceData);
    
    // Fermeture de la modale
    onClose();
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{indice ? "Modifier l'indice" : "Nouvel indice"}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">
            Type <span className="text-red-500">*</span>
          </Label>
          {readOnly ? (
            <p className="text-sm pt-1 capitalize">{type}</p>
          ) : (
            <Select
              value={type}
              onValueChange={(value: "text" | "image" | "son") => {
                setType(value);
                setContent(null); // Reset le contenu quand le type change
                setError(null);
              }}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texte</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="son">Son</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {type === "text" ? (
          <div className="space-y-2">
            <Label htmlFor="content">
              Contenu <span className="text-red-500">*</span>
            </Label>
            {readOnly ? (
              <p className="text-sm pt-1">{content instanceof File ? content.name : content}</p>
            ) : (
              <Textarea
                id="content"
                value={typeof content === "string" ? content : ""}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError(null);
                }}
                placeholder="Entrez le contenu de l'indice..."
                required
                readOnly={readOnly}
              />
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="file">
              {type === "image" ? "Fichier image" : "Fichier audio"} 
              <span className="text-red-500">*</span>
              <span className="text-muted-foreground text-sm ml-2">
                ({type === "image" ? "JPEG, PNG, WEBP" : "MP3, WAV"})
              </span>
            </Label>
            {readOnly ? (
              <p className="text-sm pt-1">
                {content instanceof File ? content.name : content}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  id="file"
                  type="file"
                  accept={type === "image" ? "image/*" : "audio/*"}
                  onChange={handleFileChange}
                  required
                  disabled={readOnly}
                />
                {content instanceof File && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    {content.name}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="degre_aide">
            Degré d'aide <span className="text-red-500">*</span>
          </Label>
          {readOnly ? (
            <p className="text-sm pt-1">{degre_aide}</p>
          ) : (
            <Select
              value={degre_aide.toString()}
              onValueChange={(value) => {
                setAide(parseInt(value));
                setError(null);
              }}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir le degré d'aide" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
      </CardContent>

      {!readOnly && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!content}>
            {indice ? "Sauvegarder" : "Créer l'indice"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}