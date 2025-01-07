"use client";

import { useState } from "react";
import { BasicDetails } from "./steps/basic-details";
import { CastleSelection } from "./steps/castle-selection";
import { RiddlesCreation } from "./steps/riddles-creation";
import { ReviewSubmit } from "./steps/review-submit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TreasureHunt } from "@/types";
import { translations } from "@/lib/contenuCreationChasse";

const steps = [
  { title: translations.create.steps.basicDetails, component: BasicDetails },
  { title: translations.create.steps.castleSelection, component: CastleSelection },
  { title: translations.create.steps.riddlesClues, component: RiddlesCreation },
  { title: translations.create.steps.reviewSubmit, component: ReviewSubmit },
];

export function CreateHuntForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<TreasureHunt>>({
    riddles: [],
  });

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground">
          Étape {currentStep + 1} sur {steps.length}: {steps[currentStep].title}
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <CurrentStepComponent
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          {translations.common.previous}
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit}>
            {translations.create.form.review.createHunt}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {translations.common.next}
          </Button>
        )}
      </div>
    </div>
  );
}