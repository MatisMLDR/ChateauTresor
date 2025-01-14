import { UUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/*
 * Méthode pour récupérer une énigme par son id
 * @returns Promise<any> L'énigme
 * @throws Error si la récupération de l'énigme échoue
 * @example const enigme = await getEnigmeById(1);
 * @params id_enigme L'identifiant d'une énigme
 */
export async function getEnigmeById(id_enigme: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes/${id_enigme}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de l\'énigme');
  }
  return await res.json();
}

/*
 * Méthode pour récupérer toutes les énigmes des participants
 * @returns Promise<any> Un tableau d'énigmes des participants
 * @throws Error si la récupération des énigmes échoue
 * @example const enigmes = await getAllEnigmesParticipants(1);
 * @params id_enigme L'identifiant d'une énigme
 */
export async function getAllEnigmesParticipants(id_enigme: UUID): Promise<any[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes/participants/${id_enigme}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des énigmes des participants');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/*
 * Méthode pour récupérer toutes les énigmes d'une chasse
 * @returns Promise<any> Un tableau d'énigmes
 * @throws Error si la récupération des énigmes échoue
 * @example const enigmes = await getAllEnigmesByChasse(1);
 * @params id_chasse L'identifiant de la chasse
 */
export async function getAllEnigmesByChasse(id_chasse: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des énigmes');
  }
  return await res.json();
}

/*
 * Méthode pour créer une nouvelle énigme
 * @param enigme Les données de l'énigme à créer
 * @returns Promise<any> L'énigme créée
 * @throws Error si la création échoue
 * @example const newEnigme = await createEnigme(enigmeData);
 */
export async function createEnigme(enigme: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enigme),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création de l\'énigme');
  }
  return await res.json();
}

/*
 * Méthode pour mettre à jour une énigme
 * @param id_enigme L'id de l'énigme à mettre à jour
 * @param updatedData Les nouvelles données de l'énigme
 * @returns Promise<any> L'énigme mise à jour
 * @throws Error si la mise à jour échoue
 * @example const updatedEnigme = await updateEnigme(1, updatedData);
 */
export async function updateEnigme(enigme: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes/${enigme.id_enigme}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enigme),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour de l\'énigme');
  }
  return await res.json();
}

/*
 * Méthode pour supprimer une énigme
 * @param id_enigme L'id de l'énigme à supprimer
 * @returns Promise<void> Aucune réponse en cas de succès
 * @throws Error si la suppression échoue
 * @example await deleteEnigme(1);
 */
export async function deleteEnigme(id_enigme: UUID): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes/${id_enigme}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression de l\'énigme');
  }
}