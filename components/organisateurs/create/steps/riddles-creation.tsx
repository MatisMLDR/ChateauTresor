"use client";

import { useEffect, useState } from "react";
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
import { parseISO, differenceInSeconds } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RiddlesCreationProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
  onValidityChange: (isValid: boolean) => void;
  readOnly?: boolean;
}

function secondsToTimeString(totalSeconds: number): string {
  if (isNaN(totalSeconds)) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function timeStringToSeconds(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return (hours * 3600) + (minutes * 60);
}

function parseDateTime(dateStr: string | undefined, timeStr: string | undefined): Date | null {
  if (!dateStr || !timeStr) return null;
  
  try {
    const date = parseISO(dateStr);
    const [hours, mins] = timeStr.split(':').map(Number);
    date.setHours(hours, mins, 0, 0);
    return date;
  } catch (error) {
    console.error("Erreur de parsing date/heure:", error);
    return null;
  }
}

function IndiceCompacte({
  indice,
  onEditIndice,
  onDeleteIndice,
  readOnly,
}: {
  indice: IndiceType;
  onEditIndice: (indice: IndiceType) => void;
  onDeleteIndice: (id_indice: UUID) => void;
  readOnly?: boolean;
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

  const renderContenu = () => {
    if (indice.type === 'text') {
      return (
        <div className="text-sm">
          {typeof indice.contenu === 'string' ? indice.contenu : ''}
        </div>
      );
    }
    
    if (indice.type === 'image') {
      const url = indice.contenu instanceof File 
        ? URL.createObjectURL(indice.contenu)
        : indice.contenu as string;
        
      return (
        <img
          src={url}
          alt="Indice visuel"
          className="image-cropped"
        />
      );
    }

    if (indice.type === 'son') {
      const url = indice.contenu instanceof File
        ? URL.createObjectURL(indice.contenu)
        : indice.contenu as string;

      return (
        <audio controls className="w-full">
          <source src={url} type="audio/mpeg" />
          Votre navigateur ne supporte pas l'audio
        </audio>
      );
    }

    return null;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {!readOnly && (
              <div {...listeners} className="cursor-grab">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
            )}

            <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
              <span className="text-sm font-medium">{indice.ordre}</span>
            </div>

            <div className="flex-1 space-y-2">
              {renderContenu()}
              <div className="text-xs text-muted-foreground">
                Degré d'aide : {indice.degre_aide}
              </div>
            </div>

            {!readOnly && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditIndice(indice);
                  }}
                  disabled={readOnly}
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
                  disabled={readOnly}
                >
                  <Trash2 className="h-4 w-4 hover:text-red-500" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EnigmeCompacte({ 
  enigme, 
  onSelectEnigme, 
  onEditEnigme, 
  onDeleteEnigme, 
  isActive, 
  readOnly 
}: { 
  enigme: EnigmeType; 
  onSelectEnigme: (enigme: EnigmeType) => void;
  onEditEnigme: (enigme: EnigmeType) => void;
  onDeleteEnigme: (id_enigme: UUID) => void;
  isActive: boolean;
  readOnly?: boolean;
}) {
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
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card 
        className={`${isActive ? "ring-2 ring-primary" : ""} ${!readOnly ? "cursor-pointer" : ""}`}
        onClick={!readOnly ? () => onSelectEnigme(enigme) : undefined}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {!readOnly && (
              <div {...listeners} className="cursor-grab">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
              <span className="text-sm font-medium">{enigme.ordre}</span>
            </div>
            {enigme.image_reponse && (
              <img
                src={enigme.image_reponse instanceof File ? 
                      URL.createObjectURL(enigme.image_reponse) : 
                      enigme.image_reponse}
                alt={enigme.titre}
                className="image-cropped"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{enigme.titre}</h3>
              <p className="text-sm text-muted-foreground">{enigme.description}</p>
              <div className="text-sm text-muted-foreground">
                {enigme.indices?.length || 0} indices
              </div>
              <div className="text-xs text-muted-foreground">
                Durée moyenne: {secondsToTimeString(enigme.temps_max)}
              </div>
            </div>
            {!readOnly && (
              <>
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
                    onDeleteEnigme(enigme.id_enigme as UUID);
                  }}
                  disabled={isActive}
                >
                  <Trash2 className="h-4 w-4 hover:text-red-500" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RiddlesCreation({ formData, setFormData, onValidityChange, readOnly }: RiddlesCreationProps) {
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
  const [erreurDuree, setErreurDuree] = useState<string | null>(null);
  const [enigmeToDelete, setEnigmeToDelete] = useState<UUID | null>(null);
  const [indiceToDelete, setIndiceToDelete] = useState<UUID | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor)
  );

  const isEnigmeValide = () => {
    const currentEnigme = enigmeEnCoursEdition || nouvelleEnigme;
    return Boolean(
      currentEnigme.titre?.trim() &&
      currentEnigme.description?.trim() &&
      currentEnigme.indices?.length &&
      currentEnigme.endroit_qrcode?.trim() &&
      currentEnigme.temps_max &&
      currentEnigme.description_reponse?.trim() &&
      currentEnigme.image_reponse &&
      currentEnigme.degre_difficulte &&
      !erreurDuree
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      if (enigmeEnCoursEdition) {
        setEnigmeEnCoursEdition({ 
          ...enigmeEnCoursEdition, 
          image_reponse: file 
        });
      } else {
        setNouvelleEnigme({ 
          ...nouvelleEnigme, 
          image_reponse: file 
        });
      }
    }
  };

  const ajouterIndice = () => setAfficherModalIndice(true);

  const traiterSoumissionIndice = (indice: {
    type: "text" | "image" | "son";
    contenu: string | File;
    degre_aide?: number;
  }) => {
    if (readOnly) return;
    
    const currentIndices = enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || [];
    const nouvelOrdre = indiceEnCoursEdition 
      ? indiceEnCoursEdition.ordre 
      : currentIndices.length + 1;
  
    const newIndice = {
      ...indiceEnCoursEdition,
      ...indice,
      id_indice: indiceEnCoursEdition?.id_indice || crypto.randomUUID() as UUID,
      id_enigme: enigmeEnCoursEdition?.id_enigme || nouvelleEnigme.id_enigme || (crypto.randomUUID() as UUID),
      ordre: nouvelOrdre,
      degre_aide: indice.degre_aide ?? 1,
    };
  
    if (enigmeEnCoursEdition) {
      const updatedIndices = indiceEnCoursEdition 
        ? enigmeEnCoursEdition.indices?.map(i => i.id_indice === newIndice.id_indice ? newIndice : i)
        : [...(enigmeEnCoursEdition.indices || []), newIndice];
      
      setEnigmeEnCoursEdition({
        ...enigmeEnCoursEdition,
        indices: updatedIndices,
      });
    } else {
      const updatedIndices = indiceEnCoursEdition 
        ? nouvelleEnigme.indices?.map(i => i.id_indice === newIndice.id_indice ? newIndice : i)
        : [...(nouvelleEnigme.indices || []), newIndice];
      
      setNouvelleEnigme({
        ...nouvelleEnigme,
        indices: updatedIndices,
      });
    }
  
    setIndiceEnCoursEdition(null);
    setAfficherModalIndice(false);
  };

  const mettreAJourEnigme = (enigme: EnigmeType) => {
    if (readOnly) return;
    const updatedEnigmes = formData.enigmes?.map(e => 
      e.id_enigme === enigme.id_enigme ? enigme : e
    ) || [];
    setFormData({ ...formData, enigmes: updatedEnigmes });
  };

  const supprimerIndice = (id_indice: UUID) => {
    if (readOnly) return;
    if (enigmeEnCoursEdition) {
      const updatedIndices = enigmeEnCoursEdition.indices?.filter(i => i.id_indice !== id_indice);
      setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, indices: updatedIndices });
    } else {
      const updatedIndices = nouvelleEnigme.indices?.filter(i => i.id_indice !== id_indice);
      setNouvelleEnigme({ ...nouvelleEnigme, indices: updatedIndices });
    }
    setIndiceToDelete(null);
  };

  const ajouterEnigme = () => {
    if (readOnly || !isEnigmeValide()) return;
    
    const enigmeComplete = {
      ...nouvelleEnigme,
      ordre: (formData.enigmes?.length || 0) + 1,
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
  };

  const supprimerEnigme = (id_enigme: UUID) => {
    if (readOnly) return;
    const updatedEnigmes = formData.enigmes?.filter(e => e.id_enigme !== id_enigme) || [];
    setFormData({
      ...formData,
      enigmes: updatedEnigmes.map((e, index) => ({ ...e, ordre: index + 1 })),
    });
    setEnigmeToDelete(null);
  };

  const handleDragEndEnigmes = (event: any) => {
    if (readOnly) return;
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = formData.enigmes?.findIndex(e => e.id_enigme === active.id);
      const newIndex = formData.enigmes?.findIndex(e => e.id_enigme === over.id);
      
      if (oldIndex !== undefined && newIndex !== undefined) {
        const updatedEnigmes = arrayMove(formData.enigmes || [], oldIndex, newIndex);
        setFormData({
          ...formData,
          enigmes: updatedEnigmes.map((e, index) => ({ ...e, ordre: index + 1 })),
        });
      }
    }
  };

  const handleDragEndIndices = (event: any) => {
    if (readOnly) return;
    const { active, over } = event;
    if (active.id !== over?.id) {
      const indices = enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || [];
      const oldIndex = indices.findIndex(i => i.id_indice === active.id);
      const newIndex = indices.findIndex(i => i.id_indice === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedIndices = arrayMove(indices, oldIndex, newIndex)
          .map((indice, index) => ({ ...indice, ordre: index + 1 }));

        if (enigmeEnCoursEdition) {
          setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, indices: updatedIndices });
        } else {
          setNouvelleEnigme({ ...nouvelleEnigme, indices: updatedIndices });
        }
      }
    }
  };

  const handleTempsMaxChange = (timeString: string) => {
    if (readOnly) return;
    const selectedSeconds = timeStringToSeconds(timeString);
    
    const startDateTime = parseDateTime(formData.date_debut ?? undefined, formData.horaire_debut ?? undefined);
    const endDateTime = parseDateTime(formData.date_fin ?? undefined, formData.horaire_fin ?? undefined);
    
    let error = null;
    
    if (!startDateTime || !endDateTime) {
      error = "Définissez d'abord les dates globales";
    } else {
      const totalSeconds = differenceInSeconds(endDateTime, startDateTime);
      
      if (totalSeconds <= 0) {
        error = "La fin doit être après le début";
      } else if (selectedSeconds > totalSeconds) {
        error = `Durée moyenne: ${secondsToTimeString(totalSeconds)}`;
      }
    }

    setErreurDuree(error);
    
    if (!error) {
      if (enigmeEnCoursEdition) {
        setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, temps_max: selectedSeconds });
      } else {
        setNouvelleEnigme({ ...nouvelleEnigme, temps_max: selectedSeconds });
      }
    }
  };

  useEffect(() => {
    const isValid = !!(formData.enigmes && formData.enigmes.length > 0);
    onValidityChange(isValid);
  }, [formData.enigmes, onValidityChange]);

  return (
    <div className="space-y-8">
      <DndContext 
        sensors={readOnly ? undefined : sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={readOnly ? undefined : handleDragEndEnigmes}
      >
        {formData.enigmes && formData.enigmes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Énigmes {!readOnly && "ajoutées"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <SortableContext
                  items={formData.enigmes.map(e => e.id_enigme as string)}
                  strategy={verticalListSortingStrategy}
                >
                  {formData.enigmes.map((enigme) => (
                    <EnigmeCompacte
                      key={enigme.id_enigme}
                      enigme={enigme}
                      onSelectEnigme={setEnigmeEnCoursEdition}
                      onEditEnigme={setEnigmeEnCoursEdition}
                      onDeleteEnigme={(id) => setEnigmeToDelete(id)}
                      isActive={enigme.id_enigme === enigmeEnCoursEdition?.id_enigme}
                      readOnly={readOnly}
                    />
                  ))}
                </SortableContext>
              </div>
            </CardContent>
          </Card>
        )}
      </DndContext>

      {!readOnly ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {enigmeEnCoursEdition ? "Modifier l'énigme" : "Ajouter une nouvelle énigme"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titre">
                Titre de l'énigme <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="titre"
                value={enigmeEnCoursEdition?.titre || nouvelleEnigme.titre || ""}
                onChange={(e) =>
                  enigmeEnCoursEdition
                    ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, titre: e.target.value })
                    : setNouvelleEnigme({ ...nouvelleEnigme, titre: e.target.value })
                }
                placeholder="Entrez le titre de l'énigme"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Contenu de l'énigme <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={enigmeEnCoursEdition?.description || nouvelleEnigme.description || ""}
                onChange={(e) =>
                  enigmeEnCoursEdition
                    ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, description: e.target.value })
                    : setNouvelleEnigme({ ...nouvelleEnigme, description: e.target.value })
                }
                placeholder="Entrez le contenu de l'énigme"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  Indices <span className="text-red-500">*</span>
                </Label>
                <Button variant="outline" size="sm" onClick={ajouterIndice}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un indice
                </Button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndIndices}>
                <SortableContext
                  items={(enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || []).map(i => i.id_indice)}
                  strategy={verticalListSortingStrategy}
                >
                  {(enigmeEnCoursEdition?.indices || nouvelleEnigme.indices || []).map((indice) => (
                    <IndiceCompacte
                      key={indice.id_indice}
                      indice={indice}
                      onEditIndice={(indice) => {
                        setIndiceEnCoursEdition(indice);
                        setAfficherModalIndice(true);
                      }}
                      onDeleteIndice={(id) => setIndiceToDelete(id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endroit_qrcode">
                Endroit du QR Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endroit_qrcode"
                value={enigmeEnCoursEdition?.endroit_qrcode || nouvelleEnigme.endroit_qrcode || ""}
                onChange={(e) =>
                  enigmeEnCoursEdition
                    ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, endroit_qrcode: e.target.value })
                    : setNouvelleEnigme({ ...nouvelleEnigme, endroit_qrcode: e.target.value })
                }
                placeholder="Entrer la localisation exacte du QR Code"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temps_max">
                Durée moyenne <span className="text-red-500">*</span>
              </Label>
              <Input
                id="temps_max"
                type="time"
                step="60"
                value={secondsToTimeString(
                  enigmeEnCoursEdition?.temps_max ?? nouvelleEnigme.temps_max ?? 0
                )}
                onChange={(e) => handleTempsMaxChange(e.target.value)}
                required
              />
              {erreurDuree && (
                <p className="text-red-500 text-sm mt-1">{erreurDuree}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_reponse">
                Description de la réponse <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description_reponse"
                value={enigmeEnCoursEdition?.description_reponse || nouvelleEnigme.description_reponse || ""}
                onChange={(e) =>
                  enigmeEnCoursEdition
                    ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, description_reponse: e.target.value })
                    : setNouvelleEnigme({ ...nouvelleEnigme, description_reponse: e.target.value })
                }
                placeholder="Entrez la description de la réponse"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_reponse">
                Image de la réponse <span className="text-red-500">*</span>
              </Label>
              {(enigmeEnCoursEdition?.image_reponse || nouvelleEnigme.image_reponse) && (
                <img 
                  src={
                    enigmeEnCoursEdition?.image_reponse instanceof File ? 
                    URL.createObjectURL(enigmeEnCoursEdition.image_reponse) : 
                    nouvelleEnigme.image_reponse instanceof File ?
                    URL.createObjectURL(nouvelleEnigme.image_reponse) :
                    enigmeEnCoursEdition?.image_reponse || nouvelleEnigme.image_reponse
                  }
                  className="h-32 w-32 object-cover mb-2 rounded-lg"
                  alt="Prévisualisation"
                />
              )}
              <Input
                id="image_reponse"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degre_difficulte">
                Difficulté <span className="text-red-500">*</span>
              </Label>
              <Select
                value={(enigmeEnCoursEdition?.degre_difficulte || nouvelleEnigme.degre_difficulte || 1).toString()}
                onValueChange={(value) =>
                  enigmeEnCoursEdition
                    ? setEnigmeEnCoursEdition({ ...enigmeEnCoursEdition, degre_difficulte: parseInt(value) })
                    : setNouvelleEnigme({ ...nouvelleEnigme, degre_difficulte: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la difficulté" />
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
                    mettreAJourEnigme(enigmeEnCoursEdition);
                    setEnigmeEnCoursEdition(null);
                  } else {
                    ajouterEnigme();
                  }
                }}
                disabled={!isEnigmeValide()}
              >
                {enigmeEnCoursEdition ? "Enregistrer" : "Ajouter une énigme"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Détails des énigmes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.enigmes?.map((enigme) => (
              <Card key={enigme.id_enigme} className="mb-4">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold">{enigme.titre}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{enigme.description}</p>
                  <div className="text-sm text-muted-foreground">
                    Localisation QR Code: {enigme.endroit_qrcode}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Durée moyenne: {secondsToTimeString(enigme.temps_max)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Difficulté: {enigme.degre_difficulte}/3
                  </div>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Indices associés:</h4>
                    {enigme.indices?.map((indice) => (
                      <Card key={indice.id_indice} className="p-2">
                        <div className="text-sm">
                          <span className="font-medium">Type:</span> {indice.type}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Degré d'aide:</span> {indice.degre_aide}
                        </div>
                        {indice.type === 'text' && (
                          <div className="text-sm text-muted-foreground">
                            {typeof indice.contenu === 'string' ? indice.contenu : ''}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {afficherModalIndice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <CreateIndice
            onClose={() => {
              setAfficherModalIndice(false);
              setIndiceEnCoursEdition(null);
            }}
            onSubmit={traiterSoumissionIndice}
            indice={indiceEnCoursEdition}
            readOnly={readOnly}
          />
        </div>
      )}

      <AlertDialog open={!!enigmeToDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette énigme ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEnigmeToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => supprimerEnigme(enigmeToDelete!)}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!indiceToDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet indice ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIndiceToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => supprimerIndice(indiceToDelete!)}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}