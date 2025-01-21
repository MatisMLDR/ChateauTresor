/*
 * DAO pour les proprietaires de l'équipe
 */
import { ProprietaireType } from '@/types';
import { UUID } from 'crypto';
import { Proprietaire } from '@/classes/Proprietaire';

const BASE_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/proprietaires`; // URL de base pour les requêtes

/*
 * Méthode pour récupérer un proprietaire par son ID
 * @param id_proprietaire L'identifiant du proprietaire
 * @returns Promise<Proprietaire> Une instance de Proprietaire
 * @throws Error si la récupération échoue
 */
export async function getProprietaireById(id_proprietaire: UUID): Promise<Proprietaire> {
  const res = await fetch(`${BASE_URL}/${id_proprietaire}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du proprietaire');
  }
  const proprietaire: ProprietaireType = await res.json();
  return new Proprietaire(proprietaire);
}

export async function getProprietaireByUserId(id_user: UUID): Promise<any> {
  const res = await fetch(`${BASE_URL}/user?id_user=${id_user}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du user');
  }
  return await res.json();
}

/*
 * Méthode pour mettre à jour les informations d'un proprietaire
 * @param id_proprietaire L'identifiant du proprietaire
 * @param data Les nouvelles données du proprietaire
 * @returns Promise<Proprietaire> Une instance mise à jour de proprietaire
 * @throws Error si la mise à jour échoue
 */
export async function updateProprietaire(proprietaire: ProprietaireType): Promise<Proprietaire> {
  const res = await fetch(`${BASE_URL}/${proprietaire.id_proprietaire}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proprietaire),
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour du proprietaire');
  }
  const proprietaireUpdated: ProprietaireType = await res.json();
  return new Proprietaire(proprietaireUpdated);
}

/*
 * Méthode pour supprimer un proprietaire par son ID
 * @param id_proprietaire L'identifiant du proprietaire
 * @returns Promise<void>
 * @throws Error si la suppression échoue
 */
export async function deleteProprietaire(id_proprietaire: UUID): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id_proprietaire}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la suppression du proprietaire');
  }
}

/*
 * Méthode pour créer un nouveau proprietaire
 * @param proprietaire Les données du nouveau proprietaire
 * @returns Promise<Proprietaire> Une instance de proprietaireEquipe pour le proprietaire créé
 * @throws Error si la création échoue
 */
export async function createProprietaire(proprietaire: any): Promise<Proprietaire> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proprietaire),
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la création du proprietaire');
  }
  const newProprietaire: ProprietaireType = await res.json();
  return new Proprietaire(newProprietaire);
}