import dotenv from 'dotenv';
import { UUID } from 'crypto';
dotenv.config();

/**
 * Méthode pour récupérer une récompense par son ID
 * @param id_recompense L'identifiant de la récompense
 * @returns Promise<any> La récompense
 * @throws Error si la récupération échoue
 * @example const recompense = await getRecompenseById(1);
 */
export async function getRecompenseById(id_recompense: UUID): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/recompenses/${id_recompense}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération de la récompense');
    }
    return await res.json();
}

/**
 * Méthode pour récupérer toutes les récompenses d'une chasse
 * @returns Promise<any> Le tableau des récompenses
 * @throws Error si la récupération échoue
 * @example const recompenses = await getAllRecompensesByChasse();
 */
export async function getAllRecompensesByChasse(id_chasse: UUID): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/recompenses/chasse?id_chasse=${id_chasse}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des récompenses de la chasse');
    }
    return await res.json();
}

/**
 * Méthode pour créer une nouvelle récompense
 * @param recompense Les données de la nouvelle récompense
 * @returns Promise<any> La récompense créée
 * @throws Error si la création échoue
 * @example const newRecompense = await createRecompense(recompenseData);
 */
export async function createRecompense(recompense: any): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/recompenses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recompense),
    });

    if (!res.ok) {
        throw new Error('Erreur lors de la création de la récompense');
    }
    return await res.json();
}

/**
 * Méthode pour mettre à jour une récompense
 * @param id_recompense L'identifiant de la récompense à mettre à jour
 * @param updatedData Les nouvelles données de la récompense
 * @returns Promise<any> La récompense mise à jour
 * @throws Error si la mise à jour échoue
 * @example const updatedRecompense = await updateRecompense(1, updatedData);
 */
export async function updateRecompense(recompense: any): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/recompenses/${recompense.id_recompense}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recompense),
    });

    if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour de la récompense');
    }
    return await res.json();
}

/**
 * Méthode pour supprimer une récompense
 * @param id_recompense L'identifiant de la récompense à supprimer
 * @returns Promise<void>
 * @throws Error si la suppression échoue
 * @example await deleteRecompense(1);
 */
export async function deleteRecompense(id_recompense: UUID): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/recompenses/${id_recompense}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Erreur lors de la suppression de la récompense');
    }
}


/**
 * Méthode pour récupérer les récompenses d'une chasse avec un score maximal (via POST)
 * @param id_chasse L'identifiant de la chasse
 * @param score Le score maximal pour filtrer les récompenses
 * @returns Promise<any> Le tableau des récompenses filtrées
 * @throws Error si la récupération échoue
 * @example const recompenses = await getRecompensesByChasseAndMaxScore(id_chasse, 100);
 */
export async function getRecompensesByChasseAndScore(id_chasse: UUID, score: number): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/recompenses/score`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_chasse, score }),
    });

    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des récompenses filtrées');
    }
    return await res.json();
}