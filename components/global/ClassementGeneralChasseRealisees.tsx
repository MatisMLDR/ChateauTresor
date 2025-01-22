import { getClassementChassesTerminees } from '@/utils/dao/ParticipantUtils';
import Loader from './loader';
import { UUID } from 'crypto';

const ClassementGeneralChasseRealisees = async ({ idUser }: { idUser: UUID }) => {
  const classement = await getClassementChassesTerminees();

  if (!classement) {
    return <Loader />
  }

  if (!classement?.length) {
    return (
      <div className="text-gray-500">
        Aucune chasse réalisée, soyez le premier !
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Classement général du nombre de chasses réalisées</h1>
      
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chasses réalisées</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {classement.map((participant: any, index: number) => {
              const isCurrentUser = participant.id_user === idUser;
              const initiale = participant.prenom?.[0]?.toUpperCase() || '?';

              return (
                <tr 
                  key={participant.id_participant} 
                  className={`${isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-400 to-primary rounded-full flex items-center justify-center text-white font-medium">
                        {initiale}
                      </div>
                      <div>
                        <span className="block font-medium">
                          {participant.prenom} {participant.nom}
                        </span>
                        <span className="block text-sm text-gray-500">
                          @{participant.username}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.ville}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {participant.nbChasses}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassementGeneralChasseRealisees;