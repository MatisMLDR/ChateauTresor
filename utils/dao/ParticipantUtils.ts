import dotenv from 'dotenv';
dotenv.config();

/*
 * Méthode pour récupérer un participant par son id
 * @returns Promise<any> Le tableau du participant
 * @params id_participant L'identifiant du participant 
 */
export async function getParticipantById(id_participant: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/${id_participant}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du participant');
  }
  return await res.json();
} 

/*
 * Méthode pour récupérer toutes les participations aux énigmes
 * @returns Promise<any> Un tableau des participations aux énigmes
 * @throws Error si la récupération des participations aux énigmes échoue
 * @example const enigmes = await getAllParticipationsEnigmes(1);
 * @params id_participant L'identifiant du participant
 */
export async function getAllParticipantEnigmes(id_participant: number): Promise<any> {
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
export async function getAllParticipantChasses(id_participant: number): Promise<any> {
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
export async function getAllParticipantAvis(id_participant: number): Promise<any> {
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
export async function getAllParticipantIndice(id_participant: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participants/indices/${id_participant}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des indices du participant');
  }
  return await res.json();
}


