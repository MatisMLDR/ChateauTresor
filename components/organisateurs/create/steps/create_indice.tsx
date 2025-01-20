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
  onSubmit: (indice: { type: "text" | "image" | "son"; contenu: string | File; degre_aide?: number; ordre?: number }) => void;
  indice?: IndiceType | null;
}

export function CreateIndice({ onClose, onSubmit, indice }: CreateIndiceProps) {
  const [type, setType] = useState<"text" | "image" | "son">(indice?.type || "text");
  const [content, setContent] = useState<string | File | null>(indice?.contenu || null);
  const [degre_aide, setAide] = useState(indice?.degre_aide || 1);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Détection automatique du type
    let detectedType: "image" | "son" | "text" = "text";
    if (file.type.startsWith("image/")) detectedType = "image";
    if (file.type.startsWith("audio/")) detectedType = "son";

    // Validation
    if (detectedType === "image" && type !== "image") {
      setError("Vous avez sélectionné une image alors que le type est défini sur son");
      return;
    }

    if (detectedType === "son" && type !== "son") {
      setError("Vous avez sélectionné un son alors que le type est défini sur image");
      return;
    }

    setType(detectedType);
    setContent(file);
    setError(null);
  };

  const handleSubmit = () => {
    if (!content) {
      setError("Veuillez fournir un contenu pour l'indice");
      return;
    }

    onSubmit({
      type,
      contenu: content,
      degre_aide,
      ordre: indice?.ordre
    });
    onClose();
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{indice ? "Modifier l'indice" : "Créer un indice"}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value: "text" | "image" | "son") => {
              setType(value);
              setContent(null);
              setError(null);
            }}
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
        </div>

        {type === "text" ? (
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={typeof content === "string" ? content : ""}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Entrez le contenu de l'indice..."
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="file">
              {type === "image" ? "Upload une image" : "Upload un son"}
              <span className="text-muted-foreground text-sm ml-2">
                ({type === "image" ? "JPEG, PNG, WEBP" : "MP3, WAV"})
              </span>
            </Label>
            <div className="flex flex-col gap-2">
              <Input
                id="file"
                type="file"
                accept={type === "image" ? "image/*" : "audio/*"}
                onChange={handleFileChange}
              />
              {content instanceof File && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  {content.name}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="degre_aide">Degré d'aide</Label>
          <Select
            value={degre_aide.toString()}
            onValueChange={(value) => setAide(parseInt(value))}
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
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Quitter
        </Button>
        <Button onClick={handleSubmit}>
          {indice ? "Enregistrer" : "Créer un indice"}
        </Button>
      </CardFooter>
    </Card>
  );
}