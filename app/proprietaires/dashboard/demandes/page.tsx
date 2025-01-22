import { Proprietaire } from '@/classes/Proprietaire';
import ButtonDemandeChasse from '@/components/proprietaires/bouttonDemandeChasse';
import { UUID } from 'crypto';
import { createClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';
import Link from 'next/link'; // Import de Link pour la navigation
import React from 'react';

const DemandesChasses = async () => {
  const supabase = createClient();

  // Récupérer l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser();
  const id_user = user?.id;

  // Récupérer le propriétaire par son id_user
  const proprietaire = await Proprietaire.readByIdUser(id_user as UUID);

  // Récupérer les chasses en cours de validation pour ce propriétaire
  const chassesEnValidation = await proprietaire.getChassesEnValidation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Demandes de chasses en cours de validation
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Château
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {chassesEnValidation.length > 0 ? (
              chassesEnValidation.map((chasse: any) => (
                <tr key={chasse.id_chasse} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <Link
                      href={`/proprietaires/dashboard/chasses/${chasse.id_chasse}`} // Lien vers la page de détail
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {chasse.titre}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {chasse.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {chasse.chateau?.nom || 'Non spécifié'} {/* Afficher le nom du château */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(chasse.date_creation).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {chasse.statut}
                  </td>
                  <td className="flex items-center justify-center gap-2 px-6 py-4 whitespace-nowrap text-center">
                    <ButtonDemandeChasse
                      action="accepter"
                      id_chasse={chasse.id_chasse}
                      chasseData={chasse}
                    />
                    <ButtonDemandeChasse
                      action="refuser"
                      id_chasse={chasse.id_chasse}
                      chasseData={chasse}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  Aucune demande de chasse en attente
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemandesChasses;