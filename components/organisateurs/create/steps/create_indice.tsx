"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { IndiceType } from "@/types"; // Assurez-vous que ce type est importé

interface CreateIndiceProps {
  onClose: () => void;
  onSubmit: (indice: {
    type: "text" | "image" | "son";
    contenu: string;
    degre_aide?: number;
    ordre?: number; // L'ordre est toujours présent dans l'interface, mais il n'est plus saisi manuellement
  }) => void;
  indice?: IndiceType | null; // Ajoutez cette prop
}

export function CreateIndice({ onClose, onSubmit, indice }: CreateIndiceProps) {
  const [type, setType] = useState<"text" | "image" | "son">(indice?.type || "text");
  const [content, setContent] = useState(indice?.contenu || "");
  const [degre_aide, setAide] = useState(indice?.degre_aide || 1);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (type === "image" && !selectedFile.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (type === "son" && !selectedFile.type.startsWith("audio/")) {
        alert("Please select an audio file");
        return;
      }
      setFile(selectedFile);
      setContent(selectedFile.name);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      type,
      contenu: type === "text" ? content : file?.name || "",
      degre_aide,
      ordre: indice?.ordre, // L'ordre est géré automatiquement, pas besoin de le saisir manuellement
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
            onValueChange={(value: "text" | "image" | "son") => setType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter clue content..."
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="file">Upload {type}</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="file"
                type="file"
                accept={type === "image" ? "image/*" : "audio/*"}
                onChange={handleFileChange}
              />
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  {file.name}
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