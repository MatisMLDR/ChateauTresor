import { ChateauType } from '@/types';
import { UUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/*
* Méthode pour récupérer les informations d'un château spécifique
* @returns Promise<any> Les données du château
* @throws Error si la récupération des données du château échoue
* @example const chateau = await getChateauDetails();
*/
export async function getChateauDetails(id_chateau: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chateaux/?id_chateau=${id_chateau}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des détails du château');
  }
  return await res.json();
}

/*
 * Méthode pour récupérer la liste de tous les châteaux
 * @returns Promise<any> Un tableau de châteaux
 * @throws Error si la récupération des châteaux échoue
 * @example const chateaux = await getAllChateaux();
 */
export async function getAllChateaux(): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chateaux`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des châteaux');
  }
  return await res.json();
}

/*
* Méthode pour récupérer un château par son id
* @returns Promise<any> Les données du château
* @throws Error si la récupération du château échoue
* @example const chateau = await getChateauById(1);
*/
export async function getChateauById(id_chateau: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chateaux/${id_chateau}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération du château');
  }
  return await res.json();
}

/*
* Méthode pour créer un nouveau château
* @param chateau Les données du château à créer
* @returns Promise<any> Les données du château créé
* @throws Error si la création échoue
* @example const nouveauChateau = await createChateau(data);
*/
export async function createChateau(chateau: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chateaux`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chateau),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création du château');
  }
  return await res.json();
}

/*
* Méthode pour mettre à jour un château
* @param chateau Les données du château à mettre à jour
* @returns Promise<any> Les données du château mis à jour
* @throws Error si la mise à jour échoue
* @example const updatedChateau = await updateChateau(chateau);
*/
export async function updateChateau(chateau: any): Promise<any> {
  if (!chateau.id_chateau) {
    throw new Error("L'objet château doit contenir un 'id_chateau'");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chateaux/${chateau.id_chateau}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chateau),
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour du château avec l'ID ${chateau.id_chateau}`);
  }

  return await res.json();
}

/*
* Méthode pour supprimer un château
* @param id_chateau L'identifiant du château à supprimer
* @returns Promise<void>
* @throws Error si la suppression échoue
* @example await deleteChateau(1);
*/
export async function deleteChateau(id_chateau: UUID): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chateaux/${id_chateau}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression du château avec l'ID ${id_chateau}`);
  }
}

export async function getPaginatedChateaux(params: { 
  page: number;
  pageSize: number;
  searchQuery?: string;
}): Promise<{ 
  data: ChateauType[];
  total: number;
}> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chateaux/pagination`);
    
    url.searchParams.append('page', params.page.toString());
    url.searchParams.append('pageSize', params.pageSize.toString());
    if(params.searchQuery) {
      url.searchParams.append('search', params.searchQuery);
    }

    const res = await fetch(url.toString());
    
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération paginée des châteaux');
    }
    
    const response = await res.json();
    
    return {
      data: response.data,
      total: response.totalItems
    };
  } catch (error) {
    console.error('Erreur dans getPaginatedChateaux:', error);
    throw new Error('Erreur lors de la récupération des châteaux');
  }
}