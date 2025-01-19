import { UUID } from 'crypto';

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;


/*
 * Méthode pour récupérer une équipe organisatrice par son ID
 * @param id_equipe Le ID de l'équipe organisatrice
 * @returns Promise<any> L'équipe organisatrice correspondante
 * @throws Error si la récupération échoue
 * @example const equipe = await getEquipeById(1);
 */
export async function getEquipeById(id_equipe: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/equipes/${id_equipe}`);
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération de l'équipe organisatrice avec l'ID ${id_equipe}`);
  }
  return await res.json();
}

export async function getEquipeByMembreId(id_membre: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/equipes/membre?id_membre=${id_membre}`);
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération de l'équipe organisatrice avec l'ID du membre ${id_membre}`);
  }
  return await res.json();
}


/*
 * Méthode pour récupérer toutes les équipes organisatrices
 * @returns Promise<any[]> Un tableau d'équipes organisatrices
 * @throws Error si la récupération échoue
 * @example const equipes = await getAllEquipes();
 */
export async function getAllEquipes(): Promise<any[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/equipes`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de toutes les équipes organisatrices');
  }
  return await res.json();
}
/*
 * Méthode pour récupérer toutes les équipes organisatrices vérifiées
 * @returns Promise<any[]> Un tableau d'équipes organisatrices vérifiées
 * @throws Error si la récupération échoue
 * @example const equipes = await getAllEquipesVerifiees();
 */
export async function getAllEquipesVerifiees(): Promise<any[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/equipes/verifiees`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de toutes les équipes organisatrices vérifiées');
  }
  return await res.json();
}

/*
 * Méthode pour créer une nouvelle équipe organisatrice
 * @param equipe Les données de l'équipe organisatrice
 * @returns Promise<any> Les données de l'équipe créée
 * @throws Error si la création échoue
 * @example const nouvelleEquipe = await createEquipe(equipeData);
 */
export async function createEquipe(equipe: any): Promise<void> {
  const res = await fetch(`${PUBLIC_URL}/api/equipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipe),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Response Error:', res.status, res.statusText);
    throw new Error(`Erreur lors de la création de l'équipe organisatrice: ${res.statusText}`);
  }
}

/*
 * Méthode pour mettre à jour une équipe organisatrice
 * @param id_equipe Le ID de l'équipe à mettre à jour
 * @param updatedData Les nouvelles données de l'équipe
 * @returns Promise<any> Les données mises à jour de l'équipe
 * @throws Error si la mise à jour échoue
 * @example const updatedEquipe = await updateEquipe(1, updatedData);
 */
export async function updateEquipe(equipe: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/equipes/${equipe.id_equipe}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipe),
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour de l'équipe organisatrice avec l'ID ${equipe.id_equipe}`);
  }
  return await res.json();
}

/*
 * Méthode pour supprimer une équipe organisatrice
 * @param id_equipe Le ID de l'équipe à supprimer
 * @returns Promise<void> Aucune réponse en cas de succès
 * @throws Error si la suppression échoue
 * @example await deleteEquipe(1);
 */
export async function deleteEquipe(id_equipe: UUID): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/equipes/${id_equipe}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression de l'équipe organisatrice avec l'ID ${id_equipe}`);
  }
}

export async function getAllDemandesOfEquipe(id_equipe: UUID): Promise<any[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/appartenances/demandes?id_equipe=${id_equipe}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des demandes de l\'équipe');
  }
  return await res.json();
}

export async function accepterDemandeEquipe(appartenanceData: any): Promise<void> {

  const res = await fetch(`${PUBLIC_URL}/api/appartenances/demandes/accepter`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appartenanceData),
  });

  if (!res.ok) {
    console.log("res", res);
    throw new Error('Erreur lors de l\'acceptation de la demande');
  }
}

export async function refuserDemandeEquipe(appartenanceData: any): Promise<void> {
  const res = await fetch(`${PUBLIC_URL}}/api/appartenances/demandes/refuser`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appartenanceData),
  });

  if (!res.ok) {
    throw new Error('Erreur lors du refus de la demande');
  }
}

export async function getAllChassesOfEquipe(id_equipe: UUID): Promise<any[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/equipe?id_equipe=${id_equipe}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des chasses de l\'équipe');
  }
  return await res.json();
}
