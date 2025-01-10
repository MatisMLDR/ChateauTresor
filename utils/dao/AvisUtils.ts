import { AvisType } from '@/types';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Fonction permettant de récupérer tous les avis d'une chasse
 * @returns Promise<any> Le tableau des avis de la chasse
 * @throws Error si la récupération des avis échoue
 * @example const avis = await getAllAvis(1);
 * @params id_chasse L'identifiant d'une chasse
 **/
export async function getAllAvis(id_chasse: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis/enigme?id_enigme=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des avis');
  }
  return await res.json()
}

/**
 * Fonction permettant de récupérer un avis par son id
 * @returns Promise<any> L'avis
 * @throws Error si la récupération de l'avis échoue
 * @example const avis = await getAvisById(1);
 * @params id_avis L'identifiant d'un avis
 **/
export async function getAvisById(id_avis: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis/${id_avis}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de l\'avis');
  }
  return await res.json()
}

export async function createAvis(avis:AvisType): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(avis)
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création de l\'avis');
  }
  return await res.json();
}