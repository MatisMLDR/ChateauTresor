import EquipeOrganisatrice from '@/classes/EquipeOrganisatrice'
import ButtonDemande from '@/components/organisateurs/demandes/button-demande'
import { UUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import React from 'react'

const Demandes = async ({ params }: { params: { id_equipe: UUID } }) => {

  const { id_equipe } = await params;;
  const equipe = await EquipeOrganisatrice.readId(id_equipe);
  const demandes = await equipe.getAllDemandes();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Demandes d'appartenance à l'équipe {equipe.getNom()}  
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">

            {demandes.length > 0 ? demandes.map((demande: any) => {
              return (
                <tr key={demande.id_membre} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {  new Date(demande.date_demande).toLocaleString("fr-FR", { day: "numeric" as const, month: "long" as const, year: "numeric" as const })                  }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {demande.prenom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {demande.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {demande.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {demande.message_demande}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {demande.role_equipe}
                  </td>
                  <td className="flex items-center justify-center gap-2 px-6 py-4 whitespace-nowrap text-center">
                    <ButtonDemande action="accepter" id_membre={demande.id_membre} id_equipe={id_equipe} equipeData={equipe.toObject()} />
                    <ButtonDemande action="refuser" id_membre={demande.id_membre} id_equipe={id_equipe} equipeData={equipe.toObject()} />
                  </td>
                </tr>
              );
            })
              :
              <tr>
                <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  Aucune demande en attente
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default Demandes
