"use client";

import { useState } from "react";
import { useEffect } from "react";
import { TreasureHunt, Riddle, ClueType } from "@/types";
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
import { contenuTextuel } from '@/lib/contenuCreationChasse';

/**
 * Ce code définit un composant React appelé RiddlesCreation qui gère la création et l'organisation
 * des énigmes dans un formulaire multi-étapes pour créer une chasse au trésor.
 */
interface RiddlesCreationProps {
  formData: Partial<TreasureHunt>;
  setFormData: (data: Partial<TreasureHunt>) => void;
}

// Create a new SortableItem component
function SortableClue({ clue, index, updateClue, removeClue }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: clue.id });

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
              updateClue(index, "content", e.target.files[0])
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
              updateClue(index, "content", e.target.files[0])
            }
            className="pt-1"
          />
        );
      default:
        return (
          <Input
            value={clue.content}
            onChange={(e) =>
              updateClue(index, "content", e.target.value)
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
          onValueChange={(value: ClueType) =>
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
          <Label htmlFor={`degre-aide-${clue.id}`} className="whitespace-nowrap">
            Degré d'aide
          </Label>
          <Input
            id={`degre-aide-${clue.id}`}
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
function SortableRiddle({ riddle, index, removeRiddle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: riddle.id });

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
          <p className="font-medium">{riddle.question}</p>
          <div className="mt-4 space-y-2">
            {riddle.clues.map((clue, i) => (
              <div key={clue.id} className="text-sm text-muted-foreground">
                <span>Clue {i + 1}:</span>
                <span className="ml-2">{clue.content}</span>
                <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">
                  Aide niveau {clue.degre_aide || 1}
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
  const [newRiddle, setNewRiddle] = useState<Partial<Riddle>>({
    clues: [],
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
      clues: [
        ...(newRiddle.clues || []),
        { 
          id: crypto.randomUUID(),
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
      clues: newRiddle.clues?.filter((_, i) => i !== index),
    });
  };

  const updateClue = (index: number, field: string, value: string) => {
    setNewRiddle({
      ...newRiddle,
      clues: newRiddle.clues?.map((clue, i) =>
        i === index ? { ...clue, [field]: value } : clue
      ),
    });
  };

  const addRiddle = () => {
    if (newRiddle.titre && newRiddle.clues?.length) {
      setFormData({
        ...formData,
        riddles: [
          ...(formData.riddles || []),
          { ...newRiddle, id: crypto.randomUUID() } as Riddle,
        ],
      });
      setNewRiddle({ clues: [] });
    }
  };

  const removeRiddle = (index: number) => {
    setFormData({
      ...formData,
      riddles: formData.riddles?.filter((_, i) => i !== index),
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = newRiddle.clues.findIndex((clue) => clue.id === active.id);
      const newIndex = newRiddle.clues.findIndex((clue) => clue.id === over.id);

      const newClues = arrayMove(newRiddle.clues, oldIndex, newIndex);
      setNewRiddle({ ...newRiddle, clues: newClues });
    }
  };

  const handleRiddleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = formData.riddles.findIndex((r) => r.id === active.id);
      const newIndex = formData.riddles.findIndex((r) => r.id === over.id);

      setFormData({
        ...formData,
        riddles: arrayMove(formData.riddles || [], oldIndex, newIndex),
      });
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
          items={formData.riddles?.map((riddle) => riddle.id) || []}
          strategy={verticalListSortingStrategy}
        >
          {formData.riddles?.map((riddle, index) => (
            <SortableRiddle
              key={riddle.id}
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
              value={newRiddle.titre || ''}
              onChange={(e) => setNewRiddle({ ...newRiddle, titre: e.target.value })}
              placeholder="Entrez le titre de l'énigme"
            />
          </div>

          {/* Description de l'énigme (la question) */}
          <div className="space-y-2">
            <Label htmlFor="description">Contenu de l'énigme</Label>
            <Textarea
              id="description"
              value={newRiddle.description || ''}
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
                items={newRiddle.clues.map((clue) => clue.id)}
                strategy={verticalListSortingStrategy}
              >
                {newRiddle.clues?.map((clue, index) => (
                  <SortableClue
                    key={clue.id}
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
              value={newRiddle.endroit_qrcode || ''}
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
              value={newRiddle.temps_max || 0}
              onChange={(e) => setNewRiddle({ ...newRiddle, temps_max: parseInt(e.target.value) })}
            />
          </div>

          {/* description_reponse */}
          <div className="space-y-2">
            <Label htmlFor="description_reponse">Description de la réponse de l'énigme</Label>
            <Textarea
              id="description_reponse"
              value={newRiddle.description_reponse || ''}
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
              value={newRiddle.image_reponse || ''}
              onChange={(e) => setNewRiddle({ ...newRiddle, image_reponse: e.target.value })}
              placeholder="Entrez la description de la réponse de l'énigme"
            />
          </div>

          {/* Bouton pour ajouter une énigme */}
          <Button onClick={addRiddle} disabled={!newRiddle.titre || !newRiddle.clues?.length}>
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
              handleClueSubmit(clue);
              setShowClueModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}