import { UUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/*
 * Méthode pour récupérer tous les indices d'une énigme
 * @returns Promise<any> Le tableau des indices de l'énigme
 * @throws Error si la récupération des indices échoue
 * @example const indices = await getAllIndicesByEnigme(1);
 * @params id_enigme L'identifiant d'une énigme
 */
export async function getAllIndicesByEnigme(id_enigme: UUID): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/enigme?id_enigme=${id_enigme}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des indices');
    }
    return await res.json();
}

/*
 * Méthode pour récupérer tous les indices associés aux participants
 * @returns Promise<any> Un tableau d'indices
 * @throws Error si la récupération des indices échoue
 * @example const indices = await getAllIndicesParticipants(1);
 * @param id_indice L'identifiant de l'indice
 */
export async function getAllIndicesParticipants(id_indice: UUID): Promise<any> {
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
 * @example const indices = await getIndiceById(1);
 */
export async function getIndiceById(id_indice: UUID): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/${id_indice}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération de l\'indice');
    }
    return await res.json();
}

/*
 * Méthode pour récupérer tous les indices d'une chasse
 * @returns Promise<any> Un tableau d'indices
 * @throws Error si la récupération des indices échoue
 * @example const indices = await getAllIndicesByChasse(1);
 */
export async function getAllIndicesByChasse(id_chasse: UUID): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/chasse?id_chasse=${id_chasse}`);
    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des indices');
    }
    return await res.json();
}

/*
 * Méthode pour créer un nouvel indice
 * @param indice Les données de l'indice à créer
 * @returns Promise<any> L'indice créé
 * @throws Error si la création échoue
 * @example const nouvelIndice = await createIndice({ contenu: 'Nouvel Indice', ordre: 1 });
 */
export async function createIndice(indice: any): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(indice),
    });
    if (!res.ok) {
        throw new Error('Erreur lors de la création de l\'indice');
    }
    return await res.json();
}

/*
 * Méthode pour mettre à jour un indice
 * @param id_indice L'identifiant de l'indice à mettre à jour
 * @returns Promise<any> L'indice mis à jour
 * @throws Error si la mise à jour échoue
 * @example const updatedIndice = await updateIndice(1, { contenu: 'Indice mis à jour' });
 */
export async function updateIndice(indice: any): Promise<any> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/${indice.id_indice}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(indice),
    });
    if (!res.ok) {
        throw new Error(`Erreur lors de la mise à jour de l'indice avec l'ID ${indice.id_indice}`);
    }
    return await res.json();
}

/*
 * Méthode pour supprimer un indice
 * @param id_indice L'identifiant de l'indice à supprimer
 * @returns Promise<void>
 * @throws Error si la suppression échoue
 * @example await deleteIndice(1);
 */
export async function deleteIndice(id_indice: UUID): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/${id_indice}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error(`Erreur lors de la suppression de l'indice avec l'ID ${id_indice}`);
    }
}