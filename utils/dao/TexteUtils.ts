import { UUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Récupère un texte par son ID
 * @param id_indice L'identifiant du texte à récupérer
 * @returns Promise<any> Le texte
 * @throws Error si la récupération échoue
 * @example const texte = await getTexteById(1);
 */
export async function getTexteById(id_indice: UUID): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/textes/${id_indice}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des textes');
    }
    return await res.json();
}

/**
 * Récupère tous les textes
 * @returns Promise<any[]> Le tableau des textes
 * @throws Error si la récupération échoue
 * @example const textes = await getAllTextes();
 */
export async function getAllTextes(): Promise<any[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/textes`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des textes');
    }
    return await res.json();
}

/**
 * Crée un nouveau texte
 * @param texte Les données du texte à créer
 * @returns Promise<any> Le texte créé
 * @throws Error si la création échoue
 * @example const newTexte = await createTexte({ contenu: 'Nouveau texte', id_indice: 1 });
 */
export async function createTexte(texte: any): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/textes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(texte),
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la création des textes');
    }
    return await res.json();
}

/**
 * Met à jour un texte existant
 * @param texte Les données mises à jour du texte
 * @returns Promise<any> Le texte mis à jour
 * @throws Error si la mise à jour échoue
 * @example const updatedTexte = await updateTexte({ id: 1, contenu: 'Texte mis à jour' });
 */
export async function updateTexte(texte: any): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/textes/${texte.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(texte),
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour des textes');
    }
    return await res.json();
}

/**
 * Supprime un texte par son ID
 * @param id_indice L'identifiant du texte à supprimer
 * @returns Promise<void> Rien en cas de succès
 * @throws Error si la suppression échoue
 * @example await deleteTexte(1);
 */
export async function deleteTexte(id_indice: UUID): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/textes/${id_indice}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la suppression des textes');
    }
}