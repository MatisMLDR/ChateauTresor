import Chasse from "@/classes/Chasse";
import { ChasseType, ChateauType, EnigmeType } from "@/types";
import { getAllAvisByChasse } from "@/utils/dao/AvisUtils";
import {
  getChasseById,
  getAllParticipations,
} from "@/utils/dao/ChasseUtils";

// describe("Test API", () => {
//   it("devrait récupérer la chasse d'ID 1 depuis la base de données", async () => {
//     // Récupère les données de la chasse via le DAO
//     const chasseData = await getChasseById(1);
//     // Vérifie que les données existent
//     expect(chasseData).toBeDefined();
//     // Vérifie les propriétés de l'objet chasseData
//     expect(chasseData.id_chasse).toEqual(1);

//   });
// });

// describe("Tests readId()", () => {
//   it("devrait récupérer la chasse d'ID 1 depuis la base de données", async () => {
//     // Récupère les données de la chasse via le DAO

//     const chasse = await Chasse.readId(1);

//     // Vérifie que les données existent
//     expect(chasse).toBeDefined();
//     expect(chasse.id_chasse).toEqual(1);
//   });
//   it("devrait throw une erreur car l'id est inexistant", async () => {
//     // Crée une instance de Chasse sans ID
     
//     // Vérifie que l'appel de la méthode read() lève une erreur
//     await expect(Chasse.readId(19)).rejects.toThrow(Error);
//   });
// });

// describe("Tests create()", () => {
//   it("devrait créer une chasse sans renvoyer une erreur", async () => {
//     // Récupère les données de la chasse via le DAO
//     const chasse = new Chasse({ 
//       id_chasse: 10,
//       titre: "Chasse created",
//       description: "Description de la chasse",
//       date_creation: "01/01/2025",
//       date_debut: "01/01/2025",
//       date_fin: "01/02/2025",
//       prix: 25,
//       difficulte: 3,
//       duree_estime: "2h",
//       age_requis: 12,
//       theme: "Theme de la chasse",
//       image: "image.jpg",
//       capacite: 10,
//       id_chateau: 1,
//       id_equipe: 1,
//      });
    
//     // Vérifie que les données on bien été créées
//     await expect(chasse.create()).resolves.not.toThrow(Error);
//     await expect(Chasse.readId(10)).resolves.toBeDefined();
    
//   });
// });

// describe("Tests delete()", () => {
//   it("Devrait delete la chasse sans renvoyer d'erreurs ", async () => {
//     // Récupère les données de la chasse via le DAO
//     const chasse = await Chasse.readId(1);
//     console.log("Chasse ID : ",chasse.getIdChasse())
//     await chasse.delete();

//     // Vérifie que les données n'existent plus
//     expect(chasse.read()).toThrow('Chasse not found');
//   });
// });

describe("Tests update()", () => {
  it("", async () => {
    // Récupère les données de la chasse via le DAO
    const chasse = await Chasse.readId(1);

    const randomInt = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

    chasse.setTitre(`KIRIKETTE${randomInt}`);
    await chasse.update();

    // Vérifie que les données existent toujours
    const chasse1 = await Chasse.readId(1);
    expect(chasse.getTitre()).toEqual(chasse1.getTitre());
  });
});

describe("Tests getAllAvis() ", () => {
  it("Le", async () => {
    // Récupère les données de la chasse via le DAO
    const chasse = await Chasse.readId(1);

    const avis = await chasse.getAllAvis();
    expect(avis).toBeDefined();
  });
});

