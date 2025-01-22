import Chasse from '@/classes/Chasse';
import { UUID } from 'crypto';
import React from 'react';
import Loader from './loader';
import { getClassementPointsOfChasse } from '@/utils/dao/ChasseUtils';

const ClassementGeneralPoints = async ({ id_chasse }: { id_chasse: string }) => {
  const chasse = await Chasse.readId(id_chasse as UUID);
  const classement = await getClassementPointsOfChasse(id_chasse as UUID);

  if (!chasse) return <Loader />;

  if (classement.length === 0) {
    return (
      <div className="text-gray-500">
        Aucun participant n'a encore terminé cette chasse !
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Classement de "{chasse.getTitre()}"
      </h2>
      
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {classement.map((participant: any, index: number) => {
              const initiale = participant.prenom?.[0]?.toUpperCase() || '?';

              return (
                <tr key={participant.id_participant} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
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
                    {participant.score} pts
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

export default ClassementGeneralPoints;