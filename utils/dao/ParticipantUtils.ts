import { UUID } from 'crypto';

/*
 * Méthode pour récupérer un participant par son id
 * @returns Promise<any> Le tableau du participant
 * @params id_participant L'identifiant du participant 
 */
export async function getParticipantById(id_participant: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/${id_participant}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du participant');
  }
  return await res.json();
} 

export async function getParticipantByUserId(id_user: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/user/${id_user}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du participant');
  }
  return await res.json();
}

/*
 * Méthode pour récupérer toutes les participations aux énigmes
 * @returns Promise<any> Un tableau des participations aux énigmes
 * @throws Error si la récupération des participations aux énigmes échoue
 * @example const scoreTotal = await getAllParticipationsEnigmes(1);
 * @params id_participant L'identifiant du participant
 */
export async function getAllParticipantEnigmes(id_participant: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/enigmes/${id_participant}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations aux énigmes');
  }
  return await res.json();
}

/*
 * Méthode pour récupérer toutes les chasses des participants
 * @returns Promise<any> Un tableau de chasses des participants
 * @throws Error si la récupération des chasses échoue
 * @example const chasses = await getAllParticipationsChasses(1);
 * @params id_participant L'identifiant du participant
 */
export async function getAllParticipantChasses(id_participant: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/chasses/${id_participant}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des chasses du participant');
  }
  return await res.json();
}

/*
 * Méthode pour récupérer toutes les avis des participants
 * @returns Promise<any> Un tableau de avis des participants
 * @throws Error si la récupération des avis échoue
 * @example const avis = await getAllParticipantAvis(1);
 * @params id_participant L'identifiant du participant
 */
export async function getAllParticipantAvis(id_participant: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/avis/${id_participant}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des avis du participant');
  }
  return await res.json();
}

/*
 * Méthode pour récupérer toutes les indices des participants
 * @returns Promise<any> Un tableau de indices des participants
 * @throws Error si la récupération des indices échoue
 * @example const indices = await getAllParticipantIndices(1);
 * @params id_participant L'identifiant du participant
 */
export async function getAllParticipantIndice(id_participant: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/indices/${id_participant}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des indices du participant');
  }
  return await res.json();
}

/*
 * Méthode pour créer un participant
 * @param participant Les données du participant à créer
 * @returns Promise<any> Le participant créé
 * @throws Error si la création échoue
 * @example const nouveauParticipant = await createParticipant({ nom: 'Jean Dupont', email: 'jean@exemple.com' });
 */
export async function createParticipant(participant: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participant),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création du participant');
  }
  return await res.json();
}

/*
 * Méthode pour mettre à jour un participant
 * @returns Promise<any> Le participant mis à jour
 * @throws Error si la mise à jour échoue
 * @example const updatedParticipant = await updateParticipant({ id_participant: 1, nom: 'Jean Dupont' });
 */
export async function updateParticipant(participant: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/${participant.id_participant}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participant),
  });
  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour du participant avec l'ID ${participant.id_participant}`);
  }
  return await res.json();
}

/*
 * Méthode pour supprimer un participant
 * @param id_participant L'identifiant du participant à supprimer
 * @returns Promise<void>
 * @throws Error si la suppression échoue
 * @example await deleteParticipant(1);
 */
export async function deleteParticipant(id_participant: UUID): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/${id_participant}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression du participant avec l'ID ${id_participant}`);
  }
}


/*
 * Méthode pour récupérer une participation par son id
 * @returns Promise<any> Le tableau de la participation
 * @params id_participation L'identifiant de la participation 
 */
export async function addParticipation(participation: any): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/participant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participation),
  });
  if (!res.ok) {
    console.log(res)
    throw new Error('Erreur lors de la création de la participation');
  }
}