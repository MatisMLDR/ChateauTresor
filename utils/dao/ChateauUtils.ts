/*
* Méthode pour récupérer toutes les chasses associées à un château
* @returns Promise<any> Un tableau de chasses
* @throws Error si la récupération des chasses échoue
* @example const chasses = await getAllChasses();
*/
export async function getAllChasses(id_chateau: number): Promise<any> {
const res = await fetch(`/api/chasses/chateau?id_chateau=${id_chateau}`);
if (!res.ok) {
    throw new Error('Erreur lors de la récupération des chasses');
}
return await res.json();
}
  
/*
* Méthode pour récupérer les informations d'un château spécifique
* @returns Promise<any> Les données du château
* @throws Error si la récupération des données du château échoue
* @example const chateau = await getChateauDetails();
*/
export async function getChateauDetails(id_chateau: number): Promise<any> {
const res = await fetch(`/api/chateaux/?id_chateau=${id_chateau}`);
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
    const res = await fetch(`/api/chateaux`);
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des châteaux');
    }
    return await res.json();
  }