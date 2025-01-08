/*
 * Méthode pour récupérer tout les indices associés aux participants
    * @returns Promise<any> Un tableau d'indices
    * @throws Error si la récupération des indices échoue
    * @example const indices = await getAllIndices();
    * @param id_indice - l'id de l'indice
*/ 
export async function getAllIndicesParticipants(id_indice: number): Promise<any> {
    const res = await fetch(`/api/indices/participants?id_indice=${id_indice}`);
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
export async function getIndiceById(id: string): Promise<any> {
    const res = await fetch(`/api/indices/${id}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération de l\'indice');
    }
    return await res.json();
}
