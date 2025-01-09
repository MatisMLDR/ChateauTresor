import Chasse from "@/classes/Chasse";

async function testReadMethod() {
  try {
    const id_chasse = 1;

    const chasse = new Chasse({} as any);

    console.log('Test de lecture de la chasse avec id_chasse =', id_chasse);

    // Appel de la méthode read
    await chasse.read(id_chasse);

    console.log('Données de la chasse après lecture :', {
      id_chasse: chasse.getIdChasse(),
      image: chasse.getImage(),
      titre: chasse.getTitre(),
      description: chasse.getDescription(),
      difficulte: chasse.getDifficulte(),
      prix: chasse.getPrix(),
      date_debut: chasse.getDateDebut(),
      date_fin: chasse.getDateFin(),
      capacite: chasse.getCapacite(),
      age_requis: chasse.getAgeRequis(),
      duree_estime: chasse.getDureeEstime(),
      theme: chasse.getTheme(),
      id_chateau: chasse.getIdChateau(),
      id_equipe: chasse.getIdEquipe(),
      statut: chasse.getStatut(),
      date_modification: chasse.getDateModification(),
    });

    if (chasse.getIdChasse() === id_chasse) {
      console.log('La méthode read a fonctionné correctement.');
    } else {
      console.error('Les données chargées ne correspondent pas à l’id_chasse.');
    }
  } catch (error) {
    console.error('Erreur lors de l’exécution du test :', error.message);
  }
}

// Exécution du test
testReadMethod();