import { AvisType } from '@/types';
import dotenv from 'dotenv';
import { UUID } from 'crypto';

dotenv.config();

/**
 * Fonction permettant de récupérer tous les avis d'une chasse
 * @returns Promise<any> Le tableau des avis de la chasse
 * @throws Error si la récupération des avis échoue
 * @example const avis = await getAllAvisByChasse(1);
 * @params id_chasse L'identifiant d'une chasse
 **/
export async function getAllAvisByChasse(id_chasse: UUID): Promise<any[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis/chasse?id_chasse=${id_chasse}`);
    
    // Si la réponse n'est pas OK, lever une erreur
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des avis');
    }

    // Retourner les données JSON
    return await res.json();
  } catch (error) {
    console.error('Erreur dans getAllAvisByChasse:', error);
    throw error;
  }
}

/**
 * Fonction permettant de récupérer un avis par son id
 * @returns Promise<any> L'avis
 * @throws Error si la récupération de l'avis échoue
 * @example const avis = await getAvisById(1);
 * @params id_avis L'identifiant d'un avis
 **/
export async function getAvisById(id_avis: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis/${id_avis}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de l\'avis');
  }
  return await res.json();
}

/**
 * Fonction permettant de créer un avis
 * @param avis Les données de l'avis à créer
 * @returns Promise<any> L'avis créé
 * @throws Error si la création échoue
 * @example const nouvelAvis = await createAvis({ note: 5, titre: 'Super', description: 'Excellent' });
 **/
export async function createAvis(avis: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(avis),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création de l\'avis');
  }
  return await res.json();
}

/**
 * Fonction permettant de modifier un avis
 * @param id_avis L'identifiant de l'avis à modifier
 * @param updatedData Les nouvelles données de l'avis
 * @returns Promise<any> L'avis modifié
 * @throws Error si la modification échoue
 * @example const avisMisAJour = await updateAvis(1, { note: 4, titre: 'Bien' });
 **/
export async function updateAvis(avis: any): Promise<any> {
  if (!avis.id_avis) {
    throw new Error("L'objet avis doit contenir un 'id_avis'");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis/${avis.id_avis}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(avis),
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour de l'avis avec l'ID ${avis.id_avis}`);
  }

  return await res.json();
}

/**
 * Fonction permettant de supprimer un avis
 * @param id_avis L'identifiant de l'avis à supprimer
 * @returns Promise<void> Rien en cas de succès
 * @throws Error si la suppression échoue
 * @example await deleteAvis(1);
 **/
export async function deleteAvis(id_avis: UUID): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis/${id_avis}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression de l'avis avec l'ID ${id_avis}`);
  }
}