"use client";

import { TreasureHunt } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, AlertTriangle } from "lucide-react";

interface ReviewSubmitProps {
  formData: Partial<TreasureHunt>;
  setFormData: (data: Partial<TreasureHunt>) => void;
}

export function ReviewSubmit({ formData }: ReviewSubmitProps) {
  const isComplete = 
    formData.title &&
    formData.description &&
    formData.castle &&
    formData.price &&
    formData.duration &&
    formData.difficulty &&
    formData.riddles?.length;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Title</h3>
            <p className="text-muted-foreground">{formData.title}</p>
          </div>
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground">{formData.description}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formData.duration} minutes</span>
            </div>
            <div>£{formData.price}</div>
            <div className="capitalize">{formData.difficulty} difficulty</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selected Castle</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.castle ? (
            <div className="space-y-4">
              <img
                src={formData.castle.imageUrl}
                alt={formData.castle.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold">{formData.castle.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {formData.castle.address}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No castle selected</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riddles ({formData.riddles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.riddles?.map((riddle, index) => (
              <div key={riddle.id} className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">
                  Riddle {index + 1}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {riddle.question}
                </p>
                <div className="text-sm text-muted-foreground">
                  {riddle.clues.length} clues provided
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!isComplete && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">
            Please complete all required information before submitting
          </p>
        </div>
      )}
    </div>
  );
}