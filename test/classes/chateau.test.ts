import Chateau from "@/classes/Chateau"; // Ajustez le chemin d'import
import { getChateauById, createChateau, deleteChateau, updateChateau } from '@/utils/dao/ChateauUtils';
import { ChateauType } from "@/types";

jest.mock('@/utils/dao/ChateauUtils', () => ({
  getChateauById: jest.fn(),
  createChateau: jest.fn(),
  deleteChateau: jest.fn(),
  updateChateau: jest.fn(),
}));

describe('Chateau', () => {
  const mockChateauData: ChateauType = {
    id_chateau: "a29f3988-18b8-47fc-aa7f-44682e83f3c0",
    nom: "Château Mystique",
    adresse_postale: "123 Rue du Château",
    localisation: "France",
    capacite: 100,
    prix_location: 2000.50,
    telephone: "123-456-789",
    description: "Un château magnifique pour vos événements",
    image: "image_url",
    site_web: "https://chateau.com",
    id_proprietaire: "7a735edc-89fa-4fcf-846a-ea9f7d65b8aa"
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize correctly', () => {
    const chateau = new Chateau(mockChateauData);

    expect(chateau.getIdChateau()).toBe(mockChateauData.id_chateau);
    expect(chateau.getNom()).toBe(mockChateauData.nom);
    expect(chateau.getAdressePostale()).toBe(mockChateauData.adresse_postale);
    expect(chateau.getLocalisation()).toBe(mockChateauData.localisation);
    expect(chateau.getCapacite()).toBe(mockChateauData.capacite);
    expect(chateau.getPrixLocation()).toBe(mockChateauData.prix_location);
    expect(chateau.getTelephone()).toBe(mockChateauData.telephone);
    expect(chateau.getDescription()).toBe(mockChateauData.description);
    expect(chateau.getImage()).toBe(mockChateauData.image);
    expect(chateau.getSiteWeb()).toBe(mockChateauData.site_web);
    expect(chateau.getIdProprietaire()).toBe(mockChateauData.id_proprietaire);
  });

  test('readId should fetch and return a new Chateau instance', async () => {
    (getChateauById as jest.Mock).mockResolvedValue(mockChateauData);

    const chateau = await Chateau.readId("a29f3988-18b8-47fc-aa7f-44682e83f3c0");

    expect(getChateauById).toHaveBeenCalledWith("a29f3988-18b8-47fc-aa7f-44682e83f3c0");
    expect(chateau).toBeInstanceOf(Chateau);
    expect(chateau.getNom()).toBe(mockChateauData.nom);
  });

  test('read should fetch and return a new Chateau instance', async () => {
    (getChateauById as jest.Mock).mockResolvedValue(mockChateauData);

    const chateau = new Chateau(mockChateauData);
    const fetchedChateau = await chateau.read();

    expect(getChateauById).toHaveBeenCalledWith(mockChateauData.id_chateau);
    expect(fetchedChateau).toBeInstanceOf(Chateau);
  });

  test('create should call createChateau with correct data', async () => {
    (createChateau as jest.Mock).mockResolvedValue(mockChateauData);

    const chateau = new Chateau(mockChateauData);
    await chateau.create();

    expect(createChateau).toHaveBeenCalledWith(chateau);
  });

  test('deleteId should call deleteChateau with correct id', async () => {
    (deleteChateau as jest.Mock).mockResolvedValue(undefined);

    await Chateau.readId("a29f3988-18b8-47fc-aa7f-44682e83f3c0").then(async (chateau) => {
      await chateau.deleteId(chateau.getIdChateau());
      expect(deleteChateau).toHaveBeenCalledWith(chateau.getIdChateau());
    });
  });

  test('delete should call deleteChateau with instance id', async () => {
    (deleteChateau as jest.Mock).mockResolvedValue(undefined);

    const chateau = new Chateau(mockChateauData);
    await chateau.delete();

    expect(deleteChateau).toHaveBeenCalledWith(mockChateauData.id_chateau);
  });

  test('update should call updateChateau with correct data', async () => {
    (updateChateau as jest.Mock).mockResolvedValue(undefined);

    const chateau = new Chateau(mockChateauData);
    await chateau.update();

    expect(updateChateau).toHaveBeenCalledWith(chateau);
  });

  test('load should fetch data and update instance properties', async () => {
    (getChateauById as jest.Mock).mockResolvedValue({ ...mockChateauData, nom: "Château Mis à Jour" });

    const chateau = new Chateau(mockChateauData);
    await chateau.load();

    expect(getChateauById).toHaveBeenCalledWith(mockChateauData.id_chateau);
    expect(chateau.getNom()).toBe("Château Mis à Jour");
  });

  test('read should throw an error if id_chateau is missing', async () => {
    const chateau = new Chateau({ ...mockChateauData, id_chateau: undefined } as any);

    await expect(chateau.read()).rejects.toThrow('Chateau ID is required');
  });
});
