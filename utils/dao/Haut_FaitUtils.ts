/**
 * @param id_haut_fait 
 * @returns Promise<any> Le tableau des hauts faits
 * @throws Error si la récupération des hauts faits échoue
 * @example const haut_fait = await getHaut_FaitById(1);
 */
export async function getHaut_FaitById(id_haut_fait:number): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/haut_fait/${id_haut_fait}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des hauts faits');
    }
    return await res.json()  
}

/**
 * @returns Promise<any> Le tableau des hauts faits
 * @throws Error si la récupération des hauts faits échoue
 * @example const haut_fait = await getAllHaut_Faits();
 */
export async function getAllHaut_Faits(): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/haut_fait`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des hauts faits');
    }
    return await res.json()
}