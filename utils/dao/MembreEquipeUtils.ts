/*
 * DAO pour les membres de l'équipe
 */
import { AppartenanceEquipeType, MembreEquipeType } from '@/types';
import { MembreEquipe } from '@/classes/MembreEquipe';
import { UUID } from 'crypto';

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const BASE_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/membres`; // URL de base pour les requêtes

/*
 * Méthode pour récupérer un membre par son ID
 * @param id_membre L'identifiant du membre
 * @returns Promise<MembreEquipe> Une instance de MembreEquipe
 * @throws Error si la récupération échoue
 */
export async function getMembreById(id_membre: UUID): Promise<MembreEquipe> {
  const res = await fetch(`${BASE_URL}/${id_membre}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du membre');
  }
  const membre: MembreEquipeType = await res.json();
  return new MembreEquipe(membre);
}

export async function getMembreByUserId(id_user: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/membres/user?id_user=${id_user}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du user');
  }
  return await res.json();
}

/*
 * Méthode pour récupérer tous les membres d'une équipe
 * @param id_equipe L'identifiant de l'équipe
 * @returns Promise<MembreEquipe[]> Une liste des membres de l'équipe
 * @throws Error si la récupération échoue
 */
export async function getAllMembresByEquipe(id_equipe: UUID): Promise<MembreEquipe[]> {
  const res = await fetch(`${BASE_URL}/equipe/${id_equipe}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des membres de l\'équipe');
  }
  const membres: MembreEquipeType[] = await res.json();
  return membres.map(membre => new MembreEquipe(membre));
}

/*
 * Méthode pour mettre à jour les informations d'un membre
 * @param id_membre L'identifiant du membre
 * @param data Les nouvelles données du membre
 * @returns Promise<MembreEquipe> Une instance mise à jour de MembreEquipe
 * @throws Error si la mise à jour échoue
 */
export async function updateMembre(membre: any): Promise<MembreEquipe> {
  const res = await fetch(`${BASE_URL}/${membre.id_membre}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(membre),
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour du membre');
  }
  const membre2: MembreEquipeType = await res.json();
  return new MembreEquipe(membre2);
}

/*
 * Méthode pour supprimer un membre par son ID
 * @param id_membre L'identifiant du membre
 * @returns Promise<void>
 * @throws Error si la suppression échoue
 */
export async function deleteMembre(id_membre: UUID): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id_membre}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la suppression du membre');
  }
}

/*
 * Méthode pour créer un nouveau membre
 * @param membre Les données du nouveau membre
 * @returns Promise<MembreEquipe> Une instance de MembreEquipe pour le membre créé
 * @throws Error si la création échoue
 */
export async function createMembre(membre: any): Promise<MembreEquipe> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(membre),
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la création du membre');
  }
  const newMembre: MembreEquipeType = await res.json();
  return new MembreEquipe(newMembre);
}

/* Méthode pour créer une appartenance membre-équipe
  * @param appartenanceData Les données de l'appartenance
  * @returns Promise<void>
  * @throws Error si la création échoue
  */
export async function createAppartenanceMembreEquipe(appartenanceData: AppartenanceEquipeType): Promise<void> {
  const res = await fetch(`${PUBLIC_URL}/appartenances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appartenanceData),
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la création de l\'appartenance');
  }
}

export async function deleteAppartenanceMembreEquipe(id_membre: UUID, id_equipe: UUID): Promise<void> {
  const res = await fetch(`${PUBLIC_URL}/appartenances/membre/${id_membre}/${id_equipe}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la suppression de l\'appartenance');
  }
}

export async function getAppartenanceMembreEquipe(id_membre: UUID, id_equipe: UUID): Promise<any> {
  const res = await fetch(`${PUBLIC_URL}/appartenances/membre/${id_membre}/${id_equipe}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de l\'appartenance');
  }
  return await res.json();
}

export async function getAllAppartenancesMembre(id_membre: UUID): Promise<any> {
  const res = await fetch(`${PUBLIC_URL}/appartenances/membre?id_membre=${id_membre}`);

  if (res.status != 404 && !res.ok) {
    throw new Error('Erreur lors de la récupération de l\'appartenance');
  }

  return await res.json();
}
