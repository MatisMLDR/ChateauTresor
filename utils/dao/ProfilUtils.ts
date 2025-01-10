import dotenv from 'dotenv';
dotenv.config();

/**
 * Récupère un profil par son ID
 * @param id_user L'ID du profil à récupérer
 * @returns Promise<any> Le profil
 * @throws Error si la récupération échoue
 * @example const profil = await getProfilById("user_id");
 */
export async function getProfilById(id_user: string): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/profils/${id_user}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des profils');
    }
    return await res.json();
}

/**
 * Récupère tous les profils
 * @returns Promise<any[]> Tableau des profils
 * @throws Error si la récupération échoue
 * @example const profils = await getAllProfils();
 */
export async function getAllProfils(): Promise<any[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/profils`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des profils');
    }
    return await res.json();
}

/**
 * Crée un nouveau profil
 * @param profil Les données du profil à créer
 * @returns Promise<any> Le profil créé
 * @throws Error si la création échoue
 * @example const newProfil = await createProfil({ username: 'JohnDoe', email: 'john@example.com' });
 */
export async function createProfil(profil: any): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/profils`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profil),
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la création du profil');
    }
    return await res.json();
}

/**
 * Met à jour un profil existant
 * @param profil Les données mises à jour du profil
 * @returns Promise<any> Le profil mis à jour
 * @throws Error si la mise à jour échoue
 * @example const updatedProfil = await updateProfil({ id: "user_id", username: 'NewUsername' });
 */
export async function updateProfil(profil: any): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/profils/${profil.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profil),
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
    }
    return await res.json();
}

/**
 * Supprime un profil par son ID
 * @param id_user L'ID du profil à supprimer
 * @returns Promise<void> Rien en cas de succès
 * @throws Error si la suppression échoue
 * @example await deleteProfil("user_id");
 */
export async function deleteProfil(id_user: string): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/profils/${id_user}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la suppression du profil');
    }
}