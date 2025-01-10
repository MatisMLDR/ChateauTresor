import Chasse from "@/classes/Chasse";
import { ChasseType, ChateauType, EnigmeType } from "@/types";
import {
  getChasseById,
  getAllParticipations,
  getAllRecompenses,
  getAllAvis,
} from "@/utils/dao/ChasseUtils";


// Mock des fonctions DAO
jest.mock("@/utils/dao/ChasseUtils", () => ({
  getChasseById: jest.fn(),
  getAllParticipations: jest.fn(),
  getAllRecompenses: jest.fn(),
  getAllAvis: jest.fn(),
}));

describe("Classe Chasse", () => {
  const mockChateau: ChateauType = {
    id_chateau: 1,
    nom: "Château de Versailles",
    adresse_postale: "Versailles, France",
    localisation: "48.804,2.120",
    capacite: 500,
    prix_location: 1000,
    telephone: null,
    description: "Un château historique.",
    image: "versailles.jpg",
    site_web: null,
    id_proprietaire: null,
  };

  const mockEnigmes: EnigmeType[] = [
    {
      id: 1,
      titre: "Énigme 1",
      qrCode: "QRCode1",
      code: "Code1",
      description: "Description énigme 1",
      endroit_qrcode: "Endroit 1",
      temps_max: 120,
      description_reponse: "Réponse 1",
      image_reponse: "image1.jpg",
      indices: [],
    },
  ];

  const mockChasse: ChasseType = {
    id_chasse: 1,
    image: "chasse.jpg",
    titre: "La Grande Chasse",
    description: "Une chasse au trésor historique.",
    difficulte: 3,
    prix: 50,
    date_debut: "2024-01-01",
    date_fin: "2024-12-31",
    capacite: 50,
    age_requis: 18,
    duree_estime: 120,
    theme: "Aventure",
    id_chateau: 1,
    id_equipe: 2,
    statut: "active",
    date_modification: "2024-01-01T00:00:00Z",
    chateau: mockChateau,
    nb_enigmes: 1,
    enigmes: mockEnigmes,
  };

  let chasse: Chasse;

  beforeEach(() => {
    chasse = new Chasse(mockChasse);
  });

  it("doit s'initialiser correctement", () => {
    expect(chasse.getIdChasse()).toBe(mockChasse.id_chasse);
    expect(chasse.getTitre()).toBe(mockChasse.titre);
  });

  describe("Méthode read()", () => {
    it("doit charger les données correctement avec un id_chasse valide", async () => {
      (getChasseById as jest.Mock).mockResolvedValueOnce([mockChasse]);

      await chasse.read(mockChasse.id_chasse);

      expect(chasse.getTitre()).toBe(mockChasse.titre);
    });

    it("doit lever une erreur si aucune chasse n'est trouvée", async () => {
      (getChasseById as jest.Mock).mockResolvedValueOnce([]);
      await expect(chasse.read(mockChasse.id_chasse)).rejects.toThrow("La chasse n'existe pas");
    });

    it("doit lever une erreur si plusieurs chasses sont trouvées", async () => {
      (getChasseById as jest.Mock).mockResolvedValueOnce([mockChasse, mockChasse]);
      await expect(chasse.read(mockChasse.id_chasse)).rejects.toThrow("Plusieurs chasses trouvées");
    });
  });

  describe("Méthode getDureeMoyenne()", () => {
    it("doit retourner la durée moyenne correcte", async () => {
      const participations = [
        { duree_totale: 100 },
        { duree_totale: 200 },
        { duree_totale: 300 },
      ];
      (getAllParticipations as jest.Mock).mockResolvedValueOnce(participations);

      const result = await chasse.getDureeMoyenne();
      expect(result).toBe(200);
    });

    it("doit retourner 0 s'il n'y a pas de participations", async () => {
      (getAllParticipations as jest.Mock).mockResolvedValueOnce([]);
      const result = await chasse.getDureeMoyenne();
      expect(result).toBe(0);
    });
  });

  describe("Méthode getReussiteMoyenne()", () => {
    it("doit retourner le taux de réussite moyen correct", async () => {
      const participations = [
        { est_terminee: 1 },
        { est_terminee: 0 },
        { est_terminee: 1 },
        { est_terminee: 0 },
      ];
      (getAllParticipations as jest.Mock).mockResolvedValueOnce(participations);

      const result = await chasse.getReussiteMoyenne();
      expect(result).toBe(0.5);
    });

    it("doit retourner 0 s'il n'y a pas de participations", async () => {
      (getAllParticipations as jest.Mock).mockResolvedValueOnce([]);
      const result = await chasse.getReussiteMoyenne();
      expect(result).toBe(0);
    });
  });

  describe("Méthode getScoreMoyen()", () => {
    it("doit retourner le score moyen correct", async () => {
      const participations = [
        { score: 80 },
        { score: 90 },
        { score: 100 },
      ];
      (getAllParticipations as jest.Mock).mockResolvedValueOnce(participations);

      const result = await chasse.getScoreMoyen();
      expect(result).toBeCloseTo(90 * 100);
    });

    it("doit retourner 0 s'il n'y a pas de participations", async () => {
      (getAllParticipations as jest.Mock).mockResolvedValueOnce([]);
      const result = await chasse.getScoreMoyen();
      expect(result).toBe(0);
    });
  });

  describe("Méthode getNoteMoyenne()", () => {
    it("doit retourner la note moyenne correcte", async () => {
      const avis = [
        { note: 4 },
        { note: 5 },
        { note: 3 },
      ];
      (getAllAvis as jest.Mock).mockResolvedValueOnce(avis);

      const result = await chasse.getNoteMoyenne();
      expect(result).toBeCloseTo(4, 2);
    });

    it("doit retourner 0 s'il n'y a pas d'avis", async () => {
      (getAllAvis as jest.Mock).mockResolvedValueOnce([]);
      const result = await chasse.getNoteMoyenne();
      expect(result).toBe(0);
    });
  });
});




