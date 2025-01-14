/*
 * DAO pour les membres de l'équipe
 */
import { MembreEquipeType } from '@/types';
import { MembreEquipeClass } from '@/classes/MembreEquipe';

const BASE_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/membres`; // URL de base pour les requêtes

/*
 * Méthode pour récupérer un membre par son ID
 * @param id_membre L'identifiant du membre
 * @returns Promise<MembreEquipeClass> Une instance de MembreEquipeClass
 * @throws Error si la récupération échoue
 */
export async function getMembreById(id_membre: UUID): Promise<MembreEquipeClass> {
  const res = await fetch(`${BASE_URL}/${id_membre}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du membre');
  }
  const membre: MembreEquipeType = await res.json();
  return new MembreEquipeClass(membre);
}

/*
 * Méthode pour récupérer tous les membres d'une équipe
 * @param id_equipe L'identifiant de l'équipe
 * @returns Promise<MembreEquipeClass[]> Une liste des membres de l'équipe
 * @throws Error si la récupération échoue
 */
export async function getAllMembresByEquipe(id_equipe: UUID): Promise<MembreEquipeClass[]> {
  const res = await fetch(`${BASE_URL}/equipe/${id_equipe}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des membres de l\'équipe');
  }
  const membres: MembreEquipeType[] = await res.json();
  return membres.map(membre => new MembreEquipeClass(membre));
}

/*
 * Méthode pour mettre à jour les informations d'un membre
 * @param id_membre L'identifiant du membre
 * @param data Les nouvelles données du membre
 * @returns Promise<MembreEquipeClass> Une instance mise à jour de MembreEquipeClass
 * @throws Error si la mise à jour échoue
 */
export async function updateMembre(membre: any): Promise<MembreEquipeClass> {
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
  return new MembreEquipeClass(membre2);
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
 * @returns Promise<MembreEquipeClass> Une instance de MembreEquipeClass pour le membre créé
 * @throws Error si la création échoue
 */
export async function createMembre(membre: any): Promise<MembreEquipeClass> {
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
  return new MembreEquipeClass(newMembre);
}
