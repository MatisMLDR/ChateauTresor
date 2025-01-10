import Chasse from "@/classes/Chasse";
import { ChasseType, ChateauType, EnigmeType } from "@/types";
import { getAllAvisByChasse } from "@/utils/dao/AvisUtils";
import {
  getChasseById,
  getAllParticipations,
} from "@/utils/dao/ChasseUtils";

describe("Test API", () => {
  it("devrait récupérer la chasse d'ID 1 depuis la base de données", async () => {
    // Récupère les données de la chasse via le DAO
    const chasseData = await getChasseById(1);
    // Vérifie que les données existent
    expect(chasseData).toBeDefined();
    // Vérifie les propriétés de l'objet chasseData
    expect(chasseData.id_chasse).toEqual(1);

  });
});

describe("Tests read()", () => {
  it("devrait récupérer la chasse d'ID 1 depuis la base de données", async () => {
    // Récupère les données de la chasse via le DAO

    const chasse = await Chasse.readId(1);

    // Vérifie que les données existent
    expect(chasse).toBeDefined();
    expect(chasse.id_chasse).toEqual(1);
  });
  it("devrait throw une erreur car l'id est inexistant", async () => {
    // Crée une instance de Chasse sans ID
     
    // Vérifie que l'appel de la méthode read() lève une erreur
    await expect(Chasse.readId(19)).rejects.toThrow(Error);
  });
});

describe("Tests create()", () => {
  it("devrait récupérer la chasse d'ID 1 depuis la base de données", async () => {
    // Récupère les données de la chasse via le DAO
    const chasse = new Chasse({ id_chasse: 1 });
    await chasse.load();
    await chasse.create();
    
    // Vérifie que les données existent
    expect(chasse).toBeDefined();
    // Vérifie les propriétés de l'objet chasse
    
  });
});

describe("Tests delete()", () => {
  it("", async () => {
    // Récupère les données de la chasse via le DAO
    const chasse = await Chasse.readId(1);
    console.log("Chasse ID : ",chasse.getIdChasse())
    await chasse.delete();

    // Vérifie que les données n'existent plus
    expect(chasse.read()).toThrow('Chasse not found');
  });
});

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