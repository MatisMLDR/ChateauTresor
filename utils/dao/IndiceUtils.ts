import dotenv from 'dotenv';
dotenv.config();

/*
 * Méthode pour récupérer tous les indices d'une énigme
 * @returns Promise<any> Le tableau des indices de l'énigme
 * @throws Error si la récupération des indices échoue
 * @example const indices = await getAllIndicesByEnigme(1);
 * @params id_enigme L'identifiant d'une énigme
 */
export async function getAllIndicesByEnigme(id_enigme: number): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/enigme?id_enigme=${id_enigme}`);
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des indices');
    }
    return await res.json();
  }
  
/*
 * Méthode pour récupérer tout les indices associés aux participants
    * @returns Promise<any> Un tableau d'indices
    * @throws Error si la récupération des indices échoue
    * @example const indices = await getAllIndices();
    * @param id_indice - l'id de l'indice
*/ 
export async function getAllIndicesParticipants(id_indice: number): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/participants?id_indice=${id_indice}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des indices');
    }
    return await res.json();
}

/*
 * Méthode pour récupérer un indice à partir de son id
    * @returns Promise<any> Un tableau avec un seul indice
    * @throws Error si la récupération des indices échoue
    * @example const indices = await getAllIndices();
*/
export async function getIndiceById(id: number): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/${id}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération de l\'indice');
    }
    return await res.json();
}

/*
* Méthode pour récupérer toutes les indices d'une chasse
* @returns Promise<any> Un tableau d'indices
* @throws Error si la récupération des indices échoue
* @example const indices = await getAllIndicesByChasse(1);
*/
export async function getAllIndicesByChasse(id_chasse: number): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/chasse?id_chasse=${id_chasse}`);
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des indices');
    }
    return await res.json();
  }