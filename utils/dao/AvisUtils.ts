/**
 * Fonction permettant de récupérer tous les avis d'une énigme
 * @returns Promise<any> Le tableau des avis de l'énigme
 * @throws Error si la récupération des avis échoue
 * @example const avis = await getAllAvis(1);
 * @params id_enigme L'identifiant d'une énigme
 **/
export async function getAllAvis(id_enigme: number): Promise<any> {
  const res = await fetch(`/api/avis/enigme?id_enigme=${id_enigme}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des avis');
  }
  return await res.json()
}

/**
 * Fonction permettant de récupérer un avis par son id
 * @returns Promise<any> L'avis
 * @throws Error si la récupération de l'avis échoue
 * @example const avis = await getAvisById(1);
 * @params id_avis L'identifiant d'un avis
 **/
export async function getAvisById(id_avis: number): Promise<any> {
  const res = await fetch(`/api/avis/${id_avis}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de l\'avis');
  }
  return await res.json()
}