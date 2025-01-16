"use client";

import { useState } from "react";
import { useEffect } from "react";
import { ChasseType, EnigmeType, IndiceType } from '@/types';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CreateIndice } from "./create_indice";
import { contenuTextuel } from '@/constants';

/**
 * Ce code définit un composant React appelé RiddlesCreation qui gère la création et l'organisation
 * des énigmes dans un formulaire multi-étapes pour créer une chasse au trésor.
 */
interface RiddlesCreationProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
}

const generateRandomId = () => {
  return Math.floor(Math.random() * 1_000_000_000); // Génère un nombre entre 0 et 999_999_999
};

// Create a new SortableItem component
function SortableClue({ clue, index, updateClue, removeClue }: { clue: IndiceType, index: number, updateClue: (index: number, field: string, value: any) => void, removeClue: (index: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: clue.id_enigme });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };



  const renderContentInput = () => {
    switch (clue.type) {
      case 'image':
        return (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              updateClue(index, "content", e.target.files ? e.target.files[0] : null)
            }
            className="pt-1"
          />
        );
      case 'sound':
        return (
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              updateClue(index, "content", e.target.files ? e.target.files[0] : null)
            }
            className="pt-1"
          />
        );
      default:
        return (
          <Input
            value={clue.contenu}
            onChange={(e) =>
              updateClue(index, "contenu", e.target.value)
            }
            placeholder="Enter text content"
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
          value={clue.type}
          onValueChange={(value: string) =>
            updateClue(index, "type", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selectionner le type d'indice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="sound">Son</SelectItem>
          </SelectContent>
        </Select>
        {renderContentInput()}
        <div className="flex items-center gap-2">
          <Label htmlFor={`degre-aide-${clue.id_enigme}`} className="whitespace-nowrap">
            Degré d'aide
          </Label>
          <Input
            id={`degre-aide-${clue.id_enigme}`}
            type="number"
            min="1"
            max="5"
            value={clue.degre_aide || 1}
            onChange={(e) =>
              updateClue(index, "degre_aide", parseInt(e.target.value))
            }
            className="w-20"
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeClue(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Add SortableRiddle component
function SortableRiddle({ riddle, index, removeRiddle }: { riddle: EnigmeType, index: number, removeRiddle: (index: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: riddle.id_enigme });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Riddle {index + 1}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeRiddle(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{riddle.titre}</p>
          <div className="mt-4 space-y-2">
            {riddle.indices?.map((indice, i) => (
              <div key={`${indice.id}-${i}`} className="text-sm text-muted-foreground">
                <span>Clue {i + 1}:</span>
                <span className="ml-2">{indice.contenu}</span>
                <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">
                Aide niveau {indice.degre_aide || 1}
                </span>
              </div>
            ))}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RiddlesCreation({ formData, setFormData }: RiddlesCreationProps) {
  const [newRiddle, setNewRiddle] = useState<Partial<EnigmeType>>({
    indices: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add new state for modal
  const [showClueModal, setShowClueModal] = useState(false);

  // Update addClue function
  const addClue = () => {
    setShowClueModal(true);
  };

  // Add handler for new clue submission
  const handleClueSubmit = (clue: {
    type: "text" | "image" | "sound";
    content: string;
    degre_aide?: number;
    order?: number;
  }) => {
    setNewRiddle({
      ...newRiddle,
      indices: [
        ...(newRiddle.indices || []),
        {
          id: generateRandomId(),
          type: clue.type,
          content: clue.content,
          degre_aide: clue.degre_aide || 1,
        },
      ],
    });
  };

  const removeClue = (index: number) => {
    setNewRiddle({
      ...newRiddle,
      indices: newRiddle.indices?.filter((_, i) => i !== index),
    });
  };

  const updateClue = (index: number, field: string, value: string) => {
    setNewRiddle({
      ...newRiddle,
      indices: newRiddle.indices?.map((clue, i) =>
        i === index ? { ...clue, [field]: value } : clue
      ),
    });
  };

  const addRiddle = () => {
    if (newRiddle.titre && newRiddle.indices?.length) {
      setFormData({
        ...formData,
        enigmes: [
          ...(formData.enigmes || []),
          { ...newRiddle, id: generateRandomId() } as EnigmeType,
        ],
      });
      setNewRiddle({ indices: [] });
    }
  };

  const removeRiddle = (index: number) => {
    setFormData({
      ...formData,
      enigmes: formData.enigmes?.filter((_, i) => i !== index),
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = newRiddle.indices?.findIndex((clue) => clue.id_indice === active.id);
      const newIndex = newRiddle.indices?.findIndex((clue) => clue.id_indice === over.id);

      if (oldIndex !== undefined && newIndex !== undefined) {
        const newClues = arrayMove(newRiddle.indices!, oldIndex, newIndex);
        setNewRiddle({ ...newRiddle, indices: newClues });
      }
    }
  };

  const handleRiddleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = formData.enigmes?.findIndex((r) => r.id_enigme === active.id);
      const newIndex = formData.enigmes?.findIndex((r) => r.id_enigme === over.id);

      if (oldIndex !== undefined && newIndex !== undefined) {
        setFormData({
          ...formData,
          enigmes: arrayMove(formData.enigmes || [], oldIndex, newIndex),
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleRiddleDragEnd}
      >
        <SortableContext
        key={newRiddle.id_enigme}
          items={formData.enigmes?.map((riddle) => riddle.id_enigme) || []}
          strategy={verticalListSortingStrategy}
        >
          {formData.enigmes?.map((riddle, index) => (
            <SortableRiddle
              key={riddle.id_enigme} // Add unique key prop
              riddle={riddle}
              index={index}
              removeRiddle={removeRiddle}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Formulaire de création d'une nouvelle énigme */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Riddle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Titre de l'énigme */}
          <div className="space-y-2">
            <Label htmlFor="titre">Titre de l'énigme</Label>
            <Textarea
              id="titre"
              value={newRiddle.titre ?? ''}
              onChange={(e) => setNewRiddle({ ...newRiddle, titre: e.target.value })}
              placeholder="Entrez le titre de l'énigme"
            />
          </div>

          {/* Description de l'énigme (la question) */}
          <div className="space-y-2">
            <Label htmlFor="description">Contenu de l'énigme</Label>
            <Textarea
              id="description"
              value={newRiddle.description ?? ''}
              onChange={(e) => setNewRiddle({ ...newRiddle, description: e.target.value })}
              placeholder="Entrez le contenu de l'énigme"
            />
          </div>

          {/* Div des indices  */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Clues</Label>
              <Button variant="outline" size="sm" onClick={addClue}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un indice
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                key={newRiddle.id_enigme}
                items={newRiddle.indices?.map((clue) => clue.id_indice) || []}
                strategy={verticalListSortingStrategy}
              >
                {newRiddle.indices?.map((clue, index) => (
                  <SortableClue
                    key={clue.id_indice} // Add unique key prop
                    clue={clue}
                    index={index}
                    updateClue={updateClue}
                    removeClue={removeClue}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Endroit du QR Code */}
          <div className="space-y-2">
            <Label htmlFor="endroit_qrcode">Endroit du QR Code</Label>
            <Input
              id="endroit_qrcode"
              value={newRiddle.endroit_qrcode ?? ''}
              onChange={(e) => setNewRiddle({ ...newRiddle, endroit_qrcode: e.target.value })}
              placeholder="Entrer la localisation exacte du QR Code"
            />
          </div>

          {/* Temps Max estimé de l'énigme */}
          <div className="space-y-2">
            <Label htmlFor="temps_max"> Durée maximale pour résoudre l'énigme (en minute) </Label>
            <Input
              id="temps_max"
              type="number"
              min={0}
              step={5}
              value={newRiddle.temps_max ?? 0}
              onChange={(e) => setNewRiddle({ ...newRiddle, temps_max: parseInt(e.target.value) })}
            />
          </div>

          {/* description_reponse */}
          <div className="space-y-2">
            <Label htmlFor="description_reponse">Description de la réponse de l'énigme</Label>
            <Textarea
              id="description_reponse"
              value={newRiddle.description_reponse ?? ''}
              onChange={(e) => setNewRiddle({ ...newRiddle, description_reponse: e.target.value })}
              placeholder="Entrez la description de la réponse de l'énigme"
            />
          </div>

          {/* image_reponse */}
          <div className="space-y-2">
            <Label htmlFor="image_reponse">Image de la réponse</Label>
            <Input
              id="image_reponse"
              type="file"
              value={newRiddle.image_reponse ?? ''}
              onChange={(e) => setNewRiddle({ ...newRiddle, image_reponse: e.target.value })}
              placeholder="Entrez la description de la réponse de l'énigme"
            />
          </div>

          {/* Bouton pour ajouter une énigme */}
          <Button onClick={addRiddle} disabled={!newRiddle.titre || !newRiddle.indices?.length}>
            Ajouter une énigme
          </Button>
        </CardContent>
      </Card>

      {/* Ajouter un indice via le component de création d'indice */}
      {showClueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <CreateIndice
            onClose={() => setShowClueModal(false)}
            onSubmit={(clue) => {
              handleClueSubmit({
                ...clue,
                content: clue.contenu,
              });
              setShowClueModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}