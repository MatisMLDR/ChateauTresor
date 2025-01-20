import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice';
import { MembreEquipe } from '@/classes/MembreEquipe';
import ButtonQuitTeam from '@/components/organisateurs/demandes/button-quit-team';
import { Skeleton } from '@/components/ui/skeleton';
import { getAppartenanceMembreEquipe } from '@/utils/dao/MembreEquipeUtils';
import { UUID } from 'crypto'
import { LoaderCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const Equipes = async ({ params }: { params: { id_membre: UUID } }) => {

  const { id_membre } = await params;

  const equipesDuMembre = await MembreEquipe.getAllEquipesOfMembre(id_membre);

  if (!id_membre || !equipesDuMembre) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  if (equipesDuMembre.length === 0) {
    redirect('/organisateurs/onboarding')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 p-4">
        Equipes
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nom de l'équipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre de membres
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email Administrateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Votre rôle
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut de votre demande
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date de demande ou d'arrivée
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quitter l'équipe
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">

            {equipesDuMembre.map(async (equipe: EquipeOrganisatrice) => {
              const nbMembres = await equipe.getNbMembres();
              const administrateur = await equipe.getAdministrateur();
              const appartenance = await getAppartenanceMembreEquipe(id_membre, equipe.getIdEquipe());
              if (!nbMembres || !administrateur || !appartenance) {
                return (
                  <Skeleton className='w-full h-10 rounded-md' key={equipe.getIdEquipe()} />
                )
              }
              return (
                <tr key={equipe.getIdEquipe()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {equipe.getNom()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {nbMembres}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {administrateur.getEmail()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {appartenance.role_equipe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {appartenance.statut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {appartenance.statut === 'En attente de validation' ? appartenance.date_demande : appartenance.date_appartenance}
                  </td>
                  <td className="flex items-center justify-center gap-2 px-6 py-4 whitespace-nowrap text-center">
                    <ButtonQuitTeam id_membre={id_membre} id_equipe={equipe.getIdEquipe()} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Equipes
