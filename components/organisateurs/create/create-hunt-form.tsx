import { useState } from "react";
import { BasicDetails } from "./steps/basic-details";
import { CastleSelection } from "./steps/castle-selection";
import { RiddlesCreation } from "./steps/riddles-creation";
import { ReviewSubmit } from "./steps/review-submit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TreasureHunt } from "@/types";
import { contenuTextuel } from "@/lib/contenuCreationChasse";

const steps = [
  { title: contenuTextuel.create.steps.basicDetails, component: BasicDetails },
  { title: contenuTextuel.create.steps.castleSelection, component: CastleSelection },
  { title: contenuTextuel.create.steps.riddlesClues, component: RiddlesCreation },
  { title: contenuTextuel.create.steps.reviewSubmit, component: ReviewSubmit },
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
      console.log(`Moving to next step: ${currentStep + 1}`);
      console.log("Current formData:", formData);
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      console.log(`Returning to previous step: ${currentStep - 1}`);
      console.log("Current formData:", formData);
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    console.log("Final form data submitted:", formData);
    // TODO: Add your submission logic here
  };

  const handleFormDataUpdate = (updatedData: Partial<TreasureHunt>) => {
    console.log("Updating formData:", updatedData);
    setFormData((prevData) => ({ ...prevData, ...updatedData }));
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
          setFormData={handleFormDataUpdate} // Passe la fonction de mise à jour avec log
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          {contenuTextuel.common.previous}
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit}>
            {contenuTextuel.create.form.review.createHunt}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {contenuTextuel.common.next}
          </Button>
        )}
      </div>
    </div>
  );
}
