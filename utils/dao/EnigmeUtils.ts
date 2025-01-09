/*
 * Méthode pour récupérer tout les indices d'une enigme
 * @returns Promise<any> Le tableau des indices de l'enigme
 * @throws Error si la récupération des indices échoue
 * @example const indices = await getAllIndices();
 * @params id_enigmes L'identifiant d'une énigme
 */
export async function getAllIndices(id_enigme: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/enigme?id_enigme=${id_enigme}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des indices');
  }
  return await res.json()
}

/*
 * Méthode pour récupérer une enigme par son id
  * @returns Promise<any> L'enigme
  * @throws Error si la récupération de l'enigme échoue
  * @example const enigme = await getEnigme(1);
  * @params id_enigmes L'identifiant d'une énigme
  */ 
export async function getEnigmeById(id_enigme: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes/${id_enigme}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de l\'énigme');
  }
  return await res.json();
}

/*
 * Méthode pour récupérer toutes les énigmes des participants
 * @returns Promise<any> Un tableau d'énigmes des participants
 * @throws Error si la récupération des énigmes échoue
 * @example const enigmes = await getAllEnigmesParticipants(1);
 * @params id_enigmes L'identifiant d'une énigme
 */
export async function getAllEnigmesParticipants(id_enigme: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes/participants/${id_enigme}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des énigmes des participants');
  }
  return await res.json();
}