// Fenetre Pop Up pour créer un indice et renvoie les paramètres de l'indice dans le riddle-creation.tsx
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

interface CreateIndiceProps {
  onClose: () => void;
  onSubmit: (indice: {
    type: "text" | "image" | "sound";
    content: string;
    difficulty?: number;
    order?: number;
  }) => void;
}

export function CreateIndice({ onClose, onSubmit }: CreateIndiceProps) {
  const [type, setType] = useState<"text" | "image" | "sound">("text");
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (type === "image" && !selectedFile.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (type === "sound" && !selectedFile.type.startsWith("audio/")) {
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
      content: type === "text" ? content : file?.name || "",
      difficulty,
    });
    onClose();
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create New Clue</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value: "text" | "image" | "sound") => setType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="sound">Sound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "text" ? (
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
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
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={difficulty.toString()}
            onValueChange={(value) => setDifficulty(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
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
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create Clue</Button>
      </CardFooter>
    </Card>
  );
}