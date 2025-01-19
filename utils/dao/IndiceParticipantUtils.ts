import { UUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Méthode pour enregistrer un indice découvert par un participant
 * @param id_indice L'identifiant de l'indice
 * @param id_participant L'identifiant du participant
 * @returns Promise<any> La réponse de l'API
 * @throws Error si l'enregistrement échoue
 * @example await indiceDecouvert('indice-id', 'participant-id');
 */
export async function indiceDecouvert(id_indice: UUID, id_participant: UUID): Promise<any> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/participant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_indice, id_participant }),
    });

    if (!res.ok) {
      const errorResponse = await res.json(); // Lire le corps de la réponse en cas d'erreur
      console.error('Erreur API:', res.status, errorResponse);
      throw new Error(errorResponse.error || 'Erreur lors de l\'enregistrement de l\'indice découvert');
    }

    const data = await res.json();
    console.log('Indice marqué comme découvert avec succès:', data);
    return data;
  } catch (error) {
    console.error('Erreur dans indiceDecouvert:', error);
    throw error;
  }
}

/**
 * Méthode pour mettre à jour un enregistrement Indice_Participant
 * @param id_indice L'identifiant de l'indice
 * @param id_participant L'identifiant du participant
 * @param updatedData Les nouvelles données à mettre à jour
 * @returns Promise<any> La réponse de l'API
 * @throws Error si la mise à jour échoue
 * @example await updateIndiceParticipant('indice-id', 'participant-id', { est_decouvert: true });
 */
export async function updateIndiceParticipant(
  id_indice: UUID,
  id_participant: UUID,
  updatedData: { est_decouvert?: boolean; date_utilisation?: string }
): Promise<any> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/participant?id_indice=${id_indice}&id_participant=${id_participant}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    }
  );
  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour de l\'enregistrement Indice_Participant');
  }
  return await res.json();
}

/**
 * Méthode pour supprimer un enregistrement Indice_Participant
 * @param id_indice L'identifiant de l'indice
 * @param id_participant L'identifiant du participant
 * @returns Promise<void> Aucune réponse en cas de succès
 * @throws Error si la suppression échoue
 * @example await deleteIndiceParticipant('indice-id', 'participant-id');
 */
export async function deleteIndiceParticipant(id_indice: UUID, id_participant: UUID): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/participant?id_indice=${id_indice}&id_participant=${id_participant}`,
    {
      method: 'DELETE',
    }
  );
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression de l\'enregistrement Indice_Participant');
  }
}

/**
* Méthode pour vérifier si un indice est déjà renseigné pour un participant
* @param participantId L'identifiant du participant
* @param indiceId L'identifiant de l'indice
* @returns Promise<boolean> True si l'indice est déjà renseigné, false sinon
* @throws Error si l'opération échoue
*/
export async function checkIfIndiceExists(participantId: UUID, indiceId: UUID): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/participant/discovered?participantId=${participantId}&idIndice=${indiceId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      const errorResponse = await res.json();
      console.error('Erreur API:', res.status, errorResponse);
      throw new Error(errorResponse.error || 'Erreur lors de la vérification de l\'indice');
    }

    const data = await res.json();
    return data.exists; // Renvoie true ou false
  } catch (error) {
    console.error('Erreur dans checkIfIndiceExists:', error);
    throw error;
  }
}