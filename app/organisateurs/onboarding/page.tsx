"use client"

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice';
import { createClient } from '@/utils/supabase/client';
import { MembreEquipe } from '@/classes/MembreEquipe';
import { UUID } from 'crypto';
import { createEquipe } from '@/utils/dao/EquipeOrganisatriceUtils';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [equipes, setEquipes] = useState<EquipeOrganisatrice[] | []>([]);
  const [formData, setFormData] = useState({
    equipe: '',
    id_membre: '',
    prenomUtilisateur: '',
    nomEquipe: '',
    role: '',
    message: '',
    type: '',
    carteIdentite: '',
    numeroTel: '',
    telephone: '',
    adressePostale: '',
    siteWeb: '',
    description: '',
    nSiret: '',
    idTaxes: '',
    terms: false, // Ajouté pour la case à cocher des conditions d'utilisation
  });
  const totalSteps = formData.equipe === 'oui' ? 2 : 6; // Changer le nombre d'étapes en fonction du choix de l'utilisateur

  useEffect(() => {
    // Récupérer toutes les équipes
    async function fetchEquipes() {
      try {
        const equipes = await EquipeOrganisatrice.getAllEquipesVerifiees();
        setEquipes(equipes);
      } catch (err) {
        // Do nothing
      }
    }
    async function fetchIdMembre() {
      const supabase = createClient();
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (user && user.id) {
          const membre = await MembreEquipe.readByIdUser(user.id as UUID);
          setFormData((prevData) => ({
            ...prevData,
            id_membre: membre.getIdMembre(),
            prenomUtilisateur: user.user_metadata.prenom,
          }));
        }
      } catch (err) {
        // Do nothing
      }
    }
    fetchEquipes();
    fetchIdMembre();
  }, [equipes, formData.id_membre]);

  console.log("equipes", equipes);

  const handleInputChange = (e: any) => {
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

  const handleSubmitWithExistingTeam = async (e: any) => {
    e.preventDefault();

    // Préparation des données pour l'appartenance à l'équipe
    const data = {
      id_membre: formData.id_membre as UUID,
      id_equipe: formData.equipe as UUID,
    };

    try {

      await MembreEquipe.createAppartenanceEquipe(data);

      // Redirection après le succès de l'insertion
      window.location.href = '/organisateurs/onboarding/attente/acceptation-equipe';

    } catch (err) {
      console.error('Erreur inconnue lors de l\'insertion des données :', err);
    }
  };
  const handleSubmitWithoutExistingTeam = async (e: any) => {
    e.preventDefault();

    // Préparation des données pour la nouvelle équipe
    const data = {
      nom: formData.nomEquipe,
      type: formData.type,
      n_siret: formData.type,
      id_taxes: formData.type,
      site_web: formData.siteWeb,
      adresse_postale: formData.adressePostale,
      telephone: formData.telephone,
      description: formData.description,
      carte_identite_chef: formData.carteIdentite,
      statut_verification: 'En attente de vérification',
    };

    try {
      const res = await createEquipe(data);

      if (!res.ok) {
        console.error('Erreur lors de l\'insertion des données :', res.error);
        // Gérer l'erreur (affichage de message, etc.)
      } else {
        console.log('Équipe créée avec succès');
        // Redirection après le succès de l'insertion
        window.location.href = '/organisateurs/onboarding/attente/verification-equipe';
      }
    } catch (err) {
      console.error('Erreur inconnue lors de l\'insertion des données :', err);
    }
  };

  let progress = (currentStep / totalSteps) * 100;

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className='max-w-[400px]'>
        {/* Barre de progression */}
        {currentStep > 1 && (
        <div className='h-4 border rounded-full shadow-sm mb-8'>
          <div
            className={`h-full rounded-full bg-primary transition-all duration-300 ease-in-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        )}
        <form>
          {currentStep === 1 && (
            <>
              {/* ÉTAPE 1 : Vérification de l'appartenance à une équipe */}
              {/* Demande si l'utilisateur fait déjà partie d'une équipe */}
              <h1 className="text-3xl font-bold mb-2">Bienvenue {formData.prenomUtilisateur}</h1>
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
                <Button type="button" onClick={handleNextStep}>
                  Continuer
                </Button>
              </div>
            </>
          )}

          {currentStep === 2 && formData.equipe == "oui" && (
            <>
              {/* ÉTAPE 2 et équipe existente : */}
              {/* L'utilisateur a choisi de rejoindre une équipe, il la choisie parmi celle existantes et indique son rôle (organisateur, créateur, autre) */}
              {/* Envoie un message optionnel et soumet sa demande, il sera rediriger vers la page "d'attente" de la validation pour rejoindre une équipe */}
              {/* Si information OK, le membre soumet sa demande avec un pop up alert dialog de validation (pas besoin d'un récapitulatif) : OK */}
              <h1 className="text-3xl font-bold mb-2">Votre équipe</h1>
              <h2 className="text-xl mb-4">Choisissez votre équipe et votre rôle</h2>
              <div className="space-y-4 mb-6">
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="equipe">Trouver son équipe</label>
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
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="role">Votre rôle</label>
                  <select
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    {/* role_equipe IN ('Invité', 'Créateur', 'Administrateur', 'Modérateur', 'Organisateur', 'Trésorier', 'Autre') */}
                    <option value="organisateur">Organisateur</option>
                    <option value="createur">Créateur</option>
                    <option value="membre" selected>Invité</option>
                    <option value="moderateur">Modérateur</option>
                    <option value="tresorier">Trésorier</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message || ""}
                    onChange={handleInputChange}
                    placeholder="Bref message à l'équipe"
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px] h-[100px]"
                    required
                  />
                </div>
                <Button type="submit" onSubmit={handleSubmitWithExistingTeam}>
                  Soumettre la demande
                </Button>
              </div>
            </>
          )}

          {currentStep === 2 && formData.equipe === "nom" && (
            <>
              {/* ÉTAPE 2 et pas d'équipe : Nom de l'équipe */}
              {/* L'utilisateur a choisi de créer une équipe, il entre les informations nécessaires pour la création */}
              {/* Les informations doivent impérativement inclure les informations de la table equipe_organisatrice */}
              {/* L'étape 2 inclue uniquement le nom de son équipe (qui est unique) */}
              {/* Si information OK, passe à l'étape 3 */}
              <h1 className="text-3xl font-bold mb-2">Créer votre équipe</h1>
              <h2 className="text-xl mb-4">Veuillez entrer le nom de votre équipe</h2>
              <div className="space-y-4 mb-6">
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="nomEquipe">Nom de l'équipe</label>
                  <Input
                    type="text"
                    id="nomEquipe"
                    name="nomEquipe"
                    value={formData.nomEquipe || ""}
                    onChange={handleInputChange}
                    placeholder="Nom de l'équipe"
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="button" onClick={handlePreviousStep}>
                    Retour
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Continuer
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && formData.equipe === "nom" && (
            <>
              {/* ÉTAPE 3 et pas d'équipe : Type de l'équipe (Société ou Particuliers) */}
              {/* L'utilisateur entre les informations supplémentaires pour la création de son équipe */}
              {/* Les informations doivent impérativement inclure les informations de la table equipe_organisatrice */}
              {/* L'étape 3 inclue le type de son équipe (société ou particuliers) */}
              {/* Si information OK, passe à l'étape 4 */}
              <h1 className="text-3xl font-bold mb-2">Type de votre équipe</h1>
              <h2 className="text-xl mb-4">Sélectionnez le type de votre équipe</h2>
              <div className="space-y-4 mb-6">
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="type">Type de l'équipe</label>
                  <select
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                    name="type"
                    value={formData.type || "Particuliers"}
                    onChange={handleInputChange}
                  >
                    <option value="Société">Société</option>
                    <option value="Particuliers">Particuliers</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <Button type="button" onClick={handlePreviousStep}>
                    Retour
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Continuer
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && formData.equipe === "nom" && (
            <>
              {/* ÉTAPE 4 et pas d'équipe : Documents supplémentaires */}
              {/* Les informations doivent impérativement inclure les informations de la table equipe_organisatrice */}
              {/* L'étape 4 inclue des documents supplémentaires pour les équipes */}
              {/* Les équipes doivent renseigner les documents nécessaires pour valider leur équipe */}
              {/* Cela inclue le numéro siret, le telephone, l'adresse postale, le site web (optionnel) le numéro de taxes (optionnel) et une brève description de leur projet */}
              {/* Les équipes de particuliers ne voient pas les inputs pour le numéro siret (utiliser formData.typeEquipe === "societe" && ... )*/}
              {/* Si information OK, passe à l'étape 5 */}
              <h1 className="text-3xl font-bold mb-2">Informations supplémentaires</h1>
              <h2 className="text-xl mb-4">Veuillez renseigner les détails de votre équipe</h2>
              <div className="space-y-4 mb-6">
                {formData.type === "Société" && (
                  <>
                    <div className="flex gap-4 items-center justify-between">
                      <label htmlFor="nSiret">Numéro SIRET</label>
                      <Input
                        type="text"
                        id="nSiret"
                        name="nSiret"
                        value={formData.nSiret || ""}
                        onChange={handleInputChange}
                        placeholder="Numéro SIRET"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                        required
                      />
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                      <label htmlFor="idTaxes">Numéro de Taxes</label>
                      <Input
                        type="text"
                        id="idTaxes"
                        name="idTaxes"
                        value={formData.idTaxes || ""}
                        onChange={handleInputChange}
                        placeholder="Numéro de Taxes"
                        className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="telephone">Téléphone</label>
                  <Input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone || ""}
                    onChange={handleInputChange}
                    placeholder="Téléphone"
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                    required
                  />
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="adressePostale">Adresse Postale</label>
                  <Input
                    type="text"
                    id="adressePostale"
                    name="adressePostale"
                    value={formData.adressePostale || ""}
                    onChange={handleInputChange}
                    placeholder="Adresse Postale"
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                    required
                  />
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="siteWeb">Site Web (optionnel)</label>
                  <Input
                    type="url"
                    id="siteWeb"
                    name="siteWeb"
                    value={formData.siteWeb || ""}
                    onChange={handleInputChange}
                    placeholder="Site Web"
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                  />
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="description">Description du projet</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    placeholder="Brève description du projet"
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px] h-[100px]"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" onClick={handlePreviousStep}>
                    Retour
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Continuer
                  </Button>
                </div>
              </div>
            </>
          )}
          {currentStep === 5 && formData.equipe === "nom" && (
            <>
              {/* ÉTAPE 5 et pas d'équipe : Documents de vérification pour le chef d'équipe */}
              {/* Enfin derniere étape demande la soumission de documents tels que la carte d'identité */}
              {/* Si information OK, passe à l'étape 6 */}
              <h1 className="text-3xl font-bold mb-2">Documents de vérification</h1>
              <h2 className="text-xl mb-4">Veuillez télécharger votre carte d'identité</h2>
              <div className="space-y-4 mb-6">
                <div className="flex gap-4 items-center justify-between">
                  <label htmlFor="carteIdentite">Carte d'identité du chef d'équipe</label>
                  <Input
                    type="file"
                    id="carteIdentite"
                    name="carteIdentite"
                    accept="image/*,.pdf"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md shadow-sm p-2 w-[300px]"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" onClick={handlePreviousStep}>
                    Retour
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Continuer
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 6 && formData.equipe === "nom" && (
            <>
              {/* ÉTAPE 6 et pas d'équipes : Confirmation et relecture */}
              {/* Cette dernière étape restitue toutes les informations du formulaires vérifier les informations (pas modifiables) */}
              {/* Pour respecter les règles RGPD, le formulaire doit contenir pour cette étape une checkbox pour accepter les conditions d'utilisation obligatoires sinon le formulaire ne peut pas être soumis */}
              {/* Si information OK, le membre soumet sa demande puis est redirigé vers la page d'attente pour un chef d'équipe */}
              <h1 className="text-3xl font-bold mb-2">Confirmation des informations</h1>
              <h2 className="text-xl mb-4">Veuillez vérifier vos informations</h2>
              <div className="space-y-4 mb-6">
                <p><strong>Nom de l'équipe :</strong> {formData.nomEquipe}</p>
                <p><strong>Type :</strong> {formData.type}</p>
                <p><strong>Téléphone :</strong> {formData.telephone}</p>
                <p><strong>Adresse postale :</strong> {formData.adressePostale}</p>
                {formData.siteWeb && <p><strong>Site Web :</strong> {formData.siteWeb}</p>}
                {formData.description && <p><strong>Description :</strong> {formData.description}</p>}
                {formData.type === "Société" && (
                  <>
                    <p><strong>Numéro SIRET :</strong> {formData.nSiret}</p>
                    {formData.idTaxes && <p><strong>Numéro de Taxes :</strong> {formData.idTaxes}</p>}
                  </>
                )}

                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms || false}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                    required
                  />
                  <label htmlFor="terms">J'accepte les conditions d'utilisation</label>
                </div>

                <div className="flex gap-4">
                  <Button type="button" onClick={handlePreviousStep}>
                    Retour
                  </Button>
                  <Button type="submit" onSubmit={handleSubmitWithoutExistingTeam}>
                    Soumettre la demande
                  </Button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
