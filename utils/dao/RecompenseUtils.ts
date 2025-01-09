/**
 * @param id_recompense 
 * @returns promise<any> Le tableau des récompenses
 * @throws Error si la récupération des récompenses échoue
 * @example const recompense = await getRecompenseById(1);
 */
export async function getRecompenseById(id_recompense:number): Promise<any> {
    const res = await fetch(`/api/recompense/${id_recompense}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des récompenses');
    }
    return await res.json()  
}

/**
 * @returns Promise<any> Le tableau des récompenses
 * @throws Error si la récupération des récompenses échoue
 * @example const recompense = await getAllRecompenses();
 */
export async function getAllRecompenses(): Promise<any> {
    const res = await fetch(`/api/recompense`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des récompenses');
    }
    return await res.json()
}