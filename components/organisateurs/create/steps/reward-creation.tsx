"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Pencil, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UUID } from "crypto";
import { ChasseType, RecompenseType } from "@/types";
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

interface RewardCreationProps {
  formData: Partial<ChasseType>;
  setFormData: (data: Partial<ChasseType>) => void;
}

export default function RewardCreation({ formData, setFormData }: RewardCreationProps) {
  const [rewards, setRewards] = useState<RecompenseType[]>(formData.recompenses || []);
  const [editingReward, setEditingReward] = useState<RecompenseType | null>(null);
  const [newReward, setNewReward] = useState<RecompenseType>({
    id_recompense: crypto.randomUUID() as UUID,
    nom: "",
    description: "",
    type: "",
    valeur: 0,
    quantite_dispo: 0,
    prix_reel: 0,
    image: null,
    date_modification: new Date().toISOString(),
    id_chasse: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = rewards.findIndex((r) => r.id_recompense === active.id);
      const newIndex = rewards.findIndex((r) => r.id_recompense === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedRewards = arrayMove(rewards, oldIndex, newIndex);
        setRewards(updatedRewards);
        setFormData({ ...formData, recompenses: updatedRewards });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (editingReward) {
        setEditingReward({ ...editingReward, image: file });
      } else {
        setNewReward({ ...newReward, image: file });
      }
    }
  };

  const updateRewardInFormData = (reward: RecompenseType) => {
    const updatedRewards = formData.recompenses?.map((r) =>
      r.id_recompense === reward.id_recompense ? reward : r
    );
    setFormData({ ...formData, recompenses: updatedRewards });
  };

  const addReward = (reward: RecompenseType) => {
    const updatedRewards = [...rewards, reward];
    setRewards(updatedRewards);
    setFormData({ ...formData, recompenses: updatedRewards });
    resetForm();
  };

  const updateReward = (reward: RecompenseType) => {
    const updatedRewards = rewards.map((r) =>
      r.id_recompense === reward.id_recompense ? reward : r
    );
    setRewards(updatedRewards);
    updateRewardInFormData(reward);
    setEditingReward(null);
  };

  const deleteReward = (id_recompense: UUID) => {
    const updatedRewards = rewards.filter((r) => r.id_recompense !== id_recompense);
    setRewards(updatedRewards);
    setFormData({ ...formData, recompenses: updatedRewards });
  };

  const resetForm = () => {
    setNewReward({
      id_recompense: crypto.randomUUID() as UUID,
      nom: "",
      description: "",
      type: "",
      valeur: 0,
      quantite_dispo: 0,
      prix_reel: 0,
      image: null,
      date_modification: new Date().toISOString(),
      id_chasse: null,
    });
    setEditingReward(null);
  };

  function SortableReward({ reward, isActive }: { reward: RecompenseType; isActive: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: reward.id_recompense!,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <Card className={`cursor-pointer ${isActive ? "ring-2 ring-primary" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div {...listeners} className="cursor-grab">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              {reward.image && (
                <img
                  src={
                    reward.image instanceof File
                      ? URL.createObjectURL(reward.image)
                      : reward.image || "/placeholder.png"
                  }
                  alt={reward.nom}
                  className="h-16 w-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{reward.nom}</h3>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
                <div className="text-sm text-muted-foreground">
                  Type: {reward.type} | Valeur: {reward.valeur} | Quantité: {reward.quantite_dispo}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingReward(reward);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteReward(reward.id_recompense as UUID);
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

  return (
    <div className="space-y-8">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {rewards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Récompenses ajoutées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <SortableContext
                  items={rewards.map((r) => r.id_recompense!).filter((id): id is UUID => !!id)}
                  strategy={verticalListSortingStrategy}
                >
                  {rewards.map((reward) => (
                    <SortableReward
                      key={reward.id_recompense}
                      reward={reward}
                      isActive={reward.id_recompense === editingReward?.id_recompense}
                    />
                  ))}
                </SortableContext>
              </div>
            </CardContent>
          </Card>
        )}
      </DndContext>

      <Card>
        <CardHeader>
          <CardTitle>{editingReward ? "Modifier la récompense" : "Ajouter une récompense"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la récompense</Label>
              <Input
                id="name"
                placeholder="Nom de la récompense"
                value={editingReward ? editingReward.nom : newReward.nom}
                onChange={(e) => {
                  editingReward
                    ? setEditingReward({ ...editingReward, nom: e.target.value })
                    : setNewReward({ ...newReward, nom: e.target.value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description de la récompense</Label>
              <Textarea
                id="description"
                placeholder="Description de la récompense"
                value={editingReward ? editingReward.description : newReward.description}
                onChange={(e) => {
                  editingReward
                    ? setEditingReward({ ...editingReward, description: e.target.value })
                    : setNewReward({ ...newReward, description: e.target.value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de récompense</Label>
              <Input
                id="type"
                placeholder="Type de récompense"
                value={editingReward ? editingReward.type : newReward.type}
                onChange={(e) => {
                  editingReward
                    ? setEditingReward({ ...editingReward, type: e.target.value })
                    : setNewReward({ ...newReward, type: e.target.value });
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valeur</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="Valeur"
                  value={editingReward ? editingReward.valeur : newReward.valeur}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    editingReward
                      ? setEditingReward({ ...editingReward, valeur: value })
                      : setNewReward({ ...newReward, valeur: value });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité disponible</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Quantité"
                  value={editingReward ? editingReward.quantite_dispo : newReward.quantite_dispo}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    editingReward
                      ? setEditingReward({ ...editingReward, quantite_dispo: value })
                      : setNewReward({ ...newReward, quantite_dispo: value });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix réel</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Prix"
                  value={editingReward ? editingReward.prix_reel : newReward.prix_reel}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    editingReward
                      ? setEditingReward({ ...editingReward, prix_reel: value })
                      : setNewReward({ ...newReward, prix_reel: value });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image de la récompense</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {editingReward?.image && (
                <div className="mt-2">
                  <img
                    src={
                      editingReward.image instanceof File
                        ? URL.createObjectURL(editingReward.image)
                        : editingReward.image || "/placeholder.png"
                    }
                    alt="Image de la récompense"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
              {newReward.image instanceof File && (
                <div className="text-sm text-muted-foreground mt-2">
                  Fichier sélectionné : {newReward.image.name}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              {editingReward && (
                <Button variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              )}
              <Button
                onClick={() => {
                  if (editingReward) {
                    updateReward(editingReward);
                  } else {
                    addReward(newReward);
                  }
                }}
                disabled={
                  !(editingReward ? editingReward.nom : newReward.nom) ||
                  !(editingReward ? editingReward.description : newReward.description) ||
                  !(editingReward ? editingReward.type : newReward.type) ||
                  (editingReward ? editingReward.valeur <= 0 : newReward.valeur <= 0) ||
                  (editingReward ? editingReward.quantite_dispo <= 0 : newReward.quantite_dispo <= 0)
                }
              >
                {editingReward ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}