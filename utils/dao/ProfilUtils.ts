import dotenv from 'dotenv';
dotenv.config();

/**
 * Récupère un profil par son id
 * @returns Promise<any> Le profil
 * @throws Error si la récupération des profils échoue
 * @example const profil = await getProfilById(1);
 */
export async function getProfilById(id_user: string): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/profil/${id_user}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des profils');
    }
    return await res.json()
}

/**
 * Récupère tous les profils
 * @returns Promise<any> Le tableau des profils
 * @throws Error si la récupération des profils échoue
 * @example const profils = await getAllProfils();
 */
export async function getAllProfils(): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/profil`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des profils');
    }
    return await res.json()
}