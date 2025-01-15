"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, GripVertical, Pencil } from "lucide-react";
import { CreateIndice } from "./create_indice";
import { ChasseType, EnigmeType, IndiceType } from "@/types";
import { UUID } from "crypto";

export interface RiddlesCreationProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
}

function IndiceTriable({
  indice,
  index,
  mettreAJourIndice,
  supprimerIndice,
}: {
  indice: IndiceType;
  index: number;
  mettreAJourIndice: (index: number, champ: string, valeur: any) => void;
  supprimerIndice: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: indice.id_indice });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderContenuInput = () => {
    switch (indice.type) {
      case "image":
        return (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              mettreAJourIndice(
                index,
                "contenu",
                e.target.files ? e.target.files[0] : null
              )
            }
            className="pt-1"
          />
        );
      case "sound":
        return (
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              mettreAJourIndice(
                index,
                "contenu",
                e.target.files ? e.target.files[0] : null
              )
            }
            className="pt-1"
          />
        );
      default:
        return (
          <Input
            value={indice.contenu || ""}
            onChange={(e) => mettreAJourIndice(index, "contenu", e.target.value)}
            placeholder="Entrez le contenu texte"
          />
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-start gap-4 p-4 bg-muted rounded-lg mb-2"
    >
      <div {...listeners}>
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab" />
      </div>
      <div className="flex-1 space-y-2">
        <Select
          value={indice.type || "text"}
          onValueChange={(value: string) => mettreAJourIndice(index, "type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type d'indice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Texte</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="sound">Son</SelectItem>
          </SelectContent>
        </Select>
        {renderContenuInput()}
        <div className="flex items-center gap-2">
          <Label htmlFor={`degre-aide-${indice.id_indice}`} className="whitespace-nowrap">
            Degré d'aide
          </Label>
          <Input
            id={`degre-aide-${indice.id_indice}`}
            type="number"
            min="1"
            max="5"
            value={indice.degre_aide || 1}
            onChange={(e) =>
              mettreAJourIndice(index, "degre_aide", parseInt(e.target.value))
            }
            className="w-20"
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => supprimerIndice(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function EnigmeCompacte({ enigme, onSelectEnigme, onEditEnigme, onDeleteEnigme }: { enigme: EnigmeType; onSelectEnigme: (enigme: EnigmeType) => void; onEditEnigme: (enigme: EnigmeType) => void; onDeleteEnigme: (id_enigme: UUID) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: enigme.id_enigme || "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="cursor-pointer"
    >
      <Card onClick={() => onSelectEnigme(enigme)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div {...listeners} className="cursor-grab">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            {enigme.image_reponse && (
              <img
                src={enigme.image_reponse}
                alt={enigme.titre}
                className="h-16 w-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{enigme.titre}</h3>
              <p className="text-sm text-muted-foreground">{enigme.description}</p>
              <div className="text-sm text-muted-foreground">
                {enigme.indices?.length || 0} indices
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditEnigme(enigme);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (enigme.id_enigme) {
                  onDeleteEnigme(enigme.id_enigme);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RiddlesCreation({ formData, setFormData }: RiddlesCreationProps) {
  const [nouvelleEnigme, setNouvelleEnigme] = useState<Partial<EnigmeType>>({
    id_enigme: crypto.randomUUID() as UUID,
    titre: "",
    description: "",
    indices: [],
    endroit_qrcode: "",
    temps_max: 0,
    description_reponse: "",
    image_reponse: "",
    degre_difficulte: 1,
  });

  const [enigmeEnCoursEdition, setEnigmeEnCoursEdition] = useState<EnigmeType | null>(null);
  const [afficherModalIndice, setAfficherModalIndice] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const ajouterIndice = () => {
    setAfficherModalIndice(true);
  };

  const traiterSoumissionIndice = (indice: {
    type: "text" | "image" | "sound";
    contenu: string;
    degre_aide?: number;
  }) => {
    if (enigmeEnCoursEdition) {
      const updatedEnigme = {
        ...enigmeEnCoursEdition,
        indices: [
          ...(enigmeEnCoursEdition.indices || []),
          {
            id_indice: crypto.randomUUID(),
            type: indice.type,
            contenu: indice.contenu,
            degre_aide: indice.degre_aide || 1,
          },
        ],
      };
      setEnigmeEnCoursEdition(updatedEnigme);
    } else {
      setNouvelleEnigme((prevEnigme) => ({
        ...prevEnigme,
        indices: [
          ...(prevEnigme.indices || []),
          {
            id_indice: crypto.randomUUID(),
            type: indice.type,
            contenu: indice.contenu,
            degre_aide: indice.degre_aide || 1,
          },
        ],
      }));
    }
    setAfficherModalIndice(false);
  };

  const mettreAJourEnigme = (enigme: EnigmeType) => {
    const updatedEnigmes = formData.enigmes?.map((e) =>
      e.id_enigme === enigme.id_enigme ? enigme : e
    );
    setFormData({
      ...formData,
      enigmes: updatedEnigmes,
    });
  };

  const supprimerIndice = (index: number) => {
    if (enigmeEnCoursEdition) {
      const updatedEnigme = {
        ...enigmeEnCoursEdition,
        indices: enigmeEnCoursEdition.indices?.filter((_, i) => i !== index),
      };
      setEnigmeEnCoursEdition(updatedEnigme);
    } else {
      setNouvelleEnigme((prevEnigme) => ({
        ...prevEnigme,
        indices: prevEnigme.indices?.filter((_, i) => i !== index),
      }));
    }
  };

  const mettreAJourIndice = (index: number, champ: string, valeur: string) => {
    if (enigmeEnCoursEdition) {
      const updatedEnigme = {
        ...enigmeEnCoursEdition,
        indices: enigmeEnCoursEdition.indices?.map((indice, i) =>
          i === index ? { ...indice, [champ]: valeur } : indice
        ),
      };
      setEnigmeEnCoursEdition(updatedEnigme);
    } else {
      setNouvelleEnigme((prevEnigme) => ({
        ...prevEnigme,
        indices: prevEnigme.indices?.map((indice, i) =>
          i === index ? { ...indice, [champ]: valeur } : indice
        ),
      }));
    }
  };

  const ajouterEnigme = () => {
    if (nouvelleEnigme.titre && nouvelleEnigme.indices?.length) {
      const enigmeComplete = { ...nouvelleEnigme, id_enigme: crypto.randomUUID() } as EnigmeType;
      setFormData({
        ...formData,
        enigmes: [...(formData.enigmes || []), enigmeComplete],
      });
      setNouvelleEnigme({
        id_enigme: crypto.randomUUID() as UUID,
        titre: "",
        description: "",
        indices: [],
        endroit_qrcode: "",
        temps_max: 0,
        description_reponse: "",
        image_reponse: "",
        degre_difficulte: 1,
      });
    }
  };

  const supprimerEnigme = (id_enigme: UUID) => {
    setFormData({
      ...formData,
      enigmes: formData.enigmes?.filter((e) => e.id_enigme !== id_enigme),
    });
  };

  const handleDragEndEnigmes = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = formData.enigmes?.findIndex((e) => e.id_enigme === active.id);
      const newIndex = formData.enigmes?.findIndex((e) => e.id_enigme === over.id);

      if (oldIndex !== undefined && newIndex !== undefined) {
        const updatedEnigmes = arrayMove(formData.enigmes || [], oldIndex, newIndex);
        setFormData({ ...formData, enigmes: updatedEnigmes });
      }
    }
  };

  const handleDragEndIndices = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = (enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || []).findIndex(
        (indice) => indice.id_indice === active.id
      );
      const newIndex = (enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || []).findIndex(
        (indice) => indice.id_indice === over.id
      );

      if (oldIndex !== undefined && newIndex !== undefined) {
        const updatedIndices = arrayMove(
          enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || [],
          oldIndex,
          newIndex
        );

        if (enigmeEnCoursEdition) {
          setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, indices: updatedIndices });
        } else {
          setNouvelleEnigme({ ...nouvelleEnigme, indices: updatedIndices });
        }
      }
    }
  };

  const editerEnigme = (enigme: EnigmeType) => {
    setEnigmeEnCoursEdition(enigme);
  };

  return (
    <div className="space-y-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEndEnigmes}
      >
        {formData.enigmes && formData.enigmes.length > 0 && ( // Afficher uniquement si des énigmes existent
          <Card>
            <CardHeader>
              <CardTitle>Énigmes ajoutées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <SortableContext
                  items={formData.enigmes
                    ?.filter((enigme) => enigme.id_enigme !== undefined)
                    .map((enigme) => enigme.id_enigme as string) || []}
                  strategy={verticalListSortingStrategy}
                >
                  {formData.enigmes?.map((enigme, index) => (
                    <EnigmeCompacte
                      key={enigme.id_enigme}
                      enigme={enigme}
                      onSelectEnigme={setEnigmeEnCoursEdition}
                      onEditEnigme={editerEnigme}
                      onDeleteEnigme={supprimerEnigme}
                    />
                  ))}
                </SortableContext>
              </div>
            </CardContent>
          </Card>
        )}
      </DndContext>

      {/* Formulaire de création/modification */}
      <Card>
        <CardHeader>
          <CardTitle>
            {enigmeEnCoursEdition ? "Modifier l'énigme" : "Ajouter une nouvelle énigme"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre de l'énigme</Label>
            <Textarea
              id="titre"
              value={enigmeEnCoursEdition?.titre || nouvelleEnigme.titre || ""} // Toujours fournir une valeur par défaut
              onChange={(e) =>
                enigmeEnCoursEdition
                  ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, titre: e.target.value })
                  : setNouvelleEnigme({ ...nouvelleEnigme, titre: e.target.value })
              }
              placeholder="Entrez le titre de l'énigme"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Contenu de l'énigme</Label>
            <Textarea
              id="description"
              value={enigmeEnCoursEdition?.description || nouvelleEnigme.description || ""} // Toujours fournir une valeur par défaut
              onChange={(e) =>
                enigmeEnCoursEdition
                  ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, description: e.target.value })
                  : setNouvelleEnigme({ ...nouvelleEnigme, description: e.target.value })
              }
              placeholder="Entrez le contenu de l'énigme"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Indices</Label>
              <Button variant="outline" size="sm" onClick={ajouterIndice}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un indice
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndIndices}
            >
              <SortableContext
                items={
                  (enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || []).map(
                    (indice) => indice.id_indice
                  )
                }
                strategy={verticalListSortingStrategy}
              >
                {(enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || []).map(
                  (indice, index) => (
                    <IndiceTriable
                      key={indice.id_indice}
                      indice={indice}
                      index={index}
                      mettreAJourIndice={mettreAJourIndice}
                      supprimerIndice={supprimerIndice}
                    />
                  )
                )}
              </SortableContext>
            </DndContext>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endroit_qrcode">Endroit du QR Code</Label>
            <Input
              id="endroit_qrcode"
              value={enigmeEnCoursEdition?.endroit_qrcode || nouvelleEnigme.endroit_qrcode || ""} // Toujours fournir une valeur par défaut
              onChange={(e) =>
                enigmeEnCoursEdition
                  ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, endroit_qrcode: e.target.value })
                  : setNouvelleEnigme({ ...nouvelleEnigme, endroit_qrcode: e.target.value })
              }
              placeholder="Entrer la localisation exacte du QR Code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temps_max">
              Durée maximale pour résoudre l'énigme (en minutes)
            </Label>
            <Input
              id="temps_max"
              type="number"
              min={0}
              step={5}
              value={enigmeEnCoursEdition?.temps_max || nouvelleEnigme.temps_max || 0} // Toujours fournir une valeur par défaut
              onChange={(e) =>
                enigmeEnCoursEdition
                  ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, temps_max: parseInt(e.target.value) })
                  : setNouvelleEnigme({ ...nouvelleEnigme, temps_max: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_reponse">
              Description de la réponse de l'énigme
            </Label>
            <Textarea
              id="description_reponse"
              value={enigmeEnCoursEdition?.description_reponse || nouvelleEnigme.description_reponse || ""} // Toujours fournir une valeur par défaut
              onChange={(e) =>
                enigmeEnCoursEdition
                  ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, description_reponse: e.target.value })
                  : setNouvelleEnigme({ ...nouvelleEnigme, description_reponse: e.target.value })
              }
              placeholder="Entrez la description de la réponse de l'énigme"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_reponse">Image de la réponse</Label>
            <Input
              id="image_reponse"
              type="file"
              accept="image/*"
              onChange={(e) =>
                enigmeEnCoursEdition
                  ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, image_reponse: e.target.value })
                  : setNouvelleEnigme({ ...nouvelleEnigme, image_reponse: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="degre_difficulte">Degré de difficulté</Label>
            <Select
              value={
                (enigmeEnCoursEdition?.degre_difficulte || nouvelleEnigme.degre_difficulte || 1).toString()
              }
              onValueChange={(value: string) =>
                enigmeEnCoursEdition
                  ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, degre_difficulte: parseInt(value) })
                  : setNouvelleEnigme({ ...nouvelleEnigme, degre_difficulte: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le degré de difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Facile</SelectItem>
                <SelectItem value="2">Moyen</SelectItem>
                <SelectItem value="3">Difficile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            {enigmeEnCoursEdition && (
              <Button variant="outline" onClick={() => setEnigmeEnCoursEdition(null)}>
                Annuler
              </Button>
            )}
            <Button
              onClick={() => {
                if (enigmeEnCoursEdition) {
                  mettreAJourEnigme(enigmeEnCoursEdition); // Mettre à jour l'énigme dans formData
                  setEnigmeEnCoursEdition(null); // Réinitialiser l'énigme en cours d'édition
                } else {
                  ajouterEnigme(); // Ajouter une nouvelle énigme
                }
              }}
              disabled={
                (enigmeEnCoursEdition
                  ? !enigmeEnCoursEdition.titre || !enigmeEnCoursEdition.indices?.length
                  : !nouvelleEnigme.titre || !nouvelleEnigme.indices?.length)
              }
            >
              {enigmeEnCoursEdition ? "Enregistrer" : "Ajouter une énigme"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {afficherModalIndice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <CreateIndice
            onClose={() => setAfficherModalIndice(false)}
            onSubmit={traiterSoumissionIndice}
          />
        </div>
      )}
    </div>
  );
}