"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UUID } from "crypto";
import { ChasseType, RecompenseType } from "@/types";
import { Label } from "@radix-ui/react-label";

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
    image: "",
    date_modification: new Date().toISOString(),
    id_chasse: null,
  });

  // Synchronize rewards with formData
  useEffect(() => {
    setRewards(formData.recompenses || []);
  }, [formData.recompenses]);

  // Update reward in formData
  const updateRewardInFormData = (reward: RecompenseType) => {
    const updatedRewards = formData.recompenses?.map((r) =>
      r.id_recompense === reward.id_recompense ? reward : r
    );
    setFormData({
      ...formData,
      recompenses: updatedRewards,
    });
  };

  // Add a new reward
  const addReward = (reward: RecompenseType) => {
    const updatedRewards = [...rewards, reward];
    setRewards(updatedRewards);
    setFormData({ ...formData, recompenses: updatedRewards });
    resetForm();
  };

  // Update an existing reward
  const updateReward = (reward: RecompenseType) => {
    const updatedRewards = rewards.map((r) =>
      r.id_recompense === reward.id_recompense ? reward : r
    );
    setRewards(updatedRewards);
    updateRewardInFormData(reward);
    setEditingReward(null);
  };

  // Delete a reward
  const deleteReward = (id_recompense: UUID) => {
    const updatedRewards = rewards.filter((r) => r.id_recompense !== id_recompense);
    setRewards(updatedRewards);
    setFormData({ ...formData, recompenses: updatedRewards });
  };

  // Reset the form
  const resetForm = () => {
    setNewReward({
      id_recompense: crypto.randomUUID() as UUID,
      nom: "",
      description: "",
      type: "",
      valeur: 0,
      quantite_dispo: 0,
      prix_reel: 0,
      image: "",
      date_modification: new Date().toISOString(),
      id_chasse: null,
    });
    setEditingReward(null);
  };

  return (
    <div className="space-y-8">
      {/* Display added rewards */}
      {rewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rewards.map((reward) => (
                <Card
                  key={reward.id_recompense}
                  className={`${
                    editingReward?.id_recompense === reward.id_recompense
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {reward.image && (
                        <img
                          src={reward.image}
                          alt={reward.nom}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{reward.nom}</h3>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                        <div className="text-sm text-muted-foreground">
                          Type: {reward.type} | Value: {reward.valeur} | Quantity: {reward.quantite_dispo}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingReward(reward); // Switch to edit mode
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (reward.id_recompense) {
                            deleteReward(reward.id_recompense);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reward creation/modification form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingReward ? "Edit Reward" : "Add a Reward"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Reward Name</Label>
              <Input
                id="name"
                placeholder="Reward Name"
                value={editingReward ? editingReward.nom : newReward.nom}
                onChange={(e) => {
                  if (editingReward) {
                    setEditingReward({ ...editingReward, nom: e.target.value });
                  } else {
                    setNewReward({ ...newReward, nom: e.target.value });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Reward Description</Label>
              <Input
                id="description"
                placeholder="Reward Description"
                value={editingReward ? editingReward.description : newReward.description}
                onChange={(e) => {
                  if (editingReward) {
                    setEditingReward({ ...editingReward, description: e.target.value });
                  } else {
                    setNewReward({ ...newReward, description: e.target.value });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Reward Type</Label>
              <Input
                id="type"
                placeholder="Reward Type"
                value={editingReward ? editingReward.type : newReward.type}
                onChange={(e) => {
                  if (editingReward) {
                    setEditingReward({ ...editingReward, type: e.target.value });
                  } else {
                    setNewReward({ ...newReward, type: e.target.value });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Reward Value</Label>
              <Input
                id="value"
                type="number"
                placeholder="Reward Value"
                value={editingReward ? editingReward.valeur : newReward.valeur}
                onChange={(e) => {
                  if (editingReward) {
                    setEditingReward({ ...editingReward, valeur: parseFloat(e.target.value) });
                  } else {
                    setNewReward({ ...newReward, valeur: parseFloat(e.target.value) });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Available Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Available Quantity"
                value={editingReward ? editingReward.quantite_dispo : newReward.quantite_dispo}
                onChange={(e) => {
                  if (editingReward) {
                    setEditingReward({ ...editingReward, quantite_dispo: parseInt(e.target.value) });
                  } else {
                    setNewReward({ ...newReward, quantite_dispo: parseInt(e.target.value) });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Real Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="Real Price"
                value={editingReward ? editingReward.prix_reel : newReward.prix_reel}
                onChange={(e) => {
                  if (editingReward) {
                    setEditingReward({ ...editingReward, prix_reel: parseFloat(e.target.value) });
                  } else {
                    setNewReward({ ...newReward, prix_reel: parseFloat(e.target.value) });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                placeholder="Image URL (optional)"
                value={editingReward ? editingReward.image ?? "" : newReward.image ?? ""}
                onChange={(e) => {
                  if (editingReward) {
                    setEditingReward({ ...editingReward, image: e.target.value });
                  } else {
                    setNewReward({ ...newReward, image: e.target.value });
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              {editingReward && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button
                onClick={() => {
                  if (editingReward) {
                    updateReward(editingReward);
                  } else {
                    addReward(newReward);
                  }
                  resetForm();
                }}
                disabled={
                  !(editingReward ? editingReward.nom : newReward.nom) ||
                  !(editingReward ? editingReward.description : newReward.description) ||
                  !(editingReward ? editingReward.type : newReward.type) ||
                  (editingReward ? editingReward.valeur <= 0 : newReward.valeur <= 0) ||
                  (editingReward ? editingReward.quantite_dispo <= 0 : newReward.quantite_dispo <= 0)
                }
              >
                {editingReward ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}