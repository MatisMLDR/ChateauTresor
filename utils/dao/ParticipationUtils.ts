import { UUID } from 'crypto';

/*
 * Méthode pour récupérer les participations d'un participant par son id
 * @returns Promise<any> Un tableau des participations du participant
 * @throws Error si la récupération échoue
 * @example const participations = await getParticipationsByParticipantId('123e4567-e89b-12d3-a456-426614174000');
 * @params id_participant L'identifiant du participant
 */
export async function getParticipationsByParticipantId(id_participant: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/participant?id_participant=${id_participant}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations');
  }
  return await res.json();
}


/*
 * Méthode pour récupérer les participations d'un participant par son id
 * @returns Promise<any> Un tableau des participations du participant
 * @throws Error si la récupération échoue
 * @example const participations = await getParticipationsByParticipantId('123e4567-e89b-12d3-a456-426614174000');
 * @params id_participant L'identifiant du participant
 */
export async function getParticipationByParticipantIdAndChasseId(id_participant: UUID, id_chasse: UUID): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/?id_participant=${id_participant}&id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations');
  }
  return await res.json();
}


/*
 * Méthode pour récupérer les participations d'un participant par son id
 * @returns Promise<any> Un tableau des participations du participant
 * @throws Error si la récupération échoue
 * @example const participations = await getParticipationsByParticipantId('123e4567-e89b-12d3-a456-426614174000');
 * @params id_participant L'identifiant du participant
 */
export async function getNbParticipationsByChasse(id_chasse: UUID): Promise<number> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/chasse/nbParticipant?id_chasse=${id_chasse}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations');
  }
  const data = await res.json();
  return data.count; // Retourne directement le nombre de participations
}

/*
 * Méthode pour récupérer les participations d'un participant par son id
 * @returns Promise<any> Un tableau des participations du participant
 * @throws Error si la récupération échoue
 * @example const participations = await getParticipationsByParticipantId('123e4567-e89b-12d3-a456-426614174000');
 * @params id_participant L'identifiant du participant
 */
export async function getParticipationsByChasseAndDate(id_chasse: UUID, date: string): Promise<number> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/chasse/date?id_chasse=${id_chasse}&date=${date}`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations');
  }
  const data = await res.json();
  return data.count; // Retourne directement le nombre de participations
}



/*
 * Méthode pour créer une participation
 * @param participation Les données de la participation à créer
 * @returns Promise<any> La participation créée
 * @throws Error si la création échoue
 * @example const nouvelleParticipation = await createParticipation({ id_participant: '123e4567-e89b-12d3-a456-426614174000', id_chasse: '987e6543-e21b-12d3-a456-426614174000', jour: '2023-10-15' });
 */
export async function createParticipation(participation: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/participant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participation),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création de la participation');
  }
  return await res.json();
}

/*
 * Méthode pour mettre à jour une participation
 * @param participation Les données de la participation à mettre à jour (doit inclure id_participant et id_chasse)
 * @returns Promise<any> La participation mise à jour
 * @throws Error si la mise à jour échoue
 * @example const updatedParticipation = await updateParticipation({ id_participant: '123e4567-e89b-12d3-a456-426614174000', id_chasse: '987e6543-e21b-12d3-a456-426614174000', statut: 'confirmé' });
 */
export async function updateParticipation(participation: any): Promise<any> {
  const { id_participant, id_chasse, ...updates } = participation;
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/participant`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_participant, id_chasse, ...updates }),
  });
  if (!res.ok) {
    throw new Error(`Erreur lors de la mise à jour de la participation pour le participant ${id_participant} et la chasse ${id_chasse}`);
  }
  return await res.json();
}

/*
 * Méthode pour supprimer une participation
 * @param id_participant L'identifiant du participant
 * @param id_chasse L'identifiant de la chasse
 * @returns Promise<void>
 * @throws Error si la suppression échoue
 * @example await deleteParticipation('123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-12d3-a456-426614174000');
 */
