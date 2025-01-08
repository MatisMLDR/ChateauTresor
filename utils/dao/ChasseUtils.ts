 /*
  * Méthode pour récupérer toutes les participations à une chasse
  * @returns Promise<any> Un tableau de participations
  * @throws Error si la récupération des participations échoue
  * @example const participations = await getAllParticipations();
  */
 export async function getAllParticipations(id_chasse: number): Promise<any> {
  const res = await fetch(`/api/participations/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les énigmes d'une chasse
* @returns Promise<any> Un tableau d'énigmes
* @throws Error si la récupération des énigmes échoue
* @example const enigmes = await getAllEnigmes();
*/
export async function getAllEnigmes(id_chasse: number): Promise<any> {
  const res = await fetch(`/api/enigmes/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des énigmes');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les indices d'une chasse
* @returns Promise<any> Un tableau d'indices
* @throws Error si la récupération des indices échoue
* @example const indices = await getAllIndices();
*/
export async function getAllIndices(id_chasse: number): Promise<any> {
  const res = await fetch(`/api/indices/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des indices');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les récompenses d'une chasse
* @returns Promise<any> Un tableau de récompenses
* @throws Error si la récupération des récompenses échoue
* @example const recompenses = await getAllRecompenses();
*/
export async function getAllRecompenses(id_chasse: number): Promise<any> {
  const res = await fetch(`/api/recompenses/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des récompenses');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les avis d'une chasse
* @returns Promise<any> Un tableau d'avis
* @throws Error si la récupération des avis échoue
* @example const avis = await getAllAvis();
*/
export async function getAllAvis(id_chasse: number): Promise<any> {
  const res = await fetch(`/api/avis/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des avis');
  }
  return await res.json();
}