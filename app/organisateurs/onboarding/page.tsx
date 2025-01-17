"use client"

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [equipes, setEquipes] = useState<EquipeOrganisatrice[] | []>([]);
  const totalSteps = 5; // Nombre total d'étapes
  const [formData, setFormData] = useState({
    equipe: '',
    role: '',
    carteIdentite: '',
    numeroTel: '',
  });

  useEffect(() => {
    // Récupérer toutes les équipes
    async function fetchEquipes() {
      try {
        const equipes = await EquipeOrganisatrice.getAllEquipes();
        setEquipes(equipes);
      } catch (err) {
        // Do nothing
      }
    }
  }, [equipes]);

  console.log("equipes", equipes);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Soumettre les données à Supabase
  };

  let progress = (currentStep / totalSteps) * 100;

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className='max-w-[400px]'>
        <div className='h-4 border rounded-full shadow-sm mb-8'>
          <div
            className={`h-full rounded-full bg-primary transition-all duration-300 ease-in-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <>
              <h1 className="text-3xl font-bold mb-2">Bienvenue Yvan</h1>
              <h2 className="text-xl mb-4">Nous avons besoin de plus d'informations</h2>
              <div className="space-y-4 mb-6">
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="equipe">Avez-vous une équipe existante ?</label>
                  <select
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                    name="equipe"
                    value={formData.equipe}
                    onChange={handleInputChange}
                  >
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                {formData.equipe === 'oui' && (
                  <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="equipe">Envoyer une demande</label>
                  <select
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                    name="equipe"
                    value={formData.equipe}
                    onChange={handleInputChange}
                  >
                    {equipes.map((equipe) => {
                      return (
                        <option key={equipe.getIdEquipe()} value={equipe.getIdEquipe()}>
                          {equipe.getNom()}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              </div>

              <Button type="button" onClick={handleNextStep}>
                Continuer
              </Button>

            </>
          )}
          {currentStep === 2 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Votre rôle dans l'équipe</h1>
              <h2 className="text-xl mb-4">
                Quel est votre rôle dans l'équipe ?
              </h2>
              <div className="flex gap-4 items-center justify-between">
                <select
                  className="border border-gray-300 rounded-md shadow-sm p-2 w-full"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="chef">Chef d'équipe</option>
                  <option value="organisateur">Organisateur</option>
                  <option value="createur">Créateur</option>
                  <option value="membre">Membre d'équipe</option>
                </select>
              </div>
              <div className="flex gap-4 items-center justify-between mt-6">
                <Button type="button" onClick={handlePreviousStep}>
                  Précédent
                </Button>
                <Button type="button" onClick={handleNextStep}>
                  Continuer
                </Button>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Invitez</h1>
              <h2 className="text-xl mb-4">
                Quel est votre rôle dans l'équipe ?
              </h2>
              <div className="flex gap-4 items-center justify-between">
                <label htmlFor="role">Quel est votre rôle dans l'équipe ?</label>
                <select
                  className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="chef">Chef d'équipe</option>
                  <option value="organisateur">Organisateur</option>
                  <option value="createur">Créateur</option>
                  <option value="membre">Membre d'équipe</option>
                </select>
              </div>
              <div className="flex gap-4 items-center justify-between mt-6">
                <Button type="button" onClick={handlePreviousStep}>
                  Précédent
                </Button>
                <Button type="button" onClick={handleNextStep}>
                  Continuer
                </Button>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Votre rôle dans l"équipe</h1>
              <h2 className="text-xl mb-4">
                Quel est votre rôle dans l'équipe ?
              </h2>
              <div className="flex gap-4 items-center justify-between">
                <label htmlFor="role">Quel est votre rôle dans l'équipe ?</label>
                <select
                  className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="chef">Chef d'équipe</option>
                  <option value="organisateur">Organisateur</option>
                  <option value="createur">Créateur</option>
                  <option value="membre">Membre d'équipe</option>
                </select>
              </div>
              <div className="flex gap-4 items-center justify-between mt-6">
                <Button type="button" onClick={handlePreviousStep}>
                  Précédent
                </Button>
                <Button type="button" onClick={handleNextStep}>
                  Continuer
                </Button>
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className='transition-all duration-300 ease-in-out'>
              <h1 className="text-3xl font-bold mb-2">Vérification d'identité</h1>
              <h2 className="text-xl mb-4">Accéder à toutes les fonctionnalités</h2>
              <div className="flex gap-4 items-center justify-between mb-6">
                <label htmlFor="carteIdentite">Carte d'identité</label>
                <Input
                  id="carteIdentite"
                  name="carteIdentite"
                  type="file"
                  className="w-[300px]"
                  value={formData.carteIdentite}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-4 items-center justify-between">
                <label htmlFor="numeroTel">Numéro de téléphone</label>
                <Input
                  id="numeroTel"
                  name="numeroTel"
                  type="text"
                  className="w-[300px]"
                  value={formData.numeroTel}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-4 items-center justify-between mt-6">
                <Button type="button" onClick={handlePreviousStep}>
                  Précédent
                </Button>
                <Button type="submit">Soumettre</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
