import dotenv from 'dotenv';
dotenv.config();

/**
 * Récupère un texte par son id
 * @returns Promise<any> Le tableau des textes
 * @throws Error si la récupération des textes échoue
 * @example const textes = await getAllTexte();
 */
export async function getTexteById(id_indice:number): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/texte/${id_indice}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des textes');
    }
    return await res.json()  
}

/**
 * Récupère tous les textes
 * @returns Promise<any> Le tableau des textes
 * @throws Error si la récupération des textes échoue
 * @example const textes = await getAllTexte();
 */
export async function getAllTextes(): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/texte`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des textes');
    }
    return await res.json()
}
