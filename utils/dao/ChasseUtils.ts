import dotenv from 'dotenv';
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
export async function getAllChassesByChateau(id_chateau: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/chateau?id_chateau=${id_chateau}`);
  if (!res.ok) {
      throw new Error('Erreur lors de la récupération des chasses');
  }
  return await res.json();
}

/*
* Méthode pour récupérer une chasse par son id
* @returns Promise<any> La chasse correspondante à l'id
* @throws Error si la récupération de la chasse échoue
* @example const chasse = await getChasseById(1);
*/
export async function getChasseById(id_chasse: number): Promise<any> {
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

/*
* Méthode pour mettre à jour une chasse
* @param id_chasse L'id de la chasse à mettre à jour
* @param updatedData Les nouvelles données de la chasse
* @returns Promise<any> La chasse mise à jour
* @throws Error si la mise à jour échoue
* @example const updatedChasse = await updateChasse(1, updatedData);
*/
export async function updateChasse(id_chasse: number, updatedData: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/${id_chasse}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour de la chasse');
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
export async function deleteChasse(id_chasse: number): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/chasses/${id_chasse}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression de la chasse');
  }
}

/*
* Méthode pour récupérer toutes les participations à une chasse
* @returns Promise<any> Un tableau de participations
* @throws Error si la récupération des participations échoue
* @example const participations = await getAllParticipations();
*/
export async function getAllParticipations(id_chasse: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les énigmes d'une chasse
* @returns Promise<any> Un tableau d'énigmes
* @throws Error si la récupération des énigmes échoue
* @example const enigmes = await getAllEnigmes();
*/
export async function getAllEnigmes(id_chasse: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/enigmes/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des énigmes');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les indices d'une chasse
* @returns Promise<any> Un tableau d'indices
* @throws Error si la récupération des indices échoue
* @example const indices = await getAllIndices();
*/
export async function getAllIndices(id_chasse: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/indices/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des indices');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les récompenses d'une chasse
* @returns Promise<any> Un tableau de récompenses
* @throws Error si la récupération des récompenses échoue
* @example const recompenses = await getAllRecompenses();
*/
export async function getAllRecompenses(id_chasse: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/recompenses/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des récompenses');
  }
  return await res.json();
}

/*
* Méthode pour récupérer toutes les avis d'une chasse
* @returns Promise<any> Un tableau d'avis
* @throws Error si la récupération des avis échoue
* @example const avis = await getAllAvis();
*/
export async function getAllAvis(id_chasse: number): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/avis/chasse?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des avis');
  }
  return await res.json();
}