export async function deleteParticipation(id_participant: UUID, id_chasse: UUID): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/participant?id_participant=${id_participant}&id_chasse=${id_chasse}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression de la participation pour le participant ${id_participant} et la chasse ${id_chasse}`);
  }
}

/**
 * Vérifie si une participation existe déjà pour un participant et une chasse donnés.
 * @param id_participant L'identifiant du participant.
 * @param id_chasse L'identifiant de la chasse.
 * @returns Promise<boolean> True si la participation existe, sinon false.
 */
export async function participationExists(id_participant: UUID, id_chasse: UUID): Promise<boolean> {
  try {
    // Appel à l'API pour vérifier l'existence de la participation
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/existance?id_participant=${id_participant}&id_chasse=${id_chasse}`
    );

    // Si la réponse n'est pas OK, on retourne false
    if (!res.ok) {
      return false;
    }

    // On extrait les données de la réponse
    const data = await res.json();

    // On retourne la valeur de `exists` (true ou false)
    return data.exists;
  } catch (error) {
    // En cas d'erreur (par exemple, réseau ou parsing JSON), on retourne false
    console.error('Erreur dans participationExists :', error);
    return false;
  }
}

/**
 * Met à jour le score d'une participation.
 * @param id_participant L'identifiant du participant.
 * @param id_chasse L'identifiant de la chasse.
 * @param score Le nouveau score à attribuer.
 * @returns Promise<any> La participation mise à jour.
 * @throws Error si la mise à jour échoue.
 * @example await updateParticipationScore('123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-12d3-a456-426614174000', 100);
 */
export async function updateParticipationScore(
  id_participant: UUID,
  id_chasse: UUID,
  score: number
): Promise<any> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/participant`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_participant, id_chasse, score }),
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la mise à jour du score');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur dans updateParticipationScore :', error);
    throw new Error('Une erreur est survenue lors de la mise à jour du score.');
  }
}


/**
 * Met à jour l'attribut `est_terminee` d'une participation.
 * @param id_participant L'identifiant du participant.
 * @param id_chasse L'identifiant de la chasse.
 * @param est_terminee La nouvelle valeur de l'attribut `est_terminee`.
 * @returns Promise<any> La participation mise à jour.
 * @throws Error si la mise à jour échoue.
 * @example await updateParticipationEstTerminee('123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-12d3-a456-426614174000', true);
 */
export async function updateParticipationEstTerminee(
  id_participant: UUID,
  id_chasse: UUID,
  est_terminee: boolean
): Promise<any> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/participant`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_participant, id_chasse, est_terminee }),
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la mise à jour de est_terminee');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur dans updateParticipationEstTerminee :', error);
    throw new Error('Une erreur est survenue lors de la mise à jour de est_terminee.');
  }
}

/**
 * Met à jour l'attribut `nb_enigmes_resolues` d'une participation.
 * @param id_participant L'identifiant du participant.
 * @param id_chasse L'identifiant de la chasse.
 * @param nb_enigmes_resolues Le nouveau nombre d'énigmes résolues.
 * @returns Promise<any> La participation mise à jour.
 * @throws Error si la mise à jour échoue.
 * @example await updateParticipationNbEnigmesResolues('123e4567-e89b-12d3-a456-426614174000', '987e6543-e21b-12d3-a456-426614174000', 5);
 */
export async function updateParticipationNbEnigmesResolues(
  id_participant: UUID,
  id_chasse: UUID,
  nb_enigmes_resolues: number
): Promise<any> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations/participant`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_participant, id_chasse, nb_enigmes_resolues }),
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la mise à jour de nb_enigmes_resolues');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur dans updateParticipationNbEnigmesResolues :', error);
    throw new Error('Une erreur est survenue lors de la mise à jour de nb_enigmes_resolues.');
  }
}

export async function getAllParticipations(): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/participations`);

  if (res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des participations');
  }
  return await res.json();
}

export async function getNbParticipations(): Promise<any> {
  const allParticipations = await getAllParticipations();

  return allParticipations.length;
}


