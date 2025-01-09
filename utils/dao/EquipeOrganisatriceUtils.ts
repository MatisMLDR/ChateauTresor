/*
 * Méthode pour récupérer une équipe organisatrice par son ID
 * @param id_equipe Le ID de l'équipe organisatrice
 * @returns Promise<any> L'équipe organisatrice correspondante
 * @throws Error si la récupération échoue
 * @example const equipe = await getEquipeById(1);
 */
export async function getEquipeById(id_equipe: number): Promise<any> {
  const res = await fetch(`/api/equipes/${id_equipe}`);
  if (!res.ok) {
    throw new Error(`Erreur lors de la récupération de l'équipe organisatrice avec l'ID ${id_equipe}`);
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
  const res = await fetch(`/api/equipes`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de toutes les équipes organisatrices');
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
export async function createEquipe(equipe: any): Promise<any> {
  const res = await fetch(`/api/equipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipe),
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la création de l\'équipe organisatrice');
  }
  return await res.json();
}

/*
 * Méthode pour mettre à jour une équipe organisatrice
 * @param id_equipe Le ID de l'équipe à mettre à jour
 * @param updatedData Les nouvelles données de l'équipe
 * @returns Promise<any> Les données mises à jour de l'équipe
 * @throws Error si la mise à jour échoue
 * @example const updatedEquipe = await updateEquipe(1, updatedData);
 */
export async function updateEquipe(id_equipe: number, updatedData: any): Promise<any> {
  const res = await fetch(`/api/equipes/${id_equipe}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour de l'équipe organisatrice avec l'ID ${id_equipe}`);
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
export async function deleteEquipe(id_equipe: number): Promise<void> {
  const res = await fetch(`/api/equipes/${id_equipe}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression de l'équipe organisatrice avec l'ID ${id_equipe}`);
  }
}
