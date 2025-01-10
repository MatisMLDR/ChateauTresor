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
    const chasse = await Chasse.readId(19); // 19

    // Vérifie que l'appel de la méthode read() lève une erreur
    await expect(chasse.read()).toThrow();
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
  it("devrait récupérer la chasse d'ID 1 depuis la base de données", async () => {
    // Récupère les données de la chasse via le DAO
    const chasse = new Chasse({ id_chasse: 1 });
    await chasse.delete();

    // Vérifie que les données n'existent plus
    expect(chasse).toBeUndefined();
  });
});

describe("Tests update()", () => {
  it("", async () => {
    // Récupère les données de la chasse via le DAO
    const chasse = new Chasse({ id_chasse: 1 });
    await chasse.update();

    // Vérifie que les données existent toujours
    expect(chasse).toBeUndefined();
  });
});