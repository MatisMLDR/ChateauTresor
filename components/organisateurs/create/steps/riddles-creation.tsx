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
import { contenuTextuel } from '@/constants';
import { ChasseType, EnigmeType, IndiceType } from "@/types";
import { UUID } from "crypto";

export interface RiddlesCreationProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
}

function IndiceCompacte({
  indice,
  onEditIndice,
  onDeleteIndice,
}: {
  indice: IndiceType;
  onEditIndice: (indice: IndiceType) => void;
  onDeleteIndice: (id_indice: UUID) => void;
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="cursor-pointer"
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div {...listeners} className="cursor-grab">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{indice.type}</h3>
              <p className="text-sm text-muted-foreground">{indice.contenu}</p>
              <div className="text-sm text-muted-foreground">
                Degré d'aide: {indice.degre_aide}
              </div>
              <div className="text-sm text-muted-foreground">
                Ordre: {indice.ordre} {/* Affichage de l'ordre */}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditIndice(indice);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteIndice(indice.id_indice);
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

  // Affiche directement l'ordre stocké (qui commence à 1)
  const ordre = enigme.ordre || 0;

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
            <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
              <span className="text-sm font-medium">{ordre}</span> {/* Affiche l'ordre stocké */}
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
  const [indiceEnCoursEdition, setIndiceEnCoursEdition] = useState<IndiceType | null>(null);
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
    type: "text" | "image" | "son";
    contenu: string;
    degre_aide?: number;
  }) => {
    if (indiceEnCoursEdition) {
      const updatedIndices = (enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || []).map((i) =>
        i.id_indice === indiceEnCoursEdition.id_indice ? { ...i, ...indice } : i
      );

      if (enigmeEnCoursEdition) {
        setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, indices: updatedIndices });
      } else {
        setNouvelleEnigme({ ...nouvelleEnigme, indices: updatedIndices });
      }
    } else {
      const newIndice = {
        id_indice: crypto.randomUUID(),
        type: indice.type,
        contenu: indice.contenu,
        degre_aide: indice.degre_aide || 1,
        ordre: (enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || []).length + 1, // Commence à 1
      };

      if (enigmeEnCoursEdition) {
        setEnigmeEnCoursEdition({
          ...enigmeEnCoursEdition,
          indices: [...(enigmeEnCoursEdition.indices || []), newIndice],
        });
      } else {
        setNouvelleEnigme({
          ...nouvelleEnigme,
          indices: [...(nouvelleEnigme.indices || []), newIndice],
        });
      }
    }
    setIndiceEnCoursEdition(null);
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

  const supprimerIndice = (id_indice: UUID) => {
    if (enigmeEnCoursEdition) {
      const updatedEnigme = {
        ...enigmeEnCoursEdition,
        indices: enigmeEnCoursEdition.indices?.filter((i) => i.id_indice !== id_indice),
      };
      setEnigmeEnCoursEdition(updatedEnigme);
    } else {
      setNouvelleEnigme((prevEnigme) => ({
        ...prevEnigme,
        indices: prevEnigme.indices?.filter((i) => i.id_indice !== id_indice),
      }));
    }
  };

  const editerIndice = (indice: IndiceType) => {
    setIndiceEnCoursEdition(indice);
    setAfficherModalIndice(true);
  };

  const ajouterEnigme = () => {
    if (nouvelleEnigme.titre && nouvelleEnigme.indices?.length) {
      const enigmeComplete = {
        ...nouvelleEnigme,
        id_enigme: crypto.randomUUID(),
        ordre: (formData.enigmes?.length || 0) + 1, // Commence à 1
      } as EnigmeType;

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
    const updatedEnigmes = formData.enigmes?.filter((e) => e.id_enigme !== id_enigme) || [];
    setFormData({
      ...formData,
      enigmes: updatedEnigmes.map((enigme, index) => ({
        ...enigme,
        ordre: index + 1, // Commence à 1
      })),
    });
  };

  const handleDragEndEnigmes = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = formData.enigmes?.findIndex((e) => e.id_enigme === active.id);
      const newIndex = formData.enigmes?.findIndex((e) => e.id_enigme === over.id);

      if (oldIndex !== undefined && newIndex !== undefined) {
        const updatedEnigmes = arrayMove(formData.enigmes || [], oldIndex, newIndex);
        setFormData({
          ...formData,
          enigmes: updatedEnigmes.map((enigme, index) => ({
            ...enigme,
            ordre: index + 1, // Commence à 1
          })),
        });
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

        // Réorganiser l'ordre des indices après déplacement
        const reorderedIndices = updatedIndices.map((indice, index) => ({
          ...indice,
          ordre: index + 1, // Commence à 1
        }));

        if (enigmeEnCoursEdition) {
          setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, indices: reorderedIndices });
        } else {
          setNouvelleEnigme({ ...nouvelleEnigme, indices: reorderedIndices });
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
                    <IndiceCompacte
                      key={indice.id_indice}
                      indice={indice}
                      onEditIndice={editerIndice}
                      onDeleteIndice={supprimerIndice}
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
            indice={indiceEnCoursEdition} // Cette prop est maintenant acceptée
          />
        </div>
      )}
    </div>
  );
}