describe("Test API", () => {
  it("devrait récupérer la chasse d'ID 1 depuis la base de données", async () => {
    // Récupère les données de la chasse via le DAO
    const chasseData = await getChasseById(1);
    // Vérifie que les données existent
    expect(chasseData).toBeDefined();
    // Vérifie les propriétés de l'objet chasseData
    expect(chasseData.id_chasse).toBe(1);
    expect(chasseData.titre).toEqual("KIRIKOU")
    expect(chasseData.capacite).toBe(300);
    expect(chasseData.description).toEqual("Découvrez le château de Chambord comme vous ne l'avez jamais vu à travers une chasse aux trésors et des énigmes pour éveiller vos sens de détectives !")
    expect(chasseData.age_requis).toBe(16);
    expect(chasseData.image).toEqual("https://www.valdeloire-france.com/app/uploads/202");
    expect(chasseData.date_creation).toBeDefined(); // Pas définie
    expect(chasseData.date_modification).toBeDefined(); // Pas définie
    expect(chasseData.date_debut).toBeDefined(); // Pas définie
    expect(chasseData.date_fin).toBeDefined(); // Pas définie
    expect(chasseData.prix).toBe(8); // Pas définie
    expect(chasseData.difficulte).toBe(1); // Pas définie
    expect(chasseData.duree_estime).toBeDefined(); // Pas définie
    expect(chasseData.theme).toEqual("Dynastie royale")
    expect(chasseData.statut).toEqual("Inactif")
    expect(chasseData.note_moyenne).toBe(0);
    expect(chasseData.recompenses_attribuees).toBe(0);
    expect(chasseData.id_chateau).toBe(318);
    expect(chasseData.id_equipe).toBe(1);


  });
});

describe("Tests read()", () => {
  it("devrait récupérer la chasse d'ID 1 depuis la base de données", async () => {
    // Récupère les données de la chasse via le DAO
    const chasse = new Chasse({ id_chasse: 1 });
    await chasse.read(1);

    // Vérifie que les données existent
    expect(chasse).toBeDefined();
    expect(chasse).toEqual({
      id_chasse: 1,
      titre: "KIRIKOU",
      capacite: 300,
      description: "Découvrez le château de Chambord comme vous ne l'avez jamais vu à travers une chasse aux trésors et des énigmes pour éveiller vos sens de détectives !",
      age_requis: 16,
      image: "https://www.valdeloire-france.com/app/uploads/202",
      date_creation: expect.anything(), // Pas définie
      date_modification: expect.anything(),
      date_debut: expect.anything(),
      date_fin: expect.anything(),
      prix: 8,
      difficulte: 1,
      duree_estime: expect.anything(),
      theme: "Dynastie royale",
      statut: "Inactif",
      note_moyenne: 0,
      recompenses_attribuees: 0, // Pas définie
      all_recompenses_restantes: 0, // Pas définie
      id_chateau: 318,
      id_equipe: 1,
    });
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