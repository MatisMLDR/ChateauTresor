import dotenv from 'dotenv';
import { UUID } from 'crypto';
dotenv.config();

/*
* Méthode pour récupérer la liste de toutes les chasses
* @returns Promise<any> Un tableau de toutes les chasses
* @throws Error si la récupération des chasses échoue
* @example const chasses = await getAllChasses();
*/
export async function getAllChasses(): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses`);
  if (!res.ok) {
      throw new Error('Erreur lors de la récupération des chasses');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les chasses associées à un château
* @returns Promise<any> Un tableau de chasses
* @throws Error si la récupération des chasses échoue
* @example const chasses = await getAllChassesByChateau();
*/
export async function getAllChassesByChateau(id_chateau: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/chateau?id_chateau=${id_chateau}`);
  if (!res.ok) {
      throw new Error('Erreur lors de la récupération des chasses');
  }
  return await res.json();
}

/*
* Méthode pour récupérer les chasses correspondantes à l'id d'une équipe
* @returns Promise<any> Les chasses correspondantes à l'id d'une équipe
* @throws Error si la récupération des chasses échoue
* @example const chasse = await getChasseByEquipeId(1);
*/
export async function getChassesByEquipeId(id_equipe: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/equipe?id_equipe=${id_equipe}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des chasses de l\'équipe');
  }
  return await res.json();
}

/*
* Méthode pour récupérer une chasse par son id
* @returns Promise<any> La chasse correspondante à l'id
* @throws Error si la récupération de la chasse échoue
* @example const chasse = await getChasseById(1);
*/
export async function getChasseById(id_chasse: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de la chasse');
  }
  return await res.json();
}

/*
* Méthode pour créer une nouvelle chasse
* @param chasse Les données de la chasse à créer
* @returns Promise<any> La chasse créée
* @throws Error si la création de la chasse échoue
* @example const nouvelleChasse = await createChasse(data);
*/
export async function createChasse(chasse: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chasse),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création de la chasse');
  }
  return await res.json();
}

/**
 * Méthode pour mettre à jour une chasse
 * @param chasse L'objet chasse contenant les données à mettre à jour
 * @returns Promise<any> La chasse mise à jour
 * @throws Error si la mise à jour échoue
 * @example const updatedChasse = await updateChasse(chasse);
 */
export async function updateChasse(chasse: any): Promise<any> {
  if (!chasse.id_chasse) {
    throw new Error("L'objet chasse doit contenir un 'id_chasse'");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/${chasse.id_chasse}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chasse),
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour de la chasse avec l'ID ${chasse.id_chasse}`);
  }

  return await res.json();
}

/*
* Méthode pour supprimer une chasse
* @param id_chasse L'id de la chasse à supprimer
* @returns Promise<void> Une réponse vide en cas de succès
* @throws Error si la suppression échoue
* @example await deleteChasse(1);
*/
export async function deleteChasse(id_chasse: UUID): Promise<void> {
  console.log("DeleteChasse : ChasseUtils : ", id_chasse);
  console.log("URL : ",`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/${id_chasse}`)
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/${id_chasse}`, {
    method: 'DELETE',
  });
  console.log("RES : ", res);
  if (!res.ok) {
    console.log("Erreur lors de la suppression de la chasse");
    throw new Error('Erreur lors de la suppression de la chasse');
  }
}

/*
* Méthode pour récupérer toutes les participations à une chasse
* @returns Promise<any> Un tableau de participations
* @throws Error si la récupération des participations échoue
* @example const participations = await getAllParticipations();
*/
export async function getAllParticipations(id_chasse: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations');
  }
  return await res.json();
}

/**
 * Méthode pour récupérer toutes les énigmes d'une chasse
 * @param id_chasse
 */
export const getAllEnigmesByChasse = async (id_chasse: UUID): Promise<any[]> => {
  try {
    // Exemple avec une API
    const response = await fetch(`/api/enigmes/chasse?id_chasse=${id_chasse}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des énigmes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur dans getAllEnigmesByChasse:', error);
    throw error;
  }
};

/*
 * Méthode pour récupérer une participation par son id
 * @returns Promise<boolean> True si la chasse n'est pas complète pour le jour donné, false sinon
 * @throws Error si la récupération de la disponibilité échoue
 */
export async function isChasseAvailableForDay(id_chasse: UUID, day: Date): Promise<boolean> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/disponibilte?id_chasse=${id_chasse}&jour=${day.toISOString()}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de la disponibilité de la chasse');
  }

  return await res.json();
}

/*
 * Méthode pour récupérer toutes les chasses disponibles à partir de la vue
 * @returns Promise<any> Un tableau de chasses disponibles
 * @throws Error si la récupération des chasses disponibles échoue
 * @example const chassesDisponibles = await getAllChassesDisponibles();
*/
export async function getAllChassesDisponibles(): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/disponibles`);
  
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des chasses disponibles');
  }
  return await res.json();
}

export async function getAllChassesFinies(): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/finies`);
  
  if (res.status === 404) {
    return [];
  }
  
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des chasses disponibles');
  }
  return await res.json();
}

export async function getClassementPointsOfChasse(id_chasse: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/classement/chasses/${id_chasse}/points`);
  
  if (res.status === 404) {
    return [];
  }
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du classement par points');
  }
  return await res.json();
}

export async function getChassesByParticipant(participantId: UUID) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/participant?participantId=${participantId}`
    );

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Erreur ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error('DAO Error:', error);
    return [];
  }
}
