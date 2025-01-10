import dotenv from 'dotenv';
dotenv.config();

/**
 * @param id_haut_fait 
 * @returns Promise<any> Le haut fait correspondant
 * @throws Error si la récupération échoue
 * @example const haut_fait = await getHaut_FaitById(1);
 */
export async function getHaut_FaitById(id_haut_fait: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/haut_fait/${id_haut_fait}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du haut fait');
  }
  return await res.json();
}

/**
 * @returns Promise<any[]> Tous les hauts faits
 * @throws Error si la récupération échoue
 * @example const hautsFaits = await getAllHaut_Faits();
 */
export async function getAllHaut_Faits(): Promise<any[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/haut_fait`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des hauts faits');
  }
  return await res.json();
}

/**
 * @param hautFait Les données du haut fait à créer
 * @returns Promise<any> Le haut fait créé
 * @throws Error si la création échoue
 * @example const nouveauHautFait = await createHaut_Fait({ titre: 'Nouveau', description: 'Description' });
 */
export async function createHaut_Fait(hautFait: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/haut_fait`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(hautFait),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création du haut fait');
  }
  return await res.json();
}

/**
 * @param id_haut_fait L'identifiant du haut fait à mettre à jour
 * @param updatedData Les données mises à jour
 * @returns Promise<any> Le haut fait mis à jour
 * @throws Error si la mise à jour échoue
 * @example const hautFaitMisAJour = await updateHaut_Fait(1, { titre: 'Mis à jour' });
 */
export async function updateHaut_Fait(haut_fait: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/haut_fait/${haut_fait.id_haut_fait}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(haut_fait),
  });
  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour du haut fait avec l'ID ${haut_fait.id_haut_fait}`);
  }
  return await res.json();
}

/**
 * @param id_haut_fait L'identifiant du haut fait à supprimer
 * @returns Promise<void> Rien en cas de succès
 * @throws Error si la suppression échoue
 * @example await deleteHaut_Fait(1);
 */
export async function deleteHaut_Fait(id_haut_fait: number): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/haut_fait/${id_haut_fait}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression du haut fait avec l'ID ${id_haut_fait}`);
  }
}