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
            <SelectValue placeholder="Select clue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="sound">Sound</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={clue.content}
          onChange={(e) =>
            updateClue(index, "content", e.target.value)
          }
          placeholder={`Enter ${clue.type} content`}
        />
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
                Clue {i + 1}: {clue.content}
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

  const addClue = () => {
    setNewRiddle({
      ...newRiddle,
      clues: [
        ...(newRiddle.clues || []),
        { id: crypto.randomUUID(), type: "text", content: "" },
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
    if (newRiddle.question && newRiddle.clues?.length) {
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
          items={formData.riddles?.map(riddle => riddle.id) || []}
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

      {/* New Riddle Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Riddle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Riddle Question</Label>
            <Textarea
              id="question"
              value={newRiddle.question || ""}
              onChange={(e) =>
                setNewRiddle({ ...newRiddle, question: e.target.value })
              }
              placeholder="Enter your riddle question"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Clues</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addClue}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Clue
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={newRiddle.clues.map(clue => clue.id)}
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

          <div className="space-y-2">
            <Label htmlFor="code">Answer Code</Label>
            <Input
              id="code"
              value={newRiddle.code || ""}
              onChange={(e) =>
                setNewRiddle({ ...newRiddle, code: e.target.value })
              }
              placeholder="Enter the code or scan QR code"
            />
          </div>

          <Button
            onClick={addRiddle}
            disabled={!newRiddle.question || !newRiddle.clues?.length}
          >
            Add Riddle
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}